# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repository Is

This is the **planning repository** for **CafeD&D** — the brand — and its first product, **TavernTable**, a 3D virtual tabletop for D&D. It holds strategy, design decisions, roadmap, and UI references. **The application code does NOT live here.**

| Path | What it is |
|---|---|
| `CafeD&D_TavernTable_PLANS/DnD_Platform_Development_Plan.md` | Master strategy + tech spec + dev-lane breakdown |
| `CafeD&D_TavernTable_PLANS/TavernTable_R5_Extension_Phases.md` | **The live phase plan** (R5A–R5E series, standing decisions — binding) |
| `CafeD&D_TavernTable_PLANS/PROD_DESC.md` | Product description for stakeholders |
| `CafeD&D_TavernTable_PLANS/PROD_UI_DICT.md` | UI dictionary for the design/graphics team |
| `CafeD&D_TavernTable_PLANS/TavernTable_Phase0_TodoList.md` | Historical — R0 kickoff list (R0 long complete) |
| `DESIGN_NOTES.md` | **Decision log (DN-001…)** — check here before revisiting any decision |
| `FOR_DEVELOPERS.md` | Developer onboarding + UI team checklist |
| `README.md` | DM/player-facing pitch with progress bars |
| `roadmap/` | Standalone static roadmap viewer (open `roadmap/index.html` directly) |
| `UI_Design_References/` | V1 wireframes (reference JSX + viewable Vite app + screenshots) |

## Where the Code Lives

The actual product — **not in this repo**:

```
C:\Users\alibi\Documents\GamrProxRelatedFiles\DevAssets\Projects\CafeDND\Tavern-Table\
  cafe-dnd-web/     ← the game (Vite + TypeScript + Three.js + Socket.io)
  tavern-relay/     ← WebSocket relay service (NAT traversal)
  SUMMARY.md        ← session-by-session build history (read this for code context)
```

Phases R0–R5 + R5A are **built and merged**. Current status lives in the dev plan §3.3 and `Tavern-Table/SUMMARY.md` — trust those two over any other status table.

---

## Brand & Strategy (DN-006 / DN-007 — read before any strategy edit)

- **CafeD&D** is the umbrella brand: a family of D&D tools and games. **TavernTable** is its first product — the game where groups play D&D as DM + Players around a 3D table. Future companion tools (avatar customization, DM campaign builder) will be separate CafeD&D products that link into TavernTable. Spelling: "TavernTable" (one word); "CafeDND" only in filesystem/repo names.
- **The web build IS the product.** The Three.js/Vite/Socket.io build carries to final public release. The Godot track (G0–G7) is a **contingency only** — it activates only if the web stack hits a blocking technical ceiling. Do not plan work that assumes a Godot handoff.
- **The feedback gate (70%+ tester preference)** is the go/no-go for *public launch of the web product*, not a Godot unlock.
- Signature feature: the **Peek mechanic** — camera dives through the table surface into the 3D world below. It is the product's soul; protect it in every design decision.

## Design Skills

Two user-level skills exist for design/roadmap work — invoke them:
- `/dnd-5e-knowledge` — verifiable 5e rules source (page-indexed PHB PDF lookup, SRD-only IP guardrail).
- `/game-design-pro` — game design method (player fantasy, loops, friction budget, translate-not-transcribe).

Use both when restructuring the roadmap or writing mechanics/design specs.

---

## Key Standing Decisions (do not revisit without the DN log)

- **DM-as-host networking** — the game host runs on the DM's machine/LAN/rented server; `tavern-relay` is the internet path (DN-004: from the hosted HTTPS site, relay is the *only* non-localhost path).
- **Server-authoritative dice** — physics animation lands on the server's `crypto.randomInt` result. Override requires Bilal's sign-off.
- **Supabase at R7 only**; local mock auth + JSON persistence through R6. **Tauri at R8 only.**
- **`shared/types.ts` is the socket contract** — all event names/payloads live there, imported by client and server, no hardcoded strings.
- **4 dev lanes** (A scene / B systems / C multiplayer / D UI) with per-lane CLAUDE.md scope files in the code repo.
- **SRD 5.1 content only** in the shipped product — the owned PHB scan is internal reference material, never product content.
- **DN-005 (mid-session join) is OPEN** — needs Bilal's call before R5C.

## Roadmap Viewer

`roadmap/` is a self-contained static site, no build step — open `roadmap/index.html` in a browser.

- `roadmap/data.js` — all phase data (`RESEARCH_PHASES`, `GODOT_PHASES`, `ALT_PATHS`)
- `roadmap/roadmap.js` — hash router + render functions (data-driven; content edits go in `data.js` only)
- `roadmap/roadmap.css` — light/dark theme via `data-theme` on `<html>`; preference in `localStorage.cafeTheme`
- Known stale: `data.js` predates the R4a/R4b split and the R5A–R5E series — scheduled for the roadmap restructure (sync when R5E closes, or during the DN-006 restructure).

## Conventions

- New design decisions → `DESIGN_NOTES.md` as `DN-NNN` entries (short; it's a log, not a spec).
- Phase status updates → dev plan §3.3 **and** `Tavern-Table/SUMMARY.md`; other status tables in README/FOR_DEVELOPERS are derivative and historically drift — fix them when touched.
- Planning-repo pushes go to `origin` (`cafeDND-taverntable-planning`); code-repo git rules live in `Tavern-Table/cafe-dnd-web/CLAUDE.md` (approval-gated merges, never push `origin/main` unasked).
