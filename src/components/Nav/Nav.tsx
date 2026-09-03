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
  // Initialize state based on current scroll position to avoid animation bounce.
  // Using a lazy initializer so the check runs only once on client hydration.
  const [stuck, setStuck] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > 80;
  });

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      // Hysteresis: different thresholds to avoid fluttering near the boundary.
      // Turn on at 80px, turn off at 20px. This prevents rapid toggling when
      // scrolling slowly or moving back/forth near the threshold.
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setStuck((prev) =>
          prev ? window.scrollY > 20 : window.scrollY > 80
        );
      });
    };

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
