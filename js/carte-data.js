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
  src: 'medias/cartes/jaillot-1708.jpg',
  width: 8500,
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
    label: 'Royaume de France',
    couleur: '#1a3a4a',          // sea
    blason:  'pnj/pavillons/fr_banniere.svg',
  },
  hollandaise: {
    label: 'Provinces-Unies',
    couleur: '#2a5a72',          // sea-light
    blason: 'carte/blasons/nl.svg',
  },
    "anarchie-pirate": {
    label:   'Anarchie Pirate',
    couleur: '#585754',          // ink
    blason:  'pnj/pavillons/generic_red.svg',
  },
  pirate: {
    label: 'République Pirate',
    couleur: '#0e0c09',          // ink
    blason:  'pnj/pavillons/nassau.svg',
  },
  conteste: {
    label: 'Territoire contesté',
    couleur: '#6b7c8a',          // mist
    blason: null,
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

  {
    id: 'caroline-du-sud',
    nom: 'Caroline du Sud',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Charles Craven',
        pnj_id: null,
        titre: 'Gouverneur propriétaire',
      },
      1716: {
        nom: 'Robert Daniell',
        pnj_id: null,
        titre: 'Gouverneur propriétaire',
      },
      1717: {
        nom: 'Robert Johnson',
        pnj_id: null,
        titre: 'Gouverneur propriétaire',
      },
      1719: {
        nom: 'James Moore Jr.',
        pnj_id: null,
        titre: 'Gouverneur populaire (révolution de 1719)',
      },
    },

    contexte: {
      1712: `Province de la Couronne britannique administrée pour le compte des Lords Proprietors, huit seigneurs disposant d'une charte royale depuis 1663. Charles Town (Charleston) est le seul port notable, plaque tournante du commerce de riz, d'indigo et d'esclaves. La Caroline du Sud vient d'être officiellement séparée de la Caroline du Nord en 1712. La guerre yamasee (1715–1717) ravage l'arrière-pays et fragilise considérablement l'autorité des Propriétaires.`,
      1719: `En novembre 1719, la population se soulève contre les Lords Proprietors jugés incapables d'assurer la défense de la colonie. James Moore Jr. est élu gouverneur par acclamation et une délégation est envoyée à Londres pour demander au roi de reprendre la colonie en main. La transition vers le statut de colonie royale est acceptée en 1720, bien que formellement consolidée en 1729 seulement.`,
    },

    zone: [],

    capitale: 'Charles Town (Charleston)',
    population_approx: '~18 000 habitants (1713, dont ~10 000 esclaves)',
    economie: 'Riz, indigo, commerce d\'esclaves, fourrures',
    /* note: 'Colonie propriétaire jusqu\'en 1719, royale dès 1720. Charles Craven (1712–1716) : gouverneur durant la guerre yamasee. Robert Johnson (1717–1719) : dernier gouverneur propriétaire. James Moore Jr. (dès déc. 1719) : issu de la révolution populaire. Succession confirmée par Wikipedia EN, List of colonial governors of South Carolina.', */
  },

  {
    id: 'floride',
    nom: 'Floride',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Francisco de Córcoles y Martínez',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1716: {
        nom: 'Pedro de Olivera y Fullana',
        pnj_id: null,
        titre: 'Gouverneur intérimaire',
      },
      1717: {
        nom: 'Juan de Ayala y Escobar',
        pnj_id: null,
        titre: 'Gouverneur intérimaire',
      },
      1718: {
        nom: 'Antonio de Benavides',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Presidio espagnol isolé, la Floride se réduit à Saint-Augustin (San Agustín) et à quelques missions franciscaines en territoire indien. Le gouverneur Córcoles administre une garnison chroniquement affamée : en 1712, les Anglais interceptent le situado — la subvention annuelle venue de Mexico — réduisant la population à se nourrir de chiens et de chevaux. La Floride sert surtout de glacis contre les colonies caroliniennes, et de refuge pour les esclaves en fuite des plantations britanniques, à qui Madrid accorde la liberté en échange du baptême et du service militaire.`,
      1716: `Après dix ans d'administration de Córcoles, une transition rapide s'opère à l'été 1716 : l'intérimaire Pedro de Olivera y Fullana cède la place dès octobre à Juan de Ayala y Escobar, figure controversée de la colonie. Ayala, soupçonné de contrebande avec les marchands anglais, administre la Floride dans un climat de tension intérieure.`,
      1718: `En août 1718, Antonio de Benavides prend le gouvernorat avec un mandat de réforme. Il fait arrêter son prédécesseur Ayala pour commerce interlope, renforce les liens avec les nations indiennes voisines, et repousse plusieurs tentatives d'incursion britannique. Sa longévité au poste — jusqu'en 1734 — en fait l'homme fort de la Floride pour toute la période de la campagne.`,
    },

    zone: [],  // SVG en cours

    capitale: 'San Agustín (Saint Augustine)',
    population_approx: '~1 500 habitants (1713, garnison et civils)',
    economie: 'Situado royal (subvention de Mexico), missions franciscaines, commerce interlope discret avec les Anglais',
    /* note: 'La Floride dépend nominalement de la vice-royauté de Nouvelle-Espagne (Mexico). Les dates de gouverneurs sont confirmées par les archives de l\'AGI (Audiencia de Santo Domingo, SD 843) et par John Jay TePaske, The Governorship of Spanish Florida, 1700–1763 (Duke UP, 1964).', */
  },

  {
    id: 'louisiane',
    nom: 'Louisiane',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      1712: {
        nom: 'Jean-Baptiste Le Moyne de Bienville',
        pnj_id: null,
        titre: 'Commandant (intérimaire)',
      },
      1713: {
        nom: 'Antoine de Lamothe Cadillac',
        pnj_id: null,
        titre: 'Gouverneur (concession Crozat)',
      },
      1716: {
        nom: 'Jean-Baptiste Le Moyne de Bienville',
        pnj_id: null,
        titre: 'Commandant général',
      },
      1717: {
        nom: 'Jean-Michel de Lespinay',
        pnj_id: null,
        titre: 'Gouverneur',
      },
      1718: {
        nom: 'Jean-Baptiste Le Moyne de Bienville',
        pnj_id: null,
        titre: 'Commandant général (Compagnie des Indes)',
      },
    },

    contexte: {
      1712: `Colonie française à peine viable, centrée sur Mobile (Ala.) et quelques postes dispersés le long du Mississippi. En 1712, Louis XIV cède à l'armateur Antoine Crozat un monopole commercial de quinze ans sur la Louisiane. Bienville, qui administre la colonie depuis 1702, cède en 1713 le gouvernorat à Cadillac — fondateur de Détroit — mais reste commandant militaire. La population blanche dépasse à peine 400 âmes. La colonie survit grâce aux alliances indiennes et au commerce des peaux.`,
      1713: `Sous Cadillac (1713–1716), la Louisiane stagne. Le gouverneur se brouille avec les nations indiennes, notamment les Natchez, et échoue à rendre la colonie profitable. Crozat retire sa concession en 1717, épuisé par les pertes.`,
      1717: `En 1717, le régent Philippe d'Orléans confie la Louisiane à la Compagnie d'Occident de John Law, bientôt rebaptisée Compagnie des Indes. Bienville retrouve les rênes sous le titre de commandant général. En 1718, il fonde La Nouvelle-Orléans sur un méandre du Mississippi, cent lieues de la mer. La "bulle du Mississippi" attire des milliers de colons européens, souvent contraints ou illusionnés.`,
    },

    zone: [],

    capitale: 'Mobile (jusqu\'en 1718), puis La Nouvelle-Orléans',
    population_approx: '~400 Blancs (1712), ~5 000 (1720, afflux de colons)',
    economie: 'Fourrures, tabac, commerce indien, subventions de la Couronne / Compagnie',
    /* note: 'Bienville sert quatre mandats non consécutifs (1702–1713, 1716–17, 1718–1725, 1733–1743). Le titre exact varie : "gouverneur" sous Crozat, "commandant général" sous la Compagnie. Sources : DCB (Dictionary of Canadian Biography), 64 Parishes (LSU), Britannica.', */
  },

  {
    id: 'nouveau-mexique',
    nom: 'Nouveau-Mexique',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Juan Ignacio Flores Mogollón',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Félix Martínez de Torrelaguna',
        pnj_id: null,
        titre: 'Gouverneur par intérim (nommé par le vice-roi)',
      },
      1717: {
        nom: 'Juan Páez Hurtado',
        pnj_id: null,
        titre: 'Gouverneur par intérim',
      },
      1718: {
        nom: 'Antonio Valverde y Cosío',
        pnj_id: null,
        titre: 'Gouverneur par intérim',
      },
      1721: {
        nom: 'Juan Estrada de Austria',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Province frontière de la vice-royauté de Nouvelle-Espagne, le Nouveau-Mexique est un presidio isolé sur le Río Grande, accessible depuis Mexico uniquement par le long Camino Real de Tierra Adentro. Depuis la reconquête de 1692 après la révolte Pueblo de 1680, la colonie reste fragile : environ 3 000 Espagnols et métis, entourés de dizaines de milliers d'Indiens Pueblo, Apache, Navajo, Ute et d'une nouvelle menace montante — les Comanche venus des Grandes Plaines. Flores Mogollón est écarté en 1715 pour détournement de fonds, remplacé par une série d'intérimaires nommés par le vice-roi.`,
      1717: `La période 1715–1721 est marquée par une instabilité gouvernementale chronique et la pression croissante des Comanches sur les établissements espagnols. En 1719, Valverde mène une expédition vers le nord-est — jusqu'au Colorado actuel — pour évaluer la menace française et comanche. Il apprend que les Français arment les Pawnees et les Jumanos contre les Apaches alliés des Espagnols. Cette tension géopolitique est l'arrière-plan de la catastrophique expédition Villasur (1720), au cours de laquelle une troupe espagnole est décimée sur la Platte par des Pawnees armés par les Français.`,
    },

    zone: [],

    capitale: 'Santa Fe (Villa Real de la Santa Fe de San Francisco de Asís)',
    population_approx: '~3 000 colons espagnols et métis (1713) ; plusieurs dizaines de milliers d\'Indiens Pueblo',
    economie: 'Situado royal, élevage, missions franciscaines, commerce limité avec Mexico via El Camino Real',
    /* note: 'Séquence des gouverneurs confirmée par Wikipedia EN (articles individuels), l\'Atlas of Historic NM Maps (NM Humanities Council) et Infogalactic. La transition 1716–1717 entre Valverde, Páez Hurtado, puis Valverde à nouveau est documentée mais les dates exactes varient légèrement selon les sources.', */
  },

  {
    id: 'nueva-galicia',
    nom: 'Nueva Galicia (Guadalaxara)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Président de l\'Audiencia — non identifié avec certitude]',
        pnj_id: null,
        titre: 'Président-Gouverneur de la Real Audiencia de Guadalajara',
      },
    },

    contexte: {
      1712: `Reino de Nueva Galicia, administré depuis Guadalajara par le Président-Gouverneur de la Real Audiencia — une institution à la fois tribunal d'appel et gouvernement civil, indépendante de Mexico depuis 1574. À l'époque de la carte, la Nueva Galicia couvre un immense territoire intérieur : l'actuel Jalisco, Nayarit, Sinaloa, Aguascalientes, et nominalement les provinces septentrionales jusqu'au Nouveau-Mexique et aux Californies. La richesse de la région repose sur les mines d'argent de Zacatecas et sur l'élevage extensif. La population espagnole et créole se concentre dans les villes minières ; les Indiens, soumis aux missions franciscaines, fournissent l'essentiel de la main-d'œuvre. Loin des côtes et des routes maritimes, la Nueva Galicia est absente des chroniques pirates — mais ses convois d'argent vers Veracruz constituent une cible permanente pour les pirates opérant dans le golfe du Mexique.`,
    },

    zone: [],

    capitale: 'Guadalajara',
    population_approx: '~150 000 habitants (1713, colons et Indiens confondus)',
    economie: 'Argent (Zacatecas), élevage, textile (obrajes), missions franciscaines',
    /* note: 'AVERTISSEMENT HISTORIQUE : Le nom précis du Président-Gouverneur de l\'Audiencia de Guadalajara pour la période 1712–1725 n\'a pas pu être établi avec certitude depuis les sources accessibles. Les AGI (Audiencia de Guadalajara, legajos 1–54) constituent la source primaire de référence. À compléter lors d\'une recherche en bibliothèque spécialisée.', */
  },


  // ── MODÈLE COMPLET — Nassau / Bahamas ────────────────────
  // Premier exemple avec changement de puissance en 1718.
  {
    id:  'nassau-bahamas',
    nom: 'Nassau',

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
        titre: 'Instance dirigeante',
      },
      1718: {
        nom: 'Woodes Rogers',
        pnj_id: null,              // pas encore dans le registre
        titre: 'Gouverneur royal',
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
    /* note: null, */
  },

  {
    id: 'eleuthera',
    nom: 'Eleuthera & Harbour Island',

    puissance: {
      1712: 'britannique',
      1714: 'pirate',
      1718: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Thomas Walker',
        pnj_id: null,
        titre: 'Gouverneur par intérim (résidant à Harbour Island)',
      },
      1714: {
        nom: 'Conseil de Nassau',
        pnj_id: 'conseil-nassau',
        titre: 'Instance dirigeante (par extension depuis Nassau)',
      },
      1718: {
        nom: 'Woodes Rogers',
        pnj_id: null,
        titre: 'Gouverneur royal des Bahamas',
      },
    },

    contexte: {
      1712: `Île longue et étroite à 80 km à l'est de Nassau, Eleuthera est fondée en 1648 par des Puritains expulsés des Bermudes — des dissidents protestants républicains qui ont baptisé leur colonie du grec *eleútheros*, "libre", et rédigé l'un des premiers textes constitutionnels démocratiques des Amériques. Cette origine façonne durablement la culture politique de l'île : hostilité à la monarchie absolutiste et au catholicisme, méfiance envers toute autorité extérieure, solidarité communautaire puissante.

Pendant les années de raids espagnols et français sur Nassau (plus de trente incidents entre 1703 et 1715), Eleuthera et Harbour Island accueillent les réfugiés de New Providence. Thomas Walker, vice-gouverneur résiduel des Bahamas, finit par s'y installer lui-même. Il y fait construire vers 1710 une petite batterie côtière de quatre canons et quelques pierriers commandant l'entrée du port de Harbour Island — l'unique défense organisée de l'archipel pendant cette période.`,

      1714: `À partir de 1714, Eleuthera entre dans la sphère d'influence directe de Nassau et d'Hornigold. L'île joue trois rôles complémentaires et irremplaçables pour la République pirate.

**Le grenier de Nassau.** L'île produit ce que Nassau ne peut pas : vivres frais, eau douce, bois de chauffe, porcs, tortues. Cette dépendance physique donne à ceux qui contrôlent les réseaux locaux un levier politique réel sur Nassau.

**L'interface commerciale.** Harbour Island est le sas entre le monde pirate et le monde légal. Les marchands de Boston, des Carolines et de Virginie qui ne peuvent ou ne veulent pas mouiller à Nassau y trouvent un interlocuteur commode. Le rapport Musson de 1717 mentionne deux navires de 90 tonneaux venus de Boston "vendre des provisions aux pirates" — à Harbour Island, pas à Nassau. Deux réseaux s'y complètent : le clan Darvill/Stillwell assure le ravitaillement de base et le triangle Eleuthera–Nassau–Jamaïque (bois de brésillet contre rhum) ; Richard Thompson et John Cockram (associés d'Hornigold) importent des marchandises manufacturées depuis Curaçao et les colonies continentales.

**L'atelier et le refuge.** Les capacités de carénage et de réparation navale d'Eleuthera suppléent les insuffisances du port envasé de Nassau. En cas de danger, les petits navires peuvent se disperser dans les anses peu profondes, hors de portée des vaisseaux à fort tirant d'eau.`,

      1718: `L'arrivée de Woodes Rogers à Nassau en juillet 1718 intègre Eleuthera dans l'ordre colonial britannique sans résistance. La communauté n'a jamais été idéologiquement pirate : pragmatique et puritaine, elle a suivi Hornigold, et Hornigold accepte le pardon. Le commerce du bois de brésillet contre du rhum jamaïcain, les chantiers navals de Harbour Island et Spanish Wells — rien ne s'interrompt, la clientèle change simplement de statut. Rogers mentionne dans ses rapports la batterie de Harbour Island, toujours en place, ainsi qu'un second fort sur l'île principale dont l'emplacement et l'état précis ne sont pas documentés.`,
    },

    zone: [],

    capitale: 'Harbour Island (centre principal) ; Governor\'s Harbour (île principale)',
    population_approx: `~600 personnes vers 1707–1715 (pic réfugiés de Nassau) ; ~313 résidents permanents en 1722 (recensement Rogers) — plus une population flottante pirate pouvant porter le total à 400–500 en période active`,
    economie: 'Bois de brésillet (braziletto), pêche et tortues, ravitaillement des pirates (1714–1718), construction navale (Harbour Island, Spanish Wells), récupération sur épaves (wrecking)',
    /* note: `Statuts des données :
✅ Établi : origine puritaine 1648 ; recensement Rogers 1722 ; rapport Musson 1717 ; batterie Walker à Harbour Island.
✅ Personnages attestés : Jonathan Darvill, Daniel Stillwell, Richard Thompson, John Cockram (Calendar of State Papers, B.C. Brooks, Wikipedia).
🎲 Fiction de campagne : le Conseil de Nassau comme autorité de substitution sur Eleuthera à partir de 1714 — Eleuthera n'est pas formellement gouvernée depuis Nassau, mais dans sa sphère d'influence directe via Hornigold.
Sources : Calendar of State Papers Colonial ; B.C. Brooks, Bahamas Shipping Records 1721–1725 ; Colin Woodard, Republic of Pirates (2008).`, */
  },

  // ── MODÈLE COMPLET — Bermudes ─────────────────────────────
  {
    id: 'bermudes',
    nom: 'Bermudes',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Benjamin Bennett',
        pnj_id: null,
        titre: 'Gouverneur (Lieutenant-Gouverneur)',
      },
      1713: {
        nom: 'Henry Pulleine',
        pnj_id: null,
        titre: 'Gouverneur (Lieutenant-Gouverneur)',
      },
      1718: {
        nom: 'Benjamin Bennett',
        pnj_id: null,
        titre: 'Gouverneur (Lieutenant-Gouverneur, second mandat)',
      },
      1722: {
        nom: 'Sir John Hope',
        pnj_id: null,
        titre: 'Gouverneur (Lieutenant-Gouverneur)',
      },
    },

    contexte: {
      1712: `Archipel corallien britannique au large de l'Atlantique Nord, les Bermudes occupent une position stratégique sur les routes reliant l'Angleterre aux Antilles. La colonie vit de la construction navale (le cèdre des Bermudes est réputé), de la course et du commerce maritime. Les Bermudiens sont de redoutables marins et pilotes, dont plusieurs se retrouvent parmi les équipages pirates des Bahamas — au grand embarras du gouverneur Bennett, qui doit en 1719 convoquer son conseil pour traiter du problème des pilotes bermudiens guidant les pirates à travers les hauts-fonds de l'archipel.`,
      1718: `Le retour de Bennett coïncide avec la grande vague d'amnistie royale et de répression anti-pirate de 1718. Les Bermudes, traditionnellement liées aux Bahamas par des liens familiaux et commerciaux anciens, voient leur gouverneur sommé de surveiller de près les allées et venues des navires suspects.`,
    },

    zone: [],

    capitale: 'Saint George\'s',
    population_approx: '~6 000 habitants (1713, dont ~2 000 esclaves)',
    economie: 'Construction navale, course, pêche, sel (Turks Islands)',
    /* note: 'Le titre officiel est Lieutenant-Gouverneur jusqu\'en 1738, date à laquelle il est rétitré Gouverneur. Succession confirmée par le site officiel du gouvernement des Bermudes et Wikipedia EN (Governor of Bermuda). Bennett 1701–1713 et 1718–1722 : double mandat avéré.', */
  },


  // ── MODÈLE MINIMAL — Jamaïque ────────────────────────────
  // Juridiction stable sur toute la période.
  {
    id: 'jamaique',
    nom: 'Jamaïque',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Archibald Hamilton',
        pnj_id: null,
        titre: 'Gouverneur',
      },
      1716: {
        nom: 'Peter Heywood',
        pnj_id: null,
        titre: 'Gouverneur',
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
    /* note: null,
  },

  // ── MODÈLE MINIMAL — Saint-Domingue ─────────────────────
  {
    id: 'saint-domingue',
    nom: 'Saint-Domingue',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      1712: {
        nom: "Paul-François de La Grange, comte d'Arquian",
        pnj_id: null,
        titre: 'Gouverneur général des Antilles françaises',
      },
      1713: {
        nom: 'Louis de Courbon, comte de Blénac',
        pnj_id: 'blenac',
        titre: 'Gouverneur général de Saint-Domingue',
        // Note : jusqu'en 1714, ce titre couvre aussi les Îles du Vent
      },
      1717: {
        nom: 'Charles Joubert de La Bastide, marquis de Châteaumorand',
        pnj_id: null,
        titre: 'Gouverneur général de Saint-Domingue',
      },
      1719: {
        nom: 'Léon, marquis de Sorel',
        pnj_id: null,
        titre: 'Gouverneur général de Saint-Domingue',
      },
      1723: {
        nom: 'Gaspard de Goussé de La Roche-Allard',
        pnj_id: null,
        titre: 'Gouverneur général de Saint-Domingue',
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
    /* note: null, */
  },

  {
    id: 'santo-domingo',
    nom: 'Santo Domingo (Hispaniola espagnole)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Gouverneur non identifié avec certitude avant 1713]',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1713: {
        nom: 'Pedro de Niela y Torres',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1714: {
        nom: 'Antonio Landeche',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Fernando Constanzo y Ramírez',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `La partie orientale d'Hispaniola, sous souveraineté espagnole depuis 1492, est en 1712 une colonie appauvrie et presque abandonnée. Depuis les "devastaciones de Osorio" de 1605 — qui forcèrent le repeuplement de la côte nord pour couper le commerce interlope avec les Anglais et Français — l'île espagnole n'a jamais retrouvé sa prospérité d'antan. La ville de Santo Domingo conserve son prestige historique (première ville européenne des Amériques, siège de la Real Audiencia) mais la population est clairsemée, l'économie végète, et la frontière avec Saint-Domingue français à l'ouest est poreuse et conflictuelle.

Le Président-Gouverneur cumule trois fonctions : chef de l'exécutif civil, commandant militaire et président de la Real Audiencia de Santo Domingo — tribunal qui exerce encore nominalement une juridiction sur les colonies espagnoles des Caraïbes (Cuba, Porto Rico, Floride, Venezuela). En pratique, cette autorité est de plus en plus fictive.`,
      1715: `Fernando Constanzo y Ramírez assure un gouvernorat long et relativement stable (1715–1723), couvrant toute la période critique de la piraterie dorée et de la répression de 1718. La frontière avec Saint-Domingue est une zone de friction permanente : contrebande de bétail, d'esclaves et de denrées traverse quotidiennement une ligne que personne ne contrôle vraiment.`,
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

    capitale: 'Santo Domingo',
    population_approx: '~10 000 habitants (1713, colons espagnols et créoles)',
    economie: 'Élevage extensif, contrebande avec Saint-Domingue, quelques cultures vivrières',
    /* note: `ATTENTION : la zone polygonale ici est celle du bloc "saint-domingue" actuel — elle couvre l'île entière. Il faut diviser Hispaniola en deux zones distinctes lors de la vectorisation SVG : la portion orientale (Santo Domingo) et la portion occidentale (Saint-Domingue français). Le gouverneur de 1712 (avant Pedro de Niela) n'a pas été identifié avec certitude. Sources : concordance Geni (Gobiernos Coloniales de la Isla Española) et Rincón del Vago, toutes deux issues d'archives dominicaines. Fiabilité modérée.`, */
  },

  {
    id: 'porto-rico',
    nom: 'Porto Rico',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Francisco Danío Granados',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1713: {
        nom: 'Juan de Rivera',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
        // Note : date de début légèrement incertaine (déc. 1713 ou 1714/1715 selon les sources)
      },
      1720: {
        nom: 'Francisco Danío Granados',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général (2e mandat)',
      },
      1724: {
        nom: 'José Antonio de Mendizábal y Azcue',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Puerto Rico végète en marge du système colonial espagnol. L'île produit peu pour l'exportation et dépend largement du situado venu de Mexico. Le gouverneur Danío Granados se distingue par une corruption ouverte : il s'attaque au corsaire Miguel Enríquez, homme de couleur enrichi par la course sous pavillon espagnol, dont il tente de confisquer les navires. Ces conflits illustrent les tensions entre l'autorité coloniale et les élites créoles qui la contournent.`,
      1713: `La transition vers Juan de Rivera s'opère fin 1713 (date légèrement disputée entre les sources). La contrebande reste endémique à San Juan, port enclavé mais stratégiquement positionné entre Saint-Domingue et les Petites Antilles.`,
      1720: `Le retour de Granados au gouvernorat marque la continuité d'une administration corrompue. Il est finalement traduit en justice : soumis à un juicio de residencia, il est condamné sur 46 chefs d'accusation. Son successeur Mendizábal le fait emprisonner en 1724.`,
    },

    zone: [],

    capitale: 'San Juan',
    population_approx: '~6 000 habitants (1713)',
    economie: 'Situado royal, contrebande, gingembre, cuir, tabac',
    /* note: 'Transition Rivera 1713/1714–1716 : légère discordance entre sources. Granados condamné pour 46 chefs d\'accusation : fait établi (EnciclopediaPR / Fundación para las Humanidades de Puerto Rico). Miguel Enríquez, corsaire mulâtre, figure narrativement centrale pour la campagne.', */
  },

  {
    id: 'cuba',
    nom: 'Cuba',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Luis Chacón',
        pnj_id: null,
        titre: 'Gouverneur par intérim',
      },
      1713: {
        nom: 'Laureano de Torres y Ayala, marquis de Casa Torres',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général (rétabli)',
      },
      1716: {
        nom: 'Vicente de Raja',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1717: {
        nom: 'Gómez Mazaver Ponce de León',
        pnj_id: null,
        titre: 'Gouverneur provisoire',
      },
      1718: {
        nom: 'Gregorio Guazo y Calderón',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Cuba est le pivot logistique de l'empire espagnol dans les Caraïbes : La Havane est le point de rassemblement des flottes du Trésor avant leur traversée vers l'Espagne. La ville est fortifiée — le Castillo de los Tres Reyes del Morro domine l'entrée du port — mais la colonie souffre de la stagnation économique imposée par le monopole commercial espagnol. Le tabac, cultivé dans la Vuelta Abajo, est la principale richesse locale. L'île est gouvernée par intérim par Luis Chacón depuis la suspension controversée de Torres y Ayala en 1711, ordonnée par l'Audiencia de Santo Domingo à la suite d'une enquête sur sa gestion.`,
      1713: `Torres y Ayala, rétabli dans ses fonctions le 14 février 1713 après s'être défendu à Madrid, reprend le gouvernorat. Ancien gouverneur de Floride, fin administrateur, il lance la construction de l'Hôpital San Lázaro pour les lépreux à La Havane et soutient activement le monopole tabacier de la Couronne — source de tensions avec les contrebandiers et les producteurs indépendants. Il fonde également la ville de Santiago del Bejucal. Il meurt en poste à La Havane en 1725.`,
      1718: `Gregorio Guazo y Calderón prend le gouvernorat en juin 1718, dans le sillage de la grande répression anti-pirate qui voit Woodes Rogers s'installer à Nassau. Cuba est la base arrière naturelle des opérations navales espagnoles dans la région, et le nœud de tous les circuits commerciaux — légaux et interlopes — des Caraïbes occidentales.`,
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

    capitale: 'La Havane (Havana)',
    population_approx: '~75 000 habitants (1713, dont ~15 000 esclaves)',
    economie: 'Tabac (monopole royal), sucre, cuir, cuivre, chantiers navals, commerce de transit',
    /* note: 'Torres y Ayala (1708–1711 et 1713–1716) : double mandat confirmé, interruption par enquête de l\'Audiencia documentée. Séquence complète vérifiée sur Wikipedia EN (List of colonial governors of Cuba), croisant avec l\'article biographique de Torres y Ayala. Note du fichier précédent ("Vicente Raja, dates discordantes") : les dates sont en réalité cohérentes — 26 mai 1716 au 23 août 1717.', */
  },

  {
    id: 'panuco',
    nom: 'Pánuco',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Alcalde mayor — non renseigné]',
        pnj_id: null,
        titre: 'Alcalde mayor (officier subalterne de la vice-royauté)',
      },
    },

    contexte: {
      1712: `La région de Pánuco, sur le golfe du Mexique au nord de Veracruz, est mentionnée séparément sur la carte Jaillot en raison d'un usage cartographique hérité du XVIe siècle — Pánuco avait alors été une gouvernation distincte, avant d'être absorbée dans la vice-royauté. En 1712, ce n'est plus qu'une alcaldía mayor relevant directement de la vice-royauté de Nouvelle-Espagne et de l'Audiencia de Mexico. Il n'y a pas de gouverneur propre : un alcalde mayor nommé annuellement gère les affaires locales depuis Tampico.

La région est économiquement marginale — quelques élevages, des communautés indiennes sous tutelle franciscaine, et un petit trafic de contrebande avec les navires anglais longeant le golfe. Sa mention sur la carte reflète davantage la tradition cartographique que la réalité administrative de l'époque.`,
    },

    zone: [],

    capitale: 'Tampico',
    population_approx: '~15 000 habitants (1713, estimation)',
    economie: 'Élevage, missions franciscaines, commerce fluvial limité',
    /* note: `Pánuco n\'est pas une juridiction autonome en 1712 — c\'est une alcaldía mayor de la Nouvelle-Espagne. Sa mention séparée sur la carte Jaillot reflète un usage cartographique anachronique hérité de la période où Pánuco était une gobernación distincte (XVIe siècle). Aucun gouverneur propre à renseigner. Le champ "gouverneur" est intentionnellement vide. Ce bloc peut être intégré dans le bloc nouvelle-espagne sous forme de note si tu préfères.`, */
  },

  {
    id: 'nouvelle-espagne',
    nom: 'Nouvelle-Espagne',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Fernando de Alencastre Noroña y Silva, duc de Linares',
        pnj_id: null,
        titre: 'Vice-roi et Capitaine général de la Nouvelle-Espagne',
      },
      1716: {
        nom: 'Baltasar de Zúñiga y Guzmán, duc d\'Arión et marquis de Valero',
        pnj_id: null,
        titre: 'Vice-roi et Capitaine général de la Nouvelle-Espagne',
      },
      1722: {
        nom: 'Juan de Acuña, marquis de Casafuerte',
        pnj_id: null,
        titre: 'Vice-roi et Capitaine général de la Nouvelle-Espagne',
      },
    },

    contexte: {
      1712: `La vice-royauté de Nouvelle-Espagne est le cœur du monde colonial espagnol : Mexico en est la capitale, et son vice-roi exerce une autorité nominale sur un territoire immense, du Guatemala aux territoires septentrionaux du Nouveau-Mexique et de la Californie. Les revenus fiscaux de la Nouvelle-Espagne — en grande partie issus des mines d'argent de Zacatecas, Guanajuato et San Luis Potosí — financent l'ensemble de l'empire espagnol dans les Amériques. Le duc de Linares (1711–1716) gouverne dans un contexte difficile : épidémies, famines et séismes frappent Mexico en 1713–1714. Il est réputé pour sa générosité personnelle envers les victimes, et pour avoir fondé la première bibliothèque publique de Nouvelle-Espagne.`,
      1716: `Le marquis de Valero (1716–1722) hérite d'une vice-royauté en mouvement : les réformes bourboniennes commencent à remodeler l'administration coloniale. Il lance l'expulsion de la colonie britannique de Laguna de Términos (Campeche), fortifie le Texas face à la pression française depuis la Louisiane, et supervise la fondation de San Antonio de Béxar (1718). Narrative note : c'est sous ce vice-roi que s'inscrit toute la grande période de la piraterie des Caraïbes — 1716 à 1722.`,
      1722: `Le marquis de Casafuerte (1722–1734), né à Lima, inaugure une ère de stabilité et de réformes administratives. Sous son mandat paraît la première *Gaceta de México* (1722), premier journal imprimé du continent nord-américain.`,
    },

    zone: [],

    capitale: 'Mexico (Ciudad de México)',
    population_approx: '~5 000 000 habitants (1713, toutes origines confondues)',
    economie: 'Argent (Zacatecas, Guanajuato), commerce avec Manille (Galion), agriculture, élevage',
    /* note: `Ce bloc couvre le cœur de la vice-royauté (Audience de Mexico). Les provinces sous l'Audience de Guadalajara (Nueva Galicia) et sous l'Audience de Guatemala ont leurs propres blocs. Pánuco, Tlaxcala/Veracruz, Oaxaca, Tabasco, Chiapas et Soconusco sont des alcaldías mayores ou corregimientos sans gouverneur propre à cette échelle. Le Yucatán a son propre gouverneur (capitainerie générale semi-autonome depuis 1617) — à traiter séparément.
Dates vice-rois confirmées : Linares 15 jan. 1711 – 15 août 1716 ; Valero 16 août 1716 – 14 oct. 1722 ; Casafuerte 15 oct. 1722 – 17 mars 1734. Sources : Wikipedia EN (List of viceroys of New Spain), INAH, article biographique Linares.`, */
  },

  {
    id: 'yucatan',
    nom: 'Yucatán',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Alonso de Meneses y Bravo de Saravia',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Juan José de Vértiz y Hontañón',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1720: {
        nom: 'Antonio Cortaire y Terreros',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Capitainerie générale semi-autonome depuis 1617, le Yucatán est administré depuis Mérida par un gouverneur-capitaine général relevant nominalement du vice-roi de Mexico, mais rapportant directement au Conseil des Indes. La péninsule est dominée par la civilisation maya, christianisée en surface mais restée profondément attachée à ses traditions. Le gouverneur Alonso de Meneses appartient à la même famille que le président de l'Audiencia de Santafé déposé par ses propres oidores en 1715 — ironie des réseaux coloniaux.

L'économie repose sur l'indigo, le bétail et une contrebande active avec les Anglais qui s'installent dans la baie du Belize voisine, dont l'exploitation du bois de Campêche (*logwood*) est une source de friction permanente entre Madrid et Londres. La côte caraïbe est pratiquement sans défense contre les incursions anglaises et les pirates.`,
      1715: `Vértiz y Hontañón administre le Yucatán dans une période de tensions : les Anglais de Belize étendent leurs installations et leur influence sur les Indiens de la frontière. En 1716, le vice-roi Valero envoie une expédition depuis Veracruz pour chasser les Britanniques de la Laguna de Términos (Campeche) — opération réussie militairement mais incapable de résoudre durablement la pression anglaise.`,
    },

    zone: [],

    capitale: 'Mérida',
    population_approx: '~250 000 habitants (1713, dont une grande majorité de Mayas)',
    economie: 'Indigo, bétail, sel, bois de Campêche (logwood), contrebande avec les Anglais',
    /* note: `Le Yucatán est une Capitainerie générale distincte de la Nouvelle-Espagne depuis 1617, avec son propre gouverneur-capitaine général. Séquence confirmée par Wikipedia EN (Governor of Yucatán) et List of governors in the Viceroyalty of New Spain. Note sur Alonso de Meneses : son mandat (1712-1715) s'achève juste au moment où son parent Francisco de Meneses est destitué au Nouveau-Grenade — coïncidence historique notable.`, */
  },

  {
    id: 'honduras',
    nom: 'Honduras',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Enrique Longman',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'José Rodezno',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1717: {
        nom: 'Diego Gutiérrez de Argüelles',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Province marginale de la Capitainerie générale de Guatemala, le Honduras est administré depuis Comayagua (ancienne Valladolid de Comayagua). Son économie repose sur l'élevage extensif et sur des mines d'argent en déclin depuis le XVIe siècle. La côte caraïbe est hors de contrôle effectif : les Indiens Misquitos, alliés aux Anglais, razzient les missions et les villages espagnols tout au long de la "Mosquitia", tandis que les coupeurs de bois britanniques s'installent impunément sur le littoral du futur Belize. Le gouverneur n'a ni les troupes ni les moyens de les en chasser.`,
    },

    zone: [],

    capitale: 'Comayagua',
    population_approx: '~50 000 habitants (1713, dont une majorité d\'Indiens)',
    economie: 'Élevage, mines d\'argent en déclin, indigo, contrebande avec les Anglais',
    /* note: 'Séquence confirmée par Wikipedia EN (List of governors of Spanish Honduras). Lacune entre Salinas Varona (1709) et Longman (1712) : gouverneur intermédiaire non identifié en ligne.', */
  },

  {
    id: 'nicaragua',
    nom: 'Nicaragua',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Gouverneur 1712–1720 non identifié avec certitude]',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1720: {
        nom: 'Sebastián de Arancibia',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Province pauvre et peu peuplée de la Capitainerie générale de Guatemala, le Nicaragua est administré depuis León, sur la côte pacifique. Comme le Honduras voisin, la province souffre de la pression permanente des Indiens Misquitos sur la côte caraïbe, soutenus par les Britanniques qui y entretiennent des comptoirs et des forts informels. Grenade, la ville rivale de León sur le lac Nicaragua, est une cible récurrente des raids pirates remontant depuis la côte atlantique via le río San Juan — Henry Morgan l'avait saccagée en 1665. La province vit de l'élevage, du cacao et d'un commerce interlope actif avec les Anglais de la Jamaïque.`,
    },

    zone: [],

    capitale: 'León (Santiago de los Caballeros de León)',
    population_approx: '~40 000 habitants (1713, dont une majorité d\'Indiens)',
    economie: 'Élevage, cacao, indigo, contrebande anglaise via la Mosquitia',
    /* note: 'LACUNE DOCUMENTAIRE : Le nom du gouverneur entre 1712 et 1720 n\'a pas été identifié avec certitude depuis les sources web accessibles. Arancibia (1720–1722) est confirmé par Wikipedia EN. À compléter depuis les archives de l\'AGI (Audiencia de Guatemala, legajos correspondants) ou depuis la liste complète sur Wikipedia ES.', */
  },

  {
    id: 'guatemala',
    nom: 'Guatemala (Royaume de Guatemala)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Toribio José de Cosío y Campa, marquis de Torre Campo',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1716: {
        nom: 'Francisco Rodríguez de Rivas',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Le Royaume de Guatemala est la plus grande entité administrative d'Amérique centrale espagnole : il englobe le Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica et le Chiapas. Sa capitale, Santiago de los Caballeros de Guatemala (actuelle Antigua), est l'une des villes les plus prospères et les mieux construites de l'empire colonial. Le Président-Gouverneur cumule les fonctions de chef de l'exécutif civil, de commandant militaire et de président de la Real Audiencia de Guatemala — exerçant une autorité quasi-vice-royale, directement responsable devant le Conseil des Indes à Madrid.

L'économie du royaume repose sur l'indigo (añil), exporté vers l'Espagne depuis les ports honduriens, et sur le cacao. La côte caraïbe est chroniquement menacée par les pirates, les boucaniers anglais, et surtout par les Indiens Misquitos alliés aux Anglais sur la Mosquitia (côte du Honduras et du Nicaragua). Cette pression constante justifie le titre de capitaine général accordé au président depuis 1609.`,
      1716: `Rodríguez de Rivas prend les rênes du royaume dans un contexte de tensions maritimes accrues. Les Anglais maintiennent des postes de coupe de bois (logwood) sur la côte du Belize, et la Mosquitia anglophone s'étend vers le sud. Le maintien de l'ordre sur les côtes caraïbes de l'Amérique centrale est le défi structurel de tout gouverneur du Guatemala à cette époque.`,
    },

    zone: [],

    capitale: 'Santiago de los Caballeros de Guatemala (Antigua Guatemala)',
    population_approx: '~800 000 habitants (1713, dont une grande majorité d\'Indiens)',
    economie: 'Indigo (añil), cacao, cochenille, bétail, missions dominicaines et franciscaines',
    /* note: 'Le Chiapas (*Chiapa* sur la carte Jaillot) relève de l\'Audience de Guatemala et non de Mexico — contrairement à l\'intuition géographique. Soconusco (*Soco Nusco*) relève de l\'Audience de Mexico (exception). Honduras et Nicaragua ont chacun des gouverneurs distincts, subordonnés au Président de Guatemala. Séquence confirmée : Wikipedia ES (Anexo:Gobernantes de la Capitanía General de Guatemala).', */
  },

  {
    id: 'costa-rica',
    nom: 'Costa Rica',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Lorenzo Antonio de Granda y Balbín',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `La province la plus pauvre et la plus isolée de la Capitainerie générale de Guatemala. Cartago, la capitale, ne compte en 1723 que soixante-dix maisons en adobe, deux églises et deux chapelles — indicateur de la misère de la colonie. Le gouverneur lui-même doit cultiver son jardin pour subsister. Faute d'or, d'argent ou de main-d'œuvre indigène disponible, Costa Rica n'a jamais attiré les colons ni les capitaux. Sa population est une mosaïque de petits propriétaires métis, de quelques esclaves africains employés dans les plantations de cacao de la côte atlantique (Matina), et des populations indigènes de l'intérieur.

Granda y Balbín vient de réprimer la grande révolte de Pablo Presbere (1709) — soulèvement des Indiens de Talamanca qui avait détruit quatorze missions franciscaines et tué plusieurs frères. La répression a été sanglante : 700 Indiens capturés, 200 morts en chemin, Presbere exécuté par garrote le 1er juillet 1710. La frontière de Talamanca reste une zone sans contrôle effectif espagnol.`,
    },

    zone: [],

    capitale: 'Cartago',
    population_approx: '~20 000 habitants (1713, très approximatif)',
    economie: 'Cacao (côte atlantique), élevage, agriculture de subsistance, monnaie de cacao faute d\'espèces',
    /* note: `Gouverneur confirmé en 1710 (Wikipedia EN, article Pablo Presbere). Son mandat précis au-delà de 1710 n\'est pas documenté depuis les sources web. La révolte de Presbere (1709-1710) est un fait historique établi, bien documenté. La province dépend de l\'Audiencia de Guatemala. Séquence des gouverneurs de Costa Rica difficile à établir pour cette période depuis les sources accessibles — les AGI (Audiencia de Guatemala) seraient la source primaire.`, */
  },

  {
    id: 'panama',
    nom: 'Panama (Tierra Firme)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'José Hurtado de Amézaga',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1718: {
        nom: 'Juan José Llamas y Rivas',
        pnj_id: null,
        titre: 'Gouverneur par intérim (évêque de Panama)',
      },
      1719: {
        nom: 'Jerónimo Vadillo',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `L'isthme de Panama est le nœud stratégique de tout l'empire espagnol dans le Pacifique. L'argent péruvien, acheminé par mer depuis Callao jusqu'à Panama City sur la côte pacifique, traverse l'isthme par le Camino Real jusqu'à Portobelo sur la côte atlantique, d'où il embarque à bord des galions pour Carthagène, La Havane et Séville. Les grandes foires de Portobelo — tenues irrégulièrement selon l'arrivée des galions — drainent des marchands de tout l'empire et constituent l'un des plus grands événements commerciaux du monde atlantique.

Panama dépend du vice-roi de Lima, non de Mexico. Le Président-Gouverneur de Panama cumule la présidence de la Real Audiencia, l'autorité civile sur Tierra Firme, et le commandement militaire de l'isthme — une position cruciale pour la défense de la route de l'argent contre les pirates. Henry Morgan avait saccagé Panama City en 1671 ; la ville reconstruite est depuis lors mieux fortifiée, mais reste vulnérable.`,
      1718: `Une vacance brève (l'évêque Llamas y Rivas assure l'intérim en 1718) précède l'arrivée de Jerónimo Vadillo. Cette période coïncide avec la guerre de la Quadruple-Alliance (1718–1720) qui fait de Portobelo une cible potentielle pour les forces britanniques — la ville sera effectivement attaquée et prise brièvement par l'amiral Vernon en 1739, mais pendant notre période elle reste espagnole.`,
    },

    zone: [],

    capitale: 'Panama City (Ciudad de Panamá)',
    population_approx: '~15 000 habitants (1713, ville et isthme)',
    economie: 'Transit de l\'argent péruvien (Camino Real), foires de Portobelo, commerce transatlantique',
    /* note: `Panama relève du vice-roi du Pérou (Lima), pas de Mexico — distinction essentielle. Veragua est une province nominale sans gouverneur distinct, absorbée dans la juridiction de Panama. Le Darién (à l'est) est en pratique contrôlé par les Indiens Kunas ; la présence espagnole y est quasiment nulle. Portobelo est une alcaldía mayor distincte de Panama City, mais sous le même gouverneur en pratique. Séquence confirmée : Wikipedia EN (Royal Governor of Panama). La dernière grande foire de Portobelo a lieu en 1737 — elle reste active sur toute notre période.`, */
  },

  {
    id: 'darien',
    nom: 'Darién',

    puissance: {
      1712: 'conteste',
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité effective — territoire kunas]',
        pnj_id: null,
        titre: 'Zone sans gouverneur colonial résidant',
      },
    },

    contexte: {
      1712: `Le Darién est l'un des territoires les plus dangereux et les moins contrôlés de l'empire espagnol. Coincé entre la province de Panama à l'ouest et la Nouvelle-Grenade à l'est, l'isthme oriental est en pratique dominé par les Indiens **Kunas** (Cuna), qui ont repoussé toutes les tentatives de colonisation espagnole depuis le XVIe siècle et maintiennent une résistance armée permanente contre les présides coloniaux.

La carte Jaillot de 1708 mentionne encore "Nouvelle Calédonie" et le port de "New Edinburgh" — traces de la catastrophique **expédition du Darién** (1698–1700), par laquelle la Compagnie écossaise tenta d'établir une colonie commerciale entre les deux océans. Les deux tentatives successives (1698 et 1699) se soldèrent par des milliers de morts de maladie et d'épuisement, et par une attaque espagnole finale en 1700. En 1712, il ne reste absolument rien de la colonie écossaise — les noms sur la carte sont anachroniques, figés au moment de la gravure.

L'échec de l'expédition du Darién ruina la Compagnie d'Écosse et contribua directement à l'**Acte d'Union de 1707**, qui fusionna l'Écosse et l'Angleterre en Grande-Bretagne. Pour les personnages de jeu, les ruines de New Edinburgh existent peut-être encore dans la jungle, et le souvenir est récent.`,
    },

    zone: [],

    capitale: 'Aucune (les Espagnols maintiennent un presidio à Santa María la Antigua, peu opérationnel)',
    population_approx: 'Quelques milliers d\'Indiens Kunas ; présence espagnole quasi nulle',
    economie: 'Néant pour les Espagnols ; les Kunas commercent discrètement avec les pirates anglais des Caraïbes',
    /* note: `FAIT ÉTABLI : La colonie écossaise de Caledonia / New Edinburgh a été abandonnée en avril 1700. Les mentions sur la carte Jaillot (1708) sont anachroniques — la carte a été gravée avant que l'information soit pleinement intégrée, ou par convention cartographique. En 1712, le Darién est un no man's land entre Panama et la Nouvelle-Grenade, contrôlé de facto par les Kunas. Les Kunas entretenaient des relations ambiguës avec les pirates anglais et les boucaniers, ce qui en fait un espace narrativement fertile pour la campagne. Le Darién ne relève d'aucune Audiencia de manière effective — nominalement partagé entre Panama et Santafé.`, */
  },

  {
    id: 'nouvelle-grenade',
    nom: 'Nouvelle-Grenade & Castilla del Oro',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Francisco de Meneses y Bravo de Saravia',
        pnj_id: null,
        titre: 'Président-Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Audiencia de Santafé (gouvernement collectif)',
        pnj_id: null,
        titre: 'Gouvernement intérimaire des oidores',
      },
      1717: {
        nom: 'Francisco del Rincón, archevêque de Santafé',
        pnj_id: null,
        titre: 'Président par intérim',
      },
      1718: {
        nom: 'Antonio Ignacio de la Pedrosa y Guerrero',
        pnj_id: null,
        titre: 'Premier représentant vice-royal provisoire',
      },
      1719: {
        nom: 'Jorge de Villalonga',
        pnj_id: null,
        titre: 'Vice-roi (premier vice-roi officiel)',
      },
    },

    contexte: {
      1712: `Le Nouveau Royaume de Grenade est administré par le Président-Gouverneur de la Real Audiencia de Santafé (Bogotá), relevant nominalement du vice-roi de Lima mais autonome en pratique. Le territoire, désigné "Nouvelle Grenade et Castilla del Oro" sur la carte, couvre un espace immense : les plaines de la côte caraïbe (provinces de Carthagène et Santa Marta), la cordillère andine jusqu'à Quito, et les Llanos orientaux jusqu'à l'Orénoque. Ses richesses sont l'or d'Antioquia et du Choco, le platine (alors peu connu), et les émeraudes de Muzo.

En 1715, éclate un événement sans précédent dans l'histoire coloniale espagnole : les *oidores* (juges) de l'Audiencia renversent et font arrêter leur propre président, Francisco de Meneses, qu'ils jugent corrompu et tyrannique. Ils l'envoient prisonnier au château de Bocachica à Carthagène. Ce "coup d'État judiciaire" déclenche une crise institutionnelle qui parvient jusqu'à Madrid — et convainc la Couronne que la Nouvelle-Grenade nécessite une autorité plus forte.`,
      1717: `La réponse de Madrid est radicale : par la Real Cédula du 27 mars 1717, Philippe V crée le **Vice-royauté de Nouvelle-Grenade** — la troisième d'Amérique — avec Santafé pour capitale. C'est la première des grandes Réformes Bourboniennes en Amérique. Un premier représentant provisoire, Pedrosa y Guerrero, arrive à Santafé en juillet 1718 et proclame le virreinato. Le premier vice-roi officiel, Jorge de Villalonga, n'arrive qu'en novembre 1719. La vice-royauté est supprimée dès 1723 — jugée trop coûteuse — et ne sera rétablie définitivement qu'en 1739.`,
    },

    zone: [],

    capitale: 'Santafé de Bogotá',
    population_approx: '~400 000 habitants (1713, Nouveau Royaume de Grenade et côtes)',
    economie: 'Or (Antioquia, Choco), émeraudes (Muzo), platine, indigo, cacao, commerce avec Carthagène',
    /* note: `"Castilla del Oro" sur la carte est une désignation cartographique ancienne pour la côte caraïbe — elle englobe les provinces de Carthagène et Santa Marta, qui ont chacune un gouverneur militaire distinct mais subordonné au Président de Santafé. La Vice-royauté de 1717 est la première réforme bourbonienne des Indes — fait historique établi (Real Cédula 27 mars 1717). L'épisode du renversement de Meneses par les oidores en 1715 est la cause directe de cette réforme — événement documenté (Wikipedia ES, BiblioFEP, Universidad de Bergen). La vice-royauté est déjà couverte dans gouverneurs_caraibes.html pour les noms de Pedrosa et Villalonga — données concordantes.`, */
  },

  {
    id: 'venezuela',
    nom: 'Venezuela (Province de Caracas)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'José Francisco de Cañas y Merino',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Alberto Bertodano y Navarra',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général (intérimaire)',
      },
      1716: {
        nom: 'Marcos Francisco de Betancourt y Castro',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1721: {
        nom: 'Diego de Portales y Meneses',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Province espagnole de Terre Ferme, la Venezuela (ou province de Caracas) s'étend du cap de la Vela à l'ouest jusqu'à Maracapana à l'est, bordée au sud par les Llanos et l'Orénoque. Sa capitale, Santiago de León de Caracas, est une ville modeste mais active, entourée de plantations de cacao et d'indigo. La province dépend de la Real Audiencia de Santo Domingo pour les affaires judiciaires et politiques, et nominalement du vice-roi de Nouvelle-Grenade (créé en 1717) pour les affaires militaires.

Le gouverneur Cañas y Merino (1711–1714) est une figure de l'arbitraire colonial : il réprime violemment la contrebande pour en exercer lui-même le monopole, humilie les membres du cabildo, ordonne l'abattage de tous les arbres de Caracas en 1713–1714 (épisode documenté, prétextant des raisons sanitaires), et finit par être destitué sous la pression des notables locaux.`,
      1716: `Betancourt y Castro (1716–1720) succède à l'intérimaire Bertodano dans un contexte de tensions persistantes entre les élites créoles et l'administration coloniale. Le commerce du cacao de Caracas, illégalement canalisé vers les Hollandais de Curaçao et les Anglais des Antilles, est la source principale de conflits avec Madrid. La contrebande est ici quasi-institutionnelle — les corsaires opérant dans les Caraïbes orientales s'approvisionnent régulièrement sur les côtes vénézuéliennes.`,
    },

    zone: [],

    capitale: 'Santiago de León de Caracas',
    population_approx: '~60 000 habitants (1713, province entière)',
    economie: 'Cacao (exportation illicite vers Curaçao et les Antilles anglaises), indigo, bétail',
    /* note: `La province de Venezuela dépend de l'Audiencia de Santo Domingo (judiciaire) et nominalement du vice-roi de Nouvelle-Grenade à partir de 1717 (militaire) — mais en pratique les gouverneurs rapportent directement à Madrid via le Conseil des Indes. À ne pas confondre avec la Capitainerie générale du Venezuela, créée en 1777 seulement. Bertodano : même personnage que le gouverneur de Cumaná (1706–1711) puis gouverneur de Porto Rico (1716–1720) — trajectoire confirmée par la Real Academia de la Historia (DBE). Sources : Venciclopedia, BiblioFEP (Fundación Empresas Polar), Censo-Guía AGI.`, */
  },

  {
    id: 'nouvelle-andalousie',
    nom: 'Nouvelle-Andalousie (Cumaná)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Mateo Ruiz de Murga',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1715: {
        nom: 'Président du Cabildo (intérim)',
        pnj_id: null,
        titre: 'Gouverneur par intérim',
      },
      1717: {
        nom: 'José Francisco Carreño',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1721: {
        nom: 'Juan de la Tornera Soto',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Province espagnole de Terre Ferme, la Nueva Andalucía couvre l'est du Venezuela actuel, avec Cumaná pour capitale — une des plus vieilles villes permanentes d'Amérique. La province relève de l'Audiencia de Santo Domingo. Son économie repose sur la pêche aux perles (en déclin), le cacao, et une contrebande active avec les Hollandais du Surinam, les Français de Trinidad et les Anglais des Petites Antilles. Les missions capucines aragonaises quadrillent l'intérieur des terres ; les Indiens Caribes résistent sur les marges.`,
      1715: `Après la mort de Ruiz de Murga, la province connaît une vacance de pouvoir comblée par le cabildo local. Cette période d'administration incertaine coïncide avec la guerre de la Quadruple Alliance (1718–1720), qui fait de la région un enjeu militaire indirect.`,
      1717: `Carreño prend le gouvernorat dans un contexte de tensions croissantes avec les missions capucines et les populations indiennes. En 1718, son successeur désigné Tornera Soto fonde de facto la ville de Maturín — acte que ni le roi ni le cabildo ne reconnaissent légalement à l'époque.`,
    },

    zone: [],

    capitale: 'Cumaná',
    population_approx: '~8 000 habitants (1713, dont une majorité d\'Indiens)',
    economie: 'Cacao, pêche, contrebande hollandaise et française, missions capucines',
    /* note: 'Trinidad dépend nominalement de Nueva Andalucía jusqu\'en 1731, date à laquelle elle devient province distincte. Séquence des gouverneurs : source principale = blog du Cronista de Cumaná (Badaracco Rivero, 2012, archives locales). Fiabilité modérée pour les dates précises.', */
  },

  {
    id: 'trinidad',
    nom: 'Trinidad',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: 'Cristóbal Félix de Guzmán',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1716: {
        nom: 'Pedro de Yarza',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
      1721: {
        nom: 'Juan de Orvay',
        pnj_id: null,
        titre: 'Gouverneur intérimaire',
      },
      1722: {
        nom: 'Martín Pérez de Anda y Salazar',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
      },
    },

    contexte: {
      1712: `Poste marginal de l'empire espagnol, Trinidad est administrée depuis San José de Oruña (aujourd'hui Saint Joseph), bien que les gouverneurs résident souvent à Puerto España, mieux placée sur la côte ouest. L'île reste peu peuplée, mal défendue, et sert de porte d'entrée vers la Terre Ferme et l'Orénoque. Les missions capucines tentent d'évangéliser les populations indigènes. Le commerce légal est étranglé par le monopole espagnol ; la contrebande avec les Hollandais du Surinam et les Français de la Martinique est la règle.`,
      1716: `Sous Yarza, Trinidad végète. La faiblesse de la garnison et l'isolement de l'île en font une cible facile pour les pirates opérant entre les Petites Antilles et le Venezuela. Les Anglais et les Hollandais commercent de fait librement avec l'île malgré les interdictions.`,
    },

    zone: [],

    capitale: 'San José de Oruña (Saint Joseph)',
    population_approx: '~1 500 habitants (1713, dont une majorité d\'Indiens et d\'esclaves)',
    economie: 'Cacao, contrebande, missions capucines',
    /* note: 'Fiabilité modérée : dates cohérentes entre Wikipedia EN/DE et NALIS (Trinité), mais peu de sources primaires indépendantes pour la période. Trinidad relève nominalement de la Capitainerie générale du Venezuela (Cumaná/Nueva Andalucía), elle-même sous l\'Audiencia de Santo Domingo. Séparée de Nueva Andalucía comme province distincte en 1731.', */
  },

  {
    id: 'guyane',
    nom: 'Guyane',

    puissance: {
      1712: 'conteste',
    },

    gouverneur: {
      1712: {
        nom: '[Juridictions multiples — voir contexte]',
        pnj_id: null,
        titre: 'Autorités fragmentées par puissance',
      },
    },

    contexte: {
      1712: `La Guyane telle que la représente la carte Jaillot de 1708 n'est pas une juridiction unifiée, mais un espace fragmenté entre trois puissances coloniales qui se disputent, s'ignorent ou se tolèrent selon les zones.

La Guyane française, centrée sur Cayenne, est administrée par un gouverneur nommé depuis Paris — poste peu enviable dans une colonie réputée malsaine et peu rentable. La colonie survit grâce aux missions jésuites dans l'intérieur et à un maigre commerce de bois et de denrées tropicales.

Le Surinam, colonie des Provinces-Unies depuis 1667, est la portion la plus prospère : ses plantations de sucre, de cacao et de café, exploitées par une main-d'œuvre servile massive, font du Surinam l'une des colonies les plus productives des Caraïbes. Paramaribo en est la capitale et le principal port. La colonie est gérée par la Société du Surinam depuis 1683.

Les franges espagnoles, nominalement rattachées à la Nouvelle-Andalousie (Cumaná), restent quasi-inexistantes dans les faits : quelques missions capucines et des prétentions territoriales sans présence effective. Les Indiens Caribes, Arawaks et diverses nations de l'intérieur maintiennent une indépendance de facto sur l'immense arrière-pays guyanais, que nulle puissance européenne ne contrôle réellement.`,
    },

    zone: [],

    capitale: 'Cayenne (française) / Paramaribo (hollandaise)',
    population_approx: '~3 000 Européens (Cayenne) / ~50 000 habitants (Surinam, dont ~40 000 esclaves)',
    economie: 'Sucre, cacao, café (Surinam) ; bois, missions (Guyane française) ; prétentions espagnoles sans exploitation effective',
    /* note: 'Juridiction composite intentionnelle. Puissance "contestée" reflète l\'état réel du territoire. Gouverneurs précis de Cayenne et de Surinam disponibles sur demande si nécessaire pour la campagne.', */
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
    id: 'pin-ile-des-ombres',
    chronique_id: 'ile-des-ombres',
    label: "L'Île des Ombres",
    coords: [3877, 1803],  // quelque part dans un rayon ~50px
    date: 'Avril 1713',
    extrait: "Une île sans nom, des soldats espagnols et des Indiens Bravos tapis dans la forêt.",
  },
  {
    id: 'pin-sed',
    chronique_id: 'sed',
    label: "Satiété engendre Démesure",
    coords: [5493, 2540],  // Cap-Français
    date: 'Janvier 1714',
    extrait: "Un banquet à Cap-Français, une délégation espagnole empoisonnée.",
  },
  {
    id: 'pin-marianne',
    chronique_id: 'marianne',
    label: "La prise de la Marianne",
    coords: [3510, 2095],  // Baya Honda
    date: 'Décembre 1715',
    extrait: "La frégate française Marianne, trente-deux canons, prise par audace.",
  },
  {
    // Pin groupé — plusieurs événements survenus au même endroit
    id: 'pin-vero-beach',
    label: "Site des épaves de la Flotte au Trésor",
    coords: [3969, 1296],  // Vero Beach — côte est Floride
    groupe: [
      {
        chronique_id: 'hippogriffe',
        label: "Le dernier voyage de l'Hippogriffe",
        date: 'Septembre–Décembre 1715',
        extrait: "Un naufrage providentiel, un cadavre aux plats d'or précolombiens.",
      },
      {
        chronique_id: 'epaves',
        label: "Les épaves de la Flotte au Trésor",
        date: 'Janvier 1716',
        extrait: "Huit millions de pièces de huit gisaient entre ciel et fond.",
      },
    ],
  },
  {
    id: 'pin-courses-trinidad',
    chronique_id: 'courses-trinidad',
    label: "Courses à Trinidad",
    coords: [7438, 4019],  // Trinidad
    date: 'Février 1716',
    extrait: "La lettre de Ruggiero bouleversait les projets immédiats.",
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
