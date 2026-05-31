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
    "anarchie-pirate": {
        label: 'Anarchie Pirate',
        labelCourt: 'Anarchie Pirate',
        couleur: '#5c5950',
        blason: 'pnj/pavillons/generic_red.svg',
        ordre: 1,
    },
    pirate: {
        label: 'République Pirate',
        labelCourt: 'République Pirate',
        couleur: '#000000',
        blason: 'pnj/pavillons/nassau.svg',
        ordre: 1,
    },
    espagnole: {
        label: 'Couronne d\'Espagne',
        labelCourt: 'Espagne',
        couleur: '#dfc534',
        blason: 'pnj/pavillons/es.svg',
        ordre: 2,
    },
    britannique: {
        label: 'Couronne britannique',
        labelCourt: 'Grande-Bretagne',
        couleur: '#d13a1c',
        blason: 'pnj/pavillons/gb.svg',
        ordre: 3,
    },
    francaise: {
        label: 'Royaume de France',
        labelCourt: 'France',
        couleur: '#2b6f91',
        blason: 'pnj/pavillons/fr_banniere.svg',
        ordre: 4,
    },
    hollandaise: {
        label: 'Provinces-Unies',
        labelCourt: 'Provinces-Unies',
        couleur: '#b36221',
        blason: 'pnj/pavillons/nl.svg',
        ordre: 5,
    },
    danoise: {
        label: 'Danemark-Norvège',
        labelCourt: 'Danemark-Norvège',
        couleur: '#0b6d18',
        blason: 'pnj/pavillons/dk.svg',
        ordre: 6,
    },
    amerindienne: {
        label: 'Nations amérindiennes',
        labelCourt: 'Miskito',
        couleur: '#8b5e2a',
        blason: 'pnj/pavillons/amerindien.svg',
        ordre: 7,
        // Symbole commun à toutes les nations amérindiennes représentées sur la carte.
        // Terminologie retenue : "Nations amérindiennes" — ni "tribus" (péjoratif),
        // ni "autochtones" (trop générique), ni "Nations indiennes" (connotation XIXe, contexte
        // nord-américain). Le SVG amerindien.svg est une flèche stylisée
        // sobre sur fond ocre, sans référence héraldique européenne.
    },
    conteste: {
        label: 'Territoire contesté',
        labelCourt: 'Contesté',
        couleur: '#575757',
        blason: 'pnj/pavillons/crossed_sabers.svg',
        ordre: 8,
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
        tags: ['Caroline du Sud', 'South Carolina', 'Charles Town', 'Charleston', 'Carolines'],

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

        contexte: [
            // ── Statut politique ───────────────────────────────────
            {
                de: 1712, a: 1720,
                texte: `Province administrée pour le compte des Lords Proprietors depuis 1663. Charles Town est le seul port notable, plaque tournante du commerce de riz, d'indigo et d'esclaves africains. Séparée de la Caroline du Nord depuis 1712.`,
            },
            {
                de: 1720,
                texte: `Colonie royale depuis 1720 — les Lords Proprietors, discrédités par la guerre yamasee et la révolution de 1719, ont cédé leurs droits à la Couronne. Charles Town reste le port dominant du sud des colonies britanniques.`,
            },

            // ── Commerce interlope ─────────────────────────────────
            {
                de: 1712, a: 1719,
                texte: `<strong>Commerce interlope :</strong><br>
Les marchands de Charles Town sont parmi les principaux fournisseurs des pirates de Nassau. Rhum, provisions, outils et munitions partent vers Nassau ; le butin pirate — or espagnol, marchandises diverses — revient dans les entrepôts de Charles Town.`,
            },
            {
                de: 1719,
                texte: `<strong>Commerce interlope :</strong><br>
L'arrivée de Woodes Rogers à Nassau en 1718 met fin à l'âge d'or de la piraterie bahaméenne. Le commerce interlope avec les pirates s'étiole ; les marchands de Charles Town cherchent de nouveaux débouchés.`,
            },

            // ── Traite des Indiens ─────────────────────────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>La traite des Indiens :</strong><br>
Depuis 1680, les traders de Charles Town  ont capturé et vendus comme esclaves environ quarante mille Indiens, exportés vers les Antilles et les autres colonies Britanniques. Cette traite, qui pousse les nations alliées des Anglais à capturer leurs voisins pour les vendre, attise les tensions dans l'arrière-pays.`,
            },
            {
                de: 1715, a: 1725,
                texte: `<strong>La traite des Indiens :</strong><br>
La traite carolinienne — environ quarante mille Indiens exportés depuis 1680 — est la cause profonde de la guerre yamasee. La population indienne à l'est des Appalaches est passée de ~10 000 en 1685 à ~5 100 en 1715.`,
            },

            // ── Guerre yamasee ─────────────────────────────────────
            {
                de: 1715, a: 1722,
                versions: [
                    {
                        de: 1715, a: 1716,
                        texte: `<strong>La guerre yamasee :</strong><br>
Le Vendredi Saint 15 avril 1715, les Yamasees massacrent les traders anglais à Pocotaligo et déclenchent la plus grande coalition indienne jamais formée contre les colonies du Sud. Quatre cents Anglais sont tués dans les premiers mois. Port Royal est ravagé, Charles Town presque encerclée.`,
                    },
                    {
                        de: 1716, a: 1717,
                        texte: `<strong>La guerre yamasee (depuis avril 1715) :</strong><br>
Les Caroliniens convainquent les Cherokees de se retourner contre les Creeks, déchirant la coalition. Craven défait les Yamasees à Salkehatchie et les refoule en Floride, où ils s'allient aux Espagnols.`,
                    },
                    {
                        de: 1717,
                        texte: `<strong>La guerre yamasee (avril 1715 – novembre 1717) :</strong><br>
Les Creeks signent la paix et refluent vers l'ouest. La colonie en sort épuisée et endettée, ses frontières exposées, ses Lords Proprietors discrédités. L'arrière-pays, vidé par l'exode yamasee vers la Floride, reste largement dépeuplé.`,
                    },
                ],
            },

            // ── Blocus de Barbe-Noire ──────────────────────────────
            {
                de: 1718, a: 1720,
                texte: `<strong>Le blocus de Barbe-Noire (juin 1718) :</strong><br>
Barbe-Noire bloque le port de Charles Town avec quatre navires, prend des otages parmi les notables et impose ses conditions au gouverneur Johnson — sans rencontrer la moindre résistance navale. L'épisode révèle l'impuissance militaire de la colonie au sortir de la guerre yamasee.`,
            },

            // ── Révolution de 1719 ─────────────────────────────────
            {
                de: 1719, a: 1722,
                texte: `<strong>La révolution de 1719 :</strong><br>
En novembre, la population se soulève contre les Lords Proprietors. James Moore Jr. est élu gouverneur par acclamation ; une délégation est envoyée à Londres pour demander au roi de reprendre la colonie en main. La transition vers le statut de colonie royale est acceptée en 1720.`,
            },
        ],


        capitale: 'Charles Town (Charleston)',

        population_approx: [
            {
                de: 1712, a: 1717,
                texte: `~18 000 habitants (dont ~10 000 esclaves africains)<br>~5 000 Indiens (alliés ou sujets, principalement Yamasees et Creeks)`,
            },
            {
                de: 1717,
                texte: `~18 000 habitants (dont ~10 000 esclaves africains)<br>~2 500 Indiens à l'est des Appalaches`,
            },
        ],

        economie: [
            {
                de: 1712, a: 1719,
                texte: `Riz, indigo, esclaves africains, fourrures, commerce interlope avec Nassau`,
            },
            {
                de: 1719,
                texte: `Riz, indigo, esclaves africains, fourrures`,
            },
        ],

        note_mj: 'Colonie propriétaire jusqu\'en 1719, royale dès 1720. Succession des gouverneurs confirmée par Wikipedia EN, List of colonial governors of South Carolina.',
    },

    {
        id: 'floride',
        nom: 'Floride',
        tags: ['Floride', 'Florida', 'Saint-Augustin', 'San Agustín', 'Saint Augustine'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Presidio espagnol isolé, la Floride se réduit à Saint-Augustin et à quelques missions franciscaines en territoire indien. Sa valeur est stratégique : glacis contre les colonies caroliniennes, et refuge pour les esclaves en fuite des plantations britanniques, à qui Madrid accorde la liberté en échange du baptême et du service militaire.`,
            },

            // ── Garnison et missions ravagées ─────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Une colonie à bout de souffle :</strong><br>
La garnison ne dépasse pas 300 hommes — effectif dérisoire pour défendre un territoire de plusieurs centaines de kilomètres de côtes. Les raids caroliniens de 1704 et 1706 ont détruit la quasi-totalité des missions franciscaines de l'arrière-pays : des dizaines d'établissements brûlés, des milliers d'Indiens christianisés tués, capturés ou dispersés. La Floride intérieure est un désert démographique que ni les Espagnols ni personne d'autre ne contrôle.`,
            },

            // ── Crise du situado ───────────────────────────────────
            {
                de: 1712, a: 1714,
                texte: `<strong>Crise du situado :</strong><br>
Les Anglais interceptent le situado — la subvention annuelle venue de Mexico — réduisant la garnison à se nourrir de chiens et de chevaux. Córcoles administre une colonie chroniquement affamée.`,
            },

            // ── Guerre yamasee : ambiguïté espagnole ──────────────
            {
                de: 1715, a: 1718,
                texte: `<strong>Guerre yamasee — le jeu espagnol :</strong><br>
Saint-Augustin accueille discrètement des émissaires yamasees et fournit armes et munitions aux nations en guerre contre la Caroline. Madrid ne s'engage pas ouvertement — la Floride n'a pas les moyens d'une guerre — mais Córcoles souffle sur les braises avec soin. Si les Anglais s'épuisent dans l'arrière-pays, la Floride en sortira plus sûre sans avoir tiré un coup de feu.`,
            },

            // ── Transition 1716–1717 ───────────────────────────────
            {
                de: 1716, a: 1718,
                texte: `<strong>Transition politique :</strong><br>
Après dix ans d'administration de Córcoles, deux intérimaires se succèdent rapidement. Juan de Ayala y Escobar, soupçonné de contrebande avec les marchands anglais, administre la Floride dans un climat de tension intérieure.`,
            },

            // ── Refuge yamasee ────────────────────────────────────
            {
                de: 1717,
                texte: `<strong>Refuge yamasee :</strong><br>
Les Yamasees repoussés de Caroline par Craven trouvent refuge en Floride espagnole. Madrid les accueille et les intègre dans la défense de la province — leur connaissance de l'arrière-pays carolinien en fait des alliés précieux contre les Anglais.`,
            },

            // ── Benavides ─────────────────────────────────────────
            {
                de: 1718, a: 1721,
                texte: `<strong>Antonio de Benavides :</strong><br>
Benavides prend le gouvernorat en août 1718 avec un mandat de réforme. Il fait arrêter son prédécesseur Ayala pour commerce interlope, renforce les liens avec les nations indiennes voisines et repousse plusieurs incursions britanniques.`,
            },
            {
                de: 1721,
                texte: `<strong>Antonio de Benavides :</strong><br>
Benavides est maintenant bien établi et l'homme fort de la Floride. Sa politique concernant les esclaves fugitifs est plus ambiguë que ne le voudrait l'édit de 1693 : il vend plusieurs esclaves fugitifs à leurs anciens maîtres britanniques pour éviter des représailles diplomatiques, et tarde à affranchir les miliciens noirs malgré leur loyauté.`,
            },
        ],


        capitale: 'San Agustín (Saint Augustine)',

        population_approx: [
            {
                de: 1712, a: 1717,
                texte: `~1 500 habitants (garnison et civils)<br>Quelques centaines d'Indiens alliés dans les missions franciscaines`,
            },
            {
                de: 1717,
                texte: `~1 500 habitants (garnison et civils)<br>~5 000 Indiens (afflux de réfugiés yamasees depuis la Caroline — plusieurs centaines de guerriers supplémentaires intégrés à la défense)`,
            },
        ],

        economie: 'Situado royal (subvention de Mexico), missions franciscaines, commerce interlope discret avec les Anglais',

        note_mj: 'La Floride dépend nominalement de la vice-royauté de Nouvelle-Espagne (Mexico). Dates de gouverneurs confirmées par AGI (SD 843) et TePaske, The Governorship of Spanish Florida, 1700–1763 (Duke UP, 1964).',
    },

    {
        id: 'louisiane',
        nom: 'Louisiane',
        tags: ['Louisiane', 'Louisiana', 'Mobile', 'Nouvelle-Orléans', 'New Orleans', 'Mississippi', 'Golfe du Mexique'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Colonie française à peine viable, centrée sur Mobile et quelques postes dispersés le long du Mississippi. Elle survit grâce aux alliances avec les nations indiennes — Choctaws, Chickasaws, Illinois — et au commerce des peaux. La population blanche ne dépasse pas 400 âmes.`,
            },

            // ── Concession Crozat ─────────────────────────────────
            {
                de: 1712, a: 1717,
                texte: `<strong>La concession Crozat :</strong><br>
En 1712, Louis XIV cède à l'armateur Antoine Crozat un monopole commercial de quinze ans. Crozat espère des mines d'argent comparables à celles du Mexique — il ne trouvera que des marais et des dettes. Bienville, qui administre la colonie depuis 1702, demeure commandant militaire sous l'autorité du nouveau gouverneur nommé par Crozat. Cadillac, gouverneur nommé en 1713, se brouille avec Bienville, humilie les Natchez lors de négociations commerciales, et échoue à ouvrir un commerce terrestre avec le Mexique. En 1717, Crozat, ayant perdu plus d'un million de livres, restitue sa concession à la Couronne.`,
            },

            // ── Compagnie des Indes et La Nouvelle-Orléans ────────
            {
                de: 1717,
                texte: `<strong>La Compagnie des Indes :</strong><br>
En 1717, le régent Philippe d'Orléans confie la Louisiane à la Compagnie d'Occident de John Law, bientôt rebaptisée Compagnie des Indes. La "bulle du Mississippi" enfle à Paris : des milliers de colons sont recrutés, parfois de force — prisonniers, déportés, engagés trompés sur les conditions. En 1718, Bienville fonde La Nouvelle-Orléans sur un méandre du Mississippi, chantier dans un marais qui devient rapidement la capitale de fait de la colonie.`,
            },

            // ── Pression sur les voisins ──────────────────────────
            {
                de: 1712, a: 1720,
                texte: `<strong>Tensions de frontière :</strong><br>
La Louisiane française presse les colonies espagnoles à l'ouest et britanniques au nord-est. Les postes français sur le Mississippi sont perçus à Madrid et Londres comme une menace d'encerclement. Les nations indiennes de l'intérieur — Choctaws surtout — jouent les puissances européennes les unes contre les autres avec habileté.`,
            },
        ],


        capitale: [
            { de: 1712, a: 1718, texte: `Mobile` },
            { de: 1718, texte: `La Nouvelle-Orléans (fondée en 1718)` },
        ],

        population_approx: [
            {
                de: 1712, a: 1718,
                texte: `~400 Blancs, ~250 esclaves indiens<br>
<strong>Nations indiennes :</strong><br>
— Choctaws : ~15 000 à 20 000 (principale alliée, nation dominante du Sud-Est)<br>
— Illinois (confédération) : ~2 500 à 3 000<br>
— Natchez : ~3 500 (alliée fragile, conflit latent)<br>
— Chickasaws : ~4 000 (pro-britanniques, rivaux des Français)<br>
— Autres nations du Mississippi inférieur : non chiffrées`,
            },
            {
                de: 1718,
                texte: `~1 500 à 5 000 habitants (afflux rapide de colons de la Compagnie des Indes)<br>
<strong>Nations indiennes :</strong><br>
— Choctaws : ~15 000 à 20 000 (principale alliée, nation dominante du Sud-Est)<br>
— Illinois (confédération) : ~2 500 à 3 000<br>
— Natchez : ~3 500 (alliée fragile, conflit latent)<br>
— Chickasaws : ~4 000 (pro-britanniques, rivaux des Français)<br>
— Autres nations du Mississippi inférieur : non chiffrées`,
            },
        ],

        economie: [
            { de: 1712, a: 1717, texte: `Fourrures, commerce indien, subventions de la Couronne` },
            { de: 1717, texte: `Fourrures, tabac, spéculation foncière (bulle du Mississippi), subventions de la Compagnie des Indes` },
        ],

        note_mj: 'Bienville sert quatre mandats non consécutifs (1702–1713, 1716–17, 1718–1725, 1733–1743). Sources : DCB (Dictionary of Canadian Biography), 64 Parishes (LSU), Britannica.',
    },

    {
        id: 'nouveau-mexique',
        nom: 'Nouveau-Mexique',
        tags: ['Nouveau-Mexique', 'New Mexico', 'Santa Fe', 'Río Grande', 'Rio Grande'],

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
                titre: 'Gouverneur par intérim',
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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Province frontière isolée sur le Río Grande, accessible depuis Mexico uniquement par le long Camino Real de Tierra Adentro. Depuis la reconquête de 1692 après la révolte Pueblo de 1680, la colonie reste fragile : environ 3 000 Espagnols et métis entourés de dizaines de milliers d'Indiens Pueblo, Apaches, Navajos et Utes. Loin des côtes et des routes maritimes, le Nouveau-Mexique est absent des chroniques pirates — mais ses convois d'argent vers Mexico constituent une cible permanente.`,
            },

            // ── Menace comanche ───────────────────────────────────
            {
                de: 1712,
                texte: `<strong>La menace comanche :</strong><br>
Une nouvelle puissance monte des Grandes Plaines : les Comanches, cavaliers redoutables récemment introduits au cheval, pressent les établissements espagnols depuis le nord-est et repoussent les Apaches vers le sud. Ces derniers, dont les relations avec les Espagnols oscillent entre trêves commerciales et raids meurtriers selon les bandes et les saisons, se retrouvent pris en étau — ce qui aggrave leur pression sur les missions et les ranchos de la frontière.`,
            },

            // ── Instabilité gouvernementale ───────────────────────
            {
                de: 1715, a: 1722,
                texte: `<strong>Instabilité gouvernementale :</strong><br>
Flores Mogollón est écarté en 1715 pour détournement de fonds. Quatre intérimaires se succèdent en six ans, nommés par le vice-roi faute de candidats disponibles. Cette instabilité affaiblit la capacité de réaction de la province face aux pressions indiennes et à la rivalité française croissante.`,
            },

            // ── Rivalité française et expédition Villasur ─────────
            {
                de: 1718, a: 1722,
                texte: `<strong>La menace française :</strong><br>
En 1719, Valverde mène une expédition vers le nord-est — jusqu'au Colorado actuel — pour évaluer la menace française et comanche. Il apprend que les Français arment les Pawnees contre les Apaches alliés des Espagnols. En 1720, l'expédition Villasur, envoyée pour contrer cette influence, est décimée sur la Platte par des Pawnees armés par les Français — défaite humiliante qui révèle la fragilité de la frontière septentrionale.`,
            },
        ],


        capitale: 'Santa Fe',

        population_approx: `~3 000 colons espagnols et métis (1713)<br>~17 000 Indiens Pueblos dans les missions<br>Nations non soumises (Apaches, Navajos, Utes, Comanches) : non chiffrées`,

        economie: 'Situado royal, élevage, missions franciscaines, commerce limité avec Mexico via El Camino Real',

        note_mj: 'Séquence des gouverneurs confirmée par Wikipedia EN, Atlas of Historic NM Maps (NM Humanities Council) et Infogalactic.',
    },

    {
        id: 'nueva-galicia',
        label: 'Nueva Galicia',
        nom: 'Nueva Galicia (Guadalaxara)',
        tags: ['Nueva Galicia', 'Guadalajara', 'Guadalaxara', 'Jalisco', 'Zacatecas', 'Sinaloa', 'Nouvelle-Galice'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Reino de Nueva Galicia, administré depuis Guadalajara par le Président-Gouverneur de la Real Audiencia — institution à la fois tribunal d'appel et gouvernement civil, indépendante de Mexico depuis 1574. La richesse de la région repose sur les mines d'argent de Zacatecas et sur l'élevage extensif. La population espagnole et créole se concentre dans les villes minières ; les Indiens, soumis aux missions franciscaines, fournissent l'essentiel de la main-d'œuvre.`,
            },

            // ── Pertinence pour la campagne ────────────────────────
            {
                de: 1712,
                texte: `<strong>Lien avec la piraterie :</strong><br>
Loin des côtes et des routes maritimes, la Nueva Galicia est absente des chroniques pirates — mais ses convois d'argent vers Veracruz constituent une cible permanente pour les pirates opérant dans le golfe du Mexique.`,
            },
        ],


        capitale: 'Guadalajara',
        population_approx: `~15 000 colons<br>~135 000 Indiens`,
        economie: 'Argent (Zacatecas), élevage, textile (obrajes), missions franciscaines',

        note_mj: 'AVERTISSEMENT HISTORIQUE : Le nom précis du Président-Gouverneur de l\'Audiencia de Guadalajara pour la période 1712–1725 n\'a pas pu être établi avec certitude depuis les sources accessibles. Les AGI (Audiencia de Guadalajara, legajos 1–54) constituent la source primaire de référence.',
    },


    // ── MODÈLE COMPLET — Nassau / New-Providence ────────────────────
    // Premier exemple avec changement de puissance en 1718.
    {
        id: 'new-providence',
        nom: 'New Providence',
        tags: ['Nassau', 'New Providence', 'République Pirate', 'Flying Gang'],

        puissance: {
            1712: 'anarchie-pirate',
            1714: 'pirate',
            1718: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Thomas Walker',
                pnj_id: null,
                titre: 'Vice-gouverneur résiduel (sans mandat effectif depuis 1714)',
            },
            1714: {
                nom: 'Conseil de Nassau',
                pnj_id: 'conseil-nassau',
                titre: 'Instance dirigeante',
            },
            1718: {
                nom: 'Woodes Rogers',
                pnj_id: null,
                titre: 'Gouverneur royal',
            },
            1721: {
                nom: 'George Phenney',
                pnj_id: null,
                titre: 'Gouverneur royal des Bahamas',
            },
        },

        contexte: [
            // ── Nassau avant la République ─────────────────────────
            {
                de: 1712, a: 1714,
                texte: `New Providence abrite Nassau, port naturel bien protégé au nord de l'île — le seul véritable havre de l'archipel. Depuis 1706, la ville est un repaire pirate de fait : Hornigold et ses hommes y installent leur base, profitant de l'absence totale d'autorité coloniale.`,
            },

            // ── La République Pirate ───────────────────────────────
            {
                de: 1714, a: 1716,
                texte: `New Providence abrite Nassau, port naturel bien protégé au nord de l'île — le seul véritable havre de l'archipel. Hornigold proclame la République Pirate, ouverte à tous les réprouvés : pirates, corsaires, contrebandiers, déserteurs, esclaves marrons, victimes de persécutions religieuses. Nassau affirme son statut et attire des équipages venus de toutes les Caraïbes. À son apogée, la ville compte jusqu'à un millier de pirates en escale, contre quelques dizaines de civils résidents.`,
            },
            {
                de: 1716, a: 1718,
                texte: `New Providence abrite Nassau, port naturel bien protégé au nord de l'île — le seul véritable havre de l'archipel. À la suite du pillage des épaves de la Flotte au Trésor de 1715, les principaux capitaines de Nassau se fédèrent pour former le <strong>Flying Gang</strong>, se promettant amitié et entraide mutuelle. Nassau se dote d'un Conseil de cinq magistrats élus pour arbitrer les litiges et tenter d'administrer la République Pirate.`,
            },

            // ── Ravitaillement et économie ─────────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Ravitaillement et économie :</strong><br>
Nassau ne produit presque rien. L'île dépend entièrement d'Eleuthera pour ses vivres, son eau et ses provisions de base. Le butin des prises, revendu via des intermédiaires de Kingston, Charles Town ou Curaçao, alimente une économie informelle prospère.`,
            },

            // ── Walker et l'effondrement de l'autorité ────────────
            {
                de: 1712, a: 1716,
                texte: `<strong>Une autorité fantomatique :</strong><br>
Thomas Walker, vice-gouverneur résiduel, tente de maintenir une apparence de légalité — sans soldats, sans budget, sans mandat valide après la mort de la reine Anne en 1714. Son autorité ne s'étend guère au-delà de sa propre maison.`,
            },
            {
                de: 1716, a: 1718,
                texte: `<strong>L'émancipation achevée :</strong><br>
Walker fuit vers Charleston en 1716 après qu'Hornigold a installé des canons dans le fort. Nassau n'a plus aucune autorité formelle — la République Pirate gouverne seule, par la réputation et les équilibres de force entre capitaines.`,
            },

            // ── La chute de Nassau ────────────────────────────────
            {
                de: 1718,
                texte: `<strong>La chute de Nassau :</strong><br>
Le 26 juillet 1718, Woodes Rogers débarque à New Providence avec trois navires de guerre et deux cents soldats. Le Flying Gang se fracture : ceux qui acceptent le pardon royal restent — Hornigold parmi eux — ; les irréductibles fuient ou sont pourchassés. En décembre 1718, les premières pendaisons au fort Nassau marquent la fin de la République Pirate. Nassau redevient une ville coloniale britannique ordinaire, à ceci près que ses habitants portent tous un passé encombrant.`,
            },

            // ── Le retour à l'ordre ───────────────────────────────
            {
                de: 1718,
                texte: `<strong>Le retour à l'ordre :</strong><br>
Rogers gouverne avec des ressources dérisoires — ses soldats meurent de fièvre, ses finances sont à sec, sa garnison est insuffisante. Nassau reste fragile. La piraterie ne disparaît pas ; elle se déplace, cherche d'autres ports, d'autres pavillons.`,
            },
            {
                de: 1720, a: 1721,
                texte: `<strong>Le raid espagnol sur Nassau (février–mars 1720) :</strong><br>
Le 24 février 1720, une force expéditionnaire espagnole — trois frégates et neuf brigantins et sloops, entre 1 300 et 2 000 hommes — paraît devant Nassau. Elle est commandée par Francisco Javier Cornejo, le même officier qui conduisait les galeones de Tierra Firme. L'objectif est d'effacer la tête de pont britannique que Rogers a établie depuis juillet 1718 et, peut-être, de récupérer un archipel que l'Espagne n'a jamais formellement cédé.
<br>
Rogers avait été averti dès février 1719 que les Espagnols préparaient une opération contre les Bahamas. Il avait mis ce délai à profit pour achever la reconstruction de Fort Nassau, terminée en janvier 1720 — six semaines avant l'attaque. La garnison est maigre : deux frégates et environ 600 hommes, civils armés compris. Mais le fort tient. Les Espagnols, incapables de forcer l'entrée du port, se retirent le 1er mars sans avoir débarqué. Un seul sloop espagnol est perdu.`,
            },
        ],

        population_approx: [
            {
                de: 1712, a: 1714,
                texte: `150~200 colons<br>Population flottante variable selon les escales pirates.`,
            },
            {
                de: 1714, a: 1719,
                texte: `~100 colons<br>Jusqu'à 1 000 pirates et activités associées.`,
            },
            {
                de: 1719,
                texte: `~200 colons (dont de nombreux anciens pirates réhabilités)<br>Population flottante réduite à quelques dizaines de marins de passage.`,
            },
        ],

        economie: [
            {
                de: 1712, a: 1718,
                texte: `Butin de prises revendu via intermédiaires (Charles Town, Curaçao, Virginie) ; aucune production locale significative`,
            },
            {
                de: 1718,
                texte: `Commerce colonial ordinaire en reconstruction ; pêche aux éponges ; wrecking`,
            },
        ],

        note_mj: `✅ Woodes Rogers débarque le 26 juillet 1718 — documenté.
    ✅ Thomas Walker fuit à Charleston le 6 août 1716 — Calendar of State Papers.
    ✅ Commission de Walker expirée à la mort de la reine Anne (août 1714) — il agit sans mandat légal depuis cette date.
    ✅ Hornigold figure tutélaire — aucun titre formel, autorité de fait reconnue par ses pairs.`,
    },

    {
        id: 'eleuthera',
        label: 'Eleuthera',
        nom: 'Eleuthera & Harbour Island',
        tags: ['Eleuthera', 'Harbour Island', 'Spanish Wells', 'Governor\'s Harbour'],

        puissance: {
            1712: 'conteste',
            1714: 'pirate',
            1718: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Thomas Walker',
                pnj_id: null,
                titre: 'Vice-gouverneur résiduel des Bahamas (replié à Harbour Island)',
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

        contexte: [
            // ── Géographie et peuplement ──────────────────────────
            {
                de: 1712,
                texte: `Eleuthera est une île longue et étroite (environ 180 km, parfois moins de deux kilomètres de large), à 80 km à l'est de Nassau. Sa morphologie extrême en fait un espace tourné entièrement vers la mer. Harbour Island, sur un îlot au nord-est, est le principal centre habité : environ 30 familles en 1717, soit 150 à 200 résidents permanents.`,
            },

            // ── Origines et culture politique ─────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Les Eleutheran Adventurers :</strong><br>
Fondée en 1648 par des Puritains expulsés des Bermudes, Eleuthera tient son nom du grec <em>eleútheros</em> — libre. Ses habitants sont les descendants de dissidents protestants républicains hostiles par tradition à la monarchie absolutiste.`,
            },
            {
                de: 1718,
                texte: `<strong>Les Eleutheran Adventurers :</strong><br>
Fondée en 1648 par des Puritains expulsés des Bermudes, Eleuthera tient son nom du grec <em>eleútheros</em> — libre. Ses habitants sont les descendants de dissidents protestants républicains hostiles par tradition à la monarchie absolutiste. Cette mémoire longue les range naturellement dans le camp hanovrien et protestant en 1718, quand la question du pardon royal divise Nassau.`,
            },

            // ── Rôle par rapport à Nassau ─────────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Le grenier de Nassau :</strong><br>
Nassau ne produit presque rien — Eleuthera est son principal fournisseur en vivres frais, eau douce et provisions. Ce monopole de fait sur le ravitaillement donne aux réseaux d'Eleuthera un levier politique réel sur la République Pirate. Hornigold, qui contrôle ces réseaux via les familles Darvill et Cockram, tire de là une part de son autorité que ses rivaux ne peuvent lui contester.`,
            },
            {
                de: 1712, a: 1718,
                texte: `<strong>Interface commerciale :</strong><br>
Harbour Island est le sas entre Nassau et le monde légal. Des marchands de Boston, de Charles Town et de Curaçao y traitent avec la communauté pirate sans se compromettre directement à Nassau. Le rapport Musson de 1717 mentionne deux navires de 90 tonneaux venus de Boston vendre des provisions aux pirates — à Harbour Island, pas à Nassau. Richard Thompson et John Cockram importent des marchandises manufacturées depuis Curaçao et les colonies continentales. En retour, bois de brésillet, tortues et denrées locales partent vers les colonies continentales et la Jamaïque.`,
            },

            // ── Après Rogers ──────────────────────────────────────
            {
                de: 1718,
                texte: `Les familles d'Eleuthera acceptent le pardon de 1718 sans état d'âme — leur loyauté allait à Hornigold plus qu'à la piraterie en soi. Daniel Stillwell reprend sa navette commerciale légale entre Eleuthera et la Jamaïque. Les chantiers de Harbour Island se spécialisent dans la construction de petites embarcations, activité qui connaîtra une réputation croissante dans les décennies suivantes.`,
            },
        ],

        population_approx: [
            {
                de: 1712, a: 1718,
                texte: `~200 résidents permanents à Harbour Island<br>~150 sur le corps principal d'Eleuthera.<br>Population flottante variable selon les escales pirates.`,
            },
            {
                de: 1718,
                texte: `Recensement Rogers :<br>124 blancs + 5 noirs à Harbour Island<br>150 blancs + 34 noirs sur Eleuthera.`,
            },
        ],

        economie: 'Vivres et eau pour Nassau, bois de brésillet (teinture textile), pêche et tortues, construction navale, récupération sur épaves (wrecking).',
        note_mj: `Statuts des données :
    ✅ Établi : origine puritaine 1648 ; recensement Rogers 1722 ; rapport Musson 1717 ; batterie Walker à Harbour Island.
    ✅ Personnages attestés : Jonathan Darvill, Daniel Stillwell, Richard Thompson, John Cockram (Calendar of State Papers, B.C. Brooks, Wikipedia).
    🎲 Fiction de campagne : le Conseil de Nassau comme autorité de substitution sur Eleuthera à partir de 1714 — Eleuthera n'est pas formellement gouvernée depuis Nassau, mais dans sa sphère d'influence directe via Hornigold.
    Sources : Calendar of State Papers Colonial ; B.C. Brooks, Bahamas Shipping Records 1721–1725 ; Colin Woodard, Republic of Pirates (2008).`,
    },

    // ── BERMUDES ─────────────────────────────
    {
        id: 'bermudes',
        nom: 'Bermudes',
        tags: ['Bermudes', 'Bermuda', 'Saint George\'s', 'Atlantique Nord'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Benjamin Bennett',
                pnj_id: null,
                titre: 'Lieutenant-Gouverneur',
            },
            1713: {
                nom: 'Henry Pulleine',
                pnj_id: null,
                titre: 'Lieutenant-Gouverneur',
            },
            1718: {
                nom: 'Benjamin Bennett',
                pnj_id: null,
                titre: 'Lieutenant-Gouverneur (second mandat)',
            },
            1722: {
                nom: 'Sir John Hope',
                pnj_id: null,
                titre: 'Lieutenant-Gouverneur',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Archipel corallien britannique au large de l'Atlantique Nord, les Bermudes occupent une position stratégique sur les routes reliant l'Angleterre aux Antilles. La colonie vit de la construction navale — le cèdre des Bermudes est réputé dans tout l'Atlantique — de la course et du commerce maritime. Ses marins et pilotes sont parmi les plus compétents des Caraïbes.`,
            },

            // ── Lien avec la piraterie ─────────────────────────────
            {
                de: 1712, a: 1720,
                texte: `<strong>Les Bermudiens et la piraterie :</strong><br>
Plusieurs pilotes bermudiens se retrouvent parmi les équipages pirates des Bahamas — leur connaissance des hauts-fonds de l'archipel est un atout irremplaçable.<!-- Le gouverneur Bennett doit en 1719 convoquer son conseil pour traiter spécifiquement de ce problème.--> Les liens familiaux et commerciaux entre les Bermudes et Nassau sont anciens : le même réseau qui exploite saisonnièrement le sel des Turks Islands fournit à l'occasion des provisions ou des informations aux pirates.`,
            },

            // ── Après 1718 ────────────────────────────────────────
            {
                de: 1718,
                texte: `<strong>Surveillance renforcée :</strong><br>
Le retour de Bennett coïncide avec la grande vague d'amnistie et de répression de 1718. Les Bermudes, traditionnellement liées aux Bahamas par des liens familiaux et commerciaux anciens, voient leur gouverneur sommé de surveiller de près les allées et venues des navires suspects.`,
            },
        ],


        capitale: 'Saint George\'s',
        population_approx: '~6 000 habitants (dont ~2 000 esclaves)',
        economie: 'Construction navale (cèdre), course, pêche, sel (Turks Islands)',

        note_mj: 'Le titre officiel est Lieutenant-Gouverneur jusqu\'en 1738. Succession confirmée par le site officiel du gouvernement des Bermudes et Wikipedia EN. Bennett 1701–1713 et 1718–1722 : double mandat avéré.',
    },


    {
        id: 'jamaique',
        nom: 'Jamaïque',
        tags: ['Jamaïque', 'Jamaica', 'Kingston', 'Port Royal', 'Spanish Town'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Lord Archibald Hamilton',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
            1716: {
                nom: 'Peter Heywood',
                pnj_id: null,
                titre: 'Gouverneur par intérim',
            },
            1718: {
                nom: 'Sir Nicholas Lawes',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
            1722: {
                nom: 'Henry Bentinck, duc de Portland',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Colonie britannique depuis 1655, la Jamaïque est la principale base navale et commerciale de la Couronne dans les Antilles. Spanish Town est la capitale administrative — siège du gouverneur et de l'Assemblée. Kingston est le centre marchand de facto depuis 1693 ; Port Royal, à l'entrée de la baie, reste la base militaire et navale.`,
            },

            // ── Port Royal / Kingston ──────────────────────────────
            {
                de: 1712,
                texte: `<strong>Port Royal et Kingston :</strong><br>
Le séisme de 1692 a englouti les deux tiers de Port Royal — mais la ville n'a pas disparu. Elle continue d'exister comme base navale et lieu d'exécution des pirates (le Gallows Point). La population civile s'est reportée sur la rive opposée, où Kingston a été fondée en 1693. Les deux sites sont distincts et séparés par la baie.`,
            },

            // ── Commerce interlope ─────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Commerce interlope :</strong><br>
Le commerce jamaïcain avec les colonies espagnoles voisines — Cuba, Terre Ferme, Porto Rico — est une réalité que tout le monde feint d'ignorer. Kingston est aussi la destination naturelle du butin pirate revendu par des intermédiaires discrets. Les marchands de Nouvelle Angleterre qui ravitaillent Nassau transitent souvent par Kingston pour y écouler les prises.`,
            },

            // ── Hamilton et la complicité pirate ──────────────────
            {
                de: 1712, a: 1716,
                texte: `<strong>Lord Hamilton et la piraterie :</strong><br>
Hamilton est accusé d'avoir fourni des lettres de marque vides à des capitaines qui les ont utilisées pour couvrir des activités pirates. Ses liens avec des équipages opérant depuis Nassau sont établis, en particulier Henry Jennings. Il est rappelé à Londres en 1716 pour répondre de ses actes.`,
            },

            // ── Heywood et l'apogée pirate ────────────────────────
            {
                de: 1716, a: 1718,
                texte: `<strong>L'apogée de la Flying Gang :</strong><br>
Heywood assure l'intérim sans autorité réelle. Hornigold et Barbe-Noire opèrent librement entre Nassau et les côtes de la Jamaïque. Port Royal accueille des frégates de la Royal Navy dont les commandants manquent d'instructions claires. Le Gallows Point n'a pas vu de pirate se balancer à ses gibets depuis des années.`,
            },

            // ── Lawes et la répression ────────────────────────────
            {
                de: 1718, a: 1721,
                texte: `<strong>Sir Nicholas Lawes — la répression :</strong><br>
Lawes prend le gouvernorat avec un mandat explicite. Il fait arrêter, juger et pendre les pirates capturés dans les eaux jamaïcaines sans attendre d'instructions de Londres. Port Royal reprend son rôle sinistre — le Gallows Point redevient un lieu d'exécution publique et ostentatoire, signal politique autant que mesure de sécurité.`,
            },
            {
                de: 1721, a: 1723,
                texte: `<strong>Sir Nicholas Lawes — la répression :</strong><br>
Lawes poursuit sa politique de fer. En 1721, Charles Vane, l'un des derniers capitaines pirates de la grande époque, est pendu à Kingston après un naufrage qui l'a livré aux autorités. Son corps est exposé en cage de fer à l'entrée du port — avertissement visible pour tout navire entrant dans la baie.`,
            },
        ],


        capitale: 'Spanish Town (siège du gouverneur) ; Kingston (centre marchand)',

        population_approx: [
            {
                de: 1712,
                texte: `~56 000 habitants (dont ~48 000 esclaves africains)`,
            },
        ],

        economie: 'Sucre, rhum, indigo ; commerce interlope avec les colonies espagnoles ; transit du butin pirate (1712–1718)',

        note_mj: `✅ Succession des gouverneurs : Feurtado/Cundall, Historic Jamaica ; Wikipedia EN.
    ✅ Complicité Hamilton : Calendar of State Papers Colonial ; Woodard, Republic of Pirates (2008).
    ✅ Affaire Rackham 1720 : Johnson, General History (1724) ; Wikipedia EN (Calico Jack).
    ✅ Port Royal / Kingston : Dunn, Sugar and Slaves (1972) ; Pawson & Buisseret, Port Royal, Jamaica (1975).`,
    },

    {
        id: 'saint-domingue',
        nom: 'Saint-Domingue',
        tags: ['Saint-Domingue', 'Cap-Français', 'Cap Haïtien', 'Port-de-Paix', 'Haïti'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La partie occidentale d'Hispaniola, cédée à la France en 1697, est la colonie sucrière la plus productive des Antilles françaises. Sa richesse repose sur une contradiction structurelle : une main-d'œuvre servile représentant plus des quatre cinquièmes de la population, une hiérarchie sociale rigide entre <em>Grands Blancs</em>, <em>Petits Blancs</em>, <em>affranchis</em> et esclaves, et un trafic négrier massif qui ne cesse de croître.`,
            },

            // ── Cap-Français ──────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Cap-Français :</strong><br>
La capitale — "le Cap" pour ses habitants — est bâtie sur une plaine étroite entre la mer et les mornes du nord d'Hispaniola. Ses quais voient transiter le sucre, l'indigo et le cacao vers Bordeaux et Nantes. C'est le centre nerveux de la colonie : le gouverneur y réside, le Conseil supérieur y siège, les négociants de toute la Caraïbe y font escale. Les tavernes, maisons closes et entrepôts du port constituent une économie parallèle fréquentée par des marins de toutes nationalités, dont certains n'ont pas toujours de papiers en règle.`,
            },

            // ── Dernière gouvernance unifiée ──────────────────────
            {
                de: 1712, a: 1713,
                texte: `<strong>Dernière gouvernance unifiée :</strong><br>
Le gouverneur d'Arquian est le dernier à porter le titre de gouverneur général de toutes les Antilles françaises — un poste coiffant Saint-Domingue, la Martinique, la Guadeloupe et les Petites Antilles. Cette organisation prend fin en 1714 avec la création de deux gouvernements distincts.`,
            },

            // ── Blénac et la division de 1714 ─────────────────────
            {
                de: 1713, a: 1717,
                texte: `<strong>Blénac et la division de 1714 :</strong><br>
Louis de Courbon, comte de Blénac, fils du célèbre amiral gouverneur des Antilles sous Louis XIV, est un administrateur compétent et moins vénal que ses prédécesseurs. En 1714, Paris crée deux gouvernements distincts : Blénac reste à Saint-Domingue ; un gouverneur général des Îles du Vent est nommé séparément à Fort-Royal. Cap-Français devient la capitale autonome d'une entité coloniale à part entière.`,
            },

            // ── Saint-Domingue et la piraterie ────────────────────
            {
                de: 1713, a: 1718,
                texte: `<strong>Saint-Domingue et la piraterie :</strong><br>
Cap-Français est un port de transit incontournable pour les navires opérant entre les Antilles et les côtes nord-américaines. Les pirates connaissent le Cap comme une escale où l'on peut vendre une prise, recruter et repartir — à condition de ne pas attirer l'attention. Ni Blénac ni Châteaumorand n'ont les frégates ni l'instruction d'en faire une priorité.`,
            },

            // ── Châteaumorand et le Gaoulé ────────────────────────
            {
                de: 1717, a: 1719,
                texte: `<strong>Châteaumorand et les tensions créoles :</strong><br>
Le mandat de Châteaumorand coïncide avec le Gaoulé de Martinique (mai 1717) — soulèvement des grands planteurs contre l'autorité métropolitaine. Les échos atteignent Saint-Domingue sans y déclencher d'incident comparable : les Grands Blancs dominguois sont tout aussi hostiles aux réformes fiscales de Paris, mais leur résistance prend des formes moins spectaculaires — contrebande organisée, corruption des fonctionnaires locaux, pression sur le Conseil supérieur.`,
            },

            // ── Sorel et l'après-piraterie ────────────────────────
            {
                de: 1719, a: 1724,
                texte: `<strong>Sorel et la croissance :</strong><br>
Le mandat de Sorel correspond à la période post-Rogers. La Flying Gang est brisée, mais des équipages indépendants continuent d'opérer. La colonie poursuit son expansion : la plaine du Nord est la zone de plantation la plus dense, l'Artibonite et le Sud sont en cours de développement. Le nombre d'esclaves importés atteint des sommets. Cette croissance porte en elle les contradictions qui mèneront à la révolution de 1791 — mais en 1719, personne ne les perçoit comme telles.`,
            },
        ],


        capitale: 'Cap-Français (Le Cap)',

        population_approx: [
            {
                de: 1712, a: 1718,
                texte: `~87 000 habitants (dont ~75 000 esclaves)`,
            },
            {
                de: 1718,
                texte: `~145 000 habitants (dont ~130 000 esclaves) — croissance rapide par trafic négrier`,
            },
        ],

        economie: 'Sucre (plaine du Nord, Artibonite), indigo, cacao, café (en développement) ; trafic négrier massif ; commerce interlope avec les colonies anglaises et hollandaises',

        note_mj: `✅ Succession des gouverneurs : ANOM, Wikipedia FR/EN, gouverneurs_caraibes.html.
    ✅ Division du gouvernement des Antilles françaises en 1714 : établi.
    ✅ Châteaumorand : 11 jan. 1717 – 10 juil. 1719. Sorel : 10 juil. 1719 – 6 déc. 1723.
    ⚠️ Population : estimations (Pritchard, Debien) — recensements fragmentaires pour la période.
    🎲 Cap-Français est le décor de "Satiété engendre Démesure" (janvier 1714, sous Blénac).`,
    },

    {
        id: 'tortue',
        nom: 'Île de la Tortue',
        tags: ['Tortue', 'Île de la Tortue', 'Tortuga', 'flibuste'],

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

        contexte: [
            // ── Situation en jeu ──────────────────────────────────
            {
                de: 1712,
                texte: `Petite île côtière au nord-ouest d'Hispaniola, aujourd'hui déserte ou presque. Son heure de gloire est un demi-siècle révolue : dans les années 1640–1680, la Tortue était la principale base des flibustiers français des Caraïbes — le repaire de l'égorgeur l'Olonnais, de Bertrand d'Ogeron qui y installa la première administration française. C'est depuis la Tortue que la colonisation française de Saint-Domingue a rayonné vers l'ouest. En 1713, elle est rattachée à Saint-Domingue, dotée d'une petite garnison et d'un gouverneur subalterne, et son activité se résume à un mouillage abrité sur la route du Cap-Français.`,
            },

            // ── Réputation parmi les marins ───────────────────────
            {
                de: 1712,
                texte: `<strong>La mémoire des flibustiers :</strong><br>
Pour tout marin des Caraïbes, la Tortue est un nom chargé. Les vieux boucaniers qui y ont séjourné dans les années 1660–1670 en gardent des récits que les tavernes de Nassau ou de Port Royal amplifient à loisir. Aujourd'hui que la flibuste institutionnelle est morte, l'île n'est plus qu'un fantôme glorieux — mais un fantôme dont on parle encore, et dont la rade peut toujours servir de mouillage discret à qui veut éviter les regards du Cap-Français.`,
            },

            // ── Qualités sanitaires ───────────────────────
            {
                de: 1712,
                texte: `<strong>La qualité de l'air :</strong><br>
La Tortue jouit d'une réputation tenace parmi les marins et les colons de la côte : on y respire mieux qu'au Cap-Français. Nul ne saurait l'expliquer au juste — les médecins évoquent les vents de mer, l'absence de marais, l'air vif des hauteurs — mais le fait est là : la fièvre jaune, qui décime régulièrement les quartiers bas de Saint-Domingue, épargne presque toujours l'île. Un homme qui tousse, qui a la peau jaunie, qui sent le mal venir, cherche à gagner la Tortue. On y guérit, dit-on. Ou du moins on n'y meurt pas de ça.`,
            },

        ],


        capitale: 'Basse-Terre (bourg principal)',
        population_approx: `Quelques centaines d'habitants — garnison, colons, pêcheurs`,
        economie: 'Mouillage de transit, pêche, élevage de subsistance',

        note_mj: `La Tortue n'a plus de gouverneur propre à cette époque — elle relève du gouverneur général de Saint-Domingue.
Flibustiers notables liés à la Tortue : François l'Olonnais (mort ~1668), Henry Morgan (y fit escale avant Port Royal), Bertrand d'Ogeron (gouverneur 1665–1675, organisateur de la flibuste institutionnelle).
La réputation sanitaire de la Tortue est attestée dans les sources — c'est l'une des rares valeurs que lui reconnaissent les textes du XVIIIe siècle. L'explication réelle (moins de moustiques Aedes aegypti en altitude, pas de zones marécageuses étendues) était évidemment inconnue des contemporains, qui raisonnaient en termes de « miasmes » et de qualité de l'air.
À ne pas confondre avec l'île de la Tortue vénézuélienne (nord de la côte de Cumaná) — voir note dans l'entrée correspondante.`,
    },

    {
        id: 'santo-domingo',
        label: 'Santo Domingo',
        nom: 'Santo Domingo (Hispaniola espagnole)',
        tags: ['Santo Domingo', 'Hispaniola', 'République Dominicaine'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La partie orientale d'Hispaniola, sous souveraineté espagnole depuis 1492, est en 1712 une colonie appauvrie et quasi abandonnée. Depuis les <em>devastaciones de Osorio</em> de 1605 — qui forcèrent le repeuplement de la côte nord pour couper le commerce interlope — l'île n'a jamais retrouvé sa prospérité d'antan. La ville de Santo Domingo conserve son prestige historique (première ville européenne des Amériques, siège de la Real Audiencia) mais la population est clairsemée, l'économie végète.`,
            },

            // ── La Real Audiencia ─────────────────────────────────
            {
                de: 1712,
                texte: `<strong>La Real Audiencia :</strong><br>
Le Président-Gouverneur cumule trois fonctions : chef de l'exécutif civil, commandant militaire et président de la Real Audiencia de Santo Domingo — tribunal qui exerce encore nominalement une juridiction sur les colonies espagnoles des Caraïbes (Cuba, Porto Rico, Floride, Venezuela). En pratique, cette autorité est de plus en plus fictive.`,
            },

            // ── La frontière avec Saint-Domingue ──────────────────
            {
                de: 1712,
                texte: `<strong>La frontière poreuse :</strong><br>
La limite avec Saint-Domingue français à l'ouest n'est tracée nulle part et contrôlée nulle part. Contrebande de bétail, d'esclaves et de denrées traverse quotidiennement une ligne que personne ne surveille vraiment. Les éleveurs espagnols et les planteurs français s'arrangent entre eux, loin de toute autorité.`,
            },

            // ── Constanzo et la stabilité ─────────────────────────
            {
                de: 1715, a: 1724,
                texte: `<strong>Fernando Constanzo y Ramírez :</strong><br>
Son gouvernorat long et relativement stable couvre toute la période de la piraterie. Santo Domingo est trop pauvre et trop isolé pour être une cible pirate sérieuse — la colonie tire paradoxalement profit de sa marginalité.`,
            },
        ],


        capitale: 'Santo Domingo',

        population_approx: `~15 000 à 20 000 habitants : colons espagnols et créoles blancs, population libre de couleur nombreuse (mulâtres et affranchis représentant une part significative),<br>~5 000 esclaves africains (proportion moindre qu'à Saint-Domingue — la colonie espagnole n'a jamais développé l'économie de plantation intensive de sa voisine française)`,

        economie: 'Élevage extensif (bovins, porcs — principale richesse), contrebande avec Saint-Domingue, quelques cultures vivrières',

        note_mj: `Le gouverneur de 1712 (avant Pedro de Niela) n'a pas été identifié avec certitude. Sources : Geni (Gobiernos Coloniales de la Isla Española), archives dominicaines. Fiabilité modérée.`,
    },

    {
        id: 'porto-rico',
        nom: 'Porto Rico',
        tags: ['Porto Rico', 'Puerto Rico', 'San Juan', 'Borinquen'],

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
            },
            1716: {
                nom: 'Alfonso Bortodano',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Presidio périphérique de l'empire espagnol, Porto Rico vaut moins par sa richesse que par sa position : San Juan, capitale fortifiée sur un îlot rocheux, est l'une des places les mieux défendues des Antilles. Le Castillo San Felipe del Morro domine l'entrée du port depuis le XVIe siècle ; le Castillo San Cristóbal protège l'accès terrestre. L'île produit peu pour l'exportation et dépend largement du situado — la subvention annuelle de Mexico pour financer la garnison et l'administration.`,
            },

            // ── Miguel Enríquez ───────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Miguel Enríquez :</strong><br>
