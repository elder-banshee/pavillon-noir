# REPRISE_59 - Exploration données OSCAR/Copernicus

## Contexte

Session consacrée à l'exploration d'une piste alternative pour alimenter le moteur de navigation en données de courants océaniques réelles, en remplacement des rubans SVG dessinés manuellement.

Point de départ : les rubans dessinés à la main dans l'ancien `courants.svg` sont schématiques et sans réalité océanographique. L'objectif était de trouver une source de données physiquement fondée et un workflow de conversion vers le format du moteur.

## Source de données retenue

**Copernicus Marine Service**
Produit : `GLOBAL_MULTIYEAR_PHY_001_030`
Dataset : `cmems_mod_glo_phy_my_0.083deg-climatology_P1M-m`
Résolution : 0.083° × 0.083° (~9 km)
Variables : `uo` (courant zonal U) et `vo` (courant méridional V) en m/s
Temporalité : climatologie mensuelle (12 mois types, moyenne sur plusieurs décennies)
Zone téléchargée : Golfe du Mexique / Caraïbes / Atlantique tropical (5°N–35°N, 100°W–55°W)

Fichier local :
`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\cmems_mod_glo_phy_my_0.083deg-climatology_P1M-m_1782715143527.nc`

Accès : compte Copernicus Marine gratuit, subsetting via formulaire web.

## Outils produits

### gen_oscar_data.py

Fichier :
`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py`

Lit le NetCDF Copernicus et produit deux sorties :

**oscar-grid.js** (`pavillon-noir/js/oscar-grid.js`)
Grille de 90 163 points avec pour chaque point : `lat`, `lon`, `u`, `v`, `speedKmh`, `dirDeg`, `px`, `py`.
Les coordonnées pixel sont issues d'une interpolation `griddata` depuis 70 points d'ancrage (ports de `villes-data.js`).
Ce fichier n'est pas intégré au moteur à ce stade.

**courants-oscar.svg**
(`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-oscar.svg`)
SVG avec 331 `<path>` identifiés, un par streamline intégrée depuis le champ vectoriel U/V.
Format d'id : `oscar_NNNN_u:{u:.4f}_v:{v:.4f}_spd:{spd:.4f}`
Couleur par vitesse selon gradient earth.nullschool (bleu nuit → rouge).
Épaisseur de trait selon intensité (3 niveaux).
Flèches décoratives dans un groupe `arrows` séparé, non lues par le script de conversion.

### oscar_to_sea_data.py

Fichier :
`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\oscar_to_sea_data.py`

Lit `courants-oscar.svg` (déformé ou non), parse les `id` pour récupérer les données physiques, génère un buffer polygonal autour de chaque centerline, et exporte `sea-data-oscar.js` au format `SEA_CURRENT_GEOMETRY` (dictionnaire `{id: {zone, centerline, directions, speedKnot, type, ...}}`).

Paramètres principaux :
- `--largeur-px 160` : demi-largeur du buffer de zone
- `--seuil-knot 0.10` : vitesse minimale pour inclure un courant

Résultat sur le SVG non déformé : 311 courants retenus sur 331.

### gen_anchors.py / anchors.json

Fichier :
`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\anchors.json`

70 ports extraits de `villes-data.js` avec leurs coordonnées géographiques réelles (WGS84) associées manuellement. Utilisé par `gen_oscar_data.py` pour le géoréférencement lat/lon → pixels carte.

Le résidu de géoréférencement reste significatif (carte Jaillot non conforme à une projection standard). La correction était prévue par déformation manuelle du SVG dans Inkscape avant passage dans `oscar_to_sea_data.py`.

## Workflow prévu (non finalisé)

