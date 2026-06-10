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



];