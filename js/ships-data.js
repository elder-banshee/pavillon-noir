/**
 * ships-data.js — Catalogue des navires du livre de règles Pavillon Noir
 *
 * Structure de chaque entrée :
 *   id                {string}   identifiant unique (snake_case)
 *   nom               {string}   nom affiché
 *   categorieTaille   {number}   1 Chaloupe · 2 Sloop · 3 Goélette · 4 Frégate · 5 Vaisseau de ligne
 *   tirantEau         {number}   tirant d'eau en mètres (valeur règles ; null si non renseigné)
 *   voilure           {string}   'aurique' · 'latine' · 'tierce' · 'carree' · 'mixte'
 *                                → voilure 'carree' implique virement lof-pour-lof (pas d'empannage)
 *   navigation        {object}
 *     vitesse_naive   {number}   vitesse constante en nœuds (Nav < 3) = moy_milles_jour ÷ 24
 *     pres            {number}   vitesse en nœuds au près (Nav ≥ 3)
 *     largue          {number}   vitesse en nœuds au largue (Nav ≥ 3)
 *     grand_largue    {number}   vitesse en nœuds au grand largue (Nav ≥ 3)
 *     vent_arriere    {number}   vitesse en nœuds vent arrière (Nav ≥ 3)
 *     avirons         {number|null} vitesse en nœuds sous avirons (null si non applicable)
 *   tonnage           {object}
 *     total           {number}   tonnage total en tonneaux (valeur médiane si plage)
 *     utile           {number}   tonnage utile en tonneaux (valeur médiane si plage)
 *   equipage          {object}
 *     max             {number}   équipage maximal (valeur médiane si plage)
 *     min             {number}   équipage minimal pour manœuvrer
 *   niveauNav         {number}   compétence Navigation minimale pour voir ce navire dans le catalogue
 *                                (Nav 0 = pas de catalogue ; le navire des PJ est toujours actif)
 *   regionRestriction {string[]} restrictions techniques — [] · ['cotiere'] · ['fluviale']
 *                                'cotiere' : navigation côtière uniquement (pirogues, praos)
 *                                'fluviale' : navigation fluviale uniquement (barges, flibots…)
 *                                Les indications géographiques (Méditerranée, Europe) et la rareté
 *                                pour la période sont des informations encyclopédiques → champ notes.
 *   notes             {string}   contexte géographique/historique, visible à Nav 5 (optionnel)
 *
 * Modificateurs de vitesse (appliqués par navigation-jaillot.js selon la compétence) :
 *   Encombrement (Nav ≥ 2) : tonnage_chargé < 25 % utile → +1 nœud ; > 75 % → −1 nœud
 *                            poids équipage ≈ 70 kg/membre inclus dans le calcul
 *   Carénage     (Nav ≥ 3) : < 2 mois → +1 nœud ; > 12 mois → −1 nœud
 *   Par défaut : 50 % encombrement, carénage 6 mois → modificateur nul
 */

'use strict';

