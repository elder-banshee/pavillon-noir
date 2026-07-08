# REPRISE_43 - Pavillon Noir - Courants et calculateur Jaillot

## Contexte

Cette reprise documente ce qui a ete accompli depuis `REPRISE_41.md` et `REPRISE_42.md`.

Important : ce fichier a ete genere sur demande explicite de l'utilisateur. Ne pas reprendre l'habitude de creer un `REPRISE_N.md` apres chaque prompt ; l'utilisateur prefere un recapitulatif de fin de session seulement.

Depot du site :

```text
C:\AI\Site Pavillon Noir\pavillon-noir
```

Dossier des reprises :

```text
C:\AI\Site Pavillon Noir\Prompts
```

## Etat Git observe

Depuis `C:\AI\Site Pavillon Noir\pavillon-noir` :

```text
git status --short
# sortie vide
```

Etat observe apres verification : le depot est propre.

Dernier commit observe :

```text
a5572dd feat(zone-editor): enhance current speed management and metadata display
```

Le fichier `Prompts\REPRISE_43.md` est hors depot Git du site, dans le dossier de reprises parent.

## Reorganisation du dossier parent

Le dossier parent a ete range pour ne garder a la racine que :

- `pavillon-noir`
- `Prompts`
- `Accessoires site pavillon noir`
- `AGENTS.md`

Le dossier `Accessoires site pavillon noir` contient maintenant :

- `Outils generation` : scripts Python (`gen_sea_data.py`, `gen_zones_data.py`, `svg_to_currents.py`, `svg_to_zones.py`, `fix_bord_nord.py`, `__pycache__`)
- `Sources SVG` : sources SVG de courants, notamment `courants-01.svg`
- `Journaux` : sorties/erreurs de generation
- `Notes` : notes diverses
- `Archives` : anciens fichiers de travail
- `Illustrations` : ressources graphiques hors depot

Des `README.txt` ont ete ajoutes dans les sous-dossiers utiles.

`gen_sea_data.py` a ete adapte pour :

- utiliser une source SVG depuis `..\Sources SVG\...` ;
- ecrire directement vers un fichier via `--output` ;
- conserver/exporter les `speedSegments` du courant principal.

## Donnees de courants

`js/sea-data.js` contient maintenant :

- `SEA_CURRENTS` : 26 courants/tourbillons ;
- `SEA_SHOALS` : zones de hauts-fonds / bancs ;
- export navigateur :

```js
window.SEA_CURRENTS = SEA_CURRENTS;
window.SEA_SHOALS = SEA_SHOALS;
```

### Structure actuelle des courants

Les courants comportent notamment :

```js
{
  id,
  label,
  priorite,
  force,
  closed,
  zoneSource: 'svg',
  speedKmh,
  speedSegments,
  centerline,
  directions,
  zone
}
```

Les directions restent encodees en provenance dans les donnees, comme dans l'editeur : un courant `N` vient du nord et porte vers le sud. Le calculateur applique donc l'inversion necessaire pour obtenir le vecteur reel du courant.

### Courant principal Guyanes -> Gulf Stream

Le courant principal est actuellement :

```js
id: 'guyanes_gulf_stream_r1'
```

Il possede des segments de vitesse :

```js
speedSegments: [
  { label: 'Gulf Stream', from: 0, to: 39, speedKmh: 9 },
  { label: 'Courant de Floride', from: 40, to: 67, speedKmh: 6.5, attenuationMinCote: 0.6 },
  { label: 'Courant des Caraibes', from: 68, to: 161, speedKmh: 3 },
  { label: 'Courant des Guyanes', from: 162, to: 184, speedKmh: 2.5 },
]
```

`attenuationMinCote: 0.6` sur le courant de Floride evite que l'attenuation pres des cotes annule trop fortement ce courant.

### Hauts-fonds

`SEA_SHOALS` contient notamment :

- `banc_de_jamaique`
- `banc_de_cuba`
- `banc_de_porto-rico`
- `banc_des_bahamas`

Chaque entree possede :

```js
{
  id,
  label,
  maxCategorieTaille,
  zone
}
```

Le calculateur peut interdire ces zones selon la categorie de taille du navire.

## Zone Editor - mode Courants

`tools/zone-editor.html` a fortement evolue depuis `REPRISE_42`.

### Rendu des courants

