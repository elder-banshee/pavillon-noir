# Audit de code — Pavillon Noir (dépôt `elder-banshee/pavillon-noir`, branche `main`)

Périmètre : racine, `js/`, `css/`, `tools/`, fichiers HTML. `Archives/` volontairement exclu, conformément à la consigne (checkpoints de comparaison, pas du code mort).

## Résumé général

Le code est globalement propre pour un projet qui a poussé de façon organique sans plan de départ : conventions internes cohérentes (français pour les noms de fonctions/variables métier, séparation `*-data.js` / logique assez respectée), et surtout une discipline de validation régulière (`node --check`, `tools/audit-text-integrity.js`, notes de reprise détaillées) rare sur ce genre de projet solo. Les zones les plus sensibles (grille OSCAR, `oceanBounds`, `zone-editor.html`) sont déjà bien documentées dans les notes de session : la plupart des "bizarreries" que j'ai repérées en première lecture (fonctions qui ne font rien, flags toujours à la même valeur, doublons de noms de fonctions entre `carte.js` et `carte-mobile.js`) sont soit des décisions assumées et commentées (`TODO PN-SEA-EXPLICIT`, `TODO PN-NAVZONE`), soit la conséquence directe de l'absence de bundler : pas de code mort caché, mais une duplication structurelle réelle qui commence à peser, notamment entre les deux moteurs de carte (desktop/mobile) et dans la taille de certains fichiers.

Le point le plus significatif de l'audit n'est pas du code mort mais un choix d'architecture qui a de moins en moins de marge : deux implémentations parallèles quasi complètes du moteur de carte (`js/carte.js`, 124 Ko, et `js/carte-mobile.js`, 99 Ko) partagent des dizaines de fonctions identiques, `js/navigation-jaillot.js` est une IIFE unique de 164 Ko avec ~150 fonctions, `tools/zone-editor.html` est un fichier unique de 220 Ko (HTML + CSS + JS inline), et plusieurs fichiers de données (`oscar-grid.js` à 978 Ko, `villes-data.js` à 346 Ko, `sea-data.js` à 206 Ko, `carte-data.js` à 257 Ko) sont chargés comme scripts JS bloquants sur `carte.html`. Rien de tout cela ne casse le site aujourd'hui, mais la trajectoire (plus de zones, plus de cellules OSCAR, plus de PNJ) va mécaniquement aggraver le temps de chargement et la difficulté à maintenir `carte.js`/`carte-mobile.js` synchronisés.

Note méthodologique : les fichiers `*-data.js` (`carte-data.js`, `villes-data.js`, `zones-data.js`, `sea-data.js`, `oscar-grid.js`, `pnj-data.js`, `ships-data.js`, `chroniques-data.js`) sont d'énormes littéraux de données (coordonnées, cellules, fiches). Je les ai identifiés, ouverts en tête de fichier et referencés depuis le code qui les consomme, mais je n'ai pas relu chaque ligne de données — l'audit porte sur leur usage et leur poids, pas sur l'exactitude des valeurs qu'ils contiennent.

---

## Code mort et incongruités

### `js/navigation-jaillot.js:604-606` — `typeZoneNavigationEnPoint()` toujours `null`
```js
function typeZoneNavigationEnPoint(point) {
  return null;
}
```
Fonction câblée mais inerte par construction : la classification fluviale/côtière/hauturière n'existe pas encore. Documenté par le commentaire `TODO PN-NAVZONE` juste au-dessus et confirmé par les REPRISE — **pas un bug**, mais tout le mécanisme `restrictionNavPourZone()` (ligne 613) et `segmentRestrictionInterdite()` (ligne 619) qui en dépend est mort en pratique tant que cette fonction n'est pas implémentée. Les données `restrictionNav` saisies via `tools/manoeuvrabilite-editor.html` ne produisent donc aucun effet de jeu pour l'instant.

