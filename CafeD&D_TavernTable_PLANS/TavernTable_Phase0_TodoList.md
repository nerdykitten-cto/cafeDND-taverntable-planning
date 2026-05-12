# Tavern Table — Research Version: Phase R0 Kickoff Todo List

**Track:** Research Version (Three.js + Vite + TypeScript + Socket.io)
**Phase:** R0 — Architecture & Setup
**Goal:** Local client + local server running for every team member. Zero game features — only the scaffold and contracts that everything else is built on.
**Current State:** Empty — no code, no config, no server.
**Date Updated:** May 2026

---

## Delivery Model (Read This First)

The Research Version ships **website-first**:

| Phase | What runs | Auth | Persistence |
|---|---|---|---|
| R0 - R6 | `localhost:5173` (Vite) + `localhost:3000` (Socket.io) | Local mock — any name/token accepted | Local JSON files on disk |
| R6 | Deployed HTTPS URL + deployed Socket.io server | Still mock | Still local JSON |
| R7 | Same deployed site | Supabase magic-link | Supabase cloud |
| R8 | Same site + Tauri desktop wrapper | Supabase | Supabase + local Tauri file I/O |

**Do not set up Supabase or Tauri in R0.** Those are R7 and R8 concerns. R0 is clean, local, and dependency-free.

---

## How to Read This List

Each item is tagged with:

- **Priority:** P0 (blocks all other work), P1 (needed for full R0 deliverable), P2 (nice to have before R1)
- **Owner:** `Dev` (any developer), `Ali` (you need to source/decide this), `Both`
- **Type:** `Code`, `Config`, `Asset`, `Design`, `Decision`
- **Lane:** Which dev lane owns this (A = 3D/Scene, B = Game Systems, C = Multiplayer/Backend, D = UI/Interface, Shared = everyone)

The R0 deliverable: every team member runs `npm run dev` (Vite at :5173) and `npm run server:dev` (Socket.io at :3000) and sees a Three.js canvas. That is it.

---

## 1. Monorepo Scaffold — P0 . Shared

These are the bones. Nothing else is possible without them.

- [ ] **Initialize Vite + TypeScript project** — `Code` / `Config` . Dev . Shared
  - `npm create vite@latest cafe-dnd-web -- --template vanilla-ts`
  - Delete default boilerplate (`counter.ts`, `style.css`, etc.)
  - Confirm TypeScript strict mode enabled in `tsconfig.json`
  - Set `"module": "ESNext"` and `"moduleResolution": "bundler"` in tsconfig

- [ ] **Install client libraries** — `Config` . Dev . Shared
  ```bash
  npm install three gsap howler socket.io-client
  npm install @dimforge/rapier3d-compat
  npm install -D @types/three @types/howler
  ```
  (No `@supabase/supabase-js` yet — that is R7)

- [ ] **Initialize server inside `server/`** — `Code` . Dev C . Multiplayer Lane
  ```bash
  cd server
  npm init -y
  npm install socket.io express
  npm install -D typescript tsx nodemon @types/node @types/express
  ```
  - `server/tsconfig.json` pointing at `index.ts`
  - Add `"server:dev": "nodemon --exec tsx server/index.ts"` to root `package.json`

- [ ] **ESLint + Prettier** — `Config` . Dev . Shared
  ```bash
  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
  ```
  - Create `.eslintrc.cjs` and `.prettierrc` at root
  - Add `"lint": "eslint src"` and `"format": "prettier --write src"` to `package.json`

- [ ] **Concurrently for dev** — `Config` . Dev . Shared
  ```bash
  npm install -D concurrently
  ```
  - Add to root `package.json`: `"dev:all": "concurrently \"npm run dev\" \"npm run server:dev\""`
  - Single command launches both Vite and the Socket.io server

---

## 2. Canonical Folder Structure — P0 . Shared

Create the full directory tree before any code is written so all four dev lanes have their home:

```
cafe-dnd-web/
|-- src/
|   |-- scenes/         # [Lane A] Three.js scene classes -- room, world map
|   |-- systems/        # [Lane A+B] Game logic -- peek, fog, initiative, encounter
|   |-- physics/        # [Lane B] Rapier.js wrapper, dice simulation
|   |-- networking/     # [Lane C] Socket.io client, typed event helpers
|   |-- ui/             # [Lane D] DOM panels -- DM screen, player screen, overlays
|   |-- audio/          # [Lane D] Howler.js wrapper, audio state
|   |-- data/           # [Lane B] TypeScript data models -- character, campaign, NPC
|   `-- utils/          # [Shared] Math helpers, asset loaders, misc
|-- server/
|   |-- index.ts        # [Lane C] Express + Socket.io entry point
|   |-- session.ts      # [Lane C] Room management, in-memory session state
|   |-- auth.ts         # [Lane C] Mock auth (R0-R6) -- swap in Supabase at R7
|   `-- events.ts       # [Lane C] Server-side event handler wiring
|-- shared/
|   `-- types.ts        # [Shared] ALL socket event names + payload types
|-- public/
|   `-- assets/
|       |-- models/     # GLTF/GLB 3D models
|       |-- textures/   # PBR textures
|       |-- audio/      # Music, SFX, ambience (.mp3/.ogg)
|       `-- fonts/      # UI fonts (.woff2)
`-- src-tauri/          # [R8 only -- do not create yet]
```

