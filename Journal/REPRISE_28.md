# Notice de reprise — Pavillon Noir, site de campagne
*Session 28 — enrichissement carte : catégorie sites, filtres, grisage isolation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier, ou génère les fichiers via Desktop Commander et/ou `present_files`.

---

## Gestion des sources — ordre de priorité

1. **Desktop Commander** (`C:\AI\Site Pavillon Noir\pavillon-noir`) — source principale. Claude lit les fichiers locaux en début de session. Fichier toujours sauvegardé (Ctrl+S) avant lecture.
2. **Fichiers du projet** (REPRISE_N.md) — contexte de session, lu avant toute autre chose.
3. **Connecteur GitHub (`main`)** — fallback uniquement si Desktop Commander est indisponible, ou pour vérifier qu'un commit est bien propagé sur le site live.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : fond unique `#7a8c7a` (vert-de-gris), actif `#9aae9a`. Nassau/pirate `#0e0c09` (ink), actif `#3a3a3a`. Mode isolé : fond transparent + contour gold.
- **⚠️ Obsolète — à ignorer** : les mentions bordeaux/mist selon capitale/ville secondaire dans les sessions 21 et 26 sont caduques. `estCapitale` n'existe plus dans la signature de `villeSVG()` — toutes les villes ont le même fond vert-de-gris.
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

**Leçon session 28** : implémenter plusieurs fonctionnalités interdépendantes simultanément, sans validation intermédiaire, rend le diagnostic impossible. Procéder impérativement par étapes, chacune validée en Live Server avant la suivante.

---

## État du dépôt après sessions 28–29 (filtres)

### Fichiers modifiés (non commités à l'issue de la session 28 initiale)

- **`js/villes-data-ajouts-session.js`** — wrapper `const VILLES_AJOUTS = [...]` ajouté en début et fin de fichier. Seul fichier modifié par rapport au commit `3a69344`.
- **`carte.html`**, **`css/carte.css`**, **`js/carte.js`** — modifiés par les travaux sur les filtres et le grisage (sessions 28–29, voir détail ci-dessous). **Non encore commités.**

### État de `carte.js`

**2 219 lignes** à l'issue des sessions 28–29 (filtres + grisage).  
Référence : commit `3a69344` ("Update villes-data.js") = 1 856 lignes (état restauré en milieu de session 28 après régressions).

---

## Nouveau fichier — `js/villes-data-ajouts-session.js`

### Rôle

Fichier **intermédiaire temporaire** contenant 134 entrées préparées lors d'une session de recherche (2025-06-04). Il permet de visualiser les nouvelles villes/sites sur la carte dans le navigateur **sans toucher à `villes-data.js`**, pour les réviser, les positionner et décider de leur rang final avant intégration.

### Structure

```javascript
const VILLES_AJOUTS = [
  { id: '...', nom: '...', type: 'port'|'ville'|'fort'|'site', rang: '2', territoire: '...', coords: null, ... },
  // 134 entrées
];
```

### Chemin physique

```
C:\AI\Site Pavillon Noir\pavillon-noir\js\villes-data-ajouts-session.js
```

Un exemplaire de travail plus ancien existe à la racine du dossier parent :
```
C:\AI\Site Pavillon Noir\villes-data-ajouts-session-old.js
```

### Caractéristiques des entrées

- Toutes à `coords: null` au départ de la session — à renseigner sur la carte
- Toutes à `rang: '2'` — rang de sélection temporaire (voir section Rang ci-dessous)
- Types utilisés : `'port'`, `'ville'`, `'fort'`, `'site'` (nouveau type, voir section SVG builders)
- 134 entrées au total + 3 corrections à appliquer dans `villes-data.js` (détail dans le fichier lui-même)

### Intégration future dans `villes-data.js`

Quand la révision sera terminée, les entrées de rang 1 et 2 seront copiées dans `villes-data.js` et `villes-data-ajouts-session.js` supprimé. **Avant de supprimer le fichier**, retirer toutes les occurrences `VILLES_AJOUTS` dans `carte.js` (voir section "Chantiers en attente — Nettoyage VILLES_AJOUTS").

---

## Système de rangs — convention

| Valeur | Signification | Comportement |
|---|---|---|
| Pas de champ `rang` | Rang 1 par défaut | Affiché (filtre Établissements principaux) |
| `rang: '1'` | Rang 1 explicite | Affiché (filtre Établissements principaux) |
| `rang: '2'` | Établissement/site secondaire | Affiché si filtre Établissements secondaires coché — **décoché par défaut** au chargement |
| `rang: '3'` | Éliminé de la sélection | Jamais affiché — sauf en Mode MJ (non encore implémenté) |

