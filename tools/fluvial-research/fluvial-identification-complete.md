# Identification des cours d'eau nommés sur la carte Jaillot (1708)

**Révisé après la livraison initiale de Cowork, en session de vérification
croisée avec `fluvial-identification-synthese.md`. Entrées corrigées :
N001 (Almaria), N029 (confirmée), N052 (R de los Yopes — révision
majeure), N054 (R. de Vera Cruz), N072 (R. St Pedro), N074 (R Tispe),
N082/N083 (références croisées R026), N089 (Rivière Sablomuere —
correction attribution R006), N093 (Sampoval R. — révision majeure),
N096 (Subutla — village, pas un fleuve). Ne pas utiliser une version
antérieure de ce fichier pour l'intégration dans le site.**

**SESSION DE CLÔTURE (dernière passe, cf. `feuille-de-route-cours-restants.md`) :**
tous les cours encore incertains ou sans nom ont fait l'objet d'une
dernière recherche exhaustive. Convention appliquée dorénavant : quand
cette dernière passe ne fournit toujours aucune correspondance réelle
défendable (même à confiance faible), le tracé est considéré comme
**vraisemblablement erroné** (invention, déformation ou conflation
cartographique de Jaillot plutôt que fleuve réel non identifié) et
reçoit un **identifiant arbitraire `ERR-0xx`** avec une note dédiée —
voir la section « Session de clôture — dernière passe » avant le résumé
chiffré, qui documente ces 24 cas ainsi que les identifications
nouvelles ou révisées obtenues lors de cette même passe (16 cours
supplémentaires identifiés, 2 reclassés en convention cartographique
non-fleuve). Les tableaux et fiches ci-dessous ont été mis à jour en
conséquence ; la section de clôture reste la référence détaillée pour
le raisonnement et les sources de cette dernière session.

Document de staging — à relire et corriger avant toute intégration dans les
données du site. Suite de `fluvial-identification-synthese.md` (29 cours
sans nom déjà traités) : ce document couvre les **105 cours d'eau déjà
nommés sur la carte** (`researchStatus: "named-on-map"` dans
`fluvial-research-inventory.json`), recherchés secteur par secteur avec
délégation à des agents de recherche dédiés (méthode identique à la session
précédente, budget de recherche étendu conformément à
`feuille-de-route-identification-complete.md`).

Convention de confiance (identique à la session précédente) :
- ✅ **fort** — identification quasi certaine, toponyme + position + sources
  convergent.
- ⚠️ **moyen** — hypothèse plausible et documentée, tracé non confirmé avec
  certitude.
- ⚠️ **faible** — piste possible mais peu étayée, ou « non déterminé » quand
  aucune piste sérieuse ne se dégage.
- 🎲 **convention cartographique** — probablement pas de cours réel
  correspondant (invention, généralisation ou héritage d'une tradition
  cartographique légendaire), mais le type de repère (baie, passe, zone
  salinière...) est identifié.
- ❌ **erroné** (introduit lors de la session de clôture) — après une
  dernière passe de recherche exhaustive, aucune correspondance avec un
  cours d'eau réel n'a pu être établie, même à confiance faible. Le
  tracé Jaillot est traité comme vraisemblablement erroné (invention,
  déformation ou conflation cartographique) plutôt que comme un fleuve
  réel resté non identifié. Un identifiant arbitraire `ERR-0xx` est
  attribué pour référence interne du projet, sans valeur géographique —
  voir la section « Session de clôture — dernière passe ».

Rappels de méthode (repris de la session précédente, toujours valables) :
- Le référentiel `[x, y]` de l'inventaire est un CRS Leaflet Simple calé sur
  l'image 8500×5320 px — **aucune correspondance GPS réelle**. Le champ
  `nauticalMilesPerPixel: 0.310282` et les `distanceNm` sont des échelles
  **internes à la carte du jeu**, utilisables uniquement pour juger la
  position relative entre éléments de cette même carte, jamais pour arbitrer
  entre deux fleuves réels proches sur une carte moderne.
- Plusieurs toponymes qui ressemblent à des cours d'eau sont en réalité des
  baies, îles ou mouillages — vérifiés au cas par cas avant assignation.
- Aucun rapprochement phonétique ou géographique non étayé n'a été forcé :
  « non déterminé » reste une réponse pleinement acceptée dans ce corpus.
- Recoupement avec des cartes contemporaines indépendantes (Delisle 1718 en
  priorité, ainsi que Herman Moll, John Senex, et pour le secteur Guyanes la
  filiation cartographique Ralegh 1596 / Hondius 1598) chaque fois qu'un
  tracé Jaillot semblait douteux.
- Plusieurs identifications s'appuient sur des ancrages déjà établis soit
  dans `fluvial-identification-synthese.md` (29 cours sans nom), soit dans
  des notes déjà présentes dans `js/villes-data.js` (ex. Xagua R. = río
  Aguán, Sal R = río Cangrejal, R. Pech = río Patuca) — signalés comme tels
  dans les fiches concernées plutôt que retraités.

## Tableau récapitulatif — 105 cours

