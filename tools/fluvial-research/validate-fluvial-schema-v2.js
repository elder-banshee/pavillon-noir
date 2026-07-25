#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'oscar-hex-grid.js');
const REPORT_PATH = path.join(__dirname, 'fluvial-schema-v2-validation.json');

function loadGrid() {
  const source = `${fs.readFileSync(GRID_PATH, 'utf8')}\nglobalThis.__grid = OSCAR_HEX_GRID;`;
  const context = { globalThis: {}, window: {} };
  vm.runInNewContext(source, context, { filename: GRID_PATH, timeout: 30000 });
  return context.globalThis.__grid;
}

function courseIdOf(current) {
  return String(current?.courseId || '').trim();
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

function main() {
  const grid = loadGrid();
  const errors = [];
  const warnings = [];
  if (grid.fluvialSchemaVersion !== 2) errors.push(`fluvialSchemaVersion=${grid.fluvialSchemaVersion ?? 'absent'}, version 2 attendue.`);

  const courses = grid.fluvialCourses || {};
  const occurrences = new Map();
  let vectorCount = 0;
  Object.entries(courses).forEach(([courseId, course]) => {
    if (!courseId.trim()) errors.push('Le registre contient un courseId vide.');
    if (!course || typeof course !== 'object') {
      errors.push(`${courseId}: entrée de registre invalide.`);
      return;
    }
    if (!String(course.watercourseId || '').trim()) errors.push(`${courseId}: watercourseId absent.`);
    if (!String(course.riverId || '').trim()) errors.push(`${courseId}: riverId absent.`);
  });
  Object.entries(grid.cells || {}).forEach(([cellKey, cell]) => {
    if (cell.fluvialOutlets || cell.fluvialRelations) errors.push(`${cellKey}: ancienne topologie cellulaire présente.`);
    const seen = new Set();
    (cell.fluvialCurrents || []).forEach(current => {
      vectorCount++;
      const courseId = courseIdOf(current);
      if (!courseId) errors.push(`${cellKey}: courant sans courseId.`);
      if (seen.has(courseId)) errors.push(`${cellKey}: courseId dupliqué ${courseId}.`);
      seen.add(courseId);
      if (!occurrences.has(courseId)) occurrences.set(courseId, []);
      occurrences.get(courseId).push(cellKey);
      if (!courses[courseId]) errors.push(`${cellKey}: cours non enregistré ${courseId}.`);
      else if (courses[courseId].riverId !== current.riverId) {
        warnings.push(`${cellKey}: nom ${current.riverId} différent du registre ${courses[courseId].riverId}.`);
      }
    });
  });

  occurrences.forEach((cellKeys, courseId) => {
    const remaining = new Set(cellKeys);
    let components = 0;
    while (remaining.size) {
      components++;
      const queue = [remaining.values().next().value];
      remaining.delete(queue[0]);
      while (queue.length) {
        const key = queue.shift();
        neighbourKeys(key, grid.cells[key]).forEach(nextKey => {
          if (!remaining.has(nextKey)) return;
          const present = (grid.cells[nextKey]?.fluvialCurrents || [])
            .some(current => courseIdOf(current) === courseId);
          if (!present) return;
          remaining.delete(nextKey);
          queue.push(nextKey);
        });
      }
    }
    if (components > 1) errors.push(`${courseId}: ${components} composantes discontinues.`);
  });

  const mouthsByCourse = new Map();
  const mouthSeen = new Set();
  (grid.fluvialMouths || []).forEach(mouth => {
    const signature = `${mouth.courseId}\u0000${mouth.cellKey}`;
    if (mouthSeen.has(signature)) errors.push(`Embouchure dupliquée : ${mouth.courseId} en ${mouth.cellKey}.`);
    mouthSeen.add(signature);
    if (!courses[mouth.courseId]) errors.push(`Embouchure d’un cours non enregistré : ${mouth.courseId}.`);
    const cell = grid.cells[mouth.cellKey];
    const present = (cell?.fluvialCurrents || []).some(current => courseIdOf(current) === mouth.courseId);
    if (!present) errors.push(`Embouchure ${mouth.courseId} absente de ${mouth.cellKey}.`);
    const natures = Array.isArray(cell?.naturesNav) ? cell.naturesNav : [cell?.natureNav];
    if (present && !natures.includes('cotiere')) warnings.push(`Embouchure ${mouth.courseId} hors nature côtière en ${mouth.cellKey}.`);
    if (!mouthsByCourse.has(mouth.courseId)) mouthsByCourse.set(mouth.courseId, []);
    mouthsByCourse.get(mouth.courseId).push(mouth.cellKey);
  });

  const junctionsByCourse = new Map();
  const connectionSeen = new Set();
  const endpointPairSeen = new Map();
  (grid.fluvialConnections || []).forEach(connection => {
    const signature = JSON.stringify(connection);
    if (connectionSeen.has(signature)) errors.push(`Connexion dupliquée : ${signature}.`);
    connectionSeen.add(signature);
    const endpointPair = [
      `${connection.fromCourseId}\u0000${connection.fromCellKey}`,
      `${connection.toCourseId}\u0000${connection.toCellKey}`,
    ].sort().join('\u0001');
    if (endpointPairSeen.has(endpointPair)) {
      errors.push(`Plusieurs connexions décrivent la même paire d’extrémités : ${endpointPairSeen.get(endpointPair)} / ${signature}.`);
    } else {
      endpointPairSeen.set(endpointPair, signature);
    }
    if (!['junction', 'fork'].includes(connection.type)) errors.push(`Type de connexion inconnu ${connection.type}.`);
    if (!courses[connection.fromCourseId]) errors.push(`Source non enregistrée : ${connection.fromCourseId}.`);
    if (!courses[connection.toCourseId]) errors.push(`Cible non enregistrée : ${connection.toCourseId}.`);
    if (connection.fromCourseId === connection.toCourseId) {
      errors.push(`Auto-connexion interdite pour ${connection.fromCourseId}.`);
    }
    const fromCell = grid.cells[connection.fromCellKey];
    const toCell = grid.cells[connection.toCellKey];
    const fromPresent = (fromCell?.fluvialCurrents || [])
      .some(current => courseIdOf(current) === connection.fromCourseId);
    const toPresent = (toCell?.fluvialCurrents || [])
      .some(current => courseIdOf(current) === connection.toCourseId);
    if (!fromPresent) errors.push(`Source ${connection.fromCourseId} absente de ${connection.fromCellKey}.`);
    if (!toPresent) errors.push(`Cible ${connection.toCourseId} absente de ${connection.toCellKey}.`);
    if (connection.fromCellKey !== connection.toCellKey
      && !neighbourKeys(connection.fromCellKey, fromCell).includes(connection.toCellKey)) {
      errors.push(`Connexion non adjacente ${connection.fromCellKey} → ${connection.toCellKey}.`);
    }
    if (connection.type === 'junction') {
      if (!junctionsByCourse.has(connection.fromCourseId)) junctionsByCourse.set(connection.fromCourseId, []);
      junctionsByCourse.get(connection.fromCourseId).push(connection);
    }
  });

  const junctionTarget = new Map();
  (grid.fluvialConnections || [])
    .filter(connection => connection.type === 'junction')
    .forEach(connection => {
      if (!junctionTarget.has(connection.fromCourseId)) {
        junctionTarget.set(connection.fromCourseId, connection.toCourseId);
      }
    });
  const cycleSignatures = new Set();
  junctionTarget.forEach((target, source) => {
    const path = [source];
    const positions = new Map([[source, 0]]);
    let cursor = target;
    while (junctionTarget.has(cursor)) {
      if (positions.has(cursor)) {
        const cycle = path.slice(positions.get(cursor));
        const canonical = [...cycle].sort().join('\u0000');
        if (!cycleSignatures.has(canonical)) {
          cycleSignatures.add(canonical);
          errors.push(`Cycle de jonctions terminales : ${cycle.join(' → ')} → ${cursor}.`);
        }
        break;
      }
      positions.set(cursor, path.length);
      path.push(cursor);
      cursor = junctionTarget.get(cursor);
    }
  });

  Object.entries(courses).forEach(([courseId, course]) => {
    if (!occurrences.has(courseId)) {
      warnings.push(`${courseId}: cours enregistré mais absent des cellules.`);
      return;
    }
    const policy = course.terminalPolicy || {};
    const mouthCount = (mouthsByCourse.get(courseId) || []).length;
    const junctionCount = (junctionsByCourse.get(courseId) || []).length;
    if (policy.type === 'sea') {
      if (!['single', 'multiple'].includes(policy.mouthMode)) {
        errors.push(`${courseId}: mode d’embouchure absent ou inconnu.`);
      } else if (policy.mouthMode === 'multiple') {
        if (mouthCount === 1) {
          errors.push(`Une seule embouchure définie mais embouchure multiple déclarée pour « ${course.riverId} » (${courseId}).`);
        } else if (mouthCount === 0) {
          errors.push(`${courseId}: mode multiple sans embouchure.`);
        }
      } else if (mouthCount !== 1) {
        errors.push(`${courseId}: mode simple avec ${mouthCount} embouchure(s).`);
      }
      if (junctionCount) errors.push(`${courseId}: sortie maritime et jonction terminale.`);
    } else if (policy.type === 'junction') {
      if (junctionCount !== 1) errors.push(`${courseId}: ${junctionCount} jonction(s) terminale(s).`);
      if (mouthCount) errors.push(`${courseId}: jonction terminale et embouchure maritime.`);
    } else if (policy.type === 'unresolved') {
      if (mouthCount || junctionCount) errors.push(`${courseId}: terminaison non localisée avec une sortie déclarée.`);
      if (!String(policy.reason || '').trim()) errors.push(`${courseId}: justification de la terminaison non localisée absente.`);
    } else {
      errors.push(`${courseId}: politique terminale inconnue.`);
    }
  });

  const namesByWatercourse = new Map();
  Object.values(courses).forEach(course => {
    const id = course.watercourseId;
    if (!namesByWatercourse.has(id)) namesByWatercourse.set(id, new Set());
    namesByWatercourse.get(id).add(course.riverId);
  });
  namesByWatercourse.forEach((names, watercourseId) => {
    if (names.size > 1) warnings.push(`${watercourseId}: noms divergents ${[...names].join(' / ')}.`);
  });

  const report = {
    valid: errors.length === 0,
    schemaVersion: grid.fluvialSchemaVersion,
    courses: Object.keys(courses).length,
    watercourses: namesByWatercourse.size,
    vectors: vectorCount,
    mouths: (grid.fluvialMouths || []).length,
    connections: (grid.fluvialConnections || []).length,
    junctions: (grid.fluvialConnections || []).filter(item => item.type === 'junction').length,
    forks: (grid.fluvialConnections || []).filter(item => item.type === 'fork').length,
    errors,
    warnings,
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
}

main();
