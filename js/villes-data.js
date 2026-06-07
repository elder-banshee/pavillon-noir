// ═══════════════════════════════════════════════════════════
// VILLES & LIEUX NOTABLES — Pavillon Noir
// Coordonnées pixel : référentiel image 8500 × 5320 px
// (même référentiel que carte-data.js)
// Nassau et Carthagène documentées dans carte-data.js.
// ═══════════════════════════════════════════════════════════

const VILLES = [

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

// ═══════════════════════════════════════════════════════════
// SÉRIE CAROLINE DU SUD
// ═══════════════════════════════════════════════════════════

// ── CHARLES TOWN ─────────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════
// SÉRIE FLORIDE
// ═══════════════════════════════════════════════════════════

// ── SAN AGUSTÍN ─────────────────────────────────────────────────────────────

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

// ── PENSACOLA ─────────────────────────────────────────────────────────────

    {
        id: 'pensacola',
        nom: 'Pensacola',
        type: 'fort',
        rang: '1',
        territoire: 'floride',
        coords: [1718, 864],
        // ⚠️ Absent de la carte Jaillot 1708 — coordonnées à placer manuellement.
        // À l'embouchure du río Escambia (probable "R. Snelo" sur la Jaillot),
        // entre les fleuves Perdido, Escambia et Blackwater, côte nord du Golfe.

        contexte: [
            {
                de: 1712, a: 1719,
                texte: `Presidio espagnol fondé en 1698 sur la baie du même nom, pour contrer l'expansion française depuis Mobile — les deux établissements ne sont séparés que d'une centaine de kilomètres de côte marécageuse. Pensacola est moins une ville qu'un fort avec quelques maisons autour : une garnison, une petite chapelle, des entrepôts rudimentaires. Sa valeur est entièrement stratégique : tenir la côte entre la Floride et la Louisiane, affirmer la présence espagnole face aux Français.`,
            },
            {
                de: 1719,
                texte: `Presidio espagnol fondé en 1698, pris par Bienville en mai 1719 avec une force navale française — épisode lié à la guerre de la Quadruple-Alliance (1718–1720). La ville est rendue, reprise, rendue à nouveau au fil des négociations diplomatiques. Ces allers-retours illustrent la fragilité de tout établissement sur cette côte contestée.`,
            },
        ],

        population: `~500 habitants (garnison et civils)`,

        garnison: `Fort San Carlos de Austria (ou Fort San Carlos de Pensacola) : ~200 soldats. Estimation d'après Boyd, <em>History of Pensacola</em> (1929) et Coker & Watson, <em>Indian Traders of the Southeastern Spanish Borderlands</em> (1986).`,

        note_mj: `✅ Fondation 1698, objectif stratégique anti-français : établi (Boyd, 1929).
✅ Prise par Bienville en mai 1719, puis rendue, puis reprise — guerre de la Quadruple-Alliance (1718–1720) : établi (Wikipedia EN, Pensacola).
⚠️ Population et garnison : estimations — sources précises pour 1712–1718 fragmentaires.
⚠️ Identification du "R. Snelo" de la Jaillot avec l'Escambia : hypothèse plausible géographiquement, non confirmée par source cartographique directe.
Absent de la carte Jaillot 1708 — l'établissement existait mais n'a pas été intégré par le cartographe.`,
    },

// ═══════════════════════════════════════════════════════════
// SÉRIE LOUISIANE  
// ═══════════════════════════════════════════════════════════

// ── MOBILE ─────────────────────────────────────────────────────────────

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

// ── NOUVELLE-ORLÉANS ─────────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════
// SÉRIE PANUCO
// ═══════════════════════════════════════════════════════════

// ── TAMPICO ─────────────────────────────────────────────────────────────

    {
        id: 'tampico',
        nom: 'Tampico',
        type: 'port',
        rang: '2',
        territoire: 'panuco',
        coords: [1153, 2032],

        contexte: [
            { de: 1712, texte: `Port modeste à l'embouchure du río Pánuco sur le Golfe du Mexique — seul débouché maritime entre Veracruz au sud et la Floride au nord. Saccagé par les pirates en 1684, le traumatisme reste présent dans les mémoires locales. Le commerce interlope avec des navires anglais de la Nouvelle-Angleterre est une réalité tolérée faute de moyens de surveillance. Aucun fort permanent en état.` },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Saccage par les pirates en 1684 : sources locales concordantes (Herrera Casasús, UAT, 1988).
⚠️ Population : estimation.`,
    },

// ═══════════════════════════════════════════════════════════
// SÉRIE NOUVELLE-ESPAGNE
// ═══════════════════════════════════════════════════════════

// ── MEXICO ─────────────────────────────────────────────────────────────────

    {
        id: 'mexico',
        nom: 'Mexico (Ciudad de México)',
        label: 'Mexico',
        capitale: true,
        type: 'ville',
        rang: '1',
        territoire: 'nouvelle-espagne',
        coords: [677, 2152],

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la vice-royauté de Nouvelle-Espagne et première ville du continent américain — son seul rival en population est Lima, sur le Pacifique. Mexico est bâtie sur les ruines de Tenochtitlán, l'ancienne capitale aztèque détruite par Cortés en 1521, au centre d'un système de lacs aujourd'hui partiellement asséché par deux siècles de travaux. Le Palais des vice-rois occupe l'emplacement du palais de Moctezuma ; la cathédrale métropolitaine, en construction depuis 1573, domine la Plaza Mayor.
<br><br>
C'est ici que convergent toutes les décisions administratives, judiciaires et fiscales de la Nouvelle-Espagne : la <strong>Real Audiencia</strong> y siège, le vice-roi y réside, les grandes familles créoles y font valoir leurs intérêts. L'argent extrait des mines de Zacatecas et Guanajuato transite par Mexico avant de descendre vers Veracruz et les flottes du roi. La ville est aussi un centre intellectuel : l'université — fondée en 1551, la première du continent — forme les lettrés et les clercs de tout le vice-royauté.
<br><br>
Loin des côtes, Mexico n'est pas une cible pirate directe. Mais tout ce qui arrive ou repart des Caraïbes passe par ses douanes, ses négociants, ses caisses royales.`,
            },
        ],

        population: `~100 000 habitants — la plus grande ville des Amériques`,

        note_mj: `✅ Mexico comme capitale vice-royale et première ville d'Amérique : établi.
✅ Cathédrale en construction depuis 1573, achevée en 1813 : établi.
✅ Universidad Real y Pontificia de México, fondée 1551 : établi.
✅ Vice-rois de la période : Linares (1711–1716), Valero (1716–1722), Casafuerte (1722–1734) — voir carte-data.js (nouvelle-espagne).
⚠️ Population ~100 000 : estimation couramment citée pour le début du XVIIIe siècle — recensements précis postérieurs.`,
    },

// ── PUEBLA ─────────────────────────────────────────────────────────────────

    {
        id: 'los-angeles',
        nom: 'Puebla de los Ángeles',
        label: 'Puebla',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [790, 2342],

        contexte: [
            {
                de: 1712,
                texte: `Deuxième ville de la Nouvelle-Espagne, fondée en 1531 dans une vallée fertile entre Mexico et Veracruz. Puebla occupe une position charnière : toute marchandise montant de la côte vers la capitale, et tout convoi d'argent descendant vers les flottes, passe par ici. La ville est un centre manufacturier actif — ses ateliers produisent textiles de laine et céramiques de faïence (la <em>talavera poblana</em>), exportées dans tout le vice-royauté. L'évêché de Puebla est l'un des plus riches et des plus influents de la Nouvelle-Espagne, parfois en tension ouverte avec le vice-roi de Mexico.`,
            },
        ],

        population: `~50 000 habitants`,

        note_mj: `✅ Fondation 1531, position sur la route Mexico–Veracruz : établi.
✅ Talavera poblana et manufactures textiles : établi.
⚠️ Population : estimation courante pour le début du XVIIIe siècle.`,
    },

// ── JALAPA ────────────────────────────────────────────────────────────────

    {
        id: 'xalapa',
        nom: 'Jalapa (Xalapa)',
        label: 'Jalapa',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [975, 2531],

        contexte: [
            {
                de: 1712,
                texte: `Ville de montagne sur les contreforts de la Sierra Madre orientale, à mi-chemin entre Veracruz et Puebla. Jalapa doit sa notoriété commerciale à la <strong>Feria de Jalapa</strong> : lorsqu'une flotte espagnole arrive à Veracruz, les marchands de l'intérieur descendent à Jalapa pour y traiter avec les agents des négociants de Cadix, à l'abri de la fièvre jaune qui décime les Européens dans la chaleur côtière. La foire ne dure que quelques semaines mais brasse des millions de pesos — c'est ici que se fixent les prix de gros pour l'ensemble du marché intérieur. Entre les flottes, Jalapa retrouve sa tranquillité provinciale.`,
            },
        ],

        population: `~8 000 habitants`,

        note_mj: `✅ Feria de Jalapa, mécanisme de distribution des marchandises des flottes : établi (Walker, <em>Spanish Politics and Imperial Trade</em>, 1979).
✅ Choix de Jalapa pour éviter la fièvre jaune de Veracruz : attesté dans les sources marchandes de l'époque.
⚠️ Population : estimation.`,
    },

// ── OAXACA / ANTEQUERA ──────────────────────────────────────────────────── !!!

    {
        id: 'antequera',
        nom: 'Antequera (Oaxaca)',
        label: 'Antequera',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [1233,2795],

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province de Oaxaca, connue à l'époque coloniale sous son nom espagnol d'Antequera. La ville est le centre administratif et épiscopal d'une province dont la richesse repose sur un produit unique : la <strong>cochenille</strong> (<em>Dactylopius coccus</em>), insecte parasite du nopal élevé par les communautés indiennes zapotèques et mixtèques. Son corps séché produit le carmin — le rouge le plus intense et le plus stable disponible en Europe, utilisé pour teindre les draps de laine des manufactures anglaises, hollandaises et françaises. La cochenille d'Oaxaca est, avec l'argent, l'une des exportations les plus précieuses de la Nouvelle-Espagne.
<br><br>
La province est administrée par des <em>alcaldes mayores</em> qui contrôlent le commerce de la cochenille via le système du <em>repartimiento</em> : ils avancent des fournitures aux villages indiens en échange de leur production à prix fixé, maintenant les communautés dans une dépendance structurelle. Les Dominicains, implantés depuis le XVIe siècle, gèrent les missions et les couvents de l'arrière-pays.`,
            },
        ],

        population: `~20 000 habitants dans la ville et ses environs immédiats`,

        note_mj: `✅ Cochenille d'Oaxaca comme exportation majeure, repartimiento : établi (Hamnett, <em>Politics and Trade in Southern Mexico</em>, 1971).
✅ Dominicains en Oaxaca depuis le XVIe siècle : établi.
⚠️ Population : estimation.`,
    },


// ── ACAPULCO ──────────────────────────────────────────────────────────────

    {
        id: 'acapulco',
        nom: 'Acapulco',
        type: 'port',
        rang: '1',
        territoire: 'nouvelle-espagne',
        coords: [930, 3027 ],

        contexte: [
            {
                de: 1712,
                texte: `Le seul grand port pacifique de la Nouvelle-Espagne — et la tête de l'une des routes commerciales les plus extraordinaires du monde. Chaque année, le <strong>Galion de Manille</strong> (la <em>Nao de China</em>) relie Acapulco aux Philippines en une traversée de deux à trois mois : il emporte l'argent mexicain vers Manille, et revient chargé de soie de Chine, d'épices des Moluques, de porcelaines, de coton indien. Ces marchandises remontent ensuite vers Mexico avant de rejoindre, pour certaines, Veracruz et l'Atlantique.
<br><br>
La ville elle-même est modeste — une rade exceptionnelle dans un climat meurtrier. La fièvre décime régulièrement les équipages et les résidents fraîchement arrivés. En dehors des semaines d'arrivée et de départ du galion, Acapulco retourne à sa torpeur tropicale. Le <strong>Fort San Diego</strong>, présent sous une forme antérieure dès 1617, commande la baie depuis un promontoire.`,
            },
        ],

        population: `~4 000 habitants permanents ; plusieurs milliers lors des escales du galion`,

        garnison: `Fort San Diego : ~100 soldats. Estimation d'après le rang et l'importance du site.`,

        note_mj: `✅ Galion de Manille (Nao de China), route annuelle Acapulco–Philippines : établi.
✅ Fort San Diego : présent dès 1617 sous une forme initiale — la structure actuelle date de 1776 (reconstruction après séisme). Caractéristiques précises en 1712 incertaines.
⚠️ Population et garnison : estimations.
Le Galion de Manille est hors de portée des pirates des Caraïbes — mais son calendrier structure les flux commerciaux qui transitent ensuite par Veracruz.`,
    },

