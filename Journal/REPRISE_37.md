# REPRISE_37 - Pavillon Noir - Session 37

## Etat general

Session consacree au premier prototype du calculateur d'itineraires "joueur" sur la carte Jaillot.

Le chantier a beaucoup avance : un module dedie calcule maintenant une route maritime en coordonnees pixel Jaillot, evite les terres dessinees dans `zones-data.js`, utilise les rades quand elles sont renseignees dans `villes-data.js`, trace la route sur la carte, et expose une interface simple Depart A -> Arrivee B dans le panneau gauche.

Important : le calculateur est encore un prototype. Il est suffisamment structure pour continuer, mais il ne faut pas encore le considerer comme stabilise pour la distance, la duree, les vents/courants ou le mode MJ.

Contexte technique a retenir : le navigateur integre / Node REPL a de nouveau echoue en fin de session avec l'erreur Windows deja connue :

```text
windows sandbox failed: helper_unknown_error: apply deny-read ACLs
```

Les controles syntaxiques et les commandes PowerShell classiques restent utilisables. Pour une vraie verification interactive, redemarrer Codex ou ouvrir une nouvelle session propre si l'erreur persiste.

Racines utiles :

```text
C:\AI\Site Pavillon Noir\pavillon-noir
C:\AI\Site Pavillon Noir\Prompts
```

---

## Travaux effectues

### 1. Nouveau module de navigation Jaillot

Ajout du fichier :

```text
js/navigation-jaillot.js
```

Le module expose :

```js
window.NavigationJaillot = {
  init,
  calculerRoute,
  segmentNavigable,
  config: CONFIG,
};
```

Il est charge dans `carte.html` avant `carte.js` / `carte-mobile.js`, puis initialise depuis les deux cartes :

```js
window.NavigationJaillot?.init({ carte, pixelToLatLng });
```

Le calculateur reste donc partage entre desktop et mobile, meme si l'interface actuelle est surtout pensee pour le panneau gauche desktop.

### 2. Interface dans le panneau gauche

Ajout d'un point d'insertion dans `carte.html` :

```html
<div id="nav-jaillot-slot"></div>
```

Le calculateur est injecte a cet emplacement, juste apres les controles de marqueurs geographiques.

Interface actuelle :

- champ Depart `A`
- champ Arrivee `B`
- bouton `Intervertir`
- bouton `Tracer`
- bouton `Effacer`
- bouton `Options avancees` encore non fonctionnel, reserve pour la future popup multi-etapes
- zone de resultat indiquant pour l'instant une longueur en pixels Jaillot et le nombre de points

Le trace de route utilise maintenant un bleu vif avec contour sombre, bien plus lisible sur le fond parchemin que le jaune initial.

### 3. Recherche de ports dans les champs A/B

Les champs du calculateur ne sont plus de simples inputs avec datalist.

Ils reprennent la logique visuelle et technique de la recherche "Localiser un territoire", en version restreinte aux ports :

- suggestion fantome ;
- validation par `Tab`, fleche droite, `Entree` ou clic ;
- volet de propositions ;
- navigation clavier dans les suggestions ;
- surlignage du fragment recherche ;
- synchronisation d'un `dataset.portId` pour eviter les ports tapes mais non selectionnes.

La recherche est volontairement limitee aux ports eligibles :

- `type: 'port'`
- coordonnees valides
- non masque par `visible_mj` si le mode MJ est inactif
- non masque par `rang: 3` si le mode MJ est inactif
- non visible avant sa date `visible_de`

Exemple important : `La Nouvelle-Orleans` a `visible_de: 1718`; elle ne doit donc pas etre selectionnable avant 1718.

### 4. Champ `rade` dans `villes-data.js`

Le calculateur vise de preference :

```js
port.rade
```

si le champ existe et contient deux coordonnees valides, sinon :

```js
port.coords
```

Des rades ont commence a etre renseignees, notamment :

- Charles Town
- San Augustin
- Mobile
- La Nouvelle-Orleans
- Nassau
- Puerto Espana

