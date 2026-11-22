---
title: Applied AI & Systems Projects
category: projects
aliases: podpitara, iot, radio, esp32, immich, wireguard, luks, pihole, lora, influencer, moss, ai loom, revolver, 4060, resume reviewer, fridge, smart home, apk
action: open:lora
---

## The AI Loom (Local Multi-Agent Coding Orchestrator)

Built a local-first agentic coding orchestration pipeline using Python, LangGraph, and LM Studio, specifically engineered to run on consumer hardware (RTX 4060 8GB VRAM). Sequences distinct Planner, Worker, and Verifier LLMs with automated VRAM unloading and `q8_0` KV-cache quantization to execute complex tasks without out-of-memory crashes.

## REvolver & Multi-Agent Resume Critic

- **REvolver (Resume Evolver):** Serverless AI resume-tailoring automation integrating Google Apps Script, Google Sheets, Google Docs templates, OpenRouter APIs, and a browser bookmarklet to dynamically adapt resumes to job descriptions.
- **Resume Reviewer Pro:** Open-source multi-agent resume evaluation app deployed on Streamlit Cloud, designed to critique resumes using specialized agent personas rather than generic single-prompt wrappers.

## Local AI Influencer & Custom LoRA Pipeline

Trained a custom character identity LoRA (using Fizgig workflows on Kaggle) and built a local generation pipeline in ComfyUI on an RTX 4060 Laptop (8GB VRAM, 24GB RAM). Combined the LoRA with open-weight models (MOSS-Image), managing VRAM bottlenecks and trigger tokens to maintain consistent character identity without concept bleed.

## Self-Hosted Infrastructure & Homelab

- **SecureImmichServer:** Self-hosted personal photo cloud on Ubuntu Linux, hardened behind a WireGuard VPN, Nginx reverse proxy, UFW firewall, DDNS, and LUKS full-disk encryption.
- **Android Pi-hole:** Repurposed a rooted 2019 Xiaomi Redmi 6 Pro into a low-power, always-on network-wide DNS sinkhole for ad and telemetry blocking.

## Hardware Automation & Reverse Engineering

- **Smart Refrigerator Thermostat:** Engineered an ESP32-based controller using dual temperature sensors, Wi-Fi smart-plug integration and auto-defrost logic.
- **APK Telemetry Stripping:** Regularly decompile and patch Android APKs (`apktool` / `apksigner`) to strip telementry, ads and remove `INTERNET` permissions.
- **Podpitara Transit Audio (Internship):** Developed ESP32 audio streaming firmware for transit radio boxes reaching 70,000+ daily commuters, collaborating on hardware revisions that cut BOM production costs by 45%.
