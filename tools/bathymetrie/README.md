# Outils bathymétriques

## Audit du warp Copernicus → Jaillot

`audit_warp_copernicus.py` reconstruit le lien entre les coordonnées WGS84 du
SVG Copernicus original et les nœuds homologues déplacés dans le SVG
« marionnette » final.

Depuis la racine du dépôt :

```powershell
python .\tools\bathymetrie\audit_warp_copernicus.py
```

Entrées par défaut (hors dépôt, remplaçables par options) :

- `Accessoires site pavillon noir/Outils generation/Sources/courants-copernicus-quiver.svg`
- `Accessoires site pavillon noir/Outils generation/Sources/courants-marionnette.svg`

Sorties dans `output/warp-copernicus/` :

- `warp-01-source-copernicus.svg` : maillage source en WGS84 ;
- `warp-02-jaillot.svg` : maillage déformé dans le repère Jaillot ;
- `warp-03-correspondances.svg` : contrôle côte à côte des appariements ;
- `warp-audit.json` : appariements, emprises, coutures et audit topologique.

Le transfert bathymétrique doit conserver des mailles indépendantes par
sous-domaine. Les copies partagées ne sont cousues qu'après projection : une
moyenne préalable des nœuds peut retourner localement des triangles aux
frontières Bahamas/Floride/Atlantique et Bahamas/Caraïbes.

## Audit GEBCO Bahamas

```powershell
python .\tools\bathymetrie\audit_gebco_bahamas.py
```

Le script vérifie les deux GeoTIFF bathymétrie/TID, produit
`output/gebco-bahamas/bathymetrie-01-source-audit.json` et un contrôle visuel
`bathymetrie-01-source.svg`. Il conserve les codes TID bruts et utilise les
valeurs d'élévation GEBCO (`elevation >= 0`) pour le masque terrestre.

## Classes de navigation sûre

```powershell
python .\tools\bathymetrie\classify_gebco_bahamas.py
```

Sorties :

- `bathymetrie-02-classes.svg` : bandes exclusives et cinq masques cumulatifs ;
- `bathymetrie-02-classes.json` : cellules, surfaces approximatives et
  distribution TID de chaque classe.

Les bandes suivent les seuils sûrs `1,8 / 3,6 / 6 / 8,4 / 12 m`. Le GeoTIFF
GEBCO étant stocké en mètres entiers, les seuils décimaux restent exacts dans
le contrat mais les changements effectifs se produisent entre valeurs entières.

## Amas et contours

```powershell
python .\tools\bathymetrie\extract_gebco_bahamas_clusters.py
```

Le script étiquette les masques cumulatifs avec une connexité par côté
(4 voisins), calcule les statistiques de chaque amas et trace les contours
exacts des amas d'au moins quatre cellules. Aucun petit amas n'est supprimé du
JSON : `vectorMinCells` ne concerne que la lisibilité du SVG.

Sorties : `bathymetrie-03-amas.svg` et `bathymetrie-03-amas.json`.

## Transposition de contrôle vers Jaillot

```powershell
python .\tools\bathymetrie\warp_gebco_bahamas_to_jaillot.py
```

Le warp utilise une triangulation Delaunay séparée pour chacun des domaines
atlantiques, rejette les triangles retournés ou dont une arête dépasse 1,5° et
exclut explicitement le Pacifique. L'ordre de priorité du prototype est
`bahamas → florida → atlantic → caribbean → gulf_mexico` dans les recouvrements.

Le SVG `bathymetrie-04-jaillot-brut.svg` référence l'image Jaillot du dépôt et
affiche le seuil 12 m par défaut ; les autres seuils sont des groupes masqués.
Cette sortie valide le pipeline mais n'est pas encore une géométrie publiée :
les frontières de domaines devront être découpées et cousues explicitement.

La validation visuelle du prototype montre que Cuba est déjà bien alignée et
que les seuils élevés sont globalement convaincants. Les Bahamas nécessitent
une correction locale supplémentaire du warp en raison des déformations très
fortes des îles sur Jaillot. Cette correction devra être appliquée à la cage de
déformation commune, jamais indépendamment à chaque seuil bathymétrique.

## Traitement global

La configuration `bathymetrie-globale.json` définit l'emprise unique
`100°W–55°W / 5°N–35°N`, les fichiers attendus et les domaines logiques. Voir
`ACQUISITION_GLOBALE.md` pour le téléchargement.

Vérification légère, sans charger les 77,76 millions de cellules :

```powershell
python .\tools\bathymetrie\check_gebco_global_sources.py
```

Les gros artefacts globaux sont conservés hors dépôt sous `Accessoires`, dans
le dossier `Bathymétrie/Générés/GEBCO_2026_Jaillot`.

### Audit et classes globales

```powershell
python .\tools\bathymetrie\process_gebco_global.py
```

Le script lit les 77,76 millions de cellules par bandes, génère le raster brut
`gebco-2026-jaillot-classes.u8` et les contrôles SVG source/classes dans le
dossier `Générés`. Un rapport synthétique est aussi conservé dans
`tools/bathymetrie/output/global/`.

### Contraste, persistance et priorisation WGS84

```powershell
python .\tools\bathymetrie\prioritize_gebco_global.py
python .\tools\bathymetrie\render_global_priority_svg.py
```

La première commande calcule les composantes imbriquées des cinq seuils, deux
contrastes directionnels (une cellule et douze cellules), la proximité de la
terre, la part de mesures directes et la parenté entre niveaux. Elle produit
un JSON canonique et un CSV de candidats WGS84 hors dépôt.

La seconde produit `bathymetrie-04-contraste.svg`. Les scores servent seulement
à ordonner le contrôle humain ; aucune donnée n'est supprimée automatiquement.

Le codage TID suit la documentation GEBCO 2026 : le code 17 est une combinaison
de méthodes directes et le code 70 une grille pré-générée à sources mixtes.

### Parents structurels sous 50 m

```powershell
python .\tools\bathymetrie\analyze_global_plateaus.py
```

Cette passe construit les composantes connexes marines `0–50 m`, rattache
chaque candidat `<12 m` à son parent structurel et échantillonne le contexte
marin à environ 0,9 km de résolution dans deux anneaux : `5–25 km` et
`25–50 km`. La terre est comptée séparément et exclue des proportions marines.

Sorties hors dépôt :

- `bathymetrie-05-plateaux-50m.csv/json` : une ligne par structure portant au
  moins un cœur dangereux ;
- `bathymetrie-05-candidats-structures-wgs84.csv/json` : sommets enrichis ;
- `bathymetrie-05-structures-50m.svg` : contrôle visuel des signatures ;
- `gebco-2026-jaillot-context-50-200.u8` : raster compact de contexte.

Les champs principaux sont `plateau50Id`, surface/étendue du parent,
`plateauContext5to25KmPercent`, `plateauContext25to50KmPercent` et les parts
d'eau profonde `>200 m`. `plateauProminencePercent` est conservé comme alias du
contexte modéré 25–50 km demandé dans l'addendum.

Les signatures `plateau_structurant`, `bord_de_plateau`,
`atoll_ou_banc_detache`, `pinnacle_isole` et `indetermine` sont heuristiques et
doivent être calibrées sur des références connues. Elles ne filtrent rien.
