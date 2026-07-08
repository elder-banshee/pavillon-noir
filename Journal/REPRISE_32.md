# Notice de reprise — Pavillon Noir, site de campagne
*Session 32 — Interface mobile : architecture Maps*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`. Desktop Commander est utilisé pour éditer directement les fichiers locaux.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Gestion des sources — ordre de priorité

1. **Desktop Commander** (`C:\AI\Site Pavillon Noir\pavillon-noir`) — source principale.
2. **Fichiers du projet** (REPRISE_N.md) — contexte de session, lu avant toute autre chose.
3. **Connecteur GitHub (`main`)** — fallback uniquement si Desktop Commander est indisponible.

---

## Chantier session 32 — Interface mobile

### Vue d'ensemble

Création d'une interface mobile distincte de la version desktop, inspirée de Google Maps. Le chargement est conditionnel : `carte.html` charge `carte-mobile.js` sur mobile (≤ 768px) ou `carte.js` sur desktop.

### Fichiers créés ou modifiés

| Fichier | Rôle |
|---|---|
| `js/carte-mobile.js` | Script mobile (~2 300 lignes) — remplace `carte.js` sur mobile |
| `css/carte-mobile.css` | Styles mobile (~740 lignes) — chargé conditionnellement |
| `carte.html` | Chargement conditionnel JS + lien CSS conditionnel |

---

### Chargement conditionnel dans `carte.html`

```html
<!-- CSS mobile — chargé uniquement sur mobile -->
<link rel="stylesheet" href="css/carte-mobile.css" media="(max-width: 768px)">

<!-- En bas de body, après tous les scripts data : -->
<script>window._MOBILE = window.matchMedia('(max-width: 768px)').matches;</script>
<script id="carte-script"></script>
<script>
  document.getElementById('carte-script').src =
    window._MOBILE ? 'js/carte-mobile.js' : 'js/carte.js';
</script>
```

**Attention** : l'injection via `document.write` avait été testée puis abandonnée. La méthode ci-dessus (balise `<script id>` + assignation `.src`) fonctionne uniquement si le script est placé **avant** `audio.js` et `mobile-nav.js` dans l'ordre des balises. L'ordre actuel dans `carte.html` est :

```
audio.js → audioInit(null) → mobile-nav.js → [détection mobile] → [script conditionnel]
```

---

### Architecture `carte-mobile.js`

#### Structure générale

Même variables globales et constantes que `carte.js`. Les fonctions identiques (utilitaires purs, SVG builders, calcul chevauchement, écartement, loupe) sont dupliquées. Les fonctions d'interface (panneaux, barre, filtres) sont entièrement réécrites.

#### Initialisation

```javascript
function _initMobile() { ... }

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initMobile);
} else {
  _initMobile();
}
```

`_initMobile()` :
1. Appelle `injecterStructureMobile()` — injecte tout le HTML de l'interface dans le DOM
2. Précharge l'image carte via `imgPreload.decode()`
3. Dans `.then()` : appelle `initTout()` (initCarte + toutes les inits de composants)

#### `injecterStructureMobile()`

Masque les éléments desktop (`site-nav`, `hero`, `carte-barre`, panneaux, etc.) via `style.setProperty('display','none','important')`.

Passe toute la chaîne en plein écran :
```javascript
document.documentElement.style.cssText = 'height:100%; overflow:hidden;';
document.body.style.cssText = 'height:100%; overflow:hidden; margin:0; padding:0;';
// + main, .carte-corps, .carte-plus, #carte-wrap, #carte → inset:0, 100%
```

Injecte dans le DOM :
- `#mob-barre-recherche` — barre haute (champ recherche + chips filtres)
- `#mob-boutons-flottants` — boutons Calques et Année (position: absolute, droite)
- `#mob-sheet-ville` — bottom sheet expandable
- `#mob-sheet-filtres` — drawer filtres (depuis le bas)
- `#mob-sheet-calques` — sheet overlays + légende (depuis le bas)
- `#mob-sheet-annee` — sheet curseur temporel (depuis le bas)
- `#mob-barre-basse` — barre fixe en bas (mode sombre, plein écran, itinéraire)
- `#mob-fond-overlay` — fond transparent pour fermeture des sheets

