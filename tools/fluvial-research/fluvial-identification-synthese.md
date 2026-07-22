# Synthèse — Identification des cours d'eau sans nom (Jaillot 1708)

Session de travail sur `fluvial-research-dossier.md` (29 fiches). Document de
synthèse à relire et corriger avant toute intégration dans les données du
site. Convention : ✅ fort · ⚠️ moyen/faible · 🎲 fiction ou convention
cartographique assumée.

## Méthode et limites posées durant la session

- Le référentiel `[x, y]` du site est un CRS Leaflet Simple calé sur les
  pixels de l'image 8500×5320 — **aucune correspondance GPS réelle**
  n'existe dans le code. Les distances « NM carte » du dossier sont donc
  des distances internes à la carte (échelle arbitraire du moteur de jeu :
  840 px ≈ 260,7 NM), pas des distances terrestres réelles. Utilisables
  pour la position relative, pas pour arbitrer entre deux candidats réels
  proches l'un de l'autre.
- Plusieurs « cours voisins » listés dans le dossier se sont révélés être
  des noms de baies, d'îles ou de mouillages plutôt que des noms de
  fleuves (Alimcingo, Cone I., I. Perica) — à vérifier au cas par cas
  avant d'assigner un toponyme Jaillot à un cours d'eau.
- Le Yucatán (R012) et le panhandle floridien (R013-R014) posent des
  problèmes de fond : le premier n'a quasiment pas de drainage de surface
  réel (plateau karstique), le second était très mal relevé par les
  cartographes européens du début du XVIIIe siècle. Traiter ces cas comme
  des conventions cartographiques plutôt que forcer une identification.


## Tableau récapitulatif

| ID | Toponyme Jaillot / repère | Identification proposée | Confiance |
|---|---|---|---|
| R001 | Est de Xiopa (ex-Alimcingo, écarté) | Non déterminé (lagune de Manzanillo ?) | ⚠️ faible |
| R002 | Près de Cachan | Río Armería (Boca de Apiza) — hypothèse | ⚠️ faible |
| R003 | Zacatula | **Río Balsas** (Río de Zacatula) | ✅ fort |
| R004 | Costa Grande, voisin « R de los Yopes » | Non déterminé | ⚠️ faible |
| R005 | Acapulco, distinct de Metapec R. | Río de la Sabana | ⚠️ moyen |
| R006 | « la Sablomuere R. » | **Red River** (Rivière Rouge) | ✅ fort |
| R007 | Tansaquilco | Río Tamesí (Guayalejo) | ⚠️ moyen |
| R008 | Spirito Santo (Villahermosa) | Bras occidental du delta du Grijalva | ✅ fort |
| R009 | St Salvador / la Trinidad | Río Jiboa — hypothèse | ⚠️ moyen |
| R010 | Entre R. Dulce et Chuckabul | **Río Sarstún** | ✅ fort |
| R011 | « R. Testa », sud de León | Non déterminé | ⚠️ faible |
| R012 | Rivière de Valladolid (Yucatán) | Convention cartographique, pas de fleuve réel | 🎲 |
| R013 | Secteur Cap Escondido (Floride) | Non déterminé | ⚠️ faible |
| R014 | « Port Grande » (Floride) | Non déterminé | ⚠️ faible |
| R015 | « old Chirique » | **Río Chiriquí Viejo** | ✅ fort |
| R016 | « Chiriqui » | **Río Chiriquí** (Nuevo) | ✅ fort |
| R017 | Est de Puebla (Alanje) | Río David — hypothèse | ⚠️ moyen |
| R018 | Natá | Río Grande de Coclé (ou Río Chico) | ⚠️ moyen/fort |
| R019 | Affluent sud du Chagre (Capira) | Río Cirí Grande / Trinidad — hypothèse | ⚠️ faible |
| R020 | Près de Capira / I. Perica | Río Caimito — hypothèse | ⚠️ faible |
| R021 | 3 bras, 11,1 NM de Charles Town | **Cooper River / Wando River** | ✅ fort |
| R022 | 4,3 NM de Charles Town | **Ashley River** | ✅ fort |
| R023 | 14 NM de Charles Town | Stono River | ⚠️ moyen |
| R024 | 27,2 NM de Charles Town | North Edisto River — hypothèse | ⚠️ faible |
| R025 | Golfe d'Urabá | Boca du delta de l'Atrato (Boca Tarena ?) | ⚠️ moyen |
| R026 | Jonction Rio Grande de la Madalena | **Río Cauca** | ✅ fort |
| R027 | Jonction Lac Maracaibo | **Río Chama** | ✅ fort |
| R028 | Jonction Orénoque | Río Caroní — hypothèse | ⚠️ moyen |
| R029 | Près de San José de Macuro | Non déterminé | ⚠️ faible |

## Bilan

- **11 identifications fortes** (R003, R006, R008, R010, R015, R016, R021,
  R022, R026, R027 — 10, plus R018 à la limite moyen/fort).
- **10 à confiance moyenne**, généralement une hypothèse réelle plausible
  mais sans confirmation visuelle du tracé exact (R002, R005, R007, R009,
  R017, R019, R020, R023, R025, R028).
- **8 restent ouvertes** faute d'éléments suffisants (R001, R004, R011,
  R013, R014, R024, R029), plus **R012** qui est un cas à part (probable
  absence de fleuve réel).

## Pistes pour approfondir

Zones où une capture centrée apporterait le plus de valeur, par ordre de
priorité :
1. **Floride, R013/R014** — secteur entier à reprendre, y compris avec
   d'autres cartes contemporaines (Moll, Delisle) en comparaison, comme
   pour R006/Sablomuere.
2. **R004** (Costa Grande, Guerrero) — un recadrage centré sur le segment
   Zacatula–Acapulco au-delà de Zumpango.
3. **R019/R020** (bas Chagre, secteur Capira) — le tracé exact des
   affluents sud du Chagre trancherait entre les hypothèses.
4. **R011, R029** — aucune piste sérieuse pour l'instant ; à revoir si
   d'autres repères (villages, caps) apparaissent sur une capture.
5. **R001/R002** — resterait à confirmer lequel des deux fleuves réels de
   la baie de Manzanillo correspond à quel tracé, si cette précision a un
   intérêt pour la carte de jeu.

## Notes de méthode à retenir pour la suite

- Vérifier systématiquement si un « cours voisin » nommé dans le dossier
  est bien un fleuve et non une île/baie/mouillage avant de l'exploiter
  comme repère.
- Pour les deltas complexes (Grijalva, Atrato), une identification au
  niveau du système fluvial est possible même sans pouvoir désigner le
  bras exact — à noter comme telle plutôt que de forcer une précision
  non justifiée.
- Recouper avec une carte contemporaine (Delisle 1718 en particulier)
  reste la méthode la plus fiable quand un tracé Jaillot est ambigu ou
  semble erroné — comme pour R006.