**Note** : l'affichage rang 2 conditionné par le niveau de zoom a été **abandonné** — trop complexe et peu pratique. Le filtre suffit.

---

## SVG builders — `villeSVG()`

### Signature actuelle

```javascript
function villeSVG(type, taille = 24, estPirate = false, estIsole = false, estActive = false)
```

`estCapitale` a été supprimé depuis la session 21. Ne pas le réintroduire.

### Types reconnus

| Type | Symbole | Fond normal | Fond actif |
|---|---|---|---|
| `'port'` | Ancre stylisée (mât + bôme + vague) | `#7a8c7a` | `#9aae9a` |
| `'fort'` | Croix sur fond noir | `#7a8c7a` | `#9aae9a` |
| `'ville'` (défaut) | Maison (toit + murs + porte) | `#7a8c7a` | `#9aae9a` |
| `'site'` | **À implémenter** — triangle montagne sur fond azur | `#1a3a4a` | `#2a5a72` |

### Type `'site'` — à implémenter (prochaine session)

Fond azur (`--sea`) pour distinguer des établissements humains. Symbole : triangle isocèle (montagne/volcan) + petit double versant intérieur. Couleurs symbole : `#ddd0aa`, trait : `#c8b98a`.

```javascript
} else if (type === 'site') {
  symbole = `
    <polygon points="16,8 27,24 5,24" fill="none" stroke="${couleurSymbole}" stroke-width="1.6" stroke-linejoin="round"/>
    <polyline points="13,18 16,13 19,18" fill="none" stroke="${couleurSymbole}" stroke-width="1.2" stroke-linejoin="round" opacity="0.7"/>`;
}
```

### Types futurs prévus (non implémentés)

- `'site-geo'` : volcans, baies, fleuves notables — même fond azur, symbole triangle
- `'site-hist'` : ruines précolombines, établissements coloniaux abandonnés — fond azur, symbole différent (à définir : croix/ruine ?)

---

## Filtres marqueurs — état implémenté ✅

### HTML — `carte.html`

```html
<div class="carte-filtres-marqueurs">
  <div class="carte-filtres-groupe">
    <label class="carte-filtre-check carte-filtre-check--maitre" id="filtre-marqueurs-tout">
      <input type="checkbox" checked>
      Marqueurs géographiques
    </label>
    <div class="carte-filtre-enfants">
      <label class="carte-filtre-check carte-filtre-check--sub" id="filtre-scenarios">
        <input type="checkbox" checked>
        <span class="carte-filtre-pastille">⚑</span>
        Scénarios
      </label>
      <label class="carte-filtre-check carte-filtre-check--sub" id="filtre-etablissements">
        <input type="checkbox" checked>
        <span class="carte-filtre-pastille">⌂</span>
        Établissements principaux
      </label>
      <label class="carte-filtre-check carte-filtre-check--sub" id="filtre-secondaires">
        <input type="checkbox"><!-- décoché par défaut -->
        <span class="carte-filtre-pastille">⌂</span>
        Établissements secondaires
      </label>
      <label class="carte-filtre-check carte-filtre-check--sub" id="filtre-sites">
        <input type="checkbox" checked>
        <span class="carte-filtre-pastille">▲</span>
        Sites d'intérêt
      </label>
    </div>
  </div>
</div>
```

### IDs à connaître

| ID | Rôle | Appelle |
|---|---|---|
| `filtre-marqueurs-tout` | Case maître (tout/rien) | `renderPins()` + `renderVilles()` |
| `filtre-scenarios` | Pins scénarios | `renderPins()` |
| `filtre-etablissements` | Villes/ports/forts rang 1 | `renderVilles()` |
| `filtre-secondaires` | Villes/ports/forts rang 2 | `renderVilles()` |
| `filtre-sites` | Sites d'intérêt (type `'site'`) | `renderVilles()` |

### Logique `initFiltresMarqueurs()`

- Tous les listeners utilisent `e.preventDefault()` pour désactiver le toggle natif du `<label>`, et gèrent l'état du checkbox manuellement — évite le double-inversion navigateur/JS.
- Case maître : si tout coché → tout décocher ; si partiel ou tout décoché → tout cocher.
- État `indeterminate` sur la case maître quand seulement certains enfants sont cochés.
- `majMaitre()` appelée à l'init pour refléter l'état initial (filtre-secondaires décoché au chargement → case maître en `indeterminate`).
- Guards : tous les listeners vérifient `overlayMode !== 'isolation' && overlayMode !== 'isolationVille'` avant d'agir.

### CSS ajouté — `css/carte.css`