const SHIPS_DATA = [

  // ── Niveau Nav 1 ──────────────────────────────────────────────────────────

  {
    id: 'chaloupe',
    nom: 'Chaloupe',
    categorieTaille: 1,
    tirantEau: 0.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 2.71, // 65 milles/j ÷ 24
      pres: 2,
      largue: 5.5,
      grand_largue: 5.5,
      vent_arriere: 4,
      avirons: 2,
    },
    tonnage: { total: 2, utile: 2 },
    equipage: { max: 20, min: 2 }, // max TSV : 15~30 → 20
    niveauNav: 1,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'sloop',
    nom: 'Sloop',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.75, // 90 milles/j ÷ 24
      pres: 4,
      largue: 10.5,
      grand_largue: 7.5,
      vent_arriere: 4,
      avirons: null,
    },
    tonnage: { total: 45, utile: 38 }, // TSV : 15~75 / 12~65 → médiane
    equipage: { max: 50, min: 6 },
    niveauNav: 1,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'cotre',
    nom: 'Cotre',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 4.38, // 105 milles/j ÷ 24
      pres: 4,
      largue: 10.5,
      grand_largue: 9.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 100, utile: 80 },
    equipage: { max: 60, min: 10 },
    niveauNav: 1,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'flibot_petit',
    nom: 'Flibot (petit)',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.33, // 80 milles/j ÷ 24
      pres: 3,
      largue: 8.5,
      grand_largue: 7.5,
      vent_arriere: 4.5,
      avirons: 1.5,
    },
    tonnage: { total: 80, utile: 70 },
    equipage: { max: 60, min: 8 },
    niveauNav: 1,
    regionRestriction: ['fluviale'],
    notes: 'Cabotage et rivière.',
  },

  {
    id: 'flibot_grand',
    nom: 'Flibot (grand)',
    categorieTaille: 3,
    tirantEau: 2,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.33, // 80 milles/j ÷ 24
      pres: 3,
      largue: 7,
      grand_largue: 7,
      vent_arriere: 4.5,
      avirons: null,
    },
    tonnage: { total: 250, utile: 200 },
    equipage: { max: 120, min: 15 },
    niveauNav: 1,
    regionRestriction: [],
    notes: 'Caboteur et navire de rivière profonde (Magdalena, bas Orénoque, estuaires antillais). Peut naviguer en mer des Caraïbes mais n\'est pas un hauturier. Ses limites sont exprimées par le tirant d\'eau, non par une restriction de zone.',
  },

  {
    id: 'flute',
    nom: 'Flûte',
    categorieTaille: 4,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.33, // 80 milles/j ÷ 24
      pres: 2,
      largue: 7,
      grand_largue: 7.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 1300, utile: 1075 }, // TSV : 600~2000 / 450~1700 → médiane
    equipage: { max: 200, min: 25 },
    niveauNav: 1,
    regionRestriction: [],
    notes: 'Navire de transport ; tonnage très variable selon la configuration.',
  },

  {
    id: 'marchand_compagnie_indes',
    nom: 'Marchand (Compagnie des Indes)',
    categorieTaille: 5,
    tirantEau: 7, // TSV : 5 → corrigé (800 tx / cat. 5 → 6–8 m attendus)
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.75, // 90 milles/j ÷ 24
      pres: 2,
      largue: 9,
      grand_largue: 10,
      vent_arriere: 7,
      avirons: null,
    },
    tonnage: { total: 800, utile: 700 },
    equipage: { max: 170, min: 21 },
    niveauNav: 1,
    regionRestriction: [],
    notes: '',
  },


  // ── Niveau Nav 2 ──────────────────────────────────────────────────────────

  {
    id: 'brick',
    nom: 'Brick',
    categorieTaille: 3,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 3,
      largue: 11,
      grand_largue: 12,
      vent_arriere: 8,
      avirons: null,
    },
    tonnage: { total: 200, utile: 140 },
    equipage: { max: 150, min: 22 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'brigantin',
    nom: 'Brigantin',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'mixte',
    navigation: {
      vitesse_naive: 4.38, // 105 milles/j ÷ 24
      pres: 3.5,
      largue: 10.5,
      grand_largue: 11.5,
      vent_arriere: 7.5,
      avirons: 3,
    },
    tonnage: { total: 120, utile: 90 },
    equipage: { max: 90, min: 18 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'corvette',
    nom: 'Corvette (Sloop of War)',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.58, // 110 milles/j ÷ 24
      pres: 2.5,
      largue: 10,
      grand_largue: 11,
      vent_arriere: 8,
      avirons: null,
    },
    tonnage: { total: 375, utile: 310 },
    equipage: { max: 150, min: 40 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'deux_ponts_trois_mats_barque',
    nom: 'Deux-ponts trois-mâts barque',
    categorieTaille: 5,
    tirantEau: 6.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.54, // 85 milles/j ÷ 24
      pres: 2.5,
      largue: 7.5,
      grand_largue: 8.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 775, utile: 660 },
    equipage: { max: 550, min: 75 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'goelete_a_hunier',
    nom: 'Goélette à hunier (schooner)',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'mixte',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 5,
      largue: 12,
      grand_largue: 10.5,
      vent_arriere: 5.5,
      avirons: null,
    },
    tonnage: { total: 125, utile: 100 },
    equipage: { max: 120, min: 19 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'hourque',
    nom: 'Hourque',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 2.92, // 70 milles/j ÷ 24
      pres: 1.5,
      largue: 6,
      grand_largue: 6.5,
      vent_arriere: 4.5,
      avirons: null,
    },
    tonnage: { total: 60, utile: 50 },
    equipage: { max: 30, min: 14 },
    niveauNav: 2,
    regionRestriction: [],
    notes: 'Mauvais navire de mer malgré ses dérives latérales compensatrices : forte dérive au près, réaction médiocre aux grains, gîte excessive. Utilisée dans les Antilles dès le XVIIe siècle pour le cabotage inter-îles. Appliquer un malus de Manœuvrabilité en navigation hauturière (mer ouverte). Ne pas brider la vitesse : elle pouvait courir correctement au largue.',
  },

  {
    id: 'marchand',
    nom: 'Marchand',
    categorieTaille: 4,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.13, // 75 milles/j ÷ 24
      pres: 1.5,
      largue: 6.5,
      grand_largue: 7.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 200, utile: 170 },
    equipage: { max: 170, min: 21 },
    niveauNav: 2,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'petit_prao_pirogue',
    nom: 'Petit prao ou pirogue',
    categorieTaille: 1,
    tirantEau: 0.6, // TSV : 0,2~1 → médiane
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 7,   // TSV : 10 — aberrant historiquement, ramené à 7
      largue: 12,
      grand_largue: 10,
      vent_arriere: 6.5,
      avirons: 5,
    },
    tonnage: { total: 4, utile: 3 }, // TSV : 1~7 / 1~5 → médiane
    equipage: { max: 15, min: 1 }, // TSV : 4~30 → médiane
    niveauNav: 2,
    regionRestriction: ['cotiere'],
    notes: 'Navigation côtière uniquement. Vitesses polaires révisées : les valeurs du livre de règles (10 nœuds au près) sont aberrantes historiquement — les praos atteignent des vitesses remarquables au portant, nettement moins au près.',
  },

  {
    id: 'prao_caraibe',
    nom: 'Prao caraïbe',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.33, // 80 milles/j ÷ 24
      pres: 6,
      largue: 12.5,
      grand_largue: 10,
      vent_arriere: 5.5,
      avirons: 3,
    },
    tonnage: { total: 12, utile: 9 },
    equipage: { max: 40, min: 4 },
    niveauNav: 2,
    regionRestriction: ['cotiere'],
    notes: 'Navigation côtière uniquement.',
  },


  // ── Niveau Nav 3 ──────────────────────────────────────────────────────────

  {
    id: 'barque_pinque_polacre',
    nom: 'Barque / Pinque / Polacre',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'mixte',
    navigation: {
      vitesse_naive: 3.13, // 75 milles/j ÷ 24
      pres: 4.5,
      largue: 7.5,
      grand_largue: 6.5,
      vent_arriere: 3.5,
      avirons: 1,
    },
    tonnage: { total: 150, utile: 120 },
    equipage: { max: 60, min: 20 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'barge_chaland',
    nom: 'Barge ou Chaland',
    categorieTaille: 3,
    tirantEau: 0.9, // TSV : 2~4 pieds → 0,6~1,2 m → médiane 0,9 m
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.13, // 75 milles/j ÷ 24
      pres: 3,
      largue: 7.5,
      grand_largue: 6.5,
      vent_arriere: 3.5,
      avirons: null,
    },
    tonnage: { total: 60, utile: 45 },
    equipage: { max: 30, min: 5 },
    niveauNav: 3,
    regionRestriction: ['fluviale'],
    notes: 'Navigation fluviale uniquement.',
  },

  {
    id: 'deux_ponts_trois_mats_carre',
    nom: 'Deux-ponts trois-mâts carré',
    categorieTaille: 5,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 3.54, // 85 milles/j ÷ 24
      pres: 2,
      largue: 7.5,
      grand_largue: 8.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 1130, utile: 950 },
    equipage: { max: 650, min: 80 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'galion',
    nom: 'Galion',
    categorieTaille: 5,
    tirantEau: 7,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 2.50, // 60 milles/j ÷ 24
      pres: 1,
      largue: 5,
      grand_largue: 6,
      vent_arriere: 4,
      avirons: 0,
    },
    tonnage: { total: 1500, utile: 1200 },
    equipage: { max: 700, min: 90 },
    niveauNav: 3,
    regionRestriction: [],
    notes: 'Rare pour la période : le galion de flotte est en voie de disparition entre 1713 et 1720, remplacé par les navires de ligne. Tirant d\'eau élevé (7 m) limitant l\'accès aux ports peu profonds des Caraïbes.',
  },

  {
    id: 'galiote',
    nom: 'Galiote (petite galère)',
    categorieTaille: 3,
    tirantEau: 3,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 1.5,
      largue: 4,
      grand_largue: 4,
      vent_arriere: 2.5,
      avirons: 4,
    },
    tonnage: { total: 90, utile: 60 },
    equipage: { max: 150, min: 60 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'goelete_de_guerre',
    nom: 'Goélette de guerre',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'mixte',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 4,
      largue: 12,
      grand_largue: 11,
      vent_arriere: 6,
      avirons: null,
    },
    tonnage: { total: 125, utile: 100 },
    equipage: { max: 140, min: 22 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'goelete_franche',
    nom: 'Goélette franche',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 5.5,
      largue: 12,
      grand_largue: 10,
      vent_arriere: 5.5,
      avirons: null,
    },
    tonnage: { total: 100, utile: 80 },
    equipage: { max: 60, min: 12 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'trois_mats_goelete',
    nom: 'Trois-mâts goélette',
    categorieTaille: 3,
    tirantEau: 5,
    voilure: 'mixte',
    navigation: {
      vitesse_naive: 4.38, // 105 milles/j ÷ 24
      pres: 4,
      largue: 10.5,
      grand_largue: 9.5,
      vent_arriere: 5,
      avirons: null,
    },
    tonnage: { total: 250, utile: 210 },
    equipage: { max: 90, min: 30 },
    niveauNav: 3,
    regionRestriction: [],
    notes: '',
  },


  // ── Niveau Nav 4 ──────────────────────────────────────────────────────────

  {
    id: 'berckois',
    nom: 'Berckois',
    categorieTaille: 1,
    tirantEau: 1.5,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 3.13, // 75 milles/j ÷ 24
      pres: 2.5,
      largue: 6.5,
      grand_largue: 6.5,
      vent_arriere: 4.5,
      avirons: 1,
    },
    tonnage: { total: 3, utile: 2 },
    equipage: { max: 5, min: 2 },
    niveauNav: 4,
    regionRestriction: [],
    notes: 'Europe.',
  },

  {
    id: 'chasse_maree',
    nom: 'Chasse-marée',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 3.5,
      largue: 9,
      grand_largue: 9,
      vent_arriere: 6,
      avirons: null,
    },
    tonnage: { total: 60, utile: 40 },
    equipage: { max: 30, min: 9 },
    niveauNav: 4,
    regionRestriction: [],
    notes: 'Europe.',
  },

  {
    id: 'chebec',
    nom: 'Chébec',
    categorieTaille: 3,
    tirantEau: 3.5,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 5.00, // 120 milles/j ÷ 24
      pres: 6.5,
      largue: 12,
      grand_largue: 10,
      vent_arriere: 6.5,
      avirons: 4,
    },
    tonnage: { total: 300, utile: 250 },
    equipage: { max: 220, min: 20 },
    niveauNav: 4,
    regionRestriction: [],
    notes: 'Méditerranée et Indes orientales.',
  },

  {
    id: 'felouque',
    nom: 'Félouque',
    categorieTaille: 2,
    tirantEau: 1,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 5,
      largue: 10,
      grand_largue: 8,
      vent_arriere: 4.5,
      avirons: 3,
    },
    tonnage: { total: 45, utile: 35 },
    equipage: { max: 35, min: 11 },
    niveauNav: 4,
    regionRestriction: [],
    notes: 'Méditerranée et Indes orientales.',
  },

  {
    id: 'fregate_trois_mats_barque',
    nom: 'Frégate trois-mâts barque',
    categorieTaille: 4,
    tirantEau: 4.5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.38, // 105 milles/j ÷ 24
      pres: 3,
      largue: 9,
      grand_largue: 10,
      vent_arriere: 6.5,
      avirons: null,
    },
    tonnage: { total: 420, utile: 370 },
    equipage: { max: 250, min: 50 },
    niveauNav: 4,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'fregate_trois_mats_carre',
    nom: 'Frégate trois-mâts carré',
    categorieTaille: 4,
    tirantEau: 5,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 4.38, // 105 milles/j ÷ 24
      pres: 2.5,
      largue: 9,
      grand_largue: 10,
      vent_arriere: 7,
      avirons: null,
    },
    tonnage: { total: 594, utile: 510 },
    equipage: { max: 350, min: 60 },
    niveauNav: 4,
    regionRestriction: [],
    notes: '',
  },

  {
    id: 'galere_royale',
    nom: 'Galère royale',
    categorieTaille: 4,
    tirantEau: 4,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 5.83, // 140 milles/j ÷ 24
      pres: 2,
      largue: 4.5,
      grand_largue: 4.5,
      vent_arriere: 3,
      avirons: 5,
    },
    tonnage: { total: 125, utile: 90 },
    equipage: { max: 260, min: 150 },
    niveauNav: 4,
    regionRestriction: [],
    notes: 'Méditerranée.',
  },

  {
    id: 'tartane',
    nom: 'Tartane',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 5,
      largue: 10,
      grand_largue: 8,
      vent_arriere: 4.5,
      avirons: 2,
    },
    tonnage: { total: 110, utile: 90 },
    equipage: { max: 60, min: 8 },
    niveauNav: 4,
    regionRestriction: [],
    notes: '',
  },


  // ── Niveau Nav 5 ──────────────────────────────────────────────────────────

  {
    id: 'bisquine',
    nom: 'Bisquine',
    categorieTaille: 2,
    tirantEau: 3,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 3.5,
      largue: 9,
      grand_largue: 9,
      vent_arriere: 6,
      avirons: null,
    },
    tonnage: { total: 30, utile: 25 },
    equipage: { max: 20, min: 7 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Europe.',
  },

  {
    id: 'catalane',
    nom: 'Catalane',
    categorieTaille: 1,
    tirantEau: 1,
    voilure: 'latine',
    navigation: {
      vitesse_naive: 3.13, // 75 milles/j ÷ 24
      pres: 4,
      largue: 7.5,
      grand_largue: 6.5,
      vent_arriere: 3.5,
      avirons: 2,
    },
    tonnage: { total: 5, utile: 4 },
    equipage: { max: 9, min: 2 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Méditerranée.',
  },

  {
    id: 'dundee',
    nom: 'Dundee',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.54, // 85 milles/j ÷ 24
      pres: 3.5,
      largue: 9.5,
      grand_largue: 7,
      vent_arriere: 4,
      avirons: null,
    },
    tonnage: { total: 55, utile: 45 }, // TSV entrée groupée : valeur basse (Dundee)
    equipage: { max: 30, min: 10 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Navire de pêche et de commerce côtier.',
  },

  {
    id: 'gabare',
    nom: 'Gabare',
    categorieTaille: 2,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.54, // 85 milles/j ÷ 24
      pres: 3.5,
      largue: 9.5,
      grand_largue: 7,
      vent_arriere: 4,
      avirons: null,
    },
    tonnage: { total: 300, utile: 250 }, // TSV entrée groupée : valeur haute (Gabare)
    equipage: { max: 80, min: 10 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Navire de transport côtier et fluvial.',
  },

  {
    id: 'galeasse',
    nom: 'Galéasse',
    categorieTaille: 5,
    tirantEau: 4.5, // TSV : 8 → corrigé (galéasses historiques : 3–5 m)
    voilure: 'latine',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 1,
      largue: 3.5,
      grand_largue: 3.5,
      vent_arriere: 2.5,
      avirons: 4,
    },
    tonnage: { total: 500, utile: 300 },
    equipage: { max: 600, min: 250 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Méditerranée.',
  },

  {
    id: 'goelete_balaou',
    nom: 'Goélette balaou',
    categorieTaille: 3,
    tirantEau: 2.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 5.63, // 135 milles/j ÷ 24
      pres: 5.5,
      largue: 13.5,
      grand_largue: 12,
      vent_arriere: 6.5,
      avirons: null,
    },
    tonnage: { total: 60, utile: 50 },
    equipage: { max: 50, min: 14 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Rare pour la période.',
  },

  {
    id: 'lougre',
    nom: 'Lougre',
    categorieTaille: 2,
    tirantEau: 2,
    voilure: 'tierce',
    navigation: {
      vitesse_naive: 4.17, // 100 milles/j ÷ 24
      pres: 4,
      largue: 10,
      grand_largue: 10,
      vent_arriere: 7,
      avirons: 2,
    },
    tonnage: { total: 90, utile: 75 },
    equipage: { max: 50, min: 10 },
    niveauNav: 5,
    regionRestriction: [],
    notes: 'Europe. Interdit en rivière.',
  },

  {
    id: 'poon_de_hollande',
    nom: 'Poon de Hollande',
    categorieTaille: 2,
    tirantEau: 1.5,
    voilure: 'aurique',
    navigation: {
      vitesse_naive: 3.54, // 85 milles/j ÷ 24
      pres: 3.5,
      largue: 9.5,
      grand_largue: 7,
      vent_arriere: 4,
      avirons: 1,
    },
    tonnage: { total: 70, utile: 60 },
    equipage: { max: 20, min: 5 },
    niveauNav: 5,
    regionRestriction: ['fluviale'],
    notes: 'Europe. Navigation fluviale.',
  },

  {
    id: 'trois_ponts',
    nom: 'Trois-Ponts',
    categorieTaille: 5,
    tirantEau: 10,
    voilure: 'carree',
    navigation: {
      vitesse_naive: 2.92, // 70 milles/j ÷ 24
      pres: 1.5,
      largue: 6,
      grand_largue: 6.6,
      vent_arriere: 4.5,
      avirons: null,
    },
    tonnage: { total: 1600, utile: 1250 },
    equipage: { max: 1200, min: 100 },
    niveauNav: 5,
    regionRestriction: [],
    notes: '',
  },

];

// ── Export ─────────────────────────────────────────────────────────────────

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
