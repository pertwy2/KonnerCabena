"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { SITE } from "@/lib/site";
import s from "./Nav.module.scss";

/**
 * Sticky nav with a centred logo that starts large and eases down to a
 * small mark once the page scrolls.
 */
export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      // Cancel any pending update and schedule a new one on the next frame.
      // This throttles scroll events to match the browser's repaint rate (60fps)
      // and prevents thrashing the DOM or interrupting CSS transitions.
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setStuck(window.scrollY > 30);
      });
    };

    // Check initial state
    setStuck(window.scrollY > 30);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const left = nav.slice(0, 3);
  const right = nav.slice(3);

  return (
    <header className={`${s.nav} ${stuck ? s.stuck : ""}`}>
      <div className={s.inner}>
        <nav className={`${s.group} ${s.left}`} aria-label="Sections">
          {left.map((l) => (
            <a key={l.href} href={l.href} className={s.link}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={s.logo}>
          <Image
            src="/logo.png"
            alt={`${SITE.name} — ${SITE.role}`}
            width={380}
            height={293}
            priority
          />
        </div>

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
      </div>
    </header>
  );
}
