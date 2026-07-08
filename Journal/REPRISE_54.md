# REPRISE_54 - Pavillon Noir - Courants SVG, hauts-fonds, workflow generation

Date : 2026-06-26

## Etat general

Session consacree au workflow de regeneration des courants et hauts-fonds depuis
le SVG source `courants.svg`, avec clarification des README, correction de
`gen_sea_data.py`, et petits ajustements de `tools/zone-editor.html`.

Le depot actif reste :

`C:\AI\Site Pavillon Noir\pavillon-noir`

Les accessoires hors depot concernes sont dans :

`C:\AI\Site Pavillon Noir\Accessoires site pavillon noir`

---

## 1. Workflow documente

README mis a jour :

- `Accessoires site pavillon noir\Outils generation\README.txt`
- `Accessoires site pavillon noir\Sources SVG\README.txt`

Le workflow recommande est maintenant :

1. Ouvrir CMD dans `Accessoires site pavillon noir\Outils generation`.
2. Lancer :

```cmd
py gen_sea_data.py --output sea-data.generated.js
```

3. Ouvrir `pavillon-noir\tools\zone-editor.html`.
4. Section `Courants maritimes` -> `Charger un export geometrique`.
5. Importer `sea-data.generated.js`.
6. Verifier visuellement.
7. Exporter `sea-data.js corrige`, puis remplacer `pavillon-noir\js\sea-data.js`.

Le README explique aussi pourquoi la commande longue ne doit pas etre lancee
depuis le dossier `Outils generation`, sinon CMD cherche un chemin inexistant
et renvoie `No such file or directory`.

---

## 2. Sources SVG

Le SVG actif est :

`Accessoires site pavillon noir\Sources SVG\courants.svg`

L'ancien fichier `courants-01.svg` a ete renomme :

`Accessoires site pavillon noir\Sources SVG\archive-courants.svg`

But : eviter de prendre l'ancien SVG pour la source courante.

`courants.svg` doit rester la source complete de reference : courants, zones
`_z_rN`, centerpaths, hauts-fonds. Un SVG partiel avec seulement de nouveaux ids
peut etre importe pour un ajout ponctuel, mais la source complete doit ensuite
etre mise a jour.

---

## 3. `gen_sea_data.py`

Fichier :

`Accessoires site pavillon noir\Outils generation\gen_sea_data.py`

Corrections principales :

- fallback mis a jour vers `archive-courants.svg` si `courants.svg` manque ;
- regroupement des hauts-fonds par id logique parent ;
- preservation du cas `banc_de_jamaique` contenant `banc_de_jamaique_a` et
  `banc_de_jamaique_b` ;
- export d'un seul id `banc_de_jamaique`, ce qui preserve les metadonnees
  historiques `Banc de Pedro` ;
- preservation des petits polygones fermes par un minimum de segments ;
- reglage haute fidelite global des contours SVG.

Reglages actuels :

```py
SVG_POLYGON_SAMPLE_PX = 2
SVG_POLYGON_MIN_SEGMENTS = 12
EXPORT_SIMPLIFY_TOLERANCE_PX = 0.5
```

Repere de taille documente dans le README :

```text
8 / 2   -> environ 156 Ko
4 / 1   -> environ 190 Ko
2 / 0.5 -> environ 234 Ko
```

Le fichier temporaire actuel :

`Accessoires site pavillon noir\Outils generation\sea-data.generated.js`

taille observee : environ `233939` octets.

---

## 4. `tools/zone-editor.html`

Fichier modifie dans le depot :

`pavillon-noir\tools\zone-editor.html`

Changements :

- la pile `Annuler` sauvegarde aussi `currentsWorkingCopy` et
  `shoalsWorkingCopy` ;
- `Annuler` restaure maintenant la selection courant/haut-fond ;
- `Annuler` rerend la couche courants si elle existe ;
- le bouton `Supprimer` fonctionne aussi sur un haut-fond selectionne ;
- inversion de courant ajoute maintenant une entree dans l'historique
  `Annuler`.

Limite : il n'y a pas de bouton `Retablir`.

---

## 5. Etat Git et fichiers hors depot

Etat Git du depot `pavillon-noir` en fin de session :

```text
 M tools/zone-editor.html
```

Les modifications suivantes sont hors depot Git, dans `Accessoires site pavillon noir` :

- `Outils generation\gen_sea_data.py`
- `Outils generation\README.txt`
- `Outils generation\sea-data.generated.js`
- `Sources SVG\README.txt`
- `Sources SVG\archive-courants.svg` cree par renommage de l'ancien
  `courants-01.svg`

`svg_to_currents.py` est toujours present mais considere comme ancien outil.
Il n'a pas ete supprime.

---

## 6. Validations effectuees

Depuis `C:\AI\Site Pavillon Noir` :

```cmd
py -m py_compile "Accessoires site pavillon noir\Outils generation\gen_sea_data.py"
```

Depuis `Accessoires site pavillon noir\Outils generation` :

```cmd
py gen_sea_data.py --output sea-data.generated.js
```

Depuis `C:\AI\Site Pavillon Noir\pavillon-noir` :

```cmd
node --check .\js\carte.js
node --check .\js\navigation-jaillot.js
node --check .\js\carte-mobile.js
```

Controle syntaxique du script inline de `tools/zone-editor.html` :

