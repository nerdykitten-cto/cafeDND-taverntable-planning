import './styles.css';
import { createRoot } from 'react-dom/client';
import { AuthSection, LobbyDMSection, LobbyPlayerSection, DMScreenSection } from './screens-a.jsx';
import { PlayerScreenSection, CharacterSheetSection } from './screens-b.jsx';
import { Sketch, ScreenSection, Canvas, Rect, Ln, Tx, Ann, Avatar, HPBar, RoomBackdrop, TableMap } from './ui.jsx';

// ── Dice ──────────────────────────────────────────────────────────────────────
function DiceSection() {
  const dice = ['d4','d6','d8','d10','d%','d12','d20'];
  return (
    <ScreenSection id="dice" num="07" title="Dice Roller Panel" refTag="UI Dict §4.3"
      intent="3D physics dice are a signature touch. Three layouts foreground different parts: button grid, dramatic physics view, or history log.">
      <Sketch title="A · Grid + modifier strip" tag="bottom-anchored · familiar"
        notes={['7 dice buttons in a single row, modifier on the right','Roll history collapses above as a scrollable strip','Best for quick mid-combat rolls']}>
        <Canvas vb="0 0 360 220">
          <RoomBackdrop x="0" y="0" w="360" h="120" />
          <Rect x="8" y="124" w="344" h="42" rx="3" fill="rgba(30,22,12,0.85)" stroke="gold" />
          <Tx x="16" y="136" className="lbl-display">RECENT</Tx>
          {[['Roan','d20+5 ATK','17'],['Lia','d6 dmg','4'],['Goblin','d20-1','3'],['Roan','2d8+3 fire','15']].map((r,i) => (
            <g key={i}>
              <Rect x={16 + i*82} y="142" w="76" h="20" rx="2" stroke="gold" />
              <Tx x={20 + i*82} y="150" className="tiny">{r[0]}</Tx>
              <Tx x={20 + i*82} y="159" className="tiny">{r[1]}</Tx>
              <Tx x={86 + i*82} y="156" anchor="end" className="lbl-display">{r[2]}</Tx>
            </g>
          ))}
          <Rect x="8" y="172" w="344" h="40" rx="3" fill="rgba(30,22,12,0.9)" stroke="gold" />
          {dice.map((d,i) => (
            <g key={d}>
              <Rect x={14 + i*30} y="178" w="26" h="28" rx="2" stroke="gold" fill={i===6?'rgba(192,138,42,0.3)':'none'} />
              <Tx x={27 + i*30} y="196" anchor="middle" className="lbl-display">{d}</Tx>
            </g>
          ))}
          <Tx x="228" y="186" className="tiny">mod</Tx>
          <Rect x="226" y="190" w="28" h="16" stroke="gold" />
          <Tx x="240" y="201" anchor="middle" className="lbl-display">+5</Tx>
          <Rect x="294" y="178" w="52" h="28" rx="2" fill="#c08a2a" />
          <Tx x="320" y="196" anchor="middle" className="lbl-display">ROLL</Tx>
          <Ann x1="320" y1="206" x2="350" y2="230" label="primary CTA · amber" anchor="end" gold />
        </Canvas>
      </Sketch>
      <Sketch title="B · Physics centerpiece" tag="3D viewport leads · drama"
        notes={['Large dice-tray viewport top — animated tumble preview','Dice grid + presets below as supporting cast','Critical 20 / 1 zooms tray to full-screen briefly']}>
        <Canvas vb="0 0 360 240">
          <Rect x="8" y="8" w="344" h="148" rx="3" fill="#2b2317" stroke="gold" />
          <ellipse cx="180" cy="100" rx="120" ry="40" fill="#3a2c1c" opacity="0.6" />
          {[{cx:140,cy:90},{cx:200,cy:108},{cx:240,cy:80}].map((p,i) => (
            <g key={i} transform={`translate(${p.cx} ${p.cy}) rotate(${i*18})`}>
              <path d="M-10 -6 L0 -14 L10 -6 L0 2 Z" fill="#c08a2a" stroke="#2a2317" strokeWidth="0.6" />
              <path d="M-10 -6 L-10 6 L0 14 L0 2 Z" fill="#9a6c18" stroke="#2a2317" strokeWidth="0.6" />
              <path d="M10 -6 L10 6 L0 14 L0 2 Z" fill="#a87c20" stroke="#2a2317" strokeWidth="0.6" />
              <text x="0" y="-3" textAnchor="middle" style={{fontFamily:'Cinzel,serif',fontSize:8,fill:'#fff'}}>{[20,15,8][i]}</text>
            </g>
          ))}
          <Tx x="20" y="22" className="lbl-display">· DICE TRAY ·</Tx>
          <Tx x="340" y="22" anchor="end" className="lbl-display">RESULT  23</Tx>
          <Rect x="8" y="164" w="344" h="68" rx="3" fill="rgba(30,22,12,0.9)" stroke="gold" />
          {dice.map((d,i) => (
            <g key={d}>
              <Rect x={14 + i*30} y="172" w="26" h="24" rx="2" stroke="gold" fill={i===6?'rgba(192,138,42,0.3)':'none'} />
              <Tx x={27 + i*30} y="188" anchor="middle" className="lbl-display">{d}</Tx>
            </g>
          ))}
          {['ATK +7','Stealth +4','FB 8d6','Save +2'].map((p,i) => (
            <Rect key={i} x={14 + i*60} y="212" w="56" h="14" rx="2" stroke="pencil" label={p} labelClass="tiny" labelDy="-1" />
          ))}
          <Rect x="296" y="172" w="50" h="48" rx="2" fill="#c08a2a" />
          <Tx x="321" y="200" anchor="middle" className="lbl-display">ROLL</Tx>
          <Ann x1="180" y1="100" x2="80" y2="44" label="inset Three.js · physics" anchor="start" gold />
        </Canvas>
      </Sketch>
      <Sketch title="C · Sidebar tray + log" tag="docked right · history-heavy"
        notes={['Vertical column docked right of the player UI','Dice listed vertically with running log below','Best for casters / DMs who roll constantly']}>
        <Canvas vb="0 0 360 240">
          <RoomBackdrop x="0" y="0" w="280" h="240" />
          <Rect x="278" y="6" w="78" h="228" rx="3" fill="rgba(30,22,12,0.9)" stroke="gold" />
          <Tx x="317" y="20" anchor="middle" className="lbl-display">DICE</Tx>
          <Ln x1="282" y1="24" x2="352" y2="24" stroke="gold" />
          {dice.map((d,i) => (
            <g key={d}>
              <Rect x="286" y={30 + i*16} w="62" h="14" rx="2" stroke="gold" fill={i===6?'rgba(192,138,42,0.3)':'none'} />
              <Tx x="317" y={40 + i*16} anchor="middle" className="lbl-display">{d}</Tx>
            </g>
          ))}
          <Rect x="286" y="170" w="62" h="16" fill="#c08a2a" />
          <Tx x="317" y="181" anchor="middle" className="lbl-display">ROLL</Tx>
          <Tx x="286" y="200" className="lbl-display">LOG</Tx>
          {[['R','d20+5','17'],['L','d8','6'],['G','d20','3']].map((r,i) => (
            <g key={i}>
              <Tx x="286" y={210 + i*8} className="tiny">{r[0]}·{r[1]}</Tx>
              <Tx x="348" y={210 + i*8} anchor="end" className="tiny">{r[2]}</Tx>
            </g>
          ))}
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

// ── Chat ──────────────────────────────────────────────────────────────────────
function ChatSection() {
  return (
    <ScreenSection id="chat" num="08" title="Chat Panel" refTag="UI Dict §4.4"
      intent="Table / OOC / Whisper channels. NPC dialogue and dice rolls render as cards inline. Three placements.">
      <Sketch title="A · Right-side full height" tag="discord-shaped · always visible"
        notes={['Channels as top tabs · whisper picker beside input','Dice rolls render as cards · nat 20/1 = gold/red glow','Unread badge mirrors bottom-bar Chat tab']}>
        <Canvas vb="0 0 360 240">
          <RoomBackdrop x="0" y="0" w="220" h="240" />
          <Rect x="220" y="6" w="136" h="228" rx="3" fill="rgba(30,22,12,0.9)" stroke="gold" />
          {['Table','OOC','Wh'].map((t,i) => {
            const active = i===0;
            return (
              <g key={t}>
                {active && <rect x={224 + i*44} y="12" width="40" height="16" rx="2" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.5" />}
                <Tx x={244 + i*44} y="23" anchor="middle" className={active?'lbl-display':'tiny'}>{t}</Tx>
              </g>
            );
          })}
          <Ln x1="222" y1="32" x2="354" y2="32" stroke="pencil" />
          <Avatar cx="232" cy="46" r="6" initial="L" />
          <Tx x="242" y="52" className="lbl-text">I'll cast detect magic.</Tx>
          <Rect x="226" y="60" w="124" h="26" rx="2" fill="rgba(192,138,42,0.18)" stroke="gold" />
          <Tx x="232" y="70" className="tiny">Roan rolled  d20+5  ATK</Tx>
          <Tx x="232" y="82" className="lbl-display">17  ✦  hit!</Tx>
          <Avatar cx="232" cy="100" r="6" initial="N" fill="#a83838" />
          <Tx x="242" y="106" className="lbl-text" style={{fontStyle:'italic'}}>"You shouldn't have come."</Tx>
          <Rect x="226" y="140" w="124" h="30" rx="2" fill="#c08a2a" stroke="var(--gold-deep)" />
          <Tx x="232" y="151" className="tiny" style={{fill:'#fff'}}>Lia rolled  d20</Tx>
          <Tx x="232" y="166" className="lbl-display">NAT 20 ✦ CRIT</Tx>
          <Ln x1="222" y1="200" x2="354" y2="200" stroke="pencil" />
          <Rect x="226" y="206" w="86" h="22" stroke="pencil" />
          <Tx x="230" y="220" className="tiny">say something…</Tx>
          <Rect x="316" y="206" w="34" h="22" fill="#c08a2a" />
          <Tx x="333" y="221" anchor="middle" className="lbl-text">Send</Tx>
          <Ann x1="288" y1="155" x2="200" y2="170" label="d20 nat 20 → gold treatment" anchor="end" gold />
        </Canvas>
      </Sketch>
      <Sketch title="B · Bottom expanding drawer" tag="HUD-friendly · minimal at rest"
        notes={['Collapsed: single line of latest message floats over bottom bar','Tap to expand into a 40%-height drawer','Best for players who chat lightly']}>
        <Canvas vb="0 0 360 240">
          <RoomBackdrop x="0" y="0" w="360" h="180" />
          <g transform="translate(80 50)">
            <TableMap x="0" y="0" w="200" h="100" fogPct={0.3} />
          </g>
          <Rect x="10" y="160" w="290" h="14" rx="7" fill="rgba(30,22,12,0.7)" stroke="gold" />
          <Avatar cx="20" cy="167" r="5" initial="L" />
          <Tx x="30" y="170" className="tiny">Lia · I'll cast detect magic…    [tap to expand]</Tx>
          <Rect x="6" y="180" w="348" h="56" rx="3" fill="rgba(30,22,12,0.92)" stroke="gold" />
          {['Table','OOC','Wh'].map((t,i) => {
            const active = i===0;
            return (
              <g key={t}>
                {active && <rect x={10 + i*30} y="184" width="26" height="12" rx="2" fill="rgba(192,138,42,0.25)" />}
                <Tx x={23 + i*30} y="193" anchor="middle" className={active?'lbl-display':'tiny'}>{t}</Tx>
              </g>
            );
          })}
          <Tx x="100" y="213" className="tiny gold">Old Garric: "You shouldn't have come."</Tx>
          <Rect x="322" y="220" w="26" h="12" fill="#c08a2a" />
          <Tx x="335" y="230" anchor="middle" className="tiny">Send</Tx>
        </Canvas>
      </Sketch>
      <Sketch title="C · Floating draggable window" tag="OBS-style · place anywhere"
        notes={['Window with title bar; pin-on-top toggle','Drag handle + resize corner','Same chat anatomy inside, just untethered']}>
        <Canvas vb="0 0 360 240">
          <RoomBackdrop x="0" y="0" w="360" h="240" />
          <g transform="rotate(-1 200 130)">
            <Rect x="140" y="50" w="160" h="160" rx="3" fill="rgba(30,22,12,0.92)" stroke="gold" />
            <Rect x="140" y="50" w="160" h="14" fill="rgba(192,138,42,0.4)" />
            <Tx x="148" y="61" className="lbl-display">CHAT</Tx>
            <Tx x="280" y="61" className="tiny">📌 _ ✕</Tx>
            {['Table','OOC','Wh'].map((t,i) => {
              const active = i===0;
              return (
                <g key={t}>
                  {active && <rect x={144 + i*36} y="68" width="32" height="12" rx="2" fill="rgba(192,138,42,0.2)" />}
                  <Tx x={160 + i*36} y="77" anchor="middle" className={active?'lbl-display':'tiny'}>{t}</Tx>
                </g>
              );
            })}
            <Avatar cx="150" cy="90" r="5" initial="L" />
            <Tx x="158" y="92" className="tiny">Lia: ready</Tx>
            <Rect x="146" y="114" w="146" h="18" rx="2" fill="rgba(192,138,42,0.18)" stroke="gold" />
            <Tx x="150" y="123" className="tiny">Roan rolled d20+5</Tx>
            <Tx x="288" y="125" anchor="end" className="lbl-display">17</Tx>
            <Avatar cx="150" cy="142" r="5" initial="N" fill="#a83838" />
            <Tx x="158" y="150" className="tiny" style={{fontStyle:'italic'}}>"You shouldn't…"</Tx>
            <Rect x="144" y="186" w="118" h="16" stroke="pencil" />
            <Rect x="266" y="186" w="30" h="16" fill="#c08a2a" />
            <Tx x="281" y="197" anchor="middle" className="lbl-text">Send</Tx>
          </g>
          <Ann x1="220" y1="58" x2="338" y2="40" label="drag title to move" anchor="end" gold />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

// ── Peek ──────────────────────────────────────────────────────────────────────
function PeekSection() {
  return (
    <ScreenSection id="peek" num="09" title="Peek Overlay" refTag="UI Dict §4.5"
      intent="The signature mechanic — the camera dives through the table into the 3D world. The HUD here should disappear so the world does the work. Three density choices.">
      <Sketch title="A · Whisper-minimal" tag="exit button only"
        notes={["Single Exit chip top-right — that's it",'World is the experience; no compass, no markers','Vignette pulse on enter/exit only']}>
        <Canvas vb="0 0 360 220" bg="#1a1610">
          <defs>
            <linearGradient id="peekSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b6e7a" /><stop offset="60%" stopColor="#3a3a32" /><stop offset="100%" stopColor="#2b2317" />
            </linearGradient>
            <radialGradient id="vig" cx="50%" cy="50%" r="60%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="360" height="220" fill="url(#peekSky)" />
          <path d="M0 150 L60 100 L120 130 L180 80 L240 120 L300 90 L360 140 L360 220 L0 220 Z" fill="#3a3a30" />
          <path d="M0 170 L80 130 L160 160 L240 130 L320 160 L360 150 L360 220 L0 220 Z" fill="#2b2620" />
          <ellipse cx="280" cy="160" rx="140" ry="40" fill="#cfd6dc" opacity="0.35" />
          <rect x="0" y="0" width="360" height="220" fill="url(#vig)" />
          <Rect x="300" y="12" w="50" h="22" rx="11" fill="rgba(30,22,12,0.6)" stroke="gold" />
          <Tx x="325" y="26" anchor="middle" className="lbl-text">↑ Exit</Tx>
          <Ann x1="325" y1="34" x2="270" y2="60" label="reverse camera dive" anchor="end" gold />
        </Canvas>
      </Sketch>
      <Sketch title="B · Compass + party pins" tag="orientation aids only"
        notes={['Exit, compass, and labeled party pins floating in 3D','No persistent panels — pins fade as you look away','Personal pin button bottom-right for memory-points']}>
        <Canvas vb="0 0 360 220" bg="#1a1610">
          <defs>
            <linearGradient id="peekSky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b6e7a" /><stop offset="60%" stopColor="#3a3a32" /><stop offset="100%" stopColor="#2b2317" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="220" fill="url(#peekSky2)" />
          <path d="M0 150 L60 100 L120 130 L180 80 L240 120 L300 90 L360 140 L360 220 L0 220 Z" fill="#3a3a30" />
          <ellipse cx="80" cy="180" rx="90" ry="24" fill="#cfd6dc" opacity="0.35" />
          <g transform="translate(34 34)">
            <circle r="20" fill="rgba(30,22,12,0.55)" stroke="var(--gold-deep)" strokeWidth="0.8" />
            <Tx x="0" y="-10" anchor="middle" className="tiny">N</Tx>
            <Tx x="0" y="16" anchor="middle" className="tiny">S</Tx>
            <Tx x="-15" y="3" anchor="middle" className="tiny">W</Tx>
            <Tx x="15" y="3" anchor="middle" className="tiny">E</Tx>
            <path d="M0 -8 L-3 0 L0 4 L3 0 Z" fill="#c08a2a" />
          </g>
          {[{x:160,y:120,name:'Lia'},{x:230,y:100,name:'Bex'},{x:280,y:140,name:'DM'}].map(p => (
            <g key={p.name}>
              <line x1={p.x} y1={p.y+8} x2={p.x} y2={p.y+24} stroke="var(--gold-deep)" strokeWidth="0.8" />
              <circle cx={p.x} cy={p.y} r="6" fill="rgba(30,22,12,0.7)" stroke="#c08a2a" strokeWidth="0.8" />
              <Tx x={p.x} y={p.y+34} anchor="middle" className="tiny" style={{fill:'#f0d99a'}}>{p.name}</Tx>
            </g>
          ))}
          <Rect x="300" y="12" w="50" h="22" rx="11" fill="rgba(30,22,12,0.6)" stroke="gold" />
          <Tx x="325" y="26" anchor="middle" className="lbl-text">↑ Exit</Tx>
          <Rect x="294" y="184" w="56" h="22" rx="2" fill="rgba(30,22,12,0.7)" stroke="gold" />
          <Tx x="322" y="198" anchor="middle" className="tiny">＋ Drop pin</Tx>
        </Canvas>
      </Sketch>
      <Sketch title="C · Full HUD" tag="explorer mode · waypoints"
        notes={['Compass, party pins, waypoint list, & altitude/depth gauge','Mini-map inset bottom-left to keep table reference','Closest to a video-game world map — for power users']}>
        <Canvas vb="0 0 360 220" bg="#1a1610">
          <defs>
            <linearGradient id="peekSky3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b6e7a" /><stop offset="60%" stopColor="#3a3a32" /><stop offset="100%" stopColor="#2b2317" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="220" fill="url(#peekSky3)" />
          <path d="M0 150 L60 100 L120 130 L180 80 L240 120 L300 90 L360 140 L360 220 L0 220 Z" fill="#3a3a30" />
          <ellipse cx="200" cy="180" rx="180" ry="30" fill="#cfd6dc" opacity="0.3" />
          <g transform="translate(34 34)">
            <circle r="18" fill="rgba(30,22,12,0.65)" stroke="var(--gold-deep)" strokeWidth="0.8" />
            <Tx x="0" y="-9" anchor="middle" className="tiny">N</Tx>
            <path d="M0 -6 L-2 0 L0 3 L2 0 Z" fill="#c08a2a" />
          </g>
          <Rect x="300" y="12" w="50" h="22" rx="11" fill="rgba(30,22,12,0.7)" stroke="gold" />
          <Tx x="325" y="26" anchor="middle" className="lbl-text">↑ Exit</Tx>
          <Rect x="10" y="160" w="74" h="50" rx="2" fill="rgba(30,22,12,0.85)" stroke="gold" />
          <Tx x="14" y="170" className="tiny" style={{fill:'#f0d99a'}}>table map</Tx>
          <rect x="14" y="174" width="66" height="32" fill="#e8d8a8" opacity="0.85" />
          <Rect x="284" y="42" w="68" h="80" rx="2" fill="rgba(30,22,12,0.85)" stroke="gold" />
          <Tx x="318" y="54" anchor="middle" className="lbl-display" style={{fill:'#f0d99a'}}>PINS</Tx>
          {['East ridge','Old shrine','Goblin camp'].map((p,i) => (
            <Tx key={i} x="290" y={68 + i*14} className="tiny" style={{fill:'#f0d99a'}}>◆ {p}</Tx>
          ))}
          <Ann x1="284" y1="80" x2="240" y2="80" label="waypoint list · click to fly" anchor="end" gold />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

// ── Style Guide ───────────────────────────────────────────────────────────────
function StyleGuide() {
  const colors = [
    ['Ink','#2a2317','primary text'],['Ink soft','#5a4b35','secondary text'],
    ['Pencil','#8a7a5e','sketch strokes'],['Paper','#f6efde','base surface'],
    ['Paper deep','#ebe0c5','card surfaces'],['Gold','#c08a2a','primary accent / CTAs'],
    ['Gold deep','#9a6c18','hover / titles'],['Danger','#a83838','HP / hostile'],
    ['Moss','#5d7548','HP healthy / revealed'],['Mist','#6f8190','fog · neutral data'],
  ];
  return (
    <section className="screen" id="style">
      <div className="section-head">
        <span className="num">00</span><h2>Type · Color · Spacing</h2>
        <span className="ref">starter system · iterate</span>
      </div>
      <p className="section-intent">A first pass — not final. Designer should treat these as the gravitational center to push against.</p>
      <div className="guide-grid">
        <div className="guide-card">
          <h3>Typography</h3>
          <div className="type-stack">
            <div className="type-row">
              <div className="meta">Display · Cinzel 600 — headers, room codes, NPC titles</div>
              <div className="demo-cinzel" style={{fontSize:28,letterSpacing:'0.04em'}}>Tavern Table</div>
              <div className="demo-cinzel" style={{fontSize:16,letterSpacing:'0.1em'}}>DUNGEON · 4F2K9R</div>
            </div>
            <div className="type-row">
              <div className="meta">Body · Inter 400/500 — readable in dim glass panels</div>
              <div className="demo-inter" style={{fontSize:14}}>The bookshelf holds eleven volumes. One is hollow.</div>
            </div>
            <div className="type-row" style={{borderBottom:'none'}}>
              <div className="meta">Handwriting · Kalam — sketch labels &amp; this document only</div>
              <div className="demo-kalam" style={{fontSize:18}}>this row is a sketch annotation</div>
            </div>
          </div>
        </div>
        <div className="guide-card">
          <h3>Color palette</h3>
          <div className="swatches">
            {colors.map(([n,h,note]) => (
              <div key={h} className="swatch">
                <span className="chip" style={{background:h}} />
                <span className="lbl">{n}</span>
                <span className="hex">{h}</span>
                <div className="hex" style={{marginTop:2}}>{note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="guide-card">
          <h3>Spacing &amp; radius</h3>
          <div className="spacing-scale">
            {[4,8,12,16,24,32,48,64].map(s => (
              <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div className="step" style={{width:s,height:s+10}} />
                <div className="step-label">{s}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:18,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
            {[['Radius 2',2],['Radius 6',6],['Radius 12',12]].map(([l,r]) => (
              <div key={l}>
                <div style={{background:'#f3e2b8',border:'1.4px solid var(--ink)',borderRadius:r,height:46}} />
                <div style={{fontFamily:'Kalam,cursive',fontSize:12,color:'var(--ink-soft)',marginTop:4}}>{l}px</div>
              </div>
            ))}
          </div>
        </div>
        <div className="guide-card" style={{gridColumn:'span 2'}}>
          <h3>Tokens used across these sketches</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:14,fontFamily:'Kalam,cursive',fontSize:13,color:'var(--ink-soft)'}}>
            <div><b style={{color:'var(--ink)'}}>Avatars</b><br />Cinzel initial on amber circle, ink border. DM = gold border, hostile = red fill.</div>
            <div><b style={{color:'var(--ink)'}}>HP color ramp</b><br />&gt;60% moss, 30–60% amber, &lt;30% danger.</div>
            <div><b style={{color:'var(--ink)'}}>Icon style</b><br />1.2px line, rounded caps, ~16px in rail. Active = gold stroke.</div>
            <div><b style={{color:'var(--ink)'}}>Glass</b><br />Dark glass panels over 3D scene. Lighter glass (paper) on auth/lobby flow.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="page">
      <div className="cover">
        <span className="stamp">v1 · for review</span>
        <h1>Tavern Table — UI Wireframe Sketches</h1>
        <p className="sub">handed off to graphics &amp; UI · structure reference, not visual treatment</p>
        <div className="legend">
          <span><b>Scope</b> Auth · Lobby · DM · Player · Sheet · Dice · Chat · Peek · System</span>
          <span><b>Variations</b> 3 per screen — panel placement</span>
          <span><b>Fidelity</b> mid · paper + ink + amber</span>
        </div>
        <div className="toc">
          <a href="#style">00 · Type · Color · Spacing</a>
          <a href="#auth">01 · Auth Screen</a>
          <a href="#lobby-dm">02 · Lobby — DM</a>
          <a href="#lobby-player">03 · Lobby — Player</a>
          <a href="#dm-screen">04 · DM Screen</a>
          <a href="#player-screen">05 · Player Screen</a>
          <a href="#character">06 · Character Sheet</a>
          <a href="#dice">07 · Dice Roller</a>
          <a href="#chat">08 · Chat</a>
          <a href="#peek">09 · Peek Overlay</a>
        </div>
      </div>
      <StyleGuide />
      <AuthSection />
      <LobbyDMSection />
      <LobbyPlayerSection />
      <DMScreenSection />
      <PlayerScreenSection />
      <CharacterSheetSection />
      <DiceSection />
      <ChatSection />
      <PeekSection />
      <div className="divider">·  ·  ·  END OF SET  ·  ·  ·</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
