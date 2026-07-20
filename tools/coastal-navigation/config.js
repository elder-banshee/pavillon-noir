'use strict';

// Configuration fonctionnelle de la bande côtière dans le référentiel Jaillot.
// Les superficies et distances sont volontairement évaluées sur la carte,
// puisque le calculateur simule la lecture de cette carte déformée.
module.exports = {
  map: {
    nauticalMilesPerPixel: 0.310282,
    coastalDistanceNm: 30,
  },

  // La plus grande composante de Porto Rico est incluse dans le seuil.
  automaticLand: {
    referenceZoneId: 'porto-rico',
    includeReferenceArea: true,
  },

  // Petites terres qui doivent produire leur propre bande de 30 NM.
  // `components: 'all'` retient toute la zone ; un tableau utilise la
  // numérotation humaine des contours (1..n), identique à Zone Editor.
  whitelistLand: [
    { zoneId: 'trinidad', components: 'all' },
    { zoneId: 'grenade', components: 'all' },
    { zoneId: 'saint-vincent', components: 'all' },
    { zoneId: 'sainte-lucie', components: 'all' },
    { zoneId: 'martinique', components: 'all' },
    { zoneId: 'dominique', components: 'all' },
    { zoneId: 'guadeloupe', components: 'all' },
    { zoneId: 'leeward-islands', components: 'all' },
    { zoneId: 'saint-christophe', components: 'all' },
    { zoneId: 'saint-barth', components: 'all' },
    { zoneId: 'saint-martin', components: 'all' },
    { zoneId: 'sainte-croix', components: 'all' },
    { zoneId: 'iles-vierges-britanniques', components: 'all' },
    { zoneId: 'saint-thomas', components: 'all' },
    { zoneId: 'marguerita', components: 'all' },
    { zoneId: 'venezuela', components: [2] },
    { zoneId: 'tortuga-venezolana', components: 'all' },
    { zoneId: 'nouvelle-andalousie', components: [2, 3] },
    { zoneId: 'curaçao', components: 'all' },
  ],

  // Corrections ponctuelles connues avant la prochaine écriture canonique.
  forcedFluvialCells: ['88_68', '109_149'],
  forcedCellDefinitions: {
    '88_68': { domain: 'atlantic' },
  },
};
