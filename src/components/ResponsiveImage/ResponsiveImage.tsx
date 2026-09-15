import { getImage, imageSrcSet, imageUrl } from "@/lib/images";

type Props = {
  /** The original's filename in assets/images/, without the extension. */
  name: string;
  alt: string;
  /**
   * The width the image actually renders at, per breakpoint. The browser
   * multiplies this by the screen's pixel density and picks the smallest
   * variant that covers it, so it must match the CSS — an over-estimate
   * wastes bytes, an under-estimate looks soft.
   */
  sizes: string;
  /** Above the fold: load immediately, at high priority. */
  priority?: boolean;
  className?: string;
};

/**
 * A <picture> offering AVIF, then a JPEG (or PNG) fallback, each at every
 * generated width. The browser takes the first format it supports and the
 * width that fits the slot at its pixel density.
 *
 * Not next/image: under a static export it has no optimiser to resize with,
 * and it can't emit per-format <source> elements at all.
 */
export default function ResponsiveImage({ name, alt, sizes, priority = false, className }: Props) {
  const image = getImage(name);
  const fallback = image.formats[image.formats.length - 1];
  const modern = image.formats.slice(0, -1);
  // For the rare browser that ignores srcset: a mid-sized file, not the largest.
  const fallbackWidth = image.widths.find((w) => w >= 800) ?? image.widths[image.widths.length - 1];

  return (
    <picture>
      {modern.map((f) => (
        <source key={f.ext} type={f.mime} srcSet={imageSrcSet(name, image, f.ext)} sizes={sizes} />
      ))}
      <img
        src={imageUrl(name, image, fallbackWidth, fallback.ext)}
        srcSet={imageSrcSet(name, image, fallback.ext)}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "auto" : "async"}
        // A ~20px blurred copy of the photo, inlined: the frame shows its
        // colours while the real file loads instead of sitting empty.
        style={
          image.placeholder
            ? { backgroundImage: `url("${image.placeholder}")`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      />
    </picture>
  );
}
