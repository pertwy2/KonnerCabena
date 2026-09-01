import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the build emits plain HTML so crawlers and link previews
  // see fully-formed markup without executing any JavaScript.
  output: "export",
  // No image optimisation server exists in a static export.
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
