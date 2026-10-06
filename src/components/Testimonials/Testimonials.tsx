import { testimonials } from "@/lib/content";
import s from "./Testimonials.module.scss";

export default function Testimonials() {
  const { items } = testimonials;
  if (items.length === 0) return null;

  // A lone quote is centred; two or more stagger left and right.
  const lone = items.length === 1;

  return (
    <section id="words" className={s.section} aria-labelledby="words-title">
      <h2 id="words-title" className={s.heading}>
        {testimonials.heading}
      </h2>

      <div className={s.list}>
        {items.map((t, i) => (
          <figure
            key={t.name}
            className={`${s.quote} ${lone ? s.lone : i % 2 === 1 ? s.right : ""}`}
          >
            <span className={s.mark} aria-hidden="true">
              “
            </span>
            <blockquote className={s.text}>
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className={s.by}>
              <span className={s.name}>{t.name}</span>
              <span className={s.role}>
                {t.role}, {t.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