```css
.carte-filtres-groupe          /* cadre border + overflow:hidden */
.carte-filtre-check--maitre    /* fond or subtil, border-bottom, couleur gold */
.carte-filtre-enfants          /* flex-direction: column, padding 0.2rem */
.carte-filtre-check--sub       /* padding-left: 1.1rem, font-size: 0.52rem */
.carte-recherche-input:disabled /* opacity: 0.3, cursor: not-allowed */
```

---

## Grisage en mode isolation — état implémenté ✅

Les deux modes isolation (territoire via `isolerTerritoire()`, ville via `zoomerVille()`) appliquent désormais le même traitement complet :

**Éléments grisés / bloqués à l'entrée en isolation :**
- Boutons overlay (`.carte-overlay-btn`) — `disabled = true` + classe `carte-isolation--disabled`
- `#carte-legende` — classe `carte-isolation--disabled`
- `#filtre-marqueurs-tout` — classe `carte-isolation--disabled`
- `#filtre-scenarios` — classe `carte-isolation--disabled`
- `#filtre-etablissements` — classe `carte-isolation--disabled`
- `#filtre-secondaires` — classe `carte-isolation--disabled`
- `#filtre-sites` — classe `carte-isolation--disabled`
- `#carte-recherche-input` — `disabled = true` + `blur()`

**Restauration via `_restaurerModeNormal()`** (tronc commun `fermerIsolation()` / `fermerZoomVille()`) :
- Tous les éléments ci-dessus restaurés à leur état normal
- `rechercheInput.disabled = false`
- Vérification MJ : `renderZones()`, `renderPins()`, `renderVilles()` appliquent leur propre filtrage `modeMJ` — `_restaurerModeNormal()` n'a pas à s'en préoccuper

**Réactivation silencieuse des filtres villes dans `zoomerVille()`** : si `filtre-etablissements`, `filtre-secondaires` ou `filtre-sites` étaient décochés au moment de la recherche d'une ville, ils sont recoché silencieusement pour que la ville cherchée soit visible. Les filtres restent ensuite dans cet état après fermeture de l'isolation.

---

## Architecture technique — `carte.js` (2 219 lignes)

### Ordre des sections

```
1.  Variables globales
2.  Constantes et paliers (OVERLAY_LABELS, DENSITE_PALIERS, ESCLAVAGE_PALIERS, AUTOCHTONES_COULEURS, WEIGHTS, ZOOM_FACTEUR)
3.  Utilitaires purs (pixelToLatLng, normaliser, weightPourZoom, rendreChamp, rendreContexte, lireTranslate3d)
4.  Fonctions de couleur overlay (couleurDensite, couleurEsclavage, resoudreStatutAutochtone, couleurAutochtone)
5.  Calcul / année (calculerAnneeMax + ANNEE_MAX_MJ)
6.  SVG builders (pinSVG, villeSVG)
7.  Icônes villes — helpers (_infoMarqueurVille, tailleIconeVille, labelVille, setIconeVilleActive, setIconeVilleIsoleeHover)
8.  Séquence secrète MJ (enregistrerClicSequence, ouvrirPopupConfirmationMJ, confirmerModeMJ, annulerModeMJ)
9.  Utilitaires UI (masquerEcranChargement, fermerTooltipsOrphelins, positionnerBoutonsZoom)
10. Initialisation principale (DOMContentLoaded → initTout, initCarte, initCurseurInline, initOverlayBtns,
    initPanneauGauche, initFiltresMarqueurs, initRecherche + helpers afficherSuggestions, surlignerMatch, escapeHtml)
11. Rendu (renderZones, renderPins, renderVilles, majTailleIconesVilles, contourGlobalSvgCache + renderContourGlobal, majLegende)
12. Popups scénarios (ouvrirPopup, ouvrirPopupGroupe, afficherPopup, fermerPopup)
13. Panneaux droits (ouvrirPanneau, resetEtatsVisuels, fermerPanneau, fermerPanneauVille, ouvrirPanneauVille)
14. Zones — état visuel (majZone, majWeightsZones)
15. Isolation territoire (_restaurerModeNormal, fermerIsolation, isolerTerritoire)
16. Isolation ville (zoomerVille, fermerZoomVille)
17. Chevauchement icônes (calculerPairesChevauchement, ecarterVille, rapprocherVille)
```

### Fonctions privées (convention `_`)

- `_infoMarqueurVille(villeId)` → `{ marker, ville, estPirate, taille }` — base commune aux deux `setIcone*`
- `_restaurerModeNormal()` — tronc commun de `fermerIsolation()` / `fermerZoomVille()`

### Écartement des paires d'icônes

