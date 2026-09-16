#!/usr/bin/env bash
#
# Uploads public/images/ and public/audio/ to the S3 bucket behind the
# site's CloudFront distribution.
#
#   npm run assets:upload
#
# Needs the AWS CLI signed in to the account that owns the bucket. Override the
# defaults with ASSET_BUCKET / ASSET_DISTRIBUTION_ID if they ever change.
#
# Caching differs by folder, because the filenames do:
# - images/ filenames carry a content hash (npm run images), so a changed photo
#   always gets a new URL. They're cached for a year and marked immutable.
# - audio/ filenames don't change when a reel is replaced, so they're cached
#   for a day, and CloudFront's cached copies are cleared after every upload
#   so a replaced reel shows up straight away.
#
# Audio is compared by size only: a fresh git clone gives every file a new
# modified time, which would otherwise re-upload and re-invalidate every reel.
#
# Nothing is ever deleted from the bucket: a site still deployed from an older
# build may reference older image hashes.
set -euo pipefail

BUCKET="${ASSET_BUCKET:-konner-cabena-assets}"
DISTRIBUTION_ID="${ASSET_DISTRIBUTION_ID:-E11QIQSEW7PJBW}"

cd "$(dirname "$0")/.."

echo "→ images → s3://$BUCKET/images (immutable, 1 year)"
aws s3 sync public/images "s3://$BUCKET/images" \
  --exclude ".*" \
  --cache-control "public, max-age=31536000, immutable" \
  --only-show-errors

echo "→ audio → s3://$BUCKET/audio (1 day)"
audio_changes=$(aws s3 sync public/audio "s3://$BUCKET/audio" \
  --exclude ".*" \
  --cache-control "public, max-age=86400" \
  --size-only --no-progress | tee /dev/stderr | grep -c "^upload:" || true)

if [ "$audio_changes" -gt 0 ]; then
  echo "→ clearing CloudFront's cached audio ($audio_changes file(s) changed)"
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
    --paths "/audio/*" --query 'Invalidation.Id' --output text
fi

echo "✓ done"
