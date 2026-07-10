# REPRISE_60 - Greffe OSCAR cellulaire dans Jaillot

## Contexte

Session consacree a la mise en place de la piste OSCAR/Copernicus validee apres
`REPRISE_59.md` et `chantier_oscar_grille.md`.

Decision importante prise avant codage : ne pas suivre la suppression large du
legacy maritime proposee dans la feuille de route initiale. Le systeme de
navigation actuel reste la base : A*, terres, hauts-fonds, vents, allures,
diagnostics et contrats publics sont conserves. Seule la source interne de
`courantEnPoint(point)` est remplacee par une grille OSCAR.

## Travaux effectues

### Generateurs OSCAR

Fichiers hors depot modifies/ajoutes :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py
```

`gen_oscar_data.py` ne depend plus de `anchors.json` et ne genere plus
directement `oscar-grid.js`. Il produit uniquement un SVG de streamlines OSCAR
en projection geographique lineaire lon/lat, sur canevas 8500x5320, sans
deformation Jaillot par ancres.

Correction importante pendant la session : les streamlines sont maintenant
bornees a l'emprise Copernicus avant conversion en pixels. Avant cette borne,
la grille contenait des cellules negatives ou hors carte.

`gen_oscar_grid.py` est nouveau. Il lit les paths `oscar_NNNN_u:..._v:..._spd:...`
du SVG, applique les transformations SVG simples (`matrix`, `translate`,
`scale`), echantillonne les lignes, puis exporte une grille cellulaire.

Format de sortie retenu :

```js
const OSCAR_GRID = {
  version: 1,
  cellSizePx: 50,
  vectorConvention: "xKnot positif vers est/droite, yKnot positif vers sud/bas",
  cells: {
    "42_31": { xKnot, yKnot, speedKnot, dirToDeg, maxSpeedKnot, sources }
  }
};
```

Les vecteurs `xKnot/yKnot` sont explicites pour eviter l'ambiguite
provenance/destination qui existait entre `sea-data.js` et les donnees OSCAR.
Les cellules combinent les lignes par moyenne vectorielle ponderee par la
vitesse, avec conservation de `maxSpeedKnot` pour diagnostic.

### Donnees generees

Fichier hors depot regenere :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-oscar.svg
```

Resultat :

```text
276 paths OSCAR generes
```

Fichier dans le depot modifie :

```text
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
```

Resultat :

```text
7329 cellules actives
cellules bornees : minX=0 maxX=169 minY=0 maxY=106
```

### Integration Jaillot

Fichiers modifies dans le depot :

```text
C:\AI\Site Pavillon Noir\pavillon-noir\carte.html
C:\AI\Site Pavillon Noir\pavillon-noir\tools\zone-editor.html
C:\AI\Site Pavillon Noir\pavillon-noir\js\navigation-jaillot.js
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
```

`carte.html` et `tools/zone-editor.html` chargent maintenant `oscar-grid.js`
avant `navigation-jaillot.js`.

Dans `navigation-jaillot.js`, ajout de :

```js
sourceOscarGrid()
oscarCellKey(point)
```

`courantEnPoint(point)` lit maintenant `OSCAR_GRID.cells[cellKey]` et retourne
un courant construit directement depuis `xKnot/yKnot`. Les alias legacy
`speedKnots`, `speedKmh`, `courants[]`, etc. restent presents pour ne pas casser
les affichages ou diagnostics existants.

Le systeme `SEA_CURRENTS` / `SEA_NAV_ZONES` n'a pas ete supprime. Il reste
disponible pour les overlays, le Zone Editor, les diagnostics et les contrats
publics existants.

## Etat du depot

Avant la session, le depot contenait deja :

```text
?? Archives/navigation-jaillot.js.old
```

Etat apres session :

```text
 M carte.html
 M js/navigation-jaillot.js
 M js/oscar-grid.js
 M tools/zone-editor.html
?? Archives/navigation-jaillot.js.old
```

## Validations lancees

Depuis `C:\AI\Site Pavillon Noir\pavillon-noir` :

```powershell
node --check .\js\navigation-jaillot.js
node --check .\js\oscar-grid.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
git diff --check
node .\tools\audit-text-integrity.js
```

Resultats :

```text
Syntaxe OK
git diff --check OK
Audit texte : 0 erreur, 61 avertissements preexistants
```

Les avertissements restants concernent des fichiers historiques en CRLF ou sans
newline final. Le nouvel `js/oscar-grid.js` n'est plus signale apres correction
des generateurs pour forcer les fins de ligne LF.

## Points ouverts

