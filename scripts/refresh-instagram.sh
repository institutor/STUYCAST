#!/bin/bash
# Fetches Instagram posts and downloads media locally.
# Usage: ./scripts/refresh-instagram.sh
#
# Requires: a valid short-lived token in .env.local
# Run this whenever you want to update the Instagram feed on the site.

set -e

cd "$(dirname "$0")/.."

# Read token and user ID from .env.local
TOKEN=$(grep INSTAGRAM_ACCESS_TOKEN .env.local | cut -d'=' -f2)
USER_ID=$(grep INSTAGRAM_USER_ID .env.local | cut -d'=' -f2)

if [ -z "$TOKEN" ] || [ -z "$USER_ID" ]; then
  echo "Error: INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID not found in .env.local"
  exit 1
fi

echo "Fetching posts from Instagram API..."

TMPFILE=$(mktemp)
trap "rm -f $TMPFILE" EXIT

# Fetch posts to temp file
curl -s "https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=25&access_token=$TOKEN" -o "$TMPFILE"

# Check for errors
if grep -q '"error"' "$TMPFILE"; then
  echo "API Error:"
  cat "$TMPFILE"
  exit 1
fi

echo "API response received. Processing..."

# Create directories
mkdir -p public/instagram

# Use node to process the JSON and download images
node scripts/process-instagram.js "$TMPFILE"
