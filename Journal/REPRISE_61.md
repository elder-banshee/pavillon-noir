# REPRISE_61 - Amelioration de gen_oscar_grid

## Contexte

Reprise apres `REPRISE_60.md`, avec priorite donnee a l'amelioration de :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py
```

Le pipeline actif reste celui de la V4 : quiver Copernicus, domaines
`oceanBounds`, materialisation 50 px, recentrage par bbox de preview, filtres
rognage/oceanBounds, puis export de `js/oscar-grid.js`.

## Travaux effectues

### Lecture SVG plus robuste

`parse_transform()` accepte maintenant aussi :

```text
rotate(...)
skewX(...)
skewY(...)
```

en plus de `matrix`, `translate` et `scale`. L'objectif est de rendre le
generateur moins fragile si Inkscape/Illustrator produit ces transformations
dans un SVG intermediaire.

### Fusion explicite des collisions de cellules

Avant cette passe, si deux candidates recentrees tombaient dans la meme cellule
finale, la derniere ecrasait silencieusement la precedente dans `cells`.

Ajout de :

```text
fusionner_cellules(entries)
```

Le generateur regroupe maintenant les candidates par cle de cellule, puis les
fusionne par moyenne vectorielle ponderee par `sources`. Les collisions sont
diagnostiquees dans le bloc :

```js
domains._collisions
```

Etat observe sur la generation courante :

```text
duplicateCandidates=0
finalCells=10387
acceptedCandidates=10387
```

La passe ne change donc pas le champ numerique actuel ; elle ajoute surtout un
garde-fou pour les futurs recalages/deformations.

### Diagnostics console

Le titre console annonce maintenant `Copernicus quiver v4` au lieu de `v3`.
Les blocs de statistiques techniques (`_alignment`, `_crop`, `_oceanBounds`,
`_collisions`) sont affiches avec leurs champs utiles au lieu d'apparaitre comme
des domaines oceanographiques a `0 cellules`.

## Generation relancee

Commande :

```powershell
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
```

Resultat :

```text
10510 fleches lues
10387 cellules exportees, 10510 vecteurs sources, 0 fleches ignorees
pacific: 1967 cellules, 2273 sources
atlantic: 8420 cellules, 7282 sources
_alignment.offsetPx=[7.814, 0.252]
_crop.cropped=0
_oceanBounds.cropped=152
_collisions.duplicateCandidates=0
```

Fichiers regenerees :

```text
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver-materialise.svg
```

## Etat du depot

Dans le depot Git, seul `js/oscar-grid.js` apparait modifie apres generation.
La difference visible est l'ajout du bloc metadata `domains._collisions`.

Le script `gen_oscar_grid.py` est hors depot, dans `Accessoires site pavillon
noir`.

## Validations

Depuis `C:\AI\Site Pavillon Noir` :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py"
```

Depuis `C:\AI\Site Pavillon Noir\pavillon-noir` :

```powershell
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
git diff --check
node .\tools\audit-text-integrity.js
```

Resultat :

```text
Syntaxe OK
git diff --check OK
Audit texte : 0 erreur, 61 avertissements preexistants
```

## Suite conseillee

La prochaine amelioration utile de `gen_oscar_grid.py` serait un diagnostic de
couverture plus visuel : exporter dans le SVG preview les cellules filtrees par
`oceanBounds`/rognage et les eventuelles collisions, avec des couleurs separees.
Cela aiderait a inspecter les zones perdues sans lire uniquement les compteurs.

## Recalage intention - nouveau script mesh

Apres discussion, la V4 de `gen_oscar_grid.py` est consideree comme trop
destructrice structurellement : elle remplit une grille Jaillot au lieu de
preserver la topologie du champ Copernicus. La piste active devient donc un
nouveau script propre, separe des prototypes precedents :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py
```

Principe retenu :

- garder le maillage source Copernicus comme verite topologique ;
- conserver les quads comme modele de controle/preview ;
- trianguler seulement si necessaire pour les calculs d'interpolation ;
- produire davantage d'exports de monitoring avant toute rasterisation
  `oscar-grid.js`.

## Classification initiale des blocs Copernicus

L'utilisateur a dessine deux blocs dans :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver-BLOCS.svg
```

Observation importante : Illustrator a modifie l'export. Les fleches visibles y
sont devenues des triangles noirs, et les attributs `data-lat`, `data-u`,
`data-v`, `data-spd` ne sont plus presents. Le fichier `BLOCS` ne doit donc pas
servir de source de courant ; il sert seulement a lire les deux masques dessines.

La source de courant intacte reste :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver.svg
```

`gen_oscar_mesh.py` lit les fleches intactes dans ce fichier, puis applique les
deux masques `class="st2"` extraits du SVG `BLOCS`.

Exports generes :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-blocs-classification.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-blocs-classification.json
```

Generation initiale :

```text
10510 fleches intactes lues
pacific: 2410
atlantic: 8100
excluded: 0
ambiguous: 0
```

Les deux blocs couvrent actuellement toutes les fleches. C'est peut-etre voulu,
mais cela doit etre controle visuellement dans le SVG de classification :
l'absence de fleches exclues peut aussi indiquer que le grand bloc Atlantique
est plus englobant que prevu.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK.

### Critique utilisateur de la version bornee rigide

Controle utilisateur : la version `atlantic-bounded-conservative` reste trop
rigide. Elle deplace des sous-domaines comme des blocs, avec la meme brutalite
qu'avant mais a moindre echelle. Les compressions restent localisees et donc
artificielles.

Conclusion : ne plus privilegier les translations rigides par sous-domaine.
Il faut diffuser les deplacements sur la trame et les amortir via les voisines.