- Tester visuellement les routes sur la carte avec la grille non deformee.
- Deformer manuellement `courants-oscar.svg` dans Inkscape sur la carte Jaillot,
  puis relancer `gen_oscar_grid.py` pour produire la grille finale.
- Observer si la moyenne vectorielle par cellule donne des transitions assez
  lisibles ; ajouter un lissage 3x3 ou une interpolation plus douce seulement
  si les routes deviennent trop anguleuses.
- Decider plus tard si les anciens rubans `SEA_CURRENTS` peuvent etre retires
  du moteur, apres verification des overlays et du Zone Editor.

## Recalage v3 - domaines oceaniques

Decision prise apres discussion : la deformation manuelle du quiver reste une
solution de secours, mais la piste principale devient un remplissage de donnees
materialise par domaines oceaniques.

Sources cible :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Sources SVG\oceanBounds-01.svg
```

Le fichier contient deux paths exploitables :

```text
ocean_Bounds_Pacific
oceanBounds_atlantic
```

Principe retenu :

- les quivers Copernicus restent la source physique du calcul interne ;
- les centerlines Copernicus restent reservees a l'overlay visible ;
- les oceans Jaillot deviennent le domaine cible de repartition ;
- `MAP_BOUNDS_POLYGON` dans `js/carte-data.js` reste la limite geographique
  generale utile, mais les polygones oceanBounds sont plus precis pour le
  masque oceanique ;
- la grille runtime doit etre reconstruite par interpolation dans les polygones
  oceaniques, pas par simple lecture d'une trame globale 8500x5320.

Implementation visee :

- lire `courants-copernicus-quiver.svg` ;
- respecter des groupes Illustrator/Inkscape nommes `quiver_pacifique` /
  `quiver_atlantique` s'ils existent ;
- sinon classer automatiquement les fleches par appartenance aux deux
  `oceanBounds` ;
- echantillonner les cellules Jaillot tous les 50 px uniquement dans les
  polygones oceaniques ;
- pour chaque cellule cible, mapper la position relative vers le bloc source
  correspondant, puis interpoler les vecteurs voisins ;
- exporter a la fois `js/oscar-grid.js` et un SVG preview materialise pour
  controle visuel.

Cette v3 est plus fidele a l'objectif que la v2 : elle conserve la regularite
des quivers et evite les compressions/etirements locaux imposes a la main.

## Correction d'orientation - quiver Copernicus

Apres relecture utilisateur, l'architecture a ete recalee :

- `Backup\courants-copernicus-centerlines.svg` conserve les lignes Copernicus
  et sert de backup/overlay visible pour la carte Jaillot.
- Le calcul interne et SEMAPHORE doivent partir d'un SVG quiver, pas des
  centerlines.
- L'etape SVG intermediaire reste obligatoire : elle permet le recalage manuel
  sur la geographie deformee de Jaillot. Les anchors de villes ne sont pas assez
  justes pour remplacer ce recalage humain.

Scripts corriges :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py
```

`gen_oscar_data.py` produit maintenant par defaut :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver.svg
```

Ce SVG contient des fleches `copernicus_q_XXXXX`, en projection lon/lat lineaire
sur canevas 8500x5320, sans anchors. Chaque fleche porte les attributs :

```text
data-lat, data-lon, data-u, data-v, data-spd
```

La geometrie de la fleche est deformable dans Inkscape. Lors de la conversion
en grille, la position et l'orientation viennent de la geometrie SVG deformee,
tandis que la vitesse vient de `data-spd`.

`gen_oscar_grid.py` lit maintenant les fleches quiver, applique les transforms
SVG simples (`matrix`, `translate`, `scale`), puis genere `js/oscar-grid.js`.
Par defaut, il lit `courants-copernicus-quiver-deforme.svg` s'il existe, sinon
`courants-copernicus-quiver.svg`.

Generation de test non deformee :

```text
7723 fleches exportees
7723 cellules actives
cellules bornees : minX=0 maxX=169 minY=0 maxY=106
```

Validations relancees :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
git diff --check
```

Resultat : OK.

## Correction V2 - pre-repartition 50 px et interpolation

Question utilisateur : la grille ne devait pas simplement etre implicite dans
les ids ou remplie par depot direct des fleches dans les cellules finales.
La bonne solution retenue est :

1. pre-repartir les fleches du quiver tous les 50 px dans la projection source
   sincere ;
2. fusionner/interpoler le champ U/V Copernicus des cette etape, pour obtenir un
   quiver source homogene ;
3. deformer manuellement ce quiver homogene dans Inkscape ;
4. reconstruire la grille Jaillot finale par interpolation depuis les fleches
   deformees, et non par simple affectation "la fleche tombe dans cette cellule".

