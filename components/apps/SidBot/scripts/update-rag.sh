#!/usr/bin/env bash
set -euo pipefail

WORKER_URL="https://sidbot9000-proxy.hisiddharth.workers.dev"

echo "🔍 Checking components/apps/SidBot/rag-sources/ for accidental secrets or phone numbers..."
if grep -rnE "(gsk_[A-Za-z0-9]{15,}|ghp_[A-Za-z0-9]{15,}|\+91[- ]?[6-9][0-9]{9}|\b[6-9][0-9]{9}\b)" components/apps/SidBot/rag-sources/; then
  echo "❌ Aborted: potential API key or phone number found in components/apps/SidBot/rag-sources/ above."
  exit 1
fi

echo "🧠 Compiling RAG index + 384-dim semantic vectors..."
node components/apps/SidBot/scripts/build-sidbot-rag.mjs --embed="${WORKER_URL}/embed"

node -e '
const fs = require("fs");
const idx = JSON.parse(fs.readFileSync("components/apps/SidBot/rag-index.json", "utf8"));
if (!idx.hasVectors || !idx.chunkCount) {
  console.error("❌ Invalid rag-index.json");
  process.exit(1);
}
console.log(`✅ Verified rag-index.json: ${idx.docCount} docs, ${idx.chunkCount} chunks, vectors=${idx.hasVectors}`);
'

if [[ "${1:-}" == "--deploy-worker" ]]; then
  echo "☁️ Deploying Cloudflare Worker..."
  (cd ../sidbot-worker && npx wrangler deploy)
fi

echo "🎉 Done! Review changes and commit/push components/apps/SidBot/rag-index.json (and components/apps/SidBot/rag-sources/) when ready."