- [ ] Create all directories above (use `.gitkeep` files so git tracks empty dirs)
- [ ] Place a `CLAUDE.md` in each of the four lane directories -- see Section 6

---

## 3. Shared Type Contracts — P0 . Lane C . All Lanes Must Agree

All socket event names and payload shapes live in **one file**: `shared/types.ts`. No lane uses a hardcoded string literal for an event name.

- [ ] **Create `shared/types.ts`** — `Code` . Dev C (initial draft) . All review
  ```typescript
  // Socket event catalog
  export type ServerToClient = {
    'session:state':      SessionState
    'token:moved':        { id: string; x: number; z: number }
    'fog:update':         { cells: number[] }
    'dice:result':        { roller: string; values: number[]; total: number }
    'initiative:update':  InitiativeState
    'chat:message':       ChatMessage
    'player:joined':      { id: string; name: string }
    'player:left':        { id: string }
  }

  export type ClientToServer = {
    'token:move':         { id: string; x: number; z: number }
    'fog:reveal':         { cells: number[] }
    'dice:roll':          { types: DieType[] }
    'chat:send':          { channel: ChatChannel; text: string }
    'initiative:next':    Record<string, never>
    'room:create':        { name: string }
    'room:join':          { code: string; name: string }
  }

  // Game state shapes (lanes expand these as they implement)
  export type SessionState    = { roomCode: string; players: Player[]; dmId: string }
  export type Player          = { id: string; name: string; seatIndex: number }
  export type InitiativeState = { order: CombatantId[]; currentIndex: number }
  export type ChatMessage     = { from: string; channel: ChatChannel; text: string; ts: number }
  export type ChatChannel     = 'table' | 'ooc' | 'whisper'
  export type DieType         = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'
  export type CombatantId     = string
  ```

- [ ] Both `server/` and `src/networking/` import from `shared/types.ts` -- confirm TypeScript resolves the path (tsconfig path alias or relative `../../shared/types`)

---

## 4. Socket.io Server — P0 . Lane C

- [ ] **`server/index.ts`** — Express + Socket.io entry — `Code` . Dev C
  - `http.createServer(app)` then `new Server(httpServer, { cors: { origin: 'http://localhost:5173' } })`
  - Listens on port 3000
  - On connection: log socket ID, wire up room join/create events from `session.ts`

- [ ] **`server/session.ts`** — Room management — `Code` . Dev C
  - `createRoom(dmSocketId)` generates 6-char alphanumeric code, returns it
  - `joinRoom(code, socketId, name)` adds player, assigns seat index
  - `leaveRoom(code, socketId)` cleanup, notifies remaining players
  - Room struct: `{ code, dmId, players: Player[], state: SessionState }`
  - All in-memory -- no database in R0-R6

- [ ] **`server/auth.ts`** — Mock auth adapter — `Code` . Dev C
  - `validateToken(name, token): { valid: boolean; userId: string }`
  - Always returns `{ valid: true, userId: token }` in mock mode
  - Adapter pattern: signature never changes when Supabase is swapped in at R7
  - No email, no invite list, no cloud in R0

- [ ] **Confirm server** — Dev C
  - `npm run server:dev` starts without errors on port 3000
  - Browser console at `localhost:5173` confirms Socket.io handshake
  - Log `socket.id` on both sides to verify round-trip

---

## 5. Three.js Client Baseline — P0 . Lane A

- [ ] **`src/main.ts`** — entry point — `Code` . Dev A
  - Creates `THREE.WebGLRenderer` (antialias, full window size, `window.devicePixelRatio`)
  - One `PerspectiveCamera` at a seated position (~1.2m height, looking at table center)
  - One `DirectionalLight` + `AmbientLight`
  - A placeholder `BoxGeometry` as the table
  - `requestAnimationFrame` render loop
  - Stats.js overlay in dev mode -- must confirm 60fps before Lane A moves to R1
  - Connects to Socket.io at `http://localhost:3000` via `socket.io-client`

- [ ] **Confirm renderer** — Dev A
  - `npm run dev` shows a lit 3D box at `localhost:5173`
  - No console errors
  - Stats.js shows 60fps

---

## 6. Dev Lane CLAUDE.md Files — P1 . Shared

Each developer lane gets a `CLAUDE.md` in its directory. These instruct AI coding platforms to stay in scope. Full content is in `DnD_Platform_Development_Plan.md` Section 4 -- copy the relevant block into each file.

- [ ] **`src/scenes/CLAUDE.md`** — Lane A (3D/Scene Engineer)
- [ ] **`src/systems/CLAUDE.md`** — Lane B (Game Systems Engineer)
- [ ] **`server/CLAUDE.md`** — Lane C (Multiplayer/Backend Engineer)
- [ ] **`src/ui/CLAUDE.md`** — Lane D (UI/Interface Engineer)

Each file tells its AI: what it owns, what it must not touch, its tech stack, its interface contracts, and what not to do.

