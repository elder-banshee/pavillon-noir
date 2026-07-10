# Pavillon Noir — Site de campagne · README de reprise

## Contexte général

Site statique GitHub Pages pour une campagne de jeu de rôle **Pavillon Noir** (système éponyme), se déroulant dans les Caraïbes entre 1713 et 1720. Six joueurs, MJ = Ronan. Le site est un outil de table destiné aux joueurs — pas un blog, pas une vitrine publique.

**URL live** : https://elder-banshee.github.io/pavillon-noir/
**Dépôt** : https://github.com/elder-banshee/pavillon-noir
**Branche** : main
**Clone local** : `C:\AI\Site Pavillon Noir\Backup\pavillon-noir`
**Git Bash** : `C:\Program Files\Git\bin\bash.exe`

---

## Architecture

```
├── index.html              # Registre des PNJ
├── equipage.html           # Équipage du Cúchulainn
├── chroniques.html         # Journal de bord (scénarios joués)
├── css/
│   ├── style.css           # Feuille de style principale (PARTAGÉE — ne pas supprimer)
│   ├── equipage.css        # Styles page équipage
│   └── chroniques.css      # Styles page journal de bord
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── app.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Google Sheets, rendu)
│   ├── chroniques-data.js  # Données scénarios
│   └── chroniques.js       # Logique journal de bord (scroll horizontal, navire)
└── pnj/portraits/          # Portraits JPG/WebP, ratio 3:4, 600×800px
```

---

## Charte graphique

Palette sombre, inspiration cartographie marine XVIIIe / gravure sur cuivre.

**Variables CSS** (définies dans `style.css`) :
- `--ink` : #0e0c09 (fond principal, quasi-noir chaud)
- `--parchment` : #f2e8d5 (texte principal)
- `--gold` : #c8973a (accent doré, bordures actives, titres)
- `--gold-light` : #e2b96a (valeurs, éléments dorés secondaires)
- `--sea` : #1a3a4a (bleu marine profond)
- `--mist` : #6b7c8a (texte secondaire, labels)
- `--border` : rgba(200,151,58,0.3) (bordures standard)

**Typographies** (Google Fonts) :
- `Cinzel` — titres, labels, navigation (serif romain)
- `IM Fell English` — italiques, citations, extraits
- `Crimson Text` — corps de texte

**Ton général** : épuré, élégant, sobre. Pas de couleurs vives, pas d'effets tape-à-l'œil. Les animations sont discrètes (fadeIn, hover subtil).

---

## Page 1 — Registre des PNJ (`index.html`)

Galerie filtrable de personnages rencontrés au fil de la campagne.

### Structure des données (`js/pnj-data.js`)

```javascript
{
  id: "identifiant-unique",
  epingle: true,            // optionnel — section "Caribbean's Most Wanted"
  visible: false,           // optionnel — masque sans supprimer
  nom: "Nom complet",
  accroche: "Rôle affiché sous le nom (supporte <br>)",
  alias: "Noms alternatifs (pour la recherche uniquement)",
  statut: "actif|mort|disparu|inconnu",
  naissance: "dates ou fourchette (null si inconnue)",
  origine: "Nationalité / Origine",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",  // null si absent
  bio: `Texte visible par les joueurs`,
  bio_mj: `Notes confidentielles MJ — JAMAIS injectées dans le HTML`
}
```

**Règles éditoriales** :
- `statut: "actif"` (pas "vivant")
- "les aventuriers" (pas "les PJ") dans les textes joueurs
- `bio_mj` existe dans les données mais n'est jamais affiché — `app.js` lit `bio` uniquement

### Fonctionnement (`app.js`)

- Section **"Caribbean's Most Wanted"** : fiches avec `epingle: true`, affichées en grille 4 colonnes avant les autres
- Grille principale : tri alphabétique, `visible: false` exclut la fiche des filtres ET du décompte
- Recherche plein texte sur `nom`, `alias`, `accroche`, `origine`, `bio`, `tags`
- Filtres par tags : ordre défini dans `priority[]` dans `buildTagFilters()`

### Ordre des tags (à maintenir)

```javascript
// Lieux
'Caraïbes', 'Europe', 'Nassau', 'Trinidad', 'Saint-Domingue',
'Jamaïque', 'Kingston', 'The Pirate Round',
// Factions
'Flying Gang', 'Piagnoni', 'Trident',
// Scénarios
'L\'Île des Ombres', 'Satiété engendre Démesure',
'Le dernier voyage de l\'Hippogriffe', 'La Marianne',
'Les épaves de la Flotte au Trésor',
// Personnages joueurs
'Antonio', 'Robert', 'Fanch', 'Edward', 'Dusmatis'
```

---

## Page 2 — Équipage (`equipage.html`)

État du bord du Cúchulainn (cotre à tape-cul, armateur Robert Arundel).

### Données dynamiques — Google Sheets

