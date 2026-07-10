# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

**Ton et relation de travail** : tutoiement, relation de collègues. Claude indique systématiquement les lignes/blocs modifiés pour que Ronan puisse appliquer les changements manuellement dans GitHub.dev — c'est intentionnel et pédagogique. Pour les fichiers entiers à créer ou remplacer, Claude génère un fichier téléchargeable via `present_files`. Claude maintient une copie locale de référence si l'environnement le permet.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`), brume claire (`--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus (rail marin et navire désactivés sur chroniques)

---

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── css/
│   ├── style.css           # Styles globaux partagés (NE PAS SUPPRIMER)
│   ├── pnj.css             # Styles spécifiques registre PNJ
│   ├── equipage.css        # Styles spécifiques équipage
│   └── chroniques.css      # Styles spécifiques chroniques
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── pnj.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation, fetch rapports)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   ├── audio.js            # Module audio ambiant (inactif)
│   └── mobile-nav.js       # Navigation mobile flottante
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4, 600×800px)
│   └── pavillons/          # Pavillons SVG/PNG
├── chroniques/
│   ├── covers/             # Illustrations chroniques (+ en_cours.jpg pour placeholder)
│   └── rapports/           # Textes des chroniques en Markdown (un fichier par scénario)
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## Chantiers accomplis en session 12

### Refonte complète de la navigation modale des chroniques

L'ancienne navigation (basculement `nav--compacte` par détection de débordement DOM) a été entièrement remplacée par un système de pagination robuste.

**Architecture finale** :

- `navPaginee` (booléen) : état de pagination pour la session modale courante. Réinitialisé à `false` à l'ouverture et au retour à la page accueil.
- `navGroupeDebut` (entier) : index du premier chapitre du groupe affiché en mode paginé.
- `navGroupeTaille` (entier, défaut 5) : taille du groupe, calculée dynamiquement par `calculerGroupe()`.
- `NAV_GROUPE` : constante de fallback (5), utilisée si la mesure échoue.

**Détection de pagination — `calculerGroupe(chapitresDispos, avecAccueil)`** :
Mesure chaque bouton individuellement dans un **conteneur fantôme** invisible (`position: absolute; top: -9999px`), aux mêmes styles que la nav réelle (gap, padding, largeur de la modal). Additionne les boutons un par un en réservant la place pour les flèches, et retourne `{ taille, deborde }`. Aucune valeur fixe codée en dur — le navigateur fait le calcul.

**`buildNavBruts()`** : fonction auxiliaire qui génère les boutons sans handlers (pour mesure uniquement).

**`buildNav(chapitresDispos, avecAccueil, paginee)`** :
- Mode non paginé : tous les chapitres, `"Chapitre I"` desktop / `"I"` mobile.
- Mode paginé : groupe de `navGroupeTaille` chapitres + flèches ← → si nécessaire, encapsulés dans `.chrono-nav-groupe` pour le centrage CSS.
- Bouton retour : `"Accueil"` desktop / `"↩"` mobile.
- Toutes flèches et bouton Accueil en `var(--gold)`.

**Navigation séquentielle** : liens `← Chapitre X / Chapitre Y →` en bas de chaque chapitre. Ces liens appellent `goToPage(idx, 'seq')` qui recentre la fenêtre sur le chapitre actif. Les boutons de nav appellent `goToPage(idx, 'nav')` qui conserve `navGroupeDebut` intact.

**`navGroupe(direction)`** : déplace le groupe de `navGroupeTaille` positions. Préserve `modal.scrollTop` pour ne pas remonter la modal lors du changement de groupe.

**Retour à l'accueil** : remet `navGroupeDebut = 0`, `navPaginee = false`, `navGroupeTaille = 5` pour recalculer sans bouton Accueil.

### Sommaire mobile

Élément `"Sommaire"` réintroduit au-dessus de la nav du bas (page accueil, mobile uniquement), sans marges négatives. Architecture propre : `.modal-chrono-sommaire-wrap` (label seul) est un élément frère de la `<nav>`, pas un parent.

```html
<div class="modal-chrono-sommaire-wrap">
  <div class="modal-chrono-sommaire">Sommaire</div>
</div>
<nav class="modal-chrono-nav modal-chrono-nav--bas ...">...</nav>
```

La bordure haute de `.modal-chrono-nav--bas` est annulée en mobile via le media query (le wrapper la remplace).

### Correctif modal — overflow horizontal

`overflow-x: hidden` ajouté sur `.modal--chronique` pour éviter la scrollbar horizontale quand la nav débordait avant activation de la pagination.

## Chantiers accomplis en session 12 (suite — corrections nav mobile)

### Corrections nav mobile

- **Padding `mesurerNav()`** : le padding desktop (`1rem 1.5rem`) était utilisé à tort en mobile. Corrigé à `0.75rem 1.25rem` mobile / `1rem 2rem` desktop — la mesure fantôme est maintenant fiable sur les deux formats.
- **Suppression de `↩`** en mobile : le bouton retour accueil est supprimé sur mobile, libérant de la place pour les flèches. `NAV_GROUPE = 5` reste valable sur tous les formats.
- **Titre cliquable en mobile** : `.modal-chrono-num` et `.modal-chrono-titre` déclenchent `goToPage(null)` au tap en mobile (`onclick="if(window.innerWidth<=700)goToPage(null)"`), avec `cursor: pointer`.
- **Boutons flèche** : `font-size` aligné sur `0.8rem` (comme les boutons chapitre), `aspect-ratio: 1` pour un format carré.
- **Espace avant Sommaire** : `margin-bottom: 1.5rem` ajouté à `.modal-chrono-resume` en mobile, pour équilibrer avec l'espace entre les meta et le résumé.

