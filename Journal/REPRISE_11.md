# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files`. Claude maintient une copie locale de référence si l'environnement le permet.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`), brume claire (`--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
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
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation, fetch rapports)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── audio.js            # Module audio ambiant (inactif)
│   └── mobile-nav.js       # Navigation mobile flottante
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   ├── covers/             # Illustrations chroniques (+ en_cours.jpg pour placeholder)
│   └── rapports/           # Textes des chroniques en Markdown (un fichier par scénario)
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## Chantiers accomplis en session 11

### Système de rapports Markdown pour les chroniques

Implémentation d'un système de chargement dynamique des textes de chroniques depuis des fichiers `.md` stockés dans `chroniques/rapports/`.

**Architecture** :
- `chroniques-data.js` : le champ `chapitres` est remplacé par `rapport: "chroniques/rapports/nom-fichier.md"` pour les chroniques rédigées. Les chroniques sans rapport conservent `chapitres: {}` (rétrocompatible).
- `chroniques.js` : fonction `chargerRapport()` fetch le fichier `.md` à l'ouverture de la modal, le parse via `parseRapport()`, et met le résultat en cache (`rapportCache`).
- `chroniques.html` : ajout de `marked.js` (cdnjs) pour la conversion Markdown → HTML.

**Convention des fichiers `.md`** :
- Texte libre avant le premier `#` = préambule, rattaché au chapitre I (affiché avant son titre, dans un style distinct)
- `#` = marqueur de chapitre (découpage)
- `##` = sous-titre interne au chapitre
- Pas de `#` ou `##` avant le premier chapitre — entêtes éditoriaux en italique simple

**Structure de `parseRapport()`** :
- Chaque chapitre produit un objet `{ titre, roman, html, preambule, corps }`
- `titre` : texte brut du `#` (ex. `"I. Naufragés"`)
- `roman` : chiffre romain généré par `toRoman()` (ex. `"I"`)
- `preambule` : HTML du préambule (chapitre I uniquement), affiché avant le titre
- `corps` : HTML du corps seul, sans préambule

**Rendu dans la modal** :
- Page d'accueil : illustration 16:9, métadonnées, extrait, sommaire + boutons de navigation
- Page chapitre : préambule (si présent) → titre du chapitre → corps
- Boutons de nav : chiffres romains seuls (`I`, `II`…), version courte activée par classe `nav--compacte`

**Détection de débordement / version compacte** :
- `flex-wrap: nowrap` + `overflow: hidden` sur `.modal-chrono-nav`
- `detecterDebordementNav()` appelée via `setTimeout(..., 50)` après chaque `renderModal`
- En mobile (`window.innerWidth <= 700`) : `nav--compacte` forcé inconditionnellement
- En desktop : `nav--compacte` si `scrollWidth > clientWidth`
- CSS : `.nav--compacte .chrono-nav-long { display: none }` / `.nav--compacte .chrono-nav-court { display: inline }`
- Bouton retour : `↩` en version courte

**Note** : la détection en mobile présente un comportement instable sur la nav du bas (page accueil). Ce code est voué à être remplacé par la refonte de la nav en pagination (voir chantiers ouverts).

### Améliorations mobile de la modal chronique

- `.modal-overlay` : `align-items: flex-start` (modal ancrée en haut)
- `.modal-chrono-meta` : grille `repeat(3, minmax(min-content, max-content))` — trois colonnes dont la largeur s'adapte au contenu
- Meta-items réduits : `padding: 0.3rem 0.5rem`, `font-size` réduite
- `.modal-source` : padding latéral réduit à `1rem` en mobile, lien `↗` en `display: inline`
- **Sommaire** : label Cinzel or au-dessus des boutons de chapitre (page accueil uniquement, mobile uniquement), bordure pleine largeur via marges négatives compensant le padding de la nav

### Nouvelle variable CSS `--mist-light`

