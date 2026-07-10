# REPRISE_49 - Pavillon Noir - ships-data.js et modale d'itinéraire

Date: 2026-06-24

## Etat general

Session consacrée à deux chantiers parallèles :
1. Création de `js/ships-data.js` — catalogue complet des 41 navires du livre de règles.
2. Modale "Options avancées" du calculateur d'itinéraire — étapes multiples avec drag-and-drop.

Le dépôt actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

---

## 1. ships-data.js — catalogue des navires

### Fichier créé

`js/ships-data.js` — 41 entrées (40 navires du TSV + Dundee et Gabare séparés).

### Structure de chaque entrée

```js
{
  id,               // snake_case
  nom,              // affiché
  categorieTaille,  // 1 Chaloupe · 2 Sloop · 3 Goélette · 4 Frégate · 5 Vaisseau
  tirantEau,        // en mètres (valeur règles ou corrigée)
  voilure,          // 'aurique' · 'latine' · 'tierce' · 'carree' · 'mixte'
  navigation: {
    vitesse_naive,  // nœuds (moy_milles_jour ÷ 24) — utilisée si Nav < 3
    pres,           // nœuds — Nav ≥ 3
    largue,
    grand_largue,
    vent_arriere,
    avirons,        // null si non applicable
  },
  tonnage: { total, utile },
  equipage: { max, min },
  niveauNav,        // niveau minimum pour voir ce navire dans le catalogue
  regionRestriction, // [] · ['cotiere'] · ['fluviale'] — restrictions techniques uniquement
  notes,            // contexte géographique/historique — visible à Nav 5
}
```

### Fonctions exportées

```js
window.SHIPS_DATA         // tableau complet
window.getShipsForNavLevel(navLevel)  // navires accessibles pour un niveau (Nav 0 → [])
window.getShipById(id)    // navire par id ou null
```

### Répartition par niveau

| Niveau | Navires | Cumul |
|--------|---------|-------|
| Nav 0  | — (navire des PJ uniquement) | — |
| Nav 1  | 7 | 7 |
| Nav 2  | 9 | 16 |
| Nav 3  | 8 | 24 |
| Nav 4  | 8 | 32 |
| Nav 5  | 9 | 41 |

### Conventions établies

