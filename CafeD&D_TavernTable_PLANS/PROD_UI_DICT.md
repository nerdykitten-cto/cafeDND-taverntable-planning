# TavernTable — UI Dictionary
## Research Version (Three.js / HTML Interface)

*For the UI & Graphics Team · Document Version: 1.0 · May 2026*

---

## Purpose of This Document

This document catalogues every distinct UI surface in the Research Version of TavernTable. It describes what each screen or panel does, what information it shows, what the user can interact with, and any design notes the team should know.

The Research Version renders its 3D environment in Three.js (WebGL). All UI panels are DOM-based HTML/CSS overlaid on top of the Three.js canvas. There is no hybrid canvas-rendered UI — **3D world in canvas, all UI in HTML.**

This document is intended to give the UI and graphics team enough detail to begin layout sketches, wireframes, and style explorations.

---

## Visual Identity Notes

These are constraints and intentions — not final decisions. Use them as input to your explorations.

- **Tone:** Warm, atmospheric, slightly fantastical but not cartoonish. Think candlelit study, not children's cartoon.
- **Primary use context:** Desktop application, 1080p–1440p screens. Not mobile.
- **Theme:** Dark UI by default (overlay on a 3D scene). A light mode can be considered but dark is primary.
- **Typography direction:** A fantasy-adjacent display font for headers (Cinzel or similar). A clean, readable body font for data (Inter, Lato).
- **Color palette:** Warm amber/gold accents. Deep browns, charcoals, and navy for backgrounds. Red reserved for danger/HP. Green for health/revealed. The 3D scene provides most of the color — the UI should not compete.
- **Panels:** Semi-transparent backgrounds with blur (frosted glass) so the 3D environment remains visible underneath. The world should breathe through the UI.
- **Icons:** Consistent icon set throughout. Fantasy-adjacent but clean and immediately legible.

---

## Screen Architecture

There are two primary screen layouts in TavernTable:

| Screen | Who sees it | When |
|---|---|---|
| **Auth Screen** | Everyone | Before joining a session |
| **Home Screen** | DM and players | After login — mode selection (Host a Session / Join a Session) |
| **Waiting Room** | DM and players | After room created/joined — pending approval then pre-game lobby |
| **DM Screen** | Dungeon Master only | During an active session |
| **Player Screen** | Players only | During an active session |

These are mutually exclusive full-page layouts. Within DM Screen and Player Screen, multiple panels can be open simultaneously.

---

## 1. Auth Screen

**What it is:** The entry point for all users. No public signup — access is invite-only via magic link email.

**Layout:**
- Centered card on a neutral background (or subtle animated particle background to hint at the 3D world)
- Product logo / wordmark at top
- Short tagline ("Your table. Your world.")
- Single input: email address
- Primary button: "Send Magic Link"
- Status message: "Check your email for a login link" (post-submit state)
- Error state: "Email not recognized" (for non-invited addresses)

**States:**
1. **Default** — Email input empty, button enabled
2. **Loading** — Button shows spinner after submit
3. **Sent** — Input hidden, confirmation message shown
4. **Error** — Inline error below input

**Design notes:**
- No password field. Magic link only.
- Keep it minimal. The entire surface is the first impression.
- Consider a faint ambient glow or warm candlelight effect behind the card to hint at the 3D environment inside.

---

## 2. Home Screen

**What it is:** The mode-selection screen shown after login. The user chooses whether to host a session as DM or join one as a Player. This screen replaces the old single "Create / Join" lobby.

### 2a. DM Mode — "Host a Session"

**Layout:**
- Two-card layout: DM card on the left, Player card on the right (or stacked vertically on narrow screens)
- **DM card:**
  - Header: "Host a Session"
  - Host Address field — pre-filled from saved profile (`http://localhost:3001` default); editable for LAN or VPS address
  - "▶ Host a Game" button — gold, prominent
  - Small note: "Start `tavern-host` on your machine before clicking"

**States:**
1. **Default** — Address pre-filled, button enabled
2. **Connecting** — Button shows spinner; "Connecting to host…"
3. **Connected** — Navigates to Waiting Room (DM view)
4. **Error** — "Could not reach host at [address]" — inline error below address field

