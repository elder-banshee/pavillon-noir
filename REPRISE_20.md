# Notice de reprise — Pavillon Noir, site de campagne
*Session 20 — recherche fantôme, tri suggestions, intégration villes dans la recherche*

---

## Contexte général

Site statique accompagnant une **campagne de jeu de rôle Pavillon Noir** (pirates des Caraïbes, 1713–1720 environ), développé par Ronan avec l'assistance de Claude. Hébergé sur **GitHub Pages** : `https://elder-banshee.github.io/pavillon-noir/`.

**Relation de travail** : tutoiement, relation de collègues. Claude désigne précisément les fichiers, lignes et blocs à modifier pour que Ronan puisse les appliquer dans VS Code. Pour les fichiers entiers, Claude génère un fichier téléchargeable via `present_files`.

---

## Philosophie et charte graphique

- **Palette** : fond brun-noir (`--ink: #0e0c09`), or (`--gold: #c8973a`, `--gold-light: #e2b96a`), bleu maritime (`--sea: #1a3a4a`, `--sea-light: #2a5a72`), parchemin (`--parchment: #f2e8d5`, `--parchment2: #e8d9bc`), brume (`--mist: #6b7c8a`, `--mist-light: #8fa5b4`), bordure (`--border: rgba(200,151,58,0.3)`)
- **Typographies** : Cinzel (titres, labels), IM Fell English (italiques, accroches), Crimson Text (corps de texte long)
- **Ton** : pas de couleurs vives, pas d'effets tapageurs. Borders fines, transparences subtiles, animations discrètes (0.2–0.8s)
- **Mobile** : sobre, pleine largeur, sans effets décoratifs superflus

---

## Structure des fichiers

```
├── index.html              # Page d'accueil — portail de navigation
├── pnj.html                # Registre des PNJ
├── equipage.html           # État du bord
├── chroniques.html         # Journal de campagne
├── carte.html              # Carte géopolitique des Caraïbes
├── css/
│   ├── style.css           # Styles globaux partagés
│   ├── pnj.css
│   ├── equipage.css
│   ├── chroniques.css
│   └── carte.css
├── js/
│   ├── pnj-data.js         # Données PNJ
│   ├── pnj.js              # Logique registre
│   ├── equipage.js
│   ├── chroniques.js
│   ├── chroniques-data.js
│   ├── carte.js            # Logique Leaflet principale
│   ├── carte-data.js       # Juridictions, pins, données géopolitiques
│   ├── villes-data.js      # Données villes (40+ entrées)
│   ├── zones-data.js       # Contours territoriaux
│   ├── audio.js
│   └── mobile-nav.js
```

---

## Workflow de développement

- **Branches Git** : `main` (production, toujours à jour) et `dev` (développement)
- **Outils locaux** : VS Code + extension Live Server
- **Workflow** : modifier dans VS Code → tester → commit sur `dev` → merger dans `main`
- **Lecture des fichiers** : utiliser le connecteur GitHub sur `main`. Édition sur `dev`.

---

## Chantiers accomplis en session 20

### Surbrillance dans les suggestions de recherche (`carte.css`)

Le fond jaune navigateur des `<mark>` dans les suggestions était disgracieux. Correction dans `carte.css` :
```css
.carte-recherche-highlight {
  background: transparent;
  color: var(--parchment);
  font-style: normal;
  font-weight: 600;
}
```
La clé était `background: transparent` — le style navigateur par défaut de `<mark>` impose un fond jaune qu'il faut explicitement neutraliser.

### Autocomplétion fantôme dans la recherche (`carte.html` + `carte.css` + `carte.js`)

Implémentation identique à `pnj.js` — un `<span>` fantôme positionné derrière le champ, affichant le nom complet de la première suggestion qui **commence par** la frappe.

**`carte.html`** — dans `.carte-recherche-wrap`, après l'`<input>` :
```html
<span class="carte-recherche-fantome" id="carte-recherche-fantome" aria-hidden="true"></span>
```

**`carte.css`** — après `.carte-recherche-input:focus` :
```css
.carte-recherche-fantome {
  position: absolute;
  top: 0;
  left: 0;
  right: 2rem;
  padding: 0.5rem 0 0.5rem 0.65rem;
  font-family: 'Crimson Text', serif;
  font-size: 0.95rem;
  color: var(--mist);
  opacity: 0.45;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  line-height: normal;
}
```

