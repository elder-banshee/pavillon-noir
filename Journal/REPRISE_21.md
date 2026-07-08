# Notice de reprise — Pavillon Noir, site de campagne
*Session 21 — villes publiques, icônes villes, recherche villes, mode isolation ville*

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

1. **Connecteur GitHub (`main`)** — source principale pour le code de référence. Claude le consulte en début de session. Si `main` semble en retard sur `dev`, Claude compare les deux branches et rappelle à Ronan de merger avant de continuer.
2. **Fichiers du projet** (REPRISE_N.md + dépôt partagé) — contexte de session et fallback si le connecteur est indisponible. Ronan actualise le dépôt partagé en début de session.
3. **Desktop Commander** (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) — diagnostic post-copie : vérifier qu'un fichier local correspond bien à ce qui était prévu (accolade manquante, code collé au mauvais endroit, ligne supprimée accidentellement). Fichier toujours sauvegardé (Ctrl+S) avant lecture. Ne remplace pas la console navigateur pour les bugs de logique.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Si une fonctionnalité similaire existe et fonctionne sans patch, s'en inspirer : comprendre pourquoi elle ne rencontre pas le problème, et aligner l'architecture de la fonctionnalité défaillante sur ce modèle. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Structure des fichiers

```
├── index.html
├── pnj.html
├── equipage.html
├── chroniques.html
├── carte.html
├── css/
│   ├── style.css
│   ├── pnj.css
│   ├── equipage.css
│   ├── chroniques.css
│   └── carte.css
├── js/
│   ├── pnj-data.js
│   ├── pnj.js
│   ├── equipage.js
│   ├── chroniques.js
│   ├── chroniques-data.js
│   ├── carte.js            # Logique Leaflet principale — très modifié en session 21
│   ├── carte-data.js       # Juridictions, pins, données géopolitiques
│   ├── villes-data.js      # Données villes — nouvelle entrée Nassau
│   ├── zones-data.js       # Contours territoriaux + superficies
│   ├── audio.js
│   └── mobile-nav.js
```

---

## Workflow de développement

- **Branches Git** : `main` (production, toujours à jour) et `dev` (développement)
- **Outils locaux** : VS Code + extension Live Server
- **Workflow** : modifier dans VS Code → tester → commit sur `dev` → merger dans `main`
- **Lecture des fichiers** : utiliser le connecteur GitHub sur `main`. En début de session, vérifier que `main` est à jour avec `dev` et rappeler à Ronan de merger si nécessaire.

---

## Chantiers accomplis en session 21

### 1. Villes rendues publiques

Suppression de `if (!modeMJ) return;` dans `renderVilles()`. Conséquence : `renderVilles()` était conditionnée à `modeMJ` dans le `moveend` de la carte → remplacé par `majTailleIconesVilles()` pour ne recréer les marqueurs qu'au besoin, évitant les collisions Leaflet sur `removeLayer`.

### 2. Refonte complète des icônes villes (`villeSVG()`)

Signature finale :
```javascript
function villeSVG(type, estCapitale, taille = 24, estPirate = false, estIsole = false, estActive = false)
```

**Paramètres :**
- `estIsole` : icône en mode isolation recherche (fond transparent `rgba(0,0,0,0)`, contour et trait gold `#c8973a`)
- `estActive` : icône survolée ou panneau ouvert (fond éclairci)

**Couleurs selon statut :**

| Statut | Fond normal | Fond actif | Trait |
|---|---|---|---|
| Capitale | `#b04a36` | `#c9695a` | `#0e0c09` |
| Ville | `#6b7c8a` | `#8fa5b4` | `#0e0c09` |
| Pirate (Nassau <1718) | `#0e0c09` | `#3a3a3a` | `#f2e8d5` |
| Isolé (recherche) | `rgba(0,0,0,0)` | — | `#c8973a` |

**Symboles :**
- **Port** : ancre marine (anneau + tige + barre + deux arcs vers le bas rejoignant la tige)
- **Fort** : carré noir intérieur + croix X (couleur calculée : `#f0d5cf` sur bordeaux, `#dde6ea` sur mist, gold sur isolé)
- **Ville** : maison (toit triangulaire + murs + porte noire)

**Animation d'animation pré-zoom (ville isolée)** : blanc → gold-light (0.4s) → masqué → flyTo → réapparition gold via `moveend`. Les `.replace()` dans `zoomerVille()` ciblent à la fois `stroke="#c8973a"` et `fill="#c8973a"` pour que la porte de l'icône ville suive l'animation.

