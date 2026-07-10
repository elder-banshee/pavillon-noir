# REPRISE_64 - Rasterisation OSCAR depuis SVG final et diagnostic environnement

## Contexte

Continuation du chantier Copernicus/Jaillot après `REPRISE_61.md` et
`REPRISE_62.md`. `REPRISE_63.md` reste hors sujet pour ce fil.

La session a commencé en mode nomade, après import frais du dépôt GitHub. Une
anomalie initiale montrait deux fichiers modifiés dans le dépôt :

```text
pavillon-noir/js/chroniques.js
pavillon-noir/pnj/pavillons/fr_pavillon.svg
```

Diagnostic : aucune modification fonctionnelle, uniquement des fins de ligne
CRLF/LF. Une passe de normalisation stricte a été faite sur les fichiers
signalés par l'audit texte, puis l'utilisateur a commit cette réparation.

Correction faite aussi dans :

```text
C:\AI\Site Pavillon Noir\Prompts\REPRISE_62.md
```

Le titre interne erroné `REPRISE_64` a été corrigé en `REPRISE_62`.

## Source utilisateur finalisée

Nouvelle source de travail fournie :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-FINAL.svg
```

Ce SVG contient les sous-domaines Copernicus déformés manuellement, sauf le
Pacifique. Il contient aussi des calques :

```text
florida_cropped
atlantic_cropped
```

Ces calques correspondent à des nodes/flèches volontairement sortis du champ
après mise à l'échelle. Ils doivent être exclus des exports moteurs.

## Couture des overlaps et preview centerlines

Script ajouté :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_stitched_centerlines.py
```

Rôle :

- lire le SVG final Illustrator ;
- retrouver les ids `copernicus_q_*` dans les nodes/flèches ;
- exclure tout élément sous un calque contenant `cropped` ;
- coudre les anciens nodes/flèches partagés entre sous-domaines par moyenne
  géométrique ;
- produire une preview centerlines avec `oceanBounds` sur calque séparé.

Exports produits :

```text
Sources\courants-copernicus-jaillot-centerlines-stitched-preview.svg
Sources\courants-copernicus-jaillot-centerlines-stitched-report.json
```

Résultat après correction des calques cropped :

```text
centerlines: 7572
coutures: 213
cropped exclus: 191
flèches manquantes: 0
```

Point important : les 8 premières "flèches manquantes" étaient un faux problème.
Elles correspondaient à des nodes placés dans les calques `florida_cropped` et
`atlantic_cropped`, et devaient donc être exclus.

## Décision stratégique sur le champ de courants

Décision utilisateur validée : choisir l'option "champ complet + navigation
filtre séparé".

Contrat retenu :

- la couche courants est un champ physique continu ;
- elle ne décide pas si la navigation est autorisée ;
- `oceanBounds`, hauts-fonds, récifs, zones côtières et restrictions navire
  relèvent de `navigation-jaillot.js` ;
- les courants peuvent donc exister sous ou près des zones non navigables ;
- les calques explicitement cropped restent exclus.

Conséquence : le nouveau `oscar-grid.js` ne doit pas être clippé strictement par
`oceanBounds`. La navigation filtrera séparément les segments admissibles.

## Rasterisation vers oscar-grid.js

Script ajouté :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid_from_final_svg.py
```

Rôle :

- lire `courants-copernicus-marionnette-subdomains-FINAL.svg` ;
- coudre les doublons via `gen_oscar_stitched_centerlines.py` ;
- exclure les calques `*_cropped` ;
- relire les vitesses source depuis `courants-copernicus-quiver.svg` ;
- rasteriser en grille 50 px ;
- conserver les cellules Pacifique de l'ancien `js/oscar-grid.js` ;
- remplacer le champ non-Pacifique par la version issue du SVG final ;
- produire une preview centerlines post-rasterisation avec `oceanBounds`.

Exports produits :

```text
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
Sources\courants-copernicus-jaillot-grid-final-centerlines-preview.svg
Sources\courants-copernicus-jaillot-grid-final-report.json
```

Résultat :

```text
vecteurs lus: 7572
cellules non-Pacifique: 6288
cellules Pacifique conservées: 1967
cellules totales: 8255
cropped exclus: 191
coutures: 213
flèches manquantes: 0
vitesses source manquantes: 0
```

Validations effectuées :

```powershell
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
node .\tools\audit-text-integrity.js --strict-eol
```

Résultat : OK.

La preview SVG post-rasterisation est XML valide et contient bien le calque :

```text
oceanBounds_reference
```

État Git du dépôt site en fin de session :

```text
## main...origin/main
 M js/oscar-grid.js
