"use client";

import { useRef, useState } from "react";
import { reels } from "@/lib/content";
import { wave } from "./waveform";
import s from "./VoiceReels.module.scss";

const BAR_COUNT = 56;

// Computed once at module scope. `wave` is deterministic, so the build and
// the browser produce identical markup and hydration stays clean.
const waveforms: Record<string, ReturnType<typeof wave>> = Object.fromEntries(
  reels.items.map((r) => [r.id, wave(r.seed, BAR_COUNT)]),
);

function PlayIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginLeft: 3 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" />
    </svg>
  );
}

export default function VoiceReels() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  /**
   * Plays real audio when the reel has a `src`. Until files are supplied
   * the press still drives the visual state, so the console behaviour is
   * demonstrable — but nothing pretends a file is playing.
   */
  function toggle(id: string, src: string | null) {
    const next = playing === id ? null : id;
    const el = audioRef.current;

    if (el && src) {
      if (next === null) {
        el.pause();
      } else {
        el.src = src;
        void el.play().catch(() => setPlaying(null));
      }
    } else if (el) {
      el.pause();
    }

    setPlaying(next);
  }

  return (
    <section id="reels" className={s.section} aria-labelledby="reels-title">
      <h2 id="reels-title" className={s.heading}>
        {reels.heading}
      </h2>

      <div className={s.list}>
        {reels.items.map((r) => {
          const isPlaying = playing === r.id;
          return (
            <div
              key={r.id}
              className={`${s.channel} ${isPlaying ? s.isPlaying : ""}`}
            >
              <button
                type="button"
                className={s.key}
                onClick={() => toggle(r.id, r.src)}
                aria-pressed={isPlaying}
                aria-label={
                  r.src
                    ? `${isPlaying ? "Pause" : "Play"} ${r.title}`
                    : `${r.title} — no audio file supplied yet`
                }
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className={s.meta}>
                <div className={s.tag}>
                  <span className={s.led} />
                  <span className={s.n}>{r.n}</span>
                </div>
                <div className={`${s.title} ph`}>{r.title}</div>
                <div className={`${s.note} ph`}>{r.note}</div>
              </div>

              <div className={s.bars} aria-hidden="true">
                {waveforms[r.id].map((b, i) => (
                  <span
                    key={i}
                    className={s.bar}
                    style={{ height: `${b.h}%`, animationDelay: b.d }}
                  />
                ))}
              </div>

              <div className={`${s.dur} ph`}>{r.duration}</div>
            </div>
          );
        })}
      </div>

      <audio ref={audioRef} onEnded={() => setPlaying(null)} preload="none" />
    </section>
  );
}
