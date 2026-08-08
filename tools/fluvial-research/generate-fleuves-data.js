#!/usr/bin/env node
'use strict';

// Génère js/fleuves-data.js à partir de fluvial-research-inventory.json.
//
// Ce script ne relit jamais ocean-hex-grid.js directement : l'inventaire de
// recherche fait déjà ce travail (groupement des riverId, calcul de
// courseId, détection des outlets/relations). generate-fleuves-data.js se
// contente de projeter, pour chaque cours d'eau, les seuls champs utiles à
// la navigation et à la documentation — en écartant tout ce qui ne sert
// qu'au chantier d'identification (mapLabel, researchStatus, trace, centroid,
// bbox, nearbySettlements, nearbyTerritories, neighbouringWatercourses...) et
// toute coordonnée pixel brute, qui reste la responsabilité de
// ocean-hex-grid.js et zones-data.js.
//
// courseId (et non riverId) est la clé stable utilisée ici : riverId reste
// un identifiant technique hérité de la grille, mêlant parfois bras d'un
// même cours et cours distincts selon des conventions de nommage anciennes
// incohérentes. Voir fluvial-research-inventory.json > conventions.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY_PATH = path.join(__dirname, 'fluvial-research-inventory.json');
const OUTPUT_PATH = path.join(ROOT, 'js', 'fleuves-data.js');

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));

function projectOutlet(outlet) {
  const projected = { riverId: outlet.riverId, type: outlet.type };
  if (outlet.targetRiverId) projected.targetRiverId = outlet.targetRiverId;
  return projected;
}

function projectRelation(relation) {
  const projected = { type: relation.type };
  if (relation.fromRiverId) projected.fromRiverId = relation.fromRiverId;
  if (relation.toRiverId) projected.toRiverId = relation.toRiverId;
  if (relation.riverIds) projected.riverIds = relation.riverIds;
  return projected;
}

const fleuves = {};
inventory.watercourses
  .slice()
  .sort((a, b) => a.watercourseId.localeCompare(b.watercourseId, 'fr'))
  .forEach(watercourse => {
    fleuves[watercourse.watercourseId] = {
      name: watercourse.name,
      branches: watercourse.branches.map(branch => ({
        courseId: branch.courseId,
        riverId: branch.riverId,
        branch: branch.branch,
        cellCount: branch.cellKeys.length,
      })),
      cellCount: watercourse.cellCount,
      outlets: watercourse.outlets.map(projectOutlet),
      relations: watercourse.relations.map(projectRelation),
    };
  });

const header = `// ═══════════════════════════════════════════════════════════
// FLEUVES_DATA — Identité, hiérarchie et topologie des cours d'eau
// Généré par tools/fluvial-research/generate-fleuves-data.js à partir de
// fluvial-research-inventory.json — ne pas éditer à la main.
//
// Champs :
//   name       : nom d'affichage commun ; null si non identifié sur la carte
//   branches   : bras du cours — courseId (identifiant stable, à utiliser
//                comme clé de référence), riverId (identifiant technique
//                hérité, sert de jointure vers ocean-hex-grid.js), branch
//                (code de bras : 'main', 'delta-1', 'bras-2'...), cellCount
//   cellCount  : nombre total de cellules occupées par le cours (tous bras
//                confondus), utilisable comme proxy de taille
//   outlets    : terminaisons de chaque bras — riverId, type ('sea' :
//                embouchure en mer, 'map-edge' : sort de la carte,
//                'junction' : rejoint un autre cours via targetRiverId)
//   relations  : liens hydrologiques déclarés dans ocean-hex-grid.js
//                (ex. type 'fork' : bifurcation/confluence entre deux bras)
//
// La géométrie (contours, coordonnées pixel) reste dans zones-data.js et
// ocean-hex-grid.js ; ce fichier ne documente que l'identité et la
// topologie. Les vecteurs de courant et vitesses par cellule restent dans
// ocean-hex-grid.js. Pas encore chargé par index.html/carte.html — à
// intégrer une fois sa consommation implémentée (ex. futur schéma de
// vitesses générique/détaillé par cours).
// ═══════════════════════════════════════════════════════════

const FLEUVES_DATA = `;

const footer = `

if (typeof window !== 'undefined') window.FLEUVES_DATA = FLEUVES_DATA;
`;

fs.writeFileSync(OUTPUT_PATH, `${header}${JSON.stringify(fleuves, null, 2)};${footer}`, 'utf8');

console.log(`Cours documentés : ${Object.keys(fleuves).length}`);
console.log(`Bras : ${Object.values(fleuves).reduce((sum, item) => sum + item.branches.length, 0)}`);
console.log(`Fichier : ${path.relative(ROOT, OUTPUT_PATH)}`);
