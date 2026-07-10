# REPRISE_50 - Pavillon Noir - Visibilité Nav, calculateur et encodage

Date: 2026-06-25

## État général

Session consacrée à l'implémentation complète du système `niveauNavigation` :
visibilité conditionnelle des éléments maritimes, impact sur le calculateur de route,
outillage MJ pour les tests, rationalisation des données navire, et nettoyage d'encodage.

Le dépôt actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

---

## 1. Champ `visibiliteNav` — données maritimes

### `js/sea-data.js`

Champ `visibiliteNav` ajouté dans `SEA_CURRENT_META` (22 entrées) et `SEA_SHOAL_META` (4 entrées).
Valeurs assignées selon la subtilité nautique de chaque élément (Gulf Stream → 1, Tourbillon des
Sargasses → 3, Banc de Pedro → 2, etc.).

### Logique de filtre — `js/carte.js`

```js
// Overlay maritime — affichage
function sourceMaritimeCourants() {
  if (modeMJ && !testNiveauNavActif) return SEA_CURRENTS;
  return SEA_CURRENTS.filter(c => (c.visibiliteNav ?? 0) <= niveauNavigation);
}
function sourceMaritimeHautsFonds() {
  if (modeMJ && !testNiveauNavActif) return SEA_SHOALS;
  return SEA_SHOALS.filter(s => (s.visibiliteNav ?? 2) <= niveauNavigation);
}
```

Variables d'état global ajoutées :
```js
let niveauNavigation = 0;
let testNiveauNavActif = false; // true quand le MJ simule un niveau Nav réduit
let categorieTailleTest = 0;   // 0 = non actif ; 1–5 = catégorie forcée en mode test MJ
```

Fonctions exposées sur `window` :
- `window.setNiveauNavigation(niveau)` — met à jour `niveauNavigation`, invalide tous les caches, relance `renderMaritime()` si actif.
- `window.setCategorieTailleTest(cat)` — met à jour `categorieTailleTest`, invalide les caches.

---

## 2. Rationalisation `SEA_SHOAL_META` — règles de passage

Anciens champs supprimés : `cat_taille`, `maxCategorieTaille`, `condition_navigation`, `categories_interdites`.

Nouveaux champs unifiés, lus par les trois contextes (calculateur, overlay, éditeur) :

| Champ | Rôle |
|---|---|
| `visibiliteNav` | niveau Nav minimum pour afficher dans l'overlay |
| `catMax` | catégorie taille max autorisée librement (toujours) |
| `catMaxNav` | catégorie max autorisée si `passageNav` satisfait |
| `passageNav` | niveau Nav minimum requis pour que `catMaxNav` soit autorisée |

Valeurs assignées :

| Haut-fond | `catMax` | `catMaxNav` | `passageNav` |
|---|---|---|---|
| Banc des Bahamas | 2 | 3 | 2 |
| Banc de Pedro | 2 | 3 | 3 |
| Banc de Porto Rico | 3 | — | — |
| Cayman Ridge | 3 | — | — |

---

## 3. Calculateur de route — impact `niveauNavigation`

### Sources filtrées

Deux nouvelles fonctions dans `navigation-jaillot.js`, symétriques aux fonctions overlay :

```js
function sourceCourantsCalculateur()   // filtre SEA_CURRENTS sur visibiliteNav
function sourceHautsFondsCalculateur() // filtre SEA_SHOALS sur visibiliteNav
```

Le MJ sans test actif (`modeMJ && !testNiveauNavActif`) voit et contourne tout. En mode joueur
ou test, seuls les éléments connus (visibiliteNav ≤ niveauNavigation) entrent dans le calcul.

### Modificateurs conditionnels — `modificateurActif(niveauRequis)`

Fonction pivot unique. MJ sans test → toujours `true`. Sinon : `niveauNavigation >= niveauRequis`.

| Modificateur | Niveau | Point d'injection |
|---|---|---|
| Courants | 1 | `courantEnPoint()` |
| Vent + allures | 2 | `ventEnPoint()` |
| Déventement côtier | 3 | `facteurDeventementPoint()` |

Nav 0–1 : vitesse naïve directe (`navigation.vitesse_naive`), sans passer par les allures.
`allureSegment()` retourne `{ allure: null }` quand le vent est nul → `vitesseVoileSegmentNoeuds`
retourne directement `vitesseNavireMoyenneNoeuds()`.

### Invalidation des caches

