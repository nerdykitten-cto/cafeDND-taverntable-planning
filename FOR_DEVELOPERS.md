# FOR_DEVELOPERS.md — TavernTable / CafeD&D

> This document is for developers and technical contributors. If you're a DM or player, start with [`README.md`](./README.md) instead.

---

## Project Overview

**TavernTable** (a **CafeD&D** product — DN-007) is a 3D virtual tabletop (VTT) for D&D online. CafeD&D is the umbrella brand; companion tools (avatar customization, DM campaign builder) will ship as separate products that link into TavernTable.

**Strategy (DN-006):** the web build (Three.js + Vite + Socket.io) **is the product** and carries to final public release. Currently closed / invite-only; the R7 feedback gate (70%+ tester preference) is the go/no-go for *public launch*. The Godot track (G0–G7) is a dormant contingency, activated only by a blocking technical ceiling in the web stack.

---

## Working Directories

| Path | Purpose |
|------|---------|
| `C:\Users\alibi\...\Projects\CafeDND\Tavern-Table\cafe-dnd-web\` | Active dev project — all source code lives here |
| `C:\Users\alibi\...\Games\CafeDND\` | Planning: design docs, roadmap, wireframes, UI references |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + TypeScript + Three.js |
| Multiplayer client | Socket.io-client |
| Game host (DM's machine) | Node.js + Express + Socket.io (port 3001) — runs on DM's local machine or VPS |
| Relay service | `tavern-relay/` — custom Node.js + ws WebSocket proxy for NAT traversal *(R4a)* |
| Animation | GSAP 3.x (Peek camera transition) |
| Dice physics | Rapier.js WASM *(integrated R4b; visible dice land at R5B)* |
| Audio | Howler.js *(integrated R5 — no-op until audio files land)* |
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
# Terminal 1 — Game host / Socket.io server (port 3001)
npm run server:dev

# Terminal 2 — Vite frontend (port 5173)
npm run dev
```

For internet play with relay NAT traversal (optional, from `tavern-relay/`):

