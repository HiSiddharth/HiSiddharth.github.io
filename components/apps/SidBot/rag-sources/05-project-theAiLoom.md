---
title: The AI Loom
category: projects
aliases: ai loom, the ai loom, langgraph, lm studio, vram, multi-agent, coding orchestrator, qwen, local llm, agentic, 4060
action: open:ailoom
---

## Overview

**The AI Loom** is a local-first, multi-model coding orchestrator built with Python, LangGraph, and LM Studio. Instead of forcing a single local model to handle everything, it splits **Planning**, **Implementation**, and **Verification** across specialized models—dynamically swapping them in and out of GPU VRAM so multi-agent engineering loops run reliably on consumer hardware (like an RTX 4060 with 8GB VRAM).

- **GitHub:** https://github.com/HiSiddharth/The-AI-Loom

## How It Works

1. **Planner Node (`Qwen 3.5 9B`):** Decomposes a high-level user objective into a structured task plan.
2. **VRAM Swap (`9B` → `4B`):** Explicitly unloads the 9B model via LM Studio's REST API before loading the worker model to stay within tight VRAM limits.
3. **Worker Node (`Qwen 3 4B Thinking`):** Generates code for each task, executes scripts via `subprocess` inside `./sandbox`, and feeds captured `stderr` tracebacks and prior code back into retry loops on failure.
4. **VRAM Swap (`4B` → `9B`):** Unloads the worker once tasks finish and reloads the 9B model.
5. **Verifier Node (`Qwen 3.5 9B`):** Reviews the generated code alongside actual execution outputs, issuing either `STATUS: APPROVED` or `STATUS: REVISE` (looping back to the Planner up to `MAX_MANAGER_RETRIES`).

## Key Engineering Details

- **Dynamic VRAM Lifecycle Management (`hardware.py`):** Interacts directly with LM Studio's `/api/v0/models` and `/api/v1/models/{load,unload}` endpoints to prevent out-of-memory crashes on single-GPU setups.
- **Stateful LangGraph Pipeline (`graph.py`, `nodes.py`):** Coordinates conditional routing, sequential code generation, bounded retries, and manager review loops.
- **Execution-Grounded Self-Correction:** Validates code by running it rather than relying solely on static LLM self-reflection.
- **Thinking-Model Output Sanitization:** Strips `<think>...</think>` reasoning blocks before parsing JSON task plans, Python code blocks, or verification verdicts.
- **Observability:** Streams node transitions, VRAM swap timings, execution logs, and review verdicts to `stdout` and `./sandbox/platform.log`.

## Current Scope & Roadmap

- **Current Constraints:** Scripts run directory-scoped (`cwd="./sandbox"`) via `subprocess` rather than full OS/container isolation, and individual files are validated sequentially via `python <filename>`.
- **Planned for v1.0:** Ephemeral Docker container sandboxing (`--network none`), automated `pytest` and linter validation inside the Worker loop, Tree-sitter repo indexing with SQLite project memory, and OpenCode CLI integration.