// ── LA ANTIGUA (VILLA RICA) ───────────────────────────────────────────────

    {
        id: 'antigua-veracruz',
        nom: 'La Antigua (Villa Rica de la Vera Cruz)',
        label: 'La Antigua',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [1166, 2436],

        contexte: [
            {
                de: 1712,
                texte: `Premier établissement permanent fondé par Hernán Cortés en 1519 sur la côte du Golfe — la <em>Villa Rica de la Vera Cruz</em> originelle, avant que la ville ne soit déplacée vers son emplacement définitif plus au sud. En 1712, La Antigua est un bourg résiduel de quelques centaines d'habitants, conservant la <strong>Casa de Cortés</strong> — une construction du XVIe siècle que la tradition locale attribue au conquistador — et une église coloniale ancienne. Le site n'a plus aucune fonction commerciale ou militaire : Veracruz a tout absorbé. Il subsiste comme lieu de mémoire et comme bourg agricole sur la rive du río Huitzilapan.`,
            },
        ],

        population: `~500 habitants`,

        note_mj: `✅ Fondation par Cortés en 1519, premier établissement permanent de la côte : établi.
✅ Casa de Cortés : bâtiment du XVIe siècle encore debout, attribution précise incertaine mais ancienneté établie.
⚠️ Population en 1712 : estimation.
Intérêt de jeu : lieu symbolique — un PJ cultivé qui aborde à La Antigua sait qu'il foule le premier sol espagnol de la Nouvelle-Espagne.`,
    },

// ── VILLAHERMOSA ──────────────────────────────────────────────────────────

    {
        id: 'villahermosa',
        nom: 'Villahermosa (Villa del Espíritu Santo)',
        label: 'Espíritu Santo',
        capitale: true,
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [1660, 2858],
        // ⚠️ Apparaît sur la Jaillot sous le nom "Spirito Sancto" dans la province de Tabasco.

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province de Tabasco, accessible depuis le Golfe du Mexique via le río Grijalva — une navigation fluviale d'une centaine de kilomètres depuis la côte, ce qui lui confère une protection naturelle tout en la gardant ouverte au commerce. Le Tabasco exporte cacao, bois de teinture et roucou (<em>achiote</em>). Ces richesses en ont fait une cible des flibustiers du XVIIe siècle : la ville a été saccagée à plusieurs reprises par des corsaires anglais et hollandais depuis la Jamaïque. La mémoire de ces raids est vive — et la méfiance envers tout navire étranger remontant le Grijalva, structurelle.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Accessible par le río Grijalva : établi.
✅ Raids flibustiers sur le Tabasco au XVIIe siècle : établis (sources locales concordantes).
✅ Productions : cacao, bois de teinture, achiote : établi.
⚠️ Population en 1712 : estimation.
⚠️ Gouverneur précis du Tabasco en 1712 : non identifié depuis les sources accessibles.`,
    },

// ── TEHUACÁN ─────────────────────────────────────────────────────────

    {
        id: 'guaxaca',
        nom: 'Tehuacán (Santa María de la Concepción Tehuacán)',
        label: 'Tehuacan',
        type: 'ville',
        territoire: 'nouvelle-espagne',
        coords: [1155, 2738],
        // ⚠️ "Guaxaca" sur la Jaillot — la Jaillot utilise le nom de la province
        // (Guaxaca/Oaxaca) pour désigner Tehuacán, ville majeure du bassin supérieur
        // du río Papaloapan ("R. de Medelin" sur la Jaillot, nommé d'après Medellín
        // de Bravo à son embouchure). Oaxaca de Juárez elle-même apparaît sous le
        // nom "Antequera" (son nom officiel espagnol) plus à l'est-sud-est.
        // "Capotitlan" sur la Jaillot désigne un village nahuatl mineur distinct.

        contexte: [
            {
                de: 1712,
                texte: `Ville des hautes terres entre Puebla et Oaxaca, sur la route commerciale qui relie les deux provinces. Tehuacán possède en 1712 un statut unique dans toute la Nouvelle-Espagne : celui de <strong>Ciudad de Indios</strong> — titre acheté à la Couronne espagnole le 16 mars 1660, au terme d'une enchère où les caciques indigènes ont surenchéri sur les colons espagnols qui convoitaient le même statut. Ce choix délibéré — préférer la "Ciudad de Indios" à la "Villa de Españoles" — a préservé des privilèges exceptionnels : les autorités municipales sont nommées parmi les naturels et caciques indigènes ; les Espagnols ne peuvent légalement s'installer dans la ville sans permission ; la communauté dispose de son propre blason royal et de procurateurs à Mexico pour défendre ses droits.
<br><br>
Ces privilèges sont l'objet d'un conflit permanent avec les hacendados espagnols et les autorités coloniales qui cherchent à les rogner — et la Couronne, pragmatiquement, maintient l'élite indienne dans ses droits pour préserver la stabilité de la province. La vallée de Tehuacán est aussi un centre de production de <strong>sel</strong> (salines de Zapotitlán) et un nœud de la route commerciale entre Puebla, Oaxaca et Veracruz. Ses eaux thermales sont réputées dans toute la Nouvelle-Espagne.`,
            },
        ],

        population: `~15 000 habitants dans la ville et sa juridiction`,

        note_mj: `✅ Titre de "Ciudad de Indios" acheté le 16 mars 1660 — les indigènes ont surenchéri sur les Espagnols : établi (Wikipedia ES, Tehuacán ; Arango Puerta, <em>Anuario de Historia Regional y de las Fronteras</em>, 2023).
✅ Privilèges : autorités indigènes, exclusion des Espagnols de la cabecera, blason royal, accès à la justice royale : établi (ibid.).
✅ Conflit permanent avec les hacendados espagnols sur ces privilèges, 1660–1808 : établi.
✅ Salines de Zapotitlán dans la juridiction de Tehuacán : établi.
✅ Tehuacán dans le bassin supérieur du río Papaloapan (R. de Medelin sur la Jaillot) : cohérent géographiquement.
⚠️ Identification "Guaxaca" (Jaillot) = Tehuacán : la Jaillot utilise le nom de la province oaxacane pour désigner cette ville du bassin du Papaloapan. Oaxaca de Juárez apparaît sous son nom officiel "Antequera" plus à l'est-sud-est. "Capotitlan" sur la Jaillot désigne un village mineur distinct, non identifié.
⚠️ Population en 1712 : estimation — Wikipedia ES cite 2 080 familles pour 1745.
🎲 Une ville où les autorités sont indiennes et où un Espagnol ne peut légalement s'établir sans permission — contexte inhabituel et narrativement riche pour un groupe de PJ qui arrive dans cette ville.`,
    },

    // ── VERACRUZ ─────────────────────────────────────────────────────────

    {
        id: 'veracruz',
        nom: 'Veracruz',
        type: 'port',
        territoire: 'nouvelle-espagne',
        coords: [1172, 2628],

        contexte: [
            {
                de: 1712,
                texte: `Premier port de la Nouvelle-Espagne sur l'Atlantique et unique débouché légal de tout le commerce entre Mexico et l'Espagne. L'argent des mines de Zacatecas et de Guanajuato passe par Veracruz avant d'embarquer pour Cadix — ce qui en fait la cible la plus convoitée du Golfe du Mexique.
<br><br>
Le <strong>Fort San Juan de Ulúa</strong> n'est pas sur la côte mais sur un îlot corallien à quelques centaines de mètres du rivage, commandant l'entrée de la rade. Son rôle est double : défense contre les attaques maritimes, et entrepôt sécurisé pour le trésor avant embarquement. La Jaillot distingue le fort insulaire ("Château de l'Isle de St. Jean Delua") d'un faubourg portuaire côtier au sud-est ("St Juan de Lua") — zone d'entrepôts, de chantiers et d'habitations de travailleurs liés au port, distincte de Veracruz intra-muros.
<br><br>
En 1683, les flibustiers Lorencillo (Laurent de Graff) et Grammont s'emparent de la ville pendant plusieurs jours — pillage mémorable qui a laissé des traces durables dans la mémoire collective. Le fort n'avait pas été pris, mais la ville fut rançonnée. Depuis lors, les défenses terrestres ont été renforcées.`,
            },
        ],

        population: `~6 000 à 8 000 habitants permanents ; peut doubler lors des arrivées de flottes`,

        garnison: `Fort San Juan de Ulúa : ~400 soldats et artilleurs. Garnison de la ville : ~200 soldats supplémentaires.`,

        note_mj: `✅ Raid de Lorencillo et Grammont, 1683 : établi.
✅ Fort San Juan de Ulúa sur îlot corallien : établi.
⚠️ Garnison : estimation d'après Archer, <em>The Army in Bourbon Mexico (1977)</em> — données postérieures aux réformes, couvre la période bourbonienne tardive — effectifs de 1712 probablement inférieurs.`,
    },

// ── VILLADOLID (MICHOACÁN) ───────────────────────────────────────────────

    {
        id: 'villadolid-nouvelle-espagne',
        nom: 'Valladolid',
        label: 'Valladolid',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [640, 2285],
        // ⚠️ "Villadolid" sur la Jaillot, province de Mechoacan.
        // À ne pas confondre avec Valladolid du Yucatán (id: 'valladolid-yucatan').

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province de Michoacán, fondée en 1541 dans une vallée tempérée à l'ouest de Mexico. Siège épiscopal depuis 1536 — l'évêché de Michoacán est l'un des plus anciens et des plus étendus de la Nouvelle-Espagne, couvrant un territoire qui s'étire jusqu'aux côtes du Pacifique. Valladolid est une ville d'Église et de propriétaires terriens créoles : ses grandes familles tirent leur richesse de l'élevage extensif et des haciendas céréalières du Bajío, le grenier de la Nouvelle-Espagne. Les mines d'argent de Guanajuato, à l'est, font partie de sa sphère d'influence économique.`,
            },
        ],

        population: `~15 000 habitants`,

        note_mj: `✅ Fondation 1541, siège épiscopal depuis 1536 : établi.
✅ Bajío comme grenier de la Nouvelle-Espagne, haciendas et élevage : établi.
⚠️ Population en 1712 : estimation.
La ville prendra le nom de Morelia en 1828, en hommage à José María Morelos, héros de l'indépendance mexicaine natif de la ville.`,
    },

// ── PÁTZCUARO (MECHOACAN) ────────────────────────────────────────────

    {
        id: 'patzcuaro',
        nom: 'Pátzcuaro',
        label: 'Mechoacan',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [492, 2347],
        // ⚠️ La Jaillot indique "Mechoacan" pour ce lieu — nom de la province
        // plutôt que de la ville. Pátzcuaro est l'identification la plus
        // plausible : ancienne capitale purépecha, première capitale espagnole
        // du Michoacán, sur le lac du même nom.
        // À distinguer de Valladolid/Michoacán (id: 'valladolid-michoacan'),
        // qui a supplanté Pátzcuaro comme capitale provinciale.

        contexte: [
            {
                de: 1712,
                texte: `Ville lacustre sur les rives du lac Pátzcuaro, dans les hautes terres du Michoacán. Ancienne capitale de l'empire purépecha (tarasque) — la seule grande civilisation mésoaméricaine que les Aztèques n'ont jamais réussi à soumettre — Pátzcuaro a été choisie comme première capitale espagnole du Michoacán avant d'être supplantée par Valladolid. Elle doit sa singularité à <strong>Vasco de Quiroga</strong>, dit "Tata Vasco" — évêque juriste qui, inspiré par l'<em>Utopie</em> de Thomas More, a organisé au XVIe siècle les villages indiens des rives du lac en communautés artisanales spécialisées : chaque village produit un seul artisanat (cuivre de Santa Clara, bois laqué de Uruapan, poterie de Tzintzuntzan...), assurant à chacun une spécialité et une interdépendance pacifique.
<br><br>
En 1712, ce système survit dans ses grandes lignes — les villages du lac Pátzcuaro maintiennent leurs spécialités artisanales, et la basilique de la Vierge de la Salud, fondée par Quiroga, reste le principal lieu de pèlerinage du Michoacán. Le lac lui-même, à 2 000 mètres d'altitude dans un paysage de volcans et de forêts de pins, est l'un des sites les plus beaux de la Nouvelle-Espagne.`,
            },
        ],

        population: `~10 000 habitants dans la ville et les villages du lac`,

        note_mj: `✅ Pátzcuaro comme ancienne capitale purépecha : établi.
✅ Vasco de Quiroga ("Tata Vasco"), organisation des villages artisanaux du lac : établi (Warren, <em>Vasco de Quiroga and his Pueblo-Hospitals</em>, 1963).
✅ Résistance purépecha aux Aztèques : établi.
✅ Basilique de la Vierge de la Salud, fondée par Quiroga : établi.
⚠️ Population en 1712 : estimation pour la ville et l'ensemble des villages lacustres.
La spécialisation artisanale des villages du lac Pátzcuaro est encore vivante aujourd'hui — l'une des rares réussites durables du projet de Quiroga.`,
    },

