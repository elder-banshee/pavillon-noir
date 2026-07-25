# Table de correspondance — codes de secteur et identifiants finaux

Générée après stabilisation des domaines maritimes dans `js/oscar-hex-grid.js` (résolution par embouchure, exception Barania R. = pacifique). Ordre au sein de chaque domaine : coordonnée x de l'embouchure, croissante (convention de tri, pas une lecture géographique stricte). Pas de numérotation : **10**, uniforme, dimensionné sur le domaine le plus riche (caribbean, 46 cours).

**Colonnes :** `Code` = nouveau code de secteur ; `Id` = identifiant technique simplifié (à utiliser dans le JSON final et pour corriger `oscar-hex-grid.js`), dérivé du toponyme Jaillot harmonisé quand il existe, sinon de l'identification moderne harmonisée (29 cours R0xx + 4 cours nouvellement tracés sans étiquette) ; `Ancien id` = N0xx/R0xx pour les 134 cours déjà digitalisés, ou « (nouveau) » pour les 10 tracés cette session ; `Nom canonique` = toponyme Jaillot harmonisé (ou nom moderne harmonisé si aucun toponyme Jaillot n'existe).

**Règle de l'id :** générique hydronymique (Rio/Río, River, Rivière, Fleuve, Caño) retiré quand le reste est un toponyme autosuffisant ; conservé pour les lacs (`lac-...`, marque la nature non fluviale) et pour les noms composés/descriptifs où le générique est indissociable (`riviere-aux-vaches`, `riviere-de-may`) ou sert à désambiguïser un mot courant (`yellow-river`, `gold-river`).

**Cas signalés :**

- `colorado` : résolu (avec Ronan) — nom primaire Rio Colorado, alias Nicaragua. Correspond à l'estuaire/branche sud du système lac Nicaragua → mer ; Ronan corrige `oscar-hex-grid.js` pour distinguer cette branche de la remontée vers le lac (nom valide : Rio San Juan), qui devra recevoir sa propre entrée une fois le tracé scindé — voir note géographique ci-dessous.
- `suere` : résolu (avec Ronan) — nom primaire Suere, alias Blewfield River.
- `valladolid` (ex-R012) : résolu (avec Ronan) — baptisé Rio Valladolid, convention cartographique (aucun fleuve réel, Yucatán karstique).
- `tucuti` / `tuira` (ex-N022 « Gold River » / « Gold River_B ») : résolu (avec Ronan) — Jaillot écrit « Gold Riv. and mines », une description et non un toponyme, donc nom canonique = identification moderne (comme les 29 R0xx). Vérification Zone Editor (Ronan) : les deux branches ont chacune leur source et leur propre exutoire, débouché commun en `108_85` — deux cours réels distincts (Río Tucutí/Balsas, district aurifère de Cana ; et Río Tuira, fleuve principal du Darién), donc scindés en deux entrées.
- **Défaut structurel identifié (signalé par Ronan, export vers `oscar-hex-grid.js`) :** plusieurs cours où une « branche B » technique (suffixe hérité du regroupement automatique par `branchBase()`) correspond en réalité à un second fleuve réel, nommé indépendamment dans les fiches, mais jamais séparé en sa propre entrée finale — la branche gardait donc son nom technique brut (ex. `R St Pedro_B`) au lieu du nom identifié. Audit complet des 31 cours à branches multiples : deux autres cas confirmés (même profil que Gold River) —
  - `chichicatzapan` (ex-« R. St Pedro_B », branche de N072/`san-pedro`=Rio Tecolutla) : distributaire réel du Tecolutla, rive sud, confirmé par recoupement avec Mortier 1733. Séparé en entrée propre, jonction conservée vers `san-pedro`.
  - `toabre` (ex-« R. Coqueto_B », branche de N049/`coqueto`) : affluent réel du Río Coclé del Norte, confiance ⚠️ moyen (héritée de la fiche N049, non tranchée séparément). Séparé en entrée propre, jonction conservée vers `coqueto`.
  Les autres cours à branches multiples (Panuco, Mississippi, Tabasco R., Orénoque, R. Dulce, etc.) ont été vérifiés un par un : toutes leurs branches restent des bras/chenaux du même fleuve identifié, sans nom distinct — pas de scission nécessaire.
  Cas apparenté non résolu : `cooper` (R021) — la fiche note explicitement que le Wando est *« un second cours réel distinct rejoignant le Cooper près de son embouchure, pas un simple alias »*, mais aucune des branches tracées (F-8_87-A2/A3) n'a été assignée avec certitude au Wando spécifiquement. Non scindé pour l'instant, à trancher si besoin.
  Le corpus passe de 145 à **147** cours (145 + chichicatzapan + toabre). Codes ajoutés hors-grille : GLF095 (entre GLF090 et GLF100), CAR275 (entre CAR270 et CAR280), en plus de PAC275 (Tucuti/Tuira).

