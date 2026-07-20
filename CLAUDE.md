# aberson.github.io — project instructions

## Project overview

Abraham Robison's personal **portfolio website** — a static Astro site published
free at `https://aberson.github.io` via GitHub Pages, to show my work to hiring
managers and recruiters. No backend, no database, no accounts. Content is
markdown; `git push` to `main` auto-rebuilds and redeploys. It reuses existing
material: curated bio + projects from `../aberson-profile/README.md`, brand
tokens from `../aberson-profile/brand/dist/`, and case-study source from
`../Career/`. Full plan: [`plan.md`](plan.md).

## Stack

| Layer | Tool |
|---|---|
| Generator | Astro (TypeScript) + Content Collections |
| Styling | Tailwind v4 (`@tailwindcss/vite`) + vendored brand tokens |
| Content | Markdown/MDX in `src/content/projects/` (Zod-typed frontmatter) |
| Hosting | GitHub Pages — user site, repo `aberson.github.io` |
| Deploy | GitHub Actions (hand-written build gates → `upload-pages-artifact` → `deploy-pages`) |
| Deps | Dependabot (npm + github-actions, weekly) |

## Key commands

```powershell
npm install            # one-time
npm run dev            # http://localhost:4321, hot reload
npm run check          # astro check — validate content + types
npm run build          # production build to dist/
npm run preview        # serve the built dist/ locally
```

Publish = commit + push to `main` (the Action deploys). Add a project = add a
`.md` file under `src/content/projects/` and push. See `CONTENT.md`.

## Directory layout

```
astro.config.mjs   # site: 'https://aberson.github.io', base: '/'
.github/workflows/deploy.yml   .github/dependabot.yml
public/            # resume.pdf, favicon, thumbnails (later: CNAME)
src/
  pages/           # index.astro, work/[slug].astro, 404.astro
  content/         # config.ts (schema) + projects/*.md
  layouts/         # BaseLayout, CaseStudyLayout
  components/      # Header, Footer, Hero, SocialLinks, ProjectCard, ProjectGrid, ResumeSection, ContactSection, BaseHead
  styles/global.css
  assets/          # vendored brand tokens.css / theme.tw.css
  consts.ts        # name, GitHub/LinkedIn/email, value prop (single source)
```

## Architecture summary

Static, fully pre-rendered. A single-page **hub** (`/`) — header, hero, project
grid, about, resume, contact, footer — plus **case-study subpages**
(`/work/<slug>`) generated only for `featured: true` projects. Content is one
Astro Content Collection (`projects`) whose Zod schema fails the build loudly on
malformed frontmatter. Visual identity comes from brand tokens vendored from the
`aberson-profile` repo (not the starter theme — the theme is adapted to the
brand, per plan §8.3). GitHub + LinkedIn links are persistent in header and
footer. Built domain-ready (`base: '/'`) so a later custom domain is a `site`
change + `CNAME` file with no rebuild.

## Current state

**LIVE at https://aberson.github.io** (Steps 1–6 + M1 done). Full site
(hero/work/about/resume/contact + case studies), GitHub Actions deploy
(`.github/workflows/deploy.yml`, Pages source = GitHub Actions, Node 24),
Dependabot, and the `CONTENT.md` update runbook. Visual identity was refreshed to
an **indigo brand** (accent `#5d60e3` light / `#9aa6ff` dark, from OKLCH seed
`#3730a3`) — reseeded in `../aberson-profile/brand/tokens.json` and re-vendored
into `src/assets/` via `scripts/sync-brand.ps1` (commit `3deec04`). Remaining
operator items: swap
the placeholder `public/resume.pdf` for the real export, **M2** account-security
checklist (#8), optional **M3** custom domain (#9). Update this section via
`/repo-update` after each phase.

## Environment requirements

- Windows 11 + PowerShell. **Node 22.12+** and npm for Astro (Astro 7 minimum; dev + CI run Node 24).
- A GitHub account (`aberson`); the repo must be named `aberson.github.io`
  (user-site requirement) and public.
- No API keys or secrets — a static site needs none; never commit any.
- Identity (LinkedIn, contact email, value prop) is resolved in `src/consts.ts`
  (no `TODO:` remains — a CI no-`TODO` gate now enforces this). The one content
  placeholder still live is `public/resume.pdf` — swap it for the real export
  (edit → commit → push → the Action redeploys).
