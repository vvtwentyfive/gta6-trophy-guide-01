// The Leonida Ledger — main module: loads the trophy data, renders the
// checklist, the guide panel, the roadmap and the missable box, and wires the
// filters, the spoiler setting and progress export/import.
import { KINDS, countByKind, trophyMatches, isSpoilerHidden, spoilerLabel } from './filters.js';
import {
  loadEarned,
  saveEarned,
  loadSpoilers,
  saveSpoilers,
  downloadExport,
  parseImport,
} from './storage.js';
import { ROADMAP, renderRoadmap } from './roadmap.js';

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const hintEl = document.getElementById('result-hint');
const emptyEl = document.getElementById('empty');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilersEl = document.getElementById('spoilers');
const chipsEl = document.getElementById('kind-chips');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byName = new Map(trophies.map((t) => [t.name, t]));
const sourceUrls = doc.sources ?? {};

let earned = loadEarned();
let spoilersOn = loadSpoilers();
let kind = 'all';
let selected = byName.get('Positive Mental Attitude') ?? trophies[0];

spoilersEl.checked = spoilersOn;

/** Recompute the header progress line and grade counts. */
function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  document.getElementById('progress-count').textContent = `${done} of ${total} earned`;
  document.getElementById('progress-pct').textContent = `${Math.round((done / total) * 100)}%`;
  document.getElementById('progress-fill').style.width = `${(done / total) * 100}%`;
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('grade-counts').textContent = grades
    .map((g) => {
      const inGrade = trophies.filter((t) => t.grade === g);
      const got = inGrade.filter((t) => earned.has(t.name)).length;
      return `${got}/${inGrade.length} ${g}`;
    })
    .join(' · ');
}

/** One badge element. */
function badge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}

/** Render the checklist rows for the current filters. */
function renderRows() {
  rowsEl.replaceChildren();
  const query = searchEl.value.trim();
  const shown = trophies.filter((t) => trophyMatches(t, { kind, grade: gradeEl.value, query }));
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'row' + (earned.has(t.name) ? ' earned' : '') + (selected === t ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned(earned);
      renderAll();
    });
    const main = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'name';
    const desc = document.createElement('div');
    desc.className = 'desc';
    if (isSpoilerHidden(t, spoilersOn, earned)) {
      name.textContent = spoilerLabel(t);
      desc.textContent = 'Story trophy — hidden until earned.';
    } else {
      name.textContent = t.name;
      desc.textContent = t.description;
    }
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(badge(t.grade, t.grade));
    meta.append(badge(t.kind, 'kind'));
    if (t.hidden) meta.append(badge('Hidden on PS', 'hidden-flag'));
    if (t.missable) meta.append(badge('⚠ Possibly missable', 'missable'));
    if (t.checked_in_game === false) meta.append(badge('Not yet checked in game', 'unchecked'));
    if (typeof t.count === 'number') meta.append(badge(`× ${t.count.toLocaleString('en-US')}`, ''));
    main.append(name, desc, meta);
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Guide';
    open.addEventListener('click', () => {
      selected = t;
      renderAll();
      detailEl.scrollIntoView({ block: 'nearest' });
    });
    li.append(box, main, open);
    li.addEventListener('click', (e) => {
      if (e.target === box || e.target === open) return;
      selected = t;
      renderAll();
    });
    rowsEl.append(li);
  }
  emptyEl.hidden = shown.length > 0;
  hintEl.textContent =
    kind === 'online'
      ? 'Online: 0 trophies — every trophy is single-player (PowerPyx, GTABase).'
      : `${shown.length} of ${trophies.length} trophies shown.`;
}

