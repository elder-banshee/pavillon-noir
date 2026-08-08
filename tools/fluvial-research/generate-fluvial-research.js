#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'ocean-hex-grid.js');
const ZONES_PATH = path.join(ROOT, 'js', 'zones-data.js');
const CITIES_PATH = path.join(ROOT, 'js', 'villes-data.js');
const MAP_PATH = path.join(ROOT, 'medias', 'cartes', 'jaillot-1708.jpg');
const JSON_PATH = path.join(__dirname, 'fluvial-research-inventory.json');
const MARKDOWN_PATH = path.join(__dirname, 'fluvial-research-dossier.md');
const SVG_PATH = path.join(__dirname, 'fluvial-research-map.svg');
const NM_PER_PIXEL = 0.310282;

function loadConst(filePath, names) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__values = {${names.join(',')}};`, sandbox, { filename: filePath });
  return sandbox.__values;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function slug(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sans-nom';
}

function escapeXml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function branchBase(rawId) {
  if (/^Delta_Orénoque_\d+$/u.test(rawId)) return 'Orénoque';
  if (/^Nicaragua_\d+$/u.test(rawId)) return 'Lac Nicaragua';
  if (/^Pacific_\d+$/u.test(rawId)) return 'Pacific';
  if (/^F-/u.test(rawId)) {
    // Les lettres A/B/C des anciennes composantes composites désignent souvent
    // des rivières distinctes, pas des bras d’un même fleuve. Seul un chiffre
    // ajouté après la lettre (A2, D3…) signale ici un sous-bras à regrouper.
    return rawId.replace(/(-[A-Z])\d+$/u, '$1');
  }
  return rawId.replace(/_(?:[A-Z]|\d+)$/u, '').replace(/\.$/u, '');
}

function preferredName(base, allIds) {
  if (/^F-/u.test(base) || base === 'Pacific') return null;
  if (allIds.has(base)) return base;
  if (allIds.has(`${base}.`)) return `${base}.`;
  return base;
}

function branchCode(rawId, base, name) {
  if (rawId === name || rawId === base || rawId === `${base}.`) return 'main';
  if (/^Delta_Orénoque_(\d+)$/u.test(rawId)) return `delta-${rawId.match(/(\d+)$/u)[1]}`;
  if (/^Nicaragua_(\d+)$/u.test(rawId)) return `bras-${rawId.match(/(\d+)$/u)[1]}`;
  const underscored = rawId.match(/_([A-Z]|\d+)$/u);
  if (underscored) return underscored[1].toLowerCase();
  const technical = rawId.match(/-([A-Z](?:\d+)?)$/u) || rawId.match(/(?<=\d)([A-Z])$/u);
  return technical ? technical[1].toLowerCase() : slug(rawId).slice(-16);
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

function normalizeRings(value) {
  if (!Array.isArray(value) || !value.length) return [];
  if (typeof value[0]?.[0] === 'number') return [value];
  return value.flatMap(item => {
    if (Array.isArray(item)) return normalizeRings(item);
    if (item && Array.isArray(item.exterior)) return [item.exterior];
    if (item && Array.isArray(item.points)) return [item.points];
    return [];
  });
}

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (((yi > point.y) !== (yj > point.y))
      && point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 1e-9) + xi) inside = !inside;
  }
  return inside;
}

function distancePointSegment(point, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length2 = dx * dx + dy * dy;
  const t = length2 ? Math.max(0, Math.min(1, ((point.x - a[0]) * dx + (point.y - a[1]) * dy) / length2)) : 0;
  return Math.hypot(point.x - (a[0] + t * dx), point.y - (a[1] + t * dy));
}

function distanceToRings(point, rings) {
  if (rings.some(ring => pointInRing(point, ring))) return 0;
  let minimum = Infinity;
  rings.forEach(ring => ring.forEach((a, index) => {
    const b = ring[(index + 1) % ring.length];
    minimum = Math.min(minimum, distancePointSegment(point, a, b));
  }));
  return minimum;
}

function cityPoint(city) {
  const coords = Array.isArray(city?.coords) ? city.coords : city?.rade;
  return Array.isArray(coords) && coords.length >= 2
    ? { x: Number(coords[0]), y: Number(coords[1]) }
    : null;
}

function distanceToTrace(point, trace) {
  return trace.reduce((minimum, cell) => Math.min(minimum, Math.hypot(point.x - cell.x, point.y - cell.y)), Infinity);
}

const { OCEAN_HEX_GRID: grid } = loadConst(GRID_PATH, ['OCEAN_HEX_GRID']);
const { ZONES_DATA: zones } = loadConst(ZONES_PATH, ['ZONES_DATA']);
const { VILLES: cities } = loadConst(CITIES_PATH, ['VILLES']);
const cells = grid.cells;
const allIds = new Set();
Object.values(cells).forEach(cell => (cell.fluvialCurrents || []).forEach(current => allIds.add(current.riverId)));

const groupByRawId = new Map();
const groupsByBase = new Map();
[...allIds].sort((a, b) => a.localeCompare(b, 'fr')).forEach(rawId => {
  const base = branchBase(rawId);
  if (!groupsByBase.has(base)) groupsByBase.set(base, []);
  groupsByBase.get(base).push(rawId);
});

const usedWatercourseIds = new Set();
const watercourseByRawId = new Map();
const watercourses = [...groupsByBase.entries()].map(([base, rawIds]) => {
  const name = preferredName(base, allIds);
  let watercourseId = slug(name || base);
  let suffix = 2;
  while (usedWatercourseIds.has(watercourseId)) watercourseId = `${slug(name || base)}-${suffix++}`;
  usedWatercourseIds.add(watercourseId);
  rawIds.forEach(rawId => {
    groupByRawId.set(rawId, base);
    watercourseByRawId.set(rawId, watercourseId);
  });
  return { watercourseId, base, name, rawIds };
});

const zoneRings = Object.entries(zones).map(([zoneId, geometry]) => ({ zoneId, rings: normalizeRings(geometry) }))
  .filter(entry => entry.rings.length);
const usableCities = cities.map(city => ({ city, point: cityPoint(city) })).filter(entry => entry.point);

watercourses.forEach(watercourse => {
  const rawSet = new Set(watercourse.rawIds);
  const traceCells = [];
  const branches = watercourse.rawIds.map(rawId => ({
    riverId: rawId,
    courseId: `${watercourse.watercourseId}-${branchCode(rawId, watercourse.base, watercourse.name)}`,
    branch: branchCode(rawId, watercourse.base, watercourse.name),
    cellKeys: [],
  }));
  const branchByRawId = new Map(branches.map(branch => [branch.riverId, branch]));
  const outlets = [];
  const relations = [];
  Object.entries(cells).forEach(([cellKey, cell]) => {
    const currents = (cell.fluvialCurrents || []).filter(current => rawSet.has(current.riverId));
    if (currents.length) {
      traceCells.push({ cellKey, x: Number(cell.x), y: Number(cell.y) });
      currents.forEach(current => branchByRawId.get(current.riverId).cellKeys.push(cellKey));
    }
    (cell.fluvialOutlets || []).filter(outlet => rawSet.has(outlet.riverId)).forEach(outlet => outlets.push({
      cellKey,
      x: Number(cell.x),
      y: Number(cell.y),
      riverId: outlet.riverId,
      type: outlet.type,
      ...(outlet.targetRiverId ? { targetRiverId: outlet.targetRiverId } : {}),
    }));
    (cell.fluvialRelations || []).forEach(relation => {
      const ids = [relation.fromRiverId, relation.toRiverId, ...(relation.riverIds || [])].filter(Boolean);
      if (!ids.some(id => rawSet.has(id))) return;
      relations.push({ cellKey, ...relation });
    });
  });
  const uniqueTrace = [...new Map(traceCells.map(cell => [cell.cellKey, cell])).values()];
  const xs = uniqueTrace.map(cell => cell.x);
  const ys = uniqueTrace.map(cell => cell.y);
  const centroid = {
    x: round(xs.reduce((sum, value) => sum + value, 0) / xs.length),
    y: round(ys.reduce((sum, value) => sum + value, 0) / ys.length),
  };
  const bbox = { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
  const nearbyCities = usableCities.map(({ city, point }) => {
    const distancePx = distanceToTrace(point, uniqueTrace);
    return {
      id: city.id,
      name: city.nom || city.id,
      territory: city.territoire || null,
      type: city.type || null,
      coords: [point.x, point.y],
      distancePx: round(distancePx, 1),
      distanceNm: round(distancePx * NM_PER_PIXEL, 1),
    };
  }).sort((a, b) => a.distancePx - b.distancePx).slice(0, 5);
  const territories = zoneRings.map(zone => ({
    zoneId: zone.zoneId,
    distancePx: uniqueTrace.reduce((minimum, point) => Math.min(minimum, distanceToRings(point, zone.rings)), Infinity),
  })).sort((a, b) => a.distancePx - b.distancePx).slice(0, 3)
    .map(entry => ({ ...entry, distancePx: round(entry.distancePx, 1), distanceNm: round(entry.distancePx * NM_PER_PIXEL, 1) }));
  Object.assign(watercourse, {
    mapLabelPresent: watercourse.name !== null,
    mapLabel: watercourse.name,
    researchStatus: watercourse.name === null ? 'to-identify' : 'named-on-map',
    branches,
    cellKeys: uniqueTrace.map(cell => cell.cellKey).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    cellCount: uniqueTrace.length,
    trace: uniqueTrace,
    centroid,
    bbox,
    outlets,
    relations,
    nearbySettlements: nearbyCities,
    nearbyTerritories: territories,
  });
});

const neighboursByWatercourse = new Map(watercourses.map(item => [item.watercourseId, new Set()]));
Object.entries(cells).forEach(([cellKey, cell]) => {
  const here = new Set((cell.fluvialCurrents || []).map(current => watercourseByRawId.get(current.riverId)).filter(Boolean));
  neighbourKeys(cell).forEach(nextKey => {
    const there = new Set((cells[nextKey]?.fluvialCurrents || []).map(current => watercourseByRawId.get(current.riverId)).filter(Boolean));
    here.forEach(first => there.forEach(second => {
      if (first !== second) neighboursByWatercourse.get(first).add(second);
    }));
  });
});
watercourses.forEach(watercourse => {
  watercourse.neighbouringWatercourses = [...neighboursByWatercourse.get(watercourse.watercourseId)]
    .map(id => {
      const neighbour = watercourses.find(item => item.watercourseId === id);
      return { watercourseId: id, name: neighbour?.name || null, riverIds: neighbour?.rawIds || [] };
    }).sort((a, b) => (a.name || a.watercourseId).localeCompare(b.name || b.watercourseId, 'fr'));
  delete watercourse.base;
  delete watercourse.rawIds;
});

const unnamed = watercourses.filter(item => item.researchStatus === 'to-identify')
  .sort((a, b) => {
    const ao = a.outlets[0] || a.centroid;
    const bo = b.outlets[0] || b.centroid;
    return ao.x - bo.x || ao.y - bo.y;
  });
unnamed.forEach((item, index) => { item.researchId = `R${String(index + 1).padStart(3, '0')}`; });

const inventory = {
  schemaVersion: 1,
  description: 'Inventaire de recherche des cours d’eau de la carte Jaillot 1708. Les noms sont séparés des identifiants techniques de bras.',
  coordinateSystem: { unit: 'pixel', width: 8500, height: 5320, nauticalMilesPerPixel: NM_PER_PIXEL },
  sources: ['js/ocean-hex-grid.js', 'js/zones-data.js', 'js/villes-data.js'],
  conventions: {
    riverId: 'Identifiant technique actuel du bras dans la grille.',
    courseId: 'Proposition d’identifiant technique stable et unique du bras.',
    watercourseId: 'Identifiant commun du fleuve, de la rivière ou du lac auquel appartiennent les bras.',
    name: 'Nom d’affichage commun ; null lorsque la carte ne donne aucun nom.',
    mapLabel: 'Transcription conservée du nom relevé sur la carte.',
  },
  counts: {
    watercourses: watercourses.length,
    branches: watercourses.reduce((sum, item) => sum + item.branches.length, 0),
    unnamedWatercourses: unnamed.length,
  },
  watercourses: watercourses.sort((a, b) => a.watercourseId.localeCompare(b.watercourseId, 'fr')),
};

fs.writeFileSync(JSON_PATH, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

function outletText(item) {
  if (!item.outlets.length) return 'aucun terme déclaré';
  return item.outlets.map(outlet => {
    if (outlet.type === 'sea') return `${outlet.cellKey} — mer (${round(outlet.x)}, ${round(outlet.y)})`;
    if (outlet.type === 'map-edge') return `${outlet.cellKey} — hors carte (${round(outlet.x)}, ${round(outlet.y)})`;
    return `${outlet.cellKey} — jonction vers ${outlet.targetRiverId} (${round(outlet.x)}, ${round(outlet.y)})`;
  }).join(' ; ');
}

const md = [
  '# Dossier de recherche — cours d’eau sans nom sur la carte Jaillot',
  '',
  `Ce dossier recense **${unnamed.length} cours ou familles de bras sans nom relevé sur la carte**, sur ${watercourses.length} cours inventoriés.`,
  '',
  '## Consignes de recherche',
  '',
  '- Identifier le cours représenté à partir de son embouchure, de son tracé, des territoires et des établissements voisins.',
  '- Privilégier les sources historiques ou cartographiques contemporaines de la période 1700–1720, puis confronter avec la géographie moderne.',
  '- Ne pas confondre une ressemblance géographique avec une identification certaine : fournir un niveau de confiance et les alternatives.',
  '- Conserver séparément le nom moderne, les variantes historiques et la graphie éventuellement visible sur d’autres cartes.',
  '- Citer les sources et leurs liens ou références bibliographiques exactes.',
  '',
  '## Tableau de repérage',
  '',
  '| Repère | Identifiants actuels | Débouché | Territoire le plus proche | Établissement le plus proche |',
  '|---|---|---|---|---|',
  ...unnamed.map(item => `| ${item.researchId} | ${item.branches.map(branch => `\`${branch.riverId}\``).join(', ')} | ${outletText(item)} | ${item.nearbyTerritories[0]?.zoneId || '—'} | ${item.nearbySettlements[0] ? `${item.nearbySettlements[0].name} (${item.nearbySettlements[0].distanceNm} NM carte)` : '—'} |`),
  '',
  '## Fiches détaillées',
  '',
  ...unnamed.flatMap(item => [
    `### ${item.researchId} — ${item.watercourseId}`,
    '',
    `- **Identifiants de bras actuels :** ${item.branches.map(branch => `\`${branch.riverId}\``).join(', ')}`,
    `- **Nombre de cellules :** ${item.cellCount}`,
    `- **Débouché ou jonction :** ${outletText(item)}`,
    `- **Centre du tracé :** (${item.centroid.x}, ${item.centroid.y}) dans le référentiel 8500 × 5320 px`,
    `- **Emprise :** x ${round(item.bbox.minX)}–${round(item.bbox.maxX)}, y ${round(item.bbox.minY)}–${round(item.bbox.maxY)}`,
    `- **Territoires proches :** ${item.nearbyTerritories.map(entry => `${entry.zoneId} (${entry.distanceNm} NM carte)`).join(', ') || '—'}`,
    `- **Établissements proches :** ${item.nearbySettlements.map(entry => `${entry.name} [${entry.id}] — ${entry.distanceNm} NM carte`).join(' ; ') || '—'}`,
    `- **Cours voisins :** ${item.neighbouringWatercourses.map(entry => entry.name || entry.watercourseId).join(', ') || '—'}`,
    `- **Cellules :** ${item.cellKeys.map(key => `\`${key}\``).join(', ')}`,
    '',
    '**Résultat attendu :** nom moderne probable, noms historiques ou variantes, justification géographique, sources, niveau de confiance (`fort`, `moyen`, `faible`) et autres candidats éventuels.',
    '',
  ]),
  '## Format de réponse recommandé',
  '',
  '```json',
  '{',
  '  "researchId": "R001",',
  '  "identifiedName": "Nom proposé",',
  '  "modernName": "Nom moderne éventuel",',
  '  "historicalVariants": ["Variante 1"],',
  '  "confidence": "fort|moyen|faible",',
  '  "reasoning": "Concordance de l’embouchure, du tracé et des lieux voisins.",',
  '  "alternatives": [],',
  '  "sources": [{ "title": "…", "url": "…", "date": "…" }]',
  '}',
  '```',
  '',
].join('\n');
fs.writeFileSync(MARKDOWN_PATH, md, 'utf8');

