// Registre des PNJ — Pavillon Noir
// Généré depuis le registre de campagne
// Mise à jour : avril 2026

const PNJ_DATA = [
  {
    id: "bellamy",
    nom: "Samuel Bellamy",
    alias: "Black Sam, le Prince des Pirates",
    statut: "inconnu",
    naissance: "vers 1689 — avril 1717 (?)",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Antonio"],
    portrait: "pnj/portraits/bellamy.jpg",
    bio: `Le Prince des Pirates — le surnom est mérité, mais pas pour les raisons qu'on croit. Bellamy ne gagne pas les batailles : il gagne les gens, ce qui est bien plus rare. Stratège approximatif, marin médiocre, sa légende repose sur ce qu'on oublie de ses échecs et ce qu'on retient de ses coups d'éclat — et ils sont réels. Il ne s'adresse à son équipage que par ces mots : "Mes amis." Et ils le croient.

C'est lui qui a libéré Antonio lors de son transfert vers La Havane, sur information des contrebandiers anglais. Sans calcul apparent — l'idée de contrarier un gouverneur espagnol l'amusait, un bretteur de talent pouvait toujours servir. À la séparation, il a restitué les effets personnels d'Antonio et versé une solde.

Naufrage du Whydah en avril 1717. Sort officiel : inconnu.`
  },
  {
    id: "hornigold",
    nom: "Benjamin Hornigold",
    alias: null,
    statut: "mort",
    naissance: "vers 1680 — 1719",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes"],
    portrait: null,
    bio: `Fondateur de la République Pirate de Nassau et du Flying Gang. Il y a chez lui quelque chose de l'ancien officier de la Royal Navy qu'il n'a jamais tout à fait quitté : la discipline, la tenue, l'autorité sans éclat. Il commande par l'exemple, sans crier. On le suit parce qu'il dégage la certitude d'être à sa place.

A pris la Marianne (frégate française, 32 canons) par ruse juste avant l'arrivée de Jennings — épisode fondateur de leur animosité durable. C'est via lui que la lettre de Ruggiero della Scala est parvenue aux PJ, transmise par Teach.

Portrait : allure aristocratique sans noblesse de sang, larges favoris grisonnants, longue redingote sobre. Ne porte jamais de tricorne.`
  },
  {
    id: "jennings",
    nom: "Henry Jennings",
    alias: null,
    statut: "vivant",
    naissance: "vers 1680 — après 1730",
    origine: "Anglais (Bermudes)",
    tags: ["Nassau", "Jamaïque", "Kingston", "Épaves-Flotte-au-Trésor"],
    portrait: null,
    bio: `Corsaire devenu pirate, commissionné par le gouverneur de Jamaïque. Figure mafieuse plus qu'aventurière : n'intervient que lorsque le rapport de force est écrasant en sa faveur. C'est lui qui a ordonné le massacre de prisonniers sur la plage après la prise de la Marianne (décembre 1715).

Il ne s'adresse pratiquement jamais directement à ses hommes — Rackham sert d'interface. Les PJ ont existé dans sa mémoire comme le menu fretin de l'équipage de Bellamy : à peine remarqués, vite oubliés.

Portrait : taille moyenne, bloc massif, cheveux très courts, yeux bleu pâle presque translucides qui ne clignent pas. Ne hausse jamais la voix — chaque mot semble extrait d'une violence contenue.`
  },
  {
    id: "teach",
    nom: "Edward Teach",
    alias: "Barbe-Noire",
    statut: "mort",
    naissance: "vers 1680 — 22 novembre 1718",
    origine: "Anglais",
    tags: ["Nassau", "Épaves-Flotte-au-Trésor"],
    portrait: null,
    bio: `Second d'Hornigold lors des Épaves et de la Marianne. C'est lui qui a remis aux PJ la lettre de Ruggiero della Scala — sans explication sur la manière dont elle lui était parvenue. Scandalisé par le massacre ordonné par Jennings sur la plage.

Septembre 1717 : Hornigold lui confie officiellement le commandement d'une sloop. Novembre 1717 : capture seul La Concorde, la rebaptise Queen Anne's Revenge. Devient capitaine indépendant à part entière.

Portrait : la barbe noire est réelle, et son effet soigné. Stature imposante, présence physique immédiate.`
  },
  {
    id: "vane",
    nom: "Charles Vane",
    alias: null,
    statut: "vivant",
    naissance: "vers 1680",
    origine: "Anglais",
    tags: ["Nassau", "Jamaïque", "Épaves-Flotte-au-Trésor"],
    portrait: null,
    bio: `Pilote d'Henry Jennings — navigateur réputé talentueux, ce qui explique seul qu'il occupe ce poste. En présence des PJ, toujours en retrait, dans l'ombre de Jennings dont il n'a aucune raison de disputer l'espace.

Pendant le massacre des prisonniers après la Marianne, il regardait avec un demi-sourire amusé — pas de répugnance, pas de retenue. L'air de quelqu'un qui reconnaît une méthode qu'il connaît bien et n'a pas besoin de valider. Son amusement était probablement moins dirigé vers les excès de Jennings que vers deux cents hommes réputés redoutables, incapables de se dresser contre un seul individu.`
  },
  {
    id: "rackham",
    nom: "John Rackham",
    alias: "Calico Jack, Rackham le Rouge",
    statut: "vivant",
    naissance: "vers 1682",
    origine: "Anglais",
    tags: ["Nassau", "Jamaïque", "Épaves-Flotte-au-Trésor"],
    portrait: null,
    bio: `Quartier-maître d'Henry Jennings — interlocuteur obligé de quiconque souhaite communiquer avec lui. Lien entre Jennings et son équipage, probablement garant de la cohésion d'un groupe qu'on ne peut pas diriger éternellement par la seule terreur. Ses relations avec les PJ, quoique limitées, ont toujours été cordiales.

Pendant le massacre des prisonniers après la Marianne, il était visiblement mal à l'aise — désapprobation lisible, trahie par la posture et le regard, tout en ayant le devoir de justifier les actes de son capitaine.

Le surnom "Calico Jack" vient de ses goûts vestimentaires — calicot rayé, inhabituel pour un pirate.`
  },
  {
    id: "ruggiero",
    nom: "Ruggiero della Scala",
    alias: "Scarpa (alias utilisé en fuite)",
    statut: "mort",
    naissance: "vers 1640 — vers 1714",
    origine: "Italien (Génois)",
    tags: ["La Tortue", "Trinidad", "Antonio"],
    portrait: pnj/portraits/ruggiero.jpg,
    bio: `Vieux maître d'armes italien. Ancien précepteur d'Antonio à Trinidad : un alcoolique de génie, payé en gîte, couvert et tafia, qui était véritablement brillant quand il parvenait à rester sobre. A transmis à Antonio un style d'escrime unique, mélange de techniques italiennes et de fougue espagnole.

A fui Trinidad dans des circonstances troublantes, laissant derrière lui une lettre à Antonio. A été retrouvé mort à La Tortue, tué dans la rue par un homme non identifié. Boîtait légèrement de la jambe gauche.`
  },
  {
    id: "sloane",
    nom: "Hans Sloane",
    alias: null,
    statut: "vivant",
    naissance: "1660 — 1753",
    origine: "Irlandais (installé en Angleterre)",
    tags: ["Europe", "Fanch", "Edward"],
    portrait: null,
    bio: `Médecin naturaliste, secrétaire de la Royal Society. Professeur de Fañch au Royal College of Physicians de Londres — une influence décisive dans sa formation, transmettant autant une philosophie qu'un savoir : voir dans chaque spécimen végétal une potentielle source de guérison.

C'est également lui qui a remis à Edward Sutherland sa lettre de mission — rédigée en urgence, encore non signée par le Président, avant de l'envoyer obtenir lui-même le précieux visa d'Isaac Newton.`
  },
  {
    id: "newton",
    nom: "Isaac Newton",
    alias: null,
    statut: "vivant",
    naissance: "1643 — 1727",
    origine: "Anglais",
    tags: ["Europe", "Edward"],
    portrait: null,
    bio: `Président de la Royal Society (1703–1727). A signé la lettre de mission d'Edward Sutherland lors d'une rencontre improvisée dans son jardin — où il l'avait contraint à planter des pommiers pendant qu'il l'écoutait. La lettre vaut passe-droit auprès des gouverneurs coloniaux.`
  },
  {
    id: "woodall",
    nom: "Nicholas Woodall",
    alias: null,
    statut: "inconnu",
    naissance: null,
    origine: "Anglais",
    tags: ["Nassau", "Cap-Français", "SED"],
    portrait: null,
    bio: `Pirate et contrebandier anglais, capitaine du sloop Wolf (30 tonneaux). Les PJ l'ont rencontré à Cap-Français lors du banquet — c'est lui qui a évoqué en premier devant eux l'existence d'un réseau de contrebande organisé qu'il appelle "le Trident", et dont il est clairement une victime.`
  },
  {
    id: "elliot",
    nom: "Thomas Elliot",
    alias: null,
    statut: "vivant",
    naissance: "vers 1675",
    origine: "Anglais",
    tags: ["Caraïbes", "Antonio"],
    portrait: null,
    bio: `Contrebandier anglais, contact d'Antonio depuis Trinidad. C'est lui qui a fourni à Bellamy les informations permettant l'interception du Santa Laura de Córdoba et la libération d'Antonio — un geste pragmatique, une opportunité saisie, pas un sacrifice. Aide les PJ contre rémunération raisonnable.`
  },
  {
    id: "wandesford",
    nom: "Thurston Wandesford",
    alias: null,
    statut: "vivant",
    naissance: "vers 1678–1685",
    origine: "Anglais (Irlande)",
    tags: ["Europe", "Robert", "Fanch"],
    portrait: pnj/portraits/wnadesford.jpg,
    bio: `Lord anglais rencontré à Saint-Malo en 1711 par Robert Arundel, dans des circonstances hautement équivoques pour les deux parties. Le duel qui a suivi s'est conclu par la mutilation de sa main droite — un coup de pistolet tiré dans le dos, dévié in extremis. Fañch, appelé en urgence pour le soigner, a dû amputer la main complète après installation de la gangrène.

Wandesford lui en tient toujours rigueur. Il a ruiné la réputation de Fañch à Saint-Malo et réclame Clonakilty, baronnie irlandaise ancestrale des Arundel.

Il réapprend depuis l'escrime main gauche. Ambitieux, opportuniste, la manche droite pendant vide et soigneusement arrangée.`
  },
  {
    id: "gaspar",
    nom: "Gaspar de la Serna",
    alias: null,
    statut: "vivant",
    naissance: "vers 1690",
    origine: "Espagnol (Trinidad)",
    tags: ["Trinidad", "Caraïbes", "Antonio"],
    portrait: pnj/portraits/gaspar.jpg,
    bio: `Oficial de la Real Hacienda espagnole, croisé de façon inattendue. Rival d'enfance d'Antonio à Trinidad : issu de la famille dont la plantation voisine a prospéré quand celle des Caballero stagnait. C'est lui qui a fait emprisonner Antonio après le duel, avant que Bellamy n'intervienne.

Son poste actuel : Panama City, Real Hacienda. Les PJ en savent encore peu sur lui au-delà de ce passé commun.`
  },
  {
    id: "edward-england",
    nom: "Edward England",
    alias: "Edward Seegar (vrai nom)",
    statut: "disparu",
    naissance: "vers 1685 — vers 1720",
    origine: "Irlandais",
    tags: ["Nassau", "Épaves-Flotte-au-Trésor"],
    portrait: null,
    bio: `Pirate irlandais de son vrai nom Edward Seegar. Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Dégoûté par ce qu'il a vu, a quitté les Caraïbes pour l'océan Indien. Connu pour sa clémence envers les vaincus — l'exact opposé de Jennings.`
  },
  {
    id: "silver",
    nom: "Long John Silver",
    alias: null,
    statut: "inconnu",
    naissance: null,
    origine: "Anglais (reconstitution littéraire)",
    tags: ["Nassau", "Épaves-Flotte-au-Trésor"],
    portrait: pnj/portraits/silver.jpg,
    bio: `Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Observait la scène avec une fascination froide, sans intervenir. Personnage de Bjorn Larsson (roman John Silver, 1995) plutôt que de Stevenson.`
  },
  // PNJ Île des Ombres
  {
    id: "hobbs",
    nom: "Nathaniel Hobbs",
    alias: null,
    statut: "mort",
    naissance: null,
    origine: "Anglais",
    tags: ["Île-des-Ombres"],
    portrait: null,
    bio: `Maître charpentier du Téméraire. Massif, barbe grise, jambe droite brisée, le visage creusé de cicatrices. Bourru dans la forme, loyal dans les actes — c'est lui qui a guidé l'équipage dans la réparation du sloop après l'échouage. Mort durant les événements de l'île.`
  },
  {
    id: "alarcon",
    nom: "Don Francisco de Alarcon",
    alias: null,
    statut: "mort",
    naissance: null,
    origine: "Espagnol",
    tags: ["Île-des-Ombres", "Antonio"],
    portrait: null,
    bio: `Grand, élancé, une cicatrice sur la joue gauche et un regard d'acier. Cousin du noble tué en duel par Antonio à Trinidad — une rancœur ancienne qu'il n'a pas cherché à dissimuler. Obstiné jusqu'à l'absurde : a refusé d'évacuer l'île avec les forces espagnoles. Dévoré par les Indiens Bravos.`
  },
  {
    id: "velazquez",
    nom: "Commandant Diego Velazquez",
    alias: null,
    statut: "vivant",
    naissance: null,
    origine: "Espagnol",
    tags: ["Île-des-Ombres"],
    portrait: null,
    bio: `Élégant, mince, l'allure aristocratique. Superstitieux malgré son éducation, ambitieux mais pas téméraire. A choisi de quitter l'île avec ses troupes plutôt que de partager l'obstination fatale de Don Francisco.`
  },
  // PNJ SED
  {
    id: "lefevre",
    nom: "Guillaume Lefèvre",
    alias: null,
    statut: "vivant",
    naissance: "vers 1680",
    origine: "Français",
    tags: ["Cap-Français", "SED"],
    portrait: null,
    bio: `Chef cuisinier français, rescapé de naufrage. A supervisé le grand banquet de Cap-Français avec un sérieux de praticien et une générosité de rescapé. A offert son livre de recettes à Amédée en souvenir.`
  },
  {
    id: "blackwood",
    nom: "Lord Blackwood",
    alias: null,
    statut: "inconnu",
    naissance: null,
    origine: "Anglais",
    tags: ["Cap-Français", "SED", "Antonio", "Robert"],
    portrait: null,
    bio: `Agent britannique infiltré dans la délégation du banquet de Cap-Français. A recruté Antonio et Robert comme gardes du corps pour les compromettre. Responsable de l'empoisonnement de la délégation espagnole — Dom Rodrigo Oliveira est mort. Interpellé par le Gouverneur Blénac alors qu'il quittait Cap-Français, les faux documents de Rochambeau trouvés sur lui l'ont confondu. Sort inconnu depuis.`
  },
  {
    id: "rochambeau",
    nom: "Chevalier de Rochambeau",
    alias: null,
    statut: "vivant",
    naissance: "vers 1660",
    origine: "Français",
    tags: ["Cap-Français", "SED"],
    portrait: null,
    bio: `Diplomate français aguerri, opposé au traité de libre-échange hispano-français. Avait préparé ses propres manœuvres pour saboter les négociations — une diversion par herbes légères, des clauses falsifiées. A renoncé après la révélation du complot de Blackwood, qui a rendu toute manœuvre supplémentaire superflue.`
  },
  {
    id: "blenac",
    nom: "Louis de Courbon, comte de Blénac",
    alias: null,
    statut: "mort",
    naissance: "1644 — 1719",
    origine: "Français",
    tags: ["Cap-Français", "SED", "Antonio", "Robert"],
    portrait: null,
    bio: `Gouverneur de Saint-Domingue au moment du banquet de Cap-Français. Administrateur perspicace, favorable au traité. C'est sur la foi d'Antonio qu'il a fait intercepter Blackwood — et c'est lui qui a libéré Robert et Antonio avec une injonction sans équivoque : ne plus paraître à Cap-Français. Ton pragmatique plutôt que vengeur.`
  },
  {
    id: "morelet",
    nom: "Père Morelet d'Aboville",
    alias: null,
    statut: "vivant",
    naissance: "vers 1665",
    origine: "Français",
    tags: ["Cap-Français", "SED"],
    portrait: null,
    bio: `Vicaire général, chef de la communauté jésuite à Saint-Domingue. Hôte du banquet dans les jardins du couvent. Présence discrète et bienveillante ce soir-là — l'homme d'Église qui met son espace à disposition sans se mêler du reste.`
  },
  {
    id: "vandergroot",
    nom: "Johannes Van der Groot",
    alias: null,
    statut: "vivant",
    naissance: "vers 1665",
    origine: "Hollandais",
    tags: ["Cap-Français", "SED"],
    portrait: null,
    bio: `Marchand hollandais représentant la WIC, passionné de botanique et de cartographie. A servi d'intermédiaire pour mettre les PJ en contact avec Rochambeau. Accompagné de Mademoiselle Claudine, jeune femme métisse présentée comme sa nièce.`
  },
  {
    id: "montblanc",
    nom: "Monsieur de Montblanc",
    alias: null,
    statut: "vivant",
    naissance: "vers 1660",
    origine: "Français",
    tags: ["Cap-Français", "SED"],
    portrait: null,
    bio: `Riche planteur français. Redevable envers les PJ pour un service rendu concernant sa plantation. Présent au banquet de Cap-Français.`
  },
  // PNJ Épaves
  {
    id: "diego",
    nom: "Diego",
    alias: null,
    statut: "vivant",
    naissance: "vers 1695",
    origine: "Espagnol (Trinidad)",
    tags: ["Épaves-Flotte-au-Trésor", "Trinidad", "Antonio"],
    portrait: null,
    bio: `Jeune soldat de conscription espagnol, originaire de Trinidad. A reconnu Antonio parmi les prisonniers lors des Épaves de la Flotte au Trésor. C'est lui qui a appris aux PJ que la plantation Caballero avait changé de mains, et que l'aînée des sœurs d'Antonio serait entrée au service des Mendez de la Serna.`
  },
  {
    id: "kabo",
    nom: "Kabo",
    alias: null,
    statut: "vivant",
    naissance: "vers 1700",
    origine: "Mosquito (Nicaragua)",
    tags: ["Épaves-Flotte-au-Trésor", "Dusmatis"],
    portrait: null,
    bio: `Plongeur Mosquito, originaire du rivage nicaraguayen. A été recruté parmi les libérés lors des Épaves de la Flotte au Trésor. A reconnu Dusmatis comme originaire de la même région — une connivence tranquille, sans effusion.`
  },
  // Factions
  {
    id: "flying-gang",
    nom: "Flying Gang / Conseil de Nassau",
    alias: null,
    statut: "disparu",
    naissance: null,
    origine: "Nassau (Bahamas)",
    tags: ["Nassau"],
    portrait: null,
    bio: `La République Pirate de Nassau, fondée par Hornigold et ses pairs. Cinq magistrats élus en janvier 1716 à l'issue des affaires de la Flotte au Trésor : Hornigold, Teach, Jennings, Cockram, Burgess. Structure fragile, personnelle, sans constitution écrite — elle tient par les hommes qui la composent autant que par les principes qu'elle défend.`
  },
  {
    id: "equipage-johnson",
    nom: "L'Équipage du Capitaine Charles Johnson",
    alias: null,
    statut: "vivant",
    naissance: null,
    origine: "Britannique",
    tags: ["Europe", "Robert"],
    portrait: null,
    bio: `Réseau de correspondants qui documente les événements et personnages extraordinaires des Indes Occidentales pour un commanditaire londonien. Robert Arundel en est le correspondant de terrain — approché avant son départ pour les Caraïbes par un certain Nathaniel Mist, qui se présentait comme "membre de l'équipage du Capitaine Charles Johnson".`
  }
];
