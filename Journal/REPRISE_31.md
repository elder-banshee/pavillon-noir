# Notice de reprise — Pavillon Noir, site de campagne
*Session 31 — Loupe cartographique : remplacement de la modale cluster*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : ville standard `#7a8c7a` (vert-de-gris), survol `#9aae9a`, Nassau/pirate `#0e0c09` (ink), trait pirate `#f2e8d5` (parchemin), mode isolé : fond transparent + contour gold
- **Couleurs icônes rang 3 (MJ)** : normal `#a03a3a`, actif/hover `#c45a5a`
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Gestion des sources — ordre de priorité

1. **Desktop Commander** (`C:\AI\Site Pavillon Noir\pavillon-noir`) — source principale. Claude lit les fichiers locaux en début de session. Fichier toujours sauvegardé (Ctrl+S) avant lecture.
2. **Fichiers du projet** (REPRISE_N.md) — contexte de session, lu avant toute autre chose.
3. **Connecteur GitHub (`main`)** — fallback uniquement si Desktop Commander est indisponible, ou pour vérifier qu'un commit est bien propagé sur le site live.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Chantier session 31 — Loupe cartographique

### Concept

La modale cluster (rangée d'icônes SVG au-dessus du point de clic) est remplacée par une **loupe cartographique** : un `div` circulaire superposé à la carte, contenant une seconde instance Leaflet zoomée sur la zone du cluster. Les icônes y sont affichées à leurs positions géographiques relatives réelles et sont cliquables.

**Avantage sur la modale** : contexte géographique préservé, positions relatives lisibles, comportement naturel sur les longues chaînes de chevauchement.

---

### Architecture technique

#### Variables globales ajoutées (section 1)

```javascript
let loupeInstance = null;   // instance L.map secondaire de la loupe
let loupeBitmap = null;     // ImageBitmap pré-décodé — évite le flash gris à l'ouverture
```

#### Constantes (section 17, en tête du bloc loupe)

```javascript
const LOUPE_RAYON = 115; // px — rayon du cercle
const LOUPE_ZOOM  = -0.6; // zoom fixe dans la loupe (déterminé empiriquement)
```

#### Préchargement bitmap (dans `DOMContentLoaded`)

Après le `decode()` de l'image principale, on appelle `createImageBitmap()` pour forcer le navigateur à mettre le bitmap GPU en cache. Sans ça, Leaflet crée un nouvel `<img>` dans la loupe et le navigateur re-décode depuis le cache HTTP — flash gris visible à l'œil.

```javascript
imgPreload.decode()
  .then(() => {
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(imgPreload).then(bmp => { loupeBitmap = bmp; });
    }
    initTout();
  })
  .catch(initTout);
```

`loupeBitmap` n'est pas utilisé directement — il est stocké en variable globale uniquement pour empêcher le GC de le libérer.

---

### `fermerLoupe()`

```javascript
function fermerLoupe() {
  if (loupeInstance) {
    loupeInstance.remove();
    loupeInstance = null;
  }
  const existante = document.getElementById('carte-loupe');
  if (existante) existante.remove();
}
```

Destroy complet à chaque fermeture — pas de réutilisation de l'instance. La recréation est négligeable (N marqueurs max ~5).

---

### `ouvrirLoupe(villeId, containerPoint)`

**Signature** : `villeId` (id de la ville cliquée), `containerPoint` (point de clic Leaflet en coordonnées conteneur).

**Étapes** :

1. Récupère `latlngCentre` (LatLng de l'icône cliquée) depuis `markersVilles[villeId]`.
2. Calcule le centroïde du cluster auquel appartient `villeId` (moyenne des LatLng des membres). Fallback sur `latlngCentre` si pas de cluster.
3. Crée le `div#carte-loupe` (`position: absolute`, `230×230px`, `border-radius: 50%`, `overflow: hidden`) dans `#carte-wrap`. Position depuis `containerPoint`.
4. Instancie `loupeInstance` (`L.map`) centré sur le centroïde, zoom `LOUPE_ZOOM`, toutes interactions désactivées (`dragging`, `scrollWheelZoom`, etc.).
5. Ajoute l'image de fond (`L.imageOverlay`).
6. Dans `whenReady` — les projections pixel sont exactes à ce stade :
   - **Critère géométrique** : projette chaque membre du cluster depuis le centroïde. Si tous tiennent dans `LOUPE_RAYON` → on garde le centroïde. Sinon → `setView(latlngCentre)` (recentrage sur l'icône cliquée).
   - Détermine `latlngFocus` (centroïde ou icône cliquée) et `centrePx` correspondant.
   - Itère sur `Object.entries(markersVilles)` : place un marqueur dans la loupe pour chaque ville dont la position projetée depuis `latlngFocus` est dans `LOUPE_RAYON`.
   - Chaque marqueur : `villeSVG()` + `L.divIcon()` + tooltip + `mouseover`/`mouseout` (état actif préservé) + `click` (`ouvrirPanneauVille(id)` ou `fermerPanneauVille()` si ville déjà active).

**Critère géométrique — deux cas** :
- **Cluster compact** (ex. Panama, 5 icônes) : tous les membres tiennent dans le rayon depuis le centroïde → loupe centrée sur le centroïde, toutes les icônes visibles simultanément.
- **Cluster dans un méta-cluster** (ex. chaîne Venezuela, 14 icônes) : au moins un membre déborde → loupe centrée sur l'icône cliquée, icônes voisines visibles dans le rayon.

---

### Hooks de fermeture

**`renderVilles()`** : `fermerLoupe()` en **tête de fonction** — la loupe est toujours détruite avant tout re-rendu (changement de filtre, zoom, etc.).

**`fermerPanneauVille()`** : `fermerLoupe()` en **fin de fonction** — fermer le panneau ferme la loupe.

**`initCarte()`** : listener permanent sur `document` :
```javascript
document.addEventListener('click', (e) => {
  if (!document.getElementById('carte-loupe')) return;
  if (e.target.closest('#carte-loupe')) return;
  if (e.target.closest('.carte-ville')) return;
  fermerLoupe();
});
```
La garde `.carte-ville` est nécessaire : `L.DomEvent.stopPropagation` n'arrête pas la propagation DOM native vers `document`.

**Handler `click` sur marqueur ville** (`renderVilles()`) :
```javascript
const cluster = clustersChevauchement.find(c => c.ids.includes(ville.id));
if (cluster) {
  ouvrirLoupe(ville.id, e.containerPoint);
  return;
}
```

**Comportement dans la loupe** : cliquer sur une ville de la loupe ouvre le panneau ; la loupe reste visible. Cliquer sur la même ville (déjà active) ferme panneau → loupe. Clic hors de la loupe ferme la loupe (le panneau reste ouvert si une ville était active).

---

### CSS ajouté (`carte.css`)

```css
#carte-loupe {
  position: absolute;
  z-index: 1200;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--gold);
  box-shadow: 0 0 0 3px rgba(200, 151, 58, 0.15), 0 4px 16px rgba(0, 0, 0, 0.6);
  pointer-events: auto;
  transform: translate(-50%, -50%); /* centrage sur containerPoint */
}
```

---

### Supprimé (reliquats de la modale cluster)

- `fermerModalCluster()` — supprimée
- `ouvrirModalCluster()` — supprimée
- Listener de fermeture modale dans `initCarte()` — supprimé
- CSS `.carte-cluster-modal`, `.carte-cluster-modal__icone`, `.carte-cluster-modal__tip` — supprimés

---

## Architecture technique — `carte.js` (~2 500 lignes)

### Ordre des sections

```
1.  Variables globales
2.  Constantes et paliers
3.  Utilitaires purs
4.  Fonctions de couleur overlay
5.  Calcul / année
6.  SVG builders
7.  Icônes villes — helpers
8.  Séquence secrète MJ
9.  Utilitaires UI
10. Initialisation principale
11. Rendu
12. Popups scénarios
13. Panneaux droits
14. Zones — état visuel
15. Isolation territoire
16. Isolation ville
17. Chevauchement icônes (calculerPairesChevauchement, fermerLoupe, ouvrirLoupe, ecarterVille, rapprocherVille)
```

### Variables globales — chevauchement

```javascript
let pairesChevauchement = [];    // paires isolées (2 membres) → écartement
let clustersChevauchement = [];  // clusters (3+ membres) → loupe
let loupeInstance = null;        // instance L.map secondaire de la loupe
let loupeBitmap = null;          // ImageBitmap pré-décodé (anti-flash)
let mouseoutTimers = {};
let ecartementsActifs = {};      // clé "idA:idB" → { dxA, dyA, dxB, dyB, duree }
```

---

## Chantiers en attente

### Loupe — améliorations cosmétiques éventuelles
- Curseur loupe (`cursor: zoom-in`) au survol d'une icône appartenant à un cluster.
- Timer de fermeture au `mouseleave` de la loupe (délai ~550ms, comme les timers paires) — à évaluer à l'usage.

### Recalcul des paires/clusters au zoom — optimisation performance

Actuellement, `calculerPairesChevauchement()` est appelé dans le handler `moveend`, qui se déclenche aussi au pan. Si le nombre de marqueurs augmente significativement, filtrer sur le zoom :

```javascript
let _dernierZoomCalcule = null;
carte.on('moveend', () => {
  // ...
  const zoomCourant = carte.getZoom();
  if (zoomCourant !== _dernierZoomCalcule) {
    _dernierZoomCalcule = zoomCourant;
    calculerPairesChevauchement();
  }
});
```

À n'implémenter que si une dégradation des performances est constatée.

### Autres chantiers

- **Écartement icônes — comportement erratique (mouseover rapide)** — correction structurelle complète impliquerait un refactor RAF. Non entrepris délibérément (session 27).
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`.
