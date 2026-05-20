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
    label: 'Couronne britannique',
    couleur: '#b63a21',          // or — dans la palette du site
    blason: 'pnj/pavillons/gb.svg',
  },
  espagnole: {
    label: 'Couronne d\'Espagne',
    couleur: '#c8973a',          // rust
    blason: 'pnj/pavillons/es.svg',
  },
  francaise: {
    label: 'Royaume de France',
    couleur: '#205772',          // sea
    blason: 'pnj/pavillons/fr_banniere.svg',
  },
  hollandaise: {
    label: 'Provinces-Unies',
    couleur: '#b36221',          // sea-light
    blason: 'pnj/pavillons/nl.svg',
  },
  "anarchie-pirate": {
    label: 'Anarchie Pirate',
    couleur: '#5c5950',          // ink
    blason: 'pnj/pavillons/generic_red.svg',
  },
  pirate: {
    label: 'République Pirate',
    couleur: '#000000',          // ink
    blason: 'pnj/pavillons/nassau.svg',
  },
  conteste: {
    label: 'Territoire contesté',
    couleur: '#330a46',          // mist
    blason: 'pnj/pavillons/conteste.svg'
  },
  danoise: {
    label: 'Danemark-Norvège',
    couleur: '#0b6d18',
    blason: 'pnj/pavillons/dk.svg',
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
    id: 'new-providence',
    nom: 'Nassau',

    puissance: {
      1712: 'anarchie-pirate',
      1714: 'pirate',
      1718: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Thomas Walker',
        pnj_id: null,  // → ouvre la fiche dans pnj.html
        titre: 'Gouverneur par intérim',
      },
      1714: {
        nom: 'Conseil de Nassau',
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
    zone: [],

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
      1712: `Île longue et étroite à 80 km à l'est de Nassau, Eleuthera est fondée en 1648 par des Puritains expulsés des Bermudes — des dissidents protestants républicains qui ont baptisé leur colonie du grec <em>eleútheros</em>, "libre", et rédigé l'un des premiers textes constitutionnels démocratiques des Amériques. Cette origine façonne durablement la culture politique de l'île : hostilité à la monarchie absolutiste et au catholicisme, méfiance envers toute autorité extérieure, solidarité communautaire puissante.

Pendant les années de raids espagnols et français sur Nassau (plus de trente incidents entre 1703 et 1715), Eleuthera et Harbour Island accueillent les réfugiés de New Providence. Thomas Walker, vice-gouverneur résiduel des Bahamas, finit par s'y installer lui-même. Il y fait construire vers 1710 une petite batterie côtière de quatre canons et quelques pierriers commandant l'entrée du port de Harbour Island — l'unique défense organisée de l'archipel pendant cette période.`,

      1714: `À partir de 1714, Eleuthera entre dans la sphère d'influence directe de Nassau et d'Hornigold. L'île joue trois rôles complémentaires et irremplaçables pour la République pirate.

<strong>Le grenier de Nassau.</strong> L'île produit ce que Nassau ne peut pas : vivres frais, eau douce, bois de chauffe, porcs, tortues. Cette dépendance physique donne à ceux qui contrôlent les réseaux locaux un levier politique réel sur Nassau.

<strong>L'interface commerciale.</strong> Harbour Island est le sas entre le monde pirate et le monde légal. Les marchands de Boston, des Carolines et de Virginie qui ne peuvent ou ne veulent pas mouiller à Nassau y trouvent un interlocuteur commode. Le rapport Musson de 1717 mentionne deux navires de 90 tonneaux venus de Boston "vendre des provisions aux pirates" — à Harbour Island, pas à Nassau. Deux réseaux s'y complètent : le clan Darvill/Stillwell assure le ravitaillement de base et le triangle Eleuthera–Nassau–Jamaïque (bois de brésillet contre rhum) ; Richard Thompson et John Cockram (associés d'Hornigold) importent des marchandises manufacturées depuis Curaçao et les colonies continentales.

<strong>L'atelier et le refuge.</strong> Les capacités de carénage et de réparation navale d'Eleuthera suppléent les insuffisances du port envasé de Nassau. En cas de danger, les petits navires peuvent se disperser dans les anses peu profondes, hors de portée des vaisseaux à fort tirant d'eau.`,

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

    zone: [],

    capitale: 'Spanish Town',
    population_approx: '~55 000 habitants (1713, dont ~45 000 esclaves)',
    economie: 'Sucre, rhum, indigo, commerce interlope',
    /* note: null, */
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

    zone: [],

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

    zone: [],

    capitale: 'Santo Domingo',
    population_approx: '~10 000 habitants (1713, colons espagnols et créoles)',
    economie: 'Élevage extensif, contrebande avec Saint-Domingue, quelques cultures vivrières',
    /* note: `Le gouverneur de 1712 (avant Pedro de Niela) n'a pas été identifié avec certitude. Sources : concordance Geni (Gobiernos Coloniales de la Isla Española) et Rincón del Vago, toutes deux issues d'archives dominicaines. Fiabilité modérée.`, */
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
        titre: 'Gouverneur et Capitaine général (1er mandat)',
      },
      1713: {
        nom: 'Juan de Ribera',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
        // Arrivée à San Juan le 23 décembre 1713 — date confirmée (Wikipedia EN, EnciclopediaPR)
      },
      1716: {
        nom: 'Alfonso Bortodano',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général',
        // Prise de fonctions le 30 août 1716 — date confirmée (EnciclopediaPR)
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
        // Prise de fonctions le 22 août 1724 — date confirmée (EnciclopediaPR)
      },
    },

    contexte: {
      1712: `Porto Rico est en 1712 un presidio périphérique de l'empire espagnol, dont la valeur est stratégique plutôt qu'économique. San Juan, capitale fortifiée sur un îlot rocheux relié à l'île principale par un isthme étroit, est l'une des places fortes les mieux défendues des Antilles — le Castillo San Felipe del Morro domine l'entrée du port depuis le XVIe siècle, et le Castillo San Cristóbal en protège l'accès terrestre. L'île produit peu pour l'exportation (gingembre, cuir, un peu de tabac) et dépend largement du situado, la subvention annuelle versée par la vice-royauté de Nouvelle-Espagne pour financer la garnison et l'administration.

La figure dominante de Porto Rico en 1712 n'est pas le gouverneur mais un homme de couleur, fils d'une femme autrefois réduite en esclavage, devenu cordonnier puis corsaire : <strong>Miguel Enríquez</strong> (1674–1743). Depuis 1702, sa flotte de course — jusqu'à trente embarcations simultanées (balandres, brigantins, pirogues) — protège les côtes porto-ricaines des incursions anglaises et hollandaises, capturant des prises au nom de la Couronne espagnole. En 1707, Philippe V l'a nommé <em>Capitán de Mar y Guerra</em> ; en 1713, il lui décerne la <em>Medalla de oro de la Real Efigie</em> et le titre de <em>Capitán de Mar y Guerra y Armador de Corsos</em> — la plus haute distinction honorifique accordable à un non-noble. À cette date, Enríquez est l'homme le plus riche des Caraïbes espagnoles. Sa fortune, ses connexions commerciales avec Curaçao, Saint-Thomas et les marchands de Nouvelle-Angleterre, et son armée privée de corsaires en font un État dans l'État — une réalité que chaque gouverneur nommé à San Juan devra affronter à sa façon.

Le gouverneur Danío Granados (1er mandat, 1712–1713) tente d'affaiblir Enríquez et de détourner à son profit les opérations de course. Il attaque le corsaire sur le terrain juridique, tente de saisir ses navires, et représente une administration aussi corrompue que combative.
<br>
<strong>Île adjacente — Boreque (Vieques) :</strong> À 8 km au sud-est de la pointe orientale de Porto Rico, l'île de Vieques — <em>Isla Negra</em> chez les Espagnols, <em>Crab Island</em> sur les cartes anglaises, ici <em>Boreque</em> — est sans administration permanente ni garnison. Revendiquée par l'Espagne, elle reste en pratique un territoire vide : mouillage discret pour les navires ne souhaitant pas entrer dans le port de San Juan, point d'eau et de ravitaillement pour les équipages en transit entre Saint-Domingue et les Petites Antilles. Les tentatives de colonisation espagnoles au XVIIe siècle ont toutes échoué. Les Danois de Saint-Croix et les Anglais de la région la fréquentent sans s'y établir.`,

      1713: `<strong>Juan de Ribera</strong> arrive à San Juan le 23 décembre 1713, remplaçant Danío Granados. La transition marque une nouvelle phase dans la guerre d'usure entre le gouvernorat et Miguel Enríquez. Avant son départ pour Porto Rico, Ribera avait entretenu une correspondance amicale avec le corsaire ; Enríquez, qui s'y était laissé prendre, avait dépensé plus de 20 000 pièces de huit en cadeaux et prévenances, et prêté à Ribera son meilleur navire, <em>La Gloria</em>, pour assurer le voyage. Le gouverneur arriva avec ce navire chargé à ras bord de marchandises — signe avant-coureur que son intention réelle était de concurrencer Enríquez plutôt que de le ménager.

Ribera cherche à établir son propre réseau de course pour capter les profits des prises. Il réquisitionne les équipages et navires d'Enríquez sans compensation, sapant l'économie de course que le corsaire a mis dix ans à construire. La tension entre les deux hommes structure toute la politique locale jusqu'en 1716.

<strong>La place de Porto Rico :</strong> San Juan est alors le port espagnol le plus actif des Antilles orientales — la route des navires reliant Saint-Domingue, la Martinique et les îles anglaises du Vent passe nécessairement au large de ses côtes. La contrebande est endémique : les marchands anglais et hollandais, qui ne peuvent entrer légalement à San Juan, font escale à Vieques (<em>Boreque</em>) ou dans les anses de la côte nord pour écouler leurs marchandises. Enríquez lui-même opère dans cette zone grise, faisant capturer fictivement des navires amis pour importer leurs cargaisons sous couvert de prises légitimes`,

      1716: `<strong>Alfonso Bortodano</strong> prend ses fonctions le 30 août 1716. Son administration est décrite par les sources de l'époque comme globalement neutre — ni franchement favorable à Enríquez, ni radicalement hostile. Les deux camps lui reprochent tour à tour sa partialité, ce qui dans la logique porto-ricaine de l'époque est presque un certificat d'impartialité.

La période 1716–1720 est néanmoins agitée pour l'île. La guerre de la Quadruple-Alliance (1718–1720) — France, Grande-Bretagne, Provinces-Unies et Autriche contre l'Espagne — ravive les tensions maritimes dans les Caraïbes et resserre les contraintes commerciales imposées à Enríquez : ses droits sur le commerce négrier de l'<em>Asiento</em> sont annulés, et il doit rendre les biens appartenant à l'asiento anglais. Bortodano, pris entre les impératifs de la politique impériale et les réalités locales, navigue prudemment.

<strong>San Juan en 1716–1720 :</strong> La ville fortifiée compte environ 6 000 à 7 000 habitants — garnison, administrateurs, marchands créoles, libres de couleur et esclaves. Le Castillo del Morro et les murailles qui ceignent la vieille ville font de San Juan l'une des places les plus difficiles à prendre des Caraïbes. En dehors des murs, l'île est peu peuplée, couverte de forêts et d'élevages extensifs. La côte est bordée de récifs qui en rendent l'abordage difficile — avantage défensif, inconvénient pour tout navire étranger tentant d'approcher discrètement.

<strong>Boreque (Vieques) :</strong> Toujours sans administration permanente. Son statut de vide effectif persiste sous Bortodano comme sous ses prédécesseurs.`,

      1720: `<strong>Francisco Danío Granados</strong> revient au gouvernorat en 1720 pour un second mandat, accueilli par le trésorier Pozo — ennemi déclaré d'Enríquez — qui lui présente d'emblée le corsaire comme adversaire à abattre. Les premiers mois sont violents : Granados confisque la flotte d'Enríquez (17 navires) sous prétexte de contrebande. Mais la dynamique s'inverse rapidement. Granados dirige un <em>juicio de residencia</em> contre Pozo, fait saisir sa fortune, l'emprisonne, et Pozo disparaît définitivement du Nouveau Monde. Le gouverneur, qui a retourné sa veste, semble désormais agir de concert avec Enríquez — jusqu'à ce que celui-ci, croyant détenir une reconnaissance de dette contre le gouverneur, lui envoie une lettre provocatrice. Granados le fait arrêter le 9 décembre 1722.

<strong>Le dossier Enríquez (1720–1724) :</strong> Le Conseil des Indes ouvre une enquête secrète sur le corsaire en 1720, alimentée par ses ennemis. La procédure est longue. Son agent Antonio Camino part plaider sa cause à Madrid, réunit des témoignages favorables à La Havane et en Espagne. Enríquez reste incarcéré. Son procès illustre les contradictions d'un empire qui, pour se défendre, a dû créer un homme plus puissant que ses propres gouverneurs, et ne sait plus comment le contrôler.

<strong>San Juan :</strong> Mêmes fortifications, même économie de contrebande et de course. Entre 1718 et 1720, plusieurs ouragans dévastent l'agriculture de l'île. Enríquez, alors encore libre, finance personnellement les secours : 400 jarres de mélasse, un chargement de maïs, et la prise en charge des funérailles des indigents. Sa popularité dans les quartiers populaires de San Juan est intacte, et tranche avec sa disgrâce auprès de l'élite créole blanche.`,
    },

    zone: [],

    capitale: 'San Juan',
    population_approx: '~6 000 habitants (San Juan, 1713) ; ~45 000 à 50 000 habitants sur l\'ensemble de l\'île (estimation)',
    economie: 'Situado royal (subvention de Mexico), course et piraterie (réseau Enríquez), contrebande (navires anglais et hollandais via Vieques et côtes nord), gingembre, cuir, tabac, élevage',
    /* note: `✅ Confirmé : succession des gouverneurs (EnciclopediaPR / Fundación para las Humanidades de Puerto Rico ; Academic Kids list ; Geni project).
  ✅ Confirmé : arrivée de Juan de Ribera le 23 décembre 1713 (Wikipedia EN, Miguel Enríquez article).
  ✅ Confirmé : prise de fonctions de Bortodano le 30 août 1716 (EnciclopediaPR).
  ✅ Confirmé : Miguel Enríquez — Medalla de oro de la Real Efigie (1713), flotte de 30 navires (1702–1713), arrestation le 9 décembre 1722, fortune, réseau commercial (Wikipedia EN, sources primaires citées).
  ✅ Confirmé : Danío Granados condamné sur 46 chefs d'accusation par Mendizábal (EnciclopediaPR).
  ⚠️ Incertain : orthographe "Bortodano" vs "Bertodano" — les sources espagnoles (EnciclopediaPR) utilisent les deux. La liste Academic Kids donne "Bortodano" comme gouverneur 1716–1720, et "Alberto Bertodano" comme celui qui conduit le juicio de residencia de Danío Granados : il s'agit peut-être de deux personnes distinctes, ou d'une même orthographe instable. À trancher sur source primaire (AGI).
  🎲 Note de campagne : Miguel Enríquez est le personnage central de Porto Rico pour toute la période 1712–1724. Mulâtre, fils d'esclave, corsaire anobli, homme le plus riche des Caraïbes — il est narrativement inépuisable. Sa flotte patrouille activement la zone entre Porto Rico, Saint-Domingue et les Petites Antilles. Tout navire croisant dans ces eaux peut le rencontrer — comme allié, comme obstacle, ou comme acheteur.
  🎲 Vieques (Boreque sur la carte Jaillot) : vide administratif réel. Mouillage discret utilisable pour toute opération ne souhaitant pas être vue de San Juan. Distance : environ 8 km au sud-est de la pointe orientale de Porto Rico.`, */
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
      1713: `Torres y Ayala, rétabli dans ses fonctions le 14 février 1713 après s'être défendu à Madrid, reprend le gouvernorat. Ancien gouverneur de Floride, fin administrateur, il lance la construction de l'Hôpital San Lázaro pour les lépreux à La Havane et soutient activement le monopole tabacier de la Couronne — source de tensions avec les contrebandiers et les producteurs indépendants. Il fonde également la ville de Santiago del Bejucal. Cependant, son second mandat est de courte durée : en mai 1716, il est à nouveau suspendu par l'Audiencia de Santo Domingo, accusé cette fois de corruption et de mauvaise gestion des défenses côtières. Vicente de Raja lui succède, mais son administration est marquée par des conflits avec les élites locales et une incapacité à faire face aux menaces corsaires.`,
      1716: `Vicente de Raja, gouverneur de 1716 à 1717, est un administrateur médiocre dont le mandat est entaché par des scandales de corruption et une gestion désastreuse des ressources militaires. Son incapacité à protéger les côtes cubaines contre les raids pirates et corsaires provoque l'indignation de la population et des élites locales.`, /* En août 1717, il est destitué par l'Audiencia de Santo Domingo, qui nomme Gómez Mazaver Ponce de León comme gouverneur provisoire pour assurer une transition rapide. */
      1717: `Gómez Mazaver Ponce de León assure une transition brève et chaotique, avant que Gregorio Guazo y Calderón ne prenne le gouvernorat en juin 1718.`,
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
    id: 'bahamas-archipel',
    nom: 'Bahamas — Archipel (îles secondaires)',

    puissance: {
      1712: 'anarchie-pirate',
      1718: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Thomas Walker',
        pnj_id: null,
        titre: 'Vice-gouverneur résiduel des Bahamas (autorité théorique sur tout l\'archipel)',
      },
      1718: {
        nom: 'Woodes Rogers',
        pnj_id: null,
        titre: 'Gouverneur royal des Bahamas',
      },
      1721: {
        nom: 'George Phenney',
        pnj_id: null,
        titre: 'Gouverneur royal des Bahamas',
      },
    },

    contexte: {
      1712: `Les Bahamas forment un archipel de plus de sept cents îles et îlots, dont la grande majorité est inhabitée ou saisonnièrement fréquentée. L'autorité nominale appartient aux Lords Proprietors — les mêmes propriétaires qui gouvernent les Carolines depuis 1663 — mais leur présence est purement théorique : aucun gouverneur effectif ne réside dans les îles depuis plusieurs années, et Thomas Walker, vice-gouverneur résiduel replié à Harbour Island (Eleuthera), n'exerce qu'une autorité fantomatique sur New Providence et aucune sur le reste de l'archipel.

Dans ce vide, les îles secondaires servent de relais, de refuges et de zones de pêche. Les Turks & Caïques — alors simplement appelées Turks Islands ou Salt Islands — sont la ressource la plus précieuse : leurs salines naturelles fournissent du sel à bas coût à toutes les colonies du littoral atlantique. Des équipages bermudiens y viennent saisonnièrement récolter le sel, une activité qui sera la source d'un conflit récurrent avec les Français de Saint-Domingue et avec les Espagnols. Abaco, Cat Island et les Exumas sont fréquentées pour l'eau douce, le bois et la pêche à la tortue ; des familles de colons blancs s'y maintiennent dans des conditions précaires.`,

      1718: `L'arrivée de Woodes Rogers à Nassau en juillet 1718 étend théoriquement l'autorité royale britannique sur l'ensemble de l'archipel. En pratique, Rogers n'a ni les hommes ni les ressources pour administrer les îles éloignées ; son autorité effective se limite à New Providence, avec des relais à Eleuthera et Harbour Island. Les îles secondaires restent dans un vide administratif réel, peuplées de quelques familles de colons, de pêcheurs de tortues et de récupérateurs d'épaves.

Les Turks Islands méritent une mention particulière : leur production de sel, exploitée par les Bermudiens, intéresse directement les marchands de Nouvelle-Angleterre et crée une tension latente avec la France (qui revendique certaines îles comme dépendances de Saint-Domingue). Ce différend sera récurrent tout au long du XVIIIe siècle.`,
    },

    zone: [],

    capitale: '[Aucune capitale pour les îles secondaires — Nassau est la capitale de facto de tout l\'archipel]',
    population_approx: 'Quelques centaines de résidents dispersés sur l\'archipel ; Turks Islands : population saisonnière bermudienne de quelques dizaines de récolteurs de sel',
    economie: 'Sel (Turks Islands — ressource principale), pêche à la tortue et aux éponges, récupération sur épaves (wrecking), bois de chauffe',
    /* note: `✅ Établi : charte des Lords Proprietors (1663, 1670) — autorité nominale sur les Bahamas jusqu'en 1718.
✅ Établi : exploitation saisonnière du sel des Turks Islands par les Bermudiens — documentée, source de conflits récurrents avec la France et l'Espagne tout au long du XVIIIe siècle.
✅ Établi : Woodes Rogers nommé gouverneur royal en 1717, débarque à Nassau le 26 juillet 1718 ; George Phenney lui succède en 1721 (Wikipedia EN, liste des gouverneurs des Bahamas).
⚠️ Incertain : population précise des îles secondaires — aucun recensement avant celui de Rogers en 1722, qui ne couvre que New Providence, Eleuthera et Harbour Island.
🎲 Note de campagne : les îles secondaires de l'archipel sont des espaces quasiment hors contrôle pendant toute la période 1712–1720. Un navire qui cherche à se camoufler, à faire de l'eau ou à caréner loin des regards peut y trouver refuge sans croiser la moindre autorité. Les hauts-fonds et les passes coralliennes connues des seuls pilotes locaux (souvent bermudiens) sont un avantage tactique réel.`, */
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
    id: 'panuco',
    nom: 'Pánuco y Tampico',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Alcalde mayor — non identifié avec certitude]',
        pnj_id: null,
        titre: 'Alcalde mayor de Pánuco y Tampico',
      },
      1718: {
        nom: 'Benito Antonio de Castañeda',
        pnj_id: null,
        titre: 'Alcalde mayor de Pánuco y Tampico',
      },
    },

    contexte: {
      1712: `La province de Pánuco — ancienne gobernación de la conquête, devenue Alcaldía Mayor de Pánuco y Tampico depuis 1535 — est en 1712 l'une des frontières les plus exposées de la Nouvelle-Espagne. Son chef-lieu, Santiago de los Valles (actuel Ciudad Valles, San Luis Potosí), est le centre administratif de la Huasteca ; Pánuco lui-même, sur le fleuve éponyme, est un poste avancé face au nord ; Tampico, à l'embouchure du Pánuco sur le Golfe, est un port de faible importance mais stratégique — la seule ouverture maritime de la région entre Veracruz et la Floride.

La Huasteca est l'un des territoires les moins pacifiés de la vice-royauté. Les nations indiennes — Huastèques (Teenek), Chichimèques et groupes nomades du nord — n'ont jamais été pleinement soumises aux missions franciscaines qui constituent l'essentiel de la présence coloniale dans l'arrière-pays. La population espagnole se concentre dans quelques villes et haciendas ; la main-d'œuvre indienne et africaine assure les travaux agricoles et d'élevage. La région produit du bétail, du coton et un peu de cacao, mais reste loin des circuits économiques majeurs de la Nouvelle-Espagne.

Tampico est une ville fragile. Elle a été saccagée par les pirates en 1684 — un traumatisme encore présent dans la mémoire collective — et son port reste peu équipé. Le commerce interlope avec des navires étrangers (anglais en particulier) est une réalité tolérée, faute de moyens de surveillance.`,

      1718: `En 1718, Benito Antonio de Castañeda prend la tête de l'Alcaldía Mayor de Pánuco y Tampico. Dès cette année, il reçoit du vice-roi la licence de mener une expédition vers la sierra Malinchen — massif montagneux au sud de la sierra Tamaulipa Orientale — pour reconnaître des mines signalées dans cette zone encore à peine cartographiée. Cette initiative marque le début d'une pression coloniale plus active vers le nord-est, région que l'Espagne contrôle nominalement mais ne colonise pas encore effectivement. La création future de la Colonia del Nuevo Santander (1746) sera l'aboutissement de ce mouvement amorcé dans les années 1710–1720.`,
    },

    zone: [],

    capitale: 'Santiago de los Valles (siège de l\'alcaldía) ; Pánuco (chef-lieu fluvial) ; Tampico (accès maritime)',
    population_approx: '~30 000 à 50 000 habitants (Huasteca, 1710–1720, très majoritairement indiens — chiffres très approximatifs)',
    economie: 'Élevage (bovins), coton, missions franciscaines, pêche (Tampico), commerce interlope discret avec navires anglais',
    /* note: `✅ Établi : statut d'Alcaldía Mayor de Pánuco y Tampico depuis 1535 (sources concordantes).
  ✅ Établi : Benito Antonio de Castañeda, alcalde mayor de Pánuco y Tampico en 1718, licence d'expédition vers la sierra Malinchen (Herrera Casasús, Intento de colonización en la sierra de Malinchen, UAT, 1988 — cité dans Estudios de Historia Novohispana, UNAM, 2013).
  ✅ Établi : saccage de Tampico par les pirates en 1684 (sources locales concordantes, second saccage en 1738).
  ⚠️ Incertain : nom du ou des alcaldes mayores entre 1712 et 1718 — non identifié dans les sources accessibles. Les archives primaires de référence sont les AGI (Audiencia de México, legajos 75–100). À compléter en bibliothèque spécialisée.
  ⚠️ Incertain : chiffres de population — aucun recensement précis pour la Huasteca à cette date. Fourchette inférée des données disponibles pour la fin du XVIIe et le milieu du XVIIIe siècle.`, */
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
      1722: `Le marquis de Casafuerte (1722–1734), né à Lima, inaugure une ère de stabilité et de réformes administratives. Sous son mandat paraît la première <em>Gaceta de México</em> (1722), premier journal imprimé du continent nord-américain.`,
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

