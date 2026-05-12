# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project State

This repository is in the **planning stage**. No application code exists yet. The current contents are:

| Path | What it is |
|---|---|
| `CafeD&D_TavernTable_PLANS/DnD_Platform_Development_Plan.md` | Full project strategy, tech spec, 4-dev-lane breakdown |
| `CafeD&D_TavernTable_PLANS/TavernTable_Phase0_TodoList.md` | Kickoff task list for Research Phase R0 |
| `CafeD&D_TavernTable_PLANS/PROD_DESC.md` | Product description for stakeholders |
| `CafeD&D_TavernTable_PLANS/PROD_UI_DICT.md` | UI dictionary for design/graphics team |
| `UI_Design_References/` | V1 wireframe sketches (V1-ReferenceOnly + V1-Viewable Vite app) |
| `roadmap/` | Standalone static web app for viewing the dev roadmap |
| `roadmap.html` | Redirect → `roadmap/index.html` |
| `prototype-01-foundation/` | Empty Godot 4.6 project shell (no scenes, no scripts) |

---

## Two-Track Strategy (Critical Context)

All development decisions flow from this:

**Track 1 — Research Version (closed, internal only)**
- Stack: Vite + TypeScript + Three.js + Socket.io + Rapier.js
- Primary delivery: hosted website (browser, no install required)
- Later milestones: Supabase auth/DB (R7, closed testing only), Tauri desktop (R8)
- Local dev: `npm run dev` (Vite :5173) + `npm run server:dev` (Socket.io :3000), mock auth, local JSON
- Purpose: validate the CafeDND concept with internal team + invited playtesters
- Gate: 70%+ of playtesting groups prefer it over their current VTT → unlocks Track 2

**Track 2 — Production Version (public, post-gate)**
- Stack: Godot 4.4+, GDScript/C#, Vulkan Forward+, Jolt Physics, ENet/WebRTC
- Project shell exists at `prototype-01-foundation/` — not started yet
- Commercial release on Steam + itch.io

The Research version does not run in Godot. The `prototype-01-foundation/` shell is reserved for Track 2.

---

## Roadmap Viewer

The `roadmap/` directory is a self-contained static site with no build step.

**To view:** open `roadmap/index.html` directly in a browser (double-click or `file://` URL).

**Structure:**
- `roadmap/data.js` — all phase data (`RESEARCH_PHASES`, `GODOT_PHASES`, `ALT_PATHS` arrays)
- `roadmap/roadmap.js` — hash-based router, render functions, theme toggle
- `roadmap/roadmap.css` — full light/dark theme via `data-theme` attribute on `<html>`
- `roadmap/index.html` — minimal shell; loads `data.js` then `roadmap.js` (order matters)

**Navigation:** `#phase-R0` through `#phase-R8` (research), `#phase-G0` through `#phase-G7` (Godot). Hash routing uses `history.pushState`. Theme preference persists in `localStorage` under key `cafeTheme`.

**To add or update a phase:** edit the relevant array in `data.js` only. The render functions in `roadmap.js` are data-driven and require no changes for content updates.

---

## Godot Project (`prototype-01-foundation/`)

Configured but empty. Key settings from `project.godot`:

- **Engine:** Godot 4.6
- **Renderer:** Forward Plus (Vulkan)
- **Physics:** Jolt Physics (3D)
- **Rendering driver (Windows):** D3D12
- **C# assembly name:** `Prototype01_Foundation` — C# scripting is enabled alongside GDScript

To open: launch Godot 4.6 editor → Import → select `prototype-01-foundation/project.godot`.

There are no scenes, scripts, or assets inside yet. The next work here begins at Phase G0, after the Research feedback gate passes.

---

## Research Version — Not Scaffolded Yet

`CafeD&D_TavernTable_PLANS/TavernTable_Phase0_TodoList.md` defines Phase R0 tasks. When the web project is initialized, it will live in a new directory (e.g., `cafe-dnd-web/`) with this structure:

```
src/
  scenes/       # [Lane A] Three.js scene classes
  systems/      # [Lane A+B] Game logic (peek, fog, initiative)
  physics/      # [Lane B] Rapier.js wrapper
  ui/           # [Lane D] DOM-based UI panels
  networking/   # [Lane C] Socket.io client + event helpers
  audio/        # [Lane D] Howler.js wrapper
  data/         # [Lane B] TypeScript data models (character, campaign)
  utils/
server/         # [Lane C] Node.js + Socket.io multiplayer server
shared/
  types.ts      # ALL socket event names + payload types (shared by client + server)
src-tauri/      # Tauri 2.0 Rust backend (R8 only -- do not create at R0)
```

Expected scripts once scaffolded:
```
npm run dev          # Vite dev server (browser) -- primary delivery
npm run server:dev   # Socket.io multiplayer server (local)
npm run dev:all      # Both above via concurrently
npm run build        # Vite production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
# R8 only (added later):
npm run tauri:dev    # Tauri native window with live reload
npm run tauri:build  # Native binary (.msi / .dmg / .AppImage)
```

---

## Key Design Decisions (Do Not Revisit Without Context)

- **Website-first** — primary research delivery is a hosted browser URL (no install). Tauri desktop is added at R8 after the site is stable.
- **Supabase deferred to R7** — Supabase is added only when the product enters closed playtesting. R0–R6 use local mock auth and local JSON files.
- **shared/types.ts is the contract** — all socket event names and payload shapes live here. Both client and server import from it. No hardcoded strings.
- **4 developer lanes** — 3D/Scene (A), Game Systems (B), Multiplayer/Backend (C), UI/Interface (D). Each lane has its own CLAUDE.md with scope rules.
- **Socket.io for research, Godot MultiplayerAPI for production** — research needs simplicity; production needs authority model and Godot integration.
- **WebGLRenderTarget for Peek** — the table surface texture is a live render of a second Three.js scene. This is how the "peek through the table" effect works in the research version.
- **Tauri over Electron** — chosen for ~4MB binary size vs ~100MB, better security model, same web codebase. Added at R8.
- **Godot C# enabled** — C# is available for performance-critical modules; GDScript is primary.