**Note géographique — scission Rio San Juan / Rio Colorado :**

Le tronc actuellement unique `rio-san-juan` (16 cellules, exutoire du lac Nicaragua à la cellule `93_62`, embouchure mer à `92_69`) mesure, une fois reconstitué par chaînage hexagonal, environ 199 km sur la carte — à comparer aux ~192 km réels du Río San Juan, ce qui valide bien l'échelle de ce tronçon. Géographiquement, le Río Colorado se sépare du San Juan dans les derniers ~20 km avant la côte (delta de Barra del Colorado/Isla Calero, Costa Rica), soit environ 10 % de la longueur totale — un point qui tombe, sur le chaînage de cellules, entre `92_68` (≈28,5 km de l'embouchure) et `92_69` (embouchure, cap « P. Iuan »). Recommandation : ne rebaptiser « Rio Colorado » que la cellule d'embouchure `92_69` (et la jonction immédiatement en amont si Ronan préfère une transition sur 2 cellules) ; tout le tronc de `93_62` à `92_68` reste « Rio San Juan ». Réserve : à cette résolution de grille, une seule cellule couvre déjà ~28 km, donc le point de bifurcation réel ne peut être positionné qu'approximativement — et rien n'indique que Jaillot avait connaissance de cette scission fine du delta en 1708 plutôt que d'une simple double dénomination du même tronc ; le choix de la matérialiser dans la grille est un parti pris de gameplay, pas une restitution cartographique certaine.


## caribbean (CAR) — 47 cours

| Code | Id | Ancien id | Nom canonique |
|---|---|---|---|
| CAR010 | `sarstun` | R010 | Rio Sarstún |
| CAR020 | `dulce` | N055 | Rio Dulce |
| CAR030 | `pech` | N067 | Rio Pech |
| CAR040 | `sal` | N091 | Rio Sal |
| CAR050 | `xagua` | N104 | Rio Xagua |
| CAR060 | `valladolid` | R012 | Rio Valladolid *(baptisé par Ronan — convention cartographique, pas de fleuve réel identifiable, Yucatán karstique)* |
| CAR070 | `lac-nicaragua` | N026 | Lac Nicaragua |
| CAR080 | `guaiapo` | N060 | Rio Guaiapo |
| CAR090 | `granda` | N059 | Rio Granda |
| CAR100 | `de-costaricha` | N051 | Rio de Costaricha |
| CAR110 | `n-segovia` | N033 | N. Segovia River |
| CAR120 | `serapique` | N070 | Rio Serapique |
| CAR130 | `boccades` | N007 | Rio Boccades |
| CAR140 | `yayrepo` | N076 | Rio Yayrepo |
| CAR150 | `colorado` | N087 | Rio Colorado *(alias : Nicaragua — estuaire/branche sud du système lac Nicaragua → mer ; distinct de la remontée `rio-san-juan`, à ajouter une fois le tracé scindé dans `oscar-hex-grid.js`)* |
| CAR160 | `trigu` | N101 | Rio Trigu |
| CAR170 | `yare` | N105 | Rio Yare |
| CAR180 | `vergues` | (nouveau) | Rio Vergues |
| CAR190 | `auzuelos` | N043 | Rio Auzuelos |
| CAR200 | `suere` | N097 | Suere *(alias : Blewfield River)* |
| CAR210 | `caranaco` | N047 | Rio Caranaco |
| CAR220 | `talamanca` | N073 | Rio Talamanca |
| CAR230 | `quemades` | N069 | Rio Quemades |
| CAR240 | `veragua` | N103 | Rio Veragua |
| CAR250 | `belem` | N044 | Rio Belem |
| CAR260 | `chagre` | N015 | Rio Chagre |
| CAR270 | `coqueto` | N049 | Rio Coqueto |
| CAR275 | `toabre` | (nouveau) | Rio Toabré |
| CAR280 | `indio` | R019 | Rio Indio |
| CAR290 | `de-los-redes` | N079 | Rio de los Redes |
| CAR300 | `grande-del-darien` | N084 | Rio Grande del Darien |
| CAR310 | `negro` | N085 | Rio Negro |
| CAR320 | `turbo` | R025 | Rio Turbo |
| CAR330 | `cenu` | N013 | Cenu |
| CAR340 | `san-jorge` | R026 | Rio San Jorge |
| CAR350 | `grande-de-santa-martha` | N083 | Rio Grande de Santa Martha |
| CAR360 | `cesar-pompatao` | N014 | Cesar Pompatao |
| CAR370 | `de-carare` | N078 | Rio de Carare |
| CAR380 | `grande-de-la-madalena` | N082 | Rio Grande de la Madalena |
| CAR390 | `auyamas` | N004 | Auyamas |
| CAR400 | `buchia` | N046 | Rio Buchia |
| CAR410 | `lac-maracaibo` | N025 | Lac Maracaibo |
| CAR420 | `chama` | R027 | Rio Chama |
| CAR430 | `meracaybo` | N031 | Meracaybo River |
| CAR440 | `ovarabiche` | N038 | Rio Ovarabiche |
| CAR450 | `manamo` | R029 | Caño Mánamo *(générique « Caño » conservé — désigne un chenal/distributaire, distinct de « Rio »)* |
| CAR460 | `europa` | N021 | Rio Europa |

