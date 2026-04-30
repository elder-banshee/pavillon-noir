// ═══════════════════════════════════════════════════════════
// CHRONIQUES — Scroll horizontal + rail marin + navire
// ═══════════════════════════════════════════════════════════

const NAVIRE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="120" height="70">
  <path d="M10 48 Q20 56 60 58 Q100 56 112 48 L108 44 Q80 50 60 51 Q40 50 14 44 Z"
        fill="rgba(200,151,58,0.15)" stroke="rgba(200,151,58,0.7)" stroke-width="1.2"/>
  <path d="M14 44 Q10 42 12 36 L16 36" fill="none" stroke="rgba(200,151,58,0.6)" stroke-width="1"/>
  <path d="M108 44 Q112 40 110 34 L106 35" fill="none" stroke="rgba(200,151,58,0.6)" stroke-width="1"/>
  <line x1="55" y1="44" x2="55" y2="4" stroke="rgba(200,151,58,0.8)" stroke-width="1.2"/>
  <line x1="32" y1="44" x2="32" y2="14" stroke="rgba(200,151,58,0.7)" stroke-width="1"/>
  <line x1="14" y1="38" x2="2" y2="26" stroke="rgba(200,151,58,0.6)" stroke-width="1"/>
  <path d="M55 6 L82 20 L82 42 L55 42 Z"
        fill="rgba(200,151,58,0.12)" stroke="rgba(200,151,58,0.5)" stroke-width="0.8"/>
  <path d="M32 16 L52 22 L52 42 L32 42 Z"
        fill="rgba(200,151,58,0.1)" stroke="rgba(200,151,58,0.45)" stroke-width="0.8"/>
  <path d="M14 38 L32 18 L32 40 Z"
        fill="rgba(200,151,58,0.08)" stroke="rgba(200,151,58,0.4)" stroke-width="0.8"/>
  <path d="M55 4 L67 8 L55 12 Z" fill="rgba(200,151,58,0.6)" stroke="none"/>
  <line x1="55" y1="8" x2="80" y2="42" stroke="rgba(200,151,58,0.2)" stroke-width="0.6"/>
  <line x1="55" y1="8" x2="36" y2="42" stroke="rgba(200,151,58,0.2)" stroke-width="0.6"/>
  <line x1="32" y1="16" x2="50" y2="42" stroke="rgba(200,151,58,0.15)" stroke-width="0.5"/>