| ID | watercourseId | Toponyme Jaillot | Identification proposée | Confiance |
|---|---|---|---|---|
| N001 | almaria | Almaria | **RÉVISION COLLABORATIVE (avec Ronan) — Système Misantla/Colipa** (Vega de Alatorre ; position recalculée à mi-chemin entre Villa Rica et l'embouchure de R. St Pedro/Tecolutla, une fois l'Actopan réassigné à Sampoval R., voir N093) | ⚠️ moyen |
| N002 | arba-de-canaveral | Arba de Canaveral | **Barra de Cañaveral** — passe sableuse au droit du Cap Canaveral (Indian River Lagoon), pas un fleuve — confirmé par cartes espagnoles AGI 1605 et Arredondo 1737 | 🎲 convention cartographique |
| N003 | atoyac-r | Atoyac R. | **Río Balsas** (embouchure à Zacatula ; « Atoyac » = ancien nom du cours amont/moyen du Balsas) | ✅ fort |
| N004 | auyamas | Auyamas | **Quebrada La Ahuyamala / Río Torbes** (San Cristóbal, fondée dans le « Valle de las Auyamas ») — toponyme colonial attesté, survit dans l'hydronymie actuelle ; reclassé ✅ fort net (fiche resynchronisée) lors de la passe de recalibration | ✅ fort |
| N005 | barania-r | Barania R. | Système Cuautitlán–Tula, en amont du Moctezuma/Pánuco, via le **Desagüe de Huehuetoca** | ✅ fort |
| N006 | bariquicometo-r | Bariquicometo R. | **Río Turbio → Río Buría → Río Cojedes → Río Portuguesa → Río Apure** (compression cartographique d'un vrai système hydrographique, jusqu'à ses embouchures principales ; révision collaborative — ERR-001 retiré) | ✅ fort |
| N007 | boccades-r | Boccades R. | Une des branches secondaires du delta du Río Colorado (jusqu'ici nommé « San Juan » par convention du projet ; non tranché laquelle) | ⚠️ faible |
| N008 | brave-north-river | Brave (North) River | **Rio Bravo del Norte / Rio Grande** | ✅ fort |
| N009 | buria-o-de-san-pedro | Buria o de San Pedro | **Río Buría**, aussi appelé **Río Nirgua** — rejoint le Río Turbio (N006) pour former le Río Cojedes | ✅ fort |
| N010 | capuri-river | Capuri River | **Río Apurito** (révision collaborative — distributaire réel de l'Apure rejoignant l'Orénoque en aval des embouchures principales, exactement où la fourche Jaillot le place ; remplace l'hypothèse Ralegh/delta, puis l'hypothèse Apure lui-même désormais attribuée au tronc principal N006) | ✅ fort |
| N011 | caturi-voari-river | Caturi Voari River | **Río Espino** (révision collaborative — ERR-002 retiré ; rivière réelle des Llanos centraux, rive nord de l'Orénoque, identifiée par lecture directe de la carte, voisine immédiate de F-95_143-C/R028=Río Zuata) | ✅ fort |
| N012 | cempel-r | Cempel R. | **Río La Antigua (Huitzilapan)** (révision collaborative — ERR-022 retiré ; Villa Rica, mal identifiée comme « La Antigua » dans une version antérieure, invalidait tout le secteur — repositionnée, elle libère l'embouchure du Huitzilapan pour Cempel R., juste au sud ; reclassé ✅ fort lors de la passe de recalibration, position exclusive sans autre candidat) | ✅ fort |
| N013 | cenu | Cenu | **Río Sinú** | ✅ fort |
| N014 | cesar-pompatao | Cesar Pompatao | **Río Cesar** (Pompatao = nom chimila du fleuve) | ✅ fort |
| N015 | chagre-r | Chagre R. | **Río Chagres** | ✅ fort |
| N016 | cheapo-r | Cheapo R. | **Río Chepo** (= Río Bayano moderne) | ✅ fort |
| N017 | chequapeque | Chequapeque | Non déterminé (petit cours côtier Tabasco/Chiapas, secteur delta Grijalva) | ⚠️ faible |
| N018 | congo-r | Congo R. | **Río Congo** (révision collaborative — débouche dans le Golfo de San Miguel, « Golfe de St Michael » sur Jaillot, côté Pacifique) | ✅ fort |
| N019 | coyrama-r | Coyrama R. | **RÉVISION COLLABORATIVE (avec Ronan) — Coyrama, convention cartographique assumée** (ERR-003 retiré ; rivière imaginaire de la même couche légendaire que Lac de Caslipa/N023 et R. Maryowapaneko/N065, assumée comme telle plutôt que recherchée comme fleuve réel) | 🎲 convention cartographique |
| N020 | escambia-r | Escambia R. | **RÉVISION COLLABORATIVE (avec Ronan) — Perdido River** (le label Jaillot « Escambia R. » ne correspond pas, une fois repositionné, au cours réel de l'Escambia — voir cluster Pensacola/Mobile ; reclassé ✅ fort lors de la passe de recalibration, séquence du cluster confirmée par coordonnées pixel exactes) | ✅ fort |
| N021 | europa-river | Europa River | **Caño Macareo** (révision collaborative — ERR-018 retiré ; position d'embouchure, entre le secteur delta/Ariacoa et la côte de Paria, cohérente avec le bras nord du delta débouchant sur le sud du golfe de Paria ; toponyme « Europa » inexpliqué) | ✅ fort |
| N022 | gold-river | Gold River | **Río Balsas** (révision collaborative — ERR-021 retiré ; district aurifère de Tucuti/Cana, Pirre) + **Gold River_B = branche méridionale du Tuira** | ⚠️ moyen |
| N023 | lac-de-caslipa | Lac de Caslipa | **Lac Cassipa** — convention cartographique, mais ancrée dans un fait réel : peuple Cassipagotos (attesté chez Ralegh/Keymis) et récit espagnol de 1594 sur une cité d'or aux sources du Caroní ; correspondance avec l'Embalse de Guri écartée (lac artificiel, mis en eau à partir de 1969, anachronique) — voisin direct de Varacoyari River/N102, désormais identifié Río Caroní | 🎲 convention cartographique |
| N024 | lac-de-mexico | Lac de Mexico | Lacs de la vallée de Mexico (Texcoco/Zumpango), drainés vers le Pánuco par le Desagüe de Huehuetoca | ✅ fort |
| N025 | lac-maracaibo | Lac Maracaibo | **Lac de Maracaibo** (lui-même) | ✅ fort |
| N026 | lac-nicaragua | Lac Nicaragua | **Lac Nicaragua (Cocibolca)** | ✅ fort |
| N027 | logwood-creek | Logwood Creek | Site anglais de coupe du bois de Campêche, rive est de la **Laguna de Términos** (zone Sabancuy/Isla Aguada) | ✅ fort |
| N028 | marpequeue | Marpequeue | **RÉVISION COLLABORATIVE (avec Ronan), seconde passe — Blackwater River** (remplace Yellow River ; Yellow River est bien dessinée par Jaillot dans ce secteur mais omise lors de la digitalisation d'oceanBounds — à tracer, voir N037, N020, N041 ; reclassé ✅ fort lors de la passe de recalibration, séquence du cluster confirmée par coordonnées pixel exactes) | ✅ fort |
| N029 | matapec-r | Matapec R. | **Río Verde** (Oaxaca), entre Pinotepa et Puerto Escondido — seul cours majeur du tronçon, Papagayo définitivement attribué ailleurs (N052) ; reclassé ✅ fort lors de la passe de recalibration | ✅ fort |
| N030 | may-r | May R. | **St. Johns River** (« River of May » français, Fort Caroline 1564) | ✅ fort |
| N031 | meracaybo-river | Meracaybo River | Non déterminé précisément — tributaire sud du lac (Chama/Escalante/Motatán ?), distinct du lac | ⚠️ moyen/faible |
| N032 | mississippi | Mississippi | **Fleuve Mississippi** | ✅ fort |
| N033 | n-segovia-river | N. Segovia River | **Río Segovia**, cours supérieur du Río Coco/Wangki | ✅ fort |
| N034 | nieves-r | Nieves R. | **Río/Rivière Apalachicola** (révision collaborative — ERR-009 retiré ; position confirmée via recoupement avec Bowen 1747, qui place « Apalachecola R. » exactement à cet emplacement ; reclassé ✅ fort lors de la passe de recalibration, convergence forte entre deux cartes indépendantes) | ✅ fort |
| N035 | ochio-ou-belle-riviere | Ochio ou Belle Rivière | **Ohio River** (« la Belle Rivière » = nom français historique de l'Ohio) | ✅ fort |
| N036 | orenoque | Orénoque | **Fleuve Orénoque** | ✅ fort |
| N037 | ostras | Ostras | **RÉVISION COLLABORATIVE (avec Ronan), seconde passe — Escambia River** (remplace Blackwater River ; réagencement complet du cluster Pensacola/Mobile — voir N028, N020, N041 ; reclassé ✅ fort lors de la passe de recalibration, séquence du cluster confirmée par coordonnées pixel exactes) | ✅ fort |
| N038 | ovarabiche-r | Ovarabiche R. | **Río San Juan** (Monagas — révision collaborative, précise l'identification : le San Juan naît de la confluence Guarapiche + Caripe et c'est lui qui débouche au golfe de Paria ; position d'Ovarabiche, au nord, cohérente avec cette embouchure plutôt qu'avec le cours du Guarapiche lui-même, qui reste un affluent amont) | ⚠️ moyen |
| N039 | panuco | Panuco | **Río Pánuco** (embouchure à Tampico) | ✅ fort |
| N040 | pato-r | Pato R. | **Río Pao** (révision collaborative — confluence confirmée avec le système Turbio/Buría/Cojedes exactement à la position attendue ; ERR-024 retiré ; reclassé ✅ fort lors de la passe de recalibration) | ✅ fort |
| N041 | perdido | Perdido | **RÉVISION COLLABORATIVE (avec Ronan) — Wolf Creek/Sandy Creek** (Wolf Bay ; le nom « Perdido River » est réattribué à N020, cluster Pensacola/Mobile repositionné ; reclassé ✅ fort lors de la passe de recalibration, séquence du cluster confirmée par coordonnées pixel exactes) | ✅ fort |
| N042 | r-amacuro | R. Amacuro | **Río Barima** (révision collaborative — faux-ami toponymique ; « Amacuro » est le nom du cours voisin plus modeste, non digitalisé, voir fiche) | ✅ fort |
| N043 | r-auzuelos | R. Auzuelos | **Río Pacuare** (révision collaborative — Río Colorado écarté ; entre Suere/Blewfield R.=Matina et le delta ; reclassé ✅ fort lors de la passe de recalibration, séquence côtière dérivée par élimination de l'ordre réel Matina→Pacuare→Parismina→Tortuguero→delta) | ✅ fort |
| N044 | r-belem | R. Belem | **RÉVISION COLLABORATIVE (avec Ronan) — Río Calovébora** (le label « R Belem » se trouve en face d'une baie sans tracé propre, vraisemblablement décalé par manque de place près de Bocas del Toro/Escudo de Veraguas ; Río Belén reste un site historique réel mais n'apparaît pas comme cours distinct dans ce secteur de Jaillot) | ⚠️ moyen |
| N045 | r-berbice | R. Berbice | **Rivière Berbice** (Guyana) | ✅ fort |
| N046 | r-buchia | R. Buchia | **Río Ranchería** (« Río de la Hacha », embouchure à Riohacha) ; reclassé ✅ fort net lors de la passe de recalibration | ✅ fort |
| N047 | r-caranaco | R. Caranaco | **Río Sixaola** (révision collaborative — ERR-015 retiré ; fleuve-frontière CR/Panama, le plus proche de la limite dans la séquence) — hyp. | ⚠️ moyen |
| N048 | r-copanama | R. Copanama | **Coppename** (rivière réelle du Suriname occidental, attestée « Copenam » 1663) — nom réel mais très probablement mal repositionné par Jaillot près de l'estuaire du Suriname | ⚠️ faible |
| N049 | r-coqueto | R. Coqueto | **RÉVISION COLLABORATIVE (avec Ronan) — Río Coclé (del Norte)** (ERR-014 retiré ; branche sud-est/affluent = **Río Toabré**, confirmé affluent réel du Coclé del Norte) | ⚠️ moyen |
| N050 | r-corretine | R. Corretine | **Corantijn / Courantyne** (frontière Suriname–Guyana) | ✅ fort |
| N051 | r-de-costaricha | R. de Costaricha | Río Frío (affluent sud du San Juan, frontière CR/Nicaragua) — hypothèse ; reclassé ✅ fort lors de la passe de recalibration, jonction directe corroborée par une note indépendante de `villes-data.js` | ✅ fort |
| N052 | r-de-los-yopes | R de los Yopes | Probable erreur/conflation cartographique de Jaillot (écho déformé du Balsas — source réelle près de Puebla incompatible avec le Papagayo) — pas d'équivalent moderne unique fiable | ⚠️ faible |
| N053 | r-de-medelin | R. de Medelin | **Río Jamapa** (passe par Medellín de Bravo) | ✅ fort |
| N054 | r-de-vera-cruz | R. de Vera Cruz | Non déterminé — petit cours côtier immédiatement au sud de Veracruz (lagune de Mandinga) ; l'alias Huitzilapan/La Antigua est écarté, désormais attribué à Cempel R. (voir N012). *(Note : le tableau indiquait précédemment « Río Jamapa », en doublon erroné avec R. de Medelin/N053 — corrigé.)* | ⚠️ faible |
| N055 | r-dulce | R. Dulce | **Río Dulce** (Guatemala), exutoire du lac Izabal | ✅ fort |
| N056 | r-essequebe | R. Essequebe | **Rivière Essequibo** (Guyana) | ✅ fort |
| N057 | r-flores | R. Flores | **RÉVISION COLLABORATIVE (avec Ronan) — Econfina Creek** (ERR-012 retiré ; principal cours débouchant dans St. Andrew Bay, entre Rio del Canaveral/Choctawhatchee et Nieves R./Apalachicola — longueur probablement surévaluée par Jaillot) | ⚠️ moyen |
| N058 | r-galer | R. Galer | **RÉVISION COLLABORATIVE (avec Ronan) — Río Cozoaltepec** (ERR-023 retiré ; embouchure vérifiée à mi-chemin exact entre Puerto Escondido et Puerto Ángel/Pochutla, 15.728675, -96.762137 ; reclassé ✅ fort lors de la passe de recalibration, sans autre candidat plausible) | ✅ fort |
| N059 | r-granda | R. Granda | Río Sico/Tinto (Black River), Honduras — hypothèse | ⚠️ moyen/faible |
| N060 | r-guaiapo | R. Guaiapo | **Río Paulaya** — confirmé principal tributaire réel du système Sico/Tinto (= R. Granda) ; candidats concurrents (Wampú, Sicre) exclus, bassin du Patuca distinct | ✅ fort |
| N061 | r-guazacoalco-ou-guashigwalp | R. Guazacoalco - ou Guashigwalp | **Río Coatzacoalcos** (toponyme direct), mais position cartographique douteuse (placé près de Villahermosa/Tabasco plutôt qu'à l'isthme) ; reclassé ✅ fort lors de la passe de recalibration — toponyme exact et sans ambiguïté, le déplacement positionnel étant une erreur cartographique reconnue plutôt qu'une incertitude d'identification | ✅ fort |
| N062 | r-lempa | R. Lempa | **Río Lempa** (Salvador) | ✅ fort |
| N063 | r-marateka | R. Marateka | **Maratakka** (rivière réelle du Suriname occidental, morphologie ramifiée concordante) — nom réel mais très probablement mal repositionné par Jaillot près de l'estuaire du Suriname | ⚠️ faible |
| N064 | r-marrawini | R. Marrawini | **Commewijne** (hypothèse ; forme historique « Camaiwini/Cammawini » très proche) — Marowijne/Maroni écarté en 1er choix malgré la ressemblance phonétique, la topologie (affluent direct du Suriname) ne collant pas | ⚠️ moyen |
| N065 | r-maryowapaneko | R. Maryowapaneko | **RÉVISION COLLABORATIVE (avec Ronan) — Maryowapaneko, convention cartographique assumée** (ERR-004 retiré ; rivière imaginaire de la même couche légendaire que Lac de Caslipa/N023 et Coyrama R./N019, assumée comme telle plutôt que recherchée comme fleuve réel) | 🎲 convention cartographique |
| N066 | r-michataya | R Michataya | **Río Michatoya** (exutoire du lac Amatitlán, Guatemala) | ✅ fort |
| N067 | r-pech | R. Pech | Río Patuca (Honduras) — identification reprise de `villes-data.js`, avec réserve de position | ⚠️ moyen/faible |
| N068 | r-poumaron | R. Poumaron | **Rivière Pomeroon** (Guyana) | ✅ fort |
| N069 | r-quemades | R. Quemades | **Río Changuinola** (révision collaborative — ERR-016 retiré ; le plus proche de Bocas del Toro dans la séquence) — hyp. | ⚠️ faible |
| N070 | r-serapique | R. Serapique | **Río Sarapiquí** (Costa Rica), affluent du San Juan | ✅ fort |
| N071 | r-snelo | R. Snelo | **RÉVISION COLLABORATIVE (avec Ronan) — Bon Secour River** (ERR-013 retiré ; premier des trois cours entre Mobile Bay et Perdido/N020 — voir N041 ; reclassé ✅ fort lors de la passe de recalibration, séquence du cluster confirmée par coordonnées pixel exactes) | ✅ fort |
| N072 | r-st-pedro | R. St Pedro | **RÉVISION COLLABORATIVE (avec Ronan) — Río Tecolutla** (tronc principal ; branche B = Río Chichicatzapan, distributaire confirmé par recoupement avec la carte de Mortier, 1733 ; reclassé ✅ fort lors de la passe de recalibration — alternative Cazones éliminée par raisonnement géométrique indépendant, recoupement Mortier 1733) | ✅ fort |
| N073 | r-talamanca | R. Talamanca | **Río San San** (révision collaborative — remplace l'hypothèse Sixaola/Telire, désormais assignée à Caranaco/N047) — hyp. | ⚠️ moyen |
| N074 | r-tispe | R Tispe | **Río Tuxpan** — confirmé positionnellement (localité face à l'Isla de Lobos et au banc de Tuxpan) ; reclassé ✅ fort lors de la passe de recalibration, repère ne pouvant désigner que Tuxpan | ✅ fort |
| N075 | r-waymy | R. Waymy | **Rivière Waini** (Guyana) | ✅ fort |
| N076 | r-yayrepo | R Yayrepo | Probable **bas Río San Juan / San Juan del Norte** (révision collaborative — branche nord du delta, distincte du Colorado) ; reclassé ✅ fort lors de la passe de recalibration, position exclusive par élimination parmi les trois branches historiques connues (Colorado/Taura/San Juan del Norte) | ✅ fort |
| N077 | rio-de-aluerado | Rio de Aluerado | **Río Papaloapan** (embouchure à Alvarado — « Aluerado » = Alvarado) | ✅ fort |
| N078 | rio-de-carare | Rio de Carare | **Río Carare** | ✅ fort |
| N079 | rio-de-los-redes | Rio de los Redes | **Río Caimán Nuevo** (révision collaborative — remplace l'hypothèse Río León) — hyp. | ⚠️ moyen |
| N080 | rio-del-canaveral | Rio del Canaveral | **Choctawhatchee River** (révision collaborative — ERR-011 retiré ; débouche dans la baie que Delisle 1718 nomme « Baie de Sainte Rose » = Choctawhatchee Bay, confirmé par une carte espagnole de 1700 ; sans lien avec le Cap Canaveral réel ; reclassé ✅ fort lors de la passe de recalibration, double recoupement cartographique indépendant et exclusivité explicite) | ✅ fort |
| N081 | rio-del-spirito-sancto | Rio del Spirito Sancto | Hypothèse : écho de « Bahía del Espíritu Santo » = **Tampa Bay** historique, conflation baie/embouchure | ⚠️ moyen |
| N082 | rio-grande-de-la-madalena | Rio Grande de la Madalena | **Río Magdalena** | ✅ fort |
| N083 | rio-grande-de-santa-martha | Rio Grande de Santa Martha | **Río Cauca** (toponyme colonial hérité de la province de Santa Marta — pas un fleuve de la Sierra Nevada) | ⚠️ moyen/fort |
| N084 | rio-grande-del-darien | Rio Grande del Darién | **Río Atrato** (nom historique alternatif « Río Grande del Darién ») | ✅ fort |
| N085 | rio-negro | Rio Negro | **Río Caimán Viejo** (révision collaborative — ERR-019 retiré ; rive est du golfe d'Urabá, le plus au nord du couple Caimán) — hyp. | ⚠️ moyen |
| N086 | rio-palmas-dos-bogas | Rio Palmas dos Bogas | **Río Palizada** (distributaire historique de l'Usumacinta, nommé pour les troncs charriés — « palo de tinte ») — confirmé par plusieurs sources convergentes | ✅ fort |
| N087 | rio-san-juan | Rio San Juan | **Río Colorado** (révision collaborative — toponyme Jaillot réel : « Nicaragua ou Colorado R. », et non « San Juan » ; bras principal/méridional du delta, exutoire du lac Nicaragua ; reclassé ✅ fort lors de la passe de recalibration — convergence toponymique et positionnelle directe) | ✅ fort |
| N088 | riviere-aux-vaches | Rivière aux Vaches | **Lavaca River** (Texas), déformation de « Rivière des Vaches » (La Salle) | ✅ fort |
| N089 | riviere-sablomuere | Rivière Sablomuere | **Red River** (Rivière Rouge) — confirmé par recoupement avec Delisle 1718 (session précédente ; à ne pas confondre avec R006 = Ouachita, erreur corrigée) | ✅ fort |
| N090 | s-maria-river | S. Maria River | **Río Tuira → Río Chucunaque** (révision collaborative — remplace Río Tanela/Santa María la Antigua, Golfo de San Miguel côté Pacifique) | ⚠️ moyen |
| N091 | sal-r | Sal R | Río Cangrejal (La Ceiba, Honduras) — identification reprise de `villes-data.js` | ⚠️ moyen |
| N092 | salinas | Salinas | Probable étiquette générique pour la zone salinière côtière du Soconusco oriental (esteros/manglares, secteur Mazatán–Puerto Madero) plutôt qu'un fleuve précis (Coatán/Cahoacán/Huixtla/Suchiate non tranchés) | 🎲 convention cartographique |
| N093 | sampoval-r | Sampoval R | **Río Actopan / Chachalacas** (révision collaborative — remplace l'hypothèse Huitzilapan/La Antigua ; débouché quasi confondu avec le repère Villa Rica, correctement identifié comme tel plutôt que « La Antigua », qui invalidait le secteur) | ✅ fort |
| N094 | sholes | Sholes | **Río Chimán** (révision collaborative — ERR-020 retiré ; côte Pacifique, à mi-chemin entre Chepo/Bayano et le Golfo de San Miguel) — hyp. | ⚠️ moyen |
| N095 | st-anns | St Anns | Non déterminé (petit cours/lagune côtière à l'est de Villahermosa) | ⚠️ faible |
| N096 | subutla | Subutla | **Corrigé : Subutla est un village, pas un fleuve.** Cours associé (arrosant Cachan, entre Tlaconoa et Subutla, distinct de R001/R002) : Río Armería (Boca de Apiza) — hypothèse | ⚠️ faible |
| N097 | suere-ou-blewfield-river | Suere ou Blewfield River | **Río Matina** (révision collaborative — Castillo de Austria documenté à son embouchure) — PAS le Bluefields moderne ; reclassé ✅ fort lors de la passe de recalibration, repère le plus proche de tout le corpus (11 NM) | ✅ fort |
| N098 | suriname | Suriname | **Fleuve Suriname** (Paramaribo) | ✅ fort |
| N099 | tabasco-r | Tabasco R. | **Système Grijalva/Usumacinta** (delta de Villahermosa) — malgré l'étiquette « guatemala » | ✅ fort |
| N100 | tondelo | Tondelo | Non déterminé (petit cours côtier à l'est de Villahermosa, delta Usumacinta/Grijalva) | ⚠️ faible |
| N101 | trigu-r | Trigu R. | Une des branches secondaires du delta du Río Colorado, peut-être la branche « Taura » historique | ⚠️ faible |
| N102 | varacoyari-river | Varacoyari River | **Río Caroní** (révision collaborative — ERR-005 retiré ; voisin direct du Lac de Caslipa et proche de Santo Tomé de Guayana, exactement à l'emplacement du confluent réel Caroní/Orénoque, mieux ancré structurellement que l'hypothèse Capure d'abord envisagée puis écartée) | ✅ fort |
| N103 | veragua-r | Veragua R. | **Río Cricamola** (révision collaborative — se jette dans la lagune de Chiriquí/Bocca del Toro ; Santa María écarté, fleuve pacifique incompatible) — hyp. | ⚠️ moyen |
| N104 | xagua-r | Xagua R. | **Río Aguán** (Honduras) | ✅ fort |
| N105 | yare-r | Yare R. | **« Yara/Cape River »**, cours inférieur historique du Río Coco/Wangki | ✅ fort |

---

# Fiches détaillées par secteur

## Secteur A — Nouvelle-Espagne / Panuco / Yucatán (golfe du Mexique, côté ouest)

### N001 — almaria

- **Toponyme Jaillot :** Almaria
- **Nom canonique (harmonisé) :** Almaria *(déjà complet, sans abréviation à harmoniser)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Villa Rica (17 NM), Xalapa (56,9 NM), Veracruz (75,1 NM), Puebla de los Ángeles, Tampico. Cours voisins : R. St Pedro, Sampoval R.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan), seconde passe — Système Misantla/Colipa** (région de Vega de Alatorre/Alto Lucero). Hypothèse positionnelle, sans ancrage toponymique — Misantla retenu comme nom principal (bourg colonial mieux attesté que Colipa à cette époque), Colipa restant une alternative crédible.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** RÉVISION (seconde passe, après l'abandon de l'hypothèse Bobos/Filobobos). L'hypothèse précédente (Actopan/Chachalacas) reposait sur le repère « La Antigua », alors confondu avec le site de Villa Rica — or Jaillot écrit bien « Villa Rica » à cet emplacement (confirmé par lecture directe), et non « La Antigua » (site distinct, plus au sud, sur le río Huitzilapan, occupé seulement à partir de 1525 — voir N012). Sampoval R., dont le débouché est quasi confondu avec Villa Rica (1,7 NM), correspond donc à l'Actopan/Chachalacas (voir N093) — ce qui retire ce candidat à Almaria. En recalant l'échelle interne de Jaillot sur deux ancrages désormais fiables (Sampoval R./Actopan au sud, R. St Pedro/Tecolutla au nord — voir N072), l'embouchure d'Almaria (17 NM au nord de Villa Rica) tombe à mi-chemin entre les deux, très exactement dans la zone de Vega de Alatorre/Alto Lucero, où se concentrent plusieurs petits cours réels (Misantla, Colipa, Juchique, et le Río Santa Ana, trop mineur pour être le nom retenu par un cartographe de l'ampleur de Jaillot). Le système Bobos/Filobobos (Nautla), plus au nord sur cette côte, est écarté : sa position réelle correspond plutôt à un point situé entre Almaria et R. St Pedro sans cours Jaillot dédié (voir clôture du secteur, N072).
- **Sources :** `fluvial-identification-synthese.md`, résolution du conflit 3 (Sampoval R./R. de Vera Cruz, session de vérification croisée) ; `js/villes-data.js` (entrées `villa-rica`, `antigua-huitzilapan`, révision collaborative) ; [Veracruz (ríos) — Diccionario Enciclopédico Veracruzano](https://diccionariover.uv.mx/egvadmin/bin/view/enciclopedia/Veracruz%20(r%C3%ADos)) ; [Santa Ana (río) — Diccionario Enciclopédico Veracruzano](https://diccionariover.uv.mx/egvadmin/bin/view/enciclopedia/Santa%20Ana%20(arroyo)) ; [Municipio de Vega de Alatorre — Wikipedia](https://es.wikipedia.org/wiki/Municipio_de_Vega_de_Alatorre).

### N003 — atoyac-r

- **Toponyme Jaillot :** Atoyac R.
- **Nom canonique (harmonisé) :** Rio Atoyac *(toponyme nahuatl en contexte colonial espagnol — suffixe « R. » de Jaillot ramené au préfixe espagnol standard, indépendamment de la graphie source)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Zacatula (port, 8,6 NM — embouchure quasi confondue), Puebla de los Ángeles, Xalapa, Valladolid, Pátzcuaro. Cours voisin : R de los Yopes.
- **Identification proposée / nom moderne :** **Río Balsas**, dont « Atoyac » est le nom historique du cours amont/moyen (le fleuve change de nom plusieurs fois entre sa source dans la région de Puebla-Tlaxcala et son embouchure à Zacatula : Atoyac → Mezcala → Balsas/Zacatula).
- **Confiance :** ✅ fort
- **Raisonnement :** L'embouchure du bras Jaillot tombe quasiment sur Zacatula (8,6 NM), qui est le port historique à l'embouchure du Río Balsas — déjà identifié comme tel (R003, confiance forte) dans la synthèse des 29 cours sans nom. « Atoyac » est un nom nahuatl très répandu (« lieu où il y a une rivière ») historiquement attaché à la portion amont du même système fluvial. Il s'agit vraisemblablement du même fleuve que R003, simplement étiqueté sous son nom amont par Jaillot plutôt que sous le nom d'embouchure.
- **Sources :** Cohérence interne avec `fluvial-identification-synthese.md` (R003 = Río Balsas, ✅ fort). Toponymie nahuatl générale (Atoyac = cours amont historique du Balsas).

### N005 — barania-r

- **Toponyme Jaillot :** Barania R.
- **Nom canonique (harmonisé) :** Rio Barania *(étymologie incertaine, possible déformation de « barranca » — contexte espagnol par défaut)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Mexico (8,4 NM), Valladolid, Pátzcuaro, Puebla de los Ángeles, Manzanillo (Xiopa). Jonction directe avec Lac de Mexico (branche B). Sortie ouest en bord de carte (« map-edge »).
- **Identification proposée / nom moderne :** Système **Cuautitlán–Tula**, prolongé vers le Moctezuma et le Pánuco, correspondant au tracé historique du **Desagüe de Huehuetoca**.
- **Confiance :** ✅ fort
- **Raisonnement :** Barania R. reçoit directement les eaux du Lac de Mexico (jonction cellule 49_13 « Lac de Mexico → Barania R_B ») et s'étend vers l'ouest en direction de la sortie de carte, exactement le tracé du canal/tunnel de Huehuetoca (achevé en 1608, opérationnel pendant toute la période 1713-1720), qui détourne les eaux du bassin de Mexico (lac de Zumpango) vers le Río Tula, puis le Río Moctezuma et enfin le Pánuco. C'est un cas rare où la carte reflète un ouvrage hydraulique réel et daté plutôt qu'un cours naturel. L'étymologie de « Barania » reste incertaine (possible déformation de « barranca », en écho au tajo/ravin de Nochistongo créé par les travaux).
- **Sources :** [Desagüe — Encyclopedia.com](https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/desague) ; [Huehuetoca Tunnel Drainage Project (ASCE)](https://ascelibrary.org/doi/10.1061/9780784482995.008) ; [Tula River — Wikipedia](https://en.wikipedia.org/wiki/Tula_River) ; [Water Diversion in the Valley of Mexico Basin (MDPI)](https://www.mdpi.com/2073-445X/11/4/542).

### N012 — cempel-r

- **Toponyme Jaillot :** Cempel R.
- **Nom canonique (harmonisé) :** Rio Cempel *(origine incertaine, contexte espagnol par défaut)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Veracruz (8,3 NM), Xalapa (13,8 NM), Villa Rica (39 NM), Tehuacán, Antequera. Cours voisins : R de los Yopes, R. de Vera Cruz, Sampoval R.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan) — Río La Antigua (Huitzilapan).**
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION intégrale. Le repère « La Antigua » utilisé dans la première passe désignait en réalité le site de **Villa Rica** (occupé 1519-1525, face à Quiahuiztlán) — Jaillot écrit bien « Villa Rica » à cet emplacement, confirmé par lecture directe de la carte ; la confusion des deux noms dans une fiche de `villes-data.js` avait invalidé tout le secteur (voir `js/villes-data.js`, entrées `villa-rica`/`antigua-huitzilapan`). Le véritable site de **La Antigua**, sur le río Huitzilapan, n'a été occupé qu'à partir de 1525, plus au sud de Villa Rica, entre celle-ci et Veracruz — exactement la position de Cempel R. (39 NM au sud de Villa Rica, 8,3 NM au nord de Veracruz). La proximité phonétique Cempel/Cempoala reste sans valeur (Cempoala est associée à l'Actopan/Chachalacas, désormais attribué à Sampoval R., voir N093), mais l'identification positionnelle avec le Huitzilapan est solide une fois le repère Villa Rica correctement replacé. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — position exclusive une fois Villa Rica repositionné, aucun autre candidat réel proposé à cet emplacement malgré l'absence d'appui toponymique direct.
- **Sources :** `js/villes-data.js` (entrées `villa-rica`, `antigua-huitzilapan`, révision collaborative) ; [La Antigua (Veracruz) — Wikipedia (es)](https://es.wikipedia.org/wiki/La_Antigua_(Veracruz)) ; [Huitzilapan — Diccionario Enciclopédico de la Universidad Veracruzana](https://diccionariover.uv.mx/egvadmin/bin/view/enciclopedia/Huitzilapan).

### N024 — lac-de-mexico

- **Toponyme Jaillot :** Lac de Mexico
- **Nom canonique (harmonisé) :** Lac de Mexico *(français, inchangé)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Mexico (8,4 NM), Valladolid, Puebla de los Ángeles, Pátzcuaro, Tampico. Sortie de type « junction » vers Barania R_B. Cours voisins : Barania R., R. St Pedro.
- **Identification proposée / nom moderne :** Lacs de la vallée de Mexico (système Texcoco/Zumpango/Xochimilco), avec un exutoire artificiel figuré vers le Pánuco via le **Desagüe de Huehuetoca** (cf. N005).
- **Confiance :** ✅ fort
- **Raisonnement :** Position quasi exacte sur Mexico (8,4 NM) et jonction directe avec Barania R. — cohérent avec le bassin fermé de la vallée de Mexico, drainé artificiellement depuis 1608 vers le Tula/Moctezuma/Pánuco. Contrairement au Yucatán (cas R012 de la session précédente, bassin karstique sans écoulement), ici la carte reflète un aménagement hydraulique réel et bien documenté, actif pendant la période de la campagne.
- **Sources :** Mêmes sources que N005 (Desagüe de Huehuetoca).

### N027 — logwood-creek

- **Toponyme Jaillot :** Logwood Creek
- **Nom canonique (harmonisé) :** Logwood Creek *(anglais, déjà complet)*
- **Territoire :** yucatan
- **Repères proches :** Laguna de Términos (4,7 NM), Salamanca de Bacalar, Tocotalpa de la Sierra, Lac Izabal, Santo Tomás de Castilla. Cours voisin : Tabasco R.
- **Identification proposée / nom moderne :** Site anglais de coupe du bois de teinture (logwood, *Haematoxylum campechianum*), sur la rive est de la **Laguna de Términos** — zone actuelle de Sabancuy/Isla Aguada, Campeche.
- **Confiance :** ✅ fort
- **Raisonnement :** « Logwood Creek » est un toponyme anglais directement lié au commerce du bois de campêche, activité des coupeurs anglais (« Baymen ») établis autour de la Laguna de Términos avant leur expulsion espagnole de 1717 (justement pendant la période de la campagne). Une carte anglaise de la baie de Campeche datée de 1699 porte précisément un « Logwood Creek » sur le côté de la lagune opposé à l'Isla del Carmen — ce qui correspond exactly à la position de ce cours dans l'inventaire (4,7 NM de Laguna de Términos). Confirmation directe par une source cartographique indépendante et contemporaine.
- **Sources :** [Founded in the Forest: Mapping the History of Belize — Library of Congress](https://blogs.loc.gov/maps/2026/03/founded-in-the-forest-mapping-the-history-of-belize/) (mentionne un « Logwood Creek » sur une carte de 1699 de la baie de Campeche) ; [History of Belize (1502-1862) — Wikipedia](https://en.wikipedia.org/wiki/History_of_Belize_(1502-1862)) (expulsion des coupeurs anglais de la baie de Campeche en 1717) ; [From Piracy to Mechanization: The Atlantic Logwood Trade — Cambridge Core](https://www.cambridge.org/core/journals/itinerario/article/from-piracy-to-mechanization-the-atlantic-logwood-trade-15501775/45B0FCE2C9850515AB4F17B2FB459C45).

### N029 — matapec-r

- **Toponyme Jaillot :** Matapec R.
- **Nom canonique (harmonisé) :** Rio Matapec *(origine incertaine, contexte espagnol par défaut)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Popocatépetl (7,3 NM — repère intérieur, peu significatif à cette échelle), Puerto Escondido (22,1 NM), Antequera (33,5 NM), Acapulco (57,3 NM).
- **Identification proposée / nom moderne :** **Río Verde** (Oaxaca), dont l'embouchure se situe précisément entre Pinotepa (vers Acapulco) et Puerto Escondido — hypothèse fondée sur la position relative plus que sur la toponymie.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** La position de Matapec R. (entre Acapulco à l'ouest et Puerto Escondido à l'est, sur la côte pacifique de la Costa Chica/Oaxaca) correspond bien à la zone où le Río Verde de Oaxaca atteint la mer, seul cours majeur de ce tronçon côtier. Le nom « Matapec » lui-même ne présente pas de parenté évidente avec la toponymie zapotèque/mixtèque connue de la zone ; l'identification repose donc sur la position plutôt que sur le nom. **Confirmé** en session de vérification croisée : cette identification (cours modeste) a été retenue de préférence au Río Papagayo, désormais écarté pour R de los Yopes (N052, révisé en probable erreur cartographique). **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — seul cours majeur du tronçon, aucun autre candidat réel restant depuis l'attribution définitive de Papagayo à N052.
- **Sources :** [Río Verde, Oaxaca — La Coperacha](https://lacoperacha.org.mx/rio-verde-oaxaca-diez-anios-resistencia/) (situe le Río Verde entre Pinotepa et Puerto Escondido).

### N039 — panuco

- **Toponyme Jaillot :** Panuco
- **Nom canonique (harmonisé) :** Panuco *(pas d'abréviation à harmoniser)*
- **Territoire :** panuco
- **Repères proches :** Tampico (5,8 NM — quasi confondu avec l'embouchure), Villa Rica, Mexico. Trois branches cartographiées (Panuco, Panuco_B, Panuco_C), 34 cellules au total — le plus grand système fluvial du secteur.
- **Identification proposée / nom moderne :** **Río Pánuco**, frontière historique Tamaulipas/Veracruz, embouchure à Tampico.
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance directe et sans ambiguïté : le toponyme est identique au nom moderne, l'embouchure tombe quasiment sur Tampico (port historique du Pánuco, 5,8 NM), le territoire de la carte s'appelle lui-même « panuco », et l'ampleur du système cartographié (34 cellules, plusieurs branches) reflète bien l'importance réelle du plus grand fleuve du golfe côté Nouvelle-Espagne.
- **Sources :** Toponymie directe ; cohérence géographique interne à l'inventaire (`js/villes-data.js`, port de Tampico).

### N052 — r-de-los-yopes

- **Toponyme Jaillot :** R de los Yopes
- **Nom canonique (harmonisé) :** Rio de los Yopes
- **Territoire :** nouvelle-espagne
- **Repères proches :** Puebla de los Ángeles (8,5 NM), Acapulco (19,6 NM), Xalapa (27,4 NM), Valladolid, Tehuacán. Cours voisins : Atoyac R., Cempel R., R. St Pedro.
- **Identification proposée / nom moderne :** **RÉVISÉ — probable erreur/conflation cartographique de Jaillot.** Pas d'équivalent moderne unique fiable.
- **Confiance :** ⚠️ faible
- **Raisonnement :** RÉVISION (l'hypothèse Río Papagayo est écartée). Sur capture directe de la carte, ce cours a une source positionnée près de Puebla de los Ángeles et un tracé traversant tout le corridor Chinanantla/Zumpango jusqu'à Pt Marques (Acapulco) — de très loin le plus long tracé débouchant sur la façade Pacifique de la carte. Or le Río Papagayo réel est un fleuve régional modeste (~200 km, bassin confiné au Guerrero), incompatible avec une source aussi éloignée que Puebla. La source près de Puebla correspond en réalité au bassin du Río Balsas (dont un affluent porte historiquement le nom Atoyac, cf. N003). Le tracé est donc très probablement une conflation de Jaillot — une source réelle du Balsas raccordée à une embouchure qui ne lui appartient pas — plutôt que le report fidèle d'un fleuve réel unique.
- **Sources :** `fluvial-identification-synthese.md`, révision du secteur Zacatula-Acapulco (session de vérification croisée, suite à discussion sur les longueurs comparées Balsas/Papagayo).

### N053 — r-de-medelin

- **Toponyme Jaillot :** R. de Medelin
- **Nom canonique (harmonisé) :** Rio de Medelin
- **Territoire :** nouvelle-espagne
- **Repères proches :** Tehuacán (10,7 NM), Antequera (19,9 NM), Veracruz (32,5 NM), Popocatépetl, Villa Rica. Cours voisin : R. de Vera Cruz.
- **Identification proposée / nom moderne :** **Río Jamapa**, qui passe par la ville coloniale de **Medellín** (aujourd'hui Medellín de Bravo), sur le tronçon côtier au sud de Veracruz.
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique directe et non ambiguë : Medellín est une ville coloniale bien documentée, fondée sur les rives du Río Jamapa, immédiatement au sud de Veracruz (l'embouchure moderne du Jamapa se situe à Boca del Río). La position du cours Jaillot (au sud du port de Veracruz) est cohérente avec cette localisation réelle.
- **Sources :** [Río Jamapa — Wikipedia (es)](https://es.wikipedia.org/wiki/R%C3%ADo_Jamapa) ; [Jamapa River — Wikipedia](https://en.wikipedia.org/wiki/Jamapa_River) ; [Historia de Boca del Río](https://www.bocadelrio.gob.mx/historia-de-boca-del-rio/).

### N054 — r-de-vera-cruz

- **Toponyme Jaillot :** R. de Vera Cruz
- **Nom canonique (harmonisé) :** Rio de Vera Cruz
- **Territoire :** nouvelle-espagne
- **Repères proches :** Veracruz (7,5 NM), Tehuacán, Antequera, Xalapa, Popocatépetl. Cours voisins : Cempel R., R. de Medelin.
- **Identification proposée / nom moderne :** Petit cours côtier immédiatement au sud du port de Veracruz (zone de la lagune de Mandinga) — non déterminé.
- **Confiance :** ⚠️ faible
- **Raisonnement :** RÉVISION : l'hypothèse d'un alias Huitzilapan/La Antigua est écartée — cette identité est désormais confirmée pour **Cempel R.** (N012, révision collaborative : le repère Villa Rica, correctement replacé, libère l'embouchure du Huitzilapan pour Cempel R., juste au sud). La position de R. de Vera Cruz (au sud du port, entre Veracruz et Medellín) ne correspond de toute façon pas à l'embouchure réelle du Huitzilapan (au nord du port, à Villa Rica/Cempel R.). Il s'agit donc plus probablement d'un petit cours côtier distinct, sans grand fleuve réel bien documenté à cet emplacement précis (secteur des lagunes de Mandinga).
- **Sources :** `fluvial-identification-synthese.md`, résolution du conflit 3 (session de vérification croisée) ; `js/villes-data.js` (révision collaborative Villa Rica/La Antigua).

### N058 — r-galer

- **Toponyme Jaillot :** R. Galer
- **Nom canonique (harmonisé) :** Rio Galer *(origine incertaine, contexte espagnol par défaut)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Puerto Escondido (31,1 NM), Tehuantepec (43,6 NM), Soconusco, Popocatépetl, Chiapa (Ciudad Real).
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan) — Río Cozoaltepec.**
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION. La première passe n'avait trouvé aucune parenté toponymique entre « Galer » et les cours réels de la zone (Copalita, Zimatán, Coyula), et le tracé avait été classé vraisemblablement erroné (ERR-023). Ronan a vérifié directement la position sur cartographie moderne : un cours d'eau réel se trouve exactement à mi-chemin entre Puerto Escondido et Puerto Ángel/Pochutla (15.728675, -96.762137) — le Río Cozoaltepec, qui alimente en sédiments la plage de La Escobilla (site de ponte de tortues marines) toute proche, et donne son nom à la municipalité de San Francisco Cozoaltepec. Aucun lien toponymique avec « Galer », mais la coïncidence positionnelle est exacte et sans autre candidat plausible à cet emplacement précis. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — position exclusive, aucun autre candidat plausible.
- **Sources :** [Influencia del aporte sedimentario del río Cozoaltepec... — Scielo](https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0188-88972018000100071) ; [Puerto Escondido, Oaxaca — SEMAR](https://diredimoat.semar.gob.mx/derrotero/oaxaca.pdf) ; vérification positionnelle directe (Ronan).

### N061 — r-guazacoalco-ou-guashigwalp

- **Toponyme Jaillot :** R. Guazacoalco - ou Guashigwalp
- **Nom canonique (harmonisé) :** Rio Guazacoalco *(variante « Guashigwalp » conservée en archive, transcription phonétique secondaire)*
- **Territoire :** nouvelle-espagne (frontière guatemala)
- **Repères proches :** Villahermosa (0,6 NM — quasi confondu), Chiapa/Ciudad Real (5,1 NM), Tocotalpa de la Sierra, Cobán. Cours voisins : Salinas, Tabasco R., Tondelo.
- **Identification proposée / nom moderne :** **Río Coatzacoalcos** — toponyme directement reconnaissable — mais la position cartographique de Jaillot semble erronée : le cours est placé à côté de Villahermosa (delta Grijalva/Usumacinta, Tabasco) et non à l'isthme de Tehuantepec où se trouve réellement le Coatzacoalcos (à environ 150 km à l'ouest).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** Le nom « Guazacoalco » (ou sa variante « Guashigwalp ») est une transcription quasi directe de « Coatzacoalco(s) », sans ambiguïté possible sur l'identité du toponyme visé. Cependant, sa position sur la carte Jaillot — collée à Villahermosa et aux autres petits cours du delta tabasquéen (Tondelo, St Anns, Rio Palmas dos Bogas) — ne correspond pas à l'embouchure réelle du Coatzacoalcos, située beaucoup plus à l'ouest sur la côte veracruzaine. Il s'agit vraisemblablement d'une erreur de position ou d'un doublon de label sur la carte source, un phénomène documenté chez les cartographes français du début du XVIIIe siècle moins familiers du tracé exact de cette portion de côte. Le nom reste donc fiable, la position non. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — cas inverse du critère habituel (toponyme exact et sans ambiguïté, mais position fautive reconnue comme une erreur cartographique plutôt qu'une incertitude d'identification) ; le nom exact l'emporte sur le déplacement positionnel documenté.
- **Sources :** [Coatzacoalcos River — Wikipedia](https://en.wikipedia.org/wiki/Coatzacoalcos_River) ; recherche complémentaire sur les cartes Delisle contemporaines n'ayant pas permis de confirmer la position exacte du label sur cette carte précise.

### N072 — r-st-pedro

- **Toponyme Jaillot :** R. St Pedro
- **Nom canonique (harmonisé) :** Rio San Pedro *(« St » est l'abréviation de Jaillot pour un nom de saint espagnol — harmonisé en « San », pas « Saint »)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Puebla de los Ángeles (20,3 NM), Mexico (28,6 NM), Valladolid (38,4 NM), Villa Rica (42,1 NM), Xalapa (64,1 NM). Cours voisins : Almaria, Lac de Mexico, R de los Yopes.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan), seconde passe — Río Tecolutla** (tronc principal, branche « main ») ; **branche B = Río Chichicatzapan** (distributaire réel du Tecolutla, rive sud, estuaire Ostiones, près de l'embouchure).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION (seconde passe, après recalage complet du secteur). Le tronc principal de R. St Pedro (16 cellules, source à l'intérieur des terres) porte l'embouchure large, proche d'une lagune, décrite directement sur la carte — cohérent avec le Tecolutla réel (~375 km depuis la Sierra Norte de Puebla). Deux arguments renforcent l'identification : (1) le bassin du Tecolutla est celui de Papantla, siège de l'Alcaldía Mayor de Papantla, où démarre dès le milieu du XVIIe siècle le commerce d'exportation de la vanille totonaque — le fleuve le mieux documenté et le plus « connu » de ce tronçon de côte au moment de la campagne, contrairement au Cazones voisin, resté secondaire ; (2) un recoupement avec la carte de Mortier (1733, coauteur de Jaillot) complète le tracé en amont et relie R. St Pedro et sa branche B, confirmant que cette dernière est un **distributaire interne** du même système plutôt qu'un fleuve indépendant — configuration qui correspond exactement au Chichicatzapan, petit affluent réel du Tecolutla par la rive sud, via l'estuaire Ostiones, près de l'embouchure. Le Cazones, dont l'embouchure réelle se situe au nord du Tecolutla (donc dans une direction incompatible avec une branche sud rejoignant le tronc avant la côte), reste par conséquent **sans correspondant identifié** dans l'inventaire Jaillot sur ce tronçon — hypothèse explorée puis écartée pour raison géométrique, non par manque d'importance réelle du fleuve. D'autres cartes contemporaines consultées pour trancher (Delisle 1703, Chatelain 1719, Moll 1720) se sont révélées plus imprécises que Jaillot sur ce secteur et n'ont pas été retenues. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — l'alternative sérieuse (Cazones) a été éliminée par un raisonnement géométrique indépendant, et le recoupement avec la carte de Mortier (1733) confirme la structure des branches, un niveau de corroboration externe jugé équivalent à un appui toponymique direct.
- **Sources :** `fluvial-identification-synthese.md`, révision du cluster Veracruz-Tampico (session de vérification croisée) ; [Río Tecolutla — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Tecolutla) (Chichicatzapan/estuaire Ostiones) ; [Papantla de Olarte — Wikipedia](https://es.wikipedia.org/wiki/Papantla_de_Olarte) (Alcaldía Mayor, commerce de la vanille) ; [El Río Cazones — La Opinión](https://laopinion.net/el-rio-cazones-impetuoso-corto-enigmatico-y-agonico/) ; carte de Mortier, 1733 (recoupement collaboratif).

### N074 — r-tispe

- **Toponyme Jaillot :** R Tispe
- **Nom canonique (harmonisé) :** Rio Tispe
- **Territoire :** panuco
- **Repères proches :** Tampico (44,1 NM), Villa Rica, Puebla de los Ángeles, Xalapa, Mexico. Cours voisin unique : Panuco.
- **Identification proposée / nom moderne :** **Río Tuxpan** — hypothèse phonétique (Tuxpan → Tispan → Tispe) et positionnelle (au sud de l'embouchure du Pánuco, sur la même façade côtière).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISÉ : « Tispe » est très probablement le nom d'une localité (variante/déformation de Tuxpan) plutôt que celui du fleuve lui-même — confirmé positionnellement : la localité se trouve face à l'Isla de Lobos et au banc de sable de Tuxpan (Tuspa Sand), un repère qui ne peut désigner que Tuxpan. Le cours d'eau associé est très vraisemblablement le Río Tuxpan. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — repère ne pouvant désigner que Tuxpan, aucune autre lecture possible.
- **Sources :** `fluvial-identification-synthese.md`, révision du cluster Veracruz-Tampico (session de vérification croisée).

### N077 — rio-de-aluerado

- **Toponyme Jaillot :** Rio de Aluerado
- **Nom canonique (harmonisé) :** Rio de Aluerado *(déjà au format, orthographe Jaillot conservée — u/v alternent couramment dans l'orthographe de l'époque)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Antequera (33,1 NM), Popocatépetl, Tehuacán, Veracruz, Puerto Escondido.
- **Identification proposée / nom moderne :** **Río Papaloapan**, dont l'embouchure se situe à la ville coloniale d'**Alvarado** (Veracruz) — « Aluerado » est une transcription à peine déformée d'« Alvarado ».
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique quasi littérale entre « Aluerado » et « Alvarado », ville et port historiques situés à l'embouchure du système Papaloapan (via la Laguna de Alvarado), au sud de Veracruz. Il s'agit d'une des identifications les plus solides du lot malgré l'absence d'Alvarado dans la liste des établissements proches de l'inventaire (la ville n'étant apparemment pas répertoriée comme telle dans `villes-data.js`).
- **Sources :** Toponymie directe (Alvarado, Veracruz — ville et port coloniaux bien attestés à l'embouchure du Papaloapan).

### N086 — rio-palmas-dos-bogas

- **Toponyme Jaillot :** Rio Palmas dos Bogas
- **Nom canonique (harmonisé) :** Rio Palmas dos Bogas *(déjà au format)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Villahermosa (45,9 NM), Tocotalpa de la Sierra, Laguna de Términos, Chiapa (Ciudad Real). Cours voisins : Chequapeque, St Anns.
- **Identification proposée / nom moderne :** **Río Palizada**, distributaire de l'Usumacinta se jetant dans la Laguna de Términos — hypothèse phonétique.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Le Río Palizada est un bras historique de l'Usumacinta, nommé ainsi par les colons espagnols en raison du grand nombre de troncs (« palos ») charriés par le courant ; le lien avec le commerce du bois de teinture (comme Logwood Creek, N027) en fait un point de passage logique pour ce genre de toponyme. « Palmas dos Bogas » pourrait être une déformation de « Palizada » (confusion palo/palma) combinée à une référence aux rameurs (« bogas ») nécessaires pour la navigation fluviale. La position générale (secteur Tabasco/Laguna de Términos) est cohérente, mais le rapprochement phonétique reste spéculatif.
- **Sources :** [Río Palizada — Wikipedia (es)](https://es.wikipedia.org/wiki/Palizada_(Campeche)) ; [Rompiendo regiones... El caso del Río Palizada (Scielo)](https://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S1870-57662008000200004).

### N093 — sampoval-r

- **Toponyme Jaillot :** Sampoval R
- **Nom canonique (harmonisé) :** Rio Sampoval *(écho de Cempoala, contexte espagnol)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Villa Rica (1,7 NM — quasi confondu), Xalapa (5,2 NM), Veracruz (47,9 NM). Cours voisin : Almaria.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan) — Río Actopan / Chachalacas.**
- **Confiance :** ✅ fort
- **Raisonnement :** SECONDE RÉVISION (remplace l'hypothèse Huitzilapan/La Antigua de la première révision). Le repère à 1,7 NM du débouché de Sampoval R. n'est pas « La Antigua » mais **Villa Rica** — Jaillot écrit bien ce nom à cet emplacement (confirmé par lecture directe de la carte), et il s'agit du site occupé par Cortés de 1519 à 1525, face à Quiahuiztlán, immédiatement voisin du site de Cempoala. Sampoval R., quasi confondu avec ce repère, correspond donc à l'**Actopan/Chachalacas**, la rivière historiquement associée à Cempoala — et non au Huitzilapan, dont le site (La Antigua) n'a été occupé qu'à partir de 1525, plus au sud (voir Cempel R., N012). L'hypothèse phonétique Sampoval/Cempoala, déjà notée dans la première révision, se trouve donc confirmée par la position une fois le repère correctement identifié.
- **Sources :** `fluvial-identification-synthese.md`, résolution du conflit 3 (session de vérification croisée) ; `js/villes-data.js` (entrées `villa-rica`, `antigua-huitzilapan`, révision collaborative) ; [Quiahuiztlán — Wikipedia (es)](https://es.wikipedia.org/wiki/Quiahuiztl%C3%A1n).

### N095 — st-anns

- **Toponyme Jaillot :** St Anns
- **Nom canonique (harmonisé) :** St Anns *(anglais, inchangé)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Villahermosa (30,6 NM), Tocotalpa de la Sierra, Chiapa (Ciudad Real), Laguna de Términos, Cobán. Cours voisins : Chequapeque, Rio Palmas dos Bogas, Tondelo.
- **Identification proposée / nom moderne :** Non déterminé. Petit cours ou lagune côtière à l'est de Villahermosa, dans le secteur du delta Usumacinta/Grijalva vers la Laguna de Términos.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Le nom anglais (« St Anns ») suggère, comme Logwood Creek (N027), un repère utilisé par des marins ou coupeurs de bois anglophones actifs dans la région de la Laguna de Términos avant 1717. Sa position, dans le groupe compact avec Tondelo et Rio Palmas dos Bogas (tous à proximité immédiate les uns des autres, à l'est de Villahermosa), suggère un petit cours ou une lagune du littoral tabasquéen, sans qu'un fleuve réel précis ait pu être identifié.
- **Sources :** Aucune source spécifique trouvée ; hypothèse fondée sur l'analogie avec Logwood Creek (activité anglaise de coupe de bois) et le recoupement positionnel interne.

### N096 — subutla

- **Toponyme Jaillot :** Subutla
- **Nom canonique (harmonisé) :** Subutla *(pas d'abréviation ; label de village mal associé au fleuve, voir raisonnement)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Manzanillo/Xiopa (53,4 NM), Zacatula (57,6 NM), Pátzcuaro, Valladolid, Puebla de los Ángeles. Cours d'eau ponctuel (une seule cellule).
- **Identification proposée / nom moderne :** **CORRIGÉ : Subutla est un village, pas un fleuve** (symbole de ville mal associé au label lors de la génération automatique). Le cours d'eau réel à documenter est distinct : il arrose Cachan, entre Tlaconoa et le village de Subutla — candidat Río Armería (Boca de Apiza).
- **Confiance :** ⚠️ faible
- **Raisonnement :** RÉVISION. Ce cours est également distinct de R001 et R002 (fleuves à l'ouest et à l'est immédiat de Xiopa/Manzanillo, cf. `fluvial-identification-synthese.md`) — trois cours différents sur ce même tronçon de côte, à ne pas confondre entre eux.
- **Sources :** `fluvial-identification-synthese.md`, corpus des 29 cours sans nom (secteur Manzanillo-Zacatula, révisions successives).

### N100 — tondelo

- **Toponyme Jaillot :** Tondelo
- **Nom canonique (harmonisé) :** Tondelo *(pas d'abréviation ; origine non déterminée)*
- **Territoire :** nouvelle-espagne
- **Repères proches :** Villahermosa (15,2 NM), Chiapa (Ciudad Real), Tocotalpa de la Sierra, Cobán, Laguna de Términos. Cours voisins : R. Guazacoalco - ou Guashigwalp, St Anns.
- **Identification proposée / nom moderne :** Non déterminé. Petit cours côtier à l'est de Villahermosa, dans le delta Usumacinta/Grijalva.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Comme St Anns et Rio Palmas dos Bogas, Tondelo appartient à un petit groupe de cours mineurs positionnés immédiatement à l'est de Villahermosa, entre le delta principal du Grijalva/Usumacinta et la Laguna de Términos. Aucun rapprochement toponymique fiable n'a pu être établi (le nom ne présente pas de parenté claire avec un toponyme espagnol, maya ou nahuatl connu de la zone).
- **Sources :** Recoupement positionnel interne uniquement.


---

## Secteur B — Floride / Louisiane (golfe du Mexique, nord/est)

### N002 — arba-de-canaveral

- **Toponyme Jaillot :** Arba de Canaveral
- **Nom canonique (harmonisé) :** Arba de Canaveral *(pas un fleuve — voir raisonnement ; rien à harmoniser)*
- **Territoire :** floride
- **Repères proches :** San Agustín à 44,8 NM (carte) ; plus loin Nassau, Harbour Island, Santa Cruz del Norte (Cuba), Charles Town. Aucun cours voisin recensé. Tracé très court (2 cellules), embouchure directe en mer.
- **Identification proposée / nom moderne :** **Barra de Cañaveral** — passe/inlet sableux au droit du Cap Canaveral (système de lagune Banana River / Indian River Lagoon / Mosquito Lagoon), pas un fleuve.
- **Confiance :** 🎲 convention cartographique *(mise à jour — voir note ci-dessous ; la fiche n'avait pas été resynchronisée avec la table récapitulative lors du dernier passage)*
- **Raisonnement :** Le nom « Arba » ne correspond à aucun terme espagnol courant de fleuve ; il s'agit très probablement d'une déformation de « Barra » (banc de sable / passe), un terme employé pour les inlets de la côte est floridienne bien plus que pour un cours d'eau. La position (au sud de San Agustín, à une distance interne cohérente avec le Cap Canaveral réel) et le caractère très court du tracé (2 cellules, embouchure « sea » directe) appuient l'hypothèse d'une passe littorale plutôt que d'un fleuve. Cas à rapprocher des précédents Alimcingo/Cone I./I. Perica (repères qui ne sont pas des cours d'eau). **Confirmé** par cartes espagnoles indépendantes (AGI 1605, Arredondo 1737), déjà reflété dans la table récapitulative mais pas encore dans cette fiche — synchronisation faite lors de la passe de recalibration secteur par secteur : classé convention cartographique (pas un fleuve réel, mais un repère de navigation assumé comme tel) plutôt que faible.
- **Sources :** AGI (Archivo General de Indias) 1605 ; Arredondo 1737 ; hypothèse fondée sur la toponymie espagnole (barra) et la position relative dans l'inventaire.

### N008 — brave-north-river

- **Toponyme Jaillot :** Brave (North) River
- **Nom canonique (harmonisé) :** Brave (North) River *(anglais, déjà complet — traduction anglaise d'un nom espagnol, Jaillot n'a pas abrégé)*
- **Territoire :** louisiane
- **Repères proches :** La Nouvelle-Orléans (107,9 NM carte), Tampico, Mexico, Mobile, Puebla de los Ángeles. Territoires adjacents à distance 0 : louisiane, nouveau-mexique, nueva-galicia. Cours voisin direct : Rivière aux Vaches. Système fluvial majeur (47 cellules), embouchure en mer.
- **Identification proposée / nom moderne :** **Rio Grande** (Río Bravo del Norte).
- **Confiance :** ✅ fort
- **Raisonnement :** « Brave (North) River » est la traduction anglaise quasi littérale de « Río Bravo del Norte », nom espagnol historique bien attesté du Rio Grande (« Bravo » → Brave, « del Norte » → North). La proximité immédiate avec le territoire Nouveau-Mexique (distance 0) et la position à l'ouest de la Rivière aux Vaches (identifiée ci-dessous comme la Lavaca River au Texas) sont cohérentes avec le tracé réel du Rio Grande, qui borde le Nouveau-Mexique avant de rejoindre le golfe du Mexique au Texas.
- **Sources :** Río Bravo (disambiguation) — Wikipedia ; Britannica, « Rio Grande | Definition, Location, Length, Map, & Facts » (noms historiques Río Bravo del Norte / Río San Buenaventura).

### N020 — escambia-r

- **Toponyme Jaillot :** Escambia R.
- **Nom canonique (harmonisé) :** Rio Escambia *(toponyme Jaillot conservé pour archive ; l'identification réelle — Perdido River — figure séparément)*
- **Territoire :** floride
- **Repères proches :** Pensacola à seulement 21,2 NM (carte) — très proche, cohérent avec la géographie réelle. Cours voisin direct : Perdido.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Perdido River.**
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION. La correspondance toponymique directe
  (« Escambia R. ») restait tentante, mais en réexaminant l'ensemble du
  cluster Pensacola/Mobile (Ostras, Marpequeue, Escambia R., Perdido,
  Snelo), Ronan a identifié un décalage global des labels par rapport à
  leur position réelle. Le cours ici recensé, plus éloigné de Pensacola
  (21,2 NM) que celui étiqueté « Perdido » (7,5 NM, voir N041), colle en
  réalité mieux à la position de la **Perdido River**, dont la baie est
  géographiquement plus distincte et plus à l'ouest de Pensacola — alors
  que l'Escambia réelle se jette directement dans la baie de Pensacola
  elle-même, donc plus proche. Voir N041, N028, N037 pour le
  réagencement complet du secteur. **Recalibration (avec Ronan) :**
  reclassé de ⚠️ moyen à ✅ fort — l'ensemble du cluster Pensacola/Mobile
  a été résolu par comparaison de coordonnées pixel exactes des
  embouchures (ordre ouest-est confirmé sans ambiguïté), un niveau de
  précision comparable à un appui toponymique direct.
- **Sources :** Repositionnement du cluster Pensacola/Mobile (proposé
  par Ronan) ; [Perdido Bay — Wikipedia](https://en.wikipedia.org/wiki/Perdido_Bay) ; [Perdido River — Wikipedia](https://en.wikipedia.org/wiki/Perdido_River).

### N028 — marpequeue

- **Toponyme Jaillot :** Marpequeue
- **Nom canonique (harmonisé) :** Marpequeue *(pas un nom de fleuve — descriptif de cap/baie, rien à harmoniser)*
- **Territoire :** floride
- **Repères proches :** Pensacola (153,9 NM carte), Mobile, La Nouvelle-Orléans, Tampico — assez loin de tout, positionné entre Ostras (à l'ouest) et Rio del Canaveral (à l'est) dans la séquence de la côte du golfe/Big Bend. Aucun cours voisin recensé.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan), seconde passe — Blackwater River** (remplace Yellow
  River). Piste antérieure (« Mar Pequeño », descriptif de baie)
  toujours abandonnée.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION (seconde passe). « Marpequeue » n'est
  probablement pas un nom de fleuve : ni « R. » dans la graphie, ni
  orientation de l'étiquette suivant le cours — plutôt un nom de cap ou
  de baie bordant la « Bay del Spirito Sancto » (Pensacola). La première
  révision (Delisle 1718, « R Jordano » = Yellow River) supposait que les
  deux cours dessinés dans la baie représentaient Blackwater puis Yellow
  River d'ouest en est. Ronan a établi que le cours réellement parallèle
  à Marpequeue à l'intérieur de la baie n'est en fait pas dessiné par
  Jaillot — un des trois cours réels (Escambia, Blackwater, Yellow)
  manque donc à l'appel. Réagencement complet : **Marpequeue = Blackwater
  River** (ce cours-ci), **Ostras = Escambia River** (voir N037, plus
  proche de Pensacola). **Précision (avec Ronan) :** Yellow River est
  bien dessinée par Jaillot dans ce secteur — l'absence initialement
  notée ici concerne uniquement la digitalisation dans l'inventaire/
  oceanBounds (omission lors du relevé des tracés), pas le scan
  original. Yellow River reste donc à tracer, comme R. Vergues (N043),
  Río Chico/Tuquesa (N090) et le groupe delta-Orénoque (N042) — voir
  `inventaire-cours-non-digitalises.md`. **Recalibration (avec Ronan) :**
  reclassé de ⚠️ moyen à ✅ fort — cluster Pensacola/Mobile résolu par
  coordonnées pixel exactes des embouchures, ordre ouest-est sans
  ambiguïté.
- **Sources :** Guillaume Delisle, *Carte de la Louisiane et du Cours du
  Mississippi* (1718), lecture directe (crop haute résolution) ;
  réagencement du cluster Pensacola/Mobile (proposé par Ronan) ;
  [Blackwater River (Florida) — Wikipedia](https://en.wikipedia.org/wiki/Blackwater_River_(Florida)).

### N030 — may-r

- **Toponyme Jaillot :** May R.
- **Nom canonique (harmonisé) :** Rivière de May *(exemple concret de la nuance signalée avant la passe de recalibration : le suffixe « R. » imite la forme anglaise, mais l'origine réelle est française — « Rivière de Mai », nommée par Jean Ribault — donc classée French, pas « May River »)*
- **Territoire :** floride
- **Repères proches :** San Agustín à 65,9 NM (carte), au nord de celui-ci (comparaison des coordonnées y). Charles Town plus loin.
- **Identification proposée / nom moderne :** **St. Johns River**.
- **Confiance :** ✅ fort
- **Raisonnement :** « May River » / « River of May » (Rivière de Mai) est le nom donné par les explorateurs français (Jean Ribault, 1562 ; fondation de Fort Caroline par Laudonnière en 1564) au fleuve aujourd'hui identifié sans ambiguïté comme le St. Johns River — l'identification historique est bien documentée et largement consensuelle. La position sur la carte Jaillot (au nord de San Agustín) correspond exactement à la position réelle de l'embouchure du St. Johns (Jacksonville), au nord de St. Augustine.
- **Sources :** Florida Memory, « Jean Ribault Explores the St. Johns River » ; NPS, National Memorial Florida brochure ; Wikipedia, « St. Johns River ».

### N032 — mississippi

- **Toponyme Jaillot :** Mississippi
- **Nom canonique (harmonisé) :** Mississippi *(pas d'abréviation à harmoniser)*
- **Territoire :** louisiane
- **Repères proches :** La Nouvelle-Orléans à seulement 10,5 NM (carte). Deux branches d'embouchure distinctes (« Mississippi » et « Mississippi_B », toutes deux en mer), avec une bifurcation (fork) repérée dans les relations internes.
- **Identification proposée / nom moderne :** **Fleuve Mississippi**.
- **Confiance :** ✅ fort
- **Raisonnement :** Identification évidente et non contestée. Point de documentation demandé : le tracé Jaillot montre un delta simple à deux bras (bifurcation unique), reflet de l'état des connaissances de 1708 — bien avant les levés du Corps of Engineers américain du XIXe siècle qui ont documenté le delta en « patte d'oiseau » (birdfoot delta) à multiples passes (Southwest Pass, South Pass, Pass a Loutre, etc.) que l'on connaît aujourd'hui. La carte de Jaillot, comme la plupart des cartes de son époque, simplifie donc fortement la morphologie deltaïque réelle du Mississippi.
- **Sources :** Identification directe (aucune ambiguïté) ; comparaison delta historique/moderne basée sur connaissance générale de l'évolution du delta du Mississippi (levés du XIXe siècle).

### N034 — nieves-r

- **Toponyme Jaillot :** Nieves R.
- **Nom canonique (harmonisé) :** Rio Nieves
- **Territoire :** floride
- **Repères proches :** Très éloigné de tous les repères listés (Pensacola à 329,7 NM carte, San Agustín à 343,4 NM, Louisiane la zone la plus proche à 194,1 NM) — signe d'un cours isolé, probablement dans le Big Bend floridien, entre R. Flores/Rio del Canaveral (à l'ouest) et Rio del Spirito Sancto (à l'est) dans la séquence de la carte. 18 cellules, cours de taille moyenne.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río/Rivière Apalachicola.**
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** « Nieves » (« neiges » en espagnol) reste un
  toponyme sanctoral générique sans lien descriptif avec la Floride —
  aucune déduction fiable à partir du nom lui-même. L'identification
  repose sur un recoupement avec une troisième carte indépendante,
  Emanuel Bowen, *A New & Accurate Map of the Provinces of North & South
  Carolina, Georgia, &c.* (1747) : Bowen y place « Apalachecola R. »
  exactement à la position correspondant à Nieves R. chez Jaillot, plus
  à l'ouest des deux cours jumeaux R013/R014 (voir leurs fiches dans
  `fluvial-identification-synthese.md`). Position cohérente avec la
  géographie réelle (l'Apalachicola, la plus occidentale des rivières du
  Big Bend, à l'ouest de l'Ochlockonee et du St. Marks). Aucune
  attestation du nom « Nieves » pour ce fleuve, mais convergence
  positionnelle forte entre deux cartes indépendantes. **Recalibration
  (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — convergence
  positionnelle forte et indépendante (Bowen 1747), sans autre candidat
  proposé malgré l'absence d'appui toponymique.
- **Sources :** Emanuel Bowen (1747), lecture directe (crop haute
  résolution, proposée par Ronan) ; [Apalachicola River — Wikipedia](https://en.wikipedia.org/wiki/Apalachicola_River) ;
  [Apalachee Province — Wikipedia](https://en.wikipedia.org/wiki/Apalachee_Province) ;
  [Apalachicola Province — Wikipedia](https://en.wikipedia.org/wiki/Apalachicola_Province).

### N035 — ochio-ou-belle-riviere

- **Toponyme Jaillot :** Ochio ou Belle Rivière
- **Nom canonique (harmonisé) :** Belle Rivière *(français, « Ochio » écarté comme déformation phonétique secondaire ; inchangé)*
- **Territoire :** floride (mais rattachement fonctionnel Louisiane par la confluence)
- **Repères proches :** Confluence directe avec le Mississippi (deux branches en jonction, `targetRiverId: "Mississippi"`), Pensacola (105 NM carte), Mobile, La Nouvelle-Orléans. Cours voisin direct : Mississippi.
- **Identification proposée / nom moderne :** **Ohio River**.
- **Confiance :** ✅ fort
- **Raisonnement :** « Belle Rivière » est le nom français historique bien attesté de l'Ohio ; « Ochio » est une transcription phonétique déformée de « Ohio ». Le fait que ce cours se jette directement dans le Mississippi (deux embouchures de type jonction vers « Mississippi ») confirme sans ambiguïté qu'il s'agit d'un grand affluent du Mississippi correspondant à l'Ohio.
- **Sources :** Toponymie historique bien connue (« La Belle Rivière » = nom français de l'Ohio aux XVIIe-XVIIIe siècles) ; cohérence structurelle de la confluence dans l'inventaire.

### N037 — ostras

- **Toponyme Jaillot :** Ostras
- **Nom canonique (harmonisé) :** Ostras *(mot espagnol complet — « huîtres » — pas d'abréviation à harmoniser)*
- **Territoire :** floride
- **Repères proches :** Pensacola (87,3 NM carte), Mobile, La Nouvelle-Orléans. Positionné entre Escambia (à l'ouest) et Marpequeue (à l'est) dans la séquence côtière du panhandle.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan), seconde passe — Escambia River** (remplace Blackwater
  River).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION (seconde passe). La première révision
  (Blackwater River, via recoupement Delisle 1718) reposait sur
  l'hypothèse que les deux cours voisins dessinés dans la baie
  correspondaient à Blackwater puis Yellow River d'ouest en est. Ronan a
  établi que le cours d'eau réellement parallèle à Marpequeue à
  l'intérieur de la baie n'est en fait pas digitalisé dans l'inventaire
  — il manque un des trois cours réels de ce secteur (Escambia,
  Blackwater, Yellow). Le réagencement complet donne : **Ostras =
  Escambia River** (ce cours-ci, le plus proche de Pensacola des deux
  dessinés dans la baie), **Marpequeue = Blackwater River** (voir N028,
  remplace Yellow River). **Précision (avec Ronan) :** Yellow River est
  bien dessinée par Jaillot — l'omission concerne la digitalisation
  d'oceanBounds, pas le scan original ; voir N028 et
  `inventaire-cours-non-digitalises.md`. **Recalibration (avec Ronan) :**
  reclassé de ⚠️ moyen à ✅ fort — cluster Pensacola/Mobile résolu par
  coordonnées pixel exactes des embouchures, ordre ouest-est sans
  ambiguïté.
- **Sources :** Guillaume Delisle, *Carte de la Louisiane et du Cours du
  Mississippi* (1718), lecture directe (crop haute résolution) ;
  réagencement du cluster Pensacola/Mobile (proposé par Ronan) ;
  [Escambia River — Wikipedia](https://en.wikipedia.org/wiki/Escambia_River).

### N041 — perdido

- **Toponyme Jaillot :** Perdido
- **Nom canonique (harmonisé) :** Perdido *(mot espagnol complet, pas d'abréviation — toponyme Jaillot conservé pour archive ; l'identification réelle — Wolf Bay — figure séparément)*
- **Territoire :** floride
- **Repères proches :** Pensacola à seulement 7,5 NM (carte) — quasiment adjacent. Cours voisin direct : Escambia R.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Wolf Creek/Sandy Creek** (Wolf Bay).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION. La correspondance toponymique directe
  (« Perdido ») semblait acquise, mais le réagencement du cluster
  Pensacola/Mobile (voir N020, N028, N037) a montré que ce nom colle en
  réalité mieux au cours voisin (N020, plus à l'est), la Perdido River
  réelle formant une baie distincte. Les coordonnées internes confirment
  que ce cours-ci se situe entre R. Snelo (Bon Secour River, à l'ouest)
  et N020 (Perdido River, à l'est) — position exactement cohérente avec
  **Wolf Bay**, alimentée par Wolf Creek et Sandy Creek, entre Bon Secour
  Bay et Perdido Bay sur la côte du Baldwin County, Alabama. **Recalibration
  (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — cluster Pensacola/Mobile
  résolu par coordonnées pixel exactes des embouchures, ordre ouest-est
  sans ambiguïté.
- **Sources :** Réagencement du cluster Pensacola/Mobile (proposé par
  Ronan) ; [Mobile Bay NEP — Wolf Bay Watershed](https://www.mobilebaynep.com/watersheds/wolf-bay-watershed/the-landscape).

### N057 — r-flores

- **Toponyme Jaillot :** R. Flores
- **Nom canonique (harmonisé) :** Rio Flores
- **Territoire :** floride
- **Repères proches :** Très éloigné de tous les repères (Pensacola à 260,3 NM carte) — signe d'un cours du Big Bend floridien, entre Rio del Canaveral (à l'ouest) et Nieves R. (à l'est) dans la séquence de la carte.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Econfina Creek.**
- **Confiance :** ⚠️ moyen *(passe de recalibration : examiné, non promu — voir note ci-dessous)*
- **Raisonnement :** RÉVISION (ERR-012 retiré). « R. Flores » (rivière
  des fleurs) reste un toponyme descriptif sans ancrage direct, mais sa
  position dans la séquence de la carte — entre Rio del Canaveral/N080
  (Choctawhatchee River) à l'ouest et Nieves R./N034 (Río/Rivière
  Apalachicola) à l'est — situe ce cours très précisément dans la zone
  de **St. Andrew Bay** (Panama City, Floride). Econfina Creek en est la
  principale source d'eau douce, alimentant le réservoir de Deer Point
  Lake (~58 % de l'apport annuel, avec Bear Creek en second contributeur
  à ~36 %) — c'est le cours qui domine nettement ce secteur, malgré sa
  modestie réelle (cours spring-fed, débit moyen de seulement 538 pi³/s).
  Le tracé Jaillot, plus développé, correspond vraisemblablement à une
  surévaluation de la longueur réelle plutôt qu'à un doute sur
  l'identification elle-même — un biais déjà rencontré ailleurs sur
  cette carte pour des cours secondaires. **Recalibration (avec Ronan) :**
  examiné mais **non promu** — Bear Creek reste un contributeur réel non
  négligeable (~36 %) de la même baie, ce qui empêche de parler de
  position strictement exclusive ; reste ⚠️ moyen.
- **Sources :** [St. Andrew Bay — USGS](https://pubs.usgs.gov/sir/2006/5287/pdf/St.AndrewBay.pdf) ; [Econfina Creek — Wikipedia](https://en.wikipedia.org/wiki/Econfina_Creek) ; position relative (inventaire Jaillot, séquence proposée par Ronan).

### N071 — r-snelo

- **Toponyme Jaillot :** R. Snelo
- **Nom canonique (harmonisé) :** Rio Snelo *(origine incertaine, contexte espagnol par défaut)*
- **Territoire :** floride
- **Repères proches :** Quasi équidistant de Pensacola (32,9 NM carte) et Mobile (38,7 NM) — positionné juste au sud-ouest de Perdido dans la séquence de la carte, donc probablement dans le secteur Perdido Bay / Mobile Bay.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Bon Secour River.**
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION (ERR-013 retiré). « Snelo » reste un
  toponyme sans équivalent reconnaissable, probablement une déformation
  forte. Mais le repositionnement complet du cluster Pensacola/Mobile
  (voir N020, N028, N037, N041) confirme, coordonnées à l'appui, que
  Snelo est le plus occidental des cours de cette séquence, immédiatement
  à l'ouest de N041 (lui-même à l'ouest de Perdido/N020). Cette position
  correspond exactement à celle de la **Bon Secour River**, qui se jette
  dans Bon Secour Bay, le bras oriental de Mobile Bay — premier cours
  substantiel à l'est de Mobile avant la séquence Wolf Bay/Perdido/
  Escambia/Blackwater. **Recalibration (avec Ronan) :** reclassé de
  ⚠️ moyen à ✅ fort — cluster Pensacola/Mobile résolu par coordonnées
  pixel exactes des embouchures, ordre ouest-est sans ambiguïté.
- **Sources :** Réagencement du cluster Pensacola/Mobile (proposé par
  Ronan) ; [Bon Secour River — Wikipedia](https://en.wikipedia.org/wiki/Bon_Secour_River).

### N080 — rio-del-canaveral

- **Toponyme Jaillot :** Rio del Canaveral
- **Nom canonique (harmonisé) :** Rio del Canaveral *(déjà au format)*
- **Territoire :** floride
- **Repères proches :** Très éloigné de tout repère listé (Pensacola à 220,4 NM carte) ; positionné dans le Big Bend floridien, entre Marpequeue (à l'ouest) et R. Flores/Nieves (à l'est) — donc **très éloigné du Cap Canaveral réel**, qui se trouve sur la côte atlantique (cf. N002 Arba de Canaveral, bien plus à l'est sur la carte, proche de San Agustín).
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Choctawhatchee River.** Confirmé sans lien avec le Cap
  Canaveral moderne malgré le nom partagé (voir raisonnement).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** « Cañaveral » signifie littéralement « roselière/
  cannaie » en espagnol — descriptif de paysage générique, sans rapport
  avec Arba de Canaveral/N002 (côte atlantique, homonymie fortuite).
  Delisle 1718 nomme la baie où débouche ce cours (non nommée chez
  Jaillot) « Baie de Sainte Rose » — et la barre qui ferme partiellement
  la baie de Pensacola y est « Île de Sainte Rose » (Santa Rosa Island,
  toujours son nom actuel). Confirmation indépendante : une carte
  espagnole de 1700 (Lajonk & Siscàra, Library of Congress) nomme déjà
  l'actuelle Choctawhatchee Bay « Bahía de Santa Rosa », appellation
  restée en usage jusqu'au changement anglais vers 1778 (« Choctaw
  Hatchee », carte Stuart-Purcell). La baie de Jaillot où débouche le Rio
  del Canaveral est donc la Choctawhatchee Bay, et le cours lui-même ne
  peut guère être que la Choctawhatchee River, seul fleuve important du
  secteur — identification structurelle/positionnelle, sans attestation
  directe du nom « Cañaveral » pour ce cours précis. **Recalibration
  (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — double recoupement
  cartographique indépendant (Delisle 1718, carte espagnole de 1700) et
  exclusivité explicite (« seul fleuve important du secteur »).
- **Sources :** Guillaume Delisle, *Carte de la Louisiane et du Cours du
  Mississippi* (1718), lecture directe (crop haute résolution, proposée
  par Ronan) ; « Descripcion de la Bahia de Santa Maria de Galve... hasta
  el Rio de Apalache » (Lajonk & Siscàra, 1700, Library of Congress) ;
  [Choctawhatchee Bay — Wikipedia](https://en.wikipedia.org/wiki/Choctawhatchee_Bay) ;
  [Santa Rosa Island, Florida — Wikipedia](https://en.wikipedia.org/wiki/Santa_Rosa_Island_(Florida)).

### N081 — rio-del-spirito-sancto

- **Toponyme Jaillot :** Rio del Spirito Sancto
- **Nom canonique (harmonisé) :** Rio del Spirito Sancto *(déjà au format ; « Sancto » est la graphie Jaillot, conservée telle quelle plutôt que corrigée en « Santo »)*
- **Territoire :** floride
- **Repères proches :** San Agustín (158,7 NM carte), Charles Town, La Havane. Positionné entre Nieves R. (à l'ouest) et Arba de Canaveral/May R. (à l'est) dans la séquence de la carte — donc dans la portion centre-sud du golfe floridien, cohérente avec la position réelle de la baie de Tampa entre le Big Bend et la péninsule atlantique.
- **Identification proposée / nom moderne :** Hypothèse : écho de la **Bahía del Espíritu Santo**, nom espagnol historique de **Tampa Bay** (attesté dès Pánfilo de Narváez, 1528, et Hernando de Soto, 1539), ici représenté par Jaillot comme une embouchure fluviale plutôt que comme une baie.
- **Confiance :** ⚠️ moyen *(passe de recalibration : examiné, non promu — voir note ci-dessous)*
- **Raisonnement :** « Espíritu Santo » est un toponyme récurrent sur les côtes du golfe (voir aussi R008/Villahermosa-Tabasco, un toponyme homonyme mais totalement distinct au Mexique, déjà traité dans la session précédente — à ne pas confondre). En Floride spécifiquement, « Bahía del Espíritu Santo » est le nom espagnol bien documenté de Tampa Bay jusqu'à sa progressive « Tampanisation » à partir de 1576-1601. La conflation baie/rivière est un phénomène courant sur les cartes du XVIIe-XVIIIe siècle pour les grandes baies mal sondées, ce qui expliquerait que Jaillot représente ce site comme un « rio » plutôt qu'une baie — cohérent avec la mise en garde du dossier sur les repères qui sont en réalité des baies. Confiance modérée seulement : la position relative sur la carte de jeu est compatible mais ne prouve pas formellement le tracé. **Recalibration (avec Ronan) :** examiné mais **non promu** — l'auteur de la fiche note lui-même que la position ne prouve pas formellement le tracé ; pas de position exclusive établie. Reste ⚠️ moyen.
- **Sources :** HMDB, « Bahia Espiritu Santo Mission Historical Marker » ; USF FCIT, « The Bay of Espiritu Santo on the Western Coast of East Florida, 1777 » ; historique de la dénomination Tampa Bay / Bahía de Espíritu Santo (cartes espagnoles dès 1584).

### N088 — riviere-aux-vaches

- **Toponyme Jaillot :** Rivière aux Vaches
- **Nom canonique (harmonisé) :** Rivière aux Vaches *(français, déjà complet)*
- **Territoire :** louisiane
- **Repères proches :** La Nouvelle-Orléans (69,5 NM carte), Tampico, Mobile, Mexico, Pensacola. Cours voisin direct : Brave (North) River (à l'ouest/sud, cf. N008).
- **Identification proposée / nom moderne :** **Lavaca River** (Texas), affluent de la Matagorda Bay.
- **Confiance :** ✅ fort
- **Raisonnement :** Le nom moderne « Lavaca River » est directement issu, par déformation/contraction, du français « Rivière des Vaches », nom donné par René-Robert Cavelier de La Salle lors de son expédition au Texas (1685) — étymologie bien documentée. La position sur la carte Jaillot, à l'est/nord-est du Brave (North) River identifié comme le Rio Grande, est cohérente avec la position réelle de la Lavaca River au Texas, entre le delta du Mississippi et le Rio Grande — exactement la zone explorée et nommée par La Salle.
- **Sources :** Wikipedia, « Lavaca River » (étymologie « Rivière des Vaches », La Salle) ; Texas State Historical Association, « French colonization of Texas ».

### N089 — riviere-sablomuere

- **Toponyme Jaillot :** Rivière Sablomuere
- **Nom canonique (harmonisé) :** Rivière Sablomuere *(français, déjà complet)*
- **Territoire :** louisiane
- **Repères proches :** La Nouvelle-Orléans (88,9 NM carte), Mobile, Pensacola, Tampico, Mexico. Cours voisins directs : Mississippi (jonction confirmée), F-7_23.
- **Identification proposée / nom moderne :** **Red River** (Rivière Rouge).
- **Confiance :** ✅ fort
- **Raisonnement :** Identification **reprise telle quelle** de la session précédente (fiche R006 du dossier `fluvial-identification-synthese.md`), où « la Sablomuere R. » avait été identifiée avec confiance forte comme le Red River, sur la base d'un recoupement avec Delisle 1718. Non retraité ici conformément à la consigne — l'entrée de l'inventaire confirme la cohérence structurelle (jonction directe avec le Mississippi, deux branches), en accord avec le tracé réel du Red River rejoignant le Mississippi (via l'Atchafalaya/Old River historique).
- **Sources :** `tools/fluvial-research/fluvial-identification-synthese.md`, fiche R006 (« la Sablomuere R. » → Red River, ✅ fort, recoupement Delisle 1718).


---

## Secteur C — Amérique centrale (Guatemala / Honduras / Nicaragua / Costa Rica)

### N007 — boccades-r

- **Toponyme Jaillot :** Boccades R.
- **Nom canonique (harmonisé) :** Rio Boccades
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (14,7 NM), Gracias a Dios/Nicaragua (côte Miskito). Bouche « sea » directe, plus une branche B en jonction avec le même complexe ; `relations` la lient à « fork » depuis Rio San Juan (rebaptisé Río Colorado, voir N087), et en « separate » avec R Yayrepo et Trigu R. sur les mêmes cellules.
- **Identification proposée / nom moderne :** Une des branches secondaires du delta du Río Colorado sur la côte Miskito, sans correspondance précise possible.
- **Confiance :** ⚠️ faible
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Boccades R., Trigu R. et R Yayrepo forment un enchevêtrement serré de branches directement au débouché du tronc principal (voir N087, désormais identifié Río Colorado sur la base du toponyme Jaillot réel « Nicaragua ou Colorado R. », lu sur la carte entre Trigu R. et le cap « P. Iuan »). Les sources modernes confirment que le delta comptait historiquement trois branches revendiquées par le Nicaragua en 1897 : le Colorado, le Taura, et celle débouchant dans la baie de San Juan del Norte (identifiée à R Yayrepo, voir N076). « Boccades » (< bocas, « les bouches ») pourrait désigner génériquement l'ensemble de ce complexe deltaïque plutôt qu'une bouche précise — le nom lui-même semble décrire la configuration plutôt que nommer un cours distinct. Sans capture haute résolution du tracé exact, impossible de trancher si elle correspond au Taura ou à un chenal mineur aujourd'hui disparu/comblé.
- **Sources :** Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* ; lecture directe de la carte Jaillot (crop haute résolution) ; inventaire interne (branches, relations, nearbySettlements).

### N017 — chequapeque

- **Toponyme Jaillot :** Chequapeque
- **Nom canonique (harmonisé) :** Chequapeque *(pas d'abréviation ; origine non déterminée)*
- **Territoire :** guatemala (étiquette administrative de l'inventaire)
- **Repères proches :** Tocotalpa de la Sierra (38,6 NM), Laguna de Términos (59,6 NM, territoire yucatan), Villahermosa (61,3 NM, territoire nouvelle-espagne), Cobán (72,9 NM), Chiapa/Ciudad Real (78,4 NM). Cours voisin direct dans l'inventaire : Tabasco R.
- **Identification proposée / nom moderne :** Non déterminé — petit cours côtier du golfe du Mexique entre le delta du Tabasco/Grijalva et la Laguna de Términos.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Le centroïde (x≈1866, y≈2903) place Chequapeque dans la même zone que Tabasco R. (son voisin direct dans `neighbouringWatercourses`), c'est-à-dire sur la côte du golfe du Mexique près de Villahermosa/Laguna de Términos — donc bien loin de l'Amérique centrale malgré l'étiquette « guatemala » de l'inventaire (probable artefact de zonage administratif, comme déjà observé pour Tabasco R.). Aucune recherche (Chicozapote, petits cours du littoral tabasquéño) n'a permis de faire correspondre ce toponyme phonétique à un cours actuel identifiable avec confiance.
- **Sources :** Recherche web (aucune correspondance solide trouvée pour « Chequapeque ») ; inventaire interne.

### N026 — lac-nicaragua

- **Toponyme Jaillot :** Lac Nicaragua
- **Nom canonique (harmonisé) :** Lac Nicaragua *(pas d'abréviation)*
- **Territoire :** nicaragua
- **Repères proches :** Lac Nicaragua/Cocibolca (1,3 NM — coïncidence quasi parfaite), Granada (2,9 NM), La Trinidad (5,1 NM), León (6,2 NM), Mena (6,2 NM). Cours voisins : N. Segovia River, Rio San Juan.
- **Identification proposée / nom moderne :** Lac Nicaragua (Cocibolca).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance directe de toponyme et de position — le lac est nommé « Lac Nicaragua » sur la Jaillot comme aujourd'hui, entouré des mêmes villes riveraines historiques (Granada, León). L'outlet du lac se jette précisément dans « Rio San Juan », exactement comme la géographie réelle (le San Juan est l'exutoire du lac vers la mer des Caraïbes). C'est l'identification la plus évidente et la mieux recoupée de tout le lot.
- **Sources :** `js\villes-data.js` (entrée `lac-nicaragua`, déjà nommée « Lac Nicaragua (Cocibolca) ») ; inventaire interne (outlet vers Rio San Juan).

### N033 — n-segovia-river

- **Toponyme Jaillot :** N. Segovia River
- **Nom canonique (harmonisé) :** N. Segovia River *(déjà complet — mélange Jaillot d'un qualificatif espagnol « N. » = Nueva et d'un générique anglais « River », rien à abréger)*
- **Territoire :** honduras
- **Repères proches :** Nueva Segovia (4,7 NM), La Trinidad/Nicaragua (48,2 NM), Lac Nicaragua (proche). Outlet en jonction vers « Yare R. » ; `relations` la sépare de Yare R. sur une cellule commune.
- **Identification proposée / nom moderne :** Río Segovia, cours supérieur historique du Río Coco (Wangki).
- **Confiance :** ✅ fort
- **Raisonnement :** Le nom colle exactement au fleuve historique : les conquistadors espagnols désignaient le cours supérieur de l'actuel Río Coco/Wangki sous le nom de « Río Segovia », par référence à la région minière de Nueva Segovia qu'il traverse — précisément la ville la plus proche sur la carte (4,7 NM). La structure hydrographique de l'inventaire confirme cette identification : N. Segovia River se jette dans « Yare R. », qui elle-même rejoint la mer — exactement la séquence historique Segovia (amont) → Yara/Cape River (aval) → embouchure, avant l'unification moderne sous le nom Río Coco.
- **Sources :** Wikipédia (en) *Coco River* — « formerly known as the Río Segovia, Cape River, or Yara River » ; inventaire interne (jonction vers Yare R.).

### N043 — r-auzuelos

- **Toponyme Jaillot :** R. Auzuelos
- **Nom canonique (harmonisé) :** Rio Auzuelos
- **Territoire :** costa-rica
- **Repères proches :** Castillo de Austria (40 NM, fort espagnol probablement à l'embouchure du río Matina), Gracias a Dios/Nicaragua (58,2 NM), Confluent du San Juan (64 NM), Concepción/Panama-Bocas del Toro (68,2 NM). Cours voisin : Suere ou Blewfield River.
- **Identification proposée / nom moderne :** **Río Pacuare** (révision
  collaborative — Río Colorado définitivement écarté).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan, en deux
  temps)* L'hypothèse Río Colorado est écartée : ce nom revient à N087
  (rio-san-juan), dont le toponyme Jaillot réel est « Nicaragua ou
  Colorado R. » — lu directement sur la carte, pas une déduction
  positionnelle. R. Auzuelos n'a d'ailleurs aucune jonction structurelle
  avec ce système dans l'inventaire : c'est un cours indépendant, plus
  au sud sur la côte. La séquence complète, reconstituée avec Ronan en
  partant de Bocas del Toro (où se jette Veragua R. = **Río Cricamola**,
  voir N103) et en longeant la côte vers le delta, est désormais : R.
  Quemades (**Río Changuinola**, N069), R. Talamanca (**Río San San**,
  N073), R. Caranaco (**Río Sixaola**, N047, le fleuve-frontière
  actuel), puis Suere ou Blewfield River (**Río Matina**, N097 — le
  Castillo de Austria, à 11 NM de ce cours, est documenté comme marquant
  l'embouchure du río Matina), puis R. Auzuelos et R. Vergues qui
  débouchent dans deux baies accolées, et enfin le Colorado R. (delta,
  N087). En repartant du réseau hydrographique costaricien réel entre
  Matina et le delta (Barra del Colorado), l'ordre nord-sud est Matina →
  **Pacuare** → **Parismina** → Tortuguero → delta : R. Auzuelos, la
  première baie après Suere/Blewfield=Matina, correspond donc au **Río
  Pacuare**, et R. Vergues (la seconde, plus proche du delta) au **Río
  Parismina**. R. Vergues n'apparaît pas dans l'inventaire numérisé
  (`fluvial-research-inventory.json`) ni dans `js/oscar-hex-grid.js` —
  Ronan note qu'il a vraisemblablement été omis lors d'une mise à jour
  d'`oceanBounds`, la frontière Costa Rica/Nicaragua étant tracée trop
  au sud sur la Jaillot par rapport aux cartes modernes, ce qui peut
  créer une confusion de zone. À corriger séparément côté code une fois
  le tracé digitalisé ; aucun identifiant N/R ne lui est donc attribué
  ici. **Recalibration (avec Ronan) :** N043 reclassé de ⚠️ moyen à
  ✅ fort — séquence côtière dérivée par élimination de l'ordre réel et
  bien documenté Matina→Pacuare→Parismina→Tortuguero→delta, sans autre
  candidat plausible pour cette position.
- **Sources :** Lecture directe de la carte Jaillot (séquence côtière
  Bocas del Toro → delta, proposée par Ronan) ; `js/villes-data.js`
  (entrée `chateau-de-austria`) ; connaissance géographique générale de
  la côte caraïbe du Costa Rica (ordre Tortuguero/Parismina/Pacuare/
  Matina/Limón/Banano/Bananito/Estrella/Sixaola) ; inventaire interne.

### N051 — r-de-costaricha

- **Toponyme Jaillot :** R. de Costaricha
- **Nom canonique (harmonisé) :** Rio de Costaricha
- **Territoire :** nicaragua
- **Repères proches :** Gracias a Dios/Nicaragua (14,4 NM), Castillo de la Inmaculada Concepción (14,7 NM), Confluent du San Juan (28,3 NM), Mena (35,6 NM). Outlet en jonction directe vers « Rio San Juan ».
- **Identification proposée / nom moderne :** Río Frío — hypothèse.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** Le nom « de Costaricha » (« du Costa Rica ») est de toute évidence un nom générique de repérage plutôt qu'un toponyme local — cohérent avec un affluent frontalier venant du territoire costaricien pour rejoindre le San Juan. La note de `villes-data.js` sur `confluent-san-juan-frio` indique explicitly qu'un site proche sur la Jaillot marque la confluence du San Juan avec un « Rio Cambitto », identifié comme probablement le río Frío (actuelle frontière Costa Rica/Nicaragua). R. de Costaricha est le cours le plus proche de ce point de confluence dans notre liste, avec une jonction directe vers Rio San Juan cohérente. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — jonction directe et position corroborées par une note indépendante de `villes-data.js`, antérieure à cette identification.
- **Sources :** `js\villes-data.js` (entrée `confluent-san-juan-frio`) ; inventaire interne.

### N055 — r-dulce

- **Toponyme Jaillot :** R. Dulce
- **Nom canonique (harmonisé) :** Rio Dulce
- **Territoire :** honduras (frontière guatemala)
- **Repères proches :** Santo Tomás de Castilla (5 NM), Lac Izabal (7 NM), Cobán (10,6 NM), Puerto Caballos (28,3 NM). Cours voisin : R. Pech.
- **Identification proposée / nom moderne :** Río Dulce (Guatemala), exutoire du lac Izabal vers la mer des Caraïbes.
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance de nom exacte et position géographique sans ambiguïté : le Río Dulce relie historiquement le lac Izabal au golfe du Honduras, exactement entre Santo Tomás de Castilla et le lac Izabal comme sur la carte Jaillot. La structure en delta à multiples bras (branches 1 à 5 dans l'inventaire) correspond bien au réseau deltaïque réel du Río Dulce près de Livingston. C'est l'un des toponymes les plus anciens et stables de la région (d'où le nom du « Golfo Dulce » espagnol dès le XVIe siècle).
- **Sources :** Inventaire interne (position, branches multiples, nearbySettlements) ; connaissance géographique générale du Río Dulce/Livingston.

### N059 — r-granda

- **Toponyme Jaillot :** R. Granda
- **Nom canonique (harmonisé) :** Rio Granda *(possible déformation de « Grande »)*
- **Territoire :** honduras
- **Repères proches :** Trujillo (39,2 NM), San Jorge de Olancho (72,5 NM), Nueva Segovia (96,8 NM), Cap Gracias a Dios (143,7 NM). Cours voisin : R. Guaiapo (affluent).
- **Identification proposée / nom moderne :** Río Sico (aussi appelé Río Tinto / Black River) — hypothèse.
- **Confiance :** ⚠️ moyen/faible
- **Raisonnement :** Positionné sur la côte hondurienne entre Trujillo et le secteur de l'Aguán/Segovia, dans la zone où le principal cours réel est le Río Sico (Tinto), historiquement connu des Anglais sous le nom de « Black River » et parfois désigné par des noms génériques proches de « Rio Grande » sur les cartes d'époque. « Granda » pourrait être une déformation de « Grande ». Faute de tracé précis recoupable avec une carte indépendante, l'identification reste une hypothèse raisonnable plutôt qu'une certitude.
- **Sources :** Connaissance géographique générale de la côte des Mosquitos (Black River/Río Tinto) ; inventaire interne.

### N060 — r-guaiapo

- **Toponyme Jaillot :** R. Guaiapo
- **Nom canonique (harmonisé) :** Rio Guaiapo
- **Territoire :** honduras
- **Repères proches :** Trujillo (41,4 NM), San Jorge de Olancho (46,5 NM). `relations` : séparé de R. Granda sur une cellule commune ; outlet en jonction vers R. Granda.
- **Identification proposée / nom moderne :** **Río Paulaya** — confirmé principal tributaire réel du système Sico/Tinto (= R. Granda) ; candidats concurrents (Wampú, Sicre) exclus, bassin du Patuca distinct.
- **Confiance :** ✅ fort *(mise à jour — voir note ci-dessous ; la fiche n'avait pas été resynchronisée avec la table récapitulative lors du dernier passage)*
- **Raisonnement :** Se jette directement dans R. Granda selon l'inventaire (outlet type « junction », targetRiverId « R. Granda »), ce qui en fait un affluent de ce dernier plutôt qu'un cours autonome. Si R. Granda correspond au Río Sico, le tributaire réel le plus notable de ce bassin est le Río Paulaya. **Synchronisation (avec Ronan) :** la table récapitulative avait déjà été mise à jour vers ✅ fort — Wampú et Sicre, les deux autres candidats plausibles du même bassin, ont été explicitement exclus, laissant le Paulaya comme seul candidat restant — mais cette fiche n'avait pas suivi ; corrigé lors de la passe de recalibration secteur par secteur.
- **Sources :** Inventaire interne (relation de jonction avec R. Granda).

### N062 — r-lempa

- **Toponyme Jaillot :** R. Lempa
- **Nom canonique (harmonisé) :** Rio Lempa
- **Territoire :** guatemala (étiquette administrative — la Capitainerie générale du Guatemala englobait le Salvador d'aujourd'hui)
- **Repères proches :** San Miguel de la Frontera (7,5 NM), Amapala (30,3 NM), San Salvador (43,4 NM), La Trinidad/Guatemala (52,8 NM), Gracias/Honduras (67,5 NM).
- **Identification proposée / nom moderne :** Río Lempa (Salvador).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance de nom directe (« Lempa » est resté inchangé depuis la période coloniale) et position géographique cohérente : le fleuve le plus proche de San Salvador et San Miguel dans l'inventaire, exactement la position du Río Lempa réel qui traverse le territoire salvadorien avant de se jeter dans le Pacifique. C'est le principal fleuve d'Amérique centrale sur la façade Pacifique et son identité n'a jamais varié sur les cartes historiques.
- **Sources :** Inventaire interne (position relative à San Salvador/San Miguel) ; connaissance géographique générale (Río Lempa, Salvador).

### N066 — r-michataya

- **Toponyme Jaillot :** R Michataya
- **Nom canonique (harmonisé) :** Rio Michataya
- **Territoire :** guatemala
- **Repères proches :** Santiago de Guatemala (7,5 NM — quasi juxtaposé), Volcán de Agua (19,4 NM), Cobán (44,9 NM), Soconusco (71,2 NM).
- **Identification proposée / nom moderne :** Río Michatoya, exutoire du lac Amatitlán (Guatemala).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique quasi parfaite (Michataya/Michatoya) et position géographique exacte : le Río Michatoya prend sa source au lac Amatitlán, à quelques kilomètres de Santiago de Guatemala/Antigua (7,5 NM sur la carte, la distance la plus courte de toute la fiche), avant de rejoindre le Pacifique via Escuintla. C'est l'une des identifications les plus solides du lot, tant par le nom que par la position.
- **Sources :** Wikipédia (en) *Michatoya River* ; deguate.com, *Río Michatoya, Escuintla* ; inventaire interne.

### N067 — r-pech

- **Toponyme Jaillot :** R. Pech
- **Nom canonique (harmonisé) :** Rio Pech
- **Territoire :** honduras
- **Repères proches :** Gracias/Villa de Gracias a Dios (4,3 NM), Santo Tomás de Castilla (12 NM), Puerto Caballos (13,8 NM), San Pedro Sula (56,1 NM), Lac Izabal (56,7 NM). Cours voisin : R. Dulce.
- **Identification proposée / nom moderne :** Río Patuca — identification reprise de `js\villes-data.js` (note sur `gratios-o-dios`), avec réserve.
- **Confiance :** ⚠️ moyen/faible
- **Raisonnement :** Le fichier `villes-data.js` indique explicitement, pour la ville de Gracias (Villa de Gracias a Dios, Lempira) : « en remontant le "R. Pech" (río Patuca) depuis la côte ». Cette identification est donc déjà actée dans le canon du projet et reprise ici par cohérence. Elle pose toutefois un problème de position : l'embouchure réelle du Río Patuca se trouve très loin à l'est (Mosquitia hondurienne, région du cluster Boccades/Yayrepo dans cette même fiche), alors que R. Pech est positionné sur la carte tout près de Puerto Caballos et San Pedro Sula, dans l'ouest du Honduras — un déplacement cartographique majeur, mais plausible vu les autres déformations connues de la Jaillot pour ce secteur. Le nom « Pech » (peuple indigène de l'est du Honduras, riverain historique du Patuca) reste un indice linguistique fort en faveur de l'identification malgré l'anomalie de position. À prendre comme hypothèse de travail plutôt que certitude.
- **Sources :** `js\villes-data.js` (entrée `gratios-o-dios`) ; inventaire interne (position).

### N070 — r-serapique

- **Toponyme Jaillot :** R. Serapique
- **Nom canonique (harmonisé) :** Rio Serapique *(graphie Jaillot conservée ; forme moderne « Sarapiquí »)*
- **Territoire :** nicaragua (frontière costa-rica)
- **Repères proches :** Confluent du San Juan (11,7 NM), Gracias a Dios/Nicaragua (12,9 NM), Castillo de la Inmaculada Concepción (18,7 NM), Castillo de Austria (21,6 NM). Outlet en jonction directe vers « Rio San Juan ».
- **Identification proposée / nom moderne :** Río Sarapiquí (Costa Rica).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique directe (Serapique/Sarapiquí) et hydrologie identique : le Sarapiquí est un affluent réel et bien documenté du Río San Juan, rejoignant celui-ci par le sud (côté costaricien), exactement comme l'indique la jonction « Serapique → Rio San Juan » de l'inventaire. Fleuve historiquement important comme voie de pénétration vers la vallée centrale du Costa Rica.
- **Sources :** Connaissance géographique générale (Río Sarapiquí, affluent du San Juan) ; inventaire interne (jonction).

### N076 — r-yayrepo

- **Toponyme Jaillot :** R Yayrepo
- **Nom canonique (harmonisé) :** Rio Yayrepo
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (3,8 NM), Castillo de la Inmaculada Concepción (16,7 NM), Gracias a Dios/Nicaragua (22,3 NM). `relations` : fork depuis Rio San Juan, séparé de Boccades R.
- **Identification proposée / nom moderne :** Probable **bas Río San Juan / San Juan del Norte** — branche nord du delta, distincte du Colorado.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Fait partie du même enchevêtrement serré de branches deltaïques que Boccades R. et Trigu R. (voir N007), toutes issues par « fork » du tronc principal (N087, désormais Río Colorado) à proximité immédiate du fort de l'Immaculée Conception. Le toponyme « Yayrepo » ne correspond à aucune source identifiée. Mais sa position géométrique est significative : dans l'inventaire, son embouchure (cellule 87_68) est la plus au nord de tout le cluster deltaïque, tandis que celle du tronc principal — qui porte l'étiquette Jaillot « Nicaragua ou Colorado R. » — est la plus au sud. Or c'est exactement la configuration réelle : le Colorado est la branche méridionale du delta (vers le Costa Rica), et le bas San Juan/San Juan del Norte (Greytown) est la branche septentrionale historique. Par élimination géographique et cohérence avec la position de l'étiquette Jaillot, R Yayrepo est donc le candidat le plus probable pour cette branche nord — sans toutefois reposer sur une correspondance toponymique directe, d'où une confiance modérée plutôt que forte. **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — position exclusive établie par élimination parmi les trois branches historiques connues et closes (Colorado/Taura/San Juan del Norte), même sans appui toponymique direct.
- **Sources :** Lecture directe de la carte Jaillot (position du cap « P. Iuan » et de l'étiquette « Nicaragua ou Colorado R. », proposée par Ronan) ; derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* (position historique du Nicaragua en 1897 : trois branches Colorado/Taura/San Juan del Norte) ; inventaire interne (coordonnées d'embouchure).

### N087 — rio-san-juan

- **Toponyme Jaillot :** Rio San Juan *(à corriger — voir révision collaborative ci-dessous : la carte porte en réalité « Nicaragua ou Colorado R. »)*
- **Nom canonique (harmonisé) :** Nicaragua ou Rio Colorado *(toponyme Jaillot réel, pas la convention de projet « Rio San Juan » — « R. » du suffixe original harmonisé en « Rio »)*
- **Territoire :** nicaragua (frontière costa-rica)
- **Repères proches :** Castillo de la Inmaculada Concepción (3,4 NM), Confluent du San Juan (3,8 NM), Gracias a Dios/Nicaragua (4,7 NM). Outlet « sea » à l'embouchure ; jonctions multiples en amont avec Lac Nicaragua, R. Serapique, R. de Costaricha, et les branches Boccades/Trigu/Yayrepo à l'aval.
- **Identification proposée / nom moderne :** **Río Colorado** — bras principal/méridional du delta du système lac Nicaragua → mer des Caraïbes, reliant toujours le lac Nicaragua à la mer, mais sous le nom de sa branche sud plutôt que celui, générique, de « San Juan ».
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le système hydrographique lui-même (exutoire du lac Nicaragua vers la mer des Caraïbes, ponctué par le fort de l'Immaculée Conception, affluents Sarapiquí et Frío/Costaricha) reste identifié avec certitude — c'est la géographie réelle du complexe San Juan/Colorado. Mais le nom « Rio San Juan » attribué à ce tronçon précis dans l'inventaire est une convention du projet, pas une transcription fidèle : la lecture directe de la carte Jaillot (crop haute résolution) montre que le cap à l'embouchure est étiqueté « P. Iuan » (entre Trigu R. et le tronc principal) et que le fleuve lui-même est nommé « **Nicaragua ou Colorado R.** » — jamais « San Juan ». Cette étiquette porte précisément sur le tronc qui aboutit à l'embouchure la plus au sud du cluster deltaïque (cellule 92_69), ce qui correspond exactement à la position réelle du Río Colorado (branche méridionale du delta, côté Costa Rica) par rapport au bas San Juan/San Juan del Norte (branche nord, voir N076). Fleuve historiquement majeur, remonté par les flibustiers lors des raids sur Grenade (1665, 1670 — Henry Morgan et d'autres selon les sources consultées), défendu par jusqu'à douze forts espagnols dont le Castillo de la Inmaculada Concepción (1675). **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — la lecture directe du toponyme Jaillot réel (« Nicaragua ou Colorado R. ») conjuguée à la position exacte (embouchure la plus au sud du cluster deltaïque) constitue précisément une convergence toponymique et positionnelle, le critère standard du niveau fort ; l'absence d'une confirmation tierce indépendante ne disqualifie pas cette convergence.
- **Sources :** Lecture directe de la carte Jaillot (crop haute résolution, relevé par Ronan : « P. Iuan », « Nicaragua ou Colorado R. ») ; Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* (position du Nicaragua en 1897 : Colorado/Taura/San Juan del Norte) ; `js\villes-data.js` (entrées `castillo-san-juan`, `confluent-san-juan-frio`) ; inventaire interne.

### N091 — sal-r

- **Toponyme Jaillot :** Sal R
- **Nom canonique (harmonisé) :** Rio Sal
- **Territoire :** honduras
- **Repères proches :** Comayagua (4,5 NM), La Ceiba/Porta de Sal (7,6 NM), San Pedro Sula (23,8 NM), Gracias (49,8 NM).
- **Identification proposée / nom moderne :** Río Cangrejal (La Ceiba, Honduras).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** Identification déjà actée dans `js\villes-data.js` (entrée `porta-de-sal`) : « "Sal River" sur la Jaillot = probable río Cangrejal (La Ceiba actuelle) ». La position colle bien : Sal R passe à proximité immédiate de La Ceiba (7,6 NM) et de Comayagua (4,5 NM), cohérent avec le bassin versant du Cangrejal qui descend de la Cordillère Nombre de Dios vers la côte à La Ceiba. Confiance reprise telle quelle du canon du projet, avec la même réserve (« probable ») que la note d'origine.
- **Sources :** `js\villes-data.js` (entrée `porta-de-sal`) ; inventaire interne.

### N092 — salinas

- **Toponyme Jaillot :** Salinas
- **Nom canonique (harmonisé) :** Salinas *(pas d'abréviation ; probable étiquette générique, pas un fleuve précis — voir raisonnement)*
- **Territoire :** guatemala
- **Repères proches :** Soconusco (3,4 NM), Tehuantepec (15 NM, territoire nouvelle-espagne), Chiapa/Ciudad Real (20,4 NM). Cours voisin : R. Guazacoalco (ou Guashigwalp).
- **Identification proposée / nom moderne :** Probable étiquette générique pour la zone salinière côtière du Soconusco oriental (esteros/manglares, secteur Mazatán–Puerto Madero) plutôt qu'un fleuve précis (Coatán/Cahoacán/Huixtla/Suchiate non tranchés).
- **Confiance :** 🎲 convention cartographique *(mise à jour — voir note ci-dessous ; la fiche n'avait pas été resynchronisée avec la table récapitulative lors du dernier passage)*
- **Raisonnement :** Position sans ambiguïté sur la côte Pacifique du Soconusco/Chiapas, tout près de Soconusco (3,4 NM) — donc bien distincte du Río Salinas intérieur du Petén (bassin de l'Usumacinta), qui n'a rien à voir géographiquement. Le nom « Salinas » désigne vraisemblablement des marais salants côtiers (toponyme générique fréquent sur cette portion de littoral), plutôt qu'un fleuve précis. Plusieurs petits cours réels traversent ce secteur (Coatán, Cahoacán, Huixtla, Suchiate) sans qu'aucun ne se distingue clairement comme correspondance certaine. **Synchronisation (avec Ronan) :** la table récapitulative classait déjà ce cours en convention cartographique (repère de zone salinière plutôt que fleuve précis) ; cette fiche n'avait pas suivi — corrigé lors de la passe de recalibration secteur par secteur.
- **Sources :** Inventaire interne (position relative à Soconusco/Tehuantepec).

### N097 — suere-ou-blewfield-river

- **Toponyme Jaillot :** Suere ou Blewfield River
- **Nom canonique (harmonisé) :** Suere ou Blewfield River *(double nom délibéré de Jaillot — espagnol colonial + anglais de flibustier — déjà complet, rien à abréger)*
- **Territoire :** costa-rica
- **Repères proches :** Castillo de Austria (11 NM), Concepción/Panama (54,7 NM), Puebla/Alanje (57,1 NM), Chiriquí (66,2 NM). Cours voisins : R. Auzuelos, R. Caranaco.
- **Identification proposée / nom moderne :** **Río Matina** (révision
  collaborative), secteur Matina/Parismina/Tortuguero (Costa Rica) —
  **et non** le Bluefields moderne du Nicaragua.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le double nom
  « Suere ou Blewfield » trahit probablement la superposition de deux
  sources d'information par le cartographe : un ancien toponyme colonial
  espagnol (« Suerre », cacicazgo/province documentée dès le
  XVIe-XVIIe siècle près de l'embouchure du Reventazón/Parismina) et un
  nom anglais de flibustier (« Blewfield », par analogie avec le
  capitaine Bluefield/Blauvelt actif sur la côte des Mosquitos). La
  position sur la carte tranche nettement en faveur de la lecture
  costaricienne : le cours est situé bien au sud de l'embouchure du San
  Juan/Colorado, à seulement 11 NM du Castillo de Austria — et
  `js/villes-data.js` (entrée `chateau-de-austria`) positionne
  précisément ce fort à l'embouchure du **río Matina**. Cette proximité
  immédiate (11 NM, le repère le plus proche de toute la fiche) est un
  ancrage plus direct que l'hypothèse Parismina/Tortuguero retenue
  initialement : le cours porteur du nom « Suere ou Blewfield » est donc
  revu vers le Matina lui-même, tandis qu'Auzuelos et Vergues (voir
  N043), plus proches du delta, couvrent Pacuare et Parismina.
  **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort —
  repère le plus proche de tout le corpus (11 NM), position exclusive
  sans autre candidat plausible.
- **Sources :** Wikipédia (es) *Río Suerte* ; parquenacionaldetortuguero.wordpress.com (histoire coloniale de Tortuguero, mention de Matina et San Juan de la Cruz) ; `js/villes-data.js` (entrée `chateau-de-austria`) ; inventaire interne (position, proposée par Ronan).

### N099 — tabasco-r

- **Toponyme Jaillot :** Tabasco R.
- **Nom canonique (harmonisé) :** Rio Tabasco
- **Territoire :** guatemala (étiquette administrative de l'inventaire — probable artefact de zonage)
- **Repères proches :** Tocotalpa de la Sierra (7,9 NM), Laguna de Términos (10,7 NM, yucatan), Cobán (proche), Chiapa/Ciudad Real. Cours voisins : Rio Palmas dos Bogas, St Anns, Tondelo.
- **Identification proposée / nom moderne :** Système Grijalva/Usumacinta, delta de Villahermosa (Tabasco, Mexique).
- **Confiance :** ✅ fort
- **Raisonnement :** Le centroïde (x≈1883, y≈2997) place ce cours exactement dans la même zone que la fiche déjà traitée dans la session précédente (R008, « Spirito Santo »/Villahermosa, identifiée comme le bras du Río Carrizal du delta du Grijalva) — malgré l'étiquette « guatemala » de l'inventaire, qui est manifestement un artefact de zonage administratif et non un indice géographique (à l'identique de Chequapeque, son voisin direct). Le nom « Tabasco R. » est d'ailleurs celui qui a donné son nom à la province coloniale et à l'État mexicain moderne : historiquement, le Grijalva a longtemps été appelé « Río Tabasco ». Il ne s'agit donc pas d'un cours homonyme distinct d'Amérique centrale, mais bien du même grand système Grijalva/Usumacinta déjà repéré près de Villahermosa.
- **Sources :** Synthèse de la session précédente (`fluvial-identification-synthese.md`, R008) ; recherche web (Wikipédia *Villahermosa* — « historically known as the Tabasco River ») ; inventaire interne (position, branches B-F du delta).

### N101 — trigu-r

- **Toponyme Jaillot :** Trigu R.
- **Nom canonique (harmonisé) :** Rio Trigu
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (27,7 NM), Gracias a Dios/Nicaragua (39,3 NM), Castillo de la Inmaculada Concepción (42,8 NM). `relations` : fork depuis Rio San Juan (rebaptisé Río Colorado, voir N087), séparé de Boccades R. et R Yayrepo_B. Sur la carte, son étiquette est immédiatement suivie, vers la côte, du cap « P. Iuan » puis de l'étiquette du tronc principal « Nicaragua ou Colorado R. ».
- **Identification proposée / nom moderne :** Une des branches secondaires du delta du Río Colorado — hypothèse spéculative : la branche historique « Taura ».
- **Confiance :** ⚠️ faible
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Même complexe deltaïque que Boccades R. et R Yayrepo (voir N007/N076), avec une bouche « sea » propre. Les sources modernes confirment l'existence historique d'une branche appelée « Taura » parmi les trois revendiquées par le Nicaragua en 1897 (Colorado, Taura, San Juan del Norte) — une parenté phonétique lointaine (T.-U./T-R-G-U) reste envisageable par déformation cartographique, mais rien ne permet de la confirmer avec certitude. Un possible « Caño Bravo », bras réel qui bifurque aujourd'hui du Río Colorado avant de le rejoindre (visible sur l'imagerie satellite moderne), a aussi été envisagé — mais il s'agit peut-être d'un chenal artificiel ou trop mineur pour avoir été relevé par Jaillot ; aucune attestation historique n'a été trouvée pour l'exclure ou le confirmer. À traiter comme simple piste plutôt que résultat établi.
- **Sources :** Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com ; lecture directe de la carte Jaillot (position relative à « P. Iuan », proposée par Ronan) ; inventaire interne.

### N104 — xagua-r

- **Toponyme Jaillot :** Xagua R.
- **Nom canonique (harmonisé) :** Rio Xagua
- **Territoire :** honduras
- **Repères proches :** Saint-George's (5 NM), San Jorge de Olancho (6,7 NM), Trujillo (42,4 NM), Nueva Segovia (47,6 NM). Cours voisin : Yare R.
- **Identification proposée / nom moderne :** Río Aguán (Honduras).
- **Confiance :** ✅ fort
- **Raisonnement :** Identification déjà actée dans `js\villes-data.js` (entrée `st-georges-honduras`) : « Sur la "Xagua River" de la Jaillot — probablement le río Aguán (aussi orthographié Xagua, Aguan sur les cartes anciennes) ». Cohérence géographique confirmée : Saint-George's, la ville la plus proche du cours (5 NM), est justement positionnée le long de ce fleuve dans la note d'origine. La séparation nette avec Yare R. (à l'est, vers l'embouchure du Coco) correspond bien à la position réelle de l'Aguán, à l'ouest du bassin du Coco/Segovia.
- **Sources :** `js\villes-data.js` (entrée `st-georges-honduras`) ; inventaire interne.

### N105 — yare-r

- **Toponyme Jaillot :** Yare R.
- **Nom canonique (harmonisé) :** Rio Yare
- **Territoire :** honduras
- **Repères proches :** San Jorge de Olancho (6,7 NM), Saint-George's (37,3 NM), Nueva Segovia (43,6 NM), Cap Gracias a Dios (75,9 NM). Cours voisins : N. Segovia River (jonction amont), Xagua R.
- **Identification proposée / nom moderne :** « Yara » ou « Cape River », ancien nom du cours inférieur du Río Coco/Wangki (aujourd'hui unifié sous le nom Río Coco).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance quasi littérale de nom (Yare/Yara) avec un fait historique documenté : le Río Coco actuel était connu, pendant la période coloniale, sous plusieurs noms selon le tronçon — « Río Segovia » en amont, « Cape River » ou « Yara River » en aval, près de l'embouchure au Cabo Gracias a Dios. L'inventaire confirme structurellement cette lecture : N. Segovia River se jette dans Yare R. par jonction directe, exactement la séquence historique Segovia (amont) → Yara (aval). La distance jusqu'au Cap Gracias a Dios reste notable sur la carte (75,9 NM), ce qui suggère un léger déplacement cartographique du tracé Jaillot vers le sud-est par rapport à l'embouchure réelle, mais l'identification du système reste solide au niveau du nom et de la structure hydrographique.
- **Sources :** Wikipédia (en) *Coco River* — « formerly known as the Río Segovia, Cape River, or Yara River » ; inventaire interne (jonction N. Segovia River → Yare R.).


---

## Secteur D — Panama / Darién (isthme)

### N015 — chagre-r

- **Toponyme Jaillot :** Chagre R.
- **Nom canonique (harmonisé) :** Rio Chagre
- **Territoire :** panama
- **Repères proches :** Portobelo (1,2 NM), Castillo de San Lorenzo el Real
  de Chagres (6,6 NM), Venta de Cruces (8,1 NM), Capira (10,7 NM), Panama
  City (16,8 NM). Séparé de « Cheapo R. » à la cellule 100_82 et de « R.
  Coqueto » à la cellule 98_78 (embouchure).
- **Identification proposée / nom moderne :** Río Chagres.
- **Confiance :** ✅ fort
- **Raisonnement :** Toponyme quasi identique au nom moderne, tracé
  s'étendant de l'embouchure caraïbe (près de Portobelo/fort San Lorenzo)
  vers l'intérieur jusqu'à Venta de Cruces et Capira — c'est exactement
  l'axe historique de la route transisthmique de Panama (Camino Real puis
  Camino de Cruces), remonté par Henry Morgan en 1671 après la prise du
  fort San Lorenzo pour marcher sur Panama. Aucun doute raisonnable
  possible sur l'identité de ce cours.
- **Sources :** Toponymie directe ; géographie historique de la route
  transisthmique (prise de San Lorenzo 1671, campagne de Morgan) ;
  position relative cohérente avec Delisle 1718 qui porte également
  « Chagre R. » au même emplacement.

### N016 — cheapo-r

- **Toponyme Jaillot :** Cheapo R.
- **Nom canonique (harmonisé) :** Rio Chepo *(« Cheapo » est la graphie anglicisée de Jaillot pour le toponyme espagnol « Chepo » — restaurée à sa forme espagnole, à l'identique du cas May R./Rivière de May)*
- **Territoire :** darien
- **Repères proches :** New Edinburg (12,2 NM), Panama City (13,3 NM),
  Venta de Cruces (18,5 NM), Nombre de Dios (24,1 NM), Capira (38,5 NM).
  Voisin direct de Chagre R. (à l'ouest) et de Sholes (à l'est).
- **Identification proposée / nom moderne :** Río Chepo — correspond au
  Río Bayano moderne.
- **Confiance :** ✅ fort
- **Raisonnement :** « Cheapo » est une graphie anglicisée évidente de
  « Chepo », toponyme espagnol conservé jusqu'à aujourd'hui (ville d'El
  Chepo, province de Panamá). Le fleuve principal de cette région, appelé
  historiquement Río Chepo, correspond au Río Bayano moderne, qui se jette
  dans le golfe de Panama à l'est de la capitale — cohérent avec la
  position entre Panama City et New Edinburg (colonie écossaise du Darién)
  relevée dans le dossier.
- **Sources :** Toponymie directe (Chepo/Cheapo) ; géographie régionale
  (province de Panamá, bassin du Bayano).

### N018 — congo-r

- **Toponyme Jaillot :** Congo R.
- **Nom canonique (harmonisé) :** Rio Congo
- **Territoire :** darien
- **Repères proches :** Santa María la Antigua del Darién (19,5 NM), New
  Edinburg (51,3 NM), golfe d'Urabá (70,4 NM), San Sebastián de Buena
  Vista (72 NM). Voisins directs : Gold River et S. Maria River (relation
  « separate » à l'embouchure, cellule 107_84), et Sholes.
- **Identification proposée / nom moderne :** **Río Congo**, débouchant
  dans le Golfo de San Miguel (côté Pacifique du Darién).
- **Confiance :** ✅ fort
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* La lecture
  de la première passe rattachait ce cluster (Congo R., Gold River,
  S. Maria River, Sholes) au secteur caraïbe de Santa María la Antigua
  del Darién, sur la seule base de la distance au repère nommé le plus
  proche dans l'inventaire — en écartant explicitement le bassin
  Tuira-Chucunaque comme « hors de portée ». Ronan a identifié sur la
  carte Jaillot elle-même l'étiquette « **Golfe de St Michael** » à
  l'endroit où ces quatre cours convergent : c'est le nom historique du
  **Golfo de San Miguel**, la baie du Darién côté Pacifique où débouche
  précisément le système Tuira-Chucunaque — et un Río Congo réel existe
  bien à cet exact emplacement aujourd'hui (corregimiento du même nom,
  district de Santa Fe, Darién). Confirmation structurelle indépendante :
  dans l'inventaire, Sholes (voisin direct de Congo R.) est également
  voisin direct de **Cheapo R.** (= Río Chepo/Bayano, indiscutablement
  Pacifique), formant une chaîne d'embouchures contiguës Cheapo→Sholes→
  Congo→S. Maria/Gold cohérente avec la côte réelle entre Chepo et le
  Golfo de San Miguel — et non avec la côte caraïbe. Le rattachement à
  Santa María la Antigua était donc une fausse piste.
- **Sources :** Wikipédia (es) *Río Congo (Darién)* ; Wikipédia (es)
  *Golfo de San Miguel* ; lecture directe de la carte Jaillot (étiquette
  « Golfe de St Michael », proposée par Ronan) ; inventaire interne
  (chaîne de voisinage Cheapo R./Sholes/Congo R.).

### N022 — gold-river

- **Toponyme Jaillot :** Gold River
- **Nom canonique (harmonisé) :** Gold River *(anglais, déjà complet — Jaillot écrit lui-même « Gold Riv. and mines », rien à abréger)*
- **Territoire :** darien
- **Repères proches :** Santa María la Antigua del Darién (13,6 NM),
  golfe d'Urabá (45,2 NM), San Sebastián de Buena Vista (84,2 NM), New
  Edinburg (90,9 NM). Voisins directs : Congo R. et S. Maria River.
- **Identification proposée / nom moderne :** **Río Balsas** (branche
  principale) et **Río Tuira** (branche méridionale, « Gold River_B ») —
  révision collaborative, remplace l'hypothèse caraïbe.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le nom
  anglais « Gold River » (Jaillot : « Gold Riv. and mines ») suggère une
  traduction littérale d'un hydronyme espagnol du type « Río de Oro »,
  évoquant l'exploitation aurifère — mais le rattachement à Santa María
  la Antigua del Darién (côte caraïbe) était une fausse piste commune à
  tout le cluster (voir N018). Repositionné dans le Golfo de San Miguel,
  ce toponyme colle exactement aux mines de Cana/Real de Santa María du
  bassin du Tuira : les gisements aurifères historiques du district de
  Tucuti se trouvaient précisément sur les rios Chucunaque, Tuquesa,
  Marraganti, Tuira, **Balsas** et Bagre, et la faille géologique bordant
  le massif du Pirre (où se situe Cana) porte même le nom de « faille du
  Río Balsas ». L'inventaire enregistre deux embouchures distinctes pour
  Gold River (« Gold River » et « Gold River_B », séparées à la cellule
  108_85) : Ronan propose que la seconde ne soit pas une rivière
  distincte (l'hypothèse Sambú River, envisagée puis retirée) mais
  simplement le Tuira lui-même obliquant vers le sud avant l'embouchure
  — cohérent avec un système deltaïque à bras multiples près du golfe,
  comme observé ailleurs sur cette carte (San Juan/Colorado, Dulce).
  Le récit du flibustier Basil Ringrose (expédition Sharp, 1680) décrit
  explicitement « this golden Treasure cometh down another branch of
  this River unto Santa Maria » — une branche distincte charriant l'or,
  cohérente avec la présence de deux cours nommés séparément (S. Maria
  River et Gold River) dans ce même système.
- **Sources :** *The history of mining and mineral exploration in
  Panama* (Redalyc/Scielo) ; Wikipédia (en) *Balsas River (Panama)* ;
  *A Buccaneer's Atlas: Basil Ringrose's South Sea Waggoner* ; lecture
  directe de la carte Jaillot (« Gold Riv. and mines », proposée par
  Ronan) ; inventaire interne (branches Gold River/Gold River_B).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — plusieurs
  indices convergent (récit de Ringrose, toponyme géologique « falla del
  Río Balsas », chaîne de voisinage) mais aucun n'établit une exclusivité
  positionnelle explicite ; reste ⚠️ moyen.

### N044 — r-belem

- **Toponyme Jaillot :** R. Belem
- **Nom canonique (harmonisé) :** Rio Belem *(toponyme Jaillot conservé pour archive ; l'identification réelle — Río Calovébora — figure séparément)*
- **Territoire :** panama
- **Repères proches :** Trinidad (10,8 NM), Santa Fe de Veraguas
  (16,3 NM), Concepción/Bocas del Toro (25,3 NM), Castillo de San Lorenzo
  el Real de Chagres (50,3 NM). Voisins directs : R. Coqueto et Veragua R.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río Calovébora.**
- **Confiance :** ⚠️ moyen
- **Raisonnement :** RÉVISION. La correspondance toponymique Belem/Belén
  restait tentante, mais Ronan a relu la carte directement : le long de
  cette portion de côte très dense en étiquettes (Bocas del Toro, Escudo
  de Veraguas), Jaillot place « R Belem » en face d'une baie qui ne porte
  pas de tracé de cours d'eau propre — signe probable que les labels de
  tout ce secteur ont été décalés vers l'est faute de place, plutôt qu'un
  véritable positionnement du nom sur son cours. La séquence réelle,
  d'ouest en est, est : Veragua R./Cricamola (N103), puis le repère
  Trinidad, puis le cours ici recensé — dont le tracé correspond
  vraisemblablement au **Río Calovébora**, fleuve réel du littoral
  caraïbe de Veraguas (district de Santa Fe, ~39 km, embouchure vers
  8°47' N/81°13' O), plutôt qu'au Río Belén, dont l'embouchure réelle se
  situe en fait beaucoup plus à l'est (province de Colón, à proximité du
  Coclé del Norte). Le site historique de Santa María de Belén (colonie
  de Colomb, 1503) reste parfaitement réel et établi — il ne correspond
  simplement pas à un cours distinct dans ce secteur précis de la carte
  Jaillot.
- **Sources :** [Calovebora River — Wikipedia](https://en.wikipedia.org/wiki/Calovebora_River) ; [Río Belén — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Bel%C3%A9n) (position réelle, plus orientale) ; lecture directe de la carte (Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — repose
  sur une lecture directe de la carte non vérifiable indépendamment
  (« vraisemblablement »), sans autre corroboration externe ; reste
  ⚠️ moyen.

### N047 — r-caranaco

- **Toponyme Jaillot :** R. Caranaco
- **Nom canonique (harmonisé) :** Rio Caranaco
- **Territoire :** panama
- **Repères proches :** Concepción/Bocas del Toro (41,8 NM), Castillo de
  Austria — Costa Rica (51,7 NM), Trinidad (58,6 NM), Santa Fe de
  Veraguas (61,3 NM), Puebla/Alanje — Costa Rica (67,9 NM). Voisins
  directs : R. Talamanca et Suere ou Blewfield River.
- **Identification proposée / nom moderne :** **Río Sixaola** (révision
  collaborative — ERR-015 retiré), le fleuve-frontière actuel entre le
  Costa Rica et le Panama.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Aucune
  correspondance toponymique directe. Mais en repositionnant l'ensemble
  de la séquence Quemades/Talamanca/Caranaco le long de la côte, dans
  l'ordre croissant de distance à Concepción/Bocas del Toro (26,2 NM /
  31,3 NM / 41,8 NM — Caranaco est le plus éloigné, donc le plus proche
  de la frontière costaricaine), Caranaco correspond au fleuve-frontière
  lui-même : le **Río Sixaola**, dont l'embouchure marque aujourd'hui
  encore la limite Costa Rica/Panama. C'est un déplacement par rapport à
  l'hypothèse initialement portée par R. Talamanca (voir N073, révisé
  vers Río San San).
- **Sources :** Wikipédia (en) *Sixaola River* ; position relative
  (inventaire Jaillot, proposée par Ronan) ; géographie régionale de
  Bocas del Toro/Talamanca.
- **Recalibration (avec Ronan) :** examiné mais **non promu** — fait
  partie d'un tiercé (Quemades/Talamanca/Caranaco, voir N069/N073)
  résolu par ordre de distance croissante plutôt que par exclusivité
  positionnelle stricte ; le maillon central (N073) admet explicitement
  ne pas trancher sans élément supplémentaire, ce qui fragilise
  l'ensemble du triplet. Reste ⚠️ moyen.

### N049 — r-coqueto

- **Toponyme Jaillot :** R. Coqueto
- **Nom canonique (harmonisé) :** Rio Coqueto
- **Territoire :** panama
- **Repères proches :** Castillo de San Lorenzo el Real de Chagres
  (8,9 NM), Trinidad (21,3 NM), Santa Fe de Veraguas (23,1 NM), Portobelo
  (29,9 NM), Capira (33,3 NM). Voisins directs : Chagre R. (à l'est) et R.
  Belem (à l'ouest) — relation « separate » avec Chagre R. à l'embouchure
  (cellule 98_78).
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río Coclé (del Norte).** Branche sud-est (« R. Coqueto_B »,
  affluent) = **Río Toabré**.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** RÉVISION (ERR-014 retiré). Aucune correspondance
  toponymique directe (« Coqueto »/« Coclé » restent phonétiquement
  voisins sans être identiques), mais l'embouchure de R. Coqueto est
  positionnée dans la même cellule que celle du Chagres (relation
  « separate », un second débouché immédiatement adjacent) — cohérent
  avec le **Río Coclé (del Norte)**, cours réel du versant caraïbe
  (district de Donoso, province de Colón, ~75 km, bassin de 1 710 km²).
  Sa branche affluente sud-est correspond au **Río Toabré**, confirmé
  tributaire réel du Coclé del Norte (les deux bassins ont d'ailleurs été
  réunis administrativement dans la Cuenca Occidental par la loi n° 44 de
  1999, avec le Río Indio). Río Indio et Río Miguel de la Borda,
  candidats envisagés dans une première passe, sont écartés au profit de
  Coclé del Norte/Toabré — Río Indio est désormais attribué à R019/
  F-98_73-C (voir `fluvial-identification-synthese.md`).
- **Sources :** [Cocle del Norte River — Wikipedia](https://en.wikipedia.org/wiki/Cocle_del_Norte_River) ; [Toabré — Wikipedia](https://es.wikipedia.org/wiki/Toabr%C3%A9) ; position relative (inventaire Jaillot, proposée par Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — position
  cohérente et affluent confirmé (Toabré), mais aucune exclusivité
  positionnelle explicite ni appui toponymique ; reste ⚠️ moyen.

### N069 — r-quemades

- **Toponyme Jaillot :** R. Quemades
- **Nom canonique (harmonisé) :** Rio Quemades
- **Territoire :** panama
- **Repères proches :** Concepción/Bocas del Toro (26,2 NM), Trinidad
  (35,3 NM), Santa Fe de Veraguas (47,9 NM), Puebla/Alanje — Costa Rica
  (76,8 NM), Castillo de Austria — Costa Rica (81,3 NM). Cours à une
  seule cellule, voisin direct de R. Talamanca.
- **Identification proposée / nom moderne :** **Río Changuinola**
  (révision collaborative — ERR-016 retiré) — hyp.
- **Confiance :** ⚠️ faible
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Cours très
  court (une seule cellule sur la carte), sans traduction toponymique
  évidente (« Quemades » = « brûlées », nom descriptif générique). En
  repositionnant la séquence Quemades/Talamanca/Caranaco par distance
  croissante à Concepción/Bocas del Toro (26,2 / 31,3 / 41,8 NM),
  Quemades est le plus proche de Bocas del Toro — ce qui correspond au
  Río Changuinola, principal fleuve de ce secteur immédiat. Confiance
  maintenue faible : correspondance purement positionnelle, aucun appui
  toponymique.
- **Sources :** Wikipédia (en) *Changuinola River* ; position relative
  (inventaire Jaillot, séquence proposée par Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — même
  triplet que N047/N073, résolu par ordre de distance plutôt que par
  exclusivité stricte ; reste ⚠️ faible, confiance déjà qualifiée de
  « purement positionnelle » par l'auteur de la fiche.

### N073 — r-talamanca

- **Toponyme Jaillot :** R. Talamanca
- **Nom canonique (harmonisé) :** Rio Talamanca
- **Territoire :** panama
- **Repères proches :** Concepción/Bocas del Toro (31,3 NM), Trinidad
  (45,8 NM), Santa Fe de Veraguas (52,9 NM), Castillo de Austria — Costa
  Rica (66,3 NM). Territoire limitrophe costaricain à 1,9 NM seulement.
  Voisins directs : R. Caranaco et R. Quemades.
- **Identification proposée / nom moderne :** **Río San San** (révision
  collaborative — remplace l'hypothèse Sixaola/Telire, réassignée à
  Caranaco/N047).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Correspondance
  toponymique directe avec la région Talamanca, zone habitée par les
  peuples indigènes du même nom (Bribri, Cabécar) à cheval sur la
  frontière actuelle Costa Rica-Panama — mais en repositionnant la
  séquence Quemades/Talamanca/Caranaco par distance croissante à
  Concepción/Bocas del Toro, R. Talamanca (position intermédiaire) cadre
  mieux avec le **Río San San**, cours mineur situé entre le Changuinola
  et le Sixaola, plutôt qu'avec le Sixaola lui-même (désormais assigné à
  Caranaco, le plus proche de la frontière). Le toponyme « Talamanca »
  reste un ancrage régional solide (n'importe quel cours de cette bande
  côtière relève de la région historique du même nom), mais ne permet
  pas de trancher entre les trois cours réels sans élément supplémentaire.
- **Sources :** Wikipédia (en) *Yorkin River*, *Sixaola River* ;
  toponymie directe (région de Talamanca) ; position relative (séquence
  proposée par Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la
  fiche admet elle-même ne pas pouvoir trancher entre les trois cours
  réels du triplet (N047/N069/N073) sans élément supplémentaire ; reste
  ⚠️ moyen.

### N079 — rio-de-los-redes

- **Toponyme Jaillot :** Rio de los Redes
- **Nom canonique (harmonisé) :** Rio de los Redes *(déjà au format)*
- **Territoire :** darien
- **Repères proches :** golfe d'Urabá (12,3 NM), San Sebastián de Buena
  Vista (47,5 NM), Santa Fe de Antioquia — Nouvelle-Grenade (54 NM),
  Santa María la Antigua del Darién (63,7 NM), New Edinburg (76,6 NM).
  Territoire limitrophe de la Nouvelle-Grenade à seulement 10,3 NM.
- **Identification proposée / nom moderne :** **Río Caimán Nuevo**
  (révision collaborative — remplace l'hypothèse Río León).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le nom
  « Rio de los Redes » (rivière des filets) évoque une activité de
  pêche, cohérente avec un débouché deltaïque poissonneux, mais
  l'hypothèse Río León (débouché sud-ouest du golfe, rive opposée) est
  écartée : Redes est positionné sur la rive **est** du golfe, à la
  frontière Darién/Nouvelle-Grenade — le Río León est en réalité côté
  ouest. Repositionné avec Ronan dans le même groupe que N085 (Rio
  Negro) : les deux rivières réelles de ce secteur de la rive est sont
  le Río Caimán Viejo et le Río Caimán Nuevo, adjacentes à hauteur de
  Necoclí. R. de los Redes, plus proche du golfe et de la frontière que
  Rio Negro dans l'inventaire, correspond au **Caimán Nuevo** (au sud du
  Caimán Viejo, plus proche de Turbo).
- **Sources :** Wikipédia (es) *Necoclí* ; ONIC, *Resguardo Caimán
  Nuevo* ; toponymie descriptive (« Redes » = filets de pêche) ;
  position relative (inventaire Jaillot, séquence proposée par Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — position
  nord/sud reposant sur une lecture directe de la carte (Ronan), non
  vérifiable indépendamment ; reste ⚠️ moyen (voir aussi N085, même
  logique).

### N084 — rio-grande-del-darien

- **Toponyme Jaillot :** Rio Grande del Darién
- **Nom canonique (harmonisé) :** Rio Grande del Darien *(déjà au format)*
- **Territoire :** darien
- **Repères proches :** golfe d'Urabá (15,2 NM), Santa María la Antigua
  del Darién (60,9 NM), San Sebastián de Buena Vista (74 NM), Santa Fe de
  Antioquia — Nouvelle-Grenade (87,6 NM). Cours long (10 cellules)
  s'étendant loin vers le sud depuis son embouchure au golfe d'Urabá ;
  territoire à distance nulle des deux zones Darién et Nouvelle-Grenade
  (fleuve-frontière).
- **Identification proposée / nom moderne :** Río Atrato.
- **Confiance :** ✅ fort
- **Raisonnement :** « Rio Grande del Darién » est un nom historique
  alternatif attesté pour le fleuve Atrato sur les cartes espagnoles et
  françaises du XVIIe-XVIIIe siècle (parfois aussi « Río Darién » ou «
  Río Grande de San Juan » selon les sources). Le tracé — long cours
  débouchant au fond du golfe d'Urabá et servant de limite naturelle
  entre le Darién et la Nouvelle-Grenade — correspond exactement à la
  géographie réelle de l'Atrato, principal fleuve du Chocó colombien se
  jetant dans le golfe d'Urabá.
- **Sources :** Toponymie historique (« Río Grande del Darién » = nom
  ancien de l'Atrato) ; géographie du golfe d'Urabá ; cohérence de
  position frontalière Darién/Nouvelle-Grenade dans l'inventaire.

### N085 — rio-negro

- **Toponyme Jaillot :** Rio Negro
- **Nom canonique (harmonisé) :** Rio Negro *(déjà au format)*
- **Territoire :** darien
- **Repères proches :** San Sebastián de Buena Vista (21,2 NM), Santa Fe
  de Antioquia — Nouvelle-Grenade (34 NM), golfe d'Urabá (38,6 NM), New
  Edinburg (56,3 NM), Sinú — Nouvelle-Grenade (62,4 NM). Territoire à
  distance nulle des deux zones Darién et Nouvelle-Grenade.
- **Identification proposée / nom moderne :** **Río Caimán Viejo**
  (révision collaborative — ERR-019 retiré), rive orientale du golfe
  d'Urabá.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le nom « Rio
  Negro » (rivière noire) est un hydronyme très courant en Amérique
  espagnole, sans valeur discriminante en soi — recherche négative
  exhaustive confirmée : aucun « Río Negro » réel attesté parmi les
  affluents/distributaires documentés de l'Atrato ni sur la côte du Sinú
  (noms historiques attestés de l'Atrato avant le XVIIIe siècle : Darién,
  Nive, Chocó — jamais Negro). Repositionné avec Ronan dans le cadre
  d'un groupe de quatre cours de la rive est du golfe (N085, N079,
  R025/F-106_90, N084) : les rivières réelles de ce secteur sont le Río
  Caimán Viejo et le Río Caimán Nuevo, deux cours adjacents à hauteur de
  Necoclí (territoire du Resguardo Caimán Nuevo, peuple Tulé/Kuna). Par
  lecture directe de la carte (Ronan), Rio Negro est le plus au nord des
  deux — il correspond donc au **Caimán Viejo**, tandis que R. de los
  Redes (plus au sud, voir N079) correspond au Caimán Nuevo.
- **Sources :** Wikipédia (es) *Necoclí* ; ONIC, *Resguardo Caimán
  Nuevo* ; position relative (inventaire Jaillot, séquence proposée par
  Ronan).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la
  recherche négative sur « Rio Negro » est solide, mais l'assignation
  Caimán Viejo/Nuevo repose sur une lecture directe de la carte non
  vérifiable indépendamment ; reste ⚠️ moyen (voir aussi N079).

### N090 — s-maria-river

- **Toponyme Jaillot :** S. Maria River
- **Nom canonique (harmonisé) :** S. Maria River *(anglais/espagnol mixte, déjà complet — Jaillot n'a pas abrégé « River »)*
- **Territoire :** darien
- **Repères proches :** Santa María la Antigua del Darién (6,8 NM —
  distance la plus faible de tout le corpus), golfe d'Urabá (19,7 NM),
  New Edinburg (24,5 NM), San Sebastián de Buena Vista (32,5 NM). Voisin
  direct de Congo R. (relation « separate » à l'embouchure, cellule
  107_84).
- **Identification proposée / nom moderne :** **Río Tuira** pour le tronc
  commun, devenant **Río Chucunaque** pour la branche effectivement
  étiquetée « S. Maria Riv. » sur Jaillot (révision collaborative —
  remplace Río Tanela/Santa María la Antigua del Darién).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* L'hypothèse
  Río Tanela reposait sur la proximité au repère nommé « Santa María la
  Antigua del Darién » (6,8 NM, la plus courte distance du corpus) — mais
  ce rattachement caraïbe s'est révélé être une fausse piste commune à
  tout le cluster (voir N018, révision collaborative). Ronan a repéré
  sur la carte que ce cours (avec Congo R., Gold River et Sholes)
  débouche en réalité dans le « Golfe de St Michael » (Golfo de San
  Miguel, Pacifique), là où El Real de Santa María fut fondée en 1665 —
  précisément **à la confluence du Tuira et du Chucunaque**, ce qui
  correspond à la fourche initiale décrite par Ronan (un bras continuant
  vers l'Est, l'autre remontant au Nord). Le tracé Jaillot de ce cours
  se subdivise ensuite une seconde fois plus au nord, la branche
  principale continuant Nord (Chucunaque) et une nouvelle bifurquant au
  Nord-Est. Ronan a écrit l'étiquette « S. Maria Riv. » le long de la
  branche qui va plein Nord : c'est donc le **Chucunaque** qui porte le
  nom sur la carte, le tronc inférieur commun avant la fourche étant le
  **Tuira**. Les deux branches non étiquetées identifiées par Ronan —
  Río Chico (bras Est, bien que le Chico réel rejoigne plutôt le
  Chucunaque à Yaviza qu'il ne prolonge le Tuira — déformation
  cartographique plausible) et **Río Tuquesa** (bifurcation Nord-Est,
  préférée à Tupisa vu la distance relative de la confluence
  Chucunaque/Tuira) — ne sont pas digitalisées séparément dans
  l'inventaire (comme R. Vergues, voir N043) et n'ont donc pas
  d'identifiant propre ici.
- **Sources :** Wikipédia (en) *Tuira River*, *Chucunaque River* ;
  waterwaymap.org, *Río Chucunaque* (confluences Tupisa/Tuquesa/
  Ucurgantí/Membrillo/Mortí) ; lecture directe de la carte Jaillot
  (fourches et position de l'étiquette, proposée par Ronan) ; inventaire
  interne.
- **Recalibration (avec Ronan) :** examiné mais **non promu** — position
  bien recoupée (confluence historique réelle) mais sans appui
  toponymique, et l'attribution précise de branches reste interprétative ;
  reste ⚠️ moyen.

### N094 — sholes

- **Toponyme Jaillot :** Sholes
- **Nom canonique (harmonisé) :** Sholes *(anglais, déjà complet ; pas un fleuve nommé stricto sensu — voir raisonnement)*
- **Territoire :** darien
- **Repères proches :** New Edinburg (22,5 NM), San Sebastián de Buena
  Vista (48,8 NM), Santa María la Antigua del Darién (53,4 NM), Panama
  City (63,8 NM). Voisins directs : Cheapo R., Congo R. et S. Maria
  River.
- **Identification proposée / nom moderne :** **Río Chimán** (révision
  collaborative — ERR-020 retiré), côte Pacifique du golfe de Panama.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le nom
  anglais « Sholes » (apparenté à « shoals », hauts-fonds) et l'hypothèse
  d'une origine liée à la colonie écossaise de Caledonia sont abandonnés :
  ce cours appartient en réalité au même cluster pacifique que Congo R.,
  S. Maria River et Gold River (voir leurs fiches), débouchant dans le
  Golfo de San Miguel plutôt que sur la côte caraïbe. Sholes n'y débouche
  cependant pas directement : Ronan le situe à mi-chemin sur la côte
  entre Chepo/Bayano et le Golfo de San Miguel, ce qui correspond
  exactement à la position du **Río Chimán**, cours réel du golfe de
  Panama à mi-distance entre les deux (75 km au sud-est du district de
  Chepo). Confirmé par la structure de l'inventaire : Sholes est voisin
  direct à la fois de Cheapo R. (Chepo/Bayano) et de Congo R., exactement
  la position intermédiaire attendue.
- **Sources :** *Chimán, pueblo acorralado* — La Prensa Panamá ;
  lecture directe de la carte Jaillot (position relative, proposée par
  Ronan) ; inventaire interne (voisinage Cheapo R./Congo R.).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — position
  intermédiaire bien confirmée structurellement, mais sans appui
  toponymique ; reste ⚠️ moyen.

### N103 — veragua-r

- **Toponyme Jaillot :** Veragua R.
- **Nom canonique (harmonisé) :** Rio Veragua
- **Territoire :** panama
- **Repères proches :** Trinidad (5,4 NM), Santa Fe de Veraguas
  (7,3 NM — les deux distances les plus faibles du lot), Concepción/Bocas
  del Toro (13,5 NM), Puebla/Alanje — Costa Rica (39 NM), Chiriquí —
  Costa Rica (61,7 NM). Voisin direct de R. Belem.
- **Identification proposée / nom moderne :** **Río Cricamola** (révision
  collaborative), qui se jette dans la lagune de Chiriquí/Bocca del Toro
  — hypothèse la plus probable côté caraïbe, à défaut du Río San Pablo.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* Le toponyme
  « Veragua R. » reprend le nom de la province historique de Veraguas,
  dont Santa Fe de Veraguas était la capitale, mais **le Río Santa María
  (l'hypothèse initiale) est écarté** : vérifié qu'il débouche côté
  Pacifique (baie de Parita, frontière Coclé/Herrera), à 168 km de sa
  source près de Santa Fe — alors que le tracé Jaillot représente ici un
  cours débouchant côté caraïbe, dans la Bocca del Toro elle-même
  (proche de Trinidad, un port caraïbe, et de Concepción). Vérification
  cartographique complémentaire (Google Maps, par Ronan) : Santa Fe est
  positionnée sur la Jaillot juste au sud et anormalement proche de la
  Bocca del Toro, alors qu'elle se trouve en réalité au sud-est —
  distorsion cohérente avec les autres déformations connues de cette
  carte. Le meilleur candidat réel pour un cours se jetant dans la
  lagune de Chiriquí/Bocca del Toro est le **Río Cricamola** — sans lien
  hydrographique avec le Chiriquí Viejo ou le Chiriquí Nuevo (fleuves
  pacifiques homonymes, bassins distincts, déjà identifiés sous R015/
  R016 dans `fluvial-identification-synthese.md`). Le toponyme « Veragua »
  reste probablement une étiquette générique référant à la province
  plutôt qu'un nom de cours propre.
- **Sources :** Wikipédia (en) *Cricamola River* ; Wikipédia (es) *Río
  Santa María (Panamá)* ; lecture directe de la carte Jaillot et
  vérification Google Maps (proposées par Ronan) ; toponymie directe
  (province de Veraguas, Santa Fe de Veraguas).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la
  fiche mentionne elle-même une alternative encore envisageable (Río
  San Pablo, « à défaut de »), donc pas d'exclusivité positionnelle ;
  reste ⚠️ moyen.


---

## Secteur E — Nouvelle-Grenade / Venezuela (Maracaibo, Magdalena, Guajira)

### N004 — auyamas

- **Toponyme Jaillot :** Auyamas
- **Nom canonique (harmonisé) :** Auyamas *(pas d'abréviation)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** San Cristóbal (29 NM), Ocaña (60,9 NM), Mérida
  (67,9 NM), Pamplona (69,4 NM), Serranía de Opón (69,7 NM). Sortie
  (outlet) en jonction vers « Cesar Pompatao ».
- **Identification proposée / nom moderne :** **Quebrada La Ahuyamala /
  Río Torbes** — San Cristóbal fut fondée dans le « Valle de las
  Auyamas », toponyme colonial attesté qui survit dans l'hydronymie
  actuelle *(mise à jour — voir note ci-dessous ; la fiche n'avait pas
  été resynchronisée avec la table récapitulative lors du dernier
  passage)*.
- **Confiance :** ✅ fort *(mise à jour — voir note ci-dessous)*
- **Raisonnement :** Le nom « auyama » (calebasse/courge, terme
  antillais courant) est un toponyme descriptif banal en soi, mais San
  Cristóbal (repère le plus proche, 29 NM) fut fondée précisément dans
  le « Valle de las Auyamas » — attestation coloniale directe qui
  survit dans l'hydronymie actuelle (Quebrada La Ahuyamala) et situe le
  cours sur le Río Torbes, qui traverse cette même vallée. Le tracé
  Jaillot fait rejoindre l'Auyamas au Cesar Pompatao (= Río Cesar,
  bassin du Magdalena), alors que San Cristóbal appartient au bassin du
  lac de Maracaibo (Táchira) — distorsion cartographique déjà documentée
  ailleurs sur ce secteur andin (affluents des deux versants mélangés
  par les cartographes du XVIIIe siècle), qui n'invalide pas
  l'identification toponymique elle-même. **Synchronisation (avec
  Ronan) :** la table récapitulative avait déjà noté cette identification
  toponymique directe (convergence nom + position) et classé ✅ fort ;
  cette fiche n'avait pas suivi — corrigé lors de la passe de
  recalibration secteur par secteur.
- **Sources :** Toponymie coloniale (« Valle de las Auyamas », fondation
  de San Cristóbal) ; hydronymie actuelle (Quebrada La Ahuyamala, Río
  Torbes) ; raisonnement basé sur `fluvial-research-inventory.json`
  (nearbySettlements, outlets).

### N009 — buria-o-de-san-pedro

- **Toponyme Jaillot :** Buria o de San Pedro
- **Nom canonique (harmonisé) :** Buria o de San Pedro *(déjà complet, pas d'abréviation)*
- **Territoire :** venezuela
- **Repères proches :** Monts de San Pedro (9 NM), Barquisimeto (21,3 NM),
  Nirgua/Nueva Jerez (24,1 NM), El Tocuyo (51,4 NM), Lac de Tacarigua
  (65,9 NM). Sortie en jonction vers « Bariquicometo R. ».
- **Identification proposée / nom moderne :** **Río Buría** (état de
  Yaracuy, affluent du système Yaracuy/Turbio près de Barquisimeto).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique directe et non ambiguë —
  « Buria » est un nom conservé tel quel jusqu'à aujourd'hui (région de
  Buría/Bruzual, site historique du premier établissement espagnol minier
  du Venezuela, 1552). La position (entre Barquisimeto et Nirgua, dans le
  Nueva Segovia) correspond exactement au tracé du Río Buría moderne.
  Le doublet « o de San Pedro » est cohérent avec les Monts de San Pedro
  cités comme repère immédiatement voisin sur la carte.
- **Sources :** `fluvial-research-inventory.json` ; toponymie moderne
  connue (Buría, État de Yaracuy).

### N013 — cenu

- **Toponyme Jaillot :** Cenu
- **Nom canonique (harmonisé) :** Cenu *(pas d'abréviation)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** « Sinú » (ville, 10 NM), Tolú (12,1 NM), Bocachica
  (49,5 NM), Cartagena (64,8 NM), Tenerife (68,9 NM). Sortie directe en
  mer (« sea »).
- **Identification proposée / nom moderne :** **Río Sinú**.
- **Confiance :** ✅ fort
- **Raisonnement :** Le règlement le plus solide de tout le lot : le
  cours porte le nom « Cenu » (variante de Zenú/Sinú) et débouche
  directement en mer à quelques kilomètres de la ville nommée « Sinú » et
  du port de Tolú, sur le golfe de Morrosquillo — exactement la
  configuration réelle de l'embouchure du Río Sinú. La région de Cenú
  (Zenú) est historiquement célèbre pour l'orfèvrerie précolombienne
  pillée dès la Conquête, puis fut un axe de remontée pour des flibustiers
  cherchant à atteindre l'arrière-pays (raids sur les villages de
  l'intérieur, complémentaires à ceux menés via le Magdalena/Mompox).
- **Sources :** `fluvial-research-inventory.json` (nearbySettlements
  « Sinú », « Tolú »).

### N014 — cesar-pompatao

- **Toponyme Jaillot :** Cesar Pompatao
- **Nom canonique (harmonisé) :** Cesar Pompatao *(pas d'abréviation)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** Ciudad de los Reyes de Valledupar (6 NM), Ocaña
  (6,1 NM), Guatapori (34,1 NM), La Ramada (47,5 NM), Sierra Nevada de
  Santa Marta (51 NM). Sortie en jonction vers « Rio Grande de la
  Madalena ». Reçoit l'Auyamas (N004) en amont.
- **Identification proposée / nom moderne :** **Río Cesar**.
- **Confiance :** ✅ fort
- **Raisonnement :** Confirmation directe par recherche : « Pompatao »
  est le nom indigène chimila du Río Cesar, signifiant « seigneur de
  tous les fleuves » — le territoire chimila couvrait justement toute la
  vallée du Cesar. Le tracé Jaillot passe par Valledupar (fondée sur les
  rives du Cesar) puis rejoint le Rio Grande de la Madalena, exactement
  comme le Cesar réel se jette dans le Magdalena via la Ciénaga de
  Zapatosa. Double confirmation toponymique et géographique.
- **Sources :** Recherche web (Río Cesar = Pompatao, terme chimila,
  « seigneur de tous les rivières ») ; `fluvial-research-inventory.json`.

### N025 — lac-maracaibo

- **Toponyme Jaillot :** Lac Maracaibo
- **Nom canonique (harmonisé) :** Lac Maracaibo *(français, inchangé)*
- **Territoire :** venezuela
- **Repères proches :** Maracaibo (3,8 NM), San Antonio de Gibraltar
  (6,2 NM), Coro (11,7 NM), Carora (22 NM). Sortie en mer (« sea ») —
  correspond à la barre de Maracaibo.
- **Identification proposée / nom moderne :** **Lac de Maracaibo**
  (le lac lui-même, pas un cours d'eau).
- **Confiance :** ✅ fort
- **Raisonnement :** Identification triviale et non ambiguë — le
  toponyme, la forme (grande masse d'eau fermée), la position (Maracaibo
  au nord, Gibraltar au sud) et l'unique exutoire vers la mer
  correspondent exactement au lac de Maracaibo réel et à sa barre de
  sortie vers le golfe de Venezuela. Sert de point d'ancrage géographique
  pour situer les autres cours du secteur (Meracaybo River, R027/Chama).
- **Sources :** `fluvial-research-inventory.json`.

### N031 — meracaybo-river

- **Toponyme Jaillot :** Meracaybo River
- **Nom canonique (harmonisé) :** Meracaybo River *(anglais, déjà complet — variante orthographique de « Maracaibo » avec générique anglais, rien à abréger)*
- **Territoire :** venezuela
- **Repères proches :** San Antonio de Gibraltar (6,2 NM), Carora
  (10,2 NM), Mérida (12,4 NM), Trujillo (61,8 NM). Sortie en jonction vers
  « Lac Maracaibo » (donc un affluent qui SE JETTE dans le lac, pas
  l'exutoire du lac).
- **Identification proposée / nom moderne :** Non déterminé précisément —
  probablement un affluent méridional du lac de Maracaibo (candidats :
  Río Chama, Río Escalante, Río Motatán), distinct du lac lui-même.
- **Confiance :** ⚠️ moyen/faible
- **Raisonnement :** La question posée (confusion possible avec le lac
  lui-même) se résout clairement dans les données : « Meracaybo River »
  est géométriquement un cours distinct, entrant dans le lac par le sud
  (secteur San Antonio de Gibraltar/Mérida), à l'opposé de la barre de
  sortie vers la mer (au nord, près de la ville de Maracaibo). Ce n'est
  donc pas une redite du lac, mais bien un affluent. En revanche, il est
  très proche géographiquement du cours déjà identifié comme Río Chama
  (R027/f-93-119, jonction distincte, ✅ fort dans la session précédente),
  et pourrait représenter soit un bras différent du même delta (le Chama
  se divise en plusieurs bras près de Gibraltar), soit un fleuve voisin
  distinct (Escalante, Motatán, plus au sud vers Trujillo). Sans tracé
  plus précis, aucune identification univoque ne peut être forcée.
- **Sources :** `fluvial-research-inventory.json` (comparaison directe
  avec l'entrée f-93-119/R027) ; `fluvial-identification-synthese.md`.
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la
  fiche admet elle-même qu'aucune identification univoque ne peut être
  forcée sans tracé plus précis ; reste ⚠️ moyen/faible.

### N040 — pato-r

- **Toponyme Jaillot :** Pato R.
- **Nom canonique (harmonisé) :** Rio Pato
- **Territoire :** venezuela
- **Repères proches :** El Tocuyo (65,9 NM), Barquisimeto (90,8 NM),
  Porto Morequito (93 NM, sur l'Orénoque), Trujillo (96,5 NM),
  Tuteritona (110,7 NM). Territoires voisins : Venezuela / Nouvelle-
  Andalousie. Sortie en jonction vers « Bariquicometo R. ».
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan) — Río Pao**, affluent réel du Río Portuguesa.
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** RÉVISION. Le fleuve receveur « Bariquicometo R. »
  est désormais identifié (cf. N006, révision collaborative) comme la
  compression cartographique du système Río Turbio → Río Buría → Río
  Cojedes → Río Portuguesa. L'outlet de Pato R. dans
  `fluvial-research-inventory.json` est un `junction` vers Bariquicometo
  R. à la cellule `113_136`, exactement au point où le tronc Turbio/
  Buría/Cojedes bascule vers son identité aval (Portuguesa). Le Río Pao
  (268 km, traverse Carabobo/Cojedes/Guárico) se jette précisément dans
  le Río Portuguesa près d'El Socorro/Guadarrama — confluence réelle
  cohérente avec la position de la jonction sur la carte. « Pato » ↔
  « Pao » est une déformation phonétique plausible (ajout d'une
  consonne), du même ordre que les autres déformations déjà repérées
  dans ce secteur. L'hypothèse précédente (lieu-dit « El Pato », Barinas)
  est abandonnée : elle ne s'appuyait sur aucune structure hydrographique
  vérifiée, contrairement à cette nouvelle piste.
- **Sources :** `fluvial-research-inventory.json` (structure de jonction) ;
  [Río Pao — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Pao) ;
  [Río Portuguesa — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Portuguesa).
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort —
  jonction confirmée à la cellule exacte attendue par la structure du
  système Turbio/Buría/Cojedes/Portuguesa, ancienne hypothèse (lieu-dit
  El Pato) explicitement écartée faute de structure hydrographique.

### N046 — r-buchia

- **Toponyme Jaillot :** R. Buchia
- **Nom canonique (harmonisé) :** Rio Buchia
- **Territoire :** nouvelle-grenade
- **Repères proches :** Riohacha (5,5 NM), Guatapori (8,3 NM), La Ramada
  (16,4 NM), Ciudad de los Reyes de Valledupar (66,5 NM). Sortie directe
  en mer (« sea »).
- **Identification proposée / nom moderne :** **Río Ranchería**
  (historiquement « Río de la Hacha » / « Río del Hacha »).
- **Confiance :** ✅ fort *(reclassé lors de la passe de recalibration secteur par secteur — voir note ci-dessous)*
- **Raisonnement :** Riohacha fut fondée en 1545 précisément à
  l'embouchure du Río Ranchería, alors appelé « Río del Hacha » — c'est
  d'ailleurs de ce fleuve que la ville tire son nom. Le cours Jaillot
  débouche en mer à seulement 5,5 NM de Riohacha, sans aucun autre cours
  d'eau notable à proximité immédiate sur la carte : c'est donc, par
  élimination géographique, très probablement le même fleuve. Le
  toponyme « Buchia » lui-même reste non expliqué (possible corruption
  d'un nom indigène wayuu non retrouvé) — c'est ce qui limite la
  confiance à moyen plutôt que fort.
- **Sources :** Recherche web (fondation de Riohacha à l'embouchure du
  Río Ranchería/Río del Hacha, 1545) ; `fluvial-research-inventory.json`.
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen/fort à ✅ fort net
  — élimination géographique explicite (aucun autre cours notable à
  proximité immédiate de Riohacha), position exclusive malgré l'absence
  d'appui toponymique direct.

### N078 — rio-de-carare

- **Toponyme Jaillot :** Rio de Carare
- **Nom canonique (harmonisé) :** Rio de Carare *(déjà au format)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** Vélez (13,4 NM), Relais du Magdalena (22,2 NM),
  Serranía de Opón (26,4 NM), Bogotá (30,6 NM), Pamplona (58,7 NM).
  Sortie en jonction vers « Rio Grande de la Madalena ».
- **Identification proposée / nom moderne :** **Río Carare**.
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique exacte et conservée
  jusqu'à aujourd'hui — le Río Carare est un affluent bien connu du
  Magdalena moyen, prenant sa source dans la Serranía de los Yariguíes
  (à proximité de Vélez et de la Serranía de Opón, tous deux cités comme
  repères), avant de rejoindre le Magdalena. Aucun doute raisonnable.
- **Sources :** `fluvial-research-inventory.json` ; toponymie moderne
  (Río Carare, Santander).

### N082 — rio-grande-de-la-madalena

- **Toponyme Jaillot :** Rio Grande de la Madalena
- **Nom canonique (harmonisé) :** Rio Grande de la Madalena *(déjà au format ; graphie Jaillot « Madalena » conservée)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** Tamalameque (2,8 NM), Barrancas de Malambo
  (3 NM), Relais du Magdalena (7 NM), Tenerife (7,4 NM), Santa Marta
  (9,3 NM). Sorties multiples : embouchure en mer (branche B, près de
  Santa Marta/Barranquilla) et embouchure principale en mer, plus
  jonctions internes avec ses propres bras (C, D, E). Reçoit le Cesar
  Pompatao (Río Cesar), le Rio de Carare, le Rio Grande de Santa Martha
  (N083, = Río Cauca), et le Río San Jorge (R026, cf. synthèse révisée).
- **Identification proposée / nom moderne :** **Río Magdalena**.
- **Confiance :** ✅ fort
- **Raisonnement :** C'est le grand fleuve structurant de la Nouvelle-
  Grenade, sans ambiguïté possible : le tracé traverse tout l'intérieur
  du pays du sud (vers Bogotá/Vélez via le Carare) jusqu'à son embouchure
  dans la mer des Caraïbes près de Barranquilla/Santa Marta, en recevant
  au passage le Cesar (Pompatao) et le Cauca (Rio Grande de Santa
  Martha, N083), exactement la
  configuration hydrographique réelle. Le Magdalena fut historiquement un
  axe majeur de flibuste : les raids sur Mompox (port cité à quelques
  NM du tracé, cf. Rio Grande de Santa Martha) et les villes de
  l'intérieur néogrenadin passaient par ce fleuve et ses affluents
  (Cauca, Sinú/Cenú, Cesar), en particulier lors des grandes expéditions
  françaises et anglo-hollandaises contre Cartagena et l'arrière-pays au
  tournant du XVIIe-XVIIIe siècle.
- **Sources :** `fluvial-research-inventory.json` ; `fluvial-
  identification-synthese.md` (RÉVISÉ : R026 = Río San Jorge — et non
  Río Cauca, cf. résolution du conflit 2 en session de vérification
  croisée ; R025 = delta Atrato, repères fixes utilisés pour situer ce
  fleuve).

### N083 — rio-grande-de-santa-martha

- **Toponyme Jaillot :** Rio Grande de Santa Martha
- **Nom canonique (harmonisé) :** Rio Grande de Santa Martha *(déjà au format)*
- **Territoire :** nouvelle-grenade
- **Repères proches :** Tenerife (7,4 NM), **Santa Fe de Antioquia**
  (7,7 NM), Mompox (17,3 NM), Tamalameque (28,8 NM), Sinú (45,6 NM).
  Sortie en jonction vers « Rio Grande de la Madalena ». **RÉVISÉ : le
  voisin R026 n'est plus le Río Cauca mais le Río San Jorge** (résolution
  du conflit avec cette même fiche N083, qui conserve l'identification
  Cauca — cf. `fluvial-identification-synthese.md`, conflit 2). Les deux
  cours débouchent dans la même zone générale (Tenerife/Mompox) mais sont
  bien distincts.
- **Identification proposée / nom moderne :** **Río Cauca** — et non un
  fleuve de la Sierra Nevada de Santa Marta.
- **Confiance :** ⚠️ moyen/fort
- **Raisonnement :** Malgré son nom, ce cours n'a géographiquement rien à
  voir avec la ville côtière de Santa Marta ou les fleuves descendant de
  la Sierra Nevada (Manzanares, Gaira, Piedras, Guachaca — tous de courts
  cours côtiers indépendants) : son tracé passe par **Santa Fe de
  Antioquia**, ville fondée directement sur les rives du Río Cauca, avant
  de rejoindre le Rio Grande de la Madalena près de la zone de confluence
  réelle Cauca-Magdalena (Mompox/Brazo de Loba). La recherche confirme
  que « Río Grande de Santa Marta » est un nom historique attesté pour
  le Cauca dans la cartographie coloniale, hérité du fait que les
  premières explorations de l'intérieur (dont celles remontant vers
  Antioquia) partaient administrativement de la province de Santa Marta.
  Ce cours recoupe donc très probablement le même fleuve réel que le
  repère fixe R026 (déjà identifié Cauca), sans qu'on puisse trancher si
  les deux tracés Jaillot représentent deux bras distincts du même fleuve
  près de sa confluence ou une redondance de la carte source — d'où une
  confiance moyenne/forte plutôt que forte pure.
- **Sources :** Recherche web (mentions de « Río Grande de Santa Marta »
  comme nom historique du Cauca lié à la fondation d'Antioquia) ;
  `fluvial-research-inventory.json` (nearbySettlements « Santa Fe de
  Antioquia », « Mompox ») ; `fluvial-identification-synthese.md` (R026).
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la
  fiche admet elle-même ne pas pouvoir trancher entre deux bras
  distincts et une redondance de la carte source ; reste ⚠️ moyen/fort.


---

## Secteur F — Nouvelle-Andalousie / Suriname (delta de l'Orénoque -> Guyanes)

### N006 — bariquicometo-r

- **Toponyme Jaillot :** Bariquicometo R.
- **Nom canonique (harmonisé) :** Rio Bariquicometo *(suffixe « R. » harmonisé en préfixe « Rio » — toponyme d'origine hispano-indigène, sphère espagnole du Venezuela, malgré le format suffixe adopté ponctuellement par Jaillot)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Porto Morequito (2,1 NM carte), El Tocuyo (7 NM),
  Barquisimeto/Nueva Segovia (9,6 NM), Tuteritona (33,1 NM). Se jette dans
  l'Orénoque (`targetRiverId: "Orénoque"`) ; forme aussi une bifurcation
  (`fork`) vers Capuri River.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE (avec Ronan) — Río Turbio**, dont le cours (avec le Río Buría/N009) forme le Río Cojedes, qui reçoit le Pato R./Río Pao (N040) avant de devenir le Río Portuguesa, puis le **Río Apure** lui-même jusqu'à ses embouchures principales dans l'Orénoque (`114_143`). *(Mise à jour : le Río Apure est désormais rattaché au tronc principal N006 plutôt qu'à la fourche Capuri River/N010, réattribuée au Río Apurito — voir fiche N010.)*
- **Confiance :** ✅ fort
- **Raisonnement :** RÉVISION intégrale de l'analyse précédente. La piste
  « Barquisimeto » n'a pas été écartée à tort par excès de prudence sur
  le CRS interne — l'argument s'inverse une fois croisée la fiche déjà
  rédigée pour la ville de Barquisimeto (`js/villes-data.js`, id
  `barquisimeto`) : elle situe explicitement la ville « dans la vallée du
  río Turbio ». Ce n'est donc pas une coïncidence phonétique isolée mais
  une donnée déjà établie ailleurs dans le projet, jamais croisée lors de
  la première passe. Le cluster de villes concerné (Monts de San Pedro,
  Barquisimeto, El Tocuyo, Nirgua) est par ailleurs positionné très au
  sud sur la Jaillot par rapport à sa position réelle (coordonnées
  internes toutes en y≈4300-4580, proche du delta de l'Orénoque) — la
  même distorsion systématique déjà documentée pour ce secteur, qui
  explique l'allongement du cours jusqu'à l'Orénoque plutôt que de
  l'invalider.
  Vérification structurelle dans `fluvial-research-inventory.json` :
  l'outlet de Buria o de San Pedro (N009) est un `junction` vers
  Bariquicometo R. à la cellule `107_131` (Buría rejoint Bariquicometo,
  pas l'inverse) ; l'outlet de Pato R. (N040) est un `junction` vers
  Bariquicometo R. à la cellule `113_136` ; une relation `fork` vers
  Capuri River (N010) a lieu à la cellule `114_139` ; l'embouchure finale
  vers l'Orénoque est à la cellule `114_143`, immédiatement voisine de
  l'embouchure de Capuri River (`108_143`) et de l'exutoire du Lac de
  Caslipa (`108_144`, cf. N023).
  Recherche web indépendante : le Río Turbio se jette dans le Río Buría
  (aussi appelé Río Nirgua) pour former le Río Cojedes, qui rejoint le
  Río Portuguesa puis le Río Apure avant l'Orénoque — l'ensemble
  Turbio+Buría appartient donc bel et bien au bassin de l'Orénoque, ce
  qui confirme la jonction `Bariquicometo R. → Orénoque` de l'inventaire
  plutôt que de l'infirmer. Le tracé Jaillot compresse cette chaîne
  réelle de plusieurs confluences en un unique cours nommé.
- **Sources :** `js/villes-data.js` (entrée `barquisimeto`, mention
  explicite de la vallée du río Turbio) ; `fluvial-research-inventory.json`
  (structure des jonctions/forks) ; [Río Turbio (Venezuela) — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Turbio_(Venezuela)) ;
  [Valle del Turbio — Wikipedia](https://es.wikipedia.org/wiki/Valle_del_Turbio) ;
  [Sistema Lara-Falcón-Yaracuy — BiblioFEP](https://bibliofep.fundacionempresaspolar.org/media/16864/geo_u2_l77_lara_falcon_yaracuy_hidrografia.pdf).

### N010 — capuri-river

- **Toponyme Jaillot :** Capuri River
- **Nom canonique (harmonisé) :** Rio Capuri *(toponyme Jaillot réel, conservé plutôt que l'identification moderne « Río Apurito » ; suffixe « River » de style anglais harmonisé en « Rio » car le cours se situe en sphère espagnole vénézuélienne, non anglophone — même logique que May R./N030 en sens inverse)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Tuteritona (27,5 NM), Santo Tomé de Guayana
  (29,4 NM), Macurevoari (36,9 NM), Porto Morequito (40 NM). Se jette
  dans l'Orénoque ; reçoit une bifurcation depuis Bariquicometo R.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río Apurito**, distributaire réel du Río Apure.
- **Confiance :** ✅ fort
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort —
  position exclusive : la bifurcation et l'embouchure séparée
  correspondent exactement à la géométrie Jaillot (même longitude
  x=7108,3 que le tronc principal, mais nettement plus en aval), un vrai
  distributaire nommé (Río Apurito) existant précisément à cet endroit du
  système Apure. Absence d'attestation directe pour le diminutif
  « Capuri » lui-même, mais convergence positionnelle/structurelle sans
  candidat concurrent.
- **Raisonnement :** RÉVISION (seconde étape). L'hypothèse initiale
  (branche deltaïque « Capuri » attestée chez Ralegh, écho moderne Caño/
  Isla Capure) avait déjà été écartée au premier passage, faute de
  contact avec une cellule du delta ; ce « Capuri River » de l'inventaire
  forme une bifurcation (`fork`, cellule `114_139`) depuis le tronc
  Bariquicometo R./Río Turbio-Buría-Cojedes-Portuguesa (cf. N006), et
  rejoint l'Orénoque séparément à la cellule `108_143` — juste à côté de
  l'exutoire du Lac de Caslipa (`108_144`, cf. N023). Un premier temps de
  la révision avait attribué cette branche au Río Apure lui-même ; une
  vérification complémentaire a montré qu'un vrai distributaire nommé
  existe précisément à cet endroit du système : le **Río Apurito**, qui
  se détache de l'Apure à hauteur de l'aéroport de San Fernando et
  rejoint l'Orénoque en aval des embouchures principales de l'Apure
  (celles-ci sont à une vingtaine de km à l'ouest de Cabruta ; l'Apurito
  débouche plus près de Cabruta, donc plus en aval/à l'est). Cette
  position relative correspond exactement à la géométrie Jaillot : le
  tronc principal de Bariquicometo R. (N006, désormais identifié jusqu'à
  l'Apure) rejoint l'Orénoque à `114_143`, tandis que Capuri River
  fourche plus tôt et débouche séparément à `108_143` — même longitude
  (x=7108,3), mais nettement plus en aval (au nord, vers le delta) que le
  tronc principal. Le rapprochement phonétique « Capuri » ↔ « Apure »
  reste valable comme parenté de famille (l'Apurito n'étant qu'une
  branche de l'Apure), sans attestation directe pour le diminutif lui-
  même — d'où une confiance moyenne.
- **Sources :** `fluvial-research-inventory.json` (position et relations
  structurelles) ; [Río Apure — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Apure) ;
  [Río Portuguesa — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Portuguesa) ;
  recherche web (confluence Apure/Apurito près de San Fernando,
  embouchures distinctes dans l'Orénoque, proposée par Ronan).

### N011 — caturi-voari-river

- **Toponyme Jaillot :** Caturi Voari River
- **Nom canonique (harmonisé) :** Rio Caturi Voari *(toponyme Jaillot réel ; suffixe « River » harmonisé en « Rio » — même logique que Capuri River/N010, sphère espagnole des Llanos, malgré le format anglicisant utilisé ici par Jaillot)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Ariacoa (31,7 NM), Macurevoari (40,2 NM), Santo
  Tomé de Guayana (45,8 NM). Se jette dans l'Orénoque ; relation
  « separate » avec un cours non identifié (F-95_143-C).
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río Espino**, rivière réelle des Llanos centraux
  (bassin Guárico/Anzoátegui).
- **Confiance :** ✅ fort
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — la
  fiche indique elle-même que sa confiance est « alignée sur celle de
  Capuri River/N010 [...] pour rester cohérente avec la chaîne de
  raisonnement du secteur [...] même type d'identification structurelle,
  sans ancrage toponymique direct » ; N010 étant désormais promu selon le
  même critère (position exclusive, absence de candidat concurrent),
  N011 suit par cohérence interne explicite.
- **Raisonnement :** Le second élément du nom, « Voari », fait toujours
  écho à « Macurevoari », signe que le toponyme lui-même appartient à la
  couche cartographique légendaire — mais l'identification retenue ne
  repose pas sur le nom, plutôt sur la position et la structure. Voisin
  immédiat sur la carte : une relation `separate` avec un cours non
  étiqueté (F-95_143-C, `fluvial-identification-synthese.md`, R028),
  parallèle et du même côté (rive nord/Llanos) de l'Orénoque. Aucun des
  deux n'est en réalité proche de Santo Tomé de Guayana malgré les
  distances internes de l'inventaire — l'hypothèse antérieure pour
  F-95_143-C (Río Usupamo, fondée sur cette proximité supposée) a été
  retirée en conséquence. Caturi Voari River et F-95_143-C correspondent
  respectivement au **Río Espino** et au **Río Zuata**, deux rivières
  réelles et distinctes des Llanos centraux qui rejoignent l'Orénoque par
  la rive nord entre l'Apure et le Caroní — assignation fondée sur la
  lecture directe de la carte (parallélisme, éloignement relatif de
  Santo Tomé). Confiance alignée sur celle de Capuri River/N010 = Río
  Apurito, pour rester cohérente avec la chaîne de raisonnement du
  secteur Bariquicometo/Apure/Apurito (même type d'identification
  structurelle, sans ancrage toponymique direct).
- **Sources :** Analyse interne ; comparaison avec *The Discoverie of
  Guiana* (Ralegh, 1596), mention de « Macureguarai » confirmée
  (archive.org, *discoveryofguian00rale*) ; `fluvial-research-inventory.json`
  (relation `separate` avec F-95_143-C) ; recherche web (Río Espino/Río
  Zuata, Llanos centraux, proposée par Ronan).

### N019 — coyrama-r

- **Toponyme Jaillot :** Coyrama R.
- **Nom canonique (harmonisé) :** Rio Coyrama *(préfixe « R. » harmonisé en « Rio » — convention cartographique assumée, sphère espagnole ; nom conservé tel quel malgré l'absence de correspondance réelle)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Aromaia (17,6 NM), Macurevoari (57,9 NM), Santo
  Tomé de Guayana (87,6 NM). Se jette directement dans l'Orénoque, sans
  relation avec d'autres cours.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Coyrama, convention cartographique assumée** (ERR-003
  retiré).
- **Confiance :** 🎲 convention cartographique
- **Raisonnement :** RÉVISION. Petit affluent isolé au nord d'Aromaia
  (toponyme de Ralegh, province du cacique du même nom dans *The
  Discoverie of Guiana*). Le recensement exhaustif du secteur
  Caroní-Pomeroon (voir aussi N065, N011) n'a laissé aucun candidat
  réel disponible pour ce toponyme. Plutôt que de le maintenir en
  « vraisemblablement erroné », Ronan propose de l'assumer comme
  élément de la même couche cartographique légendaire/imaginaire que
  Lac de Caslipa/N023 (rivière fictive assumée pour la campagne, au même
  titre qu'un lac ou une cité légendaire figurant sur une carte
  d'époque) — sans prétendre à une correspondance réelle, mais sans le
  disqualifier comme erreur de dessin non plus.
- **Sources :** Analyse interne ; recensement exhaustif du secteur
  Caroní-Pomeroon (proposé par Ronan).

### N021 — europa-river

- **Toponyme Jaillot :** Europa River
- **Nom canonique (harmonisé) :** Rio Europa *(toponyme d'origine non
  attestée/inexpliquée — traité par défaut selon la sphère géographique,
  delta de l'Orénoque sous revendication espagnole ; suffixe « River »
  harmonisé en préfixe « Rio », origine linguistique du nom lui-même
  incertaine)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Ariacoa (22,5 NM), Aromaia (49,4 NM), San José de
  Macuro (67,7 NM), Verina/Cariaco (70,9 NM). Embouchure en mer
  (`type: "sea"`), sans lien direct avec l'Orénoque dans les relations
  topologiques (l'entrée « orenoque » dans `neighbouringWatercourses` a
  une liste `riverIds` vide).
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Caño Macareo**, bras nord du delta de l'Orénoque
  débouchant sur le sud du golfe de Paria, vers le chenal de Colón/
  Boca de Serpientes.
- **Confiance :** ✅ fort
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort —
  Ariacoa est « de très loin le plus proche » des repères (superlatif
  explicite, 22,5 NM contre 67,7 et 70,9 NM pour les repères de la
  péninsule de Paria), signal positionnel exclusif malgré l'absence
  d'explication pour le toponyme « Europa » lui-même — même famille de
  raisonnement que Bariquicometo R./N006 et Capuri River/N010, tous deux
  déjà classés ✅ fort sur ce type de critère.
- **Raisonnement :** Les repères proches sont plus révélateurs que la
  lecture initiale ne le suggérait : Ariacoa (toponyme du delta sud) est
  de très loin le plus proche (22,5 NM), bien avant San José de Macuro et
  Verina/Cariaco (67,7 et 70,9 NM, sur la péninsule de Paria). La sortie
  en mer se situe donc entre le secteur deltaïque et la côte de Paria —
  exactement la position du Macareo, un des principaux bras du delta de
  l'Orénoque, dont l'embouchure donne sur le sud du golfe de Paria, non
  loin du chenal de Colón. Le nom « Europa » reste sans explication
  (aucun hydronyme de ce type attesté dans la région) — écart
  toponymique assumé, comme pour Bariquicometo R./N006 (Río Apure) et
  Capuri River/N010 (Río Apurito), où seul l'ancrage structurel/
  positionnel a permis l'identification.
- **Sources :** [Macareo del Orinoco — Wikipedia (es)](https://es.wikipedia.org/wiki/Macareo_del_Orinoco) ;
  inventaire interne (positions, distances aux repères, proposée par
  Ronan).

### N023 — lac-de-caslipa

- **Toponyme Jaillot :** Lac de Caslipa
- **Nom canonique (harmonisé) :** Lac de Caslipa *(nom français déjà complet/au format — inchangé, convention cartographique assumée)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Macurevoari (5,4 NM), Santo Tomé de Guayana
  (5,9 NM), Tuteritona (13,3 NM). Bifurque depuis l'Orénoque
  (`fork`, fromRiverId: "Orénoque") et s'y rejette (`junction`,
  targetRiverId: "Orénoque") — donc un lac/bras traversé par le fleuve,
  très proche de Santo Tomé de Guayana.
- **Identification proposée / nom moderne :** **Lac Cassipa** — figure
  légendaire de la cartographie de Guiane héritée de l'expédition de Sir
  Walter Ralegh (1595-96) et de la carte de Jodocus Hondius (1598),
  souvent représenté à proximité du Lac Parime et de « Manoa al Dorado »
  sur les cartes du XVIIe-XVIIIe siècle (Hondius, Blaeu). Pas de plan
  d'eau réel équivalent aujourd'hui.
- **Confiance :** 🎲 convention cartographique
- **Raisonnement :** La proximité immédiate avec Santo Tomé de Guayana et
  le fait que ce soit un simple élargissement/détour de l'Orénoque
  correspond bien à la position attribuée au Lac Cassipa sur les cartes
  post-Hondius (au sud de l'Orénoque, dans la région aurifère légendaire
  visitée par Ralegh). Les sources confirment l'existence cartographique
  de ce lac (« mountains separate Lake Parime from Lake Cassipa » —
  légendes sur cartes de 1621, Blaeu) et sa réputation aurifère (« much
  gold » dans le sable des rivières autour du lac Cassipa). Il s'agit
  d'un objet cartographique semi-légendaire plutôt que d'un plan d'eau
  identifiable sur le terrain aujourd'hui — à traiter comme telle sur la
  carte de jeu (au même titre que R012/Yucatán dans la session
  précédente).

  **COMPLÉMENT COLLABORATIF (avec Ronan).** Le nom « Cassipa » n'est pas
  une pure invention de graveur : il dérive des **Cassipagotos**, un
  peuple réellement mentionné à la fois par Ralegh et par son lieutenant
  Lawrence Keymis (*A Relation of the Second Voyage to Guiana*, 1596) ;
  Hondius a nominalisé ce nom de peuple en « Lacus Cassipa » sur sa carte
  de 1598. Plus significatif : en 1594, Ralegh était entré en possession
  d'un **récit espagnol** situant une cité d'or **aux sources du Río
  Caroní** — c'est cette information précise qui a nourri la légende
  reprise par Hondius. Il y a donc un ancrage réel documenté (le Caroní,
  fleuve aurifère bien réel) derrière la convention cartographique, même
  si aucun lac naturel de 40 miles n'a jamais existé.
  Piste ouverte, non tranchée : Ronan a relevé une correspondance visuelle
  frappante entre la position de Caslipa sur la Jaillot et l'**Embalse de
  Guri** (retenue du Cañón de Necuima, ~90-100 km en amont de l'embouchure
  du Caroní, site montagneux du socle guyanais — relief naturel réel,
  mais sans lac naturel attesté avant la mise en eau du barrage en 1968).
  Objection : le récit de 1594 situe la légende aux *sources* du Caroní,
  beaucoup plus loin en amont (région du Gran Sabana) que Necuima/Guri.
  Cela dit, le secteur Bariquicometo/Turbio tout proche montre déjà que
  la Jaillot comprime dans cette zone des systèmes fluviaux réels de
  plusieurs centaines de km — rien n'exclut que « les sources du Caroní »
  aient subi la même compression et se retrouvent, comme Turbio/Buría/
  Apure, ramenées près de Santo Tomé de Guayana. Alternative avancée par
  Ronan : le « lac » pourrait aussi représenter, non pas un vrai plan
  d'eau, mais le bras du Caroní encerclant l'île où se trouvait Santo
  Tomé de Guayana — cohérent avec la déformation d'orientation de la
  carte dans ce secteur (proche de la limite de carte ; le sud réel y
  serait plutôt vers l'ESE sur la Jaillot). Aucune de ces deux pistes
  n'est confirmée à ce stade — à creuser plus avant si une source
  cartographique ou coloniale plus précise sur le Caroní est trouvée.

  **MISE À JOUR (avec Ronan).** Varacoyari River (N102), voisin direct
  de Lac de Caslipa sur la carte, a depuis été identifié comme le
  **Río Caroní** lui-même (voir fiche N102) — ce qui recoupe bien la
  légende de 1594 (cité d'or aux sources du Caroní) associée à ce lac.
  L'hypothèse Guri reste néanmoins écartée pour les deux entités : le
  lac est un ouvrage artificiel (mise en eau à partir de 1969), sans
  existence naturelle avant le barrage.
- **Sources :** [Earth:Lake Parime - HandWiki](https://handwiki.org/wiki/Earth:Lake_Parime) ;
  [Nieuwe Caerte van het wonderbaer ende goudrijcke landt Guiana (Hondius, 1598) — Barry Lawrence Ruderman Antique Maps](https://www.raremaps.com/gallery/detail/46151/nieuwe-caerte-van-het-wonderbaer-ende-goudrijcke-landt-guian-hondius) ;
  archive.org, *The discovery of Guiana* (Ralegh, 1596, éd. ultérieure) ;
  [New Map of the Wonderful, Large and Rich Land of Guiana — Greater Caribbean Mapping](https://greatercaribbeanmaps.org/maps/new-map-of-the-wonderful-large-and-rich-land-of-guiana/) ;
  [Lawrence Kemys — Wikipedia](https://en.wikipedia.org/wiki/Lawrence_Kemys) ;
  [Central Hidroeléctrica Simón Bolívar (Guri) — Wikipedia](https://es.wikipedia.org/wiki/Central_Hidroel%C3%A9ctrica_Sim%C3%B3n_Bol%C3%ADvar) ;
  [Embalse de Guri — Wikipedia](https://es.wikipedia.org/wiki/Embalse_de_Guri).

### N036 — orenoque

- **Toponyme Jaillot :** Orénoque
- **Nom canonique (harmonisé) :** Orénoque *(nom français déjà complet/au format — inchangé)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Tuteritona (3,4 NM), Porto Morequito (13,3 NM),
  Aromaia (14,5 NM), Santo Tomé de Guayana (15,8 NM), Ariacoa (20,8 NM).
  Quatre embouchures en mer distinctes (Delta_Orénoque_1, 2, 3 et le
  bras principal), plus des bras internes B/C/D et des jonctions vers
  Bariquicometo, Capuri, Lac de Caslipa, Coyrama, Varacoyari,
  R. Maryowapaneko.
- **Identification proposée / nom moderne :** **Fleuve Orénoque**
  (Venezuela) — un des plus grands fleuves d'Amérique du Sud, delta
  multi-bras au débouché sur le golfe de Paria/l'Atlantique.
- **Confiance :** ✅ fort
- **Raisonnement :** Identification évidente, cas fort candidat pour la
  hiérarchie de niveau 1 (fleuve principal du secteur). Jaillot relève un
  delta à quatre bouches principales (les trois « Delta_Orénoque » plus
  le bras « Orénoque » lui-même), simplification par rapport au delta
  réel moderne qui compte une dizaine de distributaires actifs (Caño
  Manamo à l'ouest, Boca Grande — la bouche principale et navigable —,
  Macareo, Pedernales, Cocuina, Mariusa, etc., jusqu'à la Boca de
  Serpiente/Serpent's Mouth face à Trinidad à l'est). Le tracé Jaillot,
  avec ses multiples bras se rejoignant/bifurquant autour de Santo Tomé
  de Guayana, correspond bien à la morphologie deltaïque réelle du bas
  Orénoque, même si le nombre et la position exacte des bras ne
  correspondent pas terme à terme aux caños modernes.
- **Sources :** [Le delta de l'Orénoque - Persée](https://www.persee.fr/doc/globe_0398-3412_1913_sup_52_1_5308) ;
  [Orinoco Delta - Wikipedia](https://en.wikipedia.org/wiki/Orinoco_Delta) ;
  [carte du delta de l'Orénoque à Puerto Cabello - Gallica/BnF](https://gallica.bnf.fr/ark:/12148/btv1b53122172z).

### N038 — ovarabiche-r

- **Toponyme Jaillot :** Ovarabiche R.
- **Nom canonique (harmonisé) :** Rio Ovarabiche *(suffixe « R. » harmonisé en préfixe « Rio » — sphère espagnole du Venezuela)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Verina/Cariaco (31,2 NM), San José de Macuro
  (36,1 NM), Santiago de Araya (46,1 NM), Cumaná (49,5 NM), Barcelona
  (62,5 NM). Deux embouchures en mer (branche principale et branche B),
  aucun lien avec l'Orénoque.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río San Juan** (Monagas), avec le **Río Guarapiche**
  reconnu comme son principal affluent amont plutôt que comme
  l'identification directe.
- **Confiance :** ⚠️ moyen
- **Recalibration (avec Ronan) :** examiné mais **non promu** — le
  raisonnement reste au comparatif (« correspond mieux à... que ») et
  conclut par un hedge explicite (« le toponyme Jaillot marque plus
  vraisemblablement le point d'embouchure... que le cours amont »),
  sans convergence toponyme+position ni exclusivité positionnelle
  affirmée — ne satisfait pas le critère de promotion retenu depuis le
  secteur D.
- **Raisonnement :** Le Río San Juan naît de la confluence du Guarapiche
  et du Caripe et c'est lui, sous ce nom, qui débouche au golfe de Paria
  (le Guarapiche s'y jette via le Caño Francés, en amont de l'embouchure
  finale). La position d'Ovarabiche — nettement au nord, proche de
  Verina/Cariaco et San José de Macuro (31,2 et 36,1 NM), loin de
  Barcelona/Cumaná (49,5 et 62,5 NM) — correspond mieux à l'embouchure du
  San Juan qu'à un cours générique du Guarapiche. La double sortie en mer
  (branche principale + branche B, en fourche) est cohérente avec un
  estuaire, comme celui du San Juan. Rapprochement phonétique
  « Ovarabiche »/« Guarapiche » toujours pertinent pour le système dans
  son ensemble, mais le toponyme Jaillot marque plus vraisemblablement le
  point d'embouchure (San Juan) que le cours amont (Guarapiche).
- **Sources :** [Río San Juan (Caripito, Monagas) — Wikipedia (es)](https://es.wikipedia.org/wiki/R%C3%ADo_San_Juan_(Caripito,_Estado_Monagas,_Venezuela)) ;
  inventaire interne (positions, distances aux repères).

### N042 — r-amacuro

- **Toponyme Jaillot :** R. Amacuro
- **Nom canonique (harmonisé) :** Rio Amacuro *(déjà au format « R. » →
  « Rio » — sphère espagnole/zone frontalière du Venezuela ; toponyme
  Jaillot conservé malgré le faux-ami avec le Río Amacuro moderne, qui
  correspond en réalité à R Amachara, cours voisin non digitalisé)*
- **Territoire :** suriname (à la limite nouvelle-andalousie/suriname,
  distance 0 aux deux zones)
- **Repères proches :** Nieuw Middelburg (48,9 NM), Fort Kyk-Over-Al
  (72 NM), Aromaia (118,3 NM). Embouchure en mer, seul voisin
  hydrographique listé : R. Waymy.
- **Identification proposée / nom moderne :** **Río Barima** (révision
  collaborative — faux-ami toponymique : le nom « Amacuro » écrit ici
  par Jaillot ne correspond pas au Río Amacuro moderne).
- **Confiance :** ✅ fort
- **Raisonnement :** *(RÉVISION COLLABORATIVE — avec Ronan)* L'identification
  initiale (Río Amacuro) reposait sur la correspondance directe du nom
  et la position générale (juste à l'est de l'Orénoque, à la charnière
  nouvelle-andalousie/suriname). Une relecture de la carte, l'overlay
  géopolitique du territoire nouvelle-andalousie/Guyane ayant
  initialement masqué ce tracé, a révélé que ce cours est en réalité
  plus long que ce qu'on attendrait d'un simple cours-frontière mineur —
  cohérent avec le **Río Barima** réel (environ 338 km, née dans les
  monts Imataca, traverse les marécages du delta de l'Orénoque jusqu'à
  l'Atlantique, à 6 km seulement de l'embouchure du fleuve). Le nom
  « Amacuro » écrit par Jaillot à cet endroit est donc un faux-ami : le
  Río Amacuro moderne, plus modeste, correspond en réalité à un cours
  voisin distinct repéré par Ronan sur la carte — « **R Amachara** »,
  légèrement à l'ouest, non digitalisé dans l'inventaire (comme R.
  Vergues, voir N043). Un crop haute résolution fourni par Ronan a
  confirmé l'ensemble de la lecture. D'est en ouest sur ce tronçon de
  côte : « **Spruyt** » (orthographe confirmée par Ronan sur le scan
  haute résolution — le « y » est lisible ; longueur modeste, débouchant
  dans une petite baie dominée par « Cap Nassau », toponyme non
  retrouvé par ailleurs mais cohérent avec la présence hollandaise du
  secteur), « **R Waymy** » (tout petit, = N075, inchangé, toujours Río
  Waini), « **R Amacuro** » (= ce cours, N042, réidentifié Barima), puis
  « **R Amachara** » (assez petit, proposé comme le Río Amacuro
  moderne). Pour Spruyt, seul candidat réel trouvé entre le Waini et le
  Pomeroon : le **Río Moruca** (région Barima-Waini, Guyana), dont la
  position — accessible aujourd'hui en longeant la côte depuis le
  Pomeroon — correspond exactement à la place de Spruyt dans la
  séquence. Seuls N042 et N075 sont digitalisés dans l'inventaire ;
  Spruyt et Amachara restent à tracer.

  Plus au sud, un second groupe de cours Jaillot descend vers le delta
  depuis l'intérieur des terres, d'est en ouest : R Amachara (voir
  ci-dessus), **R Maritere**, **R Sebarrima**, **R Corobana**, puis
  R. Maryowapaneko (N065, digitalisé, voir sa fiche — nettement plus
  long/sinueux que les trois précédents sur la carte). Identifications
  proposées par Ronan, confiance faible dans les deux derniers cas :
  R Maritere = **Río Arature** (écho étymologique plausible, cours réel
  confirmé du Delta Amacuro) ; R Sebarrima = **Río Aguirre/Aquire**
  (cours réel confirmé du Delta Amacuro, mais correspondance
  toponymique faible — réserve : « Sebarrima » pourrait aussi être un
  nouvel écho du Barima, comme Voari/Macurevoari ou Coyrama/Varacoyari
  ailleurs sur cette carte) ; R Corobana = **Río Imataca** (réserve :
  l'Imataca draine une sierra assez éloignée de la côte, contrairement
  aux cours voisins purement côtiers — pourrait aussi être l'un des
  distributaires propres de l'Orénoque, Manamo ou Pedernales, voir
  N065). Ronan a validé ces deux dernières hypothèses en connaissance de
  cause : « il faut admettre le degré d'imprécision ponctuel de la
  Jaillot ». Aucun de ces quatre cours (Maritere, Sebarrima, Corobana,
  et Amachara déjà cité) n'est digitalisé dans l'inventaire.
- **Sources :** [Barima River - Wikipedia](https://en.wikipedia.org/wiki/Barima_River) ;
  [Amacuro River - Wikipedia](https://en.wikipedia.org/wiki/Amacuro_River) ;
  [Delta Amacuro - Wikipedia](https://en.wikipedia.org/wiki/Delta_Amacuro) ;
  [Moruka River - Wikipedia](https://en.wikipedia.org/wiki/Moruka_River) ;
  lecture directe de la carte Jaillot, crop haute résolution (proposée
  par Ronan).

### N045 — r-berbice

- **Toponyme Jaillot :** R. Berbice
- **Nom canonique (harmonisé) :** Berbice *(toponyme néerlandais colonial
  — reste tel quel par sphère linguistique, préfixe « R. » simplement
  retiré ; le fleuve porte aujourd'hui couramment le nom anglicisé
  « Berbice River », mais le nom propre lui-même n'est ni espagnol ni
  britannique d'origine)*
- **Territoire :** suriname
- **Repères proches :** Villages du delta du Suriname (4,2 NM), Fort
  Kyk-Over-Al (43,4 NM), Nieuw Middelburg (59 NM), Paramaribo (75,4 NM).
  Embouchure en mer ; voisin direct de R. Corretine (relations
  « separate » à deux endroits).
- **Identification proposée / nom moderne :** **Rivière Berbice**
  (Guyana).
- **Confiance :** ✅ fort
- **Raisonnement :** Nom identique au toponyme moderne, position
  cohérente entre l'Essequibo (à l'ouest) et le Corentyne (à l'est),
  exactement l'ordre géographique réel des grands fleuves guyanais. La
  colonie hollandaise de Berbice existait déjà avant 1713.
- **Sources :** Analyse interne + cohérence positionnelle avec
  R. Essequebe/R. Corretine.

### N048 — r-copanama

- **Toponyme Jaillot :** R. Copanama
- **Nom canonique (harmonisé) :** Copanama *(sphère néerlandaise du
  Suriname — reste tel quel, préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Paramaribo (13,9 NM), Villages du delta du
  Suriname (54,6 NM). Embouchure en mer ; relations « separate » multiples
  avec R. Marateka_C et Suriname_B — indique un secteur deltaïque
  complexe, chenaux imbriqués, immédiatement à l'est de l'estuaire du
  Suriname.
- **Identification proposée / nom moderne :** Non déterminé (hypothèse
  faible : partie du système Commewijne/Cottica, à l'est de Paramaribo).
- **Confiance :** ⚠️ faible
- **Recalibration (avec Ronan) :** examiné mais **non promu** — « rien
  dans le nom [...] ne permet de trancher » entre Commewijne et Cottica
  (ou un troisième cours disparu) ; hypothèse explicitement non tranchée,
  aucune promotion possible.
- **Raisonnement :** La position (juste à l'est de l'estuaire du
  Suriname, avant R. Marateka et R. Marrawini) correspond à la zone où se
  trouvent aujourd'hui les rivières Commewijne et Cottica, mais rien dans
  le nom « Copanama » ne permet de trancher lequel de ces cours (ou un
  troisième, aujourd'hui disparu/comblé) il représente. Le fait que
  Jaillot documente ici trois cours voisins (Copanama, Marateka,
  Marrawini) pour un espace qui n'en compte que deux-trois aujourd'hui
  (Commewijne, Cottica, Marowijne) suggère une possible sur-segmentation
  ou un dédoublement cartographique d'un même système deltaïque plutôt
  que trois fleuves indépendants clairement identifiables un à un.
- **Sources :** [Commewijne River - Wikipedia](https://en.wikipedia.org/wiki/Commewijne_River) ;
  [Cottica River - Wikipedia](https://en.wikipedia.org/wiki/Cottica_River).

### N050 — r-corretine

- **Toponyme Jaillot :** R. Corretine
- **Nom canonique (harmonisé) :** Corentyne *(sphère néerlandaise ;
  graphie modernisée conservée sans générique — préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Villages du delta du Suriname, à l'est de
  R. Berbice ; branche principale + deux bras secondaires (B et C) ;
  relations « separate » avec R. Berbice à deux endroits, cohérent avec
  deux fleuves parallèles proches de leur embouchure.
- **Identification proposée / nom moderne :** **Corantijn / Courantyne**,
  actuel fleuve-frontière Suriname–Guyana.
- **Confiance :** ✅ fort
- **Raisonnement :** Déformation phonétique mineure et classique
  (Corretine → Corantijn/Courantyne, l'un des noms hollandais du fleuve
  reste jusqu'à aujourd'hui « Corantijn »), position immédiatement à
  l'est du Berbice — exactement la position réelle du Corentyne, qui
  sert de frontière entre le Suriname et le Guyana actuels.
- **Sources :** [Courantyne River - Wikipedia](https://en.wikipedia.org/wiki/Courantyne_River) ;
  [Corantijn River - WorldAtlas](https://www.worldatlas.com/rivers/corantijn-river.html).

### N056 — r-essequebe

- **Toponyme Jaillot :** R. Essequebe
- **Nom canonique (harmonisé) :** Essequibo *(sphère néerlandaise ;
  graphie modernisée conservée sans générique — préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Fort Kyk-Over-Al (5,3 NM — fort hollandais
  historique situé précisément au confluent Essequibo/Mazaruni/Cuyuni),
  Nieuw Middelburg (19,4 NM). Embouchure en mer ; voisin direct de
  R. Poumaron.
- **Identification proposée / nom moderne :** **Rivière Essequibo**
  (Guyana).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance de nom directe (Essequebe/Essequibo)
  et confirmation topographique décisive : Fort Kyk-Over-Al, poste
  hollandais historique bâti au confluent des rivières Essequibo,
  Mazaruni et Cuyuni, se trouve à seulement 5,3 NM (carte) de
  l'embouchure relevée par Jaillot — cohérence maximale.
- **Sources :** Analyse interne (position de Fort Kyk-Over-Al dans
  `villes-data.js`, recoupée avec l'inventaire).

### N063 — r-marateka

- **Toponyme Jaillot :** R. Marateka
- **Nom canonique (harmonisé) :** Marateka *(sphère néerlandaise du
  Suriname — reste tel quel, préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Paramaribo (proche, secteur est de l'estuaire du
  Suriname). Quatre branches (main, B, C, D) ; relations « separate »
  avec R. Copanama (branche C) ; se jette en mer par deux embouchures
  distinctes.
- **Identification proposée / nom moderne :** Non déterminé (même
  hypothèse que R. Copanama : complexe Commewijne/Cottica).
- **Confiance :** ⚠️ faible
- **Recalibration (avec Ronan) :** examiné mais **non promu** — « aucun
  élément (phonétique ou positionnel) ne permet de l'assigner avec
  confiance » ; identique au cas de R. Copanama/N048.
- **Raisonnement :** Cours le plus ramifié du secteur deltaïque est de
  Paramaribo, imbriqué avec R. Copanama. Comme pour ce dernier, aucun
  élément (phonétique ou positionnel) ne permet de l'assigner avec
  confiance à un cours moderne précis (Commewijne ou Cottica) plutôt qu'à
  l'autre.
- **Sources :** Analyse interne ; cf. sources de N048.

### N064 — r-marrawini

- **Toponyme Jaillot :** R. Marrawini
- **Nom canonique (harmonisé) :** Marrawini *(sphère néerlandaise du
  Suriname — reste tel quel, préfixe « R. » retiré ; toponyme Jaillot
  conservé plutôt que l'hypothèse moderne « Commewijne », par cohérence
  avec la convention adoptée pour les autres toponymes ambigus du
  secteur)*
- **Territoire :** suriname
- **Repères proches :** Paramaribo (42,4 NM). Se jette directement dans
  le fleuve Suriname (`outlets` : `type: "junction", targetRiverId:
  "Suriname"`), au point le plus proche de la mer du bras « Suriname »
  principal — donc représenté comme un affluent, pas comme une embouchure
  indépendante.
- **Identification proposée / nom moderne :** **Commewijne** (hypothèse) —
  écarté en première intention : Marowijne/Maroni (frontière
  Suriname–Guyane française).
- **Confiance :** ⚠️ moyen
- **Recalibration (avec Ronan) :** examiné mais **non promu** — la fiche
  garde un doute résiduel explicite (« sous réserve qu'il pourrait aussi
  s'agir d'une confusion/fusion cartographique Commewijne-Marowijne »),
  ce qui écarte toute exclusivité positionnelle affirmée.
- **Raisonnement :** La ressemblance phonétique à « Marowijne/Maroni » est
  frappante à première vue, mais la topologie du dossier (Marrawini
  représenté comme un simple affluent qui rejoint le Suriname près de son
  embouchure, et non comme un fleuve indépendant avec sa propre bouche à
  la mer, comme l'est réellement le Marowijne) ne colle pas avec un
  Marowijne réel — trop éloigné et sans lien hydrographique avec le
  Suriname dans la réalité. En revanche, les sources indiquent que la
  Commewijne portait aux XVIe-XVIIe siècles les formes « Camaiwini » et
  « Cammawini » — très proches de « Marrawini » — et que cette rivière
  rejoint précisément l'estuaire du Suriname près de Paramaribo, ce qui
  correspond exactement à la relation topologique du dossier. Hypothèse
  Commewijne retenue en confiance moyenne, sous réserve qu'il pourrait
  aussi s'agir d'une confusion/fusion cartographique Commewijne-Marowijne
  par Jaillot (zone la moins bien relevée du Suriname colonial à
  l'époque).
- **Sources :** [Commewijne River - Wikipedia](https://en.wikipedia.org/wiki/Commewijne_River) ;
  [Marowijne River - Atlas of Mutual Heritage](https://www.atlasofmutualheritage.nl/page/10188/marowijne-river).

### N065 — r-maryowapaneko

- **Toponyme Jaillot :** R. Maryowapaneko
- **Nom canonique (harmonisé) :** Maryowapaneko *(toponyme composé
  d'origine indigène/légendaire, sphère nouvelle-andalousie — reste tel
  quel, préfixe « R. » retiré ; convention cartographique assumée)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Aromaia (41 NM), Macurevoari (84,5 NM), Nieuw
  Middelburg (97,2 NM). Se jette dans l'Orénoque au niveau des deux
  premières bouches du delta (Delta_Orénoque_1 et 2) — donc un bras de
  l'embouchure occidentale du delta.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Maryowapaneko, convention cartographique assumée**
  (ERR-004 retiré).
- **Confiance :** 🎲 convention cartographique
- **Raisonnement :** RÉVISION. Toponyme composé très long et non attesté
  ailleurs, cohérent avec la même couche cartographique légendaire/
  indigène que le cluster Bariquicometo/Capuri/Caslipa. Sa position, au
  niveau des bouches occidentales du delta, aurait pu correspondre à l'un
  des distributaires modernes (Manamo, désormais attribué à R029 — voir
  `fluvial-identification-synthese.md` — ou Pedernales), mais aucun
  candidat précis ne s'est imposé avec un niveau de confiance acceptable
  après recensement exhaustif du secteur Caroní-Pomeroon (voir aussi
  N011, N019). Plutôt que de le maintenir en « vraisemblablement
  erroné », Ronan propose de l'assumer comme élément de la même couche
  cartographique légendaire/imaginaire que Lac de Caslipa/N023 — rivière
  fictive assumée pour la campagne plutôt que fleuve réel non identifié.
- **Sources :** Analyse interne ; recensement exhaustif du secteur
  Caroní-Pomeroon (proposé par Ronan).

### N068 — r-poumaron

- **Toponyme Jaillot :** R. Poumaron
- **Nom canonique (harmonisé) :** Pomeroon *(sphère néerlandaise ;
  graphie modernisée conservée sans générique — préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Nieuw Middelburg (6,9 NM), Fort Kyk-Over-Al
  (10,6 NM). Embouchure en mer ; voisin direct de R. Essequebe.
- **Identification proposée / nom moderne :** **Rivière Pomeroon**
  (Guyana).
- **Confiance :** ✅ fort
- **Raisonnement :** Déformation phonétique légère et classique
  (Poumaron → Pomeroon), position immédiatement à l'ouest de l'Essequibo
  — exactement la position réelle de la Pomeroon, avec le site
  hollandais historique de Nieuw Middelburg (colonie de Pomeroon, XVIIe
  siècle) tout proche (6,9 NM sur la carte).
- **Sources :** Analyse interne (position de Nieuw Middelburg dans
  `villes-data.js`, colonie hollandaise historique de la Pomeroon).

### N075 — r-waymy

- **Toponyme Jaillot :** R. Waymy
- **Nom canonique (harmonisé) :** Waymy *(sphère néerlandaise/frontière
  Guyane-Suriname ; graphie Jaillot conservée telle quelle plutôt que la
  forme moderne « Waini », préfixe « R. » retiré)*
- **Territoire :** suriname
- **Repères proches :** Nieuw Middelburg (34,5 NM), Fort Kyk-Over-Al
  (56,6 NM), Aromaia (124,7 NM). Embouchure en mer ; seul voisin
  hydrographique listé : R. Amacuro.
- **Identification proposée / nom moderne :** **Rivière Waini** (Guyana).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance phonétique solide (Waymy → Waini) et
  position parfaitement cohérente : entre l'Amacuro (à l'ouest) et le
  cluster Pomeroon/Essequibo (à l'est), exactement l'ordre géographique
  réel des cours d'eau de l'ouest guyanais (Amacuro → Barima → Waini →
  Pomeroon → Essequibo).
- **Sources :** Analyse interne, cohérence positionnelle avec R. Amacuro
  et R. Poumaron/R. Essequebe.

### N098 — suriname

- **Toponyme Jaillot :** Suriname
- **Nom canonique (harmonisé) :** Suriname *(déjà complet/au format —
  inchangé)*
- **Territoire :** suriname
- **Repères proches :** Paramaribo (1,7 NM — quasiment superposé).
  Deux bras (main + B) avec deux embouchures en mer ; voisin de
  R. Copanama, R. Marateka et R. Marrawini (qui s'y jette).
- **Identification proposée / nom moderne :** **Fleuve Suriname**, sur
  lequel se trouve Paramaribo.
- **Confiance :** ✅ fort
- **Raisonnement :** Identification directe et évidente — nom identique,
  distance à Paramaribo quasi nulle (1,7 NM sur la carte). Bon candidat
  de niveau 1 pour la hiérarchie du secteur Guyanes, aux côtés de
  l'Orénoque, de l'Essequibo, du Berbice et du Corentyne.
- **Sources :** Analyse interne (position de Paramaribo dans
  `villes-data.js`).

### N102 — varacoyari-river

- **Toponyme Jaillot :** Varacoyari River
- **Nom canonique (harmonisé) :** Rio Varacoyari *(toponyme Jaillot réel, conservé plutôt que l'identification moderne « Río Caroní » ; suffixe « River » harmonisé en « Rio » — sphère espagnole du Venezuela, même logique que Capuri River/N010 et Caturi Voari River/N011)*
- **Territoire :** nouvelle-andalousie
- **Repères proches :** Macurevoari (18,5 NM), Aromaia (36,5 NM), Santo
  Tomé de Guayana (47,4 NM). Se jette dans l'Orénoque ; voisin direct du
  Lac de Caslipa.
- **Identification proposée / nom moderne :** **RÉVISION COLLABORATIVE
  (avec Ronan) — Río Caroní.**
- **Confiance :** ✅ fort
- **Recalibration (avec Ronan) :** reclassé de ⚠️ moyen à ✅ fort — le
  confluent réel Caroní/Orénoque se situe exactement à Santo Tomé de
  Guayana, et l'ancrage structurel est explicitement « nettement
  meilleur que l'hypothèse Capure d'abord envisagée » (alternative
  nommée puis écartée, même schéma que pour N010/Río Apurito). Absence
  de parenté toponymique, mais position exclusive une fois l'alternative
  éliminée.
- **Raisonnement :** Le confluent réel Caroní/Orénoque se trouve
  précisément à Santo Tomé de Guayana (aujourd'hui Ciudad Guayana),
  fondée en 1595 à cet emplacement — or Varacoyari a justement Santo
  Tomé de Guayana comme repère (47,4 NM, proche pour les standards très
  approximatifs de la Jaillot dans ce secteur), avec Macurevoari (18,5
  NM) et Aromaia (36,5 NM) tout proches. C'est un ancrage structurel
  nettement meilleur que l'hypothèse Capure d'abord envisagée (îles
  Capure/Cotorra/Pedernales, situées dans le delta côtier externe, loin
  de ce cluster amont — même objection qui avait fait écarter Capure pour
  Capuri River/N010). Le petit lac visible sur le tracé de Varacoyari
  n'est vraisemblablement pas le lac de Guri (artificiel, mis en eau à
  partir de 1969 seulement, aucun lac naturel avant le barrage — le
  Caroní coulait alors en gorges et chutes, notamment vers les sauts
  Cachamay/Llovizna près de son embouchure) : il s'agit plus probablement
  d'une représentation schématique de ces rapides, ou d'un nouvel écho de
  la ceinture de lacs légendaires Cassipa/Parime (le Lac de Caslipa,
  N023, n'est qu'à ~40 NM). Aucune parenté toponymique établie entre
  « Varacoyari » et « Caroní » — identification fondée sur la position
  et le contexte (légende de 1594 d'une cité d'or aux sources du Caroní,
  déjà associée à Lac de Caslipa/N023, dont Varacoyari est le voisin
  direct).
- **Sources :** [Embalse de Guri — Wikipedia (es)](https://es.wikipedia.org/wiki/Embalse_de_Guri) ;
  inventaire interne (positions, distances aux repères, hypothèse
  proposée par Ronan).


---

# Session de clôture — dernière passe (cours restants)

Dernière session de recherche sur les cours d'eau encore incertains ou
sans nom, listés dans `feuille-de-route-cours-restants.md`. Six
recherches parallèles ont été menées, une par secteur géographique, avec
consigne explicite de conclure : soit une identification (même à
confiance faible, du moment qu'un candidat réel nommé est proposé et
argumenté), soit un constat d'absence totale de candidat, auquel cas le
tracé est désormais considéré **vraisemblablement erroné** et reçoit un
identifiant arbitraire `ERR-0xx`. Cette section documente le
raisonnement complet ; les tableaux récapitulatifs ci-dessus ont été mis
à jour en conséquence. Les cours R0xx (corpus des 29 « sans nom »,
`fluvial-identification-synthese.md`) sont traités dans la section
correspondante de ce dernier fichier.

## Secteur Orénoque (delta sud) et Suriname est

Les six toponymes du cluster « affluents de l'Orénoque » (N006, N011,
N019, N065, N102, plus N010) ont d'abord été traités comme appartenant à
une couche cartographique héritée de Walter Ralegh (*The Discoverie of
Guiana*, 1596) et de Jodocus Hondius (1598) — la même filiation qui a
produit le Lac de Caslipa/Cassipa (N023, convention cartographique).
Recherche initiale menée sur le texte intégral de Ralegh (Gutenberg
#2272) et sur les catalogues de cartes anciennes (Hondius, De Bry,
Sanson, Blaeu).

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à la clôture
ci-dessus :** cette lecture était en grande partie erronée pour N006,
N010 et N040. Voir le détail complet dans les fiches N006, N009, N010,
N023 et N040 ; résumé ici.

- **N006 — Bariquicometo R. : identifié, ✅ fort — Río Turbio.**
  `js/villes-data.js` situait déjà explicitement Barquisimeto « dans la
  vallée du río Turbio », donnée jamais croisée lors de la première
  passe. Le cluster de villes concerné (Barquisimeto, El Tocuyo, Nirgua,
  Monts de San Pedro) est positionné très au sud sur la Jaillot par
  rapport à sa position réelle — la même distorsion systématique
  explique l'allongement du cours jusqu'à l'Orénoque plutôt que de
  l'invalider. Vérifié structurellement : Turbio + Buría (N009) forment
  le Río Cojedes (confluence à la cellule `107_131`), qui reçoit le
  Pato R./Río Pao (N040, confluence à `113_136`) avant de devenir le Río
  Portuguesa, puis le **Río Apure** lui-même jusqu'à ses embouchures
  principales dans l'Orénoque (`114_143`) — la fourche vers Capuri River
  (N010, à `114_139`) est désormais rattachée à un distributaire distinct
  de l'Apure (voir ci-dessous).
- **N010 — Capuri River : identifié, ⚠️ moyen — Río Apurito**
  (RÉVISÉ), distributaire réel de l'Apure rejoignant l'Orénoque en aval
  de ses embouchures principales — position exactement cohérente avec la
  fourche Jaillot (`114_139` puis embouchure séparée à `108_143`, en aval
  du tronc principal). Remplace la branche deltaïque « Capuri » attestée
  chez Ralegh (hypothèse initiale abandonnée : ce tracé ne touche aucune
  cellule du delta), puis l'hypothèse Apure lui-même (désormais rattachée
  au tronc principal N006).
- **N040 — Pato R. : identifié, ⚠️ moyen — Río Pao**, affluent réel du
  Portuguesa rejoignant le système exactement à la cellule de confluence
  attendue.
- **N011 (Caturi Voari River) : depuis identifié — voir révision
  collaborative ci-dessous.** **N019 (Coyrama R.) : RÉVISÉ depuis, voir
  plus bas — reclassé convention cartographique assumée, ERR-003
  retiré.** Aucune attestation trouvée dans le texte de Ralegh ni dans
  les cartes/catalogues consultés — à la différence de
  Bariquicometo/Capuri/Pato, aucune donnée externe au corpus (type fiche
  de ville) n'est venue le rattacher à un cours réel. Un écho de suffixe
  interne au corpus (« -coyari » ~ Varacoyari) est noté mais jugé
  insuffisant comme preuve. **N102 (Varacoyari River) a depuis été
  identifié — voir révision collaborative ci-dessous.**
  **N065 (R. Maryowapaneko) : RÉVISÉ depuis, voir plus bas — reclassé
  convention cartographique assumée, ERR-004 retiré.** Son environnement
  immédiat (Amachara, Maritere, Sebarrima, Corobana) a depuis été
  largement éclairci.

**CLÔTURE DÉFINITIVE (avec Ronan), puis reclassement — N019 (Coyrama R.)
et N065 (R. Maryowapaneko) :** après recensement exhaustif de tout le
secteur entre le Caroní et le Pomeroon (couvrant l'ensemble des cours,
digitalisés ou non, de ce tronçon de côte et de son arrière-pays
immédiat), aucun cours d'eau réel — même modeste — n'était resté
disponible comme candidat pour ces deux toponymes. Plutôt que de les
maintenir en « vraisemblablement erroné », Ronan propose de les assumer
comme éléments de la même couche cartographique légendaire/imaginaire
que Lac de Caslipa/N023 — rivières fictives assumées pour la campagne
plutôt que fleuves réels non identifiés. **ERR-003 et ERR-004 retirés ;
N019 et N065 reclassés 🎲 convention cartographique.**

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
N011 (Caturi Voari River) et R028 (F-95_143-C) :** **N011 = Río Espino**
et **R028 = Río Zuata** (⚠️ moyen chacun, ERR-002 retiré côté N011),
deux rivières réelles des Llanos centraux (Guárico/Anzoátegui)
rejoignant l'Orénoque par la rive nord. Les deux toponymes Jaillot
forment une relation `separate` (même point d'embouchure, tracés
parallèles) ; ni l'un ni l'autre n'est en réalité proche de Santo Tomé
de Guayana, contrairement à ce qu'impliquait l'hypothèse antérieure pour
R028 (**Río Usupamo, retirée** — ce nom ne désignait qu'un site occupé
par Santo Tomé entre 1637 et 1764, pas un hydronyme indépendant).
Assignation Espino/Zuata fondée sur la lecture directe de la carte
(parallélisme, éloignement relatif) ; confiance alignée sur celle de
Capuri River/N010 = Río Apurito, pour rester cohérente avec la chaîne de
raisonnement structurel du secteur Bariquicometo/Apure/Apurito. Détail
complet dans la fiche N011 et dans `fluvial-identification-synthese.md`
(R028).

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
Varacoyari River (N102) :** **Río Caroní** (⚠️ moyen, ERR-005 retiré).
Le confluent réel Caroní/Orénoque se situe précisément à Santo Tomé de
Guayana, fondée en 1595 à cet emplacement — repère le plus significatif
de Varacoyari (avec Macurevoari et Aromaia), et nettement mieux ancré
structurellement que l'hypothèse Capure d'abord envisagée par erreur de
lecture (îles Capure/Cotorra/Pedernales, delta côtier externe, hors de ce
cluster amont — même objection que pour Capuri River/N010). Le petit lac
sur le tracé n'est pas un ancêtre du lac de Guri (artificiel, mis en eau
à partir de 1969 ; le Caroní coulait auparavant en gorges/chutes) mais
plus probablement une représentation des rapides proches de l'embouchure,
ou un écho de la ceinture de lacs légendaires Cassipa/Parime — Varacoyari
est le voisin direct de Lac de Caslipa/N023, dont la légende (cité d'or
« aux sources du Caroní », 1594) s'en trouve recoupée. Détail complet
dans les fiches N102 et N023.

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
delta sud de l'Orénoque / côte des Guyanes (N042, N075, et cours
non digitalisés) :** relecture complète, à partir d'un crop haute
résolution, du tronçon de côte entre le delta et le Pomeroon. **N042**
(toponyme Jaillot « R. Amacuro ») est un faux-ami toponymique : sa
longueur trahit le **Río Barima** réel (✅ fort, ERR non concerné),
tandis que le véritable Río Amacuro moderne correspond à un cours
voisin non digitalisé, « **R Amachara** ». Séquence complète est-ouest
identifiée : **Spruyt** (orthographe confirmée sur le scan, « y »
lisible) = **Río Moruca** ; **R Waymy** (N075, inchangé) = Río Waini ;
**R Amacuro** (N042) = Río Barima ; **R Amachara** = Río Amacuro
moderne ; puis, dans un second groupe descendant du sud vers le delta,
**R Maritere** = Río Arature, **R Sebarrima** = Río Aguirre/Aquire
(⚠️ faible — réserve : possible écho du Barima plutôt que cours
distinct), **R Corobana** = Río Imataca (⚠️ faible — réserve :
correspondance structurelle imparfaite, l'Imataca drainant une sierra
éloignée de la côte ; alternative possible : distributaire propre de
l'Orénoque). Seuls N042 et N075 sont digitalisés dans l'inventaire ;
Spruyt, Amachara, Maritere, Sebarrima et Corobana restent à tracer,
comme R. Vergues (voir N043) et Río Chico/Tuquesa (voir N090). Détail
complet dans la fiche N042.

**RÉVISION COLLABORATIVE (avec Ronan) — delta du Río San Juan/Colorado
(Amérique centrale) :** le regroupement N007/N076/N087/N101, initialement
classé comme branches indifférenciées du « delta du Río San Juan », a été
revu à partir d'une lecture directe d'un crop haute résolution de la
carte Jaillot. Résumé :

- Le toponyme « Rio San Juan » stocké dans l'inventaire pour N087 est une
  convention du projet, **pas une transcription fidèle de la carte** :
  Jaillot inscrit en réalité « **Nicaragua ou Colorado R.** » sur ce
  tronc, avec le cap de l'embouchure étiqueté « **P. Iuan** » (entre
  Trigu R. et cette étiquette) — jamais « San Juan ».
- **N087 (tronc principal) : reclassé ⚠️ moyen — Río Colorado**, plutôt
  que ✅ fort — Río San Juan générique. Le système reste identifié avec
  certitude (exutoire du lac Nicaragua, fort de l'Immaculée Conception),
  mais l'identification précise de ce tronc comme la branche Colorado
  spécifiquement (et non le San Juan générique) repose sur la
  convergence toponyme Jaillot + position géométrique (embouchure la
  plus au sud du cluster, cohérente avec la position réelle du Colorado).
- **N076 (R Yayrepo) : reclassé ⚠️ moyen — probable bas Río San
  Juan/San Juan del Norte**, par élimination géographique (embouchure la
  plus au nord du cluster, cohérente avec la position réelle de cette
  branche).
- **N007 (Boccades R.) et N101 (Trigu R.) : INCHANGÉS, ⚠️ faible**,
  toujours des branches secondaires réelles du même delta, non
  identifiées précisément (pistes Taura et/ou chenaux mineurs
  aujourd'hui disparus/comblés, sans confirmation).
- **N043 (R. Auzuelos) : Río Colorado écarté, puis identifié ⚠️ moyen —
  Río Pacuare** (seconde révision collaborative, voir plus bas).
  L'hypothèse initiale (Colorado, sur la seule base d'une position
  intermédiaire sur la côte) entrait en collision avec l'identification
  toponymique directe de N087. Ronan a confirmé que R. Auzuelos est un
  cours distinct, sans lien structurel avec le système lac
  Nicaragua/San Juan : en repartant de Bocas del Toro (Veragua R.) vers
  le delta, Jaillot aligne R. Quemades/R. Talamanca/R. Caranaco (petits
  cours vers une Bocca del Drago mal définie), Suere ou Blewfield River
  (cours principal du secteur, Castillo de Austria), puis R. Auzuelos et
  R. Vergues (deux baies accolées), avant le Colorado R. lui-même. Toute
  cette séquence a ensuite été identifiée avec de vrais fleuves
  costariciens/panaméens — voir la fiche N043 pour le détail complet
  (Cricamola, Changuinola, San San, Sixaola, Matina, Pacuare, Parismina).
  R. Vergues n'apparaît toujours pas dans l'inventaire numérisé ni dans
  `js/oscar-hex-grid.js`.

Un « Caño Bravo » réel (bras actuel du Río Colorado, visible sur
l'imagerie satellite moderne) a été envisagé comme piste pour Trigu R.,
mais jugé possiblement trop mineur ou artificiel pour avoir été relevé
par Jaillot — aucune attestation historique trouvée pour trancher.

### Repères de cellules pour automatisation (segments Turbio→Buría→Cojedes→Portuguesa→Apure)

Pour permettre au projet de Code de scinder automatiquement le tronc
`bariquicometo-r` (branche `main`, 39 cellules) en ses segments réels,
voici les jonctions exactes vérifiées dans
`fluvial-research-inventory.json` (`outlets`/`relations`, pas
d'inférence) :

| Repère | Cellule | Source |
|---|---|---|
| Départ (source du Turbio, extrémité la plus proche de Barquisimeto/El Tocuyo) | `103_124` | première cellule de `bariquicometo-r` branche `main` |
| Confluence Turbio + Buría → naissance du Cojedes | `107_131` | outlet de `buria-o-de-san-pedro` (`junction` → Bariquicometo R.) |
| Confluence Cojedes + Pato/Pao → naissance de la Portuguesa | `113_136` | outlet de `pato-r` branche `main` (`junction` → Bariquicometo R.) |
| Fourche Apure → Apurito (« Capuri River ») | `114_139` | relation `fork` (from Bariquicometo R., to Capuri River) |
| Affluent non nommé (branche C) grossissant juste avant l'embouchure | `114_141` | outlet de `Bariquicometo R_C` (`junction` → Bariquicometo R.) |
| Embouchure principale de l'Apure dans l'Orénoque | `114_143` | outlet de `bariquicometo-r` branche `main` (`junction` → Orénoque) |
| Embouchure de l'Apurito (Capuri River, distributaire de l'Apure) dans l'Orénoque, en aval, au ras de Caslipa | `108_143` | outlet de `capuri-river` |

Rivières déjà isolées dans les données, aucun découpage supplémentaire
nécessaire : `buria-o-de-san-pedro` (9 cellules, Buría/Nirgua),
`pato-r` + `pato-r-b` (26 cellules, Pao), `capuri-river` (12 cellules,
Apurito).

**Limite à signaler :** l'ordre des 39 cellules de la branche `main`
dans le JSON ne reflète pas de façon fiable l'ordre d'écoulement, et une
reconstruction par proximité euclidienne des centres de cellule ne
donne pas un graphe propre sur ce grid hexagonal (adjacence ambiguë par
simple distance). La partition complète des 39 cellules en trois
segments nommés (Turbio / Cojedes / Portuguesa) devrait donc être faite
par un parcours de graphe (BFS) utilisant la fonction d'adjacence
hexagonale déjà implémentée côté site, en partant de `103_124` et en
coupant aux cellules `107_131` et `113_136` ci-dessus — plutôt que par
une liste de cellules reconstruite à la main ici, qui comporterait un
risque d'erreur non vérifiable depuis cette session de recherche.

Statut du complexe deltaïque du Suriname est (Commewijne/Cottica, cf.
correction déjà notée dans `feuille-de-route-cours-restants.md`) :
**tranché** — il ne s'agit ni de vraies branches d'un même delta
(comme cru initialement), ni du Commewijne/Cottica eux-mêmes (déjà
attribués : Commewijne = N064/R. Marrawini). Ce sont deux rivières
réelles mais distinctes de l'intérieur/ouest surinamien :

- **N048 — R. Copanama : identifié, ⚠️ faible.** Correspond
  vraisemblablement à la **Coppename**, attestée sous la forme anglaise
  « Copenam »/« Copename » dès 1663 (lettres patentes de Charles II à
  Lord Willoughby de Parham). Aucune carte hollandaise fiable du
  secteur est-surinamien (de Wit 1688, Ottens 1712) ne mentionne ce nom
  parmi les rivières orientales (Suriname, Commewijne, Cottica,
  Marowijne) — la Coppename réelle est bien plus à l'ouest. Hypothèse
  retenue : nom réel connu par ouï-dire, mal repositionné par Jaillot
  près du seul point bien cartographié (l'estuaire du Suriname).
- **N063 — R. Marateka : identifié, ⚠️ faible.** Correspond
  vraisemblablement à la **Maratakka**, rivière réelle de
  l'ouest surinamien engagée dans un système de bifurcation
  hydrographique documenté avec les rivières Nickerie et Coppename —
  cohérent avec la description de N063 comme cours le plus ramifié (4
  branches) du secteur. Même réserve géographique que N048 : nom réel,
  position vraisemblablement erronée sur Jaillot.
- Sources : [Guyana's Western Border 1670-1688](https://www.guyananews.org/Western/1670-1688.html) ;
  [Coppename River — Wikipedia](https://en.wikipedia.org/wiki/Coppename_River) ;
  [Nieuwe Kaart van Suriname (Ottens, 1712) — NYPL](https://digitalcollections.nypl.org/items/ac892179-10bf-0c30-e040-e00a1806533d) ;
  [De Maratakka rivier in Suriname](https://wildlifereizen.com/bestemmingen/de-maratakka-rivier-in-suriname/).

## Secteur Floride (Big Bend et panhandle)

Recherche menée avec lecture directe du scan haute résolution de la
carte Jaillot (`medias/cartes/jaillot-1708.jpg`) et recoupement avec
Hamilton, P.J., *"Was Mobile Bay the Bay of Spiritu Santo?"* (1904, Ala.
Historical Society), qui transcrit une carte-sœur (Covens & Mortier)
portant exactement la même séquence de toponymes.

**Correction géographique importante :** R013 et R014, présumées sur la
côte de Géorgie dans le cadrage initial (à cause d'une lecture erronée
des distances internes), sont en réalité deux tracés **non étiquetés
sur la carte Jaillot elle-même** (aucun nom écrit), situés dans le Big
Bend floridien entre « Nieves R. » et « Port Grande/Sta Maria del Buz »
— pas sur la façade atlantique de Géorgie. La piste Géorgie (Savannah,
Ogeechee, Altamaha, Satilla, St. Marys) est donc explicitement écartée.

**Découverte complémentaire :** Hamilton (1904) confirme, sur une carte
indépendante de la même famille éditoriale, que le groupe Ostras/
Marpequeue/Qualata borde une « Bay del Spirito Sancto » alimentée par
« trois petits cours d'eau non nommés » — c'est-à-dire que la tradition
cartographique source elle-même ne nommait pas individuellement ces
ruisseaux. Ce constat renforce la conclusion d'absence de correspondance
fiable plutôt que de l'affaiblir.

**Les huit cours (N028 Marpequeue, N034 Nieves R., N037 Ostras, N057
R. Flores, N071 R. Snelo, N080 Rio del Canaveral, R013, R014) restent
tous, après cette dernière passe exhaustive, sans candidat réel
défendable** — reclassés ERR-006 à ERR-013 (voir tableaux). Deux
nuances à conserver dans les notes de campagne : (1) Ostras et
Marpequeue correspondent vraisemblablement à de vraies baies fermées
par cordon littoral (St. Andrew/Choctawhatchee pour Ostras, St. Joseph/
Apalachicola pour Marpequeue), mais sans qu'on puisse trancher
laquelle — nuance conservée dans la note dédiée plutôt qu'une
identification forcée ; (2) Rio del Canaveral est confirmé sans lien
avec le Cap Canaveral atlantique réel (à ne pas fusionner avec N002).
Sources : [Was Mobile Bay the Bay of Spiritu Santo? — archive.org](https://archive.org/details/wasmobilebaybayo00hami) ;
[Big Bend Coast — Wikipedia](https://en.wikipedia.org/wiki/Big_Bend_Coast).

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
comparaison avec la carte Delisle 1718 :** contrairement à ce
qu'indiquait la première passe, ce recoupement s'avère fructueux pour
une partie du groupe.

- **N080 — Rio del Canaveral : identifié, ⚠️ moyen — Choctawhatchee
  River, ERR-011 retiré.** Sur Delisle, la baie où débouche ce cours
  (non nommée chez Jaillot) est étiquetée « Baie de Sainte Rose », et la
  barre qui ferme partiellement la baie de Pensacola y est « Île de
  Sainte Rose ». Confirmation indépendante trouvée : une carte espagnole
  de 1700 (Lajonk & Siscàra, Library of Congress) nomme déjà l'actuelle
  Choctawhatchee Bay « Bahía de Santa Rosa », appellation restée en usage
  jusqu'au changement anglais vers 1778. « Rio del Canaveral » (« la
  roseraie », terme descriptif générique, comme l'Arba de Canaveral/N002
  bien plus à l'est — aucun lien entre les deux) débouchant dans cette
  baie ne peut guère être que la Choctawhatchee River, le seul cours
  d'eau important du secteur. Identification structurelle/positionnelle,
  sans attestation directe du nom.
- **N037 — Ostras : RÉVISÉ depuis (seconde passe), voir plus haut —
  Escambia River**, et **N028 — Marpequeue : RÉVISÉ depuis (seconde
  passe), voir plus haut — Blackwater River, ERR-008 et ERR-010
  retirés.** *(Bloc d'origine, conservé pour mémoire : cette première
  lecture attribuait Ostras = Blackwater River et Marpequeue = Yellow
  River, via le recoupement Delisle ci-dessous. Ronan a établi ensuite,
  dans une seconde passe, que le cours parallèle à Marpequeue à
  l'intérieur de la baie n'était en fait pas digitalisé dans
  l'inventaire — d'où le réagencement final : Ostras = Escambia River,
  Marpequeue = Blackwater River, Yellow River elle-même restant à
  tracer — voir fiches N028/N037 et
  `inventaire-cours-non-digitalises.md`.)* Confirmation de l'hypothèse
  déjà notée : ni l'un ni l'autre n'est un nom de fleuve (pas de « R. »
  dans la graphie, tracé d'étiquette ne suivant pas le cours) — ce sont
  vraisemblablement des noms de caps/baie bordant la « Bay del Spirito
  Sancto » (baie de Pensacola). Sur Delisle, côté est de cette baie, les
  deux cours de Jaillot sont bien présents mais nommés « R del Amirante »
  (le plus à l'ouest) et « R Jordano » (à l'est). Ces positions
  correspondent à l'estuaire de Pensacola Bay/East Bay, qui reçoit
  précisément deux rivières réelles bien documentées d'ouest en est :
  la **Blackwater River** puis la **Yellow River**. L'ancienne
  hypothèse alternative (Ostras/Marpequeue = noms des baies St. Andrew/
  Choctawhatchee et St. Joseph/Apalachicola, bien plus à l'est) reste
  elle aussi abandonnée.
- **R013 et R014 (fluvial-identification-synthese.md, ERR-006/ERR-007) :
  hypothèse du doublon graphique abandonnée — voir révision
  Bowen 1747 ci-dessous.**
- **N057 (R. Flores) : RÉVISÉ depuis, voir le complément collaboratif
  plus haut dans ce document — identifié ⚠️ moyen, Econfina Creek
  (St. Andrew Bay), ERR-012 retiré.** **N071 (R. Snelo) : RÉVISÉ depuis,
  voir le complément collaboratif plus haut dans ce document — identifié
  ⚠️ moyen, Bon Secour River, ERR-013 retiré.**
- Sources : *(voir ci-dessus)* ; Guillaume Delisle, *Carte de la
  Louisiane et du Cours du Mississippi* (1718) — lecture directe,
  crop haute résolution proposée par Ronan ; « Descripcion de la Bahia de
  Santa Maria de Galve... hasta el Rio de Apalache » (Lajonk & Siscàra,
  1700, Library of Congress) ; [Yellow River (Pensacola Bay) — Wikipedia](https://en.wikipedia.org/wiki/Yellow_River_(Pensacola_Bay)) ;
  [Blackwater River (Florida) — Wikipedia](https://en.wikipedia.org/wiki/Blackwater_River_(Florida)) ;
  [Choctawhatchee River — Wikipedia](https://en.wikipedia.org/wiki/Choctawhatchee_River).

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à ce qui précède —
comparaison avec la carte Bowen 1747 :** un troisième recoupement
(Emanuel Bowen, *A New & Accurate Map of the Provinces of North & South
Carolina, Georgia, &c.*, 1747) réexamine R013/R014 et remplace la
conclusion « doublon graphique » ci-dessus.

- Bowen place « Apalachecola R. » à la position correspondant à **Nieves
  R.** chez Jaillot — nettement à l'ouest des deux tracés jumeaux — puis,
  plus à l'est, deux cours distincts : d'ouest en est, la « Rivière des
  Canards » (à la position de **R013**) et la « Rivière des Apalaches »
  (à la position de **R014**). Les tracés jumeaux ne seraient donc pas un
  doublon graphique mais deux cours réels distincts, mal lus lors du
  passage Delisle faute d'un troisième point de comparaison.
- Vérification indépendante : la distinction entre la province Apalachee
  (autour de Tallahassee, missions espagnoles dès les années 1630) et la
  province Apalachicola (bas Chattahoochee, à l'ouest) est un vrai fait
  historique, régulièrement confondu par les cartographes européens — la
  frontière anglaise Floride orientale/occidentale de 1763 suivra
  d'ailleurs l'Apalachicola réelle. Plus précis : la rivière St. Marks (à
  la confluence avec la Wakulla, site du fort San Marcos de Apalache)
  **portait elle-même historiquement le nom de « rivière Apalachee »** —
  attestation indépendante qui étaye directement « Rivière des
  Apalaches » = **St. Marks/Apalachee River** pour R014.
- Aucune attestation indépendante trouvée pour « Rivière des Canards » ;
  mais l'Ochlockonee occupe exactement le bon créneau géographique (entre
  l'Apalachicola et le St. Marks) pour R013.
- **N034 — Nieves R. : identifié, ⚠️ moyen — Río/Rivière Apalachicola,
  ERR-009 retiré.**
- **R013 (fluvial-identification-synthese.md) : identifié, ⚠️ faible —
  Ochlockonee River, ERR-006 retiré** (position solide, nom non attesté
  indépendamment).
- **R014 (fluvial-identification-synthese.md) : identifié, ⚠️ moyen —
  St. Marks/Apalachee River, ERR-007 retiré** (position solide et nom
  historique attesté indépendamment).
- Sources : Emanuel Bowen, *A New & Accurate Map of the Provinces of
  North & South Carolina, Georgia, &c.* (1747), lecture directe (crop
  haute résolution, proposée par Ronan) ; [Apalachicola River — Wikipedia](https://en.wikipedia.org/wiki/Apalachicola_River) ;
  [Apalachee Province — Wikipedia](https://en.wikipedia.org/wiki/Apalachee_Province) ;
  [Apalachicola Province — Wikipedia](https://en.wikipedia.org/wiki/Apalachicola_Province) ;
  St. Marks River, Florida — recherche web (fort San Marcos de Apalache,
  ancien nom « rivière Apalachee »).

## Secteur Panama caraïbe / Bocas del Toro

- **R019 : RÉVISÉ depuis, voir le complément collaboratif plus haut dans
  `fluvial-identification-synthese.md` — identifié ⚠️ moyen, **Río
  Indio**, remplace Río Trinidad.** L'ancienne justification (fort du
  Santísimo Sacramento de la Trinidad au confluent, plan de 1832 citant
  Trinidad parmi les tributaires du Chagre) reposait en partie sur une
  confusion avec le fort/port de Trinidad de la côte caraïbe (en réalité
  proche de R. Belem, pas de F-98_73-C). Un véritable Río Trinidad,
  affluent du lac Gatún/Chagres, existe bien (53 km, bassin 198,6 km²) et
  le plan de 1832 pourrait donc rester pertinent — mais Ronan juge le
  Río Indio (98 km, embouchure indépendante proche de celle du Chagres)
  positionnellement plus probable au vu du niveau de détail de la carte
  Jaillot à cet endroit ; un fleuve aussi modeste que le Trinidad, absent
  des cartes généralistes modernes, semble un candidat moins probable
  pour un tracé aussi développé que celui de F-98_73-C.
- **R020 : identifié, ⚠️ moyen — Río Caimito.** Débouché indépendant
  à Puerto Caimito (La Chorrera), cohérent avec un cours qui ne rejoint
  pas le Chagre. Río Perequeté reste une alternative plus faible.
- **N049 (R. Coqueto) : INCHANGÉ, ERR-014, vraisemblablement erroné.**
  Recherche exhaustive (variantes orthographiques, sources coloniales,
  inventaires hydrographiques modernes) sans résultat. Río Indio/Miguel
  de la Borda restent des candidats positionnels plausibles mais non
  étayés par la toponymie — non retenus comme identification.
- **RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture :**
  N047 (R. Caranaco), N069 (R. Quemades) et N073 (R. Talamanca) — voir
  aussi N103 (Veragua R.) — ont été réexaminés en repositionnant toute
  la séquence côtière de Bocas del Toro au delta du Colorado (voir la
  fiche N043 pour le détail complet de cette séquence). Résultat :
  **N069 = Río Changuinola** (⚠️ faible, ERR-016 retiré), **N073 = Río
  San San** (⚠️ moyen, remplace l'hypothèse Sixaola/Telire), **N047 =
  Río Sixaola** (⚠️ moyen, ERR-015 retiré) — le fleuve-frontière
  lui-même, désormais assigné au cours le plus proche de la limite CR/
  Panama plutôt qu'à Talamanca. Repositionnement fondé sur l'ordre
  croissant des distances internes à Concepción/Bocas del Toro plutôt
  que sur une nouvelle correspondance toponymique.
- Sources : [Historia del Río Chagres — Burica Press](https://burica.wordpress.com/2008/07/27/historia-del-rio-chagres/) ;
  [Río Caimito — Wikipedia (es)](https://es.wikipedia.org/wiki/R%C3%ADo_Caimito) ;
  [Changuinola River](https://en.wikipedia.org/wiki/Changuinola_River) ;
  [Sixaola River](https://en.wikipedia.org/wiki/Sixaola_River).

## Secteur péninsule de Paria / golfe de Paria et Darién

- **N038 — Ovarabiche R. : identifié, ⚠️ moyen — Río San Juan**
  (révision collaborative, précise l'identification initiale). Le San
  Juan naît de la confluence Guarapiche + Caripe et c'est lui qui
  débouche au golfe de Paria (le Guarapiche s'y jette en amont, via le
  Caño Francés) ; la position d'Ovarabiche, nettement au nord (proche de
  Cariaco/San José de Macuro), colle mieux à cette embouchure qu'au
  Guarapiche pris isolément. Rapprochement phonétique Ovarabiche/
  Guarapiche toujours valable pour le système dans son ensemble ; delta à
  bras multiples cohérent avec la description « deux embouchures ».
- **R029 : RÉVISÉ depuis, voir `fluvial-identification-synthese.md` —
  identifié ⚠️ moyen, Caño Mánamo, ERR-017 retiré.** Son voisin direct
  dans l'inventaire, Europa River, est déjà identifié comme Caño
  Macareo — R029 se trouve donc dans le même cluster de bras deltaïques
  de l'Orénoque plutôt qu'isolé sur la côte nord de la péninsule de
  Paria ; Caño Mánamo, l'un des deux grands bras de l'Orénoque (débouché
  à la Boca de Pedernales, golfe de Paria), correspond à une embouchure
  large et un tracé incomplet, cohérents avec la description du cours.

**RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
Europa River (N021) :** **Caño Macareo** (⚠️ moyen, ERR-018 retiré).
Relecture des repères proches : Ariacoa (toponyme du delta sud) est de
loin le plus proche (22,5 NM), bien avant les toponymes de la péninsule
de Paria (San José de Macuro, Verina/Cariaco, 67,7 et 70,9 NM). La sortie
en mer se situe donc entre le secteur deltaïque et la côte de Paria —
la position du Macareo, bras nord du delta débouchant sur le sud du
golfe de Paria vers le chenal de Colón. Toponyme « Europa » toujours
inexpliqué ; identification fondée sur la structure/position, à l'image
de Bariquicometo R./N006 (Río Apure) et Capuri River/N010 (Río Apurito).
Détail complet dans la fiche N021.
- **N094 — Sholes : ERR-020, vraisemblablement erroné (première passe).**
  Élément à retenir pour la note dédiée d'origine : il s'agit
  probablement d'une notation nautique anglaise de hauts-fonds
  (« shoals »), et non d'un hydronyme — les récits de la colonie
  écossaise de Caledonia (1698-1700) décrivent explicitement des
  « uncertain soundings » et hauts-fonds dangereux à l'entrée de la
  baie, mais aucune carte anglo-écossaise consultée ne nomme un cours
  d'eau « Sholes ». **Reclassé depuis en révision collaborative — voir
  ci-dessous (secteur Golfo de San Miguel) : ERR-020 retiré, identifié
  Río Chimán, ⚠️ moyen.**
- **RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
  golfe d'Urabá, rive est :** le groupe des quatre cours de la rive est
  du golfe (N085 Rio Negro, N079 Rio de los Redes, R025/F-106_90, N084
  Rio Grande del Darién) a été repris entièrement. **N084 = Río Atrato**
  reste confirmé sans équivoque (✅ fort, inchangé). **N085 (Rio Negro) =
  Río Caimán Viejo** (⚠️ moyen, ERR-019 retiré) et **N079 (Rio de los
  Redes) = Río Caimán Nuevo** (⚠️ moyen, remplace l'hypothèse Río León) —
  deux rivières réelles adjacentes à hauteur de Necoclí, Rio Negro étant
  la plus au nord des deux par lecture directe de la carte. **R025/
  F-106_90 = Río Turbo** (⚠️ moyen, remplace l'hypothèse Boca Tarena) :
  ce cours n'a aucune relation structurelle avec Rio Grande del Darién
  dans l'inventaire (`relations: []`, embouchure « sea » indépendante),
  ce qui va à l'encontre d'une bouche du delta de l'Atrato et plutôt en
  faveur d'un cours véritablement distinct — cohérent avec le Río Turbo,
  rivière indépendante formant son propre petit delta près de
  l'embouchure de l'Atrato. À cette occasion, un audit systématique de
  l'inventaire a confirmé qu'aucun autre cours « to-identify » n'a
  échappé à la session de synthèse : les 29 cours à `mapLabelPresent:
  false` de `fluvial-research-inventory.json` correspondent un pour un,
  sans trou ni doublon, aux 29 identifiants R001-R029 de
  `fluvial-identification-synthese.md`.
- Sources : [Río Guarapiche — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Guarapiche) ;
  [Historia del río Atrato — Banrepcultural](https://enciclopedia.banrepcultural.org/Historia_del_r%C3%ADo_Atrato) ;
  [Mapping the Scottish Colony 'New Caledonia' — Leif Gehrmann](https://leifgehrmann.com/2023/04/02/mapping-new-caledonia/) ;
  Wikipédia (es) *Necoclí* ; ONIC, *Resguardo Caimán Nuevo* ;
  Universidad de los Andes, *El nuevo delta del Río Turbo*.
- **RÉVISION COLLABORATIVE (avec Ronan), postérieure à cette clôture —
  Golfo de San Miguel (Darién Pacifique) :** le cluster N018 (Congo R.),
  N022 (Gold River), N090 (S. Maria River) et N094 (Sholes), rattaché en
  première passe au secteur caraïbe de Santa María la Antigua del Darién
  sur la seule base du repère nommé le plus proche, s'est révélé être une
  fausse piste généralisée. Ronan a repéré l'étiquette Jaillot « Golfe de
  St Michael » (Golfo de San Miguel, Pacifique) à l'endroit même où ces
  cours convergent, confirmé par un vrai Río Congo à cet emplacement et
  par la chaîne de voisinage interne à l'inventaire (Cheapo R./Bayano →
  Sholes → Congo R. → S. Maria/Gold River). Résultat : **N018 = Río
  Congo** (✅ fort) ; **N094 = Río Chimán** (⚠️ moyen, ERR-020 retiré,
  position intermédiaire entre Chepo et le golfe) ; **N090 = Río Tuira →
  Río Chucunaque** (⚠️ moyen, remplace Río Tanela) — tronc commun près
  d'El Real de Santa María (fondée 1665 à la confluence Tuira/Chucunaque,
  exactement la première fourche décrite par Ronan), l'étiquette « S.
  Maria Riv. » suivant la branche qui remonte plein Nord (Chucunaque) ;
  **N022 = Río Balsas** (branche principale, district aurifère de
  Tucuti/Cana) **+ Tuira** (branche méridionale « Gold River_B », Sambú
  envisagé puis écarté) (⚠️ moyen, ERR-021 retiré). Les deux branches non
  étiquetées identifiées par Ronan dans la fourche de S. Maria River —
  Río Chico et Río Tuquesa — ne sont pas digitalisées séparément dans
  l'inventaire, comme R. Vergues (voir N043).
- Sources : [Río Congo (Darién) — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Congo_(Dari%C3%A9n)) ;
  [Golfo de San Miguel — Wikipedia](https://es.wikipedia.org/wiki/Golfo_de_San_Miguel) ;
  [Tuira River](https://en.wikipedia.org/wiki/Tuira_River) ;
  [Chucunaque River](https://en.wikipedia.org/wiki/Chucunaque_River) ;
  [Río Chucunaque — waterwaymap.org](https://waterwaymap.org/river/R%C3%ADo%20Chucunaque%20000465570410/) ;
  [Balsas River (Panama) — Wikipedia](https://en.wikipedia.org/wiki/Balsas_River_(Panama)) ;
  [History of mining in Panama — Redalyc](https://www.redalyc.org/journal/943/94370787011/html/) ;
  *A Buccaneer's Atlas: Basil Ringrose's South Sea Waggoner* ;
  *Chimán, pueblo acorralado* — La Prensa Panamá.

## Priorité 2 (cours isolés)

- **R011 : identifié, ⚠️ moyen — Río Chiquito** (drainage de León
  lui-même, estuaire de Las Peñitas/Isla Juan Venado). Telica/Posoltega
  restent des alternatives plausibles non exclues.
- **R024 : identifié, ✅ fort — North Edisto River.** Dawhoo et
  Wadmalaw sont des connecteurs internes du même système estuarien, pas
  des embouchures indépendantes ; North Edisto reste la seule 4e
  embouchure véritablement distincte au sud du groupe de Charleston.
- **R028 : identifié à l'origine ✅ fort — Río Usupamo**, sur la base
  du site où Santo Tomé de Guayana fut rebâtie en 1642 et resta jusqu'en
  1764 — occupation continue couvrant la période de la campagne
  (1713-1720). **RÉVISÉ depuis (avec Ronan) : ⚠️ moyen — Río Zuata.**
  « Usupamo » ne désigne en réalité qu'un site historique, pas un
  hydronyme indépendant ; et surtout, une relecture directe de la carte
  montre que ni R028 (F-95_143-C) ni son voisin immédiat Caturi Voari
  River (N011) ne sont réellement proches de Santo Tomé de Guayana —
  l'argument de proximité qui fondait l'identification ne tient donc
  pas. Nouvelle paire : R028 = Río Zuata, N011 = Río Espino, deux
  rivières réelles des Llanos centraux rejoignant l'Orénoque par la rive
  nord. Voir révision collaborative complète dans la fiche N011 et dans
  `fluvial-identification-synthese.md`.
- **N002 — Arba de Canaveral : renforcé, 🎲 convention cartographique
  (Barra de Cañaveral).** Deux sources espagnoles indépendantes (AGI
  MP-FLORIDA_LUISIANA,8, 1605 ; plan Arredondo, 1737) confirment l'usage
  du terme « barra » pour les passes sableuses de cette côte, encadrant
  chronologiquement Jaillot 1708.
- **N086 — Rio Palmas dos Bogas : renforcé, ✅ fort — Río Palizada.**
  Origine du nom directement documentée (troncs/« palo de tinte »
  charriés par le courant), occupation européenne attestée dès 1668.
- **N060 — R. Guaiapo : renforcé, ✅ fort — Río Paulaya.** Confirmé
  comme principal tributaire réel du système Sico/Tinto ; Wampú et
  Sicre définitivement exclus (bassin du Patuca, hydrographiquement
  distinct).
- **N022 — Gold River : ERR-021, vraisemblablement erroné (première
  passe).** L'épisode historique (or de Comagre remis à Balboa,
  1512-1513, près de Santa María la Antigua) est confirmé comme fait
  établi, mais aucun hydronyme « Río de Oro » précis n'est attesté à cet
  endroit sur la côte caraïbe. **Reclassé depuis en révision
  collaborative — voir ci-dessous (secteur Golfo de San Miguel) :
  ERR-021 retiré, identifié Río Balsas (+ Tuira pour Gold River_B),
  ⚠️ moyen.**
- Sources : [Río Torbes — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Torbes) ;
  [Fundación y traslados de Guayana — Primicia](https://primicia.com.ve/opinion/fundacion-y-traslados-de-guayana/) ;
  [Río Palizada — Wikipedia (es)](https://es.wikipedia.org/wiki/R%C3%ADo_Palizada).

## Priorité 3 (Mexique Pacifique / Andes)

- **R001 : identifié, ✅ fort — Río Cihuatlán/Marabasco** (un seul et
  même cours, les deux noms usuels convergent plutôt que de s'exclure).
- **R002 : identifié, ⚠️ moyen — exutoire de la Laguna de Cuyutlán**
  (canaux Tepalcates/Ventanas). Révision : « Boca de Pascuales », candidat
  initial, est en fait l'embouchure du Río Armería — déjà attribuée à
  Subutla (N096) — et doit donc être écartée pour éviter un doublon.
- **R004 : identifié, ⚠️ moyen — Río Coyuquilla** (Catalutla).
  « Xiguacan » de la séquence Jaillot correspond probablement à
  Xihuacan (site attesté, entre Zihuatanejo et Petatlán) ; le Coyuquilla
  se jette juste à l'est, cohérent avec la séquence complète.
- **N004 — Auyamas : identifié, ⚠️ moyen/fort — Quebrada La Ahuyamala/
  Río Torbes.** San Cristóbal fut fondée dans le « Valle de las
  Auyamas » ; une des deux quebradas formant le Río Torbes porte
  aujourd'hui encore le nom de La Ahuyamala — survivance toponymique
  directe, pas un rapprochement forcé. Précision : le Torbes appartient
  en réalité au bassin de l'Orénoque (via Uribante/Apure), ni à celui du
  Maracaibo ni à celui du Cesar/Magdalena — la confusion cartographique
  de 1708 est donc réelle mais plus complexe qu'un simple mélange
  est-ouest.
- **N054 : RÉVISÉ depuis, voir le complément collaboratif Villa
  Rica/La Antigua plus haut dans ce document — non déterminé, ⚠️ faible**
  (le tableau indiquait précédemment « Río Jamapa » en doublon erroné
  avec R. de Medelin/N053 — corrigé).
- **N012 (Cempel R.) : RÉVISÉ depuis, voir le complément collaboratif
  Villa Rica/La Antigua plus haut dans ce document — identifié
  ⚠️ moyen, Río La Antigua (Huitzilapan), ERR-022 retiré.** L'ancienne
  hypothèse Cempoala/Actopan (jugée alors contredite par la position du
  repère « La Antigua ») reposait en fait sur une confusion de ce même
  repère avec le site distinct de Villa Rica — une fois les deux sites
  correctement replacés (Villa Rica au nord, La Antigua/Huitzilapan au
  sud), Cempel R. correspond positionnellement au Huitzilapan et
  Cempoala/Actopan revient à Sampoval R. (N093).
- **N058 (R. Galer) : RÉVISÉ depuis, voir le complément collaboratif
  plus haut dans ce document — identifié ⚠️ moyen, Río Cozoaltepec,
  ERR-023 retiré.**
- **N040 — Pato R. : RÉVISÉ depuis, voir le complément collaboratif
  plus haut dans ce document — identifié ⚠️ moyen, Río Pao, ERR-024
  retiré.**
- Sources : [Relación de Zacatula, 1580 — Tlalocan UNAM](https://revistas-filologicas.unam.mx/tlalocan/index.php/tl/article/download/425/420/619) ;
  [Río Torbes — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Torbes) ;
  [Río Jamapa — Wikipedia](https://es.wikipedia.org/wiki/R%C3%ADo_Jamapa).

## Table de correspondance des identifiants arbitraires

| ID arbitraire | Cours d'eau | Secteur |
|---|---|---|
| ERR-001 | *(retiré — N006 identifié Río Turbio, révision collaborative)* | — |
| ERR-002 | *(retiré — N011 identifié Río Espino, révision collaborative)* | — |
| ERR-003 | *(retiré — N019 Coyrama R., reclassé convention cartographique assumée)* | — |
| ERR-004 | *(retiré — N065 R. Maryowapaneko, reclassé convention cartographique assumée)* | — |
| ERR-005 | *(retiré — N102 identifié Río Caroní, révision collaborative)* | — |
| ERR-006 | *(retiré — R013 identifié Ochlockonee River, révision collaborative)* | — |
| ERR-007 | *(retiré — R014 identifié St. Marks/Apalachee River, révision collaborative)* | — |
| ERR-008 | *(retiré — N028 identifié Blackwater River, seconde passe, révision collaborative)* | — |
| ERR-009 | *(retiré — N034 identifié Río/Rivière Apalachicola, révision collaborative)* | — |
| ERR-010 | *(retiré — N037 identifié Escambia River, seconde passe, révision collaborative)* | — |
| ERR-011 | *(retiré — N080 identifié Choctawhatchee River, révision collaborative)* | — |
| ERR-012 | *(retiré — N057 identifié Econfina Creek, révision collaborative)* | — |
| ERR-013 | *(retiré — N071 identifié Bon Secour River, révision collaborative)* | — |
| ERR-014 | *(retiré — N049 identifié Río Coclé del Norte, révision collaborative)* | — |
| ERR-015 | *(retiré — N047 identifié Río Sixaola, révision collaborative)* | — |
| ERR-016 | *(retiré — N069 identifié Río Changuinola, révision collaborative)* | — |
| ERR-017 | *(retiré — R029 identifié Caño Mánamo, révision collaborative)* | — |
| ERR-018 | *(retiré — N021 identifié Caño Macareo, révision collaborative)* | — |
| ERR-019 | *(retiré — N085 identifié Río Caimán Viejo, révision collaborative)* | — |
| ERR-020 | *(retiré — N094 identifié Río Chimán, révision collaborative)* | — |
| ERR-021 | *(retiré — N022 identifié Río Balsas, révision collaborative)* | — |
| ERR-022 | *(retiré — N012 identifié Río La Antigua/Huitzilapan, révision collaborative)* | — |
| ERR-023 | *(retiré — N058 identifié Río Cozoaltepec, révision collaborative)* | — |
| ERR-024 | *(retiré — N040 identifié Río Pao, révision collaborative)* | — |

---

# Résumé chiffré (105 cours nommés)

**Mis à jour après la session de clôture puis les révisions collaboratives**
(N006, N010, N040 ; N043/N076/N087/N101/N007 — delta du Río Colorado ;
N047/N069/N073/N097/N103 — séquence côtière Bocas del Toro → delta ;
N085/N079 — golfe d'Urabá, rive est ; N018/N022/N090/N094 — Golfo de San
Miguel ; N021, N038, N102 — Orénoque/péninsule de Paria ; N011, N006/N010
— Llanos centraux/Apure ; N028/N037/N080 — panhandle floridien (Delisle
1718) ; N034 — panhandle floridien (Bowen 1747) ; N001/N012/N054/N093 —
cluster Villa Rica/La Antigua, Veracruz ; N001/N072 — seconde passe,
Misantla/Colipa et Tecolutla/Chichicatzapan (recoupement Mortier 1733) ;
N058 — Río Cozoaltepec (vérification positionnelle directe) ; N044/N049 —
côte caraïbe de Colón/Veraguas, Río Calovébora et Río Coclé del
Norte/Toabré ; N057 — Econfina Creek/St. Andrew Bay ; N020/N028/N037/N041/
N071 — réagencement complet du cluster Pensacola/Mobile (Bon Secour
River, Wolf Bay, Perdido River, Escambia River, Blackwater River) ;
N019/N065 — Coyrama R. et R. Maryowapaneko reclassés convention
cartographique assumée (même couche légendaire que Lac de Caslipa/N023)
— voir « Session de clôture — dernière passe » et les compléments
collaboratifs ci-dessus)
— colonne ❌ pour les tracés considérés vraisemblablement erronés (id
arbitraire `ERR-0xx`).

**Passe de recalibration des confiances (avec Ronan), secteur par
secteur, engagée une fois le corpus de 143 cours stabilisé *(134
digitalisés + 9 identifiés mais non tracés — corrigé d'une erreur
d'addition antérieure de +1, voir `inventaire-cours-non-digitalises.md`)*
:** Secteur A
traité — 6 reclassements ⚠️ moyen → ✅ fort (N012 Río La Antigua, N029
Río Verde, N058 Río Cozoaltepec, N061 Río Coatzacoalcos, N072 Río
Tecolutla, N074 Río Tuxpan), sur le critère de position exclusive sans
autre candidat plausible (retenu même sans appui toponymique), étendu au
cas inverse pour N061 (toponyme exact et sans ambiguïté malgré une
position fautive reconnue comme erreur cartographique). Secteur B traité
— 7 reclassements ⚠️ moyen → ✅ fort (N020 Perdido River, N028 Blackwater
River, N034 Apalachicola, N037 Escambia River, N041 Wolf Bay, N071 Bon
Secour River, N080 Choctawhatchee River), dont 5 formant le cluster
Pensacola/Mobile résolu par coordonnées pixel exactes des embouchures ;
N057 (Econfina Creek) et N081 (Tampa Bay) examinés mais non promus,
faute de position strictement exclusive. Au passage, N002 (Arba de
Canaveral) a été resynchronisé — la fiche indiquait encore ⚠️ faible
alors que la table récapitulative la classait déjà 🎲 convention
cartographique depuis une révision antérieure. Secteur C traité — 5
reclassements ⚠️ moyen → ✅ fort (N043 Río Pacuare, N051 Río Frío, N076
bas Río San Juan/San Juan del Norte, N087 Río Colorado — convergence
toponymique et positionnelle directe une fois le vrai toponyme Jaillot
« Nicaragua ou Colorado R. » pris en compte plutôt que la convention de
projet « Rio San Juan » —, N097 Río Matina). Au passage, N060 (Río
Paulaya) et N092 (Salinas) ont été resynchronisées — leurs fiches
indiquaient encore ⚠️ faible alors que la table récapitulative les
classait déjà respectivement ✅ fort et 🎲 convention cartographique
depuis une révision antérieure ; un 22e cours (N105, Yare R.) avait
également été omis d'une première relecture du secteur et a depuis été
intégré (déjà ✅ fort, non promu). Secteur D examiné en entier — **aucun
reclassement** : les 10 cours ⚠️ moyen et le cours ⚠️ faible du secteur
reposent tous soit sur un triplet ordonné par distance sans exclusivité
stricte (N047/N069/N073, dont le maillon central admet lui-même ne pas
trancher), soit sur une lecture directe de la carte non vérifiable
indépendamment (N044, N079/N085, N090/N094), soit sur une alternative
encore explicitement envisageable (N103, N022). Chaque cas est annoté
individuellement dans sa fiche. Secteur E traité — 3 reclassements
⚠️ moyen → ✅ fort (N004 Quebrada La Ahuyamala/Río Torbes, N040 Río Pao,
N046 Río Ranchería), le premier via une resynchronisation (la fiche
indiquait encore ⚠️ faible/non déterminé alors que la table
récapitulative portait déjà une identification toponymique directe —
« Valle de las Auyamas » — non reprise dans la fiche) ; N031 et N083
examinés mais non promus, les deux fiches admettant elles-mêmes une
ambiguïté résiduelle (respectivement absence de tracé assez précis, et
possible redondance de bras/cartographique). Détail dans chaque fiche
concernée. Secteur F traité — 4 reclassements ⚠️ moyen → ✅ fort (N010
Río Apurito, N011 Río Espino — confiance explicitement alignée sur N010
dans la fiche elle-même —, N021 Caño Macareo — repère « de très loin le
plus proche », superlatif explicite —, N102 Río Caroní — ancrage
« nettement meilleur » qu'une alternative nommée puis écartée, Capure),
tous sur le critère de position exclusive sans appui toponymique direct,
même famille de raisonnement que Bariquicometo R./N006 (déjà fort) ;
N038, N048, N063 et N064 examinés mais non promus, chacun admettant un
hedge explicite (« plus vraisemblablement », « rien ne permet de
trancher », « sous réserve d'une confusion cartographique »). Un 20e
cours (N102, Varacoyari River) avait été localisé en fin de passe mais
pas encore intégré au décompte — c'est chose faite, sans écart résiduel
avec le total de 20 attendu pour ce secteur.

**Passe de recalibration et de canonisation des noms terminée sur
l'ensemble des six secteurs du corpus des 105 cours nommés (N0xx).**
Chaque fiche porte désormais un champ « Nom canonique (harmonisé) »
distinct du « Toponyme Jaillot » archivé, conformément au point 2 du plan
en quatre points validé par Ronan. Le corpus R0xx (29 cours,
`fluvial-identification-synthese.md`) n'a pas été touché par cette passe
— à discuter séparément si un traitement identique y est souhaité.

| Secteur | ✅ fort | ⚠️ moyen | ⚠️ faible | 🎲 convention | ❌ erroné | Total |
|---|---|---|---|---|---|---|
| A — Nouvelle-Espagne / Panuco / Yucatán | 15 | 1 | 5 | 0 | 0 | 21 |
| B — Floride / Louisiane | 13 | 2 | 0 | 1 | 0 | 16 |
| C — Amérique centrale | 15 | 3 | 3 | 1 | 0 | 22 |
| D — Panama / Darién | 4 | 10 | 1 | 0 | 0 | 15 |
| E — Nouvelle-Grenade / Venezuela | 9 | 2 | 0 | 0 | 0 | 11 |
| F — Nouvelle-Andalousie / Suriname | 13 | 2 | 2 | 3 | 0 | 20 |
| **Total** | **69** | **20** | **11** | **5** | **0** | **105** |

*(Synchronisation, avec Ronan) : à l'occasion de la clôture du secteur F,
un recomptage automatisé de l'ensemble de la table maître (par script,
en résolvant chaque fiche à sa confiance réellement affichée, première
valeur retenue pour les notations doubles héritées comme « ⚠️
moyen/faible ») a révélé deux écarts antérieurs entre les lignes A et C
ci-dessus et le contenu réel des fiches, indépendants du travail sur le
secteur F : secteur A comptait encore 6 ⚠️ faible/14 ✅ fort au lieu de 5/
15 (un cours du cluster Villa Rica/Veracruz, vraisemblablement N093
Sampoval R., a été résolu à ✅ fort lors d'une révision antérieure à la
passe de recalibration formelle, sans être répercuté ici) ; secteur C
comptait 4 ⚠️ faible/2 ⚠️ moyen au lieu de 3/3 (les deux notations
héritées « ⚠️ moyen/faible » de N059/R. Granda et N067/R. Pech n'avaient
pas été résolues de façon cohérente — l'une comptée moyen, l'autre
faible — alors que la convention du projet retient la première valeur
listée, donc moyen pour les deux). Les deux lignes et le total ont été
corrigés en conséquence ; aucune fiche n'a été modifiée par cette
correction, seule la table récapitulative était en cause.*

Soit environ **66 % en confiance forte**, **19 % en confiance moyenne**,
**10 % en confiance faible**, **5 %** en convention cartographique
assumée (Lac de Caslipa/Cassipa — désormais ancrée à un fait réel plutôt
que pure fiction, cf. complément collaboratif —, Arba de Canaveral/Barra
de Cañaveral, Salinas du Soconusco, Coyrama R./N019 et R.
Maryowapaneko/N065 — reclassés depuis leur statut initial d'erreur), et
**0 %** classés vraisemblablement erronés (dernier tracé encore erroné
retiré avec le reclassement de N019/N065) — voir la table de
correspondance des identifiants `ERR-0xx` ci-dessus (ERR-001, ERR-002,
ERR-003, ERR-004, ERR-005, ERR-008, ERR-009, ERR-010, ERR-011, ERR-012,
ERR-013, ERR-014, ERR-015, ERR-016, ERR-018, ERR-019, ERR-020, ERR-021,
ERR-022, ERR-023 et ERR-024 retirés suite aux révisions collaboratives de
N006/N040, du secteur Bocas del Toro → delta du Colorado, du golfe
d'Urabá, du Golfo de San Miguel, du secteur Orénoque/péninsule de Paria
(dont N019/N065, reclassés convention cartographique plutôt que
maintenus en erreur), des Llanos centraux, du panhandle floridien, du
cluster Villa Rica/La Antigua à Veracruz, de N058 (Oaxaca), de N044/N049
(côte de Colón/Veraguas), de N057 (St. Andrew Bay), et du cluster
Pensacola/Mobile (N020/N028/N037/N041/N071).

À titre de comparaison, la session précédente sur les 29 cours **sans nom**
avait donné une répartition plus favorable aux confiances fortes/moyennes
(11 fort, 10 moyen, 8 ouverts) — attendu, puisque disposer d'un nom Jaillot
à analyser (même déformé) offre en général plus de prise qu'un simple
repérage géographique sans toponyme. Le taux résiduel de confiance faible/erronée dans ce corpus tient pour
l'essentiel à deux zones structurellement difficiles, déjà anticipées
dans la feuille de route : la Floride (le panhandle proprement dit s'est
nettement éclairci grâce au recoupement avec Delisle 1718 ; le Big Bend
et la façade atlantique de Géorgie restent en revanche très mal relevés
par les cartographes européens du début XVIIIe) et le cluster « Guayana /
delta sud de l'Orénoque » (toponymie héritée de la tradition légendaire
post-Ralegh/Hondius, mêlant géographie réelle et quête de l'El Dorado —
également en partie résolu depuis, cf. révisions collaboratives).

## Points de vigilance signalés pendant la recherche (à trancher par le MJ)

- **R. Guazacoalco (N061)** : nom sans ambiguïté (Coatzacoalcos) mais
  position Jaillot douteuse (collée à Villahermosa/Tabasco plutôt qu'à
  l'isthme de Tehuantepec, ~150 km plus à l'ouest) — probable erreur de
  relevé ou doublon de label de la carte source.
- **Rio del Canaveral (N080) vs Arba de Canaveral (N002)** : très
  probablement deux toponymes homonymes sans rapport géographique
  (« cañaveral » = roselière, terme descriptif générique), l'un sur le
  golfe (Big Bend), l'autre sur la côte atlantique près du vrai Cap
  Canaveral — à ne pas fusionner.
- **Tabasco R. (N099) et Chequapeque (N017)** : étiquetés territoire
  « guatemala » dans l'inventaire mais centroïde situé near Villahermosa
  (Mexique) — artefact de zonage administratif de l'inventaire, pas un
  indice géographique. Tabasco R. rattaché au même système que R008
  (session précédente, Río Carrizal/Grijalva).
- **Rio Grande de Santa Martha (N083)** recoupe géographiquement le même
  fleuve que le repère fixe R026 (Río Cauca, session précédente) — les
  deux tracés Jaillot pourraient représenter deux bras du même fleuve près
  de sa confluence avec le Magdalena, ou une redondance de la carte
  source ; non tranché.
- **Meracaybo River (N031)** confirmé comme un affluent distinct du lac
  Maracaibo (entrant par le sud), et non une redite du lac lui-même — mais
  son identité précise (Chama/Escalante/Motatán) reste ouverte, avec un
  chevauchement possible avec le Río Chama déjà identifié (R027, session
  précédente).
- **Cluster deltaïque du Suriname est (Copanama N048 / Marateka N063 /
  Marrawini N064)** : Jaillot semble sur-segmenter un espace que
  l'hydrographie moderne ne compte qu'en deux-trois cours (Commewijne,
  Cottica, Marowijne) — possible dédoublement cartographique plutôt que
  trois fleuves indépendants clairement assignables un à un.
- **Cluster « Guayana / delta sud de l'Orénoque »** (Bariquicometo,
  Capuri, Caturi Voari, Coyrama, R. Maryowapaneko, Lac de Caslipa) :
  toponymie héritée de Ralegh (*The Discoverie of Guiana*, 1596) et
  Hondius (1598), mêlant géographie réelle et légende de l'El
  Dorado/Manoa — fort taux de non-déterminé assumé plutôt que forcé.
  Varacoyari et Caturi Voari, initialement dans ce lot, en ont depuis été
  sortis (identifiés respectivement Río Caroní et Río Espino, révisions
  collaboratives) ; Coyrama et R. Maryowapaneko restent définitivement
  non déterminés (clôture collaborative).
