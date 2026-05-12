// ─── État ────────────────────────────────────────────────────
let activeTags       = new Set();
let filtreMode       = 'ou';
let multiSelection   = false;
let searchQuery      = '';
let activeCard       = null;
let categorieOuverte = null;
let rechercheAvancee = false;

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildTagFilters();
  renderGrid();
  setupSearch();
  setupModal();
  updateCount();
});

// ─── Catégories de tags ──────────────────────────────────────
const TAG_CATEGORIES = [
  {
    id: 'geo',
    label: 'Localisation',
    tags: ['Europe','Caraïbes','Nassau','Trinidad','Saint-Domingue','Jamaïque','Kingston','The Pirate Round']
  },
  {
    id: 'nationalite',
    label: 'Nationalité',
    tags: ['Britannique','Espagnol','Français','Hollandais','Portugais','Italien','Mosquito']
  },
  {
    id: 'statut',
    label: 'Statut',
    tags: ['Actif','Mort','Disparu','Inconnu']
  },
  {
    id: 'factions',
    label: 'Faction',
    tags: ['Flying Gang','Conseil de Nassau','Équipage du Captain Charles Johnson','Piagnoni','Trident','Jésuites','Légendes de marins']
  },
  {
    id: 'pj',
    label: 'Relations',
    tags: ['Antonio','Dusmatis','Edward','Fanch','Robert','Bertrand','La Barrique','Amedee','William','Jeremy','Luca']
  },
  {
    id: 'scenarios',
    label: 'Scénarios',
    tags: ["L'Île des Ombres","Satiété engendre Démesure","Le dernier voyage de l'Hippogriffe","La Marianne","Les épaves de la Flotte au Trésor","Courses à Trinidad"]
  },
];

// ─── Construction des filtres ────────────────────────────────
function buildTagFilters() {
  const tagsVisibles = new Set();
  PNJ_DATA.filter(p => p.visible !== false).forEach(p => {
    p.tags.forEach(t => tagsVisibles.add(t));
    extraireNationalites(p).forEach(n => tagsVisibles.add(n));
    tagsVisibles.add(p.statut.charAt(0).toUpperCase() + p.statut.slice(1));
  });

  const container = document.getElementById('filter-tags');
  if (!container) return;
  container.innerHTML = '';

  // ── Barre Options avancées + Tout désélectionner ───────────
  const barreSimple = document.createElement('div');
  barreSimple.className = 'filter-barre-simple';

  const avanceePanel = document.createElement('div');
  avanceePanel.className = 'filter-avancee-panel';
  avanceePanel.id = 'filter-avancee-panel';

  const btnAvancee = document.createElement('button');
  btnAvancee.className = 'filter-avancee-btn';
  btnAvancee.id = 'filter-avancee-btn';
  btnAvancee.textContent = 'Options avancées';
  btnAvancee.addEventListener('click', () => {
    if (multiSelection) return;
    rechercheAvancee = !rechercheAvancee;
    btnAvancee.classList.toggle('filter-avancee-btn--open', rechercheAvancee);
    document.getElementById('filter-avancee-options')
            .classList.toggle('filter-avancee-options--visible', rechercheAvancee);
  });
  avanceePanel.appendChild(btnAvancee);

  const btnMulti = document.createElement('button');
  btnMulti.className = 'filter-multi-btn';
  btnMulti.id = 'filter-multi-btn';
  btnMulti.textContent = 'Sélection multiple';
  btnMulti.addEventListener('click', () => {
    multiSelection = !multiSelection;
    if (!multiSelection) {
      activeTags.clear();
      majEtatFiltres();
      renderGrid();
      updateCount();
    }
    btnMulti.classList.toggle('filter-multi-btn--on', multiSelection);
    majEtatBoutonsAvances();
  });

  const btnOu = document.createElement('button');
  btnOu.className = 'filter-mode-btn';
  btnOu.id = 'filter-btn-ou';
  btnOu.textContent = 'OU';
  btnOu.disabled = true;
  btnOu.addEventListener('click', () => {
    filtreMode = 'ou';
    majEtatBoutonsAvances();
    renderGrid();
    updateCount();
  });

  const btnEt = document.createElement('button');
  btnEt.className = 'filter-mode-btn';
  btnEt.id = 'filter-btn-et';
  btnEt.textContent = 'ET';
  btnEt.disabled = true;
  btnEt.addEventListener('click', () => {
    filtreMode = 'et';
    majEtatBoutonsAvances();
    renderGrid();
    updateCount();
  });

  const options = document.createElement('div');
  options.className = 'filter-avancee-options';
  options.id = 'filter-avancee-options';
  options.appendChild(btnMulti);
  options.appendChild(btnOu);
  options.appendChild(btnEt);
  avanceePanel.appendChild(options);
  barreSimple.appendChild(avanceePanel);

// Reset desktop — dans barreSimple
  const btnReset = document.createElement('button');
  btnReset.className = 'filter-reset filter-reset--desktop';
  btnReset.id = 'filter-reset';
  btnReset.textContent = 'Tout désélectionner';
  btnReset.disabled = true;
  btnReset.addEventListener('click', () => {
    activeTags.clear();
    categorieOuverte = null;
    majEtatFiltres();
    majEtatBoutonsAvances();
    renderGrid();
    updateCount();
  });
  barreSimple.appendChild(btnReset);

  // Reset mobile — hors barreSimple
  const btnResetMobile = document.createElement('button');
  btnResetMobile.className = 'filter-reset filter-reset--mobile';
  btnResetMobile.id = 'filter-reset-mobile';
  btnResetMobile.textContent = 'Tout désélectionner';
  btnResetMobile.disabled = true;
  btnResetMobile.addEventListener('click', () => {
    activeTags.clear();
    categorieOuverte = null;
    majEtatFiltres();
    majEtatBoutonsAvances();
    renderGrid();
    updateCount();
  });

  container.appendChild(barreSimple);
  container.appendChild(btnResetMobile);

  // ── Boutons de catégories ──────────────────────────────────
  const catWrap = document.createElement('div');
  catWrap.className = 'filter-categories';

  TAG_CATEGORIES.forEach(cat => {
    const tagsDispo = cat.tags.filter(t => tagsVisibles.has(t));
    if (tagsDispo.length === 0) return;

    const btnCat = document.createElement('button');
    btnCat.className = 'filter-cat-btn';
    btnCat.dataset.catId = cat.id;
    btnCat.innerHTML = `${cat.label} <span class="filter-cat-chevron">▾</span>`;
    btnCat.addEventListener('click', () => toggleCategorie(cat.id));
    catWrap.appendChild(btnCat);
  });

  container.appendChild(catWrap);

  // ── Panneau de tags ────────────────────────────────────────
  const panneau = document.createElement('div');
  panneau.className = 'filter-panneau';
  panneau.id = 'filter-panneau';
  container.appendChild(panneau);
}

