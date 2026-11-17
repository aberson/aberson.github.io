# Portfolio website — master plan

## 1. Source

Reconciles the [original site plan](../archived-plans/plan.md) and
[Work refresh](../archived-plans/documentation/portfolio-refresh-plan.md).
Both originals retain operator work and are archived rather than marked completed.

## 2. Vision

Show Abraham Robison's work to hiring managers and recruiters through a fast,
accessible static portfolio at https://aberson.github.io. No selling, accounts,
database or backend. Free GitHub subdomain remains the selected deployment.

## 3. Principles

Honest source-backed claims, visible GitHub/LinkedIn links, mobile readability,
semantic markup, keyboard access, automatic light/dark and WCAG AA contrast.
No invented career metrics. Private repository names render without broken links.
Commit generated portfolio data only after reviewing the producer's export.

## 4. Glossary

Hub = `/`; case study = `/work/<slug>/` for a featured Markdown body. Registry =
workspace `.claude/observatory/registry.toml`, the owner of public portfolio fields.
UAT = attended user acceptance. Tokens = this site's vendored visual variables.

## 5. How to read this plan

The shipped five-group Work refresh is the current spine. Old six-card mockups,
identity placeholders and placeholder-résumé instructions are historical. Full
historical schemas, criteria, receipts and decision IDs remain in the originals.
Outstanding units below are the execution queue; no old DONE phase is reopened.

## 6. Execution mode

M2/M4 are operator checks. M3 is an optional operator-only infrastructure decision;
its formerly embedded code changes are now M3A. No domain purchase, analytics
subscription, account-setting change or production deployment is authorized by
this documentation cleanup. Use the normal isolated build/review flow for M3A
if selected. An elapsed DNS/certificate wait is separate from active labor.

## 7. Track structure

Delivered original site (1–6, M1), delivered Work refresh (7–12), remaining
account security and human visual acceptance. Domain/analytics remain optional.

## 8. Decision graph

6 → M1 (done) → M2. 7–12 → M4. Operator elects optional domain → M3
(selection/account/DNS readiness) → M3A (reviewed site configuration) → M3
(final DNS/HTTPS acceptance). M3 is one operator checklist with a documented
pause for the code handoff, not an automated cycle in a build queue.

## 9. Baseline

Inspected HEAD `c10f683e4e671faf255b2b0da5e0ce6c5ac29c39` on 2026-10-14.
CLAUDE.md records original Steps1–6/M1 and refresh Steps7–12 shipped/deployed.
That later record supersedes the refresh plan's old local-only deployment handoff.
This is repository evidence, not a new live-site verification. Commit `48c8e95`
refreshes the real career-ops résumé PDF; its old placeholder task is fulfilled.

Current stack: Astro7, TypeScript, Tailwind4 via `@tailwindcss/vite`, static GitHub
Pages with Actions, Node>=22.12 (CI24). Root base `/`. No API routes or data store.
`src/data/portfolio.ts` Zod-validates generated `portfolio.json` version1:
`generated_at`, `projects[]` with `slug,name,group,tag,blurb,card,proofs,relates,
try_it,repo_url,live_url,contribution,stats`. `group` is flagship/utility/fun/
professional/third-party. Card, repo/live URLs and contribution may be null;
`relates` has slug/clause; stats has gap/tests/last_commit_days. See the actual
schema for field bounds. Count pins are 3/13/6/3/2. Invalid input fails the build.

Flagship cards, Utility and Third-party tables, Fun/Professional grids form Work;
the three-beat tools narrative follows. Featured case-study bodies remain local
Markdown. void_furnace_calc belongs inside void-furnace's story, not its own
flagship card. About and lower sections keep their established content. Real
identity lives in `src/consts.ts`; real résumé is `public/resume.pdf`. Brand source
is self-contained in `brand/`; `scripts/sync-brand.ps1` vendors compiled assets.

## 10. Build and acceptance steps

### Step 1: Scaffold Astro + wire brand tokens + local preview

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 2: Site chrome — header, footer, hero, social links

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 3: Projects content collection + card grid

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 4: Case-study subpage template + seed 1–2 studies

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 5: Resume + contact + accessibility, links & SEO pass

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 6: Deploy workflow + Dependabot + content runbook (domain-ready)

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 7: portfolio.json contract + ingestion

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 8: Work section restructure

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 9: "How it all fits together" rewrite

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 10: Proposal brand tokens on the site

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 11: Deploy x-marks-the-spot to GitHub Pages

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step 12: Gates, deploy, live verification

**Status:** DONE
**Type:** code

Historical completion is recorded in the archived source and the later project status.

### Step M1: Original Pages launch

**Status:** DONE
**Type:** operator
**Issue:** #7

The original plan's later launch receipt and CLAUDE.md record acceptance.

### Step M2: Account-security checklist

**Status:** TODO
**Type:** operator
**Issue:** #8
**Depends on:** M1
**Produces:** Nonsecret acceptance record.
**Done when:** GitHub authenticator/passkey 2FA is enabled, Pages Enforce HTTPS is checked, Dependabot alerts are enabled, and repository history has been inspected for exposed credentials with any findings resolved.

