import Image from "next/image";
import { about, isPlaceholder, phClass } from "@/lib/content";
import { SITE } from "@/lib/site";
import s from "./About.module.scss";

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className={s.section} aria-labelledby="about-title">
      <div className={s.photo}>
        {isPlaceholder(about.photo) ? (
          <span className={phClass(about.photo)}>{about.photo}</span>
        ) : (
          <div className={s.frame}>
            <Image
              src={about.photo}
              alt={`${SITE.name} in the studio`}
              fill
              sizes="(max-width: 940px) 90vw, 45vw"
              className={s.img}
            />
          </div>
        )}
      </div>

      <div className={s.copy}>
        <h2 id="about-title" className={s.heading}>
          {about.heading}
        </h2>

        {about.body.map((para, i) => (
          <p key={i} className={s.para}>
            <span className={phClass(para)}>{para}</span>
          </p>
        ))}

        <p className={s.credLabel}>{about.credentialsLabel}</p>
        <div className={s.creds}>
          {about.credentials.map((c) =>
            c.href ? (
              <a
                key={c.label}
                href={c.href}
                className={s.chip}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.label}
                <ExternalIcon />
              </a>
            ) : (
              // No link yet — render as inert text, never a dead <a href="#">.
              <span key={c.label} className={s.chip}>
                <span className={phClass(c.label)}>{c.label}</span>
                <ExternalIcon />
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
