# Inventaire de recherche fluviale

Ce dossier produit un corpus compact pour identifier les cours d’eau dont le
nom n’est pas lisible ou absent sur la carte Jaillot.

```powershell
node .\tools\fluvial-research\generate-fluvial-research.js
```

Le générateur relit la grille canonique, les territoires et les villes, puis
écrit :

- `fluvial-research-inventory.json` : inventaire structuré de tous les cours et
  de leurs bras ;
- `fluvial-research-dossier.md` : fiches des seuls cours sans nom, prévues pour
  la recherche historique ;
- `fluvial-research-map.svg` : repères visuels numérotés superposés à la carte.

Le SVG incorpore son fond cartographique en base64. Il peut donc être transmis
ouvert et affiché seul, sans joindre séparément `jaillot-1708.jpg`.

Le générateur ne modifie jamais `js/oscar-hex-grid.js`. Les propositions de
`courseId`, `watercourseId` et `name` servent de base à la future migration et
ne sont pas encore consommées par le site.
