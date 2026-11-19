import fs from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.resolve("rag-sources");
const OUT_FILE = path.resolve("public/sidbot/rag-index.json");
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "it",
  "this",
  "that",
  "i",
  "my",
  "me",
  "we",
  "you",
  "as",
]);

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

function parseDoc(raw, filename) {
  let meta = { title: filename, category: "general", aliases: [], action: "" };
  let body = raw;
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (fm) {
    body = fm[2];
    for (const line of fm[1].split(/\r?\n/)) {
      const [k, ...rest] = line.split(":");
      if (!k || !rest.length) continue;
      const val = rest.join(":").trim();
      if (k.trim() === "aliases") {
        meta.aliases = val
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
      } else {
        meta[k.trim()] = val;
      }
    }
  }
  const sections = body
    .split(/\r?\n(?=##\s+)/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return sections.map((sec, i) => {
    const hm = sec.match(/^##\s+(.+)\r?\n([\s\S]*)$/);
    const heading = hm ? hm[1].trim() : meta.title;
    const text = hm ? hm[2].trim() : sec;
    return {
      id: `${filename.replace(/\.[^.]+$/, "")}#${i}`,
      title: `${meta.title} - ${heading}`,
      category: meta.category,
      action: meta.action,
      aliases: meta.aliases,
      text,
    };
  });
}

async function fetchEmbeddings(embedUrl, texts) {
  const res = await fetch(embedUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts }),
  });
  if (!res.ok) throw new Error(`Embed HTTP ${res.status}`);
  const data = await res.json();
  return data.vectors;
}

async function main() {
  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  const embedArg = process.argv.find((a) => a.startsWith("--embed="));
  const embedUrl = embedArg
    ? embedArg.split("=")[1]
    : process.env.SIDBOT_EMBED_URL || "";

  const files = (await fs.readdir(SRC_DIR))
    .filter((f) => /\.(md|txt)$/i.test(f))
    .sort();
  const chunks = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(SRC_DIR, f), "utf8");
    chunks.push(...parseDoc(raw, f));
  }

  let vectors = [];
  if (embedUrl) {
    console.log(`Computing 384-dim semantic vectors via ${embedUrl}...`);
    const texts = chunks.map((c) => `${c.title}\n${c.text}`);
    vectors = await fetchEmbeddings(embedUrl, texts);
  }

  const df = {};
  const docTokens = chunks.map((c) => {
    const toks = tokenize(
      `${c.title} ${c.aliases.join(" ")} ${c.aliases.join(" ")} ${c.text}`
    );
    for (const t of new Set(toks)) df[t] = (df[t] || 0) + 1;
    return toks;
  });

  const N = chunks.length;
  const avgdl = docTokens.reduce((a, b) => a + b.length, 0) / Math.max(1, N);
  const idf = {};
  for (const [term, count] of Object.entries(df)) {
    idf[term] = Math.log(1 + (N - count + 0.5) / (count + 0.5));
  }

  const indexedChunks = chunks.map((c, idx) => {
    const tf = {};
    for (const t of docTokens[idx]) tf[t] = (tf[t] || 0) + 1;
    const vec = vectors[idx]
      ? vectors[idx].map((v) => Number(v.toFixed(4)))
      : undefined;
    return { ...c, len: docTokens[idx].length, tf, ...(vec ? { vec } : {}) };
  });

  const payload = {
    version: 2,
    builtAt: new Date().toISOString(),
    hasVectors: Boolean(vectors.length),
    docCount: files.length,
    chunkCount: N,
    avgdl,
    idf,
    chunks: indexedChunks,
  };

  const json = JSON.stringify(payload);
  await fs.writeFile(OUT_FILE, json, "utf8");
  console.log(
    `✅ Built ${OUT_FILE} (${files.length} docs, ${N} chunks, vectors=${payload.hasVectors}, ${(Buffer.byteLength(json) / 1024).toFixed(1)} KB)`
  );
}

main();