#### `initCarte()`

Identique à `carte.js` sauf :
- `tap: true, tapTolerance: 15` activés pour mobile
- `fitBounds` remplacé par `setView(nassau, -2)` au démarrage
- Vue initiale centrée sur Nassau `[4542, 1739]` (coordonnées pixel)
- `setMinZoom(carte.getZoom() - 1)` pour permettre un dézoom léger
- Suppression de l'écran de chargement dans le `setTimeout` de 500ms

---

### Composants interface mobile

#### Barre de recherche haute (`#mob-barre-recherche`)

- Champ fantôme (tap → ouvre `#mob-sheet-recherche` en plein écran)
- Chips filtres scrollables horizontalement : ⚑ Scénarios (actif par défaut), ⌂ Villes, ⌂ Secondaires, ▲ Sites, + 🔒 Masqués en mode MJ
- État initial : Scénarios actif, tout le reste inactif

Synchronisation chips ↔ checkboxes cachées (`mfl-scenarios`, `mfl-etablissements`, `mfl-secondaires`, `mfl-sites`, `mfl-rang3`) utilisées par `renderVilles()`.

#### Bottom sheet ville (`#mob-sheet-ville`)

Mécanique CSS : `height: 0` par défaut → `height: 32vh` à l'ouverture via classe `mob-sheet-ville--ouverte`. Pas de `transform` (cause d'interstices). Positionnée `bottom: 52px` (au-dessus de la barre basse).

```css
#mob-sheet-ville {
  position: absolute;
  bottom: 52px;
  height: 0;
  transition: height 0.3s ease;
  overflow: hidden;
}
#mob-sheet-ville.mob-sheet-ville--ouverte { height: 32vh; }
```

Hauteurs via `setSheetHauteur(niveau)` : `reduite` = 32vh, `mi-hauteur` = 58vh, `pleine` = 90vh — injectées en style inline (écrase la classe CSS).

**Fermeture** : uniquement via bouton ✕ (délégation `click` sur `.mob-panneau-close` dans la sheet). Le tap sur la carte ne ferme pas la sheet ville — `carte.on('click')` appelle `fermerToutesSheets()` qui exclut `fermerSheetVille()`.

**Scroll** : `overflow-y: auto` + `min-height: 0` sur `#mob-sheet-ville-contenu`.

**Poignée swipable** : listeners `pointerdown`/`pointerup` sur `#mob-sheet-ville-handle` — swipe haut = agrandir, swipe bas = réduire/fermer.

#### Sheets Calques, Année, Filtres

