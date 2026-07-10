# REPRISE_52 - Pavillon Noir - Premiere fenetre Navire

Date: 2026-06-25

## Etat general

Session consacree a une premiere tranche de la fenetre `Navire` du calculateur
Jaillot. Le depot actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

Le principe retenu avec l'utilisateur :
- le navire selectionne fournit les caracteristiques reelles du calculateur ;
- l'encadre `TEST MJ` conserve la preseance pour `categorieTailleTest` ;
- en cas de divergence entre la categorie forcee MJ et la categorie standard du
  navire, le bouton navire affiche une astérisque et change de style ;
- la categorie de taille reste visible dans `TEST MJ`, pas necessairement dans
  la fiche navire.

---

## 1. `carte.html`

Ajout d'un bouton navire dans la modale `Options avancees`, au-dessus de la liste
d'etapes :

```html
<button class="nav-modale-navire" id="nav-modale-navire" type="button" data-navire-bouton>Navire</button>
```

Ajout d'une nouvelle modale dediee :
- `#navire-modale-overlay`
- `#navire-modele-select`
- `#navire-modale-fiche`
- `#navire-modale-message`
- validation par `#navire-modale-ok`

---

## 2. `css/carte.css`

Styles ajoutes pour :
- bouton navire du panneau gauche ;
- bouton navire dans `Options avancees` ;
- modale `Navire` ;
- etats visuels separes :
  - `navire-override` : simulation MJ / categorie forcee divergente, violet ;
  - `navire-alerte` : valeur hors limites, rouge ;
  - `navire-fourchette` : donnee catalogue issue d'une fourchette, ambre.

---

## 3. `js/navigation-jaillot.js`

Ajouts principaux :
- etat runtime `etatNavire` pour le navire et l'equipage a bord ;
- `niveauCatalogueNavire()` : en MJ sans test, catalogue complet niveau 5 ;
- `categorieOverrideActive()` : detecte la divergence `categorieTailleTest` /
  categorie standard du navire ;
- `majBoutonsNavire()` : synchronise le libelle `Cuchulainn` / `Cuchulainn*`
  et colore aussi les champs `Cat. navire` du `TEST MJ` ;
- `definirNavireActif(id)` : modifie `CARTE_NAVIRE.navireId/nom` en memoire de
  session, reinitialise l'equipage standard, et invalide les caches de route ;
- `rendreSelectNavire()` : peuple le menu depuis `getShipsForNavLevel()` avec
  le navire actif toujours present ;
- `rendreFicheNavire()` : affiche une premiere fiche avec equipage, tonnage,
  tirant d'eau, voilure, restrictions, malus hauturier, vitesses et notes ;
- avertissement live si l'equipage saisi est sous `equipage.min` ou au-dessus de
  `equipage.max`.

### Suite de tranche - tonnage / encombrement

Modifications ajoutees apres le premier jet :
- dans `Equipage`, `Minimum` devient `Necessaire pour manoeuvrer` ;
- `Standard` n'est plus affiche : il ne sert qu'a pre-remplir `Matelots a bord` ;
- `Maximum` devient `Maximal` ;
- les donnees de tonnage quittent `Caracteristiques` ;
- nouvelle section `Tonnage` avec `Total`, `Utile`, `Occupe` et un slider
  `Encombrement` ;
- `Occupe` est initialise a 50 % du tonnage utile du modele ;
- le champ `Occupe` et le slider `Encombrement` sont synchronises dans les deux
  sens ;
- `Occupe` / pourcentage d'encombrement passent en style bonus si `< 25 %` du
  tonnage utile et en style alerte si `> 75 %`.

### Ajustements suivants

Modifications ajoutees ensuite :
- `Occupe` et `Encombrement` sont maintenant bornes a 100 % du tonnage utile ;
- le champ `Occupe` porte un `max` egal au tonnage utile et rabat une saisie
  excessive sur cette borne ;
- ajout d'un bouton `Reinitialiser` dans la modale navire ;
- `Reinitialiser` remet l'equipage et le tonnage occupe aux valeurs par defaut
  du modele actif ;
- `Reinitialiser` realigne aussi `Cat. navire` du panneau `TEST MJ` sur la
  categorie de taille standard du navire actif ;
- la modale `Navire` ne se ferme plus au clic sur le fond, afin de permettre de
  selectionner du texte ou des valeurs sans fermeture accidentelle au relachement
  du clic hors de la fenetre.

### Fermeture exterieure stricte