`calculerPairesChevauchement()` itère sur `VILLES.filter(v => v.coords)`, calcule les distances pixel au zoom min, retient les paires < 16px. **6 paires connues** :
- Kingston / Spanish Town
- Basseterre / Fort Brimstone Hill
- Saint John's / English Harbour
- Saint-Pierre / Fort Royal
- Carthagène / Fort San Luis
- Portobelo / Fort San Lorenzo

Variables : `pairesChevauchement[]`, `mouseoutTimers{}`, `ecartementsActifs{}`.

---

## Plan d'implémentation — prochaines sessions

### Étape 1 — `villeSVG()` type `'site'` + chargement `VILLES_AJOUTS` *(prochaine priorité)*

**Fichiers** : `carte.js` (villeSVG uniquement) + `carte.html` (balise `<script>`)  
**Périmètre strict** : uniquement la branche `else if (type === 'site')` dans `villeSVG()`, et la balise `<script src="js/villes-data-ajouts-session.js">` entre `villes-data.js` et `carte.js`.  
**Validation** : carte charge, icônes existantes intactes, aucune erreur console. `VILLES_AJOUTS` visible dans la console (`window.VILLES_AJOUTS`).

### Étape 2 — Pool fusionné `VILLES + VILLES_AJOUTS` dans `renderVilles()` et helpers

**Fichiers** : `carte.js` uniquement  
**Fonctions à modifier** (dans l'ordre, une à une) :
1. `renderVilles()` — pool `[...VILLES, ...(VILLES_AJOUTS||[])]` + filtrage rang (`undefined|'1'` → affiché, `'2'` → affiché si filtre coché, `'3'` → masqué sauf modeMJ)
2. `majTailleIconesVilles()` — même pool pour le `find(v => v.id === id)`
3. `_infoMarqueurVille()` — même pool
4. `afficherSuggestions()` — même pool + exclusion rang `'3'` de la recherche
5. Handler Entrée recherche — même pool (occurrences `VILLES.find`)
6. `ouvrirPanneauVille()` — même pool
7. `zoomerVille()` — même pool

**Validation** : marqueurs existants intacts, recherche fonctionne, zoom sur ville fonctionne, écartement fonctionne sur les 6 paires connues, aucune régression mode isolation.

### Étape 3 — `calculerPairesChevauchement()` depuis marqueurs visibles

**Fichier** : `carte.js` (fonction seule)  
**Principe** : itérer sur `Object.keys(markersVilles)` au lieu de `VILLES.filter(v => v.coords)`. Garde `if (!carte._loaded) return` en tête. Appeler `calculerPairesChevauchement()` en fin de `renderVilles()` avec la même garde.  
**Garde dans `ecarterVille()`** : vérifier que `markersVilles[autreId]` existe avant d'animer.  
**Validation** : 6 paires toujours détectées, sites seuls ne bougent pas, aucune erreur console au chargement.

### Étape 4 — Mode MJ : affichage rang 3

**Fichier** : `carte.js` (`renderVilles()`)  
Dans la condition de filtrage rang : `if (rang === '3' && !modeMJ) return` (déjà présent d'après les recherches — vérifier).  
Icône rang 3 en Mode MJ : opacité réduite ou contour pointillé (à définir visuellement).

---

## Chantiers en attente — Nettoyage `VILLES_AJOUTS`

**Quand `villes-data-ajouts-session.js` sera supprimé**, retirer de `carte.js` toutes les occurrences du pattern pool fusionné dans :

- `renderVilles()`
- `majTailleIconesVilles()`
- `_infoMarqueurVille()`
- `afficherSuggestions()`
- Handler Entrée recherche
- `ouvrirPanneauVille()`
- `zoomerVille()`
- `calculerPairesChevauchement()`

Retirer aussi la balise `<script src="js/villes-data-ajouts-session.js">` dans `carte.html`.

---

## Chantiers en attente — autres

- **Écartement icônes — comportement erratique (mouseover rapide)** — correction structurelle complète impliquerait un refactor RAF. Non entrepris délibérément (session 27). À reconsidérer si le bug devient gênant.
- **Types `site-geo` / `site-hist`** — deux variantes de `'site'` avec icônes distinctes (triangle montagne vs symbole ruines), même fond azur. À implémenter dans `villeSVG()` après validation de l'étape 1.
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`.

---

## Format des données — rappels

- **Contextes** (`j.contexte`, `ville.contexte`) : `Array<{ de, a?, texte }>` **ou** `string` (contexte permanent non daté, villes uniquement). `rendreContexte()` gère les deux.
- **`rendreChamp()`** gère : `string` | `true` | `false` | `Array<{ de, a?, texte }>`.
- **`rendreContexte()`** gère : `null/undefined` → `''`, `string` → retour direct, `Array` → filtre par année + join.
- **`resoudre()`** gère : objets clés-années numériques (`puissance`, `gouverneur`).
