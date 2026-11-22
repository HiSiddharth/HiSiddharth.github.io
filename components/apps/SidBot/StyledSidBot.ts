import styled from "styled-components";

const StyledSidBot = styled.div`
  background: #0b101b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  height: 100%;
  overflow: hidden;
  width: 100%;

  .sidbot-header {
    align-items: center;
    background: rgb(15 23 42 / 92%);
    border-bottom: 1px solid rgb(148 163 184 / 14%);
    display: flex;
    flex-shrink: 0;
    gap: 10px;
    justify-content: space-between;
    padding: 8px 14px;
  }

  .sidbot-identity {
    align-items: center;
    display: flex;
    gap: 10px;
  }

  .sidbot-title h1 {
    color: #f8fafc;
    font-size: 14px;
    font-weight: 700;
    margin: 0;
  }

  .sidbot-status {
    align-items: center;
    color: #94a3b8;
    display: flex;
    font-size: 11px;
    gap: 6px;
    margin-top: 1px;
  }

  .sidbot-dot {
    border-radius: 50%;
    flex-shrink: 0;
    height: 7px;
    width: 7px;
  }

  .inspector-toggle {
    background: rgb(30 41 59 / 80%);
    border: 1px solid rgb(148 163 184 / 25%);
    border-radius: 6px;
    color: #94a3b8;
    cursor: pointer;
    flex-shrink: 0;
    font-family: monospace;
    font-size: 11px;
    padding: 5px 9px;
    transition: all 0.15s;

    &:hover,
    &[data-active="true"] {
      background: rgb(56 189 248 / 14%);
      border-color: rgb(56 189 248 / 45%);
      color: #7dd3fc;
    }
  }

  .chat-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    scrollbar-color: rgb(148 163 184 / 25%) transparent;
    scrollbar-width: thin;
  }

  .msg {
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.55;
    max-width: 82%;
    overflow-wrap: anywhere;
    padding: 10px 14px;
    user-select: text;
  }

  .msg.user {
    align-self: flex-end;
    background: #1d4ed8;
    border-bottom-right-radius: 4px;
    color: #fff;
    white-space: pre-wrap;
  }

  .msg.bot {
    align-self: flex-start;
    background: #131c2e;
    border: 1px solid rgb(148 163 184 / 14%);
    border-bottom-left-radius: 4px;
    color: #e2e8f0;
  }

  .md-content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    p {
      margin: 0;
      user-select: text;
    }

    strong {
      color: #f8fafc;
      font-weight: 700;
    }

    .md-heading {
      color: #7dd3fc;
      font-size: 13.5px;
      font-weight: 700;
      margin-top: 2px;
    }

    ul,
    ol {
      margin: 2px 0;
      padding-left: 18px;
    }

    li {
      margin: 2px 0;
      user-select: text;
    }

    code {
      background: rgb(15 23 42 / 90%);
      border: 1px solid rgb(148 163 184 / 20%);
      border-radius: 4px;
      color: #7dd3fc;
      font-family: monospace;
      font-size: 11.5px;
      padding: 1px 5px;
      user-select: text;
    }

    pre {
      background: #020617;
      border: 1px solid rgb(148 163 184 / 20%);
      border-radius: 6px;
      margin: 2px 0;
      overflow-x: auto;
      padding: 8px 10px;

      code {
        background: transparent;
        border: none;
        padding: 0;
      }
    }

    a {
      color: #38bdf8;
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .msg-meta {
    color: #64748b;
    font-family: monospace;
    font-size: 10px;
    margin-top: 6px;
    user-select: text;
  }

  .quick-prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }

  .chip-btn {
    background: rgb(30 41 59 / 75%);
    border: 1px solid rgb(56 189 248 / 24%);
    border-radius: 999px;
    color: #cbd5e1;
    cursor: pointer;
    font-size: 11.5px;
    padding: 5px 11px;
    transition: all 0.15s;

    &:hover {
      background: rgb(56 189 248 / 14%);
      border-color: #38bdf8;
      color: #fff;
    }
  }

  .action-btn {
    background: rgb(16 185 129 / 12%);
    border: 1px solid rgb(52 211 153 / 35%);
    border-radius: 6px;
    color: #6ee7b7;
    cursor: pointer;
    display: inline-block;
    font-size: 11.5px;
    font-weight: 600;
    margin-top: 8px;
    padding: 4px 10px;

    &:hover {
      background: rgb(16 185 129 / 24%);
    }
  }

  .rag-drawer {
    background: #080c14;
    border-left: 1px solid rgb(148 163 184 / 14%);
    flex-shrink: 0;
    font-family: monospace;
    font-size: 11px;
    overflow-y: auto;
    padding: 12px;
    user-select: text;
    width: 230px;
  }

  .rag-drawer h2 {
    color: #38bdf8;
    font-size: 11.5px;
    margin: 0 0 6px;
  }

  .rag-card {
    background: #0f172a;
    border: 1px solid rgb(148 163 184 / 16%);
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 8px;
    user-select: text;
  }

  .rag-score {
    color: #34d399;
    font-weight: 700;
  }

  .input-bar {
    background: rgb(15 23 42 / 92%);
    border-top: 1px solid rgb(148 163 184 / 14%);
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    padding: 10px 14px;
  }

  .input-bar input {
    background: #020617;
    border: 1px solid rgb(148 163 184 / 24%);
    border-radius: 8px;
    color: #f8fafc;
    cursor: text;
    flex: 1;
    font-size: 13px;
    outline: none;
    padding: 8px 12px;
    user-select: text;

    &:focus {
      border-color: #38bdf8;
    }
  }

  .input-bar button {
    background: #0284c7;
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 600;
    padding: 0 15px;

    &:disabled {
      cursor: not-allowed;
      opacity: 45%;
    }
  }
`;

export default StyledSidBot;
