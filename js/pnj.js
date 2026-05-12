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

// ─── Construction des filtres de tags ────────────────────────
const TAG_CATEGORIES = [
  {
    id: 'geo',
    label: 'Géographie',
    tags: ['Europe','Caraïbes','Nassau','Trinidad','Saint-Domingue','Jamaïque','Kingston','The Pirate Round']
  },
  {
    id: 'factions',
    label: 'Factions',
    tags: ['Flying Gang','Conseil de Nassau','Légendaire','Équipage du Captain Charles Johnson','Piagnoni','Trident','Jésuites']
  },
  {
    id: 'scenarios',
    label: 'Scénarii',
    tags: ["L'Île des Ombres","Satiété engendre Démesure","Le dernier voyage de l'Hippogriffe","La Marianne","Les épaves de la Flotte au Trésor","Courses à Trinidad"]
  },
  {
    id: 'pj',
    label: 'Personnages joueurs',
tags: ['Antonio','Dusmatis','Edward','Fanch','Robert','Bertrand','La Barrique','Amedee','William','Jeremy','Luca']  }
];

function buildTagFilters() {
  const tagsVisibles = new Set();
  PNJ_DATA.filter(p => p.visible !== false)
          .forEach(p => p.tags.forEach(t => tagsVisibles.add(t)));

  const container = document.getElementById('filter-tags');
  if (!container) return;
  container.innerHTML = '';

  // ── Ligne haute : Recherche avancée + panneau ──────────────
  const barreSimple = document.createElement('div');
  barreSimple.className = 'filter-barre-simple';

  const btnAvancee = document.createElement('button');
  btnAvancee.className = 'filter-avancee-btn';
  btnAvancee.id = 'filter-avancee-btn';
  btnAvancee.textContent = 'Recherche avancée';
  btnAvancee.addEventListener('click', () => {
    rechercheAvancee = !rechercheAvancee;
    document.getElementById('filter-avancee-panel').classList
            .toggle('filter-avancee-panel--open', rechercheAvancee);
    // Surbrillance si panneau ouvert OU sélection multiple active
    btnAvancee.classList.toggle('filter-avancee-btn--open',
      rechercheAvancee || multiSelection);
  });
  barreSimple.appendChild(btnAvancee);

  // Panneau inline à droite du bouton
  const avanceePanel = document.createElement('div');
  avanceePanel.className = 'filter-avancee-panel';
  avanceePanel.id = 'filter-avancee-panel';

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
  btnOu.className = 'filter-mode-btn filter-mode-btn--on';
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

  avanceePanel.appendChild(btnMulti);
  avanceePanel.appendChild(btnOu);
  avanceePanel.appendChild(btnEt);
  barreSimple.appendChild(avanceePanel);
  container.appendChild(barreSimple);

  // Ferme le panneau au clic extérieur
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('filter-avancee-panel');
    const btn   = document.getElementById('filter-avancee-btn');
    if (!panel || !btn) return;
    if (!panel.contains(e.target) && e.target !== btn) {
      rechercheAvancee = false;
      panel.classList.remove('filter-avancee-panel--open');
      // Garde la surbrillance si sélection multiple toujours active
      btn.classList.toggle('filter-avancee-btn--open', multiSelection);
    }
  });

  // ── Bouton Tout désélectionner — toujours visible ──────────
  const btnReset = document.createElement('button');
  btnReset.className = 'filter-reset';
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
  container.appendChild(btnReset);

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

function majEtatBoutonsAvances() {
  const btnOu    = document.getElementById('filter-btn-ou');
  const btnEt    = document.getElementById('filter-btn-et');
  const btnReset = document.getElementById('filter-reset');

  if (btnOu) {
    btnOu.disabled = !multiSelection;
    btnOu.classList.toggle('filter-mode-btn--on', multiSelection && filtreMode === 'ou');
  }
  if (btnEt) {
    btnEt.disabled = !multiSelection;
    btnEt.classList.toggle('filter-mode-btn--on', multiSelection && filtreMode === 'et');
  }
  if (btnReset) {
    // Toujours visible, grisé si inutile
    btnReset.disabled = activeTags.size === 0;
  }
}

function toggleCategorie(catId) {
  categorieOuverte = categorieOuverte === catId ? null : catId;
  majEtatFiltres();
}

