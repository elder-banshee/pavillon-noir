/**
 * ships-data.js — Catalogue des navires du livre de règles Pavillon Noir
 *
 * Structure de chaque entrée :
 *   id                {string}   identifiant unique (snake_case)
 *   nom               {string}   nom affiché
 *   categorieTaille   {number}   1 Chaloupe · 2 Sloop · 3 Goélette · 4 Frégate · 5 Vaisseau de ligne
 *   tirantEau         {number}   tirant d'eau en mètres (valeur corrigée)
 *   voilure           {string}   'aurique' · 'latine' · 'tierce' · 'carree' · 'livarde' · 'mixte'
 *                                → voilure 'carree' : virement lof-pour-lof obligatoire
 *   navigation        {object}
 *     vitesse_naive   {number}   vitesse constante en nœuds (Nav < 3)
 *     pres            {number|null}  vitesse en nœuds au près (Nav ≥ 3 ; null si N/A)
 *     largue          {number|null}
 *     grand_largue    {number|null}
 *     vent_arriere    {number|null}
 *     avirons         {number|null} vitesse sous avirons (null si non applicable)
 *   tonnage           {object}
 *     total           {number}   tonnage total (médiane si fourchette — voir note fourchette)
 *     utile           {number}   tonnage utile
 *     fourchette      {boolean}  true si les valeurs sont des médianes de fourchette
 *   equipage          {object}
 *     max             {number}   équipage maximal (médiane si fourchette)
 *     min             {number}   équipage minimal pour manœuvrer
 *     standard        {number}   équipage standard (commerce / guerre légère)
 *     fourchette      {boolean}  true si max est une médiane de fourchette
 *   niveauNav         {number}   compétence Navigation minimale pour voir ce navire dans le catalogue
 *                                (Nav 0 = pas de catalogue ; navire des PJ toujours actif)
 *   regionRestriction {string[]} restrictions techniques — [] · ['cotiere'] · ['fluviale'] · ['riviere']
 *                                Les indications géographiques et rareté → champ notes
 *   malusHauturier    {boolean}  true si malus de manœuvrabilité en navigation hauturière
 *   notes             {string}   contexte géographique/historique (Nav 5) ou note technique
 *
 * Modificateurs de vitesse (nav-jaillot.js) :
 *   Encombrement (Nav ≥ 2) : < 25 % utile → +1 nœud ; > 75 % → −1 nœud  (≈ 70 kg/membre)
 *   Carénage     (Nav ≥ 3) : < 2 mois → +1 nœud ; > 12 mois → −1 nœud
 *   Par défaut : 50 % encombrement, 6 mois → modificateur nul
 */

'use strict';

