# REPRISE_74 — Zones de navigation (fluviale/côtière/hauturière) + fiche navire

Session du 10 juillet 2026, suite directe du REPRISE_73. Sujet parti d'une
question fermée (« que signifie décider de typeZoneNavigationEnPoint ? »)
et développé en conversation avec Ronan (partiellement en session nomade,
Desktop Commander indisponible) jusqu'à une fonctionnalité complète :
classification géographique des eaux + refonte de l'affichage des
aptitudes navire selon les conditions.

## Décisions prises en conversation (contexte pour la suite)

- Seules **deux zones sont taguées explicitement** sur la grille OSCAR :
  fluviale et côtière. Toute cellule non taguée est haute mer par défaut
  (l'immense majorité des cellules) — décision de Ronan, pas de bascule
  de type "zonesNavigationExplicites", le comportement par défaut suffit.
- `restrictionNav` (ships-data.js) n'a pas eu besoin de changer de forme :
  le modèle sparse existant (clés fluviale/cotiere/hauturiere, valeur
  malus ou 'interdit') exprime déjà aussi bien "cette zone précise a un
  malus" que "toute autre zone a un malus" (il suffit de renseigner
  plusieurs clés). Deux nouveaux champs seulement : `perimetreNaturel`
  (zone par défaut à l'affichage) et `origineExotique` (indépendant,
  n'affecte aucun calcul).
- **"Exotique" a préséance sur le badge de zone partout** — bandeau-titre
  de la modale ET puce du menu de sélection, jamais les deux affichés en
  même temps. Argument décisif de Ronan : la puce sert à présélectionner
  un navire pour un trajet ; découvrir après coup qu'un navire à l'air
  adéquat est en réalité hors de portée (Nav 4+) est justement ce que la
  puce doit permettre d'éviter en amont. Contredit ma proposition initiale
  (zone toujours prioritaire dans la puce) — Ronan avait raison.
- Le sélecteur "Conditions affichées" de la fiche est **indépendant de la
  position sur la carte** : il ne réutilise pas `typeZoneNavigationEnPoint`
  (qui suppose un point réel), il pilote directement le calcul du score de
  Manœuvrabilité via un nouvel état `etat.conditionsZone`.

## Fichiers modifiés

### `js/navigation-jaillot.js` (+137/-22)

- `typeZoneNavigationEnPoint(point)` : implémentée pour de vrai (renvoyait
  `null` inconditionnellement, `TODO PN-NAVZONE`). Cherche la cellule OSCAR
  au point via `oscarCellKey` (déjà existant, réutilisé), lit `cell.natureNav`,
  retombe sur `'hauturiere'` si absent. Renvoie toujours `null` si `point`
  est absent (préserve le seul appelant historique, la fiche navire — mais
  voir ci-dessous, cet appelant a changé de mécanisme).
- `LABELS_PERIMETRE_NATUREL` : labels d'affichage Fleuve/Cabotage/Haute-mer,
  distincts de `LABELS_ZONE_NAV` (labels techniques existants pour les
  lignes de restriction).
- `perimetreNaturelNavire(navire)` : lit `navire.perimetreNaturel`, défaut
  `'hauturiere'`.
- `MARQUEURS_ZONE_SELECT` / `MARQUEUR_EXOTIQUE_SELECT` / `marqueurZoneNavireSelect()` :
  émojis couleur pour la puce du menu de sélection — un `<option>` natif ne
  peut porter ni classe CSS ni couleur de fond, l'émoji est la seule puce
  possible à cet endroit (contrainte technique découverte en cours de
  session, signalée à Ronan).
- `etatNavireParDefaut()` : nouveau champ `conditionsZone`, initialisé à
  `perimetreNaturelNavire(navire)`.
- `scoreManoeuvrabiliteActuel()` : la contribution `malus_navigation` lit
  désormais `etat.conditionsZone` au lieu d'appeler
  `typeZoneNavigationEnPoint(null)` (qui renvoyait toujours `null`, donc une
  contribution toujours nulle jusqu'ici).
- `selecteurConditionsNavire()` (nouvelle) : rend le sélecteur Fleuve/
  Cabotage/Haute-mer de la section Caractéristiques, remplace l'ancienne
  ligne statique "Restrictions de zone". Affiche la conséquence immédiate
  (Aucun malus / Malus N / Interdite) à côté du sélecteur.
- `texteConsequenceRestriction()` (nouvelle) : formatage partagé entre le
  rendu initial et la mise à jour live.
- `appliquerConditionsDepuisControle()` (nouvelle) : handler du sélecteur,
  suit le patron exact de `appliquerToilageDepuisControle`/
  `appliquerCarenageDepuisControle` (déjà existants) — met à jour
  `etat.conditionsZone`, le texte de conséquence, et appelle
  `majAffichageManoeuvrabilite` (déjà existante) pour rafraîchir le score
  affiché sans reconstruire toute la fiche. Branché dans les listeners
  délégués `input`/`change` de `initModaleNavire()`.
- `majTitreModaleNavire()` / `majBadgeZoneNavire()` (nouvelle) : peuple le
  badge du bandeau-titre — "Exotique" si `origineExotique`, sinon le label
  de zone.
- `rendreSelectNavire()` : chaque `<option>` est préfixée par
  `marqueurZoneNavireSelect(navire)`.

### `carte.html` (+1)

Ajout de `<span id="navire-modale-badge-zone" hidden>` dans
`.navire-modale-header`, à côté de `.navire-modale-titre-wrap` — le
squelette HTML de la modale est statique dans ce fichier, pas généré en JS.

### `js/ships-data.js` (+26)

- Doc d'en-tête : `perimetreNaturel` et `origineExotique` documentés.
- **6 navires marqués `origineExotique: true`** (Nav 4-5, notes géographiques
  hors Caraïbes déjà présentes) : `catalane`, `petit_prao`, `felouque`,
  `chebec`, `galere_royale`, `galeasse`.
- **`perimetreNaturel` suggéré sur 11 navires** (les 6 exotiques + `pirogue`,
  `hourque`, `prao_caraibe`, `marchand`) — choix faits à partir des
  indices déjà présents dans les données existantes (`regionRestriction`,
  `notes`, cohérence avec `restrictionNav`) et commentés `// suggestion à
  valider`. Ce ne sont **pas des décisions définitives** : je n'ai pas la
  légitimité de trancher le périmètre naturel d'un navire, seulement de
  proposer une valeur cohérente avec ce qui existe déjà.
- **Reste à traiter, non fait dans cette session** : le catalogue compte
  ~46 navires, seuls 11 ont `perimetreNaturel`. Les autres retombent sur le
  défaut `'hauturiere'` (sans risque — comportement des navires
  généralistes), mais gagneraient à être revus par Ronan à son rythme.
- **Découverte en cours de route, non traitée** : au moins deux autres
  navires portent une note `'Europe.'` (dont `berckois`, Nav 4, malus
  hauturier) sans être marqués exotiques par moi — "Europe" ne correspond
  pas à la définition donnée par Ronan ("Méditerranée ou océan Indien"),
  donc pas de décision unilatérale prise ici. À trancher : ces navires
  européens (mais pas méditerranéens) sont-ils "exotiques" au sens de
  cette fonctionnalité, ou une catégorie à part ?

### `css/carte.css` (+63)

Styles du badge de bannière (`.navire-modale-badge-zone` + 4 variantes
couleur) et du sélecteur de conditions (`.navire-conditions-controle`,
`.navire-conditions-consequence`). Couleurs choisies pour rester
distinctes des codes couleur existants (alerte `#f08a78`, bonus `#8fd0a6`)
— facilement ajustables, ce sont des règles isolées.

### `tools/zone-editor.js` (+36) et `tools/zone-editor.html` (+1)

- `formatOscarCellEditForm()` : nouveau champ "Nature de navigation"
  (Haute mer / Côtière / Fluviale) dans le formulaire d'édition de cellule
  OCÉANOGRAPHIE.
- `applyOceanCellEdit()` : application du champ, suit le patron "touched"
  existant (n'écrase que si modifié, cohérent avec l'édition par bloc/
  lasso). Ne marque **pas** `cell.source = 'manual'` — c'est une donnée
  indépendante du vecteur de courant, le bouton "Rétablir Copernicus" ne
  doit pas apparaître pour un simple tag de zone.
- `oscarCellStyle()` : bordure distincte (vert fluviale / bleu côtière)
  pour les cellules taguées, sans toucher au remplissage (qui reste piloté
  uniquement par la vitesse de courant, conformément au commentaire déjà
  en place sur le rendu unifié).
- Nouveau filtre "Fluviale / côtière taguée" dans le menu déroulant de
  filtre de la grille OSCAR, pour isoler les cellules déjà traitées.

## Validations effectuées

```
node --check js/navigation-jaillot.js
node --check js/ships-data.js
node --check tools/zone-editor.js
node tools/audit-text-integrity.js --strict-eol
```

Tout passe. Seule erreur signalée : le mojibake déjà connu de
`Journal/REPRISE_57.md`, sans rapport avec cette session.

## État Git

Rien commité — 6 fichiers modifiés en attente de revue dans VS Code
(carte.html, css/carte.css, js/navigation-jaillot.js, js/ships-data.js,
tools/zone-editor.html, tools/zone-editor.js).

## Complément — périmètre naturel calculé, pas saisi (suite de conversation)

Après la première passe (11 navires tagués à la main), Ronan a repéré une
incohérence concrète : le Poon de Hollande se retrouvait "Haute-mer" par
défaut alors qu'il n'a de malus *que* pour la haute mer — la saisie
manuelle n'était pas fiable à l'échelle de 47 navires.

**Analyse de la répartition réelle de `restrictionNav`** sur tout le
catalogue : le motif dominant (26 navires, 57 %) est "malus fluviale
seule" — pas du tout le cas que la première règle proposée (échelle
Haute-mer > Cabotage > Fleuve) couvrait explicitement. En creusant les
deux pistes discutées avec Ronan, elles convergent vers une seule règle
générale, vérifiée sans exception sur les quatre motifs réels du
catalogue :

> **Le périmètre naturel est la zone la plus exigeante (Haute-mer >
> Cabotage > Fleuve) qui n'est pas malussée pour ce navire.** Aucune
> restriction du tout → "Navigation illimitée" (mention réelle du Bureau
> Veritas, *unrestricted navigation* — vérifiée par recherche avant
> d'être proposée à Ronan, qui ne voulait pas d'un terme inventé).

`perimetreNaturelNavire()` (`navigation-jaillot.js`) calcule désormais
cette valeur directement depuis `restrictionNav`, sans saisie manuelle.
`ships-data.js`/`perimetreNaturel` redevient une **surcharge optionnelle**
réservée aux 2 seules vraies exceptions narratives : Galère royale et
Galéasse (mauvaises en haute mer par nature — navires à rame — alors que
leur `restrictionNav` actuel, qui ne malusse que la fluviale, donnerait
Haute-mer par le calcul). Les 9 autres tags manuels de la première passe
ont été retirés (redondants avec le calcul).

Nouvelle fonction `zoneEvaluationNavire()` : distincte de
`perimetreNaturelNavire()` — toujours l'une des trois zones réelles
(jamais "illimitee"), utilisée pour le calcul du score de Manœuvrabilité
et la valeur par défaut du sélecteur de conditions (un navire à
navigation illimitée s'évalue en Haute-mer par défaut, comme demandé par
Ronan — sans incidence puisqu'aucune zone n'est malussée pour lui).

Nouveau badge/puce "Navigation illimitée" (`--illimitee`) : couleur
neutre distincte des 4 autres (Fleuve vert, Cabotage bleu, Haute-mer
indigo, Exotique orange), émoji ⚪ dans le menu de sélection.

**Vérification finale** : simulation de `perimetreNaturelNavire()` sur
les 47 navires réels du catalogue (script Node temporaire, supprimé après
usage) — distribution 24 Haute-mer / 13 Cabotage / 9 Navigation illimitée
/ 1 Fleuve (la Hourque), aucun navire sans classification, aucune erreur.

## Complément — le calcul automatique est abandonné (fin de session)

Ronan a tranché : le calcul décrit ci-dessus est retiré. Deux raisons,
données en conversation :

- **Trop d'exceptions en pratique.** En cherchant d'autres candidats pour
  Fleuve, deux cas sont apparus qui ne se laissent pas déduire de
  `restrictionNav` seul : `flibot_grand` (notes "Cabotage et rivière
  profonde", que le calcul plaçait en Cabotage) et surtout `flibot_petit`,
  dont les notes décrivent un malus hauturier qui n'existe pas du tout
  dans `restrictionNav` — une incohérence de contenu, pas un problème de
  règle de calcul. Un seul motif dominant à 26 navires ("malus fluviale
  seule") ne suffisait déjà pas à couvrir tous les cas sans arbitrage.
- **Relecture prévue du livre de règles.** Ronan va reprendre chaque
  navire depuis *Pavillon Noir 2 : À feu et à sang* (descriptions et
  règles de navigation détaillées) plutôt que de faire confiance à une
  déduction depuis des données mécaniques. Un garde-fou de validation
  (empêcher la création d'un navire si `perimetreNaturel` n'est pas
  renseigné) est prévu pour une session ultérieure — pas encore fait.

**Ce qui reste en place** : `perimetreNaturelNavire()` existe toujours,
mais se contente de lire `navire.perimetreNaturel` (4 valeurs possibles :
fluviale/cotiere/hauturiere/illimitee), avec repli neutre sur 'illimitee'
pour les navires pas encore relus — un signal "pas encore traité", pas
une classification. `zoneEvaluationNavire()`, le badge, la puce, le
sélecteur de conditions de la fiche : tout est inchangé, ils ne
dépendaient que de la fonction, pas de son mode de calcul interne.

**État actuel du catalogue** : seuls 2 navires sur 47 ont `perimetreNaturel`
renseigné (Galère royale, Galéasse — mêmes valeurs qu'avant, mais ce ne
sont plus des "surcharges" d'un calcul, ce sont des valeurs normales comme
les autres). Les 45 autres afficheront "Navigation illimitée" jusqu'à la
relecture de Ronan — comportement sûr par défaut (aucun malus n'est
appliqué à tort), mais pas représentatif de la réalité du livre de règles
pour tous ces navires. La relecture est un chantier de contenu pour
Ronan, hors du périmètre de cette session.

## Points de reprise conseillés

1. **Tester dans le navigateur** avant tout commit : ouvrir la fiche de
   plusieurs navires (un généraliste "Navigation illimitée", un des 6
   exotiques, la Hourque en Fleuve, un des 24 navires Haute-mer), vérifier
   le badge, changer le sélecteur de conditions et confirmer que le score
   de Manœuvrabilité réagit. Vérifier la puce du menu de
   sélection (émojis 🟢🔵🟣🟠⚪).
2. **Tester le formulaire OCÉANOGRAPHIE** : taguer une cellule fluviale et
   une côtière, vérifier la bordure sur la grille, vérifier le nouveau
   filtre "Fluviale / côtière taguée", vérifier qu'éditer une cellule déjà
   marquée avec un vecteur de courant en plus ne casse rien (les deux
   opérations sont indépendantes en théorie — à confirmer en pratique).
3. **Décider du sort des navires "Europe."** (`berckois` et au moins un
   autre) — exotiques au même titre que les navires méditerranéens, ou
   catégorie à part ?
4. **Relecture du livre de règles pour `perimetreNaturel`** — chantier de
   contenu pris en charge par Ronan (*Pavillon Noir 2 : À feu et à sang*),
   navire par navire. Deux pistes déjà repérées en cours de session à
   vérifier en priorité : `flibot_grand` (notes mentionnant explicitement
   la rivière profonde) et surtout `flibot_petit`, dont les notes décrivent
   un malus hauturier absent de `restrictionNav` — probable oubli de
   données à corriger indépendamment du périmètre naturel.
5. Backlog antérieur toujours ouvert (REPRISE_73) : divergence
   `normaliser()` mobile, découpage `navigation-jaillot.js`, décision
   `audio.js`, découpage `zone-editor.js` par mode.
