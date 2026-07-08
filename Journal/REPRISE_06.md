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
│   └── mobile-nav.js       # Navigation mobile flottante (nouveau — session 6)
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   └── covers/             # Illustrations chroniques (placeholder en-cours.jpg)
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

## Chantiers accomplis en session 6

### Corrections générales

- **Lien "Pavillon Noir"** dans la nav : corrigé de `href="pnj.html"` vers `href="index.html"` sur `pnj.html`, `equipage.html`, `chroniques.html`
- **Nav fixe masquée sur mobile** : dans `style.css`, le bloc responsive passe de `.nav-links { display: none }` à `.site-nav { display: none }` — la nav reste dans le DOM mais invisible, réservée à une future exploitation (bandeau défilant envisagé : dernier scénario joué, date en jeu, prochaine session)

### Navigation mobile flottante (`js/mobile-nav.js`)

Nouveau fichier. Comportement :
- Inactif sur desktop (`window.innerWidth > 640`) et sur `index.html`
- Invisible au chargement, apparaît après `SCROLL_INITIAL = 200px` de scroll depuis le haut
- Disparaît après `HIDE_DELAY = 3000ms` d'inactivité (timer suspendu si panneau ouvert)
- Réapparaît après `SCROLL_DELTA = 150px` de déplacement cumulé depuis la dernière apparition
- Bouton 52×52px, bas droite, sans fond ni bordure (styles natifs neutralisés)
- Icônes : deux SVG coffre (fermé/ouvert) définis comme template literals dans les constantes `ICON_CLOSED` et `ICON_OPEN` en haut du fichier — **utiliser des backticks** `` ` `` et non des guillemets simples ou doubles pour les chaînes multilignes
- Les SVG ont `width="52" height="52"` et `viewBox="0 0 141.73 141.73"` définis directement dans la balise `<svg>`
- Le cercle/bordure du bouton est conservé en commentaire dans `style.css` pour usage futur éventuel
- Au tap : déploie un panneau vers le haut avec Accueil / Registre / Équipage / ↑ Haut de page
- Lien de la page active marqué `.mob-nav--active` (grisé, non cliquable)
- Séparation double bordure avant "Haut de page"
- Fermeture au tap en dehors du panneau

**État actuel du bloc `#mob-nav-btn` dans `style.css` :**
```css
#mob-nav-btn {
  width: 52px;
  height: 52px;
  /* border-radius: 50%; */
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  color: var(--gold);
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* box-shadow: 0 4px 20px rgba(0,0,0,0.6); */
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-left: auto;
}
```

### Infobulle équipage sur mobile (`css/equipage.css`)

- Suppression de `white-space: nowrap` sur `.crew-tooltip-label` (causait un débordement horizontal invisible qui décalait les éléments `position: fixed` sur toute la page — dont le bouton de nav mobile)
- Nouveau bloc `@media (max-width: 640px)` : `.crew-tooltip` passe à `grid-template-columns: repeat(3, 68px)` — grille 3×2 au lieu de 6×1, `left: 0`, `white-space: normal`

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans. Sans lui, toutes les pages perdent leur style.
- **Nav mobile et `position: fixed`** : l'infobulle `.crew-tooltip` (459px, `position: absolute`) créait un contexte qui décalait les éléments `fixed` sur `equipage.html`. Résolu en corrigeant l'infobulle plutôt qu'en contournant. À garder en tête si d'autres éléments `fixed` sont ajoutés sur cette page.
- **SVG inline dans JS** : toujours utiliser des backticks `` ` `` pour les chaînes multilignes — guillemets simples ou doubles cassent le JS silencieusement à la première fin de ligne.
- **Styles natifs des `<button>`** : neutraliser avec `appearance: none`, `border: none`, `background: transparent`, `outline: none`, `padding: 0` — les commentaires CSS seuls ne suffisent pas à écraser les styles navigateur.
- **`background-size` sur `.stat-fill`** : `(5/val)*100%` — ne pas confondre avec la largeur de l'élément.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM — uniquement pour les barres de composition (`.crew-bar-reveal`), plus pour les barres de compétence.
- **Cache navigateur** : Ctrl+Shift+R pour forcer le rechargement sans cache après modifications CSS.
- **Google Sheets** : les modifications peuvent mettre quelques minutes à se propager via l'URL CSV.
- **`overflow-x: hidden`** : déjà présent sur `body` dans `style.css` — ne pas supprimer.

---

## Chantiers ouverts

- **Bandeau défilant dans la nav fixe** : idée en réserve pour remplacer "Pavillon Noir" sur mobile (dernier scénario joué, date en jeu, prochaine session) — nav actuellement masquée sur mobile, structure conservée
- **Lien Chroniques dans la nav** : supprimer `hidden` sur `<li hidden>` dans les trois pages quand le contenu sera prêt
- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3)
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` — à faire en une session, en même temps que la création de nouvelles pages

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose dans le dépôt
4. Claude maintient copie locale si l'environnement le permet
