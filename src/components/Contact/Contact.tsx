import { contact, isPlaceholder, phClass } from "@/lib/content";
import { LINKS } from "@/lib/site";
import ContactForm from "./ContactForm";
import s from "./Contact.module.scss";

const icons: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  LinkedIn: <path d="M4.5 9.5v10M4.5 5.2v.02M10 19.5v-10M10 13.2c0-2 1.4-3.4 3.2-3.4S16.5 11 16.5 13v6.5" />,
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.6l5 2.4-5 2.4z" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function Contact() {
  return (
    <section id="contact" className={s.section} aria-labelledby="contact-title">
      <div className={s.copy}>
        <h2 id="contact-title" className={s.heading}>
          {contact.heading}
        </h2>
        <p className={s.blurb}>{contact.blurb}</p>

        <div className={s.direct}>
          <p className={s.directLabel}>Direct</p>
          {isPlaceholder(contact.email) ? (
            <span className={`${s.email} ${phClass(contact.email)}`}>{contact.email}</span>
          ) : (
            <a className={s.email} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          )}
        </div>

        <p className={s.elsewhereLabel}>Elsewhere</p>
        <div className={s.socials}>
          {LINKS.map((l) => {
            const glyph = (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {icons[l.label]}
              </svg>
            );
            return l.href ? (
              <a key={l.label} href={l.href} className={s.social} aria-label={l.label}
                target="_blank" rel="noopener noreferrer me">
                {glyph}
              </a>
            ) : (
              <span key={l.label} className={s.social} aria-label={`${l.label} — link not supplied yet`} role="img">
                {glyph}
              </span>
            );
          })}
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
