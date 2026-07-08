# Notice de reprise — Pavillon Noir, site de campagne
*Session 23 — recherche fantôme, icônes villes, écartement paires, flyTo stable*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier. Desktop Commander (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) est utilisé comme outil principal d'édition directe en session.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`), parchemin (`--parchment: #f2e8d5`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques), Crimson Text (corps)
- **Ton** : pas de couleurs vives, animations discrètes, borders fines

---

## Gestion des sources — ordre de priorité

1. **Connecteur GitHub (`main`)** — source principale. Claude le consulte en début de session.
2. **Fichiers du projet** (REPRISE_N.md) — contexte de session et fallback.
3. **Desktop Commander** (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) — édition directe en session.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement, chercher à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Chantiers accomplis en session 23

### 1. Recherche fantôme — corrections

**Problème 1 — fantôme désynchronisé avec le volet :** `getSuggestion()` avait sa propre logique de tri indépendante du volet, causant des propositions incohérentes.
**Correction :** `getSuggestion()` supprimée. Le fantôme lit maintenant `dataset.nom` du premier `<li>` du volet après rendu — source unique de vérité. `data-nom="${escapeHtml(nom)}"` ajouté sur chaque `<li>`.

**Problème 2 — fantôme non mis à jour lors de la navigation clavier :** ArrowDown/ArrowUp ne mettaient pas à jour `fantome.textContent`.
**Correction :** dans les blocs ArrowDown/ArrowUp, `fantome.textContent` est mis à jour avec le nom de l'item sélectionné.

**Problème 3 — Enter après ArrowDown ne validait pas :** `suggestionActive.click()` ne déclenchait pas fiablement les handlers DOM.
**Correction :** le bloc Enter lit directement `dataset.id`, `dataset.type`, `dataset.nom` depuis `suggestionActive` et appelle `zoomerVille()` ou `isolerTerritoire()` directement, sans passer par `.click()`.

**Problème 4 — fantôme persistant après validation :** ajout de `if (fantome) fantome.textContent = ''` dans le click handler des `<li>` et dans le bloc Enter.

### 2. Icônes villes — simplification couleurs

**Suppression de la distinction capitale/ville standard :**
- Couleur repos : `#7a8c7a` (vert-de-gris) — toutes villes confondues
- Couleur survol (`estActive`) : `#9aae9a`
- Nassau/pirate : `#0e0c09` / trait `#f2e8d5` — inchangé
- Mode isolé : fond transparent + contour gold — inchangé
- La distinction capitale/standard reste dans le volet (typo `--gold` pour les capitales) et dans le mode isolé, mais disparaît des icônes

**Nettoyage `estCapitale` :** paramètre supprimé de la signature de `villeSVG()` et de tous ses appels (`renderVilles`, `majTailleIconesVilles`, `setIconeVilleActive`, `setIconeVilleIsoleeHover`, `zoomerVille`). `estPirate` conservé car il conditionne encore `fond` et `couleurTrait`.

**Icône fort :** `couleurCroix` simplifiée — `estIsole ? '#c8973a' : '#e8ede8'` (blanc cassé légèrement teinté vert, résultat de la superposition d'un blanc à 0.9 d'opacité sur `#7a8c7a`).

### 3. Animation `zoomerVille` — icône sans cadre pendant le vol

**Paramètre `sansRecadre`** ajouté à `villeSVG()`. Quand `true`, le `<rect>` de fond est omis du SVG.

**Correction dérive pendant flyTo :** les étapes blanc et gold-light n'appellent plus `setIcon()` — elles modifient directement les attributs SVG du marqueur existant via `getElement().querySelector('svg')`. `setIcon()` recrée le nœud DOM, ce qui causait une dérive visible pendant le vol car Leaflet ne repositionnait pas immédiatement le nouvel élément.

Séquence animation finale :
```
t+0    : modifier SVG existant (stroke/fill → blanc) — PAS de setIcon
t+400  : modifier SVG existant (stroke/fill → #e2c97e gold-light) — PAS de setIcon
t+800  : flyTo (1.4s, easeLinearity 0.25)
moveend: setIcon() gold-light à tailleArrivee (vol terminé, DOM recréé sans problème)
t+120  : setIcon() gold standard
```

### 4. Icône ville active — désactivation correcte

**Problème :** passer d'une ville active à un territoire (ou une autre ville) laissait l'icône précédente en mode "active".

