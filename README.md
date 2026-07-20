# aberson.github.io

Personal portfolio site for **Abraham Robison** — applied AI engineer with deep
finance roots. A fast, static [Astro](https://astro.build) site published free via
GitHub Pages, designed to show my work to hiring managers and updated by editing a
markdown file and pushing.

> **Status:** scaffolding. The plan is in [`plan.md`](plan.md); the site itself is
> built through the tracked issues (Steps 1–6). This README describes the target
> shape and will be refreshed as the build lands.

## Stack

| Layer | Tool | Why |
|---|---|---|
| Generator | Astro (TypeScript) + Content Collections | Zero-JS static output; typed markdown content = an easy edit loop |
| Styling | Tailwind + vendored brand tokens | Reuses my existing brand system (light + dark) |
| Content | Markdown/MDX in `src/content/projects/` | Add a project = add a file |
| Hosting | GitHub Pages (user site) | Free, at `aberson.github.io` |
| Deploy | GitHub Actions (`withastro/action`) | Auto build + deploy on push to `main` |
| Quality gates | `astro check` · Prettier · pa11y · linkinator | Types/content, formatting, accessibility, dead-link checks |

## Prerequisites

- **Node 20+ (LTS)** and npm (Astro requires Node ≥ 18.20 / 20.3 / 22).

## Getting started

```bash
npm install       # one-time
npm run dev        # http://localhost:4321, hot reload
npm run build      # production build to dist/
npm run preview    # serve the built output
```

## Updating the site

The everyday loop: **edit a markdown file in `src/content/projects/` → `git push`**.
A GitHub Action rebuilds and redeploys automatically. See `CONTENT.md` (added in the
build) for the field-by-field runbook.

## Project structure

```
astro.config.mjs        # site + base config, integrations
.github/workflows/       # deploy.yml (build + deploy to Pages)
public/                  # resume.pdf, favicon, images
src/
  pages/                 # index.astro (hub), work/[slug].astro (case studies)
  content/projects/      # one markdown file per project
  layouts/ components/   # BaseLayout, Header, Hero, ProjectCard, …
  styles/ assets/        # brand tokens, global styles
```

## Deploying

Pushing to `main` triggers the GitHub Action, which builds the site and publishes it
to GitHub Pages. The site is built **domain-ready**: moving to a custom domain later
is a one-line `site` config change plus a `public/CNAME` file — no rebuild of paths.

## Plan & design

Full architecture, build steps, and design decisions live in [`plan.md`](plan.md).
Project-specific working notes are in [`CLAUDE.md`](CLAUDE.md).