Raffinement ajoute ensuite :
- `Options avancees` et `Navire` ferment maintenant sur clic exterieur seulement
  si le `pointerdown` ET le `pointerup` ont lieu sur le fond de l'overlay ;
- un clic commence dans la modale puis relache hors de la modale ne ferme plus ;
- un clic commence hors de la modale puis relache dans la modale ne ferme pas non
  plus ;
- la fermeture exterieure conserve le comportement non validant : l'etat saisi
  reste en cache pour la prochaine ouverture.

### Mise en forme compacte equipage / tonnage

Raffinement ajoute ensuite :
- `Equipage` est maintenant une grille de trois colonnes :
  `Necessaire pour manoeuvrer` / `Maximal` / `A bord` ;
- la valeur de chaque colonne est centree sous son intitule ;
- le champ editable `A bord` est compact, au lieu d'occuper toute la largeur ;
- `Tonnage` suit la meme logique :
  `Total` / `Utile` / `Occupe` ;
- le champ editable `Occupe` est compact et centre ;
- le slider `Encombrement` n'affiche plus le pourcentage numerique ;
- le slider affiche seulement l'effet de vitesse quand il existe :
  `+1 noeud` sous 25 % et `-1 noeud` au-dessus de 75 %.

### Modale plus large et acces par niveau Navigation

Tranche ajoutee ensuite :
- la modale `Navire` est elargie et passe a une hauteur fixe avec corps
  scrollable, pour anticiper les futures illustrations / etats de structure /
  artillerie ;
- `ships-data.js` porte maintenant `SHIP_CATEGORIES`,
  `SHIP_FIELD_VISIBILITY`, `getShipCategoryLabel()` et
  `canAccessShipField()` ;
- le menu des navires est groupe par categorie via des `optgroup` ;
- en Navigation 0, le menu est masque : la fiche affiche seulement le navire
  actif sous forme de bloc identite, la moyenne en milles/jour et les
  restrictions ;
- la vitesse naive n'est plus affichee en noeuds dans la fiche : elle est rendue
  comme `Moyenne milles/jour`, calculee par `vitesse_naive * 24` et arrondie a
  l'unite ;
- Navigation 1 donne acces au modele/menu, au tonnage total, au tonnage occupe
  limite au tonnage total, et a l'equipage maximal ;
- Navigation 2 ajoute tonnage utile, encombrement, equipage necessaire pour
  manoeuvrer, voilure et vitesses completes ;
- Navigation 3 ajoute tirant d'eau et malus de navigation (`malusHauturier`
  pour l'instant, avec extension prevue pour les malus cotiers/fluviaux/etc.) ;
- Navigation 5 ajoute les notes.

Les champs non encore modelises restent absents de l'interface :
dimensions immergee / hors tout, etat de carene, artillerie, etats de structure.

### Encombrement et carenage branches au calculateur

Tranche ajoutee le 2026-06-26.

#### `js/carte-data.js`

`CARTE_NAVIRE` porte maintenant un etat de navigation initial pour le navire des PJ :

```js
navigation: {
    encombrementPct: 50,
    carenage: 'normal', // 'recent', 'normal', 'ancien'
}
```

Ces valeurs servent de defauts de campagne, mais restent editables dans la modale
`Navire` pour faire des projections.

#### `js/ships-data.js`

Le catalogue documente le champ optionnel `etatNavigation` pour les archetypes et expose
le champ de visibilite `carenage` en Navigation 3.

#### `js/navigation-jaillot.js`

Nouveaux comportements :
- `etatNavire` memorise aussi `carenage` ;
- les valeurs par defaut de tonnage occupe et carenage sont lues depuis
  `CARTE_NAVIRE.navigation` quand le navire actif correspond a `CARTE_NAVIRE.navireId`,
  sinon depuis `navire.etatNavigation` si present ;
- la modale affiche une section `Carenage` en Nav 3 :
  - `Moins de deux mois` : `+1 noeud`
  - `Plus de douze mois` : `-1 noeud`
  - les deux cases sont exclusives et decochees par defaut (`normal`) ;
- modifier l'encombrement ou le carenage invalide les caches de temps de route ;
- le pilote automatique tient compte des modificateurs :
  - encombrement actif en Nav 2 : `< 25 %` = `+1 noeud`, `> 75 %` = `-1 noeud` ;
  - carenage actif en Nav 3 : recent = `+1 noeud`, ancien = `-1 noeud` ;
  - les modificateurs s'appliquent a la vitesse naive et aux vitesses par allure,
    sauf au bout au vent qui reste impossible.

