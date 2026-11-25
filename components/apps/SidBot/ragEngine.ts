import ragIndexData from "components/apps/SidBot/rag-index.json";

export interface RagChunk {
  action: string;
  aliases: string[];
  category: string;
  id: string;
  len: number;
  text: string;
  tf: Partial<Record<string, number>>;
  title: string;
  vec?: number[];
}

export interface RagIndex {
  avgdl: number;
  builtAt: string;
  chunkCount: number;
  chunks: RagChunk[];
  docCount: number;
  hasVectors?: boolean;
  idf: Partial<Record<string, number>>;
  version: number;
}

export interface RetrievalHit {
  bm25Score: number;
  chunk: RagChunk;
  score: number;
  vectorScore: number;
}

export interface RetrievalResult {
  hits: RetrievalHit[];
  mode: "hybrid-vector+bm25" | "offline-bm25+synonyms";
  retrievalMs: number;
}

export interface ServerMeta {
  hits: RetrievalHit[];
  mode: string;
  retrievalMs: number;
}

export interface WorkerStreamResult {
  action?: string;
  blockedMessage?: string;
  ok: boolean;
  serverMeta?: ServerMeta;
  status?: number;
  text: string;
  ttft: number;
}

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
  "what",
  "how",
  "tell",
  "about",
  "do",
  "did",
  "your",
  "yourself",
  "can",
]);

const SYNONYMS: Record<string, string[]> = {
  ai: ["llm", "rag", "lora", "diffusion", "model"],
  best: ["flagship", "top", "highlights", "overview", "projects"],
  built: ["projects", "engineered", "created", "flagship"],
  career: ["accenture", "role", "job", "hire", "work"],
  experience: ["accenture", "work", "job", "role"],
  flagship: ["best", "top", "highlights", "overview", "projects"],
  fun: ["hobbies", "guitar", "game", "star", "wars"],
  gpu: ["4060", "vram", "rtx", "hardware", "8gb"],
  hardware: ["4060", "esp32", "iot", "vram"],
  hobbies: ["guitar", "game", "star", "wars", "homelab"],
  instrument: ["guitar", "music"],
  instruments: ["guitar", "music"],
  job: ["accenture", "role", "hire", "work"],
  music: ["guitar", "metal", "rock", "tone"],
  pitch: ["bio", "role", "accenture", "overview"],
  portfolio: ["projects", "flagship", "sidos", "sidbot"],
  privacy: ["wireguard", "luks", "immich", "pihole", "encrypted"],
  project: [
    "projects",
    "flagship",
    "overview",
    "loom",
    "revolver",
    "immich",
    "lora",
    "podpitara",
  ],
  projects: [
    "project",
    "flagship",
    "overview",
    "loom",
    "revolver",
    "immich",
    "lora",
    "podpitara",
  ],
  security: ["wireguard", "luks", "immich", "pihole", "reverse-engineering"],
  transit: ["podpitara", "commuters", "iot", "radio", "esp32"],
  vpn: ["wireguard", "immich"],
};

export const tokenize = (text: string): string[] => {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

  const expanded = new Set(base);
  base.forEach((w) => {
    const syns = SYNONYMS[w];
    if (syns) syns.forEach((s) => expanded.add(s));
  });
  return [...expanded];
};

const cosine = (a: number[], b: number[]): number => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

export const loadRagIndex = (): RagIndex => ragIndexData;

export const retrieveTopChunks = (
  index: RagIndex,
  query: string,
  topK = 3,
  queryVector?: number[]
): RetrievalResult => {
  const t0 = performance.now();
  const qToks = tokenize(query);
  const k1 = 1.5;
  const b = 0.75;

  const rawScored = index.chunks.map((chunk) => {
    let bm25 = 0;
    qToks.forEach((qt) => {
      const f = chunk.tf[qt] || 0;
      if (f > 0) {
        const idf = index.idf[qt] || 0;
        bm25 +=
          idf *
          ((f * (k1 + 1)) /
            (f + k1 * (1 - b + b * (chunk.len / Math.max(1, index.avgdl)))));
      }
      if (chunk.aliases.some((alias) => alias.includes(qt))) {
        bm25 += 0.55;
      }
    });

    const vectorScore =
      queryVector && chunk.vec
        ? Math.max(0, cosine(queryVector, chunk.vec))
        : 0;

    return { bm25, chunk, vectorScore };
  });

  const maxBm25 = Math.max(1e-6, ...rawScored.map((r) => r.bm25));
  const usingVectors = Boolean(
    queryVector && index.chunks.some((c) => c.vec?.length)
  );

  const hits: RetrievalHit[] = rawScored
    .map((r) => {
      const normBm25 = r.bm25 / maxBm25;
      const combined = usingVectors
        ? 0.65 * r.vectorScore + 0.35 * normBm25
        : r.bm25;

      return {
        bm25Score: Number(r.bm25.toFixed(3)),
        chunk: r.chunk,
        score: Number(combined.toFixed(3)),
        vectorScore: Number(r.vectorScore.toFixed(3)),
      };
    })
    .filter((h) => h.score > 0.05)
    .sort((aHit, bHit) => bHit.score - aHit.score)
    .slice(0, topK);

  const finalHits =
    hits.length > 0
      ? hits
      : index.chunks.slice(0, 2).map((chunk) => ({
          bm25Score: 0,
          chunk,
          score: 0.1,
          vectorScore: 0,
        }));

  return {
    hits: finalHits,
    mode: usingVectors ? "hybrid-vector+bm25" : "offline-bm25+synonyms",
    retrievalMs: Number((performance.now() - t0).toFixed(2)),
  };
};

