const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'js', 'oscar-grid.js');
const OUTPUT = path.join(ROOT, 'js', 'oscar-hex-grid.js');
const REPORT = path.join(ROOT, 'tools', 'oscar-hex-grid-report.json');

const IMAGE_W = 8500;
const IMAGE_H = 5320;
const HEX_AREA_FACTOR = 0.85;

// Parametres d'interpolation alignes sur gen_oscar_stitched_centerlines.py
// (fonction interpolated_vector, deja validee sur le champ de courant source) :
// poids = 1 / max(minDist, distance), limite aux N voisins les plus proches
// dans un rayon donne. On reprend les memes valeurs plutot que d'en inventer.
const INTERP_RADIUS_PX = 95;
const INTERP_LIMIT = 8;
const INTERP_MIN_DIST_PX = 12;

// En-dessous de ce seuil, la vitesse/direction n'a plus de sens physique
// stable (bruit d'interpolation) : on fige explicitement la cellule a
// vecteur nul et on la marque "calme" plutot que de laisser une direction
// instable.
const CALME_SEUIL_NOEUDS = 0.05;

// Pour le rapport d'arbitrage manuel : un ecart de direction n'est
// significatif que si les deux vitesses comparees (source ET hex) sont
// elles-memes significatives (sinon l'angle est du bruit sur du quasi-nul).
const ARBITRAGE_SEUIL_ANGLE_DEG = 30;
const ARBITRAGE_SEUIL_VITESSE_NOEUDS = 0.3;

function loadOscarGrid() {
  const code = fs.readFileSync(INPUT, 'utf8') + '\nglobalThis.OSCAR_GRID = OSCAR_GRID;';
  const context = { globalThis: {} };
  vm.runInNewContext(code, context, { filename: INPUT });
  return context.globalThis.OSCAR_GRID;
}

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeAngle(deg) {
  return ((deg % 360) + 360) % 360;
}

function angleDiff(a, b) {
  return Math.abs(normalizeAngle(a - b + 180) - 180);
}

function vectorAngle(x, y) {
  return normalizeAngle(Math.atan2(y, x) * 180 / Math.PI);
}

function hexGeometry(squareCellSize, areaFactor = 1) {
  const radius = Math.sqrt((squareCellSize * squareCellSize * areaFactor) / (3 * Math.sqrt(3) / 2));
  const width = Math.sqrt(3) * radius;
  const height = 2 * radius;
  return {
    orientation: 'pointy',
    radiusPx: radius,
    widthPx: width,
    heightPx: height,
    centerSpacingPx: { x: width, y: 1.5 * radius },
  };
}

function hexCenter(q, r, geom) {
  const offset = (r & 1) ? geom.widthPx / 2 : 0;
  return {
    x: geom.widthPx / 2 + offset + q * geom.centerSpacingPx.x,
    y: geom.radiusPx + r * geom.centerSpacingPx.y,
  };
}

// Index spatial des cases carrees source, cle identique au format d'origine
// ("col_row"), pour retrouver rapidement les voisins d'un point donne.
function buildSquareIndex(square, cellSize) {
  const index = new Map();
  Object.entries(square.cells || {}).forEach(([key, cell]) => {
    const [col, row] = key.split('_').map(Number);
    if (!Number.isFinite(col) || !Number.isFinite(row)) return;
    const xKnot = Number(cell.xKnot);
    const yKnot = Number(cell.yKnot);
    if (!Number.isFinite(xKnot) || !Number.isFinite(yKnot)) return;
    index.set(`${col}_${row}`, {
      col,
      row,
      x: (col + 0.5) * cellSize,
      y: (row + 0.5) * cellSize,
      xKnot,
      yKnot,
      speedKnot: Number(cell.speedKnot ?? Math.hypot(xKnot, yKnot)),
      maxSpeedKnot: Number(cell.maxSpeedKnot ?? 0) || 0,
      sources: Number(cell.sources) || 0,
      domain: cell.domain || null,
    });
  });
  return index;
}

