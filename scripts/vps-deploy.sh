#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
git pull origin main
if [ ! -f .env ]; then
  echo "FEHLER: .env fehlt. Kopiere .env.example nach .env und trage Werte ein."
  exit 1
fi
npm run config
echo "OK: scripts/public-config.js erzeugt. Prüfe: curl -I https://ritz-ai.solutions/scripts/public-config.js"
