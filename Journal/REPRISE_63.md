# REPRISE_63 - Moteur Manœuvrabilité, toilage, restrictions et corrections UI

## Contexte

Session distincte du fil `REPRISE_60`/`REPRISE_61` (OSCAR/courants) et de
`REPRISE_62`, en cours en parallele sur un autre chantier. Ce fil a demarre
par une relecture du `Guide_Utilisateur_Navigation.md`, puis a enchaine sur
l'implementation du moteur de Manœuvrabilite qui en decoulait. Centree
exclusivement sur le moteur de navigation (`js/navigation-jaillot.js`,
`js/ships-data.js`), avec quelques retouches ponctuelles a `js/carte.js` et
`carte.html`/`css/carte.css` pour l'UI des modales navire/pilote. Aucune
touche a la topographie (courants, zones maritimes, hauts-fonds) : ce
chantier reste separe (voir REPRISE_62).

## Travaux effectues

### Pilote Automatique — accessibilite

`accesPiloteAutomatique()` est passe par deux etats successifs cette
session :
1. D'abord rendu permanent (`return true`), pour permettre l'usage du Pilote
   des Nav 0 (mesure de distances, fiche laconique).
2. Puis restreint temporairement au mode MJ uniquement, le chantier
   Manœuvrabilite/toilage/restrictions n'etant pas encore stabilise :

```js
function accesPiloteAutomatique() {
  // TODO PN-NAV-OUVERTURE: la navigation sera librement accessible des Nav 0
  // une fois le chantier en cours stabilise (Manœuvrabilite, toilage,
  // restrictions de zone). En attendant, restreint au mode MJ pour ne pas
  // exposer une fonctionnalite incomplete aux joueurs.
  // Repasser a `return true;` quand le chantier sera pret.
  return typeof modeMJ !== 'undefined' && !!modeMJ;
}
```

Point de reprise clair pour la reouverture aux joueurs : chercher
`PN-NAV-OUVERTURE` dans `navigation-jaillot.js`.

### Renommage voilure -> greement

Le champ historique `voilure` (type de greement : aurique/latine/carree/...)
est renomme `greement` partout (48 occurrences dans `ships-data.js`, y
compris la cle `SHIP_FIELD_VISIBILITY`, plus le seul point d'usage dans
`navigation-jaillot.js`). Le nom `voilure` est libere pour la nouvelle
section de toilage (voir plus bas).

### Moteur de Manœuvrabilite

Nouveau score affiche en fiche navire (lecture seule, jamais editable
directement), calcule par `scoreManoeuvrabiliteActuel()` en n'additionnant
que les facteurs que le niveau de Navigation actif permet reellement
d'evaluer — meme logique de gating que `modificateurVitesseActuelNoeuds()` :

- base `navire.manoeuvrabilite` (Nav >= 1) ;
- malus d'equipage sous-effectif (Nav >= 2, nouvelle fonction
  `malusEquipageManoeuvre()`, table 100%/80%/60%/50% du minimum requis,
  `-Infinity` = "Impossible a manœuvrer", sentinelle plutot que magic
  number) ;
- toilage (Nav >= 4, voir plus bas) ;
- malus de restriction de zone (Nav >= 3, voir `restrictionNav` plus bas) ;
- malus special de derive relevee (-1, voir plus bas).

Nouveau champ `SHIP_FIELD_VISIBILITY.manoeuvrabilite: 1`. Valeur de base
renseignee pour les 47 navires du catalogue (voir section formulaire).

### Toilage (nouvelle section "Voilure")

4 configurations exclusives (cases a cocher, aucune cochee = standard),
visibles et editables des Nav 4 :

| Configuration | Vitesse | Manœuvrabilite |
|---|---|---|
| Tres sous-toile | -2 | +2 |
| Sous-toile | -1 | +1 |
| Sur-toile | +1 | -2 |
| Tres sur-toile | +2 | -4 |

