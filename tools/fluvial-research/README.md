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

Le générateur historique ne modifie jamais `js/oscar-hex-grid.js`.

## Application de la base finale

`fluvial-database-finale.json` est désormais la source canonique des noms.
La migration est d’abord simulée :

```powershell
node .\tools\fluvial-research\apply-fluvial-canonical-names.js
```

Après contrôle de `fluvial-canonical-names-report.json`, elle est appliquée avec :

```powershell
node .\tools\fluvial-research\apply-fluvial-canonical-names.js --write
```

Dans la grille migrée, `riverId` contient le `nomCanonique` visible dans Zone
Editor et `courseId` identifie le bras de façon stable. Les références de
topologie utilisent les `courseId`. Le script vérifie qu’aucun vecteur, domaine
ou autre attribut non fluvial n’est modifié.

`generate-fluvial-research.js` décrit le chantier d’inventaire antérieur à
cette migration. Il ne doit pas être utilisé pour reconstruire la base finale
à partir de la grille renommée.

## Topologie fluviale v2

La topologie n’est plus répétée dans les cellules. Le registre global
`fluvialCourses` porte l’identité et la politique terminale de chaque tracé ;
`fluvialMouths` recense ses cellules d’embouchure et `fluvialConnections` ses
fourches et jonctions dirigées. Les anciennes propriétés cellulaires
`fluvialOutlets` et `fluvialRelations` ont été supprimées.

La migration historique vers ce schéma a été effectuée avec :

```powershell
node .\tools\fluvial-research\migrate-fluvial-schema-v2.js --write
```

Ce script refuse une grille déjà migrée. Les futures modifications doivent
passer par Zone Editor ou agir directement sur le schéma v2, puis être
contrôlées avec :

```powershell
node .\tools\fluvial-research\validate-fluvial-schema-v2.js
```

Les invariants et la structure complète sont décrits dans
[`fluvial-schema-v2.md`](./fluvial-schema-v2.md).

### Consolidation ponctuelle des anciennes embouchures

Les branches maritimes artificielles créées sous le schéma v1 ont été
fusionnées une seule fois avec :

```powershell
node .\tools\fluvial-research\consolidate-legacy-multiple-mouths-v2.js --write
```

La liste des fusions est volontairement explicite dans le script. Celui-ci
n’est ni une commande générique ni une étape à rejouer : le schéma v2 permet
maintenant d’associer directement plusieurs cellules d’embouchure à un même
`courseId`. Le rapport détaillé se trouve dans
`fluvial-multiple-mouths-consolidation-report.json`.
