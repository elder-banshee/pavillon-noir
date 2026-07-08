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
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ (ex-index.html)
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── css/
│   ├── pnj.css             # Styles globaux + styles PNJ (ex-style.css — à refactoriser)
│   ├── equipage.css        # Styles page équipage
│   └── chroniques.css      # Styles page chroniques
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal) (ex-app.js)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   └── audio.js            # Module audio ambiant (inactif)
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   └── covers/             # Illustrations chroniques (placeholder en-cours.jpg)
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## Pages et fonctionnalités

### index.html — Page d'accueil

Portail de navigation sobre : trois cartes de navigation centrées, élément "Prochaine session" en bas.

- Styles inline dans `<style>` dans le fichier (pas de CSS séparé — trop peu de règles)
- `main { padding-top: 0 }` surchargé localement pour supprimer le bandeau noir (compensation nav fixe inutile ici puisque pas de hero)
- Carte Journal de bord : `class="accueil-carte accueil-carte--inactive"` + `animation: none` pour contourner le conflit avec `fadeIn` qui écrasait `opacity: 0.4`
- Lien Journal de bord dans la nav : `<li hidden>` — à activer en supprimant `hidden` quand la page sera prête
- Prochaine session : codée en dur dans le HTML, à mettre à jour manuellement après chaque session

**Pages anticipées à ajouter aux cartes :**
- Géographie (carte des Caraïbes + pins de localisation des scénarios)
- Personnages joueurs (historiques des PJ)
- Règles (sous forme de résumés/reformulations — pas de reproduction du manuel)

### pnj.html — Registre des PNJ

Galerie filtrée par tags, recherche plein texte, modal au clic.

**Pavillons** — SVG inline dans `buildCard()` de `pnj.js` :
- `clipPath` avec le tracé de Claire (`drapeau_OK.svg`)
- Contour doré : `fill="#c8973a" stroke="#c8973a" stroke-width="2"`
- Reflet : `linearGradient` + `<rect>` superposé
- IDs uniques par fiche : `flag-clip-${pnj.id}`, `flag-shine-${pnj.id}`
- Le filtre ombre (`feDropShadow`) a été supprimé en session 4 — ne pas le réintroduire

**Structure fiche PNJ (`pnj-data.js`) :**
```javascript
{
  id: "identifiant",
  epingle: true,
  visible: false,
  nom: "Nom complet",
  accroche: "Rôle / surnom",
  alias: "Nom alternatif (recherche uniquement)",
  statut: "actif|mort|disparu|inconnu",
  naissance: "dates",
  origine: "Nationalité",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",
  pavillon: "pnj/pavillons/fichier.svg",
  bio: `Texte biographique…`
}
```

### equipage.html — État du bord

Inchangé en session 4. Données Google Sheets, organigramme codé en dur, jauges animées.

