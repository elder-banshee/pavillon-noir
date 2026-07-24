# Hiérarchie de documentation hydrologique — proposition

Document de staging (à relire avant intégration). Répond à la Tâche 2 de
`feuille-de-route-identification-complete.md` : tous les cours d'eau ne
justifient pas un profil hydrologique complet (débit, courant, profondeur,
portions navigables). Proposition à deux niveaux, construite à partir des
105 identifications de `fluvial-identification-complete.md` et des 29 déjà
traitées dans `fluvial-identification-synthese.md`.

## Niveau 1 — à documenter individuellement

Deux critères d'inclusion, comme demandé : (a) fleuve structurant d'un
territoire entier, (b) cours historiquement remonté par des flibustiers pour
piller des villes de l'intérieur. Un même fleuve peut cumuler les deux.

### Cœur validé par la consigne de départ

| # | Fleuve | watercourseId(s) | Critère | Justification |
|---|---|---|---|---|
| 1 | **Mississippi** | `mississippi` (N032) | Territorial | Fleuve structurant de la Louisiane entière ; identification ✅ fort, delta à bifurcation simple relevé par Jaillot. |
| 2 | **Orénoque** | `orenoque` (N036) | Territorial | Un des plus grands fleuves d'Amérique du Sud, structurant pour la Nouvelle-Andalousie/Guyane ; ✅ fort, delta multi-bras relevé. |
| 3 | **Rio Grande del Norte / Río Bravo** | `brave-north-river` (N008) | Territorial | Frontière historique Nouveau-Mexique/Texas, fleuve structurant du nord de la Nouvelle-Espagne ; ✅ fort (« Brave (North) River » = traduction anglaise de « Río Bravo del Norte »). |
| 4 | **Río Magdalena** | `rio-grande-de-la-madalena` (N082) | Territorial + historique | Fleuve structurant de la Nouvelle-Grenade ; ✅ fort. Axe majeur de flibuste vers l'intérieur (raids sur Mompox et les villes riveraines, XVIIe-XVIIIe s.), alimenté par le Cauca, le Cesar, le Carare. |
| 5 | **Grijalva / Usumacinta (« Tabasco »)** | `tabasco-r` (N099) + ancrage `R008` (session précédente, bras Carrizal) | Territorial + historique | Structurant du Tabasco/Chiapas ; raids répétés dès le XVIe siècle (explicitement cité dans la consigne). Les deux identifications (R008 et N099) pointent vers le même système deltaïque près de Villahermosa — à fusionner en une seule fiche niveau 1. |
| 6 | **Chagres** | `chagre-r` (N015) | Historique | Route transisthmique de Panama, prise par Henry Morgan en 1671 après le fort San Lorenzo ; ✅ fort. |
| 7 | **Río San Juan (Nicaragua)** | `rio-san-juan` (N087) | Historique | Axe des raids sur Grenade (1665, 1670) ; ✅ fort, structure hydrographique complète relevée (lac Nicaragua, Sarapiquí, Frío/Costaricha, delta multi-bras). |
| 8 | **Sinú** | `cenu` (N013) | Historique | Axe de remontée vers l'arrière-pays, complémentaire au Magdalena pour les raids sur les villages de l'intérieur néogrenadin ; ✅ fort. |

### Propositions additionnelles (au-delà de la liste de départ, à valider)

Ces cours ressortent de la recherche comme candidats sérieux au niveau 1,
sans figurer dans la liste initiale de la consigne — laissés à l'arbitrage
du MJ plutôt qu'ajoutés d'office.

| # | Fleuve | watercourseId(s) | Critère | Justification | Réserve |
|---|---|---|---|---|---|
| 9 | **Río Cauca** | `rio-grande-de-santa-martha` (N083) + ancrage `R026` (session précédente) | Territorial | Second grand fleuve de Nouvelle-Grenade, affluent majeur du Magdalena, drainant tout l'ouest colombien (Antioquia) ; sert la même route de flibuste vers Mompox. | Confiance ⚠️ moyen/fort seulement — N083 et R026 pourraient représenter le même tracé compté deux fois plutôt que deux bras distincts confirmés. À vérifier avant intégration. |
| 10 | **Río Atrato (Rio Grande del Darién)** | `rio-grande-del-darien` (N084) | Territorial | Draine tout le Chocó/Darién, frontière naturelle Darién/Nouvelle-Grenade, débouché stratégique au fond du golfe d'Urabá (zone des raids sur Santa María la Antigua puis Cartagena par l'arrière). | Pas explicitement cité dans la consigne de départ ; importance réelle bien réelle mais rôle flibustier moins documenté dans les scénarios existants du Codex — à confronter aux scénarios déjà écrits. |

### Candidats évoqués par la consigne mais non confirmés cette session

- **Papagayo** (proximité Acapulco) — correspond probablement à `r-de-los-yopes`
  (N052), mais identification seulement ⚠️ moyen (hypothèse territoire
  Yopitzinco). À reconsidérer pour le niveau 1 une fois l'identification
  consolidée.
- **Coatzacoalcos** — `r-guazacoalco-ou-guashigwalp` (N061), nom certain mais
  position Jaillot douteuse (collée à Villahermosa plutôt qu'à l'isthme de
  Tehuantepec réel). Le rôle de portage isthmique du Coatzacoalcos reste
  historiquement réel (route alternative au Nicaragua pour rallier le
  Pacifique) mais la carte ne permet pas de fiabiliser son tracé exact — à
  traiter au niveau 1 seulement après clarification de la position.

