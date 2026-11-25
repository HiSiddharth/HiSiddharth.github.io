import { useCallback, useEffect, useRef, useState } from "react";
import MarkdownText from "components/apps/SidBot/MarkdownText";
import {
  buildOfflineFallbackReply,
  loadRagIndex,
  type RagIndex,
  type RetrievalHit,
  retrieveTopChunks,
  streamWorkerReply,
} from "components/apps/SidBot/ragEngine";
import SidAvatar, { type AvatarMood } from "components/apps/SidBot/SidAvatar";
import StyledSidBot from "components/apps/SidBot/StyledSidBot";
import AppContainer, {
  useAppContainer,
} from "components/system/Apps/AppContainer";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import { useProcessesActions } from "contexts/process";

const RAG_INDEX: RagIndex = loadRagIndex();
const INDEX_INFO = `${RAG_INDEX.docCount} docs · ${RAG_INDEX.chunkCount} chunks · vec=${RAG_INDEX.hasVectors ? "on" : "off"}`;

const FOLLOWUP_RE =
  /\b(?:it|its|that|this|those|these|they|them|more|details?|explain|elaborate|else|why|continue|above)\b/i;
const EXPLICIT_TOPIC_RE =
  /\b(?:loom|revolver|immich|lora|moss|podpitara|accenture|hobbies|guitar|motorcycle|bike|social|contact|email|resume|skill|education|pihole|fridge|apk)\b/i;

const SIDBOT_WORKER_URL =
  process.env.NEXT_PUBLIC_SIDBOT_URL ||
  "https://sidbot9000-proxy.hisiddharth.workers.dev";

interface ChatMessage {
  action?: string;
  id: string;
  meta?: string;
  role: "bot" | "user";
  text: string;
}

const QUICK_PROMPTS = [
  // Core & Intro
  { label: "30s Pitch", query: "Pitch yourself in 30 seconds" },
  {
    label: "Top Projects",
    query: "What are some of Siddharth's best projects?",
  },
  {
    label: "Tech Stack & AI",
    query: "What tools and AI tech does Siddharth work with?",
  },
  {
    label: "Outside Code",
    query: "What are Siddharth's hobbies outside of work?",
  },

  // Career, Impact & How He Works
  {
    label: "Career Highlights",
    query: "What are Siddharth's biggest career achievements?",
  },
  {
    label: "How He Builds",
    query: "How does Siddharth approach building and shipping projects?",
  },
  {
    label: "Lessons Learned",
    query: "What is a tough technical challenge Siddharth solved?",
  },
  {
    label: "What's Next",
    query: "What is Siddharth exploring or excited about right now?",
  },
];

const ACTION_LABELS: Record<string, string> = {
  github: "Open GitHub (HiSiddharth)",
  immich: "SecureImmich Info",
  linkedin: "Open LinkedIn",
  podpitara: "Podpitara Case Study",
  resume: "Open Resume PDF",
};

