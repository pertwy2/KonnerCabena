"use client";

import { useState } from "react";
import { phClass, showReel } from "@/lib/content";
import s from "./ShowReel.module.scss";

/** A youtube.com/embed/<id> URL's video id, for the thumbnail — null for anything else (e.g. Vimeo). */
function youtubeId(embedUrl: string | null): string | null {
  return embedUrl?.match(/youtube\.com\/embed\/([^/?]+)/)?.[1] ?? null;
}

export default function ShowReel() {
  const [playing, setPlaying] = useState(false);

  // With an embed URL the key swaps the frame for the real player;
  // without one it drives the visual state only.
  const showEmbed = playing && Boolean(showReel.embedUrl);
  const posterId = youtubeId(showReel.embedUrl);

  return (
    <section id="showreel" className={s.section} aria-labelledby="showreel-title">
      <div className={s.head}>
        <h2 id="showreel-title" className={s.heading}>
          {showReel.heading}
        </h2>
        <p className={s.blurb}>{showReel.blurb}</p>
      </div>

      <div
        className={s.frame}
        style={
          !showEmbed && posterId
            ? { backgroundImage: `url(https://img.youtube.com/vi/${posterId}/maxresdefault.jpg)` }
            : undefined
        }
      >
        {showEmbed ? (
          <iframe
            className={s.embed}
            src={`${showReel.embedUrl}?autoplay=1&rel=0`}
            title={`${showReel.heading} — show reel`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {posterId && <div className={s.scrim} />}
            <button
              type="button"
              className={s.key}
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
              aria-label={
                showReel.embedUrl
                  ? "Play show reel"
                  : "Show reel — no video supplied yet"
              }
            >
              {playing ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1.2" />
                  <rect x="14" y="5" width="4" height="14" rx="1.2" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginLeft: 5 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className={s.tag}>
              <span className={`${s.led} ${playing ? s.on : ""}`} />
              <span className={phClass(showReel.label)}>{showReel.label}</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
