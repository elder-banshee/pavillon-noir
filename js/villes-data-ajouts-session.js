// ═══════════════════════════════════════════════════════════
// ENTRÉES PRÉPARÉES — Session du 2025-06-04
// Fichier intermédiaire — À relire avant insertion dans villes-data.js
//
// Conventions note_mj : ✅ établi · ⚠️ incertain/estimé · 🎲 fiction de campagne
// Coordonnées : toutes à null — à renseigner sur la carte
// Types : 'port' · 'ville' · 'fort' · 'site' (nouveau — lieux sans établissement permanent)
// ═══════════════════════════════════════════════════════════

const VILLES_AJOUTS = [

// ── 1. PENSACOLA ─────────────────────────────────────────────────────────────

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


// ── 2. MEXICO ─────────────────────────────────────────────────────────────────

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

// ── 3. PUEBLA ─────────────────────────────────────────────────────────────────

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

// ── 4. JALAPA ────────────────────────────────────────────────────────────────

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

// ── 5. OAXACA / ANTEQUERA ──────────────────────────────────────────────────── !!!

    {
        id: 'guaxaca',
        nom: 'Antequera (Oaxaca)',
        label: 'Antequera',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-espagne',
        coords: [1154, 2738],

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


// ── 6. ACAPULCO ──────────────────────────────────────────────────────────────

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

// ── 7. LA ANTIGUA (VILLA RICA) ───────────────────────────────────────────────

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

// ── 8. VILLAHERMOSA ──────────────────────────────────────────────────────────

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

// ── 9. LAGUNA DE TÉRMINOS ────────────────────────────────────────────────────

    {
        id: 'laguna-de-terminos',
        nom: 'Laguna de Términos',
        type: 'site',
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


// ── 10. CIUDAD REAL (CHIAPAS) ─────────────────────────────────────────────────

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

// ── 11. COBÁN (VERA PAZ) ─────────────────────────────────────────────────────

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

// ── 12. VALLADOLID (MICHOACÁN) ───────────────────────────────────────────────

    {
        id: 'villadolid',
        nom: 'Valladolid (Michoacán)',
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

// ═══════════════════════════════════════════════════════════
// SÉRIE GUATEMALA
// ═══════════════════════════════════════════════════════════

// ── 13. TOCOTALPA ────────────────────────────────────────────────────────────

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

// ── 14. SOCONUSCO (VILLE) ────────────────────────────────────────────────────

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

// ── 15. SANTIAGO DE GUATEMALA ────────────────────────────────────────────────

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


// ── 16. SAN SALVADOR ─────────────────────────────────────────────────────────

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

// ── 17. LA TRINIDAD (EMBOUCHURE) ─────────────────────────────────────────────

    {
        id: 'la-trinidad',
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

// ── 18. SAN MIGUEL ───────────────────────────────────────────────────────────

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

// ── 19. AMAPALA (GOLFE DE FONSECA) ───────────────────────────────────────────

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

// ── 20. CHOLUTECA (XERES) ────────────────────────────────────────────────────

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


// ── SUPPRIMÉ : la-trinidad (San Salvador suffit) ─────────────────────────────

// ═══════════════════════════════════════════════════════════
// SÉRIE YUCATÁN
// ═══════════════════════════════════════════════════════════

// ── 21. LINCHANCHY ───────────────────────────────────────────────────────────

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

// ── 22. CONIL ────────────────────────────────────────────────────────────────

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

// ── 23. VALLADOLID (YUCATÁN) ─────────────────────────────────────────────────

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

// ── 24. SALAMANCA DE BACALAR ─────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════
// SÉRIE HONDURAS
// ═══════════════════════════════════════════════════════════

// ── 25. AMALIGUA ─────────────────────────────────────────────────────────────

    {
        id: 'amaligua',
        nom: 'Amaligua',
        type: 'ville',
        rang: '2',
        territoire: 'honduras',
        coords: [2251, 3219],

        contexte: [
            {
                de: 1712,
                texte: `Village côtier ou fluvial de la côte Caraïbe hondurienne, dont le nom sur la Jaillot est une translittération approximative d'un nom lenca ou misumalpan. La côte hondurienne entre le cap Gracias a Dios et Trujillo est en 1712 une zone peu contrôlée par les Espagnols — quelques missions isolées, des villages indiens, et une présence anglaise de plus en plus affirmée depuis la Jamaïque et la côte Miskito.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification incertaine — toponyme non retrouvé avec certitude dans les sources coloniales honduriennes. Pourrait correspondre à un village aujourd'hui disparu ou connu sous un nom différent.`,
    },


// ── 26. PORTA DOMAS (PUERTO CABALLOS ?) ──────────────────────────────────────

    {
        id: 'porta-domos',
        nom: 'Porta Domos',
        label: 'Porta Domos',
        type: 'port',
        rang: '2',
        territoire: 'honduras',
        coords: [2316, 3270],
        // ⚠️ Identification probable : Puerto Caballos (aujourd'hui Puerto Cortés),
        // principal port Caraïbe du Honduras colonial, situé en amont du cap Tres Puntas.
        // La phonétique "Porta Domas" ne correspond pas exactement — incertitude maintenue.

        contexte: [
            {
                de: 1712,
                texte: `Port de la côte Caraïbe hondurienne, en amont du cap Tres Puntas. S'il s'agit bien de Puerto Caballos — identification probable mais non certaine — c'est le principal débouché maritime du Honduras colonial : indigo de San Salvador, bois précieux de l'arrière-pays, et quelques produits miniers descendent vers ce port avant d'embarquer pour l'Espagne via La Havane. Le port est modeste et ses défenses légères — suffisantes pour décourager un raid de routine, insuffisantes face à une attaque organisée.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `⚠️ Identification de "Porta Domas" avec Puerto Caballos : probable d'après la position sur la Jaillot (en amont du cap Tres Puntas), mais la phonétique ne correspond pas — incertitude maintenue.
✅ Puerto Caballos comme principal port Caraïbe du Honduras colonial : établi si l'identification est correcte.`,
    },

// ── 27. PORTA DE SAL ─────────────────────────────────────────────────────────

    {
        id: 'porta-de-sal',
        nom: 'Porta de Sal',
        type: 'port',
        rang: '2',
        territoire: 'honduras',
        coords: [2478, 3296],
        // ⚠️ À l'embouchure du "Sal River" sur la Jaillot — probablement
        // le río Ulúa ou le río Chamelecón, côte nord hondurienne.

        contexte: [
            {
                de: 1712,
                texte: `Petit poste portuaire à l'embouchure du río Sal sur la côte Caraïbe hondurienne — un mouillage de fortune plutôt qu'un vrai port, utilisé par les pirogues locales et les sloops de commerce interlope. Le "Sal River" tire son nom des salines côtières, ressource modeste mais utile pour la conservation du poisson et des viandes.`,
            },
        ],

        population: `Quelques dizaines d'habitants`,

        note_mj: `⚠️ Identification incertaine — "Sal River" non retrouvé avec certitude. Pourrait correspondre au río Ulúa, au río Chamelecón, ou à un cours d'eau mineur de la côte nord hondurienne. Aucune source primaire directe.`,
    },

// ── 28. COMAYAGUA ────────────────────────────────────────────────────────────

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

// ── 29. SAINT-GEORGES (RÍO AGUÁN) ────────────────────────────────────────────

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

// ── 30. SAN JORGE DE OLANCHO ─────────────────────────────────────────────────

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

// ── 31. NUEVA SEGOVIA ────────────────────────────────────────────────────────

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


// ═══════════════════════════════════════════════════════════
// SÉRIE NICARAGUA
// ═══════════════════════════════════════════════════════════

// ── 32. LEÓN ─────────────────────────────────────────────────────────────────

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

// ── 33. NICARAGUA (VILLE) ─────────────────────────────────────────────────────

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

// ── 34. MOMBACHO ─────────────────────────────────────────────────────────────

    {
        id: 'mombacho',
        nom: 'Volcan Mombacho',
        label: 'Monbache',
        type: 'site',
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

// ── 35. LA TRINIDAD (NICARAGUA) ──────────────────────────────────────────────

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

// ── 36. MENA ─────────────────────────────────────────────────────────────────

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

// ── 37. CASTILLO DE LA INMACULADA (EL CASTILLO) ──────────────────────────────

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

// ── 38. VILLE AU CONFLUENT SAN JUAN / RÍO FRÍO ───────────────────────────────

    {
        id: 'confluent-san-juan-frio',
        nom: 'Confluent du San Juan',
        type: 'site',
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

// ── 39. GRACIAS A DIOS (NICARAGUA) ───────────────────────────────────────────

    {
        id: 'gratates-iuo-dedios-nicaragua',
        nom: 'Gracias a Dios (Nicaragua)',
        label: 'Gra. a Dios',
        type: 'ville',
        rang: '2',
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
        rang: '2',
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
        type: 'site',
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

// ── 54. SANTA MARÍA LA ANTIGUA DEL DARIÉN ────────────────────────────────────

    {
        id: 'santa-maria-darien',
        nom: 'Santa María la Antigua del Darién',
        label: 'Santa Maria',
        type: 'site',
        rang: '2',
        territoire: 'panama',
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

// ═══════════════════════════════════════════════════════════
// FIN DU FICHIER INTERMÉDIAIRE — Session du 2025-06-04
// Total : 54 entrées nouvelles + 1 correction dans villes-data.js
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SÉRIE NOUVELLE-GRENADE
// ═══════════════════════════════════════════════════════════

// ── 55. TOLÚ ─────────────────────────────────────────────────────────────────

    {
        id: 'telu',
        nom: 'Tolú',
        label: 'Telu',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4667, 4275],

        contexte: [
            {
                de: 1712,
                texte: `Port modeste sur le golfe de Morrosquillo, côte Caraïbe de la Nouvelle-Grenade, à l'ouest de Carthagène. Tolú exporte bois précieux, résines et quelques produits locaux vers Carthagène et l'Espagne. La ville est connue pour le <em>bálsamo de Tolú</em> — une résine aromatique tirée d'un arbre local (<em>Myroxylon balsamum</em>), utilisée en pharmacopée européenne comme expectorant et cicatrisant, exportée vers l'Espagne et de là vers toute l'Europe. Une des rares spécialités médicales du Nouveau Monde reconnues par la médecine académique européenne.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `✅ Bálsamo de Tolú comme export pharmaceutique reconnu en Europe : établi (Monardes, <em>Historia Medicinal</em>, 1565 ; pharmacopées européennes du XVIIe–XVIIIe s.).
⚠️ Population en 1712 : estimation.`,
    },

// ── 56. ANTIOQUIA ────────────────────────────────────────────────────────────

    {
        id: 'antiochia',
        nom: 'Santa Fe de Antioquia',
        label: 'Antiochia',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4756, 4570],

        contexte: [
            {
                de: 1712,
                texte: `Ancienne capitale de la province d'Antioquia, dans les vallées du río Cauca et de ses affluents. Fondée en 1541, Santa Fe de Antioquia est le centre d'une des régions aurifères les plus riches de la Nouvelle-Grenade — l'or d'Antioquia est extrait par des esclaves africains dans les placers des rivières, puis acheminé vers Carthagène avant d'embarquer pour Cadix. La ville est une cité de mineurs créoles et de négociants, dominée par ses couvents et par les maisons des grandes familles qui contrôlent les concessions minières.`,
            },
        ],

        population: `~5 000 habitants`,

        note_mj: `✅ Or d'Antioquia comme richesse principale, placers exploités par des esclaves africains : établi (McFarlane, <em>Colombia before Independence</em>, 1993).
✅ Fondation 1541 : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 57. SANTA FÉ DE ANTIOQUIA (PROVINCE) ─────────────────────────────────────
// Note : "Santa Fé" en colonne 1 entre Tolú et Antioquia correspond à
// Santa Fe de Antioquia elle-même — c'est la même ville que l'entrée 56.
// La Jaillot la mentionne deux fois ou la place légèrement différemment.
// → Pas d'entrée séparée, mention dans note_mj de 'antioquia'.

// ── 58. SINÚ / SAINT-MARIE ───────────────────────────────────────────────────

    {
        id: 'st-Maria-sinu',
        nom: 'Sinú (Saint-Marie)',
        label: 'Cenu / St Maria',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4847, 4330],
        // ⚠️ "Cenu" désigne la région du río Sinú et la nation zenú (sinú) ;
        // "St Maria" sur un affluent du Magdalena à mi-chemin Tolú–Tamalameque
        // correspond à un bourg fluvial du Sinú moyen, probablement Ayapel
        // ou un établissement voisin. Regroupé en une entrée de zone.

        contexte: [
            {
                de: 1712,
                texte: `La région du río Sinú et de ses affluents, entre la côte Caraïbe et le bas Magdalena. Les Zenús (Cenús) sont une nation indigène dont les orfèvres préhispaniques produisaient les plus belles pièces en or tumbaga de toute la Colombie — leurs tombes ont été pillées par les Espagnols depuis le XVIe siècle, alimentant la légende d'El Dorado. En 1712, la région est peu colonisée : quelques missions franciscaines, des bourgades fluviales modestes vivant de pêche, d'élevage et d'un commerce de bois et de résines vers Carthagène.`,
            },
        ],

        population: `Population dispersée — quelques milliers d'Indiens zenús et de colons sur l'ensemble de la région`,

        note_mj: `✅ Orfèvrerie zenú préhispanique, pillage des tombes depuis le XVIe siècle : établi.
⚠️ "St Maria" sur la Jaillot : bourg fluvial du Sinú moyen, identification précise incertaine — Ayapel est la candidate la plus probable mais non confirmée.
⚠️ Regroupement "Cenu" et "St Maria" en une entrée de zone : choix éditorial justifié par la proximité géographique et le faible niveau de documentation pour chacun séparément.`,
    },

// ── 59. BARRANCAS DE MALAMBO ─────────────────────────────────────────────────

    {
        id: 'baranca-de-malambo',
        nom: 'Barrancas de Malambo',
        label: 'Baranca de Malambo',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4996, 4025],

        contexte: [
            {
                de: 1712,
                texte: `Poste fluvial sur le río Magdalena, à quelques lieues en amont de son embouchure dans la mer des Caraïbes. Barrancas de Malambo est le premier relais de la navigation remontant le Magdalena depuis la côte — le point où les marchandises débarquées à Carthagène commencent leur long voyage vers l'intérieur du continent. Le fleuve est ici large et lent, navigable par des chaloupes et des pirogues à fond plat chargées de marchandises.`,
            },
        ],

        population: `~1 000 habitants`,

        note_mj: `✅ Position à l'entrée de la navigation fluviale du Magdalena : établie géographiquement.
⚠️ Population en 1712 : estimation.`,
    },

// ── 60. TENERIFE ─────────────────────────────────────────────────────────────

    {
        id: 'tenerifa-magdalena',
        nom: 'Tenerife',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4943, 4254],

        contexte: [
            {
                de: 1712,
                texte: `Bourg sur la rive du río Magdalena, étape de la navigation fluviale entre la côte Caraïbe et Mompox. Fondé au XVIe siècle, Tenerife est un point de relais pour les pirogues et les chaloupes qui remontent le fleuve chargées de marchandises européennes ou qui le descendent avec l'or, le tabac et les cuirs de l'intérieur. La vie du bourg est rythmée par les crues saisonnières du Magdalena, qui peuvent isoler ou inonder les rives basses pendant des semaines.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `✅ Tenerife comme étape fluviale sur le Magdalena : établi géographiquement.
⚠️ Population en 1712 : estimation.`,
    },


// ── 61. MOMPOX ───────────────────────────────────────────────────────────────

    {
        id: 'mopox',
        nom: 'Mompox (Santa Cruz de Mompox)',
        label: 'Mopox',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4970, 4356],

        contexte: [
            {
                de: 1712,
                texte: `Ville fluviale sur un bras secondaire du río Magdalena, plaque tournante du commerce intérieur entre Carthagène et le cœur du Nuevo Reino de Granada. Fondée en 1537, Mompox est la ville la plus prospère du Magdalena moyen : ses marchands contrôlent le transit des marchandises entre la côte et l'intérieur, et ses orfèvres — héritiers d'une tradition qui remonte aux Zenús préhispaniques — produisent une filigrane en or réputée dans tout l'empire espagnol.
<br><br>
Tous les convois d'or descendant d'Antioquia vers Carthagène passent par Mompox ; toutes les marchandises européennes montant vers Bogotá y transitent. La ville est riche, marchande et relativement autonome — ses élites créoles négocient avec les autorités de Carthagène et de Bogotá d'égal à égal. Les crues du Magdalena, qui durent plusieurs mois par an, transforment ses rues en canaux navigables et isolent la ville du monde terrestre.`,
            },
        ],

        population: `~8 000 habitants`,

        note_mj: `✅ Fondation 1537, rôle de plaque tournante commerciale sur le Magdalena : établi (McFarlane, <em>Colombia before Independence</em>, 1993).
✅ Filigrane de Mompox, orfèvrerie réputée : établi.
✅ Crues saisonnières du Magdalena inondant la ville : établi — caractéristique géographique permanente.
⚠️ Population en 1712 : estimation.`,
    },

// ── 62. TAMALAMEQUE ──────────────────────────────────────────────────────────

    {
        id: 'tamalameque',
        nom: 'Tamalameque',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5006, 4370],

        contexte: [
            {
                de: 1712,
                texte: `Bourg sur le río Magdalena, en amont de Mompox, à la jonction des routes fluviales vers l'intérieur du continent. Tamalameque est une étape sur la voie d'eau qui remonte vers Bogotá et vers les provinces andines — un poste de relais où les pirogues chargent vivres et eau douce avant d'affronter les rapides de la partie supérieure du fleuve. La région est connue pour la pêche et pour le tabac des rives du Magdalena.`,
            },
        ],

        population: `~1 500 habitants`,

        note_mj: `✅ Tamalameque comme étape fluviale sur le Magdalena moyen : établi géographiquement.
⚠️ Population en 1712 : estimation.`,
    },

// ── 63. APUERTO / EL DESEMBARCADERO / PLASENCIA / TRINIDAD (MAGDALENA) ───────
// Ces quatre toponymes de la colonne 3 désignent des relais fluvials modestes
// sur le Magdalena moyen-supérieur, peu ou pas documentés individuellement.
// Regroupés en une note de zone plutôt qu'en entrées séparées.
// → Si la carte les place clairement à des positions distinctes et espacées,
//    des entrées minimales pourront être créées à l'occasion.

// ── 64. SANTA MARTA ──────────────────────────────────────────────────────────

    {
        id: 'santa-marthe',
        nom: 'Santa Marta',
        label: 'Santa Marthe',
        capitale: true,
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [4163, 3960],

        contexte: [
            {
                de: 1712,
                texte: `Premier établissement permanent espagnol sur le continent sud-américain, fondé en 1525 — avant Carthagène, avant Lima, avant Bogotá. Santa Marta n'a jamais dépassé Carthagène dans la hiérarchie commerciale de la côte Caraïbe : son port est moins bien abrité, son arrière-pays moins accessible, et les autorités de Madrid ont systématiquement favorisé Carthagène pour les grands convois. En 1712, Santa Marta est une ville de second rang — chef-lieu d'une province côtière vivant d'un commerce de bois, de coton et de tabac, et d'une contrebande structurelle avec les navires anglais et hollandais.
<br><br>
La Sierra Nevada de Santa Marta, visible depuis la mer à grande distance, est le plus haut massif côtier du monde — ses sommets enneigés à 5 700 mètres dominent une côte tropicale. Les Arhuacos et les Kogis qui habitent ses versants ont résisté à toute colonisation durable.`,
            },
        ],

        population: `~5 000 habitants`,

        note_mj: `✅ Fondation 1525 — premier établissement permanent sur le continent sud-américain : établi.
✅ Sierra Nevada de Santa Marta — plus haut massif côtier du monde : établi.
✅ Commerce interlope avec navires anglais et hollandais : cohérent avec les pratiques documentées sur la côte néogrenadine.
⚠️ Population en 1712 : estimation.`,
    },

// ── 65. VALLEDUPAR (CIUDAD DE LOS REYES) ─────────────────────────────────────

    {
        id: 'ciuidad-de-los-reyes',
        nom: 'Valledupar (Ciudad de los Reyes)',
        label: 'Ciudad de los Reyes',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5390, 4173],
        // ⚠️ Fondée en 1550 sous le nom complet de "Ciudad de los Reyes de Valledupar".
        // Au confluent du río César et d'un affluent, entre la Sierra Nevada de Santa Marta
        // et la Guajira. À ne pas confondre avec Ciudad de los Reyes = Lima (Pérou).

        contexte: [
            {
                de: 1712,
                texte: `Ville fondée en 1550 dans la vallée du río César, entre la Sierra Nevada de Santa Marta et la Guajira. Son nom complet — Ciudad de los Reyes de Valledupar — la distingue de Lima (aussi fondée sous le nom de Ciudad de los Reyes). Valledupar est le centre administratif d'une région d'élevage extensif et de quelques mines d'or alluvionnaire. La ville est un poste avancé face aux Wayuus de la Guajira — nation indigène qui n'a jamais été véritablement soumise à l'autorité espagnole et qui contrôle de facto la péninsule entière.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1550 sous le nom "Ciudad de los Reyes de Valledupar" : établi.
✅ Distinction avec Lima (Ciudad de los Reyes du Pérou) : établi — même nom officiel, deux villes distinctes.
✅ Résistance des Wayuus de la Guajira à la colonisation espagnole : établi sur la longue durée.
⚠️ Population en 1712 : estimation.`,
    },

// ── 66. OCAÑA ────────────────────────────────────────────────────────────────

    {
        id: 'ocana',
        nom: 'Ocaña',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5244, 4568],

        contexte: [
            {
                de: 1712,
                texte: `Ville coloniale sur les contreforts andins de la Nouvelle-Grenade, sur la route entre Santa Marta et Bogotá. Fondée en 1570, Ocaña contrôle un col stratégique entre la vallée du Magdalena et les plaines côtières du nord. La ville vit de l'agriculture andine — blé, élevage — et d'un commerce de transit entre la côte Caraïbe et l'intérieur du Nuevo Reino. Son nom reviendra dans l'histoire : c'est à Ocaña que Simón Bolívar tentera en 1828 de faire adopter une nouvelle constitution pour la Grande Colombie.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1570, position sur la route Santa Marta–Bogotá : établi.
⚠️ Population en 1712 : estimation.`,
    },


// ── 67. VÉLEZ ────────────────────────────────────────────────────────────────

    {
        id: 'velez-colombia',
        nom: 'Vélez',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5361, 4896],

        contexte: [
            {
                de: 1712,
                texte: `Ville coloniale de la province de Santander, fondée en 1539 dans un paysage de collines tempérées entre le Magdalena et les Andes orientales. Vélez est l'une des plus anciennes villes de la Nouvelle-Grenade — elle précède Bogotá d'un an. Sa situation sur la route entre Mompox et Bogotá en fait une étape commerciale modeste mais régulière. La région produit du tabac, du coton et de la cire — des marchandises qui descendent vers Mompox et Carthagène.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1539 — une des plus anciennes villes de Nouvelle-Grenade : établi.
⚠️ Population en 1712 : estimation.`,
    },

// ── 68. SANTA FÉ DE BOGOTÁ ───────────────────────────────────────────────────

    {
        id: 'bogota',
        nom: 'Santafé de Bogotá',
        label: 'Santa Fé de Bogota',
        capitale: true,
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5364, 5083],

        contexte: [
            {
                de: 1712,
                texte: `Capitale du Nuevo Reino de Granada, fondée en 1538 par Gonzalo Jiménez de Quesada sur le plateau de la Sabana de Bogotá, à 2 600 mètres d'altitude. Santafé est le siège de la Real Audiencia de Santa Fe — instance judiciaire et administrative qui gouverne un territoire immense s'étendant de la côte Caraïbe aux llanos de l'Orénoque. La ville est froide, brumeuse, ecclésiastique — une capitale de lettrés et de juristes, à cinq semaines de marche de Carthagène par le Magdalena.
<br><br>
Son éloignement des côtes la préserve de la piraterie directe, mais les décisions prises dans ses palais déterminent les flux commerciaux, les politiques fiscales et les garnisons de tout le littoral Caraïbe de la Nouvelle-Grenade. L'or d'Antioquia, les émeraudes de Muzo, le tabac des vallées andines — tout est taxé, enregistré et redistribué depuis Santafé.
<br><br>
En 1717–1723, Santafé devient brièvement la capitale d'une vice-royauté propre — la vice-royauté de Nouvelle-Grenade, éphémère tentative de Madrid de mieux contrôler le nord de l'Amérique du Sud. Supprimée en 1723, elle ne sera rétablie qu'en 1739.`,
            },
        ],

        population: `~20 000 habitants`,

        note_mj: `✅ Fondation 1538 par Jiménez de Quesada : établi.
✅ Siège de la Real Audiencia de Santa Fe : établi.
✅ Vice-royauté de Nouvelle-Grenade 1717–1723, supprimée, rétablie 1739 : établi — voir aussi carte-data.js (nouvelle-grenade) et entrée panama-city (correction note_mj).
✅ Émeraudes de Muzo, or d'Antioquia : établis.
⚠️ Population en 1712 : estimation.`,
    },

// ── 69. RIOHACHA (RÍO DE LA HACHA) ───────────────────────────────────────────

    {
        id: 'riohacha',
        nom: 'Riohacha (Río de la Hacha)',
        label: 'R de la Hacha',
        type: 'port',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5482, 3926],

        contexte: [
            {
                de: 1712,
                texte: `Port sur la côte de la Guajira, à l'embouchure du río Ranchería. Riohacha est le centre du commerce des perles de la côte — les bancs d'huîtres perlières du golfe de Venezuela alimentent depuis le XVIe siècle un trafic que les autorités espagnoles tentent de réguler sans grand succès. La ville est aussi un nœud de la contrebande : les Wayuus de la Guajira vendent leurs perles directement aux navires hollandais et anglais sans passer par les douanes espagnoles.
<br><br>
Drake a attaqué Riohacha en 1568 et 1572 pour ses perles. En 1712, la ville reste exposée — peu fortifiée, gouvernée par une garnison insuffisante, à la merci de tout navire de guerre qui se présenterait devant la rade.`,
            },
        ],

        population: `~3 000 habitants`,

        note_mj: `✅ Commerce des perles, bancs d'huîtres perlières : établi.
✅ Contrebande des Wayuus avec navires hollandais et anglais : établi (Klooster, <em>Illicit Riches</em>, 1998).
✅ Raids de Drake en 1568 et 1572 : établis.
⚠️ Population en 1712 : estimation.
La Ranchería (colonne 5) désigne la zone de pêche aux perles au large — pas un établissement séparé. Regroupé avec Riohacha.`,
    },

// ── 70. LA RAMADA ────────────────────────────────────────────────────────────

    {
        id: 'la-ramada',
        nom: 'La Ramada',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5452, 3958],

        contexte: [
            {
                de: 1712,
                texte: `Bourg côtier entre Riohacha et Santa Marta, sur la côte de la Guajira occidentale. La Ramada est mentionnée dans les sources cartographiques et les chroniques de pirates comme escale sur la côte entre les deux villes principales. La région est dominée par les Wayuus — la présence espagnole y est nominale, et les navires étrangers qui longent la côte font souvent escale dans les anses sans rencontrer d'autorité coloniale.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ La Ramada : peu documenté pour 1712. Existence attestée sur les cartes, détails incertains.`,
    },

// ── 71. GUATAPORI ────────────────────────────────────────────────────────────

    {
        id: 'guatapori',
        nom: 'Guatapori',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5574, 4024],
        // ⚠️ Probablement un bourg ou mission de l'intérieur de la Guajira,
        // sur un affluent du río Ranchería ou du río César. Non identifié
        // avec certitude dans les sources coloniales.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de l'intérieur de la Guajira ou de la dépression du César, dont le nom sur la Jaillot est une translittération approximative d'un nom wayuu ou local. La région est une zone de contact entre l'autorité espagnole de Riohacha et l'espace autonome des Wayuus — des missions sporadiques ont tenté de s'implanter ici sans succès durable.`,
            },
        ],

        population: `Quelques centaines d'habitants`,

        note_mj: `⚠️ Identification incertaine — "Guatapori" non retrouvé avec certitude dans les sources coloniales néogrenadines. Pourrait correspondre à un bourg wayuu ou à une mission éphémère.`,
    },

// ── 72. SAN CRISTÓBAL ────────────────────────────────────────────────────────

    {
        id: 'san-cristobal-tachira',
        nom: 'San Cristóbal',
        label: 'St Christophe',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5584, 4561],
        // ⚠️ Ville andine du Táchira (Venezuela actuel), dans la juridiction
        // de la Nouvelle-Grenade à cette époque. Sur la route entre Bogotá
        // et Maracaibo via Pamplona.

        contexte: [
            {
                de: 1712,
                texte: `Ville andine fondée en 1561 dans la vallée du Táchira, sur la route commerciale reliant Bogotá et Pamplona à Maracaibo et à la côte vénézuélienne. San Cristóbal est le principal centre de la région du Táchira — une zone agricole productive spécialisée dans le blé, le maïs et les pâturages d'altitude. Ses marchés redistribuent les marchandises entre les Andes néogrenadines et les plaines vénézuéliennes.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1561, position sur la route Bogotá–Maracaibo via Pamplona : établi.
⚠️ Population en 1712 : estimation.
Appartenance à la Nouvelle-Grenade pour cette période : établi — la province du Táchira relève de la Real Audiencia de Santa Fe, non de Caracas.`,
    },

// ── 73. PAMPLONA ─────────────────────────────────────────────────────────────

    {
        id: 'pamplona-colombia',
        nom: 'Pamplona',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5606, 4698],

        contexte: [
            {
                de: 1712,
                texte: `Ville andine fondée en 1549 dans les hautes terres de la cordillère orientale, sur la route entre Bogotá et les provinces vénézuéliennes. Pamplona est un centre minier et agricole — ses mines d'or et d'argent, exploitées depuis le XVIe siècle, sont en déclin en 1712 mais pas épuisées. La ville est un nœud routier important : les routes vers Santa Marta au nord, Bogotá au sud, et Maracaibo à l'est se croisent dans ses environs. Ses grandes familles créoles contrôlent les haciendas d'élevage de la région.`,
            },
        ],

        population: `~5 000 habitants`,

        note_mj: `✅ Fondation 1549, mines d'or et d'argent : établi.
✅ Nœud routier entre Bogotá, Santa Marta et Maracaibo : établi géographiquement.
⚠️ Population en 1712 : estimation.`,
    },

// ── 74. SERRANÍA DE OPÓN ─────────────────────────────────────────────────────

    {
        id: 'mont-opon',
        nom: 'Serranía de Opón',
        label: 'Mont de Opon',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5499, 4752],

        contexte: [
            {
                de: 1712,
                texte: `Massif montagneux boisé entre le río Magdalena et les Andes orientales — une zone de collines et de forêts denses que les Espagnols n'ont jamais vraiment colonisée. La serranía de Opón est réputée inaccessible et habitée par des nations indiennes non soumises. Les chroniques de la conquête rapportent que Jiménez de Quesada a traversé ces montagnes en 1536–1538 lors de son expédition depuis Santa Marta vers Bogotá — une marche épuisante dans la boue et la jungle qui a décimé son armée avant même qu'elle atteigne les plaines de la Sabana.`,
            },
        ],

        note_mj: `✅ Serranía de Opón traversée par Jiménez de Quesada lors de la conquête du Nuevo Reino (1536–1538) : établi.
✅ Zone non colonisée en 1712, nations indiennes non soumises : cohérent avec les sources sur la région.`,
    },

// ── 75. PORTETE / CÔTE DE LA GUAJIRA ─────────────────────────────────────────

    {
        id: 'portete',
        nom: 'Portete (Conquibacoa)',
        label: 'Portete',
        type: 'site',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5725, 3758],
        // ⚠️ Regroupe "Portete" et "Conquibaco" de la Jaillot — deux noms
        // pour la même zone côtière de la Guajira orientale.
        // "Conquibacoa" est le nom préhispanique de la région (utilisé par les
        // premiers explorateurs espagnols pour désigner la zone du lac Maracaibo
        // et de la Guajira).

        contexte: [
            {
                de: 1712,
                texte: `Baie naturelle sur la côte orientale de la péninsule de la Guajira — l'un des rares mouillages protégés de cette côte venteuse et peu peuplée. Portete est fréquentée par les navires hollandais de Curaçao et les contrebandiers de toutes nations qui viennent acheter des perles et des écailles de tortue aux Wayuus sans passer par les douanes de Riohacha. Les autorités espagnoles tentent périodiquement d'y établir un poste de surveillance — sans succès durable.
<br><br>
"Conquibacoa" est le nom ancien donné par les premiers explorateurs espagnols à toute la région entre la Guajira et le lac Maracaibo, depuis l'expédition d'Alonso de Ojeda en 1499.`,
            },
        ],

        note_mj: `✅ Portete comme mouillage de contrebande sur la Guajira : établi (Klooster, <em>Illicit Riches</em>, 1998).
✅ "Conquibacoa" comme nom ancien de la région — expédition d'Ojeda 1499 : établi.
✅ Résistance wayuu à toute présence espagnole permanente : établi.`,
    },

// ── 76. MÉRIDA (ANDES VÉNÉZUÉLIENNES) ────────────────────────────────────────

    {
        id: 'merida-venezuela',
        nom: 'Mérida',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5901, 4369],
        // ⚠️ Mérida des Andes vénézuéliennes — à ne pas confondre avec Mérida
        // du Yucatán (id: 'merida', déjà dans villes-data.js).
        // Relève de la Nouvelle-Grenade à cette époque, non du Venezuela
        // (Caracas), malgré sa position géographique.

        contexte: [
            {
                de: 1712,
                texte: `Ville andine fondée en 1558 dans la sierra Nevada de Mérida, à plus de 1 600 mètres d'altitude. Mérida est le centre administratif des Andes vénézuéliennes — une région froide et fertile, spécialisée dans le blé, l'élevage et la fabrication de textiles de laine. La ville dépend administrativement de la Real Audiencia de Santa Fe (Bogotá) plutôt que de Caracas, malgré sa proximité géographique avec le Venezuela. La Sierra Nevada de Mérida, qui culmine au Pico Bolívar, est visible depuis les plaines du lac Maracaibo.`,
            },
        ],

        population: `~6 000 habitants`,

        note_mj: `✅ Fondation 1558, altitude ~1 600 m : établi.
✅ Dépendance administrative de Santa Fe (Bogotá) et non de Caracas en 1712 : établi — la frontière entre les juridictions de Caracas et de Santa Fe dans cette zone est l'objet de tensions récurrentes.
⚠️ Population en 1712 : estimation.
À ne pas confondre avec Mérida du Yucatán (id: 'merida' dans villes-data.js).`,
    },

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

// ── AJOUT : LA POSSESSION (CHINANDEGA) ───────────────────────────────────────

    {
        id: 'la-possession',
        nom: 'Chinandega (La Possession)',
        label: 'La Possession',
        type: 'ville',
        rang: '2',
        territoire: 'nicaragua',
        coords: [2392, 3887],
        // ⚠️ "La Possession" sur la Jaillot — nom cartographique français ou
        // désignation de possession territoriale sans correspondance directe
        // avec un nom colonial espagnol connu. Identification avec Chinandega
        // (plaine du Nicaragua nord-occidental, entre León et le golfe de Fonseca)
        // d'après la position sur la carte.

        contexte: [
            {
                de: 1712,
                texte: `Bourg de la plaine du Nicaragua nord-occidental, dans une région fertile entre León et le golfe de Fonseca. La plaine de Chinandega est l'une des zones agricoles les plus productives du Nicaragua colonial — cacao, maïs, élevage — irriguée par les cours d'eau descendant du volcan San Cristóbal et du massif des Maribios. La ville est modeste, sans accès maritime direct, sur la route terrestre entre León et les ports du golfe de Fonseca.`,
            },
        ],

        population: `~2 000 habitants`,

        note_mj: `⚠️ "La Possession" : nom cartographique non retrouvé dans les sources coloniales espagnoles du Nicaragua. Identification avec Chinandega d'après la position géographique sur la Jaillot — plausible mais non confirmée par source primaire.
⚠️ Population en 1712 : estimation.`,
    },

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

// ── 106. MOMOTOMBO ───────────────────────────────────────────────────────────

    {
        id: 'momotombo',
        nom: 'Momotombo',
        label: 'Le Grand Vulcan de Munbacho',
        type: 'site',
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

// ── 107. LAC NICARAGUA ───────────────────────────────────────────────────────

    {
        id: 'lac-nicaragua',
        nom: 'Lac Nicaragua (Cocibolca)',
        label: 'Lac Nicaragua',
        type: 'site',
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

// ── 112. POPOCATÉPETL ────────────────────────────────────────────────────────

    {
        id: 'popocatepetl',
        nom: 'Popocatépetl',
        label: 'Les Vulcans ou Papa Catepec',
        type: 'site',
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

// ── AJOUT : PÁTZCUARO (MECHOACAN) ────────────────────────────────────────────

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


// ── AJOUT : MARIQUITA ────────────────────────────────────────────────────────

    {
        id: 'mariquita',
        nom: 'Mariquita',
        label: 'Mariguetta',
        type: 'ville',
        rang: '2',
        territoire: 'nouvelle-grenade',
        coords: [5113, 5021],
        // ⚠️ "Mariguetta" sur la Jaillot — identification avec Mariquita
        // confirmée par la position sur la carte moderne par rapport à Bogotá.
        // Plus importante que les relais fluviaux en aval (Trinidad, Plasencia,
        // El Desembarcadero) — entrée dédiée justifiée.

        contexte: [
            {
                de: 1712,
                texte: `Ville du Magdalena supérieur, fondée en 1551 au pied de la cordillère centrale, sur la route fluviale entre Bogotá et Carthagène. Mariquita est l'étape clé de la navigation entre la capitale du Nuevo Reino et la côte Caraïbe : c'est ici que les voyageurs et les marchandises descendant depuis Bogotá rejoignent le Magdalena navigable, avant de s'embarquer sur les pirogues qui les porteront vers Mompox et Carthagène. La ville est aussi un centre d'exploitation minière — ses mines d'or et d'argent ont été parmi les plus actives du XVIe siècle, aujourd'hui en déclin mais encore en activité partielle.
<br><br>
Mariquita est entourée de forêts tropicales d'altitude où pousse le quinquina (<em>Cinchona</em>) — l'écorce dont on tire la quinine, remède contre la fièvre paludéenne. La plante est encore peu exploitée systématiquement en 1712, mais les Jésuites en ont compris la valeur médicale depuis le siècle précédent et la "poudre des Jésuites" commence à circuler en Europe.`,
            },
        ],

        population: `~4 000 habitants`,

        note_mj: `✅ Fondation 1551, position sur la route Bogotá–Carthagène via le Magdalena : établi.
✅ Mines d'or et d'argent actives au XVIe siècle, en déclin au XVIIIe : établi (McFarlane, <em>Colombia before Independence</em>, 1993).
✅ Quinquina dans les forêts environnantes, "poudre des Jésuites" : établi — la quinine de cette région sera systématiquement étudiée par la mission botanique de Mutis à la fin du XVIIIe siècle.
⚠️ Population en 1712 : estimation.`,
    },

];
