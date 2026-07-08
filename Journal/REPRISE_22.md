# Notice de reprise — Pavillon Noir, site de campagne
*Session 22 — animations mode recherche, écran de chargement, isolation villes*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : capitale `#b04a36` (bordeaux), ville standard `#6b7c8a` (mist), Nassau/pirate `#0e0c09` (ink), trait pirate `#f2e8d5` (parchemin)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Gestion des sources — ordre de priorité

1. **Connecteur GitHub (`main`)** — source principale pour le code de référence. Claude le consulte en début de session. Si `main` semble en retard sur `dev`, Claude compare les deux branches et rappelle à Ronan de merger avant de continuer.
2. **Fichiers du projet** (REPRISE_N.md + dépôt partagé) — contexte de session et fallback si le connecteur est indisponible. Ronan actualise le dépôt partagé en début de session.
3. **Desktop Commander** (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) — utilisé en session 22 comme outil principal d'édition directe. Fichier toujours sauvegardé (Ctrl+S) avant lecture.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Si une fonctionnalité similaire existe et fonctionne sans patch, s'en inspirer : comprendre pourquoi elle ne rencontre pas le problème, et aligner l'architecture de la fonctionnalité défaillante sur ce modèle. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Chantiers accomplis en session 22

### 1. Animation `zoomerVille()` — version retenue

Séquence finale dans `carte.js`, fonction `zoomerVille()` :

- **t+0** : icône blanc immédiat, taille figée à `tailleDepart = tailleIconeVille()`
- **t+400ms** : icône gold-light (`#e2c97e`), taille toujours figée
- **t+800ms** : `flyTo` lancé (1.4s, easeLinearity 0.25) — icône visible pendant le vol, latence Leaflet acceptable
- **`moveend`** : icône gold-light à `tailleArrivee`, puis gold standard 120ms après

**Latence pendant le vol** : glissement continu de l'icône pendant le `flyTo`, inhérent à l'architecture Leaflet (`divIcon` repositionné individuellement par JS à chaque frame, alors que la carte est animée par le compositor CSS sur le GPU). Non corrigeable proprement dans le cadre actuel. Si les joueurs le signalent, restaurer la version avec masquage (backup disponible ci-dessous).

**Version backup (masquage pendant le vol)** — si la latence est jugée trop visible :
- t+650ms : fondu opacity 0 (transition CSS 0.2s)
- t+800ms : flyTo
- `moveend` : réapparition opacity 1, agrandissement, gold-light → gold

### 2. Écran de chargement (`carte.html` + `carte.js`)

**Problème résolu** : saccade au premier `flyTo` due au décodage différé de l'image JPEG (7,5 Mo). Solution : `new Image().decode()` force le décodage complet en mémoire avant d'initialiser la carte.

**Écran de chargement** : Jolly Roger de Rackham (CC0, `pnj/pavillons/rackham.svg`) inlinés dans `#carte-wrap`, fond `#0e0c09` identique à `--ink`, motifs en `#f2e8d5` (parchemin), opacité 0.55. Animation CSS `drapeau-balancement` : oscillation symétrique ±1.5° rotate, `ease-in-out`, 3.2s. Pas d'ombre portée — le fond du SVG se confond avec l'écran. SVG 900×599px dans un conteneur 1200×751px.

**Placement** : `position: absolute` enfant de `#carte-wrap` (`position: relative`, `overflow: hidden`). Couvre uniquement la zone carte, pas la nav/header/barre de contrôles.

**Disparition** : fondu opacity 0 en 0.7s, puis `ecran.remove()`.

**Note** : le chargement est quasi-instantané en conditions normales — l'animation n'a pas le temps de se déployer. L'écran remplit surtout son rôle de masquage de l'initialisation (polygones qui apparaissent avant la carte).

### 3. Mode isolation villes — corrections

- **Boutons overlay** : grisés à l'entrée de `zoomerVille()`, réactivés à la sortie de `fermerZoomVille()` — aligné sur le comportement de `isolerTerritoire()` / `fermerIsolation()`
- **Filtres scénarios/villes** : bloqués au clic (guard `overlayMode === 'isolation' || 'isolationVille'`) pour éviter que double-clic réaffiche les pins en mode isolation
- **Recherche ville avec filtre villes désactivé** : `zoomerVille()` réactive silencieusement le filtre villes (coche + retire classe `decochee`) avant de griser les contrôles — garantit que `renderVilles()` crée le marqueur, et que les villes restent visibles à la sortie du mode isolation

### 4. Nettoyage `carte.js`

