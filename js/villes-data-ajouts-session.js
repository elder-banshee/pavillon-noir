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
// FIN DU FICHIER INTERMÉDIAIRE — Session du 2025-06-04
// Total : 54 entrées nouvelles + 1 correction dans villes-data.js
// ═══════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════
// MISE À JOUR DU BILAN — Session du 2025-06-04
// Total cumulé : 76 entrées nouvelles
// + 2 corrections dans villes-data.js (Campeche, Panama City, Granada)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SÉRIE VENEZUELA
// ═══════════════════════════════════════════════════════════

// ── 77. CORO ─────────────────────────────────────────────────────────────────

    {
        id: 'coro',
        nom: 'Coro (Santa Ana de Coro)',
        label: 'Coro o Venezuela',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6025, 3997],
        // ⚠️ La Jaillot indique "Coro o Venezuela (aux Hollandois)" —
        // mention remarquable de l'influence hollandaise de facto sur la ville.

        contexte: [
            {
                de: 1712,
                texte: `Première capitale du Venezuela colonial, fondée en 1527 — la plus ancienne ville permanente du Venezuela actuel. Coro a perdu sa primauté au profit de Caracas depuis 1578, mais elle reste le chef-lieu de la province de Coro et un point d'ancrage sur la côte. La mention de la Jaillot — "<em>aux Hollandois</em>" — dit l'essentiel : Coro est à portée de Curaçao, et la ville entretient des relations commerciales si étroites avec les marchands hollandais que son appartenance espagnole est en partie nominale. Marchandises européennes, esclaves africains, cacao vénézuélien — tout transite par ces canaux informels sans que les autorités de Caracas y puissent grand chose.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1527, première capitale du Venezuela : établi.
✅ Commerce hollandais structurel via Curaçao : établi (Klooster, <em>Illicit Riches</em>, 1998).
✅ Mention "aux Hollandois" sur la Jaillot : donnée cartographique primaire — reflet de la réalité commerciale perçue par un cartographe français de 1708.
⚠️ Population en 1712 : estimation.`,
    },

// ── 78. CARACAS ──────────────────────────────────────────────────────────────

    {
        id: 'caraccos',
        nom: 'Caracas (Santiago de León de Caracas)',
        label: 'Caraccos / St Iago de Leon',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6460, 4156],
        // ⚠️ La Jaillot distingue "Caraccos" (zone côtière / La Guaira)
        // et "St Iago de Leon" (la ville proprement dite, au sud dans la vallée,
        // sur le lac de Tocarigua). La Guaira est déjà documentée dans villes-data.js
        // (entrée 'la-guaira'). Cette entrée couvre la ville de Caracas elle-même.

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province du Venezuela, fondée en 1567 dans une vallée à 900 mètres d'altitude, séparée de la côte Caraïbe par une muraille de montagnes que seul un chemin de montagne raide relie à La Guaira. Cette géographie isole Caracas des attaques maritimes — Drake et les flibustiers ont toujours préféré rançonner les ports côtiers plutôt que d'escalader la sierra. La ville est le siège du gouverneur de la province du Venezuela et de la Compagnie de Caracas (Real Compañía Guipuzcoana, fondée en 1728 — mais dont la création est déjà discutée à Madrid pour contrer la contrebande hollandaise).
<br><br>
L'économie de Caracas repose sur le cacao des vallées côtières, acheminé vers La Guaira puis vers Veracruz ou directement vers l'Espagne. Le commerce interlope avec Curaçao est structurel — les autorités le tolèrent faute de moyens pour l'interdire.`,
            },
        ],

        population: `~6 000 habitants`,

        note_mj: `✅ Fondation 1567, capitale de la province du Venezuela : établi.
✅ Séparation géographique de la côte par la sierra — protection naturelle : établi.
✅ Commerce du cacao, contrebande avec Curaçao : établi (Klooster, 1998).
✅ Real Compañía Guipuzcoana : fondée en 1728 — hors période mais dans l'horizon du jeu.
⚠️ Population en 1712 : estimation.
La Guaira (port de Caracas) est documentée séparément dans villes-data.js (entrée 'la-guaira').`,
    },

