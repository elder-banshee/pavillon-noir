# Notice de reprise — Pavillon Noir, site de campagne
*À destination du prochain Claude — transition de conversation*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Ronan est novice en développement web — l'un des objectifs du projet est pédagogique : apprendre HTML, CSS et JS à travers la pratique. Le site est hébergé sur **GitHub Pages** à l'adresse `https://elder-banshee.github.io/pavillon-noir/`.

---

## Philosophie et charte graphique

Ambiance maritime et historique, vocabulaire visuel sobre et élégant :

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #d4a84b`), bleu maritime (`--sea-light: #2a5a72`), parchemin (`--parchment`), brume (`--mist`)
- **Typographies** : Cinzel (titres, labels — serif historique), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Composants** : cartes avec bordure dorée au survol, modals centrées, jauges bleu→or, grilles CSS

---

## Structure des fichiers

```
├── index.html              # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── css/
│   ├── style.css           # Styles partagés + variables CSS
│   ├── equipage.css        # Styles page équipage
│   └── chroniques.css      # Styles page chroniques
├── js/
│   ├── pnj-data.js         # Données PNJ (source de vérité)
│   ├── app.js              # Logique registre (filtres, recherche, modal)
│   ├── equipage.js         # Logique équipage (fetch Sheets, rendu, jauges)
│   ├── chroniques.js       # Logique chroniques (rail, modal, navigation)
│   ├── chroniques-data.js  # Données chroniques (source de vérité)
│   └── audio.js            # Module audio ambiant (inactif — voir §Audio)
├── pnj/
│   ├── portraits/          # Portraits PNJ (JPG/WebP, ratio 3:4)
│   └── pavillons/          # Pavillons pirates/drapeaux (PNG, ~150×75px)
├── chroniques/
│   └── covers/             # Illustrations des chroniques
└── ost/                    # Pistes audio ambiantes (MP3 — dossier vide)
```

---

## Pages et fonctionnalités

### index.html — Registre des PNJ
- Galerie filtrée par tags, recherche plein texte
- Modal au clic sur une fiche : portrait, biographie, statut, tags
- Section épinglée "Caribbean's Most Wanted" pour les PNJ majeurs
- Champ `pavillon` dans `pnj-data.js` : affiche une image de pavillon/drapeau en bas de la carte (zone où les tags étaient masqués). Format : `"pnj/pavillons/nom.png"`. `null` = espace vide.
- L'effet "drapeau ondulé" est implémenté en CSS `clip-path` sur `.pnj-flag`

**Structure d'une fiche PNJ (`pnj-data.js`) :**
```javascript
{
  id: "identifiant",
  epingle: true,           // optionnel — section Most Wanted
  visible: false,          // optionnel — masque sans supprimer
  nom: "Nom complet",
  accroche: "Rôle / surnom",
  alias: "Nom alternatif",
  statut: "actif|mort|disparu|inconnu",
  naissance: "dates",
  origine: "Nationalité",
  tags: ["Tag1", "Tag2"],
  portrait: "pnj/portraits/fichier.jpg",
  pavillon: "pnj/pavillons/fichier.png",  // null si absent
  bio: `Texte biographique…`
}
```

