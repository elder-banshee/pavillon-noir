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
    centerSpacingPx: {
      x: width,
      y: 1.5 * radius,
    },
  };
}

function hexCenter(q, r, geom) {
  const offset = (r & 1) ? geom.widthPx / 2 : 0;
  return {
    x: geom.widthPx / 2 + offset + q * geom.centerSpacingPx.x,
    y: geom.radiusPx + r * geom.centerSpacingPx.y,
  };
}

function nearestHex(x, y, geom) {
  const approxR = Math.round((y - geom.radiusPx) / geom.centerSpacingPx.y);
  let best = null;
  for (let dr = -2; dr <= 2; dr += 1) {
    const r = approxR + dr;
    if (r < 0) continue;
    const offset = (r & 1) ? geom.widthPx / 2 : 0;
    const approxQ = Math.round((x - geom.widthPx / 2 - offset) / geom.centerSpacingPx.x);
    for (let dq = -2; dq <= 2; dq += 1) {
      const q = approxQ + dq;
      if (q < 0) continue;
      const center = hexCenter(q, r, geom);
      const distance = Math.hypot(x - center.x, y - center.y);
      if (!best || distance < best.distance) best = { q, r, center, distance };
    }
  }
  return best;
}

function addDomainCount(target, domain) {
  if (!domain) return;
  target[domain] = (target[domain] || 0) + 1;
}

function dominantDomain(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || null;
}

