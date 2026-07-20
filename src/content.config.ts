/**
 * content.config.ts — content-collection schemas.
 *
 * Astro v5+ content-layer API: collections are declared with a `loader` (the
 * `glob()` file loader) rather than the legacy folder-auto-detect. The Zod schema
 * is the SINGLE source of truth for a project's frontmatter shape — a malformed
 * `src/content/projects/*.md` fails `astro build` loudly (Zod validation error)
 * rather than rendering a half-blank card.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// Astro 7 deprecates the `z` re-export from `astro:content`; `astro/zod` is the
// current path for the same Zod instance the content layer validates against.
import { z } from "astro/zod";

/**
 * `projects` — one markdown file per portfolio project (filename = slug). The
 * body (Step 4) holds the optional long-form case study; everything the card
 * grid renders lives in this frontmatter.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    /** Display name / card heading. */
    title: z.string(),
    /** One-paragraph summary — VERBATIM from the GitHub profile README. */
    blurb: z.string(),
    /** Tech-stack labels, rendered as chips. */
    tech: z.array(z.string()),
    /** Source-repo URL (the card's "Code" link). */
    repo: z.url().optional(),
    /** Live-demo URL (the card's "Live" link), when one exists. */
    demo: z.url().optional(),
    /** Optional thumbnail path (none set yet — cards render text-only until then). */
    thumbnail: z.string().optional(),
    /** Sort key — the grid renders ascending by this. */
    order: z.number(),
    /** Featured projects get a long-form case study (Step 4). */
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