Puerto Espana utilise actuellement :

```js
rade: [7384, 4001]
```

Nassau utilise actuellement :

```js
rade: [4539, 1736]
```

Plusieurs autres ports ont un `rade: []` temporaire, a completer progressivement.

### 5. Utilisation des polygones de terres

Le calculateur utilise les polygones de `ZONES_DATA` comme obstacles.

Il accepte les deux formes de contour :

```js
[
  [x, y],
  ...
]
```

et :

```js
{
  points: [[x, y], ...],
  ...
}
```

Cela permet de conserver d'eventuelles metadonnees sur certains contours futurs, par exemple pour des obstacles maritimes ou hauts-fonds.

Decision de conception actuelle :

- tout ce qui est dans les polygones est non navigable ;
- tout ce qui est hors polygones est navigable ;
- les petites iles non dessinees ou non contournees peuvent etre ignorees pour le prototype ;
- les futurs bancs / hauts-fonds peuvent etre ajoutes dans `zones-data.js` a la suite des juridictions, en section commentee.

Point encore a faire : definir proprement le schema des obstacles maritimes, par exemple :

```js
{
  type: 'haut-fond',
  maxCategorie: 2,
  points: [...]
}
```

ou un equivalent adapte au systeme des cinq tailles de navire.

### 6. Corrections du `zone-editor.html`

L'editeur de zones etait casse apres l'evolution de `zones-data.js`.

Il a ete adapte pour :

- lire les anciens contours en tableaux simples ;
- lire les contours objets avec `points` ;
- conserver les metadonnees non-`points` ;
- gerer plusieurs contours par zone ;
- naviguer entre contours ;
- supprimer un contour ;
- ajouter un nouveau contour a une zone existante ;
- exporter dans un format compatible avec les deux formes.

Cet outil est redevenu utilisable pour affiner les contours des rades et chenaux.

### 7. Algorithme de route

Le prototype combine plusieurs regimes :

- grille principale large en haute mer ;
- grille fine locale pres des ports / rades ;
- route fine regionale pour les trajets courts et cotiers ;
- accroches multiples au depart et a l'arrivee ;
- A* avec heap minimum ;
- raccourcis any-angle quand le segment reste navigable ;
- simplification finale de la route ;
- lissage visuel par courbes quadratiques pour eviter les angles trop secs.

Des problemes concrets ont ete debogues pendant la session :

- Nassau -> Puerto Espana ;
- arrivee dans la Boca del Drago ;
- passage pres de Monos Island ;
- depart depuis Nassau ;
- San Augustin -> Charles Town ;
- Mobile <-> La Nouvelle-Orleans ;
- acces a la baie de Mobile.

Decision importante : les points de depart, etape et arrivee doivent etre traites comme des "points de passage" equivalentes, pas comme deux cas asymetriques.

### 8. Index spatial des polygones

Pour accelerer les tests de collision, ajout d'un index spatial interne dans `navigation-jaillot.js` :

- cellules de `CONFIG.tailleCelluleIndexPx`
- cache des polygones par cellule
- recherche limitee aux polygones proches du segment teste

Cela evite de tester chaque segment contre tous les contours de la carte.

Le fichier d'index n'est pas separe : il est calcule en memoire depuis `ZONES_DATA`, afin de rester synchronise avec les polygones modifies.

### 9. Marges de navigation

Le systeme actuel garde plusieurs marges :

- marge large en navigation generale ;
- marge intermediaire ;
- marge fine a proximite des rades, chenaux et cotes ;
- marge terminale pour rejoindre exactement un point de rade.

Les couts de trajet ont ete simplifies : pas de penalite artificielle pour longer les cotes ou utiliser une marge fine.

Decision de conception retenue :

- tant qu'aucune terre n'est traversee, le calculateur joueur doit chercher l'itineraire le plus direct ;
- les avantages / inconvenients du cabotage seront introduits plus tard via les vents, courants, hauts-fonds, categorie du navire et couts de cases ;
- il ne faut pas interdire par principe de longer une cote ou de traverser un archipel.

