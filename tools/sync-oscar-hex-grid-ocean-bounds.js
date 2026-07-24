#!/usr/bin/env node
/*
 * Synchronise la maille OSCAR avec ZONES_OCEAN_BOUNDS, sans recalculer les
 * courants. Par défaut le script est en simulation ; --write remplace la
 * grille cible après avoir écrit un rapport JSON.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const MAP_WIDTH = 8500;
const MAP_HEIGHT = 5320;
const EXPECTED_OCEAN_IDS = new Set([
  'ocean-bounds-atlantique',
  'ocean-bounds-pacifique',
]);

// Exceptions topologiques vérifiées visuellement. Elles restent nécessaires
// lorsque le chenal maritime est plus fin que les critères géométriques
// (centre, sommets et contour de l'hexagone hors de ZONES_OCEAN_BOUNDS).
// Elles ne recalculent jamais les courants : une cellule absente est ajoutée
// calme et une cellule existante est conservée telle quelle.
const FORCE_INCLUDED_CELLS = {
  '64_123': {
    domain: 'caribbean',
    reason: 'Chenal maritime très fin, important pour la continuité locale.',
  },
};

function option(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  if (index + 1 >= process.argv.length) throw new Error(`Valeur manquante après ${name}.`);
  return process.argv[index + 1];
}

const write = process.argv.includes('--write');
const preserveExisting = process.argv.includes('--preserve-existing');
const gridPath = path.resolve(option('--grid', path.join(ROOT, 'js', 'oscar-hex-grid.js')));
const zonesPath = path.resolve(option('--zones', path.join(ROOT, 'js', 'zones-data.js')));
const reportPath = path.resolve(option('--report', path.join(ROOT, 'tools', 'oscar-hex-grid-ocean-bounds-report.json')));
const outputPath = option('--output') ? path.resolve(option('--output')) : null;

function loadConst(filePath, name) {
  const source = `${fs.readFileSync(filePath, 'utf8')}\nglobalThis.__result = ${name};`;
  const context = { globalThis: {}, window: {} };
  vm.runInNewContext(source, context, { filename: filePath, timeout: 30000 });
  if (!context.globalThis.__result) throw new Error(`${name} introuvable dans ${filePath}.`);
  return context.globalThis.__result;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function pointOnSegment(point, a, b, epsilon = 1e-7) {
  const cross = (point.y - a.y) * (b.x - a.x) - (point.x - a.x) * (b.y - a.y);
  if (Math.abs(cross) > epsilon) return false;
  const dot = (point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y);
  if (dot < -epsilon) return false;
  const lengthSq = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  return dot <= lengthSq + epsilon;
}

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const a = { x: Number(ring[j][0]), y: Number(ring[j][1]) };
    const b = { x: Number(ring[i][0]), y: Number(ring[i][1]) };
    if (pointOnSegment(point, a, b)) return true;
    const crosses = (a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function ringBounds(ring) {
  const xs = ring.map(point => Number(point[0]));
  const ys = ring.map(point => Number(point[1]));
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function makeRingIndex(ring, bandCount = 256) {
  const bbox = ringBounds(ring);
  const bands = Array.from({ length: bandCount }, () => []);
  const height = Math.max(1, bbox.maxY - bbox.minY);
  for (let i = 0; i < ring.length; i += 1) {
    const a = { x: Number(ring[i][0]), y: Number(ring[i][1]) };
    const b = { x: Number(ring[(i + 1) % ring.length][0]), y: Number(ring[(i + 1) % ring.length][1]) };
    const first = Math.max(0, Math.floor(((Math.min(a.y, b.y) - bbox.minY) / height) * bandCount));
    const last = Math.min(bandCount - 1, Math.floor(((Math.max(a.y, b.y) - bbox.minY) / height) * bandCount));
    for (let band = first; band <= last; band += 1) bands[band].push([a, b]);
  }
  return { ring, bbox, bands, bandCount };
}

function zonePolygons(zone) {
  if (Array.isArray(zone)) return [{ exterior: makeRingIndex(zone), holes: [] }];
  if (Array.isArray(zone?.polygons)) return zone.polygons.flatMap(zonePolygons);
  if (Array.isArray(zone?.exterior)) return [{
    exterior: makeRingIndex(zone.exterior),
    holes: (Array.isArray(zone.holes) ? zone.holes : []).map(hole => makeRingIndex(hole)),
  }];
  return [];
}

function pointInIndexedRing(point, index) {
  const { bbox } = index;
  if (point.x < bbox.minX || point.x > bbox.maxX || point.y < bbox.minY || point.y > bbox.maxY) return false;
  const band = Math.min(index.bandCount - 1, Math.max(0, Math.floor(((point.y - bbox.minY) / Math.max(1, bbox.maxY - bbox.minY)) * index.bandCount)));
  let inside = false;
  for (const [a, b] of index.bands[band]) {
    if (pointOnSegment(point, a, b)) return true;
    const crosses = (a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, polygon) {
  return pointInIndexedRing(point, polygon.exterior) && !polygon.holes.some(hole => pointInIndexedRing(point, hole));
}

function orient(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsIntersect(a, b, c, d) {
  const abC = orient(a, b, c);
  const abD = orient(a, b, d);
  const cdA = orient(c, d, a);
  const cdB = orient(c, d, b);
  if ((abC > 0) !== (abD > 0) && (cdA > 0) !== (cdB > 0)) return true;
  return pointOnSegment(c, a, b) || pointOnSegment(d, a, b)
    || pointOnSegment(a, c, d) || pointOnSegment(b, c, d);
}

function pointInHex(point, hex) {
  let sign = 0;
  for (let i = 0; i < hex.length; i += 1) {
    const a = hex[i];
    const b = hex[(i + 1) % hex.length];
    const value = orient(a, b, point);
    if (Math.abs(value) < 1e-7) continue;
    const current = value > 0 ? 1 : -1;
    if (sign && sign !== current) return false;
    sign = current;
  }
  return true;
}

function ringIntersectsHex(index, hex) {
  const hexBounds = ringBounds(hex.map(point => [point.x, point.y]));
  const { bbox, ring } = index;
  if (bbox.maxX < hexBounds.minX || bbox.minX > hexBounds.maxX || bbox.maxY < hexBounds.minY || bbox.minY > hexBounds.maxY) return false;
  for (let i = 0; i < ring.length; i += 1) {
    const a = { x: Number(ring[i][0]), y: Number(ring[i][1]) };
    const b = { x: Number(ring[(i + 1) % ring.length][0]), y: Number(ring[(i + 1) % ring.length][1]) };
    if (pointInHex(a, hex)) return true;
    for (let j = 0; j < hex.length; j += 1) {
      if (segmentsIntersect(a, b, hex[j], hex[(j + 1) % hex.length])) return true;
    }
  }
  return false;
}

function hexIntersectsPolygon(hex, polygon) {
  const center = hex.reduce((sum, point) => ({ x: sum.x + point.x / hex.length, y: sum.y + point.y / hex.length }), { x: 0, y: 0 });
  if (pointInPolygon(center, polygon) || hex.some(point => pointInPolygon(point, polygon))) return true;
  // Un contour extérieur entièrement inclus dans l'hexagone représente une
  // poche maritime ; les trous seuls ne suffisent pas à déclarer de l'eau.
  return ringIntersectsHex(polygon.exterior, hex);
}

function oscarHexCenter(q, r, grid) {
  const width = Number(grid.widthPx);
  const radius = Number(grid.radiusPx);
  const spacingY = Number(grid.centerSpacingPx?.y);
  const offset = (r & 1) ? width / 2 : 0;
  return { x: width / 2 + offset + q * width, y: radius + r * spacingY };
}

function oscarHexVertices(q, r, grid) {
  const center = oscarHexCenter(q, r, grid);
  const radius = Number(grid.radiusPx);
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (-90 + index * 60) * Math.PI / 180;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
}

function oceanDomain(id) {
  return /pacifique|pacific|bariana/i.test(id) ? 'pacific' : 'atlantic';
}

function hexOceanIntersection(q, r, grid, oceans) {
  const hex = oscarHexVertices(q, r, grid);
  for (const ocean of oceans) {
    if (ocean.polygons.some(polygon => hexIntersectsPolygon(hex, polygon))) return ocean;
  }
  return null;
}

function createCalmCell(q, r, grid, domain) {
  const center = oscarHexCenter(q, r, grid);
  return {
    q,
    r,
    x: round(center.x),
    y: round(center.y),
    xKnot: 0,
    yKnot: 0,
    speedKnot: 0,
    dirToDeg: null,
    maxSpeedKnot: 0,
    source: 'calm',
    calme: true,
    domain,
  };
}

function candidateRange(grid) {
  const width = Number(grid.widthPx);
  const radius = Number(grid.radiusPx);
  const spacingY = Number(grid.centerSpacingPx?.y);
  const maxR = Math.ceil((MAP_HEIGHT - radius) / spacingY) + 1;
  const maxQ = Math.ceil((MAP_WIDTH - width / 2) / width) + 1;
  return { maxR, maxQ };
}

function serializeGrid(grid) {
  return `// oscar-hex-grid.js — synchronisé par sync-oscar-hex-grid-ocean-bounds.js\nconst OSCAR_HEX_GRID = ${JSON.stringify(grid)};\nif (typeof window !== 'undefined') window.OSCAR_HEX_GRID = OSCAR_HEX_GRID;\n`;
}

function main() {
  const grid = loadConst(gridPath, 'OSCAR_HEX_GRID');
  const bounds = loadConst(zonesPath, 'ZONES_OCEAN_BOUNDS');
  if (grid.topology !== 'hex') throw new Error('La grille active n’est pas hexagonale.');
  const oceans = Object.entries(bounds).map(([id, entry]) => ({ id, domain: oceanDomain(id), polygons: zonePolygons(entry?.zone) }))
    .filter(ocean => ocean.polygons.length);
  const oceanIds = new Set(oceans.map(ocean => ocean.id));
  const missingIds = [...EXPECTED_OCEAN_IDS].filter(id => !oceanIds.has(id));
  const unexpectedIds = [...oceanIds].filter(id => !EXPECTED_OCEAN_IDS.has(id));
  if (missingIds.length || unexpectedIds.length) {
    throw new Error(
      `Emprises navigables inattendues — manquantes : ${missingIds.join(', ') || 'aucune'} ; `
      + `inattendues : ${unexpectedIds.join(', ') || 'aucune'}.`,
    );
  }

  const existing = grid.cells || {};
  const nextCells = {};
  const removed = [];
  const preservedOutsideBounds = [];
  for (const [key, cell] of Object.entries(existing)) {
    const q = Number(cell.q ?? key.split('_')[1]);
    const r = Number(cell.r ?? key.split('_')[0]);
    if (!Number.isInteger(q) || !Number.isInteger(r)) throw new Error(`Clé de cellule OSCAR invalide : ${key}`);
    if (FORCE_INCLUDED_CELLS[key] || hexOceanIntersection(q, r, grid, oceans)) {
      nextCells[key] = cell;
    } else if (preserveExisting) {
      nextCells[key] = cell;
      preservedOutsideBounds.push(key);
    } else {
      removed.push(key);
    }
  }

  const added = [];
  const { maxR, maxQ } = candidateRange(grid);
  for (let r = 0; r <= maxR; r += 1) {
    for (let q = 0; q <= maxQ; q += 1) {
      const key = `${r}_${q}`;
      if (nextCells[key]) continue;
      const center = oscarHexCenter(q, r, grid);
      if (center.x < -grid.widthPx || center.x > MAP_WIDTH + grid.widthPx || center.y < -grid.heightPx || center.y > MAP_HEIGHT + grid.heightPx) continue;
      const ocean = hexOceanIntersection(q, r, grid, oceans);
      if (!ocean) continue;
      nextCells[key] = createCalmCell(q, r, grid, ocean.domain);
      added.push(key);
    }
  }

  const forcedIncluded = [];
  for (const [key, override] of Object.entries(FORCE_INCLUDED_CELLS)) {
    if (nextCells[key]) {
      forcedIncluded.push({ key, ...override, action: Object.hasOwn(existing, key) ? 'preserved' : 'added' });
      continue;
    }
    const [r, q] = key.split('_').map(Number);
    if (!Number.isInteger(q) || !Number.isInteger(r)) throw new Error(`Exception de cellule invalide : ${key}`);
    nextCells[key] = createCalmCell(q, r, grid, override.domain);
    forcedIncluded.push({ key, ...override, action: 'added' });
  }

  const nextGrid = { ...grid, cells: nextCells, oceanBoundsSync: {
    source: 'ZONES_OCEAN_BOUNDS',
    method: 'exact hex/polygon intersection; exceptions topologiques explicites; preserved cells unchanged; missing cells calm',
    updatedAt: new Date().toISOString(),
    preserveExisting,
    removed: removed.length,
    added: added.length,
    forcedIncluded: forcedIncluded.map(entry => entry.key),
  } };
  const report = {
    grid: path.relative(ROOT, gridPath).replace(/\\/g, '/'),
    zones: path.relative(ROOT, zonesPath).replace(/\\/g, '/'),
    mode: write ? 'write' : 'dry-run',
    cellsBefore: Object.keys(existing).length,
    cellsAfter: Object.keys(nextCells).length,
    preserved: Object.keys(existing).length - removed.length,
    preservedOutsideBounds,
    removed,
    added,
    forcedIncluded,
    addedByDomain: Object.fromEntries(oceans.map(ocean => [ocean.domain, added.filter(key => nextCells[key].domain === ocean.domain).length])),
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  if (outputPath) fs.writeFileSync(outputPath, serializeGrid(nextGrid), 'utf8');
  if (write) fs.writeFileSync(gridPath, serializeGrid(nextGrid), 'utf8');
  console.log(JSON.stringify({
    mode: report.mode,
    cellsBefore: report.cellsBefore,
    cellsAfter: report.cellsAfter,
    preserved: report.preserved,
    removed: report.removed.length,
    preservedOutsideBounds: report.preservedOutsideBounds.length,
    added: report.added.length,
    forcedIncluded: report.forcedIncluded,
    addedByDomain: report.addedByDomain,
    report: path.relative(ROOT, reportPath).replace(/\\/g, '/'),
    output: outputPath ? path.relative(ROOT, outputPath).replace(/\\/g, '/') : null,
  }, null, 2));
  if (!write) console.log('\nSimulation uniquement : relancer avec --write après contrôle du rapport.');
}

main();
