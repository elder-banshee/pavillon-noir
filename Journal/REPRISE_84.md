# REPRISE_84 — Identification des branches fluviales dans Zone Editor

Session du 7 août 2026, à la suite de `REPRISE_83.md`.

## Problème constaté

Les libellés des tracés techniques homonymes n’étaient distingués que lorsque
plusieurs bras occupaient déjà la même cellule. Après suppression de
chevauchements hérités de la v1, deux bras situés dans des cellules voisines
étaient donc tous deux présentés sous leur seul nom canonique.

Dans le cas de Panuco, les trois tracés `panuco-main`, `panuco-b` et `panuco-c`
apparaissaient tous comme « Panuco » dans les arbitrages de fourche et de
jonction. Les directions proposées devenaient impossibles à identifier avec
certitude.

## Correction

La qualification d’un tracé s’appuie désormais sur le registre global
`fluvialCourses` et son `watercourseId`, plutôt que sur les seuls courants de la
cellule affichée :

- un cours qui possède plusieurs tracés affiche leur code de bras, par exemple
  « Panuco [main] », « Panuco [B] » et « Panuco [C] » ;
- une lettre de branche isolée est mise en majuscule pour améliorer la lecture ;
- chaque arbitrage affiche sur une seconde ligne les deux `courseId` stables et
  leurs cellules, par exemple
  `panuco-main (46_22) ↔ panuco-b (47_22)` ;
- les choix « Fourche » et « Jonction » reprennent les libellés qualifiés ;
- le résumé d’un courant dans le panneau de cellule affiche également son
  libellé qualifié et son `courseId` technique.

Cette modification est exclusivement une correction d’interface : la grille,
les vecteurs et les connexions fluviales n’ont pas été modifiés.

Un second cas, créé manuellement après cette première correction, a révélé
qu’un bras explicite pouvait encore perdre son suffixe lorsqu’il était seul
dans son `watercourseId`. La règle a donc été renforcée : tout code de bras
autre que `main` est désormais toujours visible, même si le tracé est
momentanément le seul membre de son groupe hydrologique. Le tracé manuel
`riviere-sabluomere-c` est ainsi présenté comme « Rivière Sabluomere [C] ».

Cette correction ne regroupe pas silencieusement des données dont les
identifiants diffèrent. Dans l’état observé, les bras historiques utilisent le
groupe `sablomuere`, tandis que le nouveau bras C utilise `sabluomere` ; cette
différence reste donc accessible et éditable dans les options avancées.

## Validation fonctionnelle

Zone Editor a été chargé en mode OCÉANOGRAPHIE dans le navigateur local, puis
Panuco a été ciblé avec l’inspecteur avancé. Sur la cellule `46_22`, les trois
arbitrages voisins affichent correctement :

- `Panuco [main] / Panuco [C]` vers `45_21` ;
- `Panuco [main] / Panuco [C]` vers `45_22` ;
- `Panuco [main] / Panuco [B]` vers `47_22`.

Les identifiants techniques complets et les cinq choix de relation sont
présents pour chaque paire. Aucune erreur JavaScript n’a été relevée dans la
console.

Le cas manuel `riviere-sabluomere-c` a ensuite été contrôlé sur la cellule
`26_20`. Le résumé du courant et toutes les relations dans la cellule ou avec
ses voisines affichent bien « Rivière Sabluomere [C] », notamment face aux bras
historiques `[main]` et `[B]`. La grille reste valide et aucune erreur
JavaScript n’est apparue.

## Renommage global d’un identifiant technique

Les `courseId` enregistrés restaient jusque-là en lecture seule. Une option
explicite « Renommer cet identifiant technique partout » est désormais proposée
dans les options avancées d’un tracé existant. Elle déverrouille temporairement
le champ et désactive le menu de rattachement afin de séparer sans ambiguïté les
deux opérations.

À l’application, le renommage est atomique et global :

- toutes les occurrences du tracé dans les cellules reçoivent le nouveau
  `courseId` ;
- l’entrée du registre `fluvialCourses` est déplacée ;
- les embouchures et les deux extrémités des connexions sont réécrites ;
- les éventuelles relations modifiées dans le même formulaire sont remappées ;
- l’inspecteur fluvial et ses groupes sont immédiatement reconstruits ;
- le nouvel identifiant est refusé s’il existe déjà.

Le scénario de correction a été testé en mémoire, sans exporter la grille :
`riviere-sabluomere-c` est devenu `riviere-sablomuere-c`, son groupe est devenu
`sablomuere` et son nom « Rivière Sablomuere ». Les deux cellules ont été
réécrites, la jonction vers Mississippi a été conservée, l’ancien tracé et
l’ancien groupe ont disparu des listes, et l’inspecteur affiche désormais
« Rivière Sablomuere — 3 tracés [sablomuere] ». La topologie reste valide et la
console ne contient aucune erreur.

## Ancrage local des fourches et jonctions

Une fourche `Sablomuere [B] → Sablomuere [C]` renseignée depuis `27_19` avait
été enregistrée vers l’occurrence voisine de C en `26_20`. La relation
apparaissait alors dans les deux panneaux, sous la forme
`27_19 → 26_20`, alors que B et C cohabitent déjà en `27_19`.

La liste des relations donne désormais priorité à la cellule éditée : lorsque
deux tracés y sont tous deux présents, leurs variantes redondantes utilisant
une occurrence voisine ne sont plus proposées. Dans `27_19`, une seule paire
B/C reste donc disponible, avec les deux extrémités ancrées en `27_19`.

Lorsqu’une fourche est renseignée à un nouvel emplacement, une relation
existante entre la même source et le même bras est déplacée plutôt que
dupliquée. Le même principe est appliqué à l’ancrage terminal unique d’une
jonction.

