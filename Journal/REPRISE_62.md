# REPRISE_62 - Subdomains Copernicus Florida et export bbox marionnette

## Contexte

Continuation directe de `REPRISE_61.md` pour la carte des courants
Copernicus/Jaillot. `REPRISE_63.md` est volontairement ignoree pour ce fil.

L'objectif de cette passe etait de produire un fichier editable pour corriger
les sous-domaines Copernicus, puis de repartir du SVG corrige par l'utilisateur :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\subdomains+florida+retrieved_arrow-nodes-01.svg
```

Decision utilisateur importante : le nouveau sous-domaine s'appelle `florida`
et couvre le detroit de Floride, le courant de Floride, le depart du Gulf
Stream et la cote orientale de la peninsule. L'ancien
`bahamas_gulf_stream` devient simplement `bahamas`.

## Diagnostic Illustrator

Les exports Illustrator doivent conserver explicitement le plan de travail
`8500 x 5320`. Le protocole stable reste :

- SVG source avec `width="8500px" height="5320px" viewBox="0 0 8500 5320"`;
- eviter `Ctrl+S` comme etape normale;
- exporter en SVG avec les plans de travail;
- ne pas dependre des attributs `data-*`, car Illustrator peut les supprimer ou
  les transformer;
- encoder les informations critiques dans les `id`.

## Export source de correction

Script ajoute :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_marionette.py
```

Exports generes :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-report.json
```

Cet export est en repere Copernicus source et sert a corriger les contours. Il
contient `subdomain_contours_edit_first`, les groupes par bassin, les quads, les
fleches/nodes, les elements hors sous-domaines et les marqueurs de recouvrement.

Generation observee avant correction Florida :

```text
gulf_mexico: 1280 noeuds, 1105 quads
caribbean: 2758 noeuds, 2585 quads
bahamas_gulf_stream: 1368 noeuds, 1104 quads
atlantic: 2768 noeuds, 2403 quads
unassigned_active: 148 noeuds
overlaps: 222 noeuds
```

## Export bbox-reference avec Florida

Script ajoute :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox_marionette.py
```

Inputs principaux :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\subdomains+florida+retrieved_arrow-nodes-01.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-bbox-reference-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-quiver.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-blocs-selection.json
```

Exports generes :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-bbox-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-bbox-marionnette-subdomains-report.json
```

Regles appliquees :

- classification des fleches dans le repere Copernicus source;
- rendu dans le repere `courants-copernicus-jaillot-bbox-reference-subdomains.svg`;
- priorite `florida`, puis `gulf_mexico`, `caribbean`, `bahamas`, `atlantic`;
- les fleches dans `florida` sont rattachees a `florida`;
- les calques Illustrator `flèches_et_nodes_rapatriés` sont lus comme overrides
  manuels de rattachement quand un point reste hors contour;
- `gulf_mexico`, `caribbean`, `bahamas` et `atlantic` sont rognes par
  `florida` pour les contours/quads exportes;
- les contours exportes sont reconstruits par union de quads, afin d'utiliser
  les aretes de quads exterieures et de conserver les quads intermediaires
  contenus comme zones calmes.

Generation observee :

```text
gulf_mexico: 1320 noeuds, 1542 quads
caribbean: 2820 noeuds, 3083 quads
bahamas: 1009 noeuds, 1215 quads
florida: 377 noeuds, 485 quads
atlantic: 2574 noeuds, 4835 quads
manual retrieval overrides: 135
unassigned: 0
```

Le rapport indique :

```text
reassignedToFloridaFromGulfOrBahamas: 370
manualRetrievalOverrides: 135
rawMembershipCounts:
  bahamas + florida: 362
  florida: 7
  gulf_mexico + bahamas + florida: 6
  gulf_mexico + florida: 2
```

## Validations

