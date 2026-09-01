import { phClass, testimonials } from "@/lib/content";
import s from "./Testimonials.module.scss";

export default function Testimonials() {
  return (
    <section id="words" className={s.section} aria-labelledby="words-title">
      <h2 id="words-title" className={s.heading}>
        {testimonials.heading}
      </h2>

      <div className={s.list}>
        {testimonials.items.map((t, i) => (
          <figure key={i} className={`${s.quote} ${i % 2 === 1 ? s.right : ""}`}>
            <blockquote className={s.text}>
              <span className={phClass(t.quote)}>{t.quote}</span>
            </blockquote>
            <figcaption className={s.by}>
              <span className={phClass(t.attribution)}>{t.attribution}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
