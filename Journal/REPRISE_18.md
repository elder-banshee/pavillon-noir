# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans VS Code — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files`. Claude maintient une copie locale de référence si l'environnement le permet.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`), brume claire (`--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de bord
├── carte.html              # Carte interactive
├── css/
│   ├── style.css           # Styles globaux partagés (NE PAS SUPPRIMER)
│   ├── pnj.css             # Styles spécifiques registre PNJ
│   ├── equipage.css        # Styles spécifiques équipage
│   ├── chroniques.css      # Styles spécifiques chroniques
│   └── carte.css           # Styles spécifiques carte
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation, fetch rapports)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── carte.js            # Logique Leaflet, zones, pins, panneau, curseur, overlays
│   ├── carte-data.js       # Données carte (juridictions, pins, données temporelles)
│   ├── zones-data.js       # Contours territoriaux (ZONES_DATA) + démographie (ZONES_DEMO)
│   ├── audio.js            # Module audio ambiant (inactif)
│   └── mobile-nav.js       # Navigation mobile flottante
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   ├── covers/             # Illustrations chroniques (+ en_cours.jpg pour placeholder)
│   └── rapports/           # Textes des chroniques en Markdown (un fichier par scénario)
├── medias/
│   └── cartes/             # jaillot-1708.jpg — 8500×5320px, ~7,5 Mo
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## Workflow de développement

