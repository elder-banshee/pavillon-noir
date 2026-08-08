#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const config = require('./config.js');

const ROOT = path.resolve(__dirname, '..', '..');
const ZONES_PATH = path.join(ROOT, 'js', 'zones-data.js');
const GRID_PATH = path.join(ROOT, 'js', 'ocean-hex-grid.js');
const REPORT_PATH = path.join(__dirname, 'coastal-navigation-report.json');
const PREVIEW_PATH = path.join(__dirname, 'coastal-navigation-preview.svg');
const write = process.argv.includes('--write');
const writeForcedCellsOnly = process.argv.includes('--write-forced-cells-only');

function loadConst(filePath, name) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__value = ${name};`, sandbox, { filename: filePath });
  return sandbox.__value;
}

function rings(value) {
  if (!Array.isArray(value) || !value.length) return [];
  if (typeof value[0]?.[0] === 'number') return [value];
  return value.filter(ring => Array.isArray(ring) && typeof ring[0]?.[0] === 'number');
}

function signedArea(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return sum / 2;
}

function distancePointSegment(point, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length2 = dx * dx + dy * dy;
  const t = length2 ? Math.max(0, Math.min(1, ((point.x - a[0]) * dx + (point.y - a[1]) * dy) / length2)) : 0;
  return Math.hypot(point.x - (a[0] + t * dx), point.y - (a[1] + t * dy));
}

function distanceToRing(point, ring, maxDistance) {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    best = Math.min(best, distancePointSegment(point, ring[j], ring[i]));
    if (best === 0) break;
  }
  return best;
}

function svgPath(ring) {
  return ring.map(([x, y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ') + ' Z';
}

const zones = loadConst(ZONES_PATH, 'ZONES_DATA');
const grid = loadConst(GRID_PATH, 'OCEAN_HEX_GRID');
const referenceRings = rings(zones[config.automaticLand.referenceZoneId]);
if (!referenceRings.length) throw new Error(`Zone de référence absente : ${config.automaticLand.referenceZoneId}`);

const referenceArea = Math.max(...referenceRings.map(ring => Math.abs(signedArea(ring))));
const minArea = config.automaticLand.includeReferenceArea ? referenceArea : referenceArea + Number.EPSILON;
const whitelist = new Map((config.whitelistLand || []).map(entry => [entry.zoneId, entry.components]));
const coastalLand = [];

Object.entries(zones).forEach(([zoneId, zone]) => {
  // Les hauts-fonds sont des contraintes maritimes, jamais des sources de
  // bande côtière, même lorsque leur aire dépasse celle de Porto Rico.
  if (zoneId.startsWith('banc-')) return;
  rings(zone).forEach((ring, componentIndex) => {
    const area = Math.abs(signedArea(ring));
    const requestedComponents = whitelist.get(zoneId);
    const isWhitelisted = requestedComponents === 'all'
      || (Array.isArray(requestedComponents) && requestedComponents.includes(componentIndex + 1));
    if (area >= minArea || isWhitelisted) {
      coastalLand.push({ zoneId, componentIndex, area, ring, source: area >= minArea ? 'threshold' : 'whitelist' });
    }
  });
});

for (const [zoneId, requestedComponents] of whitelist) {
  const count = rings(zones[zoneId]).length;
  if (!count) throw new Error(`Zone en liste blanche absente : ${zoneId}`);
  if (Array.isArray(requestedComponents)) {
    requestedComponents.forEach(component => {
      if (!Number.isInteger(component) || component < 1 || component > count) {
        throw new Error(`Contour ${component}/${count} invalide pour ${zoneId}`);
      }
    });
  }
}

const distancePx = config.map.coastalDistanceNm / config.map.nauticalMilesPerPixel;
const generated = [];
const excludedFluvial = [];
const forcedFluvial = new Set(config.forcedFluvialCells || []);

// Certaines cellules traversées par un méandre étroit peuvent être absentes de
// la grille issue du test centre/sommets. Les exceptions validées sont créées à
// leur position canonique avant l'application des natures de navigation.
Object.entries(config.forcedCellDefinitions || {}).forEach(([key, definition]) => {
  if (grid.cells[key]) return;
  const [r, q] = key.split('_').map(Number);
  const width = Number(grid.widthPx);
  const radius = Number(grid.radiusPx);
  const spacingY = Number(grid.centerSpacingPx?.y);
  if (![r, q, width, radius, spacingY].every(Number.isFinite)) {
    throw new Error(`Définition de cellule forcée invalide : ${key}`);
  }
  grid.cells[key] = {
    q,
    r,
    x: Math.round((width / 2 + ((r & 1) ? width / 2 : 0) + q * width) * 100) / 100,
    y: Math.round((radius + r * spacingY) * 100) / 100,
    xKnot: 0,
    yKnot: 0,
    speedKnot: 0,
    dirToDeg: null,
    maxSpeedKnot: 0,
    source: 'calm',
    calme: true,
    domain: definition.domain,
  };
});

Object.entries(grid.cells).forEach(([key, cell]) => {
  const point = { x: Number(cell.x), y: Number(cell.y) };
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
  const navigationTypes = Array.isArray(cell.naturesNav) ? cell.naturesNav : [cell.natureNav].filter(Boolean);
  if (forcedFluvial.has(key) || (navigationTypes.includes('fluviale') && navigationTypes.length === 1)) {
    excludedFluvial.push(key);
    return;
  }
  const nearCoast = coastalLand.some(land => distanceToRing(point, land.ring, distancePx) <= distancePx);
  if (!nearCoast) return;
  generated.push(key);
  if (write && !writeForcedCellsOnly && Array.isArray(cell.naturesNav)) {
    if (!cell.naturesNav.includes('cotiere')) cell.naturesNav.push('cotiere');
    cell.natureNavSource ||= 'coastal-generator';
  } else if (write && !writeForcedCellsOnly && cell.natureNav === 'hauturiere') {
    cell.naturesNav = ['hauturiere', 'cotiere'];
    delete cell.natureNav;
    cell.natureNavSource ||= 'coastal-generator';
  } else if (write && !writeForcedCellsOnly && cell.natureNav !== 'cotiere') {
    cell.natureNav = 'cotiere';
    cell.natureNavSource ||= 'coastal-generator';
  }
});

const report = {
  generatedAt: new Date().toISOString(),
  write,
  referenceZoneId: config.automaticLand.referenceZoneId,
  referenceAreaPx2: referenceArea,
  coastalDistanceNm: config.map.coastalDistanceNm,
  coastalDistancePx: distancePx,
  coastalLandComponents: coastalLand.map(({ ring, ...entry }) => ({ ...entry, points: ring.length })),
  counts: {
    gridCells: Object.keys(grid.cells).length,
    coastalCells: generated.length,
    fluvialCellsExcluded: excludedFluvial.length,
  },
  coastalCellKeys: generated,
  forcedFluvialCellKeys: [...forcedFluvial],
};

fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
const circles = generated.map(key => {
  const cell = grid.cells[key];
  return `<circle cx="${cell.x}" cy="${cell.y}" r="8"/>`;
}).join('');
const landPaths = coastalLand.map(land => `<path d="${svgPath(land.ring)}"/>`).join('');
fs.writeFileSync(PREVIEW_PATH, `<svg xmlns="http://www.w3.org/2000/svg" width="8500" height="5320" viewBox="0 0 8500 5320"><rect width="8500" height="5320" fill="#07111f"/><g fill="#b79b62" opacity=".7">${landPaths}</g><g fill="#3cc8ff" opacity=".75">${circles}</g></svg>\n`, 'utf8');

if (write || writeForcedCellsOnly) {
  for (const key of forcedFluvial) {
    const cell = grid.cells[key];
    if (!cell) throw new Error(`Cellule fluviale forcée absente : ${key}`);
    cell.natureNav = 'fluviale';
    delete cell.naturesNav;
    delete cell.natureNavSource;
  }
  const original = fs.readFileSync(GRID_PATH, 'utf8');
  const replacement = `const OCEAN_HEX_GRID = ${JSON.stringify(grid)};`;
  const updated = original.replace(/const OCEAN_HEX_GRID\s*=\s*[\s\S]*;\s*$/, replacement);
  if (updated === original) throw new Error('Bloc OCEAN_HEX_GRID introuvable.');
  fs.writeFileSync(GRID_PATH, `${updated.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd()}\n`, 'utf8');
}

console.log(`Seuil Porto Rico : ${referenceArea.toFixed(1)} px²`);
console.log(`Rayon côtier : ${distancePx.toFixed(2)} px (${config.map.coastalDistanceNm} NM Jaillot)`);
console.log(`Composantes terrestres : ${coastalLand.length}`);
console.log(`Cellules côtières proposées : ${generated.length}`);
console.log(write ? 'Grille mise à jour.' : 'Simulation seulement ; utiliser --write après contrôle du SVG.');