**`carte.js`** — `initRecherche()` entièrement remplacée (voir ci-dessous, section « État de carte.js »).

### Tri intelligent des suggestions

Dans `afficherSuggestions()`, les résultats sont maintenant triés : noms commençant par la frappe en premier, puis alphabétique dans chaque groupe. Bloc à insérer juste avant `.slice(0, 12)` :
```javascript
resultats.sort((a, b) => {
  const aNom = a.juridiction.nom.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const bNom = b.juridiction.nom.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const aDebut = aNom.startsWith(qLow) ? 0 : 1;
  const bDebut = bNom.startsWith(qLow) ? 0 : 1;
  if (aDebut !== bDebut) return aDebut - bDebut;
  return aNom.localeCompare(bNom, 'fr');
});
```

---

## État de `carte.js` — `initRecherche()` (version finale session 20)

```javascript
function initRecherche() {
  const input = document.getElementById('carte-recherche-input');
  const suggestions = document.getElementById('carte-recherche-suggestions');
  const clear = document.getElementById('carte-recherche-clear');
  const fantome = document.getElementById('carte-recherche-fantome');
  if (!input || !suggestions || !clear) return;

  function getSuggestion(q) {
    if (!q) return '';
    const qLow = q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const j = JURIDICTIONS.find(j => {
      if (j.visible_mj && !modeMJ) return false;
      const nomLow = j.nom.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      return nomLow.startsWith(qLow);
    });
    return j ? j.nom : '';
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clear.style.display = q ? '' : 'none';
    if (fantome) fantome.textContent = '';
    if (q.length < 1) { suggestions.innerHTML = ''; return; }

    afficherSuggestions(q, suggestions);

    const sugg = getSuggestion(q);
    if (fantome && sugg) {
      fantome.textContent = q + sugg.slice(q.length);
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    clear.style.display = 'none';
    suggestions.innerHTML = '';
    if (fantome) fantome.textContent = '';
    fermerIsolation();
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && fantome && fantome.textContent) {
      e.preventDefault();
      input.value = fantome.textContent;
      fantome.textContent = '';
      suggestions.innerHTML = '';
      const q = input.value.trim();
      const j = JURIDICTIONS.find(j => j.nom === q);
      if (j) isolerTerritoire(j.id);
      return;
    }

    const items = suggestions.querySelectorAll('.carte-recherche-suggestion');
    if (!items.length) return;
    const actif = suggestions.querySelector('.carte-recherche-suggestion--active');
    let idx = actif ? [...items].indexOf(actif) : -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (actif) actif.classList.remove('carte-recherche-suggestion--active');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('carte-recherche-suggestion--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (actif) actif.classList.remove('carte-recherche-suggestion--active');
      idx = (idx - 1 + items.length) % items.length;
      items[idx].classList.add('carte-recherche-suggestion--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (actif) actif.click();
      else if (items.length === 1) items[0].click();
    } else if (e.key === 'Escape') {
      fermerIsolation();
      input.value = '';
      clear.style.display = 'none';
      suggestions.innerHTML = '';
      if (fantome) fantome.textContent = '';
    }
  });
}
```

---

## Chantier en cours — intégration des villes dans la recherche

### Décisions prises

**Comportement au clic sur une ville dans les suggestions :**
1. Basculer la carte en opacity 0.05 (comme l'isolation territoire)
2. Masquer l'icône de la ville pendant le zoom (éviter les artefacts de mise à l'échelle par palier)
3. `flyTo` sur la ville avec animation
4. Réafficher l'icône une fois le zoom stabilisé
5. Ouvrir le panneau ville

**Visibilité des villes :** temporairement en mode MJ seulement (en attendant validation des données), mais la recherche doit rester accessible à tous dès maintenant — les panneaux ville seront verrouillés hors mode MJ ultérieurement.

**Tags villes :** champ `tags:` à ajouter dans `villes-data.js` pour chaque ville (noms alternatifs, variantes linguistiques). La recherche interrogera ensuite `VILLES` en plus de `JURIDICTIONS`.

### Tags à supprimer de `carte-data.js` (déjà décidé, non encore appliqué)

Les modifications suivantes sont **en attente d'application dans VS Code** :

**`jamaique`** : supprimer `'Kingston'`, `'Port Royal'`, `'Spanish Town'`
```javascript
// Avant :
tags: ['Jamaïque', 'Jamaica', 'Kingston', 'Port Royal', 'Spanish Town'],
// Après :
tags: ['Jamaïque', 'Jamaica'],
```