### 3. Tooltip : `labelVille()` et champ `label`

```javascript
function labelVille(ville) {
  if (ville.label) return ville.label;
  const SEUIL_PETIT_TERRITOIRE = 25000; // px²
  const demo = ZONES_DEMO[ville.territoire];
  if (demo && demo.superficie < SEUIL_PETIT_TERRITOIRE) {
    const j = JURIDICTIONS.find(j => j.id === ville.territoire);
    const nomTerritoire = j ? (j.label || j.nom) : null;
    if (nomTerritoire) return `${ville.nom} (${nomTerritoire})`;
  }
  return ville.nom;
}
```

Utilisée uniquement dans le tooltip — le panneau affiche toujours `ville.nom`.

### 4. En-tête panneau ville

Logique `labelEntete` dans `ouvrirPanneauVille()` :
- Si `ville.description` → afficher description (+ ` · Capitale` si applicable)
- Sinon si `capitale === true` → `"Capitale"` ou `"Port · Capitale"` / `"Fort · Capitale"` (jamais `"Ville · Capitale"`)
- Sinon → type brut (`"Port"`, `"Fort"`, `"Ville"`)

### 5. Population et garnison temporelles dans le panneau ville

`ouvrirPanneauVille()` utilise désormais `rendreChamp()` pour lire `ville.population` et `ville.garnison`, qui peuvent être des tableaux temporels ou de simples chaînes.

### 6. Statut `capitale` temporel

`capitale` peut désormais être un tableau de blocs temporels aligné sur `rendreChamp()` :
```javascript
capitale: [
  { de: 1712, a: 1718, texte: 'pirate' },
  { de: 1718, texte: true },
],
```
Valeurs possibles : `true`, `false`, `'pirate'`. Calculé par :
```javascript
const statutCapitale = Array.isArray(ville.capitale)
  ? rendreChamp(ville.capitale, anneeActive)
  : ville.capitale;
const estCapitale = statutCapitale === true;
const estPirate = statutCapitale === 'pirate';
```
Présent dans `renderVilles()`, `majTailleIconesVilles()`, `setIconeVilleActive()`, `setIconeVilleIsoleeHover()`, `ouvrirPanneauVille()`, `zoomerVille()`.

### 7. Nouvelle entrée Nassau dans `villes-data.js`