Commandes lancees :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_marionette.py"
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox_marionette.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_marionette.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_bbox_marionette.py"
python -c "import xml.etree.ElementTree as ET; ET.parse(r'C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-jaillot-bbox-marionnette-subdomains.svg'); print('xml ok')"
```

Resultats :

```text
Compilation OK
Generation OK
SVG XML OK
```

## Suite conseillee

Ouvrir `courants-copernicus-jaillot-bbox-marionnette-subdomains.svg` dans
Illustrator pour verifier visuellement :

- la forme de `florida`;
- le rognage de `bahamas`;
- les coutures Florida/Bahamas/Gulf;
- les 135 rapatriements manuels, maintenant integres comme overrides et donc
  absents de `unassigned`.

Apres deformation manuelle bassin par bassin, il faudra importer le SVG exporte
par Illustrator et produire une projection centerlines de controle avant toute
materialisation finale.

## Addendum - abandon de la reconstruction automatique des contours

Retour utilisateur : l'export `courants-copernicus-jaillot-bbox-marionnette-subdomains.svg`
ne convient pas pour le travail manuel. Les recouvrements attendus devaient
rester des noeuds communs sur les bords exterieurs de quads mitoyens ; la
reconstruction automatique par union/rognage produit au contraire des voisins
qui mordent les uns sur les autres. Elle laisse aussi visuellement trop de
fleches hors sous-domaines et l'absence d'`oceanBounds` + sous-domaines Jaillot
rend le fichier inutilisable pour caler la deformation.

Nouvelle direction : l'utilisateur redessinera les contours a la main.

Script ajoute pour cette direction :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_manual_reference.py
```

Export regenere :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-report.json
```

Contrat du nouvel export :

- base : `courants-copernicus-jaillot-bbox-reference-subdomains.svg` ;
- dimensions conservees : `8500px x 5320px`, `viewBox="0 0 8500 5320"` ;
- groupe `jaillot_references_do_not_deform` avec `jaillot_oceanbounds`,
  `jaillot_subdomains_overlay` et `jaillot_subdomains_labels` ;
- groupe `subdomain_contours_edit_first` avec les contours Copernicus projetes
  (`gulf_mexico`, `caribbean`, `bahamas`, `atlantic`) et un groupe vide
  `subdomain_florida_draw_here` ;
- groupe `copernicus_subdomain_bbox_grids_full` : grilles rectangulaires
  completes par bbox des sous-domaines Copernicus, y compris quads vides, pour
  guider le nouveau trace manuel ;
- groupe `copernicus_bbox_field_context` : quads/fleches/nodes bbox existants en
  contexte visuel ;
- aucune union d'aretes, aucun rognage, aucune reassignment automatique.

Validation ajoutee :

```powershell
python -m py_compile "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_manual_reference.py"
python "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_manual_reference.py"
python -c "import xml.etree.ElementTree as ET; ET.parse(r'C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg'); print('xml ok')"
rg -n "<svg|jaillot_references_do_not_deform|subdomain_contours_edit_first|subdomain_florida_draw_here|copernicus_subdomain_bbox_grids_full|bbox_grid_full_|copernicus_bbox_field_context|jaillot_oceanbounds|jaillot_subdomains_overlay" "C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg"
```

Resultats observes :

```text
Compilation OK
Generation OK
SVG XML OK
Contours projetes : atlantic, bahamas, caribbean, gulf_mexico
Grille bbox : stepX=45.00, stepY=45.50
SVG : 6 595 504 octets
Rapport JSON : 1 692 octets
```

## Addendum - correction des grilles bbox du fichier manuel

Retour utilisateur : dans `courants-copernicus-marionnette-subdomains.svg`, les
grilles `copernicus_subdomain_bbox_grids_full` etaient fausses. Elles avaient
ete fabriquees apres projection avec un pas median global et leurs dimensions
ne correspondaient pas aux sous-domaines Copernicus projetes.

Correction appliquee dans :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_manual_reference.py
```

Nouvelle logique :

- lire les bbox source des sous-domaines dans
  `courants-copernicus-subdomains-selection.json` ;
- lire les mappings bbox source -> Jaillot dans
  `courants-copernicus-blocs-classification.json` ;
