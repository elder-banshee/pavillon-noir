#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const config = require('./config.js');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'ocean-hex-grid.js');
const REPORT_PATH = path.join(__dirname, 'fluvial-components-report.json');
const PREVIEW_PATH = path.join(__dirname, 'fluvial-components-preview.svg');

function loadConst(filePath, name) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__value = ${name};`, sandbox, { filename: filePath });
  return sandbox.__value;
}

function isFluvial(cell) {
  return cell?.natureNav === 'fluviale'
    || (Array.isArray(cell?.naturesNav) && cell.naturesNav.includes('fluviale'));
}

function navigationTypes(cell) {
  return Array.isArray(cell?.naturesNav) ? cell.naturesNav : [cell?.natureNav].filter(Boolean);
}

function numericKeySort(a, b) {
  const [ar, aq] = a.split('_').map(Number);
  const [br, bq] = b.split('_').map(Number);
  return ar - br || aq - bq;
}

function neighbourKeys(cell) {
  const q = Number(cell.q);
  const r = Number(cell.r);
  const diagonals = r & 1 ? [q, q + 1] : [q - 1, q];
  return [
    `${r}_${q - 1}`,
    `${r}_${q + 1}`,
    `${r - 1}_${diagonals[0]}`,
    `${r - 1}_${diagonals[1]}`,
    `${r + 1}_${diagonals[0]}`,
    `${r + 1}_${diagonals[1]}`,
  ];
}

function vectorState(cell) {
  const speed = Number(cell?.speedKnot ?? Math.hypot(Number(cell?.xKnot) || 0, Number(cell?.yKnot) || 0));
  if (cell?.calmeRenseigne) return 'explicit-calm';
  if (cell?.source === 'calm' && cell?.calme) return 'generated-calm';
  if (speed > 0 || Number(cell?.sources) > 0 || Number(cell?.sourceCells) > 0) return 'informed';
  return 'undocumented';
}

function opennessScore(startKey, cells, fluvialSet) {
  const queue = [{ key: startKey, depth: 0 }];
  const visited = new Set([startKey]);
  let nonFluvial = 0;
  let total = 0;
  while (queue.length) {
    const { key, depth } = queue.shift();
    const cell = cells[key];
    if (!cell) continue;
    total++;
    if (!fluvialSet.has(key)) nonFluvial++;
    if (depth >= 3) continue;
    neighbourKeys(cell).forEach(nextKey => {
      if (cells[nextKey] && !visited.has(nextKey)) {
        visited.add(nextKey);
        queue.push({ key: nextKey, depth: depth + 1 });
      }
    });
  }
  return total ? nonFluvial / total : 0;
}

function proposedMouths(componentKeys, cells, fluvialSet, widthPx) {
  const ranked = componentKeys
    .map(key => {
      const cell = cells[key];
      const external = neighbourKeys(cell).filter(nextKey => cells[nextKey] && !fluvialSet.has(nextKey));
      if (!external.length) return null;
      const openness = Math.max(...external.map(nextKey => opennessScore(nextKey, cells, fluvialSet)));
      const coastalBonus = navigationTypes(cell).includes('cotiere') ? 0.12 : 0;
      return { key, score: openness + coastalBonus, openness, externalNeighbours: external.length };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || numericKeySort(a.key, b.key));

  const selected = [];
  for (const candidate of ranked) {
    const cell = cells[candidate.key];
    if (selected.some(item => {
      const other = cells[item.key];
      return Math.hypot(cell.x - other.x, cell.y - other.y) < widthPx * 3;
    })) continue;
    selected.push(candidate);
    if (selected.length >= 3) break;
  }
  return { ranked, selected };
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const grid = loadConst(GRID_PATH, 'OCEAN_HEX_GRID');
const cells = grid.cells || {};
const fluvialKeys = Object.keys(cells).filter(key => isFluvial(cells[key])).sort(numericKeySort);
const fluvialSet = new Set(fluvialKeys);
const unseen = new Set(fluvialKeys);
const components = [];
const compoundComponentIds = new Set(config.compoundComponentIds || []);

while (unseen.size) {
  const anchor = unseen.values().next().value;
  const queue = [anchor];
  const keys = [];
  unseen.delete(anchor);
  while (queue.length) {
    const key = queue.shift();
    keys.push(key);
    neighbourKeys(cells[key]).forEach(nextKey => {
      if (fluvialSet.has(nextKey) && unseen.delete(nextKey)) queue.push(nextKey);
    });
  }
  keys.sort(numericKeySort);
  const componentId = `F-${keys[0]}`;
  const configured = config.components?.[componentId] || {};
  const isCompound = compoundComponentIds.has(componentId);
  const mouthAnalysis = proposedMouths(keys, cells, fluvialSet, Number(grid.widthPx));
  const configuredMouths = Array.isArray(configured.mouthCellKeys) ? configured.mouthCellKeys : [];
  if (isCompound && configuredMouths.length) {
    throw new Error(`La composante composite ${componentId} ne peut pas porter une embouchure unique.`);
  }
  configuredMouths.forEach(key => {
    if (!keys.includes(key)) throw new Error(`Embouchure ${key} hors de la composante ${componentId}.`);
  });
  const states = { informed: 0, 'explicit-calm': 0, 'generated-calm': 0, undocumented: 0 };
  keys.forEach(key => states[vectorState(cells[key])]++);
  const xs = keys.map(key => Number(cells[key].x));
  const ys = keys.map(key => Number(cells[key].y));
  const mixedCoastalKeys = keys.filter(key => navigationTypes(cells[key]).includes('cotiere'));
  components.push({
    id: componentId,
    kind: isCompound ? 'compound' : 'simple',
    anchorCellKey: keys[0],
    name: configured.name || null,
    mapName: configured.mapName || null,
    profile: configured.profile || 'generic',
    cellCount: keys.length,
    cellKeys: keys,
    domains: [...new Set(keys.map(key => cells[key].domain || null))].sort(),
    currentStates: states,
    mixedCoastalCellCount: mixedCoastalKeys.length,
    mixedCoastalCellKeys: mixedCoastalKeys,
    bounds: {
      xMin: Math.min(...xs), xMax: Math.max(...xs),
      yMin: Math.min(...ys), yMax: Math.max(...ys),
    },
    configuredMouthCellKeys: configuredMouths,
    proposedMouths: isCompound ? [] : mouthAnalysis.selected,
    outletCandidates: isCompound ? mouthAnalysis.ranked : [],
    mouthCandidateCount: mouthAnalysis.ranked.length,
    anomalies: [
      ...(keys.length === 1 ? ['single-cell-component'] : []),
      ...(!mouthAnalysis.ranked.length ? ['no-maritime-contact'] : []),
      ...(isCompound ? ['compound-component-needs-river-traces'] : []),
      ...(!isCompound && mouthAnalysis.selected.length > 1 ? ['mouth-review-required'] : []),
    ],
  });
}

components.sort((a, b) => numericKeySort(a.anchorCellKey, b.anchorCellKey));
const knownComponentIds = new Set(components.map(component => component.id));
compoundComponentIds.forEach(componentId => {
  if (!knownComponentIds.has(componentId)) {
    throw new Error(`Composante composite configurée absente : ${componentId}.`);
  }
});
const report = {
  generatedAt: new Date().toISOString(),
  source: path.relative(ROOT, GRID_PATH).replaceAll('\\', '/'),
  method: 'Composantes connexes par voisinage hexagonal odd-r ; embouchures proposées par ouverture maritime locale.',
  counts: {
    gridCells: Object.keys(cells).length,
    fluvialCells: fluvialKeys.length,
    components: components.length,
    compoundComponents: components.filter(component => component.kind === 'compound').length,
    namedComponents: components.filter(component => component.name).length,
    singleCellComponents: components.filter(component => component.cellCount === 1).length,
    configuredMouths: components.reduce((sum, component) => sum + component.configuredMouthCellKeys.length, 0),
  },
  components,
};

fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const componentSvg = components.map((component, index) => {
  const hue = Math.round((index * 137.508) % 360);
  const circles = component.cellKeys.map(key => {
    const cell = cells[key];
    return `<circle cx="${cell.x}" cy="${cell.y}" r="17"/>`;
  }).join('');
  const proposals = component.proposedMouths.map(({ key }, proposalIndex) => {
    const cell = cells[key];
    return `<g class="mouth mouth-${proposalIndex + 1}" transform="translate(${cell.x} ${cell.y})"><circle r="24"/><path d="M-15 0H15M0-15V15"/></g>`;
  }).join('');
  const configured = component.configuredMouthCellKeys.map(key => {
    const cell = cells[key];
    return `<g class="mouth configured" transform="translate(${cell.x} ${cell.y})"><circle r="29"/><path d="M-18 0H18M0-18V18"/></g>`;
  }).join('');
  const labelX = (component.bounds.xMin + component.bounds.xMax) / 2;
  const labelY = (component.bounds.yMin + component.bounds.yMax) / 2;
  const title = component.name ? `${component.id} — ${component.name}` : component.id;
  const compositeMark = component.kind === 'compound' ? ' *' : '';
  const componentClass = component.kind === 'compound' ? 'component component--compound' : 'component';
  return `<g class="${componentClass}" style="--component-color:hsl(${hue} 82% 51%)"><title>${escapeXml(title)} — ${component.cellCount} cellules${component.kind === 'compound' ? ' — composante composite' : ''}</title><g class="cells">${circles}</g>${proposals}${configured}<g class="label" transform="translate(${labelX} ${labelY})"><rect x="-61" y="-23" width="122" height="46" rx="9"/><text>${escapeXml(component.id + compositeMark)}</text></g></g>`;
}).join('');

const legend = components.map((component, index) => {
  const hue = Math.round((index * 137.508) % 360);
  const labelBase = component.name ? `${component.id} — ${component.name}` : component.id;
  const label = component.kind === 'compound' ? `${labelBase} *` : labelBase;
  return `<g transform="translate(${index % 4 * 255} ${Math.floor(index / 4) * 24})"><circle cx="7" cy="-5" r="7" fill="hsl(${hue} 82% 51%)"/><text x="20">${escapeXml(label)} (${component.cellCount})</text></g>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="8500" height="5320" viewBox="0 0 8500 5320">
  <title>Identification des composantes fluviales</title>
  <style>
    .map { opacity: .72; }
    .cells { fill: var(--component-color); fill-opacity: .62; stroke: #07111f; stroke-width: 2; }
    .component--compound .cells { fill-opacity: .48; stroke: #ffdf6c; stroke-width: 4; stroke-dasharray: 7 5; }
    .mouth circle { fill: none; stroke: #ffe45c; stroke-width: 7; }
    .mouth path { stroke: #ffe45c; stroke-width: 5; }
    .mouth-2 { opacity: .72; } .mouth-3 { opacity: .48; }
    .mouth.configured circle, .mouth.configured path { stroke: #ff3b30; }
    .label rect { fill: #07111f; fill-opacity: .9; stroke: var(--component-color); stroke-width: 4; }
    .label text { fill: #fff; font: 700 22px system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; }
    .legend text { fill: #fff; font: 15px system-ui, sans-serif; }
  </style>
  <rect width="8500" height="5320" fill="#07111f"/>
  <image class="map" href="../../medias/cartes/jaillot-1708.jpg" xlink:href="../../medias/cartes/jaillot-1708.jpg" width="8500" height="5320"/>
  ${componentSvg}
  <g class="legend" transform="translate(36 36)"><rect x="-18" y="-26" width="1040" height="${Math.ceil(components.length / 4) * 24 + 28}" rx="12" fill="#07111f" fill-opacity=".88"/>${legend}</g>
</svg>\n`;
fs.writeFileSync(PREVIEW_PATH, svg, 'utf8');

console.log(`Cellules fluviales : ${report.counts.fluvialCells}`);
console.log(`Composantes : ${report.counts.components}`);
console.log(`Composantes d’une cellule : ${report.counts.singleCellComponents}`);
console.log(`Rapport : ${path.relative(ROOT, REPORT_PATH)}`);
console.log(`Aperçu : ${path.relative(ROOT, PREVIEW_PATH)}`);
