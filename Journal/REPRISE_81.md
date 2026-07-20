# REPRISE_81 — Réconciliation des branches `main` et `dev`

Session du 19 juillet 2026, à la suite de `REPRISE_80.md`.

## Diagnostic

Les branches avaient divergé depuis `ae0c29f` (`REPRISE_76`) : `main`
comptait quatorze commits propres et `dev` deux commits propres (`5784f48`,
`cfb8265`). Le second avait enregistré par erreur des marqueurs de conflit
`Updated upstream` / `Stashed changes` dans sept fichiers JavaScript de Zone
Editor, ce qui rendait cette branche invalide.

La comparaison des arbres a montré que les apports légitimes de `dev` étaient
déjà présents sur `main` :

- `js/zones-data.js` était strictement identique sur les deux branches ;
- les archives, rapports, outils de synchronisation et reprises 77 à 79 ajoutés
  par `5784f48` étaient déjà identiques sur `main` ;
- les seules divergences Zone Editor correspondaient aux fichiers non résolus
  de `dev`, tandis que `main` contenait leurs versions propres et plus récentes.

## Réparation

Une branche locale de sauvegarde `backup/dev-before-repair-20260719` conserve
le sommet cassé `cfb8265`. `main` a ensuite été fusionnée dans `dev` en retenant
ses résolutions pour les fichiers en conflit. Avant ajout de cette reprise,
l'index fusionné était strictement identique à l'arbre de `main`.

Le push éventuel de `dev` reste volontairement séparé de la réparation locale.

## Validation

Les contrôles suivants sont passés sur l'état fusionné :

- `node --check js/carte.js`
- `node --check js/navigation-jaillot.js`
- `node --check js/carte-mobile.js`
- `node --check` sur les sept modules JavaScript Zone Editor réparés
- `node tools/audit-text-integrity.js --strict-eol`
- recherche globale de marqueurs de conflit dans les fichiers texte du dépôt

## Suite — Dernière actualisation d’oceanBounds

Le nouveau SVG source
`Accessoires site pavillon noir/Sources SVG/oceanBounds.svg` a été audité :
`8500 × 5320`, `viewBox="0 0 8500 5320"`, XML et paths valides, tous les
sous-contours fermés, aucune coordonnée non finie ni hors canevas. SVGOMG
avait supprimé les IDs et fusionné le fleuve Bariana avec le Pacifique.

Une sauvegarde hors dépôt, `oceanBounds.before-bariana-split.svg`, conserve
la version optimisée reçue. Le sous-contour Bariana a été séparé sans
rééchantillonnage et les trois formes portent désormais les IDs :

- `fleuve-bariana` ;
- `ocean-bounds-pacifique` ;
- `ocean-bounds-atlantique`.

Le générateur `Accessoires site pavillon noir/Outils generation/gen_sea_data.py`
a été adapté hors dépôt pour reconnaître ces trois emprises. Le bloc
`ZONES_OCEAN_BOUNDS` de `js/zones-data.js` a ensuite été remplacé par sa
sortie contrôlée, sans rognage : Bariana compte 407 points, l’extérieur
Atlantique 14 179 points et l’extérieur Pacifique 2 605 points.

Le synchroniseur `tools/sync-oscar-hex-grid-ocean-bounds.js` reconnaît
maintenant Bariana comme domaine Pacifique et valide explicitement les trois
IDs. Un mode `--preserve-existing` a été ajouté afin de satisfaire la règle
de conservation stricte : les cellules historiques hors nouvelle emprise
sont consignées dans le rapport, jamais supprimées.

La synchronisation finale a conservé sans aucune modification les 14 061
cellules existantes et ajouté 667 cellules calmes (491 Atlantique, 176
Pacifique), pour un total de 14 728. Les 24 cellules que le mode historique
aurait supprimées sont conservées et signalées dans le rapport.

Validation complémentaire :

