/**
 * consts.ts — the SINGLE source of truth for site identity.
 *
 * Every component reads name / URLs / copy from here; nothing is hard-coded in a
 * template. Two fields (LinkedIn, email) intentionally ship as literal
 * "TODO:"-prefixed placeholders — a later step's grep gate refuses to launch
 * until the operator resolves them, so DO NOT drop the "TODO:" prefix here.
 */

/** Display name used for the brand mark, hero heading, and document title. */
export const SITE_NAME = "Abraham Robison";

/** GitHub profile — drives the SocialLinks GitHub icon. */
export const GITHUB_URL = "https://github.com/aberson";

/** This repository — the footer "View source" link. */
export const REPO_URL = "https://github.com/aberson/aberson.github.io";

/**
 * LinkedIn profile URL. Placeholder until the operator provides it; the literal
 * "TODO:" prefix is load-bearing (a later grep gate enforces resolution).
 */
export const LINKEDIN_URL = "TODO: operator to provide";

/**
 * Contact email. Placeholder until the operator provides it; the literal "TODO:"
 * prefix is load-bearing (a later grep gate enforces resolution).
 */
export const CONTACT_EMAIL = "TODO: operator to provide";

/** One-sentence value proposition — the hero lead paragraph. */
export const VALUE_PROP =
  "Applied AI engineer with deep finance roots — I design and ship agentic, judge-gated, cost-aware systems, grounded in real financial work.";

/** Short location / availability line. */
export const LOCATION = "Bay Area · open to remote and relocation";

/**
 * On-page section slugs — the SINGLE source of truth for anchor ids. NAV_ITEMS
 * hrefs, the index.astro `<section id>`s, and the Hero CTAs all derive from this,
 * so renaming a slug updates every reference at once.
 */
export const ANCHORS = {
  work: "work",
  about: "about",
  resume: "resume",
  contact: "contact",
} as const;

/** A primary-nav entry: a visible label and the in-page anchor it scrolls to. */
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/** Primary navigation — one entry per on-page section stub. Hrefs derive from ANCHORS. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Work", href: `#${ANCHORS.work}` },
  { label: "About", href: `#${ANCHORS.about}` },
  { label: "Resume", href: `#${ANCHORS.resume}` },
  { label: "Contact", href: `#${ANCHORS.contact}` },
];

/** ISO date the site content was last updated — the footer stamp. */
export const LAST_UPDATED = "2026-07-19";

/**
 * True when a value is a resolved, real value rather than a "TODO:" placeholder.
 * Placeholder-backed links (LinkedIn, email) are gated on this: SocialLinks and
 * Footer omit them entirely while unresolved, so no dead `todo:` / invalid
 * `mailto:` link ever renders. They appear automatically once the operator fills
 * the real values in here.
 */
export function isResolved(v: string): boolean {
  return !v.startsWith("TODO:");
}