**Design notes:**
- The host address field communicates that the DM owns their server. Keep it visible but not intimidating.
- On successful connect, profile saves the address so it persists next session.

---

### 2b. Player Mode — "Join a Session"

**Layout:**
- **Player card:**
  - Header: "Join a Session"
  - Relay code input — 6-character or formatted (e.g., `TT-4829`) — auto-uppercases input
  - "▶ Join Game" button
  - Subtle link: "Connect via direct address ▾" — expands to show raw host address input for LAN play

**States:**
1. **Default** — Code input empty, button enabled
2. **Connecting** — "Connecting…" spinner
3. **Pending** — Navigates to Waiting Room (player pending state — see §2d)
4. **Error** — "Room not found", "Invalid code", or "Connection failed" — inline below input

---

### 2c. DM Waiting Room

**What it is:** The DM's pre-game lobby after a room is created. Replaces the old waiting room with a pending-approval layer on top.

**Layout:**
- **Relay code display** — large, click-to-copy, labeled "Share with players" (e.g., `TT · 4829`)
  - If relay not active: shows host address instead with a note to share it
- **Pending Requests section** (appears above player list when someone is waiting):
  - Each pending player shown as a row: avatar placeholder, display name, [✓ Accept] and [✗ Reject] buttons
  - "Accept All" shortcut button if multiple players are pending
- **In Session section** — accepted players list; DM badge on DM's own entry; [Kick] button per player
- **"Start Session" button** — gold, bottom of panel; disabled if no accepted players
- **"Close Room" link** — ends the session for all before it starts

**States:**
1. **Empty** — No players pending or accepted; "Waiting for players to join..." message
2. **Pending** — One or more pending requests shown; Start button still disabled
3. **Ready** — At least one accepted player; Start button enables
4. **Starting** — Start button shows spinner

**Design notes:**
- The pending vs accepted distinction is the core of this screen. Visual separation between the two sections must be clear — consider a subtle divider line or background difference.
- Accept/Reject buttons should be color-coded (green / red) but restrained — no harsh colors.

---

### 2d. Player Waiting Room — Pending State

**What it is:** What the player sees after entering a relay code, before the DM accepts them.

**Layout:**
- Full-height neutral card, centered
- Large animated spinner or hourglass icon
- "Waiting for the Dungeon Master to accept you…"
- Player's own display name shown below (confirmation they connected correctly)
- "Cancel" link — returns to Home Screen

**States:**
1. **Pending** — Spinner, waiting message
2. **Accepted** — Transitions to normal Waiting Room (player view)
3. **Rejected** — Spinner replaced with rejection message; reason shown if DM provided one; "Return to Home" button

---

### 2e. Player Waiting Room — Accepted State

**Layout:**
- Room code shown (for reference)
- Player list — live-updating as others are accepted
- DM shown at top with DM badge
- "Waiting for the Dungeon Master to begin…" status message
- **Leave Room** button

**States:**
1. **Waiting** — Player list populates, waiting message
2. **Starting** — "Session is starting…" transition, navigates to game.html

---

## 3. DM Screen

**What it is:** The DM's full session interface. The Three.js 3D room renders in the background. All DM tools are accessible as panels and sidebars without leaving this screen.

**Layout philosophy:** Left sidebar for active tools, right sidebar for session state, center is the 3D viewport. Panels should not cover the 3D view entirely — the DM should always feel present in the room.

---

### 3.1 DM Toolbar (Left Sidebar)

A persistent vertical icon toolbar docked to the left edge. Each icon opens its corresponding panel.

**Tool icons (in order):**

| Icon | Label | Opens |
|---|---|---|
| Map icon | Map Editor | Map Editor Panel (§3.2) |
| Eye icon | Fog of War | Fog Brush Panel (§3.3) |
| Person icon | Tokens | Token Library Panel (§3.4) |
| Sword icon | Encounter | Encounter Panel (§3.5) |
| Scroll icon | Notes | DM Notes Panel (§3.6) |
| NPC mask icon | NPCs | NPC Manager Panel (§3.7) |
| Bag icon | Loot | Loot Table Panel (§3.8) |
| Music note icon | Audio | Audio Controller Panel (§3.9) |
| Gear icon | Settings | Session Settings (§3.10) |

