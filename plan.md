# aberson.github.io — Abraham Robison portfolio site

## 1. What This Is

**Proposal:** https://claude.ai/code/artifact/afb04935-f35c-4783-9bdb-1d4fcdfe24dd

A static personal **portfolio website** for Abraham Robison, published free at
`https://aberson.github.io` via GitHub Pages. Its job is to **show my work to
hiring managers and recruiters** — the recurring "please provide your website"
ask on job applications — not to sell anything. It has **no backend, no
database, and no user accounts**.

The project is deliberately a *rendering* of material that already exists in
this workspace, not net-new authoring:

- Bio, tagline, and a curated set of 6 projects are already written in
  [`aberson-profile/README.md`](../aberson-profile/README.md) (my GitHub
  profile README repo).
- A full DTCG brand-token system (light/dark palette, Tailwind theme) lives in
  [`aberson-profile/brand/dist/`](../aberson-profile/brand/dist/).
- Deeper case-study source material is in
  [`Career/CANDIDATE MASTER PROFILE.md`](../Career/CANDIDATE%20MASTER%20PROFILE.md).

The top priority is **easy to update**: content is markdown files edited in the
repo; a `git push` triggers a GitHub Action that rebuilds and redeploys. The
site launches on the free `aberson.github.io` subdomain and is built
**domain-ready** so a later custom-domain upgrade is a ~15-minute change with no
rebuild.

**Out of scope for v1:** e-commerce / payments, any backend or server-side
logic, user login/sessions, a CMS, comments, a full blog (the case-study
mechanism can grow into one later), analytics (deferred, optional), and a custom
domain (deferred "level-up").

## 2. Stack

| Layer | Tool | Why |
|---|---|---|
| Static site generator | **Astro** (latest, TypeScript) | Ships ~zero client JS; Content Collections give a typed markdown edit loop — the "edit a file, push, done" workflow. |
| Starting point | A lightweight Astro portfolio starter, **restyled to the brand tokens** | Structure out of the box; visual identity comes from my own brand, not the theme's. See §8 decision 3. |
| Styling | **Tailwind** (`@astrojs/tailwind`) + vendored brand tokens (`tokens.css` / `theme.tw.css`) | Reuses the existing brand system for a coherent look, light + dark. |
| Content | Markdown/MDX in `src/content/` via Astro **Content Collections** (Zod-typed frontmatter) | Typed, build-time-validated content; adding a project = adding a file. |
| Hosting | **GitHub Pages** — user site, repo named `aberson.github.io` | Free, already on GitHub, serves at the clean root URL `aberson.github.io`. |
| Deploy | **GitHub Actions** (`withastro/action` + `actions/deploy-pages`) | Auto build + deploy on push to `main`; free HTTPS via Let's Encrypt. |
| Dependency hygiene | **Dependabot** (npm ecosystem) | Free supply-chain hygiene for the one place a static site has any: the build's npm deps. |
| Quality gates | `astro check` &middot; **Prettier** &middot; **pa11y** (a11y) &middot; **linkinator** (link-check) | Fail-loud checks locally + in CI: types/content-schema, formatting, accessibility, and dead-link detection (a dead project/demo link is a documented portfolio credibility killer). This is the project's `test`/`lint` surface — there is no unit-test runner (nothing to unit-test on a static content site). |
| Analytics (optional, deferred) | GoatCounter or Cloudflare Web Analytics | Cookieless, no GDPR consent banner, free. Not part of v1. |

## 3. Data Store

There is **no database**. The "data store" is the git repository itself; content
is plain files.

- **Projects** — one Content Collection, `src/content/projects/`. Each project
  is a `.md`/`.mdx` file. **ID = slug**, kebab-case, equal to the filename
  (without extension) and to the URL segment (`/work/<slug>`). Slug uniqueness
  is enforced by the filesystem.
