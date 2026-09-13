import manifest from "./images.generated.json";

/**
 * Where the generated image variants are served from.
 *
 * Empty means this site's own /images/ folder. Once the files are on AWS, set
 * NEXT_PUBLIC_IMAGE_BASE_URL at build time to the bucket or CloudFront origin
 * (e.g. https://d1234abcd.cloudfront.net) and every srcset points there. The
 * files must keep their paths: <base>/images/<name>-<width>.<hash>.<ext>.
 */
export const IMAGE_BASE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "").replace(/\/+$/, "");

/** One entry in images.generated.json, written by scripts/images.mjs. */
export type GeneratedImage = {
  width: number;
  height: number;
  widths: number[];
  hash: string;
  formats: { ext: string; mime: string }[];
  placeholder: string;
};

const images = manifest as Record<string, GeneratedImage>;

/** Fails the build — rather than shipping a broken image — if a name is unknown. */
export function getImage(name: string): GeneratedImage {
  const image = images[name];
  if (!image) {
    throw new Error(
      `No generated image named "${name}". Put the original in assets/images/ and run \`npm run images\`.`,
    );
  }
  return image;
}

export const imageUrl = (name: string, image: GeneratedImage, width: number, ext: string) =>
  `${IMAGE_BASE_URL}/images/${name}-${width}.${image.hash}.${ext}`;

export const imageSrcSet = (name: string, image: GeneratedImage, ext: string) =>
  image.widths.map((w) => `${imageUrl(name, image, w, ext)} ${w}w`).join(", ");