// Interpolation ponderee par voisinage - meme principe que interpolated_vector()
// dans gen_oscar_stitched_centerlines.py. Remplace le binning "plus proche
// carree gagne", qui laissait des hexagones vides des lors qu'aucune case
// carree n'avait cet hexagone comme plus proche (artefact de quantification,
// pas une absence reelle de courant).
function interpolateAt(x, y, index, cellSize) {
  const reach = Math.ceil(INTERP_RADIUS_PX / cellSize) + 1;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  const candidates = [];
  for (let dc = -reach; dc <= reach; dc += 1) {
    for (let dr = -reach; dr <= reach; dr += 1) {
      const item = index.get(`${col + dc}_${row + dr}`);
      if (!item) continue;
      const dx = item.x - x;
      const dy = item.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= INTERP_RADIUS_PX * INTERP_RADIUS_PX) candidates.push({ d2, item });
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.d2 - b.d2);
  const picked = candidates.slice(0, INTERP_LIMIT);
  let totalWeight = 0;
  let xKnot = 0, yKnot = 0, sources = 0, maxSpeedKnot = 0;
  const domainWeights = {};
  picked.forEach(({ d2, item }) => {
    const weight = 1 / Math.max(INTERP_MIN_DIST_PX, Math.sqrt(d2));
    totalWeight += weight;
    xKnot += item.xKnot * weight;
    yKnot += item.yKnot * weight;
    sources += item.sources;
    maxSpeedKnot = Math.max(maxSpeedKnot, item.maxSpeedKnot);
    if (item.domain) domainWeights[item.domain] = (domainWeights[item.domain] || 0) + weight;
  });
  xKnot /= totalWeight;
  yKnot /= totalWeight;
  let speedKnot = Math.hypot(xKnot, yKnot);
  const domain = Object.entries(domainWeights)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || null;

  // Sous le seuil, la direction interpolee n'est plus stable (bruit) : on
  // fige explicitement a un vecteur nul plutot que de propager un angle
  // qui n'a pas de sens physique. La cellule est marquee "calme" pour
  // qu'un arbitrage manuel puisse plus tard la distinguer d'une dechirure.
  const calme = speedKnot < CALME_SEUIL_NOEUDS;
  if (calme) {
    xKnot = 0;
    yKnot = 0;
    speedKnot = 0;
  }
  return {
    xKnot, yKnot, speedKnot,
    dirToDeg: speedKnot > 0 ? vectorAngle(xKnot, yKnot) : null,
    maxSpeedKnot,
    sources,
    sourceCells: picked.length,
    domain,
    domainCounts: domainWeights,
    calme,
  };
}

