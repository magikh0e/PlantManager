# Plant Manager — Claude Context

Auto-loaded by Claude Code at session start. Keeps you up to speed on this codebase.

---

## Project

- **What:** Single-file HTML PWA for tracking cannabis cultivation (mother plants, clones, feedings, environments, KNF schedules, harvests, IPM, breeding, pheno hunts, lineage).
- **Where:** `PlantManager.html` lives in this folder. ~14,800 lines.
- **Version:** `2.19.1` (search for `APP_VERSION` to bump).
- **License:** GNU GPL-3.0. Free, open-source, no accounts, no tracking, no ads.
- **Storage:** localStorage by default (single key `motherPlantTracker`). Optional Firebase Cloud Sync. Optional AES-256-GCM encrypted exports.

---

## Deployment

| Source file | Deploys to | Renamed on upload |
|---|---|---|
| `PlantManager.html` | `tracker.tropicalrootsmaui.com/` | → `index.html` |
| `PlantManagerHelp.html` | `tracker.tropicalrootsmaui.com/` | (no rename) |
| `sitemap-tracker.xml` | `tracker.tropicalrootsmaui.com/` | → `sitemap.xml` |
| `robots-tracker.txt` | `tracker.tropicalrootsmaui.com/` | → `robots.txt` |
| `site.webmanifest` | both subdomains | (no rename) |
| `index.html` | `tropicalrootsmaui.com/` | (main marketing site, separate concern) |
| `site-main.webmanifest` | `tropicalrootsmaui.com/` | (main site PWA manifest) |
| `sitemap.xml` | `tropicalrootsmaui.com/` | (main domain sitemap) |
| `robots.txt` | `tropicalrootsmaui.com/` | (main domain) |

Canonical URL for the Plant Manager is `https://tracker.tropicalrootsmaui.com/` (root, no `.html`). All `og:url`, `twitter:url`, `<link rel="canonical">` reflect this.

---

## Architecture

Everything is one IIFE-wrapped `<script>` at the bottom of `PlantManager.html`. Pattern for every feature:

```js
const ModuleName = {
  init(){...},
  render(){...},
  open(){...},
  // ...
};
window.ModuleName = ModuleName;   // REQUIRED — inline onclick handlers need global access
```

**Core modules (in declaration order):**
`U` → `Store` → `Toast` → `Theme` → `HeroToggle` → `Modal` → `Router` → `Dashboard` → `Plants` → `Environments` → `Clones` → `Tasks` → `Environment` (readings) → `Feeding` → `Journal` → `IPM` → `SprayRotation` → `Chart` → `Harvest` → `CureTracker` → `Strains` → `Analytics` → `Calendar` → `Lineage` → `GeneticTree` → `DataIO` → `WhatsNew` → `SetupWizard` → `StrainAC` → `Notify` → `Weather` → `Moon` → ...

**Feature modules (alphabetical, ~50 more):** `BatchFeed`, `BreedingTracker`, `CalibrationLog`, `CloudSync`, `CO2Calc`, `CompanionGuide`, `CostTracker`, `CropSteer`, `Demo`, `DeficiencyWizard`, `DLICalc`, `DryBack`, `EnvRecipe`, `FermentTracker`, `FleetView`, `GardenStats`, `GrowCycle`, `HarvestEstimate`, `HarvestForecast`, `HealthCheck`, `JournalExport`, `KNFCalc`, `LightMap`, `NutrientCalc`, `NutrientpH`, `PestID`, `PhenoHunt`, `PhotoCompare`, `PlantCompare`, `PlantTimeline`, `PowerCalc`, `PreGrow`, `QRGen`, `QRTag`, `Report`, `RoomDiagram`, `RunManager`, `SeedBank`, `Snapshot`, `SoilMixCalc`, `StrainCompare`, `StrainReview`, `TerpProfile`, `TrainingLog`, `TrichomeTracker`, `UnitConv`, `VPDCalc`, `WaterLog`.

---

## Conventions

### CSS class prefixes per module/release

| Prefix | Owner |
|---|---|
| `.pnn-*` | Plant Nicknames / Numbering (v2.19.0) |
| `.enc-*` | Encrypted exports (v2.18.1) |
| `.pol-*` | v2.19.1 polish (button hierarchy, hero collapse, tabs, etc.) |
| `.demo-*` | Demo mode banner & body class |
| `.faq-*` | Help guide FAQ accordion |
| `.nph-*` | Nutrient pH chart (v2.18.0) |
| `.co2-*` | CO₂ calculator (v2.18.0) |
| `.bf-*` | Batch feeding (v2.18.0) |
| `.ph-*` | Pheno hunt cards |

Stick with this convention when adding new features — makes diffing and refactoring easy.

### Schema field naming (common gotchas)