- `regionRestriction` : restrictions techniques uniquement (`'cotiere'`, `'fluviale'`). Les indications géographiques (Méditerranée, Europe) et la rareté pour la période vont dans `notes`.
- `voilure: 'carree'` implique virement lof-pour-lof — le calculateur en déduira l'impossibilité de passer vent debout.
- Nav 0 : pas de catalogue ; le navire des PJ est géré séparément dans `carte-data.js`.
- Nav < 3 : vitesse naïve (`vitesse_naive`) — pas de polaires.
- Nav ≥ 2 : modificateur encombrement (+/-1 nœud selon % tonnage utile chargé, ~70 kg/membre d'équipage inclus).
- Nav ≥ 3 : modificateur carénage (+/-1 nœud selon ancienneté). Par défaut 50 % encombrement, 6 mois de carénage → modificateur nul.
- Les champs `max` (tonnage, équipage) prévus pour les options avancées permettront de modéliser des navires à fourchettes (Flûte, Sloop…) et de dériver un tirant d'eau ajusté.

### Correctifs historiques appliqués (depuis correctif.md)

| Navire | Champ | Avant | Après | Motif |
|--------|-------|-------|-------|-------|
| `galion` | `tirantEau` | 15 | 7 | 15 m = aberration physique (cuirassé XXe) |
| `barge_chaland` | `tirantEau` | 3 | 0.9 | valeurs TSV en pieds, pas en mètres |
| `flibot_grand` | `tirantEau` | 4 | 2 | caboteur, pas incapable en mer |
| `flibot_grand` | `regionRestriction` | `['fluviale']` | `[]` | restriction architecturale injustifiée |
| `flute` | `tirantEau` | 9 | 7 | fond plat, tonnage médian retenu |
| `hourque` | `regionRestriction` | `['fluviale']` | `[]` | navigue en mer des Caraïbes depuis XVIIe |
| `galeasse` | `tirantEau` | 8 | 4.5 | galéasses historiques : 3–5 m |
| `marchand_compagnie_indes` | `tirantEau` | 5 | 7 | cat. 5 / 800 tx → 6–8 m attendus |
| `petit_prao_pirogue` | polaires | pres:10 largue:18 gl:15 va:8.5 | pres:7 largue:12 gl:10 va:6.5 | 10 nœuds au près = aberrant |

Notes ajoutées pour galion, flibot_grand, hourque, petit_prao_pirogue.

### À faire

- Brancher `ships-data.js` dans `carte.html` (balise `<script>`) — pas encore fait.
- Vérifier les niveaux Nav dans le TSV une fois les colonnes identifiées précisément.
- Implémenter les champs `max` (tonnage utile max, équipage max) et la règle de dérivation du tirant d'eau pour les navires à fourchettes.
- Connecter le catalogue au calculateur (sélection navire dans les options avancées, vitesse naïve vs polaires selon compétence).

---

## 2. Modale "Options avancées" — itinéraire multi-étapes

### Fichiers modifiés

- `carte.html` — ajout de la modale HTML + `<link>` vers `css/carte-drag.css`.
- `css/carte-drag.css` — nouveau fichier (styles drag-and-drop, chargé après `carte.css` pour éviter les conflits de verrouillage Live Server).
- `js/navigation-jaillot.js` — module modale complet inséré après `initUI()`.

### Fonctionnement

**Ouverture** : clic sur "Options avancées" → modale centrée, formulaire principal grisé/désactivé (`nav-jaillot--masque`).

**Initialisation** : si un cache existe (fermeture accidentelle), les valeurs sont restaurées. Sinon, A et B du formulaire principal sont copiés comme premières étapes.

**Étapes** :
- 2 étapes minimum (A et B), 10 maximum.
- Bouton "+" ajoute une étape **en fin de liste**.
- Bouton × par étape (caché si 2 étapes uniquement).
- Lettres A–J réassignées dynamiquement à chaque re-rendu.
- Chaque champ utilise la même autocomplétion de ports que le formulaire principal (`initChampPort`).

**Drag-and-drop** (pointer events custom, pas de `draggable` natif) :
- Clic maintenu sur la poignée (trois tirets) → le `li` se détache et suit le curseur verticalement.
- Clone visuel (`--fantome`, `position: fixed`) suit le curseur.
- Placeholder (`--placeholder`, hauteur fixe) conserve l'espace dans la liste.
- Repositionnement au passage du milieu de chaque voisin.
- Animation FLIP : snapshot `getBoundingClientRect()` avant déplacement du placeholder → translateY inverse appliqué instantanément → transition CSS `transform 0.18s ease` vers 0. Les voisins glissent en douceur.
- **Confinement** : bord haut du fantôme clampé entre bas du header et `(haut du footer - hauteurItem)` — le fantôme reste entièrement dans la zone.
- **Auto-scroll** : boucle `requestAnimationFrame` ; scrolle le corps de la modale quand le curseur est dans les 44 px des bords haut/bas, vitesse proportionnelle à la proximité (max 12 px/frame).

**Fermeture sans validation** : cache les valeurs silencieusement (réouverture → état restauré).

**Validation** : calcule les segments A→B, B→C… en séquence, trace la route complète, affiche durée + distance totales dans la modale et dans le formulaire principal. Le formulaire affiche A et B, avec "+ N étapes intermédiaires" en dessous si applicable.

### Garde anti-double-enregistrement

`initModale()` pose un verrou `modaleInitialisee` car `init()` est appelé deux fois dans `carte.js` (initialisation normale + activation mode MJ). Sans ce verrou, les listeners s'enregistraient deux fois, ce qui doublait les ajouts d'étapes.

### Points de vigilance

- `ships-data.js` n'est pas encore chargé dans `carte.html`.
- Le système de mot de passe (compétence Navigation) et le sélecteur de navire ne sont pas encore implémentés — ils seront la prochaine section des options avancées.
- L'overlay maritime et le filtre de visibilité des courants/hauts-fonds selon le niveau de compétence restent à brancher sur `ships-data.js` une fois le mot de passe implémenté.
