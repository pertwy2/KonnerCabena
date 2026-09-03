"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { nav } from "@/lib/content";
import { SITE } from "@/lib/site";
import s from "./Nav.module.scss";

/**
 * Sticky nav with a logo that continuously scales from 150px (top) to 34px
 * (scrolled) based on actual scroll position, creating a smooth easing effect.
 */
export default function Nav() {
  const headerRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!headerRef.current) return;

        const scrollY = window.scrollY;
        const maxScroll = 120;
        const maxHeight = 150;
        const minHeight = 34;

        // Linear interpolation: as scrollY goes from 0 to 120px,
        // logo height goes from 150px to 34px
        const progress = Math.min(scrollY / maxScroll, 1);
        const height = maxHeight - (maxHeight - minHeight) * progress;

        headerRef.current.style.setProperty("--logo-height", `${height}px`);

        // Update the sticky shadow for visual continuity
        const isStuck = scrollY > 80;
        headerRef.current.classList.toggle(s.stuck, isStuck);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Set initial state

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const left = nav.slice(0, 3);
  const right = nav.slice(3);

  return (
    <header ref={headerRef} className={s.nav}>
      <div className={s.inner}>
        <nav className={`${s.group} ${s.left}`} aria-label="Sections">
          {left.map((l) => (
            <a key={l.href} href={l.href} className={s.link}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#" className={s.logoLink}>
          <div className={s.logo}>
            <Image
              src="/logo.png"
              alt={`${SITE.name} — ${SITE.role}`}
              width={380}
              height={293}
              priority
            />
          </div>
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
      </div>
    </header>
  );
}
