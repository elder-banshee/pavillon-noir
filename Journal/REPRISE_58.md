# REPRISE_58 - Refonte maritime, oceanBounds et génération sea-data

## Contexte

Session consacrée à la refonte du modèle des courants et des zones maritimes.

Le point de départ était l'insatisfaction sur les courants dessinés dans le SVG : les rubans découpés automatiquement, les priorités et les variations locales de vitesse rendaient le modèle fragile, difficile à maintenir et parfois incohérent avec l'intention cartographique.

Objectif retenu : préparer un moteur maritime plus explicite, compatible avec l'ancien jeu de données tant que la nouvelle mosaïque SVG n'est pas prête.

## Décisions d'architecture

- Les polygones de mer deviennent une mosaïque de zones navigables explicites.
- Les centerlines sont les axes de direction des courants.
- Une zone porte les propriétés locales, notamment `type` et `speedKnot`.
- Un courant n'existe effectivement que lorsqu'une centerline traverse une vraie zone de mosaïque.
- Une zone sans centerline est une zone calme normale et ne doit pas être signalée.
- Les recouvrements entre zones sont des erreurs.
- Les interstices dans la mosaïque sont des avertissements, car ils peuvent devenir des obstacles invisibles si aucune règle de secours n'existe.
- `oceanBounds` n'est pas une grande zone de courant et ne doit pas être traité comme un carreau de mosaïque.
- `oceanBounds` est l'emprise maritime globale et le filet de sécurité calme.
- Un point situé dans `oceanBounds` mais hors mosaïque reste navigable, sans courant.
- Une centerline sans vraie zone explicite reste une erreur, même si elle est dans `oceanBounds`.

Conséquence importante : `SEA_NAV_ZONES` reste réservé aux pièces de mosaïque portant les attributs de navigation. `SEA_OCEAN_BOUNDS` est une emprise séparée.

## Contrat de données retenu

Champs conservés ou privilégiés :

- `id`
- `zone`
- `centerline`
- `directions`
- `speedKnot`
- `visibiliteNav`
- `closed`
- `label`
- `zoneSource`
- `type`

Champs à supprimer progressivement après migration :

- `speedKmh`
- `speedSegments`
- `attenuationMinCote`
- `priorite`
- `force`
- `vitesseKmH`
- `vitesseSegments`
- `priority`

`speedKnot` devient le nom canonique. `speedKnots` reste toléré comme alias de compatibilité dans quelques chemins runtime/UI, avec repères TODO pour retrait futur.

## Générateur sea-data

Fichier concerné hors dépôt Git :

- `C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\gen_sea_data.py`

Évolutions principales :

- Ajout de l'option `--report`.
- Ajout de l'option `--ocean-bounds`.
- Auto-détection d'un SVG `oceanBounds*.svg` dans `Sources SVG` si aucun chemin explicite n'est fourni.
- Génération d'un rapport `sea-data.report.txt`.
- Génération maintenue de l'export intermédiaire `sea-data-generated.js`.
- Export dédié de `SEA_OCEAN_BOUNDS_GEOMETRY` et `SEA_OCEAN_BOUNDS`.
- Export de `SEA_NAV_ZONES_EXPLICITES = true` dans le fichier généré.
- Export des métadonnées de zones avec `speedKnot`.

Validations ajoutées ou renforcées :

- recouvrements entre zones ;
- données obligatoires manquantes sur les zones, notamment `type` et `speedKnot` ;
- valeurs invalides ;
- centerlines qui ne traversent aucune zone explicite ;
- interstices dans `oceanBounds`, signalés comme avertissements et non comme erreurs bloquantes.

Le SVG `oceanBounds-01.svg` a été placé dans :

- `C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Sources SVG\oceanBounds-01.svg`

Il est lourd mais exploitable. Le temps de génération est plus long, environ 30 secondes lors du test observé.

## Rapport généré

Fichier généré :

- `C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation\sea-data.report.txt`

État actuel du rapport avec l'ancien `courants.svg` :

- source SVG : `courants.svg`
- ocean bounds : `oceanBounds-01.svg`
- zones navigables : 35
- centerlines de courant : 26
- hauts-fonds : 5
- ocean bounds : 2 formes
- erreurs : 63
- avertissements : 14

Ces erreurs sont attendues à ce stade, car le SVG principal est encore l'ancien modèle :

- recouvrements liés aux anciens rubans ;
- absence de `type` et `speedKnot` sur les zones ;
- grands interstices signalés dans `oceanBounds`.

Le rapport rappelle explicitement :

- les zones calmes non traversées par une centerline ne sont pas signalées ;
- `oceanBounds` est une emprise/fallback calme, pas une zone de courant ni une pièce de mosaïque ;
- les interstices dans `oceanBounds` restent navigables en calme par défaut, mais sont signalés.

## Runtime Jaillot

Fichier concerné :

- `C:\AI\Site Pavillon Noir\pavillon-noir\js\navigation-jaillot.js`

Évolutions principales :

- Lecture possible de `SEA_OCEAN_BOUNDS`.
- Ajout d'un index/cache pour l'emprise maritime.
- `pointDansZoneNavigation` peut désormais fonctionner en mode explicite avec `oceanBounds`.
- Si le mode explicite est actif et que `SEA_OCEAN_BOUNDS` existe, la navigation est autorisée dans l'emprise maritime.
- Si aucune zone explicite ne couvre le point, `courantEnPoint` retourne `null`.
- `oceanBounds` ne devient donc jamais une zone de courant.
- `zoneNavigationEnPoint` continue de retourner seulement les vraies zones de mosaïque.
- Les diagnostics de `modeNavigationMaritime()` exposent désormais des informations sur le mode explicite, le fallback legacy, le nombre de zones et le nombre d'ocean bounds.
- L'invalidation de cache vide aussi le cache ocean bounds.