| Field | Type | Notes |
|---|---|---|
| `growthStage` | `'seedling'\|'vegetative'\|'flowering'\|'mature'\|'declining'` | NOT `stage` |
| `healthStatus` | `'thriving'\|'healthy'\|'stressed'\|'sick'\|'quarantine'` | NOT `health` |
| `strainType` | `'hybrid'\|'sativa'\|'indica'\|'ruderalis'` | |
| `dateAcquired` | ISO date string `'YYYY-MM-DD'` | NOT a timestamp |
| `createdAt` / `updatedAt` | epoch ms (number) | |
| `timestamp` | epoch ms (number) | used on log entries (feedings, IPM, journal) |
| `plantNumber` | integer or `null` | auto-assigned when 2+ plants share strain |
| `nickname` | string | optional, overrides `plantNumber` in display |
| `parentMotherId` | string or `''` | used for clone lineage |
| `isDemo` | boolean | true on records seeded by `Demo` module |

### Display helpers

- `U.pn(m)` → `"Blue Dream — Yoda"` (full display name)
- `U.pnShort(m)` → `"Yoda"` (for tight spaces like chart axes, tree nodes)
- `U.esc(s)` → HTML-escape
- `U.age(dateStr)` → `"1mo 11d"` style human age
- `U.today()` → `'YYYY-MM-DD'`
- `U.parseDate(s)`, `U.daysBetween(a, b)`

### Module exposure
Every module that has any inline `onclick="ModuleName.method()"` MUST have `window.ModuleName = ModuleName;` after the declaration. Missed exposure = silent click failures. (Recent example: `HeroToggle` was missing this, the new compact-toggle button failed silently — fixed in v2.19.1.)

---

## Storage schema

Single localStorage key `motherPlantTracker` holds:

```
{
  version: '1.0.0',
  settings: { theme, lastActiveTab, showHero, heroExpanded, setupWizardDismissed,
              lastSeenVersion, notificationsEnabled, weather*, cloud*, ... },
  mothers:           {},   // plants
  environments:      {},   // tents / rooms
  clones:            {},
  tasks:             {},
  taskCompletions:   {},
  envLogs:           {},   // environment readings
  feedings:          {},
  photoJournal:      {},
  ipmLogs:           {},
  strains:           {},   // strain catalog (separate from mother.strainName)
  harvests:          {},
  nutrientProducts:  {},
  seeds:             {},
  healthChecks:      {},
  strainReviews:     {},
  dryBacks:          {},
  expenses:          {},
  soilMixRecipes:    {},
  trichomeReadings:  {},
  trainingLogs:      {},
  growRuns:          {},
  breedingLogs:      {},
  phenoHunts:        {},
  calibrationLogs:   {},
  meters:            {},
  waterLogs:         {},
  ppfdMaps:          {},
  terpProfiles:      {},
  cropSteerLogs:     {},
  activityLog:       []    // capped at 100 entries
}
```

`Store.{mothersArray, environmentsArray, clonesArray, ...}` return arrays. `Store.get(col)` returns the keyed object. `Store.set(col, id, obj)` writes (auto-stamps `updatedAt`). `Store.subscribe(fn)` for re-render triggers.

---

## Demo Mode

Visit `tracker.tropicalrootsmaui.com/?demo` → app loads with 5 plants, 1 tent, 7 days of readings, feedings, IPM, harvest, tasks.

- Data goes into **`sessionStorage`** (not localStorage) — real user data is never touched
- Body gets `class="demo-mode"`, header pushed down 42px for banner
- Refresh without `?demo` → clean reset
- "Start Using For Real →" button just navigates to `/` (no query)

Module: `Demo` (just before `Store`). `Demo.storage()` returns `sessionStorage` or `localStorage` based on `?demo` presence. Store uses `Demo.storage()` for all reads/writes.

Useful for testing locally — visit `/PlantManager.html?demo` and you get populated state without polluting your real data.

---

## Version bump checklist

When releasing a new version, update **all four** in sync:

1. `PlantManager.html` line ~1313 — `const APP_VERSION = 'X.Y.Z';`
2. `PlantManager.html` `WhatsNew._notes` — add new `'X.Y.Z': [bullets]` entry at top
3. `CHANGELOG.txt` — new dated block at top (see format below)
4. `PlantManagerHelp.html` line ~228 — `<div class="hero-byline">vX.Y.Z — Complete Feature Reference</div>`

### Changelog format

```
vX.Y.Z — YYYY-MM-DD
--------------------
FEATURE: Title

  Paragraph body explaining the feature in plain English. What it does,
  where to access it, key behaviors.

FIX: Title

  Bug fix description.

POLISH: Title

  UX/visual refinement.

SEO: / DOCS: / etc. for other categories.
```

