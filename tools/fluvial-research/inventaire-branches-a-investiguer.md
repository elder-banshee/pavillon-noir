# Inventaire des branches à investiguer

Recensement de toutes les branches techniques (« B », « C », etc., terminaison
`junction`) encore traitées comme de simples bras anonymes de leur cours
principal, au lieu d'être documentées comme des cours d'eau à part entière —
même s'ils rejoignent un tronc plus grand plutôt que la mer. Même démarche que
pour les 29 R0xx à l'origine : position, confluence, repères proches, en
attente d'identification.

Extrait directement du schéma v2 (`fluvialCourses`/`fluvialConnections`) de
`js/oscar-hex-grid.js`. Les branches de type `sea` (embouchure propre) ne sont
pas listées ici : soit elles ont déjà été scindées en cours autonomes (Gold
River → Tucuti/Tuira), soit elles relèvent d'une politique `multiple` déjà
consolidée sur un cours unique (Río Balsas, Cooper River, Mississippi...) et
ne nécessitent pas d'identification séparée.

**Déjà résolues, en attente du prochain export** (à ne pas reconfondre avec la
liste ci-dessous) : `R. St Pedro_B` → Río Chichicatzapan, `R. Coqueto_B` → Río
Toabré.

## Légende de priorité

- 🔴 **À investiguer en priorité** — branche substantielle (≥ 4 cellules),
  aucune identification même partielle dans les fiches existantes, contexte
  géographique propice à une recherche (repères proches disponibles).
- 🟡 **Investigation possible mais incertaine** — petite branche ou contexte
  pauvre en repères ; identification probablement seulement hypothétique.
- ⚪ **Probablement pas un cours distinct** — brique technique d'un même
  ouvrage/système déjà expliqué (canal, delta lacustre), à confirmer avant
  d'y consacrer du temps.

## Tableau

| Priorité | Cours parent | Branche | Cellules | Confluence → cible | Repères proches |
|---|---|---|---|---|---|
| ⚪ | Barania (Rio Barania) | `barania-r-b` | 4 | `48_12` → tronc principal | Mexico (8,4 NM) — segment du canal du Desagüe de Huehuetoca, déjà expliqué |
| ⚪ | Barania (Rio Barania) | `barania-r-c` | 2 | `49_12` → branche B | Mexico (12,2 NM) — idem, continuation du canal |
| 🔴 | N. Segovia (Río Segovia/Coco) | `n-segovia-river-b` | 9 | `85_63` → tronc principal | Nueva Segovia (29,8 NM), La Trinidad (48,2 NM) — cas cité par Ronan ; candidat le plus prometteur du lot (voir note) |
| 🔴 | Belle Rivière (Ohio) | `ochio-ou-belle-riviere-b` | 15 | `10_23` → Mississippi | Mobile (122 NM), Pensacola (126,2 NM) — grosse branche (15 cellules), aucun repère proche direct mais l'Ohio a plusieurs affluents majeurs bien documentés (Tennessee, Cumberland, Wabash) |
| 🟡 | Bariquicometo (système Turbio→Apure) | `bariquicometo-r-b` | 4 | `106_127` → tronc principal | El Tocuyo (7 NM), Barquisimeto (20,8 NM) |
| 🟡 | Bariquicometo (système Turbio→Apure) | `bariquicometo-r-c` | 7 | `114_141` → tronc principal | Porto Morequito (28,3 NM) — assez éloigné des repères, probablement un affluent des Llanos sans attestation directe |
| 🟡 | Boccades (delta Colorado/San Juan) | `boccades-r-b` | 2 | `89_67` → tronc principal | Confluent du San Juan (27,7 NM) — cluster deltaïque déjà signalé ⚠️ faible dans son ensemble |
| 🟡 | R Yayrepo (delta Colorado/San Juan) | `r-yayrepo-b` | 3 | `89_68` → Boccades | Confluent du San Juan (48,7 NM) — même cluster, même réserve |
| 🔴 | Chagre (Río Chagres) | `chagre-r-b` | 4 | `100_80` → tronc principal | Portobelo (1,2 NM), Venta de Cruces (8,1 NM) — zone très documentée (route transisthmique), bon candidat |
| 🟡 | Chagre (Río Chagres) | `chagre-r-c` | 2 | `99_80` → branche B | Portobelo (16,5 NM) |
| 🟡 | Chepo (Río Bayano) | `cheapo-r-b` | 3 | `99_83` → tronc principal | Nombre de Dios (24,1 NM) |
| 🔴 | Corentyne | `r-corretine-b` | 4 | `111_160` → tronc principal | Villages du delta du Suriname (30,8 NM) |
| 🟡 | Corentyne | `r-corretine-c` | 4 | `112_161` → tronc principal | idem, un peu plus excentré |
| 🔴 | Rio de Carare (affluent Magdalena) | `rio-de-carare-b` | 5 | `112_109` → tronc principal | Vélez (13,4 NM), Santafé de Bogotá (30,6 NM) — zone bien documentée |
| 🟡 | R. Dulce | `r-dulce-1` à `r-dulce-5` | 3/5/2/5/5 | vers tronc principal | Lac Izabal, Cobán — delta déjà décrit comme correspondant à la morphologie réelle multi-bras du Dulce ; probablement pas des cours distincts à nommer individuellement |
| 🔴 | Rio Grande de la Madalena | `rio-grande-de-la-madalena-c` | 6 | `112_102` → tronc principal | Relais du Magdalena (7 NM) — le Magdalena a de nombreux affluents réels non encore assignés (Sogamoso, Lebrija, Opón...) |
| 🔴 | Rio Grande de la Madalena | `rio-grande-de-la-madalena-d` | 6 | `113_102` → tronc principal | Relais du Magdalena (8,7 NM), Mariquita (14,6 NM) |
| 🟡 | Rio Grande de la Madalena | `rio-grande-de-la-madalena-e` | 3 | `116_104` → branche D | Mariquita (20,3 NM) |
| 🟡 | Rio Grande de Santa Martha (Río Cauca) | `rio-grande-de-santa-martha-b` | 3 | `107_96` → tronc principal | Santa Fe de Antioquia (7,7 NM) — affluent du Cauca, candidats réels : Río Nechí, Río Porce |
| ⚪ | Lac Nicaragua | `lac-nicaragua-bras-1` à `-5` | 3/3/5/6/3 | vers le lac | Granada (2,9 NM), Nueva Segovia... — tributaires réels du lac (Río Frío, Sapoá, Tepenaguasapa existent) mais ce sont probablement des segments de rive plutôt que des tracés fluviaux distincts ; à confirmer avant d'investir du temps |
| 🟡 | Marateka (Suriname, delta) | `r-marateka-b` | 6 | `108_162` → tronc principal | Villages du delta du Suriname (24,8 NM) — déjà signalé ⚠️ faible dans son ensemble (même hypothèse que Copanama) |
| 🟡 | Marateka (Suriname, delta) | `r-marateka-d` | 2 | `110_164` → tronc principal | idem |
| 🔴 | Orénoque | `orenoque-b` | 3 | `102_146` → tronc principal | Aromaia (27,9 NM) — de nombreux affluents réels de l'Orénoque restent non assignés (Meta, Guaviare, Arauca...) |
| 🟡 | Orénoque | `orenoque-c` | 2 | `103_145` → tronc principal | Aromaia (29,5 NM) |
| 🟡 | Orénoque | `orenoque-d` | 3 | `105_143` → tronc principal | Macurevoari (27,3 NM) |
| 🔴 | Panuco (Río Pánuco) | `panuco-b` | 5 | `47_23` → tronc principal | Tampico (5,8 NM) — système fluvial le plus riche du secteur, affluents réels candidats (Moctezuma, Tamesí déjà pris par R007, Tamuín) |
| 🟡 | Panuco (Río Pánuco) | `panuco-c` | 3 | `44_23` → F-12_4-A | Tampico (23 NM) |
| 🟡 | Pato (Río Pao) | `pato-r-b` | 7 | `114_129` → tronc principal | repères tous > 100 NM, contexte pauvre |
| 🟡 | Pech (Río Patuca) | `r-pech-b` | 3 | `78_44` → tronc principal | Gracias (4,3 NM) |
| 🟡 | Rivière Sablomuere (Red River) | `riviere-sablomuere-b` | 3 | `27_20` → Mississippi | La Nouvelle-Orléans (88,9 NM), assez loin |
| 🟡 | Sal (Río Cangrejal) | `sal-r-b` | 4 | `80_50` → tronc principal | Comayagua (18,4 NM) |
| 🔴 | Tabasco (système Grijalva/Usumacinta) | `tabasco-r-b` | 4 | `70_37` → tronc principal | Tocotalpa de la Sierra (9,2 NM) — système majeur, l'Usumacinta lui-même n'est peut-être pas encore assigné individuellement |
| 🔴 | Tabasco (système Grijalva/Usumacinta) | `tabasco-r-c` | 6 | `67_38` → tronc principal | Tocotalpa de la Sierra (22,5 NM), Laguna de Términos (40,4 NM) |
| 🟡 | Tabasco (système Grijalva/Usumacinta) | `tabasco-r-d` | 2 | `69_39` → branche C | Laguna de Términos (42,2 NM) |
| 🟡 | Xagua (Río Aguán) | `xagua-r-b` | 4 | `79_56` → tronc principal | Saint-George's (10,4 NM) |