```bash
# Terminal 3 — Relay service (port 3002)
cd tavern-relay && npm install && npm start

# Then restart the server with relay wired in:
RELAY_URL=ws://localhost:3002 npm run server:dev
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
  lobby.html        ← home screen (DM host / Player join mode selection)
  waiting.html      ← waiting room (pending approval + pre-game)
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
    index.ts        ← Express + Socket.io server entry (DM's game host — runs on DM's machine)
    session.ts      ← in-memory room/session state
    events.ts       ← Socket event handlers
    auth.ts         ← mock auth adapter (swapped for Supabase at R7)
    security.ts     ← input validation, sanitization, rate limiting
    relay-client.ts ← registers game host with relay service, tunnels player connections
  shared/
    types.ts        ← ALL socket event names + payload types (source of truth)
tavern-relay/       ← standalone relay service (NAT traversal for internet play)
  index.ts          ← WebSocket proxy server — multiplexes player WS to DM's host via reverse tunnel
  package.json      ← separate package, dep: ws
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
| `server/index.ts` | Express + Socket.io server entry — DM's game host process |
| `server/session.ts` | In-memory room and session state |
| `server/events.ts` | Socket event handlers |
| `server/security.ts` | Input validation, sanitization, per-socket rate limiting |
| `server/relay-client.ts` | Connects game host to relay service; tunnels player WebSocket connections |
| `tavern-relay/index.ts` | Standalone relay service — transparent WS proxy for NAT traversal |

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
| R4a | Lobby & Networking Overhaul — P2P DM-as-host, relay service, join approval | ✅ Complete |
| R4b | Core Game Systems (dice physics, character sheets, initiative, combat) | ✅ Complete |
| R5 | DM & Player Interfaces (HUD, audio, asset wiring, DN-001/002/003) | ✅ Complete |
| R5A | Seats, Cameras & Avatars | ✅ Complete |
| **R5B** | **Physics Dice Experience — visible tumbling dice, server-authoritative result** | 🔨 **Next Up** |
| R5C | Access Key & Test Distribution (blocked on DN-005 decision) | ⬜ Not started |
| R5D | Comms & Dice QoL | ⬜ Not started |
| R5E | DM Toolset | ⬜ Not started |
| R6 | Website Launch & QA | ⏸ Postponed until R5E closes |
| R7 | Supabase + Closed Playtesting (feedback gate = public-launch go/no-go, DN-006) | ⬜ Not started |
| R8 | Tauri Desktop Wrapper | ⬜ Not started |

> Binding task lists for R5B–R5E: `CafeD&D_TavernTable_PLANS/TavernTable_R5_Extension_Phases.md`.

> For the visual roadmap, open `roadmap/index.html` in a browser.

---

## Design Notes Log

Tracked in [`DESIGN_NOTES.md`](./DESIGN_NOTES.md). All future design decisions go there using the `DN-NNN` format.

| ID | Title | Status / Target |
|----|-------|-----------------|
| DN-001 | Tavern Room Variant | ✅ Built (R5) |
| DN-002 | Day/Night Atmosphere Switch | ✅ Built (R5) |
| DN-003 | Dynamic Theme & Asset Library (GLB/GLTF) | ✅ Wired (R5); Draco/KTX2 + real art → R5E |
| DN-004 | Relay Is the Universal Connection Path | Decided — verify at R6 |
| DN-005 | Mid-Session Join | ⚠️ OPEN — Bilal's call, blocks R5C |
| DN-006 | Web Build Is the Product (Godot = contingency) | Decided 2026-08-18 |
| DN-007 | Brand Architecture — CafeD&D ⊃ TavernTable | Decided 2026-08-18 |

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

### Home Screen (Lobby) — `src/ui/lobby-ui.ts` [R4a — full rewrite]
> Replaces the old create/join single screen. Now a two-card mode-selection screen.
- [ ] **DM card**: host address input (pre-filled from profile), "Host a Game" CTA — gold, prominent
- [ ] **Player card**: relay code entry (6-char, auto-uppercase), "Join Game" CTA
- [ ] DM card: save host address to profile on connect — persists across sessions
- [ ] Player card: "Connecting…" state while relay connection is established
- [ ] Error states: host unreachable, relay code not found, room full
- [ ] Rejoin banner: if `cafednd_session` in localStorage with valid `returnsAt`, show "Return to Session" countdown
- [ ] DEV panel: gate behind `isDev` flag — never visible in production builds
- [ ] Role is implicit from which card the user uses (DM card = DM; Player card = Player) — no separate role toggle needed on this screen

---

### Waiting Room — `src/ui/waiting-room.ts` [R4a — targeted update]
- [ ] **DM view: Pending Requests section** — appears above the player list; shows each pending player with [Accept ✓] and [Reject ✗] buttons
- [ ] **DM view: relay code display** — large, click-to-copy; shown below room code; labeled "Share this code with players"
- [ ] **DM view**: if relay not active (`state.relayCode` is null), show "Players connect via direct address" note instead
- [ ] **Player view: pending state** — full-screen "Waiting for DM to accept you…" spinner until DM accepts
- [ ] On `player:join-rejected`: show rejection reason (if any) + "Return to Home" link
- [ ] DM badge styling — should feel distinguished, not just a plain text label
- [ ] Kick button on accepted players: add a confirmation step to prevent accidental kicks
- [ ] Empty player list state: what does the DM see before anyone joins or has pending?
- [ ] "Start Session" button: disable or warn if no accepted players present
- [ ] Player join animation — subtle entrance effect when a player moves from pending → accepted
- [ ] Accept/Reject button accessibility: keyboard-navigable, visible focus ring

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
| `Projects/CafeDND/Tavern-Table` (dev code) | ✅ Indexed |
| `Games/CafeDND` (planning docs) | ✅ Indexed |

Use `search_graph`, `trace_path`, `get_code_snippet`, and `get_architecture` before falling back to Grep/Read.

---

*Last Updated: 2026-08-18 · Web build = the product (DN-006) · R5A complete, R5B next*
