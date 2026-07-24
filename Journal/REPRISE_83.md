# REPRISE_83 — Synchronisation Ocean Bounds et lisibilité dans Zone Editor

Session du 24 juillet 2026, à la suite de `REPRISE_82.md`.

## Nouvelles cellules navigables

Après les corrections manuelles de `ZONES_OCEAN_BOUNDS`, le synchroniseur
`tools/sync-oscar-hex-grid-ocean-bounds.js` a été adapté à la structure
actuelle, qui ne contient plus l’ancienne entité séparée `fleuve-bariana`.
Le garde-fou attend désormais uniquement les emprises Atlantique et Pacifique.

La grille OSCAR a été synchronisée en mode `--preserve-existing --write` :

- 14 cellules calmes ajoutées dans le domaine Atlantique ;
- 14 729 cellules existantes conservées sans modification ni recalcul ;
- aucune cellule supprimée ;
- 61 cellules existantes hors des nouvelles emprises préservées ;
- l’exception topologique `64_123` reste conservée.

Les cellules ajoutées sont `12_46`, `13_45`, `14_45`, `15_44`, `93_68`,
`94_68`, `101_153`, `101_154`, `102_153`, `102_154`, `103_151`, `103_153`,
`104_152` et `104_153`.

## Rendu Ocean Bounds

Dans Zone Editor, l’onglet `Topographie → Ocean Bounds` utilise maintenant un
style propre, sans modifier le rendu des territoires et hauts-fonds :

- contour bleu vif par défaut, épaisseur `2` ;
- contour bleu clair au survol, épaisseur `3` ;
- contour bleu clair à la sélection, épaisseur `3,5` ;
- remplissage bleu discret adapté à chaque état.

## Validation

- syntaxe de `carte.js`, `navigation-jaillot.js`, `carte-mobile.js`,
  `zone-editor-core.js`, `zone-editor-map.js`, du synchroniseur et de la grille
  OSCAR ;
- audit d’intégrité textuelle : aucune erreur ;
- un avertissement préexistant subsiste pour l’absence de fin de ligne dans
  `tools/fluvial-research/staging/_master_table.txt`.
