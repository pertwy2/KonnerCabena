/**
 * Every piece of copy on the page.
 *
 * Anything in [SQUARE BRACKETS] is a placeholder that has not been
 * supplied yet — it renders in a muted italic so it is obvious on the
 * page. Replace the string, and the styling follows automatically
 * (see `isPlaceholder` below). No facts here are invented.
 */

export const isPlaceholder = (s: string) => s.trimStart().startsWith("[");

export const hero = {
  /** The large carved line, and the first half of the <h1>. */
  name: "Konner Cabena",
  /** Second half of the <h1> — together they carry the target search phrase. */
  role: "Voice Actor",
  intro: "Commercial, narration, character and animation. In your studio or mine.",
  /** Name of the original in assets/images/, without its extension. */
  photo: "KonnerHero",
} as const;

export const about = {
  heading: "About",
  photo: "KonnerAbout",
  body: [
    "[BIO PARAGRAPH ONE — who Konner is, the work he's known for, how he sounds. Two or three sentences.]",
    "[BIO PARAGRAPH TWO — training, studio and kit, direction and turnaround. Two or three sentences.]",
  ],
  credentialsLabel: "Where to find me",
  credentials: [
    { label: "IMDb", href: "https://www.imdb.com/name/nm14955974/" },
    { label: "Spotlight", href: "https://app.spotlight.com/1018-3499-6502" },
    { label: "SN Voices", href: "https://snvoices.com/gentlemen/konner-cabena/" },
  ] as { label: string; href: string | null }[],
  representedByLabel: "Represented by",
  /** `href: null` renders the agency's name without a link. */
  agents: [
    { name: "SN Voices", kind: "Voice", href: "https://snvoices.com/gentlemen/konner-cabena/" },
    { name: "Bazan", kind: "Acting", href: null },
  ] as { name: string; kind: string; href: string | null }[],
} as const;

/**
 * Past clients, shown as a strip of logos under the About section.
 *
 * `logo` names an image in assets/images/ (run `npm run images` after adding
 * one). `scale` balances them optically: a dense block logo reads larger than
 * a fine-lined one at the same height, so the heavy ones go smaller.
 */
export const workedWith = {
  label: "Worked with",
  brands: [
    { name: "BBC", logo: "logos/bbc", scale: 0.75 },
    { name: "Lightfader", logo: "logos/lightfader", scale: 1.3 },
    { name: "Sysdig", logo: "logos/sysdig", scale: 0.85 },
  ] as { name: string; logo: string; scale: number }[],
};

export type Reel = {
  id: string;
  title: string;
  duration: string;
  /** Seeds the deterministic waveform so each strip looks distinct. */
  seed: number;
  /** Path to the audio file, e.g. "/reels/commercial.mp3". Null until supplied. */
  src: string | null;
};

export const reels = {
  heading: "Voice Reels",
  items: [
    // Titles are taken from the audio filenames and durations measured from the
    // files themselves — both are easy to override with Konner's own wording.
    { id: "r1", title: "Commercial", duration: "0:53", seed: 1.2, src: "/Konner_Cabena_Commercial.mp3" },
    { id: "r2", title: "Documentary", duration: "0:51", seed: 3.7, src: "/Konner_Cabena_Documenrary.mp3" },
    { id: "r3", title: "Audiobook", duration: "2:04", seed: 6.1, src: "/Konner_Cabena_Audiobook.mp3" },
    { id: "r4", title: "Gaming", duration: "2:06", seed: 8.9, src: "/Konner_Cabena_Gaming.mp3" },
  ] satisfies Reel[],
} as const;

export const showReel = {
  heading: "On Camera",
  blurb: "One reel, start to finish.",
  label: "[ SHOW REEL — EMBED URL ]",
  /** A YouTube/Vimeo embed URL. Null until supplied. */
  embedUrl: null as string | null,
};

export const testimonials = {
  heading: "In their words",
  items: [
    { quote: "[TESTIMONIAL ONE — a short quote from a director, producer or agency. One or two sentences.]", attribution: "[NAME] · [ROLE, COMPANY]" },
    { quote: "[TESTIMONIAL TWO — a short quote. One or two sentences.]", attribution: "[NAME] · [ROLE, COMPANY]" },
    { quote: "[TESTIMONIAL THREE — a short quote. One or two sentences.]", attribution: "[NAME] · [ROLE, COMPANY]" },
  ],
} as const;

export const contact = {
  heading: "Get in touch",
  blurb:
    "Send a script, a brief, or just a rough idea of what you need. Every enquiry gets a real reply.",
  email: "[EMAIL ADDRESS]",
} as const;

export const nav = [
  { label: "Voice Reels", href: "#reels" },
  { label: "About", href: "#about" },
  { label: "Show Reel", href: "#showreel" },
  // { label: "Testimonials", href: "#words" },
] as const;

/** `className={phClass(value)}` — styles a string only while it is unfilled. */
export const phClass = (s: string) => (isPlaceholder(s) ? "ph" : undefined);
