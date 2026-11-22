# SidOS Roadmap & Future Changes

## Shipped

- Personal branding, custom Star Wars live wallpapers (`<6MB`), Stormtrooper favicon, external tab routing (`GitHub` / `LinkedIn`)
- Pruned ~80MB of heavy legacy bloat (BoxedWine, V86, Stable Diffusion UI, DX-Ball, Nostr)
- Fixed NVIDIA/Linux WebGL GLSL shader derivative compilation & `DesktopFly` simulation (up to 30 flies)

---

## High Priority

### 1. Startup Guide / Quick-Launch Window

- Auto-opens cleanly on first visit (dismissible + pinned to Start/Taskbar) so interviewers never have to guess where to click
- One-click shortcuts: **Sanitized Resume (PDF)**, **SidBot 9000**, **Dual-LoRA Lab**, and **Case Studies Hub**

### 2. SidBot 9000 (Browser RAG + Agentic OS Assistant)

- **Pre-baked Local RAG:** Offline build script embedding 10–20 curated docs (projects, systems decisions, hobbies) into a static `rag-index.json`
- **Secure Inference:** Free Cloudflare Worker proxy (CORS-locked to `hisiddharth.github.io`) with deterministic local RAG fallback if offline/rate-limited
- **RAG & Eval Inspector:** Toggleable dev drawer displaying retrieved chunks, cosine scores, TTFT, and pre-computed golden eval metrics
- **Animated Cartoon Avatar:** Lightweight state-driven SVG/sprite face (`idle` / `thinking` / `speaking` / `hyped`)
- **Agentic OS Actions:** Ability to trigger SidOS windows directly from chat replies (e.g., open Resume, Case Studies, or LoRA Lab)

### 3. LoRA / AI Influencer Showoff (Local 8GB VRAM Pipeline)

- Showcase of custom **AI Influencer** running locally on **RTX 4060 Laptop (8GB VRAM / 24GB RAM)**
- **Dual-LoRA Ablation Viewer:** Side-by-side / slider comparison (`Base` vs `+Character LoRA` vs `+Moss LoRA` vs `Stacked Final`) highlighting concept-bleed control
- **Engineering Telemetry Card:** Quantization, VRAM footprint, sampler/CFG recipe, and workflow JSON inspector
- **OS Integration:** One-click **"Set as SidOS Wallpaper"** directly from generated renders

### 4. Interactive Case Studies Hub

- **Podpitara (Transit IoT Radio):** Architecture & edge deployment breakdown (70k+ commuters, ESP32/hardware telemetry)
- **SecureImmichServer:** Simulated interactive **WireGuard + LUKS** unlock/handshake terminal sequence & homelab network topology
- **Android Pi-hole:** DNS sinkhole setup, blocklist metrics, and mobile homelab architecture
- **The AI Loom** & **REvolver:** Dedicated interactive project cards mapping directly to resume bullets

---

## Medium Priority

### 7. More Lightweight and Open-Source Games

_(Kept ultra-light in pure JS/Canvas—no heavy WASM emulators)_

- Tetris ([Blockrain.js](https://github.com/Aerolab/blockrain.js))
- Minesweeper ([ShizukuIchi/minesweeper](https://github.com/ShizukuIchi/minesweeper) or [ziebelje/minesweeper](https://github.com/ziebelje/minesweeper))
- Solitaire ([1j01/98 js-solitaire](https://github.com/1j01/98/tree/master/programs/js-solitaire))
- Game of Life ([webgl-game-of-life](https://github.com/skeeto/webgl-game-of-life/))

---

## Visuals, Shaders & Screensavers (Selectable / Opt-In)

_Note: Only one active wallpaper/shader runs at a time to preserve battery & GPU headroom on visitor laptops._

### Shadertoy Live Wallpapers / Screensavers

- [Torus](https://www.shadertoy.com/view/fd33zn)
- [Descent](https://www.shadertoy.com/view/wdfGW4)
- [Glassy Field](https://www.shadertoy.com/view/4ttGDH)

### Procedural & Canvas Backgrounds

- [UVCanvas — Opulento](https://uvcanvas.com/docs/components/opulento)
- [UVCanvas — Tranquiluxe](https://uvcanvas.com/docs/components/tranquiluxe)
- [Aurelia](https://github.com/holtsetio/aurelia/)
- [Shan, Shui](https://github.com/LingDong-/shan-shui-inf) (Procedural Chinese Landscape)
- [Retro Synthwave](https://github.com/victorqribeiro/retroSynthwave)