```

Seul `pavillon-noir/js/oscar-grid.js` est modifié dans le dépôt.

## Limites visuelles et suite prévue

L'utilisateur a contrôlé la preview et estime le résultat globalement correct,
mais prévoit des corrections manuelles supplémentaires :

- Gulf Stream passant trop par les Bahamas, à ramener vers l'ouest / Floride ;
- courant des Guyanes à remonter légèrement ;
- ajout ultérieur du bloc Pacifique dans le SVG final.

Le Pacifique n'est pas urgent : il est visible sur la carte mais inaccessible
aux PJ pour l'instant.

Après ces corrections, il faudra relancer :

```powershell
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_stitched_centerlines.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_grid_from_final_svg.py"
```

Puis revalider :

```powershell
cd "C:\AI\Site Pavillon Noir\pavillon-noir"
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
node .\tools\audit-text-integrity.js --strict-eol
```

## Diagnostic environnement

Problèmes observés dans cette instance :

- `node` a d'abord semblé absent du PATH, puis a été retrouvé ;
- `shapely` semblait absent parce que le Python embarqué Codex était utilisé ;
- les demandes d'autorisation étaient trop fréquentes, empêchant un travail
  autonome en parallèle.

Diagnostic final :

```text
node système:
  C:\Program Files\nodejs\node.exe

python système:
  C:\Users\ronan\AppData\Local\Programs\Python\Python313\python.exe
  shapely 2.1.2 installé

python embarqué Codex:
  C:\Users\ronan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe
  shapely absent
```

Règle à appliquer pour la suite du chantier OSCAR :

- utiliser `node` système ;
- utiliser `python` système ;
- éviter le Python embarqué Codex pour les scripts qui dépendent de `shapely`.

Autre instance de conversation testée par l'utilisateur :

```text
Mode vérifié : workspace-write avec profil de permissions géré/restrictif.
Écriture dans le workspace : OK.
Écriture hors workspace : refusée, comme attendu.
Lecture hors workspace : autorisée au moins pour C:\Windows\win.ini.
```

Conclusion : poursuivre de préférence dans cette autre instance, où les écritures
workspace fonctionnent sans demandes d'autorisation intempestives.

## Points d'attention pour la reprise

- Ne pas confondre les deux previews :
  - `courants-copernicus-jaillot-centerlines-stitched-preview.svg` contrôle la
    couture depuis le SVG final ;
  - `courants-copernicus-jaillot-grid-final-centerlines-preview.svg` contrôle
    le champ après rasterisation vers grille moteur.
- Le champ moteur n'est plus clippé par `oceanBounds`.
- Les calques `*_cropped` sont exclus.
- `js/oscar-grid.js` est actuellement modifié et doit être contrôlé visuellement
  avant commit.
- Les scripts ajoutés sont hors dépôt Git, dans `Accessoires site pavillon noir`.

## Suite session 64 - SVG complet avec Pacifique

Demande utilisateur : poursuivre la session 64 sans créer `REPRISE_65.md`, puis
générer un SVG complet pour permettre de corriger la dernière grille produite et
d'intégrer le sous-domaine Pacifique dans la déformation manuelle.

Script ajouté :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_complete_deformation_svg.py
```

Rôle :

- conserver intact le travail manuel déjà présent dans
  `courants-copernicus-marionnette-subdomains-FINAL.svg` ;
- extraire le Pacifique depuis
  `courants-copernicus-jaillot-atlantic-smooth-cap70-soft.svg` ;