### equipage.html — État du bord
- Données lues depuis **Google Sheets** via URL CSV (Feuille 3 du classeur "Équipage")
- **Compétences d'équipage** : 6 valeurs (Manœuvre, Canonnade, Recharge, Combat, Tir, Ruse), affichées avec jauges gradient bleu→or
- **Jauges de compétences** : gradient calculé dynamiquement par `buildStatBar(val)` dans `equipage.js`. Échelle 0–5, cas spécial 6+. Le gradient est appliqué sur `.stat-bar` (fond), un cache `.stat-bar-reveal` ancré à droite se réduit via RAF pour révéler le gradient. Couleur du cache : `#32302d` avec dégradé de transparence sur 4px côté gauche.
- **Composition de l'équipage** : barres de proportion 0–100%, infobulle au survol affichant les stats détaillées par groupe (grille 6 colonnes × 68px)
- **Organigramme** : codé en dur dans `equipage.html`. Classes : `org-node--pj`, `org-node--pnj`, `org-node--vacant`. Structure : Commandement (Capitaine, Second, Canonnier) → Officiers mariniers (2 colonnes : Pilote/Maître d'équipage/Maître Canonnier | Maître-Charpentier/Maître-Voilier/Maître-Calfat) → Quartier-Maître → Surnuméraires (Chirurgien, Coq, Cambusier)

**Structure Google Sheets (Feuille 3) :**
- Ligne 1 : 6 valeurs numériques (compétences moyennes)
- Lignes 2+ : `Nom du groupe, effectif, man, can, rec, com, tir, ruse`

### chroniques.html — Journal de campagne
- Rail horizontal de cartes défilantes avec navire SVG animé
- La **ligne de repères temporels a été supprimée** (rythme des scénarios trop irrégulier)
- Modal au clic : navigation par pages (Accueil + Chapitres)
  - **Page Accueil** : illustration, encadrés méta (XP/Gloire/Infamie/Pièces de 8/Recrues/Pertes), extrait du scénario
  - **Pages Chapitres** : texte long en plein écran dans la modal, boutons de navigation en haut
  - Les boutons de chapitre sont générés dynamiquement depuis les clés non-null de `chapitres`
- En-tête permanent : numéro + titre à gauche, date à droite

**Structure d'une fiche chronique (`chroniques-data.js`) :**
```javascript
{
  id: "identifiant",
  visible: true,
  numero: "Scénario I",
  titre: "Titre du scénario",
  date_campagne: "Mois Année",
  illustration: "chroniques/covers/fichier.jpg",
  piste: "ost/fichier.mp3",      // piste audio associée
  extrait: "Résumé affiché sur la carte et en page Accueil",
  meta: { xp, gloire, infamie, pieces_huit, recrues, pertes },
  texte: `<p>Texte legacy — non utilisé activement</p>`,
  chapitres: {
    1: `<p>Texte HTML du chapitre 1…</p>`,
    2: `<p>Texte HTML du chapitre 2…</p>`,
    3: null   // bouton absent
  }
}
```

---

## Module audio (`js/audio.js`)

Architecture complète implémentée mais **inactive** :
```javascript
const AUDIO_ENABLED = false; // ← passer à true pour activer
```

Quand activé :
- Popup premier chargement (opt-in) avec mémorisation `localStorage`
- Bouton mute injecté dans la nav (icône SVG onde sonore)
- Crossfade entre pistes (1.5s)
- Sur la page Chroniques : changement de piste selon la carte visible dans le rail (IntersectionObserver sur le scroll)
- Pistes attendues dans `/ost/` : `registre.mp3`, `equipage.mp3`, `ile-des-ombres.mp3`, `sed.mp3`, `hippogriffe.mp3`, `marianne.mp3`, `epaves.mp3`, `courses-trinidad.mp3`

---

## Workflow de collaboration

**Contrainte principale** : le connecteur MCP GitHub est instable en écriture. Les modifications de fichiers se font donc ainsi :

1. Claude modifie ses copies locales et génère les fichiers dans `/mnt/user-data/outputs/`
2. Claude indique explicitement **quelle ligne / quel bloc** a été modifié
3. Ronan applique la modification dans **GitHub.dev** (touche `.` dans le dépôt) ou dépose le fichier téléchargé

**Synchronisation** : en début de conversation, Ronan uploade les fichiers actuels depuis GitHub. Claude les copie dans `/home/claude/` comme référence de travail. En cas de divergence, Ronan partage les fichiers GitHub et Claude met à jour ses copies.

**Note sur le copier-coller** : le chat Claude convertit parfois `b.style.width` et `b.dataset.target` en liens Markdown lors de la copie. Ce n'est qu'un artefact d'affichage — le code dans GitHub reste correct. Vérifier dans l'éditeur GitHub (coloration syntaxique bleue = normal).

---

## État actuel — chantiers ouverts

- **Pavillons** : dossier `pnj/pavillons/` à créer, images à déposer. Noms attendus : `bellamy.png`, `hornigold.png`, `teach.png`, `vane.png`, `rackham.png` (+ tous les autres capitaines/PNJ concernés). Le champ `pavillon` dans `pnj-data.js` est prêt sur 5 fiches de test.
- **Illustrations chroniques** : dossier `chroniques/covers/` à alimenter. Actuellement toutes sur `en-cours.jpg`.
- **Textes des chroniques** : champ `chapitres` prêt dans `chroniques-data.js`, textes à rédiger et intégrer (HTML avec `<p>`, `<h3>` supportés).
- **Audio** : pistes à créer/mixer (boucles sans clic au point de jonction). Activer ensuite `AUDIO_ENABLED = true` dans `audio.js`.
- **Renommage d'un dossier** dans GitHub : sujet en suspens au moment de la transition. Via GitHub.dev (touche `.`), glisser-déposer les fichiers puis supprimer le dossier vide. Ou via `git mv` en ligne de commande.

---

## Points de vigilance techniques

- **`background-size` sur les gradients** : approche abandonnée pour les jauges de compétence — elle produisait des gradients incorrects. La solution retenue est gradient sur le conteneur `.stat-bar`, cache `.stat-bar-reveal` ancré à droite.
- **Double `requestAnimationFrame`** : nécessaire pour que les transitions CSS se déclenchent correctement après insertion DOM. `rAF(() => rAF(() => { ... }))` — ne pas simplifier en un seul RAF.
- **Point-virgule après couleur** dans `.stat-bar-reveal` : `background: #32302d;` — l'oublier invalide silencieusement la `transition` qui suit.
- **`<h3>` vs `<div>`** pour les sous-titres : les `<h3>` reçoivent `font-weight: bold` par défaut navigateur. Ajouter `font-weight: 700` explicitement sur tous les titres de même niveau pour harmoniser.
- **Cache navigateur Google Sheets** : les modifications de la Sheets peuvent mettre quelques minutes à se propager. Tester avec l'URL CSV directement avant de diagnostiquer un bug.
