# Updating the site — content runbook

This is the how-to for keeping the portfolio current. The site is a static
[Astro](https://astro.build) build published to GitHub Pages: **you edit a file,
push to `main`, and a GitHub Action rebuilds and redeploys.** No servers to run,
no dashboard, no manual upload.

---

## The everyday loop

1. Edit a file — a project markdown under `src/content/projects/`, the identity
   in `src/consts.ts`, or a section component under `src/components/`.
2. (Optional but recommended) preview locally: `npm run dev` → http://localhost:4321.
3. Commit and push to `main`:

   ```powershell
   git add -A
   git commit -m "content: <what changed>"
   git push
   ```

4. The **Deploy to GitHub Pages** Action (`.github/workflows/deploy.yml`) runs the
   quality gates, rebuilds `dist/`, and publishes it. Watch it in the repo's
   **Actions** tab; the live site updates a minute or two after it goes green.

If a gate fails, the deploy stops and the old site stays up — nothing broken
ships. Fix the reported problem and push again.

---

## Add a project

Each project is one markdown file under `src/content/projects/`. **The filename is
the slug** (`x-marks-the-spot.md` → slug `x-marks-the-spot`). Create the file and
fill the frontmatter:

```markdown
---
title: "Project Name" # card heading
blurb: "One-paragraph summary shown on the project card." # required
tech: ["Python", "FastAPI", "React"] # stack chips
repo: "https://github.com/aberson/project" # optional — adds a "Code" link
demo: "https://example.com/demo" # optional — adds a "Live" link
thumbnail: "/thumbnails/project.png" # optional — image above the card; omit = text-only
order: 7 # sort key; grid renders ascending
featured: false # true => a /work/<slug>/ case-study page
hidden: false # optional — true keeps the file but renders it nowhere (saved-but-off)
---
```

Field reference (the Zod schema in `src/content.config.ts` is the source of truth
and **fails the build loudly** if a file is malformed):

| Field       | Required | Notes                                                                                                                                     |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `title`     | yes      | Card heading.                                                                                                                             |
| `blurb`     | yes      | One paragraph; shown on the card.                                                                                                         |
| `tech`      | yes      | Array of strings, rendered as chips.                                                                                                      |
| `repo`      | no       | Must be a full URL; adds the card's "Code" link.                                                                                          |
| `demo`      | no       | Must be a full URL; adds the card's "Live" link.                                                                                          |
| `thumbnail` | no       | Path under `public/` (e.g. `/thumbnails/x.png`); renders an image above the card. Omit for text-only.                                     |
| `order`     | yes      | Number; the grid sorts ascending by it.                                                                                                   |
| `featured`  | no       | Defaults to `false`. `true` generates a case-study page.                                                                                  |
| `hidden`    | no       | Defaults to `false`. `true` keeps the file in the repo but renders it nowhere — a saved-but-off toggle; flip to `false` to bring it back. |

Thumbnail files live under `public/` — e.g. drop the image at
`public/thumbnails/x.png` and set `thumbnail: "/thumbnails/x.png"`. It renders
lazily above the card, cropped to a 16:9 box (no layout shift). Omit the field for
a text-only card.

### Featured projects get a case study

Set `featured: true` and the project also gets a full page at `/work/<slug>/`,
built from the markdown **body** (everything below the frontmatter). Write the body
as three sections:

```markdown
## Problem

What was hard and why it mattered.

## Approach

What you built and the key decisions.

## Outcome

What shipped and the transferable lesson.
```

Current featured case studies: `alpha4gate.md`, `void-furnace.md`, and
`toybox.md`. A non-featured project needs no body — the frontmatter alone renders
its card.

---

## Edit identity (name, links, value prop)

All site identity lives in **one file: `src/consts.ts`**. Nothing is hard-coded in
a template. Edit there and every component updates at once:

| What                             | Constant        |
| -------------------------------- | --------------- |
| Display name                     | `SITE_NAME`     |
| GitHub profile URL               | `GITHUB_URL`    |
| This repo (footer "View source") | `REPO_URL`      |
| LinkedIn URL                     | `LINKEDIN_URL`  |
| Contact email (footer + mailto)  | `CONTACT_EMAIL` |
| Hero value-prop sentence         | `VALUE_PROP`    |
| Location / availability line     | `LOCATION`      |
| Footer "last updated" date       | `LAST_UPDATED`  |

Bump `LAST_UPDATED` (ISO `YYYY-MM-DD`) whenever you refresh the content.

---

## Replace the résumé

The résumé is served from `public/resume.pdf` and linked from the Resume section.
The committed file is a **placeholder** — drop your real PDF at `public/resume.pdf`
(same filename, replacing it) and push. No config change needed.

---

## Brand-token sync

The visual identity comes from brand tokens **vendored** into `src/assets/` from
the sibling `aberson-profile` repo:

- `src/assets/tokens.css`
- `src/assets/theme.tw.css`
- `src/assets/diagram-palette.json`

These are copies (so the site has no cross-repo build dependency) and are marked
DO-NOT-EDIT / kept out of Prettier. When the brand system changes upstream in
`../aberson-profile/brand/dist/`, re-sync all three with the helper script:

```powershell
.\scripts\sync-brand.ps1
```

It re-copies the three files from `../aberson-profile/brand/dist/` into
`src/assets/`, then you review the diff and push. (Never hand-edit the vendored
files — your edits would be overwritten on the next sync.)

---

## Local dev + quality gates

Run these before pushing anything non-trivial; the deploy Action runs the same
`check` / `lint` / `build` / `check:links` gates, so passing locally means a green
deploy.

```powershell
npm install          # one-time
npm run dev          # http://localhost:4321, hot reload
npm run build        # production build to dist/
npm run check        # astro check — types + content-schema validation
npm run lint         # prettier --check (run `npm run format` to auto-fix)
npm run check:links  # linkinator over dist/ — dead-link check
npm run check:a11y   # axe-core a11y scan (needs a prior `npm run build`)
```

Note: the deploy also enforces a **no-`TODO:`-in-src/** gate — any literal
`TODO:` left in `src/` (outside the vendored `src/assets/` tokens) fails the
build, so placeholders can't ship silently.

---

## Custom-domain switch (later, ~15 min — documented, not done yet)

The site is built **domain-ready**: `base: '/'` in `astro.config.mjs` means asset
paths already resolve from the root, so moving to a custom domain needs **no
path rewrite**. When you're ready:

1. Add `public/CNAME` containing just the domain (e.g. `abrahamrobison.com`).
2. In `astro.config.mjs`, change `site` from `https://aberson.github.io` to the
   custom domain (e.g. `https://abrahamrobison.com`). Leave `base: '/'` as-is.
3. Configure DNS at your registrar:
   - **Apex** (`example.com`): four `A` records to GitHub Pages —
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and the matching `AAAA` records if you want IPv6).
   - **`www` subdomain**: a `CNAME` record for `www` → `aberson.github.io`.
4. Push. GitHub Pages picks up the `CNAME` file; enable "Enforce HTTPS" in the
   repo's Pages settings once the certificate is issued.

> This section is a reference for the future upgrade. Do not create `public/CNAME`
> or change `site` until you actually own the domain and are ready to switch.
