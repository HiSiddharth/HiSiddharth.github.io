import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildOfflineFallbackReply,
  loadRagIndex,
  type RagIndex,
  type RetrievalHit,
  retrieveTopChunks,
} from "components/apps/SidBot/ragEngine";
import SidAvatar, { type AvatarMood } from "components/apps/SidBot/SidAvatar";
import StyledSidBot from "components/apps/SidBot/StyledSidBot";
import AppContainer, {
  useAppContainer,
} from "components/system/Apps/AppContainer";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useProcessesActions } from "contexts/process";

// Paste your Cloudflare Worker URL here once Groq is back up and deployed:
const SIDBOT_WORKER_URL = process.env.NEXT_PUBLIC_SIDBOT_URL || "";

interface ChatMessage {
  action?: string;
  id: string;
  meta?: string;
  role: "bot" | "user";
  text: string;
}

const QUICK_PROMPTS = [
  "Pitch yourself in 30 seconds",
  "How did you run Dual-LoRA on 8GB VRAM?",
  "Tell me about Podpitara & SecureImmich",
  "What are your hobbies outside code?",
];

const ACTION_LABELS: Record<string, string> = {
  github: "Open GitHub (HiSiddharth)",
  immich: "SecureImmich Info",
  linkedin: "Open LinkedIn",
  lora: "Dual-LoRA Lab (Coming Next)",
  podpitara: "Podpitara Case Study",
  resume: "Open Sanitized Resume PDF",
};

