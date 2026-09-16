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
npm run images   # regenerate responsive photo variants (after adding/changing a photo)
npm run og       # regenerate public/og.png (only after changing the logo)
npm run assets:upload  # push images + audio to S3/CloudFront (see Hosting on AWS)
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

- The show reel embed URL, and the three testimonials
- A real contact email

**Audio:** MP3s live in `public/audio/` and each reel's `src` points at one (e.g.
`"/audio/Konner_Cabena_Commercial.mp3"`). After adding or replacing one, run
`npm run assets:upload`.

## Images

No image is served at its original size. Originals live in
**`assets/images/`**, which isn't deployed; `npm run images` turns each one
into AVIF plus a JPEG fallback (PNG for transparent images) in
`public/images/`, and records them in `src/lib/images.generated.json`.

Each kind gets only the widths real devices actually pick: photos 480, 800
and 960px; logos 120, 240 and 360px; the nav logo (`brand/logo`) 200 and
380px. Every current major browser takes the AVIF — typically 11–39KB for a
photo and under 10KB for the nav logo — and the rest get the fallback.

The page renders them through `<ResponsiveImage>`, a `<picture>` element: the
browser takes the first format it supports and the smallest width that covers
the slot at its pixel density. What "the slot" is comes from the `sizes`
string beside each photo in `Hero.tsx` and `About.tsx`, which mirrors that
section's CSS breakpoints — **if you change a photo frame's padding, gap or
max-width, update its `sizes` to match**, or phones will quietly download
larger files than they need.

To add or replace a photo: put the original in `assets/images/`, run
`npm run images`, and reference it in `content.ts` by filename without the
extension (`photo: "KonnerHero"`). Commit `public/images/` and the manifest.
Unchanged originals are skipped, and variants of replaced ones are deleted.

### Client logos

Logos for the "Worked with" strip go in **`assets/images/logos/`** and follow
the same flow, with settings suited to logos: smaller widths, edges trimmed so
transparent padding can't throw off their size, and a PNG fallback instead of
JPEG so transparency survives. Add one to `workedWith.brands` in `content.ts`:

```ts
{ name: "BBC", logo: "logos/bbc", scale: 0.75 },
```

`scale` balances them by eye — a dense block logo looks bigger than a
fine-lined one at the same height, so heavy logos take a lower scale. A logo
must have a genuinely transparent background: `assets/logo-originals/` keeps
the BBC file as supplied, whose "transparent" checkerboard was painted into
the pixels and had to be removed.

### Hosting on AWS

Production builds serve images and audio from **CloudFront**, in front of a
private S3 bucket. The bucket blocks all public access; only this distribution
can read it.

| | |
|---|---|
| Bucket | `konner-cabena-assets` (eu-west-2, London) |
| CloudFront | `E11QIQSEW7PJBW` → `https://d3maflhglpwh6j.cloudfront.net` |
| Layout | `images/…` and `audio/…`, mirroring `public/` |

`.env.production` sets `NEXT_PUBLIC_ASSET_BASE_URL` to the CloudFront URL, so
`npm run build` points every image and reel there automatically. `npm run dev`
ignores that file and serves them from `public/`. The URL isn't a secret — it
ends up in the page's HTML — so the file is committed.

**After adding or changing a photo, logo or reel:**

```bash
npm run images         # only if an image changed
npm run assets:upload  # needs the AWS CLI signed in to the account
```

Upload before you deploy a build that references new files, or those images
will 404 until you do. Image filenames carry a content hash, so they're cached
for a year and a changed photo always gets a new URL. Reel filenames don't
change, so they're cached for a day and the script clears CloudFront's copies
whenever one is uploaded. Nothing is ever deleted from the bucket, since an
older deployed build may still reference older files.

## SEO

Handled in `src/app/layout.tsx` (metadata, Open Graph, Twitter card, JSON-LD
`Person` schema) plus `src/app/sitemap.ts` and `src/app/robots.ts`.

The `<h1>` is "Konner Cabena Voice Actor" — the name as the large headline,
the role beneath it. The name otherwise appears only inside the logo PNG,
which no crawler can read, so without it the page would have no crawlable
instance of the target phrase in its most important heading.

Social and credential links are only emitted into the schema's `sameAs` array once they hold
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
