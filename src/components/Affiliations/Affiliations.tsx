import { affiliations } from "@/lib/content";
import s from "./Affiliations.module.scss";

/**
 * A slim credibility band under the hero: who represents Konner and who he's
 * worked with. Deliberately not a full section — names in type, no logos, so
 * it costs almost no scroll and needs no brand assets.
 */
export default function Affiliations() {
  const { representedBy, workedWith } = affiliations;

  return (
    <section className={s.section} aria-label="Representation and clients">
      <div className={s.tray}>
        <div className={s.group}>
          <p className={s.label} id="represented-by">
            {representedBy.label}
          </p>
          <ul className={s.list} aria-labelledby="represented-by">
            {representedBy.agents.map((a) => (
              <li key={a.name} className={s.item}>
                {a.href ? (
                  <a href={a.href} className={s.name} target="_blank" rel="noopener noreferrer">
                    {a.name}
                  </a>
                ) : (
                  <span className={s.name}>{a.name}</span>
                )}{" "}
                <span className={s.kind}>{a.kind}</span>
              </li>
            ))}
          </ul>
        </div>

        {workedWith.brands.length > 0 && (
          <div className={s.group}>
            <p className={s.label} id="worked-with">
              {workedWith.label}
            </p>
            <ul className={s.list} aria-labelledby="worked-with">
              {workedWith.brands.map((b) => (
                <li key={b} className={`${s.item} ${s.brand}`}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
