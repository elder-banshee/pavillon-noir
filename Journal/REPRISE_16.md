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

## Chantiers accomplis en session 15

### Page carte — corrections et améliorations

**Restructuration `carte-corps`** : `carte-credit` extrait de `carte-plus` et placé dans un nouveau conteneur `carte-corps` (`display: flex; flex-direction: column`). Corrige le chevauchement du panneau latéral sur les crédits quand le texte est long. `carte-credit` garde son alignement droit sous `carte-wrap` via `max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box`.

**Masque de fondu sur le panneau latéral** : `mask-image` sur `.carte-panneau-inner` pour estomper le texte aux bords du conteneur lors du défilement. Valeurs retenues :
```css
mask-image: linear-gradient(
  to bottom,
  transparent 0,
  transparent 0.5rem,
  black 2.5rem,
  black calc(100% - 2.5rem),
  transparent calc(100% - 0.5rem)
);
```
Note : `black` = zone visible, `transparent` = zone masquée. `-webkit-mask-image` en doublon pour compatibilité Safari.

**Désactivation du zoom au double-clic** : `doubleClickZoom: false` dans les options de `L.map()`.

**Fermeture du panneau au clic sur la carte** : `carte.on('click', () => { fermerPopup(); fermerPanneau(); })`.

**Popup non bloquante** : suppression du `pointer-events: all` sur l'overlay — seule la popup elle-même capte les clics, la carte reste entièrement interactive derrière. Fermeture via bouton ✕ ou clic sur la carte.

**Toggle des pins** : clic sur la pin active ferme sa popup ; clic sur une autre pin substitue directement son contenu sans double clic.

**Coexistence popup/panneau** : ouvrir un volet de juridiction ne ferme plus la popup de pin, et vice-versa.

**Surbrillance des pins au survol** : agrandissement (`scale(1.3) translateY(-4px)`) + changement de couleur (`fill: var(--gold-light)`) sur `path:first-child`. Ombre dorée jugée excessive, non retenue.

**Infobulles sur les pins** : `bindTooltip` avec classe `carte-tooltip`, même style que les zones (Cinzel, or, fond encre, border dorée, `border-radius: 0`).

**Opacité des popups de pin** : fond semi-transparent `rgba(20,16,9,0.96)` au lieu du noir plein.

---

## Architecture technique — page carte

### Structure HTML

```html
<main>
  <div class="carte-curseur">...</div>

  <div class="carte-corps">              ← flex column, pas de position: relative
    <div class="carte-plus">            ← position: relative, width: 100%
      <div id="carte-wrap">            ← position: relative, max-width: 1400px, margin: 0 auto
        <div id="carte"></div>         ← Leaflet, aspect-ratio: 8500/5320
      </div>
      <aside class="carte-panneau">    ← position: absolute, top:0, right:0, height:100%
        ...
      </aside>
    </div>

    <div class="carte-credit">         ← max-width: 1400px, margin: 0 auto, text-align: right
      ...
    </div>
  </div>
</main>
```

### `carte-data.js` — structure de données

- `CARTE_ANNEE_REFERENCE` : année courante de jeu (à mettre à jour après chaque session)
- `CARTE_IMAGE` : src, width, height de la carte
- `PUISSANCES` : palette couleurs et blasons par puissance coloniale
- `JURIDICTIONS` : tableau d'objets avec champs temporels (`puissance`, `gouverneur`, `contexte`)
- `CARTE_PINS` : marqueurs de scénarios, simples ou groupés
- `resoudre(champ, annee)` : retourne la valeur dont la clé est la plus grande ≤ annee

**Champs temporels** : clés = années numériques. Exemple :
```javascript
gouverneur: {
  1712: { nom: 'Conseil de Nassau', pnj_id: 'conseil-nassau', titre: 'Instance dirigeante' },
  1718: { nom: 'Woodes Rogers', pnj_id: null, titre: 'Gouverneur royal' },
}
```

**Pins groupées** (plusieurs chroniques au même endroit) :
```javascript
{
  id: 'pin-vero-beach',
  label: 'Site des épaves...',
  coords: [3969, 1296],
  groupe: [
    { chronique_id: 'hippogriffe', label: '...', date: '...', extrait: '...' },
    { chronique_id: 'epaves',      label: '...', date: '...', extrait: '...' },
  ],
}
```

### Coordonnées

Toujours en pixels à l'échelle 8500 × 5320. Facteur de conversion depuis Photoshop à résolution native JP2 (24408 × 15276) : × 0,348. **Recommandation** : travailler directement à 8500 × 5320 dans Photoshop pour éviter la conversion.

Conversion pixel → Leaflet : `pixelToLatLng(x, y)` inverse l'axe Y (`height - y`).

---

## Chantiers ouverts — page carte

### Prioritaire : zones géographiques

Travail de décalquage des juridictions dans Photoshop (8500 × 5320 px) :
- Outil baguette magique ou plume pour tracer les contours
- Export SVG depuis Photoshop → Illustrator/Inkscape
- Recalage des coordonnées dans `carte-data.js`
- 25 à 40 juridictions à documenter progressivement
- Juridiction `test-scroll` (Cuba lorem ipsum) à remplacer par les données réelles

