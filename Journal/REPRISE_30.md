# Notice de reprise — Pavillon Noir, site de campagne
*Session 30 — gestion des chevauchements d'icônes : recalcul dynamique + modale cluster + filtres + rang 3 + recherche*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : ville standard `#7a8c7a` (vert-de-gris), survol `#9aae9a`, Nassau/pirate `#0e0c09` (ink), trait pirate `#f2e8d5` (parchemin), mode isolé : fond transparent + contour gold
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

## Chantier session 30 — gestion des chevauchements

### Contexte

L'ajout progressif de villes et sites dans `villes-data.js`, classés par rang (1, 2, 3) et type (`port`, `ville`, `fort`, `site`), a rendu le système d'écartement initial insuffisant :
- Des icônes s'écartaient vers des voisines masquées par les filtres (écartement fantôme).
- Des clusters de 3+ icônes apparaissaient, pour lesquels l'écartement par paire ne scale pas.

### 1. Recalcul dynamique des paires — `calculerPairesChevauchement()`

**Avant** : itérait sur `VILLES.filter(v => v.coords)` — toutes les villes avec coordonnées, qu'elles soient visibles ou non.

**Après** : itère sur `Object.keys(markersVilles)` — uniquement les marqueurs réellement présents sur la carte. `getLatLng()` remplace la conversion manuelle `pixelToLatLng(coords)`.

**Garde remplacée** : `if (typeof VILLES === 'undefined') return` → `if (!carte || !carte._loaded) return`.

**Appel ajouté en fin de `renderVilles()`** : le recalcul se déclenche à chaque changement de filtre (rang 1/2, sites). Tous les cas sont couverts automatiquement : filtre décoché, `visible_de` non atteinte, rang 3 masqué hors modeMJ.

**Appel ajouté dans le handler `moveend`** (aux côtés de `majTailleIconesVilles()`) : le recalcul se déclenche après chaque fin de zoom ou déplacement — les positions pixel sont stabilisées à ce moment. Permet de détecter/défaire les clusters quand les icônes s'écartent naturellement au zoom.

### 2. Détection des clusters — nouvelle logique dans `calculerPairesChevauchement()`

La fonction produit désormais **deux listes** au lieu d'une :

- `pairesChevauchement[]` — paires isolées (exactement 2 membres), inchangées, alimentent l'écartement existant.
- `clustersChevauchement[]` — clusters de 3+ membres, alimentent la modale.

**Algorithme** :
1. Collecte de toutes les paires brutes (dist < 16px) + construction du graphe de voisinage (`voisins[id] = Set`).
2. Propagation de voisinage (DFS) pour regrouper les membres connexes en clusters.
3. Répartition : cluster de 2 membres → `pairesChevauchement` ; cluster de 3+ → `clustersChevauchement`.

**Variable globale ajoutée** : `let clustersChevauchement = [];` (section 1, aux côtés de `pairesChevauchement`).

### 3. Modale cluster

#### Comportement

- Clic sur une icône appartenant à un cluster (3+) → ouvre la modale au lieu du panneau ville.
- Clic sur une icône de paire (2) → écartement normal, panneau ville au clic.
- La modale se ferme : au clic n'importe où dans la page (hors icône ville Leaflet), ou à l'ouverture du panneau depuis la modale.
- La modale est recréée à chaque ouverture (pas de réutilisation).

#### Détection dans le handler `click` de `renderVilles()`

```javascript
const cluster = clustersChevauchement.find(c => c.ids.includes(ville.id));
if (cluster) {
  ouvrirModalCluster(cluster, e.containerPoint);
  return;
}
```

#### Listener de fermeture — dans `initCarte()` (permanent, une seule fois)

```javascript
document.addEventListener('click', (e) => {
  if (!document.querySelector('.carte-cluster-modal')) return;
  if (e.target.closest('.carte-cluster-modal')) return;
  if (e.target.closest('.carte-ville')) return; // laissé au handler Leaflet
  fermerModalCluster();
});
```

Le `{ once: true }` initial a été abandonné — il entrait en conflit avec le clic d'ouverture de la modale (le même clic fermait immédiatement ce qu'il venait d'ouvrir). La garde `.carte-ville` est nécessaire car `L.DomEvent.stopPropagation` n'arrête pas la propagation DOM native vers `document`.

#### Positionnement

`position: absolute` dans `#carte-wrap` (qui est en `position: relative`). Coordonnées depuis `e.containerPoint` (point de clic Leaflet). `transform: translate(-50%, -100%)` + `margin-top: -6px` → la modale apparaît centrée au-dessus du point de clic.

#### Contenu

Une rangée d'icônes SVG (taille `tailleIconeVille()` = 24px au zoom min), gap 3px, padding 4px. Chaque icône :
- SVG rendu par `villeSVG()` (type, taille, estPirate)
- `mouseenter` → SVG actif (`estActive: true`) + tooltip maison (`carte-tooltip carte-cluster-modal__tip`)
- `mouseleave` → SVG normal + tooltip retiré (via `innerHTML` reset)
- `mouseenter`/`mouseleave` utilisés à la place de `mouseover`/`mouseout` — évite le bubbling depuis les éléments enfants (SVG, tooltip)
- `click` → `stopPropagation` + `fermerModalCluster()` + `ouvrirPanneauVille(id)`