**`saint-domingue`** : supprimer `'Cap-Français'`, `'Cap Haïtien'`
```javascript
// Avant :
tags: ['Saint-Domingue', 'Cap-Français', 'Cap Haïtien', 'Port-de-Paix', 'Haïti'],
// Après :
tags: ['Saint-Domingue', 'Haïti', 'Port-de-Paix'],
```

**`cuba`** : supprimer `'La Havane'`, `'Havana'`, `'La Habana'`, `'Santiago de Cuba'`, `'Matanzas'`
```javascript
// Avant :
tags: ['Cuba', 'La Havane', 'Havana', 'La Habana', 'Santiago de Cuba', 'Bayamo', 'Matanzas', 'Camagüey'],
// Après :
tags: ['Cuba', 'Bayamo', 'Camagüey'],
```

**`porto-rico`** : supprimer `'San Juan'`
```javascript
// Avant :
tags: ['Porto Rico', 'Puerto Rico', 'San Juan', 'Borinquen'],
// Après :
tags: ['Porto Rico', 'Puerto Rico', 'Borinquen'],
```

**`nouvelle-grenade`** : supprimer `'Carthagène'`, `'Cartagena'`
```javascript
// Avant :
tags: ['Nouvelle-Grenade', 'Castilla del Oro', 'Santafé de Bogotá', 'Carthagène', 'Cartagena', 'Antiochia'],
// Après :
tags: ['Nouvelle-Grenade', 'Castilla del Oro', 'Santafé de Bogotá', 'Antiochia'],
```

**`cartagena`** : supprimer l'entrée entière de `carte-data.js` (elle migre dans `villes-data.js`).

**Tags conservés en place (ne pas toucher) :**
- `caroline-du-sud` : garder `'Charles Town'`, `'Charleston'` (pas de ville dans villes-data.js)
- `floride` : garder `'Saint-Augustin'`, `'San Agustín'`, `'Saint Augustine'`
- `louisiane` : garder `'Mobile'`, `'Nouvelle-Orléans'`, `'New Orleans'`
- `new-providence` : garder `'Nassau'` (juridiction, pas ville dans villes-data.js)

### Entrée `cartagena` à ajouter dans `villes-data.js`

À insérer dans la Série 2 (Antilles espagnoles & Terre Ferme), après `bocachica` et avant `maracaibo` :

