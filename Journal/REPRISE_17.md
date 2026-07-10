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
│   ├── carte.js            # Logique Leaflet, zones, pins, panneau, curseur
│   ├── carte-data.js       # Données carte (juridictions, pins, données temporelles)
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

### Structure HTML (inchangée)

```html
<main>
  <div class="carte-curseur">...</div>
  <div class="carte-corps">
    <div class="carte-plus">
      <div id="carte-wrap">
        <div id="carte"></div>
      </div>
      <aside class="carte-panneau">...</aside>
    </div>
    <div class="carte-credit">...</div>
  </div>
</main>
```

### Nouveau moteur de rendu temporel — `carte.js`

La session 17 a entièrement refondu la gestion des données temporelles dans `carte-data.js` et `carte.js`. **Lire attentivement avant toute modification.**

#### Deux nouvelles fonctions dans `carte.js`

```javascript
// Rendu d'un champ simple (capitale, population, économie)
function rendreChamp(valeur, annee) { ... }

// Rendu du contexte narratif complet
function rendreContexte(contexte, annee) { ... }
```

Ces fonctions remplacent l'appel direct à `resoudre()` pour `contexte`, `capitale`, `population_approx` et `economie`.

#### `rendreChamp(valeur, annee)`

- **string** → retournée telle quelle (rétrocompat)
- **tableau de blocs** → retourne le `texte` du bloc dont `de <= annee < a` (ou `de <= annee` si pas de `a`). **Un seul bloc actif à la fois** — le plus récent dont la borne `de` est dépassée.

#### `rendreContexte(contexte, annee)`

Trois formats supportés en cascade (rétrocompatiblité complète) :

1. **string** → retournée telle quelle
2. **objet `{ 1712: '...', 1715: '...' }`** (ancien format) → délégué à `resoudre()`
3. **objet `{ permanent, depuis, ponctuel }`** (format intermédiaire) → logique de sujets avec accumulation
4. **tableau de blocs** (nouveau format) → voir ci-dessous

#### Nouveau format `contexte` — tableau de blocs

```javascript
contexte: [
  {
    de: 1712,           // année d'apparition (incluse)
    a: 1720,            // année de disparition (exclue) — optionnel
    texte: `...`,       // contenu HTML du bloc
  },
  {
    de: 1715, a: 1722,
    versions: [         // sous-versions mutuellement exclusives
      { de: 1715, a: 1716, texte: `...` },
      { de: 1716, a: 1717, texte: `...` },
      { de: 1717,          texte: `...` },
    ],
  },
]
```

**Comportement** : tous les blocs actifs (dont `de <= annee < a`) sont affichés simultanément, joints par `<br><br>`. Le champ `versions` permet d'afficher le texte le plus récent ≤ annee parmi les sous-versions — le bloc parent contrôle la visibilité globale, les versions contrôlent le texte affiché.

#### `rendreChamp` — règle importante

`rendreChamp` ne retourne **qu'un seul bloc** (le plus récent actif). Ne pas l'utiliser pour afficher plusieurs contenus simultanés. Si plusieurs contenus doivent coexister dans `population_approx` ou `economie`, les dupliquer dans les blocs successifs.

---

## Chantiers accomplis en session 17

### Refonte complète de `carte-data.js`

Toutes les juridictions ont été migrées vers le nouveau format de données temporelles. Travail éditorial massif : contenu revu, enrichi, restructuré pour chaque juridiction de la carte.

#### Cuba
Contenu finalisé — la juridiction `test-scroll` (lorem ipsum) est **supprimée et remplacée** par des données historiques complètes.

#### Caroline du Sud — modèle de référence
Bloc pilote pour le nouveau format. Contient : `puissance`, `gouverneur`, `contexte` (tableau de blocs avec `versions`), `capitale` (string), `population_approx` (tableau), `economie` (tableau). Sert de référence pour toutes les autres juridictions.