`gen_oscar_data.py` a donc ete modifie : `--pas-index` est remplace par
`--cell-px 50`. Le script parcourt les centres de cellules 50 px de la projection
source, convertit chaque centre en lon/lat, puis interpole `uo/vo` par bilineaire
sur le NetCDF.

`gen_oscar_grid.py` a ete modifie : il construit un index spatial des fleches
deformees puis, pour chaque cellule Jaillot finale, interpole les vecteurs
voisins dans un rayon `--rayon-px 90` avec un poids gaussien. Cette interpolation
comble les trous crees par l'etirement local et evite de renforcer artificiellement
les zones contractees, puisqu'on moyenne les vecteurs au lieu de les sommer.

Generation de test V2 non deformee :

```text
10510 fleches exportees dans courants-copernicus-quiver.svg
12306 cellules actives dans js/oscar-grid.js
cellules bornees : minX=0 maxX=169 minY=0 maxY=105
sources par cellule : min=1 max=9
```

Validations relancees :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
git diff --check
```

Resultat : OK.

## Etat actuel apres implementation v3

La piste active n'est plus la deformation manuelle par defaut, mais la
materialisation par domaines oceaniques.

`gen_oscar_grid.py` a ete remplace par une v3 qui :

- lit le quiver Copernicus `courants-copernicus-quiver.svg` ;
- lit `oceanBounds-01.svg` via `svgpathtools` + `shapely` ;
- reconstruit correctement les paths composes Illustrator, notamment le grand
  domaine Atlantique avec ses trous d'iles/terres ;
- utilise `MAP_BOUNDS_POLYGON` comme limite generale ;
- classe les vecteurs par groupes `quiver_pacifique` / `quiver_atlantique` si
  ces groupes existent, sinon par appartenance/proximite aux oceanBounds ;
- echantillonne les cellules 50 px dans les oceans Jaillot ;
- mappe chaque cellule cible vers le bloc source correspondant par position
  relative et scanline horizontale ;
- interpole les vecteurs voisins dans le bloc source ;
- exporte `js/oscar-grid.js` en `version: 3` ;
- exporte un SVG preview materialise :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver-materialise.svg
```

Generation v3 actuelle :

```text
10510 fleches lues
10537 cellules exportees
0 fleche ignoree
pacific: 1983 cellules, 2273 sources
atlantic: 8554 cellules, 7282 sources
```

Validation relancee :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
git diff --check
node .\tools\audit-text-integrity.js
```

Resultat : OK. Audit texte : 0 erreur, 61 avertissements preexistants.

Point a inspecter visuellement en priorite : le SVG preview materialise. Si sa
repartition est convaincante, `js/oscar-grid.js` est deja regenere depuis cette
meme logique. Si l'Atlantique doit etre affine, le prochain levier pertinent est
le mapping source/cible par scanline, pas le runtime Jaillot.

## Rognage maritime theorique

Ajout apres mesure utilisateur :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Sources SVG\overlay-maritime-rognage.svg
```

Le rognage est applique comme zone de suppression de candidates, apres mapping
dans la bbox complete `oceanBounds`. Cet ordre conserve l'echelle source/cible :
on genere/interpole dans le domaine permissif, puis on elimine uniquement les
fleches materialisees qui intersectent le rognage theorique, avant export final.

Etat actuel :

```text
_crop.active = true
_crop.cropped = 0
```

Aucune fleche 50 px materialisee n'intersecte actuellement ces zones fines de
rognage ; le support reste utile si le SVG de rognage est elargi ou si la
resolution change.

Correction supplementaire : le generateur ne porte plus de copie statique de
`MAP_BOUNDS_POLYGON`. Son garde-fou global est maintenant derive de la bbox de
l'union `oceanBounds`, soit environ :

```text
minX=171.92, minY=377.52, maxX=8351.36, maxY=5022.93
width=8179.44, height=4645.41
```

Effet observe : +2 cellules Pacifique seulement. Le fait que le groupe de
fleches materialisees importe plus petit que la bbox oceanBounds vient surtout
de la trame 50 px et de la longueur des segments de fleches, pas de l'ancien
mapBounds.

## Alignement central et filtre final oceanBounds

Decision finale de calibration : le SVG preview materialise devient le temoin
visuel de la grille finale. Sa bbox effective (`gridBounds`) est consideree
comme une trame interne comprise dans la bbox de l'union `oceanBounds`
(`mapBounds`). Le generateur recentre donc automatiquement `gridBounds` sur
`mapBounds`, puis applique les filtres de sortie.

Pipeline actif dans `gen_oscar_grid.py` :

