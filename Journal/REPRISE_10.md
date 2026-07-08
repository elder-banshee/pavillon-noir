# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files`. Claude maintient une copie locale de référence si l'environnement le permet.

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

- `index.html` → `style.css` uniquement (+ styles inline dans `<style>`)
- `pnj.html` → `style.css` + `pnj.css`
- `equipage.html` → `style.css` + `equipage.css`
- `chroniques.html` → `style.css` + `chroniques.css`

### Chargement JS par page

Toutes les pages chargent `audio.js` + `mobile-nav.js` en fin de `<body>`.
`index.html` : `mobile-nav.js` est chargé mais s'auto-désactive (test sur pathname).

---

## Chantiers accomplis en session 10

### Remplacement des icônes Unicode sur `index.html`

Les icônes de la grille d'accueil (☽, ⚓, ✦) ont été remplacées par trois SVG inline fournis par Ronan (pirate, navire, encrier). Les SVG sont insérés directement dans les `<div class="accueil-carte-icone">`, sans délimiteur autour.

**Règle CSS ajoutée** dans le `<style>` inline de `index.html` pour centraliser la taille :
```css
.accueil-carte-icone svg {
  height: 64px;
  width: auto;
}
```
Seul `height` est défini sur les balises `<svg>` — `width` est calculé automatiquement par le navigateur selon le ratio de chaque viewBox. Le navire (format paysage) est donc naturellement plus large que le pirate et l'encrier (format portrait).

**Note** : les SVG ont leur couleur or codée en dur (`fill: #c8973a`), ils n'héritent pas du `color: var(--gold)` du conteneur.

### Crédits des illustrations dans la modal chroniques (`chroniques-data.js` + `chroniques.js` + `chroniques.css`)

Système de crédit porté depuis les modals PNJ, simplifié car un seul emplacement possible (sous le banner).

**Structure du champ `source` dans `chroniques-data.js`** : objet simple (pas un tableau), `url` optionnel.
```js
source: { credit: 'Auteur, année — Institution', url: 'https://...' },
```
Actuellement renseigné uniquement pour `sed` (Satiété engendre Démesure) :
```js
source: { credit: 'D\'après Floris van Schooten, 1626 — Musée du Louvre', url: 'https://collections.louvre.fr/ark:/53355/cl010064656' },
```

**Fonction `sourceCredit(c)` ajoutée en fin de `chroniques.js`** (après `formatNombre()`) :
```js
function sourceCredit(c) {
  if (!c.source) return '';
  return `<div class="modal-source">
    ${c.source.credit}
    ${c.source.url ? `<a class="modal-source-link" href="${c.source.url}" target="_blank" rel="noopener" aria-label="Voir la source">↗</a>` : ''}
  </div>`;
}
```

**Appel dans `renderModal()`**, page d'accueil de la modal, après `bannerHtml` :
```js
${bannerHtml}
${sourceCredit(c)}
${metaHtml}
```

**Règles CSS ajoutées dans `chroniques.css`** (avant le bloc `@media`) :
```css
.modal-source {
  padding: 0.2rem 2rem 1rem;
  font-family: 'Crimson Text', serif;
  font-size: 0.8rem;
  letter-spacing: 0;
  color: var(--parchment2);
  line-height: 1.4;
  opacity: 0.8;
  margin-top: -1.2rem;
}

.modal-source-link {
  display: inline-block;
  margin-left: 0.3rem;
  color: var(--mist);
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.2s;
  vertical-align: middle;
}

.modal-source-link:hover { color: var(--gold); }
```

Le `margin-top: -1.2rem` remonte la légende en mordant sur le `margin-bottom: 1.5rem` du banner, sans affecter les chroniques sans source.

### Correction du lien mort sur Ruggiero (`pnj.js`)

La fonction `sourceCredit()` de `pnj.js` générait un lien `href="undefined"` pour les entrées sans `url` (cas de Ruggiero). Correction : ajout d'un ternaire identique à celui de `chroniques.js`.

**Dans `pnj.js`**, remplacer dans `sourceCredit()` :
```js
<a class="modal-source-link" href="${s.url}" target="_blank" rel="noopener" aria-label="Voir la source">↗</a>
```
par :
```js
${s.url ? `<a class="modal-source-link" href="${s.url}" target="_blank" rel="noopener" aria-label="Voir la source">↗</a>` : ''}
```

### Mise à jour du README.md

README entièrement réécrit — l'ancien décrivait l'état initial du projet (`app.js`, deux pages, `index.html` comme registre PNJ). Le nouveau reflète la structure actuelle : 4 pages, tous les fichiers JS/CSS, format des entrées PNJ enrichi (pavillon, source), section chroniques complète. "Feuille 3" remplacé par "Lien Claude" (nom réel de la feuille dans le classeur Google Sheets).

---

## Correctifs prioritaires identifiés (reports sessions précédentes, toujours ouverts)

