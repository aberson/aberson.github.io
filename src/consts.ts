/**
 * consts.ts — the SINGLE source of truth for site identity.
 *
 * Every component reads name / URLs / copy from here; nothing is hard-coded in a
 * template. All identity values below are resolved, real values.
 */

/** Display name used for the brand mark, hero heading, and document title. */
export const SITE_NAME = "Abraham Robison";

/** GitHub profile — drives the SocialLinks GitHub icon. */
export const GITHUB_URL = "https://github.com/aberson";

/** This repository — the footer "View source" link. */
export const REPO_URL = "https://github.com/aberson/aberson.github.io";

/** LinkedIn profile URL — drives the SocialLinks + Contact LinkedIn links. */
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/abraham-robison-7183982a/";

/** Contact email — the footer email link and the Contact section's mailto. */
export const CONTACT_EMAIL = "aberobison@gmail.com";

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

/** ISO date the site content was last updated — the footer + résumé stamp. */
export const LAST_UPDATED = "2026-07-21";
