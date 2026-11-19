// detail.js — the trophy detail pane.
//
// Shows the official description, the guide in our own words, its steps,
// and the sources it names. A source with a real page gets a link; the link
// opens only if the reader follows it — the app fetches nothing itself.
// When the data file carries no sources for a trophy, the pane says so
// plainly and falls back to the official list as the source for the
// name, description and grade.

import { isEarned } from './state.js';
import { gradeLabel, isHiddenBySpoilers } from './render.js';

const OFFICIAL_SOURCE = {
  name: 'Official PlayStation 5 trophy list — names, descriptions and grades, via Exophase and PSNProfiles (Nov 2026)',
  url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
};

export function sourceListFor(trophy) {
  const sources = [];
  if (Array.isArray(trophy.sources)) {
    trophy.sources.forEach((source) => {
      if (typeof source === 'string' && source.trim()) {
        sources.push({ name: source.trim(), url: '' });
      } else if (source && typeof source.name === 'string' && source.name.trim()) {
        sources.push({ name: source.name.trim(), url: typeof source.url === 'string' ? source.url : '' });
      }
    });
  }
  if (sources.length === 0) sources.push(OFFICIAL_SOURCE);
  return sources;
}

export function renderDetail(bodyEl, trophy, state) {
  const key = typeof trophy.id === 'number' ? trophy.id : trophy.name;
  const earned = isEarned(state, key);
  const hidden = isHiddenBySpoilers(trophy, state);
  const sources = sourceListFor(trophy);
  const steps = Array.isArray(trophy.steps) ? trophy.steps.filter((s) => typeof s === 'string' && s.trim()) : [];

  const parts = [];
  parts.push(`<p class="detail-grade"><span class="swatch swatch--${trophy.grade}"></span>${gradeLabel(trophy.grade)} trophy · ${trophy.kind}</p>`);

  if (hidden) {
    parts.push('<h2>Hidden trophy</h2>');
    parts.push('<p class="detail-official">Hidden trophy — earn it to reveal. Turn the spoiler setting off to see story trophies before you earn them.</p>');
    parts.push(`<p><label><input type="checkbox" data-earned-toggle="${key}" ${earned ? 'checked' : ''}> Earned</label></p>`);
    bodyEl.innerHTML = parts.join('');
    wireEarnedToggle(bodyEl, key);
    return;
  }

  parts.push(`<h2></h2>`);
  parts.push(`<p class="detail-official"><strong>Official description:</strong> <span class="official-text"></span></p>`);

  if (trophy.missable && trophy.missableWhy) {
    parts.push(`<p class="missable-callout"><strong>Missable.</strong> <span class="missable-why"></span></p>`);
  }

  parts.push('<h3>Guide</h3>');
  parts.push(`<p class="guide-text"></p>`);

  if (steps.length > 0) {
    parts.push('<h3>Steps</h3><ol class="detail-steps">');
    steps.forEach((step) => parts.push('<li></li>'));
    parts.push('</ol>');
  }

  parts.push('<h3>Sources</h3><ul class="detail-sources">');
  sources.forEach((source) => {
    if (source.url) {
      parts.push(`<li><a href="${escapeAttr(source.url)}" target="_blank" rel="noopener"></a></li>`);
    } else {
      parts.push('<li></li>');
    }
  });
  parts.push('</ul>');

  parts.push(`<p><label><input type="checkbox" data-earned-toggle="${key}" ${earned ? 'checked' : ''}> Earned</label></p>`);
  parts.push('<p class="detail-note">The guide above is written for this ledger in our own words. A source is cited, never copied: the official name and description are shown as PlayStation publishes them.</p>');

  bodyEl.innerHTML = parts.join('');
  bodyEl.querySelector('h2').textContent = trophy.name;
  bodyEl.querySelector('.official-text').textContent = trophy.description || '';
  const whyEl = bodyEl.querySelector('.missable-why');
  if (whyEl) whyEl.textContent = trophy.missableWhy;
  bodyEl.querySelector('.guide-text').textContent = trophy.guide || 'No guide written yet.';
  const stepItems = bodyEl.querySelectorAll('.detail-steps li');
  stepItems.forEach((li, index) => { li.textContent = steps[index]; });
  const sourceItems = bodyEl.querySelectorAll('.detail-sources li');
  sourceItems.forEach((li, index) => {
    const source = sources[index];
    if (source.url) {
      li.querySelector('a').textContent = source.name;
    } else {
      li.textContent = source.name;
    }
  });
  wireEarnedToggle(bodyEl, key);
}

function wireEarnedToggle(bodyEl, key) {
  const toggle = bodyEl.querySelector('[data-earned-toggle]');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    document.dispatchEvent(new CustomEvent('ledger:toggle-earned', { detail: { id: key, earned: toggle.checked } }));
  });
}

export function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function openDetail(paneEl, bodyEl, trophy, state) {
  renderDetail(bodyEl, trophy, state);
  paneEl.hidden = false;
  paneEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function closeDetail(paneEl) {
  paneEl.hidden = true;
}
