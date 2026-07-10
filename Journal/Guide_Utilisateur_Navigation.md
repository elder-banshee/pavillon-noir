# Guide du Pilote Automatique — Comprendre la navigation

*Pavillon Noir — document de référence, à corriger et compléter au fil de l'eau.*

---

## Avant-propos

Ce guide explique le fonctionnement du **Pilote Automatique**, l'outil de calcul d'itinéraire
intégré à la carte du site. Il ne remplace pas le livre de règles — il explique comment l'outil
*traduit* les règles de navigation en calcul, et où les deux se rejoignent ou s'écartent encore.

Le **Pilote Automatique** ne calcule qu'une *projection* de route. La route réellement suivie en
jeu n'est jamais garantie identique : elle reste soumise aux aléas météorologiques, aux
rencontres, aux événements survenant à bord, etc. Le Pilote donne une estimation, pas une
prophétie.

Le moteur est en cours de développement, en particulier la partie **courants marins** (§1.3) :
certains comportements décrits ici peuvent encore changer d'une session de travail à l'autre. Si
quelque chose ici ne correspond plus à ce que tu observes sur le site, dis-le-moi et je mets le
guide à jour.

Certaines règles ci-dessous sont **prévues mais pas encore actives** dans l'outil — chacune est
signalée par 🛠️. Elles sont documentées ici parce que tu en auras besoin à table dès maintenant,
même si le Pilote Automatique ne les applique pas encore de lui-même.

Les termes en **gras** sont définis dans le **Lexique** en fin de document.

---

## 1. La Navigation — comment le Pilote Automatique calcule une route

### 1.1 Vue d'ensemble

Pour calculer un itinéraire, le Pilote Automatique prend en compte, quand ils sont actifs :

- le **vent** et l'**allure** du navire par rapport à lui (§1.2) ;
- les **courants** marins (§1.3) ;
- les **hauts-fonds** et les terres à éviter (§1.4) ;
- les caractéristiques du navire utilisé : sa vitesse, son **encombrement**, son **carénage**
  (détaillées en §3).

Tous ces paramètres ne sont pas actifs en permanence : leur prise en compte dépend du
**niveau de Navigation** du pilote qui effectue le calcul (§2). Un pilote peu expérimenté ne voit
tout simplement pas certains de ces paramètres, et son calcul s'en trouve à la fois plus simple et
moins fiable.

**Le Pilote Automatique ne mérite vraiment son nom qu'à partir du niveau de Navigation 3.**
En dessous, c'est davantage un **simulateur de projection de route** selon la compétence du
pilote — il donne une estimation de bonne foi, mais qui ignore délibérément le vent, les
courants, ou le relief côtier selon ce que le pilote est censé savoir. C'est précisément ce qui
permet à plusieurs joueurs de comparer leurs résultats sur un même trajet : celui dont le calcul
est le plus complet (et donc le plus lent à obtenir, le plus prudent) met en valeur sa compétence
face à un pilote qui annonce un trajet "trop simple pour être vrai".

### 1.2 Le vent

Un seul **vent dominant** s'applique à toute la carte (pas de variation géographique ni
saisonnière pour l'instant). Sa direction est exprimée en **provenance** : un vent "NNE" vient du
NNE et souffle vers le SSW — ce n'est pas la direction vers laquelle il pousse.

Le vent n'entre dans le calcul qu'à partir du **niveau de Navigation 2**. En dessous, le navire
utilise sa **vitesse moyenne** (§3.2), constante quel que soit le cap.

Près des côtes, le **déventement** atténue la force du vent dans l'ombre portée du relief (côtes
ou reliefs élevés), à partir du niveau de Navigation 3.

### 1.3 Les courants — chantier en cours

Le Pilote Automatique calcule l'effet des **courants marins** sur la route, en décomposant le
courant en deux composantes par rapport au cap suivi :
- une composante qui pousse ou freine le navire dans l'axe de sa route ;
- une composante de **dérive latérale**, que le navire doit "compenser" en sacrifiant une partie
  de sa vitesse propre. Si la dérive dépasse ce que le navire peut compenser, le segment de route
  devient impossible à suivre tel quel.

Les courants n'entrent dans le calcul qu'à partir du **niveau de Navigation 1**. En dessous, le
Pilote calcule "à l'estime" : il ignore purement et simplement tout courant marin, comme s'il
naviguait en eau calme.

Les données de courants sont en cours de recalibrage à partir de sources océanographiques réelles
— les vitesses et directions affichées aujourd'hui peuvent encore évoluer sensiblement d'une
session de travail à l'autre. Si une route te semble anormalement favorisée ou pénalisée par un
courant, c'est un bon réflexe de me le signaler : ça aide à calibrer les données.

