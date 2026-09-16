"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";
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
  /** The reel whose file is currently loaded in the shared <audio> element. */
  const loadedRef = useRef<string | null>(null);
  const channelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setProgress = (id: string, value: number) =>
    channelRefs.current[id]?.style.setProperty("--progress", value.toFixed(4));

  // Drive the fill from the audio clock on every frame while playing.
  // `timeupdate` only fires about four times a second, so the fill would step.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !playing) return;
    let raf = 0;
    const tick = () => {
      // Once paused or ended, stop writing: a late frame reporting the end
      // position would otherwise refill a bar that has just been reset.
      if (el.paused) return;
      if (el.duration) setProgress(playing, el.currentTime / el.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function toggle(id: string, src: string | null) {
    const el = audioRef.current;
    if (!el || !src) return;

    if (playing === id) {
      el.pause(); // the fill stays where it stopped, and resumes from there
      setPlaying(null);
      return;
    }

    // Switching reels discards the old one's position, so clear its fill too.
    if (loadedRef.current !== id) {
      if (loadedRef.current) setProgress(loadedRef.current, 0);
      el.src = assetUrl(src);
      loadedRef.current = id;
    }

    setPlaying(id);
    void el.play().catch(() => setPlaying(null));
  }

  function onEnded() {
    if (loadedRef.current) setProgress(loadedRef.current, 0);
    setPlaying(null);
  }

  return (
    <section id="reels" className={s.section} aria-labelledby="reels-title">
      <h2 id="reels-title" className={s.heading}>
        {reels.heading}
      </h2>

      <div className={s.list}>
        {reels.items.map((r) => {
          const isPlaying = playing === r.id;
          const bars = waveforms[r.id].map((b, i) => (
            <span key={i} className={s.bar} style={{ height: `${b.h}%` }} />
          ));

          return (
            <div
              key={r.id}
              ref={(node) => {
                channelRefs.current[r.id] = node;
              }}
              className={`${s.channel} ${isPlaying ? s.isPlaying : ""}`}
            >
              <button
                type="button"
                className={s.key}
                onClick={() => toggle(r.id, r.src)}
                disabled={!r.src}
                aria-pressed={isPlaying}
                aria-label={
                  r.src
                    ? `${isPlaying ? "Pause" : "Play"} ${r.title} reel`
                    : `${r.title} — no audio file supplied yet`
                }
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className={s.meta}>
                <span className={s.led} />
                <span className={s.title}>{r.title}</span>
              </div>

              {/* Two copies of the same waveform: the red one on top is
                  clipped to the playback position, so it fills left to right. */}
              <div className={s.wave} aria-hidden="true">
                <div className={s.bars}>{bars}</div>
                <div className={`${s.bars} ${s.fill}`}>{bars}</div>
              </div>

              <div className={s.dur}>{r.duration}</div>
            </div>
          );
        })}
      </div>

      <audio ref={audioRef} onEnded={onEnded} preload="none" />
    </section>
  );
}
