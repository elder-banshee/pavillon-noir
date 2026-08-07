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

## Suite prévue

Le comportement général des filtres d’affichage devra faire l’objet d’une
révision séparée. Cette session s’est limitée au problème prioritaire de
désambiguïsation des branches.