### 1.4 Les hauts-fonds

Un **haut-fond** est une zone de mer peu profonde ou dangereuse. Deux notions bien distinctes s'y
appliquent, et il ne faut pas les confondre :

- **La visibilité** détermine si le haut-fond *apparaît sur la carte* — elle dépend du niveau de
  Navigation du pilote (un haut-fond peut rester invisible pour un pilote débutant).
- **Le franchissement** détermine si le navire *a le droit d'y entrer* — il dépend uniquement de
  la **catégorie de taille** du navire, et parfois d'un niveau de Navigation *spécifique à ce
  haut-fond*, distinct du seuil de visibilité.

**Un haut-fond visible n'est jamais automatiquement franchissable.** Exemple concret : au niveau
de Navigation 1, un seul haut-fond est révélé sur la carte, le **Banc des Bahamas**. Cela ne
signifie *pas* que ton navire peut le traverser au niveau 1 :
- les catégories 1 et 2 le franchissent toujours librement (elles n'ont pas besoin de compétence
  particulière) ;
- la catégorie 3 ne peut le franchir qu'à partir du niveau de Navigation 3 — bien après le niveau
  qui l'a rendu visible ;
- les catégories 4 et 5 n'ont, à ce jour, aucune exception : le passage leur reste interdit.

Chaque haut-fond a ainsi son propre couple (catégorie maximale libre / catégorie maximale avec
expérience / niveau de Navigation requis pour cette exception). Sans indication spécifique, la
limite par défaut de franchissement est la catégorie 3.

---

## 2. Le niveau de Navigation

### 2.1 Un niveau individuel, pas collectif

**Le niveau de Navigation est personnel à chaque joueur**, pas une valeur unique pour le groupe.
Chaque pilote a le sien, sur une échelle de **0 à 5**, et calcule ses propres routes avec les
informations et mécaniques que son niveau débloque. C'est précisément ce qui permet à plusieurs
PJ de comparer leurs itinéraires pour un même trajet, et de mettre en valeur la compétence du
pilote attitré du navire face à un membre d'équipage moins expérimenté.

### 2.2 Ce que chaque niveau débloque

> Tableau cumulatif : un niveau supérieur garde tous les avantages des niveaux inférieurs.

**Niveau 0 — Aucune compétence**
- **Pilote Automatique inaccessible.**
- Fiche navire limitée aux informations publiques : modèle, vitesse moyenne par jour,
  restrictions régionales.

  > ⚑ **Incohérence relevée** : la fiche navire est techniquement un sous-module du Pilote
  > Automatique, mais elle reste consultable au niveau 0 alors que le Pilote lui-même est
  > verrouillé. À corriger — soit en verrouillant totalement la fiche au niveau 0, soit en
  > assouplissant l'accès au Pilote pour cohérence.

**Niveau 1 — Notions de base**
- **Pilote Automatique débloqué** (calcul de route disponible, en eau calme et sans vent — voir
  §1.1).
- Les **courants** connus entrent dans le calcul de route (§1.3).
- Le **Banc des Bahamas** devient visible sur la carte — sans que cela ne garantisse son
  franchissement (§1.4).
- Fiche navire : tonnage total, équipage maximal.

**Niveau 2 — Lecture du vent**
- Le **vent** et les **allures** entrent dans le calcul (§1.2).
- Le modificateur d'**encombrement** devient actif (§3.4).
- Fiche navire : tonnage utile, encombrement, équipage minimal, voilure, vitesses détaillées par
  allure.

**Niveau 3 — Lecture fine des côtes**
- Le **déventement côtier** entre en jeu (§1.2).
- Le modificateur de **carénage** devient actif (§3.5).
- **Le Pilote Automatique mérite pleinement son nom à partir de ce niveau** (voir §1.1).
- Fiche navire : tirant d'eau, carénage.

**Niveau 4 — Expérience confirmée**
- Pas de nouvelle règle mécanique identifiée à ce niveau actuellement ; il élargit surtout le
  catalogue de navires reconnaissables (certains navires ne sont identifiables qu'à partir de ce
  niveau).

**Niveau 5 — Maîtrise complète**
- Accès à toutes les informations, y compris les notes contextuelles/historiques sur les navires.

### 2.3 Comment le niveau est défini (détail technique, secondaire)

- **Mot de passe individuel** : chaque joueur se voit révéler, à titre personnel, le mot de passe
  correspondant à son niveau actuel ; le mot de passe suivant lui est communiqué quand ce niveau
  progresse. Ce n'est pas un mot de passe partagé pour tout le groupe.