1. generer/interpoler les candidates 50 px dans les domaines oceaniques ;
2. mesurer la bbox visuelle des fleches materialisees ;
3. translater toutes les candidates pour centrer cette bbox sur la bbox de
   l'union `oceanBounds` ;
4. eliminer les candidates qui intersectent `overlay-maritime-rognage.svg` ;
5. eliminer les candidates dont le centre ou le segment de fleche sort du
   polygone `oceanBounds` de son domaine.

Generation apres alignement :

```text
10510 fleches lues
10387 cellules exportees
pacific: 1985 candidates brutes, 1967 cellules finales, 18 filtrees par oceanBounds
atlantic: 8554 candidates brutes, 8420 cellules finales, 134 filtrees par oceanBounds
_alignment.offsetPx = [7.814, 0.252]
_alignment.gridBounds = [170.51, 421.00, 8337.14, 4978.95]
_alignment.mapBounds = [171.92, 377.52, 8351.36, 5022.93]
_crop.cropped = 0
_oceanBounds.cropped = 152
```

`earthBounds-01.svg` n'est finalement pas utilise : `oceanBounds-01.svg` est le
negatif propre des terres et constitue donc le filtre maritime le plus fiable.

## Piste future : grille hexagonale

Une grille hexagonale reste une piste interessante pour une version ulterieure :
meilleure isotropie, voisinage plus regulier et artefacts directionnels
potentiellement plus faibles dans le Pilote automatique. Elle n'est pas retenue
pour cette passe, car le moteur interroge surtout un champ vectoriel interpole
en points/segments ; le gain attendu est donc probablement inferieur au cout de
conversion du generateur, du format `oscar-grid.js`, des diagnostics et de
SEMAPHORE.

La piste a garder : tester l'hexagonal uniquement si la grille carree 50 px
montre des artefacts directionnels visibles apres validation du pipeline actuel.

## Export centerlines derive de la grille finale

Ajout d'un generateur graphique hors depot :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_centerlines.py
```

Ce script lit directement :

```text
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
```

puis suit le champ vectoriel `OSCAR_GRID` pour produire des lignes de courant
visibles, coupees par `oceanBounds-01.svg`. Cet export n'est pas la source de
calcul : il derive de la grille finale et sert uniquement d'overlay graphique.

Fichier produit :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-centerlines-from-grid.svg
```

Generation initiale :

```text
OSCAR_GRID version 4 : 10387 cellules
822 graines candidates
132 centerlines exportees
```

Avant cloture de session, le generateur a ete densifie pour produire un temoin
plus comparable au backup Copernicus :

```text
OSCAR_GRID version 4 : 10387 cellules
2181 graines candidates
276 centerlines exportees
```

Comparaison geometrique rapide :

```text
Backup Copernicus : 276 paths, longueur totale ~1 119 726 px, mediane ~5 500 px
Depuis grille     : 276 paths, longueur totale ~1 856 602 px, mediane ~7 800 px
```

Le nombre de paths est maintenant comparable, mais les lignes derivees de la
grille sont plus longues. Cet export doit donc nourrir l'inspection visuelle
sans etre considere comme une preuve definitive de fidelite : il aide surtout a
voir les grandes continuites et les ruptures du champ V4.

Validations :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_centerlines.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid.py"
python -c "import xml.etree.ElementTree as ET; ET.parse(r'C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-centerlines-from-grid.svg'); print('xml ok')"
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
```

Resultat : OK.

## Prochain chantier

La prochaine session doit porter sur le diagnostic de navigation, pas sur la
generation des courants.

Points a traiter :

- brancher SEMAPHORE sur le vrai calcul Jaillot + `OSCAR_GRID`, pas seulement
  sur les anciens `SEA_CURRENTS` de `sea-data.js` ;
- exposer, pour une route, un journal lisible par segment : cap, vent, allure,
  vitesse navire, courant retenu, composantes parallele/laterale, vitesse sol ;
- tester les trajets temoins avec quatre modes figes : courant OFF / vent OFF,
  courant ON / vent OFF, courant OFF / vent ON, courant ON / vent ON ;
- prioriser le cas suspect `La Havane <-> Portobelo`, puis verifier
  `Nassau <-> La Havane`, `Puerto Espana <-> Veracruz`, `Portobelo <-> Veracruz`
  et `La Havane <-> Veracruz`.

Clarification importante : `oscar-grid.js` remplace `sea-data.js` comme source
des courants pour le moteur Jaillot. `sea-data.js` reste charge pour les
overlays legacy, les centerlines/rubans historiques, les zones maritimes et
`SEA_SHOALS`. Il ne faut donc pas regenerer `sea-data.js` pour integrer les
courants Copernicus ; toute regeneration future devra en revanche preserver
`SEA_SHOALS`.
