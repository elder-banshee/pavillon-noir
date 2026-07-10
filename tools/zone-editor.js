    'use strict';

    // ═══════════════════════════════════════════════════════════
    // CONSTANTES
    // ═══════════════════════════════════════════════════════════
    const IMG_W = CARTE_IMAGE.width;   // 8500
    const IMG_H = CARTE_IMAGE.height;  // 5320
    const IMG_SRC = '../' + CARTE_IMAGE.src; // chemin relatif depuis tools/
    const OCEAN_MASK_SRC = 'assets/oceanbounds-mask.svg';
    const SEA_CELL_SIZE = 50;
    const ZONE_TOOLS = [
      { id: 'select', label: 'Sélection', icon: '◈', title: 'Sélectionner une zone / déplacer un point' },
      { id: 'draw', label: 'Nouveau contour', icon: '✦', title: 'Tracer un nouveau contour' },
      { id: 'insert', label: 'Insérer point', icon: '⊕', title: 'Insérer un point sur un segment existant' },
      { id: 'erase', label: 'Supprimer point', icon: '⊗', title: 'Supprimer un point en cliquant dessus' },
      { id: 'split', label: 'Scinder', icon: '⌥', title: 'Scinder un contour en deux (1 point commun ou 2 points de coupe)' },
    ];
    const OCEAN_TOOLS = [
      { id: 'select', label: 'Sélection', icon: '◈', title: 'Sélectionner une cellule OSCAR' },
      { id: 'ocean-lasso', label: 'Lasso', icon: '⌁', title: 'Ajouter au lot les cellules entourées' },
      { id: 'ocean-adjust', label: 'Accentuer/Estomper', icon: '⇕', title: 'Cliquer une cellule (ou un groupe déjà sélectionné) pour amplifier/atténuer sa vitesse' },
    ];
    const OCEAN_TOOL_ACTIONS = [
      { id: 'copy', label: 'Copier', icon: '⎘', title: 'Copier les vecteurs des cellules sélectionnées' },
      { id: 'paste', label: 'Coller', icon: '↧', title: 'Coller les vecteurs copiés sur la sélection ou depuis la cellule active' },
      { id: 'delete', label: 'Supprimer', icon: '⊗', title: 'Supprimer les cellules OSCAR sélectionnées' },
    ];
    const OSCAR_DOMAIN_LABELS = {
      atlantic: 'Atlantique',
      pacific: 'Pacifique',
      caribbean: 'Caraïbes',
      gulf_mexico: 'Golfe du Mexique',
      bahamas: 'Bahamas',
      florida: 'Floride',
    };
    const OSCAR_CALM_SPEED_MAX = 0.10;
    // Outil Amplifier/Atténuer (OCÉANOGRAPHIE) : paliers du curseur linéaire,
    // ratio appliqué aux 6 voisines en mode Halo (facteur réduit + base du
    // plancher d'une voisine sans vecteur), plancher fixe pour une cible
    // elle-même sans vecteur.
    const OSCAR_ADJUST_FACTORS = [0.05, 0.10, 0.15];
    const OSCAR_ADJUST_HALO_RATIO = 0.5;
    const OSCAR_ADJUST_TARGET_FLOOR = 0.01;
    // Couleur plancher du dégradé de vitesse (t=0), également utilisée comme
    // teinte de filtre pour "Calmes non éditées". Ce n'est plus une couleur
    // dédiée aux cellules calmes : oscarSpeedColor s'y ancre pour toute
    // cellule à vitesse nulle, quelle que soit son origine (cf. session 72).
    const OSCAR_CALM_COLOR = [10, 16, 30];

    // ─── Couleurs des polygones par état ─────────────────────────
    const STYLE_NORMAL = { color: 'rgba(200,151,58,0.7)', weight: 1, fillColor: 'rgba(200,151,58,0.08)', fillOpacity: 1 };
    const STYLE_HOVER = { color: 'rgba(226,185,106,0.9)', weight: 1.5, fillColor: 'rgba(200,151,58,0.18)', fillOpacity: 1 };
    const STYLE_SELECTED = { color: 'rgba(226,185,106,1)', weight: 2, fillColor: 'rgba(200,151,58,0.25)', fillOpacity: 1 };
    const STYLE_DRAW_PREVIEW = { color: 'rgba(80,180,120,0.9)', weight: 1.5, fillColor: 'rgba(80,180,120,0.12)', fillOpacity: 1, dashArray: '6 4' };

    // ─── Styles des poignées ──────────────────────────────────────
    const HANDLE_NORMAL = { radius: 5, color: 'rgba(226,185,106,0.9)', weight: 1.5, fillColor: 'rgba(14,12,9,0.9)', fillOpacity: 1 };
    const HANDLE_HOVER = { radius: 7, color: '#e2b96a', weight: 2, fillColor: 'rgba(200,151,58,0.3)', fillOpacity: 1 };
    const HANDLE_SEGMENT = { radius: 4, color: 'rgba(80,140,220,0.8)', weight: 1.5, fillColor: 'rgba(80,140,220,0.15)', fillOpacity: 1, dashArray: '2 2' };

    // ═══════════════════════════════════════════════════════════
    // ÉTAT
    // ═══════════════════════════════════════════════════════════
    let map = null;
    let activeMode = 'topo'; // 'semaphore' | 'topo' | 'ocean'
    let activeTab = 'geo'; // 'geo' | 'info'  (actif seulement en mode topo)
    let currentTool = 'select'; // topo: select/draw/erase/insert/split ; ocean: select/ocean-lasso
    let undoStack = [];

    const ctx = {
      modeKey: 'topo-geo',
      isTopoGeo: true,
      isTopoInfo: false,
      isOcean: false,
      isSemaphore: false,
    };

    function refreshCtx() {
      ctx.isTopoGeo = activeMode === 'topo' && activeTab === 'geo';
      ctx.isTopoInfo = activeMode === 'topo' && activeTab === 'info';
      ctx.isOcean = activeMode === 'ocean';
      ctx.isSemaphore = activeMode === 'semaphore';
      ctx.modeKey = ctx.isSemaphore
        ? 'semaphore'
        : ctx.isOcean
          ? 'ocean'
          : ctx.isTopoGeo
            ? 'topo-geo'
            : 'topo-info';
      if (ctx.isOcean && (currentTool === 'draw' || currentTool === 'split' || currentTool === 'insert' || currentTool === 'erase')) {
        currentTool = 'select';
      }
    }

    const R = {
      ZONES: 1,
      SELECTED_ZONE: 2,
      SHOAL_HOVER: 4,
      HANDLES: 8,
      SEGMENTS: 16,
      PANEL: 32,
      SEA_PANEL: 64,
      EXPORT: 128,
      EDITOR: 256,
      TOOLS: 512,
      UNDO: 1024,
      OSCAR_SELECTION: 2048,
      OSCAR_HEX_GRID: 8192,
    };

    function refreshPanel() {
      if (ctx.isTopoGeo) updatePanel();
      else if (ctx.isTopoInfo) updateTopoInfoDetail();
      else if (ctx.isSemaphore) updateSeaPanel();
      if (ctx.isOcean) updateInfosMersOscarPanel();
    }

    function refreshHandles() {
      if (ctx.isTopoGeo) renderHandles();
    }

    function refresh(flags = 0, options = {}) {
      if (flags & R.ZONES) renderAllZones();
      if (flags & R.SELECTED_ZONE) {
        const zoneId = options.zoneId ?? selectedZoneId;
        if (zoneId) renderZone(zoneId);
      }
      if (flags & R.SHOAL_HOVER) renderShoalHoverLayer();
      if (flags & R.OSCAR_SELECTION) renderSeaCells();
      if (flags & R.OSCAR_HEX_GRID) renderOscarGridLayer();
      if (flags & R.HANDLES) refreshHandles();
      if (flags & R.SEGMENTS) renderSegmentMarkers();
      if (flags & R.TOOLS) renderToolButtons();
      if (flags & R.EDITOR) updateEditorUI();
      if (flags & R.PANEL) refreshPanel();
      if (flags & R.SEA_PANEL) {
        if (ctx.isSemaphore) updateSeaPanel();
        if (ctx.isOcean) updateInfosMersOscarPanel();
      }
      if (flags & R.EXPORT) updateExport();
      if (flags & R.UNDO) updateUndoButton();
    }

    function refreshAfterZoneEdit() {
      refresh(R.SELECTED_ZONE | R.HANDLES | R.PANEL | R.EXPORT);
    }

    function refreshAfterModeChange() {
      refresh(R.TOOLS | R.EDITOR | R.PANEL | R.SEA_PANEL | R.OSCAR_HEX_GRID | R.EXPORT | R.UNDO);
    }

    // Un polygone est un polygone : territoire et haut-fond partagent le même
    // pipeline de sélection/édition de géométrie (zonesEdit). Seule la lecture
    // des métadonnées (TOPOGRAPHIE — Info) et l'export distinguent les deux,
    // via isShoalId(zoneId).
    function isShoalId(zoneId) {
      return !!(zonesWorkingCopy.SHOAL_META && zonesWorkingCopy.SHOAL_META[zoneId]);
    }

    function selectEntity(type, id, extra = {}) {
      if (type === 'zone') {
        const prevZone = selectedZoneId;
        selectedZoneId = id;
        selectedContourIdx = extra.contourIdx ?? 0;
        if (prevZone && prevZone !== id) renderZone(prevZone);
        if (id) renderZone(id);
        refresh(R.HANDLES | R.PANEL | R.EXPORT);
        if (currentTool === 'insert') renderSegmentMarkers();
        return;
      }

      if (type === 'topoInfo') {
        selectedTopoInfoId = id;
        refresh(R.ZONES | R.PANEL);
      }
    }

    // ─── Copies de travail partagées ─────────────────────────────
    // Une seule instance par fichier cible, partagée entre tous les modes.
    // Initialisées au boot depuis les globales JS ; jamais rechargées au
    // changement de mode ou d'onglet.

    // zones-data.js — source unique pour tout polygone (territoire ou haut-fond).
    // Un polygone est un polygone : la géométrie vit dans DATA quel que soit son
    // type. SHOAL_META distingue les ids haut-fonds pour les métadonnées
    // (TOPOGRAPHIE — Info) et l'export (règles de visibilité différentes).
    let zonesWorkingCopy = {
      DATA: null,        // clone profond de ZONES_DATA  (géométrie, territoires + hauts-fonds)
      DEMO: null,        // clone profond de ZONES_DEMO  (métadonnées démographie territoires)
      SHOAL_META: null,  // clone profond de ZONES_SHOAL (métadonnées hauts-fonds)
    };

    // Alias de commodité — zonesEdit pointe sur zonesWorkingCopy.DATA après init
    let zonesEdit = {};
    let zonesMeta = {}; // métadonnées par contour (lu/écrit par l'édition et l'export)

    // Layers Leaflet
    let zoneLayers = {}; // zoneId → [L.Polygon, ...]  (un par contour)
    let handleLayers = []; // cercles de poignées du contour sélectionné
    let segmentMarkers = []; // milieux de segments (mode insert)
    let drawLayer = null; // L.Polyline preview du tracé en cours
    let drawMarkers = [];   // marqueurs des points posés
    let oceanMaskLayer = null;
    let seaCellLayer = null;
    let seaCellLayers = {};
    let oscarGridLayer = null;
    let oscarArrowLayer = null;
    let shoalHoverLayer = null;   // L.LayerGroup du survol de risque hauts-fonds (SÉMAPHORE)

    // Sélection
    let selectedZoneId = null;
    let selectedContourIdx = 0;  // index dans zonesEdit[selectedZoneId]
    let selectedSeaCellKey = null; // clé de cellule OSCAR inspectée (Sémaphore / Infos-Mers)
    let selectedOceanCellKeys = new Set(); // sélection multiple OCÉANOGRAPHIE
    let selectedSemaphorePoint = null; // point pixel [x,y] exact du dernier clic Sémaphore

    // Glisser-déposer d'un point
    let draggingHandle = null; // { zoneId, contourIdx, ptIdx, marker }

    // Tracé en cours
    let drawPoints = []; // [[x,y], ...]
    let semaphoreNavLevel = Number.isFinite(Number(window.niveauNavigation)) ? Number(window.niveauNavigation) : 0;
    window.niveauNavigation = semaphoreNavLevel;
    let oscarGridVisible = true;
    let oscarGridArrowsVisible = true;
    let oscarSessionEditsVisible = true;
    let oscarGridDomainFilter = '';
    let oscarGridTypeFilter = '';
    let oceanCellEditing = false;
    // Réglages de l'outil Accentuer/Estomper — état persistant (pas relu
    // depuis un formulaire recréé à chaque ouverture), pour permettre une
    // application répétée sans reconfigurer à chaque cellule.
    let oceanAdjustAttenuate = false;
    let oceanAdjustFactorIdx = 1; // index dans OSCAR_ADJUST_FACTORS (curseur 5/10/15%)
    let oceanAdjustCustomFactor = null; // % personnalisé (nombre) — prévaut sur le curseur si renseigné
    let oceanAdjustHalo = false;
    // Égaliseur — mode d'affichage temporaire (pas un outil de clic) qui
    // isole visuellement une bande de vitesse pour repérer un courant à
    // corriger, avec sélection automatique des cellules isolées.
    let oceanEqActive = false;
    let oceanEqTargetSpeed = 1;
    let oceanEqBandwidth = 1;
    let oceanCellClipboard = null;
    let sessionEditedOceanCellKeys = new Set();
    // Sélection multiple par glisser (Shift + clic-maintenu) en OCÉANOGRAPHIE.
    let oceanPaintSelecting = false;
    let oceanPaintMode = 'add';
    let oceanPaintLastKey = null;
    let oceanPaintDidExtend = false;
    let oceanLassoSelecting = false;
    let oceanLassoPoints = [];
    let oceanLassoLayer = null;
    let oceanLassoDidComplete = false;
    // Grille OSCAR chargée manuellement (comparaison de checkpoints) — prioritaire
    // sur OSCAR_HEX_GRID si présente. Plafond de dégradé recalculé à chaque
    // chargement, car chaque checkpoint a sa propre distribution de vitesses.
    let customOscarGrid = null;
    let customOscarGridLabel = '';
    let oscarSpeedColorCap = 2.9;

    // ═══════════════════════════════════════════════════════════
    // UTILITAIRES — coordonnées
    // ═══════════════════════════════════════════════════════════
    function pxToLatLng(x, y) { return L.latLng(IMG_H - y, x); }
    function latLngToPx(latlng) { return [Math.round(latlng.lng), Math.round(IMG_H - latlng.lat)]; }
    function eventToPx(e) { return latLngToPx(e.latlng); }

    // Convertit un contour [[x,y],...] en tableau de LatLng
    function contourToLatLngs(pts) { return pts.map(([x, y]) => pxToLatLng(x, y)); }

    function contourPoints(contour) {
      if (Array.isArray(contour)) return contour;
      if (contour && Array.isArray(contour.points)) return contour.points;
      return null;
    }

    function contourMeta(contour) {
      if (!contour || Array.isArray(contour) || !Array.isArray(contour.points)) return null;
      const meta = {};
      Object.keys(contour).forEach(key => {
        if (key !== 'points') meta[key] = contour[key];
      });
      return Object.keys(meta).length ? meta : null;
    }

    // Point milieu de deux points px
    function midPx(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }

    function cloneJSON(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function replaceObjectContents(target, source) {
      Object.keys(target).forEach(key => delete target[key]);
      Object.assign(target, cloneJSON(source));
    }

    function pushUndo(label) {
      const snapshot = {
        label,
        zonesEdit: cloneJSON(zonesEdit),
        zonesMeta: cloneJSON(zonesMeta),
        selectedZoneId,
        selectedContourIdx,
        selectedSeaCellKey,
        selectedOceanCellKeys: [...selectedOceanCellKeys],
        sessionEditedOceanCellKeys: [...sessionEditedOceanCellKeys],
        oceanCellEditing,
        activeMode,
        currentTool,
      };
      if (ctx.isOcean) {
        snapshot.oscarGrid = cloneJSON(getOscarGrid());
        snapshot.usingCustomOscarGrid = !!customOscarGrid;
        snapshot.customOscarGridLabel = customOscarGridLabel;
      }
      undoStack.push(snapshot);
      if (undoStack.length > 30) undoStack.shift();
      updateUndoButton();
    }

    function restoreOscarGridSnapshot(snapshot) {
      if (!snapshot?.oscarGrid) return;
      if (snapshot.usingCustomOscarGrid) {
        customOscarGrid = cloneJSON(snapshot.oscarGrid);
        customOscarGridLabel = snapshot.customOscarGridLabel || '';
        return;
      }
      customOscarGrid = null;
      customOscarGridLabel = '';
      const target = typeof OSCAR_HEX_GRID !== 'undefined' && OSCAR_HEX_GRID?.cells
        ? OSCAR_HEX_GRID
        : window.OSCAR_HEX_GRID;
      if (target?.cells) replaceObjectContents(target, snapshot.oscarGrid);
    }

    function undoLastOperation() {
      const snapshot = undoStack.pop();
      if (!snapshot) return;
      zonesEdit = snapshot.zonesEdit;
      zonesMeta = snapshot.zonesMeta;
      selectedZoneId = snapshot.selectedZoneId;
      selectedContourIdx = snapshot.selectedContourIdx;
      selectedSeaCellKey = snapshot.selectedSeaCellKey || null;
      selectedOceanCellKeys = new Set(snapshot.selectedOceanCellKeys || []);
      sessionEditedOceanCellKeys = new Set(snapshot.sessionEditedOceanCellKeys || []);
      oceanCellEditing = !!snapshot.oceanCellEditing;
      activeMode = snapshot.activeMode;
      currentTool = snapshot.currentTool;
      restoreOscarGridSnapshot(snapshot);
      refreshCtx();
      clearHandles();
      clearSegmentMarkers();
      if (snapshot.oscarGrid) {
        recomputeOscarSpeedColorCap(getOscarGrid());
        clearOscarGridLayer();
        populateOscarDomainSelect();
      }
      refresh(R.ZONES | R.HANDLES | R.TOOLS | R.EDITOR | R.PANEL | R.SEA_PANEL | R.OSCAR_HEX_GRID | R.OSCAR_SELECTION | R.EXPORT | R.UNDO);
    }

    function updateUndoButton() {
      const btn = document.getElementById('btn-undo');
      if (!btn) return;
      btn.disabled = undoStack.length === 0;
    }

    function renderToolButtons() {
      if (ctx.isTopoInfo || ctx.isSemaphore) { document.getElementById('tool-group').innerHTML = ''; return; }
      const tools = ctx.isOcean
        ? OCEAN_TOOLS
        : ZONE_TOOLS; // TOPOGRAPHIE — Géo : un polygone est un polygone, territoire ou haut-fond
      const group = document.getElementById('tool-group');
      const toolHtml = tools.map(tool => `
    <button class="tool-btn${tool.id === currentTool ? ' active' : ''}" data-tool="${tool.id}" title="${tool.title}">
      <span class="icon">${tool.icon}</span> ${tool.label}
    </button>
  `).join('');
      const actionHtml = ctx.isOcean
        ? '<div class="tb-sep"></div>' + OCEAN_TOOL_ACTIONS.map(action => `
    <button class="tool-btn" data-ocean-toolbar-action="${action.id}" title="${action.title}">
      <span class="icon">${action.icon}</span> ${action.label}
    </button>
  `).join('')
        : '';
      // Réglages de l'outil Accentuer/Estomper : barre inline dans la barre
      // d'outils (jamais par-dessus la carte), visible seulement quand cet
      // outil est actif. État persistant (oceanAdjustAttenuate/FactorIdx/Halo) :
      // pas de formulaire recréé, donc pas de réinitialisation entre deux clics.
      // Le champ % personnalisé prévaut sur le curseur 5/10/15% s'il est
      // renseigné — pour une bride plus large que celle, volontairement
      // modeste, du curseur.
      const adjustSettingsHtml = (ctx.isOcean && currentTool === 'ocean-adjust')
        ? `<div class="tb-sep"></div>
    <div class="ocean-adjust-settings">
      <label class="ocean-adjust-inline"><input type="checkbox" id="ocean-adjust-attenuate"${oceanAdjustAttenuate ? ' checked' : ''}> Atténuer</label>
      <label class="ocean-adjust-inline">Facteur <span id="ocean-adjust-factor-label">${Math.round(OSCAR_ADJUST_FACTORS[oceanAdjustFactorIdx] * 100)} %</span>
        <input type="range" id="ocean-adjust-factor" min="0" max="${OSCAR_ADJUST_FACTORS.length - 1}" step="1" value="${oceanAdjustFactorIdx}">
      </label>
      <label class="ocean-adjust-inline" title="Prévaut sur le curseur si renseigné">ou %
        <input type="number" id="ocean-adjust-custom-factor" min="1" max="1000" step="1" placeholder="ex : 40" value="${oceanAdjustCustomFactor ?? ''}" style="width:56px;">
      </label>
      <label class="ocean-adjust-inline"><input type="checkbox" id="ocean-adjust-halo"${oceanAdjustHalo ? ' checked' : ''}> Halo</label>
    </div>`
        : '';
      // Égaliseur : mode d'affichage (bascule + 2 curseurs), indépendant de
      // l'outil courant — n'affecte que le rendu de la grille, jamais le
      // comportement du clic. Le bouton bascule reste visible en permanence ;
      // les curseurs et "Sélectionner" n'apparaissent que si actif. Pas de
      // 0.01 nd (au lieu de 0.05) et boutons ± de part et d'autre : un
      // curseur seul ne permet pas d'atteindre une valeur précise sous 1 nd,
      // là où se trouvent la plupart des courants à corriger.
      const eqSettingsHtml = ctx.isOcean
        ? `<div class="tb-sep"></div>
    <div class="ocean-adjust-settings">
      <button class="tool-btn${oceanEqActive ? ' active' : ''}" id="ocean-eq-toggle-btn" data-ocean-toolbar-action="eq-toggle" title="Isoler visuellement une bande de vitesse pour repérer un courant à corriger">
        <span class="icon">◎</span> Égaliseur
      </button>
      ${oceanEqActive ? `
      <label class="ocean-adjust-inline">Cible <span id="ocean-eq-target-label">${oceanEqTargetSpeed.toFixed(2)} nd</span>
        <button type="button" class="tool-btn ocean-eq-step" data-ocean-toolbar-action="eq-target-minus">−</button>
        <input type="range" id="ocean-eq-target" min="0" max="${oscarSpeedColorCap}" step="0.01" value="${oceanEqTargetSpeed}">
        <button type="button" class="tool-btn ocean-eq-step" data-ocean-toolbar-action="eq-target-plus">+</button>
      </label>
      <label class="ocean-adjust-inline">Largeur ± <span id="ocean-eq-band-label">${oceanEqBandwidth.toFixed(2)} nd</span>
        <button type="button" class="tool-btn ocean-eq-step" data-ocean-toolbar-action="eq-band-minus">−</button>
        <input type="range" id="ocean-eq-bandwidth" min="0.01" max="2" step="0.01" value="${oceanEqBandwidth}">
        <button type="button" class="tool-btn ocean-eq-step" data-ocean-toolbar-action="eq-band-plus">+</button>
      </label>
      <button class="tool-btn" data-ocean-toolbar-action="eq-select">Sélectionner</button>` : ''}
    </div>`
        : '';
      group.innerHTML = toolHtml + actionHtml + adjustSettingsHtml + eqSettingsHtml;
      group.querySelectorAll('.tool-btn').forEach(btn => {
        if (btn.dataset.tool) btn.addEventListener('click', () => setTool(btn.dataset.tool));
        if (btn.dataset.oceanToolbarAction) btn.addEventListener('click', () => handleOceanCellAction(btn.dataset.oceanToolbarAction));
      });
      updateOceanToolbarActionState();
    }

    function setMode(mode) {
      if (mode === activeMode) {
        document.getElementById('editor-menu').classList.remove('open');
        return;
      }
      if (currentTool === 'draw') cancelDraw(true);
      if (currentTool === 'ocean-lasso') cancelOceanLasso();
      clearHandles();
      clearSegmentMarkers();
      activeMode = mode;
      if (activeMode !== 'topo') activeTab = 'geo'; // valeur par défaut si on revient en topo
      refreshCtx();
      currentTool = 'select';
      document.getElementById('editor-menu').classList.remove('open');
      refreshAfterModeChange();
    }

    function setTab(tab) {
      if (tab === activeTab) return;
      activeTab = tab;
      refreshCtx();
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });
      refresh(R.ZONES | R.TOOLS | R.EDITOR | R.PANEL | R.EXPORT);
    }

    function updateEditorUI() {
      updateEditorChrome();
      updateTabChrome();
      updateSidePanelsVisibility();
      updateContextControlsVisibility();
      updateMapModeLayers();
      updateMapToolClass();
    }

    function updateEditorChrome() {
      const modeLabels = { topo: 'Topographie', ocean: 'Océanographie', semaphore: 'Sémaphore' };
      const modeClasses = { topo: 'mode-topo', ocean: 'mode-ocean', semaphore: 'mode-semaphore' };
      document.getElementById('editor-switch-btn').textContent = modeLabels[activeMode] || 'Mode';
      document.getElementById('editor-switch-btn').className =
        'tb-mode-btn ' + (modeClasses[activeMode] || '');

      document.querySelectorAll('#editor-menu [data-editor]').forEach(btn => {
        btn.style.display = btn.dataset.editor === activeMode ? 'none' : 'block';
      });
    }

    function updateTabChrome() {
      const tabGroup = document.getElementById('tab-group');
      tabGroup.style.display = ctx.isTopoGeo || ctx.isTopoInfo ? 'flex' : 'none';
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === activeTab);
      });
    }

    function updateSidePanelsVisibility() {
      document.getElementById('section-topo-geo').style.display = ctx.isTopoGeo ? 'block' : 'none';
      document.getElementById('section-topo-info').style.display = ctx.isTopoInfo ? 'block' : 'none';
      document.getElementById('section-ocean').style.display = ctx.isOcean ? 'block' : 'none';
      document.getElementById('section-sea').style.display = ctx.isSemaphore ? 'block' : 'none';

      document.getElementById('export-area').style.display = ctx.isTopoGeo ? 'block' : 'none';

      const exportFileArea = document.getElementById('export-file-area');
      exportFileArea.style.display = ctx.isSemaphore ? 'none' : 'block';
      updateExportFileHint();
    }

    function updateContextControlsVisibility() {
      document.getElementById('btn-undo').style.display = ctx.isSemaphore ? 'none' : '';
      document.getElementById('tb-coords').style.display = ctx.isSemaphore ? 'none' : '';

      const inDraw = currentTool === 'draw' && ctx.isTopoGeo;
      document.getElementById('draw-controls').style.display = inDraw ? 'block' : 'none';
      document.getElementById('draw-badge').style.display = inDraw ? 'block' : 'none';
    }

    function updateMapModeLayers() {
      if (ctx.isSemaphore || ctx.isOcean) renderOceanMaskLayer();
      else clearOceanMaskLayer();

      renderAllZones();

      // La grille OSCAR (et le contour de sélection) est pilotée depuis
      // OCÉANOGRAPHIE autant que SÉMAPHORE.
      if (ctx.isSemaphore || ctx.isOcean) {
        if (seaCellLayer && !map.hasLayer(seaCellLayer)) seaCellLayer.addTo(map);
        renderOscarGridLayer();
        renderSeaCells();
      } else {
        clearOscarGridLayer();
        if (seaCellLayer && map.hasLayer(seaCellLayer)) map.removeLayer(seaCellLayer);
        selectedSeaCellKey = null;
        selectedOceanCellKeys.clear();
        oceanCellEditing = false;
        selectedSemaphorePoint = null;
      }
      // Survol de risque des hauts-fonds : SÉMAPHORE uniquement (non-interactif).
      // Plus aucun polygone en OCÉANOGRAPHIE (grille hexagonale exclusivement) ;
      // l'édition de géométrie des hauts-fonds se fait en TOPOGRAPHIE — Géo,
      // via le pipeline générique des zones (déjà couvert par renderAllZones).
      if (ctx.isSemaphore) {
        refresh(R.SHOAL_HOVER);
      } else {
        clearShoalHoverLayer();
      }

      if (ctx.isOcean) updateInfosMersOscarPanel();
    }

    function updateMapToolClass() {
      const mapEl = document.getElementById('map');
      mapEl.className = 'tool-' + currentTool;
    }

    function updateExportFileHint() {
      const hint = document.getElementById('export-file-hint');
      if (!hint) return;
      if (ctx.isTopoGeo || ctx.isTopoInfo) {
        hint.innerHTML = 'Génère <code>zones-data.js</code> complet (géométrie + métadonnées territoires et hauts-fonds). Remplacer dans le dépôt.';
      } else if (ctx.isOcean) {
        hint.innerHTML = 'Génère <code>oscar-hex-grid.js</code> (cellules éditées manuellement). Remplacer dans le dépôt.';
      }
    }

    function isPxInsideImage(pt) {
      return pt[0] >= 0 && pt[0] < IMG_W && pt[1] >= 0 && pt[1] < IMG_H;
    }

    function seaCellScreenSize() {
      if (!map) return SEA_CELL_SIZE;
      const a = map.latLngToContainerPoint(pxToLatLng(0, 0));
      const b = map.latLngToContainerPoint(pxToLatLng(SEA_CELL_SIZE, 0));
      return Math.max(8, Math.abs(b.x - a.x));
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
        opacity: 1,
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

    function oscarCellLatLngsFromKey(key, cell = null) {
      const grid = getOscarGrid();
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      const center = oscarCellCenterFromKey(key, cell);
      const radius = Number(grid.radiusPx) || SEA_CELL_SIZE / 2;
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

    function isOscarCalmUneditedCell(cell) {
      return !isOscarManualCell(cell)
        && !hasOscarCoastalCurrent(cell)
        && oscarCellSpeed(cell) <= OSCAR_CALM_SPEED_MAX;
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
    // qu'une. Le filtre "Calmes non éditées" reste le moyen de les isoler.
    function oscarCellStyle(cell) {
      const speed = oscarCellSpeed(cell);
      const [r, g, b] = oceanEqActive ? oscarEqColor(speed) : oscarSpeedColor(speed);
      const intensity = Math.max(0.3, Math.min(1, speed / oscarSpeedColorCap));
      // Bordure distincte pour les cellules taguées fluviale/côtière (REPRISE_74) :
      // la teinte de remplissage reste celle de la vitesse de courant, seule la
      // bordure signale la classification de navigation, pour ne pas se
      // substituer visuellement au dégradé de vitesse déjà en place.
      const natureBordure = cell.natureNav === 'fluviale' ? '#8fd0a6'
        : cell.natureNav === 'cotiere' ? '#7db8e8'
        : null;
      return {
        pane: 'oscarGridPane',
        className: 'oscar-grid-cell',
        color: natureBordure || `rgba(${r}, ${g}, ${b}, ${0.55 + intensity * 0.35})`,
        weight: natureBordure ? 2 : (speed >= 1.25 ? 1.25 : 0.75),
        fillColor: `rgba(${r}, ${g}, ${b}, ${0.42 + intensity * 0.38})`,
        fillOpacity: 1,
        interactive: false,
      };
    }

    function filteredOscarEntries() {
      const grid = getOscarGrid();
      if (!grid) return [];
      return Object.entries(grid.cells)
        .filter(([, cell]) => !oscarGridDomainFilter || cell.domain === oscarGridDomainFilter)
        .filter(([, cell]) => {
          if (oscarGridTypeFilter === 'manual') return isOscarManualCell(cell);
          if (oscarGridTypeFilter === 'coastal') return hasOscarCoastalCurrent(cell);
          if (oscarGridTypeFilter === 'calm') return isOscarCalmUneditedCell(cell);
          if (oscarGridTypeFilter === 'zonee') return cell.natureNav === 'fluviale' || cell.natureNav === 'cotiere';
          return true;
        });
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
      if (!oscarGridArrowsVisible) return;
      const grid = getOscarGrid();
      const radius = Number(grid.radiusPx) || SEA_CELL_SIZE / 2;
      const size = Math.max(16, Math.min(30, radius * 0.42));
      const coastalSize = size * 0.86;
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
        L.polygon(oscarCellLatLngsFromKey(key, cell), oscarCellStyle(cell)).addTo(oscarGridLayer);
      });
      renderOscarArrowLayer(entries);
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
      const calmCount = entries.filter(([, cell]) => isOscarCalmUneditedCell(cell)).length;
      const domainLabel = oscarGridDomainFilter
        ? (OSCAR_DOMAIN_LABELS[oscarGridDomainFilter] || oscarGridDomainFilter)
        : 'tous domaines';
      if (grid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est supportée.');
      el.innerHTML = `<span>OSCAR :</span> ${entries.length} cellules hex - ${escapeHtmlText(domainLabel)} - max ${max.toFixed(2)} nd - manuel ${manualCount} - session ${sessionEditedCount} - côtier ${coastalCount} - calmes ${calmCount}`;
    }

    function formatOscarCellForPanel(seaKey) {
      const grid = getOscarGrid();
      const oscarKey = seaKey;
      const cell = oscarKey ? grid?.cells?.[oscarKey] : null;
      if (!cell) return formatMissingOscarCellForPanel(oscarKey);
      const speed = oscarCellSpeed(cell);
      const domain = OSCAR_DOMAIN_LABELS[cell.domain] || cell.domain || 'domaine n/a';
      const max = Number.isFinite(Number(cell.maxSpeedKnot)) ? Number(cell.maxSpeedKnot).toFixed(2) : 'n/a';
      const sources = Number.isFinite(Number(cell.sources)) ? Number(cell.sources) : 'n/a';
      const sourceCells = Number.isFinite(Number(cell.sourceCells)) ? ` - cases source ${Number(cell.sourceCells)}` : '';
      const coastal = cell.coastal || null;
      const coastalSpeed = oscarCellSpeed(coastal);
      const badges = [
        `<span class="ocean-cell-badge${isOscarManualCell(cell) ? ' manual' : ''}">${oscarCellSourceLabel(cell)}</span>`,
        hasOscarCoastalCurrent(cell) ? '<span class="ocean-cell-badge coastal">courant côtier</span>' : '',
        hasOscarCoastalCurrent(cell) ? '<span class="ocean-cell-badge coastal">courant double</span>' : '',
      ].filter(Boolean).join('');
      const actionHtml = oceanCellEditing
        ? formatOscarCellEditForm(cell)
        : oceanCellActionsHtml({ editLabel: 'Éditer' });
      return [
        '<div class="ocean-cell-detail">',
        `<div class="ocean-cell-title">${escapeHtmlText(oscarKey)}${badges}</div>`,
        `<div class="sea-prop"><span>Domaine :</span> ${escapeHtmlText(domain)}</div>`,
        `<div class="sea-prop"><span>Courant principal :</span> ${speed.toFixed(2)} nd (${(speed * SEA_KNOTS_TO_KMH_EDITOR).toFixed(1)} km/h), direction ${formatMaybeNumber(cell.dirToDeg, 1, '°')}</div>`,
        coastal
          ? `<div class="sea-prop"><span>Courant côtier :</span> ${coastalSpeed.toFixed(2)} nd (${(coastalSpeed * SEA_KNOTS_TO_KMH_EDITOR).toFixed(1)} km/h), direction ${formatMaybeNumber(coastal.dirToDeg, 1, '°')}</div>`
          : '<div class="sea-prop"><span>Courant côtier :</span> aucun</div>',
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
      const calmCount = entries.filter(([, cell]) => isOscarCalmUneditedCell(cell)).length;
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
        `<div class="sea-prop"><span>Contenu :</span> ${manualCount} manuelle(s), ${coastalCount} avec courant côtier, ${calmCount} calme(s) non éditée(s)</div>`,
        `<div class="sea-prop"><span>Vitesse moyenne :</span> ${avgSpeed.toFixed(2)} nd</div>`,
        '<div class="sea-prop"><span>Application :</span> les valeurs saisies seront appliquées à toutes les cellules sélectionnées.</div>',
        actionHtml,
        '</div>',
      ].join('');
    }

    function formatOscarCellEditForm(cell) {
      if (!cell) return '';
      const mainSpeed = oscarCellSpeed(cell);
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
        `<input id="ocean-main-speed" type="number" min="0" step="0.01" value="${escapeAttr(mainSpeed.toFixed(2))}" data-initial="${escapeAttr(mainSpeed.toFixed(2))}">`,
        '</label>',
        '<label>Direction (°)',
        `<input id="ocean-main-dir" type="number" min="0" max="359.9" step="0.1" value="${escapeAttr(mainDir.toFixed(1))}" data-initial="${escapeAttr(mainDir.toFixed(1))}">`,
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
        '<label>Nature de navigation',
        `<select id="ocean-nature-nav" data-initial="${escapeAttr(cell.natureNav || '')}">`,
        `<option value=""${!cell.natureNav ? ' selected' : ''}>Haute mer (défaut)</option>`,
        `<option value="cotiere"${cell.natureNav === 'cotiere' ? ' selected' : ''}>Côtière</option>`,
        `<option value="fluviale"${cell.natureNav === 'fluviale' ? ' selected' : ''}>Fluviale</option>`,
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
          .filter(([key, cell]) => (oscarSessionEditsVisible && sessionEditedOceanCellKeys.has(key)) || hasOscarCoastalCurrent(cell))
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

    function normalizeAngle(deg) {
      return ((deg % 360) + 360) % 360;
    }

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

      // ─── Map couleur géopolitique par zone ───────────────────
      // Construite depuis JURIDICTIONS + PUISSANCES à l'année de référence.
      // Clé : zone id  Valeur : couleur hex de la puissance coloniale
      buildZoneCouleurMap();

      refresh(R.ZONES | R.TOOLS | R.EDITOR | R.UNDO);
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
        const demo = zonesWorkingCopy.DEMO?.[zoneId];
        const estVide = !demo || demo.colons === null;
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

      for (const id in zonesEdit) {
        renderZone(id);
      }
    }

    function renderZone(zoneId) {
      if (zoneLayers[zoneId]) {
        zoneLayers[zoneId].forEach(l => map.removeLayer(l));
      }
      zoneLayers[zoneId] = [];

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

    function updatePolyLatLngs(zoneId, contourIdx) {
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
      zonesMeta[selectedZoneId].push(null);
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

    // ═══════════════════════════════════════════════════════════
    // MISE À JOUR DU PANNEAU
    // ═══════════════════════════════════════════════════════════
    function updatePanel() {
      if (!ctx.isTopoGeo) return;
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

    // ═══════════════════════════════════════════════════════════
    // TOPOGRAPHIE — Info : liste juridictions + édition ZONES_DEMO / hauts-fonds
    // ═══════════════════════════════════════════════════════════
    let selectedTopoInfoId = null;

    function selectTopoInfo(id) {
      selectEntity('topoInfo', id);
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

    // Panneau OSCAR déplacé en Infos — Mers (contrôle case par case).
    function updateInfosMersOscarPanel() {
      updateOscarSummary();
      const oscarEl = document.getElementById('sea-oscar');
      if (oscarEl) {
        oscarEl.innerHTML = isOceanBatchSelection()
          ? formatOceanBatchPanel()
          : selectedSeaCellKey
            ? formatOscarCellForPanel(selectedSeaCellKey)
            : '<span>Cellule OSCAR :</span> non sélectionnée';
      }
      updateOceanToolbarActionState();
    }

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
      const hasCoastalInput = document.getElementById('ocean-has-coastal');
      const speedInput = document.getElementById('ocean-coastal-speed');
      const dirInput = document.getElementById('ocean-coastal-dir');
      const natureNavInput = document.getElementById('ocean-nature-nav');
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
      const hasCoastalTouched = !!hasCoastalInput && hasCoastalInput.dataset.initial !== undefined
        && String(hasCoastal) !== hasCoastalInput.dataset.initial;
      const coastalSpeedTouched = isTouched(speedInput);
      const coastalDirTouched = isTouched(dirInput);
      const natureNavTouched = !!natureNavInput && natureNavInput.dataset.initial !== undefined
        && natureNavInput.value !== natureNavInput.dataset.initial;

      if (!speedTouched && !dirTouched && !hasCoastalTouched && !coastalSpeedTouched && !coastalDirTouched
        && !natureNavTouched) {
        oceanCellEditing = false;
        refresh(R.SEA_PANEL);
        return; // rien à appliquer
      }

      pushUndo('Modifier cellule OSCAR');
      const targetKeys = oceanTargetKeys();
      targets.forEach((cell, idx) => {
        rememberOriginalOscarCell(cell);
        let touchedSomething = false;

        if (speedTouched || dirTouched) {
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
          cell.source = 'manual';
          if (targetKeys[idx]) sessionEditedOceanCellKeys.add(targetKeys[idx]);
        }

        // Nature de navigation : indépendante du vecteur de courant, ne marque
        // pas la cellule "manual" (le bouton Rétablir Copernicus ne doit pas
        // apparaître pour un simple tag de zone — voir REPRISE_74).
        if (natureNavTouched) {
          if (natureNavInput.value === 'cotiere' || natureNavInput.value === 'fluviale') {
            cell.natureNav = natureNavInput.value;
          } else {
            delete cell.natureNav;
          }
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

    // ═══════════════════════════════════════════════════════════
    // EXPORT JS
    // ═══════════════════════════════════════════════════════════
    function updateExport() {
      const box = document.getElementById('export-box');
      const hint = document.getElementById('export-hint');

      if (!ctx.isTopoGeo) {
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
      } else if (ctx.isOcean) {
        exportOscarGrid();
      }
    }

    function serializableOscarCell(cell) {
      const out = {};
      Object.entries(cell || {}).forEach(([key, value]) => {
        if (key.startsWith('_')) return;
        out[key] = value;
      });
      return out;
    }

    function exportOscarGrid() {
      const grid = getOscarGrid();
      if (!grid?.cells) {
        alert('Grille OSCAR indisponible.');
        return;
      }
      const exportGrid = {};
      Object.entries(grid).forEach(([key, value]) => {
        if (key === 'cells') return;
        exportGrid[key] = value;
      });
      exportGrid.cells = {};
      Object.entries(grid.cells).forEach(([key, cell]) => {
        exportGrid.cells[key] = serializableOscarCell(cell);
      });
      if (exportGrid.topology !== 'hex') throw new Error('Grille OSCAR invalide : seule la topologie hex est exportable.');
      let out = '// oscar-hex-grid.js - genere par Zone Editor depuis la grille OSCAR hex courante\n\n';
      out += `const OSCAR_HEX_GRID = ${JSON.stringify(exportGrid)};\n`;
      out += "if (typeof window !== 'undefined') window.OSCAR_HEX_GRID = OSCAR_HEX_GRID;\n";
      downloadBlob('oscar-hex-grid.js', out);
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


    // ═══════════════════════════════════════════════════════════
    // OUTIL SCINDER
    // ═══════════════════════════════════════════════════════════
    let splitFirstPt = null;  // { ptIdx, marker } — premier point sélectionné
    let splitHandles = [];   // L.CircleMarker[] affichés en mode split

    const HANDLE_SPLIT_IDLE = { radius: 5, color: 'rgba(220,140,255,0.7)', weight: 1.5, fillColor: 'rgba(14,12,9,0.9)', fillOpacity: 1 };
    const HANDLE_SPLIT_FIRST = { radius: 7, color: '#e0a0ff', weight: 2.5, fillColor: 'rgba(200,100,255,0.35)', fillOpacity: 1 };

    function renderSplitHandles() {
      clearSplitHandles();
      if (currentTool !== 'split' || !selectedZoneId) return;
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];
      contour.forEach((pt, ptIdx) => {
        const isFirst = splitFirstPt && splitFirstPt.ptIdx === ptIdx;
        const style = isFirst ? HANDLE_SPLIT_FIRST : HANDLE_SPLIT_IDLE;
        const circle = L.circleMarker(pxToLatLng(pt[0], pt[1]), { ...style, interactive: true });
        circle._ptIdx = ptIdx;
        circle.on('mouseover', function () { if (!isFirst) this.setStyle({ ...HANDLE_SPLIT_IDLE, radius: 7, color: '#e0a0ff' }); });
        circle.on('mouseout', function () { if (!isFirst) this.setStyle(HANDLE_SPLIT_IDLE); });
        circle.on('click', function (e) {
          L.DomEvent.stopPropagation(e);
          onSplitClick(this._ptIdx);
        });
        circle.addTo(map);
        splitHandles.push(circle);
      });
    }

    function clearSplitHandles() {
      splitHandles.forEach(h => map.removeLayer(h));
      splitHandles = [];
    }

    function onSplitClick(ptIdx) {
      const contour = zonesEdit[selectedZoneId][selectedContourIdx];

      if (!splitFirstPt) {
        // Premier clic : mémoriser le point
        splitFirstPt = { ptIdx };
        renderSplitHandles(); // re-render pour surligner
        return;
      }

      const p1 = splitFirstPt.ptIdx;
      const p2 = ptIdx;
      splitFirstPt = null;

      if (p1 === p2) {
        // Cas B : point unique — chercher s'il est dupliqué dans le contour
        const occurrences = contour.reduce((acc, pt, i) => {
          if (pt[0] === contour[p1][0] && pt[1] === contour[p1][1]) acc.push(i);
          return acc;
        }, []);
        if (occurrences.length < 2) {
          renderSplitHandles();
          return;
        }
        // Scinder en deux boucles au point commun
        const i1 = occurrences[0], i2 = occurrences[1];
        const loopA = contour.slice(i1, i2 + 1);
        const loopB = [...contour.slice(i2), ...contour.slice(0, i1 + 1)];
        applySplit(loopA, loopB);
      } else {
        // Cas A : deux points distincts — couper entre p1 et p2
        if (p1 === p2) { renderSplitHandles(); return; }
        const [lo, hi] = p1 < p2 ? [p1, p2] : [p2, p1];
        const loopA = [...contour.slice(lo, hi + 1)];
        const loopB = [...contour.slice(hi), ...contour.slice(0, lo + 1)];
        applySplit(loopA, loopB);
      }
    }

    function applySplit(loopA, loopB) {
      if (loopA.length < 3 || loopB.length < 3) {
        alert('La découpe produirait un contour de moins de 3 points — opération annulée.');
        renderSplitHandles();
        return;
      }
      pushUndo('Scinder contour');
      // Remplacer le contour actif par loopA, insérer loopB juste après
      zonesEdit[selectedZoneId].splice(selectedContourIdx, 1, loopA, loopB);
      zonesMeta[selectedZoneId] ??= [];
      zonesMeta[selectedZoneId].splice(selectedContourIdx, 1, null, null);
      clearSplitHandles();
      selectedContourIdx = Math.min(selectedContourIdx, zonesEdit[selectedZoneId].length - 1);
      refresh(R.SELECTED_ZONE | R.PANEL | R.EXPORT);
      renderSplitHandles();
    }

    // ═══════════════════════════════════════════════════════════
    // POPUP — RATTACHEMENT D'UN CONTOUR À UNE JURIDICTION
    // ═══════════════════════════════════════════════════════════
    let _pendingDrawPoints = null; // points en attente de rattachement

    function openAttachModal(points) {
      _pendingDrawPoints = points;
      const overlay = document.getElementById('ze-overlay');
      const title = document.getElementById('ze-modal-title');
      const body = document.getElementById('ze-modal-body');
      title.textContent = 'Rattacher le contour';
      body.innerHTML = `
    <span class="ze-modal-label">Juridiction existante</span>
    <div style="position:relative">
      <input id="ze-attach-input" class="ze-modal-input" type="text"
             placeholder="Nom ou identifiant…" autocomplete="off" aria-autocomplete="list">
      <span id="ze-attach-fantome" style="position:absolute;top:0;left:0;height:100%;
            display:flex;align-items:center;pointer-events:none;
            font-family:Cinzel,serif;font-size:0.75rem;color:var(--text-dim);opacity:0.5;"></span>
    </div>
    <ul id="ze-attach-suggestions" class="ze-suggestions"></ul>
    <hr class="ze-modal-sep">
    <div class="ze-modal-actions">
      <button id="ze-btn-cancel"  class="ze-btn danger">Annuler</button>
      <button id="ze-btn-attach"  class="ze-btn primary" disabled>Rattacher</button>
      <button id="ze-btn-new-jur" class="ze-btn">Nouvelle juridiction</button>
    </div>
    <div class="ze-modal-hint">Le contour sera ajouté à la juridiction choisie.</div>
  `;
      overlay.style.display = 'flex';

      // Construire la source de données : IDs de ZONES_DATA
      const zonesSource = Object.keys(zonesEdit).sort().map(id => ({ id, nom: id }));

      const input = document.getElementById('ze-attach-input');
      const fantome = document.getElementById('ze-attach-fantome');
      const suggestions = document.getElementById('ze-attach-suggestions');
      const btnAttach = document.getElementById('ze-btn-attach');
      let selectedZoneResult = null;

      RC.initChampRecherche(input, fantome, suggestions, {
        obtenirResultats: q => {
          const qN = RC.normaliser(q);
          return zonesSource
            .filter(z => RC.normaliser(z.id).includes(qN))
            .slice(0, 10)
            .map(z => ({ type: 'zone', item: z, id: z.id, nom: z.id, matchTag: z.id }));
        },
        rendreItem: (r, qLow) => {
          const hl = RC.surlignerMatch(r.nom, qLow);
          return `<li class="carte-recherche-suggestion" data-id="${RC.escapeHtml(r.id)}" data-nom="${RC.escapeHtml(r.nom)}">${hl}</li>`;
        },
        onChoisir: (li) => {
          selectedZoneResult = li.dataset.id;
          input.value = selectedZoneResult;
          btnAttach.disabled = false;
        },
        onEntreeSansMatch: (q) => {
          // Sélection directe si q est un ID exact
          if (zonesEdit[q]) { selectedZoneResult = q; btnAttach.disabled = false; }
        },
        msgAucunResultat: 'Aucune juridiction trouvée',
      });

      input.addEventListener('input', () => {
        // Réactiver si l'utilisateur tape un ID exact
        selectedZoneResult = zonesEdit[input.value.trim()] ? input.value.trim() : null;
        btnAttach.disabled = !selectedZoneResult;
      });

      document.getElementById('ze-btn-attach').addEventListener('click', () => {
        if (!selectedZoneResult) return;
        closeModal();
        attachDrawTo(selectedZoneResult);
      });

      document.getElementById('ze-btn-cancel').addEventListener('click', () => {
        closeModal();
        _pendingDrawPoints = null;
        setTool('select');
      });

      document.getElementById('ze-btn-new-jur').addEventListener('click', () => {
        openNewJurModal();
      });

      input.focus();
    }

    function openNewJurModal() {
      const title = document.getElementById('ze-modal-title');
      const body = document.getElementById('ze-modal-body');
      title.textContent = 'Nouvelle juridiction';
      body.innerHTML = `
    <span class="ze-modal-label">Identifiant (id)</span>
    <input id="ze-new-id"  class="ze-modal-input" type="text" placeholder="ex: saint-domingue" autocomplete="off">
    <span class="ze-modal-label" style="margin-top:8px;">Nom affiché</span>
    <input id="ze-new-nom" class="ze-modal-input" type="text" placeholder="ex: Saint-Domingue" autocomplete="off">
    <div class="ze-modal-actions">
      <button id="ze-btn-back"   class="ze-btn">← Retour</button>
      <button id="ze-btn-create" class="ze-btn primary" disabled>Créer</button>
    </div>
    <div class="ze-modal-hint">L'entrée sera créée avec des valeurs démographiques à zéro.<br>Éditez-les ensuite dans <strong>Infos — Terres</strong>.</div>
  `;

      const idInput = document.getElementById('ze-new-id');
      const nomInput = document.getElementById('ze-new-nom');
      const btnCreate = document.getElementById('ze-btn-create');

      function validate() {
        const id = idInput.value.trim();
        const nom = nomInput.value.trim();
        const idOk = id.length > 0 && !zonesEdit[id];
        btnCreate.disabled = !(idOk && nom.length > 0);
        idInput.style.borderColor = id.length > 0
          ? (zonesEdit[id] ? 'rgba(200,80,80,0.6)' : 'rgba(80,180,120,0.5)')
          : '';
      }
      idInput.addEventListener('input', validate);
      nomInput.addEventListener('input', validate);

      document.getElementById('ze-btn-back').addEventListener('click', () => {
        openAttachModal(_pendingDrawPoints);
      });

      document.getElementById('ze-btn-create').addEventListener('click', () => {
        const id = idInput.value.trim();
        const nom = nomInput.value.trim();
        if (!id || !nom || zonesEdit[id]) return;
        closeModal();
        createAndAttach(id, nom);
      });

      idInput.focus();
    }

    function closeModal() {
      document.getElementById('ze-overlay').style.display = 'none';
    }

    function attachDrawTo(zoneId) {
      if (!_pendingDrawPoints || _pendingDrawPoints.length < 3) return;
      pushUndo('Ajouter contour');
      zonesEdit[zoneId].push(_pendingDrawPoints.map(p => [...p]));
      zonesMeta[zoneId] ??= [];
      zonesMeta[zoneId].push(null);
      _pendingDrawPoints = null;
      setTool('select');
      selectEntity('zone', zoneId, { contourIdx: zonesEdit[zoneId].length - 1 });
    }

    function createAndAttach(id, nom) {
      if (!_pendingDrawPoints || _pendingDrawPoints.length < 3) return;
      pushUndo('Créer juridiction');
      // Géométrie
      zonesEdit[id] = [_pendingDrawPoints.map(p => [...p])];
      zonesMeta[id] = [null];
      zonesWorkingCopy.DATA[id] = zonesEdit[id];
      // Métadonnées — null sur tous les champs pour distinguer "pas encore renseigné"
      // du 0 explicite (territoire désert). La détection d'avertissement visuel
      // se base sur null, pas sur 0.
      zonesWorkingCopy.DEMO[id] = {
        colons: null, esclaves: null, indiens: null, indiens_asservis: null,
        population: null, superficie: null, score_densite: null, statut_autochtone: null,
      };
      _pendingDrawPoints = null;
      setTool('select');
      selectEntity('zone', id, { contourIdx: 0 });
    }

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
      let depth = 0, i = braceStart;
      for (; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') { depth--; if (depth === 0) { i++; break; } }
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
