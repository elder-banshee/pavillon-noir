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

- `index.html` → `style.css` uniquement
- `pnj.html` → `style.css` + `pnj.css`
- `equipage.html` → `style.css` + `equipage.css`
- `chroniques.html` → `style.css` + `chroniques.css`

### Chargement JS par page

Toutes les pages chargent `audio.js` + `mobile-nav.js` en fin de `<body>`.
`index.html` : `mobile-nav.js` est chargé mais s'auto-désactive (test sur pathname).

---

## Chantiers accomplis en session 9

### Correction du rendu du navire (`chroniques.js` + `chroniques.css`)

**Problème** : le navire avait un aspect différent selon son état — plus terne et moins net au repos (classe `.flottant` active) qu'en déplacement. Cause identifiée : l'animation `flottaison` (translateY) forçait la création d'un layer composite qui interagissait mal avec le `filter: drop-shadow` et le `mask-image` présents sur le même élément, produisant un artefact de rendu.

**Solution** : isolation de l'animation sur un élément wrapper `chrono-navire-inner`, séparant les responsabilités :
- `.chrono-navire` (outer) : positionnement (`position: absolute`, `bottom`, `left`, `width: 110px`), `transform: translateX(-50%)`, `filter`, `mask-image`, `pointer-events`, `cursor`, `transition`
- `.chrono-navire-inner` (inner) : porte uniquement la classe `flottant` et l'animation `translateY`
- `@keyframes flottaison` : réduit à `translateY(0)` / `translateY(-3px)` sans le `translateX`

**Dans `chroniques.js`**, `buildRail()` crée désormais :
```js
const navire = document.createElement('div');
navire.className = 'chrono-navire';
navire.id = 'chrono-navire';
navire.style.left = XMIN + 'px';

const navireInner = document.createElement('div');
navireInner.className = 'chrono-navire-inner flottant';
navireInner.innerHTML = NAVIRE_SVG;
navire.appendChild(navireInner);
railEl.appendChild(navire);
```

Les ajouts/retraits de classe `.flottant` dans `setupScroll()` ciblent désormais `navire.querySelector('.chrono-navire-inner')` (trois occurrences).

**Dans `chroniques.css`**, état final des règles navire :
```css
.chrono-navire {
  position: absolute;
  bottom: 42px;
  width: 110px;
  transform: translateX(-50%);
  pointer-events: all;
  cursor: grab;
  filter: drop-shadow(0 2px 8px rgba(200,151,58,0.3));
  transition: left 0.05s linear;
  mask-image: linear-gradient(to bottom, black 75%, transparent 85%);
  -webkit-mask-image: linear-gradient(to bottom, black 75%, transparent 85%);
}
.chrono-navire:active { cursor: grabbing; }
.chrono-navire.dragging { transition: none; }

.chrono-navire-inner.flottant {
  animation: flottaison 3s ease-in-out infinite;
}

@keyframes flottaison {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}
```

**Note technique** : ne pas remettre `height` explicite sur `.chrono-navire` — cela décalait le navire verticalement en perturbant le `bottom: 42px`.

### Suppression du pavillon dans les cartes PNJ (`pnj.js` + `pnj.css`)

Les pavillons SVG héraldiques (couleurs saturées, aspect artificiel) s'intégraient mal dans l'esthétique générale. Décision : les retirer de la vue grille, les conserver uniquement dans la modal.

**Dans `pnj.js`**, dans `buildCard()` : suppression du bloc conditionnel `${pnj.pavillon ? ... : ''}` qui injectait le SVG inline avec clipPath, reflet et contour doré.

**Dans `pnj.css`** : suppression des règles `.pnj-flag-wrap`, `.pnj-flag-svg` et `.pnj-card:hover .pnj-flag-svg`.

**Conservé intact** : `modal-pavillon` dans `openModal()` (balise `<img>`) et sa règle CSS `.modal-pavillon` — le pavillon reste visible dans la modal sous le portrait.

**Chantier ouvert** : l'espace libéré en bas des cartes (anciennement occupé par le pavillon) n'a pas encore été affecté à une nouvelle information — à réfléchir en session 10.

---

## Correctifs prioritaires identifiés (reports sessions précédentes, toujours ouverts)

1. **`mobile-nav.js`** — ajouter `{ label: 'Chroniques', href: 'chroniques.html' }` dans `NAV_LINKS` (à faire quand la page sera rendue visible)
2. **Double `class="active"`** — dans `equipage.html`, `chroniques.html` et `pnj.html`, le `<li hidden>` du lien Chroniques porte `class="active"` à tort ; retirer cet attribut
3. **`README.md`** — mettre à jour (structure de fichiers obsolète, `app.js` → `pnj.js`, description de `index.html` incorrecte)
4. **Référence résiduelle `.chrono-lire`** dans le mousedown de la piste (`chroniques.js`) — inoffensive mais obsolète depuis la suppression du bouton

---

## Chantiers ouverts

- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente à afficher à la place du pavillon supprimé (ou laisser la carte se terminer proprement sur `.pnj-body`)
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte. Idée en réserve : afficher une info contextuelle ou déclencher un effet visuel
- **Lien Chroniques dans la nav** : retirer `hidden` sur `<li hidden>` dans les trois pages quand le contenu sera prêt — appliquer les correctifs ci-dessus au préalable
- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3 minimum, conçues avec zones calmes haut/bas pour le recadrage 16:9 de la modal) et régler le champ `align` par entrée
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` — à faire en une session, en même temps que la création de nouvelles pages
- **Bandeau défilant dans la nav fixe** : idée en réserve (dernier scénario joué, date en jeu, prochaine session)
- **Factorisation CSS** : voir AUDIT.md — `.site-card` et `.badge` comme classes communes

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans. Sans lui, toutes les pages perdent leur style.
- **Navire — ne pas mettre `height` explicite sur `.chrono-navire`** : perturbe le positionnement vertical (`bottom: 42px`). La largeur `width: 110px` suffit pour que le `mask-image` s'applique correctement.
- **Navire — layer composite** : l'animation CSS sur un élément portant aussi `filter` et `mask-image` produit des artefacts de rendu (flou, perte de netteté). Toujours isoler l'animation sur un wrapper enfant.
- **Nav mobile et `position: fixed`** : l'infobulle `.crew-tooltip` (459px, `position: absolute`) créait un contexte qui décalait les éléments `fixed` sur `equipage.html`. Résolu. À garder en tête si d'autres éléments `fixed` sont ajoutés.
- **SVG inline dans JS** : toujours utiliser des backticks `` ` `` pour les chaînes multilignes.
- **Styles natifs des `<button>`** : neutraliser avec `appearance: none`, `border: none`, `background: transparent`, `outline: none`, `padding: 0`.
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
