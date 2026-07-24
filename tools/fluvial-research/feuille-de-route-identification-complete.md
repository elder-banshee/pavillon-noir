# Feuille de route — Vérification complète des 134 cours d'eau Jaillot

Contexte : `fluvial-research-inventory.json` recense 134 cours d'eau (194
bras), dont 105 déjà nommés sur Jaillot (`researchStatus: "named-on-map"`)
et 29 sans nom, désormais traités dans
`fluvial-identification-synthese.md` (session du [date à compléter]).

Cette feuille de route couvre la suite : vérifier/identifier les 105
cours déjà nommés, puis construire une hiérarchie d'importance pour la
documentation hydrologique du moteur de pilotage automatique.

## Pourquoi passer par Cowork/Dispatch

134 cours d'eau à traiter individuellement (recherche + sourcing +
rédaction), largement au-delà du budget de recherche d'une session de
chat normale (recommandation interne : au-delà de 30 recherches web,
passer par un outil de recherche approfondie). Un agent avec accès
fichiers (Desktop Commander) et budget de recherche étendu est mieux
adapté.

## Tâche 1 — Identification des équivalents modernes (105 cours nommés)

Pour chaque `watercourseId` avec `researchStatus: "named-on-map"` dans
`fluvial-research-inventory.json` :
- Rechercher l'équivalent réel/moderne du toponyme Jaillot, en
  s'appuyant sur : le nom lui-même (souvent une transcription
  phonétique déformée), le territoire, les villes/repères proches
  (`js/villes-data.js`), les cours voisins déjà identifiés.
- Attribuer un niveau de confiance : ✅ fort / ⚠️ moyen / ⚠️ faible /
  🎲 probablement une convention cartographique ou une invention sans
  cours réel correspondant (cf. R012/Valladolid, Yucatán karstique,
  traité cette session).
- Ne jamais forcer un rapprochement phonétique ou géographique non
  étayé : consigner « non déterminé » plutôt que d'inventer.
- Attention aux distances : le référentiel est `nauticalMilesPerPixel:
  0.310282` — une distance interne au pixel de la carte, PAS une
  distance terrestre réelle. Ne l'utiliser que pour la position
  relative, jamais pour arbitrer entre deux candidats réels proches.
- Attention aux noms de baies/îles/mouillages pris à tort pour des noms
  de fleuves (cf. Alimcingo, Cone I., I. Perica cette session) :
  vérifier avant d'assigner.
- Recouper avec une carte contemporaine indépendante (Delisle 1718 pour
  la Louisiane, par exemple) chaque fois qu'un tracé Jaillot semble
  douteux ou qu'un doute subsiste.

## Tâche 2 — Hiérarchie d'importance pour le moteur de pilotage

Tous les cours d'eau n'ont pas besoin d'un profil hydrologique complet
(débit, courant, profondeur, portions navigables). Établir 2-3 niveaux :

**Niveau 1 — à documenter individuellement** (débit, courant, profondeur,
portions navigables, sources). Critères de sélection :
- Importance géographique majeure (fleuves structurants d'un territoire
  entier) : Mississippi, Orénoque, Rio Grande del Norte, Magdalena,
  Grijalva/Usumacinta.
- Importance historique pour la campagne : cours remontés par des
  flibustiers pour piller des villes de l'intérieur — Chagres (route de
  Panama, prise par Morgan 1671), San Juan (raid sur Grenade, Nicaragua,
  1665 et 1670), Papagayo/proximité Acapulco, Sinú/Magdalena (raids sur
  Mompox/Cartagena de l'intérieur), Tabasco/Grijalva (raids répétés dès
  le XVIe siècle), Coatzacoalcos.
- Cours structurant une route de commerce ou de contrebande majeure du
  Codex (à recouper avec les scénarios déjà écrits, ex. le Chagres pour
  Portobelo/Panama).

**Niveau 2 — valeurs génériques mais réalistes.** Tous les autres cours,
avec des plages de valeurs par défaut selon la taille du cours
(catégorie basée sur le nombre de cellules/l'ordre de grandeur réel une
fois identifié), en cohérence avec les principes déjà établis pour
`catMax` (proxy composite tirant d'eau/maniabilité/fragilité) — même
logique de généricité calibrée que pour les hauts-fonds.

## Livrables attendus

1. Un fichier `fluvial-identification-complete.md` ou `.json` (staging,
   non intégré directement) listant les 105 identifications avec le
   même format que la session précédente (researchId/watercourseId,
   identifiedName, modernName, confidence, reasoning, sources).
2. Une proposition de hiérarchie (niveau 1 / niveau 2) avec
   justification pour chaque cours de niveau 1.
3. Un résumé chiffré (répartition par niveau de confiance, comme dans
   `fluvial-identification-synthese.md`).
4. Ne pas modifier `js/oscar-hex-grid.js` ni les fichiers de données du
   site — rester en fichiers de staging, à revue humaine avant toute
   intégration.