### Filtres thématiques (chantier futur)

Idée validée : afficher les zones avec différents modes de coloration selon un sélecteur (puissance coloniale, densité démographique, ratio blancs/esclaves, etc.).

**Architecture envisagée** :
- Sélecteur de mode au-dessus de la carte, à côté du curseur temporel
- Chaque mode correspond à une fonction de calcul de couleur appliquée à chaque zone
- Les données nécessaires (population, superficie, etc.) seraient ajoutées dans `carte-data.js`

**Calcul de superficie** : la formule du lacet de Shoelace permet de calculer l'aire d'un polygone depuis ses sommets pixel, convertible en km² via l'échelle graphique de la carte. Combinée à `population_approx` (à passer en valeur numérique), donne une densité démographique relative suffisante pour un dégradé comparatif.

### Autres chantiers carte

- **Deep-link `pnj.html?id=xxx`** — `pnj.js` n'intercepte pas encore ce paramètre pour ouvrir automatiquement la bonne fiche au clic sur un gouverneur dans le panneau
- **Blasons** — dossier `medias/blasons/` à créer, fichiers SVG à déposer (gb, es, fr, nl, nassau)
- **Lien "Carte" dans la nav** — à ajouter dans `index.html`, `pnj.html`, `equipage.html`, `chroniques.html` (déjà présent dans `carte.html`)
- **Mobile** — page carte non optimisée pour mobile (panneau masqué sous 900px, reste à réfléchir)

---

## Points de vigilance techniques — page carte

- **`carte-corps` sans `position: relative`** : essentiel pour ne pas créer de contexte d'empilement qui briderait le `z-index: 1000` du panneau
- **`pointer-events` sur l'overlay** : l'overlay `.carte-popup-overlay` reste toujours en `pointer-events: none` — c'est `.carte-popup--visible` qui active les clics sur la popup seule
- **`stopPropagation`** sur les clics de zones et de pins : empêche la remontée vers le clic carte qui fermerait popup et panneau
- **`setTimeout` dans `initCarte`** : nécessaire pour laisser le DOM se stabiliser avant `fitBounds`. Ne pas supprimer
- **`carte-data.js` doit être chargé avant `pnj-data.js` et `chroniques-data.js`** dans `carte.html`
- **`doubleClickZoom: false`** dans les options de `L.map()` — désactivé pour éviter les zooms accidentels
- **`-webkit-mask-image`** en doublon de `mask-image` — requis pour Safari

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
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
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

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **VS Code**
3. Prévisualisation avec **Live Server** (Go Live en bas à droite de VS Code)
4. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose
5. Commit sur `dev` dans GitHub Desktop, puis merge dans `main` quand validé
6. Pour un audit : Ronan uploade les fichiers directement dans le chat (GitHub peut servir des versions en cache)

---

## Note cartographique — Échelle de la carte Jaillot 1708

**Unité de mesure identifiée : English land league = 4,828 032 km (3 milles impériaux)**

Mentionnée sur la carte comme "100 lieues anglaises et françaises = 840 px" à l'échelle 8500 × 5320 px.

Cette lieue était utilisée en Bretagne avant la Révolution française (Wikipedia FR). Sa présence sur une carte franco-hollandaise de 1708 est cohérente avec l'usage cartographique de l'époque.

**Validation sur Cuba (contour principal, zones-data.js) :**
- Aire Shoelace : 320 103 px²
- Superficie calculée : 105 748 km²
- Superficie réelle : 109 884 km²
- Écart : −3,76% — dans la marge d'erreur d'un tracé manuel

**Facteur de conversion :**
- 1 px = (100 / 840) × 4,828 032 = 0,57477 km
- 1 px² = 0,33036 km²

À vérifier sur d'autres territoires bien cartographiés (Jamaïque, Hispaniola) pour confirmer la constante.

**Usage pour l'overlay densité :**
Les superficies en px² bruts (Shoelace) sont utilisées comme base comparative relative — pas de conversion en km² affichée, cohérence garantie entre juridictions.

**Validation complémentaire — Jamaïque et Porto Rico + Vieques :**

| Île | Calculée | Réelle | Écart |
|---|---|---|---|
| Cuba | 105 748 km² | 109 884 km² | −3,76% |
| Jamaïque | 13 594 km² | 10 990 km² | +23,7% |
| Porto Rico + Vieques | 8 072 km² | 9 624 km² | −16,1% |

La Jaillot de 1708 n'est pas une projection uniforme : la Jamaïque est surestimée, Porto Rico sous-estimée. Cuba est exceptionnellement bien cartographiée pour l'époque.

**Conclusion définitive :** les superficies en px² bruts (Shoelace) sont la seule base cohérente pour l'overlay densité. Toute conversion en km² introduirait des biais géographiques systématiques propres aux déformations de la Jaillot. On travaille dans le monde de la carte, pas dans le monde réel.
