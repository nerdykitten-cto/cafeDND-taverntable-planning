# TavernTable — R5 Extension Phases (R5A–R5E)

*Document Version: 1.0 · Created: 2026-07-13 · Owner: Bilal*

---

## Why this document exists

R1–R5 were merged with their **backend/data halves complete but several experience-defining tasks from the original phase cards left unbuilt** (audited 2026-07-13). R6 (Website Launch) is **postponed** until this series closes those gaps. Each phase below is sized for one focused work session and follows the approval-gated workflow.

**Position in roadmap:** after R5 (done), before R6 (Website Launch & QA). R7/R8 unchanged.

---

## Workflow protocol (every phase)

1. Fresh chat session — paste the phase kickoff prompt (template at bottom).
2. Session reads memory, `SUMMARY.md`, `cafe-dnd-web/CLAUDE.md`, and this document.
3. Branch `R5X-<ShortName>` off local `main`. All commits stay on the branch.
4. Implement → smoke-test (`npm run type-check` zero errors + `dev:all` clean + manual golden path, live browser verification with Playwright where UI is involved).
5. Present the phase gate checklist and **STOP. Merge to `main` only on explicit user approval.**
6. After approval: merge `--no-ff`, update `SUMMARY.md` + memory, mark the phase done here, prep the next phase's kickoff prompt.
7. Never push unless asked; pushes go to remote branch `nerdcats_lclwork`, never `origin/main`.

---

## Standing decisions (apply to all phases)

- **Dice authority:** server-authoritative number (existing `crypto.randomInt` roll); the physics animation *lands on* the server's result (dice snap/orient to the correct face on settle). Chosen because physics-decides diverges across clients and is cheatable. *Override requires Bilal's sign-off.*
- **Character sheet UI: PARKED** by user instruction. Only the server-side `defaultSheet()` auto-create (R5D) is in scope — no sheet editor panel.
- **Hosted website: deferred to R6.** Test distribution = zip / private GitHub (R5C). During this era testers run the client locally (http/localhost), so the DN-004 mixed-content restriction does not apply — direct connection to a port-forwarded DM host is a supported test-phase path alongside the relay.
- **Access control (test phase):** shared build key baked into each distributed build (R5C). Known limitation: extractable by anyone holding the build — it blocks strangers, not leak-holders. Mitigations: rotate key per distribution wave; DM manual join-approval remains the second gate. Per-user invite keys arrive with Supabase at R7.
- **Hosted relay service:** standing a public relay run by the team (for the security of the product and its users) is a **team decision** — implement it if/when the team agrees it is needed (expected at R6 per DN-004). Until then the test phase runs on LAN / port-forward direct / DM-self-hosted relay, all gated by the build key.
- **Avatars (research version):** simple procedural stick-figure/low-poly humanoids only — one distinct look for the DM, one for Players. Full avatar creator stays at Godot G3.

---

## R5A — Seats, Cameras & Avatars

**Debt source:** R1 "Seated camera system" (never seat-bound); R3 `seatIndex` (unused by rendering). Avatars: new scope per user decision 2026-07-13.

**Goal:** sitting at the table becomes literal. Every participant occupies their chair, sees the room first-person from it, and sees everyone else as a body in a chair — not a floating ghost camera.