- `node --check js/zones-data.js`
- `node --check js/oscar-hex-grid.js`
- `node --check js/navigation-jaillot.js`
- `node --check tools/sync-oscar-hex-grid-ocean-bounds.js`
- comparaison exhaustive avant/après des 14 061 cellules historiques
- contrôle des 667 ajouts (`calme: true`, `source: 'calm'`, vitesse nulle)
- `node tools/audit-text-integrity.js --strict-eol`
- `git diff --check`

## Suite — Actualisation du masque visuel oceanBounds

`tools/assets/oceanbounds-mask.svg`, utilisé comme fond visuel dans Zone
Editor, a été mis en conformité avec la dernière version d’oceanBounds et ses
fleuves.

Le masque historique à deux paths a été remplacé par un dérivé direct du SVG
source actualisé. Il contient désormais les trois emprises :

- `fleuve-bariana` ;
- `ocean-bounds-pacifique` ;
- `ocean-bounds-atlantique`.

Les attributs `d` sont strictement identiques à ceux du SVG source : aucune
simplification, conversion en coordonnées discrètes ou perte de courbes. Seul
le rendu propre au masque a été normalisé en bleu `#55c3ec` avec
`fill-opacity="1"`, conformément au comportement historique de l’overlay dans
Zone Editor.

Validation du masque :

- dimensions et `viewBox` conservés à `8500 × 5320` ;
- trois paths et IDs attendus présents ;
- 28 345 segments et 895 sous-contours analysables ;
- tous les sous-contours fermés ;
- égalité SHA-256 de chaque attribut `d` entre la source et le masque ;
- audit texte strict et `git diff --check` réussis.

## Suite — Amorçage des zones côtières de navigation

La zone côtière est définie comme une catégorie fonctionnelle de cabotage et
non comme un modèle général de houle. Le cas automatique retenu est une bande
de 30 milles nautiques mesurée dans le référentiel volontairement déformé de
Jaillot. Seules les composantes terrestres dont la superficie cartographique
est supérieure ou égale à la plus grande composante de Porto Rico produisent
cette bande. Les cellules déjà taguées `natureNav: 'fluviale'` ont priorité et
sont exclues.

Le générateur non destructif
`tools/coastal-navigation/generate-coastal-navigation.js` et sa configuration
ont été ajoutés. Il calcule le seuil par la formule du lacet, convertit 30 NM
avec l'échelle Jaillot existante (`0,310282 NM/px`), ignore explicitement les
anciens polygones `banc-*`, et prévoit deux extensions déclaratives : petites
terres en liste blanche et bassins de cabotage polygonaux.

Première simulation, sans écriture dans `js/oscar-hex-grid.js` :

- seuil Porto Rico : `24 019 px²` ;
- rayon : `96,69 px` ;
- 24 composantes terrestres automatiques ;
- 2 255 cellules côtières proposées sur 14 728 ;
- 1 285 cellules fluviales exclues prioritairement.

Un rapport JSON et un SVG de contrôle sont produits dans le même dossier. Les
bassins convenus (Venezuela, sud de Cuba, Honduras/Bélize, Campêche, Bahamas)
et les listes blanches archipélagiques restent à dessiner et valider avant tout
passage avec `--write`.

Dans Océanographie, le filtre `domain` est désormais présenté comme une
« Région » de travail, afin de ne plus lui attribuer de portée topologique.
L'éditeur de cellule permet de modifier cette région, y compris par lot, et
propose la nouvelle valeur `bariana` (« Fleuve Bariana »). Cette modification
est indépendante du courant et de `natureNav`.

### Ajout de la première liste blanche insulaire

L'aperçu de la règle automatique seule a été conservé sans modification sous
`coastal-navigation-preview-auto-threshold.svg`. Le format de configuration
accepte désormais soit toutes les composantes d'une zone, soit une liste de
contours numérotés à partir de 1 comme dans Zone Editor.

