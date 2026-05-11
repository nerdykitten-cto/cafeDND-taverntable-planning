# Tavern Table / CafeDND — Development Plan & Roadmap

*Document Version: 3.0 · Last Updated: May 2026*

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
│  Stack:  Three.js · Vite · TypeScript · Tauri 2.0 · Rust        │
│  Backend: Socket.io · Supabase · Rapier.js (WASM physics)        │
│  Access:  Internal team + invited playtesters ONLY               │
│  Output:  Browser app (any URL) + native desktop via Tauri       │
├─────────────────────────────────────────────────────────────────┤
│                    FEEDBACK GATE                                  │
│  Threshold: 70%+ of playtest groups prefer CafeDND over their    │
│  current VTT. If gate passes → unlock Track 2.                   │
├─────────────────────────────────────────────────────────────────┤
│  TRACK 2 — PRODUCTION VERSION                       ~19 months  │
│  Stack:  Godot 4.4+ · GDScript / C# · Vulkan / Forward+          │
│  Physics: Jolt Physics · Networking: ENet + WebRTC               │
│  Access:  Public commercial release — Steam + itch.io            │
│  Output:  Windows, macOS, Linux desktop builds (+ web eval)      │
└─────────────────────────────────────────────────────────────────┘
```

### Why Two Tracks?

The Peek mechanic and 3D social table are unproven UX concepts. Before committing ~19 months and a full Godot architecture, the research version validates the core thesis with real users at a fraction of the cost.

- **Three.js + Tauri** ships faster, runs in any browser (zero install), and produces a native Tauri app for download — covering both access modes.
- **Godot** is the right engine for the final product: Vulkan rendering, built-in multiplayer, strong UI system. But it takes longer to iterate on.
- Research findings directly inform Godot architecture decisions, reducing rework.

---

## 3. Track 1 — Research Version

### 3.1 Tech Stack

| System | Technology | Why |
|---|---|---|
| Build Tool | Vite + TypeScript | Fast HMR, modern bundling, strong typing |
| 3D Engine | Three.js r168+ | Runs in any browser, mature, excellent PBR |
| Physics | Rapier.js (WASM) | Best web physics — dice rolling, rigid bodies |
| Rendering | WebGL 2 / WebGPU (future) | Cross-platform, no install required |
| Desktop Wrapper | Tauri 2.0 (Rust) | ~4MB binary vs Electron's ~100MB; better perf |
| Multiplayer | Socket.io + Node.js server | Simple, reliable, team-friendly |
| Backend / DB | Supabase | Auth (magic links), real-time, file storage |
| Audio | Howler.js | Cross-browser audio with Web Audio API |
| Version Control | Git + Git LFS (3D assets) | Standard |

### 3.2 Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  RESEARCH VERSION — CLIENT                                      │
│                                                                 │
│  Browser (any URL)          OR       Tauri Desktop App          │
│  ─────────────────               ─────────────────────         │
│  Three.js WebGL scene            Same web app in native window  │
│  DM View  |  Player View         + Rust IPC for file I/O        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Socket.io Client → Node.js Server (session state sync) │   │
│  │  Supabase Client  → Supabase (auth, persist, storage)   │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 Research Version Phases

| Phase | Title | Timeline | Key Deliverable |
|---|---|---|---|
| R0 | Architecture & Setup | Weeks 1–2 | Full stack running locally for all team members |
| R1 | 3D Room & Core Scene | Weeks 2–4 | The Basement at 60fps in browser |
| R2 | Peek Mechanic & Map System | Weeks 4–7 | Peek transition + fog of war + token movement |
| R3 | Multiplayer & Session Architecture | Weeks 7–10 | Two clients synced in real time |
| R4 | Core Game Systems | Weeks 10–13 | Physics dice + character sheet + initiative |
| R5 | DM & Player Interfaces | Weeks 13–16 | Full DM screen + Player screen working together |
| R6 | Internal Polish & QA | Weeks 16–18 | Tauri packaged, bug-free, survived 2 internal sessions |
| R7 | Closed Playtesting & Feedback Gate | Weeks 18–24 | Go/No-Go decision with 8–15 external groups |

### 3.4 Peek Mechanic — Technical Implementation (Three.js)

The Peek mechanic is the product's signature feature. Three.js implementation:

1. **Table Surface** — `THREE.WebGLRenderTarget` renders the world map scene from an overhead orthographic camera. The render target texture is applied to the table mesh as its map material.
2. **World Scene** — A separate Three.js scene graph containing terrain tiles, tokens, and the 3D landscape. This scene is rendered to the WebGLRenderTarget each frame.
3. **Peek Transition** — A GSAP timeline animates the main camera from seated position, through the table plane, and into the world scene. A stencil/clip plane hides geometry on the wrong side of the transition.
4. **Fog of War** — Custom GLSL fragment shader on the terrain tiles, masking unrevealed areas with a dark mist texture. Fog state is a `Uint8Array` bitfield synced via Socket.io.
5. **Return** — Reverse GSAP animation brings the camera back to seated position.

---

## 4. Track 2 — Production Version (Godot 4.x)

### 4.1 Why Godot for Production

| Criteria | Godot 4.x | Notes |
|---|---|---|
| Licensing | MIT — no revenue share, no runtime fee | Removes all business risk |
| Rendering | Vulkan Forward+ — PBR, GI, volumetric fog | Significantly better than Three.js WebGL |
| Multiplayer | Built-in MultiplayerAPI (RPC, sync, authority) | No third-party dependency |
| UI System | Control nodes — excellent for complex layered UIs | DM dashboard, character sheets |
| Scripting | GDScript + C# | Fast iteration, strong community |
| Physics | Jolt Physics (Godot 4.3+) | Better than Bullet for dice simulation |
| Performance | Native desktop, not browser-constrained | Required for Peek 2.0 quality |

### 4.2 Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCTION VERSION                                              │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  DM Client   │    │Player Client │    │  Server          │   │
│  │  (Godot App) │◄──►│ (Godot App)  │◄──►│  (ENet/WebSocket)│   │
│  │              │    │              │    │                  │   │
│  │ • DM Screen  │    │ • Player     │    │ • State Sync     │   │
│  │ • Map Editor │    │   Screen     │    │ • Auth           │   │
│  │ • Encounter  │    │ • Avatar     │    │ • Persistence    │   │
│  │ • Puzzles    │    │ • Peek       │    │                  │   │
│  │ • World Edit │    │ • Dice       │    │                  │   │
│  │ • DM Tools   │    │ • Chat       │    │                  │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Production Phases

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

### 4.4 Production Notes — Informed by Research

The research version produces a **"Godot Architecture Learnings" document** before G0 begins. This document captures:

- Which Three.js scene structure translated well vs what needed redesign
- Network sync patterns that worked (carry to Godot MultiplayerAPI)
- UI patterns playtests confirmed vs rejected
- Performance bottlenecks encountered in the browser (inform LOD strategy in Godot)
- Player mental models discovered — how players actually think about the Peek mechanic

This is the compounding return on the research investment.

---

## 5. The 3D Environment — "The Table"

### 5.1 Environment Design

The core experience is a warm, lived-in 3D room. Implemented first in Three.js, then ported and enhanced in Godot.

**Room Presets (DM selectable):**

| Preset | Description |
|---|---|
| **The Basement** | Classic suburban D&D den. Wood paneling, posters, pizza boxes, bookshelf of rulebooks |
| **The Tavern Backroom** | Fantasy-themed. Stone walls, candlelight, tankards, roaring fireplace |
| **The Study** | Academic's office. Dark wood, leather chairs, maps pinned to walls, inkwells |
| **The Restaurant Booth** | Modern. Diner-style booth, menus stacked aside, ambient restaurant chatter |
| **Custom** | DM swaps props, lighting preset, and ambient audio track |

Research version ships with **The Basement only**. Additional presets added in Godot G6.

### 5.2 The Peek Mechanic

The signature feature. The table surface acts as a portal into the campaign world.

1. **Default View** — Table surface shows a top-down tactical map with tokens and fog of war
2. **Peek Mode** — Camera smoothly transitions through the table plane into a 3D landscape below
3. **The Landscape** — Terrain based on the DM's map: hills, forests, dungeons, cities
4. **Fog of War in 3D** — Unexplored areas shrouded in mist; players only see revealed territory
5. **Return** — Camera transitions back to seated position

Research version: Three.js WebGLRenderTarget + GSAP animation
Production version: Godot SubViewport + VoxelGI/SDFGI fog + Tween

---

## 6. Data Architecture

```
Campaign Data
├── campaign_meta.json      — Title, setting, session log
├── maps/                   — Tile grids, heightmaps, prop positions
├── encounters/             — Enemy sets, initiative configs, wave rules
├── puzzles/                — Puzzle definitions, solutions, hints, chains
├── characters/             — Player character sheets (5e data model)
├── npcs/                   — NPC cards, dialogue, relationships
├── loot_tables/            — Weighted item tables, treasure configs
├── notes/                  — DM session notes (tagged, searchable)
└── assets/                 — Custom tokens, portraits, audio files
```

**Persistence:**
- Research version: Supabase (cloud) + Tauri file I/O (local JSON)
- Production version: Local Godot Resources + Supabase cloud sync

---

## 7. Technical Specifications

### 7.1 Research Version — Browser Requirements

| Component | Minimum | Notes |
|---|---|---|
| Browser | Chrome 100+ / Firefox 100+ / Safari 16+ | WebGL 2.0 required |
| GPU | Any with WebGL 2.0 support | Integrated graphics acceptable |
| RAM | 4 GB | 8 GB recommended |
| Network | 5 Mbps up/down | For multiplayer sessions |

### 7.2 Production Version — Desktop Requirements

| Component | Minimum | Recommended |
|---|---|---|
| OS | Windows 10 / macOS 12 / Ubuntu 22+ | Latest |
| CPU | Intel i5-8400 / Ryzen 5 2600 | i7-10700 / Ryzen 7 3700X |
| GPU | GTX 1060 / RX 580 (Vulkan required) | RTX 3060 / RX 6700 XT |
| RAM | 8 GB | 16 GB |
| Storage | 2 GB base | SSD recommended |
| Network | 5 Mbps | 10+ Mbps |

### 7.3 Target Performance

- **Research version:** 60fps in Chrome on GTX 1060 equivalent; 30fps on integrated graphics
- **Production version:** 60fps table view, 30fps minimum in Peek mode with full terrain

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Concept doesn't resonate** — Peek mechanic falls flat | Medium | Critical | Research version validates before Godot investment |
| **Three.js performance ceiling** — Peek too heavy in browser | Medium | Medium | LOD system; fallback to 2D map if needed; Tauri helps |
| **Networking complexity** — desyncs, state corruption | Medium | High | Socket.io for research; Godot built-in sync for production |
| **Scope creep** — "just one more tool" | High | High | Phase gates. MVP first. |
| **Feedback gate fails** — research results inconclusive | Low-Med | Critical | Minimum 15 tester groups; structured questions; clear threshold |
| **Tauri platform issues** — macOS notarization, etc. | Low | Medium | Budget time for code signing on all platforms |
| **Godot 4 maturity** — engine bugs | Low-Med | Medium | Stay on stable releases; research buys time for Godot to mature |
| **Legal — D&D IP** | Low | High | Use only SRD / OGL / Creative Commons content |

---

## 9. Team Recommendations

### Research Phase (Tracks 1)

| Role | Count | Focus |
|---|---|---|
| **Lead Developer** | 1 | Three.js architecture, networking, Tauri integration |
| **3D/UI Developer** | 1 | Room environment, Peek implementation, UI components |
| **Backend Developer** | 0.5 | Socket.io server, Supabase integration |
| **QA / Playtesting Lead** | 0.5 | Internal QA, beta coordination, feedback synthesis |

**Minimum viable research team: 2 developers + part-time QA.** Claude can assist with ~60% of the web code.

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

## 10. Monetization

*Research version is closed — no monetization.*

**Production version (post-Early Access):**

- **Premium Purchase** — One-time buy on Steam ($20–30). DM buys the full version; players join free or buy a cheaper "Player Edition."
- **Cosmetic DLC** — Room themes, avatar outfits, dice skins. Purely cosmetic, never gameplay-gating.
- **Campaign Marketplace** — Revenue share on community-created campaigns, maps, puzzle packs.
- **Subscription (Optional)** — Cloud hosting for persistent servers, extra storage, priority support.

> The D&D community will not tolerate pay-to-win or content-gating DLC. Do not do it.

---

## 11. Success Metrics

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

## 12. Summary

**CafeDND / Tavern Table** is built in two phases: a research version to validate the concept, then a production version to commercialize it.

The research version (Three.js + Tauri) ships in ~6 months and answers the most important question: *do real D&D players want to sit at this table?* It runs in any browser — no install, no commitment for testers. The Tauri desktop app gives team members a native experience.

If the feedback gate passes, the Godot production version begins — informed by months of real usage data, with far fewer architectural unknowns.

The Peek mechanic is the product's soul. Everything else is tooling around it.

**Build the table first. Make it feel right to sit at. Everything else follows.**

---

*Document Version: 3.0*
*Last Updated: May 2026*
*Research Stack: Three.js + Vite + Tauri + Rust*
*Production Stack: Godot 4.x*
*Codename: Tavern Table / CafeDND*