## gulf_mexico (GLF) — 37 cours

| Code | Id | Ancien id | Nom canonique |
|---|---|---|---|
| GLF010 | `sablomuere` | N089 | Rivière Sablomuere |
| GLF020 | `ouachita` | R006 | Rivière Ouachita *(déjà complet/au format — nom français)* |
| GLF030 | `almaria` | N001 | Almaria |
| GLF040 | `brave-north` | N008 | Brave (North) River |
| GLF050 | `tispe` | N074 | Rio Tispe |
| GLF060 | `sampoval` | N093 | Rio Sampoval |
| GLF070 | `cempel` | N012 | Rio Cempel |
| GLF080 | `de-vera-cruz` | N054 | Rio de Vera Cruz |
| GLF090 | `san-pedro` | N072 | Rio San Pedro |
| GLF095 | `chichicatzapan` | (nouveau) | Rio Chichicatzapan |
| GLF100 | `tamesi` | R007 | Rio Tamesí *(alias : Rio Guayalejo)* |
| GLF110 | `panuco` | N039 | Panuco |
| GLF120 | `mississippi` | N032 | Mississippi |
| GLF130 | `riviere-aux-vaches` | N088 | Rivière aux Vaches |
| GLF140 | `belle-riviere` | N035 | Belle Rivière |
| GLF150 | `de-medelin` | N053 | Rio de Medelin |
| GLF160 | `de-aluerado` | N077 | Rio de Aluerado |
| GLF170 | `carrizal` | R008 | Rio Carrizal |
| GLF180 | `guazacoalco` | N061 | Rio Guazacoalco |
| GLF190 | `snelo` | N071 | Rio Snelo |
| GLF200 | `perdido` | N041 | Perdido |
| GLF210 | `tondelo` | N100 | Tondelo |
| GLF220 | `st-anns` | N095 | St Anns |
| GLF230 | `escambia` | N020 | Rio Escambia |
| GLF240 | `palmas-dos-bogas` | N086 | Rio Palmas dos Bogas |
| GLF250 | `chequapeque` | N017 | Chequapeque |
| GLF260 | `tabasco` | N099 | Rio Tabasco |
| GLF270 | `ostras` | N037 | Ostras |
| GLF280 | `logwood-creek` | N027 | Logwood Creek |
| GLF290 | `marpequeue` | N028 | Marpequeue |
| GLF300 | `yellow-river` | (nouveau) | Yellow River |
| GLF310 | `del-canaveral` | N080 | Rio del Canaveral |
| GLF320 | `flores` | N057 | Rio Flores |
| GLF330 | `nieves` | N034 | Rio Nieves |
| GLF340 | `ochlockonee` | R013 | Ochlockonee River *(déjà complet/au format)* |
| GLF350 | `st-marks` | R014 | St Marks River *(alias : Apalachee River — « St » conservé, origine anglaise)* |
| GLF360 | `del-spirito-sancto` | N081 | Rio del Spirito Sancto |

## pacific (PAC) — 30 cours