`--mist-light: #8fa5b4` dans `style.css` — variante plus claire de `--mist`, appliquée aux labels Cinzel peu lisibles.

### Page Chroniques rendue visible

Lien `hidden` retiré, carte accueil activée, `mobile-nav.js` mis à jour.

### Premier rapport rédigé

`chroniques/rapports/ile-des-ombres.md` — 6 chapitres, ~5000 mots, style épistolaire.

---

## Chantiers ouverts

### Prioritaire — Refonte de la nav chapitres en pagination

La nav actuelle (tous les chapitres sur une ligne) ne tient pas au-delà de 6–7 chapitres, et la détection de débordement est instable en mobile. La refonte prévue :

**Comportement cible** :
- Toujours visible : bouton retour (icône phare — voir note) + jusqu'à 4 chapitres + flèches précédent/suivant si nécessaire
- Les flèches n'apparaissent que s'il y a plus de 4 chapitres
- Par défaut : chapitres I–IV affichés ; les flèches font défiler par groupe de 4 (I–IV, V–VIII, etc.)
- Le chapitre actif est toujours visible dans le groupe affiché

**Icône du bouton retour** : un **phare** (sémantiquement juste — point de repère, retour au port, cohérent avec la charte maritime). SVG à fournir ou à demander à Claire. Remplace le `↩` actuel.

**Navigation précédent/suivant en bas de chapitre** : ajouter en fin de corps de texte, en Cinzel petit corps, alignés à gauche et à droite : `← Chapitre précédent` / `Chapitre suivant →`. Liens discrets, distincts du corps de texte Crimson Text.

### Autres chantiers ouverts

- **Rapports des chroniques II à VI** : rédiger et déposer dans `chroniques/rapports/`
- **Icônes SVG dans les hero** : remplacer le ☠ Unicode dans `.hero-divider-icon`
- **Bordures du `.hero-divider`** : disparaissent à certains niveaux de zoom (< 80%) — cosmétique
- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente
- **Crédits — titre cliquable avec infobulle** : afficher le titre de l'œuvre, info complète au survol
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/`
- **Bandeau défilant dans la nav fixe** : idée en réserve
- **Factorisation CSS** : `.site-card` et `.badge` comme classes communes

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans.
- **`marked.js`** : chargé depuis cdnjs dans `chroniques.html` avant `chroniques.js`. Sans lui, fallback texte brut.
- **Cache des rapports** : `rapportCache` est en mémoire — un rechargement de page relit le fichier `.md`.
- **`flex-wrap: nowrap` sur `.modal-chrono-nav`** : intentionnel pour la détection de débordement desktop. La nav du bas (`.modal-chrono-nav--bas`) a `flex-wrap: wrap` en mobile pour permettre au Sommaire de passer à la ligne, puis `flex-wrap: nowrap` via `.nav--compacte.modal-chrono-nav--bas`.
- **Marges négatives du Sommaire** : `.modal-chrono-sommaire` compense le padding de la nav (`padding: 0.75rem 1.25rem` en mobile = `12px 20px` en Computed) via `margin: -0.75rem -1.25rem` et `width: calc(100% + 2.5rem)`.
- **GitHub Pages** : latence de propagation parfois significative. Toujours vérifier avec Ctrl+Shift+R et l'onglet Network de DevTools.
- **Convention fichiers `.md`** : pas de `#` ou `##` avant le premier chapitre numéroté. Entêtes éditoriaux en italique Markdown simple.
- **`scrollbar-gutter: stable`** : réserve ~15px pour la scrollbar en permanence sur `.modal--chronique`.
- **`setTimeout(..., 50)`** : utilisé pour la détection de débordement nav — laisser le layout se stabiliser avant mesure.
- **`grille minmax(min-content, max-content)`** : colonnes de largeur inégale (indexées sur leur propre contenu), comportement voulu et accepté pour les meta-items.

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose
4. Claude maintient copie locale si l'environnement le permet
