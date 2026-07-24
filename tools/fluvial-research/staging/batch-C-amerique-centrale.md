# Batch C — Amérique centrale (Guatemala / Honduras / Nicaragua / Costa Rica)

Identification de 22 cours d'eau nommés sur la carte Jaillot (1708), secteur
Amérique centrale. Méthode reprise à l'identique de la session précédente
(29 cours sans nom) : nom Jaillot, territoire, établissements proches
(`nearbySettlements`, recoupés avec `js\villes-data.js`), cours voisins déjà
identifiés, comparaison avec une carte contemporaine indépendante quand le
tracé Jaillot semble douteux. Le référentiel `[x,y]` est un CRS Leaflet
Simple (image 8500×5320 px), sans correspondance GPS réelle — utilisé
uniquement pour la position relative.

Deux notes déjà présentes dans `js\villes-data.js` (mêmes auteurs, même
session de travail sur la carte) ont servi d'ancrage fort pour trois fiches :
Xagua R. = Río Aguán (note sur `st-georges-honduras`), Sal R = río Cangrejal
(note sur `porta-de-sal`), et R. Pech = río Patuca (note sur
`gratios-o-dios`).

## 1. Tableau récapitulatif

| ID | watercourseId | Toponyme Jaillot | Identification proposée | Confiance |
|---|---|---|---|---|
| N007 | boccades-r | Boccades R. | Une des bouches du delta du Río San Juan (non tranché laquelle) | ⚠️ faible |
| N017 | chequapeque | Chequapeque | Non déterminé (petit cours côtier Tabasco/Chiapas, secteur delta Grijalva) | ⚠️ faible |
| N026 | lac-nicaragua | Lac Nicaragua | **Lac Nicaragua (Cocibolca)** | ✅ fort |
| N033 | n-segovia-river | N. Segovia River | **Río Segovia**, cours supérieur du Río Coco/Wangki | ✅ fort |
| N043 | r-auzuelos | R. Auzuelos | Río Colorado (distributaire méridional du San Juan, Costa Rica) — hypothèse | ⚠️ moyen |
| N051 | r-de-costaricha | R. de Costaricha | Río Frío (affluent sud du San Juan, frontière CR/Nicaragua) — hypothèse | ⚠️ moyen |
| N055 | r-dulce | R. Dulce | **Río Dulce** (Guatemala), exutoire du lac Izabal | ✅ fort |
| N059 | r-granda | R. Granda | Río Sico/Tinto (Black River), Honduras — hypothèse | ⚠️ moyen/faible |
| N060 | r-guaiapo | R. Guaiapo | Affluent du précédent, peut-être Río Paulaya — hypothèse | ⚠️ faible |
| N062 | r-lempa | R. Lempa | **Río Lempa** (Salvador) | ✅ fort |
| N066 | r-michataya | R Michataya | **Río Michatoya** (exutoire du lac Amatitlán, Guatemala) | ✅ fort |
| N067 | r-pech | R. Pech | Río Patuca (Honduras) — identification reprise de `villes-data.js`, avec réserve de position | ⚠️ moyen/faible |
| N070 | r-serapique | R. Serapique | **Río Sarapiquí** (Costa Rica), affluent du San Juan | ✅ fort |
| N076 | r-yayrepo | R Yayrepo | Une des bouches du delta du Río San Juan (non tranché laquelle) | ⚠️ faible |
| N087 | rio-san-juan | Rio San Juan | **Río San Juan** (Nicaragua/Costa Rica) | ✅ fort |
| N091 | sal-r | Sal R | Río Cangrejal (La Ceiba, Honduras) — identification reprise de `villes-data.js` | ⚠️ moyen |
| N092 | salinas | Salinas | Non déterminé (cours côtier du Soconusco, Chiapas) | ⚠️ faible |
| N097 | suere-ou-blewfield-river | Suere ou Blewfield River | Ancienne province/rivière de Suerre (Parismina/Tortuguero, Costa Rica) — PAS le Bluefields moderne | ⚠️ moyen |
| N099 | tabasco-r | Tabasco R. | **Système Grijalva/Usumacinta** (delta de Villahermosa) — malgré l'étiquette « guatemala » | ✅ fort |
| N101 | trigu-r | Trigu R. | Une des bouches du delta du Río San Juan, peut-être la branche « Taura » historique | ⚠️ faible |
| N104 | xagua-r | Xagua R. | **Río Aguán** (Honduras) | ✅ fort |
| N105 | yare-r | Yare R. | **« Yara/Cape River »**, cours inférieur historique du Río Coco/Wangki | ✅ fort |