- construire les quads de grille en coordonnees source Copernicus avec le pas
  original 50 px et l'offset 25 px ;
- projeter chaque sommet de quad avec le meme `transform_point_bbox` que les
  contours Copernicus du fichier reference ;
- conserver zero union, zero rognage, zero reassignment automatique.

Export regenere :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-report.json
```

Resultats observes apres correction :

```text
Compilation OK
Generation OK
SVG XML OK
Rapport version 3
Grille gulf_mexico : 52 x 38 = 1976 quads
Grille caribbean : 100 x 46 = 4600 quads
Grille bahamas : 59 x 53 = 3127 quads
Grille atlantic : 93 x 96 = 8928 quads
SVG : 6 732 262 octets
Rapport JSON : 3 540 octets
```

Les bornes projetees des grilles correspondent maintenant aux bornes des
contours projetes dans le rapport, par exemple :

```text
gulf_mexico contour/grid : [1111.51, 1150.85, 3449.85, 2879.46]
caribbean contour/grid : [2640.42, 2242.65, 7137.22, 4335.14]
bahamas contour/grid : [3449.85, 377.52, 6102.96, 2788.48]
atlantic contour/grid : [4169.33, 377.52, 8351.36, 4744.55]
```

## Addendum - retour a la structure du premier fichier marionnette

Retour utilisateur : le fichier manuel corrige avec les grilles alignees restait
encore trop eloigne du fichier ayant servi a produire
`subdomains+florida+retrieved_arrow-nodes-01.svg`. Probleme principal : les
fleches/nodes etaient regroupes dans les calques globaux
`bbox_arrows_atlantic` et `bbox_current_nodes_atlantic`, les pointes de fleches
etaient perdues, les groupes par sous-domaine manquaient, et les marqueurs
overlap etaient absents.

Correction appliquee : remplacement de
`gen_oscar_subdomain_manual_reference.py` par un generateur dont le contrat est
explicitement :

- source de rattachement : `subdomains+florida+retrieved_arrow-nodes-01.svg` ;
- rendu : repere `courants-copernicus-jaillot-bbox-reference-subdomains.svg` ;
- structure : meme principe que `gen_oscar_subdomain_marionette.py`, avec
  groupes par domaine et sous-calques `_quads`, `_arrows`, `_nodes` ;
- fleches redessinees comme paths explicites avec pointe integree, sans
  dependance a un `marker-end` SVG ;
- rapatriements manuels lus dans les groupes `rapatrie/rapatries` et affectes
  au domaine indique, meme si le contour actuel ne couvre pas encore le noeud ;
- `florida` est exclusif quand une fleche tombe aussi dans ses voisins ;
- marqueurs `overlap_markers_shared_nodes` remis en place a partir des
  memberships bruts ;
- conservation des enrichissements utiles : `jaillot_references_do_not_deform`
  et `copernicus_subdomain_bbox_grids_full` ;
- suppression du calque contexte global `copernicus_bbox_field_context` pour ne
  plus masquer la repartition par sous-domaines.

Export regenere :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-report.json
```

Resultats observes :

```text
Compilation OK
Generation OK
SVG XML OK
Rapport version 4
gulf_mexico : 1322 noeuds, 1105 quads
caribbean : 2827 noeuds, 2587 quads
bahamas : 1021 noeuds, 810 quads
florida : 370 noeuds, 351 quads
atlantic : 2776 noeuds, 2403 quads
unassigned_active : 0 noeud
overlaps bruts : 586 noeuds
manual retrieval overrides : 148
SVG : 5 878 058 octets
Rapport JSON : 10 520 octets
```

Verifications ponctuelles :

- `gulf_mexico_arrows`, `caribbean_arrows`, `bahamas_arrows`, `florida_arrows`,
  `atlantic_arrows` presents ;
- `gulf_mexico_nodes`, `caribbean_nodes`, `bahamas_nodes`, `florida_nodes`,
  `atlantic_nodes` presents ;
