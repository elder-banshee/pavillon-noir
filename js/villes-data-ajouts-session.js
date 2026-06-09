// ═══════════════════════════════════════════════════════════
// ENTRÉES PRÉPARÉES — Session du 2025-06-04
// Fichier intermédiaire — À relire avant insertion dans villes-data.js
//
// Conventions note_mj : ✅ établi · ⚠️ incertain/estimé · 🎲 fiction de campagne
// Coordonnées : toutes à null — à renseigner sur la carte
// Types : 'port' · 'ville' · 'fort' · 'site' (nouveau — lieux sans établissement permanent)
// ═══════════════════════════════════════════════════════════

const VILLES_AJOUTS = [

// ═══════════════════════════════════════════════════════════
// SÉRIE SURINAME / GUYANE HOLLANDAISE
// ═══════════════════════════════════════════════════════════

// ── 102. NIEUW MIDDELBURG + FORT NIEUW ZEELAND ───────────────────────────────

    {
        id: 'nieuw-middelburg',
        nom: 'Nieuw Middelburg',
        label: 'N. Middelburg',
        type: 'port',
        rang: '2',
        territoire: 'suriname',
        coords: [7817, 4513],
        // ⚠️ Sur le fleuve Pomeroon (Poumaron sur la Jaillot), côte de la
        // Guyane hollandaise occidentale — géographiquement dans ce qui est
        // aujourd'hui le Guyana, mais dans le bloc cartographique Suriname.
        // Un fort associé, Fort Nieuw Zeeland, est indiqué en amont sur le
        // même fleuve — distinct du Fort Zeelandia de Paramaribo ("Fort Funda"
        // sur la Jaillot).

        contexte: [
            {
                de: 1712,
                texte: `Établissement hollandais sur le fleuve Pomeroon, dans la zone de la colonie d'Essequibo — l'une des trois colonies hollandaises de Guyane avec Berbice et Suriname, administrées séparément sous l'autorité de la Compagnie des Indes occidentales (WIC). Nieuw Middelburg est un comptoir de plantation et de commerce avec les nations indiennes arawaks de l'arrière-pays, défendu en amont par le Fort Nieuw Zeeland.
<br><br>
La région porte sur la Jaillot la mention "<em>Suriname, aux Anglois et Hollandois</em>" — reflet d'une réalité de 1712 : la côte entre l'embouchure de l'Orénoque et celle de l'Essequibo est partiellement occupée par des planteurs anglais installés sous protection hollandaise, et par des postes hollandais dont la souveraineté reste contestée. Les Anglais ont officiellement cédé le Suriname aux Hollandais en 1667 (traité de Breda) en échange de la Nouvelle-Amsterdam (New York) — mais des planteurs anglais y sont restés.`,
            },
        ],

        population: `Quelques centaines d'habitants — planteurs, engagés, esclaves africains`,

        garnison: `Fort Nieuw Zeeland (en amont sur le Pomeroon) : quelques dizaines de soldats. Estimation par analogie avec les petits postes de la WIC en Guyane.`,

        note_mj: `✅ Colonies hollandaises d'Essequibo, Berbice, Suriname — trois entités distinctes sous la WIC : établi.
✅ Traité de Breda 1667, échange Suriname contre Nouvelle-Amsterdam : établi.
✅ Présence anglaise résiduelle au Suriname après 1667 : établi — de nombreux planteurs anglais sont restés malgré le changement de souveraineté.
⚠️ Nieuw Middelburg sur le Pomeroon : établissement documenté dans les archives de la WIC, détails précis pour 1712 peu accessibles.
⚠️ Fort Nieuw Zeeland : distinct du Fort Zeelandia de Paramaribo ("Fort Funda" sur la Jaillot) — même nom, deux forts différents.`,
    },

// ── 103. FORT KYK-OVER-AL ────────────────────────────────────────────────────

    {
        id: 'fort-kyk-over-al',
        nom: 'Fort Kyk-Over-Al',
        label: 'Fort Kyck Overal',
        type: 'fort',
        rang: '2',
        territoire: 'suriname',
        coords: [7824, 4602],
        // ⚠️ Sur un îlot au confluent de l'Essequibo et du Mazaruni,
        // dans ce qui est aujourd'hui le Guyana — dans le bloc cartographique
        // Suriname de la Jaillot.

        contexte: [
            {
                de: 1712,
                texte: `Premier fort hollandais de Guyane, fondé en 1616 sur un îlot rocheux au confluent de l'Essequibo et du Mazaruni — position qui lui vaut son nom : <em>Kyk-Over-Al</em>, "regarde partout" en hollandais. Du haut de ses murs, la vue porte sur les trois cours d'eau qui convergent au même point. Le fort est la tête de la colonie d'Essequibo depuis près d'un siècle : c'est depuis ici que les marchands hollandais organisent le commerce avec les nations arawaks de l'intérieur — coton, rocou, bois de teinture contre haches, couteaux et perles de verre.
<br><br>
En 1712, le fort est en service mais son rôle décline : les plantations côtières de cacao et de sucre, plus accessibles et plus rentables, déplacent le centre de gravité de la colonie vers l'aval. Kyk-Over-Al reste un symbole et une position de surveillance, mais les grandes décisions de la colonie se prennent désormais plus près de la côte.`,
            },
        ],

        garnison: `~30 à 50 soldats. Estimation d'après Hartsinck, <em>Beschryving van Guiana</em> (1770) — source postérieure mais couvrant l'histoire coloniale de la période.`,

        note_mj: `✅ Fondation 1616, position au confluent Essequibo–Mazaruni : établi (Hartsinck, 1770 ; Wikipedia EN, Fort Kyk-Over-Al).
✅ Nom hollandais "Kyk-Over-Al" — vue panoramique sur les trois confluents : établi.
✅ Rôle central dans la colonie d'Essequibo depuis le XVIIe siècle : établi.
⚠️ Garnison en 1712 : estimation — Hartsinck donne des données générales, pas des effectifs précis par année.`,
    },

// ── 104. VILLAGES DU DELTA (MARAWALLI, MAPUETA, MACHARIBI, VAPERON) ──────────

    {
        id: 'villages-delta-suriname',
        nom: 'Villages du delta surinamais',
        label: 'Marawalli · Mapueta · Macharibi · Vaperon',
        type: 'site',
        rang: '2',
        territoire: 'suriname',
        coords: [7975, 4691],
        // ⚠️ Quatre villages arawaks ou caribs représentés sur la Jaillot
        // dans le delta du Suriname et des fleuves voisins.
        // Identifications approximatives :
        // · Marawalli → probablement sur le Marowijne (Maroni) ou un distributaire
        // · Mapueta → probablement sur le Coppename ou le Saramacca
        // · Macharibi → non identifié, fleuve occidental du Suriname
        // · Vaperon → pourrait correspondre à Warapicou ou village carib du bas Maroni

        contexte: [
            {
                de: 1712,
                texte: `Villages arawaks et caribs dans le delta surinamais et sur les fleuves côtiers de la Guyane hollandaise. Ces communautés indigènes sont les intermédiaires indispensables du commerce hollandais avec l'intérieur : elles fournissent vivres, pirogues, guides et informations sur les routes fluviales vers les forêts de l'arrière-pays. Les marchands de Paramaribo et d'Essequibo entretiennent avec elles des relations commerciales stables depuis plusieurs générations — échanges de coton, de rocou et de bois contre outils de métal, perles et eau-de-vie.
<br><br>
Ces mêmes villages sont aussi des refuges potentiels pour les esclaves marrons qui fuient les plantations hollandaises — tension permanente que les autorités de Paramaribo tentent de gérer en maintenant des traités distincts avec chaque communauté. La guerre des Marrons qui absorbe une part croissante des ressources militaires de la colonie oppose précisément les Hollandais aux esclaves fugitifs qui ont trouvé refuge dans la forêt avec l'aide, parfois, de ces villages côtiers.`,
            },
        ],

        note_mj: `⚠️ Identifications individuelles incertaines — noms translittérés approximativement par les cartographes hollandais puis français. Les quatre toponymes correspondent à des villages réels en 1712 mais leur identification précise avec des lieux actuels est hasardeuse.
✅ Rôle des communautés arawaks et caribs comme intermédiaires commerciaux dans la colonie d'Essequibo et du Suriname : établi (Price, <em>Maroon Societies</em>, 1973).
✅ Guerre des Marrons et tensions avec les villages indigènes côtiers : établi.`,
    },

// ── 105. MATUNERE MONTAGNES (TUMUC-HUMAC) ────────────────────────────────────

    {
        id: 'matunere-montagnes',
        nom: 'Matunere Montagnes (Tumuc-Humac)',
        label: 'Matunere Montagnes',
        type: 'site',
        rang: '2',
        territoire: 'suriname',
        coords: [7618, 4967],
        // ⚠️ Massif à la frontière entre le Suriname, la Guyane française
        // et le Brésil. La Jaillot les place comme limite méridionale du
        // Suriname — au-delà commence la "Guiane" sans établissement.

        contexte: [
            {
                de: 1712,
                texte: `Massif montagneux formant la ligne de partage des eaux entre les fleuves côtiers du Suriname au nord et les affluents de l'Amazone au sud — frontière naturelle entre le monde connu des colonies hollandaises et la forêt amazonienne inexplorée. Les Hollandais n'ont jamais franchi ces montagnes ; les Amérindiens qui les habitent — Tiriyós, Wayanas — n'ont jamais été contactés par les Européens. Au-delà commence la <em>Guiane</em> que la Jaillot représente comme un blanc sur la carte, sans nom ni établissement.
<br><br>
C'est depuis ces hauteurs que naissent les fleuves où les esclaves marrons du Suriname établissent leurs communautés autonomes — Saramaka, Ndyuka — à l'abri des expéditions militaires hollandaises qui peinent à pénétrer dans ces forêts.`,
            },
        ],

        note_mj: `✅ Tumuc-Humac comme ligne de partage des eaux Suriname–Amazone : établi géographiquement.
✅ Communautés marrons (Saramaka, Ndyuka) dans les fleuves intérieurs du Suriname : établi (Price, <em>Maroon Societies</em>, 1973).
✅ Tiriyós et Wayanas dans les hauteurs — non contactés par les Européens en 1712 : établi.
La "Guiane" au sud des Matunere est hors carte pour les établissements — Cayenne est hors cadre de la Jaillot.`,
    },

// ═══════════════════════════════════════════════════════════
// BILAN FINAL — Territoires continentaux complets
// Total : 105 entrées nouvelles
// + 3 corrections dans villes-data.js
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SÉRIE SITES GÉOGRAPHIQUES MAJEURS
// ═══════════════════════════════════════════════════════════

// ── 109. ORÉNOQUE ────────────────────────────────────────────────────────────

    {
        id: 'orenoque',
        nom: "Orénoque",
        label: "Orenoque",
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7509, 4356],

        contexte: [
            {
                de: 1712,
                texte: `Le troisième plus grand fleuve d'Amérique du Sud, dont le delta s'ouvre sur l'Atlantique entre Trinidad et la côte de la Nouvelle-Andalousie. L'Orénoque est le fleuve de tous les mythes : c'est en le remontant que Walter Raleigh a cherché El Dorado en 1595, convaincu que la cité de Manoa se cachait quelque part dans ses méandres. Le récit de son expédition — <em>The Discoverie of the Large, Rich, and Bewtiful Empyre of Guiana</em> — a alimenté deux siècles de fantasmes européens sur l'or caché de l'Amérique du Sud.
<br><br>
En 1712, l'Orénoque reste largement inconnu au-delà de son cours inférieur. Les missions jésuites et capucines ont établi quelques postes sur ses rives, mais les nations indiennes de l'intérieur — Achaguas, Sálivas, Guahibos — maintiennent une indépendance de fait que les Espagnols n'ont pas les moyens de contester. Le fleuve communique avec l'Amazone via le canal naturel du Casiquiare — une connexion que les Européens soupçonnent mais n'ont pas encore cartographiée en 1712.`,
            },
        ],

        note_mj: `✅ Expédition Raleigh 1595, <em>Discoverie of Guiana</em> : établi.
✅ Canal du Casiquiare reliant Orénoque et Amazone : établi géographiquement — confirmé par Humboldt en 1800, soupçonné mais non cartographié avant cette date.
✅ Missions jésuites sur l'Orénoque inférieur en 1712 : établi.`,
    },

