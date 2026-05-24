# FOR_DEVELOPERS.md — Tavern Table / CafeD&D

> This document is for developers and technical contributors. If you're a DM or player, start with [`README.md`](./README.md) instead.

---

## Project Overview

**Tavern Table** (codename: CafeDND) is a 3D virtual tabletop (VTT) for D&D online.

**Two-track strategy:**
- **Track 1 — Research Version** (Three.js + Vite + Socket.io): validates the concept in-browser; no install required. Closed / invite-only.
- **Track 2 — Production Version** (Godot 4.x + Vulkan): unlocked only after the R7 playtesting gate passes.

---

## Working Directories

| Path | Purpose |
|------|---------|
| `C:\Users\alibi\...\Projects\CafeDND\cafe-dnd-web\` | Active dev project — all source code lives here |
| `C:\Users\alibi\...\Games\CafeDND\` | Planning: design docs, roadmap, wireframes, UI references |

---

## Tech Stack — Research Version

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + TypeScript + Three.js |
| Multiplayer client | Socket.io-client |
| Server | Node.js + Express + Socket.io (port 3001) |
| Animation | GSAP 3.x (Peek camera transition) |
| Dice physics | Rapier.js WASM *(R4 — not yet integrated)* |
| Audio | Howler.js *(R5 — not yet integrated)* |
| Desktop wrapper | Tauri 2.0 (Rust) *(R8 — not yet integrated)* |
| Auth / DB | Supabase *(R7 only — local stub active through R6)* |

---

## Running Locally

All commands run from `cafe-dnd-web/`:

```bash
npm install         # install dependencies (once)
npm run dev:all     # run Vite client + Socket.io server concurrently
```

Or separately:

```bash
# Terminal 1 — Socket.io server (port 3001)
npm run server:dev

# Terminal 2 — Vite frontend (port 5173)
npm run dev
```

Open **http://localhost:5173**. You should see the 3D basement scene with `[socket] connected` in the browser console.

> **Port conflict on Windows:**
> `netstat -ano | findstr :3001` → find PID → `taskkill /PID <pid> /F`

---

## Available Scripts

All from `cafe-dnd-web/`:

| Script | What it does |
|--------|-------------|
| `npm run dev` | Vite dev server → http://localhost:5173 |
| `npm run server:dev` | Socket.io server → http://localhost:3001 |
| `npm run dev:all` | Both concurrently |
| `npm run build` | Type-check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | TypeScript check without emitting |
| `npm run lint` | ESLint across `src/` |
| `npm run format` | Prettier format `src/` |

---

## Project Structure

```
cafe-dnd-web/
  src/
    scenes/         ← Lane A: Three.js renderer, RoomScene, WorldScene, Peek
    systems/        ← Lane A/B: PeekSystem, FogSystem, initiative, encounter
    physics/        ← Lane B: Rapier.js dice physics
    ui/             ← Lane D: DOM panels overlaid on canvas
    audio/          ← Lane D: Howler.js audio engine
    networking/     ← Lane C: typed Socket.io client helpers
    assets/         ← Lane A: AssetLibrary (GLB/GLTF loader, scaffold)
    data/           ← Lane B: TypeScript data models
    utils/
    main.ts         ← renderer bootstrap + socket init + keyboard shortcuts
  server/
    index.ts        ← Express + Socket.io server entry
    session.ts      ← in-memory room/session state
    events.ts       ← Socket event handlers
    auth.ts         ← mock auth adapter (swapped for Supabase at R7)
  shared/
    types.ts        ← ALL socket event names + payload types (source of truth)