- `overlap_markers_shared_nodes` present ;
- `bbox_arrows_atlantic` et `bbox_current_nodes_atlantic` absents ;
- une fleche type contient bien `M... L... M... L... L...`, donc trait +
  pointe dans le path lui-meme.

## Addendum - contours editables et Florida non dessine

Retour utilisateur : les chemins de `subdomain_contours_edit_first` etaient
encore faux. Cause : le generateur reprenait les contours du SVG Illustrator
`subdomains+florida+retrieved_arrow-nodes-01.svg` puis les reprojetait, alors
que ce fichier doit seulement servir au rattachement des fleches/nodes. Le
calque d'edition doit utiliser les contours Copernicus deja projetes et alignes
dans `courants-copernicus-jaillot-bbox-reference-subdomains.svg`.

Correction appliquee dans `gen_oscar_subdomain_manual_reference.py` :

- `subdomain_contours_edit_first` lit maintenant directement les paths
  `copernicus_subdomain_projected_*` du bbox-reference ;
- `subdomain_florida` n'est plus genere ;
- un groupe vide `subdomain_florida_draw_here` est conserve pour le dessin
  manuel ;
- les grilles bbox ne generent plus `bbox_grid_full_florida` ni
  `bbox_rect_florida`, car Florida n'est pas un sous-domaine Copernicus source ;
- le calque `florida` avec `florida_arrows` et `florida_nodes` reste present
  pour guider le trace manuel de Florida.

Validation observee :

```text
Compilation OK
Generation OK
SVG XML OK
subdomain_gulf_mexico: True
subdomain_caribbean: True
subdomain_bahamas: True
subdomain_atlantic: True
subdomain_florida: False
subdomain_florida_draw_here: True
bbox_grid_full_florida: False
bbox_rect_florida: False
florida: True
florida_arrows: True
florida_nodes: True
overlap_markers_shared_nodes: True
```

## Addendum - source finale avec subdomain Florida dessine

Nouvelle source utilisateur :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-subdomains-florida.svg
```

L'utilisateur y a dessine Florida cote Copernicus et cote Jaillot, redistribue
les fleches/nodes par sous-domaine, et ecarte volontairement quelques elements
comme Lac Maracaibo / Caret Bay.

Correction appliquee dans :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_subdomain_manual_reference.py
```

Nouvelle logique :

- source par defaut remplacee par `courants-copernicus-subdomains-florida.svg` ;
- les affectations de nodes/fleches sont lues depuis les groupes/ids du SVG
  edite, et non plus inferees par containment dans les contours ;
- les contours `subdomain_*`, dont `subdomain_florida_draw_here`, sont relus
  depuis le SVG edite et exportes dans `subdomain_contours_edit_first` ;
- `subdomain_florida_draw_here` est normalise en sortie sous
  `subdomain_florida` ;
- les bbox et grilles sont recalculees depuis les bounds des contours projetes,
  avec inversion du mapping bbox pour conserver l'alignement sur la grille
  source Copernicus 50 px ;
- les nodes actifs absents de tous les groupes sont consideres comme ecartes
  volontairement et ne sont pas re-exportes visiblement ;
- les marqueurs d'overlap correspondent aux ids `copernicus_q_*` presents dans
  plusieurs groupes de sous-domaines.

Export regenere :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-report.json
```

Resultats observes :

```text
Compilation OK
Generation OK
SVG XML OK
Rapport version 5
gulf_mexico : 1330 noeuds, 1110 quads, 11 partiels
caribbean : 2827 noeuds, 2587 quads, 51 partiels
bahamas : 815 noeuds, 638 quads, 38 partiels
florida : 430 noeuds, 383 quads, 51 partiels
atlantic : 2897 noeuds, 2494 quads, 155 partiels
discarded_not_exported : 0 noeud actif
overlaps assignes : 198 noeuds
```

Controle structurel :

```text
Florida Jaillot present : True
subdomain_florida present : True
bbox_grid_full_florida present : True
groupe florida present : True
unassigned visible : 0 item
overlap markers : 198
```

Correction supplementaire : les elements ranges par l'utilisateur dans le
calque `fleches-nodes-quads ignores`, sous `Maracaibo` et `Caret Bay`, doivent
etre consideres comme une exclusion explicite. Le generateur les detecte
maintenant avant les affectations par domaine et retire leurs ids de tous les
groupes exportes.

Validation observee :

```text
ignored_layer_not_exported : 8 noeuds
ignoredLayerSampleIds :
  copernicus_q_07731
  copernicus_q_07732
  copernicus_q_07884
  copernicus_q_07885
  copernicus_q_08033
  copernicus_q_08034
  copernicus_q_08035
  copernicus_q_09031