La sortie `atlantic-bounded-conservative` a ete deplacee dans
`Sources\Diagnostics` comme version depassee.

## 2026-07-02 - Atlantique lisse par diffusion sur voisines

Nouveau script :

```text
gen_oscar_atlantic_smooth.py
```

Principe :

- repartir de la projection bbox globale ;
- Atlantique seulement, Pacifique inchange ;
- aucune aspiration/containment force vers oceanBounds ;
- chaque noeud recoit une intention de deplacement issue de son sous-domaine ;
- le champ de deplacement est diffuse par iterations sur les 4 voisines de la
  grille ;
- le Golfe du Mexique devient une ancre douce a zero, pas une frontiere rigide ;
- les deplacements restent plafonnes.

Sorties candidates conservees en racine :

```text
Sources\courants-copernicus-jaillot-atlantic-smooth-cap70-soft.svg
Sources\courants-copernicus-jaillot-atlantic-smooth-cap70-soft-report.json
```

Parametres :

```text
maxExtremeShiftPx: 70
iterations: 360
smoothWeight: 1.8
minNodeDistancePx: 10
```

Resultat :

```text
pacific: inchange, actifs hors oceanBounds 749 -> 749
atlantic: actifs hors oceanBounds 1304 -> 1188
meanShiftPx: 36.52
maxShiftPx: 70.0
nearestActiveNodeDistancePx: 21.72
maxNeighborDisplacementDeltaPx: 36.98
minDistanceConstraintOk: true
```

Une premiere variante lissee `minDist=9.56 px` a ete invalidee et rangee dans
`Sources\Sepulcre`. Une variante `cap70` simple, valide mais moins amortie, a
ete rangee dans `Sources\Diagnostics` comme alternative.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_atlantic_smooth.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_atlantic_smooth.py"
```

Resultat : OK.

### Invalidation utilisateur

Controle visuel utilisateur : rejet complet de cette approche.

Raisons :

- le Golfe du Mexique, auparavant juge bon a environ 90-95%, est detruit ;
- le compteur `activeOutsideAfter=0` est un faux succes, obtenu en sacrifiant
  la geographie des courants ;
- il reste visuellement trop de fleches problematiques vers la Floride ;
- les deplacements extremes (`1933.65 px`) sont inacceptables ;
- contrainte utilisateur explicite a retenir pour la suite :
  - un ecart extreme devrait etre de l'ordre de `200 px` maximum, probablement
    moins ;
  - ces ecarts doivent rester rares ;
  - les compressions ne doivent pas rapprocher des noeuds a moins de `10 px`.

Sorties de cette tentative deplacees dans `Sources\Sepulcre` avec suffixe
`INVALIDE` :

```text
courants-copernicus-jaillot-anchor-warp-preview-INVALIDE.svg
courants-copernicus-jaillot-anchor-warp-report-INVALIDE.json
```

Conclusion : ne plus utiliser une correction par centroide + containment global.
Cette methode optimise le mauvais indicateur (`hors oceanBounds`) au lieu de
preserver la geographie des courants.

## 2026-07-02 - Atlantique borne, sans containment

Nouvelle approche demandee : Atlantique seulement, Pacifique laisse de cote
jusqu'a nouvel ordre.

Nouveau script :

```text
gen_oscar_atlantic_bounded.py
```

Principe :

- repartir de `courants-copernicus-jaillot-bbox-preview.svg` / projection bbox
  globale ;
- ne pas utiliser de containment brutal ;
- ne jamais forcer un noeud actif a entrer dans `oceanBounds` ;
- verrouiller le Golfe du Mexique, juge deja bon a 90-95% ;
- appliquer uniquement des translations par sous-domaine Atlantique ;
- plafonner strictement les deplacements ;
- auditer la distance minimale entre noeuds actifs.

Candidate conservee en racine :

```text
Sources\courants-copernicus-jaillot-atlantic-bounded-conservative.svg
Sources\courants-copernicus-jaillot-atlantic-bounded-conservative-report.json
```

Parametres `conservative` :

```text
gulf_mexico: locked, appliedLength=0.0 px
caribbean: appliedDx=4.11, appliedDy=-20.26, appliedLength=20.67 px
bahamas_gulf_stream: appliedDx=57.33, appliedDy=40.17, appliedLength=70.0 px
atlantic: appliedDx=-10.41, appliedDy=-45.77, appliedLength=46.94 px
```

Resultat :

```text
pacific: inchangé, actifs hors oceanBounds 749 -> 749
atlantic: actifs hors oceanBounds 1304 -> 1190
maxShiftPx: 70.0
nearestActiveNodeDistancePx: 17.07
minDistanceConstraintOk: true
```

Presets testes puis invalides automatiquement car ils enfreignent la contrainte
de distance minimale de 10 px :

```text
medium: minDist=7.47 px
strong: minDist=9.44 px
```

Ces sorties ont ete rangees dans `Sources\Sepulcre` avec suffixe `INVALIDE`.
La sortie sans suffixe creee lors du premier lancement a aussi ete rangee dans
`Sources\Sepulcre` comme doublon.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_atlantic_bounded.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_atlantic_bounded.py" --preset conservative --output-svg "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-atlantic-bounded-conservative.svg" --output-json "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-atlantic-bounded-conservative-report.json"
```

Resultat : OK.

## 2026-07-02 - Plan manuel Golfe du Mexique

Fichier utilisateur recu :

```text
Sources\gulf_mexico_plan.svg
```

Verification :

- `viewBox="0 0 8500 5320"` : le fichier est exploitable et aligne sur le
  referentiel des previews precedentes ;
- groupe manuel detecte :
  `Blocs_fleches_a_decaler_-_Golfe_Mexique` (accents conserves en UTF-8 dans
  le JSON) ;
