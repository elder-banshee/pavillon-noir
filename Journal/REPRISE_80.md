# REPRISE_80 — Démarrage du chantier bathymétrique

Session du 16 juillet 2026, à la suite de `REPRISE_79.md`.

## Objectif

Remplacer les anciens contours estimés des hauts-fonds par une chaîne fondée
sur GEBCO, tout en réutilisant la déformation Copernicus → Jaillot déjà validée.

## Décisions d'architecture

- Les anciens polygones de hauts-fonds sont faux et obsolètes. Ils ne doivent
  servir ni de référence géométrique, ni de validation, ni de déduplication.
- Seuils de navigation sûre : `1,8 / 3,6 / 6 / 8,4 / 12 m`, soit les tirants
  d'eau de référence des catégories majorés de 20 %.
- La bathymétrie calcule une restriction physique (`catBathymetriqueMax`) ;
  `catMax`, `catMaxNav` et `passageNav` restent des décisions de gameplay
  composites (tirant d'eau, manœuvrabilité, nature du fond et coque).
- Architecture hybride : polygones calculés pour les limites critiques de
  navigation ; grille hexagonale agrégée pour les propriétés environnementales
  étendues (plateau, talus, fosse, profondeur et aptitude au mouillage).
- GEBCO reste canonique en WGS84. La projection Jaillot doit réutiliser les
  nœuds homologues `copernicus_q_*` des SVG Copernicus source et marionnette.
- Des SVG de contrôle sont requis à chaque étape du pipeline.
- Prototype initial retenu : Bahamas.

## Audit du warp Copernicus → Jaillot

Outil créé :

```text
tools/bathymetrie/audit_warp_copernicus.py
```

Entrées par défaut :

```text
Accessoires site pavillon noir/Outils generation/Sources/courants-copernicus-quiver.svg
Accessoires site pavillon noir/Outils generation/Sources/courants-marionnette.svg
```

Sorties :

```text
tools/bathymetrie/output/warp-copernicus/warp-01-source-copernicus.svg
tools/bathymetrie/output/warp-copernicus/warp-02-jaillot.svg
tools/bathymetrie/output/warp-copernicus/warp-03-correspondances.svg
tools/bathymetrie/output/warp-copernicus/warp-audit.json
```

Premier résultat :

```text
nœuds source : 10 510
nœuds Jaillot cousus : 8 934
nœuds appariés : 8 934
nœuds source absents de la cible finale : 1 576
coutures : 213
quads complets par sous-domaine : 7 645
triangles contrôlés : 15 290
triangles dégénérés : 0
retournements d'orientation : 0
emprise WGS84 appariée : 99,0341°W–55,4292°W / 5,9774°N–34,2481°N
emprise Jaillot : x 161,2–8346 / y 384,3–5020,05
```

Une première reconstruction après moyenne des nœuds cousus produisait six
triangles retournés aux frontières Bahamas/Floride/Atlantique et
Bahamas/Caraïbes. Décision : conserver une maille indépendante par
sous-domaine pendant la projection, puis coudre les géométries projetées. Avec
cette stratégie, aucun triangle n'est dégénéré ou retourné.

Les 1 576 nœuds source absents de la cible restent à classifier entre
exclusions normales du découpage final et éventuels trous avant l'import GEBCO.

### Correction du contrôle visuel source

Le premier `warp-01-source-copernicus.svg` affichait des liens bleu clair
entre le Pacifique et la mer des Caraïbes. Il s'agissait uniquement d'un
artefact de preview : les indices `row/col`, réutilisés par plusieurs
sous-domaines, étaient recherchés dans un index global lors du dessin des
arêtes. L'audit topologique et le warp étaient déjà cloisonnés par domaine.

`source_preview()` construit désormais un index séparé pour chaque domaine et
inscrit `data-domain` sur chaque arête. Pacifique et Caraïbes ne communiquent
donc plus, ni dans le contrôle visuel ni dans la topologie exploitable.

## Acquisition et audit GEBCO Bahamas

Les deux GeoTIFF GEBCO 2026 ont été fournis dans :

```text
Accessoires site pavillon noir/Outils generation/Bathymétrie/Sources/GEBCO_2026_Bahamas
```

Outil ajouté : `tools/bathymetrie/audit_gebco_bahamas.py`. Résultat :

```text
alignement bathymétrie/TID : exact
dimensions : 2160 × 1920
référentiel : EPSG:4326 / WGS84
résolution : 15 secondes d'arc
emprise : 81°W–72°W / 20°N–28°N
bathymétrie : -5714 à +1653 m
NoData : 0 cellule dans les deux rasters
```

Codes TID présents : `0, 10, 11, 15, 16, 17, 40, 44`. La grille est dominée
par l'interpolation TID 40 (49,46 %), mais contient notamment 12,47 % de
multifaisceau et 18,63 % de bathymétrie photogrammétrique.

Le contrôle de côte relève 12 178 cellules à bathymétrie non négative avec un
TID non nul, presque toutes entre 0 et quelques mètres d'altitude. Ce n'est pas
un décalage de grille : aucune cellule TID=0 n'a une bathymétrie négative. Le
masque terrestre fonctionnel sera donc défini par `elevation >= 0`, tandis que
le TID restera une information de provenance indépendante.

Sorties :

```text
tools/bathymetrie/output/gebco-bahamas/bathymetrie-01-source.svg
tools/bathymetrie/output/gebco-bahamas/bathymetrie-01-source-audit.json
```

## Classification par seuils de navigation sûre

Outil ajouté : `tools/bathymetrie/classify_gebco_bahamas.py`.

Le contrôle combine une carte de bandes exclusives et cinq masques cumulatifs
par catégorie. Les statistiques obtenues sont :

| Classe | Cellules | Surface approx. | TID mesure directe |
|---|---:|---:|---:|
| Terre | 577 227 | 114 197 km² | 2,1 % |
| 0–1,8 m | 55 713 | 10 923 km² | 93,5 % |
| 1,8–3,6 m | 127 991 | 25 083 km² | 94,0 % |
| 3,6–6 m | 172 564 | 33 721 km² | 95,7 % |
| 6–8,4 m | 206 426 | 40 518 km² | 96,6 % |
| 8,4–12 m | 153 557 | 30 331 km² | 94,2 % |
| 12 m et plus | 2 853 722 | 557 834 km² | 21,1 % |

Les cinq bandes critiques de 0 à 12 m sont donc très majoritairement fondées
sur des mesures directes, presque toutes photogrammétriques (TID 16). Les eaux
de 12 m et plus sont au contraire dominées par l'interpolation TID 40.

Sorties :

```text
tools/bathymetrie/output/gebco-bahamas/bathymetrie-02-classes.svg
tools/bathymetrie/output/gebco-bahamas/bathymetrie-02-classes.json
```

## Extraction des amas et contours

Outil ajouté : `tools/bathymetrie/extract_gebco_bahamas_clusters.py`.

Principes : masques cumulatifs, connexité par côté (4 voisins), conservation de
tous les amas dans le JSON et vectorisation SVG à partir de quatre cellules.
Le seuil de quatre cellules est uniquement visuel : il ne filtre aucune donnée
scientifique. Un amas est classé `côtier` si au moins une de ses cellules est
adjacente par côté ou coin à une cellule `elevation >= 0`, sinon `détaché`.

| Seuil | Amas | Côtiers | Détachés | 1 cellule | Vectorisés |
|---|---:|---:|---:|---:|---:|
| 1,8 m | 5 203 | 3 561 | 1 642 | 3 083 | 1 027 |
| 3,6 m | 4 327 | 2 621 | 1 706 | 2 544 | 880 |
| 6 m | 3 974 | 2 133 | 1 841 | 2 369 | 778 |
| 8,4 m | 3 902 | 1 846 | 2 056 | 2 291 | 750 |
| 12 m | 2 918 | 1 615 | 1 303 | 1 721 | 577 |

Les grands ensembles sont cohérents mais la ponctuation d'une cellule est
importante. Elle devra être qualifiée par TID, contraste local et proximité
d'une route plutôt que supprimée automatiquement.

Sorties :

```text
tools/bathymetrie/output/gebco-bahamas/bathymetrie-03-amas.svg
tools/bathymetrie/output/gebco-bahamas/bathymetrie-03-amas.json
```

## Prototype de transposition GEBCO → Jaillot

Outil ajouté : `tools/bathymetrie/warp_gebco_bahamas_to_jaillot.py`.

Le premier essai, limité à la topologie explicite du domaine Bahamas, perdait
la majorité des sommets : le raster régional couvre aussi Floride, Cuba et
Atlantique, et les grilles de courants sont trouées près des terres. Un second
essai avec tous les domaines atlantiques ne résolvait pas les lacunes côtières.

La solution de contrôle retenue triangule directement les points homologues
WGS84/Jaillot de chaque sous-domaine par Delaunay. Les domaines restent
indépendants ; le Pacifique est explicitement exclu. Sont rejetés les triangles
retournés et ceux dont une arête source dépasse 1,5°.

Couverture des contours vectorisés (au moins quatre cellules) :

| Seuil | Objets complets | Objets partiels | Sommets hors couverture |
|---|---:|---:|---:|
| 1,8 m | 908 | 119 | 3 984 / 32 145 |
| 3,6 m | 764 | 116 | 5 357 / 48 700 |
| 6 m | 669 | 109 | 5 092 / 58 267 |
| 8,4 m | 658 | 92 | 5 237 / 60 991 |
| 12 m | 498 | 79 | 5 331 / 54 073 |

Les pertes restantes se concentrent aux limites de l'emprise et hors enveloppe
des contrôles homologues. Le SVG de contrôle référence directement l'image
Jaillot et affiche le seuil 12 m par défaut ; les quatre autres seuils sont des
groupes SVG masqués.

Sorties :

```text
tools/bathymetrie/output/gebco-bahamas/bathymetrie-04-jaillot-brut.svg
tools/bathymetrie/output/gebco-bahamas/bathymetrie-04-jaillot-brut.json
```

### Validation visuelle utilisateur

Le contrôle sur Jaillot est jugé globalement encourageant :

- les seuils élevés tombent plutôt bien dans l'ensemble ;
- Cuba est sensiblement plus juste ;
- la zone des Bahamas demande des corrections manuelles importantes, car la
  forme des îles dessinées par Jaillot s'écarte trop fortement de la géographie
  réelle pour que le warp scientifique brut suffise localement.

Décision de suite : ne pas retoucher séparément les contours des cinq seuils.
Les corrections Bahamas devront agir sur une déformation locale commune à
toutes les classes, afin de préserver leur emboîtement bathymétrique. Cuba doit
servir de zone témoin stable et ne pas être dégradée par ces corrections.

### Arbitrage suivant : passage immédiat à l'ensemble de la carte

L'utilisateur préfère traiter directement toute la carte, puis corriger
manuellement les polygones simplifiés sur Jaillot lorsque nécessaire. La cage
locale Bahamas envisagée précédemment est abandonnée.

Ordre retenu : inventaire et priorisation en WGS84, transposition Jaillot,
simplification principale en pixels Jaillot, ajustements manuels, puis audits
d'auto-intersection et d'emboîtement des seuils. Une simplification forte avant
warp est exclue afin de conserver assez de sommets pour la déformation.

## Préparation du traitement global

L'emprise des contrôles Copernicus appariés est :

```text
99,0341°W–55,4292°W / 5,9774°N–34,2481°N
```

L'acquisition GEBCO est normalisée à une emprise entière alignée sur 15″ :

```text
100°W–55°W / 5°N–35°N
10 800 × 7 200 = 77 760 000 cellules
```

Décision : télécharger un seul couple bathymétrie/TID pour éviter toute couture
scientifique entre régions. Les composantes connexes et le contraste seront
calculés globalement en WGS84 ; Golfe, Caraïbes, Bahamas, Floride, Atlantique
et Pacifique resteront des domaines logiques de contrôle et de warp.

Fichiers ajoutés :

```text
tools/bathymetrie/bathymetrie-globale.json
tools/bathymetrie/ACQUISITION_GLOBALE.md
tools/bathymetrie/check_gebco_global_sources.py
```

Les gros résultats globaux seront écrits hors dépôt dans :

```text
Accessoires site pavillon noir/Outils generation/Bathymétrie/Générés/GEBCO_2026_Jaillot
```

Le Pacifique forme une famille de warp indépendante et ne doit jamais
communiquer avec les domaines atlantiques.

## Audit et classification de la grille globale

Les deux GeoTIFF ont été acquis et validés : `10 800 × 7 200`, EPSG:4326,
15 secondes d'arc, alignement bathymétrie/TID exact, aucune cellule NoData.

Outil ajouté : `tools/bathymetrie/process_gebco_global.py`. Il lit les rasters
par bandes et écrit le raster canonique de classes uint8 hors dépôt.

Résultats globaux :

```text
bathymétrie : -8824 à +5611 m
mer : 57 751 855 cellules
terre : 20 008 145 cellules
```

| Classe | Cellules | Surface approx. | Mesures directes |
|---|---:|---:|---:|
| 0–1,8 m | 181 691 | 35 963 km² | 74,4 % |
| 1,8–3,6 m | 414 128 | 81 948 km² | 72,7 % |
| 3,6–6 m | 369 970 | 72 925 km² | 77,4 % |
| 6–8,4 m | 431 194 | 85 334 km² | 78,6 % |
| 8,4–12 m | 390 360 | 77 711 km² | 77,8 % |
| 12 m et plus | 55 964 512 | 11 171 544 km² | 39,9 % |

Correction de nomenclature après vérification de la documentation officielle
GEBCO 2026 : TID 17 = combinaison de méthodes de mesure directes ; TID 70 =
grille pré-générée à sources mixtes. Les scripts et rapports Bahamas/globaux
ont été régénérés avec ces définitions.

## Contraste, persistance et priorisation globale

Outil ajouté : `tools/bathymetrie/prioritize_gebco_global.py`.

Le calcul utilise une connexité par côté, une couronne directionnelle proche
(1 cellule), une couronne large (12 cellules, environ 5 km), la part TID
directe, le caractère côtier/détaché et la persistance entre seuils. Les
fichiers de labels temporaires de 311 Mo sont alternés puis supprimés.

Résultats :

| Seuil | Composantes | Cellules cumulées |
|---|---:|---:|
| 1,8 m | 23 936 | 181 691 |
| 3,6 m | 22 788 | 595 819 |
| 6 m | 21 234 | 965 789 |
| 8,4 m | 19 973 | 1 396 983 |
| 12 m | 18 488 | 1 787 343 |

Aucun conflit de parenté n'a été détecté entre niveaux. Les 18 488 composantes
à 12 m constituent les entités canoniques ; elles agrègent leurs cœurs moins
profonds. Le tri relève 523 priorités documentaires hautes et 1 456 confiances
scientifiques hautes.

Outil de visualisation ajouté : `render_global_priority_svg.py`. Carte obtenue :

```text
Bathymétrie/Générés/GEBCO_2026_Jaillot/bathymetrie-04-contraste.svg
```

Répartition visuelle : 523 hautes, 3 802 moyennes, 4 840 faibles et 9 323 à
confiance scientifique inférieure à 40. Les scores sont uniquement des aides au
tri humain et n'autorisent aucune suppression automatique.

## Addendum structurel — plateaux et pinnacles

Constat utilisateur après le premier tri : Pedro Bank et d'autres grands bancs
apparaissaient comme des constellations de petits amas `<12 m`, car leur socle
se situe surtout entre 13 et 30 m. Les contrastes à une cellule et 5 km ne
permettaient pas de distinguer ces sommets des récifs réellement isolés.

Outil ajouté : `tools/bathymetrie/analyze_global_plateaus.py`.

Méthode :

- composantes connexes globales de la mer entre 0 et 50 m ;
- parent `plateau50Id` affecté à chaque candidat `<12 m` ;
- contexte sous-échantillonné à environ 0,926 km ;
- anneaux 5–25 km et 25–50 km ;
- proportions marines `0–50 m`, `50–200 m` et `>200 m` ;
- terre comptée séparément et exclue du dénominateur marin ;
- signatures structurelles explicables, sans suppression automatique.

Résultats :

```text
composantes 0–50 m : 7 498
plateaux portant au moins un cœur <12 m : 5 494
candidats rattachés : 18 488
conflits de parenté : 0
```

Répartition heuristique des candidats :

```text
plateau_structurant : 7 152
bord_de_plateau : 4 761
atoll_ou_banc_detache : 266
pinnacle_isole : 32
indetermine : 6 277
```

Validation Pedro Bank : 43 candidats auparavant dispersés partagent désormais
le parent `PLATEAU50-005293`, d'environ 7 770 km² et 181 km d'étendue. Ce parent
repose à 97,6 % sur des mesures directes et contient 20 cœurs atteignant 6 m ou
moins. Les sommets proches du talus sont correctement signalés comme bordures
du même plateau plutôt que comme pinnacles solitaires.

Sorties principales hors dépôt :

```text
bathymetrie-05-plateaux-50m.csv/json
bathymetrie-05-candidats-structures-wgs84.csv/json
bathymetrie-05-structures-50m.svg
```

## Atlas sectoriel de décision

Outil ajouté : `tools/bathymetrie/render_sector_atlas.py`.

Neuf planches WGS84 sont produites :

```text
01-golfe-floride-atlantique.svg
02-yucatan-campeche.svg
03-honduras-nicaragua.svg
04-bahamas.svg
05-cuba-jamaique-caimans.svg
06-porto-rico-vierges.svg
07-petites-antilles-grenadines.svg
08-caraibes-sud.svg
09-pacifique.svg
```

Elles superposent le contexte `0–50 m`, les classes de navigation `0–12 m`,
les cœurs par signature, les bboxes/identifiants des structures importantes et
des toponymes WGS84. Les chevauchements entre planches sont volontaires.

Une page `atlas-index.html` permet de parcourir l'ensemble. La table
`decisions-structures.csv` contient les 5 494 structures et les champs de
décision documentaire. Les valeurs prévues sont : `zone_principale`,
`rattacher`, `sous_zone`, `pinnacle`, `conserver_physique`, `suspect` et
`hors_scope`.

Pour éviter une affectation erronée autour de l'isthme, la famille de warp de
chaque plateau est déduite du nœud source Copernicus le plus proche : 5 279
structures Atlantique et 215 Pacifique. Toutes les structures ont au moins un
secteur principal ; aucun `hors-atlas` technique ne subsiste.

Emplacement hors dépôt :

```text
Accessoires site pavillon noir/Outils generation/Bathymétrie/Générés/
GEBCO_2026_Jaillot/bathymetrie-06-atlas-secteurs
```

### Compatibilité Illustrator des planches

La première version encodait le fond raster avec `href="data:image/png;base64,…"`.
Chrome l'affichait correctement, mais Illustrator tentait de résoudre une image
liée sans chemin et signalait `Impossible de trouver le fichier lié ""`.

Le générateur produit désormais un PNG compagnon `*-fond.png` pour chaque SVG
et le référence par un chemin relatif `xlink:href`. Il déclare aussi les groupes
principaux comme calques nommés : fond de planche, titre, bathymétrie, emprises,
cinq signatures structurelles, étiquettes, toponymes et légende. Le SVG et son
PNG doivent rester côte à côte.

Contrôle après régénération : 9 SVG valides, 9 liens PNG résolus, aucun URI
`data:` restant et au moins 12 calques nommés par planche.

Un second défaut a été observé dans Illustrator : les PNG liés conservaient
leurs dimensions natives variables (de `1 140 × 1 080` à `5 400 × 1 440`) alors
que leur cadre SVG mesurait toujours `1 450 × 1 060`. Une correction
intermédiaire a aligné ces dimensions, mais Illustrator décalait encore les
images et ignorait partiellement la feuille CSS, rendant certains textes noirs.

Le rendu a donc été reconstruit avec un profil Illustrator sans transformations
ambiguës : chaque PNG RGBA mesure toute la planche (`1 900 × 1 200 px` à
96 ppp), est lié en `(0,0)` et contient déjà la carte dans sa position finale
`(55,80)–(1505,1140)`. Le SVG ne contient plus de feuille `<style>` ni de
classes ; chaque texte porte directement sa police, sa taille, son fond et son
contour. Les libellés superposent un texte de contour sombre et un texte clair,
ce qui ne dépend pas de la propriété CSS `paint-order`.

Contrôle structurel final : les neuf PNG sont RGBA `1 900 × 1 200`, leur boîte
opaque est exactement `(55,80,1505,1140)`, et l'image liée occupe tout le
canevas SVG depuis l'origine.

## Recentrage sur les enveloppes de navigation

Après examen de l'atlas, la taxonomie exhaustive des cœurs (`plateau`, `bord`,
`atoll`, `pinnacle`, `indéterminé`) a été jugée disproportionnée par rapport au
besoin du simulateur. La règle générale revient aux cinq seuils bathymétriques
absolus. Les parents `0–50 m` ne seront utilisés que pour quelques exceptions
historiques documentées lorsque les cœurs isolés sous-représentent le danger,
Pedro Bank constituant le cas de référence.

