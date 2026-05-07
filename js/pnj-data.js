// Registre des PNJ — Pavillon Noir
// Généré depuis le registre de campagne
// Mise à jour : avril 2026

const PNJ_DATA = [
  {
    id: "bellamy",
    epingle: true,
    nom: "Samuel « Black Sam » Bellamy",
    accroche: "Prince des Pirates",
    alias: "Black Sam, le Prince des Pirates, Robin des mers",
    statut: "actif",
    naissance: "1689",
    origine: "Anglais (Cape Cod)",
    tags: ["Nassau", "Caraïbes", "Flying Gang", "L'Île des Ombres", "La Marianne", "Les épaves de la Flotte au Trésor", "Antonio"],
    portrait: "pnj/portraits/bellamy.jpg",
    pavillon: "pnj/pavillons/bellamy.svg",
    bio: `Sauveur d’Antonio, interceptant le navire qui le conduisait à la potence. Sauveur à nouveau d’Antonio, Fañch et Dusmãtis, alors qu’ils dérivaient en mer sur une épave non loin de Nassau. Son charisme surnaturel lui permet de discuter d’égal à égal avec les plus humbles comme les plus puissant, et lui assure la loyauté de tous.
    
    A volé la Sainte-Marie à Jennings sans que cela ne l’empêche de s’associer à nouveau avec lui quelques semaines plus tard pour piller les Épaves de la Flotte au Trésor.`
  },
  {
    id: "hornigold",
    epingle: true,
    nom: "Benjamin Hornigold",
    accroche: "Magistrat au Conseil de Nassau<br>Commandant du Ranger",
    alias: null,
    statut: "actif",
    naissance: "vers 1670-80",
    origine: "Anglais (Norfolk)",
    tags: ["Nassau", "Caraïbes", "Conseil de Nassau", "Flying Gang", "L'Île des Ombres", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/hornigold.jpg",
    pavillon: "pnj/pavillons/hornigold.svg",
    bio: `Fondateur de la République Pirate de Nassau et du Flying Gang. Il y a chez lui quelque chose de l'ancien officier de la Royal Navy qu'il n'a jamais tout à fait quitté : la discipline, la tenue, l'autorité sans éclat. Il commande par l'exemple, sans crier. On le suit parce qu'il dégage la certitude d'être à sa place.
    
    A pris la Marianne (frégate française, 32 canons) au nez et à la barbe de Jennings — épisode fondateur de leur animosité durable. Magistrat du Conseil de Nassau.
    
    Portrait : allure aristocratique, larges favoris grisonnants, longue redingote sobre. Ne porte jamais de tricorne.`
  },
  {
    id: "jennings",
    epingle: true,
    nom: "Henry Jennings",
    accroche: "Magistrat au Conseil de Nassau<br>Commandant du Bersheeba",
    alias: null,
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais (Bermudes)",
    tags: ["Nassau", "Caraïbes", "Jamaïque", "Kingston", "Conseil de Nassau", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/jennings.jpg",
    pavillon: "pnj/pavillons/jennings.svg",
    bio: `Corsaire devenu pirate, commissionné par le gouverneur de Jamaïque. Figure mafieuse plus qu'aventurière : n'intervient que lorsque le rapport de force est écrasant en sa faveur. C'est lui qui a ordonné le massacre de prisonniers sur la plage après la prise de la Marianne (décembre 1715).
    
    Il ne s'adresse pratiquement jamais directement à ses hommes — Rackham sert d'interface. Les aventuriers ont existé dans sa mémoire comme le menu fretin de l'équipage de Bellamy : à peine remarqués, vite oubliés. Élu magistrat au Conseil de Nassau.
    
    Portrait : taille moyenne, bloc massif, cheveux très courts, yeux bleu pâle presque translucides qui ne clignent pas. Ne hausse jamais la voix — chaque mot semble extrait d'une violence contenue.`
  },
  {
    id: "teach",
    epingle: true,
    nom: "Edward Teach",
    accroche: "Magistrat au Conseil de Nassau<br>Second de Horniglod",
    alias: "Barbe-Noire",
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Conseil de Nassau", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/teach.jpg",
    pavillon: "pnj/pavillons/hornigold.svg",
    bio: `Second et Quartier-Maître d'Hornigold lors des Épaves et de la Marianne. D’une discipline et d’une loyauté exemplaires pour exécuter les ordres de son Capitaine, son courage et sa fougue au combat lui valent le respect et l’admiration de ses hommes.
    
    Scandalisé par le massacre ordonné par Jennings après la Marianne. Élu magistrat au Conseil de Nassau et membre fondateur du Flying Gang, il doit néanmoins composer avec lui.
    
    Portrait : la barbe noire est réelle, et son effet soigné. C'est un colosse : stature imposante, présence physique immédiate.`
  },
    {
    id: "levasseur",
    epingle: false,
    nom: "La Buse",
    accroche: "Jeune capitaine intrépide",
    alias: "Olivier Levasseur",
    statut: "actif",
    naissance: "1695",
    origine: "Français (Calais)",
    tags: ["Nassau", "Caraïbes", "Flying Gang", "Satiété engendre Démesure", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/levasseur.jpg",
    pavillon: "pnj/pavillons/levasseur.svg",
    bio: `Pirate français, capitaine du brick le Portillon. Son surnom vient de la rapidité avec laquelle il fond sur ses proies. S’il a participé à la guerre de Succession d’Espagne, il n’avait alors qu’une quinzaine d’années — il est donc l’un des plus jeunes capitaines pirates de sa génération`
  },
  {
    id: "williams",
    nom: "Paulsgrave Williams",
    accroche: "Associé de Bellamy",
    alias: null,
    statut: "actif",
    naissance: "vers 1675",
    origine: "Anglais (Newport, Rhode Island)",
    tags: ["Nassau", "Caraïbes", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/paulsgrave.jpg",
    pavillon: "pnj/pavillons/bellamy.svg",
    bio: `Associé de Bellamy — compagnon d'armes, pas subordonné. Devenu pirate sur le tard, avec derrière lui une vie apparemment confortable, comme si Bellamy l'avait un jour convaincu qu'une vie d'aventures était la seule digne d'être vécue, et que l'argument avait suffi.
    
    En présence de Bellamy, il disparaît dans son ombre — ce qui n'est pas le propre d'un homme faible, mais d'un homme qui n'a aucune ambition de premier rôle et n'en ressent pas le besoin. Les aventuriers l'ont à peine remarqué lors de leurs interactions — ce qui est à peu près l'effet qu'il produit sur tout le monde. Toujours affable et courtois dans le peu qu'ils ont échangé.`
  },
  {
    id: "vane",
    nom: "Charles Vane",
    accroche: "Pilote de Jennings",
    alias: null,
    statut: "actif",
    naissance: "vers 1685",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Jamaïque", "Kingston", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/vane.jpg",
    pavillon: "pnj/pavillons/jennings.svg",
    bio: `Navigateur réputé talentueux, ne serait-ce que parce que Jennings lui a confié son poste. Toujours en retrait, dans l'ombre de Jennings dont il n'a aucune raison de disputer l'espace.

    Pendant le massacre des prisonniers après la Marianne, il regardait avec un demi-sourire amusé — pas de répugnance, pas de retenue. L'air de quelqu'un qui reconnaît une méthode qu'il connaît bien et n'a pas besoin de valider. Son amusement était probablement moins dirigé vers les excès de Jennings que vers deux cents hommes réputés redoutables, incapables de se dresser contre un seul individu.`
  },
  {
    id: "rackham",
    nom: "John « Calico Jack » Rackham",
    accroche: "Quartier-maître de Jennings",
    alias: "Calico Jack, Rackham le Rouge",
    statut: "actif",
    naissance: "vers 1682",
    origine: "Anglais",
    tags: ["Nassau", "Caraïbes", "Jamaïque", "Kingston", "Flying Gang", "La Marianne", "Les épaves de la Flotte au Trésor"],
    portrait: "pnj/portraits/rackham.jpg",
    pavillon: "pnj/pavillons/jennings.svg",
    bio: `Quartier-maître d'Henry Jennings — interlocuteur obligé de quiconque souhaite communiquer avec lui. Lien entre Jennings et son équipage, probablement garant de la cohésion d'un groupe qu'on ne peut pas diriger éternellement par la seule terreur. Ses relations avec les aventuriers, quoique limitées, ont toujours été cordiales.

    Pendant le massacre des prisonniers après la Marianne, il était visiblement mal à l'aise — désapprobation lisible, trahie par la posture et le regard, tout en ayant le devoir de justifier les actes de son capitaine.

    Le surnom "Calico Jack" lui vient de son goût immodéré pour les étoffes précieuses venues d'Orient — lui conférant une allure éminemment reconnaissable au sein d'un équipage de pirates.`
  },
  {
    id: "ruggiero",
    nom: "Ruggiero della Scala",
    accroche: "Maître d'armes chevronné",
    alias: null,
    statut: "inconnu",
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
    accroche: "Médecin, naturaliste et collectionneur<br>Secrétaire de la Royal Society of Science",
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
    accroche: "Mathématicien, physicien, philosophe, alchimiste<br>Président de la Royal Society of Science",
    alias: null,
    statut: "actif",
    naissance: "1643",
    origine: "Anglais (Lincolnshire)",
    tags: ["Europe", "Edward"],
    portrait: "pnj/portraits/newton.jpg",
    bio: `Président de la Royal Society (1703–1727). A signé la lettre de mission d'Edward Sutherland lors d'une rencontre improvisée dans son jardin — où il l'avait contraint à planter des pommiers pendant qu'il l'écoutait. La lettre vaut passe-droit auprès des gouverneurs coloniaux.`
  },
  {
    id: "woodall",
    nom: "Nicholas Woodall",
    accroche: "Contrebandier notoire",
    alias: null,
    statut: "actif",
    naissance: "1682",
    origine: "Anglais",
    tags: ["Nassau", "Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/woodall.jpg",
    bio: `Pirate et contrebandier anglais, Commandant du Wolf (sloop de 30 tonneaux). Rencontré au large de Cap-Français quelques jours avant le banquet.`
  },
  {
    id: "elliot",
    nom: "Thomas Elliot",
    accroche: "Contrebandier mineur",
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
    accroche: "Baron de Clonakilty",
    alias: null,
    statut: "actif",
    naissance: "1684",
    origine: "Anglais (installé en Irlande)",
    tags: ["Europe", "Robert", "Fanch"],
    portrait: "pnj/portraits/wandesford.jpg",
    bio: `Fils cadet de Christopher Wandesford, 1er Vicomte Castlecomer (1656-1707). Son père a reçu la baronnie de Clonakilty (demeure ancestrale des Arundel) en récompense de son soutien à la répression de la révolution jacobite irlandaise après la bataille de la Boyne. Thurston en a hérité, le Vicomté de Castlecomer allant à son frère aîné Christopher, 2e Vicomte Castlecomer.`
  },
  {
    id: "gaspar",
    nom: "Gaspar de la Serna",
    accroche: "Planteur de cacao",
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
    accroche: "Commandant du Fancy",
    alias: "Edward Seegar",
    statut: "inconnu",
    naissance: "vers 1685 — vers 1720",
    origine: "Irlandais",
    tags: ["Nassau", "The Pirate Round", "La Marianne"],
    portrait: "pnj/portraits/england.jpg",    
    pavillon: "pnj/pavillons/generic.svg",
    bio: `Pirate irlandais de son vrai nom Edward Seegar. Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Révolté par ce qu'il a vu, a quitté les Caraïbes pour l'océan Indien. Connu pour sa clémence envers les vaincus — l'exact opposé de Jennings.`
  },
  {
    id: "silver",
    nom: "Long John Silver",
    accroche: "Quartier-maître d'Edward England",
    alias: "Long John Silver, Barbecue",
    statut: "inconnu",
    naissance: "1685",
    origine: "Anglais (Bristol)",
    tags: ["Nassau", "The Pirate Round", "La Marianne"],
    portrait: "pnj/portraits/silver.jpg",
    pavillon: "pnj/pavillons/generic.svg",
    bio: `Quartier-Maître d’Edward England. Présent lors du massacre ordonné par Jennings après la prise de la Marianne (décembre 1715). Observait la scène avec une fascination froide, sans intervenir.`
  },

  {
    id: "mist",
    visible: true,
    nom: "Nathaniel Mist",
    accroche: "Journaliste politique<br>Membre de l'équipage du Capitaine Charles Johnson",
    alias: null,
    statut: "actif",
    naissance: 1685,
    origine: "Anglais (Londres)",
    tags: ["Europe", "Robert", "Équipage du Captain Charles Johnson"],
    portrait: "pnj/portraits/mist.jpg",
    bio: `Journaliste et imprimeur londonien, jacobite actif, pas encore connu du grand public — il n'a pas encore lancé le journal qui fera sa réputation. C'est un homme de réseau avant d'être un homme de presse. Il a approché Robert peu avant son départ pour les Indes Occidentales et l'a mandaté comme correspondant de terrain pour l'équipage du Capitaine Charles Johnson, en échange d'une rémunération par compte rendu livré.`
  },

  {
    id: "morgan",
    visible: false,
    nom: "Henry Morgan",
    accroche: "Roi de la Flibuste devenu Gouverneur de la Jamaïque",
    alias: "Sir Henry Morgan, Hari Morgan",
    statut: "mort",
    naissance: "vers 1635 — 25 août 1688",
    origine: "Gallois (Monmouthshire)",
    tags: ["Caraïbes", "Jamaïque"],
    portrait: null,
    bio: `Flibustier gallois devenu planteur et Lieutenant-Gouverneur de Jamaïque. Auteur du sac de Panama en 1671. Mort le 25 août 1688. Sa pierre tombale a été engloutie lors du séisme de Port-Royal en 1692. Figure légendaire des Caraïbes.`
  },
  {
    id: "avery",
    visible: false,
    nom: "Henry Avery",
    accroche: "Le Roi des pirates",
    alias: "Henry Every, Black Ben, Benjamin Stonebridge",
    statut: "inconnu",
    naissance: "vers 1659 — après 1696",
    origine: "Anglais (Devon)",
    tags: ["Caraïbes", "The Pirate Round"],
    portrait: null,
    pavillon: "pnj/pavillons/avery_red.svg",
    bio: `Pirate légendaire disparu après 1696. A capturé le Gang-i-Sawai du Grand Moghol en 1695, coup le plus spectaculaire de l'âge d'or de la piraterie. Sa trace se perd après. Certains disent mort, d'autres caché.`
  },
   {
    id: "halley",
    visible: false,
    nom: "Edmund Halley",
    accroche: "Astronome, scientifique, ingénieur, océanologue<br>Membre de la Royal Society of Science",
    alias: null,
    statut: "actif",
    naissance: "1656",
    origine: "Anglais",
    tags: ["Europe"],
    portrait: null,
    bio: `Astronome de réputation européenne. A découvert la comète qui porte son nom. Correspondant savant de nombreux personnages illustres de son époque.`
  },
   {
    id: "anne-dieu-le-veut",
    visible: false,
    nom: "Anne Dieu-le-veut",
    alias: "Marie Dieuleveult",
    statut: "mort",
    naissance: "1661 — 11 janvier 1710",
    origine: "Française (Gourin)",
    tags: ["Caraïbes", "Saint-Domingue"],
    portrait: null,
    bio: `Née Marie Dieuleveult à Gourin, Morbihan. Trois mariages successifs, dont Laurens de Graaf dit Lorencillo qu'elle est allée trouver pistolet à la main. A accompagné son mari en mer — l'équipage la considérait comme un porte-bonheur. Capturée avec ses enfants par les Anglais en 1695, libérée en 1698. Morte le 11 janvier 1710 au Cap-Français. Mère de Catherine de Graaf.`
  },
   {
    id: "catherine-de-graaf",
    visible: true,
    nom: "Catherine de Graaf",
    accroche: "Riche planteuse de canne à sucre",
    alias: null,
    statut: "actif",
    naissance: "mai 1694 — 1762",
    origine: "Française (Saint-Domingue)",
    tags: ["Caraïbes", "Saint-Domingue", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/catherine.jpg",
    bio: `Née au Cap-Français en mai 1694 de Laurens de Graaf et d'Anne Dieu-le-veut. Son père meurt en 1704, laissant une fortune estimée à 190 000 livres : une sucrerie au quartier Morin avec cinq chaudières et plus de 120 esclaves. Sa mère administre activement ce patrimoine jusqu'à sa mort en janvier 1710. Catherine hérite d'une fortune constituée et opérationnelle à 16 ans. A depuis refusé une tutelle, échappé à une lettre de cachet, défié un homme en duel et affranchi tous ses esclaves. Rencontrée lors du banquet de Cap-Français (janvier 1714).`
  },
   {
    id: "conti",
    visible: false,
    nom: "Père Ubaldo Conti",
    alias: null,
    statut: "actif",
    naissance: "vers 1665",
    origine: "Italien",
    tags: ["Caraïbes"],
    portrait: null,
    bio: `Se présente comme vicaire apostolique aux Caraïbes. Entré en scène à La Tortue après la mort de Ruggiero della Scala. Tout de noir vêtu sauf un large col de dentelles blanches — l'apparence d'un spadassin bien plus que d'un ecclésiastique. Petit, cheveux poivre et sel, fine moustache, accent italien marqué, porte une rapière.`
  },
   {
    id: "sanna",
    visible: false,
    nom: "Mystérieux assassin",
    alias: null,
    statut: "inconnu",
    naissance: null,
    origine: "Italien (présumé)",
    tags: ["Caraïbes", "Antonio"],
    portrait: null,
    bio: `Tueur non identifié. Responsable de la mort de Ruggiero della Scala à La Tortue. Description physique : homme de taille moyenne, cheveux courts poivre et sel, fine moustache, accent italien, porte une rapière. Disparu après les faits.`
  },
 
  {
    id: "bortodano",
    visible: false,
    nom: "Alfonso Bortodano",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Espagnol",
    tags: ["Caraïbes"],
    portrait: null,
    bio: `Gouverneur espagnol de Porto Rico (1716–1720). A mis un vaisseau de guerre et ses hommes à disposition pour une opération dans les Caraïbes.`
  },
 
  {
    id: "thorn",
    visible: false,
    nom: "Edmund Thorn",
    alias: null,
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais",
    tags: ["Jamaïque", "Kingston"],
    portrait: null,
    bio: `Officier anglais stationné en Jamaïque. Aide de camp du gouverneur et Deputy Naval Officer à Kingston. Froid, patibulaire, sans charme social. Porte à Portobelo un sabre de belle facture qui attire l'œil.`
  },
 
  {
    id: "mascarano",
    visible: false,
    nom: "Simon Mascarano",
    alias: null,
    statut: "actif",
    naissance: "vers 1680 — après 1721",
    origine: "Portugais",
    tags: ["Caraïbes"],
    portrait: null,
    bio: `Pirate portugais, corsaire au service de l'Espagne. Actif dans les Caraïbes de 1701 à 1721. Équipage de toutes nations et couleurs. Qualifié de "notable scélérat" par la Royal Navy.`
  },
 
  {
    id: "harrington",
    visible: false,
    nom: "James Harrington",
    alias: null,
    statut: "inconnu",
    naissance: null,
    origine: "Anglais",
    tags: ["Jamaïque"],
    portrait: null,
    bio: `Tailleur de pierre anglais. A réalisé le mausolée de Henry Morgan à Port-Royal selon des spécifications inhabituelles et très précises. A laissé des carnets détaillant son travail.`
  },
 
  {
    id: "barbot-de-villeneuve",
    visible: false,
    nom: "Gabrielle-Suzanne Barbot de Villeneuve",
    alias: null,
    statut: "actif",
    naissance: "1685 — 1755",
    origine: "Française (La Rochelle)",
    tags: ["Caraïbes"],
    portrait: null,
    bio: `Romancière française, en transit vers les colonies en 1718. Prise en otage lors du blocus de Charleston par Barbe-Noire. Femme de tempérament, observatrice attentive.`
  },
  // PNJ Île des Ombres
  {
    id: "hobbs",
    nom: "Nathaniel Hobbs",
    accroche: "Maître-charpentier du Téméraire",
    alias: null,
    statut: "mort",
    naissance: "1671",
    origine: "Anglais",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/hobbs.jpg",
    pavillon: "pnj/pavillons/generic.svg",
    bio: `Maître charpentier du Téméraire. Massif, barbe grise, jambe droite brisée, le visage creusé de cicatrices. Bourru dans la forme, loyal dans les actes — a guidé l'équipage dans la réparation du sloop après le naufrage. Mort durant les événements de l'île.`
  },
  {
    id: "alarcon",
    nom: "Don Francisco de Alarcon",
    accroche: "Capitaine de l'Infantería de Marina",
    alias: null,
    statut: "mort",
    naissance: "1682 - 1714",
    origine: "Espagnol",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/alarcon.jpg",
    pavillon: "pnj/pavillons/es.svg",
    bio: `Grand, élancé, une cicatrice sur la joue gauche et un regard d'acier. Cousin de Don Gaspar de la Serna, vaincu en duel par Antonio à Trinidad — une rancœur ancienne qu'il n'a pas cherché à dissimuler. Obstiné jusqu'à l'absurde : a refusé d'évacuer l'île avec les forces espagnoles. Dévoré par les Indiens Bravos.`
  },
  {
    id: "velazquez",
    nom: "Commandant Velazquez",
    accroche: "Capitaine de frégate de la Real Armada",
    alias: null,
    statut: "inconnu",
    naissance: "1677",
    origine: "Espagnol",
    tags: ["L'Île des Ombres"],
    portrait: "pnj/portraits/velazquez.jpg",
    pavillon: "pnj/pavillons/es.svg",
    bio: `Élégant, mince, l'allure aristocratique. Superstitieux malgré son éducation, ambitieux mais pas téméraire. A choisi de quitter l'île avec ses troupes plutôt que de partager l'obstination fatale de Don Francisco.`
  },
  // PNJ SED
  {
    id: "lefevre",
    nom: "Guillaume Lefèvre",
    accroche: "Maître-queux",
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
    accroche: "Diplomate radical",
    alias: null,
    statut: "inconnu",
    naissance: "1677",
    origine: "Anglais",
    tags: ["Saint-Domingue", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/blackwood.jpg",
    pavillon: "pnj/pavillons/gb.svg",
    bio: `Agent britannique infiltré dans la délégation du banquet de Cap-Français. A recruté Antonio et Robert comme gardes du corps pour les compromettre. Responsable de l'empoisonnement de la délégation espagnole. Interpellé par le Gouverneur Blénac alors qu'il quittait Cap-Français, les faux documents de Rochambeau trouvés sur lui l'ont confondu. Sort inconnu depuis.`
  },
  {
    id: "rochambeau",
    nom: "Chevalier de Rochambeau",
    accroche: "Diplomate retors",
    alias: null,
    statut: "actif",
    naissance: "1675",
    origine: "Français",
    tags: ["Saint-Domingue", "Europe", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/rochambeau.jpg",
    pavillon: "pnj/pavillons/fr_banniere.svg",
    bio: `Diplomate français aguerri, opposé au traité de libre-échange au Banquet du Cap-Français. Avait préparé ses propres manœuvres pour saboter les négociations — substitution de faux documents, avec des clauses inacceptables. A renoncé après la révélation du complot de Blackwood, qui a rendu toute manœuvre supplémentaire superflue.`
  },
  {
    id: "blenac",
    nom: "Louis de Courbon, comte de Blénac",
    accroche: "Gouverneur de Saint-Domingue",
    alias: null,
    statut: "actif",
    naissance: "1644",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/blenac.jpg",
    pavillon: "pnj/pavillons/fr_banniere.svg",
    bio: `Gouverneur de Saint-Domingue au moment du banquet de Cap-Français. Administrateur perspicace, favorable au traité. C'est sur la foi d'Antonio qu'il a fait intercepter Blackwood — et c'est lui qui a libéré Robert et Antonio avec une injonction sans équivoque : ne plus paraître à Cap-Français. Ton pragmatique plutôt que vengeur.`
  },
  {
    id: "morelet",
    nom: "Père Morelet d'Aboville",
    accroche: "Vicaire général de la Compagnie de Jésus",
    alias: null,
    statut: "actif",
    naissance: "vers 1651",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/daboville.jpg",
    bio: `Chef de la communauté jésuite à Saint-Domingue. Hôte du banquet dans les jardins du couvent. Présence bienveillante, discrète et attentive.`
  },
  {
    id: "vandergroot",
    nom: "Johannes Van der Groot",
    accroche: "Négociant à la retraite",
    alias: null,
    statut: "actif",
    naissance: "1655",
    origine: "Hollandais",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/vandergroot.jpg",
    bio: `Ancien marchand hollandais représentant la WIC, passionné de botanique et de cartographie, dont la serre et la bibliothèque ont fait la joie de Fañch et d’Edward. A servi d'intermédiaire pour mettre les aventuriers en contact avec Blackwood.`
  },
  {
    id: "montblanc",
    nom: "Monsieur de Montblanc",
    accroche: "Planteur de canne à sucre",
    alias: null,
    statut: "actif",
    naissance: "1672",
    origine: "Français",
    tags: ["Saint-Domingue", "Caraïbes", "Satiété engendre Démesure"],
    portrait: "pnj/portraits/montblanc.jpg",
    bio: `Riche planteur français. Redevable envers les aventuriers pour un service rendu concernant sa plantation. Présent au banquet de Cap-Français.`
  },
  // PNJ Hippogriffe
  {
    id: "winthorpe",
    nom: "Lawrence Winthorpe",
    accroche: "Commandant du Crocodile",
    alias: null,
    statut: "actif",
    naissance: "vers 1680",
    origine: "Anglais",
    tags: ["Caraïbes", "Le dernier voyage de l'Hippogriffe"],
    portrait: "pnj/portraits/winthorpe.jpg",
    pavillon: "pnj/pavillons/winthorpe.svg",
    bio: `Capitaine anglais au long passé de flibuste, rencontré naufragé sur la côte nord-est de Little Savannah — brigantin et moitié d'équipage perdus sur les récifs lors d'une tornade. Blond, carré, rire tonitruant : donne l'impression d'un homme à l'aise partout, ce qui est exactement le registre qu'il cultive. Excellent commandant : autorité naturelle, charisme réel. Ne fait confiance à personne et n'attend pas qu'on lui fasse confiance.

    Les aventuriers ont mené une expédition en partenariat avec lui — réussie. Ils ont su mettre un terme à l'association avant que les relations ne se gâtent, pressentant que la concorde ne durerait pas. Interdit de séjour à Nassau, il n'est pas impossible pour autant qu'ils ne croisent sa route à nouveau un jour..`
  },

  {
    id: "gazelle-borgne",
    nom: "La Gazelle et Le Borgne",
    accroche: "Bougres de boucaniers",
    alias: null,
    statut: "actif",
    naissance: "vers 1675 (Le Borgne) & vers 1680 (La Gazelle)",
    origine: "Français (Saint-Domingue)",
    tags: ["Caraïbes", "Saint-Domingue", "Le dernier voyage de l'Hippogriffe"],
    portrait:"pnj/portraits/gazelle-borgne.jpg",
    bio: `Deux boucaniers de Saint-Domingue, matelots au sens pirate du terme — associés par contrat autant que par tempérament. Arrivés à Little Savannah après qu'une tempête a détruit leur embarcation alors qu'ils cherchaient de nouveaux territoires de chasse. Projet d'origine : s'enfoncer dans les terres américaines pour chasser le bison.

    La Gazelle est le meneur de fait — le plus féroce des deux. Le Borgne est réputé meilleur tireur du groupe, et sa réputation est méritée. Combattants endurcis au corps à corps tous les deux, novices en matière navale. Nature violente mais franche, peu portés à la duplicité — dans leur code, la camaraderie compte autant que le butin. Loyauté mutuelle totale.

    Recrues de valeur, mais leur trajectoire naturelle les tire vers le continent américain — ils reprendront probablement leur route tôt ou tard.`
  },
  // PNJ Épaves
  {
    id: "diego",
    nom: "Diego",
    accroche: "Conscrit déserteur",
    alias: null,
    statut: "actif",
    naissance: "1699",
    origine: "Espagnol (Trinidad)",
    tags: ["Trinidad", "Caraïbes", "Les épaves de la Flotte au Trésor", "Antonio"],
    portrait: "pnj/portraits/diego.jpg",
    bio: `Jeune soldat de conscription espagnol, originaire de Trinidad. A reconnu Antonio parmi les pirates lors des Épaves de la Flotte au Trésor. C'est lui qui a appris à Antonio que la plantation Caballero avait périclité. Sauvé par les aventuriers, il les a accompagné à Nassau.`
  },
  {
    id: "kabo",
    nom: "Kabo",
    accroche: "Guerrier Miskito",
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
    nom: "Flying Gang",
    accroche: null,
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Nassau (Bahamas)",
    tags: ["Nassau", "Caraïbes", "Flying Gang"],
    portrait: null,
    pavillon: "pnj/pavillons/nassau.svg",
    bio: ``
  },
   {
    id: "conseil-nassau",
    visible: true,
    nom: "Conseil de Nassau",
    accroche: "Instance dirigeante de la République Pirate",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Nassau (Bahamas)",
    tags: ["Nassau", "Caraïbes", "Conseil de Nassau", "Flying Gang"],
    portrait:  "pnj/portraits/conseil-nassau.jpg",
    pavillon: "pnj/pavillons/nassau.svg",
    bio: `La République Pirate de Nassau est fondée par Hornigold et ses pairs. Cinq magistrats élus en janvier 1716 à l'issue des évènements de la Flotte au Trésor : Benjami Hornigold, Edward Teach, Henry Jennings, John Cockram, Josiah Burgess. Structure fragile, personnelle, sans constitution écrite — elle tient par les hommes qui la composent autant que par les principes qu'elle défend.`
  },
  {
    id: "equipage-johnson",
    visible: false,
    nom: "L'équipage du Capitaine Charles Johnson",
    accroche: "Mystérieuse société secrète britannique",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Anglais",
    tags: ["Europe", "Robert", "Équipage du Captain Charles Johnson"],
    portrait: null,
    bio: `Réseau d'entraide ayant exfiltré et mandaté Robert pour documenter les événements et personnages extraordinaires des Indes Occidentales.`
  },

 
  // ── Factions ─────────────────────────────────────────────────
 
  {
    id: "piagnoni",
    visible: false,
    nom: "Les Piagnoni",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Italienne",
    tags: ["Caraïbes", "Europe", "Piagnoni"],
    portrait: null,
    bio: `Secte aux origines et objectifs encore mal cernés. Des agents au profil similaire ont été signalés dans plusieurs ports des Caraïbes. Manifeste une hostilité envers certains objets et documents anciens. Ruggiero della Scala a été tué par l'un d'eux.`
  },
 
  {
    id: "trident",
    visible: false,
    nom: "Le Trident de Neptune",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Caraïbes / Irlande / Espagne",
    tags: ["Caraïbes", "Trident"],
    portrait: null,
    bio: `Réseau de contrebande actif dans l'ensemble des Caraïbes. Absorbe ou élimine les réseaux artisanaux existants. Corrompt systématiquement les fonctionnaires coloniaux de toutes nationalités. Direction inconnue. Nicholas Woodall en est une victime.`
  },
 
  {
    id: "jesuites",
    visible: false,
    nom: "Les Jésuites",
    alias: null,
    statut: "actif",
    naissance: null,
    origine: "Internationale",
    tags: ["Caraïbes", "Europe", "Saint-Domingue"],
    portrait: null,
    bio: `Réseau jésuite aux Caraïbes, visible à travers la présence du Père Morelet d'Aboville à Cap-Français et de personnages gravitant dans son orbite. Étendue et objectifs réels : inconnus.`
  },
 
  // ── Candidats en réserve ─────────────────────────────────────
 
  {
    id: "keroualle",
    visible: false,
    nom: "Louise de Kéroualle, duchesse de Portsmouth",
    alias: null,
    statut: "actif",
    naissance: "1649 — 1734",
    origine: "Bretonne (France)",
    tags: ["Europe", "Robert"],
    portrait: null,
    bio: `Bretonne, ancienne maîtresse officielle de Charles II d'Angleterre, agent d'influence de Louis XIV à la cour anglaise. En 1715, 65 ans, retirée à Aubigny. Femme de mémoire longue qui a survécu à trois règnes.`
  },
 
  {
    id: "frederik-ruysch",
    visible: false,
    nom: "Frederik Ruysch",
    alias: null,
    statut: "actif",
    naissance: "1638 — 1731",
    origine: "Hollandais (Amsterdam)",
    tags: ["Europe", "Fanch"],
    portrait: null,
    bio: `Anatomiste et botaniste hollandais. Créateur du cabinet de curiosités le plus célèbre d'Europe — plus de 2 000 spécimens. A vendu l'intégralité de sa collection à Pierre le Grand en 1717 pour 30 000 guilders.`
  },
 
  {
    id: "rachel-ruysch",
    visible: false,
    nom: "Rachel Ruysch",
    alias: null,
    statut: "actif",
    naissance: "1664 — 1750",
    origine: "Hollandaise (Amsterdam / Düsseldorf)",
    tags: ["Europe"],
    portrait: null,
    bio: `Peintre néerlandaise de natures mortes florales, fille de Frederik Ruysch. Première femme admise à la Confrérie Pictura de La Haye. Peintre de cour de Johann Wilhelm, électeur palatin à Düsseldorf, jusqu'en 1716. Fortune et réputation indépendantes.`
  },
    ];
