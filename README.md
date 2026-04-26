# Pavillon Noir — Site de campagne

Site statique de la campagne de jeu de rôle **Pavillon Noir**, se déroulant dans les Caraïbes entre 1713 et 1720.

## Contenu

- **Registre des PNJ** — Fiches des personnages rencontrés au fil de la campagne

## Structure

```
├── index.html          # Page principale
├── css/
│   └── style.css       # Feuille de style
├── js/
│   ├── pnj-data.js     # Données des personnages
│   └── app.js          # Logique de l'interface
└── pnj/
    └── portraits/      # Portraits des personnages (à ajouter)
```

## Mise à jour des personnages

Les données des personnages sont dans `js/pnj-data.js`. Chaque entrée suit ce format :

```javascript
{
  id: "identifiant-unique",
  nom: "Nom complet",
  alias: "Surnom ou alias (null si aucun)",
  statut: "vivant|mort|disparu|inconnu",
  naissance: "dates (null si inconnues)",
  origine: "Nationalité / Origine",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",  // null si pas de portrait
  bio: `Biographie du personnage...`
}
```

## Ajouter un portrait

1. Placer l'image dans `pnj/portraits/`
2. Mettre à jour le champ `portrait` dans `js/pnj-data.js`

Format recommandé : JPG ou WebP, ratio 3:4, largeur minimale 400px.
