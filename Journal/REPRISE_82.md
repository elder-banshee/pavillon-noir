# REPRISE_82 — Automatisation des courants fluviaux

Session du 20 juillet 2026, à la suite de `REPRISE_81.md`.

## Modèle retenu

Les courants fluviaux formeront un troisième champ vectoriel, distinct du
courant principal et du courant côtier ou contre-courant. Ils seront strictement
réservés aux cellules dont la nature comprend `fluviale` et ne seront utilisés
par le pilote automatique que lorsqu’un parcours sollicite explicitement le
profil fluvial.

Le garde-fou prévu exige au moins deux cellules fluviales consécutives d’une
même composante. Les petites rivières limitées à un hexagone pourront être
autorisées par une liste d’exceptions déclarative.

## Première identification automatique

Le nouvel outil non destructif
`tools/fluvial-currents/identify-fluvial-components.js` construit les
composantes connexes à partir des cellules déjà classées comme fluviales. Il
utilise directement le voisinage de la grille hexagonale odd-r et ne modifie
jamais `js/oscar-hex-grid.js`.

Première génération :

- 1 399 cellules comportant la nature fluviale ;
- 44 composantes connexes ;
- 4 composantes limitées à une cellule ;
- identifiants stables dérivés de la cellule d’ancrage, par exemple `F-7_23` ;
- jusqu’à trois embouchures proposées selon l’ouverture maritime locale.

Le rapport `fluvial-components-report.json` contient les cellules, régions,
états de courant, cellules mixtes côtières, emprises, embouchures candidates et
anomalies de chaque composante. Le SVG `fluvial-components-preview.svg`
superpose les groupes colorés, leurs identifiants et les propositions
d’embouchure à la carte Jaillot.

`config.js` permettra de renseigner uniquement les composantes reconnues : nom
moderne, nom figurant sur la carte, profil particulier et embouchure validée.
Les autres conserveront le profil `generic`.

## Validation

- syntaxe Node des deux fichiers JavaScript ;
- 44 identifiants uniques ;
- somme exhaustive de 1 399 cellules dans le rapport ;
- 44 libellés de composante dans le SVG ;
- fond Jaillot référencé sans duplication de l’image ;
- aucune modification de la grille canonique.

Le navigateur intégré refusant les URL de fichiers locaux, le rendu final du
SVG reste à contrôler visuellement depuis le poste de travail avant validation
des noms et embouchures.

## Composantes composites

Le contrôle visuel a montré que la connexité des cellules ne suffit pas à
définir un fleuve : plusieurs cours parallèles peuvent partager un hexagone à
la résolution OSCAR sans se croiser sur la carte. Neuf composantes sont déjà
signalées comme composites dans la configuration : `F-8_87`, `F-12_4`,
`F-17_35`, `F-42_14`, `F-66_32`, `F-77_56`, `F-95_143`, `F-98_73` et
`F-106_164`.

Le générateur ne leur attribue plus d’embouchure automatique. Le rapport les
classe `compound`, conserve leurs contacts maritimes comme simples candidats
de sortie et le SVG les marque d’un astérisque avec un contour discontinu.

Conséquence pour la suite : une cellule partagée devra accepter plusieurs
courants fluviaux associés chacun à un identifiant de tracé. Le pilote devra
conserver cet identifiant dans son état de parcours afin de ne pas passer d’un
fleuve parallèle à l’autre dans un hexagone commun.

## Premier champ vectoriel expérimental

`generate-fluvial-currents.js` génère désormais un champ de distance sur le
graphe hexagonal depuis les sorties proposées. Chaque vecteur vise un voisin
plus proche de l’embouchure et sa vitesse générique progresse de `0,6 nd` en
amont à `0,9 nd` vers l’aval. Les composantes composites utilisent plusieurs
sorties espacées et des identifiants de tracé suffixés `A`, `B`, etc. Les
cellules à égalité entre deux champs conservent plusieurs variantes dans le
tableau `fluvialCurrents`.