**Tasks:**
- Seat assignment: bind each connected player to a seat via existing `Player.seatIndex` (DM = seat 0, head of table). Handle joins/leaves/reconnects re-using the existing player list — no new socket events expected.
- First-person seated camera: positioned at head height of *your own* seat, initial orientation per the seat's `yRotation`. Mouse head-look clamped (suggested: yaw ±75°, pitch +20°/−35°), no translation, no zoom. Replaces free OrbitControls in room mode.
- Peek unchanged — exiting Peek restores your exact seat view.
- Stick-figure avatars (procedural, Lane A): seated pose at each occupied seat. **DM variant:** hooded/robed silhouette, gold (#8B6914) trim. **Player variant:** simple adventurer silhouette, moss (#4A5E3A) trim. No GLB dependency.
- Own avatar hidden from own camera (or headless body if a lap/hands view is trivial).
- Nameplate billboard above each avatar (Patrick Hand, paper/ink palette).
- Disconnected player → avatar dims to ghost until reconnect/expiry.

**Gate:** join as a player: you are IN a chair, the DM and other players are visibly seated around you, and looking around feels like moving your head — not flying a drone.

**Status:** ✅ Complete (merged to local `main` 2026-07-14, Session 13). Notes: look mode is an L-key toggle (user decision) — HUD fades, relative mouse steering, window-size-scaled speed; 4-player cap added (research-build policy, dynamic chairs at live release); fixed pre-existing duplicate-seat server bug. Camera-feel fixes (180° flip, steering) verified live with the user before merge.

---

## R5B — Physics Dice Experience

**Debt source:** R4 tasks "3D dice models d4–d20", "Throw animation", "Face-up detection" — physics world shipped, nothing visible ever rolled. R4 gate unmet.

**Goal:** rolling dice is the game's tactile joy. Click d20 → real dice tumble across the table in front of your seat → settle → the number everyone was told matches the face everyone sees.

**Tasks:**
- Procedural 3D dice meshes: d4, d6, d8, d10, d12, d20 (d100 rendered as a d10 pair). Numbered faces (canvas-texture or simple decals), paper/ink material palette.
- Wire the existing Rapier `dice-world.ts`: spawn dice above the table near the roller's seat; throw = randomized impulse + angular velocity.
- Sync presentation: broadcast the roller's throw parameters; every client simulates locally; **on settle, every die snaps/orients to the server's authoritative result** (covers cross-client physics divergence by design).
- Face-up detection via the existing face-normal scaffold — used to compute the orientation correction, not the result.
- Result reveal: the existing dice-flash + chat line now fire when the dice settle (not on socket receive). Dice fade out ~4s after settle.
- Dice-clatter SFX hook through the existing `AudioController` (silent until audio files land).

**Gate:** R4's original gate — *"Do the dice feel satisfying enough that players roll them for fun, not just to get a number?"*

**Status:** ⬜ Not started

---

## R5C — Access Key & Test Distribution

**Source:** user decisions 2026-07-13 (build-key mutual auth; zip/GitHub distribution instead of hosted site).

**Goal:** only people we gave the build to can even knock on a DM's door, and a non-technical tester can go from "received a link" to "sitting at the table" using only a README.

**Tasks:**
- Shared build key: `BUILD_KEY` injected at build/run time (env). Client presents it in the Socket.IO handshake (`auth` payload); host verifies **before** a join request reaches the DM's pending list; mismatch → polite rejection. `tavern-relay` optionally enforces the same key at the switchboard.
- Key rotation procedure documented (new key per distribution wave).
- **Mid-session join** — resolve [DN-005](../DESIGN_NOTES.md) first (open decision). If option 2 is chosen: active-phase joins from an unknown name become pending requests the DM accepts from the DM screen, seat via `nextFreeSeat()`, full `session:state` on accept, 4-player cap respected. If option 1: document the "everybody in the lobby before Start Session" limitation in the tester README. *(Spec audit 2026-08-17.)*
- **CI pipeline** — R0 task never built (no `.github/` in the repo): GitHub Actions running `lint`, `type-check`, `build` on push. Lands here because this is the phase that first produces a distributable build. Also clear the two standing lint errors (`src/profile.ts` unused `_h`, `src/input.ts` unused expression) so the lint job can gate. *(Spec audit 2026-08-17.)*
- Packaged test build: one script produces a zip — built static app + tiny local server + `run.bat`/`run.sh` + tester README (how to run, how to join by room code / relay code).
- GitHub alternative: private repo layout + pull-and-run instructions for technical testers.
- DM connectivity guide: LAN direct, port-forward direct, self-hosted relay, our relay — when each applies (test-phase local clients are exempt from mixed-content).

**Gate:** a tester with no dev tools runs the zip on a clean machine and joins a session in under 5 minutes, README only. A stranger without the build key cannot reach the DM's approval list.

**Status:** ⬜ Not started

---

## R5D — Comms & Dice QoL

**Debt source:** R5 tasks "chat: IC/OOC channels, whispers", "dice tab: quick-roll presets, roll history". Plus the parked sheet auto-create.

**Tasks:**
- Chat channels: in-character / out-of-character toggle; whisper-to-player; whisper-to-DM (payload types already exist in `shared/types.ts`).
- Roll history panel (session-scoped) + quick-roll presets (common die combos).
- Server auto-creates `defaultSheet()` per player on session start — unblocks the DM's Set-HP/conditions tools and the player HP panel. **No sheet editor UI** (parked).
- Notification/toast polish for whispers and channel activity.
- **Player bottom bar** — R5 spec'd "bottom bar (Character, Dice, Chat tabs)"; what shipped is a floating chat bubble with the dice tray inside the chat dock and no character entry point at all. Build the bar as the player's single home for the three tabs. Pairs naturally with the `defaultSheet()` auto-create above, which is what finally gives the Character tab something to show. *(Spec audit 2026-08-17.)*

**Gate:** a table conversation (including a DM secret whisper) flows without any external tool; DM can damage a player and both see the HP bar move.

**Status:** ⬜ Not started

---

## R5E — DM Toolset

**Debt source:** R5 tasks "map editor panel", "encounter panel", "DM notes", "basic NPC manager".

**Tasks:**
- Map editor panel: terrain tile palette (paint existing `TileType`s), prop placement from the asset manifest, token library.
- Encounter panel: enemy list with HP/conditions, add/drag into the initiative order.
- DM notes: plain-text scratchpad, auto-saved locally every 30s.
- Basic NPC manager: name/stats card, "display dialogue to all players" action.
- **GLB pipeline completion (DN-003 remainder)** — `assetLibrary.ts` uses a bare `GLTFLoader`; the R1 task "GLTFLoader + Draco compression + KTX2 textures" was never finished. Wire `DRACOLoader` + `KTX2Loader` here, where the prop picker first makes the DM load real GLBs, and land the first real assets in `/public/assets/models/` (all four asset dirs are still empty). *(Spec audit 2026-08-17.)*

**Gate:** R5's original gate — *"Can a DM who has never used the app run a 30-minute session after a 5-minute introduction?"*

**Status:** ⬜ Not started

---

## Spec audit — 2026-08-17

A full spec-vs-build pass (static read of every completed phase card plus a live two-client run) found ten items that were **not** covered by R5A–R5E. Everything already tracked by this series was confirmed correctly absent; nothing marked ✅ was found broken. Disposition of the ten:

| # | Finding | Disposition |
|---|---|---|
| 1 | Day atmosphere preset rendered **darker** than Night (contradicts DN-002) | ✅ Fixed on `fix/spec-audit-R5` |
| 2 | Mid-session join hard-rejected once the room is active | → **R5C**, blocked on [DN-005](../DESIGN_NOTES.md) |
| 3 | CI pipeline (R0 task) never built; 2 standing lint errors | → **R5C** |
| 4 | Draco/KTX2 never wired (R1 task); asset dirs empty | → **R5E** |
| 5 | Player bottom bar (Character/Dice/Chat tabs) never built (R5 task) | → **R5D** |
| 6 | Lobby did not prefill the name from the saved profile | ✅ Fixed on `fix/spec-audit-R5` |
| 7 | `favicon.ico` 404 on every page | ✅ Fixed on `fix/spec-audit-R5` |
| 8 | three r184 deprecations: `THREE.Clock`, `PCFSoftShadowMap` | ✅ Fixed on `fix/spec-audit-R5` |
| 9 | **Loot Tables** listed in PROD_DESC but in no phase card | ✅ Resolved — NOT cut; inventory + loot needs a phase home (see below) |
| 10 | Plan §3.3 status table stale (showed R4a "Next Up") | ✅ Fixed in this repo |

**#9 — Loot Tables. DECIDED 2026-08-17 (Bilal): NOT cut.**

PROD_DESC lists "Loot Tables — randomized loot generation, drag results to player inventories" in the DM feature set, but no research phase card (R0–R8) ever carried the task, and there is no inventory model anywhere in the codebase to drop loot into.

The original audit recommendation was to cut it to the Godot track. **That recommendation is rejected.** The loot manager is an important part of an inventory model that the Research plan simply never scoped. Treat **"inventory model + loot" as one real feature needing a phase home** — not a droppable extra, and not a chat-only consolation version.

Under DN-006 (the web build is the product) this is no longer deferrable to Godot at all: whatever ships here ships to players. Placement is open — it is a candidate for the roadmap phase-card restructure rather than a bolt-on to R5E. Design it with `/game-design-pro` and source item/rarity rules through `/dnd-5e-knowledge` (SRD 5.1 content only in shipped product).

Art/audio absence (no GLBs, no audio files, both subsystems no-op) is a known, deliberate state and is not counted above. The R1 gate ("does the room say D&D basement?") and R2 gate ("does Peek make you say whoa?") both remain unmet at the current art level for that reason.

---

## After the series

**R6 — Website Launch & QA** resumes (hosted client + relay per DN-004), then R7 (Supabase + closed playtesting, per-user invite auth replaces the build key), R8 (Tauri installs). Sync `roadmap/data.js` with this series when R5E closes.

---

## Kickoff prompt template (paste into each fresh session)

```
We are starting Phase {PHASE_ID} — {PHASE_NAME} for CafeDND / TavernTable.

Context first: read your memory files, SUMMARY.md (latest sessions),
cafe-dnd-web/CLAUDE.md, and CafeD&D_TavernTable_PLANS/
TavernTable_R5_Extension_Phases.md (the {PHASE_ID} section is your scope;
the Standing Decisions section is binding).

Git rules (strict):
- Branch {PHASE_ID}-{ShortName} off local main; all commits stay there.
- When done: run the smoke-test gate, present the phase gate checklist,
  and STOP. Merge to main only after I explicitly approve.
- Never push unless I ask; pushes go to remote branch nerdcats_lclwork,
  never origin/main.

Scope: implement the {PHASE_ID} task list. Do not pull tasks from later
phases without asking. Character-sheet editor UI is parked. Hosted-site
work is deferred to R6.

Start by proposing an ordered implementation plan for my approval before
writing code.
```
