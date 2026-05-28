# Tavern Table / CafeDND — Development Plan & Roadmap

*Document Version: 4.0 · Last Updated: May 2026*

---

## 1. Vision Statement

**Tavern Table** (internal codename: **CafeDND**) is a 3D virtual tabletop platform that recreates the authentic feeling of sitting down at a Dungeon Master's table. Players see their customizable avatars seated around a physical table in a richly detailed 3D environment. The table itself is magical: lean in and "peek" through its surface to explore the living landscape of the campaign world below.

The DM commands a powerful suite of encounter, puzzle, and narrative tools on a dedicated screen, while players interact only with what a real player would have — their character sheet, dice, and the shared table view.

---

## 2. Two-Track Development Strategy

The project is developed across two sequential tracks. **Track 1 (Research) must complete and pass a feedback gate before Track 2 (Production) begins.**

```
┌─────────────────────────────────────────────────────────────────┐
│  TRACK 1 — RESEARCH VERSION                          ~6 months  │
│  Stack:  Three.js · Vite · TypeScript · Socket.io               │
│  Primary: Hosted website (browser, any device, no install)      │
│  Later:  Native desktop wrapper via Tauri 2.0 (Rust)            │
│  Auth/DB: Local mock → Supabase (closed testing phase only)     │
├─────────────────────────────────────────────────────────────────┤
│                    FEEDBACK GATE                                  │
│  Threshold: 70%+ of playtest groups prefer CafeDND over their   │
│  current VTT. If gate passes → unlock Track 2.                  │
├─────────────────────────────────────────────────────────────────┤
│  TRACK 2 — PRODUCTION VERSION                       ~19 months  │
│  Stack:  Godot 4.4+ · GDScript / C# · Vulkan / Forward+         │
│  Physics: Jolt Physics · Networking: ENet + WebRTC              │
│  Access:  Public commercial release — Steam + itch.io           │
│  Output:  Windows, macOS, Linux desktop builds (+ web eval)     │
└─────────────────────────────────────────────────────────────────┘
```

### Why Two Tracks?

The Peek mechanic and 3D social table are unproven UX concepts. Before committing ~19 months and a full Godot architecture, the research version validates the core thesis with real users at a fraction of the cost.

- **Website-first** — The primary research delivery is a hosted browser app. Zero install for testers, instant sharing, widest reach.
- **Tauri desktop** — Added in a later milestone (R7+) once the website is stable, so the team can also provide a downloadable native experience.
- **Supabase deferred** — Auth and cloud persistence are integrated only when the product moves to closed playtesting (R7). All earlier phases use a local mock server.
- **Godot** is the right engine for the final product: Vulkan rendering, built-in multiplayer, strong UI system. Research findings directly inform Godot architecture decisions.

---

## 3. Track 1 — Research Version

### 3.1 Tech Stack

| System | Technology | Notes |
|---|---|---|
| Build Tool | Vite + TypeScript | Fast HMR, modern bundling, strong typing |
| 3D Engine | Three.js r168+ | Runs in any browser, mature, excellent PBR |
| Physics | Rapier.js (WASM) | Best web physics — dice rolling, rigid bodies |
| Rendering | WebGL 2 | Cross-platform, no install required |
| Multiplayer | Socket.io + Node.js | Simple, reliable; runs locally during dev |
| Auth / DB | **Local mock (R0–R6)** → Supabase (R7) | Supabase added only for closed testing phase |
| Desktop Wrapper | **Tauri 2.0 (Rust)** — Later milestone (R7+) | Added after website is stable |
| Audio | Howler.js | Cross-browser audio with Web Audio API |
| Version Control | Git + GitHub | Standard |

### 3.2 Delivery Priorities

