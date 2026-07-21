'use strict';

// Les identifiants de composante sont dérivés de leur cellule d’ancrage et
// restent donc stables tant que cette cellule existe. Compléter uniquement les
// composantes reconnues ou celles dont l’embouchure automatique est ambiguë.
module.exports = {
  genericProfile: {
    upstreamSpeedKnot: 0.6,
    mouthSpeedKnot: 0.9,
    compoundOutletScoreTolerance: 0.15,
    compoundOutletSeparationCells: 3,
    maxCompoundOutlets: 6,
  },

  // Une composante composite contient plusieurs cours d’eau distincts qui
  // partagent au moins un hexagone sans se rejoindre réellement. Elle devra
  // être décomposée en tracés ; aucune embouchure unique ne lui est attribuée.
  compoundComponentIds: [
    'F-8_87',
    'F-12_4',
    'F-17_35',
    'F-42_14',
    'F-66_32',
    'F-77_56',
    'F-95_143',
    'F-98_73',
    'F-106_164',
  ],

  components: {
    // Exemple :
    // 'F-95_143': {
    //   name: 'Orénoque',
    //   mapName: 'Orinoque',
    //   profile: 'orenoque',
    //   mouthCellKeys: ['95_143'],
    // },
  },
};
