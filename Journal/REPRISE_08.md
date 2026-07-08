# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files` plutôt que d'afficher le contenu dans le chat. Claude maintient une copie locale de référence si l'environnement le permet.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus (rail marin et navire désactivés sur chroniques)

---

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── css/
│   ├── style.css           # Styles globaux partagés (NE PAS SUPPRIMER)
│   ├── pnj.css             # Styles spécifiques registre PNJ
│   ├── equipage.css        # Styles spécifiques équipage
│   └── chroniques.css      # Styles spécifiques chroniques
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── audio.js            # Module audio ambiant (inactif)
│   └── mobile-nav.js       # Navigation mobile flottante
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   └── covers/             # Illustrations chroniques (+ en_cours.jpg pour placeholder)
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

### Chargement CSS par page

- `index.html` → `style.css` uniquement
- `pnj.html` → `style.css` + `pnj.css`
- `equipage.html` → `style.css` + `equipage.css`
- `chroniques.html` → `style.css` + `chroniques.css`

### Chargement JS par page

Toutes les pages chargent `audio.js` + `mobile-nav.js` en fin de `<body>`.
`index.html` : `mobile-nav.js` est chargé mais s'auto-désactive (test sur pathname).

---

## Chantiers accomplis en session 8

### Simplification de la navigation

- **Lien "Accueil" supprimé** de `<ul class="nav-links">` dans `pnj.html`, `equipage.html` et `chroniques.html` — le brand "Pavillon Noir" suffisait comme chemin de retour
- **Brand `<a>` → `<span>`** dans les trois mêmes fichiers : le lien brand est temporairement désactivé (remplacé par un `<span class="nav-brand">`) en attendant de lui assigner une fonctionnalité plus intéressante (info contextuelle : date de prochaine session, dernier scénario joué, effet visuel…). C'est un chantier ouvert.

### Corrections `chroniques.js`

- **Bouton "Lire →" supprimé** des cartes d'aperçu — le clic sur la carte entière suffit
- **Écouteur `.chrono-lire` supprimé** en conséquence — seul l'écouteur `.chrono-carte` subsiste
- **Accolade fermante de `renderCartes()`** restituée après une suppression accidentelle lors des manipulations ci-dessus (provoquait `Uncaught SyntaxError: Unexpected end of input`)
- **Référence résiduelle à `.chrono-lire`** dans le drag de la piste (`if (!e.target.closest('.chrono-lire'))`) — à nettoyer à l'occasion, inoffensive mais obsolète

### Correction `mobile-nav.js`

- **Timer de disparition** : à la fermeture du panneau via le bouton coffre (re-clic), le timer ne se relançait pas. Corrigé en ajoutant `else scheduleHide()` dans le listener du bouton.

### Illustrations chroniques — modal

- **Format 16:9** pour le banner dans la modal ouverte (était 4:3 comme l'aperçu) — effet panoramique recherché
- **Champ `align`** ajouté dans `chroniques-data.js` (ex: `align: 50`) : contrôle le `object-position` vertical du banner modal uniquement, en pourcentage (50 = centré, 40 = remonté, 60 = descendu). L'aperçu 4:3 n'est pas affecté.
- **Placeholder** `en_cours.jpg` substitué aux divs ☠ pour les chroniques sans illustration, aussi bien dans l'aperçu que dans la modal

### Métadonnées des cartes et modals

- **Grille méta toujours complète** (6 blocs fixes) : les valeurs nulles affichent `—` au lieu de disparaître, pour homogénéité visuelle — particulièrement utile sur mobile où les renvois à la ligne irréguliers étaient perturbants
- **Couleurs méta** : blocs avec valeur en gold (`--gold` / `--gold-light`), blocs nuls en `--mist` (même couleur que les postes vacants dans l'équipage). Classes CSS ajoutées : `.chrono-meta-item--vide` et `.modal-chrono-meta-item--vide`

### Correction mineure `chroniques.css`

- `line-clamp: 2` ajouté aux côtés de `-webkit-line-clamp: 2` pour supprimer l'avertissement GitDev (propriété dépréciée)

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans. Sans lui, toutes les pages perdent leur style.
- **Nav mobile et `position: fixed`** : l'infobulle `.crew-tooltip` (459px, `position: absolute`) créait un contexte qui décalait les éléments `fixed` sur `equipage.html`. Résolu en corrigeant l'infobulle. À garder en tête si d'autres éléments `fixed` sont ajoutés sur cette page.
- **SVG inline dans JS** : toujours utiliser des backticks `` ` `` pour les chaînes multilignes.
- **Styles natifs des `<button>`** : neutraliser avec `appearance: none`, `border: none`, `background: transparent`, `outline: none`, `padding: 0`.
- **`background-size` sur `.stat-fill`** : `(5/val)*100%` — ne pas confondre avec la largeur.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM — uniquement pour les barres de composition (`.crew-bar-reveal`).
- **Cache navigateur** : Ctrl+Shift+R pour forcer le rechargement sans cache.
- **Google Sheets** : les modifications peuvent mettre quelques minutes à se propager via l'URL CSV.
- **`overflow-x: hidden`** : déjà présent sur `body` dans `style.css` — ne pas supprimer.
- **`chroniques.html` — modal** : `.modal-overlay` est partagé avec `pnj.html` via `style.css`, mais `.modal--chronique` surcharge `.modal` — bien vérifier la cascade si on touche aux styles de base.
- **Opérateur `?? 50`** dans `chroniques.js` : coalescence nulle — si `c.align` est absent ou `null`, la valeur par défaut est 50. Les entrées sans champ `align` fonctionnent sans modification.

---

## Correctifs prioritaires identifiés (reports session 7, toujours ouverts)

1. **`mobile-nav.js`** — ajouter `{ label: 'Chroniques', href: 'chroniques.html' }` dans `NAV_LINKS` (à faire quand la page sera rendue visible)
2. **Double `class="active"`** — dans `equipage.html`, `chroniques.html` et `pnj.html`, le `<li hidden>` du lien Chroniques porte `class="active"` à tort ; retirer cet attribut
3. **`README.md`** — mettre à jour (structure de fichiers obsolète, `app.js` → `pnj.js`, description de `index.html` incorrecte) — reporté en fin de session 8, à traiter en session 9
4. **Référence résiduelle `.chrono-lire`** dans le mousedown de la piste (`chroniques.js`) — inoffensive mais obsolète depuis la suppression du bouton

---

## Chantiers ouverts

- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte. Idée en réserve : afficher une info contextuelle (date prochaine session, dernier scénario joué) ou déclencher un effet visuel. Pas d'idée arrêtée — "urgent d'attendre".
- **Lien Chroniques dans la nav** : retirer `hidden` sur `<li hidden>` dans les trois pages quand le contenu sera prêt — et appliquer les correctifs ci-dessus au préalable. La page est fonctionnelle mais les textes des chroniques sont en cours de rédaction.
- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3 minimum, conçues avec zones calmes haut/bas pour le recadrage 16:9 de la modal) et régler le champ `align` par entrée
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` — à faire en une session, en même temps que la création de nouvelles pages
- **Bandeau défilant dans la nav fixe** : idée en réserve (dernier scénario joué, date en jeu, prochaine session) — nav masquée sur mobile, structure conservée
- **Factorisation CSS** : voir AUDIT.md — `.site-card` et `.badge` comme classes communes

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose dans le dépôt
4. Claude maintient copie locale si l'environnement le permet
