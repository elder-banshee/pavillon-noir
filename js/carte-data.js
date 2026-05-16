// ═══════════════════════════════════════════════════════════
// CARTE — Données géopolitiques et scénarios
// ═══════════════════════════════════════════════════════════
//
// Coordonnées pixel : référentiel image 8500 × 5320 px
// Facteur de réduction depuis JP2 original : × 0.348
//
// ─── Année de référence ──────────────────────────────────────
// À mettre à jour manuellement après chaque session.
// Détermine le maximum atteignable par le curseur temporel.
const CARTE_ANNEE_REFERENCE = 1716;

// ─── Résolution de l'image ───────────────────────────────────
const CARTE_IMAGE = {
  src:    'medias/cartes/jaillot-1708.jpg',
  width:  8500,
  height: 5320,
  credit: 'Teatre de la Guerre en Amerique — Jaillot, Mortier & Sanson, 1708. Atlas Nouveau, Amsterdam/Paris. David Rumsey Map Collection.',
};

// ═══════════════════════════════════════════════════════════
// PUISSANCES COLONIALES
// Définit les couleurs et blasons de chaque puissance.
// ═══════════════════════════════════════════════════════════
const PUISSANCES = {
  britannique: {
    label:   'Couronne britannique',
    couleur: '#8b3a2a',          // or — dans la palette du site
    blason:  'pnj/pavillons/gb.svg',
  },
  espagnole: {
    label:   'Couronne d\'Espagne',
    couleur: '#c8973a',          // rust
    blason:  'pnj/pavillons/es.svg',
  },
  francaise: {
    label:   'Royaume de France',
    couleur: '#1a3a4a',          // sea
    blason:  'pnj/pavillons/fr_banniere.svg',
  },
  hollandaise: {
    label:   'Provinces-Unies',
    couleur: '#2a5a72',          // sea-light
    blason:  'carte/blasons/nl.svg',
  },
    "anarchie-pirate": {
    label:   'Anarchie Pirate',
    couleur: '#585754',          // ink
    blason:  'pnj/pavillons/generic_red.svg',
  },
  pirate: {
    label:   'République Pirate',
    couleur: '#0e0c09',          // ink
    blason:  'pnj/pavillons/nassau.svg',
  },
  conteste: {
    label:   'Territoire contesté',
    couleur: '#6b7c8a',          // mist
    blason:  null,
  },
};