// ── POPOCATÉPETL ────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════
// SÉRIE YUCATÁN
// ═══════════════════════════════════════════════════════════

// ── LAGUNA DE TÉRMINOS ────────────────────────────────────────────────────

    {
        id: 'laguna-de-terminos',
        nom: 'Laguna de Términos',
        type: 'site_geo',
        rang: '2',
        territoire: 'yucatan',
        coords: [2074, 2889] ,
        // ⚠️ Apparaît sur la Jaillot comme "Laguna Termina" à la limite du Yucatán et de Tabasco.

        contexte: [
            {
                de: 1712, a: 1717,
                texte: `Vaste lagon côtier à la frontière du Yucatán et du Tabasco, accessible depuis le Golfe par plusieurs passes. La Laguna de Términos est l'un des points chauds de la confrontation entre l'Espagne et les Anglais sur la côte du Golfe : depuis des décennies, des <em>Baymen</em> — colons britanniques de la baie du Belize — remontent vers le nord pour y couper le bois de campêche (<em>palo de tinte</em>). L'île de Tris (aujourd'hui Ciudad del Carmen), au centre du lagon, est leur base principale : les Anglais y ont établi un petit établissement semi-permanent que les Espagnols ont tenté d'expulser à plusieurs reprises sans succès durable. La lagune est un espace de friction permanente, fréquenté par des navires qui préfèrent ne pas être vus.`,
            },
            {
                de: 1717,
                texte: `En 1717, le vice-roi Valero ordonne une expédition qui détruit l'établissement anglais de l'île de Tris et expulse les Baymen. La pression espagnole s'intensifie sur toute la côte du Golfe — mais les Baymen reviennent dès que la surveillance se relâche. La lagune reste une zone grise, ni vraiment espagnole ni vraiment britannique.`,
            },
        ],

        population: `Aucune population permanente espagnole — présence anglaise flottante de quelques dizaines à quelques centaines de Baymen selon la saison`,

        note_mj: `✅ Présence des Baymen à la Laguna de Términos depuis le XVIIe siècle : établi.
✅ Expulsion par Valero en 1717 : établi (Bolland, <em>Colonialism and Resistance in Belize</em>, 1988 ; Wikipedia EN, Laguna de Términos).
✅ Bois de campêche comme enjeu : établi — voir aussi entrée Campeche.
🎲 Terrain de jeu idéal : eaux peu profondes, passes connues des seuls locaux, Baymen armés, patrouilles espagnoles irrégulières.`,
    },

// ── LINCHANCHY ───────────────────────────────────────────────────────────

    {
        id: 'linchanchy',
        nom: 'Linchanchy',
        type: 'ville',
        rang: '3',
        territoire: 'yucatan',
        coords: [2546, 2370],

        contexte: [
            {
                de: 1712,
                texte: `Bourg maya de l'intérieur du Yucatán, dont le nom sur la Jaillot est une translittération approximative d'un toponyme maya non identifié avec certitude. Comme la plupart des localités de la péninsule, il s'organise autour d'une ancienne communauté maya convertie et encadrée par les Franciscains, vivant de maïs, de coton et d'une production artisanale locale. La péninsule du Yucatán est en 1712 une des régions les plus densément peuplées en Indiens christianisés de toute la Nouvelle-Espagne.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification précise incertaine — toponyme maya translittéré approximativement sur la Jaillot. Aucune source primaire directe pour cet établissement spécifique.`,
    },

// ── CONIL ────────────────────────────────────────────────────────────────

    {
        id: 'conil-yucatan',
        nom: 'Conil',
        type: 'ville',
        rang: '2',
        territoire: 'yucatan',
        coords: [2776, 2349],

        contexte: [
            {
                de: 1712,
                texte: `Village côtier sur la côte nord du Yucatán, connu des cartographes depuis les premières explorations espagnoles du XVIe siècle. Conil était une importante ville maya préhispanique — c'est ici que Francisco Hernández de Córdoba débarqua lors de son exploration de 1517, premier contact documenté entre Européens et Mayas du Yucatán. En 1712, c'est un village de pêcheurs, réduit à une fraction de son importance ancienne après un siècle et demi de colonisation et d'épidémies.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `✅ Conil comme site du premier débarquement de Hernández de Córdoba en 1517 : établi (Díaz del Castillo, <em>Historia Verdadera</em>).
✅ Ville maya importante avant la conquête : établi.
⚠️ État en 1712 : déclin certain, détails peu documentés.`,
    },

// ── VALLADOLID (YUCATÁN) ─────────────────────────────────────────────────

    {
        id: 'valladolid-yucatan',
        nom: 'Valladolid (Yucatán)',
        label: 'Valladolid',
        type: 'ville',
        rang: '2',
        territoire: 'yucatan',
        coords: [2747, 2562],
        // ⚠️ À ne pas confondre avec Valladolid du Michoacán (id: 'valladolid-michoacan').

        contexte: [
            {
                de: 1712,
                texte: `Ville fondée en 1543 sur le site de la cité maya de Zaci, dans l'est du Yucatán. Valladolid est le chef-lieu de la région orientale de la péninsule — point de passage obligé entre Mérida et la côte Caraïbe, sur la route des échanges avec le Honduras britannique et les Antilles. La ville est entourée de <em>cenotes</em> — puits naturels dans le calcaire karstique — dont dépend tout l'approvisionnement en eau de la région. Les couvents franciscains encadrent les communautés mayas des environs, spécialisées dans le coton et la cire d'abeille.`,
            },
        ],

        population: `~5 000 habitants (dont une forte majorité de Mayas)`,

        note_mj: `✅ Fondation 1543 sur le site de Zaci : établi.
✅ Rôle de chef-lieu de la région orientale, route vers la côte Caraïbe : établi.
✅ Cenotes comme source d'eau unique : établi — caractéristique géologique fondamentale du Yucatán.
⚠️ Population en 1712 : estimation.`,
    },

// ── SALAMANCA DE BACALAR ─────────────────────────────────────────────────

    {
        id: 'salamanca',
        nom: 'Salamanca de Bacalar',
        label: 'Bacalar',
        type: 'fort',
        rang: '2',
        territoire: 'yucatan',
        coords: [2273, 2970],
        // ⚠️ Mentionné dans carte-data.js (yucatan, note Casafuerte) comme
        // "Salamanca sur la carte". Côte du Belize, face à l'atoll de Turneffe.

        contexte: [
            {
                de: 1712,
                texte: `Poste espagnol avancé sur le lac Bacalar, à quelques kilomètres de la côte Caraïbe du Belize actuel — la frontière la plus exposée de toute la capitainerie du Yucatán. Salamanca de Bacalar existe depuis 1544, mais elle a été détruite et abandonnée à plusieurs reprises sous la pression des raids des Baymen anglais et des pirates. En 1712, c'est un poste squelettique — quelques soldats dans un fort mal entretenu, censé affirmer la souveraineté espagnole sur une côte que les Anglais fréquentent librement pour couper le bois de campêche.
<br><br>
Face à Turneffe et aux atolls du Belize, Salamanca est le dernier verrou espagnol avant le vide. Sa faiblesse est connue de tous — Baymen, pirates, et autorités de Mérida qui manquent de moyens pour la renforcer.`,
            },
            {
                de: 1722,
                texte: `Le marquis de Casafuerte, vice-roi de Nouvelle-Espagne, commande le premier projet sérieux de fortification de Bacalar — signal que la pression anglaise sur cette frontière est devenue intenable. Les travaux tardent, mais l'intention politique est claire.`,
            },
        ],

        garnison: `Quelques dizaines de soldats au mieux — effectif réel souvent inférieur à l'effectif théorique faute de situado régulier.`,

        note_mj: `✅ Salamanca de Bacalar, fondée 1544, détruite et rebâtie plusieurs fois : établi.
✅ Projet de fortification de Casafuerte (1722) : carte-data.js (yucatan).
✅ Pression des Baymen anglais sur cette frontière : établi — voir aussi entrée laguna-de-terminos.
⚠️ Garnison en 1712 : estimation basse, aucune source primaire directe.
🎲 Entrée et sortie naturelle entre le Yucatán espagnol et le territoire de facto des Baymen — zone de transit pour quiconque veut passer sans se faire remarquer.`,
    },

// ── CAMPECHE ───────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════
// SÉRIE GUATEMALA
// ═══════════════════════════════════════════════════════════

// ── TOCOTALPA ────────────────────────────────────────────────────────────

    {
        id: 'tocotalp-de-ciera',
        nom: 'Tocotalpa de la Sierra',
        label: 'Tocotalpa',
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1811, 3061],
        // ⚠️ Apparaît sur la Jaillot comme "Tocatalp de Cieria" dans la province de Chiapa.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de la sierra chiapanèque, dans la vallée du río Grijalva supérieur. Fondé comme poste de passage entre les hautes terres du Chiapas et la côte du Tabasco, Tocotalpa est un relais sur la route muletière qui descend vers Villahermosa et le Golfe. Peu documenté pour la période — un bourg de quelques centaines d'habitants vivant d'élevage et de petits commerces de transit.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Tocotalpa de la Sierra : peu documentée pour 1712. Identifiée comme bourg de la sierra chiapanèque sur la route Chiapas–Tabasco — existence attestée, détails incertains.`,
    },

// ── SOCONUSCO (VILLE) ────────────────────────────────────────────────────

    {
        id: 'sosonusco',
        nom: 'Soconusco',
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1457, 3299],
        // ⚠️ Distinction importante : la ville de Soconusco apparaît dans la juridiction
        // Guatemala sur la Jaillot, bien que la province de Soconusco soit rattachée
        // administrativement à la Nouvelle-Espagne. Cas symétrique à Chiapa de Corzo
        // (ville dans Nouvelle-Espagne, province dans Guatemala).

        contexte: [
            {
                de: 1712,
                texte: `Bourg côtier sur la côte pacifique méso-américaine, à la frontière entre la Nouvelle-Espagne et la capitainerie générale de Guatemala. La province de Soconusco est réputée pour produire le cacao le plus fin de toute la Nouvelle-Espagne — un produit d'exception, réservé aux tables royales et aux chocolatières des grands d'Espagne, expédié vers Mexico puis Veracruz. Ce statut d'excellence lui vaut une attention particulière de l'administration coloniale, qui surveille étroitement les exportations pour éviter la contrebande vers la Jamaïque ou les comptoirs hollandais.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Cacao du Soconusco comme production d'excellence : établi (MacLeod, <em>Spanish Central America</em>, 1973).
⚠️ Population en 1712 : estimation.
⚠️ Statut administratif ambigu : la province de Soconusco est rattachée à la Nouvelle-Espagne mais sa position géographique et son apparition sur la Jaillot dans la juridiction Guatemala justifient territoire: 'guatemala' pour la ville.`,
    },

// ── SANTIAGO DE GUATEMALA ────────────────────────────────────────────────

    {
        id: 'st-iago-de-guatemala',
        nom: 'Santiago de Guatemala',
        label: 'St Iago de Guatemala',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1723, 3355],
        // ⚠️ Connue aujourd'hui sous le nom d'Antigua Guatemala.
        // Détruite par les séismes de 1773 et abandonnée — la nouvelle capitale
        // sera transférée à Nueva Guatemala de la Asunción (Guatemala City).

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la capitainerie générale de Guatemala — l'une des plus belles villes coloniales des Amériques, et l'une des plus dangereuses à habiter. Santiago de Guatemala s'étend dans la vallée de Panchoy, dominée par trois volcans : le <strong>Volcán de Agua</strong> à l'est, dont une coulée de boue a détruit la première capitale en 1541, et les volcans de Fuego et d'Acatenango à l'ouest, dont les éruptions périodiques couvrent la ville de cendres. Les tremblements de terre sont constants — la ville a été reconstruite plusieurs fois.
<br><br>
Siège de la Real Audiencia de Guatemala, de l'archevêché et du capitaine général, Santiago administre un territoire immense : du Chiapas au Nicaragua. Ses rues sont bordées de couvents, d'églises baroques et de palais créoles bâtis en tuf volcanique. La ville exporte indigo, cacao et cochenille vers Veracruz ; elle importe via le port de Santo Tomás de Castilla sur la côte Caraïbe.`,
            },
        ],

        population: `~25 000 habitants`,

        note_mj: `✅ Capitale de la capitainerie générale de Guatemala, siège de la Real Audiencia : établi.
✅ Destruction de la première capitale par le Volcán de Agua en 1541 : établi.
✅ Volcans de Agua, Fuego et Acatenango dominant la vallée : établi.
✅ Séismes de 1773 → abandon et transfert à Guatemala City : établi — horizon postérieur à la campagne mais connu des joueurs.
⚠️ Population en 1712 : estimation.
⚠️ Gouverneur-capitaine général précis pour 1712 : à vérifier dans les sources guatémaltèques (AGI Guatemala).`,
    },


// ── SAN SALVADOR ─────────────────────────────────────────────────────────

    {
        id: 'st-salvador',
        nom: 'San Salvador',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1970, 3596],

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de l'alcaldía mayor de San Salvador, dans les hautes terres volcaniques du Salvador actuel. Fondée en 1525, la ville a été déplacée plusieurs fois à cause des tremblements de terre — une réalité permanente de cette région sismique. San Salvador est le centre administratif d'une province dont la richesse principale est l'<strong>indigo</strong> (<em>añil</em>) — la teinture bleue produite par les communautés indiennes pipiles sous le régime du repartimiento et exportée vers Veracruz puis l'Europe. L'indigo du Salvador est, au début du XVIIIe siècle, l'une des principales sources de colorant bleu pour les manufactures textiles européennes.`,
            },
        ],

        population: `~8 000 habitants`,

        note_mj: `✅ Fondation 1525, déplacements successifs dus aux séismes : établi.
✅ Indigo (añil) comme richesse principale de la province : établi (MacLeod, <em>Spanish Central America</em>, 1973).
⚠️ Population en 1712 : estimation.`,
    },

