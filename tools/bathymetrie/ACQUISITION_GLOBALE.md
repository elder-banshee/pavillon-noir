# Acquisition GEBCO globale pour Jaillot

Le prototype Bahamas ayant validé la chaîne, le traitement complet utilise un
seul couple de rasters GEBCO/TID. Les régions de travail sont des découpages
logiques du même raster, pas des téléchargements indépendants : cela évite de
créer des coutures scientifiques artificielles.

## Sous-ensemble à télécharger

Dans <https://download.gebco.net/> :

1. sélectionner `GEBCO_2026 Grid` ;
2. saisir l'emprise :
   - North : `35`
   - South : `5`
   - West : `-100`
   - East : `-55`
3. ajouter au panier en **Data GeoTIFF** :
   - la grille bathymétrique GEBCO 2026 ;
   - la grille `Type Identifier (TID)` GEBCO 2026 ;
4. télécharger et extraire l'archive dans :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Bathymétrie\Sources\GEBCO_2026_Jaillot
```

Noms attendus :

```text
gebco_2026_n35.0_s5.0_w-100.0_e-55.0_geotiff.tif
gebco_2026_tid_n35.0_s5.0_w-100.0_e-55.0_geotiff.tif
```

L'emprise donne une grille attendue de `10 800 × 7 200`, soit 77 760 000
cellules à 15 secondes d'arc.

## Organisation du traitement

- L'inventaire scientifique, les contrastes et les composantes connexes sont
  calculés globalement en WGS84.
- Les domaines Golfe, Caraïbes, Bahamas, Floride et Atlantique servent ensuite
  au routage du warp et aux exports de contrôle.
- Le Pacifique constitue une famille de warp indépendante et ne communique
  jamais avec les domaines atlantiques.
- Les gros résultats intermédiaires sont écrits hors dépôt dans `Générés`.
- Le dépôt ne reçoit que les scripts, rapports synthétiques, géométries
  simplifiées finales et données moteur.

La configuration canonique est `bathymetrie-globale.json`.
