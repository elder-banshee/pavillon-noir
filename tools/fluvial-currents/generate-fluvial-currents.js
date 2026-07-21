#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const config = require('./config.js');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'oscar-hex-grid.js');
const COMPONENTS_PATH = path.join(__dirname, 'fluvial-components-report.json');
const REPORT_PATH = path.join(__dirname, 'fluvial-currents-report.json');
const PREVIEW_PATH = path.join(__dirname, 'fluvial-currents-preview.svg');
const write = process.argv.includes('--write');

function loadConst(filePath, name) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__value = ${name};`, sandbox, { filename: filePath });
  return sandbox.__value;
}

function neighbourKeys(cell) {
  const q = Number(cell.q);
  const r = Number(cell.r);
  const diagonals = r & 1 ? [q, q + 1] : [q - 1, q];
  return [
    `${r}_${q - 1}`, `${r}_${q + 1}`,
    `${r - 1}_${diagonals[0]}`, `${r - 1}_${diagonals[1]}`,
    `${r + 1}_${diagonals[0]}`, `${r + 1}_${diagonals[1]}`,
  ];
}

function graphDistances(seedKey, componentSet, cells) {
  const distances = new Map([[seedKey, 0]]);
  const queue = [seedKey];
  while (queue.length) {
    const key = queue.shift();
    const nextDistance = distances.get(key) + 1;
    neighbourKeys(cells[key]).forEach(nextKey => {
      if (!componentSet.has(nextKey) || distances.has(nextKey)) return;
      distances.set(nextKey, nextDistance);
      queue.push(nextKey);
    });
  }
  return distances;
}

function separatedOutletSeeds(component, cells, widthPx, profile) {
  if (component.configuredMouthCellKeys?.length) return component.configuredMouthCellKeys;
  if (component.kind !== 'compound') return component.proposedMouths.slice(0, 1).map(item => item.key);
  const candidates = component.outletCandidates || [];
  if (!candidates.length) return [];
  const threshold = candidates[0].score - profile.compoundOutletScoreTolerance;
  const selected = [];
  for (const candidate of candidates) {
    if (candidate.score < threshold) break;
    const cell = cells[candidate.key];
    if (selected.some(key => {
      const other = cells[key];
      return Math.hypot(cell.x - other.x, cell.y - other.y)
        < widthPx * profile.compoundOutletSeparationCells;
    })) continue;
    selected.push(candidate.key);
    if (selected.length >= profile.maxCompoundOutlets) break;
  }
  return selected;
}

function downstreamDirection(key, distances, componentSet, cells) {
  const cell = cells[key];
  const distance = distances.get(key);
  if (distance === 0) {
    const upstream = neighbourKeys(cell)
      .filter(nextKey => componentSet.has(nextKey) && distances.get(nextKey) === 1)
      .map(nextKey => cells[nextKey]);
    if (!upstream.length) return null;
    return {
      x: cell.x - upstream.reduce((sum, item) => sum + item.x, 0) / upstream.length,
      y: cell.y - upstream.reduce((sum, item) => sum + item.y, 0) / upstream.length,
    };
  }
  const targets = neighbourKeys(cell)
    .filter(nextKey => componentSet.has(nextKey) && distances.get(nextKey) === distance - 1)
    .map(nextKey => cells[nextKey]);
  if (!targets.length) return null;
  return {
    x: targets.reduce((sum, item) => sum + item.x, 0) / targets.length - cell.x,
    y: targets.reduce((sum, item) => sum + item.y, 0) / targets.length - cell.y,
  };
}

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function vectorForCell(key, seedKey, riverId, distances, componentSet, cells, profile) {
  const direction = downstreamDirection(key, distances, componentSet, cells);
  if (!direction) return null;
  const length = Math.hypot(direction.x, direction.y);
  if (length < 0.001) return null;
  const distance = distances.get(key);
  const maxDistance = Math.max(...distances.values());
  const downstreamFactor = maxDistance ? 1 - distance / maxDistance : 1;
  const speed = profile.upstreamSpeedKnot
    + (profile.mouthSpeedKnot - profile.upstreamSpeedKnot) * downstreamFactor;
  const xKnot = direction.x / length * speed;
  const yKnot = direction.y / length * speed;
  return {
    riverId,
    xKnot: round(xKnot),
    yKnot: round(yKnot),
    speedKnot: round(speed),
    dirToDeg: round((Math.atan2(yKnot, xKnot) * 180 / Math.PI + 360) % 360, 1),
    source: 'fluvial-generator',
    mouthCellKey: seedKey,
  };
}

const grid = loadConst(GRID_PATH, 'OSCAR_HEX_GRID');
if (!fs.existsSync(COMPONENTS_PATH)) {
  throw new Error('Rapport des composantes absent ; lancer identify-fluvial-components.js.');
}
const inventory = JSON.parse(fs.readFileSync(COMPONENTS_PATH, 'utf8'));
const profile = config.genericProfile;
const proposals = new Map();
const generatedComponents = [];

inventory.components.forEach(component => {
  const componentSet = new Set(component.cellKeys);
  const seeds = separatedOutletSeeds(component, grid.cells, Number(grid.widthPx), profile);
  if (!seeds.length) {
    generatedComponents.push({ id: component.id, kind: component.kind, seeds: [], cells: component.cellCount, generated: 0, anomaly: 'no-outlet-seed' });
    return;
  }
  const fields = seeds.map((seedKey, index) => ({
    seedKey,
    riverId: seeds.length === 1 ? component.id : `${component.id}-${String.fromCharCode(65 + index)}`,
    distances: graphDistances(seedKey, componentSet, grid.cells),
  }));
  let generated = 0;
  component.cellKeys.forEach(key => {
    const minimum = Math.min(...fields.map(field => field.distances.get(key)));
    const selectedFields = fields.filter(field => field.distances.get(key) === minimum);
    const vectors = selectedFields
      .map(field => vectorForCell(key, field.seedKey, field.riverId, field.distances, componentSet, grid.cells, profile))
      .filter(Boolean);
    if (vectors.length) {
      proposals.set(key, vectors);
      generated += vectors.length;
    }
  });
  generatedComponents.push({
    id: component.id,
    kind: component.kind,
    seeds,
    riverIds: fields.map(field => field.riverId),
    cells: component.cellCount,
    generated,
    anomalies: component.kind === 'compound' && seeds.length < 2
      ? ['compound-component-has-fewer-than-two-outlet-seeds']
      : [],
  });
});

let preservedManualVectors = 0;
let writtenCells = 0;
if (write) {
  proposals.forEach((vectors, key) => {
    const cell = grid.cells[key];
    const existing = Array.isArray(cell.fluvialCurrents) ? cell.fluvialCurrents : [];
    const manual = existing.filter(vector => vector?.source !== 'fluvial-generator');
    preservedManualVectors += manual.length;
    cell.fluvialCurrents = [...manual, ...vectors];
    writtenCells++;
  });
  const original = fs.readFileSync(GRID_PATH, 'utf8');
  const replacement = `const OSCAR_HEX_GRID = ${JSON.stringify(grid)};`;
  const updated = original.replace(/const OSCAR_HEX_GRID\s*=\s*[\s\S]*;\s*$/, replacement);
  if (updated === original) throw new Error('Bloc OSCAR_HEX_GRID introuvable.');
  fs.writeFileSync(GRID_PATH, `${updated.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd()}\n`, 'utf8');
}

const multipleVectorCells = [...proposals.values()].filter(vectors => vectors.length > 1).length;
const abruptDirectionPairs = [];
proposals.forEach((vectors, key) => {
  neighbourKeys(grid.cells[key]).forEach(nextKey => {
    if (key >= nextKey || !proposals.has(nextKey)) return;
    vectors.forEach(vector => {
      const other = proposals.get(nextKey).find(candidate => candidate.riverId === vector.riverId);
      if (!other) return;
      const difference = Math.abs(vector.dirToDeg - other.dirToDeg);
      const shortest = Math.min(difference, 360 - difference);
      if (shortest > 100) {
        abruptDirectionPairs.push({ riverId: vector.riverId, cells: [key, nextKey], angleDeg: round(shortest, 1) });
      }
    });
  });
});
const report = {
  generatedAt: new Date().toISOString(),
  write,
  method: 'Champ de distance hexagonal vers une ou plusieurs sorties ; gradient discret dirigé vers l’aval.',
  profile,
  counts: {
    components: inventory.components.length,
    generatedComponents: generatedComponents.filter(component => component.generated > 0).length,
    proposedCells: proposals.size,
    proposedVectors: [...proposals.values()].reduce((sum, vectors) => sum + vectors.length, 0),
    multipleVectorCells,
    fluvialCellsWithoutVector: inventory.counts.fluvialCells - proposals.size,
    abruptDirectionPairs: abruptDirectionPairs.length,
    writtenCells,
    preservedManualVectors,
  },
  components: generatedComponents,
  abruptDirectionPairs,
  cells: Object.fromEntries(proposals),
};
fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const arrowSvg = [...proposals.entries()].flatMap(([key, vectors]) => {
  const cell = grid.cells[key];
  return vectors.map((vector, index) => {
    const offset = (index - (vectors.length - 1) / 2) * 9;
    return `<g transform="translate(${cell.x} ${cell.y}) rotate(${vector.dirToDeg}) translate(0 ${offset})"><path d="M-17 0H15M7-8L17 0 7 8"/></g>`;
  });
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="8500" height="5320" viewBox="0 0 8500 5320"><style>.map{opacity:.68}.arrows path{fill:none;stroke:#00f0a8;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.arrows g:nth-child(3n+2) path{stroke:#ffe45c}.arrows g:nth-child(3n) path{stroke:#ff6bd6}</style><rect width="8500" height="5320" fill="#07111f"/><image class="map" href="../../medias/cartes/jaillot-1708.jpg" xlink:href="../../medias/cartes/jaillot-1708.jpg" width="8500" height="5320"/><g class="arrows">${arrowSvg}</g></svg>\n`;
fs.writeFileSync(PREVIEW_PATH, svg, 'utf8');

console.log(`Cellules proposées : ${report.counts.proposedCells}`);
console.log(`Vecteurs proposés : ${report.counts.proposedVectors}`);
console.log(`Cellules à plusieurs vecteurs : ${report.counts.multipleVectorCells}`);
console.log(`Ruptures angulaires > 100° : ${report.counts.abruptDirectionPairs}`);
console.log(write ? `Grille mise à jour : ${writtenCells} cellules.` : 'Simulation seulement ; utiliser --write après contrôle du SVG.');
