# Notice de reprise — Pavillon Noir, site de campagne
*Session 24 — contour global des terres émergées, Bermudes complétées*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : capitale `#b04a36` (bordeaux), ville standard `#6b7c8a` (mist), Nassau/pirate `#0e0c09` (ink), trait pirate `#f2e8d5` (parchemin)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Gestion des sources — ordre de priorité

1. **Connecteur GitHub (`main`)** — source principale pour le code de référence. Claude le consulte en début de session.
2. **Fichiers du projet** (REPRISE_N.md + dépôt partagé) — contexte de session et fallback si le connecteur est indisponible.
3. **Desktop Commander** (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) — édition directe et diagnostic. Fichier toujours sauvegardé (Ctrl+S) avant lecture.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Chantiers accomplis en session 24

### 1. Contour global des terres émergées — `renderContourGlobal()`

**Fichier SVG** : `medias/cartes/jaillot_1708-tracés/jaillot_1708-contour_global.svg`
- Produit via **Inkscape** (pas Illustrator — évite les doubles contours systématiques de la vectorisation Image Trace)
- Optimisé via l'outil natif Inkscape (Fichier > Enregistrer une copie > SVG optimisé, arrondir à 1–2 décimales) — contourne le bug SVGOMG sur les `attribValue` trop longs
- Poids final : **636 Ko**
- ViewBox : `0 0 8500 5320` (cohérente avec la carte)

**Leçon vectorisation** : Inkscape produit un path unique fermé sans doubles contours (trace le milieu du pixel), contrairement à Illustrator Image Trace qui trace les deux bords du pixel. Pour tout futur contour décoratif, utiliser Inkscape. Réglages Inkscape : mode Seuil de luminosité, seuil 0.5, lisser décoché, 1 seule passe.

**Leçon blocage Windows** : les SVG produits par Inkscape reçoivent un attribut NTFS `Zone.Identifier` (Mark of the Web). Si un navigateur bloque l'upload : clic droit > Propriétés > Débloquer. Si la case est absente : ouvrir dans Notepad, copier tout, coller dans un nouveau fichier `.svg` créé depuis Notepad.

**Intégration `carte.js`** — trois modifications :

#### Nouvelle fonction `renderContourGlobal()` — insérée juste avant `// ─── Initialisation ───`

```javascript
let contourGlobalSvgCache = null;

async function renderContourGlobal() {
  if (!(modeSombre && overlayMode === 'masque')) {
    if (contourGlobalLayer) { carte.removeLayer(contourGlobalLayer); contourGlobalLayer = null; }
    return;
  }
  if (!contourGlobalSvgCache) {
    try {
      const r = await fetch('medias/cartes/jaillot_1708-tracés/jaillot_1708-contour_global.svg');
      contourGlobalSvgCache = await r.text();
    } catch (e) {
      console.warn('contour-global.svg introuvable :', e);
      return;
    }
  }
  if (contourGlobalLayer) { carte.removeLayer(contourGlobalLayer); contourGlobalLayer = null; }

  const parser = new DOMParser();
  const doc = parser.parseFromString(contourGlobalSvgCache, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return;

  svgEl.querySelectorAll('path, polygon, polyline').forEach(el => {
    el.setAttribute('stroke', 'var(--gold, #c8973a)');
    el.setAttribute('stroke-width', '3');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('stroke-linecap', 'round');
  });

  const W = CARTE_IMAGE.width;
  const H = CARTE_IMAGE.height;
  const bounds = [[0, 0], [H, W]];

  contourGlobalLayer = L.svgOverlay(svgEl, bounds, {
    interactive: false,
    pane: 'contourGlobal',
  });
  contourGlobalLayer.addTo(carte);
}
```

#### Bouton sombre — handler clic dans `initCarte()`

`renderContourGlobal()` ajouté à la fin du handler, après le `.classList.toggle('active', modeSombre)`.