#### Ordre des icônes dans la modale

Suit l'ordre de `Object.keys(markersVilles)`, lui-même fidèle à l'ordre d'insertion dans `renderVilles()` (ordre de `villes-data.js`). La propagation de voisinage peut perturber cet ordre pour les membres non directement adjacents — un tri explicite par index `VILLES` est possible si nécessaire.

#### Fonctions

- `ouvrirModalCluster(cluster, containerPoint)` — crée et injecte la modale dans `#carte-wrap`
- `fermerModalCluster()` — retire la modale du DOM (`querySelector + remove`)

Les deux fonctions sont en **section 17** (`carte.js`), entre `calculerPairesChevauchement()` et `ecarterVille()`.

#### CSS — `carte.css`

```css
.carte-cluster-modal          /* position:absolute, flex row, gap 3px, padding 4px, fond ink, border gold, border-radius 4px */
.carte-cluster-modal__icone   /* flex, position:relative, cursor:pointer, data-ville-id, data-actif */
.carte-cluster-modal__tip     /* position:absolute, bottom: calc(100% + 6px), centré, white-space:nowrap */
```

---

## Travaux complémentaires session 30

### Rang 3 — icônes MJ (bordeaux)

`villeSVG()` reçoit un paramètre supplémentaire `estRang3 = false` (6e argument). Couleurs :
- Normal : `#a03a3a`
- Actif/hover : `#c45a5a`

Tous les appelants passent désormais `estRang3` :
- `renderVilles()` — `const estRang3 = rang === '3'`
- `majTailleIconesVilles()` — `const estRang3 = (ville.rang ?? '1') === '3'`
- `setIconeVilleActive()` — même calcul
- `ouvrirModalCluster()` — même calcul

`setIconeVilleIsoleeHover()` non modifié — `estIsole = true` rend `estRang3` sans effet (fond toujours transparent).

### Filtre rang 3 — mode MJ uniquement

Le filtre "🔒 Établissements masqués" est injecté dynamiquement dans `.carte-filtre-enfants` par `confirmerModeMJ()` — il n'existe pas dans le HTML statique. Décoché par défaut. Classe `carte-filtre-check--mj` pour styling futur éventuel.

Son listener est branché directement dans `confirmerModeMJ()` (pas via `initFiltresMarqueurs()`, déjà appelé au chargement). Il met à jour la case maître en relisant dynamiquement tous les `.carte-filtre-check--sub` présents.

`renderVilles()` lit `filtreRang3 = document.getElementById('filtre-rang3')` — `null` hors mode MJ, `afficherRang3` vaut alors `false` par défaut (`?? false`). La garde rang 3 dans `renderVilles()` :
```javascript
if (rang === '3' && !modeMJ) return;
if (rang === '3' && !afficherRang3) return;
```
La condition de filtrage catégorie exclut rang 3 du bloc `afficherPrincipaux` : `else if (rang !== '3') { if (!afficherPrincipaux) return; }`.

### Case maître (`filtre-marqueurs-tout`) — nouveau comportement

**Avant** : bascule tout coché / tout décoché.  
**Après** : snapshot → tout masquer / restaurer snapshot.

- Au moins un enfant coché → snapshot de l'état de chacun → tout décocher.
- Tous décochés → restaurer le snapshot (ou tout cocher si pas de snapshot — premier clic sans état préalable).

Le listener maître relit les enfants dynamiquement (`document.querySelectorAll('.carte-filtre-enfants .carte-filtre-check--sub')`) pour inclure `filtre-rang3` s'il existe. Variable `snapshotFiltres` locale à `initFiltresMarqueurs()`.

### Recherche — portée des suggestions

`afficherSuggestions()` n'exclut plus les villes selon l'état des filtres (coché/décoché). Seule exclusion conservée : rang 3 hors mode MJ. Les villes rang 1 et 2 sont trouvables même si leur filtre est décoché — `zoomerVille()` recoche silencieusement les filtres et appelle `renderVilles()` pour créer le marqueur avant de lancer l'animation.

### `zoomerVille()` — ordre de rendu corrigé

Ajout de `renderVilles()` après la réactivation silencieuse des filtres et avant `setOpacity(0)` sur tous les marqueurs. Garantit que le marqueur de la ville cherchée existe dans `markersVilles` même si son filtre était décoché au moment de la recherche.

### Modale cluster — comportement panneau révisé

**Avant** : clic sur une icône de la modale → fermeture modale + ouverture panneau.  
**Après** : clic → panneau s'ouvre, modale reste visible. L'icône cliquée passe en état actif (`data-actif="true"`, SVG `estActive: true`) ; l'icône précédemment active repasse en état normal. Fermeture du panneau ville (`fermerPanneauVille()`) → ferme la modale. Clic en dehors → ferme la modale (comportement inchangé).

