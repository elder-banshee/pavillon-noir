# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Voir REPRISE_13.md pour le contexte général du projet, la charte graphique, la structure des fichiers et le workflow de développement. Cette notice couvre uniquement les travaux de la session 14.

---

## Chantier accompli en session 14 : page Carte

Nouvelle page `carte.html` avec carte interactive Leaflet en mode `L.CRS.Simple` (coordonnées pixel, pas de géographie réelle).

### Fichiers créés

```
carte.html              # Page carte
css/carte.css           # Styles spécifiques
js/carte.js             # Logique Leaflet, zones, pins, panneau, curseur
js/carte-data.js        # Source de vérité (juridictions, pins, données temporelles)
medias/cartes/          # Dossier pour la carte image
```

### Carte image

Jaillot, Mortier & Sanson, 1708 — *Teatre de la Guerre en Amerique*. Domaine public, source : David Rumsey Map Collection. Fichier : `medias/cartes/jaillot-1708.jpg`, 8500 × 5320 px, ~7,5 Mo (MozJPEG qualité 78). Coordonnées pixel : facteur de réduction 0,348 depuis le JP2 original (24408 × 15276 px).

### Architecture technique

**Leaflet en `L.CRS.Simple`** — coordonnées pixel `[x, y]` converties en `LatLng` via `pixelToLatLng(x, y)` qui inverse l'axe Y (`height - y`). Zoom calé dynamiquement via `setTimeout` + `fitBounds` + `setMinZoom(carte.getZoom())`.

**`carte-data.js`** — trois exports :
- `CARTE_ANNEE_REFERENCE` : année courante de jeu (à mettre à jour après chaque session)
- `CARTE_IMAGE` : src, width, height de la carte
- `PUISSANCES` : palette couleurs et blasons par puissance coloniale
- `JURIDICTIONS` : tableau d'objets avec champs temporels (`puissance`, `gouverneur`, `contexte`)
- `CARTE_PINS` : marqueurs de scénarios, simples ou groupés (plusieurs événements au même endroit)
- `resoudre(champ, annee)` : utilitaire de résolution temporelle — retourne la valeur dont la clé est la plus grande ≤ annee, en ignorant les clés > `CARTE_ANNEE_REFERENCE`

**Champs temporels** : clés = années numériques, valeur = contenu. Exemple :
```javascript
gouverneur: {
  1712: { nom: 'Conseil de Nassau', pnj_id: 'conseil-nassau', titre: 'Instance dirigeante' },
  1718: { nom: 'Woodes Rogers', pnj_id: null, titre: 'Gouverneur royal' },
}
```

**Pins groupés** : un pin peut porter plusieurs chroniques (ex: Vero Beach = Hippogriffe + Épaves). Structure :
```javascript
{
  id: 'pin-vero-beach',
  label: 'Site des épaves de la Flotte au Trésor',
  coords: [3969, 1296],
  groupe: [
    { chronique_id: 'hippogriffe', label: '...', date: '...', extrait: '...' },
    { chronique_id: 'epaves',      label: '...', date: '...', extrait: '...' },
  ],
}
```

**Panneau latéral** : `position: absolute` dans `.carte-plus` (`position: relative`), `top: 0; right: 0; height: 100%`. Se superpose à la carte sans la redimensionner. `z-index: 1000` pour passer au-dessus des couches Leaflet. Géré avec `inert` (pas `aria-hidden`) pour l'accessibilité. Toggle : clic sur la zone active ferme le panneau. Portrait du gouverneur chargé depuis `PNJ_DATA` si `pnj_id` renseigné.

**Curseur temporel** : année en grand + slider en dessous, centré au-dessus de la carte. Met à jour `anneeActive`, re-rend les zones, rafraîchit le panneau si ouvert.

**Popup des pins** : centrée en `position: fixed`. Toggle : clic sur pin actif ferme la popup. Popup groupée : blocs séparés par `.carte-popup-separateur`. Fermeture : bouton ✕, clic en dehors, clic à nouveau sur le pin.

### Structure HTML actuelle de la zone carte

```html
<main>
  <div class="carte-curseur">...</div>

  <div class="carte-plus">           ← position: relative, max-width: 1400px, margin: 0 auto
    <div id="carte-wrap">            ← position: relative, overflow: hidden
      <div id="carte"></div>         ← Leaflet, aspect-ratio: 8500/5320
    </div>
    <aside class="carte-panneau">    ← position: absolute, top:0, right:0, height:100%
      ...
    </aside>
  </div>

  <div class="carte-credit">         ← actuellement encore dans carte-plus, À EXFILTRER
    ...
  </div>

</main>
```

