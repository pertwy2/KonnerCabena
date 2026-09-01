import { hero } from "@/lib/content";
import s from "./Hero.module.scss";

/**
 * The <h1> deliberately opens with "Konner Cabena · Voice Actor" before the
 * tagline: the name otherwise exists only inside the logo PNG, which no
 * crawler can read. The name line is styled small so the tagline still
 * dominates visually.
 */
export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.copy}>
        <h1 id="hero-title" className={s.title}>
          <span className={s.name}>{hero.name}</span>
          <span className={s.tagline}>{hero.tagline}</span>
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
        <span className="ph">{hero.photo}</span>
      </div>
    </section>
  );
}