#### `initOverlayBtns()` — handler changement d'overlay

`renderContourGlobal()` ajouté après `renderVilles()`.

**Comportement** : visible uniquement en `modeSombre && overlayMode === 'masque'`. Le SVG scale automatiquement avec le zoom (comportement natif `L.svgOverlay`, aucune fonction supplémentaire nécessaire contrairement aux polygones Leaflet). Pane `contourGlobal` zIndex 410, déjà créé en session 22.

---

### 2. Bermudes — `zones-data.js` complété

**Problème initial** : 9 points, un seul contour incomplet. L'archipel réel comprend une île principale allongée en diagonale + 2 îlots distincts (dont Saint George's au nord-est, où se trouve la capitale).

**Leçon parsing** : le filtre géographique par bbox est inadapté aux îles allongées en diagonale — un îlot peut être à l'intérieur de la bbox de l'île principale sans en faire partie. Toujours présenter tous les contours à l'utilisateur pour élimination manuelle plutôt que filtrer automatiquement par position.

**Leçon coordonnées relatives SVG** : quand un `<path>` contient plusieurs sous-chemins en coordonnées relatives (`m` minuscule), il faut parser le path **entier** sans le découper — sinon les sous-chemins 2+ ont des coordonnées décalées (relatives au mauvais point d'ancrage).

**Bloc final validé** :

```javascript
'bermudes': [  // 3 contours, 36 pts
  [
    // île principale
    [6534, 455], [6525, 454], [6523, 452], [6522, 449], [6523, 447],
    [6534, 446], [6536, 441], [6543, 439], [6545, 435], [6549, 431],
    [6551, 427], [6555, 426], [6558, 427], [6560, 431], [6561, 435],
    [6559, 439], [6556, 444], [6550, 446], [6547, 451], [6543, 453]
  ],
  [
    // îlot nord-ouest
    [6525, 440], [6524, 438], [6525, 436], [6528, 435],
    [6532, 436], [6532, 440], [6531, 441], [6527, 441]
  ],
  [
    // Saint George's (nord-est)
    [6574, 421], [6574, 418], [6573, 418], [6566, 418],
    [6563, 419], [6565, 421], [6571, 423], [6573, 423]
  ]
],
```

---

## Architecture technique — points clés `carte.js`

### Variables globales (existantes)

- `contourGlobalLayer` — layer Leaflet du contour SVG global (null si non affiché)
- `contourGlobalSvgCache` — cache du SVG fetchés (null au premier chargement)
- `modeSombre` — boolean, true si overlay sombre actif
- `overlayMode` — string : `'aucun'`, `'masque'`, `'juridictions'`, `'puissances'`, `'isolation'`, `'isolationVille'`

### Panes Leaflet (zIndex)

- `overlayPane` : 400 (zones colorées)
- `contourGlobal` : 410 (contour SVG terres émergées)
- `contourIsolation` : 420 (contour doré isolation territoire)
- `markerPane` : 600 (pins, villes)

### `renderContourGlobal()` — conditions d'affichage

Visible si et seulement si `modeSombre === true && overlayMode === 'masque'`.
Appelée depuis : handler bouton sombre (dans `initCarte()`), handler bouton overlay (dans `initOverlayBtns()`).
Non appelée depuis `fermerZoomVille()` / `fermerIsolation()` — ces fonctions appellent `renderZones()` et `renderPins()` qui déclenchent indirectement le bon état via la restauration de `overlayMode`.

---

## Chantiers ouverts

- **Latence `flyTo`** — glissement des `divIcon` pendant l'animation Leaflet. Piste explorée en session 22 (pré-calcul trajectoires via RAF) — non implémentée, en attente de test.
- **Bords et îlots du contour global** — quelques tracés coupés aux bords de la carte et petites îles incomplètes subsistent dans le SVG. Problème esthétique mineur, non bloquant.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Textes des chroniques** : rédiger et intégrer dans `chroniques/rapports/`
