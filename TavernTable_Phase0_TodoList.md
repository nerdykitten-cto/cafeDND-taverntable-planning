# Tavern Table — Research Version: Phase R0 Kickoff Todo List

**Track:** Research Version (Three.js + Tauri)
**Phase:** R0 — Architecture & Setup
**Goal:** Full development stack running locally for every team member. Zero game features — only the scaffold that everything else is built on.
**Current State:** Empty — no code, no config, no server.
**Date Updated:** May 2026

---

## How to Read This List

Each item is tagged with:

- **Priority:** P0 (blocks all other work), P1 (needed for full R0 deliverable), P2 (nice to have before R1)
- **Owner:** `Dev` (any developer), `Ali` (you need to source/decide this), `Both`
- **Type:** `Code`, `Config`, `Asset`, `Design`, `Decision`

The R0 deliverable is simple: every team member runs `npm run dev` and sees a Three.js canvas. Tauri wraps it as a native window. Supabase auth works with an invite link. That's it.

---

## 1. Web App Scaffold — P0

These are the bones. Nothing else is possible without them.

- [ ] **Initialize Vite + TypeScript project** — `Code` / `Config`
  - Owner: Dev
  - `npm create vite@latest cafe-dnd -- --template vanilla-ts`
  - Delete the default boilerplate (`src/counter.ts`, `src/style.css`, etc.)
  - Confirm: TypeScript strict mode enabled in `tsconfig.json`

- [ ] **Install and configure Three.js** — `Code`
  - Owner: Dev
  - `npm install three @types/three`
  - Create `src/main.ts` with a minimal Three.js scene (one box, one light, `requestAnimationFrame` loop)
  - Confirm: scene renders in browser at `localhost:5173`

- [ ] **Install supporting libraries** — `Config`
  - Owner: Dev
  ```
  npm install gsap howler socket.io-client @supabase/supabase-js
  npm install @dimforge/rapier3d-compat  # WASM physics for dice
  npm install -D @types/howler
  ```

- [ ] **ESLint + Prettier** — `Config`
  - Owner: Dev
  - `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier`
  - Create `.eslintrc.cjs` and `.prettierrc` with team-agreed rules
  - Add `lint` and `format` scripts to `package.json`

- [ ] **Folder structure** — `Code`
  - Owner: Dev
  - Create the canonical layout:
    ```
    src/
    ├── scenes/         # Three.js scene classes (room, world map, etc.)
    ├── systems/        # Game logic (fog of war, token management, etc.)
    ├── ui/             # DOM-based UI panels (DM screen, player screen)
    ├── networking/     # Socket.io client, event handlers, state sync
    ├── audio/          # Howler.js audio manager
    ├── physics/        # Rapier.js physics world wrapper
    ├── data/           # TypeScript data models (character, campaign, etc.)
    └── utils/          # Helpers (math, geometry, asset loading)
    public/
    ├── assets/
    │   ├── models/     # GLTF/GLB 3D models
    │   ├── textures/   # PBR textures, UI art
    │   ├── audio/      # Music, SFX, ambience (.mp3/.ogg)
    │   └── fonts/      # UI fonts (.ttf/.woff2)
    server/             # Node.js Socket.io server (separate from Vite app)
    ├── index.ts        # Express + Socket.io entry
    ├── rooms.ts        # Session/room management
    └── state.ts        # Authoritative game state
    ```

---

## 2. Tauri Desktop Wrapper — P0

The Tauri app wraps the exact same web app in a native window. No separate codebase.

- [ ] **Install Rust toolchain** — `Config`
  - Owner: Dev (each machine)
  - `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
  - Windows: use `rustup-init.exe`
  - Confirm: `rustc --version` works

- [ ] **Install Tauri CLI** — `Config`
  - Owner: Dev
  - `npm install -D @tauri-apps/cli @tauri-apps/api`
  - `npx tauri init` inside the project root
  - Configure `tauri.conf.json`:
    - `devUrl`: `http://localhost:5173`
    - `frontendDist`: `../dist`
    - App name: `CafeDND`, identifier: `com.cafednd.taverntable`

