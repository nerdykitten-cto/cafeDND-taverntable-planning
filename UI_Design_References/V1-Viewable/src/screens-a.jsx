import { Sketch, ScreenSection, Canvas, Rect, Ln, Tx, Ann, Avatar, HPBar, RoomBackdrop, TableMap, IconRail, Icon } from './ui.jsx';

export function AuthSection() {
  return (
    <ScreenSection id="auth" num="01" title="Auth Screen" refTag="UI Dict §1"
      intent="Single magic-link email entry. Three takes on where the card sits and how much room the 3D atmosphere gets to breathe.">
      <Sketch title="A · Centered card" tag="classic, balanced"
        notes={['Card 320×240 on a soft ambient halo','Logo lockup top → tagline → input → CTA','All states (loading / sent / error) reuse the same card footprint']}>
        <Canvas>
          <ellipse cx="180" cy="110" rx="160" ry="90" fill="#f3e2b8" opacity="0.55" />
          <ellipse cx="180" cy="110" rx="90" ry="55" fill="#f8e8b8" opacity="0.55" />
          <Rect x="100" y="50" w="160" h="120" rx="3" fill="rgba(255,250,235,0.85)" />
          <Tx x="180" y="78" anchor="middle" className="lbl-display">TAVERN TABLE</Tx>
          <Ln x1="155" y1="84" x2="205" y2="84" stroke="gold" />
          <Tx x="180" y="98" anchor="middle" className="tiny">your table. your world.</Tx>
          <Rect x="115" y="110" w="130" h="14" rx="2" stroke="pencil" />
          <Tx x="120" y="119" className="tiny">you@email.com</Tx>
          <Rect x="115" y="132" w="130" h="16" rx="2" fill="#c08a2a" />
          <Tx x="180" y="143" anchor="middle" className="lbl-text">Send Magic Link</Tx>
          <Tx x="180" y="160" anchor="middle" className="tiny">invite-only · no signup</Tx>
          <Ann x1="180" y1="78" x2="40" y2="40" label="Cinzel display, ~32pt" anchor="start" />
          <Ann x1="245" y1="140" x2="335" y2="155" label="primary amber CTA" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="B · Split screen" tag="atmosphere right · form left"
        notes={['Left 40% holds form; right 60% reserved for hero render','Hero panel can become looping ambient video on Tauri','Better for marketing screenshots; same form chrome reused']}>
        <Canvas>
          <Rect x="0" y="0" w="144" h="220" fill="#fff7e3" stroke="pencil" />
          <Rect x="144" y="0" w="216" h="220" fill="#3a2c1c" />
          <g opacity="0.6">
            <circle cx="260" cy="110" r="50" fill="#f0d99a" opacity="0.18" />
            <circle cx="260" cy="110" r="28" fill="#f8e5ad" opacity="0.25" />
            <Tx x="252" y="113" className="lbl-display" anchor="middle">candle · table · 3D scene</Tx>
            <path d="M180 200 Q260 175 340 200" stroke="#c08a2a" fill="none" strokeWidth="0.8" />
          </g>
          <Tx x="20" y="50" className="lbl-display">TAVERN</Tx>
          <Tx x="20" y="64" className="lbl-display">TABLE</Tx>
          <Ln x1="20" y1="72" x2="60" y2="72" stroke="gold" />
          <Tx x="20" y="86" className="tiny">your table. your world.</Tx>
          <Tx x="20" y="112" className="lbl-text">email</Tx>
          <Rect x="20" y="116" w="108" h="14" stroke="pencil" />
          <Rect x="20" y="138" w="108" h="16" fill="#c08a2a" />
          <Tx x="74" y="149" anchor="middle" className="lbl-text">Send Magic Link</Tx>
          <Tx x="20" y="172" className="tiny">no password · invite-only</Tx>
          <Ann x1="260" y1="110" x2="330" y2="40" label="reserved for hero asset" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="C · Lower-third card" tag="hero-led, immersive"
        notes={['Top 60% is wordmark + atmosphere; form hugs the lower edge','Feels less like a webform and more like an invitation','Compact: small footprint on small windows']}>
        <Canvas bg="#2b2317">
          <RoomBackdrop x="0" y="0" w="360" h="140" />
          <Tx x="180" y="72" anchor="middle" className="lbl-display">TAVERN  TABLE</Tx>
          <Ln x1="150" y1="80" x2="210" y2="80" stroke="gold" />
          <Tx x="180" y="94" anchor="middle" className="tiny">— your table. your world. —</Tx>
          <Rect x="60" y="148" w="240" h="56" fill="rgba(255,250,235,0.9)" rx="2" />
          <Rect x="74" y="162" w="160" h="14" stroke="pencil" />
          <Tx x="80" y="171" className="tiny">enter your email…</Tx>
          <Rect x="244" y="162" w="44" h="14" fill="#c08a2a" />
          <Tx x="266" y="172" anchor="middle" className="lbl-text">Send</Tx>
          <Tx x="180" y="194" anchor="middle" className="tiny">we'll send a one-tap login link</Tx>
          <Ann x1="180" y1="72" x2="40" y2="30" label="3D room visible behind glass" anchor="start" />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

export function LobbyDMSection() {
  return (
    <ScreenSection id="lobby-dm" num="02" title="Lobby — DM View" refTag="UI Dict §2a"
      intent="DM creates a session, sees the join code prominently, watches the player list fill. Three layouts trade between code-as-hero and player-list-as-hero.">

      <Sketch title="A · Code is the hero" tag="big code, list below"
        notes={['Room code dominates → easy to read aloud','Copy-code button right of code','Start Session disabled until ≥1 player joins']}>
        <Canvas>
          <Rect x="20" y="14" w="320" h="194" rx="3" fill="rgba(255,250,235,0.6)" />
          <Tx x="30" y="30" className="lbl-display">SESSION LOBBY</Tx>
          <Tx x="320" y="30" anchor="end" className="tiny">DM · Marigold</Tx>
          <Ln x1="30" y1="36" x2="330" y2="36" stroke="pencil" />
          <Rect x="40" y="50" w="280" h="56" rx="3" fill="#fff5d8" stroke="gold" />
          <Tx x="180" y="68" anchor="middle" className="tiny">share this code with your party</Tx>
          <Tx x="180" y="92" anchor="middle" className="lbl-display">DUNGEON · 4F2K9R</Tx>
          <Rect x="280" y="56" w="32" h="14" rx="2" stroke="pencil" />
          <Tx x="296" y="65" anchor="middle" className="tiny">copy</Tx>
          <Tx x="40" y="124" className="tiny">session title</Tx>
          <Rect x="40" y="128" w="180" h="14" stroke="pencil" />
          <Tx x="44" y="138" className="tiny">The Sunken Crypts — Night 3</Tx>
          <Tx x="232" y="124" className="tiny">campaign</Tx>
          <Rect x="232" y="128" w="88" h="14" stroke="pencil" />
          <Tx x="236" y="138" className="tiny">Crypt Run ▾</Tx>
          <Tx x="40" y="158" className="lbl-text">connected players (3)</Tx>
          <Rect x="40" y="162" w="200" h="34" stroke="pencil" />
          {['A','B','C'].map((c,i) => (
            <g key={i}><Avatar cx={52 + i*60} cy={179} r="6" initial={c} /><Tx x={62 + i*60} y={181} className="tiny">{['Roan','Lia','Bex'][i]}</Tx></g>
          ))}
          <Rect x="248" y="178" w="72" h="20" rx="2" fill="#c08a2a" />
          <Tx x="284" y="192" anchor="middle" className="lbl-text">Start Session</Tx>
          <Ann x1="180" y1="92" x2="350" y2="60" label="64–72pt Cinzel · monospaced spacing" anchor="end" gold />
          <Ann x1="284" y1="188" x2="350" y2="200" label="disabled until ≥1 joins" anchor="end" />
        </Canvas>
      </Sketch>

      <Sketch title="B · Side-by-side" tag="form left · roster right"
        notes={['Left rail = config (code, title, campaign)','Right rail = roster, grows downward as players join','Start CTA pinned bottom-right']}>
        <Canvas>
          <Rect x="14" y="14" w="172" h="190" rx="3" fill="rgba(255,250,235,0.5)" />
          <Tx x="24" y="30" className="lbl-display">SETUP</Tx>
          <Ln x1="24" y1="36" x2="178" y2="36" stroke="pencil" />
          <Tx x="24" y="50" className="tiny">room code</Tx>
          <Rect x="24" y="54" w="118" h="22" rx="2" stroke="gold" />
          <Tx x="83" y="69" anchor="middle" className="lbl-display">4F2K9R</Tx>
          <Rect x="148" y="54" w="30" h="22" stroke="pencil" />
          <Tx x="163" y="68" anchor="middle" className="tiny">copy</Tx>
          <Tx x="24" y="92" className="tiny">session title</Tx>
          <Rect x="24" y="96" w="154" h="14" stroke="pencil" />
          <Tx x="24" y="124" className="tiny">campaign</Tx>
          <Rect x="24" y="128" w="154" h="14" stroke="pencil" />
          <Tx x="24" y="155" className="tiny">permissions</Tx>
          {['players move own tokens','allow whispers','show dice in chat'].map((t,i) => (
            <g key={i}>
              <Rect x="24" y={164 + i*10} w="6" h="6" stroke="pencil" />
              <Tx x="34" y={170 + i*10} className="tiny">{t}</Tx>
            </g>
          ))}
          <Rect x="196" y="14" w="150" h="190" rx="3" fill="rgba(255,250,235,0.5)" />
          <Tx x="206" y="30" className="lbl-display">PARTY</Tx>
          <Tx x="336" y="30" anchor="end" className="tiny">3 / 6</Tx>
          <Ln x1="206" y1="36" x2="338" y2="36" stroke="pencil" />
          {['Roan','Lia','Bex','—','—'].map((n,i) => (
            <g key={i}>
              <Rect x="206" y={46 + i*20} w="130" h="16" rx="1" stroke="pencil" dashed={n==='—'} />
              {n!=='—' && <Avatar cx={216} cy={54 + i*20} r="5" initial={n[0]} />}
              <Tx x={n==='—' ? 271 : 226} y={58 + i*20} anchor={n==='—'?'middle':'start'} className="tiny">{n==='—'?'empty seat':n}</Tx>
              {n!=='—' && <circle cx="328" cy={54 + i*20} r="2" fill="var(--moss)" />}
            </g>
          ))}
          <Rect x="206" y="176" w="130" h="20" rx="2" fill="#c08a2a" />
          <Tx x="271" y="190" anchor="middle" className="lbl-text">Start Session</Tx>
          <Ann x1="328" y1="54" x2="350" y2="40" label="live status dot" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="C · Floating over 3D" tag="see the room you're hosting"
        notes={['Background = live 3D Basement scene','Two glass panels float — code header + party drawer','Communicates immersion before play starts']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <Rect x="40" y="22" w="280" h="44" rx="3" fill="rgba(30,22,12,0.55)" stroke="gold" />
          <Tx x="56" y="40" className="lbl-display">ROOM CODE</Tx>
          <Tx x="56" y="58" className="lbl-display">· 4F2K9R ·</Tx>
          <Rect x="220" y="32" w="32" h="14" rx="2" stroke="gold" />
          <Tx x="236" y="42" anchor="middle" className="tiny">copy</Tx>
          <Tx x="220" y="58" className="tiny">share with your party</Tx>
          <Rect x="20" y="140" w="320" h="62" rx="3" fill="rgba(30,22,12,0.55)" stroke="gold" />
          <Tx x="32" y="156" className="lbl-display">PARTY · 3 / 6</Tx>
          {['R','L','B','?','?','?'].map((c,i) => (
            <g key={i}>
              <Avatar cx={42 + i*42} cy={180} r="9" initial={c} fill={c==='?'?'rgba(255,235,180,0.2)':'#f0d99a'} />
              <Tx x={42 + i*42} y={199} anchor="middle" className="tiny">{c==='?'?'open':['Roan','Lia','Bex'][i]}</Tx>
            </g>
          ))}
          <Rect x="276" y="166" w="56" h="24" rx="2" fill="#c08a2a" />
          <Tx x="304" y="181" anchor="middle" className="lbl-text">Start →</Tx>
          <Ann x1="60" y1="58" x2="40" y2="100" label="frosted glass over Basement scene" anchor="start" />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

export function LobbyPlayerSection() {
  return (
    <ScreenSection id="lobby-player" num="03" title="Lobby — Player View" refTag="UI Dict §2b"
      intent="A player types the 6-char code, then waits. Mostly a single-field flow — but waiting state can carry more or less context.">

      <Sketch title="A · One field, one button" tag="minimal join"
        notes={['One job: enter the code. Nothing else.','Code blanks animate as you type (slot per character)','Errors inline below input']}>
        <Canvas>
          <ellipse cx="180" cy="110" rx="170" ry="100" fill="#f3e2b8" opacity="0.4" />
          <Rect x="80" y="60" w="200" h="100" rx="3" fill="rgba(255,250,235,0.9)" />
          <Tx x="180" y="80" anchor="middle" className="lbl-display">JOIN A SESSION</Tx>
          <Ln x1="140" y1="86" x2="220" y2="86" stroke="gold" />
          {[0,1,2,3,4,5].map(i => (
            <g key={i}>
              <Rect x={104 + i*26} y="100" w="22" h="26" stroke="pencil" />
              <Tx x={115 + i*26} y="118" anchor="middle" className="lbl-display">{i<2?'4':'_'}</Tx>
            </g>
          ))}
          <Rect x="120" y="138" w="120" h="14" fill="#c08a2a" />
          <Tx x="180" y="148" anchor="middle" className="lbl-text">Join Session</Tx>
          <Ann x1="115" y1="113" x2="40" y2="60" label="6 slots · monospaced display font" anchor="start" />
        </Canvas>
      </Sketch>

      <Sketch title="B · Waiting state, focused" tag="post-join · DM hasn't started"
        notes={['After successful join, code panel collapses','Center stage = session name + DM status','Other players appear as they connect']}>
        <Canvas>
          <Rect x="40" y="30" w="280" h="160" rx="3" fill="rgba(255,250,235,0.85)" />
          <Tx x="180" y="50" anchor="middle" className="tiny">joined · room  4F2K9R  ✓</Tx>
          <Tx x="180" y="74" anchor="middle" className="lbl-display">THE SUNKEN CRYPTS</Tx>
          <Tx x="180" y="86" anchor="middle" className="tiny">campaign · Crypt Run</Tx>
          <Ln x1="120" y1="94" x2="240" y2="94" stroke="gold" />
          {['M','R','L','B','?'].map((c,i) => (
            <g key={i}>
              <Avatar cx={88 + i*46} cy={120} r="11" initial={c}
                fill={c==='M'?'#c08a2a':c==='?'?'rgba(180,160,120,0.3)':'#f0d99a'} />
              <Tx x={88 + i*46} y={142} anchor="middle" className="tiny">
                {c==='M'?'Marigold · DM':c==='?'?'waiting':['Roan','Lia','Bex'][i-1]}
              </Tx>
            </g>
          ))}
          <Tx x="180" y="170" anchor="middle" className="tiny">waiting for the DM to begin…</Tx>
          <circle cx="180" cy="180" r="4" fill="none" stroke="var(--gold-deep)" strokeWidth="1" strokeDasharray="3 3" />
          <Ann x1="88" y1="120" x2="40" y2="100" label="DM has gold ring" anchor="start" gold />
        </Canvas>
      </Sketch>

      <Sketch title="C · Persistent join chip" tag="code stays visible · room previews"
        notes={['Room code chip pinned top-left (in case DM re-shares)','Below: live thumbnail of the 3D room you\'re entering','Tone-setter — you can see where you\'re about to sit']}>
        <Canvas bg="#241c12">
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <Rect x="14" y="14" w="92" h="22" rx="2" fill="rgba(30,22,12,0.7)" stroke="gold" />
          <Tx x="60" y="29" anchor="middle" className="lbl-display">· 4F2K9R ·</Tx>
          <Rect x="60" y="138" w="240" h="64" rx="3" fill="rgba(30,22,12,0.65)" stroke="gold" />
          <Tx x="180" y="156" anchor="middle" className="lbl-display">THE BASEMENT</Tx>
          <Tx x="180" y="168" anchor="middle" className="tiny">Marigold's table · 3 of 6 here</Tx>
          {['M','R','L','B'].map((c,i) => (
            <Avatar key={i} cx={130 + i*22} cy={188} r="7" initial={c} fill={c==='M'?'#c08a2a':'#f0d99a'} />
          ))}
          <Tx x="225" y="190" className="tiny">waiting…</Tx>
          <Ann x1="60" y1="25" x2="40" y2="60" label="chip always visible" anchor="start" gold />
          <Ann x1="180" y1="156" x2="340" y2="180" label="live render hint of room you'll join" anchor="end" />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}

export function DMScreenSection() {
  const dmIcons = ['map','eye','person','sword','scroll','mask','bag','music','gear'];
  return (
    <ScreenSection id="dm-screen" num="04" title="DM Screen" refTag="UI Dict §3"
      intent="The DM's full session view. 3D room behind; tools docked. Three approaches differ on where panels live — rails vs floating vs bottom-docked.">

      <Sketch title="A · Twin sidebars (spec default)" tag="left icon rail · right always-on status"
        notes={['Left: 9-icon vertical rail (Map/Fog/Tokens/Encounter/Notes/NPC/Loot/Audio/Settings)','Right: always-visible session state — initiative, party HP, room code','Active panel slides out beside the left rail']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <g transform="translate(80 60)">
            <TableMap x="0" y="0" w="200" h="120" fogPct={0.4}
              tokens={[{x:0.2,y:0.4,fill:'#c08a2a'},{x:0.3,y:0.6,fill:'#c08a2a'},{x:0.45,y:0.3,fill:'#a83838'},{x:0.5,y:0.65,fill:'#a83838'}]} />
          </g>
          <IconRail x="8" y="14" w="22" h="184" icons={dmIcons} active={0} />
          <Rect x="34" y="14" w="86" h="184" rx="2" fill="rgba(30,22,12,0.65)" stroke="gold" />
          <Tx x="40" y="28" className="lbl-display">MAP EDITOR</Tx>
          <Ln x1="40" y1="32" x2="114" y2="32" stroke="gold" />
          <Tx x="40" y="44" className="tiny">tiles</Tx>
          {[0,1,2,3].map(r => [0,1,2,3].map(c => (
            <Rect key={`${r}${c}`} x={40 + c*18} y={48 + r*16} w="14" h="12" stroke="pencil"
              fill={(r===0&&c===1)?'#a8b88a':(r===1&&c===0)?'#cdb784':undefined} />
          )))}
          <Tx x="40" y="132" className="tiny">brush · 1×</Tx>
          {[1,2,3].map(n => <Rect key={n} x={40 + (n-1)*18} y="136" w="14" h="12" stroke={n===1?'gold':'pencil'} label={`${n}×`} />)}
          <Rect x="40" y="160" w="74" h="14" stroke="pencil" />
          <Tx x="44" y="170" className="tiny">save map…</Tx>
          <Rect x="40" y="178" w="74" h="14" fill="#c08a2a" />
          <Tx x="77" y="188" anchor="middle" className="lbl-text">Place</Tx>
          <Rect x="270" y="14" w="84" h="184" rx="2" fill="rgba(30,22,12,0.7)" stroke="gold" />
          <Tx x="278" y="28" className="lbl-display">SESSION</Tx>
          <Rect x="278" y="34" w="20" h="9" fill="#5d7548" rx="1" />
          <Tx x="288" y="40" anchor="middle" className="tiny">LIVE</Tx>
          <Tx x="304" y="40" className="tiny">4F2K9R</Tx>
          <Ln x1="278" y1="48" x2="346" y2="48" stroke="pencil" />
          <Tx x="278" y="58" className="lbl-text">initiative</Tx>
          {[
            {n:'Goblin A', hp:0.3, init:18, active:true},
            {n:'Roan', hp:0.7, init:15},
            {n:'Lia', hp:0.9, init:12},
            {n:'Bex', hp:0.4, init:9},
          ].map((c,i) => (
            <g key={i}>
              {c.active && <rect x="276" y={62 + i*16} width="74" height="14" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.5" />}
              <Avatar cx={284} cy={69 + i*16} r="4" initial={c.n[0]} fill={c.n.includes('Goblin')?'#a83838':'#f0d99a'} />
              <Tx x={291} y={71 + i*16} className="tiny">{c.n}</Tx>
              <HPBar x={291} y={73 + i*16} w={36} pct={c.hp} h={2.4} />
              <Tx x={346} y={71 + i*16} anchor="end" className="tiny">{c.init}</Tx>
            </g>
          ))}
          <Ln x1="278" y1="132" x2="346" y2="132" stroke="pencil" />
          <Tx x="278" y="142" className="lbl-text">party</Tx>
          {['Roan','Lia','Bex'].map((n,i) => (
            <g key={i}>
              <Avatar cx={284} cy={152 + i*14} r="4" initial={n[0]} />
              <Tx x={292} y={154 + i*14} className="tiny">{n}</Tx>
              <HPBar x={314} y={150 + i*14} w={32} pct={[0.7,0.9,0.4][i]} h={2.4} />
            </g>
          ))}
          <Rect x="158" y="186" w="44" h="14" rx="2" fill="#c08a2a" />
          <Tx x="180" y="196" anchor="middle" className="lbl-text">Peek ▾</Tx>
          <Ann x1="20" y1="20" x2="20" y2="6" label="icon rail" anchor="middle" />
          <Ann x1="312" y1="22" x2="354" y2="6" label="always-visible status" anchor="end" gold />
        </Canvas>
      </Sketch>

      <Sketch title="B · Floating glass panels" tag="3D-first · panels draggable"
        notes={['Tools open as draggable cards over the scene, like spread-out notes','No fixed rails — small launcher dock top-left','Best for ultrawide / multi-monitor DMs']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="220" />
          <g transform="translate(110 70)">
            <TableMap x="0" y="0" w="160" h="100" fogPct={0.35}
              tokens={[{x:0.25,y:0.4},{x:0.3,y:0.55},{x:0.55,y:0.3,fill:'#a83838'}]} />
          </g>
          <Rect x="12" y="12" w="120" h="20" rx="2" fill="rgba(30,22,12,0.7)" stroke="gold" />
          {dmIcons.map((k,i) => (
            <g key={i} transform={`translate(${20 + i*12} 22)`}><Icon kind={k} cx="0" cy="0" size={5} /></g>
          ))}
          <Ann x1="72" y1="22" x2="100" y2="4" label="floating tool launcher" anchor="end" />
          <g transform="rotate(-1 270 60)">
            <Rect x="240" y="40" w="106" h="80" rx="2" fill="rgba(255,250,235,0.92)" />
            <Tx x="248" y="54" className="lbl-display">ENCOUNTER</Tx>
            <Ln x1="248" y1="58" x2="338" y2="58" stroke="gold" />
            {['Goblin A','Roan','Lia'].map((n,i) => (
              <g key={i}>
                <Tx x="248" y={70 + i*12} className="tiny">{n}</Tx>
                <HPBar x="288" y={66 + i*12} w={40} pct={[0.3,0.7,0.9][i]} h={2.4} />
              </g>
            ))}
            <Rect x="248" y="108" w="50" h="10" fill="#c08a2a" />
            <Tx x="273" y="115" anchor="middle" className="tiny">Next turn ▶</Tx>
          </g>
          <g transform="rotate(2 80 160)">
            <Rect x="18" y="118" w="100" h="80" rx="2" fill="rgba(255,250,235,0.92)" />
            <Tx x="26" y="132" className="lbl-display">NOTES</Tx>
            <Ln x1="26" y1="136" x2="110" y2="136" stroke="gold" />
            {[0,1,2,3,4].map(i => <Ln key={i} x1="26" y1={146 + i*8} x2="110" y2={146 + i*8} stroke="pencil" />)}
            <Tx x="26" y="194" className="tiny">saved · 14s ago</Tx>
          </g>
          <g transform="rotate(-1 290 170)">
            <Rect x="234" y="140" w="116" h="60" rx="2" fill="rgba(30,22,12,0.85)" stroke="gold" />
            <Tx x="244" y="154" className="lbl-display">AUDIO</Tx>
            <Tx x="244" y="170" className="tiny">Cave Drips · loop</Tx>
            <Rect x="244" y="174" w="98" h="3" fill="rgba(192,138,42,0.4)" />
            <Rect x="244" y="174" w="56" h="3" fill="#c08a2a" />
            {['door','thunder','coin','scream'].map((s,i) => (
              <Rect key={i} x={244 + i*24} y="184" w="22" h="10" rx="1" stroke="gold" label={s} labelClass="tiny" />
            ))}
          </g>
          <Ann x1="80" y1="160" x2="40" y2="200" label="cards drag freely · z-stack" anchor="start" />
        </Canvas>
      </Sketch>

      <Sketch title="C · Bottom-dock workbench" tag="like an OBS studio · 3D fills frame"
        notes={['Wide 3D viewport — tools collapse into bottom workbench','Tabs across bottom: Map · Fog · Tokens · Encounter · Notes · …','Right corner = quick status badge only (no full sidebar)']}>
        <Canvas>
          <RoomBackdrop x="0" y="0" w="360" h="160" />
          <g transform="translate(70 28)">
            <TableMap x="0" y="0" w="220" h="120" fogPct={0.35}
              tokens={[{x:0.25,y:0.4},{x:0.35,y:0.55},{x:0.55,y:0.4,fill:'#a83838'},{x:0.6,y:0.6,fill:'#a83838'}]} />
          </g>
          <Rect x="280" y="12" w="72" h="22" rx="11" fill="rgba(30,22,12,0.75)" stroke="gold" />
          <circle cx="290" cy="23" r="3" fill="var(--moss)" />
          <Tx x="298" y="26" className="tiny">LIVE · 4F2K9R</Tx>
          <Rect x="8" y="158" w="344" h="52" rx="3" fill="rgba(30,22,12,0.85)" stroke="gold" />
          {dmIcons.map((k,i) => {
            const x = 16 + i*36;
            const active = i===3;
            return (
              <g key={i}>
                {active && <rect x={x-2} y="162" width="34" height="22" rx="2" fill="rgba(192,138,42,0.25)" stroke="var(--gold-deep)" strokeWidth="0.6" />}
                <g transform={`translate(${x+15} 173)`}><Icon kind={k} cx="0" cy="0" size={6} gold={active} /></g>
                <Tx x={x+15} y="190" anchor="middle" className="tiny">
                  {['map','fog','tokens','encntr','notes','NPCs','loot','audio','set'][i]}
                </Tx>
              </g>
            );
          })}
          <Ann x1="180" y1="158" x2="180" y2="138" label="3D viewport fills 70% of height" anchor="middle" />
          <Ann x1="124" y1="184" x2="20" y2="160" label="encounter active" anchor="start" gold />
        </Canvas>
      </Sketch>
    </ScreenSection>
  );
}
