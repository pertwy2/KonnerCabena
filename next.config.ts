import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the build emits plain HTML so crawlers and link previews
  // see fully-formed markup without executing any JavaScript.
  output: "export",
  // No image optimisation server exists in a static export.
  images: { unoptimized: true },
  reactCompiler: true,
  // `npm run dev` blocks its own scripts for any origin but localhost. Opening
  // the dev site by IP — the "Network" address, e.g. from a phone on the same
  // Wi-Fi — then leaves the page un-hydrated: it renders, but nothing
  // interactive runs (the nav doesn't shrink, reels don't play). Allow loopback
  // and the private LAN ranges, so it works on whatever network you're on.
  // Dev only; production builds ignore this.
  allowedDevOrigins: ["127.0.0.1", "10.*.*.*", "192.168.*.*"],
};

export default nextConfig;