const SidBot: FC<ComponentProcessProps> = ({ id }) => {
  const containerProps = useAppContainer(id);
  const { setLoading } = containerProps;
  const { open } = useProcessesActions();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      action: "resume",
      id: "welcome",
      role: "bot",
      text: "Hi, I'm SidBot 9000, an AI assistant grounded in Siddharth's work and background via hybrid RAG. Ask me about his projects, career achievements, skills, or personal interests to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<AvatarMood>("idle");
  const [busy, setBusy] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [lastHits, setLastHits] = useState<RetrievalHit[]>([]);
  const [lastMode, setLastMode] = useState("offline-bm25+synonyms");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const dispatchOsAction = useCallback(
    (action: string) => {
      if (action === "resume") {
        open("PDF", { url: "/Users/Public/Desktop/Resume.pdf" });
      } else if (action === "github") {
        window.open(
          "https://github.com/HiSiddharth",
          "_blank",
          "noopener,noreferrer"
        );
      } else if (action === "linkedin") {
        window.open(
          "https://www.linkedin.com/in/hisiddharth/",
          "_blank",
          "noopener,noreferrer"
        );
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
      scrollToBottom();

      let prevUserText: string | undefined;
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        const candidate = messages[i];
        if (candidate.role === "user") {
          prevUserText = candidate.text;
          break;
        }
      }
      const isFollowUp =
        Boolean(prevUserText) &&
        query.split(/\s+/).length <= 8 &&
        FOLLOWUP_RE.test(query) &&
        !EXPLICIT_TOPIC_RE.test(query);
      const retrievalQuery = isFollowUp ? `${prevUserText} ${query}` : query;

      const localRetrieval = retrieveTopChunks(RAG_INDEX, retrievalQuery, 4);
      setLastHits(localRetrieval.hits);
      setLastMode(localRetrieval.mode);

      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .slice(-8)
        .map((m) => ({
          content: m.text,
          role: m.role === "bot" ? "assistant" : "user",
        }));

      if (SIDBOT_WORKER_URL) {
        setMood("speaking");
        setMessages((prev) => [...prev, { id: botId, role: "bot", text: "" }]);

        const result = await streamWorkerReply(
          SIDBOT_WORKER_URL,
          { history: historyPayload, query },
          (partialText) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId ? { ...m, text: partialText } : m
              )
            );
            scrollToBottom();
          },
          (serverMeta) => {
            setLastHits(serverMeta.hits);
            setLastMode(serverMeta.mode);
          }
        );

        if (result.blockedMessage) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId
                ? {
                    ...m,
                    meta:
                      result.status === 429
                        ? "Edge Rate Limit (429)"
                        : "Safety Guard (400)",
                    text: result.blockedMessage ?? "",
                  }
                : m
            )
          );
          setMood("idle");
          setBusy(false);
          scrollToBottom();
          return;
        }

        if (result.ok) {
          const activeMode = result.serverMeta?.mode ?? localRetrieval.mode;
          const activeMs =
            result.serverMeta?.retrievalMs ?? localRetrieval.retrievalMs;
          const meta = `${activeMode} (${activeMs}ms) · TTFT ${result.ttft}ms`;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId
                ? { ...m, action: result.action, meta, text: result.text }
                : m
            )
          );
          setMood(result.action ? "hyped" : "idle");
          setBusy(false);
          scrollToBottom();
          return;
        }
      }

      const fallback = buildOfflineFallbackReply(localRetrieval.hits);
      const meta = `${localRetrieval.mode} (${localRetrieval.retrievalMs}ms) · Offline Fallback`;
      setMood("speaking");
      setMessages((prev) => {
        const hasBot = prev.some((m) => m.id === botId);
        const nextMsg: ChatMessage = {
          action: fallback.action,
          id: botId,
          meta,
          role: "bot",
          text: fallback.text,
        };
        return hasBot
          ? prev.map((m) => (m.id === botId ? nextMsg : m))
          : [...prev, nextMsg];
      });
      window.setTimeout(() => setMood("idle"), 900);
      setBusy(false);
      scrollToBottom();
    },
    [busy, messages, scrollToBottom]
  );

  return (
    <AppContainer {...containerProps} StyledComponent={StyledSidBot}>
      <div className="sidbot-header">
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
                {SIDBOT_WORKER_URL ? "Online · Edge RAG" : "Offline RAG"}
              </span>
            </div>
          </div>
        </div>
        <button
          className="inspector-toggle"
          data-active={showInspector}
          onClick={() => setShowInspector((s) => !s)}
          type="button"
        >
          {"</>"} RAG
        </button>
      </div>

      <div className="chat-body">
        <div className="messages">
          {messages.map((m) => {
            const { action } = m;
            return (
              <div key={m.id} className={`msg ${m.role}`}>
                {m.role === "bot" ? (
                  <MarkdownText text={m.text} />
                ) : (
                  <div>{m.text}</div>
                )}
                {action && (
                  <div>
                    <button
                      className="action-btn"
                      onClick={() => dispatchOsAction(action)}
                      type="button"
                    >
                      ⚡ {ACTION_LABELS[action] || `Run: ${action}`}
                    </button>
                  </div>
                )}
                {showInspector && m.meta && (
                  <div className="msg-meta">{m.meta}</div>
                )}
              </div>
            );
          })}

          {messages.length === 1 && (
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  className="chip-btn"
                  onClick={() => sendMessage(q.query)}
                  type="button"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {showInspector && (
          <aside className="rag-drawer">
            <h2>{"</>"} RAG Telemetry</h2>
            <div style={{ color: "#94a3b8", marginBottom: "4px" }}>
              {INDEX_INFO}
            </div>
            <div style={{ color: "#64748b", marginBottom: "10px" }}>
              mode: {lastMode}
            </div>
            {lastHits.length === 0 ? (
              <div style={{ color: "#64748b" }}>
                Ask any question to inspect top-K hybrid scores and latency.
              </div>
            ) : (
              lastHits.map((hit) => (
                <div key={hit.chunk.id} className="rag-card">
                  <div className="rag-score">
                    {hit.score} (vec:{hit.vectorScore} · bm25:{hit.bm25Score})
                  </div>
                  <div style={{ color: "#e2e8f0", margin: "4px 0" }}>
                    {hit.chunk.title}
                  </div>
                  <div style={{ color: "#94a3b8" }}>
                    {hit.chunk.text.slice(0, 100)}...
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
          placeholder="Ask me anything!"
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