---

## Prochaine étape — à traiter en session 15

### Objectif immédiat : créer l'échelon `carte-corps`

**Contexte** : `carte-credit` est actuellement dans `.carte-plus`. Or `.carte-plus` a `height: 100%` sur le panneau — si le texte du panneau est long, il déborde sur le crédit. Il faut sortir `carte-credit` de `carte-plus` tout en conservant son alignement à droite calé sur `carte-wrap` (pas pleine largeur).

**Structure cible** :

```
carte-corps              ← nouveau, colonne, contient carte-plus et carte-credit
├── carte-plus           ← inchangé (position: relative, max-width: 1400px)
│   ├── carte-wrap       ← inchangé
│   └── carte-panneau    ← inchangé (position: absolute)
└── carte-credit         ← exfiltré de carte-plus, aligné à droite sur carte-wrap
```

**Contrainte** : `carte-credit` doit rester visuellement aligné à droite sous `carte-wrap` (max-width: 1400px, margin: 0 auto), pas s'étaler sur toute la largeur de la fenêtre.

**Méthode recommandée** : dans VS Code, utiliser `Ctrl+Shift+H` pour renommer toutes les occurrences de `carte-corps` → `carte-plus` (si pas encore fait), puis construire `carte-corps` manuellement autour.

**Ce que `carte-corps` doit avoir en CSS** :
- `display: flex; flex-direction: column` pour empiler `carte-plus` et `carte-credit`
- Pas de `position: relative` — pour ne pas brider le `z-index: 1000` du panneau
- Pas de `max-width` — `carte-plus` s'en charge déjà

**Ce que `carte-credit` doit avoir** :
- `max-width: 1400px; margin: 0 auto` pour s'aligner sur `carte-plus`
- `text-align: right` pour rester à droite
- `width: 100%; box-sizing: border-box` pour occuper toute la largeur de son conteneur

---

## Chantiers ouverts — page carte

- **Fermeture du panneau au clic en dehors** — pas encore implémenté
- **Popup des pins** : switch direct vers une autre pin sans double-clic (actuellement : un clic ferme, un second ouvre la nouvelle) — à corriger dans `ouvrirPopup()` et `ouvrirPopupGroupe()` en supprimant le test `pinActive === pin.id` et en appelant directement la fonction d'ouverture
- **Surbrillance des pins au survol** — le CSS `.carte-pin:hover` existe mais l'effet est subtil ; à renforcer si jugé insuffisant
- **Deep-link `pnj.html?id=xxx`** — le clic sur un gouverneur dans le panneau redirige vers `pnj.html?id=...` mais `pnj.js` n'intercepte pas encore ce paramètre pour ouvrir automatiquement la bonne fiche
- **Zones à affiner** — les polygones des 3 juridictions existantes (Nassau, Jamaïque, Saint-Domingue, Cuba-test) sont approximatifs, à recaler visuellement
- **Juridiction Cuba-test** — à supprimer une fois les tests de scroll validés, et remplacer par Cuba réelle
- **25 à 40 juridictions à documenter** — travail documentaire progressif, modèle vide disponible dans `carte-data.js`
- **Blasons** — dossier `medias/blasons/` à créer, fichiers SVG à déposer (gb, es, fr, nl, nassau)
- **Lien "Carte" dans la nav** — à ajouter dans `index.html`, `pnj.html`, `equipage.html`, `chroniques.html`
- **Mobile** — page carte non optimisée pour mobile (panneau masqué sous 900px, reste à réfléchir)

---

## Points de vigilance techniques — page carte

- **`initResizeObserver`** : fonction supprimée. Ne pas la réintroduire — le panneau est `position: absolute` dans `carte-plus` et n'a pas besoin de calcul JS pour son positionnement.
- **`carte-plus` sans `position: relative` sur `carte-corps`** : essentiel pour ne pas créer de contexte d'empilement qui briderait le `z-index: 1000` du panneau.
- **`inert`** sur le panneau fermé (pas `aria-hidden`) — évite l'erreur d'accessibilité sur le bouton ✕ focusé.
- **`setTimeout` dans `initCarte`** : nécessaire pour laisser le DOM se stabiliser avant `fitBounds`. Ne pas supprimer — la carte disparaît sans lui.
- **`carte-data.js` doit être chargé avant `pnj-data.js` et `chroniques-data.js`** dans `carte.html` — l'ordre des scripts est important.
- **Coordonnées des pins** : toujours en pixels à l'échelle 8500 × 5320. Facteur de conversion depuis Photoshop (24408 × 15276) : × 0,348.
