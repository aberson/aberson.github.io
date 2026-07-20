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
| Styling | Tailwind (`@astrojs/tailwind`) + vendored brand tokens |
| Content | Markdown/MDX in `src/content/projects/` (Zod-typed frontmatter) |
| Hosting | GitHub Pages — user site, repo `aberson.github.io` |
| Deploy | GitHub Actions (`withastro/action` → `actions/deploy-pages`) |
| Deps | Dependabot (npm) |

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

**Plan written, no code yet.** Build via `/build-phase --plan plan.md` (Steps
1–6 automated; M1–M3 operator). Update this section via `/repo-update` after
each phase.

## Environment requirements

- Windows 11 + PowerShell. **Node 20+ (LTS)** and npm for Astro.
- A GitHub account (`aberson`); the repo must be named `aberson.github.io`
  (user-site requirement) and public.
- No API keys or secrets — a static site needs none; never commit any.
- Before launch (M1): provide the real **LinkedIn URL** and **contact email**
  (currently `TODO:` in `src/consts.ts`) and export a real `public/resume.pdf`.