- Les rubans de courant sont limites par leur `zone`.
- Les fleches ne sont plus placees sur chaque point de path.
- Les fleches sont reparties plus regulierement dans les rubans.
- La vitesse influence l'espacement des fleches :
  - courant plus rapide = fleches plus rapprochees ;
  - courant plus lent = fleches plus espacees.
- Les fleches restent dans le ruban et ne doivent plus apparaitre dans le vide.

### Priorites et intersections

Les courants de priorites differentes se decoupent visuellement et fonctionnellement.

Pour les courants de meme priorite, le calculateur fait une moyenne vectorielle au lieu d'additionner les forces.

### Edition des vitesses

Le panneau de detail courant a ete simplifie :

- la liste affiche `Nom du courant (N points)` avec la meme typo/couleur que le nom ;
- le detail affiche aussi `Nom du courant (N points)` ;
- l'ancienne ligne `Priorite - Force - points` a ete retiree ;
- un champ editable `km/h` apparait pour les courants simples ;
- si le courant possede des `speedSegments`, chaque troncon a son propre champ editable ;
- l'export conserve les `speedSegments`, `speedKmh` et `attenuationMinCote`.

Symboles utiles :

```js
DEFAULT_CURRENT_SPEED_SEGMENTS
applyCurrentDefaults
currentTitleWithPoints
updateCurrentSpeed
fmtSpeedSegments
```

### Export

L'export du mode Courants genere maintenant :

- `SEA_CURRENTS`
- `SEA_SHOALS`
- `speedKmh`
- `speedSegments`
- `zoneSource`
- `attenuationMinCote`

L'ancien probleme d'export UTF-16 mentionne dans `REPRISE_42` est a revalider ; le flux actuel utilise toujours un `Blob` `text/javascript;charset=utf-8`.

## Calculateur Jaillot

`js/navigation-jaillot.js` a recu la brique principale d'integration des courants.

### Conversion distance

La conversion pixels -> milles nautiques est implementee :

```text
840 px = 100 English land leagues = 300 milles imperiaux
1 mille imperial = 1609 m
1 mille nautique = 1852 m
```

Soit :

```text
1 px ~= 0,310282 mille nautique
840 px ~= 260,64 milles nautiques
```

Fonctions utiles :

```js
millesNautiquesParPx
distanceNm
distanceRouteNm
formatDistanceMilles
```

L'affichage joueur est maintenant :

```text
X j Y h · Z milles
```

Le nombre de points de route n'est plus affiche dans l'interface.

### Navire actif

`js/carte-data.js` contient un navire de test :

```js
const CARTE_NAVIRE = {
  id: 'cotre-pj',
  nom: 'Cotre des PJ',
  type: 'cotre',
  distanceMoyenneNmJour: 105,
  vitesseMoyenneNoeuds: 105 / 24,
  vitessesNoeuds: {
    pres: 4,
    largue: 10.5,
    grandLargue: 9.5,
    ventArriere: 5,
  },
};
```

Le calculateur utilise pour l'instant `vitesseMoyenneNoeuds`.

### Cout en temps

Le cout A* n'est plus base sur la distance en pixels, mais sur le temps estime.

Les segments longs sont echantillonnes par pas de grille afin de prendre en compte les changements de courant le long du trajet.

Fonctions utiles :

```js
tempsSegmentHeures
dureeRouteHeures
heuristiqueTemps
```

### Courants

Le calculateur :

- trouve les courants contenant le point courant ;
- applique la priorite la plus forte (`priorite` numeriquement la plus basse) ;
- fait une moyenne vectorielle pour les courants de meme priorite ;
- convertit le courant en noeuds ;
- applique l'attenuation pres des cotes ;
- ignore les courants dans les hauts-fonds ;
- applique l'inversion provenance -> deplacement reel.

Fonctions utiles :

```js
courantEnPoint
directionVersVecteur
vitesseCourantAuPoint
attenuationCourantCote
distanceCotePointNm
```

### Compensation automatique de derive

La derniere brique ajoutee est la compensation automatique :

Pour chaque segment, le courant est decompose en :

- composante parallele a la route ;
- composante laterale.

Le navire doit compenser la composante laterale avec une partie de sa vitesse. La vitesse restante dans l'axe du segment donne la vitesse-sol reelle.

Si la composante laterale du courant depasse ce que le navire peut compenser, le segment devient impraticable.

Fonctions utiles :