// ── LA TRINIDAD ─────────────────────────────────────────────

    {
        id: 'la-trinidad-guatemala',
        nom: 'La Trinidad',
        type: 'fort',
        rang: '3',
        territoire: 'guatemala',
        coords: [1936, 3613],
        // ⚠️ Identification incertaine. Apparaît sur la Jaillot juste en aval de San Salvador,
        // à l'embouchure du fleuve non nommé qui traverse la province — probablement le río Lempa
        // ou un cours d'eau côtier proche. Pourrait correspondre à l'emplacement actuel
        // de La Libertad ou de Sonsonate. Position côtière Pacifique.

        contexte: [
            {
                de: 1712,
                texte: `Position côtière à l'embouchure du fleuve descendant de San Salvador vers le Pacifique — probablement un petit fort ou poste de surveillance commandant l'accès fluvial à la capitale provinciale. La côte Pacifique du Salvador est peu fréquentée par les navires de commerce ; le débouché maritime de San Salvador et de sa production d'indigo passe surtout par la route terrestre vers les ports du Golfe du Honduras ou via Santiago de Guatemala.`,
            },
        ],

        note_mj: `⚠️ Identification très incertaine : "La Trinidad" sur la Jaillot à l'embouchure du fleuve au sud de San Salvador. Pourrait désigner un fort, un poste, ou simplement un nom de lieu sans établissement notable. Aucune source primaire directe identifiée.
⚠️ Correspondance géographique possible : La Libertad (actuelle), Sonsonate, ou tout autre point côtier entre ces deux localités.`,
    },

// ── SAN MIGUEL ───────────────────────────────────────────────────────────

    {
        id: 'st-michel',
        nom: 'San Miguel de la Frontera',
        label: 'San Miguel',
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [2124, 3733],

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de la province orientale du Salvador, à la frontière avec le Honduras. Fondée en 1530 comme poste avancé de la conquête espagnole vers le Nicaragua, San Miguel de la Frontera — "de la Frontière" — garde les routes terrestres entre le Guatemala, le Honduras et le Nicaragua. La ville vit de l'élevage et d'un commerce de transit ; elle est aussi le point de départ des routes vers le golfe de Fonseca et ses ports Pacifique.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1530, rôle de poste frontière : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── AMAPALA (GOLFE DE FONSECA) ───────────────────────────────────────────

    {
        id: 'amapal',
        nom: 'Amapala',
        type: 'port',
        rang: '2',
        territoire: 'guatemala',
        coords: [2203, 3745],
        // ⚠️ Apparaît sur la Jaillot comme "Amapal". Port sur l'île volcanique
        // del Tigre, dans le golfe de Fonseca (côte Pacifique, Honduras actuel).

        contexte: [
            {
                de: 1712,
                texte: `Port naturel sur l'île volcanique del Tigre, dans le golfe de Fonseca — la seule baie Pacifique partagée entre le Honduras, le Nicaragua et le Salvador actuel. Amapala est l'escale incontournable de la navigation côtière Pacifique entre le golfe de Tehuantepec et les ports péruviens : les navires qui transportent l'argent depuis Lima jusqu'aux côtes d'Amérique centrale y font relâche. Île volcanique aux pentes abruptes, elle offre un mouillage protégé et de l'eau douce.`,
            },
        ],

        population: `Quelques centaines d'habitants permanents, population maritime variable`,

        note_mj: `✅ Île del Tigre dans le golfe de Fonseca, rôle de relâche sur la route Pacifique : établi.
⚠️ Population et installations en 1712 : peu documentées — estimation.`,
    },

// ── CHOLUTECA (XERES) ────────────────────────────────────────────────────

    {
        id: 'xeres',
        nom: 'Choluteca (Jerez)',
        label: 'Choluteca',
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [2338, 3808],
        // ⚠️ Apparaît sur la Jaillot comme "Xeres" dans le sud du Honduras.
        // Choluteca est la ville la mieux documentée de cette région pour la période —
        // "Jerez" ou "Xerez" est le nom alternatif porté par plusieurs bourgs d'Amérique centrale.

        contexte: [
            {
                de: 1712,
                texte: `Bourg du Honduras méridional, dans la plaine côtière Pacifique au nord du golfe de Fonseca. Fondée en 1535 sous le nom de Villa de Jerez de la Frontera de Choluteca, la ville est le centre administratif de la région méridionale du Honduras. Son économie repose sur l'élevage extensif — les grandes haciendas de la vallée du río Choluteca approvisionnent en bétail les ports et les mines de toute l'Amérique centrale. Éloignée des côtes Caraïbes, elle n'entre dans les circuits de la piraterie qu'indirectement.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `⚠️ Identification de "Xeres" avec Choluteca : hypothèse la plus plausible géographiquement — Choluteca est la ville principale du Honduras méridional pour cette période. Une autre localité nommée Jerez pourrait correspondre, mais n'est pas identifiée avec certitude.
⚠️ Population en 1712 : estimation.`,
    },

// ── CIUDAD REAL (CHIAPAS) ─────────────────────────────────────────────────

    {
        id: 'chiapa-ciudad-real',
        nom: 'Ciudad Real (Chiapa)',
        label: 'Ciudad Real',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1615, 3016],
        // ⚠️ La province de Chiapas est dans le bloc Guatemala (carte-data.js).
        // La carte Jaillot indique "Chiapa ou Ciudad Real" — deux noms pour la même ville.
        // À ne pas confondre avec Chiapa de Corzo (ville indienne plus au nord,
        // qui donne son nom à la province mais apparaît dans la juridiction Nouvelle-Espagne).

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province de Chiapas dans les hautes terres mayas, à plus de 2 000 mètres d'altitude. Fondée en 1528 par Diego de Mazariegos — connue aujourd'hui sous le nom de San Cristóbal de las Casas, qu'elle prendra en 1848 en hommage à l'évêque dominicain Bartolomé de las Casas, qui en fit sa base pour défendre les droits des Indiens au XVIe siècle. Le diocèse de Chiapas, créé en 1539, est l'un des plus anciens du continent — et l'un des plus pauvres. L'économie repose sur le travail forcé des communautés mayas tzotziles et tzeltales dans les <em>obrajes</em> textiles et les haciendas d'élevage.`,
            },
        ],

        population: `~5 000 habitants (dont une majorité d'Indiens mayas)`,

        note_mj: `✅ Fondation 1528, nom Ciudad Real : établi.
✅ Las Casas et création du diocèse de Chiapas en 1539 : établi.
✅ Population maya tzotzile et tzeltale, obrajes textiles : établi.
⚠️ Population précise en 1712 : estimation.`,
    },

// ── COBÁN (VERA PAZ) ─────────────────────────────────────────────────────

    {
        id: 'coban-vera-pax',
        nom: 'Cobán (Vera Pax)',
        label: 'Cobán',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'guatemala',
        coords: [1794, 3172],
        // ⚠️ La province de Vera Paz n'est pas nommée sur la Jaillot — frontières
        // dessinées sans toponyme. Cobán est la capitale historique de la Vera Paz dominicaine.

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la Vera Paz — "la vraie paix" — province créée au XVIe siècle comme expérience de colonisation sans violence sous l'impulsion de Bartolomé de las Casas : les Dominicains s'installeraient seuls parmi les Mayas Q'eqchi' pour les convertir par la seule persuasion, sans soldats. L'expérience tient pendant dix ans (1537–1547). Cobán, fondée en 1538, en devient le centre administratif.
<br><br>
En 1712, l'idéal fondateur est lointain : les Dominicains gèrent leurs missions comme n'importe quelle province coloniale. Cobán reste une ville profondément maya, enclavée dans les hautes terres du Guatemala, sans accès maritime ni ressources minières — trop éloignée et trop pauvre pour figurer souvent dans les archives de Madrid.`,
            },
        ],

        population: `~3 000 habitants (population majoritairement maya Q'eqchi')`,

        note_mj: `✅ Expérience de colonisation pacifique de Las Casas 1537–1547 : établi (Las Casas, <em>Historia de las Indias</em> ; Wagner & Parish, 1967).
✅ Fondation de Cobán en 1538 : établi.
⚠️ Situation en 1712 : peu documentée — province marginale dans les archives coloniales.
⚠️ Population : estimation très approximative.`,
    },

// ═══════════════════════════════════════════════════════════
// SÉRIE HONDURAS
// ═══════════════════════════════════════════════════════════

// ── AMALIGUA ─────────────────────────────────────────────────────────────

    {
        id: 'amaligua',
        nom: 'Puerto de Higüeras (Amaligua)',
        label: 'P. de Higneras',
        type: 'port',
        rang: '2',
        territoire: 'honduras',
        coords: [2251, 3219],
        // ⚠️ La Jaillot indique "Amaligua" comme village et "P. de Higneras" comme
        // port à proximité, entre l'embouchure du río Dulce et le "R. Pech" (río Patuca).
        // "Higüeras" est le nom colonial de toute cette côte (donné par Colomb lors
        // de son 4e voyage). Correspond à la zone de Puerto Barrios (Guatemala actuel),
        // à l'embouchure du río Dulce donnant accès au lac Izabal.

        contexte: [
            {
                de: 1712,
                texte: `Port à l'embouchure du río Dulce, sur la côte Caraïbe — porte d'entrée vers le lac Izabal et l'intérieur du Guatemala. "Higüeras" est le nom donné par Colomb lors de son quatrième voyage (1502) à toute cette côte hondurienne-guatémaltèque, en référence aux figuiers de Barbarie abondants sur le rivage. En 1712, c'est un mouillage actif sur la route entre les ports de la côte Caraïbe et la route fluviale vers Santiago de Guatemala via le río Dulce et le lac Izabal — la principale voie d'accès maritime à la capitainerie générale de Guatemala depuis la Caraïbe.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `✅ "Higüeras" comme nom colonial de la côte, donné par Colomb (4e voyage, 1502) : établi.
✅ Embouchure du río Dulce comme accès au lac Izabal et à l'intérieur du Guatemala : établi géographiquement.
⚠️ Identification avec Puerto Barrios (Guatemala actuel) : probable d'après la position sur la Jaillot entre l'embouchure du río Dulce et le "R. Pech" (río Patuca). Puerto Barrios n'est fondé formellement qu'au XIXe siècle mais le mouillage est utilisé depuis la conquête.
⚠️ "Amaligua" : village distinct à proximité, non identifié précisément — pourrait être un village garifuna ou misumalpan de la côte.`,
    },


// ── PORTA DOMAS (PUERTO CABALLOS ?) ──────────────────────────────────────

    {
        id: 'porta-domos',
        nom: 'Puerto Cortés (Puerto Caballos)',
        label: 'Porta Domos',
        type: 'port',
        rang: '2',
        territoire: 'honduras',
        coords: [2316, 3270],
        // ⚠️ "Porta Domos" sur la Jaillot — identification confirmée avec Puerto Cortés
        // (Puerto Caballos colonial) : principal port Caraïbe du Honduras, débouché
        // maritime de San Pedro Sula. La phonétique reste inexpliquée.

        contexte: [
            {
                de: 1712,
                texte: `Principal port de la côte Caraïbe hondurienne, débouché maritime de la vallée de la Sula et de San Pedro Sula. Connu sous le nom colonial de Puerto Caballos — "port des chevaux", en référence aux premiers débarquements de montures espagnoles sur cette côte — c'est par ici que transitent l'indigo et le cacao de l'arrière-pays guatémaltèque et hondurien avant d'embarquer vers l'Espagne via La Havane. Le port est protégé par le cap Tres Puntas au nord-est, qui lui offre un abri naturel contre les houles caraïbes.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `✅ Puerto Caballos (Puerto Cortés) comme principal port Caraïbe du Honduras : établi.
✅ Identification confirmée par la position sur la Jaillot (en amont du cap Tres Puntas) et par la présence de San Pedro Sula dans les terres comme ville de l'arrière-pays.
⚠️ Phonétique "Porta Domos" → "Puerto Caballos" : non expliquée — déformation cartographique importante.`,
    },

// ── PORTA DE SAL ─────────────────────────────────────────────────────────

    {
        id: 'porta-de-sal',
        nom: 'La Ceiba (Porta de Sal)',
        label: 'Porta de Sal',
        type: 'port',
        rang: '2',
        territoire: 'honduras',
        coords: [2478, 3296],
        // ⚠️ "Sal River" sur la Jaillot = probable río Cangrejal (La Ceiba actuelle).
        // Identification cohérente avec la position entre Puerto Cortés et Trujillo.

        contexte: [
            {
                de: 1712,
                texte: `Mouillage côtier à l'embouchure d'une rivière descendant des montagnes honduriennes vers la Caraïbe — le "Sal River" de la Jaillot, probablement le río Cangrejal. Ce point de la côte offre un abri modeste aux petits navires de cabotage entre Puerto Cortés à l'ouest et Trujillo à l'est. L'arrière-pays montagneux est peu colonisé — quelques missions et villages lencas dans les vallées intérieures. La plage de La Ceiba sera un port plus actif au XIXe siècle avec le développement des bananeries, mais en 1712 c'est un simple mouillage de passage.`,
            },
        ],

        population: `Quelques dizaines d'habitants`,

        note_mj: `⚠️ Identification "Sal River" = río Cangrejal (La Ceiba) : plausible d'après la position sur la Jaillot entre Puerto Cortés et Trujillo. "Sal" pourrait être une déformation ou une traduction partielle du nom local.
⚠️ La Ceiba ne devient un port notable qu'au XIXe siècle — en 1712, simple mouillage de passage.`,
    },

// ── COMAYAGUA ────────────────────────────────────────────────────────────

    {
        id: 'valladolid-o-comayagua',
        nom: 'Comayagua (Valladolid)',
        label: 'Comayagua',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'honduras',
        coords: [2535, 3515],
        // ⚠️ La Jaillot indique "Valladolid o Comayagua" — les deux noms désignent
        // la même ville : fondée sous le nom de Valladolid en 1537, rebaptisée
        // Comayagua peu après.

        contexte: [
            {
                de: 1712,
                texte: `Capitale de la province du Honduras, fondée en 1537 dans une vallée de l'intérieur à mi-chemin entre les deux côtes. Rebaptisée rapidement Comayagua après sa fondation sous le nom de Valladolid, elle est le siège de l'évêché du Honduras depuis 1561 et le centre administratif de la province. La ville vit de l'élevage extensif, de quelques mines d'argent en activité décroissante, et du commerce avec les ports des deux côtes.
<br><br>
Comayagua est éloignée de la mer — une journée de route vers Trujillo au nord, plusieurs jours vers le golfe de Fonseca au sud. Cette position centrale en fait un nœud administratif, mais lui confère une provincialité tranquille, loin des turbulences de la côte Caraïbe et de la piraterie qui l'anime.`,
            },
        ],

        population: `~6 000 habitants`,

        note_mj: `✅ Fondation 1537, siège épiscopal depuis 1561 : établi.
✅ Double nom Valladolid/Comayagua sur les sources anciennes : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── SAINT-GEORGES (RÍO AGUÁN) ────────────────────────────────────────────

    {
        id: 'st-georges-honduras',
        nom: "Saint-George's",
        label: "St Georges",
        type: 'ville',
        rang: '2',
        territoire: 'honduras',
        coords: [2839, 3388],
        // ⚠️ Sur la "Xagua River" de la Jaillot — probablement le río Aguán
        // (aussi orthographié Xagua, Aguan sur les cartes anciennes),
        // qui se jette dans la mer des Caraïbes près de Trujillo.
        // Présence anglaise probable — le nom "Saint-George's" suggère un établissement
        // britannique ou une désignation anglaise d'un mouillage utilisé depuis la Jamaïque.

        contexte: [
            {
                de: 1712,
                texte: `Établissement sur le río Aguán (Xagua River), sur la côte Caraïbe hondurienne. Le nom anglais de "Saint-George's" suggère un poste de commerce ou un mouillage fréquenté par des navires jamaïcains — une de ces présences britanniques informelles qui parsèment la côte hondurienne, tolérées par défaut faute de garnison espagnole suffisante pour les expulser. Les commerçants jamaïcains et les Baymen de la baie du Belize utilisent les embouchures des fleuves honduriens pour faire du commerce avec l'arrière-pays et couper du bois.`,
            },
        ],

        population: `Quelques dizaines à quelques centaines d'habitants — population mixte, probablement des Anglais, des Miskitos et des Indiens locaux`,

        note_mj: `⚠️ Identification du "Xagua River" avec le río Aguán : probable géographiquement.
⚠️ Nature de l'établissement : incertaine — le nom anglais suggère une présence britannique informelle, mais aucune source primaire directe ne documente "Saint-George's" sur le río Aguán pour cette période.`,
    },

