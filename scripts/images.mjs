/**
 * Builds responsive variants of every image in assets/images/.
 *
 *   npm run images
 *
 * For each original it writes AVIF, WebP and a fallback format at several
 * widths into public/images/ (mirroring any subfolder), and records what it
 * made in src/lib/images.generated.json, which <ResponsiveImage> reads to
 * build srcset. An image is named by its path without the extension:
 * assets/images/logos/bbc.png is "logos/bbc".
 *
 * Filenames carry a hash of the original plus the settings used to encode it
 * — KonnerHero-960.3f2a1b9c.avif — so a replaced photo, or a change to the
 * widths or quality below, produces new URLs. That's what lets the files be
 * served from S3/CloudFront with a year-long immutable cache.
 *
 * Unchanged images are skipped, and variants for replaced or deleted
 * originals are removed. Only files matching the generator's own naming are
 * ever deleted.
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
 * Settings per kind of image, chosen by top-level folder.
 *
 * Photos render between ~240 and ~480 CSS px, so their widths cover a 1x
 * desktop (480) through a 3x phone (1200). Logos render ~30–40px tall, a few
 * hundred px wide at most even on a 3x screen. Logos are trimmed to their
 * visible edges, so transparent padding in the source can't throw off their
 * size on the page, and get no blurred placeholder.
 */
const PROFILES = {
  photo: { widths: [360, 480, 640, 800, 960, 1200], trim: false, placeholder: true },
  logo: { widths: [120, 180, 240, 360, 480], trim: true, placeholder: false },
};
const profileFor = (name) => (name.startsWith("logos/") ? PROFILES.logo : PROFILES.photo);

const AVIF = { ext: "avif", mime: "image/avif", encode: (img) => img.avif({ quality: 50, effort: 5 }) };
const WEBP = { ext: "webp", mime: "image/webp", encode: (img) => img.webp({ quality: 78, effort: 5 }) };
const JPG = { ext: "jpg", mime: "image/jpeg", encode: (img) => img.jpeg({ quality: 80, mozjpeg: true }) };
const PNG = { ext: "png", mime: "image/png", encode: (img) => img.png({ compressionLevel: 9, palette: true }) };

/** Best first — <picture> offers them in this order. JPEG has no transparency, so transparent images fall back to PNG. */
const formatsFor = (hasAlpha) => [AVIF, WEBP, hasAlpha ? PNG : JPG];

/** Changing any encoder setting changes this, and so every hash. */
const ENCODER_VERSION = "avif50e5-webp78e5-jpg80moz-png9pal";

const SOURCE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const VARIANT = /^.+-\d+\.[0-9a-f]{8}\.(avif|webp|jpg|png)$/;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

async function main() {
  const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  const manifest = {};
  const sources = (await walk(SRC_DIR)).filter((f) => SOURCE_EXT.test(f)).sort();

  for (const srcPath of sources) {
    const rel = path.relative(SRC_DIR, srcPath);
    const name = rel.slice(0, -path.extname(rel).length).split(path.sep).join("/");
    const profile = profileFor(name);
    const original = await readFile(srcPath);
    const hash = createHash("sha1")
      .update(original)
      .update(JSON.stringify({ profile, ENCODER_VERSION }))
      .digest("hex")
      .slice(0, 8);

    const prior = previous[name];
    const outputsExist =
      prior?.hash === hash &&
      prior.widths.every((w) => prior.formats.every((f) => existsSync(path.join(OUT_DIR, `${name}-${w}.${hash}.${f.ext}`))));
    if (outputsExist) {
      manifest[name] = prior;
      console.log(`  ${name}: unchanged`);
      continue;
    }

    // .rotate() with no argument applies the EXIF orientation, so a photo shot
    // in portrait isn't served sideways once the metadata is stripped.
    let base = sharp(original).rotate();
    if (profile.trim) base = sharp(await base.trim().toBuffer());
    const { info } = await base.clone().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const hasAlpha = (await base.clone().stats()).isOpaque === false;
    const formats = formatsFor(hasAlpha);

    const widths = profile.widths.filter((w) => w < width);
    const cap = Math.min(width, profile.widths.at(-1));
    if (widths.at(-1) !== cap) widths.push(cap);

    await mkdir(path.dirname(path.join(OUT_DIR, name)), { recursive: true });
    let bytes = 0;
    for (const w of widths) {
      // Output is converted to sRGB and stripped of metadata by default.
      const resized = base.clone().resize({ width: w, withoutEnlargement: true });
      for (const f of formats) {
        const out = await f.encode(resized.clone()).toBuffer();
        await writeFile(path.join(OUT_DIR, `${name}-${w}.${hash}.${f.ext}`), out);
        bytes += out.length;
      }
    }

    // A ~20px blurred copy, inlined, so a photo frame shows the photo's
    // colours while the real file loads instead of sitting empty.
    const placeholder = profile.placeholder
      ? `data:image/webp;base64,${(await base.clone().resize({ width: 20 }).blur(1.2).webp({ quality: 40 }).toBuffer()).toString("base64")}`
      : null;

    manifest[name] = { width, height, widths, hash, formats: formats.map(({ ext, mime }) => ({ ext, mime })), placeholder };
    console.log(
      `  ${name}: ${width}×${height}${hasAlpha ? " (transparent)" : ""}, ${kb(original.length)} original → ` +
        `${widths.length} widths × ${formats.length} formats (${kb(bytes)} total)`,
    );
  }

  // Remove variants belonging to replaced or deleted originals.
  const keep = new Set(
    Object.entries(manifest).flatMap(([name, m]) =>
      m.widths.flatMap((w) => m.formats.map((f) => path.join(OUT_DIR, `${name}-${w}.${m.hash}.${f.ext}`))),
    ),
  );
  let removed = 0;
  if (existsSync(OUT_DIR)) {
    for (const file of await walk(OUT_DIR)) {
      if (VARIANT.test(path.basename(file)) && !keep.has(file)) {
        await rm(file);
        removed++;
      }
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
