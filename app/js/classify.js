// classify.js — kind, missable flag and roadmap stage for each trophy.
//
// The data file may carry these explicitly (kind, missable, missableWhy,
// stage). When it does not, they are derived here from the trophy's own
// official description, so the guide works against the plain starter data
// and against a richer data file alike. Nothing here invents a fact the
// description does not support: a missable flag needs a one-time story
// moment or a window that closes as the story moves on.

export const KINDS = ['story', 'missable', 'collectibles', 'activities', 'online', 'platinum'];

// The data file spells some kinds in the singular ('activity',
// 'collectible'); the filter buttons use the plural, so normalise here.
const KIND_ALIASES = {
  activity: 'activities',
  activities: 'activities',
  collectible: 'collectibles',
  collectibles: 'collectibles',
  story: 'story',
  missable: 'missable',
  online: 'online',
  platinum: 'platinum',
};

const STORY_MISSION = /complete (chapter|gone fishing|the final mission|breakfast run|the cartel heist|child's play|headliners|vcia takedown|operation savage glory)/i;
const HUNDRED_PERCENT = /attain 100% completion/i;
const COLLECTIBLE = /discover 100 vehicles|explore all of leonida|collectible card|waink it|meditate at every spot|garage properties|register 10 vehicles/i;
const ONLINE = /online|multiplayer|gta online/i;

// Missables, matched by official name: each description ties the trophy to
// a moment that happens once, or to a partner who is only beside you during
// the story. The why text says exactly what can be missed.
const MISSABLE_BY_NAME = {
  'Hot Together': 'Lose a 4-star Wanted Level with your partner beside you — partner moments end as the story moves on, so do it while the duo is together.',
  'Retail Therapy': 'Rob 3 shops back-to-back with your partner without losing your Wanted Level — it needs your partner beside you, a window the story eventually closes.',
  'Personal Best': 'A partnership moment with mass appeal — tied to the story’s duo, so it can pass by if you rush the chapters.',
  'Catch Me If You Can': 'Make an unscheduled departure at VCIA — a single departure; once you have left the airport that way, the moment is gone.',
  'Capital Offense': 'Smash your way out of a vehicle showroom in classic style — a story set-piece, not a free-roam repeatable.',
  'Challenging Tank': 'Kinda hot in these Rhinos — tied to a story set-piece with tanks; the moment does not come back in free roam.',
  'Positive Mental Attitude': 'The first meditation spot — the balcony at Jason’s house, after the Down to Earth mission — is reported to become unavailable after Chapter 1, so do it early; the guide notes this is not yet confirmed.',
};

export function deriveKind(trophy) {
  if (typeof trophy.kind === 'string') {
    const normalised = KIND_ALIASES[trophy.kind.toLowerCase()];
    if (normalised) return normalised;
  }
  const description = trophy.description || '';
  if (ONLINE.test(description)) return 'online';
  if (STORY_MISSION.test(description) || HUNDRED_PERCENT.test(description)) return 'story';
  if (COLLECTIBLE.test(description)) return 'collectibles';
  return 'activities';
}

export function deriveMissable(trophy) {
  if (trophy.missable === true) {
    const why = typeof trophy.missableWhy === 'string' && trophy.missableWhy
      ? trophy.missableWhy
      : (MISSABLE_BY_NAME[trophy.name] || '');
    return { missable: true, why };
  }
  if (trophy.missable === false) return { missable: false, why: '' };
  const why = MISSABLE_BY_NAME[trophy.name];
  return why ? { missable: true, why } : { missable: false, why: '' };
}

export function enrichTrophy(trophy) {
  const kind = deriveKind(trophy);
  const { missable, why } = deriveMissable(trophy);
  return {
    ...trophy,
    kind,
    missable,
    missableWhy: why,
    stage: deriveStage(trophy, kind, missable),
  };
}

export function enrichTrophies(trophies) {
  return trophies.map(enrichTrophy);
}

export function deriveStage(trophy, kind, missable) {
  if (typeof trophy.roadmap === 'number' && trophy.roadmap >= 1 && trophy.roadmap <= 5) {
    return trophy.roadmap;
  }
  if (typeof trophy.stage === 'number' && trophy.stage >= 1 && trophy.stage <= 5) {
    return trophy.stage;
  }
  if (trophy.grade === 'platinum' || /attain 100% completion/i.test(trophy.description || '')) return 5;
  if (kind === 'story') return 1;
  if (missable) return 2;
  if (/complete the final mission for|complete 8 mission strands/i.test(trophy.description || '')) return 2;
  if (kind === 'collectibles') return 3;
  return 4;
}

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Story playthrough',
    blurb: 'Play the chapters and the named story missions in order — Gone Fishing through the final mission. Nothing here is missable, and mission replay covers a slip.',
  },
  {
    stage: 2,
    title: 'Story cleanup — strangers & partners',
    blurb: 'Before the story closes: finish every stranger’s final mission, the 8 stranger strands, and every missable moment. Partner trophies and one-time set-pieces live here — do them now, not after the credits.',
  },
  {
    stage: 3,
    title: 'Collectibles',
    blurb: 'With Leonida open: card sets, WAiNK spots, meditation spots, vehicles to discover, every area to explore, garages to buy, vehicles to register.',
  },
  {
    stage: 4,
    title: 'Activities & challenges',
    blurb: 'The long grind in free roam: stunts, races, the Shooting Range, fishing, arcade games, robberies, bowling, challenges, and the money trophies.',
  },
  {
    stage: 5,
    title: 'Platinum & 100%',
    blurb: 'Attain 100% Completion for the gold, and the platinum — Vice Got a Price! — follows when the other 54 are earned.',
  },
];

export function trophiesForStage(trophies, stage) {
  return trophies.filter((t) => t.stage === stage);
}
