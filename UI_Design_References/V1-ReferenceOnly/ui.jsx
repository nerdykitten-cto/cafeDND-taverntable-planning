/* global React */
// =====================================================================
//  Tavern Table — Sketch primitives
//  All sketches share these wrappers + the inline SVG helper components.
// =====================================================================

const { useId } = React;

/** Outer card wrapper for a single variation. */
function Sketch({ title, tag, children, notes }) {
  return (
    <div className="sketch">
      <h3>{title}</h3>
      {tag && <p className="tag">{tag}</p>}
      <div className="frame">{children}</div>
      {notes && (
        <ul className="notes">
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );
}

/** Section header + 3 variation row. */
function ScreenSection({ id, num, title, refTag, intent, children }) {
  return (
    <section className="screen" id={id}>
      <div className="section-head">
        <span className="num">{num}</span>
        <h2>{title}</h2>
        {refTag && <span className="ref">{refTag}</span>}
      </div>
      {intent && <p className="section-intent">{intent}</p>}
      <div className="variants">{children}</div>
    </section>
  );
}

/** A standard 1080-ish viewport frame for full screens. 360 x 220 viewBox = 16:9.8 */
function Canvas({ vb = '0 0 360 220', children, bg = '#fffaee' }) {
  return (
    <svg className="canvas" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="100%" height="100%" fill={bg} />
      {children}
    </svg>
  );
}

/** Wobbly rectangle — sketchy stroke, optional fill, label centered. */
function Rect({ x, y, w, h, fill, stroke = 'ink', sw, dashed, rx = 0, label, labelClass = 'lbl-text', labelDy = 0 }) {
  const cls = stroke === 'gold' ? 'stroke-gold'
            : stroke === 'pencil' ? 'stroke-pencil'
            : 'stroke-ink';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
            className={cls}
            fill={fill || 'none'}
            strokeWidth={sw}
            strokeDasharray={dashed ? '3 2' : undefined} />
      {label && (
        <text x={x + w / 2} y={y + h / 2 + 3 + labelDy}
              textAnchor="middle" className={labelClass}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Sketchy circle (filled or stroked). */
function Circ({ cx, cy, r, fill, stroke = 'ink', dashed }) {
  const cls = stroke === 'gold' ? 'stroke-gold' : stroke === 'pencil' ? 'stroke-pencil' : 'stroke-ink';
  return <circle cx={cx} cy={cy} r={r} className={cls} fill={fill || 'none'}
                 strokeDasharray={dashed ? '2 2' : undefined} />;
}

/** Hand-drawn line. */
function Ln({ x1, y1, x2, y2, stroke = 'ink', dashed, sw }) {
  const cls = stroke === 'gold' ? 'stroke-gold' : stroke === 'pencil' ? 'stroke-pencil' : 'stroke-ink';
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={cls} strokeWidth={sw}
               strokeDasharray={dashed ? '3 2' : undefined} />;
}

/** Text. */
function Tx({ x, y, children, className = 'lbl-text', anchor = 'start' }) {
  return <text x={x} y={y} textAnchor={anchor} className={className}>{children}</text>;
}

/** Annotation arrow + label outside the sketch zone. */
function Ann({ x1, y1, x2, y2, label, anchor = 'start', dy = 0, gold }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} className="ann-leader" />
      <circle cx={x1} cy={y1} r="1.4" fill={gold ? 'var(--gold-deep)' : 'var(--ink)'} />
      <text x={x2 + (anchor === 'end' ? -2 : 2)} y={y2 + dy + 3}
            textAnchor={anchor}
            className={'ann-text' + (gold ? ' gold' : '')}>
        {label}
      </text>
    </g>
  );
}

/** A faint dot/pencil-grid backdrop, useful inside the table-surface view. */
function PencilGrid({ x, y, w, h, step = 8 }) {
  const lines = [];
  for (let i = step; i < w; i += step) lines.push(<Ln key={`v${i}`} x1={x + i} y1={y} x2={x + i} y2={y + h} stroke="pencil" sw={0.4} />);
  for (let j = step; j < h; j += step) lines.push(<Ln key={`h${j}`} x1={x} y1={y + j} x2={x + w} y2={y + j} stroke="pencil" sw={0.4} />);
  return <g opacity="0.45">{lines}</g>;
}

/** Icon glyph — quick sketches inside toolbar slots. */
function Icon({ kind, cx, cy, size = 6, gold }) {
  const s = size;
  const cls = gold ? 'stroke-gold' : 'stroke-ink';
  const x = cx - s / 2, y = cy - s / 2;
  switch (kind) {
    case 'map':
      return (<g className={cls}>
        <path d={`M${x} ${y + s} L${x + s * 0.33} ${y} L${x + s * 0.66} ${y + s} L${x + s} ${y}`} />
        <path d={`M${x + s * 0.33} ${y} L${x + s * 0.33} ${y + s}`} />
        <path d={`M${x + s * 0.66} ${y} L${x + s * 0.66} ${y + s}`} />
      </g>);
    case 'eye':
      return (<g className={cls}>
        <path d={`M${x} ${cy} Q${cx} ${y - 1} ${x + s} ${cy} Q${cx} ${y + s + 1} ${x} ${cy} Z`} />
        <circle cx={cx} cy={cy} r={s * 0.18} fill="currentColor" stroke="none" />
      </g>);
    case 'person':
      return (<g className={cls}>
        <circle cx={cx} cy={y + s * 0.28} r={s * 0.22} />
        <path d={`M${x + s * 0.15} ${y + s} Q${cx} ${y + s * 0.45} ${x + s * 0.85} ${y + s}`} />
      </g>);
    case 'sword':
      return (<g className={cls}>
        <path d={`M${x + s * 0.2} ${y + s} L${x + s} ${y}`} />
        <path d={`M${x + s * 0.05} ${y + s - 1} L${x + s * 0.35} ${y + s + 1}`} />
        <path d={`M${x + s * 0.7} ${y + 0.5} L${x + s * 0.95} ${y - 0.5}`} />
      </g>);
    case 'scroll':
      return (<g className={cls}>
        <path d={`M${x} ${y + 1} Q${x + 1} ${y - 1} ${x + s} ${y + 1} L${x + s} ${y + s - 1} Q${x + s - 1} ${y + s + 1} ${x} ${y + s - 1} Z`} />
        <path d={`M${x + 1.5} ${y + s * 0.4} L${x + s - 1.5} ${y + s * 0.4}`} />
        <path d={`M${x + 1.5} ${y + s * 0.7} L${x + s - 1.5} ${y + s * 0.7}`} />
      </g>);
    case 'mask':
      return (<g className={cls}>
        <path d={`M${x + 1} ${y + 1} Q${cx} ${y - 1.5} ${x + s - 1} ${y + 1} Q${x + s + 0.5} ${cy + 1} ${cx} ${y + s} Q${x - 0.5} ${cy + 1} ${x + 1} ${y + 1} Z`} />
        <circle cx={cx - s * 0.22} cy={cy - s * 0.05} r={s * 0.07} fill="currentColor" stroke="none" />
        <circle cx={cx + s * 0.22} cy={cy - s * 0.05} r={s * 0.07} fill="currentColor" stroke="none" />
      </g>);
    case 'bag':
      return (<g className={cls}>
        <path d={`M${x + 1} ${y + s * 0.3} L${x + s - 1} ${y + s * 0.3} L${x + s - 0.5} ${y + s} L${x + 0.5} ${y + s} Z`} />
        <path d={`M${x + s * 0.3} ${y + s * 0.3} Q${cx} ${y - 0.5} ${x + s * 0.7} ${y + s * 0.3}`} />
      </g>);
    case 'music':
      return (<g className={cls}>
        <path d={`M${x + 1} ${y + s} L${x + 1} ${y + 1.5} L${x + s - 1} ${y} L${x + s - 1} ${y + s - 1}`} />
        <circle cx={x + 1.5} cy={y + s - 0.5} r="1.2" />
        <circle cx={x + s - 1.5} cy={y + s - 1.5} r="1.2" />
      </g>);
    case 'gear':
      return (<g className={cls}>
        <circle cx={cx} cy={cy} r={s * 0.32} />
        <circle cx={cx} cy={cy} r={s * 0.12} fill="currentColor" stroke="none" />
        {[0, 60, 120, 180, 240, 300].map(a => {
          const r1 = s * 0.32, r2 = s * 0.48;
          const rad = a * Math.PI / 180;
          return <line key={a}
            x1={cx + Math.cos(rad) * r1} y1={cy + Math.sin(rad) * r1}
            x2={cx + Math.cos(rad) * r2} y2={cy + Math.sin(rad) * r2} />;
        })}
      </g>);
    case 'die':
      return (<g className={cls}>
        <path d={`M${cx} ${y} L${x + s} ${y + s * 0.3} L${cx} ${y + s} L${x} ${y + s * 0.3} Z`} />
        <path d={`M${cx} ${y} L${cx} ${y + s}`} />
        <path d={`M${x} ${y + s * 0.3} L${x + s} ${y + s * 0.3}`} />
      </g>);
    case 'chat':
      return (<g className={cls}>
        <path d={`M${x} ${y + 1} L${x + s} ${y + 1} L${x + s} ${y + s - 2} L${cx + 1} ${y + s - 2} L${cx - 1} ${y + s} L${cx - 1} ${y + s - 2} L${x} ${y + s - 2} Z`} />
      </g>);
    case 'peek':
      return (<g className={cls}>
        <path d={`M${x} ${cy - 1} L${x + s} ${cy - 1}`} />
        <path d={`M${cx - 1.5} ${cy - 1} L${cx} ${y + s} L${cx + 1.5} ${cy - 1}`} />
      </g>);
    case 'character':
      return (<g className={cls}>
        <circle cx={cx} cy={y + s * 0.28} r={s * 0.18} />
        <path d={`M${cx} ${y + s * 0.5} L${cx} ${y + s * 0.85}`} />
        <path d={`M${x + 1.5} ${y + s * 0.65} L${x + s - 1.5} ${y + s * 0.65}`} />
        <path d={`M${cx - 1.5} ${y + s * 0.85} L${cx} ${y + s * 0.7} L${cx + 1.5} ${y + s * 0.85}`} />
      </g>);
    default: return null;
  }
}

/** A simple toolbar-rail with a list of icon slots. */
function IconRail({ x, y, w, h, icons, active = 0, vertical = true }) {
  const padding = 4;
  const slot = vertical
    ? (h - padding * 2) / icons.length
    : (w - padding * 2) / icons.length;
  return (
    <g>
      <Rect x={x} y={y} w={w} h={h} rx={2} fill="rgba(40,30,15,0.06)" />
      {icons.map((kind, i) => {
        const cx = vertical ? x + w / 2 : x + padding + slot * (i + 0.5);
        const cy = vertical ? y + padding + slot * (i + 0.5) : y + h / 2;
        const isActive = i === active;
        return (
          <g key={i}>
            {isActive && <rect
              x={vertical ? x + 1 : cx - slot / 2 + 1}
              y={vertical ? cy - slot / 2 + 1 : y + 1}
              width={vertical ? w - 2 : slot - 2}
              height={vertical ? slot - 2 : h - 2}
              fill="#f0d99a" stroke="var(--gold-deep)" strokeWidth="0.8" rx="1.5" />}
            <g transform={`translate(${cx} ${cy})`}>
              <g transform="translate(-3 -3)">
                <Icon kind={kind} cx={3} cy={3} size={6} gold={isActive} />
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** Avatar bubble — circle with initial. */
function Avatar({ cx, cy, r = 6, initial, fill = '#f0d99a' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="var(--ink)" strokeWidth="0.8" />
      <text x={cx} y={cy + r * 0.45} textAnchor="middle"
            style={{ fontFamily: 'Cinzel, serif', fontSize: r * 0.9, fill: 'var(--ink)' }}>{initial}</text>
    </g>
  );
}

/** HP bar — filled width based on pct. */
function HPBar({ x, y, w, h = 3, pct = 0.7, color }) {
  const c = color || (pct > 0.6 ? 'var(--moss)' : pct > 0.3 ? '#c8902a' : 'var(--danger)');
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="rgba(40,30,15,0.08)" stroke="var(--ink)" strokeWidth="0.6" rx="0.5" />
      <rect x={x + 0.4} y={y + 0.4} width={(w - 0.8) * pct} height={h - 0.8} fill={c} />
    </g>
  );
}

/** Bookshelf-style 3D room hint behind the UI — used in DM/Player full screens. */
function RoomBackdrop({ x, y, w, h }) {
  return (
    <g>
      {/* horizon */}
      <rect x={x} y={y} width={w} height={h} fill="#f3e6c5" />
      <rect x={x} y={y + h * 0.45} width={w} height={h * 0.55} fill="#e6d5ac" />
      {/* shelves left */}
      <g opacity="0.55">
        <rect x={x + 4} y={y + h * 0.05} width={w * 0.13} height={h * 0.4} fill="none" stroke="var(--ink-soft)" strokeWidth="0.6" />
        {[0.15, 0.25, 0.35].map(t => (
          <line key={t} x1={x + 4} y1={y + h * t} x2={x + 4 + w * 0.13} y2={y + h * t}
                stroke="var(--ink-soft)" strokeWidth="0.5" />
        ))}
        {/* books */}
        {[0, 1, 2].map(row => (
          <g key={row}>
            {[0, 1, 2, 3, 4, 5].map(k => (
              <rect key={k}
                x={x + 5 + k * (w * 0.13 - 2) / 6}
                y={y + h * (0.06 + row * 0.1)}
                width={(w * 0.13 - 2) / 6 - 0.5} height={h * 0.08}
                fill={k % 2 ? '#c08a2a' : '#7d4f1f'} opacity="0.4" />
            ))}
          </g>
        ))}
      </g>
      {/* lamp glow right */}
      <g opacity="0.6">
        <circle cx={x + w * 0.85} cy={y + h * 0.35} r={h * 0.18} fill="#f8e5ad" />
        <circle cx={x + w * 0.85} cy={y + h * 0.35} r={h * 0.1} fill="#fff5cf" />
      </g>
      {/* table edge (foreground) */}
      <ellipse cx={x + w / 2} cy={y + h * 0.95} rx={w * 0.45} ry={h * 0.06} fill="#5b3a18" opacity="0.55" />
    </g>
  );
}

/** Tactical-map dressing for the table surface (top-down). */
function TableMap({ x, y, w, h, fogPct = 0.4, tokens = [] }) {
  return (
    <g>
      {/* base */}
      <rect x={x} y={y} width={w} height={h} fill="#e8d8a8" stroke="var(--ink)" strokeWidth="1" rx="2" />
      <PencilGrid x={x} y={y} w={w} h={h} step={6} />
      {/* terrain blobs */}
      <path d={`M${x + w * 0.15} ${y + h * 0.2} Q${x + w * 0.3} ${y + h * 0.05} ${x + w * 0.5} ${y + h * 0.18} Q${x + w * 0.45} ${y + h * 0.4} ${x + w * 0.2} ${y + h * 0.4} Z`}
            fill="#b9c79a" stroke="var(--moss)" strokeWidth="0.6" opacity="0.7" />
      <path d={`M${x + w * 0.55} ${y + h * 0.55} Q${x + w * 0.75} ${y + h * 0.4} ${x + w * 0.92} ${y + h * 0.58} Q${x + w * 0.85} ${y + h * 0.85} ${x + w * 0.6} ${y + h * 0.8} Z`}
            fill="#a8b88a" stroke="var(--moss)" strokeWidth="0.6" opacity="0.7" />
      {/* fog covering right half */}
      <rect x={x + w * (1 - fogPct)} y={y} width={w * fogPct} height={h}
            fill="rgba(50,55,70,0.55)" />
      <text x={x + w * (1 - fogPct / 2)} y={y + h / 2 + 2} textAnchor="middle"
            style={{ fontFamily: 'Caveat,cursive', fontSize: 8, fill: '#ddd2b5' }}>fog of war</text>
      {/* tokens */}
      {tokens.map((t, i) => (
        <g key={i}>
          <circle cx={x + t.x * w} cy={y + t.y * h} r="2.5" fill={t.fill || '#c08a2a'} stroke="var(--ink)" strokeWidth="0.5" />
        </g>
      ))}
    </g>
  );
}

/** Tape strip — small decorative banner. */
function Tape({ x, y, w = 30, h = 6, rot = -1, text }) {
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} fill="rgba(220,195,130,0.6)" stroke="rgba(140,110,60,0.35)" strokeDasharray="2 2" strokeWidth="0.4" />
      {text && <text x={x + w / 2} y={y + h * 0.75} textAnchor="middle"
                     style={{ fontFamily: 'Kalam,cursive', fontSize: h * 0.6, fill: 'var(--ink-soft)' }}>{text}</text>}
    </g>
  );
}

Object.assign(window, {
  Sketch, ScreenSection, Canvas,
  Rect, Circ, Ln, Tx, Ann, PencilGrid,
  Icon, IconRail, Avatar, HPBar, RoomBackdrop, TableMap, Tape,
});
