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
  index.html        ← auth screen (Create Account)
  lobby.html        ← lobby (create / join room)
  waiting.html      ← waiting room (pre-game)
  game.html         ← active session (3D game)
  settings.html     ← settings
  src/
    pages/          ← per-page TypeScript entry points (auth, lobby, waiting, game, settings)
    scenes/         ← Lane A: Three.js renderer, RoomScene, WorldScene, Peek
    systems/        ← Lane A/B: PeekSystem, FogSystem, initiative, encounter
    physics/        ← Lane B: Rapier.js dice physics
    ui/             ← Lane D: DOM panels overlaid on canvas
    audio/          ← Lane D: Howler.js audio engine
    networking/     ← Lane C: typed Socket.io client helpers + scene wiring
    assets/         ← Lane A: AssetLibrary (GLB/GLTF loader, scaffold)
    data/           ← Lane B: TypeScript data models
    renderer.ts     ← WebGLRenderer singleton + resize handler
    input.ts        ← keyboard shortcut handler
    profile.ts      ← local user profile (mock auth, R0–R6)
    main.ts         ← legacy reference entry
  server/
    index.ts        ← Express + Socket.io server entry
    session.ts      ← in-memory room/session state
    events.ts       ← Socket event handlers
    auth.ts         ← mock auth adapter (swapped for Supabase at R7)
    security.ts     ← input validation, sanitization, rate limiting
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
| `src/pages/auth.ts` | Auth screen entry point (index.html) |
| `src/pages/lobby.ts` | Lobby entry point (lobby.html — create / join room) |
| `src/pages/waiting.ts` | Waiting room entry point (waiting.html) |
| `src/pages/game.ts` | Active game entry point (game.html) |
| `src/pages/settings.ts` | Settings entry point (settings.html) |
| `src/scenes/room.ts` | RoomScene — The Basement geometry, chairs, lighting, board pieces |
| `src/scenes/world.ts` | WorldScene — terrain tiles, fog of war, props, render-to-texture |
| `src/systems/peek.ts` | PeekSystem — GSAP camera dive (room ↔ world) |
| `src/systems/fog.ts` | FogSystem — fog-of-war mask (reveal / reset / DM view / revealCells) |
| `src/assets/assetLibrary.ts` | AssetLibrary scaffold — GLB loader, ASSET_MANIFEST, types |
| `src/networking/client.ts` | Typed Socket.io emit helpers (all emits go through here) |
| `src/networking/handlers.ts` | Game socket → scene wiring (token:moved, fog:update, session:state) |
| `src/renderer.ts` | WebGLRenderer singleton + resize handler |
| `src/input.ts` | Keyboard shortcut handler (Peek, fog shortcuts) |
| `src/profile.ts` | Local user profile (name, id — mock until R7) |
| `src/ui/auth-ui.ts` | Auth / profile creation screen UI |
| `src/ui/lobby-ui.ts` | Lobby / entry screen UI + DEV room panel |
| `src/ui/lobby.ts` | Older lobby UI (pre-R3 reference — superseded by lobby-ui.ts) |
| `src/ui/waiting-room.ts` | Waiting room UI (player list, kick, start — DM and player views) |
| `src/ui/game-ui.ts` | Game HUD, disconnect overlays, pause system, session lifecycle |
| `src/ui/navbar.ts` | Persistent navbar + notification system |
| `src/ui/settings-ui.ts` | Settings screen UI (account, role, danger zone) |
| `shared/types.ts` | Socket event names + payload types — single source of truth |
| `server/index.ts` | Express + Socket.io server entry |
| `server/session.ts` | In-memory room and session state |
| `server/events.ts` | Socket event handlers |
| `server/security.ts` | Input validation, sanitization, per-socket rate limiting |

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
| R3 | Multiplayer & Session Sync | ✅ Complete |
| **R4** | **Core Game Systems (dice, sheets, combat)** | 🔨 **Next Up** |
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

## UI Team — To-Do Checklist