// ── 79. CARABALLEDA ──────────────────────────────────────────────────────────

    {
        id: 'caraballeda',
        nom: 'Nuestra Señora de Caraballeda',
        label: 'N.S. de Carvalleda',
        type: 'port',
        rang: '2',
        territoire: 'venezuela',
        coords: [6495, 4103],

        contexte: [
            {
                de: 1712,
                texte: `Ancien port de Caracas sur la côte Caraïbe, fondé en 1548 — le premier débarcadère espagnol de la région avant que La Guaira ne le supplante définitivement. En 1712, Caraballeda n'est plus qu'un village de pêcheurs sur une plage exposée, sans défense ni commerce notable. Son intérêt est historique : c'est ici que débarquaient les colons et les marchandises à destination de Caracas avant la construction du chemin muletier vers La Guaira. La ville a été saccagée par des pirates plusieurs fois au XVIIe siècle — sa vulnérabilité structurelle (rade ouverte, pas de fort) explique son déclin.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `✅ Fondation 1548, ancien port de Caracas supplantépar La Guaira : établi.
⚠️ État précis en 1712 : déclin confirmé, détails peu documentés.`,
    },

// ── 80. OCUMARE / CÔTE CENTRALE ──────────────────────────────────────────────

    {
        id: 'otchierado',
        nom: 'Ocumare de la Costa',
        label: 'Otchierado',
        type: 'port',
        rang: '2',
        territoire: 'venezuela',
        coords: [6636, 4088],
        // ⚠️ "Otchierado" — déformation probable d'Ocumare ou d'un village
        // côtier entre Caraballeda et Barcelona. Identification incertaine.

        contexte: [
            {
                de: 1712,
                texte: `Village côtier sur la côte centrale du Venezuela, entre La Guaira et Cumaná. La côte vénézuélienne entre Caracas et Cumaná est une succession de baies et de caps peu peuplés, fréquentés par les pêcheurs locaux et les navires de contrebande qui évitent La Guaira. Cacao et peaux de tortue sortent par ces anses discrètes vers Curaçao et les Antilles françaises.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ "Otchierado" : identification avec Ocumare de la Costa probable mais non certaine. La déformation phonétique est importante — pourrait désigner un village différent sur la côte centrale vénézuélienne.`,
    },

// ── 81. BARCELONA (COMANAGOTTA) ───────────────────────────────────────────────

    {
        id: 'barcelona-venezuela',
        nom: 'Barcelona',
        label: 'Comanagotta',
        type: 'port',
        rang: '2',
        territoire: 'venezuela',
        coords: [6711, 4098],
        // ⚠️ Position sur la Jaillot entre Caraballeda et Cumaná, côte centrale.
        // Identification probable avec Barcelona de Anzoátegui (fondée 1671).

        contexte: [
            {
                de: 1712,
                texte: `Port de la côte centrale vénézuélienne, fondé en 1671 sur la baie de Pozuelos. Barcelona est encore une ville jeune en 1712 — à peine quarante ans d'existence, une communauté de colons créoles et de pêcheurs autour d'une rade commode. Sa position entre La Guaira et Cumaná en fait une escale naturelle sur la navigation côtière. Le cacao des vallées de l'arrière-pays commence à transiter par son port, annonçant une prospérité future.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `⚠️ Identification de "Comanagotta" avec Barcelona de Anzoátegui : probable d'après la position géographique. Barcelona est fondée en 1671 — la phonétique ne correspond pas au nom colonial, "Comanagotta" pourrait désigner un nom local ou une déformation d'un village antérieur.
✅ Fondation de Barcelona en 1671 : établi.`,
    },


// ── 82. TRUJILLO (ANDES) ─────────────────────────────────────────────────────

    {
        id: 'trujillo-andes',
        nom: 'Trujillo (Nuestra Señora de la Paz)',
        label: 'Trugillo ò N.S. della Faz',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [5994, 4602],
        // ⚠️ Trujillo andin — zone montagneuse sur l'axe San Cristóbal–Tucuyo.
        // À distinguer de "Truxillo" (rive sud du lac Maracaibo, entrée séparée).
        // La Jaillot distingue deux établissements portant ce nom à des latitudes
        // très différentes.

        contexte: [
            {
                de: 1712,
                texte: `Ville andine fondée en 1557 dans les hauteurs de la cordillère vénézuélienne, sous le nom complet de Trujillo de Nuestra Señora de la Paz. La ville a été déplacée et refondée plusieurs fois avant de trouver son emplacement définitif — une instabilité due aux tremblements de terre et aux raids des nations indiennes non soumises. Trujillo est le centre administratif d'une région de montagne productrice de blé et d'élevage, sur la route entre San Cristóbal au sud-ouest et El Tocuyo au nord-est. Son altitude lui vaut un climat tempéré apprécié dans cette Amérique tropicale.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1557, déplacements multiples, nom complet incluant "de la Paz" : établi.
⚠️ À distinguer de "Truxillo" lacustre (rive sud du lac Maracaibo) — la Jaillot semble distinguer les deux, mais les deux noms créent une confusion persistante dans les sources cartographiques.
⚠️ Population en 1712 : estimation.`,
    },

// ── 83. TRUXILLO (LAC MARACAIBO) ─────────────────────────────────────────────

    {
        id: 'truxillo-maracaibo',
        nom: 'Truxillo (lac Maracaibo)',
        label: 'Truxillo',
        type: 'port',
        rang: '2',
        territoire: 'venezuela',
        coords: [6056, 4291],
        // ⚠️ Extrémité sud du lac Maracaibo, ENE de Mérida sur la Jaillot.
        // Probablement Gibraltar de Venezuela, principal port lacustre du sud
        // du lac Maracaibo, connu sous ce nom cartographique alternatif.

        contexte: [
            {
                de: 1712,
                texte: `Port lacustre sur la rive méridionale du lac Maracaibo, à l'embouchure des rivières descendant des Andes de Mérida et de Trujillo. Ce poste collecte le cacao, le blé et les produits andins avant de les acheminer par barque vers Maracaibo et la mer Caraïbe. C'est par ce port que transitent les richesses agricoles des provinces de Mérida et de Trujillo — une route fluviale lacustre qui supplée l'absence de route terrestre praticable entre les Andes et la côte.
<br><br>
Morgan a remonté le lac Maracaibo jusqu'à ces rives méridionales lors de son second raid en 1669 — cherchant des fugitifs et des richesses cachées dans l'arrière-pays.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `⚠️ Identification avec Gibraltar de Venezuela (principal port lacustre du sud du Maracaibo) : probable — "Truxillo" sur la Jaillot à cet emplacement crée une confusion avec la ville andine. Gibraltar est le nom habituellement documenté pour ce port.
✅ Morgan au lac Maracaibo en 1669, exploration des rives méridionales : établi (Exquemelin).
⚠️ Population en 1712 : estimation.`,
    },

// ── 84. CARORA ───────────────────────────────────────────────────────────────

    {
        id: 'portilla-de-carrora',
        nom: 'Carora (Ciudad del Portillo de Carora)',
        label: 'Portilla de Carrora',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6101, 4317],

        contexte: [
            {
                de: 1712,
                texte: `Ville coloniale fondée en 1569 dans une vallée semi-aride des contreforts andins, à mi-chemin entre Maracaibo et Barquisimeto. Carora contrôle un col important — son "portillo" (passage étroit) — sur la route entre le lac Maracaibo et l'intérieur du Venezuela. La ville vit d'un élevage caprin adapté aux conditions sèches de la région, et d'un commerce de transit. Sa position lui vaut un rôle de relais pour les marchandises circulant entre Coro, Maracaibo et El Tocuyo.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Fondation 1569, nom complet "Ciudad del Portillo de Carora" : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 85. VALENCIA ─────────────────────────────────────────────────────────────

    {
        id: 'valencia-venezuela',
        nom: 'Nueva Valencia del Rey',
        label: 'Tieujo Nueva Valentia',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6287, 4181],
        // ⚠️ "Tieujo" dans le nom sur la Jaillot pourrait désigner le lago de
        // Tacarigua (lac de Valencia) qui borde la ville à l'est.

        contexte: [
            {
                de: 1712,
                texte: `Deuxième ville du Venezuela colonial, fondée en 1555 dans la vallée de Carabobo, entre le lac de Tacarigua et les contreforts andins. Nueva Valencia del Rey est un centre agricole et d'élevage prospère, sur la route principale reliant Caracas à l'ouest du pays. Sa position dans une vallée fertile et tempérée lui vaut une population plus dense que bien des villes côtières. Le lac de Tacarigua, visible depuis la ville, alimente une pêcherie locale et sert de réservoir pour les terres agricoles environnantes.`,
            },
        ],

        population: `~6 000 habitants`,

        note_mj: `✅ Fondation 1555, deuxième ville du Venezuela colonial : établi.
✅ Lago de Tacarigua (lac de Valencia) à proximité : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 86. LAC DE TACARIGUA ─────────────────────────────────────────────────────

    {
        id: 'lac-tacarigua',
        nom: 'Lac de Tacarigua (lac de Valencia)',
        label: 'Lac de Tocarigua',
        type: 'site',
        rang: '2',
        territoire: 'venezuela',
        coords: [6368, 4192],

        contexte: [
            {
                de: 1712,
                texte: `Lac endoréique (sans exutoire vers la mer) dans la vallée de Carabobo, à l'ouest de Caracas. Le lac de Tacarigua — nom indigène carib, "Valencia" dans les sources espagnoles — est le plus grand lac d'eau douce du Venezuela. Ses eaux poissonneuses nourrissent les communautés riveraines ; ses rives basses et fertiles portent des cultures irriguées. Le lac n'a aucun débouché maritime — les navires ne peuvent y accéder — mais il structure la géographie humaine de toute la région centrale du Venezuela.`,
            },
        ],

        note_mj: `✅ Lac de Tacarigua = lac de Valencia, lac endoréique : établi.
✅ Plus grand lac d'eau douce du Venezuela : établi.`,
    },

// ── 87. NIRGUA (NUEVA XERTZ) ─────────────────────────────────────────────────

    {
        id: 'nueva-xertz',
        nom: 'Nirgua (Nueva Jerez)',
        label: 'Nueva Xertz',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6297, 4329],
        // ⚠️ Latitude de Carora, longitude du lac de Tacarigua,
        // contreforts des "Monts de St Pedro". Identification avec Nirgua
        // (fondée 1628 sous le nom Nueva Jerez de la Frontera) : solide.

        contexte: [
            {
                de: 1712,
                texte: `Ville fondée en 1628 sous le nom de Nueva Jerez de la Frontera, dans les contreforts des Andes au sud-ouest du lac de Tacarigua. Nirgua est un poste frontière — comme son nom l'indique — à la limite entre les terres colonisées de la côte et les territoires des nations indiennes de l'intérieur. La ville vit d'un élevage extensif et d'une agriculture vivrière, sur une route secondaire reliant Valencia à El Tocuyo. Ses habitants font régulièrement face aux raids des Jirajara et des Ayamán, nations indiennes qui résistent à la colonisation dans les montagnes voisines.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Fondation 1628 sous le nom Nueva Jerez de la Frontera : établi.
✅ Résistance des Jirajara et Ayamán dans la région : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 88. BARQUISIMETO (NUEVA SEGOVIA) ─────────────────────────────────────────

    {
        id: 'barquisimeto',
        nom: 'Barquisimeto (Nueva Segovia)',
        label: 'Nueva Segovia',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6302, 4504],
        // ⚠️ À distinguer de Nueva Segovia hondurienne (id: 'nueva-segovia')
        // et nicaraguayenne. Fondée en 1552 sous le nom Nueva Segovia,
        // rebaptisée Barquisimeto. La Jaillot la désigne encore par son
        // nom de fondation.

        contexte: [
            {
                de: 1712,
                texte: `Fondée en 1552 sous le nom de Nueva Segovia, troisième ville du Venezuela colonial en ancienneté après Coro et El Tocuyo. La ville — connue aujourd'hui sous le nom de Barquisimeto — est le centre d'une région agricole productive dans la vallée du río Turbio. Carrefour des routes entre Coro au nord, Valencia à l'est, El Tocuyo au sud et Maracaibo à l'ouest, Barquisimeto est un nœud commercial de l'intérieur vénézuélien. Ses marchés redistribuent les marchandises entre la côte et les provinces andines.`,
            },
        ],

        population: `~5 000 habitants`,

        note_mj: `✅ Fondation 1552 sous le nom Nueva Segovia, rebaptisée Barquisimeto : établi.
✅ Troisième ville en ancienneté au Venezuela, après Coro et El Tocuyo : établi.
⚠️ Population en 1712 : estimation.
À ne pas confondre avec Nueva Segovia hondurienne (id: 'nueva-segovia') ni nicaraguayenne.`,
    },

// ── 89. EL TOCUYO ────────────────────────────────────────────────────────────

    {
        id: 'tucuyo',
        nom: 'El Tocuyo',
        label: 'Tucuyo',
        type: 'ville',
        rang: '2',
        territoire: 'venezuela',
        coords: [6239, 4578],

        contexte: [
            {
                de: 1712,
                texte: `Première capitale de la province du Venezuela, fondée en 1545 — la plus ancienne ville de l'intérieur vénézuélien. El Tocuyo a joué un rôle fondateur dans la colonisation du Venezuela : c'est depuis ici que sont parties la plupart des expéditions qui ont fondé Caracas, Valencia, Barquisimeto et Mérida. La ville a perdu sa primauté politique au profit de Caracas depuis 1578, mais elle reste un centre agricole important — ses vignes, ses oliviers et ses cultures céréalières en font le "grenier" de la province de Lara. L'évêché itinérant du Venezuela y a longtemps résidé avant de s'établir définitivement à Caracas.`,
            },
        ],

        population: `~5 000 habitants`,

        note_mj: `✅ Fondation 1545, première capitale du Venezuela colonial : établi.
✅ Rôle de base de départ pour les fondations de Caracas, Valencia, Barquisimeto, Mérida : établi.
⚠️ Population en 1712 : estimation.`,
    },


// ═══════════════════════════════════════════════════════════
// SÉRIE NOUVELLE-ANDALOUSIE
// ═══════════════════════════════════════════════════════════

// ── 90. ARAYA ────────────────────────────────────────────────────────────────

    {
        id: 'santiago-de-araya',
        nom: 'Araya (Santiago de Araya)',
        label: 'St Iago',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [6890, 4048],
        // ⚠️ Position des actuelles Araya — péninsule et salines.

        contexte: [
            {
                de: 1712,
                texte: `Péninsule aride à l'entrée du golfe de Cariaco, en face de Cumaná — et site des plus grandes salines naturelles des Caraïbes. Les salines d'Araya ont été au cœur d'un conflit commercial et militaire majeur au XVIIe siècle : les navires hollandais venaient y charger du sel en masse sans payer de droits, défiant le monopole espagnol. Madrid a construit le <strong>Castillo de Santiago de Araya</strong> en 1625 pour les en empêcher — une forteresse massive et coûteuse, délibérément démantelée en 1762 par les Espagnols eux-mêmes pour éviter qu'elle ne tombe aux mains des Anglais.
<br><br>
En 1712, le château est encore debout et partiellement en service, bien que la grande époque du conflit hollandais sur le sel soit révolue. La péninsule reste un repère de navigation incontournable à l'entrée du golfe de Cariaco.`,
            },
        ],

        garnison: `Castillo de Santiago de Araya : ~60 soldats. Effectif réduit par rapport au XVIIe siècle — la menace hollandaise s'est atténuée.`,

        note_mj: `✅ Salines d'Araya, conflit hollandais au XVIIe siècle, construction du Castillo de Santiago en 1625 : établi (Goslinga, <em>The Dutch in the Caribbean</em>, 1971).
✅ Démantèlement du château par les Espagnols en 1762 : établi — hors période mais dans l'horizon du jeu.
⚠️ Garnison en 1712 : estimation réduite par rapport aux effectifs du XVIIe siècle.`,
    },

// ── 91. MACURO ───────────────────────────────────────────────────────────────

    {
        id: 'macuro',
        nom: 'Macuro (San José de Macuro)',
        label: 'St Joseph',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7262, 4019],
        // ⚠️ Pointe extrême orientale de la péninsule de Paria.

        contexte: [
            {
                de: 1712,
                texte: `Village à la pointe extrême orientale de la péninsule de Paria — le premier point du continent américain où Christophe Colomb a débarqué, lors de son troisième voyage en août 1498. Colomb a compris qu'il touchait un continent (et non une île) en observant le débit d'eau douce de l'Orénoque dans le golfe de Paria. Macuro est en 1712 un village de pêcheurs modeste, ignorant de sa place dans l'histoire — mais tout navigateur lettré qui mouille dans cette anse sait qu'il pose l'ancre là où l'Europe a découvert l'Amérique du Sud.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `✅ Débarquement de Colomb à Macuro en août 1498, premier contact européen avec le continent sud-américain : établi.
✅ Déduction de Colomb sur le débit de l'Orénoque comme preuve d'un continent : établi (journaux de Colomb, troisième voyage).
⚠️ État précis du village en 1712 : peu documenté.`,
    },

// ── 92. AROMAIA (ORÉNOQUE) ────────────────────────────────────────────────────

    {
        id: 'aromaia',
        nom: 'Aromaia',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7326, 4462],

        contexte: [
            {
                de: 1712,
                texte: `Territoire et nation arawak de l'Orénoque moyen, connu depuis l'expédition de Walter Raleigh en 1595. C'est ici que régnait le cacique Topiawari (Morequito), que Raleigh a rencontré et dont il a recueilli les récits sur El Dorado et la cité de Manoa. Aromaia est moins un lieu précis qu'une région — les méandres et les îles de l'Orénoque dans ce secteur forment un labyrinthe que les Arawaks connaissent par cœur et que les Espagnols ne maîtrisent pas. En 1712, la présence espagnole dans cette zone se limite à quelques missions jésuites précaires.`,
            },
        ],

        note_mj: `✅ Expédition Raleigh 1595, rencontre avec Topiawari/Morequito : établi (Raleigh, <em>The Discoverie of the Large, Rich, and Bewtiful Empyre of Guiana</em>, 1595).
✅ Légende d'El Dorado liée à cette région : établi comme tradition, non comme fait historique.
⚠️ Missions jésuites dans la région en 1712 : présence probable, détails peu documentés.`,
    },

// ── 93. ARIACOA ──────────────────────────────────────────────────────────────

    {
        id: 'ariacoa',
        nom: 'Ariacoa',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7043, 4475],

        contexte: [
            {
                de: 1712,
                texte: `Village ou mission sur l'Orénoque, dans la région de la Nouvelle-Andalousie. La zone entre Cumaná et l'Orénoque inférieur est en 1712 une frontière mouvante entre l'autorité espagnole — représentée par quelques missions capucines et jésuites — et les nations indiennes de l'Orénoque qui n'ont jamais été soumises. Ariacoa est l'un de ces postes précaires, dont l'existence dépend de la tolérance des nations locales.`,
            },
        ],

        note_mj: `⚠️ Ariacoa : peu documenté — village ou mission de l'Orénoque inférieur, identification précise incertaine.`,
    },

// ── 94. SANTO TOMÉ DE GUAYANA ────────────────────────────────────────────────

    {
        id: 'st-thomas-guayana',
        nom: 'Santo Tomé de Guayana',
        label: 'St Thomas',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7173, 4736],

        contexte: [
            {
                de: 1712,
                texte: `Poste espagnol à la confluence de l'Orénoque et du río Caroní, fondé en 1595 — le même année où Raleigh remontait l'Orénoque à la recherche d'El Dorado. Santo Tomé est la porte d'entrée vers l'Orénoque supérieur et les llanos vénézuéliens. C'est ici que transitent les quelques marchandises qui descendent de l'intérieur — peaux, résines, quelques grammes d'or alluvionnaire — et que les missions jésuites et capucines de l'Orénoque s'approvisionnent.
<br><br>
La ville a été attaquée et brûlée par Raleigh en 1617 lors de son second voyage — expédition qui s'est soldée par un désastre : son fils y a été tué, il n'a trouvé ni or ni El Dorado, et il a été décapité à son retour en Angleterre. Le souvenir de ce raid marque encore les habitants.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `✅ Fondation 1595, position au confluent Orénoque–Caroní : établi.
✅ Raid de Raleigh en 1617, mort de son fils, décapitation de Raleigh à Londres : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 95. MACUREVOARI ──────────────────────────────────────────────────────────

    {
        id: 'macurevoari',
        nom: 'Macurevoari',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7224, 4634],
        // ⚠️ Nord-nord-est de Santo Tomé, sur le lac de Caslipa
        // (probablement le lac Capanaparo ou un lac des llanos de l'Orénoque).

        contexte: [
            {
                de: 1712,
                texte: `Village ou mission sur les rives d'un lac des llanos de l'Orénoque, au nord-nord-est de Santo Tomé de Guayana. Les llanos sont en 1712 une zone quasi-inexplorée par les Espagnols : une immensité de savanes inondables en saison des pluies, peuplée de nations indiennes indépendantes — Achaguas, Sálivas, Guahibos — que les missions jésuites tentent de rassembler dans des <em>reducciones</em>. Les lacs des llanos sont des réservoirs de poissons et de caïmans, et des repères de navigation pour les pirogues indiennes.`,
            },
        ],

        note_mj: `⚠️ Macurevoari : non identifié avec certitude dans les sources coloniales. Village ou mission des llanos de l'Orénoque — existence probable, détails inconnus.
⚠️ "Lac de Caslipa" sur la Jaillot : identification incertaine — pourrait correspondre au lac Capanaparo ou à un lac des llanos aujourd'hui asséché ou renommé.`,
    },

// ── 96. MOREQUITO PORTUS ─────────────────────────────────────────────────────

    {
        id: 'morequito-portus',
        nom: 'Porto Morequito',
        label: 'Morequito Portus',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [7086, 4870],

        contexte: [
            {
                de: 1712,
                texte: `Mouillage de l'Orénoque associé au souvenir du cacique Morequito — chef arawak d'Aromaia rencontré par Walter Raleigh lors de son expédition de 1595. Raleigh décrit Morequito comme son principal informateur sur El Dorado et la cité de Manoa : c'est lui qui a nourri les récits de l'explorateur anglais sur les Incas réfugiés dans l'intérieur du continent. Le "porto" désigne probablement un méandre ou un bras mort de l'Orénoque utilisé comme mouillage protégé.
<br><br>
En 1712, le nom survit sur les cartes comme souvenir d'une rencontre qui a changé la perception européenne de l'Orénoque — mais le mouillage lui-même n'est qu'une rive de fleuve tropical sans établissement permanent.`,
            },
        ],

        note_mj: `✅ Cacique Morequito / Topiawari, rencontre avec Raleigh en 1595 : établi (Raleigh, <em>Discoverie of Guiana</em>, 1595).
✅ Rôle de Morequito comme informateur sur El Dorado dans le récit de Raleigh : établi.
Le nom survit sur les cartes du XVIIIe siècle par tradition cartographique héritée de Raleigh.`,
    },

// ── 97. TUTERITONA ───────────────────────────────────────────────────────────

    {
        id: 'tuteritona',
        nom: 'Tuteritona',
        type: 'site',
        rang: '3',
        territoire: 'nouvelle-andalousie',
        coords: [7130, 4780],

        contexte: [
            {
                de: 1712,
                texte: `Village ou mission de l'Orénoque supérieur ou des llanos orientaux, dont le nom est une translittération d'un nom arawak ou carib non identifié avec certitude. La région est en 1712 une frontière active entre les missions jésuites de l'Orénoque et les nations indiennes non contactées de l'intérieur du continent. Ces postes précaires disparaissent et réapparaissent selon les violences, les épidémies et les retraits missionnaires.`,
            },
        ],

        note_mj: `⚠️ Tuteritona : non identifié dans les sources coloniales accessibles. Village ou mission de l'Orénoque — existence présumée d'après la Jaillot, détails inconnus.`,
    },

// ═══════════════════════════════════════════════════════════
// MISE À JOUR DU BILAN — Session du 2025-06-04
// Total cumulé : 97 entrées nouvelles
// + 3 corrections dans villes-data.js
// ═══════════════════════════════════════════════════════════

// ── AJOUT : MONTS DE SAN PEDRO ───────────────────────────────────────────────

    {
        id: 'monts-san-pedro',
        nom: 'Monts de San Pedro',
        label: 'Monts de St Pedro',
        type: 'site',
        rang: '2',
        territoire: 'venezuela',
        coords: [6287, 4400],

        contexte: [
            {
                de: 1712,
                texte: `Massif ou chaîne de collines du centre du Venezuela, entre le lac de Tacarigua (Valencia) et les contreforts andins au sud. Repère topographique visible depuis la vallée de Carabobo et les terres agricoles environnantes — les "Monts de San Pedro" servent de point d'orientation pour les voyageurs et les muletiers qui traversent l'intérieur vénézuélien entre Valencia et les provinces méridionales.`,
            },
        ],

        note_mj: `Indication topographique sur la Jaillot — massif sans établissement colonial notable. Cohérent avec la serranía del Interior vénézuélienne au sud du lac de Valencia.`,
    },


// ── AJOUT : VERINA (CARIACO) ─────────────────────────────────────────────────

    {
        id: 'verina',
        nom: 'Verina (Cariaco)',
        label: 'Verina',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-andalousie',
        coords: [4884, 4103],
        // ⚠️ Position sur la Jaillot : rive sud du golfe de Cariaco,
        // au sud d'Araya et à l'est de Cumaná. Identification avec Cariaco
        // (bourg colonial sur la côte intérieure du golfe) : probable d'après
        // la géométrie cartographique — le golfe de Cariaco tire d'ailleurs
        // son nom de cet établissement.

        contexte: [
            {
                de: 1712,
                texte: `Bourg sur la rive méridionale du golfe de Cariaco, eaux calmes et abritées à l'est de Cumaná. Le golfe de Cariaco — dont ce bourg a probablement donné le nom — est un plan d'eau encaissé entre la péninsule d'Araya au nord et la côte continentale au sud, à l'abri des vents et des houles de la Caraïbe ouverte. Ses eaux poissonneuses nourrissent les communautés côtières ; ses rives plantées de cacao et de tabac approvisionnent Cumaná. Un mouillage tranquille, loin des circuits commerciaux principaux, apprécié des navires qui veulent réparer ou attendre sans être vus depuis le large.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `⚠️ Identification de "Verina" avec Cariaco : probable d'après la position géographique sur la Jaillot — le golfe de Cariaco est la seule étendue d'eau cohérente avec le triangle Cumaná–Verina–Araya décrit par la carte. La phonétique "Verina" ne correspond pas directement à "Cariaco" — pourrait désigner un village distinct sur la même rive, aujourd'hui disparu ou renommé.
⚠️ Population en 1712 : estimation.`,
    },

// ═══════════════════════════════════════════════════════════
// BILAN FINAL — Session du 2025-06-04
// Total : 99 entrées nouvelles
// + 3 corrections dans villes-data.js
//   · campeche : Morgan 1663 → Myngs 1663
//   · panama-city : vice-royauté 1718–1724 → 1717–1723
//   · granada-nicaragua : Fort Inmaculada déplacé à l'embouchure → corrigé
//     à mi-parcours (El Castillo), entrée castillo-san-juan créée
// ═══════════════════════════════════════════════════════════

// ── AJOUT : RELAIS FLUVIAUX DU MAGDALENA MOYEN-SUPÉRIEUR ─────────────────────

    {
        id: 'relais-magdalena',
        nom: 'Relais du Magdalena',
        label: 'Apuerto / El Desembarcadero / Plasencia / Trinidad',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5112, 4850],
        // ⚠️ Quatre toponymes de la colonne 3 (Jaillot) sur le Magdalena
        // moyen-supérieur, entre Tamalameque et l'intérieur du Nuevo Reino.
        // Aucun n'est identifié avec certitude comme ville majeure dans les
        // sources coloniales — regroupés en entrée de zone.

        contexte: [
            {
                de: 1712,
                texte: `Le río Magdalena entre Tamalameque et Honda est jalonné de relais, embarcadères et bourgades fluviales dont les noms varient selon les cartes et les sources. Ces postes — "Apuerto", "El Desembarcadero" (le débarquement), "Plasencia", "Trinidad" — sont moins des villes que des fonctions : points de transbordement, de ravitaillement en eau douce, d'attente entre deux sections du fleuve. Le Magdalena est ici un fleuve de méandres et de bancs de sable changeants, navigable seulement par des pirogues et des chaloupes à fond plat conduites par des bateliers locaux qui connaissent chaque passe.
<br><br>
Ces relais constituent l'épine dorsale du commerce intérieur de la Nouvelle-Grenade : tout ce qui monte de Carthagène vers Bogotá, et tout ce qui descend des provinces andines vers la côte, passe par ces embarcadères entre lesquels les marchandises sont transbordées, les mules remplacées par des pirogues, et les voyageurs rançonnés par des bateliers indispensables.`,
            },
        ],

        note_mj: `⚠️ Apuerto, El Desembarcadero, Plasencia, Trinidad (Magdalena) : aucun de ces quatre toponymes n'est identifié avec certitude comme établissement colonial notable dans les sources accessibles. Présents sur la Jaillot comme jalons de la navigation fluviale — regroupés en entrée de zone faute de documentation individuelle suffisante.
Si la carte les place à des positions clairement espacées et distinctes, des entrées minimales individuelles pourront être créées ultérieurement.`,
    },

// ═══════════════════════════════════════════════════════════
// BILAN FINAL RÉVISÉ — Session du 2025-06-04
// Total : 101 entrées nouvelles
// + 3 corrections dans villes-data.js
// ═══════════════════════════════════════════════════════════

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

// ── 108. LAC MARACAIBO ───────────────────────────────────────────────────────

    {
        id: 'lac-maracaibo',
        nom: 'Lac Maracaibo',
        type: 'site',
        rang: '2',
        territoire: 'venezuela',
        coords: [5985, 4128],

        contexte: [
            {
                de: 1712,
                texte: `Vaste étendue d'eau saumâtre reliée à la mer des Caraïbes par un détroit étroit gardé par le Fort San Carlos de la Barra — en réalité moins un lac qu'un golfe intérieur de 13 000 km², accessible depuis la mer par un chenal de quelques kilomètres de large. Ses rives portent les cacaoyers et les élevages qui font la richesse des provinces de Mérida, Trujillo et Maracaibo. La navigation sur le lac est assurée par des pirogues indiennes et des barques à fond plat qui relient les bourgades côtières.
<br><br>
Morgan a pillé Maracaibo à deux reprises — en 1666 et en 1669. Lors de la seconde expédition, il a brûlé la flotte espagnole qui lui barrait la retraite, forçant le passage sous les canons du fort en une manœuvre audacieuse. Le souvenir de ces raids est vif en 1712 — et le Fort San Carlos, renforcé depuis, est la seule défense du lac contre toute attaque venue de la mer.`,
            },
        ],

        note_mj: `✅ Raids de Morgan en 1666 et 1669, destruction de la flotte espagnole : établi (Exquemelin).
✅ Fort San Carlos de la Barra comme unique accès depuis la mer : établi — voir entrée 'maracaibo'.
✅ Nature saumâtre du lac (golfe intérieur) : établi géographiquement.`,
    },

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