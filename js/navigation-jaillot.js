// Navigation Jaillot — prototype joueur.
// Calcule une route en coordonnées pixel, en évitant les polygones de terres.

(function () {
  const CONFIG = {
    grillePx: 50,
    grilleApprochePx: 8,
    grilleRegionalePx: 12,
    margeCotePx: 4,
    margeApprochePx: 1,
    margeApprocheIntermediairePx: 2,
    margeTerminalePx: 0,
    rayonMargeFinePx: 20,
    rayonMargeIntermediairePx: 95,
    rayonAccrochePortPx: 260,
    rayonApprochePx: 260,
    rayonCotePx: 90,
    rayonRouteRegionalePx: 700,
    tailleCelluleIndexPx: 256,
    superficieMinPolygoneCotePx2: 297, // Redondo, leeward-islands contour 5/9.
    categorieMaxHautsFonds: 3,
    diagonales: true,
    limiteIterations: 45000,
    pxReferenceDistance: 840,
    millesImperiauxReference: 300,
    metresParMilleImperial: 1609,
    metresParMilleNautique: 1852,
    rayonAttenuationCourantNm: 30,
    porteeDeventementNm: 24,
    demiAngleDeventementDeg: 32,
    facteurMinDeventement: 0.35,
    vitesseMinSegmentNoeuds: 0.25,
    vitesseHeuristiqueNoeuds: 9.5,
    poidsHeuristiqueTemps: 3.0,
    louvoyageDeltas: true,
  };
  const DIRECTIONS_COURANT = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const KMH_TO_KNOTS = 0.539956803;
  const KNOTS_TO_KMH = 1.852;

  let carte = null;
  let pixelToLatLngFn = null;
  let routeLayer = null;
  let terresCache = null;
  let terresIndexCache = null;
  let hautsFondsIndexCache = null;
  let grilleCache = null;
  const navigabiliteCache = new Map();
  const distanceCoteCache = new Map();
  const courantPointCache = new Map();
  const ventPointCache = new Map();
  const tempsSegmentCache = new Map();
  let zonesNavigationIndexCache = null;
  let oceanBoundsIndexCache = null;
  let courantsIndexCache = null;
  let deventementsIndexCache = null;
  let avertissementZonesNavigationExplicites = false;
  let etatNavire = {
    id: null,
    equipage: null,
  };

  function normaliserTexte(str) { return window.RC.normaliser(str); }

  function pointCle(p) {
    return `${Math.round(p.x)},${Math.round(p.y)}`;
  }

  function sourceOscarGrid() {
    if (typeof OSCAR_GRID !== 'undefined' && OSCAR_GRID?.cells) return OSCAR_GRID;
    if (typeof window !== 'undefined' && window.OSCAR_GRID?.cells) return window.OSCAR_GRID;
    return null;
  }

  function oscarCellKey(point) {
    const grid = sourceOscarGrid();
    const cellPx = Number(grid?.cellSizePx) || CONFIG.grillePx;
    return `${Math.floor(point.x / cellPx)}_${Math.floor(point.y / cellPx)}`;
  }

  function memePoint(a, b) {
    return !!a && !!b && distance(a, b) < 0.001;
  }

  function segmentCle(a, b) {
    return `${coordCle(a.x)},${coordCle(a.y)}>${coordCle(b.x)},${coordCle(b.y)}`;
  }

  function coordCle(v) {
    return Math.round(v * 100) / 100;
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function deltasNavigation() {
    const base = CONFIG.diagonales
      ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
      : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    if (!CONFIG.louvoyageDeltas) return base;
    return base.concat([
      [6, 2], [6, -2], [-6, 2], [-6, -2],
    ]);
  }

  function millesNautiquesParPx() {
    return (CONFIG.millesImperiauxReference * CONFIG.metresParMilleImperial / CONFIG.metresParMilleNautique)
      / CONFIG.pxReferenceDistance;
  }

  function distanceNm(a, b) {
    return distance(a, b) * millesNautiquesParPx();
  }

  function rayonAttenuationCourantPx() {
    return CONFIG.rayonAttenuationCourantNm / millesNautiquesParPx();
  }

  function vitesseNavireMoyenneNoeuds() {
    const navire = navireActif();
    const vitesse = Number(navire.navigation?.vitesse_naive);
    if (Number.isFinite(vitesse) && vitesse > 0) return vitesseModifieeNoeuds(vitesse);
    throw new Error('Navire \u00ab\u00a0' + (navire.nom || navire.id || '?') + '\u00a0\u00bb : vitesse_naive manquante ou invalide.');
  }

  function coutTransitionTerminaleHeures(a, b) {
    const d = distance(a, b);
    if (d > CONFIG.rayonApprochePx) return Infinity;
    return distanceNm(a, b) / Math.max(CONFIG.vitesseMinSegmentNoeuds, vitesseNavireMoyenneNoeuds());
  }

  function segmentToucheTerminal(a, b) {
    return !Number.isFinite(a?.gx) || !Number.isFinite(a?.gy)
      || !Number.isFinite(b?.gx) || !Number.isFinite(b?.gy);
  }

  // Retourne true si un modificateur de routage de niveau donné est actif.
  // En mode MJ sans test : toujours true. En mode joueur/test : niveauNavigation >= niveau requis.
  function modificateurActif(niveauRequis) {
    const mjSansTest = typeof modeMJ !== 'undefined' && modeMJ
      && typeof testNiveauNavActif !== 'undefined' && !testNiveauNavActif;
    if (mjSansTest) return true;
    const nav = typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0;
    return nav >= niveauRequis;
  }

  function ventDominant() {
    if (typeof CARTE_VENT_DOMINANT !== 'undefined') return CARTE_VENT_DOMINANT;
    return {
      id: 'alizes-atlantiques',
      label: 'Alizes atlantiques',
      direction: 'NNE',
      speedKnots: 15,
    };
  }

  function angleDegEntreVecteurs(a, b) {
    const la = Math.hypot(a.x, a.y);
    const lb = Math.hypot(b.x, b.y);
    if (la < 0.000001 || lb < 0.000001) return 0;
    const dot = (a.x * b.x + a.y * b.y) / (la * lb);
    return Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI;
  }

  function allureDepuisAngleVent(angle) {
    if (angle < 45) return 'boutAuVent';
    if (angle < 90) return 'pres';
    if (angle < 135) return 'largue';
    if (angle < 179.5) return 'grand_largue';
    return 'vent_arriere';
  }

  function vitesseNavireAllureNoeuds(allure) {
    if (allure === 'boutAuVent') return 0;
    const navire = navireActif();
    const nav = navire.navigation || {};
    const vitesse = Number(nav[allure]);
    if (Number.isFinite(vitesse) && vitesse > 0) return vitesseModifieeNoeuds(vitesse);
    // vent_arriere peut utiliser grand_largue comme repli documente
    if (allure === 'vent_arriere') {
      const grandLargue = Number(nav.grand_largue);
      if (Number.isFinite(grandLargue) && grandLargue > 0) return vitesseModifieeNoeuds(grandLargue);
    }
    throw new Error('Navire \u00ab\u00a0' + (navire.nom || navire.id || '?') + '\u00a0\u00bb : vitesse d\u2019allure \u00ab\u00a0' + allure + '\u00a0\u00bb manquante.');
  }

  function allureSegment(a, b, point) {
    const vent = ventEnPoint(point);
    if (!vent) return { allure: null, angleVentDeg: null }; // Nav < 2 : pas de vent, pas d'allure
    const souffle = vent.vecteur;
    if (!souffle) return { allure: 'largue', angleVentDeg: 90 };
    const route = { x: b.x - a.x, y: b.y - a.y };
    const provenanceVent = { x: -souffle.x, y: -souffle.y };
    const angle = angleDegEntreVecteurs(route, provenanceVent);
    return {
      allure: allureDepuisAngleVent(angle),
      angleVentDeg: angle,
    };
  }

  function vitesseVoileSegmentNoeuds(a, b, point) {
    const { allure } = allureSegment(a, b, point);
    if (allure === null) return vitesseNavireMoyenneNoeuds(); // Nav < 2 : vitesse naive directe
    return vitesseNavireAllureNoeuds(allure);
  }

  function vitesseModifieeNoeuds(vitesse) {
    const base = Number(vitesse);
    if (!Number.isFinite(base) || base <= 0) return base;
    const mod = modificateurVitesseNavireNoeuds();
    return Math.max(CONFIG.vitesseMinSegmentNoeuds, base + mod);
  }

  function modificateurVitesseNavireNoeuds() {
    return modificateurVitesseActuelNoeuds();
  }

  function projectionCourantAuPointNoeuds(a, b, point) {
    const composantes = composantesCourantSegmentNoeuds(a, b, point);
    return composantes ? composantes.parallele : 0;
  }

  function vecteurCourantNoeuds(point) {
    const courant = courantEnPoint(point);
    if (!courant?.vecteur) return { x: 0, y: 0 };
    return {
      x: courant.vecteur.x,
      y: courant.vecteur.y,
    };
  }

  function composantesCourantSegmentNoeuds(a, b, point) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.000001) return null;
    const ux = dx / len;
    const uy = dy / len;
    const courant = vecteurCourantNoeuds(point);
    return {
      parallele: courant.x * ux + courant.y * uy,
      laterale: courant.x * -uy + courant.y * ux,
    };
  }

  function projectionCourantNoeuds(a, b) {
    return projectionCourantAuPointNoeuds(a, b, {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    });
  }

  function compensationCourantSegment(a, b, point, vitesseNavire = vitesseVoileSegmentNoeuds(a, b, point)) {
    const composantes = composantesCourantSegmentNoeuds(a, b, point);
    if (!composantes) {
      return {
        possible: true,
        vitesseSolNoeuds: 0,
        courantParalleleNoeuds: 0,
        courantLateralNoeuds: 0,
        navireAvantNoeuds: 0,
        navireCorrectionNoeuds: 0,
      };
    }

    const lateralAbs = Math.abs(composantes.laterale);
    if (lateralAbs > vitesseNavire) {
      return {
        possible: false,
        vitesseSolNoeuds: -Infinity,
        courantParalleleNoeuds: composantes.parallele,
        courantLateralNoeuds: composantes.laterale,
        navireAvantNoeuds: 0,
        navireCorrectionNoeuds: -composantes.laterale,
      };
    }

    const navireAvant = Math.sqrt(Math.max(0, vitesseNavire * vitesseNavire - lateralAbs * lateralAbs));
    return {
      possible: true,
      vitesseSolNoeuds: navireAvant + composantes.parallele,
      courantParalleleNoeuds: composantes.parallele,
      courantLateralNoeuds: composantes.laterale,
      navireAvantNoeuds: navireAvant,
      navireCorrectionNoeuds: -composantes.laterale,
    };
  }

  function vitesseEffectiveSegmentNoeuds(a, b, point) {
    const vitesseNavire = vitesseVoileSegmentNoeuds(a, b, point);
    if (vitesseNavire <= CONFIG.vitesseMinSegmentNoeuds) return -Infinity;
    const compensation = compensationCourantSegment(a, b, point, vitesseNavire);
    return compensation.possible ? compensation.vitesseSolNoeuds : -Infinity;
  }

  function tempsSegmentHeures(a, b) {
    const cacheKey = segmentCle(a, b);
    if (tempsSegmentCache.has(cacheKey)) return tempsSegmentCache.get(cacheKey);
    const px = distance(a, b);
    if (px <= 0) return 0;
    const parts = Math.max(1, Math.ceil(px / CONFIG.grillePx));
    const nmParPart = distanceNm(a, b) / parts;
    let total = 0;
    for (let i = 0; i < parts; i++) {
      const t = (i + 0.5) / parts;
      const point = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
      const vitesse = vitesseEffectiveSegmentNoeuds(a, b, point);
      if (vitesse <= CONFIG.vitesseMinSegmentNoeuds) {
        if (segmentToucheTerminal(a, b)) {
          const transition = coutTransitionTerminaleHeures(a, b);
          if (Number.isFinite(transition)) {
            tempsSegmentCache.set(cacheKey, transition);
            return transition;
          }
        }
        tempsSegmentCache.set(cacheKey, Infinity);
        return Infinity;
      }
      total += nmParPart / vitesse;
    }
    tempsSegmentCache.set(cacheKey, total);
    return total;
  }

  function heuristiqueTemps(a, b) {
    return distanceNm(a, b) / CONFIG.vitesseHeuristiqueNoeuds;
  }

  function scoreHeuristiqueTemps(a, b) {
    return heuristiqueTemps(a, b) * CONFIG.poidsHeuristiqueTemps;
  }

  function distPointSegment(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    if (!len2) return distance(p, a);
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }

  function distSegmentSegment(a, b, c, d) {
    if (segmentsIntersectent(a, b, c, d)) return 0;
    return Math.min(
      distPointSegment(a, c, d),
      distPointSegment(b, c, d),
      distPointSegment(c, a, b),
      distPointSegment(d, a, b)
    );
  }

  function orientation(a, b, c) {
    const v = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    if (Math.abs(v) < 0.000001) return 0;
    return v > 0 ? 1 : 2;
  }

  function surSegment(a, b, c) {
    return b.x <= Math.max(a.x, c.x) && b.x >= Math.min(a.x, c.x)
      && b.y <= Math.max(a.y, c.y) && b.y >= Math.min(a.y, c.y);
  }

  function segmentsIntersectent(a, b, c, d) {
    const o1 = orientation(a, b, c);
    const o2 = orientation(a, b, d);
    const o3 = orientation(c, d, a);
    const o4 = orientation(c, d, b);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && surSegment(a, c, b)) return true;
    if (o2 === 0 && surSegment(a, d, b)) return true;
    if (o3 === 0 && surSegment(c, a, d)) return true;
    if (o4 === 0 && surSegment(c, b, d)) return true;
    return false;
  }

  function pointDansPolygone(point, poly) {
    let dedans = false;
    for (let i = 0, j = poly.points.length - 1; i < poly.points.length; j = i++) {
      const pi = poly.points[i];
      const pj = poly.points[j];
      const croise = ((pi.y > point.y) !== (pj.y > point.y))
        && (point.x < (pj.x - pi.x) * (point.y - pi.y) / ((pj.y - pi.y) || 0.000001) + pi.x);
      if (croise) dedans = !dedans;
    }
    return dedans;
  }

  function pointDansAnneauSea(point, ring) {
    let dedans = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const pi = { x: ring[i][0], y: ring[i][1] };
      const pj = { x: ring[j][0], y: ring[j][1] };
      const croise = ((pi.y > point.y) !== (pj.y > point.y))
        && (point.x < (pj.x - pi.x) * (point.y - pi.y) / ((pj.y - pi.y) || 0.000001) + pi.x);
      if (croise) dedans = !dedans;
    }
    return dedans;
  }

  function polygonesZoneSea(zone) {
    if (Array.isArray(zone)) return [{ exterior: zone, holes: [] }];
    if (zone && Array.isArray(zone.polygons)) {
      return zone.polygons.map(polygoneZoneSea).filter(poly => poly.exterior.length >= 3);
    }
    const poly = polygoneZoneSea(zone);
    return poly.exterior.length >= 3 ? [poly] : [];
  }

  function polygoneZoneSea(zone) {
    if (Array.isArray(zone)) return { exterior: zone, holes: [] };
    if (!zone || !Array.isArray(zone.exterior)) return { exterior: [], holes: [] };
    const trous = Array.isArray(zone.holes) ? zone.holes : (Array.isArray(zone.hole) ? [zone.hole] : []);
    return {
      exterior: zone.exterior,
      holes: trous.filter(ring => Array.isArray(ring) && ring.length >= 3),
    };
  }

  function anneauxZoneSea(zone) {
    return polygonesZoneSea(zone)
      .flatMap(poly => [poly.exterior, ...poly.holes])
      .filter(ring => Array.isArray(ring) && ring.length >= 3);
  }

  function bboxAnneauxSea(anneaux) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    anneaux.forEach(ring => {
      ring.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });
    return { minX, minY, maxX, maxY };
  }

  // Courants visibles par le calculateur selon niveauNavigation.
  // En mode MJ sans test actif : tous les courants (connaissance totale).
  // En mode joueur ou test MJ : seulement ceux dont visibiliteNav <= niveauNavigation.
  function sourceCourantsCalculateur() {
    if (typeof SEA_CURRENTS === 'undefined') return [];
    const mjSansTest = typeof modeMJ !== 'undefined' && modeMJ
      && typeof testNiveauNavActif !== 'undefined' && !testNiveauNavActif;
    if (mjSansTest) return SEA_CURRENTS;
    const nav = typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0;
    return SEA_CURRENTS.filter(c => (c.visibiliteNav ?? 0) <= nav);
  }

  function zonesNavigationExplicites() {
    const flag = typeof SEA_NAV_ZONES_EXPLICITES !== 'undefined' && !!SEA_NAV_ZONES_EXPLICITES;
    if (!flag) return false;
    const zones = sourceZonesNavigationCalculateur();
    const oceanBounds = sourceOceanBoundsCalculateur();
    if (zones.length > 0 || oceanBounds.length > 0) return true;
    if (!avertissementZonesNavigationExplicites && typeof console !== 'undefined') {
      avertissementZonesNavigationExplicites = true;
      console.warn('[NavigationJaillot] SEA_NAV_ZONES_EXPLICITES=true mais SEA_NAV_ZONES et SEA_OCEAN_BOUNDS sont vides: repli compatible, navigation non bornee par emprise maritime.');
    }
    return false;
  }

  function sourceZonesNavigationCalculateur() {
    if (typeof SEA_NAV_ZONES !== 'undefined' && Array.isArray(SEA_NAV_ZONES)) return SEA_NAV_ZONES;
    return [];
  }

  function sourceOceanBoundsCalculateur() {
    if (typeof SEA_OCEAN_BOUNDS !== 'undefined' && Array.isArray(SEA_OCEAN_BOUNDS)) return SEA_OCEAN_BOUNDS;
    return [];
  }

  function modeNavigationMaritime() {
    const flagZonesExplicites = typeof SEA_NAV_ZONES_EXPLICITES !== 'undefined' && !!SEA_NAV_ZONES_EXPLICITES;
    const zones = sourceZonesNavigationCalculateur();
    const oceanBounds = sourceOceanBoundsCalculateur();
    return {
      zonesExplicites: zonesNavigationExplicites(),
      flagZonesExplicites,
      compatLegacy: !flagZonesExplicites,
      nbZonesNavigation: zones.length,
      nbOceanBounds: oceanBounds.length,
      fallbackCalmeOceanBounds: flagZonesExplicites && oceanBounds.length > 0,
      nbCourants: sourceCourantsCalculateur().length,
    };
  }

  function getZonesNavigationIndex() {
    if (zonesNavigationIndexCache) return zonesNavigationIndexCache;
    const source = sourceZonesNavigationCalculateur();
    zonesNavigationIndexCache = source.map(zone => {
      const anneaux = anneauxZoneSea(zone.zone);
      return {
        zone,
        bbox: bboxAnneauxSea(anneaux),
      };
    });
    return zonesNavigationIndexCache;
  }

  function getOceanBoundsIndex() {
    if (oceanBoundsIndexCache) return oceanBoundsIndexCache;
    const source = sourceOceanBoundsCalculateur();
    oceanBoundsIndexCache = source.map(bounds => {
      const anneaux = anneauxZoneSea(bounds.zone);
      return {
        bounds,
        bbox: bboxAnneauxSea(anneaux),
      };
    });
    return oceanBoundsIndexCache;
  }

  function getCourantsIndex() {
    if (courantsIndexCache) return courantsIndexCache;
    const source = sourceCourantsCalculateur();
    courantsIndexCache = source.map(courant => {
      const points = courant.centerline || [];
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      return {
        courant,
        bbox: points.length ? {
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
        } : { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
      };
    });
    return courantsIndexCache;
  }

  function pointDansZoneSea(point, zone) {
    return polygonesZoneSea(zone).some(poly => (
      pointDansAnneauSea(point, poly.exterior)
      && !poly.holes.some(trou => pointDansAnneauSea(point, trou))
    ));
  }

  function zonesNavigationAuPoint(point) {
    return getZonesNavigationIndex()
      .filter(({ bbox }) => point.x >= bbox.minX && point.x <= bbox.maxX
        && point.y >= bbox.minY && point.y <= bbox.maxY)
      .map(({ zone }) => zone)
      .filter(zone => pointDansZoneSea(point, zone.zone));
  }

  function zoneNavigationEnPoint(point) {
    const zones = zonesNavigationAuPoint(point);
    return zones[0] || null;
  }

  function pointDansOceanBounds(point) {
    return getOceanBoundsIndex()
      .filter(({ bbox }) => point.x >= bbox.minX && point.x <= bbox.maxX
        && point.y >= bbox.minY && point.y <= bbox.maxY)
      .some(({ bounds }) => pointDansZoneSea(point, bounds.zone));
  }

  function pointDansZoneNavigation(point) {
    // TODO PN-SEA-EXPLICIT: quand la mosaïque maritime sera complete,
    // supprimer le repli "true" et exiger une zone explicite partout.
    if (!zonesNavigationExplicites()) return true;
    const oceanBounds = sourceOceanBoundsCalculateur();
    if (oceanBounds.length) return pointDansOceanBounds(point);
    return !!zoneNavigationEnPoint(point);
  }

  function segmentDansZonesNavigation(a, b) {
    // TODO PN-SEA-EXPLICIT: ce garde-fou deviendra la regle principale
    // d'autorisation de navigation, a la place du masque "tout sauf terres".
    if (!zonesNavigationExplicites()) return true;
    const px = distance(a, b);
    const parts = Math.max(1, Math.ceil(px / Math.max(8, CONFIG.grilleApprochePx * 2)));
    for (let i = 0; i <= parts; i++) {
      const t = parts ? i / parts : 0;
      const point = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
      if (!pointDansZoneNavigation(point)) return false;
    }
    return true;
  }

  // ── Restrictions de navigation par type de zone (fluviale/côtière/hauturière) ──
  // TODO PN-NAVZONE: classification géographique pas encore construite (chantier
  // séparé, distinct de SEA_NAV_ZONES/oceanBounds qui servent aux courants OSCAR).
  // Tant qu'elle n'existe pas, cette fonction renvoie systématiquement null : les
  // interdictions et malus de restrictionNav restent inertes mais déjà câblés.
  function typeZoneNavigationEnPoint(point) {
    return null;
  }

  const LABELS_ZONE_NAV = { fluviale: 'fluviale', cotiere: 'côtière', hauturiere: 'hauturière' };

  // Valeur de restrictionNav pour une zone donnée : 0/absent = libre, nombre négatif
  // = malus Manœuvrabilité, 'interdit' = accès refusé. typeZone=null (zone inconnue,
  // classification pas encore disponible) => toujours considéré libre.
  function restrictionNavPourZone(navire, typeZone) {
    if (!typeZone) return 0;
    const valeur = navire?.restrictionNav?.[typeZone];
    return valeur === undefined ? 0 : valeur;
  }

  function segmentRestrictionInterdite(a, b, navire = navireActif()) {
    if (!navire?.restrictionNav) return false;
    const px = distance(a, b);
    const parts = Math.max(1, Math.ceil(px / Math.max(8, CONFIG.grilleApprochePx * 2)));
    for (let i = 0; i <= parts; i++) {
      const t = parts ? i / parts : 0;
      const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      const typeZone = typeZoneNavigationEnPoint(point);
      if (restrictionNavPourZone(navire, typeZone) === 'interdit') return true;
    }
    return false;
  }

  function libelleRestrictionNav(navire) {
    const restrictions = navire?.restrictionNav;
    if (restrictions && typeof restrictions === 'object') {
      const entrees = Object.entries(restrictions).filter(([, v]) => v !== 0 && v !== undefined);
      if (!entrees.length) return 'Aucune';
      return entrees.map(([zone, valeur]) => {
        const label = LABELS_ZONE_NAV[zone] || zone;
        if (valeur === 'interdit') return `${label} : interdite`;
        const malus = Number(valeur);
        return `${label} : malus ${Number.isFinite(malus) ? malus : valeur}`;
      }).join(' · ');
    }
    // Repli sur l'ancien modèle (regionRestriction/malusHauturier) tant que tous
    // les navires n'ont pas été migrés vers restrictionNav.
    return navire?.malusHauturier ? 'Malus en haute mer' : 'Aucune';
  }

  function directionVersVecteur(direction, force = 1) {
    const index = DIRECTIONS_COURANT.indexOf(direction);
    if (index < 0) return null;
    // Les directions de sea-data.js sont encodees en provenance : un courant N vient du nord et porte vers le sud.
    const angle = (index * 22.5 + 90) * Math.PI / 180;
    return {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
    };
  }

  function vecteurVersDirection(vecteur) {
    if (!vecteur || Math.hypot(vecteur.x, vecteur.y) < 0.000001) return null;
    const angle = (Math.atan2(vecteur.y, vecteur.x) * 180 / Math.PI + 450) % 360;
    return DIRECTIONS_COURANT[Math.round(angle / 22.5) % 16];
  }

  function porteeDeventementPx(config = {}) {
    const porteeNm = Number(config.porteeNm ?? CONFIG.porteeDeventementNm);
    return (Number.isFinite(porteeNm) ? porteeNm : CONFIG.porteeDeventementNm) / millesNautiquesParPx();
  }

  function configDeventement(valeur) {
    const base = ventDominant().deventement || {};
    if (valeur && typeof valeur === 'object') {
      return { ...base, ...valeur };
    }
    return base;
  }

  function pointPlusProcheSegment(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    if (!len2) return a;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    return {
      x: a.x + t * dx,
      y: a.y + t * dy,
    };
  }

  function getDeventementsIndex() {
    if (deventementsIndexCache) return deventementsIndexCache;
    const juridictions = typeof JURIDICTIONS !== 'undefined' ? JURIDICTIONS : [];
    const zones = typeof ZONES_DATA !== 'undefined' ? ZONES_DATA : {};
    deventementsIndexCache = juridictions.flatMap(juridiction => {
      if (!juridiction.deventement) return [];
      const source = zones[juridiction.id] || (Array.isArray(juridiction.zone) ? [juridiction.zone] : []);
      const config = configDeventement(juridiction.deventement);
      const porteePx = porteeDeventementPx(config);
      return source.map(normaliserContour).filter(points => points && points.length >= 3).map(points => {
        const pts = points.map(([x, y]) => ({ x, y }));
        const xs = pts.map(p => p.x);
        const ys = pts.map(p => p.y);
        return {
          id: juridiction.id,
          nom: juridiction.nom,
          points: pts,
          config,
          porteePx,
          bbox: {
            minX: Math.min(...xs) - porteePx,
            maxX: Math.max(...xs) + porteePx,
            minY: Math.min(...ys) - porteePx,
            maxY: Math.max(...ys) + porteePx,
          },
        };
      });
    });
    return deventementsIndexCache;
  }

  function facteurDeventementPoint(point, souffle) {
    if (!modificateurActif(3)) return 1; // Nav < 3 : deventement ignore
    const deventements = getDeventementsIndex();
    if (!deventements.length || !souffle || Math.hypot(souffle.x, souffle.y) < 0.000001) return 1;
    let facteur = 1;
    deventements.forEach(zone => {
      if (!bboxCroise(point, point, zone.bbox, 0)) return;
      if (pointDansPolygone(point, zone)) return;

      let meilleureDist = Infinity;
      let origine = null;
      for (let i = 0; i < zone.points.length; i++) {
        const a = zone.points[i];
        const b = zone.points[(i + 1) % zone.points.length];
        const candidat = pointPlusProcheSegment(point, a, b);
        const d = distance(point, candidat);
        if (d < meilleureDist) {
          meilleureDist = d;
          origine = candidat;
        }
      }
      if (!origine || meilleureDist > zone.porteePx) return;

      const depuisTerre = { x: point.x - origine.x, y: point.y - origine.y };
      const angle = angleDegEntreVecteurs(depuisTerre, souffle);
      const demiAngle = Number(zone.config.demiAngleDeg ?? CONFIG.demiAngleDeventementDeg);
      if (angle > demiAngle) return;

      const min = Number(zone.config.facteurMin ?? CONFIG.facteurMinDeventement);
      const facteurMin = Number.isFinite(min) ? Math.max(0, Math.min(1, min)) : CONFIG.facteurMinDeventement;
      const distanceFactor = Math.max(0, Math.min(1, meilleureDist / zone.porteePx));
      const angleFactor = Math.max(0, Math.min(1, angle / Math.max(1, demiAngle)));
      const attenuation = facteurMin + (1 - facteurMin) * Math.max(distanceFactor, angleFactor * 0.65);
      facteur = Math.min(facteur, attenuation);
    });
    return facteur;
  }

  function ventEnPoint(point) {
    if (!modificateurActif(2)) return null; // Nav < 2 : vent ignore, vitesse nue
    const cacheKey = pointCle(point);
    if (ventPointCache.has(cacheKey)) return ventPointCache.get(cacheKey);
    const vent = ventDominant();
    const speedKnotsBase = Number(vent.speedKnots ?? vent.force ?? 0) || 0;
    const direction = vent.direction || 'NNE';
    const souffleBase = directionVersVecteur(direction, speedKnotsBase);
    if (!souffleBase) {
      ventPointCache.set(cacheKey, null);
      return null;
    }
    const facteur = facteurDeventementPoint(point, souffleBase);
    const vecteur = {
      x: souffleBase.x * facteur,
      y: souffleBase.y * facteur,
    };
    const resultat = {
      ...vent,
      direction,
      speedKnots: Math.hypot(vecteur.x, vecteur.y),
      speedKnotsBase,
      facteurDeventement: facteur,
      vecteur,
    };
    ventPointCache.set(cacheKey, resultat);
    return resultat;
  }

  function segmentCourantAuPoint(courant, point) {
    return segmentCourantProche(courant, point).index;
  }

  function segmentCourantProche(courant, point) {
    const cl = courant.centerline || [];
    if (cl.length < 2) return { index: 0, point: null, distance: Infinity };

    let meilleurIdx = 0;
    let meilleurPoint = null;
    let meilleureDist = Infinity;
    const segmentCount = courant.closed ? cl.length : cl.length - 1;
    for (let i = 0; i < segmentCount; i++) {
      const a = { x: cl[i][0], y: cl[i][1] };
      const b = { x: cl[(i + 1) % cl.length][0], y: cl[(i + 1) % cl.length][1] };
      const proche = pointPlusProcheSegment(point, a, b);
      const d = distance(point, proche);
      if (d < meilleureDist) {
        meilleureDist = d;
        meilleurIdx = i;
        meilleurPoint = proche;
      }
    }
    return { index: meilleurIdx, point: meilleurPoint, distance: meilleureDist };
  }

  function directionCourantAuPoint(courant, point) {
    const cl = courant.centerline || [];
    if (!cl.length) return courant.directions?.[0] || null;
    if (cl.length === 1) return courant.directions?.[0] || null;
    const index = segmentCourantAuPoint(courant, point);
    return courant.directions?.[index] || courant.directions?.[courant.directions.length - 1] || null;
  }

  function vitesseZoneNavigationNoeuds(zone) {
    if (!zone) return 0;
    const knots = Number(zone.speedKnot ?? zone.speedKnots);
    if (Number.isFinite(knots) && knots >= 0) return knots;
    // TODO PN-SEA-EXPLICIT: supprimer les replis km/h avec l'ancien sea-data.js.
    // Le nouveau contrat stocke uniquement speedKnot dans les zones maritimes.
    const kmh = Number(zone.speedKmh ?? zone.vitesseKmh);
    if (Number.isFinite(kmh) && kmh >= 0) return kmh * KMH_TO_KNOTS;
    return 0;
  }

  function courantTraverseZone(courant, zone, point) {
    if (!zone) return false;
    const proche = segmentCourantProche(courant, point);
    return !!proche.point && pointDansZoneSea(proche.point, zone.zone);
  }

  function courantsZoneAuPoint(point, zone) {
    if (!zone) return [];
    return getCourantsIndex()
      .map(({ courant }) => courant)
      .filter(courant => courantTraverseZone(courant, zone, point));
  }

  function courantsAuPoint(point) {
    const zone = zoneNavigationEnPoint(point);
    return courantsZoneAuPoint(point, zone);
  }

  function courantEnPoint(point) {
    if (!modificateurActif(1)) return null; // Nav < 1 : aucun courant connu
    const cacheKey = pointCle(point);
    if (courantPointCache.has(cacheKey)) return courantPointCache.get(cacheKey);
    if (pointDansHautFond(point)) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const grid = sourceOscarGrid();
    if (!grid) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const cellKey = oscarCellKey(point);
    const cell = grid.cells[cellKey];
    if (!cell) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const x = Number(cell.xKnot);
    const y = Number(cell.yKnot);
    const vitesseNoeudsResultat = Number(cell.speedKnot ?? Math.hypot(x, y));
    if (!Number.isFinite(x) || !Number.isFinite(y)
      || !Number.isFinite(vitesseNoeudsResultat) || vitesseNoeudsResultat <= 0) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const vecteur = { x, y };
    const resultat = {
      zoneId: null,
      zoneNom: 'OSCAR',
      typeZone: 'haute-mer',
      cellKey,
      speedKnot: vitesseNoeudsResultat,
      speedKnots: vitesseNoeudsResultat, // TODO PN-SEA-EXPLICIT: alias legacy UI, supprimer apres migration.
      speedKmh: vitesseNoeudsResultat * KNOTS_TO_KMH,
      distanceCoteNm: distanceCotePointNm(point),
      direction: vecteurVersDirection(vecteur),
      dirToDeg: Number.isFinite(Number(cell.dirToDeg)) ? Number(cell.dirToDeg) : null,
      vecteur,
      courants: [{
        id: cellKey,
        nom: `OSCAR ${cellKey}`,
        speedKnot: vitesseNoeudsResultat,
        speedKnots: vitesseNoeudsResultat, // TODO PN-SEA-EXPLICIT: alias legacy UI, supprimer apres migration.
        maxSpeedKnot: Number.isFinite(Number(cell.maxSpeedKnot)) ? Number(cell.maxSpeedKnot) : null,
        sources: Number.isFinite(Number(cell.sources)) ? Number(cell.sources) : null,
      }],
    };
    courantPointCache.set(cacheKey, resultat);
    return resultat;
  }

  function navireActif() {
    if (typeof CARTE_NAVIRE === 'undefined')
      throw new Error('CARTE_NAVIRE absent — vérifier carte-data.js.');
    const id = CARTE_NAVIRE.navireId;
    if (!id)
      throw new Error('CARTE_NAVIRE.navireId manquant — définir l\u2019id du navire dans carte-data.js.');
    if (typeof SHIPS_DATA === 'undefined' || !Array.isArray(SHIPS_DATA))
      throw new Error('SHIPS_DATA absent — vérifier ships-data.js.');
    const ship = SHIPS_DATA.find(s => s.id === id);
    if (!ship)
      throw new Error('Navire \u00ab ' + id + ' \u00bb introuvable dans SHIPS_DATA — vérifier ships-data.js.');
    return ship;
  }
  function categorieTailleNavire(navire = navireActif()) {
    // Court-circuit test MJ : categorieTailleTest > 0 force la categorie simulee
    if (typeof categorieTailleTest !== 'undefined' && categorieTailleTest > 0) return categorieTailleTest;
    const categorie = Number(navire.categorieTaille);
    if (Number.isFinite(categorie) && categorie > 0) return categorie;
    throw new Error('Navire ' + (navire.nom || navire.id || '?') + ' : categorieTaille manquante ou invalide.');
  }

  function niveauCatalogueNavire() {
    const mjSansTest = typeof modeMJ !== 'undefined' && modeMJ
      && typeof testNiveauNavActif !== 'undefined' && !testNiveauNavActif;
    if (mjSansTest) return 5;
    const nav = typeof niveauNavigation !== 'undefined' ? Number(niveauNavigation) : 0;
    return Math.max(0, Math.min(5, Number.isFinite(nav) ? nav : 0));
  }

  function accesPiloteAutomatique() {
    // TODO PN-NAV-OUVERTURE: la navigation sera librement accessible dès Nav 0 une fois
    // le chantier en cours stabilisé (Manœuvrabilité, toilage, restrictions de zone).
    // En attendant, restreint au mode MJ pour ne pas exposer une fonctionnalité incomplète
    // aux joueurs. Repasser à `return true;` quand le chantier sera prêt.
    return typeof modeMJ !== 'undefined' && !!modeMJ;
  }

  function etatNavireActif(navire = navireActif()) {
    if (etatNavire.id !== navire.id) {
      etatNavire = etatNavireParDefaut(navire);
    }
    return etatNavire;
  }

  function etatNavireParDefaut(navire) {
    const niveau = niveauCatalogueNavire();
    const tonnage = accesChampNavire('tonnage_occupe_utile', niveau) && Number.isFinite(Number(navire.tonnage?.utile))
      ? Number(navire.tonnage?.utile)
      : Number(navire.tonnage?.total);
    const defaults = defaultsNavigationNavire(navire);
    const encombrementPct = Number(defaults.encombrementPct);
    const tonnageOccupe = Number.isFinite(encombrementPct) && Number.isFinite(tonnage)
      ? Math.round((tonnage * Math.max(0, Math.min(100, encombrementPct)) / 100) * 10) / 10
      : (Number.isFinite(tonnage) ? Math.round(tonnage * 50) / 100 : 0);
    return {
      id: navire.id,
      equipage: Number(defaults.equipageActuel) || Number(navire.equipage?.standard) || Number(navire.equipage?.min) || 0,
      tonnageOccupe,
      carenage: normaliserCarenage(defaults.carenage),
      toilage: normaliserToilage(defaults.toilage),
      deriveLevee: !!defaults.deriveLevee,
    };
  }

  function defaultsNavigationNavire(navire) {
    const carteNavire = typeof CARTE_NAVIRE !== 'undefined' ? CARTE_NAVIRE : null;
    if (navire.id === 'navire-pj' && carteNavire?.navigation) return carteNavire.navigation;
    return navire.etatNavigation || {};
  }

  function normaliserCarenage(valeur) {
    return valeur === 'recent' || valeur === 'ancien' ? valeur : 'normal';
  }

  function normaliserToilage(valeur) {
    return Object.prototype.hasOwnProperty.call(TOILAGE_OPTIONS, valeur) ? valeur : null;
  }

  function limiteTonnageOccupeNavire(navire, niveau = niveauCatalogueNavire()) {
    const utile = Number(navire.tonnage?.utile);
    const total = Number(navire.tonnage?.total);
    return accesChampNavire('tonnage_occupe_utile', niveau) && Number.isFinite(utile) ? utile : total;
  }

  function encombrementNavirePct(navire = navireActif(), etat = etatNavireActif(navire), niveau = niveauCatalogueNavire()) {
    const limite = limiteTonnageOccupeNavire(navire, niveau);
    const occupe = Number(etat.tonnageOccupe);
    if (!Number.isFinite(limite) || limite <= 0 || !Number.isFinite(occupe)) return null;
    return Math.max(0, Math.round((occupe / limite) * 100));
  }

  function carenageApplicableNavire(navire = navireActif()) {
    const categorie = typeof categorieTailleNavire === 'function'
      ? Number(categorieTailleNavire())
      : Number(navire.categorieTaille);
    return Number.isFinite(categorie) && categorie >= 2;
  }

  function categorieOverrideActive(navire = navireActif()) {
    const test = typeof categorieTailleTest !== 'undefined' ? Number(categorieTailleTest) : 0;
    const standard = Number(navire.categorieTaille);
    return Number.isFinite(test) && test > 0 && Number.isFinite(standard) && test !== standard;
  }

  function libelleNavireBouton(navire = navireActif()) {
    return `${designationNavire(navire)}${categorieOverrideActive(navire) ? '*' : ''}`;
  }

  function majBoutonsNavire() {
    let navire = null;
    try {
      navire = navireActif();
    } catch (err) {
      return;
    }
    const override = categorieOverrideActive(navire);
    document.querySelectorAll('[data-navire-bouton]').forEach(btn => {
      btn.textContent = libelleNavireBouton(navire);
      btn.classList.toggle('navire-override', override);
      btn.title = override ? 'Catégorie simulée par Test MJ' : 'Choisir le navire';
    });
    document
      .querySelectorAll('#nav-jaillot-cat-val, #nav-modale-cat-val')
      .forEach(input => {
        input.classList.toggle('navire-override', override);
        input.title = override ? 'Catégorie simulée différente du navire actif' : '';
      });
  }

  function definirNavireActif(id) {
    const navire = typeof window.getShipById === 'function'
      ? window.getShipById(id)
      : (Array.isArray(window.SHIPS_DATA) ? window.SHIPS_DATA.find(s => s.id === id) : null);
    if (!navire) return null;
    if (typeof CARTE_NAVIRE !== 'undefined') {
      CARTE_NAVIRE.navireId = navire.id;
      CARTE_NAVIRE.nom = navire.nom;
      CARTE_NAVIRE.designation = navire.designation || navire.nom;
    }
    etatNavire = etatNavireParDefaut(navire);
    realignerCategorieTestMJ(navire);
    invaliderCacheHautsFonds();
    majBoutonsNavire();
    return navire;
  }

  function reinitialiserNavireActif() {
    const navire = navireActif();
    etatNavire = etatNavireParDefaut(navire);
    realignerCategorieTestMJ(navire);
    invaliderCacheHautsFonds();
    majBoutonsNavire();
    rendreSelectNavire();
    rendreFicheNavire();
  }

  function realignerCategorieTestMJ(navire) {
    const categorie = Number(navire.categorieTaille);
    if (Number.isFinite(categorie) && categorie > 0) {
      syncEncadreMJ(null, categorie);
      if (typeof window.setCategorieTailleTest === 'function') window.setCategorieTailleTest(categorie);
    }
  }

  function formatNombreNavire(v, suffixe = '') {
    if (v === null || typeof v === 'undefined' || v === '') return '—';
    const n = Number(v);
    if (!Number.isFinite(n)) return '—';
    return `${n}${suffixe}`;
  }

  // tirantEau peut être un nombre simple, ou { standard, deriveLevee } pour les navires
  // à dérives relevables (ex. Poon de Hollande, Flibot petit) — valeur indicative, non
  // contrainte par une bathymétrie réelle des zones maritimes pour le moment. Affichage
  // dynamique : bascule sur deriveLevee quand la case "Dérive relevée" est cochée.
  function formatTirantEauNavire(navire, deriveLeveeActive = false) {
    const t = navire?.tirantEau;
    if (t && typeof t === 'object') {
      const utiliserAlt = deriveLeveeActive && Number.isFinite(Number(t.deriveLevee));
      return formatNombreNavire(utiliserAlt ? t.deriveLevee : t.standard, ' m');
    }
    return formatNombreNavire(t, ' m');
  }

  function tirantEauDeriveLevee(navire) {
    const t = navire?.tirantEau;
    return t && typeof t === 'object' && Number.isFinite(Number(t.deriveLevee)) ? Number(t.deriveLevee) : null;
  }

  // Ligne "Tirant d'eau" : marqueur data-navire-tirant-eau seulement pour les navires à
  // dérive relevable, pour permettre la mise à jour dynamique sans re-rendu complet.
  function donneeTirantEauNavire(navire, deriveLeveeActive) {
    const texte = formatTirantEauNavire(navire, deriveLeveeActive);
    if (tirantEauDeriveLevee(navire) === null) return donneeNavire('Tirant d’eau', texte);
    return `
      <div class="navire-modale-donnee">
        <span class="navire-modale-donnee-label">Tirant d’eau</span>
        <span class="navire-modale-donnee-valeur" data-navire-tirant-eau>${escapeHtml(texte)}</span>
      </div>
    `;
  }

  function majAffichageTirantEau(navire = navireActif(), etat = etatNavireActif(navire)) {
    const el = document.querySelector('[data-navire-tirant-eau]');
    if (!el) return;
    el.textContent = formatTirantEauNavire(navire, !!etat.deriveLevee);
  }

  function accesChampNavire(champ, niveau = niveauCatalogueNavire()) {
    if (typeof window.canAccessShipField === 'function') return window.canAccessShipField(champ, niveau);
    return niveau >= (champ === 'notes' ? 5 : 0);
  }

  function libelleCategorieNavire(categorie) {
    if (typeof window.getShipCategoryLabel === 'function') return window.getShipCategoryLabel(categorie);
    return `Catégorie ${categorie || '?'}`;
  }

  function designationNavire(navire) {
    return navire.designation || navire.nom || navire.id || 'Navire';
  }

  function modeleNavire(navire) {
    if (!navire.type) return navire;
    const modele = typeof window.getShipById === 'function' ? window.getShipById(navire.type) : null;
    return modele || null;
  }

  function libelleModeleNavire(navire) {
    const modele = modeleNavire(navire);
    return modele?.nom || navire.type || navire.nom || navire.id || '';
  }

  function majTitreModaleNavire(navire = navireActif()) {
    const titre = document.getElementById('navire-modale-titre');
    if (!titre) return;
    const type = libelleModeleNavire(navire);
    if (navire.type || navire.designation) {
      titre.innerHTML = `
        <span class="navire-modale-titre-nom">${escapeHtml(designationNavire(navire))}</span>
        ${type ? `<span class="navire-modale-titre-type"> - ${escapeHtml(type)}</span>` : ''}
      `;
      return;
    }
    titre.innerHTML = `<span class="navire-modale-titre-type">${escapeHtml(type)}</span>`;
  }

  function naviresAccessiblesCatalogue() {
    const courant = navireActif();
    const pj = typeof window.getShipById === 'function' ? window.getShipById('navire-pj') : null;
    const niveau = niveauCatalogueNavire();
    const accessibles = typeof window.getShipsForNavLevel === 'function'
      ? window.getShipsForNavLevel(niveau)
      : [];
    const navires = [pj, courant, ...accessibles].filter(Boolean);
    const vus = new Set();
    return navires.filter(navire => {
      if (!navire.id || vus.has(navire.id)) return false;
      vus.add(navire.id);
      return true;
    });
  }

  function rendreSelectNavire() {
    const select = document.getElementById('navire-modele-select');
    const trigger = document.getElementById('navire-modele-trigger');
    if (!select) return;
    const courant = navireActif();
    const niveau = niveauCatalogueNavire();
    const accessible = niveau >= 1;
    if (trigger) {
      trigger.classList.toggle('navire-modale-titre-wrap--selectable', accessible);
      trigger.title = accessible ? 'Changer de navire' : '';
    }
    const pj = typeof window.getShipById === 'function' ? window.getShipById('navire-pj') : null;
    const parCategorie = new Map();
    naviresAccessiblesCatalogue()
      .slice()
      .filter(navire => navire.id !== 'navire-pj')
      .sort((a, b) => (Number(a.categorieTaille) || 0) - (Number(b.categorieTaille) || 0)
        || String(a.nom || a.id).localeCompare(String(b.nom || b.id), 'fr'))
      .forEach(navire => {
        const cat = Number(navire.categorieTaille) || 0;
        if (!parCategorie.has(cat)) parCategorie.set(cat, []);
        parCategorie.get(cat).push(navire);
      });
    const optionPJ = pj ? `<option value="${escapeHtml(pj.id)}">${escapeHtml(designationNavire(pj))}</option>` : '';
    select.innerHTML = optionPJ + [...parCategorie.entries()].map(([cat, navires]) => `
      <optgroup label="${escapeHtml(libelleCategorieNavire(cat))}">
        ${navires.map(navire => `<option value="${escapeHtml(navire.id)}">${escapeHtml(navire.nom || navire.id)}</option>`).join('')}
      </optgroup>
    `).join('');
    select.value = courant.id;
    select.disabled = niveau <= 0 && courant.id === 'navire-pj';
  }

  function rendreFicheNavire() {
    const fiche = document.getElementById('navire-modale-fiche');
    const message = document.getElementById('navire-modale-message');
    if (!fiche) return;

    const navire = navireActif();
    const niveau = niveauCatalogueNavire();
    const etat = etatNavireActif(navire);
    const equipage = Number(etat.equipage);
    const min = Number(navire.equipage?.min);
    const max = Number(navire.equipage?.max);
    const tonnageUtile = Number(navire.tonnage?.utile);
    const tonnageTotal = Number(navire.tonnage?.total);
    const tonnageLimite = limiteTonnageOccupeNavire(navire, niveau);
    const tonnageOccupe = Number(etat.tonnageOccupe);
    const encombrement = encombrementNavirePct(navire, etat, niveau) ?? 0;
    const equipageAlerte = Number.isFinite(equipage)
      && ((Number.isFinite(min) && equipage < min) || (Number.isFinite(max) && equipage > max));
    const encombrementBonus = encombrementEstBonus(navire, encombrement);
    const encombrementMalus = encombrementEstMalus(navire, encombrement);
    const encombrementClasse = encombrementMalus ? 'navire-alerte' : (encombrementBonus ? 'navire-bonus' : '');
    const override = categorieOverrideActive(navire);
    const restrictions = Array.isArray(navire.regionRestriction) && navire.regionRestriction.length
      ? navire.regionRestriction.join(', ')
      : 'Aucune';

    majTitreModaleNavire(navire);

    if (message) {
      if (equipageAlerte && equipage < min) message.textContent = `Équipage inférieur au minimum de ${min}.`;
      else if (equipageAlerte && equipage > max) message.textContent = `Équipage supérieur au maximum de ${max}.`;
      else message.textContent = '';
    }

    const colonneGauche = [
      sectionEquipageNavire(navire, { niveau, equipage, min, max, equipageAlerte }),
      sectionCarenageNavire(navire, etat, niveau),
      sectionToilageNavire(navire, etat, niveau),
      sectionCaracteristiquesNavire(navire, { niveau, restrictions, etatDeriveLevee: !!etat.deriveLevee }),
    ].filter(Boolean).join('');
    const colonneDroite = [
      sectionTonnageNavire(navire, { niveau, tonnageTotal, tonnageUtile, tonnageLimite, tonnageOccupe, encombrement, encombrementClasse }),
      sectionVitessesNavire(navire, niveau),
      sectionManoeuvrabiliteNavire(navire, etat, niveau),
    ].filter(Boolean).join('');
    const basFiche = [
      override ? sectionSimulationNavire() : '',
      accesChampNavire('notes', niveau) && navire.notes ? sectionNotesNavire(navire) : '',
    ].filter(Boolean).join('');

    fiche.innerHTML = `
      ${sectionTitreNavire(navire)}
      <div class="navire-modale-fiche-colonnes">
        ${colonneGauche ? `<div class="navire-modale-fiche-colonne">${colonneGauche}</div>` : ''}
        ${colonneDroite ? `<div class="navire-modale-fiche-colonne">${colonneDroite}</div>` : ''}
        ${basFiche}
      </div>
    `;

    document.getElementById('navire-equipage-input')?.addEventListener('input', e => {
      const valeur = Number(e.target.value);
      etatNavire.equipage = Number.isFinite(valeur) ? Math.round(valeur) : null;
      majAlerteEquipageNavire(navire, e.target);
      majAffichageManoeuvrabilite(navire, etatNavire);
    });
    initControleTonnageNavire(navire);
    initControleCarenageNavire();
    initControleToilageNavire();
    initControleDeriveLeveeNavire(navire);
    majAffichageVitessesModifiees(navire);
  }

  function sectionTitreNavire(navire) {
    return `
      <section class="navire-modale-identite" aria-hidden="true"></section>
    `;
  }

  function sectionEquipageNavire(navire, ctx) {
    if (!accesChampNavire('equipage_max', ctx.niveau)) return '';
    const colonnes = [];
    if (accesChampNavire('equipage_min', ctx.niveau)) {
      colonnes.push(donneeNavire('Nécessaire pour manœuvrer', formatNombreNavire(ctx.min)));
    }
    colonnes.push(donneeNavire('Maximal', formatNombreNavire(ctx.max), ctx.equipageAlerte));
    colonnes.push(champCompactNavire('Effectif', 'navire-equipage-input', {
      value: Number.isFinite(ctx.equipage) ? ctx.equipage : '',
      step: '1',
      classes: ctx.equipageAlerte ? 'navire-alerte' : '',
    }));
    return `
      <section class="navire-modale-section navire-modale-section--equipage">
        <h3>Équipage</h3>
        <div class="navire-modale-grille navire-modale-grille--compacte">
          ${colonnes.join('')}
        </div>
      </section>
    `;
  }

  function sectionTonnageNavire(navire, ctx) {
    if (!accesChampNavire('tonnage_total', ctx.niveau)) return '';
    const colonnes = [
      donneeNavire('Total', formatNombreNavire(ctx.tonnageTotal), false, navire.tonnage?.fourchette),
    ];
    if (accesChampNavire('tonnage_utile', ctx.niveau)) {
      colonnes.push(donneeNavire('Utile', formatNombreNavire(ctx.tonnageUtile), false, navire.tonnage?.fourchette));
    }
    colonnes.push(champCompactNavire('Occupé', 'navire-tonnage-occupe-input', {
      value: Number.isFinite(ctx.tonnageOccupe) ? ctx.tonnageOccupe : '',
      min: '0',
      max: Number.isFinite(ctx.tonnageLimite) ? String(ctx.tonnageLimite) : '',
      step: '0.5',
      classes: ctx.encombrementClasse,
    }));
    return `
      <section class="navire-modale-section navire-modale-section--tonnage">
        ${titreSectionNavire('Tonnage')}
        <div class="navire-modale-grille navire-modale-grille--compacte">
          ${colonnes.join('')}
        </div>
        ${accesChampNavire('encombrement', ctx.niveau) ? `
          <label class="navire-modale-champ navire-encombrement">
            <span>Encombrement</span>
            <input id="navire-encombrement-slider" type="range" min="0" max="100" step="1" value="${Math.min(100, ctx.encombrement)}">
          </label>
        ` : ''}
      </section>
    `;
  }

  function sectionCaracteristiquesNavire(navire, ctx) {
    const lignes = [];
    if (accesChampNavire('tirantEau', ctx.niveau)) lignes.push(donneeTirantEauNavire(navire, ctx.etatDeriveLevee));
    if (accesChampNavire('greement', ctx.niveau)) lignes.push(donneeNavire('Gréement', navire.greement || '—'));
    if (accesChampNavire('regionRestriction', ctx.niveau)) lignes.push(donneeNavire('Restrictions', ctx.restrictions));
    if (accesChampNavire('malus_navigation', ctx.niveau)) {
      lignes.push(donneeNavire('Restrictions de zone', libelleRestrictionNav(navire)));
    }
    if (!lignes.length && !accesChampNavire('tirantEau', ctx.niveau)) return '';
    const deriveLevee = accesChampNavire('tirantEau', ctx.niveau) && tirantEauDeriveLevee(navire) !== null
      ? `
        <label class="navire-modale-donnee navire-modale-donnee--champ navire-derive-option ${ctx.etatDeriveLevee ? 'navire-alerte' : ''}">
          <span class="navire-modale-donnee-label">Dérive relevée (−1 Manœuvrabilité)</span>
          <input id="navire-derive-levee" type="checkbox" ${ctx.etatDeriveLevee ? 'checked' : ''}>
        </label>
      `
      : '';
    if (!lignes.length && !deriveLevee) return '';
    return `
      <section class="navire-modale-section navire-modale-section--caracteristiques">
        <h3>Caractéristiques</h3>
        <div class="navire-modale-grille">
          ${lignes.join('')}
        </div>
        ${deriveLevee}
      </section>
    `;
  }

  function sectionCarenageNavire(navire, etat, niveau) {
    if (!accesChampNavire('carenage', niveau) || !carenageApplicableNavire(navire)) return '';
    const recent = etat.carenage === 'recent';
    const ancien = etat.carenage === 'ancien';
    return `
      <section class="navire-modale-section navire-modale-section--carenage">
        ${titreSectionNavire('Carénage')}
        <div class="navire-carenage-choix navire-modale-grille navire-modale-grille--compacte">
          <label class="navire-modale-donnee navire-modale-donnee--champ navire-carenage-option ${recent ? 'navire-bonus' : ''}">
            <span class="navire-modale-donnee-label">Moins de deux mois</span>
            <input id="navire-carenage-recent" type="checkbox" ${recent ? 'checked' : ''}>
          </label>
          <label class="navire-modale-donnee navire-modale-donnee--champ navire-carenage-option ${ancien ? 'navire-alerte' : ''}">
            <span class="navire-modale-donnee-label">Plus de douze mois</span>
            <input id="navire-carenage-ancien" type="checkbox" ${ancien ? 'checked' : ''}>
          </label>
        </div>
      </section>
    `;
  }

  const TOILAGE_OPTIONS = {
    tres_sous_toile: { label: 'Très sous-toilé', vitesse: -2, manoeuvre: 2 },
    sous_toile:      { label: 'Sous-toilé',       vitesse: -1, manoeuvre: 1 },
    sur_toile:       { label: 'Sur-toilé',        vitesse: 1,  manoeuvre: -2 },
    tres_sur_toile:  { label: 'Très sur-toilé',   vitesse: 2,  manoeuvre: -4 },
  };

  function sectionToilageNavire(navire, etat, niveau) {
    if (!accesChampNavire('toilage', niveau)) return '';
    const options = Object.entries(TOILAGE_OPTIONS);
    return `
      <section class="navire-modale-section navire-modale-section--toilage">
        ${titreSectionNavire('Voilure')}
        <div class="navire-toilage-choix navire-carenage-choix navire-modale-grille navire-modale-grille--compacte">
          ${options.map(([cle, def]) => {
            const actif = etat.toilage === cle;
            const classe = actif ? (def.vitesse < 0 ? 'navire-alerte' : 'navire-bonus') : '';
            return `
              <label class="navire-modale-donnee navire-modale-donnee--champ navire-toilage-option navire-carenage-option ${classe}">
                <span class="navire-modale-donnee-label">${escapeHtml(def.label)}</span>
                <input type="checkbox" data-toilage="${cle}" ${actif ? 'checked' : ''}>
              </label>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function sectionVitessesNavire(navire, niveau) {
    const lignes = [donneeVitesseNavire('Moyenne milles/jour', navire.navigation?.vitesse_naive, true)];
    if (accesChampNavire('vitesses_completes', niveau)) {
      lignes.push(
        donneeVitesseNavire('Avirons', navire.navigation?.avirons, false, true),
        donneeVitesseNavire('Près', navire.navigation?.pres),
        donneeVitesseNavire('Largue', navire.navigation?.largue),
        donneeVitesseNavire('Grand largue', navire.navigation?.grand_largue),
        donneeVitesseNavire('Vent arrière', navire.navigation?.vent_arriere),
      );
    }
    return `
      <section class="navire-modale-section navire-modale-section--allures">
        <h3>Allures</h3>
        <div class="navire-modale-grille">
          ${lignes.join('')}
        </div>
      </section>
    `;
  }

  function formatSigneNavire(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '—';
    return v > 0 ? `+${v}` : `${v}`;
  }

  // Pénalité de Manœuvre liée au sous-effectif, par rapport au minimum requis.
  // -Infinity = navire impossible à manœuvrer (sentinelle, pas un magic number).
  function malusEquipageManoeuvre(navire, etat) {
    const min = Number(navire?.equipage?.min);
    const effectif = Number(etat?.equipage);
    if (!Number.isFinite(min) || min <= 0 || !Number.isFinite(effectif)) return 0;
    const pct = (effectif / min) * 100;
    if (pct >= 100) return 0;
    if (pct >= 80) return -1;
    if (pct >= 60) return -2;
    if (pct >= 50) return -3;
    return -Infinity;
  }

  // Score de Manœuvre affiché en fiche : somme des facteurs que le niveau de
  // Navigation actif permet réellement d'évaluer (même logique que
  // modificateurVitesseActuelNoeuds — on n'additionne que ce que l'utilisateur voit).
  function scoreManoeuvrabiliteActuel(navire = navireActif(), etat = etatNavireActif(navire), niveau = niveauCatalogueNavire()) {
    let score = 0;
    if (accesChampNavire('manoeuvrabilite', niveau)) {
      const base = Number(navire.manoeuvrabilite);
      if (Number.isFinite(base)) score += base;
    }
    if (accesChampNavire('equipage_min', niveau)) {
      const malusEquipage = malusEquipageManoeuvre(navire, etat);
      if (!Number.isFinite(malusEquipage)) return -Infinity;
      score += malusEquipage;
    }
    if (accesChampNavire('toilage', niveau)) {
      const toilage = TOILAGE_OPTIONS[etat.toilage];
      if (toilage) score += toilage.manoeuvre;
    }
    if (accesChampNavire('malus_navigation', niveau)) {
      // typeZoneNavigationEnPoint() renvoie null tant que la classification
      // géographique fluviale/côtière/hauturière n'existe pas : contribution nulle.
      const typeZone = typeZoneNavigationEnPoint(null);
      const valeur = Number(restrictionNavPourZone(navire, typeZone));
      if (Number.isFinite(valeur)) score += valeur;
    }
    if (etat.deriveLevee && tirantEauDeriveLevee(navire) !== null) score -= 1;
    return score;
  }

  function sectionManoeuvrabiliteNavire(navire, etat, niveau) {
    if (!accesChampNavire('manoeuvrabilite', niveau)) return '';
    const score = scoreManoeuvrabiliteActuel(navire, etat, niveau);
    const texte = Number.isFinite(score) ? formatSigneNavire(score) : 'Impossible à manœuvrer';
    const classe = !Number.isFinite(score) || score < 0 ? 'navire-alerte' : (score > 0 ? 'navire-bonus' : '');
    return `
      <section class="navire-modale-section navire-modale-section--manoeuvre">
        <h3>Manœuvrabilité</h3>
        <div class="navire-modale-donnee-valeur navire-manoeuvre-score ${classe}" data-navire-manoeuvre>${texte}</div>
      </section>
    `;
  }

  // Rafraîchit uniquement la valeur affichée (pas de re-rendu complet de la fiche),
  // même logique que majAffichageVitessesModifiees.
  function majAffichageManoeuvrabilite(navire = navireActif(), etat = etatNavireActif(navire)) {
    const el = document.querySelector('[data-navire-manoeuvre]');
    if (!el) return;
    const niveau = niveauCatalogueNavire();
    const score = scoreManoeuvrabiliteActuel(navire, etat, niveau);
    const texte = Number.isFinite(score) ? formatSigneNavire(score) : 'Impossible à manœuvrer';
    el.textContent = texte;
    el.classList.toggle('navire-alerte', !Number.isFinite(score) || score < 0);
    el.classList.toggle('navire-bonus', Number.isFinite(score) && score > 0);
  }

  function sectionSimulationNavire() {
    return `
      <section class="navire-modale-section navire-modale-section--large">
        <h3>Simulation MJ</h3>
        <div class="navire-modale-donnee-valeur navire-override">Catégorie de taille forcée par l’encadré TEST MJ.</div>
      </section>
    `;
  }

  function sectionNotesNavire(navire) {
    return `
      <section class="navire-modale-section navire-modale-section--large">
        <h3>Notes</h3>
        <p class="navire-modale-note">${escapeHtml(navire.notes)}</p>
      </section>
    `;
  }

  function majAlerteEquipageNavire(navire, input) {
    const message = document.getElementById('navire-modale-message');
    const equipage = Number(input?.value);
    const min = Number(navire.equipage?.min);
    const max = Number(navire.equipage?.max);
    const tropBas = Number.isFinite(equipage) && Number.isFinite(min) && equipage < min;
    const tropHaut = Number.isFinite(equipage) && Number.isFinite(max) && equipage > max;
    input?.classList.toggle('navire-alerte', tropBas || tropHaut);
    if (!message) return;
    if (tropBas) message.textContent = `Équipage inférieur au minimum de ${min}.`;
    else if (tropHaut) message.textContent = `Équipage supérieur au maximum de ${max}.`;
    else message.textContent = '';
  }

  function initControleTonnageNavire(navire) {
    const input = document.getElementById('navire-tonnage-occupe-input');
    const slider = document.getElementById('navire-encombrement-slider');
    const niveau = niveauCatalogueNavire();
    const limite = accesChampNavire('tonnage_occupe_utile', niveau) && Number.isFinite(Number(navire.tonnage?.utile))
      ? Number(navire.tonnage?.utile)
      : Number(navire.tonnage?.total);
    if (!input || !Number.isFinite(limite) || limite <= 0) {
      if (input) input.disabled = true;
      if (slider) slider.disabled = true;
      return;
    }
    if (!slider) {
      input.addEventListener('input', e => {
        const tonnage = Math.max(0, Math.min(limite, Number(e.target.value)));
        if (Number.isFinite(tonnage)) {
          etatNavire.tonnageOccupe = Math.round(tonnage * 10) / 10;
          if (Number(e.target.value) !== etatNavire.tonnageOccupe) input.value = String(etatNavire.tonnageOccupe);
          majStyleEncombrement(input, navire, encombrementNavirePct(navire));
          majAffichageVitessesModifiees(navire, etatNavire);
          invaliderCacheHautsFonds();
        }
      });
      return;
    }

    function appliquerDepuisTonnage(tonnage, source) {
      const occupe = Math.max(0, Math.min(limite, Math.round(Number(tonnage) * 10) / 10));
      const pct = limite > 0 ? Math.round((occupe / limite) * 100) : 0;
      etatNavire.tonnageOccupe = occupe;
      if (source !== 'input' || Number(tonnage) !== occupe) input.value = String(occupe);
      if (source !== 'slider') slider.value = String(Math.max(0, Math.min(100, pct)));
      majStyleEncombrement(input, navire, pct);
      majAffichageVitessesModifiees(navire, etatNavire);
      if (source !== 'init') invaliderCacheHautsFonds();
    }

    input.addEventListener('input', e => {
      const tonnage = Number(e.target.value);
      if (!Number.isFinite(tonnage)) return;
      appliquerDepuisTonnage(tonnage, 'input');
    });

    slider.addEventListener('input', e => {
      const pct = Math.max(0, Number(e.target.value));
      if (!Number.isFinite(pct)) return;
      appliquerDepuisTonnage((limite * pct) / 100, 'slider');
    });

    appliquerDepuisTonnage(Number(etatNavire.tonnageOccupe), 'init');
  }

  function initControleCarenageNavire() {
    const recent = document.getElementById('navire-carenage-recent');
    const ancien = document.getElementById('navire-carenage-ancien');
    if (!recent || !ancien) return;

    function appliquer(valeur) {
      etatNavire.carenage = normaliserCarenage(valeur);
      recent.checked = etatNavire.carenage === 'recent';
      ancien.checked = etatNavire.carenage === 'ancien';
      recent.closest('.navire-carenage-option')?.classList.toggle('navire-bonus', recent.checked);
      ancien.closest('.navire-carenage-option')?.classList.toggle('navire-alerte', ancien.checked);
      majAffichageVitessesModifiees(navire, etatNavire);
      invaliderCacheHautsFonds();
    }

    const appliquerRecent = () => appliquer(recent.checked ? 'recent' : 'normal');
    const appliquerAncien = () => appliquer(ancien.checked ? 'ancien' : 'normal');
    const appliquerRecentApresToggle = () => setTimeout(appliquerRecent, 0);
    const appliquerAncienApresToggle = () => setTimeout(appliquerAncien, 0);
    recent.addEventListener('click', appliquerRecentApresToggle);
    ancien.addEventListener('click', appliquerAncienApresToggle);
    recent.addEventListener('input', appliquerRecent);
    ancien.addEventListener('input', appliquerAncien);
    recent.addEventListener('change', appliquerRecent);
    ancien.addEventListener('change', appliquerAncien);
  }

  function appliquerCarenageDepuisControle(target) {
    if (!target || (target.id !== 'navire-carenage-recent' && target.id !== 'navire-carenage-ancien')) return;
    const navire = navireActif();
    const etat = etatNavireActif(navire);
    const recent = document.getElementById('navire-carenage-recent');
    const ancien = document.getElementById('navire-carenage-ancien');
    if (!recent || !ancien) return;
    etat.carenage = target.checked
      ? (target.id === 'navire-carenage-recent' ? 'recent' : 'ancien')
      : 'normal';
    recent.checked = etat.carenage === 'recent';
    ancien.checked = etat.carenage === 'ancien';
    recent.closest('.navire-carenage-option')?.classList.toggle('navire-bonus', recent.checked);
    ancien.closest('.navire-carenage-option')?.classList.toggle('navire-alerte', ancien.checked);
    majAffichageVitessesModifiees(navire, etat);
    invaliderCacheHautsFonds();
  }

  // Toilage : 4 cases mutuellement exclusives (aucune cochée = configuration standard).
  function appliquerToilageDepuisControle(target) {
    if (!target || !target.dataset || !('toilage' in target.dataset)) return;
    const navire = navireActif();
    const etat = etatNavireActif(navire);
    const cases = document.querySelectorAll('[data-toilage]');
    if (!cases.length) return;
    etat.toilage = target.checked ? normaliserToilage(target.dataset.toilage) : null;
    cases.forEach(input => {
      const actif = input.dataset.toilage === etat.toilage;
      input.checked = actif;
      const def = TOILAGE_OPTIONS[input.dataset.toilage];
      const option = input.closest('.navire-toilage-option');
      option?.classList.toggle('navire-bonus', actif && def && def.vitesse >= 0);
      option?.classList.toggle('navire-alerte', actif && def && def.vitesse < 0);
    });
    majAffichageVitessesModifiees(navire, etat);
    majAffichageManoeuvrabilite(navire, etat);
    invaliderCacheHautsFonds();
  }

  function initControleToilageNavire() {
    const cases = document.querySelectorAll('[data-toilage]');
    if (!cases.length) return;
    cases.forEach(input => {
      input.addEventListener('click', () => setTimeout(() => appliquerToilageDepuisControle(input), 0));
      input.addEventListener('input', () => appliquerToilageDepuisControle(input));
      input.addEventListener('change', () => appliquerToilageDepuisControle(input));
    });
  }

  // Dérive relevée : n'existe que pour les navires à double dérive (ex. Poon de Hollande).
  function appliquerDeriveLeveeDepuisControle(target) {
    if (!target || target.id !== 'navire-derive-levee') return;
    const navire = navireActif();
    const etat = etatNavireActif(navire);
    etat.deriveLevee = !!target.checked;
    target.closest('.navire-derive-option')?.classList.toggle('navire-alerte', etat.deriveLevee);
    majAffichageManoeuvrabilite(navire, etat);
    majAffichageTirantEau(navire, etat);
    invaliderCacheHautsFonds();
  }

  function initControleDeriveLeveeNavire() {
    const input = document.getElementById('navire-derive-levee');
    if (!input) return;
    input.addEventListener('click', () => setTimeout(() => appliquerDeriveLeveeDepuisControle(input), 0));
    input.addEventListener('input', () => appliquerDeriveLeveeDepuisControle(input));
    input.addEventListener('change', () => appliquerDeriveLeveeDepuisControle(input));
  }

  function majStyleEncombrement(input, navire, pct) {
    input?.classList.toggle('navire-bonus', encombrementEstBonus(navire, pct));
    input?.classList.toggle('navire-alerte', encombrementEstMalus(navire, pct));
  }

  function vitesseModifieeAffichee(base, journalier = false, modificateur = modificateurVitesseActuelNoeuds()) {
    const vitesseBase = Number(base);
    if (!Number.isFinite(vitesseBase) || vitesseBase <= 0) {
      return { texte: '—', classe: '' };
    }
    const vitesse = Math.max(CONFIG.vitesseMinSegmentNoeuds, vitesseBase + modificateur);
    const classe = vitesse > vitesseBase ? 'navire-bonus' : (vitesse < vitesseBase ? 'navire-alerte' : '');
    if (journalier) return { texte: String(Math.round(vitesse * 24)), classe };
    return { texte: `${Math.round(vitesse * 10) / 10} nd`, classe };
  }

  // Chébec/Tartane : le lest inverse la règle d'encombrement (voir lestInverse).
  function encombrementEstBonus(navire, pct) {
    if (!Number.isFinite(pct)) return false;
    return navire?.lestInverse ? pct > 75 : pct < 25;
  }

  function encombrementEstMalus(navire, pct) {
    if (!Number.isFinite(pct)) return false;
    return navire?.lestInverse ? pct < 25 : pct > 75;
  }

  function modificateurVitesseActuelNoeuds(navire = navireActif(), etat = etatNavireActif(navire), { inclureToilage = true } = {}) {
    let mod = 0;
    if (modificateurActif(2)) {
      const pct = encombrementNavirePct(navire, etat);
      if (encombrementEstBonus(navire, pct)) mod += 1;
      else if (encombrementEstMalus(navire, pct)) mod -= 1;
    }
    if (modificateurActif(3) && carenageApplicableNavire(navire)) {
      if (etat.carenage === 'recent') mod += 1;
      else if (etat.carenage === 'ancien') mod -= 1;
    }
    // Le toilage (surface de voile) est sans effet sous avirons : exclu via inclureToilage.
    if (inclureToilage && accesChampNavire('toilage', niveauCatalogueNavire())) {
      const toilage = TOILAGE_OPTIONS[etat.toilage];
      if (toilage) mod += toilage.vitesse;
    }
    return mod;
  }

  function majAffichageVitessesModifiees(navire = navireActif(), etat = etatNavireActif(navire)) {
    const modificateurStandard = modificateurVitesseActuelNoeuds(navire, etat);
    const modificateurAvirons = modificateurVitesseActuelNoeuds(navire, etat, { inclureToilage: false });
    document.querySelectorAll('[data-navire-vitesse-base]').forEach(el => {
      const base = Number(el.dataset.navireVitesseBase);
      const journalier = el.dataset.navireVitesseJour === '1';
      const avirons = el.dataset.navireVitesseAvirons === '1';
      const rendu = vitesseModifieeAffichee(base, journalier, avirons ? modificateurAvirons : modificateurStandard);
      el.textContent = rendu.texte;
      el.classList.toggle('navire-bonus', rendu.classe === 'navire-bonus');
      el.classList.toggle('navire-alerte', rendu.classe === 'navire-alerte');
    });
  }

  function titreSectionNavire(titre, effet = '', classe = '', id = '') {
    const attrs = [
      id ? `id="${escapeHtml(id)}"` : '',
      `class="navire-modale-section-effet ${escapeHtml(classe || '')}"`,
    ].filter(Boolean).join(' ');
    return `
      <h3 class="navire-modale-section-titre">
        <span>${escapeHtml(titre)}</span>
        <strong ${attrs}>${escapeHtml(effet)}</strong>
      </h3>
    `;
  }

  function donneeNavire(label, valeur, alerte = false, fourchette = false) {
    const classes = [
      'navire-modale-donnee-valeur',
      alerte ? 'navire-alerte' : '',
      fourchette ? 'navire-fourchette' : '',
    ].filter(Boolean).join(' ');
    const suffixe = fourchette ? ' *' : '';
    return `
      <div class="navire-modale-donnee">
        <span class="navire-modale-donnee-label">${escapeHtml(label)}</span>
        <span class="${classes}">${escapeHtml(valeur)}${suffixe}</span>
      </div>
    `;
  }

  function donneeVitesseNavire(label, valeur, journalier = false, avirons = false) {
    const base = Number(valeur);
    if (!Number.isFinite(base) || base <= 0) return donneeNavire(label, '—');
    const modificateur = modificateurVitesseActuelNoeuds(navireActif(), etatNavireActif(navireActif()), { inclureToilage: !avirons });
    const rendu = vitesseModifieeAffichee(base, journalier, modificateur);
    const classes = [
      'navire-modale-donnee-valeur',
      'navire-vitesse-modifiable',
      rendu.classe,
    ].filter(Boolean).join(' ');
    return `
      <div class="navire-modale-donnee">
        <span class="navire-modale-donnee-label">${escapeHtml(label)}</span>
        <span class="${classes}" data-navire-vitesse-base="${escapeHtml(base)}" data-navire-vitesse-jour="${journalier ? '1' : '0'}" data-navire-vitesse-avirons="${avirons ? '1' : '0'}">${escapeHtml(rendu.texte)}</span>
      </div>
    `;
  }

  function champCompactNavire(label, id, options = {}) {
    const attrs = [
      `id="${escapeHtml(id)}"`,
      'type="number"',
      options.min !== undefined ? `min="${escapeHtml(options.min)}"` : '',
      options.max !== undefined ? `max="${escapeHtml(options.max)}"` : '',
      options.step !== undefined ? `step="${escapeHtml(options.step)}"` : '',
      `value="${escapeHtml(options.value ?? '')}"`,
      `class="navire-modale-input-compact ${escapeHtml(options.classes || '')}"`,
    ].filter(Boolean).join(' ');
    return `
      <label class="navire-modale-donnee navire-modale-donnee--champ">
        <span class="navire-modale-donnee-label">${escapeHtml(label)}</span>
        <input ${attrs}>
      </label>
    `;
  }

  function ouvrirModaleNavire() {
    const overlay = document.getElementById('navire-modale-overlay');
    if (!overlay) return;
    rendreSelectNavire();
    rendreFicheNavire();
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('navire-modale-overlay--visible');
    setTimeout(() => document.getElementById('navire-modele-select')?.focus(), 60);
  }

  function fermerModaleNavire() {
    const overlay = document.getElementById('navire-modale-overlay');
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('navire-modale-overlay--visible');
    majBoutonsNavire();
  }

  function fermerSurClicExterieurStrict(overlay, fermer) {
    if (!overlay || overlay.dataset.strictOutsideBound) return;
    overlay.dataset.strictOutsideBound = '1';
    let pointerExterieur = false;

    overlay.addEventListener('pointerdown', e => {
      pointerExterieur = e.target === overlay;
    });

    overlay.addEventListener('pointerup', e => {
      const relacheExterieur = e.target === overlay;
      if (pointerExterieur && relacheExterieur) fermer();
      pointerExterieur = false;
    });

    overlay.addEventListener('pointercancel', () => {
      pointerExterieur = false;
    });
  }

  let modaleNavireInitialisee = false;

  function initModaleNavire() {
    if (modaleNavireInitialisee) return;
    modaleNavireInitialisee = true;

    const overlay = document.getElementById('navire-modale-overlay');
    if (!overlay) return;

    document.getElementById('navire-modale-ok')?.addEventListener('click', fermerModaleNavire);
    document.getElementById('navire-modale-reset')?.addEventListener('click', reinitialiserNavireActif);
    document.getElementById('navire-modele-select')?.addEventListener('change', e => {
      definirNavireActif(e.target.value);
      rendreSelectNavire();
      rendreFicheNavire();
    });
    overlay.addEventListener('input', e => {
      appliquerCarenageDepuisControle(e.target);
      appliquerToilageDepuisControle(e.target);
      appliquerDeriveLeveeDepuisControle(e.target);
    });
    overlay.addEventListener('change', e => {
      appliquerCarenageDepuisControle(e.target);
      appliquerToilageDepuisControle(e.target);
      appliquerDeriveLeveeDepuisControle(e.target);
    });
    overlay.addEventListener('click', e => {
      const target = e.target;
      if (target?.id === 'navire-carenage-recent' || target?.id === 'navire-carenage-ancien') {
        setTimeout(() => appliquerCarenageDepuisControle(target), 0);
      }
      if (target?.dataset && 'toilage' in target.dataset) {
        setTimeout(() => appliquerToilageDepuisControle(target), 0);
      }
      if (target?.id === 'navire-derive-levee') {
        setTimeout(() => appliquerDeriveLeveeDepuisControle(target), 0);
      }
    });
    fermerSurClicExterieurStrict(overlay, fermerModaleNavire);

    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') fermerModaleNavire();
    });
  }

  function bboxCroise(a, b, bbox, marge) {
    const minX = Math.min(a.x, b.x) - marge;
    const maxX = Math.max(a.x, b.x) + marge;
    const minY = Math.min(a.y, b.y) - marge;
    const maxY = Math.max(a.y, b.y) + marge;
    return !(maxX < bbox.minX || minX > bbox.maxX || maxY < bbox.minY || minY > bbox.maxY);
  }

  function segmentNavigable(a, b, options = {}) {
    const marge = options.margePx ?? CONFIG.margeCotePx;
    const categorieTaille = categorieTailleNavire();
    const navNiveau = typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0;
    const cacheKey = [
      coordCle(a.x), coordCle(a.y), coordCle(b.x), coordCle(b.y), marge,
      categorieTaille, navNiveau,
      options.ignorerDepartDansTerre ? 1 : 0,
      options.ignorerArriveeDansTerre ? 1 : 0,
    ].join('|');
    if (navigabiliteCache.has(cacheKey)) return navigabiliteCache.get(cacheKey);
    if (!segmentDansZonesNavigation(a, b)) {
      return memoriserNavigabilite(cacheKey, false);
    }
    if (segmentTraverseHautFond(a, b)) {
      return memoriserNavigabilite(cacheKey, false);
    }
    if (segmentRestrictionInterdite(a, b)) {
      return memoriserNavigabilite(cacheKey, false);
    }
    const terres = getTerresSegment(a, b, marge);
    for (const poly of terres) {
      if (!bboxCroise(a, b, poly.bbox, marge)) continue;
      if (!options.ignorerDepartDansTerre && pointDansPolygone(a, poly)) return memoriserNavigabilite(cacheKey, false);
      if (!options.ignorerArriveeDansTerre && pointDansPolygone(b, poly)) return memoriserNavigabilite(cacheKey, false);
      for (let i = 0; i < poly.points.length; i++) {
        const c = poly.points[i];
        const d = poly.points[(i + 1) % poly.points.length];
        if (segmentsIntersectent(a, b, c, d)) return memoriserNavigabilite(cacheKey, false);
        if (marge > 0 && distPointSegment(c, a, b) < marge) return memoriserNavigabilite(cacheKey, false);
        if (marge > 0 && distPointSegment(a, c, d) < marge) return memoriserNavigabilite(cacheKey, false);
        if (marge > 0 && distPointSegment(b, c, d) < marge) return memoriserNavigabilite(cacheKey, false);
      }
    }
    return memoriserNavigabilite(cacheKey, true);
  }

  function memoriserNavigabilite(cacheKey, valeur) {
    navigabiliteCache.set(cacheKey, valeur);
    return valeur;
  }

  function pointNavigable(p, options = {}) {
    if (typeof pointInMapBounds === 'function' && !pointInMapBounds(p.x, p.y)) return false;
    return segmentNavigable(p, p, { margePx: options.margePx ?? CONFIG.margeCotePx });
  }

  function cleCelluleIndex(cx, cy) {
    return `${cx},${cy}`;
  }

  function normaliserContour(contour) {
    if (Array.isArray(contour)) return contour;
    if (contour && Array.isArray(contour.points)) return contour.points;
    return null;
  }

  function airePolygonePx2(points) {
    let area = 0;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      area += points[j].x * points[i].y - points[i].x * points[j].y;
    }
    return Math.abs(area) / 2;
  }

  function polygoneCompteCommeCote(poly) {
    return Number(poly?.areaPx2) >= CONFIG.superficieMinPolygoneCotePx2;
  }

  function getTerres() {
    if (terresCache) return terresCache;
    // TODO PN-SEA-EXPLICIT: quand SEA_NAV_ZONES_EXPLICITES sera le seul mode,
    // ZONES_DATA ne devra plus servir a autoriser la mer, seulement aux collisions
    // terre, au deventement et aux distances de cote.
    const source = typeof ZONES_DATA !== 'undefined' ? ZONES_DATA : {};
    terresCache = Object.values(source).flatMap(contours => {
      if (!Array.isArray(contours)) return [];
      return contours.map(normaliserContour).filter(points => points && points.length >= 3);
    }).map(points => {
      const pts = points.map(([x, y]) => ({ x, y }));
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      return {
        points: pts,
        areaPx2: airePolygonePx2(pts),
        bbox: {
          minX: Math.min(...xs) - CONFIG.margeCotePx,
          maxX: Math.max(...xs) + CONFIG.margeCotePx,
          minY: Math.min(...ys) - CONFIG.margeCotePx,
          maxY: Math.max(...ys) + CONFIG.margeCotePx,
        },
      };
    });
    return terresCache;
  }

  function getIndexTerres() {
    if (terresIndexCache) return terresIndexCache;
    const taille = CONFIG.tailleCelluleIndexPx;
    const cellules = new Map();
    getTerres().forEach((poly, index) => {
      const minCx = Math.floor(poly.bbox.minX / taille);
      const maxCx = Math.floor(poly.bbox.maxX / taille);
      const minCy = Math.floor(poly.bbox.minY / taille);
      const maxCy = Math.floor(poly.bbox.maxY / taille);
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cx = minCx; cx <= maxCx; cx++) {
          const key = cleCelluleIndex(cx, cy);
          if (!cellules.has(key)) cellules.set(key, []);
          cellules.get(key).push(index);
        }
      }
    });
    terresIndexCache = { taille, cellules, terres: getTerres() };
    return terresIndexCache;
  }

  function normaliserZoneSea(zone) {
    return anneauxZoneSea(zone).map(ring => ring.map(([x, y]) => ({ x, y })));
  }

  // Hauts-fonds visibles par le calculateur selon niveauNavigation.
  // En mode MJ sans test actif : tous les hauts-fonds (connaissance totale).
  // En mode joueur ou test MJ : seulement ceux dont visibiliteNav <= niveauNavigation.
  function sourceHautsFondsCalculateur() {
    if (typeof SEA_SHOALS === 'undefined') return [];
    const mjSansTest = typeof modeMJ !== 'undefined' && modeMJ
      && typeof testNiveauNavActif !== 'undefined' && !testNiveauNavActif;
    if (mjSansTest) return SEA_SHOALS;
    const nav = typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0;
    return SEA_SHOALS.filter(s => (s.visibiliteNav ?? 0) <= nav);
  }

  function getIndexHautsFonds() {
    if (hautsFondsIndexCache) return hautsFondsIndexCache;
    const taille = CONFIG.tailleCelluleIndexPx;
    const source = sourceHautsFondsCalculateur();
    const hautsFonds = source.flatMap(hautFond => {
      const anneaux = normaliserZoneSea(hautFond.zone || hautFond.points || hautFond);
      if (!anneaux.length || anneaux[0].length < 3) return [];
      const xs = anneaux.flatMap(ring => ring.map(p => p.x));
      const ys = anneaux.flatMap(ring => ring.map(p => p.y));
      return [{
        ...hautFond,
        anneaux,
        bbox: {
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
        },
      }];
    });
    const cellules = new Map();
    hautsFonds.forEach((hautFond, index) => {
      const minCx = Math.floor(hautFond.bbox.minX / taille);
      const maxCx = Math.floor(hautFond.bbox.maxX / taille);
      const minCy = Math.floor(hautFond.bbox.minY / taille);
      const maxCy = Math.floor(hautFond.bbox.maxY / taille);
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cx = minCx; cx <= maxCx; cx++) {
          const key = cleCelluleIndex(cx, cy);
          if (!cellules.has(key)) cellules.set(key, []);
          cellules.get(key).push(index);
        }
      }
    });
    hautsFondsIndexCache = { taille, cellules, hautsFonds };
    return hautsFondsIndexCache;
  }

  function getHautsFondsSegment(a, b) {
    const index = getIndexHautsFonds();
    const minCx = Math.floor(Math.min(a.x, b.x) / index.taille);
    const maxCx = Math.floor(Math.max(a.x, b.x) / index.taille);
    const minCy = Math.floor(Math.min(a.y, b.y) / index.taille);
    const maxCy = Math.floor(Math.max(a.y, b.y) / index.taille);
    const vus = new Set();
    const out = [];
    for (let cy = minCy; cy <= maxCy; cy++) {
      for (let cx = minCx; cx <= maxCx; cx++) {
        const items = index.cellules.get(cleCelluleIndex(cx, cy));
        if (!items) continue;
        items.forEach(itemIndex => {
          if (vus.has(itemIndex)) return;
          vus.add(itemIndex);
          out.push(index.hautsFonds[itemIndex]);
        });
      }
    }
    return out;
  }

  function pointDansHautFond(point) {
    return getHautsFondsSegment(point, point).some(hautFond => pointDansHautFondItem(point, hautFond));
  }

  function pointDansHautFondItem(point, hautFond) {
    if (!bboxCroise(point, point, hautFond.bbox, 0)) return false;
    if (!pointDansPolygone(point, { points: hautFond.anneaux[0] })) return false;
    return !hautFond.anneaux.slice(1).some(trou => pointDansPolygone(point, { points: trou }));
  }

  function navireInterditHautFond(hautFond) {
    const cat = categorieTailleNavire();
    const catMax = hautFond.catMax ?? CONFIG.categorieMaxHautsFonds;
    const catMaxNav = hautFond.catMaxNav ?? catMax;
    const passageNav = hautFond.passageNav ?? 99;
    if (cat <= catMax) return false; // libre
    if (cat <= catMaxNav && niveauNavigation >= passageNav) return false; // exception Nav
    return true;                                                            // interdit
  }

  function segmentTraverseHautFond(a, b) {
    return getHautsFondsSegment(a, b).some(hautFond => {
      if (!navireInterditHautFond(hautFond)) return false;
      if (!bboxCroise(a, b, hautFond.bbox, 0)) return false;
      if (pointDansHautFondItem(a, hautFond) || pointDansHautFondItem(b, hautFond)) return true;
      return hautFond.anneaux.some(ring => ring.some((c, i) => {
        const d = ring[(i + 1) % ring.length];
        return segmentsIntersectent(a, b, c, d);
      }));
    });
  }

  function getTerresSegment(a, b, marge) {
    const index = getIndexTerres();
    const minCx = Math.floor((Math.min(a.x, b.x) - marge) / index.taille);
    const maxCx = Math.floor((Math.max(a.x, b.x) + marge) / index.taille);
    const minCy = Math.floor((Math.min(a.y, b.y) - marge) / index.taille);
    const maxCy = Math.floor((Math.max(a.y, b.y) + marge) / index.taille);
    const vus = new Set();
    const out = [];
    for (let cy = minCy; cy <= maxCy; cy++) {
      for (let cx = minCx; cx <= maxCx; cx++) {
        const polys = index.cellules.get(cleCelluleIndex(cx, cy));
        if (!polys) continue;
        polys.forEach(polyIndex => {
          if (vus.has(polyIndex)) return;
          vus.add(polyIndex);
          out.push(index.terres[polyIndex]);
        });
      }
    }
    return out;
  }

  function distanceCoteSegment(a, b) {
    const cacheKey = [coordCle(a.x), coordCle(a.y), coordCle(b.x), coordCle(b.y)].join('|');
    if (distanceCoteCache.has(cacheKey)) return distanceCoteCache.get(cacheKey);
    let meilleure = Infinity;
    const terres = getTerresSegment(a, b, CONFIG.rayonCotePx);
    for (const poly of terres) {
      if (!polygoneCompteCommeCote(poly)) continue;
      if (!bboxCroise(a, b, poly.bbox, CONFIG.rayonCotePx)) continue;
      for (let i = 0; i < poly.points.length; i++) {
        const c = poly.points[i];
        const d = poly.points[(i + 1) % poly.points.length];
        meilleure = Math.min(meilleure, distSegmentSegment(a, b, c, d));
        if (meilleure <= CONFIG.rayonMargeFinePx) {
          distanceCoteCache.set(cacheKey, meilleure);
          return meilleure;
        }
      }
    }
    distanceCoteCache.set(cacheKey, meilleure);
    return meilleure;
  }

  function distanceCotePoint(point) {
    const cacheKey = ['P', coordCle(point.x), coordCle(point.y)].join('|');
    if (distanceCoteCache.has(cacheKey)) return distanceCoteCache.get(cacheKey);
    const rayon = rayonAttenuationCourantPx();
    let meilleure = Infinity;
    const terres = getTerresSegment(point, point, rayon);
    for (const poly of terres) {
      if (!polygoneCompteCommeCote(poly)) continue;
      if (!bboxCroise(point, point, poly.bbox, rayon)) continue;
      if (pointDansPolygone(point, poly)) {
        distanceCoteCache.set(cacheKey, 0);
        return 0;
      }
      for (let i = 0; i < poly.points.length; i++) {
        const c = poly.points[i];
        const d = poly.points[(i + 1) % poly.points.length];
        meilleure = Math.min(meilleure, distPointSegment(point, c, d));
        if (meilleure <= 0.000001) {
          distanceCoteCache.set(cacheKey, 0);
          return 0;
        }
      }
    }
    distanceCoteCache.set(cacheKey, meilleure);
    return meilleure;
  }

  function distanceCotePointNm(point) {
    return distanceCotePoint(point) * millesNautiquesParPx();
  }

  function distanceCotePointPrecise(point) {
    const cacheKey = ['P', 'precise', coordCle(point.x), coordCle(point.y)].join('|');
    if (distanceCoteCache.has(cacheKey)) return distanceCoteCache.get(cacheKey);
    let meilleure = Infinity;
    for (const poly of getTerres()) {
      if (!polygoneCompteCommeCote(poly)) continue;
      if (pointDansPolygone(point, poly)) {
        distanceCoteCache.set(cacheKey, 0);
        return 0;
      }
      for (let i = 0; i < poly.points.length; i++) {
        const c = poly.points[i];
        const d = poly.points[(i + 1) % poly.points.length];
        meilleure = Math.min(meilleure, distPointSegment(point, c, d));
      }
    }
    distanceCoteCache.set(cacheKey, meilleure);
    return meilleure;
  }

  function distanceCotePointPreciseNm(point) {
    return distanceCotePointPrecise(point) * millesNautiquesParPx();
  }

  function attenuationCourantCote(point) {
    // Le champ OSCAR est un champ physique autonome : la proximite des cotes
    // ne doit plus attenuer les courants. Les anciens courants restent un
    // fallback de donnees, pas une couche de correction du nouveau champ.
    return 1;
  }

  function getGrille() {
    if (grilleCache) return grilleCache;
    const step = CONFIG.grillePx;
    const cols = Math.floor(CARTE_IMAGE.width / step) + 1;
    const rows = Math.floor(CARTE_IMAGE.height / step) + 1;
    const nodes = new Map();

    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const p = {
          x: Math.min(CARTE_IMAGE.width, x * step),
          y: Math.min(CARTE_IMAGE.height, y * step),
          gx: x,
          gy: y,
        };
        if (pointNavigable(p)) nodes.set(pointCle(p), p);
      }
    }

    grilleCache = { step, cols, rows, nodes };
    return grilleCache;
  }

  function voisins(node, foyers = []) {
    const grille = getGrille();
    const deltas = deltasNavigation();
    const out = [];
    deltas.forEach(([dx, dy]) => {
      const p = {
        x: Math.min(CARTE_IMAGE.width, Math.max(0, (node.gx + dx) * grille.step)),
        y: Math.min(CARTE_IMAGE.height, Math.max(0, (node.gy + dy) * grille.step)),
        gx: node.gx + dx,
        gy: node.gy + dy,
      };
      const voisin = grille.nodes.get(pointCle(p));
      if (!voisin) return;
      const cout = coutSegmentGrille(node, voisin, foyers);
      if (Number.isFinite(cout)) out.push({ node: voisin, cout });
    });
    return out;
  }

  function margeRoutePourSegment(a, b, foyers = []) {
    const milieu = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const dFoyer = foyers.reduce((min, foyer) => foyer ? Math.min(min, distance(milieu, foyer)) : min, Infinity);
    const dCote = distanceCoteSegment(a, b);
    const d = Math.min(dFoyer, dCote);
    if (d <= CONFIG.rayonMargeFinePx) return CONFIG.margeApprochePx;
    if (d <= CONFIG.rayonApprochePx || dCote <= CONFIG.rayonCotePx) return CONFIG.margeApprocheIntermediairePx;
    return CONFIG.margeCotePx;
  }

  function coutSegmentGrille(a, b, foyers = []) {
    const temps = tempsSegmentHeures(a, b);
    if (!Number.isFinite(temps)) return Infinity;
    if (segmentNavigable(a, b, { margePx: CONFIG.margeCotePx })) return temps;
    const marge = margeRoutePourSegment(a, b, foyers);
    if (marge >= CONFIG.margeApprocheIntermediairePx
      && segmentNavigable(a, b, { margePx: CONFIG.margeApprocheIntermediairePx })) {
      return temps;
    }
    if (marge >= CONFIG.margeApprochePx
      && segmentNavigable(a, b, { margePx: CONFIG.margeApprochePx })) {
      return temps;
    }
    return Infinity;
  }

  function plusProcheNoeudNavigable(point, options = {}) {
    const grille = getGrille();
    let meilleur = null;
    let meilleurDist = Infinity;
    let fallback = null;
    let fallbackDist = Infinity;
    const rayonMax = options.rayonMaxPx ?? Infinity;
    grille.nodes.forEach(node => {
      const d = distance(point, node);
      if (d > rayonMax) return;
      if (d < fallbackDist) {
        fallback = node;
        fallbackDist = d;
      }
      if (d < meilleurDist && segmentNavigable(point, node, {
        ignorerDepartDansTerre: true,
        margePx: Math.max(1, CONFIG.margeCotePx - 2),
      })) {
        meilleur = node;
        meilleurDist = d;
      }
    });
    return meilleur || fallback;
  }

  class MinHeap {
    constructor() { this.items = []; }
    push(item) {
      this.items.push(item);
      this.remonter(this.items.length - 1);
    }
    pop() {
      if (!this.items.length) return null;
      const top = this.items[0];
      const last = this.items.pop();
      if (this.items.length) {
        this.items[0] = last;
        this.descendre(0);
      }
      return top;
    }
    remonter(i) {
      while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        if (this.items[p].score <= this.items[i].score) break;
        [this.items[p], this.items[i]] = [this.items[i], this.items[p]];
        i = p;
      }
    }
    descendre(i) {
      for (; ;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.items.length && this.items[l].score < this.items[m].score) m = l;
        if (r < this.items.length && this.items[r].score < this.items[m].score) m = r;
        if (m === i) break;
        [this.items[m], this.items[i]] = [this.items[i], this.items[m]];
        i = m;
      }
    }
  }

  function reconstruire(cameFrom, currentKey, nodesByKey) {
    const path = [];
    while (currentKey) {
      path.push(nodesByKey.get(currentKey));
      currentKey = cameFrom.get(currentKey);
    }
    return path.reverse();
  }

  function segmentRaccourciNavigable(a, b, foyers = []) {
    if (segmentNavigable(a, b, { margePx: CONFIG.margeCotePx })) return true;
    return foyers.some(foyer =>
      foyer
      && distance({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, foyer) <= CONFIG.rayonApprochePx
      && segmentNavigable(a, b, { margePx: CONFIG.margeApprochePx })
    ) || (distanceCoteSegment(a, b) <= CONFIG.rayonCotePx
      && segmentNavigable(a, b, { margePx: CONFIG.margeApprochePx }));
  }

  function segmentRaccourciUtilisable(a, b, foyers = []) {
    return segmentRaccourciNavigable(a, b, foyers) && Number.isFinite(tempsSegmentHeures(a, b));
  }

  function segmentTerminalNavigable(a, b) {
    return segmentNavigable(a, b, { margePx: CONFIG.margeTerminalePx });
  }

  function simplifierRoute(points, foyers = []) {
    if (points.length <= 2) return points;
    const out = [points[0]];
    let ancre = points[0];
    for (let i = 2; i < points.length; i++) {
      if (points[i - 1].approche) {
        out.push(points[i - 1]);
        ancre = points[i - 1];
        continue;
      }
      if (!segmentRaccourciUtilisable(ancre, points[i], foyers)) {
        out.push(points[i - 1]);
        ancre = points[i - 1];
      }
    }
    out.push(points[points.length - 1]);
    return out;
  }

  function margeApprochePourSegment(a, b, foyer) {
    const milieu = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const d = distance(milieu, foyer);
    if (d <= CONFIG.rayonMargeFinePx) return CONFIG.margeApprochePx;
    if (d <= CONFIG.rayonMargeIntermediairePx) return CONFIG.margeApprocheIntermediairePx;
    return CONFIG.margeCotePx;
  }

  function optionsSegmentApproche(a, b, foyer) {
    return {
      ignorerDepartDansTerre: memePoint(a, foyer),
      ignorerArriveeDansTerre: memePoint(b, foyer),
    };
  }

  function pointApprocheAcceptable(point, foyer) {
    return memePoint(point, foyer) || pointNavigable(point, { margePx: CONFIG.margeTerminalePx });
  }

  function coutSegmentApproche(a, b, foyer, options = {}) {
    const margeMax = margeApprochePourSegment(a, b, foyer);
    const temps = tempsSegmentHeures(a, b);
    if (!Number.isFinite(temps)) return Infinity;
    const navOptions = {
      ...optionsSegmentApproche(a, b, foyer),
      ...options,
    };
    if (margeMax >= CONFIG.margeCotePx && segmentNavigable(a, b, { ...navOptions, margePx: CONFIG.margeCotePx })) {
      return temps;
    }
    if (margeMax >= CONFIG.margeApprocheIntermediairePx
      && segmentNavigable(a, b, { ...navOptions, margePx: CONFIG.margeApprocheIntermediairePx })) {
      return temps;
    }
    if (margeMax >= CONFIG.margeApprochePx
      && segmentNavigable(a, b, { ...navOptions, margePx: CONFIG.margeApprochePx })) {
      return temps;
    }
    return Infinity;
  }

  function routeLocaleFine(depart, arrivee, foyer) {
    if (Number.isFinite(coutSegmentApproche(depart, arrivee, foyer))) return [depart, arrivee];
    if (distance(depart, arrivee) > CONFIG.rayonApprochePx) return null;
    if (!pointApprocheAcceptable(depart, foyer)
      || !pointApprocheAcceptable(arrivee, foyer)) return null;

    const step = CONFIG.grilleApprochePx;
    const marge = Math.min(CONFIG.rayonApprochePx, Math.max(56, distance(depart, arrivee) + 48));
    const minX = Math.max(0, Math.floor((Math.min(depart.x, arrivee.x) - marge) / step) * step);
    const maxX = Math.min(CARTE_IMAGE.width, Math.ceil((Math.max(depart.x, arrivee.x) + marge) / step) * step);
    const minY = Math.max(0, Math.floor((Math.min(depart.y, arrivee.y) - marge) / step) * step);
    const maxY = Math.min(CARTE_IMAGE.height, Math.ceil((Math.max(depart.y, arrivee.y) + marge) / step) * step);
    const nodes = new Map();

    for (let y = minY; y <= maxY; y += step) {
      for (let x = minX; x <= maxX; x += step) {
        const p = { x, y, gx: Math.round((x - minX) / step), gy: Math.round((y - minY) / step), approche: true };
        if (Number.isFinite(coutSegmentApproche(p, p, foyer))) nodes.set(pointCle(p), p);
      }
    }

    const start = plusProcheLocal(depart, nodes);
    const goal = plusProcheLocal(arrivee, nodes);
    if (!start || !goal) return null;

    const open = new MinHeap();
    const cameFrom = new Map();
    const gScore = new Map();
    const nodesByKey = new Map();
    const closed = new Set();
    const startKey = pointCle(start);
    const goalKey = pointCle(goal);

    nodesByKey.set(startKey, start);
    nodesByKey.set(goalKey, goal);
    gScore.set(startKey, 0);
    open.push({ key: startKey, score: scoreHeuristiqueTemps(start, goal) });

    let iterations = 0;
    while (open.items.length && iterations++ < CONFIG.limiteIterations) {
      const current = open.pop();
      if (!current) break;
      if (closed.has(current.key)) continue;
      closed.add(current.key);
      if (current.key === goalKey) {
        const route = reconstruire(cameFrom, current.key, nodesByKey);
        if (Number.isFinite(coutSegmentApproche(depart, route[0], foyer))
          || segmentTerminalNavigable(depart, route[0])) route.unshift(depart);
        if (Number.isFinite(coutSegmentApproche(route[route.length - 1], arrivee, foyer))
          || segmentTerminalNavigable(route[route.length - 1], arrivee)) route.push(arrivee);
        return simplifierRouteApproche(route, foyer);
      }

      const node = nodesByKey.get(current.key);
      voisinsLocaux(node, nodes, minX, minY, step, foyer).forEach(({ node: next, cout }) => {
        const nextKey = pointCle(next);
        nodesByKey.set(nextKey, next);
        const tentative = (gScore.get(current.key) ?? Infinity) + cout;
        if (tentative >= (gScore.get(nextKey) ?? Infinity)) return;
        cameFrom.set(nextKey, current.key);
        gScore.set(nextKey, tentative);
        open.push({ key: nextKey, score: tentative + scoreHeuristiqueTemps(next, goal) });
      });
    }

    return null;
  }

  function routeFineRegionale(depart, arrivee) {
    const dist = distance(depart, arrivee);
    if (dist > CONFIG.rayonRouteRegionalePx) return null;
    const step = CONFIG.grilleRegionalePx;
    const marge = Math.min(180, Math.max(72, dist * 0.45));
    const minX = Math.max(0, Math.floor((Math.min(depart.x, arrivee.x) - marge) / step) * step);
    const maxX = Math.min(CARTE_IMAGE.width, Math.ceil((Math.max(depart.x, arrivee.x) + marge) / step) * step);
    const minY = Math.max(0, Math.floor((Math.min(depart.y, arrivee.y) - marge) / step) * step);
    const maxY = Math.min(CARTE_IMAGE.height, Math.ceil((Math.max(depart.y, arrivee.y) + marge) / step) * step);
    const nodes = new Map();

    for (let y = minY; y <= maxY; y += step) {
      for (let x = minX; x <= maxX; x += step) {
        const p = { x, y, gx: Math.round((x - minX) / step), gy: Math.round((y - minY) / step), approche: true };
        if (pointNavigable(p, { margePx: CONFIG.margeApprocheIntermediairePx })) nodes.set(pointCle(p), p);
      }
    }

    const start = plusProcheLocalRegional(depart, nodes);
    const goal = plusProcheLocalRegional(arrivee, nodes);
    if (!start || !goal) return null;

    const open = new MinHeap();
    const cameFrom = new Map();
    const gScore = new Map();
    const nodesByKey = new Map();
    const closed = new Set();
    const startKey = pointCle(start);
    const goalKey = pointCle(goal);

    nodesByKey.set(startKey, start);
    nodesByKey.set(goalKey, goal);
    gScore.set(startKey, 0);
    open.push({ key: startKey, score: scoreHeuristiqueTemps(start, goal) });

    let iterations = 0;
    while (open.items.length && iterations++ < CONFIG.limiteIterations) {
      const current = open.pop();
      if (!current) break;
      if (closed.has(current.key)) continue;
      closed.add(current.key);
      if (current.key === goalKey) {
        const route = reconstruire(cameFrom, current.key, nodesByKey);
        if (segmentTerminalNavigable(depart, route[0])) route.unshift(depart);
        if (segmentTerminalNavigable(route[route.length - 1], arrivee)) route.push(arrivee);
        return simplifierRouteApproche(route, depart);
      }

      const node = nodesByKey.get(current.key);
      voisinsRegionaux(node, nodes, minX, minY, step).forEach(({ node: next, cout }) => {
        const nextKey = pointCle(next);
        nodesByKey.set(nextKey, next);
        const tentative = (gScore.get(current.key) ?? Infinity) + cout;
        if (tentative >= (gScore.get(nextKey) ?? Infinity)) return;
        cameFrom.set(nextKey, current.key);
        gScore.set(nextKey, tentative);
        open.push({ key: nextKey, score: tentative + scoreHeuristiqueTemps(next, goal) });
      });
    }

    return null;
  }

  function plusProcheLocalRegional(point, nodes) {
    let meilleur = null;
    let meilleurDist = Infinity;
    nodes.forEach(node => {
      const d = distance(point, node);
      if (d < meilleurDist && segmentTerminalNavigable(point, node)) {
        meilleur = node;
        meilleurDist = d;
      }
    });
    return meilleur;
  }

  function voisinsRegionaux(node, nodes, minX, minY, step) {
    const deltas = deltasNavigation();
    const out = [];
    deltas.forEach(([dx, dy]) => {
      const p = {
        x: minX + (node.gx + dx) * step,
        y: minY + (node.gy + dy) * step,
        gx: node.gx + dx,
        gy: node.gy + dy,
        approche: true,
      };
      const voisin = nodes.get(pointCle(p));
      if (!voisin) return;
      const cout = coutSegmentRegional(node, voisin);
      if (Number.isFinite(cout)) out.push({ node: voisin, cout });
    });
    return out;
  }

  function coutSegmentRegional(a, b) {
    const temps = tempsSegmentHeures(a, b);
    if (!Number.isFinite(temps)) return Infinity;
    if (segmentNavigable(a, b, { margePx: CONFIG.margeApprocheIntermediairePx })) {
      return temps;
    }
    if (segmentNavigable(a, b, { margePx: CONFIG.margeApprochePx })) {
      return temps;
    }
    return Infinity;
  }

  function simplifierRouteApproche(points, foyer) {
    if (points.length <= 2) return points;
    const out = [points[0]];
    let i = 0;
    while (i < points.length - 1) {
      let meilleur = i + 1;
      for (let j = points.length - 1; j > i + 1; j--) {
        if (Number.isFinite(coutSegmentApproche(points[i], points[j], foyer))) {
          meilleur = j;
          break;
        }
      }
      out.push(points[meilleur]);
      i = meilleur;
    }
    return out;
  }

  function plusProcheLocal(point, nodes) {
    let meilleur = null;
    let meilleurDist = Infinity;
    let fallback = null;
    let fallbackDist = Infinity;
    nodes.forEach(node => {
      const d = distance(point, node);
      if (d < fallbackDist && segmentTerminalNavigable(point, node)) {
        fallback = node;
        fallbackDist = d;
      }
      if (d < meilleurDist && Number.isFinite(coutSegmentApproche(point, node, point))) {
        meilleur = node;
        meilleurDist = d;
      }
    });
    return meilleur || fallback;
  }

  function voisinsLocaux(node, nodes, minX, minY, step, foyer) {
    const deltas = deltasNavigation();
    const out = [];
    deltas.forEach(([dx, dy]) => {
      const p = {
        x: minX + (node.gx + dx) * step,
        y: minY + (node.gy + dy) * step,
        gx: node.gx + dx,
        gy: node.gy + dy,
      };
      const voisin = nodes.get(pointCle(p));
      if (voisin) {
        const cout = coutSegmentApproche(node, voisin, foyer);
        if (Number.isFinite(cout)) out.push({ node: voisin, cout });
      }
    });
    return out;
  }

  function calculerRoute(depart, arrivee) {
    if (typeof pointInMapBounds === 'function') {
      if (!pointInMapBounds(depart.x, depart.y))
        throw new Error('Le port de départ est hors des limites de la carte.');
      if (!pointInMapBounds(arrivee.x, arrivee.y))
        throw new Error('Le port d\'arrivée est hors des limites de la carte.');
    }
    if (Number.isFinite(coutSegmentGrille(depart, arrivee))) return [depart, arrivee];

    const routeRegionale = routeFineRegionale(depart, arrivee);
    if (routeRegionale) return routeRegionale;

    const starts = candidatsNoeudPassage(depart, arrivee);
    const goals = candidatsNoeudArrivee(arrivee, depart);
    const startFallback = plusProcheNoeudNavigable(depart, { rayonMaxPx: CONFIG.rayonAccrochePortPx });
    const goalFallback = plusProcheNoeudNavigable(arrivee, { rayonMaxPx: CONFIG.rayonAccrochePortPx });
    if (!starts.length && startFallback) {
      let cout = tempsSegmentHeures(depart, startFallback);
      if (!Number.isFinite(cout)) cout = coutTransitionTerminaleHeures(depart, startFallback);
      if (Number.isFinite(cout)) starts.push({ node: startFallback, approche: [depart, startFallback], cout });
    }
    if (!goals.length && goalFallback) {
      let cout = tempsSegmentHeures(goalFallback, arrivee);
      if (!Number.isFinite(cout)) cout = coutTransitionTerminaleHeures(goalFallback, arrivee);
      if (Number.isFinite(cout)) goals.push({ node: goalFallback, approche: [goalFallback, arrivee], cout });
    }
    if (!starts.length || !goals.length) throw new Error('Aucun chenal navigable proche du depart ou de l arrivee.');

    const open = new MinHeap();
    const cameFrom = new Map();
    const gScore = new Map();
    const nodesByKey = new Map();
    const closed = new Set();
    const approchesDepart = new Map();
    const approchesArrivee = new Map();
    const goalKeys = new Set();

    goals.forEach(({ node, approche }) => {
      const key = pointCle(node);
      nodesByKey.set(key, node);
      goalKeys.add(key);
      approchesArrivee.set(key, approche);
    });

    starts.forEach(({ node, approche, cout }) => {
      const key = pointCle(node);
      nodesByKey.set(key, node);
      approchesDepart.set(key, approche);
      gScore.set(key, cout);
      const meilleureDistanceBut = goals.reduce((min, goal) => Math.min(min, scoreHeuristiqueTemps(node, goal.node)), Infinity);
      open.push({ key, score: cout + meilleureDistanceBut });
    });

    let iterations = 0;
    while (open.items.length && iterations++ < CONFIG.limiteIterations) {
      const current = open.pop();
      if (!current) break;
      if (closed.has(current.key)) continue;
      closed.add(current.key);
      if (goalKeys.has(current.key)) {
        let route = reconstruire(cameFrom, current.key, nodesByKey);
        const approcheDepart = approchesDepart.get(pointCle(route[0]));
        const approcheArrivee = approchesArrivee.get(pointCle(route[route.length - 1]));
        if (approcheDepart) route = approcheDepart.slice(0, -1).concat(route);
        if (approcheArrivee) route = route.concat(approcheArrivee.slice(1));
        return simplifierRoute(route, [depart, arrivee]);
      }

      const node = nodesByKey.get(current.key);
      const foyersRoute = [depart, arrivee];
      voisins(node, foyersRoute).forEach(({ node: next, cout }) => {
        const nextKey = pointCle(next);
        nodesByKey.set(nextKey, next);
        let fromKey = current.key;
        let fromNode = node;
        const parentKey = cameFrom.get(current.key);
        const parentNode = parentKey ? nodesByKey.get(parentKey) : null;
        if (parentNode && segmentRaccourciUtilisable(parentNode, next, foyersRoute)) {
          fromKey = parentKey;
          fromNode = parentNode;
        }
        let coutDepuisFrom = cout;
        if (fromNode !== node) {
          const coutRaccourci = tempsSegmentHeures(fromNode, next);
          if (Number.isFinite(coutRaccourci)) {
            coutDepuisFrom = coutRaccourci;
          } else {
            fromKey = current.key;
            fromNode = node;
          }
        }
        const tentative = (gScore.get(fromKey) ?? Infinity) + coutDepuisFrom;
        if (tentative >= (gScore.get(nextKey) ?? Infinity)) return;
        cameFrom.set(nextKey, fromKey);
        gScore.set(nextKey, tentative);
        const meilleureDistanceBut = goals.reduce((min, goal) => Math.min(min, scoreHeuristiqueTemps(next, goal.node)), Infinity);
        open.push({ key: nextKey, score: tentative + meilleureDistanceBut });
      });
    }

    throw new Error('Aucune route maritime trouvee avec la grille actuelle.');
  }

  function candidatsNoeudPassage(point, autrePoint) {
    const grille = getGrille();
    const preselection = [];
    grille.nodes.forEach(node => {
      const d = distance(point, node);
      if (d > CONFIG.rayonApprochePx) return;
      preselection.push({
        node,
        score: d + distance(node, autrePoint) * 0.08,
      });
    });
    const candidats = [];
    preselection.sort((a, b) => a.score - b.score).slice(0, 10).forEach(({ node }) => {
      const approche = routeLocaleFine(point, node, point);
      const routeApproche = approche || [point, node];
      const cout = approche ? dureeRouteHeures(approche) : coutTransitionTerminaleHeures(point, node);
      if (!Number.isFinite(cout)) return;
      candidats.push({
        node,
        approche: routeApproche,
        cout,
        score: cout + heuristiqueTemps(node, autrePoint),
      });
    });
    candidats.sort((a, b) => a.score - b.score);
    return candidats.slice(0, 5);
  }

  function candidatsNoeudArrivee(point, autrePoint) {
    const grille = getGrille();
    const preselection = [];
    grille.nodes.forEach(node => {
      const d = distance(point, node);
      if (d > CONFIG.rayonApprochePx) return;
      preselection.push({
        node,
        score: d + distance(node, autrePoint) * 0.08,
      });
    });
    const candidats = [];
    preselection.sort((a, b) => a.score - b.score).slice(0, 10).forEach(({ node }) => {
      const approche = routeLocaleFine(node, point, point);
      const routeApproche = approche || [node, point];
      const cout = approche ? dureeRouteHeures(approche) : coutTransitionTerminaleHeures(node, point);
      if (!Number.isFinite(cout)) return;
      candidats.push({
        node,
        approche: routeApproche,
        cout,
        score: cout + heuristiqueTemps(autrePoint, node),
      });
    });
    candidats.sort((a, b) => a.score - b.score);
    return candidats.slice(0, 5);
  }

  function meilleureApprocheArrivee(route, arrivee) {
    const candidats = [];
    const debut = Math.max(0, route.length - 3);
    for (let i = route.length - 1; i >= debut; i--) {
      const point = route[i];
      const approche = routeLocaleFine(point, arrivee, arrivee);
      if (approche) {
        candidats.push(route.slice(0, i + 1).concat(approche.slice(1)));
      } else if (segmentTerminalNavigable(point, arrivee)
        || segmentNavigable(point, arrivee, {
          ignorerArriveeDansTerre: true,
          margePx: Math.max(1, CONFIG.margeCotePx - 2),
        })) {
        candidats.push(route.slice(0, i + 1).concat([arrivee]));
      }
    }
    if (!candidats.length) return null;
    return candidats.reduce((meilleur, courant) =>
      dureeRouteHeures(courant) < dureeRouteHeures(meilleur) ? courant : meilleur
    );
  }

  function portsDisponibles() {
    if (typeof VILLES === 'undefined') return [];
    const annee = typeof anneeActive !== 'undefined'
      ? anneeActive
      : (typeof CARTE_ANNEE_REFERENCE !== 'undefined' ? CARTE_ANNEE_REFERENCE : Infinity);
    const mj = typeof modeMJ !== 'undefined' ? modeMJ : false;
    return VILLES
      .filter(v => {
        if (!coordsValides(v.coords)) return false;
        if (v.type !== 'port' && !coordsValides(v.rade)) return false; // port OU rade explicite
        if (v.visible_mj && !mj) return false;
        if (String(v.rang ?? '1') === '3' && !mj) return false;
        if (v.visible_de && annee < v.visible_de) return false;
        return true;
      })
      .sort((a, b) => normaliserTexte(a.nom).localeCompare(normaliserTexte(b.nom), 'fr'));
  }

  function trouverPort(valeur) {
    const brut = String(valeur || '').trim();
    const q = normaliserTexte(brut);
    if (!q) return null;
    // Cas spécial : navire-PJ
    if (brut === '_navire_pj') return entreeNavirePJ();
    const ports = portsDisponibles();
    return ports.find(v => normaliserTexte(v.nom) === q || normaliserTexte(v.label) === q || v.id === brut)
      || ports.find(v => (v.tags || []).some(tag => normaliserTexte(tag) === q))
      || ports.find(v => normaliserTexte(v.nom).includes(q) || normaliserTexte(v.label).includes(q))
      || ports.find(v => (v.tags || []).some(tag => normaliserTexte(tag).includes(q)));
  }

  function surlignerMatch(texte, qLow) { return window.RC.surlignerMatch(texte, qLow); }
  function escapeHtml(str) { return window.RC.escapeHtml(str); }

  // ── Entrée synthétique navire-PJ ──────────────────────────────────────────
  // Retourne un objet compatible avec VILLES, ou null si position absente/invalide/hors bornes.
  function entreeNavirePJ() {
    const pos = (typeof CARTE_NAVIRE_POSITION !== 'undefined'
      && Array.isArray(CARTE_NAVIRE_POSITION)
      && CARTE_NAVIRE_POSITION.length >= 2
      && Number.isFinite(CARTE_NAVIRE_POSITION[0])
      && Number.isFinite(CARTE_NAVIRE_POSITION[1]))
      ? CARTE_NAVIRE_POSITION : null;
    if (!pos) return null;
    if (typeof pointInMapBounds === 'function' && !pointInMapBounds(pos[0], pos[1])) return null;
    const nom = (typeof CARTE_NAVIRE !== 'undefined' && CARTE_NAVIRE.nom) || 'Navire';
    return {
      id:     '_navire_pj',
      nom,
      label:  nom,
      type:   'navire',
      coords: pos,
      tags:   ['navire', 'position navire', nom.toLowerCase()],
    };
  }

  function resultatsPorts(q) {
    const resultatsVilles = window.RC.rechercheVilles(q, { filtre: 'navig' });
    const navire = entreeNavirePJ();
    if (navire) {
      const qLow = window.RC.normaliser(q);
      const matchNavire = [navire.nom, ...navire.tags].some(t =>
        window.RC.normaliser(t).includes(qLow)
      );
      if (matchNavire) {
        return [
          { type: 'ville', item: navire, id: navire.id, nom: navire.nom,
            matchTag: navire.nom, territoire: null, parenthese: '' },
          ...resultatsVilles,
        ];
      }
    }
    return resultatsVilles;
  }

  function coordsValides(coords) {
    return Array.isArray(coords)
      && coords.length >= 2
      && Number.isFinite(coords[0])
      && Number.isFinite(coords[1]);
  }

  function longueurRoute(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) total += distance(points[i - 1], points[i]);
    return total;
  }

  function distanceRouteNm(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) total += distanceNm(points[i - 1], points[i]);
    return total;
  }

  function dureeRouteHeures(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const heures = tempsSegmentHeures(points[i - 1], points[i]);
      if (!Number.isFinite(heures)) return Infinity;
      total += heures;
    }
    return total;
  }

  function formatDureeHeures(heures) {
    if (!Number.isFinite(heures)) return 'durée indéterminée';
    let jours = Math.floor(heures / 24);
    let reste = Math.round(heures - jours * 24);
    if (reste === 24) {
      jours += 1;
      reste = 0;
    }
    if (jours > 0) return `${jours} j ${reste} h`;
    return `${reste} h`;
  }

  function formatDistanceMilles(distance) {
    const milles = Math.round(distance);
    return `${milles} ${milles > 1 ? 'milles' : 'mille'}`;
  }

  function segmentsAffichageNavigables(points) {
    for (let i = 1; i < points.length; i++) {
      if (!segmentNavigable(points[i - 1], points[i], { margePx: 0 })) return false;
    }
    return true;
  }

  function pointsAffichageRoute(points) {
    if (points.length <= 2) return points;
    const out = [points[0]];
    const rayon = 0.32;

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const next = points[i + 1];
      const d1 = distance(prev, cur);
      const d2 = distance(cur, next);
      const recul = Math.min(d1, d2) * rayon;
      if (recul < 2) {
        out.push(cur);
        continue;
      }

      const a = {
        x: cur.x + (prev.x - cur.x) / d1 * recul,
        y: cur.y + (prev.y - cur.y) / d1 * recul,
      };
      const b = {
        x: cur.x + (next.x - cur.x) / d2 * recul,
        y: cur.y + (next.y - cur.y) / d2 * recul,
      };
      const courbe = [a];
      for (let t = 0.1; t < 1; t += 0.1) {
        const u = 1 - t;
        courbe.push({
          x: u * u * a.x + 2 * u * t * cur.x + t * t * b.x,
          y: u * u * a.y + 2 * u * t * cur.y + t * t * b.y,
        });
      }
      courbe.push(b);

      if (segmentsAffichageNavigables([out[out.length - 1]].concat(courbe, [next]))) {
        out.push(...courbe);
      } else {
        out.push(cur);
      }
    }

    out.push(points[points.length - 1]);
    return out;
  }

  function tracer(points) {
    if (!carte || !pixelToLatLngFn) return;
    if (routeLayer) carte.removeLayer(routeLayer);
    const latlngs = pointsAffichageRoute(points).map(p => pixelToLatLngFn(p.x, p.y));
    routeLayer = L.layerGroup([
      L.polyline(latlngs, {
        color: '#141009',
        weight: 6,
        opacity: 0.75,
        dashArray: '8 7',
        pane: 'overlayPane',
      }),
      L.polyline(latlngs, {
        color: '#1677ff',
        weight: 3,
        opacity: 0.98,
        dashArray: '8 7',
        pane: 'overlayPane',
      }),
    ]).addTo(carte);
    routeLayer.eachLayer(layer => layer.bringToFront?.());
  }

  function pointRoutePort(port) {
    const coords = coordsValides(port.rade) ? port.rade : port.coords;
    return { x: coords[0], y: coords[1] };
  }

  function initChampPort(input, fantome, suggestions) {
    if (!input || !fantome || !suggestions) return;

    // Parent d'origine du volet suggestions (pour le remettre à sa place à la fermeture)
    const suggestionsParent = suggestions.parentNode;

    function positionnerSuggestions() {
      // Hors modale : position absolute standard dans le champ, rien à faire.
      if (!suggestions.closest('#nav-modale')) return;
      const volet = document.getElementById('nav-jaillot-volet');
      if (!volet) return;
      const rect = input.getBoundingClientRect();
      volet.style.top    = rect.bottom + 'px';
      volet.style.left   = rect.left   + 'px';
      volet.style.width  = rect.width  + 'px';
      volet.style.display = 'block';
      if (suggestions.parentNode !== volet) volet.appendChild(suggestions);
    }

    function rendreItem({ item, nom, matchTag, parenthese }, qLow) {
      const nomMatch  = normaliserTexte(matchTag) === normaliserTexte(nom);
      const matchHtml = nomMatch ? '' :
        `<span class="carte-recherche-suggestion-match">${surlignerMatch(matchTag, qLow)}</span>`;
      return `<li class="carte-recherche-suggestion nav-jaillot-suggestion" role="option"
        data-id="${escapeHtml(item.id)}" data-nom="${escapeHtml(nom)}" data-matchtag="${escapeHtml(matchTag)}">
        <span class="carte-recherche-suggestion-nom">${surlignerMatch(nom, qLow)}${parenthese}</span>
        ${matchHtml}
      </li>`;
    }

    const champ = window.RC.initChampRecherche(input, fantome, suggestions, {
      obtenirResultats: q => resultatsPorts(q),
      rendreItem,
      onChoisir: (li, valeur, gh) => {
        input.value         = valeur;
        input.dataset.portId = li.dataset.id || '';
        // remettre le <ul> à sa place et cacher le volet
        const volet = document.getElementById('nav-jaillot-volet');
        if (volet && suggestions.parentNode === volet) {
          suggestionsParent.appendChild(suggestions);
          volet.style.display = 'none';
        }
        input.focus();
      },
      onEchap: () => {
        input.value          = '';
        input.dataset.portId = '';
      },
      onPositionner: positionnerSuggestions,
      onBlur: () => {
        const port = trouverPort(input.dataset.portId || input.value);
        if (port && normaliserTexte(input.value) === normaliserTexte(port.nom)) {
          input.dataset.portId = port.id;
        } else if (!port) {
          input.dataset.portId = '';
        }
        champ.vider();
        // remettre le <ul> à sa place si nécessaire
        const volet = document.getElementById('nav-jaillot-volet');
        if (volet && suggestions.parentNode === volet) {
          suggestionsParent.appendChild(suggestions);
          volet.style.display = 'none';
        }
      },
      msgAucunResultat: 'Aucun port',
    });
  }

  function syncEncadreMJ(navVal, catVal) {
    // Synchronise tous les controles Test MJ (panneau + modale) sur les valeurs courantes
    [document.getElementById('nav-jaillot-nav-val'), document.getElementById('nav-modale-nav-val')]
      .forEach(el => { if (el && navVal !== null) el.value = navVal; });
    [document.getElementById('nav-jaillot-cat-val'), document.getElementById('nav-modale-cat-val')]
      .forEach(el => { if (el && catVal !== null) el.value = catVal; });
  }

  function bindEncadreMJ(bloc, idNavMoins, idNavPlus, idNavVal, idCatMoins, idCatPlus, idCatVal) {
    if (!bloc || bloc.dataset.mjBound) return;
    bloc.dataset.mjBound = '1';

    function appliquerNav(val) {
      const n = Math.max(0, Math.min(5, Math.round(val)));
      syncEncadreMJ(n, null);
      if (typeof window.setNiveauNavigation === 'function') window.setNiveauNavigation(n);
      majBoutonsNavire();
      if (document.getElementById('navire-modale-overlay')?.classList.contains('navire-modale-overlay--visible')) {
        rendreSelectNavire();
        rendreFicheNavire();
      }
    }
    function appliquerCat(val) {
      const n = Math.max(1, Math.min(5, Math.round(val)));
      syncEncadreMJ(null, n);
      if (typeof window.setCategorieTailleTest === 'function') window.setCategorieTailleTest(n);
      majBoutonsNavire();
      if (document.getElementById('navire-modale-overlay')?.classList.contains('navire-modale-overlay--visible')) {
        rendreFicheNavire();
      }
    }

    const navMoins = document.getElementById(idNavMoins);
    const navPlus = document.getElementById(idNavPlus);
    const navInput = document.getElementById(idNavVal);
    const catMoins = document.getElementById(idCatMoins);
    const catPlus = document.getElementById(idCatPlus);
    const catInput = document.getElementById(idCatVal);

    navMoins?.addEventListener('click', () => appliquerNav(Number(navInput.value) - 1));
    navPlus?.addEventListener('click', () => appliquerNav(Number(navInput.value) + 1));
    navInput?.addEventListener('change', () => appliquerNav(Number(navInput.value)));
    navInput?.addEventListener('input', () => { const v = Number(navInput.value); if (Number.isFinite(v)) appliquerNav(v); });

    catMoins?.addEventListener('click', () => appliquerCat(Number(catInput.value) - 1));
    catPlus?.addEventListener('click', () => appliquerCat(Number(catInput.value) + 1));
    catInput?.addEventListener('change', () => appliquerCat(Number(catInput.value)));
    catInput?.addEventListener('input', () => { const v = Number(catInput.value); if (Number.isFinite(v)) appliquerCat(v); });
  }

  function initEncadreMJPanneau(panneau) {
    const bloc = panneau.querySelector('#nav-jaillot-test-mj');
    if (!bloc) return;
    if (!window.modeMJ) { bloc.classList.remove('visible'); return; }
    bloc.classList.add('visible');
    // Synchroniser les valeurs courantes à l'affichage
    syncEncadreMJ(
      typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0,
      typeof categorieTailleTest !== 'undefined' && categorieTailleTest > 0 ? categorieTailleTest : 1
    );
    bindEncadreMJ(bloc,
      'nav-jaillot-nav-moins', 'nav-jaillot-nav-plus', 'nav-jaillot-nav-val',
      'nav-jaillot-cat-moins', 'nav-jaillot-cat-plus', 'nav-jaillot-cat-val'
    );
  }

  function invaliderCacheHautsFonds() {
    hautsFondsIndexCache = null;
    zonesNavigationIndexCache = null;
    oceanBoundsIndexCache = null;
    courantsIndexCache = null; // les courants filtres par niveauNavigation changent le cout des segments
    grilleCache = null;        // la grille filtre les nodes selon les hauts-fonds
    navigabiliteCache.clear(); // les segments bloques/libres dependent du niveau Nav et de la categorie
    ventPointCache.clear();    // le vent est conditionne par modificateurActif(2)
    courantPointCache.clear(); // les courants sont conditionnes par modificateurActif(1)
    tempsSegmentCache.clear(); // les temps de segment integrent vent et courant
  }
  window.invaliderCacheHautsFonds = invaliderCacheHautsFonds;

  // ── SVG partagés ─────────────────────────────────────────────────────────

  // Barre à roues — symbole "Tracer route" (panneau ville + bouton pilote navire)
  const SVG_BARRE_ROUES = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
    ${[0,45,90,135,180,225,270,315].map(a => {
      const r = a * Math.PI / 180;
      const x1 = (12 + Math.cos(r)*3.2).toFixed(2), y1 = (12 + Math.sin(r)*3.2).toFixed(2);
      const x2 = (12 + Math.cos(r)*9).toFixed(2),   y2 = (12 + Math.sin(r)*9).toFixed(2);
      const hx = (12 + Math.cos(r)*10.8).toFixed(2), hy = (12 + Math.sin(r)*10.8).toFixed(2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="1.5"/>`;
    }).join('')}
  </svg>`;

  // Compas de navigation — icône "Calculateur d'itinéraire"
  const SVG_COMPAS = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <polygon points="12,4 13.2,11 12,12.8 10.8,11" fill="currentColor"/>
    <polygon points="12,20 10.8,13 12,11.2 13.2,13" fill="currentColor" opacity="0.4"/>
    <circle cx="12" cy="12" r="1.4" fill="currentColor"/>
  </svg>`;

  // Silhouette navire — icône "Navire"
  const SVG_NAVIRE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="3" x2="12" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <polygon points="12,7 18,13 6,13" fill="currentColor" opacity="0.55"/>
    <path d="M4 14 Q12 20 20 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`;

  // ── Tooltip avec délai ────────────────────────────────────────────────────
  function initTooltip(btn, delaiMs = 600) {
    let timer = null;
    btn.addEventListener('mouseenter', () => {
      timer = setTimeout(() => btn.classList.add('tooltip-visible'), delaiMs);
    });
    btn.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      btn.classList.remove('tooltip-visible');
    });
  }

  // ── Afficher résultat dans le volet bandeau ───────────────────────────────
  function afficherResultatOutils(dureeH, distanceNm, segments) {
    const volet  = document.getElementById('nav-outils-resultat');
    const valeur = document.getElementById('nav-outils-resultat-valeur');
    const detail = document.getElementById('nav-outils-resultat-detail');
    if (!volet || !valeur || !detail) return;
    valeur.textContent = `${formatDureeHeures(dureeH)} · ${formatDistanceMilles(distanceNm)}`;
    detail.textContent = segments > 1 ? `${segments} segments` : '';
    volet.classList.add('visible');
  }

  function masquerResultatOutils() {
    document.getElementById('nav-outils-resultat')?.classList.remove('visible');
  }

  // ── Départ navire-PJ ─────────────────────────────────────────────────────
  function etapeDepartNavire() {
    const navire = entreeNavirePJ();
    if (navire) return { portId: navire.id, valeur: navire.nom };
    // Fallback : position invalide ou hors bornes → champ vide
    return { portId: '', valeur: '' };
  }

  /**
   * Ouvre la modale Options avancées avec un port de destination prérempli.
   * A = position navire-PJ (ou Nassau), B = port destination.
   * Appelée depuis le bouton "Tracer route" du panneau ville.
   */
  function ouvrirModaleAvecDestination(portId, nomPort) {
    const depart = etapeDepartNavire();
    const arrivee = { portId: portId || '', valeur: nomPort || '' };
    cacheEtapes = [depart, arrivee];
    snapshotPanneau = null;
    ouvrirModale();
  }

  // ── initOutilsPilote ─────────────────────────────────────────────────────
  function initOutilsPilote() {
    if (!accesPiloteAutomatique()) return;
    const conteneur = document.getElementById('nav-outils-pilote');
    if (!conteneur) return;
    conteneur.classList.add('visible');

    const btnCalc   = document.getElementById('nav-outil-calculateur');
    const btnNavire = document.getElementById('nav-outil-navire');
    if (!btnCalc || !btnNavire) return;

    btnCalc.innerHTML   = SVG_COMPAS;
    btnNavire.innerHTML = SVG_NAVIRE;

    initTooltip(btnCalc);
    initTooltip(btnNavire);

    if (conteneur.dataset.piloteBound === '1') return;
    conteneur.dataset.piloteBound = '1';

    btnCalc.addEventListener('click', () => {
      if (!cacheEtapes) {
        const depart = etapeDepartNavire();
        cacheEtapes = [depart, { portId: '', valeur: '' }];
        snapshotPanneau = null;
      }
      ouvrirModale();
    });

    btnNavire.addEventListener('click', () => ouvrirModaleNavire());
  }

  function initUI() {
    if (!accesPiloteAutomatique()) return;

    // Conteneur global pour les volets téléportés hors de la modale
    if (!document.getElementById('nav-jaillot-volet')) {
      const volet = document.createElement('div');
      volet.id = 'nav-jaillot-volet';
      volet.style.cssText = 'position:fixed;z-index:10020;display:none;';
      document.body.appendChild(volet);
    }

    const slot = document.getElementById('nav-jaillot-slot');
    const wrap = document.getElementById('carte-wrap');
    const cible = slot || wrap;
    if (!cible || document.getElementById('nav-jaillot')) return;

    const panneau = document.createElement('section');
    panneau.id = 'nav-jaillot';
    panneau.className = 'nav-jaillot';
    panneau.innerHTML = `
      <div class="nav-jaillot-titre">Calculateur d'itinéraire</div>
      <div class="nav-jaillot-ligne">
        <span class="nav-jaillot-lettre">A</span>
        <div class="nav-jaillot-champ carte-recherche-wrap">
          <input id="nav-jaillot-a" class="carte-recherche-input" autocomplete="off" placeholder="Départ"
            role="combobox" aria-autocomplete="list" aria-expanded="false">
          <span class="nav-jaillot-fantome carte-recherche-fantome" id="nav-jaillot-a-fantome" aria-hidden="true"></span>
          <ul class="nav-jaillot-suggestions carte-recherche-suggestions" id="nav-jaillot-a-suggestions" role="listbox"></ul>
        </div>
      </div>
      <div class="nav-jaillot-ligne">
        <span class="nav-jaillot-lettre">B</span>
        <div class="nav-jaillot-champ carte-recherche-wrap">
          <input id="nav-jaillot-b" class="carte-recherche-input" autocomplete="off" placeholder="Arrivée"
            role="combobox" aria-autocomplete="list" aria-expanded="false">
          <span class="nav-jaillot-fantome carte-recherche-fantome" id="nav-jaillot-b-fantome" aria-hidden="true"></span>
          <ul class="nav-jaillot-suggestions carte-recherche-suggestions" id="nav-jaillot-b-suggestions" role="listbox"></ul>
        </div>
      </div>
      <div class="nav-jaillot-ligne nav-jaillot-ligne--actions">
        <button id="nav-jaillot-swap" type="button" title="Intervertir">↔</button>
        <button id="nav-jaillot-tracer" type="button">Tracer</button>
        <button id="nav-jaillot-effacer" type="button" title="Effacer">×</button>
      </div>
      <div class="nav-jaillot-resultat" id="nav-jaillot-resultat"></div>
      <div class="nav-jaillot-test-mj" id="nav-jaillot-test-mj" aria-hidden="true">
        <div class="nav-jaillot-test-mj-titre">Test MJ</div>
        <div class="nav-jaillot-test-mj-ligne">
          <span class="nav-jaillot-test-mj-label">Niveau Nav</span>
          <div class="nav-jaillot-test-mj-ctrl">
            <button type="button" id="nav-jaillot-nav-moins" aria-label="Diminuer">&#x2212;</button>
            <input type="number" id="nav-jaillot-nav-val" min="0" max="5" value="0">
            <button type="button" id="nav-jaillot-nav-plus" aria-label="Augmenter">+</button>
          </div>
        </div>
        <div class="nav-jaillot-test-mj-ligne">
          <span class="nav-jaillot-test-mj-label">Cat. navire</span>
          <div class="nav-jaillot-test-mj-ctrl">
            <button type="button" id="nav-jaillot-cat-moins" aria-label="Diminuer">&#x2212;</button>
            <input type="number" id="nav-jaillot-cat-val" min="1" max="5" value="1">
            <button type="button" id="nav-jaillot-cat-plus" aria-label="Augmenter">+</button>
          </div>
        </div>
      </div>
    `;
    L.DomEvent.disableClickPropagation(panneau);
    L.DomEvent.disableScrollPropagation(panneau);
    cible.appendChild(panneau);

    initEncadreMJPanneau(panneau);
    majBoutonsNavire();

    const inputA = panneau.querySelector('#nav-jaillot-a');
    const inputB = panneau.querySelector('#nav-jaillot-b');
    const resultat = panneau.querySelector('#nav-jaillot-resultat');
    const nassau = trouverPort('nassau');
    if (nassau) {
      inputA.value = nassau.nom;
      inputA.dataset.portId = nassau.id;
    }

    initChampPort(inputA, panneau.querySelector('#nav-jaillot-a-fantome'), panneau.querySelector('#nav-jaillot-a-suggestions'));
    initChampPort(inputB, panneau.querySelector('#nav-jaillot-b-fantome'), panneau.querySelector('#nav-jaillot-b-suggestions'));

    panneau.querySelector('#nav-jaillot-swap').addEventListener('click', () => {
      [inputA.value, inputB.value] = [inputB.value, inputA.value];
      [inputA.dataset.portId, inputB.dataset.portId] = [inputB.dataset.portId || '', inputA.dataset.portId || ''];
    });

    panneau.querySelector('#nav-jaillot-effacer').addEventListener('click', () => {
      if (routeLayer) {
        carte.removeLayer(routeLayer);
        routeLayer = null;
      }
      resultat.textContent = '';
    });

    panneau.querySelector('#nav-jaillot-tracer').addEventListener('click', () => {
      const a = trouverPort(inputA.dataset.portId || inputA.value);
      const b = trouverPort(inputB.dataset.portId || inputB.value);
      if (!a || !b) {
        resultat.textContent = 'Port introuvable.';
        return;
      }
      inputA.value = a.nom;
      inputA.dataset.portId = a.id;
      inputB.value = b.nom;
      inputB.dataset.portId = b.id;
      resultat.textContent = 'Calcul...';
      setTimeout(() => {
        try {
          const route = calculerRoute(pointRoutePort(a), pointRoutePort(b));
          tracer(route);
          const duree = dureeRouteHeures(route);
          const distance = distanceRouteNm(route);
          resultat.textContent = `${formatDureeHeures(duree)} · ${formatDistanceMilles(distance)}`;
        } catch (err) {
          resultat.textContent = err.message || 'Route impossible.';
        }
      }, 20);
    });
  }

  // ── Modale Options avancées ──────────────────────────────────────────────

  // Lettres assignées aux étapes dans l'ordre
  const LETTRES = 'ABCDEFGHIJ';
  const MAX_ETAPES = 10;

  // Cache persistant : survit aux fermetures accidentelles
  let cacheEtapes = null; // null = pas encore initialisé (ou purgé par Annuler)

  // Snapshot du formulaire principal au moment de la dernière fermeture de la modale.
  // Permet de détecter si le panneau a été modifié entre deux ouvertures.
  let snapshotPanneau = null; // { portIdA, valeurA, portIdB, valeurB }

  // État courant de la modale (null = fermée)
  let etatModale = null;

  // Drag-and-drop custom (pointer events — pas de draggable natif)
  const drag = {
    actif: false,
    srcIdx: -1,
    fantome: null,
    placeholder: null,
    offsetY: 0,
    hauteurItem: 0,
    clientY: 0,
    rafId: null,
    rectsAvantDeplacement: null, // snapshot FLIP des positions avant chaque déplacement
  };

  function poigneeDragStart(e, liSrc, index) {
    // Autoriser souris gauche (button=0) et touch (button=-1 ou 0 selon le navigateur)
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Ne pas interférer si le clic vient d'un input ou d'un bouton dans la ligne
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    e.preventDefault(); // empêche le scroll pendant le drag
    e.stopPropagation();

    const liste = document.getElementById('nav-modale-etapes');
    if (!liste) return;

    // Lire l'état DOM avant de commencer
    lireEtatDepuisDOM();

    // Mémoriser la position du li source AVANT de modifier le DOM
    const srcRect = liSrc.getBoundingClientRect();

    drag.actif = true;
    drag.srcIdx = index;
    drag.hauteurItem = srcRect.height;

    // Placeholder : démarre à hauteur cible (position initiale, pas d'animation au départ)
    drag.placeholder = document.createElement('li');
    drag.placeholder.className = 'nav-modale-etape nav-modale-etape--placeholder';
    drag.placeholder.style.height = drag.hauteurItem + 'px';
    liSrc.replaceWith(drag.placeholder);

    // Fantôme : clone visuel qui suit le curseur (position fixe depuis srcRect mémorisé)
    drag.fantome = liSrc.cloneNode(true);
    drag.fantome.className = 'nav-modale-etape nav-modale-etape--fantome';
    drag.fantome.style.cssText = `
      position: fixed;
      left: ${srcRect.left}px;
      top: ${srcRect.top}px;
      width: ${srcRect.width}px;
      z-index: 10020;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      opacity: 0.92;
    `;
    // Offset curseur→coin supérieur du li, pour un suivi naturel
    drag.offsetY = e.clientY - srcRect.top;
    document.body.appendChild(drag.fantome);

    // Démarrer la boucle d'auto-scroll
    drag.rafId = requestAnimationFrame(autoScrollLoop);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  }

  // Déplace le placeholder dans le DOM et anime les voisins par translateY.
  // Le placeholder garde une hauteur fixe — c'est le translateY des items qui crée l'illusion.
  function deplacerPlaceholder(clientY) {
    const liste = document.getElementById('nav-modale-etapes');
    if (!liste) return;

    const items = [...liste.querySelectorAll('.nav-modale-etape:not(.nav-modale-etape--placeholder)')];
    if (!items.length) return;

    // Trouver la position d'insertion selon le curseur
    let cibleAvant = null;
    for (const li of items) {
      const rect = li.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        cibleAvant = li;
        break;
      }
    }

    // Déplacer le placeholder dans le DOM seulement si la position a changé
    const ancienSuivant = drag.placeholder.nextSibling;
    const positionChange = cibleAvant
      ? ancienSuivant !== cibleAvant
      : ancienSuivant !== null;

    if (positionChange) {
      if (cibleAvant) {
        liste.insertBefore(drag.placeholder, cibleAvant);
      } else {
        liste.appendChild(drag.placeholder);
      }
    }

    // Calculer l'index du placeholder dans la liste complète
    const tousLesLi = [...liste.querySelectorAll('.nav-modale-etape')];
    const idxPlaceholder = tousLesLi.indexOf(drag.placeholder);

    // Appliquer un translateY à chaque item selon sa position relative au placeholder
    // Les items avant le placeholder : pas de décalage
    // Les items après le placeholder : décalés vers le bas de hauteurItem (placeholder pousse)
    // → mais comme le placeholder est DÉJÀ dans le DOM à la bonne place,
    //   le flux naturel fait déjà le travail. On anime juste la transition
    //   en partant de la position inverse, puis en laissant le CSS revenir à 0.
    //
    // Technique : on lit la position réelle de chaque item AVANT le déplacement (déjà fait),
    // puis APRÈS le déplacement on calcule le delta et on applique le translateY inverse,
    // puis on l'anime vers 0 via CSS transition.
    //
    // Implémentation : FLIP (First, Last, Invert, Play)
    if (positionChange) {
      // "Play" : appliquer le delta inverse calculé juste avant le déplacement,
      // puis animer vers 0 au frame suivant
      const rectsAvant = drag.rectsAvantDeplacement;
      if (rectsAvant) {
        items.forEach(li => {
          const avant = rectsAvant.get(li);
          if (!avant) return;
          const apres = li.getBoundingClientRect();
          const dy = avant.top - apres.top;
          if (Math.abs(dy) < 1) return;
          // Appliquer le décalage inverse instantanément (sans transition)
          li.style.transition = 'none';
          li.style.transform = `translateY(${dy}px)`;
          // Forcer reflow
          li.getBoundingClientRect();
          // Animer vers la position finale (transform: 0)
          li.style.transition = 'transform 0.18s ease';
          li.style.transform = '';
        });
      }
    }
  }

  // Mémorise les positions des items AVANT un déplacement du placeholder (pour FLIP)
  function snapshotPositions() {
    const liste = document.getElementById('nav-modale-etapes');
    if (!liste) return;
    const items = [...liste.querySelectorAll('.nav-modale-etape:not(.nav-modale-etape--placeholder)')];
    drag.rectsAvantDeplacement = new Map(items.map(li => [li, li.getBoundingClientRect()]));
  }

  // Boucle RAF pour l'auto-scroll : fait défiler le corps quand le curseur
  // est dans la zone de déclenchement (ZONE_SCROLL px depuis le bord).
  const ZONE_SCROLL = 44; // px
  const VITESSE_SCROLL_MAX = 12; // px par frame

  function autoScrollLoop() {
    if (!drag.actif) return;
    const corps = document.getElementById('nav-modale-corps');
    if (corps) {
      const rect = corps.getBoundingClientRect();
      const distHaut = drag.clientY - rect.top;
      const distBas = rect.bottom - drag.clientY;
      if (distHaut < ZONE_SCROLL && distHaut >= 0) {
        const vitesse = VITESSE_SCROLL_MAX * (1 - distHaut / ZONE_SCROLL);
        corps.scrollTop -= vitesse;
      } else if (distBas < ZONE_SCROLL && distBas >= 0) {
        const vitesse = VITESSE_SCROLL_MAX * (1 - distBas / ZONE_SCROLL);
        corps.scrollTop += vitesse;
      }
    }
    drag.rafId = requestAnimationFrame(autoScrollLoop);
  }

  function onPointerMove(e) {
    if (!drag.actif) return;

    const corps = document.getElementById('nav-modale-corps');
    const modale = document.getElementById('nav-modale');
    const header = modale?.querySelector('.nav-modale-header');
    const footer = modale?.querySelector('.nav-modale-footer');

    // Confiner le fantôme entre header et footer :
    // clamper le bord HAUT du fantôme entre yMin et yMax - hauteurItem
    let clientY = e.clientY;
    if (header && footer) {
      const yMin = header.getBoundingClientRect().bottom;
      const yMax = footer.getBoundingClientRect().top;
      // bord haut du fantôme = clientY - offsetY ; on le clamp entre yMin et yMax - hauteurItem
      const bordHaut = Math.max(yMin, Math.min(yMax - drag.hauteurItem, clientY - drag.offsetY));
      clientY = bordHaut + drag.offsetY;
    }

    drag.clientY = clientY; // mémorisé pour autoScrollLoop

    // Fantôme : confiné verticalement dans la modale
    drag.fantome.style.top = (clientY - drag.offsetY) + 'px';

    // Snapshot des positions AVANT le déplacement (pour FLIP)
    snapshotPositions();
    deplacerPlaceholder(clientY);
  }

  function onPointerUp() {
    if (!drag.actif) return;
    drag.actif = false;

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);

    // Nettoyer le fantôme et l'auto-scroll
    drag.fantome?.remove();
    drag.fantome = null;
    if (drag.rafId) { cancelAnimationFrame(drag.rafId); drag.rafId = null; }

    // Nettoyer les transforms résiduels et lire la position finale du placeholder
    const liste = document.getElementById('nav-modale-etapes');
    let dstIdx = drag.srcIdx; // fallback : pas de déplacement
    if (liste) {
      [...liste.querySelectorAll('.nav-modale-etape')].forEach(li => {
        li.style.transform = '';
        li.style.transition = '';
      });
      const tousLesLi = [...liste.querySelectorAll('.nav-modale-etape')];
      const idxDOM = tousLesLi.indexOf(drag.placeholder);
      if (idxDOM >= 0) dstIdx = idxDOM;
    }

    // Appliquer le déplacement dans etatModale puis re-rendre
    const [element] = etatModale.splice(drag.srcIdx, 1);
    etatModale.splice(dstIdx, 0, element);

    drag.srcIdx = -1;
    rendreEtapes();
  }

  function lettreEtape(index) {
    return LETTRES[index] || String(index + 1);
  }

  function etapeVide() {
    return { portId: '', valeur: '' };
  }

  function lireFormulairePrincipal() {
    const inputA = document.getElementById('nav-jaillot-a');
    const inputB = document.getElementById('nav-jaillot-b');
    return [
      { portId: inputA?.dataset.portId || '', valeur: inputA?.value || '' },
      { portId: inputB?.dataset.portId || '', valeur: inputB?.value || '' },
    ];
  }

  function ecrireFormulairePrincipal(etapes) {
    const inputA = document.getElementById('nav-jaillot-a');
    const inputB = document.getElementById('nav-jaillot-b');
    if (!inputA || !inputB) return;

    const a = etapes[0] || etapeVide();
    const b = etapes[etapes.length - 1] || etapeVide();

    inputA.value = a.valeur;
    inputA.dataset.portId = a.portId;
    inputB.value = b.valeur;
    inputB.dataset.portId = b.portId;

    const intermediaires = etapes.length - 2;
    let resume = document.getElementById('nav-jaillot-resume-etapes');
    if (intermediaires > 0) {
      if (!resume) {
        resume = document.createElement('div');
        resume.id = 'nav-jaillot-resume-etapes';
        resume.className = 'nav-jaillot-resume-etapes';
        const panneau = document.getElementById('nav-jaillot');
        const ligneB = panneau?.querySelector('.nav-jaillot-ligne:has(#nav-jaillot-b)');
        if (ligneB) panneau.insertBefore(resume, ligneB);
      }
      resume.textContent = `+ ${intermediaires} étape${intermediaires > 1 ? 's' : ''} intermédiaire${intermediaires > 1 ? 's' : ''}`;
    } else if (resume) {
      resume.remove();
    }
  }

  function creerLigneEtape(etape, index, total) {
    const li = document.createElement('li');
    li.className = 'nav-modale-etape';
    if (total <= 2) li.classList.add('nav-modale-etape--min');
    li.dataset.index = index;

    const inputId = `nav-modale-etape-${index}`;
    const fantomeId = `nav-modale-etape-fantome-${index}`;
    const suggestId = `nav-modale-etape-suggest-${index}`;

    li.innerHTML = `
      <div class="nav-modale-etape-poignee" aria-label="Déplacer">
        <span></span><span></span><span></span>
      </div>
      <span class="nav-modale-etape-lettre">${lettreEtape(index)}</span>
      <div class="nav-modale-etape-champ carte-recherche-wrap">
        <input id="${inputId}" class="carte-recherche-input"
          autocomplete="off" placeholder="Port…"
          role="combobox" aria-autocomplete="list" aria-expanded="false"
          value="${escapeHtml(etape.valeur)}"
          data-port-id="${escapeHtml(etape.portId)}">
        <span class="carte-recherche-fantome" id="${fantomeId}" aria-hidden="true"></span>
        <ul class="nav-jaillot-suggestions carte-recherche-suggestions" id="${suggestId}" role="listbox"></ul>
      </div>
      <button class="nav-modale-etape-suppr" type="button" aria-label="Supprimer cette étape">×</button>
    `;

    const input = li.querySelector('input');
    const fantome = li.querySelector(`#${fantomeId}`);
    const suggestions = li.querySelector(`#${suggestId}`);
    initChampPort(input, fantome, suggestions);

    input.addEventListener('change', () => {
      if (etatModale[index]) etatModale[index] = {
        portId: input.dataset.portId || '',
        valeur: input.value,
      };
    });
    input.addEventListener('input', () => {
      if (etatModale[index]) etatModale[index] = { portId: '', valeur: input.value };
    });

    li.querySelector('.nav-modale-etape-suppr').addEventListener('click', () => {
      etatModale.splice(index, 1);
      rendreEtapes();
    });

    // Drag custom — uniquement sur la poignée
    const poignee = li.querySelector('.nav-modale-etape-poignee');
    poignee.addEventListener('pointerdown', e => poigneeDragStart(e, li, index));

    return li;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function rendreEtapes() {
    const liste = document.getElementById('nav-modale-etapes');
    const btnAjouter = document.getElementById('nav-modale-ajouter');
    if (!liste) return;

    liste.innerHTML = '';
    etatModale.forEach((etape, i) => {
      liste.appendChild(creerLigneEtape(etape, i, etatModale.length));
    });

    // Désactiver "ajouter" si max atteint
    if (btnAjouter) btnAjouter.disabled = etatModale.length >= MAX_ETAPES;

    // Focus sur le dernier champ si nouvelle étape ajoutée
    const dernierInput = liste.querySelector('li:last-child input');
    if (dernierInput && document.activeElement !== dernierInput) {
      // Focus seulement si le champ est vide (ajout d'étape)
      if (!dernierInput.value) setTimeout(() => dernierInput.focus(), 50);
    }
  }

  function lireEtatDepuisDOM() {
    const inputs = document.querySelectorAll('#nav-modale-etapes .nav-modale-etape-champ input');
    inputs.forEach((input, i) => {
      if (etatModale[i]) {
        etatModale[i] = {
          portId: input.dataset.portId || '',
          valeur: input.value,
        };
      }
    });
  }

  function initControleNiveauNav() {
    const bloc = document.getElementById('nav-modale-test-mj');
    if (!bloc) return;
    if (!window.modeMJ) { bloc.classList.remove('visible'); return; }
    bloc.classList.add('visible');
    syncEncadreMJ(
      typeof niveauNavigation !== 'undefined' ? niveauNavigation : 0,
      typeof categorieTailleTest !== 'undefined' && categorieTailleTest > 0 ? categorieTailleTest : 1
    );
    bindEncadreMJ(bloc,
      'nav-modale-nav-moins', 'nav-modale-nav-plus', 'nav-modale-nav-val',
      'nav-modale-cat-moins', 'nav-modale-cat-plus', 'nav-modale-cat-val'
    );
  }

  // Badge de niveau de Navigation actif, affiché en permanence dans la modale
  // "options avancées" (nav-modale) — seul endroit où le tracé de route est
  // effectivement lancé. Rappelé depuis carte.js à chaque changement de niveau.
  // Le X de fermeture ayant été retiré du header, le badge occupe naturellement
  // sa place à droite (flex space-between sur .nav-modale-header, 2 enfants).
  function majBadgeNiveauNavModale() {
    const titre = document.getElementById('nav-modale-titre');
    if (!titre) return;
    let badge = document.getElementById('nav-modale-niveau-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'nav-modale-niveau-badge';
      badge.style.cssText = `
        display:inline-flex; align-items:center; flex:0 0 auto;
        font-family:'Cinzel',serif; font-size:0.72rem; font-weight:600;
        letter-spacing:0.06em; text-transform:uppercase;
        color:var(--ink); background:var(--gold);
        padding:0.3rem 0.7rem; border-radius:3px;
        box-shadow:0 1px 4px rgba(0,0,0,0.35);
      `;
      titre.insertAdjacentElement('afterend', badge);
    }
    const niveau = typeof niveauNavigation !== 'undefined' ? Number(niveauNavigation) : 0;
    badge.textContent = `Navigation ${Number.isFinite(niveau) ? niveau : 0}`;
  }
  window.majBadgeNiveauNavModale = majBadgeNiveauNavModale;
  window.addEventListener('navigation-level-change', majBadgeNiveauNavModale);

  function ouvrirModale() {
    const overlay = document.getElementById('nav-modale-overlay');
    const panneau = document.getElementById('nav-jaillot');
    if (!overlay) return;

    initControleNiveauNav();
    majBadgeNiveauNavModale();

    const depuisFormulaire = lireFormulairePrincipal();
    const panneauA = depuisFormulaire[0] || etapeVide();
    const panneauB = depuisFormulaire[1] || etapeVide();

    if (cacheEtapes && cacheEtapes.length >= 2) {
      // "Le dernier qui parle a raison" :
      // Si le panneau a été modifié depuis la dernière fermeture, il prime sur ce champ.
      // Sinon, le cache (état de la modale à la dernière fermeture) prime.
      const panneauModifieA = snapshotPanneau &&
        (panneauA.portId !== snapshotPanneau.portIdA || panneauA.valeur !== snapshotPanneau.valeurA);
      const panneauModifieB = snapshotPanneau &&
        (panneauB.portId !== snapshotPanneau.portIdB || panneauB.valeur !== snapshotPanneau.valeurB);

      const etapeA = panneauModifieA ? panneauA : cacheEtapes[0];
      const etapeB = panneauModifieB ? panneauB : cacheEtapes[cacheEtapes.length - 1];
      const intermediaires = cacheEtapes.slice(1, -1);
      etatModale = [etapeA, ...intermediaires, etapeB];
    } else {
      // Pas de cache : on repart du panneau principal
      etatModale = [panneauA, panneauB];
    }

    rendreEtapes();

    // Griser le formulaire principal
    if (panneau) panneau.classList.add('nav-jaillot--masque');

    // Afficher la modale
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('nav-modale-overlay--visible');

    // Focus sur le premier champ vide
    const premierVide = overlay.querySelector('input:placeholder-shown');
    setTimeout(() => (premierVide || overlay.querySelector('input'))?.focus(), 80);
  }

  function fermerModale(valider = false, annuler = false) {
    const overlay = document.getElementById('nav-modale-overlay');
    const panneau = document.getElementById('nav-jaillot');
    if (!overlay) return;

    if (valider) {
      // Tracer : lire l'état final, mettre à jour panneau + cache, purger le snapshot
      lireEtatDepuisDOM();
      cacheEtapes = etatModale.map(e => ({ ...e }));
      snapshotPanneau = null;
      ecrireFormulairePrincipal(etatModale);

      const ports = etatModale
        .map(e => trouverPort(e.portId || e.valeur))
        .filter(Boolean);
      if (ports.length >= 2) {
        tracerMultiEtapes(ports);
      }
    } else if (annuler) {
      // Annuler : purger le cache — la prochaine ouverture repartira du panneau principal
      cacheEtapes = null;
      snapshotPanneau = null;
    } else {
      // Fermeture neutre (croix, clic hors modale, Échap) :
      // sauvegarder l'état de la modale dans le cache, et mémoriser l'état actuel du panneau
      lireEtatDepuisDOM();
      cacheEtapes = etatModale.map(e => ({ ...e }));
      const depuisFormulaire = lireFormulairePrincipal();
      const pA = depuisFormulaire[0] || etapeVide();
      const pB = depuisFormulaire[1] || etapeVide();
      snapshotPanneau = {
        portIdA: pA.portId, valeurA: pA.valeur,
        portIdB: pB.portId, valeurB: pB.valeur,
      };
    }

    etatModale = null;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('nav-modale-overlay--visible');
    if (panneau) panneau.classList.remove('nav-jaillot--masque');
  }

  function tracerMultiEtapes(ports) {
    const resultat = document.getElementById('nav-modale-resultat');
    const resultatPrincipal = document.getElementById('nav-jaillot-resultat');
    if (resultat) resultat.textContent = 'Calcul en cours…';

    setTimeout(() => {
      try {
        // Calculer chaque segment et concaténer
        let routeComplete = [];
        let distanceTotaleNm = 0;
        let dureeTotaleH = 0;

        for (let i = 0; i < ports.length - 1; i++) {
          const segment = calculerRoute(
            pointRoutePort(ports[i]),
            pointRoutePort(ports[i + 1])
          );
          if (i === 0) {
            routeComplete = segment;
          } else {
            // Éviter de doubler le point de jonction
            routeComplete = routeComplete.concat(segment.slice(1));
          }
          distanceTotaleNm += distanceRouteNm(segment);
          dureeTotaleH += dureeRouteHeures(segment);
        }

        tracer(routeComplete);

        const resume = `${formatDureeHeures(dureeTotaleH)} · ${formatDistanceMilles(distanceTotaleNm)}`;
        if (resultat) resultat.textContent = resume;
        if (resultatPrincipal) resultatPrincipal.textContent = resume;
        // Volet résultat du bandeau outils MJ
        afficherResultatOutils(dureeTotaleH, distanceTotaleNm, ports.length - 1);

      } catch (err) {
        const msg = err.message || 'Route impossible.';
        if (resultat) resultat.textContent = msg;
        if (resultatPrincipal) resultatPrincipal.textContent = msg;
      }
    }, 20);
  }

  let modaleInitialisee = false;

  function initModale() {
    // Garde : initModale peut être appelé plusieurs fois si init() est rappelé
    if (modaleInitialisee) return;
    modaleInitialisee = true;

    const overlay = document.getElementById('nav-modale-overlay');
    if (!overlay) return;

    document.getElementById('nav-modale-annuler')?.addEventListener('click', () => fermerModale(false, true));
    document.getElementById('nav-modale-tracer')?.addEventListener('click', () => fermerModale(true, false));
    document.getElementById('nav-modale-navire')?.addEventListener('click', () => ouvrirModaleNavire());

    document.getElementById('nav-modale-ajouter')?.addEventListener('click', () => {
      if (etatModale && etatModale.length < MAX_ETAPES) {
        etatModale.push(etapeVide());
        rendreEtapes();
      }
    });

    fermerSurClicExterieurStrict(overlay, () => fermerModale(false));

    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') fermerModale(false);
    });
  }

  function init(options) {
    carte = options.carte;
    pixelToLatLngFn = options.pixelToLatLng;
    getTerres();
    initUI();
    initOutilsPilote();
    initModale();
    initModaleNavire();
    window.addEventListener('navigation-level-change', () => {
      initUI();
      initOutilsPilote();
      majBoutonsNavire();
    });
  }

  function inspecterPointNavigation(point) {
    const p = { x: Number(point?.x), y: Number(point?.y) };
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      throw new Error('Point d inspection invalide.');
    }
    const niveauNav = typeof niveauNavigation !== 'undefined' ? Number(niveauNavigation) : 0;
    const hautsFonds = getHautsFondsSegment(p, p)
      .filter(hautFond => pointDansHautFondItem(p, hautFond))
      .map(hautFond => ({
        id: hautFond.id || hautFond.label || null,
        label: hautFond.label || hautFond.id || 'Haut-fond',
        visibiliteNav: hautFond.visibiliteNav ?? 0,
        catMax: hautFond.catMax ?? CONFIG.categorieMaxHautsFonds,
        catMaxNav: hautFond.catMaxNav ?? hautFond.catMax ?? CONFIG.categorieMaxHautsFonds,
        passageNav: hautFond.passageNav ?? 99,
        interdit: navireInterditHautFond(hautFond),
      }));
    const navire = navireActif();
    const etat = etatNavireActif(navire);
    return {
      point: p,
      niveauNavigation: Number.isFinite(niveauNav) ? niveauNav : 0,
      modeNavigationMaritime: modeNavigationMaritime(),
      modificateurs: {
        courants: modificateurActif(1),
        vent: modificateurActif(2),
        deventement: modificateurActif(3),
      },
      navire: {
        id: navire.id,
        nom: navire.nom,
        categorieTaille: categorieTailleNavire(navire),
        encombrementPct: encombrementNavirePct(navire, etat),
        carenageApplicable: carenageApplicableNavire(navire),
        carenage: etat.carenage || null,
        modificateurVitesseNoeuds: modificateurVitesseActuelNoeuds(navire, etat),
        malusHauturier: !!navire.malusHauturier,
      },
      zoneNavigation: zoneNavigationEnPoint(p),
      courant: courantEnPoint(p),
      vent: ventEnPoint(p),
      hautsFonds,
      distanceCoteNm: distanceCotePointPreciseNm(p),
      attenuationCourantCote: attenuationCourantCote(p),
      navigablePoint: segmentNavigable(p, p),
    };
  }

  window.NavigationJaillot = {
    init,
    calculerRoute,
    inspecterPointNavigation,
    modeNavigationMaritime,
    segmentNavigable,
    zoneNavigationEnPoint,
    courantEnPoint,
    ventEnPoint,
    allureSegment,
    vitesseVoileSegmentNoeuds,
    navireActif,
    distanceNm,
    distanceRouteNm,
    dureeRouteHeures,
    formatDureeHeures,
    formatDistanceMilles,
    projectionCourantNoeuds,
    compensationCourantSegment,
    tempsSegmentHeures,
    millesNautiquesParPx,
    distanceCotePointNm,
    distanceCotePointPreciseNm,
    attenuationCourantCote,
    afficherResultatOutils,
    masquerResultatOutils,
    ouvrirModaleAvecDestination,
    config: CONFIG,
  };
})();