#### Ensemble des juridictions migrées
Toutes les juridictions du fichier ont été converties au nouveau format et enrichies éditorialement :
- **Antilles françaises** : Martinique, Guadeloupe, Saint-Domingue, Grenade, Saint-Barth
- **Antilles britanniques** : Jamaïque, Barbade, Saint-Christophe, Leeward Islands, Bermudes
- **Antilles hollandaises et danoises** : Curaçao, Saint-Thomas, Sainte-Croix, Saba/Statia, Saint-Martin
- **Antilles espagnoles** : Cuba, Porto Rico, Santo Domingo, Trinidad
- **Petites Antilles contestées** : Dominique, Saint-Vincent, Sainte-Lucie, Tobago
- **Amérique du Nord** : Caroline du Sud, Caroline du Nord, Virginie, Maryland/Delaware, Pennsylvanie/New-Jersey, New-York, Nouvelle-Angleterre, Floride, Louisiane
- **Amérique centrale et Mexique** : Guatemala, Honduras, Nicaragua, Costa Rica, Panama/Veragua, Darién, Nouvelle-Espagne, Yucatán, Pánuco, Nueva Galicia, Nouveau-Mexique
- **Amérique du Sud** : Nouvelle-Grenade, Carthagène, Venezuela, Cumaná/Nueva Andalucía, Marguerita, Tortuga vénézuélienne, Guyane
- **Zones sans administration** : Côte Miskito, Îles de la Baie, Providence/San Andrés, Bahamas archipel, Cayes Belize, Îles Vierges britanniques

#### Philosophie éditoriale retenue
- Texte destiné aux joueurs (pas au MJ) — pas de métadonnées de jeu dans les blocs `contexte`
- **Permanent** (blocs sans `a`) : vrai sur toute la période, toujours affiché
- **Borné** (blocs avec `de` et `a`) : actualité ponctuelle, événement, gouverneur particulier
- **Versions** : texte évolutif sur le même sujet (ex. guerre yamasee en 1715, 1716, 1717)
- Richesse variable selon l'importance narrative : Nassau, Porto Rico, Jamaïque, Martinique sont très détaillés ; juridictions périphériques sont sobres
- Notes historiques (`/* note: ... */`) en commentaires JS — ne s'affichent pas

---

## Note nomenclature — "Leeward Isles"

La carte Jaillot de 1708 utilise **"Leeward Isles"** pour désigner les îles hollandaises vénézuéliennes (Curaçao, Aruba, Bonaire, Roca, Orchilla, Tortuga vénézuélienne) — convention espagnole et cartographique de l'époque.

Le fichier `carte-data.js` utilise **"Leeward Islands"** pour le groupe britannique (Antigua, Nevis, Montserrat, Anguilla, Barbuda) — convention britannique distincte.

Ces deux usages coexistent sans conflit dans le fichier, mais si l'interface affiche ce nom comme label de zone, il faudra vérifier que les deux groupes ne prêtent pas à confusion.

---

## Piste scénaristique — Le cacique Maturín (1718)

Une note de synthèse a été générée : **`piste_cacique_maturin.md`** — à verser dans le Projet : Scénarios. Sujet : bataille de 1718 entre le gouverneur Carreño (Cumaná) et une coalition chaima fédérée sous le cacique Maturín. Pistes narratives : missionnaire français non identifié, coalition survivante, héritier potentiel, liens avec le PJ trinidadien et la Guyane française.

---

## Chantiers ouverts — page carte

### Prioritaire : zones géographiques

Travail de décalquage des juridictions dans Photoshop (8500 × 5320 px) :
- Outil baguette magique ou plume pour tracer les contours
- Export SVG depuis Photoshop → Illustrator/Inkscape
- Recalage des coordonnées dans `carte-data.js`
- 25 à 40 juridictions à documenter progressivement
- ~~Juridiction `test-scroll` (Cuba lorem ipsum) à remplacer~~ **✅ Cuba est traité**

### Filtres thématiques (chantier futur)

Idée validée : afficher les zones avec différents modes de coloration selon un sélecteur (puissance coloniale, densité démographique, ratio blancs/esclaves, etc.).

**Architecture envisagée** :
- Sélecteur de mode au-dessus de la carte, à côté du curseur temporel
- Chaque mode correspond à une fonction de calcul de couleur appliquée à chaque zone
- Les données nécessaires (population, superficie, etc.) sont déjà dans `carte-data.js` — `population_approx` est un tableau de blocs temporels, les valeurs numériques sont à extraire si nécessaire