// ── 110. MISSISSIPPI ─────────────────────────────────────────────────────────

    {
        id: 'mississippi',
        nom: 'Mississippi (Río del Espíritu Santo)',
        label: 'Mississippi',
        type: 'site',
        rang: '2',
        territoire: 'louisiane',
        coords: [1070, 1021] ,
        // ⚠️ La Jaillot désigne le Mississippi "Río del Espíritu Santo" —
        // nom espagnol traditionnel. Le nom "Mississippi" (de la nation Ojibwé)
        // est utilisé par les Français depuis La Salle (1682).

        contexte: [
            {
                de: 1712,
                texte: `Le plus long fleuve d'Amérique du Nord, dont l'embouchure en delta dans le golfe du Mexique constitue l'enjeu géopolitique central de la Louisiane française. La Salle a descendu le Mississippi jusqu'à son embouchure en 1682 et pris possession de toute la vallée au nom de Louis XIV — acte fondateur de la Louisiane, qui prétend s'étendre depuis les Grands Lacs jusqu'au golfe et couper en deux les possessions espagnoles du continent.
<br><br>
En 1712, le cours inférieur du fleuve est partiellement connu des Français de Mobile. La Nouvelle-Orléans n'existe pas encore — elle sera fondée par Bienville en 1718 sur un méandre à quelques kilomètres du lac Pontchartrain. Les nations indiennes des rives — Natchez, Illinois, Quapaw — entretiennent des relations commerciales et militaires avec les Français, sans pour autant accepter leur autorité.`,
            },
        ],

        note_mj: `✅ Descente de La Salle jusqu'à l'embouchure en 1682, prise de possession de la Louisiane : établi.
✅ Fondation de La Nouvelle-Orléans en 1718 : établi — voir entrée 'la-nouvelle-orleans'.
✅ Nations indiennes des rives (Natchez, Illinois, Quapaw) : établi.
⚠️ Cours supérieur encore mal connu des Européens en 1712 : établi.`,
    },