## 2. Fiches détaillées

### N007 — boccades-r

- **Toponyme Jaillot :** Boccades R.
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (14,7 NM), Gracias a Dios/Nicaragua (côte Miskito). Bouche « sea » directe, plus une branche B en jonction avec le même complexe ; `relations` la lient à « fork » depuis Rio San Juan, et en « separate » avec R Yayrepo et Trigu R. sur les mêmes cellules.
- **Identification proposée / nom moderne :** Une des bouches du delta du Río San Juan sur la côte Miskito, sans correspondance précise possible.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Boccades R., Trigu R. et R Yayrepo forment un enchevêtrement serré de bouches/branches directement au débouché du Río San Juan (toutes en fork depuis « Rio San Juan », toutes proches du fort de l'Immaculée Conception). Les sources modernes confirment que le delta du San Juan comptait historiquement trois bouches revendiquées par le Nicaragua : le Colorado, le Taura, et celle débouchant dans la baie de San Juan del Norte. « Boccades » (< bocas, « les bouches ») pourrait désigner génériquement l'ensemble de ce complexe deltaïque plutôt qu'une bouche précise — le nom lui-même semble décrire la configuration plutôt que nommer un cours distinct. Sans capture haute résolution du tracé exact, impossible de trancher quelle bouche moderne (Colorado, San Juanillo…) correspond à ce tracé Jaillot précis.
- **Sources :** Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* ; inventaire interne (branches, relations, nearbySettlements).

### N017 — chequapeque

- **Toponyme Jaillot :** Chequapeque
- **Territoire :** guatemala (étiquette administrative de l'inventaire)
- **Repères proches :** Tocotalpa de la Sierra (38,6 NM), Laguna de Términos (59,6 NM, territoire yucatan), Villahermosa (61,3 NM, territoire nouvelle-espagne), Cobán (72,9 NM), Chiapa/Ciudad Real (78,4 NM). Cours voisin direct dans l'inventaire : Tabasco R.
- **Identification proposée / nom moderne :** Non déterminé — petit cours côtier du golfe du Mexique entre le delta du Tabasco/Grijalva et la Laguna de Términos.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Le centroïde (x≈1866, y≈2903) place Chequapeque dans la même zone que Tabasco R. (son voisin direct dans `neighbouringWatercourses`), c'est-à-dire sur la côte du golfe du Mexique près de Villahermosa/Laguna de Términos — donc bien loin de l'Amérique centrale malgré l'étiquette « guatemala » de l'inventaire (probable artefact de zonage administratif, comme déjà observé pour Tabasco R.). Aucune recherche (Chicozapote, petits cours du littoral tabasquéño) n'a permis de faire correspondre ce toponyme phonétique à un cours actuel identifiable avec confiance.
- **Sources :** Recherche web (aucune correspondance solide trouvée pour « Chequapeque ») ; inventaire interne.

### N026 — lac-nicaragua

- **Toponyme Jaillot :** Lac Nicaragua
- **Territoire :** nicaragua
- **Repères proches :** Lac Nicaragua/Cocibolca (1,3 NM — coïncidence quasi parfaite), Granada (2,9 NM), La Trinidad (5,1 NM), León (6,2 NM), Mena (6,2 NM). Cours voisins : N. Segovia River, Rio San Juan.
- **Identification proposée / nom moderne :** Lac Nicaragua (Cocibolca).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance directe de toponyme et de position — le lac est nommé « Lac Nicaragua » sur la Jaillot comme aujourd'hui, entouré des mêmes villes riveraines historiques (Granada, León). L'outlet du lac se jette précisément dans « Rio San Juan », exactement comme la géographie réelle (le San Juan est l'exutoire du lac vers la mer des Caraïbes). C'est l'identification la plus évidente et la mieux recoupée de tout le lot.
- **Sources :** `js\villes-data.js` (entrée `lac-nicaragua`, déjà nommée « Lac Nicaragua (Cocibolca) ») ; inventaire interne (outlet vers Rio San Juan).

### N033 — n-segovia-river

- **Toponyme Jaillot :** N. Segovia River
- **Territoire :** honduras
- **Repères proches :** Nueva Segovia (4,7 NM), La Trinidad/Nicaragua (48,2 NM), Lac Nicaragua (proche). Outlet en jonction vers « Yare R. » ; `relations` la sépare de Yare R. sur une cellule commune.
- **Identification proposée / nom moderne :** Río Segovia, cours supérieur historique du Río Coco (Wangki).
- **Confiance :** ✅ fort
- **Raisonnement :** Le nom colle exactement au fleuve historique : les conquistadors espagnols désignaient le cours supérieur de l'actuel Río Coco/Wangki sous le nom de « Río Segovia », par référence à la région minière de Nueva Segovia qu'il traverse — précisément la ville la plus proche sur la carte (4,7 NM). La structure hydrographique de l'inventaire confirme cette identification : N. Segovia River se jette dans « Yare R. », qui elle-même rejoint la mer — exactement la séquence historique Segovia (amont) → Yara/Cape River (aval) → embouchure, avant l'unification moderne sous le nom Río Coco.
- **Sources :** Wikipédia (en) *Coco River* — « formerly known as the Río Segovia, Cape River, or Yara River » ; inventaire interne (jonction vers Yare R.).

### N043 — r-auzuelos

- **Toponyme Jaillot :** R. Auzuelos
- **Territoire :** costa-rica
- **Repères proches :** Castillo de Austria (40 NM, fort espagnol probablement à l'embouchure du río Matina), Gracias a Dios/Nicaragua (58,2 NM), Confluent du San Juan (64 NM), Concepción/Panama-Bocas del Toro (68,2 NM). Cours voisin : Suere ou Blewfield River.
- **Identification proposée / nom moderne :** Río Colorado — hypothèse (distributaire du San Juan débouchant indépendamment sur la côte caraïbe du Costa Rica).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** Position intermédiaire sur la côte caraïbe entre l'embouchure du San Juan et le secteur de Suerre/Tortuguero, avec une bouche « sea » indépendante (pas de jonction vers Rio San Juan dans les outlets). Cela correspond bien à l'hydrologie réelle du Río Colorado, qui se détache du San Juan en amont (côté costaricien) pour rejoindre la mer séparément à Barra del Colorado, au sud de l'embouchure principale — configuration cohérente avec le tracé Jaillot. Le toponyme « Auzuelos » (hameçons) ne correspond à aucune source identifiée ; l'identification repose donc uniquement sur la position relative, d'où une confiance modérée.
- **Sources :** derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* ; `js\villes-data.js` (entrée `chateau-de-austria`) ; inventaire interne.

### N051 — r-de-costaricha

- **Toponyme Jaillot :** R. de Costaricha
- **Territoire :** nicaragua
- **Repères proches :** Gracias a Dios/Nicaragua (14,4 NM), Castillo de la Inmaculada Concepción (14,7 NM), Confluent du San Juan (28,3 NM), Mena (35,6 NM). Outlet en jonction directe vers « Rio San Juan ».
- **Identification proposée / nom moderne :** Río Frío — hypothèse.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** Le nom « de Costaricha » (« du Costa Rica ») est de toute évidence un nom générique de repérage plutôt qu'un toponyme local — cohérent avec un affluent frontalier venant du territoire costaricien pour rejoindre le San Juan. La note de `villes-data.js` sur `confluent-san-juan-frio` indique explicitly qu'un site proche sur la Jaillot marque la confluence du San Juan avec un « Rio Cambitto », identifié comme probablement le río Frío (actuelle frontière Costa Rica/Nicaragua). R. de Costaricha est le cours le plus proche de ce point de confluence dans notre liste, avec une jonction directe vers Rio San Juan cohérente.
- **Sources :** `js\villes-data.js` (entrée `confluent-san-juan-frio`) ; inventaire interne.

### N055 — r-dulce

- **Toponyme Jaillot :** R. Dulce
- **Territoire :** honduras (frontière guatemala)
- **Repères proches :** Santo Tomás de Castilla (5 NM), Lac Izabal (7 NM), Cobán (10,6 NM), Puerto Caballos (28,3 NM). Cours voisin : R. Pech.
- **Identification proposée / nom moderne :** Río Dulce (Guatemala), exutoire du lac Izabal vers la mer des Caraïbes.
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance de nom exacte et position géographique sans ambiguïté : le Río Dulce relie historiquement le lac Izabal au golfe du Honduras, exactement entre Santo Tomás de Castilla et le lac Izabal comme sur la carte Jaillot. La structure en delta à multiples bras (branches 1 à 5 dans l'inventaire) correspond bien au réseau deltaïque réel du Río Dulce près de Livingston. C'est l'un des toponymes les plus anciens et stables de la région (d'où le nom du « Golfo Dulce » espagnol dès le XVIe siècle).
- **Sources :** Inventaire interne (position, branches multiples, nearbySettlements) ; connaissance géographique générale du Río Dulce/Livingston.

### N059 — r-granda

- **Toponyme Jaillot :** R. Granda
- **Territoire :** honduras
- **Repères proches :** Trujillo (39,2 NM), San Jorge de Olancho (72,5 NM), Nueva Segovia (96,8 NM), Cap Gracias a Dios (143,7 NM). Cours voisin : R. Guaiapo (affluent).
- **Identification proposée / nom moderne :** Río Sico (aussi appelé Río Tinto / Black River) — hypothèse.
- **Confiance :** ⚠️ moyen/faible
- **Raisonnement :** Positionné sur la côte hondurienne entre Trujillo et le secteur de l'Aguán/Segovia, dans la zone où le principal cours réel est le Río Sico (Tinto), historiquement connu des Anglais sous le nom de « Black River » et parfois désigné par des noms génériques proches de « Rio Grande » sur les cartes d'époque. « Granda » pourrait être une déformation de « Grande ». Faute de tracé précis recoupable avec une carte indépendante, l'identification reste une hypothèse raisonnable plutôt qu'une certitude.
- **Sources :** Connaissance géographique générale de la côte des Mosquitos (Black River/Río Tinto) ; inventaire interne.

### N060 — r-guaiapo

- **Toponyme Jaillot :** R. Guaiapo
- **Territoire :** honduras
- **Repères proches :** Trujillo (41,4 NM), San Jorge de Olancho (46,5 NM). `relations` : séparé de R. Granda sur une cellule commune ; outlet en jonction vers R. Granda.
- **Identification proposée / nom moderne :** Non déterminé avec confiance — éventuellement Río Paulaya, affluent réel du système Sico/Tinto.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Se jette directement dans R. Granda selon l'inventaire (outlet type « junction », targetRiverId « R. Granda »), ce qui en fait un affluent de ce dernier plutôt qu'un cours autonome. Si R. Granda correspond au Río Sico, le tributaire réel le plus notable de ce bassin est le Río Paulaya — mais aucun élément toponymique ou cartographique ne permet de confirmer ce rapprochement au-delà d'une hypothèse structurelle.
- **Sources :** Inventaire interne (relation de jonction avec R. Granda).

### N062 — r-lempa

- **Toponyme Jaillot :** R. Lempa
- **Territoire :** guatemala (étiquette administrative — la Capitainerie générale du Guatemala englobait le Salvador d'aujourd'hui)
- **Repères proches :** San Miguel de la Frontera (7,5 NM), Amapala (30,3 NM), San Salvador (43,4 NM), La Trinidad/Guatemala (52,8 NM), Gracias/Honduras (67,5 NM).
- **Identification proposée / nom moderne :** Río Lempa (Salvador).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance de nom directe (« Lempa » est resté inchangé depuis la période coloniale) et position géographique cohérente : le fleuve le plus proche de San Salvador et San Miguel dans l'inventaire, exactement la position du Río Lempa réel qui traverse le territoire salvadorien avant de se jeter dans le Pacifique. C'est le principal fleuve d'Amérique centrale sur la façade Pacifique et son identité n'a jamais varié sur les cartes historiques.
- **Sources :** Inventaire interne (position relative à San Salvador/San Miguel) ; connaissance géographique générale (Río Lempa, Salvador).

### N066 — r-michataya

- **Toponyme Jaillot :** R Michataya
- **Territoire :** guatemala
- **Repères proches :** Santiago de Guatemala (7,5 NM — quasi juxtaposé), Volcán de Agua (19,4 NM), Cobán (44,9 NM), Soconusco (71,2 NM).
- **Identification proposée / nom moderne :** Río Michatoya, exutoire du lac Amatitlán (Guatemala).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique quasi parfaite (Michataya/Michatoya) et position géographique exacte : le Río Michatoya prend sa source au lac Amatitlán, à quelques kilomètres de Santiago de Guatemala/Antigua (7,5 NM sur la carte, la distance la plus courte de toute la fiche), avant de rejoindre le Pacifique via Escuintla. C'est l'une des identifications les plus solides du lot, tant par le nom que par la position.
- **Sources :** Wikipédia (en) *Michatoya River* ; deguate.com, *Río Michatoya, Escuintla* ; inventaire interne.

### N067 — r-pech

- **Toponyme Jaillot :** R. Pech
- **Territoire :** honduras
- **Repères proches :** Gracias/Villa de Gracias a Dios (4,3 NM), Santo Tomás de Castilla (12 NM), Puerto Caballos (13,8 NM), San Pedro Sula (56,1 NM), Lac Izabal (56,7 NM). Cours voisin : R. Dulce.
- **Identification proposée / nom moderne :** Río Patuca — identification reprise de `js\villes-data.js` (note sur `gratios-o-dios`), avec réserve.
- **Confiance :** ⚠️ moyen/faible
- **Raisonnement :** Le fichier `villes-data.js` indique explicitement, pour la ville de Gracias (Villa de Gracias a Dios, Lempira) : « en remontant le "R. Pech" (río Patuca) depuis la côte ». Cette identification est donc déjà actée dans le canon du projet et reprise ici par cohérence. Elle pose toutefois un problème de position : l'embouchure réelle du Río Patuca se trouve très loin à l'est (Mosquitia hondurienne, région du cluster Boccades/Yayrepo dans cette même fiche), alors que R. Pech est positionné sur la carte tout près de Puerto Caballos et San Pedro Sula, dans l'ouest du Honduras — un déplacement cartographique majeur, mais plausible vu les autres déformations connues de la Jaillot pour ce secteur. Le nom « Pech » (peuple indigène de l'est du Honduras, riverain historique du Patuca) reste un indice linguistique fort en faveur de l'identification malgré l'anomalie de position. À prendre comme hypothèse de travail plutôt que certitude.
- **Sources :** `js\villes-data.js` (entrée `gratios-o-dios`) ; inventaire interne (position).

### N070 — r-serapique

- **Toponyme Jaillot :** R. Serapique
- **Territoire :** nicaragua (frontière costa-rica)
- **Repères proches :** Confluent du San Juan (11,7 NM), Gracias a Dios/Nicaragua (12,9 NM), Castillo de la Inmaculada Concepción (18,7 NM), Castillo de Austria (21,6 NM). Outlet en jonction directe vers « Rio San Juan ».
- **Identification proposée / nom moderne :** Río Sarapiquí (Costa Rica).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance toponymique directe (Serapique/Sarapiquí) et hydrologie identique : le Sarapiquí est un affluent réel et bien documenté du Río San Juan, rejoignant celui-ci par le sud (côté costaricien), exactement comme l'indique la jonction « Serapique → Rio San Juan » de l'inventaire. Fleuve historiquement important comme voie de pénétration vers la vallée centrale du Costa Rica.
- **Sources :** Connaissance géographique générale (Río Sarapiquí, affluent du San Juan) ; inventaire interne (jonction).

### N076 — r-yayrepo

- **Toponyme Jaillot :** R Yayrepo
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (3,8 NM), Castillo de la Inmaculada Concepción (16,7 NM), Gracias a Dios/Nicaragua (22,3 NM). `relations` : fork depuis Rio San Juan, séparé de Boccades R.
- **Identification proposée / nom moderne :** Une des bouches/branches du delta du Río San Juan, non déterminée précisément.
- **Confiance :** ⚠️ faible
- **Raisonnement :** Fait partie du même enchevêtrement serré de branches deltaïques que Boccades R. et Trigu R. (voir N007), toutes issues par « fork » du Rio San Juan à proximité immédiate du fort de l'Immaculée Conception. Le toponyme « Yayrepo » ne correspond à aucune source identifiée par recherche ; sans capture rapprochée du tracé Jaillot exact, aucune correspondance fiable avec une bouche moderne nommée (Colorado, Taura, San Juanillo) n'a pu être établie.
- **Sources :** Inventaire interne (relations, position) ; recherche web (aucune correspondance directe trouvée).

### N087 — rio-san-juan

- **Toponyme Jaillot :** Rio San Juan
- **Territoire :** nicaragua (frontière costa-rica)
- **Repères proches :** Castillo de la Inmaculada Concepción (3,4 NM), Confluent du San Juan (3,8 NM), Gracias a Dios/Nicaragua (4,7 NM). Outlet « sea » à l'embouchure ; jonctions multiples en amont avec Lac Nicaragua, R. Serapique, R. de Costaricha, et les branches Boccades/Trigu/Yayrepo à l'aval.
- **Identification proposée / nom moderne :** Río San Juan (Nicaragua/Costa Rica), reliant le lac Nicaragua à la mer des Caraïbes.
- **Confiance :** ✅ fort
- **Raisonnement :** Identification directe et sans ambiguïté : nom identique, position identique (exutoire du lac Nicaragua vers la mer, ponctué par le fort de l'Immaculée Conception), et structure hydrographique complète cohérente avec la géographie réelle (affluents Sarapiquí et Frío/Costaricha, delta multi-bras à l'embouchure). Fleuve historiquement majeur, remonté par les flibustiers lors des raids sur Grenade (1665, 1670 — Henry Morgan et d'autres selon les sources consultées), défendu par jusqu'à douze forts espagnols dont le Castillo de la Inmaculada Concepción (1675), représenté sur la carte sous le nom « Castillo de la Inmaculada Concepción ». Le tracé Jaillot correspond fidèlement au cours réel du fleuve, y compris son delta complexe à l'embouchure caraïbe.
- **Sources :** Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com, *El río San Juan y el Río Colorado* ; `js\villes-data.js` (entrées `castillo-san-juan`, `confluent-san-juan-frio`) ; inventaire interne.

### N091 — sal-r

- **Toponyme Jaillot :** Sal R
- **Territoire :** honduras
- **Repères proches :** Comayagua (4,5 NM), La Ceiba/Porta de Sal (7,6 NM), San Pedro Sula (23,8 NM), Gracias (49,8 NM).
- **Identification proposée / nom moderne :** Río Cangrejal (La Ceiba, Honduras).
- **Confiance :** ⚠️ moyen
- **Raisonnement :** Identification déjà actée dans `js\villes-data.js` (entrée `porta-de-sal`) : « "Sal River" sur la Jaillot = probable río Cangrejal (La Ceiba actuelle) ». La position colle bien : Sal R passe à proximité immédiate de La Ceiba (7,6 NM) et de Comayagua (4,5 NM), cohérent avec le bassin versant du Cangrejal qui descend de la Cordillère Nombre de Dios vers la côte à La Ceiba. Confiance reprise telle quelle du canon du projet, avec la même réserve (« probable ») que la note d'origine.
- **Sources :** `js\villes-data.js` (entrée `porta-de-sal`) ; inventaire interne.

### N092 — salinas

- **Toponyme Jaillot :** Salinas
- **Territoire :** guatemala
- **Repères proches :** Soconusco (3,4 NM), Tehuantepec (15 NM, territoire nouvelle-espagne), Chiapa/Ciudad Real (20,4 NM). Cours voisin : R. Guazacoalco (ou Guashigwalp).
- **Identification proposée / nom moderne :** Non déterminé — cours côtier du Soconusco (Chiapas, façade Pacifique).
- **Confiance :** ⚠️ faible
- **Raisonnement :** Position sans ambiguïté sur la côte Pacifique du Soconusco/Chiapas, tout près de Soconusco (3,4 NM) — donc bien distincte du Río Salinas intérieur du Petén (bassin de l'Usumacinta), qui n'a rien à voir géographiquement. Le nom « Salinas » désigne vraisemblablement des marais salants côtiers (toponyme générique fréquent sur cette portion de littoral). Plusieurs petits cours réels traversent ce secteur (Coatán, Cahoacán, Huixtla) sans qu'aucun ne se distingue clairement comme correspondance certaine faute d'éléments supplémentaires.
- **Sources :** Inventaire interne (position relative à Soconusco/Tehuantepec).

### N097 — suere-ou-blewfield-river

- **Toponyme Jaillot :** Suere ou Blewfield River
- **Territoire :** costa-rica
- **Repères proches :** Castillo de Austria (11 NM), Concepción/Panama (54,7 NM), Puebla/Alanje (57,1 NM), Chiriquí (66,2 NM). Cours voisins : R. Auzuelos, R. Caranaco.
- **Identification proposée / nom moderne :** Ancienne province/rivière de « Suerre », secteur Parismina/Tortuguero/Reventazón (Costa Rica) — **et non** le Bluefields moderne du Nicaragua.
- **Confiance :** ⚠️ moyen
- **Raisonnement :** Le double nom « Suere ou Blewfield » trahit probablement la superposition de deux sources d'information par le cartographe : un ancien toponyme colonial espagnol (« Suerre », cacicazgo/province documentée dès le XVIe-XVIIe siècle près de l'embouchure du Reventazón/Parismina, à l'origine du nom moderne du Río Suerte/Tortuguero) et un nom anglais de flibustier (« Blewfield », par analogie avec le capitaine Bluefield/Blauvelt actif sur la côte des Mosquitos). La position sur la carte tranche nettement en faveur de la lecture costaricienne : le cours est situé bien au sud de l'embouchure du San Juan, à seulement 11 NM du Castillo de Austria (positionné par `villes-data.js` près de l'embouchure du río Matina) — donc dans la zone de Matina/Parismina/Tortuguero, et non près de la lagune de Bluefields au Nicaragua qui se trouverait, elle, au nord du San Juan. C'est exactement la mise en garde du point 6 de la consigne : ne pas céder à la ressemblance phonétique avec le Bluefields moderne.
- **Sources :** Wikipédia (es) *Río Suerte* ; parquenacionaldetortuguero.wordpress.com (histoire coloniale de Tortuguero, mention de Matina et San Juan de la Cruz) ; `js\villes-data.js` (entrée `chateau-de-austria`) ; inventaire interne (position).

### N099 — tabasco-r

- **Toponyme Jaillot :** Tabasco R.
- **Territoire :** guatemala (étiquette administrative de l'inventaire — probable artefact de zonage)
- **Repères proches :** Tocotalpa de la Sierra (7,9 NM), Laguna de Términos (10,7 NM, yucatan), Cobán (proche), Chiapa/Ciudad Real. Cours voisins : Rio Palmas dos Bogas, St Anns, Tondelo.
- **Identification proposée / nom moderne :** Système Grijalva/Usumacinta, delta de Villahermosa (Tabasco, Mexique).
- **Confiance :** ✅ fort
- **Raisonnement :** Le centroïde (x≈1883, y≈2997) place ce cours exactement dans la même zone que la fiche déjà traitée dans la session précédente (R008, « Spirito Santo »/Villahermosa, identifiée comme le bras du Río Carrizal du delta du Grijalva) — malgré l'étiquette « guatemala » de l'inventaire, qui est manifestement un artefact de zonage administratif et non un indice géographique (à l'identique de Chequapeque, son voisin direct). Le nom « Tabasco R. » est d'ailleurs celui qui a donné son nom à la province coloniale et à l'État mexicain moderne : historiquement, le Grijalva a longtemps été appelé « Río Tabasco ». Il ne s'agit donc pas d'un cours homonyme distinct d'Amérique centrale, mais bien du même grand système Grijalva/Usumacinta déjà repéré près de Villahermosa.
- **Sources :** Synthèse de la session précédente (`fluvial-identification-synthese.md`, R008) ; recherche web (Wikipédia *Villahermosa* — « historically known as the Tabasco River ») ; inventaire interne (position, branches B-F du delta).

### N101 — trigu-r

- **Toponyme Jaillot :** Trigu R.
- **Territoire :** nicaragua
- **Repères proches :** Confluent du San Juan (27,7 NM), Gracias a Dios/Nicaragua (39,3 NM), Castillo de la Inmaculada Concepción (42,8 NM). `relations` : fork depuis Rio San Juan, séparé de Boccades R. et R Yayrepo_B.
- **Identification proposée / nom moderne :** Une des bouches du delta du Río San Juan — hypothèse spéculative : la branche historique « Taura ».
- **Confiance :** ⚠️ faible
- **Raisonnement :** Même complexe deltaïque que Boccades R. et R Yayrepo (voir N007/N076), avec une bouche « sea » propre. Les sources modernes confirment l'existence historique d'une branche du San Juan appelée « Taura » parmi les trois revendiquées par le Nicaragua (Colorado, Taura, San Juan del Norte) — une parenté phonétique lointaine (T.-U./T-R-G-U) reste envisageable par déformation cartographique, mais rien ne permet de la confirmer avec certitude ; à traiter comme simple piste plutôt que résultat établi.
- **Sources :** Wikipédia (es) *Río San Juan (Nicaragua)* ; derechointernacionalcr.blogspot.com ; inventaire interne.

### N104 — xagua-r

- **Toponyme Jaillot :** Xagua R.
- **Territoire :** honduras
- **Repères proches :** Saint-George's (5 NM), San Jorge de Olancho (6,7 NM), Trujillo (42,4 NM), Nueva Segovia (47,6 NM). Cours voisin : Yare R.
- **Identification proposée / nom moderne :** Río Aguán (Honduras).
- **Confiance :** ✅ fort
- **Raisonnement :** Identification déjà actée dans `js\villes-data.js` (entrée `st-georges-honduras`) : « Sur la "Xagua River" de la Jaillot — probablement le río Aguán (aussi orthographié Xagua, Aguan sur les cartes anciennes) ». Cohérence géographique confirmée : Saint-George's, la ville la plus proche du cours (5 NM), est justement positionnée le long de ce fleuve dans la note d'origine. La séparation nette avec Yare R. (à l'est, vers l'embouchure du Coco) correspond bien à la position réelle de l'Aguán, à l'ouest du bassin du Coco/Segovia.
- **Sources :** `js\villes-data.js` (entrée `st-georges-honduras`) ; inventaire interne.

### N105 — yare-r

- **Toponyme Jaillot :** Yare R.
- **Territoire :** honduras
- **Repères proches :** San Jorge de Olancho (6,7 NM), Saint-George's (37,3 NM), Nueva Segovia (43,6 NM), Cap Gracias a Dios (75,9 NM). Cours voisins : N. Segovia River (jonction amont), Xagua R.
- **Identification proposée / nom moderne :** « Yara » ou « Cape River », ancien nom du cours inférieur du Río Coco/Wangki (aujourd'hui unifié sous le nom Río Coco).
- **Confiance :** ✅ fort
- **Raisonnement :** Correspondance quasi littérale de nom (Yare/Yara) avec un fait historique documenté : le Río Coco actuel était connu, pendant la période coloniale, sous plusieurs noms selon le tronçon — « Río Segovia » en amont, « Cape River » ou « Yara River » en aval, près de l'embouchure au Cabo Gracias a Dios. L'inventaire confirme structurellement cette lecture : N. Segovia River se jette dans Yare R. par jonction directe, exactement la séquence historique Segovia (amont) → Yara (aval). La distance jusqu'au Cap Gracias a Dios reste notable sur la carte (75,9 NM), ce qui suggère un léger déplacement cartographique du tracé Jaillot vers le sud-est par rapport à l'embouchure réelle, mais l'identification du système reste solide au niveau du nom et de la structure hydrographique.
- **Sources :** Wikipédia (en) *Coco River* — « formerly known as the Río Segovia, Cape River, or Yara River » ; inventaire interne (jonction N. Segovia River → Yare R.).

## 3. Bilan chiffré

- ✅ **10 identifications fortes** : lac-nicaragua, n-segovia-river, r-dulce, r-lempa, r-michataya, r-serapique, rio-san-juan, tabasco-r, xagua-r, yare-r.
- ⚠️ **5 confiances moyennes** : r-auzuelos, r-de-costaricha, r-pech, sal-r, suere-ou-blewfield-river.
- ⚠️ **7 confiances faibles / non déterminées** : boccades-r, chequapeque, r-granda, r-guaiapo, r-yayrepo, salinas, trigu-r.
