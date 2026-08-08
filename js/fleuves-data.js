// ═══════════════════════════════════════════════════════════
// FLEUVES_DATA — Identité, hiérarchie et topologie des cours d'eau
// Généré par tools/fluvial-research/generate-fleuves-data.js à partir de
// fluvial-research-inventory.json — ne pas éditer à la main.
//
// Champs :
//   name       : nom d'affichage commun ; null si non identifié sur la carte
//   branches   : bras du cours — courseId (identifiant stable, à utiliser
//                comme clé de référence), riverId (identifiant technique
//                hérité, sert de jointure vers ocean-hex-grid.js), branch
//                (code de bras : 'main', 'delta-1', 'bras-2'...), cellCount
//   cellCount  : nombre total de cellules occupées par le cours (tous bras
//                confondus), utilisable comme proxy de taille
//   outlets    : terminaisons de chaque bras — riverId, type ('sea' :
//                embouchure en mer, 'map-edge' : sort de la carte,
//                'junction' : rejoint un autre cours via targetRiverId)
//   relations  : liens hydrologiques déclarés dans ocean-hex-grid.js
//                (ex. type 'fork' : bifurcation/confluence entre deux bras)
//
// La géométrie (contours, coordonnées pixel) reste dans zones-data.js et
// ocean-hex-grid.js ; ce fichier ne documente que l'identité et la
// topologie. Les vecteurs de courant et vitesses par cellule restent dans
// ocean-hex-grid.js. Pas encore chargé par index.html/carte.html — à
// intégrer une fois sa consommation implémentée (ex. futur schéma de
// vitesses générique/détaillé par cours).
// ═══════════════════════════════════════════════════════════

