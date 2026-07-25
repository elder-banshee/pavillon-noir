# REPRISE_83 — Synchronisation Ocean Bounds et lisibilité dans Zone Editor

Session des 24 et 25 juillet 2026, à la suite de `REPRISE_82.md`.

## Nouvelles cellules navigables

Après les corrections manuelles de `ZONES_OCEAN_BOUNDS`, le synchroniseur
`tools/sync-oscar-hex-grid-ocean-bounds.js` a été adapté à la structure
actuelle, qui ne contient plus l’ancienne entité séparée `fleuve-bariana`.
Le garde-fou attend désormais uniquement les emprises Atlantique et Pacifique.

La grille OSCAR a été synchronisée en mode `--preserve-existing --write` :

- 14 cellules calmes ajoutées dans le domaine Atlantique ;
- 14 729 cellules existantes conservées sans modification ni recalcul ;
- aucune cellule supprimée ;
- 61 cellules existantes hors des nouvelles emprises préservées ;
- l’exception topologique `64_123` reste conservée.

Les cellules ajoutées sont `12_46`, `13_45`, `14_45`, `15_44`, `93_68`,
`94_68`, `101_153`, `101_154`, `102_153`, `102_154`, `103_151`, `103_153`,
`104_152` et `104_153`.

## Rendu Ocean Bounds

Dans Zone Editor, l’onglet `Topographie → Ocean Bounds` utilise maintenant un
style propre, sans modifier le rendu des territoires et hauts-fonds :

- contour bleu vif par défaut, épaisseur `2` ;
- contour bleu clair au survol, épaisseur `3` ;
- contour bleu clair à la sélection, épaisseur `3,5` ;
- remplissage bleu discret adapté à chaque état.

## Validation

- syntaxe de `carte.js`, `navigation-jaillot.js`, `carte-mobile.js`,
  `zone-editor-core.js`, `zone-editor-map.js`, du synchroniseur et de la grille
  OSCAR ;
- audit d’intégrité textuelle : aucune erreur ;
- un avertissement préexistant subsiste pour l’absence de fin de ligne dans
  `tools/fluvial-research/staging/_master_table.txt`.

## Domaine de travail fluvial

OCÉANOGRAPHIE propose désormais le domaine de travail `fluvial`, affiché
« Fluvial », même avant qu’une cellule de la grille ne l’utilise.

Le synchroniseur Ocean Bounds conserve explicitement une copie inchangée de
chaque cellule existante retenue. Une vérification bloquante compare désormais
les domaines avant et après synchronisation : toute modification d’un domaine
existant, notamment `fluvial`, interrompt la génération. Seules les nouvelles
cellules calmes reçoivent automatiquement `atlantic` ou `pacific` selon
l’emprise qui a justifié leur création.

Le filtre autrefois intitulé « Région » est renommé « Domaine ». Il propose
désormais en permanence « Fluvial » ainsi qu’une entrée « Non renseigné » qui
isole les cellules sans propriété `domain`. Cette valeur de filtre technique
n’est jamais réutilisée comme domaine lors de la création d’une cellule.

## Application des noms fluviaux canoniques

La base finale `tools/fluvial-research/fluvial-database-finale.json` couvre les
203 identifiants techniques présents dans la grille, sans ambiguïté, et fournit
145 noms canoniques. Un remplacement direct de `riverId` était cependant
impossible : 73 cellules contiennent plusieurs bras d’un même cours et auraient
reçu deux identifiants identiques.

Le nouveau script reproductible
`tools/fluvial-research/apply-fluvial-canonical-names.js` applique donc le
schéma suivant :

- `riverId` contient le `nomCanonique`, affiché dans le champ « Identifiant du
  fleuve » de Zone Editor ;
- `courseId` conserve l’identifiant stable et unique du bras ;
- les références topologiques utilisent les `courseId` plutôt que les noms ;
- les vecteurs, domaines et autres propriétés des cellules sont préservés.

Zone Editor utilise désormais `courseId` pour la continuité, l’unicité,
l’édition par lot et la topologie. Lorsque plusieurs bras homonymes cohabitent,
leur `courseId` est ajouté au libellé pour les distinguer, tandis que le champ
éditable conserve uniquement le nom canonique.

Migration appliquée :