const unknownIds = new Set(unnamed.map(item => item.watercourseId));
const segments = [];
const circles = [];
const segmentSeen = new Set();
Object.entries(cells).forEach(([key, cell]) => {
  const groupIds = new Set((cell.fluvialCurrents || []).map(current => watercourseByRawId.get(current.riverId)).filter(Boolean));
  groupIds.forEach(watercourseId => {
    circles.push(`<circle class="river-cell ${unknownIds.has(watercourseId) ? 'unknown' : 'named'}" cx="${cell.x}" cy="${cell.y}" r="8"/>`);
    neighbourKeys(cell).forEach(nextKey => {
      const next = cells[nextKey];
      if (!next || !(next.fluvialCurrents || []).some(current => watercourseByRawId.get(current.riverId) === watercourseId)) return;
      const signature = [key, nextKey].sort().join('|') + `|${watercourseId}`;
      if (segmentSeen.has(signature)) return;
      segmentSeen.add(signature);
      segments.push(`<path class="river-line ${unknownIds.has(watercourseId) ? 'unknown' : 'named'}" d="M${cell.x} ${cell.y}L${next.x} ${next.y}"/>`);
    });
  });
});
const markers = unnamed.map(item => {
  const point = item.outlets[0] || item.centroid;
  return `<g class="research-marker" transform="translate(${point.x} ${point.y})"><circle r="22"/><text y="6">${item.researchId}</text></g>`;
}).join('');
const relevantCityIds = new Set(unnamed.flatMap(item => item.nearbySettlements.map(city => city.id)));
const cityMarks = usableCities
  .filter(({ city }) => relevantCityIds.has(city.id))
  .map(({ city, point }) => `<g class="city" transform="translate(${point.x} ${point.y})"><circle r="4"/><text x="7" y="4">${escapeXml(city.nom || city.id)}</text></g>`)
  .join('');