- **Frontmatter schema** (Zod, in `src/content/config.ts`):

  | Field | Type | Notes |
  |---|---|---|
  | `title` | string (required) | e.g. "Alpha4Gate" |
  | `blurb` | string (required) | 1–2 line problem→outcome summary shown on the card |
  | `tech` | string[] (required) | tag chips, e.g. `["Python", "PyTorch/SB3", "FastAPI", "React"]` |
  | `repo` | string url (optional) | GitHub link |
  | `demo` | string url (optional) | live demo link |
  | `thumbnail` | string (optional) | path under `public/` or a `src/assets/` image |
  | `order` | number (required) | sort order in the grid |
  | `featured` | boolean (default false) | if true, gets a full case-study subpage |

  The markdown **body** (after frontmatter) is the case-study content
  (Problem → Approach → Outcome). A non-featured project has an empty/short body
  and renders as a card only (no dead subpage link).
- **Static assets** — `public/`: `resume.pdf`, optional `headshot.*`, project
  thumbnails, `favicon.*`, and later a `CNAME` file for a custom domain.
- **Deduplication / corruption:** not applicable — git history is the source of
  truth; a bad frontmatter shape fails the Astro build loudly (see §8 decision 5).

### Content sources (reuse — do not re-author)

The build steps port these verbatim; each is a producing file to read, not to
invent from memory:

- Bio, tagline, the 6 project blurbs + tech tags + links, background, stack,
  location → [`aberson-profile/README.md`](../aberson-profile/README.md).
- Case-study depth (problem/approach/outcome, metrics) →
  [`Career/CANDIDATE MASTER PROFILE.md`](../Career/CANDIDATE%20MASTER%20PROFILE.md)
  and `Career/CANDIDATE MASTER PROFILE JSON.json`.
- Brand tokens → `aberson-profile/brand/dist/tokens.css`,
  `aberson-profile/brand/dist/theme.tw.css`,
  `aberson-profile/brand/dist/diagram-palette.json` (source of truth:
  `aberson-profile/brand/tokens.json` + `modes.dark.json`).
- Reusable diagrams → `aberson-profile/assets/core-pipeline-{light,dark}.svg`.

## 4. Core Content Model (site structure)

A **single-page hub** with **case-study subpages** — the pattern the content
research converged on for a job-seeker portfolio (fast recruiter skim + depth on
demand).

Hub (`/`), top to bottom:

1. **Sticky header** — name "Abraham Robison" + nav (Work / About / Resume /
   Contact) + persistent **GitHub** and **LinkedIn** icon links, visible without
   scrolling.