**States:**
- Active tool highlighted (selected state)
- Hover tooltip showing tool name
- Tools greyed when contextually unavailable (e.g., Fog brush only when map is loaded)

---

### 3.2 Map Editor Panel

**What it does:** DM places terrain tiles, props, and configures the map grid that appears on the table surface.

**Contents:**
- **Tile Palette** — Grid of selectable terrain tile types (grass, stone floor, dirt, water, sand, lava, dungeon wall, road). Active tile highlighted.
- **Brush Size Selector** — 1×1, 2×2, 3×3 tile paint radius
- **Grid Settings** — Show/hide grid lines, set grid dimensions (width × height in tiles), set tile size in feet (default 5ft)
- **Prop Placement Mode** — Toggle to place decorative props (trees, rocks, barrels, torches, doors) from a library
- **Map Name Field** — Label for the current map
- **Save / Load Map** — Save current map configuration to campaign, load a previously saved map
- **Clear Map** — Reset all tiles (with confirmation dialog)

**Layout:** Panel slides in from the left over the toolbar. Tile palette is the dominant element. Grid settings collapse into a secondary section below.

---

### 3.3 Fog of War Panel

**What it does:** DM controls which areas of the map are visible to players.

**Contents:**
- **Reveal Brush** — Paint tool to mark tiles as revealed (fog removed, players see area)
- **Hide Brush** — Paint tool to re-cover tiles with fog
- **Reveal All** button — Remove all fog instantly (with confirmation)
- **Reset Fog** button — Cover entire map with fog (with confirmation)
- **Fog Opacity Slider** — How dark the fog appears on the DM's own view (players always see full opacity fog)
- **Brush Size** — Radius selector (same as Map Editor)

**Visual note:** On the DM's own view, fogged areas should appear at reduced opacity (DM can see the terrain). Players see fogged areas as fully obscured dark mist.

---

### 3.4 Token Library Panel

**What it does:** DM places, manages, and removes character and enemy tokens on the map.

**Contents:**
- **Player Tokens** section — One token card per connected player. Shows avatar/portrait, character name, HP bar, and current position indicator. Click to select and move.
- **Enemy Tokens** section — Enemy tokens added by DM. Each shows name, HP bar, AC, and current position.
- **Add Enemy** button — Opens mini form: name, max HP, AC, portrait (choose from preset icons or upload)
- **Token Context Menu** (right-click on token on map): Move, Edit HP, Apply Condition, Remove
- **Conditions Quick-Apply** — Dropdown of 5e conditions (Blinded, Charmed, Frightened, Incapacitated, Invisible, Paralyzed, Poisoned, Prone, Stunned) shown as colored status icons on the token

---

### 3.5 Encounter Panel

**What it does:** Manages combat. Tracks all combatants, their turn order, HP, and conditions.

**Contents:**
- **Initiative Order** — Ordered list of all combatants (players + enemies). Each entry shows:
  - Portrait / token icon
  - Name
  - Initiative roll value
  - HP bar (current / max) with numeric edit on click
  - Condition icons
  - "Active turn" highlight on current combatant
- **Roll Initiative** button — Auto-rolls d20 + Dexterity modifier for all player characters; DM manually enters or rolls for enemies
- **Next Turn** button — Advances the turn indicator to next combatant, broadcasts to all players
- **Add Combatant** button — Add a new enemy mid-combat
- **Remove Combatant** button — Remove a defeated enemy from the tracker
- **End Combat** button — Clears initiative order, exits combat state
- **Drag-to-Reorder** — Manually reorder initiative if needed (e.g., surprise round)

**Real-time note:** HP changes made here broadcast instantly to all players. Turn advancement sends a notification to the active player.

---

### 3.6 DM Notes Panel

**What it does:** Session scratchpad for the DM. Auto-saves every 30 seconds to Supabase.

**Contents:**
- **Text area** — Plain rich text. Supports bold, italic, headers, bullet lists (minimal formatting toolbar)
- **Session log links** — Timestamps inserted automatically at session start and major events
- **Tag input** — Apply tags (NPCs, locations, plot hooks) for searchability later
- **Search field** — Search previous session notes within the campaign
- **Auto-save indicator** — Small "Saved" status that flashes on save

**Layout:** Full-height panel on the right side. Lower friction than any external tool.

---

### 3.7 NPC Manager Panel

