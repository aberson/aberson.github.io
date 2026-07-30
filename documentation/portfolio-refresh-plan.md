# Work Section Refresh, Observatory-Fed — aberson.github.io feature plan

- **Status:** PLANNED (authored 2026-07-28)
- **Companion plan (producer half):** `dev/dev-observatory/plans/portfolio-pages-plan.md` — defines the `portfolio.json` contract (its §5d) and authors the content. Its Steps 19–28 must land before Step 8 here.
- **Recon evidence:** `dev/docs/investigations/portfolio-consistency/recon-2026-07-28.json`.
- **Master plan:** `plan.md` (repo root) reserves Steps 1–6 and M1–M3. This feature continues at **Step 7** / **M4**.
- **Working directory:** all steps operate in the `aberson.github.io` repo EXCEPT Step 11, which operates in `c:\Users\abero\dev\x-marks-the-spot` (announced per the workspace working-directory rule).

## 1. What This Feature Does

Restructures the site's Work section into the operator's new categorization — Flagship full cards, a Utility table, separate Fun and Professional card sections, a two-row 3rd-party contributions table, non-active hidden — with all card/table content flowing from a generated `src/data/portfolio.json` that dev-observatory exports (dev-observatory becomes the single place project descriptions are edited). Rewrites "How it all fits together" around Flagship → Utilities → the range beyond, focused on the tools. Adopts the utility-project-proposal branding (warm cream/gold, auto light/dark). Also deploys x-marks-the-spot's static export to GitHub Pages so its "open the website" showcase and Live link are real. Trigger: the site and the observatory currently tell diverging stories from independently hand-edited content.

**Proposal:** https://claude.ai/code/artifact/9df8e138-bfb3-4024-b2e7-0da2aa17b0dc (v2, redlined 2026-07-28 — one coordinated proposal covering both plans)

## 2. Existing Context

- Astro ^7.1.1 + TypeScript, Tailwind v4 via `@tailwindcss/vite`, content collections (glob loader + Zod — the TypeScript schema-validation library — in `src/content.config.ts`). Fully static; GH Pages user site; deploy workflow `.github/workflows/deploy.yml` runs gates BEFORE build (astro check → prettier --check → no-TODO grep → build → linkinator, the dead-link checker) on push to main.
- Work section: `src/pages/index.astro` → `ProjectGrid.astro` reads `getCollection('projects')` (10 markdown files in `src/content/projects/`, frontmatter feeds `ProjectCard.astro`, body = case study, `hidden` flag, sorted by `order`). ONE flat grid today — no sub-grouping. Featured projects get `/work/[slug]` case-study routes.
- Current grid: Alpha4Gate (1, featured), void-furnace (2, featured), skill-mesh (3), switchboard (4), measure-twice (5), citation-needed (6). void_furnace_calc is not on the site.
- "How it all fits together" = hardcoded `LOOPS` array in `src/components/EcosystemSection.astro` (4 loops: skill-mesh pipeline / dev-observatory watcher / honesty instruments / career-ops). About and below: `AboutSection.astro`, `WritingSection.astro`, etc.
- No build-time JSON is consumed today, but `.astro` frontmatter already imports TS data modules (`src/consts.ts` pattern) — a `src/data/` import is the documented lowest-friction injection path. No `src/data/` dir exists yet.
- Brand: vendored tokens, forced light mode via `BaseLayout.astro`.

## 3. Scope

