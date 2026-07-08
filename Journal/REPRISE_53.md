# REPRISE_53 — Pavillon Noir — Calculateur, Pilote automatique, consolidation recherche

Date : 2026-06-25

## État général

Session longue couvrant : corrections de bugs du calculateur, consolidation du moteur de
recherche, introduction du Pilote automatique, bouton "Tracer route" dans le panneau ville,
et intégration du navire-PJ comme point de départ.

Le dépôt actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

---

## 1. `js/carte-data.js` — ajouts

### `MAP_BOUNDS_POLYGON` et `pointInMapBounds` rapatriés depuis `js/map-bounds.js`

`map-bounds.js` supprimé. Son contenu (polygone + fonction ray-casting) est maintenant
en fin de `carte-data.js`, qui est chargé en premier dans tous les contextes.

```js
const MAP_BOUNDS_POLYGON = [
  [193,367],[4274,373],[8355,397],
  [8349,5030],[4262,5027],[4251,5024],[172,5013]
];
function pointInMapBounds(x, y) { /* ray-casting */ }
```

Références dans `carte.html` et `tools/zone-editor.html` mises à jour (ligne supprimée).

### `CARTE_NAVIRE` — constante navire PJ

```js
const CARTE_NAVIRE = {
  navireId: 'navire-pj',
  nom: 'Cúchulainn',
};
```

Mise à jour après chaque session : `CARTE_NAVIRE_POSITION` (coordonnées pixel [x, y])
et `CARTE_NAVIRE.nom` si le navire change.

---

## 2. `js/ships-data.js` — branchement nom

```js
nom: (typeof CARTE_NAVIRE !== 'undefined' ? CARTE_NAVIRE.nom : 'Cúchulainn'),
```

Le nom du navire PJ est désormais lu depuis `carte-data.js`. Le fallback en dur garantit
la robustesse si l'ordre de chargement changeait.

**Note architecture** : l'id `navire-pj` n'est pas réservé. Quand les PJ changent de
navire pour un archétype standard non modifié, mettre à jour `CARTE_NAVIRE.navireId` et
supprimer l'entrée `navire-pj` de `ships-data.js`. Si le nouveau navire est customisé,
conserver une entrée dédiée (id libre) et pointer dessus depuis `CARTE_NAVIRE`.

---

## 3. `js/navigation-jaillot.js` — corrections calculateur

### Limites de carte — `pointNavigable` et `calculerRoute`

```js
function pointNavigable(p, options = {}) {
  if (typeof pointInMapBounds === 'function' && !pointInMapBounds(p.x, p.y)) return false;
  return segmentNavigable(p, p, { margePx: ... });
}
```

`calculerRoute` lève une `Error` explicite si départ ou arrivée est hors bornes.

### Catégorie taille navire — borne min

`appliquerCat` : clamp `Math.max(0,…)` → `Math.max(1,…)`.
Inputs HTML `min="0" value="0"` → `min="1" value="1"` pour Cat.
Initialisation : `categorieTailleTest === 0` → affiche 1 (pas 0).

### Synchronisation panneau gauche ↔ modale Options avancées

Nouveau comportement "le dernier qui parle a raison" :

- `cacheEtapes` : mémorise l'état de la modale à la fermeture neutre (croix, Échap,
  clic extérieur).
- `snapshotPanneau` : mémorise l'état A/B du panneau au moment de la fermeture neutre.
- À la réouverture : si le panneau a changé depuis la fermeture, il prime sur le cache
  pour le champ modifié. Sinon, le cache prime.
- **Annuler** : purge cache et snapshot → réouverture repart du panneau.
- **Tracer** : met à jour panneau + cache, purge snapshot.

### Tab dans le calculateur — correction `suggestionFantomeId`

Comparaison `r.nom === nomCompletFantome` était sensible à la casse → corrigé en
`normaliserTexte(r.nom) === nomCompletFantome` (où `nomCompletFantome` est déjà normalisé).

### Drag-and-drop étapes — deux corrections

**1. `lireEtatDepuisDOM`** — sélecteur `#nav-modale-etapes input` capturait aussi
les inputs numériques du bloc Test MJ injecté dans chaque ligne.
Corrigé : `#nav-modale-etapes .nav-modale-etape-champ input`.

**2. Bloc Test MJ supprimé de `creerLigneEtape`** — il n'avait rien à faire dans chaque
ligne d'étape (IDs dupliqués, pollution des sélecteurs).

**3. Calcul `dstIdx` dans `onPointerUp`** — formule corrigée :
```js
dstIdx = idxDOM;   // pas de correction : idxDOM est déjà l'index cible dans etatModale
```
Le placeholder remplace `liSrc` via `replaceWith` et occupe exactement la position cible.

### Mise en forme panneau gauche

- La ligne `--actions` (↔ Tracer ×) passe **sous** le champ B.
- Le résumé `+ n étapes intermédiaires` s'insère **entre** A et B via
  `insertBefore(resume, ligneB)`.

