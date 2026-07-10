# REPRISE_43 - Courants SVG polygonaux et attenuation cotiere

## Contexte
Suite de l'integration des courants dans le calculateur de route Jaillot.
Objectifs traites pendant cette session :
- attenuation automatique des courants pres des cotes ;
- prise en compte des hauts-fonds/bancs de sable ;
- passage du flux de travail des courants vers des polygones SVG dessines dans Illustrator, avec centerpaths conserves pour le sens et les fleches ;
- simplification de l'editeur Courants.

## Navigation Jaillot
- `pavillon-noir/js/navigation-jaillot.js`
  - Ajout de `CONFIG.rayonAttenuationCourantNm: 30`.
  - Attenuation lineaire du courant selon la distance a la cote :
    - `d <= 30 nm` -> coefficient `d / 30` ;
    - `d > 30 nm` -> coefficient `1`.
  - Distance a la cote derivee de `ZONES_DATA`, avec cache et index spatial.
  - Les hauts-fonds `SEA_SHOALS` interrompent les courants et bloquent les navires dont la categorie de taille est `> 3`.
  - Les hauts-fonds ne generent pas de marge cotiere.
  - Support du format de zone multi-polygones `zone: { polygons: [...] }`.
  - Exception Courant de Floride : attenuation cotiere minimale `0.6` via `attenuationMinCote`.

## Generateur courants
- `Accessoires site pavillon noir/Outils generation/gen_sea_data.py`
  - Le script lit maintenant `courants-01.svg` depuis `Accessoires site pavillon noir/Sources SVG`.
  - Les objets SVG `..._z_rN` sont traites comme zones polygonales de courant, pas comme centerpaths.
  - Les objets sans `z` restent les centerpaths servant au sens, aux fleches et aux troncons.
  - Les zones SVG produisent `zoneSource: 'svg'` dans `sea-data.js`.
  - Les `MultiPolygon` Shapely sont conserves au lieu de ne garder que le plus grand morceau.
  - `SEA_SHOALS` est exporte pour les bancs de sable / hauts-fonds.
  - Le courant principal `guyanes_gulf_stream_r1` conserve ses troncons :
    - Gulf Stream : segments 0-39, 9 km/h ;
    - Courant de Floride : segments 40-67, 6.5 km/h, `attenuationMinCote: 0.6` ;
    - Courant des Caraibes : segments 68-161, 3 km/h ;
    - Courant des Guyanes : segments 162-184, 2.5 km/h.
  - Les alias manuels ne bloquent plus les correspondances exactes : par exemple `nord_hispaniola_1_r2` -> `nord_hispaniola_1_z_r2` et `nord_hispaniola_2_r2` -> `nord_hispaniola_2_z_r2`.
  - `tourbillon_texan_sud_r4` peut utiliser plusieurs fragments de zone pour un seul centerpath.

Commande de generation depuis `C:\AI\Site Pavillon Noir` :

```powershell
python ".\Accessoires site pavillon noir\Outils generation\gen_sea_data.py" courants-01.svg --output ".\pavillon-noir\js\sea-data.js"
```

## Editeur Courants
- `pavillon-noir/tools/zone-editor.html`
  - Les zones de courant SVG sont visibles mais non selectionnables.
  - La selection se fait par les centerpaths, dessines au-dessus des zones.
  - Une ligne transparente epaisse (~18 px) sert de zone de clic pour faciliter la selection.
  - Le bouton `Decoupe` a ete retire : les decoupes sont gerees dans Illustrator + Python/Shapely.
  - Le champ `Largeur ruban` a ete retire : l'epaisseur est maintenant definie en amont par les polygones SVG.
  - Le champ `Priorite` reste editable pour piloter la couleur de rendu.
  - Les vitesses globales ou par troncon restent editables.
  - Fallback editeur : si `guyanes_gulf_stream_r1` ne contient pas encore `speedSegments`, les 4 troncons par defaut sont injectes en memoire pour edition.
  - Export editeur compatible avec `SEA_SHOALS`, `zoneSource: 'svg'`, `attenuationMinCote` et `zone: { polygons: [...] }`.

## Decisions
- Le travail de geometrie des courants se fait maintenant dans Illustrator et `gen_sea_data.py`.
- L'editeur Courants devient un outil de parametrage : priorite, sens, vitesses.
- Les centerpaths sont des pistes maitresses pour les directions, pas des sources d'epaisseur.
- Si une zone fusionnee doit suivre plusieurs centerpaths avec directions tres differentes, il vaut mieux la redecouper dans Illustrator en zones separees.

## Verification effectuee
- `python -m py_compile ".\Accessoires site pavillon noir\Outils generation\gen_sea_data.py"` OK.
- Generation temporaire depuis `courants-01.svg` OK, puis fichier temporaire supprime.
- `node --check` sur le fichier temporaire genere OK.
- Verification des scripts inline de `tools/zone-editor.html` OK.
- `node --check .\js\navigation-jaillot.js` OK.
- `git diff --check -- .\tools\zone-editor.html` OK.

## Etat observe en fin de session
- Dernier `git status --short` lance dans `pavillon-noir` : aucune ligne sortie dans le terminal.
- Le script Python est hors du depot Git imbrique `pavillon-noir`; penser a le suivre/verifier separement.

## Prochaines etapes recommandees
1. Relancer la generation reelle de `pavillon-noir/js/sea-data.js` avec la commande ci-dessus.
2. Recharger l'editeur Courants et verifier :
   - selection confortable des centerpaths ;
   - affichage des 4 troncons de `guyanes_gulf_stream_r1` ;
   - absence de zones `..._z_rN` traitees comme courants a fleches.
3. Renseigner/ajuster les vitesses des autres courants dans l'editeur.
4. Tester quelques routes Jaillot proches des cotes, dans les hauts-fonds et dans le Courant de Floride.