// ── SAN JORGE DE OLANCHO ─────────────────────────────────────────────────

    {
        id: 'comajagua-st-iago-de-olancho',
        nom: 'San Jorge de Olancho',
        label: 'St Iago de Olancho',
        type: 'ville',
        rang: '2',
        territoire: 'honduras',
        coords: [2852, 3499],
        // ⚠️ La Jaillot indique "Comajagua ou St Iago de Olancho" — la Jaillot
        // amalgame deux villes distinctes : Comayagua (capitale, voir entrée dédiée)
        // et San Jorge de Olancho (vallée d'Olancho, à l'est).

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de la vallée d'Olancho, dans les terres hautes de l'intérieur hondurien à l'est de Comayagua. San Jorge de Olancho est réputée pour ses mines d'or — les plus riches du Honduras colonial au XVIe siècle, aujourd'hui en déclin mais encore exploitées. La vallée est enclavée, accessible seulement par des sentiers de montagne difficiles, ce qui lui confère une autonomie de fait considérable. Les Indiens jicaques et pech des forêts environnantes résistent sporadiquement à l'autorité coloniale.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Mines d'or d'Olancho : établi — exploitées depuis le XVIe siècle, en déclin au XVIIIe.
⚠️ La Jaillot amalgame Comayagua et Olancho sous un même nom — deux villes distinctes dans la réalité.
⚠️ Population en 1712 : estimation.`,
    },

// ── NUEVA SEGOVIA ────────────────────────────────────────────────────────

    {
        id: 'nueva-segovia',
        nom: 'Nueva Segovia',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'honduras',
        coords: [2912, 3686],
        // ⚠️ Nueva Segovia apparaît dans la juridiction Honduras sur la Jaillot.
        // Fondée dans le nord du Nicaragua actuel (aujourd'hui Ocotal),
        // elle relève administrativement de la province du Nicaragua
        // mais sa position cartographique la place dans la zone Honduras.
        // territoire: 'honduras' retenu pour coller à la Jaillot.

        contexte: [
            {
                de: 1712,
                texte: `Bourg minier fondé en 1543 dans les hautes terres de la frontière Honduras-Nicaragua. Nueva Segovia a été fondée pour exploiter les mines d'or et d'argent de la région — une richesse qui a décliné depuis le XVIe siècle mais qui justifie encore la présence d'un poste administratif. Enclavée dans la sierra, loin des côtes et des routes commerciales principales, elle est une des villes les plus isolées de toute l'Amérique centrale espagnole.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Fondation 1543, vocation minière : établi.
⚠️ La Jaillot la place dans la zone Honduras bien qu'elle relève du Nicaragua administrativement — territoire: 'honduras' retenu pour la cohérence cartographique.
⚠️ Population en 1712 : estimation.`,
    },

// ── SAN PEDRO SULA ───────────────────────────────────────────────────────────

    {
        id: 'san-pedro',
        nom: 'San Pedro Sula',
        label: 'San Pedro',
        type: 'ville',
        territoire: 'honduras',
        coords: [2411, 3378],

        contexte: [
            {
                de: 1712,
                texte: `Ville fondée en 1536 dans la fertile vallée de la Sula, entre les montagnes honduriennes et la côte Caraïbe. San Pedro Sula est le centre commercial de la région nord du Honduras — ses marchés redistribuent l'indigo, le cacao et le bois précieux de l'arrière-pays vers Puerto Cortés (Puerto Caballos), à quelques lieues au nord. La vallée de la Sula est l'une des plus productives du Honduras colonial : ses rivières irriguent des cultures de maïs, de cacao et de cannes à sucre, et ses forêts fournissent le bois de construction et de teinture exporté vers l'Espagne.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1536 dans la vallée de la Sula : établi.
✅ Rôle de centre commercial de l'arrière-pays hondurien, débouché sur Puerto Cortés : établi géographiquement.
⚠️ Population en 1712 : estimation.`,
    },

// ── LAC IZABAL / EL GOLFETE ──────────────────────────────────────────────────

    {
        id: 'lac-izabal',
        nom: 'Lac Izabal (El Golfete)',
        label: 'Lac Izabal',
        type: 'site',
        territoire: 'guatemala',
        coords: [2028, 3209],
        // ⚠️ Dessiné sans nom sur la Jaillot mais représenté sans ambiguïté.
        // Le lac Izabal est le plus grand lac du Guatemala actuel, relié à la
        // mer des Caraïbes par El Golfete et le río Dulce.

        contexte: [
            {
                de: 1712,
                texte: `Le plus grand lac du Guatemala, relié à la mer des Caraïbes par une succession de plans d'eau — El Golfete d'abord, puis le canyon du río Dulce, avant d'atteindre la côte à Puerto de Higüeras. Ce système lacustre est la principale voie d'accès maritime à l'intérieur de la capitainerie générale de Guatemala depuis la Caraïbe : les marchandises débarquées à la côte remontent par pirogue le río Dulce, traversent El Golfete, puis le lac Izabal, avant d'être chargées sur des mules pour la route terrestre vers Santiago de Guatemala.
<br><br>
Les rives du lac sont peu peuplées par les Espagnols — quelques haciendas d'élevage et des missions parmi les Mayas q'eqchi' de l'arrière-pays. Le canyon du río Dulce, aux parois calcaires de trente mètres de hauteur couvertes de végétation tropicale, est l'un des paysages les plus spectaculaires de toute l'Amérique centrale. Les pirates et les flibustiers qui connaissent cette route y trouvent un refuge presque impénétrable.`,
            },
        ],

        note_mj: `✅ Lac Izabal comme plus grand lac du Guatemala, relié à la Caraïbe par le río Dulce et El Golfete : établi géographiquement.
✅ Route fluviale vers l'intérieur du Guatemala via le río Dulce : établi.
🎲 Le canyon du río Dulce est un terrain de jeu narratif exceptionnel — étroit, impossible à surveiller, bordé de falaises, fréquenté par des pirogues indiennes et des navires qui cherchent à ne pas être vus.`,
    },

// ── GRACIAS (PRIMERA CAPITAL DE HONDURAS) ────────────────────────────────────

    {
        id: 'gratios-o-dios',
        nom: 'Gracias (Villa de Gracias a Dios)',
        label: 'Gratios o Dios',
        type: 'ville',
        territoire: 'honduras',
        coords: [2235, 3430],
        // ⚠️ "Gratios o Dios" sur la Jaillot, en remontant le "R. Pech" (río Patuca)
        // depuis la côte, non loin de la frontière avec l'Audience de Guatemala.
        // Identification avec Gracias (Lempira) confirmée par la position.

        contexte: [
            {
                de: 1712,
                texte: `Ville fondée en 1536 dans les montagnes de Lempira — la première capitale du Honduras colonial et siège de la première Audiencia d'Amérique centrale (1544). Son nom complet, "Villa de Gracias a Dios", commémore le soulagement des conquistadors lorsqu'ils ont enfin trouvé une plaine propice à l'établissement après des mois d'errance dans les sierras honduriennes. La Real Audiencia de los Confines, installée ici en 1544, administrait alors toute l'Amérique centrale — avant d'être transférée à Santiago de Guatemala en 1549, laissant Gracias à son isolement montagnard.
<br><br>
En 1712, Gracias est une ville de second rang — chef-lieu d'une province montagneuse productrice d'élevage et de quelques mines d'argent, sur la route entre Comayagua et les provinces du Guatemala. Sa gloire passée de capitale est lointaine, mais son couvent franciscain et sa cathédrale témoignent encore de cette période fondatrice.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Fondation 1536, première capitale du Honduras : établi.
✅ Siège de la Real Audiencia de los Confines en 1544, transférée à Santiago de Guatemala en 1549 : établi.
✅ Étymologie du nom — soulagement des conquistadors après leur errance dans la sierra : établi (tradition documentée).
⚠️ Population en 1712 : estimation.`,
    },

// ═══════════════════════════════════════════════════════════
// SÉRIE NICARAGUA
// ═══════════════════════════════════════════════════════════

// ── LEÓN ─────────────────────────────────────────────────────────────────

    {
        id: 'leon-nicaragua',
        nom: 'León',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2533, 3898],
        // ⚠️ La première León (León Viejo) a été détruite par l'éruption du Momotombo
        // en 1610. La ville a été reconstruite à son emplacement actuel, à ~30 km à l'ouest.
        // En 1712, "León" désigne la ville reconstruite.

        contexte: [
            {
                de: 1712,
                texte: `Capitale du Nicaragua espagnol, siège de l'évêché et de l'administration provinciale. La première León, fondée en 1524 au pied du Momotombo, a été abandonnée en 1610 après les éruptions et les tremblements de terre qui l'ont rendue inhabitable — un déplacement traumatique dont la mémoire reste vive. La ville reconstruite s'organise autour de sa cathédrale et de ses couvents dans une plaine proche du lac Managua. León vit de l'élevage et de la production d'indigo et de cacao, expédiés vers le golfe de Fonseca puis vers Lima ou Veracruz.`,
            },
        ],

        population: `~8 000 habitants`,

        note_mj: `✅ Fondation de León Viejo en 1524, abandon en 1610 suite aux éruptions du Momotombo : établi.
✅ Siège épiscopal : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── NICARAGUA (VILLE) ─────────────────────────────────────────────────────

    {
        id: 'nicaragua-ville',
        nom: 'Nicaragua',
        type: 'ville',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2899, 4048], 
        // ⚠️ Ville indiquée sur la Jaillot à l'est de Granada, entre le lac Nicaragua
        // et la frontière avec le Costa Rica, à la même longitude approximative que
        // Nueva Segovia. Pourrait correspondre à Rivas ou à un bourg aujourd'hui disparu
        // portant le nom de la province. Identification incertaine.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de l'isthme de Rivas, entre le lac Nicaragua et le Pacifique — la partie la plus étroite du Nicaragua, où les deux côtes ne sont séparées que d'une vingtaine de kilomètres. Ce couloir naturel est la route la plus courte entre l'Atlantique et le Pacifique en Amérique centrale, empruntée depuis la conquête par les convois transportant les marchandises entre Granada et les ports du Pacifique. En 1712, c'est un bourg agricole vivant de l'élevage et du transit des marchandises.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `⚠️ Identification incertaine : la Jaillot place "Nicaragua" comme ville distincte de Granada, à l'est de celle-ci entre le lac et la frontière Costa Rica. Correspond probablement à Rivas ou à un bourg de l'isthme portant ce nom générique.
⚠️ Population : estimation très approximative.`,
    },

// ── MOMBACHO ─────────────────────────────────────────────────────────────

    {
        id: 'mombacho',
        nom: 'Volcan Mombacho',
        label: 'Monbache',
        type: 'site_geo',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2764, 4091],
        // ⚠️ La Jaillot indique "Monbache" pour ce volcan côté Pacifique,
        // au sud de Granada — c'est le vrai Mombacho (dominant le lac Nicaragua).
        // "Le Grand Vulcan de Munbacho" sur la Jaillot désigne en réalité
        // le Momotombo (volcan de León) — confusion cartographique signalée
        // dans l'entrée dédiée 'momotombo'.

        contexte: [
            {
                de: 1712,
                texte: `Volcan dominant la rive sud du lac Nicaragua, face à Granada. Le Mombacho culmine à environ 1 300 mètres — visible depuis Granada et depuis le lac sur une grande distance, il sert de repère de navigation aux pirogues et aux brigantins qui sillonnent le lac. Ses flancs sont couverts d'une forêt dense entrecoupée de fumerolles ; la dernière éruption majeure remonte à 1570. En 1712, le volcan est en activité fumerolienne modérée — assez pour inquiéter les habitants de Granada à chaque tremblement de terre.`,
            },
        ],

        note_mj: `✅ Mombacho, volcan dominant Granada et le lac Nicaragua : établi.
✅ Dernière éruption majeure 1570 : établi (Wikipedia EN, Mombacho).
⚠️ La Jaillot l'indique comme "Monbache" et nomme "Le Grand Vulcan de Munbacho" le Momotombo de León — double confusion cartographique. Voir entrée 'momotombo'.
⚠️ État précis en 1712 : activité fumerolienne probable, sans éruption documentée pour la période.`,
    },

