#!/usr/bin/env node
'use strict';

/*
 * Consolidation ponctuelle des tracés maritimes artificiels hérités du
 * schéma v1. Ce script n’est pas une fonction générique de Zone Editor :
 * la liste explicite ci-dessous documente les seules fusions autorisées.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'ocean-hex-grid.js');
const REPORT_PATH = path.join(__dirname, 'fluvial-multiple-mouths-consolidation-report.json');
const write = process.argv.includes('--write');

const MERGES = [
  {
    watercourseId: 'cooper',
    targetCourseId: 'f-8-87-a-main',
    sourceCourseIds: ['f-8-87-a-a2', 'f-8-87-a-a3'],
  },
  {
    watercourseId: 'mississippi',
    targetCourseId: 'mississippi-main',
    sourceCourseIds: ['mississippi-b'],
  },
  {
    watercourseId: 'tabasco',
    targetCourseId: 'tabasco-r-main',
    sourceCourseIds: ['tabasco-r-e', 'tabasco-r-f'],
  },
  {
    watercourseId: 'grande-de-la-madalena',
    targetCourseId: 'rio-grande-de-la-madalena-main',
    sourceCourseIds: ['rio-grande-de-la-madalena-b'],
  },
  {
    watercourseId: 'ovarabiche',
    targetCourseId: 'ovarabiche-r-main',
    sourceCourseIds: ['ovarabiche-r-b'],
  },
  {
    watercourseId: 'orenoque',
    targetCourseId: 'orenoque-main',
    sourceCourseIds: ['orenoque-delta-1', 'orenoque-delta-2', 'orenoque-delta-3'],
  },
  {
    watercourseId: 'marateka',
    targetCourseId: 'r-marateka-main',
    sourceCourseIds: ['r-marateka-c'],
  },
  {
    watercourseId: 'balsas',
    targetCourseId: 'f-42-14-d-d1',
    sourceCourseIds: ['f-42-14-d-d2', 'f-42-14-d-d3'],
  },
];

function loadGrid() {
  const source = `${fs.readFileSync(GRID_PATH, 'utf8')}\nglobalThis.__grid = OCEAN_HEX_GRID;`;
  const context = { globalThis: {}, window: {} };
  vm.runInNewContext(source, context, { filename: GRID_PATH, timeout: 30000 });
  if (!context.globalThis.__grid?.cells) throw new Error('OCEAN_HEX_GRID.cells introuvable.');
  return context.globalThis.__grid;
}

function serializeGrid(grid) {
  return `// ocean-hex-grid.js — grille canonique OCEAN\nconst OCEAN_HEX_GRID = ${JSON.stringify(grid)};\nif (typeof window !== 'undefined') window.OCEAN_HEX_GRID = OCEAN_HEX_GRID;\n`;
}

function speedOf(current) {
  const explicit = Number(current?.speedKnot);
  return Number.isFinite(explicit)
    ? explicit
    : Math.hypot(Number(current?.xKnot) || 0, Number(current?.yKnot) || 0);
}

function directionOf(current) {
  const explicit = Number(current?.dirToDeg);
  if (Number.isFinite(explicit)) return ((explicit % 360) + 360) % 360;
  const angle = Math.atan2(Number(current?.yKnot) || 0, Number(current?.xKnot) || 0) * 180 / Math.PI;
  return ((angle % 360) + 360) % 360;
}

function rounded(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function mergeCurrents(currents, targetCourseId, riverId) {
  const preferred = currents.find(current => current.courseId === targetCourseId) || currents[0];
  if (currents.length === 1) {
    return { ...preferred, riverId, courseId: targetCourseId };
  }
  const speedKnot = currents.reduce((sum, current) => sum + speedOf(current), 0) / currents.length;
  const directionVector = currents.reduce((sum, current) => {
    const radians = directionOf(current) * Math.PI / 180;
    return {
      x: sum.x + Math.cos(radians),
      y: sum.y + Math.sin(radians),
    };
  }, { x: 0, y: 0 });
  const fallbackDirection = directionOf(preferred);
  const dirToDeg = Math.hypot(directionVector.x, directionVector.y) < 1e-9
    ? fallbackDirection
    : ((Math.atan2(directionVector.y, directionVector.x) * 180 / Math.PI) + 360) % 360;
  const radians = dirToDeg * Math.PI / 180;
  return {
    ...preferred,
    riverId,
    courseId: targetCourseId,
    xKnot: rounded(speedKnot * Math.cos(radians)),
    yKnot: rounded(speedKnot * Math.sin(radians)),
    speedKnot: rounded(speedKnot),
    dirToDeg: rounded(dirToDeg, 1),
  };
}

function neighbourKeys(key, cell) {
  const q = Number(cell?.q);
  const r = Number(cell?.r);
  if (!Number.isFinite(q) || !Number.isFinite(r)) return [];
  const diagonals = r & 1 ? [q, q + 1] : [q - 1, q];
  return [
    `${r}_${q - 1}`, `${r}_${q + 1}`,
    `${r - 1}_${diagonals[0]}`, `${r - 1}_${diagonals[1]}`,
    `${r + 1}_${diagonals[0]}`, `${r + 1}_${diagonals[1]}`,
  ];
}

function validateContinuity(grid, courseId) {
  const keys = Object.entries(grid.cells)
    .filter(([, cell]) => (cell.fluvialCurrents || []).some(current => current.courseId === courseId))
    .map(([cellKey]) => cellKey);
  const remaining = new Set(keys);
  if (!remaining.size) return { cells: 0, components: 0 };
  let components = 0;
  while (remaining.size) {
    components++;
    const seed = remaining.values().next().value;
    const queue = [seed];
    remaining.delete(seed);
    while (queue.length) {
      const cellKey = queue.shift();
      neighbourKeys(cellKey, grid.cells[cellKey]).forEach(neighbourKey => {
        if (!remaining.has(neighbourKey)) return;
        const present = (grid.cells[neighbourKey]?.fluvialCurrents || [])
          .some(current => current.courseId === courseId);
        if (!present) return;
        remaining.delete(neighbourKey);
        queue.push(neighbourKey);
      });
    }
  }
  return { cells: keys.length, components };
}

function validateResult(before, after, removedCourseIds, results) {
  const errors = [];
  Object.entries(after.cells).forEach(([cellKey, cell]) => {
    const ids = (cell.fluvialCurrents || []).map(current => current.courseId);
    if (new Set(ids).size !== ids.length) errors.push(`${cellKey}: courseId fluvial dupliqué.`);
    const beforeCell = { ...before.cells[cellKey] };
    const afterCell = { ...cell };
    delete beforeCell.fluvialCurrents;
    delete afterCell.fluvialCurrents;
    if (JSON.stringify(beforeCell) !== JSON.stringify(afterCell)) {
      errors.push(`${cellKey}: une propriété non fluviale a été modifiée.`);
    }
  });
  removedCourseIds.forEach(courseId => {
    if (after.fluvialCourses[courseId]) errors.push(`${courseId}: registre source encore présent.`);
    const present = Object.values(after.cells)
      .some(cell => (cell.fluvialCurrents || []).some(current => current.courseId === courseId));
    if (present) errors.push(`${courseId}: vecteur source encore présent.`);
    if (after.fluvialMouths.some(mouth => mouth.courseId === courseId)) {
      errors.push(`${courseId}: embouchure source encore présente.`);
    }
    if (after.fluvialConnections.some(connection => (
      connection.fromCourseId === courseId || connection.toCourseId === courseId
    ))) errors.push(`${courseId}: connexion source encore présente.`);
  });
  results.forEach(result => {
    if (result.continuity.components !== 1) {
      errors.push(`${result.targetCourseId}: ${result.continuity.components} composantes après fusion.`);
    }
    if (result.mouths.length < 2) {
      errors.push(`${result.targetCourseId}: seulement ${result.mouths.length} embouchure(s) après fusion.`);
    }
    const policy = after.fluvialCourses[result.targetCourseId]?.terminalPolicy;
    if (policy?.type !== 'sea' || policy?.mouthMode !== 'multiple') {
      errors.push(`${result.targetCourseId}: politique d’embouchure multiple absente.`);
    }
  });
  (after.fluvialConnections || []).forEach(connection => {
    const fromPresent = (after.cells[connection.fromCellKey]?.fluvialCurrents || [])
      .some(current => current.courseId === connection.fromCourseId);
    const toPresent = (after.cells[connection.toCellKey]?.fluvialCurrents || [])
      .some(current => current.courseId === connection.toCourseId);
    if (!fromPresent || !toPresent) {
      errors.push(`Connexion orpheline ${JSON.stringify(connection)}.`);
    }
  });
  return errors;
}

function main() {
  const before = loadGrid();
  if (before.fluvialSchemaVersion !== 2) throw new Error('Le schéma fluvial v2 est requis.');
  const after = JSON.parse(JSON.stringify(before));
  const replacement = new Map();
  const removedCourseIds = new Set();

  MERGES.forEach(merge => {
    const target = after.fluvialCourses[merge.targetCourseId];
    if (!target) throw new Error(`Tracé cible absent : ${merge.targetCourseId}.`);
    if (target.watercourseId !== merge.watercourseId) {
      throw new Error(`${merge.targetCourseId}: watercourseId inattendu ${target.watercourseId}.`);
    }
    merge.sourceCourseIds.forEach(sourceCourseId => {
      const source = after.fluvialCourses[sourceCourseId];
      if (!source) throw new Error(`Tracé source absent : ${sourceCourseId}.`);
      if (source.watercourseId !== merge.watercourseId || source.riverId !== target.riverId) {
        throw new Error(`${sourceCourseId}: identité incompatible avec ${merge.targetCourseId}.`);
      }
      if (source.terminalPolicy?.type !== 'sea') {
        throw new Error(`${sourceCourseId}: seule une ancienne branche maritime peut être fusionnée.`);
      }
      replacement.set(sourceCourseId, merge.targetCourseId);
      removedCourseIds.add(sourceCourseId);
    });
  });

  const mergedCells = new Map();
  Object.entries(after.cells).forEach(([cellKey, cell]) => {
    const currents = cell.fluvialCurrents || [];
    MERGES.forEach(merge => {
      const mergedIds = new Set([merge.targetCourseId, ...merge.sourceCourseIds]);
      const matching = currents.filter(current => mergedIds.has(current.courseId));
      if (!matching.length) return;
      const firstIndex = currents.findIndex(current => mergedIds.has(current.courseId));
      const target = after.fluvialCourses[merge.targetCourseId];
      const merged = mergeCurrents(matching, merge.targetCourseId, target.riverId);
      cell.fluvialCurrents = currents.filter(current => !mergedIds.has(current.courseId));
      cell.fluvialCurrents.splice(firstIndex, 0, merged);
      if (matching.length > 1) {
        if (!mergedCells.has(merge.targetCourseId)) mergedCells.set(merge.targetCourseId, []);
        mergedCells.get(merge.targetCourseId).push({
          cellKey,
          formerCourseIds: matching.map(current => current.courseId),
          resultSpeedKnot: merged.speedKnot,
          resultDirToDeg: merged.dirToDeg,
        });
      }
    });
  });

  after.fluvialMouths = after.fluvialMouths.map(mouth => ({
    ...mouth,
    courseId: replacement.get(mouth.courseId) || mouth.courseId,
  })).filter((mouth, index, mouths) => mouths.findIndex(candidate => (
    candidate.courseId === mouth.courseId && candidate.cellKey === mouth.cellKey
  )) === index);

  after.fluvialConnections = after.fluvialConnections.map(connection => ({
    ...connection,
    fromCourseId: replacement.get(connection.fromCourseId) || connection.fromCourseId,
    toCourseId: replacement.get(connection.toCourseId) || connection.toCourseId,
  })).filter(connection => connection.fromCourseId !== connection.toCourseId)
    .filter((connection, index, connections) => connections.findIndex(candidate => (
      candidate.type === connection.type
      && candidate.fromCourseId === connection.fromCourseId
      && candidate.fromCellKey === connection.fromCellKey
      && candidate.toCourseId === connection.toCourseId
      && candidate.toCellKey === connection.toCellKey
    )) === index);

  removedCourseIds.forEach(courseId => delete after.fluvialCourses[courseId]);

  const results = MERGES.map(merge => {
    const mouths = after.fluvialMouths
      .filter(mouth => mouth.courseId === merge.targetCourseId)
      .map(mouth => mouth.cellKey);
    after.fluvialCourses[merge.targetCourseId].terminalPolicy = {
      type: 'sea',
      mouthMode: 'multiple',
    };
    return {
      watercourseId: merge.watercourseId,
      riverId: after.fluvialCourses[merge.targetCourseId].riverId,
      targetCourseId: merge.targetCourseId,
      removedCourseIds: merge.sourceCourseIds,
      mouths,
      continuity: validateContinuity(after, merge.targetCourseId),
      mergedCells: mergedCells.get(merge.targetCourseId) || [],
    };
  });

  after.fluvialTopologyConsolidation = {
    source: 'legacy-v1-multiple-mouth-courses',
    updatedAt: new Date().toISOString(),
    vectorStrategy: 'mean speed and circular-mean direction in overlapping cells',
    merges: results.map(result => ({
      targetCourseId: result.targetCourseId,
      removedCourseIds: result.removedCourseIds,
    })),
  };

  const validationErrors = validateResult(before, after, removedCourseIds, results);
  const report = {
    mode: write ? 'write' : 'dry-run',
    grid: path.relative(ROOT, GRID_PATH).replace(/\\/g, '/'),
    courseCountBefore: Object.keys(before.fluvialCourses).length,
    courseCountAfter: Object.keys(after.fluvialCourses).length,
    mouthCountBefore: before.fluvialMouths.length,
    mouthCountAfter: after.fluvialMouths.length,
    connectionCountBefore: before.fluvialConnections.length,
    connectionCountAfter: after.fluvialConnections.length,
    results,
    validationErrors,
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  if (validationErrors.length) {
    throw new Error(`Consolidation invalide :\n${validationErrors.join('\n')}`);
  }
  if (write) fs.writeFileSync(GRID_PATH, serializeGrid(after), 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (!write) console.log('\nSimulation uniquement : relancer avec --write après contrôle du rapport.');
}

main();
