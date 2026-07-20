// scripts/a11y-check.mjs
// Automated accessibility gate. Runs axe-core (via Playwright/Chromium) over the
// hub (/) and one case-study page (/work/alpha4gate/), and exits NONZERO on any
// 'serious' or 'critical' violation (threshold: 0 serious + 0 critical). Moderate
// and minor findings are printed for visibility but do not fail the gate.
//
// PREREQUISITE: the site must be BUILT first (`npm run build`). By default this
// script spawns `astro preview` itself, waits for it, checks both pages, then
// tears the server down. To point at an already-running server instead, set
// A11Y_BASE_URL (e.g. A11Y_BASE_URL=http://localhost:4321) and no server is
// spawned.
//
// Requires devDeps: playwright (+ `npx playwright install chromium`) and
// @axe-core/playwright. Run: `npm run check:a11y`.

import { spawn, spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.A11Y_BASE_URL ?? "http://localhost:4321";
const PATHS = ["/", "/work/alpha4gate/"];
const FAIL_IMPACTS = new Set(["serious", "critical"]);
const manageServer = !process.env.A11Y_BASE_URL;
const root = new URL("..", import.meta.url);

if (!existsSync(new URL("dist/index.html", root))) {
  console.error("a11y: dist/ not found - run `npm run build` first.");
  process.exit(2);
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not up yet; keep polling
    }
    await sleep(300);
  }
  throw new Error(`server not ready at ${url} within ${timeoutMs}ms`);
}

function killTree(child) {
  if (!child || child.exitCode !== null || child.pid == null) return;
  if (process.platform === "win32") {
    // spawnSync (blocking) so the whole process tree is gone BEFORE process.exit —
    // an async kill races the exit and can strand the preview server on its port.
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

async function run() {
  const browser = await chromium.launch();
  // @axe-core/playwright requires a page created from an explicit context.
  const context = await browser.newContext();
  const page = await context.newPage();
  let totalSerious = 0;
  let totalCritical = 0;

  for (const p of PATHS) {
    const url = BASE + p;
    // Fail loud on a non-OK load: Playwright's page.goto does NOT throw on a
    // 404/500, so without this a drifted PATHS entry would axe-scan a not-found
    // page, find 0 violations, and print PASS (a false green). Refuse to scan
    // anything that didn't load as itself, and assert the expected <h1> marker so
    // a soft-404 (200 body, wrong page) is caught too.
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      const status = response ? response.status() : "no response";
      console.error(
        `a11y: FAIL-LOUD - ${url} did not load OK (status ${status}); ` +
          `refusing to axe-scan a broken page.`,
      );
      await browser.close();
      return 2;
    }
    const h1Count = await page.locator("h1").count();
    if (h1Count < 1) {
      console.error(
        `a11y: FAIL-LOUD - ${url} loaded 200 but has no <h1> ` +
          `(unexpected page content); refusing to axe-scan.`,
      );
      await browser.close();
      return 2;
    }
    const results = await new AxeBuilder({ page }).analyze();
    const blockers = results.violations.filter((v) =>
      FAIL_IMPACTS.has(v.impact),
    );
    const serious = blockers.filter((v) => v.impact === "serious").length;
    const critical = blockers.filter((v) => v.impact === "critical").length;
    totalSerious += serious;
    totalCritical += critical;

    console.log(`\n${url}`);
    console.log(
      `  serious=${serious} critical=${critical} ` +
        `(total violations at all impacts: ${results.violations.length})`,
    );
    for (const v of blockers) {
      console.log(
        `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`,
      );
      for (const n of v.nodes) {
        console.log(`      ${n.target.join(" ")}`);
      }
    }
  }

  await browser.close();
  const fail = totalSerious + totalCritical > 0;
  console.log(
    `\na11y summary: serious=${totalSerious} critical=${totalCritical} ` +
      `across ${PATHS.length} page(s) -> ${fail ? "FAIL" : "PASS"}`,
  );
  return fail ? 1 : 0;
}

let server;
let code = 1;
try {
  if (manageServer) {
    // Spawn `astro preview` via this Node executable directly (not `npm run`):
    // resolving the astro CLI entry avoids the Windows `.cmd`-spawn EINVAL and the
    // shell:true DEP0190 warning, and starts the exact same static preview server.
    const astroBin = fileURLToPath(
      new URL("node_modules/astro/bin/astro.mjs", root),
    );
    server = spawn(process.execPath, [astroBin, "preview"], {
      cwd: root,
      stdio: "ignore",
      detached: process.platform !== "win32",
    });
    await waitForServer(`${BASE}/`);
  }
  code = await run();
} catch (err) {
  console.error("a11y: error -", err.message);
  code = 2;
} finally {
  if (manageServer) killTree(server);
}
process.exit(code);