- intention utilisateur a conserver : les zones vides au nord et nord-est du
  Golfe doivent rester vides autant que possible, car elles correspondent a la
  zone ambigue `vide + cote`.

Nouveau convertisseur ajoute :

```text
gen_oscar_manual_plan.py
```

Sorties produites :

```text
Sources\gulf_mexico_plan.json
Sources\courants-copernicus-jaillot-bbox-reference-gulf-plan.svg
```

Le JSON extrait 7 consignes :

- 6 zones `move` :
  - `north_west` x2 ;
  - `north_east` x1 ;
  - `east` x2 ;
  - `north` x1 ;
- 1 zone `keep` :
  - `laisser_dans_bloc_caribbean`.

Point technique important : les `bounds` des chemins SVG sont calculees avec
`svgpathtools.parse_path`, pas par extraction naive de nombres, afin de tenir
compte des commandes relatives dans les `d` SVG.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_manual_plan.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_manual_plan.py"
```

Resultat : OK, `Features: 7 {'move': 6, 'keep': 1}`.

## 2026-07-02 - Rattrapage automatique Atlantique par ancres de sous-domaines

Constat utilisateur : l'annotation manuelle fine devient trop lente et risque
d'etre moins efficace qu'une deformation manuelle. Decision : automatiser une
passe de rattrapage en utilisant les sous-domaines deja definis comme ancres,
et laisser le Pacifique de cote pour une passe independante.

Nouveau script :

```text
gen_oscar_anchor_warp.py
```

Principe v1 :

1. repartir de la projection bbox globale, qui reste le meilleur temoin visuel ;
2. sur l'Atlantique uniquement, assigner chaque noeud a un sous-domaine source
   Copernicus (`gulf_mexico`, `caribbean`, `bahamas_gulf_stream`, `atlantic`) ;
3. calculer, pour chaque sous-domaine, le decalage entre le centroide Copernicus
   projete par bbox globale et le centroide Jaillot correspondant ;
4. appliquer une correction douce (`anchorStrength=0.42`, ou
   `outsideAnchorStrength=0.68` si le noeud actif etait deja hors oceanBounds) ;
5. ramener les noeuds actifs encore hors oceanBounds vers l'interieur ;
6. ne pas forcer les `virtual_land` dans oceanBounds.

Sorties :

```text
Sources\courants-copernicus-jaillot-anchor-warp-preview.svg
Sources\courants-copernicus-jaillot-anchor-warp-report.json
```

La preview contient aussi les overlays de sous-domaines Copernicus projetes et
Jaillot, pour controle visuel.

Resultats de la generation :

```text
pacific: actifs hors oceanBounds 749 -> 749, contenus=0, activeInsideAfter=70.06%
atlantic: actifs hors oceanBounds 1304 -> 0, contenus=1062, activeInsideAfter=100.0%
```

Deltas de centroide utilises :

```text
gulf_mexico: dx=161.43, dy=-256.99
caribbean: dx=11.76, dy=-57.89
bahamas_gulf_stream: dx=151.83, dy=106.37
atlantic: dx=-29.75, dy=-130.76
```

Point de vigilance : le deplacement d'ancrage moyen est raisonnable
(`77.34 px` sur l'Atlantique), mais le rattrapage interieur a un maximum eleve
(`1933.65 px`). Cette sortie doit donc etre controlee visuellement avant
d'etre consideree comme une nouvelle base.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_anchor_warp.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_anchor_warp.py"
```

Resultat : OK.

## Reference bbox globale avec sous-domaines

Demande utilisateur : repartir du bon temoin visuel,
`courants-copernicus-jaillot-bbox-preview.svg`, et y ajouter les sous-domaines
Jaillot puis Copernicus. Le Golfe du Mexique etant juge pratiquement parfait,
il doit servir d'ancre forte pour la suite ; il ne reste alors que 4
sous-domaines vraiment a traiter.

Ajout du generateur :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_bbox_reference.py
```

Il lit :

```text
Sources\courants-copernicus-jaillot-bbox-preview.svg
Sources\courants-copernicus-subdomains-selection.json
Sources\courants-copernicus-jaillot-subdomains-selection.json
Sources\courants-copernicus-blocs-classification.json
```

et produit :

```text
Sources\courants-copernicus-jaillot-bbox-reference-subdomains.svg
```

Cette sortie conserve la bbox globale comme base, puis superpose deux familles
de calques :

```text
copernicus_subdomains_projected_overlay
jaillot_subdomains_overlay
```

Les sous-domaines Copernicus sont projetes dans le meme referentiel que la bbox
globale : `pacific` via la bbox Pacifique, et les 4 autres sous-domaines via la
bbox Atlantique globale. Les paths Copernicus sont en pointilles ; les paths
Jaillot sont en traits pleins colores. Le Golfe du Mexique Jaillot reste
affiche avec un trait plus fort et le libelle `GOLFE DU MEXIQUE - ANCRE`.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_bbox_reference.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_bbox_reference.py"
```

Resultat : OK.

## Reprise methode transposition Jaillot

Controle visuel utilisateur du premier warp Jaillot :

- `Sources\courants-copernicus-jaillot-warp-preview.svg` ne correspond pas meme
  approximativement aux courants attendus ;
- la methode `horizontal_scanline_bbox_v1` est donc invalidee comme piste
  principale ;
- cause probable : projection ligne par ligne, sans coherence 2D globale de la
  nappe.

Nouvelle base de travail ajoutee dans `gen_oscar_mesh.py` :

```text
Sources\courants-copernicus-grille-complete.svg
Sources\courants-copernicus-jaillot-bbox-preview.svg
```

Principe :

