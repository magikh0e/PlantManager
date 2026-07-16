# Tropical Roots Maui — Plant Manager

A complete, single-file cultivation management app for tracking mother plants,
clones, feedings, environments, harvests, genetics, and more. No accounts, no
analytics, no ads — your data stays on your device.

**Live app:** https://tracker.tropicalrootsmaui.com/
**Latest release:** [see the Releases page](https://github.com/magikh0e/PlantManager/releases/latest)
**License:** [GPL-3.0-or-later](#license)

---

## What it is

Plant Manager is a **Progressive Web App** shipped as one self-contained
`index.html` file. There is no server, no build step, and no sign-up. All data
is stored locally in your browser (`localStorage`), with optional cloud backup
if you choose to wire up Firebase. Install it to your phone or desktop home
screen and it works fully offline.

**Built by a grower, for growers** — and for anyone who just loves data about
their grow. It tracks a garden end to end, from seed or clone through veg,
flower, harvest, and cure to the next generation, then turns all of it into
charts, trends, and analytics — without ever handing your grow data to a third
party.

---

## Features

### Plants & genetics
- **Mother plants** — add, edit, search, archive; track strain, genetics,
  source, acquisition date, growth stage, and health status
- **Clone tracking** — log clone batches per mother with cut date, quantity,
  medium, and rooting hormone; auto-calculated success rate
- **Clone lineage / family tree** — visual SVG genealogy across generations
- **Strain library** — personal genetics database with type, breeder, lineage,
  flowering time, THC/CBD, terpenes, effects, flavors, and yield
- **Strain catalog** — 400+ built-in strains across multiple breeders and clone
  providers, with autocomplete on every strain-name input
- **Strain reviews** — 1–5 star grow journals per strain with photos
- **Seed bank** — inventory tracker with germination rates, age tracking, and
  low-stock alerts
- **Breeding / pollen tracker** — pollen collections, crosses, and seed harvests
- **Pheno hunt** — run and score phenotype hunts across a seed batch, rank the keepers
- **Plant nicknames & auto-numbering** — name individual plants, or auto-number
  duplicates that share a strain

### Care & monitoring
- **Task scheduling** — one-time and recurring care tasks with priorities,
  overdue/due-today highlighting, and auto-advancing due dates
- **Feeding / nutrient log** — track nutrients, amounts, pH in/out, EC/PPM, and
  pH-drift warnings; a deep built-in product catalog across the major nutrient lines
- **Feed schedule templates** — built-in (GH Flora, Fox Farm, Gaia Green, Down To
  Earth, KNF) plus custom template builder; apply a schedule to a plant as tasks
- **Grow environments** — tents, rooms, greenhouses, etc. with dimensions,
  light setup, and per-environment sensor readings
- **Environment readings** — temp, humidity, light hours, pH, EC/PPM with
  trend sparklines and threshold alerts
- **IPM log** — pest, disease, and deficiency tracking with severity badges,
  treatment efficacy, reapplication reminders, and a 50+ treatment catalog
- **Pest identification** — photo-based ID via Google Cloud Vision (optional)
  or Google Lens fallback, plus a built-in visual pest guide
- **Photo journal** — visual timeline of grow photos linked to plant and stage
- **Notifications** — in-tab reminders for overdue tasks, threshold breaches,
  and feeding intervals

### Harvest & analysis
- **Harvest tracking** — wet/dry weight, dry ratio, trim/cure method, cure
  status, quality rating, terpene and flavor notes
- **Flowering time tracking** with harvest-window estimates per strain
- **Trichome harvest tracker** — clear/cloudy/amber percentages with
  harvest-window recommendations
- **Dry-back tracking** — saturation monitoring and "time to water" estimates
- **Analytics tab** — over a dozen charts and data tables, all pure inline SVG: yield over
  time, yield by strain, cost per gram, strain ROI ranking, environment ↔
  outcome correlations, feeding/training → yield correlations, and more
- **Cost tracker** — expenses across categories with cost-efficiency analytics
- **Grow run manager** — group plants into named runs and compare them
- **Export reports** — print-to-PDF Plant, Garden, and Analytics reports

### Calculators & tools
- **VPD calculator** with trend chart
- **DLI / light calculator** (PPFD + photoperiod)
- **KNF input calculator** (10 Korean Natural Farming inputs)
- **Soil mix calculator** (4 recipes + custom builder)
- **Nutrient mix calculator** — dosing in ml/gal (liquids) and tbsp/gal (dry amendments)
- **Medium fill calculator** — soil volume to fill a bed, pot, or tent (cu ft / gal / L)
- **CO₂ calculator** — target injection by room volume
- **Power / electricity cost calculator**
- **Crop-steering log** (generative vs vegetative)
- **Terpene profiles** + a **KNF ferment tracker** (log FPJ/FAA/LAB batches & timing)
- **Companion planting guide** + **nutrient-availability pH chart**
- **Unit converter** + **harvest forecast** (projected dates & yields)
- **Strain comparison** — cost, yield, cost-per-gram, and money lost on dead plants
- **Nutrient deficiency wizard** (3-step diagnostic tree)
- **Grow cycle templates** (4 built-in lifecycle plans)
- **Moon phase tracker** (offline algorithmic, with KNF/biodynamic guidance)
- **Grow room diagram** — visual grid layout planner per environment
- **pH/EC calibration log** — multi-meter tracking with overdue reminders
- **Fleet view** — sortable table mode with filters and bulk actions
- **Plant comparison** — side-by-side metrics for 2–3 plants
- **QR code tags** — printable plant, clone, breeding-cross, and seed-packet
  labels with a built-in QR decoder (no external libraries)
- **Grow calendar** — month grid with per-day events and lunar guidance
- **Daily snapshot** — auto-generated daily report (optional auto-save)
- **Guided setup wizard** for first-run onboarding
- **Command palette** (Ctrl/Cmd+K) — fuzzy-search 80+ actions from anywhere
- **Shareable tool links** — copy a deep link (e.g. `?tool=vpd`) that opens
  straight into a calculator or tool, some carrying your input values

---

## Getting started

### Just use it
Open the **[live app](https://tracker.tropicalrootsmaui.com/)** in any modern
browser. On mobile or desktop, use your browser's "Install" / "Add to Home
Screen" option to install it as an app for offline use.

New here? Add `?demo` to the URL (or **Setup → Load demo data**) to explore a
fully-populated garden first — nothing is saved until you clear the demo.

### Run it yourself
Because it's a single static file, hosting is trivial:

```bash
# Clone the repo
git clone https://github.com/magikh0e/PlantManager.git
cd PlantManager

# Serve it locally (any static server works)
python -m http.server 8080
# then open http://localhost:8080
```

Or simply open `index.html` directly in a browser. (A local server is
recommended so the service worker and PWA install prompt work correctly.)

To self-host, upload the contents of the repo to any static web host — there is
no backend to deploy.

---

## Staying up to date

A self-hosted copy is fully standalone — the app never phones home, so it won't
automatically know when a new version ships upstream. To keep up:

1. **Get notified of releases.** On the
   [GitHub repo](https://github.com/magikh0e/PlantManager), click
   **Watch → Custom → Releases**; GitHub then emails you on every new release.
   (Prefer feeds? Subscribe to the
   [releases feed](https://github.com/magikh0e/PlantManager/releases.atom) in
   any RSS reader.)
2. **Update your copy.** `git pull` (or download the latest release) and
   re-upload the files to your host. The bundled `service-worker.js` already
   carries a bumped cache version, so returning visitors get the new build on
   their next load — just make sure your host/CDN serves `service-worker.js`
   with `Cache-Control: no-cache` so a stale copy isn't pinned at the edge.

Your own users are then notified automatically: the service worker shows a
"new version available" prompt when it detects the update. See
[CHANGELOG.txt](CHANGELOG.txt) for what changed in each release.

---

## Data & privacy

- **Local-first.** All your data lives in your browser's `localStorage` under a
  single key. Nothing is sent anywhere by default.
- **No tracking.** No analytics, no ads, no third-party scripts.
- **Backups are yours.** Export your full database to a JSON file at any time
  and re-import it later. Exports carry an integrity checksum and are verified
  on import.
- **Optional cloud sync.** If you want cross-device backup, you can connect your
  own Firebase project (Google sign-in + Firestore). This is entirely opt-in.

---

## Optional integrations

All integrations are off by default and the app works fully without them.

| Integration | Purpose | What you need |
|---|---|---|
| **OpenWeatherMap** | Auto-fill temp/humidity, weather widget | Free API key |
| **Firebase** | Cloud backup/restore + auto-sync | Your own Firebase project |
| **Google Cloud Vision** | Photo-based pest/disease ID | Free-tier API key (1,000 img/mo) |

Keys are entered in-app (gear menu → settings) and stored locally. Pest ID
gracefully falls back to Google Lens and the built-in pest guide without a key.

---

## Tech notes

- **Single file.** The entire app is `index.html` — markup, styles, and a single
  IIFE of vanilla JavaScript organized into ~85 modules.
- **No dependencies, no build.** No frameworks, no bundler, no npm install. All
  charts and QR codes are generated with hand-rolled inline SVG.
- **PWA.** A service worker caches the app shell and assets for offline use; a
  web manifest enables home-screen install.
- **Themes.** Light/dark with system-preference detection.
- **Responsive.** Works on phones, tablets, and desktop.

---

## Browser support

Any current version of Chrome, Edge, Firefox, or Safari (desktop or mobile).
PWA install and offline support are best on Chromium-based browsers and iOS
Safari.

---

## Contributing

Issues and pull requests are welcome. Because the app is a single file, please:

- Keep changes vanilla JS — no new dependencies or build tooling.
- Match the existing module pattern (`const Module = { ... }; window.Module = Module;`).
- Test against a populated database, not just the empty state.

See [CHANGELOG.txt](CHANGELOG.txt) for full version history.

---

## License

Released under the **GNU General Public License v3.0 or later**
([GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html)). Free and
open-source: use it, study it, share it, and improve it.

---

*Built by [Tropical Roots Maui](https://tropicalrootsmaui.com/).*
