# 🎲 Tavern Table — by CafeD&D

> *A new way to play Dungeons & Dragons online. Built for the people sitting around the table.*

---

> 👨‍💻 **Are you a developer?** This file is written for DMs and players. For technical documentation — stack, architecture, setup, and dev guides — please read [`FOR_DEVELOPERS.md`](./FOR_DEVELOPERS.md) instead.

---

## What Is Tavern Table?

Tavern Table is an online tool for playing Dungeons & Dragons with your group — but unlike anything you've probably used before.

Instead of staring at a flat map on a screen, **you sit inside a 3D room**. Your character has a seat at the table. The other players are across from you. The Dungeon Master is at the head. It feels less like using software and more like actually being in the room together.

The table itself is where the magic happens. Its surface shows the live map of wherever your party is — every token, every enemy, every patch of fog covering the unknown.

---

## The Signature Feature — The Peek

Here's what makes Tavern Table different from every other online VTT (virtual tabletop) out there.

Press **Peek** — and the camera smoothly dives *through* the surface of the table, emerging inside a fully realised 3D world below. Rolling terrain, dungeon corridors, forest paths. Fog of war appears as actual mist shrouding unexplored land.

You are *inside* the world.

Press Peek again and you rise back up to your seat at the table, ready to plan your next move.

No other tool does this. This is what Tavern Table is built around.

---

## Who It's For

- **Dungeon Masters** who want one place to run everything — maps, enemies, notes, audio, encounter tracking — without switching between five different tools.
- **Players** who want to feel genuinely present with their group, not just clicking tokens on a flat grid.
- **Groups** who play online and have been putting up with Roll20, Foundry, or Discord screen-share because nothing better existed.

---

## What's Being Built

### For the Dungeon Master
- 🗺️ **Map Editor** — Place terrain, props, and tokens on the table
- 🌫️ **Fog of War** — Reveal the map as players explore; hide the rest
- 🎭 **Token Management** — Move and label all characters and enemies
- ⚔️ **Encounter Panel** — Track enemy HP, conditions, and turn order
- 📝 **DM Notes** — Auto-saving scratchpad tied to the session
- 👤 **NPC Manager** — Character cards with portraits and stats
- 💰 **Loot Tables** — Roll randomised loot and send it to players
- 🎵 **Ambient Audio** — Set the mood with looping background sound
- 📐 **Range Ruler** — Quick, snappy tool for measuring distances on the map
- 🔵 **Area of Effect Tools** — Show spell ranges and effects using shapes (circles, cones, lines, squares)
- 🌓 **Day / Night Toggle** — Switch the room atmosphere with one button
- 🏠 **Room Selection** — Choose between different 3D environments (The Basement, The Tavern Backroom, and more)

### For Players
- 📋 **Character Sheet** — Full D&D 5th Edition sheet built in (stats, skills, HP, spells, everything)
- 🎲 **Dice Roller** — Physics dice that actually roll across the table (d4 through d20)
- ⚡ **Initiative Tracker** — Automatically rolls and orders everyone's turn
- 💬 **Chat** — In-character and out-of-character channels, plus private whispers to the DM
- 👁️ **The Peek** — Dive through the table into the 3D world below

### For Everyone
- 🔗 **Session Lobby** — DM creates a room and shares a short code; players join instantly
- ⚡ **Real-Time Sync** — Every move, fog reveal, and dice roll appears immediately on all screens
- 🔒 **Invite-Only Access** — Private sessions only; no random people joining your game
- 🔄 **Reconnect Handling** — If someone drops out, rejoining restores everything exactly as it was

---

## Current Build Progress

This is the **Research Version** — a closed, invite-only build being tested by real D&D groups before a full commercial release.

> Progress is shown across the nine development stages of the Research Version.

---

### Stage 1 — Foundation & Setup
*Getting the project running: servers, structure, core framework.*
```
██████████  100%  ✅ Complete
```

### Stage 2 — The 3D Room
*Building "The Basement" — the 3D environment players sit in.*
```
██████████  100%  ✅ Complete
```

### Stage 3 — The Peek Mechanic & Map System
*The signature camera dive through the table into a 3D world. Fog of war. Tokens on the table surface.*
```
██████████  100%  ✅ Complete
```

### Stage 4 — Multiplayer & Live Session Sync
*Two people connect and see the same world. DM moves a token — everyone sees it instantly.*
```
██░░░░░░░░   20%  🔨 In Progress
```

### Stage 5 — Core Game Systems
*Dice physics, character sheets, D&D 5e combat rules, initiative.*
```
░░░░░░░░░░    0%  ⬜ Not Yet Started
```

### Stage 6 — DM & Player Interfaces
*The actual panels and tools DMs and players use during a session.*
```
░░░░░░░░░░    0%  ⬜ Not Yet Started
```

### Stage 7 — Website & Quality Pass
*Hosted at a real URL. Performance tuned. Ready for outside testers.*
```
░░░░░░░░░░    0%  ⬜ Not Yet Started
```

### Stage 8 — Closed Playtesting with Real Groups
*Invite real D&D groups. Collect feedback. Go / No-Go decision for full production.*
```
░░░░░░░░░░    0%  ⬜ Not Yet Started
```

### Stage 9 — Desktop App
*Optional: wrap the browser version in a lightweight native desktop application.*
```
░░░░░░░░░░    0%  ⬜ Not Yet Started
```

---

## After the Research Version

If the research version passes its feedback threshold — meaning **70% or more of test groups prefer it over their current tool** — a full production version will be built.

That version targets:
- A commercial release on **Steam** and **itch.io**
- Windows, Mac, and Linux support
- Dramatically improved visuals using Vulkan rendering
- Expanded room environments, more 3D character models, and a full asset library

---

## The Goal

When someone watches the Peek for the first time, they should say *"whoa."*

When a group finishes their first session on Tavern Table, they should be reluctant to go back to their old tool.

Everything being built is in service of that reaction.

---

*Document Version: 2.0 · Last Updated: May 2026 · Stage: Research Version — In Active Development*