- construire pour chaque bloc une grille Copernicus rectangulaire complete a
  partir de la bbox row/col du bloc repare ;
- conserver les noeuds natifs et les noeuds `synthetic_calm` ;
- completer tous les trous par des noeuds `virtual_land` sans courant ;
- projeter cette grille complete vers la bbox Jaillot correspondante par
  transformation lineaire simple, sans deformation intelligente.

Objectif de ces exports :

- verifier orientation, echelle, densite et correspondance row/col ;
- disposer d'un etat zero non destructeur avant deformation contrainte ;
- preparer une deformation de maillage type Laplacian/ARAP plutot qu'une
  simulation manuelle de poussee locale.

Generation validee :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultats :

```text
grille complete pacific : 3690 noeuds, 3564 quads, 1188 terres virtuelles
grille complete atlantic: 15714 noeuds, 15456 quads, 5129 terres virtuelles

bbox pacific : 3690 noeuds, 3564 quads, 1929 hors oceanBounds
bbox atlantic: 15714 noeuds, 15456 quads, 5430 hors oceanBounds
```

Les grands nombres de noeuds hors `oceanBounds` dans la projection bbox sont
attendus : ce diagnostic projette un rectangle complet dans une forme Jaillot
irreguliere. Il ne faut pas l'interpreter comme une tentative de resultat final,
mais comme une verification de la nappe avant deformation.

Precision ajoutee ensuite : le compteur brut hors `oceanBounds` melange les
noeuds actifs et les noeuds `virtual_land`. `gen_oscar_mesh.py` separe
maintenant ces familles dans `jaillotBboxProjection`.

Ratios actuels :

```text
bbox pacific:
  actifs dedans: 1753 / 2502 = 70.06 %
  terres virtuelles dehors: 1180 / 1188 = 99.33 %

bbox atlantic:
  actifs dedans: 9281 / 10585 = 87.68 %
  terres virtuelles dehors: 4126 / 5129 = 80.44 %
```

Lecture : cote Pacifique, la projection bbox place deja presque toutes les
terres virtuelles hors mer Jaillot. Cote Atlantique, environ un cinquieme des
terres virtuelles reste dans `oceanBounds`, ce qui signale une zone de travail
utile pour la deformation contrainte.

## Sous-domaines Copernicus source

L'utilisateur a produit :

```text
Sources\courants-copernicus-source-bords-domaines-calm.svg
```

Illustrator a de nouveau rogne le document :

```text
viewBox domaines : 0 0 8451 5252.1
viewBox source   : 0 0 8500 5320
```

Le fichier reste exploitable pour les polygones, car les paths portent une
translation uniforme `translate(-24.5 -23.4)` et leurs coordonnees peuvent etre
remises dans le referentiel source. Le fichier ne contient plus les noeuds
`copernicus_q_*`, donc le controle se fait en superposant les domaines extraits
aux noeuds du SVG source original.

Script ajoute :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomains.py
```

Exports produits :

```text
Sources\courants-copernicus-subdomains-selection.json
Sources\courants-copernicus-subdomains-preview.svg
```

Domaines lus :

```text
pacific              : 2 traces, 2239 noeuds
gulf_mexico          : 1 trace, 1256 noeuds
caribbean            : 1 trace, 2621 noeuds
bahamas_gulf_stream  : 1 trace, 1186 noeuds
atlantic             : 1 trace, 2599 noeuds
```

Distribution globale :

```text
source nodes     : 10510
unassignedNodes  : 609
overlappingNodes : 0
```

Lecture : le decoupage ne cree pas de recouvrement entre sous-domaines. Les 609
noeuds sans domaine doivent etre controles visuellement dans
`courants-copernicus-subdomains-preview.svg` : ils peuvent correspondre a des
marges volontaires ou a des interstices a corriger.

### Nouvelle version subdomains propre

L'utilisateur a produit une nouvelle version :

```text
Sources\courants-copernicus-source-bords-subdomains.svg
```

Cette fois, le `viewBox` est correct :

```text
viewBox domaines : 0 0 8500 5320
viewBox source   : 0 0 8500 5320
```

Le script `gen_oscar_subdomains.py` accepte aussi la coquille
`bahamas_gulf_sream` comme alias de `bahamas_gulf_stream`.

Generation relancee :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomains.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomains.py" --subdomains-svg "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-source-bords-subdomains.svg"
```

Resultats :

```text
pacific              : 2047 noeuds
gulf_mexico          : 1078 noeuds
caribbean            : 2409 noeuds
bahamas_gulf_stream  : 1090 noeuds
atlantic             : 2381 noeuds

source nodes     : 10510
unassignedNodes  : 1505
overlappingNodes : 0
```

La preview `courants-copernicus-subdomains-preview.svg` affiche maintenant les
noeuds sans sous-domaine en rouge, afin de verifier s'ils correspondent bien aux
couches separees attendues : zones calmes, ambigues, lacs/rivieres ou terre.

### Dernier test subdomains

L'utilisateur a remplace `courants-copernicus-source-bords-subdomains.svg` par
une nouvelle version. Test relance :

```powershell
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomains.py" --subdomains-svg "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-source-bords-subdomains.svg"
```

Le fichier reste propre cote document :

```text
viewBox domaines : 0 0 8500 5320
viewBox source   : 0 0 8500 5320
```

Resultats :

```text
pacific              : 2381 noeuds
gulf_mexico          : 1280 noeuds
caribbean            : 2758 noeuds
bahamas_gulf_stream  : 1368 noeuds
atlantic             : 2768 noeuds

source nodes     : 10510
unassignedNodes  : 177
overlappingNodes : 222
```

Details des recouvrements ajoutes dans
`courants-copernicus-subdomains-selection.json` :

