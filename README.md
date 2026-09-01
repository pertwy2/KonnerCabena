# Konner Cabena — Voice Actor

A single-page portfolio site for voice actor Konner Cabena, built as a
static Next.js export and optimised to rank for **"Konner Cabena voice actor"**.

The design is neumorphic: the whole page is one continuous warm surface, and
every panel is pressed into or pushed out of it. The light source is fixed
top-left throughout — if you add components, keep it that way, or the
material illusion breaks.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> ./out
npm run og       # regenerate public/og.png (only after changing the logo)
```

`npm run build` emits plain HTML to `out/`, which can be served by anything —
GitHub Pages, Vercel, Netlify, S3, a plain web server.

## Before you deploy — two things to change

Both live in **`src/lib/site.ts`**:

1. **`SITE_URL`** is a placeholder (`https://konnercabena.com`). Every
   canonical URL, Open Graph tag, sitemap entry and JSON-LD `url` derives
   from it. Pointing it at a domain you don't control is worse than leaving
   it — it tells Google the real page is somewhere else.
2. **`FORM_ENDPOINT`** is empty, so the contact form is not connected. Set it
   to a Formspree/Basin/Netlify endpoint, *or* fill in a real `email` in
   `src/lib/content.ts` and the form falls back to opening a pre-filled mail
   client. Until one of those is done the form shows a visible notice and its
   submit button is disabled — deliberately, so it can't silently swallow an
   enquiry.

## Filling in the content

All copy lives in **`src/lib/content.ts`**. Anything wrapped in
`[SQUARE BRACKETS]` is a placeholder that hasn't been supplied yet and
renders in muted italic on the page. Replace the string and the placeholder
styling disappears on its own.

Still to supply:

- Bio paragraphs, and the two photos (`public/`, then swap the placeholder divs)
- Reel titles, categories and durations — plus the audio files themselves
- Credential links (IMDb, Spotlight, agent) and social URLs in `src/lib/site.ts`
- The show reel embed URL, and the three testimonials
- A real contact email

**Audio:** drop MP3s in `public/reels/` and set each reel's `src` (e.g.
`"/reels/commercial.mp3"`). The players are already wired — until a `src`
exists the buttons drive the visual state only, and say so to screen readers.

## SEO

Handled in `src/app/layout.tsx` (metadata, Open Graph, Twitter card, JSON-LD
`Person` schema) plus `src/app/sitemap.ts` and `src/app/robots.ts`.

The `<h1>` deliberately opens with "Konner Cabena · Voice Actor" before the
tagline. The name otherwise appears only inside the logo PNG, which no
crawler can read — without that line the page has no crawlable instance of
the target phrase in its most important heading.

Social links are only emitted into the schema's `sameAs` array once they hold
real URLs, so the structured data never ships placeholder junk.

## Styling

SCSS modules, one per component. The shared material system —
palette, elevation mixins, the carved-type treatment, the spring easing and
the five breakpoints — is in `src/styles/_theme.scss`, imported by every
module with `@use "../../styles/theme" as *`.

Accent colours (coral, teal, mustard, taken from the logo) are for fills,
indicators and glows only, never body text: coral on the surface colour is
about 2.3:1 and fails contrast outright. Darkened `*-ink` variants exist for
the rare case accent-coloured text is needed.