La liste blanche ajoute Trinidad, Grenade, Saint-Vincent, Sainte-Lucie,
Martinique, Dominique, Guadeloupe, Leeward Islands, Saint-Christophe,
Saint-Barth, Saint-Martin, Sainte-Croix, les Îles Vierges britanniques,
Saint-Thomas, Marguerita, Tortuga et les trois contours de Curaçao. Elle ajoute
aussi uniquement `venezuela` 2/2 et `nouvelle-andalousie` 2/13 et 3/13.

Contrôle de configuration : 55 composantes en liste blanche, avec vérification
bloquante de l'existence des zones et de chaque numéro de contour. Le nouvel
aperçu `coastal-navigation-preview.svg` propose 2 594 cellules côtières, contre
2 255 pour la règle automatique seule. La grille canonique reste inchangée.

### Régimes de navigation mixtes

Le contrôle visuel a relevé un faux positif côtier, `109_149`, qui est en fait
une cellule fluviale oubliée. Elle est désormais déclarée dans
`forcedFluvialCells` : le générateur l'exclut immédiatement de l'aperçu et la
taguera `fluviale` lors de la future écriture canonique. Le résultat passe à
2 593 cellules côtières et 1 286 cellules fluviales exclues.

Certaines cellules contiennent réellement plusieurs régimes : fleuve et côte
près des embouchures, ou haute mer et cabotage dans des corridors ouverts aux
grands vaisseaux. Le nouveau champ `naturesNav` accepte donc plusieurs valeurs
parmi `fluviale`, `cotiere` et `hauturiere`, tout en conservant la lecture de
l'ancien `natureNav` pour les cellules simples.

Zone Editor propose les combinaisons dans le formulaire Océanographie et
affiche les cellules mixtes avec une bordure violette. Dans le moteur, un navire
n'est bloqué dans une cellule mixte que si tous les régimes disponibles lui
sont interdits. Le générateur préserve ces combinaisons au lieu de les écraser
lors d'un futur passage avec `--write`.

### Clôture de l'automatisation côtière

Après contrôle du SVG, la bande automatique et sa liste blanche définissent
naturellement les bassins envisagés avec une précision suffisante. La règle
supplémentaire par polygones de bassins est abandonnée : les raccords et les
cellules mixtes seront complétés manuellement dans Océanographie. Le code et la
configuration inutilisés de `coastalBasins` ont été retirés du générateur.

La zone des Bahamas reste volontairement différée. Elle sera complétée par
édition manuelle lorsque les hauts-fonds définitifs auront fourni la géométrie
de référence du plateau, des chenaux et des dangers associés.

### Application à la grille canonique

Après validation visuelle, le générateur a été exécuté avec `--write` sur
`js/oscar-hex-grid.js`. Les 2 593 cellules de la sélection automatique portent
désormais le régime côtier ; 45 étaient déjà correctement taguées et 2 548 ont
donc reçu une nouvelle donnée côtière. La cellule `109_149` a été corrigée en
`fluviale`, pour un total de 2 549 cellules modifiées.

L'audit exhaustif avant/après confirme : 14 728 cellules conservées, aucune
modification des coordonnées, courants, domaines ou autres données, aucune
cellule côtière attendue manquante, et rapport de génération marqué `write`.

## Suite — Refonte des filtres Océanographie

Le menu de filtre unique de Zone Editor a été remplacé par un encadré développé
à cases à cocher. Les critères sont combinés par union dans une section et par
intersection entre sections :

- Nature : Haute-mer, Fluviale, Côtière, Multiple, Non renseignée ;
- Courants : Renseigné, Double, Non renseigné.

Les catégories sont exclusives dans chaque section. Pour les courants,
« renseigné » dépend désormais de la présence réelle d'une source ou d'un
vecteur, jamais d'un seuil arbitraire de vitesse. Les courants Copernicus faibles
comme `45_121` (0,061 nd) et `91_14` (0,057 nd) ne sont donc plus assimilés à
des cellules calmes sans donnée. Répartition contrôlée : 11 661 courants
principaux renseignés, 297 doubles et 2 770 non renseignés, soit 14 728.