1. **`mobile-nav.js`** — ajouter `{ label: 'Chroniques', href: 'chroniques.html' }` dans `NAV_LINKS` (à faire quand la page sera rendue visible)
2. **Double `class="active"`** — dans `equipage.html`, `chroniques.html` et `pnj.html`, le `<li hidden>` du lien Chroniques porte `class="active"` à tort ; retirer cet attribut
3. **Référence résiduelle `.chrono-lire`** dans le mousedown de la piste (`chroniques.js`) — inoffensive mais obsolète depuis la suppression du bouton

---

## Chantiers ouverts

- **Icônes SVG dans les hero** : reprendre l'icône de chaque carte d'accueil dans le `.hero-divider-icon` de la page correspondante, en remplacement du ☠ Unicode. Dimensions à définir (environ 32–40px). L'icône du registre (pirate) est jugée peu lisible à petite taille — à retravailler avant d'implémenter ce chantier
- **☠ du hero** : si on ne l'intègre pas dans le chantier ci-dessus, envisager un SVG original (à confier à Claire) pour garantir un rendu cross-plateforme cohérent
- **Bordures du `.hero-divider`** : disparaissent à certains niveaux de zoom (< 80%) sur `index.html` — comportement cosmétique lié au `max-width: 120px` des pseudo-éléments, non prioritaire
- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente à afficher à la place du pavillon supprimé (ou laisser la carte se terminer proprement sur `.pnj-body`)
- **Couleur de texte secondaire** : envisager une nouvelle variable CSS entre `--mist` et `--parchment2` pour les éléments discrets mais lisibles
- **Crédits — titre cliquable avec infobulle** : afficher le titre de l'œuvre plutôt que les crédits en clair, information complète dans une infobulle au survol/tap
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte — idée en réserve
- **Lien Chroniques dans la nav** : retirer `hidden` sur `<li hidden>` dans les trois pages quand le contenu sera prêt — appliquer les correctifs prioritaires au préalable
- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3 minimum, zones calmes haut/bas pour recadrage 16:9) et régler le champ `align` par entrée
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` — à faire en une session, en même temps que la création de nouvelles pages
- **Bandeau défilant dans la nav fixe** : idée en réserve (dernier scénario joué, date en jeu, prochaine session)
- **Factorisation CSS** : `.site-card` et `.badge` comme classes communes

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans. Sans lui, toutes les pages perdent leur style.
- **Icônes SVG `index.html`** : couleur or codée en dur dans les SVG (`fill: #c8973a`) — ils n'héritent pas de `color` ou `opacity` du conteneur CSS.
- **`width`/`height` sur les SVG** : ne définir que `height`, laisser `width: auto` — le navigateur respecte le ratio de la viewBox. Ne pas modifier la viewBox elle-même.
- **Navire — ne pas mettre `height` explicite sur `.chrono-navire`** : perturbe le positionnement vertical (`bottom: 42px`).
- **Navire — layer composite** : l'animation CSS sur un élément portant aussi `filter` et `mask-image` produit des artefacts de rendu. Toujours isoler l'animation sur un wrapper enfant (`.chrono-navire-inner`).
- **Marges négatives CSS** : valeurs valides et utiles pour compenser des marges ou paddings adjacents sans toucher aux éléments voisins. Utilisé pour `.modal-source { margin-top: -1.2rem }`.
- **Ternaire JS pour les propriétés optionnelles** : toujours tester `obj.prop ? ... : ''` avant d'insérer une propriété dans du HTML généré — une propriété absente vaut `undefined` et produit du HTML invalide silencieusement.
- **`gid` dans l'URL CSV Google Sheets** : identifiant numérique de la feuille, indépendant de son nom. Renommer la feuille ne casse pas l'URL. Seul `equipage.js` contient cette URL.
- **Nav mobile et `position: fixed`** : l'infobulle `.crew-tooltip` créait un contexte qui décalait les éléments `fixed`. Résolu. À garder en tête si d'autres éléments `fixed` sont ajoutés.
- **SVG inline dans JS** : toujours utiliser des backticks `` ` `` pour les chaînes multilignes.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM — uniquement pour les barres de composition (`.crew-bar-reveal`).
- **Cache navigateur** : Ctrl+Shift+R pour forcer le rechargement sans cache.
- **Google Sheets** : les modifications peuvent mettre quelques minutes à se propager via l'URL CSV.
- **`overflow-x: hidden`** : déjà présent sur `body` dans `style.css` — ne pas supprimer.
- **`chroniques.html` — modal** : `.modal-overlay` est partagé avec `pnj.html` via `style.css`, mais `.modal--chronique` surcharge `.modal` — bien vérifier la cascade si on touche aux styles de base.
- **Opérateur `?? 50`** dans `chroniques.js` : coalescence nulle — si `c.align` est absent ou `null`, la valeur par défaut est 50.

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose dans le dépôt
4. Claude maintient copie locale si l'environnement le permet
