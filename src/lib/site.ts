/**
 * Single source of truth for anything that changes when the site moves,
 * gets a domain, or wires up a real form.
 */

/**
 * ⚠️  CHANGE THIS BEFORE DEPLOYING.
 *
 * Every canonical URL, Open Graph tag, sitemap entry and JSON-LD `url`
 * is derived from this one string. Pointing it at a domain you do not
 * control is worse than useless — it tells Google the real page lives
 * somewhere else. Hosting was undecided at build time, so this is a
 * placeholder.
 */
export const SITE_URL = "https://konnercabena.com";

export const SITE = {
  name: "Konner Cabena",
  role: "Voice Actor",
  /** Used verbatim as the meta description — keep it near 155 characters. */
  description:
    "Konner Cabena is a voice actor working across commercial, narration, character and animation. Hear the reels and book a session.",
  /** Disciplines, reused in the JSON-LD `knowsAbout` array. */
  disciplines: [
    "Commercial Voiceover",
    "Narration",
    "Character Voices",
    "Animation",
  ],
} as const;

/**
 * A static export has no API routes, so the contact form needs a
 * third-party endpoint (Formspree, Basin, Netlify Forms…).
 *
 * While this is empty the form falls back to opening a pre-filled
 * mail client instead, and the UI says so — it is never a dead end.
 */
export const FORM_ENDPOINT = "";

/**
 * Social and credential links. `href: null` renders the entry as an
 * unfilled placeholder rather than a broken link, and keeps it out of
 * the JSON-LD `sameAs` array.
 */
export const LINKS: { label: string; href: string | null }[] = [
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: null },
  { label: "YouTube", href: null },
];

/** Only real URLs belong in `sameAs` — placeholders would poison the schema. */
export const sameAs = LINKS.map((l) => l.href).filter(
  (h): h is string => typeof h === "string" && h.length > 0,
);
