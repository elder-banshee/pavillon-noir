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

// ═══════════════════════════════════════════════════════════
// SÉRIE GRANDES ANTILLES + SITES PETITES ANTILLES
// ═══════════════════════════════════════════════════════════

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

];