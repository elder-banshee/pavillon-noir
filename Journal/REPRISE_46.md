# REPRISE_46 - Overlay maritime et donnees mer

Date: 2026-06-22 / 2026-06-23

## Etat general

Session consacree a l'overlay maritime MJ, a la correction durable des geometries de courants issues du SVG, a la separation geometries/metadonnees dans `sea-data.js`, aux fiches hauts-fonds et a quelques ajustements visuels/interaction.

Le SVG source des courants a ete verifie comme propre. Les problemes de tourbillons brises venaient de la conversion Python vers `sea-data.js`, pas du rendu Leaflet.

## Conversion SVG des courants

`Accessoires site pavillon noir/Outils generation/gen_sea_data.py` a ete corrige:

- lecture des `path` remplis en sous-chemins continus;
- fermeture implicite des sous-chemins ouverts mais remplis, comme dans le rendu SVG navigateur;
- reconstruction des formes composees en anneaux:
  - les grands anneaux deviennent des exterieurs;
  - les anneaux contenus deviennent des trous;
- application de cette logique aux zones de courants et de hauts-fonds en `path`;
- usage de `courants-01.svg` comme source par defaut si `courants.svg` est absent;
- en-tete genere indiquant le nom reel du SVG source.

Les rustines runtime de `js/carte.js` pour reconstruire les anneaux brises ont ete supprimees. Le rendu carte conserve la normalisation de `zone`, `zone.polygons` et `{ exterior, holes }`, puis rend les polygones Leaflet avec `fillRule: 'evenodd'`.

Validation des tourbillons:

```text
tourbillon_texan_r2 polygons=1 holes=1
tourbillon_panameen_r2 polygons=1 holes=1
tourbillon_cubain_r2 polygons=1 holes=1
tourbillon_haitien_r2 polygons=1 holes=1
tourbillon_de_campeche_r3 polygons=1 holes=1
```

## Architecture `sea-data.js`

`js/sea-data.js` a ete restructure pour eviter qu'un export SVG ecrase les valeurs MJ remplies au cas par cas.

Convention retenue:

- `SEA_CURRENT_GEOMETRY`: section exportable/remplacable depuis `gen_sea_data.py`.
- `SEA_CURRENT_META`: metadonnees manuelles des courants (`label`, `priorite`, `force`, `speedKmh`, `speedSegments`, textes, etc.).
- `SEA_CURRENTS`: tableau final reconstruit par fusion, conserve pour compatibilite avec `carte.js`.
- `SEA_SHOAL_GEOMETRY`: section exportable/remplacable pour les hauts-fonds.
- `SEA_SHOAL_META`: metadonnees manuelles des hauts-fonds.
- `SEA_SHOALS`: tableau final reconstruit par fusion.

`gen_sea_data.py` ne produit plus que `SEA_CURRENT_GEOMETRY` et `SEA_SHOAL_GEOMETRY`.

Verification supplementaire:

```text
currents 26 geometry 26 meta 26
shoals 4 geometry 4 meta 4
tourbillon_texan_r2 priorite=2 force=2 speed= segments=0 holes=1
tourbillon_panameen_r2 priorite=2 force=2 speed= segments=0 holes=1
tourbillon_de_campeche_r3 priorite=3 force=1 speed=2 segments=0 holes=1
guyanes_gulf_stream_r1 priorite=1 force=3 speed= segments=4 holes=0
```

## Editeur Courants

`tools/zone-editor.html` a ete adapte pour devenir le point de fusion pratique:

- bouton `Charger un export geometrique`;
- import d'un fichier produit par `gen_sea_data.py` (`SEA_CURRENT_GEOMETRY` / `SEA_SHOAL_GEOMETRY`);
- prise en charge d'anciens exports monolithiques contenant `SEA_CURRENTS` / `SEA_SHOALS`;
- fusion en memoire en remplacant seulement les geometries (`closed`, `zoneSource`, `centerline`, `directions`, `zone`);
- conservation des metadonnees manuelles existantes;
- export `sea-data.js corrige` au format scinde, compatible avec la carte.

Boucle recommandee:

1. Lancer `gen_sea_data.py` pour produire un export geometrique.
2. Ouvrir l'editeur, onglet `Courants`.
3. Cliquer `Charger un export geometrique`.
4. Exporter `sea-data.js corrige` depuis l'editeur.
5. Remplacer `pavillon-noir/js/sea-data.js` par ce fichier telecharge.

