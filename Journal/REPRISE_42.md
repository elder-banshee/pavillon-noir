# REPRISE_42 — État du projet Pavillon Noir

## Contexte général
Site statique GitHub Pages, outil de table pour campagne JdR pirates (~1713–1720).
- **URL live** : https://elder-banshee.github.io/pavillon-noir/
- **Dépôt** : https://github.com/elder-banshee/pavillon-noir
- **Branche production** : `main` / **Branche dev** : `dev`
- **Dossier local** : `C:\AI\Site Pavillon Noir\pavillon-noir\`

---

## État du dépôt en fin de session

**Fichiers modifiés non commités (`git status`) :**
- `M js/sea-data.js`
- `M tools/zone-editor.html`
- `D js/carte-data.js.old` (suppression ancienne)
- `D js/villes-data-ajouts-session.js.old` (suppression ancienne)
- `?? Archives/` (dossier non suivi)

**À commiter avant toute chose** (ou laisser en l'état si Codex prend la suite).

---

## Fichiers nouveaux créés cette session

### `js/map-bounds.js`
Polygone de limite géographique de la carte Jaillot (zone navigable utile, excluant titres et frises).
```js
const MAP_BOUNDS_POLYGON = [
  [193,367],[4274,373],[8355,397],
  [8349,5030],[4262,5027],[4251,5024],[172,5013]
];
function pointInMapBounds(x, y) { /* ray-casting */ }
```
Chargé dans `carte.html` et `tools/zone-editor.html` avant `navigation-jaillot.js`.
**Usage futur** : `navigation-jaillot.js` doit appeler `pointInMapBounds(x,y)` pour exclure les cases hors cadre du pathfinding.

### `js/sea-data.js`
Courants et tourbillons maritimes. 16 entrées. Structure de chaque entrée :
```js
{
  id: 'string',
  label: 'string',
  priorite: 1|2|3,   // 1=principal, 2=secondaire, 3=tertiaire
  force: 1|2|3,       // 1=faible, 2=modéré, 3=fort
  centerline: [[x,y], ...],   // points échantillonnés ~50px
  directions: ['N','NE',...], // direction locale (16 cardinaux)
  zone: [[x,y], ...],         // polygone du ruban (contour extérieur)
}
```

**Règle de priorité** (pour le calculateur de routes) :
- Priorités différentes → le courant de priorité la plus basse (valeur 1) gagne
- Même priorité → **moyenne vectorielle** des directions et des forces (non encore implémentée dans `navigation-jaillot.js`)

**Courants présents :**

| id | priorité | force | statut |
|---|---|---|---|
| `guyanes_gulf_stream_principal_r1` | 1 | 3 | ✅ OK |
| `tourbillon_des_sargasses_principal_r1` | 1 | 3 | ✅ arc partiel, traité comme ruban |
| `courant_guyane_secondaire_r2` | 2 | 2 | ✅ OK |
| `tourbillon_des_sargasses_sud_r2` | 2 | 2 | ✅ arc partiel |
| `tourbillon_des_sargasses_nord_r2` | 2 | 2 | ✅ arc partiel |
| `nord_hispaniola_r2` | 2 | 2 | ✅ OK |
| `hispaniola-gulf_stream_r2` | 2 | 2 | ✅ OK |
| `courant_nord_équatorial_r2` | 2 | 2 | ✅ OK |
| `guyanes_gulf_stream_secondaires_sud_r2` | 2 | 2 | ✅ OK |
| `guyanes_gulf_stream_secondaires_nord_r2` | 2 | 2 | ✅ OK |
| `tourbillon_panaméen_r2` | 2 | 2 | ⚠️ voir ci-dessous |
| `tourbillon_texan_r2` | 2 | 2 | ⚠️ voir ci-dessous |
| `tourbillon_cubain_r3` | 3 | 1 | ⚠️ voir ci-dessous |
| `tourbillon_haitien_r3` | 3 | 1 | ⚠️ voir ci-dessous |
| `tourbillon_de_campeche_r3` | 3 | 1 | ⚠️ voir ci-dessous |
| `tourbillon_floridien_r3` | 3 | 1 | ⚠️ voir ci-dessous |

---

## Problème ouvert : tourbillons elliptiques

### Nature du problème
Les tourbillons (panaméen, texan, haïtien, Campeche, floridien, cubain) sont des gyres circulaires. Leur modélisation correcte requiert un **ruban annulaire** (donut) : zone navigable avec courant circulaire en périphérie, centre sans courant.

`LineString.buffer()` appliqué sur une ellipse fermée génère un **polygone plein** (Shapely remplit l'intérieur car la ligne se referme). Le résultat affiché dans l'éditeur est une ellipse pleine, pas un ruban.

### Ce qui a été tenté et abandonné
- Génération de deux polygones Leaflet superposés (externe + interne réduit au centroïde) → artefacts graphiques, approche incorrecte
- Détection par id (`tourbillon_`) pour traitement spécial → trop de cas particuliers

### Solution à implémenter (Codex)
Deux approches possibles :

**Option A — Césure dans l'ellipse**
Introduire un interstice de 1px dans la centerline elliptique (ne pas fermer le dernier point sur le premier). `LineString.buffer()` générera alors un ruban ouvert correct. Exemple : au lieu de `n+1` points avec `pts[0] == pts[-1]`, générer `n` points et laisser un écart entre début et fin.

**Option B — Polygon avec trou**
Construire explicitement :
```python
exterior = ellipse(rx + demi_largeur, ry + demi_largeur)
interior = ellipse(rx - demi_largeur, ry - demi_largeur)
donut = Polygon(exterior, holes=[interior])
```
Puis exporter en format "contour exterior + interior concatenés" compatible avec Leaflet :
```js
// Format Leaflet pour polygon avec trou :
L.polygon([exterior_coords, interior_coords])
// Format sea-data.js à adapter :
zone: { exterior: [[x,y],...], hole: [[x,y],...] }
```
Cette option nécessite de modifier le rendu dans `renderCurrentsLayer` (Leaflet supporte nativement les polygones avec trous via tableau de tableaux).

**Recommandation** : Option A (césure) pour les données, Option B (trou) pour le rendu — les deux sont compatibles.

### Cas particulier : tourbillon cubain
Son SVG source est un `path` fermé (`fill=#1d1d1b, Z count:1`) avec un micro-segment `v1` au départ qui crée une discontinuité de direction. À traiter en filtrant les points trop proches (distance < 5px) dans `sample_path`.