La figure dominante de Porto Rico n'est pas le gouverneur. Miguel Enríquez (né en 1674), fils d'une femme autrefois réduite en esclavage, est devenu cordonnier, puis corsaire. Depuis 1702, sa flotte — jusqu'à trente embarcations — protège les côtes espagnoles des incursions anglaises et hollandaises. En 1707, Philippe V le nomme <em>Capitán de Mar y Guerra</em> ; en 1713, il reçoit la <em>Medalla de oro de la Real Efigie</em>, la plus haute distinction honorifique accordable à un non-noble. À cette date, Enríquez est l'homme le plus riche des Caraïbes espagnoles — ses connexions commerciales avec Curaçao, Saint-Thomas et la Nouvelle-Angleterre en font un État dans l'État.`,
            },

            // ── Contrebande et zone grise ─────────────────────────
            {
                de: 1712,
                texte: `<strong>La zone grise :</strong><br>
San Juan est le port espagnol le plus actif des Antilles orientales. La contrebande y est endémique : les marchands anglais et hollandais, qui ne peuvent entrer légalement, font escale à Vieques (<em>Boreque</em> sur la carte) ou dans les anses de la côte nord. Enríquez lui-même opère dans cette zone grise, faisant capturer fictivement des navires amis pour importer leurs cargaisons sous couvert de prises légitimes.`,
            },

            // ── Boreque (Vieques) ─────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Boreque (Vieques) :</strong><br>
