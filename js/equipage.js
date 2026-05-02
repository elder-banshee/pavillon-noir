// ═══════════════════════════════════════════════════════════
// ÉQUIPAGE — Données et rendu
// ═══════════════════════════════════════════════════════════

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv';

const APPRECIATION = "Équipage hétéroclite mais combatif — les pirates et déserteurs de la Navy forment un noyau dur expérimenté, compensant les lacunes navales des boucaniers et recrues récentes. La cohésion reste à construire.";

const COMPETENCES = [
  "Manœuvre",
  "Canonnade",
  "Recharge",
  "Combat",
  "Tir",
  "Ruse"
];

// ─── Barre de compétence (échelle 0–5, cas spécial 6+) ───────
function buildStatBar(val) {
  const MAX_NORMAL = 5;
  let revealPct, transitionPct;

  if (val <= MAX_NORMAL) {
    revealPct     = Math.round((val / MAX_NORMAL) * 100);
    transitionPct = 50;
  } else {
    revealPct     = 100;
    transitionPct = Math.max(0, 50 - (val - MAX_NORMAL) * 10);
  }

  // Le gradient est sur la barre de fond (100% de large)
  // Le reveal ne montre que la portion gauche proportionnelle à val
  const gradient = `linear-gradient(90deg,
    #1a3a52 0%,
    var(--sea-light) ${transitionPct * 0.5}%,
    #9a7a28 ${transitionPct}%,
    var(--gold) ${Math.min(transitionPct + 25, 100)}%
  )`;

  return `
    <div class="stat-bar" style="background:${gradient}">
      <div class="stat-bar-reveal" data-target="${revealPct}"></div>
    </div>`;
}

// ─── Barre de composition (échelle 0–100%) ────────────────────
function buildCrewBar(pct) {
  return `
    <div class="crew-bar-wrap">
      <div class="crew-bar-reveal" data-target="${pct}">
        <div class="crew-bar-fill"></div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadAll();
});

async function loadAll() {
  const grid      = document.getElementById('stats-grid');
  const appr      = document.getElementById('stats-appreciation');
  const crewTable = document.getElementById('crew-table');
  const crewTotal = document.getElementById('crew-total');

  if (appr) appr.textContent = APPRECIATION;

  try {
    const response = await fetch(SHEETS_URL);
    if (!response.ok) throw new Error('Erreur réseau');

    const text = await response.text();
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // ── Ligne 1 : compétences moyennes
    if (grid && lines.length >= 1) {
      const vals = lines[0].split(',').map(c => parseFloat(c.trim()));
      if (vals.length >= 6 && !vals.slice(0,6).some(isNaN)) {
        grid.innerHTML = '';
        COMPETENCES.forEach((label, i) => {
          const val = vals[i];
          const block = document.createElement('div');
          block.className = 'stat-block';
          block.innerHTML = `
            <span class="stat-label">${label}</span>
            <span class="stat-value">${val % 1 === 0 ? val : val.toFixed(1)}</span>
            ${buildStatBar(val)}
          `;
          grid.appendChild(block);
        });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          grid.querySelectorAll('.stat-bar-reveal').forEach(b => {
            b.style.width = (100 - parseInt(b.dataset.target)) + '%';
          });
        }));
      } else {
        grid.innerHTML = `<div class="stat-loading">Format inattendu.</div>`;
      }
    }

    // ── Lignes 2+ : composition + stats détaillées
    // Colonnes : nom, effectif, man, can, rec, com, tir, ruse
    if (crewTable && lines.length >= 2) {
      const composition = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(c => c.trim());
        const nom = cells[0];
        const effectif = parseInt(cells[1]);
        if (!nom || isNaN(effectif) || effectif <= 0) continue;
        const stats = cells.slice(2, 8).map(c => parseFloat(c));
        const hasStats = stats.length >= 6 && !stats.some(isNaN);
        composition.push({ categorie: nom, effectif, stats: hasStats ? stats : null });
      }

      const total = composition.reduce((s, c) => s + c.effectif, 0);

      crewTable.innerHTML = composition.map(c => {
        const pct = Math.round((c.effectif / total) * 100);
        const tooltipHtml = c.stats
          ? `<div class="crew-tooltip">${COMPETENCES.map((label, i) =>
              `<span class="crew-tooltip-stat">
                <span class="crew-tooltip-label">${label}</span>
                <span class="crew-tooltip-val">${c.stats[i]}</span>
              </span>`).join('')}</div>`
          : '';
        return `
          <div class="crew-row">
            <span class="crew-category${c.stats ? ' crew-category--has-tooltip' : ''}">
              ${c.categorie}
              ${tooltipHtml}
            </span>
            ${buildCrewBar(pct)}
            <span class="crew-count">${c.effectif}</span>
          </div>`;
      }).join('');

      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.querySelectorAll('.crew-bar-reveal').forEach(b => { b.style.width = b.dataset.target + '%'; });
      }));

      if (crewTotal) {
        crewTotal.innerHTML = `<span>Total</span><span class="crew-total-value">${total} hommes</span>`;
      }
    }

  } catch (err) {
    if (grid) grid.innerHTML = `<div class="stat-loading">Impossible de charger les données.</div>`;
    console.warn('Erreur chargement :', err);
  }
}
