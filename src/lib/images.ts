import { assetUrl } from "./assets";
import manifest from "./images.generated.json";

/** One entry in images.generated.json, written by scripts/images.mjs. */
export type GeneratedImage = {
  width: number;
  height: number;
  widths: number[];
  hash: string;
  formats: { ext: string; mime: string }[];
  /** Blurred inline preview; null for logos, where a blur would look like a smudge. */
  placeholder: string | null;
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
  assetUrl(`/images/${name}-${width}.${image.hash}.${ext}`);

export const imageSrcSet = (name: string, image: GeneratedImage, ext: string) =>
  image.widths.map((w) => `${imageUrl(name, image, w, ext)} ${w}w`).join(", ");