/** Render the guide panel for the selected trophy. */
function renderDetail() {
  detailEl.replaceChildren();
  const t = selected;
  if (!t) return;
  const h3 = document.createElement('h3');
  const official = document.createElement('p');
  official.className = 'official';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  const sources = document.createElement('p');
  sources.className = 'sources';
  let warnEl = null;
  if (isSpoilerHidden(t, spoilersOn, earned)) {
    h3.textContent = 'Hidden story trophy';
    official.textContent = 'Spoilers are on: this story trophy stays hidden until you earn it. Tick it off in the checklist to reveal its name, description and guide.';
    guide.textContent = '';
  } else {
    h3.textContent = t.name;
    official.textContent = `Official: “${t.description}” — ${t.grade}${t.hidden ? ' · hidden on PlayStation until earned' : ''}${typeof t.count === 'number' ? ` · PlayStation tracks ${t.count.toLocaleString('en-US')}` : ''}.`;
    guide.textContent = t.guide;
    if (t.missable) {
      warnEl = document.createElement('div');
      warnEl.className = 'warn';
      const strong = document.createElement('strong');
      strong.textContent = '⚠ Possibly missable — UNCONFIRMED. ';
      warnEl.append(strong, document.createTextNode(t.missable_note ?? 'The only trophy any guide flags as possibly missable.'));
    }
    sources.textContent = 'Sources: ';
    for (const name of t.sources) {
      const url = sourceUrls[name];
      if (typeof url === 'string' && url.startsWith('http')) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = name;
        sources.append(a);
      } else {
        const s = document.createElement('span');
        s.textContent = name;
        sources.append(s);
      }
      sources.append(document.createTextNode(' '));
    }
  }
  const meta = document.createElement('p');
  meta.className = 'sources';
  meta.textContent = `Grade: ${t.grade} · Kind: ${t.kind} · Roadmap stage ${t.roadmap_stage} of ${ROADMAP.length}`;
  const nodes = [h3, official];
  if (warnEl) nodes.push(warnEl);
  nodes.push(guide, sources, meta);
  detailEl.append(...nodes);
}

/** Render the missable-trophy box (exactly one trophy is flagged). */
function renderMissables() {
  const box = document.getElementById('missable-box');
  box.replaceChildren();
  const flagged = trophies.filter((t) => t.missable);
  if (flagged.length === 0) {
    box.textContent = 'No missable trophies reported.';
    return;
  }
  for (const t of flagged) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const h3 = document.createElement('h3');
    h3.textContent = `⚠ ${t.name} — possibly missable (UNCONFIRMED)`;
    const p = document.createElement('p');
    p.textContent = t.missable_note ?? '';
    const p2 = document.createElement('p');
    p2.textContent =
      'PowerPyx and GTABase both flag only this one trophy, and only as a maybe: the Chapter 1 balcony meditation may or may not be required. Every other trophy can be earned after the story in free roam.';
    card.append(h3, p, p2);
    box.append(card);
  }
}

/** Render the source list in the footer. */
function renderSourceList() {
  const ul = document.getElementById('source-list');
  ul.replaceChildren();
  for (const [name, url] of Object.entries(sourceUrls)) {
    const li = document.createElement('li');
    li.textContent = `${name}: `;
    if (typeof url === 'string' && url.startsWith('http')) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = url;
      li.append(a);
    } else {
      li.append(document.createTextNode(String(url)));
    }
    ul.append(li);
  }
}

/** Render the kind filter chips with per-kind counts. */
function renderChips() {
  const counts = countByKind(trophies);
  chipsEl.replaceChildren();
  for (const k of KINDS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('aria-pressed', String(kind === k.key));
    b.textContent = `${k.label} `;
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = `(${counts[k.key] ?? 0})`;
    b.append(n);
    b.addEventListener('click', () => {
      kind = k.key;
      renderAll();
    });
    chipsEl.append(b);
  }
}

function renderAll() {
  renderProgress();
  renderChips();
  renderRows();
  renderDetail();
  renderRoadmap(document.getElementById('roadmap'), byName, earned);
}

searchEl.addEventListener('input', renderRows);
gradeEl.addEventListener('change', renderRows);
spoilersEl.addEventListener('change', () => {
  spoilersOn = spoilersEl.checked;
  saveSpoilers(spoilersOn);
  renderAll();
});
document.getElementById('export').addEventListener('click', () => {
  downloadExport(earned);
  hintEl.textContent = `Exported ${earned.size} earned trophies to leonida-ledger-progress.json.`;
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const { earned: next, kept, dropped } = parseImport(await file.text(), trophies.map((t) => t.name));
    earned = next;
    saveEarned(earned);
    renderAll();
    hintEl.textContent = `Imported ${kept} earned trophies${dropped ? ` (${dropped} unknown names skipped)` : ''}.`;
  } catch (err) {
    hintEl.textContent = `Import failed: ${err.message}`;
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  earned = new Set();
  saveEarned(earned);
  renderAll();
  hintEl.textContent = 'Progress reset — 0 of 55 earned.';
});

renderMissables();
renderSourceList();
renderAll();
