// render.js — the header progress and the trophy checklist.
//
// Every row shows the grade medal, the official name and description, kind
// tags, the missable flag and an earned checkbox. When the spoiler setting
// is on, a story trophy not yet earned shows a hidden placeholder instead
// of its name and description. Rows are buttons into the detail pane.

import { isEarned } from './state.js';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

export function gradeLabel(grade) {
  return grade ? grade.charAt(0).toUpperCase() + grade.slice(1) : 'Bronze';
}

export function trophyKey(trophy) {
  return typeof trophy.id === 'number' ? trophy.id : trophy.name;
}

export function isHiddenBySpoilers(trophy, state) {
  return state.hideSpoilers && trophy.kind === 'story' && !isEarned(state, trophyKey(trophy));
}

export function renderProgress(trophies, state) {
  const earned = trophies.filter((t) => isEarned(state, trophyKey(t))).length;
  const total = trophies.length;
  const percent = total === 0 ? 0 : Math.round((earned / total) * 100);

  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('totalCount').textContent = String(total);
  document.getElementById('earnedPercent').textContent = `${percent}%`;
  const fill = document.getElementById('progressFill');
  fill.style.width = `${percent}%`;
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuemax', String(total));
  bar.setAttribute('aria-valuenow', String(earned));

  const breakdown = document.getElementById('gradeBreakdown');
  breakdown.innerHTML = GRADES.map((grade) => {
    const ofGrade = trophies.filter((t) => t.grade === grade);
    const earnedOfGrade = ofGrade.filter((t) => isEarned(state, trophyKey(t))).length;
    return `<li><span class="swatch swatch--${grade}"></span>${gradeLabel(grade)} ${earnedOfGrade}/${ofGrade.length}</li>`;
  }).join('');

  const note = document.getElementById('progressNote');
  if (earned === 0) {
    note.textContent = 'Tick a trophy to start your ledger.';
  } else if (earned === total) {
    note.textContent = 'Vice Got a Price! — every trophy in the ledger is earned.';
  } else {
    note.textContent = `${total - earned} to go. The roadmap tab shows the order to take them in.`;
  }
}

export function matchesFilters(trophy, state, filters) {
  const key = trophyKey(trophy);
  if (filters.hideEarned && isEarned(state, key)) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (filters.kind !== 'all' && trophy.kind !== filters.kind) {
    return false;
  }
  if (filters.query) {
    const haystack = `${trophy.name} ${trophy.description || ''}`.toLowerCase();
    if (!haystack.includes(filters.query)) return false;
  }
  return true;
}

export function renderTrophyList(listEl, trophies, state, filters, onToggle, onOpen) {
  const visible = trophies.filter((t) => matchesFilters(t, state, filters));
  listEl.innerHTML = '';

  visible.forEach((trophy) => {
    const key = trophyKey(trophy);
    const earned = isEarned(state, key);
    const hidden = isHiddenBySpoilers(trophy, state);
    const row = document.createElement('li');
    row.className = `trophy-row${earned ? ' is-earned' : ''}`;
    row.dataset.trophyId = String(key);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'trophy-check';
    check.checked = earned;
    check.setAttribute('aria-label', `Mark ${hidden ? 'hidden trophy' : trophy.name} as earned`);
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(key, check.checked);
    });

    const medal = document.createElement('span');
    medal.className = 'trophy-medal';
    medal.innerHTML = `<span class="swatch swatch--${trophy.grade}"></span><span class="grade-label">${gradeLabel(trophy.grade)}</span>`;

    const main = document.createElement('div');
    main.className = 'trophy-main';
    if (hidden) {
      main.innerHTML = `<p class="trophy-name">Hidden trophy</p><p class="trophy-hidden">Hidden trophy — earn it to reveal</p>`;
    } else {
      main.innerHTML = `<p class="trophy-name"></p><p class="trophy-desc"></p>`;
      main.querySelector('.trophy-name').textContent = trophy.name;
      main.querySelector('.trophy-desc').textContent = trophy.description || '';
    }

    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const tagHtml = [`<span class="tag">${trophy.kind}</span>`];
    if (trophy.missable) tagHtml.push('<span class="tag tag--missable">Missable</span>');
    if (typeof trophy.count === 'number') tagHtml.push(`<span class="tag tag--count">Count: ${trophy.count}</span>`);
    tags.innerHTML = tagHtml.join('');
    main.appendChild(tags);

    const open = document.createElement('span');
    open.className = 'trophy-open';
    open.setAttribute('aria-hidden', 'true');
    open.textContent = '›';

    row.append(check, medal, main, open);
    row.addEventListener('click', () => onOpen(key));
    listEl.appendChild(row);
  });

  return visible.length;
}

export function renderListMeta(metaEl, emptyEl, shown, total, filters) {
  const parts = [];
  if (filters.kind !== 'all') parts.push(filters.kind);
  if (filters.grade !== 'all') parts.push(gradeLabel(filters.grade).toLowerCase());
  if (filters.query) parts.push(`matching “${filters.query}”`);
  const scope = parts.length ? ` — ${parts.join(', ')}` : '';
  metaEl.textContent = `Showing ${shown} of ${total} trophies${scope}.`;
  emptyEl.hidden = shown !== 0;
}