Le rendu sépare maintenant les dimensions : remplissage selon l'intensité du
courant, flèche selon son vecteur, bordure selon la nature. Les cellules
multi-natures portent une bordure violette. Les doubles courants reçoivent une
seconde bordure azur plus fine, superposée à l'intérieur de la bordure de
nature. Haute-mer explicite et nature non renseignée restent distinguables.

L'éditeur permet désormais de saisir explicitement « Haute mer » ou « Non
renseignée » et marque la provenance d'une nature éditée avec
`natureNavSource: 'manual'`, sans transformer pour autant le courant en donnée
manuelle. Le générateur côtier préserve une haute-mer explicite en créant une
cellule mixte haute-mer/côtière lors d'une éventuelle régénération.

Validation dans Zone Editor servi localement : panneau complet et réinitialisation
fonctionnels, 1 286 cellules avec le seul filtre Fluviale, 297 avec le seul
filtre Double, et une seule cellule avec la combinaison Fluviale + Double.
Aucune erreur console.

### Ajustements après contrôle détaillé

- ajout canonique de `88_68`, cellule calme du domaine Atlantique explicitement
  forcée comme fluviale malgré l'absence de passage du méandre par son centre ou
  ses sommets ; le générateur sait désormais créer cette exception géométrique ;
- affichage de la nature dans la fiche d'information de chaque cellule ;
- ajout d'un état éditorial explicite « Courant nul renseigné (calme) », distinct
  des cellules calmes générées sans donnée ;
- indépendance des sections de filtres : une section entièrement décochée ne
  contraint plus l'autre ;
- rendu contextuel des cellules multi-natures (couleur de la nature isolée,
  violet pour « Multiple » ou plusieurs natures simultanément sélectionnées) ;
- haute-mer en bleu sombre et double-courant dessiné sur un hexagone intérieur,
  sans recouvrir la bordure de nature.

Le rendu des deux sections est finalement rendu strictement indépendant : sans
sélection de courant, les cellules n'ont ni remplissage ni flèche et seule leur
bordure de nature demeure ; sans sélection de nature, le courant reste coloré
mais aucune bordure extérieure n'est dessinée. L'ombre azur qui débordait de
l'hexagone intérieur des doubles courants a été supprimée.

Un second contrôle a identifié un ancien calque de diagnostic qui redessinait
encore les doubles courants en azur sur leur contour extérieur. Ce doublon a été
retiré : seule demeure la bordure azur intérieure, ramenée à 70 % du rayon de
la cellule. Les traits de nature et de double courant ont désormais une largeur
fonction du zoom, fine en vue d'ensemble et progressivement renforcée en vue
rapprochée. Le masque maritime est affiché à 78 % d'opacité afin que les
bordures côtières restent lisibles sur son fond bleu.

## Clôture de la session 81

La session est close sur une grille canonique de 14 729 cellules et une
modélisation stabilisée des natures de navigation : haute-mer, côtière,
fluviale et combinaisons multiples. La bande côtière automatique est appliquée,
les exceptions `88_68` et `109_149` sont fluviales, et Zone Editor permet
d'inspecter et d'éditer séparément nature et courants.

Le point « marée et houle » est considéré comme partiellement résolu : la houle
est principalement traduite par la nature côtière, tandis que la marée ne sera
pas modélisée uniformément. Elle interviendra dans les métadonnées des bancs,
chenaux, passes et zones à risque où ses effets sont réellement structurants,
notamment aux Bahamas.

La suite du chantier est synthétisée hors dépôt dans
`C:\AI\Site Pavillon Noir\Prompts\feuille-de-route-chantier-oceanographie.md`.