2. **Hero** (above the fold) — one-sentence value proposition ("Applied AI
   engineer with deep finance roots — I design and ship agentic, judge-gated,
   cost-aware systems, grounded in real financial work") + one primary CTA
   ("See my work") + a secondary row (Resume, Contact, GitHub, LinkedIn).
   Optional headshot.
3. **Work grid** — 6 curated project cards (thumbnail + blurb + tech chips +
   repo/demo links; featured cards also link to a case study).
4. **About** — short, personal: current focus (Applied AI Scientist at FEV),
   how I work, background (Google Treasury, Russell, BlackRock; MA Economics +
   Computational Finance; BS CS + BA Math; GCP GenAI Leader).
5. **Resume** — a "Download PDF" button (→ `public/resume.pdf`) + a
   last-updated date.
6. **Contact** — a visible `mailto:` and LinkedIn (primary path).
7. **Footer** — repeats GitHub / LinkedIn / email + a last-updated stamp; a
   "view source" link to this repo (a nice signal for engineering roles).

Case-study subpages (`/work/<slug>`) exist only for `featured: true` projects
(launch with 1–2 — likely **Alpha4Gate** and **toybox** — and grow to 3–4 over
time). Each: Problem/context → Approach & key decisions (the *why*, not just the
*what*) → Outcome (metrics where available), ~800–1500 words, drawn from the
Career master profile.

## 5. Modules (`src/`)

- **`src/pages/`** — `index.astro` (the hub), `work/[slug].astro` (dynamic
  case-study route, generated from featured projects), `404.astro`.
- **`src/content/`** — `config.ts` (collection schema, §3), `projects/*.md`
  (the 6 project entries).
- **`src/layouts/`** — `BaseLayout.astro` (html shell, `<BaseHead>`, header +
  footer, brand-token CSS, light/dark), `CaseStudyLayout.astro` (case-study
  page frame).
- **`src/components/`** — `BaseHead.astro` (title/description/OG/canonical meta),
  `Header.astro`, `Footer.astro`, `Hero.astro`, `SocialLinks.astro`,
  `ProjectCard.astro`, `ProjectGrid.astro`, `ResumeSection.astro`,
  `ContactSection.astro`.
- **`src/styles/`** — `global.css` (imports the vendored brand `tokens.css`;
  maps tokens to Tailwind theme via `theme.tw.css`).
- **`src/assets/`** — brand token files vendored from `aberson-profile/brand/dist/`
  (build-time imported/optimized images live here; raw downloadables live in
  `public/`).

## 6. API Route Contract

Not applicable — there is no backend or API. All routes are statically
pre-rendered HTML.

## 7. Project Structure

```
aberson.github.io/
├── astro.config.mjs          # site: 'https://aberson.github.io', base: '/', integrations: tailwind, sitemap
├── tailwind.config.mjs       # theme extended from vendored brand tokens
├── package.json              # scripts: dev, build, preview, astro check
├── tsconfig.json
├── .github/
│   ├── workflows/deploy.yml   # withastro/action -> actions/deploy-pages
│   └── dependabot.yml         # npm, weekly
├── public/
│   ├── resume.pdf             # (placeholder until real export)
│   ├── favicon.svg
│   └── (thumbnails, headshot, later: CNAME)
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── work/[slug].astro
│   │   └── 404.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── projects/
│   │       ├── alpha4gate.md   # featured
│   │       ├── toybox.md       # featured
│   │       ├── pta-finance.md
│   │       ├── shake-spear.md
│   │       ├── applied-learning.md
│   │       └── walkies.md
│   ├── layouts/  (BaseLayout, CaseStudyLayout)
│   ├── components/  (BaseHead, Header, Footer, Hero, SocialLinks, ProjectCard, ProjectGrid, ResumeSection, ContactSection)
│   ├── styles/global.css
│   └── assets/  (vendored brand tokens.css / theme.tw.css)
├── CONTENT.md                # how-to-update runbook
├── CLAUDE.md
├── README.md
└── plan.md                   # this file
```

## 8. Key Design Decisions

1. **GitHub Pages *user* site (base `/`), not a project site.** The repo is
   named `aberson.github.io`, serving at the root URL. Root base means a later
   custom domain is a trivial `site` config change + `CNAME` file — no `base`
   rewrite of every asset path. Cleaner URL, and domain-ready by construction.
2. **GitHub Pages over Cloudflare Pages for the free phase.** The free subdomain
   `aberson.github.io` reads far better on an application than a `*.pages.dev`
   URL, and there is no new account. Migrating the host later is easy if desired;
   Cloudflare Pages stays the noted alternative (unlimited bandwidth, ecosystem
   bundling) if a custom domain is bought at Cloudflare Registrar.
3. **Reuse the brand tokens; adapt the theme to them, not vice versa.** I have a
   real brand system, so a heavy opinionated theme (e.g. Astrofy) would fight it.
   Start from a *lightweight* Astro portfolio starter for structure, vendor the
   compiled brand tokens (`tokens.css`/`theme.tw.css`), and resolve any style
   conflict in favor of the brand. (Risk tracked in §9.)
4. **Single-page hub + grow case studies.** Launch fast with the hub + 1–2 case
   studies; expand depth over time. Never block launch on writing every
   writeup.
5. **Content Collections with a Zod schema = fail-loud content.** Typed
   frontmatter means a malformed project entry fails `npm run build` (and the
   deploy Action) rather than shipping broken — guardrails on the easy-update
   loop.
6. **Port curated content verbatim from the profile README.** The README is the
   existing single source of curation for the project set; the site mirrors it.
   (Divergence risk tracked in §9; a shared data file is a future improvement.)
7. **Security sized to a static site.** No server or DB exists, so there is
   almost no attack surface. Security is a ~30-minute account-hardening
   checklist (Steps M2, and M3 when a domain is bought), not a program. Server
   hardening / DDoS / WAF / DB security are explicitly out of scope — the host
   CDN absorbs traffic for free.

## 9. Open Questions / Risks

| Item | Risk | Mitigation |
|---|---|---|
| **LinkedIn URL + contact email not yet pinned** | The persistent LinkedIn link and `mailto:` need real values before launch. | Operator provides before Step 2 / repo-init. Code uses a single `src/consts.ts` with `TODO:` markers; a grep gate flags any remaining `TODO:` before M1. |
| Brand-token vendoring drifts from the `aberson-profile` source | Portfolio visuals diverge if the profile brand changes | Document the copy source in `CONTENT.md` + a `scripts/sync-brand.ps1` one-liner to re-copy. Low churn; acceptable for v1. |
| Project list duplicated across README + site | The two curated lists drift over time | Accept for v1 (both hand-maintained). Future: derive both from one shared JSON. |
| Lightweight starter's CSS vs brand tokens | Theme styles override the brand palette | Decision 3 (favor brand); Step 1 budgets a token-mapping pass; if a starter fights, drop to a minimal Astro base. |
| Resume PDF not yet exported | The Download button has no real target | Ship a placeholder `resume.pdf`; operator exports the real one from `Career/Resume Template.docx`. |
| Headshot optional | Hero photo slot may be empty | Text hero works without it; photo is additive. |
| Astro/theme version churn | Content Collections API has moved across Astro majors | Pin Astro + integrations in `package.json`; `npm run astro check` in CI. |

## 10. How to Run

```powershell
# prerequisites: Node 20+ (LTS) and npm  (Astro requires Node >=18.20 / 20.3 / 22)
# one-time
cd C:\Users\abero\dev\aberson.github.io
npm install

# develop (http://localhost:4321, hot reload)
npm run dev

# add / edit a project: create or edit src\content\projects\<slug>.md, save, see it live
# quality gates (also enforced in CI before deploy)
npm run check         # astro check - types + content schema
npm run format        # Prettier
npm run check:links   # linkinator over built dist/ (run after npm run build)

# production build + local preview of the built output
npm run build
npm run preview

# publish: commit + push to main -> GitHub Action builds & deploys to aberson.github.io
git add -A; git commit -m "content: ..."; git push
```

The everyday update loop is: **edit a markdown file in `src/content/projects/`
→ `git push` → the site redeploys**. See `CONTENT.md` for the field-by-field
runbook.

## 11. Development Process

Build with **`/build-phase`** walking the Automated Steps below, each via
`/build-step`. This is a **mixed** plan (code steps + operator steps), so Build
Steps split into **Automated** (unattended) and **Manual** (operator-driven,
after the automated run). There is no autonomous/scheduled/always-on behavior,
so no soak step; the end-to-end "add a content entry → card renders" smoke is
folded into Step 3's `Done when`. Isolation: `worktree` (default). The local
Astro dev server (`npm run dev`, `http://localhost:4321`) is unauthenticated, so
UI steps can use `--ui` screenshot evidence without an auth downgrade.

### Automated Steps
(These run unattended via `/build-phase`.)

### Step 1: Scaffold Astro + wire brand tokens + local preview
- **Problem:** Initialize an Astro + TypeScript project with `@astrojs/tailwind` and `@astrojs/sitemap`; set `astro.config.mjs` `site: 'https://aberson.github.io'`, `base: '/'`; vendor the compiled brand tokens from `../aberson-profile/brand/dist/` (`tokens.css`, `theme.tw.css`) into `src/assets/` and import them in `src/styles/global.css`; map them into `tailwind.config.mjs`; build a minimal `BaseLayout.astro` with light/dark from the brand modes and a placeholder index page.
- **Type:** code
- **Issue:** #1
- **Flags:** --reviewers code --isolation worktree
- **Produces:** `package.json` (scripts: `dev` / `build` / `preview` / `check` = `astro check` / `format` + `lint` = Prettier), `.prettierrc` (with `prettier-plugin-astro`), `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`, vendored brand files, placeholder `src/pages/index.astro`.
- **Done when:** `npm run build` and `npm run astro check` both exit 0; `npm run dev` serves a page whose colors come from the brand tokens in both light and dark schemes.
- **Depends on:** none
- **Status:** DONE (2026-07-19) — Astro+TS scaffold, Tailwind v4 via `@tailwindcss/vite` (vendored `theme.tw.css` is a v4 `@theme` block; deviation from `@astrojs/tailwind`), brand tokens vendored + imported, light/dark verified in built CSS. `npm run build`/`check`/`lint` all exit 0.

### Step 2: Site chrome — header, footer, hero, social links
- **Problem:** Build the persistent chrome: sticky `Header` (name + nav anchors Work/About/Resume/Contact + persistent GitHub & LinkedIn icon links), `Footer` (repeat links + last-updated stamp + view-source link), `Hero` (value-prop sentence from the profile README + primary CTA "See my work"), and a `SocialLinks` component. Centralize name/URLs/email in `src/consts.ts` with `TODO:` markers for the not-yet-known LinkedIn URL and email. Responsive to 375px.
- **Type:** code
- **Issue:** #2
- **Flags:** --reviewers code --ui --start-cmd "npm run dev" --url http://localhost:4321
- **Produces:** `src/consts.ts`, `Header.astro`, `Footer.astro`, `Hero.astro`, `SocialLinks.astro`, wired into `BaseLayout`.
- **Done when:** the hub renders header + hero + footer; nav anchors scroll to sections; the GitHub link resolves to `github.com/aberson`; layout holds at 375px; nav is keyboard-focusable with a visible focus ring.
- **Depends on:** 1
- **Status:** DONE (2026-07-19) — Header/Hero/Footer/SocialLinks + `consts.ts` (single source, `ANCHORS` for anchor ids). Verified in Playwright light/dark @1280 + @375 (no overflow), keyboard focus ring visible on nav, skip-link is first tab stop. LinkedIn/email gated behind `isResolved()` — omitted until the operator provides real values (still `TODO:` in `consts.ts`, resolved at Step 5/6). Reviewers PASS (iter 2). build/check/lint 0.

### Step 3: Projects content collection + card grid
- **Problem:** Define the `projects` Content Collection (`src/content/config.ts`, Zod schema per §3); seed all **6** real projects from `../aberson-profile/README.md` (`alpha4gate`, `toybox`, `pta-finance`, `shake-spear`, `applied-learning`, `walkies`) with verbatim blurbs, tech tags, and repo links; build `ProjectCard.astro` + `ProjectGrid.astro` and render the grid on the hub.
- **Type:** code
- **Issue:** #3
- **Flags:** --reviewers code --ui --start-cmd "npm run dev" --url http://localhost:4321
- **Produces:** `src/content/config.ts`, `src/content/projects/*.md` (6 entries), `ProjectCard.astro`, `ProjectGrid.astro`.
- **Done when:** all 6 cards render with correct blurb/tech/link; **adding a new `.md` in `src/content/projects/` produces a new card after rebuild** (verifies the update loop end-to-end); a frontmatter that violates the schema fails `npm run build`.
- **Depends on:** 2
- **Status:** DONE (2026-07-19) — `src/content.config.ts` (Astro 7 content-layer `glob()` loader, 8-field Zod schema per §3, `z.url()`), 6 project `.md` seeds (blurbs/tech/repo verbatim from profile README; all 6 repos verified public via `gh api`), `ProjectCard` + `ProjectGrid` rendered in `#work`. Schema-fail test confirmed (missing `order` → hard build fail). Verified in Playwright: 3-col desktop / 1-col @375, no overflow, light+dark. Reviewers PASS (0 high/med; low forward-risks noted). build/check/lint 0.

### Step 4: Case-study subpage template + seed 1–2 studies
- **Problem:** Add the dynamic route `src/pages/work/[slug].astro` + `CaseStudyLayout.astro` that renders a featured project's markdown body as a Problem→Approach→Outcome page at `/work/<slug>`; link featured cards to their study (non-featured cards get no link). Seed the 2 deepest studies (`alpha4gate`, `toybox`) with real content sourced from `../Career/CANDIDATE MASTER PROFILE.md`.
- **Type:** code
- **Issue:** #4
- **Flags:** --reviewers code --ui --start-cmd "npm run dev" --url http://localhost:4321
- **Produces:** `src/pages/work/[slug].astro`, `CaseStudyLayout.astro`, full bodies for 2 featured entries, "Read case study" links on featured cards.
- **Done when:** a featured card links to a standalone `/work/<slug>` page that renders its markdown; non-featured cards expose no dead link; each rendered page has exactly one `<h1>`.
- **Depends on:** 3

### Step 5: Resume + contact + accessibility, links & SEO pass
- **Problem:** Add `ResumeSection` (Download-PDF button → `public/resume.pdf` placeholder + last-updated date), `ContactSection` (visible `mailto:` + LinkedIn), and `BaseHead` meta (title/description/OpenGraph/canonical) + favicon + `@astrojs/sitemap`. Accessibility sweep: semantic landmarks, real alt text, 4.5:1 contrast, keyboard nav with visible focus, 200% text resize, `prefers-color-scheme` dark. Run an automated a11y check (pa11y-ci or axe) over the hub + one case-study page, and a link check (linkinator over the built `dist/`) so no dead project / demo / resume link ships.
- **Type:** code
- **Issue:** #5
- **Flags:** --reviewers code --ui --start-cmd "npm run dev" --url http://localhost:4321
- **Produces:** `ResumeSection.astro`, `ContactSection.astro`, `BaseHead.astro`, sitemap integration, placeholder `public/resume.pdf`, a `check:links` npm script (linkinator), a11y fixes.
- **Done when:** the a11y check reports no serious/critical violations on the hub and a case-study page; Lighthouse accessibility ≥ 95; the resume button downloads the PDF; the `mailto:` opens a compose window; `linkinator` reports zero broken links.
- **Depends on:** 4

### Step 6: Deploy workflow + Dependabot + content runbook (domain-ready)
- **Problem:** Add `.github/workflows/deploy.yml` (`withastro/action` → `actions/deploy-pages`, build on push to `main`, running the quality gates — `astro check` + Prettier `--check` + `linkinator` — before deploy); confirm `astro.config` `site`/`base` are correct for the user site; add `.github/dependabot.yml` (npm, weekly); add a repo `README.md` and a `CONTENT.md` update runbook; document (do not yet perform) the custom-domain switch (add `public/CNAME` + change `site`). Add a `TODO:`-grep gate so unresolved placeholders can't ship.
- **Type:** code
- **Issue:** #6
- **Flags:** --reviewers code --isolation worktree
- **Produces:** `.github/workflows/deploy.yml`, `.github/dependabot.yml`, `README.md`, `CONTENT.md`.
- **Done when:** the workflow and dependabot YAML parse and lint (e.g. `actionlint`); a fresh `npm ci && npm run build` reproduces the deployable `dist/`; `grep -r "TODO:" src/` returns nothing (all placeholders resolved). Live deploy is verified in M1.
- **Depends on:** 5

### Manual Steps
(These run after `/build-phase` completes and the repo is created via `/repo-init`. Operator drives.)

### Step M1: Enable GitHub Pages + verify the live deploy
- **Source step:** Step 6
- **Issue:** #7
- **Commands:**
  ```powershell
  cd C:\Users\abero\dev\aberson.github.io
  # Set Pages source to GitHub Actions (or: repo Settings -> Pages -> Source: GitHub Actions)
  gh api -X POST repos/aberson/aberson.github.io/pages -f build_type=workflow
  # Trigger + watch the deploy
  git commit --allow-empty -m "ci: trigger initial Pages deploy"; git push
  gh run watch
  # Open the live site
  Start-Process "https://aberson.github.io"
  ```
- **What to look for:**
  | Check | Expected outcome |
  |---|---|
  | Deploy Action | `deploy.yml` run completes green |
  | Site loads | `https://aberson.github.io` renders the hub |
  | HTTPS | Padlock shown; auto Let's Encrypt cert; no mixed-content warning |
  | Content | 6 project cards; GitHub link works; hero + resume + contact present |
  | Mobile | Layout intact on a phone-width viewport |

### Step M2: Security checklist — the free-subdomain phase (~15 min)
- **Source step:** §8 decision 7
- **Issue:** #8
- **Commands:**
  ```powershell
  # Account hardening is done in the GitHub web UI:
  #  1. GitHub -> Settings -> Password and authentication -> enable 2FA (authenticator app or passkey)
  #  2. Repo -> Settings -> Pages -> confirm "Enforce HTTPS" is checked
  #  3. Repo -> Settings -> Code security -> confirm Dependabot alerts are on
  # Sanity-check no secrets were ever committed (a static site needs none):
  cd C:\Users\abero\dev\aberson.github.io
  git log -p | Select-String -Pattern "api[_-]?key|secret|password|token" -CaseSensitive:$false | Select-Object -First 20
  ```
- **What to look for:**
  | Check | Expected outcome |
  |---|---|
  | GitHub 2FA | Shows enabled (authenticator/passkey, not SMS) |
  | Enforce HTTPS | Checked in repo Pages settings |
  | Dependabot | Alerts enabled |
  | Secret scan | The `git log` grep returns nothing meaningful (no committed secrets) |

### Step M3 (optional, later): Custom-domain + analytics level-up
- **Source step:** §1 (deferred enhancement)
- **Issue:** #9
- **Commands:**
  ```powershell
  # Operator-only infra (no code):
  #  1. Buy a short name-based .com or .dev at Porkbun or Cloudflare Registrar (~$10-13/yr; avoid .io).
  #  2. DNS for an apex domain -> GitHub Pages: four A records to
  #        185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  #     (+ AAAA equivalents), and a CNAME for www -> aberson.github.io.
  #  3. Registrar security: enable 2FA + domain/transfer lock (the #1 item), and one-click DNSSEC if offered.
  # Then a trivial code change (separate quick edit, not a build-phase step):
  #  - add public/CNAME containing the domain, set astro.config site to it, push.
  #  - optional: add a GoatCounter or Cloudflare Web Analytics snippet.
  ```
- **What to look for:**
  | Check | Expected outcome |
  |---|---|
  | Domain resolves | The custom domain serves the site over HTTPS |
  | Registrar 2FA | Enabled |
  | Domain lock | Transfer lock on; DNSSEC on if supported |
  | Analytics (if added) | Cookieless tool recording visits, no consent banner needed |

**Please run M1 next** after `/build-phase` completes and the repo is created.

## 12. Appendix

**Projects to seed (from `aberson-profile/README.md`, verbatim source):**

| slug | title | featured | tech |
|---|---|---|---|
| alpha4gate | Alpha4Gate | yes | Python, PyTorch/SB3, FastAPI, React |
| toybox | toybox | yes | Python/FastAPI, React/TypeScript |
| pta-finance | pta_finance | no | Python, `mypy --strict`, GitHub Actions |
| shake-spear | shake_spear | no | Python |
| applied-learning | applied_learning | no | Jupyter |
| walkies | walkies | no | React Native, TypeScript |

**Identity / links (fill remaining `TODO:` before M1):**

| Field | Value |
|---|---|
| Name | Abraham Robison |
| GitHub | `https://github.com/aberson` |
| LinkedIn | `TODO:` (operator to provide) |
| Contact email | `TODO:` (operator to provide) |
| Value prop | "Applied AI engineer with deep finance roots — agentic, judge-gated, cost-aware systems, grounded in real financial work." |
| Location | Bay Area · open to remote and relocation |

**Brand token files to vendor** (`aberson-profile/brand/dist/` → `src/assets/`):
`tokens.css`, `theme.tw.css`, `diagram-palette.json` (source: `tokens.json` + `modes.dark.json`).

### Decision Inventory

Canonical ID registry for the proposal (see the `Proposal:` link in §1). Rows are
append-only; a reversed decision flips `status` to `changed <date>`, never renumbers.

| ID | P/D | Choice (short) | Status |
|---|---|---|---|
| P1 | P | Work type: mixed / general-professional | stands |
| P2 | P | Updating: edit markdown + `git push` | stands |
| P3 | P | Build: Astro + a polished theme | stands |
| P4 | P | Domain: free `aberson.github.io` first, custom domain later | stands |
| P5 | P | Identity: GitHub `aberson` → site at aberson.github.io | stands |
| P6 | P | Purpose: show work for job applications; not selling | stands |
| D1 | D | Host on GitHub Pages for the free phase (not Cloudflare Pages) | stands |
| D2 | D | A user site (repo `aberson.github.io`, base `/`), not a project site | stands |
| D3 | D | Lightweight Astro starter restyled to brand tokens, not a heavy theme | stands |
| D4 | D | Reuse existing brand + curated content, vendored in | stands |
| D5 | D | Single-page hub + case-study subpages; 2 featured (Alpha4Gate, toybox) | stands |
| D6 | D | Security as a phased ~30-min checklist; skip server/DDoS/DB | stands |
| D7 | D | Analytics deferred / optional, not in v1 | stands |
| D8 | D | 6 auto + 3 operator steps; worktree; code + `--ui` reviewers | stands |
| D9 | D | Resume = downloadable PDF, not an inline HTML resume page | stands |
| D10 | D | Repo + local folder named `aberson.github.io` | stands |
