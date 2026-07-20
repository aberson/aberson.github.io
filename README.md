# aberson.github.io

Personal portfolio site for **Abraham Robison** — an applied AI engineer with deep
finance roots. A fast, zero-JS static [Astro](https://astro.build) site published
free via GitHub Pages at [`aberson.github.io`](https://aberson.github.io), built to
show my work to hiring managers and updated by editing a markdown file and pushing.

## What it is

A single-page **hub** (`/`) — hero, project grid, about, resume, contact — plus
per-project **case-study pages** (`/work/<slug>/`) generated for featured projects.
Projects are markdown files with typed frontmatter; site identity lives in one
`src/consts.ts`. Visual identity comes from brand tokens vendored from my
`aberson-profile` repo. No backend, no database, no accounts.

## Stack

| Layer         | Tool                                                                 |
| ------------- | -------------------------------------------------------------------- |
| Generator     | Astro (TypeScript) + Content Collections (Zod-typed frontmatter)     |
| Styling       | Tailwind v4 (`@tailwindcss/vite`) + vendored brand tokens            |
| Content       | Markdown in `src/content/projects/` (one file per project)           |
| Hosting       | GitHub Pages — user site, repo `aberson.github.io`                   |
| Deploy        | GitHub Actions (build gates → `upload-pages-artifact` → `deploy-pages`) |
| Quality gates | CI (deploy): `astro check` · Prettier · a no-`TODO` gate · linkinator. Local-only: axe-core a11y (`npm run check:a11y`) |
| Deps          | Dependabot (npm + github-actions, weekly)                            |

Requires **Node 22.12+** and npm (Astro 7's minimum; dev + CI run Node 24).

## Quick start

```powershell
npm install       # one-time
npm run dev       # http://localhost:4321, hot reload
npm run build     # production build to dist/
npm run preview   # serve the built output
```

## Updating the site

The everyday loop: **edit a file → `git push` to `main` → the Action rebuilds and
redeploys.** The field-by-field runbook — how to add a project, edit identity,
replace the résumé, and re-sync brand tokens — is in [`CONTENT.md`](CONTENT.md).

## Deploy

Every push to `main` (or a manual **workflow_dispatch**) triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs the
quality gates in order — `check` → `lint` → no-`TODO` gate → `build` →
`check:links` — then uploads `dist/` and deploys it to GitHub Pages. Any gate
failure stops the deploy, so a broken build never ships; the live site stays on the
last good deploy. The axe-core a11y check (`npm run check:a11y`) is **local-only** —
run it before pushing; it is not wired into the CI deploy.

The site is built **domain-ready** (`base: '/'`): moving to a custom domain later is
a one-line `site` change in `astro.config.mjs` plus a `public/CNAME` file, with no
asset-path rebuild. Steps are documented in [`CONTENT.md`](CONTENT.md).

## Project layout

```
astro.config.mjs             # site + base config, integrations
.github/workflows/deploy.yml  # build gates + deploy to Pages
.github/dependabot.yml        # weekly npm + github-actions updates
scripts/                      # sync-brand.ps1, a11y-check.mjs
public/                       # resume.pdf, favicon
src/
  pages/                      # index.astro (hub), work/[slug].astro (case studies)
  content/projects/           # one markdown file per project
  layouts/ components/        # BaseLayout + section components
  assets/                     # vendored brand tokens
  consts.ts                   # identity: name, links, value prop (single source)
```

## More

- Content runbook: [`CONTENT.md`](CONTENT.md)
- Full plan & design decisions: [`plan.md`](plan.md)
- Working notes for agents: [`CLAUDE.md`](CLAUDE.md)