---

## 7. Version Control and CI — P1 . Shared

- [ ] **`.gitignore`** at project root — `Config` . Dev
  ```
  node_modules/
  dist/
  .env
  .env.local
  src-tauri/target/
  *.pptx
  screenshots/
  .DS_Store
  Thumbs.db
  ```

- [ ] **Git LFS for 3D assets** — `Config` . Dev
  ```bash
  git lfs install
  git lfs track "*.glb" "*.gltf" "*.hdr" "*.ktx2" "*.exr"
  ```
  Commit `.gitattributes` immediately after.

- [ ] **GitHub Actions CI** — `Config` . Dev
  - `.github/workflows/ci.yml`
  - Trigger: push to `main` + all PRs
  - Steps: `npm ci` then `npm run lint` then `npm run type-check` then `npm run build`
  - Confirm CI passes on a clean push

---

## 8. Developer Setup Documentation — P1 . Shared

- [ ] **`SETUP.md`** in project root — `Design` . Both
  - Prerequisites: Node 20+, Git, npm, git-lfs
  - Clone + install: `git clone` then `npm install` then `cd server && npm install`
  - Run: `npm run dev` (Vite at :5173) and `npm run server:dev` (Socket.io at :3000)
  - Or combined: `npm run dev:all`
  - Env vars: none needed in R0 (mock auth has no secrets)
  - Troubleshooting: port conflicts, CORS errors, TypeScript path resolution for `shared/`
  - Note: Supabase setup is in `SETUP_R7_SUPABASE.md` (written at R7). Tauri setup is in `SETUP_R8_TAURI.md` (written at R8). Do not configure either now.

---

## 9. Assets to Source (for R1, not R0) — P1

Not needed for R0. Start sourcing now so R1 is not blocked.

- [ ] **HDRI environment map** — `Asset` . P1 for R1 . Ali
  - Warm interior HDRI for Three.js `PMREMGenerator`
  - Source free from Poly Haven (polyhaven.com) -- studio or warm room type
  - Format: `.hdr` or `.exr`, 4K resolution

- [ ] **"The Basement" room model** — `Asset` . P1 for R1 . Ali (source or commission)
  - Rectangular room interior: floor, walls, ceiling, wood paneling
  - Central table as a **separate mesh object** -- required for Peek WebGLRenderTarget
  - 4-8 chairs around the table
  - Style: cozy D&D basement -- warm, low-poly is fine for research version
  - Format: `.glb` with embedded PBR textures (Base Color, Normal, Roughness/Metallic)

- [ ] **UI fonts** — `Asset` . P1 for R1 . Ali
  - Header: Cinzel (Google Fonts, free)
  - Body: Patrick Hand (Google Fonts, free)
  - Annotations: Caveat (Google Fonts, free)
  - Format: `.woff2` in `public/assets/fonts/`

- [ ] **Ambient audio -- Basement loop** — `Asset` . P2 for R1 . Ali
  - 2-3 minute seamless loop: fireplace, distant rain, soft room tone
  - Source: freesound.org (Creative Commons)
  - Format: `.mp3` + `.ogg`

---

## R0 Completion Criteria

Phase R0 is **DONE** when all of these are true:

- [ ] `npm run dev` opens a Three.js canvas at `localhost:5173` with no errors
- [ ] `npm run server:dev` starts Socket.io at `localhost:3000` with no errors
- [ ] Browser console confirms Socket.io handshake to the local server
- [ ] `shared/types.ts` has the full socket event catalog, imported by both client and server
- [ ] All four lane `CLAUDE.md` files are in place
- [ ] A second developer can clone the repo and be fully running in under 15 minutes from `SETUP.md`
- [ ] CI pipeline passes on a clean push to `main`

**Supabase is NOT a completion criterion for R0.**
**Tauri is NOT a completion criterion for R0.**

---

## What Can Be Built Right Now (Zero Art Assets Required)

1. Vite + TypeScript + Three.js scaffold
2. Socket.io server with room management and mock auth
3. `shared/types.ts` event contract
4. All four lane `CLAUDE.md` files
5. Folder structure + `.gitkeep` files
6. CI pipeline + `.gitignore` + Git LFS
7. `SETUP.md`

**~95% of R0 requires zero art assets. Start immediately.**

---

## Future Phase References (Do Not Do in R0)

| What | When | Where |
|---|---|---|
| Supabase magic-link auth | R7 | `server/auth.ts` adapter swap |
| Supabase DB schema + RLS | R7 | Supabase dashboard |
| Tauri Rust toolchain + IPC | R8 | `src-tauri/` directory |
| Tauri builds (.msi/.dmg/.AppImage) | R8 | GitHub Release CI workflow |
| Invite-only access list | R7 | Supabase auth config |

---

*Next Phase: R1 -- 3D Room and Core Scene. Needs the room model, HDRI, and basic textures (see Section 9 above).*

*Roadmap: Open `roadmap/index.html` in a browser for the full interactive plan.*

*Dev Plan: See `CafeD&D_TavernTable_PLANS/DnD_Platform_Development_Plan.md` for the full 4-developer-lane breakdown.*