#### `css/carte.css`

Ajout des styles `.navire-carenage-*` pour les deux cases exclusives, avec les memes
codes visuels que l'encombrement : vert pour le bonus, rouge pour le malus.

Le court-circuit existant de `categorieTailleNavire()` est conserve :

```js
if (typeof categorieTailleTest !== 'undefined' && categorieTailleTest > 0) return categorieTailleTest;
```

### Optimisation de la modale Navire

Tranche ajoutee ensuite :
- le header de la modale `Navire` affiche maintenant le nom du navire actif et
  son type, par exemple `Cuchulainn - Cotre a tape-cul` ;
- `ships-data.js` porte un champ optionnel `designation` pour les navires
  nommes, par exemple `Le Cuchulainn` ;
- le champ `type` des navires nommes pointe vers un archetype du catalogue :
  `navire-pj.type = 'cotre_a_tape_cul'` affiche donc le `nom` de l'archetype
  `Cotre a tape-cul` ;
- `SHIP_TYPES` / `getShipTypeLabel()` ont ete supprimes : le catalogue est
  l'unique source de verite pour les libelles de modeles ;
- le bloc `navire-modale-identite` ne duplique plus le nom/type : il reste vide,
  avec une hauteur reservee pour les futures illustrations / etats du navire ;
- le menu de selection remplace `Modele` par `Navire` ;
- le navire des PJ (`navire-pj`) est toujours ajoute en premier dans le menu, ce
  qui permet d'y revenir apres avoir teste un autre modele ;
- le suffixe `— actif` a ete supprime dans les options du menu ;
- les groupes du menu utilisent les libelles `Categorie N — Taille ...` ;
- `CARTE_NAVIRE.navigation` porte aussi `equipageActuel`, utilise comme valeur
  de campagne pour pre-remplir l'effectif courant ;
- dans `Equipage`, le champ editable devient `Effectif` ;
- `Tonnage` et `Carenage` affichent leur bonus/malus eventuel dans le titre de
  section, aligne a droite ;
- les cases `Moins de deux mois` / `Plus de douze mois` sont maintenant placees
  sous leur intitule, comme les valeurs compactes des sections precedentes ;
- la section `Vitesses` est renommee `Allures`.

### Realignement au changement de navire

Tranche ajoutee ensuite :
- changer le navire dans le menu recharge maintenant l'etat par defaut du modele
  selectionne ;
- `Cat. navire` dans `TEST MJ` est realignee sur la categorie de taille du
  nouveau navire ;
- `Effectif` revient a l'equipage courant du `navire-pj`, ou a l'equipage
  standard pour les archetypes ;
- `Occupe` revient au pourcentage par defaut du navire : valeurs de campagne
  pour `navire-pj`, sinon 50 % du tonnage pertinent ;
- les valeurs de campagne de `CARTE_NAVIRE.navigation` ne sont plus appliquees
  aux archetypes testes : elles sont reservees a `navire-pj`.

### Header interactif et grille compacte

Tranche ajoutee ensuite :
- le carenage n'est plus affiche ni applique quand la categorie de taille
  effective du navire est inferieure a 2 ;
- le header de la modale devient le declencheur de selection du navire :
  chevron a droite, menu `select` replie par defaut ;
- le champ `Navire` n'occupe plus l'en-tete de corps en permanence ;
- la fiche est structuree en grille deux colonnes :
  `Equipage` / `Tonnage`, puis colonne gauche `Carenage` + `Caracteristiques`
  et colonne droite `Allures` ;
- les sections longues (`Simulation MJ`, `Notes`) restent en pleine largeur ;
- sur mobile, la fiche repasse en une colonne.

### Densite et vitesses modifiees

Tranche ajoutee ensuite :
- les intitules de donnees de la modale passent de `0.7rem` a `0.8rem` ;
- les intitules des grilles compactes sont centres verticalement pour eviter le
  decalage visuel entre libelles sur une ou deux lignes ;
- les cases de carenage perdent leur bordure : seules les coches et la couleur
  d'etat restent visibles ;
- les bonus/malus d'encombrement et de carenage ne sont plus affiches comme
  texte dans les titres de section ;
- les modificateurs sont appliques directement aux vitesses affichees dans
  `Allures`, avec `+24/-24` sur `Moyenne milles/jour` ;
- les vitesses modifiees sont colorees en vert si elles sont superieures a la
  valeur standard, et en rouge si elles sont inferieures ;