- **Branches Git** : `main` (production, site en ligne) et `dev` (développement)
- **Outils locaux** : VS Code + extension Live Server (Go Live en bas à droite)
- **Prévisualisation mobile** : DevTools Responsive (`Ctrl+Shift+M` dans l'onglet Inspecteur)
- **Workflow** : modifier dans VS Code → tester avec Live Server → commit sur `dev` → merger dans `main` → push
- **git pull** : inutile dans le workflow habituel (Ronan est le seul contributeur depuis un seul poste)
- **Raccourci utile** : `Shift+Alt+F` pour reformater/réindenter un fichier JS dans VS Code

---

## Architecture technique — page carte

### Structure HTML

```html
<main>
  <div class="carte-corps">
    <div class="carte-plus">
      <div id="carte-wrap">
        <div id="carte"></div>
      </div>
      <aside class="carte-panneau">...</aside>
    </div>
    <div class="carte-barre">
      <div class="carte-barre-gauche">
        <div class="carte-overlay-btns">...</div>
        <div class="carte-overlay-info">
          <span class="carte-overlay-label" id="carte-overlay-label">Géopolitique</span>
          <span class="carte-overlay-note" id="carte-overlay-note" style="display:none;">...</span>
        </div>
      </div>
      <div class="carte-curseur-inline" id="carte-curseur-inline">...</div>
      <div class="carte-credit" id="carte-credit">...</div>
    </div>
    <div class="carte-legende" id="carte-legende">...</div>
  </div>
</main>
```

### CSS — points clés de la barre de contrôles

```css
.carte-barre {
  position: relative; /* requis pour position:absolute du curseur */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.carte-barre-gauche {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding-right: 94px; /* largeur entière du curseur — évite le chevauchement */
}

.carte-overlay-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
}

.carte-curseur-inline {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.carte-credit {
  flex: 1;
  text-align: right;
}
```

### Système d'overlays — `carte.js`

Quatre overlays implémentés, un désactivé :

| Mode | Bouton | Statut | Description |
|------|--------|--------|-------------|
| `geo` | ⚑ | ✅ actif | Géopolitique — couleurs par puissance, légende interactive avec checkboxes |
| `densite` | ♟ | ✅ actif | Densité de population — 6 paliers verts (hab/km²) |
| `esclavage` | ⛓ | ✅ actif | Esclavage & Encomienda — 6 paliers, deux teintes (feuille-morte / rouge Andrinople) |
| `autochtones` | ➶ | ✅ actif | Foyers autochtones — 3 statuts qualitatifs (souveraineté / résistance / domination) |
| `masque` | ✕ | ✅ actif | Carte originale sans overlay |

#### Constantes globales dans `carte.js`

```javascript
let overlayMode = 'geo';
const puissancesMasquees      = new Set(); // ids de puissances masquées (geo)
const paliersMasquesDensite   = new Set(); // indices 0–5 (densite)
const paliersMasquesEsclavage = new Set(); // indices 0–5 (esclavage)
// Tous clearés au changement de mode dans initOverlayBtns()
```

#### `DENSITE_PALIERS` — 6 paliers, dégradé vert d'eau → épinard

Seuils en hab/px² : `0.05 / 0.15 / 0.5 / 2 / 8 / Infinity`

Correspondances en hab/km² (facteur ×3,03) : `< 0,15 / 0,15–0,45 / 0,45–1,5 / 1,5–6 / 6–24 / > 24`

Couleurs : `hsl(134,64%,72%)` → `hsl(180,25%,25%)`

Légende interactive (checkboxes) — paliers masqués → zones transparentes.

`couleurDensite(zoneId)` retourne `null` si `population === 0` → zone transparente.

#### `ESCLAVAGE_PALIERS` — 6 paliers, deux teintes

Seuils en ratio `(esclaves + indiens_asservis) / population` : `0.10 / 0.25 / 0.40 / 0.60 / 0.80 / Infinity`

Teinte déterminée par `esclaves >= indiens_asservis` :
- **Traite négrière** : rouge Andrinople `hsl(6, …)`
- **Encomienda** : feuille-morte `hsl(26, …)`

Légende interactive (checkboxes, deux pastilles côte à côte par palier).

Note "Encomienda / Traite négrière" affichée dans `.carte-overlay-note` à côté de l'intitulé — visible uniquement en mode `esclavage`, gérée dans `initOverlayBtns()`.

`couleurEsclavage(zoneId)` retourne `null` si `totalAsservis === 0` → zone transparente.

#### `AUTOCHTONES_COULEURS` — 3 statuts qualitatifs

```javascript
const AUTOCHTONES_COULEURS = {
  souverainete: 'hsl(19, 81%, 30%)',  // terra cotta sombre — vitalité maximale
  resistance:   'hsl(28, 68%, 43%)',  // ocre terra
  domination:   'hsl(39, 61%, 55%)',  // ocre pâle — effacement
};
```

Statuts stockés en statique dans `ZONES_DEMO[id].statut_autochtone` :
- `'souverainete'` | `'resistance'` | `'domination'` | `null` (transparent)
- Cas temporel Louisiane : `{ avant1718: 'souverainete', depuis1718: 'resistance' }`

`resoudreStatutAutochtone(demo, annee)` gère ce cas temporel.

Légende **non interactive** (3 catégories qualitatives, pas de filtrage).

#### Hover — philosophie retenue

Le hover ne modifie **jamais** `fillOpacity` (la teinte est une information en modes densite/esclavage/autochtones). Il ne modifie que `weight` :

```javascript
poly.on('mouseover', () => {
  if (zoneActive !== j.id) poly.setStyle({ weight: 2 });
});
poly.on('mouseout', () => {
  if (zoneActive !== j.id) poly.setStyle({ weight: 0.5 });
});
```

La règle CSS `.carte-zone:hover { fill-opacity: 0.35 !important; }` a été **supprimée** de `carte.css`.

#### `majZone(juridictionId)`

Restaure le style correct après désélection, selon `overlayMode` :

```javascript
if (overlayMode === 'densite' || overlayMode === 'esclavage' || overlayMode === 'autochtones') {
  style = { fillOpacity: isActive ? 0.90 : 0.70, weight: isActive ? 2 : 0.5 };
} else {
  // géo : opacités selon puissance masquée ou non
}
```

---

## `zones-data.js` — structure

Deux constantes dans le même fichier :

**`ZONES_DATA`** — contours territoriaux, inchangé. Clé = id zone, valeur = tableau d'anneaux de coordonnées pixel `[[x,y], ...]`.

**`ZONES_DEMO`** — démographie et métadonnées (circa 1716). Ajouté en session 18.

```javascript
'floride': {
  colons:             1500,
  esclaves:              0,
  indiens:            4000,
  indiens_asservis:      0,
  population:         5500,
  superficie:      1290944,  // px², Shoelace par anneau
  score_densite:     0.0037,  // log10(pop/superficie + 1)
  statut_autochtone: 'domination',
},
```

**Calcul de superficie** : formule de Shoelace appliquée **anneau par anneau** (pas en concaténant tous les points), puis somme. Le parser naïf par points crée des auto-intersections et fausse le résultat. Voir gen_zones_data.py ou le script Python de session 18 pour recalculer.

**Source TSV** : `Population_Méso-Amérique_1716_.tsv` — fichier de référence à conserver dans le dépôt ou en local.

---

## Note cartographique — Échelle de la carte Jaillot 1708

**Unité de mesure : English land league = 4,828 032 km (3 milles impériaux)**

100 lieues = 840 px à l'échelle 8500 × 5320 px.

- 1 px = 0,57477 km
- 1 px² = 0,33036 km²
- Facteur hab/px² → hab/km² : × 3,03

La Jaillot n'est pas une projection uniforme — les superficies en px² bruts (Shoelace) sont la seule base cohérente pour les comparaisons relatives.

---

## Note nomenclature — "Leeward Isles"

La carte Jaillot utilise **"Leeward Isles"** pour les îles hollandaises vénézuéliennes (Curaçao, Aruba, Bonaire…) — convention cartographique de l'époque.

`carte-data.js` utilise **"Leeward Islands"** pour le groupe britannique (Antigua, Nevis, Montserrat…) — convention britannique distincte.

---

## Chantiers ouverts — page carte

### Redécoupages de contours (Photoshop)

À faire par Ronan dans Photoshop, impact mineur sur les superficies et densités (inutile de recalculer) :

- **Nouvelle-Espagne** → retirer Chiapa (province à transférer au Guatemala)
- **Guatemala** → ajouter Chiapa
- **Honduras** → retirer la zone chevauchée par la Côte Miskito
- **Nicaragua** → retirer la zone chevauchée par la Côte Miskito

### Zones géographiques manquantes

Travail de décalquage progressif dans Photoshop (8500 × 5320 px) :
- Outil baguette magique ou plume → export SVG → recalage dans `carte-data.js`
- 25 à 40 juridictions à documenter progressivement

### Autres chantiers carte

- **Deep-link `pnj.html?id=xxx`** — `pnj.js` n'intercepte pas encore ce paramètre pour ouvrir automatiquement la bonne fiche au clic sur un gouverneur dans le panneau
- **Blasons** — dossier `medias/blasons/` à créer, fichiers SVG à déposer (gb, es, fr, nl, dk, nassau, amerindien)
- **Mobile** — page carte non optimisée pour mobile (panneau masqué sous 900px)
- **Overlay Autochtones — données temporelles** : l'overlay qualitatif est une solution de repli satisfaisante. Si des données de variation démographique sur deux points dans le temps devenaient disponibles, un overlay de variation % serait plus riche. Louisiane est le seul cas temporel implémenté pour l'instant (`{ avant1718, depuis1718 }`).

---

## Points de vigilance techniques — page carte

- **`carte-corps` sans `position: relative`** : essentiel pour ne pas créer de contexte d'empilement qui briderait le `z-index: 1000` du panneau
- **`pointer-events` sur l'overlay** : `.carte-popup-overlay` toujours en `pointer-events: none`
- **`stopPropagation`** sur les clics de zones et de pins : empêche la remontée vers le clic carte
- **`setTimeout` dans `initCarte`** : nécessaire avant `fitBounds`. Ne pas supprimer
- **`carte-data.js` doit être chargé avant `pnj-data.js` et `chroniques-data.js`** dans `carte.html`
- **`doubleClickZoom: false`** dans les options de `L.map()`
- **`-webkit-mask-image`** en doublon de `mask-image` — requis pour Safari
- **`rendreChamp` vs `rendreContexte`** : ne pas confondre. `rendreChamp` → un seul bloc actif. `rendreContexte` → tous les blocs actifs simultanément
- **Shoelace par anneau** : toujours traiter chaque anneau indépendamment avant de sommer. Concaténer les points de plusieurs anneaux crée des auto-intersections et fausse l'aire (constaté sur la Floride : 517K px² correct vs ~280K px² faux)
- **`paliersMasquesDensite` et `paliersMasquesEsclavage`** : clearés dans `initOverlayBtns()` au changement de mode. Ne pas oublier si un nouveau mode filtrable est ajouté

---

## Chantiers ouverts — autres pages (inchangés)

- **Rapports des chroniques II à VI** : rédiger et déposer dans `chroniques/rapports/`
- **Icônes SVG dans les hero** : remplacer le ☠ Unicode dans `.hero-divider-icon`
- **Bordures du `.hero-divider`** : disparaissent à certains niveaux de zoom (< 80%) — cosmétique
- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`
- **Pavillons** : continuer à alimenter `pnj/pavillons/` — ajouter `dk.svg` et `amerindien.svg`
- **`pnj-data.js`** : renseigner le champ `nationalites` pour les PNJ à double nationalité
- **Persistance des filtres PNJ** via `sessionStorage`
- **Factorisation CSS** : `.site-card` et `.badge` comme classes communes

---

## Points de vigilance techniques — autres pages (inchangés)

- **`mesurerNav()` padding** : `'0.75rem 1.25rem'` mobile / `'1rem 2rem'` desktop
- **Titre cliquable mobile** : `onclick="if(window.innerWidth<=700)goToPage(null)"` sur `.modal-chrono-num` et `.modal-chrono-titre`
- **Conclusions de rapport** : baliser en blockquote `>` pour le style brume
- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans
- **`marked.js`** : chargé depuis cdnjs dans `chroniques.html` avant `chroniques.js`
- **`overflow-x: hidden` sur `.modal--chronique`** : intentionnel
- **GitHub Pages** : latence de propagation parfois significative. Toujours vérifier avec `Ctrl+Shift+R`
