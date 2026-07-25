#!/usr/bin/env node
'use strict';

/*
 * Migre les identifiants fluviaux de la grille OSCAR à partir de
 * fluvial-database-finale.json.
 *
 * - riverId devient le nomCanonique visible dans Zone Editor ;
 * - courseId conserve l'identité stable et unique de chaque bras ;
 * - les références topologiques restent des références de bras et sont donc
 *   remplacées par les courseId correspondants ;
 * - aucun vecteur, domaine ou autre attribut cellulaire n'est recalculé.
 *
 * Par défaut, le script effectue uniquement un audit. Utiliser --write pour
 * remplacer js/oscar-hex-grid.js après validation et écrire le rapport.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const DATABASE_PATH = path.join(__dirname, 'fluvial-database-finale.json');
const GRID_PATH = path.join(ROOT, 'js', 'oscar-hex-grid.js');
const REPORT_PATH = path.join(__dirname, 'fluvial-canonical-names-report.json');
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

function buildMappings(database) {
  if (!Array.isArray(database.watercourses)) throw new Error('watercourses absent de la base finale.');
  const byLegacyRiverId = new Map();
  const byCourseId = new Map();
  const canonicalNames = new Set();

  database.watercourses.forEach(watercourse => {
    const canonicalName = String(watercourse.nomCanonique || '').trim();
    if (!canonicalName) throw new Error(`nomCanonique manquant pour ${watercourse.id || 'cours inconnu'}.`);
    canonicalNames.add(canonicalName);
    (watercourse.branches || []).forEach(branch => {
      const legacyRiverId = String(branch.riverId || '').trim();
      const courseId = String(branch.courseId || '').trim();
      if (!legacyRiverId || !courseId) {
        throw new Error(`Branche incomplète pour ${watercourse.id || canonicalName}.`);
      }
      const entry = {
        watercourseId: watercourse.id,
        canonicalName,
        legacyRiverId,
        courseId,
        branch: branch.branch || null,
        cellKeys: branch.cellKeys || [],
      };
      if (byLegacyRiverId.has(legacyRiverId)) throw new Error(`riverId dupliqué dans la base : ${legacyRiverId}.`);
      if (byCourseId.has(courseId)) throw new Error(`courseId dupliqué dans la base : ${courseId}.`);
      byLegacyRiverId.set(legacyRiverId, entry);
      byCourseId.set(courseId, entry);
    });
  });

  return { byLegacyRiverId, byCourseId, canonicalNames };
}

function currentMapping(current, mappings) {
  const courseId = String(current?.courseId || '').trim();
  if (courseId && mappings.byCourseId.has(courseId)) return mappings.byCourseId.get(courseId);
  const riverId = String(current?.riverId || '').trim();
  return mappings.byLegacyRiverId.get(riverId) || null;
}

function mapTopologyReference(value, mappings) {
  const reference = String(value || '').trim();
  if (!reference) return reference;
  if (mappings.byCourseId.has(reference)) return reference;
  const mapped = mappings.byLegacyRiverId.get(reference);
  if (!mapped) throw new Error(`Référence topologique absente de la base finale : ${reference}.`);
  return mapped.courseId;
}

function migrateCell(cell, mappings, stats) {
  const next = JSON.parse(JSON.stringify(cell));
  if (Array.isArray(next.fluvialCurrents)) {
    next.fluvialCurrents = next.fluvialCurrents.map(current => {
      const mapped = currentMapping(current, mappings);
      if (!mapped) throw new Error(`Courant absent de la base finale : ${current.riverId || current.courseId || '?'}.`);
      stats.legacyRiverIds.add(mapped.legacyRiverId);
      stats.courseIds.add(mapped.courseId);
      stats.canonicalNames.add(mapped.canonicalName);
      if (current.riverId !== mapped.canonicalName || current.courseId !== mapped.courseId) stats.renamedCurrents++;
      return { ...current, riverId: mapped.canonicalName, courseId: mapped.courseId };
    });
  }
  if (Array.isArray(next.fluvialOutlets)) {
    next.fluvialOutlets = next.fluvialOutlets.map(outlet => ({
      ...outlet,
      riverId: mapTopologyReference(outlet.riverId, mappings),
      ...(outlet.targetRiverId
        ? { targetRiverId: mapTopologyReference(outlet.targetRiverId, mappings) }
        : {}),
    }));
  }
  if (Array.isArray(next.fluvialRelations)) {
    next.fluvialRelations = next.fluvialRelations.map(relation => ({
      ...relation,
      ...(relation.fromRiverId
        ? { fromRiverId: mapTopologyReference(relation.fromRiverId, mappings) }
        : {}),
      ...(relation.toRiverId
        ? { toRiverId: mapTopologyReference(relation.toRiverId, mappings) }
        : {}),
      ...(Array.isArray(relation.riverIds)
        ? { riverIds: relation.riverIds.map(value => mapTopologyReference(value, mappings)) }
        : {}),
    }));
  }
  return next;
}

function validateMigratedGrid(before, after, mappings) {
  const errors = [];
  let currentCount = 0;
  let outletCount = 0;
  let relationCount = 0;

  Object.entries(after.cells).forEach(([key, cell]) => {
    const beforeCell = before.cells[key];
    const currents = Array.isArray(cell.fluvialCurrents) ? cell.fluvialCurrents : [];
    const courseIds = currents.map(current => String(current.courseId || ''));
    const courseSet = new Set(courseIds);
    currentCount += currents.length;
    if (courseSet.size !== courseIds.length) errors.push(`${key}: courseId dupliqué dans la cellule.`);

    currents.forEach(current => {
      const mapped = mappings.byCourseId.get(current.courseId);
      if (!mapped) errors.push(`${key}: courseId inconnu ${current.courseId}.`);
      else if (current.riverId !== mapped.canonicalName) {
        errors.push(`${key}: nom ${current.riverId} différent de ${mapped.canonicalName}.`);
      }
    });

    const beforeComparable = JSON.parse(JSON.stringify(beforeCell || {}));
    const afterComparable = JSON.parse(JSON.stringify(cell));
    [beforeComparable, afterComparable].forEach(comparable => {
      delete comparable.fluvialCurrents;
      delete comparable.fluvialOutlets;
      delete comparable.fluvialRelations;
    });
    if (JSON.stringify(beforeComparable) !== JSON.stringify(afterComparable)) {
      errors.push(`${key}: attribut non fluvial modifié.`);
    }

    const vectorBefore = (beforeCell?.fluvialCurrents || []).map(current => {
      const copy = { ...current };
      delete copy.riverId;
      delete copy.courseId;
      return copy;
    });
    const vectorAfter = currents.map(current => {
      const copy = { ...current };
      delete copy.riverId;
      delete copy.courseId;
      return copy;
    });
    if (JSON.stringify(vectorBefore) !== JSON.stringify(vectorAfter)) errors.push(`${key}: vecteur fluvial modifié.`);

    (cell.fluvialOutlets || []).forEach(outlet => {
      outletCount++;
      if (!courseSet.has(outlet.riverId)) errors.push(`${key}: débouché source absent ${outlet.riverId}.`);
      if (outlet.type === 'junction' && !courseSet.has(outlet.targetRiverId)) {
        errors.push(`${key}: débouché cible absent ${outlet.targetRiverId}.`);
      }
    });
    (cell.fluvialRelations || []).forEach(relation => {
      relationCount++;
      const references = [relation.fromRiverId, relation.toRiverId, ...(relation.riverIds || [])].filter(Boolean);
      references.forEach(reference => {
        if (!courseSet.has(reference)) errors.push(`${key}: relation vers un tracé absent ${reference}.`);
      });
    });
  });

  if (after.fluvialSchemaVersion === 2) {
    Object.entries(after.fluvialCourses || {}).forEach(([courseId, course]) => {
      const mapped = mappings.byCourseId.get(courseId);
      if (!mapped) errors.push(`Registre : courseId inconnu ${courseId}.`);
      else if (course.riverId !== mapped.canonicalName) {
        errors.push(`Registre : nom ${course.riverId} différent de ${mapped.canonicalName} pour ${courseId}.`);
      }
    });
    const present = (courseId, cellKey) => (after.cells[cellKey]?.fluvialCurrents || [])
      .some(current => current.courseId === courseId);
    (after.fluvialMouths || []).forEach(mouth => {
      if (!present(mouth.courseId, mouth.cellKey)) {
        errors.push(`Embouchure globale : ${mouth.courseId} absent de ${mouth.cellKey}.`);
      }
    });
    (after.fluvialConnections || []).forEach(connection => {
      if (!present(connection.fromCourseId, connection.fromCellKey)) {
        errors.push(`Connexion globale : ${connection.fromCourseId} absent de ${connection.fromCellKey}.`);
      }
      if (!present(connection.toCourseId, connection.toCellKey)) {
        errors.push(`Connexion globale : ${connection.toCourseId} absent de ${connection.toCellKey}.`);
      }
    });
  }

  return { errors, currentCount, outletCount, relationCount };
}

function main() {
  const database = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
  const grid = loadGrid(GRID_PATH);
  const mappings = buildMappings(database);
  const stats = {
    renamedCurrents: 0,
    legacyRiverIds: new Set(),
    courseIds: new Set(),
    canonicalNames: new Set(),
  };
  const nextCells = Object.fromEntries(
    Object.entries(grid.cells).map(([key, cell]) => [key, migrateCell(cell, mappings, stats)]),
  );
  const nextFluvialCourses = grid.fluvialSchemaVersion === 2
    ? Object.fromEntries(Object.entries(grid.fluvialCourses || {}).map(([courseId, course]) => {
      const mapped = mappings.byCourseId.get(courseId);
      if (!mapped) throw new Error(`Cours du registre absent de la base finale : ${courseId}.`);
      return [courseId, {
        ...course,
        watercourseId: mapped.watercourseId,
        riverId: mapped.canonicalName,
        branch: mapped.branch,
      }];
    }))
    : null;
  const nextGrid = {
    ...grid,
    ...(nextFluvialCourses ? { fluvialCourses: nextFluvialCourses } : {}),
    cells: nextCells,
    fluvialNaming: {
      source: 'tools/fluvial-research/fluvial-database-finale.json',
      schemaVersion: database.schemaVersion,
      model: 'riverId=nomCanonique; courseId=identifiant stable du bras; topologie référencée par courseId',
      updatedAt: new Date().toISOString(),
    },
  };
  const validation = validateMigratedGrid(grid, nextGrid, mappings);
  if (validation.errors.length) {
    throw new Error(`Migration invalide (${validation.errors.length} erreur(s)) :\n${validation.errors.slice(0, 30).join('\n')}`);
  }

  const missingGridBranches = [...mappings.byLegacyRiverId.keys()]
    .filter(legacyRiverId => !stats.legacyRiverIds.has(legacyRiverId));
  const report = {
    mode: write ? 'write' : 'dry-run',
    database: path.relative(ROOT, DATABASE_PATH).replace(/\\/g, '/'),
    grid: path.relative(ROOT, GRID_PATH).replace(/\\/g, '/'),
    databaseWatercourses: database.watercourses.length,
    databaseBranches: mappings.byLegacyRiverId.size,
    gridLegacyRiverIds: stats.legacyRiverIds.size,
    gridCourseIds: stats.courseIds.size,
    gridCanonicalNames: stats.canonicalNames.size,
    renamedCurrents: stats.renamedCurrents,
    currentCount: validation.currentCount,
    mouthCount: nextGrid.fluvialSchemaVersion === 2
      ? (nextGrid.fluvialMouths || []).length
      : validation.outletCount,
    connectionCount: nextGrid.fluvialSchemaVersion === 2
      ? (nextGrid.fluvialConnections || []).length
      : validation.relationCount,
    junctionCount: nextGrid.fluvialSchemaVersion === 2
      ? (nextGrid.fluvialConnections || []).filter(connection => connection.type === 'junction').length
      : null,
    forkCount: nextGrid.fluvialSchemaVersion === 2
      ? (nextGrid.fluvialConnections || []).filter(connection => connection.type === 'fork').length
      : null,
    missingGridBranches,
    validationErrors: validation.errors,
  };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  if (write) fs.writeFileSync(GRID_PATH, serializeGrid(nextGrid), 'utf8');
  console.log(JSON.stringify(report, null, 2));
  if (!write) console.log('\nSimulation uniquement : relancer avec --write après contrôle du rapport.');
}

main();
