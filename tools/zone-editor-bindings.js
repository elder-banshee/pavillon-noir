    'use strict';

    // Branchements UI et lancement de l'application.

    // ═══════════════════════════════════════════════════════════
    // BINDINGS UI
    // ═══════════════════════════════════════════════════════════
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => setTool(btn.dataset.tool));
    });

    document.getElementById('editor-switch-btn').addEventListener('click', () => {
      document.getElementById('editor-menu').classList.toggle('open');
    });
    document.querySelectorAll('#editor-menu [data-editor]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.editor));
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => setTab(btn.dataset.tab));
    });
    document.getElementById('btn-export-file').addEventListener('click', exportCurrentFile);
    document.getElementById('btn-undo').addEventListener('click', undoLastOperation);
    document.addEventListener('mouseup', onMapMouseUp);

    document.getElementById('btn-prev-contour').addEventListener('click', () => {
      goToContour(selectedContourIdx - 1);
    });
    document.getElementById('btn-next-contour').addEventListener('click', () => {
      goToContour(selectedContourIdx + 1);
    });
    document.getElementById('btn-del-contour').addEventListener('click', deleteContour);
    document.getElementById('btn-finish-draw').addEventListener('click', finishDraw);
    document.getElementById('btn-cancel-draw').addEventListener('click', () => cancelDraw(false));
    const semaphoreNavLevelSelect = document.getElementById('semaphore-nav-level');
    if (semaphoreNavLevelSelect) {
      semaphoreNavLevel = normalizeNavLevel(semaphoreNavLevel);
      semaphoreNavLevelSelect.value = String(semaphoreNavLevel);
      semaphoreNavLevelSelect.addEventListener('change', (e) => {
        semaphoreNavLevel = normalizeNavLevel(e.target.value);
        window.niveauNavigation = semaphoreNavLevel;
        window.invaliderCacheHautsFonds?.();
        window.dispatchEvent(new CustomEvent('navigation-level-change', { detail: { niveauNavigation: semaphoreNavLevel } }));
        e.target.value = String(semaphoreNavLevel);
        refresh(R.SHOAL_HOVER | R.SEA_PANEL);
      });
    }
    function extractOceanGridFromSource(text) {
      const marker = 'const OCEAN_HEX_GRID = ';
      const start = text.indexOf(marker);
      if (start < 0) throw new Error('Fichier invalide : "const OCEAN_HEX_GRID = " introuvable.');
      const braceStart = text.indexOf('{', start);
      if (braceStart < 0) throw new Error('Fichier invalide : objet OCEAN_HEX_GRID introuvable.');
      let depth = 0, i = braceStart, quote = null, escaped = false;
      for (; i < text.length; i++) {
        const char = text[i];
        if (quote) {
          if (escaped) escaped = false;
          else if (char === '\\') escaped = true;
          else if (char === quote) quote = null;
          continue;
        }
        if (char === '"' || char === "'" || char === '`') {
          quote = char;
          continue;
        }
        if (char === '{') depth++;
        else if (char === '}') { depth--; if (depth === 0) { i++; break; } }
      }
      if (depth !== 0) throw new Error('Fichier invalide : accolades non équilibrées.');
      const json = text.slice(braceStart, i);
      const grid = JSON.parse(json);
      if (!grid?.cells) throw new Error('Fichier invalide : champ "cells" absent.');
      return grid;
    }

    function describeOceanGridSource(grid, filename) {
      const n = Object.keys(grid.cells).length;
      const method = grid.speedCorrection?.method || grid.speedCorrection?.factor
        ? (grid.speedCorrection.method || `facteur ×${grid.speedCorrection.factor}`)
        : 'aucune correction';
      return `${filename} — v${grid.version ?? '?'}, ${n} cellules, ${method}, plafond dégradé ${oceanSpeedColorCap} nd`;
    }

    function confirmDiscardOceanSessionEdits(actionLabel) {
      const count = sessionEditedOceanCellKeys.size;
      if (!count) return true;
      return confirm(`${count} cellule(s) modifiée(s) dans cette instance ne seront plus signalées comme édition de session. Continuer : ${actionLabel} ?`);
    }

    const oceanGridLoadBtn = document.getElementById('ocean-grid-load-btn');
    const oceanGridLoadInput = document.getElementById('ocean-grid-load-input');
    const oceanGridResetBtn = document.getElementById('ocean-grid-reset-btn');
    const oceanGridLoadedLabel = document.getElementById('ocean-grid-loaded-label');
    if (oceanGridLoadBtn && oceanGridLoadInput) {
      oceanGridLoadBtn.addEventListener('click', () => oceanGridLoadInput.click());
      oceanGridLoadInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (!confirmDiscardOceanSessionEdits('charger une autre grille')) return;
        try {
          const text = await file.text();
          const grid = extractOceanGridFromSource(text);
          customOceanGrid = grid;
          customOceanGridLabel = file.name;
          sessionEditedOceanCellKeys.clear();
          recomputeOceanSpeedColorCap(grid);
          clearOceanGridLayer();
          populateOceanDomainSelect();
          if (oceanGridLoadedLabel) {
            oceanGridLoadedLabel.innerHTML = `<span>Source :</span> ${escapeHtmlText(describeOceanGridSource(grid, file.name))}`;
          }
          refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
        } catch (err) {
          alert('Échec du chargement de la grille : ' + err.message);
        }
      });
    }
    if (oceanGridResetBtn) {
      oceanGridResetBtn.addEventListener('click', () => {
        if (!confirmDiscardOceanSessionEdits('réinitialiser vers la grille du dépôt')) return;
        customOceanGrid = null;
        customOceanGridLabel = '';
        sessionEditedOceanCellKeys.clear();
        recomputeOceanSpeedColorCap(getOceanGrid());
        clearOceanGridLayer();
        populateOceanDomainSelect();
        if (oceanGridLoadedLabel) {
          oceanGridLoadedLabel.innerHTML = '<span>Source :</span> grille du dépôt (js/ocean-hex-grid.js)';
        }
        refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oceanGridVisibleInput = document.getElementById('ocean-grid-visible');
    if (oceanGridVisibleInput) {
      oceanGridVisibleInput.checked = oceanGridVisible;
      oceanGridVisibleInput.addEventListener('change', (e) => {
        oceanGridVisible = !!e.target.checked;
        refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oceanGridArrowsInput = document.getElementById('ocean-grid-arrows');
    if (oceanGridArrowsInput) {
      oceanGridArrowsInput.checked = oceanGridArrowsVisible;
      oceanGridArrowsInput.addEventListener('change', (e) => {
        oceanGridArrowsVisible = !!e.target.checked;
        refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oceanSessionEditsVisibleInput = document.getElementById('ocean-session-edits-visible');
    if (oceanSessionEditsVisibleInput) {
      oceanSessionEditsVisibleInput.checked = oceanSessionEditsVisible;
      oceanSessionEditsVisibleInput.addEventListener('change', (e) => {
        oceanSessionEditsVisible = !!e.target.checked;
        refresh(R.OCEAN_SELECTION | R.SEA_PANEL);
      });
    }
    const oceanGridDomainSelect = document.getElementById('ocean-grid-domain');
    if (oceanGridDomainSelect) {
      oceanGridDomainSelect.addEventListener('change', (e) => {
        oceanGridDomainFilter = e.target.value || '';
        refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
      });
    }
    document.querySelectorAll('[data-ocean-filter-group]').forEach(input => {
      input.addEventListener('change', (e) => {
        const group = e.target.dataset.oceanFilterGroup;
        const values = oceanGridFilters[group];
        if (!values) return;
        if (e.target.checked) values.add(e.target.value);
        else values.delete(e.target.value);
        refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
      });
    });
    document.getElementById('ocean-filter-reset')?.addEventListener('click', () => {
      document.querySelectorAll('[data-ocean-filter-group]').forEach(input => {
        input.checked = true;
        oceanGridFilters[input.dataset.oceanFilterGroup]?.add(input.value);
      });
      refresh(R.OCEAN_HEX_GRID | R.SEA_PANEL);
    });
    document.getElementById('ocean-fluvial-inspector-watercourse')?.addEventListener('change', (e) => {
      oceanInspectorWatercourseId = e.target.value || '';
      refresh(R.OCEAN_INSPECTOR | R.SEA_PANEL);
    });
    document.getElementById('ocean-fluvial-inspector-junction')?.addEventListener('change', (e) => {
      if (e.target.checked) oceanInspectorConnectionTypes.add('junction');
      else oceanInspectorConnectionTypes.delete('junction');
      refresh(R.OCEAN_INSPECTOR | R.SEA_PANEL);
    });
    document.getElementById('ocean-fluvial-inspector-fork')?.addEventListener('change', (e) => {
      if (e.target.checked) oceanInspectorConnectionTypes.add('fork');
      else oceanInspectorConnectionTypes.delete('fork');
      refresh(R.OCEAN_INSPECTOR | R.SEA_PANEL);
    });
    document.getElementById('ocean-fluvial-inspector-overlap')?.addEventListener('change', (e) => {
      oceanInspectorOverlapOnly = !!e.target.checked;
      refresh(R.OCEAN_INSPECTOR | R.SEA_PANEL);
    });
    document.getElementById('ocean-fluvial-inspector-fit')?.addEventListener('click', fitOceanFluvialInspectorHighlights);
    document.getElementById('ocean-fluvial-inspector-clear')?.addEventListener('click', clearOceanFluvialInspector);
    const seaOceanPanel = document.getElementById('sea-ocean');
    if (seaOceanPanel) {
      seaOceanPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ocean-action]');
        if (!btn) return;
        handleOceanCellAction(btn.dataset.oceanAction);
      });
      seaOceanPanel.addEventListener('change', (e) => {
        if (e.target?.matches?.('[data-fluvial-relation]')) {
          const row = e.target.closest('.ocean-fluvial-relation');
          const multicell = row?.querySelector('[data-fluvial-multicell]');
          if (multicell) {
            multicell.disabled = !e.target.value;
            if (!e.target.value) multicell.checked = false;
          }
        } else if (e.target?.id === 'ocean-has-coastal') {
          const fields = document.getElementById('ocean-coastal-fields');
          if (fields) fields.style.display = e.target.checked ? 'contents' : 'none';
        } else if (e.target?.id === 'ocean-main-calm') {
          const speed = document.getElementById('ocean-main-speed');
          const direction = document.getElementById('ocean-main-dir');
          if (speed) speed.disabled = e.target.checked;
          if (direction) direction.disabled = e.target.checked;
        } else if (e.target?.matches?.('[data-fluvial-field="enabled"]')) {
          const row = e.target.closest('.ocean-fluvial-current');
          row?.querySelectorAll('[data-fluvial-field]:not([data-fluvial-field="enabled"])').forEach(input => {
            input.disabled = !e.target.checked;
          });
          updateFluvialCourseIdRenameState(row);
          updateFluvialTerminalFields(row);
        } else if (e.target?.matches?.('[data-fluvial-field="attachmentCourseId"]')) {
          updateFluvialAdvancedCourseSelection(e.target.closest('.ocean-fluvial-current'));
        } else if (e.target?.matches?.('[data-fluvial-field="courseId"]')) {
          const row = e.target.closest('.ocean-fluvial-current');
          const attachment = row?.querySelector('[data-fluvial-field="attachmentCourseId"]');
          const renaming = row?.querySelector('[data-fluvial-field="renameCourseId"]')?.checked === true;
          if (attachment && !renaming) {
            const courseId = String(e.target.value || '').trim();
            attachment.value = oceanFluvialCourses()[courseId] ? courseId : '';
            if (attachment.value) updateFluvialAdvancedCourseSelection(row);
          }
        } else if (e.target?.matches?.('[data-fluvial-field="renameCourseId"]')) {
          const row = e.target.closest('.ocean-fluvial-current');
          updateFluvialCourseIdRenameState(row);
          if (e.target.checked) row?.querySelector('[data-fluvial-field="courseId"]')?.focus();
        } else if (e.target?.matches?.('[data-fluvial-field="terminalType"]')) {
          updateFluvialTerminalFields(e.target.closest('.ocean-fluvial-current'));
        } else if (e.target?.matches?.('[data-fluvial-field="mouthMode"]')) {
          const row = e.target.closest('.ocean-fluvial-current');
          const multiple = row?.querySelector('[data-fluvial-field="multipleMouth"]');
          if (multiple) multiple.checked = e.target.value === 'multiple';
        } else if (e.target?.matches?.('[data-fluvial-field="multipleMouth"]')) {
          const row = e.target.closest('.ocean-fluvial-current');
          const mode = row?.querySelector('[data-fluvial-field="mouthMode"]');
          if (mode) mode.value = e.target.checked ? 'multiple' : 'single';
        }
      });
    }
    // Réglages inline de l'outil Accentuer/Estomper et de l'égaliseur :
    // vivent dans #tool-group
    // (barre supérieure), reconstruits à chaque refresh(R.TOOLS) — délégation
    // sur le conteneur stable plutôt que sur les contrôles, mêmes principes
    // que la délégation #sea-ocean ci-dessus. Mettent à jour l'état persistant
    // directement (pas de lecture DOM différée à l'application).
    const toolGroupPanel = document.getElementById('tool-group');
    if (toolGroupPanel) {
      toolGroupPanel.addEventListener('change', (e) => {
        if (e.target?.id === 'ocean-adjust-attenuate') oceanAdjustAttenuate = e.target.checked;
        else if (e.target?.id === 'ocean-adjust-halo') oceanAdjustHalo = e.target.checked;
      });
      toolGroupPanel.addEventListener('input', (e) => {
        if (e.target?.id === 'ocean-adjust-factor') {
          oceanAdjustFactorIdx = Number(e.target.value);
          oceanAdjustCustomFactor = null; // le curseur reprend la main
          const customInput = document.getElementById('ocean-adjust-custom-factor');
          if (customInput) customInput.value = '';
          const label = document.getElementById('ocean-adjust-factor-label');
          const factor = OCEAN_ADJUST_FACTORS[oceanAdjustFactorIdx] ?? OCEAN_ADJUST_FACTORS[1];
          if (label) label.textContent = `${Math.round(factor * 100)} %`;
          return;
        }
        if (e.target?.id === 'ocean-adjust-custom-factor') {
          const val = Number(e.target.value);
          oceanAdjustCustomFactor = (e.target.value !== '' && Number.isFinite(val) && val > 0) ? val : null;
          return;
        }
        if (e.target?.id === 'ocean-eq-target') {
          oceanEqTargetSpeed = Number(e.target.value);
          const label = document.getElementById('ocean-eq-target-label');
          if (label) label.textContent = `${oceanEqTargetSpeed.toFixed(2)} nd`;
          if (oceanEqActive) refresh(R.OCEAN_HEX_GRID);
          return;
        }
        if (e.target?.id === 'ocean-eq-bandwidth') {
          oceanEqBandwidth = Number(e.target.value);
          const label = document.getElementById('ocean-eq-band-label');
          if (label) label.textContent = `${oceanEqBandwidth.toFixed(2)} nd`;
          if (oceanEqActive) refresh(R.OCEAN_HEX_GRID);
          return;
        }
      });
    }
    document.getElementById('btn-copy').addEventListener('click', function () {
      const box = document.getElementById('export-box');
      // Extraire le texte brut depuis les spans (préserve les \n sans doublon)
      const text = [...box.querySelectorAll('.contour-block')]
        .map(s => s.textContent).join('') || box.textContent;
      if (!text.trim()) return;
      navigator.clipboard.writeText(text).then(() => {
        this.textContent = '✓ Copié !';
        this.classList.add('copied');
        setTimeout(() => {
          this.textContent = '⎘ Copier';
          this.classList.remove('copied');
        }, 2000);
      });
    });

    // ═══════════════════════════════════════════════════════════
    // LANCEMENT
    // ═══════════════════════════════════════════════════════════
    window.addEventListener('load', initMap);
