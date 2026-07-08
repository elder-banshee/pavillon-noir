# Notice de reprise — Pavillon Noir, site de campagne
*Session 26 — réordonnancement global de `carte.js`*

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

1. **Connecteur GitHub (`main`)** — source principale pour le code de référence. Claude le consulte en début de session.
2. **Fichiers du projet** (REPRISE_N.md + dépôt partagé) — contexte de session et fallback si le connecteur est indisponible.
3. **Desktop Commander** (`C:\AI\Site Pavillon Noir\Backup\pavillon-noir`) — édition directe et diagnostic. Fichier toujours sauvegardé (Ctrl+S) avant lecture.

---

## Résolution de problèmes — principe général

Avant de proposer un contournement (garde défensif, `try/catch`, vérification préventive), chercher d'abord à désamorcer le problème à la source. Un patch masque le symptôme ; une correction structurelle supprime la cause.

---

## Chantier accompli en session 26

### Réordonnancement global de `carte.js`

Le fichier a été entièrement réordonné via Desktop Commander, section par section, avec vérification dans Live Server après chaque déplacement. Le fichier fait **~2071 lignes** à l'issue de la session (stable — aucune logique modifiée, uniquement des déplacements et une suppression).

#### Suppression

- **Doublon `fermerPanneauVille`** supprimé — la version résiduelle (4 lignes, appelait `resetEtatsVisuels`) a été retirée. La version conservée (avec `setIconeVilleActive` + `rapprocherVille`) est celle de la session 25.

#### Ordre final des sections

```
1.  Variables globales
    — état carte, overlays, isolation, villes, MJ
    — filtres de légende (puissancesMasquees, paliersMasques*)

2.  Constantes et paliers
    — OVERLAY_LABELS
    — DENSITE_PALIERS, ESCLAVAGE_PALIERS, AUTOCHTONES_COULEURS
    — WEIGHTS, ZOOM_FACTEUR

3.  Utilitaires purs (sans effet de bord, sans DOM)
    — pixelToLatLng()
    — normaliser()
    — weightPourZoom()
    — rendreChamp()
    — rendreContexte()
    — lireTranslate3d()

4.  Fonctions de couleur overlay
    — couleurDensite(), couleurEsclavage()
    — resoudreStatutAutochtone(), couleurAutochtone()

5.  Calcul / année
    — calculerAnneeMax() + ANNEE_MAX_MJ

6.  SVG builders
    — pinSVG(), villeSVG()

7.  Icônes villes — helpers
    — tailleIconeVille(), labelVille()
    — _infoMarqueurVille()
    — setIconeVilleActive(), setIconeVilleIsoleeHover()

8.  Séquence secrète MJ
    — enregistrerClicSequence()
    — ouvrirPopupConfirmationMJ(), confirmerModeMJ(), annulerModeMJ()

9.  Utilitaires UI (avec effet DOM mineur)
    — masquerEcranChargement()
    — fermerTooltipsOrphelins()
    — positionnerBoutonsZoom()

10. Initialisation principale
    — DOMContentLoaded → initTout()
    — initCarte() (avec tous ses handlers internes)
    — initCurseurInline()
    — initOverlayBtns()
    — initPanneauGauche()
    — initFiltresMarqueurs()
    — initRecherche()
    — afficherSuggestions(), surlignerMatch(), escapeHtml()

11. Rendu
    — renderZones()
    — renderPins()
    — renderVilles()
    — majTailleIconesVilles()
    — renderContourGlobal() + let contourGlobalSvgCache
    — majLegende()

12. Popups scénarios
    — ouvrirPopup(), ouvrirPopupGroupe(), afficherPopup(), fermerPopup()

13. Panneaux droits
    — ouvrirPanneau()
    — resetEtatsVisuels()
    — fermerPanneau(), fermerPanneauVille()
    — ouvrirPanneauVille()

14. Zones — état visuel
    — majZone()
    — majWeightsZones()

15. Isolation territoire
    — _restaurerModeNormal()
    — fermerIsolation()
    — isolerTerritoire()

16. Isolation ville
    — zoomerVille()
    — fermerZoomVille()

17. Chevauchement icônes
    — calculerPairesChevauchement()
    — ecarterVille(), rapprocherVille()
```

#### Notes d'architecture

- `resoudreStatutAutochtone` a rejoint la section 4 (fonctions couleur) — elle est un helper interne à `couleurAutochtone`, pas un utilitaire générique.
- `afficherSuggestions`, `surlignerMatch`, `escapeHtml` sont en section 10 (init) — helpers internes à `initRecherche`, pas des utilitaires purs.
- `majZone` et `majWeightsZones` restent en section 14, séparées de `renderZones` — elles opèrent sur des couches déjà rendues (mise à jour partielle), pas sur un rendu complet.
- `contourGlobalSvgCache` (`let`) est déclaré immédiatement avant `renderContourGlobal` en section 11 — couplage fort justifié (cache privé de la fonction).
- `ANNEE_MAX_MJ` (`const` initialisée par appel de fonction) est en section 5, après que `JURIDICTIONS` soit disponible (garanti par l'ordre des `<script>` dans le HTML, pas par la position dans `carte.js`).

---

## Architecture technique — points clés `carte.js`

### Fonctions privées (convention `_`)

- `_infoMarqueurVille(villeId)` → `{ marker, ville, estPirate, taille }` — base commune aux deux `setIcone*`
- `_restaurerModeNormal()` — tronc commun de `fermerIsolation()` / `fermerZoomVille()`

### Format des données — règles actuelles

- **Contextes** (`j.contexte`, `ville.contexte`) : toujours `Array<{ de, a?, texte }>`. Le format `versions:` n'existe plus nulle part.
- **`rendreChamp()`** gère : `string` | `true` | `false` | `Array<{ de, a?, texte }>`.
- **`rendreContexte()`** gère uniquement : `null/undefined` → `''`, `Array` → filtre par année + join.
- **`resoudre()`** gère : objets clés-années numériques (`puissance`, `gouverneur`).

---

## Chantiers en attente (non traités en session 26)

- **Latence `flyTo`** — glissement des `divIcon` pendant l'animation Leaflet. Piste explorée en session 22 (pré-calcul trajectoires via RAF) — non implémentée.
- **Superficies et densités** — recalcul prévu pour plusieurs territoires modifiés dans `zones-data.js`.
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true` dans `audio.js`.
- **Pavillons** : continuer à alimenter `pnj/pavillons/`.
- **Textes des chroniques** : rédiger et intégrer dans `chroniques/rapports/`.