`invaliderCacheHautsFonds()` (exposée sur `window`, appelée par les deux setters) vide les sept
caches dans l'ordre :

```
hautsFondsIndexCache  courantsIndexCache  grilleCache
navigabiliteCache  ventPointCache  courantPointCache  tempsSegmentCache
```

La clé de `navigabiliteCache` inclut maintenant `niveauNavigation` — deux segments identiques
calculés à des niveaux Nav différents ne partagent plus le même résultat mémorisé.

### `navireInterditHautFond()` — règle de passage

```js
function navireInterditHautFond(hautFond) {
  const cat        = categorieTailleNavire();
  const catMax     = hautFond.catMax    ?? CONFIG.categorieMaxHautsFonds;
  const catMaxNav  = hautFond.catMaxNav ?? catMax;
  const passageNav = hautFond.passageNav ?? 99;
  if (cat <= catMax)                                      return false; // libre
  if (cat <= catMaxNav && niveauNavigation >= passageNav) return false; // exception Nav
  return true;                                                          // interdit
}
```

---

## 4. Encadré "Test MJ"

Contrôle de test visible uniquement en mode MJ. Présent dans deux endroits synchronisés :
- Panneau gauche, sous "Options avancées" (`#nav-jaillot-test-mj`)
- Footer de la modale d'itinéraire (`#nav-modale-test-mj`)

Deux lignes : **Niveau Nav** (0–5, +/−) et **Cat. navire** (0–5, +/−, 0 = non actif).

`syncEncadreMJ(navVal, catVal)` maintient les deux instances à jour.
`bindEncadreMJ(bloc, ...)` enregistre les listeners une seule fois (guard `data-mj-bound`).

Comportement `testNiveauNavActif` :
- Activé si Nav < 5 **ou** catégorie simulée > 0
- Désactivé seulement quand les deux sont à leur valeur neutre
- Quand actif : court-circuite le MJ pour que les filtres s'appliquent

### Bug corrigé — synchronisation modale

À l'ouverture de la modale, A et B sont maintenant toujours lus depuis le formulaire principal
(valeurs courantes), et non depuis le cache. Les étapes intermédiaires du cache sont préservées.

---

## 5. Navire des PJ — `navire-pj` dans `ships-data.js`

Ronan a ajouté le bloc `navire-pj` dans `ships-data.js` (lignes 46–63) avec les caractéristiques
révisées du Cúchulainn.

### `carte-data.js` — simplifié

```js
const CARTE_NAVIRE = {
    navireId: 'navire-pj',  // id dans ships-data.js
    nom: 'Cúchulainn',      // nom affiché — peut différer du nom dans ships-data.js
};
```

Pour changer de navire : modifier `navireId`.

### `navireActif()` — lecture directe, sans couche de traduction

```js
function navireActif() {
  // Lève une erreur explicite si CARTE_NAVIRE, navireId, SHIPS_DATA ou le navire sont absents.
  // Retourne le navire brut de SHIPS_DATA — aucune normalisation.
}
```

### Nomenclature harmonisée — fonctions du calculateur

Le calculateur lit maintenant directement les champs de `ships-data.js` :

| Avant | Après |
|---|---|
| `navire.vitesseMoyenneNoeuds` | `navire.navigation.vitesse_naive` |
| `navire.vitessesNoeuds.grandLargue` | `navire.navigation.grand_largue` |
| `navire.vitessesNoeuds.ventArriere` | `navire.navigation.vent_arriere` |
| fallback `105/24` | erreur explicite avec nom du navire |
| fallback `categorieTaille → CONFIG.categorieMaxHautsFonds` | erreur explicite |

`normaliserNavireShipsData()` supprimée — la couche de traduction n'existe plus.

Tokens internes `allureDepuisAngleVent()` renommés en snake_case :
`'grandLargue'` → `'grand_largue'`, `'ventArriere'` → `'vent_arriere'`.

### `ships-data.js` chargé dans `carte.html`

Ajouté avant `navigation-jaillot.js` dans la liste des scripts.

---

## 6. Calculateur — destination par rade

`portsDisponibles()` — condition d'inclusion élargie :

```js
// Avant
if (v.type !== 'port' || !coordsValides(v.coords)) return false;

// Après
if (!coordsValides(v.coords)) return false;
if (v.type !== 'port' && !coordsValides(v.rade)) return false; // port OU rade explicite
```

