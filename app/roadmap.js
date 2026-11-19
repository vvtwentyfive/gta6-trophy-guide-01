// The platinum roadmap for The Leonida Ledger, built from the official
// descriptions: which story chapters and missions, which collectibles and
// counts, in what order. Each stage names its trophies by their official names.
export const ROADMAP = [
  {
    title: 'Story first — Chapters 1–5',
    blurb:
      'Play the five chapters in order. The 12 story trophies pop as you go: the four chapter closers, the final mission, and the named missions in between. There is no mission replay, so keep a manual save at the start of each chapter (15 save slots). Do the Chapter 1 balcony meditation for Positive Mental Attitude before Chapter 1 ends — it is the one thing that may not come back.',
    trophies: [
      'Just Like Paradise',
      'Paradise Lost',
      'T**s Ass Drug Money',
      'Vice City, Baby!',
      'Top Of The World, Ma',
      'You Gotta Know When to Get Off',
      'Trust',
      'Break the Bank',
      'Family Matters',
      'DWNFALL',
      'Hi-Jacked',
      'Snow Storm',
    ],
  },
  {
    title: 'Side-character finales',
    blurb:
      'Six questlines that start during the story and finish whenever you like — all of them stay available after the credits, so none of them can be missed. Andy is Lucia-only, Tyrone and Bret are Jason-only.',
    trophies: [
      'Road to Rehabilitation',
      'This Was No Boat Accident',
      'The Lone Rider',
      'Supply & Demand',
      'Spin On This!',
      'Fair Game',
    ],
  },
  {
    title: 'Partner play (after Coffee Break, Chapter 2)',
    blurb:
      'Once Jason and Lucia can free-roam together, the partner trophies open up: call your partner with Right on the D-pad then Triangle. Build max Strength with both characters at the same time, and lose a 4-star wanted level together.',
    trophies: ['Hot Together', 'Retail Therapy', 'Gunslinger', 'Personal Best'],
  },
  {
    title: 'Activities, races & challenges',
    blurb:
      'The long middle: 250 stunts (300 for 100%), gold in all 42 Shooting Range challenges, a drone-race win at all 14 locations, 20 different race wins, one arcade game finished, Cal beaten at fishing, 50 of the 80 challenges, and 8 stranger strands.',
    trophies: [
      'Cunning Stunts',
      'Master of None',
      'The Shootist',
      'Top Fun',
      'Earn Cash, Not Kudos',
      'Baited My Tackle',
      'Stick Fiddler',
      'Strangers & Freaks',
      'One Last Thing',
    ],
  },
  {
    title: 'Robberies & money',
    blurb:
      'Work up the robbery ladder: jewelry stores (Snap Gun, after Yasmani’s Jewelry Jobs in Chapter 3), bank vaults (5 for the trophy, all 8 for 100%), armored trucks, one illegal operation for each of the 9 gangs, $250,000 in laundered Marked Bills, $100,000 spent, all 8 garages bought, and 10 vehicles registered to Scooter Bros.',
    trophies: [
      'Catch Me If You Can',
      'Challenging Tank',
      'Sneakthief',
      'Maximum Withdrawal',
      'A Classic Blitz Play',
      'Pest Control',
      'Dime on the Dollar',
      'Treat Yo Self',
      'Little Boxes',
      'On the Spot',
    ],
  },
  {
    title: 'Collectibles & exploration',
    blurb:
      'Finish the map: 3 card sets, 100 WAiNK scans, 100 vehicles discovered, all 52 areas explored, all 18 meditation spots, and the hidden one-off trophies — the cocktail on Ocean Beach, the showroom Banshee, the bowling alley valuables, the 500 profile actions, the UFO, and the two still-unconfirmed ones (Bad Luck, I Guess and Ten Pin).',
    trophies: [
      'Positive Mental Attitude',
      "Don't Touch My Deck",
      'You WAiNKer!',
      'Whip It Good',
      'The Goodtime State',
      'In The Beginning…',
      'Capital Offense',
      'Let’s Go Bowling',
      'Actions Speak Louder',
      'Bad Luck, I Guess',
      'The Truth Is Out There',
      'Ten Pin',
    ],
  },
  {
    title: '100% & the platinum',
    blurb:
      'Open Progress > Stats > 100% Completion after the story and work through what is left. The checklist is lenient — near 60% true completion — but it is the longest stretch, around 100 hours. A Long Road is the last gold; the platinum follows it.',
    trophies: ['A Long Road', 'Vice Got a Price!'],
  },
];

/** Render the roadmap stages into a container element. */
export function renderRoadmap(container, trophiesByName, earned) {
  container.replaceChildren();
  for (const stage of ROADMAP) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    h3.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.blurb;
    const names = document.createElement('p');
    names.className = 'trophies';
    for (const name of stage.trophies) {
      const t = trophiesByName.get(name);
      const span = document.createElement('span');
      span.textContent = (earned.has(name) ? '✓ ' : '') + name;
      if (t && t.missable) span.textContent += ' ⚠';
      names.append(span);
      names.append(document.createTextNode(' · '));
    }
    names.lastChild.remove();
    li.append(h3, p, names);
    container.append(li);
  }
}
