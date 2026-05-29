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
        id: 'charles-town',
        nom: 'Charles Town (Charleston)',
        capitale: true,
        type: 'port',
        territoire: 'caroline-du-sud',
        coords: [4390, 470],

        contexte: `Principal port des colonies britanniques du Sud. Charles Town exporte riz, indigo et esclaves africains vers l'Angleterre ; elle importe manufactures et rhum des Antilles. Son port est le seul débouché maritime de la Caroline du Sud et le point de passage de tout le commerce régional. Les marchands de Charles Town sont parmi les plus actifs fournisseurs du marché pirate de Nassau — rhum, provisions, outils contre butin revendu discrètement. En juin 1718, Barbe-Noire bloque le port avec quatre navires, prend des otages parmi les notables et impose ses conditions sans rencontrer la moindre résistance navale — épisode révélateur de l'impuissance militaire de la colonie au sortir de la guerre yamasee.`,

        population: `~4 000 habitants intra-muros (dont ~1 500 esclaves) ; ~18 000 dans toute la province`,

        note_mj: `✅ Blocus de Barbe-Noire juin 1718 : établi (Johnson, General History ; Woodard, Republic of Pirates).
✅ Commerce interlope avec Nassau : Calendar of State Papers Colonial.
Pas de fort notable à Charles Town en 1712–1718 — la ville est défendue par des palissades et deux batteries côtières modestes, insuffisantes face à une escadre.`,
    },

    {
        id: 'san-agustin',
        nom: 'San Agustín (Saint Augustine)',
        capitale: true,
        territoire: 'floride',
        coords: [3967, 1087],

        contexte: `Unique ville permanente de Floride. San Agustín est d'abord un presidio — une garnison avec une ville autour — dont la valeur est stratégique plutôt qu'économique. Le Castillo de San Marcos, fort en coquina (pierre corallienne locale résistant aux boulets), domine la baie depuis 1695. La ville accueille les esclaves fugitifs des plantations caroliniennes à qui Madrid accorde la liberté contre le baptême et le service militaire — pratique qui attise les tensions avec Charles Town. La garnison ne dépasse pas 300 hommes, chroniquement sous-payés et mal équipés ; les missions franciscaines de l'arrière-pays ont été détruites par les raids anglais de 1704.`,

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
        capitale: true,
        territoire: 'louisiane',
        coords: null,

        contexte: `Capitale de la Louisiane française jusqu'en 1718. Mobile est un comptoir plus qu'une ville — quelques centaines d'habitants autour d'un fort en bois sur la rive de la baie du même nom. Son rôle est d'ancrer l'alliance avec les Choctaws et d'affirmer la présence française entre la Floride espagnole et les colonies caroliniennes. Le commerce des peaux est la seule ressource notable. En 1718, Bienville fonde La Nouvelle-Orléans sur le Mississippi et Mobile perd définitivement sa primauté.`,

        population: `~250 habitants (soldats, colons, engagés) ; Choctaws alliés en transit permanent`,

        garnison: `~150 soldats au Fort Louis de la Mobile — estimation : la garnison louisianaise totale ne dépasse pas 300 hommes sur toute la période (Giraud, Histoire de la Louisiane française, 1953), dont la moitié environ stationnée à Mobile.`,

        note_mj: `⚠️ Effectif précis de la garnison de Mobile : non établi par source directe. Estimation par extrapolation depuis l'effectif total louisianais (Giraud).
✅ Mobile capitale jusqu'en 1718 : établi.`,
    },

    {
        id: 'la-nouvelle-orleans',
        nom: 'La Nouvelle-Orléans',
        capitale: true,
        territoire: 'louisiane',
        coords: [1297, 1314],

        contexte: `Fondée par Bienville en 1718 sur un méandre du Mississippi à quelques kilomètres du lac Pontchartrain. En 1718–1720, c'est un chantier dans un marais : quelques dizaines de maisons en bois, une palissade, des ouvriers qui meurent de fièvre. La Compagnie des Indes y déverse des colons recrutés parfois de force. Sa vocation est de devenir le nœud entre le bassin du Mississippi et le Golfe du Mexique — ambition que la géographie justifie, mais que les conditions de 1718 rendent difficilement crédible.`,

        population: `Quelques centaines en 1718, croissance rapide et chaotique jusqu'à ~1 500 vers 1720`,

        note_mj: `✅ Fondation 1718, conditions précaires : établi (DCB, 64 Parishes/LSU).
Pour la campagne : La Nouvelle-Orléans n'existe pas avant 1718 — tout événement antérieur dans la région se situe à Mobile ou dans les postes du Mississippi.`,
    },

    {
        id: 'saint-georges-bermudes',
        nom: "Saint George's (Bermudes)",
        capitale: true,
        territoire: 'bermudes',
        coords: null,

        contexte: `Capitale et unique ville notable des Bermudes. Saint George's s'organise autour de son port naturel — l'un des rares bons mouillages de l'archipel — et de ses chantiers navals. Le cèdre des Bermudes produit des coques légères et durables, réputées dans tout l'Atlantique. Les pilotes bermudiens, familiers des hauts-fonds de l'archipel, se retrouvent sur tous les navires qui naviguent entre les colonies. Certains d'entre eux figurent parmi les équipages pirates de Nassau — leur connaissance des passes est un atout irremplaçable.`,

        population: `~6 000 sur l'ensemble de l'archipel (dont ~2 000 esclaves) ; Saint George's regroupe l'essentiel de la population`,

        note_mj: `✅ Réputation des chantiers bermudiens et des pilotes : établi (sources maritimes générales).
✅ Bermudiens parmi les pirates de Nassau : Calendar of State Papers Colonial.
Fort Hamilton : construit à partir de 1620 environ, en état modeste à cette période — davantage une batterie côtière qu'un vrai fort de garnison.`,
    },

    {
        id: 'spanish-town',
        nom: 'Spanish Town (Jamaïque)',
        territoire: 'jamaique',
        coords: null,

        contexte: `Capitale administrative de la Jamaïque. Spanish Town abrite le gouverneur, l'Assemblée coloniale et les tribunaux. Ville de papiers et de fonctionnaires, sans port, à une vingtaine de kilomètres à l'intérieur des terres depuis la baie de Kingston.`,

        population: `~2 000 habitants`,

        note_mj: `Pas de fort ni de garnison propre — la défense de la Jamaïque est assurée depuis Port Royal. Spanish Town est mentionnée pour compléter la carte administrative, sans intérêt narratif direct pour la campagne.`,
    },

    {
        id: 'kingston',
        nom: 'Kingston & Port Royal',
        territoire: 'jamaique',
        coords: [4833, 2890],

        contexte: `<strong>Port Royal</strong> occupait avant 1692 l'angle d'un long banc de sable fermant la baie de Kingston — ville de négoce et de plaisir surnommée "la plus riche et la plus impie du Nouveau Monde". Le tremblement de terre du 7 juin 1692 a englouti les deux tiers de la ville en deux minutes, noyant entre 2 000 et 5 000 personnes. Port Royal n'a pas disparu — la péninsule a été reconsolidée, une partie des bâtiments reconstruits — mais la population civile ne s'y est jamais réinstallée massivement. Ce qui reste est militaire et pénal : la base navale de la Royal Navy, les entrepôts d'avitaillement, et le Gallows Point.

<strong>Le Gallows Point</strong> est le lieu d'exécution des pirates condamnés à Kingston. Les corps sont ensuite exposés en cage de fer à l'entrée du port — pour l'exemple, disent les ordonnances — visibles de tout navire entrant dans la baie. Charles Vane y est pendu en 1721 ; son corps reste exposé plusieurs mois.

<strong>Kingston</strong>, fondée en 1693 sur la rive nord de la baie en face de Port Royal, est le centre marchand de fait. C'est là que les négociants jamaïcains ont leurs entrepôts, leurs comptoirs, leurs tavernes. Le butin pirate revendu par des intermédiaires discrets transite par Kingston avant de disparaître dans le circuit du commerce légal. Le sucre et le rhum jamaïcains partent de ses quais vers l'Angleterre et les colonies du Nord.

<strong>Fort Charles</strong>, à Port Royal, est la pièce maîtresse de la défense de la baie. Il commande l'entrée depuis la pointe de la péninsule.`,

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
        capitale: true,
        territoire: 'saint-domingue',
        coords: [5497, 2541],

        contexte: `Capitale de Saint-Domingue et ville la plus active des Antilles françaises. Le Cap s'étend sur une plaine étroite coincée entre la mer et les mornes du nord d'Hispaniola. Ses quais expédient vers Bordeaux et Nantes le sucre, l'indigo et le cacao des grandes habitations de la plaine du Nord. Le Conseil supérieur y siège, le gouverneur général y réside, et les négociants de toute la Caraïbe y font escale. Les tavernes, maisons closes et entrepôts du port constituent une économie parallèle fréquentée par des marins de toutes nationalités — dont certains n'ont pas de papiers en règle. Un capitaine avec une cargaison d'origine douteuse y trouvera preneur, à condition de ne pas attirer l'attention des autorités.`,

        population: `~10 000 à 12 000 habitants (dont ~8 000 esclaves)`,

        note_mj: `✅ Capitale de Saint-Domingue, siège du gouverneur général : établi (ANOM).
✅ Rôle commercial — sucre, indigo, cacao vers Bordeaux : Debien, Les esclaves aux Antilles françaises (1974).
🎲 Le Cap est le décor de Satiété engendre Démesure (janvier 1714, sous Blénac).`,
    },

    {
        id: 'petit-goave',
        nom: 'Petit-Goâve',
        territoire: 'saint-domingue',
        coords: [5340, 2769],

        contexte: `Ancienne capitale des flibustiers français de Saint-Domingue. Dans les années 1660–1690, Petit-Goâve était le point de rassemblement des boucaniers de la côte ouest d'Hispaniola — une ville de planches et de tavernes où les équipages se formaient, les prises se vendaient, et les gouverneurs fermaient les yeux. En 1712, cette époque est révolue depuis une génération : Petit-Goâve est un bourg modeste en déclin, dont les habitants vivent surtout d'un petit commerce de denrées et de pêche côtière. Il reste un mouillage commode sur la route entre Le Cap et la côte sud, mais plus rien de la turbulence d'antan.`,

        population: `~1 500 habitants`,

        note_mj: `✅ Rôle boucanier 1660–1690 : Exquemelin, Flibustiers et boucaniers ; Du Tertre, Histoire générale des Antilles.
✅ Déclin après 1700 : Paris a progressivement centralisé l'administration à Cap-Français et interdit les lettres de marque sauvages.
⚠️ Population 1712 : estimation — aucun recensement précis disponible pour cette date.
🎲 Un PJ qui cherche ici l'animation d'antan sera déçu — et c'est précisément ce décalage qui peut être narrativement intéressant.`,
    },

    {
        id: 'basse-terre-tortue',
        nom: 'Basse-Terre (Île de la Tortue)',
        territoire: 'tortue',
        coords: [5310, 2528],

        contexte: `Bourg principal de l'île de la Tortue, organisé autour du Fort de la Roche — l'unique position défendable de l'île, taillée à même le promontoire rocheux qui domine la rade. En 1712, la Tortue est une dépendance administrative de Saint-Domingue sans gouverneur propre. Le bourg est modeste : quelques centaines d'habitants, des pêcheurs, une garnison squelettique. Sa seule réputation vivante est sanitaire — les marins de la côte lui prêtent un "air" qui épargne la fièvre jaune, et un homme qui se sait atteint cherche parfois à gagner l'île pour tenter sa chance.`,

        population: `Quelques centaines d'habitants (garnison, pêcheurs, colons)`,

        garnison: `Fort de la Roche : ~30 à 50 soldats. Estimation par analogie avec les petits postes français des Antilles à population et importance comparables. Aucune source primaire directe disponible pour 1712.`,

        note_mj: `✅ Réputation sanitaire (fièvre jaune rare) : attestée dans les sources de l'époque — Du Tertre, Labat. Explication réelle inconnue des contemporains (altitude, absence de zones marécageuses étendues, moins de moustiques Aedes aegypti).
✅ Fort de la Roche : construit sous d'Ogeron (~1665–1675), en état de fonctionnement au début du XVIIIe.
⚠️ Garnison et population : estimations — aucune source directe.
À ne pas confondre avec l'Isla La Tortuga vénézuélienne.`,
    },

    {
        id: 'harbour-island',
        nom: 'Harbour Island',
        territoire: 'eleuthera',
        coords: [4719, 1610],

        contexte: `Îlot de quelques kilomètres au nord-est de la pointe septentrionale d'Eleuthera, Harbour Island est le centre le plus actif de l'archipel des Bahamas hors Nassau. Sa baie naturelle, protégée par un banc de sable, offre un mouillage abrité accessible aux sloops et aux goélettes — mais difficile pour les grands bâtiments, ce qui constitue une protection naturelle.

La communauté résidente compte une trentaine de familles en 1717 — descendants des fondateurs puritains de 1648, protestants républicains hostiles par tradition à la monarchie. Cette mémoire les range sans hésitation dans le camp hanovrien en 1718 quand la question du pardon royal divise Nassau.

Harbour Island est le sas entre Nassau et le monde légal. Des marchands de Boston et de Charles Town y traitent avec les pirates sans se compromettre directement à Nassau. Le rapport Musson de 1717 signale deux navires de 90 tonneaux venus de Boston vendre des provisions aux pirates — mouillés ici, pas à Nassau. Les familles Darvill et Stillwell fournissent vivres, eau douce et rhum ; Richard Thompson et John Cockram importent depuis Curaçao et les colonies continentales les marchandises manufacturées que les pirates ne peuvent obtenir ailleurs. Cockram est l'un des compagnons de la première heure d'Hornigold (1713) ; Thompson est son beau-père depuis 1714.

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
        territoire: 'santo-domingo',
        coords: [5821, 2780],

        contexte: `Première ville européenne permanente des Amériques, fondée en 1498 sur la rive sud d'Hispaniola. Santo Domingo conserve son prestige historique — siège de la Real Audiencia, première cathédrale, premier palais colonial du Nouveau Monde — mais la ville est en 1712 une cité appauvrie et clairsemée. La Fortaleza Ozama, construite en 1502 sur la rive du fleuve du même nom, est le plus vieux fort européen des Amériques encore debout. La Real Audiencia de Santo Domingo exerce nominalement une juridiction sur Cuba, Porto Rico, la Floride et le Venezuela, mais cette autorité est de plus en plus fictive à mesure que Madrid réorganise son empire.`,

        population: `~5 000 à 8 000 habitants (dont ~1 500 esclaves)`,

        garnison: `Fortaleza Ozama : ~80 à 120 soldats. Estimation par analogie avec les garnisons des places espagnoles de même rang et de même éloignement des circuits principaux. Aucune source primaire directe pour 1712.`,

        note_mj: `✅ Fortaleza Ozama, 1502 — plus vieux fort européen des Amériques : établi.
✅ Real Audiencia compétente sur Cuba, Porto Rico, Floride, Venezuela : établi.
⚠️ Garnison et population : estimations.
⚠️ Gouverneur de 1712 non identifié avec certitude avant Pedro de Niela y Torres (1713).`,
    },

    {
        id: 'san-juan',
        nom: 'San Juan (Porto Rico)',
        capitale: true,
        territoire: 'porto-rico',
        coords: [6551, 2727],

        contexte: `San Juan est bâtie sur un îlot rocheux relié à l'île principale par deux ponts-levis — position qui en fait naturellement une des places les mieux défendues des Antilles. Deux châteaux-forts commandent l'accès : le <strong>Castillo San Felipe del Morro</strong> à la pointe ouest de l'îlot, dominant l'entrée du chenal depuis le XVIe siècle, et le <strong>Castillo San Cristóbal</strong> à l'est, protégeant l'accès terrestre depuis la grande île. L'enceinte de murailles reliant les deux forts est pratiquement continue.

La ville vit du situado — la subvention annuelle de Mexico finançant garnison et administration — et d'un commerce de contrebande que tout le monde pratique et que personne n'avoue. Les marchands anglais et hollandais qui ne peuvent entrer légalement font escale à Vieques (Boreque sur la carte), à 8 km au sud-est, ou dans les anses de la côte nord.

La figure dominante de San Juan n'est pas le gouverneur mais <strong>Miguel Enríquez</strong> — fils d'une ancienne esclave, devenu cordonnier puis corsaire, aujourd'hui l'homme le plus riche des Caraïbes espagnoles. Depuis 1702, sa flotte (jusqu'à trente embarcations) protège les côtes espagnoles des incursions anglaises et hollandaises. En 1713, Philippe V lui remet la Medalla de oro de la Real Efigie, distinction quasi-inédite pour un homme de sa condition. Ses connexions commerciales avec Curaçao, Saint-Thomas et la Nouvelle-Angleterre en font un État dans l'État.`,

        population: `~6 000 habitants intra-muros ; ~18 000 sur l'ensemble de l'île`,

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
        nom: 'La Havane (Cuba)',
        capitale: true,
        territoire: 'cuba',
        coords: [3695, 2084],

        contexte: `Pivot logistique de l'empire espagnol dans les Caraïbes occidentales. La Havane est le point de rassemblement des flottes du Trésor avant leur traversée vers Cadix — tous les galions chargés d'argent péruvien ou mexicain y font escale, s'y ravitaillent, y attendent la saison favorable. Ce statut en fait la ville la plus active et la mieux défendue du monde caraïbe hispanique.

Deux fortifications commandent l'entrée du port : le <strong>Castillo de los Tres Reyes del Morro</strong> à la pointe est du chenal (1589–1630), dominant le passage depuis une falaise de 35 mètres, et le <strong>Castillo de la Real Fuerza</strong> à l'intérieur même de la ville (1558), plus ancien fort de pierre des Amériques, qui sert davantage de résidence au gouverneur et d'entrepôt que de position défensive face à une attaque navale. Les deux forts ont des fonctions et des positions distinctes.

La principale richesse locale est le tabac de la Vuelta Abajo, cultivé par de petits planteurs — les <em>vegueros</em> — sous un monopole royal imposé en 1717 qui déclenche la première révolte cubaine documentée. Les vegueros se soulèvent trois fois (1717, 1720, 1723), chaque fois réprimés, jamais convaincus. En 1723, onze meneurs sont pendus le long des routes de la Vuelta Abajo.`,

        population: `~35 000 habitants sur l'ensemble de l'île (dont ~10 000 esclaves) ; La Havane intra-muros : ~12 000 à 15 000`,

        garnison: `Castillo del Morro : ~200 soldats. Real Fuerza : ~80 soldats (fonction résidentielle et d'entrepôt autant que militaire). Garnison totale de La Havane : ~500 à 600 hommes en temps ordinaire, pouvant monter à plusieurs milliers lors des escales de la flotte. Estimation d'après Kuethe & Marchena, Soldados del Rey (2005).`,

        note_mj: `✅ Castillo del Morro (1589–1630) et Real Fuerza (1558) — deux forts distincts : établi.
✅ Révolte des vegueros 1717, 1720, 1723 — pendaisons 1723 : Wikipedia EN (Vegueros Revolt).
✅ Monopole tabacier imposé 1717 : établi.
⚠️ Garnison : Kuethe & Marchena couvrent la période bourbonienne tardive — extrapolation pour 1712–1724, antérieure aux grandes réformes militaires.`,
    },

    {
        id: 'santiago-de-cuba',
        nom: 'Santiago de Cuba',
        territoire: 'cuba',
        coords: [4824, 2522],

        contexte: `Second port de Cuba, sur la côte sud orientale — à l'opposé de La Havane tant géographiquement qu'économiquement. Santiago vit dans l'orbite de la Jamaïque britannique voisine autant que dans celle de La Havane : le commerce interlope avec Kingston est structurel, toléré par des gouverneurs locaux qui y trouvent leur compte. Le <strong>Castillo del Morro de Santiago</strong> (San Pedro de la Roca, 1638–1700) domine l'entrée de la baie depuis un promontoire à 60 mètres de hauteur — l'une des positions les mieux conservées de l'architecture militaire espagnole en Amérique.`,

        population: `~6 000 habitants`,

        garnison: `Castillo del Morro de Santiago : ~150 soldats. Estimation par analogie avec les places secondaires de la Caraïbe espagnole — aucune source primaire directe pour 1712.`,

        note_mj: `✅ Castillo del Morro de Santiago (San Pedro de la Roca), 1638–1700 : établi — classé au patrimoine mondial de l'UNESCO.
✅ Commerce interlope avec la Jamaïque : inféré de la géographie et des pratiques documentées.
⚠️ Garnison et population : estimations.`,
    },

    {
        id: 'tampico',
        nom: 'Tampico',
        territoire: 'panuco',
        coords: [1153, 2032],

        contexte: `Port modeste à l'embouchure du río Pánuco sur le Golfe du Mexique — seul débouché maritime entre Veracruz au sud et la Floride au nord. Saccagé par les pirates en 1684, le traumatisme reste présent dans les mémoires locales. Le commerce interlope avec des navires anglais de la Nouvelle-Angleterre est une réalité tolérée faute de moyens de surveillance. Aucun fort permanent en état.`,

        population: `~2 000 habitants`,

        note_mj: `✅ Saccage par les pirates en 1684 : sources locales concordantes (Herrera Casasús, UAT, 1988).
⚠️ Population : estimation.`,
    },

    {
        id: 'veracruz',
        nom: 'Veracruz',
        territoire: 'nouvelle-espagne',
        coords: [1172, 2628],

        contexte: `Premier port de la Nouvelle-Espagne sur l'Atlantique et unique débouché légal de tout le commerce entre Mexico et l'Espagne. L'argent des mines de Zacatecas et de Guanajuato passe par Veracruz avant d'embarquer pour Cadix — ce qui en fait la cible la plus convoitée du Golfe du Mexique.

Le <strong>Fort San Juan de Ulúa</strong> n'est pas sur la côte mais sur un îlot corallien à quelques centaines de mètres du rivage, commandant l'entrée de la rade. Son rôle est double : défense contre les attaques maritimes, et entrepôt sécurisé pour le trésor avant embarquement.

En 1683, le flibustier Lorencillo (Laurent de Graff) et Grammont s'emparent de la ville pendant plusieurs jours — pillage mémorable qui a laissé des traces durables dans la mémoire collective. Le fort n'avait pas été pris, mais la ville fut rançonnée. Depuis lors, les défenses terrestres ont été renforcées.`,

        population: `~6 000 à 8 000 habitants permanents ; peut doubler lors des arrivées de flottes`,

        garnison: `Fort San Juan de Ulúa : ~400 soldats et artilleurs. Garnison de la ville : ~200 soldats supplémentaires. Total estimé : ~600 hommes. Estimation d'après Archer, The Army in Bourbon Mexico (1977) — données postérieures aux réformes, probablement supérieures à l'effectif de 1712.`,

        note_mj: `✅ Raid de Lorencillo et Grammont, 1683 : établi.
✅ Fort San Juan de Ulúa sur îlot corallien : établi.
⚠️ Garnison : Archer (1977) couvre la période bourbonienne tardive — effectifs de 1712 probablement inférieurs.`,
    },

    {
        id: 'campeche',
        nom: 'Campeche',
        territoire: 'yucatan',
        coords: [2314, 2607],

        contexte: `Port d'exportation du bois de teinture — le <em>palo de tinte</em> (bois de campêche, *Haematoxylum campechianum*) dont la sève rouge-violet teint les draps de laine des manufactures européennes. Cette richesse en fait depuis le XVIIe siècle une cible récurrente des flibustiers : L'Olonnais en 1666, Laurent de Graff en 1685 et 1686, Morgan en 1663. La ville porte les cicatrices de ces raids — et les murailles construites en réponse.

L'enceinte fortifiée de Campeche, commencée en 1686 précisément après les raids répétés, est en 1712 l'une des rares villes entièrement ceintes de murailles dans toute l'Amérique espagnole. Huit bastions hexagonaux complètent le système. Les Anglais de la baie du Belize coupent du bois de campêche à quelques dizaines de kilomètres au sud — tension permanente que les autorités du Yucatán n'ont pas les moyens de résoudre.`,

        population: `~6 000 habitants`,

        garnison: `Garnison de l'enceinte : ~300 soldats répartis sur les huit bastions. Fort San Miguel (position avancée en hauteur) : ~80 hommes. Estimation d'après Calderón Quijano, Historia de las Fortificaciones en Nueva España (1984).`,

        note_mj: `✅ Raids flibustiers (L'Olonnais 1666, Lorencillo 1685–1686, Morgan 1663) : établis.
✅ Enceinte fortifiée commencée en 1686, huit bastions : établi — aujourd'hui classée à l'UNESCO.
✅ Bois de campêche comme richesse principale : établi.
⚠️ Garnison : Calderón Quijano couvre l'ensemble de la période coloniale — extrapolation pour 1712.`,
    },

    {
        id: 'trujillo',
        nom: 'Trujillo (Honduras)',
        territoire: 'honduras',
        coords: [2949, 3278],

        contexte: `Seul port espagnol de la côte Caraïbe hondurienne. Trujillo marque la frontière orientale de l'autorité de Madrid — au-delà, c'est la côte Miskito. La ville est modeste, mal défendue, chroniquement menacée par les raids miskitos et les incursions anglaises depuis la Jamaïque. Son utilité principale : point de départ des routes vers l'intérieur du Honduras et Comayagua.`,

        population: `~1 000 habitants`,

        note_mj: `⚠️ Trujillo est peu documentée pour cette période. Toutes les données sont des estimations par analogie avec les postes espagnols comparables de la côte Caraïbe.`,
    },

    {
        id: 'cap-gracias-a-dios',
        nom: 'Cap Gracias a Dios',
        capitale: true,
        territoire: 'cote-miskito',
        coords: [3568, 3452],

        contexte: `Pointe extrême orientale de la côte hondurienne, où le littoral s'infléchit vers le sud. Siège de fait du roi Miskito, investi à Spanish Town (Jamaïque) mais résidant ici. Le Cap est le nœud de toute navigation sur la côte Miskito : les sloops jamaïcains qui viennent troquer armes et rhum contre bois et tortues y font escale. Pas d'établissement européen permanent — quelques cases, un mouillage, et la présence du roi avec ses guerriers.`,

        population: `Quelques centaines de Miskitos autour du cap ; ~15 000 Miskitos dispersés sur l'ensemble de la côte`,

        note_mj: `✅ Cap Gracias a Dios comme siège du roi Miskito : établi (Wikipedia EN, Miskito people).
✅ Investiture du roi à Spanish Town, Jamaïque : établi.
⚠️ Nom précis du roi en 1712 : non identifié. Jeremy I est documenté dans les années 1720.`,
    },

    {
        id: 'granada-nicaragua',
        nom: 'Granada (Nicaragua)',
        territoire: 'nicaragua',
        coords: [2772, 4009],

        contexte: `Ville la plus riche du Nicaragua espagnol, sur la rive occidentale du lac Nicaragua. Sa vulnérabilité structurelle est géographique : le río San Juan relie le lac à la mer des Caraïbes — une voie navigable depuis la côte atlantique jusqu'au cœur de la ville. Morgan l'a remontée en 1665 pour saccager Granada. Le <strong>Fort Inmaculada</strong>, à l'embouchure du río San Juan sur la mer, est censé barrer cette route — mais la garnison est insuffisante et le fort en mauvais état permanent.`,

        population: `~4 000 habitants`,

        garnison: `Fort Inmaculada (río San Juan, à ~150 km de Granada) : ~60 à 80 soldats. Le fort est distinct de Granada — il en est la défense avancée. Estimation par analogie avec les postes nicaraguayens de même rang.`,

        note_mj: `✅ Saccage de Granada par Morgan via le río San Juan, 1665 : établi.
✅ Fort Inmaculada à l'embouchure du río San Juan : établi.
⚠️ Garnison : estimation. Le fort sera renforcé au cours du XVIIIe siècle — les effectifs de 1712 sont probablement inférieurs aux sources bourboniennes.`,
    },

    {
        id: 'fort-san-lorenzo',
        nom: 'Fort San Lorenzo (río Chagres)',
        territoire: 'panama',
        coords: null,

        contexte: `Position isolée à l'embouchure du río Chagres sur la côte Caraïbe de l'isthme, à quelques dizaines de kilomètres à l'ouest de Portobelo. San Lorenzo est le verrou de la traversée de l'isthme : le Chagres remonte vers l'intérieur sur plus de cent kilomètres, permettant d'approcher Panama City à une journée de marche. Contrôler San Lorenzo, c'est contrôler la route.

Henry Morgan l'a pris d'assaut en décembre 1670 — avec pertes sévères — avant de remonter le Chagres et de traverser l'isthme jusqu'à Panama City. Reconstruit et renforcé après ce raid, le fort occupe un promontoire de 60 mètres au-dessus du fleuve. En 1712, c'est un poste isolé en forêt tropicale, tenu par une garnison clairsemée dans un climat meurtrier.`,

        population: `Garnison uniquement — aucun civil permanent`,

        garnison: `~100 à 150 soldats. Le fort est réputé difficile à tenir : les maladies tropicales déciment régulièrement les garnisons fraîchement arrivées d'Espagne. Effectif réel souvent inférieur à l'effectif théorique. Estimation d'après la taille et l'importance stratégique du fort, comparable aux sources sur Portobelo (AGI Panama).`,

        note_mj: `✅ Prise par Morgan, décembre 1670, combat violent : établi (Exquemelin ; Earle, The Sack of Panama, 1981).
✅ Position sur promontoire à 60 m, vue sur mer et fleuve : établi.
✅ Reconstruction post-Morgan, plan en étoile : établi.
⚠️ Garnison 1712 : estimation — les sources primaires (AGI Panama) donnent des effectifs théoriques peu fiables pour cette période.
🎲 San Lorenzo est un lieu en soi, pas une dépendance de Panama City : on n'y arrive pas par hasard.`,
    },

    {
        id: 'portobelo',
        nom: 'Portobelo',
        territoire: 'panama',
        coords: [3865, 4230],

        contexte: `Portobelo est une contradiction permanente : l'un des ports les plus importants de l'empire espagnol dans une ville perpétuellement à moitié vide, dans une baie réputée mortelle pour les Européens non acclimatés. Sa valeur est entièrement liée aux foires — et les foires sont irrégulières.

Quand les galions arrivent de Carthagène, la ville se transforme en quelques jours. Des marchands de Lima, Buenos Aires, Carthagène et Séville envahissent ses rues pour échanger l'argent du Pérou contre les manufactures européennes. Les prix s'envolent, les tavernes débordent, les maladies tropicales font des ravages parmi les non-acclimatés. Puis les galions repartent et Portobelo se vide — jusqu'à la prochaine foire.

Trois forts commandent la baie : le <strong>Fort San Felipe de Todo Fierro</strong> sur la rive sud à l'entrée, le <strong>Fort Santiago de la Gloria</strong> sur la rive nord face au premier, et le <strong>Fort San Fernando</strong> à l'intérieur de la baie côté ville. Aucun des trois n'est redoutable isolément — Morgan les prend tous en 1668 en quelques heures en débarquant à l'est et les attaquant à revers par voie terrestre.`,

        population: `~500 habitants permanents ; 10 000 à 30 000 pendant les foires`,

        garnison: `Fort San Felipe : ~80 soldats. Fort Santiago : ~60 soldats. Fort San Fernando : ~80 soldats. Total en temps ordinaire : ~220 hommes, renforcés depuis Panama City et Carthagène lors des foires. Estimation d'après Lane, Pillaging the Empire (1998).`,

        note_mj: `✅ Prise par Morgan en 1668 — attaque terrestre de nuit, forts pris à revers : établi (Exquemelin ; Earle, The Sack of Panama).
✅ Trois forts distincts (San Felipe, Santiago, San Fernando) : établi.
✅ Foires de Portobelo — fonctionnement et irrégularité : établi (Lane ; Pearce, British Trade with Spanish America, 2007).
✅ Vernon 1739 : établi — hors période de campagne, mais connu des joueurs comme horizon.
⚠️ Suspension des foires pendant la guerre de la Quadruple-Alliance (1718–1720) : vraisemblable, à confirmer sur source primaire.
🎲 Portobelo hors foire est une ville fantôme malsaine. Portobelo en foire est le plus grand marché du monde atlantique — et le plus dangereux pour la santé.`,
    },

    {
        id: 'panama-city',
        nom: 'Panama City',
        capitale: true,
        territoire: 'panama',
        coords: [4020, 4370],

        contexte: `Capitale de l'isthme, sur la côte pacifique. Panama City est la tête de la route de l'argent péruvien — le Camino Real qui traverse l'isthme depuis Portobelo à l'est. C'est ici que les lingots et les pièces de huit déchargés de Callao sont reconditionnés avant de traverser la jungle jusqu'à la côte Caraïbe. La ville reconstruite après le sac de Morgan (1671) est mieux fortifiée, mais sa vulnérabilité structurelle — accessible depuis les deux côtes — demeure. En 1712, Panama City est une ville de transit et d'administration, sans grand commerce propre : tout ce qui vaut quelque chose y passe, rien n'y reste.`,

        population: `~8 000 habitants`,

        garnison: `~300 soldats d'infanterie régulière, plus une milice de colons. Estimation d'après le rang et l'importance de la place.`,

        note_mj: `✅ Sac par Morgan 1671, reconstruction sur nouveau site : établi (Earle, The Sack of Panama, 1981).
✅ Panama dépend du vice-roi du Pérou (Lima), pas de Mexico — distinction essentielle.
⚠️ Garnison : estimation.`,
    },

    {
        id: 'bocachica',
        nom: 'Fort Bocachica (Carthagène)',
        territoire: 'nouvelle-grenade',
        coords: [4804, 4103],

        contexte: `Le Fort Bocachica contrôle l'unique chenal navigable donnant accès à la baie intérieure de Carthagène. Toute attaque navale sur Carthagène doit d'abord forcer ce passage. En 1712, le fort est en état de fonctionnement, armé de canons commandant le chenal. À quelques kilomètres de la ville, c'est une position autonome avec sa propre garnison. Francisco de Meneses, président-gouverneur renversé par ses propres oidores en 1715, y sera emprisonné après sa destitution.`,

        population: `Garnison uniquement`,

        garnison: `~80 à 120 soldats. La position est complétée par le Fort San Fernando sur la rive opposée du chenal — ensemble ils forment le double verrou de la baie. Estimation d'après McFarlane, Colombia before Independence (1993).`,

        note_mj: `✅ Bocachica comme verrou de la baie de Carthagène : établi — rôle confirmé lors du siège de Vernon en 1741.
✅ Emprisonnement de Meneses à Bocachica après 1715 : carte-data.js (nouvelle-grenade).
⚠️ Fort San Fernando (rive opposée) : reconstruction principale postérieure à 1741 — statut précis en 1712 incertain.
⚠️ Garnison : estimation.`,
    },

    {
        id: 'maracaibo',
        nom: 'Maracaibo',
        territoire: 'nouvelle-grenade',
        coords: [5932, 4020],

        contexte: `Maracaibo s'étend sur la rive occidentale du lac du même nom, accessible depuis la mer par un chenal étroit gardé par le <strong>Fort San Carlos de la Barra</strong>. Cette géographie en fait une position structurellement difficile à attaquer et facile à bloquer — Morgan l'a pourtant pillée deux fois (1666 et 1669), la seconde fois en brûlant la flotte espagnole qui lui barrait la retraite.

La ville vit du cacao de la région — l'un des meilleurs des Caraïbes — exporté en contrebande vers Curaçao et les Antilles hollandaises autant que légalement. Le gouverneur de Venezuela exerce une autorité nominale sur Maracaibo, mais l'éloignement lui confère une autonomie de fait considérable.`,

        population: `~5 000 habitants`,

        garnison: `Fort San Carlos de la Barra (entrée du lac) : ~80 soldats. Estimation par analogie avec les places secondaires vénézuéliennes.`,

        note_mj: `✅ Deux raids de Morgan (1666, 1669) — second raid avec destruction de la flotte espagnole : établi (Exquemelin).
✅ Fort San Carlos de la Barra : établi.
✅ Commerce interlope cacao → Curaçao : établi (carte-data.js, venezuela).
⚠️ Garnison : estimation.`,
    },

    {
        id: 'la-guaira',
        nom: 'La Guaira',
        territoire: 'venezuela',
        coords: [6501, 4065],

        contexte: `Unique débarcadère de Caracas sur la mer des Caraïbes, à quelques kilomètres de la capitale par un chemin de montagne raide. La Guaira est moins une ville qu'un entrepôt portuaire : tout ce qui entre ou sort du Venezuela passe par ses quais. Le cacao de Caracas, les manufactures européennes importées — tout transite ici. La douane de La Guaira est un point de friction permanent entre les marchands et l'administration coloniale.`,

        population: `~2 000 habitants permanents`,

        note_mj: `⚠️ La Guaira est peu documentée pour 1712 spécifiquement. Toutes les données sont des estimations.
Pas de fort notable en état de fonctionnement à cette date — la défense côtière est assurée par des batteries légères.`,
    },

    {
        id: 'pampatar',
        nom: 'Pampatar (Île Marguerita)',
        territoire: 'marguerita',
        coords: [6967, 3919],

        contexte: `Port principal de l'île Marguerita, sur la côte est. Le <strong>Castillo San Carlos Borromeo</strong> (1662–1684) est la seule fortification notable de l'île — construit après les pillages français du XVIIe siècle (1576, 1593, 1677). Fort et port sont sur le même site, gardant l'entrée de la baie de Pampatar. La capitale administrative officielle est La Asunción à l'intérieur, mais les gouverneurs préfèrent souvent résider à Pampatar.`,

        population: `~2 000 habitants à Pampatar ; ~8 000 sur l'ensemble de l'île`,

        garnison: `Castillo San Carlos Borromeo : ~60 à 80 soldats. Estimation par analogie avec les forts des provinces marginales vénézuéliennes.`,

        note_mj: `✅ Castillo San Carlos Borromeo, construit 1662–1684 après les pillages français : établi.
✅ Pillages français 1576, 1593, 1677 : établis.
⚠️ Garnison et population : estimations.`,
    },

    {
        id: 'cumana',
        nom: 'Cumaná',
        capitale: true,
        territoire: 'nouvelle-andalousie',
        coords: [6782, 4094],

        contexte: `L'une des plus vieilles villes permanentes des Amériques, fondée en 1515 sur la côte nord-est du Venezuela actuel. Point de départ traditionnel des expéditions vers l'Orénoque et les Llanos, Cumaná est aussi le chef-lieu d'une province dont l'économie repose sur le cacao, la pêche et une contrebande structurelle avec les Hollandais du Surinam et les Français de la Martinique. Le <strong>Castillo San Antonio de la Eminencia</strong> domine la ville depuis une colline — fort en étoile commandant le port et ses approches.`,

        population: `~8 000 habitants dans la ville ; ~53 000 dans toute la province`,

        garnison: `Castillo San Antonio de la Eminencia : ~100 à 120 soldats. Estimation d'après le rang de Cumaná comme chef-lieu de province.`,

        note_mj: `✅ Fondation 1515 : établi.
✅ Castillo San Antonio de la Eminencia : établi — fort en étoile sur promontoire.
⚠️ Garnison : estimation.
Trinidad dépend nominalement de la province de Cumaná jusqu'en 1731.`,
    },

    {
        id: 'puerto-espana',
        nom: 'Puerto España (Port of Spain)',
        territoire: 'trinidad',
        coords: [7438, 4007],

        contexte: `La capitale officielle de Trinidad est San José de Oruña (Saint Joseph), mais les gouverneurs résident en pratique à Puerto España, mieux située pour surveiller le trafic maritime du golfe de Paria. Puerto España est un bourg de quelques centaines de maisons sans défense organisée, dont la principale activité est un commerce de contrebande avec les Hollandais, les Français et les Anglais des îles voisines. Le cacao de Trinidad sort la nuit dans les criques du nord-ouest ; les manufactures européennes entrent de la même façon.`,

        population: `~800 à 1 000 habitants`,

        note_mj: `✅ Préférence des gouverneurs pour Puerto España sur San José de Oruña : carte-data.js (trinidad).
⚠️ Population : estimation.
Pas de fort à Puerto España en 1712 — la défense de Trinidad est quasi inexistante.`,
    },

    // ══════════════════════════════════════════════════════════
    // SÉRIE 3 — Antilles françaises, hollandaises, danoises
    //           + forts isolés
    // ══════════════════════════════════════════════════════════

    {
        id: 'fort-royal-martinique',
        nom: 'Fort-Royal (Martinique)',
        capitale: true,
        territoire: 'martinique',
        coords: [7400, 3318],

        contexte: `Capitale administrative des Îles du Vent françaises et résidence du gouverneur général. Fort-Royal tient son nom du <strong>Fort Saint-Louis</strong> qui en est l'origine et le cœur — une position sur une presqu'île commandant la grande baie de Fort-Royal, l'un des meilleurs mouillages naturels des Petites Antilles. La ville est militaire et administrative plutôt que marchande — le vrai pouls commercial de la Martinique bat à Saint-Pierre, au nord-ouest.

Le Gaoulé de mai 1717 — soulèvement des grands planteurs contre l'intendant Ricouart et le gouverneur La Varenne — déferle sur Fort-Royal : gouverneur et intendant sont arrêtés dans la ville même et renvoyés de force vers la France.`,

        population: `~4 000 habitants à Fort-Royal ; ~29 000 sur l'ensemble de l'île (dont ~20 000 esclaves)`,

        garnison: `Fort Saint-Louis : ~250 soldats d'infanterie régulière, plus les artilleurs. Estimation d'après Butel, Histoire des Antilles françaises (2002).`,

        note_mj: `✅ Gaoulé du 23 mai 1717, arrestation de La Varenne et Ricouart : établi (Wikipedia FR ; ANOM).
✅ Fort Saint-Louis comme fondement de la ville : établi.
✅ Mort du gouverneur particulier Montigny, tué par Bartholomew Roberts, octobre 1720 : Johnson, General History (1724).
⚠️ Garnison : Butel (2002) — effectifs précis par fort non établis.`,
    },

    {
        id: 'saint-pierre',
        nom: 'Saint-Pierre (Martinique)',
        territoire: 'martinique',
        coords: [7376, 3296],

        contexte: `Premier port commercial de la Martinique et ville la plus peuplée de l'île — en tout point l'opposé de Fort-Royal. Saint-Pierre s'étend en croissant au pied de la Montagne Pelée sur la côte nord-ouest, face à une rade ouverte mais fréquentée en permanence. Les comptoirs des négociants bordelais et nantais s'alignent sur le front de mer ; les navires négriers y débarquent leur cargaison ; les rhums et les sucres partent pour la France.

Le commerce interlope avec les Hollandais de Curaçao et de Saint-Eustache est structurel — Saint-Pierre est l'endroit où l'on peut acheter ce que le monopole colonial interdit d'importer officiellement. Tout capitaine avec une cargaison d'origine incertaine y trouvera preneur. C'est depuis Saint-Pierre que le Gaoulé de 1717 s'organise.`,

        population: `~8 000 habitants (dont ~5 000 esclaves) — la ville la plus peuplée des Petites Antilles françaises`,

        note_mj: `✅ Saint-Pierre comme capitale marchande, comptoirs bordelais : Butel (2002) ; Debien (1974).
✅ Rôle dans le Gaoulé 1717 : ANOM ; Wikipedia FR.
Saint-Pierre sera détruite le 8 mai 1902 par l'éruption de la Montagne Pelée — en 1712 le volcan est au repos, mais les tremblements de terre sont réguliers et la population en a conscience.
Pas de fort propre — des batteries côtières légères.`,
    },

    {
        id: 'basse-terre-guadeloupe',
        nom: 'Basse-Terre (Guadeloupe)',
        capitale: true,
        territoire: 'guadeloupe',
        coords: [7295, 3108],

        contexte: `Capitale administrative de la Guadeloupe, sur la côte sous le vent de la partie volcanique de l'île. Le <strong>Fort Saint-Charles</strong> domine la ville et le mouillage. Centre gouvernemental et militaire, Basse-Terre est moins active commercialement que Pointe-à-Pitre sur Grande-Terre — mais c'est là que réside le gouverneur particulier de Guadeloupe, sous l'autorité du gouverneur général des Îles du Vent à Fort-Royal.`,

        population: `~3 000 habitants à Basse-Terre ; ~25 000 sur l'ensemble de l'île (dont ~18 000 esclaves)`,

        garnison: `Fort Saint-Charles : ~150 soldats. Estimation par analogie avec Fort-Royal, compte tenu du rang secondaire de Basse-Terre dans la hiérarchie des Îles du Vent.`,

        note_mj: `✅ Basse-Terre comme capitale administrative, Fort Saint-Charles : établi.
⚠️ Garnison : estimation.`,
    },

    {
        id: 'saint-georges-grenade',
        nom: "Saint-George's (Grenade)",
        capitale: true,
        territoire: 'grenade',
        coords: [7326, 3797],

        contexte: `Capitale et unique port notable de la Grenade française. Saint-George's est bâtie autour d'une rade en fer à cheval, l'une des plus belles des Petites Antilles. La ville exporte sucre, cacao, indigo et les premières muscades qui feront la réputation de l'île. Point de passage entre les Antilles françaises du nord et Trinidad espagnole au sud, Saint-George's est aussi une escale pour le commerce interlope avec le Venezuela. L'éloignement de Fort-Royal lui confère une autonomie de fait que les gouverneurs successifs gèrent avec pragmatisme.`,

        population: `~2 500 habitants ; ~15 000 sur l'ensemble de l'île (dont ~10 000 esclaves)`,

        note_mj: `✅ Rôle commercial — cacao, sucre, muscade naissante : carte-data.js (grenade).
Pas de fort majeur en 1712 — des batteries côtières légères.`,
    },

    {
        id: 'basseterre',
        nom: 'Basseterre (Saint-Kitts)',
        territoire: 'saint-christophe',
        coords: [7095, 2880],

        contexte: `Capitale de Saint-Kitts depuis le début de la colonisation anglaise (1623). Basseterre s'étend dans une plaine basse ouverte sur la côte sous le vent — position commode pour le commerce mais sans défense naturelle. La défense de l'île repose sur Brimstone Hill, à une dizaine de kilomètres au nord-ouest. Depuis le traité d'Utrecht (1713), la partie française de l'île a été cédée à la Grande-Bretagne — ses anciennes habitations sont rachetées à bas prix par les planteurs anglais, alimentant une spéculation foncière intense.`,

        population: `~5 000 habitants à Basseterre ; ~20 000 sur l'ensemble de l'île (dont ~15 000 esclaves)`,

        note_mj: `✅ Cession de la partie française par Utrecht 1713 : établi.
✅ Spéculation foncière post-Utrecht : Wikipedia EN (Saint Kitts).
La défense de l'île est assurée depuis Brimstone Hill — voir entrée dédiée.`,
    },

    {
        id: 'brimstone-hill',
        nom: 'Fort Brimstone Hill (Saint-Kitts)',
        capitale: true,
        territoire: 'saint-christophe',
        coords: [7078, 2870],

        contexte: `"Le Gibraltar des Antilles" — surnom mérité pour un fort établi au sommet d'un promontoire volcanique de 240 mètres dominant toute la côte nord-ouest de Saint-Kitts. La position est naturellement imprenable par voie terrestre : les pentes sont raides, le sommet étroit, et la vue dégagée sur mer permet de signaler tout navire approchant avec plusieurs heures d'avance. Les Anglais y ont établi leurs premières batteries dans les années 1690, après le raid français sur l'île.

En 1712, Brimstone Hill est encore en construction dans sa forme définitive — les travaux s'étalent sur tout le XVIIIe siècle — mais les bastions principaux et l'artillerie sont en place. C'est la clé de la défense des Leeward Islands britanniques dans les Petites Antilles.`,

        population: `Garnison uniquement`,

        garnison: `~200 soldats d'infanterie et artilleurs en 1712, effectif en croissance progressive au fil des travaux. Estimation d'après Hartog, History of St. Eustatius, et les archives de Brimstone Hill (St. Kitts National Archives).`,

        note_mj: `✅ Position sur promontoire volcanique à 240 m : établi.
✅ Construction progressive depuis les années 1690 jusqu'à la fin du XVIIIe : établi — aujourd'hui classé à l'UNESCO.
⚠️ Garnison précise en 1712 : effectif exact non vérifié sur source primaire.
🎲 Brimstone Hill est visible depuis la mer à grande distance — point de repère incontournable pour tout navigateur longeant la côte nord de Saint-Kitts.`,
    },

    {
        id: 'saint-johns-antigua',
        nom: "Saint-John's (Antigua)",
        capitale: true,
        territoire: 'leeward-islands',
        coords: [7289, 2923],

        contexte: `Capitale administrative des Leeward Islands et résidence du gouverneur général. Saint-John's est une ville de fonctionnaires et de planteurs — moins active comme port que English Harbour. C'est ici que siège le Conseil et que se règlent les affaires politiques de l'archipel ; c'est ici aussi que Daniel Parke fut lynché en décembre 1710 et que son successeur Douglas monnaya le pardon royal des assassins.`,

        population: `~3 000 habitants`,

        note_mj: `✅ Assassinat de Parke, décembre 1710 : Calendar of State Papers ; Encyclopedia Virginia.
✅ Extorsion de Douglas — 10 000 livres pour publier la grâce royale : Wikipedia EN (Walter Douglas).`,
    },

    {
        id: 'english-harbour',
        nom: 'English Harbour (Antigua)',
        territoire: 'leeward-islands',
        coords: [7298, 2934],

        contexte: `Base navale de la Royal Navy dans les Petites Antilles, à une vingtaine de kilomètres au sud-est de Saint-John's. English Harbour est un port naturel exceptionnel — une rade quasi-fermée par deux promontoires, abritée des ouragans, avec un fond suffisant pour recevoir les frégates. Le carénage y est possible à l'abri des regards et des vents : les navires sont basculés sur le côté pour gratter et goudronner leurs coques, opération impossible en pleine mer.

En 1712, les installations permanentes sont encore modestes — les grands arsenaux et corderies de la Nelson's Dockyard seront construits plus tard dans le siècle. Mais la rade est déjà utilisée régulièrement par les frégates de la Jamaica Station et des Leeward Islands. Pour un navire qui veut savoir où se trouve la Royal Navy dans les Petites Antilles, English Harbour est la première réponse.`,

        population: `Quelques centaines — personnel naval, artisans, esclaves employés aux chantiers`,

        garnison: `Batteries côtières aux deux pointes de l'entrée : ~60 à 80 soldats et artilleurs. Aucun fort majeur en 1712 — les défenses seront renforcées progressivement au cours du siècle.`,

        note_mj: `✅ Qualités nautiques d'English Harbour (rade fermée, carénage possible) : établi.
✅ Nelson's Dockyard — installations permanentes majeures construites à partir des années 1740–1780 : établi. En 1712, les infrastructures sont rudimentaires.
⚠️ Garnison et installations précises en 1712 : peu documentés.`,
    },

    {
        id: 'charlotte-amalie',
        nom: 'Charlotte Amalie (Saint-Thomas)',
        capitale: true,
        territoire: 'saint-thomas',
        coords: [6807, 2732],

        contexte: `Port franc danois — la ville où l'on peut tout vendre et tout acheter sans trop de questions. Charlotte Amalie s'organise autour d'une baie profonde et abritée, dominée par le <strong>Fort Christian</strong> (1672) sur son promontoire rouge. La Compagnie des Indes occidentales danoise administre formellement l'île, mais son contrôle est nominal : l'économie du port franc repose précisément sur l'absence de contrôle rigoureux.

La population est délibérément cosmopolite — Danois, Hollandais, Anglais, Juifs séfarades coexistent sans que nul ne pose de questions sur les origines. Les esclaves africains représentent les cinq sixièmes de la population totale, transitant vers les colonies espagnoles ou employés dans les plantations. En 1712, la pression britannique commence à peser sur les Danois, mais l'économie fondamentale du port franc reste intacte.`,

        population: `~3 600 habitants (dont ~3 000 esclaves)`,

        garnison: `Fort Christian : ~80 soldats danois. Petite garnison pour une île dont la survie repose sur la neutralité commerciale plutôt que sur la force militaire. Estimation d'après Westergaard, The Danish West Indies under Company Rule (1917).`,

        note_mj: `✅ Fort Christian (1672) : établi.
✅ Population cosmopolite, commerce sans questions, communauté juive séfarade : Westergaard (1917) ; Wikipedia EN (Danish West Indies).
✅ Colonisation de Saint-John par Bredal en 1718, tension avec Hamilton des Leeward Islands : St. John Historical Society.
⚠️ Garnison : Westergaard — effectif précis en 1712 non établi.`,
    },

    {
        id: 'willemstad',
        nom: 'Willemstad (Curaçao)',
        capitale: true,
        territoire: 'curaçao',
        coords: [6189, 3787],

        contexte: `Plaque tournante du commerce hollandais dans les Caraïbes — un entrepôt neutre où transitent marchandises européennes, esclaves africains et produits coloniaux de toutes provenances. Willemstad s'organise autour de la baie de Sint Anna : le quartier de Punda abrite les entrepôts et les comptoirs des marchands ; le <strong>Fort Amsterdam</strong> (1635) domine l'entrée du chenal depuis la pointe ouest.

Tout navire avec quelque chose à vendre ou à acheter sans questions trouve ici un interlocuteur. Le cacao de Caracas arrive à Willemstad illégalement et repart légalement ; les manufactures européennes font le chemin inverse. En février 1713, des forces françaises occupent brièvement l'île — épisode humiliant pour la WIC, réglé par la paix d'Utrecht sans indemnité`,

        population: `~8 000 habitants (dont ~5 000 à 6 000 esclaves)`,

        garnison: `Fort Amsterdam : ~120 soldats hollandais. Estimation d'après Klooster, Illicit Riches (1998).`,

        note_mj: `✅ Occupation française de février 1713 : WorldStatesmen.org ; Klooster (1998).
✅ Commerce interlope cacao vénézuélien → Willemstad : Klooster (1998).
✅ Fort Amsterdam (1635) : établi.
⚠️ Garnison : Klooster donne des données économiques — effectif estimé par analogie.`,
    },

    {
        id: 'paramaribo',
        nom: 'Paramaribo (Suriname)',
        capitale: true,
        territoire: 'suriname',
        coords: [8269, 4634],

        contexte: `Capitale de la colonie hollandaise du Suriname, sur la rive droite du fleuve Suriname. Paramaribo est un hub commercial prospère — ses plantations de sucre, de cacao et de café, exploitées par une main-d'œuvre servile massive, en font l'une des colonies les plus productives des Caraïbes. Le <strong>Fort Zeelandia</strong> (1667) occupe la pointe nord de la ville.

La guerre des Marrons est la réalité permanente de la colonie : des milliers d'esclaves africains fuient les plantations pour la forêt intérieure, où ils forment des communautés autonomes résistant efficacement aux expéditions militaires hollandaises depuis les années 1690. Cette guerre absorbe des ressources considérables et inquiète toutes les colonies à main-d'œuvre servile des Caraïbes.`,

        population: `~45 000 dans l'ensemble de la colonie (dont ~40 000 esclaves) ; Paramaribo : ~5 000 à 8 000`,

        garnison: `Fort Zeelandia : ~150 soldats hollandais. Les expéditions contre les Marrons mobilisent des effectifs supplémentaires variables. Estimation d'après Price, Maroon Societies (1973).`,

        note_mj: `✅ Fort Zeelandia (1667) : établi.
✅ Guerre des Marrons depuis les années 1690 : Price (1973).
✅ Gestion tripartite Société du Surinam depuis 1683 : établi.
⚠️ Garnison : Price donne des données sur les expéditions militaires plutôt que sur la garnison fixe.
Note toponymique : "Paragotos" sur la carte Jaillot désigne probablement le même site que "Suriname" — deux sources compilées sans recoupement par le cartographe.`,
    },

    {
        id: 'bridgetown',
        nom: 'Bridgetown (Barbade)',
        capitale: true,
        territoire: 'barbade',
        coords: [7603, 3566],

        contexte: `Capitale et port principal de la Barbade — la plus ancienne et la plus prospère des colonies britanniques des Caraïbes. Bridgetown concentre les entrepôts des planteurs, les comptoirs des négociants de Londres et Bristol, les tavernes des équipages en escale. Le trafic négrier y est intense : la Barbade redistribue les esclaves africains vers les autres îles britanniques. Le sucre barbadien, produit par acre en quantité supérieure à toute autre île, part de ses quais vers l'Angleterre.

Le <strong>Fort Charles</strong> (position de Needham's Point) commande l'entrée de la baie depuis la pointe méridionale.`,

        population: `~50 000 habitants (dont ~42 000 esclaves) — la colonie la plus peuplée des Antilles britanniques`,

        garnison: `Fort Charles / Needham's Point : ~150 soldats d'infanterie régulière. Estimation par analogie avec les garnisons britanniques aux Antilles pour une île de ce rang.`,

        note_mj: `✅ Barbade comme île la plus productive et la plus peuplée des Antilles britanniques : Dunn, Sugar and Slaves (1972).
✅ Gouverneur Lowther — double mandat, extorsion, rétention de navires de guerre : Wikipedia EN ; History of Parliament Online.
⚠️ Garnison : estimation.`,
    },

    {
        id: 'merida',
        nom: 'Mérida (Yucatán)',
        capitale: true,
        territoire: 'yucatan',
        coords: [2665, 2456],

        contexte: `Capitale de la capitainerie générale du Yucatán, à l'intérieur de la péninsule, loin de la côte Caraïbe. Ville administrative et épiscopale fondée en 1542 sur les ruines de la cité maya de T'ho. Mérida n'est pas un port — son accès à la mer passe par Campeche, à une centaine de kilomètres à l'ouest. Son intérêt pour la campagne est essentiellement politique : c'est depuis Mérida que le gouverneur-capitaine général administre le Yucatán, une capitainerie distincte de la vice-royauté de Mexico.`,

        population: `~8 000 habitants (dont ~6 000 Mayas)`,

        note_mj: `Mérida n'a pas de fort militaire notable — la défense du Yucatán côté Caraïbe repose sur l'enceinte de Campeche. Entrée présente pour compléter la carte administrative ; faible intérêt narratif direct pour la campagne.`,
    },

];
