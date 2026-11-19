# The Leonida Ledger — GTA VI Trophy Guide & Tracker

[![Bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/vvtwentyfive/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/vvtwentyfive/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft
Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze) — built for the
[make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

Every trophy is shown with its official name, description, and grade exactly as
PlayStation publishes them, plus a guide written for this ledger in our own
words that names its sources beside it. No Rockstar logo, artwork, or game
screenshot: the look is our own. The app is plain static files under `app/` —
it works with the network off and fetches nothing but its own
`app/data/trophies.json`.

## What it does

- **Checklist tracker** — tick trophies off as you earn them. Progress is saved
  in the browser (`localStorage`) and shown in the header: total earned, a
  percentage, a progress bar, and a breakdown by grade.
- **Filters** — search by name or mission, filter by kind (Story, Missable,
  Collectibles, Activities, Online) and by grade (Platinum, Gold, Silver,
  Bronze), and hide earned trophies.
- **Spoiler setting** — "Hide story spoilers until earned" replaces the name
  and description of any unearned story trophy with a "Hidden trophy"
  placeholder, in the list and in the detail pane, until you earn it.
- **Roadmap to the platinum** — the "Roadmap to Platinum" tab orders all 55
  trophies into five stages: story playthrough, story cleanup (strangers and
  partners), collectibles, activities and challenges, then platinum and 100%.
  The platinum, *Vice Got a Price!*, unlocks when the other 54 are earned.
- **Missables** — the "Missables" tab flags every trophy whose official
  description ties it to a one-time story moment or a window that closes as
  the story moves on, with the reason it can be missed. Do those on your
  first playthrough; everything else can be picked up in free roam.
- **Export / import** — "Export progress (JSON)" downloads your earned list
  and settings as a file; "Import progress" reads such a file back. "Reset"
  clears the ledger.
- **Cited guides** — click any trophy to open its guide beside the list: the
  official description, the guide, and the sources it draws on (for example
  the official trophy list via Exophase, the PowerPyx GTA 6 Trophy Guide, the
  Push Square GTA 6 Trophy Guide, and the PSNProfiles trophy list). A source
  is cited, never copied.

## How to use it

1. Serve `app/` with any static server — for example, from this directory:
   `node serve.ts`, then open <http://localhost:8080>.
2. Work the **Roadmap to Platinum** tab in order, and check the **Missables**
   tab before the story closes.
3. Tick a trophy's checkbox (in the list or in its detail pane) when it pops.
   Your progress is saved automatically in the browser.
4. Turn on **Hide story spoilers until earned** before a first playthrough if
   you do not want story trophy names and descriptions spoiled.
5. Use **Export progress (JSON)** to back up or move your progress to another
   browser, and **Import progress** to restore it.

## Screenshots

Four renders of the app at 1280×800, taken with Playwright against the app
served locally, with 13 of 55 trophies marked earned so the progress bar,
counts, and earned states show real state:

| File | Shows |
| --- | --- |
| `1-cover.jpg` | The checklist with the progress header (13/55, 24%), filters, spoiler setting, export/import, and the guide open for *A Long Road* |
| `2-roadmap.jpg` | The Roadmap to Platinum view: the five stages in order, starting with Stage 1, Story playthrough |
| `3-detail.jpg` | The missable trophy *Positive Mental Attitude*: its Missable callout, guide, and named sources |
| `4-missables.jpg` | The Missables view with its one flagged trophy |

The roadmap's five stages are: 1. Story playthrough (14 trophies), 2. Story
cleanup — strangers & partners (24), 3. Collectibles (4), 4. Activities &
challenges (11), 5. Platinum & 100% (2). The single missable flag in the
official list is *Positive Mental Attitude*: the first meditation spot, on the
balcony at Jason's house after the Down to Earth mission, is reported to
become unavailable after Chapter 1.

## How to run the entry program

From this directory:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `output/dossier.json` with
`buildDossier` from `vendor/makefun-frontend.ts` (the kit's copy, unchanged).

## Sources the guides cite

- Official PlayStation 5 trophy list — names, descriptions, and grades, via
  Exophase (<https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/>)
  and PSNProfiles (November 2026).
- PowerPyx GTA 6 Trophy Guide.
- Push Square GTA 6 Trophy Guide.
- PSNProfiles trophy list.

Where a guide goes beyond what those sources confirm, it says so in its own
words ("not yet checked in the game") rather than presenting a guess as fact.

## Layout

- `app/` — the guide itself: `index.html`, `css/ledger.css`,
  `js/` (one job per file: `app.js`, `state.js`, `render.js`, `detail.js`,
  `views.js`, `io.js`, `classify.js`), and `data/trophies.json` (all 55
  trophies with official names, descriptions, grades, kinds, roadmap stages,
  missable flags, guides, and sources).
- `screenshots/` — four renders of the app taken at 1280×800: the checklist
  with a guide open (cover), the roadmap, a missable trophy's guide with its
  sources, and the missables view.
- `main.ts` — the entry program. `serve.ts` — a tiny local static server.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `LICENSE` — MIT.

## Licence

MIT — see [LICENSE](LICENSE).

---

*An unofficial fan guide. Not affiliated with Rockstar Games or PlayStation.*
*Built for make.fun — enter via <https://make.fun/bounty/gta6-trophy-guide-01?ref=073t4skd>*
