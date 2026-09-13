import Image from "next/image";
import { hero, isPlaceholder } from "@/lib/content";
import { SITE } from "@/lib/site";
import s from "./Hero.module.scss";

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

        <p className={s.tagline}>{hero.tagline}</p>
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
            <Image
              src={hero.photo}
              alt={`${SITE.name}, ${SITE.role.toLowerCase()}`}
              fill
              sizes="(max-width: 940px) 90vw, 45vw"
              className={s.img}
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
