// state.js — saved progress and reader settings, kept in localStorage.
//
// One key, one plain object: which trophies are earned, and the two settings
// that change what the list shows. Filters (search, kind, grade) live only
// for the session and are not saved.

export const STORAGE_KEY = 'leonida-ledger-v1';

export function defaultState() {
  return {
    earned: [],
    hideEarned: false,
    hideSpoilers: false,
  };
}

export function loadState() {
  const fallback = defaultState();
  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return fallback;
  }
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter(isTrophyId) : [],
      hideEarned: parsed.hideEarned === true,
      hideSpoilers: parsed.hideSpoilers === true,
    };
  } catch {
    return fallback;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: state.earned,
      hideEarned: state.hideEarned,
      hideSpoilers: state.hideSpoilers,
    }));
  } catch {
    // Storage full or blocked: the in-memory state still works for the session.
  }
}

export function isTrophyId(value) {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function isEarned(state, trophyId) {
  return state.earned.includes(trophyId);
}

export function setEarned(state, trophyId, earned) {
  const next = state.earned.filter((id) => id !== trophyId);
  if (earned) next.push(trophyId);
  next.sort((a, b) => a - b);
  return { ...state, earned: next };
}

export function earnedCount(state) {
  return state.earned.length;
}