```text
atlantic + bahamas_gulf_stream : 164
atlantic + caribbean           : 38
caribbean + bahamas_gulf_stream: 7
caribbean + gulf_mexico        : 7
bahamas_gulf_stream + gulf_mexico: 6
```

Lecture : le fichier est sain geometriquement, mais il reste deux diagnostics a
valider visuellement dans `courants-copernicus-subdomains-preview.svg` :

- les 177 noeuds rouges sans sous-domaine ;
- les 222 noeuds orange en recouvrement, principalement sur la couture
  `atlantic + bahamas_gulf_stream`.

## Sous-domaines Jaillot oceanBounds

L'utilisateur a produit :

```text
Sources\courants-copernicus-jaillot-oceanbounds-subdomains.svg
```

Le fichier contient 5 paths et un `viewBox` correct :

```text
viewBox : 0 0 8500 5320
```

Particularites lues :

- `ocean_Bounds_Pacific` est normalise en `pacific` ;
- `bahamas_gulf_steam` est normalise en `bahamas_gulf_stream`.

Script ajoute :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_jaillot_subdomains.py
```

Exports produits :

```text
Sources\courants-copernicus-jaillot-subdomains-selection.json
Sources\courants-copernicus-jaillot-subdomains-preview.svg
```

Generation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_jaillot_subdomains.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_jaillot_subdomains.py"
```

Resultats :

```text
pacific              : area=5250352.56, bounds=[171.92, 2536.77, 4247.74, 5022.93]
gulf_mexico          : area=3881517.58, bounds=[1111.48, 652.21, 3575.66, 2927.75]
caribbean            : area=6400637.47, bounds=[2076.86, 2225.02, 7360.16, 4405.34]
bahamas_gulf_stream  : area=2535681.10, bounds=[3557.41, 377.57, 6688.19, 2822.12]
atlantic             : area=8852779.28, bounds=[4222.70, 401.77, 8351.36, 4744.62]
ignoredPathIds       : []
```

Prochaine etape logique : generer une preview bbox par paire de sous-domaines
Copernicus -> Jaillot, en utilisant les JSON :

```text
Sources\courants-copernicus-subdomains-selection.json
Sources\courants-copernicus-jaillot-subdomains-selection.json
```

## Bords source et cibles Jaillot

Avant de lancer la deformation Copernicus -> Jaillot, `gen_oscar_mesh.py`
exporte maintenant deux controles supplementaires.

Nouveaux exports :

```text
Sources\courants-copernicus-source-bords.svg
Sources\courants-copernicus-jaillot-oceanbounds.svg
```

`courants-copernicus-source-bords.svg` affiche :

- les quads source en fond discret ;
- les aretes externes du maillage source ;
- les noeuds de bord ;
- les noeuds isoles, visibles separement.

`courants-copernicus-jaillot-oceanbounds.svg` affiche les deux chemins cibles
exacts lus depuis :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Sources SVG\oceanBounds-01.svg
```

IDs cibles lus :

```text
pacific  : ocean_Bounds_Pacific
atlantic : oceanBounds_atlantic
```

Generation actuelle :

```text
pacific : 2410 noeuds, 2148 quads, 496 aretes de bord, 15 isoles
atlantic: 8100 noeuds, 6918 quads, 2094 aretes de bord, 152 isoles

cible pacific  bounds=[171.92, 2536.77, 4247.74, 5022.93]
cible atlantic bounds=[1111.51, 377.52, 8351.36, 4744.55]
```

Le resume JSON `courants-copernicus-blocs-classification.json` contient aussi
ces compteurs de bords et le bloc `targetOceanBounds`.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK.

Prochaine etape sensible : construire la premiere correspondance bord-source
vers bord-cible par domaine, puis generer une preview deformee sans encore
exporter `oscar-grid.js`.

## Annotations humaines mer calme / lacs / zones ambigues

L'utilisateur a annote une copie du SVG de bords source :

```text
Sources\courants-copernicus-source-bords-calm_lakes_ambiguous.svg
```

Code couleur utilise :

```text
vert   : mer calme certaine
orange : lacs / fleuves / zones a desactiver
violet : zones ambigues, surtout calme proche des cotes
```

Pour eviter d'alourdir `gen_oscar_mesh.py` avec les particularites Illustrator,
un script separe a ete ajoute :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py
```

Ce script lit les classes CSS Illustrator et convertit les formes annotees en
`pathD` normalises. Il gere notamment les `ellipse`, converties en chemins SVG.

Exports produits :

```text
Sources\courants-copernicus-annotations.json
Sources\courants-copernicus-annotations-paths.svg
```

Comptes actuels :

```text
calm        : 12
lakes_rivers: 4
ambiguous   : 2
```

Les styles Illustrator detectes sont :

```text
#00AA00 -> calm
#FF6600 -> lakes_rivers
#9933FF -> ambiguous
```

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py"
```

Resultat : OK.

Prochaine etape : faire consommer `courants-copernicus-annotations.json` par
`gen_oscar_mesh.py` pour produire une preview `source-reparee`, sans encore
deformer vers Jaillot.

## Preview source reparee

`gen_oscar_mesh.py` consomme maintenant :

```text
Sources\courants-copernicus-annotations.json
```

Avant consommation par le mesh, `gen_oscar_annotations.py` renormalise les
annotations Illustrator vers le referentiel source `8500 x 5320`. C'est
necessaire car Illustrator exporte le SVG annote avec un `viewBox` de
`0 0 8192 5320`, donc une largeur contractee.

Nouvel export de monitoring :

```text
Sources\courants-copernicus-source-reparee.svg
```

Regles appliquees :

- `calm` / vert : ajout de noeuds synthetiques `u=0`, `v=0`, `spd=0` sur les
  positions de grille manquantes ;
- `lakes_rivers` / orange : desactivation des noeuds natifs tombant dans ces
  zones ;
- `ambiguous` / violet : affichage seulement, aucun effet automatique.

Generation actuelle :

```text
repair: 2517 calmes synthetiques, 6 noeuds desactives, 2 zones ambigues sans effet

