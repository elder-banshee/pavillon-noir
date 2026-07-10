# Notice de reprise — Pavillon Noir, site de campagne
*Session 33 — Interface mobile : zoom min, menu calques, recherche*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Desktop Commander est utilisé pour éditer directement les fichiers locaux (`C:\AI\Site Pavillon Noir\pavillon-noir`). Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

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

## Chantier session 33

### 1. Zoom minimum et contraintes de navigation

#### Problème résolu
Leaflet 1.9 avec `CRS.Simple` + `zoomSnap:0` n'applique pas `setMinZoom` pendant le geste pinch — le handler `TouchZoom._onTouchMove` appelle `_move()` directement sans passer par `_limitZoom`.

#### Solution finale
Monkey-patch de `touchZoom._onTouchMove` dans `initCarte()` :

```javascript
if (carte.touchZoom && carte.touchZoom._onTouchMove) {
  const _onTouchMoveOrig = carte.touchZoom._onTouchMove.bind(carte.touchZoom);
  carte.touchZoom._onTouchMove = function(e) {
    if (e.touches && e.touches.length === 2) {
      const p1 = carte.mouseEventToContainerPoint(e.touches[0]);
      const p2 = carte.mouseEventToContainerPoint(e.touches[1]);
      const dist = p1.distanceTo(p2);
      if (this._startDist && dist < this._startDist) {
        const scale = dist / this._startDist;
        const zoom = carte.getScaleZoom(scale, this._startZoom);
        if (zoom < carte.getMinZoom()) return; // ignorer ce frame
      }
    }
    return _onTouchMoveOrig(e);
  };
}
```

#### Calcul du zoom minimum
Fonction `_caliberZoomMin()` — utilise `carte.getSize().y` (hauteur réelle Leaflet) :

```javascript
function _caliberZoomMin() {
  return Math.log2(carte.getSize().y / CARTE_IMAGE.height) - 0.001;
}
```

La soustraction de `0.001` évite que Leaflet considère la vue comme "déjà au bord" et refuse le pan latéral.

#### Dimensionnement du conteneur
`#carte-wrap` s'arrête à 52px du bas (hauteur de `#mob-barre-basse`) :
```javascript
carteWrap.style.cssText = 'position:absolute; top:0; left:0; right:0; bottom:52px; width:100%; height:calc(100% - 52px);';
```
`#carte` remplit son parent à 100% — Leaflet mesure ainsi correctement sa hauteur disponible.

#### Recalibrage au plein écran
```javascript
document.addEventListener('fullscreenchange', () => {
  setTimeout(_recalibrerVue, 150);
});
```

#### Options Leaflet notables
```javascript
carte = L.map('carte', {
  crs: L.CRS.Simple,
  minZoom: -5,
  maxZoom: 2,
  maxBoundsViscosity: 1,  // murs rigides, pas de rebond
  zoomSnap: 0,
  zoomDelta: 0.5,
  ...
});
```

---

### 2. Menu Calques — mise en forme

#### Structure HTML des overlays
Chaque overlay est un `div.mob-overlay-wrap` (cellule de grille) contenant un `button.mob-overlay-item` (carré) + `span.mob-overlay-label` (en dehors du bouton, sous lui) :

```html
<div class="mob-overlay-wrap">
  <button class="mob-overlay-item" data-mode="geo"><span class="mob-overlay-icone">⚑</span></button>
  <span class="mob-overlay-label">Géopolitique</span>
</div>
```

**Important** : les couleurs actives sont ciblées via `data-mode`, pas via une classe CSS supplémentaire :
```css
.mob-overlay-item--actif[data-mode="geo"]         { background: var(--sea-light); }
.mob-overlay-item--actif[data-mode="densite"]     { background: #4a8c5c; }
.mob-overlay-item--actif[data-mode="esclavage"]   { background: var(--rust); }
.mob-overlay-item--actif[data-mode="autochtones"] { background: #a05c38; }
.mob-overlay-item--actif[data-mode="masque"]      { background: var(--parchment2); }
```

#### Taille des boutons
`max-width: 56px` sur `.mob-overlay-item` et `.mob-legende-item` — les boutons sont limités en largeur mais le wrap occupe toute sa cellule de grille (`1fr`), centrant le bouton.

#### Légende
Structure `div.mob-legende-wrap` + `div.mob-legende-item` (carré couleur seul, sans contenu) + `span.mob-legende-nom` dessous. Générée par `majLegende()` via le helper `_legendeItem()`.

`.mob-legende-info` (messages texte) utilise `grid-column: 1 / -1` pour s'étendre sur toute la largeur hors grille.

#### Bouton Date
L'année seule, sans icône ni label séparé :
```html
<button class="mob-btn-flottant" id="mob-btn-annee">
  <span class="mob-btn-annee-annee" id="mob-btn-annee-label">1716</span>
</button>
```
CSS : `font-family: Cinzel`, `transform: scaleY(1.2)`, `display: inline-block`.

---

### 3. Recherche mobile — `ouvrirRechercheComplete()`

#### Anti-autofill
Le champ de saisie est un `div[contenteditable="plaintext-only"]` — Chrome ne propose jamais l'autofill sur un élément non-formulaire.

#### Structure HTML
```html
<div id="mob-recherche-field-wrap">
  <input type="text" id="mob-recherche-fantome" tabindex="-1" aria-hidden="true" readonly>
  <div id="mob-recherche-input" contenteditable="plaintext-only" ...></div>
</div>
```
Le fantôme (`<input readonly>`) est en `position: absolute`, même police/taille, couleur `--mist`. La saisie (`div`) est en `position: relative` par-dessus.