> **How to read this list:**
> - Screens marked **[Built — R3]** exist and are functional. Tasks under them are polish, review, and consistency work.
> - Screens marked **[R4]**, **[R5]** etc. do not exist yet — build them when that phase begins.
> - Tasks sourced from DM playtester feedback are tagged **[DM Feedback]**.
> - Tasks from design notes are tagged with their DN number.

---

### Auth Screen — `src/ui/auth-ui.ts` [Built — R3]
- [ ] Review form validation feedback — errors should be specific, not generic
- [ ] Password strength indicator (visual, not just min-length hint)
- [ ] "Already have a profile" footer — currently static text; consider linking to Settings
- [ ] Confirm DM / Player role toggle styling matches final design system
- [ ] Accessibility: label all inputs properly (`<label for>` or `aria-label`)
- [ ] Test on narrow viewports (minimum supported: 1024px)

---

### Lobby Screen — `src/ui/lobby-ui.ts` [Built — R3]
- [ ] Role switcher: confirm DM-only vs player-only controls appear/hide correctly on role change
- [ ] Rejoin banner countdown: verify copy is warm and clear, not technical
- [ ] Dismiss button on pending banner: confirm it does not re-appear on page reload
- [ ] DEV room panel: gate behind an `isDev` flag — must never appear in production builds
- [ ] Empty state: what does a player see if they enter a wrong or expired room code?
- [ ] Room code input: enforce uppercase display even if user types lowercase
- [ ] "Create Room" vs "Join Room" button visual hierarchy should respond to preferred role (DM = Create primary, Player = Join primary)

---

### Waiting Room — `src/ui/waiting-room.ts` [Built — R3]
- [ ] DM badge styling — should feel distinguished, not just a plain text label
- [ ] Kick button: add a confirmation step to prevent accidental kicks
- [ ] Empty player list state: what does the DM see before anyone joins?
- [ ] "Start Game" button: disable or warn if minimum player count not met
- [ ] Player join animation — subtle entrance effect when a new player appears in the list
- [ ] Room code display: click-to-copy or a visible copy button

---

### Game HUD — `src/ui/game-ui.ts` [Built — R3]
- [ ] HUD role badge (DM / PLAYER): colour differentiation — should be visually distinct at a glance
- [ ] Player list in HUD: disconnected `◌` indicator — confirm it reads clearly at small size
- [ ] Toast notifications: confirm they stack correctly and never overlap critical UI
- [ ] Disconnect overlay: review countdown copy — urgent but not alarming in tone
- [ ] Reconnect overlay: copy review — reassure the player their session is held
- [ ] DM Away overlay: copy review — inform players without causing panic
- [ ] Pause system: time selection buttons (1 / 2 / 3 / 5 / 10 min) — confirm 10 min is a sufficient maximum
- [ ] Game Paused overlay: show the reason text the DM submitted
- [ ] DM Pause Expired overlay: 5-minute hardcoded deadline — confirm with product
- [ ] "This Campaign is Done" flow: add a double-confirm step; too easy to trigger accidentally
- [ ] Peek button: add a visible in-HUD button or icon — currently keyboard-only (`P`)

---

### Navbar — `src/ui/navbar.ts` [Built — R3]
- [ ] Collapse behaviour in active game: confirm it does not obscure HUD elements
- [ ] Notification badge: verify it clears correctly after the user views notifications
- [ ] Notification list: cap max entries to prevent runaway growth in long sessions
- [ ] Personal vs broadcast notification visual distinction — confirm readable at a glance
- [ ] `refreshNavbar()` after profile creation: verify card shows correct name + role without page reload

---

### Settings Screen — `src/ui/settings-ui.ts` [Built — R3]
- [ ] Password change: show success confirmation after save, not just silently clear the field
- [ ] "Delete profile & sign out" — must open a confirmation modal before executing
- [ ] Role change in Settings: update navbar immediately on save, no full page reload required
- [ ] Email field: add copy noting real auth (Supabase) arrives at R7 — field is non-functional until then
- [ ] Error / success message: auto-dismiss after a timeout (currently unclear if it persists indefinitely)

---