// ═══════════════════════════════════════════════════════════
// JURIDICTIONS
// Une entrée par juridiction (gouvernement colonial distinct).
//
// Structure d'un champ temporel :
//   Les clés sont des années (Number).
//   La fonction resoudre(champ, annee) retourne la valeur
//   dont la clé est la plus grande ≤ annee sélectionnée,
//   en ignorant les clés > CARTE_ANNEE_REFERENCE.
//
// Champs stables (non temporels) :
//   id, nom, puissance_stable*, zone
//   * puissance_stable si elle ne change jamais sur 1712–1725
//
// Champs temporels (objet { annee: valeur }) :
//   puissance, gouverneur, contexte
//
// zone : polygone simplifié en coordonnées pixel [x, y]
//   → forme approximative, pas nécessairement fidèle aux côtes
// ═══════════════════════════════════════════════════════════
const JURIDICTIONS = [

  // ── MODÈLE COMPLET — Nassau / Bahamas ────────────────────
  // Premier exemple avec changement de puissance en 1718.
  {
    id:  'nassau-bahamas',
    nom: 'Bahamas',

    puissance: {
      1712: 'anarchie-pirate',
      1714: 'pirate',
      1718: 'britannique',
    },

    gouverneur: {
      1712: {
        nom:    'Thomas Walker',
        pnj_id: null,  // → ouvre la fiche dans pnj.html
        titre:  'Gouverneur par intérim',
      },
        1714: {
        nom:    'Conseil de Nassau',
        pnj_id: 'conseil-nassau',  // → ouvre la fiche dans pnj.html
        titre:  'Instance dirigeante',
      },
      1718: {
        nom:    'Woodes Rogers',
        pnj_id: null,              // pas encore dans le registre
        titre:  'Gouverneur royal',
      },
    },

    contexte: {
      1712: `Depuis 1706, Nassau est le cœur de l'activité Pirate — une anarchie organisée, où aucune puissance coloniale n'exerce d'autorité effective. Les pirates y commercent, y réparent leurs navires, y élisent leurs capitaines. La ville vit de la course, du pillage et du commerce interlope avec les colonies voisines.`,
      1714: `En 1713, la paix d'Utrecht redessine la carte coloniale, mais les Bahamas restent hors de portée des puissances. En 1714, les pirates de Nassau se dotent d'une constitution et d'un conseil élu, proclamant la République Pirate. Ils renforcent leur contrôle sur les îles et intensifient leurs raids contre les navires marchands.`,
      1718: `En juillet 1718, Woodes Rogers débarque à Nassau avec une flotte royale et une offre de grâce. La République Pirate s'effondre en quelques semaines. Certains acceptent la grâce, d'autres prennent la mer. Nassau devient officiellement une colonie de la Couronne britannique, administrée depuis Londres.`,
    },

    // Polygone approximatif couvrant l'archipel des Bahamas
    zone: [
      [4350, 1550],
      [4524, 1600],
      [4750, 1500],
      [4900, 1620],
      [4800, 1800],
      [4600, 1900],
      [4350, 1820],
      [4200, 1700],
    ],

    // Informations complémentaires stables
    capitale: 'Nassau (New Providence)',
    population_approx: '~2 000 habitants (1713)',
    economie: 'Course, commerce interlope, pêche aux éponges',
    note: null,
  },

  // ── MODÈLE MINIMAL — Jamaïque ────────────────────────────
  // Juridiction stable sur toute la période.
  {
    id:  'jamaique',
    nom: 'Jamaïque',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom:    'Archibald Hamilton',
        pnj_id: null,
        titre:  'Gouverneur',
      },
      1716: {
        nom:    'Peter Heywood',
        pnj_id: null,
        titre:  'Gouverneur',
      },
    },

    contexte: {
      1712: `Colonie britannique depuis 1655, la Jamaïque est la principale base navale de la Couronne dans les Antilles. Kingston concentre le commerce légal et interlope de toute la région. Port Royal, englouti par le séisme de 1692, a été remplacé par Kingston comme capitale marchande. L'île produit sucre, rhum et indigo, exploités par une main-d'œuvre servile nombreuse.`,
    },

    zone: [
      [4650, 2800],
      [4828, 2750],
      [4980, 2830],
      [4950, 2980],
      [4750, 3020],
      [4620, 2940],
    ],

    capitale: 'Spanish Town',
    population_approx: '~55 000 habitants (1713, dont ~45 000 esclaves)',
    economie: 'Sucre, rhum, indigo, commerce interlope',
    note: null,
  },

  // ── MODÈLE MINIMAL — Saint-Domingue ─────────────────────
  {
    id:  'saint-domingue',
    nom: 'Saint-Domingue',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      1712: {
        nom:    'Charles de la Boische, marquis de Beauharnois',
        pnj_id: null,
        titre:  'Gouverneur général',
      },
      1714: {
        nom:    'Jean-Charles de Passebon',
        pnj_id: 'blenac',
        titre:  'Gouverneur général',
      },
    },

    contexte: {
      1712: `La partie occidentale d'Hispaniola, cédée à la France par l'Espagne en 1697 (traité de Ryswick). Cap-Français en est la capitale et le principal port. Saint-Domingue est déjà la colonie sucrière la plus productive des Antilles françaises, alimentée par un trafic négrier massif. Sa prospérité repose sur une hiérarchie sociale rigide entre Blancs créoles, affranchis et esclaves.`,
    },

    zone: [
      [5050, 2380],
      [5493, 2350],
      [5650, 2500],
      [5500, 2700],
      [5229, 2750],
      [4980, 2650],
      [4980, 2480],
    ],

    capitale: 'Cap-Français',
    population_approx: '~150 000 habitants (1713, dont ~130 000 esclaves)',
    economie: 'Sucre, café, indigo, cacao',
    note: null,
  },

  // ── TEST SCROLL ──────────────────────────────────────────
  {
    id:  'test-scroll',
    nom: 'Cuba — Test de défilement',

    puissance: { 1712: 'espagnole' },

    gouverneur: {
      1712: { nom: 'Governador de prueba', pnj_id: null, titre: 'Gouverneur' },
    },

    contexte: {
      1712: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.`,
    },

    zone: [
      [3300, 1700],
      [3700, 1600],
      [4100, 1700],
      [4200, 1900],
      [4000, 2100],
      [3500, 2100],
      [3200, 1950],
    ],

    capitale: 'La Havane',
    population_approx: '~75 000 habitants (1713)',
    economie: 'Tabac, sucre, cuir, cuivre',
    note: 'Juridiction de test — à remplacer par les données réelles de Cuba.',
  },

  // ── À COMPLÉTER ──────────────────────────────────────────
  // Modèle vide pour les juridictions à documenter.
  // Dupliquer ce bloc et renseigner les champs.
  /*
  {
    id:  '',
    nom: '',
    puissance: { 1712: '' },
    gouverneur: {
      1712: { nom: '', pnj_id: null, titre: '' },
    },
    contexte: { 1712: `` },
    zone: [],
    capitale: '',
    population_approx: '',
    economie: '',
    note: null,
  },
  */
];

// ═══════════════════════════════════════════════════════════
// PINS DE SCÉNARIOS
// Marqueurs ponctuels positionnés sur la carte.
// Coordonnées pixel [x, y] à l'échelle 8500 × 5320.
// chronique_id → correspond à l'id dans chroniques-data.js
// ═══════════════════════════════════════════════════════════
const CARTE_PINS = [
  {
    id:           'pin-ile-des-ombres',
    chronique_id: 'ile-des-ombres',
    label:        "L'Île des Ombres",
    coords:       [3877, 1803],  // quelque part dans un rayon ~50px
    date:         'Avril 1713',
    extrait:      "Une île sans nom, des soldats espagnols et des Indiens Bravos tapis dans la forêt.",
  },
  {
    id:           'pin-sed',
    chronique_id: 'sed',
    label:        "Satiété engendre Démesure",
    coords:       [5493, 2540],  // Cap-Français
    date:         'Janvier 1714',
    extrait:      "Un banquet à Cap-Français, une délégation espagnole empoisonnée.",
  },
  {
    id:           'pin-marianne',
    chronique_id: 'marianne',
    label:        "La prise de la Marianne",
    coords:       [3510, 2095],  // Baya Honda
    date:         'Décembre 1715',
    extrait:      "La frégate française Marianne, trente-deux canons, prise par audace.",
  },
  {
    // Pin groupé — plusieurs événements survenus au même endroit
    id:     'pin-vero-beach',
    label:  "Site des épaves de la Flotte au Trésor",
    coords: [3969, 1296],  // Vero Beach — côte est Floride
    groupe: [
      {
        chronique_id: 'hippogriffe',
        label:        "Le dernier voyage de l'Hippogriffe",
        date:         'Septembre–Décembre 1715',
        extrait:      "Un naufrage providentiel, un cadavre aux plats d'or précolombiens.",
      },
      {
        chronique_id: 'epaves',
        label:        "Les épaves de la Flotte au Trésor",
        date:         'Janvier 1716',
        extrait:      "Huit millions de pièces de huit gisaient entre ciel et fond.",
      },
    ],
  },
  {
    id:           'pin-courses-trinidad',
    chronique_id: 'courses-trinidad',
    label:        "Courses à Trinidad",
    coords:       [7438, 4019],  // Trinidad
    date:         'Février 1716',
    extrait:      "La lettre de Ruggiero bouleversait les projets immédiats.",
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITAIRE — Résolution temporelle
// Retourne la valeur d'un champ temporel { annee: valeur }
// pour une année donnée, en respectant CARTE_ANNEE_REFERENCE.
// ═══════════════════════════════════════════════════════════
function resoudre(champ, annee) {
  if (!champ || typeof champ !== 'object') return champ;
  const anneeEffective = Math.min(annee, CARTE_ANNEE_REFERENCE);
  const cles = Object.keys(champ)
    .map(Number)
    .filter(a => a <= anneeEffective)
    .sort((a, b) => b - a);  // décroissant → le plus récent en premier
  if (cles.length === 0) return null;
  return champ[cles[0]];
}