Suppressions :
- `window._suggestionActive = null` (debug oublié)
- Duplication du bloc d'initialisation dans `.then()` / `.catch()` → factorisé en `function initTout()`
- Bloc de création manuelle du marqueur temporaire dans `zoomerVille()` (rendu caduc par la réactivation silencieuse du filtre)

Conservés intentionnellement :
- `contourGlobalLayer` (variable globale) + `carte.createPane('contourGlobal')` — **chantier en attente** (contour SVG global des territoires, problèmes de production du SVG non résolus, pas abandonné)

---

## Architecture technique — points clés `carte.js`

### `zoomerVille(villeId)`

```
overlayModeAvantIsolation sauvegardé
fermerPanneau() inline (évite corruption overlayModeAvantIsolation)
overlayMode = 'isolationVille'
isolationVilleId = villeId
setOpacity(0.05)
réactivation silencieuse filtre villes si décoché
griser boutons overlay + filtres + légende
majLegende()
renderZones() + masquer markersMap + markersVilles
désactiver pointer-events sauf ville isolée
animation blanc → gold-light → flyTo → moveend gold-light → gold
```

### `fermerZoomVille(options)`

```
overlayMode restauré
carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1)
réactiver boutons overlay + filtres + légende
restaurer pointer-events et z-index
majLegende() + renderZones() + renderPins() + renderVilles()
si options.ouvrirVille → ouvrirPanneauVille()
```

### `initFiltresMarqueurs()`

Les deux handlers vérifient `overlayMode === 'isolation' || overlayMode === 'isolationVille'` avant d'agir.

---

## Chantier en attente — élimination de la latence `flyTo` (expérimentation)

### Contexte

Pendant un `flyTo` Leaflet, les `divIcon` (marqueurs DOM) sont repositionnés individuellement par JS à chaque frame de l'animation, tandis que la carte image est animée par le compositor CSS du navigateur sur le GPU. Ces deux chemins de rendu ne sont pas synchronisés frame-parfaitement, d'où un glissement visible du marqueur pendant le vol.

### Proposition à tester

**Principe :** pré-calculer au chargement de la page la trajectoire pixel complète de chaque ville pendant son `flyTo`, depuis un état de départ fixe (dézoom max forcé), et rejouer ces positions frame par frame via `requestAnimationFrame` en positionnant le marqueur en `position: fixed`.

**Conditions qui rendent la proposition viable :**
1. Forcer le dézoom max en entrée de `zoomerVille()` fixe le point de départ — la trajectoire Leaflet (algorithme van Wijk & Nuij) devient déterministe pour chaque ville
2. La refactorisation pour la taille de fenêtre est triviale (ratio largeur\_actuelle / largeur\_référence)
3. Le changement de résolution en cours de consultation est une éventualité négligeable — les trajectoires calculées au chargement (résolution initiale) sont acceptées comme référence
4. L'écran de chargement est le bon moment pour effectuer ces calculs via `carte.latLngToContainerPoint()`, une fois Leaflet initialisé
5. ~40 villes × quelques dizaines de frames × 2 coordonnées = quelques milliers de nombres, poids négligeable

**Incertitude principale :** rejouer les positions via `requestAnimationFrame` en écrivant dans le DOM du marqueur sera-t-il effectivement synchrone avec le rendu CSS de la carte ? Ce n'est pas garanti — le script JS et le compositor CSS opèrent potentiellement dans des contextes d'exécution différents. C'est ce que le test permettrait de vérifier.

**Plan d'implémentation (à affiner) :**
1. Au `moveend` initial (après `fitBounds`), forcer `carte.setZoom(carte.getMinZoom())` et capturer l'état de référence
2. Dans `masquerEcranChargement()` (ou juste avant), pour chaque ville de `VILLES` avec `coords`, simuler un `flyTo` et capturer la trajectoire via `carte.latLngToContainerPoint()` à intervalles réguliers
3. Stocker ces trajectoires dans un dictionnaire `TRAJECTOIRES_VILLES[villeId]`
4. Dans `zoomerVille()`, si la trajectoire existe et que la fenêtre correspond (ratio ≈ 1), switcher le marqueur en `position: fixed` et rejouer la trajectoire via RAF
5. Au `moveend`, remettre le marqueur en positionnement Leaflet normal

**Alternative plus simple à tester d'abord :** sans pré-calcul, simplement forcer le dézoom max au début de `zoomerVille()` et vérifier si la latence est réduite ou éliminée — ce serait déjà une information utile sur la cause réelle du problème.
