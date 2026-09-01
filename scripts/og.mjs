/**
 * Generates public/og.png — the 1200x630 card shown when the site is
 * shared. Run with `npm run og` after changing the logo.
 *
 * Done as a committed static asset rather than Next's ImageResponse,
 * which is awkward under `output: "export"`.
 */
import sharp from "sharp";

const W = 1200;
const H = 630;
const SURFACE = "#e9e3db";

const logo = await sharp("public/logo.png")
  .resize({ width: 640, fit: "inside" })
  .toBuffer();

const { width, height } = await sharp(logo).metadata();

// Soft ambient shadow so the logo rests on the surface rather than floating.
const shadow = await sharp(logo)
  .blur(18)
  .modulate({ brightness: 0.35 })
  .toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: SURFACE },
})
  .composite([
    {
      input: shadow,
      left: Math.round((W - width) / 2) + 12,
      top: Math.round((H - height) / 2) + 16,
    },
    {
      input: logo,
      left: Math.round((W - width) / 2),
      top: Math.round((H - height) / 2),
    },
  ])
  .png()
  .toFile("public/og.png");

console.log(`og.png written — ${W}x${H}, logo ${width}x${height}`);
