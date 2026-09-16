#!/usr/bin/env bash
#
# Generates the image variants and uploads them, with the reel audio, to the
# S3 bucket behind the site's CloudFront distribution — then checks that every
# file the site references is actually there.
#
#   npm run assets:upload
#
# The site has no local copies: dev and production both load assets from
# CloudFront (src/lib/assets.ts). So run this after adding or changing a photo,
# logo or reel, before deploying a build that uses it.
#
# Needs the AWS CLI signed in to the account that owns the bucket. Override the
# defaults with ASSET_BUCKET / ASSET_DISTRIBUTION_ID if they ever change.
#
# Caching differs by folder, because the filenames do:
# - images/ filenames carry a content hash, so a changed photo always gets a
#   new URL. They're cached for a year and marked immutable.
# - audio/ filenames don't change when a reel is replaced, so they're cached
#   for a day, and CloudFront's cached copies are cleared after every upload
#   so a replaced reel shows up straight away.
#
# Uploads compare by size only: a fresh git clone (or regenerating the image
# variants) gives every file a new modified time, which would otherwise
# re-upload everything and re-invalidate every reel.
#
# Nothing is ever deleted from the bucket: a site still deployed from an older
# build may reference older files.
set -euo pipefail

BUCKET="${ASSET_BUCKET:-konner-cabena-assets}"
DISTRIBUTION_ID="${ASSET_DISTRIBUTION_ID:-E11QIQSEW7PJBW}"

cd "$(dirname "$0")/.."

echo "→ generating image variants"
node scripts/images.mjs

echo "→ images → s3://$BUCKET/images (immutable, 1 year)"
aws s3 sync .asset-build/images "s3://$BUCKET/images" \
  --exclude ".*" \
  --cache-control "public, max-age=31536000, immutable" \
  --size-only \
  --only-show-errors

echo "→ audio → s3://$BUCKET/audio (1 day)"
audio_changes=$(aws s3 sync assets/audio "s3://$BUCKET/audio" \
  --exclude ".*" \
  --cache-control "public, max-age=86400" \
  --size-only --no-progress | tee /dev/stderr | grep -c "^upload:" || true)

if [ "$audio_changes" -gt 0 ]; then
  echo "→ clearing CloudFront's cached audio ($audio_changes file(s) changed)"
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
    --paths "/audio/*" --query 'Invalidation.Id' --output text
fi

echo "→ checking every referenced file is in the bucket"
in_bucket=$(aws s3 ls "s3://$BUCKET/" --recursive | awk '{print $4}')
missing=$(node -e '
  const fs = require("fs");
  const bucket = new Set(process.argv[1].split("\n"));
  const m = JSON.parse(fs.readFileSync("src/lib/images.generated.json", "utf8"));
  const images = Object.entries(m).flatMap(([n, v]) =>
    v.widths.flatMap((w) => v.formats.map((f) => `images/${n}-${w}.${v.hash}.${f.ext}`)));
  const audio = [...fs.readFileSync("src/lib/content.ts", "utf8").matchAll(/src: "\/(audio\/[^"]+)"/g)].map((x) => x[1]);
  const all = [...images, ...audio];
  const miss = all.filter((k) => !bucket.has(k));
  console.error(`  ${all.length - miss.length}/${all.length} referenced files present`);
  console.log(miss.join("\n"));
' "$in_bucket")

if [ -n "$missing" ]; then
  echo "✗ missing from the bucket:" >&2
  echo "$missing" | sed 's/^/  /' >&2
  exit 1
fi

echo "✓ done"
