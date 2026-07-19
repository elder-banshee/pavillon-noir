# REPRISE_81 — Réconciliation des branches `main` et `dev`

Session du 19 juillet 2026, à la suite de `REPRISE_80.md`.

## Diagnostic

Les branches avaient divergé depuis `ae0c29f` (`REPRISE_76`) : `main`
comptait quatorze commits propres et `dev` deux commits propres (`5784f48`,
`cfb8265`). Le second avait enregistré par erreur des marqueurs de conflit
`Updated upstream` / `Stashed changes` dans sept fichiers JavaScript de Zone
Editor, ce qui rendait cette branche invalide.

La comparaison des arbres a montré que les apports légitimes de `dev` étaient
déjà présents sur `main` :

- `js/zones-data.js` était strictement identique sur les deux branches ;
- les archives, rapports, outils de synchronisation et reprises 77 à 79 ajoutés
  par `5784f48` étaient déjà identiques sur `main` ;
- les seules divergences Zone Editor correspondaient aux fichiers non résolus
  de `dev`, tandis que `main` contenait leurs versions propres et plus récentes.

## Réparation

Une branche locale de sauvegarde `backup/dev-before-repair-20260719` conserve
le sommet cassé `cfb8265`. `main` a ensuite été fusionnée dans `dev` en retenant
ses résolutions pour les fichiers en conflit. Avant ajout de cette reprise,
l'index fusionné était strictement identique à l'arbre de `main`.

Le push éventuel de `dev` reste volontairement séparé de la réparation locale.

## Validation

Les contrôles suivants sont passés sur l'état fusionné :

- `node --check js/carte.js`
- `node --check js/navigation-jaillot.js`
- `node --check js/carte-mobile.js`
- `node --check` sur les sept modules JavaScript Zone Editor réparés
- `node tools/audit-text-integrity.js --strict-eol`
- recherche globale de marqueurs de conflit dans les fichiers texte du dépôt