mesh original pacific : 2410 noeuds, 2148 quads, 496 aretes de bord, 15 isoles
mesh repare  pacific : 2500 noeuds, 2325 quads, 318 aretes de bord, 15 isoles

mesh original atlantic: 8100 noeuds, 6918 quads, 2094 aretes de bord, 152 isoles
mesh repare  atlantic: 10521 noeuds, 9875 quads, 1212 aretes de bord, 60 isoles
```

Le resume JSON reste compact : il garde les compteurs, les ids des noeuds
desactives, et seulement un echantillon des ids synthetiques.

Validations :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK.

### Correction export Illustrator annote

Une premiere version annotee avait un `viewBox` rogne (`8192 x 5320`) et a
produit une preview reparee decalee. Cette generation doit etre consideree
invalide.

L'utilisateur a reexporte :

```text
Sources\courants-copernicus-source-bords-calm_lakes_ambiguous.svg
```

Verification de la nouvelle version :

```text
viewBox source : 0 0 8500 5320
viewBox annote : 0 0 8500 5320

noeuds communs : 10469
ecart natifs/bords/isoles : 0 px
polygones de quads communs : 9066
```

Les 41 ids absents de l'export annote sont uniquement des doublons de bord
`boundary_*`, pas des noeuds natifs `copernicus_q_*`.

`gen_oscar_annotations.py` refuse maintenant par defaut un `viewBox` inattendu,
afin d'eviter une normalisation silencieuse erronee. L'option
`--allow-viewbox-normalization` existe seulement pour diagnostic explicite.

Nouvelle conversion annotee :

```text
calm        : 12
lakes_rivers: 4
ambiguous   : 3
```

Nouvelle generation reparee :

```text
repair: 2588 calmes synthetiques, 11 noeuds desactives, 3 zones ambigues sans effet

mesh original pacific : 2410 noeuds, 2148 quads, 496 aretes de bord, 15 isoles
mesh repare  pacific : 2502 noeuds, 2331 quads, 312 aretes de bord, 14 isoles

mesh original atlantic: 8100 noeuds, 6918 quads, 2094 aretes de bord, 152 isoles
mesh repare  atlantic: 10585 noeuds, 9978 quads, 1174 aretes de bord, 39 isoles
```

Prochaine etape conseillee : controle visuel de la nouvelle
`courants-copernicus-source-reparee.svg`, puis seulement ensuite premiere
correspondance bord-source -> bord-cible Jaillot.

## Premiere transposition Jaillot diagnostic

`gen_oscar_mesh.py` produit maintenant un premier export de deformation vers
les deux `oceanBounds` Jaillot :

```text
Sources\courants-copernicus-jaillot-warp-preview.svg
```

Important : cet export est un diagnostic visuel, pas encore un export moteur.
Il utilise une methode simple :

```text
horizontal_scanline_bbox_v1
```

Principe :

- partir du maillage source repare ;
- conserver le rang vertical relatif du noeud dans son bloc source ;
- couper le `oceanBounds` cible par une horizontale au meme rang relatif ;
- repartir horizontalement les colonnes source dans la plus grande coupe
  disponible ;
- afficher les quads, les noeuds, les noeuds calmes synthetiques et des fleches
  colorees au point transpose.

Les fleches gardent pour l'instant la direction Copernicus reportee au point
Jaillot ; elles ne pretendent pas encore appliquer une jacobienne locale fine de
la deformation.

Compteurs actuels :

```text
warp pacific : 2502 noeuds, 2331 quads, 22 hors cible, 0 scanlines fallback
warp atlantic: 10585 noeuds, 9978 quads, 61 hors cible, 1 scanline fallback
```

Le cache des scanlines a ete ajoute : la generation complete est repassee de
plus d'une minute a quelques secondes.

Bloc JSON ajoute :

```text
jaillotWarp.method = horizontal_scanline_bbox_v1
jaillotWarp.domains.*.outsideAfterWarp
jaillotWarp.domains.*.fallbackScanlines
jaillotWarp.domains.*.fallbackNodes
jaillotWarp.domains.*.cachedScanlines
```

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK.

Prochaine etape : controle visuel de
`courants-copernicus-jaillot-warp-preview.svg`. Les 83 noeuds hors cible au
total indiquent que la methode est acceptable comme premier diagnostic, mais pas
encore suffisante pour generer `oscar-grid.js` sans inspection.

## Menage des artefacts OSCAR

Apres validation visuelle utilisateur de la classification :

```text
pacific: 2410
atlantic: 8100
excluded: 0
ambiguous: 0
```

`gen_oscar_mesh.py` exporte maintenant un etat compact autonome :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-blocs-selection.json
```

Ce fichier contient les deux chemins SVG de blocs et les ids de fleches classees.
Le script sait repartir de ce JSON si `courants-copernicus-quiver-BLOCS.svg`
n'est plus dans `Sources`.

Sources actives conservees :

```text
Sources\cmems_mod_glo_phy_my_0.083deg-climatology_P1M-m_1782715143527.nc
Sources\courants-copernicus-quiver.svg
Sources\courants-copernicus-blocs-classification.svg
Sources\courants-copernicus-blocs-classification.json
Sources\courants-copernicus-blocs-selection.json
```

Scripts actifs conserves au premier niveau :

```text
gen_oscar_data.py
gen_oscar_mesh.py
```

