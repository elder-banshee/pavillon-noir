# Notice de reprise — Pavillon Noir, site de campagne
*Session 29 — évolutions méthodologiques workflow (sessions 28–29)*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Couleurs icônes villes** : ville standard `#7a8c7a` (vert-de-gris), survol `#9aae9a`, Nassau/pirate `#0e0c09` (ink), trait pirate `#f2e8d5` (parchemin), mode isolé : fond transparent + contour gold
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Gestion des sources — ordre de priorité

1. **Desktop Commander** (`C:\AI\Site Pavillon Noir\pavillon-noir`) — source principale. Claude lit les fichiers locaux en début de session. Fichier toujours sauvegardé (Ctrl+S) avant lecture.
2. **Fichiers du projet** (REPRISE_N.md) — contexte de session, lu avant toute autre chose.
3. **Connecteur GitHub (`main`)** — fallback uniquement si Desktop Commander est indisponible, ou pour vérifier qu'un commit est bien propagé sur le site live.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Évolutions méthodologiques — sessions 28–29

### 1. Accès Live Server depuis les appareils mobiles

Live Server est désormais accessible depuis tous les appareils connectés au même réseau Wi-Fi que le PC de développement.

**Configuration appliquée** :
- `liveServer.settings.host` → `0.0.0.0` dans les settings VS Code (écoute sur toutes les interfaces réseau)
- Accès depuis tablette/smartphone : `http://[IP locale du PC]:5500` (ex. `http://192.168.1.42:5500`)
- L'IP locale du PC se retrouve via `ipconfig` dans PowerShell, ligne `Adresse IPv4` sous l'adaptateur Wi-Fi

**Correction post-configuration** : passer host à `0.0.0.0` faisait ouvrir le navigateur du PC sur `0.0.0.0:5500` (inutilisable). Remis à `localhost` — le serveur continue d'écouter sur toutes les interfaces, mais le navigateur local s'ouvre bien sur `localhost:5500`.

**Prérequis pare-feu** : si un appareil mobile ne charge pas la page, vérifier que le Pare-feu Windows autorise les connexions entrantes sur le port TCP 5500.

**Usage** : vrai navigateur mobile — comportement tactile réel (absence de hover, scroll natif, taille de police système). Complémentaire à DevTools Responsive : DevTools pour itérer vite, vrai appareil pour validation finale.

### 2. Renommage du dossier de travail local

Le dossier de travail s'appelait `Backup\pavillon-noir`, nom hérité d'une conception initiale erronée (le dépôt local était pensé comme sauvegarde du site GitHub, alors que c'est l'inverse). Renommé et déplacé :

- **Ancien chemin** : `C:\AI\Site Pavillon Noir\Backup\pavillon-noir`
- **Nouveau chemin** : `C:\AI\Site Pavillon Noir\pavillon-noir`

C'est le dépôt Git local de travail — source primaire, pas une copie secondaire.

### 3. Desktop Commander — clarification de la configuration

Desktop Commander stocke sa configuration dans :
```
C:\Users\ronan\.claude-server-commander\config.json
```
Ce fichier contient notamment `allowedDirectories`. Le répertoire `C:\AI\Site Pavillon Noir` y figure — le sous-dossier `pavillon-noir` est donc accessible sans modification supplémentaire.

Desktop Commander n'est **pas** configuré dans `claude_desktop_config.json` (qui ne contient que le connecteur GitHub MCP) ni dans les settings VS Code.

### 4. Révocation du token GitHub

Le `GITHUB_PERSONAL_ACCESS_TOKEN` figurant dans `claude_desktop_config.json` a été partagé accidentellement dans le chat. Token révoqué et remplacé sur GitHub (Settings → Developer settings → Personal access tokens). Config mise à jour avec le nouveau token, Claude Desktop redémarré.

**Règle à retenir** : tout secret partagé dans un canal non prévu (chat, email, etc.) doit être considéré comme compromis et révoqué immédiatement, quelle que soit la confidentialité supposée du canal.

---

## Architecture technique — points clés `carte.js` (inchangée depuis session 27)

### Fonctions privées (convention `_`)

- `_infoMarqueurVille(villeId)` → `{ marker, ville, estPirate, taille }` — base commune aux deux `setIcone*`
- `_restaurerModeNormal()` — tronc commun de `fermerIsolation()` / `fermerZoomVille()`

### Format des données — règles actuelles

- **Contextes** (`j.contexte`, `ville.contexte`) : `Array<{ de, a?, texte }>` **ou** `string` (contexte permanent non daté, villes uniquement). `rendreContexte()` gère les deux.
- **`rendreChamp()`** gère : `string` | `true` | `false` | `Array<{ de, a?, texte }>`.
- **`rendreContexte()`** gère : `null/undefined` → `''`, `string` → retour direct, `Array` → filtre par année + join.
- **`resoudre()`** gère : objets clés-années numériques (`puissance`, `gouverneur`).

### Écartement des paires d'icônes

**6 paires détectées** (seuil 16px entre centres au zoom min) :
- Kingston / Spanish Town
- Basseterre / Fort Brimstone Hill
- Saint John's / English Harbour
- Saint-Pierre / Fort Royal
- Carthagène / Fort San Luis
- Portobelo / Fort San Lorenzo

**Variables** : `pairesChevauchement[]`, `mouseoutTimers{}`, `ecartementsActifs{}` (clé `"idA:idB"` → `{ dxA, dyA, dxB, dyB, duree }`).

**Architecture DOM** : animation sur `marker.getElement()` (conteneur Leaflet stable). CSS transitions (`transform ${duree}ms ease`). Choix délibéré — `setIcon()` recrée le DOM intérieur, invalidant toute référence intérieure.

### Recherche — `normaliser(str)`

NFD + lowercase + suppression diacritiques + tirets → espaces. Insensible aux accents, à la casse et aux tirets.

### Recherche — hiérarchie de résolution (handler Entrée)

Ordre : `vNom` → `jNom` → `vTag` → `jTag` → `valeurCompletee`. Ville avant juridiction à égalité de type de match.

---

## Ordre des sections — `carte.js` (2086 lignes)

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
10. Initialisation principale (DOMContentLoaded → initTout, initCarte, initCurseurInline, initOverlayBtns, initPanneauGauche, initFiltresMarqueurs, initRecherche + helpers afficherSuggestions, surlignerMatch, escapeHtml)
11. Rendu (renderZones, renderPins, renderVilles, majTailleIconesVilles, contourGlobalSvgCache + renderContourGlobal, majLegende)
12. Popups scénarios (ouvrirPopup, ouvrirPopupGroupe, afficherPopup, fermerPopup)
13. Panneaux droits (ouvrirPanneau, resetEtatsVisuels, fermerPanneau, fermerPanneauVille, ouvrirPanneauVille)
14. Zones — état visuel (majZone, majWeightsZones)
15. Isolation territoire (_restaurerModeNormal, fermerIsolation, isolerTerritoire)
16. Isolation ville (zoomerVille, fermerZoomVille)
17. Chevauchement icônes (calculerPairesChevauchement, ecarterVille, rapprocherVille)
```

---

## Chantiers en attente

- **Écartement icônes — comportement erratique (mouseover rapide)** — correction structurelle complète impliquerait un refactor RAF. Non entrepris délibérément (session 27). À reconsidérer si le bug devient gênant à l'usage.
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`.
