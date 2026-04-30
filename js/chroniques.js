// ═══════════════════════════════════════════════════════════
// CHRONIQUES — Rendu de la frise
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderFrise();
  setupModal();
});

// ─── Rendu de la frise ───────────────────────────────────────
function renderFrise() {
  const frise = document.getElementById('frise');
  if (!frise) return;

  const visibles = CHRONIQUES.filter(c => c.visible !== false);

  if (visibles.length === 0) {
    frise.innerHTML = '<p style="text-align:center;color:var(--mist);font-style:italic;padding:4rem 0">Aucune chronique disponible pour le moment.</p>';
    return;
  }

  frise.innerHTML = visibles.map((c, i) => {
    const cote  = i % 2 === 0 ? 'gauche' : 'droite';
    const delai = i * 0.1;

    // Métadonnées — on n'affiche que celles qui ont une valeur
    const metaItems = [
      { label: 'XP',         val: c.meta.xp          > 0 ? '+' + c.meta.xp                  : null },
      { label: 'Gloire',     val: c.meta.gloire       > 0 ? '+' + c.meta.gloire              : null },
      { label: 'Infamie',    val: c.meta.infamie      > 0 ? '+' + c.meta.infamie             : null },
      { label: 'Pièces de 8',val: c.meta.pieces_huit  > 0 ? formatNombre(c.meta.pieces_huit) : null },
      { label: 'Recrues',    val: c.meta.recrues      > 0 ? '+' + c.meta.recrues             : null },
      { label: 'Pertes',     val: c.meta.pertes       > 0 ? '−' + c.meta.pertes             : null },
    ].filter(m => m.val !== null);

    const metaHtml = metaItems.length
      ? `<div class="frise-meta">${metaItems.map(m => `
          <div class="frise-meta-item">
            <span class="frise-meta-label">${m.label}</span>
            <span class="frise-meta-val">${m.val}</span>
          </div>`).join('')}</div>`
      : '';

    const illustrationHtml = c.illustration
      ? `<img class="frise-illustration" src="${c.illustration}" alt="Illustration — ${c.titre}" loading="lazy">`
      : `<div class="frise-illustration-placeholder">☠</div>`;

    const carte = `
      <div class="frise-carte" data-id="${c.id}" style="animation-delay:${delai}s">
        ${illustrationHtml}
        <div class="frise-body">
          <div class="frise-num">${c.numero}</div>
          <h2 class="frise-titre">${c.titre}</h2>
          ${c.extrait ? `<p class="frise-extrait">${c.extrait}</p>` : ''}
          ${metaHtml}
          <button class="frise-lire" data-id="${c.id}">Lire la chronique →</button>
        </div>
      </div>`;

    const point = `
      <div class="frise-point">
        <div class="frise-point-dot"></div>
        <span class="frise-point-date">${c.date_campagne}</span>
      </div>`;

    return `
      <div class="frise-entree frise-entree--${cote}">
        ${cote === 'gauche' ? carte            : '<div class="frise-vide"></div>'}
        ${point}
        ${cote === 'droite' ? carte            : '<div class="frise-vide"></div>'}
      </div>`;
  }).join('');

  // Événements — carte entière ET bouton déclenchent la modal
  frise.querySelectorAll('.frise-carte').forEach(el => {
    el.addEventListener('click', () => {
      const chronique = CHRONIQUES.find(c => c.id === el.dataset.id);
      if (chronique) openModal(chronique);
    });
  });

  // Empêche le double déclenchement du bouton
  frise.querySelectorAll('.frise-lire').forEach(el => {
    el.addEventListener('click', e => e.stopPropagation());
  });
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

function openModal(c) {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  if (!overlay || !modal) return;

  const metaHtml = [
    { label: 'Date',        val: c.date_campagne },
    { label: 'XP',          val: c.meta.xp         > 0 ? '+' + c.meta.xp                  : '—' },
    { label: 'Gloire',      val: c.meta.gloire      > 0 ? '+' + c.meta.gloire              : '—' },
    { label: 'Infamie',     val: c.meta.infamie     > 0 ? '+' + c.meta.infamie             : '—' },
    { label: 'Pièces de 8', val: c.meta.pieces_huit > 0 ? formatNombre(c.meta.pieces_huit) : '—' },
    { label: 'Recrues',     val: c.meta.recrues     > 0 ? '+' + c.meta.recrues             : '—' },
    { label: 'Pertes',      val: c.meta.pertes      > 0 ? '−' + c.meta.pertes             : '—' },
  ].map(m => `
    <div class="modal-chrono-meta-item">
      <span class="modal-chrono-meta-label">${m.label}</span>
      <span class="modal-chrono-meta-val">${m.val}</span>
    </div>`).join('');

  const bannerHtml = c.illustration
    ? `<img class="modal-chrono-banner" src="${c.illustration}" alt="${c.titre}">`
    : `<div class="modal-chrono-banner-placeholder">☠</div>`;

  modal.innerHTML = `
    <button class="modal-close" onclick="closeModal()" aria-label="Fermer">✕</button>
    ${bannerHtml}
    <div class="modal-chrono-body">
      <div class="modal-chrono-num">${c.numero}</div>
      <h2 class="modal-chrono-titre">${c.titre}</h2>
      <div class="modal-chrono-meta">${metaHtml}</div>
      <div class="modal-chrono-texte">${c.texte}</div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.scrollTop = 0;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Utilitaires ─────────────────────────────────────────────
function formatNombre(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + '\u202fk';
  return n.toString();
}