Outil ajouté :

```text
tools/bathymetrie/generate_bathymetry_threshold_maps.py
```

Il agrège la grille par blocs `2 × 2`, retire les eaux intérieures sans connexion
océanique, lisse d'une cellule, écarte les composantes inférieures à trois
cellules agrégées et simplifie les contours. La déformation réutilise les
maillages Copernicus par familles séparées. Dans les trous côtiers du maillage,
une interpolation locale des contrôles voisins permet de conserver les contours
sans jamais relier Atlantique et Pacifique.

Sorties hors dépôt :

```text
Bathymétrie/Générés/GEBCO_2026_Jaillot/bathymetrie-07-seuils-lisses/
bathymetrie-07-seuils-lisses-wgs84.svg
bathymetrie-08-seuils-lisses-jaillot.svg
bathymetrie-07-apercu-wgs84.png
bathymetrie-08-apercu-jaillot.png
bathymetrie-07-08-rapport.json
```

Les cinq niveaux WGS84 contiennent respectivement `1 777 / 2 002 / 1 928 /
1 753 / 1 525` anneaux après lissage et filtrage. La passe de connexion océanique
a exclu `13 115` cellules agrégées d'eaux intérieures. Les SVG sont organisés en
calques Illustrator sans CSS et conservent leurs références raster dans le même
dossier.

## Documentation

- `tools/bathymetrie/README.md` décrit l'audit et ses sorties.
- La feuille de route hors dépôt `Prompts/feuille-de-route-bathymetrie.md` a été
  mise à jour avec les décisions ci-dessus.
- L'`AGENTS.md` parent pointe désormais vers `pavillon-noir/Journal` pour les
  reprises ; `Prompts` reste réservé aux documents de travail.
