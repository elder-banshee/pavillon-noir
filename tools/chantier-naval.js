/* global SHIPS_DATA, SHIP_CATEGORIES */
'use strict';

const shipsOriginal = Array.isArray(window.SHIPS_DATA)
  ? window.SHIPS_DATA
  : (typeof SHIPS_DATA !== 'undefined' && Array.isArray(SHIPS_DATA) ? SHIPS_DATA : []);
const shipCategories = window.SHIP_CATEGORIES
  || (typeof SHIP_CATEGORIES !== 'undefined' ? SHIP_CATEGORIES : {});
const state = {
  ships: shipsOriginal.map(cloneShip),
  selectedId: shipsOriginal[0]?.id || '',
  draft: null,
  dirty: false,
};

const form = document.getElementById('ship-form');
const shipSelectEl = document.getElementById('ship-select');
const countEl = document.getElementById('ship-count');
const exportEl = document.getElementById('ship-export');
const diagnosticsEl = document.getElementById('diagnostics');
const dirtyEl = document.getElementById('dirty-state');
const exportOverlayEl = document.getElementById('export-overlay');
const extraOptionsToggle = document.getElementById('toggle-extra-options');
const extraOptionsFields = document.getElementById('extra-options-fields');
const deriveToggle = document.getElementById('toggle-derive');
const deriveDraftField = document.getElementById('derive-draft-field');
const deriveDraftInput = document.getElementById('field-tirant-derive');

function cloneShip(ship) {
  return JSON.parse(JSON.stringify(ship ?? {}));
}