- **Mode public / Mode MJ** : le site distingue simplement deux modes. En **mode public**, chaque
  pilote calcule avec son propre niveau. En **mode MJ**, l'accès est total et immédiat : tout est
  toujours visible et pris en compte dans les calculs, sans restriction — c'est l'équivalent d'un
  niveau 5 permanent, indépendant du niveau réel de chaque PJ.
- **Test MJ** : en mode MJ, un encadré dédié permet de *simuler* temporairement un niveau de
  Navigation et une **catégorie de taille** de navire différents, pour voir exactement ce qu'un
  pilote donné verrait — sans rien changer aux valeurs réelles.

---

## 3. Les navires

### 3.1 Catégorie de taille

Chaque navire a une **catégorie de taille**, de 1 à 5 :

| Catégorie | Type |
|---|---|
| 1 | Chaloupe |
| 2 | Sloop |
| 3 | Goélette |
| 4 | Frégate |
| 5 | Vaisseau de ligne |

C'est cette catégorie qui détermine, avant tout, si le navire peut franchir un **haut-fond**
donné (§1.4). En mode MJ, le **Test MJ** permet de simuler une catégorie différente pour vérifier
l'accès d'un type de navire à une zone, sans changer le navire réellement actif des PJ.

### 3.2 Vitesse

Deux régimes de vitesse, selon le niveau de Navigation actif :

- **En dessous du niveau de Navigation 2** : le navire utilise sa **vitesse moyenne**, une valeur
  constante en nœuds, quel que soit le cap suivi.
- **À partir du niveau de Navigation 2** : la vitesse dépend de l'**allure** — l'angle entre la
  route suivie et la provenance du vent.

| Allure | Angle par rapport au vent |
|---|---|
| Bout au vent | 0–44° (vitesse nulle en ligne droite — il faut louvoyer) |
| Près | 45–89° |
| Largue | 90–134° |
| Grand largue | 135–179° |
| Vent arrière | 180° |

### 3.3 Encombrement

L'**encombrement** mesure la proportion de la capacité utile du navire occupée par la cargaison,
le sureffectif, les vivres, etc. Réglable dans la fiche navire, il influence la vitesse à partir
du niveau de Navigation 2 :

- **Moins de 25 %** d'encombrement : **+1 nœud**.
- **Plus de 75 %** : **−1 nœud**.
- Entre les deux : aucun effet.

### 3.4 Carénage

Le **carénage** représente l'état d'entretien de la coque (dernier nettoyage/calfatage).
Modifiable dans la fiche navire, il influence la vitesse à partir du niveau de Navigation 3 :

- **Moins de deux mois** : **+1 nœud**.
- **Plus de douze mois** : **−1 nœud**.
- Entre les deux ("normal") : aucun effet.

Le navire des PJ est actuellement en carénage "ancien" (donc −1 nœud) — c'est l'état réel de la
campagne en cours, pas une valeur oubliée par défaut.

### 3.5 Équipage et Manœuvrabilité

L'effectif d'équipage se compare à un minimum et un maximum propres à chaque navire.

🛠️ **Règle prévue (non encore appliquée par le Pilote Automatique), mais essentielle à table** :
un équipage sous-dimensionné inflige une pénalité au score de **Manœuvre** :

| Effectif par rapport au minimum requis | Pénalité de Manœuvre |
|---|---|
| ≥ 100 % du minimum | Aucune |
| ≥ 80 % du minimum | **−1** |
| ≥ 60 % du minimum | **−2** |
| ≥ 50 % du minimum | **−3** |
| < 50 % du minimum | **Navire impossible à manœuvrer** |

Cette règle n'est pour l'instant qu'*affichée* de façon indicative (alerte visuelle si l'effectif
sort des bornes) — le Pilote Automatique ne l'applique pas encore à ses calculs. À terme, le
modificateur final de Manœuvrabilité devrait s'afficher dans un encadré dédié pour que les
joueurs en soient avertis en continu.

🛠️ **Sureffectif — conséquences non techniques pour l'instant.** Un équipage en surnombre pose
un problème de place à bord (les vivres et l'eau nécessaires augmentent d'autant), et fait courir
un risque d'épidémie critique — mais cela ne se traduit pas encore par une règle chiffrée. Piste
envisagée pour plus tard : calculer la consommation de vivres par tête (donc le tonnage utile
qu'elle occupe), et faire en sorte que tout effectif au-delà de l'équipage maximum consomme
également du tonnage utile en plus (poids des matelots supplémentaires).

### 3.6 Restrictions du modèle de navire

Certains navires sont, par conception, limités dans leur usage. Ces restrictions sont une
propriété du **modèle** de navire — elles sont donc **toujours connues** dès que le navire est
accessible dans le catalogue, indépendamment du niveau de Navigation (contrairement aux autres
caractéristiques détaillées plus haut, débloquées progressivement).

Deux types de restriction, à ne pas confondre :

- **Interdiction pure et simple** : un navire conçu pour la navigation côtière *uniquement* se
  voit refuser purement et simplement l'accès à la haute mer (et, le cas échéant, aux voies
  fluviales). Ce n'est pas un malus, c'est un blocage.
