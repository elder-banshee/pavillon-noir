# Inventaire des cours d'eau identifiés mais non digitalisés dans oceanBounds

Établi par recensement croisé de `fluvial-identification-complete.md`,
`fluvial-identification-synthese.md` et `fluvial-research-inventory.json`
(134 entrées, toutes avec `cellKeys` non vides — confirmé par script).
Les cours listés ci-dessous n'ont donc **aucune entrée propre** dans
l'inventaire numérisé : ils existent seulement sous forme de mention
textuelle dans une fiche N0xx/R0xx.

Tous les cours de cet inventaire sont dans le même cas : dessinés par
Jaillot, mais omis lors de la digitalisation d'oceanBounds. Le trait
existe sur le scan ; il s'agit seulement de le reporter.

*(Correction — avec Ronan : Yellow River avait été classée à part dans
une première version de ce document, comme « jamais dessinée par
Jaillot ». C'était une erreur de lecture de ma part des fiches N028/N037
— Yellow River est bien dessinée par Jaillot, l'omission ne concernait
que la digitalisation. Elle rejoint donc le groupe unique ci-dessous ;
les fiches N028 et N037 ont été corrigées en conséquence dans
`fluvial-identification-complete.md`.)*

Un Groupe B (hors-périmètre) est ajouté à la fin pour mémoire, afin
d'éviter de confondre ces cours avec un oubli : il s'agit de fleuves
réels documentés aujourd'hui mais jugés absents de la source Jaillot
elle-même, sans aucun trait correspondant sur le scan.

## Cours à tracer depuis le scan

### Delta sud de l'Orénoque / côte de Guyane (voir fiche N042)

Deux séquences distinctes repérées par Ronan sur un crop haute
résolution. Repères de calage (déjà digitalisés) : R. Waymy/N075
(outlet x≈7777, y≈4361) et R. Amacuro/N042=Río Barima (outlet
x≈7752, y≈4318).

| Nom Jaillot | Identification proposée | Confiance | Position relative |
|---|---|---|---|
| Spruyt | Río Moruca | ⚠️ moyen | Premier cours à l'est de R. Waymy/N075 (x > 7777), près d'un « Cap Nassau » non retrouvé ailleurs |
| R Amachara | Río Amacuro (moderne) | ⚠️ moyen | Immédiatement à l'ouest de R. Amacuro/N042=Barima (x < 7752) |
| R Maritere | Río Arature | ⚠️ faible | Second groupe, plus au sud/intérieur, descendant vers le delta ; à l'est de Sebarrima |
| R Sebarrima | Río Aguirre/Aquire | ⚠️ faible | Entre Maritere et Corobana — réserve : pourrait être un écho du Barima plutôt qu'un cours distinct |
| R Corobana | Río Imataca | ⚠️ faible | Le plus au sud/à l'ouest de ce second groupe, avant R. Maryowapaneko/N065 — réserve : pourrait être un distributaire propre de l'Orénoque (Manamo/Pedernales) plutôt que l'Imataca |

### Côte des Caraïbes du Costa Rica (voir fiche N043 — r-auzuelos)

| Nom Jaillot | Identification proposée | Confiance | Position relative |
|---|---|---|---|
| R. Vergues | Río Parismina | ⚠️ moyen | Seconde des deux baies accolées après R. Auzuelos/N043=Río Pacuare (outlet x≈3492, y≈4061), donc plus proche du delta du Colorado/N087 |

### Fourche du Río Tuira/Chucunaque, Golfo de San Miguel (voir fiche N090 — s-maria-river)

| Nom Jaillot | Identification proposée | Confiance | Position relative |
|---|---|---|---|
| (branche non étiquetée) | Río Chico | ⚠️ faible | Bras Est de la première fourche de S. Maria River/N090 (outlet x≈4210, y≈4619) — réserve : le Chico réel rejoint plutôt le Chucunaque à Yaviza |
| (branche non étiquetée) | Río Tuquesa | ⚠️ faible | Bifurcation Nord-Est de la même fourche, plus en amont — préférée à Tupisa |

### Baie de Pensacola / Mobile (voir fiches N028 — marpequeue, N037 — ostras)