L'économie repose sur l'indigo, le bétail et une contrebande active avec les Anglais qui s'installent dans la baie du Belize voisine, dont l'exploitation du bois de Campêche (<em>logwood</em>) est une source de friction permanente entre Madrid et Londres. La côte caraïbe est pratiquement sans défense contre les incursions anglaises et les pirates.`,
      1715: `Vértiz y Hontañón administre le Yucatán dans une période de tensions : les Anglais de Belize étendent leurs installations et leur influence sur les Indiens de la frontière. En 1716, le vice-roi Valero envoie une expédition depuis Veracruz pour chasser les Britanniques de la Laguna de Términos (Campeche) — opération réussie militairement mais incapable de résoudre durablement la pression anglaise.`,
    },

    zone: [],

    capitale: 'Mérida',
    population_approx: '~250 000 habitants (1713, dont une grande majorité de Mayas)',
    economie: 'Indigo, bétail, sel, bois de Campêche (logwood), contrebande avec les Anglais',
    /* note: `Le Yucatán est une Capitainerie générale distincte de la Nouvelle-Espagne depuis 1617, avec son propre gouverneur-capitaine général. Séquence confirmée par Wikipedia EN (Governor of Yucatán) et List of governors in the Viceroyalty of New Spain. Note sur Alonso de Meneses : son mandat (1712-1715) s'achève juste au moment où son parent Francisco de Meneses est destitué au Nouveau-Grenade — coïncidence historique notable.`, */
  },

  {
    id: 'lamanay-turneffe',
    nom: 'Lamanay & cayes du golfe du Honduras',

    puissance: {
      1712: 'conteste',
      // Revendiqué par l'Espagne (Honduras), fréquenté par les Anglais
      // de Belize. Aucune autorité effective permanente d'aucune puissance.
      1718: 'britannique',
      // Présence anglaise de facto progressivement dominante à mesure
      // que le settlement de Belize se consolide après 1718.
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité constituée]',
        pnj_id: null,
        titre: 'Territoire sans administration — revendiqué par l\'Espagne, fréquenté par les Anglais',
      },
      1718: {
        nom: '[Public Meeting de Belize — instance informelle]',
        pnj_id: null,
        titre: 'Autogouvernance des Baymen (coupeurs de bois anglais)',
        // Le "Public Meeting" est l'assemblée informelle des Baymen
        // de Belize — pas un gouvernement reconnu, mais l'autorité
        // de facto sur la zone dès les années 1720.
      },
    },

    contexte: {
      1712: `<strong>Identification cartographique.</strong> Sur la carte Jaillot 1708, cet ensemble apparaît sous les noms <em>Lamanay</em> (la plus grande structure, probablement l'atoll de Turneffe), <em>Zaratan</em> (probablement Lighthouse Reef, le plus à l'est), <em>Ilbob</em>, <em>Quita Zuno</em> (cayes du récif barrière) et <em>Catumal</em> (la baie de Chetumal, plus au nord). Ces toponymes, courants dans la cartographie du début du XVIIIe siècle, ne correspondent à aucune dénomination moderne — ils ont été remplacés par des noms de navigation anglais au fil du XVIIIe siècle.

<strong>Géographie.</strong> L'atoll de Turneffe (<em>Lamanay</em>) est la plus grande structure récifale de la zone : environ 50 km du nord au sud pour 15 km de large, constitué de dizaines d'îlots de mangrove, de lagons peu profonds et d'une barrière coralline externe. Il est situé à 30 km à l'est de Belize City actuelle. Lighthouse Reef (<em>Zaratan</em>), plus à l'est, est plus petit et plus isolé — c'est là que se trouve le Grand Trou Bleu. Glover's Reef, plus au sud, porte le nom d'un pirate du XVIIe siècle, John Glover, qui l'utilisait comme base de raid contre les convois espagnols.

<strong>Statut politique.</strong> L'Espagne revendique l'ensemble du golfe du Honduras comme territoire sous sa juridiction — nominalement partie de la Capitainerie générale du Guatemala. En pratique, elle n'y maintient aucune garnison ni présence permanente. Les atolls sont fréquentés librement par les coupeurs de bois anglais (<em>Baymen</em>) basés sur la côte du Belize, dont le settlement informel est en cours de consolidation depuis les années 1650–1660. Ces hommes, anciens boucaniers reconvertis dans le commerce du bois de campêche (<em>logwood</em>), font escale aux atolls pour l'eau douce, l'abri et la pêche.

<strong>Le commerce du logwood.</strong> Le bois de campêche (<em>Haematoxylum campechianum</em>) est l'une des matières premières les plus précieuses de l'économie atlantique : sa teinture rouge et pourpre est indispensable à l'industrie textile européenne. Les importations annuelles en Grande-Bretagne dépassent 12 000 tonnes, et le logwood atteint 25 à 30 livres sterling la tonne à Port Royal avant d'être revendu en Europe à 90–110 livres la tonne.  Les sloops jamaïcains font régulièrement la route Port Royal – golfe du Honduras pour charger ces cargaisons, en traversant ou en longeant la zone des atolls. C'est précisément un de ces navires, le sloop <em>Adventure</em> en provenance de Jamaïque, que Barbe-Noire capture à Turneffe en avril 1718.

<strong>La présence pirate.</strong> Les atolls sont des mouillages naturels sur la route entre la Jamaïque et le golfe du Mexique. Peu fréquentés par les autorités espagnoles, difficiles d'accès pour les grands navires en raison des hauts-fonds, ils offrent aux pirates eau douce, abri et discrétion. L'hiver 1717–1718, Barbe-Noire harcèle les navires entre Veracruz et le golfe du Honduras.  Le 5 avril 1718, alors qu'il faisait escale à Turneffe pour faire de l'eau douce, le sloop <em>Adventure</em> du capitaine David Herriot est capturé par la flottille de Barbe-Noire — menée par la frégate de 40 canons <em>Queen Anne's Revenge</em>, qui tire un coup de semonce et hisse le pavillon noir.  Barbe-Noire confie l'<em>Adventure</em> à son lieutenant Israel Hands et met le cap sur la Caroline du Nord.`,

      1718: `Après l'arrivée de Woodes Rogers à Nassau en juillet 1718 et la normalisation progressive de la piraterie dans les Bahamas, le golfe du Honduras perd son rôle de terrain de chasse privilégié pour les pirates de la Flying Gang. La zone reste cependant fréquentée par des équipages opérant indépendamment ou depuis d'autres bases.

<strong>Consolidation anglaise.</strong> Le premier établissement britannique permanent au Belize est fondé dans les années 1710 sur Cayo Cosina, après la destruction par les Espagnols des premiers villages de bûcherons anglais dans la région de la Laguna de Términos à l'ouest du Yucatan actuel.  Les atolls — Turneffe surtout — deviennent des escales régulières sur la route entre ce settlement et la Jamaïque. Les Baymen s'y arrêtent pour l'eau et l'abri ; les pilotes locaux en connaissent les passes coralliennes, inconnues de la plupart des navigateurs.

<strong>La tension hispano-anglaise.</strong> L'Espagne proteste régulièrement contre la présence anglaise dans le golfe, qu'elle considère comme une intrusion dans ses eaux souveraines. Elle lance des expéditions punitives contre les établissements de bûcherons — mais n'établit elle-même aucune présence dans les atolls. La forteresse navale de Salamanca de Bacalar, siège du gouvernement colonial espagnol dans la zone, opère à pleine capacité ; les guarda costas patrouillent les voies d'eau.  Mais les atolls, trop éloignés et trop peu profonds, échappent à cette surveillance.

<strong>Salamanca de Bacalar.</strong> La ville espagnole la plus proche — <em>Salamanca</em> sur la carte Jaillot — est Bacalar, à la tête de la lagune du même nom dans l'actuel Quintana Roo. Le sud de ce qui est aujourd'hui le Quintana Roo était gouverné depuis Bacalar, sous l'autorité du Capitaine général du Yucatan à Mérida. La forteresse San Felipe de Bacalar ne sera achevée qu'en 1729.  En 1712–1720, Bacalar est donc une ville ouverte, peu défendue, dont la garnison est trop faible pour surveiller efficacement les atolls au large.`,
    },

    zone: [],

    capitale: '[Aucune — atolls et cayes sans établissement permanent]',
    population_approx: 'Quelques équipages saisonniers de bûcherons anglais et de pêcheurs ; passage de navires pirates et marchands',
    economie: 'Bois de campêche (logwood) — transit et coupe ; eau douce (ressource stratégique) ; pêche (tortues, poissons) ; mouillage de refuge',
    /* note: `<strong>Identification des toponymes Jaillot :</strong>
✅ <em>Lamanay</em> → Turneffe Atoll (très probable : seule structure de taille "remarquable" dans la zone, 50 × 15 km).
✅ <em>Catumal</em> → Baie de Chetumal (confirmé : transcription hispanique ancienne du toponyme maya).
⚠️ <em>Zaratan</em> → Lighthouse Reef (probable : position la plus à l'est, isolée ; "zaratan" = île-tortue fabuleuse dans la tradition médiévale hispano-arabe).
⚠️ <em>Ilbob</em>, <em>Quita Zuno</em> → cayes du récif barrière non identifiées avec certitude. Noms de navigation aujourd'hui perdus.

✅ Établi : Barbe-Noire à Turneffe, 4–5 avril 1718 — capture du sloop <em>Adventure</em> de David Herriot (Wikipedia EN, Turneffe Atoll ; sources concordantes).
✅ Établi : Glover's Reef doit son nom à John Glover, pirate du XVIIe siècle.
✅ Établi : commerce du logwood — route Port Royal / golfe du Honduras, valeurs commerciales (sources citées dans l'article David Herriot).
✅ Établi : Salamanca de Bacalar = siège du gouvernement colonial espagnol dans la zone, fort inachevé en 1712–1720 (Wikipedia EN, Bacalar).
⚠️ Incertain : présence pirate régulière aux atolls avant 1718 — inférée de la géographie et de la fréquentation documentée, peu de sources primaires directes.
🎲 Note de campagne : Turneffe (<em>Lamanay</em>) est un décor utilisable immédiatement. Eau douce, abri contre les tempêtes, hauts-fonds qui interdisent l'entrée aux grands navires, mangroves où un sloop peut se cacher. Barbe-Noire y est physiquement attesté en avril 1718 — soit quelques mois avant la fenêtre d'ouverture de la plupart des campagnes Pavillon Noir. L'atoll peut très bien avoir gardé une réputation de mouillage pirate au-delà de ce passage.`, */
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
    /* note: 'Le Chiapas (<em>Chiapa</em>) relève de l\'Audience de Guatemala et non de Mexico — contrairement à l\'intuition géographique. Soconusco (<em>Soco Nusco</em>) relève de l\'Audience de Mexico (exception). Honduras et Nicaragua ont chacun des gouverneurs distincts, subordonnés au Président de Guatemala. Séquence confirmée : Wikipedia ES (Anexo:Gobernantes de la Capitanía General de Guatemala).', */
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
      1712: `Le Darién est l'un des territoires les plus dangereux et les moins contrôlés de l'empire espagnol. Coincé entre la province de Panama à l'ouest et la Nouvelle-Grenade à l'est, l'isthme oriental est en pratique dominé par les Indiens <strong>Kunas</strong> (Cuna), qui ont repoussé toutes les tentatives de colonisation espagnole depuis le XVIe siècle et maintiennent une résistance armée permanente contre les présides coloniaux.

La carte Jaillot de 1708 mentionne encore "Nouvelle Calédonie" et le port de "New Edinburgh" — traces de la catastrophique <strong>expédition du Darién</strong> (1698–1700), par laquelle la Compagnie écossaise tenta d'établir une colonie commerciale entre les deux océans. Les deux tentatives successives (1698 et 1699) se soldèrent par des milliers de morts de maladie et d'épuisement, et par une attaque espagnole finale en 1700. En 1712, il ne reste absolument rien de la colonie écossaise — les noms sur la carte sont anachroniques, figés au moment de la gravure.

L'échec de l'expédition du Darién ruina la Compagnie d'Écosse et contribua directement à l'<strong>Acte d'Union de 1707</strong>, qui fusionna l'Écosse et l'Angleterre en Grande-Bretagne. Pour les personnages de jeu, les ruines de New Edinburgh existent peut-être encore dans la jungle, et le souvenir est récent.`,
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

