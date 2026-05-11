/* ══════════════════════════════════════════════════════════════════
   CafeDND / Tavern Table — Roadmap App
   Requires: data.js loaded before this file
══════════════════════════════════════════════════════════════════ */

const ALL_PHASES = [...RESEARCH_PHASES, ...GODOT_PHASES];

/* ── HELPERS ──────────────────────────────────────────────────────── */
function el(id)    { return document.getElementById(id); }
function html(sel) { return document.querySelector(sel); }

function trackPillClass(track) {
  return track === 'RESEARCH' ? 'pill-research' : 'pill-godot';
}

function phaseById(id) {
  return ALL_PHASES.find(p => p.id === id);
}

function allPhaseIds() {
  return ALL_PHASES.map(p => p.id);
}

function adjacentPhases(id) {
  const ids = allPhaseIds();
  const i = ids.indexOf(id);
  return {
    prev: i > 0 ? phaseById(ids[i - 1]) : null,
    next: i < ids.length - 1 ? phaseById(ids[i + 1]) : null,
  };
}

/* ── BUILD LEGEND ─────────────────────────────────────────────────── */
function buildLegend() {
  const items = [
    { color: '#00bcd4', label: 'Research Track' },
    { color: '#26c6da', label: 'Room & Scene' },
    { color: '#4caf50', label: 'Peek & Map' },
    { color: '#ff9800', label: 'Multiplayer' },
    { color: '#ef5350', label: 'Game Systems' },
    { color: '#9c27b0', label: 'UI & Interface' },
    { color: '#8bc34a', label: 'Polish & QA' },
    { color: '#ffc107', label: 'Playtesting' },
    { color: '#c9a227', label: 'Godot Track' },
  ];
  el('legend').innerHTML = items.map(i =>
    `<div class="legend-item">
       <span class="legend-dot" style="background:${i.color}"></span>${i.label}
     </div>`
  ).join('');
}

/* ── BUILD TIMELINE SECTION ───────────────────────────────────────── */
function buildTrack(phases, containerId) {
  const wrap = el(containerId);
  let html = '';
  phases.forEach((p, i) => {
    if (i > 0) {
      html += `<div class="tl-connector"></div>`;
    }
    const pillClass = trackPillClass(p.track);
    html += `
      <div class="tl-row">
        <div class="tl-badge">
          <div class="tl-dot" style="--dot-color:${p.color}">${p.icon}</div>
          <span class="tl-num">${p.id}</span>
        </div>
        <div class="tl-card" style="--card-color:${p.color}" onclick="showPhase('${p.id}')">
          <div class="card-body">
            <div class="card-meta">
              <span class="track-pill ${pillClass}">${p.track}</span>
              <span class="card-timeline">${p.timeline}</span>
            </div>
            <div class="card-title">${p.title}</div>
            <div class="card-snippet">${p.snippet}</div>
          </div>
          <span class="card-arrow">→</span>
        </div>
      </div>`;
  });
  wrap.innerHTML = html;
}

/* ── BUILD ALT PATHS ──────────────────────────────────────────────── */
function buildPaths() {
  el('paths-grid').innerHTML = ALT_PATHS.map(p => `
    <div class="path-card" style="--pc:${p.color}">
      ${p.rec ? '<span class="path-rec">★ Recommended</span>' : ''}
      <span class="path-badge-pill">${p.badge}</span>
      <h3 class="path-title">${p.title}</h3>
      <p class="path-time">${p.timeline}</p>
      <p class="path-desc">${p.desc}</p>
      <ul class="path-list">${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
      <p class="path-tradeoff">${p.tradeoff}</p>
    </div>
  `).join('');
}