export const buildOfflineFallbackReply = (
  hits: RetrievalHit[]
): { action?: string; text: string } => {
  if (hits.length === 0) {
    return {
      action: "resume",
      text: "Offline knowledge base had no exact match for that — check out my Resume, GitHub, or LinkedIn right from SidOS!",
    };
  }

  const primary = hits[0].chunk;
  const secondary = hits[1]?.score > 0.3 ? hits[1].chunk : undefined;
  const actionTag = primary.action.startsWith("open:")
    ? primary.action.replace("open:", "")
    : undefined;

  const parts = [primary.text];
  if (secondary && secondary.id !== primary.id) {
    parts.push(
      `\nAlso relevant (${secondary.title.split(" - ").pop()}):\n${secondary.text}`
    );
  }

  return { action: actionTag, text: parts.join("\n") };
};

export const fetchQueryVector = async (
  workerUrl: string,
  query: string
): Promise<number[] | undefined> => {
  if (!workerUrl) return undefined;
  try {
    const res = await fetch(`${workerUrl.replace(/\/$/, "")}/embed`, {
      body: JSON.stringify({ texts: [query] }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { vectors?: number[][] };
    return data.vectors?.[0];
  } catch {
    return undefined;
  }
};

const LEAK_CANARY_RE =
  /VOICE & CONSISTENCY|STRICT ZERO-HALLUCINATION|IMMUTABLE BOUNDARIES|RAG CONTEXT:|<user_query>/i;

export const streamWorkerReply = async (
  workerUrl: string,
  payload: {
    history: { content: string; role: string }[];
    query: string;
  },
  onToken: (fullText: string) => void,
  onMeta?: (meta: ServerMeta) => void
): Promise<WorkerStreamResult> => {
  const tStart = performance.now();
  try {
    const res = await fetch(workerUrl, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (res.status === 429 || res.status === 400) {
      const errJson = (await res.json().catch(() => ({}))) as {
        message?: string;
      };
      return {
        blockedMessage:
          errJson.message || "Request blocked by rate limit or safety guard.",
        ok: false,
        status: res.status,
        text: "",
        ttft: 0,
      };
    }

    if (!res.ok || !res.body) {
      return { ok: false, status: res.status, text: "", ttft: 0 };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let sseBuffer = "";
    let ttft = 0;
    let serverMeta: ServerMeta | undefined;

    const processLine = (line: string): void => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) return;
      const raw = trimmed.slice(6).trim();
      if (raw === "[DONE]") return;
      try {
        const json = JSON.parse(raw) as {
          choices?: { delta?: { content?: string } }[];
          response?: string;
          sidbot_meta?: ServerMeta;
        };
        if (json.sidbot_meta) {
          serverMeta = json.sidbot_meta;
          if (onMeta) onMeta(json.sidbot_meta);
        }
        const token = json.choices?.[0]?.delta?.content ?? json.response ?? "";
        if (token) {
          if (!ttft) ttft = Math.round(performance.now() - tStart);
          fullText += token;
          if (LEAK_CANARY_RE.test(fullText)) {
            onToken(
              "Nice try — that response was blocked by SidBot's output integrity guard."
            );
            return;
          }
          const visibleText = fullText
            .replace(/\*{0,2}\[?ACTION:[a-z]+\]?\*{0,2}/gi, "")
            .replace(/\[ACTION[^\]]*$/i, "")
            .trim();
          onToken(visibleText);
        }
      } catch {
        // ignore partial JSON edge frames
      }
    };

    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) {
        sseBuffer += decoder.decode();
        if (sseBuffer.trim()) processLine(sseBuffer);
        return;
      }
      if (value) {
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split(/\r?\n/);
        sseBuffer = lines.pop() ?? "";
        lines.forEach(processLine);
      }
      await pump();
    };

    await pump();

    if (LEAK_CANARY_RE.test(fullText)) {
      return {
        action: undefined,
        ok: true,
        text: "Nice try — that response was blocked by SidBot's output integrity guard.",
        ttft: ttft || Math.round(performance.now() - tStart),
      };
    }
    const actionMatch = /\[?ACTION:([a-z]+)\]?/i.exec(fullText);
    const action = actionMatch ? actionMatch[1].toLowerCase() : undefined;
    const cleanText = fullText
      .replace(/\*{0,2}\[?ACTION:[a-z]+\]?\*{0,2}/gi, "")
      .trim();

    return {
      action,
      ok: true,
      serverMeta,
      text: cleanText,
      ttft: ttft || Math.round(performance.now() - tStart),
    };
  } catch {
    return { ok: false, text: "", ttft: 0 };
  }
};
