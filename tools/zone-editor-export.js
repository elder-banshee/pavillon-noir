    'use strict';

    // Export des fichiers de données générés depuis Zone Editor.

    // ═══════════════════════════════════════════════════════════
    // EXPORT JS
    // ═══════════════════════════════════════════════════════════
    function updateExport() {
      const box = document.getElementById('export-box');
      const hint = document.getElementById('export-hint');

      if (!ctx.isZoneEditTab) {
        box.textContent = '';
        hint.style.display = 'none';
        return;
      }

      if (!selectedZoneId) {
        box.innerHTML = '';
        hint.style.display = 'block';
        hint.innerHTML = 'Sélectionnez une zone pour afficher les coordonnées du contour actif.';
        return;
      }

      hint.style.display = 'none';
      renderExportBlocks(selectedZoneId);
    }

    // Génère un <span.contour-block> par contour dans #export-box
    // et scrolle / surligne le contour actif.
    // Sérialisation partagée du format zones-data.js : utilisée par l'aperçu
    // cliquable (renderExportBlocks) et par l'export fichier (exportZonesData),
    // pour que les deux restent alignés octet pour octet.
    function formatZoneHeader(zoneId, contours) {
      return `  '${zoneId}': [  // ${contours.length} contour(s), ${contours.reduce((s, c) => s + c.length, 0)} pts\n`;
    }

    function formatContourBlock(contour, meta) {
      let block = '';
      if (meta) {
        block += `    {\n`;
        Object.entries(meta).forEach(([k, v]) => block += `      ${k}: ${JSON.stringify(v)},\n`);
        block += `      points: [\n`;
        for (let i = 0; i < contour.length; i += 6) {
          block += '        ' + contour.slice(i, i + 6).map(([x, y]) => `[${x}, ${y}]`).join(', ') + ',\n';
        }
        block += `      ],\n    },\n`;
      } else {
        block += `    [\n`;
        for (let i = 0; i < contour.length; i += 6) {
          block += '      ' + contour.slice(i, i + 6).map(([x, y]) => `[${x}, ${y}]`).join(', ') + ',\n';
        }
        block += `    ],\n`;
      }
      return block;
    }

    function renderExportBlocks(zoneId) {
      const box = document.getElementById('export-box');
      if (!box) return;
      const contours = zonesEdit[zoneId];

      if (isOceanBoundsId(zoneId)) {
        renderOceanBoundsExportBlocks(zoneId, contours, box);
        return;
      }

      // Ligne d'en-tête (non cliquable)
      let html = `<span class="contour-block" style="color:#6a8060;">${escapeHtml(formatZoneHeader(zoneId, contours))}</span>`;

      contours.forEach((contour, ci) => {
        const meta = zonesMeta[zoneId]?.[ci] || null;
        const block = formatContourBlock(contour, meta);
        const isActive = ci === selectedContourIdx;
        html += `<span class="contour-block${isActive ? ' active' : ''}" data-contour="${ci}">${escapeHtml(block)}</span>`;
      });

      html += `<span class="contour-block" style="color:#6a8060;">  ],</span>`;
      box.innerHTML = html;

      // Scroll vers le contour actif — différé pour que le DOM soit peint
      requestAnimationFrame(() => {
        const activeSpan = box.querySelector('.contour-block.active');
        if (activeSpan) activeSpan.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }

    // oceanBounds ne suit pas le format plat des territoires : le rôle
    // interne de chaque contour devient la structure { exterior, holes }
    // attendue dans zones-data.js. Ainsi, le bouton Copier donne directement
    // un bloc remplaçable, sans exposer { role, points }.
    function renderOceanBoundsExportBlocks(zoneId, contours, box) {
      const meta = zonesMeta[zoneId] || [];
      const exteriorIdx = meta.findIndex(item => item?.role === 'exterior');
      if (exteriorIdx < 0) {
        box.textContent = 'Contour extérieur introuvable : copie impossible.';
        return;
      }

      const formatRing = (contour, indent) => {
        let out = '';
        for (let i = 0; i < contour.length; i += 6) {
          out += indent + contour.slice(i, i + 6).map(([x, y]) => `[${x}, ${y}]`).join(', ') + ',\n';
        }
        return out;
      };
      const contourSpan = (idx, prefix, suffix, indent) => {
        const isActive = idx === selectedContourIdx;
        return `${escapeHtml(prefix)}<span class="contour-block${isActive ? ' active' : ''}" data-contour="${idx}">${escapeHtml(formatRing(contours[idx], indent))}</span>${escapeHtml(suffix)}`;
      };

      let html = `<span class="contour-block" style="color:#6a8060;">${escapeHtml(`  '${zoneId}': {\n    zoneSource: 'svg',\n    zone: {\n      exterior: [\n`)}</span>`;
      html += contourSpan(exteriorIdx, '', '      ],\n      holes: [\n', '        ');

      meta.forEach((item, idx) => {
        if (item?.role !== 'hole') return;
        html += contourSpan(idx, '        [\n', '        ],\n', '          ');
      });

      html += `<span class="contour-block" style="color:#6a8060;">${escapeHtml('      ],\n    },\n  },')}</span>`;
      box.innerHTML = html;

      requestAnimationFrame(() => {
        const activeSpan = box.querySelector('.contour-block.active');
        if (activeSpan) activeSpan.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }

    function escapeHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ═══════════════════════════════════════════════════════════
    // NAVIGATION ENTRE CONTOURS
    // ═══════════════════════════════════════════════════════════
    function goToContour(idx) {
      if (!selectedZoneId) return;
      const contours = zonesEdit[selectedZoneId];
      if (idx < 0 || idx >= contours.length) return;

      selectedContourIdx = idx;
      clearHandleSelection();
      clearHandles();
      refresh(R.SELECTED_ZONE | R.HANDLES | R.PANEL | R.EXPORT);
      if (currentTool === 'insert') renderSegmentMarkers();
    }

    // ═══════════════════════════════════════════════════════════
    // EXPORT FICHIER — zones-data.js complet (géométrie + métadonnées)
    // ═══════════════════════════════════════════════════════════
    function exportCurrentFile() {
      if (ctx.isTopoGeo || ctx.isTopoInfo) {
        exportZonesData();
      } else if (ctx.isTopoOceanBounds) {
        exportOceanBounds();
      } else if (ctx.isOcean) {
        exportOceanGrid();
      }
    }

    function serializableOceanCell(cell) {
      const out = {};
      Object.entries(cell || {}).forEach(([key, value]) => {
        if (key.startsWith('_')) return;
        out[key] = value;
      });
      return out;
    }

    function exportOceanGrid() {
      const grid = getOceanGrid();
      if (!grid?.cells) {
        alert('Grille OCEAN indisponible.');
        return;
      }
      const exportGrid = {};
      Object.entries(grid).forEach(([key, value]) => {
        if (key === 'cells') return;
        exportGrid[key] = value;
      });
      exportGrid.cells = {};
      Object.entries(grid.cells).forEach(([key, cell]) => {
        exportGrid.cells[key] = serializableOceanCell(cell);
      });
      if (exportGrid.topology !== 'hex') throw new Error('Grille OCEAN invalide : seule la topologie hex est exportable.');
      let out = '// ocean-hex-grid.js - genere par Zone Editor depuis la grille OCEAN hex courante\n\n';
      out += `const OCEAN_HEX_GRID = ${JSON.stringify(exportGrid)};\n`;
      out += "if (typeof window !== 'undefined') window.OCEAN_HEX_GRID = OCEAN_HEX_GRID;\n";
      downloadBlob('ocean-hex-grid.js', out);
    }

    function exportZonesData() {
      // Recalcule superficie depuis la géométrie courante
      const demo = zonesWorkingCopy.DEMO || {};
      const data = zonesEdit; // alias vers zonesWorkingCopy.DATA

      let out = '// zones-data.js — Contours territoriaux\n';
      out += '// Généré par Zone Editor — Pavillon Noir\n';
      out += '// ═══════════════════════════════════════════════════════════\n\n';
      out += 'const ZONES_DATA = {\n\n';

      for (const id in data) {
        // oceanBounds n'est pas un territoire : géométrie et export séparés
        // (voir exportOceanBounds), pas de sérialisation à plat ici.
        if (isOceanBoundsId(id)) continue;
        const contours = data[id];
        out += formatZoneHeader(id, contours);
        contours.forEach((contour, ci) => {
          out += formatContourBlock(contour, zonesMeta[id]?.[ci] || null);
        });
        out += `  ],\n\n`;
      }
      out += '};\n\n\n';

      // ZONES_DEMO — superficie recalculée, autres champs depuis zonesWorkingCopy.DEMO
      out += '// ═══════════════════════════════════════════════════════════\n';
      out += '// ZONES_DEMO — Démographie & superficie (circa 1716)\n';
      out += '// superficie     : px² (Shoelace par anneau)\n';
      out += '// score_densite  : log10(population/superficie + 1)\n';
      out += '// statut_autochtone : \'souverainete\' | \'resistance\' | \'domination\' | null\n';
      out += '// ═══════════════════════════════════════════════════════════\n\n';
      out += 'const ZONES_DEMO = {\n\n';

      for (const id in demo) {
        const d = demo[id];
        // Recalcul superficie depuis géométrie
        const superficie = data[id] ? Math.round(calcSuperficie(data[id])) : (d.superficie ?? 0);
        const pop = (d.colons || 0) + (d.esclaves || 0) + (d.indiens || 0);
        const scoreDensite = superficie > 0 ? Math.round(Math.log10(pop / superficie + 1) * 1e4) / 1e4 : 0;

        out += `  '${id}': {\n`;
        out += `    colons: ${d.colons ?? 0},\n`;
        out += `    esclaves: ${d.esclaves ?? 0},\n`;
        out += `    indiens: ${d.indiens ?? 0},\n`;
        out += `    indiens_asservis: ${d.indiens_asservis ?? 0},\n`;
        out += `    population: ${pop},\n`;
        out += `    superficie: ${superficie},\n`;
        out += `    score_densite: ${scoreDensite},\n`;
        if (d.statut_autochtone !== undefined) {
          out += `    statut_autochtone: ${d.statut_autochtone === null ? 'null' : JSON.stringify(d.statut_autochtone)},\n`;
        }
        out += `  },\n\n`;
      }
      out += '};\n\n\n';

      // ZONES_SHOAL — métadonnées hauts-fonds (géométrie déjà dans ZONES_DATA)
      out += '// ═══════════════════════════════════════════════════════════\n';
      out += '// ZONES_SHOAL — Métadonnées hauts-fonds (visibilité nav, risque…)\n';
      out += '// Géométrie : voir ZONES_DATA ci-dessus (même id).\n';
      out += '// ═══════════════════════════════════════════════════════════\n\n';
      out += 'const ZONES_SHOAL = {\n\n';

      const shoalMeta = zonesWorkingCopy.SHOAL_META || {};
      for (const id in shoalMeta) {
        const m = shoalMeta[id];
        out += `  '${id}': {\n`;
        Object.entries(m).forEach(([k, v]) => out += `    ${k}: ${JSON.stringify(v)},\n`);
        out += `  },\n\n`;
      }
      out += '};\n';

      downloadBlob('zones-data.js', out);
    }

    // ═══════════════════════════════════════════════════════════
    // EXPORT FICHIER — oceanBounds (masque navigable Atlantique/Pacifique)
    // ═══════════════════════════════════════════════════════════
    // Reconstruit explicitement {exterior, holes} à partir du tag role posé
    // dans zonesMeta — pas de la sérialisation à plat (formatContourBlock)
    // utilisée pour territoires/hauts-fonds, qui perdrait la distinction
    // extérieur/trou. Bouton distinct de l'export zones-data.js existant :
    // fichier séparé, à coller dans le bloc ZONES_OCEAN_BOUNDS de
    // js/zones-data.js (ce dernier n'est pas régénéré ici).
    function formatOceanBoundsRing(points) {
      let block = '';
      for (let i = 0; i < points.length; i += 6) {
        block += '    ' + points.slice(i, i + 6).map(([x, y]) => `[${x},${y}]`).join(', ') + ',\n';
      }
      return block;
    }

    // Fail fast : un contour sans rôle explicite, ou une entité sans
    // extérieur unique, indique un bug ailleurs dans le pipeline (drag/
    // insert/split) — pas de repli silencieux sur une convention d'index.
    function buildOceanBoundsZone(zoneId) {
      const contours = zonesEdit[zoneId];
      const meta = zonesMeta[zoneId] || [];
      let exterior = null;
      const holes = [];
      contours.forEach((contour, idx) => {
        const role = meta[idx]?.role;
        if (role === 'exterior') {
          if (exterior) throw new Error(`${zoneId} : plusieurs contours "exterior" (contour ${idx}) — un seul attendu.`);
          exterior = contour;
        } else if (role === 'hole') {
          holes.push(contour);
        } else {
          throw new Error(`${zoneId} : contour ${idx} sans rôle exterior/hole — export impossible.`);
        }
      });
      if (!exterior) throw new Error(`${zoneId} : aucun contour "exterior" — export impossible.`);
      return { exterior, holes };
    }

    function exportOceanBounds() {
      let out = '// ZONES_OCEAN_BOUNDS — emprise maritime globale (filet de sécurité calme)\n';
      out += '// Généré par Zone Editor — Pavillon Noir\n';
      out += '// ═══════════════════════════════════════════════════════════\n\n';
      out += 'const ZONES_OCEAN_BOUNDS = {\n';

      const oceanBoundsIds = zonesWorkingCopy.OCEAN_BOUNDS ? Object.keys(zonesWorkingCopy.OCEAN_BOUNDS) : [];
      for (const id of oceanBoundsIds) {
        let zone;
        try {
          zone = buildOceanBoundsZone(id);
        } catch (e) {
          alert(e.message);
          return;
        }
        out += `  '${id}': {\n`;
        out += `    zoneSource: 'svg',\n`;
        out += `    zone: {\n`;
        out += `      exterior: [\n`;
        out += formatOceanBoundsRing(zone.exterior);
        out += `      ],\n`;
        out += `      holes: [\n`;
        zone.holes.forEach(hole => {
          out += `      [\n`;
          out += formatOceanBoundsRing(hole);
          out += `      ],\n`;
        });
        out += `      ],\n`;
        out += `    },\n`;
        out += `  },\n\n`;
      }
      out += '};\n';
      downloadBlob('zones-ocean-bounds.js', out);
    }

    function calcSuperficie(contours) {
      // Shoelace sur le premier contour (contour principal) de chaque zone
      let total = 0;
      contours.forEach(contour => {
        let area = 0;
        const n = contour.length;
        for (let i = 0; i < n; i++) {
          const [x1, y1] = contour[i];
          const [x2, y2] = contour[(i + 1) % n];
          area += x1 * y2 - x2 * y1;
        }
        total += Math.abs(area) / 2;
      });
      return total;
    }

    function downloadBlob(filename, content) {
      const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
