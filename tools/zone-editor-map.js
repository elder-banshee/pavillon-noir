    'use strict';

    // Carte Leaflet, rendu topographique et édition des contours.

    // ═══════════════════════════════════════════════════════════
    // INIT CARTE
    // ═══════════════════════════════════════════════════════════
    function initMap() {
      map = L.map('map', {
        crs: L.CRS.Simple,
        zoomControl: true,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
        minZoom: -3,
        maxZoom: 4,
      });

      // Image de fond
      const bounds = L.latLngBounds(pxToLatLng(0, IMG_H), pxToLatLng(IMG_W, 0));
      L.imageOverlay(IMG_SRC, bounds).addTo(map);
      recomputeOscarSpeedColorCap(getOscarGrid());
      populateOscarDomainSelect();
      updateOceanClipboardStatus();
      window.addEventListener('storage', (e) => {
        if (e.key === 'pn-ocean-clipboard') {
          updateOceanClipboardStatus();
          if (ctx.isOcean) updateInfosMersOscarPanel();
        }
      });
      // Désactiver le panoramique de Leaflet DÈS l'appui sur Shift en OCÉANOGRAPHIE,
      // avant tout mousedown : évite la course avec le module de drag interne de
      // Leaflet, qui traite mousedown avant nos propres gestionnaires.
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift' && ctx.isOcean && map) map.dragging.disable();
      });
      document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift' && map && !oceanPaintSelecting && !oceanLassoSelecting) map.dragging.enable();
      });
      // Capture-phase, avant que Leaflet ne voie l'événement (cf. commentaire
      // sur oceanPaintOnDown).
      map.getContainer().addEventListener('mousedown', oceanPaintOnDown, true);
      map.getContainer().addEventListener('mousedown', oceanLassoOnDown, true);
      map.createPane('oscarGridPane');
      map.getPane('oscarGridPane').style.zIndex = 435;
      map.createPane('oscarArrowPane');
      map.getPane('oscarArrowPane').style.zIndex = 438;
      map.createPane('seaCellPane');
      map.getPane('seaCellPane').style.zIndex = 440;
      seaCellLayer = L.layerGroup().addTo(map);

      setTimeout(() => {
        map.fitBounds(bounds);
        map.setMinZoom(map.getZoom());
      }, 50);

      // Mouvements souris → coordonnées dans la barre
      map.on('mousemove', onMapMouseMove);
      map.on('mousemove', onDragMove);     // drag poignées Géo-Terres et Géo-Mers
      map.on('mousedown', onMapMouseDown);
      map.on('mouseup', onMapMouseUp);
      map.on('mouseup', onDragEnd);      // relâchement drag poignées

      // Tactile : Leaflet ne traduit touchstart/touchmove/touchend en
      // mousedown/mousemove/mouseup ni pour l'interactivité des calques ni
      // pour les événements globaux de la carte — seul le tap (touchstart+
      // touchend sans mouvement) est traduit en 'click'. Sans ce
      // raccordement dédié, un doigt posé sur une poignée ne déclenche
      // jamais startDrag() : le geste est alors récupéré tel quel par le
      // panoramique interne de la carte (confirmé en reproduisant avec des
      // événements tactiles bruts, pas supposé). touchstart→startDrag est
      // câblé poignée par poignée dans renderPointHandlesForRing ; move/end
      // sont globaux ici, symétriques à mousemove/mouseup, et réutilisent
      // onDragMove/onDragEnd tels quels via un pseudo-événement {latlng}.
      // { passive: false } : nécessaire pour pouvoir appeler preventDefault
      // (sinon le navigateur scrolle/panote pendant le drag).
      document.addEventListener('touchmove', onTouchDragMove, { passive: false });
      document.addEventListener('touchend', onTouchDragEnd);
      map.on('zoomend', () => {
        if (ctx.isSemaphore || ctx.isOcean) {
          renderSeaCells();
        }
      });
      map.getContainer().addEventListener('mousedown', (e) => {
        if (ctx.isOcean && e.shiftKey) e.stopPropagation();
      }, true);
      map.on('click', onMapClick);
      map.on('contextmenu', onMapRightClick);
      refreshCtx();

      // ─── Initialisation des copies de travail partagées ─────────
      // zones-data.js
      zonesWorkingCopy.DATA = {};
      zonesWorkingCopy.DEMO = (typeof ZONES_DEMO !== 'undefined') ? cloneJSON(ZONES_DEMO) : {};
      for (const id in ZONES_DATA) {
        zonesEdit[id] = [];
        zonesMeta[id] = [];
        ZONES_DATA[id].forEach(contour => {
          const points = contourPoints(contour);
          if (!points || points.length < 3) return;
          zonesEdit[id].push(points.map(pt => [...pt]));
          zonesMeta[id].push(contourMeta(contour));
        });
        zonesWorkingCopy.DATA[id] = zonesEdit[id]; // alias : même référence
      }

      // zones-data.js — ZONES_SHOAL fournit les métadonnées haut-fond
      // (la géométrie des hauts-fonds est déjà dans ZONES_DATA, traitée
      // ci-dessus comme n'importe quel autre id de zone).
      zonesWorkingCopy.SHOAL_META = (typeof ZONES_SHOAL !== 'undefined')
        ? cloneJSON(ZONES_SHOAL) : {};

      // zones-data.js — ZONES_OCEAN_BOUNDS (masque navigable Atlantique/
      // Pacifique). Même pipeline zonesEdit/zonesMeta que territoires et
      // hauts-fonds ("un polygone est un polygone"), mais chaque entité a un
      // contour extérieur unique + une série de trous (îles) — voir
      // loadOceanBoundsWorkingCopy() ci-dessous pour le détail du tag de rôle.
      zonesWorkingCopy.OCEAN_BOUNDS = loadOceanBoundsWorkingCopy();

      // ─── Map couleur géopolitique par zone ───────────────────
      // Construite depuis JURIDICTIONS + PUISSANCES à l'année de référence.
      // Clé : zone id  Valeur : couleur hex de la puissance coloniale
      buildZoneCouleurMap();

      refresh(R.ZONES | R.TOOLS | R.EDITOR | R.UNDO);
    }

    // Charge ZONES_OCEAN_BOUNDS dans zonesEdit/zonesMeta comme deux entités
    // supplémentaires ('ocean-bounds-atlantique', 'ocean-bounds-pacifique'),
    // aux côtés des territoires et hauts-fonds déjà chargés. Le contour 0
    // porte toujours le rôle explicite 'exterior' ; chaque trou suivant porte
    // 'hole' — tag posé en dur dans zonesMeta plutôt que déduit d'une
    // convention d'index, pour rester correct même si un split/réordonnancement
    // vient un jour mélanger l'ordre des contours pendant l'édition (cf.
    // discussion de session sur ce point précis). Le rendu en tant que masque
    // à trous réel (au lieu de contours pleins superposés) et l'export dédié
    // sont volontairement laissés à une étape ultérieure — ce chargement seul
    // n'a aucun effet visible tant que rien ne lit ces ids dans l'UI.
    function loadOceanBoundsWorkingCopy() {
      const working = {};
      if (typeof ZONES_OCEAN_BOUNDS === 'undefined') return working;
      for (const id in ZONES_OCEAN_BOUNDS) {
        const zone = ZONES_OCEAN_BOUNDS[id]?.zone;
        const exterior = Array.isArray(zone?.exterior) ? zone.exterior : null;
        if (!exterior || exterior.length < 3) continue;

        zonesEdit[id] = [exterior.map(pt => [...pt])];
        zonesMeta[id] = [{ role: 'exterior' }];

        const holes = Array.isArray(zone.holes) ? zone.holes : [];
        holes.forEach(hole => {
          if (!Array.isArray(hole) || hole.length < 3) return;
          zonesEdit[id].push(hole.map(pt => [...pt]));
          zonesMeta[id].push({ role: 'hole' });
        });

        working[id] = zonesEdit[id]; // alias : même référence, comme zonesWorkingCopy.DATA
      }
      return working;
    }

    // ═══════════════════════════════════════════════════════════
    // COULEURS GÉOPOLITIQUES
    // ═══════════════════════════════════════════════════════════
    // Map<zoneId → { hex, rgb }> construite au boot depuis JURIDICTIONS + PUISSANCES
    let zoneCouleurMap = new Map();

    function buildZoneCouleurMap() {
      zoneCouleurMap.clear();
      if (typeof JURIDICTIONS === 'undefined' || typeof PUISSANCES === 'undefined') return;

      const annee = typeof CARTE_ANNEE_REFERENCE !== 'undefined' ? CARTE_ANNEE_REFERENCE : 1716;

      // resoudre() est défini dans carte-data.js mais pas garanti dispo ici —
      // on l'implémente directement pour éviter la dépendance.
      function resoudreLocal(champ) {
        if (!champ || typeof champ !== 'object') return champ;
        const cles = Object.keys(champ).map(Number).filter(n => n <= annee).sort((a, b) => a - b);
        return cles.length ? champ[cles[cles.length - 1]] : null;
      }

      function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
      }

      JURIDICTIONS.forEach(j => {
        const puissanceId = resoudreLocal(j.puissance);
        const p = puissanceId && PUISSANCES[puissanceId];
        if (p && p.couleur) {
          zoneCouleurMap.set(j.id, { hex: p.couleur, rgb: hexToRgb(p.couleur) });
        }
      });
    }

    // Retourne les styles Leaflet pour un polygone selon le contexte actuel
    function zoneStyle(zoneId, isSelected) {
      if (isSelected) return STYLE_SELECTED;

      if (ctx.isTopoInfo) {
        if (isShoalId(zoneId)) {
          return { color: 'rgba(130,80,30,0.9)', weight: 1.5, dashArray: '5 4', fillColor: 'rgba(100,55,15,0.38)', fillOpacity: 1 };
        }
        // Avertissement uniquement si les champs sont null (pas encore saisis),
        // pas si l'utilisateur a explicitement renseigné 0 (territoire désert légitime).
        // oceanBounds exclu : ce n'est pas un territoire, pas de démographie à saisir.
        const demo = zonesWorkingCopy.DEMO?.[zoneId];
        const estVide = !isOceanBoundsId(zoneId) && (!demo || demo.colons === null);
        if (estVide) {
          // Orange-rouge vif — territoire sans données
          return { color: 'rgba(255,90,30,0.95)', weight: 2, fillColor: 'rgba(255,90,30,0.18)', fillOpacity: 1 };
        }
        // Couleur géopolitique
        const c = zoneCouleurMap.get(zoneId);
        if (c) return { color: `rgba(${c.rgb},0.75)`, weight: 1.5, fillColor: `rgba(${c.rgb},0.22)`, fillOpacity: 1 };
        return STYLE_NORMAL;
      }

      if (ctx.isTopoGeo) {
        if (isShoalId(zoneId)) {
          return { color: 'rgba(130,80,30,0.9)', weight: 1.5, dashArray: '5 4', fillColor: 'rgba(100,55,15,0.38)', fillOpacity: 1 };
        }
        // Couleur géopolitique en Topo-Géo aussi (aide à l'identification)
        const c = zoneCouleurMap.get(zoneId);
        if (c) return { color: `rgba(${c.rgb},0.6)`, weight: 1, fillColor: `rgba(${c.rgb},0.12)`, fillOpacity: 1 };
        return STYLE_NORMAL;
      }

      return STYLE_NORMAL;
    }

    // Style hover adapté (version plus lumineuse du style de base)
    function zoneStyleHover(zoneId) {
      const c = zoneCouleurMap.get(zoneId);
      if (!c) return STYLE_HOVER;
      return { color: `rgba(${c.rgb},0.95)`, weight: 2, fillColor: `rgba(${c.rgb},0.28)`, fillOpacity: 1 };
    }

    // ═══════════════════════════════════════════════════════════
    // RENDU DES ZONES
    // ═══════════════════════════════════════════════════════════
    function renderAllZones() {
      // Supprimer les anciens layers
      for (const id in zoneLayers) {
        zoneLayers[id].forEach(l => map.removeLayer(l));
      }
      zoneLayers = {};

      // Onglet dédié, pas de fusion : sur Ocean Bounds on n'affiche que les
      // deux entités oceanBounds (sinon leur contour extérieur double le
      // tracé des juridictions/hauts-fonds le long de la côte) ; partout
      // ailleurs, l'inverse — oceanBounds ne s'affiche que sur son onglet.
      for (const id in zonesEdit) {
        if (isOceanBoundsId(id) !== ctx.isTopoOceanBounds) continue;
        renderZone(id);
      }
    }

    function renderZone(zoneId) {
      if (zoneLayers[zoneId]) {
        zoneLayers[zoneId].forEach(l => map.removeLayer(l));
      }
      zoneLayers[zoneId] = [];

      if (isOceanBoundsId(zoneId)) {
        renderOceanBoundsZone(zoneId);
        return;
      }

      const contours = zonesEdit[zoneId];
      const zonesInteractive = ctx.isTopoGeo || ctx.isTopoInfo;

      // En Topo-Info, détecter si un territoire est vide pour le halo (hauts-fonds exclus)
      const demo = zonesWorkingCopy.DEMO?.[zoneId];
      const estVide = ctx.isTopoInfo && !isShoalId(zoneId) && (!demo || demo.colons === null);

      contours.forEach((contour, contourIdx) => {
        const latlngs = contourToLatLngs(contour);
        const isSelected = (zoneId === selectedZoneId && contourIdx === selectedContourIdx)
          || (zoneId === selectedTopoInfoId && ctx.isTopoInfo);

        const style = zoneStyle(zoneId, isSelected);

        // Halo pour zones vides en Infos-Terres (couche derrière)
        if (estVide && !isSelected) {
          const halo = L.polygon(latlngs, {
            color: 'rgba(255,90,30,0)',
            weight: 0,
            fillColor: 'rgba(255,90,30,0.08)',
            fillOpacity: 1,
            interactive: false,
            className: 'zone-halo-vide',
          });
          // On ajoute un second polygon décalé via un filtre SVG simulé par un poids large
          const haloOuter = L.polygon(latlngs, {
            color: 'rgba(255,90,30,0.5)',
            weight: 8,
            opacity: 0.35,
            fillColor: 'transparent',
            fillOpacity: 0,
            interactive: false,
          });
          haloOuter.addTo(map);
          halo.addTo(map);
          zoneLayers[zoneId].push(haloOuter, halo);
        }

        const poly = L.polygon(latlngs, { ...style, interactive: zonesInteractive });
        poly._zoneId = zoneId;
        poly._contourIdx = contourIdx;

        poly.on('mouseover', function () {
          if (!zonesInteractive) return;
          if (draggingHandle) return;
          const isSel = (this._zoneId === selectedZoneId && this._contourIdx === selectedContourIdx)
            || (this._zoneId === selectedTopoInfoId && ctx.isTopoInfo);
          if (!isSel) this.setStyle(zoneStyleHover(this._zoneId));
          this.bindTooltip(this._zoneId + (zonesEdit[this._zoneId].length > 1
            ? ` (contour ${this._contourIdx + 1}/${zonesEdit[this._zoneId].length})` : ''), {
            permanent: false, className: 'ed-tooltip', direction: 'top', sticky: true
          }).openTooltip();
        });
        poly.on('mouseout', function () {
          if (!zonesInteractive) return;
          const isSel = (this._zoneId === selectedZoneId && this._contourIdx === selectedContourIdx)
            || (this._zoneId === selectedTopoInfoId && ctx.isTopoInfo);
          if (!isSel) this.setStyle(zoneStyle(this._zoneId, false));
          this.unbindTooltip();
        });
        poly.on('click', function (e) {
          if (!zonesInteractive) return;
          L.DomEvent.stopPropagation(e);
          if (ctx.isTopoInfo) {
            selectTopoInfo(this._zoneId);
          } else if (ctx.isTopoGeo) {
            if (currentTool === 'select' || currentTool === 'erase' || currentTool === 'insert') {
              selectZone(this._zoneId, this._contourIdx);
            } else if (currentTool === 'split') {
              // En mode split, le clic sur le polygone ne fait rien (les poignées gèrent)
            }
          }
        });

        poly.addTo(map);
        zoneLayers[zoneId].push(poly);
      });
    }

    // Rendu dédié oceanBounds (Atlantique/Pacifique) : contour extérieur unique
    // + trous (îles). Contrairement à renderZone() ci-dessus, qui crée un
    // L.polygon indépendant et rempli par contour (correct pour territoire/
    // haut-fond, mais afficherait les trous comme des taches pleines
    // superposées), on construit ici un seul L.polygon avec tous les anneaux
    // d'un coup — Leaflet applique nativement la règle pair-impair et découpe
    // les trous. L'ordre des anneaux suit zonesEdit tel quel ; le rôle
    // ('exterior' | 'hole') vit dans zonesMeta et ne sert qu'aux métadonnées/
    // export, pas à la construction géométrique elle-même.
    function renderOceanBoundsZone(zoneId) {
      const contours = zonesEdit[zoneId];
      // Onglet dédié, pas de fusion avec Géo/Info : oceanBounds n'est
      // cliquable/survolable que sur l'onglet Ocean Bounds lui-même.
      const zonesInteractive = ctx.isTopoOceanBounds;
      const isSelected = zoneId === selectedZoneId;

      const style = zoneStyle(zoneId, isSelected);
      const rings = contours.map(contourToLatLngs);

      const poly = L.polygon(rings, { ...style, interactive: zonesInteractive });
      poly._zoneId = zoneId;
      poly._contourIdx = null; // entité multi-anneaux : pas de contour unique associé au clic

      poly.on('mouseover', function () {
        if (!zonesInteractive) return;
        if (draggingHandle) return;
        if (this._zoneId !== selectedZoneId) this.setStyle(zoneStyleHover(this._zoneId));
        this.bindTooltip(this._zoneId, {
          permanent: false, className: 'ed-tooltip', direction: 'top', sticky: true
        }).openTooltip();
      });
      poly.on('mouseout', function () {
        if (!zonesInteractive) return;
        if (this._zoneId !== selectedZoneId) this.setStyle(zoneStyle(this._zoneId, false));
        this.unbindTooltip();
      });
      poly.on('click', function (e) {
        if (!zonesInteractive) return;
        L.DomEvent.stopPropagation(e);
        const contourIdx = (this._zoneId === selectedZoneId) ? selectedContourIdx : 0;
        selectZone(this._zoneId, contourIdx);
      });

      poly.addTo(map);
      zoneLayers[zoneId].push(poly);

      // Le masque est rendu comme un unique polygone multi-anneaux : Leaflet
      // sait alors creuser les îles, mais ne peut pas identifier l'anneau
      // touché. Une ligne transparente élargie par contour rétablit ce clic
      // précis sans altérer le rendu du masque.
      contours.forEach((contour, contourIdx) => {
        const hitArea = L.polyline(contourToLatLngs(contour), {
          color: '#000',
          opacity: 0.001,
          weight: 14,
          interactive: zonesInteractive,
          bubblingMouseEvents: false,
          className: 'ocean-bounds-contour-hit-area',
        });
        hitArea._zoneId = zoneId;
        hitArea._contourIdx = contourIdx;
        hitArea.on('click', function (e) {
          if (!zonesInteractive) return;
          L.DomEvent.stopPropagation(e);
          selectZone(this._zoneId, this._contourIdx);
        });
        hitArea.on('mouseover', function () {
          if (!zonesInteractive || draggingHandle) return;
          const role = contourRole(this._zoneId, this._contourIdx);
          const label = role === 'hole' ? 'trou' : 'contour extérieur';
          this.bindTooltip(`${this._zoneId} — ${label} ${this._contourIdx + 1}/${contours.length}`, {
            permanent: false, className: 'ed-tooltip', direction: 'top', sticky: true
          }).openTooltip();
        });
        hitArea.on('mouseout', function () { this.unbindTooltip(); });
        hitArea.addTo(map);
        zoneLayers[zoneId].push(hitArea);
      });
    }

    // ═══════════════════════════════════════════════════════════
    // SÉLECTION D'UNE ZONE / CONTOUR
    // ═══════════════════════════════════════════════════════════
    function selectZone(zoneId, contourIdx) {
      selectEntity('zone', zoneId, { contourIdx });
    }

    function clearSelection() {
      const prev = selectedZoneId;
      selectedZoneId = null;
      selectedContourIdx = 0;
      clearHandles();
      clearSegmentMarkers();
      if (prev) renderZone(prev);
      refresh(R.PANEL | R.EXPORT);
    }

    function clearTopoInfoSelection() {
      selectedTopoInfoId = null;
      refresh(R.ZONES | R.PANEL);
    }

    // ═══════════════════════════════════════════════════════════
    // POIGNÉES (mode select — déplacement de points)
    // ═══════════════════════════════════════════════════════════
    function clearHandles() {
      handleLayers.forEach(h => map.removeLayer(h));
      handleLayers = [];
    }

    function renderPointHandlesForRing(pts, targetLayers, handlers = {}) {
      pts.forEach((pt, ptIdx) => {
        const circle = L.circleMarker(pxToLatLng(pt[0], pt[1]), { ...HANDLE_NORMAL, interactive: true });
        circle._ptIdx = ptIdx;
        handlers.style?.(circle, ptIdx);
        circle.on('mouseover', function (e) {
          handlers.mouseover?.(this, ptIdx, e);
        });
        circle.on('mouseout', function (e) {
          handlers.mouseout?.(this, ptIdx, e);
        });
        circle.on('mousedown', function (e) {
          handlers.mousedown?.(this, ptIdx, e);
        });
        circle.on('click', function (e) {
          handlers.click?.(this, ptIdx, e);
        });
        circle.addTo(map);
        // Tactile : voir le commentaire sur onTouchDragMove/onTouchDragEnd —
        // touchstart n'est pas traduit en 'mousedown' par Leaflet pour un
        // calque, câblage direct sur l'élément DOM nécessaire.
        const el = circle.getElement();
        if (el) {
          L.DomEvent.on(el, 'touchstart', function (e) {
            e.preventDefault();
            handlers.mousedown?.(circle, ptIdx, e);
          });
        }
        targetLayers.push(circle);
      });
    }

    function renderSegmentHandlesForRing(pts, targetLayers, onClick) {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const mid = midPx(a, b);
        const midCopy = [...mid];
        const marker = L.circleMarker(pxToLatLng(mid[0], mid[1]), { ...HANDLE_SEGMENT, interactive: true });
        marker.on('mouseover', function () { this.setStyle({ ...HANDLE_SEGMENT, radius: 6 }); });
        marker.on('mouseout', function () { this.setStyle(HANDLE_SEGMENT); });
        marker.on('click', function (e) {
          L.DomEvent.stopPropagation(e);
          onClick(i, midCopy, this, e);
        });
        marker.addTo(map);
        targetLayers.push(marker);
      }
    }

    function renderHandles() {
      clearHandles();
      if (!selectedZoneId) return;
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      if (!contour) return;

      renderPointHandlesForRing(contour, handleLayers, {
        mouseover(marker, ptIdx) {
          if (!draggingHandle) marker.setStyle(HANDLE_HOVER);
          updatePtInfo(ptIdx);
        },
        mouseout(marker, ptIdx) {
          if (!draggingHandle || draggingHandle.ptIdx !== ptIdx) {
            marker.setStyle(HANDLE_NORMAL);
          }
          clearPtInfo();
        },
        mousedown(marker, ptIdx, e) {
          if (currentTool !== 'select') return;
          L.DomEvent.stopPropagation(e);
          startDrag(ptIdx, marker);
        },
        click(marker, ptIdx, e) {
          L.DomEvent.stopPropagation(e);
          if (currentTool === 'erase') {
            erasePoint(ptIdx);
          }
        },
      });
    }

    function updatePtInfo(ptIdx) {
      const pt = zonesEdit[selectedZoneId][selectedContourIdx][ptIdx];
      const el = document.getElementById('info-pt-selected');
      el.textContent = `pt ${ptIdx} → [${pt[0]}, ${pt[1]}]`;
      el.style.visibility = 'visible';
    }
    function clearPtInfo() {
      if (draggingHandle) return;
      const el = document.getElementById('info-pt-selected');
      el.textContent = '\u00a0'; // espace insécable — préserve la hauteur
      el.style.visibility = 'hidden';
    }

    // ─── Drag & Drop d'un point ───────────────────────────────────
    function startDrag(ptIdx, marker) {
      pushUndo('Deplacer point');
      draggingHandle = { ptIdx, marker };
      map.dragging.disable();
    }

    function onDragMove(e) {
      // Géo-Terres : drag d'un point de zone terrestre
      if (draggingHandle) {
        const [nx, ny] = latLngToPx(e.latlng);
        const contour = zonesEdit[selectedZoneId][selectedContourIdx];
        contour[draggingHandle.ptIdx] = [nx, ny];
        draggingHandle.marker.setLatLng(pxToLatLng(nx, ny));
        updatePolyLatLngs(selectedZoneId, selectedContourIdx);
        updatePtInfo(draggingHandle.ptIdx);
        updatePanel(); // superficie mise à jour en temps réel
        return;
      }
    }

    function onDragEnd(e) {
      // TOPOGRAPHIE — Géo (territoire ou haut-fond, pipeline unifié)
      if (draggingHandle) {
        map.dragging.enable();
        const [nx, ny] = latLngToPx(e.latlng);
        const contour = zonesEdit[selectedZoneId][selectedContourIdx];
        contour[draggingHandle.ptIdx] = [nx, ny];
        updatePolyLatLngs(selectedZoneId, selectedContourIdx);
        updateExport();
        draggingHandle = null;
        return;
      }
    }

    // ─── Drag & Drop d'un point — tactile ──────────────────────────
    // Convertit le point de contact en {latlng} et délègue à onDragMove/
    // onDragEnd : même logique que la souris, seule l'extraction des
    // coordonnées de l'événement diffère (touches[]/changedTouches[] au
    // lieu de clientX/clientY directs sur l'événement).
    function touchEventToLatLng(touch) {
      return map.mouseEventToLatLng({ clientX: touch.clientX, clientY: touch.clientY });
    }

    function onTouchDragMove(e) {
      if (!draggingHandle) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      onDragMove({ latlng: touchEventToLatLng(touch) });
    }

    function onTouchDragEnd(e) {
      if (!draggingHandle) return;
      e.preventDefault();
      const touch = e.changedTouches[0];
      if (!touch) {
        // Filet de sécurité : pas de point de contact final rapporté,
        // annuler proprement plutôt que bloquer draggingHandle indéfiniment.
        map.dragging.enable();
        draggingHandle = null;
        return;
      }
      onDragEnd({ latlng: touchEventToLatLng(touch) });
    }

    function updatePolyLatLngs(zoneId, contourIdx) {
      // oceanBounds : un seul L.polygon pour tous les anneaux de l'entité
      // (voir renderOceanBoundsZone) — reconstruire l'ensemble des anneaux,
      // pas seulement celui en cours d'édition.
      if (isOceanBoundsId(zoneId)) {
        if (zoneLayers[zoneId] && zoneLayers[zoneId][0]) {
          zoneLayers[zoneId][0].setLatLngs(zonesEdit[zoneId].map(contourToLatLngs));
        }
        return;
      }

      const contour = zonesEdit[zoneId][contourIdx];
      const polyIdx = contourIdx; // 1:1
      if (zoneLayers[zoneId] && zoneLayers[zoneId][polyIdx]) {
        zoneLayers[zoneId][polyIdx].setLatLngs(contourToLatLngs(contour));
      }
    }

    // Code mort — édition Géo-Mers (drag/insert/erase/split de courants et
    // hauts-fonds via un pipeline séparé). Un haut-fond est désormais un
    // polygone comme un autre, édité via le pipeline générique ci-dessus
    // (onDragMove/onDragEnd/renderHandles), avec draw/insert/erase/split
    // disponibles sans restriction ("un polygone est un polygone").

    // ═══════════════════════════════════════════════════════════
    // MARQUEURS DE SEGMENTS (mode insert)
    // ═══════════════════════════════════════════════════════════
    function clearSegmentMarkers() {
      segmentMarkers.forEach(m => map.removeLayer(m));
      segmentMarkers = [];
    }

    function renderSegmentMarkers() {
      clearSegmentMarkers();
      if (!selectedZoneId) return;
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      if (!contour || contour.length < 2) return;

      renderSegmentHandlesForRing(contour, segmentMarkers, (afterIdx, mid) => {
        insertPoint(afterIdx, mid);
      });
    }

    function insertPoint(afterIdx, pt) {
      pushUndo('Inserer point');
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      contour.splice(afterIdx + 1, 0, [Math.round(pt[0]), Math.round(pt[1])]);
      refresh(R.SELECTED_ZONE | R.HANDLES | R.SEGMENTS | R.PANEL | R.EXPORT);
    }

    // ═══════════════════════════════════════════════════════════
    // SUPPRIMER UN POINT
    // ═══════════════════════════════════════════════════════════
    function erasePoint(ptIdx) {
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      if (contour.length <= 3) {
        alert('Un contour doit avoir au moins 3 points. Utilisez "Supprimer ce contour" pour le retirer entièrement.');
        return;
      }
      pushUndo('Supprimer point');
      contour.splice(ptIdx, 1);
      refreshAfterZoneEdit();
    }

    // ═══════════════════════════════════════════════════════════
    // SUPPRIMER UN CONTOUR ENTIER
    // ═══════════════════════════════════════════════════════════
    function deleteContour() {
      if (!selectedZoneId) return;
      const contours = zonesEdit[selectedZoneId];
      if (contours.length <= 1) {
        alert('Cette zone n\'a qu\'un seul contour. Pour supprimer la zone entière, éditez zones-data.js manuellement.');
        return;
      }
      pushUndo('Supprimer contour');
      contours.splice(selectedContourIdx, 1);
      zonesMeta[selectedZoneId]?.splice(selectedContourIdx, 1);
      selectedContourIdx = Math.min(selectedContourIdx, contours.length - 1);
      clearHandles();
      refreshAfterZoneEdit();
    }

    // ═══════════════════════════════════════════════════════════
    // TRACÉ D'UN NOUVEAU CONTOUR
    // ═══════════════════════════════════════════════════════════
    function startDrawMode() {
      drawPoints = [];
      if (drawLayer) { map.removeLayer(drawLayer); drawLayer = null; }
      drawMarkers.forEach(m => map.removeLayer(m));
      drawMarkers = [];
      document.getElementById('draw-badge').style.display = 'block';
      document.getElementById('draw-controls').style.display = 'block';
      updateDrawCount();
    }

    function addDrawPoint(pt) {
      drawPoints.push([Math.round(pt[0]), Math.round(pt[1])]);

      // Ajouter un petit marqueur
      const m = L.circleMarker(pxToLatLng(pt[0], pt[1]), {
        radius: 4, color: 'rgba(80,180,120,0.9)', weight: 1.5,
        fillColor: 'rgba(80,180,120,0.3)', fillOpacity: 1, interactive: false
      }).addTo(map);
      drawMarkers.push(m);

      // Mettre à jour la polyline de preview
      if (drawLayer) map.removeLayer(drawLayer);
      if (drawPoints.length >= 2) {
        const pts = [...drawPoints, drawPoints[0]]; // fermer visuellement
        drawLayer = L.polyline(pts.map(([x, y]) => pxToLatLng(x, y)), {
          color: 'rgba(80,180,120,0.8)', weight: 1.5, dashArray: '6 4', interactive: false
        }).addTo(map);
      }
      updateDrawCount();
    }

    function finishDraw() {
      if (drawPoints.length < 3) {
        alert('Un contour nécessite au moins 3 points.');
        return;
      }
      if (!selectedZoneId) {
        // Pas de zone sélectionnée → ouvrir la popup de rattachement
        const pts = drawPoints.map(p => [...p]);
        cancelDraw(true);
        openAttachModal(pts);
        return;
      }
      pushUndo('Ajouter contour');
      zonesEdit[selectedZoneId].push(drawPoints.map(p => [...p]));
      zonesMeta[selectedZoneId] ??= [];
      // oceanBounds : un nouveau contour tracé est nécessairement un trou (île) —
      // l'unique extérieur est déjà en place à l'index 0. Rôle posé en dur tout
      // de suite, pas laissé null (voir contourRole()).
      zonesMeta[selectedZoneId].push(isOceanBoundsId(selectedZoneId) ? { role: 'hole' } : null);
      cancelDraw(true);
      selectedContourIdx = zonesEdit[selectedZoneId].length - 1;
      refreshAfterZoneEdit();
    }

    function cancelDraw(silent) {
      drawPoints = [];
      if (drawLayer) { map.removeLayer(drawLayer); drawLayer = null; }
      drawMarkers.forEach(m => map.removeLayer(m));
      drawMarkers = [];
      document.getElementById('draw-badge').style.display = 'none';
      document.getElementById('draw-controls').style.display = 'none';
      if (!silent) setTool('select');
    }

    function updateDrawCount() {
      document.getElementById('draw-pt-count').textContent = `${drawPoints.length} point(s) posé(s)`;
    }