- normaliser le bloc Pacifique dans un groupe `pacific` ;
- réécrire les ids Pacifique au format compatible avec l'import retour :
  `node_pacific_rNNN_cNNN_src_copernicus_q_NNNNN` et
  `arrow_pacific_rNNN_cNNN_src_copernicus_q_NNNNN`.

Exports produits :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-COMPLETE.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-COMPLETE-report.json
```

Contrôles effectués :

```text
XML OK
pacific nodes: 2409
pacific arrows: 2409
pacific quads: 3564
cropped ids conservés: 191
oceanbounds: 2
```

Note de suite : les scripts d'import/rasterisation actuels restent centrés sur
les domaines Atlantique et conservent encore le Pacifique depuis l'ancien
`oscar-grid.js`. Après export manuel du SVG complet corrigé, il faudra adapter
`gen_oscar_stitched_centerlines.py` et `gen_oscar_grid_from_final_svg.py` pour
inclure `pacific` dans `DOMAIN_ORDER` et remplacer la logique
`pacific preserved`.

## Suite session 64 - Précaution console et SVG Atlantique suturée

Remarque utilisateur : les problèmes de mojibake, UTF-8/UTF-16 et CRLF/LF ont
été un fléau constant du projet, PowerShell ayant régulièrement aggravé le
diagnostic. `AGENTS.md` a été complété pour demander aux futures instances de
privilégier `cmd.exe` pour les commandes simples et de limiter PowerShell,
surtout pour les lectures/écritures de texte accentué.

Demande utilisateur : le SVG `COMPLETE` précédent utilisait `FINAL.svg` comme
base, mais `FINAL.svg` correspond encore à la dernière itération de déformation
bloc par bloc. Pour les petites retouches à venir, produire plutôt un SVG de
travail avec une couche Atlantique unifiée après couture des overlaps.

Script ajouté :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_unified_sutured_deformation_svg.py
```

Rôle :

- relire `courants-copernicus-marionnette-subdomains-FINAL.svg` ;
- utiliser la logique de `gen_oscar_stitched_centerlines.py` pour moyenner les
  nodes/flèches partagés entre domaines ;
- produire une seule couche `atlantic` avec ids compatibles import retour :
  `node_atlantic_rNNN_cNNN_src_copernicus_q_NNNNN` et
  `arrow_atlantic_rNNN_cNNN_src_copernicus_q_NNNNN` ;
- ajouter un calque `stitched_nodes_control` pour matérialiser les 213 points de
  couture ;
- ajouter le Pacifique normalisé comme dans le SVG complet précédent.

Exports produits :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-sutured-atlantic-COMPLETE.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-sutured-atlantic-COMPLETE-report.json
```

Contrôles effectués :

```text
XML OK
atlantic nodes: 7572
atlantic arrows: 7572
stitched markers: 213
pacific nodes: 2409
pacific arrows: 2409
oceanbounds: 2
audit texte dépôt: OK
```

Note : dans ce SVG suturé, les éléments `*_cropped` ne sont plus présents, car
ils ont déjà été exclus par la passe de couture. Cette variante est plus adaptée
aux petites retouches globales Atlantique que le SVG `FINAL` par blocs.

Correction immédiate : le premier export suturé n'avait que le `viewBox`
`0 0 8500 5320` sur la racine SVG. Illustrator l'ouvrait donc en
`8192 * 5320 px` au lieu de `8500 * 5320 px`. Le générateur
`gen_oscar_unified_sutured_deformation_svg.py` a été corrigé pour écrire aussi
`width="8500px"` et `height="5320px"` sur la balise racine, puis le SVG suturé a
été régénéré. Contrôle XML : racine `width=8500px`, `height=5320px`,
`viewBox=0 0 8500 5320`.

## Suite session 64 - Reprise depuis courants-marionnette.svg

Après plusieurs bugs Illustrator, l'utilisateur n'a pas pu déformer la nappe
Atlantique unifiée. Il est donc reparti de `FINAL` en important le bloc
Pacifique. La nouvelle source à recoudre est :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-marionnette.svg
```