À 8 km au sud-est de la pointe orientale de Porto Rico, Vieques est sans administration permanente ni garnison. Revendiquée par l'Espagne, elle reste un territoire vide — mouillage discret pour les navires ne souhaitant pas entrer à San Juan, point d'eau et de ravitaillement pour les équipages en transit entre Saint-Domingue et les Petites Antilles.`,
            },

            // ── Danío Granados vs Enríquez ────────────────────────
            {
                de: 1712, a: 1713,
                texte: `<strong>Danío Granados contre Enríquez :</strong><br>
Le gouverneur Danío Granados tente d'affaiblir Enríquez et de détourner à son profit les opérations de course. Il attaque le corsaire sur le terrain juridique et tente de saisir ses navires — sans succès durable.`,
            },

            // ── Ribera vs Enríquez ────────────────────────────────
            {
                de: 1713, a: 1716,
                texte: `<strong>Juan de Ribera contre Enríquez :</strong><br>
Ribera arrive à San Juan le 23 décembre 1713, ayant entretenu une correspondance amicale avec Enríquez avant son départ — le corsaire avait dépensé plus de 20 000 pièces de huit en cadeaux et prêté son meilleur navire, <em>La Gloria</em>, pour assurer le voyage. Le gouverneur débarque avec ce navire chargé à ras bord de marchandises : son intention réelle était de concurrencer Enríquez plutôt que de le ménager. Il réquisitionne ses équipages et navires sans compensation, sapant l'économie de course que le corsaire a mis dix ans à construire.`,
            },

            // ── Bortodano ─────────────────────────────────────────
            {
                de: 1716, a: 1718,
                texte: `<strong>Bortodano — une neutralité inconfortable :</strong><br>
Son administration est décrite par les sources comme globalement neutre — ni franchement favorable à Enríquez, ni radicalement hostile. Les deux camps lui reprochent tour à tour sa partialité, ce qui dans la logique porto-ricaine de l'époque est presque un certificat d'impartialité.`,
            },

            // ── Second mandat Granados ────────────────────────────
            {
                de: 1720, a: 1724,
                texte: `<strong>Le retour de Granados :</strong><br>
Granados revient en 1720, accueilli par le trésorier Pozo — ennemi déclaré d'Enríquez — qui lui présente d'emblée le corsaire comme adversaire à abattre. Les premiers mois sont violents : Granados confisque la flotte d'Enríquez sous prétexte de contrebande. Mais la dynamique s'inverse : Granados dirige un <em>juicio de residencia</em> contre Pozo, fait saisir sa fortune et l'emprisonne. Pozo disparaît définitivement du Nouveau Monde.`,
            },
            // ── Conséquences de la guerre de la Quadruple-Alliance ─
            {
                de: 1721, a: 1724,
                texte: `<strong>Les conséquences de la paix :</strong><br>
La guerre de la Quadruple-Alliance (1718–1720) avait suspendu l'Asiento britannique, dont Enríquez avait obtenu le bénéfice provisoire. La paix revenue, l'Angleterre récupère ses droits et exige compensation pour le préjudice subi. Enríquez est doublement perdant : il perd l'exclusivité du commerce négrier et doit dédommager les marchands anglais lésés. Ce revers financier considérable fragilise sa position à un moment où ses ennemis à San Juan se font plus actifs.`,
            },

            // ── Ouragans et générosité d'Enríquez ─────────────────
            {
                de: 1718, a: 1722,
                texte: `<strong>Porto Rico sous les ouragans :</strong><br>
Entre 1718 et 1720, plusieurs ouragans dévastent l'agriculture de l'île. Enríquez finance personnellement les secours : 400 jarres de mélasse, un chargement de maïs, la prise en charge des funérailles des indigents. Sa popularité dans les quartiers populaires de San Juan reste intacte, et tranche avec sa disgrâce progressive auprès de l'élite créole blanche.`,
            },
        ],


        capitale: 'San Juan',

        population_approx: `~18 000 sur l'ensemble de l'île<br>(dont ~4500 esclaves)`,

        economie: 'Situado royal, course et prises (réseau Enríquez), contrebande (navires anglais et hollandais via Vieques et côtes nord), gingembre, cuir, tabac, élevage',

        note_mj: `✅ Succession des gouverneurs : EnciclopediaPR, Academic Kids, Geni.
    ✅ Arrivée de Ribera le 23 décembre 1713 (Wikipedia EN, article Miguel Enríquez).
    ✅ Prise de fonctions de Bortodano le 30 août 1716 (EnciclopediaPR).
    ✅ Enríquez — Medalla de oro (1713), flotte de 30 navires, fortune, réseau commercial (Wikipedia EN).
    ✅ Danío Granados condamné sur 46 chefs d'accusation par Mendizábal (EnciclopediaPR).
    ⚠️ "Bortodano" vs "Bertodano" : orthographe instable selon les sources. À trancher sur source primaire (AGI).
    🎲 Enríquez est narrativement inépuisable : mulâtre, fils d'esclave, corsaire anobli, homme le plus riche des Caraïbes. Tout navire croisant entre Porto Rico, Saint-Domingue et les Petites Antilles peut le rencontrer.
    🎲 Vieques : vide administratif réel, mouillage discret utilisable.`,
    },

    {
        id: 'cuba',
        nom: 'Cuba',
        tags: ['Cuba', 'La Havane', 'Havana', 'La Habana', 'Santiago de Cuba', 'Bayamo', 'Matanzas', 'Camagüey'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Cuba est le pivot logistique de l'empire espagnol dans les Caraïbes : La Havane est le point de rassemblement des flottes du Trésor avant leur traversée vers l'Espagne. Le Castillo de los Tres Reyes del Morro domine l'entrée du port. Le tabac de la Vuelta Abajo est la principale richesse locale, cultivé sous un monopole royal qui étouffe autant qu'il enrichit. La colonie est un nœud de tous les circuits commerciaux des Caraïbes occidentales — légaux et interlopes.`,
            },

            // ── Chacón et la suspension de Torres y Ayala ─────────
            {
                de: 1712, a: 1713,
                texte: `<strong>L'intérim de Chacón :</strong><br>
Torres y Ayala a été suspendu en 1711 par l'Audiencia de Santo Domingo à la suite d'une enquête sur sa gestion. Luis Chacón assure l'intérim dans une colonie en attente — ni vraiment gouvernée, ni vraiment à l'abandon.`,
            },

            // ── Torres y Ayala rétabli ────────────────────────────
            {
                de: 1713, a: 1716,
                texte: `<strong>Torres y Ayala rétabli :</strong><br>
Rétabli dans ses fonctions le 14 février 1713 après s'être défendu à Madrid, Torres y Ayala reprend le gouvernorat en fin administrateur : il lance la construction de l'Hôpital San Lázaro pour les lépreux, soutient le monopole tabacier — source de tensions avec les contrebandiers et les producteurs indépendants — et fonde la ville de Santiago del Bejucal. Son second mandat tourne court : en mai 1716, il est à nouveau suspendu par l'Audiencia de Santo Domingo pour corruption et mauvaise gestion des défenses côtières.`,
            },

            // ── La révolte des vegueros ───────────────────────────
            {
                de: 1717, a: 1720,
                texte: `<strong>La révolte des vegueros :</strong><br>
L'instauration du monopole d'État sur le tabac déclenche en 1717 la première révolte cubaine documentée : les <em>vegueros</em>, petits planteurs de tabac de la région de La Havane, se soulèvent contre l'obligation de vendre leur production au prix fixé par la Couronne. La répression est rapide mais le mécontentement structurel persiste. Ce soulèvement est contemporain du Gaoulé de Martinique (mai 1717) : deux colonies distinctes, deux empires rivaux, mais un même ras-le-bol face aux tentatives de réforme fiscale et commerciale qui suivent les traités d'Utrecht.`,
            },
            {
                de: 1720, a: 1723,
                texte: `<strong>La révolte des vegueros — résurgence :</strong><br>
La répression de 1717 n'a rien résolu. En 1720, les vegueros se soulèvent à nouveau contre le monopole tabacier. La Couronne réprime une seconde fois, sans céder sur le fond. Cuba n'est pas une colonie aussi docile qu'elle en a l'air.`,
            },
            {
                de: 1723,
                texte: `<strong>La révolte des vegueros — épilogue :</strong><br>
Troisième soulèvement en 1723. Cette fois la répression est plus sévère : onze meneurs sont pendus, leurs corps exposés le long des routes de la Vuelta Abajo. Le monopole tabacier est maintenu. La région reste durablement hostile à l'autorité coloniale.`,
            },

            // ── Raja et la transition chaotique ──────────────────
            {
                de: 1716, a: 1718,
                texte: `<strong>Une transition chaotique :</strong><br>
Vicente de Raja (1716–1717) est un administrateur médiocre dont le mandat est rapidement entaché de scandales. Destitué par l'Audiencia, il est remplacé par le gouverneur provisoire Gómez Mazaver Ponce de León, qui assure une transition brève avant l'arrivée de Guazo y Calderón.`,
            },

            // ── Guazo y Calderón ─────────────────────────────────
            {
                de: 1718,
                texte: `<strong>Guazo y Calderón :</strong><br>
Il prend le gouvernorat en juin 1718, dans le sillage de la répression anti-pirate qui voit Woodes Rogers s'installer à Nassau. La Havane est la base arrière naturelle des opérations navales espagnoles dans la région — et la ville où transitent toutes les nouvelles, toutes les marchandises, et tous les agents des puissances coloniales des Caraïbes occidentales.`,
            },
        ],


        capitale: 'La Havane',

        population_approx: `~35 000 habitants<br>(dont ~10 000 esclaves)`,

        economie: [
            {
                de: 1712, a: 1717,
                texte: `Tabac (monopole royal en construction), sucre, cuir, cuivre, chantiers navals, commerce de transit`,
            },
            {
                de: 1717,
                texte: `Tabac (monopole royal imposé — source de tensions avec les vegueros), sucre, cuir, cuivre, chantiers navals, commerce de transit`,
            },
        ],

        note_mj: `✅ Torres y Ayala double mandat confirmé, interruption par enquête de l'Audiencia documentée.
    ✅ Séquence complète : Wikipedia EN (List of colonial governors of Cuba).
    ✅ Révolte des vegueros 1717 : établie, Wikipedia EN (Vegueros Revolt).
    ✅ Dates de Raja : 26 mai 1716 au 23 août 1717 — cohérentes entre sources.`,
    },

    {
        id: 'bahamas-archipel',
        nom: 'Bahamas',
        tags: ['Bahamas', 'Abaco', 'Cat Island', 'Exumas', 'Turks Islands'],

        puissance: {
            1712: 'conteste',
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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Archipel de plus de sept cents îles et îlots, dont la grande majorité est inhabitée ou saisonnièrement fréquentée. L'autorité nominale appartient aux Lords Proprietors — les mêmes propriétaires qui gouvernent les Carolines depuis 1663 — mais leur présence est purement théorique : aucun gouverneur effectif ne réside dans les îles depuis plusieurs années, et Thomas Walker, vice-gouverneur résiduel replié à Harbour Island (Eleuthera), n'exerce aucune autorité sur le reste de l'archipel.`,
            },

            // ── Turks Islands ──────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Les Turks Islands — le sel :</strong><br>
Les salines naturelles des Turks Islands fournissent du sel à bas coût à toutes les colonies du littoral atlantique. Des équipages bermudiens y viennent saisonnièrement récolter le sel — une activité source de tension récurrente avec les Français de Saint-Domingue et avec les Espagnols, qui revendiquent ces eaux sans pouvoir les contrôler.`,
            },

            // ── Îles secondaires comme refuge ─────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Un archipel hors de toute autorité :</strong><br>
Abaco, Cat Island et les Exumas sont fréquentées pour l'eau douce, le bois et la pêche à la tortue. Des familles de colons blancs s'y maintiennent dans des conditions précaires. Pour un navire qui cherche à se camoufler, à faire de l'eau ou à caréner loin des regards, ces îles offrent un refuge sans risque de croiser la moindre autorité. Les hauts-fonds et passes coralliennes, connus des seuls pilotes locaux, sont un avantage tactique réel.`,
            },

            // ── Après Rogers ──────────────────────────────────────
            {
                de: 1718,
                texte: `<strong>L'autorité royale — théorique :</strong><br>
L'arrivée de Woodes Rogers étend en principe l'autorité britannique sur tout l'archipel. En pratique, Rogers n'a ni les hommes ni les ressources pour administrer les îles éloignées ; son contrôle effectif se limite à New Providence. Les îles secondaires restent dans un vide administratif réel.`,
            },
        ],


        capitale: '[Aucune — Nassau est la capitale de facto de tout l\'archipel]',

        population_approx: `Quelques centaines de résidents dispersés ; Turks Islands : population saisonnière bermudienne de quelques dizaines de récolteurs de sel`,

        economie: 'Sel (Turks Islands), pêche à la tortue et aux éponges, récupération sur épaves (wrecking), bois de chauffe',

        note_mj: `✅ Exploitation saisonnière du sel des Turks Islands par les Bermudiens : documentée.
    ✅ Woodes Rogers, débarque à Nassau le 26 juillet 1718 ; George Phenney lui succède en 1721.
    ⚠️ Population précise des îles secondaires : aucun recensement avant celui de Rogers en 1722.`,
    },

    {
        id: 'panuco',
        label: 'Pánuco',
        nom: 'Pánuco y Tampico',
        tags: ['Pánuco', 'Tampico', 'Santiago de los Valles', 'Huasteca'],

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

        contexte: [
            // ── Note cartographique ───────────────────────────────
            {
                de: 1712,
                texte: `<strong>Note cartographique :</strong><br>
Pánuco figure séparément de la Nouvelle-Espagne sur la carte en raison d'un usage hérité du XVIe siècle. En 1712, ce n'est plus qu'une alcaldía mayor relevant de la vice-royauté de Nouvelle-Espagne — sans gouverneur propre. L'entrée reflète davantage la tradition cartographique que la réalité administrative.`,
            },

            // ── La Huasteca ───────────────────────────────────────
            {
                de: 1712,
                texte: `Tampico, à l'embouchure du Pánuco sur le Golfe, est la seule ouverture maritime de la région entre Veracruz et la Floride — port fragile, saccagé par les pirates en 1684, dont le traumatisme reste présent dans les mémoires. Le commerce interlope avec des navires anglais est une réalité tolérée faute de moyens de surveillance. La Huasteca est l'un des territoires les moins pacifiés de la vice-royauté : les nations indiennes — Huastèques, Chichimèques et groupes nomades du nord — n'ont jamais été pleinement soumises.`,
            },

            // ── Castañeda et l'expansion vers le nord ─────────────
            {
                de: 1718,
                texte: `<strong>Castañeda et l'expansion vers le nord-est :</strong><br>
En 1718, Castañeda reçoit du vice-roi la licence de mener une expédition vers la sierra Malinchen pour reconnaître des mines signalées dans cette zone à peine cartographiée. Cette initiative marque le début d'une pression coloniale plus active vers le nord-est — région que l'Espagne contrôle nominalement sans la coloniser effectivement.`,
            },
        ],


        capitale: 'Santiago de los Valles ; Tampico (accès maritime)',
        population_approx: `~50 000 habitants<br>(dont ~45 000 indiens dans la Huasteca)`,
        economie: 'Élevage, coton, missions franciscaines, pêche (Tampico), commerce interlope discret',

        note_mj: `✅ Castañeda 1718 et licence d'expédition : Herrera Casasús, UAT, 1988.
    ✅ Saccage de Tampico par les pirates en 1684 : sources locales concordantes.
    ⚠️ Alcalde mayor 1712–1718 : non identifié dans les sources accessibles.`,
    },

    {
        id: 'nouvelle-espagne',
        nom: 'Nouvelle-Espagne',
        tags: ['Nouvelle-Espagne', 'Mexico', 'Ciudad de México', 'Mechoacan', 'Tlascala', 'Acapulco', 'Guaxaca', 'Soco Nusco', 'Tabasco'],

        puissance: {
            1712: 'espagnole',
        },

        gouverneur: {
            1712: {
                nom: 'Fernando de Alencastre Noroña y Silva, duc de Linares',
                pnj_id: null,
                titre: 'Vice-roi et Capitaine général',
            },
            1716: {
                nom: 'Baltasar de Zúñiga y Guzmán, marquis de Valero',
                pnj_id: null,
                titre: 'Vice-roi et Capitaine général',
            },
            1722: {
                nom: 'Juan de Acuña, marquis de Casafuerte',
                pnj_id: null,
                titre: 'Vice-roi et Capitaine général',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Cœur du monde colonial espagnol, la Nouvelle-Espagne finance l'empire : ses mines d'argent de Zacatecas, Guanajuato et San Luis Potosí alimentent le trésor royal. Le vice-roi exerce une autorité nominale sur un territoire immense, du Guatemala aux frontières septentrionales du Nouveau-Mexique et de la Californie.`,
            },

            // ── Linares ───────────────────────────────────────────
            {
                de: 1712, a: 1716,
                texte: `<strong>Le duc de Linares :</strong><br>
Il gouverne dans un contexte difficile : épidémies, famines et séismes frappent Mexico en 1713–1714. Réputé pour sa générosité envers les victimes et pour avoir fondé la première bibliothèque publique de Nouvelle-Espagne.`,
            },

            // ── Valero ────────────────────────────────────────────
            {
                de: 1716, a: 1722,
                texte: `<strong>Le marquis de Valero :</strong><br>
Il hérite d'une vice-royauté en mouvement : les réformes bourboniennes remodèlent l'administration coloniale. Il expulse la colonie britannique de la Laguna de Términos (Campeche), fortifie le Texas face à la pression française depuis la Louisiane, et supervise la fondation de San Antonio de Béxar (1718).<!-- C'est sous son mandat que s'inscrit toute la grande période de la piraterie des Caraïbes — 1716 à 1722. -->`,
            },

            // ── Casafuerte ────────────────────────────────────────
            {
                de: 1722,
                texte: `<strong>Le marquis de Casafuerte :</strong><br>
Né à Lima, il inaugure une ère de stabilité et de réformes administratives. Sous son mandat paraît la première <em>Gaceta de México</em> (1722), premier journal imprimé du continent nord-américain. Face à la pression anglaise croissante au Belize, il commande le premier projet de fortification de Bacalar (<em>Salamanca</em> sur la carte) — signal que la frontière caraïbe du Yucatán devient une priorité stratégique.`,
            },
        ],


        capitale: 'Mexico (Ciudad de México)',
        population_approx: `~1 520 000 habitants<br>(dont ~1 000 000 indigènes, ~400 000 métis et ~120 000 colons blancs)`,
        economie: 'Argent (Zacatecas, Guanajuato), commerce avec Manille (Galion), agriculture, élevage',

        note_mj: `Dates vice-rois : Linares 15 jan. 1711 – 15 août 1716 ; Valero 16 août 1716 – 14 oct. 1722 ; Casafuerte 15 oct. 1722 – 17 mars 1734. Sources : Wikipedia EN, INAH.`,
    },

    {
        id: 'yucatan',
        nom: 'Yucatán',
        tags: ['Yucatán', 'Mérida', 'Salamanca', 'Laguna de Términos', 'Laguna Termina', 'Chetumal', 'Bacalar'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Capitainerie générale semi-autonome depuis 1617, le Yucatán est administré depuis Mérida par un gouverneur-capitaine général rapportant directement au Conseil des Indes, indépendamment du vice-roi de Mexico. La péninsule est dominée par la civilisation maya, christianisée en surface mais profondément attachée à ses traditions. L'économie repose sur l'indigo, le bétail et une contrebande active avec les Anglais installés dans la baie du Belize.`,
            },

            // ── Pression anglaise ─────────────────────────────────
            {
                de: 1712,
                texte: `<strong>La pression anglaise :</strong><br>
La côte caraïbe est pratiquement sans défense contre les incursions anglaises. Les coupeurs de bois de Campêche (<em>logwood</em>) s'installent durablement dans la baie du Belize, source de friction permanente entre Madrid et Londres. La Laguna de Términos, à l'ouest, est une enclave anglaise de fait que le Yucatán ne peut expulser seul.`,
            },

            // ── Expulsion de la Laguna de Términos ────────────────
            {
                de: 1716, a: 1720,
                texte: `<strong>L'expulsion de la Laguna de Términos :</strong><br>
En 1716, le vice-roi Valero envoie une expédition depuis Veracruz pour chasser les Britanniques de la Laguna de Términos — opération réussie militairement mais incapable de résoudre durablement la pression anglaise sur le Belize voisin.`,
            },
        ],


        capitale: 'Mérida',
        population_approx: `~250 000 habitants<br>(dont ~225 000 Mayas)`,
        economie: 'Indigo, bétail, sel, bois de Campêche (logwood), contrebande avec les Anglais',

        note_mj: `Capitainerie générale distincte de la Nouvelle-Espagne depuis 1617. Séquence des gouverneurs : Wikipedia EN (Governor of Yucatán). Note : Alonso de Meneses appartient à la même famille que Francisco de Meneses, président de l'Audiencia de Santafé destitué par ses propres oidores en 1715 — coïncidence notable dans les réseaux coloniaux.`,
    },

    {
        id: 'cayes-belize',
        label: 'Lamanay',
        nom: 'Lamanay & cayes du golfe du Honduras',
        tags: ['Lamanay', 'Turneffe', 'Zaratan', 'Lighthouse Reef', 'Ilbob', 'Quita Zuno', 'Bélize'],

        puissance: {
            1712: 'conteste',
            1718: 'britannique',
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
                titre: 'Autogouvernance des Baymen',
            },
        },

        contexte: [
            // ── Géographie et statut ──────────────────────────────
            {
                de: 1712,
                texte: `Atolls et cayes coralliens au large de la côte du Belize — Turneffe (<em>Lamanay</em>), Lighthouse Reef (<em>Zaratan</em>) et le récif barrière. Revendiqués par l'Espagne comme territoire de la Capitainerie du Guatemala, sans présence permanente d'aucune puissance. Les hauts-fonds interdisent l'entrée aux grands navires et font de ces eaux un refuge naturel pour les embarcations légères.`,
            },

            // ── Les Baymen et le logwood ──────────────────────────
            {
                de: 1712,
                texte: `<strong>Les Baymen et le logwood :</strong><br>
Des coupeurs de bois anglais établis sur la côte du Belize font escale aux atolls pour l'eau douce et l'abri. Le bois de campêche qu'ils exploitent est indispensable aux teintureries européennes — les sloops jamaïcains font régulièrement la route Port Royal – golfe du Honduras pour charger ces cargaisons, en traversant la zone des atolls.`,
            },

            // ── Présence pirate ───────────────────────────────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Mouillage pirate :</strong><br>
Sur la route entre la Jamaïque et le golfe du Mexique, les atolls sont des escales discrètes hors de portée des guarda costas espagnols. Eau douce, abri, hauts-fonds qui écartent les grands navires — Turneffe en particulier est un refuge naturel pour les embarcations légères.`,
            },
            {
                de: 1718, a: 1719,
                texte: `<strong>Mouillage pirate :</strong><br>
Sur la route entre la Jamaïque et le golfe du Mexique, les atolls sont des escales discrètes hors de portée des guarda costas espagnols. En avril 1718, Barbe-Noire fait escale à Turneffe pour faire de l'eau douce — il y capture le sloop <em>Adventure</em> du capitaine Herriot avant de mettre le cap sur les Carolines.`,
            },
            {
                de: 1719,
                texte: `<strong>Mouillage pirate :</strong><br>
Sur la route entre la Jamaïque et le golfe du Mexique, les atolls restent des escales discrètes hors de portée des guarda costas espagnols — la répression de Rogers à Nassau n'y change rien.`,
            },

            // ── Tension hispano-anglaise ──────────────────────────
            {
                de: 1712,
                texte: `<strong>Tension hispano-anglaise :</strong><br>
L'Espagne proteste régulièrement contre la présence anglaise dans ces eaux, mais Bacalar — tête de pont espagnole dans la région — n'est qu'un poste ouvert sans défense organisée. Madrid ne dispose d'aucun moyen de surveillance efficace sur les atolls au large.`,
            },
        ],


        capitale: '[Aucune — atolls sans établissement permanent]',
        population_approx: 'Quelques équipages saisonniers de bûcherons et de pêcheurs ; passage de navires pirates et marchands',
        economie: 'Bois de campêche (logwood), eau douce (ressource stratégique), pêche, mouillage de refuge',

        note_mj: `✅ Barbe-Noire à Turneffe, 4–5 avril 1718 — capture du sloop Adventure de David Herriot (sources concordantes).
    ✅ Bacalar / Salamanca : fort inachevé avant 1729 (Wikipedia EN, Bacalar).
    ⚠️ Toponymes Jaillot : Lamanay → Turneffe (très probable) ; Zaratan → Lighthouse Reef (probable) ; Ilbob, Quita Zuno → non identifiés avec certitude.`,
    },

    {
        id: 'honduras',
        nom: 'Honduras',
        tags: ['Honduras', 'Comayagua', 'Trujillo', 'Nueva Segovia', 'Gracias a Dios', 'Yare River', 'Río Coco'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Province marginale de la Capitainerie générale du Guatemala, administrée depuis Comayagua. Son économie repose sur l'élevage extensif et des mines d'argent en déclin depuis le XVIe siècle. La côte caraïbe est hors de tout contrôle effectif.`,
            },

            // ── La Mosquitia et la pression anglaise ──────────────
            {
                de: 1712,
                texte: `<strong>La Mosquitia :</strong><br>
Les Indiens Misquitos, alliés aux Anglais de Jamaïque, razzient les missions et les villages espagnols tout au long de la côte orientale. Les coupeurs de bois britanniques s'installent impunément sur le littoral du futur Belize, dont la frontière avec le Honduras n'est tracée nulle part. Le gouverneur n'a ni les troupes ni les moyens de les en chasser — et le Président du Guatemala à Santiago, lui-même débordé, ne peut guère l'y aider.`,
            },
        ],


        capitale: 'Comayagua',
        population_approx: `~36 500 habitants (dont ~30 000 Indiens)`,
        economie: 'Élevage, mines d\'argent en déclin, indigo, contrebande avec les Anglais',

        note_mj: `Séquence confirmée par Wikipedia EN (List of governors of Spanish Honduras). Lacune entre Salinas Varona (1709) et Longman (1712) : gouverneur intermédiaire non identifié.`,
    },

    {
        id: 'cote-miskito',
        label: 'Côte Miskito',
        nom: 'Côte Miskito (Mosquito Coast)',
        tags: ['Côte Miskito', 'Mosquito Coast', 'Miskitos', 'Cap Camaron', 'Manglares', 'Pearl Lagoon', 'Cap Gracias a Dios'],

        puissance: {
            1712: 'amerindienne',
        },

        gouverneur: {
            1712: {
                nom: '[Roi Miskito — non identifié avec certitude]',
                pnj_id: null,
                titre: 'Roi des Miskitos (investi à Spanish Town, Jamaïque)',
            },
            1720: {
                nom: 'Jeremy I (probable)',
                pnj_id: null,
                titre: 'Roi des Miskitos',
            },
        },

        contexte: [
            // ── Le royaume ────────────────────────────────────────
            {
                de: 1712,
                texte: `Ni colonie espagnole ni possession britannique, la côte Miskito est un royaume amérindien autonome s'étendant sur 600 km de côtes basses et marécageuses — de l'embouchure du río Aguán (Honduras) jusqu'au río San Juan (Nicaragua). Le roi des Miskitos est investi à Spanish Town par le gouverneur de Jamaïque, mais gouverne de fait depuis le cap Gracias a Dios, nœud de toute navigation dans la zone. Son autorité s'appuie sur la redistribution de marchandises anglaises — fusils, poudre, outils, rhum — aux chefs locaux (<em>siklas</em>). L'Espagne revendique ce territoire sans y maintenir la moindre présence.`,
            },

            // ── Les Miskitos : société et guerre ──────────────────
            {
                de: 1712,
                texte: `<strong>Un peuple guerrier et maritime :</strong><br>
Les Miskitos — mêlant origines amérindiennes et africaines depuis le XVIIe siècle — ont développé une culture maritime armée de fusils anglais qui résiste à toute pénétration espagnole depuis un siècle. Les <em>Zambos</em> (métissés, prédominants au nord) et les <em>Tawiras</em> (amérindiens purs, plus présents au sud à Pearl Lagoon et Bluefields) forment deux groupes distincts dont la rivalité est une ligne de fracture permanente que l'Espagne tente d'exploiter sans succès.`,
            },

            // ── Les routes d'intrusion ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>Trujillo et le Yare River :</strong><br>
À l'ouest, Trujillo — seul port espagnol de la côte — marque la limite de l'autorité de Madrid. Au-delà, le vide. Le Yare River (Río Coco) est navigable depuis la mer jusqu'aux établissements espagnols de l'intérieur : des pirogues de raiders Miskitos, parfois accompagnées de pirates anglais, remontent régulièrement le fleuve. Nueva Segovia a été saccagée en 1701, 1709 et 1711 — la ville sort à peine de son dernier pillage.`,
            },

            // ── Commerce et mouillages ────────────────────────────
            {
                de: 1712,
                texte: `<strong>Commerce et mouillages :</strong><br>
Des marchands jamaïcains font escale à Pearl Lagoon et Bluefields pour troquer marchandises manufacturées contre bois, tortues et poisson séché — et plus discrètement, des prisonniers de guerre. Pour un navire cherchant à disparaître ou à commercer sans se compromettre, la côte Miskito offre des mouillages discrets, des guides pour remonter les fleuves, et une autorité locale pragmatique habituée aux étrangers armés.`,
            },
        ],


        capitale: 'Cap Gracias a Dios',
        population_approx: `~15 000 Miskitos, Zambos et Tawiras dispersés sur l'ensemble du territoire. Présence anglaise sporadique — aucun établissement permanent avant 1732 (Black River).`,
        economie: 'Commerce avec la Jamaïque (fusils et outils contre bois, tortues, esclaves captifs), raids sur les établissements espagnols, pêche côtière',

        note_mj: `✅ Protectorat informel britannique depuis les années 1630–1640 ; investiture du roi à Spanish Town documentée.
    ✅ Cap Gracias a Dios : siège du roi Miskito — sources concordantes.
    ✅ Nueva Segovia saccagée en 1701, 1709 et 1711 (Info-Nicaragua.com, sources concordantes).
    ✅ Distinction Zambos / Tawiras : Wikipedia EN (Miskito people), Conzemius 1932.
    ⚠️ Nom du roi en 1712 : non identifié. Jeremy I est documenté dans les années 1720.
    🎲 Un PJ pêcheur Miskito vient de ce monde — pragmatique, maritime, armé, habitué aux Anglais et méfiant des Espagnols.`,
    },

    {
        id: 'nicaragua',
        nom: 'Nicaragua',
        tags: ['Nicaragua', 'León', 'Granada', 'Río San Juan'],

        puissance: {
            1712: 'espagnole',
        },

        gouverneur: {
            1712: {
                nom: '[Gouverneur non identifié avec certitude avant 1720]',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
            1720: {
                nom: 'Sebastián de Arancibia',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
        },

        contexte: [
            {
                de: 1712,
                texte: `Province pauvre de la Capitainerie générale du Guatemala, administrée depuis León sur la côte pacifique — loin de la côte caraïbe qu'elle ne contrôle pas. La côte atlantique est sous pression permanente des Miskitos et des marchands jamaïcains. Le río San Juan, à la frontière sud, est une route d'intrusion vers Grenade — saccagée par Morgan en 1665, et menacée à chaque génération depuis.`,
            },
        ],


        capitale: 'León (Santiago de los Caballeros de León)',
        population_approx: `~39 000 habitants (dont ~35 000 Indiens)`,
        economie: 'Élevage, cacao, indigo, contrebande anglaise via la Mosquitia',

        note_mj: `Gouverneur 1712–1720 non identifié. Arancibia (1720–1722) confirmé par Wikipedia EN. Sources primaires : AGI (Audiencia de Guatemala).`,
    },

    {
        id: 'guatemala',
        nom: 'Guatemala',
        tags: ['Guatemala', 'Santiago de los Caballeros de Guatemala', 'Chiapa'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Le Royaume de Guatemala est la plus grande entité administrative d'Amérique centrale espagnole — Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica et Chiapas. Sa capitale Santiago de los Caballeros (actuelle Antigua) est l'une des villes les mieux construites de l'empire. Le Président-Gouverneur exerce une autorité quasi-vice-royale, directement responsable devant le Conseil des Indes. L'économie repose sur l'indigo et le cacao ; la côte caraïbe est chroniquement exposée aux Miskitos, aux boucaniers anglais et aux coupeurs de bois du Belize.`,
            },

            // ── Rodríguez de Rivas ────────────────────────────────
            {
                de: 1716,
                texte: `<strong>Rodríguez de Rivas :</strong><br>
Il prend les rênes dans un contexte de tensions accrues : les Anglais étendent leurs postes de coupe de bois sur la côte du Belize, la Mosquitia s'étend vers le sud, et la Laguna de Términos vient d'être reprise aux Britanniques par le vice-roi Valero depuis Veracruz — sans que le problème soit vraiment résolu.`,
            },
        ],


        capitale: 'Santiago de los Caballeros de Guatemala (Antigua)',
        population_approx: `~790 000 habitants (dont ~750 000 Indiens)`,
        economie: 'Indigo (añil), cacao, cochenille, bétail, missions dominicaines et franciscaines',

        note_mj: `Le Chiapas relève de l'Audience de Guatemala, non de Mexico. Soconusco relève de l'Audience de Mexico (exception). Séquence confirmée : Wikipedia ES (Anexo:Gobernantes de la Capitanía General de Guatemala).`,
    },

    {
        id: 'costa-rica',
        nom: 'Costa Rica',
        tags: ['Costa Rica', 'Cartago'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La province la plus pauvre et la plus isolée de la Capitainerie du Guatemala. Cartago, la capitale, ne compte en 1723 que soixante-dix maisons en adobe — indicateur de la misère de la colonie. Faute d'or, d'argent ou de main-d'œuvre indigène disponible, Costa Rica n'a jamais attiré colons ni capitaux. Sa population est une mosaïque de petits propriétaires métis, de quelques esclaves africains employés dans les plantations de cacao de la côte atlantique (Matina), et de populations indiennes de l'intérieur.`,
            },

            // ── Révolte de Presbere ───────────────────────────────
            {
                de: 1712, a: 1716,
                texte: `<strong>L'ombre de Presbere :</strong><br>
Granda y Balbín vient de réprimer la grande révolte de Pablo Presbere (1709) — soulèvement des Indiens de Talamanca qui avait détruit quatorze missions franciscaines. La répression fut sanglante : 700 Indiens capturés, Presbere exécuté par garrote le 1er juillet 1710. La frontière de Talamanca reste une zone sans contrôle effectif espagnol, et les incursions miskitos atteignent désormais la côte atlantique de Costa Rica.`,
            },
        ],


        capitale: 'Cartago',
        population_approx: `~11 500 habitants<br>(dont ~8 000 Indiens)`,
        economie: 'Cacao (côte atlantique), élevage, agriculture de subsistance',

        note_mj: `Gouverneur confirmé en 1710 (Wikipedia EN, article Pablo Presbere). Mandat au-delà de 1712 non documenté avec certitude depuis les sources accessibles. AGI (Audiencia de Guatemala) : source primaire.
Cartago est invisible sur la carte Jaillot : la ville se trouve dans la Meseta Central, à 1 400 mètres d'altitude, dans un intérieur montagneux que les cartographes européens n'ont jamais arpentédirectement. Le "Château de Austria" visible sur la carte aux sources de la rivière Suerre est un fantôme cartographique — le Castillo de Austria avait en réalité été fondé à l'embouchure de ce même fleuve, sur la côte Caraïbe, en 1561 puis 1576, avant d'être définitivement abandonné en 1637. Jaillot l'a déplacé dans les terres et vraisemblablement confondu avec Cartago elle-même, seul centre administratif connu de la province.
Le "Château de Austria" sur la Jaillot : fondé à l'embouchure du río Suerre (côte Caraïbe) en 1561 par Juan de Estrada Rávago, refondé en 1576 par Alonso Anguciana de Gamboa (premier port atlantique de Costa Rica), abandonné en 1637 faute de tirant d'eau. Brièvement réoccupé en 1651, disparu définitivement avant 1708. La Jaillot recopie une source antérieure à 1637 (Sanson ~1650) et place le bourg aux sources du fleuve plutôt qu'à son embouchure — confusion probable avec Cartago, capitale de la province portant le même nom ("Nuevo Cartago y Costa Rica").
La mention "Suere ou Blewfield River" amalgame deux fleuves distincts : le río Suerre/Pacuare (Costa Rica) et la Bluefields River/río Escondido (Nicaragua) — sources cartographiques d'origine différente compilées sans recoupement.`,
    },

    {
        id: 'panama',
        label: 'Panama',
        nom: 'Panama (Tierra Firme)',
        tags: ['Panama (Tierra Firme)', 'Tierra Firme', 'Veragua'],

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

        contexte: [
            // ── La route de l'argent ───────────────────────────────
            {
                de: 1712,
                texte: `L'isthme de Panama est le nœud stratégique de tout l'empire espagnol dans le Pacifique. L'argent péruvien, acheminé depuis Callao jusqu'à Panama City sur la côte pacifique, traverse l'isthme par le <em>Camino Real</em> jusqu'à Portobelo sur la côte atlantique — d'où il devrait embarquer à bord des galions pour Carthagène, La Havane et Séville. Contrôler ou intercepter ce transit, c'est tenir la jugulaire de l'empire. Henry Morgan l'avait compris en saccageant Panama City en 1671 ; la ville reconstruite est depuis mieux fortifiée, mais la vulnérabilité structurelle de l'isthme demeure.`,
            },

            // ── Portobelo — ville morte ────────────────────────────
            {
                de: 1712, a: 1722,
                texte: `<strong>Portobelo, ville en attente :</strong><br>
Depuis 1708, aucun galion espagnol n'a mouillé à Portobelo en provenance d'Espagne. Les foires sont interrompues — non pas suspendues provisoirement, mais simplement absentes, faute de flotte. La ville, insalubre et étouffante en temps ordinaire, végète : une garnison sous-équipée, quelques centaines d'habitants permanents, des guarda costas dont les moyens sont dérisoires. L'argent péruvien continue de traverser l'isthme par le Camino Real, mais il ne parvient plus à Portobelo dans les volumes d'antan : la contrebande française par le cap Horn en capte une part substantielle dès les côtes du Pacifique, avant même que l'isthme soit atteint, tandis que le commerce interlope anglais et hollandais s'en empare le long de la côte atlantique. Portobelo en 1712–1721 est un fort, pas un marché.`,
            },

            // ── Les foires de Portobelo — ce qu'elles étaient ─────
            {
                de: 1712,
                texte: `<strong>Les foires de Portobelo — mémoire d'un système :</strong><br>
Quand les galions arrivaient — ce qui n'est plus le cas depuis 1708 — Portobelo se transformait. Pendant deux à six semaines, elle devenait l'un des plus grands marchés du monde atlantique : marchands de Lima, Buenos Aires, Carthagène et Séville échangeaient l'argent du Pérou contre les manufactures européennes (textiles surtout — draps de laine, toiles de lin, soieries), des outils, du papier, et des marchandises asiatiques réexportées via Séville. Les prix s'envolaient, les tavernes débordaient, les fièvres tropicales décimaient les Européens non acclimatés. Puis les galions repartaient, et la ville se vidait. Cette irrégularité était elle-même une donnée stratégique : les pirates qui attendaient les galions ne savaient jamais exactement quand ni combien de navires arriveraient.`,
            },

            // ── Un isthme mal défendu ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>Un isthme mal défendu :</strong><br>
Le Président-Gouverneur cumule la présidence de la Real Audiencia, l'autorité civile sur Tierra Firme, et le commandement militaire de l'isthme. En théorie, c'est l'une des positions les plus importantes de l'empire. En pratique, les garnisons de Portobelo et de Panama City sont sous-équipées et chroniquement à court de soldats. Le Darién oriental — formellement sous juridiction panaméenne — est en réalité contrôlé par les Kunas, qui le défendent contre toute pénétration espagnole depuis un siècle. La côte atlantique, entre Portobelo et la frontière du Darién, n'est surveillée que de façon intermittente par des <em>guarda costas</em> dont les moyens sont dérisoires.`,
            },

            // ── Guerre de la Quadruple-Alliance ───────────────────
            {
                de: 1718, a: 1721,
                texte: `<strong>Guerre de la Quadruple-Alliance (1718–1720) :</strong><br>
Portobelo n'est pas une cible des opérations militaires britanniques. L'impact local est surtout commercial et juridique : la South Sea Company voit ses facteurs et ses biens confisqués dans les ports espagnols, le navío de permiso prévu pour 1718 est annulé. Mais comme le commerce transatlantique légal est déjà moribond depuis 1708, ces perturbations changent peu à la réalité économique de l'isthme — elles élèvent surtout le risque et le coût de la contrebande interlope, qui reste le seul circuit d'approvisionnement réel.`,
            },

            // ── Instabilité de la tutelle vice-royale ─────────────
            {
                de: 1718, a: 1724,
                texte: `<strong>Une tutelle intermédiaire instable :</strong><br>
Le décret de 1717 crée la vice-royauté de Nouvelle-Grenade, avec Santafé de Bogotá pour capitale, destiné à coiffer les territoires septentrionaux de l'Amérique du Sud — dont Panama fait nominalement partie. La structure existe donc sur le papier au-dessus du Président-Gouverneur de Panama.
<br>
En pratique, Panama continue de traiter directement avec Lima pour tout ce qui touche à la route de l'argent et à l'Armada del Sur — les liens économiques et logistiques avec le Pérou sont bien trop anciens et trop concrets pour se plier à un échelon administratif nouveau et mal installé. La Nouvelle-Grenade est supprimée dès 1724, six ans après sa création, victime des séquelles financières de la guerre de la Quadruple-Alliance. Elle ne sera rétablie qu'en 1739. Pour les gouverneurs de Panama, cet épisode ressemble moins à une réforme qu'à une parenthèse.`,
            },

            // ── Tentative de relance ──────────────────────────────
            {
                de: 1721, a: 1722,
                texte: `<strong>La foire de 1722 — un fiasco révélateur :</strong><br>
En 1720, Madrid décide de relancer les galeones de Tierra Firme. Ils arrivent à Carthagène en août 1721, sous le commandement du général Baltasar de Guevara.`,
            },

            // ── Tentative de relance — et son échec ───────────────
            {
                de: 1722, a: 1723,
                texte: `<strong>La foire de 1722 — un fiasco révélateur :</strong><br>
En 1720, Madrid décide de relancer les galeones de Tierra Firme. Ils arrivent à Carthagène en août 1721, sous le commandement du général Baltasar de Guevara. La foire de Portobelo se tient en 1722 — la première depuis 1708, soit quatorze ans d'interruption. Le résultat est un désastre : le marché américain est saturé par quatorze ans de contrebande ; l'infrastructure logistique est rouillée (le río Chagres obstrué, des cargaisons naufragées en transit) ; le général Guevara lui-même aurait été corrompu par les facteurs anglais de la South Sea Company pour laisser passer le navío de permiso Royal George avec le double de son tonnage légal. Les marchands péruviens préfèrent massivement la marchandise de contrebande, moins chère de 30 à 50 % faute de droits de douane. La foire est un échec retentissant et emblématique de l'agonie du système des flottes.`,
            },
        ],


        capitale: 'Panama City (Ciudad de Panamá)',

        population_approx: `~20 000 habitants<br>(dont ~3 000 esclaves) dans l'isthme entier, Tierra Firme et Veragua comprises)<br>⤷ Panama City (~8 000)<br>⤷ Portobelo (~2 000 en temps ordinaire, dix fois plus pendant les foires)<br>⤷ Veragua (~3 000, très dispersés entre quelques missions et villages côtiers)`,

        economie: [
            {
                de: 1712,
                texte: `Transit de l'argent péruvien (Camino Real, vers la côte atlantique — mais sans foire ni galions depuis 1708).
Commerce de contrebande interlope (anglais, hollandais, français) comme seul circuit d'approvisionnement en manufactures européennes. Guarda costas chroniquement sous-équipés.`,
            },
            {
                de: 1718, a: 1721,
                texte: `Une perturbation supplémentaire : la guerre de la Quadruple-Alliance. Biens anglais confisqués dans les ports espagnols, navío de permiso annulé. Risque accru pour la contrebande interlope, qui reste néanmoins le seul circuit actif.`,
            },
            {
                de: 1722,
                texte: `Tentative de relance des foires (foire de 1722, échec cuisant). Transit de l'argent péruvien. Contrebande toujours dominante. Suppression du vice-royauté de Nouvelle-Grenade (1724) : fragilisation durable de l'autorité coloniale sur la Tierra Firme.`,
            },
        ],

        note_mj: `Panama relève du vice-roi du Pérou (Lima), pas de Mexico — distinction essentielle.<br>
✅ Séquence des gouverneurs : Wikipedia EN (Royal Governor of Panama).<br>
✅ Interruption des foires : 1708–1722, établi (Walker, Spanish Politics and Imperial Trade, 1979 ; Biblioteca Virtual Miguel de Cervantes, Donoso Anes).<br>
✅ Foire de 1722 : fiasco documenté — contrebande, corruption de Guevara, Royal George en surcharge.<br>
✅ Saccage de Panama City par Morgan en 1671 : établi.<br>
✅ Galions de Tierra Firme absents de Portobelo 1708–1721 : foires et galions sont liés — l'un n'existe pas sans l'autre.<br>
⚠️ Veragua : province nominalement distincte, administrée en pratique depuis Panama City — gouverneur propre rare, souvent lieutenance. Population ~3 000 : estimation très approximative faute de recensement.<br>
⚠️ Suspension des foires pendant la guerre de la Quadruple-Alliance : la suspension est antérieure à la guerre (depuis 1708) et lui survit — la guerre n'est pas la cause, c'est la décision de 1720 de relancer les galeones qui met fin à l'interruption.<br>
🎲 Le Darién oriental est traité dans le bloc 'darien' — la frontière entre les deux juridictions est purement théorique.`,
    },

    {
        id: 'darien',
        nom: 'Darién',
        tags: ['Darién', 'Nouvelle Calidonia', 'New Edinburg', 'Kuna Yala'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Aucune autorité coloniale effective]',
                pnj_id: null,
                titre: 'Territoire kuna de facto — revendiqué par l\'Espagne, non administré',
            },
        },

        contexte: [
            // ── Géographie ────────────────────────────────────────
            {
                de: 1712,
                texte: `L'isthme oriental entre Panama City et la Nouvelle-Grenade : une bande de terre étroite couverte de forêts tropicales denses, traversée de fleuves impraticables, bordée à l'est par le Serranía del Darién. La côte caraïbe, découpée en baies peu profondes et en archipels coralliens — dont l'archipel de San Blas (<em>Kuna Yala</em>) — est navigable en sloop ou en pirogue mais impénétrable pour les grands navires. C'est précisément ce qui protège les Kunas depuis un siècle : la géographie est leur meilleure fortification.`,
            },

            // ── Les Kunas ─────────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Les Kunas :</strong><br>
Organisés en communautés villageoises autonomes dirigées chacune par un <em>sayla</em>, les Kunas ne forment pas un État centralisé mais une confédération de fait, liée par une culture commune et une résistance partagée à la colonisation espagnole. Marins accomplis dans l'archipel de San Blas, guerriers redoutables dans la forêt, ils ont repoussé toutes les tentatives espagnoles depuis le XVIe siècle — missions, présides, expéditions militaires. Ils entretiennent des rapports commerciaux discrets avec les pirates et boucaniers anglais : informations sur les galions espagnols, guidage dans les passes de l'archipel, contre armes et poudre. Cette relation n'est pas de la vassalité — les Kunas commercent sur un pied d'égalité qu'ils refusent à tout Européen colonial.`,
            },

            // ── La mémoire écossaise ──────────────────────────────
            {
                de: 1712,
                texte: `<strong>La mémoire écossaise :</strong><br>
La carte Jaillot porte encore les noms <em>Nouvelle Calédonie</em> et <em>New Edinburgh</em> — traces de l'expédition du Darién (1698–1700), par laquelle la Compagnie écossaise tenta d'établir une colonie commerciale à l'entrée des deux océans. Deux tentatives successives se soldèrent par des milliers de morts — fièvre, dysenterie, famine — et une attaque espagnole finale en avril 1700. Les Kunas avaient accueilli les Écossais avec curiosité avant d'assister à leur effondrement ; ils récupérèrent les ruines. L'échec ruina la Compagnie d'Écosse et pesa directement sur l'Acte d'Union de 1707. Pour les personnages britanniques de la campagne, c'est une blessure nationale encore vive : douze ans, c'est la mémoire d'un père ou d'un oncle disparu là-bas. Les structures de bois de New Edinburgh ont disparu sous la végétation — mais les noms restent sur les cartes.`,
            },
        ],


        capitale: `Aucune au sens européen — l'archipel de San Blas (Kuna Yala) est le cœur du territoire kuna`,

        population_approx: `~25 000 Indiens Kunas<br> présence espagnole quasi nulle dans l'intérieur`,

        economie: 'Pêche côtière et navigation en archipel, agriculture vivrière (maïs, manioc, plantain), commerce de guides et d\'informations avec les pirates anglais, troc d\'armes',

        note_mj: `✅ Expédition écossaise du Darién 1698–1700, lien avec l'Acte d'Union 1707 (Wikipedia EN, Darien scheme ; Prebble, The Darien Disaster, 1968).
    ✅ Toponymie Jaillot anachronique : carte de 1708, lieux abandonnés depuis 1700.
    ✅ Résistance kuna documentée — Howe, A People Who Would Not Kneel (1998, Smithsonian).
    ✅ Organisation en communautés à sayla — Howe (1998) ; Sherzer, Kuna Ways of Speaking (1983).
    ⚠️ Relations Kunas / pirates anglais pour 1712 : inférées de la géographie et de la fréquentation documentée au XVIIe siècle — pas de source primaire directe pour 1712–1720.
    ⚠️ Population kuna : aucun recensement fiable. "Quelques dizaines de milliers" est une estimation prudente.
    🎲 Le Darién est à la croisée de la mémoire écossaise, de la résistance amérindienne active, et des routes de l'argent péruvien. Un navire cherchant un passage discret entre les deux océans, ou des informations sur les galions de Portobelo, a une raison de venir ici.`,
    },

    {
        id: 'nouvelle-grenade',
        label: 'Nouvelle-Grenade',
        nom: 'Nouvelle-Grenade & Castilla del Oro',
        tags: ['Nouvelle-Grenade', 'Castilla del Oro', 'Santafé de Bogotá', 'Antiochia'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Le Nouveau Royaume de Grenade couvre un espace immense — plaines caraïbes (Carthagène, Santa Marta), cordillère andine jusqu'à Quito, Llanos jusqu'à l'Orénoque — administré depuis Santafé (Bogotá), relevant nominalement du vice-roi de Lima mais autonome en pratique. Ses richesses sont l'or d'Antioquia et du Choco, les émeraudes de Muzo, et le cacao de la côte. Carthagène de Indias, sur la côte caraïbe, est le port de sortie de toutes ces richesses — et l'une des places les mieux fortifiées des Amériques.`,
            },

            // ── Le coup d'État judiciaire de 1715 ─────────────────
            {
                de: 1715, a: 1719,
                texte: `<strong>Le coup d'État judiciaire :</strong><br>
En 1715, les <em>oidores</em> de l'Audiencia renversent et font arrêter leur propre président, Francisco de Meneses, jugé corrompu et tyrannique. Ils l'envoient prisonnier au château de Bocachica à Carthagène. Cet événement sans précédent dans l'histoire coloniale espagnole déclenche une crise institutionnelle qui remonte jusqu'à Madrid — et convainc la Couronne qu'une autorité plus forte est nécessaire.`,
            },

            // ── Création de la Vice-royauté ────────────────────────
            {
                de: 1717, a: 1724,
                texte: `<strong>La Vice-royauté de Nouvelle-Grenade :</strong><br>
La réponse de Madrid est radicale : par la Real Cédula du 27 mars 1717, Philippe V crée la troisième vice-royauté d'Amérique, avec Santafé pour capitale. C'est la première des grandes Réformes Bourboniennes dans les Indes. Pedrosa y Guerrero arrive en juillet 1718, Villalonga — premier vice-roi officiel — en novembre 1719. La vice-royauté est supprimée dès 1723, jugée trop coûteuse — elle ne sera rétablie définitivement qu'en 1739.`,
            },
        ],


        capitale: 'Santafé de Bogotá',
        population_approx: `~390 000 habitants<br>(dont ~15 000 esclaves et ~350 000 Indiens)`,
        economie: 'Or (Antioquia, Choco), émeraudes (Muzo), platine, indigo, cacao, commerce avec Carthagène',

        note_mj: `✅ "Castilla del Oro" : désignation cartographique ancienne pour la côte caraïbe — provinces de Carthagène et Santa Marta, gouverneurs militaires distincts mais subordonnés à Santafé.
    ✅ Vice-royauté créée par Real Cédula du 27 mars 1717 — établi (Wikipedia ES, BiblioFEP, Universidad de Bergen).
    ✅ Renversement de Meneses par les oidores en 1715 : cause directe de la réforme — documenté.
    ✅ Vice-royauté supprimée en 1723, rétablie en 1739 — établi.`,
    },

