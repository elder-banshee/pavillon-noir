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

    // oceanBounds (Atlantique/Pacifique) suit le même principe : géométrie
    // dans zonesEdit, distinguée par isOceanBoundsId(zoneId). Contrairement
    // aux hauts-fonds, chaque contour porte en plus un rôle explicite
    // (zonesMeta[id][idx].role : 'exterior' | 'hole') posé au chargement —
    // voir loadOceanBoundsWorkingCopy() dans zone-editor-map.js — pour que
    // rendu et export sachent distinguer l'anneau extérieur des trous
    // (îles) sans dépendre d'une convention d'index implicite.
    function isOceanBoundsId(zoneId) {
      return !!(zonesWorkingCopy.OCEAN_BOUNDS && zonesWorkingCopy.OCEAN_BOUNDS[zoneId]);
    }

    // Rôle d'un contour au sein d'une entité oceanBounds ('exterior' | 'hole'
    // | null). Toujours null pour territoire/haut-fond (pas de notion de trou
    // dans ce pipeline-là).
    function contourRole(zoneId, contourIdx) {
      return zonesMeta[zoneId]?.[contourIdx]?.role || null;
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

    // zones-data.js — source unique pour tout polygone (territoire, haut-fond
    // ou oceanBounds). Un polygone est un polygone : la géométrie vit dans
    // DATA quel que soit son type. SHOAL_META distingue les ids haut-fonds
    // pour les métadonnées (TOPOGRAPHIE — Info) et l'export (règles de
    // visibilité différentes). OCEAN_BOUNDS distingue de la même façon les
    // deux entités oceanBounds (Atlantique/Pacifique) — voir isOceanBoundsId.
    let zonesWorkingCopy = {
      DATA: null,          // clone profond de ZONES_DATA  (géométrie, territoires + hauts-fonds)
      DEMO: null,          // clone profond de ZONES_DEMO  (métadonnées démographie territoires)
      SHOAL_META: null,    // clone profond de ZONES_SHOAL (métadonnées hauts-fonds)
      OCEAN_BOUNDS: null,  // clone profond de ZONES_OCEAN_BOUNDS (masque navigable Atlantique/Pacifique)
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
