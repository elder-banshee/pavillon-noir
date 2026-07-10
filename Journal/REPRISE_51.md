# REPRISE_51 - Pavillon Noir - Moteur de recherche unifié

Date: 2026-06-25

## État général

Session consacrée à la rationalisation du moteur de recherche : création d'un module
partagé `recherche-commune.js`, unification de la normalisation et du fantôme,
et correction de plusieurs bugs de recherche.

Le dépôt actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

---

## 1. Nouveau fichier — `js/recherche-commune.js`

Module partagé chargé avant `carte.js` et `navigation-jaillot.js`. Expose `window.RC` :

```js
window.RC = { normaliser, escapeHtml, surlignerMatch, rechercheVilles, texteFantome }
```

### `normaliser(str)`

Normalisation unifiée pour toutes les comparaisons de recherche :
- minuscules
- suppression des diacritiques (NFD)
- **tirets et espaces supprimés** (`replace(/[-\s]+/g, '')`)

La suppression (et non le remplacement par espace) est la clé :
`"Basse-Terre"` = `"Basseterre"` = `"Basse Terre"` → `"basseterre"`.
`"Saint-G"` = `"Saint G"` = `"SaintG"` → `"saintg"`.
`"Vera Cruz"` = `"Veracruz"` → `"veracruz"`.

Cache interne (`Map`) pour éviter les recalculs répétés.

### `rechercheVilles(q, options)`

Moteur unifié. Paramètres :

| Option | Valeur | Effet |
|---|---|---|
| `filtre` | `'tout'` | villes + juridictions (recherche générale) |
| `filtre` | `'navig'` | villes port ou rade valide (calculateur) |
| `limite` | nombre | max résultats (défaut 12 / 8) |
| `mj` | boolean | mode MJ actif |
| `annee` | number | année de jeu pour filtre temporel |

Résultats enrichis : `{ type, item, id, nom, matchTag, territoire, parenthese }`.

**Correction de bug importante** : le matching testait `ville.tags || [ville.nom, ville.label]`,
ce qui ignorait `nom` et `label` dès que `tags` était défini. Corrigé en :

```js
// Avant — nom ignoré si tags défini
const tags = ville.tags || [ville.nom, ville.label].filter(Boolean);

// Après — nom et label toujours testés en premier
const tags = [ville.nom, ville.label, ...(ville.tags || [])].filter(Boolean);
```

Cas affecté : La Havane (`tags: ['Havana', 'La Habana']`) ne ressortait plus dès la
saisie du "v" dans "La Hav".

### `texteFantome(resultats, q)`

Calcule le texte du champ fantôme depuis les résultats (pas depuis le DOM) :

- Si un résultat a un `nom` ou `matchTag` dont la forme **littérale** commence par `q`
  (comparaison sans normalisation) et que `q` ne contient ni tiret ni espace :
  → complétion suffixe : `"Nass"` → `"Nassau"`
- Si les formes divergent après normalisation (`"basse-t"` → `"Basse-Terre"`,
  `"vera cruz"` → `"Veracruz"`) ou si `q` contient un tiret/espace :
  → **pas de fantôme** (le volet suffit)
- Si aucun résultat : `''`

Décision de conception : le fantôme est une aide à la complétion, pas un doublon du
volet. Il reste silencieux quand les formes divergent.

---

## 2. `js/carte.js` — allégé

- `normalisationCache` supprimé
- `normaliser()` → alias `window.RC.normaliser`
- `surlignerMatch()` → alias `window.RC.surlignerMatch`
- `escapeHtml()` → alias `window.RC.escapeHtml`
- `afficherSuggestions()` remplacée par un appel à `window.RC.rechercheVilles` ; retourne
  maintenant `resultats` pour que l'appelant puisse calculer le fantôme
- Bloc fantôme dans `initRecherche` : `fantome.textContent = window.RC.texteFantome(resultats, q)`

---

## 3. `js/navigation-jaillot.js` — allégé

- `normaliserTexte()` → alias `window.RC.normaliser`
- `resultatsPorts()` → délègue à `window.RC.rechercheVilles(q, { filtre: 'navig' })`
- `surlignerMatch()` → alias `window.RC.surlignerMatch`
- `escapeHtml()` → alias `window.RC.escapeHtml`
- `completionFantomePort()` → alias `window.RC.texteFantome`
- `resultatCompletionFantomePort()` supprimée
- `rendreSuggestions()` déstructure `{ item, ... }` (au lieu de `{ port, ... }`) —
  `item.id` remplace `port.id`, `parenthese` injectée directement depuis les résultats

