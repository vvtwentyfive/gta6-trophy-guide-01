// Progress storage for The Leonida Ledger: earned trophies live in localStorage
// and can be exported to a JSON file and imported back. Nothing leaves the browser.
export const EARNED_KEY = 'leonida-ledger-earned-v1';
export const SPOILER_KEY = 'leonida-ledger-spoilers-v1';
export const APP_NAME = 'The Leonida Ledger';

/** Read the earned set (trophy names) from localStorage; empty set on any bad data. */
export function loadEarned() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((n) => typeof n === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

/** Persist the earned set to localStorage. */
export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

/** Load the spoiler preference; defaults to hiding story spoilers. */
export function loadSpoilers() {
  const raw = localStorage.getItem(SPOILER_KEY);
  return raw === null ? true : raw === '1';
}

/** Persist the spoiler preference. */
export function saveSpoilers(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

/** Build the export document for the given earned set. */
export function buildExportDoc(earned) {
  return {
    app: APP_NAME,
    game: 'Grand Theft Auto VI',
    version: 1,
    exported_at: new Date().toISOString(),
    earned: [...earned].sort(),
  };
}

/** Download the export document as a JSON file. */
export function downloadExport(earned) {
  const blob = new Blob([JSON.stringify(buildExportDoc(earned), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-ledger-progress.json';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parse an imported file's text into an earned set, keeping only names that
 * exist in the official list. Returns { earned, kept, dropped }.
 */
export function parseImport(text, knownNames) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('not a Leonida Ledger export: no earned list found');
  const known = new Set(knownNames);
  const earned = new Set();
  let dropped = 0;
  for (const name of list) {
    if (typeof name === 'string' && known.has(name)) earned.add(name);
    else dropped += 1;
  }
  return { earned, kept: earned.size, dropped };
}