function majEtatFiltres() {
  const tagsVisibles = new Set();
  PNJ_DATA.filter(p => p.visible !== false)
          .forEach(p => p.tags.forEach(t => tagsVisibles.add(t)));

  // Boutons catégorie
  document.querySelectorAll('.filter-cat-btn').forEach(btn => {
    const catId = btn.dataset.catId;
    const cat   = TAG_CATEGORIES.find(c => c.id === catId);
    const ouvert = categorieOuverte === catId;
    const aTagsActifs = cat.tags.some(t => activeTags.has(t));

    btn.classList.toggle('filter-cat-btn--open', ouvert);
    btn.classList.toggle('filter-cat-btn--actif', aTagsActifs);
    btn.querySelector('.filter-cat-chevron').textContent = ouvert ? '▴' : '▾';
  });

  // Panneau de tags
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
          // Sélection multiple : toggle
          activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
        } else {
          // Sélection simple : un seul tag actif
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

function toggleTag(tag, btn) {
  // Conservé pour compatibilité — la logique est dans majEtatFiltres()
}

// ─── Recherche ───────────────────────────────────────────────
function setupSearch() {
  const input      = document.getElementById('search-input');
  const suggestion = document.getElementById('search-suggestion');
  if (!input) return;

  // Sources de suggestions : noms PNJ en priorité, puis tags
  function getSuggestion(query) {
    if (!query) return '';
    const q = normaliser(query);

    // 1. Noms de PNJ visibles
    const pnjMatch = PNJ_DATA
      .filter(p => p.visible !== false)
      .map(p => p.nom)
      .find(nom => normaliser(nom).startsWith(q));
    if (pnjMatch) return pnjMatch;

    // 2. Alias
    const aliasMatch = PNJ_DATA
      .filter(p => p.visible !== false && p.alias)
      .map(p => p.alias)
      .find(alias => normaliser(alias).startsWith(q));
    if (aliasMatch) return aliasMatch;

    // 3. Tags visibles
    const tagsVisibles = new Set();
    PNJ_DATA.filter(p => p.visible !== false)
            .forEach(p => p.tags.forEach(t => tagsVisibles.add(t)));
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
      // Affiche uniquement la partie non encore tapée, en grisé
      suggestion.textContent = sugg ? searchQuery + sugg.slice(q.length) : '';
    }

    renderGrid();
    updateCount();
  });

  // Accepter la suggestion avec Tab ou →
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
    // Effacer la suggestion sur Escape
    if (e.key === 'Escape') {
      suggestion.textContent = '';
    }
  });

  // Effacer la suggestion si le champ est vidé
  input.addEventListener('search', () => {
    if (!input.value) {
      searchQuery = '';
      if (suggestion) suggestion.textContent = '';
      renderGrid();
      updateCount();
    }
  });
}

// ─── Filtrage ────────────────────────────────────────────────
function normaliser(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
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

    if (filtreMode === 'ou') {
      return matchSearch && p.tags.some(t => activeTags.has(t));
    } else {
      return matchSearch && [...activeTags].every(t => p.tags.includes(t));
    }
  });
}

function updateCount() {
  const el     = document.getElementById('pnj-count');
  const tagWrap = document.getElementById('section-count-tags');
  if (!el) return;

  const total    = PNJ_DATA.filter(p => p.visible !== false).length;
  const filtered = getFiltered();
  const n        = filtered.length;

  if (activeTags.size > 0) {
    el.textContent = `${n} personnage${n > 1 ? 's' : ''} — filtres actifs`;
  } else {
    el.textContent = `${n} personnage${n > 1 ? 's' : ''}`;
  }

  // Tags actifs affichés comme chips
  if (tagWrap) {
    tagWrap.innerHTML = '';
    [...activeTags].forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'count-tag-chip';
      chip.innerHTML = `${tag} <button class="count-tag-remove" aria-label="Retirer ${tag}">×</button>`;
      chip.querySelector('.count-tag-remove').addEventListener('click', () => {
        activeTags.delete(tag);
        majEtatFiltres();
        majEtatBoutonsAvances();
        renderGrid();
        updateCount();
      });
      tagWrap.appendChild(chip);
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
                           .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  // Section "Caribbean's Most Wanted"
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

  // Grille principale
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

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(pnj) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  if (!overlay || !modal) return;

  const statusClass = pnj.statut.toLowerCase();
  const statusLabel = {
    actif: 'Actif', mort: 'Mort', disparu: 'Disparu', inconnu: 'Inconnu'
  }[statusClass] || pnj.statut;

  // Formatage biographie : paragraphes
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