Mécanisme unifié : `transform: translateY(100%)` → `translateY(0)` via classe `--ouverte`. Fermeture via `#mob-fond-overlay` (fond transparent `z-index: 1099` couvrant tout l'écran).

**Sheet Calques** : grille 3×2 de boutons overlay + section légende (`#mob-legende-inner`).

**Sheet Année** : affichage année en grand + slider `<input type="range">` (boutons −/+ supprimés, inutiles sur tactile). Le `max` du slider est mis à jour au passage en mode MJ (`slider.max = ANNEE_MAX_MJ`).

**Sheet Filtres** : checkboxes pour les 4 types de marqueurs + bouton mode sombre.

#### Barre basse (`#mob-barre-basse`)

3 boutons actifs/prévus :
- **☽ Sombre** — toggle `modeSombre`, opacité overlay
- **⛶ Plein écran** — `requestFullscreen()` sur `document.documentElement`
- **🧭 Itinéraire** — désactivé (`disabled`), à implémenter

#### Légende (`majLegende()`)

Gère tous les overlays :
- `geo` → puissances cliquables (toggle masquage)
- `densite` → 6 paliers cliquables
- `esclavage` → 6 paliers cliquables
- `autochtones` → 3 statuts (souveraineté, résistance, domination)
- `masque` → message informatif
- `isolation`/`isolationVille` → instruction de sortie

---

### Mode MJ sur mobile

Séquence secrète identique à desktop (Éleuthère → Marguerita → Jamaïque → Île du Maïs). Confirmation via la sheet ville réutilisée.

À l'activation :
1. Badge 🔒 MJ injecté dans `#carte-wrap`
2. `slider.max = ANNEE_MAX_MJ` — calendrier débridé
3. Chip 🔒 Masqués ajouté dans `#mob-filtres-mj`
4. Checkbox cachée `mfl-rang3` créée dans `document.body` et synchronisée avec le chip
5. `renderVilles()` relancé

---

### Points de vigilance

- **`resoudre()`** est définie dans `carte-data.js` — ne pas la redéfinir en stub dans `carte-mobile.js` (l'avait cassé les couleurs géopolitiques).
- **`majWeightsZones()`** doit être définie dans `carte-mobile.js` (elle avait été supprimée lors d'un nettoyage et causait une erreur silencieuse dans le `setTimeout`).
- **`renderPins()`** utilise `CARTE_PINS` (pas `SCENARIOS`) et appelle `ouvrirPopupScenario(pin)` (pas `ouvrirPopup`).
- **`document.write`** pour le chargement conditionnel : testé mais abandonné — le script résultant ne voyait pas `DOMContentLoaded` correctement sur certains navigateurs.
- **Débogage USB Android** : possible via `chrome://inspect/#devices`. Nécessite mise à jour Chrome desktop et Android à la même version, et validation de la popup d'autorisation sur le téléphone.

---

## État du site à fin de session 32

### Fonctionnel sur mobile
- Carte Leaflet plein écran, centrée sur Nassau au démarrage
- Navigation (pan, pinch-to-zoom)
- Tous les overlays avec légendes interactives
- Filtres marqueurs (chips + sheet filtres)
- Volet d'information ville, territoire, scénario (scroll + swipe poignée)
- Curseur temporel (slider)
- Mode MJ complet (séquence, marqueurs rang 3, calendrier débridé)
- Loupe cluster
- Mode sombre
- Plein écran
- Barre basse avec boutons actifs

### Non implémenté / à faire (mobile)
- **Recherche** : `#mob-sheet-recherche` ouvre bien le plein écran mais la logique de suggestions n'est pas encore branchée sur les données
- **Favoris** (`localStorage`) — prévu mais non implémenté
- **Itinéraires** — placeholder, non implémenté
- **Bug nav paysage** — la `.site-nav` desktop réapparaît quand le mobile bascule en mode paysage (bug `style.css`, correction simple `@media` à faire)
- **Isolation territoire/ville** — non testée en profondeur sur mobile
- **Écartement icônes** — fonctionne mais non testé sur mobile (comportement touch)

### Fonctionnel sur desktop
- Aucune régression — `carte.js` intact, chargement conditionnel transparent

---

## Architecture technique — fichiers principaux

```
carte.html          — page principale, chargement conditionnel JS
js/carte.js         — script desktop (~2 500 lignes), inchangé
js/carte-mobile.js  — script mobile (~2 300 lignes), créé session 32
js/carte-data.js    — données géopolitiques, PUISSANCES, resoudre(), CARTE_ANNEE_REFERENCE
js/villes-data.js   — VILLES (~5 200 lignes)
js/zones-data.js    — ZONES_DATA (polygones)
js/pnj-data.js      — PNJ
js/chroniques-data.js — CHRONIQUES
js/mobile-nav.js    — nav hamburger mobile (inchangé, compatible)
css/carte.css       — styles desktop
css/carte-mobile.css — styles mobile (~740 lignes), créé session 32
```

---

## Chantiers en attente (hors mobile)

- **Curseur loupe** (`cursor: zoom-in`) au survol cluster — implémenté en session 32 (correctif JS dans `carte.js`, handler `mouseover`)
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Écartement icônes — comportement erratique (mouseover rapide)** — non entrepris (session 27)