**Total niveau 1 proposé : 8 fleuves validés directement par la consigne, +
2 propositions additionnelles à trancher, soit 8 à 10 selon l'arbitrage du
MJ.**

## Niveau 2 — valeurs génériques par taille

Tous les autres cours (97 sur les 105 traités cette session, plus l'essentiel
des 29 de la session précédente). Proposition de calibrage par paliers de
taille, sur le modèle de généricité déjà utilisé pour `catMax` dans
`js/zones-data.js` (hauts-fonds) : une poignée de paliers assortis de plages
réalistes plutôt qu'une valeur unique par cours.

### Proxy de taille retenu

Le `cellCount` déjà présent dans `fluvial-research-inventory.json` (nombre
de cellules de la grille canonique occupées par le cours, toutes branches
confondues) est un proxy simple et déjà disponible pour tous les cours,
utilisable sans recherche supplémentaire. Distribution observée sur les 134
cours de l'inventaire : médiane 7 cellules, moyenne 11,2, maximum 61 (Lac
Nicaragua) hors fleuves de niveau 1.

### Paliers proposés

| Palier | `cellCount` | Exemples dans le corpus | Débit indicatif | Courant | Profondeur à l'embouchure | Portions navigables | `catMax` suggéré |
|---|---|---|---|---|---|---|---|
| **T1 — Ruisseau / crique côtière** | 1–2 | Subutla, Cempel R., R. Quemades | 1–10 m³/s | Faible (< 1 nœud, sauf crue) | 0,5–1,5 brasse (~1–3 m) | Canot/pirogue seulement, quelques centaines de mètres à 2-3 km depuis l'embouchure | Aucun navire de catégorie standard — canots/chaloupes uniquement |
| **T2 — Petit cours** | 3–4 | R. Belem, R. Coqueto, Atoyac R. | 10–40 m³/s | 1–2 nœuds | 1–2,5 brasses (~2–5 m) | Petites embarcations légères sur 5–20 km | 1 |
| **T3 — Cours moyen** | 5–7 | R. Carare (secteur), R. Dulce (branches), Chagre R. (tronçon aval hors niveau 1) | 40–150 m³/s | 1,5–3 nœuds (plus fort en crue saisonnière) | 2,5–4 brasses (~5–7,5 m) | 20–60 km selon saison, jusqu'aux premiers seuils/rapides | 2 |
| **T4 — Cours important** | 8–12 | Panuco (tronçon), R. Berbice, R. Corretine | 150–400 m³/s | 2–3,5 nœuds | 4–6 brasses (~7,5–11 m) | 60–150 km, restrictions saisonnières en étiage | 2 à l'embouchure, 1 en amont |
| **T5 — Grand cours régional** (hors niveau 1) | 13+ | Cesar Pompatao, Rio de Carare (global), R. Dulce (système complet) | 400–1200 m³/s | 2–4 nœuds | 6–10 brasses (~11–18 m) | 150–300+ km par navires légers, souvent limité par des rapides en amont | 3 à l'embouchure, tapering à 1 en amont |

Notes de calibrage :
- Les plages sont volontairement larges (facteur ×3 à ×4 entre bornes basse
  et haute d'un même palier) pour laisser au MJ une marge d'ajustement au cas
  par cas sans nécessiter de recherche individuelle.
- `catMax` reprend la même logique que `hauts-fonds.js` (catégorie maximale
  de navire admise sans restriction) ; un schéma `catMaxNav` /
  `passageNav` (franchissement possible pour une catégorie supérieure sous
  réserve d'un jet de Navigation) pourrait être repris à l'identique pour les
  paliers T3-T5, où la remontée au-delà de l'embouchure est plausible mais
  risquée.
- Le régime de crue saisonnière (habituellement juin-novembre dans la
  Caraïbe) devrait multiplier le débit indicatif par 2 à 5 et le courant par
  1,5 à 2 pendant la saison humide — à intégrer comme modificateur commun
  plutôt que comme un palier séparé.
- Les cours à embouchure directe en mer (`outlets[].type === "sea"`) et ceux
  en jonction vers un autre cours (`type === "junction"`) ne devraient pas
  être calibrés de la même façon : un affluent en jonction hérite en partie
  du régime de son cours receveur et peut être documenté avec une plage plus
  resserrée. Non chiffré ici faute de mandat explicite, mais à garder en tête
  lors de l'implémentation.

## Prochaines étapes suggérées (hors mandat de cette session)

1. Trancher les 2 propositions additionnelles de niveau 1 (Cauca, Atrato) et
   les 2 candidats en attente (Papagayo, Coatzacoalcos).
2. Rédiger les 8 (à 10) fiches hydrologiques individuelles de niveau 1
   (débit, courant, profondeur, portions navigables, sources), sur le modèle
   des fiches d'identification mais enrichi de données hydrologiques
   réelles.
3. Définir dans `js/oscar-hex-grid.js` (ou un fichier dédié, à la discrétion
   du MJ) le schéma de données niveau 2 (palier + éventuel `catMaxNav` /
   `passageNav`), une fois validé.