```cmd
node -e "const fs=require('fs');const s=fs.readFileSync('tools/zone-editor.html','utf8');const scripts=[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);for(const code of scripts)new Function(code);console.log('checked '+scripts.length+' inline script block(s)');"
```

Resultat observe :

```text
checked 1 inline script block(s)
```

---

## 7. Points de reprise recommandes

1. Importer `sea-data.generated.js` dans `tools/zone-editor.html`.
2. Verifier visuellement :
   - contours de courants autour des cotes et iles ;
   - `banc_de_jamaique` / `Banc de Pedro` ;
   - presence du petit polygone `banc_de_jamaique_b` dans l'objet logique
     `banc_de_jamaique` ;
   - hauts-fonds de Cuba, Bahamas, Porto Rico.
3. Exporter `sea-data.js corrige`.
4. Remplacer `pavillon-noir\js\sea-data.js`.
5. Refaire :

```cmd
node --check .\js\sea-data.js
node --check .\js\navigation-jaillot.js
git diff -- .\js\sea-data.js
```

6. Tester visuellement l'overlay maritime dans la carte.

---

## 8. Decision long terme discutee

Idee examinee : remplacer `Charger un export geometrique` par `Importer SVG`
directement dans `zone-editor.html`.

Conclusion :

- impossible en HTML statique pur tant que le generateur depend de Python /
  Shapely ;
- options possibles :
  - mini-serveur local Python ;
  - portage JS du generateur ;
  - conserver le workflow Python actuel.

Decision de prudence : conserver le workflow Python pour l'instant. Le portage JS
serait faisable mais pas prioritaire, car il faudrait remplacer Shapely par des
bibliotheques JS de geometrie polygonale et revalider tous les cas complexes.

---

## 9. Correctif tardif : jet_sud_1 / jet_sud_2

Probleme signale apres creation de la reprise : `jet_sud_1_z_r3` et
`jet_sud_2_z_r3` avaient leurs geometries melangees. Les deux centerpaths etaient
valides, mais les deux courants recuperaient les memes fragments de zone.

Cause identifiee dans `gen_sea_data.py` :

- `zone_ids_for_centerline()` compactait `jet_sud_1_r3` en `jet_sud_r3` avant la
  recherche des fragments ;
- la recherche par prefixe prenait donc tous les ids `jet_sud_*_z_r3`, y compris
  ceux de l'autre courant.

Correction appliquee :

- la recherche de fragments utilise maintenant le base id original (`jet_sud_1`,
  `jet_sud_2`) ;
- l'export genere :
  - `jet_sud_1_r3` -> `jet_sud_1_a_z_r3`, `jet_sud_1_b_z_r3` ;
  - `jet_sud_2_r3` -> `jet_sud_2_a_z_r3`, `jet_sud_2_ba_z_r3`,
    `jet_sud_2_bba_z_r3`, `jet_sud_2_bbb_z_r3`.

Correction associee dans `js/carte.js` :

- `normaliserAnneauxMaritimes()` accepte maintenant les polygones sous forme
  `{ exterior, holes }` a l'interieur de `zone.polygons`.
- Sans cette correction, certains multi-polygones exportes pouvaient etre filtres
  et ne pas apparaitre dans l'overlay maritime, meme avec `visibiliteNav: 3`.

Actions effectuees :

- regeneration de `Accessoires site pavillon noir\Outils generation\sea-data.generated.js` ;
- remplacement cible des blocs `SEA_CURRENT_GEOMETRY` et `SEA_SHOAL_GEOMETRY`
  dans `pavillon-noir\js\sea-data.js`, sans remplacer les metadonnees manuelles.

Validation observee :

```text
jet_sud_1_r3 polys 2 metaNav 3
jet_sud_2_r3 polys 5 metaNav 3
```

---

## 10. Import geometrique plus conservateur

Demande supplementaire : eviter de recorriger le sens des courants apres chaque
nouvel export SVG.

Modification appliquee dans `tools/zone-editor.html` :

- si un courant importe a deja un id existant dans la copie de travail,
  l'import ne remplace plus que `closed`, `zoneSource` et `zone` ;
- `centerline` et `directions` existantes sont conservees, donc une inversion
  ou correction de sens deja faite dans l'editeur reste prioritaire ;
- les metadonnees deja separees (`label`, `priorite`, `force`, `speedKmh`,
  `speedSegments`, `visibiliteNav`, etc.) restent egalement conservees ;
- si l'id est nouveau, l'import reste complet : centerline, directions et zone
  sont importees, avec les metadonnees par defaut de l'editeur.

Pour les hauts-fonds, l'import continue de remplacer seulement `zone` pour un id
existant.

Correction immediate apres test utilisateur :

- le remplacement manuel precedent de `pavillon-noir\js\sea-data.js` avait
  remplace tout `SEA_CURRENT_GEOMETRY`, donc aussi `centerline` et `directions` ;
- l'import conservateur preservait alors des directions deja modifiees dans le
  fichier de reference charge par l'editeur ;
- `centerline` et `directions` ont ete restaures depuis la version Git de
  reference pour tous les ids existants, en conservant les nouveaux `zone` issus
  de l'export corrige.

Validation ajoutee :

```text
directionDiffs: []
centerDiffs: []
changedExistingDirectionOrCenterline: []
```