Des repères `TODO PN-SEA-EXPLICIT` ont été posés autour des chemins de compatibilité à supprimer quand la nouvelle donnée sera exclusive.

Point de vigilance : relire certains libellés de commentaires autour de la mosaïque/oceanBounds pour s'assurer qu'ils reflètent bien la distinction finale : oceanBounds est une emprise et non un carreau de mosaïque.

## Données runtime sea-data

Fichier concerné :

- `C:\AI\Site Pavillon Noir\pavillon-noir\js\sea-data.js`

Évolutions principales :

- Le fichier runtime réel reste en compatibilité avec `SEA_NAV_ZONES_EXPLICITES = false`.
- Ajout de structures vides pour `SEA_OCEAN_BOUNDS_GEOMETRY` et `SEA_OCEAN_BOUNDS`.
- Conservation du chemin legacy qui convertit les anciens rubans de courant en zones de navigation.
- Ajout de `speedKnot` à côté de l'alias legacy `speedKnots`.
- Repères TODO placés pour retirer les conversions legacy plus tard.

Important : le vrai runtime n'a pas encore basculé sur le nouveau fichier généré. Cette étape devra attendre un SVG mosaïque réellement prêt.

## Zone Editor

Fichier concerné :

- `C:\AI\Site Pavillon Noir\pavillon-noir\tools\zone-editor.html`

Évolutions principales :

- L'export v2 préserve `SEA_OCEAN_BOUNDS` si ces données sont chargées.
- L'export écrit `SEA_OCEAN_BOUNDS_GEOMETRY` et `SEA_OCEAN_BOUNDS`.
- L'export écrit `speedKnot` dans `SEA_NAV_ZONE_META`.
- `updateCurrentSpeed` écrit `speedKnot` et nettoie les anciens champs de vitesse.
- `currentBaseSpeedKnots` préfère `speedKnot`, puis les alias legacy.
- Le fallback km/h et les anciens segments de vitesse restent marqués comme compatibilité à supprimer.

## Carte

Fichier concerné :

- `C:\AI\Site Pavillon Noir\pavillon-noir\js\carte.js`

Évolutions principales :

- L'affichage maritime privilégie `speedKnot` plutôt que `speedKnots`.
- Les styles, libellés, espacements de flèches et métadonnées du panneau utilisent le nouveau nom canonique quand il est disponible.

## Vérifications effectuées

Commandes exécutées pendant la session :

```powershell
py -m py_compile ".\Accessoires site pavillon noir\Outils generation\gen_sea_data.py"
py ".\Accessoires site pavillon noir\Outils generation\gen_sea_data.py" --output ".\Accessoires site pavillon noir\Outils generation\sea-data-generated.js" --report ".\Accessoires site pavillon noir\Outils generation\sea-data.report.txt"
node --check ".\Accessoires site pavillon noir\Outils generation\sea-data-generated.js"
node --check .\js\navigation-jaillot.js
node --check .\js\sea-data.js
node --check .\js\carte.js
node -e "const fs=require('fs'); const html=fs.readFileSync('./tools/zone-editor.html','utf8'); const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].trim()).filter(Boolean); if(!scripts.length) throw new Error('script inline introuvable'); new Function(scripts[scripts.length-1]); console.log('zone-editor inline script syntax OK');"
git diff --check -- js/navigation-jaillot.js js/sea-data.js js/carte.js tools/zone-editor.html
```

Résultats :

- compilation Python OK ;
- génération `sea-data-generated.js` OK ;
- rapport `sea-data.report.txt` généré ;
- checks JavaScript OK ;
- script inline de Zone Editor OK ;
- `git diff --check` OK sur les fichiers modifiés.

Un audit texte avait aussi été lancé dans la session précédente/proche :

```powershell
node .\tools\audit-text-integrity.js
```

Résultat observé : `0 erreur(s), 61 avertissement(s)`, les avertissements restants concernant des fins de ligne ou newlines finaux préexistants.

## État du dépôt

Au moment de rédiger cette reprise :

```text
?? js/oscar-grid.js
```

`js/oscar-grid.js` est non suivi et n'appartient pas au chantier maritime documenté ici. Il ne faut pas le supprimer ni le modifier sans consigne explicite.

Les fichiers générés ou modifiés hors dépôt Git se trouvent dans :

- `C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Outils generation`
- `C:\AI\Site Pavillon Noir\Accessoires site pavillon noir\Sources SVG`

## Prochaine reprise recommandée

1. Dessiner ou générer le nouveau SVG mosaïque.
2. Définir précisément comment `type` et `speedKnot` sont renseignés dans le flux SVG/éditeur.
3. Relancer le générateur et inspecter `sea-data.report.txt`.
4. Corriger les recouvrements et interstices importants signalés.
5. Quand le rapport devient sain, promouvoir `sea-data-generated.js` vers `pavillon-noir\js\sea-data.js`.
6. Basculer alors le runtime réel vers le mode explicite.
7. Supprimer progressivement les chemins `TODO PN-SEA-EXPLICIT` :
   - conversion legacy rubans vers zones ;
   - alias `speedKnots` ;
   - fallbacks `speedKmh` / `vitesseKmh` ;
   - `speedSegments` / `vitesseSegments` ;
   - ancienne atténuation côtière automatique ;
   - ancien repli "navigation partout hors terre".

À garder en tête : oceanBounds est le cadre et le filet de sécurité calme. La mosaïque explicite reste la source des zones typées et des vitesses de courant.