### 10. Donnees et contours modifies pendant la session

Des modifications de donnees ont ete faites en parallele du developpement :

- `js/villes-data.js` : ajout progressif de `rade`;
- `js/zones-data.js` : affinage de polygones, notamment autour de Trinidad / Puerto Espana et d'autres zones utiles au routage.

Attention : certaines modifications de `zones-data.js` viennent de l'utilisateur pendant qu'il ajustait les rades. Ne pas les revert.

---

## Fichiers modifies ou ajoutes

| Fichier | Role |
|---|---|
| `js/navigation-jaillot.js` | Nouveau module de calcul et trace des routes Jaillot |
| `carte.html` | Charge le module et ajoute le slot du calculateur |
| `css/carte.css` | Styles du calculateur et adaptation des champs de recherche |
| `js/carte.js` | Initialisation desktop de `NavigationJaillot` |
| `js/carte-mobile.js` | Initialisation mobile de `NavigationJaillot` |
| `js/villes-data.js` | Ajout de rades et de dates de visibilite utiles au routage |
| `js/zones-data.js` | Affinage de polygones / contours de terres |
| `tools/zone-editor.html` | Reparation et evolution de l'editeur de contours |

Etat Git observe en fin de session :

```text
 M carte.html
 M css/carte.css
 M js/carte-mobile.js
 M js/carte.js
 M js/villes-data.js
 M js/zones-data.js
 M tools/zone-editor.html
?? js/navigation-jaillot.js
```

---

## Verifications realisees

Controle syntaxique :

```powershell
node --check .\pavillon-noir\js\navigation-jaillot.js
```

Resultat : OK.

Des controles syntaxiques ponctuels ont aussi ete faits sur les fichiers JS touches pendant la session.

Verification navigateur :

- Le navigateur integre a ete utilise pendant la session par l'utilisateur pour verifier de nombreux cas visuels.
- En fin de session, la connexion navigateur automatique a echoue a cause de l'erreur Windows ACL.
- Edge headless n'a pas permis une verification complete car la page depend de Leaflet via CDN et l'initialisation applicative ne remonte pas proprement dans ce mode.

Validation utilisateur pendant la session :

- mobile carte satisfaisante avant le chantier route ;
- calculateur prometteur ;
- route Nassau -> Puerto Espana progressivement amelioree ;
- arrivee Puerto Espana jugee bonne apres corrections ;
- depart Nassau corrige apres ajout de `rade`;
- Mobile <-> La Nouvelle-Orleans redevenu accessible apres debogage.

---

## Limites actuelles

### Distances et durees

Le calculateur indique seulement une longueur en pixels Jaillot et un nombre de points.

Pas encore implemente :

- conversion pixels -> lieues ;
- conversion lieues -> milles / kilometres ;
- vitesse du navire selon allure ;
- etat du carenage ;
- vents dominants ;
- courant caraibe ;
- aleas de trajet.

Reference utilisateur a garder :

```text
Echelle Jaillot : 100 lieues = 840 px
Lieue retenue pour le prototype : English Land League = 3 milles imperiaux = 4,820032 km
```

### Route moderne MJ

La partie MJ avec route maritime moderne n'est pas encore implemente.

Decision discutee :

- privilegier `searoute-js` cote client si possible ;
- ne pas dependre d'un service payant ;
- utiliser les coordonnees `geo` des ports dans `villes-data.js`;
- comparer plus tard estimation joueur Jaillot et estimation MJ moderne.

### Conversion Jaillot <-> lon/lat

Pas necessaire pour le premier prototype port -> port.

Necessaire plus tard pour :

- marqueurs libres ;
- iles non cartographiees ;
- repaires ;
- points choisis manuellement par les joueurs ;
- integration MJ moderne hors ports connus.

### Etapes multiples

Non implemente pour l'instant.

L'interface A/B est volontairement simple. Le bouton "Options avancees" ouvrira plus tard une popup centree sur la carte avec :