### Convention éditoriale — conclusions de rapport

Les conclusions en italique des rapports Markdown doivent être balisées en blockquote pour recevoir le style `color: var(--mist-light)` sans affecter les italiques du corps de texte :

```markdown
> *Texte de la conclusion...*
>
> *— Initiales*
> *Lieu, date*
```

CSS correspondant dans `.modal-chrono-body--chapitre .rapport-md blockquote` :
```css
color: var(--mist-light);
border-left: none;
padding-left: 0;
font-style: italic;
```

---

## Groupe fixe de 5 — décision finale

Le groupe de navigation est fixé à **5 chapitres** (`NAV_GROUPE = 5`), identique sur la page accueil et sur les pages chapitre. Cette constance est intentionnelle : elle garantit la cohérence de la nav entre les deux contextes.

**Historique de la question** : une approche de groupe dynamique (`calculerGroupe()`) a été explorée en session 12, avec mesure réelle des boutons via conteneur fantôme. Elle permettait d'afficher 6 chapitres au premier groupe (page accueil, sans bouton Accueil), mais causait des débordements sur les groupes du milieu (← et → simultanées). La logique correcte pour gérer les deux flèches est :

```js
// Réserver une flèche dans la boucle, puis soustraire 1 pour les groupes non-finaux
const ajout = btns[i] + (i === 0 ? 0 : gapPx);
if (total + ajout + largeurFleche + gapPx > dispo) break;
total += ajout;
groupe++;
// ...
const estDernier   = groupe >= btns.length;
const tailleFinale = !estDernier ? Math.max(groupe - 1, 1) : groupe;
return { taille: Math.max(tailleFinale, 1), deborde: true };
```

Cette approche n'a pas été retenue : la version à groupe fixe de 5 est plus simple, plus prévisible, et suffisamment satisfaisante visuellement grâce au centrage CSS.

---

## Chantiers ouverts

### Prioritaire

- **Rapports des chroniques II à VI** : rédiger et déposer dans `chroniques/rapports/`

### Autres chantiers ouverts (inchangés depuis session 11)

- **Icônes SVG dans les hero** : remplacer le ☠ Unicode dans `.hero-divider-icon`
- **Bordures du `.hero-divider`** : disparaissent à certains niveaux de zoom (< 80%) — cosmétique
- **Espace vacant bas de carte PNJ** : réfléchir à une information pertinente
- **Crédits — titre cliquable avec infobulle** : afficher le titre de l'œuvre, info complète au survol
- **Brand "Pavillon Noir" dans la nav** : actuellement un `<span>` inerte
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`
- **Pavillons** : continuer à alimenter `pnj/pavillons/`
- **Réorganisation des médias** : `/pnj/portraits/`, `/pnj/pavillons/`, `/chroniques/covers/` → `/pics/pnj/`, `/pics/flags/`, `/pics/stories/`
- **Bandeau défilant dans la nav fixe** : idée en réserve
- **Factorisation CSS** : `.site-card` et `.badge` comme classes communes
- **Navigation précédent/suivant en bas de chapitre** : ✅ implémenté en session 12
- **Icône phare pour le bouton retour** : idée en réserve (remplacer `↩` / `Accueil`)

---

## Points de vigilance techniques

- **`mesurerNav()` padding** : `'0.75rem 1.25rem'` mobile / `'1rem 2rem'` desktop — doit correspondre exactement au padding CSS de `.modal-chrono-nav`.
- **Titre cliquable mobile** : `onclick="if(window.innerWidth<=700)goToPage(null)"` sur `.modal-chrono-num` et `.modal-chrono-titre` — retour accueil par tap sur le titre en mobile.
- **Conclusions de rapport** : baliser en blockquote `>` pour le style brume, convention à respecter dans tous les futurs rapports.
- **`style.css` ≠ optionnel`** : toutes les variables CSS sont dedans.
- **`marked.js`** : chargé depuis cdnjs dans `chroniques.html` avant `chroniques.js`.
- **`overflow-x: hidden` sur `.modal--chronique`** : intentionnel, empêche la scrollbar horizontale.
- **`overflow: hidden` retiré de `.modal-chrono-nav`** : la pagination est désormais gérée par calcul (fantôme), pas par mesure DOM. `overflow: hidden` sur la nav rendait `scrollWidth` inutilisable.
- **`.modal-chrono-sommaire-wrap`** : `display: none` en desktop, `display: block` en mobile via media query. Élément frère de la nav, pas parent.
- **`.modal-chrono-nav--bas`** : `border-top` annulé en mobile (`@media (max-width: 700px)`) car le wrapper Sommaire le remplace.
- **`.modal-chrono-nav--paginee`** : `justify-content: center` — centrage en mode paginé.
- **`.chrono-nav-groupe`** : `display: flex; justify-content: center` — encapsule les boutons paginés pour le centrage.
- **`navGroupe()`** : sauvegarde et restaure `modal.scrollTop` — les flèches ne remontent pas la modal.
- **`goToPage(idx, source)`** : `source = 'seq'` depuis les liens séquentiels (recentre la fenêtre), `'nav'` depuis les boutons nav (conserve `navGroupeDebut`).
- **GitHub Pages** : latence de propagation parfois significative. Toujours vérifier avec Ctrl+Shift+R.
- **Convention fichiers `.md`** : pas de `#` ou `##` avant le premier chapitre numéroté.

---

## Workflow de collaboration

1. Claude indique fichier + ligne/bloc à modifier
2. Ronan applique dans **GitHub.dev** (touche `.` dans le dépôt GitHub)
3. Pour les fichiers entiers : Claude génère via `present_files`, Ronan télécharge et dépose
4. Claude maintient copie locale si l'environnement le permet
