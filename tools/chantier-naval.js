/* global SHIPS_DATA */
'use strict';

const shipsOriginal = Array.isArray(window.SHIPS_DATA)
  ? window.SHIPS_DATA
  : (typeof SHIPS_DATA !== 'undefined' && Array.isArray(SHIPS_DATA) ? SHIPS_DATA : []);
const state = {
  ships: shipsOriginal.map(cloneShip),
  selectedId: shipsOriginal[0]?.id || '',
  draft: null,
  dirty: false,
  showFieldErrors: false,
};
let diagnosticsExpanded = false;

const form = document.getElementById('ship-form');
const shipSelectEl = document.getElementById('ship-select');
const exportEl = document.getElementById('ship-export');
const diagnosticsEl = document.getElementById('diagnostics');
const diagnosticsToggleEl = document.getElementById('diagnostics-toggle');
const diagnosticsSummaryEl = document.getElementById('diagnostics-summary');
const dirtyEl = document.getElementById('dirty-state');
const exportOverlayEl = document.getElementById('export-overlay');
const issuesOverlayEl = document.getElementById('issues-overlay');
const btnOpenExport = document.getElementById('btn-open-export');
const extraOptionsToggle = document.getElementById('toggle-extra-options');
const extraOptionsFields = document.getElementById('extra-options-fields');
const deriveToggle = document.getElementById('toggle-derive');
const deriveDraftField = document.getElementById('derive-draft-field');
const deriveDraftInput = document.getElementById('field-tirant-derive');
const avironsToggle = document.getElementById('toggle-avirons');
const avironsInput = document.getElementById('field-avirons');
const activeShipLabelEl = document.getElementById('active-ship-label');

function cloneShip(ship) {
  return JSON.parse(JSON.stringify(ship ?? {}));
}

function selectedShip() {
  return state.ships.find(ship => ship.id === state.selectedId) || state.ships[0] || null;
}

function setByPath(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  parts.slice(0, -1).forEach(part => {
    cursor[part] ??= {};
    cursor = cursor[part];
  });
  const last = parts[parts.length - 1];
  if (value === '' || value === null || value === undefined) delete cursor[last];
  else cursor[last] = value;
}

function getByPath(target, path) {
  return path.split('.').reduce((cursor, part) => cursor?.[part], target);
}

function inputValue(input) {
  if (input.type === 'checkbox') return input.checked;
  if (input.type === 'number') {
    if (input.value === '') return null;
    if (input.dataset.objectValue) {
      const objectValue = JSON.parse(input.dataset.objectValue);
      if (String(objectValue.standard ?? '') === input.value) return objectValue;
    }
    const value = Number(input.value);
    return Number.isFinite(value) ? value : null;
  }
  return input.value.trim();
}

function numericInputValue(input) {
  if (input.value === '') return null;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : null;
}

function setInputValue(input, value) {
  delete input.dataset.objectValue;
  if (input.type === 'checkbox') {
    input.checked = !!value;
    return;
  }
  if (input.type === 'number' && value && typeof value === 'object') {
    input.dataset.objectValue = JSON.stringify(value);
    input.value = value.standard ?? '';
    return;
  }
  input.value = value ?? '';
}

