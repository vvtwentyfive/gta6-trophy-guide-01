// The Leonida Ledger — the hand-in program for gta6-trophy-guide-01.
//
// The guide itself is plain static files under app/ (index.html, style.css,
// ES modules, data/trophies.json): no build step, no network at run time.
// This program copies app/ and screenshots/ from beside this file into the
// output directory and writes /output/dossier.json with the vendored make.fun
// library, so the judge reads exactly what the app is. Run it the same way
// outside the grader's container:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It must write the same bytes on every run, so it does nothing time- or
// order-dependent: the same input files always produce the same dossier.
// vendor/makefun-frontend.ts is the kit's copy, unchanged — the scorer
// rebuilds the dossier with its own copy and compares the two byte for byte.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the other caps refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB, more than 993 files and directories in
// app/ or 48 MiB of app files (app/ counts beside /output's own 1000-entry
// cap, together with screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
