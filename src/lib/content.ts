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

/**
 * Representation and past clients — a slim band under the hero rather than a
 * full section. `href: null` renders a name without a link.
 */
export const affiliations = {
  representedBy: {
    label: "Represented by",
    agents: [
      { name: "SN Voices", kind: "Voice", href: "https://snvoices.com/gentlemen/konner-cabena/" },
      { name: "Bazan", kind: "Acting", href: null },
    ] as { name: string; kind: string; href: string | null }[],
  },
  workedWith: {
    label: "Worked with",
    /** Add names as they come; the group hides itself while the list is empty. */
    brands: ["BBC", "Lightfader", "Sysdig"] as string[],
  },
};

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
} as const;

export type Reel = {
  id: string;
  n: string;
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
    { id: "r1", n: "01", title: "Commercial", duration: "0:53", seed: 1.2, src: "/Konner_Cabena_Commercial.mp3" },
    { id: "r2", n: "02", title: "Documentary", duration: "0:51", seed: 3.7, src: "/Konner_Cabena_Documenrary.mp3" },
    { id: "r3", n: "03", title: "Audiobook", duration: "2:04", seed: 6.1, src: "/Konner_Cabena_Audiobook.mp3" },
    { id: "r4", n: "04", title: "Gaming", duration: "2:06", seed: 8.9, src: "/Konner_Cabena_Gaming.mp3" },
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
