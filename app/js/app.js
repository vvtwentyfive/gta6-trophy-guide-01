// app.js — bootstrap for The Leonida Ledger.
//
// Loads data/trophies.json (the only fetch the app makes, a relative path
// to its own file), enriches each trophy with its kind, missable flag and
// roadmap stage, then wires the checklist, the filters, the spoiler
// setting, the detail pane, the roadmap and missables views, and the
// export/import tools. Progress and settings are saved in localStorage.

import { loadState, saveState, setEarned, isEarned } from './state.js';
import { enrichTrophies } from './classify.js';
import { renderProgress, renderTrophyList, renderListMeta, trophyKey } from './render.js';
import { openDetail, closeDetail } from './detail.js';
import { renderRoadmap, renderMissables, switchView } from './views.js';
import { downloadExport, parseImport, readFileAsText } from './io.js';

const DATA_URL = 'data/trophies.json';

let trophies = [];
let state = loadState();
let currentView = 'checklist';
let filters = { kind: 'all', grade: 'all', query: '', hideEarned: state.hideEarned };

const els = {
  list: document.getElementById('trophyList'),
  meta: document.getElementById('listMeta'),
  empty: document.getElementById('emptyNote'),
  roadmapView: document.getElementById('roadmapView'),
  missablesView: document.getElementById('missablesView'),
  roadmapStages: document.getElementById('roadmapStages'),
  missablesList: document.getElementById('missablesList'),
  detailPane: document.getElementById('detailPane'),
  detailBody: document.getElementById('detailBody'),
  search: document.getElementById('searchInput'),
  gradeSelect: document.getElementById('gradeSelect'),
  hideEarnedToggle: document.getElementById('hideEarnedToggle'),
  spoilerToggle: document.getElementById('spoilerToggle'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),
  resetBtn: document.getElementById('resetBtn'),
  kindFilters: document.getElementById('kindFilters'),
  tabs: [...document.querySelectorAll('.view-tab')],
};

function findTrophy(id) {
  return trophies.find((t) => trophyKey(t) === id);
}

function refreshAll() {
  // The hide-earned filter mirrors the saved setting; read it fresh here so
  // a toggle takes effect on the very render its change triggers.
  filters.hideEarned = state.hideEarned;
  renderProgress(trophies, state);
  const shown = renderTrophyList(els.list, trophies, state, filters, toggleEarned, openTrophy);
  renderListMeta(els.meta, els.empty, shown, trophies.length, filters);
  if (currentView !== 'checklist') els.empty.hidden = true;
  renderRoadmap(els.roadmapStages, trophies, state, toggleEarned, openTrophy);
  renderMissables(els.missablesList, trophies, state, toggleEarned, openTrophy);
  syncToggles();
}

function syncToggles() {
  els.hideEarnedToggle.checked = state.hideEarned;
  els.spoilerToggle.checked = state.hideSpoilers;
  filters.hideEarned = state.hideEarned;
}

function persist() {
  saveState(state);
  refreshAll();
}

function toggleEarned(id, earned) {
  state = setEarned(state, id, earned);
  persist();
  if (!els.detailPane.hidden) {
    const trophy = findTrophy(id);
    if (trophy) openDetail(els.detailPane, els.detailBody, trophy, state);
  }
}

function openTrophy(id) {
  const trophy = findTrophy(id);
  if (!trophy) return;
  openDetail(els.detailPane, els.detailBody, trophy, state);
}

function setView(view) {
  currentView = view;
  switchView(view, {
    listMeta: els.meta,
    trophyList: els.list,
    emptyNote: els.empty,
    roadmapView: els.roadmapView,
    missablesView: els.missablesView,
    tabs: els.tabs,
  });
}

function wireControls() {
  els.search.addEventListener('input', () => {
    filters.query = els.search.value.trim().toLowerCase();
    refreshAll();
  });

  els.gradeSelect.addEventListener('change', () => {
    filters.grade = els.gradeSelect.value;
    refreshAll();
  });

  els.kindFilters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-kind]');
    if (!button) return;
    filters.kind = button.dataset.kind;
    els.kindFilters.querySelectorAll('.kind-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn === button);
    });
    refreshAll();
  });

  els.hideEarnedToggle.addEventListener('change', () => {
    state = { ...state, hideEarned: els.hideEarnedToggle.checked };
    persist();
  });

  els.spoilerToggle.addEventListener('change', () => {
    state = { ...state, hideSpoilers: els.spoilerToggle.checked };
    persist();
  });

  els.tabs.forEach((tab) => {
    tab.addEventListener('click', () => setView(tab.dataset.view));
  });

  document.getElementById('detailClose').addEventListener('click', () => closeDetail(els.detailPane));

  document.addEventListener('ledger:toggle-earned', (event) => {
    toggleEarned(event.detail.id, event.detail.earned);
  });

  els.exportBtn.addEventListener('click', () => {
    downloadExport(state);
  });

  els.importBtn.addEventListener('click', () => els.importFile.click());

  els.importFile.addEventListener('change', async () => {
    const file = els.importFile.files[0];
    els.importFile.value = '';
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const result = parseImport(text, trophies.map((t) => trophyKey(t)));
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      state = result.state;
      persist();
      const ignoredNote = result.ignored > 0 ? ` (${result.ignored} unknown ids ignored.)` : '';
      window.alert(`Imported progress: ${state.earned.length} trophies earned.${ignoredNote}`);
    } catch (error) {
      window.alert(error.message || 'Could not read that file.');
    }
  });

  els.resetBtn.addEventListener('click', () => {
    if (!window.confirm('Clear all earned trophies and reset the settings?')) return;
    state = { earned: [], hideEarned: false, hideSpoilers: false };
    filters = { kind: 'all', grade: 'all', query: '', hideEarned: false };
    els.search.value = '';
    els.gradeSelect.value = 'all';
    els.kindFilters.querySelectorAll('.kind-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.kind === 'all');
    });
    persist();
  });
}

async function boot() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL} (${response.status}).`);
    const data = await response.json();
    const raw = Array.isArray(data) ? data : data.trophies;
    if (!Array.isArray(raw)) throw new Error('trophies.json holds no trophies array.');
    trophies = enrichTrophies(raw);
  } catch (error) {
    els.meta.textContent = `The trophy list could not be loaded: ${error.message}`;
    return;
  }
  wireControls();
  refreshAll();
  setView('checklist');
}

boot();