const FLEUVES_DATA = {
  "almaria": {
    "name": "Almaria",
    "branches": [
      {
        "courseId": "almaria-main",
        "riverId": "Almaria",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Almaria",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "arba-de-canaveral": {
    "name": "Arba de Canaveral",
    "branches": [
      {
        "courseId": "arba-de-canaveral-main",
        "riverId": "Arba de Canaveral",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "Arba de Canaveral",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "atoyac-r": {
    "name": "Atoyac R.",
    "branches": [
      {
        "courseId": "atoyac-r-main",
        "riverId": "Atoyac R.",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "Atoyac R.",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D3"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D3"
        ]
      }
    ]
  },
  "auyamas": {
    "name": "Auyamas",
    "branches": [
      {
        "courseId": "auyamas-main",
        "riverId": "Auyamas",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "Auyamas",
        "type": "junction",
        "targetRiverId": "Cesar Pompatao"
      }
    ],
    "relations": []
  },
  "barania-r": {
    "name": "Barania R.",
    "branches": [
      {
        "courseId": "barania-r-b",
        "riverId": "Barania R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "barania-r-c",
        "riverId": "Barania R_C",
        "branch": "c",
        "cellCount": 2
      },
      {
        "courseId": "barania-r-main",
        "riverId": "Barania R.",
        "branch": "main",
        "cellCount": 30
      }
    ],
    "cellCount": 34,
    "outlets": [
      {
        "riverId": "Barania R.",
        "type": "map-edge"
      },
      {
        "riverId": "Barania R_B",
        "type": "junction",
        "targetRiverId": "Barania R."
      },
      {
        "riverId": "Barania R_C",
        "type": "junction",
        "targetRiverId": "Barania R_B"
      }
    ],
    "relations": []
  },
  "bariquicometo-r": {
    "name": "Bariquicometo R.",
    "branches": [
      {
        "courseId": "bariquicometo-r-b",
        "riverId": "Bariquicometo R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "bariquicometo-r-c",
        "riverId": "Bariquicometo R_C",
        "branch": "c",
        "cellCount": 7
      },
      {
        "courseId": "bariquicometo-r-main",
        "riverId": "Bariquicometo R.",
        "branch": "main",
        "cellCount": 39
      }
    ],
    "cellCount": 48,
    "outlets": [
      {
        "riverId": "Bariquicometo R_B",
        "type": "junction",
        "targetRiverId": "Bariquicometo R."
      },
      {
        "riverId": "Bariquicometo R_C",
        "type": "junction",
        "targetRiverId": "Bariquicometo R."
      },
      {
        "riverId": "Bariquicometo R.",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Bariquicometo R.",
        "toRiverId": "Capuri River"
      }
    ]
  },
  "boccades-r": {
    "name": "Boccades R.",
    "branches": [
      {
        "courseId": "boccades-r-b",
        "riverId": "Boccades R_B",
        "branch": "b",
        "cellCount": 2
      },
      {
        "courseId": "boccades-r-main",
        "riverId": "Boccades R.",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "Boccades R.",
        "type": "sea"
      },
      {
        "riverId": "Boccades R_B",
        "type": "junction",
        "targetRiverId": "Boccades R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Boccades R.",
          "Trigu R."
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Boccades R."
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Boccades R.",
          "Trigu R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Rio San Juan",
          "Boccades R."
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Boccades R_B"
      },
      {
        "type": "separate",
        "riverIds": [
          "Boccades R.",
          "Boccades R_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Trigu R.",
          "Boccades R_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      }
    ]
  },
  "brave-north-river": {
    "name": "Brave (North) River",
    "branches": [
      {
        "courseId": "brave-north-river-main",
        "riverId": "Brave (North) River",
        "branch": "main",
        "cellCount": 48
      }
    ],
    "cellCount": 48,
    "outlets": [
      {
        "riverId": "Brave (North) River",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "buria-o-de-san-pedro": {
    "name": "Buria o de San Pedro",
    "branches": [
      {
        "courseId": "buria-o-de-san-pedro-main",
        "riverId": "Buria o de San Pedro",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "Buria o de San Pedro",
        "type": "junction",
        "targetRiverId": "Bariquicometo R."
      }
    ],
    "relations": []
  },
  "capuri-river": {
    "name": "Capuri River",
    "branches": [
      {
        "courseId": "capuri-river-main",
        "riverId": "Capuri River",
        "branch": "main",
        "cellCount": 12
      }
    ],
    "cellCount": 12,
    "outlets": [
      {
        "riverId": "Capuri River",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Bariquicometo R.",
        "toRiverId": "Capuri River"
      }
    ]
  },
  "caturi-voari-river": {
    "name": "Caturi Voari River",
    "branches": [
      {
        "courseId": "caturi-voari-river-main",
        "riverId": "Caturi Voari River",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "Caturi Voari River",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-95_143-C",
          "Caturi Voari River"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "F-95_143-C",
          "Caturi Voari River"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Caturi Voari River",
          "F-95_143-C"
        ]
      }
    ]
  },
  "cempel-r": {
    "name": "Cempel R.",
    "branches": [
      {
        "courseId": "cempel-r-main",
        "riverId": "Cempel R.",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "Cempel R.",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R de los Yopes",
          "Cempel R."
        ]
      }
    ]
  },
  "cenu": {
    "name": "Cenu",
    "branches": [
      {
        "courseId": "cenu-main",
        "riverId": "Cenu",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Cenu",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "cesar-pompatao": {
    "name": "Cesar Pompatao",
    "branches": [
      {
        "courseId": "cesar-pompatao-main",
        "riverId": "Cesar Pompatao",
        "branch": "main",
        "cellCount": 28
      }
    ],
    "cellCount": 28,
    "outlets": [
      {
        "riverId": "Cesar Pompatao",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      }
    ],
    "relations": []
  },
  "chagre-r": {
    "name": "Chagre R.",
    "branches": [
      {
        "courseId": "chagre-r-b",
        "riverId": "Chagre R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "chagre-r-c",
        "riverId": "Chagre R_C",
        "branch": "c",
        "cellCount": 2
      },
      {
        "courseId": "chagre-r-main",
        "riverId": "Chagre R.",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 10,
    "outlets": [
      {
        "riverId": "Chagre R.",
        "type": "sea"
      },
      {
        "riverId": "Chagre R_C",
        "type": "junction",
        "targetRiverId": "Chagre R_B"
      },
      {
        "riverId": "Chagre R_B",
        "type": "junction",
        "targetRiverId": "Chagre R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Chagre R.",
          "R. Coqueto"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Chagre R.",
          "Cheapo R."
        ]
      }
    ]
  },
  "cheapo-r": {
    "name": "Cheapo R.",
    "branches": [
      {
        "courseId": "cheapo-r-b",
        "riverId": "Cheapo R_B",
        "branch": "b",
        "cellCount": 3
      },
      {
        "courseId": "cheapo-r-main",
        "riverId": "Cheapo R.",
        "branch": "main",
        "cellCount": 10
      }
    ],
    "cellCount": 12,
    "outlets": [
      {
        "riverId": "Cheapo R.",
        "type": "sea"
      },
      {
        "riverId": "Cheapo R_B",
        "type": "junction",
        "targetRiverId": "Cheapo R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Chagre R.",
          "Cheapo R."
        ]
      }
    ]
  },
  "chequapeque": {
    "name": "Chequapeque",
    "branches": [
      {
        "courseId": "chequapeque-main",
        "riverId": "Chequapeque",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Chequapeque",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "congo-r": {
    "name": "Congo R.",
    "branches": [
      {
        "courseId": "congo-r-main",
        "riverId": "Congo R.",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "Congo R.",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Congo R.",
          "S. Maria River"
        ]
      }
    ]
  },
  "coyrama-r": {
    "name": "Coyrama R.",
    "branches": [
      {
        "courseId": "coyrama-r-main",
        "riverId": "Coyrama R.",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "Coyrama R.",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": []
  },
  "escambia-r": {
    "name": "Escambia R.",
    "branches": [
      {
        "courseId": "escambia-r-main",
        "riverId": "Escambia R.",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Escambia R.",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "europa-river": {
    "name": "Europa River",
    "branches": [
      {
        "courseId": "europa-river-main",
        "riverId": "Europa River",
        "branch": "main",
        "cellCount": 16
      }
    ],
    "cellCount": 16,
    "outlets": [
      {
        "riverId": "Europa River",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-10-62": {
    "name": null,
    "branches": [
      {
        "courseId": "f-10-62-main",
        "riverId": "F-10_62",
        "branch": "main",
        "cellCount": 10
      }
    ],
    "cellCount": 10,
    "outlets": [
      {
        "riverId": "F-10_62",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-102-68-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-102-68-a-main",
        "riverId": "F-102_68-A",
        "branch": "main",
        "cellCount": 1
      }
    ],
    "cellCount": 1,
    "outlets": [
      {
        "riverId": "F-102_68-A",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-102-68-b": {
    "name": null,
    "branches": [
      {
        "courseId": "f-102-68-b-main",
        "riverId": "F-102_68-B",
        "branch": "main",
        "cellCount": 1
      }
    ],
    "cellCount": 1,
    "outlets": [
      {
        "riverId": "F-102_68-B",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-102-68-c": {
    "name": null,
    "branches": [
      {
        "courseId": "f-102-68-c-main",
        "riverId": "F-102_68-C",
        "branch": "main",
        "cellCount": 1
      }
    ],
    "cellCount": 1,
    "outlets": [
      {
        "riverId": "F-102_68-C",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-106-90": {
    "name": null,
    "branches": [
      {
        "courseId": "f-106-90-main",
        "riverId": "F-106_90",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "F-106_90",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-11-59": {
    "name": null,
    "branches": [
      {
        "courseId": "f-11-59-main",
        "riverId": "F-11_59",
        "branch": "main",
        "cellCount": 12
      }
    ],
    "cellCount": 12,
    "outlets": [
      {
        "riverId": "F-11_59",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-12-4-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-12-4-a-main",
        "riverId": "F-12_4-A",
        "branch": "main",
        "cellCount": 17
      }
    ],
    "cellCount": 17,
    "outlets": [
      {
        "riverId": "F-12_4-A",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-42-14-d": {
    "name": null,
    "branches": [
      {
        "courseId": "f-42-14-d-d1",
        "riverId": "F-42_14-D1",
        "branch": "d1",
        "cellCount": 12
      },
      {
        "courseId": "f-42-14-d-d2",
        "riverId": "F-42_14-D2",
        "branch": "d2",
        "cellCount": 10
      },
      {
        "courseId": "f-42-14-d-d3",
        "riverId": "F-42_14-D3",
        "branch": "d3",
        "cellCount": 4
      }
    ],
    "cellCount": 24,
    "outlets": [
      {
        "riverId": "F-42_14-D1",
        "type": "sea"
      },
      {
        "riverId": "F-42_14-D3",
        "type": "sea"
      },
      {
        "riverId": "F-42_14-D2",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D3"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "F-42_14-D3",
          "F-42_14-D2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "F-42_14-D1",
          "F-42_14-D2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Atoyac R.",
          "F-42_14-D3"
        ]
      }
    ]
  },
  "f-42-14-e": {
    "name": null,
    "branches": [
      {
        "courseId": "f-42-14-e-main",
        "riverId": "F-42_14-E",
        "branch": "main",
        "cellCount": 11
      }
    ],
    "cellCount": 11,
    "outlets": [
      {
        "riverId": "F-42_14-E",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-55-5a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-55-5a-main",
        "riverId": "F-55_5A",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "F-55_5A",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-55-5b": {
    "name": null,
    "branches": [
      {
        "courseId": "f-55-5b-main",
        "riverId": "F-55_5B",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "F-55_5B",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-59-55": {
    "name": null,
    "branches": [
      {
        "courseId": "f-59-55-main",
        "riverId": "F-59_55",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "F-59_55",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-66-32-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-66-32-a-main",
        "riverId": "F-66_32-A",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "F-66_32-A",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-66-32-c": {
    "name": null,
    "branches": [
      {
        "courseId": "f-66-32-c-main",
        "riverId": "F-66_32-C",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "F-66_32-C",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-67-21": {
    "name": null,
    "branches": [
      {
        "courseId": "f-67-21-main",
        "riverId": "F-67_21",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "F-67_21",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-7-23": {
    "name": null,
    "branches": [
      {
        "courseId": "f-7-23-main",
        "riverId": "F-7_23",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "F-7_23",
        "type": "junction",
        "targetRiverId": "Mississippi"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Rivière Sablomuere_B",
          "F-7_23"
        ]
      }
    ]
  },
  "f-8-87-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-8-87-a-main",
        "riverId": "F-8_87-A",
        "branch": "main",
        "cellCount": 5
      },
      {
        "courseId": "f-8-87-a-a2",
        "riverId": "F-8_87-A2",
        "branch": "a2",
        "cellCount": 3
      },
      {
        "courseId": "f-8-87-a-a3",
        "riverId": "F-8_87-A3",
        "branch": "a3",
        "cellCount": 2
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "F-8_87-A2",
        "type": "sea"
      },
      {
        "riverId": "F-8_87-A",
        "type": "sea"
      },
      {
        "riverId": "F-8_87-A3",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-8_87-A2",
          "F-8_87-B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "F-8_87-A",
        "toRiverId": "F-8_87-A2"
      },
      {
        "type": "fork",
        "fromRiverId": "F-8_87-A2",
        "toRiverId": "F-8_87-A3"
      }
    ]
  },
  "f-8-87-b": {
    "name": null,
    "branches": [
      {
        "courseId": "f-8-87-b-main",
        "riverId": "F-8_87-B",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "F-8_87-B",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-8_87-A2",
          "F-8_87-B"
        ]
      }
    ]
  },
  "f-8-87-c": {
    "name": null,
    "branches": [
      {
        "courseId": "f-8-87-c-main",
        "riverId": "F-8_87-C",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "F-8_87-C",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-8-87-d": {
    "name": null,
    "branches": [
      {
        "courseId": "f-8-87-d-main",
        "riverId": "F-8_87-D",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "F-8_87-D",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-82-39": {
    "name": null,
    "branches": [
      {
        "courseId": "f-82-39-main",
        "riverId": "F-82_39",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "F-82_39",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-92-100": {
    "name": null,
    "branches": [
      {
        "courseId": "f-92-100-main",
        "riverId": "F-92_100",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "F-92_100",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      }
    ],
    "relations": []
  },
  "f-93-119": {
    "name": null,
    "branches": [
      {
        "courseId": "f-93-119-main",
        "riverId": "F-93_119",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "F-93_119",
        "type": "junction",
        "targetRiverId": "Lac Maracaibo"
      }
    ],
    "relations": []
  },
  "f-95-143-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-95-143-a-main",
        "riverId": "F-95_143-A",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "F-95_143-A",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-95-143-c": {
    "name": null,
    "branches": [
      {
        "courseId": "f-95-143-c-main",
        "riverId": "F-95_143-C",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "F-95_143-C",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-95_143-C",
          "Caturi Voari River"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "F-95_143-C",
          "Caturi Voari River"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Caturi Voari River",
          "F-95_143-C"
        ]
      }
    ]
  },
  "f-98-73-a": {
    "name": null,
    "branches": [
      {
        "courseId": "f-98-73-a-main",
        "riverId": "F-98_73-A",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "F-98_73-A",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-98_73-A",
          "F-98_73-C"
        ]
      }
    ]
  },
  "f-98-73-b": {
    "name": null,
    "branches": [
      {
        "courseId": "f-98-73-b-main",
        "riverId": "F-98_73-B",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "F-98_73-B",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "f-98-73-c": {
    "name": null,
    "branches": [
      {
        "courseId": "f-98-73-c-main",
        "riverId": "F-98_73-C",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "F-98_73-C",
        "type": "junction",
        "targetRiverId": "Chagre R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "F-98_73-A",
          "F-98_73-C"
        ]
      }
    ]
  },
  "gold-river": {
    "name": "Gold River",
    "branches": [
      {
        "courseId": "gold-river-main",
        "riverId": "Gold River",
        "branch": "main",
        "cellCount": 6
      },
      {
        "courseId": "gold-river-b",
        "riverId": "Gold River_B",
        "branch": "b",
        "cellCount": 4
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "Gold River",
        "type": "sea"
      },
      {
        "riverId": "Gold River_B",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Gold River",
          "Gold River_B"
        ]
      }
    ]
  },
  "lac-de-caslipa": {
    "name": "Lac de Caslipa",
    "branches": [
      {
        "courseId": "lac-de-caslipa-main",
        "riverId": "Lac de Caslipa",
        "branch": "main",
        "cellCount": 18
      }
    ],
    "cellCount": 18,
    "outlets": [
      {
        "riverId": "Lac de Caslipa",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Orénoque",
        "toRiverId": "Lac de Caslipa"
      }
    ]
  },
  "lac-de-mexico": {
    "name": "Lac de Mexico",
    "branches": [
      {
        "courseId": "lac-de-mexico-main",
        "riverId": "Lac de Mexico",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Lac de Mexico",
        "type": "junction",
        "targetRiverId": "Barania R_B"
      }
    ],
    "relations": []
  },
  "lac-maracaibo": {
    "name": "Lac Maracaibo",
    "branches": [
      {
        "courseId": "lac-maracaibo-main",
        "riverId": "Lac Maracaibo",
        "branch": "main",
        "cellCount": 19
      }
    ],
    "cellCount": 19,
    "outlets": [
      {
        "riverId": "Lac Maracaibo",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "lac-nicaragua": {
    "name": "Lac Nicaragua",
    "branches": [
      {
        "courseId": "lac-nicaragua-main",
        "riverId": "Lac Nicaragua",
        "branch": "main",
        "cellCount": 46
      },
      {
        "courseId": "lac-nicaragua-bras-1",
        "riverId": "Nicaragua_1",
        "branch": "bras-1",
        "cellCount": 3
      },
      {
        "courseId": "lac-nicaragua-bras-2",
        "riverId": "Nicaragua_2",
        "branch": "bras-2",
        "cellCount": 3
      },
      {
        "courseId": "lac-nicaragua-bras-3",
        "riverId": "Nicaragua_3",
        "branch": "bras-3",
        "cellCount": 5
      },
      {
        "courseId": "lac-nicaragua-bras-4",
        "riverId": "Nicaragua_4",
        "branch": "bras-4",
        "cellCount": 6
      },
      {
        "courseId": "lac-nicaragua-bras-5",
        "riverId": "Nicaragua_5",
        "branch": "bras-5",
        "cellCount": 3
      }
    ],
    "cellCount": 61,
    "outlets": [
      {
        "riverId": "Nicaragua_5",
        "type": "junction",
        "targetRiverId": "Lac Nicaragua"
      },
      {
        "riverId": "Nicaragua_4",
        "type": "junction",
        "targetRiverId": "Lac Nicaragua"
      },
      {
        "riverId": "Nicaragua_3",
        "type": "junction",
        "targetRiverId": "Lac Nicaragua"
      },
      {
        "riverId": "Nicaragua_2",
        "type": "junction",
        "targetRiverId": "Lac Nicaragua"
      },
      {
        "riverId": "Nicaragua_1",
        "type": "junction",
        "targetRiverId": "Lac Nicaragua"
      },
      {
        "riverId": "Lac Nicaragua",
        "type": "junction",
        "targetRiverId": "Rio San Juan"
      }
    ],
    "relations": []
  },
  "logwood-creek": {
    "name": "Logwood Creek",
    "branches": [
      {
        "courseId": "logwood-creek-main",
        "riverId": "Logwood Creek",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "Logwood Creek",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R_F",
          "Logwood Creek"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R_E",
          "Logwood Creek"
        ]
      }
    ]
  },
  "marpequeue": {
    "name": "Marpequeue",
    "branches": [
      {
        "courseId": "marpequeue-main",
        "riverId": "Marpequeue",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "Marpequeue",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "matapec-r": {
    "name": "Matapec R.",
    "branches": [
      {
        "courseId": "matapec-r-main",
        "riverId": "Matapec R.",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "Matapec R.",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "may-r": {
    "name": "May R.",
    "branches": [
      {
        "courseId": "may-r-main",
        "riverId": "May R.",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "May R.",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "meracaybo-river": {
    "name": "Meracaybo River",
    "branches": [
      {
        "courseId": "meracaybo-river-main",
        "riverId": "Meracaybo River",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "Meracaybo River",
        "type": "junction",
        "targetRiverId": "Lac Maracaibo"
      }
    ],
    "relations": []
  },
  "mississippi": {
    "name": "Mississippi",
    "branches": [
      {
        "courseId": "mississippi-main",
        "riverId": "Mississippi",
        "branch": "main",
        "cellCount": 51
      },
      {
        "courseId": "mississippi-b",
        "riverId": "Mississippi_B",
        "branch": "b",
        "cellCount": 4
      }
    ],
    "cellCount": 52,
    "outlets": [
      {
        "riverId": "Mississippi",
        "type": "sea"
      },
      {
        "riverId": "Mississippi_B",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Mississippi",
          "Mississippi_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Mississippi",
          "Mississippi_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Mississippi",
        "toRiverId": "Mississippi_B"
      }
    ]
  },
  "n-segovia-river": {
    "name": "N. Segovia River",
    "branches": [
      {
        "courseId": "n-segovia-river-main",
        "riverId": "N. Segovia River",
        "branch": "main",
        "cellCount": 15
      },
      {
        "courseId": "n-segovia-river-b",
        "riverId": "N. Segovia River_B",
        "branch": "b",
        "cellCount": 9
      }
    ],
    "cellCount": 22,
    "outlets": [
      {
        "riverId": "N. Segovia River",
        "type": "junction",
        "targetRiverId": "Yare R."
      },
      {
        "riverId": "N. Segovia River_B",
        "type": "junction",
        "targetRiverId": "N. Segovia River"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Yare R.",
          "N. Segovia River"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "N. Segovia River",
          "N. Segovia River_B"
        ]
      }
    ]
  },
  "nieves-r": {
    "name": "Nieves R.",
    "branches": [
      {
        "courseId": "nieves-r-main",
        "riverId": "Nieves R.",
        "branch": "main",
        "cellCount": 18
      }
    ],
    "cellCount": 18,
    "outlets": [
      {
        "riverId": "Nieves R.",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "ochio-ou-belle-riviere": {
    "name": "Ochio ou Belle Rivière",
    "branches": [
      {
        "courseId": "ochio-ou-belle-riviere-main",
        "riverId": "Ochio ou Belle Rivière",
        "branch": "main",
        "cellCount": 26
      },
      {
        "courseId": "ochio-ou-belle-riviere-b",
        "riverId": "Ochio ou Belle Rivière_B",
        "branch": "b",
        "cellCount": 15
      }
    ],
    "cellCount": 39,
    "outlets": [
      {
        "riverId": "Ochio ou Belle Rivière",
        "type": "junction",
        "targetRiverId": "Mississippi"
      },
      {
        "riverId": "Ochio ou Belle Rivière_B",
        "type": "junction",
        "targetRiverId": "Mississippi"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Ochio ou Belle Rivière",
          "Ochio ou Belle Rivière_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Ochio ou Belle Rivière",
        "toRiverId": "Ochio ou Belle Rivière_B"
      }
    ]
  },
  "orenoque": {
    "name": "Orénoque",
    "branches": [
      {
        "courseId": "orenoque-delta-1",
        "riverId": "Delta_Orénoque_1",
        "branch": "delta-1",
        "cellCount": 2
      },
      {
        "courseId": "orenoque-delta-2",
        "riverId": "Delta_Orénoque_2",
        "branch": "delta-2",
        "cellCount": 2
      },
      {
        "courseId": "orenoque-delta-3",
        "riverId": "Delta_Orénoque_3",
        "branch": "delta-3",
        "cellCount": 2
      },
      {
        "courseId": "orenoque-main",
        "riverId": "Orénoque",
        "branch": "main",
        "cellCount": 35
      },
      {
        "courseId": "orenoque-b",
        "riverId": "Orénoque_B",
        "branch": "b",
        "cellCount": 3
      },
      {
        "courseId": "orenoque-c",
        "riverId": "Orénoque_C",
        "branch": "c",
        "cellCount": 2
      },
      {
        "courseId": "orenoque-d",
        "riverId": "Orénoque_D",
        "branch": "d",
        "cellCount": 3
      }
    ],
    "cellCount": 43,
    "outlets": [
      {
        "riverId": "Delta_Orénoque_1",
        "type": "sea"
      },
      {
        "riverId": "Delta_Orénoque_2",
        "type": "sea"
      },
      {
        "riverId": "Delta_Orénoque_3",
        "type": "sea"
      },
      {
        "riverId": "Orénoque",
        "type": "sea"
      },
      {
        "riverId": "Orénoque_B",
        "type": "junction",
        "targetRiverId": "Orénoque"
      },
      {
        "riverId": "Orénoque_C",
        "type": "junction",
        "targetRiverId": "Orénoque"
      },
      {
        "riverId": "Orénoque_D",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Orénoque",
        "toRiverId": "Delta_Orénoque_3"
      },
      {
        "type": "fork",
        "fromRiverId": "Orénoque",
        "toRiverId": "Delta_Orénoque_1"
      },
      {
        "type": "fork",
        "fromRiverId": "Orénoque",
        "toRiverId": "Delta_Orénoque_2"
      },
      {
        "type": "separate",
        "riverIds": [
          "Delta_Orénoque_1",
          "Delta_Orénoque_2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Delta_Orénoque_1",
          "R. Maryowapaneko"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Delta_Orénoque_2",
          "R. Maryowapaneko"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Orénoque",
        "toRiverId": "Lac de Caslipa"
      }
    ]
  },
  "ostras": {
    "name": "Ostras",
    "branches": [
      {
        "courseId": "ostras-main",
        "riverId": "Ostras",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "Ostras",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "ovarabiche-r": {
    "name": "Ovarabiche R.",
    "branches": [
      {
        "courseId": "ovarabiche-r-b",
        "riverId": "Ovarabiche R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "ovarabiche-r-main",
        "riverId": "Ovarabiche R.",
        "branch": "main",
        "cellCount": 12
      }
    ],
    "cellCount": 14,
    "outlets": [
      {
        "riverId": "Ovarabiche R.",
        "type": "sea"
      },
      {
        "riverId": "Ovarabiche R_B",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Ovarabiche R.",
          "Ovarabiche R_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Ovarabiche R.",
        "toRiverId": "Ovarabiche R_B"
      }
    ]
  },
  "pacific": {
    "name": null,
    "branches": [
      {
        "courseId": "pacific-1",
        "riverId": "Pacific_1",
        "branch": "1",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "Pacific_1",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "panuco": {
    "name": "Panuco",
    "branches": [
      {
        "courseId": "panuco-main",
        "riverId": "Panuco",
        "branch": "main",
        "cellCount": 29
      },
      {
        "courseId": "panuco-b",
        "riverId": "Panuco_B",
        "branch": "b",
        "cellCount": 5
      },
      {
        "courseId": "panuco-c",
        "riverId": "Panuco_C",
        "branch": "c",
        "cellCount": 3
      }
    ],
    "cellCount": 34,
    "outlets": [
      {
        "riverId": "Panuco",
        "type": "sea"
      },
      {
        "riverId": "Panuco_B",
        "type": "junction",
        "targetRiverId": "Panuco"
      },
      {
        "riverId": "Panuco_C",
        "type": "junction",
        "targetRiverId": "F-12_4-A"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Panuco",
        "toRiverId": "Panuco_C"
      },
      {
        "type": "fork",
        "fromRiverId": "Panuco",
        "toRiverId": "Panuco_C"
      }
    ]
  },
  "pato-r": {
    "name": "Pato R.",
    "branches": [
      {
        "courseId": "pato-r-b",
        "riverId": "Pato R_B",
        "branch": "b",
        "cellCount": 7
      },
      {
        "courseId": "pato-r-main",
        "riverId": "Pato R.",
        "branch": "main",
        "cellCount": 21
      }
    ],
    "cellCount": 26,
    "outlets": [
      {
        "riverId": "Pato R.",
        "type": "junction",
        "targetRiverId": "Bariquicometo R."
      },
      {
        "riverId": "Pato R_B",
        "type": "junction",
        "targetRiverId": "Pato R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Pato R.",
          "Pato R_B"
        ]
      }
    ]
  },
  "perdido": {
    "name": "Perdido",
    "branches": [
      {
        "courseId": "perdido-main",
        "riverId": "Perdido",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "Perdido",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-amacuro": {
    "name": "R. Amacuro",
    "branches": [
      {
        "courseId": "r-amacuro-main",
        "riverId": "R. Amacuro",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "R. Amacuro",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-auzuelos": {
    "name": "R. Auzuelos",
    "branches": [
      {
        "courseId": "r-auzuelos-main",
        "riverId": "R. Auzuelos",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "R. Auzuelos",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-belem": {
    "name": "R. Belem",
    "branches": [
      {
        "courseId": "r-belem-main",
        "riverId": "R. Belem",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "R. Belem",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-berbice": {
    "name": "R. Berbice",
    "branches": [
      {
        "courseId": "r-berbice-main",
        "riverId": "R. Berbice",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "R. Berbice",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Berbice",
          "R. Corretine"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Berbice",
          "R. Corretine_B"
        ]
      }
    ]
  },
  "r-buchia": {
    "name": "R. Buchia",
    "branches": [
      {
        "courseId": "r-buchia-main",
        "riverId": "R. Buchia",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "R. Buchia",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-caranaco": {
    "name": "R. Caranaco",
    "branches": [
      {
        "courseId": "r-caranaco-main",
        "riverId": "R. Caranaco",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "R. Caranaco",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-copanama": {
    "name": "R. Copanama",
    "branches": [
      {
        "courseId": "r-copanama-main",
        "riverId": "R. Copanama",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "R. Copanama",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "Suriname_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "Suriname_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "R. Marateka_C"
        ]
      }
    ]
  },
  "r-coqueto": {
    "name": "R. Coqueto",
    "branches": [
      {
        "courseId": "r-coqueto-main",
        "riverId": "R. Coqueto",
        "branch": "main",
        "cellCount": 4
      },
      {
        "courseId": "r-coqueto-b",
        "riverId": "R. Coqueto_B",
        "branch": "b",
        "cellCount": 3
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "R. Coqueto",
        "type": "sea"
      },
      {
        "riverId": "R. Coqueto_B",
        "type": "junction",
        "targetRiverId": "R. Coqueto"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Chagre R.",
          "R. Coqueto"
        ]
      }
    ]
  },
  "r-corretine": {
    "name": "R. Corretine",
    "branches": [
      {
        "courseId": "r-corretine-main",
        "riverId": "R. Corretine",
        "branch": "main",
        "cellCount": 12
      },
      {
        "courseId": "r-corretine-b",
        "riverId": "R. Corretine_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "r-corretine-c",
        "riverId": "R. Corretine_C",
        "branch": "c",
        "cellCount": 4
      }
    ],
    "cellCount": 17,
    "outlets": [
      {
        "riverId": "R. Corretine",
        "type": "sea"
      },
      {
        "riverId": "R. Corretine_B",
        "type": "junction",
        "targetRiverId": "R. Corretine"
      },
      {
        "riverId": "R. Corretine_C",
        "type": "junction",
        "targetRiverId": "R. Corretine"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Berbice",
          "R. Corretine"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Berbice",
          "R. Corretine_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Corretine",
          "R. Corretine_C"
        ]
      }
    ]
  },
  "r-de-costaricha": {
    "name": "R. de Costaricha",
    "branches": [
      {
        "courseId": "r-de-costaricha-main",
        "riverId": "R. de Costaricha",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "R. de Costaricha",
        "type": "junction",
        "targetRiverId": "Rio San Juan"
      }
    ],
    "relations": []
  },
  "r-de-los-yopes": {
    "name": "R de los Yopes",
    "branches": [
      {
        "courseId": "r-de-los-yopes-main",
        "riverId": "R de los Yopes",
        "branch": "main",
        "cellCount": 24
      }
    ],
    "cellCount": 24,
    "outlets": [
      {
        "riverId": "R de los Yopes",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R de los Yopes",
          "Cempel R."
        ]
      }
    ]
  },
  "r-de-medelin": {
    "name": "R. de Medelin",
    "branches": [
      {
        "courseId": "r-de-medelin-main",
        "riverId": "R. de Medelin",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "R. de Medelin",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-de-vera-cruz": {
    "name": "R. de Vera Cruz",
    "branches": [
      {
        "courseId": "r-de-vera-cruz-main",
        "riverId": "R. de Vera Cruz",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "R. de Vera Cruz",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-dulce": {
    "name": "R. Dulce",
    "branches": [
      {
        "courseId": "r-dulce-main",
        "riverId": "R. Dulce",
        "branch": "main",
        "cellCount": 15
      },
      {
        "courseId": "r-dulce-1",
        "riverId": "R. Dulce_1",
        "branch": "1",
        "cellCount": 3
      },
      {
        "courseId": "r-dulce-2",
        "riverId": "R. Dulce_2",
        "branch": "2",
        "cellCount": 5
      },
      {
        "courseId": "r-dulce-3",
        "riverId": "R. Dulce_3",
        "branch": "3",
        "cellCount": 2
      },
      {
        "courseId": "r-dulce-4",
        "riverId": "R. Dulce_4",
        "branch": "4",
        "cellCount": 5
      },
      {
        "courseId": "r-dulce-5",
        "riverId": "R. Dulce_5",
        "branch": "5",
        "cellCount": 5
      }
    ],
    "cellCount": 27,
    "outlets": [
      {
        "riverId": "R. Dulce",
        "type": "sea"
      },
      {
        "riverId": "R. Dulce_3",
        "type": "junction",
        "targetRiverId": "R. Dulce"
      },
      {
        "riverId": "R. Dulce_2",
        "type": "junction",
        "targetRiverId": "R. Dulce"
      },
      {
        "riverId": "R. Dulce_1",
        "type": "junction",
        "targetRiverId": "R. Dulce"
      },
      {
        "riverId": "R. Dulce_5",
        "type": "junction",
        "targetRiverId": "R. Dulce"
      },
      {
        "riverId": "R. Dulce_4",
        "type": "junction",
        "targetRiverId": "R. Dulce"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Dulce_1",
          "R. Dulce_2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Dulce",
          "R. Dulce_2"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Dulce",
          "R. Dulce_4"
        ]
      }
    ]
  },
  "r-essequebe": {
    "name": "R. Essequebe",
    "branches": [
      {
        "courseId": "r-essequebe-main",
        "riverId": "R. Essequebe",
        "branch": "main",
        "cellCount": 16
      }
    ],
    "cellCount": 16,
    "outlets": [
      {
        "riverId": "R. Essequebe",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-flores": {
    "name": "R. Flores",
    "branches": [
      {
        "courseId": "r-flores-main",
        "riverId": "R. Flores",
        "branch": "main",
        "cellCount": 9
      }
    ],
    "cellCount": 9,
    "outlets": [
      {
        "riverId": "R. Flores",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-galer": {
    "name": "R. Galer",
    "branches": [
      {
        "courseId": "r-galer-main",
        "riverId": "R. Galer",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "R. Galer",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-granda": {
    "name": "R. Granda",
    "branches": [
      {
        "courseId": "r-granda-main",
        "riverId": "R. Granda",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "R. Granda",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Granda",
          "R. Guaiapo"
        ]
      }
    ]
  },
  "r-guaiapo": {
    "name": "R. Guaiapo",
    "branches": [
      {
        "courseId": "r-guaiapo-main",
        "riverId": "R. Guaiapo",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "R. Guaiapo",
        "type": "junction",
        "targetRiverId": "R. Granda"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Granda",
          "R. Guaiapo"
        ]
      }
    ]
  },
  "r-guazacoalco-ou-guashigwalp": {
    "name": "R. Guazacoalco - ou Guashigwalp",
    "branches": [
      {
        "courseId": "r-guazacoalco-ou-guashigwalp-main",
        "riverId": "R. Guazacoalco - ou Guashigwalp",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "R. Guazacoalco - ou Guashigwalp",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-lempa": {
    "name": "R. Lempa",
    "branches": [
      {
        "courseId": "r-lempa-main",
        "riverId": "R. Lempa",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "R. Lempa",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-marateka": {
    "name": "R. Marateka",
    "branches": [
      {
        "courseId": "r-marateka-main",
        "riverId": "R. Marateka",
        "branch": "main",
        "cellCount": 8
      },
      {
        "courseId": "r-marateka-b",
        "riverId": "R. Marateka_B",
        "branch": "b",
        "cellCount": 6
      },
      {
        "courseId": "r-marateka-c",
        "riverId": "R. Marateka_C",
        "branch": "c",
        "cellCount": 7
      },
      {
        "courseId": "r-marateka-d",
        "riverId": "R. Marateka_D",
        "branch": "d",
        "cellCount": 2
      }
    ],
    "cellCount": 17,
    "outlets": [
      {
        "riverId": "R. Marateka_C",
        "type": "sea"
      },
      {
        "riverId": "R. Marateka",
        "type": "sea"
      },
      {
        "riverId": "R. Marateka_B",
        "type": "junction",
        "targetRiverId": "R. Marateka"
      },
      {
        "riverId": "R. Marateka_D",
        "type": "junction",
        "targetRiverId": "R. Marateka_C"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka",
          "R. Marateka_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka_C",
          "R. Copanama"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka",
          "R. Marateka_D"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka",
          "R. Marateka_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "R. Marateka_B",
        "toRiverId": "R. Marateka_D"
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Marateka",
          "R. Marateka_B"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "R. Marateka_C"
        ]
      }
    ]
  },
  "r-marrawini": {
    "name": "R. Marrawini",
    "branches": [
      {
        "courseId": "r-marrawini-main",
        "riverId": "R. Marrawini",
        "branch": "main",
        "cellCount": 12
      }
    ],
    "cellCount": 12,
    "outlets": [
      {
        "riverId": "R. Marrawini",
        "type": "junction",
        "targetRiverId": "Suriname"
      }
    ],
    "relations": []
  },
  "r-maryowapaneko": {
    "name": "R. Maryowapaneko",
    "branches": [
      {
        "courseId": "r-maryowapaneko-main",
        "riverId": "R. Maryowapaneko",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "R. Maryowapaneko",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Delta_Orénoque_1",
          "R. Maryowapaneko"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Delta_Orénoque_2",
          "R. Maryowapaneko"
        ]
      }
    ]
  },
  "r-michataya": {
    "name": "R Michataya",
    "branches": [
      {
        "courseId": "r-michataya-main",
        "riverId": "R Michataya",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "R Michataya",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-pech": {
    "name": "R. Pech",
    "branches": [
      {
        "courseId": "r-pech-main",
        "riverId": "R. Pech",
        "branch": "main",
        "cellCount": 9
      },
      {
        "courseId": "r-pech-b",
        "riverId": "R. Pech_B",
        "branch": "b",
        "cellCount": 3
      }
    ],
    "cellCount": 11,
    "outlets": [
      {
        "riverId": "R. Pech",
        "type": "sea"
      },
      {
        "riverId": "R. Pech_B",
        "type": "junction",
        "targetRiverId": "R. Pech"
      }
    ],
    "relations": []
  },
  "r-poumaron": {
    "name": "R. Poumaron",
    "branches": [
      {
        "courseId": "r-poumaron-main",
        "riverId": "R. Poumaron",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "R. Poumaron",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-quemades": {
    "name": "R. Quemades",
    "branches": [
      {
        "courseId": "r-quemades-main",
        "riverId": "R. Quemades",
        "branch": "main",
        "cellCount": 1
      }
    ],
    "cellCount": 1,
    "outlets": [
      {
        "riverId": "R. Quemades",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-serapique": {
    "name": "R. Serapique",
    "branches": [
      {
        "courseId": "r-serapique-main",
        "riverId": "R. Serapique",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "R. Serapique",
        "type": "junction",
        "targetRiverId": "Rio San Juan"
      }
    ],
    "relations": []
  },
  "r-snelo": {
    "name": "R. Snelo",
    "branches": [
      {
        "courseId": "r-snelo-main",
        "riverId": "R. Snelo",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "R. Snelo",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-st-pedro": {
    "name": "R. St Pedro",
    "branches": [
      {
        "courseId": "r-st-pedro-main",
        "riverId": "R. St Pedro",
        "branch": "main",
        "cellCount": 16
      },
      {
        "courseId": "r-st-pedro-b",
        "riverId": "R. St Pedro_B",
        "branch": "b",
        "cellCount": 2
      }
    ],
    "cellCount": 17,
    "outlets": [
      {
        "riverId": "R. St Pedro",
        "type": "sea"
      },
      {
        "riverId": "R. St Pedro_B",
        "type": "junction",
        "targetRiverId": "R. St Pedro"
      }
    ],
    "relations": []
  },
  "r-talamanca": {
    "name": "R. Talamanca",
    "branches": [
      {
        "courseId": "r-talamanca-main",
        "riverId": "R. Talamanca",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "R. Talamanca",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-tispe": {
    "name": "R Tispe",
    "branches": [
      {
        "courseId": "r-tispe-main",
        "riverId": "R Tispe",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "R Tispe",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-waymy": {
    "name": "R. Waymy",
    "branches": [
      {
        "courseId": "r-waymy-main",
        "riverId": "R. Waymy",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "R. Waymy",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "r-yayrepo": {
    "name": "R Yayrepo",
    "branches": [
      {
        "courseId": "r-yayrepo-main",
        "riverId": "R Yayrepo",
        "branch": "main",
        "cellCount": 9
      },
      {
        "courseId": "r-yayrepo-b",
        "riverId": "R Yayrepo_B",
        "branch": "b",
        "cellCount": 3
      }
    ],
    "cellCount": 11,
    "outlets": [
      {
        "riverId": "R Yayrepo",
        "type": "sea"
      },
      {
        "riverId": "R Yayrepo_B",
        "type": "junction",
        "targetRiverId": "Boccades R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Trigu R.",
          "R Yayrepo_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "R Yayrepo"
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "R Yayrepo"
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "R Yayrepo",
        "toRiverId": "R Yayrepo_B"
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "R Yayrepo",
          "Boccades R."
        ]
      }
    ]
  },
  "rio-de-aluerado": {
    "name": "Rio de Aluerado",
    "branches": [
      {
        "courseId": "rio-de-aluerado-main",
        "riverId": "Rio de Aluerado",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "Rio de Aluerado",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-de-carare": {
    "name": "Rio de Carare",
    "branches": [
      {
        "courseId": "rio-de-carare-main",
        "riverId": "Rio de Carare",
        "branch": "main",
        "cellCount": 20
      },
      {
        "courseId": "rio-de-carare-b",
        "riverId": "Rio de Carare_B",
        "branch": "b",
        "cellCount": 5
      }
    ],
    "cellCount": 24,
    "outlets": [
      {
        "riverId": "Rio de Carare",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      },
      {
        "riverId": "Rio de Carare_B",
        "type": "junction",
        "targetRiverId": "Rio de Carare"
      }
    ],
    "relations": []
  },
  "rio-de-los-redes": {
    "name": "Rio de los Redes",
    "branches": [
      {
        "courseId": "rio-de-los-redes-main",
        "riverId": "Rio de los Redes",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Rio de los Redes",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-del-canaveral": {
    "name": "Rio del Canaveral",
    "branches": [
      {
        "courseId": "rio-del-canaveral-main",
        "riverId": "Rio del Canaveral",
        "branch": "main",
        "cellCount": 12
      }
    ],
    "cellCount": 12,
    "outlets": [
      {
        "riverId": "Rio del Canaveral",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-del-spirito-sancto": {
    "name": "Rio del Spirito Sancto",
    "branches": [
      {
        "courseId": "rio-del-spirito-sancto-main",
        "riverId": "Rio del Spirito Sancto",
        "branch": "main",
        "cellCount": 14
      }
    ],
    "cellCount": 14,
    "outlets": [
      {
        "riverId": "Rio del Spirito Sancto",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-grande-de-la-madalena": {
    "name": "Rio Grande de la Madalena",
    "branches": [
      {
        "courseId": "rio-grande-de-la-madalena-main",
        "riverId": "Rio Grande de la Madalena",
        "branch": "main",
        "cellCount": 36
      },
      {
        "courseId": "rio-grande-de-la-madalena-b",
        "riverId": "Rio Grande de la Madalena_B",
        "branch": "b",
        "cellCount": 7
      },
      {
        "courseId": "rio-grande-de-la-madalena-c",
        "riverId": "Rio Grande de la Madalena_C",
        "branch": "c",
        "cellCount": 6
      },
      {
        "courseId": "rio-grande-de-la-madalena-d",
        "riverId": "Rio Grande de la Madalena_D",
        "branch": "d",
        "cellCount": 6
      },
      {
        "courseId": "rio-grande-de-la-madalena-e",
        "riverId": "Rio Grande de la Madalena_E",
        "branch": "e",
        "cellCount": 3
      }
    ],
    "cellCount": 53,
    "outlets": [
      {
        "riverId": "Rio Grande de la Madalena_B",
        "type": "sea"
      },
      {
        "riverId": "Rio Grande de la Madalena",
        "type": "sea"
      },
      {
        "riverId": "Rio Grande de la Madalena_C",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      },
      {
        "riverId": "Rio Grande de la Madalena_D",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      },
      {
        "riverId": "Rio Grande de la Madalena_E",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena_D"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Rio Grande de la Madalena",
        "toRiverId": "Rio Grande de la Madalena_B"
      },
      {
        "type": "separate",
        "riverIds": [
          "Rio Grande de la Madalena",
          "Rio Grande de la Madalena_D"
        ]
      }
    ]
  },
  "rio-grande-de-santa-martha": {
    "name": "Rio Grande de Santa Martha",
    "branches": [
      {
        "courseId": "rio-grande-de-santa-martha-main",
        "riverId": "Rio Grande de Santa Martha",
        "branch": "main",
        "cellCount": 23
      },
      {
        "courseId": "rio-grande-de-santa-martha-b",
        "riverId": "Rio Grande de Santa Martha_B",
        "branch": "b",
        "cellCount": 3
      }
    ],
    "cellCount": 25,
    "outlets": [
      {
        "riverId": "Rio Grande de Santa Martha",
        "type": "junction",
        "targetRiverId": "Rio Grande de la Madalena"
      },
      {
        "riverId": "Rio Grande de Santa Martha_B",
        "type": "junction",
        "targetRiverId": "Rio Grande de Santa Martha"
      }
    ],
    "relations": []
  },
  "rio-grande-del-darien": {
    "name": "Rio Grande del Darién",
    "branches": [
      {
        "courseId": "rio-grande-del-darien-main",
        "riverId": "Rio Grande del Darién",
        "branch": "main",
        "cellCount": 10
      }
    ],
    "cellCount": 10,
    "outlets": [
      {
        "riverId": "Rio Grande del Darién",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-negro": {
    "name": "Rio Negro",
    "branches": [
      {
        "courseId": "rio-negro-main",
        "riverId": "Rio Negro",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "Rio Negro",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "rio-palmas-dos-bogas": {
    "name": "Rio Palmas dos Bogas",
    "branches": [
      {
        "courseId": "rio-palmas-dos-bogas-main",
        "riverId": "Rio Palmas dos Bogas",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "Rio Palmas dos Bogas",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Rio Palmas dos Bogas",
          "St Anns"
        ]
      }
    ]
  },
  "rio-san-juan": {
    "name": "Rio San Juan",
    "branches": [
      {
        "courseId": "rio-san-juan-main",
        "riverId": "Rio San Juan",
        "branch": "main",
        "cellCount": 16
      }
    ],
    "cellCount": 16,
    "outlets": [
      {
        "riverId": "Rio San Juan",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "R Yayrepo"
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "R Yayrepo"
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Boccades R."
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Trigu R."
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Trigu R."
      },
      {
        "type": "separate",
        "riverIds": [
          "Rio San Juan",
          "Boccades R."
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Boccades R_B"
      }
    ]
  },
  "riviere-aux-vaches": {
    "name": "Rivière aux Vaches",
    "branches": [
      {
        "courseId": "riviere-aux-vaches-main",
        "riverId": "Rivière aux Vaches",
        "branch": "main",
        "cellCount": 18
      }
    ],
    "cellCount": 18,
    "outlets": [
      {
        "riverId": "Rivière aux Vaches",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "riviere-sablomuere": {
    "name": "Rivière Sablomuere",
    "branches": [
      {
        "courseId": "riviere-sablomuere-main",
        "riverId": "Rivière Sablomuere",
        "branch": "main",
        "cellCount": 19
      },
      {
        "courseId": "riviere-sablomuere-b",
        "riverId": "Rivière Sablomuere_B",
        "branch": "b",
        "cellCount": 3
      }
    ],
    "cellCount": 21,
    "outlets": [
      {
        "riverId": "Rivière Sablomuere",
        "type": "junction",
        "targetRiverId": "Mississippi"
      },
      {
        "riverId": "Rivière Sablomuere_B",
        "type": "junction",
        "targetRiverId": "Mississippi"
      }
    ],
    "relations": [
      {
        "type": "fork",
        "fromRiverId": "Rivière Sablomuere",
        "toRiverId": "Rivière Sablomuere_B"
      },
      {
        "type": "separate",
        "riverIds": [
          "Rivière Sablomuere_B",
          "F-7_23"
        ]
      }
    ]
  },
  "s-maria-river": {
    "name": "S. Maria River",
    "branches": [
      {
        "courseId": "s-maria-river-main",
        "riverId": "S. Maria River",
        "branch": "main",
        "cellCount": 13
      }
    ],
    "cellCount": 13,
    "outlets": [
      {
        "riverId": "S. Maria River",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Congo R.",
          "S. Maria River"
        ]
      }
    ]
  },
  "sal-r": {
    "name": "Sal R",
    "branches": [
      {
        "courseId": "sal-r-main",
        "riverId": "Sal R",
        "branch": "main",
        "cellCount": 13
      },
      {
        "courseId": "sal-r-b",
        "riverId": "Sal R_B",
        "branch": "b",
        "cellCount": 4
      }
    ],
    "cellCount": 16,
    "outlets": [
      {
        "riverId": "Sal R",
        "type": "sea"
      },
      {
        "riverId": "Sal R_B",
        "type": "junction",
        "targetRiverId": "Sal R"
      }
    ],
    "relations": []
  },
  "salinas": {
    "name": "Salinas",
    "branches": [
      {
        "courseId": "salinas-main",
        "riverId": "Salinas",
        "branch": "main",
        "cellCount": 7
      }
    ],
    "cellCount": 7,
    "outlets": [
      {
        "riverId": "Salinas",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "sampoval-r": {
    "name": "Sampoval R",
    "branches": [
      {
        "courseId": "sampoval-r-main",
        "riverId": "Sampoval R",
        "branch": "main",
        "cellCount": 8
      }
    ],
    "cellCount": 8,
    "outlets": [
      {
        "riverId": "Sampoval R",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "sholes": {
    "name": "Sholes",
    "branches": [
      {
        "courseId": "sholes-main",
        "riverId": "Sholes",
        "branch": "main",
        "cellCount": 4
      }
    ],
    "cellCount": 4,
    "outlets": [
      {
        "riverId": "Sholes",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "st-anns": {
    "name": "St Anns",
    "branches": [
      {
        "courseId": "st-anns-main",
        "riverId": "St Anns",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "St Anns",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Rio Palmas dos Bogas",
          "St Anns"
        ]
      }
    ]
  },
  "subutla": {
    "name": "Subutla",
    "branches": [
      {
        "courseId": "subutla-main",
        "riverId": "Subutla",
        "branch": "main",
        "cellCount": 1
      }
    ],
    "cellCount": 1,
    "outlets": [
      {
        "riverId": "Subutla",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "suere-ou-blewfield-river": {
    "name": "Suere ou Blewfield River",
    "branches": [
      {
        "courseId": "suere-ou-blewfield-river-main",
        "riverId": "Suere ou Blewfield River",
        "branch": "main",
        "cellCount": 6
      }
    ],
    "cellCount": 6,
    "outlets": [
      {
        "riverId": "Suere ou Blewfield River",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "suriname": {
    "name": "Suriname",
    "branches": [
      {
        "courseId": "suriname-main",
        "riverId": "Suriname",
        "branch": "main",
        "cellCount": 6
      },
      {
        "courseId": "suriname-b",
        "riverId": "Suriname_B",
        "branch": "b",
        "cellCount": 10
      }
    ],
    "cellCount": 15,
    "outlets": [
      {
        "riverId": "Suriname_B",
        "type": "sea"
      },
      {
        "riverId": "Suriname",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "Suriname_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Suriname",
        "toRiverId": "Suriname_B"
      },
      {
        "type": "separate",
        "riverIds": [
          "R. Copanama",
          "Suriname_B"
        ]
      }
    ]
  },
  "tabasco-r": {
    "name": "Tabasco R.",
    "branches": [
      {
        "courseId": "tabasco-r-b",
        "riverId": "Tabasco R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "tabasco-r-c",
        "riverId": "Tabasco R_C",
        "branch": "c",
        "cellCount": 6
      },
      {
        "courseId": "tabasco-r-d",
        "riverId": "Tabasco R_D",
        "branch": "d",
        "cellCount": 2
      },
      {
        "courseId": "tabasco-r-e",
        "riverId": "Tabasco R_E",
        "branch": "e",
        "cellCount": 4
      },
      {
        "courseId": "tabasco-r-f",
        "riverId": "Tabasco R_F",
        "branch": "f",
        "cellCount": 3
      },
      {
        "courseId": "tabasco-r-main",
        "riverId": "Tabasco R.",
        "branch": "main",
        "cellCount": 15
      }
    ],
    "cellCount": 26,
    "outlets": [
      {
        "riverId": "Tabasco R.",
        "type": "sea"
      },
      {
        "riverId": "Tabasco R_E",
        "type": "sea"
      },
      {
        "riverId": "Tabasco R_F",
        "type": "sea"
      },
      {
        "riverId": "Tabasco R_C",
        "type": "junction",
        "targetRiverId": "Tabasco R."
      },
      {
        "riverId": "Tabasco R_D",
        "type": "junction",
        "targetRiverId": "Tabasco R_C"
      },
      {
        "riverId": "Tabasco R_B",
        "type": "junction",
        "targetRiverId": "Tabasco R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R_F",
          "Logwood Creek"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Tabasco R_E",
        "toRiverId": "Tabasco R_F"
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R.",
          "Tabasco R_C"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R.",
          "Tabasco R_E"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Tabasco R_C",
        "toRiverId": "Tabasco R_E"
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R_E",
          "Logwood Creek"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R.",
          "Tabasco R_C"
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Tabasco R.",
          "Tabasco R_B"
        ]
      }
    ]
  },
  "tondelo": {
    "name": "Tondelo",
    "branches": [
      {
        "courseId": "tondelo-main",
        "riverId": "Tondelo",
        "branch": "main",
        "cellCount": 2
      }
    ],
    "cellCount": 2,
    "outlets": [
      {
        "riverId": "Tondelo",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "trigu-r": {
    "name": "Trigu R.",
    "branches": [
      {
        "courseId": "trigu-r-main",
        "riverId": "Trigu R.",
        "branch": "main",
        "cellCount": 5
      }
    ],
    "cellCount": 5,
    "outlets": [
      {
        "riverId": "Trigu R.",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Boccades R.",
          "Trigu R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Trigu R.",
          "R Yayrepo_B"
        ]
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Trigu R."
      },
      {
        "type": "fork",
        "fromRiverId": "Rio San Juan",
        "toRiverId": "Trigu R."
      },
      {
        "type": "separate",
        "riverIds": [
          "Boccades R.",
          "Trigu R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Trigu R.",
          "Boccades R_B"
        ]
      }
    ]
  },
  "varacoyari-river": {
    "name": "Varacoyari River",
    "branches": [
      {
        "courseId": "varacoyari-river-main",
        "riverId": "Varacoyari River",
        "branch": "main",
        "cellCount": 10
      }
    ],
    "cellCount": 10,
    "outlets": [
      {
        "riverId": "Varacoyari River",
        "type": "junction",
        "targetRiverId": "Orénoque"
      }
    ],
    "relations": []
  },
  "veragua-r": {
    "name": "Veragua R.",
    "branches": [
      {
        "courseId": "veragua-r-main",
        "riverId": "Veragua R.",
        "branch": "main",
        "cellCount": 3
      }
    ],
    "cellCount": 3,
    "outlets": [
      {
        "riverId": "Veragua R.",
        "type": "sea"
      }
    ],
    "relations": []
  },
  "xagua-r": {
    "name": "Xagua R.",
    "branches": [
      {
        "courseId": "xagua-r-b",
        "riverId": "Xagua R_B",
        "branch": "b",
        "cellCount": 4
      },
      {
        "courseId": "xagua-r-main",
        "riverId": "Xagua R.",
        "branch": "main",
        "cellCount": 10
      }
    ],
    "cellCount": 13,
    "outlets": [
      {
        "riverId": "Xagua R.",
        "type": "sea"
      },
      {
        "riverId": "Xagua R_B",
        "type": "junction",
        "targetRiverId": "Xagua R."
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Xagua R.",
          "Yare R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Xagua R.",
          "Yare R."
        ]
      }
    ]
  },
  "yare-r": {
    "name": "Yare R.",
    "branches": [
      {
        "courseId": "yare-r-main",
        "riverId": "Yare R.",
        "branch": "main",
        "cellCount": 22
      }
    ],
    "cellCount": 22,
    "outlets": [
      {
        "riverId": "Yare R.",
        "type": "sea"
      }
    ],
    "relations": [
      {
        "type": "separate",
        "riverIds": [
          "Xagua R.",
          "Yare R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Xagua R.",
          "Yare R."
        ]
      },
      {
        "type": "separate",
        "riverIds": [
          "Yare R.",
          "N. Segovia River"
        ]
      }
    ]
  }
};

if (typeof window !== 'undefined') window.FLEUVES_DATA = FLEUVES_DATA;