**What it does:** DM manages non-player characters and can surface information or dialogue to all players.

**Contents:**
- **NPC List** — Cards for each NPC in the current campaign. Each card shows: portrait, name, one-line description, relationship to party (Ally / Neutral / Hostile).
- **Add NPC** button — Opens form: name, portrait, AC, HP, short description, dialogue notes
- **Display to Players** button — Sends NPC portrait + name to a shared overlay visible to all players (like showing a character card across the table)
- **Dialogue Panel** — DM types a line of dialogue; "Speak as NPC" sends it to the chat window attributed to that NPC
- **Quick Stats** — AC, HP, passive Perception, notable abilities (collapsed by default)

---

### 3.8 Loot Table Panel

**What it does:** DM generates randomized loot and assigns it to players.

**Contents:**
- **Preset Tables** dropdown — Low Value Hoard, Medium Value Hoard, High Value Hoard, Scroll Table, Gem Table, etc. (sourced from SRD)
- **Roll Loot** button — Generates a random result from selected table, displayed in a result card
- **Result Card** — Shows generated items with names and descriptions
- **Assign to Player** — Drag item from result card to a player token, or use dropdown
- **Custom Table** button — Opens a small form to define a custom weighted table

---

### 3.9 Audio Controller Panel

**What it does:** DM controls the ambient audio environment heard by all players.

**Contents:**
- **Track Library** — List of available looping ambient tracks (e.g., Basement Ambience, Tavern Noise, Cave Drips, Combat Drums, Forest Wind, Heavy Rain). Each shows name and duration.
- **Now Playing** — Currently active track with a progress bar and volume slider
- **Crossfade toggle** — Smooth 3-second fade when switching tracks
- **Play / Pause / Stop** controls
- **Volume slider** — Master volume for all players (DM sets a global level; players may adjust locally)
- **SFX Board** — One-shot sound effects playable on demand (door creak, thunder crack, coin clink, explosion, scream — ~12 slots). Each is a labeled button.
- **Upload Track** — DM uploads a custom .mp3/.ogg track for this campaign (Tauri only — reads from local disk)

---

### 3.10 Session Settings Panel

**What it does:** Session-level configuration options.

**Contents:**
- **Session Name** — Editable
- **Room Code** — Displayed (read-only)
- **Connected Players** — List with role (DM / Player) and connected status
- **Kick Player** — Remove a player from the session
- **Player Permissions** toggle — Allow/disallow players to move their own tokens
- **End Session** button — Closes session for all clients (with confirmation)

---

### 3.11 DM Right Sidebar (Always Visible)

A persistent sidebar on the right, always visible during session. Shows at-a-glance session state without opening any panel.

**Contents (top to bottom):**
- **Session status chip** — "Live" badge with player count
- **Initiative quick-view** — Collapsed version of initiative order (names and HP bars, no controls). Expands on click to open the full Encounter Panel.
- **Party status cards** — One small card per player: avatar, name, current HP bar, any active conditions. Read-only from here; editing opens Encounter Panel.
- **Room code display** — Small persistent code in case a late joiner needs it

---

## 4. Player Screen

**What it is:** The player's session view. Three.js room renders in the background; the player's UI floats on top without obstructing the 3D environment.

**Layout philosophy:** Minimal HUD. The player should feel immersed in the room, not in a dashboard. All interactive tools collapse into a bottom bar. Information appears when relevant.

---

### 4.1 Player Bottom Bar (Always Visible)

A persistent horizontal bar at the bottom of the screen, always visible during session.

**Sections:**

| Section | What it contains |
|---|---|
| **Character tab** | Opens Character Sheet Panel |
| **Dice tab** | Opens Dice Roller Panel |
| **Chat tab** | Opens Chat Panel, shows unread badge |
| **Peek button** | Triggers the Peek transition into the 3D world |

The bottom bar itself also shows:
- Player's character name and portrait thumbnail
- Current HP (e.g., "HP: 32 / 45") — colored by health level (green → yellow → red)
- Active condition icons (if any conditions are applied)
- Turn indicator chip — "Your Turn" notification that appears during combat when it is this player's turn

---

### 4.2 Character Sheet Panel

**What it does:** Displays and allows editing of the player's D&D 5e character sheet.