Chaque `iconeEl` porte `data-ville-id` et `data-actif`. Le `mouseleave` vérifie `data-actif` avant de repasser en état normal — évite de désactiver visuellement l'icône active au simple passage de souris.

`fermerPanneauVille()` appelle désormais `fermerModalCluster()` en fin de fonction.

---

## Architecture technique — `carte.js` (~2 415 lignes)

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
17. Chevauchement icônes (calculerPairesChevauchement, fermerModalCluster, ouvrirModalCluster, ecarterVille, rapprocherVille)
```

### Variables globales — chevauchement

```javascript
let pairesChevauchement = [];    // paires isolées (2 membres) → écartement
let clustersChevauchement = [];  // clusters (3+ membres) → modale
let mouseoutTimers = {};
let ecartementsActifs = {};      // clé "idA:idB" → { dxA, dyA, dxB, dyB, duree }
```

---

## Chantiers en attente

### Modale cluster — ajustements cosmétiques (si système définitivement validé)
- Tri des icônes par ordre d'apparition dans `villes-data.js` : `[...cluster.ids].sort((a, b) => VILLES.findIndex(v => v.id === a) - VILLES.findIndex(v => v.id === b))` dans `ouvrirModalCluster()` avant la boucle de construction.
- Timer de fermeture au mouseout de la modale (délai ~550ms, comme les timers paires) — à évaluer à l'usage.

### Loupe cartographique

**Concept** : au clic sur une icône de cluster, au lieu d'afficher les icônes en ligne, ouvrir un `div` circulaire (rayon ~60–65px) superposé à la carte, centré sur le point de clic, contenant une seconde instance Leaflet zoomée sur la zone du cluster. Les icônes y sont affichées dans leurs positions relatives réelles et sont cliquables (fermeture loupe + ouverture panneau ville).

**Avantage sur la modale** : contexte géographique préservé, positions relatives lisibles, ordre naturel — pas d'ordre aléatoire lié à la propagation de voisinage.

**Ce qui est simple** :
- `div` circulaire : `border-radius: 50%` + `overflow: hidden` — trivial.
- Centrage sur le clic : `containerPoint` déjà disponible dans le handler.
- Fermeture : même logique que la modale actuelle (listener `document`, guard `.carte-ville`).
- Nombre de marqueurs : N + 5 max (cluster de 5 icônes max observé) — négligeable en termes de performance.
- Synchronisation avec `renderVilles()` : appeler `fermerLoupe()` en tête de `renderVilles()` — la loupe est toujours fermée avant tout re-rendu, éliminant le risque de désynchronisation.

**Ce qui est nouveau par rapport à la modale** :
- Créer une seconde instance `L.map` dans le `div` loupe, même image de fond (`CARTE_IMAGE`), même `L.CRS.Simple`, centré sur le centroïde du cluster, à `zoom courant + N` (N à calibrer empiriquement).
- Créer uniquement les marqueurs du cluster dans cette instance secondaire (pas tous les marqueurs de la carte), avec handlers `click` : `fermerLoupe()` + `ouvrirPanneauVille(id)`.
- Calibrer le niveau de zoom de la loupe : assez élevé pour que les icônes soient écartées et lisibles, assez bas pour que le contexte géographique immédiat reste visible. Dépend de la densité du cluster — Panama (5 icônes) est le cas le plus dense observé.

**Inconnue principale** : comportement de Leaflet en `L.CRS.Simple` avec deux instances simultanées partageant la même image. Probable mais non testé dans ce projet — à valider en premier avant tout développement.

**Variante dégradée (si deux instances posent problème)** : loupe purement visuelle — zoom CSS (`transform: scale()`) sur un snapshot de la zone, sans interactivité. Les icônes sont identifiables mais non cliquables. Constituerait une régression par rapport à la modale actuelle (perte du clic direct) — à n'envisager qu'en dernier recours.

**Ordre d'implémentation recommandé** :
1. Valider la coexistence de deux instances `L.map` (stub minimaliste — div circulaire + carte vide centrée sur le cluster).
2. Ajouter les marqueurs du cluster dans la loupe + handlers click.
3. Calibrer le zoom et le rayon de la loupe.
4. Connecter `fermerLoupe()` dans `renderVilles()`, les filtres, et partout où `fermerModalCluster()` est actuellement appelé.
5. Retirer l'ancienne modale.

---

### Recalcul des paires/clusters au zoom — optimisation performance

Actuellement, `calculerPairesChevauchement()` est appelé dans le handler `moveend`, qui se déclenche aussi au pan (déplacement sans zoom). Si le nombre de marqueurs augmente significativement, ajouter un filtre :

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

À n'implémenter que si une dégradation des performances est constatée à l'usage.

---

### Autres chantiers

- **Écartement icônes — comportement erratique (mouseover rapide)** — correction structurelle complète impliquerait un refactor RAF. Non entrepris délibérément (session 27).
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`.