**Corrections :**
- `ouvrirPanneau()` (territoire) : désactive et rapproche l'icône de la ville précédemment active avant de nullifier `villeActive`
- `ouvrirPanneauVille()` : désactive et rapproche l'icône de la ville précédente avant d'activer la nouvelle
- `fermerPanneau()` et `fermerPanneauVille()` : appellent `rapprocherVille()` en plus de `setIconeVilleActive(false)`

### 5. Écartement des paires d'icônes — architecture finale

**6 paires détectées** (seuil 16px entre centres au zoom min) :
- Kingston / Spanish Town
- Basseterre / Fort Brimstone Hill
- Saint John's / English Harbour
- Saint-Pierre / Fort Royal
- Carthagène / Fort San Luis
- Portobelo / Fort San Lorenzo

**Calcul à l'init** : `calculerPairesChevauchement()` appelé dans le `setTimeout` post-`fitBounds`. Stocke pour chaque paire : `{ idA, idB, vx, vy, latlngA, latlngB }`.

**Architecture DOM retenue** : animation sur `marker.getElement()` directement (l'élément conteneur Leaflet, stable). Raison : `setIcon()` recrée entièrement le DOM intérieur — tout verrou ou référence sur un élément intérieur est invalidé à chaque hover. L'élément conteneur Leaflet, lui, est stable entre les `setIcon`.

**`lireTranslate3d(el)`** : extrait uniquement le `translate3d(...)` Leaflet par regex — ignore le `translate(...)` qu'on a pu y concaténer.
```javascript
const m = el.style.transform.match(/translate3d\([^)]+\)/);
return m ? m[0] : 'translate3d(0px,0px,0px)';
```

**`ecarterVille(villeId)`** :
- Distance pixel actuelle au zoom courant via `carte.latLngToContainerPoint()`
- `amplitude = (26 - distActuelle) / 2` — skip si `<= 0`
- `duree = Math.round(amplitude * 2 * 40)` — 40ms par 2px
- Écrit `translate3d(...) translate(dx, dy)` avec transition sur le conteneur
- Stocke `{ dxA, dyA, dxB, dyB, duree }` dans `ecartementsActifs[cle]`

**`rapprocherVille(villeId)`** :
- Vérifie `ecartementsActifs[cle]` — absent → ne fait rien
- Écrit `translate3d(...) translate(0px, 0px)` avec transition
- `setTimeout(duree)` : relit `lireTranslate3d()` et nettoie à `translate3d(...)` seul — évite le transform résiduel qui causerait une dérive au zoom suivant

**Handler `zoom`** : réapplique `dxA/dyA/dxB/dyB` sans transition pour les paires dans `ecartementsActifs`.

**Timers `mouseoutTimers`** : indexés par clé de paire ET par ville individuelle. Le `mouseover` annule tous les timers de la ville survolée et de ses voisines — permet de passer de Fort Royal à Saint-Pierre sans que le gap se referme. Débounce : 550ms.

### 6. Tooltips orphelins — correction globale

Deux handlers dans `initCarte()` :
- `carte.getContainer().addEventListener('mouseleave', ...)` 
- `carte.on('mouseout', ...)`

Les deux font `carte.eachLayer(l => { if (l.getTooltip?.() && l.isTooltipOpen?.()) l.closeTooltip(); })`.

---

## Variables globales liées aux villes

```javascript
let villeActive = null;
let markersVilles = {};
let pairesChevauchement = []; // { idA, idB, vx, vy, latlngA, latlngB }
let mouseoutTimers = {};       // indexés par villeId ET par clé "idA:idB"
let ecartementsActifs = {};    // clé "idA:idB" → { dxA, dyA, dxB, dyB, duree }
```

---

## Chantiers en attente

**Icône bloquée en état hover dans les paires** — après interaction avec une paire, l'icône d'une ville peut rester en couleur "active/hover" (`#9aae9a`) alors que le curseur l'a quittée. Le `mouseout` déboncé à 550ms rate vraisemblablement le `setIconeVilleActive(false)` dans certaines séquences rapides. Correction à envisager : au `mouseover` sur n'importe quel marqueur (ville ou territoire), forcer le retour au repos de tous les marqueurs villes qui ne sont ni `villeActive` ni en cours d'isolation. Un seul élément actif à la fois.

**Superficies et densités de population** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js` (Nouvelle-Espagne, Guatemala, Tortue, Saint-Christophe/Saint-Kitt, Leeward Islands, etc.). Utiliser l'historique GitHub du fichier pour lister précisément les entrées modifiées.

**Contour SVG global des territoires** (`contourGlobalLayer`, pane `contourGlobal`) — variable et pane créés, implémentation non réalisée. Pas abandonné.