---

## 4. `js/recherche-commune.js` — consolidation majeure

### `texteFantome` — correction espace final

`qSansDecoration = q.replace(/[-\s]/g, '')` → condition `qSansDecoration === q`
bloquait dès qu'un espace était tapé ("La " → pas de fantôme).
Corrigé : `!q.includes('-')` (seuls les tirets sont interdits, les espaces passent).

Le fantôme retourne désormais **le suffixe seul** (`cible.slice(q.length)`), pas le
nom complet. Positionné après le curseur via `measureText`.

### `initFantome(input, fantome)`

Fonction factory centralisée. Retourne `{ afficher(suffixe), vider() }`.
- Canvas `measureText` pour positionner le suffixe exactement après le curseur.
- Espace finaux mesurés séparément (`ctx.measureText('x' + espaces).width - ctx.measureText('x').width`).
- Exposée dans `window.RC`.

### `initChampRecherche(input, fantome, suggestions, opts)`

Fonction factory qui absorbe toute la logique commune :
- Rendu des suggestions (`rendreItem` callback)
- Fantôme (via `initFantome`)
- Navigation clavier : Tab/→, ↑↓, Entrée, Échap, mousedown
- `onTab: 'completer'` → Tab ne fait que compléter le texte (recherche principale).
  Défaut `'valider'` → Tab choisit la suggestion (calculateur).
- Callbacks spécifiques : `obtenirResultats`, `rendreItem`, `onChoisir`,
  `onEntreeSansMatch`, `onEchap`, `onPositionner`, `onBlur`.
- Exposée dans `window.RC`.

### `window.RC` — export complet

```js
window.RC = {
  normaliser, escapeHtml, surlignerMatch,
  rechercheVilles, texteFantome,
  initFantome, initChampRecherche,
};
```

---

## 5. `js/carte.js` — `initRecherche` refactorisé

`initRecherche` délègue entièrement à `window.RC.initChampRecherche` :
- `onTab: 'completer'` (Tab complète sans valider)
- `onChoisir` : `zoomerVille` ou `isolerTerritoire`
- `onEntreeSansMatch` : résolution directe dans VILLES / JURIDICTIONS
- `onEchap` : `fermerIsolation()`
- Bouton Clear géré localement (spécifique à la recherche principale)

`afficherSuggestions()` supprimée.

---

## 6. `js/navigation-jaillot.js` — `initChampPort` refactorisé

`initChampPort` délègue à `window.RC.initChampRecherche` :
- `onChoisir` : affecte `portId`, remet le `<ul>` dans son parent, téléportation modale
- `onEchap` : vide champ et portId
- `onPositionner` : téléportation modale (inchangée)
- `onBlur` : résolution `trouverPort` avec 120ms de délai

`completionFantomePort`, `viderSuggestions`, `rendreSuggestions`, `choisirSuggestion`
supprimées.

---

## 7. `css/carte.css` — fantôme unifié

```css
.carte-recherche-fantome {
  position: absolute;
  top: 1px; left: 1px; bottom: 1px;
  height: auto;
  display: flex; align-items: center;
  padding: 0;
  /* font, color, opacity... */
}

.nav-jaillot .carte-recherche-fantome {
  font-size: 0.82rem; line-height: 1.1;
  transform: translateY(1.5px);
}
```

`display: flex / align-items: center` assure le centrage vertical dans les deux contextes.
`left` est écrasé dynamiquement par JS (`measureText`).

---

## 8. Pilote automatique — nouveau bandeau panneau gauche

### `carte.html`

```html
<div id="nav-outils-pilote">
  <div class="nav-outils-pilote-titre">Pilote automatique</div>
  <div class="nav-outils-icones">
    <button class="nav-outil-btn" id="nav-outil-calculateur" …></button>
    <button class="nav-outil-btn" id="nav-outil-navire" …></button>
  </div>
  <div class="nav-outils-resultat" id="nav-outils-resultat">
    <div class="nav-outils-resultat-valeur" …></div>
    <div class="nav-outils-resultat-detail" …></div>
  </div>
</div>
```

Placé avant `#nav-jaillot-slot`, masqué par défaut, révélé par `initOutilsPilote()`
uniquement en mode MJ.

### `css/carte.css`

Titre harmonisé avec `.carte-recherche-titre` (Cinzel 0.6rem, border-bottom).
Icônes 44×44px, centrées, espacées (`justify-content: center`, `gap: 1rem`).
Volet résultat : fond neutre (`rgba(255,255,255,0.04)`), fonte Crimson Text parchment —
distinct des titres de section.
Tooltips à délai 600ms via classe `.tooltip-visible`.

### SVG

- **Compas** (`SVG_COMPAS`) → bouton Calculateur d'itinéraire
- **Navire** (`SVG_NAVIRE`, silhouette mât + voile + coque) → bouton Navire
- **Barre à roues** (`SVG_BARRE_ROUES`, 8 rayons + poignées) → bouton "Tracer route"
  dans le panneau ville

