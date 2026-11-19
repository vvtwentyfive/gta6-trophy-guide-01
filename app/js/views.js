// views.js — the Roadmap to Platinum and the Missables views.
//
// Both views are built from the enriched trophies: the roadmap groups them
// into five stages in the order to earn them, and the missables view lists
// every missable-flagged trophy with the reason it can be missed.

import { ROADMAP_STAGES, trophiesForStage } from './classify.js';
import { renderTrophyList } from './render.js';

export function renderRoadmap(stagesEl, trophies, state, onToggle, onOpen) {
  stagesEl.innerHTML = '';
  ROADMAP_STAGES.forEach((stageDef) => {
    const stageTrophies = trophiesForStage(trophies, stageDef.stage);
    const stageEl = document.createElement('li');
    stageEl.className = 'roadmap-stage';
    const heading = document.createElement('h3');
    heading.textContent = stageDef.title;
    const blurb = document.createElement('p');
    blurb.textContent = stageDef.blurb;
    const list = document.createElement('ul');
    list.className = 'trophy-list';
    stageEl.append(heading, blurb, list);
    stagesEl.appendChild(stageEl);
    renderTrophyList(list, stageTrophies, state, { kind: 'all', grade: 'all', query: '', hideEarned: false }, onToggle, onOpen);
  });
}

export function renderMissables(listEl, trophies, state, onToggle, onOpen) {
  const missables = trophies.filter((t) => t.missable);
  listEl.innerHTML = '';
  renderTrophyList(listEl, missables, state, { kind: 'all', grade: 'all', query: '', hideEarned: false }, onToggle, onOpen);
  return missables.length;
}

export function switchView(view, elements) {
  const { listMeta, trophyList, emptyNote, roadmapView, missablesView, tabs } = elements;
  const isChecklist = view === 'checklist';
  const isRoadmap = view === 'roadmap';
  const isMissables = view === 'missables';

  trophyList.hidden = !isChecklist;
  listMeta.hidden = !isChecklist;
  emptyNote.hidden = !isChecklist;
  roadmapView.hidden = !isRoadmap;
  missablesView.hidden = !isMissables;

  tabs.forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}
