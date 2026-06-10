# Tavern Table — Product Description

*Codename: CafeDND · Document Version: 1.0 · May 2026*

---

## What Is Tavern Table?

Tavern Table is a 3D virtual tabletop (VTT) platform for playing Dungeons & Dragons and other tabletop RPGs online. Unlike existing VTT tools that present a flat, bird's-eye grid on a screen, Tavern Table places every player inside a richly detailed 3D room — seated around a real physical table with their own customizable avatar, surrounded by candles, books, and the ambient sounds of the setting.

The table itself is the product's soul. Its surface is not just decoration: it acts as a portal into the campaign world below.

---

## The Core Experience

### The Room

Players join a session and find themselves seated at a table in a 3D environment — initially "The Basement," a warm, lived-in D&D den with wood paneling, dim lamps, bookshelf rulebooks, and scattered pizza boxes. Other players' avatars sit across the table. The DM's seat is at the head. The atmosphere communicates "we're here to play" before a single die is rolled.

### The Table Surface

The top of the table renders a live tactical map — a top-down view of the current encounter area, complete with terrain, tokens representing each character and enemy, and a fog of war covering unexplored territory.

### The Peek Mechanic

This is what separates Tavern Table from every other VTT.

A player or DM activates **Peek** — and the camera smoothly animates downward, through the surface of the table, emerging inside a fully realized 3D landscape beneath it. Rolling hills, forest canopies, dungeon corridors, or the spires of a city appear below you. Fog of war in this view manifests as actual mist, shrouding unexplored territory in mystery.

The player is now literally *inside* the world map. They can look around, observe, and orient themselves — then transition back to the table with a reverse animation.

This mechanic makes the campaign world feel inhabited and real in a way no 2D map tool can achieve.

---

## Who It Is For

- **DMs** who want a tool that handles the full session — maps, encounters, initiative, NPC dialogue, ambient audio, notes — without leaving the app.
- **Players** who want to feel present at the table with their friends, not staring at a flat grid.
- **Groups** who play online regularly and are willing to try something better than Roll20 or Foundry if it genuinely improves the experience.

The target player has probably used Roll20, Foundry VTT, or Owlbear Rodeo. They know the limitations. Tavern Table is the product that addresses the core complaint: *it doesn't feel like you're actually there.*

---

## What Makes It Different

| Feature | Roll20 / Foundry | Tavern Table |
|---|---|---|
| Environment | Browser grid on flat canvas | Fully 3D room with atmosphere |
| Map | 2D image with tokens | 3D live-rendered tactical map |
| Peek Mechanic | Not present | Signature camera dive through table into 3D world |
| Avatars | Profile pictures | 3D character models seated at the table |
| Atmosphere | User-supplied background image | Curated 3D rooms with ambient audio and lighting |
| Desktop App | Browser only or Electron (heavy) | Tauri native app (~4MB binary) or browser |

---

## The Two Platforms

### Research Version (Current Build Target)

The first version of Tavern Table is built with web technology and delivered as both:

- A **browser application** — accessible at any URL, no installation required
- A **native desktop application** via Tauri — lightweight (~4MB), native performance, local file I/O

This version is closed to the public. It will be tested by invited D&D groups to validate the concept before a full production version is committed to.

**Technology:** Vite + TypeScript + Three.js + Socket.io + `tavern-relay` (custom WS relay) + Tauri 2.0 (Rust, R8) + Supabase (R7 only)

### Production Version (Post-Validation)

If the research version passes its feedback threshold (70%+ of test groups prefer it over their current tool), a full production version will be built in the Godot game engine. This version targets:

- Commercial release on **Steam** and **itch.io**
- Windows, macOS, and Linux desktop builds
- Vulkan rendering for dramatically better visual quality
- Built-in multiplayer (no third-party socket server)

---

## Core Feature Set (Research Version)

### For the DM

- **Map Editor** — Place terrain tiles, props, and tokens on the table map
- **Fog of War Controls** — Reveal areas as players explore; fog hidden areas automatically
- **Token Management** — Place, move, and label all character and enemy tokens
- **Encounter Panel** — Enemy HP tracking, conditions, and initiative order management
- **DM Notes** — Auto-saving scratchpad for session notes, linked to campaign
- **NPC Manager** — Portrait cards with stats, surface dialogue to all players
- **Loot Tables** — Randomized loot generation, drag results to player inventories
- **Ambient Audio Control** — Choose and crossfade looping room ambiance tracks for all players
- **DM Screen** — Dedicated layout with all tools organized for session flow

### For Players

- **Character Sheet** — Full D&D 5th Edition sheet: stats, skills, HP, class features, spell slots
- **Dice Roller** — Physics-simulated 3D dice (d4 through d20) with roll history
- **Initiative Tracker** — Auto-rolled and displayed in session order
- **Text Chat** — In-character and out-of-character channels, whispers to DM
- **Peek** — Activate the Peek transition to enter the 3D world below the table

### For Everyone

- **Session Lobby** — DM runs a game host on their own machine (local or internet), shares a relay code; players enter the code and wait for DM approval before entering the session
- **Real-Time Sync** — All token movements, fog reveals, dice results, and HP changes appear instantly on all clients
- **Account System** — Local-first profile (name, email, password, role preference); no cloud dependency through R6
- **Reconnect Handling** — Dropping and rejoining restores full session state

---

## The Emotional Goal

When someone who has never seen Tavern Table watches the Peek mechanic for the first time, they should say *"whoa."*

When a D&D group finishes their first session on it, they should be reluctant to go back to their old tool.

That is the bar. Everything in the product is built toward that reaction.

---

*Document Version: 1.0*
*Last Updated: May 2026*
*Codename: Tavern Table / CafeDND*
*Stage: Research Version — Pre-Build*
