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
  PNJ_DATA.forEach(p => p.tags.forEach(t => allTags.add(t)));

  // Ordre préférentiel
  const priority = [
    'Nassau', 'Cap-Français', 'La Tortue', 'Caraïbes', 'Europe',
    'Jamaïque', 'Kingston', 'Trinidad',
    'SED', 'Île-des-Ombres', 'Épaves-Flotte-au-Trésor',
    'Antonio', 'Robert', 'Fanch', 'Edward', 'Dusmatis', 'Luca'
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
    const n = getFiltered().length;
    el.textContent = n === PNJ_DATA.length
      ? `${n} personnages`
      : `${n} sur ${PNJ_DATA.length}`;
  }
}

// ─── Rendu de la grille ──────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('pnj-grid');
  if (!grid) return;

  const filtered = getFiltered();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-state">Aucun personnage ne correspond à cette recherche.</p>';
    return;
  }

  filtered.forEach((pnj, i) => {
    const card = buildCard(pnj, i);
    grid.appendChild(card);
  });
}

function buildCard(pnj, index) {
  const card = document.createElement('article');
  card.className = 'pnj-card';
  card.style.animationDelay = `${index * 0.04}s`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ouvrir la fiche de ${pnj.nom}`);

  const statusClass = pnj.statut.toLowerCase();
  const statusLabel = {
    vivant: 'Vivant', mort: 'Mort', disparu: 'Disparu', inconnu: 'Inconnu'
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
      ${pnj.alias ? `<div class="pnj-alias">${pnj.alias}</div>` : ''}
      ${pnj.origine ? `<div class="pnj-origin">${pnj.origine}</div>` : ''}
      <div class="pnj-tags">
        ${pnj.tags.slice(0, 4).map(t => `<span class="pnj-tag">${t}</span>`).join('')}
      </div>
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
    vivant: 'Vivant', mort: 'Mort', disparu: 'Disparu', inconnu: 'Inconnu'
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
      ${pnj.alias ? `<div class="modal-alias">${pnj.alias}</div>` : ''}

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
