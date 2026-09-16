/**
 * Where static assets — generated images and reel audio — are served from.
 *
 * Empty means this site's own public/ folder, which is what `npm run dev`
 * uses. Production builds read NEXT_PUBLIC_ASSET_BASE_URL from .env.production
 * and point at the CloudFront distribution in front of the S3 bucket.
 *
 * Paths are identical in both places: public/images/x.avif is served at
 * <base>/images/x.avif, public/audio/x.mp3 at <base>/audio/x.mp3.
 * `npm run assets:upload` keeps the bucket in step.
 */
export const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(/\/+$/, "");

/** `/audio/x.mp3` → `https://….cloudfront.net/audio/x.mp3`, or unchanged locally. */
export const assetUrl = (path: string) => `${ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