</svg>`;

document.addEventListener('DOMContentLoaded', () => {
  renderCartes();
  buildRail();
  setupScroll();
  setupModal();
});

// ─── Rendu des cartes ────────────────────────────────────────
function renderCartes() {
  const section = document.getElementById('chroniques');
  if (!section) return;
  const visibles = CHRONIQUES.filter(c => c.visible !== false);

  const cartesHtml = visibles.map((c, i) => {
    const metaItems = [
      { label: 'XP',          val: c.meta.xp         > 0 ? '+' + c.meta.xp                  : null },
      { label: 'Gloire',      val: c.meta.gloire      > 0 ? '+' + c.meta.gloire              : null },
      { label: 'Infamie',     val: c.meta.infamie     > 0 ? '+' + c.meta.infamie             : null },
      { label: 'Pi\u00e8ces de 8', val: c.meta.pieces_huit > 0 ? formatNombre(c.meta.pieces_huit) : null },
      { label: 'Recrues',     val: c.meta.recrues     > 0 ? '+' + c.meta.recrues             : null },
      { label: 'Pertes',      val: c.meta.pertes      > 0 ? '\u2212' + c.meta.pertes        : null },
    ].filter(m => m.val !== null);

    const metaHtml = metaItems.length
      ? `<div class="chrono-meta-lire">
          <div class="chrono-meta">${metaItems.map(m =>
            `<div class="chrono-meta-item">
              <span class="chrono-meta-label">${m.label}</span>
              <span class="chrono-meta-val">${m.val}</span>
            </div>`).join('')}</div>
          <button class="chrono-lire" data-id="${c.id}">Lire \u2192</button>
        </div>`
      : `<div class="chrono-meta-lire"><div></div>
          <button class="chrono-lire" data-id="${c.id}">Lire \u2192</button>
        </div>`;

    const illustrationHtml = c.illustration
      ? `<img class="chrono-illustration" src="${c.illustration}" alt="${c.titre}" loading="lazy" draggable="false">`
      : `<div class="chrono-illustration-placeholder">\u2620</div>`;

    return `
      <div class="chrono-carte" data-id="${c.id}" style="animation-delay:${i * 0.08}s">
        <div class="chrono-num-sur-image">${c.numero}</div>
        ${illustrationHtml}
        <div class="chrono-body">
          <h2 class="chrono-titre">${c.titre}</h2>
          ${c.extrait ? `<p class="chrono-extrait">${c.extrait}</p>` : ''}
          ${metaHtml}
        </div>
      </div>`;
  }).join('');

  section.innerHTML = `
    <div class="chrono-piste-wrap" id="chrono-piste-wrap">
      <div class="chrono-piste" id="chrono-piste">${cartesHtml}</div>
    </div>`;

  // Ajuste la hauteur du wrap dynamiquement après rendu
  requestAnimationFrame(() => {
    const piste = document.getElementById('chrono-piste');
    const wrap  = document.getElementById('chrono-piste-wrap');
    if (piste && wrap) {
      // Hauteur des cartes + padding haut + marge rail (130px)
      const carteEl = piste.querySelector('.chrono-carte');
      const carteH  = carteEl ? carteEl.offsetHeight : 0;
      const vh      = window.innerHeight;
      const navH = 64; // hauteur nav fixe
      const paddingBas = Math.max(110, Math.round((vh - navH - carteH) / 2) + navH);
      wrap.style.height = (piste.offsetHeight + paddingBas) + 'px';
    }
  });

  section.querySelectorAll('.chrono-carte').forEach(el => {
    el.addEventListener('click', () => {
      const c = CHRONIQUES.find(c => c.id === el.dataset.id);
      if (c) openModal(c);
    });
  });
  section.querySelectorAll('.chrono-lire').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const c = CHRONIQUES.find(c => c.id === el.dataset.id);
      if (c) openModal(c);
    });
  });
}

// ─── Rail marin ──────────────────────────────────────────────
function buildRail() {
  const W = window.innerWidth;
  const XMIN = W * 0.10;
  const XMAX = W * 0.90;

  const railEl = document.createElement('div');
  railEl.className = 'chrono-rail';
  railEl.id = 'chrono-rail';
  railEl.innerHTML = `
    <svg class="chrono-mer" viewBox="0 0 ${W} 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <line class="mer-ligne" x1="0" y1="52" x2="${W}" y2="52"/>
      <path class="mer-vague mer-vague-1"
        d="M0 48 Q${W*.08} 44 ${W*.16} 48 Q${W*.24} 52 ${W*.32} 48 Q${W*.40} 44 ${W*.48} 48 Q${W*.56} 52 ${W*.64} 48 Q${W*.72} 44 ${W*.80} 48 Q${W*.88} 52 ${W*.96} 48 Q${W} 44 ${W} 48"/>
      <path class="mer-vague mer-vague-2"
        d="M0 56 Q${W*.10} 52 ${W*.20} 56 Q${W*.30} 60 ${W*.40} 56 Q${W*.50} 52 ${W*.60} 56 Q${W*.70} 60 ${W*.80} 56 Q${W*.90} 52 ${W} 56"/>
      <path class="mer-vague mer-vague-3"
        d="M0 44 Q${W*.12} 40 ${W*.25} 44 Q${W*.38} 48 ${W*.50} 44 Q${W*.62} 40 ${W*.75} 44 Q${W*.88} 48 ${W} 44"/>
    </svg>`;
  document.body.appendChild(railEl);

  // Repères de dates répartis entre XMIN et XMAX
  const visibles = CHRONIQUES.filter(c => c.visible !== false);
  const N = visibles.length;
  visibles.forEach((c, i) => {
    const ratio  = N > 1 ? i / (N - 1) : 0.5;
    const x      = XMIN + ratio * (XMAX - XMIN);
    const repere = document.createElement('div');
    repere.className = 'chrono-repere';
    repere.style.left = x + 'px';
    repere.innerHTML = `<div class="chrono-repere-tiret"></div><span class="chrono-repere-date">${c.date_campagne}</span>`;
    railEl.appendChild(repere);
  });

  const navire = document.createElement('div');
  navire.className = 'chrono-navire flottant';
  navire.id = 'chrono-navire';
  navire.innerHTML = NAVIRE_SVG;
  navire.style.left = XMIN + 'px';
  railEl.appendChild(navire);
}

// ─── Scroll et navire ────────────────────────────────────────
function setupScroll() {
  const wrap   = document.getElementById('chrono-piste-wrap');
  const piste  = document.getElementById('chrono-piste');
  const rail   = document.getElementById('chrono-rail');
  const navire = document.getElementById('chrono-navire');
  if (!wrap || !piste || !rail || !navire) return;

  const W    = window.innerWidth;
  const XMIN = W * 0.10;
  const XMAX = W * 0.90;
  let scrollTimer = null;

  function syncNavire() {
    const max   = piste.scrollWidth - wrap.clientWidth;
    const ratio = max > 0 ? wrap.scrollLeft / max : 0;
    navire.style.left = (XMIN + ratio * (XMAX - XMIN)) + 'px';
  }

  // Scroll piste → navire suit
  wrap.addEventListener('scroll', () => {
    syncNavire();
    rail.classList.add('scrolling');
    navire.classList.remove('flottant');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      rail.classList.remove('scrolling');
      navire.classList.add('flottant');
    }, 600);
  }, { passive: true });

  // Molette verticale → scroll horizontal (uniquement dans la zone de la piste)
  piste.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    wrap.scrollLeft += e.deltaY;
  }, { passive: false });

  // Drag piste
  let isDragging = false, startX = 0, startScroll = 0;
  piste.addEventListener('mousedown', e => {
    if (!e.target.closest('.chrono-lire')) {
      isDragging = true;
      startX = e.clientX;
      startScroll = wrap.scrollLeft;
      piste.style.cursor = 'grabbing';
    }
  });
  window.addEventListener('mousemove', e => {
    if (isDragging) wrap.scrollLeft = startScroll - (e.clientX - startX);
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    piste.style.cursor = 'grab';
  });

  // Drag navire → scroll suit
  let shipDragging = false, shipStartX = 0, shipStartScroll = 0;
  navire.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    shipDragging = true;
    shipStartX = e.clientX;
    shipStartScroll = wrap.scrollLeft;
    navire.classList.remove('flottant');
    navire.classList.add('dragging');
    rail.classList.add('scrolling');
  });
  window.addEventListener('mousemove', e => {
    if (!shipDragging) return;
    const dx    = e.clientX - shipStartX;
    const ratio = dx / (XMAX - XMIN);
    const max   = piste.scrollWidth - wrap.clientWidth;
    wrap.scrollLeft = Math.max(0, Math.min(max, shipStartScroll + ratio * max));
  });
  window.addEventListener('mouseup', () => {
    if (shipDragging) {
      shipDragging = false;
      navire.classList.remove('dragging');
      setTimeout(() => {
        rail.classList.remove('scrolling');
        navire.classList.add('flottant');
      }, 600);
    }
  });

  syncNavire();
}

// ─── Modal ───────────────────────────────────────────────────
function setupModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(c) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  if (!overlay || !modal) return;

  const metaHtml = [
    { label: 'Date',          val: c.date_campagne },
    { label: 'XP',            val: c.meta.xp         > 0 ? '+' + c.meta.xp                  : '\u2014' },
    { label: 'Gloire',        val: c.meta.gloire      > 0 ? '+' + c.meta.gloire              : '\u2014' },
    { label: 'Infamie',       val: c.meta.infamie     > 0 ? '+' + c.meta.infamie             : '\u2014' },
    { label: 'Pi\u00e8ces de 8', val: c.meta.pieces_huit > 0 ? formatNombre(c.meta.pieces_huit) : '\u2014' },
    { label: 'Recrues',       val: c.meta.recrues     > 0 ? '+' + c.meta.recrues             : '\u2014' },
    { label: 'Pertes',        val: c.meta.pertes      > 0 ? '\u2212' + c.meta.pertes        : '\u2014' },
  ].map(m => `
    <div class="modal-chrono-meta-item">
      <span class="modal-chrono-meta-label">${m.label}</span>
      <span class="modal-chrono-meta-val">${m.val}</span>
    </div>`).join('');

  const bannerHtml = c.illustration
    ? `<img class="modal-chrono-banner" src="${c.illustration}" alt="${c.titre}">`
    : `<div class="modal-chrono-banner-placeholder">\u2620</div>`;

  modal.innerHTML = `
    <button class="modal-close" onclick="closeModal()" aria-label="Fermer">\u2715</button>
    ${bannerHtml}
    <div class="modal-chrono-body">
      <div class="modal-chrono-num">${c.numero}</div>
      <h2 class="modal-chrono-titre">${c.titre}</h2>
      <div class="modal-chrono-meta">${metaHtml}</div>
      <div class="modal-chrono-texte">${c.texte}</div>
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.scrollTop = 0;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function formatNombre(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + '\u202fk';
  return n.toString();
}