// ─── État des boutons avancés ────────────────────────────────
function majEtatBoutonsAvances() {
  const btnOu    = document.getElementById('filter-btn-ou');
  const btnEt    = document.getElementById('filter-btn-et');
  const btnReset = document.getElementById('filter-reset');
  const options  = document.getElementById('filter-avancee-options');
  const btnAvancee = document.getElementById('filter-avancee-btn');

  if (btnOu) {
    btnOu.disabled = !multiSelection;
    btnOu.classList.toggle('filter-mode-btn--on', multiSelection && filtreMode === 'ou');
  }
  if (btnEt) {
    btnEt.disabled = !multiSelection;
    btnEt.classList.toggle('filter-mode-btn--on', multiSelection && filtreMode === 'et');
  }
  const btnResetMobile = document.getElementById('filter-reset-mobile');
  if (btnReset) btnReset.disabled = activeTags.size === 0;
  if (btnResetMobile) btnResetMobile.disabled = activeTags.size === 0;
  if (options && multiSelection) {
    options.classList.add('filter-avancee-options--visible');
  }
  if (btnAvancee) {
    btnAvancee.classList.toggle('filter-avancee-btn--open',
      rechercheAvancee || multiSelection);
  }
}

// ─── Catégories ──────────────────────────────────────────────
function toggleCategorie(catId) {
  categorieOuverte = categorieOuverte === catId ? null : catId;
  majEtatFiltres();
}