```javascript
{
    id: 'cartagena',
    nom: 'Carthagène de Indias',
    capitale: true,
    type: 'port',
    territoire: 'nouvelle-grenade',
    coords: null,
    tags: ['Carthagène', 'Cartagena', 'Carthagène de Indias'],

    contexte: `Principal port de sortie de l'empire espagnol sur la côte Caraïbe de Terre Ferme — l'or d'Antioquia, les émeraudes de Muzo, le cacao du Venezuela y transitent avant d'embarquer pour Cadix via La Havane. Carthagène est aussi l'un des grands marchés de l'Asiento — le commerce d'esclaves africains concédé aux Anglais depuis 1713.\n\nLe <strong>Château de Bocachica</strong> contrôle l'unique chenal d'accès à la baie intérieure ; les murailles de la ville, renforcées après le sac de Francis Drake (1586) et celui du baron de Pointis (1697), forment une enceinte quasi continue. La garnison est la plus nombreuse de toute la côte Caraïbe espagnole. Prendre Carthagène de force est hors de portée d'un équipage pirate — mais la contourner, la renseigner, ou en corrompre les douaniers est une autre affaire.`,

    population: `~20 000 habitants (dont une forte proportion d'esclaves africains et d'affranchis)`,

    garnison: `Fort Bocachica + Fort San Fernando (rive opposée du chenal) : ~200 soldats. Garnison de la ville intra-muros : ~300 soldats supplémentaires. Total estimé : ~500 hommes. Estimation d'après McFarlane, Colombia before Independence (1993).`,

    note_mj: `✅ Sac de Pointis 1697 — dernier grand assaut réussi contre Carthagène avant Vernon en 1741 : établi.\n✅ Asiento anglais (South Sea Company) depuis Utrecht 1713 : établi.\n⚠️ Gouverneur militaire 1712 : non identifié depuis les sources accessibles.\nCarthagène est une alcaldía mayor et place militaire distincte de la Présidence de Santafé — son gouverneur militaire propre n'est pas subordonné au gouverneur civil de la Nouvelle-Grenade pour les affaires militaires.`,
},
```

### Prochaines étapes (à implémenter en session 21)

1. **Appliquer les modifications `carte-data.js`** (tags ci-dessus) dans VS Code
2. **Ajouter l'entrée `cartagena`** dans `villes-data.js`
3. **Ajouter le champ `tags:`** à chaque entrée de `villes-data.js`
4. **Modifier `afficherSuggestions()`** dans `carte.js` pour interroger aussi `VILLES`
5. **Implémenter le comportement au clic sur une ville** dans les suggestions (flyTo + masquage icône + panneau)

---

## Architecture technique — page carte

### Couche villes (mode MJ)

- `renderVilles()` — visible uniquement en mode MJ, filtrée par `filtre-villes`
- `ouvrirPanneauVille(villeId)` — panneau droit partagé avec zones
- `fermerPanneauVille()` — ferme le panneau
- `villeActive` — état global (null ou id de la ville ouverte)
- `markersVilles` — dictionnaire des marqueurs Leaflet par id de ville
- `tailleIconeVille()` — taille adaptative au zoom : zoom≥1→96px, zoom≥-1→48px, sinon 24px
- `carte.on('zoomend', () => { if (modeMJ) renderVilles(); })` — rechargement au zoom

### Marqueurs SVG villes (`villeSVG(type, estCapitale)`)

- Carré arrondi (rx=4) comme fond commun
- Port : ancre marine SVG
- Fort : carré intérieur + deux diagonales en X
- Ville : maison/bâtiment simplifié
- `capitale: true` → couleur or (`var(--gold)`) ; absence → mist (`var(--mist)`)

### Coordonnées

Pixels 8500×5320, même référentiel que les pins. Saisies depuis Photoshop F8. `pixelToLatLng(x, y)` convertit automatiquement (inverse axe Y). Les entrées sans coordonnées encore saisies ont `coords: null`.

### Filtres marqueurs

```html
<div class="carte-filtres-marqueurs">
  <label class="carte-filtre-check" id="filtre-scenarios">
    <input type="checkbox" checked>
    <span class="carte-filtre-pastille">⚑</span> Scénarios
  </label>
  <label class="carte-filtre-check" id="filtre-villes">
    <input type="checkbox" checked>
    <span class="carte-filtre-pastille">⌂</span> Villes
  </label>
</div>
```

### Séquence secrète mode MJ

Cliquer dans l'ordre : Eleuthera → Marguerita → Jamaïque → puis cliquer sur l'Île du Maïs → confirmer dans la popup.

---

## Points de vigilance et dette connue

- **`resoudre()` dans `carte-data.js`** fait référence à `modeMJ` (défini dans `carte.js`) : dépendance croisée implicite, fonctionnel, à garder en tête
- **`j.note` dans `ouvrirPanneau()`** : aucune juridiction ne possède ce champ actuellement — réservé pour des observations joueurs au fil des aventures. Ne pas supprimer
- **`villes-data.js` chargé après `carte-data.js` et avant `carte.js`** dans `carte.html` — ordre des scripts important
- **Le panneau droit est partagé zones/villes** — ouvrir une ville ferme une zone et vice versa
- **`hippogriffe` dans `chroniques-data.js`** : champ `rapport: "chroniques/rapports/marianne.md"` — nom de fichier à confirmer avec Ronan

---

## Chantiers ouverts

- **Intégration villes dans la recherche** — voir section « Chantier en cours » ci-dessus
- **Verrouillage panneaux villes hors mode MJ** — à implémenter quand les données seront validées (les villes seront publiques dès la prochaine session)
- **Visuel icône spécial villes en mode isolation** — à implémenter ultérieurement après validation du visuel standard
- **Coordonnées manquantes** dans `villes-data.js` : `mobile`, `saint-georges-bermudes`, `fort-san-lorenzo` ont `coords: null`
- **Brand "Pavillon Noir" dans la nav** : idée en réserve
- **Audio** : créer les pistes, activer `AUDIO_ENABLED = true`
- **Illustrations chroniques** : alimenter `chroniques/covers/`
- **Rapports des chroniques** : rédiger et déposer dans `chroniques/rapports/`
- **Champ `note`** dans `carte-data.js` : à renseigner au fil des aventures pour les observations joueurs