Verification editeur:

```text
inline scripts ok 1
```

## Hauts-fonds et regles de navigation

Les informations documentaires et de jeu des hauts-fonds sont stockees dans `SEA_SHOAL_META`, dans `js/sea-data.js`.

Champs introduits:

- `cat_taille`: categorie maximale autorisee sans condition;
- `maxCategorieTaille`: plafond dur conserve pour le routeur actuel;
- `condition_navigation`: passage conditionnel a implementer plus tard;
- `categories_interdites`: categories explicitement interdites;
- `risque`: effet de jeu en cas de passage impossible ou mal gere;
- `contexte`: texte documentaire affiche dans le panneau maritime;
- `note_mj`: note confidentielle affichee seulement en mode MJ.

Regles encodees:

- Banc des Bahamas: categories 1-2 libres, categorie 3 si Navigation > 1, categories 4-5 interdites.
- Cayman Ridge: categories 1-3 libres, categories 4-5 interdites.
- Banc de Porto Rico: categories 1-2 libres, categorie 3 si Navigation > 2, categories 4-5 interdites.
- Banc de Pedro: categories 1-2 libres, categorie 3 si Navigation > 3, categories 4-5 interdites.

`CARTE_NAVIRE` (`js/carte-data.js`) contient maintenant `categorieTaille: 2` pour le navire des PJ.

Controle donnees:

```text
navire cat=2
banc_des_bahamas libre=2 max=3 interdit=4,5 cond=3/Navigation>1
banc_de_cuba libre=3 max=3 interdit=4,5
banc_de_porto-rico libre=2 max=3 interdit=4,5 cond=3/Navigation>2
banc_de_jamaique libre=2 max=3 interdit=4,5 cond=3/Navigation>3
```

## Panneau maritime

Le panneau de consultation maritime a ete reorganise:

- en-tete type + icone conserve;
- titre/nom conserve;
- suppression de la ligne redondante `Categorie`;
- donnees techniques reservees au MJ;
- `Risque` reserve au MJ;
- `Contexte` renomme `Description` et visible hors MJ;
- `Note confidentielle - MJ` conservee et reservee au MJ.

Pour les hauts-fonds, le panneau MJ affiche desormais:

- `Passage libre`;
- `Passage conditionnel`;
- `Interdit`.

Les courants suivent le meme modele: en-tete, titre, donnees/segments MJ, description visible, note MJ si disponible.

## Boutons d'overlay et affichage maritime

Ajustements visuels:

- icone du bouton maritime remplacee par le glyphe texte `≋`;
- couleur maritime passee a un turquoise distinct;
- survol d'un bouton inactif: bordure et icone prennent la couleur active du mode;
- survol d'un bouton actif: le fond reste stable, seules la bordure et l'icone passent a une teinte plus claire;
- sous-menu maritime harmonise avec les autres controles d'overlay.

Filtrage des marqueurs en mode maritime (`renderVilles()`):

- les ports restent visibles;
- les villes, forts et sites sont masques;
- une entree non-port redevient visible si elle possede explicitement une `rade: [x, y]`;
- quand une rade existe, le marqueur maritime utilise les coordonnees de rade.

Controle donnees actuel:

```text
VILLES total=187
maritimeShown=71
ports=71
nonPortsWithRade=[]
```

## Verifications

Commandes passees pendant la session:

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_sea_data.py"
node --check .\js\carte.js
node --check .\js\sea-data.js
node --check .\js\carte-data.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte-mobile.js
git diff --check
```

`git diff --check` ne signale que les avertissements CRLF habituels sur les fichiers deja touches.

## Points a reprendre

- Le routeur Jaillot utilise encore seulement `maxCategorieTaille`. Il interdit donc les categories 4-5 dans les hauts-fonds concernes, mais ne tient pas encore compte des seuils `condition_navigation` pour arbitrer la categorie 3 selon la competence Navigation.
- Les donnees actuelles ne contiennent encore aucun non-port avec une rade explicite. La regle est prete cote rendu: ajouter `rade: [x, y]` dans le bloc d'une ville, d'un fort ou d'un site suffit pour l'afficher en overlay maritime.
- L'overlay maritime desktop est implemente; le mobile n'a pas encore de rendu equivalent.