- [ ] **Add Tauri dev + build scripts** — `Config`
  - Owner: Dev
  - `"tauri:dev": "tauri dev"` — opens native window with live Vite reload
  - `"tauri:build": "tauri build"` — produces platform-native binary
  - Confirm: `npm run tauri:dev` opens a native window running the Three.js scene

- [ ] **Tauri IPC bridge for file I/O** — `Code`
  - Owner: Dev
  - Add Rust commands in `src-tauri/src/main.rs`:
    - `save_campaign(path: String, data: String)` — write JSON to disk
    - `load_campaign(path: String)` — read JSON from disk
    - `open_file_dialog()` — native file picker
  - Register commands in Tauri's invoke handler
  - Create `src/utils/tauriStorage.ts` that calls these IPC commands

---

## 3. Multiplayer Server — P0

The Socket.io server handles all live session state. It runs separately from Vite.

- [ ] **Initialize Node.js server** — `Code`
  - Owner: Dev
  - Inside `server/`:
    - `npm init -y`
    - `npm install express socket.io`
    - `npm install -D typescript ts-node @types/node @types/express @types/socket.io`
  - `server/index.ts` — Express app + Socket.io attached
  - Add `"server:dev": "ts-node server/index.ts"` to root `package.json`

- [ ] **Room management** — `Code`
  - Owner: Dev
  - `server/rooms.ts`:
    - `createRoom(dmSocketId)` → returns a 6-character room code
    - `joinRoom(code, playerSocketId, displayName)` → adds player to room
    - `leaveRoom(code, socketId)` → handles disconnect cleanup
    - Room stores: code, DM socket ID, player list, current game state

- [ ] **Event schema** — `Code` / `Design`
  - Owner: Dev
  - Create `src/networking/events.ts` with typed event definitions (shared between server and client):
    ```typescript
    // Client → Server
    'room:create'       // DM creates a session
    'room:join'         // Player joins by code
    'token:move'        // Request to move a token
    'fog:reveal'        // DM reveals fog tiles
    'dice:roll'         // Player rolls dice
    // Server → Client
    'room:created'      // Returns room code to DM
    'room:joined'       // Confirms join, sends initial state
    'player:joined'     // New player connected
    'player:left'       // Player disconnected
    'state:update'      // Authoritative state broadcast
    ```

- [ ] **Confirm dev setup** — `Config`
  - Owner: Dev
  - `concurrently` or two terminals: `npm run dev` (Vite) + `npm run server:dev` (Socket.io)
  - Client connects to `localhost:3001` (or configured port)
  - Socket.io connection confirmed in browser console

---

## 4. Supabase Backend — P0

Auth, campaign persistence, and file storage.

- [ ] **Create Supabase project** — `Config` — **Ali**
  - Owner: Ali
  - Create a Supabase project at supabase.com
  - Note down: Project URL and `anon` public key
  - Enable Email (magic link) auth
  - Invite-only: disable public signups, enable only magic link

- [ ] **Database schema** — `Config`
  - Owner: Dev
  - Create tables in Supabase SQL editor:
    ```sql
    -- campaigns: one row per DM campaign
    create table campaigns (
      id uuid primary key default gen_random_uuid(),
      owner_id uuid references auth.users,
      title text,
      data jsonb,          -- full campaign JSON
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );

    -- sessions: active play sessions
    create table sessions (
      id uuid primary key default gen_random_uuid(),
      campaign_id uuid references campaigns,
      room_code text unique,
      live_state jsonb,    -- token positions, fog, etc.
      created_at timestamptz default now()
    );

    -- Enable RLS
    alter table campaigns enable row level security;
    alter table sessions enable row level security;
    ```
  - Add RLS policies: users can only read/write their own campaigns

- [ ] **Supabase client config** — `Code`
  - Owner: Dev
  - Create `src/networking/supabase.ts`:
    ```typescript
    import { createClient } from '@supabase/supabase-js'
    export const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    ```
  - Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - Add `.env.local` to `.gitignore`

- [ ] **Invite-only auth flow** — `Code`
  - Owner: Dev
  - `src/ui/auth.ts`:
    - `signInWithMagicLink(email)` — sends magic link via Supabase
    - `onAuthStateChange(callback)` — listens for session
    - Simple login UI: email input + "Send Magic Link" button
  - Confirm: magic link email arrives and logs the user in