```javascript
{
  id: 'nassau',
  nom: 'Nassau',
  type: 'port',
  territoire: 'new-providence',
  coords: [4542, 1739],
  capitale: [
    { de: 1712, a: 1718, texte: 'pirate' },
    { de: 1718, texte: true },
  ],
  population: [
    { de: 1712, a: 1714, texte: `150 à 200 colons résidents<br>Population pirate flottante, pouvant atteindre 300 à 500 hommes en période de forte activité.` },
    { de: 1714, a: 1718, texte: `~100 colons résidents<br>Jusqu'à 1 000 pirates en escale.` },
    { de: 1718, texte: `300 à 500 résidents civils (colons anciens, repentis installés, esclaves, personnel de Rogers)<br>Garnison régulière : ~100 soldats.` },
  ],
  garnison: [
    { de: 1712, a: 1718, texte: `Fort Nassau : 4 canons en 1712. Garnison nulle — le fort est aux mains des pirates.` },
    { de: 1718, a: 1720, texte: `Fort Nassau en reconstruction sous Rogers.<br>~100 soldats réguliers, chroniquement décimés par la fièvre.` },
    { de: 1720, texte: `Fort Nassau : reconstruction achevée janvier 1720.<br>~100 soldats réguliers. En cas de crise : milice de ~500 hommes (repentis, colons, esclaves armés).` },
  ],
  contexte: [ /* blocs temporels détaillés */ ],
  note_mj: `...`,
}
```

**Sources population post-1718 :** Calendar of State Papers Colonial ; Woodard, *Republic of Pirates*. Les 600 combattants lors du raid espagnol de 1720 = ~100 soldats réguliers + ~500 miliciens (repentis, colons, esclaves armés en crise). La garnison de `carte-data.js` (new-providence) est à réviser en conséquence — travail en suspens, note ⚠️ à ajouter dans `note_mj` de new-providence.

### 8. Intégration des villes dans la recherche

`afficherSuggestions()` interroge désormais `VILLES` en plus de `JURIDICTIONS`. Les résultats ont un champ `type: 'ville'` ou `type: 'juridiction'`. Au clic : `zoomerVille(id)` pour les villes, `isolerTerritoire(id)` pour les juridictions.

Tags villes : si `ville.tags` est absent, fallback sur `[ville.nom, ville.label].filter(Boolean)`.

### 9. Mode isolation ville (`overlayMode = 'isolationVille'`)

Nouveau mode d'overlay symétrique à `'isolation'` territoire. Variables globales ajoutées :
```javascript
let isolationVilleId = null;
```

**`zoomerVille(villeId)`** :
1. Mémorise `overlayModeAvantIsolation` si on ne vient pas déjà de ce mode
2. Ferme le panneau proprement (inline, sans appeler `fermerZoomVille()`)
3. `overlayMode = 'isolationVille'`
4. Assombrit la carte, met à jour la légende ("Cliquer pour quitter")
5. `renderZones()` (passe tous les polygones à opacity 0 via `isEffacee`)
6. Masque tous les marqueurs, désactive `pointer-events` sur tous sauf la ville isolée
7. Élève le z-index du marqueur isolé à 9999
8. Animation : blanc → gold-light → masqué → `flyTo` → réapparition gold via `moveend`

**`fermerZoomVille(options = {})`** :
- Mémorise `villeIdFermee` avant de nullifier `isolationVilleId`
- Restaure opacity, `pointer-events`, z-index
- `majLegende()`, `renderZones()`, `renderPins()`, `renderVilles()`
- Si `options.ouvrirVille` : appelle `ouvrirPanneauVille(villeIdFermee)` après recréation

**Intégration dans `renderZones()` :**
```javascript
const isEffacee = (overlayMode === 'isolation' && !isIsolee) || overlayMode === 'isolationVille';
```

**Clics en mode `isolationVille` :**
- Clic sur une zone → `fermerZoomVille()` + `ouvrirPanneau(j.id)`
- Clic sur la ville isolée → `fermerZoomVille({ ouvrirVille: true })`
- Clic sur une autre ville → `fermerZoomVille()` + `ouvrirPanneauVille(ville.id)`
- Clic sur la carte → `fermerZoomVille()` seul

### 10. Animation isolation territoire rationalisée

Alignée sur le même principe que les villes : blanc → gold-light (0.4s) → masqué → `flyTo` → gold via `moveend`. L'ancien `setTimeout` à 400ms pour le flyTo est remplacé par 950ms (après masquage à 850ms). `fermerIsolation()` ajoute `fermerPanneau()` en entrée.

### 11. États visuels des icônes villes

**`setIconeVilleActive(villeId, actif)`** — survol et panneau ouvert (fond éclairci). `estIsole = false` toujours.

**`setIconeVilleIsoleeHover(villeId, hover)`** — survol en mode `isolationVille`. Fond gold translucide `rgba(200,151,58,0.25)` via `.replace('fill="rgba(0,0,0,0)"', ...)`.

**`majTailleIconesVilles()`** — préserve l'état isolé/actif au zoom :
```javascript
const estIsole = overlayMode === 'isolationVille' && id === isolationVilleId;
const estActive = !estIsole && villeActive === id;
```

**Handlers `mouseover`/`mouseout`** dans `renderVilles()` :
- En mode `isolationVille` sur la ville isolée → `setIconeVilleIsoleeHover()`
- Sinon → `setIconeVilleActive()` standard

### 12. Recherche au clavier — Enter

**Correction du blur** : `suggestions.addEventListener('mousedown', e => e.preventDefault())` empêche le volet de suggestions de voler le focus au clic ou au scroll.

**`suggestionActive`** : variable mémorisée au ArrowDown/ArrowUp, persistante même si le blur CSS retire la classe `--active`. Enter la consulte en priorité avant le querySelector DOM.

**Logique Enter complète (sans sélection ArrowDown) :**
1. `suggestionActive` → `.click()`
2. Item DOM `--active` → `.click()`
3. Un seul item → `.click()`
4. Correspondance exacte `nom` sur JURIDICTIONS (priorité)
5. Correspondance exacte `nom` sur VILLES
6. Correspondance exacte sur `tags` de JURIDICTIONS
7. `valeurCompletee` (après Tab) → recherche par nom exact

**Fantôme étendu aux villes** : `getSuggestion()` cherche d'abord dans JURIDICTIONS, puis dans VILLES si aucun résultat.

---

## Architecture technique — fonctions clés `carte.js`

### Variables globales pertinentes

```javascript
let overlayMode = 'geo'; // 'geo'|'densite'|'esclavage'|'autochtones'|'masque'|'isolation'|'isolationVille'
let overlayModeAvantIsolation = 'geo';
let isolationJuridictionId = null;
let isolationLayer = null;
let isolationVilleId = null;
let villeActive = null;
let markersVilles = {};
```

### Pipeline d'affichage des villes

```
renderVilles()                  — crée les marqueurs, handlers click/hover
  └─ tailleIconeVille()         — 96px / 48px / 24px selon zoom
  └─ labelVille()               — tooltip enrichi (territoire si petite île)
  └─ villeSVG()                 — SVG selon type/statut/état