const embeddedMap = `data:image/jpeg;base64,${fs.readFileSync(MAP_PATH).toString('base64')}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8500" height="5320" viewBox="0 0 8500 5320">
  <style>
    .map{opacity:.56}.river-line{fill:none;stroke-linecap:round}.river-line.named{stroke:#38bdf8;stroke-width:5;opacity:.48}.river-line.unknown{stroke:#ff9f1c;stroke-width:10;opacity:.96}.river-cell{stroke:none}.river-cell.named{fill:#38bdf8;opacity:.28}.river-cell.unknown{fill:#ffe066;opacity:.9}.research-marker circle{fill:#111827;stroke:#ffe066;stroke-width:5}.research-marker text{fill:#fff;font:700 16px sans-serif;text-anchor:middle}.city circle{fill:#f8fafc;stroke:#111827;stroke-width:2}.city text{fill:#fff;paint-order:stroke;stroke:#111827;stroke-width:4px;font:15px sans-serif}.legend{fill:#07111f;stroke:#94a3b8;stroke-width:2;opacity:.94}.legend-text{fill:#fff;font:20px sans-serif}.legend-title{fill:#ffe066;font:700 27px sans-serif}
  </style>
  <rect width="8500" height="5320" fill="#07111f"/>
  <image class="map" href="${embeddedMap}" width="8500" height="5320"/>
  <g>${segments.join('')}</g><g>${circles.join('')}</g><g>${cityMarks}</g><g>${markers}</g>
  <g transform="translate(55 55)"><rect class="legend" width="720" height="165" rx="14"/><text class="legend-title" x="25" y="42">Recherche des cours d’eau sans nom</text><path class="river-line unknown" d="M28 78H105"/><text class="legend-text" x="125" y="85">Cours à identifier (${unnamed.length})</text><path class="river-line named" d="M28 118H105"/><text class="legend-text" x="125" y="125">Cours nommé sur la carte</text><text class="legend-text" x="25" y="153">Repères R001… : voir fluvial-research-dossier.md</text></g>
</svg>\n`;
fs.writeFileSync(SVG_PATH, svg, 'utf8');

console.log(`Cours regroupés : ${watercourses.length}`);
console.log(`Bras techniques : ${inventory.counts.branches}`);
console.log(`Cours sans nom : ${unnamed.length}`);
console.log(`Fichiers : ${path.relative(ROOT, JSON_PATH)}, ${path.relative(ROOT, MARKDOWN_PATH)}, ${path.relative(ROOT, SVG_PATH)}`);