Test navigateur en mémoire : la relation existante
`B (27_19) → C (26_20)` a été remplacée par
`B (27_19) → C (27_19)`. La fourche apparaît uniquement dans `27_19`, ne figure
plus dans `26_20`, et la topologie reste valide sans erreur JavaScript. La
grille sur disque n’a pas été réexportée pendant le test.

## Suite prévue

Le comportement général des filtres d’affichage devra faire l’objet d’une
révision séparée. Cette session s’est limitée au problème prioritaire de
désambiguïsation des branches.

## Réaffectation locale directe du `courseId`

Session reprise le 8 août 2026. Une première implémentation ajoutait une
opération guidée « Détacher en nouveau bras ». Après réévaluation, cette
fenêtre spécialisée a été retirée : elle empilait une nouvelle convention sur
un modèle qui possède déjà l’information structurelle nécessaire.

Le champ `courseId` est désormais directement éditable dans les options
avancées :

- sans cocher l’option globale, sa modification ne concerne que la cellule ou
  la sélection courante ;
- saisir un identifiant existant rattache les occurrences sélectionnées à ce
  tracé et adopte les métadonnées de son registre ;
- saisir un identifiant inédit crée un tracé avec les métadonnées affichées,
  notamment le `watercourseId` et le code du bras ;
- la liste des tracés enregistrés reste disponible comme raccourci facultatif ;
- « Renommer cet identifiant technique partout » reste la seule opération qui
  réécrit globalement toutes les occurrences et la topologie.

Lors d’une réaffectation locale, les embouchures et extrémités de connexions
ancrées dans une cellule suivent le nouvel identifiant si l’ancien tracé a
effectivement disparu de cette cellule. Une relation devenue réflexive après
fusion est supprimée. Les politiques terminales des tracés concernés sont
réconciliées avec leurs embouchures ou jonctions restantes. Sur une sélection
multiple, l’opération est refusée si le tracé source n’est pas présent dans
toutes les cellules, afin d’éviter une réaffectation partielle silencieuse.

Pour créer un bras, la procédure devient donc générale : sélectionner ses
cellules, saisir le nouveau `courseId`, renseigner son code de bras, puis poser
la relation de fourche dans la cellule ou entre les cellules qui correspondent
réellement à la géographie. Aucun type de fourche n’est imposé par l’outil.

### Validation fonctionnelle

Les scénarios suivants ont été contrôlés dans le navigateur sur une copie en
mémoire de la grille, sans export :

- les cellules `116_102` et `117_101` de la Madalena ont été réaffectées par
  lot de `rio-grande-de-la-madalena-main` vers le nouvel identifiant
  `rio-grande-de-la-madalena-b`, avec le code `B` et sans modification des
  vecteurs ;
- saisir directement l’identifiant existant
  `rio-grande-de-la-madalena-c` sur `117_101` adopte bien le registre et le
  libellé `[C]` sans écraser les métadonnées globales de ce tracé ;
- la case globale renomme toujours toutes les occurrences du tracé principal,
  ses embouchures et ses connexions ;
- après ajout temporaire d’une embouchure de test sur `117_101`, la
  réaffectation locale vers `[B]` déplace cette embouchure vers le nouveau
  `courseId`, ramène son mode à une embouchure simple et conserve une topologie
  valide pour `[main]` comme pour `[B]` ;
- aucune erreur JavaScript n’a été relevée.

## Cellule fluviale `93_101`

La cellule OSCAR absente `93_101`, située dans le delta du Rio Grande de la
Madalena, a été ajoutée comme cellule calme de domaine `fluvial` et de nature
de navigation `fluviale`. Aucun courant ni `courseId` n’a été déduit : la
cellule est disponible dans Zone Editor pour recevoir le tracé voulu.

Elle est également inscrite dans les exceptions topologiques de
`sync-oscar-hex-grid-ocean-bounds.js`, afin qu’une synchronisation ultérieure
des Ocean Bounds la conserve même si elle reste hors de leurs emprises.

## Connexions fluviales multicellulaires

Les fourches et jonctions dont l’emprise couvre plusieurs cellules peuvent
désormais être déclarées avec la case contextuelle « Connexion répartie sur
plusieurs cellules ». Chaque cellule reste un ancrage navigable indépendant,
mais les enregistrements partagent un `eventId` généré automatiquement et sont
comptés comme une seule connexion logique par le validateur.

Zone Editor regroupe automatiquement un nouvel ancrage avec l’événement
compatible présent dans une cellule adjacente. Sans cocher l’option, le
comportement simple reste inchangé : déplacer une fourche ou une jonction
remplace son ancien ancrage. Un événement multicellulaire réduit à un seul
ancrage, incohérent entre ses tracés ou discontinu est signalé invalide.

La fourche `Marrawini → Commewijne` est maintenant enregistrée comme un seul
événement `connection-event-1`, ancré dans `107_168` et `108_168`. Les deux
cellules sont valides et pourront servir de points de transition au futur
pilote automatique.

Le panneau d’édition droit est passé de 320 à 640 px. Son débordement horizontal
est masqué et les champs de formulaire peuvent se contracter dans leur grille.
Mesure navigateur à 1280 px de largeur : panneau de 640 px, largeur utile et
largeur défilable identiques à 633 px, donc aucun défilement horizontal.

### Validation fonctionnelle

- déclarer un seul ancrage multicellulaire produit bien l’erreur attendue ;
- ajouter `108_168` regroupe automatiquement les deux ancrages et rétablit une
  topologie valide dans les deux cellules ;
- décocher l’option revient à un ancrage unique et supprime l’autre ancrage ;
- après rechargement depuis le fichier du dépôt, les deux cellules du
  Commewijne affichent la fourche et la case multicellulaire cochée.