En 1715, éclate un événement sans précédent dans l'histoire coloniale espagnole : les <em>oidores</em> (juges) de l'Audiencia renversent et font arrêter leur propre président, Francisco de Meneses, qu'ils jugent corrompu et tyrannique. Ils l'envoient prisonnier au château de Bocachica à Carthagène. Ce "coup d'État judiciaire" déclenche une crise institutionnelle qui parvient jusqu'à Madrid — et convainc la Couronne que la Nouvelle-Grenade nécessite une autorité plus forte.`,
      1717: `La réponse de Madrid est radicale : par la Real Cédula du 27 mars 1717, Philippe V crée le <strong>Vice-royauté de Nouvelle-Grenade</strong> — la troisième d'Amérique — avec Santafé pour capitale. C'est la première des grandes Réformes Bourboniennes en Amérique. Un premier représentant provisoire, Pedrosa y Guerrero, arrive à Santafé en juillet 1718 et proclame le virreinato. Le premier vice-roi officiel, Jorge de Villalonga, n'arrive qu'en novembre 1719. La vice-royauté est supprimée dès 1723 — jugée trop coûteuse — et ne sera rétablie définitivement qu'en 1739.`,
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
    id: 'tortuga-venezolana',
    nom: 'Isla La Tortuga (Tortuga vénézuélienne)',

    puissance: {
      1712: 'conteste',
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité permanente]',
        pnj_id: null,
        titre: 'Nominalement espagnole — fréquentation anglo-américaine saisonnière',
      },
    },

    contexte: {
      1712: `Île plate et aride de 156 km², sans eau douce permanente, à 87 km au nord de la côte vénézuélienne et 120 km à l'ouest de Margarita. La carte Jaillot de 1708 la désigne "Aux Anglois" — formulation qui traduit une réalité de fréquentation plutôt que de souveraineté : l'île est nominalement espagnole depuis 1638, date à laquelle le gouverneur de Cumaná Benito Arias Montano en chassa les Hollandais et détruisit leurs installations salicoles. Depuis lors, elle est officiellement vide.

En pratique, La Tortuga est le théâtre d'une institution maritime annuelle bien documentée : la <em>Flota de Satertuda</em> (corruption anglaise de "La Tortuga"), flotte saisonnière de petits navires anglo-américains — principalement de Nouvelle-Angleterre, des Bermudes et des Antilles britanniques — qui viennent extraire le sel de ses salines naturelles sur la côte sud-est. Ce sel, d'une qualité médiocre (grossier, rougeâtre, entièrement dépendant du soleil tropical), est néanmoins indispensable aux économies sucrières des Antilles britanniques pour la conservation des aliments. Les archéologues ont retrouvé sur le site de Punta Salinas les traces matérielles de ces camps saisonniers : céramiques anglaises, hollandaises et bermoudiennes, structures légères, restes de repas.

Les Espagnols tolèrent cette fréquentation avec irritation mais sans les moyens de l'empêcher. Le gouverneur de Cumaná en rend compte régulièrement à Madrid sans recevoir les renforts nécessaires pour établir une présence permanente.`,
    },

    zone: [],

    capitale: 'Aucune — île sans établissement permanent',
    population_approx: 'Nulle en permanence ; plusieurs centaines de marins saisonniers lors des récoltes de sel',
    economie: 'Sel (exploitation anglo-américaine saisonnière), pêche à la tortue',
    /* note: `✅ Établi : exploitation salicole hollandaise 1624–1638 ; expulsion par le gouverneur de Cumaná en 1638 ; fréquentation anglo-américaine 1638–1781 documentée archéologiquement (Antczak & Antczak, <em>Islands of Salt</em>, 2019 ; <em>Risky Business</em>, Taylor & Francis, 2015).
✅ Établi : la mention "Aux Anglois" sur la carte Jaillot reflète cette fréquentation saisonnière établie, non une souveraineté.
À ne pas confondre avec : l'île de la Tortue haïtienne (<em>Île de la Tortue*</em>, au nord d'Hispaniola), ancienne base flibustière française — deux îles distinctes portant le même nom.
Ce bloc est un complément au bloc \`nouvelle-andalousie\` — La Tortuga relève nominalement de la province de Cumaná.`, */
  },

  {
    id: 'margarita',
    nom: 'Île Margarita (Provincia de Margarita)',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Gouverneur — non identifié avec certitude]',
        pnj_id: null,
        titre: 'Gouverneur et Capitaine général de Margarita',
        // Source primaire de référence : AGI Santo Domingo, 614
        // (lettre du gouverneur, 5 oct. 1700) et legajos suivants.
        // Liste complète des 34 gouverneurs titrés (1594–1810) non
        // accessible en ligne pour cette période précise.
      },
    },

    contexte: {
      1712: `La Provincia de Margarita est en 1712 l'une des plus anciennes unités administratives de l'empire espagnol en Amérique : érigée en gobernación dès 1525, elle fut la première province organisée du Venezuela actuel. L'île doit son nom et sa première fortune aux pêcheries de perles qui firent sa gloire au XVIe siècle — <em>margarita</em>, en latin, signifie perle. Ces gisements sont épuisés depuis le début du XVIIe siècle, laissant l'île dans un relatif dénuement dont elle ne s'est jamais tout à fait remise.

<strong>Géographie et position stratégique.</strong> Margarita est une île double — deux masses terrestres reliées par un isthme étroit, la péninsule de Macanao à l'ouest et le corps principal à l'est — d'environ 1 000 km² au total. Elle est séparée de la côte vénézuélienne (Cumaná) par le canal de Bocas, large d'une vingtaine de kilomètres. Sa position en fait un point de passage incontournable pour tout navire naviguant entre Trinidad, les Petites Antilles et les côtes de la Terre Ferme espagnole. Le port de Pampatar, sur la côte sud-est, est le principal point d'entrée maritime.

<strong>Administration.</strong> Margarita est une province à part entière, avec son propre Gouverneur et Capitaine général nommé par la Couronne — distincte de la Provincia de Nueva Andalucía (Cumaná) sur le continent. Elle dépend de la Real Audiencia de Santo Domingo jusqu'en 1739. La capitale administrative est <strong>La Asunción</strong>, petite ville de l'intérieur ; Pampatar et Porlamar sont les centres commerciaux côtiers. En 1712, l'île compte une population d'environ 8 000 à 10 000 habitants — Espagnols créoles, métis, libres de couleur et esclaves — dont une part significative vit de la pêche, du petit commerce et de l'élevage caprin.

<strong>Économie et piraterie.</strong> Faute de perles, Margarita tire ses ressources de l'élevage (bovins, caprins), de la pêche côtière, et d'un commerce de demi-contrebande avec les navires étrangers qui longent la côte. Sa proximité avec les routes du commerce intercolonial — et son isolement relatif par rapport aux garnisons continentales — en fait depuis le XVIe siècle une cible récurrente pour les corsaires et pirates : les Français l'ont pillée en 1576, 1593 et 1677. Cette vulnérabilité chronique explique les fortifications modestes de Pampatar et le recours fréquent à des milices locales peu équipées. En 1712–1720, le fort de Pampatar (<em>Castillo de San Carlos de Borromeo</em>) est la seule défense organisée de l'île.

<strong>Île de Coche et îlots dépendants.</strong> L'île de Coche, au sud de Margarita (environ 55 km²), et l'îlot de Cubagua — berceau des pêcheries de perles, aujourd'hui déserté — relèvent de la même gouvernance. Cubagua, première ville espagnole des Amériques (Nueva Cádiz, fondée vers 1500, abandonnée vers 1543), est en ruines en 1712 mais son nom reste sur les cartes.`,
    },

    zone: [],

    capitale: 'La Asunción (administrative) ; Pampatar (maritime)',
    population_approx: '~8 000 à 10 000 habitants (1712, estimation — recensement de 1757 : 10 064 habitants)',
    economie: 'Élevage (bovins, caprins), pêche côtière, commerce intercolonial (légal et interlope), ancienne pêcherie de perles (épuisée)',
    /* note: `⚠️ Incertain : nom du gouverneur pour 1712–1720. Les sources en ligne ne fournissent pas de liste nominative des gouverneurs de Margarita pour le début du XVIIIe siècle. Manuel Taibo (<em>La Provincia de Margarita 1525–1819</em>) mentionne 34 gouverneurs titrés entre 1594 et 1810 mais sans dates individuelles accessibles en ligne. Source primaire de référence : AGI Santo Domingo, legajos 614 et suivants. À compléter en bibliothèque spécialisée ou via le Catálogo de Pasajeros de Indias (AGI).
✅ Établi : statut de province distincte de Nueva Andalucía, dépendant de la Real Audiencia de Santo Domingo jusqu'en 1739 (Wikipedia ES, Provincia de Margarita).
✅ Établi : population de 10 064 habitants au recensement de 1757 (Viajeros del Tiempo, citant le Vecindario de 1757 ordonné par le gouverneur Alonso del Río y Castro).
✅ Établi : fort de Pampatar (Castillo San Carlos de Borromeo) — fortification côtière existante en 1712.
✅ Établi : épuisement des pêcheries de perles au début du XVIIe siècle.
🎲 Note de campagne : Margarita est un nœud de passage entre l'est des Caraïbes et la Terre Ferme. Tout navire reliant Trinidad ou les Petites Antilles à Carthagène ou Portobelo passe à portée de ses côtes. Le gouverneur local, isolé et peu soutenu par le continent, est structurellement porté à fermer les yeux sur un commerce interlope qui fait vivre l'île.`, */
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

  // ── MARTINIQUE ───────────────────────────────────────────
  {
    id: 'martinique',
    nom: 'Martinique',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      // Note structurelle : la Martinique est siège du Gouverneur général des Îles du Vent,
      // qui coiffe nominalement toutes les colonies françaises des Petites Antilles.
      // On distingue ici ce gouverneur général du gouverneur particulier de l'île,
      // lorsque les deux fonctions sont occupées simultanément par des personnes différentes.
      1712: {
        nom: 'Jean-Pierre de Casamajor de Charritte',
        pnj_id: null,
        titre: 'Gouverneur de la Martinique (gouverneur particulier)',
        // Nommé gouverneur des Îles du Vent en 1711, il refuse ce titre supérieur
        // pour surveiller ses plantations à Saint-Domingue — gouverneur de Martinique de fait.
      },
      1714: {
        nom: 'Abraham Duquesne-Guitton, marquis de Bellebat',
        pnj_id: null,
        titre: 'Gouverneur général des Îles du Vent',
        // Nommé en récompense de sa conversion du protestantisme au catholicisme.
        // Réside à Fort-Royal (Martinique), siège du gouvernement général.
      },
      1717: {
        nom: "Antoine d'Arcy, seigneur de La Varenne",
        pnj_id: null,
        titre: 'Gouverneur général des Îles du Vent',
        // En poste du 7 janvier au 23 mai 1717 seulement — expulsé par le Gaoulé.
        // Remplacé par Feuquières comme gouverneur général.
      },
      // NB : Florimond Hurault de Montigny est gouverneur PARTICULIER de la Martinique
      // sous l'autorité de Feuquières (1717?–1720) — il n'est pas gouverneur général des Îles du Vent.
      // Sa présence dans les sources (Wikipedia EN, Johnson) est établie ; ses dates précises d'entrée en fonctions
      // ne sont pas confirmées par les ANOM pour la période 1717–1720.
      1718: {
        nom: 'François de Pas de Mazencourt, marquis de Feuquières',
        pnj_id: null,
        titre: 'Gouverneur général des Îles du Vent',
        // En poste 1717–1727. Source primaire : ANOM, correspondance à l'arrivée de la Martinique.
        // Coiffe Martinique, Guadeloupe et toutes les Petites Antilles françaises.
        // Montigny, gouverneur particulier de la Martinique sous ses ordres, est tué par Bartholomew Roberts en octobre 1720.
      },
    },

    contexte: {
      1712: `Colonie française depuis 1635, la Martinique est le cœur administratif des Antilles françaises : Fort-Royal (aujourd'hui Fort-de-France) est le siège du Gouverneur général des Îles du Vent, qui étend nominalement son autorité sur Guadeloupe, Grenade, Saint-Domingue et les autres îles françaises. Saint-Pierre, sur la côte nord-ouest, est le principal port marchand et la ville la plus peuplée de l'île. L'économie repose sur le sucre, le cacao, l'indigo et, plus marginalement, le café — tous exploités par une main-d'œuvre servile massive. La Martinique est reliée à Bordeaux, Nantes et Marseille par un trafic régulier, mais le commerce interlope avec les Hollandais de Curaçao et les Anglais de la Barbade est endémique malgré les interdictions.

Jean-Pierre de Casamajor de Charritte est un gouverneur pragmatique et populaire, réputé "doux et ennemi du despotisme", mais avide : son conflit avec le flibustier Pierre Morpain — dont il s'est approprié la frégate pour 2 000 livres avant de la revendre 6 000 — est connu des milieux maritimes des Antilles.`,
      1714: `Abraham Duquesne-Guitton, marquis de Bellebat, prend la tête du gouvernement général des Îles du Vent. Neveu du grand amiral Abraham Duquesne, il doit sa nomination à sa récente conversion au catholicisme — conversion opportuniste que ses contemporains ne lui pardonnent pas. Il réside à Fort-Royal et supervise une colonie prospère mais en tension permanente avec les intérêts des grands planteurs créoles.`,
      1717: `Janvier–mai 1717 : le Gaoulé. Antoine d'Arcy de La Varenne arrive avec l'intendant Ricouart avec la mission de faire appliquer des réformes impopulaires : limiter le nombre de sucreries (241 en 1716), réprimer les abus judiciaires, et surtout interdire le commerce avec l'étranger. Les grands habitants se soulèvent. Le 23 mai 1717, le gouverneur et l'intendant sont arrêtés par les révoltés et renvoyés de force en France. Cet épisode, connu sous le nom de Gaoulé, illustre la résistance des élites créoles à l'autorité métropolitaine — et la fragilité réelle du contrôle de Paris sur ses colonies antillaises.

François de Pas de Mazencourt, marquis de Feuquières, lui succède comme gouverneur général des Îles du Vent (1717–1727) et s'installe à Fort-Royal. Il est l'autorité supérieure sur l'ensemble des îles françaises des Petites Antilles. Sous son gouvernement, Florimond Hurault de Montigny assure la direction locale de la Martinique en tant que gouverneur particulier — jusqu'à sa mort en octobre 1720, tué par le pirate Bartholomew Roberts qui l'attaque en mer.`,
    },

    zone: [],

    capitale: 'Fort-Royal (Fort-de-France)',
    population_approx: '~24 000 habitants (1713, dont ~15 000 esclaves)',
    economie: 'Sucre, cacao, rhum, indigo ; commerce interlope actif avec Curaçao et Barbade',
    /* note: '✅ Gouverneurs établis depuis : ANOM (recherche-anom.culture.gouv.fr — correspondance à l\'arrivée de la Martinique, source primaire), Wikipedia EN/FR, GHCaraibe.org, gouverneurs_caraibes.html (session parallèle). ⚠️ Distinction critique : Feuquières est gouverneur général des Îles du Vent (1717–1727) ; Montigny est gouverneur PARTICULIER de la Martinique sous ses ordres (1717?–1720, tué par Roberts). ⚠️ Charritte (1712–1716) est gouverneur particulier de Martinique, non gouverneur général (poste qu\'il a refusé). ⚠️ Duquesne-Guitton : les ANOM datent son mandat "1714–1716", concordant avec Wikipedia. ⚠️ Date d\'entrée en fonctions de Feuquières : les ANOM confirment 1717, sans date précise de prise de poste après l\'expulsion de La Varenne (mai 1717). Population : estimation composite (Pritchard, In Search of Empire, 2004).', */
  },

  // ── BARBADE ──────────────────────────────────────────────
  {
    id: 'barbade',
    nom: 'Barbade',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: 'Robert Lowther',
        pnj_id: null,
        titre: 'Gouverneur',
        // En poste depuis 1711. Personnage violent et autoritaire, connu pour ses abus.
        // Rappelé en Angleterre en février 1714 suite à plaintes du Conseil de l'île.
      },
      1714: {
        nom: 'William Sharpe',
        pnj_id: null,
        titre: 'Gouverneur par intérim',
        // Assure l'intérim de janvier 1714 à novembre 1715.
      },
      1715: {
        nom: 'Robert Lowther',
        pnj_id: null,
        titre: 'Gouverneur',
        // Réintégré par George Ier en novembre 1714, effectif vers 1715.
        // Révoqué en mars 1720 : corruption, commerce avec l'Espagne ennemie, complicité présumée avec les pirates.
      },
    },

    contexte: {
      1712: `Colonie britannique depuis 1627, la Barbade est la plus ancienne et la plus prospère des Antilles anglaises. Bridgetown est un port actif, premier point d'escale de nombreux navires venant d'Europe ou de Virginie. L'île produit du sucre depuis les années 1640 et en est devenue l'archétype colonial : une mono-économie sucrière totale, fondée sur une main-d'œuvre servile qui représente les deux tiers de la population. Les grandes familles de planteurs — les Drax, les Codrington, les Frere — exercent une influence considérable sur le Conseil et l'Assemblée locaux.

Le gouverneur Robert Lowther est une figure divisive. Venu en Barbade par mariage (il a épousé une héritière des plantations Frere), il y exerce une autorité jugée despotique : il suspend les membres du Conseil qui lui résistent, tente de poursuivre pour haute trahison un avocat qui a défendu son adversaire, et est suspecté d'avoir délibérément immobilisé des navires de guerre royaux pour empêcher la poursuite de pirates — permettant à ceux-ci de faire des ravages dans le commerce local. Il est rappelé une première fois en Angleterre en février 1714, après plaintes écrites au Conseil privé.`,
      1715: `Robert Lowther, acquitté à Londres en faisant valoir que ses opposants en Barbade sont des sympathisants jacobites, est réintégré par George Ier en novembre 1714 et reprend ses fonctions vers 1715. Son second mandat est marqué par un conflit ouvert avec le révérend William Gordon, pasteur anglican, qui voyage à Londres en 1718 et publie un pamphlet accusant Lowther de diriger "un régime corrompu et tyrannique". L'Assemblée de Barbade ordonne que ce pamphlet soit brûlé comme libelle séditieux — mais le Board of Trade rappelle finalement Lowther en mars 1720, notamment pour avoir laissé un navire espagnol (ennemi) commercer librement à Barbade et pour avoir accepté des cadeaux illicites du Conseil.`,
    },

    zone: [],

    capitale: 'Bridgetown',
    population_approx: '~50 000 habitants (1713, dont ~42 000 esclaves)',
    economie: 'Sucre, rhum, mélasse ; commerce de transit vers les colonies continentales',
    /* note: '✅ Gouverneurs établis depuis : Wikipedia EN (Robert Lowther, List of governors of Barbados), History of Parliament Online (Lowther entry, très détaillé), Cumbrian Characters (biographie narrative). Épisode pirate (rétention des navires de guerre) : source Lincoln, British Pirates and Society (2014), citée dans Cumbrian Characters. ⚠️ La date exacte de retour effectif de Lowther après réintégration (nov. 1714) n\'est pas précisée dans les sources consultées — "vers 1715" retenu.', */
  },

  // ── CURAÇAO ──────────────────────────────────────────────
  {
    id: 'curacao',
    nom: 'Curaçao (avec Aruba et Bonaire)',

    puissance: {
      1712: 'hollandaise',
    },

    gouverneur: {
      1712: {
        nom: 'Jeremias van Collen',
        pnj_id: null,
        titre: 'Directeur des îles ABC pour la WIC',
        // En poste de 1710(?) à 1715. Issu d'une famille patricienne amsterdamoise.
        // Réputé corrompu : commerce illicite avec les Français pendant la guerre,
        // emprisonnement arbitraire de ses adversaires au Conseil.
      },
      1715: {
        nom: 'Jonathan van Beuningen',
        pnj_id: null,
        titre: 'Directeur par intérim des îles ABC pour la WIC',
        // Ad interim 1715–1720. Beau-frère de Jeremias van Collen (sa belle-mère
        // est la sœur de Ferdinand et de Jeremias van Collen).
      },
      1720: {
        nom: 'Jan van Beuningen',
        pnj_id: null,
        titre: 'Directeur des îles ABC pour la WIC',
        // Gouverneur titulaire nommé en 1720, décédé le 18 septembre 1720 après 4 jours de maladie.
        // Écrit une lettre poignante à la WIC sur le sort des esclaves abandonnés par leurs maîtres.
      },
    },

    contexte: {
      1712: `Curaçao est la plaque tournante du commerce hollandais dans les Caraïbes. Willemstad — organisée autour du Fort Amsterdam, sur la baie de Sint Anna — est l'un des ports les plus actifs de la région, ouvert à toutes les nations et à tous les commerces. La Compagnie des Indes occidentales (WIC) administre l'île depuis 1634, mais son monopole formel est de plus en plus fictif : le commerce libre, souvent interlope, est la norme réelle. Curaçao est en particulier le nœud du trafic négrier entre l'Afrique et les colonies espagnoles du continent (asiento de negros), ainsi qu'un entrepôt de marchandises européennes redistribuées vers la Terre Ferme et les îles françaises et espagnoles voisines.

Le directeur Jeremias van Collen est une figure ambiguë et controversée. Appartenant à une famille régente d'Amsterdam, il a accédé au poste après une série d'intérims et de manœuvres. Il est suspecté d'avoir commercé avec les Français pendant la guerre de Succession d'Espagne (1702–1713) et d'avoir fait emprisonner arbitrairement un officier qui l'avait dénoncé. En 1713, son nom figure parmi les quatre personnes les plus riches de l'île — ce dans un contexte économique difficile, ce qui interpelle.

En février 1713 — derniers mois de la guerre — Curaçao subit une brève occupation française (18–27 février), menée par des pirates opérant sous pavillon français. L'épisode est court mais humiliant pour la WIC.`,
      1715: `Après la mort ou le départ de Jeremias van Collen, Jonathan van Beuningen assure l'intérim (1715–1720). La période est marquée par la continuité d'un commerce actif mais structurellement illicite : Curaçao alimente en marchandises les colonies espagnoles du Venezuela et de la Nouvelle-Grenade qui, en retour, écoulent cacao, peaux et coupons. L'île est fréquentée par des navires de toutes nationalités et de toutes intentions. La faiblesse militaire de la garnison et la vénalité avérée des administrateurs en font un refuge informel pour des opérations en marge de la légalité.`,
    },

    zone: [],

    capitale: 'Willemstad (Fort Amsterdam)',
    population_approx: '~8 000 habitants (1713, dont ~5 000 à 6 000 esclaves)',
    economie: 'Commerce interlope, transit négrier (asiento), entrepôt de redistribution, sel (Bonaire)',
    /* note: '✅ Liste des directeurs WIC établie depuis : Geni.com (Governors of the Netherlands Antilles project), Genealogie Kerckrinck (nikhef.nl — source généalogique néerlandaise de haute qualité), Wikipedia NL (Jan van Beuningen). ⚠️ Le titre exact des administrateurs de Curaçao est "directeur" (pour la WIC) et non "gouverneur" au sens colonial classique. ⚠️ La date exacte de fin de mandat de Jeremias van Collen est incertaine : "1710–1715" selon Geni, confirmé par sources généalogiques. ⚠️ Épisode de l\'occupation française de février 1713 : confirmé par WorldStatesmen.org, sans source primaire identifiée pour le commandant ou les circonstances précises. ⚠️ Population : estimation d\'après Postma, The Dutch in the Atlantic Slave Trade (1990) et Klooster, Illicit Riches (1998).', */
  },

  // ── DOMINIQUE ────────────────────────────────────────────
  {
    id: 'dominique',
    nom: 'Dominique',

    puissance: {
      1712: 'conteste',
      // De jure : île neutre par l'accord franco-britannique de 1660, laissée aux Kalinago.
      // De facto : présence croissante de coupeurs de bois et de squatteurs français depuis ~1690.
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité constituée]',
        pnj_id: null,
        titre: 'Île neutre — pas de gouverneur',
        // Pas d'administration coloniale. Les Kalinago sont l'autorité réelle sur l'intérieur.
        // Les squatteurs français du littoral ne relèvent nominalement que de Martinique ou Guadeloupe.
      },
    },

    contexte: {
      1712: `Dominique est officiellement une île neutre depuis 1660, quand France et Angleterre s'accordent pour la laisser aux Kalinago (Caribes) en échange de leur retrait des autres Petites Antilles. En pratique, l'accord est violé en douce : des coupeurs de bois français venus de Martinique et de Guadeloupe opèrent sur les franges côtières depuis le début du siècle, exploitant le bois précieux de l'île — l'une des plus boisées et des plus montagneuses des Antilles — sans jamais constituer de colonie organisée.

En 1712, la Dominique est un espace de marge. L'intérieur volcanique et couvert de forêts denses est un territoire kalinago souverain de fait. Le littoral, morcelé par des ravines et des falaises, accueille quelques établissements de bûcherons français, des déserteurs, des esclaves marrons venus des îles voisines, et des contrebandiers qui profitent de l'absence de toute autorité pour faire escale sans rendre de comptes.

Le Gaoulé de 1717 — le soulèvement des petits blancs martiniquais contre le gouverneur La Varenne — accélère le mouvement : nombre de ces "petits habitants" expulsés ou ruinés migrent vers le sud de la Dominique pour y établir de petits lopins. Les premiers établissements semi-permanents français datent de cette période (1715–1719), mais sans mandat officiel, sans garnison, sans administration. La France ne nommera un commandant à la Dominique qu'en 1727.`,
    },

    zone: [],

    capitale: '[Aucune — Roseau est un simple mouillage]',
    population_approx: '~2 000 à 3 000 Kalinago (estimation) ; quelques dizaines de colons et coupeurs de bois français',
    economie: 'Bois précieux (acajou, gaïac) ; commerce de troc avec les Kalinago ; refuge informel',
    /* note: '✅ Accord franco-britannique de 1660 : fait établi, confirmé par de multiples sources. ✅ Présence française de bûcherons depuis ~1690 : établi. ✅ Lien Gaoulé 1717 → migration vers Dominique : établi (sources Infogalactic, Global Security, Liquisearch). ⚠️ "Premiers établissements permanents 1715" : certaines sources avancent 1690, d\'autres 1715, d\'autres 1719. La fourchette 1715–1719 est retenue comme la plus cohérente pour la période de la campagne. ⚠️ Population kalinago : aucune donnée fiable pour 1712 — estimation basse retenue.', */
  },

  // ── SAINT-VINCENT ────────────────────────────────────────
  {
    id: 'saint-vincent-dominique',
    nom: 'Saint-Vincent et Bequia',

    puissance: {
      1712: 'conteste',
      // De jure neutre par l'accord de 1660. De facto : territoire kalinago, sans colons européens permanents.
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité européenne]',
        pnj_id: null,
        titre: 'Île neutre — territoire kalinago',
        // Pas d'administration coloniale jusqu'en 1719 (premier établissement français à Barrouallie).
      },
    },

    contexte: {
      1712: `Saint-Vincent est, en 1712, l'une des dernières îles des Petites Antilles où aucun Européen n'a réussi à s'établir durablement. L'accord franco-britannique de 1660 l'a laissée aux Kalinago, et les Kalinago l'ont défendue avec succès : toutes les tentatives de colonisation — espagnole, anglaise, française — se sont soldées par des défaites ou des abandons.

L'île abrite deux populations distinctes et souvent en tension : les Kalinago Rouges (ou "Jaunes"), autochtones de longue date, installés principalement sur la côte sous le vent ; et les Kalinago Noirs, ou Garifunas, issus du métissage entre Kalinago et Africains — esclaves évadés ou naufragés depuis la Barbade et d'autres îles, réfugiés à Saint-Vincent depuis le XVIIe siècle. Ces derniers sont plus nombreux, mieux armés, et occupent les hauteurs et la côte au vent. Les deux groupes coexistent avec méfiance, s'affrontent parfois, mais s'unissent contre toute menace européenne.

En 1712, Saint-Vincent est un espace absolument autonome. Les Européens y passent — pour faire de l'eau, échanger quelques marchandises — mais n'y restent pas. Les Garifunas tolèrent un commerce limité et refusent toute implantation permanente. Ce n'est qu'en 1719 que les Français parviennent à s'établir à Barrouallie, sur la côte sous le vent, avec l'accord forcé des Kalinago Rouges — lesquels cherchaient dans l'alliance française une protection contre les Garifunas.`,
    },

    zone: [],

    capitale: '[Aucune]',
    population_approx: '~3 000 à 5 000 Kalinago (Rouges et Noirs confondus) ; pas de colons permanents avant 1719',
    economie: 'Subsistance, pêche, chasse ; troc limité avec les navires de passage',
    /* note: '✅ Accord de 1660 et neutralité : établi. ✅ Présence des Kalinago Noirs (Garifunas) depuis le XVIIe s. : établi. ✅ Absence de colons permanents avant 1719 : sources concordantes (Wikipedia EN, Britannica, FamilySearch). ✅ Premier établissement français à Barrouallie, 1719 : établi. ⚠️ Population : aucune donnée fiable — estimation prudente. ⚠️ Détails sur les tensions Kalinago Rouges / Noirs en 1712 : bien attestés dans l\'historiographie (Craton, Black Caribs of St. Vincent), mais les sources sur la période exacte 1712–1719 sont minces.', */
  },

  // ── SAINTE-LUCIE ─────────────────────────────────────────
  {
    id: 'sainte-lucie',
    nom: 'Sainte-Lucie',

    puissance: {
      1712: 'conteste',
      // De facto française avec colons depuis 1651, mais sans statut formel établi.
      // L'Angleterre revendique l'île par traités mais ne l'occupe pas en 1712.
      // Neutre de jure par accord franco-britannique à partir de 1723.
    },

    gouverneur: {
      1712: {
        nom: '[Commandant ou intendant local non identifié]',
        pnj_id: null,
        titre: 'Commandant local (sans statut officiel)',
        // L'île relève nominalement de la Martinique (gouverneur général des Îles du Vent),
        // mais sans gouverneur particulier nommé. Les colons s'administrent en large autonomie.
      },
    },

    contexte: {
      1712: `Sainte-Lucie est "l'Hélène des Antilles" — l'île la plus disputée de la Caraïbe, qui changera quatorze fois de mains entre Français et Anglais. En 1712, elle est de facto française : des colons établis depuis 1651 y cultivent du tabac, du coton et de petites quantités de sucre. Castries (alors simple mouillage) et Vieux Fort constituent les deux points d'ancrage de cette population clairsemée.

Juridiquement, le statut de l'île est un imbroglio. Les Anglais la revendiquent par la charte Carlisle de 1627 et n'ont jamais renoncé à leurs droits. Les Français l'occupent de fait mais sans titre solide reconnu. Les Kalinago, qui ont écrasé les deux premières tentatives d'implantation anglaise (1605, 1639), sont encore présents dans l'intérieur montagneux, en retrait mais pas effacés. Cette situation tripartite — colons français, revendications anglaises, Kalinago dans les hauteurs — fait de Sainte-Lucie une zone de friction permanente.

En 1723, France et Angleterre s'entendront pour la déclarer officiellement neutre — reconnaissant ainsi leur incapacité à trancher. Pour la période 1712–1722, elle est un no man's land de facto français, mais sans garnison, sans gouverneur nommé, et accessible à quiconque sait négocier avec les habitants.`,
    },

    zone: [],

    capitale: 'Castries (simple mouillage en 1712)',
    population_approx: '~1 500 à 2 000 colons français (estimation) ; population kalinago résiduelle dans l\'intérieur',
    economie: 'Tabac, coton, vivres ; commerce d\'escale pour les navires en transit',
    /* note: '✅ Historique des occupations franco-anglaises : établi, sources nombreuses concordantes. ✅ Neutralité de jure en 1723 : établi (tableau liquisearch.com, cohérent avec d\'autres sources). ⚠️ Statut exact en 1712 : aucune source ne désigne un gouverneur ou commandant précis pour cette période — "commandant local non identifié" retenu. ⚠️ Population : aucune donnée fiable pour 1712 — estimation très basse retenue.', */
  },

  // ── GUADELOUPE ───────────────────────────────────────────
  {
    id: 'guadeloupe',
    nom: 'Guadeloupe',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      // Note structurelle : la Guadeloupe a son propre gouverneur PARTICULIER,
      // distinct du gouverneur général des Îles du Vent résidant en Martinique.
      // En cas d'absence ou de vacance du gouverneur général, le gouverneur de Guadeloupe
      // peut assurer l'intérim (La Malmaison l'a fait en 1713–1715).
      1712: {
        nom: 'Georges Robert Cloche de La Malmaison',
        pnj_id: null,
        titre: 'Gouverneur particulier de la Guadeloupe',
        // En poste depuis 1705. Mort en fonction le 1er mai 1717.
        // A assuré l'intérim du gouvernement général des Îles du Vent (oct. 1713 – janv. 1715),
        // entre le départ de Phélypeaux et l'arrivée de Duquesne-Guitton.
      },
      1717: {
        nom: 'Savinien-Michel de Lagarrigue de Savigny',
        pnj_id: null,
        titre: 'Gouverneur particulier de la Guadeloupe (intérim)',
        // Prend le commandement après le décès de La Malmaison (1er mai 1717).
        // Major de la Martinique promu lieutenant de roi en Guadeloupe — intérim jusqu'en mars 1718.
      },
      1718: {
        nom: 'Alexandre Vaultier de Moyencourt',
        pnj_id: null,
        titre: 'Gouverneur particulier de la Guadeloupe',
        // En poste du 18 mars 1718 à 1727.
        // Rappelé en France pour soupçons de contrebande.
        // Obtient dès son arrivée la permission d'acheter 50 esclaves dans les colonies anglaises
        // malgré l'interdiction formelle — premier acte révélateur de son style de gouvernement.
      },
    },

    contexte: {
      1712: `La Guadeloupe est administrée depuis Basse-Terre, sur la côte sous le vent de la Basse-Terre volcanique — la plus grande des deux terres qui composent l'île, séparées par la Rivière Salée. Grande-Terre, plus plate et plus sèche, est le cœur de l'économie sucrière. L'île produit du sucre, du cacao, du coton et du café, avec une main-d'œuvre servile qui représente la grande majorité de la population. Le commerce officiel s'effectue avec la France via Bordeaux et Nantes, mais le commerce interlope avec les Hollandais (Curaçao, Saint-Eustache) et les Anglais est endémique.

Le gouverneur La Malmaison est un administrateur tenace, en poste depuis 1705. Il a déjà survécu à la guerre de Succession d'Espagne et assuré l'intérim du gouvernement général des Îles du Vent pendant dix-sept mois (octobre 1713 – janvier 1715), entre le départ de Phélypeaux et l'arrivée de Duquesne-Guitton à la Martinique. Confirmation de son autorité : en août 1716, un décret royal lui reconnaît le commandement en chef des Îles du Vent en cas de mort ou d'absence du gouverneur général. Il meurt en fonction le 1er mai 1717, quelques jours avant le dénouement du Gaoulé martiniquais.`,
      1717: `La mort de La Malmaison laisse la Guadeloupe sans gouverneur titulaire pendant près d'un an. Lagarrigue de Savigny, major de la Martinique nommé lieutenant de roi en Guadeloupe le 20 septembre 1717, assure l'intérim dans une colonie secouée par les mêmes tensions commerciales et fiscales qui ont provoqué le Gaoulé en Martinique. Les colons guadeloupéens s'étaient eux aussi soulevés — de façon moins spectaculaire — contre les réformes de La Varenne au printemps 1717.`,
      1718: `Alexandre Vaultier de Moyencourt prend les rênes en mars 1718 et gouverne la Guadeloupe jusqu'en 1727. Son premier acte notable est d'obtenir l'autorisation d'acheter 50 esclaves dans les colonies anglaises voisines, en violation formelle des ordonnances commerciales françaises — signal d'un régime accommodant avec la contrebande. Il sera rappelé en France en 1727 précisément pour soupçons de commerce illicite.`,
    },

    zone: [],

    capitale: 'Basse-Terre',
    population_approx: '~25 000 habitants (1713, dont ~18 000 esclaves)',
    economie: 'Sucre, cacao, coton, café ; commerce interlope actif malgré les interdictions',
    /* note: '✅ La Malmaison : Wikipedia EN (article dédié), ANOM (correspondance de Guadeloupe), Chronologie de Guadeloupe (Wikipedia FR). ✅ Dates confirmées par au moins deux sources concordantes pour chaque gouverneur. ✅ Intérim des Îles du Vent (oct. 1713 – janv. 1715) : établi Wikipedia EN + ANOM. ✅ Lagarrigue de Savigny : ANOM (provisions de lieutenant de roi du 20 sept. 1717) + Unionpedia FR. ✅ Vaultier de Moyencourt : Chronologie de Guadeloupe (Wikipedia FR), date du 18 mars 1718 confirmée. ⚠️ La Malmaison est parfois appelé "Hemon Coinard de la Malmaison" dans les sources françaises — il s\'agit du même personnage (Georges Robert Cloche de Mont-Saint-Rémy de La Malmaison). Population : estimation composite, période.', */
  },

  // ── GRENADE ──────────────────────────────────────────────
  {
    id: 'grenade',
    nom: 'Grenade (et Grenadines)',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      1712: {
        nom: 'Guillaume-Emmanuel-Théodore de Maupeou, comte de l\'Estrange',
        pnj_id: null,
        titre: 'Gouverneur de la Grenade',
        // En poste de 1711 à 1716.
      },
      1717: {
        nom: 'Jean-Michel de Lépinay',
        pnj_id: null,
        titre: 'Gouverneur de la Grenade',
        // En poste de 1717 au 3 janvier 1721.
        // NB : Feuquières est mentionné par les ANOM comme "gouverneur de la Grenade en 1716"
        // avant de devenir gouverneur général des Îles du Vent en 1717 — passage transitoire
        // entre la fin du mandat de Maupeou et la prise de fonctions de Lépinay.
      },
    },

    contexte: {
      1712: `Colonie française depuis 1649, la Grenade est la plus méridionale des Petites Antilles françaises. Saint-George's (Fort Royal) est la capitale et le seul port notable. L'île produit du sucre, du cacao, de l'indigo et — fait remarquable pour la région — des épices : la muscade et le poivre qui feront plus tard sa réputation commencent à être cultivés. La Grenade relève du gouverneur général des Îles du Vent résidant à Fort-Royal en Martinique, mais son gouverneur particulier jouit d'une relative autonomie de fait, compte tenu de l'éloignement.

L'archipel des Grenadines — une centaine d'îlots et de cays entre Grenade et Saint-Vincent — est nominalement rattaché à la Grenade, mais sans administration effective. Ces îlots sont des refuges pour les pêcheurs, les naufragés, les contrebandiers et les pirates qui font escale sans rendre de comptes. Carriacou, la plus grande des Grenadines françaises, a quelques habitations mais pas de garnison.`,
      1717: `Jean-Michel de Lépinay prend le gouvernement en 1717 après une transition floue (Feuquières est passé brièvement par la Grenade avant d'être nommé gouverneur général des Îles du Vent). Lépinay administre une île en développement économique réel, mais exposée : la Grenade est la colonie française la plus proche de Trinidad et du Venezuela espagnols, et ses Grenadines sont un espace où toutes les juridictions se dissolvent. Les navires de commerce, les flibustiers et les contrebandiers y font escale librement.`,
    },

    zone: [],

    capitale: 'Saint-George\'s (Fort Royal)',
    population_approx: '~15 000 habitants (1713, dont ~11 000 esclaves)',
    economie: 'Sucre, cacao, indigo, épices naissantes (muscade) ; Grenadines : refuge et contrebande',
    /* note: '✅ Liste des gouverneurs : Wikipedia FR (Liste des gouverneurs coloniaux de la Grenade — source primaire liste exhaustive). ✅ Feuquières gouverneur de la Grenade en 1716, avant gouverneur général Îles du Vent : ANOM nominatif (source primaire). ⚠️ La transition Maupeou / Feuquières / Lépinay en 1716–1717 est une zone grise : Feuquières semble avoir occupé le poste très brièvement (quelques mois à tout au plus) sans que cela soit formellement documenté comme un mandat à part entière — on le note en commentaire plutôt qu\'en entrée gouverneur pour ne pas surcharger l\'affichage. ⚠️ Les Grenadines françaises (Carriacou, Petite Martinique, etc.) sont intégrées dans ce bloc faute de source permettant d\'en faire un bloc distinct.', */
  },

  // ── SAINT-CHRISTOPHE (SAINT-KITTS) ───────────────────────
  {
    id: 'saint-christophe',
    nom: 'Saint-Christophe (Saint-Kitts)',

    puissance: {
      1712: 'britannique',
      // Toute l'île est sous contrôle britannique de facto depuis la guerre de Succession d'Espagne,
      // mais la partie française n'est formellement cédée que par le traité d'Utrecht (1713).
    },

    gouverneur: {
      // Saint-Kitts n'a pas de gouverneur particulier distinct — elle relève directement
      // du gouverneur général des Leeward Islands résidant à Antigua.
      // Un commandant local (deputy governor) administre l'île au quotidien.
      1712: {
        nom: 'Walter Douglas',
        pnj_id: null,
        titre: 'Gouverneur général des Leeward Islands (résidence Antigua)',
        // En poste 1711–1716. Successeur de Daniel Parke, lynché en décembre 1710.
        // Douglas a monnayé la grâce royale accordée aux assassins de Parke :
        // 10 000 £ soutirées aux Antiguais avant de publier le pardon royal.
        // Condamné en Angleterre pour extorsion, révoqué.
      },
      1715: {
        nom: 'Walter Hamilton',
        pnj_id: null,
        titre: 'Gouverneur général des Leeward Islands (résidence Antigua)',
        // Second mandat 1715–1721. Intérim assuré par William Mathew Jr. en 1714–1715.
      },
    },

    contexte: {
      1712: `Saint-Christophe — Saint-Kitts pour les Anglais — est la plus ancienne colonie anglaise des Antilles, fondée en 1623 par Thomas Warner. Elle a une histoire singulière : l'île fut partagée pendant près de cent ans entre Anglais et Français, qui coexistaient difficilement sur leurs bandes côtières respectives pendant que les Kalinago contrôlaient l'intérieur. La guerre de Succession d'Espagne a mis fin à ce partage : les Britanniques ont pris le contrôle de toute l'île dès 1702, et le traité d'Utrecht (1713) en formalise la cession définitive par la France.

En 1712, les terres de l'ancienne partie française — les plus fertiles, celles du centre — sont en cours de redistribution. Les anciens colons français, expulsés ou partis d'eux-mêmes, ont laissé des habitations que les planteurs anglais s'empressent d'acquérir, souvent à vil prix. C'est une période de spéculation foncière intense autour du futur traité.

Brimstone Hill, la forteresse volcanique qui domine l'île, est le point défensif central — surnommé le "Gibraltar des Antilles". Basseterre est la capitale et le principal port.`,
      1713: `Le traité d'Utrecht (avril 1713) règle officiellement la question : la partie française de Saint-Kitts est cédée à la Grande-Bretagne. L'île est désormais entièrement britannique pour la première fois de son histoire coloniale. Les planteurs anglais achèvent de s'emparer des terres françaises abandonnées. La prospérité sucrière de l'île croît rapidement — Saint-Kitts devient l'une des colonies les plus productives des Leeward Islands.`,
    },

    zone: [],

    capitale: 'Basseterre',
    population_approx: '~20 000 habitants (1713, dont ~15 000 esclaves)',
    economie: 'Sucre, rhum — île parmi les plus productives des Antilles anglaises',
    /* note: '✅ Histoire de la partition franco-britannique et cession Utrecht : établi, sources multiples concordantes. ✅ Gouverneurs généraux : Wikipedia EN (List of governors of the Leeward Islands). ✅ Affaire Douglas / extorsion : Wikipedia EN (Walter Douglas), Historic St. Kitts. ✅ Assassinat de Parke (dec. 1710) : bien documenté, notamment Encyclopedia Virginia et Calendar of State Papers. ⚠️ Saint-Kitts n\'a pas de gouverneur particulier nommé séparément pour la période 1712–1720 — le gouverneur général des Leeward Islands fait autorité sur l\'ensemble. ⚠️ Intérim de William Mathew Jr. (1714–1715) : établi par la liste Wikipedia, non développé dans le contexte.', */
  },

  // ── LEEWARD ISLANDS (HORS SAINT-KITTS) ──────────────────
  {
    id: 'leeward-islands',
    nom: 'Leeward Islands (Antigua, Nevis, Montserrat, Anguilla, Barbuda)',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      // Gouverneur général commun à toutes les Leeward Islands, résidant à Antigua.
      // Même succession que pour Saint-Kitts (voir ce bloc).
      1712: {
        nom: 'Walter Douglas',
        pnj_id: null,
        titre: 'Gouverneur général des Leeward Islands',
        // Condamné pour extorsion, révoqué 1714–1716.
      },
      1715: {
        nom: 'Walter Hamilton',
        pnj_id: null,
        titre: 'Gouverneur général des Leeward Islands',
        // Second mandat 1715–1721.
      },
    },

    contexte: {
      1712: `Les Leeward Islands britanniques forment une colonie fédérée depuis 1671, administrée par un gouverneur général résidant à Antigua. Chaque île a un conseil local et un commandant ou lieutenant-gouverneur, mais sans législature autonome pour la période.

<strong>Antigua</strong> est le siège du gouvernement général et la plus prospère des îles du groupe. English Harbour, sur la côte sud, est la base navale principale de la Couronne dans les Petites Antilles — point de carénage et d'approvisionnement pour les frégates de la Royal Navy. La ville de Saint-John's est la capitale administrative. L'île produit du sucre en quantité croissante, exploité par une main-d'œuvre servile nombreuse. C'est ici que le gouverneur Daniel Parke a été lynché en décembre 1710 — événement encore frais dans les mémoires en 1712 — et que son successeur Douglas a monnayé le pardon royal des assassins.

<strong>Nevis</strong> était au XVIIe siècle la plus riche des îles du groupe, siège de facto du premier gouverneur général Stapleton qui y avait épousé et s'y était installé. Elle a depuis été dépassée par Antigua mais reste une île sucrière productive, avec Charlestown pour capitale.

<strong>Montserrat</strong> est une île plus modeste, à dominante irlandaise catholique — de nombreux colons irlandais y ont trouvé refuge depuis la Barbade au XVIIe siècle. La langue et les traditions irlandaises y sont encore vivaces. Plymouth est la seule ville notable. L'île a subi plusieurs raids français pendant la guerre de Succession (1710, 1711, 1712), tous repoussés.

<strong>Anguilla</strong> est une île quasi-abandonnée par les autorités coloniales : plate, aride, sans sucre, sans garnison, sans réelle administration. Elle survive grâce à la pêche, l'élevage de sel et la contrebande avec les îles voisines françaises et hollandaises. En juin 1720, le gouverneur Hamilton rapporte que plusieurs grands planteurs anguillais ont simplement quitté l'île pour Antigua, faute de perspective.

<strong>Barbuda</strong> est une dépendance d'Antigua, essentiellement réservée comme réserve naturelle et d'approvisionnement pour les Codrington — la grande famille de planteurs qui la détient à bail de la Couronne depuis 1685. Elle est peu peuplée et sans administration distincte.`,
    },

    zone: [],

    capitale: 'Saint-John\'s (Antigua) — siège du gouvernement général',
    population_approx: '~35 000 habitants pour l\'ensemble du groupe (1713, dont ~28 000 esclaves)',
    economie: 'Sucre (Antigua, Nevis), sel et pêche (Anguilla) ; base navale royale à English Harbour (Antigua)',
    /* note: '✅ Gouverneurs généraux : Wikipedia EN (List of governors of the Leeward Islands), sources concordantes. ✅ Affaire Parke (1710) : bien établie, Calendar of State Papers, Encyclopedia Virginia. ✅ Montserrat : raids français 1710–1712 établis (West India Committee, War of the Spanish Succession). ✅ Anguilla abandon 1720 : Calendar of State Papers Colonial (CO.152/13, Hamilton 14 juin 1720), cité dans Don Mitchell, The Leeward Islands. ✅ Barbuda / Codrington : établi. ⚠️ Ce bloc regroupe cinq entités distinctes dans un seul id — les zones SVG individuelles devront pointer vers ce même bloc, ou des blocs fils pourront être créés ultérieurement pour Antigua et Nevis si la campagne l\'exige.', */
  },

  // ── SAINT-THOMAS (ET SAINT-JOHN) ─────────────────────────
  {
    id: 'saint-thomas',
    nom: 'Saint-Thomas (et Saint-John)',

    puissance: {
      1712: 'danoise',
    },

    gouverneur: {
      1712: {
        nom: 'Mikkel Knudsen Crone',
        pnj_id: null,
        titre: 'Gouverneur de Saint-Thomas pour la Compagnie des Indes occidentales danoise',
        // En poste du 27 mars 1710 au 8 août 1716 (mort en fonction).
        // En 1715, il signale à Copenhague que les terres de Saint-Thomas s'épuisent
        // et que les planteurs cherchent à s'étendre vers Saint-John.
      },
      1716: {
        nom: 'Erik Bredal',
        pnj_id: null,
        titre: 'Gouverneur de Saint-Thomas pour la Compagnie des Indes occidentales danoise',
        // Élu gouverneur intérimaire le 12 août 1716 après la mort de Crone.
        // Nominé définitivement par Copenhague. En poste jusqu'en 1724.
        // En 1717, le gouverneur britannique Hamilton visite Saint-Thomas et avertit
        // les Danois de ne pas couper de bois sur Saint-John.
        // En 1718, colonise officiellement Saint-John malgré les objections anglaises.
      },
    },

    contexte: {
      1712: `Saint-Thomas est la colonie danoise des Caraïbes, administrée par la Compagnie des Indes occidentales danoise (Vestindisk Kompagni) depuis 1672. Charlotte Amalie — la ville portuaire organisée autour du Fort Christian — est l'un des ports francs les plus actifs des Petites Antilles : la tolérance danoise envers toutes les nationalités et tous les commerces en fait un hub du trafic interlope que ni les Anglais ni les Français ni les Espagnols n'arrivent à réguler depuis leurs propres colonies.

En 1712, Saint-Thomas est surtout une plaque tournante commerciale. Les esclaves africains y transitent vers les colonies espagnoles du continent ; les marchandises européennes et américaines y sont redistribuées sans trop de questions. La population blanche est mêlée — Danois, Hollandais, Anglais, Juifs séfarades — ce qui renforce son caractère de carrefour neutre. Les esclaves représentent plus des cinq sixièmes de la population totale.

Saint-John, île voisine, est en 1712 encore formellement non colonisée. Les terres de Saint-Thomas s'épuisant, des planteurs danois commencent à loucher sur Saint-John, mais la tension avec les Anglais (qui considèrent l'île dans leur zone d'influence) retient la Compagnie. Le gouverneur Bredal la colonisera finalement en 1718, déclenchant une friction diplomatique avec le gouverneur Hamilton des Leeward Islands.`,
    },

    zone: [],

    capitale: 'Charlotte Amalie (Fort Christian)',
    population_approx: '~3 600 habitants en 1715 (dont ~3 000 esclaves)',
    economie: 'Port franc, commerce interlope, transit négrier, sucre en production secondaire',
    /* note: '✅ Gouverneurs : Wikipedia EN (Mikkel Knudsen Crone, Erik Bredal). ✅ Colonisation Saint-John 1718 et tension avec Hamilton : St. John Historical Society. ✅ Population 1715 : Danish West Indies Wikipedia EN (chiffres de recensement). ⚠️ La puissance "danoise" n\'existe pas dans les PUISSANCES du fichier — utilisation temporaire de "hollandaise" par défaut ; à corriger en ajoutant une entrée "danoise" dans PUISSANCES.', */
  },

  // ── SAINTE-CROIX ─────────────────────────────────────────
  {
    id: 'sainte-croix',
    nom: 'Sainte-Croix',

    puissance: {
      1712: 'conteste',
      // Officiellement française (cession à la Couronne en 1674), mais abandonnée depuis 1696.
      // Île déserte en 1712 — ni gouverneur, ni colons, ni garnison.
      // Vendue au Danemark en 1733.
    },

    gouverneur: {
      1712: {
        nom: '[Île abandonnée — aucune autorité]',
        pnj_id: null,
        titre: 'Aucun gouverneur — île déserte',
        // La France a évacué l'île en 1696 pendant la guerre de la Ligue d'Augsbourg.
        // Entre 1696 et 1733, Sainte-Croix est formellement française mais sans présence.
      },
    },

    contexte: {
      1712: `Sainte-Croix est une île fantôme. Ancienne colonie française, elle a été évacuée en 1696 sur ordre de Louis XIV — trop exposée, trop difficile à défendre, trop coûteuse à maintenir dans le contexte de la guerre de la Ligue d'Augsbourg. Ses plantations, ses forts et ses maisons sont retournés à la végétation tropicale.

En 1712, l'île appartient formellement à la France — aucun traité ne l'a cédée — mais personne n'y réside en permanence. Des navires s'y arrêtent pour faire de l'eau douce, des naufragés y trouvent refuge provisoirement, et des buccaneers y ont établi des camps éphémères. L'Angleterre, le Brandebourg et le Danemark ont tous montré de l'intérêt pour l'île depuis son abandon, sans qu'aucun n'ait agi.

Ce vide juridique et humain durera jusqu'en 1733, quand la France conclura avec le Danemark un traité de vente pour 750 000 livres. Frederik Moth, gouverneur de Saint-Thomas, fondera alors Christiansted et fera de Sainte-Croix la colonie danoise la plus productive des Caraïbes.`,
    },

    zone: [],

    capitale: '[Aucune — île déserte en 1712]',
    population_approx: 'Zéro résidents permanents (1712–1733)',
    economie: 'Néant — anciens établissements à l\'abandon ; escale occasionnelle',
    /* note: '✅ Abandon 1696 et vente au Danemark 1733 : établi, sources nombreuses concordantes (Wikipedia EN Saint Croix, Heritage.vi, antillespressvi.com/sainte-croix). ✅ Statut "formellement française" : confirmé par la chronologie — aucun traité de cession avant 1733. ⚠️ La mention de visiteurs ou campements pirates 1696–1733 est vraisemblable mais non sourçable précisément.', */
  },

  // ── ÎLES VIERGES BRITANNIQUES ────────────────────────────
  {
    id: 'iles-vierges-britanniques',
    nom: 'Îles Vierges britanniques (Tortola, Virgin Gorda, Anegada)',

    puissance: {
      1712: 'britannique',
    },

    gouverneur: {
      1712: {
        nom: '[Commandant local non identifié]',
        pnj_id: null,
        titre: 'Dépendance des Leeward Islands — pas de gouverneur particulier',
        // Les Îles Vierges britanniques font partie de la colonie des Leeward Islands.
        // Elles ont un commandant local mais pas de gouverneur distinct pour la période.
      },
    },

    contexte: {
      1712: `Tortola, Virgin Gorda et Anegada sont les principales îles britanniques de l'archipel des Vierges, administrées comme dépendance des Leeward Islands depuis les années 1670. Tortola est la plus importante — quelques plantations de sucre, une petite population de colons anglais et d'esclaves, Road Town comme bourgade principale.

Ces îles sont en 1712 une périphérie négligée : trop petites, trop peu rentables, et trop proches des îles danoises et hollandaises pour être facilement contrôlées. Le gouverneur Hamilton des Leeward Islands doit en 1717 faire une tournée en man-of-war pour rappeler aux Danois que ces eaux sont britanniques. La frontière maritime avec Saint-Thomas danois et Saint-John est une zone de friction permanente et de commerce interlope actif.`,
    },

    zone: [],

    capitale: 'Road Town (Tortola)',
    population_approx: '~1 500 habitants (estimation, dont ~1 000 esclaves)',
    economie: 'Sucre (limité), commerce interlope avec Saint-Thomas danois',
    /* note: '⚠️ Pas de gouverneur particulier identifié pour les Îles Vierges britanniques en 1712–1720 : elles dépendent du gouverneur général des Leeward Islands. ⚠️ Population : estimation très approximative, aucune source directe pour la période.', */
  },

  // ── SAINT-MARTIN ─────────────────────────────────────────
  {
    id: 'saint-martin',
    nom: 'Saint-Martin / Sint Maarten',

    puissance: {
      1712: 'conteste',
      // Partagée franco-hollandaise depuis le traité de Concordia (23 mars 1648).
      // Partie nord : française (Saint-Martin). Partie sud : hollandaise (Sint Maarten).
      // La frontière a été contestée et franchie à de multiples reprises.
    },

    gouverneur: {
      1712: {
        nom: '[Commandants locaux non identifiés — deux autorités distinctes]',
        pnj_id: null,
        titre: 'Commandant français (nord) / Commandant hollandais (sud)',
        // La partie française dépend nominalement du gouverneur général des Îles du Vent.
        // La partie hollandaise dépend du commandant de Sint Eustatius (WIC).
        // L'île a changé de mains 16 fois au total — son statut réel en 1712 est stable
        // depuis le retour franco-hollandais après la guerre de Succession d'Espagne.
      },
    },

    contexte: {
      1712: `Saint-Martin est la seule île du monde partagée de façon permanente entre deux nations européennes depuis 1648. Le traité de Concordia a divisé l'île entre une partie française au nord et une partie hollandaise au sud, avec une frontière poreuse et sans fortification permanente entre les deux. La légende dit que la ligne a été tracée par deux marcheurs partant dos à dos — le Français, aidé par le vin, couvrant plus de terrain que le Hollandais et son genièvre.

En pratique, cette cohabitation est aussi tumultueuse que pacifique : l'île a changé de mains au rythme des guerres européennes, et la paix d'Utrecht (1713) stabilise temporairement les positions. L'économie repose sur le sel — les salines de la baie de Great Bay, côté hollandais, et celles de la baie d'Orient, côté français — ainsi que sur le sucre, le coton et une contrebande active avec les îles voisines. La proximité d'Anguilla (britannique, quasi abandonnée) au nord et de Saint-Barthélemy (française) à l'est facilite les échanges informels.`,
    },

    zone: [],

    capitale: 'Marigot (français, nord) / Philipsburg (hollandais, sud)',
    population_approx: '~3 000 habitants toutes parties confondues (estimation)',
    economie: 'Sel, sucre, coton ; contrebande entre les deux parties de l\'île',
    /* note: '✅ Traité de Concordia 1648 : établi. ✅ Structure administrative double (nord français / sud hollandais) : établi. ✅ Stabilisation après Utrecht 1713 : établi. ⚠️ Commandants locaux en 1712 : non identifiés dans les sources consultées. ⚠️ Population : estimation composite très approximative.', */
  },

  // ── SABA ET SAINT-EUSTACHE ───────────────────────────────
  {
    id: 'saba-statia',
    nom: 'Saba et Saint-Eustache (Sint Eustatius)',

    puissance: {
      1712: 'hollandaise',
    },

    gouverneur: {
      1712: {
        nom: '[Commandant non identifié pour 1712–1719]',
        pnj_id: null,
        titre: 'Commandant de Sint Eustatius (et dépendances Saba, Sint Maarten) — WIC',
        // Les trois îles (Sint Eustatius, Saba, Sint Maarten) sont sous un commandant unique
        // stationné à Sint Eustatius depuis 1678.
      },
      1719: {
        nom: 'J. Stalperts',
        pnj_id: null,
        titre: 'Commandant de Sint Eustatius pour la WIC',
        // Identifié dans la liste des gouverneurs de Sint Eustatius, Saba et Sint Maarten (Wikipedia EN).
        // En poste 1719–1720.
      },
    },

    contexte: {
      1712: `Sint Eustatius — "Statia" pour ses habitants — est la plaque tournante commerciale hollandaise du nord des Petites Antilles. Oranjestad est son port, et malgré la petite taille de l'île (21 km²), son volume de commerce est disproportionné : elle redistribue marchandises, esclaves et denrées entre les colonies anglaises, françaises et espagnoles voisines sans trop regarder les pavillons ni les licences. Sa future réputation de "Rocher d'Or" (Golden Rock) est déjà en germe.

Saba, voisine, est une île-volcan quasi inaccessible — des falaises abruptes sans plage praticable, une seule route qui sera construite bien plus tard. En 1712, ses habitants (quelques dizaines de familles hollandaises et anglaises) vivent de pêche, de dentelle et d'un commerce limité avec Statia. L'île a une réputation de refuge pour contrebandiers et déserteurs qui profitent de son isolement naturel.

Les deux îles dépendent administrativement du commandant de Statia, lui-même subordonné à la WIC d'Amsterdam.`,
    },

    zone: [],

    capitale: 'Oranjestad (Sint Eustatius) — The Bottom (Saba)',
    population_approx: '~2 000 habitants (Sint Eustatius) ; ~300 habitants (Saba)',
    economie: 'Commerce interlope et transit (Sint Eustatius) ; pêche et contrebande (Saba)',
    /* note: '✅ Structure administrative (commandant unique pour Sint Eustatius, Saba, Sint Maarten) : établi, Wikipedia EN (Governors of Sint Eustatius, Saba and Sint Maarten) + Sue Travels / BES Islands. ✅ J. Stalperts 1719–1720 : Wikipedia EN. ⚠️ Commandant pour 1712–1719 : non identifié dans les sources consultées — la liste Wikipedia saute de noms non datés précisément à Stalperts 1719.', */
  },

  // ── SAINT-BARTHÉLEMY ─────────────────────────────────────
  {
    id: 'saint-barth',
    nom: 'Saint-Barthélemy',

    puissance: {
      1712: 'francaise',
    },

    gouverneur: {
      1712: {
        nom: '[Commandant ou lieutenant local non identifié]',
        pnj_id: null,
        titre: 'Dépendance de la Guadeloupe — pas de gouverneur particulier',
        // Saint-Barthélemy dépend nominalement du gouverneur général des Îles du Vent
        // via la Guadeloupe. Pas d'autorité locale distincte pour la période.
      },
    },

    contexte: {
      1712: `Saint-Barthélemy est une petite île rocheuse et sèche, colonisée par des Français depuis 1648. Gustavia (future capitale suédoise après 1784) n'existe pas encore — l'île a quelques habitations dispersées, une petite population de colons blancs d'origine normande et bretonne très attachés à leur autonomie, et peu de ressources agricoles. L'aridité du sol limite les plantations. Le port naturel est fréquenté mais pas formellement développé.

En 1712, Saint-Barth est une dépendance marginale, rattachée à la Guadeloupe et au gouvernement général des Îles du Vent. Elle survivra longtemps dans l'oubli administratif jusqu'à sa cession à la Suède en 1784 — qui en fera un port franc prospère.`,
    },

    zone: [],

    capitale: '[Aucune ville — quelques habitations dispersées]',
    population_approx: '~700 habitants (estimation, majorité blanche pauvre)',
    economie: 'Pêche, petit élevage, commerce de passage limité',
    /* note: '⚠️ Peu de sources disponibles pour Saint-Barthélemy 1712 spécifiquement. Statut comme dépendance des Îles du Vent : établi. Cession à la Suède 1784 : établi. La population blanche d\'origine normande/bretonne est un trait documenté de l\'historiographie ultérieure. Population : estimation.', */
  },

  // ── TOBAGO ───────────────────────────────────────────────
  {
    id: 'tobago',
    nom: 'Tobago',

    puissance: {
      1712: 'conteste',
      // Revendiquée par la France et l'Angleterre depuis la fin du XVIIe siècle.
      // Sans colons permanents ni garnison en 1712 — île de facto abandonnée.
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité constituée]',
        pnj_id: null,
        titre: 'Île sans administration — contestée et non colonisée',
        // La France et l'Angleterre se disputent Tobago mais aucune n'y maintient de présence.
        // L'île sera déclarée formellement neutre par le traité d'Aix-la-Chapelle (1748).
      },
    },

    contexte: {
      1712: `Tobago est l'une des îles les plus disputées des Caraïbes, et en 1712, l'une des plus vides. Son histoire est un catalogue d'échecs coloniaux : Hollandais, Courlanders (Lettons), Anglais, Français se sont succédé sur l'île sans jamais y établir quoi que ce soit de durable. La dernière tentative sérieuse — hollandaise — s'est soldée par une destruction et un abandon en 1677. Depuis lors, Tobago appartient à tout le monde et à personne.

La France et l'Angleterre se la revendiquent toutes les deux par traités interposés, mais aucune ne l'occupe. Elle sert de mouillage d'opportunité pour les navires en transit entre Trinidad et les Petites Antilles, et de refuge discret pour des équipages qui préfèrent éviter les ports contrôlés. Sa baie de Courland (côté ouest) et sa baie de Man of War (côté est) sont connues des marins de toute la région.

L'île restera dans ce vide juridique jusqu'au traité d'Aix-la-Chapelle (1748) qui la déclare formellement neutre — avant que les Anglais ne l'occupent définitivement après 1763.`,
    },

    zone: [],

    capitale: '[Aucune — Scarborough est une baie, pas encore une ville]',
    population_approx: 'Zéro résidents permanents (1712)',
    economie: 'Néant — mouillage d\'opportunité, bois sur pied non exploité',
    /* note: '✅ Histoire des colonisations successives et abandon : établi, sources nombreuses concordantes (Wikipedia EN History of Tobago, Caribbean Beat, Colonial Voyage). ✅ Tobago déclarée neutre en 1748 (Aix-la-Chapelle) : établi. ✅ Situation en 1712 : île sans administration ni résidents permanents. ⚠️ L\'utilisation de Tobago comme mouillage en 1712 est vraisemblable mais non spécifiquement documentée pour cette date précise.', */
  },

  // ── ÎLES DE LA BAIE (ROATAN) ─────────────────────────────
  {
    id: 'iles-de-la-baie',
    nom: 'Îles de la Baie (Roatan, Utila, Guanaja)',

    puissance: {
      1712: 'conteste',
      // Revendiquées par l'Espagne (Honduras), mais sans présence effective.
      // Fréquentées par des coupeurs de bois anglais de Belize et des flibustiers.
    },

    gouverneur: {
      1712: {
        nom: '[Aucune autorité constituée]',
        pnj_id: null,
        titre: 'Territoire contesté — pas d\'administration',
        // L'Espagne revendique la souveraineté mais n'y maintient aucune garnison après 1650.
        // Des bûcherons anglais venus de Belize y opèrent de façon informelle.
      },
    },

    contexte: {
      1712: `Les Îles de la Baie — Roatan, Utila, Guanaja — sont en 1712 dans le même vide que Tobago : revendiquées, abandonnées, fréquentées de façon informelle. L'Espagne les considère comme territoire hondurien depuis la conquête, mais après avoir chassé les derniers colons anglais en 1650 elle n'y a plus maintenu de présence effective. Le vide a été rapidement rempli par des bûcherons anglais venus du Belize (Honduras britannique en gestation), des flibustiers cherchant un mouillage discret, et des équipages en transit entre la Jamaïque et la Terre Ferme espagnole.

Port Royal, sur la côte sud de Roatan, est la baie la plus fréquentée — Henry Morgan y est passé en 1665, et sa réputation de refuge s'est perpetuée. En 1712, les îles servent de point de ravitaillement en eau douce et de cache pour des opérations que personne ne souhaite faire voir. L'Espagne proteste régulièrement à Londres contre la présence de coupeurs de bois anglais, sans grand effet.`,
    },

    zone: [],

    capitale: '[Aucune — Port Royal est un mouillage, pas une ville]',
    population_approx: 'Quelques dizaines de bûcherons et flibustiers de passage',
    economie: 'Bois de campêche (logwood), refuge pirate, approvisionnement en eau douce',
    note: `Les Îles de la Baie (Roatan, Utila, Guanaja et îles adjacentes) sont nominalement espagnoles mais sans garnison permanente en 1712. Les Anglais y maintiennent une présence informelle de coupeurs de bois depuis les années 1640 ; les Indiens Misquitos, alliés aux Britanniques, y circulent librement.
<br>
Îles et bancs associés à mentionner dans cette zone :
<br>
— Serrana et Serranilla : deux bancs coralliens quasi-inhabités au centre de la mer des Caraïbes, entre la Jamaïque et le Nicaragua. Nominalement espagnols, sans présence permanente. Points de pêche à la tortue et mouillages de fortune pour les navires pirates et les boucaniers.
<br>
— Swan Islands (St Millan sur la carte) : deux petits îlots au nord-ouest des Îles de la Baie. Même statut — espagnol nominal, fréquentés par les boucaniers anglais pour l'eau douce et les tortues. La localisation sur la carte est approximative ; la zone est mal connue des cartographes de l'époque.`,
  },
  /* note: 'Sources : Marcus (1975), <em>The Evolution of the Caribbean Settlement Patterns</em> ; Olien (1983), <em>The Miskito Kings and the Line of Succession</em>. ✅ Histoire de la colonisation anglaise et expulsion espagnole (1650) : établi (Wikipedia EN Bay Islands Department, Britannica). ✅ Fréquentation informelle par bûcherons anglais de Belize : établi. ✅ Port Royal comme mouillage historique : établi (Roatan.day, Coconut Tree Divers). ⚠️ Situation précise en 1712 : pas de sources primaires directes — "quelques bûcherons et flibustiers de passage" est inféré de la continuité documentée avant et après cette date.`, */

  {
    id: 'providence',
    nom: 'Providence (Old Providence) & San Andrés',

    puissance: {
      1712: 'espagnole',
    },

    gouverneur: {
      1712: {
        nom: '[Aucune garnison permanente]',
        pnj_id: null,
        titre: 'Nominalement sous la Capitainerie générale du Guatemala',
      },
    },

    contexte: {
      1712: `Old Providence — <em>Isla de Providencia</em> — est une île volcanique de 18 km², entourée d'un massif récif corallien qui en rend l'approche difficile à qui n'en connaît pas les passes. Sa voisine Santa Catalina, séparée par un bras de mer étroit artificiellement creusé par les premiers colons anglais entre 1635 et 1641, forme avec elle un ensemble naturellement défendable.

L'histoire de Providence est celle d'un double échec colonial et d'une mémoire pirate tenace. En 1629, la Providence Island Company — un consortium de Puritains anglais — y fonde une colonie qui se rêve en modèle godly mais glisse rapidement vers la course : les colons arment des corsaires contre les galions espagnols depuis ce poste idéalement placé "à la gueule de l'empire espagnol" en Amérique centrale. Les Espagnols reprennent l'île par la force en 1641, massacrant ou dispersant les colons. Henry Morgan l'utilise comme base d'opérations dans les années 1660 pour ses raids sur Panama et le littoral espagnol. Les Espagnols reprennent définitivement l'île en 1670.

En 1712, Providence est nominalement espagnole mais sans garnison permanente. Ses ruines anglaises — forts, jetées, vestiges de New Westminster — sont encore debout, et ses passes connues des seuls initiés en font un refuge discret pour les navires qui cherchent à éviter les routes surveillées. San Andrés, voisine au sud-ouest, est dans la même situation : revendiquée par l'Espagne, fréquentée par les Anglais, sans présence permanente d'aucune puissance.`,
    },

    zone: [],

    capitale: 'Aucune — île sans administration permanente',
    population_approx: 'Quasi-nulle (quelques pêcheurs saisonniers, équipages en escale)',
    economie: 'Pêche à la tortue, eau douce (ressource rare dans les Caraïbes), mouillage discret',
    /* note: `✅ Établi : colonie anglaise 1629–1641 (Providence Island Company, Karen Ordahl Kupperman, 1993) ; prise espagnole 1641 et 1670 ; usage par Henry Morgan comme base dans les années 1660 (documenté).
✅ Établi : sans garnison espagnole permanente en 1712 — les Espagnols revendiquent la souveraineté sans l'exercer.
🎲 Fiction de campagne : les ruines de New Westminster et les forts de Santa Catalina comme décor utilisable. La connaissance des passes coralliennes comme avantage tactique pour les pirates.
Rattachement administratif nominal : Capitainerie générale du Guatemala. San Andrés inclus dans ce bloc — même statut, même histoire.`, */
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