```

---

## Lane Architecture

Strict — no cross-lane imports except through defined interfaces.

| Lane | Directories | Owns |
|------|-------------|------|
| **A — 3D / Scene** | `src/scenes/`, `src/systems/peek.ts`, `src/systems/fog.ts`, `src/assets/` | Three.js renderer, GSAP transitions, fog of war, AssetLibrary |
| **B — Game Systems** | `src/systems/` (non-A), `src/physics/`, `src/data/` | D&D 5e rules, Rapier.js dice, data models |
| **C — Multiplayer** | `server/`, `src/networking/`, `shared/types.ts` | Socket.io, session state, event contracts |
| **D — UI / Audio** | `src/ui/`, `src/audio/` | DOM panels, Howler.js audio |

**Key rule:** All socket event names and payload shapes live exclusively in `shared/types.ts`. No hardcoded strings anywhere else.

Each lane directory contains its own `CLAUDE.md` with full scope, constraints, and exposed interface. Read it before touching that lane.

---

## Key Files

| File | Role |
|------|------|
| `src/main.ts` | Entry point: renderer, socket init, keyboard shortcuts, render loop |
| `src/scenes/room.ts` | RoomScene — The Basement geometry, chairs, lighting, board pieces |
| `src/scenes/world.ts` | WorldScene — terrain tiles, fog of war, props, render-to-texture |
| `src/systems/peek.ts` | PeekSystem — GSAP camera dive (room ↔ world) |
| `src/systems/fog.ts` | FogSystem — fog-of-war mask (reveal / reset / DM view) |
| `src/assets/assetLibrary.ts` | AssetLibrary scaffold — GLB loader, ASSET_MANIFEST, types |
| `src/networking/client.ts` | Typed Socket.io emit helpers (all emits go through here) |
| `shared/types.ts` | Socket event names + payload types — single source of truth |
| `server/index.ts` | Express + Socket.io server entry |
| `server/session.ts` | In-memory room and session state |
| `server/events.ts` | Socket event handlers |

---

## Auth

Auth is a **local stub** through R6. Any `{ name, token }` pair is accepted. The adapter is in `server/auth.ts` — it will be swapped for Supabase at R7 without touching any other file.

Do not add real auth logic until R7.

---

## Design Identity

```css
--paper: #F5F0E8   /* parchment white */
--ink:   #2C1810   /* deep brown-black */
--gold:  #8B6914   /* warm gold */
```

Fonts: **Cinzel** (headings), **Patrick Hand** (body).

All game state must remain JSON-serializable at all times.

---

## Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| R0 | Architecture & Setup | ✅ Complete |
| R1 | 3D Room & Core Scene | ✅ Complete |
| R2 | Peek Mechanic & Map System | ✅ Complete |
| **R3** | **Multiplayer & Session Sync** | 🔨 **In Progress** |
| R4 | Core Game Systems (dice, sheets, combat) | ⬜ Not started |
| R5 | DM & Player Interfaces (HUD, audio, asset wiring) | ⬜ Not started |
| R6 | Website Launch & QA | ⬜ Not started |
| R7 | Supabase + Closed Playtesting | ⬜ Not started |
| R8 | Tauri Desktop Wrapper | ⬜ Not started |

> For the visual roadmap, open `roadmap/index.html` in a browser.

---

## Design Notes Log

Tracked in [`DESIGN_NOTES.md`](./DESIGN_NOTES.md). All future design decisions go there using the `DN-NNN` format.

| ID | Title | Roadmap Target |
|----|-------|---------------|
| DN-001 | Tavern Room Variant | R5 |
| DN-002 | Day/Night Atmosphere Switch | R5 |
| DN-003 | Dynamic Theme & Asset Library (GLB/GLTF) | R5 (wiring), R2 (scaffold) |

---

## Things NOT to Do Until Specified

- No Supabase, no cloud auth until **R7**
- No Tauri until **R8**
- No production Godot work until R7 playtesting gate passes
- No `AssetLibrary.load()` calls in scene code until **R5** (the `modelUrl` field is typed but intentionally unread)
- No real invite/email auth flow (local mock token is fine through R6)
- No feature flags or backwards-compat shims — just change the code

---

## Codebase Memory MCP

Both directories are indexed:

| Project | Status |
|---------|--------|
| `Projects/CafeDND` (dev code) | ✅ Indexed |
| `Games/CafeDND` (planning docs) | ✅ Indexed |

Use `search_graph`, `trace_path`, `get_code_snippet`, and `get_architecture` before falling back to Grep/Read.

---

*Last Updated: May 2026 · Research Version — R3 In Progress*