- etapes C, D, etc. ;
- ajout / suppression d'etapes ;
- inversion ;
- reordonnancement par glisser-deposer ;
- parametres de navire et de calcul.

---

## Prochaines etapes recommandees

### Priorite 1 - Stabiliser le prototype joueur

1. Faire une passe navigateur propre apres redemarrage Codex.
2. Tester les champs A/B :
   - suggestion fantome ;
   - Tab / Entree ;
   - restriction aux ports ;
   - exclusion de La Nouvelle-Orleans avant 1718 ;
   - mode MJ actif / inactif.
3. Tester les routes connues :
   - Nassau -> Puerto Espana ;
   - San Augustin -> Charles Town ;
   - Mobile -> La Nouvelle-Orleans ;
   - La Nouvelle-Orleans -> Mobile ;
   - Charles Town -> San Augustin.
4. Verifier que le lissage visuel ne fait jamais passer le trait dans un polygone.

### Priorite 2 - Continuer les rades et contours

1. Completer progressivement `rade` pour les ports dont `coords` tombe trop a terre ou trop loin de la passe.
2. Affiner les polygones uniquement la ou une rade / un chenal l'exige.
3. Eviter de sur-detailler tous les contours : le routage doit rester robuste sans transformer `zones-data.js` en carte hydrographique exhaustive.

### Priorite 3 - Obstacles maritimes

1. Definir un format minimal pour les hauts-fonds / bancs.
2. Ajouter quelques zones test :
   - Bahamas ;
   - Keys de Floride ;
   - Serrana / Serranilha ;
   - autres bancs manifestes.
3. Ajouter dans `carte-data.js` les caracteristiques du navire joueur :
   - categorie 1 a 5 ;
   - vitesse selon allure ;
   - etat du carenage.
4. Faire varier la navigabilite selon la categorie du navire.

### Priorite 4 - Distance et duree joueur

1. Convertir pixels Jaillot -> lieues.
2. Convertir lieues -> km / milles si utile.
3. Calculer une duree theorique selon vitesse du navire.
4. Preparer l'interface de resultat :
   - distance theorique ;
   - duree estimee ;
   - avertissement si route impossible ;
   - notes de marge / rades utilisees.

### Priorite 5 - Vents, courants et couts de cases

1. Ajouter un overlay invisible de vents dominants.
2. Ajouter un overlay invisible du courant Caraibe.
3. Transformer le cout des segments selon :
   - cap relatif au vent ;
   - courant favorable / defavorable ;
   - proximite des cotes si necessaire ;
   - hauts-fonds selon categorie.
4. Garder la philosophie actuelle : le calculateur doit optimiser le cout total, pas appliquer des interdictions arbitraires.

### Priorite 6 - Route moderne MJ

1. Tester `searoute-js` en local / cote client.
2. Ajouter ou verifier les champs `geo` des ports.
3. Calculer une distance moderne port -> port.
4. Afficher au MJ :
   - estimation joueur Jaillot ;
   - estimation moderne ;
   - ecart ;
   - consequences possibles sur vivres / eau potable.

---

## Commandes utiles au demarrage de la prochaine session

Depuis le dossier parent :

```powershell
cd "C:\AI\Site Pavillon Noir\pavillon-noir"
git status --short
node --check .\js\navigation-jaillot.js
```

Si besoin de serveur local :

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Ouvrir ensuite :

```text
http://127.0.0.1:8765/carte.html
```

Tests manuels prioritaires :

```text
Nassau -> Puerto Espana
San Augustin -> Charles Town
Mobile -> La Nouvelle-Orleans
La Nouvelle-Orleans -> Mobile
```

---

## Note de prudence

Ne pas lancer de refactor global avant d'avoir stabilise :

- les rades ;
- les contours critiques ;
- le comportement des champs A/B ;
- les quelques routes de reference.

Le prototype tient maintenant une bonne direction : il vaut mieux l'endurcir par cas concrets que chercher trop vite une architecture plus abstraite.