### `initOutilsPilote()`

- Guard `!window.modeMJ` en tête.
- Bouton compas → `ouvrirModale()` (prérempli avec `etapeDepartNavire()` si cache vide).
- Bouton navire → `ouvrirModaleNavire()`.
- `afficherResultatOutils(dureeH, distanceNm, segments)` : met à jour le volet résultat
  après chaque calcul réussi dans `tracerMultiEtapes`.

### Boutons supprimés de `#nav-jaillot`

`#nav-jaillot-navire` et `#nav-jaillot-avance` retirés du template HTML et leurs
listeners supprimés. Ces actions sont désormais dans le bandeau Pilote.

---

## 9. Bouton "Tracer route" — panneau ville

### Condition d'affichage

```js
const estNavigable = modeMJ && (
  ville.type === 'port' ||
  (Array.isArray(ville.rade) && ville.rade.length >= 2
    && Number.isFinite(ville.rade[0]) && Number.isFinite(ville.rade[1]))
);
```

### Structure HTML injectée

```html
<div class="panneau-nom-ligne">
  <h2 class="panneau-nom">…</h2>
  <button class="panneau-tracer-route" id="panneau-tracer-route"
    data-tooltip="Tracer route">SVG_BARRE_ROUES</button>
</div>
```

### `ouvrirModaleAvecDestination(portId, nomPort)`

Exposée dans `window.NavigationJaillot`. Préremplie A = navire-PJ, B = ville cible.

---

## 10. Navire-PJ comme point de départ

### `entreeNavirePJ()`

Retourne un objet synthétique compatible avec VILLES :

```js
{
  id: '_navire_pj',
  nom: CARTE_NAVIRE.nom,
  type: 'navire',
  coords: CARTE_NAVIRE_POSITION,
  tags: ['navire', 'position navire', nom.toLowerCase()],
}
```

**Guards** : coordonnées numériques valides **et** `pointInMapBounds` → retourne `null`
si la position est absente, invalide ou hors des limites de la carte.

### `resultatsPorts(q)`

Injecte l'entrée navire **en tête de liste** si la saisie la matche. Le navire n'apparaît
que si l'utilisateur tape un préfixe pertinent (nom, "navire", "position navire"...).

### `trouverPort(valeur)`

Court-circuit : `brut === '_navire_pj'` → retourne `entreeNavirePJ()` directement.

### `etapeDepartNavire()`

```js
function etapeDepartNavire() {
  const navire = entreeNavirePJ();
  if (navire) return { portId: navire.id, valeur: navire.nom };
  return { portId: '', valeur: '' };
}
```

`pointRoutePort` fonctionne sans modification : lit `rade || coords`, et l'entrée navire
a `coords: CARTE_NAVIRE_POSITION` (point pixel exact, toujours en mer).

---

## Fichiers modifiés

| Fichier | Modifications |
|---|---|
| `js/carte-data.js` | `MAP_BOUNDS_POLYGON` + `pointInMapBounds` rapatriés ; `CARTE_NAVIRE` ajouté |
| `js/ships-data.js` | `nom` branché sur `CARTE_NAVIRE.nom` |
| `js/map-bounds.js` | **Supprimé** |
| `js/recherche-commune.js` | `initFantome`, `initChampRecherche` ajoutés ; `texteFantome` corrigé |
| `js/carte.js` | `initRecherche` refactorisé ; bouton "Tracer route" + `ouvrirPanneauVille` |
| `js/navigation-jaillot.js` | Corrections drag, Cat min=1, sync modale, `initChampPort` refactorisé, Pilote, navire-PJ |
| `css/carte.css` | Fantôme unifié ; bandeau Pilote ; `.panneau-nom-ligne` |
| `carte.html` | `#nav-outils-pilote` ; suppression ref `map-bounds.js` |

---

## Points de vigilance / À faire

- **Zone-editor** : ajouter un clic "geler la position" pour récupérer les coordonnées
  pixel du navire sans chercher dans le hover — noté pour une session future.
- **Consolidation `ships-data.js`** : l'id `navire-pj` n'est pas réservé. Supprimer
  quand le navire courant devient un archétype standard non modifié.
- **Avertissements aria-hidden** : `#nav-modale-overlay` et `#nav-jaillot-test-mj` —
  remplacer `aria-hidden` par `inert` (non bloquant fonctionnellement).
- **Déventement** : `deventement: true` manquant pour les juridictions insulaires (Cuba,
  Hispaniola, Porto Rico, Venezuela…).
- **Règle 2 hauts-fonds** : exception "port de destination" pour cat. 4–5 — non implémentée.
- **Encombrement / Carénage** : non implémenté dans le calculateur.
- **Avirons** : à implémenter dans `coutTransitionTerminaleHeures()`.
- **Système d'identification joueur** : UI de saisie du niveau Nav à créer.
