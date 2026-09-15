"use client";

import { useEffect, useRef } from "react";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import { nav } from "@/lib/content";
import { getImage } from "@/lib/images";
import { SITE } from "@/lib/site";
import s from "./Nav.module.scss";

/** Scroll distance over which the bar eases from full size to compact. */
const SHRINK_DISTANCE = 140;

/**
 * The logo's largest rendered width per breakpoint: its --logo-max height
 * (globals.scss — keep in step) times its aspect ratio. It only shrinks from
 * there as the page scrolls, so sizing for the largest state is never soft.
 */
const logo = getImage("brand/logo");
const logoWidth = (height: number) => Math.ceil((height * logo.width) / logo.height);
const LOGO_SIZES = `(max-width: 680px) ${logoWidth(64)}px, (max-width: 1180px) ${logoWidth(128)}px, ${logoWidth(150)}px`;

/**
 * Centred-logo nav that eases from full size to a compact bar as the page
 * scrolls.
 *
 * The header is `position: fixed`, and a spacer of its full height holds its
 * place in the page. That separation is what stops the flicker. While the
 * header sat in the flow, shrinking it moved the content below; the browser's
 * scroll anchoring then shifted the scroll position to compensate, which grew
 * the header back — a feedback loop that oscillated whenever the page came to
 * rest inside the shrink range. Out of the flow, its size can't move anything.
 *
 * JS writes a single number, --p (0 at the top, 1 once compact). Every size
 * is derived from it in CSS, so breakpoints only redefine the endpoints.
 */
export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const p = Math.min(Math.max(window.scrollY / SHRINK_DISTANCE, 0), 1);
      header.style.setProperty("--p", p.toFixed(4));
      // The back-to-top tab only takes clicks once it's visible.
      header.toggleAttribute("data-compact", p > 0.6);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const left = nav.slice(0, 2);
  const right = nav.slice(2);

  return (
    <div className={s.spacer}>
      <header ref={headerRef} className={s.nav}>
        <nav className={s.inner} aria-label="Main">
          <div className={`${s.group} ${s.left}`}>
            {left.map((l) => (
              <a key={l.href} href={l.href} className={s.link}>
                {l.label}
              </a>
            ))}
          </div>

          <a href="#" className={s.logoLink} aria-label={`${SITE.name} — back to top`} title="Back to top">
            <span className={s.logo}>
              <ResponsiveImage
                name="brand/logo"
                alt={`${SITE.name} — ${SITE.role}`}
                sizes={LOGO_SIZES}
                priority
              />
            </span>
            <span className={s.topHint} aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Top
            </span>
          </a>

          <div className={`${s.group} ${s.right}`}>
            {right.map((l) => (
              <a key={l.href} href={l.href} className={s.link}>
                {l.label}
              </a>
            ))}
            <a href="#contact" className={s.cta}>
              Book Konner
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}
