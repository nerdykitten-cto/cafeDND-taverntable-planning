# Tavern Table — Design Notes

*Decisions, additions, and intentions that expand or adjust the plan. Date-stamped. Linked to the roadmap phase where each item lands.*

---

## DN-001 · Tavern Room Variant

**Logged:** 2026-05-12
**Roadmap target:** R5 (Research), G6 (Production)
**Status:** ✅ Built in R5 (Research) — Tavern Backroom variant selectable in the lobby. Production (G6) still pending.

### What
A second selectable room environment: **The Tavern Backroom** (working title).

Warm pub interior — stone walls, rough wooden beams, a fireplace on one wall, hanging lanterns, scattered tankards and candles. The table is the same physical table in the same position; only the surrounding room geometry, materials, and props change.

### Why
The Basement communicates "D&D den" clearly. But not every campaign tone matches that setting. A Tavern backroom is the single most recognisable D&D starting location — it deserves to be the second room.

Having two rooms also validates the room-switching architecture before committing to more environments in production.

### How it fits
- **R5:** DM selects the room in the lobby before starting a session. Room choice is stored in session state and broadcast to all clients on join. Both rooms share all game systems — only the Three.js scene geometry, materials, and prop layout differ. A `RoomVariant` enum (`'basement' | 'tavern'`) is passed to `RoomScene` (or a factory function) to switch the build path.
- **G6 (Production):** The Tavern becomes one of four+ polished Godot environments (alongside Scholar's Study, Restaurant Booth, etc.), with full Vulkan lighting, PBR materials, and ambient audio per room. The R5 version validates the concept and informs the production art direction.

### Design notes for the Tavern
- Fireplace on the back wall — PointLight with flickering animation (sine-wave intensity variation)
- Stone walls: darker, rougher material than The Basement's wood panelling
- Hanging lanterns from ceiling beams — additional warm PointLights
- Fog should feel slightly smokier (marginally higher `FogExp2` density than The Basement)
- Background audio: "Tavern Noise" track (already named in the audio controller plan)

---

## DN-002 · Day/Night Atmosphere Switch

**Logged:** 2026-05-12
**Roadmap target:** R5 (Research), G5 (Production)
**Status:** ✅ Built in R5 (Research) — `RoomScene.setAtmosphere()` 3s GSAP lerp, DM Night/Day toggle broadcast via `atmosphere:set`. Full time-of-day (G5) still pending.

### What
A DM-controlled toggle in the Session Settings panel that switches the active room between two lighting presets: **Night** and **Day**.

- **Night** (default): current Basement state — warm amber candlelight, low ambient, deep fog. This is the default for all rooms.
- **Day**: cooler ambient fill (simulated window light), raised overall brightness, reduced candle intensity, lighter fog density. Communicates "daytime session" or "bright interior."

### Why
Session atmosphere matters. A morning investigation scene feels different from a midnight dungeon crawl. Giving the DM a one-button atmosphere shift — without leaving the app — is a small addition with high expressive value.

Day/Night is also the simplest possible version of dynamic lighting, which de-risks the full time-of-day system planned for G5.

### How it fits
- **R5:** DM presses a toggle in the Session Settings panel. The client lerps all scene light intensities, ambient light color, and `FogExp2` density between the Night and Day presets over 3 seconds. The transition is broadcast to all connected clients so everyone sees it simultaneously. Implementation: a `setAtmosphere(preset: 'night' | 'day', duration: number)` method on `RoomScene` that GSAP-tweens the relevant Three.js properties.
- **G5 (Production):** Expands into full time-of-day (sunrise → noon → dusk → night), dynamic weather (rain, fog, snow), and volumetric effects via Vulkan. The R5 simple lerp validates player response to atmosphere changes before committing to the full system.

### Implementation sketch (R5)
```typescript
// Lighting presets per room variant
const ATMOSPHERE = {
  night: { ambientIntensity: 0.18, candleIntensity: 0.95, lampIntensity: 1.6, fogDensity: 0.13 },
  day:   { ambientIntensity: 0.55, candleIntensity: 0.25, lampIntensity: 0.6, fogDensity: 0.06 },
}
// RoomScene.setAtmosphere() uses gsap.to() to tween each value over `duration` seconds.
// Socket event: dm emits 'atmosphere:set' → server broadcasts → all clients call setAtmosphere().
```

---

## DN-003 · Dynamic Theme & Asset Library (GLB/GLTF)

**Logged:** 2026-05-12
**Roadmap target:** R5 (Research — DM interfaces), G3+ (Production — full asset pipeline)
**Status:** ✅ Wired in R5 (Research) — `WorldScene.setAssetLibrary()` + `addProp()` load GLBs via `modelUrl` with procedural fallback. No GLB art exists yet, so procedural geometry remains the active path until models are dropped into `/public/assets/`. Production pipeline (G3+) still pending.

### What
A runtime asset library that loads **GLB/GLTF 3D files** and routes them into the scene dynamically. Covers four asset kinds:
- **Props** — environmental objects (trees, boulders, torches, chests, barrels, …)
- **Characters** — player figures and NPC models (fighter, rogue, goblin, …)
- **Maps** — pre-built tile-grid layouts (Dungeon Room, Forest Path, Tavern Interior)
- **Rooms** — full environment swaps (The Basement, Tavern Backroom, …)

Each asset has a `ThemeId` tag. The DM picks a theme at session start; the library preloads only that theme's assets upfront and falls back to procedural meshes while models are loading.

### Why
Procedural Three.js geometry covers development scaffolding but is not the end product. Real campaigns need:
- Character figures that match player portraits
- Maps that match the scenario (dungeon room vs. forest path vs. tavern)
- Room environments that match the session tone (DN-001)

GLB/GLTF is the correct format: it's the Three.js native format, supports PBR materials, Draco compression, animations, and embedded textures. KTX2 texture compression lands alongside it for performance (R6 perf pass).

### How it fits
- **R2 (Now):** `PropDescriptor.modelUrl?: string` is a typed placeholder field. `AssetLibrary` class and `ASSET_MANIFEST` are stubbed in `src/assets/assetLibrary.ts` with correct types. Procedural meshes are the active code path — `modelUrl` is accepted but not yet loaded.
- **R5:** DM prop picker panel queries `AssetLibrary.listByKind('prop', theme)`. Selecting a model sets `modelUrl` on the descriptor. `WorldScene.addProp()` and `RoomScene._buildMiniature()` check `modelUrl` and call `AssetLibrary.load(url)` if set, falling back to procedural geometry if the load fails.
- **R5 (map):** DM can select a pre-built map layout from a dropdown. Loads a `kind: 'map'` GLB as a replacement for the default tile grid.
- **G3+ (Production — Godot):** All assets move to a managed CDN. The `AssetLibrary` pattern maps directly to Godot's `ResourceLoader` and `PackedScene` system.

### File structure (when art lands)
```
public/
  assets/
    props/
      tree-oak.glb
      boulder.glb
      torch-wall.glb
    characters/
      fighter-m.glb
      rogue-f.glb
      goblin.glb
    maps/
      dungeon-room.glb
      forest-path.glb
      tavern-inn.glb
    rooms/
      basement.glb
      tavern.glb
    draco/        ← Draco WASM decoder (copied from three/examples/jsm/libs/)
```

### Key constraint
`AssetLibrary` is a Lane A concern (scene/renderer). Lane B (systems) references `AssetDescriptor` types only — never the loader directly. Lane C (networking) may send `modelUrl` as part of a prop sync payload. Lane D (UI) queries `listByKind()` to populate the prop picker.

---

## DN-004 · Relay Is the Universal Connection Path (Production Site)

**Logged:** 2026-07-11
**Roadmap target:** R6 (Research)
**Status:** Decided — implement/verify during R6

### What
From the hosted HTTPS site, the tavern-relay (TLS, `wss://`) is the **only supported path** to any game host that isn't `localhost`. The DM may run the host anywhere — own machine, a second LAN machine, or a rented server — and in every case internet/HTTPS-site players connect through the relay using the TT-XXXX code.

### Why
Browsers block a secure (HTTPS) page from opening plain `ws://` connections to non-localhost addresses (mixed content). Direct host-address connections from the production site would therefore fail for LAN and rented-server hosts unless each DM provisioned his own TLS certificate — tester-hostile. The relay already carries TLS once, for everyone.

### How it fits
- The lobby's direct host-address field remains a dev/LAN convenience when the client itself is served over plain http (local dev).
- Rented-server DMs start the host with `RELAY_URL` pointing at the public relay and share the TT-code — no certificates on their box.
- R6 tasks (roadmap data.js) include verifying all three host placements from the live site.

---

## DN-005 · Mid-Session Join — Open Decision

**Logged:** 2026-08-17 (spec audit)
**Roadmap target:** R5C (Research)
**Status:** ⚠️ OPEN — needs Bilal's call before R5C is implemented

### What
Today, once a room moves to `phase: 'active'`, only a **known name** can enter: `joinRoom()` matches an existing player entry (reconnect / nav-race) or the stored `dmName`, and rejects everyone else with *"Room not found or already in progress."* (`server/session.ts`, active-phase branch). A player who was not accepted before **Start Session** cannot get in at all — the DM must close the lobby and restart to add them.

### Why it matters
PROD_DESC describes joining as "enter the code and wait for DM approval" with no timing caveat, and test sessions are exactly where a tester shows up ten minutes late. The current behaviour is a deliberate simplification, not a bug — but it is undocumented and it will bite during R5C tester waves.

### The three options
1. **Keep as-is** — document the limitation in the R5C tester README ("everyone must be in the lobby before the DM starts"). Zero code.
2. **Late join via the same approval gate** — active-phase `room:join` from an unknown name creates a pending request; the DM sees a toast plus an entry in the DM screen's Party section and accepts/rejects. New arrival takes the lowest free seat and receives the full `session:state` sync. Respects the 4-player cap.
3. **Late join always allowed** (no approval once the build key has been checked) — cheapest, but it removes the DM's second gate, which the R5C access-control model leans on.

**Recommendation:** option 2 — it reuses the pending-request machinery that already exists for the waiting phase, and it keeps the DM gate that R5C's build-key model depends on.

---



## DN-006 · Web Build Is the Product (Godot Demoted to Contingency)

**Logged:** 2026-08-18
**Roadmap target:** All phases (strategy-level)
**Status:** Decided — restructure in progress

### What
The Web-Research build (`Projects/CafeDND/Tavern-Table`, Three.js + Vite + Socket.io) is no longer a throwaway validation vehicle. It **is the product** and will carry through to final public release. The Godot production track (G0–G7) is demoted from "Track 2, unlocked by the feedback gate" to a **contingency path**: it activates only if the web stack hits a technical limitation that demonstrably blocks the product vision (rendering ceiling, physics scale, platform requirements) and that cannot be engineered around in the browser/Tauri stack.

### Why
- R0–R5A proved the web stack can deliver the core fantasy: Peek, seated presence, physics dice, DM-as-host networking — all running today in the browser.
- A full Godot rewrite (~19 months, new team shape) duplicates everything for speculative quality gains, while the web build reaches players with zero install on day one.
- Tauri (R8) already provides the native-desktop story when needed.

### Consequences
- The **feedback gate changes meaning**: 70%+ tester preference is no longer the "unlock Godot" trigger — it is the **go/no-go for public launch of the web product**.
- Post-R8 phases will be defined for the web product (polish, content, commercialization) instead of handing off to G0. Roadmap restructure to follow using the `dnd-5e-knowledge` and `game-design-pro` skills.
- The G0–G7 phase definitions are retained in the plan/roadmap as the documented contingency, clearly labeled.
- "Godot Architecture Learnings" handoff doc is cancelled as a deliverable; its purpose (capture what works) folds into ongoing design notes.

---

## DN-007 · Brand Architecture — CafeD&D ⊃ TavernTable

**Logged:** 2026-08-18
**Roadmap target:** All docs; product UI at next branding pass
**Status:** Decided

### What
- **CafeD&D** is the **brand/umbrella** — a family of D&D-related tools and games. (Official spelling "CafeD&D"; "CafeDND" remains the filesystem/repo-safe form so folder names don't break.)
- **TavernTable** is the first product under the brand: the game where people play D&D as DM and Players at the 3D table.
- Future CafeD&D products link into TavernTable rather than bloating it, e.g.:
  - **Avatar customization tool** — Players/DMs customize both their table-room avatar and the character they roleplay.
  - **DM campaign builder** — standalone tool for authoring campaigns (maps, encounters, NPCs, notes) that load into TavernTable sessions.

### Why
Keeps TavernTable focused on being *the table*, while giving the heavy creation/customization workflows their own homes. One brand, multiple sharp tools, shared accounts/data later (Supabase era).

### Consequences
- Docs should say "TavernTable (a CafeD&D product)" not "Tavern Table / CafeDND codename".
- Features that are really companion-tool material (full avatar creator, deep campaign authoring) get scoped OUT of TavernTable phases and parked under the brand's future tool list.
- "Tavern Table" (two words) is deprecated spelling → **TavernTable**.

---

*Add new entries below with DN-NNN format. Keep entries short — this is a decision log, not a spec.*
