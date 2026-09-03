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
  /** Small line, first in the <h1>. Carries the target search phrase. */
  name: "Konner Cabena · Voice Actor",
  /** The large carved line. */
  tagline: "The voice that stays in the room.",
  intro:
    "Commercial, narration, character and animation work — recorded, directed and delivered clean.",
  photo: "/KonnerHero.jpg",
} as const;

export const about = {
  heading: "About",
  photo: "/KonnerAbout.jpg",
  body: [
    "[BIO PARAGRAPH ONE — who Konner is, the work he's known for, how he sounds. Two or three sentences.]",
    "[BIO PARAGRAPH TWO — training, studio and kit, direction and turnaround. Two or three sentences.]",
  ],
  credentialsLabel: "Credentials",
  credentials: [
    { label: "[IMDb]", href: null },
    { label: "[Spotlight]", href: null },
    { label: "[Agent / Representation]", href: null },
  ] as { label: string; href: string | null }[],
} as const;

export type Reel = {
  id: string;
  n: string;
  title: string;
  note: string;
  duration: string;
  /** Seeds the deterministic waveform so each strip looks distinct. */
  seed: number;
  /** Path to the audio file, e.g. "/reels/commercial.mp3". Null until supplied. */
  src: string | null;
};

export const reels = {
  heading: "Voice Reels",
  items: [
    { id: "r1", n: "01", title: "[REEL 01 — TITLE]", note: "[Category · what it shows]", duration: "[0:00]", seed: 1.2, src: "/Konner_Cabena_Commercial.mp3" },
    { id: "r2", n: "02", title: "[REEL 02 — TITLE]", note: "[Category · what it shows]", duration: "[0:00]", seed: 3.7, src: "/Konner_Cabena_Documenrary.mp3" },
    { id: "r3", n: "03", title: "[REEL 03 — TITLE]", note: "[Category · what it shows]", duration: "[0:00]", seed: 6.1, src: "/Konner_Cabena_Audiobook.mp3" },
    { id: "r4", n: "04", title: "[REEL 04 — TITLE]", note: "[Category · what it shows]", duration: "[0:00]", seed: 8.9, src: "/Konner - Gaming Reel.mp3" },
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
  projectTypes: [
    "Commercial",
    "Narration",
    "Character / Animation",
    "Video game",
    "Something else",
  ],
} as const;

export const nav = [
  { label: "Voice Reels", href: "#reels" },
  { label: "About", href: "#about" },
  { label: "Show Reel", href: "#showreel" },
  // { label: "Testimonials", href: "#words" },
] as const;

/** `className={phClass(value)}` — styles a string only while it is unfilled. */
export const phClass = (s: string) => (isPlaceholder(s) ? "ph" : undefined);