Use account and repository settings for the three settings checks. Review secret
scan findings privately; record only the verdict and remediation reference, never
credential values. This static site should contain no API secrets. The source
grep was only a heuristic, not proof that a clean output guarantees no secrets.

### Step M3: Optional domain and analytics selection / acceptance

**Status:** DEFERRED
**Type:** operator
**Issue:** #9
**Condition:** The operator elects a custom domain and explicitly selects any analytics service.
**Produces:** Chosen domain, desired analytics behavior and an acceptance record.
**Done when:** The selected domain serves the site over HTTPS, registrar 2FA and transfer lock are on, DNSSEC is enabled if supported, and any selected analytics records the intended visits under the operator's chosen privacy requirements.

Choose a name-based .com/.dev (original preference avoids .io); verify current
price and current GitHub Pages DNS instructions at execution. Buy/configure the
domain and account protections; hand the selected name to M3A, then finish the
live DNS/HTTPS checks. GoatCounter and Cloudflare Web Analytics were candidate
services, not a settled choice. A cookieless product alone does not settle all
consent/privacy requirements. No analytics is also a valid choice.

### Step M3A: Optional domain / analytics site configuration

**Status:** DEFERRED
**Type:** code
**Issue:** #9 (code slice of original M3)
**Condition:** M3 has selected and prepared a domain, and any analytics integration is specified.
**Produces:** Reviewed `public/CNAME`, `astro.config.mjs` site value, and optional selected analytics integration.
**Done when:** The production build, type checks, formatting and link checks pass for the chosen site URL; a local production preview loads the hub, a case study and résumé with no base-path regressions; the separately authorized deployment has a recorded successful outcome for M3's operator acceptance.

Preserve base `/`, canonical/sitemap URLs, existing brand and public content.
Keep account/DNS actions in M3. Deploy only under the normal explicit publishing
authority; retain the prior site configuration as the rollback reference.

### Step M4: Human visual acceptance of the refresh

**Status:** TODO
**Type:** operator
**Issue:** #29
**Depends on:** 12
**Produces:** UAT verdict and wording/visual redlines.
**Done when:** The operator signs off all five Work groups, both OS-selected themes, the Utility table at mobile width, the x-marks-the-spot Live link, case-study pages under the palette, and the story fit of How it all fits together.

Open https://aberson.github.io, toggle OS theme and inspect a phone-width viewport.
Do not equate passing build checks with human story/visual acceptance.

## 11. Quickstart and quality gates

From the repository root: `npm ci`, `npm run dev` (4321),
`npm run check`, `npm run lint`, `npm run build`, then `npm run preview`.
`npm run check:links` and `npm run check:a11y` are the existing acceptance tools;
use their declared server setup in package.json. Deploy workflow gates type/content,
formatting, unresolved source placeholders, production build and link integrity.
Push to main publishes automatically, so local checks do not require a push.
For content changes follow [CONTENT.md](../../CONTENT.md); never hand-edit
`src/data/portfolio.json`. The Observatory owns export production, this site its
validation and rendering. No new producer write is part of this cleanup.

## 12. Estimates

[Build estimates](build-estimates.md) cover only four remaining units, including
the separated optional code slice. These are forward subjective ranges, not
historical durations. Disabled optional rows do not imply authority to execute.

## 13. Deferred scope and risks

Custom domain/analytics remain unselected. Palette primitive/diagram reskin is a
future follow-up only if such diagrams become relevant. Preserve schema validation,
group-count pins, source-reviewed public/private URL gates, no invented third-party
contribution claims and dual-theme checks. Stale generated data must be regenerated
through its producer, never patched to bypass validation. Original scope excludes
CMS, blog engine, accounts, payments and backend services.

## 14. Tracking and decisions

Original issue IDs remain unchanged; none closed by this cleanup. Historical
root P1–P6/D1–D10 and portfolio companion P8–P10/D1/D5/D6/D8/D9/D10/D11/D13/D15
retain their source-local meanings. The two preexisting D spaces are explicitly
namespaced `site-original:` and `portfolio-companion:`; no original ID is renumbered.

DOC-P1 (operator): canonical docs master and exact archives. DOC-D1 (agent):
shipped Work refresh is the current spine. DOC-D2 (agent): split original optional
M3 code from the operator checklist without changing the issue or electing the option.
Proposal: [master-plan-proposal.html](../plan-reconciliation/master-plan-proposal.html).
Source hash receipts: [migration.json](../plan-reconciliation/migration.json).

## 15. Plan history

2026-10-14: merged both plans, retained pending M2/M3/M4, separated M3A, credited
later deployment and real-résumé evidence, and preserved exact historical sources.
No deployment, security/account action or manual acceptance was performed.


### Cleanup decision additions

DOC-P2 (operator-picked: preserve shared Toolkit authority for mapped work.)