function majEtatFiltres() {
  const tagsVisibles = new Set();
  PNJ_DATA.filter(p => p.visible !== false).forEach(p => {
    p.tags.forEach(t => tagsVisibles.add(t));
    extraireNationalites(p).forEach(n => tagsVisibles.add(n));
    tagsVisibles.add(p.statut.charAt(0).toUpperCase() + p.statut.slice(1));
  });

  document.querySelectorAll('.filter-cat-btn').forEach(btn => {
    const catId = btn.dataset.catId;
    const cat   = TAG_CATEGORIES.find(c => c.id === catId);
    const ouvert = categorieOuverte === catId;
    const aTagsActifs = cat.tags.some(t => activeTags.has(t));

    btn.classList.toggle('filter-cat-btn--open', ouvert);
    btn.classList.toggle('filter-cat-btn--actif', aTagsActifs);
    btn.querySelector('.filter-cat-chevron').textContent = ouvert ? '▴' : '▾';
  });

  const panneau = document.getElementById('filter-panneau');
  if (!panneau) return;
  panneau.innerHTML = '';

  if (categorieOuverte) {
    const cat = TAG_CATEGORIES.find(c => c.id === categorieOuverte);
    const tagsDispo = cat.tags.filter(t => tagsVisibles.has(t));

    tagsDispo.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-tag' + (activeTags.has(tag) ? ' active' : '');
      btn.textContent = tag;
      btn.addEventListener('click', () => {
        if (multiSelection) {
          activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
        } else {
          if (activeTags.has(tag)) {
            activeTags.clear();
          } else {
            activeTags.clear();
            activeTags.add(tag);
          }
        }
        majEtatFiltres();
        majEtatBoutonsAvances();
        renderGrid();
        updateCount();
      });
      panneau.appendChild(btn);
    });
  }

  majEtatBoutonsAvances();
}

// ─── Recherche ───────────────────────────────────────────────
function setupSearch() {
  const input      = document.getElementById('search-input');
  const suggestion = document.getElementById('search-suggestion');
  if (!input) return;

  function getSuggestion(query) {
    if (!query) return '';
    const q = normaliser(query);

    const pnjMatch = PNJ_DATA
      .filter(p => p.visible !== false)
      .map(p => p.nom)
      .find(nom => normaliser(nom).startsWith(q));
    if (pnjMatch) return pnjMatch;

    const aliasMatch = PNJ_DATA
      .filter(p => p.visible !== false && p.alias)
      .map(p => p.alias)
      .find(alias => normaliser(alias).startsWith(q));
    if (aliasMatch) return aliasMatch;

    const tagsVisibles = new Set();
  PNJ_DATA.filter(p => p.visible !== false).forEach(p => {
    p.tags.forEach(t => tagsVisibles.add(t));
    extraireNationalites(p).forEach(n => tagsVisibles.add(n));
    tagsVisibles.add(p.statut.charAt(0).toUpperCase() + p.statut.slice(1));
  });
    const tagMatch = [...tagsVisibles]
      .find(t => normaliser(t).startsWith(q));
    if (tagMatch) return tagMatch;

    return '';
  }

  input.addEventListener('input', e => {
    searchQuery = e.target.value;
    const q = searchQuery.trim();

    if (suggestion) {
      const sugg = getSuggestion(q);
      suggestion.textContent = sugg ? searchQuery + sugg.slice(q.length) : '';
    }

    renderGrid();
    updateCount();
  });

  input.addEventListener('keydown', e => {
    if (!suggestion || !suggestion.textContent) return;
    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault();
      input.value  = suggestion.textContent;
      searchQuery  = input.value;
      suggestion.textContent = '';
      renderGrid();
      updateCount();
    }
    if (e.key === 'Escape') {
      suggestion.textContent = '';
    }
  });

  input.addEventListener('search', () => {
    if (!input.value) {
      searchQuery = '';
      if (suggestion) suggestion.textContent = '';
      renderGrid();
      updateCount();
    }
  });
}

