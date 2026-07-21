#!/bin/bash
# Sync fork with upstream documenso and push to trigger a rebuild.
#
# Usage: ./UPDATE.sh
#
# What it does:
#   1. Fetches the latest upstream tags and main branch
#   2. Rebases your customizations on top
#   3. Pushes to origin (triggers GitHub Actions build)
#
# If there are conflicts (rare — you only touch email templates
# and translations), git will stop and let you resolve them.

set -euo pipefail
cd "$(dirname "$0")"

echo "Fetching upstream..."
git fetch upstream --tags

LATEST_TAG=$(git tag -l 'v*' --sort=-v:refname | head -1)
echo "Latest upstream tag: ${LATEST_TAG:-none}"

echo "Rebasing on upstream/main..."
git rebase upstream/main

echo "Pushing to origin..."
git push origin main --force-with-lease
git push origin --tags

echo ""
echo "Done. GitHub Actions will build the new image."
echo "Once built, pull on the VPS with:"
echo "  docker compose pull && docker compose up -d"