```
PHASE R0–R6: LOCAL DEVELOPMENT
─────────────────────────────────────────────────────────────────
  All devs run locally:
    npm run dev          → Vite client at http://localhost:5173
    npm run server:dev   → Socket.io server at http://localhost:3000
  Auth: local mock (hardcoded session tokens, no email required)
  Persistence: local JSON files (no cloud dependency)

PHASE R6: WEBSITE DEPLOYMENT
─────────────────────────────────────────────────────────────────
  Client deployed to hosted URL (Vercel / Netlify or VPS)
  Socket.io server deployed to VPS / Railway / Render
  Website becomes the primary way testers access the app

PHASE R7: CLOSED TESTING + SUPABASE
─────────────────────────────────────────────────────────────────
  Supabase wired in: magic link auth, session persistence
  Invite-only access list in Supabase
  Feedback gate begins (10–15 external tester groups)

PHASE R8: TAURI DESKTOP (LATER MILESTONE)
─────────────────────────────────────────────────────────────────
  Tauri wraps the same website codebase
  Native .msi / .dmg / .AppImage for download
  Rust IPC for local file I/O (campaign save/load)
  Optional for testers who prefer native
```

### 3.3 Research Version Phases

| Phase | Title | Timeline | Key Deliverable | Status |
|---|---|---|---|---|
| R0 | Architecture & Setup | Weeks 1–2 | Monorepo scaffolded, local client + server running for all devs | ✅ Complete |
| R1 | 3D Room & Core Scene | Weeks 2–4 | The Basement at 60fps in browser, basic camera | ✅ Complete |
| R2 | Peek Mechanic & Map System | Weeks 4–7 | Peek transition + fog of war + token placement | ✅ Complete |
| R3 | Multiplayer & Session Sync | Weeks 7–10 | Two browser clients synced in real time via local server | ✅ Complete |
| R4 | Core Game Systems | Weeks 10–13 | Physics dice + character sheet + initiative tracker | 🔨 Next Up |
| R5 | DM & Player Interfaces | Weeks 13–16 | Full DM screen + Player screen functional end-to-end | ⬜ Not started |
| R6 | Website Launch & QA | Weeks 16–19 | Hosted URL, internal dogfood sessions pass, zero critical bugs | ⬜ Not started |
| R7 | Supabase + Closed Playtesting | Weeks 19–24 | Invite-only auth, 10–15 external tester groups, feedback gate | ⬜ Not started |
| R8 | Tauri Desktop Build | Post-gate or parallel to R7 | Native desktop download available alongside website | ⬜ Not started |

### 3.4 Repository Structure

```
cafe-dnd-web/
├── src/
│   ├── scenes/        # Three.js scene classes (room, world map)
│   ├── systems/       # Game logic: peek, fog-of-war, initiative, encounter
│   ├── physics/       # Rapier.js wrapper, dice simulation
│   ├── networking/    # Socket.io client, event type definitions
│   ├── ui/            # DOM-based panels (DM screen, player screen, sheets)
│   ├── audio/         # Howler.js wrapper, audio state
│   ├── data/          # TypeScript data models: character, campaign, NPC
│   └── utils/
├── server/
│   ├── index.ts       # Socket.io server entry point
│   ├── session.ts     # Session state, room management
│   ├── auth.ts        # Mock auth (R0–R6) → Supabase adapter (R7)
│   └── events.ts      # Shared event type contracts (imported by client too)
├── src-tauri/         # Tauri 2.0 Rust backend (added at R8)
├── shared/
│   └── types.ts       # Types shared by client and server
└── package.json
```

