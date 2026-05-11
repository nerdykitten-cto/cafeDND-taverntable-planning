# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project State

This repository is in the **planning stage**. No application code exists yet. The current contents are:

| Path | What it is |
|---|---|
| `DnD_Platform_Development_Plan.md` | Full project strategy and technical spec |
| `TavernTable_Phase0_TodoList.md` | Kickoff task list for Research Phase R0 |
| `roadmap/` | Standalone static web app for viewing the dev roadmap |
| `roadmap.html` | Redirect → `roadmap/index.html` |
| `prototype-01-foundation/` | Empty Godot 4.6 project shell (no scenes, no scripts) |

---

## Two-Track Strategy (Critical Context)

All development decisions flow from this:

**Track 1 — Research Version (closed, internal only)**
- Stack: Vite + TypeScript + Three.js + Tauri 2.0 (Rust) + Socket.io + Supabase + Rapier.js
- Access: browser (any URL) or downloadable Tauri desktop app
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

**Navigation:** `#phase-R0` through `#phase-R7` (research), `#phase-G0` through `#phase-G7` (Godot). Hash routing uses `history.pushState`. Theme preference persists in `localStorage` under key `cafeTheme`.

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

The `TavernTable_Phase0_TodoList.md` defines Phase R0 tasks. When the web project is initialized, it will live in a new directory (e.g., `research-version/` or `cafe-dnd-web/`) with this structure:

```
src/
  scenes/       # Three.js scene classes
  systems/      # Game logic (fog of war, tokens, etc.)
  ui/           # DOM-based UI panels
  networking/   # Socket.io client + event types
  audio/        # Howler.js wrapper
  physics/      # Rapier.js wrapper
  data/         # TypeScript data models (character, campaign)
  utils/
server/         # Node.js + Socket.io multiplayer server
src-tauri/      # Tauri 2.0 Rust backend (IPC, file I/O)
```

Expected scripts once scaffolded:
```
npm run dev          # Vite dev server (browser)
npm run tauri:dev    # Tauri native window with live reload
npm run server:dev   # Socket.io multiplayer server
npm run build        # Vite production build
npm run tauri:build  # Native binary (.msi / .dmg / .AppImage)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## Key Design Decisions (Do Not Revisit Without Context)

- **Tauri over Electron** — chosen for ~4MB binary size vs ~100MB, better security model, same web codebase
- **Socket.io for research, Godot MultiplayerAPI for production** — research needs simplicity; production needs authority model and Godot integration
- **WebGLRenderTarget for Peek** — the table surface texture is a live render of a second Three.js scene. This is how the "peek through the table" effect works in the research version
- **Supabase magic links** — invite-only auth for closed research; no public signup
- **Godot C# enabled** — C# is available for performance-critical modules; GDScript is primary