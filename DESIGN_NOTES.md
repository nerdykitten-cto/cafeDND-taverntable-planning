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

*Add new entries below with DN-NNN format. Keep entries short — this is a decision log, not a spec.*
