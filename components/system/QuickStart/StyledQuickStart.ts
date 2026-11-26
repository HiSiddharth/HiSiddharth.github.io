import styled, { keyframes } from "styled-components";
import { TASKBAR_HEIGHT } from "utils/constants";

const quickStartEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const StyledQuickStart = styled.aside`
  animation: ${quickStartEnter} 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  backdrop-filter: blur(18px);
  background: rgb(11 16 27 / 90%);
  border: 1px solid rgb(56 189 248 / 28%);
  border-radius: 14px;
  bottom: ${TASKBAR_HEIGHT + 14}px;
  box-shadow:
    0 18px 42px rgb(2 6 23 / 65%),
    0 0 0 1px rgb(148 163 184 / 8%) inset;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  gap: 12px;
  max-width: calc(100vw - 24px);
  padding: 14px;
  position: fixed;
  right: 14px;
  width: 356px;
  z-index: 9990;

  @media (width <= 640px) {
    bottom: ${TASKBAR_HEIGHT + 10}px;
    padding: 12px;
    right: 12px;
    width: calc(100vw - 24px);
  }

  .qs-top {
    align-items: flex-start;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .qs-identity {
    align-items: center;
    display: flex;
    gap: 10px;
    min-width: 0;
  }

  .qs-avatar {
    flex-shrink: 0;
    height: 42px;
    width: 42px;

    svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  }

  .qs-title-wrap {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .qs-title-row {
    align-items: center;
    display: flex;
    gap: 6px;
  }

  .qs-title {
    color: #f8fafc;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
  }

  .qs-badge {
    background: rgb(56 189 248 / 16%);
    border: 1px solid rgb(56 189 248 / 35%);
    border-radius: 999px;
    color: #7dd3fc;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.03em;
    padding: 1px 7px;
    text-transform: uppercase;
  }

  .qs-subtitle {
    color: #94a3b8;
    font-size: 11px;
    line-height: 1.3;
  }

  .qs-close {
    align-items: center;
    background: rgb(30 41 59 / 70%);
    border: 1px solid rgb(148 163 184 / 20%);
    border-radius: 8px;
    color: #94a3b8;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-size: 14px;
    height: 24px;
    justify-content: center;
    line-height: 1;
    padding: 0;
    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease;
    width: 24px;

    &:hover {
      background: rgb(51 65 85 / 85%);
      border-color: rgb(148 163 184 / 40%);
      color: #f8fafc;
    }
  }

  .qs-message {
    color: #cbd5e1;
    cursor: text;
    font-size: 12.5px;
    line-height: 1.5;
    margin: 0;
    overflow-wrap: anywhere;
    user-select: text;
  }

  .qs-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .qs-pill {
    align-items: center;
    background: rgb(30 41 59 / 82%);
    border: 1px solid rgb(148 163 184 / 24%);
    border-radius: 999px;
    color: #e2e8f0;
    cursor: pointer;
    display: inline-flex;
    font-size: 11.5px;
    font-weight: 600;
    gap: 5px;
    line-height: 1.2;
    padding: 6px 11px;
    transition:
      background 140ms ease,
      border-color 140ms ease,
      color 140ms ease,
      transform 140ms ease;

    &:hover {
      background: rgb(51 65 85 / 92%);
      border-color: rgb(148 163 184 / 48%);
      color: #fff;
      transform: translateY(-1px);
    }

    &[data-primary="true"] {
      background: rgb(14 165 233 / 22%);
      border-color: rgb(56 189 248 / 50%);
      color: #bae6fd;
    }

    &[data-primary="true"]:hover {
      background: rgb(14 165 233 / 34%);
      border-color: rgb(56 189 248 / 80%);
      color: #fff;
    }
  }
`;

export default StyledQuickStart;