### `js/navigation-jaillot.js` — `zonesNavigationExplicites()` figé à `false`
Plusieurs points de contrôle court-circuitent silencieusement sur cette constante (lignes 573-580, 582-597, 827, 886, 896, 935, 1973 — tous marqués `TODO PN-SEA-EXPLICIT`). C'est une décision assumée (cf. REPRISE_70 : bascule différée volontairement, en attente de tests navigateur dédiés), donc pas un défaut de code, mais c'est une masse non négligeable de logique (gestion d'`oceanBounds`, garde-fous de segment) qui ne produit aucun effet tant que le flag n'est pas activé. À surveiller : si la bascule n'arrive jamais, ce sera un bon candidat de suppression complète plutôt que de maintien indéfini en "code prêt mais éteint".

### `js/audio.js:9` — `AUDIO_ENABLED = false`
Système complet (popup première visite, fondu enchaîné, bouton mute, détection de scroll pour les chroniques) entièrement écrit, câblé sur 5 pages, mais coupé par un seul booléen avec commentaire explicite ("pour désactiver : passer à false"). C'est clairement volontaire et bien documenté, donc pas un problème en soi — mais ça représente ~200 lignes de JS + tout un bloc CSS (`css/style.css:296-420` environ, `.audio-mute-btn`, `.audio-popup*`) actifs dans le bundle livré au joueur pour une fonctionnalité invisible. Si l'ambiance sonore n'est plus dans les plans à moyen terme, c'est un candidat naturel à retirer plutôt qu'à laisser dormir.

### Duplication de petits wrappers `normaliser`
`js/carte.js:163` et `js/carte-mobile.js:112` définissent chacun :
```js
function normaliser(str) { return window.RC.normaliser(str); }
```
et `js/navigation-jaillot.js:68` fait la même chose sous un autre nom (`normaliserTexte`). Trois enveloppes identiques autour de la même fonction exportée par `recherche-commune.js`. Aucun risque, juste un indice que la frontière entre "module partagé" et "copier-coller local" n'est pas très nette.

### `index.html` — bloc `<style>` inline de ~150 lignes
Toutes les autres pages (`pnj.html`, `equipage.html`, `chroniques.html`, `carte.html`) ont leur propre fichier `css/*.css` dédié. `index.html` fait exception avec un `<style>` inline pour `.accueil-grid`/`.accueil-carte` (lignes ~10-160). Incohérence mineure de convention, sans conséquence fonctionnelle, mais gênante si ces styles doivent un jour être réutilisés ou si le site gagne une deuxième page d'accueil.

### `tools/manoeuvrabilite-editor.html` — copie figée de `SHIPS`
Le tableau `const SHIPS = [...]` (une quarantaine de navires, avec `manoeuvrabilite: null` partout) est une capture figée, indépendante de `js/ships-data.js`. C'est un outil à usage unique ("génère du JSON, colle-le dans le chat" — voir le bouton `#btn-generer`), donc ce n'est pas un bug d'exécution, mais c'est une deuxième source de vérité sur la liste des navires qui se périmera silencieusement dès que `ships-data.js` gagnera un nouveau navire.

### Nommage — mélange de conventions
Le projet est très majoritairement en français (fonctions, variables, commentaires), ce qui est cohérent et agréable à lire. Quelques échappées ponctuelles à l'anglais cassent la régularité : `speedKnots` (alias explicitement marqué "legacy UI" dans `navigation-jaillot.js:886,896`), les noms de fichiers `oscar-grid.js`/`sea-data.js`/`ships-data.js` à côté de `navigation-jaillot.js`/`recherche-commune.js`/`villes-data.js`. Rien de grave, mais si une passe de nettoyage est un jour envisagée, autant l'assumer explicitement (garder l'anglais pour les fichiers de données géo/scientifiques type OSCAR/Copernicus, le français pour tout le reste) plutôt que de laisser le mélange s'accumuler.

---

## Duplication / factorisation possible

### `js/carte.js` vs `js/carte-mobile.js` — le vrai sujet
Les deux fichiers exportent des fonctions du même nom, visiblement issues du même copier-coller initial puis divergées séparément :

`normaliserContourZone`, `contoursZonePour`, `contoursPourFit`, `pixelToLatLng`, `normaliser`, `weightPourZoom`, `rendreChamp`, `rendreContexte`, `lireTranslate3d`, `couleurDensite`, `couleurEsclavage`, `resoudreStatutAutochtone`, `couleurAutochtone`, `pinSVG`, `navireSVG`, `pinCarteSVG`, `villeSVG`, `tailleIconeVille`, `tailleIconeNavire`, `zIndexMarqueurVille`, `zIndexMarqueurPin`, `labelVille`, `_infoMarqueurVille`, `setIconeVilleActive`, `calculerAnneeMax`, `initCarte`, `renderZones`, `renderVilles`, `majTailleIconesVilles`, `fermerPopup`.

C'est une trentaine de fonctions au moins qui portent le même nom et, à en juger par les extraits lus (`villeSVG`, `pinSVG`, `couleurDensite`, `rendreChamp`, `rendreContexte` sont identiques ou quasi-identiques dans les deux fichiers), le même rôle — génération d'icônes SVG, calcul de couleurs par overlay, rendu des zones et des villes, gestion du popup. Le reste (structure de l'UI, gestion tactile vs souris, sheets mobiles) diverge légitimement. Aujourd'hui toute correction de bug ou évolution de règle (nouvelle couleur d'overlay, nouveau type de ville, nouvelle icône) doit être répétée deux fois, et rien ne garantit qu'elle le soit correctement — c'est le terrain classique où desktop et mobile divergent silencieusement au fil des sessions.

### Trois lectures locales de `RC.normaliser`
Déjà signalé plus haut (code mort) — regroupable en un seul point d'import si on factorise le socle commun de carte.js/carte-mobile.js.

### `oceanBounds`, `zoneSeaPolygons`/`zoneSeaRings`
Vérifié via REPRISE_67/70 : ce qui ressemblait à une duplication suspecte entre `navigation-jaillot.js` et `tools/zone-editor.html` (mêmes noms de fonctions `zoneSeaPolygons`/`zoneSeaRings`) est en fait un renommage délibéré pour aligner les deux fichiers sur la même nomenclature (cf. REPRISE_67, table de renommage). Ce n'est **pas** de la duplication à corriger, c'est au contraire le résultat d'un travail de convergence — je le mentionne seulement pour confirmer que je l'ai vérifié avant de l'écarter.

---

## Pistes d'optimisation et refontes possibles

### 1. Fusionner le socle commun de `carte.js` / `carte-mobile.js`
**Problème actuel** : ~30 fonctions dupliquées entre les deux fichiers (voir section duplication), sur des sujets qui n'ont aucune raison de diverger entre desktop et mobile (couleur d'un overlay, forme d'une icône SVG, format d'un label). Seule la couche d'interaction UI (panneaux, sheets, gestes tactiles) diffère réellement.
**Piste** : extraire un `js/carte-core.js` regroupant tout ce qui est indépendant du support (rendu des couleurs/overlays, génération SVG, normalisation de zones, calcul de labels/z-index), chargé par les deux pages ; `carte.js` et `carte-mobile.js` ne gardent que la couche d'interaction spécifique à leur plateforme. Pas besoin de bundler/build : un simple script supplémentaire chargé avant les deux, comme c'est déjà fait pour `recherche-commune.js`.
**Effort** : moyen — le découpage est mécanique une fois les paires de fonctions identifiées, mais il faut vérifier fonction par fonction qu'elles sont bien identiques (certaines pourraient avoir divergé légèrement sans que ce soit voulu, ce qui serait justement intéressant à découvrir).

### 2. Charger les gros fichiers de données en JSON asynchrone plutôt qu'en scripts JS bloquants
**Problème actuel** : `carte.html` charge en séquence bloquante `chroniques-data.js`, `pnj-data.js`, `zones-data.js`, `sea-data.js`, `carte-data.js`, `villes-data.js`, `ships-data.js`, `recherche-commune.js`, `oscar-grid.js` (978 Ko à lui seul), `navigation-jaillot.js` — plus d'1,5 Mo de JS parsé avant que la carte s'affiche. Le fait qu'il existe déjà un écran de chargement dédié (`#carte-chargement` dans `carte.html`, avec animation de drapeau) est un signe que ce temps de chargement est déjà perçu comme un problème à masquer plutôt qu'à résoudre.
**Piste** : convertir les fichiers de données pures (`carte-data.js`, `villes-data.js`, `zones-data.js`, `sea-data.js`, `oscar-grid.js`, `ships-data.js`, `pnj-data.js`, `chroniques-data.js`) en vrai JSON, chargés via `fetch()` en parallèle plutôt qu'en balises `<script>` séquentielles. Bénéfices : parsing JSON natif (plus rapide que l'évaluation JS), téléchargements parallélisables, possibilité de ne charger `oscar-grid.js` qu'à l'activation du mode "maritime" au lieu de toujours au chargement de la page. Le format `const X = {...}` actuel a l'avantage de la simplicité (pas de build), donc ce changement demande d'adapter le point d'entrée (`carte.js`/`carte-mobile.js`/`navigation-jaillot.js`) pour attendre les promesses de chargement au lieu de supposer les globales déjà présentes — mais reste faisable sans framework ni bundler.
**Effort** : moyen à gros selon le périmètre (juste `oscar-grid.js`, qui est le plus gros et le moins souvent nécessaire immédiatement = moyen ; tous les fichiers de données = gros, car ça touche l'ordre d'initialisation de plusieurs modules).

### 3. Découper `js/navigation-jaillot.js` (164 Ko, une seule IIFE, ~150 fonctions)
**Problème actuel** : le fichier mélange dans une seule fonction anonyme le moteur de pathfinding (grille, A*, segments navigables), la physique de vent/courant (allures, compensation, atténuation côtière), la gestion de l'état du navire actif (catalogue, encombrement, manœuvrabilité, UI de la modale Navire), et les calculateurs de zones (hauts-fonds, oceanBounds, déventement). Ce sont quatre responsabilités assez distinctes pour justifier des fichiers séparés, et la taille rend la navigation dans le fichier (et les futures sessions de travail dessus) plus lente qu'elle ne devrait l'être.
**Piste** : séparer au minimum en trois fichiers chargés dans l'ordre — moteur physique (vent/courant/vitesse), moteur de pathfinding (grille/A*/segments), et état+UI navire (tout ce qui touche `navireActif`, la modale, le catalogue). L'objet exporté global (probablement `window.NavigationJaillot` ou équivalent) resterait le même pour ne rien casser côté `carte.js`/`zone-editor.html`.
**Effort** : gros — le fichier a énormément d'état partagé fermé sur l'IIFE (caches, `CONFIG`), donc la séparation demande de bien tracer quelles fonctions dépendent de quel état avant de couper.

### 4. Séparer `tools/zone-editor.html` en HTML + CSS + JS
**Problème actuel** : fichier unique de 220 Ko, HTML + `<style>` + un unique gros `<script>` inline. Les sessions récentes (REPRISE_67-70) montrent que l'outil continue de grossir (nouveaux modes, sélection multiple, presse-papiers partagé, chargeur de grille) sans que la structure du fichier change. Un fichier HTML unique aussi gros rend les diffs Git plus difficiles à relire (tout mélangé dans un seul blob) et empêche la coloration syntaxique/l'autocomplétion de bien fonctionner dans la plupart des éditeurs au-delà d'une certaine taille.
**Piste** : extraire le script inline vers `tools/zone-editor.js` et les styles vers `tools/zone-editor.css`, sans changer la logique. C'est un pur déplacement de code, donc risque faible, mais gain réel en lisibilité et en diff Git. Une fois séparé, le découpage en modules par mode (SÉMAPHORE / TOPOGRAPHIE / OCÉANOGRAPHIE, qui existent déjà conceptuellement depuis REPRISE_68) redevient envisageable sans avoir à jongler avec un fichier HTML.
**Effort** : petit pour la séparation HTML/CSS/JS brute ; moyen si on va jusqu'au découpage par mode.

### 5. Grille OSCAR : structure de données adaptée à la volumétrie
**Problème actuel** : `js/oscar-grid.js` (978 Ko, ~7600 cellules) est un objet JS géant chargé intégralement même quand une seule cellule est interrogée (`courantEnPoint()`). Le futur `oscar-hex-grid.js` (travaillé sur une branche `dev` séparée d'après les REPRISE 65-70, pas encore fusionné sur `main`) va dans le même sens avec un nombre de cellules comparable ou supérieur (le remplissage de la session 70 a ajouté 2024 cellules calmes).
**Piste** : si le nombre de cellules continue de grossir, un index spatial simple (grille de buckets, déjà esquissée via `tailleCelluleIndexPx` dans `navigation-jaillot.js`) plutôt qu'un objet plat évite de parcourir toutes les cellules à chaque requête de point. À combiner avec le point 2 (chargement JSON asynchrone) : les données OSCAR n'ont besoin d'être chargées qu'au moment où le mode maritime ou le calculateur de route sont utilisés, pas à l'ouverture de la carte.
**Effort** : gros — touche le cœur du moteur de navigation et doit être testé aussi soigneusement que les sessions OSCAR précédentes (validations navigateur systématiques déjà en place, donc le processus existe, mais le changement est structurant).

### 6. `css/carte.css` (56 Ko, ~200 sélecteurs top-level, 17 `!important`)
**Problème actuel** : fichier CSS le plus gros du dépôt, sans signe de désorganisation grave, mais assez dense pour qu'un futur renommage de classe soit risqué sans recherche exhaustive (pas de build, pas de CSS modules, donc les collisions de noms de classes sont possibles).
**Piste** : pas de refonte nécessaire dans l'immédiat — juste une vigilance sur les `!important` (17 occurrences, à vérifier qu'elles correspondent bien à des surcharges volontaires de `carte-mobile.css` plutôt qu'à des rattrapages de spécificité mal maîtrisée).
**Effort** : petit (audit ponctuel des `!important`), pas urgent.

---

## Backlog priorisé

1. Vérifier et nettoyer les 17 `!important` de `css/carte.css` — quick win, risque nul. (section 6)
2. Extraire `tools/zone-editor.html` en `zone-editor.html` + `.css` + `.js` sans changer la logique — petit effort, gros gain de lisibilité/diff Git. (section 4)
3. Regrouper les 3 wrappers `normaliser`/`normaliserTexte` dupliqués (`carte.js`, `carte-mobile.js`, `navigation-jaillot.js`) en un seul appel direct à `window.RC.normaliser`. (Code mort et incongruités)
4. Décider du sort de `js/audio.js` (`AUDIO_ENABLED = false`) : soit l'activer, soit le retirer proprement plutôt que de le laisser câblé partout pour rien. (Code mort et incongruités)
5. Rafraîchir ou documenter clairement `tools/manoeuvrabilite-editor.html` comme "génère un patch ponctuel, pas une source vivante" pour éviter la confusion avec `ships-data.js`. (Code mort et incongruités)
6. Déplacer le `<style>` inline de `index.html` vers un `css/index.css` dédié, pour rester cohérent avec les autres pages. (Code mort et incongruités)
7. Identifier précisément les paires de fonctions identiques entre `carte.js`/`carte-mobile.js` (villeSVG, pinSVG, couleurs d'overlay, rendu de zones/villes) et confirmer qu'elles n'ont pas déjà divergé sans le vouloir. (Duplication)
8. Extraire ce socle commun dans un `js/carte-core.js` partagé par `carte.js` et `carte-mobile.js`. (section 1)
9. Décider si `typeZoneNavigationEnPoint()` / `restrictionNav` mérite d'être implémenté prochainement ou explicitement mis de côté (le mécanisme est prêt mais entièrement inerte). (Code mort et incongruités)
10. Convertir `oscar-grid.js` en JSON chargé en asynchrone à l'activation du mode maritime, plutôt qu'en script bloquant toujours chargé. (section 2, sous-ensemble ciblé)
11. Étendre la conversion JSON asynchrone aux autres fichiers `*-data.js` (`carte-data.js`, `villes-data.js`, `zones-data.js`, `sea-data.js`, `ships-data.js`, `pnj-data.js`, `chroniques-data.js`). (section 2, complet)
12. Découper `js/navigation-jaillot.js` en modules (physique vent/courant, pathfinding, état/UI navire). (section 3)
13. Si le volume de cellules OSCAR continue de croître, remplacer l'objet plat par un index spatial en buckets pour les requêtes `courantEnPoint()`. (section 5)
14. Une fois `zone-editor.html` séparé (item 2), envisager un découpage par mode (SÉMAPHORE / TOPOGRAPHIE / OCÉANOGRAPHIE) en fichiers JS distincts. (section 4, prolongement)