// ── 111. VOLCÁN DE AGUA (GUATEMALA) ──────────────────────────────────────────

    {
        id: 'volcan-agua',
        nom: 'Volcán de Agua',
        label: 'Vulcan',
        type: 'site',
        rang: '2',
        territoire: 'guatemala',
        coords: [1757, 3329],
        // ⚠️ La Jaillot indique simplement "Vulcan" à proximité de Santiago
        // de Guatemala. Le Volcán de Agua (3 760 m) est le plus proche de la
        // capitale et le plus chargé d'histoire — c'est lui qui a détruit la
        // première capitale en 1541.

        contexte: [
            {
                de: 1712,
                texte: `Stratovolcan de 3 760 mètres dominant la vallée de Panchoy au sud-est de Santiago de Guatemala — visible depuis la capitale et depuis toute la plaine environnante. Le Volcán de Agua doit son nom à la catastrophe de 1541 : un séisme a fissuré le cratère, libérant le lac d'eau accumulé au sommet et déclenchant une coulée de boue et de débris qui a englouti la première capitale du Guatemala (Ciudad Vieja) en quelques minutes, tuant plusieurs centaines de personnes dont Beatriz de la Cueva, gouverneure depuis deux jours seulement.
<br><br>
En 1712, le Volcán de Agua est inactif depuis la catastrophe de 1541 — mais ses voisins, le Fuego et l'Acatenango, fument régulièrement. La population de Santiago vit sous le regard de ces trois volcans, habituée aux tremblements de terre qui secouent la vallée plusieurs fois par an.`,
            },
        ],

        note_mj: `✅ Catastrophe de 1541, destruction de Ciudad Vieja par coulée de débris : établi.
✅ Beatriz de la Cueva, gouverneure tuée dans la catastrophe : établi.
✅ Volcán de Agua inactif depuis 1541 ; Fuego actif : établi.
✅ Volcán de Fuego et Acatenango visibles depuis Santiago : établi.`,
    },

// ── 113. SIERRA NEVADA DE SANTA MARTA ────────────────────────────────────────

    {
        id: 'sierra-nevada-santa-marta',
        nom: 'Sierra Nevada de Santa Marta',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5225, 3958],

        contexte: [
            {
                de: 1712,
                texte: `Le massif le plus haut du monde directement accessible depuis la mer — ses sommets jumeaux, le Pico Cristóbal Colón et le Pico Simón Bolívar, culminent à 5 775 mètres à moins de 50 kilomètres de la côte Caraïbe. Leurs neiges éternelles sont visibles depuis la mer à plus de 150 kilomètres, par temps clair, depuis les navires naviguant entre Carthagène et Riohacha. Pour tout marin longeant la côte néogrenadine, la Sierra Nevada est l'amers de navigation le plus fiable et le plus spectaculaire des Caraïbes — une muraille de neige au-dessus d'une côte tropicale.
<br><br>
La Sierra abrite les Kogi, les Arhuaco et les Wiwa — nations indiennes qui ont fui vers les hauteurs lors de la conquête et maintenu leur indépendance depuis deux siècles. Aucune expédition espagnole n'a jamais soumis durablement ces communautés de montagne. Les versants inférieurs portent des plantations de cacao et quelques haciendas créoles, mais au-dessus de 2 000 mètres, l'autorité coloniale cède à celle des nations indigènes.`,
            },
        ],

        note_mj: `✅ Sierra Nevada de Santa Marta — plus haut massif côtier du monde (5 775 m à ~50 km de la mer) : établi.
✅ Visibilité depuis la mer à plus de 150 km : établi — repère de navigation historique.
✅ Résistance des Kogi, Arhuaco, Wiwa à la colonisation espagnole depuis le XVIe siècle : établi.
🎲 Pour un navigateur entrant dans la Caraïbe depuis l'est, apercevoir les neiges de la Sierra Nevada au-dessus de la ligne de côte tropicale est un moment saisissant — et un point de positionnement fiable avant l'arrivée à Riohacha ou Santa Marta.`,
    },

