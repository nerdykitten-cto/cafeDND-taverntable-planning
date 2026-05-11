/* global React, Sketch, ScreenSection, Canvas, Rect, Circ, Ln, Tx, Ann, PencilGrid, Icon, IconRail, Avatar, HPBar, RoomBackdrop, TableMap, Tape */
// =====================================================================
//  Screens B — Player · Character · Dice · Chat · Peek · Style Guide
// =====================================================================

// ---------- 5. PLAYER SCREEN ----------
function PlayerScreenSection() {
  return (
    <ScreenSection id="player-screen" num="05" title="Player Screen" refTag="UI Dict §4"
      intent="A player's session view. Minimal HUD; the 3D room is the protagonist. Three placements for the always-on controls.">

      <Sketch title="A · Bottom bar (spec default)"
        tag="persistent dock at the foot"
        notes={['Character name + HP pinned bottom-left','Tabs (Character / Dice / Chat) center · Peek on right','Panels rise upward from the dock when tapped']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <g transform="translate(70 50)">
            <TableMap x="0" y="0" w="220" h="110" fogPct={0.3}
              tokens={[{x:0.25,y:0.5},{x:0.4,y:0.55,fill:'#5d7548'},{x:0.6,y:0.4,fill:'#a83838'}]} />
          </g>
          {/* turn chip */}
          <Rect x="130" y="14" w="100" h="20" rx="10" fill="rgba(192,138,42,0.85)" stroke="gold" />
          <Tx x="180" y="27" anchor="middle" className="lbl-text">★ Your Turn — Roan</Tx>
          {/* bottom bar */}
          <Rect x="8" y="180" w="344" h="32" rx="3" fill="rgba(30,22,12,0.85)" stroke="gold" />
          <Avatar cx="22" cy="196" r="9" initial="R" />
          <Tx x="36" y="194" className="lbl-display" >ROAN STORMFOOT</Tx>
          <Tx x="36" y="204" className="tiny" >HP</Tx>
          <HPBar x="46" y="202" w="40" pct={0.7} h={3} />
          <Tx x="90" y="205" className="tiny" >32 / 45</Tx>
          {/* tabs */}
          {['character','die','chat'].map((k,i) => {
            const x = 150 + i*48;
            const active = i===0;
            return (
              <g key={i}>
                {active && <rect x={x-4} y="184" width="40" height="24" rx="2" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.6" />}
                <g transform={`translate(${x+16} 198)`}><Icon kind={k} cx="0" cy="0" size={6} gold={active} /></g>
                <Tx x={x+16} y="210" anchor="middle" className="tiny" >{['Sheet','Dice','Chat'][i]}</Tx>
              </g>
            );
          })}
          {/* peek button */}
          <Rect x="300" y="186" w="44" h="20" rx="2" fill="#c08a2a" />
          <Tx x="322" y="200" anchor="middle" className="lbl-text">Peek ▾</Tx>
          <Ann x1="180" y1="34" x2="40" y2="46" label="auto-dismiss after 4s" anchor="start" gold />
          <Ann x1="322" y1="196" x2="350" y2="160" label="signature action — never hidden" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="B · Corner radial cluster"
        tag="immersive · controls tucked"
        notes={['Bottom-right radial: tap center to fan tools out','Top-left mini-portrait + HP only','Most surface area free for 3D scene']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <g transform="translate(70 30)">
            <TableMap x="0" y="0" w="220" h="150" fogPct={0.3}
              tokens={[{x:0.25,y:0.5},{x:0.4,y:0.55,fill:'#5d7548'},{x:0.6,y:0.4,fill:'#a83838'}]} />
          </g>
          {/* top-left portrait */}
          <Rect x="12" y="12" w="100" h="36" rx="18" fill="rgba(30,22,12,0.8)" stroke="gold" />
          <Avatar cx="28" cy="30" r="11" initial="R" />
          <Tx x="42" y="26" className="lbl-display" >ROAN</Tx>
          <HPBar x="42" y="32" w="60" pct={0.7} h={3} />
          <Tx x="42" y="44" className="tiny" >HP 32/45</Tx>
          {/* radial cluster bottom-right */}
          <circle cx="312" cy="190" r="22" fill="rgba(192,138,42,0.85)" stroke="var(--gold-deep)" strokeWidth="1" />
          <Tx x="312" y="194" anchor="middle" className="lbl-display" >PEEK</Tx>
          {/* fanned petals */}
          {[
            {a: 200, k: 'character', l:'Sheet'},
            {a: 230, k: 'die', l:'Dice'},
            {a: 260, k: 'chat', l:'Chat'},
          ].map(p => {
            const rad = p.a * Math.PI/180;
            const cx = 312 + Math.cos(rad)*40;
            const cy = 190 + Math.sin(rad)*40;
            return (
              <g key={p.a}>
                <circle cx={cx} cy={cy} r="11" fill="rgba(30,22,12,0.85)" stroke="var(--gold-deep)" strokeWidth="0.8" />
                <g transform={`translate(${cx} ${cy})`}><Icon kind={p.k} cx="0" cy="0" size={6} gold /></g>
                <Tx x={cx} y={cy+18} anchor="middle" className="tiny" >{p.l}</Tx>
              </g>
            );
          })}
          <Ann x1="312" y1="190" x2="270" y2="100" label="hold-to-Peek; tap petal to open panel" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="C · Right-edge tab strip"
        tag="docked vertically · ergonomic"
        notes={['Vertical tab strip right edge; panels slide in from right','HP / portrait pin top-left, separate from tools','Comfortable when 3D map fills bottom half']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <g transform="translate(40 50)">
            <TableMap x="0" y="0" w="240" h="130" fogPct={0.3}
              tokens={[{x:0.25,y:0.5},{x:0.4,y:0.55,fill:'#5d7548'},{x:0.6,y:0.4,fill:'#a83838'}]} />
          </g>
          {/* portrait top-left */}
          <Rect x="10" y="10" w="120" h="32" rx="2" fill="rgba(30,22,12,0.8)" stroke="gold" />
          <Avatar cx="24" cy="26" r="9" initial="R" />
          <Tx x="38" y="22" className="lbl-display">ROAN</Tx>
          <HPBar x="38" y="28" w="84" pct={0.7} h={3} />
          <Tx x="38" y="40" className="tiny">32 / 45 HP · Lv 4</Tx>
          {/* tab strip right */}
          <Rect x="332" y="10" w="22" h="200" rx="2" fill="rgba(30,22,12,0.85)" stroke="gold" />
          {['character','die','chat','peek'].map((k,i) => {
            const cy = 28 + i*44;
            const active = i===0;
            return (
              <g key={i}>
                {active && <rect x="334" y={cy-12} width="18" height="24" rx="1" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.6" />}
                <g transform={`translate(343 ${cy-3})`}><Icon kind={k} cx="0" cy="0" size={7} gold={active} /></g>
                <Tx x="343" y={cy+12} anchor="middle" className="tiny" >{['sheet','dice','chat','peek'][i]}</Tx>
              </g>
            );
          })}
          <Ann x1="343" y1="200" x2="280" y2="200" label="bottom tab = Peek · subtly larger" anchor="end" gold />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

// ---------- 6. CHARACTER SHEET ----------
function CharacterSheetSection() {
  return (
    <ScreenSection id="character" num="06" title="Character Sheet Panel" refTag="UI Dict §4.2"
      intent="A 5e sheet packs a lot of state. Three layouts trade between scrolling, density and at-a-glance.">

      <Sketch title="A · Two-column scroll"
        tag="default · dense, complete"
        notes={['Left: header + abilities + skills + combat','Right: attacks, spells, equipment','Edit-lock toggle top-right · scrolls vertically']}>
        <Canvas vb="0 0 360 240">
          <Rect x="6" y="6" w="348" h="228" rx="3" fill="rgba(255,250,235,0.9)" stroke="gold" />
          {/* header */}
          <Tx x="16" y="22" className="lbl-display">ROAN STORMFOOT</Tx>
          <Tx x="16" y="32" className="tiny">Half-Orc Fighter · Lv 4 · Folk Hero · Lawful Good</Tx>
          <Rect x="16" y="36" w="180" h="3" stroke="pencil" />
          <Rect x="16" y="36" w="100" h="3" fill="#c08a2a" />
          <Tx x="200" y="32" className="tiny">XP 2,750 / 6,500</Tx>
          <Rect x="280" y="14" w="64" h="14" rx="7" stroke="gold" />
          <Tx x="312" y="24" anchor="middle" className="tiny">🔒 Edit lock</Tx>
          <Ln x1="6" y1="46" x2="354" y2="46" stroke="pencil" />
          {/* left column */}
          <Tx x="16" y="58" className="lbl-display">ABILITIES</Tx>
          {['STR','DEX','CON','INT','WIS','CHA'].map((s,i) => {
            const x = 14 + (i%3)*54, y = 64 + Math.floor(i/3)*32;
            return (
              <g key={s}>
                <Rect x={x} y={y} w="50" h="28" rx="2" stroke="ink" />
                <Tx x={x+25} y={y+9} anchor="middle" className="tiny" >{s}</Tx>
                <Tx x={x+25} y={y+20} anchor="middle" className="lbl-display" >{[16,14,15,10,12,8][i]}</Tx>
                <Tx x={x+25} y={y+26} anchor="middle" className="tiny" >{['+3','+2','+2','+0','+1','-1'][i]}</Tx>
              </g>
            );
          })}
          <Tx x="16" y="138" className="lbl-display">SKILLS</Tx>
          {['Athletics','Intimidation','Perception','Survival'].map((s,i) => (
            <g key={s}>
              <circle cx="20" cy={146 + i*10} r="2" fill={i<2?'#c08a2a':'none'} stroke="var(--ink)" strokeWidth="0.6" />
              <Tx x="26" y={149 + i*10} className="tiny">{s}</Tx>
              <Tx x="90" y={149 + i*10} anchor="end" className="tiny">{['+5','+1','+3','+3'][i]}</Tx>
            </g>
          ))}
          <Tx x="100" y="138" className="lbl-display">COMBAT</Tx>
          {[['AC',17],['Init','+2'],['Speed',30]].map((p,i) => (
            <g key={i}>
              <Rect x={100 + i*22} y="142" w="20" h="22" stroke="pencil" />
              <Tx x={110 + i*22} y="151" anchor="middle" className="tiny" >{p[0]}</Tx>
              <Tx x={110 + i*22} y="162" anchor="middle" className="lbl-display" >{p[1]}</Tx>
            </g>
          ))}
          <Tx x="100" y="175" className="tiny">HP</Tx>
          <HPBar x="112" y="172" w="50" pct={0.7} h={6} />
          <Tx x="100" y="190" className="tiny">32 / 45 (+0 tmp)</Tx>
          <Tx x="100" y="204" className="tiny">Hit dice: 4/4 d10  ·  Death ◇◇◇ ⚊⚊⚊</Tx>
          {/* right column */}
          <Ln x1="180" y1="50" x2="180" y2="228" stroke="pencil" dashed />
          <Tx x="190" y="58" className="lbl-display">ATTACKS</Tx>
          {[['Greataxe','+5','1d12+3 slash'],['Javelin','+5','1d6+3 pierce']].map((a,i) => (
            <g key={i}>
              <Rect x="190" y={64 + i*16} w="158" h="14" stroke="pencil" />
              <Tx x="194" y={73 + i*16} className="tiny">{a[0]}</Tx>
              <Tx x="240" y={73 + i*16} className="tiny">{a[1]}</Tx>
              <Tx x="270" y={73 + i*16} className="tiny">{a[2]}</Tx>
            </g>
          ))}
          <Tx x="190" y="106" className="lbl-display">EQUIPMENT</Tx>
          {[0,1,2,3].map(i => <Ln key={i} x1="190" y1={114 + i*8} x2="348" y2={114 + i*8} stroke="pencil" />)}
          <Tx x="190" y="156" className="tiny">CP 12  ·  SP 30  ·  GP 84  ·  PP 1</Tx>
          <Tx x="190" y="172" className="lbl-display">FEATURES</Tx>
          {['Second Wind (1/sr)','Action Surge (1/sr)','Fighting Style: Defense'].map((f,i) => (
            <g key={i}>
              <Tx x="190" y={184 + i*10} className="tiny" >▸ {f}</Tx>
            </g>
          ))}
          <Tx x="190" y="220" className="tiny">notes…</Tx>
          <Ann x1="55" y1="78" x2="40" y2="56" label="ability tile · score above mod" anchor="start" />
          <Ann x1="156" y1="172" x2="180" y2="240" label="HP editable on click · broadcasts" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="B · Tabbed by domain"
        tag="combat / spells / gear / bio"
        notes={['Top tabs split the sheet — less scroll, more focus','Active tab fills the body; header always visible','Best for laptops & quick mid-combat reference']}>
        <Canvas vb="0 0 360 240">
          <Rect x="6" y="6" w="348" h="228" rx="3" fill="rgba(255,250,235,0.9)" stroke="gold" />
          {/* persistent header */}
          <Avatar cx="22" cy="22" r="10" initial="R" />
          <Tx x="36" y="20" className="lbl-display">ROAN STORMFOOT</Tx>
          <Tx x="36" y="30" className="tiny">Half-Orc Fighter · Lv 4</Tx>
          <Tx x="200" y="20" className="tiny">HP</Tx>
          <HPBar x="212" y="16" w="60" pct={0.7} h={6} />
          <Tx x="200" y="30" className="tiny">32 / 45</Tx>
          <Tx x="280" y="20" className="tiny">AC 17</Tx>
          <Tx x="280" y="30" className="tiny">Init +2</Tx>
          <Tx x="320" y="20" className="tiny">Spd 30</Tx>
          <Ln x1="6" y1="42" x2="354" y2="42" stroke="pencil" />
          {/* tabs */}
          {['Combat','Spells','Gear','Bio','Notes'].map((t,i) => {
            const active = i===0;
            const x = 14 + i*60;
            return (
              <g key={t}>
                {active && <rect x={x-4} y="46" width="56" height="20" rx="2" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.6" />}
                <Tx x={x+24} y="59" anchor="middle" className={active?'lbl-display':'tiny'}>{t}</Tx>
              </g>
            );
          })}
          <Ln x1="6" y1="70" x2="354" y2="70" stroke="pencil" />
          {/* combat body */}
          <Tx x="16" y="84" className="lbl-display">ABILITIES</Tx>
          {['STR','DEX','CON','INT','WIS','CHA'].map((s,i) => (
            <g key={s}>
              <Rect x={14 + i*56} y="90" w="50" h="30" stroke="ink" />
              <Tx x={39 + i*56} y="100" anchor="middle" className="tiny">{s}</Tx>
              <Tx x={39 + i*56} y="114" anchor="middle" className="lbl-display">{[16,14,15,10,12,8][i]}</Tx>
            </g>
          ))}
          <Tx x="16" y="138" className="lbl-display">ATTACKS</Tx>
          {[['Greataxe','+5','1d12+3 slash'],['Javelin','+5','1d6+3 pierce']].map((a,i) => (
            <g key={i}>
              <Rect x="14" y={144 + i*14} w="200" h="12" stroke="pencil" />
              <Tx x="18" y={153 + i*14} className="tiny">{a[0]}</Tx>
              <Tx x="80" y={153 + i*14} className="tiny">{a[1]}</Tx>
              <Tx x="120" y={153 + i*14} className="tiny">{a[2]}</Tx>
              <Rect x="180" y={146 + i*14} w="30" h="8" fill="#c08a2a" />
              <Tx x="195" y={152 + i*14} anchor="middle" className="tiny">Roll</Tx>
            </g>
          ))}
          <Tx x="222" y="138" className="lbl-display">SAVES</Tx>
          {['STR +5','CON +4','DEX +2','WIS +1'].map((s,i) => (
            <g key={i}>
              <Rect x={222 + (i%2)*66} y={144 + Math.floor(i/2)*14} w="62" h="12" stroke="pencil" />
              <Tx x={253 + (i%2)*66} y={153 + Math.floor(i/2)*14} anchor="middle" className="tiny">{s}</Tx>
            </g>
          ))}
          <Tx x="16" y="186" className="lbl-display">DEATH SAVES</Tx>
          {[0,1,2].map(i => (
            <g key={i}>
              <circle cx={18 + i*12} cy="200" r="3.5" stroke="var(--moss)" fill="none" strokeWidth="0.8" />
              <Tx x={18 + i*12} y="212" anchor="middle" className="tiny">✓</Tx>
            </g>
          ))}
          {[0,1,2].map(i => (
            <g key={i}>
              <circle cx={68 + i*12} cy="200" r="3.5" stroke="var(--danger)" fill="none" strokeWidth="0.8" />
              <Tx x={68 + i*12} y="212" anchor="middle" className="tiny">✗</Tx>
            </g>
          ))}
          <Tx x="120" y="186" className="lbl-display">FEATURES</Tx>
          <Rect x="120" y="190" w="228" h="40" stroke="pencil" />
          {['Second Wind (1/short rest)','Action Surge (1/short rest)','Fighting Style: Defense'].map((f,i) => (
            <Tx key={i} x="124" y={200 + i*10} className="tiny" >▸ {f}</Tx>
          ))}
          <Ann x1="38" y1="59" x2="40" y2="220" label="domain tabs · no scroll" anchor="start" gold />
        </Canvas>
      </Sketch>

      <Sketch title="C · Single column, sticky header"
        tag="mobile-shaped · stream of sections"
        notes={['One narrow column — same in any window size','Sticky character header always visible','Sections collapse · long-press to pin a section open']}>
        <Canvas vb="0 0 360 240">
          {/* center the sheet narrow */}
          <Rect x="100" y="6" w="160" h="228" rx="3" fill="rgba(255,250,235,0.95)" stroke="gold" />
          {/* sticky header */}
          <Rect x="100" y="6" w="160" h="40" fill="#f3e2b8" />
          <Avatar cx="116" cy="26" r="11" initial="R" />
          <Tx x="132" y="22" className="lbl-display" >ROAN STORMFOOT</Tx>
          <Tx x="132" y="32" className="tiny" >HF · Fighter 4</Tx>
          <Tx x="132" y="42" className="tiny" >HP 32/45 · AC 17</Tx>
          <Ln x1="100" y1="46" x2="260" y2="46" stroke="gold" />
          {/* sections */}
          {[
            ['ABILITIES', '▾'],
            ['SAVES', '▸'],
            ['SKILLS', '▸'],
            ['COMBAT', '▾'],
            ['ATTACKS', '▾'],
            ['SPELLS', '▸'],
            ['EQUIPMENT', '▸'],
            ['FEATURES', '▸'],
            ['NOTES', '▸'],
          ].map(([t,c],i) => (
            <g key={i}>
              <Rect x="108" y={52 + i*18} w="144" h="14" stroke="pencil"
                fill={c==='▾'?'rgba(192,138,42,0.12)':'none'} />
              <Tx x="114" y={62 + i*18} className="lbl-display">{t}</Tx>
              <Tx x="248" y={62 + i*18} anchor="end" className="tiny">{c}</Tx>
            </g>
          ))}
          <Tx x="180" y="226" anchor="middle" className="tiny" >scrolls vertically  ↕</Tx>
          {/* margin notes pointing in */}
          <Ann x1="100" y1="26" x2="40" y2="20" label="sticky" anchor="start" gold />
          <Ann x1="260" y1="115" x2="332" y2="115" label="one tap collapses · long-press pins open" anchor="start" />
          <Ann x1="180" y1="226" x2="180" y2="240" label="single column scroll" anchor="middle" />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

Object.assign(window, { PlayerScreenSection, CharacterSheetSection });