**Contents:**
- **Header** — Character name, race, class, level, background, alignment, XP bar
- **Ability Scores** — Six scores (STR/DEX/CON/INT/WIS/CHA) displayed as large tiles with modifier calculated below
- **Saving Throws** — List of six saving throws with proficiency indicator and modifier
- **Skills** — All 18 skills with proficiency/expertise indicators and calculated bonuses
- **Combat Stats Row** — Armor Class, Initiative, Speed, Hit Dice, Death Save tracker
- **HP Section** — Current HP (editable), Max HP, Temporary HP field
- **Attacks & Spellcasting** — Weapon attacks (name, bonus, damage, damage type); Spell Attack bonus; Spell Save DC
- **Equipment** — Gear list, coin purse (CP/SP/EP/GP/PP)
- **Spell Slots** (if caster class) — Slot tracker per level (checkboxes, tap to expend/recover)
- **Known Spells / Prepared Spells** — Collapsible list per level
- **Class Features & Traits** — Collapsible blocks for racial traits, class features, feats
- **Notes field** — Free text for player notes on their character

**States:**
- Editable fields: HP fields, spell slot checkboxes, equipment list
- Read-only fields: ability modifiers (calculated), skill bonuses (calculated)
- Edit mode toggle (to prevent accidental changes mid-session)

**Layout:** Full panel slides up from the bottom bar. Scrollable. Two-column layout on wider screens.

---

### 4.3 Dice Roller Panel

**What it does:** Players roll 3D physics dice. Results are broadcast to all session participants.

**Contents:**
- **Dice Grid** — Seven large clickable dice buttons: d4, d6, d8, d10, d10% (percentile), d12, d20
- **Modifier Input** — +/− numeric input added to any roll (e.g., +5 attack modifier)
- **Advantage / Disadvantage toggle** — Rolls two d20s, highlights the higher (advantage) or lower (disadvantage)
- **Roll button** — Executes the roll; 3D dice animate in a small physics viewport above the panel
- **Quick Roll presets** — Row of labeled shortcut buttons pre-configured with common rolls (e.g., "Attack +7", "Stealth +4", "Fireball 8d6")
- **Roll History** — Scrollable log of all rolls made this session: who rolled, what, the result (with breakdown if multiple dice), timestamp

**Visual note:** The dice physics animation should be a highlight. Consider a small inset 3D viewport (canvas within the panel) showing the dice tumbling, or a full-screen overlay for dramatic moments.

---

### 4.4 Chat Panel

**What it does:** Text communication between all session participants.

**Contents:**
- **Channel tabs** — Three tabs: "Table" (everyone), "Out of Character" (OOC, separate from in-character play), "Whispers" (private)
- **Message feed** — Scrollable message list. Each message shows: avatar icon, display name, timestamp, message text. NPC dialogue appears styled differently (italic, NPC portrait, NPC name).
- **Message input** — Text input at the bottom with Send button (Enter key to send)
- **Whisper selector** — Dropdown to switch whisper target to a specific player or DM
- **Dice roll results** — Roll results appear in the Table channel as special styled cards (not plain text): character name, dice type, modifier, result, with visual emphasis on a d20 natural 1 or 20
- **Unread indicator** — Badge on Chat tab in the bottom bar when unread messages arrive

---

### 4.5 Peek Overlay

**What it is:** The transition experience and view when a player activates Peek.

**What happens:**
1. Player taps the Peek button in the bottom bar
2. Camera animates downward through the table surface (Three.js GSAP animation)
3. The 3D world beneath appears — terrain, fog, tokens in a 3D landscape
4. While in Peek mode, a minimal overlay appears:
   - **Exit Peek button** — Top right corner, taps to reverse the transition back to the table
   - **Peek compass/orientation** — Small compass rose to indicate cardinal direction
   - **Party markers** — Small labeled pins showing where other players' tokens are located
   - **Personal pin button** — Drop a marker on the current view to remember a location
5. Player taps Exit Peek — camera reverses through the table, returns to seated view

**Design notes:**
- The Peek transition is the most emotional moment in the product. The UI in this state should be as minimal as possible. Let the 3D world do the work.
- Exit button must always be visible but should not dominate.
- Consider a brief vignette fade at the moment of crossing through the table surface.

---

