# REPRISE_67 — Migration hauts-fonds + renommage fonctions Sea

## Contexte

Session consacrée à deux chantiers conceptuels (déventement, courants côtiers)
puis à l'étape 1 de la restructuration de Zone Editor.

## Décisions architecturales actées cette session

### Déventement
- Seuls les reliefs dont l'ombre tombe en mer avec des alizés ENE constants sont
  à modéliser : volcans des Petites Antilles, Sierra Maestra (Cuba est),
  Sierra Nevada de Santa Marta (Nouvelle-Grenade).
- Les cordillères continentales sont ignorées (ombre projetée vers l'intérieur
  des terres).
- Le champ `deventement` dans `JURIDICTIONS` est déjà câblé et prêt à recevoir
  les données. Format : `true` (réglages par défaut) ou objet
  `{ porteeNm, demiAngleDeg, facteurMin }`.
- La portée par territoire sera calculée à partir de l'altitude fournie par la
  recherche historique (portée = altitude_m × facteur / 1852). Le facteur varie
  selon la forme du relief (compact : 15–20, barrière : 25–30).
- Le fichier `recherche_deventement_courants.md` a été généré (liste des
  territoires à documenter). Il n'a pas encore été renseigné.

### Courants côtiers
- Pas de couche vectorielle superposée : on édite directement les hexagones
  côtiers dans Zone Editor (sélection multiple + édition par paquets).
- Structure de cellule étendue : champ `coastal` optionnel
  `{ xKnot, yKnot, speedKnot, dirToDeg }` + flag `source: 'manuel'`.
- Moteur : si `coastal` existe, il compare la composante axiale des deux
  vecteurs sur le segment et retient le plus favorable (sélection par segment).
- Affichage Zone Editor : flèche jaune (Copernicus) + flèche bleu azur
  (`coastal`), superposées dans la même cellule.
- Cellules manuellement éditées : surbrillance orange persistante + flag
  `source: 'manuel'` ajouté automatiquement à l'export.
- Filtre prévu : "afficher uniquement les cellules éditées manuellement" +
  "cellules calmes non éditées" (candidats prioritaires pour les courants
  côtiers manquants).
- `attenuationCourantCote()` reste à `1` — pas de couche générique de
  proximité côtière. Les courants côtiers seront peints hexagone par hexagone.

### Restructuration des modes Zone Editor (décidée, pas encore implémentée)
```
SÉMAPHORE      — moniteur de navigation (inchangé)
TOPOGRAPHIE    — onglet GÉO  : édition géométrie polygones → export zones-data.js
               — onglet INFO : édition données démographiques / métadonnées shoal
OCÉANOGRAPHIE  — mode unifié : inspection + édition cellules hexagonales
```
- `activeEditor × activeTab` → `activeMode` (`semaphore|topo|ocean`) +
  `activeTab` (`geo|info`, TOPOGRAPHIE uniquement).
- GÉO-Mers et INFO-Mers fusionnés dans OCÉANOGRAPHIE (distinction artificielle
  supprimée).
- GÉO-Terres et INFO-Terres conservés comme deux onglets distincts de
  TOPOGRAPHIE (cibles et panneaux incompatibles).

## Travaux réalisés cette session

### Étape 1 — Migration hauts-fonds `sea-data.js` → `zones-data.js`

**`js/zones-data.js`**
- 4 polygones hauts-fonds insérés dans `ZONES_DATA` (kebab-case, après
  `bahamas-archipel`, avant `barbade`) :
  `banc-de-cuba`, `banc-de-jamaique`, `banc-de-porto-rico`, `banc-des-bahamas`
- Bloc `ZONES_SHOAL` ajouté en fin de fichier (après `ZONES_DEMO`) avec les
  métadonnées des 4 hauts-fonds (`label`, `visibiliteNav`, `catMax`,
  `catMaxNav`, `passageNav`, `risque`, `contexte`, `note_mj`).

**`js/navigation-jaillot.js`**
- `sourceHautsFondsCalculateur()` réécrite pour lire `ZONES_DATA` +
  `ZONES_SHOAL` via `sourceShoals()`. Plus aucune référence à `SEA_SHOALS`.
- `zoneSeaPolygons()` étendue pour distinguer le format `ZONES_DATA`
  (`[[pts],[pts]]`, tableau de contours) du format legacy (`[[x,y]]`, contour
  simple) — détection sur `Array.isArray(zone[0][0])`.

**`tools/zone-editor.html`**
- `<script src="../js/sea-data.js">` retiré.
- `getWorkingShoals()` réécrite pour reconstruire les hauts-fonds depuis
  `ZONES_DATA` + `ZONES_SHOAL` au lieu de `SEA_SHOALS`.

**`js/sea-data.js`**
- Conservé en place (non supprimé) — à retirer après validation complète de
  l'étape 2.

### Renommage des fonctions Sea (alignement nomenclature)

Convention retenue : préfixe `zoneSea`, suffixe rôle.

| Ancien nom (moteur) | Nouveau nom |
|---|---|
| `polygoneZoneSea` | `zoneSeaNormaliser` |
| `polygonesZoneSea` | `zoneSeaPolygons` |
| `anneauxZoneSea` | `zoneSeaRings` |
| `normaliserZoneSea` | inchangé |

| Ancien nom (Zone Editor) | Nouveau nom |
|---|---|
| `seaZonePolygons` | `zoneSeaPolygons` |
| `seaZoneRings` | `zoneSeaRings` |
| `currentZoneAsEditableObject` | inchangé (clone pour édition) |

Les deux fichiers partagent maintenant `zoneSeaPolygons` et `zoneSeaRings`
avec des noms identiques et des rôles identiques.

## Validations effectuées

```
node --check js/zones-data.js          → OK
node --check js/navigation-jaillot.js  → OK
node tools/audit-text-integrity.js --strict-eol → OK
inline script zone-editor.html         → OK
```

Tests navigateur Zone Editor :
- Hauts-fonds visibles visuellement ✓
- Calculateur SÉMAPHORE affiche les bons labels hauts-fonds ✓

## État Git

Aucun commit effectué cette session. Tous les travaux sont en local sur `dev`.
Fichiers modifiés :
```
js/zones-data.js
js/navigation-jaillot.js
tools/zone-editor.html
```

## Prochaine session — Étape 2

Restructuration des modes Zone Editor :

1. Renommer `activeEditor` → `activeMode` (`semaphore|topo|ocean`).
2. Supprimer le bouton `data-editor="currents"` et son CSS.
3. Fusionner GÉO-Mers et INFO-Mers en OCÉANOGRAPHIE (mode unique, sans onglet).
4. Renommer GÉO-Terres / INFO-Terres en onglets `geo` / `info` de TOPOGRAPHIE.
5. Mettre à jour tous les `ctx.isXxx` dérivés du nouvel `activeMode`.
6. Rediriger l'export hauts-fonds vers `zones-data.js` (actuellement exporte
   encore `sea-data.js`).
7. Supprimer `sea-data.js` et sa référence dans `index.html` si elle existe.

Commencer par lire l'état actuel de `zone-editor.html` avant toute
modification (état local, pas GitHub).
