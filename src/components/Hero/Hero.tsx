import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { hero, isPlaceholder } from "@/lib/content";
import { SITE } from "@/lib/site";
import s from "./Hero.module.scss";

/**
 * The rendered width of the photo, mirroring Hero.module.scss: the recess is
 * a grid column (or up to 420px once stacked) minus its 22px padding each
 * side. Keep in step with the padding, gap and max-width there.
 *
 *   ≤420px   16px page padding          → 100vw − 76px
 *   ≤463px   22px page padding          → 100vw − 88px
 *   ≤940px   stacked, capped at 420px   → 376px
 *   ≤1180px  two columns, 40px padding, 48px gap → 50vw − 108px
 *   wider    capped 1180px container    → 456px
 */
const PHOTO_SIZES =
  "(max-width: 420px) calc(100vw - 76px), (max-width: 463px) calc(100vw - 88px), " +
  "(max-width: 940px) 376px, (max-width: 1180px) calc(50vw - 108px), 456px";

/**
 * The name is the headline. People scroll past the hero quickly and don't
 * come back, so it has to register on the way through — and "Konner Cabena
 * Voice Actor" in the <h1> is also the phrase the page is built to rank for.
 */
export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.copy}>
        <h1 id="hero-title" className={s.title}>
          <span className={s.name}>{hero.name}</span>{" "}
          <span className={s.role}>{hero.role}</span>
        </h1>

        <p className={s.intro}>{hero.intro}</p>

        <div className={s.ctas}>
          <a href="#reels" className={s.primary}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Hear the reels
          </a>
          <a href="#contact" className={s.secondary}>
            Start a booking
          </a>
        </div>
      </div>

      <div className={s.photo}>
        {isPlaceholder(hero.photo) ? (
          <span className="ph">{hero.photo}</span>
        ) : (
          // Sits inside the recess rather than covering it, so the pressed
          // shadow still frames the print.
          <div className={s.frame}>
            <ResponsiveImage
              name={hero.photo}
              alt={`${SITE.name}, ${SITE.role.toLowerCase()}`}
              sizes={PHOTO_SIZES}
              className={s.img}
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