Occurrences de ces ids dans le SVG regenere : 0
```

## Addendum - audit complet quads et overlaps

Retour utilisateur : des marqueurs d'overlap manquaient, notamment entre
Atlantic et Florida, et certains groupes rattaches ne recevaient pas de quads
suffisants.

Diagnostic :

- tous les ids de nodes/fleches affectes dans
  `courants-copernicus-subdomains-florida.svg` etaient presents dans l'export,
  domaine par domaine ;
- le probleme venait des quads : la reconstruction exigeait quatre coins
  actifs dans `by_key`, donc certains nodes rattaches restaient sans aucun quad
  de domaine ;
- les marqueurs d'overlap etaient bases uniquement sur les ids dupliques entre
  groupes, pas sur les nodes utilises par les quads de plusieurs domaines.

Correction appliquee dans `gen_oscar_subdomain_manual_reference.py` :

- `build_domain_quads()` construit maintenant les quads autour de chaque node
  assigne a partir de la grille source, avec coins synthetiques calmes quand un
  coin n'est pas une fleche active ;
- `annotate_quad_usage()` marque les nodes reutilises par les quads de plusieurs
  domaines ;
- `domain_overlap_nodes()` produit les marqueurs a partir des affectations
  dupliquees et de l'usage multi-domaines des quads ;
- le rapport `overlapPairs` reflete maintenant ces marqueurs reels.

Resultats observes apres regeneration :

```text
gulf_mexico : 1330 noeuds, 1531 quads, 432 partiels
caribbean : 2819 noeuds, 3072 quads, 538 partiels
bahamas : 815 noeuds, 977 quads, 377 partiels
florida : 430 noeuds, 520 quads, 188 partiels
atlantic : 2897 noeuds, 3312 quads, 973 partiels
discarded_not_exported : 8 noeuds
ignored_layer_not_exported : 8 noeuds
overlap markers : 580
```

Audit de couverture :

```text
NODES_NOT_IN_ANY_DOMAIN_QUAD
gulf_mexico : 0
caribbean : 0
bahamas : 0
florida : 0
atlantic : 0
```

Overlaps principaux :

```text
bahamas + atlantic : 199
caribbean + atlantic : 132
florida + atlantic : 85
bahamas + florida : 75
caribbean + bahamas : 29
gulf_mexico + caribbean : 26
gulf_mexico + florida : 25
bahamas + florida + atlantic : 7
caribbean + bahamas + atlantic : 2
```

Controle supplementaire :

```text
Occurrences des 8 ids ignores dans le SVG regenere : 0
Marqueurs overlap Florida/Atlantic directs : 85
Marqueurs overlap Florida/Atlantic incluant triples : 92
```

## Addendum - overlap strict par nodes/fleches partages

Retour utilisateur apres edition de :

```text
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-copernicus-marionnette-subdomains-02.svg
```

La duplication de certaines fleches/nodes Bahamas/Florida avait ete oubliee,
mais les marqueurs d'overlap precedents etaient aussi mal concus : ils etaient
issus de l'usage multi-domaines des quads et produisaient des doubles/triples
rangees au lieu d'une couture fine.

Correction appliquee dans `gen_oscar_subdomain_manual_reference.py` :

- source par defaut remplacee par
  `courants-copernicus-marionnette-subdomains-02.svg` ;
- `read_group_assignments()` ne lit plus que les ids `arrow_*` et `node_*`,
  afin d'ignorer les anciens marqueurs, quads ou autres elements contenant un
  `copernicus_q_*` ;
- les marqueurs d'overlap sont strictement limites aux ids `copernicus_q_*`
  presents dans plusieurs groupes de domaines ;
- `overlap_markers_shared_nodes` contient les paires ;
- `overlap_markers_triplets` contient les triplets, avec une couleur distincte.

Resultats observes :

```text
gulf_mexico : 1330 noeuds, 1531 quads, 432 partiels
caribbean : 2819 noeuds, 3072 quads, 538 partiels
bahamas : 832 noeuds, 995 quads, 385 partiels
florida : 431 noeuds, 521 quads, 188 partiels
atlantic : 2897 noeuds, 3312 quads, 973 partiels
discarded_not_exported : 8 noeuds
ignored_layer_not_exported : 0 noeud dans la source -02
overlap markers stricts : 216
```

Overlaps stricts :

```text
bahamas + atlantic : 90
caribbean + atlantic : 38
bahamas + florida : 34
florida + atlantic : 29
gulf_mexico + florida : 10
caribbean + bahamas : 7
gulf_mexico + caribbean : 7
bahamas + florida + atlantic : 1
```

Validations :

```text
Compilation OK
Generation OK
IDs XML du SVG genere : 45262
IDs XML dupliques : 0
Triplets detectes : 1
NODES_NOT_IN_ANY_DOMAIN_QUAD : 0 pour tous les domaines
```

## Addendum - lisibilite des references Jaillot

Retour utilisateur : le changement de couleurs rendait le fichier trop peu
lisible et les references Jaillot semblaient avoir disparu.

Diagnostic :

- `jaillot_references_do_not_deform` etait encore present ;
- le script ajoutait toutefois une opacite `0.72` aux sous-groupes
  `jaillot_oceanbounds`, `jaillot_subdomains_overlay` et
  `jaillot_subdomains_labels`, alors que la source `-02` ne l'avait pas ;
- le groupe etait ecrit avant les contours, grilles, quads et nodes, donc il
  etait visuellement enterre sous les calques de travail.

Correction appliquee :

- suppression de l'opacite artificielle ;
- preservation des attributs originaux des sous-groupes Jaillot ;
- deplacement de `jaillot_references_do_not_deform` en fin de pile SVG, juste
  avant les marqueurs d'overlap.

Validation observee :

```text
jaillot_references_do_not_deform : present
jaillot_oceanbounds opacity : None
jaillot_subdomains_overlay opacity : None
jaillot_subdomains_labels opacity : None
ordre final : ... unassigned_active_check_and_fix,
              jaillot_references_do_not_deform,
              overlap_markers_shared_nodes,
              overlap_markers_triplets
IDs XML dupliques : 0
overlap markers : 216
```

Rectification importante : le deplacement au premier plan n'etait pas la bonne
correction, car `jaillot_references_do_not_deform` doit servir
d'arriere-plan. La cause reelle du rendu noir etait la perte du bloc `<style>`
source : les chemins Jaillot utilisaient des classes Illustrator (`st3`,
`st4`, etc.) sans `stroke`/`fill` inline. En recopiant les groupes sans le CSS,
le SVG retombait sur un rendu noir par defaut.

Correction finale appliquee :

- `write_source_styles()` recopie maintenant le bloc `<style>` du SVG source ;
- `jaillot_references_do_not_deform` est revenu juste apres l'artboard, donc en
  arriere-plan ;
- l'opacite artificielle ajoutee aux sous-groupes Jaillot reste supprimee.

Validation observee :

```text
style elems : 1
.st3 present dans le style : True
ordre initial : title, desc, style, artboard_8500x5320_do_not_edit,
                jaillot_references_do_not_deform,
                subdomain_contours_edit_first, ...
jaillot_oceanbounds class : st2
jaillot_subdomains_overlay class : st2
jaillot_subdomains_labels class : st2
IDs XML dupliques : 0
overlap markers : 216
```