Troisième cours réel du secteur, dessiné par Jaillot entre Marpequeue/
N028=Blackwater River et le cours suivant vers l'est, mais omis lors de
la digitalisation (comme les cas ci-dessus). Repères digitalisés
encadrants : Perdido/N041=Wolf Bay (outlet x≈1709), R. Escambia/N020=
Perdido River (x≈1783), Ostras/N037=Escambia River (x≈2006),
Marpequeue/N028=Blackwater River (x≈2154), puis Rio del Canaveral
(x≈2406-2526) plus à l'est.

| Nom Jaillot | Identification proposée | Confiance | Position relative |
|---|---|---|---|
| (non digitalisé) | Yellow River | ⚠️ moyen | Entre l'outlet de Marpequeue/N028 (x≈2154) et celui de Rio del Canaveral (x≈2406-2526) — troisième cours réel de la baie de Pensacola/East Bay, après Blackwater et avant la Choctawhatchee |

**Sous-total : 9 cours à tracer.** *(Correction — avec Ronan : une erreur
d'addition portait ce sous-total à 10 dans une version précédente du
document, alors que les quatre groupes ci-dessus ne totalisent que
5+1+2+1 = 9 lignes — Moruca, Amacuro, Arature, Aguirre, Imataca,
Parismina, Chico, Tuquesa, Yellow River. Le total du corpus ci-dessous
est corrigé en conséquence.)*

## Groupe B — hors périmètre, pour mémoire (ne pas confondre avec un oubli)

Ces cas concernent des fleuves réels et documentés, mais explicitement
jugés absents de la source Jaillot elle-même — pas seulement non
digitalisés. Rien n'a été « repéré sur la carte » pour eux ; il n'y a
donc rien à tracer dans oceanBounds.

- **Río Coyuquilla** (Costa Grande, Mexique) — discuté lors de
  l'identification de R004 (`fluvial-identification-synthese.md`).
  Bassin réel documenté, mais jugé non représenté par Jaillot (source
  probablement muette sur ce cours en 1708).
- **Río Trinidad** (Panama, affluent du Gatún) — candidat écarté pour
  R019 au profit de Río Indio, précisément parce que jugé trop modeste
  pour avoir été dessiné par Jaillot.
- **Río Belén** (Panama, province de Colón) — discuté sous N044
  (r-belem). Le label Jaillot « R Belem » est décalé sur une baie sans
  tracé propre et attribué à Río Calovébora ; le site historique réel de
  Santa María de Belén (colonie de Colomb, 1503) « reste un site
  historique réel mais n'apparaît pas comme cours distinct dans ce
  secteur de Jaillot ».
- **Río Cazones** (Veracruz, Mexique) — discuté sous N072 (r-st-pedro).
  Fleuve réel et bien documenté (bassin de Papantla), mais dont
  l'embouchure se situe au nord du Tecolutla — géométriquement
  incompatible avec la branche B (Chichicatzapan) de R. St Pedro/N072.
  « Reste par conséquent sans correspondant identifié dans l'inventaire
  Jaillot sur ce tronçon — hypothèse explorée puis écartée pour raison
  géométrique, non par manque d'importance réelle du fleuve. »
- **Río Bobos/Filobobos** (Nautla, Veracruz, Mexique) — discuté sous
  N001 (Almaria). Écarté comme candidat pour Almaria : « sa position
  réelle correspond plutôt à un point situé entre Almaria et R. St
  Pedro sans cours Jaillot dédié. »

Ces cinq cas ont été identifiés après une relecture complète (pas
seulement une recherche par mots-clés) des deux corpus — un premier
passage par mots-clés avait laissé passer Belén, Cazones et
Bobos/Filobobos.

## Total du corpus

134 cours digitalisés (`fluvial-research-inventory.json`) + 9 cours
identifiés mais non digitalisés (ci-dessus) = **143 cours d'eau**, tous
identifiés — soit avec un équivalent réel (à une confiance ✅ fort/
⚠️ moyen/⚠️ faible), soit explicitement classés convention
cartographique assumée ou erreur de la carte le cas échéant.

---

*Document de travail — à cocher/mettre à jour au fur et à mesure du
tracé dans oceanBounds. Ne modifie pas `fluvial-research-inventory.json`
(génération réservée aux scripts du projet).*
