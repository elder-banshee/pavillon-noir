# Pavillon Noir — Site de campagne

Site statique de la campagne de jeu de rôle **Pavillon Noir**, se déroulant dans les Caraïbes entre 1713 et 1720 environ. Système Pavillon Noir.

## Pages

- **`index.html`** — Registre des PNJ : galerie des personnages rencontrés au fil de la campagne, avec recherche plein texte et filtres par tags
- **`equipage.html`** — État du bord : chaîne de commandement, composition et compétences de l'équipage

## Structure des fichiers

```
├── index.html              # Registre des PNJ
├── equipage.html           # Page équipage
├── css/
│   ├── style.css           # Feuille de style principale (partagée)
│   └── equipage.css        # Styles spécifiques à la page équipage
├── js/
│   ├── pnj-data.js         # Données des personnages (source de vérité)
│   ├── app.js              # Logique du registre (filtres, recherche, modal)
│   └── equipage.js         # Logique de la page équipage (fetch Sheets, rendu)
└── pnj/
    └── portraits/          # Portraits des personnages (JPG/WebP, ratio 3:4)
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
  bio: `Biographie destinée aux joueurs…`
}
```

**Ajouter un portrait** : déposer le fichier dans `pnj/portraits/` et renseigner le champ `portrait`. Format recommandé : JPG ou WebP, ratio 3:4, largeur minimale 400px, recadré depuis Photoshop avec le gabarit 600×800px.

**Rendre une fiche visible en session** : passer `visible: false` à `visible: true` (ou supprimer le champ).

## Page équipage — source de données

La page équipage lit ses données depuis **Google Sheets** via une URL CSV publique pointant vers la **Feuille 3** du classeur "Équipage".

Structure de la Feuille 3 :
- **Ligne 1** : six valeurs numériques (moyennes pondérées des compétences d'équipage), dans l'ordre : Manœuvre, Canonnade, Recharge, Combat, Tir, Ruse
- **Lignes 2+** : composition de l'équipage — colonne A = intitulé du groupe, colonne B = effectif

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