**Lecture de la valeur** : `input.textContent` (pas `.value`).

#### Fantôme
Affiche la complétion du **premier résultat dont le nom commence par la saisie** (pas forcément `resultats[0]`) :
```javascript
const candidat = resultats.find(r => normaliser(r.nom).startsWith(norm));
if (candidat) {
  const saisie = input.textContent || '';
  fantome.value = saisie + candidat.nom.slice(saisie.length);
}
```

#### Logique de suggestions
Alignée sur `afficherSuggestions()` de `carte.js` :
- Recherche sur `tags` (alias inclus)
- Filtre `visible_mj` et `rang === '3'` hors mode MJ
- Tri par rang (nom-commence > nom-contient > tag-commence, villes prioritaires)
- Résultats limités à 12 (à réduire à 6–8 dans une session future)
- `surlignerMatch()` local + `escapeHtml()` local — noms en Cinzel `--parchment`, tags en Crimson Text `--mist-light`, match en `--gold-light`

#### Tap sur la loupe
Valide le premier résultat du volet :
```javascript
loupeBtn?.addEventListener('click', () => {
  if (!(input?.textContent || '').trim()) return;
  const premier = suggestionsEl?.querySelector('.mob-suggestion');
  if (premier) {
    const { id, type } = premier.dataset;
    fermerRechercheComplete();
    if (type === 'ville') zoomerVersVille(id);
    else zoomerVersTerrritoire(id);
  }
});
```

---

## Mémos pour sessions futures

### Recherche — améliorations prévues
1. **Limiter à 6–8 résultats** (actuellement 12) — plus adapté à l'espace mobile.
2. **Tri secondaire par population** — départager des résultats de rang équivalent. Utiliser un champ `pop_rationalisee` (nombre) quand `population` est une chaîne non parseable (ex : "quelques centaines d'habitants"). Trier décroissant sur ce champ à rang égal.

### Accessibilité
`fermerSheetVille()` appelle `document.activeElement.blur()` avant `aria-hidden="true"` pour éviter l'avertissement "aria-hidden on focused element".

---

## État du site à fin de session 33

### Fonctionnel sur mobile
- Carte Leaflet plein écran, centrée sur Nassau au démarrage
- Zoom min calibré exactement sur la hauteur du conteneur
- Pinch bloqué sous le zoom min (patch `_onTouchMove`)
- Pan bloqué au zoom min (bounds rigides)
- Plein écran : recalibrage automatique du zoom min
- Overlays avec couleurs actives distinctives par type
- Boutons overlay : format carré, icône + label sous le bouton
- Légende : grille 3 colonnes, carré couleur + label sous
- Bouton Date : année seule, légèrement étirée verticalement
- Recherche : `contenteditable` (no autofill), fantôme, suggestions hiérarchisées, mise en forme Cinzel/Crimson/gold-light, tap loupe = valide premier résultat

### Non implémenté / à faire (mobile)
- **Favoris** (`localStorage`) — prévu mais non implémenté
- **Itinéraires** — placeholder, non implémenté
- **Bug nav paysage** — la `.site-nav` desktop réapparaît en mode paysage
- **Isolation territoire/ville** — non testée en profondeur sur mobile

### Fonctionnel sur desktop
- Aucune régression

---

## Architecture technique — fichiers modifiés en session 33

| Fichier | Modifications |
|---|---|
| `js/carte-mobile.js` | Zoom min, patch pinch, menu calques HTML, recherche complète |
| `css/carte-mobile.css` | Boutons flottants carrés, overlays, légende, recherche |

---

## Chantiers prioritaires — session 34 et suivantes

### 1. Mise en évidence élément actif / retour inactif ⚡ urgent

Sur mobile, les éléments actifs (ville sélectionnée, territoire isolé, pin actif) ne sont pas mis en évidence visuellement sur la carte — et le retour à l'état inactif n'est pas toujours propre. À aligner sur le comportement desktop.

### 2. Recherche / mode isolé ⚡ urgent

Quand une recherche aboutit à l'isolation d'un territoire (`zoomerVersTerrritoire`), vérifier que :
- le mode isolation est correctement activé (`overlayMode = 'isolation'`)
- la légende affiche le message de sortie
- le tap sur la carte ferme bien l'isolation
- la recherche ville ouvre bien le panneau ville après zoom

### 3. Poignée sheet ville 🔼 prioritaire

La poignée (`#mob-sheet-ville-handle`) permet le swipe haut/bas pour agrandir ou réduire la sheet. Vérifier et améliorer :
- zones de hauteur : `reduite` (32vh) → `mi-hauteur` (58vh) → `pleine` (90vh)
- swipe bas depuis `reduite` → fermeture
- comportement au scroll interne (ne pas confondre scroll contenu et swipe poignée)

### 4. Calculateur d'itinéraire 🕐 long terme

Bouton 🧭 dans `#mob-barre-basse`, actuellement `disabled`. Conception à définir :
- sélection de points de départ et d'arrivée sur la carte
- calcul de distance en lieues marines / jours de navigation
- prise en compte des vents dominants et saisons (données à créer)
- affichage du trajet sur la carte (polyline Leaflet)

---

## Chantiers en attente (hors mobile)

- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Écartement icônes — comportement erratique (mouseover rapide)** — non entrepris (session 27)
