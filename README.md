# Pavillon Noir — Site de campagne

Site statique de la campagne de jeu de rôle **Pavillon Noir**, se déroulant dans les Caraïbes entre 1713 et 1720 environ. Système Pavillon Noir.

## Pages

- **`index.html`** — Page d'accueil : portail de navigation vers les trois sections du site
- **`pnj.html`** — Registre des PNJ : galerie des personnages rencontrés au fil de la campagne, avec recherche plein texte et filtres par tags
- **`equipage.html`** — État du bord : chaîne de commandement, composition et compétences de l'équipage
- **`chroniques.html`** — Journal de bord : fil des aventures, navigation horizontale par scénario avec rail marin animé

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de bord
├── css/
│   ├── style.css           # Styles globaux partagés (variables, nav, hero, modal de base)
│   ├── pnj.css             # Styles spécifiques au registre PNJ
│   ├── equipage.css        # Styles spécifiques à la page équipage
│   └── chroniques.css      # Styles spécifiques au journal de bord
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── chroniques.js       # Logique chroniques (rail marin, modal, navigation)
│   ├── audio.js            # Module audio ambiant (inactif — AUDIO_ENABLED = false)
│   └── mobile-nav.js       # Navigation mobile flottante
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   └── covers/             # Illustrations chroniques (ratio 4:3 minimum)
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
  bio: `Biographie destinée aux joueurs…`
}
```

**Ajouter un portrait** : déposer le fichier dans `pnj/portraits/` et renseigner le champ `portrait`. Format recommandé : JPG ou WebP, ratio 3:4, largeur minimale 400px, recadré depuis Photoshop avec le gabarit 600×800px.

**Rendre une fiche visible en session** : passer `visible: false` à `visible: true` (ou supprimer le champ).

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
  piste: "ost/fichier.mp3", // piste audio associée
  extrait: "Accroche courte affichée sur la carte et en modal.",
  source: {                 // optionnel — crédit de l'illustration
    credit: 'Auteur, année — Institution',
    url: 'https://...'      // optionnel
  },
  meta: {
    xp: 0, gloire: 0, infamie: 0,
    pieces_huit: 0, recrues: 0, pertes: 0
  },
  chapitres: {
    1: `<p>Texte du chapitre 1…</p>`,
    2: null   // null = chapitre non encore rédigé
  }
}
```

**Ajouter une illustration** : déposer le fichier dans `chroniques/covers/` (format 4:3 minimum, conçu avec des zones calmes en haut et en bas pour le recadrage 16:9 de la modal) et renseigner le champ `illustration`. Régler `align` pour cadrer la zone d'intérêt.

## Page équipage — source de données

La page équipage lit ses données depuis **Google Sheets** via une URL CSV publique pointant vers la **Feuille 3** du classeur "Équipage".

Structure de la Feuille 3 :
- **Ligne 1** : six valeurs numériques (moyennes pondérées des compétences d'équipage), dans l'ordre : Manœuvre, Canonnade, Recharge, Combat, Tir, Ruse
- **Lignes 2+** : composition de l'équipage — colonne A = intitulé du groupe, colonne B = effectif, colonnes C–H = valeurs des six compétences pour ce groupe

Toutes les cellules de la Feuille 3 sont des formules renvoyant vers la Feuille 1 (calculs détaillés). Pour mettre à jour l'équipage après une session, modifier uniquement la Feuille 1 — la Feuille 3 et le site se mettent à jour automatiquement.

L'appréciation qualitative et les libellés des compétences sont les seules données encore codées en dur dans `js/equipage.js` — à mettre à jour manuellement si nécessaire.

La chaîne de commandement (organigramme) est codée dans `equipage.html` — à modifier directement dans le fichier pour changer les titulaires et leurs couleurs (`org-node--pj`, `--matelot`, `--pnj`, `--vacant`).

## Workflow Git

```bash
# Cloner le dépôt (une seule fois)
git clone https://github.com/elder-banshee/pavillon-noir.git

# Se placer dans le dossier
cd pavillon-noir

# Mettre à jour la copie locale
git pull
```

Git Bash se trouve dans `C:\Program Files\Git\bin\bash.exe`.

## Hébergement

GitHub Pages — branche `main`, dossier racine.
URL publique : `https://elder-banshee.github.io/pavillon-noir/`