Sites désormais accessibles comme origine/destination : tous les sites non-port ayant un champ
`rade` renseigné (ex : Pensacola `type: 'fort'`, Laguna de Términos `type: 'site_geo'`).
`pointRoutePort()` utilisait déjà `port.rade` en priorité — aucun changement nécessaire là.

---

## 7. Nettoyage d'encodage

### Diagnostic

Les fichiers étaient en UTF-8 valide. Le problème était uniquement les **fins de ligne mixtes**
(CRLF/LF), causant tous les échecs de substitution avec Desktop Commander.

| Fichier | CRLF normalisés | Mojibakes corrigés |
|---|---|---|
| `carte.js` | 2 710 | 0 |
| `carte-data.js` | 3 953 | 0 |
| `zone-editor.html` | 2 278 | 5 |
| `carte.css` | 1 168 | 5 |
| `carte.html` | 351 | 0 |

Tous les fichiers sont maintenant en **LF pur, UTF-8 sans BOM**.

### Prévention

`.editorconfig` et `.gitattributes` ajoutés à la racine du dépôt :
- VS Code applique UTF-8 + LF automatiquement sur tous les fichiers du projet.
- Git normalise les fins de ligne à chaque commit.

---

## 8. Zone-editor — champs mis à jour

Mode "Courants" de `zone-editor.html` :

- `visibiliteNav` ajouté pour courants et hauts-fonds (spinner 0–5).
- Anciens champs hauts-fonds remplacés : `cat_taille` → `catMax`, + nouveaux `catMaxNav` et `passageNav` (placeholder "—" si non renseigné).
- `updateShoalMeta()` gère les trois nouveaux champs numériques.

---

## Points de vigilance / À faire

- **Déventement** : le moteur est implémenté et fonctionnel (`facteurDeventementPoint()`).
  Il manque uniquement `deventement: true` dans les entrées de `carte-data.js` pour les
  juridictions concernées (Cuba, Hispaniola, Porto Rico, Venezuela…). Dès qu'un champ
  `deventement` est renseigné, l'effet s'active immédiatement.

- **Règle 2 hauts-fonds** : exception "port de destination" pour cat. 4–5 (Kingston dans Banc de
  Pedro, San Juan dans Banc de Porto Rico) — non implémentée. Nécessitera un dessin de chenal SVG
  et une adaptation du calculateur (`ignorerHautFondPort`).

- **Encombrement / Carénage** : champs prévus dans `ships-data.js`, modificateurs non encore
  implémentés dans le calculateur. Modèle retenu : encombrement = (cargaison + sureffectif en
  tonneaux) / tonnage utile du navire. L'équipage à effectif standard est hors-encombrement.
  Le sureffectif consomme du tonnage utile (vivres, eau, équipement) ; le sous-effectif a son
  propre effet de jeu (malus de manœuvre), distinct de l'encombrement. Champ `equipage.std`
  à ajouter dans `ships-data.js` pour les configurations fonctionnelles (commerce/course/guerre)
  quand les valeurs du livre de règles auront été saisies.

- **Avirons** : à implémenter uniquement dans `coutTransitionTerminaleHeures()` (sortie/entrée
  de port), pas comme allure dans `tempsSegmentHeures()`. Les navires sans avirons ne sont pas
  bloqués au port — la transition terminale utilise la vitesse naïve en fallback. La pirogue
  n'est pas concernée car sa `vitesse_naive` *est* sa vitesse à l'aviron.

- **Système d'identification joueur** : `setNiveauNavigation` est exposée sur `window`, prête à
  être appelée par le futur système de mot de passe. L'UI de saisie reste à créer.

- **Inspecteur de grille dans zone-editor.html** : réhabiliter le Sea-Editor comme outil de
  diagnostic plutôt que de dessin. Charger `navigation-jaillot.js` et ses dépendances dans
  `zone-editor.html`, exposer les fonctions internes nécessaires (`courantEnPoint`,
  `ventEnPoint`, `facteurDeventementPoint`, `distanceCotePointNm`, `navireInterditHautFond`,
  etc.), et ajouter un panneau inspecteur : clic sur une cellule de la grille → affichage de
  tous les modificateurs actifs pour le niveau Nav et la catégorie navire courants. Optionnel :
  heatmap de couleur sur la grille (bleu = courant favorable, rouge = défavorable, gris =
  déventement, orange = haut-fond) pour contrôle visuel des cônes de déventement et de la
  navigation côtière. Le sélecteur Test MJ s'intègre naturellement — changer Nav ou catégorie
  recalcule l'affichage en temps réel.