## Note sur N. Segovia_B (exemple cité par Ronan)

Neuf cellules, confluence vers le tronc principal à `85_63`, dans la même
région que Nueva Segovia (29,8 NM) — la ville minière qui donne son nom au
tronc principal (Río Segovia = cours supérieur du Río Coco). Un affluent réel
et bien documenté du haut Coco dans cette zone frontalière
Honduras/Nicaragua est le **Río Poteca** (aussi appelé Río Bodega), qui rejoint
le Coco près de cette même région. C'est une hypothèse de travail à vérifier,
pas encore une identification établie — je n'ai pas de confirmation
toponymique ou cartographique indépendante à ce stade.

## Cas déjà écartés de cet inventaire

- **Balsas / `f-42-14-d-d1`** et **Chiquito / `pacific-1`** : vérifiés — ce ne
  sont pas des branches anonymes d'un cours déjà nommé, mais soit une seconde
  embouchure en mode `multiple` déjà rattachée au même cours (Balsas), soit
  l'unique tracé technique d'un cours à une seule branche nommée « 1 » par
  convention historique (Chiquito) — rien à investiguer.
- Recherché spécifiquement une **répétition du cas Gold River** (deux branches
  avec chacune leur propre embouchure `sea`/`single` sous un même
  `watercourseId`, signe d'un second fleuve réel non séparé) : aucune trouvée
  dans le reste du corpus après vérification systématique des 145 cours.

## Suggestion de méthode

Je peux traiter ce tableau comme les R0xx à l'origine : reprendre chaque ligne
🔴 puis 🟡, chercher une identification réelle avec sources, proposer un
niveau de confiance, et te soumettre les résultats par lot (par exemple par
secteur géographique) plutôt que tout d'un coup. Dis-moi si tu préfères un
ordre particulier, ou si certaines lignes ⚪/🟡 sont à écarter d'emblée selon
ta connaissance du tracé réel.