/*    {
        id: 'cartagena',
        label: 'Carthagène',
        nom: 'Carthagène de Indias',
        tags: ['Carthagène', 'Cartagena'],

        puissance: {
            1712: 'espagnole',
        },

        gouverneur: {
            1712: {
                nom: '[Gouverneur militaire — non identifié avec certitude]',
                pnj_id: null,
                titre: 'Gouverneur et Commandant militaire de la Plaza de Cartagena',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Carthagène de Indias est le principal port de sortie de l'empire espagnol sur la côte caraïbe de Terre Ferme — l'or d'Antioquia, les émeraudes de Muzo, le cacao de Venezuela y transitent avant d'embarquer pour Séville via La Havane. La ville est aussi l'un des grands marchés de l'Asiento — le commerce d'esclaves africains concédé aux Anglais depuis 1713. C'est une ville de négoce, de transit et de pouvoir, où les décisions prises à Santafé ou à Lima ont des répercussions immédiates sur les quais.`,
            },

            // ── Fortifications ────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>La place forte :</strong><br>
Carthagène est l'une des villes les mieux défendues des Amériques. Le château de Bocachica contrôle l'entrée de la baie intérieure ; les murailles de la ville, renforcées après le sac de Francis Drake (1586) et celui du baron de Pointis (1697), forment une enceinte quasi continue. La garnison est la plus nombreuse de toute la côte caraïbe espagnole. Prendre Carthagène de force est hors de portée d'un équipage pirate — mais la contourner, la renseigner, ou en corrompre les douaniers est une autre affaire.`,
            },

            // ── L'Asiento anglais ─────────────────────────────────
            {
                de: 1713, a: 1720,
                texte: `<strong>L'Asiento anglais :</strong><br>
Le traité d'Utrecht (1713) accorde à la South Sea Company le monopole du commerce d'esclaves africains vers les colonies espagnoles — l'<em>Asiento</em>. Carthagène est l'un des ports d'entrée principaux. Des agents anglais de la Compagnie y résident légalement, ce qui crée une tension permanente entre la présence commerciale britannique officielle et la méfiance espagnole. La guerre de la Quadruple-Alliance (1718–1720) suspend l'Asiento et expulse les agents anglais.`,
            },
            {
                de: 1720,
                texte: `<strong>L'Asiento anglais :</strong><br>
La paix revenue, la South Sea Company reprend ses droits. Les agents anglais réinstallés à Carthagène reprennent le commerce d'esclaves — dans un climat de suspicion mutuelle aggravée par la guerre récente.`,
            },
        ],


        capitale: 'Carthagène de Indias',
        population_approx: `~20 000 habitants (dont une forte proportion d'esclaves africains et d'affranchis)`,
        economie: 'Transit de l\'or et des émeraudes, commerce d\'esclaves (Asiento), import de manufactures européennes, contrebande',

        note_mj: `Carthagène est une alcaldía mayor et place militaire distincte de la Présidence de Santafé, avec son propre gouverneur militaire. Le gouverneur civil de la Nouvelle-Grenade (Santafé) n'a pas autorité directe sur la garnison de Carthagène.
    ⚠️ Gouverneur militaire 1712 : non identifié depuis les sources accessibles. AGI (Audiencia de Santa Fe, legajos 450 et suivants) : source primaire.
    ✅ Sac de Pointis 1697 : établi — dernier grand assaut réussi contre Carthagène avant Vernon en 1741.
    ✅ Asiento anglais (South Sea Company) depuis Utrecht 1713 : établi.`,
    },
*/
    {
        id: 'venezuela',
        label: 'Venezuela',
        nom: 'Venezuela (Province de Caracas)',
        tags: ['Venezuela', 'Caracas', 'Santiago de León de Caracas'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Province espagnole de Terre Ferme s'étendant du cap de la Vela jusqu'à l'est de Caracas, bordée au sud par les Llanos et l'Orénoque. Sa capitale, Santiago de León de Caracas, est entourée de plantations de cacao et d'indigo. Le commerce du cacao de Caracas, illégalement canalisé vers les Hollandais de Curaçao et les Anglais des Antilles, est quasi-institutionnel — les gouverneurs alternent entre répression et participation selon leur intérêt du moment.`,
            },

            // ── Cañas y Merino ────────────────────────────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>Cañas y Merino — l'arbitraire colonial :</strong><br>
Le gouverneur Cañas y Merino réprime violemment la contrebande pour en exercer lui-même le monopole, humilie les membres du cabildo, et ordonne en 1713–1714 l'abattage de tous les arbres de Caracas sous prétexte de raisons sanitaires. Il finit par être destitué sous la pression des notables locaux — mais son successeur intérimaire Bertodano arrive sans mandat clair et sans autorité réelle.`,
            },

            // ── Betancourt y Castro ───────────────────────────────
            {
                de: 1716, a: 1721,
                texte: `<strong>Betancourt y Castro :</strong><br>
Il succède à Bertodano dans un contexte de tensions persistantes entre élites créoles et administration coloniale. La contrebande avec Curaçao et les Antilles anglaises reste la réalité économique dominante — Betancourt y Castro la tolère avec pragmatisme, conscient qu'il n'a pas les moyens de l'éradiquer.`,
            },
        ],


        capitale: 'Santiago de León de Caracas',
        population_approx: `~66 000 habitants<br>(dont ~10 000 esclaves africains et ~48 000 Indiens)`,
        economie: 'Cacao (exportation légale et interlope via Curaçao), indigo, bétail, contrebande',

        note_mj: `✅ Cañas y Merino — abattage des arbres de Caracas 1713–1714 : documenté (Venciclopedia, BiblioFEP).
    ✅ Betancourt y Castro : Wikipedia ES, BiblioFEP.
    ✅ Bertodano : même personnage que gouverneur de Cumaná (1706–1711) et de Porto Rico (1716–1720) — trajectoire confirmée par la Real Academia de la Historia (DBE).
    ⚠️ Population : estimation composite — aucun recensement précis pour la période.`,
    },

    {
        id: 'tortuga-venezolana',
        label: 'Isla La Tortuga',
        nom: 'Isla La Tortuga (Tortuga vénézuélienne)',
        tags: ['Tortuga vénézuélienne', 'Isla La Tortuga'],

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

        contexte: [
            {
                de: 1712,
                texte: `Île plate et aride de 156 km², sans eau douce permanente, à 87 km au nord de la côte vénézuélienne. La carte Jaillot la désigne <em>"Aux Anglois"</em> — formulation qui traduit une réalité de fréquentation plutôt que de souveraineté : l'île est nominalement espagnole depuis 1638, mais officiellement vide depuis l'expulsion des Hollandais par le gouverneur de Cumaná.`,
            },
            {
                de: 1712,
                texte: `<strong>La Flota de Satertuda :</strong><br>
Chaque année, une flotte saisonnière de petits navires anglo-américains — Nouvelle-Angleterre, Bermudes, Antilles britanniques — vient extraire le sel des salines naturelles de la côte sud-est. Ce sel grossier est indispensable aux économies sucrières des Antilles britanniques pour la conservation des aliments. Les Espagnols tolèrent cette fréquentation avec irritation, faute de moyens de l'empêcher. L'île est aussi une escale de pêche à la tortue et un mouillage de fortune pour les navires qui longent la côte vénézuélienne.`,
            },
        ],


        capitale: '[Aucune — île sans établissement permanent]',
        population_approx: `Nulle en permanence ; plusieurs centaines de marins saisonniers lors des récoltes de sel`,
        economie: 'Sel (exploitation anglaise saisonnière), pêche à la tortue',

        note_mj: `✅ Fréquentation anglo-américaine 1638–1781 documentée archéologiquement (Antczak & Antczak, Islands of Salt, 2019).
    ✅ Mention "Aux Anglois" sur la carte Jaillot : fréquentation établie, non souveraineté.
    À ne pas confondre avec l'île de la Tortue haïtienne (nord d'Hispaniola).
    Relève nominalement de la province de Cumaná.`,
    },

    {
        id: 'marguerita',
        label: 'Île Marguerita',
        nom: 'Île Marguerita (Provincia de Marguerita)',
        tags: ['Marguerita', 'Provincia de Marguerita'],

        puissance: {
            1712: 'espagnole',
        },

        gouverneur: {
            1712: {
                nom: '[Gouverneur — non identifié avec certitude]',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général de Marguerita',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Province espagnole depuis 1525 — la première organisée du Venezuela actuel. L'île doit son nom et sa première fortune aux pêcheries de perles (<em>margarita</em>, en latin) qui firent sa gloire au XVIe siècle — épuisées depuis le début du XVIIe. Marguerita est une île double reliée par un isthme étroit, d'environ 1 000 km², séparée de Cumaná par le canal de Bocas. Sa position en fait un point de passage incontournable entre Trinidad, les Petites Antilles et la Terre Ferme espagnole. La capitale administrative est La Asunción ; le port principal, Pampatar.`,
            },

            // ── Économie et vulnérabilité ──────────────────────────
            {
                de: 1712,
                texte: `<strong>Économie et vulnérabilité :</strong><br>
Faute de perles, Marguerita vit de l'élevage caprin et bovin, de la pêche côtière, et d'un commerce de demi-contrebande avec les navires étrangers. Son isolement relatif en fait depuis le XVIe siècle une cible récurrente : les Français l'ont pillée en 1576, 1593 et 1677. La seule défense organisée est le fort de Pampatar (<em>Castillo de San Carlos de Borromeo</em>). Le gouverneur, peu soutenu par le continent, est structurellement porté à fermer les yeux sur un commerce interlope qui fait vivre l'île.`,
            },

            // ── Îlots dépendants ───────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Coche et Cubagua :</strong><br>
L'île de Coche (55 km²) au sud et l'îlot de Cubagua — berceau des pêcheries de perles, fondé vers 1500 sous le nom de Nueva Cádiz, abandonné vers 1543 et en ruines — relèvent de la même gouvernance. Cubagua reste sur les cartes ; sur le terrain, il n'y a plus que des pierres et quelques pêcheurs de passage.`,
            },
        ],


        capitale: 'La Asunción (administrative) ; Pampatar (maritime)',
        population_approx: `~8 000 habitants<br>(dont ~7 000 Indiens)`,
        economie: 'Élevage (bovins, caprins), pêche côtière, commerce intercolonial légal et interlope',

        note_mj: `✅ Population au recensement de 1757 : 10 064 habitants (Vecindario ordonné par le gouverneur Alonso del Río y Castro).
    ✅ Fort de Pampatar (Castillo San Carlos de Borromeo) : fortification existante en 1712.
    ✅ Pillages français 1576, 1593, 1677 : établis.
    ✅ Cubagua (Nueva Cádiz) fondée vers 1500, abandonnée vers 1543 : établi.
    ⚠️ Gouverneur 1712 : non identifié. Source primaire : AGI Santo Domingo, legajos 614 et suivants.`,
    },

    {
        id: 'nouvelle-andalousie',
        label: 'Nouvelle-Andalousie',
        nom: 'Nouvelle-Andalousie (Cumaná)',
        tags: ['Nouvelle-Andalousie', 'Cumaná', 'Santiago de Cumaná'],

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

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Province espagnole de Terre Ferme couvrant l'est du Venezuela actuel, avec Cumaná pour capitale — l'une des plus vieilles villes permanentes des Amériques, fondée en 1515. La province relève de l'Audiencia de Santo Domingo. Son économie repose sur le cacao, la pêche (perles en déclin depuis le début du XVIIe) et une contrebande active avec les Hollandais du Surinam, les Français de Martinique et les Anglais des Petites Antilles. Les missions capucines aragonaises quadrillent l'intérieur ; les Indiens Caribes résistent sur les marges orientales et l'Orénoque.`,
            },

            // ── Ruiz de Murga ─────────────────────────────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>Ruiz de Murga :</strong><br>
