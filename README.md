# ⚡ SidOS - Interactive Workstation & AI Systems Sandbox

> **A fully interactive, browser-based operating system built to showcase my engineering work and projects.**

[![SidOS Desktop](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/HiSiddharth)
[![Built with Next.js](https://img.shields.io/badge/Framework-Next.js-black)](https://nextjs.org/)
[![Base Engine-daedalOS](https://img.shields.io/badge/Base%20Engine-daedalOS-blue)](https://github.com/HiSiddharth/daedalOS)
---

## 💡 About This Project

Approach SidOS as if you are going through my personal workstation running directly in your browser.
I will keep on adding new things to this website.

> **Attribution Note:**
> The core web desktop engine is forked from the open-source [daedalOS](https://github.com/DustinBrett/daedalOS) project by **Dustin Brett**. I have heavily customized, refactored, and stripped down the engine. I removed heavy emulators, WebGPU bloat and added custom routes, video wallpapers and configured it as an interactive launchpad for my actual engineering work.

---

## 🚀 Flagship Systems & Showcase (On Desktop)

_(Featured projects are currently being integrated and will be added here soon.)_

---

## 🛠️ Customizations & Enhancements Made to SidOS

- **Engineered External Link Routing:** Patched OS execution pipeline (`useFile.ts`) with custom `BaseURL=External` logic to bypass `X-Frame-Options` and seamlessly launch real browser tabs.
- **Hardware-Decoded Live Wallpapers:** Converted and optimized 4K cinematic Star Wars live video loops using FFmpeg (`crf 26`, `-an` stripped audio, `faststart` web-streaming headers), cutting sizes by up to 90% for instant bufferless playback.
- **Purged Bloat:** Excised multiple dead-weight WebGPU models and emulators (BoxedWine, V86, DX-Ball, client-side Stable Diffusion) reducing browser load and build times.
- **Random Shader Window Effects:** Enabled GLSL window-closing animations (Burn-My-Windows effects: fire, glitch, matrix fade).

---

## 💻 Tech Stack

- **Frontend & OS Engine:** Next.js, React, TypeScript, Styled-Components, Motion
- **Applied AI & ML:** LangChain, LangGraph, Ollama, LM Studio, Gemini API, Groq, Pandas, NumPy
- **Systems & Hardware:** C/C++ (ESP-IDF / Arduino), Python, Bash, Linux, Docker, WireGuard, Reverse Engineering (Ghidra, JADX)
- **Audio & Media:** Webamp, Web Audio API, FFmpeg, Digital Audio Workstations & Amp Simulators

---

## 🏃 How to run Locally

### Prerequisites

- Node.js 20+
- Yarn (`corepack enable`)

### Setup

```bash
# Clone the repository
git clone https://github.com/HiSiddharth/SidOS.git
cd SidOS

# Install locked dependencies
yarn install

# Prebuild virtual filesystem index
yarn build:prebuild

# Start development server
yarn dev

```

After this, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Credits

- **Base Desktop Environment:** Created by [Dustin Brett](https://github.com/DustinBrett) under the [MIT License](https://www.google.com/search?q=LICENSE).
- **SidOS Customizations & Featured Systems:** Developed and maintained by **Siddharth Rai** ([GitHub](https://github.com/HiSiddharth) • [LinkedIn](https://www.linkedin.com/in/siddharthrai1/)).