Après simulation, le champ expérimental a été écrit dans la grille canonique,
préalablement sauvegardée par Ronan :

- 1 394 cellules renseignées sur 1 399 cellules fluviales ;
- 1 434 vecteurs générés ;
- 40 cellules contenant plusieurs variantes ;
- aucun vecteur hors d’une cellule de nature fluviale ;
- aucune incohérence entre composantes et vitesse déclarée ;
- 4 ruptures angulaires supérieures à 100° consignées dans le rapport ;
- 5 cellules sans vecteur, dont les 4 composantes d’un seul hexagone ;
- `F-17_35` et `F-106_164` encore insuffisamment séparées malgré leur statut
  composite.

Le SVG `fluvial-currents-preview.svg` doit maintenant servir à juger si les
corrections manuelles restent raisonnables. Le générateur préserve les futurs
vecteurs manuels dont la source diffère de `fluvial-generator`.

## Intégration dans Zone Editor

Océanographie reconnaît maintenant `fluvialCurrents` comme troisième famille
de courants, indépendante du courant principal et de `coastal` :

- une flèche verte par tracé fluvial et une bordure intérieure verte ;
- filtre « Fluvial » indépendant dans la section Courants ;
- badge et détail de chaque `riverId`, vitesse et direction dans la fiche ;
- formulaire multi-tracés permettant modification, suppression et ajout ;
- source générée préservée sur les lignes inchangées, source `manual` appliquée
  aux vecteurs effectivement modifiés ;
- identifiant obligatoire et unique dans une cellule ;
- blocage si la nature résultante de la cellule ne comprend pas `fluviale` ;
- copie des courants fluviaux entre cellules fluviales, avec suppression
  préventive lors d’un collage vers une cellule non fluviale.

Contrôle dans Zone Editor servi localement : 1 434 flèches sur 1 394 cellules,
filtre Fluvial ramenant exactement 1 394 cellules, édition d’une vitesse puis
ajout d’un deuxième tracé dans une cellule partagée, et aucune erreur console.

### Correction de l’édition fluviale par lot

La première version considérait le tableau `fluvialCurrents` comme une valeur
indivisible : renommer un `riverId` depuis une sélection multiple recopiait
aussi la vitesse et la direction de la cellule de référence sur toutes les
autres.

L’application fonctionne désormais par opération et par champ : renommage,
vitesse, direction, ajout ou suppression. Pour chaque cellule cible, le courant
est retrouvé par son ancien `riverId` et seuls les champs réellement touchés
sont remplacés. Les autres composantes et métadonnées restent propres à la
cellule.

Test local sur `10_89` et `10_90` : renommage commun de `F-8_87-A` sans modifier
leurs valeurs respectives, restées à `0,82 nd / 0°` et `0,90 nd / 30°`. Aucune
erreur console.

## Convention provisoire pour les noms et les jonctions

Pendant l’identification des emprises fluviales, les noms visibles sur la carte
doivent être conservés tels quels. Il ne faut donc pas uniformiser pour le
moment les variantes `R`, `R.`, `R nom-du-fleuve` ou `nom-du-fleuve R`. Elles
peuvent refléter la langue du territoire — notamment *Rio* ou *River* — et
constituent une information cartographique à préserver. La rationalisation des
noms et la séparation éventuelle entre identifiant technique et libellé
historique seront traitées dans un second temps.

Deux courants présents dans un même hexagone ne sont pas nécessairement
connectés. Une fois toutes les emprises identifiées et les cours distingués,
Zone Editor devra proposer une information explicite par paire de cours :
`jonction` ou `cours séparés`. En cas de jonction, la relation devra aussi
indiquer le cours affluent et le cours récepteur. Cette topologie ne doit pas
être encodée dans le nom du cours d’eau.

Audit de l’isthme après correction manuelle : `R. Quemades` et `Pacific_1` sont
confirmés comme petites rivières d’un seul hexagone ; la rupture angulaire du
lac Nicaragua entre `92_62` et `93_61` suit bien la rive ; le coude entre
`89_59` et `89_60` a été légèrement lissé.
