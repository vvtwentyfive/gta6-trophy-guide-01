// io.js — export progress as a JSON download, import it back.
//
// The file is plain JSON: the game, when it was exported, the earned
// trophy ids and the two saved settings. Import validates the shape
// before anything is applied, and ignores ids that are not trophies
// in the loaded list.

export function buildExport(state) {
  return {
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    app: 'The Leonida Ledger',
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    hideEarned: state.hideEarned,
    hideSpoilers: state.hideSpoilers,
  };
}

export function downloadExport(state) {
  const payload = JSON.stringify(buildExport(state), null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return payload;
}

export function parseImport(text, knownIds) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.earned)) {
    return { ok: false, error: 'That file is not a Leonida Ledger export: it has no earned list.' };
  }
  const known = new Set(knownIds);
  const earned = parsed.earned.filter((id) => typeof id === 'number' && known.has(id));
  return {
    ok: true,
    state: {
      earned,
      hideEarned: parsed.hideEarned === true,
      hideSpoilers: parsed.hideSpoilers === true,
    },
    ignored: parsed.earned.length - earned.length,
  };
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsText(file);
  });
}