---

## 4. Détection des homonymes

Unifiée dans `rechercheVilles` via `nomsAmbigus` (Set des noms normalisés en collision
dans la tranche affichée). La parenthèse territoire est calculée une seule fois et
transportée dans chaque résultat via le champ `parenthese`.

Fonctionne désormais identiquement dans la recherche générale et le calculateur :
`"basse"` → Basse-Terre (Île de la Tortue), Basse-Terre (Guadeloupe), Basseterre
(Saint-Kitts) — tous trois détectés comme homonymes grâce à la normalisation unifiée.

---

## 5. Volet de suggestions dans la modale — téléportation

### Problème

Le `<ul>` de suggestions est `position: absolute` dans `.nav-modale-etape-champ`
(`position: relative`). `.nav-modale-corps` a `overflow-y: auto` — cela crée un
contexte de clipping qui empêche le volet de déborder sur le footer, quelle que soit
la valeur de `z-index`.

### Solution retenue

Téléportation dans `document.body` via un conteneur fixe `#nav-jaillot-volet` :

- `initUI()` crée `<div id="nav-jaillot-volet">` dans `body` (une seule fois,
  `position: fixed`, `z-index: 10020`, caché par défaut)
- `positionnerSuggestions()` dans `initChampPort` : si le champ est dans `#nav-modale`,
  positionne le conteneur via `input.getBoundingClientRect()` et y téléporte le `<ul>`
- `viderSuggestions()` remet le `<ul>` dans son `parentNode` d'origine et cache le
  conteneur

Hors modale (panneau latéral) : comportement inchangé, `position: absolute` standard.

Le redimensionnement et le scroll ne posent pas de problème : le volet se ferme au
`blur` avant que ces événements soient visibles.

### CSS associé

```css
#nav-jaillot-volet .carte-recherche-suggestions {
  position: static;
  max-height: 260px;
  border-top: 1px solid var(--border);
}
```

---

## 6. Corrections mineures

### `css/carte.css` — avertissements vendor prefix

Deux occurrences de `-moz-appearance: textfield` sans la propriété standard :

```css
/* Ajouté aux deux blocs input[type=number] des contrôles Test MJ */
appearance: textfield;
```

### `carte.html` — ordre de chargement

`recherche-commune.js` chargé entre `ships-data.js` et `navigation-jaillot.js` :

```html
<script src="js/ships-data.js"></script>
<script src="js/recherche-commune.js"></script>
<script src="js/navigation-jaillot.js"></script>
```

---

## Fichiers modifiés ou créés

| Fichier | Rôle |
|---|---|
| `js/recherche-commune.js` | **Nouveau** — moteur de recherche partagé |
| `js/carte.js` | Allégé — délègue à `window.RC` |
| `js/navigation-jaillot.js` | Allégé — délègue à `window.RC` ; volet téléporté dans modale |
| `css/carte.css` | Vendor prefix `appearance`, règle `#nav-jaillot-volet` |
| `carte.html` | Chargement de `recherche-commune.js` |

---

## Points de vigilance / À faire

- **Avertissements aria-hidden** : deux avertissements DevTools en fin de session —
  `aria-hidden` appliqué à un ancêtre d'un élément focusé (`#nav-modale-overlay` et
  `#nav-jaillot-test-mj`). Non bloquant fonctionnellement, mais à corriger pour
  l'accessibilité. Solution recommandée : remplacer `aria-hidden="true"` par l'attribut
  `inert` sur ces éléments quand ils sont masqués.

- **Déventement** : inchangé depuis REPRISE_50 — `deventement: true` manquant dans
  `carte-data.js` pour les juridictions insulaires (Cuba, Hispaniola, Porto Rico,
  Venezuela…).

- **Règle 2 hauts-fonds** : exception "port de destination" pour cat. 4–5 (Kingston /
  San Juan) — non implémentée.

- **Encombrement / Carénage** : non implémenté dans le calculateur.

- **Avirons** : à implémenter dans `coutTransitionTerminaleHeures()` uniquement.

- **Système d'identification joueur** : `setNiveauNavigation` exposée, UI de saisie
  à créer.

- **Inspecteur de grille** dans `zone-editor.html` : réhabilitation comme outil de
  diagnostic — non commencée.