const SidBot: FC<ComponentProcessProps> = ({ id }) => {
  const containerProps = useAppContainer(id);
const { open } = useProcessesActions();

  const [ragIndex, setRagIndex] = useState<RagIndex | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      action: "resume",
      id: "welcome",
      role: "bot",
      text: "Hey! I'm SidBot 9000 — Siddharth's digital twin. Ask me about my Applied AI work (like running Dual-LoRA pipelines on an 8GB RTX 4060), Podpitara's 70k-passenger IoT radio, homelab security, or electric guitar & Star Wars.",
    },
  ]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<AvatarMood>("idle");
  const [busy, setBusy] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [lastHits, setLastHits] = useState<RetrievalHit[]>([]);
  const [lastTelemetry, setLastTelemetry] = useState<string>("Ready");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadRagIndex()
      .then((idx) => {
        setRagIndex(idx);
        setLastTelemetry(`${idx.docCount} docs · ${idx.chunkCount} chunks loaded`);
      })
      .catch(() => {
        setLastTelemetry("RAG index missing — run build-sidbot-rag.mjs");
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const dispatchOsAction = useCallback(
    (action: string) => {
      if (action === "resume") {
        open("PDF", { url: "/Users/Public/Desktop/Resume.pdf" });
      } else if (action === "github") {
        window.open("https://github.com/HiSiddharth", "_blank", "noopener,noreferrer");
      } else if (action === "linkedin") {
        window.open("https://linkedin.com", "_blank", "noopener,noreferrer");
      }
    },
    [open]
  );

  const sendMessage = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || busy) return;

      setInput("");
      setBusy(true);
      setMood("thinking");

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: query,
      };
      const botId = `b-${Date.now() + 1}`;
      setMessages((prev) => [...prev, userMsg]);

      const idx = ragIndex ?? (await loadRagIndex().catch(() => null));
      const retrieval = idx
        ? retrieveTopChunks(idx, query, 3)
        : { hits: [], retrievalMs: 0 };

      setLastHits(retrieval.hits);

      const contextString = retrieval.hits
        .map((h) => `[${h.chunk.title} | score=${h.score}]\n${h.chunk.text}`)
        .join("\n\n");

      const historyPayload = messages
        .slice(-6)
        .map((m) => ({
          content: m.text,
          role: m.role === "bot" ? "assistant" : "user",
        }));

      const tStart = performance.now();

      try {
        if (!SIDBOT_WORKER_URL) {
          throw new Error("worker_unconfigured");
        }

        const res = await fetch(SIDBOT_WORKER_URL, {
          body: JSON.stringify({
            context: contextString,
            history: historyPayload,
            query,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!res.ok || !res.body) {
          throw new Error(`worker_http_${res.status}`);
        }

        setMood("speaking");
        setMessages((prev) => [...prev, { id: botId, role: "bot", text: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let ttft = 0;

        let doneReading = false;
        while (!doneReading) {
          const { done, value } = await reader.read();
          doneReading = done;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload) as {
                  choices?: { delta?: { content?: string } }[];
                };
                const token = json.choices?.[0]?.delta?.content || "";
                if (token) {
                  if (!ttft) ttft = Math.round(performance.now() - tStart);
                  fullText += token;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === botId ? { ...m, text: fullText } : m))
                  );
                }
              } catch {
                // ignore partial SSE JSON frames
              }
            }
          }
        }

        const actionMatch = fullText.match(/\[ACTION:([a-z]+)\]\s*$/i);
        const parsedAction = actionMatch ? actionMatch[1].toLowerCase() : undefined;
        const cleanText = fullText.replace(/\[ACTION:[a-z]+\]\s*$/i, "").trim();

        const meta = `RAG: ${retrieval.retrievalMs}ms · TTFT: ${ttft || Math.round(performance.now() - tStart)}ms · Cloud LLM`;
        setLastTelemetry(meta);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, action: parsedAction, meta, text: cleanText } : m
          )
        );
        setMood(parsedAction ? "hyped" : "idle");
      } catch {
        // Guaranteed instant fallback when Groq/Worker isn't configured or is down
        const fallback = buildOfflineFallbackReply(retrieval.hits);
        const meta = `RAG: ${retrieval.retrievalMs}ms · Local Deterministic Mode`;
        setLastTelemetry(meta);
        setMood("speaking");
        setMessages((prev) => [
          ...prev,
          { action: fallback.action, id: botId, meta, role: "bot", text: fallback.text },
        ]);
        window.setTimeout(() => setMood("idle"), 900);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, ragIndex]
  );

  return (
    <AppContainer {...containerProps} StyledComponent={StyledSidBot}>
      <header className="sidbot-header">
        <div className="sidbot-identity">
          <SidAvatar mood={mood} />
          <div className="sidbot-title">
            <h1>SidBot 9000</h1>
            <div className="sidbot-status">
              <span
                className="sidbot-dot"
                style={{
                  background: SIDBOT_WORKER_URL ? "#34d399" : "#fbbf24",
                }}
              />
              <span>
                {SIDBOT_WORKER_URL ? "EDGE LLM + RAG" : "LOCAL RAG MODE"} · {lastTelemetry}
              </span>
            </div>
          </div>
        </div>
        <button
          className="inspector-toggle"
          onClick={() => setShowInspector((s) => !s)}
          type="button"
        >
          {showInspector ? "Hide RAG" : "</> RAG Inspector"}
        </button>
      </header>

      <div className="quick-prompts">
        {QUICK_PROMPTS.map((q) => (
          <button
            className="chip-btn"
            key={q}
            onClick={() => sendMessage(q)}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="chat-body">
        <div className="messages">
          {messages.map((m) => (
            <div className={`msg ${m.role}`} key={m.id}>
              <div>{m.text}</div>
              {m.action && (
                <div>
                  <button
                    className="action-btn"
                    onClick={() => dispatchOsAction(m.action!)}
                    type="button"
                  >
                    ⚡ {ACTION_LABELS[m.action] || `Run: ${m.action}`}
                  </button>
                </div>
              )}
              {m.meta && <div className="msg-meta">{m.meta}</div>}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {showInspector && (
          <aside className="rag-drawer">
            <h2>{"</>"} RAG Retrieval</h2>
            {lastHits.length === 0 ? (
              <div style={{ color: "#64748b" }}>
                Ask any question to inspect top-K BM25 chunks, scores, and latency.
              </div>
            ) : (
              lastHits.map((hit) => (
                <div className="rag-card" key={hit.chunk.id}>
                  <div className="rag-score">score: {hit.score}</div>
                  <div style={{ color: "#e2e8f0", margin: "4px 0" }}>
                    {hit.chunk.title}
                  </div>
                  <div style={{ color: "#94a3b8" }}>
                    {hit.chunk.text.slice(0, 120)}...
                  </div>
                </div>
              ))
            )}
          </aside>
        )}
      </div>

      <form
        className="input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Dual-LoRA, Podpitara, Accenture, guitar..."
          type="text"
          value={input}
        />
        <button disabled={busy || !input.trim()} type="submit">
          {busy ? "..." : "Send"}
        </button>
      </form>
    </AppContainer>
  );
};

export default SidBot;