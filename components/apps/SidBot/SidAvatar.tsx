import { useEffect, useState } from "react";

export type AvatarMood = "hyped" | "idle" | "speaking" | "thinking";

interface SidAvatarProps {
  mood: AvatarMood;
}

const MOUTH_PATHS = [
  "M 42 64 Q 50 67 58 64",
  "M 43 63 Q 50 69 57 63",
  "M 43 62 Q 50 73 57 62 Q 50 61 43 62",
  "M 44 64 Q 52 67 59 62",
];

const SidAvatar: FC<SidAvatarProps> = ({ mood }) => {
  const [blinking, setBlinking] = useState(false);
  const [mouthIdx, setMouthIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBlinking(true);
      window.setTimeout(() => setBlinking(false), 140);
    }, 3400);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id =
      mood === "speaking"
        ? window.setInterval(() => {
            setMouthIdx((prev) => (prev + 1) % 3);
          }, 115)
        : 0;

    return () => {
      if (id) window.clearInterval(id);
    };
  }, [mood]);

  const activeMouthIdx =
    mood === "speaking" ? mouthIdx : mood === "hyped" ? 3 : 0;
  const eyeShiftX = mood === "thinking" ? 2.2 : 0;
  const browOffsetY = mood === "thinking" ? -2.5 : mood === "hyped" ? -1.5 : 0;
  const ringColor =
    mood === "thinking"
      ? "#f59e0b"
      : mood === "speaking"
        ? "#22d3ee"
        : mood === "hyped"
          ? "#34d399"
          : "#38bdf8";

  return (
    <svg
      aria-label="SidBot 9000 animated cartoon avatar"
      height="46"
      viewBox="0 0 100 100"
      width="46"
    >
      <circle
        cx="50"
        cy="50"
        fill="#0b1220"
        r="46"
        stroke={ringColor}
        strokeWidth="2.5"
      />
      <path
        d="M 18 92 C 20 74 34 70 50 70 C 66 70 80 74 82 92 Z"
        fill="#1e293b"
      />
      <path
        d="M 38 71 L 50 82 L 62 71"
        fill="none"
        stroke="#38bdf8"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M 22 48 C 22 23 78 23 78 48"
        fill="none"
        stroke="#334155"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M 22 48 C 22 23 78 23 78 48"
        fill="none"
        stroke={ringColor}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect fill="#d99f68" height="12" rx="4" width="14" x="43" y="64" />
      <ellipse cx="50" cy="48" fill="#e8b482" rx="22" ry="24" />
      <rect
        fill="#0f172a"
        height="18"
        rx="4"
        stroke={ringColor}
        strokeWidth="1.5"
        width="7"
        x="21"
        y="40"
      />
      <rect
        fill="#0f172a"
        height="18"
        rx="4"
        stroke={ringColor}
        strokeWidth="1.5"
        width="7"
        x="72"
        y="40"
      />
      <path
        d="M 28 43 C 27 24 41 18 53 19 C 67 20 74 28 72 43 C 68 35 61 32 52 33 C 45 34 38 29 33 35 C 30 38 29 40 28 43 Z"
        fill="#111827"
      />
      <path d="M 41 22 L 46 15 L 51 21 L 58 16 L 60 23" fill="#111827" />
      <path
        d={`M 36 ${39 + browOffsetY} Q 41 ${37 + browOffsetY} 45 ${39 + browOffsetY}`}
        fill="none"
        stroke="#111827"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <path
        d={`M 55 ${39 + (mood === "thinking" ? 0 : browOffsetY)} Q 59 ${37 + browOffsetY} 64 ${39 + browOffsetY}`}
        fill="none"
        stroke="#111827"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      {blinking ? (
        <>
          <line
            stroke="#111827"
            strokeLinecap="round"
            strokeWidth="2.2"
            x1="37"
            x2="44"
            y1="45"
            y2="45"
          />
          <line
            stroke="#111827"
            strokeLinecap="round"
            strokeWidth="2.2"
            x1="56"
            x2="63"
            y1="45"
            y2="45"
          />
        </>
      ) : (
        <>
          <circle cx="40.5" cy="45" fill="#ffffff" r="4" />
          <circle cx="59.5" cy="45" fill="#ffffff" r="4" />
          <circle cx={40.5 + eyeShiftX} cy="45" fill="#0f172a" r="2.2" />
          <circle cx={59.5 + eyeShiftX} cy="45" fill="#0f172a" r="2.2" />
          <circle cx={41.3 + eyeShiftX} cy="44" fill="#ffffff" r="0.8" />
          <circle cx={60.3 + eyeShiftX} cy="44" fill="#ffffff" r="0.8" />
        </>
      )}
      <path
        d="M 33 56 Q 50 74 67 56"
        fill="none"
        opacity="0.22"
        stroke="#1f2937"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
      <path
        d={MOUTH_PATHS[activeMouthIdx]}
        fill={activeMouthIdx === 2 ? "#7f1d1d" : "none"}
        stroke="#1f2937"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
};

export default SidAvatar;
