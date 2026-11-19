[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vvtwentyfive/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vvtwentyfive/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# The Leonida Ledger — GTA 6 Trophy Guide & Tracker

An offline guide and tracker for every one of the 55 official PlayStation 5
trophies of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze).
Each trophy is shown with its official name, description and grade exactly as
PlayStation publishes it, plus a guide written for this entry that cites its
sources: what to do, where and how, and when it can be missed.

## What it does

- **Checklist tracker** — tick trophies off as you earn them; progress is
  saved in your browser (localStorage) and survives reloads.
- **Export / import** — save your progress to a file and import it back on
  any machine.
- **Filters** — filter by kind: story, missable, collectibles, activities
  and online.
- **Spoiler setting** — hides the names and descriptions of story trophies
  until you earn them, so the story stays unspoiled.
- **Platinum roadmap** — the order to earn the trophies in, built from the
  official descriptions: which story chapters and missions, which
  collectibles and counts, and every missable trophy flagged.
- **Cited guides** — every guide names or links its source beside the
  trophy, so a reader can see where each fact comes from. The guides are
  written in our own words; the official trophy names and descriptions are
  shown as PlayStation publishes them.
- **Fully offline** — static files only, no build step, no network request
  at run time. No Rockstar Games logo, official artwork, box art or game
  screenshots: the look is our own.

## Run it

Serve the `app/` directory with any static server, then open it in desktop
Chrome. For example:

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly in
desktop Chrome. The guide works with the network off.

## Built for make.fun

This entry was built for the
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01)
competition on [make.fun](https://make.fun). If you join make.fun, use
referral code `073t4skd` — it helps the author of this guide.

## License

MIT — see [LICENSE](LICENSE).
