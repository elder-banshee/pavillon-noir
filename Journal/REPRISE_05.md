# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files` plutôt que d'afficher le contenu dans le chat. Claude maintient une copie locale de référence dans `/home/claude/pavillon-noir/` et la met à jour après chaque modification validée.

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
│   └── audio.js            # Module audio ambiant (inactif)
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

---

## Chantier majeur accompli en session 5

### Refactorisation CSS

`pnj.css` contenait tous les styles globaux et spécifiques mélangés. La session 5 a effectué la séparation complète :

- **`css/style.css`** (nouveau) : variables, reset, navigation, hero, section, modal de base, footer, animations, scrollbar, audio
- **`css/pnj.css`** (allégé) : uniquement les styles du registre PNJ — grille, cartes, filtres, pavillons, modal PNJ, Caribbean's Most Wanted

Toutes les pages chargent désormais `style.css` en premier.

**À ne jamais supprimer** : `css/style.css` — perte totale du style sur toutes les pages.

### Jauges de compétences (`equipage.js`)

Refonte complète de `buildStatBar()` — abandon du système masque/révélation au profit d'une approche `background-size` :

- **Valeur ≤ 5** : `width = (val/5)*100%`, `background-size = (5/val)*100%`. Le gradient s'étend sur un espace de référence plus large que l'élément — rogné depuis la gauche, il révèle toujours le bon fragment coloré.
- **Valeur ≥ 6** : largeur 100%, point de transition décalé de 10% vers la gauche par point au-dessus de 5 (plafonné à 10).
- **Gradient** : `var(--sea) 0%, var(--sea-light) 40%, #9a7a28 65%, var(--gold) 80%, var(--gold-light) 100%`

---

## État actuel des pages

### index.html — Page d'accueil

Portail sobre : trois cartes de navigation, élément "Prochaine session" en bas.
- Styles inline dans `<style>` (trop peu de règles pour un CSS séparé)
- Carte Journal de bord inactive (`accueil-carte--inactive`) — à activer quand le contenu sera prêt
- "Prochaine session" : codée en dur, à mettre à jour manuellement

### pnj.html — Registre des PNJ

Galerie filtrée par tags, recherche plein texte, modal au clic. Pavillons via SVG inline avec clipPath.

**Structure fiche PNJ (`pnj-data.js`) :**
```javascript
{
  id: "identifiant",
  epingle: true,           // section Caribbean's Most Wanted
  visible: false,          // masque sans supprimer
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

**Ordre des tags dans `priority[]` de `pnj.js` :**
```javascript
'Caraïbes', 'Europe',
'Nassau', 'Trinidad', 'Saint-Domingue', 'Jamaïque', 'Kingston', 'The Pirate Round',
'Flying Gang', 'Équipage du Captain Charles Johnson',
'L\'Île des Ombres', 'Satiété engendre Démesure', 'Le dernier voyage de l\'Hippogriffe',
'La Marianne', 'Les épaves de la Flotte au Trésor',
'Antonio', 'Robert', 'Fanch', 'Edward', 'Dusmatis'
```

### equipage.html — État du bord

Données Google Sheets, organigramme codé en dur, jauges animées.

**URL CSV Google Sheets (Feuille 3) :**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv
```

### chroniques.html — Journal de campagne

Rail horizontal de cartes défilantes avec navire SVG animé. Modal au clic avec navigation par chapitres.

**Structure chronique (`chroniques-data.js`) :**
```javascript
{
  id: "identifiant",
  visible: true,
  numero: "Scénario I",
  titre: "Titre",
  date_campagne: "Mois Année",
  illustration: "chroniques/covers/fichier.jpg",
  piste: "ost/fichier.mp3",
  extrait: "Résumé court",
  meta: { xp, gloire, infamie, pieces_huit, recrues, pertes },
  chapitres: {
    1: `<p>Texte HTML…</p>`,
    2: null  // bouton absent
  }
}
```

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose dans le dépôt
4. Claude maintient copie locale `/home/claude/pavillon-noir/` à jour

---

## Chantiers ouverts

- **Illustrations chroniques** : alimenter `chroniques/covers/` (format 4:3)
- **Textes des chroniques** : rédiger et intégrer dans le champ `chapitres` de `chroniques-data.js`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Lien Chroniques dans la nav** : supprimer `hidden` sur `<li hidden>` dans les trois pages quand le contenu sera prêt
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/` — à faire en une session, en même temps que la création de nouvelles pages

---

## Points de vigilance techniques

- **`style.css` ≠ optionnel** : toutes les variables CSS sont dedans. Sans lui, toutes les pages perdent leur style.
- **`background-size` sur `.stat-fill`** : `(5/val)*100%` — ne pas confondre avec la largeur de l'élément. La formule est autonome, indépendante de la largeur du conteneur.
- **Double `requestAnimationFrame`** : nécessaire pour les transitions CSS après insertion DOM — uniquement pour les barres de composition (`.crew-bar-reveal`), plus pour les barres de compétence.
- **`margin` vs `padding`** : le margin est extérieur à l'élément (transparent, insensible à la souris), le padding est intérieur (hérite du fond, intercepte les événements). Sur `chroniques.html`, l'espace entre hero et piste est géré par `margin-top` sur `.chrono-piste-outer` — ne pas le remplacer par du padding.
- **Cache navigateur** : Ctrl+Shift+R pour forcer le rechargement sans cache après modifications CSS.
- **Google Sheets** : les modifications peuvent mettre quelques minutes à se propager via l'URL CSV.
