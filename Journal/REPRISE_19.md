# Notice de reprise — Pavillon Noir, site de campagne
*Session 19 — audit carte et mise à jour README*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── carte.html              # Carte géopolitique des Caraïbes
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
│   ├── carte.js            # Logique Leaflet, zones, pins, panneau, curseur, mode MJ
│   ├── carte-data.js       # Données carte (juridictions, pins, données temporelles)
│   ├── zones-data.js       # Contours territoriaux (coordonnées pixel) et données démographiques
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

- **Branches Git** : `main` (production) et `dev` (développement)
- **Outils locaux** : VS Code + extension Live Server
- **Workflow** : modifier dans VS Code → tester avec Live Server → commit sur `dev` → merger dans `main` → push
- **Raccourci utile** : `Shift+Alt+F` pour reformater/réindenter un fichier JS dans VS Code

---

## Chantiers accomplis en session 19 (audit carte + README)

### Audit `carte.html`

Propre. Ordre des scripts correct (`zones-data.js` → `carte-data.js` → `carte.js`). `audioInit(null)` cohérent avec les autres pages. Footer commenté conservé intentionnellement.

### Audit `css/carte.css`

Propre. Rien à supprimer ni corriger.

### Audit `js/carte.js`

**Code mort identifié et conservé intentionnellement** : le rendu de `j.note` dans `ouvrirPanneau()` :
```javascript
${j.note ? `<p class="panneau-note">${j.note}</p>` : ''}
```
Les champs `note` de `carte-data.js` ont été convertis en `note_mj` lors d'une session précédente, mais `note` est destiné à revenir — observations destinées aux joueurs, au cas par cas selon leurs aventures. **Ne pas supprimer ce bloc.**

**Dépendance croisée documentée** : `resoudre()` est définie dans `carte-data.js` mais fait référence à `modeMJ` (variable de `carte.js`). Fonctionne car `carte.js` est chargé après et `resoudre()` n'est appelée qu'à l'exécution. Pas de bug, dépendance implicite à conserver en tête.

### Audit `js/carte-data.js`

**Incohérence corrigée dans `zones-data.js`** : entrée `'marguerita'` de `ZONES_DEMO` — le champ `population` était à `0` alors que `colons: 1000` + `indiens: 8000` = 9000. Corrigé :
```javascript
population: 9000,
score_densite: 0.383,
```

### Mise à jour `README.md`

README entièrement refondu (généré et remis à la racine du dépôt). Mises à jour par rapport à l'ancienne version :
- Page carte ajoutée partout (liste des pages, arborescence, section dédiée)
- `zones-data.js`, `medias/cartes/`, `chroniques/rapports/` ajoutés à l'arborescence
- Champ `rapport` ajouté au format des chroniques (remplace `chapitres`)
- Champ `note_mj` ajouté au format des PNJ
- Section « Page carte — architecture » : Leaflet, juridictions, pins, `CARTE_ANNEE_REFERENCE`, coordonnées
- Workflow Git simplifié (GitHub Desktop + VS Code, sans les commandes Git Bash)

---

## Points de vigilance et dette connue

### Dette acceptée (à ne pas corriger maintenant)