// ── 114. CARET BAY (DARIÉN) ──────────────────────────────────────────────────

    {
        id: 'caret-bay',
        nom: 'Caret Bay (golfe d\'Urabá)',
        label: 'Caret Bay',
        type: 'site',
        rang: '2',
        territoire: 'panama',
        coords: [4472, 4614],
        // ⚠️ Le golfe d'Urabá s'enfonce si profondément dans les terres
        // qu'il constitue une route maritime intérieure vers le Darién —
        // traitement analogue à un fleuve plutôt qu'à une baie ouverte.

        contexte: [
            {
                de: 1712,
                texte: `Vaste golfe s'enfonçant profondément dans les terres du Darién — accessible depuis la mer des Caraïbes mais si encaissé qu'il constitue une route maritime intérieure vers le cœur de l'isthme. Le golfe d'Urabá est connu des pirates et des flibustiers comme voie d'accès discrète vers le Darién, loin des garnisons de Portobelo et de Carthagène.
<br><br>
C'est sur ces rives que Balboa a fondé Santa María la Antigua del Darién en 1510 — premier établissement permanent du continent. C'est aussi ici que la Compagnie d'Écosse a tenté d'établir sa colonie de Caledonia en 1698–1700, sur la côte orientale du golfe — catastrophe humaine dont le souvenir est encore vif en 1712. Les Kunas de l'intérieur connaissent chaque crique de ces rives et se méfient de tout navire étranger qui s'aventure dans le golfe.`,
            },
        ],

        note_mj: `✅ Golfe d'Urabá comme route maritime intérieure vers le Darién : établi géographiquement.
✅ Fondation de Santa María la Antigua del Darién en 1510 sur ces rives : établi — voir entrée 'santa-maria-darien'.
✅ Colonie écossaise de Caledonia en 1698–1700 sur la côte du golfe : établi.
✅ Résistance des Kunas dans le Darién : établi.
🎲 Un navire qui entre dans Caret Bay s'engage dans un cul-de-sac entouré de jungle et de Kunas — entrée facile, sortie beaucoup moins.`,
    },

// ═══════════════════════════════════════════════════════════
// BILAN FINAL — Territoires continentaux + sites majeurs
// Total : 114 entrées nouvelles
// + 3 corrections dans villes-data.js
// + 1 correction interne (mombacho / momotombo)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SÉRIE GRANDES ANTILLES + SITES PETITES ANTILLES
// ═══════════════════════════════════════════════════════════

