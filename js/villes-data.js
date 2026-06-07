// ═══════════════════════════════════════════════════════════
// VILLES & LIEUX NOTABLES — Pavillon Noir
// Coordonnées pixel : référentiel image 8500 × 5320 px
// (même référentiel que carte-data.js)
// Nassau et Carthagène documentées dans carte-data.js.
// ═══════════════════════════════════════════════════════════

const VILLES = [

    // ══════════════════════════════════════════════════════════
    // SÉRIE 1 — Colonies britanniques & Bahamas
    // ══════════════════════════════════════════════════════════

    {
        id: 'cartagena',
        nom: 'Carthagène de Indias',
        label: 'Carthagène',
        capitale: true,
        type: 'port',
        territoire: 'nouvelle-grenade',
        coords: [4840, 4097],
        tags: ['Carthagène', 'Cartagena', 'Carthagène de Indias'],

        contexte: [
            {
                de: 1712,
                texte: `Principal port de sortie de l'empire espagnol sur la côte Caraïbe de Terre Ferme — l'or d'Antioquia, les émeraudes de Muzo, le cacao du Venezuela y transitent avant d'embarquer pour Cadix via La Havane. Carthagène est aussi l'une des têtes de pont de l'Asiento : depuis 1713, la South Sea Company y maintient une factorerie pour le commerce des esclaves africains, qui constitue autant un prétexte légal à la pénétration commerciale anglaise qu'un négoce en lui-même.
<br><br>
En 1683, Laurens de Graaf et Michel de Grammont paraissent devant Carthagène avec sept navires et y demeurent près d'un mois. Les flibustiers tiennent la rade mais ne prennent pas la ville : les fortifications tiennent, et la garnison ne cède pas. Ils repartent avec trois navires capturés, et Carthagène survit au blocus, humiliée mais intacte.
<br><br>
En 1697, c'est une tout autre affaire : le baron de Pointis arrive avec 22 vaisseaux, 500 canons et 4 000 soldats, auxquels s'ajoutent les 7 navires et 1 200 flibustiers de Du Casse. Les Français débarquent à Boca-Chica, emportent le château de San Luis qui barre l'entrée de la baie, et la ville se rend rapidement, versant une rançon de neuf millions de livres. Pointis appareille ensuite directement pour la France en escamotant la part promise aux flibustiers. Furieux, ces derniers reviennent piller la ville une seconde fois. Le bilan est catastrophique pour Carthagène : deux sacs successifs en moins d'un mois.
<br><br>
Le <strong>Château de Bocachica</strong>, renforcé après 1697, contrôle désormais l'unique chenal d'accès à la baie intérieure. Prendre Carthagène de force est hors de portée d'un équipage pirate — mais la contourner, la renseigner, ou en corrompre les douaniers est une autre affaire.`,
            },
        ],

        population: `~20 000 habitants(dont une forte proportion d'esclaves africains et d'affranchis)`,

        garnison: `Fort Bocachica + Fort San Fernando(rive opposée du chenal) : ~200 soldats.Garnison de la ville intra - muros : ~300 soldats supplémentaires.Total estimé : ~500 hommes.Estimation d'après McFarlane, Colombia before Independence (1993).`,

        note_mj: `✅ Sac de Pointis 1697 — dernier grand assaut réussi contre Carthagène avant Vernon en 1741 : établi.<br>
        ✅ Asiento anglais (South Sea Company) depuis Utrecht 1713 : établi.<br>
        ⚠️ Gouverneur militaire 1712 : non identifié depuis les sources accessibles. AGI (Audiencia de Santa Fe) : source primaire.\nCarthagène est une alcaldía mayor et place militaire distincte de la Présidence de Santafé — son gouverneur militaire propre n'est pas subordonné au gouverneur civil de la Nouvelle-Grenade pour les affaires militaires.`,
    },

    {
        id: 'charles-town',
        nom: 'Charles Town (Charleston)',
        label: 'Charles Town',
        capitale: true,
        type: 'port',
        territoire: 'caroline-du-sud',
        coords: [4390, 470],

        contexte: [
            // ── Situation permanente ───────────────────────────────
            {
                de: 1712,
                texte: `Principal port des colonies britanniques du Sud. Charles Town exporte riz, indigo et esclaves africains vers l'Angleterre ; elle importe manufactures et rhum des Antilles. Son port est le seul débouché maritime de la Caroline du Sud et le point de passage de tout le commerce régional.`,
            },
            // ── Commerce interlope ─────────────────────────────────
            {
                de: 1712, a: 1719,
                texte: `Les marchands de Charles Town sont parmi les plus actifs fournisseurs du marché pirate de Nassau — rhum, provisions, outils contre butin revendu discrètement.`,
            },
            // ── Guerre Yamasee ─────────────────────────────────────
            {
                de: 1715, a: 1716,
                texte: `<strong>La guerre yamasee :</strong><br>
                Depuis avril 1715, la guerre Yamasee ravage les arrières de la Caroline du Sud. Les plantations sont brûlées à moins de cinquante kilomètres de Charles Town ; des centaines de colons fuient vers la ville. Le port reste ouvert mais la colonie est au bord de l'effondrement, incapable de défendre ses frontières sans renforts extérieurs.`,
            },
            {
                de: 1716, a: 1717,
                texte: `<strong>La guerre yamasee (depuis avril 1715) :</strong><br>
                La coalition yamasee s'effrite : les Cherokees basculent du côté britannique au début de 1716, retournant la situation militaire. Charles Town respire, mais la reconstruction est lente et les plantations du nord restent exposées. La méfiance envers toutes les nations autochtones s'est profondément installée dans la mentalité coloniale.`,
            },
            {
                de: 1717, a: 1718,
                texte: `<strong>La guerre yamasee (avril 1715 - novembre 1717) :</strong><br>
                La guerre Yamasee s'achève sans traité formel. Charles Town sort épuisée du conflit : dettes coloniales, milices décimées, commerce intérieur désorganisé. C'est dans ce contexte de faiblesse militaire structurelle que la menace pirate commence à peser sérieusement sur le port.`,
            },
            // ── Blocus de Barbe-Noire ──────────────────────────────
            {
                de: 1719, a: 1721,
                texte: `<strong>Le blocus de Barbe-Noire (juin 1718) :</strong><br>
                    En juin 1718, Barbe-Noire bloque le port avec quatre navires, prend des otages parmi les notables et impose ses conditions sans rencontrer la moindre résistance navale — épisode révélateur de l'impuissance militaire de la colonie au sortir de la guerre yamasee.`,
            },
        ],

        population: `~4 000 habitants intra-muros (dont ~1 500 esclaves) ; ~18 000 dans toute la province`,

        note_mj: `✅ Guerre Yamasee: Verner Crane, <em>The Southern Frontier</em> ; Alan Gallay, <em>The Indian Slave Trade</em>.<br>
✅ Blocus de Barbe-Noire juin 1718 : établi (Johnson, <em>General History</em> ; Woodard, <em>Republic of Pirates</em>).<br>
✅ Commerce interlope avec Nassau : <em>Calendar of State Papers Colonial</em>.<br>
Pas de fort notable à Charles Town en 1712–1718 — la ville est défendue par des palissades et deux batteries côtières modestes, insuffisantes face à une escadre.`,
    },

    {
        id: 'san-agustin',
        nom: 'San Agustín (Saint Augustine)',
        label: 'San Agustín',
        capitale: true,
        type: 'port',
        territoire: 'floride',
        coords: [3967, 1087],

        contexte: [
            { de: 1712, texte: `Unique ville permanente de Floride. San Agustín est d'abord un presidio — une garnison avec une ville autour — dont la valeur est stratégique plutôt qu'économique. Le Castillo de San Marcos, fort en coquina (pierre corallienne locale résistant aux boulets), domine la baie depuis 1695. La ville accueille les esclaves fugitifs des plantations caroliniennes à qui Madrid accorde la liberté contre le baptême et le service militaire — pratique qui attise les tensions avec Charles Town. La garnison ne dépasse pas 300 hommes, chroniquement sous-payés et mal équipés ; les missions franciscaines de l'arrière-pays ont été détruites par les raids anglais de 1704.` },
        ],

        population: `~1 500 habitants (garnison et civils) ; quelques centaines d'Indiens alliés`,

        garnison: `~300 hommes — infanterie espagnole régulière, complétée par une milice de colons et d'affranchis noirs (les negros libres constituent une unité distincte). Effectif confirmé par TePaske, The Governorship of Spanish Florida (1964).`,

        note_mj: `✅ Garnison ~300 hommes : TePaske (1964) ; AGI SD 843.
✅ Castillo de San Marcos en coquina, achevé 1695 : établi — il résistera sans dommage au bombardement anglais de 1702.
✅ Affranchissement des esclaves fugitifs contre baptême et service : édit de 1693, confirmé par Landers, Black Society in Spanish Florida (1999).
⚠️ Situation exacte en 1712–1714 : situado intercepté par les Anglais, famine documentée dans la correspondance de Córcoles (AGI).`,
    },

    {
        id: 'mobile',
        nom: 'Mobile',
        capitale: [
            { de: 1712, a: 1718, texte: true },
            { de: 1718, texte: false },
        ],
        type: 'port',
        territoire: 'louisiane',
        coords: [1481, 909],

        contexte: [
            {
                de: 1718,
                texte: `Mobile est un comptoir plus qu'une ville — quelques centaines d'habitants autour d'un fort en bois sur la rive de la baie du même nom. Son rôle est d'ancrer l'alliance avec les Choctaws et d'affirmer la présence française entre la Floride espagnole et les colonies caroliniennes. Le commerce des peaux est la seule ressource notable. En 1718, Bienville fonde La Nouvelle-Orléans sur le Mississippi et Mobile perd définitivement sa primauté.`
            },
            {
                de: 1712, a: 1718,
                texte: `Mobile est la capitale de la Louisiane française — mais elle n'est pas pour autant un centre de pouvoir incontesté. La présence française dans la région est fragile, et les autorités de Mobile doivent composer avec les chefs choctaws, les colons indépendants, et les commerçants de passage. La ville est un point d'ancrage symbolique plus qu'une véritable métropole administrative ou militaire.`
            },
        ],

        population: `~250 habitants (soldats, colons, engagés) ; Choctaws alliés en transit permanent`,

        garnison: `~150 soldats au Fort Louis de la Mobile — estimation : la garnison louisianaise totale ne dépasse pas 300 hommes sur toute la période (Giraud, Histoire de la Louisiane française, 1953), dont la moitié environ stationnée à Mobile.`,

        note_mj: `⚠️ Effectif précis de la garnison de Mobile : non établi par source directe. Estimation par extrapolation depuis l'effectif total louisianais (Giraud).
✅ Mobile capitale jusqu'en 1718 : établi.`,
    },

    {
        id: 'la-nouvelle-orleans',
        nom: 'La Nouvelle-Orléans',
        capitale: true,
        type: 'port',
        territoire: 'louisiane',
        coords: [1297, 1314],
        visible_de: 1718,

        contexte: [
            { de: 1718, texte: `Fondée par Bienville en 1718 sur un méandre du Mississippi à quelques kilomètres du lac Pontchartrain. En 1718–1720, c'est un chantier dans un marais : quelques dizaines de maisons en bois, une palissade, des ouvriers qui meurent de fièvre. La Compagnie des Indes y déverse des colons recrutés parfois de force. Sa vocation est de devenir le nœud entre le bassin du Mississippi et le Golfe du Mexique — ambition que la géographie justifie, mais que les conditions de 1718 rendent difficilement crédible.` },
        ],

        population: `Quelques centaines en 1718, croissance rapide et chaotique jusqu'à ~1 500 vers 1720`,

        note_mj: `✅ Fondation 1718, conditions précaires : établi (DCB, 64 Parishes/LSU).
Pour la campagne : La Nouvelle-Orléans n'existe pas avant 1718 — tout événement antérieur dans la région se situe à Mobile ou dans les postes du Mississippi.`,
    },

    {
        id: 'saint-georges-bermudes',
        nom: "Saint George's",
        capitale: true,
        type: 'port',
        territoire: 'bermudes',
        coords: [6568, 420],

        contexte: [
            { de: 1712, texte: `Capitale et unique ville notable des Bermudes. Saint George's s'organise autour de son port naturel — l'un des rares bons mouillages de l'archipel — et de ses chantiers navals. Le cèdre des Bermudes produit des coques légères et durables, réputées dans tout l'Atlantique. Les pilotes bermudiens, familiers des hauts-fonds de l'archipel, se retrouvent sur tous les navires qui naviguent entre les colonies. Certains d'entre eux figurent parmi les équipages pirates de Nassau — leur connaissance des passes est un atout irremplaçable.` },
        ],

        population: `~6 000 sur l'ensemble de l'archipel (dont ~2 000 esclaves) ; Saint George's regroupe l'essentiel de la population`,

        note_mj: `✅ Réputation des chantiers bermudiens et des pilotes : établi (sources maritimes générales).<br>
✅ Bermudiens parmi les pirates de Nassau : <em>Calendar of State Papers Colonial</em>.<br>
Fort Hamilton : construit à partir de 1620 environ, en état modeste à cette période — davantage une batterie côtière qu'un vrai fort de garnison.`,
    },

    {
        id: 'spanish-town',
        nom: 'Spanish Town',
        capitale: true,
        type: 'port',
        territoire: 'jamaique',
        coords: [4795, 2882],

        contexte: [
            { de: 1712, texte: `Capitale administrative de la Jamaïque. Spanish Town abrite le gouverneur, l'Assemblée coloniale et les tribunaux. Ville de papiers et de fonctionnaires, sans port, à une vingtaine de kilomètres à l'intérieur des terres depuis la baie de Kingston.` },
        ],

        population: `~2 000 habitants`,

        note_mj: `Pas de fort ni de garnison propre — la défense de la Jamaïque est assurée depuis Port Royal. Spanish Town est mentionnée pour compléter la carte administrative, sans intérêt narratif direct pour la campagne.`,
    },

    {
        id: 'kingston',
        nom: 'Kingston & Port Royal',
        label: 'Kingston',
        type: 'port',
        territoire: 'jamaique',
        coords: [4833, 2890],

        contexte: [
            {
                de: 1712, texte: `<strong>Port Royal</strong> occupait avant 1692 l'angle d'un long banc de sable fermant la baie de Kingston — ville de négoce et de plaisir surnommée "la plus riche et la plus impie du Nouveau Monde". Le tremblement de terre du 7 juin 1692 a englouti les deux tiers de la ville en deux minutes, noyant entre 2 000 et 5 000 personnes. Port Royal n'a pas disparu — la péninsule a été reconsolidée, une partie des bâtiments reconstruits — mais la population civile ne s'y est jamais réinstallée massivement. Ce qui reste est militaire et pénal : la base navale de la Royal Navy, les entrepôts d'avitaillement, et le Gallows Point.
<br>
<strong>Le Gallows Point</strong> est le lieu d'exécution des pirates condamnés à Kingston. Les corps sont ensuite exposés en cage de fer à l'entrée du port — pour l'exemple, disent les ordonnances — visibles de tout navire entrant dans la baie.
<br>
<strong>Kingston</strong>, fondée en 1693 sur la rive nord de la baie en face de Port Royal, est le centre marchand de fait. C'est là que les négociants jamaïcains ont leurs entrepôts, leurs comptoirs, leurs tavernes. Le butin pirate revendu par des intermédiaires discrets transite par Kingston avant de disparaître dans le circuit du commerce légal. Le sucre et le rhum jamaïcains partent de ses quais vers l'Angleterre et les colonies du Nord.
<br>
<strong>Fort Charles</strong>, à Port Royal, est la pièce maîtresse de la défense de la baie. Il commande l'entrée depuis la pointe de la péninsule.`,
            },
            { de: 1720, a: 1721, texte: `Le 18 novembre 1720, le capitaine pirate Calico Jack Rackham est exécuté à Port Royal. Il est jugé et pendu à Gallows Point, où son corps est exposé en cage de fer pendant plusieurs mois.` },
            { de: 1721, texte: `Le 29 mars 1721, Charles Vane, l'un des chefs pirates les plus notoires de Nassau, est capturé et pendu à Gallows Point. Son corps est exposé en cage de fer à l'entrée du port pendant plusieurs mois.` },
        ],
        population: `Port Royal : ~2 000 (garnison, marins, personnels navals)
Kingston : ~8 000 (dont ~6 000 esclaves) — centre de gravité commercial de l'île`,

        garnison: `Fort Charles : ~200 soldats d'infanterie régulière, plus la garnison maritime variable selon la présence de la Royal Navy. La Jamaica Station peut compter 3 à 6 frégates en temps ordinaire, davantage en période de crise. Effectif de terre : estimation d'après Pawson & Buisseret, Port Royal, Jamaica (1975).`,

        note_mj: `✅ Tremblement de terre 1692, mort de 2 000 à 5 000 personnes : établi (Pawson & Buisseret, 1975 ; Dunn, Sugar and Slaves, 1972).
✅ Fondation de Kingston 1693 : établi.
✅ Gallows Point — exécution de Vane 1721 : Johnson, General History (1724) ; Wikipedia EN (Charles Vane).
✅ Commerce interlope du butin pirate via Kingston : Calendar of State Papers ; Woodard (2008).
⚠️ Effectif exact de Fort Charles : Pawson & Buisseret donnent des données pour la fin du XVIIe — extrapolation pour 1712–1720.
🎲 Kingston est le passage obligé pour tout navire qui veut commercer légalement en Jamaïque. Port Royal est le passage obligé pour tout navire qui veut être inspecté, armé, ou pendu.`,
    },

    {
        id: 'cap-francais',
        nom: 'Cap-Français (Le Cap)',
        label: 'Cap-Français',
        capitale: true,
        type: 'port',
        territoire: 'saint-domingue',
        coords: [5497, 2541],

        contexte: [
            { de: 1712, texte: `Capitale de Saint-Domingue et ville la plus active des Antilles françaises. Le Cap s'étend sur une plaine étroite coincée entre la mer et les mornes du nord d'Hispaniola. Ses quais expédient vers Bordeaux et Nantes le sucre, l'indigo et le cacao des grandes habitations de la plaine du Nord. Le Conseil supérieur y siège, le gouverneur général y réside, et les négociants de toute la Caraïbe y font escale. Les tavernes, maisons closes et entrepôts du port constituent une économie parallèle fréquentée par des marins de toutes nationalités — dont certains n'ont pas de papiers en règle. Un capitaine avec une cargaison d'origine douteuse y trouvera preneur, à condition de ne pas attirer l'attention des autorités.` },
        ],

        population: `~10 000 à 12 000 habitants (dont ~8 000 esclaves)`,

        note_mj: `✅ Capitale de Saint-Domingue, siège du gouverneur général : établi (ANOM).
✅ Rôle commercial — sucre, indigo, cacao vers Bordeaux : Debien, Les esclaves aux Antilles françaises (1974).
🎲 Le Cap est le décor de Satiété engendre Démesure (janvier 1714, sous Blénac).`,
    },

    {
        id: 'petit-goave',
        nom: 'Petit-Goâve',
        type: 'port',
        territoire: 'saint-domingue',
        coords: [5340, 2769],

        contexte: [
            { de: 1712, texte: `Ancienne capitale des flibustiers français de Saint-Domingue. Dans les années 1660–1690, Petit-Goâve était le point de rassemblement des boucaniers de la côte ouest d'Hispaniola — une ville de planches et de tavernes où les équipages se formaient, les prises se vendaient, et les gouverneurs fermaient les yeux. En 1712, cette époque est révolue depuis une génération : Petit-Goâve est un bourg modeste en déclin, dont les habitants vivent surtout d'un petit commerce de denrées et de pêche côtière. Il reste un mouillage commode sur la route entre Le Cap et la côte sud, mais plus rien de la turbulence d'antan.` },
        ],

        population: `~1 500 habitants`,

        note_mj: `✅ Rôle boucanier 1660–1690 : Exquemelin, Flibustiers et boucaniers ; Du Tertre, Histoire générale des Antilles.
✅ Déclin après 1700 : Paris a progressivement centralisé l'administration à Cap-Français et interdit les lettres de marque sauvages.
⚠️ Population 1712 : estimation — aucun recensement précis disponible pour cette date.
🎲 Un PJ qui cherche ici l'animation d'antan sera déçu — et c'est précisément ce décalage qui peut être narrativement intéressant.`,
    },

    {
        id: 'basse-terre-tortue',
        nom: 'Basse-Terre',
        type: 'port',
        territoire: 'tortue',
        coords: [5310, 2528],

        contexte: [
            { de: 1712, texte: `Bourg principal de l'île de la Tortue, organisé autour du Fort de la Roche — l'unique position défendable de l'île, taillée à même le promontoire rocheux qui domine la rade. En 1712, la Tortue est une dépendance administrative de Saint-Domingue sans gouverneur propre. Le bourg est modeste : quelques centaines d'habitants, des pêcheurs, une garnison squelettique.` },
        ],

        population: `Quelques centaines d'habitants (garnison, pêcheurs, colons)`,

        garnison: `Fort de la Roche : ~30 à 50 soldats. Estimation par analogie avec les petits postes français des Antilles à population et importance comparables. Aucune source primaire directe disponible pour 1712.`,

        note_mj: `✅ Réputation sanitaire (fièvre jaune rare) : attestée dans les sources de l'époque — Du Tertre, Labat. Explication réelle inconnue des contemporains (altitude, absence de zones marécageuses étendues, moins de moustiques Aedes aegypti).
✅ Fort de la Roche : construit sous d'Ogeron (~1665–1675), en état de fonctionnement au début du XVIIIe.
⚠️ Garnison et population : estimations — aucune source directe.
À ne pas confondre avec l'Isla La Tortuga vénézuélienne.`,
    },

    {
        id: 'nassau',
        nom: 'Nassau',
        type: 'port',
        territoire: 'new-providence',
        coords: [4542, 1739],

        capitale: [
            { de: 1712, a: 1718, texte: 'pirate' },
            { de: 1718, texte: true },
        ],

        population: [
            {
                de: 1712, a: 1714,
                texte: `• 150 à 200 colons résidents<br>• Population pirate flottante, pouvant atteindre 300 à 500 hommes en période de forte activité.`,
            },
            {
                de: 1714, a: 1718,
                texte: `• ~100 colons résidents<br>• Jusqu'à 1 000 pirates en escale`,
            },
            {
                de: 1718,
                texte: `800 à 1 000 personnes :<br>• 300 à 500 colons résidents<br>• 200 à 300 repentis installés<br>• 150 à 200 esclaves<br>• ~100 soldats réguliers`,
            },
        ],

        garnison: [
            {
                de: 1712, a: 1718,
                texte: `Fort Nassau : 4 canons en 1712. Garnison nulle — le fort est aux mains des pirates.`,
            },
            {
                de: 1718, a: 1720,
                texte: `Fort Nassau en reconstruction sous Rogers.<br>~100 soldats réguliers, chroniquement décimés par la fièvre.`,
            },
            {
                de: 1720,
                texte: `Reconstruction de Fort Nassau achevée en janvier 1720.<br>~100 soldats réguliers.`,
            },
        ],

        contexte: [
            {
                de: 1712,
                texte: `Port naturel bien protégé au nord de New Providence. Nassau est le cœur physique de la République Pirate : tavernes, entrepôts de butin, chantiers de carénage improvisés. Le fort surplombe l'entrée du port.`,
            },
            {
                de: 1712, a: 1714,
                texte: `Nassau est un port de refuge pour les pirates depuis la fin du XVIIe siècle. En 1712, c'est une petite communauté de quelques dizaines de colons, principalement des planteurs et des pêcheurs, qui vivent dans des huttes de bois autour d'un fort en ruines — le Fort Nassau, construit par les Anglais en 1697 mais jamais achevé ni entretenu. Port naturel bien protégé par un banc de sable, il s'agit du seul véritable havre de l'archipel des Bahamas — idéal pour les navires rapides comme les sloops et les goélettes. Les pirates y trouvent un refuge sûr, une base d'opérations pour leurs raids, et un marché pour leur butin. La population pirate peut atteindre plusieurs centaines en période de forte activité.`,
            },
            {
                de: 1714, a: 1718,
                texte: `<strong>La République Pirate</strong><br>
                À partir de 1715, la population pirate de Nassau explose — jusqu'à 1 000 hommes en escale à la fois. Les pirates contrôlent effectivement le port et le fort, qui devient leur quartier général de facto. Ils y organisent des raids contre les colonies britanniques et espagnoles, y vendent leur butin à des intermédiaires, et y vivent dans une anarchie relative. La République Pirate est un mélange de camaraderie, de violence, de commerce illicite, et de défiance envers les autorités coloniales. C'est aussi un lieu de refuge pour les pirates en fuite, les mutins, et les marginaux de toutes sortes — une société à part entière avec ses propres règles et sa propre culture.`,
            },
            {
                de: 1718,
                texte: `<strong>Rétablissement de l'autorité britannique</strong><br>
                En 1718, Woodes Rogers, fraîchement nommé Gouverneur royal des Bahamas, arrive à Nassau avec trois navires de guerre et deux cents soldats pour reprendre le contrôle de l'île. Il offre un pardon royal aux pirates qui se rendent, mais une part significative refuse et choisit de se battre ou de fuir. Rogers rétablit l'ordre, reconstruit le Fort Nassau, et tente de redynamiser l'économie locale.`,
            },
        ],

        note_mj: `✅ Coordonnées : nord de New Providence, entrée ouest du port — à caler sur la carte.<br>
        ✅ Fort Nassau reconstruit sous Rogers, achevé janvier 1720 : <em>Calendar of State Papers</em> .<br>
        ✅ Garnison pré-1718 : inexistante en pratique — Walker n'a ni soldats ni budget.<br>
        ✅ Décomposition population post-1718 et milice de 500 lors du raid espagnol de 1720 : <em>Calendar of State Papers Colonial</em> ; <em>Woodard, Republic of Pirates</em>. Les 600 combattants incluent ~100 soldats réguliers + ~500 miliciens (repentis, colons, esclaves armés en crise).`,
    },

    {
        id: 'harbour-island',
        nom: 'Harbour Island',
        type: 'port',
        territoire: 'eleuthera',
        coords: [4719, 1610],

        contexte: `Îlot de quelques kilomètres au nord-est de la pointe septentrionale d'Eleuthera, Harbour Island est le centre le plus actif de l'archipel des Bahamas hors Nassau. Sa baie naturelle, protégée par un banc de sable, offre un mouillage abrité accessible aux sloops et aux goélettes — mais difficile pour les grands bâtiments, ce qui constitue une protection naturelle.

La communauté résidente compte une trentaine de familles en 1717 — descendants des fondateurs puritains de 1648, protestants républicains hostiles par tradition à la monarchie. <!--Cette mémoire les range sans hésitation dans le camp hanovrien en 1718 quand la question du pardon royal divise Nassau. -->

Harbour Island est le sas entre Nassau et le monde légal. Des marchands de Boston et de Charles Town y traitent avec les pirates sans se compromettre directement à Nassau. Les familles Darvill et Stillwell fournissent vivres, eau douce et rhum ; Richard Thompson et John Cockram importent depuis Curaçao et les colonies continentales les marchandises manufacturées que les pirates ne peuvent obtenir ailleurs.

La batterie côtière construite par le vice-gouverneur Walker vers 1710 — quatre canons et quelques pierriers commandant l'entrée du port — change de mains selon les circonstances. En 1717, les pirates l'occupent avec une cinquantaine d'hommes.`,

        population: `~150 à 200 résidents permanents (1717) ; population flottante variable — un seul navire pirate représente 60 à 100 hommes supplémentaires`,

        garnison: `Batterie Walker (~1710) : 4 canons, quelques pierriers. Pas de garnison régulière — occupée selon les circonstances par des civils armés, des pirates, ou laissée à l'abandon. Mentionnée dans les rapports de Woodes Rogers (1718).`,

        note_mj: `✅ Rapport Musson 1717 (deux navires de Boston) : Calendar of State Papers Colonial.
✅ Personnages attestés : Jonathan Darvill, Daniel Stillwell, Richard Thompson, John Cockram — B.C. Brooks, Bahamas Shipping Records 1721–1725 ; Wikipedia EN (John Cockram).
✅ Batterie Walker ~1710, 4 canons, occupation pirate 1717 : Calendar of State Papers ; Rogers rapports 1718.
✅ Recensement Rogers 1722 : 124 blancs + 5 noirs à Harbour Island, 28 hommes en âge de porter les armes.
Sources : Codex Eleuthera (document de campagne) ; Calendar of State Papers Colonial ; Woodard (2008).`,
    },

    // ══════════════════════════════════════════════════════════
    // SÉRIE 2 — Antilles espagnoles & Terre Ferme
    // ══════════════════════════════════════════════════════════

    {
        id: 'santo-domingo',
        nom: 'Santo Domingo',
        capitale: true,
        type: 'port',
        territoire: 'santo-domingo',
        coords: [5821, 2780],

        contexte: [
            { de: 1712, texte: `Première ville européenne permanente des Amériques, fondée en 1498 sur la rive sud d'Hispaniola. Santo Domingo conserve son prestige historique — siège de la Real Audiencia, première cathédrale, premier palais colonial du Nouveau Monde — mais la ville est en 1712 une cité appauvrie et clairsemée. La Fortaleza Ozama, construite en 1502 sur la rive du fleuve du même nom, est le plus vieux fort européen des Amériques encore debout. La Real Audiencia de Santo Domingo exerce nominalement une juridiction sur Cuba, Porto Rico, la Floride et le Venezuela, mais cette autorité est de plus en plus théorique à mesure que Madrid réorganise son empire.` },
        ],

        population: `~5 000 à 8 000 habitants (dont ~1 500 esclaves)`,

        garnison: `Fortaleza Ozama : ~80 à 120 soldats. Estimation par analogie avec les garnisons des places espagnoles de même rang et de même éloignement des circuits principaux. Aucune source primaire directe pour 1712.`,

        note_mj: `✅ Fortaleza Ozama, 1502 — plus vieux fort européen des Amériques : établi.
✅ Real Audiencia compétente sur Cuba, Porto Rico, Floride, Venezuela : établi.
⚠️ Garnison et population : estimations.
⚠️ Gouverneur de 1712 non identifié avec certitude avant Pedro de Niela y Torres (1713).`,
    },

    {
        id: 'san-juan',
        nom: 'San Juan',
        capitale: true,
        type: 'port',
        territoire: 'porto-rico',
        coords: [6551, 2727],

        contexte: `San Juan est bâtie sur un îlot rocheux relié à l'île principale par deux ponts-levis — position qui en fait naturellement une des places les mieux défendues des Antilles. Deux châteaux-forts commandent l'accès : le <strong>Castillo San Felipe del Morro</strong> à la pointe ouest de l'îlot, dominant l'entrée du chenal depuis le XVIe siècle, et le <strong>Castillo San Cristóbal</strong> à l'est, protégeant l'accès terrestre depuis la grande île. L'enceinte de murailles reliant les deux forts est pratiquement continue.

La ville vit du situado — la subvention annuelle de Mexico finançant garnison et administration — et d'un commerce de contrebande que tout le monde pratique et que personne n'avoue. Les marchands anglais et hollandais qui ne peuvent entrer légalement font escale à Vieques (Boreque sur la carte), à 8 km au sud-est, ou dans les anses de la côte nord.`,

        population: `~6 000 habitants intra-muros`,

        garnison: `Castillo San Felipe del Morro : ~300 soldats. Castillo San Cristóbal : ~150 soldats. Total garnison de la place : ~500 hommes, auxquels s'ajoutent les équipages des navires de course d'Enríquez (variables). Estimation d'après Caro Costas, Legislación Municipal Puertorriqueña, et EnciclopediaPR.`,

        note_mj: `✅ Architecture de la défense (Morro + San Cristóbal + murailles continues) : établi.
✅ Miguel Enríquez — biographie, Medalla de oro 1713, flotte de 30 navires : Wikipedia EN (Miguel Enríquez) ; EnciclopediaPR.
✅ Arrivée de Ribera le 23 décembre 1713 à bord du navire d'Enríquez La Gloria : Wikipedia EN.
✅ Vieques (Boreque) — mouillage de substitution pour les navires étrangers : inféré de la géographie et de la pratique documentée.
⚠️ Effectifs de garnison : les listes d'AGI donnent des effectifs théoriques ; les effectifs réels sont structurellement inférieurs (désertions, maladies, postes non pourvus).
🎲 Enríquez est jouable comme PNJ à part entière : mulâtre, fils d'esclave, anobli de fait, le plus riche des Caraïbes espagnoles, en guerre permanente avec les gouverneurs successifs.`,
    },

    {
        id: 'la-havane',
        nom: 'La Havane',
        capitale: true,
        type: 'port',
        territoire: 'cuba',
        coords: [3695, 2084],

        contexte: `Pivot logistique de l'empire espagnol dans les Caraïbes occidentales. La Havane est le point de rassemblement des flottes du Trésor avant leur traversée vers Cadix — tous les galions chargés d'argent péruvien ou mexicain y font escale, s'y ravitaillent, y attendent la saison favorable. Ce statut en fait la ville la plus active et la mieux défendue du monde caraïbe hispanique.

Deux fortifications commandent l'entrée du port : le <strong>Castillo de los Tres Reyes del Morro</strong> à la pointe est du chenal (1589–1630), dominant le passage depuis une falaise de 35 mètres, et le <strong>Castillo de la Real Fuerza</strong> à l'intérieur même de la ville (1558), qui sert davantage de résidence au gouverneur et d'entrepôt que de position défensive face à une attaque navale. Les deux forts ont des fonctions et des positions distinctes.

<!-- La principale richesse locale est le tabac de la Vuelta Abajo, cultivé par de petits planteurs — les <em>vegueros</em> — sous un monopole royal imposé en 1717 qui déclenche la première révolte cubaine documentée. Les vegueros se soulèvent trois fois (1717, 1720, 1723), chaque fois réprimés, jamais convaincus. En 1723, onze meneurs sont pendus le long des routes de la Vuelta Abajo. -->`,

        population: `~12 000 à 15 000 habitants`,

        garnison: `Castillo del Morro : ~200 soldats. Real Fuerza : ~80 soldats (fonction résidentielle et d'entrepôt autant que militaire). Garnison totale de La Havane : ~500 à 600 hommes en temps ordinaire, pouvant monter à plusieurs milliers lors des escales de la flotte. Estimation d'après Kuethe & Marchena, Soldados del Rey (2005).`,

        note_mj: `✅ Castillo del Morro (1589–1630) et Real Fuerza (1558) — deux forts distincts : établi.
✅ Révolte des vegueros 1717, 1720, 1723 — pendaisons 1723 : Wikipedia EN (Vegueros Revolt).
✅ Monopole tabacier imposé 1717 : établi.
⚠️ Garnison : Kuethe & Marchena couvrent la période bourbonienne tardive — extrapolation pour 1712–1724, antérieure aux grandes réformes militaires.`,
    },

    {
        id: 'santiago-de-cuba',
        nom: 'Santiago de Cuba',
        type: 'port',
        territoire: 'cuba',
        coords: [4824, 2522],

        contexte: [
            { de: 1712, texte: `Second port de Cuba, sur la côte sud orientale — à l'opposé de La Havane tant géographiquement qu'économiquement. Santiago vit dans l'orbite de la Jamaïque britannique voisine autant que dans celle de La Havane : le commerce interlope avec Kingston est structurel, toléré par des gouverneurs locaux qui y trouvent leur compte. Le <strong>Castillo del Morro de Santiago</strong> (San Pedro de la Roca, 1638–1700) domine l'entrée de la baie depuis un promontoire à 60 mètres de hauteur — l'une des positions les mieux conservées de l'architecture militaire espagnole en Amérique.` },
        ],

        population: `~6 000 habitants`,

        garnison: `Castillo del Morro de Santiago : ~150 soldats. Estimation par analogie avec les places secondaires de la Caraïbe espagnole — aucune source primaire directe pour 1712.`,

        note_mj: `✅ Castillo del Morro de Santiago (San Pedro de la Roca), 1638–1700 : établi — classé au patrimoine mondial de l'UNESCO.
✅ Commerce interlope avec la Jamaïque : inféré de la géographie et des pratiques documentées.
⚠️ Garnison et population : estimations.`,
    },

    {
        id: 'tampico',
        nom: 'Tampico',
        type: 'port',
        territoire: 'panuco',
        coords: [1153, 2032],

        contexte: [
            { de: 1712, texte: `Port modeste à l'embouchure du río Pánuco sur le Golfe du Mexique — seul débouché maritime entre Veracruz au sud et la Floride au nord. Saccagé par les pirates en 1684, le traumatisme reste présent dans les mémoires locales. Le commerce interlope avec des navires anglais de la Nouvelle-Angleterre est une réalité tolérée faute de moyens de surveillance. Aucun fort permanent en état.` },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Saccage par les pirates en 1684 : sources locales concordantes (Herrera Casasús, UAT, 1988).
⚠️ Population : estimation.`,
    },

    {
        id: 'veracruz',
        nom: 'Veracruz',
        type: 'port',
        territoire: 'nouvelle-espagne',
        coords: [1172, 2628],

        contexte: `Premier port de la Nouvelle-Espagne sur l'Atlantique et unique débouché légal de tout le commerce entre Mexico et l'Espagne. L'argent des mines de Zacatecas et de Guanajuato passe par Veracruz avant d'embarquer pour Cadix — ce qui en fait la cible la plus convoitée du Golfe du Mexique.

Le <strong>Fort San Juan de Ulúa</strong> n'est pas sur la côte mais sur un îlot corallien à quelques centaines de mètres du rivage, commandant l'entrée de la rade. Son rôle est double : défense contre les attaques maritimes, et entrepôt sécurisé pour le trésor avant embarquement.

En 1683, les flibustiers Lorencillo (Laurent de Graff) et Grammont s'emparent de la ville pendant plusieurs jours — pillage mémorable qui a laissé des traces durables dans la mémoire collective. Le fort n'avait pas été pris, mais la ville fut rançonnée. Depuis lors, les défenses terrestres ont été renforcées.`,

        population: `~6 000 à 8 000 habitants permanents ; peut doubler lors des arrivées de flottes`,

        garnison: `Fort San Juan de Ulúa : ~400 soldats et artilleurs. Garnison de la ville : ~200 soldats supplémentaires.`,

        note_mj: `✅ Raid de Lorencillo et Grammont, 1683 : établi.
✅ Fort San Juan de Ulúa sur îlot corallien : établi.
⚠️ Garnison : estimation d'après Archer, <em>The Army in Bourbon Mexico (1977)</em> — données postérieures aux réformes, couvre la période bourbonienne tardive — effectifs de 1712 probablement inférieurs.`,
    },

// ── 112. POPOCATÉPETL ────────────────────────────────────────────────────────

    {
        id: 'popocatepetl',
        nom: 'Popocatépetl',
        label: 'Les Vulcans ou Papa Catepec',
        type: 'site_geo',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [1230, 2881],
        // ⚠️ La Jaillot indique "Les Vulcans ou Papa Catepec" — le Popocatépetl
        // et l'Iztaccíhuatl, les deux volcans jumeaux entre Mexico et Puebla.
        // "Papa Catepec" est une déformation de "Popocatépetl".

        contexte: [
            {
                de: 1712,
                texte: `Le Popocatépetl — "la montagne qui fume" en nahuatl — et son compagnon l'Iztaccíhuatl ("la femme blanche") forment le duo volcanique le plus célèbre de la Nouvelle-Espagne. Le Popocatépetl culmine à 5 426 mètres, l'Iztaccíhuatl à 5 230 mètres — tous deux couverts de neiges éternelles, visibles depuis Mexico par temps clair et depuis les côtes du golfe de Mexique par beau temps. Entre les deux volcans passe le col de Cortés, emprunté par le conquistador en 1519 lors de sa marche vers Tenochtitlán.
<br><br>
Le Popocatépetl est actif en 1712 — il fume quasi en permanence, et ses éruptions périodiques couvrent de cendres Mexico et Puebla. Les Mexicas lui rendaient un culte ; les Espagnols ont tenté d'en descendre le soufre pour fabriquer de la poudre à canon dès 1519. En 1712, un sanctuaire chrétien sur ses flancs accueille les pèlerins.`,
            },
        ],

        note_mj: `✅ Popocatépetl (5 426 m) et Iztaccíhuatl (5 230 m) : établi.
✅ Col de Cortés entre les deux volcans, marche vers Tenochtitlán en 1519 : établi.
✅ Extraction de soufre par les Espagnols dès 1519 : établi.
✅ Activité volcanique continue en 1712 : établi — le Popocatépetl est en éruption fréquente tout au long de la période coloniale.`,
    },

    {
        id: 'campeche',
        nom: 'Campeche',
        type: 'port',
        territoire: 'yucatan',
        coords: [2314, 2607],

        contexte: `Port d'exportation du bois de teinture — le <em>palo de tinte</em> (bois de campêche, *Haematoxylum campechianum*) dont la sève rouge-violet teint les draps de laine des manufactures européennes. Cette richesse en fait depuis le XVIIe siècle une cible récurrente des flibustiers : Myngs en 1663, L'Olonnais en 1666, Laurent de Graff en 1685 et 1686. La ville porte les cicatrices de ces raids — et les murailles construites en réponse.

L'enceinte fortifiée de Campeche, commencée en 1686 précisément après les raids répétés, est en 1712 l'une des rares villes entièrement ceintes de murailles dans toute l'Amérique espagnole. Huit bastions hexagonaux complètent le système. Les Anglais de la baie du Belize coupent du bois de campêche à quelques dizaines de kilomètres au sud — tension permanente que les autorités du Yucatán n'ont pas les moyens de résoudre.`,

        population: `~6 000 habitants`,

        garnison: `Garnison de l'enceinte : ~300 soldats répartis sur les huit bastions. Fort San Miguel (position avancée en hauteur) : ~80 hommes.`,

        note_mj: `✅ Raids flibustiers (L'Olonnais 1666, Lorencillo 1685–1686, Myngs 1663) : établis. Morgan n'est pas encore commandant en 1663 — le raid sur Campeche est conduit par Christopher Myngs.
✅ Enceinte fortifiée commencée en 1686, huit bastions : établi — aujourd'hui classée à l'UNESCO.
✅ Bois de campêche comme richesse principale : établi.
⚠️ Garnison : estimation d'après Calderón Quijano, <em>Historia de las Fortificaciones en Nueva España (1984)</em> → couvre l'ensemble de la période coloniale — extrapolation pour 1712.`,
    },

    {
        id: 'trujillo',
        nom: 'Trujillo',
        type: 'port',
        territoire: 'honduras',
        coords: [2949, 3278],

        contexte: [
            { de: 1712, texte: `Seul port espagnol de la côte Caraïbe hondurienne. Trujillo marque la frontière orientale de l'autorité de Madrid — au-delà, c'est la côte Miskito. La ville est modeste, mal défendue, chroniquement menacée par les raids miskitos et les incursions anglaises depuis la Jamaïque. Son utilité principale : point de départ des routes vers l'intérieur du Honduras et Comayagua.` },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ Trujillo est peu documentée pour cette période. Toutes les données sont des estimations par analogie avec les postes espagnols comparables de la côte Caraïbe.`,
    },

    {
        id: 'cap-gracias-a-dios',
        nom: 'Cap Gracias a Dios',
        capitale: true,
        type: 'port',
        territoire: 'cote-miskito',
        coords: [3568, 3452],

        contexte: [
            { de: 1712, texte: `Pointe extrême orientale de la côte hondurienne, où le littoral s'infléchit vers le sud. Siège de fait du roi Miskito, investi à Spanish Town (Jamaïque) mais résidant ici. Le Cap est le nœud de toute navigation sur la côte Miskito : les sloops jamaïcains qui viennent troquer armes et rhum contre bois et tortues y font escale. Pas d'établissement européen permanent — quelques cases, un mouillage, et la présence du roi avec ses guerriers.` },
        ],

        population: `Quelques centaines de Miskitos autour du cap.`,

        note_mj: `✅ Cap Gracias a Dios comme siège du roi Miskito : établi (Wikipedia EN, Miskito people).
✅ Investiture du roi à Spanish Town, Jamaïque : établi.
⚠️ Nom précis du roi en 1712 : non identifié. Jeremy I est documenté dans les années 1720.`,
    },

    {
        id: 'granada-nicaragua',
        nom: 'Granada',
        type: 'port',
        territoire: 'nicaragua',
        coords: [2772, 4009],

        contexte: [
            { de: 1712, texte: `Ville la plus riche du Nicaragua espagnol, sur la rive occidentale du lac Nicaragua. Sa vulnérabilité structurelle est géographique : le río San Juan relie le lac à la mer des Caraïbes — une voie navigable depuis la côte atlantique jusqu'au cœur de la ville. Morgan l'a remontée en 1665 pour saccager Granada. Le <strong>Castillo de la Inmaculada Concepción</strong>, établi sur les rapides à mi-parcours du río San Juan (à ~80 km de la côte), est censé barrer cette route — mais la garnison est insuffisante et le fort en mauvais état permanent.` },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Saccage de Granada par Morgan via le río San Juan, 1665 : établi.
✅ Castillo de la Inmaculada Concepción sur les rapides du San Juan, à mi-parcours — distinct de l'embouchure maritime : établi (voir entrée dédiée 'castillo-san-juan').
⚠️ La description initiale plaçait le fort "à l'embouchure" — corrigé : El Castillo est à ~80 km de la côte, sur les rapides qui bloquent la navigation. L'embouchure maritime elle-même n'est pas fortifiée de façon permanente en 1712.`,
    },

    {
        id: 'fort-san-lorenzo',
        label: 'Fort San Lorenzo',
        nom: 'Castillo de San Lorenzo el Real de Chagres',
        type: 'fort',
        capitale: true,
        territoire: 'panama',
        coords: [3900, 4259],

        contexte: [
            {
                de: 1712,
                texte: `Position isolée à l'embouchure du río Chagres sur la côte Caraïbe de l'isthme, à quelques dizaines de kilomètres à l'ouest de Portobelo. San Lorenzo est le verrou de la traversée de l'isthme : le Chagres remonte vers l'intérieur sur plus de cent kilomètres, permettant d'approcher Panama City à une journée de marche. Qui tient San Lorenzo tient la seule route rapide à travers la jungle — c'est ce qu'avait compris Morgan en le prenant d'assaut en décembre 1670, avec pertes sévères, avant de remonter le fleuve et de traverser l'isthme jusqu'à Panama City.
        <br><br>
Reconstruit et renforcé après ce raid, le fort occupe un promontoire de 60 mètres au-dessus du fleuve, offrant une vue dégagée sur la mer et sur l'embouchure. En 1712, c'est un poste isolé en forêt tropicale, tenu par une garnison clairsemée dans un climat meurtrier — les maladies déciment régulièrement les soldats fraîchement arrivés d'Espagne avant même qu'ils aient vu l'ennemi.`,
            },
        ],

        population: `Garnison uniquement — aucun civil permanent`,

        garnison: `~100 à 150 soldats. Le fort est réputé difficile à tenir : les maladies tropicales déciment régulièrement les garnisons fraîchement arrivées d'Espagne. Effectif réel souvent inférieur à l'effectif théorique. Estimation d'après la taille et l'importance stratégique du fort, comparable aux sources sur Portobelo (AGI Panama).`,

        note_mj: `✅ Prise par Morgan, décembre 1670, combat violent : établi (Exquemelin ; Earle, The Sack of Panama, 1981).<br>
✅ Position sur promontoire à 60 m, vue sur mer et fleuve : établi.<br>
✅ Reconstruction post-Morgan, plan en étoile : établi.<br>
⚠️ Garnison 1712 : estimation — les sources primaires (AGI Panama) donnent des effectifs théoriques peu fiables pour cette période.<br>
🎲 San Lorenzo est un lieu en soi, pas une dépendance de Panama City : on n'y arrive pas par hasard.`,
    },

    {
        id: 'portobelo',
        nom: 'Portobelo',
        type: 'port',
        territoire: 'panama',
        coords: [3985, 4230],

        contexte: [
            {
                de: 1712,
                texte: `Portobelo est une contradiction permanente : l'un des ports les plus importants de l'empire espagnol sur le papier, une ville à moitié vide en pratique, dans une baie réputée mortelle pour les Européens non acclimatés. Depuis 1708, les foires sont interrompues — aucun galion espagnol n'est attendu, aucun ne vient. Portobelo est un fort et un poste douanier, pas un marché.
<br><br>
Trois forts commandent la baie : le <strong>Fort San Felipe de Todo Fierro</strong> sur la rive sud à l'entrée, le <strong>Fort Santiago de la Gloria</strong> sur la rive nord face au premier, et le <strong>Fort San Fernando</strong> à l'intérieur de la baie côté ville. Aucun des trois n'est redoutable isolément — Morgan les prend tous en 1668 en quelques heures en débarquant à l'est et les attaquant à revers par voie terrestre. Le souvenir de ce raid hante les garnisons.`,
            },
            {
                de: 1722, a: 1724,
                texte: `La foire de 1722 est la première depuis 1708. Elle tourne court : voir le bloc Panama (Tierra Firme) pour le détail. Portobelo reprend nominalement son rôle de port des galions, mais le système ne se remet pas.`,
            },
        ],

        population: `~500 habitants permanents hors période de foire. La population décuplait lors des grandes foires — mais celles-ci sont interrompues.`,

        garnison: `Fort San Felipe : ~80 soldats<br>
Fort Santiago : ~60 soldats.<br>
Fort San Fernando : ~80 soldats.<br>
Total en temps ordinaire : ~220 hommes, renforcés depuis Panama City et Carthagène lors des foires.`,

        note_mj: `✅ Prise par Morgan en 1668 — attaque terrestre de nuit, forts pris à revers : établi (Exquemelin ; Earle, <em>The Sack of Panama</em>).<br>
✅ Trois forts distincts (San Felipe, Santiago, San Fernando) : établi.<br>
✅ Interruption des foires 1708–1722 : établi — voir sources dans le bloc Panama (Tierra Firme).<br>
✅ Foire de 1722 : fiasco documenté — voir bloc Panama (Tierra Firme).<br>
✅ Vernon 1739 : établi — hors période, mais connu des joueurs comme horizon.<br>
⚠️ Garnison : estimation d'après Lane, <em>Pillaging the Empire</em> (1998).<br>
🎲 Portobelo hors foire est une ville fantôme malsaine. Portobelo en foire est le plus grand marché du monde atlantique — et le plus dangereux pour la santé.`,
    },

    {
        id: 'panama-city',
        nom: 'Panama City',
        capitale: true,
        type: 'port',
        territoire: 'panama',
        coords: [4020, 4370],

        contexte: [
            {
                de: 1712,
                texte: `Capitale de l'isthme, sur la côte pacifique.
Panama City est la tête des deux routes qui font de l'isthme sa valeur : vers l'est, le Camino Real qui traverse la jungle jusqu'à Portobelo sur la côte Caraïbe ; vers le sud, la liaison maritime avec Callao, le port de Lima, d'où arrive l'argent péruvien. C'est ici que les lingots et les pièces de huit déchargés du Pacifique sont reconditionnés avant de traverser l'isthme. La ville reconstruite après le sac de Morgan (1671) est mieux fortifiée, mais sa vulnérabilité structurelle demeure : accessible depuis les deux côtes, elle ne peut être défendue que si les deux routes sont tenues simultanément. En 1712, c'est une ville de transit et d'administration — tout ce qui vaut quelque chose y passe, rien n'y reste.`,
            },
        ],

        population: `~8 000 habitants`,

        garnison: `~300 soldats d'infanterie régulière, plus une milice de colons.`,

        note_mj: `✅ Sac par Morgan 1671, reconstruction sur nouveau site : établi (Earle, <em>The Sack of Panama</em>, 1981).<br>
✅ Panama dépend du vice-roi du Pérou (Lima) pour l'essentiel — distinction essentielle avec Mexico.<br>
⚠️ Entre 1717 et 1723, le vice-royauté de Nouvelle-Grenade (Santafé) s'intercale nominalement dans la chaîne de commandement, mais cette structure est instable et de courte durée — supprimée dès 1723, non rétablie avant 1739. Dans les faits, Panama traite souvent directement avec Lima.<br>
⚠️ Garnison : estimation d'après le rang et l'importance de la place.`,
    },

// ── 54. SANTA MARÍA LA ANTIGUA DEL DARIÉN ────────────────────────────────────

    {
        id: 'santa-maria-darien',
        nom: 'Santa María la Antigua del Darién',
        label: 'Santa Maria',
        type: 'site_hist',
        rang: '3',
        territoire: 'darien',
        coords: [4282, 4618],

        contexte: [
            {
                de: 1712,
                texte: `Site de la première ville européenne permanente fondée sur le continent américain — Santa María la Antigua del Darién, établie en 1510 par Vasco Núñez de Balboa sur la rive occidentale du golfe d'Urabá. C'est depuis ici que Balboa a traversé l'isthme et "découvert" le Pacifique en 1513. La ville a été abandonnée en 1524 lorsque le gouverneur Pedrarias Dávila a transféré l'administration à Panama City — et lorsqu'il a fait exécuter Balboa pour trahison.
<br><br>
En 1712, il ne reste rien de Santa María sinon la mémoire et quelques ruines englouties par la jungle darienite. Les cartographes continuent de la marquer par tradition historique. Pour un navigateur ou un aventurier qui connaît son histoire, le site est chargé : premier évêché du continent, premier tribunal, premier cimetière européen en Amérique — et lieu de naissance de la conquête du Pacifique.`,
            },
        ],

        note_mj: `✅ Fondation de Santa María la Antigua del Darién en 1510 par Balboa : établi.
✅ Première ville permanente d'Amérique continentale (avant Natá, avant Panama City) : établi.
✅ Traversée de l'isthme et "découverte" du Pacifique par Balboa en 1513 : établi.
✅ Exécution de Balboa par Pedrarias Dávila et abandon de la ville en 1524 : établi.
État en 1712 : ruines recouvertes par la jungle, site non habité.`,
    },

    {
        id: 'bocachica',
        label: 'Fort San Luis (Bocachica)',
        nom: 'Castillo de San Luis de Bocachica',
        type: 'fort',
        territoire: 'nouvelle-grenade',
        coords: [4790, 4116],
        tags: [`bocachica`, `San Luis`, `boca-chica`],

        contexte: [
            {
                de: 1712, texte: `Le Fort Bocachica contrôle l'unique chenal navigable donnant accès à la baie intérieure de Carthagène ; les murailles de la ville, renforcées après le sac de Francis Drake (1586) et celui du baron de Pointis (1697), forment une enceinte quasi continue. La garnison est la plus nombreuse de toute la côte Caraïbe espagnole. Toute attaque navale sur Carthagène doit d'abord forcer ce passage.
                <br><br>
                En 1712, le fort est en état de fonctionnement, armé de canons commandant le chenal. À quelques kilomètres de la ville, c'est une position autonome avec sa propre garnison. Francisco de Meneses, président-gouverneur renversé par ses propres <em>oidores</em> (juges de la Real Audiencia) en 1715, y sera emprisonné après sa destitution.` },
        ],

        population: `Garnison uniquement`,

        garnison: `~80 à 120 soldats. La position est complétée par le Fort San Fernando sur la rive opposée du chenal — ensemble ils forment le double verrou de la baie.`,

        note_mj: `✅ Bocachica comme verrou de la baie de Carthagène : établi — rôle confirmé lors du siège de Vernon en 1741.<br>
✅ Emprisonnement de Meneses à Bocachica après 1715 : carte-data.js (nouvelle-grenade).<br>
⚠️ Fort San Fernando (rive opposée) : reconstruction principale postérieure à 1741 — statut précis en 1712 incertain.<br>
⚠️ Garnison : estimation d'après McFarlane, <em>Colombia before Independence (1993)</em>.`,
    },
 
    {
        id: 'maracaibo',
        nom: 'Maracaibo',
        type: 'port',
        territoire: 'nouvelle-grenade',
        coords: [5932, 4020],

        contexte: `Maracaibo s'étend sur la rive occidentale du lac du même nom, accessible depuis la mer par un chenal étroit gardé par le <strong>Fort San Carlos de la Barra</strong>. Cette géographie en fait une position structurellement difficile à attaquer et facile à bloquer — Morgan l'a pourtant pillée deux fois (1666 et 1669), la seconde fois en brûlant la flotte espagnole qui lui barrait la retraite.

La ville vit du cacao de la région — l'un des meilleurs des Caraïbes — exporté en contrebande vers Curaçao et les Antilles hollandaises autant que légalement. Le gouverneur de Venezuela exerce une autorité nominale sur Maracaibo, mais l'éloignement lui confère une autonomie de fait considérable.`,

        population: `~5 000 habitants`,

        garnison: `Fort San Carlos de la Barra (entrée du lac) : ~80 soldats.`,

        note_mj: `✅ Deux raids de Morgan (1666, 1669) — second raid avec destruction de la flotte espagnole : établi (Exquemelin).<br>
✅ Fort San Carlos de la Barra : établi.<br>
✅ Commerce interlope cacao → Curaçao : établi (carte-data.js, venezuela).<br>
⚠️ Garnison : estimation par analogie avec les places secondaires vénézuéliennes.`,
    },

    {
        id: 'la-guaira',
        nom: 'La Guaira',
        type: 'port',
        territoire: 'venezuela',
        coords: [6501, 4065],

        contexte: [
            { de: 1712, texte: `Unique débarcadère de Caracas sur la mer des Caraïbes, à quelques kilomètres de la capitale par un chemin de montagne raide. La Guaira est moins une ville qu'un entrepôt portuaire : tout ce qui entre ou sort du Venezuela passe par ses quais. Le cacao de Caracas, les produits manufacturés européens importées — tout transite ici. La douane de La Guaira est un point de friction permanent entre les marchands et l'administration coloniale.` },
        ],

        population: `~2 000 habitants permanents`,

        note_mj: `⚠️ La Guaira est peu documentée pour 1712 spécifiquement. Toutes les données sont des estimations.<br>
Pas de fort notable en état de fonctionnement à cette date — la défense côtière est assurée par des batteries légères.`,
    },

    {
        id: 'pampatar',
        nom: 'Pampatar',
        type: 'port',
        territoire: 'marguerita',
        coords: [6967, 3919],

        contexte: [
            { de: 1712, texte: `Port principal de l'île Marguerita, sur la côte est. Le <strong>Castillo San Carlos Borromeo</strong> (1662–1684) est la seule fortification notable de l'île — construit après les pillages français du XVIIe siècle (1576, 1593, 1677). Fort et port sont sur le même site, gardant l'entrée de la baie de Pampatar. La capitale administrative officielle est La Asunción à l'intérieur, mais les gouverneurs préfèrent souvent résider à Pampatar.` },
        ],

        population: `~2 000 habitants`,

        garnison: `Castillo San Carlos Borromeo : ~60 à 80 soldats.`,

        note_mj: `✅ Castillo San Carlos Borromeo, construit 1662–1684 après les pillages français : établi.<br>
✅ Pillages français 1576, 1593, 1677 : établis.<br>
⚠️ Garnison et population : estimations par analogie avec les forts des provinces marginales vénézuéliennes..`,
    },

    {
        id: 'cumana',
        nom: 'Cumaná',
        capitale: true,
        type: 'port',
        territoire: 'nouvelle-andalousie',
        coords: [6782, 4094],

        contexte: [
            { de: 1712, texte: `L'une des plus vieilles villes permanentes des Amériques, fondée en 1515 sur la côte nord-est du Venezuela actuel. Point de départ traditionnel des expéditions vers l'Orénoque et les Llanos, Cumaná est aussi le chef-lieu d'une province dont l'économie repose sur le cacao, la pêche et une contrebande structurelle avec les Hollandais du Surinam et les Français de la Martinique. Le <strong>Castillo San Antonio de la Eminencia</strong> domine la ville depuis une colline — fort en étoile commandant le port et ses approches.` },
        ],

        population: `~8 000 habitants`,

        garnison: `Castillo San Antonio de la Eminencia : ~100 à 120 soldats.`,

        note_mj: `✅ Fondation 1515 : établi.<br>
✅ Castillo San Antonio de la Eminencia : établi — fort en étoile sur promontoire.<br>
⚠️ Garnison : estimation d'après le rang de Cumaná comme chef-lieu de province.<br>
Trinidad dépend nominalement de la province de Cumaná jusqu'en 1731.`,
    },

    {
        id: 'puerto-espana',
        nom: 'Puerto España',
        tags: [`Puerto-Espana`, `Port of Spain`, "Port-d'Espagne"],
        type: 'port',
        territoire: 'trinidad',
        coords: [7387, 3989],

        contexte: [
            { de: 1712, texte: `La capitale officielle de Trinidad est San José de Oruña (Saint Joseph), mais les gouverneurs résident en pratique à Puerto España, mieux située pour surveiller le trafic maritime du golfe de Paria. Puerto España est un bourg de quelques centaines de maisons sans défense organisée, dont la principale activité est un commerce de contrebande avec les Hollandais, les Français et les Anglais des îles voisines. Le cacao de Trinidad sort la nuit dans les criques du nord-ouest ; les manufactures européennes entrent de la même façon.` },
        ],

        population: `~800 à 1 000 habitants`,

        note_mj: `✅ Préférence des gouverneurs pour Puerto España sur San José de Oruña : carte-data.js (trinidad).<br>
⚠️ Population : estimation.<br>
Pas de fort à Puerto España en 1712 — la défense de Trinidad est quasi inexistante. Coordonnées Saint-Joseph de Oruña : [7410, 3990].`,
    },

    // ══════════════════════════════════════════════════════════
    // SÉRIE 3 — Antilles françaises, hollandaises, danoises
    //           + forts isolés
    // ══════════════════════════════════════════════════════════

    {
        id: 'fort-royal-martinique',
        nom: 'Fort-Royal',
        capitale: true,
        type: 'port',
        territoire: 'martinique',
        coords: [7349, 3300],

        contexte: [
            {
                de: 1712,
                texte: `Capitale administrative des Îles du Vent françaises et résidence du gouverneur général. Fort-Royal tient son nom du <strong>Fort Saint-Louis</strong> qui en est l'origine et le cœur — une position sur une presqu'île commandant la grande baie de Fort-Royal, l'un des meilleurs mouillages naturels des Petites Antilles. La ville est militaire et administrative plutôt que marchande — le vrai pouls commercial de la Martinique bat à Saint-Pierre, au nord-ouest.`,
            },
            {
                de: 1717, a: 1718,
                texte: `Le Gaoulé de mai 1717 — soulèvement des grands planteurs contre l'intendant Ricouart et le gouverneur La Varenne — déferle sur Fort-Royal : gouverneur et intendant sont arrêtés dans la ville même et renvoyés de force vers la France.`,
            },
        ],

        population: `~4 000 habitants à Fort-Royal ; ~29 000 sur l'ensemble de l'île (dont ~20 000 esclaves)`,

        garnison: `Fort Saint-Louis : ~250 soldats d'infanterie régulière, plus les artilleurs. Estimation d'après Butel, Histoire des Antilles françaises (2002).`,

        note_mj: `✅ Gaoulé du 23 mai 1717, arrestation de La Varenne et Ricouart : établi (Wikipedia FR ; ANOM).<br>
✅ Fort Saint-Louis comme fondement de la ville : établi.<br>
✅ Mort du gouverneur particulier Montigny, tué par Bartholomew Roberts, octobre 1720 : Johnson, General History (1724).<br>
⚠️ Garnison : Butel (2002) — effectifs précis par fort non établis.`,
    },

    {
        id: 'saint-pierre',
        nom: 'Saint-Pierre',
        type: 'port',
        territoire: 'martinique',
        coords: [7325, 3278],

        contexte: `Premier port commercial de la Martinique et ville la plus peuplée de l'île — en tout point l'opposé de Fort-Royal. Saint-Pierre s'étend en croissant au pied de la Montagne Pelée sur la côte nord-ouest, face à une rade ouverte mais fréquentée en permanence.<br>
Les comptoirs des négociants bordelais et nantais s'alignent sur le front de mer ; les navires négriers y débarquent leur cargaison ; les rhums et les sucres partent pour la France. Le commerce interlope avec les Hollandais de Curaçao et de Saint-Eustache est structurel — Saint-Pierre est l'endroit où l'on peut acheter ce que le monopole colonial interdit d'importer officiellement.<br>
Tout capitaine avec une cargaison d'origine incertaine y trouvera preneur. C'est depuis Saint-Pierre que le Gaoulé de 1717 s'organise.`,

        population: `~8 000 habitants (dont ~5 000 esclaves) — la ville la plus peuplée des Petites Antilles françaises`,

        note_mj: `✅ Saint-Pierre comme capitale marchande, comptoirs bordelais : Butel (2002) ; Debien (1974).<br>
✅ Rôle dans le Gaoulé 1717 : ANOM ; Wikipedia FR.<br>
Saint-Pierre sera détruite le 8 mai 1902 par l'éruption de la Montagne Pelée — en 1712 le volcan est au repos, mais les tremblements de terre sont réguliers et la population en a conscience.<br>
Pas de fort propre — des batteries côtières légères.`,
    },

    {
        id: 'basse-terre-guadeloupe',
        nom: 'Basse-Terre',
        capitale: true,
        type: 'port',
        territoire: 'guadeloupe',
        coords: [7246, 3090],

        contexte: [
            {
                de: 1712, texte: `Capitale administrative de la Guadeloupe, sur la côte sous le vent de la partie volcanique de l'île. Le <strong>Fort Saint-Charles</strong> domine la ville et le mouillage.<br>
Centre gouvernemental et militaire, Basse-Terre est moins active commercialement que Pointe-à-Pitre sur Grande-Terre — mais c'est là que réside le gouverneur particulier de Guadeloupe, sous l'autorité du gouverneur général des Îles du Vent à Fort-Royal.` },
        ],

        population: `~3 000 habitants à Basse-Terre ; ~25 000 sur l'ensemble de l'île (dont ~18 000 esclaves)`,

        garnison: `Fort Saint-Charles : ~150 soldats.`,

        note_mj: `✅ Basse-Terre comme capitale administrative, Fort Saint-Charles : établi.<br>
⚠️ Garnison : estimation par analogie avec Fort-Royal, compte tenu du rang secondaire de Basse-Terre dans la hiérarchie des Îles du Vent.`,
    },

    {
        id: 'saint-georges-grenade',
        nom: "Saint-George's",
        label: "Saint-George's (Grenade)",
        capitale: true,
        type: 'port',
        territoire: 'grenade',
        coords: [7275, 3779],

        contexte: [
            {
                de: 1712, texte: `Capitale et unique port notable de la Grenade française. Saint-George's est bâtie autour d'une rade en fer à cheval, l'une des plus belles des Petites Antilles. La ville exporte sucre, cacao, indigo et les premières muscades qui feront la réputation de l'île.<br>
Point de passage entre les Antilles françaises du nord et Trinidad espagnole au sud, Saint-George's est aussi une escale pour le commerce interlope avec le Venezuela. L'éloignement de Fort-Royal lui confère une autonomie de fait que les gouverneurs successifs gèrent avec pragmatisme.` },
        ],

        population: `~2 500 habitants`,

        note_mj: `✅ Rôle commercial — cacao, sucre, muscade naissante : carte-data.js (grenade).<br>
Pas de fort majeur en 1712 — des batteries côtières légères.`,
    },

    {
        id: 'basseterre',
        nom: 'Basseterre',
        type: 'port',
        territoire: 'saint-christophe',
        coords: [7044, 2862],

        contexte: [
            { de: 1712, texte: `Capitale de Saint-Kitts depuis le début de la colonisation anglaise (1623). Basseterre s'étend dans une plaine basse ouverte sur la côte sous le vent — position commode pour le commerce mais sans défense naturelle. La défense de l'île repose sur Brimstone Hill, à une dizaine de kilomètres au nord-ouest. Depuis le traité d'Utrecht (1713), la partie française de l'île a été cédée à la Grande-Bretagne — ses anciennes habitations sont rachetées à bas prix par les planteurs anglais, alimentant une spéculation foncière intense.` },
        ],

        population: `~5 000 habitants à Basseterre`,

        note_mj: `✅ Cession de la partie française par Utrecht 1713 : établi.<br>
✅ Spéculation foncière post-Utrecht : Wikipedia EN (Saint Kitts).<br>
La défense de l'île est assurée depuis Brimstone Hill — voir entrée dédiée.`,
    },

    {
        id: 'brimstone-hill',
        nom: 'Fort Brimstone Hill',
        capitale: true,
        type: 'fort',
        territoire: 'saint-christophe',
        coords: [7027, 2852],

        contexte: `"Le Gibraltar des Antilles" — surnom mérité pour un fort établi au sommet d'un promontoire volcanique de 240 mètres dominant toute la côte nord-ouest de Saint-Kitts. La position est naturellement imprenable par voie terrestre : les pentes sont raides, le sommet étroit, et la vue dégagée sur mer permet de signaler tout navire approchant avec plusieurs heures d'avance. Les Anglais y ont établi leurs premières batteries dans les années 1690, après le raid français sur l'île.

En 1712, Brimstone Hill est encore en construction dans sa forme définitive — les travaux s'étalent sur tout le XVIIIe siècle — mais les bastions principaux et l'artillerie sont en place. C'est la clé de la défense des Leeward Islands britanniques dans les Petites Antilles.`,

        population: `Garnison uniquement`,

        garnison: `~200 soldats d'infanterie et artilleurs en 1712, effectif en croissance progressive au fil des travaux.`,

        note_mj: `✅ Position sur promontoire volcanique à 240 m : établi.<br>
✅ Construction progressive depuis les années 1690 jusqu'à la fin du XVIIIe : établi — aujourd'hui classé à l'UNESCO.<br>
⚠️ Garnison précise en 1712 : effectif exact non vérifié sur source primaire<br>
⤷ estimation d'après Hartog, History of St. Eustatius, et les archives de Brimstone Hill (St. Kitts National Archives).<br>
🎲 Brimstone Hill est visible depuis la mer à grande distance — point de repère incontournable pour tout navigateur longeant la côte nord de Saint-Kitts.`,
    },

    {
        id: 'saint-johns-antigua',
        nom: "Saint-John's",
        capitale: true,
        type: 'port',
        territoire: 'leeward-islands',
        coords: [7238, 2905],

        contexte: [
            { de: 1712, texte: `Capitale administrative des Leeward Islands et résidence du gouverneur général. Saint-John's est une ville de fonctionnaires et de planteurs — moins active comme port que English Harbour. C'est ici que siège le Conseil et que se règlent les affaires politiques de l'archipel ; c'est ici aussi que Daniel Parke fut lynché en décembre 1710 et que son successeur Douglas monnaya le pardon royal des assassins.` },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Assassinat de Parke, décembre 1710 : Calendar of State Papers ; Encyclopedia Virginia.<br>
✅ Extorsion de Douglas — 10 000 livres pour publier la grâce royale : Wikipedia EN (Walter Douglas).`,
    },

    {
        id: 'english-harbour',
        nom: 'English Harbour',
        type: 'port',
        territoire: 'leeward-islands',
        coords: [7247, 2916],

        contexte: `Base navale de la Royal Navy dans les Petites Antilles, à une vingtaine de kilomètres au sud-est de Saint-John's. English Harbour est un port naturel exceptionnel — une rade quasi-fermée par deux promontoires, abritée des ouragans, avec un fond suffisant pour recevoir les frégates. Le carénage y est possible à l'abri des regards et des vents : les navires sont basculés sur le côté pour gratter et goudronner leurs coques, opération impossible en pleine mer.
        <br><br>
En 1712, les installations permanentes sont encore modestes — les grands arsenaux et corderies de la Nelson's Dockyard seront construits plus tard dans le siècle. Mais la rade est déjà utilisée régulièrement par les frégates de la Jamaica Station et des Leeward Islands. Pour un navire qui veut savoir où se trouve la Royal Navy dans les Petites Antilles, English Harbour est la première réponse.`,

        population: `Quelques centaines — personnel naval, artisans, esclaves employés aux chantiers`,

        garnison: `Batteries côtières aux deux pointes de l'entrée : ~60 à 80 soldats et artilleurs.<br>
Aucun fort majeur en 1712 — les défenses seront renforcées progressivement au cours du siècle.`,

        note_mj: `✅ Qualités nautiques d'English Harbour (rade fermée, carénage possible) : établi.<br>
✅ Nelson's Dockyard — installations permanentes majeures construites à partir des années 1740–1780 : établi. En 1712, les infrastructures sont rudimentaires.<br>
⚠️ Garnison et installations précises en 1712 : peu documentés.`,
    },

    {
        id: 'charlotte-amalie',
        nom: 'Charlotte Amalie',
        capitale: true,
        type: 'port',
        territoire: 'saint-thomas',
        coords: [6756, 2714],

        contexte: `Port franc danois — la ville où l'on peut tout vendre et tout acheter sans trop de questions. Charlotte Amalie s'organise autour d'une baie profonde et abritée, dominée par le <strong>Fort Christian</strong> (1672) sur son promontoire rouge. La Compagnie des Indes occidentales danoise administre formellement l'île, mais son contrôle est nominal : l'économie du port franc repose précisément sur l'absence de contrôle rigoureux.
<br><br>
La population est délibérément cosmopolite — Danois, Hollandais, Anglais, Juifs séfarades coexistent sans que nul ne pose de questions sur les origines. Les esclaves africains représentent les cinq sixièmes de la population totale, transitant vers les colonies espagnoles ou employés dans les plantations. En 1712, la pression britannique commence à peser sur les Danois, mais l'économie fondamentale du port franc reste intacte.`,

        population: `~3 600 habitants (dont ~3 000 esclaves)`,

        garnison: `Fort Christian : ~80 soldats danois.<br>
Petite garnison pour une île dont la survie repose sur la neutralité commerciale plutôt que sur la force militaire.`,

        note_mj: `✅ Fort Christian (1672) : établi.<br>
✅ Population cosmopolite, commerce sans questions, communauté juive séfarade : Westergaard (1917) ; Wikipedia EN (Danish West Indies).<br>
✅ Colonisation de Saint-John par Bredal en 1718, tension avec Hamilton des Leeward Islands : St. John Historical Society.<br>
⚠️ Garnison : estimation d'après Westergaard, <em>The Danish West Indies under Company Rule</em> (1917).`,
    },

    {
        id: 'willemstad',
        nom: 'Willemstad',
        capitale: true,
        type: 'port',
        territoire: 'curaçao',
        coords: [6138, 3769],

        contexte: `Plaque tournante du commerce hollandais dans les Caraïbes — un entrepôt neutre où transitent marchandises européennes, esclaves africains et produits coloniaux de toutes provenances.<br>
Willemstad s'organise autour de la baie de Sint Anna : le quartier de Punda abrite les entrepôts et les comptoirs des marchands ; le <strong>Fort Amsterdam</strong> (1635) domine l'entrée du chenal depuis la pointe ouest.
<br><br>
Tout navire avec quelque chose à vendre ou à acheter sans qu'on lui pose de questions trouve ici un interlocuteur. Le cacao de Caracas arrive à Willemstad illégalement et repart légalement ; les produits manufacturés européens font le chemin inverse. En février 1713, des forces françaises occupent brièvement l'île — épisode humiliant pour la WIC, réglé par la paix d'Utrecht sans indemnité`,

        population: `~8 000 habitants<br>(dont ~5 000 à 6 000 esclaves)`,

        garnison: `Fort Amsterdam : ~120 soldats hollandais`,

        note_mj: `✅ Occupation française de février 1713 : WorldStatesmen.org ; Klooster (1998).<br>
✅ Commerce interlope cacao vénézuélien → Willemstad : Klooster (1998).<br>
✅ Fort Amsterdam (1635) : établi.<br>
⚠️ Garnison : Klooster donne des données économiques — estimation d'après Klooster, <em>Illicit Riches</em> (1998).`,
    },

    {
        id: 'paramaribo',
        nom: 'Paramaribo',
        capitale: true,
        type: 'port',
        territoire: 'suriname',
        coords: [8218, 4616],

        contexte: `Capitale de la colonie hollandaise du Suriname, sur la rive droite du fleuve Suriname. Paramaribo est un hub commercial prospère — ses plantations de sucre, de cacao et de café, exploitées par une main-d'œuvre servile massive, en font l'une des colonies les plus productives des Caraïbes. Le <strong>Fort Zeelandia</strong> (1667) occupe la pointe nord de la ville.
<br><br>
La guerre des Marrons est la réalité permanente de la colonie : des milliers d'esclaves africains fuient les plantations pour la forêt intérieure, où ils forment des communautés autonomes résistant efficacement aux expéditions militaires hollandaises depuis les années 1690. Cette guerre absorbe des ressources considérables et inquiète toutes les colonies à main-d'œuvre servile des Caraïbes.`,

        population: `~5 000 à 8 000`,

        garnison: `Fort Zeelandia : ~150 soldats hollandais.<br>Les expéditions contre les Marrons mobilisent des effectifs supplémentaires variables.`,

        note_mj: `✅ Fort Zeelandia (1667) : établi.<br>
✅ Guerre des Marrons depuis les années 1690 : Price (1973).<br>
✅ Gestion tripartite Société du Surinam depuis 1683 : établi.<br>
⚠️ Garnison : estimation d'après Price, <em>Maroon Societies</em> (1973) — Price donne des données sur les expéditions militaires plutôt que sur la garnison fixe.<br>
Note toponymique : "Paragotos" sur la carte Jaillot désigne probablement le même site que "Suriname" — deux sources compilées sans recoupement par le cartographe.`,
    },

    {
        id: 'bridgetown',
        nom: 'Bridgetown',
        capitale: true,
        type: 'port',
        territoire: 'barbade',
        coords: [7552, 3548],

        contexte: `Capitale et port principal de la Barbade — la plus ancienne et la plus prospère des colonies britanniques des Caraïbes. Bridgetown concentre les entrepôts des planteurs, les comptoirs des négociants de Londres et Bristol, les tavernes des équipages en escale. Le trafic négrier y est intense : la Barbade redistribue les esclaves africains vers les autres îles britanniques. Le sucre barbadien, produit par acre en quantité supérieure à toute autre île, part de ses quais vers l'Angleterre.
<br><br>
Le <strong>Fort Charles</strong> (position de Needham's Point) commande l'entrée de la baie depuis la pointe méridionale.`,

        population: `~50 000 habitants (dont ~42 000 esclaves) — la colonie la plus peuplée des Antilles britanniques`,

        garnison: `Fort Charles / Needham's Point : ~150 soldats d'infanterie régulière`,

        note_mj: `✅ Barbade comme île la plus productive et la plus peuplée des Antilles britanniques : Dunn, <em>Sugar and Slaves</em> (1972).<br>
✅ Gouverneur Lowther — double mandat, extorsion, rétention de navires de guerre : Wikipedia EN ; <em>History of Parliament Online</em>.<br>
⚠️ Garnison : estimation par analogie avec les garnisons britanniques aux Antilles pour une île de ce rang.`,
    },

    {
        id: 'merida',
        nom: 'Mérida',
        capitale: true,
        territoire: 'yucatan',
        coords: [2613, 2435],

        contexte: [
            {
                de: 1712, texte: `Capitale de la capitainerie générale du Yucatán, à l'intérieur de la péninsule, loin de la côte Caraïbe. Ville administrative et épiscopale fondée en 1542 sur les ruines de la cité maya de T'ho.<br>
                Mérida n'est pas un port — son accès à la mer passe par Campeche, à une centaine de kilomètres à l'ouest. C'est depuis Mérida que le gouverneur-capitaine général administre le Yucatán, une capitainerie distincte de la vice-royauté de Mexico.` },
        ],

        population: `~8 000 habitants<br>(dont ~6 000 Mayas)`,

        note_mj: `Mérida n'a pas de fort militaire notable — la défense du Yucatán côté Caraïbe repose sur l'enceinte de Campeche. Entrée présente pour compléter la carte administrative ; faible intérêt narratif direct pour la campagne.`,
    },

];
