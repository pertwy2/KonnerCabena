/**
 * Where images and reel audio are served from: the CloudFront distribution
 * in front of the private S3 bucket "konner-cabena-assets" (eu-west-2).
 *
 * There are no local copies. Dev and production builds both load assets from
 * here, so the site can never quietly work locally while pointing at files the
 * bucket doesn't have. `npm run assets:upload` generates the image variants,
 * uploads them and the reels, and checks every file the site references is
 * in the bucket.
 *
 * NEXT_PUBLIC_ASSET_BASE_URL overrides it, e.g. to point a build at a
 * different distribution.
 */
const CLOUDFRONT_URL = "https://d3maflhglpwh6j.cloudfront.net";

export const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || CLOUDFRONT_URL).replace(/\/+$/, "");

/** `/audio/x.mp3` → `https://….cloudfront.net/audio/x.mp3` */
export const assetUrl = (path: string) => `${ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