// ── 115. SANTA CRUZ DEL NORTE (CUBA) ─────────────────────────────────────────

    {
        id: 'santa-cruz-cuba',
        nom: 'Santa Cruz del Norte',
        label: 'Santa Cruz',
        type: 'ville',
        rang: '2',
        territoire: 'cuba',
        coords: [3845, 2076],
        // ⚠️ Côte nord de Cuba, à l'est de La Havane.

        contexte: [
            {
                de: 1712,
                texte: `Bourg côtier sur la côte nord de Cuba, à l'est de La Havane. Santa Cruz del Norte est une escale sur la navigation côtière entre La Havane et Santiago — un point de relâche pour les navires qui longent la côte cubaine, avec un abri modeste et des provisions. La région produit du tabac et de la mélasse ; quelques petits ingenios (moulins à sucre) commencent à s'établir dans l'arrière-pays.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ Santa Cruz del Norte : identification d'après la position sur la Jaillot (côte nord, à l'est de La Havane). Peu documenté pour 1712 spécifiquement.
⚠️ Population : estimation.`,
    },

// ── 116. ÎLES CAÏMANS ──────────────────────────────────────────────────────── !!!

    {
        id: 'iles-caimans',
        nom: 'Îles Caïmans',
        label: 'Îles Caïmans',
        type: 'site',
        rang: '2',
        territoire: 'cuba',
        // ⚠️ Territoire: 'cuba' par défaut — les Caïmans relèvent nominalement
        // de l'Espagne (traité de Madrid 1670) mais sont sans administration.
        coords: null,

        contexte: [
            {
                de: 1712,
                texte: `Trois îles basses — Grand Cayman, Little Cayman, Cayman Brac — situées au sud-ouest de Cuba et au nord-ouest de la Jamaïque. Non colonisées de façon permanente, elles appartiennent nominalement à l'Espagne depuis le traité de Madrid de 1670, mais aucune garnison ni aucun colon ne s'y trouve. Ce sont les tortues qui attirent les visiteurs : les eaux des Caïmans abritent des populations de tortues vertes (<em>Chelonia mydas</em>) extraordinairement denses, exploitées depuis un siècle par des "turtlers" jamaïcains qui viennent y capturer des centaines d'animaux à chaque saison. La tortue verte est la viande fraîche la plus précieuse de la Caraïbe — elle se conserve vivante à bord plusieurs semaines, et nourrit les équipages de toute la région.
<br><br>
Les Caïmans sont aussi un mouillage discret entre Cuba et la Jamaïque, à l'écart des routes patrouillées par les guarda costas espagnols. Tout navire qui veut passer inaperçu entre les deux îles connaît cet archipel.`,
            },
        ],

        note_mj: `✅ Turtlers jamaïcains aux Caïmans, tortues vertes comme ressource alimentaire majeure : établi (Sluyter, <em>Black Ranching Frontiers</em>, 2012).
✅ Traité de Madrid 1670, souveraineté espagnole nominale : établi.
✅ Absence de colonisation permanente en 1712 : établi.
🎲 Escale idéale pour un navire qui veut éviter les contrôles — eau douce disponible sur Grand Cayman, viande fraîche garantie.`,
    },

// ── 117. SANCTI SPÍRITUS ─────────────────────────────────────────────────────

    {
        id: 'sancti-spiritus',
        nom: 'Sancti Spíritus',
        label: 'Sta Spirito',
        type: 'ville',
        rang: '2',
        territoire: 'cuba',
        coords: [4149, 2370],

        contexte: [
            {
                de: 1712,
                texte: `L'une des sept villas fondées par Diego Velázquez lors de la conquête de Cuba (1514), dans les plaines du centre de l'île. Sancti Spíritus est une ville agricole tranquille — élevage extensif, culture du tabac, quelques petits moulins à sucre — loin des turbulences des ports de La Havane et de Santiago. Sa position à mi-chemin entre les deux extrémités de l'île en fait un relais commercial sur la route terrestre qui traverse Cuba d'ouest en est.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Fondation 1514 par Diego Velázquez, l'une des sept villas originelles de Cuba : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 118. MANZANILLO ──────────────────────────────────────────────────────────

    {
        id: 'mancanilla-cuba',
        nom: 'Manzanillo',
        label: 'Mancanilla',
        type: 'port',
        rang: '2',
        territoire: 'cuba',
        coords: [4556, 2500],

        contexte: [
            {
                de: 1712,
                texte: `Port modeste sur la côte méridionale de Cuba orientale, dans le golfe de Guacanayabo. Manzanillo est un port de cabotage actif malgré sa taille réduite — sa position sur la côte méridionale cubaine en fait une escale sur la route entre Santiago de Cuba et La Havane par le sud, et un point de contact commercial avec les boucaniers et les marchands de Saint-Domingue français à travers le canal du Vent. Le commerce interlope avec la partie française d'Hispaniola y est structurel.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `✅ Manzanillo sur la côte méridionale de Cuba, commerce avec Saint-Domingue : cohérent avec les sources sur le commerce interlope cubain.
⚠️ Population en 1712 : estimation.`,
    },


// ── 119. PORT-SAINT-MARC (HISPANIOLA FRANÇAISE) ───────────────────────────────

    {
        id: 'port-saint-marc',
        nom: 'Port-Saint-Marc',
        label: "Port d'Guanives ou Port St Marco",
        type: 'port',
        rang: '2',
        territoire: 'saint-domingue',
        coords: [5348, 2634],

        contexte: [
            {
                de: 1712,
                texte: `Port sur la côte ouest d'Hispaniola, dans la baie de la Gonâve, au nord du golfe de la Gonâve. La double dénomination de la Jaillot — "Port de Guanives ou Port Saint-Marc" — reflète la transition entre l'ancien nom taïno de la baie (Guanives) et le nom français en cours d'imposition. Port-Saint-Marc est en 1712 un port secondaire de Saint-Domingue, moins actif que Port-de-Paix ou Léogâne mais utile comme escale sur la côte occidentale — sucre et indigo de l'arrière-pays immédiat commencent à transiter par ses quais.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `✅ Double toponymie Guanives / Port-Saint-Marc : reflet documenté de la transition coloniale.
⚠️ Population en 1712 : estimation — Port-Saint-Marc est encore peu développé à cette date.`,
    },

// ── 120. MONTE CRISTI ────────────────────────────────────────────────────────

    {
        id: 'monte-cristi',
        nom: 'Monte Cristi',
        label: 'Monte Christo',
        type: 'port',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [5685, 2532],
        // ⚠️ Monte Cristi est sur la côte nord-ouest d'Hispaniola, dans la
        // partie espagnole — mais c'est une zone de tension avec les boucaniers
        // français depuis des décennies. La frontière dans ce secteur est floue
        // en pratique en 1712.

        contexte: [
            {
                de: 1712,
                texte: `Port de la côte nord-ouest d'Hispaniola, dans la partie espagnole — mais si proche de la frontière française que son identité coloniale est équivoque. Monte Cristi est depuis longtemps un point de contact et de friction entre les boucaniers français de Tortue et les autorités espagnoles de Santo Domingo. La ville a été dévastée lors des <em>devastaciones</em> ordonnées par Madrid en 1605–1606 — les Espagnols ont délibérément brûlé les villes du nord d'Hispaniola pour priver les interlopes hollandais et français de bases commerciales. Elle s'est lentement repeuplée depuis, mais reste modeste.
<br><br>
Le Morne de Monte Cristi — un piton calcaire caractéristique visible depuis la mer — est l'amers de navigation le plus connu de la côte nord-ouest d'Hispaniola.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Devastaciones de 1605–1606, destruction délibérée des villes du nord d'Hispaniola : établi.
✅ Morne de Monte Cristi comme repère de navigation : établi.
✅ Zone de friction franco-espagnole sur la frontière nord-ouest : établi pour la période 1650–1697 ; en 1712, la frontière est fixée par Ryswick mais peu surveillée.
⚠️ Population en 1712 : estimation — la ville se relève lentement des devastaciones.`,
    },

// ── 121. LA ISABELA ──────────────────────────────────────────────────────────

    {
        id: 'la-isabela',
        nom: 'La Isabela',
        type: 'site',
        rang: '3',
        territoire: 'santo-domingo',
        coords: [5774, 2539],

        contexte: [
            {
                de: 1712,
                texte: `Ruines du premier établissement européen permanent des Amériques, fondé par Christophe Colomb en janvier 1493 sur la côte nord d'Hispaniola — quelques semaines après son premier débarquement à Guanahani. La Isabela a été abandonnée dès 1498, trop exposée aux maladies et trop éloignée des mines d'or du Cibao. Colomb lui-même l'a désertée pour fonder Santo Domingo sur la côte méridionale.
<br><br>
En 1712, il ne reste que quelques pans de murs envahis par la végétation sur un promontoire côtier — mais le nom figure encore sur toutes les cartes par tradition. Pour un navigateur cultivé qui longe la côte nord d'Hispaniola, aborder à La Isabela c'est fouler le premier sol colonisé d'un continent entier.`,
            },
        ],

        note_mj: `✅ Fondation en janvier 1493 par Colomb, premier établissement permanent des Amériques : établi.
✅ Abandon dès 1498 au profit de Santo Domingo : établi.
État en 1712 : ruines côtières, site non habité — présent sur les cartes par tradition cartographique.`,
    },

// ── 122. XARAGUA (HISPANIOLA FRANÇAISE) ──────────────────────────────────────

    {
        id: 'xaragua',
        nom: 'Xaragua',
        label: 'Xanagua',
        type: 'site',
        rang: '3',
        territoire: 'saint-domingue',
        coords: [5378, 2732],
        // ⚠️ Xaragua est un nom historique taïno — le territoire du cacique
        // Anacaona, dans le sud-ouest d'Hispaniola. En 1712, cette zone est
        // française (Les Cayes, Léogâne). La Jaillot de 1708 peut encore
        // porter ce nom par tradition cartographique.

        contexte: [
            {
                de: 1712,
                texte: `Nom historique du territoire taïno du sud-ouest d'Hispaniola — le caciquat d'Anacaona, la "Fleur d'Or", reine poète qui régna sur Xaragua à la fin du XVe siècle. En 1503, le gouverneur Nicolás de Ovando a convié Anacaona et ses chefs à un festin de paix avant de les massacrer ou de les pendre — l'un des épisodes les plus brutaux de la conquête d'Hispaniola, qui a durablement marqué la mémoire locale.
<br><br>
En 1712, "Xaragua" n'est plus qu'un souvenir cartographique : la région est peuplée de colons français et d'esclaves africains cultivant le sucre et l'indigo dans les plaines des Cayes. Le nom taïno survit sur les cartes anciennes comme trace d'un monde effacé.`,
            },
        ],

        note_mj: `✅ Caciquat de Xaragua, reine Anacaona : établi (Las Casas, <em>Brevísima Relación</em>).
✅ Massacre d'Anacaona par Ovando en 1503 : établi.
✅ Zone française en 1712 malgré la représentation espagnole sur la Jaillot de 1708 : la frontière de Ryswick (1697) place le sud-ouest dans la colonie française — la Jaillot peut être en retard sur cette réalité.`,
    },

// ── 123. AZUA / SAVANA ───────────────────────────────────────────────────────

    {
        id: 'savana',
        nom: 'Cavaillon (Savana)',
        label: 'Savana',
        type: 'ville',
        rang: '2',
        territoire: 'saint-domingue',
        coords: [5236, 2851],
        // ⚠️ La Jaillot (1708) place ce lieu côté espagnol, mais la position
        // au nord de l'Île-à-Vache ("I. Vaca") est sans ambiguïté française
        // en 1712. Correspond à la zone de Cavaillon / Les Cayes /
        // Saint-Louis-du-Sud sur la côte méridionale de Saint-Domingue français.
        // La Jaillot est en retard sur la frontière réelle issue de Ryswick (1697).

        contexte: [
            {
                de: 1712,
                texte: `Bourg de la côte méridionale de Saint-Domingue, au nord de l'Île-à-Vache — l'île où Morgan a hiverné en 1668–1669 avant son raid sur Maracaibo, et qui lui a servi de base pour organiser ses expéditions. La côte méridionale française est en 1712 moins développée que la côte nord (Cap-Français, Port-de-Paix), mais ses plaines commencent à attirer des colons : sucre, indigo et coton y poussent dans les vallées irriguées par les rivières descendant des montagnes du sud. La région correspond à l'actuelle zone des Cayes — qui deviendra au XVIIIe siècle l'une des plaines sucrières les plus productives de l'île.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `⚠️ Identification avec Cavaillon / zone des Cayes : probable d'après la position au nord de l'Île-à-Vache. La Jaillot (1708) place ce lieu côté espagnol — erreur cartographique ou retard sur la frontière de Ryswick (1697). Territoire corrigé en 'saint-domingue' pour la campagne (1712).
✅ Île-à-Vache comme base de Morgan en 1668–1669 : établi (Exquemelin).
⚠️ Population : estimation.`,
    },


// ── 124. YAQUIMO ─────────────────────────────────────────────────────────────

    {
        id: 'yaquimo',
        nom: 'Yaquimo (Jacmel)',
        label: 'Yaquimo',
        type: 'port',
        rang: '2',
        territoire: 'saint-domingue',
        coords: [5393, 2884],
        // ⚠️ La Jaillot (1708) place Yaquimo côté espagnol, mais correspond
        // sans ambiguïté à Jacmel (arrondissement de Jacmel) — côté français
        // en 1712. Même décalage cartographique que pour Cavaillon/Savana :
        // la Jaillot est en retard sur la frontière de Ryswick (1697).

        contexte: [
            {
                de: 1712,
                texte: `Port de la côte méridionale de Saint-Domingue, dont le nom taïno — Yaquimo — rappelle l'occupation précolombienne. La baie de Jacmel est l'un des meilleurs mouillages naturels de la côte sud d'Hispaniola : bien abritée, accessible, avec de l'eau douce disponible. En 1712, c'est un port secondaire de la colonie française, moins actif que Port-de-Paix ou Léogâne mais dont la rade accueille les navires de commerce régionaux et quelques corsaires qui préfèrent la discrétion de la côte méridionale à l'animation du nord. Le café et le coton de l'arrière-pays commencent à transiter par ses quais.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Identification de Yaquimo avec Jacmel : sans ambiguïté d'après la position sur la Jaillot.
⚠️ La Jaillot (1708) place Yaquimo côté espagnol — erreur cartographique corrigée : territoire 'saint-domingue' retenu pour la campagne (1712).
⚠️ Population : estimation.`,
    },

// ── 125. SAN JUAN DE LA MAGUANA ──────────────────────────────────────────────

    {
        id: 'maguana',
        nom: 'San Juan de la Maguana',
        label: 'Maguana',
        type: 'ville',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [5657, 2691],

        contexte: [
            {
                de: 1712,
                texte: `Ville de l'intérieur d'Hispaniola, dans la vallée centrale entre les deux chaînes de montagnes qui traversent l'île. San Juan de la Maguana occupe le site d'un ancien caciquat taïno — Maguana était l'un des cinq grands caciquats de l'île avant la conquête. La ville espagnole fondée sur ce site vit de l'élevage extensif dans la vallée fertile et d'un commerce modeste avec Santo Domingo. L'éloignement des côtes la préserve des raids pirates mais l'isole aussi des circuits commerciaux.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Maguana comme ancien caciquat taïno, l'un des cinq grands caciquats d'Hispaniola : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 126. LA CONCEPCIÓN DE LA VEGA ────────────────────────────────────────────

    {
        id: 'conception-vega',
        nom: 'La Concepción de la Vega',
        label: 'Conception',
        type: 'ville',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [5846, 2656],

        contexte: [
            {
                de: 1712,
                texte: `Ville du Cibao, dans la grande plaine centrale d'Hispaniola — la région la plus fertile de l'île. Fondée par Colomb en 1494, La Vega est l'une des plus anciennes villes européennes des Amériques. Elle a été détruite par un séisme en 1562 et reconstruite quelques kilomètres plus loin — la "Vega Vieja" en ruines est encore visible. La plaine du Cibao produit du tabac, du cacao et des vivres ; La Vega en est le centre de redistribution vers Santo Domingo.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation par Colomb en 1494 : établi.
✅ Séisme de 1562 et reconstruction : établi.
✅ Vega Vieja (ruines) distincte de la ville reconstruite : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 127. SANTIAGO DE LOS CABALLEROS ──────────────────────────────────────────

    {
        id: 'santiago-hispaniola',
        nom: 'Santiago de los Caballeros',
        label: 'St Iago',
        type: 'ville',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [5798, 2588],

        contexte: [
            {
                de: 1712,
                texte: `Principale ville du Cibao et deuxième ville de la colonie espagnole d'Hispaniola, sur la rive du río Yaque del Norte. Fondée en 1495, elle doit son nom aux nobles espagnols (<em>caballeros</em>) qui l'ont établie. Santiago est le centre du commerce du tabac du Cibao — la région produit les feuilles les plus prisées de l'île, exportées vers l'Espagne et, par contrebande, vers les colonies anglaises et françaises voisines. La ville est aussi un nœud routier : les chemins vers Monte Cristi au nord, La Vega au sud et Santo Domingo à l'est convergent ici.`,
            },
        ],

        population: `~6 000 habitants`,

        note_mj: `✅ Fondation 1495, tabac du Cibao : établi.
✅ Commerce interlope du tabac avec colonies anglaises et françaises : établi (Moya Pons, <em>Historia del Caribe</em>).
⚠️ Population en 1712 : estimation.`,
    },

// ── 128. SEIBO / HIGÜEY / SABANA DE HIGÜEY ───────────────────────────────────

    {
        id: 'huguey',
        nom: 'Higüey (El Seibo, Sabana de Higüey)',
        label: 'Huguey',
        type: 'ville',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [6054, 2779],
        // ⚠️ La Jaillot place 4 noms pour 3 symboles dans le sud-est d'Hispaniola.
        // Identification :
        // · Syrbo → El Seibo, bourg de l'est de l'île
        // · Hibona → Higüey (ville), fondée 1502
        // · Sabialeonde + Huguey → deux noms pour un même symbole :
        //   "Sabana de Higüey" (la plaine) + "Higüey" (la ville)

        contexte: [
            {
                de: 1712,
                texte: `La région orientale d'Hispaniola regroupe plusieurs bourgs dans la plaine de Higüey et ses environs. <strong>Higüey</strong> (fondée en 1502) est le centre religieux de la région — sa basilique Notre-Dame d'Altagracia, bâtie sur le site d'une apparition mariale, est le principal lieu de pèlerinage d'Hispaniola. <strong>El Seibo</strong>, bourg voisin, est un centre d'élevage dans les plaines orientales. La <strong>Sabana de Higüey</strong> — grande plaine côtière au sud — est un territoire d'élevage extensif, les plus grands hatos de l'est de l'île s'y trouvant. Juan Ponce de León, qui partira à la conquête de Porto Rico en 1508 puis cherchera la Fontaine de Jouvence en Floride, était gouverneur de cette région.`,
            },
        ],

        population: `~5 000 habitants pour l'ensemble de la région`,

        note_mj: `✅ Basilique d'Altagracia à Higüey, lieu de pèlerinage : établi.
✅ Juan Ponce de León comme gouverneur de la région de Higüey avant Porto Rico : établi.
⚠️ La Jaillot dédouble Higüey en "Hibona" (ville) et "Sabialeonde/Huguey" (plaine + ville) — confusion cartographique par superposition de deux noms pour le même lieu.
⚠️ Population : estimation pour l'ensemble de la zone.`,
    },

// ── 129. HATO DEL CABALLERO ──────────────────────────────────────────────────

    {
        id: 'ocoa',
        nom: 'San José de Ocoa',
        label: 'Ocoa',
        type: 'ville',
        rang: '2',
        territoire: 'santo-domingo',
        coords: [5634, 2797],
        // ⚠️ La Jaillot indique "Hastio de Dom. Cavalgero" comme annotation
        // de propriété (un hato appartenant à un notable) à proximité du
        // nom de ville "Ocoa". C'est Ocoa qui est le nom de l'établissement.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de la vallée d'Ocoa, dans les contreforts méridionaux de la cordillère centrale d'Hispaniola — le nom "Hato de Dom Cavalgero" visible sur la carte désigne la propriété d'un notable local, non la ville elle-même. La vallée d'Ocoa est une zone d'élevage extensif — les hatos sont la structure économique dominante de la colonie espagnole d'Hispaniola — d'immenses propriétés d'élevage extensif de bovins et de porcs, dont les cuirs et les graisses sont exportés vers l'Espagne. Les propriétaires de hatos constituent l'oligarchie créole de Santo Domingo ; leurs propriétés couvrent des dizaines de milliers d'hectares. Ocoa est un bourg agricole de l'intérieur, loin des circuits commerciaux côtiers.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ "Hastio de Dom. Cavalgero" sur la Jaillot est une annotation de propriété foncière (hato d'un don Caballero), pas le nom de la ville.<br>✅ Hatos comme structure économique dominante de Santo Domingo : établi (Moya Pons).<br>⚠️ Population : estimation.`,
    },

// ── 130. SAN GERMÁN (PORTO RICO) ─────────────────────────────────────────────

    {
        id: 'san-german',
        nom: 'San Germán',
        label: 'St German',
        type: 'ville',
        rang: '2',
        territoire: 'porto-rico',
        coords: [6408, 2749],

        contexte: [
            {
                de: 1712,
                texte: `Deuxième ville de Porto Rico, fondée en 1511 à l'extrémité occidentale de l'île. San Germán a été déplacée plusieurs fois avant de trouver son emplacement définitif dans les collines de l'ouest — chaque version précédente ayant été détruite par des raids de Carib ou de flibustiers. En 1712, c'est une ville tranquille de l'intérieur, sur les hauteurs qui dominent la côte méridionale. La région produit du sucre, du coton et du gingembre. San Germán abrite le couvent de Porta Coeli (1609), l'un des plus anciens d'Amérique encore debout.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Fondation 1511, déplacements multiples dus aux raids : établi.
✅ Couvent de Porta Coeli (1609) : établi — toujours debout aujourd'hui.
⚠️ Population en 1712 : estimation.`,
    },


// ═══════════════════════════════════════════════════════════
// SITES DES PETITES ANTILLES
// ═══════════════════════════════════════════════════════════

// ── 131. LA SOUFRIÈRE (GUADELOUPE) ───────────────────────────────────────────

    {
        id: 'soufriere-guadeloupe',
        nom: 'La Soufrière (Guadeloupe)',
        label: 'La Soufrière',
        type: 'site',
        rang: '2',
        territoire: 'guadeloupe',
        coords: [7249, 3088],

        contexte: [
            {
                de: 1712,
                texte: `Volcan actif dominant la Basse-Terre de la Guadeloupe depuis 1 467 mètres — le point culminant de l'arc des petites Antilles. La Soufrière est un repère de navigation incontournable : sa silhouette fumante est visible depuis la mer à grande distance, et son panache de soufre se sent par vent favorable bien avant de voir la côte. L'éruption de 1690 est dans toutes les mémoires — elle a couvert l'île de cendres et provoqué des tremblements de terre qui ont endommagé les habitations. En 1712, le volcan est en activité fumerolienne permanente, avec des épisodes de grondements et de projections de gaz qui agitent périodiquement la population de Basse-Terre.`,
            },
        ],

        note_mj: `✅ La Soufrière, plus haut sommet de l'arc antillais (1 467 m), volcan actif : établi.
✅ Éruption de 1690 : établie dans les sources historiques guadeloupéennes.
✅ Activité fumerolienne permanente : établi.
🎲 Un navire qui approche de la Guadeloupe par le sud reconnaît d'abord le panache de la Soufrière avant de voir la côte — repère d'approche fiable par tous les temps.`,
    },

// ── 132. MORNE DIABLOTIN (DOMINIQUE) ─────────────────────────────────────────

    {
        id: 'morne-diablotin',
        nom: 'Morne Diablotin',
        type: 'site',
        rang: '2',
        territoire: 'dominique',
        coords: [7295, 3169],

        contexte: [
            {
                de: 1712,
                texte: `Plus haut sommet des petites Antilles (1 447 mètres), dominant l'île de la Dominique depuis son extrémité nord. Le Morne Diablotin est visible depuis la mer à très grande distance — depuis la Guadeloupe au nord comme depuis la Martinique au sud, par temps dégagé. Pour les navigateurs des petites Antilles, c'est le principal amers de la chaîne insulaire entre Porto Rico et Sainte-Lucie : son profil caractéristique permet de situer la Dominique sans ambiguïté, et donc de corriger sa route dans l'arc antillais.
<br><br>
L'île de la Dominique est en 1712 sous contrôle nominal français mais en réalité habitée principalement par les Kalinagos (Carib) — la seule île des petites Antilles que les Européens n'ont pas réussi à coloniser durablement. Le traité de 1660 entre France, Angleterre et Carib a théoriquement réservé la Dominique et Saint-Vincent aux Kalinagos, mais des colons français s'y sont installés malgré tout sur les côtes.`,
            },
        ],

        note_mj: `✅ Morne Diablotin (1 447 m), point culminant des petites Antilles : établi.
✅ Dominique comme île kalinago — traité de 1660 : établi.
✅ Rôle de repère de navigation dans l'arc antillais : établi par les sources de navigation de l'époque.`,
    },

// ── 133. LA PELÉE (MARTINIQUE) ────────────────────────────────────────────────

    {
        id: 'montagne-pelee',
        nom: 'Montagne Pelée',
        label: 'La Pelée',
        type: 'site',
        rang: '2',
        territoire: 'martinique',
        coords: [7322, 3267],

        contexte: [
            {
                de: 1712,
                texte: `Volcan actif dominant le nord de la Martinique depuis 1 397 mètres. La Montagne Pelée est en 1712 un volcan qui fume par intermittence — des colonnes de vapeur et de soufre s'échappent du cratère, visibles depuis Fort-Royal et depuis les navires au large. Les habitants de Saint-Pierre, au pied du volcan, vivent depuis un siècle avec ce voisinage volcanique sans que jamais une éruption majeure ne se soit produite. Le volcan est considéré comme un repère et une curiosité plutôt que comme une menace réelle.
<br><br>
Cette tranquillité prendra fin le 8 mai 1902, lorsqu'une nuée ardente détruira Saint-Pierre en quelques minutes et tuera 30 000 personnes — la pire éruption volcanique de l'histoire moderne. En 1712, rien ne laisse présager cette catastrophe.`,
            },
        ],

        note_mj: `✅ Montagne Pelée, volcan dominant le nord de la Martinique : établi.
✅ Activité fumerolienne en 1712 : probable — le volcan a des épisodes d'activité modérée tout au long de la période coloniale.
✅ Éruption de 1902 et destruction de Saint-Pierre : établi — hors période mais connue des joueurs.
🎲 Un joueur qui connaît 1902 et visite Saint-Pierre en 1712 a une connaissance que son personnage n'a pas — tension narrative intéressante.`,
    },

// ── 134. LA SOUFRIÈRE (SAINT-VINCENT) ────────────────────────────────────────

    {
        id: 'soufriere-saint-vincent',
        nom: 'La Soufrière (Saint-Vincent)',
        label: 'La Soufrière',
        type: 'site',
        rang: '2',
        territoire: 'saint-vincent',
        coords: [7342, 3549],
        // ⚠️ À ne pas confondre avec la Soufrière de Guadeloupe
        // (id: 'soufriere-guadeloupe').

        contexte: [
            {
                de: 1712,
                texte: `Volcan actif dominant le nord de Saint-Vincent depuis 1 234 mètres. En 1718, une éruption majeure modifiera significativement le paysage du nord de l'île — en 1712, des signes précurseurs sont probablement perceptibles : fumerolles, grondements souterrains, sources chaudes. Saint-Vincent est en 1712 une île à dominante kalinago (Carib), partiellement fréquentée par des colons français clandestins mais sans présence coloniale établie. La Soufrière domine une île sauvage et peu connue des Européens en dehors des boucaniers et des marins qui en longent les côtes.`,
            },
        ],

        note_mj: `✅ Éruption de la Soufrière de Saint-Vincent en 1718 : établi — dans la période de jeu.
✅ Saint-Vincent comme île kalinago en 1712, sans présence coloniale établie : établi.
⚠️ Activité précurseur avant 1718 : probable mais non documentée précisément.
À ne pas confondre avec la Soufrière de Guadeloupe.`,
    },

// ═══════════════════════════════════════════════════════════
// BILAN FINAL ABSOLU — Session du 2025-06-04
// Total : 134 entrées nouvelles
// + 3 corrections dans villes-data.js
// + 1 correction interne (mombacho label + momotombo)
// ═══════════════════════════════════════════════════════════


];