- **Bloc audio `style.css`** (~80 lignes) : styles `.audio-mute-btn`, `.audio-popup`, etc. dormants tant qu'`AUDIO_ENABLED = false`. À conserver — l'audio est un chantier ouvert.
- **`tagsVisibles` calculé 3× dans `pnj.js`** : logique dupliquée dans `buildTagFilters()`, `majEtatFiltres()`, et `getSuggestion()`. À factoriser si on retouche les filtres.
- **`!important` dans `pnj.css` mobile** : surcharges héritées des itérations du système de filtres. Fonctionnel mais fragile si on retouche les filtres mobile.
- **`onclick` inline** dans `mobile-nav.js` (bouton "Haut de page") et dans `chroniques.js` (`closeModal`, `goToPage`, `navGroupe`) : incohérence de style avec le reste, sans conséquence fonctionnelle.
- **`audioInit('ost/xxx.mp3')`** sur toutes les pages : fichiers inexistants, inoffensif tant qu'`AUDIO_ENABLED = false`.
- **`window.AUDIO_PAGE_SRC`** dans `audio.js` / `toggleMute()` : variable globale non exposée par les pages actuelles — à documenter lors de l'activation de l'audio.
- **Double `rAF`** dans `equipage.js` : technique standard pour forcer le reflow avant une transition CSS. Fonctionnel, mériterait un commentaire explicatif.
- **`grid-template-columns: repeat(4, 1fr)` → `1fr`** dans `index.html` : pas de breakpoint tablette intermédiaire. À considérer si on affine le responsive.
- **Script `audioInit` inline** dans `chroniques.html` : logique métier non triviale dans le HTML plutôt que dans `chroniques.js`. À factoriser si on retouche la page.
- **`resoudre()` dans `carte-data.js`** fait référence à `modeMJ` (défini dans `carte.js`) : dépendance croisée implicite. Fonctionnel, à garder en tête.
- **`j.note` dans `ouvrirPanneau()` (`carte.js`)** : aucune juridiction ne possède ce champ actuellement — réservé pour des observations joueurs au fil des aventures. Ne pas supprimer.

### Point à vérifier

- **`hippogriffe` dans `chroniques-data.js`** : champ `rapport: "chroniques/rapports/marianne.md"` — ce nom de fichier est suspect (rapport de la Marianne pour le scénario Hippogriffe ?). À confirmer avec Ronan.

---

## Architecture technique — page carte

Moteur de rendu temporel refondu en session 17 : fonctions `rendreChamp()` et `rendreContexte()` dans `carte.js`, nouveau format de données en tableaux de blocs dans `carte-data.js`. Rétrocompatibilité complète avec les anciens formats.

### Fonctions clés

**`rendreChamp(valeur, annee)`** — champs simples (capitale, population, économie) :
- string → retournée telle quelle
- tableau de blocs `[{ de, a, texte }]` → retourne le texte du bloc actif à `annee`

**`rendreContexte(contexte, annee)`** — contexte narratif complet, trois formats supportés en cascade :
1. string → retournée telle quelle
2. objet `{ 1712: '...', 1715: '...' }` (ancien format) → délégué à `resoudre()`
3. tableau de blocs `[{ de, a, texte, versions? }]` (format courant)

**`resoudre(champ, annee)`** — résolution temporelle générique (définie dans `carte-data.js`).

### Séquence secrète mode MJ

Cliquer dans l'ordre : Eleuthera → Marguerita → Jamaïque → puis cliquer sur l'Île du Maïs qui apparaît → confirmer dans la popup. Déverrouille les `note_mj`, les zones `visible_mj: true` et les années futures au-delà de `CARTE_ANNEE_REFERENCE`.

### Points techniques à ne pas oublier

- **`carte-data.js` doit être chargé avant `pnj-data.js` et `chroniques-data.js`** dans `carte.html` — ordre des scripts important
- **`setTimeout` dans `initCarte()`** : nécessaire pour laisser le DOM se stabiliser avant `fitBounds`. Ne pas supprimer.
- **`-webkit-mask-image`** en doublon de `mask-image` dans `.carte-panneau-inner` — requis pour Safari
- **`doubleClickZoom: false`** dans les options de `L.map()` — désactivé pour éviter les zooms accidentels
- **Coordonnées des pins** : pixels à l'échelle 8500×5320. Facteur de conversion depuis Photoshop (24408×15276) : ×0,348
- **`CARTE_ANNEE_REFERENCE`** : à mettre à jour manuellement après chaque session jouée

---

## Chantiers ouverts

- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte. Idée en réserve : info contextuelle ou effet visuel
- **Lien Chroniques dans la nav** : déjà visible, contenu en cours d'alimentation
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Rapports des chroniques** : rédiger et déposer dans `chroniques/rapports/`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`, exposer `window.AUDIO_PAGE_SRC` sur chaque page
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Bandeau défilant dans la nav fixe** : idée en réserve (dernier scénario joué, date en jeu, prochaine session)
- **Champ `note`** dans `carte-data.js` : à renseigner au fil des aventures pour les observations destinées aux joueurs (distinct de `note_mj`)