**Calcul de superficie** : la formule du lacet de Shoelace permet de calculer l'aire d'un polygone depuis ses sommets pixel, convertible via l'échelle graphique. Les superficies en px² bruts sont la seule base cohérente (la Jaillot n'est pas une projection uniforme).

### Autres chantiers carte

- **Deep-link `pnj.html?id=xxx`** — `pnj.js` n'intercepte pas encore ce paramètre pour ouvrir automatiquement la bonne fiche au clic sur un gouverneur dans le panneau
- **Blasons** — dossier `medias/blasons/` à créer, fichiers SVG à déposer (gb, es, fr, nl, dk, nassau, amerindien)
- **Lien "Carte" dans la nav** — à ajouter dans `index.html`, `pnj.html`, `equipage.html`, `chroniques.html`
- **Mobile** — page carte non optimisée pour mobile (panneau masqué sous 900px, reste à réfléchir)

---

## Points de vigilance techniques — page carte

- **`carte-corps` sans `position: relative`** : essentiel pour ne pas créer de contexte d'empilement qui briderait le `z-index: 1000` du panneau
- **`pointer-events` sur l'overlay** : l'overlay `.carte-popup-overlay` reste toujours en `pointer-events: none`
- **`stopPropagation`** sur les clics de zones et de pins : empêche la remontée vers le clic carte
- **`setTimeout` dans `initCarte`** : nécessaire pour laisser le DOM se stabiliser avant `fitBounds`. Ne pas supprimer
- **`carte-data.js` doit être chargé avant `pnj-data.js` et `chroniques-data.js`** dans `carte.html`
- **`doubleClickZoom: false`** dans les options de `L.map()`
- **`-webkit-mask-image`** en doublon de `mask-image` — requis pour Safari
- **`rendreChamp` vs `rendreContexte`** : ne pas confondre les deux fonctions. `rendreChamp` → un seul bloc actif (champs simples). `rendreContexte` → tous les blocs actifs simultanément (contexte narratif)

---

## Chantiers ouverts — autres pages (inchangés)

- **Rapports des chroniques II à VI** : rédiger et déposer dans `chroniques/rapports/`
- **Icônes SVG dans les hero** : remplacer le ☠ Unicode dans `.hero-divider-icon`
- **Bordures du `.hero-divider`** : disparaissent à certains niveaux de zoom (< 80%) — cosmétique
- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente
- **Crédits — titre cliquable avec infobulle** : afficher le titre de l'œuvre, info complète au survol
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`
- **Pavillons** : continuer à alimenter `pnj/pavillons/` — ajouter `dk.svg` (danois) et `amerindien.svg`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/`
- **`pnj-data.js`** : renseigner le champ `nationalites` pour les PNJ à double nationalité
- **Persistance des filtres PNJ** via `sessionStorage`
- **Bandeau défilant dans la nav fixe** : idée en réserve
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

---

## Note cartographique — Échelle de la carte Jaillot 1708 (inchangée)

**Unité de mesure identifiée : English land league = 4,828 032 km (3 milles impériaux)**

Mentionnée sur la carte comme "100 lieues anglaises et françaises = 840 px" à l'échelle 8500 × 5320 px.

**Facteur de conversion :**
- 1 px = (100 / 840) × 4,828 032 = 0,57477 km
- 1 px² = 0,33036 km²

**Conclusion définitive :** les superficies en px² bruts (Shoelace) sont la seule base cohérente pour l'overlay densité. La Jaillot n'est pas une projection uniforme — Cuba est bien cartographiée (−3,76%), la Jamaïque surestimée (+23,7%), Porto Rico sous-estimée (−16,1%).

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **VS Code**
3. Prévisualisation avec **Live Server** (Go Live en bas à droite de VS Code)
4. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose
5. Commit sur `dev` dans GitHub Desktop, puis merge dans `main` quand validé
6. Pour un audit : Ronan uploade les fichiers directement dans le chat (GitHub peut servir des versions en cache)