**URL CSV Google Sheets (Feuille 3) :**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv
```

### chroniques.html — Journal de campagne

**Modifications session 4 :**

**Boutons de navigation modal :**
- `.chrono-nav-btn` : `font-size: 0.85rem`, `font-weight: 700`, `color: var(--gold)`
- `.modal-chrono-nav` : `padding: 1rem 2rem 1rem` — une seule déclaration propre, suppression du `padding-bottom` séparé qui créait des conflits
- `.modal-chrono-nav--bas` : `padding: 1rem 2rem 1rem` — alignement vertical correct
- `.modal-chrono-body` : `padding: 0`
- `.modal-chrono-nav` : `position: static` supprimé — devenu inutile après refactorisation de `nav` → `.site-nav`

**Rail et scroll :**
- Hauteur du wrap calculée en JS : `wrap.style.height = piste.offsetHeight + 'px'` — épouse la hauteur réelle des cartes
- Spacer invisible inséré après `.chrono-piste-outer` pour l'espace visuel sous les cartes sans intercepter les événements souris (`pointer-events: none`)
- `.chrono-piste-wrap` : `max-width: 1200px`
- `.chrono-piste` : `padding: 0 calc(50% - 240px) 0`

**Infobulle équipage :**
- `.crew-tooltip-label` : `font-size: 8px` (px fixe, imperméable aux préférences navigateur) + `white-space: nowrap`

---

## Refactorisation nav — effectuée en session 4

`nav { position: fixed }` dans `pnj.css` remplacé par `.site-nav { position: fixed }`.
Les trois pages HTML ont `<nav class="site-nav">`.
`position: static` supprimé de `.modal-chrono-nav` (correctif devenu inutile).

---

## Workflow de collaboration

**Contrainte principale** : le connecteur MCP GitHub est instable en écriture. Méthode :
1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Claude maintient copie locale `/home/claude/pavillon-noir/` à jour

**Ne jamais supprimer `css/pnj.css`** — contient les styles globaux de toutes les pages.

**DevTools (F12)** : Ronan l'utilise désormais couramment pour tester les valeurs CSS en direct avant de les reporter dans les fichiers. Quand DevTools et le rendu réel divergent, chercher du côté de l'héritage et de la cascade plutôt que de l'élément inspecté directement.

---

## Chantier majeur à venir — session 5 (ou ultérieure)

À faire en une seule session pour éviter les états intermédiaires cassés :

### 1. Refactorisation CSS — séparer global et spécifique

`pnj.css` contient actuellement deux catégories mélangées :
- Styles **globaux** (variables, reset, `.site-nav`, `.hero`, `.modal`, `.footer`, animations...) → à extraire dans un nouveau `css/style.css` chargé par toutes les pages
- Styles **spécifiques PNJ** (grille PNJ, cartes, filtres, tags, pavillons...) → à garder dans `css/pnj.css`

Toutes les pages devront charger `css/style.css` + leur CSS spécifique.

### 2. Réorganisation des dossiers de médias

Structure actuelle : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/`
Structure cible : `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` (+ futures catégories)

Opération fastidieuse dans GitHub.dev (pas de déplacer-dossier natif) : déplacer chaque fichier individuellement, mettre à jour les chemins dans `pnj-data.js` (nombreuses occurrences) et `chroniques-data.js` via `Ctrl+Shift+H`.

**Recommandation** : faire ces deux chantiers ensemble, dans cet ordre (CSS d'abord, médias ensuite), quand de nouvelles pages seront sur le point d'être créées.

---

## Chantiers secondaires ouverts

- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3)
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : pistes à créer, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/` pour les fiches sans pavillon
- **Lien Chroniques dans la nav** : supprimer `hidden` sur `<li hidden>` dans `index.html` quand le contenu sera prêt
- **Carte Journal de bord** : changer `<div class="accueil-carte accueil-carte--inactive">` en `<a class="accueil-carte" href="chroniques.html">` dans `index.html` quand la page sera prête

---

## Points de vigilance techniques

- **`pnj.css` ≠ styles PNJ uniquement** — contient tous les styles globaux. Ne pas confondre avec un fichier purement dédié au registre.
- **`rem` vs `px`** : `rem` est relatif à la taille de police racine du navigateur (variable selon les préférences utilisateur). Utiliser `px` pour les espaces très contraints où la cohérence est critique (ex: `.crew-tooltip-label`).
- **`overflow: auto/hidden` coupe le padding-bottom** des enfants — le padding déborde silencieusement sans pousser le conteneur. Compenser en JS sur la hauteur du conteneur.
- **Héritage CSS et cascade** : quand DevTools et le rendu réel divergent, chercher si une règle parente s'applique à l'élément inspecté via la balise HTML (ex: `nav { position: fixed }` s'appliquait à tous les `<nav>` indépendamment de leur classe).
- **`animation` écrase `opacity`** : une animation `fadeIn` (0→1) appliquée à un élément écrase un `opacity` fixe défini par CSS. Corriger avec `animation: none` sur l'élément concerné.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM.
- **`insertAdjacentElement('afterend', el)`** : insère un élément juste après dans le DOM — `insertAfter` n'existe pas en JS natif.
- **`pointer-events: none`** : rend un élément complètement transparent aux interactions souris (clics, scroll, drag) sans le masquer visuellement.