### Dice Roller Panel [R4]
- [ ] Physics dice canvas overlay sitting above the 3D scene, not embedded in it
- [ ] Support all standard D&D dice: d4, d6, d8, d10, d12, d20, d100
- [ ] Roll result display with history (last 5 rolls visible)
- [ ] Broadcast roll results to all players in session via socket
- [ ] DM-only secret roll mode — result visible to DM only
- [ ] Clear roll history button
- [ ] Dice must visually tumble — not just display a number with an animation wrapper

---

### Character Sheet Panel [R4]
- [ ] Ability scores (STR / DEX / CON / INT / WIS / CHA) with auto-calculated modifiers
- [ ] Saving throws (auto-calculated from scores + proficiency bonus)
- [ ] Skills list with proficiency checkboxes and auto-calculated bonuses
- [ ] HP tracker: current / max / temp HP with +/- controls
- [ ] Class, level, race, background fields
- [ ] Spell slots tracker per level
- [ ] Spell list with prepared / known toggle
- [ ] Proficiency bonus (auto-calculated from level)
- [ ] Passive Perception (auto-calculated)
- [ ] Equipment / inventory list
- [ ] Panel is player-side only — DM sees NPC manager cards instead
- [ ] Character sheet data persisted in session state so it survives reconnect

---

### Initiative Tracker Panel [R4]
- [ ] Vertical turn-order list showing all players and enemies
- [ ] Active turn clearly highlighted
- [ ] DM-only "Next Turn" button to advance order
- [ ] Auto-roll initiative on combat start (or DM triggers manually)
- [ ] DM can add / remove combatants mid-combat
- [ ] HP shown alongside name — DM sees exact values; players see status only (Bloodied / Fine / Down)
- [ ] Live sync to all clients via socket

---

### Chat Panel [R4]
- [ ] Two channels: In-Character (IC) and Out-of-Character (OOC) — tab or toggle to switch
- [ ] Whisper to DM (player-side) and whisper to a specific player (DM-side)
- [ ] Timestamps on all messages
- [ ] System messages styled distinctly (e.g. "Bilal joined the session")
- [ ] Dice roll results appear inline in chat as a special card-style message type
- [ ] Character limit per message
- [ ] Chat scrolls to newest message; user can scroll up to read history without auto-scroll interrupting

---

### DM Command Center / DM Screen [R5]
- [ ] Three-panel layout: left sidebar (tools), centre 3D viewport, right panel (initiative + party status)
- [ ] DM Screen is a distinct layout from the player view — never share the same panel arrangement
- [ ] All DM tools accessible without leaving the 3D view
- [ ] **[DM Feedback]** Slides / Presentation mechanic: DM creates slides for campaign moments (combat intros, lore reveals, location transitions). Each slide can hold images, text, or transitions. Displayed to all players as a full-screen overlay.
- [ ] **[DM Feedback — Zona]** Enemy side switcher: reassign a token's side (player / enemy / neutral) mid-session without removing and re-adding it

---

### Map Editor Panel [R5]
- [ ] Tile palette: select terrain type and paint tiles on the grid
- [ ] Fog brush: paint / erase fog of war cells
- [ ] Token library: place, move, label, and remove character / enemy tokens
- [ ] Prop placement: add / remove scene props via asset picker (DN-003)
- [ ] Pre-built map layouts: DM selects a GLB map from a dropdown, replacing the default tile grid (DN-003)
- [ ] **[DM Feedback — Omair]** Draw / Annotate / Pin tools: freehand drawing on the map, text annotations, persistent pins on specific cells
- [ ] **[DM Feedback — Zona / Omair]** AOE shapes: circles, cones, lines, squares — placeable on the map by DM and players. Display range and area of effect. Shapes are temporary overlays, not permanent tile changes. Available to both DM and players.
- [ ] **[DM Feedback — Zona / Omair]** Range ruler: click two points on the map and display distance in feet (1 square = 5ft). Fast, snappy interaction; single click or Escape to dismiss.
- [ ] **[DM Feedback — Omair]** Fog of War perception gate: option to require a player Perception check before revealing a tile — flag for later, do not block fog UI build on this

