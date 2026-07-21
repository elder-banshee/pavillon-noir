    'use strict';

    // OCÉANOGRAPHIE — grille OSCAR, cellules, vecteurs et édition par lots.

    function oscarNavigationTypes(cell) {
      const valid = new Set(['fluviale', 'cotiere', 'hauturiere']);
      const types = Array.isArray(cell?.naturesNav)
        ? cell.naturesNav.filter(type => valid.has(type))
        : (valid.has(cell?.natureNav) ? [cell.natureNav] : ['hauturiere']);
      return [...new Set(types)];
    }

    function oscarNavigationValue(cell) {
      if (!cell?.natureNav && !Array.isArray(cell?.naturesNav)) return '';
      return oscarNavigationTypes(cell).sort().join('+');
    }

    function oscarNavigationCategory(cell) {
      if (!cell?.natureNav && !Array.isArray(cell?.naturesNav)) return 'non-renseigne';
      const types = oscarNavigationTypes(cell);
      return types.length > 1 ? 'multiple' : (types[0] || 'non-renseigne');
    }

    const OSCAR_NAVIGATION_LABELS = {
      hauturiere: 'Haute-mer',
      cotiere: 'Côtière',
      fluviale: 'Fluviale',
      multiple: 'Multiple',
      'non-renseigne': 'Non renseignée',
    };

    function oscarNatureFilterMatches(cell) {
      const selected = oscarGridFilters.nature;
      if (!selected.size) return true;
      const category = oscarNavigationCategory(cell);
      if (category === 'non-renseigne') return selected.has(category);
      const types = oscarNavigationTypes(cell);
      return (types.length > 1 && selected.has('multiple'))
        || types.some(type => selected.has(type));
    }

    function oscarDisplayedNatureCategory(cell) {
      const category = oscarNavigationCategory(cell);
      if (category !== 'multiple') return category;
      const selected = oscarGridFilters.nature;
      if (!selected.size || selected.has('multiple')) return 'multiple';
      const displayedTypes = oscarNavigationTypes(cell).filter(type => selected.has(type));
      return displayedTypes.length > 1 ? 'multiple' : (displayedTypes[0] || 'multiple');
    }

    function hasOscarMainCurrentData(cell) {
      if (!cell) return false;
      if (cell.source === 'calm' && oscarCellSpeed(cell) === 0
        && !(Number(cell.sources) > 0) && !(Number(cell.sourceCells) > 0)) return false;
      return cell.source === 'manual'
        || cell.calmeRenseigne === true
        || Number(cell.sources) > 0
        || Number(cell.sourceCells) > 0
        || oscarCellSpeed(cell) > 0
        || (cell.source && cell.source !== 'calm');
    }

    function oscarCurrentCategory(cell) {
      if (hasOscarCoastalCurrent(cell)) return 'double';
      return hasOscarMainCurrentData(cell) ? 'renseigne' : 'non-renseigne';
    }

    function oscarFluvialCurrents(cell) {
      return Array.isArray(cell?.fluvialCurrents)
        ? cell.fluvialCurrents.filter(current => current && typeof current === 'object')
        : [];
    }

    function hasOscarFluvialCurrent(cell) {
      return oscarFluvialCurrents(cell).length > 0;
    }

    function oscarCurrentFilterMatches(cell) {
      const selected = oscarGridFilters.current;
      if (!selected.size) return true;
      return selected.has(oscarCurrentCategory(cell))
        || (hasOscarFluvialCurrent(cell) && selected.has('fluvial'));
    }

    function seaCellStyle(key) {
      const selected = key === selectedSeaCellKey;
      const inBatch = selectedOceanCellKeys.has(key);
      const cell = getOscarGrid()?.cells?.[key];
      const sessionEdited = oscarSessionEditsVisible && sessionEditedOceanCellKeys.has(key);
      const coastal = hasOscarCoastalCurrent(cell);
      const highlighted = selected || inBatch;
      return {
        pane: 'seaCellPane',
        color: coastal
          ? 'rgba(94, 234, 212, 0.95)'
            : sessionEdited
              ? 'rgba(245, 158, 11, 0.98)'
              : selected
                ? 'rgba(80,200,120,0.95)'
                : inBatch
                  ? 'rgba(125, 180, 255, 0.92)'
                  : 'rgba(70,170,210,0.65)',
        weight: coastal || sessionEdited ? 3 : (selected ? 2.5 : (inBatch ? 2 : 1)),
        fillColor: highlighted ? 'rgba(60,180,100,0.30)' : 'transparent',
        fillOpacity: highlighted ? 1 : 0,
        interactive: false,
      };
    }

    function renderOceanMaskLayer() {
      if (oceanMaskLayer) return;
      const bounds = L.latLngBounds(pxToLatLng(0, IMG_H), pxToLatLng(IMG_W, 0));
      oceanMaskLayer = L.imageOverlay(OCEAN_MASK_SRC, bounds, {
        opacity: 0.78,
        interactive: false,
      }).addTo(map);
    }

    function clearOceanMaskLayer() {
      if (!oceanMaskLayer) return;
      map.removeLayer(oceanMaskLayer);
      oceanMaskLayer = null;
    }

    function getOscarGrid() {
      if (customOscarGrid?.cells) return customOscarGrid;
      if (typeof OSCAR_HEX_GRID !== 'undefined' && OSCAR_HEX_GRID?.cells) return OSCAR_HEX_GRID;
      if (window.OSCAR_HEX_GRID?.cells) return window.OSCAR_HEX_GRID;
      throw new Error('OSCAR_HEX_GRID indisponible : ../js/oscar-hex-grid.js doit être chargé avant Zone Editor.');
    }

    // Recalcule le plafond du dégradé vitesse (vitesse max réelle des
    // cellules non-calmes) — chaque checkpoint a sa propre distribution, un
    // plafond fixe n'a pas de sens dès qu'on compare plusieurs grilles
    // générées par des méthodes différentes. Le vrai maximum est utilisé
    // plutôt qu'un percentile (p99 auparavant) : tronquer le plafond sous le
    // maximum réel fait que toutes les cellules au-delà affichent la même
    // couleur, quelle que soit leur vitesse réelle — une perte d'information
    // silencieuse, justement ce qu'on veut éviter.
    function recomputeOscarSpeedColorCap(grid) {
      const speeds = Object.values(grid.cells || {})
        .filter(cell => !isOscarCalmCell(cell))
        .map(cell => oscarCellSpeed(cell))
        .filter(speed => speed > 0)
        .sort((a, b) => a - b);
      if (!speeds.length) { oscarSpeedColorCap = 2.9; return; }
      const max = speeds[speeds.length - 1];
      oscarSpeedColorCap = Math.max(0.5, Math.round(max * 100) / 100);
    }

    function oscarHexCenter(q, r, grid) {
      const width = Number(grid.widthPx);
      const radius = Number(grid.radiusPx);
      const spacingY = Number(grid.centerSpacingPx?.y);
      if (!Number.isFinite(width) || !Number.isFinite(radius) || !Number.isFinite(spacingY)) return null;
      const offset = (r & 1) ? width / 2 : 0;
      return {
        x: width / 2 + offset + q * width,
        y: radius + r * spacingY,
      };
    }

    function oscarHexKeyFromPoint(point, grid) {
      const width = Number(grid.widthPx);
      const radius = Number(grid.radiusPx);
      const spacingY = Number(grid.centerSpacingPx?.y);
      if (!Number.isFinite(width) || !Number.isFinite(radius) || !Number.isFinite(spacingY)) return null;
      const approxR = Math.round((point.y - radius) / spacingY);
      let best = null;
      for (let dr = -2; dr <= 2; dr += 1) {
        const r = approxR + dr;
        if (r < 0) continue;
        const offset = (r & 1) ? width / 2 : 0;
        const approxQ = Math.round((point.x - width / 2 - offset) / width);
        for (let dq = -2; dq <= 2; dq += 1) {
          const q = approxQ + dq;
          if (q < 0) continue;
          const candidateKey = `${r}_${q}`;
          if (!grid.cells[candidateKey]) continue;
          const center = oscarHexCenter(q, r, grid);
          if (!center) continue;
          const distancePx = Math.hypot(point.x - center.x, point.y - center.y);
          if (!best || distancePx < best.distancePx) best = { key: candidateKey, distancePx };
        }
      }
      return best?.key || null;
    }

    // Résout directement un point pixel vers une clé de cellule OSCAR (hex ou
    // carrée), sans passer par l'ancienne grille SEA_CELL. Utilisée par le
    // clic carte en Sémaphore et en Infos — Mers.
    function oscarKeyFromPoint(point) {
      const grid = getOscarGrid();
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      return oscarHexKeyFromPoint(point, grid);
    }

    function oscarCellCenterFromKey(key, cell = null) {
      const grid = getOscarGrid();
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      const x = Number(cell?.x);
      const y = Number(cell?.y);
      if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
      const [r, q] = key.split('_').map(Number);
      const center = oscarHexCenter(q, r, grid);
      if (!center) throw new Error(`Cellule OSCAR hex invalide : ${key}`);
      return center;
    }

    function oscarCellLatLngsFromKey(key, cell = null, radiusScale = 1) {
      const grid = getOscarGrid();
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      const center = oscarCellCenterFromKey(key, cell);
      const radius = (Number(grid.radiusPx) || SEA_CELL_SIZE / 2) * radiusScale;
      return Array.from({ length: 6 }, (_, i) => {
        const angle = (-90 + i * 60) * Math.PI / 180;
        return pxToLatLng(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
      });
    }

    function oscarCellSpeed(cell) {
      const speed = Number(cell?.speedKnot ?? Math.hypot(Number(cell?.xKnot) || 0, Number(cell?.yKnot) || 0));
      return Number.isFinite(speed) ? speed : 0;
    }

    function isOscarManualCell(cell) {
      return cell?.source === 'manual';
    }

    function isOscarCalmCell(cell) {
      return cell?.source === 'calm' || cell?.calme === true;
    }

    function hasOscarCoastalCurrent(cell) {
      return !!cell?.coastal;
    }

    function oscarCellSourceLabel(cell) {
      if (isOscarCalmCell(cell)) return 'calme';
      return isOscarManualCell(cell) ? 'manuel' : 'Copernicus';
    }

    function oscarVectorFromSpeedDir(speedKnot, dirToDeg) {
      const speed = Math.max(0, Number(speedKnot) || 0);
      const dir = normalizeAngle(Number(dirToDeg) || 0);
      const rad = dir * Math.PI / 180;
      return {
        xKnot: Math.round(Math.cos(rad) * speed * 1000) / 1000,
        yKnot: Math.round(Math.sin(rad) * speed * 1000) / 1000,
        speedKnot: Math.round(speed * 1000) / 1000,
        dirToDeg: Math.round(dir * 10) / 10,
      };
    }

    function oscarCellMainVector(cell) {
      return {
        xKnot: cell?.xKnot,
        yKnot: cell?.yKnot,
        speedKnot: cell?.speedKnot,
        dirToDeg: cell?.dirToDeg,
      };
    }

    function oscarCellTransferData(cell) {
      const out = oscarCellMainVector(cell);
      if (cell?.coastal) out.coastal = oscarCellMainVector(cell.coastal);
      if (hasOscarFluvialCurrent(cell)) {
        out.fluvialCurrents = oscarFluvialCurrents(cell).map(current => ({ ...current }));
      }
      return out;
    }

    function rememberOriginalOscarCell(cell) {
      if (!cell || cell._copernicusOriginal) return;
      Object.defineProperty(cell, '_copernicusOriginal', {
        value: oscarCellMainVector(cell),
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }

    function oscarNeighborKeys(key) {
      const [r, q] = String(key || '').split('_').map(Number);
      if (!Number.isFinite(q) || !Number.isFinite(r)) return [];
      const offsets = (r & 1)
        ? [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]]
        : [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]];
      return offsets.map(([dq, dr]) => `${r + dr}_${q + dq}`);
    }

    function inferOscarCellDomain(key) {
      const grid = getOscarGrid();
      if (!grid?.cells) return oscarGridDomainFilter || 'manual';
      const counts = new Map();
      oscarNeighborKeys(key).forEach(neighborKey => {
        const domain = grid.cells[neighborKey]?.domain;
        if (!domain) return;
        counts.set(domain, (counts.get(domain) || 0) + 1);
      });
      if (counts.size) return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return oscarGridDomainFilter || 'manual';
    }

    function oscarKeyParts(key) {
      const [r, q] = String(key || '').split('_').map(Number);
      return {
        r: Number.isFinite(r) ? r : Number.MAX_SAFE_INTEGER,
        q: Number.isFinite(q) ? q : Number.MAX_SAFE_INTEGER,
      };
    }

    function compareOscarKeys(a, b) {
      const pa = oscarKeyParts(a);
      const pb = oscarKeyParts(b);
      return (pa.r - pb.r) || (pa.q - pb.q) || String(a).localeCompare(String(b));
    }

    function orderedOscarKeys(keys) {
      return [...keys].sort(compareOscarKeys);
    }

    function oscarKeyToAxial(key) {
      const [r, q] = String(key || '').split('_').map(Number);
      if (!Number.isFinite(r) || !Number.isFinite(q)) return null;
      return {
        q: q - ((r - (r & 1)) / 2),
        r,
      };
    }

    function oscarAxialToKey(axial) {
      const r = Number(axial?.r);
      const aq = Number(axial?.q);
      if (!Number.isFinite(r) || !Number.isFinite(aq)) return null;
      const q = aq + ((r - (r & 1)) / 2);
      if (!Number.isInteger(r) || !Number.isInteger(q) || r < 0 || q < 0) return null;
      return `${r}_${q}`;
    }

    function oscarRelativeOffset(key, anchorKey) {
      const cell = oscarKeyToAxial(key);
      const anchor = oscarKeyToAxial(anchorKey);
      if (!cell || !anchor) return { q: 0, r: 0 };
      return {
        q: cell.q - anchor.q,
        r: cell.r - anchor.r,
      };
    }

    function oscarKeyAtRelativeOffset(anchorKey, offset) {
      const anchor = oscarKeyToAxial(anchorKey);
      if (!anchor) return null;
      return oscarAxialToKey({
        q: anchor.q + Number(offset?.q || 0),
        r: anchor.r + Number(offset?.r || 0),
      });
    }

    // Les 6 décalages axiaux standards autour d'une cellule hexagonale.
    const OSCAR_AXIAL_NEIGHBOR_OFFSETS = [
      { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
      { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
    ];

    function oscarHexNeighborKeys(key) {
      return OSCAR_AXIAL_NEIGHBOR_OFFSETS
        .map(offset => oscarKeyAtRelativeOffset(key, offset))
        .filter(Boolean);
    }

    function oscarCellGeometryForKey(key) {
      const grid = getOscarGrid();
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      const [r, q] = String(key || '').split('_').map(Number);
      const center = oscarHexCenter(q, r, grid);
      if (!center) throw new Error(`Cellule OSCAR hex invalide : ${key}`);
      return {
        q,
        r,
        x: Math.round(center.x * 100) / 100,
        y: Math.round(center.y * 100) / 100,
      };
    }

    // Retourne l'angle d'affichage d'un vecteur, ou null si la cellule n'en
    // porte aucun. La magnitude prime sur dirToDeg : à vecteur nul, dirToDeg
    // n'a aucun sens physique — or les données réelles portent souvent
    // dirToDeg: 0 (littéral) sur les cellules calmes, pas seulement null.
    // Se fier uniquement à dirToDeg ferait donc passer la quasi-totalité des
    // cellules calmes pour un vecteur orienté plein Est.
    function oscarCellDisplayAngle(cell, vectorKey = null) {
      const vector = vectorKey ? cell?.[vectorKey] : cell;
      const x = Number(vector?.xKnot);
      const y = Number(vector?.yKnot);
      const hasVector = Number.isFinite(x) && Number.isFinite(y) && (x !== 0 || y !== 0);
      if (!hasVector) return null;
      const dirToDeg = vector?.dirToDeg;
      if (dirToDeg !== null && dirToDeg !== undefined && Number.isFinite(Number(dirToDeg))) {
        return normalizeAngle(Number(dirToDeg) + 90);
      }
      return normalizeAngle(Math.atan2(y, x) * 180 / Math.PI + 90);
    }

    function oscarFluvialArrowPoint(center, index, count) {
      const grid = getOscarGrid();
      const radius = Number(grid.radiusPx) || SEA_CELL_SIZE / 2;
      const spacing = Math.max(6, Math.min(10, radius * 0.28));
      return {
        x: center.x,
        y: center.y + radius * 0.42 + (index - (count - 1) / 2) * spacing,
      };
    }

    function oscarArrowPoint(center, key, side) {
      if (side === 'center') return { x: center.x, y: center.y };
      const sign = side === 'coastal' ? 1 : -1;
      const grid = getOscarGrid();
      const offset = Math.max(8, Math.min(18, (Number(grid.radiusPx) || SEA_CELL_SIZE / 2) * 0.22));
      const nearestCoast = window.NavigationJaillot?.coteLaPlusProchePoint?.({ x: center.x, y: center.y });
      const coastPoint = nearestCoast?.point;
      let angle;
      if (coastPoint && Number.isFinite(Number(coastPoint.x)) && Number.isFinite(Number(coastPoint.y))) {
        angle = Math.atan2(Number(coastPoint.y) - center.y, Number(coastPoint.x) - center.x);
      } else {
        const [q] = String(key || '').split('_').map(Number);
        angle = (Number.isFinite(q) && q % 2 ? 30 : -30) * Math.PI / 180;
      }
      return {
        x: center.x + Math.cos(angle) * offset * sign,
        y: center.y + Math.sin(angle) * offset * sign,
      };
    }

    function interpolateRgb(a, b, t) {
      return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
      ];
    }

    // Le premier palier est ancré sur OSCAR_CALM_COLOR (source unique) pour
    // qu'une cellule à vitesse nulle rende exactement la même couleur, quelle
    // que soit son origine (calme générée, Copernicus à 0.00 nd, manuelle...).
    //
    // 15 nuances (5 familles de 3 : bleu/vert/jaune/orange/rouge), réparties
    // sur des tranches de VITESSE RÉELLE croissantes (nd), pas des percentiles
    // de population — vérifié sur la grille réelle (10 634 cellules) qu'un
    // calage par percentile de population tasserait les 14 paliers entre
    // t=0.02 et t=0.29 (62 % des cellules sont sous 0.4 nd, 89 % sous 1 nd),
    // laissant tout l'écart 1.2 → 4.26 nd dans une seule teinte de rouge —
    // l'inverse de l'objectif. Les tranches s'élargissent donc vers le haut,
    // pour que les vitesses élevées (rares mais réparties sur un grand
    // intervalle) restent visuellement distinguables entre elles.
    function oscarSpeedColor(speed) {
      const stops = [
        { at: 0.0000, rgb: OSCAR_CALM_COLOR },  // 0.00 nd — ancrage calme
        { at: 0.0352, rgb: [20, 60, 130] },     // 0.15 nd
        { at: 0.0704, rgb: [20, 110, 175] },    // 0.30 nd
        { at: 0.1056, rgb: [15, 140, 130] },    // 0.45 nd
        { at: 0.1408, rgb: [40, 165, 90] },     // 0.60 nd
        { at: 0.1878, rgb: [120, 190, 60] },    // 0.80 nd
        { at: 0.2347, rgb: [190, 205, 40] },    // 1.00 nd
        { at: 0.2934, rgb: [230, 210, 30] },    // 1.25 nd
        { at: 0.3521, rgb: [240, 175, 20] },    // 1.50 nd
        { at: 0.4108, rgb: [240, 145, 15] },    // 1.75 nd
        { at: 0.4930, rgb: [230, 110, 10] },    // 2.10 nd
        { at: 0.5869, rgb: [220, 80, 15] },     // 2.50 nd
        { at: 0.6808, rgb: [215, 60, 20] },     // 2.90 nd
        { at: 0.8333, rgb: [225, 35, 20] },     // 3.55 nd
        { at: 1.0000, rgb: [235, 15, 15] },     // 4.26 nd (plafond réel)
      ];
      const t = Math.max(0, Math.min(1, speed / oscarSpeedColorCap));
      for (let i = 1; i < stops.length; i++) {
        if (t <= stops[i].at) {
          const prev = stops[i - 1];
          const localT = (t - prev.at) / (stops[i].at - prev.at);
          return interpolateRgb(prev.rgb, stops[i].rgb, localT);
        }
      }
      return stops[stops.length - 1].rgb;
    }

    // Couleur de l'égaliseur : isole visuellement une bande de vitesse.
    // d=0 (au centre de la cible) -> rose vif ; d=1 (au bord de la bande et
    // au-delà) -> bleu nuit (OSCAR_CALM_COLOR), par interpolation continue
    // via un palier intermédiaire mauve/violet à mi-bande. Le nombre de
    // teintes perceptibles suit naturellement la largeur de bande choisie,
    // sans logique conditionnelle supplémentaire.
    const OSCAR_EQ_PINK = [255, 20, 147];
    const OSCAR_EQ_PURPLE = [140, 40, 200];
    function oscarEqColor(speed) {
      if (!(oceanEqBandwidth > 0)) return OSCAR_CALM_COLOR;
      const d = Math.max(0, Math.min(1, Math.abs(speed - oceanEqTargetSpeed) / oceanEqBandwidth));
      return d <= 0.5
        ? interpolateRgb(OSCAR_EQ_PINK, OSCAR_EQ_PURPLE, d / 0.5)
        : interpolateRgb(OSCAR_EQ_PURPLE, OSCAR_CALM_COLOR, (d - 0.5) / 0.5);
    }

    // Rendu unifié : la couleur ne dépend que de la vitesse (oscarSpeedColor),
    // jamais de l'origine de la cellule. Une cellule calme générée et une
    // cellule Copernicus à 0.00 nd doivent rendre exactement la même teinte —
    // sinon on lit visuellement deux vitesses différentes là où il n'y en a
    // qu'une. La section de filtres « Courants » permet d'isoler séparément
    // les données renseignées, doubles et absentes.
    function oscarCellStyle(cell) {
      const showNature = oscarGridFilters.nature.size > 0;
      const showCurrent = oscarGridFilters.current.size > 0;
      const speed = oscarCellSpeed(cell);
      const [r, g, b] = oceanEqActive ? oscarEqColor(speed) : oscarSpeedColor(speed);
      const intensity = Math.max(0.3, Math.min(1, speed / oscarSpeedColorCap));
      // Bordure distincte pour les cellules taguées fluviale/côtière (REPRISE_74) :
      // la teinte de remplissage reste celle de la vitesse de courant, seule la
      // bordure signale la classification de navigation, pour ne pas se
      // substituer visuellement au dégradé de vitesse déjà en place.
      const natureCategory = oscarDisplayedNatureCategory(cell);
      const zoom = Number(map?.getZoom()) || 0;
      const natureWeight = Math.max(1.1, Math.min(5.2, 1.1 + (zoom + 2) * 0.68));
      const natureBordure = natureCategory === 'multiple' ? '#c79cf2'
        : natureCategory === 'fluviale' ? '#8fd0a6'
        : natureCategory === 'cotiere' ? '#7db8e8'
        : natureCategory === 'hauturiere' ? '#24558f'
        : 'rgba(118, 126, 140, 0.58)';
      return {
        pane: 'oscarGridPane',
        className: 'oscar-grid-cell',
        color: showNature ? natureBordure : 'transparent',
        weight: showNature
          ? (natureCategory === 'non-renseigne' ? natureWeight * 0.45
            : (natureCategory === 'multiple' ? natureWeight * 1.2 : natureWeight))
          : 0,
        fillColor: `rgba(${r}, ${g}, ${b}, ${0.42 + intensity * 0.38})`,
        fill: showCurrent,
        fillOpacity: showCurrent ? 1 : 0,
        interactive: false,
      };
    }

    function filteredOscarEntries() {
      const grid = getOscarGrid();
      if (!grid) return [];
      return Object.entries(grid.cells)
        .filter(([, cell]) => !oscarGridDomainFilter || cell.domain === oscarGridDomainFilter)
        .filter(([, cell]) => oscarNatureFilterMatches(cell))
        .filter(([, cell]) => oscarCurrentFilterMatches(cell));
    }

    function clearOscarGridLayer() {
      if (oscarGridLayer) { map.removeLayer(oscarGridLayer); oscarGridLayer = null; }
      if (oscarArrowLayer) { map.removeLayer(oscarArrowLayer); oscarArrowLayer = null; }
    }

    function oscarArrowSvgPath(point, angleDeg, size, className = '') {
      const safeX = Math.round(Number(point.x) * 100) / 100;
      const safeY = Math.round(Number(point.y) * 100) / 100;
      const safeAngle = Math.round(Number(angleDeg) * 10) / 10;
      const safeSize = Math.round(Number(size) * 100) / 100;
      return [
        `<g class="oscar-arrow ${className}" transform="translate(${safeX} ${safeY}) rotate(${safeAngle}) scale(${safeSize})">`,
        '<path d="M 0 0.52 L 0 -0.42 M -0.22 -0.18 L 0 -0.42 L 0.22 -0.18"/>',
        '</g>',
      ].join('');
    }

    function renderOscarArrowLayer(entries) {
      if (!oscarGridArrowsVisible || !oscarGridFilters.current.size) return;
      const grid = getOscarGrid();
      const radius = Number(grid.radiusPx) || SEA_CELL_SIZE / 2;
      const size = Math.max(16, Math.min(30, radius * 0.42));
      const coastalSize = size * 0.86;
      const fluvialSize = size * 0.72;
      const arrows = [];
      entries.forEach(([key, cell]) => {
        const center = oscarCellCenterFromKey(key, cell);
        const hasCoastal = hasOscarCoastalCurrent(cell);
        const mainAngle = oscarCellDisplayAngle(cell);
        if (mainAngle !== null) {
          const mainPoint = oscarArrowPoint(center, key, hasCoastal ? 'copernicus' : 'center');
          arrows.push(oscarArrowSvgPath(mainPoint, mainAngle, size));
        }
        if (hasCoastal) {
          const coastalAngle = oscarCellDisplayAngle(cell, 'coastal');
          if (coastalAngle !== null) {
            const coastalPoint = oscarArrowPoint(center, key, 'coastal');
            arrows.push(oscarArrowSvgPath(coastalPoint, coastalAngle, coastalSize, 'coastal'));
          }
        }
        const fluvialCurrents = oscarFluvialCurrents(cell);
        fluvialCurrents.forEach((current, index) => {
          const fluvialAngle = oscarCellDisplayAngle(current);
          if (fluvialAngle === null) return;
          const fluvialPoint = oscarFluvialArrowPoint(center, index, fluvialCurrents.length);
          arrows.push(oscarArrowSvgPath(fluvialPoint, fluvialAngle, fluvialSize, 'fluvial'));
        });
      });
      if (!arrows.length) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', `0 0 ${IMG_W} ${IMG_H}`);
      svg.setAttribute('class', 'oscar-arrow-svg');
      svg.innerHTML = arrows.join('');
      const bounds = L.latLngBounds(pxToLatLng(0, IMG_H), pxToLatLng(IMG_W, 0));
      oscarArrowLayer = L.svgOverlay(svg, bounds, {
        pane: 'oscarArrowPane',
        interactive: false,
      }).addTo(map);
    }

    function renderOscarGridLayer() {
      clearOscarGridLayer();
      if (!map || !(ctx.isSemaphore || ctx.isOcean) || !oscarGridVisible) return;
      const entries = filteredOscarEntries();
      if (!entries.length) return;
      oscarGridLayer = L.layerGroup([], { pane: 'oscarGridPane' }).addTo(map);
      entries.forEach(([key, cell]) => {
        const latLngs = oscarCellLatLngsFromKey(key, cell);
        const mainShape = L.polygon(latLngs, oscarCellStyle(cell));
        mainShape._oscarCell = cell;
        mainShape.addTo(oscarGridLayer);
        if (oscarGridFilters.current.size && hasOscarCoastalCurrent(cell)) {
          const zoom = Number(map?.getZoom()) || 0;
          const doubleWeight = Math.max(0.35, Math.min(1.8, 0.4 + (zoom + 2) * 0.22));
          const doubleShape = L.polygon(oscarCellLatLngsFromKey(key, cell, 0.7), {
            pane: 'oscarGridPane',
            className: 'oscar-grid-cell oscar-grid-cell--double-current',
            color: '#55dff2',
            weight: doubleWeight,
            fill: false,
            interactive: false,
          });
          doubleShape._oscarDoubleCurrent = true;
          doubleShape.addTo(oscarGridLayer);
        }
        if (oscarGridFilters.current.size && hasOscarFluvialCurrent(cell)) {
          const zoom = Number(map?.getZoom()) || 0;
          const fluvialWeight = Math.max(0.45, Math.min(2.1, 0.5 + (zoom + 2) * 0.24));
          const fluvialShape = L.polygon(oscarCellLatLngsFromKey(key, cell, 0.55), {
            pane: 'oscarGridPane',
            className: 'oscar-grid-cell oscar-grid-cell--fluvial-current',
            color: '#34d399',
            weight: fluvialWeight,
            fill: false,
            interactive: false,
          });
          fluvialShape._oscarFluvialCurrent = true;
          fluvialShape.addTo(oscarGridLayer);
        }
      });
      renderOscarArrowLayer(entries);
    }

    function updateOscarGridZoomStyles() {
      if (!oscarGridLayer) return;
      const zoom = Number(map?.getZoom()) || 0;
      const doubleWeight = Math.max(0.35, Math.min(1.8, 0.4 + (zoom + 2) * 0.22));
      const fluvialWeight = Math.max(0.45, Math.min(2.1, 0.5 + (zoom + 2) * 0.24));
      oscarGridLayer.eachLayer(layer => {
        if (layer._oscarDoubleCurrent) layer.setStyle({ weight: doubleWeight });
        else if (layer._oscarFluvialCurrent) layer.setStyle({ weight: fluvialWeight });
        else if (layer._oscarCell) layer.setStyle(oscarCellStyle(layer._oscarCell));
      });
    }

    function populateOscarDomainSelect() {
      const select = document.getElementById('oscar-grid-domain');
      if (!select) return;
      const domains = [...new Set(Object.values(getOscarGrid()?.cells || {}).map(cell => cell.domain).filter(Boolean))].sort();
      select.innerHTML = '<option value="">Tous</option>' + domains
        .map(domain => `<option value="${escapeAttr(domain)}">${escapeHtmlText(OSCAR_DOMAIN_LABELS[domain] || domain)}</option>`)
        .join('');
      select.value = oscarGridDomainFilter;
    }

    function updateOscarSummary() {
      const el = document.getElementById('oscar-grid-summary');
      if (!el) return;
      const grid = getOscarGrid();
      if (!grid) {
        el.innerHTML = '<span>OSCAR :</span> grille indisponible';
        return;
      }
      const entries = filteredOscarEntries();
      const speeds = entries.map(([, cell]) => oscarCellSpeed(cell));
      const max = speeds.length ? Math.max(...speeds) : 0;
      const manualCount = entries.filter(([, cell]) => isOscarManualCell(cell)).length;
      const sessionEditedCount = entries.filter(([key]) => sessionEditedOceanCellKeys.has(key)).length;
      const coastalCount = entries.filter(([, cell]) => hasOscarCoastalCurrent(cell)).length;
      const fluvialCount = entries.filter(([, cell]) => hasOscarFluvialCurrent(cell)).length;
      const missingCurrentCount = entries.filter(([, cell]) => oscarCurrentCategory(cell) === 'non-renseigne').length;
      const domainLabel = oscarGridDomainFilter
        ? (OSCAR_DOMAIN_LABELS[oscarGridDomainFilter] || oscarGridDomainFilter)
        : 'tous domaines';
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      el.innerHTML = `<span>OSCAR :</span> ${entries.length} cellules hex - ${escapeHtmlText(domainLabel)} - max ${max.toFixed(2)} nd - manuel ${manualCount} - session ${sessionEditedCount} - doubles ${coastalCount} - fluviaux ${fluvialCount} - courant principal absent ${missingCurrentCount}`;
    }

    function formatOscarCellForPanel(seaKey) {
      const grid = getOscarGrid();
      const oscarKey = seaKey;
      const cell = oscarKey ? grid?.cells?.[oscarKey] : null;
      if (!cell) return formatMissingOscarCellForPanel(oscarKey);
      const speed = oscarCellSpeed(cell);
      const domain = OSCAR_DOMAIN_LABELS[cell.domain] || cell.domain || 'domaine n/a';
      const nature = oscarNavigationValue(cell)
        ? oscarNavigationTypes(cell).map(type => OSCAR_NAVIGATION_LABELS[type] || type).join(' + ')
        : OSCAR_NAVIGATION_LABELS['non-renseigne'];
      const max = Number.isFinite(Number(cell.maxSpeedKnot)) ? Number(cell.maxSpeedKnot).toFixed(2) : 'n/a';
      const sources = Number.isFinite(Number(cell.sources)) ? Number(cell.sources) : 'n/a';
      const sourceCells = Number.isFinite(Number(cell.sourceCells)) ? ` - cases source ${Number(cell.sourceCells)}` : '';
      const coastal = cell.coastal || null;
      const coastalSpeed = oscarCellSpeed(coastal);
      const fluvialCurrents = oscarFluvialCurrents(cell);
      const fluvialDetails = fluvialCurrents.length
        ? fluvialCurrents.map(current => {
          const currentSpeed = oscarCellSpeed(current);
          const riverId = current.riverId || 'tracé sans identifiant';
          return `<div class="sea-prop"><span>Courant fluvial — ${escapeHtmlText(riverId)} :</span> ${currentSpeed.toFixed(2)} nd (${(currentSpeed * SEA_KNOTS_TO_KMH_EDITOR).toFixed(1)} km/h), direction ${formatMaybeNumber(current.dirToDeg, 1, '°')}</div>`;
        }).join('')
        : '<div class="sea-prop"><span>Courant fluvial :</span> aucun</div>';
      const badges = [
        `<span class="ocean-cell-badge${isOscarManualCell(cell) ? ' manual' : ''}">${oscarCellSourceLabel(cell)}</span>`,
        hasOscarCoastalCurrent(cell) ? '<span class="ocean-cell-badge coastal">courant côtier</span>' : '',
        hasOscarCoastalCurrent(cell) ? '<span class="ocean-cell-badge coastal">courant double</span>' : '',
        hasOscarFluvialCurrent(cell) ? `<span class="ocean-cell-badge fluvial">${fluvialCurrents.length} ${fluvialCurrents.length > 1 ? 'courants fluviaux' : 'courant fluvial'}</span>` : '',
      ].filter(Boolean).join('');
      const actionHtml = oceanCellEditing
        ? formatOscarCellEditForm(cell)
        : oceanCellActionsHtml({ editLabel: 'Éditer' });
      return [
        '<div class="ocean-cell-detail">',
        `<div class="ocean-cell-title">${escapeHtmlText(oscarKey)}${badges}</div>`,
        `<div class="sea-prop"><span>Domaine :</span> ${escapeHtmlText(domain)}</div>`,
        `<div class="sea-prop"><span>Nature :</span> ${escapeHtmlText(nature)}</div>`,
        `<div class="sea-prop"><span>Courant principal :</span> ${speed.toFixed(2)} nd (${(speed * SEA_KNOTS_TO_KMH_EDITOR).toFixed(1)} km/h), direction ${formatMaybeNumber(cell.dirToDeg, 1, '°')}</div>`,
        coastal
          ? `<div class="sea-prop"><span>Courant côtier :</span> ${coastalSpeed.toFixed(2)} nd (${(coastalSpeed * SEA_KNOTS_TO_KMH_EDITOR).toFixed(1)} km/h), direction ${formatMaybeNumber(coastal.dirToDeg, 1, '°')}</div>`
          : '<div class="sea-prop"><span>Courant côtier :</span> aucun</div>',
        fluvialDetails,
        `<div class="sea-prop"><span>Données source :</span> max observé ${escapeHtmlText(max)} nd - ${escapeHtmlText(sources)} mesure(s)${escapeHtmlText(sourceCells)}</div>`,
        actionHtml,
        '</div>',
      ].join('');
    }

    function oceanCellActionsHtml({ editLabel = 'Éditer' } = {}) {
      return [
        '<div class="ocean-cell-actions">',
        `<button type="button" class="tool-btn" data-ocean-action="edit">${escapeHtmlText(editLabel)}</button>`,
        '</div>',
      ].join('');
    }

    function formatMissingOscarCellForPanel(oscarKey) {
      if (!oscarKey) return '<span>Cellule OSCAR :</span> aucune';
      return [
        '<div class="ocean-cell-detail">',
        `<div class="ocean-cell-title">${escapeHtmlText(oscarKey)}<span class="ocean-cell-badge">trou</span></div>`,
        '<div class="sea-prop"><span>Cellule :</span> absente de la grille OSCAR</div>',
        `<div class="sea-prop"><span>Domaine proposé :</span> ${escapeHtmlText(inferOscarCellDomain(oscarKey))}</div>`,
        '</div>',
      ].join('');
    }

    function selectedOceanEntries() {
      const grid = getOscarGrid();
      if (!grid) return [];
      return orderedOscarKeys(selectedOceanCellKeys)
        .map(key => [key, grid.cells[key]])
        .filter(([, cell]) => !!cell);
    }

    function isOceanBatchSelection() {
      return ctx.isOcean && selectedOceanCellKeys.size > 1;
    }

    function formatOceanBatchPanel() {
      const entries = selectedOceanEntries();
      const manualCount = entries.filter(([, cell]) => isOscarManualCell(cell)).length;
      const coastalCount = entries.filter(([, cell]) => hasOscarCoastalCurrent(cell)).length;
      const fluvialCount = entries.filter(([, cell]) => hasOscarFluvialCurrent(cell)).length;
      const missingCurrentCount = entries.filter(([, cell]) => oscarCurrentCategory(cell) === 'non-renseigne').length;
      const avgSpeed = entries.length
        ? entries.reduce((sum, [, cell]) => sum + oscarCellSpeed(cell), 0) / entries.length
        : 0;
      const actionHtml = oceanCellEditing
        ? formatOscarCellEditForm(entries[0]?.[1])
        : [
          oceanCellActionsHtml({ editLabel: 'Éditer tous' }).replace('</div>', '<button type="button" class="tool-btn" data-ocean-action="clear-selection">Tout désélectionner</button></div>'),
        ].join('');
      return [
        '<div class="ocean-cell-detail">',
        `<div class="ocean-cell-title">Sélection multiple (${entries.length} cellules)<span class="ocean-cell-badge">édition commune</span></div>`,
        `<div class="sea-prop"><span>Contenu :</span> ${manualCount} manuelle(s), ${coastalCount} courant(s) double(s), ${fluvialCount} cellule(s) avec courant fluvial, ${missingCurrentCount} courant(s) principal(aux) non renseigné(s)</div>`,
        `<div class="sea-prop"><span>Vitesse moyenne :</span> ${avgSpeed.toFixed(2)} nd</div>`,
        '<div class="sea-prop"><span>Application :</span> les valeurs saisies seront appliquées à toutes les cellules sélectionnées.</div>',
        actionHtml,
        '</div>',
      ].join('');
    }

    function fluvialCurrentFormState(cell) {
      return oscarFluvialCurrents(cell).map(current => ({
        riverId: String(current.riverId || ''),
        speedKnot: Math.round(oscarCellSpeed(current) * 100) / 100,
        dirToDeg: Math.round(normalizeAngle(Number(current.dirToDeg) || 0) * 10) / 10,
      }));
    }

    function formatFluvialCurrentRows(cell) {
      const currents = oscarFluvialCurrents(cell);
      const rows = [...currents, null].map((current, index) => {
        const enabled = !!current;
        const speed = enabled ? oscarCellSpeed(current) : 0.8;
        const direction = enabled && Number.isFinite(Number(current.dirToDeg))
          ? normalizeAngle(Number(current.dirToDeg))
          : 0;
        return [
          `<div class="ocean-fluvial-current" data-fluvial-index="${index}" data-original-river-id="${escapeAttr(current?.riverId || '')}">`,
          '<label class="ocean-cell-toggle ocean-fluvial-enable">',
          `<input type="checkbox" data-fluvial-field="enabled" data-initial="${enabled}"${enabled ? ' checked' : ''}>`,
          enabled ? `Tracé ${index + 1}` : 'Ajouter un tracé fluvial',
          '</label>',
          '<label>Identifiant du fleuve',
          `<input type="text" data-fluvial-field="riverId" data-initial="${escapeAttr(current?.riverId || '')}" value="${escapeAttr(current?.riverId || '')}" placeholder="Ex. F-95_143-A"${enabled ? '' : ' disabled'}>`,
          '</label>',
          '<label>Vitesse fluviale (nd)',
          `<input type="number" min="0" step="0.01" data-fluvial-field="speed" data-initial="${escapeAttr(speed.toFixed(2))}" value="${escapeAttr(speed.toFixed(2))}"${enabled ? '' : ' disabled'}>`,
          '</label>',
          '<label>Direction fluviale (°)',
          `<input type="number" min="0" max="359.9" step="0.1" data-fluvial-field="direction" data-initial="${escapeAttr(direction.toFixed(1))}" value="${escapeAttr(direction.toFixed(1))}"${enabled ? '' : ' disabled'}>`,
          '</label>',
          '</div>',
        ].join('');
      }).join('');
      return [
        `<fieldset id="ocean-fluvial-currents" class="ocean-fluvial-currents" data-initial="${escapeAttr(JSON.stringify(fluvialCurrentFormState(cell)))}">`,
        '<legend>Courants fluviaux</legend>',
        rows,
        '</fieldset>',
      ].join('');
    }

    function formatOscarCellEditForm(cell) {
      if (!cell) return '';
      const domainOptions = [...new Set([
        ...Object.values(getOscarGrid()?.cells || {}).map(item => item.domain).filter(Boolean),
        'bariana',
      ])].sort();
      const mainSpeed = oscarCellSpeed(cell);
      const explicitCalm = cell.calmeRenseigne === true && mainSpeed === 0;
      const mainDir = Number.isFinite(Number(cell.dirToDeg))
        ? normalizeAngle(Number(cell.dirToDeg))
        : normalizeAngle(Math.atan2(Number(cell.yKnot) || 0, Number(cell.xKnot) || 0) * 180 / Math.PI);
      const hasCoastal = hasOscarCoastalCurrent(cell);
      const coastal = cell.coastal || cell;
      const coastalSpeed = oscarCellSpeed(coastal);
      const coastalDir = Number.isFinite(Number(coastal.dirToDeg))
        ? normalizeAngle(Number(coastal.dirToDeg))
        : normalizeAngle(Math.atan2(Number(coastal.yKnot) || 0, Number(coastal.xKnot) || 0) * 180 / Math.PI);
      const restoreButton = isOscarManualCell(cell) || hasCoastal
        ? '<button type="button" class="tool-btn" data-ocean-action="restore">Rétablir Copernicus</button>'
        : '';
      return [
        '<div class="ocean-cell-form">',
        '<label>Vitesse (nd)',
        `<input id="ocean-main-speed" type="number" min="0" step="0.01" value="${escapeAttr(mainSpeed.toFixed(2))}" data-initial="${escapeAttr(mainSpeed.toFixed(2))}"${explicitCalm ? ' disabled' : ''}>`,
        '</label>',
        '<label>Direction (°)',
        `<input id="ocean-main-dir" type="number" min="0" max="359.9" step="0.1" value="${escapeAttr(mainDir.toFixed(1))}" data-initial="${escapeAttr(mainDir.toFixed(1))}"${explicitCalm ? ' disabled' : ''}>`,
        '</label>',
        '<label class="ocean-cell-toggle">',
        `<input id="ocean-main-calm" type="checkbox"${explicitCalm ? ' checked' : ''} data-initial="${explicitCalm}">`,
        'Courant nul renseigné (calme)',
        '</label>',
        '<label class="ocean-cell-toggle">',
        `<input id="ocean-has-coastal" type="checkbox"${hasCoastal ? ' checked' : ''} data-initial="${hasCoastal}">`,
        'Ajouter un courant côtier',
        '</label>',
        `<div id="ocean-coastal-fields" class="ocean-coastal-fields" style="${hasCoastal ? '' : 'display:none;'}">`,
        '<label>Vitesse côtière (nd)',
        `<input id="ocean-coastal-speed" type="number" min="0" step="0.01" value="${escapeAttr(coastalSpeed.toFixed(2))}" data-initial="${escapeAttr(coastalSpeed.toFixed(2))}">`,
        '</label>',
        '<label>Direction côtière (°)',
        `<input id="ocean-coastal-dir" type="number" min="0" max="359.9" step="0.1" value="${escapeAttr(coastalDir.toFixed(1))}" data-initial="${escapeAttr(coastalDir.toFixed(1))}">`,
        '</label>',
        '</div>',
        formatFluvialCurrentRows(cell),
        '<label>Nature de navigation',
        `<select id="ocean-nature-nav" data-initial="${escapeAttr(oscarNavigationValue(cell))}">`,
        `<option value=""${oscarNavigationValue(cell) === '' ? ' selected' : ''}>Non renseignée</option>`,
        `<option value="hauturiere"${oscarNavigationValue(cell) === 'hauturiere' ? ' selected' : ''}>Haute mer</option>`,
        `<option value="cotiere"${oscarNavigationValue(cell) === 'cotiere' ? ' selected' : ''}>Côtière</option>`,
        `<option value="fluviale"${oscarNavigationValue(cell) === 'fluviale' ? ' selected' : ''}>Fluviale</option>`,
        `<option value="cotiere+hauturiere"${oscarNavigationValue(cell) === 'cotiere+hauturiere' ? ' selected' : ''}>Côtière + haute mer</option>`,
        `<option value="cotiere+fluviale"${oscarNavigationValue(cell) === 'cotiere+fluviale' ? ' selected' : ''}>Côtière + fluviale</option>`,
        `<option value="fluviale+hauturiere"${oscarNavigationValue(cell) === 'fluviale+hauturiere' ? ' selected' : ''}>Fluviale + haute mer</option>`,
        `<option value="cotiere+fluviale+hauturiere"${oscarNavigationValue(cell) === 'cotiere+fluviale+hauturiere' ? ' selected' : ''}>Les trois régimes</option>`,
        '</select>',
        '</label>',
        '<label>Région de travail',
        `<select id="ocean-domain" data-initial="${escapeAttr(cell.domain || '')}">`,
        `<option value=""${!cell.domain ? ' selected' : ''}>Non renseignée</option>`,
        ...domainOptions.map(domain => `<option value="${escapeAttr(domain)}"${cell.domain === domain ? ' selected' : ''}>${escapeHtmlText(OSCAR_DOMAIN_LABELS[domain] || domain)}</option>`),
        '</select>',
        '</label>',
        '</div>',
        '<div class="ocean-cell-actions">',
        '<button type="button" class="tool-btn" data-ocean-action="apply">Appliquer</button>',
        '<button type="button" class="tool-btn" data-ocean-action="cancel">Annuler</button>',
        restoreButton,
        '</div>',
      ].join('');
    }

    // ═══════════════════════════════════════════════════════════
    // HAUTS-FONDS — survol de risque (SÉMAPHORE)
    // ═══════════════════════════════════════════════════════════
    // Les courants-axe (rubans SVG legacy) ont été retirés — la donnée
    // courant vit désormais exclusivement dans la grille OSCAR/Copernicus
    // (voir js/navigation-jaillot.js). Seuls les hauts-fonds restent des
    // entités polygonales ; leur géométrie est éditée comme n'importe
    // quel polygone en TOPOGRAPHIE — Géo (zonesEdit). Ici on ne fait que
    // relire ces polygones pour le survol non-interactif en SÉMAPHORE.

    function escapeAttr(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function escapeHtmlText(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    const SEA_KNOTS_TO_KMH_EDITOR = 1.852;

    function getWorkingShoals() {
      if (!zonesWorkingCopy.SHOAL_META) return [];
      return Object.entries(zonesWorkingCopy.SHOAL_META).map(([id, meta]) => ({
        id,
        ...meta,
        zone: zonesEdit[id] || [],
      }));
    }

    function zoneSeaPolygons(zone) {
      if (Array.isArray(zone)) {
        if (zone.length && typeof zone[0]?.[0] === 'number') {
          return [{ exterior: zone, holes: [] }];
        }
        return zone
          .map(item => currentZoneAsEditableObject(item))
          .filter(poly => poly.exterior.length > 2);
      }
      if (zone && Array.isArray(zone.polygons)) {
        return zone.polygons
          .map(item => currentZoneAsEditableObject(item))
          .filter(poly => poly.exterior.length > 2);
      }
      const poly = currentZoneAsEditableObject(zone);
      return poly.exterior.length > 2 ? [poly] : [];
    }

    function seaZoneLatLngs(zone) {
      return zoneSeaPolygons(zone).map(poly => {
        const rings = [poly.exterior, ...poly.holes].filter(ring => ring.length > 2);
        return rings.map(ring => ring.map(([x, y]) => pxToLatLng(x, y)));
      });
    }

    function seaPointInRing(pt, ring) {
      const [x, y] = pt;
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        const intersects = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi);
        if (intersects) inside = !inside;
      }
      return inside;
    }

    function seaPointInZone(pt, zone) {
      return zoneSeaPolygons(zone).some(poly => (
        seaPointInRing(pt, poly.exterior)
        && !poly.holes.some(hole => seaPointInRing(pt, hole))
      ));
    }

    function normalizeNavLevel(value) {
      const level = Number(value);
      if (!Number.isFinite(level)) return 0;
      return Math.max(0, Math.min(5, Math.round(level)));
    }

    function semaphoreShoalVisible(shoal) {
      return !ctx.isSemaphore || (shoal.visibiliteNav ?? 0) <= semaphoreNavLevel;
    }

    function semaphoreVisibleShoals() {
      return getWorkingShoals().filter(semaphoreShoalVisible);
    }

    function cloneRing(ring) {
      return (ring || []).map(([x, y]) => [x, y]);
    }

    function currentZoneAsEditableObject(zone) {
      if (zone && Array.isArray(zone.polygons)) {
        return currentZoneAsEditableObject(zone.polygons[0]);
      }
      if (Array.isArray(zone)) {
        return { exterior: cloneRing(zone), holes: [] };
      }
      if (!zone || !Array.isArray(zone.exterior)) {
        return { exterior: [], holes: [] };
      }
      const holes = Array.isArray(zone.holes) ? zone.holes : (Array.isArray(zone.hole) ? [zone.hole] : []);
      return {
        exterior: cloneRing(zone.exterior),
        holes: holes.map(cloneRing),
      };
    }

    function renderShoalHoverLayer() {
      clearShoalHoverLayer();
      // Survol de risque des hauts-fonds : SÉMAPHORE uniquement, non-interactif.
      if (!ctx.isSemaphore) return;
      const shoals = semaphoreVisibleShoals();

      shoalHoverLayer = L.layerGroup().addTo(map);

      shoals.forEach(s => {
        const latlngs = seaZoneLatLngs(s.zone);
        if (!latlngs.some(poly => poly[0]?.length > 2)) return;
        L.polygon(latlngs, {
          color: 'rgba(130,80,30,0.9)',
          weight: 1.5,
          dashArray: '5 4',
          fillColor: 'rgba(100,55,15,0.38)',
          fillOpacity: 1,
          interactive: false,
        }).addTo(shoalHoverLayer);
      });
    }

    // Code mort — liste "currents-list" (ancien panneau Infos-Mers) et
    // panneau "current-detail" (ancien Géo-Mers/Infos-Mers), remplacés par
    // updateTopoInfoDetail() en TOPOGRAPHIE — Info.

    function renderShoalMetaFieldsHtml(shoal) {
      return `
    <label style="display:flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim);">
      <span style="flex:1;">Libelle</span>
      <input type="text" value="${escapeAttr(shoal.label || shoal.id)}" data-shoal-meta="label"
        style="width:170px; background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:3px 5px; border-radius:2px; font-size:0.74rem;">
    </label>
    <label style="display:flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim);">
      <span style="flex:1;">Visibilite Nav</span>
      <input type="number" min="0" max="5" step="1" value="${escapeAttr(shoal.visibiliteNav ?? 1)}" data-shoal-meta="visibiliteNav"
        style="width:74px; background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:3px 5px; border-radius:2px; font-size:0.74rem;">
    </label>
    <label style="display:flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim);">
      <span style="flex:1;">Cat. max libre</span>
      <input type="number" min="0" max="5" step="1" value="${escapeAttr(shoal.catMax ?? 3)}" data-shoal-meta="catMax"
        style="width:74px; background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:3px 5px; border-radius:2px; font-size:0.74rem;">
    </label>
    <label style="display:flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim);">
      <span style="flex:1;">Cat. max avec Nav</span>
      <input type="number" min="0" max="5" step="1" value="${escapeAttr(shoal.catMaxNav ?? '')}" placeholder="—" data-shoal-meta="catMaxNav"
        style="width:74px; background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:3px 5px; border-radius:2px; font-size:0.74rem;">
    </label>
    <label style="display:flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim);">
      <span style="flex:1;">Nav min (passageNav)</span>
      <input type="number" min="0" max="5" step="1" value="${escapeAttr(shoal.passageNav ?? '')}" placeholder="—" data-shoal-meta="passageNav"
        style="width:74px; background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:3px 5px; border-radius:2px; font-size:0.74rem;">
    </label>
    <label style="display:flex; flex-direction:column; gap:4px; font-size:0.74rem; color:var(--text-dim);">
      <span>Risque / effet de jeu</span>
      <textarea data-shoal-meta="risque" rows="3"
        style="background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:5px; border-radius:2px; font-size:0.74rem; resize:vertical;">${escapeHtmlText(shoal.risque || '')}</textarea>
    </label>
    <label style="display:flex; flex-direction:column; gap:4px; font-size:0.74rem; color:var(--text-dim);">
      <span>Contexte</span>
      <textarea data-shoal-meta="contexte" rows="5"
        style="background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:5px; border-radius:2px; font-size:0.74rem; resize:vertical;">${escapeHtmlText(shoal.contexte || '')}</textarea>
    </label>
    <label style="display:flex; flex-direction:column; gap:4px; font-size:0.74rem; color:var(--text-dim);">
      <span>Note MJ</span>
      <textarea data-shoal-meta="note_mj" rows="4"
        style="background:rgba(0,0,0,0.28); border:1px solid rgba(212,175,55,0.35);
        color:var(--text-light); padding:5px; border-radius:2px; font-size:0.74rem; resize:vertical;">${escapeHtmlText(shoal.note_mj || '')}</textarea>
    </label>`;
    }

    function updateShoalMeta(shoal, input, options = {}) {
      const key = input.dataset.shoalMeta;
      if (!key) return;
      // Écrit directement dans la copie de travail des métadonnées — shoal
      // (retourné par getWorkingShoals()) est un objet reconstruit à chaque
      // appel, pas une référence stable.
      const meta = zonesWorkingCopy.SHOAL_META?.[shoal.id];
      if (!meta) return;
      if (key === 'catMax' || key === 'catMaxNav' || key === 'passageNav') {
        const raw = input.value.trim();
        if (raw === '' || raw === '—') { delete meta[key]; return; }
        const value = Math.max(0, Math.min(5, Math.round(Number(raw))));
        if (!Number.isFinite(value)) return;
        meta[key] = value;
      } else if (key === 'visibiliteNav') {
        const value = Math.max(0, Math.min(5, Math.round(Number(input.value))));
        if (!Number.isFinite(value)) return;
        meta.visibiliteNav = value;
      } else {
        const value = input.value.trim();
        if (value) meta[key] = value;
        else delete meta[key];
      }

      if (!options.soft) {
        refresh(R.PANEL);
      }
    }

    function clearShoalHoverLayer() {
      if (shoalHoverLayer) { map.removeLayer(shoalHoverLayer); shoalHoverLayer = null; }
    }

    // Affiche le contour de la cellule OSCAR actuellement inspectée (Sémaphore
    // ou Infos — Mers). L'ancien système SEA_CELLS (peinture manuelle
    // courant/vent case par case) a été retiré : il n'était plus lu par aucun
    // outil en aval et ses boutons n'étaient déjà plus rendus dans l'UI.
    function renderSeaCells() {
      if (!seaCellLayer) return;
      seaCellLayer.clearLayers();
      seaCellLayers = {};
      if (!(ctx.isSemaphore || ctx.isOcean)) return;
      const grid = getOscarGrid();
      const diagnosticKeys = ctx.isOcean
        ? filteredOscarEntries()
          .filter(([key]) => oscarSessionEditsVisible && sessionEditedOceanCellKeys.has(key))
          .map(([key]) => key)
        : [];
      const keys = ctx.isOcean
        ? [...new Set([...diagnosticKeys, ...selectedOceanCellKeys, selectedSeaCellKey].filter(Boolean))]
        : [selectedSeaCellKey].filter(Boolean);
      keys.forEach(key => {
        const cell = grid?.cells?.[key];
        if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
        const shape = L.polygon(oscarCellLatLngsFromKey(key, cell), seaCellStyle(key));
        shape.addTo(seaCellLayer);
        seaCellLayers[key] = shape;
      });
    }

    // Actions et presse-papiers OCÉANOGRAPHIE.
    function selectedOscarCell() {
      const grid = getOscarGrid();
      return selectedSeaCellKey ? grid?.cells?.[selectedSeaCellKey] : null;
    }

    function oceanTargetKeys({ includeMissing = false } = {}) {
      const grid = getOscarGrid();
      const keys = isOceanBatchSelection()
        ? orderedOscarKeys(selectedOceanCellKeys)
        : [selectedSeaCellKey].filter(Boolean);
      return includeMissing ? keys : keys.filter(key => !!grid?.cells?.[key]);
    }

    function oceanEditTargets() {
      if (isOceanBatchSelection()) return selectedOceanEntries().map(([, cell]) => cell);
      const cell = selectedOscarCell();
      return cell ? [cell] : [];
    }

    function oceanCopyEntries() {
      return isOceanBatchSelection()
        ? selectedOceanEntries()
        : [[selectedSeaCellKey, selectedOscarCell()]].filter(([, cell]) => !!cell);
    }

    function updateOceanToolbarActionState() {
      if (!ctx.isOcean) return;
      const copyBtn = document.querySelector('[data-ocean-toolbar-action="copy"]');
      const pasteBtn = document.querySelector('[data-ocean-toolbar-action="paste"]');
      const deleteBtn = document.querySelector('[data-ocean-toolbar-action="delete"]');
      if (copyBtn) copyBtn.disabled = oceanCopyEntries().length === 0;
      if (pasteBtn) pasteBtn.disabled = !hasOceanClipboard() || oceanTargetKeys({ includeMissing: true }).length === 0;
      if (deleteBtn) deleteBtn.disabled = oceanTargetKeys().length === 0;
    }

    function setOceanCellEditing(editing) {
      oceanCellEditing = !!editing && oceanEditTargets().length > 0;
      updateInfosMersOscarPanel();
    }

    // Ajuste la vitesse d'une cellule par un facteur multiplicatif, cible ou
    // voisine de halo. referenceResult (cible déjà ajustée) n'est fourni que
    // pour une voisine ; manualDir n'est fourni que pour une cible sans
    // aucune direction exploitable (résolu en amont dans applyOceanCellAdjustToKeys).
    // Priorité de direction quand il faut amorcer un vecteur nul :
    // 1) direction résiduelle propre à la cellule (fréquente sur les
    //    données Copernicus à vitesse nulle — cible ou voisine) ;
    // 2) direction de la cible déjà ajustée, héritée par une voisine sans
    //    direction propre ;
    // 3) direction saisie manuellement (cas d'une cible sans aucune des deux).
    function oscarApplyAdjustFactor(cell, factor, attenuate, referenceResult, manualDir) {
      rememberOriginalOscarCell(cell);
      const currentSpeed = oscarCellSpeed(cell);
      const residualDir = Number.isFinite(Number(cell.dirToDeg)) ? Number(cell.dirToDeg) : null;
      let newSpeed;
      let newDir;
      if (currentSpeed > 0) {
        newSpeed = currentSpeed * (attenuate ? (1 - factor) : (1 + factor));
        newDir = residualDir ?? 0;
      } else if (attenuate) {
        newSpeed = 0;
        newDir = residualDir ?? 0;
      } else {
        newDir = residualDir ?? referenceResult?.dir ?? manualDir;
        if (!Number.isFinite(newDir)) {
          throw new Error('Direction manquante pour amplifier une cellule sans vecteur.');
        }
        newSpeed = referenceResult
          ? Math.round(referenceResult.speed * OSCAR_ADJUST_HALO_RATIO * 1000) / 1000
          : OSCAR_ADJUST_TARGET_FLOOR;
      }
      Object.assign(cell, oscarVectorFromSpeedDir(newSpeed, newDir));
      return { speed: newSpeed, dir: newDir };
    }

    // Point d'entrée du clic en mode outil "Amplifier/Atténuer" : pot de
    // peinture. Si la cellule cliquée fait partie d'une sélection multiple
    // déjà constituée avec l'outil Sélection, le réglage s'applique à tout
    // le groupe ; sinon uniquement à la cellule cliquée.
    function applyOceanCellAdjustAt(clickedKey) {
      const grid = getOscarGrid();
      if (!grid?.cells?.[clickedKey]) return;
      const targetKeys = selectedOceanCellKeys.has(clickedKey)
        ? orderedOscarKeys(selectedOceanCellKeys)
        : [clickedKey];
      applyOceanCellAdjustToKeys(targetKeys);
    }

    function applyOceanCellAdjustToKeys(targetKeys) {
      const grid = getOscarGrid();
      if (!targetKeys.length || !grid) return;
      const attenuate = oceanAdjustAttenuate;
      // Le % personnalisé (sans plafond à 15%) prévaut sur le curseur 5/10/15%
      // s'il est renseigné. En mode Atténuer, plafonné à 100% : au-delà,
      // (1 - facteur) deviendrait négatif et donnerait une vitesse négative.
      const rawFactor = (Number.isFinite(oceanAdjustCustomFactor) && oceanAdjustCustomFactor > 0)
        ? oceanAdjustCustomFactor / 100
        : (OSCAR_ADJUST_FACTORS[oceanAdjustFactorIdx] ?? OSCAR_ADJUST_FACTORS[1]);
      const factor = attenuate ? Math.min(rawFactor, 1) : rawFactor;
      const halo = oceanAdjustHalo;

      // Validation : en mode Amplifier, toute cible sans vecteur ni direction
      // résiduelle doit recevoir une direction — demandée au clic puisqu'il
      // n'y a plus de formulaire à remplir avant application. Annulation
      // (ou saisie invalide) sur une seule cellule annule tout le clic :
      // pas d'application partielle.
      const manualDirs = {};
      if (!attenuate) {
        for (const key of targetKeys) {
          const cell = grid.cells[key];
          if (!cell || oscarCellSpeed(cell) > 0 || Number.isFinite(Number(cell.dirToDeg))) continue;
          const val = window.prompt(`La cellule ${key} n'a ni vecteur ni direction résiduelle.\nDirection à utiliser pour amplifier (°) :`, '0');
          if (val === null) return;
          const num = Number(val);
          if (!Number.isFinite(num)) {
            alert(`Direction invalide pour ${key}.`);
            return;
          }
          manualDirs[key] = normalizeAngle(num);
        }
      }

      pushUndo(attenuate ? 'Atténuer cellules OSCAR' : 'Amplifier cellules OSCAR');

      const targetKeySet = new Set(targetKeys);
      const targetResults = {};
      targetKeys.forEach(key => {
        const cell = grid.cells[key];
        if (!cell) return;
        targetResults[key] = oscarApplyAdjustFactor(cell, factor, attenuate, null, manualDirs[key]);
        cell.source = 'manual';
        sessionEditedOceanCellKeys.add(key);
      });

      if (halo) {
        const haloFactor = factor * OSCAR_ADJUST_HALO_RATIO;
        // Regrouper les voisines par cibles bordantes, pour ne pas laisser
        // l'ordre de traitement (donc l'ordre de sélection) décider
        // arbitrairement quelle cible influence une voisine partagée.
        const neighborBorders = {};
        targetKeys.forEach(key => {
          if (!targetResults[key]) return;
          oscarHexNeighborKeys(key).forEach(nKey => {
            if (targetKeySet.has(nKey) || !grid.cells[nKey]) return; // déjà cible à part entière
            (neighborBorders[nKey] ??= []).push(key);
          });
        });
        // Une voisine à la frontière de plusieurs cibles ne reçoit le
        // facteur halo qu'une seule fois, quel que soit le nombre de cibles
        // qui la bordent — sinon un cumul la ferait dépasser l'amplification
        // du cœur de la zone sélectionnée. Référence unique : la cible
        // bordante la plus rapide (déjà le critère retenu pour établir la
        // direction/le plancher d'une voisine sans vecteur propre).
        Object.entries(neighborBorders).forEach(([nKey, borderingKeys]) => {
          const neighbor = grid.cells[nKey];
          const bestKey = borderingKeys.reduce((best, key) =>
            targetResults[key].speed > targetResults[best].speed ? key : best
          , borderingKeys[0]);
          oscarApplyAdjustFactor(neighbor, haloFactor, attenuate, targetResults[bestKey]);
          neighbor.source = 'manual';
          sessionEditedOceanCellKeys.add(nKey);
        });
      }

      refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    function applyOceanCellEdit() {
      const targets = oceanEditTargets();
      if (!targets.length) return;
      const mainSpeedInput = document.getElementById('ocean-main-speed');
      const mainDirInput = document.getElementById('ocean-main-dir');
      const mainCalmInput = document.getElementById('ocean-main-calm');
      const hasCoastalInput = document.getElementById('ocean-has-coastal');
      const speedInput = document.getElementById('ocean-coastal-speed');
      const dirInput = document.getElementById('ocean-coastal-dir');
      const natureNavInput = document.getElementById('ocean-nature-nav');
      const domainInput = document.getElementById('ocean-domain');
      const fluvialContainer = document.getElementById('ocean-fluvial-currents');
      const mainSpeed = Number(mainSpeedInput?.value);
      const mainDir = Number(mainDirInput?.value);
      if (!Number.isFinite(mainSpeed) || mainSpeed < 0) {
        alert('La vitesse doit être un nombre positif ou nul.');
        mainSpeedInput?.focus();
        return;
      }
      if (!Number.isFinite(mainDir)) {
        alert('La direction doit être un nombre en degrés.');
        mainDirInput?.focus();
        return;
      }
      const hasCoastal = !!hasCoastalInput?.checked;
      const mainCalm = !!mainCalmInput?.checked;
      let coastalSpeed = 0;
      let coastalDir = 0;
      if (hasCoastal) {
        coastalSpeed = Number(speedInput?.value);
        coastalDir = Number(dirInput?.value);
        if (!Number.isFinite(coastalSpeed) || coastalSpeed < 0) {
          alert('La vitesse côtière doit être un nombre positif ou nul.');
          speedInput?.focus();
          return;
        }
        if (!Number.isFinite(coastalDir)) {
          alert('La direction côtière doit être un nombre en degrés.');
          dirInput?.focus();
          return;
        }
      }

      const fluvialRows = [...document.querySelectorAll('.ocean-fluvial-current')];
      const fluvialOperations = [];
      for (const row of fluvialRows) {
        const enabledInput = row.querySelector('[data-fluvial-field="enabled"]');
        const enabled = enabledInput?.checked === true;
        const initiallyEnabled = enabledInput?.dataset.initial === 'true';
        const originalRiverId = String(row.dataset.originalRiverId || '');
        const riverIdInput = row.querySelector('[data-fluvial-field="riverId"]');
        const speedField = row.querySelector('[data-fluvial-field="speed"]');
        const directionField = row.querySelector('[data-fluvial-field="direction"]');
        if (initiallyEnabled && !enabled) {
          fluvialOperations.push({ type: 'remove', originalRiverId });
          continue;
        }
        if (!enabled) continue;
        const riverId = String(riverIdInput?.value || '').trim();
        const speedKnot = Number(speedField?.value);
        const dirToDeg = Number(directionField?.value);
        if (!riverId) {
          alert('Chaque courant fluvial doit avoir un identifiant de fleuve.');
          riverIdInput?.focus();
          return;
        }
        if (!Number.isFinite(speedKnot) || speedKnot < 0) {
          alert('La vitesse fluviale doit être un nombre positif ou nul.');
          speedField?.focus();
          return;
        }
        if (!Number.isFinite(dirToDeg)) {
          alert('La direction fluviale doit être un nombre en degrés.');
          directionField?.focus();
          return;
        }
        if (!initiallyEnabled) {
          fluvialOperations.push({ type: 'add', riverId, speedKnot, dirToDeg });
          continue;
        }
        const riverIdTouched = riverId !== riverIdInput.dataset.initial;
        const speedTouched = Number(speedField.value) !== Number(speedField.dataset.initial);
        const directionTouched = Number(directionField.value) !== Number(directionField.dataset.initial);
        if (riverIdTouched || speedTouched || directionTouched) {
          fluvialOperations.push({
            type: 'update',
            originalRiverId,
            riverId: riverIdTouched ? riverId : null,
            speedKnot: speedTouched ? speedKnot : null,
            dirToDeg: directionTouched ? dirToDeg : null,
          });
        }
      }

      const applyFluvialOperations = (cell) => {
        let currents = oscarFluvialCurrents(cell).map(current => ({ ...current }));
        fluvialOperations.forEach(operation => {
          if (operation.type === 'remove') {
            currents = currents.filter(current => current.riverId !== operation.originalRiverId);
            return;
          }
          if (operation.type === 'add') {
            currents.push({
              riverId: operation.riverId,
              ...oscarVectorFromSpeedDir(operation.speedKnot, operation.dirToDeg),
              source: 'manual',
            });
            return;
          }
          const index = currents.findIndex(current => current.riverId === operation.originalRiverId);
          if (index < 0) return;
          const current = currents[index];
          const currentSpeed = oscarCellSpeed(current);
          const currentDirection = Number.isFinite(Number(current.dirToDeg))
            ? normalizeAngle(Number(current.dirToDeg))
            : normalizeAngle(Math.atan2(Number(current.yKnot) || 0, Number(current.xKnot) || 0) * 180 / Math.PI);
          const updated = {
            ...current,
            riverId: operation.riverId || current.riverId,
            source: 'manual',
          };
          if (operation.speedKnot !== null || operation.dirToDeg !== null) {
            Object.assign(updated, oscarVectorFromSpeedDir(
              operation.speedKnot !== null ? operation.speedKnot : currentSpeed,
              operation.dirToDeg !== null ? operation.dirToDeg : currentDirection,
            ));
          }
          currents[index] = updated;
        });
        return currents;
      };

      // Un champ n'est appliqué que s'il a réellement été modifié par
      // rapport à sa valeur d'ouverture (data-initial). Sur une sélection
      // multiple, appliquer un champ non touché homogénéiserait toutes les
      // cellules sur la valeur affichée pour la seule cellule de référence
      // — par exemple, ajouter un courant côtier à toute une bande de
      // cellules ne doit pas réécrire leur vecteur principal respectif.
      const isTouched = (input) => !!input && input.dataset.initial !== undefined
        && Number(input.value) !== Number(input.dataset.initial);
      const speedTouched = isTouched(mainSpeedInput);
      const dirTouched = isTouched(mainDirInput);
      const mainCalmTouched = !!mainCalmInput && mainCalmInput.dataset.initial !== undefined
        && String(mainCalm) !== mainCalmInput.dataset.initial;
      const hasCoastalTouched = !!hasCoastalInput && hasCoastalInput.dataset.initial !== undefined
        && String(hasCoastal) !== hasCoastalInput.dataset.initial;
      const coastalSpeedTouched = isTouched(speedInput);
      const coastalDirTouched = isTouched(dirInput);
      const natureNavTouched = !!natureNavInput && natureNavInput.dataset.initial !== undefined
        && natureNavInput.value !== natureNavInput.dataset.initial;
      const domainTouched = !!domainInput && domainInput.dataset.initial !== undefined
        && domainInput.value !== domainInput.dataset.initial;
      const fluvialTouched = fluvialOperations.length > 0;

      if (!speedTouched && !dirTouched && !mainCalmTouched && !hasCoastalTouched && !coastalSpeedTouched && !coastalDirTouched
        && !fluvialTouched && !natureNavTouched && !domainTouched) {
        oceanCellEditing = false;
        refresh(R.SEA_PANEL);
        return; // rien à appliquer
      }

      const targetKeys = oceanTargetKeys();
      const requestedNavigationTypes = natureNavTouched
        ? natureNavInput.value.split('+').filter(Boolean)
        : null;
      const incompatibleFluvialTarget = targets.some(cell => {
        const resultingCurrents = fluvialTouched ? applyFluvialOperations(cell) : oscarFluvialCurrents(cell);
        const resultingTypes = requestedNavigationTypes || oscarNavigationTypes(cell);
        const ids = resultingCurrents.map(current => current.riverId);
        return (resultingCurrents.length && !resultingTypes.includes('fluviale'))
          || ids.some((id, index) => !id || ids.indexOf(id) !== index);
      });
      if (incompatibleFluvialTarget) {
        alert('Les courants fluviaux exigent une nature « Fluviale » et des identifiants uniques dans chaque cellule.');
        return;
      }
      pushUndo('Modifier cellule OSCAR');
      targets.forEach((cell, idx) => {
        rememberOriginalOscarCell(cell);
        let touchedSomething = false;

        if ((speedTouched || dirTouched) && !mainCalm) {
          const currentSpeed = oscarCellSpeed(cell);
          const currentDir = Number.isFinite(Number(cell.dirToDeg))
            ? normalizeAngle(Number(cell.dirToDeg))
            : normalizeAngle(Math.atan2(Number(cell.yKnot) || 0, Number(cell.xKnot) || 0) * 180 / Math.PI);
          Object.assign(cell, oscarVectorFromSpeedDir(
            speedTouched ? mainSpeed : currentSpeed,
            dirTouched ? mainDir : currentDir,
          ));
          touchedSomething = true;
        }

        if (mainCalmTouched) {
          if (mainCalm) {
            Object.assign(cell, { xKnot: 0, yKnot: 0, speedKnot: 0, dirToDeg: null });
            cell.calme = true;
            cell.calmeRenseigne = true;
          } else {
            delete cell.calmeRenseigne;
          }
          touchedSomething = true;
        } else if ((speedTouched || dirTouched) && oscarCellSpeed(cell) > 0) {
          delete cell.calme;
        }

        if (hasCoastalTouched) {
          if (hasCoastal) cell.coastal = oscarVectorFromSpeedDir(coastalSpeed, coastalDir);
          else delete cell.coastal;
          touchedSomething = true;
        } else if (hasCoastal && cell.coastal && (coastalSpeedTouched || coastalDirTouched)) {
          // Case côtière non touchée, mais vitesse/direction côtière
          // modifiées : ne s'applique qu'aux cellules qui ont déjà un
          // courant côtier — on ne force pas sa création ailleurs.
          const currentCoastalSpeed = oscarCellSpeed(cell.coastal);
          const currentCoastalDir = Number.isFinite(Number(cell.coastal.dirToDeg))
            ? normalizeAngle(Number(cell.coastal.dirToDeg))
            : normalizeAngle(Math.atan2(Number(cell.coastal.yKnot) || 0, Number(cell.coastal.xKnot) || 0) * 180 / Math.PI);
          cell.coastal = oscarVectorFromSpeedDir(
            coastalSpeedTouched ? coastalSpeed : currentCoastalSpeed,
            coastalDirTouched ? coastalDir : currentCoastalDir,
          );
          touchedSomething = true;
        }

        if (touchedSomething) {
          const clearedGeneratedCalm = mainCalmTouched && !mainCalm && oscarCellSpeed(cell) === 0
            && !(Number(cell.sources) > 0) && !(Number(cell.sourceCells) > 0);
          cell.source = clearedGeneratedCalm ? 'calm' : 'manual';
          if (targetKeys[idx]) sessionEditedOceanCellKeys.add(targetKeys[idx]);
        }

        if (fluvialTouched) {
          const updatedFluvialCurrents = applyFluvialOperations(cell);
          if (updatedFluvialCurrents.length) cell.fluvialCurrents = updatedFluvialCurrents;
          else delete cell.fluvialCurrents;
          if (targetKeys[idx]) sessionEditedOceanCellKeys.add(targetKeys[idx]);
        }

        // Nature de navigation : indépendante du vecteur de courant, ne marque
        // pas la cellule "manual" (le bouton Rétablir Copernicus ne doit pas
        // apparaître pour un simple tag de zone — voir REPRISE_74).
        if (natureNavTouched) {
          const types = natureNavInput.value.split('+').filter(Boolean);
          if (types.length === 1) {
            cell.natureNav = types[0];
            delete cell.naturesNav;
            cell.natureNavSource = 'manual';
          } else if (types.length > 1) {
            cell.naturesNav = types;
            delete cell.natureNav;
            cell.natureNavSource = 'manual';
          } else {
            delete cell.natureNav;
            delete cell.naturesNav;
            delete cell.natureNavSource;
          }
        }
        // Région technique utilisée pour filtrer et travailler par lots. Elle
        // ne détermine ni la connexité maritime ni la nature de navigation.
        if (domainTouched) {
          if (domainInput.value) cell.domain = domainInput.value;
          else delete cell.domain;
        }
      });
      oceanCellEditing = false;
      refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    function restoreOceanCellCopernicus() {
      const targets = oceanEditTargets();
      if (!targets.length) return;
      pushUndo('Restaurer cellule OSCAR');
      targets.forEach(cell => {
        if (cell._copernicusOriginal) {
          Object.assign(cell, cell._copernicusOriginal);
          delete cell._copernicusOriginal;
        }
        delete cell.coastal;
        delete cell.source;
      });
      oceanTargetKeys().forEach(key => sessionEditedOceanCellKeys.add(key));
      oceanCellEditing = false;
      refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    // Sélectionne toutes les cellules dont la vitesse principale tombe dans
    // la bande de l'égaliseur (remplace la sélection courante, comme le
    // Lasso ou un clic simple) — pour enchaîner avec Accentuer/Estomper sur
    // exactement le courant isolé visuellement.
    function oscarSelectByEqBand() {
      const grid = getOscarGrid();
      if (!grid?.cells) return;
      const matches = Object.entries(grid.cells)
        .filter(([, cell]) => Math.abs(oscarCellSpeed(cell) - oceanEqTargetSpeed) <= oceanEqBandwidth)
        .map(([key]) => key);
      selectedOceanCellKeys = new Set(matches);
      selectedSeaCellKey = matches[0] || null;
      oceanCellEditing = false;
      refresh(R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    // Nudge précis des curseurs de l'égaliseur — un curseur seul ne permet
    // pas d'atteindre une valeur exacte sous 1 nd (zone d'intérêt typique).
    function oscarNudgeEqValue(which, delta) {
      if (which === 'target') {
        oceanEqTargetSpeed = Math.max(0, Math.min(oscarSpeedColorCap, Math.round((oceanEqTargetSpeed + delta) * 100) / 100));
      } else {
        oceanEqBandwidth = Math.max(0.01, Math.min(2, Math.round((oceanEqBandwidth + delta) * 100) / 100));
      }
      refresh(R.TOOLS | (oceanEqActive ? R.OSCAR_HEX_GRID : 0));
    }

    function handleOceanCellAction(action) {
      if (action === 'edit') setOceanCellEditing(true);
      else if (action === 'cancel') setOceanCellEditing(false);
      else if (action === 'apply') applyOceanCellEdit();
      else if (action === 'restore') restoreOceanCellCopernicus();
      else if (action === 'copy') copyOceanCells();
      else if (action === 'paste') pasteOceanCells();
      else if (action === 'delete') deleteOceanCells();
      else if (action === 'eq-toggle') {
        oceanEqActive = !oceanEqActive;
        refresh(R.TOOLS | R.OSCAR_HEX_GRID);
      }
      else if (action === 'eq-select') oscarSelectByEqBand();
      else if (action === 'eq-target-minus') oscarNudgeEqValue('target', -0.01);
      else if (action === 'eq-target-plus') oscarNudgeEqValue('target', 0.01);
      else if (action === 'eq-band-minus') oscarNudgeEqValue('bandwidth', -0.01);
      else if (action === 'eq-band-plus') oscarNudgeEqValue('bandwidth', 0.01);
      else if (action === 'clear-selection') {
        selectedOceanCellKeys.clear();
        oceanCellEditing = false;
        refresh(R.OSCAR_SELECTION | R.SEA_PANEL);
      }
    }

    function cloneOscarCellForClipboard(cell) {
      return oscarCellTransferData(cell);
    }

    function copyOceanCells() {
      const entries = oceanCopyEntries();
      if (!entries.length) return;
      const referenceKey = selectedSeaCellKey && entries.some(([key]) => key === selectedSeaCellKey)
        ? selectedSeaCellKey
        : entries[0][0];
      oceanCellClipboard = entries.map(([key, cell]) => ({
        key,
        offset: oscarRelativeOffset(key, referenceKey),
        cell: cloneOscarCellForClipboard(cell),
      }));
      // Partagé via localStorage : permet de copier depuis une grille chargée dans
      // un autre onglet (comparaison de checkpoints) et coller ici.
      try {
        localStorage.setItem('pn-ocean-clipboard', JSON.stringify({
          savedAt: Date.now(),
          source: customOscarGridLabel || 'js/oscar-hex-grid.js',
          referenceKey,
          entries: oceanCellClipboard,
        }));
      } catch (err) {
        console.warn('Presse-papiers OCÉANOGRAPHIE : échec localStorage', err);
      }
      updateOceanClipboardStatus();
      updateInfosMersOscarPanel();
    }

    function readOceanClipboardShared() {
      try {
        const raw = localStorage.getItem('pn-ocean-clipboard');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed?.entries) ? parsed : null;
      } catch (err) {
        console.warn('Presse-papiers OCÉANOGRAPHIE : lecture invalide', err);
        return null;
      }
    }

    function hasOceanClipboard() {
      return !!(oceanCellClipboard?.length || readOceanClipboardShared()?.entries?.length);
    }

    function updateOceanClipboardStatus() {
      const el = document.getElementById('oscar-clipboard-status');
      if (!el) return;
      const shared = readOceanClipboardShared();
      if (!shared?.entries?.length) {
        el.innerHTML = '<span>Presse-papiers :</span> vide';
        updateOceanToolbarActionState();
        return;
      }
      const age = Math.max(0, Math.round((Date.now() - (shared.savedAt || 0)) / 1000));
      const ageLabel = age < 60 ? `${age}s` : `${Math.round(age / 60)}min`;
      el.innerHTML = `<span>Presse-papiers :</span> ${shared.entries.length} cellule(s) — depuis ${escapeHtmlText(shared.source || '?')} (${ageLabel})`;
      updateOceanToolbarActionState();
    }

    function cloneOscarCellForPasteTarget(key, source) {
      const grid = getOscarGrid();
      const existing = grid.cells[key] || null;
      const pasted = cloneJSON(oscarCellTransferData(source));
      Object.assign(pasted, oscarCellGeometryForKey(key));
      pasted.source = 'manual';
      pasted.domain = existing?.domain || inferOscarCellDomain(key);
      if (!oscarNavigationTypes(existing).includes('fluviale')) delete pasted.fluvialCurrents;
      return pasted;
    }

    function pasteOceanBlockFromAnchor(anchorKey, clipboard) {
      const grid = getOscarGrid();
      const pastedKeys = [];
      clipboard.forEach(entry => {
        const key = entry?.offset ? oscarKeyAtRelativeOffset(anchorKey, entry.offset) : anchorKey;
        const source = entry?.cell;
        if (!key || !source) return;
        grid.cells[key] = cloneOscarCellForPasteTarget(key, source);
        sessionEditedOceanCellKeys.add(key);
        pastedKeys.push(key);
      });
      return pastedKeys;
    }

    function pasteOceanCells() {
      const shared = readOceanClipboardShared();
      const clipboard = shared?.entries?.length ? shared.entries : oceanCellClipboard;
      if (!clipboard?.length) return;
      const grid = getOscarGrid();
      if (!grid?.cells) return;
      const keys = oceanTargetKeys({ includeMissing: true });
      if (!keys.length) return;
      pushUndo('Coller cellules OSCAR');
      if (keys.length === 1 && clipboard.length > 1 && clipboard.some(entry => entry?.offset)) {
        const pastedKeys = pasteOceanBlockFromAnchor(keys[0], clipboard);
        selectedOceanCellKeys = new Set(pastedKeys);
        selectedSeaCellKey = keys[0];
        oceanCellEditing = false;
        refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
        return;
      }
      keys.forEach((key, idx) => {
        const source = clipboard[idx % clipboard.length]?.cell;
        if (!source) return;
        grid.cells[key] = cloneOscarCellForPasteTarget(key, source);
        sessionEditedOceanCellKeys.add(key);
      });
      oceanCellEditing = false;
      refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    function deleteOceanCells() {
      const grid = getOscarGrid();
      if (!grid?.cells) return;
      const keys = oceanTargetKeys();
      if (!keys.length) return;
      if (!confirm(`Supprimer ${keys.length} cellule(s) OSCAR de la grille ?`)) return;
      pushUndo('Supprimer cellules OSCAR');
      keys.forEach(key => delete grid.cells[key]);
      keys.forEach(key => sessionEditedOceanCellKeys.delete(key));
      selectedOceanCellKeys = new Set([...selectedOceanCellKeys].filter(key => grid.cells[key]));
      if (selectedSeaCellKey && !grid.cells[selectedSeaCellKey]) selectedSeaCellKey = null;
      oceanCellEditing = false;
      refresh(R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.SEA_PANEL);
    }

    function normalizeAngle(deg) {
      return ((deg % 360) + 360) % 360;
    }