| Code | Id | Ancien id | Nom canonique |
|---|---|---|---|
| PAC010 | `barania` | N005 | Rio Barania |
| PAC020 | `cihuatlan` | R001 | Rio Cihuatlán *(alias : Rio Marabasco)* |
| PAC030 | `laguna-de-cuyutlan` | R002 | Laguna de Cuyutlán *(pas un hydronyme simple — exutoire lagunaire à deux chenaux, nom descriptif conservé)* |
| PAC040 | `subutla` | N096 | Subutla |
| PAC050 | `balsas` | R003 | Rio Balsas |
| PAC060 | `atoyac` | N003 | Rio Atoyac |
| PAC070 | `lac-de-mexico` | N024 | Lac de Mexico |
| PAC080 | `coyuquilla` | R004 | Rio Coyuquilla *(ou Rio Petatlán — tronc/affluent non tranché)* |
| PAC090 | `de-los-yopes` | N052 | Rio de los Yopes |
| PAC100 | `de-la-sabana` | R005 | Rio de la Sabana |
| PAC110 | `matapec` | N029 | Rio Matapec |
| PAC120 | `galer` | N058 | Rio Galer |
| PAC130 | `salinas` | N092 | Salinas |
| PAC140 | `michataya` | N066 | Rio Michataya |
| PAC150 | `jiboa` | R009 | Rio Jiboa |
| PAC160 | `lempa` | N062 | Rio Lempa |
| PAC170 | `chiquito` | R011 | Rio Chiquito |
| PAC180 | `chiriqui-viejo` | R015 | Rio Chiriquí Viejo |
| PAC190 | `chiriqui` | R016 | Rio Chiriquí |
| PAC200 | `david` | R017 | Rio David |
| PAC210 | `grande-de-cocle` | R018 | Rio Grande de Coclé *(alias : Rio Chico)* |
| PAC220 | `caimito` | R020 | Rio Caimito |
| PAC230 | `chepo` | N016 | Rio Chepo |
| PAC240 | `congo` | N018 | Rio Congo |
| PAC250 | `s-maria` | N090 | S. Maria River |
| PAC260 | `sholes` | N094 | Sholes |
| PAC270 | `tucuti` | (nouveau) | Río Tucutí *(alias : Río Balsas)* |
| PAC275 | `tuira` | (nouveau) | Rio Tuira |
| PAC280 | `chico` | (nouveau) | Rio Chico |
| PAC290 | `tuquesa` | (nouveau) | Rio Tuquesa |

## atlantic (ATL) — 27 cours

| Code | Id | Ancien id | Nom canonique |
|---|---|---|---|
| ATL010 | `bariquicometo` | N006 | Rio Bariquicometo |
| ATL020 | `buria-o-de-san-pedro` | N009 | Buria o de San Pedro |
| ATL030 | `pato` | N040 | Rio Pato |
| ATL040 | `capuri` | N010 | Rio Capuri |
| ATL050 | `caturi-voari` | N011 | Rio Caturi Voari |
| ATL060 | `zuata` | R028 | Rio Zuata |
| ATL070 | `lac-de-caslipa` | N023 | Lac de Caslipa |
| ATL080 | `varacoyari` | N102 | Rio Varacoyari |
| ATL090 | `coyrama` | N019 | Rio Coyrama |
| ATL100 | `orenoque` | N036 | Orénoque |
| ATL110 | `maryowapaneko` | N065 | Maryowapaneko |
| ATL120 | `corobana` | (nouveau) | Rio Corobana |
| ATL130 | `sebarrima` | (nouveau) | Rio Sebarrima |
| ATL140 | `maritere` | (nouveau) | Rio Maritere |
| ATL150 | `amachara` | (nouveau) | Rio Amachara |
| ATL160 | `amacuro` | N042 | Rio Amacuro |
| ATL170 | `waymy` | N075 | Waymy |
| ATL180 | `spruyt` | (nouveau) | Spruyt |
| ATL190 | `pomeroon` | N068 | Pomeroon |
| ATL200 | `essequibo` | N056 | Essequibo |
| ATL210 | `berbice` | N045 | Berbice |
| ATL220 | `corentyne` | N050 | Corentyne |
| ATL230 | `copanama` | N048 | Copanama |
| ATL240 | `marateka` | N063 | Marateka |
| ATL250 | `suriname` | N098 | Suriname |
| ATL260 | `commewijne` | (nouveau) | Commewijne |
| ATL270 | `marrawini` | N064 | Marrawini |

## florida (FLA) — 6 cours

| Code | Id | Ancien id | Nom canonique |
|---|---|---|---|
| FLA010 | `arba-de-canaveral` | N002 | Arba de Canaveral |
| FLA020 | `riviere-de-may` | N030 | Rivière de May |
| FLA030 | `cooper` | R021 | Cooper River *(note : le Wando est un second cours réel distinct rejoignant le Cooper près de son embouchure, pas un simple alias)* |
| FLA040 | `ashley` | R022 | Ashley River |
| FLA050 | `stono` | R023 | Stono River |
| FLA060 | `north-edisto` | R024 | North Edisto River |

## bahamas (BHM) — 0 cours

Aucun cours d'eau ne se résout dans ce domaine (archipel corallien, pas de système fluvial).