function restrictionFromSelectValue(value) {
  if (!value || value === 'libre') return null;
  if (value === 'interdit') return 'interdit';
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sortedShips(ships) {
  return [...ships].sort((a, b) => {
    const catA = Number(a.categorieTaille ?? 999);
    const catB = Number(b.categorieTaille ?? 999);
    if (catA !== catB) return catA - catB;
    return String(a.nom || a.id).localeCompare(String(b.nom || b.id), 'fr', { sensitivity: 'base' });
  });
}

function shipLabel(ship) {
  return `Cat. ${ship.categorieTaille ?? '?'} · ${ship.nom || ship.id} · Nav ${ship.niveauNav ?? '?'}`;
}

function renderList() {
  const ships = sortedShips(state.ships);
  if (ships.length && !ships.some(ship => ship.id === state.selectedId)) {
    state.selectedId = ships[0].id;
    renderForm();
  }
  shipSelectEl.innerHTML = ships.length
    ? ships.map(ship => `<option value="${escapeHtml(ship.id)}">${escapeHtml(shipLabel(ship))}</option>`).join('')
    : '<option value="">Aucun navire</option>';
  shipSelectEl.value = state.selectedId;
  shipSelectEl.disabled = !ships.length;
}

function renderForm() {
  state.draft = cloneShip(selectedShip());
  form.querySelectorAll('[data-path]').forEach(input => setInputValue(input, getByPath(state.draft, input.dataset.path)));
  form.querySelectorAll('[data-list-path]').forEach(input => {
    const values = getByPath(state.draft, input.dataset.listPath);
    input.value = Array.isArray(values) ? values.join(', ') : '';
  });
  form.querySelectorAll('[data-restriction]').forEach(select => {
    const zone = select.dataset.restriction;
    const value = state.draft.restrictionNav?.[zone];
    if (value !== undefined) {
      select.value = String(value);
    } else if (state.draft.__isNew) {
      select.value = state.draft.__reviewedZones?.[zone] ? 'libre' : '';
    } else {
      select.value = 'libre';
    }
  });
  const draftValue = state.draft.tirantEau;
  deriveToggle.checked = !!(draftValue && typeof draftValue === 'object');
  deriveDraftInput.value = draftValue && typeof draftValue === 'object' ? draftValue.deriveLevee ?? '' : '';
  updateDeriveDraftField();
  const hasAvirons = state.draft.navigation?.avirons !== undefined && state.draft.navigation?.avirons !== null;
  avironsToggle.checked = hasAvirons;
  avironsInput.disabled = !hasAvirons;
  setExtraOptionsOpen(!!(state.draft.designation || state.draft.type));
  state.dirty = false;
  state.showFieldErrors = false;
  diagnosticsExpanded = false;
  renderOutput();
}

function readFormIntoDraft() {
  const draft = state.draft || {};
  form.querySelectorAll('[data-path]:not(:disabled)').forEach(input => setByPath(draft, input.dataset.path, inputValue(input)));
  form.querySelectorAll('[data-list-path]').forEach(input => {
    const values = input.value.split(',').map(part => part.trim()).filter(Boolean);
    setByPath(draft, input.dataset.listPath, values.length ? values : []);
  });
  const restrictions = {};
  form.querySelectorAll('[data-restriction]').forEach(select => {
    const zone = select.dataset.restriction;
    if (select.value !== '') {
      draft.__reviewedZones = draft.__reviewedZones || {};
      draft.__reviewedZones[zone] = true;
    }
    const value = restrictionFromSelectValue(select.value);
    if (value !== null) restrictions[zone] = value;
  });
  if (Object.keys(restrictions).length) draft.restrictionNav = restrictions;
  else delete draft.restrictionNav;
  syncDeriveDraft(draft);
  state.draft = cleanupShip(draft);
  state.dirty = true;
  renderOutput();
}

function cleanupShip(ship) {
  const out = cloneShip(ship);
  ['designation', 'type', 'perimetreNaturel', 'notes'].forEach(key => {
    if (out[key] === '') delete out[key];
  });
  ['origineExotique', 'lestInverse'].forEach(key => {
    if (!out[key]) delete out[key];
  });
  if (!out.navigation) out.navigation = {};
  if (!out.tonnage) out.tonnage = {};
  if (!out.equipage) out.equipage = {};
  if (out.dimensions && !Object.keys(out.dimensions).length) delete out.dimensions;
  return out;
}

function setExtraOptionsOpen(open) {
  extraOptionsToggle.checked = open;
  extraOptionsFields.hidden = !open;
}

function updateDeriveDraftField() {
  deriveDraftField.hidden = !deriveToggle.checked;
}

function syncDeriveDraft(draft) {
  const standard = numericInputValue(document.getElementById('field-tirant'));
  if (!deriveToggle.checked) {
    draft.tirantEau = standard;
    return;
  }
  draft.tirantEau = {
    standard,
    deriveLevee: numericInputValue(deriveDraftInput),
  };
}

function activateTab(tabId) {
  document.querySelectorAll('.ship-tab').forEach(tab => {
    const active = tab.dataset.tab === tabId;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    const active = panel.dataset.tabPanel === tabId;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

function validateShip(ship) {
  const errors = [];
  const warns = [];
  const recommended = [];
  const err = (selector, text) => errors.push({ selector, text });
  const rec = (selector, text) => recommended.push({ selector, text });

  const ids = state.ships.filter(s => s.id !== state.selectedId).map(s => s.id);
  if (!ship.id) err('[data-path="id"]', 'Identifiant manquant.');
  if (ids.includes(ship.id)) err('[data-path="id"]', `Identifiant déjà utilisé : ${ship.id}.`);
  if (ship.id === 'nouveau_navire') err('[data-path="id"]', 'Identifiant à personnaliser (encore la valeur par défaut).');
  if (!ship.nom) err('[data-path="nom"]', 'Nom manquant.');
  if (ship.nom === 'Nouveau navire') err('[data-path="nom"]', 'Nom à personnaliser (encore la valeur par défaut).');
  if (!Number.isFinite(Number(ship.categorieTaille))) err('[data-path="categorieTaille"]', 'Catégorie de taille manquante ou invalide.');
  if (!Number.isFinite(Number(ship.niveauNav))) err('[data-path="niveauNav"]', 'Niveau Navigation manquant ou invalide.');
  if (!Number.isFinite(Number(ship.manoeuvrabilite))) err('[data-path="manoeuvrabilite"]', 'Manœuvrabilité manquante ou invalide.');

  const tirantEauObj = ship.tirantEau && typeof ship.tirantEau === 'object';
  const tirantStandard = tirantEauObj ? ship.tirantEau.standard : ship.tirantEau;
  if (!Number.isFinite(Number(tirantStandard))) err('#field-tirant', "Tirant d'eau manquant ou invalide.");
  if (tirantEauObj) {
    const derive = Number(ship.tirantEau.deriveLevee);
    if (!Number.isFinite(derive)) {
      err('#field-tirant-derive', "Tirant d'eau (dérive relevée) manquant ou invalide.");
    } else if (Number.isFinite(Number(tirantStandard)) && derive >= Number(tirantStandard)) {
      err('#field-tirant-derive', "Tirant d'eau (dérive relevée) doit être strictement inférieur au tirant d'eau standard.");
    }
  }

  if (!ship.greement) err('[data-path="greement"]', 'Gréement non défini.');

  ['vitesse_naive', 'pres', 'largue', 'grand_largue', 'vent_arriere'].forEach(key => {
    if (ship.navigation?.[key] === undefined || ship.navigation?.[key] === null) {
      err(`[data-path="navigation.${key}"]`, `Vitesse manquante : ${key}.`);
    }
  });
  if (!Number.isFinite(Number(ship.tonnage?.total))) err('[data-path="tonnage.total"]', 'Tonnage total manquant ou invalide.');
  if (!Number.isFinite(Number(ship.tonnage?.utile))) err('[data-path="tonnage.utile"]', 'Tonnage utile manquant ou invalide.');
  if (!Number.isFinite(Number(ship.equipage?.max))) err('[data-path="equipage.max"]', 'Équipage max manquant ou invalide.');
  if (!Number.isFinite(Number(ship.equipage?.min))) err('[data-path="equipage.min"]', 'Équipage min manquant ou invalide.');
  if (!Number.isFinite(Number(ship.equipage?.standard))) err('[data-path="equipage.standard"]', 'Équipage standard manquant ou invalide.');
  if (!ship.perimetreNaturel) err('[data-path="perimetreNaturel"]', 'Périmètre naturel non défini.');
  if (ship.__isNew) {
    ['fluviale', 'cotiere', 'hauturiere'].forEach(zone => {
      const hasValue = ship.restrictionNav?.[zone] !== undefined;
      const reviewed = hasValue || !!ship.__reviewedZones?.[zone];
      if (!reviewed) err(`[data-restriction="${zone}"]`, `Restriction ${zone} non définie par l'utilisateur.`);
    });
  }
  if (ship.dimensions?.horsTout === undefined || ship.dimensions?.horsTout === null) rec('[data-path="dimensions.horsTout"]', 'Hors-tout non renseigné.');
  if (ship.dimensions?.immergee === undefined || ship.dimensions?.immergee === null) rec('[data-path="dimensions.immergee"]', 'Immergée non renseignée.');
  return { errors, warns, recommended };
}

function renderDiagnostics(validation) {
  const { errors, warns, recommended } = validation;
  const parts = [];
  if (errors.length) parts.push(`${errors.length} erreur${errors.length > 1 ? 's' : ''}`);
  if (warns.length) parts.push(`${warns.length} avertissement${warns.length > 1 ? 's' : ''}`);
  if (recommended.length) parts.push(`${recommended.length} recommandation${recommended.length > 1 ? 's' : ''}`);
  diagnosticsSummaryEl.textContent = parts.length ? parts.join(' · ') : 'Fiche cohérente';

  diagnosticsToggleEl.classList.toggle('has-error', !!errors.length);
  diagnosticsToggleEl.classList.toggle('has-warn', !errors.length && !!(warns.length || recommended.length));
  diagnosticsToggleEl.classList.toggle('ok', !errors.length && !warns.length && !recommended.length);

  diagnosticsToggleEl.setAttribute('aria-expanded', String(diagnosticsExpanded));
  diagnosticsEl.hidden = !diagnosticsExpanded;

  const rows = [
    ...errors.map(({ text }) => ['error', text]),
    ...warns.map(({ text }) => ['warn', text]),
    ...recommended.map(({ text }) => ['recommended', text]),
  ];
  diagnosticsEl.innerHTML = rows.length
    ? rows.map(([type, text]) => `<div class="diagnostic ${type}">${escapeHtml(text)}</div>`).join('')
    : '<div class="diagnostic ok">Fiche cohérente pour les champs contrôlés.</div>';
}

function clearFieldHighlights() {
  form.querySelectorAll('.field-invalid').forEach(el => el.classList.remove('field-invalid'));
  document.querySelectorAll('.ship-tab.has-error').forEach(tab => tab.classList.remove('has-error'));
}

function highlightInvalidFields(errors) {
  clearFieldHighlights();
  const invalidTabs = new Set();
  errors.forEach(({ selector }) => {
    if (!selector) return;
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('field-invalid');
      const pane = el.closest('[data-tab-panel]');
      if (pane) invalidTabs.add(pane.dataset.tabPanel);
    });
  });
  document.querySelectorAll('.ship-tab').forEach(tab => {
    tab.classList.toggle('has-error', invalidTabs.has(tab.dataset.tab));
  });
}

function renderActiveShipLabel(validation) {
  if (!activeShipLabelEl) return;
  const ship = state.draft || selectedShip() || {};
  const nom = ship.nom || '(sans nom)';
  const cat = ship.categorieTaille ?? '?';
  const nav = ship.niveauNav ?? '?';
  activeShipLabelEl.textContent = `${nom} (Cat ${cat} - Nav ${nav})`;
  activeShipLabelEl.classList.toggle('dirty', state.dirty);
  activeShipLabelEl.classList.toggle('has-error', !!validation.errors.length);
  activeShipLabelEl.classList.toggle('has-warn', !validation.errors.length && !!(validation.warns.length || validation.recommended.length));
  activeShipLabelEl.classList.toggle('ok', !validation.errors.length && !validation.warns.length && !validation.recommended.length);
}

function renderOutput() {
  const ship = state.draft || cloneShip(selectedShip());
  dirtyEl.textContent = state.dirty ? 'Modifié' : 'En session';
  const validation = validateShip(ship);
  renderDiagnostics(validation);
  renderActiveShipLabel(validation);
  if (state.showFieldErrors) highlightInvalidFields(validation.errors);
  else clearFieldHighlights();
  exportEl.textContent = formatShipObject(ship);
  btnOpenExport.disabled = state.dirty;
}

function formatShipObject(ship) {
  const exportShip = cloneShip(ship);
  delete exportShip.__isNew;
  delete exportShip.__reviewedZones;
  return stringifyJs(exportShip, 1) + ',';
}

function stringifyJs(value, level = 0) {
  const pad = '  '.repeat(level);
  const nextPad = '  '.repeat(level + 1);
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map(item => stringifyJs(item, 0)).join(', ')}]`;
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  if (!entries.length) return '{}';
  return `{\n${entries.map(([key, val]) => `${nextPad}${key}: ${stringifyJs(val, level + 1)}`).join(',\n')}\n${pad}}`;
}

function duplicateShip() {
  const source = state.draft || selectedShip();
  const copy = cloneShip(source);
  copy.id = `${copy.id || 'navire'}_copie`;
  copy.nom = `${copy.nom || 'Nouveau navire'} (copie)`;
  copy.__isNew = true;
  state.ships.push(copy);
  state.selectedId = copy.id;
  renderList();
  renderForm();
  state.dirty = true;
  renderOutput();
}

function applyDraftToSession() {
  const ship = cleanupShip(state.draft || selectedShip());
  const validation = validateShip(ship);
  state.draft = ship;
  if (validation.errors.length) {
    state.dirty = true;
    state.showFieldErrors = true;
    renderOutput();
    openIssuesModal(validation);
    return;
  }
  const index = state.ships.findIndex(item => item.id === state.selectedId);
  if (index >= 0) state.ships[index] = cloneShip(ship);
  else state.ships.push(cloneShip(ship));
  state.selectedId = ship.id;
  state.draft = cloneShip(ship);
  state.dirty = false;
  state.showFieldErrors = false;
  renderList();
  renderOutput();
}

function openIssuesModal(validation) {
  const body = document.getElementById('issues-body');
  const groups = [];
  if (validation.errors.length) {
    groups.push(`<div class="issues-group required"><h3>Champs requis manquants</h3><ul>${validation.errors.map(({ text }) => `<li>${escapeHtml(text)}</li>`).join('')}</ul></div>`);
  }
  if (validation.recommended.length) {
    groups.push(`<div class="issues-group recommended"><h3>Champs recommandés vides</h3><ul>${validation.recommended.map(({ text }) => `<li>${escapeHtml(text)}</li>`).join('')}</ul></div>`);
  }
  body.innerHTML = groups.join('');
  issuesOverlayEl.hidden = false;
}

function newShip() {
  // Aucune valeur numérique par défaut : categorieTaille, niveauNav,
  // manoeuvrabilite, tirantEau, vitesses, tonnage et équipage doivent
  // rester absents pour que validateShip() les signale comme manquants.
  // Seuls les conteneurs vides sont fournis pour que le formulaire
  // n'échoue pas en lisant navigation.*/tonnage.*/equipage.*.
  const ship = {
    id: 'nouveau_navire',
    nom: 'Nouveau navire',
    navigation: {},
    tonnage: {},
    equipage: {},
    regionRestriction: [],
    notes: '',
    __isNew: true,
  };
  state.ships.push(ship);
  state.selectedId = ship.id;
  renderList();
  renderForm();
  state.dirty = true;
  renderOutput();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function closeModals() {
  exportOverlayEl.hidden = true;
  issuesOverlayEl.hidden = true;
}

function init() {
  renderList();
  renderForm();

  shipSelectEl.addEventListener('change', () => {
    if (!shipSelectEl.value) return;
    state.selectedId = shipSelectEl.value;
    renderList();
    renderForm();
  });
  extraOptionsToggle.addEventListener('change', () => setExtraOptionsOpen(extraOptionsToggle.checked));
  deriveToggle.addEventListener('change', () => {
    updateDeriveDraftField();
    readFormIntoDraft();
  });
  deriveDraftInput.addEventListener('input', readFormIntoDraft);
  avironsToggle.addEventListener('change', () => {
    avironsInput.disabled = !avironsToggle.checked;
    if (!avironsToggle.checked) avironsInput.value = '';
    readFormIntoDraft();
  });
  document.querySelectorAll('.ship-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });
  diagnosticsToggleEl.addEventListener('click', () => {
    diagnosticsExpanded = !diagnosticsExpanded;
    renderOutput();
  });
  form.addEventListener('input', readFormIntoDraft);
  form.addEventListener('change', readFormIntoDraft);
  document.getElementById('btn-apply').addEventListener('click', applyDraftToSession);
  document.getElementById('btn-duplicate').addEventListener('click', duplicateShip);
  document.getElementById('btn-new').addEventListener('click', newShip);
  document.getElementById('btn-open-export').addEventListener('click', () => {
    renderOutput();
    exportOverlayEl.hidden = false;
  });
  document.getElementById('btn-close-export').addEventListener('click', () => {
    exportOverlayEl.hidden = true;
  });
  document.getElementById('btn-close-issues').addEventListener('click', () => {
    issuesOverlayEl.hidden = true;
  });
  exportOverlayEl.addEventListener('click', event => {
    if (event.target === exportOverlayEl) exportOverlayEl.hidden = true;
  });
  issuesOverlayEl.addEventListener('click', event => {
    if (event.target === issuesOverlayEl) issuesOverlayEl.hidden = true;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModals();
  });
  document.getElementById('btn-copy-export').addEventListener('click', () => {
    navigator.clipboard?.writeText(exportEl.textContent);
  });
}

init();