Administrateur méticuleux dans une province difficile à gouverner. Cumaná est le point de départ des expéditions vers l'Orénoque et les Llanos — territoire que Madrid revendique et ne contrôle pas. La contrebande avec Trinidad et Marguerita est la réalité économique dominante que Ruiz de Murga surveille sans pouvoir l'éradiquer. Sa mort en 1715 laisse la province sans gouverneur, le cabildo assurant un intérim chaotique.`,
            },

            // ── Vacance et guerre ─────────────────────────────────
            {
                de: 1715, a: 1717,
                texte: `<strong>Vacance de pouvoir :</strong><br>
L'intérim du cabildo coïncide avec les tensions de la guerre de la Quadruple-Alliance qui se profile. La province, sans gouverneur nommé, est particulièrement vulnérable aux incursions pirates et aux empiétements hollandais depuis le Surinam.`,
            },

            // ── Carreño et Tornera Soto ───────────────────────────
            {
                de: 1717, a: 1721,
                texte: `<strong>Carreño :</strong><br>
Il prend le gouvernorat dans un contexte de tensions avec les missions capucines, dont l'influence sur les populations indiennes concurrence l'autorité civile. En 1718, son successeur désigné Tornera Soto fonde de facto la ville de Maturín — acte que ni le roi ni le cabildo ne reconnaissent légalement à l'époque, mais qui marque la pénétration espagnole dans l'intérieur des Llanos.`,
            },
        ],


        capitale: 'Cumaná',
        population_approx: `~53 000 habitants<br>(dont ~6 000 escclaves et ~40 000 Indiens Caribes, Chaimas, Cumanagotes dans les missions capucines)<br>⤷ Cumaná (~8 000)`,
        economie: 'Cacao, pêche côtière, contrebande (Hollandais du Surinam, Français de Martinique), missions capucines',

        note_mj: `Trinidad dépend nominalement de Nueva Andalucía jusqu'en 1731.
    Séquence des gouverneurs : Cronista de Cumaná (Badaracco Rivero, 2012, archives locales). Fiabilité modérée.`,
    },

    {
        id: 'trinidad',
        nom: 'Trinidad',
        tags: ['Trinidad', 'San José de Oruña', 'Puerto España', 'Port of Spain', "Port d'Espagne"],

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

        contexte: [
            // ── Géographie et position ────────────────────────────
            {
                de: 1712,
                texte: `Grande île de 4 800 km² à l'extrémité méridionale des Petites Antilles, séparée du Venezuela par le détroit de Bocas del Dragón (8 km au nord) et le golfe de Paria. Sa position en fait un carrefour naturel entre les Antilles, la Terre Ferme espagnole et l'embouchure de l'Orénoque. Les gouverneurs espagnols résident officiellement à San José de Oruña (Saint Joseph), mais fréquentent davantage Puerto España sur la côte ouest, mieux placée pour surveiller le trafic maritime.`,
            },

            // ── Une île négligée ──────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Une île que l'empire oublie :</strong><br>
Trinidad est la province la plus pauvre et la plus isolée de la juridiction de Cumaná. Le commerce légal est étranglé par le monopole espagnol — aucun navire étranger n'est censé faire escale. En pratique, la contrebande avec les Hollandais du Surinam, les Français de la Martinique et les Anglais de la Barbade est la règle. La garnison est dérisoire — quelques dizaines de soldats mal payés — et la côte est trouée de criques et de baies que personne ne surveille. Un capitaine qui connaît ces eaux peut entrer et sortir sans jamais croiser une autorité espagnole.`,
            },

            // ── Populations et société ────────────────────────────
            {
                de: 1712,
                texte: `<strong>Populations :</strong><br>
La société trinidadienne en 1712 est un mélange instable : quelques centaines de colons espagnols et créoles concentrés dans les villes, une population indienne — Arawaks, Caribes, Waraos — dispersée dans les missions capucines ou retirée dans les forêts et les marais du sud, et une poignée d'esclaves africains employés dans les petites plantations de cacao. Les Waraos, peuple des marais de l'Orénoque dont le territoire chevauche Trinidad et le delta continental, sont des piroguiers hors pair — ils naviguent dans les bayous du sud de l'île que les Espagnols évitent. Les affranchis et les gens de couleur libres forment déjà une couche sociale intermédiaire active dans le petit commerce et la pêche.`,
            },

            // ── Le cacao et la contrebande ────────────────────────
            {
                de: 1712,
                texte: `<strong>Le cacao et la contrebande :</strong><br>
La principale richesse de Trinidad est le cacao — de qualité comparable au cacao vénézuélien, moins coûteux à produire grâce au travail indien des missions. L'île exporte clandestinement vers la Martinique et la Barbade en échange de produits manufacturés européens dont le monopole espagnol interdit l'import. Ces échanges se font de nuit, dans les criques du nord-ouest, avec la complicité tacite des gouverneurs successifs qui prélèvent leur part informelle.`,
            },

            // ── Yarza et la stagnation ────────────────────────────
            {
                de: 1716, a: 1721,
                texte: `<strong>Sous Yarza — la stagnation :</strong><br>
Le mandat de Yarza est une période grise : ni réformes ni catastrophe. La garnison reste insuffisante, la contrebande continue, les missions capucines se disputent les territoires indiens avec les autorités civiles. Les pirates opérant entre les Petites Antilles et la Terre Ferme passent au large de Trinidad sans s'y arrêter — l'île n'a rien à leur offrir qu'ils ne trouvent plus facilement ailleurs. C'est précisément ce relatif désintérêt qui la rend vivable pour ses habitants.`,
            },

            // ── La maladie du cacao ("le blast") ──────────────────
            {
                de: 1722, a: 1726,
                texte: `<strong>La maladie du cacao :</strong><br>
Les plantations de cacao de Trinidad commencent à dépérir. Une maladie inconnue — que les colons appellent simplement <em>the blast</em> — s'attaque aux cacaoyers Criollo, la variété cultivée depuis les années 1670 et introduite du Venezuela. Les plants noircissent, les fruits avortent, les vergers meurent sans que personne ne comprenne pourquoi. Les planteurs tentent de limiter la contagion en arrachant les arbres malades, sans succès.`,
            },
            {
                de: 1726,
                texte: `<strong>L'effondrement du cacao :</strong><br>
Vers 1725–1727, le <em>blast</em> achève de ruiner les plantations de cacao de Trinidad. La quasi-totalité des vergers Criollo disparaît. L'économie de l'île, déjà fragile, perd sa seule ressource d'exportation significative. Les planteurs survivants tenteront de reconstruire à partir de plants de Forastero importés du Venezuela — un hybridage qui donnera finalement naissance au Trinitario, variété résistante qui fera la réputation mondiale du cacao trinidadien au siècle suivant. Mais pour l'heure, l'île est ruinée.`,
            },
        ],


        capitale: 'San José de Oruña (Saint Joseph) ; Puerto España (résidence de fait des gouverneurs)',

        population_approx: [
            {
                de: 1712,
                texte: `~2 500 à 3 000 habitants :<br>~500 Espagnols et créoles<br>~1 000 à 1 500 Indiens dans les missions<br>(Arawaks, Caribes, Waraos)<br>~300 à 500 esclaves africains.`,
            },
        ],

        economie: [
            {
                de: 1712, a: 1725,
                texte: `Cacao (exportation clandestine vers Martinique et Barbade), pêche côtière, élevage, missions capucines, contrebande structurelle`,
            },
            {
                de: 1725,
                texte: `Pêche côtière, élevage, contrebande — le cacao est en voie d'effondrement complet (blast disease)`,
            },
        ],

        note_mj: `Trinidad dépend nominalement de Nueva Andalucía (Cumaná) jusqu'en 1731, date à laquelle elle devient province distincte.
    ✅ Dates des gouverneurs : Wikipedia EN/DE, NALIS (National Library of Trinidad and Tobago). Fiabilité modérée.
    ✅ Waraos : peuple des marais de l'Orénoque, présent à Trinidad et dans le delta continental — établi (Wikipedia EN, Warao people).
    ⚠️ Population 1712 : aucun recensement disponible pour cette date. Estimation construite par extrapolation depuis les données du début du XVIIIe et du recensement anglais de 1783.
    🎲 Un PJ originaire de Trinidad connaît les criques du nord-ouest, les réseaux de contrebande avec la Martinique, et les piroguiers waraos du sud. Il sait que l'autorité espagnole est une fiction pratique — et que les vrais pouvoirs de l'île sont les planteurs créoles, les capucins, et les intermédiaires du commerce interlope.`,
    },

    {
        id: 'suriname',
        nom: 'Suriname',
        tags: ['Suriname', 'Surinam', 'Paramaribo', 'Guyane', 'Provinces-Unies'],

        puissance: {
            1712: 'hollandaise',
        },

        gouverneur: {
            1712: {
                nom: 'Société du Surinam',
                pnj_id: null,
                titre: 'Administration tripartite (Amsterdam / WIC / Van Aerssen)',
            },
        },

        contexte: [
            // ── Un espace fragmenté ───────────────────────────────
            {
                de: 1712,
                texte: `La Guyane telle que la représente la carte Jaillot n'est pas une juridiction unifiée, mais un espace fragmenté entre trois puissances coloniales qui se disputent, s'ignorent ou se tolèrent selon les zones. L'immense arrière-pays — forêts tropicales, fleuves impraticables, nations indiennes autonomes — échappe à toute autorité européenne effective.`,
            },

            // ── La colonie hollandaise ────────────────────────────
            {
                de: 1712,
                texte: `Colonie hollandaise depuis 1667 (traité de Breda — les Anglais cèdent le Surinam aux Provinces-Unies en échange de New Amsterdam), gérée depuis 1683 par la Société du Surinam : triumvirat de la ville d'Amsterdam, de la WIC et de la famille Van Aerssen van Sommelsdijck. Ses plantations de sucre, de cacao et de café — exploitées par une main-d'œuvre servile massive importée d'Afrique — font du Surinam l'une des colonies les plus productives des Caraïbes. Paramaribo est la capitale et le principal port, hub commercial entre les Antilles, les Provinces-Unies et la côte vénézuélienne.`,
            },

            // ── La guerre des Marrons ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>La guerre des Marrons :</strong><br>
La prospérité du Surinam repose sur une violence structurelle : des milliers d'esclaves africains fuient les plantations et se réfugient dans la forêt intérieure, où ils forment des communautés autonomes — les <em>Marrons</em>. Depuis les années 1690, une guerre sporadique oppose les planteurs hollandais et leurs milices à ces communautés, qui maîtrisent le terrain et résistent efficacement. Cette guerre intérieure absorbe des ressources considérables et inquiète toutes les colonies à main-d'œuvre servile des Caraïbes — dont Trinidad et la Martinique, qui y voient un exemple dangereux.`,
            },

            // ── Les franges espagnoles ────────────────────────────
            {
                de: 1712,
                texte: `<strong>Franges espagnoles :</strong><br>
Les prétentions espagnoles sur la Guyane, nominalement rattachées à la Nouvelle-Andalousie (Cumaná), se limitent à quelques missions capucines sans garnison. Les Indiens Caribes, Arawaks et les nombreuses nations de l'intérieur maintiennent une indépendance de facto sur cet arrière-pays que nulle puissance européenne ne contrôle réellement. La Guyane française (Cayenne), hors-champ de cette carte, borde le territoire à l'est.`,
            },


            // ── La Guyane française ───────────────────────────────
            {
                de: 1712,
                texte: `<strong>Guyane française (Cayenne) :</strong><br>
Administrée par un gouverneur nommé depuis Paris — poste peu enviable dans une colonie réputée malsaine et peu rentable. Cayenne est une ville modeste dont la garnison combat perpétuellement la fièvre et le manque de vivres. La colonie survit grâce aux missions jésuites dans l'intérieur et à un maigre commerce de bois et de denrées tropicales. Sa principale utilité géopolitique : marquer la frontière orientale de l'empire espagnol au Venezuela, que Versailles ne reconnaît pas.`,
            },

        ],


        capitale: 'Cayenne (française) / Paramaribo (hollandaise)',
        population_approx: `~3 000 Européens et esclaves (Cayenne)<br>~45 000 habitants (Surinam, dont ~40 000 esclaves)<br>5~10 000 population marron et indienne de l'intérieur`,
        economie: 'Sucre, cacao, café (Surinam) ; bois, missions jésuites (Guyane française) ; prétentions espagnoles sans exploitation effective',

        note_mj: `Colonie hollandaise consolidée depuis 1667 — la mention "Aux Anglois et Hollandois" sur la carte Jaillot est un anachronisme cartographique : Jaillot recopie ici une source antérieure au traité de Breda (1667), probablement Sanson ~1650-1656.
Toponymie de la carte : "Paragotos" (rive est de l'embouchure du Suriname) et "Suriname" (rive ouest) désignent vraisemblablement le même site — Paramaribo — vu depuis deux sources différentes compilées sans recoupement. "Paragotos" est une déformation du nom indigène Parimurbo/Paramaribe, antérieure à la fixation du nom hollandais.
Forts sur la carte : Fort Zeelandia (rive droite du Poumaron, à N.Middelburg) ; Fort Kyck Over Al (río Essequebo, à l'ouest — actuel Guyana) ; Fort Funda (rive gauche du Suriname, en aval de "Suriname"/Paramaribo).
Villes sur la carte : N. Middelburg (río Poumaron/Coppename), Warawalli, Mapueta, Macharibi, Vaperon — établissements de plantation ou postes de traite, sources non recoupées.
Gouverneurs de Surinam pour la période : à rechercher dans les archives de la Société du Surinam (Nationaal Archief, La Haye) si nécessaire pour la campagne.
    ✅ Surinam hollandais depuis 1667 ; Société du Surinam depuis 1683 : établi.
    ✅ Guerre des Marrons au Surinam : documentée depuis les années 1690, continue jusqu'aux traités de paix de 1760–1762.
    ⚠️ Gouverneurs précis de Cayenne et de Surinam pour 1712–1725 : disponibles sur demande si nécessaire pour la campagne.`,
    },

    // ── MARTINIQUE ───────────────────────────────────────────
    {
        id: 'martinique',
        nom: 'Martinique',
        tags: ['Martinique', 'Fort-Royal', 'Saint-Pierre'],

        puissance: {
            1712: 'francaise',
        },

        gouverneur: {
            1712: {
                nom: 'Jean-Pierre de Casamajor de Charritte',
                pnj_id: null,
                titre: 'Gouverneur particulier de la Martinique',
            },
            1714: {
                nom: 'Abraham Duquesne-Guitton, marquis de Bellebat',
                pnj_id: null,
                titre: 'Gouverneur général des Îles du Vent',
            },
            1717: {
                nom: "Antoine d'Arcy, seigneur de La Varenne",
                pnj_id: null,
                titre: 'Gouverneur général des Îles du Vent (expulsé par le Gaoulé)',
            },
            1718: {
                nom: 'François de Pas de Mazencourt, marquis de Feuquières',
                pnj_id: null,
                titre: 'Gouverneur général des Îles du Vent',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Colonie française depuis 1635, la Martinique est le siège administratif des Antilles françaises : Fort-Royal abrite le gouverneur général des Îles du Vent, dont l'autorité s'étend sur la Martinique, la Guadeloupe, la Grenade et les Petites Antilles françaises — mais <em>pas</em> sur Saint-Domingue, qui relève d'un gouvernement général distinct. Il y a donc deux gouvernements généraux français dans les Caraïbes, non un seul.`,
            },

            // ── Fort-Royal et Saint-Pierre ────────────────────────
            {
                de: 1712,
                texte: `<strong>Fort-Royal et Saint-Pierre :</strong><br>
Fort-Royal est la capitale administrative et militaire — résidence du gouverneur, casernes, arsenal, mouillage pour les frégates. Saint-Pierre, sur la côte nord-ouest, est la capitale économique : le port le plus actif, la ville la plus peuplée, le vrai pouls commercial de l'île. Les négociants bordelais y ont leurs comptoirs ; les navires négriers y débarquent ; les contrebandiers hollandais et anglais y trouvent des acheteurs. La tension entre les deux villes — administration militaire contre intérêts commerciaux créoles — est une constante de la vie politique martiniquaise.`,
            },

            // ── Casamajor et Morpain ──────────────────────────────
            {
                de: 1712, a: 1714,
                texte: `<strong>Casamajor de Charritte :</strong><br>
Gouverneur pragmatique et populaire, réputé "doux et ennemi du despotisme", mais avide. Son conflit avec le flibustier Pierre Morpain — dont il s'est approprié la frégate pour 2 000 livres avant de la revendre 6 000 — est connu des milieux maritimes des Antilles. Un gouverneur avec qui on peut s'entendre, à condition d'y mettre le prix.`,
            },

            // ── Duquesne-Guitton ──────────────────────────────────
            {
                de: 1714, a: 1717,
                texte: `<strong>Duquesne-Guitton, marquis de Bellebat :</strong><br>
Neveu du grand amiral Abraham Duquesne, il doit sa nomination à sa récente conversion du protestantisme au catholicisme — conversion opportuniste que ses contemporains ne lui pardonnent pas. Il supervise une colonie prospère mais en tension permanente avec les grands planteurs créoles qui résistent aux réformes métropolitaines.`,
            },

            // ── Le Gaoulé (1717) ──────────────────────────────────
            {
                de: 1717, a: 1718,
                texte: `<strong>Le Gaoulé (mai 1717) :</strong><br>
Antoine d'Arcy de La Varenne arrive avec l'intendant Ricouart pour appliquer des réformes impopulaires : limiter le nombre de sucreries, réprimer les abus judiciaires, interdire le commerce avec l'étranger. Les grands habitants se soulèvent. Le 23 mai 1717, gouverneur et intendant sont arrêtés et renvoyés de force en France. Le Gaoulé illustre la résistance des élites créoles à l'autorité métropolitaine — et la fragilité réelle du contrôle de Paris sur ses colonies. Contemporain de la révolte des vegueros à Cuba, il témoigne d'un même ras-le-bol colonial à l'échelle des Amériques.`,
            },

            // ── Feuquières ────────────────────────────────────────
            {
                de: 1718, a: 1721,
                texte: `<strong>Feuquières et l'après-Gaoulé :</strong><br>
Le marquis de Feuquières succède à La Varenne avec un mandat de stabilisation. Il administre avec prudence, évitant de rouvrir les contentieux du Gaoulé. Son gouverneur particulier de la Martinique, Florimond Hurault de Montigny, est tué en octobre 1720 par Bartholomew Roberts qui l'attaque en mer — incident diplomatique et signal que la piraterie post-Nassau reste une menace réelle pour les intérêts français.`,
            },
            {
                de: 1721,
                texte: `<strong>Feuquières — autorité consolidée :</strong><br>
Après la mort de Montigny et la répression de la piraterie par Rogers à Nassau, Feuquières gouverne des Îles du Vent en relative tranquillité. La Martinique prospère — le sucre et le rhum s'exportent vers Bordeaux ; Saint-Pierre reste le marché le plus actif des Petites Antilles françaises.`,
            },
        ],


        capitale: 'Fort-Royal (Fort-de-France) — siège administratif ; Saint-Pierre — capitale marchande',

        population_approx: `~29 000 habitants<br>(dont ~20 000 esclaves)`,

        economie: 'Sucre, rhum, cacao, indigo ; commerce interlope actif avec Curaçao et Barbade',

        note_mj: `✅ Gouverneurs : ANOM (source primaire), Wikipedia EN/FR, GHCaraibe.org.
    ✅ Distinction Feuquières (gouverneur général des Îles du Vent) / Montigny (gouverneur particulier de la Martinique) : établie.
    ✅ Mort de Montigny par Bartholomew Roberts, octobre 1720 : établie (Wikipedia EN, Johnson General History).
    ✅ Gaoulé du 23 mai 1717 : établi (Wikipedia FR, ANOM).
    ⚠️ Dates précises d'entrée en fonctions de Montigny comme gouverneur particulier : non confirmées par les ANOM pour 1717–1720.
    🎲 Saint-Pierre est le port d'escale naturel pour tout navire français ou neutre dans les Petites Antilles. Le commerce interlope y est structurel — un capitaine avec une cargaison à écouler discrètement y trouvera preneur.`,
    },

    // ── BARBADE ──────────────────────────────────────────────
    {
        id: 'barbade',
        nom: 'Barbade',
        tags: ['Barbade', 'Bridgetown'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Robert Lowther',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
            1715: {
                nom: 'Robert Lowther',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général (second mandat)',
            },
            1720: {
                nom: '[Gouverneur de transition — non identifié]',
                pnj_id: null,
                titre: 'Gouverneur et Capitaine général',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La plus ancienne et la plus prospère des colonies britanniques des Caraïbes. Bridgetown est le centre commercial et administratif ; son port accueille le trafic négrier, les navires marchands de Nouvelle-Angleterre et les frégates de la Royal Navy. L'économie sucrière domine tout — la Barbade produit plus de sucre par acre que toute autre île de la région, au prix d'une population servile écrasante. La colonie est administrée par un gouverneur nommé depuis Londres et une Assemblée locale jalouse de ses prérogatives.`,
            },

            // ── Robert Lowther ────────────────────────────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>Robert Lowther — premier mandat :</strong><br>
Lowther est une figure divisive. Venu en Barbade par mariage dans les plantations Frere, il exerce une autorité jugée despotique : suspend les membres du Conseil qui résistent, tente de poursuivre un avocat pour haute trahison, et est suspecté d'avoir immobilisé des navires de guerre royaux pour empêcher la poursuite de pirates — permettant à ceux-ci de ravager le commerce local. Il est rappelé en Angleterre en février 1714 après plaintes au Conseil privé.`,
            },
            {
                de: 1715, a: 1720,
                texte: `<strong>Robert Lowther — second mandat :</strong><br>
Acquitté à Londres en faisant valoir que ses opposants sont des sympathisants jacobites, Lowther est réintégré par George Ier et reprend ses fonctions vers 1715. Son second mandat est marqué par un conflit avec le révérend William Gordon, qui publie à Londres un pamphlet accusant Lowther de "régime corrompu et tyrannique" — pamphlet brûlé par l'Assemblée de Barbade comme libelle séditieux. Le Board of Trade le rappelle finalement en mars 1720 pour avoir laissé commercer un navire espagnol et accepté des cadeaux illicites du Conseil.`,
            },
        ],

        capitale: 'Bridgetown',
        population_approx: `~50 000 habitants (dont ~42 000 esclaves)`,
        economie: 'Sucre, rhum, mélasse ; commerce de transit vers les colonies continentales',

        note_mj: `✅ Gouverneurs : Wikipedia EN, History of Parliament Online (Lowther entry), Cumbrian Characters.
    ✅ Rétention des navires de guerre pour favoriser les pirates : Lincoln, British Pirates and Society (2014).
    ⚠️ Date exacte de retour de Lowther après réintégration : "vers 1715" — non précisée dans les sources.`,
    },

    {
        id: 'curaçao',
        label: 'Curaçao',
        nom: 'Curaçao (avec Aruba et Bonaire)',
        tags: ['Curaçao', 'Aruba', 'Bonaire', 'Willemstad'],

        puissance: {
            1712: 'hollandaise',
        },

        gouverneur: {
            1712: {
                nom: 'Jeremias van Collen',
                pnj_id: null,
                titre: 'Directeur des îles ABC pour la WIC',
            },
            1715: {
                nom: 'Jonathan van Beuningen',
                pnj_id: null,
                titre: 'Directeur par intérim des îles ABC pour la WIC',
            },
            1720: {
                nom: 'Jan van Beuningen',
                pnj_id: null,
                titre: 'Directeur des îles ABC pour la WIC',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Curaçao est la plaque tournante du commerce hollandais dans les Caraïbes — un entrepôt neutre où transitent marchandises européennes, esclaves africains et produits coloniaux de toutes provenances. Willemstad (Fort Amsterdam) est le port le mieux équipé des Antilles néerlandaises. La WIC y maintient son monopole formel sur le commerce négrier, mais l'île vit surtout de son rôle d'intermédiaire interlope entre les colonies espagnoles du Venezuela et le reste du monde.`,
            },

            // ── Van Collen et l'occupation française ──────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>Van Collen et la guerre :</strong><br>
Jeremias van Collen est réputé corrompu — commerce illicite avec les Français pendant la guerre de Succession d'Espagne, emprisonnement arbitraire de ses adversaires au Conseil. En février 1713, des forces françaises occupent brièvement l'île — épisode court mais humiliant pour la WIC. La paix d'Utrecht règle les contentieux sans indemnité.`,
            },

            // ── Van Beuningen et la continuité ────────────────────
            {
                de: 1715, a: 1720,
                texte: `<strong>L'intérim van Beuningen :</strong><br>
Jonathan van Beuningen — beau-frère de van Collen — assure l'intérim dans la continuité. Curaçao alimente en marchandises les colonies espagnoles du Venezuela et de la Nouvelle-Grenade, qui écoulent en retour cacao, peaux et coupons. La faiblesse militaire de la garnison et la vénalité avérée des administrateurs en font un refuge informel pour des opérations en marge de la légalité. Tout navire avec quelque chose à vendre ou à acheter sans questions trouve ici un interlocuteur.`,
            },
        ],

        capitale: 'Willemstad (Fort Amsterdam)',
        population_approx: `~8 000 habitants<br>(dont ~5 000 à 6 000 esclaves)`,
        economie: 'Commerce interlope, transit négrier (Asiento), entrepôt de redistribution, sel (Bonaire)',

        note_mj: `✅ Directeurs WIC : Geni.com, Genealogie Kerckrinck (nikhef.nl), Wikipedia NL.
    ✅ Occupation française de février 1713 : WorldStatesmen.org.
    ⚠️ Titre "directeur" et non "gouverneur" — usage WIC.
    ⚠️ Dates précises de van Collen : "1710–1715" selon Geni.
    Population : Postma (1990) ; Klooster (1998).`,
    },

    // ── DOMINIQUE ────────────────────────────────────────────
    {
        id: 'dominique',
        nom: 'Dominique',
        tags: ['Dominique', 'Roseau'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Aucune autorité constituée]',
                pnj_id: null,
                titre: 'Île neutre — autorité kalinago de fait sur l\'intérieur',
            },
            1727: {
                nom: '[Premier commandant français non identifié]',
                pnj_id: null,
                titre: 'Commandant français (nomination tacite)',
            },
        },

        contexte: [
            // ── Statut et géographie ──────────────────────────────
            {
                de: 1712,
                texte: `Officiellement neutre depuis 1660, quand France et Angleterre s'accordent pour laisser l'île aux Kalinago. La Dominique est la plus escarpée et la plus boisée des Petites Antilles — volcans, forêts tropicales denses, vallées encaissées, rivières rapides. Ce relief est la meilleure forteresse des Kalinago : aucune puissance européenne n'a réussi à pénétrer durablement l'intérieur. Des coupeurs de bois français venus de Martinique et de Guadeloupe exploitent les franges côtières depuis le début du siècle, sans jamais constituer de colonie organisée.`,
            },

            // ── Les Kalinago ──────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Les Kalinago :</strong><br>
Improprement appelés "Caribes" dans les sources européennes — nom donné par les Arawaks qu'ils avaient supplantés, repris par les Espagnols avec une connotation de cannibalisme largement mythifiée — les Kalinago sont le peuple dominant des Petites Antilles depuis plusieurs siècles. En 1712, la Dominique est leur principal refuge après avoir été chassés de la plupart des îles colonisées. Leur organisation est décentralisée : chaque communauté est dirigée par un <em>ouboutou</em> (chef de guerre) ou un <em>tiioubana</em> (chef de paix) selon les circonstances — ce qui a longtemps dérouté les Européens cherchant un interlocuteur unique. Excellents navigateurs en pirogue, ils maintiennent des contacts réguliers avec leurs cousins de Saint-Vincent et circulent dans tout l'archipel.`,
            },

            // ── L'île comme refuge ────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Un refuge structurel :</strong><br>
La Dominique est l'île où l'on disparaît. Déserteurs de la Royal Navy ou de la marine française, esclaves marrons de la Martinique ou de la Guadeloupe, engagés en fuite, pirates cherchant à caréner loin des regards — tous trouvent dans les baies peu fréquentées de l'île un refuge que ni les Kalinago ne signalent aux autorités, ni les rares coupeurs de bois français n'ont intérêt à révéler. Le troc est la langue commune : rhum, outils et couteaux contre eau douce, vivres et silence.`,
            },

            // ── Post-Gaoulé : la pression française ───────────────
            {
                de: 1717, a: 1727,
                texte: `<strong>La pression française après le Gaoulé :</strong><br>
Le Gaoulé de 1717 envoie vers la Dominique un flux de colons expulsés ou fuyant la répression martiniquaise. Les premiers établissements semi-permanents s'installent sur la côte sud, sans mandat officiel, sans garnison. Les Kalinago du nord restent maîtres de leur territoire ; au sud, la pression s'accumule. Leurs raids sur les cases isolées restent non déclarés — pas de guerre ouverte, mais une hostilité sourde qui interdit toute implantation profonde.`,
            },
            {
                de: 1727,
                texte: `<strong>La nomination d'un commandant :</strong><br>
En 1727, la France nomme enfin un commandant à la Dominique — reconnaissant tacitement que l'île est déjà partiellement colonisée de fait. Les Kalinago du nord maintiennent leur souveraineté effective sur l'intérieur ; la coexistence avec les colons du littoral reste précaire.`,
            },
        ],

        capitale: `[Aucune — Roseau est un simple mouillage kalinago et français]`,
        population_approx: `~2 000 à 3 000 Kalinago (estimation)<br>quelques dizaines de colons et coupeurs de bois français`,
        economie: 'Bois précieux (acajou, gaïac, gommier) ; troc kalinago (vivres, guides contre outils et rhum) ; refuge informel pour déserteurs et marrons',

        note_mj: `✅ Neutralité de jure depuis 1660 : établi.
    ✅ Présence française de bûcherons depuis ~1690 : établi.
    ✅ Lien Gaoulé 1717 → migration vers Dominique : établi (Infogalactic, Global Security, Liquisearch).
    ✅ Organisation kalinago (ouboutou / tiioubana) : du Tertre, Histoire générale des Antilles (1667) ; Labat, Nouveau Voyage aux Isles de l'Amérique (1722).
    ✅ Terminologie Kalinago vs Caribes : Sued Badillo, General History of the Caribbean (UNESCO, 1997).
    ⚠️ Population : aucune donnée fiable pour 1712 — estimation basse retenue.
    ⚠️ Relations kalinago / colons français en 1712 : tensions documentées surtout après 1720.`,
    },

    // ── SAINT-VINCENT ───────────────────────────────────────────
    {
        id: 'saint-vincent',
        label: 'Saint-Vincent',
        nom: 'Saint-Vincent et Boqueau',
        tags: ['Saint-Vincent', 'Boqueau', 'Bequia'],

        puissance: {
            1712: 'conteste',
            1719: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Aucune autorité européenne]',
                pnj_id: null,
                titre: 'Île neutre — souveraineté kalinago effective',
            },
        },

        contexte: [
            // ── Une île insoumise ─────────────────────────────────
            {
                de: 1712,
                texte: `Saint-Vincent est en 1712 l'une des dernières îles des Petites Antilles où aucun Européen n'a réussi à s'établir durablement. L'accord franco-britannique de 1660 l'a laissée aux Kalinago, et les Kalinago l'ont défendue avec succès contre toutes les tentatives coloniales — espagnole, anglaise, française. Sa végétation volcanique dense, ses hauteurs escarpées et la résistance organisée de ses habitants ont découragé chaque expédition.`,
            },

            // ── Deux peuples, une île ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>Deux peuples, une île :</strong><br>
Saint-Vincent abrite deux populations distinctes et souvent en tension. Les <strong>Kalinago Rouges</strong> (ou "Jaunes" dans certaines sources françaises) sont les autochtones de longue date, installés sur la côte sous le vent (ouest) — agriculteurs et commerçants qui échangent avec les navires de passage. Les <strong>Garifunas</strong> — issus du métissage entre Kalinago et Africains évadés ou naufragés depuis la Barbade au XVIIe siècle — occupent les hauteurs et la côte au vent (est). Mieux armés, plus nombreux, ils constituent la force militaire dominante de l'île. Leur culture mêle traditions kalinago et africaines avec une cohérence qui déroute les observateurs européens attendant soit des "Indiens" soit des "nègres marrons". Les deux groupes s'affrontent ponctuellement mais s'unissent invariablement face à toute menace coloniale.`,
            },

            // ── Bequia et les îles périphériques ──────────────────
            {
                de: 1712,
                texte: `<strong>Bequia et les Grenadines septentrionales :</strong><br>
Bequia (<em>Boqueau</em>), à 9 km au sud de Saint-Vincent, est fréquentée par les Kalinago et par des baleiniers de passage — sa baie de l'Amirauté est l'un des meilleurs mouillages naturels des Petites Antilles. Les îlots des Grenadines entre Saint-Vincent et la Grenade sont des escales de pêche et de troc, sans présence permanente d'aucune puissance. Un navire qui cherche à passer entre les Antilles françaises du nord et les Antilles anglaises du sud sans être vu emprunte naturellement ces passes.`,
            },

            // ── Premier établissement français ────────────────────
            {
                de: 1719,
                texte: `<strong>Premier établissement français (1719) :</strong><br>
En 1719, des colons français fondent un premier établissement à Barrouallie sur la côte sous le vent, avec l'accord fragile des Kalinago Rouges. Les Garifunas n'ont pas été consultés — et n'ont pas consenti. La tension entre les trois parties s'installe : colons français, Kalinago Rouges ambivalents, Garifunas hostiles. C'est le début d'un conflit qui durera plusieurs décennies et ne s'achèvera qu'avec la déportation des Garifunas en 1797.`,
            },
        ],

        capitale: `[Aucune — Kingstown n'existe pas encore]`,
        population_approx: `~4 500 Kalinago Rouges et Garifunas`,
        economie: 'Agriculture vivrière, pêche, troc avec navires européens de passage, baleiniers à Bequia',

        note_mj: `✅ Absence de colons permanents avant 1719 : sources concordantes.
    ✅ Premier établissement français à Barrouallie, 1719, avec accord des Kalinago Rouges : établi.
    ✅ Terminologie Garifuna — désignation du peuple lui-même ; "Black Caribs" est l'exonyme anglais.
    Sources : Craton ; González, Sojourners of the Caribbean (1988).
    🎲 La déportation des Garifunas en 1797 par les Anglais est le dénouement tragique d'une résistance qui commence ici, en 1712 — les PJs qui interagissent avec les Garifunas rencontrent un peuple à l'aube de sa lutte la plus longue.`,
    },

    // ── SAINTE-LUCIE ───────────────────────────────────────────
    {
        id: 'sainte-lucie',
        nom: 'Sainte-Lucie',
        tags: ['Sainte-Lucie', 'Castries', 'Vieux Fort'],

        puissance: {
            1712: 'conteste',
            1723: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Commandant local non identifié]',
                pnj_id: null,
                titre: 'Commandant local sans statut officiel (relevant nominalement de la Martinique)',
            },
        },

        contexte: [
            // ── L'Hélène des Antilles ─────────────────────────────
            {
                de: 1712,
                texte: `"L'Hélène des Antilles" — l'île la plus disputée de la Caraïbe, qui changera quatorze fois de mains entre Français et Anglais. En 1712, elle est de facto française : des colons établis depuis 1651 y cultivent tabac, coton et un peu de sucre. Castries (alors simple mouillage) et Vieux Fort sont les deux points d'ancrage d'une population clairsemée. Sa baie de Grand Anse et le port naturel de Castries sont parmi les meilleurs de toutes les Petites Antilles — c'est précisément ce qui en fait un enjeu permanent.`,
            },

            // ── L'imbroglio juridique ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>L'imbroglio juridique :</strong><br>
Le statut de Sainte-Lucie est un cas d'école du droit colonial à géométrie variable. Les Anglais la revendiquent par la charte Carlisle de 1627 et n'y ont jamais renoncé — bien qu'ils ne l'occupent pas. Les Français l'occupent de fait mais sans titre solide reconnu par Londres. Les Kalinago, qui ont repoussé les deux premières tentatives d'implantation anglaise (1605, 1639) dans le sang, sont encore présents dans l'intérieur montagneux — en retrait mais pas effacés. Cette situation tripartite fait de l'île une zone de friction permanente où tout accord est provisoire.`,
            },

            // ── Une île sous pression constante ───────────────────
            {
                de: 1712,
                texte: `<strong>Une île sans statut, sous pression constante :</strong><br>
L'absence de gouverneur nommé laisse les colons français dans une large autonomie de fait — ils élisent leurs propres représentants, règlent leurs litiges entre eux, et entretiennent avec la Martinique une relation d'appartenance nominale plutôt que d'autorité réelle. Cette situation convient aux marchands qui préfèrent commercer sans trop de surveillance, aux déserteurs qui cherchent à disparaître, et aux navires qui veulent faire escale dans un excellent port sans croiser de fonctionnaire trop curieux.`,
            },

            // ── Neutralité officielle ─────────────────────────────
            {
                de: 1723,
                texte: `<strong>Neutralité officialisée (1723) :</strong><br>
Un accord franco-britannique déclare formellement Sainte-Lucie île neutre. En pratique, les colons français restent en place et les Anglais continuent de revendiquer leurs droits. La querelle reprendra avec la même intensité — Sainte-Lucie changera encore dix fois de mains avant de devenir définitivement britannique en 1814.`,
            },
        ],

        capitale: `[Aucune capitale établie — Castries est le principal mouillage]`,
        population_approx: `~200 colons français<br>~4 000 Kalinago dans l'intérieur montagneux`,
        economie: 'Tabac, coton, sucre naissant, pêche ; commerce informel profitant de l\'absence d\'autorité',

        note_mj: `✅ "L'Hélène des Antilles" : surnom attesté dans la littérature coloniale.
    ✅ Occupation française depuis 1651 : établi.
    ✅ Revendication anglaise par la charte Carlisle de 1627 : établi.
    ✅ Repoussement des Anglais par les Kalinago en 1605 et 1639 : établi.
    ✅ Accord de neutralité 1723 : établi.
    🎲 Castries est l'un des meilleurs ports naturels des Petites Antilles — un navire qui veut faire escale discrètement entre la Martinique et la Barbade y trouve eau, bois et silence.`,
    },

    // ── GUADELOUPE ───────────────────────────────────────────
    {
        id: 'guadeloupe',
        nom: 'Guadeloupe',
        tags: ['Guadeloupe', 'Basse-Terre', 'Grande-Terre'],

        puissance: {
            1712: 'francaise',
        },

        gouverneur: {
            1712: {
                nom: 'Georges Robert Cloche de La Malmaison',
                pnj_id: null,
                titre: 'Gouverneur particulier de la Guadeloupe',
            },
            1717: {
                nom: 'Savinien-Michel de Lagarrigue de Savigny',
                pnj_id: null,
                titre: 'Gouverneur particulier (intérim)',
            },
            1718: {
                nom: 'Alexandre Vaultier de Moyencourt',
                pnj_id: null,
                titre: 'Gouverneur particulier de la Guadeloupe',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La Guadeloupe est administrée depuis Basse-Terre, sur la côte sous le vent de la partie volcanique de l'île — les deux terres séparées par la Rivière Salée. Grande-Terre, plus plate et plus sèche, est le cœur de l'économie sucrière. L'île produit du sucre, du cacao, du coton et du café, exploités par une main-d'œuvre servile massive. Le commerce interlope avec les Hollandais de Saint-Eustache et de Curaçao est endémique malgré les interdictions.`,
            },

            // ── La Malmaison ──────────────────────────────────────
            {
                de: 1712, a: 1717,
                texte: `<strong>La Malmaison :</strong><br>
Administrateur tenace en poste depuis 1705, il a survécu à la guerre de Succession d'Espagne et assuré l'intérim du gouvernement général des Îles du Vent pendant dix-sept mois (octobre 1713 – janvier 1715). En août 1716, un décret royal lui reconnaît le commandement en chef des Îles du Vent en cas de mort ou d'absence du gouverneur général. Il meurt en fonction le 1er mai 1717 — quelques jours avant le dénouement du Gaoulé martiniquais.`,
            },

            // ── Intérim et Gaoulé guadeloupéen ────────────────────
            {
                de: 1717, a: 1718,
                texte: `<strong>Intérim et tensions :</strong><br>
La mort de La Malmaison laisse la Guadeloupe sans gouverneur titulaire pendant près d'un an. Lagarrigue de Savigny assure l'intérim dans une colonie secouée par les mêmes tensions commerciales et fiscales qui ont provoqué le Gaoulé en Martinique — les colons guadeloupéens s'étaient eux aussi soulevés au printemps 1717, de façon moins spectaculaire mais tout aussi réelle.`,
            },

            // ── Vaultier de Moyencourt ────────────────────────────
            {
                de: 1718,
                texte: `<strong>Vaultier de Moyencourt :</strong><br>
Il prend les rênes en mars 1718. Son premier acte notable est d'obtenir l'autorisation d'acheter 50 esclaves dans les colonies anglaises voisines, en violation formelle des ordonnances commerciales françaises — signal d'un régime accommodant avec la contrebande. Il sera rappelé en France en 1727 pour soupçons de commerce illicite. En attendant, la Guadeloupe est une île où les règles s'appliquent avec souplesse.`,
            },
        ],

        capitale: 'Basse-Terre',
        population_approx: `~25 000 habitants<br>(dont ~18 000 esclaves)`,
        economie: 'Sucre, cacao, coton, café ; commerce interlope actif avec Saint-Eustache et Curaçao',

        note_mj: `✅ La Malmaison : Wikipedia EN, ANOM, Chronologie de Guadeloupe (Wikipedia FR).
    ✅ Intérim des Îles du Vent (oct. 1713 – janv. 1715) : établi.
    ✅ Lagarrigue de Savigny : ANOM (provisions du 20 sept. 1717).
    ✅ Vaultier de Moyencourt : date du 18 mars 1718 confirmée (Wikipedia FR).
    ⚠️ La Malmaison est parfois "Hemon Coinard de la Malmaison" dans les sources — même personnage.`,
    },

    // ── GRENADE ──────────────────────────────────────────────
    {
        id: 'grenade',
        nom: 'Grenade (et Grenadines)',
        tags: ['Grenade', 'Grenadines', 'Carriacou', 'Petite Martinique'],

        puissance: {
            1712: 'francaise',
        },

        gouverneur: {
            1712: {
                nom: 'Guillaume-Emmanuel-Théodore de Maupeou, comte de l\'Estrange',
                pnj_id: null,
                titre: 'Gouverneur de la Grenade',
            },
            1717: {
                nom: 'Jean-Michel de Lépinay',
                pnj_id: null,
                titre: 'Gouverneur de la Grenade',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Colonie française depuis 1649, la Grenade est la plus méridionale des Petites Antilles françaises. Saint-George's est la capitale et le seul port notable. L'île produit du sucre, du cacao, de l'indigo et — fait remarquable — les premières cultures de muscade qui feront plus tard sa réputation. Elle relève du gouverneur général des Îles du Vent à Fort-Royal, mais l'éloignement lui confère une autonomie de fait.`,
            },

            // ── La porte de la Terre Ferme ────────────────────────
            {
                de: 1712,
                texte: `<strong>La porte de la Terre Ferme :</strong><br>
Séparée de Trinidad espagnole par une soixantaine de kilomètres, la Grenade est le point de passage naturel pour le commerce interlope entre les Antilles françaises et le Venezuela : cacao, cuirs et indigo vénézuéliens transitent discrètement par les Grenadines vers Saint-George's. Les gouverneurs successifs perçoivent leur part de ces arrangements sans les encourager ouvertement.`,
            },

            // ── Les Grenadines ────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Les Grenadines :</strong><br>
L'archipel d'une centaine d'îlots et de cays entre la Grenade et Saint-Vincent est nominalement grenadois mais sans administration effective. Carriacou, la plus grande, a quelques habitations de pêcheurs et une baie propice au carénage. Petite Martinique et les îlots au nord sont des escales connues des navires qui veulent éviter les ports surveillés — contrebandiers, pirates de passage, équipages cherchant à réparer en silence.`,
            },

            // ── Lépinay et la consolidation ───────────────────────
            {
                de: 1717,
                texte: `<strong>Jean-Michel de Lépinay :</strong><br>
Il prend le gouvernement en 1717 après une transition floue via Feuquières, rapidement promu gouverneur général des Îles du Vent. Lépinay administre une île en développement économique réel mais exposée — à l'est, les routes de la Barbade britannique ; au sud, Trinidad espagnole et les côtes vénézuéliennes ; dans les Grenadines, une zone grise que personne ne contrôle vraiment. Sa gestion est pragmatique : ne pas poser de questions sur les escales discètes dans les Grenadines, tant que les droits de port sur Saint-George's sont honorés.`,
            },
        ],

        capitale: 'Saint-George\'s (Fort Royal)',
        population_approx: `~15 000 habitants<br>(dont ~10 000 esclaves)`,
        economie: 'Sucre, cacao, indigo, muscade (naissante) ; commerce interlope avec Trinidad et le Venezuela',

        note_mj: `✅ Maupeou, comte de l'Estrange : en poste 1711–1716 (ANOM, GHCaraibe).
    ✅ Lépinay : en poste 1717 – 3 janvier 1721 (ANOM).
    ✅ Feuquières passage transitoire 1716 avant nomination aux Îles du Vent : ANOM.
    🎲 Les Grenadines sont une zone grise utilisable immédiatement — Carriacou pour caréner, Petite Martinique pour des échanges discrets, les îlots sans nom pour disparaître.`,
    },

    // ── SAINT-CHRISTOPHE (SAINT-KITTS) ───────────────────────
    {
        id: 'saint-christophe',
        label: 'Saint-Kitts',
        nom: 'Saint-Kitts (Saint-Christophe)',
        tags: ['Saint-Christophe', 'Saint-Kitts'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Walter Douglas',
                pnj_id: null,
                titre: 'Gouverneur général des Leeward Islands (résidence Antigua)',
            },
            1715: {
                nom: 'Walter Hamilton',
                pnj_id: null,
                titre: 'Gouverneur général des Leeward Islands (résidence Antigua)',
            },
        },

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `La plus ancienne colonie anglaise des Antilles, fondée en 1623 par Thomas Warner. Saint-Kitts a une histoire singulière : l'île fut partagée pendant près de cent ans entre Anglais et Français, qui coexistaient difficilement sur leurs bandes côtières respectives.<br>
                La guerre de Succession d'Espagne a mis fin à ce partage : dès 1702, le gouverneur français capitule face aux forces britanniques et les colons français sont expulsés — mais c'est le traité d'Utrecht de 1713 qui consacre définitivement la souveraineté britannique sur l'île entière.<br>
                Basseterre est la capitale et le principal port ; Brimstone Hill, la forteresse volcanique qui domine l'île, est surnommée le "Gibraltar des Antilles".`,
            },

            // ── Douglas et l'affaire Parke ─────────────────────────
            {
                de: 1712, a: 1715,
                texte: `<strong>Walter Douglas et l'héritage Parke :</strong><br>
Douglas succède à Daniel Parke, lynché par les colons d'Antigua en décembre 1710. Sa première manœuvre est de monnayer le pardon royal accordé aux assassins : 10 000 livres soutirées aux Antiguais avant de publier la grâce. Il sera condamné en Angleterre pour extorsion et révoqué — un gouverneur général qui illustre parfaitement les dérives du système colonial britannique dans les Antilles.`,
            },

            // ── Utrecht et la redistribution foncière ─────────────
            {
                de: 1713,
                texte: `<strong>Après Utrecht :</strong><br>
Le traité d'Utrecht (avril 1713) cède officiellement à la Grande-Bretagne la partie française de Saint-Kitts — les terres les plus fertiles, au centre de l'île. Les planteurs anglais s'empressent d'acquérir les habitations françaises abandonnées, souvent à vil prix. C'est une période de spéculation foncière intense. La prospérité sucrière de l'île croît rapidement.`,
            },
        ],

        capitale: 'Basseterre',
        population_approx: `~20 000 habitants<br>(dont ~15 000 esclaves)`,
        economie: 'Sucre, rhum — île parmi les plus productives des Antilles anglaises',

        note_mj: `✅ Partition franco-britannique et cession Utrecht : établi.<br>
    ✅ Gouverneurs généraux : Wikipedia EN (List of governors of the Leeward Islands).<br>
    ✅ Affaire Douglas / extorsion : Wikipedia EN (Walter Douglas), Historic St. Kitts.<br>
    ✅ Assassinat de Parke (déc. 1710) : Calendar of State Papers, Encyclopedia Virginia.<br>
    ⚠️ Saint-Kitts n'a pas de gouverneur particulier séparé — le gouverneur général des Leeward Islands fait autorité sur l'ensemble.`,
    },

    // ── LEEWARD ISLANDS (HORS SAINT-KITTS) ──────────────────
    {
        id: 'leeward-islands',
        label: 'Leeward Islands',
        nom: 'Leeward Islands (Antigua, Nevis, Montserrat, Anguilla, Barbuda)',
        tags: ['Leeward Islands', 'Antigua', 'Nevis', 'Montserrat', 'Anguilla', 'Barbuda'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: 'Walter Douglas',
                pnj_id: null,
                titre: 'Gouverneur général des Leeward Islands',
            },
            1715: {
                nom: 'Walter Hamilton',
                pnj_id: null,
                titre: 'Gouverneur général des Leeward Islands',
            },
        },

        contexte: [
            // ── Antigua — siège du gouvernement ───────────────────
            {
                de: 1712,
                texte: `<strong>Antigua :</strong><br>
Siège du gouvernement général des Leeward Islands. English Harbour, sur la côte sud, est la base navale principale de la Couronne dans les Petites Antilles — carénage et approvisionnement pour les frégates de la Royal Navy. Saint-John's est la capitale administrative. C'est ici que le gouverneur Parke fut lynché en décembre 1710 — événement encore frais dans les mémoires — et que son successeur Douglas monnaya ensuite le pardon royal des assassins.`,
            },

            // ── Nevis ─────────────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Nevis :</strong><br>
Au XVIIe siècle la plus riche des îles du groupe, siège de facto du premier gouverneur général Stapleton. Depuis dépassée par Antigua, elle reste une île sucrière productive avec Charlestown pour capitale. Son déclin relatif est aussi le signe d'un sol appauvri par des décennies de monoculture.`,
            },

            // ── Montserrat ────────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Montserrat :</strong><br>