```js
composantesCourantSegmentNoeuds
compensationCourantSegment
vitesseEffectiveSegmentNoeuds
projectionCourantNoeuds
```

### Hauts-fonds

Le routeur indexe `SEA_SHOALS` et refuse les segments traversant un haut-fond interdit a la categorie de taille du navire.

Fonctions utiles :

```js
getIndexHautsFonds
segmentTraverseHautFond
pointDansHautFond
categorieTailleNavire
```

Par defaut, si le navire ne declare pas de categorie, il utilise `CONFIG.categorieMaxHautsFonds` (`3` actuellement).

### Optimisations

Caches ajoutes :

```js
courantPointCache
tempsSegmentCache
courantsIndexCache
hautsFondsIndexCache
```

Un index par boites/cellules evite de tester tous les polygones pour chaque point ou segment.

## Tests de reference actuels

Test Node realise en fin de session :

```text
Nassau -> La Havane 4 j 13 h · 324 milles points=7
La Havane -> Nassau 2 j 5 h · 298 milles points=5
```

Comparaison externe rapide :

- C-MAP donne La Havane -> Nassau et Nassau -> La Havane identiques : `2 j 17 h`, `327,4 nm`.
- Conclusion : C-MAP semble faire ici un calcul distance/vitesse sans vent ni courant.
- Son resultat reste utile comme etalon de distance et de duree sans environnement.

Interpretation actuelle :

- La Havane -> Nassau est favorise par le courant de Floride / Gulf Stream.
- Nassau -> La Havane est penalise par courant contraire et par la compensation laterale.
- Les ordres de grandeur semblent plausibles, mais doivent etre affines avec un mode diagnostic.

## Verifications realisees

Depuis `C:\AI\Site Pavillon Noir\pavillon-noir` :

```powershell
node --check .\js\navigation-jaillot.js
node --check .\js\carte-data.js
node --check .\js\sea-data.js
node -e "const fs=require('fs');const html=fs.readFileSync('tools/zone-editor.html','utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);for(const s of scripts)new Function(s);console.log('inline scripts syntax OK')"
git diff --check
```

Resultat :

- syntaxe JS OK ;
- scripts inline de `zone-editor.html` OK ;
- `git diff --check` OK.

## Points ouverts / prochaines priorites

### 1. Mode diagnostic route

Priorite conseillee.

Afficher pour une route :

- distance totale ;
- duree sans courant ;
- duree avec courant ;
- gain/perte ;
- vitesse moyenne effective ;
- segments les plus influences par les courants ;
- composante parallele/laterale moyenne ou maximale.

But : comprendre rapidement si une anomalie vient :

- de la distance ;
- de la vitesse du navire ;
- du courant ;
- de la compensation laterale ;
- de l'attenuation cote ;
- ou de la forme de la route.

### 2. Caracteristiques du navire

Le calcul utilise encore la vitesse moyenne `105 milles/jour`.

A faire plus tard :

- utiliser les vitesses selon allure (`pres`, `largue`, `grandLargue`, `ventArriere`) ;
- introduire le vent ;
- definir `categorieTaille` explicitement pour le cotre.

### 3. Coefficient d'influence des courants

Discussion theorique ouverte :

- la vitesse locale du courant est necessaire ;
- mais la puissance/debit/largeur/stabilite pourrait etre representee par un coefficient d'influence.

Piste :

```js
effectiveCurrent = speedKmh * influence
```

Pas encore implemente.

### 4. Donnees de courants

A affiner :

- vitesse des courants secondaires ;
- largeur reelle des rubans ;
- valeurs des tourbillons ;
- attenuation pres des cotes ;
- zones interstitielles laissees calmes sauf evenement MJ/meteo.

### 5. Performance

Le calcul La Havane -> Nassau est acceptable en test Node (~13 s pour les deux sens dans le test de reference), mais certains trajets peuvent encore etre lents.

Optimisations futures possibles :

- pre-calcul / grille de courant ;
- limiter les recomputations `courantEnPoint` ;
- route workerisee pour ne pas bloquer l'interface ;
- meilleur heuristique A* selon courant.

### 6. Validation visuelle

A revalider dans le navigateur :

- l'editeur Courants ;
- l'edition des vitesses ;
- l'export `sea-data.js` ;
- la route Nassau/La Havane dans l'interface ;
- le rendu des fleches et des zones de hauts-fonds.