- 1 604 vecteurs fluviaux contrôlés et nommés ;
- 203 `courseId` présents ;
- 145 `nomCanonique` présents ;
- 203 débouchés et 89 relations convertis ;
- aucune référence topologique absente ;
- aucun doublon de `courseId` dans une cellule ;
- aucun vecteur ni attribut non fluvial modifié.

La base contient aussi `Suriname_B`, branche absente de la grille actuelle.
Cette absence est consignée dans
`tools/fluvial-research/fluvial-canonical-names-report.json` sans empêcher la
couverture des 145 cours d’eau.

## Schéma fluvial global v2

La topologie fluviale a ensuite été sortie des cellules et normalisée à
l’échelle de la grille :

- `fluvialSchemaVersion: 2` identifie le nouveau format ;
- `fluvialCourses` est le registre des 203 tracés techniques et de leurs
  politiques terminales ;
- `fluvialMouths` contient 123 associations entre un tracé et une cellule
  d’embouchure ;
- `fluvialConnections` contient 103 connexions dirigées : 79 jonctions et
  24 fourches ;
- les anciennes propriétés cellulaires `fluvialOutlets` et
  `fluvialRelations` ont été supprimées ;
- les 65 relations `separate` ont été supprimées : l’absence de connexion est
  désormais la règle implicite ;
- Bariana porte une politique terminale déclarative `unresolved`, sans règle
  générique `map-edge`.

Zone Editor présente de nouveau une simple case « Embouchure dans cette
cellule ». Une seconde case « Embouchure multiple » autorise au moins deux
cellules terminales pour le même tracé ; une seule embouchure avec ce mode
produit l’erreur explicite demandée. Les fourches et jonctions peuvent relier
deux tracés présents dans la même cellule ou dans deux cellules voisines.

Le `courseId` reste immuable et masqué dans le formulaire. Les nouveaux tracés
manuels reçoivent automatiquement un identifiant technique unique. Renommer
le champ visible propage le nouveau nom à tous les bras du même
`watercourseId`, sans modifier leur topologie.

Le modèle distingue les erreurs structurelles des avertissements
cartographiques. Les terminaisons incompatibles, discontinuités, connexions
non adjacentes, doublons et cycles de jonctions sont invalidants. Une
embouchure hors cellule côtière ou une divergence de nom avec le registre est
signalée comme avertissement.

Les scripts ajoutés sont :

- `migrate-fluvial-schema-v2.js`, migration historique et non rejouable ;
- `validate-fluvial-schema-v2.js`, validation autonome de la grille ;
- `apply-fluvial-canonical-names.js`, compatible avec le schéma v2 et
  conservant toutes les données topologiques globales lors d’une future mise
  à jour des noms.

La structure et ses invariants sont documentés dans
`tools/fluvial-research/fluvial-schema-v2.md`.

Validation finale du schéma :

- 203 tracés et 145 cours d’eau enregistrés ;
- 1 604 vecteurs répartis dans 1 449 cellules ;
- 123 sorties maritimes simples, 79 terminaisons par jonction et une exception
  non localisée pour Rio Barania ;
- zéro ancienne propriété topologique cellulaire ;
- zéro erreur et zéro avertissement dans
  `fluvial-schema-v2-validation.json` ;
- simulation de la future réapplication des noms canoniques sans changement
  de nom ni erreur de validation ;
- chargement headless de Zone Editor en mode Océanographie sans erreur
  JavaScript et avec zéro cellule topologiquement invalide ;
- contrôles de syntaxe et audit d’intégrité textuelle réussis. Seul subsiste
  l’avertissement préexistant sur la fin de ligne de
  `tools/fluvial-research/staging/_master_table.txt`.

## Consolidation des embouchures héritées de la v1

La prise en charge des embouchures multiples rend inutiles les tracés
techniques créés uniquement pour donner plusieurs débouchés à un même delta.
Une migration ponctuelle, sans ajout de commande permanente dans Zone Editor,
a donc regroupé les branches maritimes artificielles de huit réseaux :

- Cooper River : 3 embouchures ;
- Mississippi : 2 embouchures ;
- Rio Tabasco : 3 embouchures ;
- Rio Grande de la Madalena : 2 embouchures ;
- Rio Ovarabiche : 2 embouchures ;
- Orénoque : 4 embouchures ;
- Marateka : 2 embouchures ;
- Rio Balsas : 2 embouchures.

