import type { CSSProperties } from "react";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { workedWith } from "@/lib/content";
import { getImage } from "@/lib/images";
import s from "./WorkedWith.module.scss";

/** Base logo height in CSS px, before each logo's optical `scale`. */
const LOGO_HEIGHT = 40;
/** Same, at or below 680px. */
const LOGO_HEIGHT_PHONE = 30;

/**
 * Past clients as a strip of logos, under the About section.
 *
 * Each logo is drawn at a fixed height, so its rendered width is simply
 * height × scale × aspect ratio. That makes `sizes` exact, and the heights
 * are passed to CSS from here so the two can't drift apart.
 */
export default function WorkedWith() {
  if (workedWith.brands.length === 0) return null;

  return (
    <section className={s.section} aria-labelledby="worked-with">
      <div className={s.tray}>
        <h2 id="worked-with" className={s.label}>
          {workedWith.label}
        </h2>
        <ul className={s.logos}>
          {workedWith.brands.map((b) => {
            const image = getImage(b.logo);
            const ratio = image.width / image.height;
            const h = LOGO_HEIGHT * b.scale;
            const hPhone = LOGO_HEIGHT_PHONE * b.scale;
            const sizes = `(max-width: 680px) ${Math.ceil(hPhone * ratio)}px, ${Math.ceil(h * ratio)}px`;
            return (
              <li
                key={b.name}
                className={s.item}
                style={{ "--h": `${h}px`, "--h-phone": `${hPhone}px` } as CSSProperties}
              >
                <ResponsiveImage name={b.logo} alt={b.name} sizes={sizes} className={s.logo} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