function normaliserTexte(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
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
  if (!value) return null;
  if (value === 'interdit') return 'interdit';
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function refreshFilters() {
  const category = document.getElementById('filter-category');
  const nav = document.getElementById('filter-nav');
  if (!category.dataset.ready) {
    Object.entries(shipCategories).forEach(([value, label]) => {
      category.insertAdjacentHTML('beforeend', `<option value="${value}">${label}</option>`);
    });
    for (let i = 0; i <= 5; i += 1) nav.insertAdjacentHTML('beforeend', `<option value="${i}">Nav ${i}</option>`);
    category.dataset.ready = '1';
  }
}

function filteredShips() {
  const q = normaliserTexte(document.getElementById('ship-search').value);
  const category = document.getElementById('filter-category').value;
  const nav = document.getElementById('filter-nav').value;
  return sortedShips(state.ships.filter(ship => {
    if (q) return shipMatchesSearch(ship, q);
    if (category && String(ship.categorieTaille) !== category) return false;
    if (nav && String(ship.niveauNav) !== nav) return false;
    return true;
  }));
}

function shipMatchesSearch(ship, q) {
  return normaliserTexte([ship.nom, ship.id, ship.notes, ship.designation, ship.type].filter(Boolean).join(' ')).includes(q);
}

function sortedShips(ships) {
  return [...ships].sort((a, b) => {
    const catA = Number(a.categorieTaille ?? 999);
    const catB = Number(b.categorieTaille ?? 999);
    if (catA !== catB) return catA - catB;
    return String(a.nom || a.id).localeCompare(String(b.nom || b.id), 'fr', { sensitivity: 'base' });
  });
}

function renderList() {
  const ships = filteredShips();
  countEl.textContent = `${ships.length} navire${ships.length > 1 ? 's' : ''}`;
  shipSelectEl.innerHTML = ships.length
    ? ships.map(ship => `
      <option value="${escapeHtml(ship.id)}">${escapeHtml(shipLabel(ship))}</option>
    `).join('')
    : '<option value="">Aucun navire</option>';
  if (ships.length && !ships.some(ship => ship.id === state.selectedId)) {
    state.selectedId = ships[0].id;
    renderForm();
  }
  shipSelectEl.value = state.selectedId;
  shipSelectEl.disabled = !ships.length;
}

function shipLabel(ship) {
  return `Cat. ${ship.categorieTaille ?? '?'} · ${ship.nom || ship.id} · Nav ${ship.niveauNav ?? '?'}`;
}

function renderForm() {
  state.draft = cloneShip(selectedShip());
  form.querySelectorAll('[data-path]').forEach(input => setInputValue(input, getByPath(state.draft, input.dataset.path)));
  form.querySelectorAll('[data-list-path]').forEach(input => {
    const values = getByPath(state.draft, input.dataset.listPath);
    input.value = Array.isArray(values) ? values.join(', ') : '';
  });
  form.querySelectorAll('[data-restriction]').forEach(select => {
    const value = state.draft.restrictionNav?.[select.dataset.restriction];
    select.value = value === undefined ? '' : String(value);
  });
  const draftValue = state.draft.tirantEau;
  deriveToggle.checked = !!(draftValue && typeof draftValue === 'object');
  deriveDraftInput.value = draftValue && typeof draftValue === 'object' ? draftValue.deriveLevee ?? '' : '';
  updateDeriveDraftField();
  setExtraOptionsOpen(!!(state.draft.designation || state.draft.type));
  state.dirty = false;
  renderOutput();
}

function readFormIntoDraft() {
  const draft = state.draft || {};
  form.querySelectorAll('[data-path]').forEach(input => setByPath(draft, input.dataset.path, inputValue(input)));
  form.querySelectorAll('[data-list-path]').forEach(input => {
    const values = input.value.split(',').map(part => part.trim()).filter(Boolean);
    setByPath(draft, input.dataset.listPath, values.length ? values : []);
  });
  const restrictions = {};
  form.querySelectorAll('[data-restriction]').forEach(select => {
    const value = restrictionFromSelectValue(select.value);
    if (value !== null) restrictions[select.dataset.restriction] = value;
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
  const diagnostics = [];
  const ids = state.ships.filter(s => s.id !== state.selectedId).map(s => s.id);
  if (!ship.id) diagnostics.push(['error', 'Identifiant manquant.']);
  if (ids.includes(ship.id)) diagnostics.push(['error', `Identifiant déjà utilisé : ${ship.id}.`]);
  if (!ship.nom) diagnostics.push(['error', 'Nom manquant.']);
  if (!Number.isFinite(Number(ship.categorieTaille))) diagnostics.push(['error', 'Catégorie de taille manquante ou invalide.']);
  if (!Number.isFinite(Number(ship.niveauNav))) diagnostics.push(['error', 'Niveau Navigation manquant ou invalide.']);
  if (!Number.isFinite(Number(ship.manoeuvrabilite))) diagnostics.push(['error', 'Manœuvrabilité manquante ou invalide.']);
  ['vitesse_naive', 'pres', 'largue', 'grand_largue', 'vent_arriere'].forEach(key => {
    if (ship.navigation?.[key] === undefined || ship.navigation?.[key] === null) diagnostics.push(['error', `Vitesse manquante : ${key}.`]);
  });
  if (!Number.isFinite(Number(ship.tonnage?.total)) || !Number.isFinite(Number(ship.tonnage?.utile))) diagnostics.push(['error', 'Tonnage total/utile incomplet.']);
  if (!Number.isFinite(Number(ship.equipage?.max)) || !Number.isFinite(Number(ship.equipage?.min))) diagnostics.push(['error', 'Équipage max/min incomplet.']);
  if (!ship.perimetreNaturel) diagnostics.push(['warn', 'Périmètre naturel non relu : affichage en navigation illimitée par défaut.']);
  if (!diagnostics.length) diagnostics.push(['ok', 'Fiche cohérente pour les champs contrôlés.']);
  return diagnostics;
}

function renderOutput() {
  const ship = state.draft || cloneShip(selectedShip());
  dirtyEl.textContent = state.dirty ? 'Modifié' : 'En session';
  const diagnostics = validateShip(ship);
  diagnosticsEl.innerHTML = diagnostics.map(([type, text]) =>
    `<div class="diagnostic ${type}">${escapeHtml(text)}</div>`
  ).join('');
  exportEl.textContent = formatShipObject(ship);
}

function formatShipObject(ship) {
  return stringifyJs(ship, 1) + ',';
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
  state.ships.push(copy);
  state.selectedId = copy.id;
  document.getElementById('ship-search').value = '';
  renderList();
  renderForm();
  state.dirty = true;
  renderOutput();
}

function applyDraftToSession() {
  const ship = cleanupShip(state.draft || selectedShip());
  const hasBlockingError = validateShip(ship).some(([type]) => type === 'error');
  state.draft = ship;
  if (hasBlockingError) {
    state.dirty = true;
    renderOutput();
    return;
  }
  const index = state.ships.findIndex(item => item.id === state.selectedId);
  if (index >= 0) state.ships[index] = cloneShip(ship);
  else state.ships.push(cloneShip(ship));
  state.selectedId = ship.id;
  state.draft = cloneShip(ship);
  state.dirty = false;
  renderList();
  renderOutput();
}

function newShip() {
  const ship = {
    id: 'nouveau_navire',
    nom: 'Nouveau navire',
    categorieTaille: 1,
    tirantEau: 1,
    greement: 'mixte',
    manoeuvrabilite: 0,
    navigation: { vitesse_naive: 0, pres: 0, largue: 0, grand_largue: 0, vent_arriere: 0, avirons: null },
    tonnage: { total: 0, utile: 0, fourchette: false },
    equipage: { max: 0, min: 0, standard: 0, fourchette: false },
    niveauNav: 1,
    regionRestriction: [],
    notes: '',
  };
  state.ships.push(ship);
  state.selectedId = ship.id;
  document.getElementById('ship-search').value = '';
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

function init() {
  refreshFilters();
  renderList();
  renderForm();

  shipSelectEl.addEventListener('change', () => {
    if (!shipSelectEl.value) return;
    state.selectedId = shipSelectEl.value;
    renderList();
    renderForm();
  });
  document.getElementById('ship-search').addEventListener('input', renderList);
  document.getElementById('filter-category').addEventListener('change', renderList);
  document.getElementById('filter-nav').addEventListener('change', renderList);
  extraOptionsToggle.addEventListener('change', () => setExtraOptionsOpen(extraOptionsToggle.checked));
  deriveToggle.addEventListener('change', () => {
    updateDeriveDraftField();
    readFormIntoDraft();
  });
  deriveDraftInput.addEventListener('input', readFormIntoDraft);
  document.querySelectorAll('.ship-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
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
  exportOverlayEl.addEventListener('click', event => {
    if (event.target === exportOverlayEl) exportOverlayEl.hidden = true;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') exportOverlayEl.hidden = true;
  });
  document.getElementById('btn-copy-export').addEventListener('click', () => {
    navigator.clipboard?.writeText(exportEl.textContent);
  });
}

init();