**Local dev scripts (once scaffolded):**
```
npm run dev          # Vite dev server (browser client)
npm run server:dev   # Node.js Socket.io server (watch mode)
npm run build        # Vite production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

### 3.5 Peek Mechanic — Technical Implementation (Three.js)

1. **Table Surface** — `THREE.WebGLRenderTarget` renders the world map scene from an overhead orthographic camera. The render target texture is applied to the table mesh material.
2. **World Scene** — A separate Three.js scene graph containing terrain tiles, tokens, and the 3D landscape. This scene is rendered to the WebGLRenderTarget each frame.
3. **Peek Transition** — A GSAP timeline animates the main camera from seated position, through the table plane, and into the world scene. A stencil/clip plane hides geometry on the wrong side of the transition.
4. **Fog of War** — Custom GLSL fragment shader on terrain tiles, masking unrevealed areas with dark mist. Fog state is a `Uint8Array` bitfield synced via Socket.io.
5. **Return** — Reverse GSAP animation brings the camera back to seated position.

---

## 4. Developer Division of Labor

The research version is designed to be built by **4 developers in parallel** after the initial R0 scaffold is complete. Each developer owns a clear vertical slice of the codebase with well-defined interface contracts to the other slices.

```
┌────────────────────────────────────────────────────────────────────┐
│                  RESEARCH VERSION — DEV MAP                        │
│                                                                    │
│  DEV A             DEV B             DEV C          DEV D         │
│  3D / Scene        Game Systems      Multiplayer /  UI / Interface │
│  Engineer          Engineer          Backend Eng.   Engineer       │
│  ──────────        ────────────      ────────────   ──────────     │
│  src/scenes/       src/systems/      server/        src/ui/        │
│  src/systems/      src/physics/      src/net/       src/audio/     │
│  peek.ts           dice.ts           events.ts      dm-screen.ts   │
│  fog.ts            initiative.ts     session.ts     player-scr.ts  │
│  room.ts           encounter.ts      auth.ts        panels/*.ts    │
│                    src/data/         shared/types   chat.ts        │
│                    character.ts                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Dev A — 3D / Scene Engineer

**Owns:** `src/scenes/`, `src/systems/peek.ts`, `src/systems/fog.ts`, all Three.js scene setup and camera systems.

**Responsibilities:**
- Bootstrap the Three.js renderer, camera, and render loop
- Build "The Basement" room (geometry, PBR materials, lighting, props)
- Implement the `WebGLRenderTarget` world-map surface on the table
- Implement the Peek mechanic: GSAP camera animation through the table plane
- GLSL fog-of-war shader on the world terrain
- Ambient lighting, post-processing (bloom, SSAO), and scene performance

**Does NOT touch:** UI panels, Socket.io networking, game data models, server code.

**Interface contracts (what Dev A publishes for others):**

```typescript
// src/systems/peek.ts
export class PeekSystem {
  enter(): Promise<void>       // triggers camera dive
  exit(): Promise<void>        // returns camera to table
  onEnter(cb: () => void): void
  onExit(cb: () => void): void
}

// src/systems/fog.ts
export class FogSystem {
  reveal(cells: number[]): void    // called by Dev C when server sends fog update
  reset(): void
  getState(): Uint8Array
}

// src/scenes/room.ts
export class RoomScene {
  placeToken(id: string, x: number, z: number): void   // called by Dev C
  moveToken(id: string, x: number, z: number): void
  removeToken(id: string): void
}
```

**AI Coding Platform Instructions (drop in `src/scenes/CLAUDE.md`):**

```markdown
# Scene Engineer — AI Instructions

## Your scope
You own src/scenes/, src/systems/peek.ts, src/systems/fog.ts, and all Three.js
renderer setup. You write no UI code, no server code, and no Socket.io calls.

## Stack
Three.js r168+, TypeScript, GSAP 3.x, GLSL (inline strings or .glsl imports).
Vite handles bundling. Use `import * as THREE from 'three'`.

## Key constraints
- The renderer is WebGL 2. Do not use WebGPU APIs yet.
- The table surface texture MUST be a THREE.WebGLRenderTarget rendered from
  an orthographic camera pointing straight down at the world scene.
- Peek transition must be a GSAP timeline, not a raw requestAnimationFrame loop.
- Performance target: 60fps on GTX 1060 equivalent in Chrome.

## Interface you expose
Other devs call PeekSystem.enter/exit(), FogSystem.reveal(), and
RoomScene.placeToken/moveToken. Keep these APIs stable. Announce breaking
changes in a comment at the top of the file.

## Do not do
- Do not import from src/ui/ or src/networking/
- Do not call socket.emit() directly — expose events via EventEmitter if needed
- Do not manage auth state
```

---

### Dev B — Game Systems Engineer

**Owns:** `src/systems/` (all non-Peek, non-fog), `src/physics/`, `src/data/`.

**Responsibilities:**
- Rapier.js physics integration: dice simulation (d4, d6, d8, d10, d12, d20), collision
- D&D 5e character data model (TypeScript types + validation)
- Initiative tracker logic (ordering, turn advancement, conditions)
- Encounter system (enemy sets, HP tracking, conditions)
- Character sheet computed fields (modifiers, skill checks, spell slot tracking)
- Loot table generation
- All game data saved to local JSON during R0–R6

**Does NOT touch:** Three.js scene geometry, Socket.io emission, UI rendering code.

**Interface contracts (what Dev B publishes for others):**

```typescript
// src/systems/initiative.ts
export class InitiativeTracker {
  rollAll(characters: Character[]): InitiativeOrder
  next(): CombatantId
  addCondition(id: CombatantId, cond: Condition): void
  getState(): InitiativeState    // serializable — Dev C sends this over socket
}

// src/physics/dice.ts
export class DiceRoller {
  roll(type: DieType): Promise<number>   // returns final face value
  rollSet(types: DieType[]): Promise<number[]>
}

// src/data/character.ts
export type Character = { ... }          // canonical 5e data model
export function computeModifier(score: number): number
export function validateCharacter(raw: unknown): Character
```

**AI Coding Platform Instructions (drop in `src/systems/CLAUDE.md`):**

```markdown
# Game Systems Engineer — AI Instructions

## Your scope
You own src/systems/ (initiative, encounter, loot), src/physics/ (Rapier.js dice),
and src/data/ (TypeScript data models). You write no Three.js geometry code,
no UI rendering, and no direct socket.emit() calls.

## Stack
TypeScript, Rapier.js WASM (@dimforge/rapier3d), standard browser APIs.

## Key constraints
- Rapier.js must be initialized asynchronously before use. Export an
  `initPhysics(): Promise<void>` that callers await before rolling dice.
- All game state objects (Character, InitiativeState, EncounterState) must be
  fully serializable to JSON — they are sent over the socket by Dev C.
- D&D 5e rules: use only SRD/OGL content. No third-party IP.
- Do not embed any UI logic. Raise events or return values; let Dev D render.

## Interface you expose
Dev C reads getState() from your systems and sends state over the socket.
Dev D reads state and renders it. Keep state shapes stable; document changes.

## Do not do
- Do not import from src/scenes/, src/ui/, or src/networking/
- Do not read/write DOM directly
- Do not assume Supabase exists — use local JSON (src/data/localStore.ts) for R0–R6
```

---

### Dev C — Multiplayer & Backend Engineer

**Owns:** `server/`, `src/networking/`, `shared/types.ts`.

**Responsibilities:**
- Node.js + Socket.io server (local first, then deployed)
- Session management: room creation, join by code, reconnect
- Real-time event relay: token moves, fog reveals, dice results, HP changes, chat
- Local mock auth (R0–R6): hardcoded tokens, no email required
- Supabase integration (R7 only): magic link auth, session persistence
- Shared event type definitions imported by both client and server
- Server deployment (R6): Railway / Render / VPS

**Does NOT touch:** Three.js scene code, UI panel rendering, game rules logic.

**Interface contracts (what Dev C exposes to the client):**

```typescript
// shared/types.ts — socket event catalog (consumed by all devs)
export type ServerToClient = {
  'session:state':     SessionState
  'token:moved':       { id: string; x: number; z: number }
  'fog:update':        { cells: number[] }
  'dice:result':       { roller: string; values: number[]; total: number }
  'initiative:update': InitiativeState
  'chat:message':      ChatMessage
  'player:joined':     { id: string; name: string }
  'player:left':       { id: string }
}

export type ClientToServer = {
  'token:move':       { id: string; x: number; z: number }
  'fog:reveal':       { cells: number[] }
  'dice:roll':        { types: DieType[] }
  'chat:send':        { channel: ChatChannel; text: string }
  'initiative:next':  {}
}
```

**AI Coding Platform Instructions (drop in `server/CLAUDE.md`):**

```markdown
# Multiplayer & Backend Engineer — AI Instructions

## Your scope
You own server/ (Node.js + Socket.io), src/networking/ (client socket wrapper),
and shared/types.ts (event contracts). You do not write Three.js scene code,
game rules logic, or UI rendering.

## Stack
Node.js 20+, TypeScript, Socket.io 4.x, tsx (for watch mode), nodemon.
R7 only: Supabase JS SDK (@supabase/supabase-js).

## Key constraints
- ALL socket event names and payload shapes live in shared/types.ts.
  No hardcoded string literals anywhere else. Both client and server import from there.
- The server is stateful (rooms, session state live in memory during R0–R6).
  Design for easy handoff to Supabase persistence later — keep state logic in
  session.ts, not inline in socket handlers.
- Local auth (R0–R6): accept any { name, token } pair; issue a session ID.
  Do not build email flows yet. Auth adapter pattern — swap in Supabase later.
- Reconnect handling: store full session state per room. On reconnect, emit
  'session:state' to the rejoining client to restore their view.

## Running locally
  cd server && npm run dev   → nodemon/tsx on port 3000
  Client connects to http://localhost:3000

## Do not do
- Do not import from src/scenes/ or src/ui/
- Do not add Supabase before R7 is officially started
- Do not store secrets in source files — use .env (gitignored)
```

---

### Dev D — UI / Interface Engineer

**Owns:** `src/ui/`, `src/audio/`, all DOM-based panels and overlays.

**Responsibilities:**
- DM Screen layout: toolbar, all 9 DM panels (encounter, fog, tokens, notes, NPC, loot, audio, initiative, settings)
- Player Screen layout: bottom bar, character sheet panel, dice roller panel, chat panel, Peek overlay trigger
- All CSS / styling (paper-and-ink aesthetic per style guide)
- Howler.js audio wrapper: ambient tracks, crossfade, volume control
- Turn notification overlays, disconnect banners, error toasts
- Listening to socket events (via Dev C's networking module) and updating UI state
- UI Dict §1–§4 from PROD_UI_DICT.md is Dev D's feature spec

**Does NOT touch:** Three.js scene geometry, Socket.io server code, game rules calculations.

**Interface contracts (what Dev D consumes):**

```typescript
// Dev D listens to these, does not implement them
import { PeekSystem } from '../systems/peek'      // Dev A
import { DiceRoller } from '../physics/dice'      // Dev B
import { InitiativeTracker } from '../systems/initiative' // Dev B
import { socket } from '../networking/client'     // Dev C — already connected socket
```

**AI Coding Platform Instructions (drop in `src/ui/CLAUDE.md`):**

```markdown
# UI / Interface Engineer — AI Instructions

## Your scope
You own src/ui/ (all DOM panels, overlays, layout) and src/audio/ (Howler.js wrapper).
You consume APIs from Dev A (PeekSystem), Dev B (DiceRoller, InitiativeTracker),
and Dev C (socket events). You do not write Three.js scene code, game logic, or
server code.

## Stack
TypeScript, vanilla DOM APIs (no React — Three.js canvas takes the full viewport),
CSS custom properties (see src/styles.css for --paper, --ink, --gold, --moss tokens),
Howler.js 2.x for audio.

## Visual identity
Paper-and-ink aesthetic. Variables: --paper (#F5F0E8), --ink (#2C1810),
--gold (#8B6914), --moss (#4A5E3A), --danger (#8B2020), --mist (#D4C9B0).
Font stack: Cinzel (headings), Patrick Hand (body), Caveat (annotations).
Reference: UI_Design_References/V1-Viewable — run `npm run dev` there to see wireframes.

## Key constraints
- UI panels are DOM overlays on top of the Three.js canvas. Use pointer-events
  carefully — the canvas must receive mouse/touch events for camera control.
- Do not call socket.emit() directly for game actions. Import the networking
  module's typed helpers (e.g. sendDiceRoll(), moveToken()) — Dev C owns those.
- Do not implement dice physics or initiative math — call Dev B's APIs and render results.
- Panel open/close state lives in a simple store (e.g. zustand or plain TS class).
  Do not put it in the Three.js scene.

## Audio
Howler.js manages ambient looping tracks. DM can crossfade between tracks.
All audio files are local to the repo during R0–R6. No CDN audio.

## Do not do
- Do not import THREE or touch the WebGL canvas from UI code
- Do not read/write localStorage for game state (that's Dev C's domain)
- Do not inline any auth logic
```

---

## 5. Parallel Work Schedule

After R0 scaffold is complete, Devs A, B, C, D work in parallel within their lanes. Integration syncs happen at phase boundaries.

```
WEEK:    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19+
         ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
SHARED   [R0: Scaffold + Contracts]│                                                   [R6 Integration]
Dev A               [Room & Scene ]│[Peek + Fog of War  ]│                             [3D Polish   ]
Dev B                              │[Data Models + Init ]│[Dice + Encounter           ]│
Dev C         [Local Server Setup ]│[Session + Sync     ]│[Reconnect + Relay          ]│[Deploy     ]
Dev D               [DM Screen    ]│[Player Screen      ]│[All Panels + Audio         ]│[UI Polish  ]
         ├────┼────┼────┼────────────────────────────────────────────────────────────────────────────┤
                                                                                        R6 → R7 → R8
```

### Integration Points (Sync Meetings)

| Milestone | Who | What to verify |
|---|---|---|
| End of R1 | A + D | Canvas + UI overlay layout works together, no input blocking |
| End of R2 | A + C | Fog state from server applies to FogSystem correctly |
| End of R3 | All | Two browser windows connected locally, token moves sync |
| End of R4 | B + C + D | Dice rolls sent over socket, result rendered in UI |
| End of R5 | All | Full DM + Player session playable locally |

---

## 6. Track 2 — Production Version (Godot 4.x)

*(Unchanged from prior plan — begins only if feedback gate passes.)*

### 6.1 Why Godot for Production

| Criteria | Godot 4.x | Notes |
|---|---|---|
| Licensing | MIT — no revenue share, no runtime fee | Removes all business risk |
| Rendering | Vulkan Forward+ — PBR, GI, volumetric fog | Significantly better than Three.js WebGL |
| Multiplayer | Built-in MultiplayerAPI (RPC, sync, authority) | No third-party dependency |
| UI System | Control nodes — excellent for complex layered UIs | DM dashboard, character sheets |
| Scripting | GDScript + C# | Fast iteration, strong community |
| Physics | Jolt Physics (Godot 4.3+) | Better for dice simulation |
| Performance | Native desktop, not browser-constrained | Required for Peek 2.0 quality |

### 6.2 Production Phases

| Phase | Title | Timeline | Key Deliverable |
|---|---|---|---|
| G0 | Godot Foundation | Months 1–2 | Two clients in networked room |
| G1 | Table Comes Alive | Months 3–5 | SubViewport map, Peek v1, physics dice |
| G2 | Avatar & Social Layer | Months 6–7 | Expressive avatars, voice + chat |
| G3 | Character & Combat | Months 8–10 | Full 5e sheet, combat end-to-end |
| G4 | Puzzles & DM Power Tools | Months 11–13 | Complete DM toolkit |
| G5 | World Building & Peek 2.0 | Months 14–16 | Vulkan terrain, volumetric fog of war |
| G6 | Polish, Platform & Launch | Months 17–19 | Steam Early Access |
| G7 | Post-Launch & Expansion | Month 20+ | Mobile, modding, marketplace, VR, AI |

### 6.3 Research → Godot Handoff

Before G0 begins, the research version produces a **"Godot Architecture Learnings" document** capturing:

- Which Three.js scene structure translated well vs what needed redesign
- Network sync patterns that worked (carry to Godot MultiplayerAPI)
- UI patterns playtests confirmed vs rejected
- Performance bottlenecks in the browser (inform LOD strategy in Godot)
- Player mental models — how players actually use the Peek mechanic

---

## 7. The 3D Environment

### 7.1 Room Presets (DM Selectable)

| Preset | Description |
|---|---|
| **The Basement** | Classic suburban D&D den. Wood paneling, posters, pizza boxes, bookshelf of rulebooks |
| **The Tavern Backroom** | Fantasy-themed. Stone walls, candlelight, tankards, roaring fireplace |
| **The Study** | Academic's office. Dark wood, leather chairs, maps pinned to walls, inkwells |
| **The Restaurant Booth** | Modern. Diner-style booth, menus stacked aside, ambient restaurant chatter |
| **Custom** | DM swaps props, lighting preset, and ambient audio track |

Research version ships with **The Basement only**. Additional presets in Godot G6.

### 7.2 The Peek Mechanic

1. **Default View** — Table surface shows a top-down tactical map with tokens and fog of war
2. **Peek Mode** — Camera smoothly transitions through the table plane into a 3D landscape below
3. **The Landscape** — Terrain based on the DM's map: hills, forests, dungeons, cities
4. **Fog of War in 3D** — Unexplored areas shrouded in mist
5. **Return** — Camera transitions back to seated position

---

## 8. Data Architecture

```
Campaign Data
├── campaign_meta.json      — Title, setting, session log
├── maps/                   — Tile grids, heightmaps, prop positions
├── encounters/             — Enemy sets, initiative configs, wave rules
├── characters/             — Player character sheets (5e data model)
├── npcs/                   — NPC cards, dialogue, relationships
├── loot_tables/            — Weighted item tables, treasure configs
├── notes/                  — DM session notes (tagged, searchable)
└── assets/                 — Custom tokens, portraits, audio files
```

**Persistence by phase:**
- R0–R6: Local JSON files on disk (Tauri file I/O or Node.js `fs`)
- R7: Supabase cloud (auth, session persistence, campaign storage)
- R8+: Supabase + Tauri local cache (offline support)

---

## 9. Technical Specifications

### 9.1 Research Version — Browser Requirements

| Component | Minimum | Notes |
|---|---|---|
| Browser | Chrome 100+ / Firefox 100+ / Safari 16+ | WebGL 2.0 required |
| GPU | Any with WebGL 2.0 support | Integrated graphics acceptable |
| RAM | 4 GB | 8 GB recommended |
| Network | 5 Mbps up/down | For multiplayer sessions |

### 9.2 Production Version — Desktop Requirements

| Component | Minimum | Recommended |
|---|---|---|
| OS | Windows 10 / macOS 12 / Ubuntu 22+ | Latest |
| CPU | Intel i5-8400 / Ryzen 5 2600 | i7-10700 / Ryzen 7 3700X |
| GPU | GTX 1060 / RX 580 (Vulkan required) | RTX 3060 / RX 6700 XT |
| RAM | 8 GB | 16 GB |
| Storage | 2 GB base | SSD recommended |
| Network | 5 Mbps | 10+ Mbps |

### 9.3 Target Performance

- **Research version:** 60fps in Chrome on GTX 1060 equivalent; 30fps on integrated graphics
- **Production version:** 60fps table view, 30fps minimum in Peek mode with full terrain

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Concept doesn't resonate — Peek falls flat | Medium | Critical | Research version validates before Godot investment |
| Three.js performance ceiling — Peek too heavy in browser | Medium | Medium | LOD system; fallback to 2D map if needed |
| Networking complexity — desyncs, state corruption | Medium | High | Socket.io for research; typed event contracts from day 1 |
| Scope creep — "just one more tool" | High | High | Phase gates. MVP first. Developer lanes enforce focus. |
| Feedback gate fails — results inconclusive | Low-Med | Critical | Min 15 tester groups; structured questions; clear threshold |
| Integration hell — dev lanes drift apart | Medium | Medium | Shared types.ts contract; integration syncs at each phase end |
| Supabase dependency too early | Low | Medium | Mitigated — Supabase deferred to R7 explicitly |
| Legal — D&D IP | Low | High | Use only SRD / OGL / Creative Commons content |

---

## 11. Team

### Research Phase (Track 1) — 4 Developer Lanes

| Dev | Lane | Primary Skills |
|---|---|---|
| **Dev A** | 3D / Scene Engineer | Three.js, GLSL, GSAP, WebGL |
| **Dev B** | Game Systems Engineer | TypeScript, Rapier.js, 5e rules, data modeling |
| **Dev C** | Multiplayer / Backend | Node.js, Socket.io, TypeScript, DevOps |
| **Dev D** | UI / Interface | DOM, CSS, Howler.js, UX/design sensibility |

**Minimum viable team: 2 developers doubling up on lanes.** Claude can assist with ~60% of the web code per developer. Each dev lane has its own AI instructions in its CLAUDE.md.

### Production Phase (Track 2)

| Role | Count | Focus |
|---|---|---|
| **Lead Developer / Architect** | 1 | Godot architecture, networking, core systems |
| **3D Environment Artist** | 1 | Room environments, terrain, props, Peek world |
| **3D Character Artist** | 1 | Avatar system, customization, rigging, animation |
| **UI/UX Developer** | 1 | DM screen, player screen, all interface work |
| **Gameplay Programmer** | 1–2 | Combat, puzzles, dice, encounter logic |
| **Network Programmer** | 1 | Multiplayer sync, lobby, cloud infrastructure |
| **Audio Designer** | 1 (contract) | Music, SFX, ambiance packs |
| **QA / Community Manager** | 1 | Playtesting, bug tracking, community feedback |

---

## 12. Monetization

*Research version is closed — no monetization.*

**Production version (post-Early Access):**

- **Premium Purchase** — One-time buy on Steam ($20–30). DM buys the full version; players join free or buy a cheaper "Player Edition."
- **Cosmetic DLC** — Room themes, avatar outfits, dice skins. Purely cosmetic, never gameplay-gating.
- **Campaign Marketplace** — Revenue share on community-created campaigns, maps, puzzle packs.
- **Subscription (Optional)** — Cloud hosting for persistent servers, extra storage, priority support.

> The D&D community will not tolerate pay-to-win or content-gating DLC. Do not do it.

---

## 13. Success Metrics

### Research Phase

| Metric | Target |
|---|---|
| Tester groups recruited | 10–15 groups |
| Average playtesting session length | 1.5+ hours |
| Groups preferring CafeDND over current VTT | 70%+ (gate threshold) |
| Critical bugs at gate decision | 0 |

### Production Phase (Year 1 post-launch)

| Metric | Target |
|---|---|
| Early Access sales | 10,000+ units |
| Average session length | 2+ hours |
| Sessions per week per active group | 1+ |
| Player retention (30-day) | 40%+ |
| Steam review rating | Mostly Positive (70%+) |
| Community-created content | 100+ shared campaigns/maps |

---

## 14. Summary

**CafeDND / Tavern Table** is built in two phases: a research version to validate the concept, then a production version to commercialize it.

The research version (Three.js + Vite + Socket.io) ships first as a **website** — no install required for testers, instantly shareable. A Tauri desktop app is added as a later milestone (R8) once the site is stable. Supabase is integrated only at R7 when the product enters formal closed playtesting.

Four developer lanes (3D, Game Systems, Multiplayer, UI) work in parallel with typed interface contracts keeping them from stepping on each other. Each lane ships with AI coding instructions in its CLAUDE.md so agentic tools stay in-scope.

If the feedback gate passes, the Godot production version begins — informed by months of real usage data, with far fewer architectural unknowns.

The Peek mechanic is the product's soul. Everything else is tooling around it.

**Build the table first. Make it feel right to sit at. Everything else follows.**

---

*Document Version: 4.1*
*Last Updated: May 2026 — R3 Complete*
*Research Stack: Three.js + Vite + TypeScript + Socket.io*
*Production Stack: Godot 4.x*
*Codename: Tavern Table / CafeDND*
