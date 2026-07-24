# Feuille de route — cours d'eau restant à approfondir [CLÔTURÉE]

**Cette feuille de route est close.** La dernière passe de recherche
prévue ici a été menée (six recherches parallèles par secteur), avec
clôture systématique des cours restés sans correspondance réelle
défendable : ces tracés sont désormais classés **vraisemblablement
erronés**, avec un identifiant arbitraire `ERR-0xx` et une note dédiée
expliquant l'absence de correspondance. Résultat global sur les
42 cours couverts par cette feuille de route (hors branches de delta
déjà confirmées légitimes San Juan/Usumacinta, cf. plus bas) :

- **18 identifiés ou confirmés** avec un nom de fleuve réel (confiance
  forte ou moyenne) : N004, N006, N010, N038, N040, N048, N054, N060,
  N063, N086, R001, R002, R004, R011, R019, R020, R024, R028 — auxquels
  s'ajoutent **2 reclassés en convention cartographique non-fleuve**
  (N002 « Barra de Cañaveral », N092 zone salinière générique du
  Soconusco), soit **20 cours sur 42 clos sans passer par le statut
  erroné**. **N047, N069, N085, N094 et N022 rejoignent depuis cette
  liste des identifiés** (voir révisions collaboratives Bocas del Toro →
  delta, golfe d'Urabá et Golfo de San Miguel ci-dessous), portant ce
  sous-total à 25. N079 (déjà identifié en confiance faible dès
  l'origine, hypothèse Río León) passe en confiance moyenne (Río Caimán
  Nuevo) sans changer de statut ; N018 (Congo R.) et N090 (S. Maria
  River), qui n'étaient ni dans ce sous-total ni dans la liste erronée
  ci-dessous (statut « faible/non déterminé » resté hors des deux
  décomptes), sont également révisés — voir plus bas.
- **17 classés vraisemblablement erronés** (`ERR-002` à `ERR-023`,
  ERR-001, ERR-015, ERR-016, ERR-019, ERR-020, ERR-021 et ERR-024
  retirés) : N011, N012, N019, N021, N028, N034, N037, N049, N057,
  N058, N065, N071, N080, N102, R013, R014, R029.

**Révision collaborative post-clôture (avec Ronan) :** N006
(Bariquicometo R.), N010 (Capuri River) et N040 (Pato R.) ont été
identifiés a posteriori — respectivement Río Turbio (compression d'un
système Turbio→Buría→Cojedes→Portuguesa), Río Apure et Río Pao — sur la
base d'une reconstruction cellule par cellule du tracé Jaillot croisée
avec une fiche déjà rédigée dans `js/villes-data.js`. ERR-001 et
ERR-024 sont donc retirés. Le lac de Caslipa (N023) reste en convention
cartographique mais avec une note largement enrichie (ancrage réel :
peuple Cassipagotos, récit espagnol de 1594 sur le Caroní ; piste Guri
ouverte, non tranchée). Détail complet dans
`fluvial-identification-complete.md`, section « Session de clôture »
et son complément collaboratif (y compris les repères de cellules pour
automatisation des segments).

**Révision collaborative (avec Ronan) — delta du Río San Juan/Colorado :**
le toponyme « Rio San Juan » stocké pour N087 était une convention du
projet, pas une transcription fidèle — Jaillot inscrit en réalité
« Nicaragua ou Colorado R. » (cap de l'embouchure étiqueté « P. Iuan »).
N087 est donc reclassé Río Colorado (⚠️ moyen), N076 (R Yayrepo) devient
le probable bas Río San Juan/San Juan del Norte (⚠️ moyen) par élimination
géographique, N007 et N101 restent inchangés (⚠️ faible, branches non
tranchées). Par ricochet, l'hypothèse Río Colorado initialement portée
par N043 (R. Auzuelos), sur la seule base d'une position relative, a été
écartée — puis remplacée par une identification positive, voir
ci-dessous. Détail complet dans `fluvial-identification-complete.md`.

**Révision collaborative (avec Ronan) — séquence côtière Bocas del Toro
→ delta du Colorado :** en reconstituant avec Ronan toute la chaîne de
cours côtiers entre Bocas del Toro et le delta du San Juan/Colorado, six
identifiants ont été révisés ou tranchés : **N103 (Veragua R.) = Río
Cricamola** (Santa María écarté — fleuve pacifique, incompatible avec la
position caraïbe de Veragua R. ; sans lien avec Chiriquí Viejo/Nuevo,
homonymes pacifiques) ; **N069 (R. Quemades) = Río Changuinola** et
**N047 (R. Caranaco) = Río Sixaola** (ERR-016 et ERR-015 retirés) ;
**N073 (R. Talamanca) = Río San San** (remplace l'ancienne hypothèse
Sixaola/Telire, désormais assignée à Caranaco) ; **N097 (Suere ou
Blewfield River) = Río Matina** (remplace l'hypothèse Parismina/
Tortuguero — le Castillo de Austria, repère le plus proche de ce cours,
est documenté à l'embouchure du Matina) ; **N043 (R. Auzuelos) = Río
Pacuare**. Un septième cours, **R. Vergues** (= Río Parismina), cité par
Ronan comme voisin direct sur la carte entre Auzuelos et le delta,
n'apparaît dans aucun des fichiers numérisés (`fluvial-research-
inventory.json`, `js/oscar-hex-grid.js`) — probablement omis lors d'une
mise à jour d'`oceanBounds`, la frontière Costa Rica/Nicaragua étant
tracée trop au sud sur la Jaillot par rapport aux cartes modernes.
Détail complet (séquence, distances, sources) dans la fiche N043 de
`fluvial-identification-complete.md`.

**Révision collaborative (avec Ronan) — golfe d'Urabá, rive est :** le
groupe des quatre cours de la rive est du golfe (N085 Rio Negro, N079
Rio de los Redes, R025/F-106_90, N084 Rio Grande del Darién) a été
repris entièrement. N084 reste confirmé Río Atrato (✅ fort, inchangé).
**N085 (Rio Negro) = Río Caimán Viejo** (⚠️ moyen, ERR-019 retiré) et
**N079 (Rio de los Redes) = Río Caimán Nuevo** (⚠️ moyen, remplace
l'hypothèse Río León) — deux rivières réelles adjacentes à hauteur de
Necoclí, Rio Negro étant la plus au nord des deux. **R025/F-106_90 =
Río Turbo** (⚠️ moyen, remplace l'hypothèse Boca Tarena) : ce cours n'a
aucune relation structurelle avec l'Atrato dans l'inventaire, ce qui
favorise un cours indépendant plutôt qu'une bouche du delta. À cette
occasion, audit systématique confirmé : les 29 cours à
`mapLabelPresent: false` de l'inventaire correspondent un pour un aux
29 identifiants R001-R029 de la synthèse — aucun cours n'a échappé à la
session de synthèse.

**Révision collaborative (avec Ronan) — Golfo de San Miguel (Darién
Pacifique) :** le cluster N018 (Congo R.), N022 (Gold River), N090
(S. Maria River) et N094 (Sholes), rattaché en première passe au
secteur caraïbe de Santa María la Antigua del Darién, était une fausse
piste généralisée. Ronan a repéré l'étiquette Jaillot « Golfe de St
Michael » (Golfo de San Miguel, Pacifique) à l'endroit où ces cours
convergent, confirmé par un vrai Río Congo à cet emplacement et par la
chaîne de voisinage interne (Cheapo R./Bayano → Sholes → Congo R. →
S. Maria/Gold River). Résultat : **N018 = Río Congo** (✅ fort) ;
**N094 = Río Chimán** (⚠️ moyen, ERR-020 retiré) ; **N090 = Río Tuira →
Río Chucunaque** (⚠️ moyen, remplace Río Tanela) — tronc commun près
d'El Real de Santa María (fondée 1665 à la confluence Tuira/Chucunaque),
l'étiquette « S. Maria Riv. » suivant la branche qui remonte plein Nord
(Chucunaque) ; **N022 = Río Balsas** (district aurifère de Tucuti/Cana)
**+ Tuira** (branche méridionale « Gold River_B », Sambú écarté)
(⚠️ moyen, ERR-021 retiré). Río Chico et Río Tuquesa, les deux branches
non étiquetées identifiées par Ronan dans la fourche de S. Maria River,
ne sont pas digitalisées séparément dans l'inventaire, comme R. Vergues
(voir N043).

**Révision collaborative (avec Ronan) — delta sud de l'Orénoque / côte
des Guyanes :** relecture complète, à partir d'un crop haute
résolution, du tronçon de côte entre le delta et le Pomeroon. **N042**
(toponyme Jaillot « R. Amacuro ») est un faux-ami toponymique — sa
longueur trahit le **Río Barima** réel (✅ fort, inchangé côté ERR) ;
le véritable Río Amacuro moderne correspond à un cours non digitalisé,
« R Amachara ». Séquence est-ouest complète : **Spruyt = Río Moruca** ;
**R Waymy** (N075, inchangé) **= Río Waini** ; **R Amacuro** (N042)
**= Río Barima** ; **R Amachara = Río Amacuro** moderne ; puis, second
groupe descendant vers le delta : **R Maritere = Río Arature**,
**R Sebarrima = Río Aguirre** (⚠️ faible, possible écho du Barima),
**R Corobana = Río Imataca** (⚠️ faible, réserve structurelle). N065
(R. Maryowapaneko) reste non déterminé pour lui-même ; N011 et N019
restent inchangés, vraisemblablement erronés (N102, également dans ce
cluster, a depuis été identifié — voir paragraphe suivant). Aucun des
cours non digitalisés de ce groupe n'a d'identifiant N/R propre. Détail
complet dans la fiche N042 de `fluvial-identification-complete.md`.

**Révision collaborative (avec Ronan) — Varacoyari River (N102) et
péninsule de Paria (N021, N038) :** **N102 = Río Caroní** (⚠️ moyen,
ERR-005 retiré) — le confluent réel Caroní/Orénoque se situe précisément
à Santo Tomé de Guayana, repère le plus significatif de Varacoyari sur la
carte, bien mieux ancré structurellement que l'hypothèse Capure d'abord
envisagée par erreur de transcription puis écartée (même objection que
pour Capuri River/N010). Le petit lac sur le tracé n'est pas un ancêtre
du lac de Guri (artificiel, mis en eau à partir de 1969 seulement) mais
plus probablement une figuration des rapides proches de l'embouchure, ou
un écho de la ceinture de lacs légendaires Cassipa/Parime — Varacoyari
est le voisin direct de Lac de Caslipa/N023. Par ailleurs, sur la côte de
Paria : **N021 (Europa River) = Caño Macareo** (⚠️ moyen, ERR-018
retiré), bras nord du delta débouchant sur le sud du golfe de Paria ; et
**N038 (Ovarabiche R.) précisé en Río San Juan** (⚠️ moyen, inchangé côté
confiance), le Guarapiche restant reconnu comme son principal affluent
amont plutôt que l'identification directe. Détail complet dans les
fiches N102, N023, N021 et N038 de `fluvial-identification-complete.md`.

**Révision collaborative (avec Ronan) — Capuri River (N010) et
Bariquicometo R. (N006) :** l'Apure et l'Apurito sont désormais
distingués. **N006** est identifié jusqu'à ses embouchures principales :
Turbio → Buría → Cojedes → Portuguesa → **Río Apure**, ✅ fort, inchangé.
**N010** est révisé de Río Apure vers **Río Apurito** (⚠️ moyen), un vrai
distributaire qui se détache de l'Apure près de San Fernando et rejoint
l'Orénoque en aval des embouchures principales — position exactement
cohérente avec la fourche Jaillot, qui se détache du tronc principal
avant son embouchure et rejoint l'Orénoque séparément, plus en aval.
Détail complet dans les fiches N006 et N010.

**Clôture définitive (avec Ronan) — N019 (Coyrama R.) et N065
(R. Maryowapaneko) :** après recensement exhaustif de tout le secteur
entre le Caroní et le Pomeroon, aucun cours d'eau réel, même modeste, ne
reste disponible pour ces deux toponymes. ERR-003 et ERR-004 maintenus,
définitivement non déterminés — la Jaillot dessine ici davantage de
cours d'eau que la géographie moderne n'en reconnaît.

**Révision collaborative (avec Ronan) — N011 (Caturi Voari River) et
R028 (F-95_143-C) :** **N011 = Río Espino** et **R028 = Río Zuata**
(⚠️ moyen chacun, ERR-002 retiré), deux rivières réelles des Llanos
centraux (Guárico/Anzoátegui) rejoignant l'Orénoque par la rive nord. Les
deux toponymes Jaillot forment une relation `separate` (même point
d'embouchure, tracés parallèles) ; ni l'un ni l'autre n'est en réalité
proche de Santo Tomé de Guayana, contrairement à ce qu'impliquait
l'hypothèse antérieure pour R028 (**Río Usupamo, retirée** — simple nom
de site occupé par Santo Tomé entre 1637 et 1764, pas un hydronyme
indépendant). Confiance alignée sur celle de Capuri River/N010 = Río
Apurito, pour rester cohérente avec la chaîne de raisonnement du secteur
Bariquicometo/Apure/Apurito. Détail complet dans la fiche N011 de
`fluvial-identification-complete.md` et dans
`fluvial-identification-synthese.md` (R028).

**Révision collaborative (avec Ronan) — panhandle floridien, comparaison
avec Delisle 1718 :** recoupement fructueux, contrairement à la première
passe. **N080 (Rio del Canaveral) = Choctawhatchee River** (⚠️ moyen,
ERR-011 retiré) — la baie de débouché est nommée « Baie de Sainte Rose »
chez Delisle, confirmée « Bahía de Santa Rosa » = Choctawhatchee Bay par
une carte espagnole de 1700 indépendante. **N037 (Ostras) = Blackwater
River** et **N028 (Marpequeue) = Yellow River** (⚠️ moyen chacun,
ERR-008/ERR-010 retirés) — ces deux toponymes ne sont probablement pas
des noms de fleuve (pas de « R. », étiquette ne suivant pas le cours) ;
Delisle nomme les mêmes tracés « R del Amirante » (ouest) et « R Jordano »
(est), côté est de Pensacola Bay, où se jettent réellement la Blackwater
puis la Yellow River. **N057 (R. Flores) reste non déterminé** (aucune
correspondance Delisle trouvée) ; **N071 (R. Snelo) non rediscuté**.

**Révision collaborative (avec Ronan) — panhandle floridien, second
recoupement avec Bowen 1747 :** la conclusion « doublon graphique » du
paragraphe précédent pour R013/R014 est abandonnée. Bowen distingue deux
cours à cet emplacement (« Rivière des Canards » à l'ouest, « Rivière des
Apalaches » à l'est) et place son « Apalachecola R. » plus à l'ouest
encore, à la position de **Nieves R.** chez Jaillot. **N034 (Nieves R.) =
Río/Rivière Apalachicola** (⚠️ moyen, ERR-009 retiré). **R013 (à
l'ouest) = Ochlockonee River** (⚠️ faible, ERR-006 retiré, nom non
attesté indépendamment mais position exacte). **R014 (à l'est) =
St. Marks/Apalachee River** (⚠️ moyen, ERR-007 retiré) — la rivière
St. Marks portait historiquement le nom de « rivière Apalachee »,
attestation indépendante qui étaye cette identification. Détail complet
dans `fluvial-identification-complete.md` (section « Secteur Floride »,
fiche N034) et `fluvial-identification-synthese.md` (R013/R014).

Le détail complet (raisonnement, sources, table de correspondance des
`ERR-0xx`) est dans `fluvial-identification-complete.md` (section
« Session de clôture — dernière passe ») pour les cours N0xx, et dans
`fluvial-identification-synthese.md` (section « Session de clôture —
dernière passe ») pour les cours R0xx. Les tableaux récapitulatifs des
deux fichiers ont été mis à jour en conséquence.

Statut des groupes deltaïques évoqués plus bas dans ce document :
**Delta du Río San Juan/Colorado** (N007, N076, N101, plus le tronc
N087 — voir révision collaborative ci-dessus) et **Delta Usumacinta/
Grijalva** (N017, N095, N100) restent confirmés comme branches réelles
de fleuves identifiés. Pour le premier groupe, deux branches sur quatre
ont désormais une identification précise (N087 = Colorado, N076 =
probable San Juan del Norte) ; N007 et N101 restent non déterminées
individuellement — non reclassées erronées (ce sont des branches
réelles, pas des inventions), laissées en l'état. **Complexe Commewijne/Cottica** (N048, N063) :
**statut tranché** lors de cette session — ce ne sont ni des branches
d'un même delta, ni le Commewijne/Cottica eux-mêmes, mais deux rivières
réelles distinctes de l'ouest du Suriname (Coppename, Maratakka),
vraisemblablement mal repositionnées par Jaillot près de l'estuaire du
Suriname — voir détail dans `fluvial-identification-complete.md`.

---

## Contenu original de la feuille de route (archive, avant clôture)

Liste priorisée des ~52 cours (sur 134) restés en confiance ⚠️ faible ou
« non déterminé » à l'issue de la session de vérification croisée entre
`fluvial-identification-synthese.md` (29 cours sans nom) et
`fluvial-identification-complete.md` (105 cours nommés). Établie à la
demande de Ronan, branches de delta reléguées en priorité la plus basse
car regroupables sous une étiquette générique.

## Correction — le regroupement « Delta de l'Orénoque » était une erreur

Erreur de catégorie repérée par Ronan : N006 (Bariquicometo R.), N010
(Capuri River), N011 (Caturi Voari River), N019 (Coyrama R.), N065
(R. Maryowapaneko), N102 (Varacoyari River) sont des **affluents qui
rejoignent l'Orénoque en amont** (confluences), pas des **branches
distributaires de son delta**. Vérifié dans l'inventaire : ces six cours
sont listés comme simples voisins (`neighbouringWatercourses`) de
l'entité « orenoque », sans partager d'identifiant de rivière avec elle
— contrairement aux vraies branches deltaïques du fleuve
(`Delta_Orénoque_1/2/3`), déjà intégrées à l'entrée Orénoque (N036,
✅ fort) et donc déjà couvertes.

**Ces six cours remontent donc en priorité normale**, individuellement,
en particulier **N006 (Bariquicometo R.), signalé comme notablement long
sur la carte** — à traiter en priorité parmi eux plutôt qu'en dernier.

**Contrôle de cohérence sur les deux autres regroupements deltaïques :**
- Delta du Río San Juan (N007, N076, N101) : **confirmé légitime** — ces
  cours partagent directement l'identifiant « Rio San Juan » dans leurs
  données internes (vraie relation tronc/distributaire).
- Complexe Commewijne/Cottica (N048, N063) : **incertain**, aucun lien
  structurel direct trouvé avec un tronc commun — à revérifier avant de
  le laisser en priorité basse, pourrait être la même erreur que pour
  l'Orénoque (deux rivières distinctes plutôt que des branches).

## Priorité 1 — clusters cohérents, valeur potentielle élevée

- **Affluents de l'Orénoque (reclassés)** : N006 (Bariquicometo R. — en
  tête, cours notablement long), N010 (Capuri River), N011 (Caturi Voari
  River), N019 (Coyrama R.), N065 (R. Maryowapaneko), N102 (Varacoyari
  River) — 6 cours, retirés du groupe delta (cf. correction ci-dessus).

- **Floride** (secteur déjà signalé comme mal fixé cartographiquement,
  cf. discussion R013/R014) : R013, R014, N028 (Marpequeue), N034
  (Nieves R.), N037 (Ostras), N080 (Rio del Canaveral) — 6 cours.
  Gagnerait à être recoupé avec une carte contemporaine tierce (Moll,
  Delisle), comme pour R006/Sablomuere.
- **Bas Chagre / Panama** (pertinence historique forte — route de
  flibuste vers Panama City) : R019, R020, N049 (R. Coqueto) — 3 cours.
- **Bocas del Toro / Talamanca :** N047 (R. Caranaco), N069
  (R. Quemades) — 2 cours.
- **Péninsule de Paria / Golfe de Paria :** R029, N021 (Europa River),
  N038 (Ovarabiche R.) — 3 cours.
- **Darién / golfe d'Urabá :** N085 (Rio Negro), N094 (Sholes) —
  2 cours, à recouper avec R025 (déjà en partie résolu).

## Priorité 2 — cours isolés, valeur incertaine mais candidats déjà esquissés

R011 (R. Testa), R024 (North Edisto — hyp.), R028 (Usupamo — révisé,
à confirmer), N002 (Arba de Canaveral — probablement pas un vrai
fleuve), N022 (Gold River), N086 (Rio Palmas dos Bogas — candidat
Palizada déjà posé), N060 (R. Guaiapo).

## Priorité 3 — côtes pauvres en cours d'eau réels, faible espoir de résolution

R001, R002, R004, N012 (Cempel R.), N054 (R. de Vera Cruz), N058
(R. Galer), N092 (Salinas), N004 (Auyamas), N040 (Pato R.), N057
(R. Flores), N071 (R. Snelo).

## Priorité la plus basse — branches de delta (regroupables sous étiquette générique)

- **Delta du Río San Juan** (Nicaragua) : N007, N076, N101 — 3 branches,
  confirmées légitimes (partagent l'identifiant « Rio San Juan »).
- **Complexe Commewijne/Cottica** (est de Paramaribo) : N048, N063 —
  2 cours, **statut à reconfirmer** avant de les traiter comme de
  simples branches (cf. correction ci-dessus) — possible qu'il s'agisse
  de deux rivières distinctes plutôt que d'un delta commun.
- **Delta Usumacinta/Grijalva** (secteur Villahermosa) : N017, N095,
  N100 — 3 branches (à regrouper éventuellement avec Subutla/N096 sous
  une étiquette unique pour toute la façade tabasquéise).

Soit 8 cours en priorité basse confirmée (San Juan + Usumacinta/
Grijalva), 2 en attente de reclassement (Commewijne/Cottica), et les 6
affluents de l'Orénoque désormais remontés en priorité 1.
