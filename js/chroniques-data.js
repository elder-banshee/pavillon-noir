// Chroniques — Données des scénarii
// Mise à jour au fil de la campagne

const CHRONIQUES = [
  {
    id: "ile-des-ombres",
    visible: true,
    numero: "Scénario I",
    titre: "L'Île des Ombres",
    date_campagne: "Avril 1713",
    illustration: "chroniques/covers/île_des_ombres.jpg",
    align: 50,
    source: null,
    piste: "ost/ile-des-ombres.mp3",
    extrait: "Une île sans nom, des soldats espagnols et des Indiens Bravos tapis dans la forêt. Le premier écart entre ce qu'on cherchait et ce qu'on a trouvé.",
    meta: {
      xp: 8,
      gloire: 20,
      infamie: 5,
      pieces_huit: 0,
      recrues: 0,
      pertes: 0
    },
    rapport: "chroniques/rapports/ile-des-ombres.md",
  },
  {
    id: "sed",
    visible: true,
    numero: "Scénario II",
    titre: "Satiété engendre Démesure",
    date_campagne: "Janvier 1714",
    illustration: "chroniques/covers/sed.jpg",
    align: 50,
    source: { credit: 'D\'après Floris van Schooten, 1626 — Musée du Louvre', url: 'https://collections.louvre.fr/ark:/53355/cl010064656' },
    piste: "ost/sed.mp3",
    extrait: "Une improbable succession de festins culminant par un banquet à Cap-Français, deux gardes du corps d'un agent britannique, et une délégation espagnole empoisonnée.",
    meta: {
      xp: 12,
      gloire: 35,
      infamie: 10,
      pieces_huit: 600,
      recrues: 0,
      pertes: 0
    },
    chapitres: {}
  },
  {
    id: "hippogriffe",
    visible: true,
    numero: "Scénario III",
    titre: "Le dernier voyage de l'Hippogriffe",
    date_campagne: "Septembre—Décembre 1715",
    illustration: "chroniques/covers/hippogriffe.jpg",
    align: 50,
    source: null,
    piste: "ost/hippogriffe.mp3",
    extrait: "Un naufrage providentiel, un cadavre aux plats d'or précolombiens, et la Flotte au Trésor quelque part sous les eaux. Il suffisait d'y arriver les premiers.",
    meta: {
      xp: 8,
      gloire: 50,
      infamie: 15,
      pieces_huit: 12500,
      recrues: 25,
      pertes: 7
    },
    chapitres: {}
  },
  {
    id: "marianne",
    visible: true,
    numero: "Scénario IV",
    titre: "La prise de la Marianne",
    date_campagne: "Décembre 1715",
    illustration: "chroniques/covers/marianne.jpg",
    align: 40,
    source: null,
    piste: "ost/marianne.mp3",
    extrait: "La frégate française Marianne, trente-deux canons, prise par audace sous le nez de Jennings. Le massacre qui a suivi ne figurera dans aucune chanson.",
    meta: {
      xp: 10,
      gloire: 40,
      infamie: 60,
      pieces_huit: 700,
      recrues: 0,
      pertes: 0
    },
    chapitres: {}
  },
  {
    id: "epaves",
    visible: true,
    numero: "Scénario V",
    titre: "Les épaves de la Flotte au Trésor",
    date_campagne: "Janvier 1716",
    illustration: "chroniques/covers/epaves.jpg",
    align: 30,
    source: null,
    piste: "ost/epaves.mp3",
    extrait: "Huit millions de pièces de huit gisaient entre ciel et fond. Ils en ont remonté quatre-vingt mille. Un tiens vaut mieux que deux tu l'auras.",
    meta: {
      xp: 8,
      gloire: 20,
      infamie: 20,
      pieces_huit: 3000,
      recrues: 3,
      pertes: 0
    },
    chapitres: {}
  },
  {
    id: "courses-trinidad",
    visible: true,
    numero: "Scénario VI",
    titre: "Courses à Trinidad",
    date_campagne: "Février 1716",
    illustration: null,
    align: 50,
    source: null,
    piste: "ost/courses-trinidad.mp3",
    extrait: "La sobriété du ton ne laissait pas moins entendre que la situation était grave : la lettre de Ruggiero bouleversait les projets immédiats.",
    meta: {
      xp: 0,
      gloire: 0,
      infamie: 0,
      pieces_huit: 0,
      recrues: 0,
      pertes: 0
    },
    chapitres: {}
  }
];