---

### Encounter Panel [R5]
- [ ] Enemy list: name, HP (current / max), conditions (Poisoned, Stunned, etc.)
- [ ] Add / remove enemies mid-encounter
- [ ] Apply condition with one click; conditions display as status icons on token
- [ ] Damage / heal HP directly from the panel
- [ ] Linked to initiative tracker — entering the encounter panel advances or modifies the same turn order

---

### DM Notes Panel [R5]
- [ ] Free-text scratchpad, auto-saved into session state
- [ ] Notes survive reconnect and page refresh during a session
- [ ] DM-only — never visible to players under any condition

---

### NPC Manager [R5]
- [ ] Portrait card per NPC: name, image, key stats summary
- [ ] DM can push an NPC card to all players as a shared overlay
- [ ] NPC dialogue: DM types dialogue, players see it in chat as a distinct NPC message type (styled differently from player chat)
- [ ] Quick-add NPC to initiative tracker from the NPC Manager panel

---

### Loot Tables Panel [R5]
- [ ] Randomised loot generation (CR-appropriate table or DM-defined custom list)
- [ ] Roll result shown to DM first before broadcasting
- [ ] DM can send result to a specific player's inventory or broadcast to all

---

### Ambient Audio Controls [R5]
- [ ] Track list per room environment (Basement, Tavern, Combat, Tension, Calm, etc.)
- [ ] DM-only playback: play, stop, crossfade between tracks
- [ ] Volume control set by DM, applies to all connected clients
- [ ] Audio plays simultaneously on all clients — not per-client local control

---

### Atmosphere & Room Controls [R5 — DN-001 / DN-002]
- [ ] **[DN-001]** Room selector: dropdown or card picker in Session Settings. Options: The Basement, Tavern Backroom (more added in production). DM selects before session starts; choice stored in session state and broadcast to all clients on join.
- [ ] **[DN-002]** Day / Night toggle: single button or toggle in Session Settings panel. Switches between Night (warm candlelit default) and Day (cooler, brighter, window-light fill) presets. 3-second smooth transition broadcast to all clients simultaneously.

---

### Player HUD [R5]
- [ ] Immersive bottom bar: character name, HP bar, class / level badge, quick dice access
- [ ] Spell slots indicator (pips or numeric count)
- [ ] Conditions display — status icons from DM-applied conditions
- [ ] Peek button visible in HUD (not keyboard-only)
- [ ] Player HUD must have minimal footprint — must not obstruct the 3D scene

---

### Hardware / Performance Settings [R5 — DM Feedback — Omair]
- [ ] Graphics quality selector: Low / Medium / High / Ultra
  - **Low:** tokens are flat circles of influence, no particles, simplified fog
  - **Medium:** basic 3D tokens, standard fog shader
  - **High:** full 3D models, particle effects on torches and candles
  - **Ultra:** smoke, volumetric particles, full environment detail
- [ ] Setting persisted in local profile across sessions
- [ ] Auto-detect recommended setting on first launch based on GPU tier where detectable

---

### Cross-Cutting / General [All Phases]
- [ ] Design token consistency: all UI uses `--paper`, `--ink`, `--gold` CSS variables — no hardcoded colours anywhere
- [ ] Typography: Cinzel for all headings, Patrick Hand for all body text — enforced across every screen
- [ ] All interactive elements have hover and focus states — full keyboard navigability
- [ ] No UI panel may obscure the Peek vignette transition (z-index audit required before R5 launch)
- [ ] All overlays (pause, disconnect, DM away) dismissible by keyboard where appropriate (Escape key)
- [ ] Loading states for all async actions: joining a room, starting a game, loading assets
- [ ] Error states for all network failures — no silent failures in any UI
- [ ] Minimum supported width: 1024px desktop browser
- [ ] **[DM Feedback — Zona]** Voice / video / text chat toggle — flagged as future feature; do not build yet; reserve a visible UI slot in the game HUD so it can be wired in later without a layout rebuild

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

*Last Updated: June 2026 · Research Version — R3 Complete, R4 Starting*