function main() {
  const square = loadOscarGrid();
  const cellSize = Number(square.cellSizePx) || 50;
  const geom = hexGeometry(cellSize, HEX_AREA_FACTOR);
  const accum = new Map();
  const sourceAssignments = [];

  Object.entries(square.cells || {}).forEach(([sourceKey, cell]) => {
    const [col, row] = sourceKey.split('_').map(Number);
    if (!Number.isFinite(row) || !Number.isFinite(col)) return;
    const sourceCenter = {
      x: (col + 0.5) * cellSize,
      y: (row + 0.5) * cellSize,
    };
    if (sourceCenter.x < 0 || sourceCenter.x > IMAGE_W || sourceCenter.y < 0 || sourceCenter.y > IMAGE_H) return;
    const nearest = nearestHex(sourceCenter.x, sourceCenter.y, geom);
    if (!nearest) return;
    const key = `${nearest.r}_${nearest.q}`;
    if (!accum.has(key)) {
      accum.set(key, {
        key,
        q: nearest.q,
        r: nearest.r,
        x: nearest.center.x,
        y: nearest.center.y,
        xSum: 0,
        ySum: 0,
        speedSum: 0,
        maxSpeedKnot: 0,
        sourceCount: 0,
        sources: 0,
        domains: {},
        sourceCells: [],
      });
    }
    const item = accum.get(key);
    const xKnot = Number(cell.xKnot);
    const yKnot = Number(cell.yKnot);
    const speedKnot = Number(cell.speedKnot ?? Math.hypot(xKnot, yKnot));
    if (!Number.isFinite(xKnot) || !Number.isFinite(yKnot) || !Number.isFinite(speedKnot)) return;
    item.xSum += xKnot;
    item.ySum += yKnot;
    item.speedSum += speedKnot;
    item.maxSpeedKnot = Math.max(item.maxSpeedKnot, Number(cell.maxSpeedKnot ?? speedKnot) || 0);
    item.sourceCount += 1;
    item.sources += Number(cell.sources) || 0;
    addDomainCount(item.domains, cell.domain);
    item.sourceCells.push(sourceKey);
    sourceAssignments.push({ sourceKey, hexKey: key, source: cell });
  });

  const hexCells = {};
  const collisions = {};
  accum.forEach(item => {
    const xKnot = item.xSum / item.sourceCount;
    const yKnot = item.ySum / item.sourceCount;
    const speedKnot = Math.hypot(xKnot, yKnot);
    const dirToDeg = speedKnot > 0 ? vectorAngle(xKnot, yKnot) : null;
    collisions[item.sourceCount] = (collisions[item.sourceCount] || 0) + 1;
    hexCells[item.key] = {
      q: item.q,
      r: item.r,
      x: round(item.x, 2),
      y: round(item.y, 2),
      xKnot: round(xKnot, 3),
      yKnot: round(yKnot, 3),
      speedKnot: round(speedKnot, 3),
      dirToDeg: dirToDeg == null ? null : round(dirToDeg, 1),
      maxSpeedKnot: round(item.maxSpeedKnot, 3),
      sources: item.sources,
      sourceCells: item.sourceCount,
      domain: dominantDomain(item.domains),
      domainCounts: item.domains,
    };
  });

  const diffs = sourceAssignments.map(({ sourceKey, hexKey, source }) => {
    const hex = hexCells[hexKey];
    const sourceSpeed = Number(source.speedKnot ?? Math.hypot(Number(source.xKnot), Number(source.yKnot)));
    const sourceDir = Number(source.dirToDeg ?? vectorAngle(Number(source.xKnot), Number(source.yKnot)));
    const hexDir = Number(hex.dirToDeg);
    return {
      sourceKey,
      hexKey,
      speedDiff: Math.abs(sourceSpeed - Number(hex.speedKnot)),
      angleDiff: Number.isFinite(sourceDir) && Number.isFinite(hexDir) ? angleDiff(sourceDir, hexDir) : 0,
    };
  });

  const byDomain = {};
  Object.values(hexCells).forEach(cell => {
    byDomain[cell.domain] = (byDomain[cell.domain] || 0) + 1;
  });
  const speedDiffs = diffs.map(d => d.speedDiff);
  const angleDiffs = diffs.map(d => d.angleDiff);
  const report = {
    source: path.relative(ROOT, INPUT).replace(/\\/g, '/'),
    output: path.relative(ROOT, OUTPUT).replace(/\\/g, '/'),
    squareCells: Object.keys(square.cells || {}).length,
    hexCells: Object.keys(hexCells).length,
    cellSizePx: cellSize,
    hexAreaFactor: HEX_AREA_FACTOR,
    hex: {
      orientation: geom.orientation,
      radiusPx: round(geom.radiusPx, 6),
      widthPx: round(geom.widthPx, 6),
      heightPx: round(geom.heightPx, 6),
      centerSpacingPx: {
        x: round(geom.centerSpacingPx.x, 6),
        y: round(geom.centerSpacingPx.y, 6),
      },
    },
    domains: byDomain,
    sourceCellsPerHex: collisions,
    fidelity: {
      avgSpeedDiffKnot: round(speedDiffs.reduce((sum, v) => sum + v, 0) / Math.max(1, speedDiffs.length), 6),
      maxSpeedDiffKnot: round(Math.max(0, ...speedDiffs), 6),
      avgAngleDiffDeg: round(angleDiffs.reduce((sum, v) => sum + v, 0) / Math.max(1, angleDiffs.length), 6),
      maxAngleDiffDeg: round(Math.max(0, ...angleDiffs), 6),
      comparedSourceCells: diffs.length,
    },
    worstSpeedDiffs: diffs.slice().sort((a, b) => b.speedDiff - a.speedDiff).slice(0, 20),
    worstAngleDiffs: diffs.slice().sort((a, b) => b.angleDiff - a.angleDiff).slice(0, 20),
  };

  const grid = {
    version: 1,
    source: 'Derived from OSCAR_GRID square cells by nearest pointy-top hex binning',
    topology: 'hex',
    orientation: geom.orientation,
    areaFactor: HEX_AREA_FACTOR,
    radiusPx: round(geom.radiusPx, 6),
    widthPx: round(geom.widthPx, 6),
    heightPx: round(geom.heightPx, 6),
    centerSpacingPx: {
      x: round(geom.centerSpacingPx.x, 6),
      y: round(geom.centerSpacingPx.y, 6),
    },
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
