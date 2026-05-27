# Pavillon Noir — Site de campagne

Site statique de la campagne de jeu de rôle **Pavillon Noir**, se déroulant dans les Caraïbes entre 1713 et 1720 environ. Système Pavillon Noir.

## Pages

- **`index.html`** — Accueil : portail de navigation vers les cinq sections du site
- **`pnj.html`** — Registre des PNJ : galerie des personnages rencontrés, avec recherche plein texte et filtres par tags
- **`equipage.html`** — État du bord : chaîne de commandement, composition et compétences de l'équipage
- **`chroniques.html`** — Chroniques : fil des aventures, navigation horizontale par scénario avec rail animé
- **`carte.html`** — Carte géopolitique des Caraïbes (Leaflet, carte Jaillot 1708, overlays thématiques, curseur temporel)

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Chroniques de campagne
├── carte.html              # Carte géopolitique interactive
├── css/
│   ├── style.css           # Styles globaux partagés (NE PAS SUPPRIMER — contient toutes les variables CSS)
│   ├── pnj.css             # Styles spécifiques registre PNJ
│   ├── equipage.css        # Styles spécifiques équipage
│   ├── chroniques.css      # Styles spécifiques chroniques
│   └── carte.css           # Styles spécifiques carte
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation, fetch rapports)
│   ├── carte-data.js       # Données carte (juridictions, pins, données temporelles)
│   ├── carte.js            # Logique carte (Leaflet, zones, pins, panneau, curseur, mode MJ)
│   ├── zones-data.js       # Contours territoriaux (coordonnées pixel) et données démographiques
│   ├── audio.js            # Module audio ambiant (inactif — AUDIO_ENABLED = false)
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

## Mettre à jour les personnages

Les données sont dans `js/pnj-data.js`. Chaque entrée suit ce format :

```javascript
{
  id: "identifiant-unique",
  epingle: true,            // optionnel — place la fiche en section "Caribbean's Most Wanted"
  visible: false,           // optionnel — masque la fiche sans la supprimer
  nom: "Nom complet",
  accroche: "Rôle ou surnom affiché sous le nom",
  alias: "Nom alternatif (pour la recherche)",
  statut: "actif|mort|disparu|inconnu",
  naissance: "dates ou fourchette approximative (null si inconnue)",
  origine: "Nationalité / Origine",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",  // null si pas de portrait
  pavillon: "pnj/pavillons/fichier.svg",  // optionnel — affiché dans la modal uniquement
  source: [                               // optionnel — crédits des illustrations
    { objet: 'portrait', credit: 'Auteur, année — Institution', url: 'https://...' },
    { objet: 'pavillon', credit: 'Auteur, licence', url: 'https://...' }
  ],
  note_mj: `Notes confidentielles MJ (non visibles par les joueurs)`,
  bio: `Biographie destinée aux joueurs…`
}
```

**Ajouter un portrait** : déposer le fichier dans `pnj/portraits/` et renseigner le champ `portrait`. Format recommandé : JPG ou WebP, ratio 3:4, largeur minimale 400px, recadré depuis Photoshop avec le gabarit 600×800px.

**Rendre une fiche visible en session** : supprimer le champ `visible: false` (ou le passer à `true`).

## Mettre à jour les chroniques

Les données sont dans `js/chroniques-data.js`. Chaque entrée suit ce format :

```javascript
{
  id: "identifiant-unique",
  visible: true,
  numero: "Scénario I",
  titre: "Titre du scénario",
  date_campagne: "Mois AAAA",
  illustration: "chroniques/covers/fichier.jpg",  // null si pas d'illustration
  align: 50,                // position verticale de l'image en % (object-position)
  piste: "ost/fichier.mp3", // piste audio associée (null si aucune)
  extrait: "Accroche courte affichée sur la carte et en modal.",
  source: {                 // optionnel — crédit de l'illustration
    credit: 'Auteur, année — Institution',
    url: 'https://...'      // optionnel
  },
  meta: {
    xp: 0, gloire: 0, infamie: 0,
    pieces_huit: 0, recrues: 0, pertes: 0
  },
  rapport: "chroniques/rapports/fichier.md"  // null si pas encore rédigé
}
```

**Ajouter une illustration** : déposer le fichier dans `chroniques/covers/` (format 4:3 minimum, conçu avec des zones calmes en haut et en bas pour le recadrage 16:9 de la modal) et renseigner le champ `illustration`. Régler `align` pour cadrer la zone d'intérêt.

**Ajouter un rapport** : rédiger le texte en Markdown, le déposer dans `chroniques/rapports/` et renseigner le champ `rapport`. Le fichier est chargé dynamiquement via `fetch` à l'ouverture de la modal.

## Page équipage — source de données

La page équipage lit ses données depuis **Google Sheets** via une URL CSV publique pointant vers la **Feuille 3** du classeur « Équipage ».

Structure de la Feuille 3 :
- **Ligne 1** : six valeurs numériques (moyennes pondérées des compétences d'équipage), dans l'ordre : Manœuvre, Canonnade, Recharge, Combat, Tir, Ruse
- **Lignes 2+** : composition de l'équipage — colonne A = intitulé du groupe, colonne B = effectif, colonnes C–H = valeurs des six compétences pour ce groupe

Toutes les cellules de la Feuille 3 sont des formules renvoyant vers la Feuille 1 (calculs détaillés). Pour mettre à jour l'équipage après une session, modifier uniquement la Feuille 1 — la Feuille 3 et le site se mettent à jour automatiquement.

L'appréciation qualitative et les libellés des compétences sont les seules données encore codées en dur dans `js/equipage.js` — à mettre à jour manuellement si nécessaire.

La chaîne de commandement (organigramme) est codée dans `equipage.html` — à modifier directement dans le fichier pour changer les titulaires et leurs couleurs (`org-node--pj`, `--matelot`, `--pnj`, `--vacant`).

## Page carte — architecture

La carte utilise **Leaflet** en mode `L.CRS.Simple` (référentiel pixel) sur l'image `medias/cartes/jaillot-1708.jpg` (8500×5320px).

Les contours territoriaux sont dans `js/zones-data.js` (coordonnées pixel à l'échelle 8500×5320). Les données géopolitiques, narratives et temporelles sont dans `js/carte-data.js`.

**Ajouter une juridiction** : créer une entrée dans `JURIDICTIONS` de `carte-data.js` et un contour correspondant dans `ZONES_DATA` de `zones-data.js`.

**Ajouter un pin de scénario** : créer une entrée dans `CARTE_PINS` de `carte-data.js`. Le champ `chronique_id` doit correspondre à un `id` dans `chroniques-data.js`. Pour plusieurs événements au même endroit, utiliser le champ `groupe` (tableau d'objets).

**Mettre à jour l'année de référence** après une session : modifier `CARTE_ANNEE_REFERENCE` en tête de `carte-data.js`. Cette valeur détermine le maximum atteignable par le curseur temporel en mode normal (le mode MJ déverrouille les années futures).

**Coordonnées des pins** : en pixels à l'échelle 8500×5320. Facteur de conversion depuis Photoshop (24408×15276) : ×0,348.

## Workflow de développement

1. Modifier les fichiers dans **VS Code**
2. Prévisualiser avec **Live Server** (bouton Go Live en bas à droite de VS Code)
3. Committer sur la branche `dev` dans **GitHub Desktop**
4. Merger `dev` dans `main` quand validé
5. Le site en ligne se met à jour automatiquement (GitHub Pages, branche `main`, dossier racine)

URL publique : `https://elder-banshee.github.io/pavillon-noir/`