majTailleIconesVilles()         — mise à jour icône sans recréer les marqueurs (moveend)
setIconeVilleActive()           — hover / panneau ouvert
setIconeVilleIsoleeHover()      — hover en mode isolationVille
zoomerVille()                   — mode isolationVille complet
fermerZoomVille()               — sortie du mode isolationVille
```

### Coordonnées

Pixels 8500×5320. Saisies depuis Photoshop (F8). `pixelToLatLng(x, y)` inverse l'axe Y. Entrées sans coordonnées : `coords: null`.

### Séquence secrète mode MJ

Eleuthera → Marguerita → Jamaïque → Île du Maïs → confirmer popup.

---

## Points de vigilance

- **`fermerPanneau()` ne doit pas appeler `fermerZoomVille()`** — la relation causale a été source de bugs en session 21. `fermerZoomVille()` est appelé uniquement depuis les handlers de clic carte, zones, villes, et le bouton ✕ du panneau via `fermerPanneauVille()`.
- **`fermerPanneau()` dans `zoomerVille()`** : appelé inline (sans passer par `fermerZoomVille()`) pour éviter de corrompre `overlayModeAvantIsolation` avant que `overlayMode` soit changé.
- **`renderVilles()` recrée tous les marqueurs** — les `pointer-events` et z-index posés manuellement sont perdus à la recréation. `fermerZoomVille()` les restaure avant d'appeler `renderVilles()`.
- **Animation `.replace()`** dans `zoomerVille()` : cible `stroke="#c8973a"` ET `fill="#c8973a"` — les deux doivent être remplacés pour que la porte de l'icône ville suive l'animation.
- **`villes-data.js` chargé après `carte-data.js` et avant `carte.js`** — ordre des `<script>` dans `carte.html` important.
- **Le panneau droit est partagé zones/villes** — ouvrir l'un ferme l'autre.
- **`j.note` dans `ouvrirPanneau()`** : aucune juridiction ne possède ce champ — réservé pour observations joueurs. Ne pas supprimer.

---

## Chantiers ouverts

- **Population new-providence à réviser** dans `carte-data.js` — la période post-1718 sous-estime la population (300→800 personnes d'après les sources). Note ⚠️ à ajouter dans `note_mj` de new-providence en attendant.
- **Statut `capitale` temporel pour Mobile** — `capitale: true` jusqu'en 1717, `false` ensuite (La Nouvelle-Orléans fondée en 1718). À implémenter dans `villes-data.js` quand l'entrée Mobile sera créée.
- **Champ `description`** dans `villes-data.js` — optionnel, affiché en en-tête du panneau à la place du type brut. Ex : `"Capitainerie générale"`, `"Mission franciscaine"`. À renseigner au fil des besoins.
- **Champ `tags`** dans `villes-data.js` — non encore renseigné pour la plupart des entrées. Utilisé par la recherche ; fallback sur `[nom, label]` si absent.
- **Coordonnées manquantes** : `mobile`, `saint-georges-bermudes`, `fort-san-lorenzo` ont `coords: null`.
- **Harmonisation `note_mj`** : certaines utilisent `\n` (ne fonctionne pas), d'autres `<br>`. À passer intégralement en `<br>` + `<em>`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`.
- **Champ `note`** dans `carte-data.js` : à renseigner au fil des aventures pour les observations joueurs.
- **Brand "Pavillon Noir" dans la nav** : idée en réserve.
