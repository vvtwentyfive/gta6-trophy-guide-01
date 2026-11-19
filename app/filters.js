// Kind filters and the spoiler rule for The Leonida Ledger.
// Kinds: story, missable, collectibles, activities, online (zero trophies —
// the whole list is single-player), plus platinum shown under All.
export const KINDS = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'missable', label: 'Missable' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'online', label: 'Online' },
  { key: 'platinum', label: 'Platinum' },
];

/** Count trophies per kind (online is always 0; platinum is its own kind). */
export function countByKind(trophies) {
  const counts = { all: trophies.length, online: 0 };
  for (const t of trophies) counts[t.kind] = (counts[t.kind] ?? 0) + 1;
  return counts;
}

/** True when a trophy passes the kind filter, grade filter and search text. */
export function trophyMatches(trophy, { kind, grade, query }) {
  if (kind !== 'all' && trophy.kind !== kind) return false;
  if (grade !== 'all' && trophy.grade !== grade) return false;
  if (query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(query.toLowerCase())) return false;
  }
  return true;
}

/**
 * Spoiler rule: with spoilers on, a story trophy that is not yet earned hides
 * its name, description and guide until the player ticks it off.
 */
export function isSpoilerHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

/** Short spoiler-safe label for a hidden story trophy. */
export function spoilerLabel(trophy) {
  const chapter = trophy.chapter ? ` · Chapter ${trophy.chapter}` : '';
  return `Hidden story trophy${chapter} — earn it to reveal its name`;
}
