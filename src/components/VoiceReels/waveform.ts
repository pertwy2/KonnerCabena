export type Bar = { h: number; d: string };

/**
 * Deterministic pseudo-waveform.
 *
 * Must stay pure and seed-driven: it runs during the static build *and*
 * again on the client during hydration, and any difference between the
 * two would produce a React hydration mismatch.
 */
export function wave(seed: number, n: number): Bar[] {
  const out: Bar[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // Envelope tapers the ends so the strip reads as a clip, not a block.
    const env = Math.sin(Math.PI * t) * 0.7 + 0.3;
    const raw = Math.abs(
      Math.sin(i * 0.63 + seed) * 0.5 +
        Math.sin(i * 1.87 + seed * 2.1) * 0.32 +
        Math.sin(i * 3.41 + seed * 0.7) * 0.18,
    );
    // Expand the contrast so peaks and troughs are clearly distinct.
    const v = Math.pow(raw, 1.35) * 1.5;
    out.push({
      h: Math.max(7, Math.min(100, Math.round(env * v * 100))),
      d: `${(i * 0.032).toFixed(3)}s`,
    });
  }
  return out;
}
