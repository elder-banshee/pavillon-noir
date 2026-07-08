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

## Workflow de développement (mis en place en session 13)

- **Branches Git** : `main` (production, site en ligne) et `dev` (développement)
- **Outils locaux** : VS Code + extension Live Server (Go Live en bas à droite)
- **Prévisualisation mobile** : DevTools Responsive (pas de Live Server sur téléphone pour l'instant)
- **Workflow** : modifier dans VS Code → tester avec Live Server → commit sur `dev` → merger dans `main` → push
- **git pull** : inutile dans le workflow habituel (Ronan est le seul contributeur depuis un seul poste)
- **Raccourci utile** : `Shift+Alt+F` pour reformater/réindenter un fichier JS dans VS Code

---

## Chantiers accomplis en session 13

### Correction bug index.html
`</div>` → `</a>` sur la troisième carte de la grille d'accueil (Journal de bord), qui laissait un lien ouvert englobant tout le reste de la page.

### Système de filtres catégorisés — registre PNJ

Refonte complète du système de filtrage dans `pnj.html`, `pnj.js` et `pnj.css`.

**Catégories de tags** (`TAG_CATEGORIES` dans `pnj.js`) :
- **Localisation** : Europe, Caraïbes, Nassau, Trinidad, Saint-Domingue, Jamaïque, Kingston, The Pirate Round
- **Nationalité** : Britannique, Espagnol, Français, Hollandais, Portugais, Italien, Mosquito
- **Statut** : Actif, Mort, Disparu, Inconnu
- **Faction** : Flying Gang, Conseil de Nassau, Équipage du Captain Charles Johnson, Piagnoni, Trident, Jésuites, Légendes de marins
- **Relations** : Antonio, Dusmatis, Edward, Fanch, Robert, Bertrand, La Barrique, Amedee, William, Jeremy, Luca
- **Scénarios** : L'Île des Ombres, Satiété engendre Démesure, Le dernier voyage de l'Hippogriffe, La Marianne, Les épaves de la Flotte au Trésor, Courses à Trinidad

**Règles d'affichage** : un tag n'apparaît que s'il est porté par au moins une fiche `visible !== false`. Les tags de Nationalité et Statut sont calculés dynamiquement (non stockés dans `p.tags`).

**Extraction de nationalité** (`extraireNationalites()`) :
- Champ optionnel `nationalites: ["Français", "Hollandais"]` dans `pnj-data.js` pour les cas de double nationalité — prioritaire
- Sinon, extraction depuis `p.origine` (partie avant la première parenthèse ou virgule)
- Regroupement Britannique : Anglais, Écossais, Irlandais, Gallois → Britannique
- `NATIONALITE_MAP` normalise les genres (Française → Français, etc.)

**Filtrage étendu** (`getFiltered()`) : les tags étendus incluent `p.tags + extraireNationalites(p) + statut capitalisé`. Logique OU par défaut, ET disponible en options avancées.

**Normalisation** (`normaliser()`) : insensible aux accents et diacritiques via `normalize('NFD')`.

**Tri des PNJ** : par `p.id` (pas `p.nom`) — Ronan arbitre les cas ambigus (particules, titres) en nommant les ids en conséquence.

**Options avancées** (bouton dans `filter-barre-simple`) :
- Sélection multiple (désactivée par défaut) — toggle des tags sans réinitialisation
- Modes OU / ET — grisés jusqu'à activation de la sélection multiple
- Bouton "Tout désélectionner" — toujours visible, grisé si aucun tag actif ; sur desktop dans `filter-barre-simple`, sur mobile en élément séparé avec bordures

**Suggestion inline** dans la barre de recherche : complète en grisé au fil de la frappe, acceptée avec Tab ou →. Priorité : noms PNJ > alias > tags.

**Chips de tags actifs** dans le compteur de résultats :
- Desktop : inline après "X personnages — filtres actifs", avec bouton × pour désélection individuelle
- Mobile : dans `#active-filters-wrap` (hors `section-header`), tap sur le chip pour désélectionner, texte tronqué à 15 caractères avec `tronquer()` (évite les coupures sur espace ou ponctuation)

---

## Points de vigilance techniques — registre PNJ

- **`filter-reset--mobile`** : `display: none` hors media query, `display: block` dans `@media (max-width: 640px)`. Ne pas oublier cette règle globale sinon visible en desktop.
- **`filter-avancee-options--visible`** : géré par `toggle()` dans `majEtatBoutonsAvances()` — se retire quand ni `rechercheAvancee` ni `multiSelection` n'est actif.
- **`:hover` persistant sur mobile** : sur iOS/Android, le state `:hover` persiste après le tap. Corrigé par des règles `:not(.--open)` et `:not(.--on)` avec `!important` dans le media query mobile pour OA et SM.
- **`tagsVisibles`** : calculé avec nationalités et statut inclus dans `buildTagFilters()`, `majEtatFiltres()` et `setupSearch()`. Toujours utiliser le calcul étendu (3 lignes) et non le simple `p.tags.forEach`.
- **Champ `nationalites`** dans `pnj-data.js` : optionnel, à renseigner pour les PNJ à double nationalité ou nationalité non extractible depuis `origine`. Format : `nationalites: ["Français", "Hollandais"]`.
- **`active-filters-wrap`** : hors `section-header` dans `pnj.html`, après la div `.section-header`. `display: none` par défaut, `display: flex` en mobile.
- **`section-count-tags`** : `display: none` en mobile (les chips sont dans `active-filters-wrap`).
- **Indentation** : `Shift+Alt+F` dans VS Code pour reformater. ESLint peut être installé pour détecter les erreurs en temps réel.

---

## Chantiers ouverts — registre PNJ

- **Arborescence à trois niveaux** : Catégorie → Sous-catégorie → Tags (ex: Caraïbes > Nassau, Trinité... ; Britannique > Anglais, Écossais...) — à envisager si les joueurs réclament un système plus précis
- **`pnj-data.js`** : Ronan doit renseigner le champ `nationalites` pour les PNJ à double nationalité (ex: Laurens de Graaf), et compléter les informations manquantes
- **Renommage résiduel** dans JS/CSS : `filter-avancee-panel` → `filter-avancee`, `filter-panneau` → `filter-tags-panneau` (cosmétique, non urgent)
- **`toggleTag()`** : supprimée ✓
- **Persistance des filtres** via `sessionStorage` — à envisager si les joueurs trouvent pénible de refiltrer après navigation
- **`majEtatFiltres()` et `majEtatBoutonsAvances()`** : légère redondance à factoriser un jour

---

## Chantiers ouverts — autres pages (inchangés depuis session 12)

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
- **Icône phare pour le bouton retour** : idée en réserve

---

## Points de vigilance techniques — autres pages (inchangés depuis session 12)

- **`mesurerNav()` padding** : `'0.75rem 1.25rem'` mobile / `'1rem 2rem'` desktop
- **Titre cliquable mobile** : `onclick="if(window.innerWidth<=700)goToPage(null)"` sur `.modal-chrono-num` et `.modal-chrono-titre`
- **Conclusions de rapport** : baliser en blockquote `>` pour le style brume
- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans
- **`marked.js`** : chargé depuis cdnjs dans `chroniques.html` avant `chroniques.js`
- **`overflow-x: hidden` sur `.modal--chronique`** : intentionnel
- **GitHub Pages** : latence de propagation parfois significative. Toujours vérifier avec Ctrl+Shift+R

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **VS Code**
3. Prévisualisation avec **Live Server** (Go Live en bas à droite de VS Code)
4. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose
5. Commit sur `dev` dans GitHub Desktop, puis merge dans `main` quand validé
6. Pour un audit : Ronan uploade les fichiers directement dans le chat (GitHub peut servir des versions en cache)