// ─── Normalisation et filtrage ───────────────────────────────
function normaliser(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function tronquer(str, max) {
  if (str.length <= max) return str;
  let fin = max - 1;
  if (' .,;:!?'.includes(str[fin])) fin--;
  return str.slice(0, fin) + '…';
}

function getFiltered() {
  return PNJ_DATA.filter(p => {
    if (p.visible === false) return false;

    const haystack = normaliser(
      [p.nom, p.alias, p.origine, p.bio, ...p.tags]
        .filter(Boolean).join(' ')
    );
    const matchSearch = !searchQuery || haystack.includes(normaliser(searchQuery));

    if (activeTags.size === 0) return matchSearch;

    // Tags étendus : tags + nationalités + statut
    const tagsEtendus = [
      ...p.tags,
      ...extraireNationalites(p),
      p.statut.charAt(0).toUpperCase() + p.statut.slice(1)
    ];

    if (filtreMode === 'ou') {
      return matchSearch && tagsEtendus.some(t => activeTags.has(t));
    } else {
      return matchSearch && [...activeTags].every(t => tagsEtendus.includes(t));
    }
  });
}
// ─── Extraction de nationalité ───────────────────────────────
const NATIONALITE_MAP = {
  'anglais': 'Britannique', 'anglaise': 'Britannique',
  'ecossais': 'Britannique', 'ecossaise': 'Britannique',
  'irlandais': 'Britannique', 'irlandaise': 'Britannique',
  'gallois': 'Britannique', 'galloise': 'Britannique',
  'francais': 'Français', 'francaise': 'Français',
  'hollandais': 'Hollandais', 'hollandaise': 'Hollandais',
  'espagnol': 'Espagnol', 'espagnole': 'Espagnol',
  'portugais': 'Portugais', 'portugaise': 'Portugais',
  'italien': 'Italien', 'italienne': 'Italien',
  'mosquito': 'Mosquito',
};

function extraireNationalites(pnj) {
  // Champ explicite prioritaire
  if (pnj.nationalites && pnj.nationalites.length) return pnj.nationalites;

  if (!pnj.origine) return [];

  // Extraire la partie avant la première parenthèse ou virgule
  const brut = pnj.origine.split(/[,(]/)[0].trim();
  const cle  = normaliser(brut);
  const nat  = NATIONALITE_MAP[cle];
  return nat ? [nat] : [];
}

// ─── Compteur de résultats ───────────────────────────────────
function updateCount() {
  const el          = document.getElementById('pnj-count');
  const tagWrap     = document.getElementById('section-count-tags');
  const activeWrap  = document.getElementById('active-filters-wrap');
  if (!el) return;

  const n = getFiltered().length;
  const mobile = window.innerWidth <= 640;

  el.innerHTML = activeTags.size > 0 && !mobile
    ? `${n} personnage${n > 1 ? 's' : ''} <span class="count-filtres-actifs">— filtres actifs</span>`
    : `${n} personnage${n > 1 ? 's' : ''}`;

  // Chips — desktop dans tagWrap, mobile dans activeWrap
  const cible = mobile && activeWrap ? activeWrap : tagWrap;
  if (tagWrap) tagWrap.innerHTML = '';
  if (activeWrap) activeWrap.innerHTML = '';

  if (activeTags.size > 0) {
    if (mobile && activeWrap) {
      const label = document.createElement('span');
      label.className = 'count-filtres-actifs-mobile';
      label.textContent = '— filtres actifs';
      activeWrap.appendChild(label);
    }
    [...activeTags].forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'count-tag-chip';
      const mobile = window.innerWidth <= 640;
      const label = mobile ? tronquer(tag, 15) : tag;
      if (mobile) {
        chip.textContent = label;
        chip.style.cursor = 'pointer';
        chip.addEventListener('click', () => {
          activeTags.delete(tag);
          majEtatFiltres();
          majEtatBoutonsAvances();
          renderGrid();
          updateCount();
        });
      } else {
        chip.innerHTML = `${tag} <button class="count-tag-remove" aria-label="Retirer ${tag}">×</button>`;
        chip.querySelector('.count-tag-remove').addEventListener('click', () => {
          activeTags.delete(tag);
          majEtatFiltres();
          majEtatBoutonsAvances();
          renderGrid();
          updateCount();
        });
      }
      cible.appendChild(chip);
    });
  }
}

// ─── Rendu de la grille ──────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('pnj-grid');
  if (!grid) return;

  const filtered = getFiltered();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Aucun personnage ne correspond à cette recherche.';
    grid.appendChild(empty);
    return;
  }

  const epingles = filtered.filter(p => p.epingle === true);
  const reste    = filtered.filter(p => p.epingle !== true)
                           .sort((a, b) => a.id.localeCompare(b.id, 'fr'));

  if (epingles.length > 0) {
    const wantedHeader = document.createElement('div');
    wantedHeader.className = 'wanted-header';
    wantedHeader.innerHTML = `
      <div class="wanted-header-line"></div>
      <span class="wanted-title">Caribbean's Most Wanted</span>
      <div class="wanted-header-line"></div>
    `;
    grid.appendChild(wantedHeader);

    const wantedGrid = document.createElement('div');
    wantedGrid.className = 'pnj-grid wanted-grid';
    epingles.forEach((pnj, i) => wantedGrid.appendChild(buildCard(pnj, i, true)));
    grid.appendChild(wantedGrid);

    if (reste.length > 0) {
      const divider = document.createElement('div');
      divider.className = 'wanted-divider';
      grid.appendChild(divider);
    }
  }

  if (reste.length > 0) {
    const mainGrid = document.createElement('div');
    mainGrid.className = 'pnj-grid';
    reste.forEach((pnj, i) => mainGrid.appendChild(buildCard(pnj, i, false)));
    grid.appendChild(mainGrid);
  }
}