---

## 5. Version Control & CI — P1

- [ ] **Git repository** — `Config`
  - Owner: Ali + Dev
  - Create a private GitHub / GitLab repository named `cafe-dnd`
  - Initialize with the project folder

- [ ] **Git LFS for 3D assets** — `Config`
  - Owner: Dev
  - `git lfs install`
  - `git lfs track "*.glb" "*.gltf" "*.hdr" "*.ktx2"`
  - Commit `.gitattributes`

- [ ] **GitHub Actions CI pipeline** — `Config`
  - Owner: Dev
  - `.github/workflows/ci.yml`:
    - Trigger: push to `main` and all pull requests
    - Steps: `npm install` → `npm run lint` → `npm run type-check` → `npm run build`
  - Confirm: CI passes on a clean commit

- [ ] **`.gitignore`** — `Config`
  - Owner: Dev
  - Exclude: `node_modules`, `dist`, `.env.local`, `src-tauri/target`, `.godot`

---

## 6. Dev Environment Documentation — P1

- [ ] **`SETUP.md`** in project root — `Design`
  - Owner: Both
  - Step-by-step for a new developer: prerequisites, clone, install, env vars, run
  - Covers both web (`npm run dev`) and desktop (`npm run tauri:dev`) modes
  - Lists all required environment variables with descriptions
  - Troubleshooting section for common issues (Rust not found, Tauri build fail, Supabase auth not working)

---

## 7. Assets Ali Needs to Provide (for R1, not R0) — P1

*These are not needed for R0. Note them here so sourcing can begin in parallel.*

- [ ] **HDRI environment map** — `Asset` — **P1 for R1**
  - Owner: Ali
  - A warm interior HDRI for Three.js `PMREMGenerator` ambient lighting
  - Can source free from Poly Haven (polyhaven.com) — "studio" or "warm room" type
  - Format: `.hdr` or `.exr`, 4K resolution

- [ ] **"The Basement" room model** — `Asset` — **P1 for R1**
  - Owner: Ali (source or commission)
  - Rectangular room interior: floor, walls, ceiling, wood paneling detail
  - Central table as a **separate mesh object** (required for render-to-texture)
  - 4–8 chairs around the table
  - Style: cozy D&D basement — warm, low-poly acceptable for research version
  - Format: `.glb` with embedded PBR textures (Base Color, Normal, Roughness/Metallic)

- [ ] **UI fonts** — `Asset` — **P1 for R1**
  - Owner: Ali (license decision)
  - Fantasy header font: Cinzel, MedievalSharp, or similar (Google Fonts = free)
  - Body font: Inter, Lato, or similar (Google Fonts = free)
  - Format: `.woff2` in `public/assets/fonts/`

- [ ] **Ambient audio — Basement loop** — `Asset` — **P2 for R1**
  - Owner: Ali
  - 2–3 minute seamless looping ambient: fireplace, distant rain, soft room tone
  - Can source from freesound.org (Creative Commons)
  - Format: `.mp3` + `.ogg` (browser compatibility)

---

## R0 Completion Criteria

Phase R0 is **DONE** when all of these are true:

- [ ] `npm run dev` opens a Three.js canvas in the browser (no errors)
- [ ] `npm run tauri:dev` opens the same canvas in a native desktop window
- [ ] `npm run server:dev` starts the Socket.io server without errors
- [ ] A Supabase magic link auth flow works end-to-end
- [ ] A second developer can clone the repo and be running in under 15 minutes from the `SETUP.md`
- [ ] CI pipeline passes on a clean push to `main`

---

## What Can Be Built Right Now (Without Any Assets)

1. The complete Vite + TypeScript + Three.js scaffold
2. The Socket.io server skeleton with room management
3. The Supabase client config and auth UI
4. The Tauri config and IPC bridge
5. The folder structure and event type definitions
6. The CI pipeline and Git LFS config
7. `SETUP.md`

**~90% of R0 requires zero art assets.** Start immediately.

---

*Next Phase: R1 will need the room model, HDRI, and basic textures. See Phase R1 in the roadmap for the full asset list.*

*Roadmap: Open `roadmap/index.html` in a browser for the full interactive plan.*