---

## Zone Editor — mode Courants

**Fonctionnalités implémentées :**
- Sélection d'un courant par clic sur le ruban (highlight jaune)
- Panneau de détail : id, label, priorité, force, nombre de points
- **⇄ Inverser** : inverse `centerline` et recalcule `directions` côté JS (`recomputeDirections()`)
- **✕ Supprimer** : retire de la copie de travail en mémoire
- **⬇ Exporter tout (sea-data.js)** : télécharge le fichier complet avec corrections en mémoire

**⚠️ Bug encodage export** : le navigateur Windows exporte en UTF-16. Après téléchargement, ouvrir dans VS Code et sauvegarder en UTF-8 avant de remplacer dans le dépôt. Ou utiliser ce snippet Python :
```python
with open('sea-data.js','r',encoding='utf-16') as f: c=f.read()
with open('sea-data.js','w',encoding='utf-8') as f: f.write(c)
```

**Affichage :**
- Nuances de bleu par priorité : p1 bleu marine, p2 bleu moyen, p3 bleu clair
- Sélection : jaune doré, `fillOpacity: 0.55`
- Espacement flèches : ~150px minimum entre flèches (calcul en px réels)
- Export-area masqué en mode Courants

---

## Outils en `C:\AI\Site Pavillon Noir\`

### `gen_sea_data.py`
Génère des blocs `sea-data.js` depuis un SVG de courants.
```powershell
python gen_sea_data.py [fichier.svg] > blocs.js
# Défaut : courants.svg
# Exemple : python gen_sea_data.py courants2.svg > courants2_blocs.js
```
Gère : `path` (centerline), `ellipse` (tourbillon — problème ouvert), `line`.
Convention `_rN` dans l'id : `r1`=400px/priorité 1/force 3, `r2`=200px/p2/f2, `r3`=100px/p3/f1.
Applique : découpe par `MAP_BOUNDS`, découpe mutuelle par priorité.

### `svg_to_currents.py`
Version antérieure, remplacée par `gen_sea_data.py` pour les nouveaux SVG.
Options utiles : `--reverse ID`, `--decoupe-par fichier.svg`, `--decoupe-mutuelle`.

### SVG sources
- `courants.svg` : tracés principaux (à placer dans `C:\AI\Site Pavillon Noir\`)
- `courants2.svg` : corrections tentées, contient uniquement `courant_guyane_secondaire_r2` d'utilisable

---

## Calculateur d'itinéraires — état

Trace des routes, évite les terres (`ZONES_DATA`), désactivé en mode isolation.
**Non encore implémenté** :
- Intégration de `MAP_BOUNDS` dans le pathfinding (exclure cases hors cadre)
- Conversion pixels → distance (1px = 0.575 km, 840px = 100 lieues)
- Influence des courants (`SEA_CURRENTS`) sur route et durée
- Caractéristiques du navire et de l'équipage
- Règle de moyenne vectorielle pour courants de même priorité

**Décision de conception** : ne pas afficher de durée tant que vents/courants ne sont pas intégrés (éviter un "nerf météo" perçu par les joueurs).

---

## Chargement des scripts dans carte.html (ordre)
```html
<script src="js/zones-data.js"></script>
<script src="js/map-bounds.js"></script>
<script src="js/sea-data.js"></script>
<script src="js/carte-data.js"></script>
<script src="js/villes-data.js"></script>
<script src="js/villes-data-ajouts-session.js"></script>
<script src="js/navigation-jaillot.js"></script>
```
Idem dans `tools/zone-editor.html` (avec préfixe `../js/`).
