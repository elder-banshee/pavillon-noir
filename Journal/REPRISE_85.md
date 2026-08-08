# REPRISE_85 — Renommage OSCAR → OCEAN dans le code actif

Session du 8 août 2026, à la suite de `REPRISE_84.md`.

## Objectif

Le nom « OSCAR » désignait une piste de modélisation des courants envisagée
très tôt puis abandonnée au profit de Copernicus (voir `REPRISE_59.md` /
`REPRISE_60.md`), mais il est resté accroché au fichier de grille hexagonale
et à tout son outillage (`oscar-hex-grid.js`, `OSCAR_HEX_GRID`, panneaux
« Grille OSCAR », etc.), alors que les cellules portent bien plus que du
courant (vent, navigabilité, données fluviales). Renommage vers **OCEAN**
(« cellules OCEAN », `ocean-hex-grid.js`), décidé avec Ronan.

## Périmètre retenu

Sur demande explicite de Ronan : renommer le code actif et les scripts, sans
toucher aux anciens fichiers ni aux journaux.

**Modifié** (24 fichiers, renommage de fichier inclus) :

- `js/oscar-hex-grid.js` → `js/ocean-hex-grid.js` (fichier de données, 4,3 Mo ;
  seules les 6 occurrences hors cellules — commentaire d'en-tête et déclaration
  `OSCAR_HEX_GRID`/`window.OSCAR_HEX_GRID` — étaient concernées, aucune donnée
  de cellule ne contenait le terme)
- `tools/sync-oscar-hex-grid-ocean-bounds.js` → `tools/sync-ocean-hex-grid-ocean-bounds.js`
- `carte.html`, `js/navigation-jaillot.js`, `js/fleuves-data.js`
- `tools/zone-editor.html`, `tools/zone-editor.css`, et tous les
  `tools/zone-editor-*.js` (core, bindings, export, interactions, map, ocean,
  panels) — c'est là que se trouvait le plus gros du volume : `zone-editor-ocean.js`
  concentrait à lui seul plus de 500 occurrences (identifiants de fonctions,
  classes CSS, ids de champs de formulaire, tout dérivé du préfixe `oscar`)
- `tools/coastal-navigation/generate-coastal-navigation.js`
- `tools/fluvial-currents/generate-fluvial-currents.js`,
  `identify-fluvial-components.js`, `README.md`
- `tools/fluvial-research/generate-fleuves-data.js`,
  `generate-fluvial-research.js`, `apply-fluvial-canonical-names.js`,
  `consolidate-legacy-multiple-mouths-v2.js`, `migrate-fluvial-schema-v2.js`,
  `validate-fluvial-schema-v2.js`, `README.md`

**Non modifié**, volontairement : `Archives/` (snapshots figés dont
`generate-oscar-hex-grid.js.old` et les variantes `oscar-hex-grid_*.js`),
`Journal/*.md` (comptes-rendus datés — les réécrire falsifierait
l'historique), et dans `tools/fluvial-research/` : les rapports générés
(`*-report.json`, `fluvial-research-inventory.json`) et les documents
d'analyse (`feuille-de-route-*.md`, `fluvial-hierarchie-navigation.md`,
`fluvial-identification-complete.md`, `inventaire-*.md`,
`fluvial-schema-v2.md`, `table-codes-secteur.md`), traités comme des
instantanés de recherche figés au même titre que le Journal.

## Méthode

Remplacement par substitution de sous-chaîne insensible à la casse
(`OSCAR`→`OCEAN`, `Oscar`→`Ocean`, `oscar`→`ocean`) sur les 24 fichiers du
périmètre retenu, après une première passe ciblée sur les identifiants et
libellés attendus. Choix justifié une fois vérifié que le terme n'apparaît
jamais comme sous-chaîne fortuite d'un autre mot dans ces fichiers (contrôlé
fichier par fichier avant application).

Couvre notamment : `OSCAR_HEX_GRID` → `OCEAN_HEX_GRID`,
`OSCAR_CALM_COLOR`/`OSCAR_CALM_SPEED_MAX` → `OCEAN_CALM_COLOR`/`OCEAN_CALM_SPEED_MAX`,
tout le préfixe `oscar…` de `zone-editor-ocean.js` (`getOscarGrid`,
`oscarKeyFromPoint`, `oscarFluvialCourses`, `OSCAR_INSPECTOR`, etc.), les ids
et classes CSS (`oscar-grid-cell`, `oscar-arrow-svg`, `oscar-controls`,
`sea-oscar`, `oscar-fluvial-inspector*`…), et les libellés UI (« Grille
OSCAR » → « Grille OCEAN »).

## Validation

- `node --check` sur les 19 fichiers `.js` modifiés : tous passent.
- `grep -rn "oscar-hex-grid.js|sync-oscar-hex-grid"` sur `js/`, `tools/` et
  `carte.html` (hors `Archives/`) : aucune référence résiduelle à l'ancien nom
  de fichier.
- `grep -io oscar` sur chacun des 24 fichiers modifiés : 0 occurrence
  restante.
- `tools/audit-text-integrity.js --strict-eol` : 1 erreur préexistante,
  hors périmètre (`tools/fluvial-research/staging/_master_table.txt`, fin de
  fichier manquante, non liée à cette session).
- `git diff --check` sur l'ensemble des fichiers modifiés : aucune erreur
  d'espace blanc.
- Cohérence croisée vérifiée manuellement : `carte.html` et
  `tools/zone-editor.html` chargent bien `js/ocean-hex-grid.js` ;
  `navigation-jaillot.js` lit bien `OCEAN_HEX_GRID`/`window.OCEAN_HEX_GRID`.

## Reste à faire

Une validation visuelle manuelle dans le navigateur (`carte.html` et
`tools/zone-editor.html`, mode OCÉANOGRAPHIE) reste recommandée avant de
considérer le chantier définitivement clos, notamment pour confirmer que les
panneaux Zone Editor (filtres, inspecteur fluvial, légendes) s'affichent
correctement après le renommage massif dans `zone-editor-ocean.js`.
