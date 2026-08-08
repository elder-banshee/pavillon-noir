    'use strict';

    // Panneaux latéraux : informations topographiques, sémaphore et océanographie.

    // ═══════════════════════════════════════════════════════════
    // TOPOGRAPHIE — Info : liste juridictions + édition ZONES_DEMO / hauts-fonds
    // ═══════════════════════════════════════════════════════════
    let selectedTopoInfoId = null;

    function selectTopoInfo(id) {
      selectEntity('topoInfo', id);
    }

    // Panneau TOPOGRAPHIE - Geo (réutilisé tel quel par l'onglet Ocean Bounds :
    // même pipeline générique de zones, voir ctx.isZoneEditTab).
    function updatePanel() {
      if (!ctx.isZoneEditTab) return;
      const idEl = document.getElementById('info-zone-id');
      const statsEl = document.getElementById('info-stats');
      const navEl = document.getElementById('contour-nav');
      const labelEl = document.getElementById('contour-label');
      const btnPrev = document.getElementById('btn-prev-contour');
      const btnNext = document.getElementById('btn-next-contour');
      const btnDel = document.getElementById('btn-del-contour');

      if (!selectedZoneId) {
        idEl.textContent = 'Cliquez sur une zone';
        idEl.className = 'empty-msg';
        if (statsEl) statsEl.style.display = 'none';
        navEl.style.display = 'none';
        btnDel.disabled = true;
        return;
      }

      const contours = zonesEdit[selectedZoneId];
      const contour = contours[selectedContourIdx];
      const superficieTotale = Math.round(calcSuperficie(contours));

      idEl.textContent = selectedZoneId;
      idEl.className = '';

      if (statsEl) {
        statsEl.style.display = 'flex';
        document.getElementById('stat-pts').textContent = `${contour.length} pts`;
        document.getElementById('stat-contours').textContent = `${contours.length} contour${contours.length > 1 ? 's' : ''}`;
        document.getElementById('stat-superficie').textContent = `${superficieTotale.toLocaleString('fr-FR')} px²`;
      }

      btnDel.disabled = false;

      if (contours.length > 1) {
        navEl.style.display = 'flex';
        labelEl.textContent = `Contour ${selectedContourIdx + 1} / ${contours.length}`;
        btnPrev.disabled = (selectedContourIdx === 0);
        btnNext.disabled = (selectedContourIdx === contours.length - 1);
      } else {
        navEl.style.display = 'none';
      }
    }

    function updateTopoInfoDetail() {
      const emptyEl = document.getElementById('infos-terres-empty');
      const detailEl = document.getElementById('infos-terres-detail');
      const labelEl = document.getElementById('infos-terres-label');
      const fieldsEl = document.getElementById('infos-terres-fields');
      const computedEl = document.getElementById('infos-terres-computed');
      if (!detailEl) return;

      if (!selectedTopoInfoId) {
        if (emptyEl) emptyEl.style.display = 'block';
        detailEl.style.display = 'none';
        return;
      }

      // Haut-fond : métadonnées ZONES_SHOAL (via zonesWorkingCopy.SHOAL_META)
      if (isShoalId(selectedTopoInfoId)) {
        const s = getWorkingShoals().find(x => x.id === selectedTopoInfoId);
        if (!s) {
          if (emptyEl) emptyEl.style.display = 'block';
          detailEl.style.display = 'none';
          return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        detailEl.style.display = 'block';
        labelEl.textContent = s.label || s.id;
        fieldsEl.innerHTML = renderShoalMetaFieldsHtml(s);
        fieldsEl.querySelectorAll('[data-shoal-meta]').forEach(input => {
          input.addEventListener('change', () => updateShoalMeta(s, input));
          input.addEventListener('input', () => updateShoalMeta(s, input, { soft: true }));
        });
        if (computedEl) computedEl.innerHTML = '';
        return;
      }

      // Territoire : métadonnées démographie ZONES_DEMO (comportement inchangé)
      if (!zonesWorkingCopy.DEMO) {
        if (emptyEl) emptyEl.style.display = 'block';
        detailEl.style.display = 'none';
        return;
      }
      const d = zonesWorkingCopy.DEMO[selectedTopoInfoId];
      if (!d) {
        if (emptyEl) emptyEl.style.display = 'block';
        detailEl.style.display = 'none';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';
      detailEl.style.display = 'block';
      labelEl.textContent = selectedTopoInfoId;

      const EDITABLE_FIELDS = [
        { key: 'colons', label: 'Colons', type: 'number' },
        { key: 'esclaves', label: 'Esclaves', type: 'number' },
        { key: 'indiens', label: 'Indiens', type: 'number' },
        { key: 'indiens_asservis', label: 'Indiens asservis', type: 'number' },
        {
          key: 'statut_autochtone', label: 'Statut autochtone',
          type: 'select',
          options: ['null', 'souverainete', 'resistance', 'domination']
        },
      ];

      fieldsEl.innerHTML = EDITABLE_FIELDS.map(f => {
        if (f.type === 'select') {
          const val = d[f.key] ?? 'null';
          const opts = f.options.map(o =>
            `<option value="${o}"${o === String(val) ? ' selected' : ''}>${o}</option>`
          ).join('');
          return `<label class="sea-field" style="flex-direction:row;align-items:center;gap:8px;">
        <span style="flex:1">${f.label}</span>
        <select data-field="${f.key}" style="width:130px;background:var(--ink);color:var(--text);border:1px solid var(--border);padding:3px 6px;">${opts}</select>
      </label>`;
        }
        return `<label class="sea-field" style="flex-direction:row;align-items:center;gap:8px;">
      <span style="flex:1">${f.label}</span>
      <input data-field="${f.key}" type="number" min="0" value="${d[f.key] ?? ''}"
             placeholder="—"
             style="width:90px;background:var(--ink);color:var(--text);border:1px solid var(--border);padding:3px 6px;">
    </label>`;
      }).join('');

      // Listeners : mise à jour immédiate de zonesWorkingCopy.DEMO
      fieldsEl.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('change', () => {
          const key = input.dataset.field;
          if (input.tagName === 'SELECT') {
            zonesWorkingCopy.DEMO[selectedTopoInfoId][key] =
              input.value === 'null' ? null : input.value;
          } else {
            // Champ vide → null (pas encore renseigné) ; "0" → 0 (valeur explicite)
            const raw = input.value.trim();
            zonesWorkingCopy.DEMO[selectedTopoInfoId][key] = raw === '' ? null : Number(raw);
          }
          updateInfosTerresComputed();
        });
      });

      updateInfosTerresComputed();
    }

    function updateInfosTerresComputed() {
      const computedEl = document.getElementById('infos-terres-computed');
      if (!computedEl || !selectedTopoInfoId || isShoalId(selectedTopoInfoId)) return;
      const d = zonesWorkingCopy.DEMO[selectedTopoInfoId];
      if (!d) return;
      const nonRenseigne = d.colons === null;
      if (nonRenseigne) {
        computedEl.innerHTML =
          `<div style="color:rgba(255,90,30,0.8);font-style:italic;font-size:0.7rem;">Données non renseignées — effacez le halo en saisissant les valeurs ci-dessus (0 pour un territoire désert).</div>`;
        return;
      }
      const population = (d.colons ?? 0) + (d.esclaves ?? 0) + (d.indiens ?? 0);
      const superficie = d.superficie ?? 0;
      const score = superficie > 0
        ? Math.round(Math.log10(population / superficie + 1) * 1e4) / 1e4
        : 0;
      computedEl.innerHTML =
        `<div style="margin-bottom:4px"><span style="color:var(--text-dim)">Population :</span> <strong>${population.toLocaleString('fr-FR')}</strong></div>` +
        `<div style="margin-bottom:4px"><span style="color:var(--text-dim)">Superficie :</span> ${superficie ? superficie.toLocaleString('fr-FR') + ' px²' : '—'}</div>` +
        `<div><span style="color:var(--text-dim)">Score densité :</span> ${score}</div>`;
    }

    function summarizeSemaphoreShoal(shoal) {
      const bits = [`Nav ${shoal.visibiliteNav ?? 2}`];
      if (shoal.catMax != null) bits.push(`cat max ${shoal.catMax}`);
      if (shoal.catMaxNav != null && shoal.catMaxNav !== '') bits.push(`cat nav ${shoal.catMaxNav}`);
      if (shoal.passageNav != null && shoal.passageNav !== '') bits.push(`passage Nav ${shoal.passageNav}`);
      return `${escapeHtmlText(shoal.label || shoal.id)} (${bits.join(', ')})`;
    }

    function formatSemaphoreList(items, formatter, emptyText) {
      if (!items.length) return emptyText;
      return `<ul style="margin:4px 0 0 16px; padding:0;">${items.map(item => `<li>${formatter(item)}</li>`).join('')}</ul>`;
    }

    function formatMaybeNumber(value, digits = 1, suffix = '') {
      const n = Number(value);
      return Number.isFinite(n) ? `${n.toFixed(digits)}${suffix}` : 'n/a';
    }

    function formatDistanceCote(inspect) {
      const distance = Number(inspect?.distanceCoteNm);
      return Number.isFinite(distance) ? `${distance.toFixed(1)} M` : 'indéfinie';
    }

    function formatAttenuationCourant(inspect, center) {
      return 'désactivée';
    }

    function summarizeJaillotCurrent(current) {
      if (!current) return 'aucun courant retenu';
      const parts = [
        current.direction || 'direction n/a',
        formatMaybeNumber(current.speedKnot ?? current.speedKnots, 2, ' nd'),
        current.zoneNom ? `zone ${escapeHtmlText(current.zoneNom)}` : null,
        current.typeZone ? `type ${escapeHtmlText(current.typeZone)}` : null,
      ];
      if (Array.isArray(current.courants) && current.courants.length) {
        parts.push(current.courants.map(c => escapeHtmlText(c.nom || c.id || '?')).join(', '));
      }
      return parts.filter(Boolean).join(' - ');
    }

    function summarizeJaillotWind(wind) {
      if (!wind) return 'aucun vent retenu';
      return [
        wind.label || 'vent',
        wind.direction || 'direction n/a',
        formatMaybeNumber(wind.speedKnots, 2, ' nd'),
        `deventement ${formatMaybeNumber(wind.facteurDeventement, 2)}`,
      ].map(escapeHtmlText).join(' - ');
    }

    function summarizeJaillotShoals(items) {
      if (!Array.isArray(items) || !items.length) return 'aucun haut-fond calculateur';
      return formatSemaphoreList(items, item => {
        const status = item.interdit ? 'bloquant' : 'franchissable';
        return `${escapeHtmlText(item.label || item.id || 'Haut-fond')} (${status}, cat max ${item.catMax}, passage Nav ${item.passageNav})`;
      }, 'aucun haut-fond calculateur');
    }

    function inspectSemaphorePoint(center) {
      if (!window.NavigationJaillot?.inspecterPointNavigation) {
        return { error: 'NavigationJaillot.inspecterPointNavigation indisponible' };
      }
      try {
        return window.NavigationJaillot.inspecterPointNavigation({ x: center[0], y: center[1] });
      } catch (err) {
        return { error: err?.message || String(err) };
      }
    }

    function renderJaillotInspector(inspect, center) {
      if (inspect?.error) {
        return `<span>Calculateur :</span> erreur - ${escapeHtmlText(inspect.error)}<br><span>Centre case :</span> ${Math.round(center[0])}, ${Math.round(center[1])}<br><span>Filtre :</span> Navigation ${semaphoreNavLevel}`;
      }
      const navire = inspect.navire || {};
      const mods = inspect.modificateurs || {};
      const modLabels = [
        `courants ${mods.courants ? 'ON' : 'OFF'}`,
        `vent ${mods.vent ? 'ON' : 'OFF'}`,
        `deventement ${mods.deventement ? 'ON' : 'OFF'}`,
      ].join(', ');
      return [
        `<span>Calculateur :</span> ${inspect.navigablePoint ? 'case navigable' : 'case bloquee'}`,
        `<span>Navire :</span> ${escapeHtmlText(navire.nom || navire.id || 'n/a')} - cat ${escapeHtmlText(navire.categorieTaille ?? 'n/a')} - encombrement ${escapeHtmlText(navire.encombrementPct ?? 'n/a')}% - carenage ${escapeHtmlText(navire.carenage || (navire.carenageApplicable ? 'applicable' : 'n/a'))}`,
        `<span>Modificateurs :</span> ${escapeHtmlText(modLabels)} - vitesse ${escapeHtmlText(navire.modificateurVitesseNoeuds ?? 0)} nd`,
        `<span>Courant retenu :</span> ${summarizeJaillotCurrent(inspect.courant)}`,
        `<span>Vent retenu :</span> ${summarizeJaillotWind(inspect.vent)}`,
        `<span>Hauts-fonds calculateur :</span> ${summarizeJaillotShoals(inspect.hautsFonds)}`,
        `<span>Cote :</span> distance ${formatDistanceCote(inspect)} - attenuation courant ${formatAttenuationCourant(inspect, center)}`,
        `<span>Centre case :</span> ${Math.round(center[0])}, ${Math.round(center[1])}`,
        `<span>Filtre :</span> Navigation ${semaphoreNavLevel}`,
      ].join('<br>');
    }

    function updateSeaPanel() {
      const idEl = document.getElementById('sea-cell-id');
      const windEl = document.getElementById('sea-wind');
      const debugEl = document.getElementById('sea-debug');
      if (!selectedSemaphorePoint) {
        idEl.textContent = 'Cliquez sur la carte';
        idEl.className = 'empty-msg';
        windEl.innerHTML = '<span>Hauts-fonds :</span> non défini';
        if (debugEl) debugEl.innerHTML = '<span>Calculateur :</span> cliquez sur la carte';
        return;
      }
      const center = selectedSemaphorePoint;
      const shoals = semaphoreVisibleShoals().filter(shoal => seaPointInZone(center, shoal.zone));
      idEl.textContent = `x ${Math.round(center[0])}, y ${Math.round(center[1])}`;
      idEl.className = '';
      windEl.innerHTML = `<span>Hauts-fonds visibles :</span> ${formatSemaphoreList(shoals, summarizeSemaphoreShoal, 'aucun')}`;
      if (debugEl) debugEl.innerHTML = renderJaillotInspector(inspectSemaphorePoint(center), center);
    }

    // Panneau OCEAN déplacé en Infos — Mers (contrôle case par case).
    function updateInfosMersOceanPanel() {
      updateOceanSummary();
      const oceanEl = document.getElementById('sea-ocean');
      if (oceanEl) {
        oceanEl.innerHTML = isOceanBatchSelection()
          ? formatOceanBatchPanel()
          : selectedSeaCellKey
            ? formatOceanCellForPanel(selectedSeaCellKey)
            : '<span>Cellule OCEAN :</span> non sélectionnée';
      }
      updateOceanToolbarActionState();
    }