const SHIPS_DATA = [

  // ── Navire des PJ ───────────────────────────────────────────────

  {
    id: 'navire-pj',
    nom: (typeof CARTE_NAVIRE !== 'undefined' ? CARTE_NAVIRE.nom : 'Cúchulainn'),
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.54,
      pres: 3.5, largue: 9.5, grand_largue: 7, vent_arriere: 4,
      avirons: null,
    },
    tonnage:  { total: 55, utile: 45, fourchette: false },
    equipage: { max: 30, min: 10, standard: 16, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Europe.',
  },

  // ── Catégorie 1 — Chaloupes ───────────────────────────────────────────────

  {
    id: 'chaloupe',
    nom: 'Chaloupe',
    categorieTaille: 1,
    tirantEau: 0.5,
    voilure: 'mixte', // tiers ou carrée selon l'armement
    navigation: {
      vitesse_naive: 2.7,
      pres: 2, largue: 5.5, grand_largue: 5.5, vent_arriere: 4,
      avirons: 2,
    },
    tonnage:  { total: 2,  utile: 2,  fourchette: false },
    equipage: { max: 22, min: 2, standard: 2, fourchette: true }, // TSV : 15~30
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'berckois',
    nom: 'Berckois',
    categorieTaille: 1,
    tirantEau: 1.5,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 3.125,
      pres: 2.5, largue: 6.5, grand_largue: 6.5, vent_arriere: 4.5,
      avirons: 1,
    },
    tonnage:  { total: 3,  utile: 2,  fourchette: false },
    equipage: { max: 5, min: 2, standard: 2, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: true,
    notes: 'Europe.',
  },

  {
    id: 'catalane',
    nom: 'Catalane',
    categorieTaille: 1,
    tirantEau: 1,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 3.125,
      pres: 4, largue: 7.5, grand_largue: 6.5, vent_arriere: 3.5,
      avirons: 2,
    },
    tonnage:  { total: 5,  utile: 4,  fourchette: false },
    equipage: { max: 9, min: 2, standard: 2, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Méditerranée.',
  },

  {
    id: 'petit_prao',
    nom: 'Petit prao',
    categorieTaille: 1,
    tirantEau: 0.5,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 5,
      pres: 7, largue: 12, grand_largue: 10, vent_arriere: 6.5,
      avirons: 5,
    },
    tonnage:  { total: 1,  utile: 1,  fourchette: false },
    equipage: { max: 4, min: 1, standard: 1, fourchette: false },
    niveauNav: 5,
    regionRestriction: ['cotiere'],
    malusHauturier: false,
    notes: 'Indonésie. Navigation côtière exclusivement.',
  },

  {
    id: 'pirogue',
    nom: 'Pirogue',
    categorieTaille: 1,
    tirantEau: 0.6, // TSV : 0,2~1 → médiane
    voilure: null,  // N/A selon le type ; pas de polaires
    navigation: {
      vitesse_naive: 5,
      pres: null, largue: null, grand_largue: null, vent_arriere: null,
      avirons: 5,
    },
    tonnage:  { total: 4,  utile: 3,  fourchette: true }, // TSV : 1~7 / 1~5
    equipage: { max: 40, min: 1, standard: 20, fourchette: true }, // TSV : 2~40 max
    niveauNav: 2,
    regionRestriction: ['cotiere'],
    malusHauturier: false,
    notes: 'Grande variété de formes selon l\'origine. Dimensions, tonnage et équipage très variables (fourchette). Navigation hauturière interdite.',
  },

  // ── Catégorie 2 — Sloops ──────────────────────────────────────────────────

  {
    id: 'sloop',
    nom: 'Sloop',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.75,
      pres: 4, largue: 10.5, grand_largue: 7.5, vent_arriere: 4,
      avirons: null,
    },
    tonnage:  { total: 45, utile: 38, fourchette: true }, // TSV : 15~75 / 12~65
    equipage: { max: 50, min: 6, standard: 12, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Tonnage très variable selon l\'armement.',
  },

  {
    id: 'cotre',
    nom: 'Cotre',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 4.375,
      pres: 4, largue: 10.5, grand_largue: 9.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 60, utile: 48, fourchette: true }, // TSV : 20~100 / 15~80
    equipage: { max: 60, min: 10, standard: 16, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'cotre_a_tape_cul',
    nom: 'Cotre à tape-cul',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.5,
      pres: 4, largue: 10.5, grand_largue: 9.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 57, utile: 47, fourchette: true }, // TSV : 25~90 / 20~75
    equipage: { max: 60, min: 12, standard: 16, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'dundee',
    nom: 'Dundee',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.54,
      pres: 3.5, largue: 9.5, grand_largue: 7, vent_arriere: 4,
      avirons: null,
    },
    tonnage:  { total: 55, utile: 45, fourchette: false },
    equipage: { max: 30, min: 10, standard: 16, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Europe.',
  },

  {
    id: 'felouque',
    nom: 'Félouque',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 4.15,
      pres: 5, largue: 10, grand_largue: 8, vent_arriere: 4.5,
      avirons: 3,
    },
    tonnage:  { total: 45, utile: 35, fourchette: false },
    equipage: { max: 35, min: 11, standard: 14, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Méditerranée et Indes orientales.',
  },

  {
    id: 'flibot_petit',
    nom: 'Flibot (petit)',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.5,
      pres: 3, largue: 8.5, grand_largue: 7.5, vent_arriere: 4.5,
      avirons: 1.5,
    },
    tonnage:  { total: 80, utile: 70, fourchette: false },
    equipage: { max: 60, min: 8, standard: 8, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: true,
    notes: 'Cabotage et rivière. Malus en navigation hauturière.',
  },

  {
    id: 'gabare',
    nom: 'Gabare',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.5,
      pres: 3.5, largue: 9.5, grand_largue: 7, vent_arriere: 4,
      avirons: null,
    },
    tonnage:  { total: 300, utile: 250, fourchette: false },
    equipage: { max: 80, min: 10, standard: 16, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'hourque',
    nom: 'Hourque',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 2.9,
      pres: 1.5, largue: 6, grand_largue: 6.5, vent_arriere: 4.5,
      avirons: null,
    },
    tonnage:  { total: 60, utile: 50, fourchette: false },
    equipage: { max: 30, min: 14, standard: 23, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: true,
    notes: 'Prévue pour canaux et navigation fluviale. Malus de manœuvrabilité en navigation hauturière.',
  },

  {
    id: 'poon_de_hollande',
    nom: 'Poon de Hollande',
    categorieTaille: 2,
    tirantEau: 1.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.5,
      pres: 3.5, largue: 9.5, grand_largue: 7, vent_arriere: 4,
      avirons: 1,
    },
    tonnage:  { total: 70, utile: 60, fourchette: false },
    equipage: { max: 20, min: 5, standard: 11, fourchette: false },
    niveauNav: 5,
    regionRestriction: ['fluviale'],
    malusHauturier: true,
    notes: 'Europe. Malus si tirant d\'eau < 3 m (dérive relevée).',
  },

  {
    id: 'prao_caraibe',
    nom: 'Prao caraïbe',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 3.5,
      pres: 6, largue: 12.5, grand_largue: 10, vent_arriere: 5.5,
      avirons: 3,
    },
    tonnage:  { total: 12, utile: 9, fourchette: false },
    equipage: { max: 40, min: 4, standard: 4, fourchette: false },
    niveauNav: 2,
    regionRestriction: ['cotiere'],
    malusHauturier: false,
    notes: 'Navigation hauturière interdite.',
  },

  {
    id: 'tartane',
    nom: 'Tartane',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 4.15,
      pres: 5, largue: 10, grand_largue: 8, vent_arriere: 4.5,
      avirons: 2,
    },
    tonnage:  { total: 110, utile: 90, fourchette: false },
    equipage: { max: 60, min: 8, standard: 14, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'bisquine',
    nom: 'Bisquine',
    categorieTaille: 2,
    tirantEau: 3,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.15,
      pres: 3.5, largue: 9, grand_largue: 9, vent_arriere: 6,
      avirons: null,
    },
    tonnage:  { total: 30, utile: 25, fourchette: false },
    equipage: { max: 20, min: 7, standard: 7, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Europe.',
  },

  {
    id: 'chasse_maree',
    nom: 'Chasse-marée',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.15,
      pres: 3.5, largue: 9, grand_largue: 9, vent_arriere: 6,
      avirons: null,
    },
    tonnage:  { total: 60, utile: 40, fourchette: false },
    equipage: { max: 30, min: 9, standard: 9, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Europe.',
  },

  {
    id: 'lougre',
    nom: 'Lougre',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.15,
      pres: 4, largue: 10, grand_largue: 10, vent_arriere: 7,
      avirons: 2,
    },
    tonnage:  { total: 90, utile: 75, fourchette: false },
    equipage: { max: 50, min: 10, standard: 16, fourchette: false },
    niveauNav: 5,
    regionRestriction: ['riviere'],
    malusHauturier: false,
    notes: 'Europe. Rare pour la période.',
  },


  // ── Catégorie 3 — Goélettes ───────────────────────────────────────────────

  {
    id: 'barge_chaland',
    nom: 'Barge ou Chaland',
    categorieTaille: 3,
    tirantEau: 0.9,
    voilure: 'livarde',
    navigation: {
      vitesse_naive: 3.125,
      pres: 3, largue: 7.5, grand_largue: 6.5, vent_arriere: 3.5,
      avirons: null,
    },
    tonnage:  { total: 60, utile: 45, fourchette: false },
    equipage: { max: 30, min: 5, standard: 11, fourchette: false },
    niveauNav: 3,
    regionRestriction: ['fluviale', 'cotiere'],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'barque',
    nom: 'Barque',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.125,
      pres: 4.5, largue: 7.5, grand_largue: 6.5, vent_arriere: 3.5,
      avirons: 1,
    },
    tonnage:  { total: 150, utile: 120, fourchette: false },
    equipage: { max: 60, min: 20, standard: 26, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'pinque',
    nom: 'Pinque',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 3.125,
      pres: 4.5, largue: 7.5, grand_largue: 6.5, vent_arriere: 3.5,
      avirons: 1,
    },
    tonnage:  { total: 150, utile: 120, fourchette: false },
    equipage: { max: 60, min: 20, standard: 26, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'chebec',
    nom: 'Chébec',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 5,
      pres: 6.5, largue: 12, grand_largue: 10, vent_arriere: 6.5,
      avirons: 4,
    },
    tonnage:  { total: 300, utile: 250, fourchette: false },
    equipage: { max: 220, min: 20, standard: 97, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Méditerranée et Indes orientales.',
  },

  {
    id: 'polacre',
    nom: 'Polacre',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 5,
      pres: 6.5, largue: 12, grand_largue: 10, vent_arriere: 6.5,
      avirons: 4,
    },
    tonnage:  { total: 300, utile: 250, fourchette: false },
    equipage: { max: 180, min: 20, standard: 26, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'brick',
    nom: 'Brick',
    categorieTaille: 3,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.15,
      pres: 3, largue: 11, grand_largue: 12, vent_arriere: 8,
      avirons: null,
    },
    tonnage:  { total: 200, utile: 140, fourchette: false },
    equipage: { max: 150, min: 22, standard: 34, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'brigantin',
    nom: 'Brigantin',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.375,
      pres: 3.5, largue: 10.5, grand_largue: 11.5, vent_arriere: 7.5,
      avirons: 3,
    },
    tonnage:  { total: 120, utile: 90, fourchette: false },
    equipage: { max: 90, min: 18, standard: 48, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'corvette',
    nom: 'Corvette (Sloop of War)',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.6,
      pres: 2.5, largue: 10, grand_largue: 11, vent_arriere: 8,
      avirons: null,
    },
    tonnage:  { total: 375, utile: 310, fourchette: false },
    equipage: { max: 150, min: 40, standard: 104, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'flibot_grand',
    nom: 'Flibot (grand)',
    categorieTaille: 3,
    tirantEau: 2,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.5,
      pres: 3, largue: 7, grand_largue: 7, vent_arriere: 4.5,
      avirons: null,
    },
    tonnage:  { total: 250, utile: 200, fourchette: false },
    equipage: { max: 120, min: 15, standard: 24, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: true,
    notes: 'Cabotage et rivière profonde. Malus en navigation hauturière.',
  },

  {
    id: 'goelete_a_hunier',
    nom: 'Goélette à hunier (schooner)',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5,
      pres: 5, largue: 12, grand_largue: 10.5, vent_arriere: 5.5,
      avirons: null,
    },
    tonnage:  { total: 125, utile: 100, fourchette: false },
    equipage: { max: 120, min: 19, standard: 28, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'goelete_balaou',
    nom: 'Goélette balaou',
    categorieTaille: 3,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5.625,
      pres: 5.5, largue: 13.5, grand_largue: 12, vent_arriere: 6.5,
      avirons: null,
    },
    tonnage:  { total: 60, utile: 50, fourchette: false },
    equipage: { max: 50, min: 14, standard: 14, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Rare pour la période.',
  },

  {
    id: 'goelete_de_guerre',
    nom: 'Goélette de guerre',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5,
      pres: 4, largue: 12, grand_largue: 11, vent_arriere: 6,
      avirons: null,
    },
    tonnage:  { total: 125, utile: 100, fourchette: false },
    equipage: { max: 140, min: 22, standard: 78, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'goelete_franche',
    nom: 'Goélette franche',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5,
      pres: 5.5, largue: 12, grand_largue: 10, vent_arriere: 5.5,
      avirons: null,
    },
    tonnage:  { total: 100, utile: 80, fourchette: false },
    equipage: { max: 60, min: 12, standard: 18, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'galiote',
    nom: 'Galiote (petite galère)',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 5,
      pres: 1.5, largue: 4, grand_largue: 4, vent_arriere: 2.5,
      avirons: 4,
    },
    tonnage:  { total: 90, utile: 60, fourchette: false },
    equipage: { max: 150, min: 60, standard: 104, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'trois_mats_goelete',
    nom: 'Trois-mâts goélette',
    categorieTaille: 3,
    tirantEau: 5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 4.375,
      pres: 4, largue: 10.5, grand_largue: 9.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 250, utile: 210, fourchette: false },
    equipage: { max: 90, min: 30, standard: 42, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  // ── Catégorie 4 — Frégates ────────────────────────────────────────────────

  {
    id: 'flute',
    nom: 'Flûte',
    categorieTaille: 4,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.5,
      pres: 2, largue: 7, grand_largue: 7.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 1300, utile: 1075, fourchette: true }, // 600~2000 / 450~1700
    equipage: { max: 200, min: 25, standard: 51, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Tonnage très variable selon la configuration.',
  },

  {
    id: 'fregate_trois_mats_barque',
    nom: 'Frégate trois-mâts barque',
    categorieTaille: 4,
    tirantEau: 4.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.375,
      pres: 3, largue: 9, grand_largue: 10, vent_arriere: 6.5,
      avirons: null,
    },
    tonnage:  { total: 420, utile: 370, fourchette: false },
    equipage: { max: 250, min: 50, standard: 65, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'fregate_trois_mats_carre',
    nom: 'Frégate trois-mâts carré',
    categorieTaille: 4,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.375,
      pres: 2.5, largue: 9, grand_largue: 10, vent_arriere: 7,
      avirons: null,
    },
    tonnage:  { total: 594, utile: 510, fourchette: false },
    equipage: { max: 350, min: 60, standard: 202, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'galere_royale',
    nom: 'Galère royale',
    categorieTaille: 4,
    tirantEau: 4,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 5.8,
      pres: 2, largue: 4.5, grand_largue: 4.5, vent_arriere: 3,
      avirons: 5,
    },
    tonnage:  { total: 125, utile: 90, fourchette: false },
    equipage: { max: 260, min: 150, standard: 193, fourchette: false },
    niveauNav: 4,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Méditerranée.',
  },

  {
    id: 'marchand',
    nom: 'Marchand',
    categorieTaille: 4,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.125,
      pres: 1.5, largue: 6.5, grand_largue: 7.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 200, utile: 170, fourchette: false },
    equipage: { max: 170, min: 21, standard: 37, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'marchand_negrier',
    nom: 'Marchand (négrier)',
    categorieTaille: 4,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.375,
      pres: 2.5, largue: 12, grand_largue: 13, vent_arriere: 9,
      avirons: null,
    },
    tonnage:  { total: 200, utile: 170, fourchette: false },
    equipage: { max: 170, min: 21, standard: 26, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Coque surtoilée, fortement allégée sur le lest pour maximiser la vitesse. Performances remarquables au portant.',
  },

  // ── Catégorie 5 — Vaisseaux de ligne ──────────────────────────────────────

  {
    id: 'deux_ponts_trois_mats_barque',
    nom: 'Deux-ponts trois-mâts barque',
    categorieTaille: 5,
    tirantEau: 6.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.5,
      pres: 2.5, largue: 7.5, grand_largue: 8.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 775, utile: 660, fourchette: false },
    equipage: { max: 550, min: 75, standard: 351, fourchette: false },
    niveauNav: 2,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'deux_ponts_trois_mats_carre',
    nom: 'Deux-ponts trois-mâts carré',
    categorieTaille: 5,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.5,
      pres: 2, largue: 7.5, grand_largue: 8.5, vent_arriere: 5,
      avirons: null,
    },
    tonnage:  { total: 1130, utile: 950, fourchette: false },
    equipage: { max: 650, min: 80, standard: 488, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'galeasse',
    nom: 'Galéasse',
    categorieTaille: 5,
    tirantEau: 4.5,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4,
      pres: 1, largue: 3.5, grand_largue: 3.5, vent_arriere: 2.5,
      avirons: 4,
    },
    tonnage:  { total: 500, utile: 300, fourchette: false },
    equipage: { max: 600, min: 250, standard: 445, fourchette: false },
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Méditerranée.',
  },

  {
    id: 'galion',
    nom: 'Galion',
    categorieTaille: 5,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 2.5,
      pres: 1, largue: 5, grand_largue: 6, vent_arriere: 4,
      avirons: null,
    },
    tonnage:  { total: 1500, utile: 1200, fourchette: false },
    equipage: { max: 700, min: 90, standard: 130, fourchette: false },
    niveauNav: 3,
    regionRestriction: [],
    malusHauturier: false,
    notes: 'Rare pour la période : le galion de flotte est en voie de disparition entre 1713 et 1720, remplacé par les navires de ligne.',
  },

  {
    id: 'marchand_compagnie_indes',
    nom: 'Marchand (Compagnie des Indes)',
    categorieTaille: 5,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.75,
      pres: 2, largue: 9, grand_largue: 10, vent_arriere: 7,
      avirons: null,
    },
    tonnage:  { total: 800, utile: 700, fourchette: false },
    equipage: { max: 170, min: 21, standard: 97, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

  {
    id: 'trois_ponts',
    nom: 'Trois-Ponts',
    categorieTaille: 5,
    tirantEau: 10,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3,
      pres: 1.5, largue: 6, grand_largue: 6.6, vent_arriere: 4.5,
      avirons: null,
    },
    tonnage:  { total: 1600, utile: 1250, fourchette: false },
    equipage: { max: 1200, min: 100, standard: 785, fourchette: true }, // TSV : 635~934
    niveauNav: 5,
    regionRestriction: [],
    malusHauturier: false,
    notes: '',
  },

];

// ── Fonctions utilitaires ──────────────────────────────────────────────────

/**
 * Retourne les navires accessibles pour un niveau de compétence Navigation donné.
 * Nav 0 : aucun navire dans le catalogue (le navire des PJ est géré séparément).
 * Nav 1+ : tous les navires dont niveauNav ≤ navLevel.
 */
function getShipsForNavLevel(navLevel) {
  if (navLevel === 0) return [];
  return SHIPS_DATA.filter(s => s.niveauNav <= navLevel);
}

/**
 * Retourne un navire par son id, ou null.
 */
function getShipById(id) {
  return SHIPS_DATA.find(s => s.id === id) ?? null;
}

window.SHIPS_DATA = SHIPS_DATA;
window.getShipsForNavLevel = getShipsForNavLevel;
window.getShipById = getShipById;