Île modeste à dominante irlandaise catholique — de nombreux colons irlandais y ont trouvé refuge depuis la Barbade au XVIIe siècle. La langue et les traditions irlandaises y sont encore vivaces. Plymouth est la seule ville notable. L'île a subi plusieurs raids français pendant la guerre de Succession (1710, 1711, 1712), tous repoussés — mais les dommages sont réels.`,
            },

            // ── Anguilla et Barbuda ───────────────────────────────
            {
                de: 1712,
                texte: `<strong>Anguilla et Barbuda :</strong><br>
Anguilla est quasi-abandonnée par les autorités coloniales : plate, aride, sans sucre, sans garnison. Elle survit grâce à la pêche, au sel et à la contrebande avec les îles voisines. En 1720, Hamilton signale que plusieurs planteurs ont simplement quitté l'île pour Antigua, faute de perspective.<br>
Barbuda est une dépendance d'Antigua détenue à bail par les Codrington depuis 1685 — peu peuplée, sans administration distincte, servant surtout de réserve naturelle et d'approvisionnement pour leurs plantations antiguaises.`,
            },
        ],

        capitale: `Saint-John's (Antigua) — siège du gouvernement général`,
        population_approx: `~35 000 habitants pour l'ensemble des îles<br>(dont ~28 000 esclaves)`,
        economie: 'Sucre (Antigua, Nevis), sel et pêche (Anguilla) ; base navale royale à English Harbour (Antigua)',

        note_mj: `✅ Gouverneurs généraux : Wikipedia EN (List of governors of the Leeward Islands).<br>
    ✅ Affaire Parke (1710) : Calendar of State Papers, Encyclopedia Virginia.<br>
    ✅ Montserrat raids 1710–1712 : War of the Spanish Succession sources.<br>
    ✅ Anguilla abandon 1720 : Calendar of State Papers Colonial (CO.152/13, Hamilton, 14 juin 1720).<br>
    ✅ Barbuda / Codrington depuis 1685 : établi.<br>
    ⚠️ Bloc composite — cinq entités dans un seul id.<br>
    📌 Note nomenclature : la carte Jaillot utilise "Leeward Isles" pour les îles vénézuéliennes hollandaises (Curaçao, Aruba, Bonaire, Roca, Orchilla, Tortuga), non pour ce groupe britannique. La convention anglaise "Leeward Islands" pour ce groupe est distincte de l'usage cartographique de Jaillot — à signaler dans l'interface si nécessaire.`,
    },

    // ── SAINT-THOMAS (ET SAINT-JOHN) ─────────────────────────
    {
        id: 'saint-thomas',
        label: 'Saint-Thomas',
        nom: 'Saint-Thomas (et Saint-John)',
        tags: ['Saint-Thomas', 'Saint-John', 'Charlotte Amalie'],

        puissance: {
            1712: 'danoise',
        },

        gouverneur: {
            1712: {
                nom: 'Mikkel Knudsen Crone',
                pnj_id: null,
                titre: 'Gouverneur pour la Compagnie des Indes occidentales danoise',
            },
            1716: {
                nom: 'Erik Bredal',
                pnj_id: null,
                titre: 'Gouverneur pour la Compagnie des Indes occidentales danoise',
            },
        },

        contexte: [
            // ── Charlotte Amalie — port franc ─────────────────────
            {
                de: 1712,
                texte: `Saint-Thomas est administrée par la Compagnie des Indes occidentales danoise (<em>Vestindisk Kompagni</em>) depuis 1672. Charlotte Amalie — la ville portuaire organisée autour du Fort Christian — est l'un des ports francs les plus actifs des Petites Antilles. La tolérance danoise envers toutes les nationalités et tous les commerces en fait un hub du trafic interlope que ni les Anglais ni les Français ni les Espagnols n'arrivent à réguler depuis leurs propres colonies. La population blanche est délibérément cosmopolite : Danois, Hollandais, Anglais, Juifs séfarades — négociants de toutes origines qui font de Charlotte Amalie une place de marché fonctionnant de facto en dehors des monopoles coloniaux européens.`,
            },

            // ── Commerce interlope et piraterie ───────────────────
            {
                de: 1712,
                texte: `<strong>Commerce interlope et piraterie :</strong><br>
Les esclaves africains y transitent vers les colonies espagnoles ; les marchandises européennes et américaines y sont redistribuées sans trop de questions. Les esclaves représentent plus des cinq sixièmes de la population totale. Charlotte Amalie est aussi l'un des ports où les pirates ont longtemps vendu leur butin — la neutralité danoise et la vénalité documentée de certains gouverneurs du XVIIe siècle en ont fait un refuge commode. En 1712, la pression anglaise pour nettoyer les Caraïbes commence à peser sur les Danois, mais l'économie du port franc reste fondamentalement la même.`,
            },

            // ── Les terres s'épuisent — Saint-John en vue ─────────
            {
                de: 1712, a: 1718,
                texte: `<strong>Les terres s'épuisent :</strong><br>
En 1715, le gouverneur Crone signale à Copenhague que les terres de Saint-Thomas s'épuisent après quarante ans de culture intensive. Les planteurs commencent à loucher sur Saint-John, île voisine encore non colonisée — mais formellement dans la zone d'influence britannique selon les Anglais des Leeward Islands. La tension diplomatique retient la Compagnie d'agir.`,
            },

            // ── Bredal colonise Saint-John ────────────────────────
            {
                de: 1718,
                texte: `<strong>Bredal et la colonisation de Saint-John :</strong><br>
En 1718, le gouverneur Bredal colonise officiellement Saint-John malgré les objections du gouverneur Hamilton des Leeward Islands, qui avait déjà averti les Danois en 1717 de ne pas couper de bois sur l'île. La friction diplomatique est réelle — mais le Danemark tient bon. Saint-John devient une extension productive de Saint-Thomas.`,
            },
        ],

        capitale: 'Charlotte Amalie (Fort Christian)',
        population_approx: `~3 600 habitants<br>(dont ~3 000 esclaves)<br>Saint-John : non colonisée avant 1718`,
        economie: 'Port franc, commerce interlope de toutes natures, transit négrier, sucre en production secondaire',

        note_mj: `✅ Gouverneurs : Wikipedia EN (Mikkel Knudsen Crone, Erik Bredal).
    ✅ Colonisation Saint-John 1718 et tension avec Hamilton : St. John Historical Society.
    ✅ Population 1715 : Danish West Indies Wikipedia EN (recensement).`,
    },

    // ── SAINTE-CROIX ─────────────────────────────────────────
    {
        id: 'sainte-croix',
        nom: 'Sainte-Croix',
        tags: ['Sainte-Croix'],

        puissance: {
            1712: 'conteste',
            /*          1733: 'danoise',*/
        },

        gouverneur: {
            1712: {
                nom: '[Île abandonnée — aucune autorité]',
                pnj_id: null,
                titre: 'Aucun gouverneur — île déserte',
            },
            /*            1733: {
                            nom: 'Frederik Moth',
                            pnj_id: null,
                            titre: 'Gouverneur de Sainte-Croix pour le Danemark',
                        },
            */
        },

        contexte: [
            // ── L'île fantôme ─────────────────────────────────────
            {
                de: 1712, /* a: 1733, */
                texte: `Sainte-Croix est une île fantôme. Ancienne colonie française évacuée en 1696 sur ordre de Louis XIV — trop exposée, trop coûteuse à défendre pendant la guerre de la Ligue d'Augsbourg. Ses plantations, ses forts et ses maisons sont retournés à la végétation tropicale. L'île appartient formellement à la France — aucun traité ne l'a cédée — mais personne n'y réside en permanence. Des navires s'y arrêtent pour faire de l'eau douce, des naufragés y trouvent refuge, et des pirates y ont établi des camps éphémères. L'Angleterre, le Brandebourg et le Danemark ont tous montré de l'intérêt sans jamais agir — l'île reste un vide juridique et humain.`,
            },

            // ── La vente au Danemark ──────────────────────────────
            /*            {
                            de: 1733,
                            texte: `<strong>La vente au Danemark (1733) :</strong><br>
            La France cède finalement Sainte-Croix au Danemark pour 750 000 livres. Le gouverneur Frederik Moth fonde Christiansted et lance une colonisation intensive. Sainte-Croix deviendra la colonie danoise la plus productive des Caraïbes — transformation spectaculaire d'une île trente-sept ans à l'abandon.`,
                        },*/
        ],

        capitale: `[Aucune<!-- — île déserte jusqu'en 1733-->]`,
        population_approx: `Zéro résidents permanents<!-- (1712–1733)-->`,
        economie: `Néant — anciens établissements à l'abandon ; escale occasionnelle`,

        note_mj: `✅ Abandon 1696, vente au Danemark 1733 : établi (Wikipedia EN Saint Croix, Heritage.vi).
    ✅ Statut "formellement française" 1696–1733 : confirmé — aucun traité de cession avant 1733.
    ⚠️ Campements pirates ou visiteurs 1696–1733 : vraisemblable, non sourçable précisément.`,
    },

    // ── ÎLES VIERGES BRITANNIQUES ────────────────────────────
    {
        id: 'iles-vierges-britanniques',
        label: 'Îles Vierges britanniques',
        nom: 'Îles Vierges britanniques (Tortola, Virgin Gorda, Anegada)',
        tags: ['Îles Vierges britanniques', 'Tortola', 'Virgin Gorda', 'Anegada'],

        puissance: {
            1712: 'britannique',
        },

        gouverneur: {
            1712: {
                nom: '[Commandant local non identifié]',
                pnj_id: null,
                titre: 'Dépendance des Leeward Islands — pas de gouverneur particulier',
            },
        },

        contexte: [
            // ── Un archipel négligé ───────────────────────────────
            {
                de: 1712,
                texte: `Tortola, Virgin Gorda et Anegada — dépendance des Leeward Islands depuis les années 1670. Trop petites, trop peu rentables, trop proches des îles danoises et hollandaises pour être facilement contrôlées. Road Town à Tortola est une bourgade modeste ; Virgin Gorda n'a que quelques habitations ; Anegada — île corallienne plate à l'extrémité nord-est de l'archipel — est réputée pour ses récifs qui ont brisé des dizaines de navires. Ces naufrages sont la principale ressource de ses rares habitants : le <em>wrecking</em> y est pratiqué de façon quasi professionnelle.`,
            },

            // ── Zone grise entre Britanniques et Danois ───────────
            {
                de: 1712,
                texte: `<strong>Zone grise :</strong><br>
La frontière maritime avec Saint-Thomas danois est une ligne de friction permanente. Le commerce interlope entre les îles britanniques et Charlotte Amalie est structurel — les colons de Tortola vendent aux marchands danois ce qu'ils ne peuvent pas vendre légalement aux marchands britanniques, et inversement. En 1717, le gouverneur Hamilton doit faire une tournée en man-of-war dans l'archipel pour rappeler aux Danois que ces eaux sont britanniques — signal que la situation échappe à tout contrôle effectif depuis Antigua.`,
            },

            // ── Piraterie dans les Vierges ────────────────────────
            {
                de: 1712, a: 1720,
                texte: `<strong>Pirates dans les Vierges :</strong><br>
Les nombreux mouillages abrités, les passes peu profondes que seuls les pilotes locaux connaissent, et la faiblesse de la surveillance britannique font des Vierges une zone de transit et de refuge pour les navires pirates. La proximité de Saint-Thomas — où l'on peut vendre un butin sans trop de questions — renforce l'attrait de l'archipel. Après 1718 et l'arrivée de Woodes Rogers à Nassau, plusieurs équipages dispersés des Bahamas refont surface dans les Vierges avant de chercher d'autres bases.`,
            },
        ],

        capitale: 'Road Town (Tortola)',
        population_approx: `~1 500 habitants<br>(dont ~1 000 esclaves)`,
        economie: 'Sucre (limité), commerce interlope avec Saint-Thomas danois, wrecking (Anegada)',

        note_mj: `⚠️ Pas de gouverneur particulier identifié pour les Îles Vierges britanniques en 1712–1720 — dépendance du gouverneur général des Leeward Islands.
    ⚠️ Population : estimation très approximative, aucune source directe pour la période.
    ✅ Wrecking à Anegada : documenté dans la tradition locale et les sources maritimes.
    ✅ Tension Hamilton / Danois 1717 : St. John Historical Society.`,
    },

    // ── SAINT-MARTIN ─────────────────────────────────────────
    {
        id: 'saint-martin',
        label: 'Saint-Martin',
        nom: 'Saint-Martin / Sint Maarten',
        tags: ['Saint-Martin', 'Sint Maarten'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Commandants locaux non identifiés — deux autorités distinctes]',
                pnj_id: null,
                titre: 'Commandant français (nord) / Commandant hollandais (sud)',
            },
        },

        contexte: [
            // ── Une île, deux nations ─────────────────────────────
            {
                de: 1712,
                texte: `Saint-Martin est la seule île du monde partagée de façon permanente entre deux nations européennes depuis le traité de Concordia de 1648. La partie française occupe le nord, la hollandaise le sud — avec une frontière poreuse, sans fortification permanente, que chacun traverse à sa convenance. La légende dit que la ligne fut tracée par deux marcheurs partant dos à dos : le Français, aidé par le vin, couvrit plus de terrain que le Hollandais et son genièvre. La réalité est plus prosaïque — un accord d'opportunité entre deux garnisons trop faibles pour se disputer l'île après la guerre.`,
            },

            // ── Utrecht et la stabilisation ───────────────────────
            {
                de: 1712, a: 1713,
                texte: `<strong>Une stabilité provisoire :</strong><br>
L'île a changé de mains seize fois au rythme des guerres européennes. La guerre de Succession d'Espagne a de nouveau bousculé les positions. La paix d'Utrecht (1713) stabilise temporairement le statu quo — Français au nord, Hollandais au sud — sans résoudre les contentieux de fond.`,
            },
            {
                de: 1713,
                texte: `<strong>Le statu quo d'Utrecht :</strong><br>
Le partage franco-hollandais est maintenant stabilisé pour la durée de la campagne. La frontière reste poreuse : contrebande, mariages mixtes, commerce entre les deux parties sont la norme quotidienne. Marigot au nord et Philipsburg au sud sont moins des capitales distinctes que deux faces d'une même communauté insulaire divisée par un accident diplomatique.`,
            },

            // ── Le sel et l'économie ──────────────────────────────
            {
                de: 1712,
                texte: `<strong>Le sel et le commerce :</strong><br>
Les salines de la Great Bay (côté hollandais) et de la baie d'Orient (côté français) sont la principale richesse de l'île — exportées vers les colonies sucrières voisines pour la conservation des aliments. La proximité d'Anguilla au nord et de Saint-Barthélemy à l'est facilite les échanges informels avec ces îles sous-administrées. Le double statut de l'île en fait un point de passage discret pour des marchandises qui ne souhaitent pas être inspectées dans un seul port colonial.`,
            },
        ],

        capitale: 'Marigot (français, nord) / Philipsburg (hollandais, sud)',
        population_approx: `~3 100 habitants toutes parties confondues<br>(dont ~2 500 esclaves)`,
        economie: 'Sel (salines des deux côtés), sucre, coton ; contrebande inter-parties',

        note_mj: `✅ Traité de Concordia 1648 : établi.
    ✅ Structure administrative double (nord français sous Îles du Vent / sud hollandais sous commandant de Statia) : établi.
    ✅ Seize changements de mains : établi.
    ✅ Utrecht 1713 stabilise le statu quo : établi.
    ⚠️ Commandants locaux en 1712 : non identifiés.
    ⚠️ Population : estimation composite approximative.`,
    },


    // ── SABA ET SAINT-EUSTACHE ───────────────────────────────
    {
        id: 'saba-statia',
        label: 'Saba et Saint-Eustache',
        nom: 'Saba et Saint-Eustache (Sint Eustatius)',
        tags: ['Saba', 'Saint-Eustache', 'Sint Eustatius'],

        puissance: {
            1712: 'hollandaise',
        },

        gouverneur: {
            1712: {
                nom: '[Commandant non identifié pour 1712–1719]',
                pnj_id: null,
                titre: 'Commandant de Sint Eustatius (et dépendances Saba, Sint Maarten) — WIC',
            },
            1719: {
                nom: 'J. Stalperts',
                pnj_id: null,
                titre: 'Commandant de Sint Eustatius pour la WIC',
            },
        },

        contexte: [
            // ── Sint Eustatius — le Rocher d'Or ───────────────────
            {
                de: 1712,
                texte: `Sint Eustatius — "Statia" pour ses habitants — est la plaque tournante commerciale hollandaise du nord des Petites Antilles. Malgré ses 21 km², son volume de commerce est disproportionné : elle redistribue marchandises, esclaves et denrées entre les colonies anglaises, françaises et espagnoles voisines sans trop regarder les pavillons ni les licences. Sa future réputation de "Rocher d'Or" (<em>Golden Rock</em>) est déjà en germe — l'île vit de l'entrepôt, du transit et de la discrétion. Oranjestad, son unique port, est bondé de navires de toutes nationalités à presque toute heure.`,
            },

            // ── Le rôle stratégique de Statia ─────────────────────
            {
                de: 1712,
                texte: `<strong>Le commerce sans frontières :</strong><br>
Statia est l'endroit où les colonies ennemies font discrètement des affaires. Un négociant martiniquais peut y acheter des manufactures anglaises sans passer par Londres ; un planteur de la Barbade peut y écouler sa mélasse vers des marchés normalement fermés. La WIC administre l'île mais son contrôle est nominal — les commandants successifs ont appris à ne pas poser trop de questions à des marchands qui font vivre l'île. Ce commerce ambigu servira de modèle pour le rôle de Statia pendant la guerre d'Indépendance américaine — où l'île sera le principal fournisseur des rebelles en armes et munitions.`,
            },

            // ── Saba ─────────────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Saba :</strong><br>
Voisine de Statia, Saba est une île-volcan quasi inaccessible — des falaises abruptes sans plage praticable, un seul mouillage difficile à Fort Bay. Ses habitants (quelques dizaines de familles hollandaises et anglaises installées depuis les années 1640) vivent de la pêche, de la dentelle — artisanat qui fera la réputation de l'île — et d'un commerce limité avec Statia. L'isolement naturel de Saba en fait un refuge pour contrebandiers, déserteurs et toute personne cherchant à disparaître du radar des autorités coloniales voisines. Administrativement, Saba dépend du commandant de Statia.`,
            },
        ],

        capitale: 'Oranjestad (Sint Eustatius) / The Bottom (Saba)',
        population_approx: `~2 000 habitants (Sint Eustatius) ; ~300 habitants (Saba)<br>(dont ~2 200 esclaves)`,
        economie: 'Commerce interlope et transit (Sint Eustatius) ; pêche, dentelle et contrebande (Saba)',

        note_mj: `✅ Structure administrative (commandant unique pour Sint Eustatius, Saba et Sint Maarten depuis 1678) : Wikipedia EN (Governors of Sint Eustatius, Saba and Sint Maarten).
    ✅ J. Stalperts 1719–1720 : Wikipedia EN.
    ⚠️ Commandant pour 1712–1719 : non identifié — la liste Wikipedia ne précise pas de nom pour cette période.
    🎲 Statia est le pendant hollandais de Saint-Thomas danois : un port où l'on peut vendre, acheter et commercer sans trop de questions — mais plus petit, plus discret, plus proche des îles françaises et britanniques du nord des Petites Antilles.`,
    },

    // ── SAINT-BARTHÉLEMY ─────────────────────────────────────
    {
        id: 'saint-barth',
        nom: 'Saint-Barthélemy',
        tags: ['Saint-Barthélemy', 'Saint-Barth'],

        puissance: {
            1712: 'francaise',
        },

        gouverneur: {
            1712: {
                nom: '[Commandant local non identifié]',
                pnj_id: null,
                titre: 'Dépendance de la Guadeloupe — pas de gouverneur particulier',
            },
        },

        contexte: [
            // ── Une île oubliée ───────────────────────────────────
            {
                de: 1712,
                texte: `Saint-Barthélemy est une petite île rocheuse et sèche — 21 km², peu d'eau douce, sol pauvre et aride — colonisée par des Français depuis 1648. La grande majorité de ses habitants sont des Blancs pauvres d'origine normande et bretonne, pêcheurs et petits éleveurs, sans esclaves ni plantations. Cette population blanche homogène et autosuffisante développe une culture insulaire distincte, très attachée à son autonomie, peu portée sur les contacts avec les autorités de la Guadeloupe à qui elle est censée rendre compte.`,
            },

            // ── Le port naturel ────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Le port naturel :</strong><br>
La rade de Gustavia — qui ne s'appelle pas encore ainsi — est l'un des rares mouillages abrités de l'île. Peu de commerce officiel y transite, mais des navires en transit entre Saint-Martin, la Guadeloupe et les Antilles britanniques y font régulièrement escale pour l'eau et les provisions. L'absence totale d'autorité organisée en fait une escale discrète sans paperasses ni droits de port : un avantage pour qui voyage avec une cargaison d'origine douteuse.`,
            },

            // ── L'oubli administratif ─────────────────────────────
            {
                de: 1712,
                texte: `<strong>L'oubli administratif :</strong><br>
Saint-Barth est une dépendance nominale du gouverneur général des Îles du Vent via la Guadeloupe, mais dans les faits personne à Basse-Terre ou Fort-Royal ne s'en préoccupe sérieusement. L'île n'a pas de garnison, pas de fort, pas de commandant régulier nommé par Paris. Elle vivra dans cet oubli confortable jusqu'à sa cession à la Suède en 1784, qui en fera un port franc prospère sous le nom de Gustavia — révélant alors le potentiel maritime que personne n'avait daigné développer.`,
            },
        ],

        capitale: `[Aucune ville constituée — quelques habitations dispersées]`,
        population_approx: `~700 pauvres bretons et normands`,
        economie: 'Pêche, petit élevage, sel, commerce d\'escale informel',

        note_mj: `⚠️ Peu de sources pour Saint-Barthélemy 1712 spécifiquement.
    ✅ Statut dépendance des Îles du Vent : établi.
    ✅ Population blanche d'origine normande/bretonne : trait documenté dans l'historiographie.
    ✅ Cession à la Suède 1784, port franc Gustavia : établi.
    ⚠️ Population : estimation.`,
    },

    // ── TOBAGO ───────────────────────────────────────────────
    {
        id: 'tabago',
        nom: 'Tabago',
        tags: ['Tobago', 'Scarborough', 'Man of War Bay', 'Courland', 'île neutre', 'Petites Antilles'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Aucune autorité constituée]',
                pnj_id: null,
                titre: 'Île sans administration — contestée et non colonisée',
            },
        },

        contexte: [
            // ── Un catalogue d'échecs coloniaux ───────────────────
            {
                de: 1712,
                texte: `Tobago est l'une des îles les plus disputées des Caraïbes et, en 1712, l'une des plus vides. Son histoire est un catalogue d'échecs coloniaux : Hollandais, Courlanders (Lettons), Anglais, Français se sont succédé sans jamais y établir quoi que ce soit de durable. La dernière tentative sérieuse — hollandaise — s'est soldée par une destruction et un abandon en 1677. Depuis lors, l'île appartient à tout le monde et à personne. La France et l'Angleterre se la revendiquent toutes les deux, mais aucune ne l'occupe. L'île restera dans ce vide juridique jusqu'au traité d'Aix-la-Chapelle (1748) qui la déclare formellement neutre — avant que les Anglais ne l'occupent définitivement après 1763.`,
            },

            // ── Un refuge pratique ────────────────────────────────
            {
                de: 1712,
                texte: `<strong>Un refuge pratique :</strong><br>
La baie de Courland (côté ouest) et la baie de Man of War (côté est) sont connues des marins de toute la région comme des mouillages abrités sans autorité pour poser des questions. Des équipages en transit entre Trinidad et les Petites Antilles, des navires cherchant à caréner discrètement, des buccaneers attendant des proies — tous fréquentent Tobago sans jamais y rester. L'île a du bois, de l'eau douce, des tortues et un bon abri. Elle n'a rien d'autre.`,
            },
        ],

        capitale: `[Aucune — Scarborough n'est pas encore une ville]`,
        population_approx: `Zéro résidents permanents (1712)`,
        economie: `Néant — mouillage d'opportunité, bois sur pied non exploité`,

        note_mj: `✅ Colonisations successives et abandon 1677 : établi (Wikipedia EN History of Tobago, Caribbean Beat).
    ✅ Tobago neutre par Aix-la-Chapelle 1748, britannique définitivement après 1763 : établi.
    ⚠️ Utilisation comme mouillage en 1712 : vraisemblable, non sourçable précisément.`,
    },

    // ── ÎLES DE LA BAIE (ROATAN) ─────────────────────────────
    {
        id: 'iles-de-la-baie',
        label: 'Îles de la Baie',
        nom: 'Îles de la Baie (Roatan, Utila, Guanaja)',
        tags: ['Îles de la Baie', 'Roatan', 'Utila', 'Guanaja', 'Bay Islands'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Aucune autorité constituée]',
                pnj_id: null,
                titre: 'Territoire contesté — pas d\'administration',
            },
        },

        contexte: [
            {
                de: 1712,
                texte: `Roatan, Utila et Guanaja — revendiquées par l'Espagne comme territoire hondurien, sans présence effective depuis l'expulsion des derniers colons anglais en 1650. Le vide a été comblé par des bûcherons anglais venus du Belize, des flibustiers cherchant un mouillage discret, et des équipages en transit entre la Jamaïque et la Terre Ferme espagnole. Port Royal, sur la côte sud de Roatan, est la baie la plus fréquentée — Henry Morgan y est passé en 1665 et sa réputation de refuge s'est perpetuée. Les Indiens Misquitos, alliés aux Britanniques, y circulent librement. L'Espagne proteste régulièrement à Londres contre la présence de coupeurs de bois anglais, sans grand effet.`,
            },
            {
                de: 1712,
                texte: `<strong>Îles et bancs associés :</strong><br>
Les Serrana et Serranilla — deux bancs coralliens quasi inhabités au centre de la mer des Caraïbes, entre la Jamaïque et le Nicaragua — sont des points de pêche à la tortue et des mouillages de fortune. Les Swan Islands (<em>St Millan</em> sur la carte) au nord-ouest des Îles de la Baie partagent le même statut : espagnol nominal, fréquentés par les boucaniers anglais pour l'eau douce et les tortues.`,
            },
        ],

        capitale: `[Aucune — Port Royal (Roatan) est un mouillage, pas une ville]`,
        population_approx: `Quelques dizaines de bûcherons et flibustiers de passage`,
        economie: 'Bois de campêche (logwood), refuge pirate, eau douce et tortues',

        note_mj: `✅ Expulsion anglaise 1650, fréquentation informelle ultérieure : Wikipedia EN (Bay Islands), Britannica.
    ✅ Port Royal comme mouillage historique : Roatan.day, Coconut Tree Divers.
    ✅ Circulation des Misquitos : établi.
    ⚠️ Situation précise en 1712 : pas de sources primaires directes — inféré de la continuité documentée.
    'Sources : Marcus (1975), <em>The Evolution of the Caribbean Settlement Patterns</em> ; Olien (1983), <em>The Miskito Kings and the Line of Succession</em>. ✅ Histoire de la colonisation anglaise et expulsion espagnole (1650) : établi (Wikipedia EN Bay Islands Department, Britannica). ✅ Fréquentation informelle par bûcherons anglais de Belize : établi. ✅ Port Royal comme mouillage historique : établi (Roatan.day, Coconut Tree Divers). ⚠️ Situation précise en 1712 : pas de sources primaires directes — "quelques bûcherons et flibustiers de passage" est inféré de la continuité documentée avant et après cette date.`,
    },

    // ── PROVIDENCE ─────────────────────────────
    {
        id: 'providence',
        label: 'Providence',
        nom: 'Providence (Old Providence) & San Andrés',
        tags: ['Providence', 'Old Providence', 'San Andrés', 'Santa Catalina'],

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

        contexte: [
            // ── Géographie et défenses naturelles ─────────────────
            {
                de: 1712,
                texte: `Old Providence (<em>Isla de Providencia</em>) est une île volcanique de 18 km² entourée d'un massif récif corallien qui en rend l'approche quasi impossible à qui n'en connaît pas les passes. Sa voisine Santa Catalina, séparée par un bras de mer étroit artificiellement creusé par les premiers colons anglais, forme avec elle un ensemble naturellement défendable — et naturellement discret.`,
            },

            // ── Histoire coloniale et mémoire pirate ──────────────
            {
                de: 1712,
                texte: `<strong>Une mémoire pirate tenace :</strong><br>
En 1629, la Providence Island Company — un consortium de Puritains anglais — y fonde une colonie qui glisse rapidement vers la course : les colons arment des corsaires contre les galions espagnols depuis ce poste idéalement placé "à la gueule de l'empire espagnol". Les Espagnols reprennent l'île en 1641. Henry Morgan l'utilise comme base dans les années 1660 pour ses raids sur Panama. Les Espagnols reprennent définitivement en 1670. En 1712, Providence est nominalement espagnole mais sans garnison permanente. Ses ruines anglaises — forts, jetées, vestiges de New Westminster — sont encore debout, et ses passes connues des seuls initiés en font un refuge que les cartes officielles ne signalent pas.`,
            },

            // ── San Andrés ────────────────────────────────────────
            {
                de: 1712,
                texte: `<strong>San Andrés :</strong><br>
À 90 km au sud-ouest de Providence, San Andrés est une île basse et coralliène — sans le relief volcanique de Providence, mais avec des baies abritées et de l'eau douce. Elle est encore moins fréquentée que sa voisine, n'apparaissant sur les cartes de l'époque que comme un nom sans substance. Des familles de colons anglais s'y sont installées sporadiquement depuis les années 1620 sans jamais constituer de communauté organisée. En 1712 : nominalement espagnole, effectivement vide.`,
            },

            // ── Un refuge exceptionnel ────────────────────────────
            {
                de: 1712,
                texte: `<strong>Position stratégique :</strong><br>
Providence est à mi-chemin entre la Jamaïque et la côte Miskito, à portée des routes entre Panama et Cuba, et suffisamment isolée pour que personne ne vienne y chercher un navire qui ne veut pas être trouvé. Pour un équipage ayant besoin de caréner, de soigner des blessés, de répartir un butin ou d'attendre que l'attention des autorités se porte ailleurs, c'est l'endroit idéal — à condition de connaître les passes du récif.`,
            },
        ],

        capitale: `[Aucune — ruines de New Westminster à Santa Catalina]`,
        population_approx: `Aucun résident permanent en 1712 ; passages occasionnels de flibustiers et de navires en transit`,
        economie: `Néant — refuge maritime, eau douce, pêche à la tortue`,

        note_mj: `✅ Providence Island Company 1629–1641 : établi (Wikipedia EN, Kris Lane Providence Island).
    ✅ Reprise espagnole 1641, utilisation par Morgan 1660s, reprise définitive 1670 : établi.
    ✅ Passes du récif connues des initiés : établi (géographie physique).
    ⚠️ Situation précise en 1712 — aucune source primaire directe sur cette date spécifiquement.
    🎲 Providence est le refuge idéal "hors carte" pour un équipage qui doit disparaître — trop loin de tout pour être cherché, trop bien protégé par son récif pour être trouvé par hasard.`,
    },

    // ── ÎLE DU MAÏS ─────────────────────────────
    // visible_mj: true → n'apparaît sur la carte qu'en mode MJ
    {
        id: 'ile-du-mais',
        nom: 'Île du Maïs',
        visible_mj: true,
        tags: ['Île du Maïs', 'Island of Corn'],

        puissance: {
            1712: 'conteste',
        },

        gouverneur: {
            1712: {
                nom: '[Île déserte]',
                pnj_id: null,
                titre: 'Vestiges mayas et végétation luxuriante',
            },
        },

        contexte: [
            {
                de: 1712,
                texte: `L'île du Maïs, au large de la côte nicaraguayenne, est une île réelle avec une histoire fascinante. Elle a été colonisée par les Mayas avant d'être abandonnée, puis redécouverte par des marins espagnols au XVIe siècle. En 1712, elle est officiellement espagnole mais sans présence permanente — un refuge idéal pour les navires en difficulté ou les équipages cherchant à disparaître. Ses plages isolées, sa végétation dense et ses ruines mayas en font un lieu chargé de mystère et de légendes.`,
            },
        ],
        capitale: `[Aucune]`,
        population_approx: `Aucune`,
        economie: 'Aucune',

        note_mj: `Île du pétroglyphe de Morgan`,
    },
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
    const anneeEffective = modeMJ ? annee : Math.min(annee, CARTE_ANNEE_REFERENCE);
    const cles = Object.keys(champ)
        .map(Number)
        .filter(a => a <= anneeEffective)
        .sort((a, b) => b - a);  // décroissant → le plus récent en premier
    if (cles.length === 0) return null;
    return champ[cles[0]];
}