Desequilibre delibere confirme par l'utilisateur (sur-toilage plus penalisant
en Manœuvre qu'il n'est bonifiant en vitesse). Le toilage modifie la vitesse
via `modificateurVitesseActuelNoeuds()`, avec une option `{ inclureToilage }`
ajoutee specifiquement pour exclure ce facteur de la ligne "Avirons" (bug
signale et corrige en cours de session : la voilure n'a pas de raison
d'affecter la vitesse a la rame).

`SHIP_FIELD_VISIBILITY.toilage: 4`.

### Tirant d'eau dynamique et derive relevee

Pour les navires a double derive (Poon de Hollande, Flibot petit), le champ
`tirantEau` passe d'un nombre simple a `{ standard, deriveLevee }`. La fiche
affiche desormais dynamiquement la valeur active selon l'etat de la case
"Derive relevee" (et non plus les deux valeurs empilees comme dans une
premiere version corrigee en cours de session). Case a cocher visible des
Nav 3 (meme seuil que `tirantEau`), applique un malus special de -1 a la
Manœuvrabilite quand elle est active.

Valeurs corrigees en cours de session (inversion detectee par
l'utilisateur) :
- Poon de Hollande : 3 m standard (derives baissees) / 1,5 m derive relevee.
- Flibot petit : 2 m standard / 1 m derive relevee (portait un tirant d'eau
  plat de 1 m avant correction).

### Restrictions de navigation par zone (`restrictionNav`)

Nouveau champ `restrictionNav` sur les navires, structure en objet sparse
(cle = type de zone, valeur absente = libre) :

```js
restrictionNav: {
  hauturiere: -1,        // malus direct au score de Manœuvrabilite (-1 a -3)
  cotiere: 'interdit',   // sentinelle explicite, pas de magic number
}
```

Zones retenues : `fluviale` / `cotiere` / `hauturiere` (coherent avec
`regionRestriction` existant, cabotage ecarte comme cle technique — connotation
commerciale plutot que geographique, garde en reserve pour l'habillage texte
cote joueur).

Regle de gating validee avec l'utilisateur : l'interdiction stricte
s'applique **sans seuil de niveau** (des Nav 0, y compris hors MJ) car elle
decoule de la conception du navire, pas de la competence du pilote. Le malus
chiffre ne contribue au score affiche qu'a partir de Nav 3. La nature de la
zone (fluviale/cotiere/hauturiere) est connue sans seuil — seule sa
*gravite* chiffree demande de l'experience.

Cote implementation :
- `segmentRestrictionInterdite()` est appele sans condition de niveau dans
  `segmentNavigable()` — bloque deja le routage des qu'une classification de
  zone existera.
- `typeZoneNavigationEnPoint()` reste un stub renvoyant `null`
  (`TODO PN-NAVZONE` dans le code) : la classification geographique
  fluviale/cotiere/hauturiere n'existe pas encore, c'est un chantier distinct
  de `SEA_NAV_ZONES`/`oceanBounds` (qui servent aux courants OSCAR, pas a ce
  decoupage). Tant qu'elle n'existe pas, interdictions et malus de zone
  restent inertes en pratique mais deja cables et testables.
- `regionRestriction`/`malusHauturier` (ancien modele) restent en place pour
  les navires pas encore migres — migration a completer au fil de l'eau.

### Regle du lest inverse (Chebec, Tartane, Polacre)

Nouveau champ `lestInverse: true` sur ces trois navires : la regle
d'encombrement (Nav >= 2) s'inverse — moins de 25% donne -1 nœud, plus de
75% donne +1 nœud, au lieu de l'inverse. Implemente via deux helpers
`encombrementEstBonus()`/`encombrementEstMalus()` qui centralisent le test
(navire-conscient), reutilises a la fois par le calcul de vitesse et par les
trois points d'affichage couleur (fiche, curseur d'encombrement en temps
reel) — pas de logique dupliquee/inversee a la main a plusieurs endroits.

### Formulaire de saisie et remplissage des donnees

Chantier de saisie des 45 navires restants (navire-pj et Poon deja
renseignes manuellement) : generation d'un formulaire HTML autonome,
`tools/manoeuvrabilite-editor.html`, ouvrable directement dans le
navigateur sans dependance au site (juste les polices Google Fonts en
degrade si hors-ligne). Regroupe les navires par categorie, valeurs de
Manœuvrabilite pre-remplies a titre indicatif selon une suggestion lineaire
par categorie (Cat 1 = +3 -> Cat 5 = -4), menus deroulants de restriction
par zone (libre/malus -1 a -3/interdit) par defaut sur "libre". Bouton
"Generer" produit un JSON copiable.

L'utilisateur a rempli le formulaire et renvoye le JSON ; application
automatisee via un script Node ponctuel (`tools/_apply-manoeuvre-tmp.js`,
supprime apres usage) qui localise chaque navire par son `id` et insere les
champs juste apres la ligne `greement:` de son bloc. 45/45 navires appliques
sans navire manquant, plus Polacre corrigee manuellement pour
`lestInverse: true` (regle signalee par l'utilisateur apres le remplissage
du formulaire).

Verification finale : les 47 navires du catalogue ont desormais tous un
score `manoeuvrabilite` numerique (`Number.isFinite`), aucun `null` restant.

### Corrections d'interface — modale Navire

Trois problemes signales et corriges :

1. **Double-clic pour ouvrir le selecteur de modele.** Cause : le `<select>`
   etait cache dans un volet reveler au clic sur un bouton-titre separe — le
   premier clic ne faisait que reveler le select, le second l'ouvrait
   reellement. Corrige en superposant le `<select>` natif en transparence
   directement sur le titre (`position:absolute; opacity:0`), pour qu'il
   recoive le clic reel de l'utilisateur et s'ouvre nativement en un seul
   clic — les navigateurs n'autorisant pas l'ouverture programmatique d'un
   `<select>`, c'est la seule methode fiable cross-navigateur.
2. **Bouton X trop proche du chevron.** Retire : la modale se ferme deja par
   Valider/Reinitialiser, clic exterieur ou Echap (tous deja fonctionnels).
   Meme retrait applique au bouton X de la modale "options avancees"
   (`nav-modale`), pour la meme raison.
3. **Options du menu illisibles (pale sur pale).** Le rendu par defaut de
   Windows sur les `<option>` sans fond declare heritait une couleur de
   texte claire sans fond sombre associe. Fond explicite ajoute
   (`background: var(--ink)`) sur les options du select.

CSS mort retire au passage : `.navire-modale-champ--ouvert`,
`.navire-modale-fermer`, `.nav-modale-fermer`.

### Badge de niveau de Navigation

Nouveau badge affichant le niveau de Navigation actif en permanence dans la
modale "options avancees" (`nav-modale`), le seul endroit ou le tracage de
route est effectivement lance — pas dans la modale Navire dont le panneau
est voue a disparaitre a terme. Cable sur l'evenement `navigation-level-change`
deja emis par `setNiveauNavigation()` dans `carte.js` (aucune modification
necessaire cote `carte.js`, l'infrastructure existait deja). Le X de
fermeture ayant ete retire du header, le badge occupe naturellement la
position de droite (`justify-content: space-between` sur `.nav-modale-header`,
2 enfants restants). Texte : "Navigation n" (au lieu de "Nav n" dans une
premiere version jugee trop discrete).

**Probleme non resolu, signale en fin de session** : le style actuel du
badge (fond `var(--gold)` plein, texte `var(--ink)`, `font-weight: 600`) est
visuellement identique a `.nav-modale-btn--tracer` (le bouton d'action
"Tracer"), ce qui pretete a confusion — un badge d'information ne devrait
pas avoir le meme poids visuel qu'un bouton actionnable. L'utilisateur
souhaite une mise en valeur, mais pas ce traitement precis. Deliberement
laisse en l'etat cette session : les modales de navigation sont en phase de
prototypage et une refonte visuelle d'ensemble (styles, iconographie,
disposition interne des champs) est annoncee comme necessaire. Retoucher le
badge isolement maintenant serait probablement du travail a refaire.

## Validations

Effectuees a chaque etape (pas seulement en fin de session) :

```powershell
node --check .\js\navigation-jaillot.js
node --check .\js\ships-data.js
node --check .\js\carte.js
node --check .\js\carte-mobile.js
git diff --check
node .\tools\audit-text-integrity.js
```

Resultat stable tout au long de la session : syntaxe OK partout,
`git diff --check` propre, audit texte a 0 erreur / 61 avertissements
preexistants (aucune regression introduite, warnings identiques a
`REPRISE_61`).

Verification runtime ponctuelle (navire par navire) que les 47 entrees de
`SHIPS_DATA` ont bien un `manoeuvrabilite` numerique apres remplissage du
formulaire.

## Suite conseillee

- **Refonte visuelle des modales** (annoncee par l'utilisateur, pas encore
  cadree) : styles, icones, disposition interne des champs. Concerne au
  minimum `navire-modale`, `nav-modale`, le badge de niveau, et
  probablement le panneau `nav-jaillot` cite comme "voue a disparaitre".
  A cadrer avant de coder quoi que ce soit — ne pas anticiper de solution
  cote badge tant que le cadrage n'est pas fait.
- **`PN-NAV-OUVERTURE`** : repasser `accesPiloteAutomatique()` a
  `return true;` une fois le chantier Manœuvrabilite/toilage/restrictions
  juge stable par l'utilisateur.
- **`PN-NAVZONE`** : classification geographique fluviale/cotiere/hauturiere
  a construire (chantier distinct de `SEA_NAV_ZONES`/`oceanBounds`) pour que
  `restrictionNav` devienne fonctionnel en pratique, pas seulement cable.
- **Migration `regionRestriction`/`malusHauturier`** vers `restrictionNav`
  a completer pour les navires pas encore migres (seuls Poon de Hollande et
  les 45 navires passes par le formulaire — parmi lesquels le Chebec — ont
  recu `restrictionNav` la ou l'utilisateur en a juge le besoin ; les autres
  gardent l'ancien modele en parallele).
- **Sureffectif** (rappel du chantier reporte en session precedente,
  toujours pas commence) : consequences chiffrees du surnombre d'equipage
  (vivres, tonnage supplementaire).
