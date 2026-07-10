    'use strict';

    // Interactions carte : clics, sélection, tracé et outils contextuels.

    // ═══════════════════════════════════════════════════════════
    // GESTION DES CLICS SUR LA CARTE
    // ═══════════════════════════════════════════════════════════
    function onMapMouseMove(e) {
      const rawPt = latLngToPx(e.latlng);
      const [x, y] = rawPt;
      const cx = Math.max(0, Math.min(IMG_W, x));
      const cy = Math.max(0, Math.min(IMG_H, y));
      document.getElementById('tb-coords').innerHTML = `x <span>${cx}</span> &nbsp; y <span>${cy}</span>`;
    }

    function onMapMouseDown(e) {
    }

    function onMapMouseUp() {
    }

    // ─── Sélection par glisser (Shift + clic-maintenu) en OCÉANOGRAPHIE ───────
    // Écoute native en phase de capture, indépendante des événements Leaflet :
    // évite toute course avec le module de panoramique interne de Leaflet, qui
    // peut intercepter mousedown/mousemove avant nos gestionnaires map.on(...).
    function oceanPointFromNativeEvent(nativeEvent) {
      const latlng = map.mouseEventToLatLng(nativeEvent);
      const [x, y] = latLngToPx(latlng);
      return { x, y };
    }

    function oceanPaintOnMove(nativeEvent) {
      if (!oceanPaintSelecting) return;
      const { x, y } = oceanPointFromNativeEvent(nativeEvent);
      if (!isPxInsideImage([x, y])) return;
      const key = oscarKeyFromPoint({ x, y });
      if (key && key !== oceanPaintLastKey) {
        oceanPaintLastKey = key;
        oceanPaintDidExtend = true;
        oceanCellEditing = false;
        if (oceanPaintMode === 'add') selectedOceanCellKeys.add(key);
        else selectedOceanCellKeys.delete(key);
        selectedSeaCellKey = key;
        renderSeaCells();
        updateInfosMersOscarPanel();
      }
    }

    function oceanPaintOnUp() {
      if (!oceanPaintSelecting) return;
      oceanPaintSelecting = false;
      map.dragging.enable();
      document.removeEventListener('mousemove', oceanPaintOnMove, true);
      document.removeEventListener('mouseup', oceanPaintOnUp, true);
    }

    function oceanPaintOnDown(nativeEvent) {
      if (!ctx.isOcean || currentTool !== 'select' || nativeEvent.button !== 0 || !nativeEvent.shiftKey) return;
      const { x, y } = oceanPointFromNativeEvent(nativeEvent);
      if (!isPxInsideImage([x, y])) return;
      const key = oscarKeyFromPoint({ x, y });
      if (!key) return;
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      oceanPaintSelecting = true;
      oceanPaintDidExtend = false;
      oceanPaintLastKey = null;
      oceanPaintMode = selectedOceanCellKeys.has(key) ? 'remove' : 'add';
      map.dragging.disable();
      document.addEventListener('mousemove', oceanPaintOnMove, true);
      document.addEventListener('mouseup', oceanPaintOnUp, true);
    }

    function clearOceanLassoLayer() {
      if (!oceanLassoLayer) return;
      map.removeLayer(oceanLassoLayer);
      oceanLassoLayer = null;
    }

    function cancelOceanLasso() {
      oceanLassoSelecting = false;
      oceanLassoPoints = [];
      clearOceanLassoLayer();
      document.removeEventListener('mousemove', oceanLassoOnMove, true);
      document.removeEventListener('mouseup', oceanLassoOnUp, true);
      if (map) map.dragging.enable();
    }

    function renderOceanLassoPreview() {
      clearOceanLassoLayer();
      if (oceanLassoPoints.length < 2) return;
      const latlngs = oceanLassoPoints.map(point => pxToLatLng(point.x, point.y));
      oceanLassoLayer = L.polyline(latlngs, {
        pane: 'seaCellPane',
        color: 'rgba(226, 185, 106, 0.95)',
        weight: 2,
        opacity: 0.95,
        dashArray: '6 4',
        interactive: false,
      }).addTo(map);
    }

    function pointInPolygon(point, polygon) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersects = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 1e-9) + xi);
        if (intersects) inside = !inside;
      }
      return inside;
    }

    function applyOceanLassoSelection() {
      if (oceanLassoPoints.length < 3) return;
      let lastAdded = null;
      filteredOscarEntries().forEach(([key, cell]) => {
        const center = oscarCellCenterFromKey(key, cell);
        if (!pointInPolygon(center, oceanLassoPoints)) return;
        selectedOceanCellKeys.add(key);
        lastAdded = key;
      });
      if (lastAdded) {
        selectedSeaCellKey = lastAdded;
        oceanCellEditing = false;
        renderSeaCells();
        updateInfosMersOscarPanel();
      }
    }

    function oceanLassoOnMove(nativeEvent) {
      if (!oceanLassoSelecting) return;
      const { x, y } = oceanPointFromNativeEvent(nativeEvent);
      if (!isPxInsideImage([x, y])) return;
      const last = oceanLassoPoints[oceanLassoPoints.length - 1];
      if (last && Math.hypot(last.x - x, last.y - y) < 8) return;
      oceanLassoPoints.push({ x, y });
      renderOceanLassoPreview();
    }

    function oceanLassoOnUp() {
      if (!oceanLassoSelecting) return;
      oceanLassoSelecting = false;
      oceanLassoDidComplete = true;
      document.removeEventListener('mousemove', oceanLassoOnMove, true);
      document.removeEventListener('mouseup', oceanLassoOnUp, true);
      map.dragging.enable();
      applyOceanLassoSelection();
      clearOceanLassoLayer();
      oceanLassoPoints = [];
    }

    function oceanLassoOnDown(nativeEvent) {
      if (!ctx.isOcean || currentTool !== 'ocean-lasso' || nativeEvent.button !== 0) return;
      const { x, y } = oceanPointFromNativeEvent(nativeEvent);
      if (!isPxInsideImage([x, y])) return;
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      oceanLassoSelecting = true;
      oceanLassoDidComplete = false;
      oceanLassoPoints = [{ x, y }];
      map.dragging.disable();
      document.addEventListener('mousemove', oceanLassoOnMove, true);
      document.addEventListener('mouseup', oceanLassoOnUp, true);
    }

    function onMapClick(e) {
      if (ctx.isSemaphore) {
        const pt = latLngToPx(e.latlng);
        if (isPxInsideImage(pt)) {
          selectedSemaphorePoint = pt;
          selectedSeaCellKey = oscarKeyFromPoint({ x: pt[0], y: pt[1] });
          renderSeaCells();
          updateSeaPanel();
        }
        if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
        return;
      }
      if (ctx.isOcean) {
        if (oceanLassoDidComplete) {
          oceanLassoDidComplete = false;
          if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
          return;
        }
        if (currentTool === 'ocean-lasso') {
          if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
          return;
        }
        if (currentTool === 'ocean-adjust') {
          const pt = latLngToPx(e.latlng);
          if (isPxInsideImage(pt)) {
            const clickedKey = oscarKeyFromPoint({ x: pt[0], y: pt[1] });
            if (clickedKey) applyOceanCellAdjustAt(clickedKey);
          }
          if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
          return;
        }
        if (oceanPaintDidExtend) {
          oceanPaintDidExtend = false;
          if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
          return;
        }
        const pt = latLngToPx(e.latlng);
        if (isPxInsideImage(pt)) {
          const point = { x: pt[0], y: pt[1] };
          const nextSeaCellKey = oscarKeyFromPoint(point);
          const multiSelect = !!e.originalEvent?.shiftKey;
          if (multiSelect && nextSeaCellKey) {
            oceanCellEditing = false;
            if (!selectedOceanCellKeys.size && selectedSeaCellKey && selectedSeaCellKey !== nextSeaCellKey) {
              selectedOceanCellKeys.add(selectedSeaCellKey);
            }
            if (selectedOceanCellKeys.has(nextSeaCellKey)) {
              selectedOceanCellKeys.delete(nextSeaCellKey);
              if (selectedSeaCellKey === nextSeaCellKey) {
                selectedSeaCellKey = selectedOceanCellKeys.values().next().value || null;
              }
            } else {
              selectedOceanCellKeys.add(nextSeaCellKey);
              selectedSeaCellKey = nextSeaCellKey;
            }
          } else {
            if (nextSeaCellKey !== selectedSeaCellKey) oceanCellEditing = false;
            selectedSeaCellKey = nextSeaCellKey;
            selectedOceanCellKeys.clear();
          }
          renderSeaCells();
          updateInfosMersOscarPanel();
        }
        if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
        return;
      }
      if (currentTool === 'draw') {
        addDrawPoint(latLngToPx(e.latlng));
        return;
      }
      // Clic dans le vide — désélectionner selon le mode actif
      if (currentTool === 'select') {
        if (ctx.isTopoGeo) {
          clearSelection();
        } else if (ctx.isTopoInfo) {
          clearTopoInfoSelection();
        }
      }
    }

    function onMapRightClick(e) {
      if (ctx.isSemaphore || ctx.isOcean) return;
      if (currentTool === 'draw') {
        finishDraw();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CHANGEMENT D'OUTIL
    // ═══════════════════════════════════════════════════════════
    function setTool(tool) {
      if (ctx.isOcean) {
        tool = OCEAN_TOOLS.some(item => item.id === tool) ? tool : 'select';
      }
      if (tool === currentTool && tool !== 'draw') return;

      // Quitter le mode draw proprement si on change d'outil
      if (currentTool === 'draw' && tool !== 'draw') cancelDraw(true);

      if (currentTool === 'ocean-lasso' && tool !== 'ocean-lasso') {
        cancelOceanLasso();
      }

      // Quitter le mode split proprement
      if (currentTool === 'split' && tool !== 'split') {
        splitFirstPt = null;
        clearSplitHandles();
      }

      currentTool = tool;

      // UI
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');

      // Curseur
      const mapEl = document.getElementById('map');
      mapEl.className = 'tool-' + tool;

      if (ctx.isSemaphore || ctx.isOcean) {
        document.getElementById('draw-badge').style.display = 'none';
        document.getElementById('draw-controls').style.display = 'none';
        clearHandles();
        clearSegmentMarkers();
        refresh(R.OSCAR_SELECTION | R.EXPORT | R.TOOLS);
        return;
      }

      // Mode draw : démarrer la session de tracé
      if (tool === 'draw') {
        startDrawMode();
      } else {
        document.getElementById('draw-badge').style.display = 'none';
        document.getElementById('draw-controls').style.display = 'none';
      }

      // Mode insert : afficher les marqueurs de segments si zone sélectionnée
      if (ctx.isTopoGeo && tool === 'insert' && selectedZoneId) {
        renderSegmentMarkers();
      } else {
        clearSegmentMarkers();
      }

      // Mode split : afficher les poignées de découpe
      if (ctx.isTopoGeo && tool === 'split' && selectedZoneId) {
        clearHandles();
        renderSplitHandles();
      } else if (tool !== 'split') {
        clearSplitHandles();
      }

      // Rafraîchir les poignées si select/erase/insert (et pas split)
      if (ctx.isTopoGeo && (tool === 'select' || tool === 'erase') && selectedZoneId) {
        renderHandles();
      }
    }