Fichiers de fallback ranges ici :

```text
Backup\oscar-fallbacks-2026-06-30\courants-copernicus-quiver-BLOCS.svg
Backup\oscar-fallbacks-2026-06-30\gen_oscar_grid.py
```

Le SVG `BLOCS` est conserve comme saisie humaine de secours, mais le pipeline
actif utilise maintenant le JSON de selection valide.

Artefacts/prototypes OSCAR invalides ranges ici :

```text
Archives\oscar-invalides-2026-06-30\anchors.json
Archives\oscar-invalides-2026-06-30\courants-copernicus-centerlines-from-grid.svg
Archives\oscar-invalides-2026-06-30\courants-copernicus-quiver-materialise.svg
Archives\oscar-invalides-2026-06-30\courants-oscar.svg
Archives\oscar-invalides-2026-06-30\gen_oscar_centerlines.py
Archives\oscar-invalides-2026-06-30\oscar_to_sea_data.py
Archives\oscar-invalides-2026-06-30\overlay-maritime-quivers.svg
Archives\oscar-invalides-2026-06-30\sea-data-oscar.js
```

Validation apres rangement :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK, reprise depuis `courants-copernicus-blocs-selection.json`.

## Topologie source et previews separees

`gen_oscar_mesh.py` a ete etendu pour stabiliser le referentiel source avant
toute deformation vers Jaillot.

Nouveaux exports de monitoring :

```text
Sources\courants-copernicus-blocs-structure.svg
Sources\courants-copernicus-blocs-courants.svg
```

`courants-copernicus-blocs-structure.svg` affiche :

- les deux blocs de selection ;
- les noeuds source ;
- les quads reconstruits entre voisins immediats ;
- les indices `row` / `col` en attributs sur les noeuds.

`courants-copernicus-blocs-courants.svg` affiche :

- les deux blocs de selection ;
- les courants avec longues fleches colorees a longueur variable ;
- un point discret au noeud source.

Le resume JSON `courants-copernicus-blocs-classification.json` contient
maintenant aussi la topologie source.

Generation actuelle :

```text
grille globale : 170 colonnes x 106 lignes
pas median X : 50 px
pas median Y : 50 px
pacific : 2410 noeuds, 2148 quads
atlantic : 8100 noeuds, 6918 quads
excluded : 0
ambiguous : 0
```

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py"
```

Resultat : OK.

## Projection bbox par sous-domaines Jaillot

Apres creation et validation visuelle des sous-domaines Copernicus puis
Jaillot, ajout d'un diagnostic de transposition directe :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox.py
```

Le script projette chaque fleche Copernicus dans la bbox du sous-domaine
Jaillot homologue, sans deformation de maillage. Cette sortie est volontairement
un controle d'echelle/orientation/coutures, pas encore une version exploitable
pour `oscar-grid.js`.

Entrees :

```text
Sources\courants-copernicus-quiver.svg
Sources\courants-copernicus-subdomains-selection.json
Sources\courants-copernicus-jaillot-subdomains-selection.json
```

Sorties :

