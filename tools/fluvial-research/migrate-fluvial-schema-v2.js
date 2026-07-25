#!/usr/bin/env node
'use strict';

/*
 * Migre la topologie fluviale cellulaire vers le schéma global v2 :
 * - fluvialCourses     : registre et politique terminale par courseId ;
 * - fluvialMouths      : cellules d'embouchure maritime ;
 * - fluvialConnections : fourches et jonctions dirigées, avec leurs cellules ;
 * - les relations `separate` disparaissent : l'absence de connexion signifie
 *   désormais que deux tracés ne communiquent pas.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const GRID_PATH = path.join(ROOT, 'js', 'oscar-hex-grid.js');
const DATABASE_PATH = path.join(__dirname, 'fluvial-database-finale.json');
const REPORT_PATH = path.join(__dirname, 'fluvial-schema-v2-report.json');
const write = process.argv.includes('--write');

function loadGrid(filePath) {
  const source = `${fs.readFileSync(filePath, 'utf8')}\nglobalThis.__grid = OSCAR_HEX_GRID;`;
  const context = { globalThis: {}, window: {} };
  vm.runInNewContext(source, context, { filename: filePath, timeout: 30000 });
  if (!context.globalThis.__grid?.cells) throw new Error('OSCAR_HEX_GRID.cells introuvable.');
  return context.globalThis.__grid;
}

function serializeGrid(grid) {
  return `// oscar-hex-grid.js — grille canonique OSCAR\nconst OSCAR_HEX_GRID = ${JSON.stringify(grid)};\nif (typeof window !== 'undefined') window.OSCAR_HEX_GRID = OSCAR_HEX_GRID;\n`;
}

function databaseCourses(database) {
  const result = new Map();
  database.watercourses.forEach(watercourse => {
    watercourse.branches.forEach(branch => {
      if (result.has(branch.courseId)) throw new Error(`courseId dupliqué : ${branch.courseId}.`);
      result.set(branch.courseId, {
        watercourseId: watercourse.id,
        riverId: watercourse.nomCanonique,
        branch: branch.branch || null,
      });
    });
  });
  return result;
}

function courseIdOf(current) {
  return String(current?.courseId || current?.riverId || '').trim();
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

function validate(grid) {
  const errors = [];
  const occurrences = new Map();
  Object.entries(grid.cells).forEach(([cellKey, cell]) => {
    (cell.fluvialCurrents || []).forEach(current => {
      const courseId = courseIdOf(current);
      if (!courseId) errors.push(`${cellKey}: courant sans courseId.`);
      if (!occurrences.has(courseId)) occurrences.set(courseId, []);
      occurrences.get(courseId).push(cellKey);
      const registered = grid.fluvialCourses?.[courseId];
      if (!registered) errors.push(`${cellKey}: courseId non enregistré ${courseId}.`);
      else if (registered.riverId !== current.riverId) {
        errors.push(`${cellKey}: nom divergent pour ${courseId}.`);
      }
    });
    if (cell.fluvialOutlets || cell.fluvialRelations) {
      errors.push(`${cellKey}: ancienne topologie cellulaire encore présente.`);
    }
  });

  const mouthsByCourse = new Map();
  (grid.fluvialMouths || []).forEach(mouth => {
    const cell = grid.cells[mouth.cellKey];
    const present = (cell?.fluvialCurrents || []).some(current => courseIdOf(current) === mouth.courseId);
    if (!present) errors.push(`Embouchure ${mouth.courseId} absente de ${mouth.cellKey}.`);
    if (!mouthsByCourse.has(mouth.courseId)) mouthsByCourse.set(mouth.courseId, []);
    mouthsByCourse.get(mouth.courseId).push(mouth.cellKey);
  });

  const junctionsByCourse = new Map();
  (grid.fluvialConnections || []).forEach(connection => {
    if (!['junction', 'fork'].includes(connection.type)) errors.push(`Connexion de type inconnu ${connection.type}.`);
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

  Object.entries(grid.fluvialCourses || {}).forEach(([courseId, course]) => {
    if (!occurrences.has(courseId)) return;
    const policy = course.terminalPolicy || {};
    const mouths = mouthsByCourse.get(courseId) || [];
    const junctions = junctionsByCourse.get(courseId) || [];
    if (policy.type === 'sea') {
      if (policy.mouthMode === 'multiple' ? mouths.length < 2 : mouths.length !== 1) {
        errors.push(`${courseId}: politique maritime incompatible avec ${mouths.length} embouchure(s).`);
      }
      if (junctions.length) errors.push(`${courseId}: embouchure maritime et jonction terminale simultanées.`);
    } else if (policy.type === 'junction') {
      if (junctions.length !== 1) errors.push(`${courseId}: ${junctions.length} jonction(s) terminale(s).`);
      if (mouths.length) errors.push(`${courseId}: jonction terminale et embouchure maritime simultanées.`);
    } else if (policy.type === 'unresolved') {
      if (mouths.length || junctions.length) errors.push(`${courseId}: terminaison non localisée mais sortie déclarée.`);
    } else {
      errors.push(`${courseId}: politique terminale absente ou inconnue.`);
    }
  });
  return errors;
}

function main() {
  const grid = loadGrid(GRID_PATH);
  const database = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
  const databaseByCourseId = databaseCourses(database);
  if (grid.fluvialSchemaVersion === 2) throw new Error('La grille utilise déjà le schéma fluvial v2.');

  const courseOccurrences = new Map();
  Object.entries(grid.cells).forEach(([cellKey, cell]) => {
    (cell.fluvialCurrents || []).forEach(current => {
      const courseId = courseIdOf(current);
      if (!courseOccurrences.has(courseId)) courseOccurrences.set(courseId, []);
      courseOccurrences.get(courseId).push({ cellKey, current });
    });
  });

  const mouths = [];
  const connections = [];
  const terminalEvents = new Map();
  let discardedSeparateRelations = 0;
  const addTerminalEvent = (courseId, event) => {
    if (!terminalEvents.has(courseId)) terminalEvents.set(courseId, []);
    terminalEvents.get(courseId).push(event);
  };

  Object.entries(grid.cells).forEach(([cellKey, cell]) => {
    (cell.fluvialOutlets || []).forEach(outlet => {
      if (outlet.type === 'sea') {
        mouths.push({ courseId: outlet.riverId, cellKey });
        addTerminalEvent(outlet.riverId, { type: 'sea', cellKey });
      } else if (outlet.type === 'junction') {
        connections.push({
          type: 'junction',
          fromCourseId: outlet.riverId,
          fromCellKey: cellKey,
          toCourseId: outlet.targetRiverId,
          toCellKey: cellKey,
        });
        addTerminalEvent(outlet.riverId, { type: 'junction', cellKey });
      } else if (outlet.type === 'map-edge') {
        addTerminalEvent(outlet.riverId, { type: 'unresolved', cellKey });
      } else {
        throw new Error(`${cellKey}: type de débouché inconnu ${outlet.type}.`);
      }
    });
    (cell.fluvialRelations || []).forEach(relation => {
      if (relation.type === 'separate') {
        discardedSeparateRelations++;
        return;
      }
      if (relation.type !== 'fork') throw new Error(`${cellKey}: relation inconnue ${relation.type}.`);
      connections.push({
        type: 'fork',
        fromCourseId: relation.fromRiverId,
        fromCellKey: cellKey,
        toCourseId: relation.toRiverId,
        toCellKey: cellKey,
      });
    });
  });

  const fluvialCourses = {};
  courseOccurrences.forEach((occurrences, courseId) => {
    const databaseCourse = databaseByCourseId.get(courseId);
    if (!databaseCourse) throw new Error(`courseId absent de la base finale : ${courseId}.`);
    const events = terminalEvents.get(courseId) || [];
    const types = new Set(events.map(event => event.type));
    if (types.size !== 1) throw new Error(`${courseId}: terminaisons contradictoires ${[...types].join(', ')}.`);
    const terminalType = [...types][0];
    if (!terminalType) throw new Error(`${courseId}: aucune terminaison déclarée.`);
    const terminalPolicy = terminalType === 'sea'
      ? { type: 'sea', mouthMode: events.length > 1 ? 'multiple' : 'single' }
      : terminalType === 'junction'
        ? { type: 'junction' }
        : {
          type: 'unresolved',
          reason: 'Embouchure non localisable sur l’emprise de la carte.',
        };
    fluvialCourses[courseId] = { ...databaseCourse, terminalPolicy };
  });

  const nextCells = {};
  Object.entries(grid.cells).forEach(([key, cell]) => {
    const next = JSON.parse(JSON.stringify(cell));
    delete next.fluvialOutlets;
    delete next.fluvialRelations;
    nextCells[key] = next;
  });
  const nextGrid = {
    ...grid,
    fluvialSchemaVersion: 2,
    fluvialCourses,
    fluvialMouths: mouths,
    fluvialConnections: connections,
    cells: nextCells,
    fluvialTopologyMigration: {
      source: 'cellular fluvialOutlets/fluvialRelations',
      updatedAt: new Date().toISOString(),
      discardedSeparateRelations,
    },
  };

  const validationErrors = validate(nextGrid);
  if (validationErrors.length) {
    throw new Error(`Migration invalide (${validationErrors.length}) :\n${validationErrors.slice(0, 40).join('\n')}`);
  }
  const report = {
    mode: write ? 'write' : 'dry-run',
    courses: Object.keys(fluvialCourses).length,
    mouths: mouths.length,
    multipleMouthCourses: Object.values(fluvialCourses)
      .filter(course => course.terminalPolicy.mouthMode === 'multiple').length,
    connections: connections.length,
    junctions: connections.filter(connection => connection.type === 'junction').length,
    forks: connections.filter(connection => connection.type === 'fork').length,
    unresolvedCourses: Object.entries(fluvialCourses)
      .filter(([, course]) => course.terminalPolicy.type === 'unresolved')
      .map(([courseId]) => courseId),
    discardedSeparateRelations,
    validationErrors,
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  if (write) fs.writeFileSync(GRID_PATH, serializeGrid(nextGrid), 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (!write) console.log('\nSimulation uniquement : relancer avec --write après contrôle du rapport.');
}

main();