- **Malus** : un navire qui *peut* sortir de la navigation côtière mais y est moins à l'aise
  subit un modificateur négatif variable (**−1 à −3**) au score de Manœuvrabilité, plutôt qu'un
  blocage.

🛠️ Ces restrictions sont actuellement affichées sur la fiche navire mais **pas encore appliquées
par le Pilote Automatique** (ni le blocage, ni le malus). Une clarification des données est aussi
à prévoir : un champ actuellement nommé "malus de navigation hauturière" désigne en réalité, pour
certains navires strictement côtiers, une interdiction et non un malus — la distinction ci-dessus
n'est pas encore reflétée dans la structure de données.

---

## Lexique

**Allure** — Position du navire par rapport à la direction d'où vient le vent (bout au vent, près,
largue, grand largue, vent arrière), qui détermine sa vitesse possible.

**Carénage** — État d'entretien de la coque (nettoyage/calfatage récent ou ancien) ; modifie la
vitesse du navire à partir du niveau de Navigation 3.

**Catégorie de taille** — Classe de gabarit du navire (1 à 5, de la chaloupe au vaisseau de
ligne), qui détermine notamment l'accès aux hauts-fonds.

**Compensation de dérive** — Part de la vitesse du navire "consommée" pour contrer la composante
latérale d'un courant et rester sur sa route.

**Déventement (côtier)** — Atténuation du vent dans l'ombre portée d'un relief côtier, à partir
du niveau de Navigation 3.

**Encombrement** — Proportion de la capacité utile du navire occupée (cargaison, sureffectif,
provisions...) ; modifie la vitesse à partir du niveau de Navigation 2.

**Franchissement (d'un haut-fond)** — Droit d'un navire à entrer dans un haut-fond donné ; dépend
de sa catégorie de taille et, parfois, d'un niveau de Navigation propre à ce haut-fond. À ne pas
confondre avec la *visibilité* du haut-fond sur la carte (§1.4).

**Haut-fond** — Zone de mer peu profonde ou dangereuse, dont le franchissement dépend de la
catégorie de taille du navire et, parfois, du niveau de Navigation.

**Manœuvrabilité / Manœuvre** — Score affecté par le rapport entre l'effectif d'équipage et le
minimum requis (§3.5), et par les restrictions de certains modèles de navire en navigation
côtière (§3.6). Non encore appliqué par le Pilote Automatique.

**Mode public / Mode MJ** — Les deux modes d'accès à la carte. En mode public, chaque pilote
utilise son propre niveau de Navigation. En mode MJ, l'accès est total, sans restriction.

**Naïf / route naïve** — Se dit d'un calcul ou d'une information volontairement incomplète, parce
que conditionnée par un niveau de Navigation insuffisant. Un pilote inexpérimenté ne perçoit pas
l'itinéraire optimal réel : il trace une route d'une grande simplicité et annonce généralement des
temps et distances de trajet particulièrement courts. Découvrir en mer que la traversée est plus
longue et compliquée que prévu peut avoir des conséquences funestes selon l'approvisionnement à
bord — en admettant que la destination soit effectivement atteinte.

**Niveau de Navigation** — Compétence individuelle d'un pilote (0 à 5), qui conditionne son accès
au Pilote Automatique et les informations/mécaniques qu'il prend en compte dans ses calculs.

**Pilote Automatique** — Outil de calcul d'itinéraire de la carte. Ne mérite pleinement ce nom
qu'à partir du niveau de Navigation 3 ; en dessous, c'est un simulateur de projection de route.

**Test MJ** — Encadré réservé au mode MJ permettant de simuler temporairement un niveau de
Navigation et/ou une catégorie de navire différents, sans modifier les valeurs réelles.

**Vent dominant** — Vent unique appliqué à toute la carte, défini par une direction de provenance
et une force.

**Vitesse moyenne** — Vitesse constante du navire, utilisée quand le vent n'est pas encore pris
en compte (niveau de Navigation inférieur à 2).

---

*Les liens directs vers le code (fichier, fonction, bloc précis) ne sont pas encore intégrés à ce
guide — ils viendront dans une prochaine passe, sous forme de paragraphes que tu pourras déplier
ou replier selon que tu veuilles juste la règle, ou aussi son implémentation. Dis-moi quand tu
veux qu'on s'y attaque.*
