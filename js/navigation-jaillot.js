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
  const DIRECTIONS_COURANT = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
    'S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const KMH_TO_KNOTS = 0.539956803;

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
  let courantsIndexCache = null;
  let deventementsIndexCache = null;

  function normaliserTexte(texte) {
    return String(texte || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function pointCle(p) {
    return `${Math.round(p.x)},${Math.round(p.y)}`;
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
    const vitesse = Number(navire.vitesseMoyenneNoeuds);
    if (Number.isFinite(vitesse) && vitesse > 0) return vitesse;
    const distanceJour = Number(navire.distanceMoyenneNmJour);
    if (Number.isFinite(distanceJour) && distanceJour > 0) return distanceJour / 24;
    return 105 / 24;
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
    if (angle < 179.5) return 'grandLargue';
    return 'ventArriere';
  }

  function vitesseNavireAllureNoeuds(allure) {
    if (allure === 'boutAuVent') return 0;
    const vitesses = navireActif().vitessesNoeuds || {};
    const vitesse = Number(vitesses[allure]);
    if (Number.isFinite(vitesse) && vitesse > 0) return vitesse;
    if (allure === 'ventArriere') {
      const grandLargue = Number(vitesses.grandLargue);
      if (Number.isFinite(grandLargue) && grandLargue > 0) return grandLargue;
    }
    return vitesseNavireMoyenneNoeuds();
  }

  function allureSegment(a, b, point) {
    const vent = ventEnPoint(point);
    const souffle = vent?.vecteur || directionVersVecteur(ventDominant().direction, 1);
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
    return vitesseNavireAllureNoeuds(allure);
  }

  function projectionCourantAuPointNoeuds(a, b, point) {
    const composantes = composantesCourantSegmentNoeuds(a, b, point);
    return composantes ? composantes.parallele : 0;
  }

  function vecteurCourantNoeuds(point) {
    const courant = courantEnPoint(point);
    if (!courant?.vecteur) return { x: 0, y: 0 };
    return {
      x: courant.vecteur.x * KMH_TO_KNOTS,
      y: courant.vecteur.y * KMH_TO_KNOTS,
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

  function getCourantsIndex() {
    if (courantsIndexCache) return courantsIndexCache;
    const source = typeof SEA_CURRENTS !== 'undefined' ? SEA_CURRENTS : [];
    courantsIndexCache = source.map(courant => {
      const anneaux = anneauxZoneSea(courant.zone);
      return {
        courant,
        bbox: bboxAnneauxSea(anneaux),
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
    const cl = courant.centerline || [];
    if (cl.length < 2) return 0;

    let meilleurIdx = 0;
    let meilleureDist = Infinity;
    const segmentCount = courant.closed ? cl.length : cl.length - 1;
    for (let i = 0; i < segmentCount; i++) {
      const a = { x: cl[i][0], y: cl[i][1] };
      const b = { x: cl[(i + 1) % cl.length][0], y: cl[(i + 1) % cl.length][1] };
      const d = distPointSegment(point, a, b);
      if (d < meilleureDist) {
        meilleureDist = d;
        meilleurIdx = i;
      }
    }
    return meilleurIdx;
  }

  function directionCourantAuPoint(courant, point) {
    const cl = courant.centerline || [];
    if (!cl.length) return courant.directions?.[0] || null;
    if (cl.length === 1) return courant.directions?.[0] || null;
    const index = segmentCourantAuPoint(courant, point);
    return courant.directions?.[index] || courant.directions?.[courant.directions.length - 1] || null;
  }

  function vitesseCourantAuPoint(courant, point) {
    const segments = courant.speedSegments || courant.vitesseSegments;
    if (!Array.isArray(segments) || !segments.length) {
      return Number(courant.speedKmh ?? courant.vitesseKmh ?? courant.force) || 0;
    }
    const index = segmentCourantAuPoint(courant, point);
    const segment = segments.find(seg => index >= seg.from && index <= seg.to)
      || segments.find(seg => seg.from == null && seg.to == null)
      || segments[segments.length - 1];
    return Number(segment.speedKmh ?? segment.vitesseKmh ?? courant.force) || 0;
  }

  function segmentVitesseCourantAuPoint(courant, point) {
    const segments = courant.speedSegments || courant.vitesseSegments;
    if (!Array.isArray(segments) || !segments.length) return null;
    const index = segmentCourantAuPoint(courant, point);
    return segments.find(seg => index >= seg.from && index <= seg.to) || null;
  }

  function attenuationMinimaleCourant(courant, point) {
    const segment = segmentVitesseCourantAuPoint(courant, point);
    if (segment?.attenuationMinCote != null) return Number(segment.attenuationMinCote) || 0;
    if (segment?.label === 'Courant de Floride') return 0.6;
    return 0;
  }

  function courantsAuPoint(point) {
    return getCourantsIndex()
      .filter(({ bbox }) => point.x >= bbox.minX && point.x <= bbox.maxX
        && point.y >= bbox.minY && point.y <= bbox.maxY)
      .map(({ courant }) => courant)
      .filter(courant => pointDansZoneSea(point, courant.zone));
  }

  function courantEnPoint(point) {
    const cacheKey = pointCle(point);
    if (courantPointCache.has(cacheKey)) return courantPointCache.get(cacheKey);
    if (pointDansHautFond(point)) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const presents = courantsAuPoint(point);
    if (!presents.length) {
      courantPointCache.set(cacheKey, null);
      return null;
    }

    const priorite = Math.min(...presents.map(c => c.priorite ?? Infinity));
    const retenus = presents.filter(c => (c.priorite ?? Infinity) === priorite);
    let x = 0;
    let y = 0;
    let count = 0;
    let attenuationMin = 0;

    retenus.forEach(courant => {
      const direction = directionCourantAuPoint(courant, point);
      const vitesseKmh = vitesseCourantAuPoint(courant, point);
      const vecteur = directionVersVecteur(direction, vitesseKmh);
      if (!vecteur) return;
      attenuationMin = Math.max(attenuationMin, attenuationMinimaleCourant(courant, point));
      x += vecteur.x;
      y += vecteur.y;
      count++;
    });

    if (!count) {
      courantPointCache.set(cacheKey, null);
      return null;
    }
    const brut = { x: x / count, y: y / count };
    const attenuation = Math.max(attenuationCourantCote(point), attenuationMin);
    const moyen = {
      x: brut.x * attenuation,
      y: brut.y * attenuation,
    };
    const vitesseKmh = Math.hypot(moyen.x, moyen.y);
    const resultat = {
      priorite,
      force: vitesseKmh,
      speedKmh: vitesseKmh,
      speedKnots: vitesseKmh * KMH_TO_KNOTS,
      attenuationCote: attenuation,
      distanceCoteNm: distanceCotePointNm(point),
      direction: vecteurVersDirection(moyen),
      vecteur: moyen,
      courants: retenus.map(c => {
        const segment = segmentVitesseCourantAuPoint(c, point);
        const vitesseKmhOriginale = vitesseCourantAuPoint(c, point);
        return {
          id: c.id,
          segment: segment?.label || null,
          speedKmh: vitesseKmhOriginale * attenuation,
          speedKmhOriginale: vitesseKmhOriginale,
        };
      }),
    };
    courantPointCache.set(cacheKey, resultat);
    return resultat;
  }

  function navireActif() {
    if (typeof CARTE_NAVIRE !== 'undefined') return CARTE_NAVIRE;
    return {
      id: 'navire-generique',
      nom: 'Navire',
      distanceMoyenneNmJour: 105,
      vitesseMoyenneNoeuds: 105 / 24,
      vitessesNoeuds: {},
    };
  }

  function categorieTailleNavire(navire = navireActif()) {
    const valeur = navire.categorieTaille ?? navire.categorie_taille
      ?? navire.categorie ?? navire.tailleCategorie ?? navire.taille_categorie;
    const categorie = Number(valeur);
    return Number.isFinite(categorie) ? categorie : CONFIG.categorieMaxHautsFonds;
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
    const cacheKey = [
      coordCle(a.x), coordCle(a.y), coordCle(b.x), coordCle(b.y), marge,
      categorieTaille,
      options.ignorerDepartDansTerre ? 1 : 0,
      options.ignorerArriveeDansTerre ? 1 : 0,
    ].join('|');
    if (navigabiliteCache.has(cacheKey)) return navigabiliteCache.get(cacheKey);
    if (segmentTraverseHautFond(a, b)) {
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

  function getTerres() {
    if (terresCache) return terresCache;
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

  function getIndexHautsFonds() {
    if (hautsFondsIndexCache) return hautsFondsIndexCache;
    const taille = CONFIG.tailleCelluleIndexPx;
    const source = typeof SEA_SHOALS !== 'undefined' ? SEA_SHOALS : [];
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
    const maxCategorie = Number(hautFond.maxCategorieTaille ?? CONFIG.categorieMaxHautsFonds);
    return categorieTailleNavire() > (Number.isFinite(maxCategorie) ? maxCategorie : CONFIG.categorieMaxHautsFonds);
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

  function attenuationCourantCote(point) {
    const distanceNmCote = distanceCotePointNm(point);
    if (!Number.isFinite(distanceNmCote)) return 1;
    if (distanceNmCote <= 0) return 0;
    return Math.min(1, distanceNmCote / CONFIG.rayonAttenuationCourantNm);
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
      for (;;) {
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
        if (v.type !== 'port' || !coordsValides(v.coords)) return false;
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
    const ports = portsDisponibles();
    return ports.find(v => normaliserTexte(v.nom) === q || normaliserTexte(v.label) === q || v.id === brut)
      || ports.find(v => (v.tags || []).some(tag => normaliserTexte(tag) === q))
      || ports.find(v => normaliserTexte(v.nom).includes(q) || normaliserTexte(v.label).includes(q))
      || ports.find(v => (v.tags || []).some(tag => normaliserTexte(tag).includes(q)));
  }

  function resultatsPorts(q) {
    const qLow = normaliserTexte(q);
    if (!qLow) return [];
    return portsDisponibles().map(port => {
      const tags = port.tags || [port.nom, port.label].filter(Boolean);
      let matchTag = null;
      for (const tag of tags) {
        if (normaliserTexte(tag).includes(qLow)) {
          matchTag = tag;
          break;
        }
      }
      if (!normaliserTexte(port.nom).includes(qLow)
        && !normaliserTexte(port.label).includes(qLow)
        && !matchTag) return null;
      return { port, nom: port.nom, matchTag: matchTag || port.nom };
    }).filter(Boolean).sort((a, b) => {
      const rang = r => {
        const nomLow = normaliserTexte(r.nom);
        const labelLow = normaliserTexte(r.port.label || '');
        const tagLow = normaliserTexte(r.matchTag);
        if (nomLow.startsWith(qLow)) return 0;
        if (labelLow.startsWith(qLow)) return 1;
        if (nomLow.includes(qLow)) return 2;
        if (labelLow.includes(qLow)) return 3;
        if (tagLow.startsWith(qLow)) return 4;
        return 5;
      };
      const ra = rang(a), rb = rang(b);
      if (ra !== rb) return ra - rb;
      return normaliserTexte(a.nom).localeCompare(normaliserTexte(b.nom), 'fr');
    }).slice(0, 8);
  }

  function completionFantomePort(resultats, q) {
    const candidat = resultatCompletionFantomePort(resultats, q);
    return candidat ? candidat.nom.slice(q.length) : '';
  }

  function resultatCompletionFantomePort(resultats, q) {
    const qLow = normaliserTexte(q);
    if (!qLow) return null;
    return resultats.find(({ nom }) => normaliserTexte(nom).startsWith(qLow)) || null;
  }

  function surlignerMatch(texte, qLow) {
    const str = String(texte || '');
    const texteLow = normaliserTexte(str);
    const idx = texteLow.indexOf(qLow);
    if (idx === -1) return escapeHtml(str);
    return escapeHtml(str.slice(0, idx))
      + `<mark class="carte-recherche-highlight">${escapeHtml(str.slice(idx, idx + qLow.length))}</mark>`
      + escapeHtml(str.slice(idx + qLow.length));
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
    let valeurCompletee = null;
    let suggestionActive = null;
    let suggestionFantomeId = null;
    const mesureCanvas = document.createElement('canvas');
    const mesureCtx = mesureCanvas.getContext('2d');

    function viderSuggestions() {
      suggestions.innerHTML = '';
      fantome.textContent = '';
      fantome.style.left = '';
      input.setAttribute('aria-expanded', 'false');
      suggestionActive = null;
      suggestionFantomeId = null;
    }

    function choisirSuggestion(li) {
      if (!li) return;
      input.value = li.dataset.nom || '';
      input.dataset.portId = li.dataset.id || '';
      valeurCompletee = null;
      viderSuggestions();
      input.focus();
    }

    function suggestionFantome() {
      return suggestionFantomeId
        ? [...suggestions.querySelectorAll('.carte-recherche-suggestion')]
          .find(li => li.dataset.id === suggestionFantomeId)
        : null;
    }

    function largeurTexteSaisi() {
      if (!mesureCtx) return 0;
      const style = getComputedStyle(input);
      mesureCtx.font = style.font;
      const texte = input.value || '';
      const espacement = parseFloat(style.letterSpacing);
      const extra = Number.isFinite(espacement) ? Math.max(0, texte.length - 1) * espacement : 0;
      return mesureCtx.measureText(texte).width + extra;
    }

    function afficherFantome(texte) {
      fantome.textContent = texte || '';
      if (!texte) {
        fantome.style.left = '';
        return;
      }
      const style = getComputedStyle(input);
      const bordure = parseFloat(style.borderLeftWidth) || 0;
      const padding = parseFloat(style.paddingLeft) || 0;
      fantome.style.left = `${input.offsetLeft + bordure + padding + largeurTexteSaisi()}px`;
    }

    function rendreSuggestions(q) {
      const qLow = normaliserTexte(q);
      const resultats = resultatsPorts(q);
      suggestionFantomeId = null;
      if (!qLow) {
        viderSuggestions();
        return;
      }
      if (!resultats.length) {
        suggestions.innerHTML = `<li class="carte-recherche-vide">Aucun port</li>`;
        afficherFantome('');
        input.setAttribute('aria-expanded', 'true');
        return;
      }

      input.setAttribute('aria-expanded', 'true');
      suggestions.innerHTML = resultats.map(({ port, nom, matchTag }) => {
        const nomMatch = normaliserTexte(matchTag) === normaliserTexte(nom);
        const matchHtml = nomMatch ? '' :
          `<span class="carte-recherche-suggestion-match">${surlignerMatch(matchTag, qLow)}</span>`;
        return `<li class="carte-recherche-suggestion nav-jaillot-suggestion" role="option"
          data-id="${escapeHtml(port.id)}" data-nom="${escapeHtml(nom)}" data-matchtag="${escapeHtml(matchTag)}">
          <span class="carte-recherche-suggestion-nom">${surlignerMatch(nom, qLow)}</span>
          ${matchHtml}
        </li>`;
      }).join('');

      const completion = resultatCompletionFantomePort(resultats, q);
      suggestionFantomeId = completion?.port?.id || null;
      afficherFantome(completion ? completionFantomePort([completion], q) : '');

      suggestions.querySelectorAll('.carte-recherche-suggestion').forEach(li => {
        li.addEventListener('click', () => choisirSuggestion(li));
      });
    }

    input.addEventListener('input', () => {
      input.dataset.portId = '';
      valeurCompletee = null;
      rendreSuggestions(input.value);
    });

    suggestions.addEventListener('mousedown', e => e.preventDefault());

    input.addEventListener('keydown', e => {
      if ((e.key === 'Tab' || e.key === 'ArrowRight') && fantome.textContent) {
        e.preventDefault();
        choisirSuggestion(suggestionActive || suggestionFantome());
        return;
      }

      const items = [...suggestions.querySelectorAll('.carte-recherche-suggestion')];
      let idx = suggestionActive ? items.indexOf(suggestionActive) : -1;

      if (e.key === 'Enter') {
        e.preventDefault();
        const cible = suggestionActive || suggestions.querySelector('.carte-recherche-suggestion--active') || suggestionFantome() || items[0];
        if (cible) {
          choisirSuggestion(cible);
          return;
        }
        const port = trouverPort(valeurCompletee || input.value);
        if (port) {
          input.value = port.nom;
          input.dataset.portId = port.id;
        }
        viderSuggestions();
        return;
      }

      if (!items.length) return;

      function naviguer(delta) {
        if (suggestionActive) suggestionActive.classList.remove('carte-recherche-suggestion--active');
        idx = (idx + delta + items.length) % items.length;
        suggestionActive = items[idx];
        suggestionActive.classList.add('carte-recherche-suggestion--active');
        suggestionActive.scrollIntoView({ block: 'nearest' });
        const q = input.value.trim();
        afficherFantome(completionFantomePort(
          [{ nom: suggestionActive.dataset.nom || '' }],
          q
        ));
      }

      if (e.key === 'ArrowDown') { e.preventDefault(); naviguer(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); naviguer(-1); }
      else if (e.key === 'Escape') {
        input.value = '';
        input.dataset.portId = '';
        valeurCompletee = null;
        viderSuggestions();
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        const port = trouverPort(input.dataset.portId || input.value);
        if (port && normaliserTexte(input.value) === normaliserTexte(port.nom)) {
          input.dataset.portId = port.id;
        } else if (!port) {
          input.dataset.portId = '';
        }
        viderSuggestions();
      }, 120);
    });
  }

  function initUI() {
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
      <div class="nav-jaillot-ligne nav-jaillot-ligne--actions">
        <button id="nav-jaillot-swap" type="button" title="Intervertir">↔</button>
        <button id="nav-jaillot-tracer" type="button">Tracer</button>
        <button id="nav-jaillot-effacer" type="button" title="Effacer">×</button>
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
      <div class="nav-jaillot-resultat" id="nav-jaillot-resultat"></div>
      <button id="nav-jaillot-avance" class="nav-jaillot-avance" type="button">Options avancées</button>
    `;
    L.DomEvent.disableClickPropagation(panneau);
    L.DomEvent.disableScrollPropagation(panneau);
    cible.appendChild(panneau);

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

    panneau.querySelector('#nav-jaillot-avance').addEventListener('click', () => {
      resultat.textContent = 'Options avancées à venir.';
    });
  }

  function init(options) {
    carte = options.carte;
    pixelToLatLngFn = options.pixelToLatLng;
    getTerres();
    initUI();
  }

  window.NavigationJaillot = {
    init,
    calculerRoute,
    segmentNavigable,
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
    attenuationCourantCote,
    config: CONFIG,
  };
})();