function buildCard(pnj, index, epingle = false) {
  const card = document.createElement('article');
  card.className = epingle ? 'pnj-card pnj-card--wanted' : 'pnj-card';
  card.style.animationDelay = `${index * 0.04}s`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ouvrir la fiche de ${pnj.nom}`);

  const statusClass = pnj.statut.toLowerCase();
  const statusLabel = {
    actif: 'Actif', mort: 'Mort', disparu: 'Disparu', inconnu: 'Inconnu'
  }[statusClass] || pnj.statut;

  card.innerHTML = `
    ${pnj.portrait
      ? `<img class="pnj-portrait" src="${pnj.portrait}" alt="Portrait de ${pnj.nom}" loading="lazy">`
      : `<div class="pnj-portrait-placeholder">${silhouetteSVG()}</div>`
    }
    <div class="pnj-body">
      <div class="pnj-status">
        <span class="pnj-status-dot ${statusClass}"></span>
        ${statusLabel}
      </div>
      <h2 class="pnj-name">${pnj.nom}</h2>
      ${pnj.accroche ? `<div class="pnj-alias">${pnj.accroche}</div>` : ''}
      ${pnj.origine ? `<div class="pnj-origin">${pnj.origine}</div>` : ''}
    </div>
  `;

  card.addEventListener('click', () => openModal(pnj));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(pnj); });

  return card;
}

// ─── Modal ───────────────────────────────────────────────────
function setupModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(pnj) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  if (!overlay || !modal) return;

  const statusClass = pnj.statut.toLowerCase();
  const statusLabel = {
    actif: 'Actif', mort: 'Mort', disparu: 'Disparu', inconnu: 'Inconnu'
  }[statusClass] || pnj.statut;

  const bioParagraphs = (pnj.bio || '')
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('');

  modal.innerHTML = `
    <div class="modal-portrait-col">
      ${pnj.portrait
        ? `<img class="modal-portrait" src="${pnj.portrait}" alt="Portrait de ${pnj.nom}">`
        : `<div class="modal-portrait-placeholder">${silhouetteSVG()}</div>`
      }
      ${sourceCredit(pnj, 'portrait')}
      ${pnj.pavillon
        ? `<img class="modal-pavillon" src="${pnj.pavillon}" alt="Pavillon de ${pnj.nom}" loading="lazy">`
        : ''
      }
      ${sourceCredit(pnj, 'pavillon')}
    </div>
    <div class="modal-body">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer">✕</button>
      <div class="modal-status pnj-status">
        <span class="pnj-status-dot ${statusClass}"></span>
        ${statusLabel}
      </div>
      <h2 class="modal-name">${pnj.nom}</h2>
      ${pnj.accroche ? `<div class="modal-alias">${pnj.accroche}</div>` : ''}
      ${pnj.alias ? `<div class="modal-alias" style="font-size:0.95rem; opacity:0.7;">${pnj.alias}</div>` : ''}
      <div class="modal-meta">
        ${pnj.origine ? `
          <div class="modal-meta-item">
            <span class="modal-meta-label">Origine</span>
            <span class="modal-meta-value">${pnj.origine}</span>
          </div>` : ''}
        ${pnj.naissance ? `
          <div class="modal-meta-item">
            <span class="modal-meta-label">Naissance / Décès</span>
            <span class="modal-meta-value">${pnj.naissance}</span>
          </div>` : ''}
      </div>
      <div class="modal-bio">${bioParagraphs}</div>
      ${pnj.tags.length ? `
        <div class="modal-tags">
          ${pnj.tags.map(t => `<span class="pnj-tag">${t}</span>`).join('')}
        </div>` : ''}
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  activeCard = pnj;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  activeCard = null;
}

// ─── SVG silhouette ──────────────────────────────────────────
function silhouetteSVG() {
  return `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="28" r="16" fill="currentColor"/>
    <path d="M8 95c0-17.673 14.327-32 32-32s32 14.327 32 32" fill="currentColor"/>
  </svg>`;
}

// ─── Crédit source ───────────────────────────────────────────
function sourceCredit(pnj, objet) {
  if (!pnj.source || !pnj.source.length) return '';
  const s = pnj.source.find(s => s.objet === objet);
  if (!s) return '';
  return `<div class="modal-source">
    ${s.credit}
    ${s.url ? `<a class="modal-source-link" href="${s.url}" target="_blank" rel="noopener" aria-label="Voir la source">↗</a>` : ''}
  </div>`;
}