**In:** `portfolio.json` ingestion with fail-loud Zod validation; Work section restructure into the five groupings; content-collection cleanup (demote switchboard/measure-twice/citation-needed cards to the Utility table; fold void_furnace_calc into void-furnace's card/case study — no card of its own, redline D11); "How it all fits together" rewrite; proposal brand tokens + auto light/dark; x-marks-the-spot Pages deploy; CI-green live deploy with byte-level verification.

**Out:** Hero/About/Writing/Resume/Contact sections (unchanged, per operator); new case-study bodies (existing ones stay; void_furnace_calc gets neither card nor case study — referenced from void-furnace's); any automation of the export→commit loop; observatory-side work (companion plan); career-ops as a Work item (it exits the Work narrative; may be referenced under About/Resume only).

**Autonomous-behavior trigger does not fire:** everything here is build-time static generation and one CI pipeline; nothing runs unattended.

## 4. Impact Analysis

| File | Change Type | Reason | Verified |
|---|---|---|---|
| `src/data/portfolio.json` | create (generated) | the observatory-exported content contract | schema frozen in companion plan §5d |
| `src/data/portfolio.ts` | create | Zod parse of the JSON, fail-loud at build; typed accessors by group | pattern matches existing `consts.ts` TS-module imports (recon) |
| `src/components/ProjectGrid.astro` | refactor | becomes the five-group Work layout (or is replaced by a WorkSection component composing per-group subcomponents) | recon: sole Work-grid renderer, called from `index.astro` |
| `src/components/ProjectCard.astro` | modify | accept portfolio-fed props (tag chip, try-it snippet, Live link) alongside collection-fed flagship cards | recon: single card component |
| `src/content/projects/*.md` | modify | switchboard/measure-twice/citation-needed marked `hidden` (content now table rows); void-furnace card/case-study text updated to reference void_furnace_calc (redline D11 — no new card) | recon: 10 files, `hidden` flag exists in schema |
| `src/content.config.ts` | extend | any new frontmatter fields for flagship cards | recon: Zod schema location |
| `src/components/EcosystemSection.astro` | rewrite | new LOOPS narrative (Flagship → Utilities → range); career-ops loop removed | recon: LOOPS array is the sole source |
| `src/pages/index.astro` | modify | section wiring for the restructured Work block | recon lines 22–31 |
| `brand/{tokens.json,modes.dark.json}` + `src/assets/` tokens + `BaseLayout.astro` | modify | proposal palette, auto light/dark (forced light removed) | CLAUDE.md: site owns its brand source; `onbrand build .` + `scripts/sync-brand.ps1` re-vendor |
| `CONTENT.md` | modify | runbook: descriptions are edited in the observatory registry, exported, committed — never hand-edit `portfolio.json` | recon: existing content runbook |
| `plan.md` | modify | pointer to this feature plan in §11 | root canonical plan |
| (other repo) `x-marks-the-spot`: Pages workflow + export commit | create | deploy the static dossier site | recon: Pages 404s today, `site/` gitignored local-only, no CNAME/gh-pages |

## 5. New Components

- **`src/data/portfolio.ts`** — imports `portfolio.json`, validates with Zod against the companion §5d schema (build FAILS on drift — this is the consumer-side contract gate), exposes `byGroup()` helpers.
- **Work section layout** (five blocks in order):
  1. **Flagship** — full cards: Alpha4Gate, void-furnace (featured w/ existing case studies), skill-mesh. void_furnace_calc gets NO card of its own (redline D11, 2026-07-28): void-furnace's card text and case study point to it as the factory's product. Card text = `card` field from portfolio.json.
  2. **Utility** — table `Category | Name | Description` (13 rows: tripwire, paper-trail, changed-check, heads-up, find-again, same-page, mesh-lens, b2_project_goblin, citation-needed, dev-observatory, measure-twice, on-brand, switchboard), Category = `tag`, Description = `blurb` (proposal-doc grammar; b2_project_goblin replaces the proposal's "Goblin Sweep", tag Hygiene). Name links to repo; Live link when `live_url` present.
  3. **Fun** — Build-Portfolio-style card grid (tag chip → name → one-line blurb): brickomancer, coding_without_pants, shake_spear, toybox, walkies, x-marks-the-spot (with Live link after Step 11).
  4. **Professional** — same card style, separate section: always-best-estimates, applied_learning, pta_finance.
  5. **Third-party (agora, tinstar)** — simple two-row table `Project | Description`, each row linking the UPSTREAM repo (G-R-A-V-I-T-Y/agora, except-pass/tinstar). tinstar's description includes the operator's contribution sentence (from `contribution`); agora's stays neutral until a contribution lands (redline D15, 2026-07-28).
  Non-active/hidden projects never appear (already excluded at export).
- **"How it all fits together" rewrite** — three beats focused on the tools: (1) Flagship: the proof systems (Alpha4Gate, void_furnace + its calc target, skill-mesh as the pipeline that built them); (2) Utilities: the leverage layer — 13 small sharp tools that keep the flagships honest, fast, and observable (dev-observatory as the watcher, measure-twice/switchboard/citation-needed as the honesty instruments, the seven new one-shot utilities as the working discipline made executable); (3) the range beyond: fun and professional projects built with the same pipeline. Career-ops loop removed from this section.
- **Brand tokens** — the five-var cream/gold palette (light/dark): `--bg #f6f2e8/#1d1b17`, `--ink #27241f/#eee7d6`, `--card #fffdf7/#28251f`, `--line #c9b98f/#665b40`, `--accent #765b18/#e0bd62`; `color-scheme: light dark`, auto dark via `prefers-color-scheme`, print unchanged. Mapped into the Tailwind v4 token layer the site already vendors.

## 6. Design Decisions

(Labels DD* below are internal to this section; the canonical redline IDs are the P*/D* rows in §10 — operator feedback references those.)

- **DD1 — Hybrid content model.** Grid/table/one-liner content comes from `portfolio.json` (observatory-owned); flagship case-study BODIES stay as site-local markdown (long-form prose doesn't belong in a registry). Flagship card paragraphs come from the JSON `card` field so even flagship descriptions have one edit surface.
- **DD2 — Committed generated file over fetch/prebuild-script.** The JSON is committed by the export step in the producer repo flow; the site build only validates and renders. Keeps CI hermetic and the human review gate intact.
- **DD3 — Fun and Professional are two separate headed sections** (operator-picked 2026-07-28) sharing one card component.
- **DD4 — 3rd-party table lists only agora + tinstar** (operator-picked); career-ops and TripoSR are excluded from the site entirely. Redline D15 (2026-07-28): rows link the upstream repos; agora's description is neutral (no operator contribution yet).
- **DD5 — Fail-loud contract gate at build.** Zod parse of `portfolio.json` throws at build time on schema drift; CI's astro-check/build gates make producer-consumer drift a red X, not a silently stale page (per the workspace wire-shape rule).
- **DD6 — x-marks-the-spot deploys from its own repo** by publishing the existing deterministic `site/` export to a `gh-pages` branch (Pages source = branch; no CI build, no data dependencies), because the Live link belongs to that project, not this site. Re-publish after any future export is a documented one-liner.
- **DD7 — Auto light/dark adopted** (proposal behavior); forced light removed. The existing case-study pages inherit the palette via tokens — Step 10's done-when includes a case-study render check.

## 7. Build Steps

<!-- autofix-applied: 2026-07-28 -->
### Step 7: portfolio.json contract + ingestion
- **Problem:** Create `src/data/portfolio.ts` implementing the companion-plan §5d schema in Zod (version, generated_at, projects[] with slug/name/group/tag/blurb/card/proofs/relates/try_it/repo_url/live_url/contribution/stats), fail-loud on parse, `byGroup()` accessors; commit a hand-written sample `portfolio.json` matching the schema (marked as sample) so the site builds before the real export lands.
- **Type:** code
- **Issue:** #23
- **Flags:** --reviewers deep
- **Produces:** `src/data/portfolio.ts`, sample `src/data/portfolio.json`
- **Done when:** `npm run build` (astro build) passes with the sample; corrupting a field provably fails the build
- **Depends on:** none
- **Status:** DONE (2026-07-30) — used the REAL observatory export as the committed generated `portfolio.json` (producer companion Steps 26+28 done), not a throwaway sample. Zod §5d schema + fail-loud `.parse()` + `byGroup()` in `portfolio.ts`; astro check 0 errors; corrupt-field build proven red (ZodError). Deep review PASS.

### Step 8: Work section restructure
- **Problem:** Rebuild the Work section per §5: Flagship full cards (Alpha4Gate, void-furnace, skill-mesh — NO void_furnace_calc card; void-furnace's card/case study reference it per redline D11; keep featured case-study links), Utility table, Fun section, Professional section, Third-party table; hide switchboard/measure-twice/citation-needed collection cards (`hidden: true` — content now flows from the JSON); all non-flagship content read from `portfolio.ts`; table/card Names render as plain text (no link) when `repo_url` is null (private repos — the companion `repo_public` gate exports null for them). Preserve semantics (list roles, heading hierarchy) and the existing responsive behavior.
- **Type:** code
- **Issue:** #24
- **Flags:** --reviewers code --ui
- **Start-cmd:** npm run dev
- **URL:** http://localhost:4321
- **Produces:** refactored `ProjectGrid.astro` (or WorkSection + subcomponents), `ProjectCard.astro` updates, content-collection edits
- **Done when:** local build renders all five blocks with the REAL exported `portfolio.json` (companion Steps 26+28 done) and zero astro-check/prettier findings
- **Depends on:** 7; companion plan Steps 26+28

### Step 9: "How it all fits together" rewrite
- **Problem:** Replace the `LOOPS` array in `EcosystemSection.astro` with the three-beat tools narrative (§5), written in the house voice; remove the career-ops loop; leave About and everything below untouched.
- **Type:** code
- **Issue:** #25
- **Flags:** --reviewers code --ui
- **Start-cmd:** npm run dev
- **URL:** http://localhost:4321
- **Produces:** rewritten `EcosystemSection.astro`
- **Done when:** section renders the new narrative; grep confirms career-ops no longer referenced in the Work/Ecosystem components; About+below diffs are empty
- **Depends on:** 8

### Step 10: Proposal brand tokens on the site
- **Problem:** Update the site's own `brand/{tokens.json,modes.dark.json}` to the five-var cream/gold palette (per CLAUDE.md the site is self-contained: `onbrand build .` then `scripts/sync-brand.ps1` re-vendors `src/assets/`); wire `color-scheme: light dark` with auto dark, remove forced light in `BaseLayout.astro`; verify tag chips/cards/tables in the new Work section and the existing case-study pages render correctly in both modes.
- **Type:** code
- **Issue:** #26
- **Flags:** --reviewers code --ui
- **Start-cmd:** npm run dev
- **URL:** http://localhost:4321
- **Produces:** token css + BaseLayout changes
- **Done when:** build green; homepage + one case-study page visually verified in light and dark (headless screenshot or operator glance at M4)
- **Depends on:** 8

<!-- autofix-applied: 2026-07-28 -->
### Step 11: Deploy x-marks-the-spot to GitHub Pages
- **Problem:** IN `c:\Users\abero\dev\x-marks-the-spot` (working-directory switch — verify `git -C` target before any commit): make the static dossier export publicly served via GitHub Pages by publishing the existing local `site/` export to a `gh-pages` branch and setting Pages source to that branch (no CI build, no data dependencies; document the one-liner re-publish command in the xmarks README). Record the resulting URL in the observatory registry as x-marks-the-spot's `live_url` and regenerate `portfolio.json`.
- **Type:** code
- **Issue:** #27
- **Flags:** --reviewers deep
- **Produces:** published `gh-pages` branch in x-marks-the-spot + README re-publish one-liner; updated registry `live_url`; regenerated `src/data/portfolio.json`
- **Done when:** the Pages URL serves the dossier site (live bytes verified); the site's x-marks-the-spot card shows a working Live link
- **Depends on:** 7 (schema), companion Step 26 (regen path)

### Step 12: Gates, deploy, live verification
- **Problem:** Run the repo's own gates locally (astro check, prettier --check, no-TODO grep, build, linkinator), push to main, watch the deploy workflow to green, and verify live bytes at https://aberson.github.io show the new Work section (per the pushed-is-not-deployed rule). Update `CONTENT.md` with the new content flow (edit in observatory registry → `observatory export --portfolio` → review diff → commit; never hand-edit the JSON) and add a `plan.md` §11 pointer to this plan.
- **Type:** code
- **Issue:** #28
- **Flags:** --reviewers code
- **Produces:** green deploy; docs updates
- **Done when:** live site serves the restructured Work section; linkinator green (incl. the new xmarks Live link)
- **Depends on:** 9, 10, 11

### Step M4: Operator visual UAT
- **Problem:** Operator loads the live site: checks all five Work blocks, both themes (OS toggle), the utility table on mobile width, the xmarks Live link, case-study pages under the new palette, and reads the new "How it all fits together" for story fit.
- **Type:** operator
- **Issue:** #29
- **Produces:** UAT verdict; redlines for wording/visuals
- **Done when:** operator signs off
- **Depends on:** 12

## 8. Risks and Open Questions

| Item | Risk | Mitigation |
|---|---|---|
| Palette swap regressions | Cream/gold tokens clash with existing components/case studies | Tokens-only change (components read vars); Step 10 dual-mode render check; M4 visual pass |
| Schema drift across repos | Producer and consumer implement §5d differently | Frozen schema text in the producer plan; consumer-side Zod gate fails the build loudly (D5) |
| Stale portfolio.json | Site content lags registry edits | `generated_at` rendered in a footer comment; CONTENT.md runbook; do-not-hand-edit marker |
| Private repo links | Utility-table links 404 for visitors and fail the linkinator gate | Companion `repo_public` gate exports `repo_url: null` for private repos; Step 8 renders linkless names (verified 2026-07-28: tripwire, b2_project_goblin, coding-root PRIVATE; skill-mesh, citation-needed, measure-twice PUBLIC) |
| Generated JSON vs no-TODO gate | `src/data/portfolio.json` is scanned by deploy.yml's `TODO:` grep | Intentional: a placeholder blurb containing `TODO:` fails the deploy loudly; producer-side length/charset validation makes it unlikely |
| Utility-table density | 13 rows overwhelm on mobile | Table scrolls in its own container; blurbs capped at 140 chars by the producer |
| agora contribution accuracy | No local operator commits found in the fork | Row ships only with an operator-supplied contribution line (companion Step 28 TODO); until then the row reads as fork/experiment |

## 9. Testing Strategy

The deploy workflow's existing gates are the test suite (astro check strict, prettier, no-TODO, build, linkinator) — every step must pass them locally before push. New coverage: the Zod contract gate (Step 7, with a corrupt-field negative check), a build-time assertion that the five groups are non-empty as expected (flagship=3, utility=13, fun=6, professional=3, third-party=2 — counts pinned to the operator's list so an export regression is loud), and linkinator picking up the new Live links. End-to-end verification is Step 12's live-bytes check plus M4's visual pass in both themes.

## 10. Appendix — Decision Inventory

One ID space shared with the companion plan (`dev-observatory/plans/portfolio-pages-plan.md` §10 holds the full table). Site-relevant rows:

| ID | P/D | Choice | Status |
|---|---|---|---|
| P8 | P | x-marks-the-spot gets a real Pages deploy | locked 2026-07-28 |
| P9 | P | Fun + Professional = two separate sections | locked 2026-07-28 |
| P10 | P | Flagship full cards / utility table / About+below untouched / How-it-fits rewritten around tools | locked |
| D1 | D | Two coordinated plans; this one consumes the export contract | proposed |
| D5 | D | Committed generated `src/data/portfolio.json` (review-then-push) | proposed |
| D6 | D | Auto light/dark (forced light removed) | proposed |
| D8 | D | Private repos → linkless names | changed 2026-07-28 — flips approved via companion Steps 30 (leak-scan) + M6 (operator flips) + 31 (registry/export); coding-root stays private (dev-observatory/switchboard linkless v1); 3rd-party links upstream |
| D9 | D | xmarks gh-pages branch publish | proposed |
| D10 | D | How-it-fits drops the career-ops loop | proposed |
| D11 | D | void_furnace_calc flagship card; switchboard/measure-twice/citation-needed demote to table | changed 2026-07-28 — calc is NOT a flagship card: folded into void-furnace's card/case study; demotions stand |
| D13 | D | Steps 7/11 escalated to `--reviewers deep` | proposed (plan-review autofix) |
| D15 | D | agora row neutral, upstream links for both 3rd-party rows | resolved 2026-07-28 |
