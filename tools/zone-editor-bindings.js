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
    function extractOscarGridFromSource(text) {
      const marker = 'const OSCAR_HEX_GRID = ';
      const start = text.indexOf(marker);
      if (start < 0) throw new Error('Fichier invalide : "const OSCAR_HEX_GRID = " introuvable.');
      const braceStart = text.indexOf('{', start);
      if (braceStart < 0) throw new Error('Fichier invalide : objet OSCAR_HEX_GRID introuvable.');
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

    function describeOscarGridSource(grid, filename) {
      const n = Object.keys(grid.cells).length;
      const method = grid.speedCorrection?.method || grid.speedCorrection?.factor
        ? (grid.speedCorrection.method || `facteur ×${grid.speedCorrection.factor}`)
        : 'aucune correction';
      return `${filename} — v${grid.version ?? '?'}, ${n} cellules, ${method}, plafond dégradé ${oscarSpeedColorCap} nd`;
    }

    function confirmDiscardOceanSessionEdits(actionLabel) {
      const count = sessionEditedOceanCellKeys.size;
      if (!count) return true;
      return confirm(`${count} cellule(s) modifiée(s) dans cette instance ne seront plus signalées comme édition de session. Continuer : ${actionLabel} ?`);
    }

    const oscarGridLoadBtn = document.getElementById('oscar-grid-load-btn');
    const oscarGridLoadInput = document.getElementById('oscar-grid-load-input');
    const oscarGridResetBtn = document.getElementById('oscar-grid-reset-btn');
    const oscarGridLoadedLabel = document.getElementById('oscar-grid-loaded-label');
    if (oscarGridLoadBtn && oscarGridLoadInput) {
      oscarGridLoadBtn.addEventListener('click', () => oscarGridLoadInput.click());
      oscarGridLoadInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (!confirmDiscardOceanSessionEdits('charger une autre grille')) return;
        try {
          const text = await file.text();
          const grid = extractOscarGridFromSource(text);
          customOscarGrid = grid;
          customOscarGridLabel = file.name;
          sessionEditedOceanCellKeys.clear();
          recomputeOscarSpeedColorCap(grid);
          clearOscarGridLayer();
          populateOscarDomainSelect();
          if (oscarGridLoadedLabel) {
            oscarGridLoadedLabel.innerHTML = `<span>Source :</span> ${escapeHtmlText(describeOscarGridSource(grid, file.name))}`;
          }
          refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
        } catch (err) {
          alert('Échec du chargement de la grille : ' + err.message);
        }
      });
    }
    if (oscarGridResetBtn) {
      oscarGridResetBtn.addEventListener('click', () => {
        if (!confirmDiscardOceanSessionEdits('réinitialiser vers la grille du dépôt')) return;
        customOscarGrid = null;
        customOscarGridLabel = '';
        sessionEditedOceanCellKeys.clear();
        recomputeOscarSpeedColorCap(getOscarGrid());
        clearOscarGridLayer();
        populateOscarDomainSelect();
        if (oscarGridLoadedLabel) {
          oscarGridLoadedLabel.innerHTML = '<span>Source :</span> grille du dépôt (js/oscar-hex-grid.js)';
        }
        refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oscarGridVisibleInput = document.getElementById('oscar-grid-visible');
    if (oscarGridVisibleInput) {
      oscarGridVisibleInput.checked = oscarGridVisible;
      oscarGridVisibleInput.addEventListener('change', (e) => {
        oscarGridVisible = !!e.target.checked;
        refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oscarGridArrowsInput = document.getElementById('oscar-grid-arrows');
    if (oscarGridArrowsInput) {
      oscarGridArrowsInput.checked = oscarGridArrowsVisible;
      oscarGridArrowsInput.addEventListener('change', (e) => {
        oscarGridArrowsVisible = !!e.target.checked;
        refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oscarSessionEditsVisibleInput = document.getElementById('oscar-session-edits-visible');
    if (oscarSessionEditsVisibleInput) {
      oscarSessionEditsVisibleInput.checked = oscarSessionEditsVisible;
      oscarSessionEditsVisibleInput.addEventListener('change', (e) => {
        oscarSessionEditsVisible = !!e.target.checked;
        refresh(R.OSCAR_SELECTION | R.SEA_PANEL);
      });
    }
    const oscarGridDomainSelect = document.getElementById('oscar-grid-domain');
    if (oscarGridDomainSelect) {
      oscarGridDomainSelect.addEventListener('change', (e) => {
        oscarGridDomainFilter = e.target.value || '';
        refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
      });
    }
    const oscarGridFilterSelect = document.getElementById('oscar-grid-filter');
    if (oscarGridFilterSelect) {
      oscarGridFilterSelect.addEventListener('change', (e) => {
        oscarGridTypeFilter = e.target.value || '';
        refresh(R.OSCAR_HEX_GRID | R.SEA_PANEL);
      });
    }
    const seaOscarPanel = document.getElementById('sea-oscar');
    if (seaOscarPanel) {
      seaOscarPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ocean-action]');
        if (!btn) return;
        handleOceanCellAction(btn.dataset.oceanAction);
      });
      seaOscarPanel.addEventListener('change', (e) => {
        if (e.target?.id !== 'ocean-has-coastal') return;
        const fields = document.getElementById('ocean-coastal-fields');
        if (fields) fields.style.display = e.target.checked ? 'contents' : 'none';
      });
    }
    // Réglages inline de l'outil Accentuer/Estomper et de l'égaliseur :
    // vivent dans #tool-group
    // (barre supérieure), reconstruits à chaque refresh(R.TOOLS) — délégation
    // sur le conteneur stable plutôt que sur les contrôles, mêmes principes
    // que la délégation #sea-oscar ci-dessus. Mettent à jour l'état persistant
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
          const factor = OSCAR_ADJUST_FACTORS[oceanAdjustFactorIdx] ?? OSCAR_ADJUST_FACTORS[1];
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
          if (oceanEqActive) refresh(R.OSCAR_HEX_GRID);
          return;
        }
        if (e.target?.id === 'ocean-eq-bandwidth') {
          oceanEqBandwidth = Number(e.target.value);
          const label = document.getElementById('ocean-eq-band-label');
          if (label) label.textContent = `${oceanEqBandwidth.toFixed(2)} nd`;
          if (oceanEqActive) refresh(R.OSCAR_HEX_GRID);
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