**Convention:** if a polish patch lands the same day as a feature release, merge them into a single dated block. Same-date entries get compacted (see existing v2.19.1 and v2.18.1 blocks).

---

## Recent work inventory

### v2.19.1 (2026-03-11)
Plant Nicknames + Auto-Numbering, Star Wars name picker, plant card stage-themed stripes, action button collapse (5 primary + More menu), inline Feed CTA on dashboard alerts, custom scrollbar, SVG stat icons, color-coded plant tags, compact Quick Add, tab bar tightening, collapsible hero banner (280px default, click expand), static `<h1>` + `<noscript>` + LCP image hints (SEO), FAQ section on help page (10 Q&A + FAQPage JSON-LD), `?demo` mode.

### v2.18.1 (2026-03-12)
Encrypted Exports (AES-256-GCM / PBKDF2 600k), Nutrient Availability pH Chart, CO₂ Calculator + tracking, Batch Feeding.

### v2.17.0–v2.18.0
Terpene/cannabinoid logger, power cost calc, crop steering, env recipes, journal export, strain compare, photo timeline, KNF ferment tracker, companion planting guide, lifetime garden stats.

(Older history in `CHANGELOG.txt`.)

---

## Open / optional threads

- [ ] Port `dashboard-concept.html` (standalone Kānehiwa grimoire-aesthetic dashboard concept) into the real Dashboard tab. Lives at project root.
- [ ] Upgrade `WebApplication` JSON-LD → `SoftwareApplication` with `featureList`, `screenshot`, `softwareVersion`. Would enable app-style rich results in Google.
- [ ] Add `BreadcrumbList` schema on `PlantManagerHelp.html`.
- [ ] Add `Organization` schema cross-linking to main `tropicalrootsmaui.com` for subdomain authority signal.

---

## File map

```
PlantManager.html       ~14,800 lines  (main app — start here)
PlantManagerHelp.html    ~1,200 lines  (help guide with FAQ accordion)
CHANGELOG.txt            ~1,500 lines  (release history)
dashboard-concept.html     ~860 lines  (unported Kānehiwa grimoire concept)
sitemap.xml                            (main domain)
sitemap-tracker.xml                    (tracker subdomain → renamed sitemap.xml)
robots.txt                             (main domain)
robots-tracker.txt                     (tracker subdomain → renamed robots.txt)
site.webmanifest                       (Plant Manager PWA)
site-main.webmanifest                  (Tropical Roots Maui main site PWA)
service-worker.js                      (offline cache)
index.html                             (main marketing site, separate codebase)
img/                                   (logos, hero illustrations)
KnowledgeBase/                         (~60 grow guides, recipes, KNF series)
```

---

## Common operations

### Seeding demo data manually (for preview testing without `?demo`)
```js
// Run in browser console at any state
(function(){
  const db=JSON.parse(localStorage.getItem('motherPlantTracker'));
  const now=Date.now(), day=86400000;
  const mk=(id,strain,nick,num,stage,daysAgo,health,strainType)=>({
    id,strainName:strain,nickname:nick||'',plantNumber:num,
    growthStage:stage,dateAcquired:new Date(now-daysAgo*day).toISOString().split('T')[0],
    breeder:'Humboldt Seeds',mediumType:'soil',healthStatus:health||'thriving',
    strainType:strainType||'hybrid',source:'seed',
    archived:false,environmentId:'env1',parentId:null,parentMotherId:'',notes:'',photo:''
  });
  db.mothers={
    p1:mk('p1','Blue Dream','Yoda',null,'vegetative',42,'thriving','hybrid'),
    p2:mk('p2','Durban Poison','',1,'flowering',63,'thriving','sativa'),
    p3:mk('p3','Pineapple Chunk','Ahsoka',null,'vegetative',21,'stressed','indica')
  };
  db.environments={env1:{id:'env1',name:'Test Tent',type:'tent',createdAt:now}};
  db.settings.setupWizardDismissed=true;
  db.settings.lastSeenVersion='2.19.1';
  localStorage.setItem('motherPlantTracker',JSON.stringify(db));
  location.reload();
})();
```

### Clearing service worker + caches (force re-load after edits)
```js
navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));
caches.keys().then(ks=>ks.forEach(k=>caches.delete(k)));
location.reload(true);
```

### Preview server (uses Python http.server via `.claude/launch.json`)
Already configured. Use `preview_start` MCP tool with name `static-site` — serves on port 8080 from this folder.

---

## Style guardrails

- No new files outside this folder structure
- No new dependencies — vanilla JS only, single HTML file
- No emoji in code unless user requests it (the app does use emoji in UI but new code defaults to SVG, see `Dashboard._svg` for the pattern established in v2.19.1)
- Match existing terse coding style (single-line module methods, compact `h+=` HTML building)
- Always re-render after `Store.set/setting` calls (subscriber pattern handles most cases)