function main() {
  const square = loadOscarGrid();
  const cellSize = Number(square.cellSizePx) || 50;
  const geom = hexGeometry(cellSize, HEX_AREA_FACTOR);
  const index = buildSquareIndex(square, cellSize);

  // Bornes de balayage : bbox des cases carrees + marge du rayon
  // d'interpolation, pour ne pas couper les hexagones en bordure de domaine.
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  index.forEach(item => {
    if (item.x < minX) minX = item.x;
    if (item.x > maxX) maxX = item.x;
    if (item.y < minY) minY = item.y;
    if (item.y > maxY) maxY = item.y;
  });
  const margin = INTERP_RADIUS_PX;
  const minR = Math.max(0, Math.floor((minY - margin - geom.radiusPx) / geom.centerSpacingPx.y));
  const maxR = Math.ceil((maxY + margin - geom.radiusPx) / geom.centerSpacingPx.y);

  const hexCells = {};
  const sourceCellsPerHex = {};
  for (let r = minR; r <= maxR; r += 1) {
    const offset = (r & 1) ? geom.widthPx / 2 : 0;
    const minQ = Math.max(0, Math.floor((minX - margin - geom.widthPx / 2 - offset) / geom.centerSpacingPx.x));
    const maxQ = Math.ceil((maxX + margin - geom.widthPx / 2 - offset) / geom.centerSpacingPx.x);
    for (let q = minQ; q <= maxQ; q += 1) {
      const center = hexCenter(q, r, geom);
      const result = interpolateAt(center.x, center.y, index, cellSize);
      if (!result) continue;
      const key = `${r}_${q}`;
      hexCells[key] = {
        q, r,
        x: round(center.x, 2),
        y: round(center.y, 2),
        xKnot: round(result.xKnot, 3),
        yKnot: round(result.yKnot, 3),
        speedKnot: round(result.speedKnot, 3),
        dirToDeg: result.dirToDeg == null ? null : round(result.dirToDeg, 1),
        maxSpeedKnot: round(result.maxSpeedKnot, 3),
        sources: result.sources,
        sourceCells: result.sourceCells,
        domain: result.domain,
        domainCounts: result.domainCounts,
        calme: result.calme,
      };
      sourceCellsPerHex[result.sourceCells] = (sourceCellsPerHex[result.sourceCells] || 0) + 1;
    }
  }

  // Fidelite : pour chaque case carree source, on cherche l'hexagone dont le
  // centre est le plus proche (meme recherche que oscarHexCellKey en
  // runtime) et on compare la valeur interpolee a la valeur brute source.
  const diffs = [];
  index.forEach(item => {
    let best = null;
    const reach = 2;
    const approxR = Math.round((item.y - geom.radiusPx) / geom.centerSpacingPx.y);
    for (let dr = -reach; dr <= reach; dr += 1) {
      const r = approxR + dr;
      if (r < 0) continue;
      const offset = (r & 1) ? geom.widthPx / 2 : 0;
      const approxQ = Math.round((item.x - geom.widthPx / 2 - offset) / geom.centerSpacingPx.x);
      for (let dq = -reach; dq <= reach; dq += 1) {
        const q = approxQ + dq;
        if (q < 0) continue;
        const cell = hexCells[`${r}_${q}`];
        if (!cell) continue;
        const center = hexCenter(q, r, geom);
        const d = Math.hypot(center.x - item.x, center.y - item.y);
        if (!best || d < best.d) best = { key: `${r}_${q}`, d, cell };
      }
    }
    if (!best) return;
    const sourceSpeed = item.speedKnot;
    const sourceDir = vectorAngle(item.xKnot, item.yKnot);
    const hexDir = Number(best.cell.dirToDeg);
    diffs.push({
      sourceKey: `${item.col}_${item.row}`,
      hexKey: best.key,
      sourceSpeedKnot: round(sourceSpeed, 3),
      hexSpeedKnot: Number(best.cell.speedKnot),
      speedDiff: Math.abs(sourceSpeed - Number(best.cell.speedKnot)),
      angleDiff: Number.isFinite(sourceDir) && Number.isFinite(hexDir) ? angleDiff(sourceDir, hexDir) : 0,
    });
  });

  // Cas a arbitrer manuellement : ecart de direction important ENTRE deux
  // vitesses elles-memes significatives des deux cotes (source et hex).
  // Les cas ou l'une des deux vitesses est quasi nulle sont exclus : l'angle
  // y est instable par nature et n'indique pas une vraie divergence.
  const arbitrageManuel = diffs
    .filter(d => d.angleDiff >= ARBITRAGE_SEUIL_ANGLE_DEG
      && d.sourceSpeedKnot >= ARBITRAGE_SEUIL_VITESSE_NOEUDS
      && d.hexSpeedKnot >= ARBITRAGE_SEUIL_VITESSE_NOEUDS)
    .sort((a, b) => b.angleDiff - a.angleDiff);

  const byDomain = {};
  Object.values(hexCells).forEach(cell => {
    byDomain[cell.domain] = (byDomain[cell.domain] || 0) + 1;
  });
  const speedDiffs = diffs.map(d => d.speedDiff);
  const angleDiffs = diffs.map(d => d.angleDiff);

  const report = {
    source: path.relative(ROOT, INPUT).replace(/\\/g, '/'),
    output: path.relative(ROOT, OUTPUT).replace(/\\/g, '/'),
    method: 'interpolation ponderee par voisinage (alignee sur interpolated_vector de gen_oscar_stitched_centerlines.py), remplace le binning plus-proche-voisin de la v1',
    interpolation: { radiusPx: INTERP_RADIUS_PX, limit: INTERP_LIMIT, minDistPx: INTERP_MIN_DIST_PX },
    squareCells: index.size,
    hexCells: Object.keys(hexCells).length,
    hexCellsCalmes: Object.values(hexCells).filter(c => c.calme).length,
    calmeSeuilNoeuds: CALME_SEUIL_NOEUDS,
    previousHexCellsBinningV1: 7524,
    cellSizePx: cellSize,
    hexAreaFactor: HEX_AREA_FACTOR,
    hex: {
      orientation: geom.orientation,
      radiusPx: round(geom.radiusPx, 6),
      widthPx: round(geom.widthPx, 6),
      heightPx: round(geom.heightPx, 6),
      centerSpacingPx: { x: round(geom.centerSpacingPx.x, 6), y: round(geom.centerSpacingPx.y, 6) },
    },
    domains: byDomain,
    sourceCellsPerHex,
    fidelity: {
      avgSpeedDiffKnot: round(speedDiffs.reduce((s, v) => s + v, 0) / Math.max(1, speedDiffs.length), 6),
      maxSpeedDiffKnot: round(Math.max(0, ...speedDiffs), 6),
      avgAngleDiffDeg: round(angleDiffs.reduce((s, v) => s + v, 0) / Math.max(1, angleDiffs.length), 6),
      maxAngleDiffDeg: round(Math.max(0, ...angleDiffs), 6),
      comparedSourceCells: diffs.length,
    },
    worstSpeedDiffs: diffs.slice().sort((a, b) => b.speedDiff - a.speedDiff).slice(0, 20),
    worstAngleDiffs: diffs.slice().sort((a, b) => b.angleDiff - a.angleDiff).slice(0, 20),
    arbitrageManuel: {
      seuilAngleDeg: ARBITRAGE_SEUIL_ANGLE_DEG,
      seuilVitesseNoeuds: ARBITRAGE_SEUIL_VITESSE_NOEUDS,
      count: arbitrageManuel.length,
      cas: arbitrageManuel,
    },
  };

  const grid = {
    version: 2,
    source: 'Derived from OSCAR_GRID square cells by weighted-neighbor interpolation onto a pointy-top hex lattice',
    topology: 'hex',
    orientation: geom.orientation,
    areaFactor: HEX_AREA_FACTOR,
    radiusPx: round(geom.radiusPx, 6),
    widthPx: round(geom.widthPx, 6),
    heightPx: round(geom.heightPx, 6),
    centerSpacingPx: { x: round(geom.centerSpacingPx.x, 6), y: round(geom.centerSpacingPx.y, 6) },
    vectorConvention: square.vectorConvention,
    cells: hexCells,
  };

  const output = `// oscar-hex-grid.js - generated by tools/generate-oscar-hex-grid.js\n`
    + `const OSCAR_HEX_GRID = ${JSON.stringify(grid)};\n`
    + `if (typeof window !== 'undefined') window.OSCAR_HEX_GRID = OSCAR_HEX_GRID;\n`;
  fs.writeFileSync(OUTPUT, output, 'utf8');
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();
