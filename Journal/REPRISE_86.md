# REPRISE_86 — Co-implémentation des grilles macro carrée et OCEAN

Session du 14 août 2026, à la suite de `REPRISE_85.md`.

## Objectif

Conserver la grille carrée historique de 50 px comme référence, ajouter la
grille hexagonale OCEAN comme second moteur macro du Pilote automatique et
permettre une comparaison à règles de navigation constantes avant toute
bascule définitive.

Le mode MJ est temporairement forcé sur la branche `dev` par
`FORCER_MODE_MJ = true` dans `js/carte.js`. Remettre cette constante à `false`
restaure la séquence secrète.

## Architecture mise en place

- Deux caches macro indépendants : `carree` et `ocean`.
- La grille carrée conserve son espacement de 50 px, ses huit voisins et ses
  quatre arêtes longues de louvoyage.
- La grille OCEAN transforme les cellules navigables existantes en nœuds A* et
  utilise leur voisinage hexagonal odd-r à six directions.
- Les deux moteurs partagent strictement les mêmes fonctions de coût, physique
  de navigation, collisions, restrictions de navire et approches fines.
- Les grilles régionale de 12 px et locale de 8 px restent inchangées.
- Les arêtes OCEAN continuent à être validées par `coutSegmentGrille()` : deux
  cellules maritimes voisines ne peuvent donc pas créer un passage à travers
  une terre.

Le moteur actif reste `carree` par défaut. Il est sélectionnable depuis
l'encadré **Test MJ > Grille macro** du calculateur.

## Outil de comparaison

Le bouton **Comparer** exécute successivement les deux moteurs sur le même
départ et la même arrivée. Le comparateur expose aussi une API de diagnostic :

- `NavigationJaillot.comparerGrilles(depart, arrivee)` ;
- `NavigationJaillot.comparerGrillesEntrePorts(depart, arrivee)` ;
- `NavigationJaillot.mesurerRouteAvecMoteur(moteur, depart, arrivee)` ;
- `NavigationJaillot.setMoteurGrilleMacro(moteur)` ;
- `NavigationJaillot.getDerniereComparaisonGrilles()`.

Les mesures comprennent la durée totale, la construction de grille, le nombre
de nœuds de grille, les itérations et nœuds visités par l'A* macro, le nombre de
points de route, la distance et la durée de navigation calculée. Par défaut,
les caches propres à chaque essai sont vidés et la grille du moteur mesuré est
reconstruite. Les index géométriques communs sont préchauffés avant le
chronométrage afin de ne pas pénaliser arbitrairement le premier moteur.

## Premiers résultats observés

Mesures navigateur local, à considérer comme un premier ordre de grandeur et
non comme un benchmark statistique :

| Route | Carrée | OCEAN |
| --- | --- | --- |
| Nassau → Charles Town | ~3 770 ms ; 3 211 itérations ; 1 976 nœuds visités | ~933 ms ; 466 itérations ; 390 nœuds visités |
| Nassau → Tampico | ~1 423 ms ; 28 itérations ; 24 nœuds visités | ~1 464 ms ; 82 itérations ; 81 nœuds visités |
| Nassau → Carthagène de Indias | ~747 ms ; 158 itérations ; 145 nœuds visités | ~804 ms ; 296 itérations ; 206 nœuds visités |

Sur Nassau → Charles Town, les routes tracées diffèrent fortement :

- OCEAN : 734 milles, 9 j 13 h ;
- carrée : 1 369 milles, 15 j 10 h.

Cela montre que la comparaison doit porter à la fois sur les performances, la
réussite, la longueur et la qualité géographique de la route. OCEAN est très
nettement meilleure sur ce cas, tandis que la grille carrée reste légèrement
plus rapide et plus économe en nœuds sur deux trajets caribéens testés.

## Validation

- `node --check js/navigation-jaillot.js` : OK.
- `node --check js/carte.js` : OK.
- `tools/audit-text-integrity.js` : 0 erreur, un avertissement préexistant sur
  la fin de fichier de `tools/fluvial-research/staging/_master_table.txt`.
- `git diff --check` : OK.
- Mode MJ forcé, sélecteur de grille et bouton de comparaison présents dans la
  carte locale.
- Traçage réussi avec les deux moteurs sur Nassau → Charles Town.

## Suite recommandée

Construire un corpus fixe d'itinéraires hauturiers, côtiers, fluviaux,
portuaires et impossibles, puis répéter chaque mesure plusieurs fois. Vérifier
visuellement les fortes divergences de tracé avant d'envisager de faire
d'OCEAN le moteur par défaut. Les six voisins OCEAN sont suffisants pour les
routes testées, mais des arêtes longues adaptées à l'hexagone pourront être
évaluées si d'autres cas révèlent un louvoyage insuffisant.