Les scripts `gen_oscar_stitched_centerlines.py` et
`gen_oscar_grid_from_final_svg.py` ont été adaptés pour traiter `pacific` comme
un domaine de première classe. Les valeurs par défaut des deux scripts pointent
désormais vers `courants-marionnette.svg`.

Changement important côté grille : si le SVG source contient Pacifique, l'ancien
Pacifique de `js/oscar-grid.js` n'est plus conservé. Le Pacifique est alors
rasterisé depuis le SVG, comme les autres domaines.

Exports produits :

```text
Sources\courants-marionnette-centerlines-stitched-preview.svg
Sources\courants-marionnette-centerlines-stitched-report.json
Sources\courants-marionnette-grid-final-centerlines-preview.svg
Sources\courants-marionnette-grid-final-report.json
C:\AI\Site Pavillon Noir\pavillon-noir\js\oscar-grid.js
```

Résultat couture :

```text
centerlines: 8934
coutures: 213
cropped exclus: 0
flèches manquantes: 0
```

Résultat rasterisation :

```text
vecteurs: 8934
cellules SVG: 7626
cellules Pacifique SVG: 1483
cellules totales: 7626
pacificCellsPreserved: 0
cropped exclus: 0
coutures: 213
vitesses source manquantes: 0
```

Validations effectuées :

```text
node --check .\js\oscar-grid.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
node .\tools\audit-text-integrity.js --strict-eol
```

Résultat : OK.

Contrôle statique complémentaire demandé après validation visuelle du preview
`courants-marionnette-grid-final-centerlines-preview.svg` :

- `carte.html` charge bien `js/oscar-grid.js`.
- `tools\zone-editor.html` charge bien `..\js\oscar-grid.js`.
- `navigation-jaillot.js` lit bien la grille via `OSCAR_GRID`.
- Chargement VM minimal de `oscar-grid.js` seul : OK.
- Chargement VM minimal de `oscar-grid.js` + `navigation-jaillot.js` : OK.
- Appels de `NavigationJaillot.courantEnPoint` sur une cellule réelle de chaque
  domaine : OK pour `atlantic`, `pacific`, `caribbean`, `gulf_mexico`,
  `bahamas`, `florida`.

Synthèse grille contrôlée :

```text
version: 5
cellSizePx: 50
cellules: 7626
pacific: 1483
gulf_mexico: 1002
caribbean: 2355
florida: 311
bahamas: 648
atlantic: 1827
badNumericFields: 0
maxSpeedKnot: 2.719
```

Ce contrôle ne remplace pas un test fiable côté interface. Le pilote actuel de
`carte.html` reste trop maladroit pour servir de banc de validation. La suite
fonctionnelle devra plutôt être menée dans `Zone Editor -- SÉMAPHORE` lors de
la prochaine session.

## Piste suivante - overlay maritime graphique

Avant de revenir au pilote et au contrôle maritime, il faudra prévoir un export
graphique distinct de la preview technique des centerlines. La version actuelle
est satisfaisante pour le contrôle, mais trop dense et trop moderne pour
l'overlay maritime visible dans `carte.html`.

Orientation retenue :

- produire un SVG graphique simplifié, sans marqueurs de couture ;
- diminuer nettement la densité des centerlines visibles ;
- lisser les tracés pour obtenir une lecture plus cartographique ;
- regrouper les lignes par grands courants ou faisceaux lisibles ;
- utiliser l'épaisseur pour suggérer l'importance relative des courants, mais
  de façon modérée ;
- éviter toute esthétique ou information trop contemporaine : les données
  disponibles pour l'époque restent limitées, donc le rendu doit rester
  interprétatif, sobre et compatible avec la carte Jaillot ;
- conserver Atlantique et Pacifique disjoints dans le dessin, comme dans la
  grille validée.

Nom possible pour cette future sortie :

```text
Sources\courants-marionnette-overlay-simplified.svg
Sources\courants-marionnette-overlay-simplified-report.json
```
