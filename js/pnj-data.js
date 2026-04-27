// Registre des PNJ — Pavillon Noir
// Généré depuis le registre de campagne
// Mise à jour : avril 2026

const PNJ_DATA = [
  {
    id: "bellamy",
    epingle: true,
    nom: "Samuel Bellamy",
    alias: "Black Sam, le Prince des Pirates, Robin des mers",
    statut: "actif",
    naissance: "1689",
    origine: "Anglais (Cape Cod)",
    tags: ["Nassau", "Caraïbes", "L'Île des Ombres", "La Marianne", "Les épaves de la Flotte au Trésor", "Antonio"],
    portrait: "pnj/portraits/bellamy.jpg",
    bio: `Sauveur d’Antonio, interceptant le navire qui le conduisait à la potence. Sauveur à nouveau d’Antonio, Fañch et Dusmãtis, alors qu’ils dérivaient en mer sur une épave non loin de Nassau. Son charisme surnaturel lui permet de discuter d’égal à égal avec les plus humbles comme les plus puissant, et lui assure la loyauté de tous.

A volé la Sainte-Marie à Jennings sans que cela ne l’empêche de s’associer à nouveau avec lui quelques semaines plus tard pour piller les Épaves de la Flotte au Trésor.

`
  },
  {
    id: "hornigold",
    nom: "Benjamin Hornigold",
    epingle: true,
    alias: null,
    statut: "actif",
    naissance: "vers 1670-80",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Flying Gang", "L'Île des Ombres", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/hornigold.jpg",
    bio: `Fondateur de la République Pirate de Nassau et du Flying Gang. Il y a chez lui quelque chose de l'ancien officier de la Royal Navy qu'il n'a jamais tout à fait quitté : la discipline, la tenue, l'autorité sans éclat. Il commande par l'exemple, sans crier. On le suit parce qu'il dégage la certitude d'être à sa place.

A pris la Marianne (frégate française, 32 canons) au nez et à la barbe de Jennings — épisode fondateur de leur animosité durable. Magistrat du Conseil de Nassau.

Portrait : allure aristocratique, larges favoris grisonnants, longue redingote sobre. Ne porte jamais de tricorne.`
  },
  {
    id: "jennings",
    epingle: true,
    nom: "Henry Jennings",
    alias: null,
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais (Bermudes)",
    tags: ["Nassau", "Caraïbes", "Jamaïque", "Kingston", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/jennings.jpg",
    bio: `Corsaire devenu pirate, commissionné par le gouverneur de Jamaïque. Figure mafieuse plus qu'aventurière : n'intervient que lorsque le rapport de force est écrasant en sa faveur. C'est lui qui a ordonné le massacre de prisonniers sur la plage après la prise de la Marianne (décembre 1715).

Il ne s'adresse pratiquement jamais directement à ses hommes — Rackham sert d'interface. Les PJ ont existé dans sa mémoire comme le menu fretin de l'équipage de Bellamy : à peine remarqués, vite oubliés. Élu magistrat au Conseil de Nassau.

Portrait : taille moyenne, bloc massif, cheveux très courts, yeux bleu pâle presque translucides qui ne clignent pas. Ne hausse jamais la voix — chaque mot semble extrait d'une violence contenue.`
  },
  {
    id: "teach",
    epingle: true,
    nom: "Edward Teach",
    alias: "Barbe-Noire",
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/teach.jpg",
    bio: `Second et Quartier-Maître d'Hornigold lors des Épaves et de la Marianne. D’une discipline et d’une loyauté exemplaires pour exécuter les ordres de son Capitaine, son courage et sa fougue au combat lui valent le respect et l’admiration de ses hommes.

Scandalisé par le massacre ordonné par Jennings après la Marianne. Élu magistrat au Conseil de Nassau et membre fondateur du Flying Gang, il doit néanmoins composer avec lui.

Portrait : la barbe noire est réelle, et son effet soigné. C'est un colosse : stature imposante, présence physique immédiate.`
  },
  {
    id: "williams",
    nom: "Paulsgrave Williams",
    alias: null,
    statut: "actif",
    naissance: "vers 1675",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: null,
    bio: `Associé de Bellamy — compagnon d'armes, pas subordonné. Devenu pirate sur le tard, avec derrière lui une vie apparemment confortable, comme si Bellamy l'avait un jour convaincu qu'une vie d'aventures était la seule digne d'être vécue, et que l'argument avait suffi.

En présence de Bellamy, il disparaît dans son ombre — ce qui n'est pas le propre d'un homme faible, mais d'un homme qui n'a aucune ambition de premier rôle et n'en ressent pas le besoin. Les PJ l'ont à peine remarqué lors de leurs interactions — ce qui est à peu près l'effet qu'il produit sur tout le monde. Toujours affable et courtois dans le peu qu'ils ont échangé.`
  },
  {
    id: "vane",
    nom: "Charles Vane",
    alias: null,
    statut: "actif",
    naissance: "vers 1685",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/vane.jpg",
    bio: `Pilote d'Henry Jennings — navigateur réputé talentueux, ce qui explique seul qu'il occupe ce poste. Toujours en retrait, dans l'ombre de Jennings dont il n'a aucune raison de disputer l'espace.

Pendant le massacre des prisonniers après la Marianne, il regardait avec un demi-sourire amusé — pas de répugnance, pas de retenue. L'air de quelqu'un qui reconnaît une méthode qu'il connaît bien et n'a pas besoin de valider. Son amusement était probablement moins dirigé vers les excès de Jennings que vers deux cents hommes réputés redoutables, incapables de se dresser contre un seul individu.`
  },
  {
    id: "rackham",
    nom: "John Rackham",
    alias: "Calico Jack, Rackham le Rouge",
    statut: "actif",
    naissance: "vers 1682",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/rackham.jpg",
    bio: `Quartier-maître d'Henry Jennings — interlocuteur obligé de quiconque souhaite communiquer avec lui. Lien entre Jennings et son équipage, probablement garant de la cohésion d'un groupe qu'on ne peut pas diriger éternellement par la seule terreur. Ses relations avec les PJ, quoique limitées, ont toujours été cordiales.

Pendant le massacre des prisonniers après la Marianne, il était visiblement mal à l'aise — désapprobation lisible, trahie par la posture et le regard, tout en ayant le devoir de justifier les actes de son capitaine.

Le surnom "Calico Jack" lui vient de son goût immodéré pour les étoffes précieuses venues d'Orient — lui conférant une allure éminemment reconnaissable au sein d'un équipage de pirates.`
  },
  {
    id: "ruggiero",
    nom: "Ruggiero della Scala",
    alias: "Scarpa (alias utilisé en fuite)",
    statut: "actif",
    naissance: "vers 1640",
    origine: "Italien",
    tags: ["Trinidad", "Caraïbes", "Antonio"],
    portrait: "pnj/portraits/ruggiero.jpg",
    bio: `Vieux maître d'armes italien. Ancien précepteur d'Antonio à Trinidad : un alcoolique de génie, payé en gîte, couvert et tafia, qui était véritablement brillant quand il parvenait à rester sobre. A transmis à Antonio un style d'escrime unique, mélange de techniques italiennes et de fougue espagnole.
`
  },
  {
    id: "sloane",
    nom: "Hans Sloane",
    alias: null,
    statut: "actif",
    naissance: "1660",
    origine: "Irlandais (installé en Angleterre)",
    tags: ["Europe", "Fanch", "Edward"],
    portrait: "pnj/portraits/sloane.jpg",
    bio: `Médecin naturaliste, secrétaire de la Royal Society. Professeur de Fañch au Royal College of Physicians de Londres — une influence décisive dans sa formation, transmettant autant une philosophie qu'un savoir : voir dans chaque spécimen végétal une potentielle source de guérison.

C'est également lui qui a remis à Edward Sutherland sa lettre de mission — rédigée en urgence, encore non signée par le Président, avant de l'envoyer obtenir lui-même le précieux visa.`
  },
  {
    id: "newton",
    nom: "Isaac Newton",
    alias: null,
    statut: "actif",
    naissance: "1643",
    origine: "Anglais",
    tags: ["Europe", "Edward"],
    portrait: "pnj/portraits/newton.jpg",
    bio: `Président de la Royal Society (1703–1727). A signé la lettre de mission d'Edward Sutherland lors d'une rencontre improvisée dans son jardin — où il l'avait contraint à planter des pommiers pendant qu'il l'écoutait. La lettre vaut passe-droit auprès des gouverneurs coloniaux.`
  },
  {
    id: "woodall",
    nom: "Nicholas Woodall",
    alias: null,
    statut: "actif",
    naissance: "1682",
    origine: "Anglais",
    tags: ["Nassau", "Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/woodall.jpg",
    bio: `Pirate et contrebandier anglais, capitaine du Wolf (sloop de 30 tonneaux). Rencontré au large de Cap-Français quelques jours avant le banquet.`
  },
  {
    id: "elliot",
    nom: "Thomas Elliot",
    alias: null,
    statut: "actif",
    naissance: "1686",
    origine: "Anglais",
    tags: ["Trinidad", "Caraïbes", "Antonio"],
    portrait: "pnj/portraits/elliot.jpg",
    bio: `Contrebandier anglais, contact d'Antonio depuis Trinidad. C'est probablement lui qui a fourni à Bellamy les informations permettant l'interception du Santa Laura de Córdoba et la libération d'Antonio.`
  },
  {
    id: "wandesford",
    nom: "Thurston Wandesford",
    alias: null,
    statut: "actif",
    naissance: "1684",
    origine: "Anglais (Irlande)",
    tags: ["Europe", "Robert", "Fanch"],
    portrait: "pnj/portraits/wandesford.jpg",
    bio: `Fils cadet de Christopher Wandesford, 1er Vicomte Castlecomer (1656-1707). Son père a reçu la baronnie de Clonakilty (demeure ancestrale des Arundel) en récompense de son soutien à la répression de la révolution jacobite irlandaise après la bataille de la Boyne. Thurston en a hérité, le Vicomté de Castlecomer allant à son frère aîné Christopher, 2e Vicomte Castlecomer.`
  },
  {
    id: "gaspar",
    nom: "Gaspar de la Serna",
    alias: null,
    statut: "actif",
    naissance: "1688",
    origine: "Espagnol (Trinidad)",
    tags: ["Trinidad", "Caraïbes", "Antonio"],
    portrait: "pnj/portraits/gaspar.jpg",
    bio: `Rival de jeunesse d'Antonio à Trinidad : issu de la famille dont la plantation voisine a prospéré quand celle des Caballero stagnait. A fait emprisonner Antonio après avoir été vaincu en duel, et l’aurait fait pendre si Bellamy n'était intervenu.`
  },
  {
    id: "edward-england",
    nom: "Edward England",
    alias: "Edward Seegar",
    statut: "inconnu",
    naissance: "vers 1685 — vers 1720",
    origine: "Irlandais",
    tags: ["Nassau", "The Pirate Round", "La Marianne"],
    portrait: "pnj/portraits/england.jpg",
    bio: `Pirate irlandais de son vrai nom Edward Seegar. Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Révolté par ce qu'il a vu, a quitté les Caraïbes pour l'océan Indien. Connu pour sa clémence envers les vaincus — l'exact opposé de Jennings.`
  },
  {
    id: "silver",
    nom: "John Silver",
    alias: "Long John Silver, Barbecue",
    statut: "inconnu",
    naissance: "1685",
    origine: "Anglais (Bristol)",
    tags: ["Nassau", "The Pirate Round", "La Marianne"],
    portrait: "pnj/portraits/silver.jpg",
    bio: `Quartier-Maître d’Edward England. Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Observait la scène avec une fascination froide, sans intervenir.`
  },
  // PNJ Île des Ombres
  {
    id: "hobbs",
    nom: "Nathaniel Hobbs",
    alias: null,
    statut: "mort",
    naissance: "1671",
    origine: "Anglais",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/hobbs.jpg",
    bio: `Maître charpentier du Téméraire. Massif, barbe grise, jambe droite brisée, le visage creusé de cicatrices. Bourru dans la forme, loyal dans les actes — a guidé l'équipage dans la réparation du sloop après le naufrage. Mort durant les événements de l'île.`
  },
  {
    id: "alarcon",
    nom: "Don Francisco de Alarcon",
    alias: null,
    statut: "mort",
    naissance: "1682 - 1714",
    origine: "Espagnol",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/alarcon.jpg",
    bio: `Grand, élancé, une cicatrice sur la joue gauche et un regard d'acier. Cousin de Don Gaspar de la Serna, vaincu en duel par Antonio à Trinidad — une rancœur ancienne qu'il n'a pas cherché à dissimuler. Obstiné jusqu'à l'absurde : a refusé d'évacuer l'île avec les forces espagnoles. Dévoré par les Indiens Bravos.`
  },
  {
    id: "velazquez",
    nom: "Commandant Diego Velazquez",
    alias: null,
    statut: "inconnu",
    naissance: "1677",
    origine: "Espagnol",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/velazquez.jpg",
    bio: `Élégant, mince, l'allure aristocratique. Superstitieux malgré son éducation, ambitieux mais pas téméraire. A choisi de quitter l'île avec ses troupes plutôt que de partager l'obstination fatale de Don Francisco.`
  },
  // PNJ SED
  {
    id: "lefevre",
    nom: "Guillaume Lefèvre",
    alias: null,
    statut: "actif",
    naissance: "vers 1691",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/lefevre.jpg",
    bio: `Chef cuisinier français, rescapé de naufrage. A supervisé le grand banquet de Cap-Français avec la rigueur d’un professionnel et la générosité d’un rescapé. A offert son livre de recettes à Amédée en souvenir.`
  },
  {
    id: "blackwood",
    nom: "Lord Blackwood",
    alias: null,
    statut: "inconnu",
    naissance: "1677",
    origine: "Anglais",
    tags: ["Saint-Domingue", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/blackwood.jpg",
    bio: `Agent britannique infiltré dans la délégation du banquet de Cap-Français. A recruté Antonio et Robert comme gardes du corps pour les compromettre. Responsable de l'empoisonnement de la délégation espagnole. Interpellé par le Gouverneur Blénac alors qu'il quittait Cap-Français, les faux documents de Rochambeau trouvés sur lui l'ont confondu. Sort inconnu depuis.`
  },
  {
    id: "rochambeau",
    nom: "Chevalier de Rochambeau",
    alias: null,
    statut: "actif",
    naissance: "1675",
    origine: "Français",
    tags: ["Saint-Domingue", "Europe", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/rochambeau.jpg",
    bio: `Diplomate français aguerri, opposé au traité de libre-échange au Banquet du Cap-Français. Avait préparé ses propres manœuvres pour saboter les négociations — substitution de faux documents, avec des clauses inacceptables. A renoncé après la révélation du complot de Blackwood, qui a rendu toute manœuvre supplémentaire superflue.`
  },
  {
    id: "blenac",
    nom: "Louis de Courbon, comte de Blénac",
    alias: null,
    statut: "actif",
    naissance: "1644",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/blenac.jpg",
    bio: `Gouverneur de Saint-Domingue au moment du banquet de Cap-Français. Administrateur perspicace, favorable au traité. C'est sur la foi d'Antonio qu'il a fait intercepter Blackwood — et c'est lui qui a libéré Robert et Antonio avec une injonction sans équivoque : ne plus paraître à Cap-Français. Ton pragmatique plutôt que vengeur.`
  },
  {
    id: "morelet",
    nom: "Père Morelet d'Aboville",
    alias: null,
    statut: "actif",
    naissance: "vers 1651",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/daboville.jpg",
    bio: `Vicaire général, chef de la communauté jésuite à Saint-Domingue. Hôte du banquet dans les jardins du couvent. Présence bienveillante, discrète et attentive.`
  },
  {
    id: "vandergroot",
    nom: "Johannes Van der Groot",
    alias: null,
    statut: "actif",
    naissance: "1655",
    origine: "Hollandais",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/vandergroot.jpg",
    bio: `Marchand hollandais représentant la WIC, passionné de botanique et de cartographie, dont la serre et la bibliothèque ont fait la joie de Fañch et d’Edward. A servi d'intermédiaire pour mettre les PJ en contact avec Blackwood.`
  },
  {
    id: "montblanc",
    nom: "Monsieur de Montblanc",
    alias: null,
    statut: "actif",
    naissance: "1672",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/montblanc.jpg",
    bio: `Riche planteur français. Redevable envers les PJ pour un service rendu concernant sa plantation. Présent au banquet de Cap-Français.`
  },
  // PNJ Épaves
  {
    id: "diego",
    nom: "Diego",
    alias: null,
    statut: "actif",
    naissance: "1699",
    origine: "Espagnol (Trinidad)",
    tags: ["Trinidad", "Caraïbes", "Les épaves de la Flotte au Trésor", "Antonio"],
    portrait: "pnj/portraits/diego.jpg",
    bio: `Jeune soldat de conscription espagnol, originaire de Trinidad. A reconnu Antonio parmi les pirates lors des Épaves de la Flotte au Trésor. C'est lui qui a appris à Antonio que la plantation Caballero avait périclité. Sauvé par les PJ, il les a accompagné à Nassau.`
  },
  {
    id: "kabo",
    nom: "Kabo",
    alias: null,
    statut: "actif",
    naissance: "vers 1700",
    origine: "Mosquito (Nicaragua)",
    tags: ["Caraïbes", "Les épaves de la Flotte au Trésor", "Dusmatis"],
    portrait: "pnj/portraits/kabo.jpg",
    bio: `Plongeur Mosquito, originaire du rivage nicaraguayen. A été recruté parmi les esclaves libérés lors du pillage des épaves de la Flotte au Trésor.`
  },
  // Factions
  {
    id: "flying-gang",
    visible: false,
    nom: "Flying Gang / Conseil de Nassau",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Nassau (Bahamas)",
    tags: ["Nassau", "Caraïbes", "Flying Gang"],
    portrait: "pnj/portraits/nassau.jpg",
    bio: `La République Pirate de Nassau, fondée par Hornigold et ses pairs. Cinq magistrats élus en janvier 1716 à l'issue des affaires de la Flotte au Trésor : Hornigold, Teach, Jennings, Cockram, Burgess. Structure fragile, personnelle, sans constitution écrite — elle tient par les hommes qui la composent autant que par les principes qu'elle défend.`
  },
  {
    id: "equipage-johnson",
    visible: false,
    nom: "L'Équipage du Capitaine Charles Johnson",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Britannique",
    tags: ["Europe", "Robert"],
    portrait: "pnj/portraits/mist.jpg",
    bio: `Réseau de correspondants qui documente les événements et personnages extraordinaires des Indes Occidentales pour un commanditaire londonien. Robert Arundel en est le correspondant de terrain — approché avant son départ pour les Caraïbes par un certain Nathaniel Mist, qui se présentait comme "membre de l'équipage du Capitaine Charles Johnson".`
  }
];
