# Identification des composantes fluviales

Cet outil regroupe les cellules portant la nature `fluviale` par connexité
hexagonale. Il ne modifie jamais `js/oscar-hex-grid.js`.

```powershell
node .\tools\fluvial-currents\identify-fluvial-components.js
```

Il produit :

- `fluvial-components-report.json`, inventaire détaillé des composantes ;
- `fluvial-components-preview.svg`, contrôle sur le fond Jaillot.

Chaque identifiant, par exemple `F-95_143`, dérive de la première cellule de
la composante par ordre numérique. Les cercles jaunes numérotés implicitement
par leur opacité sont les trois meilleures embouchures proposées. Une
embouchure déclarée dans `config.js` apparaît en rouge.

Une composante marquée d’un astérisque est composite : plusieurs cours d’eau
distincts y partagent un ou plusieurs hexagones sans se rejoindre réellement.
Elle n’a volontairement aucune embouchure automatique. Les cas connus sont
déclarés dans `compoundComponentIds` et devront être décomposés en tracés
fluviaux pouvant se recouvrir.

`config.js` permet d’ajouter le nom moderne, le nom porté par la carte, un
profil particulier et les cellules d’embouchure validées. Les composantes non
renseignées conservent le profil `generic`.

## Génération expérimentale des vecteurs

```powershell
node .\tools\fluvial-currents\generate-fluvial-currents.js
```

Cette commande produit `fluvial-currents-report.json` et
`fluvial-currents-preview.svg` sans modifier la grille. L’option `--write`
ajoute ensuite `fluvialCurrents` aux cellules concernées. Les vecteurs manuels,
reconnaissables à une source différente de `fluvial-generator`, sont préservés.
