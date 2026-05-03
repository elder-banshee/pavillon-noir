// ─── État ────────────────────────────────────────────────────
let activeTag = null;
let searchQuery = '';
let activeCard = null;

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildTagFilters();
  renderGrid();
  setupSearch();
  setupModal();
  updateCount();
});

// ─── Construction des filtres de tags ────────────────────────
function buildTagFilters() {
  const allTags = new Set();
  PNJ_DATA.filter(p => p.visible !== false).forEach(p => p.tags.forEach(t => allTags.add(t)));

  // Ordre préférentiel — reflète la liste des tags actifs
  const priority = [
    'Caraïbes', 'Europe',
    'Nassau', 'Trinidad', 'Saint-Domingue', 'Jamaïque', 'Kingston', 'The Pirate Round',
    'Flying Gang', 'Équipage du Captain Charles Johnson',
    'L\'Île des Ombres', 'Satiété engendre Démesure', 'Le dernier voyage de l\'Hippogriffe', 'La Marianne', 'Les épaves de la Flotte au Trésor',
    'Antonio', 'Robert', 'Fanch', 'Edward', 'Dusmatis'
  ];

  const sorted = [
    ...priority.filter(t => allTags.has(t)),
    ...[...allTags].filter(t => !priority.includes(t)).sort()
  ];

  const container = document.getElementById('filter-tags');
  if (!container) return;

  sorted.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = tag;
    btn.dataset.tag = tag;
    btn.addEventListener('click', () => toggleTag(tag, btn));
    container.appendChild(btn);
  });
}

function toggleTag(tag, btn) {
  if (activeTag === tag) {
    activeTag = null;
    btn.classList.remove('active');
  } else {
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    activeTag = tag;
    btn.classList.add('active');
  }
  renderGrid();
  updateCount();
}

// ─── Recherche ───────────────────────────────────────────────
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderGrid();
    updateCount();
  });
}

// ─── Filtrage ────────────────────────────────────────────────
function getFiltered() {
  return PNJ_DATA.filter(p => {
    if (p.visible === false) return false;
    const matchTag  = !activeTag || p.tags.includes(activeTag);
    const haystack  = [p.nom, p.alias, p.origine, p.bio, ...p.tags]
      .filter(Boolean).join(' ').toLowerCase();
    const matchSearch = !searchQuery || haystack.includes(searchQuery);
    return matchTag && matchSearch;
  });
}

function updateCount() {
  const el = document.getElementById('pnj-count');
  if (el) {
    const total = PNJ_DATA.filter(p => p.visible !== false).length;
    const n = getFiltered().length;
    el.textContent = n === total
      ? `${n} personnages`
      : `${n} sur ${total}`;
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
      <div class="pnj-tags">
        ${pnj.tags.slice(0, 4).map(t => `<span class="pnj-tag">${t}</span>`).join('')}
      </div>
    </div>
    ${pnj.pavillon
  ? `<div class="pnj-flag-wrap">
       <svg class="pnj-flag-svg" viewBox="0 0 1139.06 813.41" xmlns="http://www.w3.org/2000/svg">
         <defs>
           <clipPath id="flag-clip-${pnj.id}">
             <path d="M898.35 1c87.83 0 166.26 8.55 239.71 26.14v758.65c-73.48-17.55-151.9-26.08-239.71-26.08-109.66 0-221.14 13.4-328.94 26.36-107.74 12.95-219.16 26.34-328.7 26.34-87.83 0-166.26-8.55-239.71-26.14V27.62C74.48 45.17 152.9 53.7 240.71 53.7c109.66 0 221.13-13.4 328.94-26.36C677.39 14.39 788.8 1 898.35 1"/>
           </clipPath>
         </defs>
         <image href="${pnj.pavillon}" x="0" y="0" width="1139.06" height="813.41"
           preserveAspectRatio="xMidYMid slice"
           clip-path="url(#flag-clip-${pnj.id})"/>
         <path d="M898.35 1c87.83 0 166.26 8.55 239.71 26.14v758.65c-73.48-17.55-151.9-26.08-239.71-26.08-109.66 0-221.14 13.4-328.94 26.36-107.74 12.95-219.16 26.34-328.7 26.34-87.83 0-166.26-8.55-239.71-26.14V27.62C74.48 45.17 152.9 53.7 240.71 53.7c109.66 0 221.13-13.4 328.94-26.36C677.39 14.39 788.8 1 898.35 1m0-1c-219.2 0-438.43 52.7-657.64 52.7C160.48 52.7 80.23 45.64 0 26.35v760.71c80.25 19.29 160.46 26.35 240.71 26.35 219.2 0 438.43-52.7 657.64-52.7 80.23 0 160.48 7.06 240.71 26.35V26.35C1058.81 7.06 978.6 0 898.35 0"
           fill="#c8973a"/>
       </svg>
     </div>`
  : ''
}
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
