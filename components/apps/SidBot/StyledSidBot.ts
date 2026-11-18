import styled from "styled-components";

const StyledSidBot = styled.div`
  background: #0b101b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  height: 100%;
  overflow: hidden;
  width: 100%;

  .sidbot-header {
    align-items: center;
    background: linear-gradient(90deg, #0f172a 0%, #111c33 100%);
    border-bottom: 1px solid rgba(56, 189, 248, 0.22);
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 10px 14px;
  }

  .sidbot-identity {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .sidbot-title h1 {
    color: #f8fafc;
    font-size: 15px;
    font-weight: 700;
    margin: 0;
  }

  .sidbot-status {
    align-items: center;
    color: #94a3b8;
    display: flex;
    font-family: monospace;
    font-size: 11px;
    gap: 6px;
    margin-top: 2px;
  }

  .sidbot-dot {
    border-radius: 50%;
    height: 7px;
    width: 7px;
  }

  .inspector-toggle {
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-radius: 6px;
    color: #7dd3fc;
    cursor: pointer;
    font-family: monospace;
    font-size: 11px;
    padding: 6px 10px;
    transition: background 0.15s;

    &:hover {
      background: rgba(56, 189, 248, 0.24);
    }
  }

  .quick-prompts {
    background: #0f172a;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px 14px;
  }

  .chip-btn {
    background: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 999px;
    color: #cbd5e1;
    cursor: pointer;
    font-size: 11.5px;
    padding: 4px 10px;
    transition: all 0.15s;

    &:hover {
      border-color: #38bdf8;
      color: #ffffff;
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
    gap: 12px;
    overflow-y: auto;
    padding: 14px;
  }

  .msg {
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.5;
    max-width: 86%;
    padding: 10px 13px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .msg.user {
    align-self: flex-end;
    background: #1d4ed8;
    border: 1px solid #3b82f6;
    color: #ffffff;
  }

  .msg.bot {
    align-self: flex-start;
    background: #131c2e;
    border: 1px solid rgba(56, 189, 248, 0.22);
    color: #e2e8f0;
  }

  .msg-meta {
    color: #64748b;
    font-family: monospace;
    font-size: 10.5px;
    margin-top: 6px;
  }

  .action-btn {
    background: rgba(16, 185, 129, 0.16);
    border: 1px solid rgba(52, 211, 153, 0.45);
    border-radius: 6px;
    color: #6ee7b7;
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    margin-top: 8px;
    padding: 5px 10px;

    &:hover {
      background: rgba(16, 185, 129, 0.3);
    }
  }

  .rag-drawer {
    background: #080c14;
    border-left: 1px solid rgba(56, 189, 248, 0.2);
    font-family: monospace;
    font-size: 11px;
    overflow-y: auto;
    padding: 12px;
    width: 240px;
  }

  .rag-drawer h2 {
    color: #38bdf8;
    font-size: 12px;
    margin: 0 0 8px;
  }

  .rag-card {
    background: #0f172a;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 8px;
  }

  .rag-score {
    color: #34d399;
    font-weight: 700;
  }

  .input-bar {
    background: #0f172a;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    display: flex;
    gap: 8px;
    padding: 10px 14px;
  }

  .input-bar input {
    background: #020617;
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 8px;
    color: #f8fafc;
    flex: 1;
    font-size: 13px;
    outline: none;
    padding: 9px 12px;

    &:focus {
      border-color: #38bdf8;
    }
  }

  .input-bar button {
    background: #0284c7;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    padding: 0 16px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export default StyledSidBot;