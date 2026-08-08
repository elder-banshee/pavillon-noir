# Schéma fluvial v2

La grille OSCAR porte sa version dans `fluvialSchemaVersion`. Depuis la version
2, les vecteurs restent attachés aux cellules, tandis que l’identité et la
topologie des cours d’eau sont décrites une seule fois à l’échelle de la
grille.

## Identité

Chaque entrée de `fluvialCourses` est indexée par un `courseId` technique,
stable et non éditable dans Zone Editor :

```js
fluvialCourses: {
  "amazone-r-main": {
    watercourseId: "Amazone",
    riverId: "Amazone",
    branch: "main",
    terminalPolicy: { type: "sea", mouthMode: "single" }
  }
}
```

- `courseId` identifie un tracé ou un bras continu ;
- `watercourseId` regroupe les bras d’un même cours d’eau ;
- `riverId` contient le nom canonique visible et éditable ;
- `branch` conserve le code du bras fourni par la base de recherche.

Chaque objet de `cell.fluvialCurrents` porte le même `courseId` et le `riverId`
canonique. Une modification du nom dans Zone Editor est propagée à tous les
bras partageant le même `watercourseId`, sans changer leurs identifiants
techniques.

Dans Zone Editor, les champs usuels restent visibles directement. Le panneau
replié « Options avancées » d’un courant permet :

- de rattacher le vecteur de la cellule ou de la sélection à un `courseId`
  déjà enregistré ;
- de consulter son `courseId` et de choisir celui d’un nouveau tracé avant sa
  création ;
- d’éditer `watercourseId`, `branch`, la source du vecteur et la politique
  terminale complète.

Le `courseId` d’un tracé enregistré reste en lecture seule : changer le
rattachement d’une cellule ne réindexe pas silencieusement les autres cellules
du tracé. Lorsqu’un nouveau tracé est créé, son identifiant peut être saisi
explicitement ou laissé vide pour une génération automatique.

La section « Inspecteur fluvial avancé » des filtres d’affichage permet de
sélectionner l’un des `watercourseId` du registre. Elle surligne toutes les
cellules de ses différents tracés et peut superposer les cellules impliquées
dans des jonctions ou des fourches. Sans cours ciblé, ces deux surbrillances
s’appliquent à toute la grille. Le mode « Seulement dans une même cellule »
isole les connexions héritées reposant encore sur un chevauchement ; lorsqu’il
est désactivé, les connexions entre cellules voisines sont également incluses.

## Topologie globale

Les embouchures sont indépendantes des cellules :

```js
fluvialMouths: [
  { courseId: "amazone-r-main", cellKey: "101_150" }
]
```

Les jonctions et fourches sont dirigées. Leurs deux extrémités peuvent se
trouver dans la même cellule ou dans deux cellules voisines :

```js
fluvialConnections: [
  {
    type: "junction",
    fromCourseId: "bras-secondaire",
    fromCellKey: "101_150",
    toCourseId: "amazone-r-main",
    toCellKey: "101_151"
  }
]
```

Une connexion dont l'emprise couvre plusieurs cellules conserve un enregistrement
par ancrage navigable. Tous les ancrages du même événement partagent un
`eventId` généré automatiquement :

```js
fluvialConnections: [
  {
    type: "fork",
    fromCourseId: "cours-principal",
    fromCellKey: "107_168",
    toCourseId: "bras-secondaire",
    toCellKey: "107_168",
    eventId: "connection-event-1"
  },
  {
    type: "fork",
    fromCourseId: "cours-principal",
    fromCellKey: "108_168",
    toCourseId: "bras-secondaire",
    toCellKey: "108_168",
    eventId: "connection-event-1"
  }
]
```

Le pilote peut utiliser chaque ancrage comme point de transition, tandis que
le validateur compte l'ensemble comme une seule fourche ou jonction logique.
Les ancrages d'un même événement doivent être adjacents et décrire le même
type de relation entre les mêmes tracés.

L’absence de connexion signifie que deux tracés qui partagent une cellule ou
des cellules voisines sont strictement séparés. Il n’existe donc plus de
relation `separate`.

## Politique terminale

Chaque cours actif possède exactement une politique terminale :

- `{ type: "sea", mouthMode: "single" }` : exactement une embouchure ;
- `{ type: "sea", mouthMode: "multiple" }` : au moins deux embouchures ;
- `{ type: "junction" }` : exactement une jonction terminale sortante ;
- `{ type: "unresolved", reason: "…" }` : aucune sortie localisée.

La dernière forme est l’exception déclarative utilisée par Bariana, dont
l’embouchure ne peut pas être localisée dans l’emprise de la carte. Elle
remplace l’ancienne règle `map-edge`.

Les fourches décrivent une connexion dirigée mais ne constituent pas une
terminaison. Les chaînes de jonctions terminales doivent être acycliques. Une
jonction terminale multicellulaire compte comme une seule terminaison logique.

Un delta dont plusieurs cellules appartiennent au même réseau conserve un seul
`courseId` dans toute sa composante. Ses différentes cellules terminales sont
simplement ajoutées à `fluvialMouths`. Il n’est pas nécessaire de créer un
tracé technique par débouché.

## Validation

Le validateur autonome contrôle le registre, la continuité, les terminaisons,
les références de cellules, l’adjacence, les doublons et les cycles :

```powershell
node .\tools\fluvial-research\validate-fluvial-schema-v2.js
```

Il écrit `fluvial-schema-v2-validation.json`. Les incohérences structurelles
sont des erreurs bloquantes. Les divergences de noms entre registre et cellules,
les cours enregistrés mais absents et les embouchures hors cellule côtière sont
des avertissements.
