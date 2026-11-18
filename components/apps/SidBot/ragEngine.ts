export interface RagChunk {
  action: string;
  aliases: string[];
  category: string;
  id: string;
  len: number;
  text: string;
  tf: Record<string, number>;
  title: string;
}

export interface RagIndex {
  avgdl: number;
  builtAt: string;
  chunkCount: number;
  chunks: RagChunk[];
  docCount: number;
  idf: Record<string, number>;
  version: number;
}

export interface RetrievalHit {
  chunk: RagChunk;
  score: number;
}

export interface RetrievalResult {
  hits: RetrievalHit[];
  retrievalMs: number;
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "is", "are", "was", "were", "be", "been", "it", "this",
  "that", "i", "my", "me", "we", "you", "as", "what", "how", "tell", "about",
]);

let cachedIndex: RagIndex | null = null;

export const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

export async function loadRagIndex(): Promise<RagIndex> {
  if (cachedIndex) return cachedIndex;

  const res = await fetch("/sidbot/rag-index.json");
  if (!res.ok) {
    throw new Error(`Failed to load RAG index (${res.status})`);
  }

  cachedIndex = (await res.json()) as RagIndex;
  return cachedIndex;
}

export function retrieveTopChunks(
  index: RagIndex,
  query: string,
  topK = 3
): RetrievalResult {
  const t0 = performance.now();
  const qToks = tokenize(query);
  const k1 = 1.5;
  const b = 0.75;

  const scored: RetrievalHit[] = index.chunks
    .map((chunk) => {
      let score = 0;

      for (const qt of qToks) {
        const f = chunk.tf[qt] || 0;
        if (f > 0) {
          const idf = index.idf[qt] || 0;
          score +=
            idf *
            ((f * (k1 + 1)) /
              (f + k1 * (1 - b + b * (chunk.len / Math.max(1, index.avgdl)))));
        }
        if (chunk.aliases.some((alias) => alias.includes(qt))) {
          score += 0.6;
        }
      }

      return { chunk, score: Number(score.toFixed(3)) };
    })
    .filter((item) => item.score > 0)
    .sort((a, bHit) => bHit.score - a.score)
    .slice(0, topK);

  const fallbackHits =
    scored.length > 0
      ? scored
      : index.chunks.slice(0, 2).map((chunk) => ({ chunk, score: 0.1 }));

  return {
    hits: fallbackHits,
    retrievalMs: Number((performance.now() - t0).toFixed(2)),
  };
}

export function buildOfflineFallbackReply(hits: RetrievalHit[]): {
  action?: string;
  text: string;
} {
  if (hits.length === 0) {
    return {
      action: "resume",
      text: "My cloud LLM uplink is currently offline, and I didn't find an exact match in my local index—but you can check out my Resume, GitHub, or LinkedIn right from SidOS!",
    };
  }

  const primary = hits[0].chunk;
  const secondary = hits[1]?.chunk;
  const actionTag = primary.action.startsWith("open:")
    ? primary.action.replace("open:", "")
    : undefined;

  const lines = [
    `[Local RAG Mode — instant on-device retrieval]`,
    ``,
    `**${primary.title}**`,
    primary.text,
  ];

  if (secondary && secondary.id !== primary.id) {
    lines.push("", `**Related — ${secondary.title}**`, secondary.text);
  }

  return { action: actionTag, text: lines.join("\n") };
}