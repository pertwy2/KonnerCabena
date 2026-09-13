/**
 * Builds responsive variants of every photo in assets/images/.
 *
 *   npm run images
 *
 * For each original it writes AVIF, WebP and JPEG at several widths into
 * public/images/, and records what it made in src/lib/images.generated.json,
 * which the <ResponsiveImage> component reads to build srcset.
 *
 * Filenames carry a hash of the original — KonnerHero-960.3f2a1b9c.avif — so
 * replacing a photo produces new URLs. That's what lets the files be served
 * from S3/CloudFront with a year-long immutable cache: a changed photo can
 * never be masked by a stale cached copy.
 *
 * Unchanged originals are skipped, and variants for replaced or deleted
 * originals are removed.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "assets/images";
const OUT_DIR = "public/images";
const MANIFEST = "src/lib/images.generated.json";

/**
 * Pixel widths to generate. The photo frames render between ~300 and ~480
 * CSS px, so these cover a 1x desktop (480), a 2x phone (640), a 2x tablet
 * (800), a 2x desktop (960) and a 3x phone (1200) without a large jump
 * between steps. Widths wider than the original are dropped, never upscaled.
 */
const WIDTHS = [360, 480, 640, 800, 960, 1200];

/** Listed best-first: <picture> offers them in this order. */
const FORMATS = [
  { ext: "avif", mime: "image/avif", encode: (img) => img.avif({ quality: 50, effort: 5 }) },
  { ext: "webp", mime: "image/webp", encode: (img) => img.webp({ quality: 78, effort: 5 }) },
  { ext: "jpg", mime: "image/jpeg", encode: (img) => img.jpeg({ quality: 80, mozjpeg: true }) },
];

const SOURCE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  const manifest = {};
  const sources = (await readdir(SRC_DIR)).filter((f) => SOURCE_EXT.test(f)).sort();

  for (const file of sources) {
    const name = path.parse(file).name;
    const srcPath = path.join(SRC_DIR, file);
    const original = await readFile(srcPath);
    const hash = createHash("sha1").update(original).digest("hex").slice(0, 8);

    const prior = previous[name];
    const outputsExist =
      prior?.hash === hash &&
      prior.widths.every((w) => FORMATS.every((f) => existsSync(path.join(OUT_DIR, `${name}-${w}.${hash}.${f.ext}`))));
    if (outputsExist) {
      manifest[name] = prior;
      console.log(`  ${name}: unchanged`);
      continue;
    }

    // .rotate() with no argument applies the EXIF orientation, so a photo
    // shot in portrait isn't served sideways once the metadata is stripped.
    const base = sharp(original).rotate();
    const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

    const widths = WIDTHS.filter((w) => w < width);
    if (widths.length === 0 || widths.at(-1) < Math.min(width, WIDTHS.at(-1))) widths.push(Math.min(width, WIDTHS.at(-1)));

    let bytes = 0;
    for (const w of widths) {
      // Output is converted to sRGB and stripped of metadata by default.
      const resized = base.clone().resize({ width: w, withoutEnlargement: true });
      for (const f of FORMATS) {
        const out = await f.encode(resized.clone()).toBuffer();
        await writeFile(path.join(OUT_DIR, `${name}-${w}.${hash}.${f.ext}`), out);
        bytes += out.length;
      }
    }

    // A ~20px blurred copy, inlined, so the frame shows the photo's colours
    // while the real file loads instead of sitting empty.
    const tiny = await base.clone().resize({ width: 20 }).blur(1.2).webp({ quality: 40 }).toBuffer();

    manifest[name] = {
      width,
      height,
      widths,
      hash,
      formats: FORMATS.map(({ ext, mime }) => ({ ext, mime })),
      placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    };
    console.log(
      `  ${name}: ${width}×${height}, ${kb(original.length)} original → ${widths.length} widths × ${FORMATS.length} formats (${kb(bytes)} total)`,
    );
  }

  // Remove variants belonging to replaced or deleted originals.
  const keep = new Set(
    Object.entries(manifest).flatMap(([name, m]) =>
      m.widths.flatMap((w) => m.formats.map((f) => `${name}-${w}.${m.hash}.${f.ext}`)),
    ),
  );
  let removed = 0;
  for (const f of await readdir(OUT_DIR)) {
    if (/^.+-\d+\.[0-9a-f]{8}\.(avif|webp|jpg)$/.test(f) && !keep.has(f)) {
      await rm(path.join(OUT_DIR, f));
      removed++;
    }
  }
  if (removed) console.log(`  removed ${removed} stale variant(s)`);

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`  wrote ${MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