/* ── RENDER PHASE DETAIL ──────────────────────────────────────────── */
function renderPhaseDetail(id) {
  const p = phaseById(id);
  if (!p) return;

  const { prev, next } = adjacentPhases(id);
  const pillClass = trackPillClass(p.track);

  const tasksHtml = p.tasks.map(t => `
    <div class="task-item">
      <span class="task-dot" style="background:${p.color}"></span>
      <span>${t}</span>
    </div>`).join('');

  const prevBtn = prev
    ? `<div class="phase-nav-btn" onclick="showPhase('${prev.id}')">
         <span class="nav-arrow">←</span>
         <div class="nav-meta">
           <div class="nav-label">Previous</div>
           <div class="nav-phase-title">${prev.icon} ${prev.title}</div>
         </div>
       </div>`
    : `<div class="phase-nav-btn disabled">
         <span class="nav-arrow">←</span>
         <div class="nav-meta"><div class="nav-label">Previous</div><div class="nav-phase-title">Start</div></div>
       </div>`;

  const nextBtn = next
    ? `<div class="phase-nav-btn next" onclick="showPhase('${next.id}')">
         <div class="nav-meta">
           <div class="nav-label">Next</div>
           <div class="nav-phase-title">${next.icon} ${next.title}</div>
         </div>
         <span class="nav-arrow">→</span>
       </div>`
    : `<div class="phase-nav-btn next disabled">
         <div class="nav-meta"><div class="nav-label">Next</div><div class="nav-phase-title">End</div></div>
         <span class="nav-arrow">→</span>
       </div>`;

  el('phase-content').innerHTML = `
    <div class="phase-hero" style="--phase-accent:${p.color}">
      <div class="phase-hero-meta">
        <span class="ph-num">PHASE ${p.id}</span>
        <span class="track-pill ${pillClass}">${p.track}</span>
        <span class="ph-time">${p.timeline}</span>
      </div>
      <div class="hero-title-row">
        <span class="hero-icon">${p.icon}</span>
        <div>
          <h1 class="hero-main-title" style="color:${p.color}">${p.title}</h1>
          <p class="hero-sub">${p.subtitle}</p>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="ds-label">Goal</div>
      <p class="goal-text">${p.goal}</p>
    </div>

    <div class="detail-section">
      <div class="ds-label">Key Tasks</div>
      <div class="tasks-grid">${tasksHtml}</div>
    </div>

    <div class="detail-section">
      <div class="ds-label">Deliverable</div>
      <div class="deliverable-box" style="--phase-accent:${p.color}">
        <div class="deliverable-label" style="color:${p.color}">✓ Phase Complete When</div>
        <p class="deliverable-text">${p.deliverable}</p>
      </div>
    </div>

    <div class="detail-section">
      <div class="ds-label">Gate Question</div>
      <div class="gate-box">
        <span style="font-size:16px;flex-shrink:0">🔑</span>
        <div>
          <div class="gate-q-label">Ask before moving to the next phase</div>
          <p class="gate-q-text">${p.gate}</p>
        </div>
      </div>
    </div>

    <div class="phase-nav">${prevBtn}${nextBtn}</div>
  `;
}

/* ── ROUTER ───────────────────────────────────────────────────────── */
function showPhase(id) {
  renderPhaseDetail(id);
  el('view-main').classList.remove('active');
  el('view-phase').classList.add('active');
  el('back-btn').style.display = 'flex';

  const p = phaseById(id);
  const crumb = el('phase-crumb');
  if (crumb && p) crumb.textContent = `${p.icon} ${p.title}`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({ phase: id }, '', '#phase-' + id);
}

function goHome() {
  el('view-phase').classList.remove('active');
  el('view-main').classList.add('active');
  el('back-btn').style.display = 'none';
  const crumb = el('phase-crumb');
  if (crumb) crumb.textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({}, '', '#');
}

window.addEventListener('popstate', () => {
  const hash = location.hash;
  if (hash.startsWith('#phase-')) {
    const id = hash.replace('#phase-', '');
    const p = phaseById(id);
    if (p) { showPhase(id); return; }
  }
  goHome();
});

/* ── THEME ────────────────────────────────────────────────────────── */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  el('theme-btn').textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('cafeTheme', t);
}

function toggleTheme() {
  setTheme(
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
}

/* ── INIT ─────────────────────────────────────────────────────────── */
(function init() {
  const saved = localStorage.getItem('cafeTheme');
  setTheme(saved || 'dark');

  buildLegend();
  buildTrack(RESEARCH_PHASES, 'research-timeline');
  buildTrack(GODOT_PHASES,    'godot-timeline');
  buildPaths();

  const hash = location.hash;
  if (hash.startsWith('#phase-')) {
    const id = hash.replace('#phase-', '');
    const p = phaseById(id);
    if (p) { showPhase(id); return; }
  }
})();