URL CSV (Feuille 3) :
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv
```

**Structure Feuille 3** :
- Ligne 1 : 6 valeurs numériques — Manœuvre, Canonnade, Recharge, Combat, Tir, Ruse
- Lignes 2+ : colonne A = intitulé du groupe, colonne B = effectif, colonnes C-H = 6 valeurs de compétences détaillées (optionnel — active les infobulles au survol)

### Organigramme de commandement (`equipage.html`)

Codé en dur dans le HTML. Pour modifier un titulaire : changer **simultanément** le texte `.org-titulaire` ET la classe `.org-node--xx`.

Classes disponibles :
- `.org-node--pj` : doré (PJ et matelots)
- `.org-node--pnj` : bleu (PNJ d'équipage)
- `.org-node--vacant` : grisé (poste vacant)

**Postes actuels** :
- Capitaine : Edward Sutherland (PJ)
- Second : Vacant
- Canonnier : Bertrand Le Levant (PJ/matelot)
- Maître d'équipage : Dusmãtis Tahka (PJ)
- Maître-Canonnier : Felix Rikkers dit La Barrique (PJ/matelot)
- Quartier-Maître : Vacant
- Pilote : Edward Sutherland (PJ)
- Chirurgien : Fañch Le Bihan (PJ)
- Coq : Amédée (PJ/matelot)
- Les trois Maîtres : Vacants

---

## Page 3 — Journal de bord (`chroniques.html`)

Scroll horizontal de cartes de scénarios avec rail marin animé.

### Données (`js/chroniques-data.js`)

```javascript
{
  id: "identifiant",
  visible: true,            // false = masqué (scénario non encore joué)
  numero: "Scénario I",
  titre: "Titre du scénario",
  date_campagne: "Avril 1713",
  illustration: "chroniques/covers/fichier.jpg",  // null si absent
  extrait: "Phrase d'accroche (2 lignes max sur la carte)",
  meta: {
    xp: 8,
    gloire: 20,
    infamie: 5,
    pieces_huit: 0,
    recrues: 0,
    pertes: 0
  },
  texte: `<p>Chronique complète en HTML.</p>`
}
```

### Scénarios actuels

| # | Titre | Date | Visible |
|---|-------|------|---------|
| I | L'Île des Ombres | Avril 1713 | ✓ |
| II | Satiété engendre Démesure | Janvier 1714 | ✓ |
| III | Le dernier voyage de l'Hippogriffe | Sept–Déc 1715 | ✓ |
| IV | La prise de la Marianne | Décembre 1715 | ✓ |
| V | Les épaves de la Flotte au Trésor | Janvier 1716 | ✓ |
| VI | Courses à Trinidad | Février 1716 | ✗ |

### Fonctionnement du rail marin (`js/chroniques.js`)

- Scroll horizontal des cartes (600px de large)
- Rail fixe en bas : SVG de mer animé pendant le scroll, figé au repos
- Navire SVG draggable contrôle le scroll (desktop) — `scaleX(-1)` pour naviguer vers la droite
- Zone de navigation : `RAIL_W = 1120` px centrés, `RAIL_MARGIN = 0`
- Molette interceptée uniquement sur `.chrono-piste` (pas le padding)
- `margin-bottom: -100px` sur `#chroniques` pour ajuster le ScrollMax

---

## Workflow GitHub

Le connecteur MCP GitHub (Claude Desktop) est **instable** — écriture souvent en échec malgré SHA frais. Méthode de repli : modifications manuelles dans **GitHub.dev** (ouvrir github.com/elder-banshee/pavillon-noir → touche `.`).

**Avant tout push** : récupérer le SHA avec `get_file_contents` juste avant `create_or_update_file`.

**Regrouper les modifications** : utiliser `push_files` pour envoyer plusieurs fichiers en un commit.

**Ne jamais supprimer `css/style.css`** — déjà arrivé accidentellement, entraîne perte totale du style sur toutes les pages.

---

## Développements en cours / à venir

- **`bio` → `bio_joueurs`** : renommer le champ dans toutes les fiches `pnj-data.js` (Ctrl+H dans GitHub.dev), puis mettre à jour `app.js` pour lire `pnj.bio_joueurs || pnj.bio`. Permettra d'ajouter `bio_mj` (notes confidentielles MJ) sur les fiches sensibles sans risque d'exposition.
- **Illustrations chroniques** : dossier `chroniques/covers/` à alimenter (format 4:3, 800×600px minimum)
- **Navire SVG** : remplacement du dessin actuel par un SVG fourni par une graphiste. L'intégrer comme chaîne dans `NAVIRE_SVG` dans `chroniques.js`. Ajouter `transform: scaleX(-1)` si la proue pointe vers la gauche dans le SVG d'origine.
- **Page Chroniques** : rédaction des textes de chroniques à intégrer dans le champ `texte` de `chroniques-data.js`

---

## Notes importantes

- Le footer contient : *"Votre MJ est génial — ...et Claude m'a un peu aidé"* — à préserver
- `chroniques.html` est **non lié dans la navigation** (page cachée jusqu'à contenu finalisé)
- Les fiches `visible: false` dans `pnj-data.js` sont invisibles sur le site mais accessibles à l'URL directe pour le MJ
- Toujours faire `git pull` en début de session depuis Git Bash avant d'éditer