```text
Sources\courants-copernicus-jaillot-subdomains-bbox-preview.svg
Sources\courants-copernicus-jaillot-subdomains-bbox-report.json
```

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox.py"
```

Resultat : OK.

Compteurs :

```text
fleches lues : 10510
pacific : 2381 projetees, 727 hors cible (30.53%)
gulf_mexico : 1280 projetees, 131 hors cible (10.23%)
caribbean : 2751 projetees, 516 hors cible (18.76%)
bahamas_gulf_stream : 1355 projetees, 508 hors cible (37.49%)
atlantic : 2566 projetees, 520 hors cible (20.27%)
unassigned : 177
seams : 222
```

Paires de coutures :

```text
bahamas_gulf_stream + atlantic : 164
caribbean + atlantic : 38
caribbean + bahamas_gulf_stream : 7
gulf_mexico + caribbean : 7
gulf_mexico + bahamas_gulf_stream : 6
```

Interpretation provisoire :

- les 177 non assignes restent attendus a ce stade, a rattacher ensuite par les
  couches calm/lakes/ambiguous/land ;
- les 222 noeuds de couture ne sont pas une erreur, mais doivent etre traites
  comme des noeuds partages ou des contraintes de bord ;
- les taux hors cible eleves, surtout Pacifique et Bahamas/Gulf Stream,
  confirment que la bbox directe est seulement une etape de controle avant la
  deformation elastique du maillage.

## Calibration manuelle des bbox par sous-domaines

Retour visuel utilisateur sur `courants-copernicus-jaillot-subdomains-bbox-preview.svg` :

- la fenetre Copernicus semble globalement decalee vers l'ouest ;
- le decalage augmente progressivement d'ouest en est : environ 2 noeuds trop
  a l'ouest apres le golfe du Mexique, 5-6 vers la Floride, 9-10 vers le
  Suriname ;
- les Grandes Antilles de Jaillot sont trop agrandies pour les trous Copernicus ;
- l'Atlantique peut probablement perdre 5 a 10 colonnes a droite ;
- le Pacifique peut perdre davantage, notamment environ 15 colonnes a gauche et
  10 lignes en bas, puis etre remis a l'echelle.

`gen_oscar_subdomain_bbox.py` accepte maintenant une calibration JSON :

```text
--calibration-json Sources\courants-copernicus-jaillot-subdomains-calibration-draftXX.json
```

Parametres supportes par domaine :

```text
sourceCropCells.left/right/top/bottom
targetOffsetPx.x/y
targetScale.x/y
targetPadPx.left/right/top/bottom
```

Point important corrige pendant l'iteration : un rognage source doit exclure
les noeuds hors fenetre, pas les compresser sur le bord par clamp. Les noeuds
exclus sont donc maintenant comptes en `croppedSourceNodes`.

Exports ajoutes :

```text
Sources\courants-copernicus-jaillot-subdomains-calibration-draft01.json
Sources\courants-copernicus-jaillot-subdomains-calibrated-draft01-preview.svg
Sources\courants-copernicus-jaillot-subdomains-calibrated-draft01-report.json
Sources\courants-copernicus-jaillot-subdomains-calibration-draft02.json
Sources\courants-copernicus-jaillot-subdomains-calibrated-draft02-preview.svg
Sources\courants-copernicus-jaillot-subdomains-calibrated-draft02-report.json
```

`draft01` testait rognages + translations/etirements cible ; elle est plus
agressive et augmente fortement les hors-cible sur plusieurs blocs. `draft02`
isole surtout le rognage source progressif :

```text
pacific : crop left 15, bottom 10
gulf_mexico : crop right 2
caribbean : crop right 4
bahamas_gulf_stream : crop right 6
atlantic : crop right 9
```

Compteurs `draft02` :

```text
pacific : 2381 source, 1246 cropped, 1135 projetes, 178 hors cible (15.68%)
gulf_mexico : 1280 source, 17 cropped, 1263 projetes, 136 hors cible (10.77%)
caribbean : 2751 source, 86 cropped, 2665 projetes, 452 hors cible (16.96%)
bahamas_gulf_stream : 1355 source, 62 cropped, 1293 projetes, 577 hors cible (44.62%)
atlantic : 2566 source, 560 cropped, 2006 projetes, 226 hors cible (11.27%)
```

Interpretation provisoire :

- `draft02` ameliore nettement l'Atlantique numeriquement par rapport a la bbox
  brute (20.27% -> 11.27% hors cible), mais retire beaucoup de noeuds ;
- le Pacifique a de meilleurs hors-cible projetes, mais le rognage est tres
  fort et doit etre juge visuellement ;
- Bahamas/Gulf Stream reste le bloc le moins resolu, ce qui confirme que la
  Floride et les Grandes Antilles demandent probablement une vraie deformation
  contrainte plutot qu'un simple recalage bbox.

## Rangement Sources OSCAR

Erreur de controle visuel identifiee par l'utilisateur : les observations de
decalage est/ouest concernaient en fait :

```text
Sources\courants-copernicus-jaillot-bbox-preview.svg
```

et non :

```text
Sources\courants-copernicus-jaillot-subdomains-bbox-preview.svg
```

Conclusion : la preview bbox globale reste le meilleur temoin visuel actuel,
tandis que les essais sous-domaines/calibration restent utiles mais ne doivent
plus encombrer la racine de `Sources`.

Rangement effectue :

```text
Sources\
  Diagnostics\
  Sépulcre\
```

Reste en racine de `Sources` :

```text
cmems_mod_glo_phy_my_0.083deg-climatology_P1M-m_1782715143527.nc
courants-copernicus-quiver.svg
courants-copernicus-blocs-selection.json
courants-copernicus-blocs-classification.json
courants-copernicus-annotations.json
courants-copernicus-source-bords.svg
courants-copernicus-source-bords-calm_lakes_ambiguous.svg
courants-copernicus-source-bords-subdomains.svg
courants-copernicus-subdomains-selection.json
courants-copernicus-jaillot-oceanbounds.svg
courants-copernicus-jaillot-oceanbounds-subdomains.svg
courants-copernicus-jaillot-subdomains-selection.json
courants-copernicus-jaillot-bbox-preview.svg
```

Deplace dans `Sources\Diagnostics` :

```text
courants-copernicus-blocs-courants.svg
courants-copernicus-blocs-structure.svg
courants-copernicus-grille-complete.svg
courants-copernicus-source-reparee.svg
courants-copernicus-subdomains-preview.svg
courants-copernicus-jaillot-subdomains-preview.svg
```

Deplace dans `Sources\Sépulcre` :

```text
courants-copernicus-annotations-paths.svg
courants-copernicus-blocs-classification.svg
courants-copernicus-source-bords-domaines.svg
courants-copernicus-jaillot-oceanbounds-domaines.svg
courants-copernicus-jaillot-warp-preview.svg
courants-copernicus-jaillot-subdomains-bbox-preview.svg
courants-copernicus-jaillot-subdomains-bbox-report.json
courants-copernicus-jaillot-subdomains-calibration-draft01.json
courants-copernicus-jaillot-subdomains-calibration-draft02.json
courants-copernicus-jaillot-subdomains-calibrated-draft01-preview.svg
courants-copernicus-jaillot-subdomains-calibrated-draft01-report.json
courants-copernicus-jaillot-subdomains-calibrated-draft02-preview.svg
courants-copernicus-jaillot-subdomains-calibrated-draft02-report.json
```

Pour que le rangement tienne lors des prochaines generations, les sorties par
defaut de previews ont ete ajustees :

- `gen_oscar_mesh.py` ecrit les previews de controle dans
  `Sources\Diagnostics`, sauf le warp invalide qui part dans
  `Sources\Sépulcre` ;
- `gen_oscar_annotations.py` ecrit `courants-copernicus-annotations-paths.svg`
  dans `Sources\Sépulcre` ;
- `gen_oscar_subdomains.py` et `gen_jaillot_subdomains.py` ecrivent leurs
  previews dans `Sources\Diagnostics` ;
- `gen_oscar_subdomain_bbox.py` ecrit par defaut sa preview et son rapport dans
  `Sources\Sépulcre`.

Validation :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_mesh.py" "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_annotations.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomains.py" "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_jaillot_subdomains.py" "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox.py"
```

Resultat : OK.