- la fiche n'utilise plus une grille stricte pour les grandes sections : elle
  passe en colonnes flexibles afin de reduire les interstices irreguliers ;
- `Effectif` est conserve au singulier pour designer le nombre d'hommes a bord.

### Correctifs menu flottant / carenage

Tranche ajoutee ensuite :
- le menu de selection du navire s'ouvre maintenant en panneau flottant sous le
  header, par-dessus la fiche, sans pousser les sections vers le bas ;
- l'affichage des allures utilise la meme fonction de modificateur que le
  calculateur, afin que le carenage soit applique immediatement sans devoir
  retoucher le slider d'encombrement ;
- la logique de vitesse modifiee est centralisee dans
  `modificateurVitesseActuelNoeuds()`.

### Defauts TEST MJ

Tranche ajoutee ensuite :
- a l'activation du mode MJ, `Niveau Nav` est initialise a 5 ;
- `Cat. navire` est initialise sur la categorie de taille du `navire-pj`
  charge par defaut ;
- les cases de carenage declenchent aussi le recalcul des allures sur `input`,
  pour appliquer le modificateur des la bascule de la case.
- correctif complementaire : l'affichage des allures recoit maintenant
  explicitement l'etat `etatNavire` modifie, au lieu de relire implicitement
  l'etat global ;
- les cases de carenage ecoutent aussi `click` avec un recalcul differe d'un
  tick, afin de laisser le navigateur finaliser `checked` avant reecriture des
  allures.

### Mots de passe Navigation et acces pilote

Tranche ajoutee ensuite :
- le champ `Localiser un territoire` accepte des mots de passe pour definir le
  niveau de Navigation sans passer par le mode MJ :
  - Nav 1 : `BSSL`
  - Nav 2 : `SBLR`
  - Nav 3 : `SXTT`
  - Nav 4 : `CMPS`
  - Nav 5 : `PRTL`
- les mots de passe sont detectes des la saisie exacte dans le champ de
  recherche, puis le champ est vide ;
- le pilote automatique et la modale Navire ne dependent plus exclusivement du
  mode MJ : ils deviennent visibles des qu'un niveau Navigation > 0 est acquis ;
- le module Navigation ecoute `navigation-level-change` pour initialiser les
  outils apres deblocage par mot de passe ;
- les valeurs initiales `niveauNavigation`, `testNiveauNavActif` et
  `categorieTailleTest` sont aussi exposees sur `window` pour faciliter le
  diagnostic console ;
- correctif carenage : un ecouteur delegue stable sur l'overlay de la modale
  Navire capte `input/change/click` des cases de carenage, afin de ne plus
  dependre de listeners poses sur des fragments rerendus par `innerHTML`.

---

## Verification

Commandes passees :

```powershell
node --check .\js\navigation-jaillot.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
git diff --check
```

Verification navigateur :
- `file://` bloque par la politique du navigateur integre ;
- page servie ensuite en local via `http://127.0.0.1:8877/carte.html` ;
- le HTML de la modale navire est bien present ;
- le bootstrap complet de la page n'a pas ete verifie visuellement dans ce
  contexte car le script Leaflet CDN bloque l'execution des scripts suivants.

Verification de repli effectuee dans un contexte JS controle :
- `ships-data.js` + `navigation-jaillot.js` se chargent ensemble ;
- `NavigationJaillot.navireActif()` retourne bien `navire-pj / Cuchulainn` ;
- `getShipsForNavLevel(5)` retourne 47 modeles.

---

## Fichiers modifies

| Fichier | Role |
|---|---|
| `carte.html` | Bouton navire dans Options avancees + nouvelle modale Navire |
| `css/carte.css` | Styles modale, boutons, override MJ, alerte equipage |
| `js/navigation-jaillot.js` | Etat navire, rendu fiche, selection modele, synchronisation TEST MJ |

---

## Points de vigilance / prochaines etapes

- Faire une passe visuelle complete dans un navigateur ou Leaflet est charge.
- Decider si la fiche doit afficher explicitement une ligne "Simulation MJ active"
  ou si l'asterisque + couleur du bouton et du champ `Cat. navire` suffisent.
- Ajouter au modele de donnees les dimensions et les bornes min/max si l'on veut
  rendre editable autre chose que l'equipage pour les navires a fourchette.
- Brancher plus tard l'equipage/tonnage sur les modificateurs d'encombrement et
  de manoeuvre quand ces regles seront implementees.