Seuls les anciens tracés possédant leur propre sortie maritime ont été
fusionnés. Les bras internes ou affluents terminés par une jonction restent
distincts. Dans les cellules où plusieurs anciens vecteurs se superposaient,
ils ont été remplacés par un vecteur unique utilisant leur vitesse moyenne et
leur direction circulaire moyenne.

Pour l’Orénoque, `orenoque-delta-1`, `orenoque-delta-2` et
`orenoque-delta-3` ont disparu. Les 38 cellules du réseau maritime utilisent
désormais `orenoque-main`, avec les embouchures `100_150`, `100_151`,
`100_152` et `100_153`. La cellule commune `101_150` ne contient plus qu’un
vecteur Orénoque.

Bilan global :

- 190 tracés techniques au lieu de 203 ;
- 1 590 vecteurs au lieu de 1 604 ;
- 122 associations d’embouchure, dont 8 cours en mode multiple ;
- 95 connexions, dont 79 jonctions et 16 fourches ;
- chaque cours fusionné reste dans une composante continue ;
- zéro erreur et zéro avertissement au validateur v2.

La simulation de `apply-fluvial-canonical-names.js` reste valide. Son rapport
liste désormais comme branches absentes les 13 identifiants volontairement
supprimés par cette consolidation, en plus de `Suriname_B`.

## Options fluviales avancées dans Zone Editor

La génération automatique d’un `courseId` empêchait de prolonger un cours
existant depuis une nouvelle cellule : saisir le même nom canonique créait un
nouveau tracé homonyme sans embouchure. Chaque ligne de courant possède
désormais un panneau « Options avancées », replié par défaut.

Ce panneau donne accès à :

- une liste de tous les tracés enregistrés, libellés par nom, code de bras et
  `courseId` ;
- l’identifiant technique du tracé ;
- son `watercourseId` et son code de bras ;
- la source du vecteur ;
- sa politique terminale, son mode d’embouchure et la justification éventuelle
  d’une terminaison non localisée.

Choisir un tracé enregistré rattache uniquement le vecteur de la cellule ou
de la sélection en cours. Le `courseId` enregistré reste stable et en lecture
seule. Pour un nouveau tracé, il peut être saisi manuellement ou généré
automatiquement. Les autres métadonnées avancées restent éditables et les
modifications du registre sont appliquées globalement.

Test fonctionnel réalisé sur Logwood Creek :

- ajout d’un vecteur dans une cellule en choisissant
  `logwood-creek-main` ;
- conservation de l’embouchure existante et du nombre de tracés ;
- correction d’un faux `manual:logwood-creek` par rattachement au tracé
  canonique ;
- suppression automatique du registre devenu orphelin ;
- zéro cellule invalide après chacune des deux opérations.

## Inspecteur fluvial avancé

Une seconde section repliée a été ajoutée dans les filtres d’affichage
d’OCÉANOGRAPHIE pour faciliter la révision de la topologie :

- le menu « Cours d’eau » contient les 145 `watercourseId` du registre et
  regroupe automatiquement leurs différents tracés techniques ;
- le cours sélectionné est surligné en cyan sur toute son étendue ;
- les cellules impliquées dans une confluence sont signalées en magenta ;
- les cellules impliquées dans une bifurcation sont signalées en orange ;
- en l’absence de cours ciblé, les connexions demandées sont recherchées dans
  toute la grille ;
- le mode « Seulement dans une même cellule » isole les chevauchements hérités
  de la v1 ; sa désactivation inclut aussi les connexions entre cellules
  voisines ;
- « Cadrer la surbrillance » ajuste la carte à tous les résultats et
  « Effacer » réinitialise l’inspecteur.

La surbrillance est indépendante des filtres ordinaires et reste non
interactive, afin que les cellules puissent toujours être sélectionnées et
éditées normalement. Son rafraîchissement utilise un calque dédié et ne
reconstruit pas les 14 743 cellules de fond à chaque changement de critère.

Test navigateur :

- 145 cours d’eau proposés ;
- Orénoque : 43 cellules, 15 confluences et une bifurcation ;
- vue globale des chevauchements : 79 jonctions, 16 fourches et 91 cellules
  concernées ;
- cadrage et remise à zéro validés sans erreur JavaScript.