```
NetCDF OSCAR (Copernicus)
        ↓
gen_oscar_data.py
        ↓
courants-oscar.svg  (paths identifiés, espace pixel approché)
        ↓
Déformation manuelle dans Inkscape
(calage sur carte Jaillot par enveloppe ou outil équivalent)
        ↓
courants-oscar-deforme.svg
        ↓
oscar_to_sea_data.py
        ↓
sea-data-oscar.js
        ↓
Import dans Zone Editor → sea-data.js
```

## Raisons d'abandon (provisoire)

Le workflow produit un grand nombre de courants (300+) avec des zones rectangulaires générées algorithmiquement et sans relation avec la mosaïque de navigation attendue par le moteur. Le travail de validation, fusion, ajustement des zones et centerlines résultantes n'est pas sensiblement moindre que le dessin vectoriel manuel de référence.

La déformation du SVG dans Inkscape pour coller à la carte Jaillot reste un obstacle non résolu : l'outil `Path > Envelope` d'Inkscape ne s'applique pas facilement à un groupe de 300+ paths. QGIS permettrait un géoréférencement correct par points de contrôle, mais représente une courbe d'apprentissage distincte.

Les formats "déjà traités" issus de simulateurs de navigation (Virtual Regata, Expedition, etc.) sont propriétaires ou en GRIB2 temps réel — non exploitables directement pour notre usage statique.

## État des fichiers à ce stade

Fichiers hors dépôt Git (non commités, non supprimés) :

```
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_oscar_data.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\oscar_to_sea_data.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_anchors.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\inspect_anchors.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\extract_ports.py
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\anchors.json
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\cmems_mod_glo_phy_my_0.083deg-climatology_P1M-m_1782715143527.nc
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\courants-oscar.svg
C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\Sources\sea-data-oscar.js
```

Fichier dans le dépôt, non suivi (non commité) :

```
pavillon-noir/js/oscar-grid.js
```

`oscar-grid.js` ne doit pas être intégré au dépôt à ce stade. Il peut être conservé localement comme référence ou supprimé sans impact sur le moteur.

Aucun fichier de production (`sea-data.js`, `navigation-jaillot.js`, `carte.js`, `zone-editor.html`) n'a été modifié pendant cette session.

## Suite décidée en fin de session

La piste est reprise sous une architecture différente — abandonnant le modèle
rubans/centerlines/zones polygonales au profit d'une **grille cellulaire régulière 50×50 px**.

### Décisions d'architecture

- `oscar_to_sea_data.py` est abandonné — le modèle zones/centerlines est inadapté.
- `SEA_CURRENTS`, `SEA_NAV_ZONES` et tout le système de courants par rubans sont supprimés
  de `navigation-jaillot.js`.
- Le moteur interrogera directement `OSCAR_GRID` : lookup O(1) par clé de cellule.
- Chaque cellule porte `dirDeg` et `speedKnot`. Règle : vecteur de speedKnot le plus
  élevé parmi tous les paths passant dans la cellule gagne.
- `navigation-jaillot.js.old` copié dans
  `C:\AI\Site Pavillon Noir\pavillon-noir\Archives\` avant toute modification.
- Aucun fichier de production modifié pendant cette session.

### Nouveaux scripts prévus pour session 60

- `gen_oscar_data.py` modifié : SVG sincère en espace lat/lon, sans anchors, sans export_js.
- `gen_oscar_grid.py` (nouveau) : lit le SVG déformé → `oscar-grid.js` format cellulaire.

### Feuille de route détaillée

Voir : `chantier_oscar_grille.md` (produit en fin de session 59, à placer dans le projet).

## Prochaine reprise — session 60

Lire `chantier_oscar_grille.md` et exécuter dans l'ordre :

1. Modifier `gen_oscar_data.py` (SVG sincère, supprimer anchors et export_js)
2. Créer `gen_oscar_grid.py`
3. Tester la chaîne sur le SVG non déformé
4. Réécrire `navigation-jaillot.js` (suppressions + ajout lookup OSCAR_GRID)
5. Vérifier syntaxe et tester en live
6. La déformation Inkscape est un travail manuel hors session Claude