// ── LA TRINIDAD (NICARAGUA) ──────────────────────────────────────────────

    {
        id: 'lastrinidad-nicaragua',
        nom: 'La Trinidad',
        type: 'ville',
        rang: '2',
        territoire: 'nicaragua',
        coords: [3123, 3916],
        // ⚠️ Distinct de la Trinidad du Salvador (supprimée). Bourg minier
        // du Nicaragua septentrional, dans le département d'Estelí actuel.

        contexte: [
            {
                de: 1712,
                texte: `Bourg minier du nord du Nicaragua, dans les hautes terres entre León et Nueva Segovia. La Trinidad doit son existence aux filons d'or et d'argent de la sierra nicaraguayenne — une richesse modeste mais qui justifie le maintien d'un petit poste colonial dans une région autrement peu peuplée par les Espagnols. Les Indiens sumu et miskito des forêts voisines maintiennent une indépendance de fait que les autorités de León n'ont pas les moyens de contester.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ Identification avec La Trinidad (Estelí actuel) : plausible géographiquement, non confirmée par source primaire directe.
⚠️ Population : estimation.`,
    },

// ── MENA ─────────────────────────────────────────────────────────────────

    {
        id: 'mena-nicaragua',
        nom: 'Mena',
        type: 'ville',
        rang: '2',
        territoire: 'nicaragua',
        coords: [3126, 3952],

        contexte: [
            {
                de: 1712,
                texte: `Bourg de l'intérieur nicaraguayen, non identifié avec certitude dans les sources coloniales. Probablement un petit poste agricole ou minier de l'arrière-pays, mentionné sur la Jaillot sans plus de précision. La région est peu documentée pour le début du XVIIIe siècle.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification incertaine — "Mena" non retrouvé avec certitude dans les sources coloniales nicaraguayennes. Pourrait être un bourg aujourd'hui disparu ou connu sous un autre nom.`,
    },

// ── CASTILLO DE LA INMACULADA (EL CASTILLO) ──────────────────────────────

    {
        id: 'castillo-san-juan',
        nom: 'Castillo de la Inmaculada Concepción',
        label: 'El Castillo',
        type: 'fort',
        rang: '2',
        territoire: 'nicaragua',
        coords: [3234, 3973],
        // ⚠️ Situé à mi-parcours du río San Juan, sur les rapides qui bloquent
        // la navigation — à ~80 km de l'embouchure maritime et ~130 km de Granada.
        // Correspond au fort indiqué sur la Jaillot "à mi-chemin" du lac et de la mer.
        // L'entrée granada-nicaragua a été corrigée en conséquence.

        contexte: [
            {
                de: 1712,
                texte: `Fort bâti en 1673 sur un promontoire rocheux dominant les rapides du río San Juan, à mi-parcours entre le lac Nicaragua et la mer des Caraïbes. C'est la clé de toute la route fluviale : les rapides rendent la navigation impossible sans débarquement et portage — ce point de rupture de charge est le seul endroit où le trafic entre l'Atlantique et le lac peut être stoppé. Le fort commande ce passage depuis un éperon rocheux de 40 mètres de hauteur.
<br><br>
En 1712, El Castillo est mal entretenu et sous-doté en hommes — le lot commun des postes isolés de la frontière nicaraguayenne. Sa valeur symbolique dépasse sa valeur réelle : il suffit à dissuader les raids improvisés, mais ne résisterait pas à une attaque sérieuse. Nelson tentera de le prendre en 1780 — il y sera blessé, et l'expédition britannique échouera faute de renforts.`,
            },
        ],

        garnison: `~60 à 80 soldats. Estimation d'après l'importance stratégique du site et par analogie avec les postes nicaraguayens comparables.`,

        note_mj: `✅ Fondation du Castillo de la Inmaculada Concepción en 1673 : établi.
✅ Position sur les rapides à mi-parcours du río San Juan, ~80 km de la côte : établi — c'est précisément ce qui en fait le verrou de la route fluviale.
✅ Expédition Nelson 1780, blessure de Nelson : établi — hors période de campagne mais connu des joueurs.
⚠️ Garnison en 1712 : estimation.
Correction connexe : l'entrée granada-nicaragua plaçait incorrectement le fort "à l'embouchure" — corrigé dans villes-data.js.`,
    },

// ── VILLE AU CONFLUENT SAN JUAN / RÍO FRÍO ───────────────────────────────

    {
        id: 'confluent-san-juan-frio',
        nom: 'Confluent du San Juan',
        type: 'site_geo',
        rang: '3',
        territoire: 'nicaragua',
        coords: [3273, 3944],
        // ⚠️ La Jaillot indique une ville non nommée au confluent du San Juan
        // et du "Rio Cambitto" — probablement le río Frío (frontière actuelle
        // Costa Rica/Nicaragua), point de départ de la navigation vers le lac.
        // Ce confluent est le nœud de la route fluviale San Juan.

        contexte: [
            {
                de: 1712,
                texte: `Point de confluence entre le río San Juan et un affluent majeur venant du sud — probablement le río Frío, qui descend des hautes terres du Costa Rica. Ce confluent marque le début de la portion navigable du San Juan depuis la côte Caraïbe : c'est ici que les embarcations choisissent leur route, vers le lac Nicaragua en remontant le San Juan, ou vers le sud en suivant l'affluent. Un poste de surveillance ou un simple relais de pirogues à cet endroit est plausible, sans qu'un établissement colonial formel soit documenté.`,
            },
        ],

        note_mj: `⚠️ Ville non nommée sur la Jaillot à ce confluent — probablement un simple relais ou poste de surveillance, pas un établissement colonial notable. Identification du "Rio Cambitto" avec le río Frío : hypothèse géographique, non confirmée.`,
    },

// ── GRACIAS A DIOS (NICARAGUA) ───────────────────────────────────────────

    {
        id: 'gratates-iuo-dedios-nicaragua',
        nom: 'Gracias a Dios (Nicaragua)',
        label: 'Gra. a Dios',
        type: 'ville',
        rang: '3',
        territoire: 'nicaragua',
        coords: [3264, 4004],
        // ⚠️ "Gratades Iuo Dedios" sur la Jaillot — déformation probable de
        // "Gracias a Dios". Distinct du cap Gracias a Dios hondurien (déjà documenté).
        // Position nicaraguayenne, probablement dans la région de la côte Miskito
        // ou dans l'arrière-pays septentrional du Nicaragua.

        contexte: [
            {
                de: 1712,
                texte: `Bourg ou poste portant le nom de "Gracias a Dios" dans le nord du Nicaragua — distinct du cap Gracias a Dios hondurien qui marque l'extrémité orientale de la côte. Ce type de doublon toponymique est fréquent dans les colonies espagnoles, où plusieurs établissements portent le même nom de dévotion. La région est à la frontière de l'influence espagnole et du territoire miskito — une zone de friction permanente où l'autorité de León est nominale.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ "Gratades Iuo Dedios" : déformation de "Gracias a Dios" probable. Identification et position précises incertaines — à distinguer du cap Gracias a Dios hondurien (entrée cap-gracias-a-dios).`,
    },

// ── MOMOTOMBO ───────────────────────────────────────────────────────────

    {
        id: 'momotombo',
        nom: 'Momotombo',
        label: 'Le Grand Vulcan de Munbacho',
        type: 'site_geo',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2561, 3812],
        // ⚠️ La Jaillot désigne ce volcan "Le Grand Vulcan de Munbacho" — confusion
        // avec le Mombacho de Granada (entrée 'mombacho', "Monbache" sur la Jaillot).
        // Le vrai Momotombo domine le lac Managua au nord-ouest de León.

        contexte: [
            {
                de: 1712,
                texte: `Volcan conique de 1 297 mètres dominant la rive nord-ouest du lac Managua, au nord de León. Le Momotombo est l'un des volcans les plus actifs d'Amérique centrale — et l'un des plus meurtriers pour les Espagnols : son éruption de 1610, combinée à des séismes violents, a contraint les habitants de León Viejo à abandonner la première capitale du Nicaragua et à la refonder à son emplacement actuel, à une trentaine de kilomètres. Le volcan fume en permanence, visible depuis León et depuis le lac à grande distance. Pour les marins qui remontent le río San Juan depuis la Caraïbe, c'est le premier volcan visible à l'horizon lorsqu'ils approchent du lac Nicaragua — un repère et un avertissement.`,
            },
        ],

        note_mj: `✅ Éruption de 1610 et abandon de León Viejo : établi — voir entrée 'leon-nicaragua'.
✅ Momotombo, volcan actif dominant le lac Managua : établi.
⚠️ Confusion sur la Jaillot : "Le Grand Vulcan de Munbacho" désigne le Momotombo (León), tandis que "Monbache" désigne le Mombacho (Granada). Double erreur cartographique — les deux noms sont proches et les deux volcans sont nicaraguayens.`,
    },

// ── LAC NICARAGUA ───────────────────────────────────────────────────────

    {
        id: 'lac-nicaragua',
        nom: 'Lac Nicaragua (Cocibolca)',
        label: 'Lac Nicaragua',
        type: 'site_geo',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2877, 3931] ,

        contexte: [
            {
                de: 1712,
                texte: `Le plus grand lac d'Amérique centrale — environ 160 km de long sur 70 km de large, parsemé d'îles dont la principale, Ometepe, porte deux volcans. Le lac Nicaragua est un plan d'eau d'eau douce mais qui communique avec la mer des Caraïbes par le río San Juan — une voie navigable de près de 200 km qui relie Granada à la côte Atlantique. Cette géographie en fait la cible stratégique de toute expédition cherchant à traverser l'isthme par voie d'eau.
<br><br>
Morgan l'a remontée en 1665 pour saccager Granada. La Royal Navy y enverra des expéditions au XVIIIe siècle. Le lac abrite des requins bouledogues (<em>Carcharhinus leucas</em>) — les seuls requins d'eau douce des Amériques — dont les attaques sur les pêcheurs sont documentées depuis la conquête et alimentent les récits des voyageurs.`,
            },
        ],

        note_mj: `✅ Plus grand lac d'Amérique centrale, communication avec la Caraïbe via le San Juan : établi.
✅ Requins bouledogues dans le lac Nicaragua : établi — phénomène documenté, les requins remontent le San Juan depuis la mer.
✅ Raid de Morgan en 1665 via le San Juan : établi — voir entrée 'granada-nicaragua'.
✅ Île Ometepe et ses deux volcans (Concepción et Maderas) : établi.`,
    },

// ═══════════════════════════════════════════════════════════
// SÉRIE COSTA RICA
// ═══════════════════════════════════════════════════════════

// ── 40. NICOYA ───────────────────────────────────────────────────────────────

    {
        id: 'st-lucar-nicoya',
        nom: 'Nicoya (San Lucas de Nicoya)',
        label: 'St Lucar Nicoya',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'costa-rica',
        coords: [2952, 4133],

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de la province de Nicoya, sur la péninsule du même nom baignée par le golfe de Nicoya. Fondée en 1522 — l'une des premières villes espagnoles permanentes d'Amérique centrale — Nicoya est le centre administratif d'une région d'élevage extensif sur les savanes de la péninsule. La ville a donné son nom à la province et, plus largement, à toute la région côtière Pacifique du Costa Rica septentrional. Sa population est majoritairement indigène chorotega, convertie et encadrée par les Mercédaires.`,
            },
        ],

        population: `~3 000 habitants (dont une forte majorité d'Indiens chorotegas)`,

        note_mj: `✅ Fondation 1522, l'une des premières villes d'Amérique centrale : établi.
✅ Population chorotega, présence mercédaire : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 41. CASTILLO DE AUSTRIA (MATINA) ─────────────────────────────────────────

    {
        id: 'chateau-de-austria',
        nom: 'Castillo de Austria',
        label: 'Château de Austria',
        type: 'fort',
        rang: '2',
        territoire: 'costa-rica',
        coords: [3385, 4203],
        // ⚠️ Fort espagnol sur la côte Caraïbe du Costa Rica, probablement
        // à l'embouchure du río Matina ou dans ses environs immédiats.
        // Distinct du Fort San Carlos de Austria de Pensacola.

        contexte: [
            {
                de: 1712,
                texte: `Fort espagnol sur la côte Caraïbe du Costa Rica, commandant l'accès à la vallée de Matina — la principale zone de production cacaoyère du Costa Rica colonial. La côte Caraïbe costaricaine est en 1712 l'une des frontières les plus exposées de tout l'empire espagnol en Amérique centrale : les Miskitos, alliés des Anglais de la Jamaïque, y conduisent des raids réguliers pour capturer des esclaves et piller les plantations de cacao. Le Castillo de Austria est censé barrer l'accès fluvial vers l'intérieur — mais ses effectifs sont chroniquement insuffisants et ses murs mal entretenus.
<br><br>
La vallée de Matina représente la richesse principale de la province : son cacao est exporté vers Portobelo et de là vers l'Espagne, mais aussi, par contrebande, vers les navires jamaïcains qui mouillent au large. Les raids miskitos et le commerce interlope sont les deux faces d'une même réalité : la côte Caraïbe du Costa Rica échappe en pratique au contrôle effectif de Cartago.`,
            },
        ],

        garnison: `~40 à 60 soldats — effectif chroniquement insuffisant face aux raids miskitos. Estimation d'après Fernández Guardia, <em>Historia de Costa Rica</em> (1905).`,

        note_mj: `✅ Raids miskitos sur la côte Caraïbe du Costa Rica, cacao de Matina comme enjeu : établi (Fernández Guardia, 1905 ; MacLeod, <em>Spanish Central America</em>, 1973).
✅ Commerce interlope du cacao de Matina avec les Jamaïcains : établi.
⚠️ Localisation précise du Castillo de Austria : probablement à l'embouchure du río Matina — position confirmée par les sources costariciennes mais coordonnées sur la Jaillot à vérifier.
⚠️ Garnison : estimation basse, sources fragmentaires pour 1712.`,
    },

// ── 42. ARRANGUES ────────────────────────────────────────────────────────────

    {
        id: 'arrangues',
        nom: 'Arrangues',
        type: 'ville',
        rang: '3',
        territoire: 'costa-rica',
        coords: [3305, 4366],
        // ⚠️ Déformation probable d'Aranjuez ou d'un nom local du golfe de Nicoya.
        // Identification incertaine.

        contexte: [
            {
                de: 1712,
                texte: `Village côtier du golfe de Nicoya ou de ses environs, dont le nom sur la Jaillot est une translittération approximative d'un nom local non identifié avec certitude. La région du golfe de Nicoya est parcourue par des pêcheurs, des commerçants locaux et quelques navires de cabotage qui relient les petits ports Pacifiques de l'Amérique centrale. Peu documenté pour 1712.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification incertaine — "Arrangues" non retrouvé avec certitude. Pourrait correspondre à Aranjuez (bourg de la péninsule de Nicoya), à un village du golfe de Nicoya, ou à une translittération déformée d'un nom local.`,
    },

// ── 43. CHIRIQUÍ ─────────────────────────────────────────────────────────────

    {
        id: 'chiriqui',
        nom: 'Chiriquí',
        type: 'ville',
        rang: '2',
        territoire: 'costa-rica',
        coords: [3461, 4403],
        // ⚠️ La province de Chiriquí relève du Costa Rica colonial à cette période —
        // elle sera intégrée au Panama lors de la réorganisation administrative
        // du XIXe siècle.

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de la région de Chiriquí, sur la côte Pacifique à la frontière de la province de Veragua. La plaine de Chiriquí est l'une des zones d'élevage les plus productives de l'Amérique centrale — ses troupeaux approvisionnent Panama City en viande et en cuir. La région est aussi un point de passage sur la route côtière Pacifique entre le Costa Rica et l'isthme de Panama. Le volcan Barú (4 000 m), visible depuis la côte et depuis le versant Caraïbe, domine toute la région.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Plaine de Chiriquí comme zone d'élevage productive, approvisionnant Panama City : établi.
✅ Volcan Barú dominant la région : établi.
⚠️ Population en 1712 : estimation.
⚠️ Appartenance administrative à cette période : Chiriquí dépend du gouvernement de Costa Rica ou de Veragua selon les sources — frontière administrative floue en pratique.`,
    },

// ── 44. PUEBLA (ALANJE) ──────────────────────────────────────────────────────

    {
        id: 'puebla-costa-rica',
        nom: 'Puebla (Alanje)',
        label: 'Puebla',
        type: 'ville',
        rang: '2',
        territoire: 'costa-rica',
        coords: [3524, 4365],
        // ⚠️ Côte Pacifique à l'est de Chiriquí, à la frontière avec Veragua.
        // Identification probable avec Alanje ou David, deux bourgs de la plaine
        // de Chiriquí fondés au XVIIe siècle. "Puebla" est peut-être un nom
        // générique ("la ville") plutôt qu'un nom propre.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de la plaine de Chiriquí, à la frontière entre la province de Costa Rica et celle de Veragua. Poste de passage sur la route côtière Pacifique, vivant de l'élevage et du commerce local. La position frontalière lui confère un rôle de relais administratif entre les deux provinces — un bourg modeste sans importance particulière, mais mentionné par les cartographes comme repère sur une côte peu balisée.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ Identification incertaine : "Puebla" sur la Jaillot à la frontière Chiriquí/Veragua correspond probablement à Alanje ou David (fondé sous ce nom au XVIIe siècle). "Puebla" est peut-être un nom descriptif générique plutôt qu'un nom propre de ville.
⚠️ Population : estimation.`,
    },


// ═══════════════════════════════════════════════════════════
// SÉRIE PANAMA / VERAGUA
// ═══════════════════════════════════════════════════════════

// ── 45. TRINIDAD (VERAGUA, CÔTE CARAÏBE) ─────────────────────────────────────

    {
        id: 'trinidad-veragua',
        nom: 'Trinidad',
        type: 'port',
        rang: '2',
        territoire: 'panama',
        coords: [3706, 4240],
        // ⚠️ Au nord de Santa Fe de Veraguas, côte Caraïbe de Veragua.
        // À distinguer de la Trinidad vénézuélienne et de la Trinidad nicaraguayenne.

        contexte: [
            {
                de: 1712,
                texte: `Petit port sur la côte Caraïbe de la province de Veragua, au nord de Santa Fe. La côte Caraïbe de Veragua est une des plus sauvages et des moins fréquentées de tout l'isthme — jungle dense, rivières encaissées, pas de route praticable vers l'intérieur. Trinidad est moins un port qu'un mouillage protégé accessible aux pirogues et aux petits sloops, servant de débouché maritime précaire à la province de Veragua. L'or et le cacao de l'arrière-pays y transitent avant d'embarquer vers Portobelo ou vers des navires de commerce interlope.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification probable d'après la position sur la Jaillot (nord de Santa Fe, côte Caraïbe). Peu documenté pour 1712 — la côte Caraïbe de Veragua est l'une des zones les moins couvertes par les archives coloniales espagnoles.`,
    },

// ── 46. SANTA FÉ DE VERAGUA ──────────────────────────────────────────────────

    {
        id: 'santa-fe-veragua',
        nom: 'Santa Fe de Veraguas',
        label: 'Santa Fé',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'panama',
        coords: [3668, 4299],

        contexte: [
            {
                de: 1712,
                texte: `Chef-lieu de la province de Veragua, fondé en 1559 dans les hautes terres montagneuses de l'isthme occidental. Veragua est la province que Christophe Colomb avait explorée lors de son quatrième voyage (1502–1503), convaincu d'y avoir trouvé les mines du roi Salomon — une promesse qui a hanté plusieurs générations d'aventuriers. L'or existe bien dans les rivières de Veragua, mais en quantité décevante par rapport aux espoirs initiaux.
<br><br>
Santa Fe est une ville de l'intérieur, enclavée entre deux versants — Caraïbe au nord, Pacifique au sud — sans accès maritime direct. Son économie repose sur l'extraction aurifère artisanale et l'élevage. La province est réputée difficile à gouverner : ses Indiens ngäbe résistent sporadiquement à l'autorité coloniale depuis deux siècles.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Quatrième voyage de Colomb en Veragua, 1502–1503 : établi.
✅ Fondation de Santa Fe de Veraguas en 1559 : établi.
✅ Or alluvionnaire dans les rivières de Veragua : établi — en quantité modeste, jamais à la hauteur des espoirs.
⚠️ Résistance des Ngäbe : établie sur la longue durée, épisodes précis en 1712 non documentés.
⚠️ Population : estimation.`,
    },

// ── 47. LAVELIA ──────────────────────────────────────────────────────────────

    {
        id: 'lavelia',
        nom: 'Lavelia',
        type: 'ville',
        rang: '2',
        territoire: 'panama',
        coords: [3834, 4513],
        // ⚠️ Face à Natá, côté Veragua (ouest). Identification incertaine —
        // pourrait correspondre à un bourg de la côte nord de la péninsule d'Azuero
        // ou de la province de Veragua. "Lavelia" non retrouvé avec certitude
        // dans les sources coloniales.

        contexte: [
            {
                de: 1712,
                texte: `Bourg côtier ou rural de la province de Veragua, face à Natá sur la côte Pacifique de l'isthme central. La région entre Veragua et Panama City est une zone d'élevage et de petite agriculture, traversée par la route terrestre qui relie les deux provinces. Peu documenté pour 1712.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ "Lavelia" non identifié avec certitude dans les sources coloniales. Position sur la Jaillot (face à Natá, côté Veragua) suggère un bourg de la côte Pacifique de l'isthme central. Entrée conservée pour la cohérence cartographique.`,
    },

// ── 48. VENTA DE CRUCES ───────────────────────────────────────────────────────
// NOTE : "ChagreChat~" sur la Jaillot = "Chagre Château" = Fort San Lorenzo
// (déjà documenté dans villes-data.js). "Venta de Cruzes" apparaît séparément
// plus en amont sur le río Chagres — identification sans ambiguïté.

    {
        id: 'venta-de-cruzes',
        nom: 'Venta de Cruces',
        label: 'Venta de Cruzes',
        type: 'ville',
        rang: '2',
        territoire: 'panama',
        coords: [4011, 4330],

        contexte: [
            {
                de: 1712,
                texte: `Relais fluvial sur le río Chagres, à mi-chemin entre l'embouchure (Fort San Lorenzo) et Panama City. C'est ici que s'effectue le transbordement obligatoire : les marchandises descendant vers la côte Caraïbe passent de la pirogue au sloop à Venta de Cruces ; celles montant vers le Pacifique passent de la pirogue aux mules du <em>Camino Real</em>. Ce nœud logistique est fréquenté en permanence — négociants, soldats, esclaves porteurs, mules chargées d'argent ou de marchandises.
<br><br>
C'est par Venta de Cruces que transitait l'argent péruvien lors du sac de Morgan en 1671 — et c'est en remontant le Chagres depuis San Lorenzo que ses hommes sont arrivés jusqu'ici avant de traverser l'isthme à pied jusqu'à Panama City.`,
            },
        ],

        population: `~500 habitants permanents ; plusieurs milliers en transit lors des grandes foires`,

        note_mj: `✅ Venta de Cruces comme point de transbordement sur le Chagres : établi (Earle, <em>The Sack of Panama</em>, 1981).
✅ Passage de Morgan en 1671 : établi.
⚠️ Identification de "Chagrechat" avec Venta de Cruces : probable d'après la position sur le Chagres — la déformation du nom est cohérente avec les pratiques cartographiques de l'époque.`,
    },

// ── 49. CAPIRA ───────────────────────────────────────────────────────────────

    {
        id: 'capira',
        nom: 'Capira',
        label: 'P. de Capira',
        type: 'ville',
        rang: '2',
        territoire: 'panama',
        coords: [3938, 4353],

        contexte: [
            {
                de: 1712,
                texte: `Étape sur le <em>Camino Real</em> entre Panama City et Portobelo, dans les collines de l'isthme central. Capira est un bourg de transit — ses habitants vivent de la location de mules, de l'hébergement des voyageurs et du ravitaillement des convois. La route du Camino Real est la colonne vertébrale de l'isthme : tout l'argent péruvien et toutes les marchandises traversant l'isthme depuis le Pacifique vers la côte Caraïbe passent par ici, sous escorte militaire lors des grandes foires. Entre les foires, le bourg retombe dans sa somnolence habituelle.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `✅ Capira sur le Camino Real Panama–Portobelo : établi.
✅ Rôle de relais pour les convois d'argent : établi (Lane, <em>Pillaging the Empire</em>, 1998).
⚠️ Population : estimation.`,
    },

// ── 50. NATÁ DE LOS CABALLEROS ───────────────────────────────────────────────

    {
        id: 'nata',
        nom: 'Natá de los Caballeros',
        label: 'Nata',
        type: 'ville',
        rang: '2',
        territoire: 'panama',
        coords: [3899, 4503],

        contexte: [
            {
                de: 1712,
                texte: `L'une des plus anciennes villes d'Amérique continentale, fondée en 1522 sur la côte Pacifique de l'isthme central — dix ans avant Mexico, un an avant Cartago. Natá de los Caballeros doit son surnom à la cavalerie espagnole qui a participé à sa fondation. En 1712, c'est une ville de propriétaires terriens créoles, vivant de l'élevage extensif dans les savanes de Coclé. Éloignée des grandes routes commerciales de l'isthme (le Camino Real passe plus au nord), Natá mène une existence provinciale et tranquille.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Fondation en 1522 — l'une des premières villes d'Amérique continentale : établi.
✅ Élevage dans les savanes de Coclé : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 51. NOMBRE DE DIOS ───────────────────────────────────────────────────────

    {
        id: 'nombre-de-dios',
        nom: 'Nombre de Dios',
        type: 'site_hist',
        rang: '2',
        territoire: 'panama',
        coords: [4099, 4229],

        contexte: [
            {
                de: 1712,
                texte: `Site de l'ancien premier port de l'isthme, fondé en 1510 par Diego de Nicuesa — le premier établissement européen permanent sur le continent américain, avant même Panama City. Pendant près d'un siècle, Nombre de Dios a été le terminus caraïbe du Camino Real et le point de départ des flottes vers Carthagène et Cadix. Sir Francis Drake l'a attaqué en 1572 et en 1596 — lors de cette dernière expédition, il y est mort de dysenterie et a été immergé dans le lagon en cercueil de plomb.
<br><br>
En 1597, Madrid a déplacé le port vers Portobelo, mieux défendable. En 1712, Nombre de Dios est quasi-abandonnée — quelques cases de pêcheurs sur les ruines d'un empire. La jungle a repris ses droits sur les entrepôts et les fortifications. Les cartographes continuent de la marquer par tradition, mais il n'y a plus rien à voir.`,
            },
        ],

        population: `Quelques dizaines d'habitants — pêcheurs`,

        note_mj: `✅ Fondation 1510 par Diego de Nicuesa : établi.
✅ Premier port Caraïbe de l'isthme, terminus du Camino Real : établi.
✅ Raids de Drake en 1572 et 1596 : établis.
✅ Mort de Drake dans la baie de Portobelo (pas à Nombre de Dios) en janvier 1596 : ✅ établi — enterrement en mer dans un cercueil de plomb au large de Portobelo.
✅ Abandon au profit de Portobelo en 1597 : établi.
⚠️ État exact en 1712 : quasi-abandon confirmé, détails sur les résidents résiduels non documentés.
🎲 Un PJ qui cherche le cercueil de plomb de Drake dans la baie de Portobelo — et non à Nombre de Dios — suit la bonne piste.`,
    },


// ═══════════════════════════════════════════════════════════
// SÉRIE DARIÉN
// ═══════════════════════════════════════════════════════════

// ── 52. BOCAS DEL TORO / CONCEPCIÓN ──────────────────────────────────────────

    {
        id: 'concepcion-bocas',
        nom: 'Concepción (Bocas del Toro)',
        label: 'Conception',
        type: 'port',
        rang: '2',
        territoire: 'panama',
        coords: [3647, 4231],
        // ⚠️ Au fond de la "Bocca del Toro" sur la Jaillot, face à l'Escuada de Veragua.
        // Correspond à la zone de l'archipel de Bocas del Toro (côte Caraïbe du Panama
        // occidental actuel). "Concepción" est un poste espagnol documenté dans cette zone.

        contexte: [
            {
                de: 1712,
                texte: `Poste espagnol au fond de la baie de Bocas del Toro, sur la côte Caraïbe de la province de Veragua. La baie est fermée à l'est par l'archipel de l'Escudo de Veraguas — un chapelet d'îlots et de récifs que les cartographes représentent comme un atoll. Ces eaux peu profondes et labyrinthiques sont difficiles pour les grands navires mais parfaitement adaptées aux pirogues et aux sloops légers.
<br><br>
Concepción est moins une ville qu'un relais : quelques maisons, un débarcadère, et la présence nominale de l'autorité espagnole sur une côte que personne ne contrôle vraiment. Les Indiens ngäbe et les Miskitos circulent librement dans ces eaux ; les navires jamaïcains y font escale pour le cacao et les écailles de tortue. L'Escudo de Veraguas, visible depuis la côte, sert de repère de navigation pour tous les marins de la côte Caraïbe occidentale.`,
            },
        ],

        population: `Quelques dizaines d'habitants permanents`,

        note_mj: `✅ Bocas del Toro et Escudo de Veraguas : identifiables sur les cartes historiques.
✅ Présence espagnole nominale, fréquentation par les Ngäbe et les Jamaïcains : cohérent avec les sources sur la côte Caraïbe de Veragua.
⚠️ "Concepción" comme poste espagnol : probable, non confirmé par source primaire directe pour 1712 spécifiquement.`,
    },

// ── 53. SAINT-SÉBASTIEN DE BONNE-VUE ─────────────────────────────────────────

    {
        id: 'saint-sebastien-darien',
        nom: 'San Sebastián de Buena Vista',
        label: 'St Sebastian de Bona Vista',
        type: 'fort',
        rang: '2',
        territoire: 'panama',
        coords: [4465, 4424],
        // ⚠️ Poste espagnol dans la région du Darién / golfe d'Urabá.
        // Le Darién est en 1712 le théâtre récent de la tentative d'implantation
        // écossaise (1698–1700) et d'une présence anglaise et française intermittente.

        contexte: [
            {
                de: 1712,
                texte: `Fort ou poste espagnol dans la région du Darién, sur la côte Caraïbe entre Portobelo et le golfe d'Urabá. Le Darién est en 1712 une zone de mémoire douloureuse pour les Espagnols : c'est ici que la Compagnie d'Écosse a tenté d'établir la colonie de Caledonia entre 1698 et 1700 — une expédition qui s'est soldée par un désastre humain et une humiliation politique, mais qui a démontré la vulnérabilité de cette côte. Madrid a depuis renforcé la vigilance dans la région, sans pour autant disposer des moyens de la contrôler vraiment.
<br><br>
Les Kunas (Cunas) de l'intérieur résistent à la colonisation espagnole depuis deux siècles — leur connaissance du terrain en fait des adversaires redoutables dans la jungle darienite.`,
            },
        ],

        garnison: `Quelques dizaines de soldats — estimation par analogie avec les petits postes du Darién.`,

        note_mj: `✅ Tentative écossaise de Darien (Caledonia), 1698–1700 : établi — désastre humain (~2 000 morts) et financier pour l'Écosse.
✅ Résistance des Kunas dans le Darién : établi sur la longue durée.
⚠️ "San Sebastián de Buena Vista" : poste espagnol probable dans la région, identification précise incertaine — plusieurs forts espagnols ont existé dans cette zone au cours du XVIIe–XVIIIe siècle.`,
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

];
