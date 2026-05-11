import pptxgen from 'pptxgenjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ssDir = path.join(__dirname, 'screenshots');

const slides = [
  { file: 's00-style-guide.png',    title: 'Style Guide',            sub: 'Typography · Color Palette · Spacing System' },
  { file: 's01-auth.png',           title: '01 — Auth Screen',       sub: 'Magic-link email entry · UI Dict §1' },
  { file: 's02-lobby-dm.png',       title: '02 — Lobby (DM View)',   sub: 'Session creation · player join list · UI Dict §2a' },
  { file: 's03-lobby-player.png',   title: '03 — Lobby (Player)',    sub: '6-char code entry · waiting state · UI Dict §2b' },
  { file: 's04-dm-screen.png',      title: '04 — DM Screen',         sub: '3D room · toolbar · 9 panels · UI Dict §3' },
  { file: 's05-player-screen.png',  title: '05 — Player Screen',     sub: 'Minimal HUD · bottom bar · 4 panels · UI Dict §4' },
  { file: 's06-character-sheet.png',title: '06 — Character Sheet',   sub: 'Full 5e sheet panel · stats, skills, spells · UI Dict §4.2' },
  { file: 's07-dice-roller.png',    title: '07 — Dice Roller',       sub: '3D physics dice · roll history · UI Dict §4.3' },
  { file: 's08-chat-panel.png',     title: '08 — Chat Panel',        sub: 'Table / OOC / Whisper channels · NPC portraits · UI Dict §4.4' },
  { file: 's09-peek-overlay.png',   title: '09 — Peek Overlay',      sub: 'Signature mechanic · camera dives through table · UI Dict §4.5' },
];

const GOLD = '8B6914';
const INK  = '2C1810';
const PAPER = 'F5F0E8';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

// ── Title slide ──────────────────────────────────────────────────────────────
const cover = pres.addSlide();
cover.background = { color: INK };
cover.addText('TAVERN TABLE', {
  x: 0, y: 1.8, w: '100%', h: 1,
  align: 'center', fontSize: 48, bold: true, color: GOLD, fontFace: 'Georgia',
});
cover.addText('UI Wireframe Sketches — V1', {
  x: 0, y: 3.0, w: '100%', h: 0.6,
  align: 'center', fontSize: 22, color: PAPER, fontFace: 'Georgia',
});
cover.addText('Research Version · Track 1', {
  x: 0, y: 3.7, w: '100%', h: 0.5,
  align: 'center', fontSize: 14, color: 'AAAAAA', fontFace: 'Calibri',
});
cover.addText(`CafeDND · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, {
  x: 0, y: 6.8, w: '100%', h: 0.4,
  align: 'center', fontSize: 11, color: '666666', fontFace: 'Calibri',
});

// ── Screen slides ─────────────────────────────────────────────────────────────
for (const s of slides) {
  const slide = pres.addSlide();
  slide.background = { color: PAPER };

  // Screenshot — left column, full height
  slide.addImage({
    path: path.join(ssDir, s.file),
    x: 0, y: 0, w: 9.5, h: 7.5,
    sizing: { type: 'contain', w: 9.5, h: 7.5 },
  });

  // Right info strip
  slide.addShape(pres.ShapeType.rect, {
    x: 9.5, y: 0, w: 3.83, h: 7.5,
    fill: { color: INK }, line: { color: INK },
  });
  slide.addText(s.title, {
    x: 9.6, y: 0.5, w: 3.6, h: 1.2,
    fontSize: 20, bold: true, color: GOLD, fontFace: 'Georgia', wrap: true,
  });
  slide.addText(s.sub, {
    x: 9.6, y: 1.9, w: 3.6, h: 1.5,
    fontSize: 13, color: PAPER, fontFace: 'Calibri', wrap: true,
  });
}

await pres.writeFile({ fileName: path.join(__dirname, '..', '..', 'TavernTable-UI-Wireframes-V1.pptx') });
console.log('Done → TavernTable-UI-Wireframes-V1.pptx');
