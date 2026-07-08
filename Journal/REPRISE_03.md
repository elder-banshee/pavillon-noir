# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Claude maintient une copie locale de référence dans `/home/claude/pavillon-noir/` et la met à jour après chaque modification validée.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels — serif historique), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)

---

## Structure des fichiers

```
├── index.html              # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne (non lié dans la nav — contenu en cours)
├── css/
│   ├── style.css           # Styles partagés + variables CSS (NE PAS SUPPRIMER)
│   ├── equipage.css        # Styles page équipage
│   └── chroniques.css      # Styles page chroniques
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── app.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   └── audio.js            # Module audio ambiant (inactif)
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG (ratio ~1.4:1)
├── chroniques/
│   └── covers/             # Illustrations chroniques (4:3, placeholder en-cours.jpg)
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## État actuel des pages

### index.html — Registre des PNJ

Galerie filtrée par tags, recherche plein texte, modal au clic.

**Pavillons** — implémentation complète en session 3 :
- Champ `pavillon` dans `pnj-data.js` : chemin vers fichier SVG/PNG
- Rendu via SVG inline dans `buildCard()` de `app.js` :
  - `clipPath` utilisant le tracé de Claire (`drapeau_OK.svg`) pour découper l'image
  - Contour doré : `fill="#c8973a" stroke="#c8973a" stroke-width="2"`
  - Reflet : `linearGradient` + `<rect>` superposé à l'intérieur du clip
  - IDs uniques par fiche : `flag-clip-${pnj.id}`, `flag-shine-${pnj.id}`
- Dimensions carte : `width: 90px; height: 65px` (`.pnj-flag-svg`)
- Dans la modal : `<img class="modal-pavillon">` sous le portrait, `padding: 2.5rem`
- Tags supprimés de l'aperçu carte (toujours présents dans la modal)

**Structure fiche PNJ (`pnj-data.js`) :**
```javascript
{
  id: "identifiant",
  epingle: true,           // optionnel — section Caribbean's Most Wanted
  visible: false,          // optionnel — masque sans supprimer
  nom: "Nom complet",
  accroche: "Rôle / surnom",
  alias: "Nom alternatif (recherche uniquement)",
  statut: "actif|mort|disparu|inconnu",
  naissance: "dates",
  origine: "Nationalité",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",
  pavillon: "pnj/pavillons/fichier.svg",  // null si absent
  bio: `Texte biographique…`
}
```

**Tags — ordre dans `priority[]` de `app.js` :**
```javascript
'Caraïbes', 'Europe',
'Nassau', 'Trinidad', 'Saint-Domingue', 'Jamaïque', 'Kingston', 'The Pirate Round',
'Flying Gang', 'Équipage du Captain Charles Johnson',
'L\'Île des Ombres', 'Satiété engendre Démesure', 'Le dernier voyage de l\'Hippogriffe',
'La Marianne', 'Les épaves de la Flotte au Trésor',
'Antonio', 'Robert', 'Fanch', 'Edward', 'Dusmatis'
```

### equipage.html — État du bord

Inchangé en session 3. Données Google Sheets, organigramme codé en dur, jauges animées. Voir REPRISE_2.md pour les détails techniques.

### chroniques.html — Journal de campagne

**Modifications majeures session 3 :**

**Rail et navire :**
- Nouveau navire SVG fourni par Claire (graphiste, joueuse de Dusmãtis/La Barrique)
- Couleur `.cls-1 { fill: #c8973a }`, dimensions `width="110" height="99"`
- Navire ajouté avant le SVG de la mer dans le DOM (passe sous les vagues)
- Fondu bas de coque : `mask-image: linear-gradient(to bottom, black 75%, transparent 85%)`
- `scaleX(-1)` supprimé (navire orienté vers la droite nativement)

**Piste de défilement :**
- Fenêtre centrée : `.chrono-piste-wrap { width: 78%; max-width: 1400px }`
- Masque radial : `radial-gradient(ellipse 55% 90% at center, black 35%, transparent 75%)`
- Spacers automatiques : `padding: 3rem calc(50% - 240px) 2rem` sur `.chrono-piste`
- Cartes : `width: 480px`
- Scroll molette capturé sur `wrap` uniquement (pas `piste`)

**Modal chroniques — deux nav distinctes :**
- **Page Accueil** : nav en bas dans `.modal-chrono-body`, sans bouton Accueil, boutons chapitres actifs
- **Pages chapitres** : nav en haut, avec bouton Accueil, bouton chapitre actif grisé + `disabled`
- `position: static` sur `.modal-chrono-nav` — CRITIQUE : annule le `nav { position: fixed }` de `style.css` qui s'appliquait à tous les `<nav>` de la page
- Illustration (`modal-chrono-banner`) à l'intérieur de `.modal-chrono-body`
- Footer supprimé de `chroniques.html`

**Structure chronique (`chroniques-data.js`) — inchangée**

---

## Workflow de collaboration

**Contrainte principale** : le connecteur MCP GitHub est instable en écriture. Méthode :
1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Claude maintient copie locale `/home/claude/pavillon-noir/` à jour

**Avant tout push** : récupérer le SHA avec `get_file_contents` si on utilise l'API GitHub.
**Ne jamais supprimer `css/style.css`** — déjà arrivé, perte totale du style.
**Artefact d'affichage** : Claude.ai convertit parfois `pnj.id` en lien Markdown `[pnj.id](http://pnj.id)`. C'est cosmétique — le code dans GitHub reste correct.

---

## Chantiers ouverts — priorités session 4

### À faire en début de session (nettoyage)

**`app.js`** — dans le bloc SVG pavillon de `buildCard()`, supprimer :
- Le `<filter id="flag-shadow-${pnj.id}">` et son `feDropShadow` (tentative ombre abandonnée)
- Le `<g filter="url(#flag-shadow-${pnj.id})">` et son `</g>` englobant
- L'`<image>` doit rester directement dans le SVG avec son `clip-path`

**`style.css`** — refactoriser le sélecteur générique `nav` en `.site-nav` pour éviter les conflits futurs avec les `<nav>` des modals. Modifier simultanément dans `index.html`, `equipage.html` et `chroniques.html`.

### Chantiers principaux

**Boutons de navigation modal chroniques :**
- Centrage vertical insuffisant sur leur bandeau — ajuster padding `.modal-chrono-nav--bas`
- Augmenter leur taille (padding des boutons `.chrono-nav-btn`)
- Couleur typo : `--gold` pour les boutons actifs/normaux (sauf bouton chapitre actif en cours, qui reste grisé)

**Illustration modal chroniques :**
- Réduire la hauteur : passer de `aspect-ratio: 4/3` à `aspect-ratio: 16/9`
- Permettre de remonter les éléments sous l'illustration (méta, résumé, nav) dans le champ visible

**Lien vers `chroniques.html` dans la navigation :**
- À ajouter dans `index.html` et `equipage.html` quand le contenu sera suffisamment avancé
- `chroniques.html` a déjà le lien dans sa propre nav

### Chantiers secondaires / à venir

- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3 ou 16:9 selon décision ci-dessus)
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : pistes à créer, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/` pour les fiches sans pavillon

---

## Points de vigilance techniques

- **`nav { position: fixed }`** dans `style.css` s'applique à TOUS les éléments `<nav>` — les modals utilisent `position: static` pour contrer ça. À refactoriser.
- **clipPath SVG** : les IDs doivent être uniques par fiche (`flag-clip-${pnj.id}`) sinon les pavillons visibles simultanément partagent le même clip.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM.
- **Cache navigateur** : Ctrl+Shift+R pour forcer le rechargement sans cache après modifications CSS.
- **Google Sheets** : les modifications peuvent mettre quelques minutes à se propager via l'URL CSV.
- **`margin-bottom: 0` et `line-height: 1`** sur `.pnj-origin` — ne pas rétablir sans vérifier l'impact sur l'espacement des cartes PNJ.