### 4.6 Turn Notification

**What it is:** A transient notification that appears when it becomes a player's turn in combat.

**Contents:**
- Large modal or banner: "**Your Turn**" with the player's character name
- Dismiss button (or auto-dismisses after 4 seconds)
- Optionally plays a soft audio chime

**Placement:** Center-screen, transient. Should be visible even if a panel is open.

---

### 4.7 NPC Display Overlay

**What it is:** A shared overlay triggered by the DM to show all players an NPC card.

**Contents:**
- NPC portrait (large)
- NPC name
- One-line description or current dialogue line (if DM sent one)
- Dismiss button (player can close their own view)

**Placement:** Centered modal or top-of-screen slide-down banner. Present on all player screens simultaneously when DM activates it.

---

## 5. Shared / System-Level UI

These surfaces appear across both DM and Player screens.

---

### 5.1 Loading Screen

**When:** Session startup, map load, Tauri app launch.

**Contents:**
- Product logo / wordmark
- Loading bar or animated indicator
- Contextual message ("Loading campaign…", "Connecting to session…")

---

### 5.2 Disconnect / Reconnect Banner

**When:** Network connection drops.

**Contents:**
- Persistent top banner (does not block content)
- "Connection lost — reconnecting…" with spinner
- On reconnect: "Reconnected" confirmation (auto-dismisses)
- If reconnect fails after N seconds: "Unable to reconnect. Check your connection." with retry button

---

### 5.3 Error Toast

**When:** Non-critical errors (save failed, action permission denied, etc.)

**Contents:**
- Slide-in toast from bottom-right
- Icon (warning or error)
- Short message (one sentence)
- Auto-dismisses after 4 seconds; close button for manual dismiss

---

### 5.4 Confirmation Dialog

**When:** Destructive or irreversible actions (Clear Map, End Session, Kick Player, Reveal All Fog).

**Contents:**
- Centered modal with overlay
- Action description ("This will remove all fog from the map for all players.")
- Two buttons: "Confirm" (primary, destructive color) and "Cancel"

---

### 5.5 Keyboard Shortcut Overlay

**When:** User presses `?` key.

**Contents:**
- Centered modal listing all keyboard shortcuts grouped by category (Navigation, Dice, DM Tools, etc.)
- Dismiss with Escape or click outside

---

## 6. Responsive and Adaptive Considerations

- **Primary target:** 1920×1080 and 2560×1440 desktop screens
- **Minimum supported:** 1280×720
- **DM and Player screens:** Not designed for mobile. Panels may collapse to icons below 1366px width.
- **Tauri vs Browser:** The UI behaves identically. The only difference is the Tauri version shows a native window chrome and can access local file dialogs.
- **Multi-window:** The DM may open the app in two windows — one for the 3D view, one as a detached DM panel. This should be considered in layout design (the DM screen should be usable even if the viewport is hidden).

---

## 7. Animation and Transition Guidelines

| Transition | Duration | Easing |
|---|---|---|
| Panel slide in/out | 250ms | ease-out |
| Toast slide in | 200ms | ease-out |
| Toast fade out | 300ms | ease-in |
| Modal appear | 200ms | ease-out + slight scale from 0.95 → 1.0 |
| Tab switch | 150ms | ease |
| Peek transition (3D) | 1500–2500ms | Custom GSAP cubic-bezier (dramatic, cinematic) |
| Turn notification | 300ms appear, 200ms dismiss | ease-out / ease-in |

---

## 8. Deliverables Requested from UI Team

For the sketching phase, the team should produce:

1. **Auth Screen** — layout sketch and one style direction
2. **Lobby Screen** — DM view and Player view
3. **DM Screen** — Overall layout with all sidebars labelled (even if panel contents are placeholder)
4. **Player Screen** — Overall layout with bottom bar visible, one panel open (e.g., Character Sheet or Dice)
5. **Character Sheet Panel** — Detailed layout of the 5e sheet
6. **Peek Overlay** — What the player sees during the Peek view (minimal HUD state)
7. **Typography and color system** — One-page style guide with font choices, color swatches, and spacing scale

---

*Document Version: 1.0*
*Last Updated: May 2026*
*For: UI & Graphics Team*
*Platform: Research Version — Three.js + HTML/CSS overlay*
