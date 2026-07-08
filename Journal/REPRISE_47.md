# REPRISE_47 - Pavillon Noir, calculateur Jaillot et vents dominants

## Etat general

Session consacree a la premiere integration des alizes dans le calculateur de navigation Jaillot.

Le depot actif est `C:\AI\Site Pavillon Noir\pavillon-noir`.

## Travaux effectues

- Ajout de `CARTE_VENT_DOMINANT` dans `js/carte-data.js`, pres des constantes de campagne:
  - direction de provenance: `NNE`;
  - force: `15` noeuds;
  - parametres par defaut du deventement: `porteeNm`, `demiAngleDeg`, `facteurMin`.
- Documentation du champ manuel `deventement` sur les juridictions:
  - `deventement: true`;
  - ou objet de reglage `{ porteeNm, demiAngleDeg, facteurMin }`.
- Integration du vent dans `js/navigation-jaillot.js`:
  - `ventEnPoint(point)`;
  - `allureSegment(a, b, point)`;
  - `vitesseVoileSegmentNoeuds(a, b, point)`;
  - application des allures Pavillon Noir:
    - bout au vent: 0-44 degres, vitesse 0;
    - pres: 45-89 degres;
    - largue: 90-134 degres;
    - grand largue: 135-179 degres;
    - vent arriere: 180 degres, avec tolerance flottante a partir de 179.5 degres.
- Le calcul de courant utilise maintenant la vitesse sous voile du segment, puis applique la correction laterale du courant.
- Le deventement est calcule automatiquement a partir des juridictions marquees:
  - recuperation de leur geometrie via `ZONES_DATA[juridiction.id]`;
  - recherche du point de cote le plus proche;
  - verification que le point maritime est sous le vent;
  - attenuation progressive de la force du vent.
- Correction importante pour le routage asymetrique:
  - les approches d'arrivee ne sont plus calculees en inversant une approche de depart;
  - avec le vent, un segment praticable dans un sens peut etre impossible dans l'autre.

## Verifications faites

- `node --check .\js\carte.js`
- `node --check .\js\navigation-jaillot.js`
- `node --check .\js\carte-mobile.js`
- `node --check .\js\carte-data.js`
- `git diff --check`

Tests directs via Node/VM:

- NNE exact -> `boutAuVent`, vitesse 0.
- SSW exact -> `ventArriere`, vitesse 5 noeuds pour le Cuchulainn.
- Nassau -> La Havane:
  - route trouvee;
  - 5 points;
  - environ 298 milles;
  - environ 40 h;
  - aucun segment infini.
- Nassau -> Charles Town:
  - route trouvee;
  - 13 points;
  - environ 661 milles;
  - environ 149 h;
  - aucun segment infini.

Routes encore delicates dans les tests:

- Cap-Francais -> La Havane;
- Bridgetown -> Fort-Royal.

Le message obtenu etait: `Aucun chenal navigable proche du depart ou de l arrivee.` Il faudra distinguer ce qui vient des chenaux/ports deja delicats et ce qui vient du vent.

## Points de vigilance

- Les directions de vent restent des directions de provenance. `NNE` signifie que le vent vient du NNE et souffle vers le SSW.
- Le calculateur commence deja a louvoyer via la grille A*, mais il n'a pas encore de logique explicite de bord optimal. Les routes au pres peuvent donc etre anguleuses ou dependantes du pas de grille.
- Le champ `deventement` doit etre ajoute dans `js/carte-data.js`, pas dans `js/zones-data.js`, car `zones-data.js` est genere.
- `carte.html` reference `js/villes-data-ajouts-session.js`, mais ce fichier n'etait pas present localement pendant cette session. Les tests Node ont donc charge `js/villes-data.js` seulement.

## Prochaines etapes recommandees

1. Ajouter manuellement `deventement: true` sur les juridictions insulaires ou cotieres qui ont assez de relief pour creer une ombre au vent.
2. Tester visuellement l'onglet maritime `Vents dominants` et y afficher le vent dominant + les zones de deventement actives.
3. Reprendre les routes encore impossibles pour savoir si le probleme vient:
   - d'un chenal d'approche trop strict;
   - de la grille;
   - d'une vraie impossibilite au vent;
   - ou d'un besoin de louvoyage explicite.
4. Ajouter plus tard des profils de vitesses par type de navire, en conservant `CARTE_NAVIRE.vitessesNoeuds` comme modele.

## Suite de session - ecole de voile du routeur

Constat utilisateur: les trajets vers l'est devenaient impossibles, par exemple La Havane -> Nassau et Veracruz -> Puerto Espana.

Cause diagnostiquee:

- la grille A* ne proposait que 8 caps principaux;
- avec un vent de NNE, le cap NE est bout au vent et le cap E ne gagne pas assez au nord;
- il manquait donc des caps de pres permettant de louvoyer;
- certains ports/rades sont places dans ou contre le trait de cote, ce qui bloquait aussi le premier micro-segment de sortie.

Modifications ajoutees dans `js/navigation-jaillot.js`:

- ajout de `louvoyageDeltas`;
- ajout de voisins longs `6:2` dans la rose de navigation, pour simuler des bords de pres sans exploser autant le nombre de points;
- ajout d'une transition terminale de rade pour accrocher un port a l'eau libre proche, utilisee uniquement sur les segments qui touchent un terminal de port/rade;
- `tempsSegmentHeures` reconnait cette transition terminale si le micro-segment serait impossible au vent;
- passage a une heuristique A* ponderee (`poidsHeuristiqueTemps: 3.0`) pour accelerer les longs calculs sous voile.

Tests Node/VM apres correction:

- La Havane -> Nassau:
  - route trouvee;
  - environ 354 milles;
  - environ 67 h;
  - aucun segment infini;
  - temps de calcul observe: environ 15 s.
- Veracruz -> Puerto Espana:
  - route trouvee;
  - environ 2076 milles;
  - environ 326 h;
  - aucun segment infini;
  - temps de calcul observe: environ 33 s.
- Puerto Espana -> Veracruz:
  - route trouvee;
  - environ 2115 milles;
  - environ 206 h;
  - aucun segment infini;
  - temps de calcul observe: environ 7 s.

Point restant:

- Les routes longues au pres sont maintenant possibles mais encore lentes. Prochaine optimisation possible: calcul asynchrone/worker, cache de routes, ou strategie de grille regionale dediee aux longs trajets sous voile.
