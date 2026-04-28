// ═══════════════════════════════════════════════════════════
// ÉQUIPAGE — Données et rendu
// ═══════════════════════════════════════════════════════════

// ─── URL Google Sheets CSV (Feuille 3 — valeurs site) ────────
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv';

// ─── Composition de l'équipage ───────────────────────────────
const COMPOSITION = [
  { categorie: "Pirates",                     effectif: 5 },
  { categorie: "Boucaniers",                  effectif: 5 },
  { categorie: "Engagés",                     effectif: 3 },
  { categorie: "Déserteurs de la Royal Navy", effectif: 5 },
  { categorie: "Esclaves marrons",            effectif: 3 },
];

// ─── Appréciation qualitative ────────────────────────────────
const APPRECIATION = "Équipage hétéroclite mais combatif — les pirates et boucaniers forment un noyau dur expérimenté, compensant les lacunes navales des déserteurs et recrues récentes. La cohésion reste à construire.";

// ─── Libellés des compétences (ordre = colonnes Feuille 3) ───
const COMPETENCES = [
  "Manœuvre",
  "Canonnade",
  "Recharge",
  "Combat",
  "Tir",
  "Ruse"
];

// ═══════════════════════════════════════════════════════════
// RENDU
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderComposition();
  loadStats();
});

// ─── Composition ─────────────────────────────────────────────
function renderComposition() {
  const total = COMPOSITION.reduce((s, c) => s + c.effectif, 0);
  const container = document.getElementById('crew-table');
  const totalEl   = document.getElementById('crew-total');
  if (!container) return;

  container.innerHTML = COMPOSITION.map(c => {
    const pct = Math.round((c.effectif / total) * 100);
    return `
      <div class="crew-row">
        <span class="crew-category">${c.categorie}</span>
        <div class="crew-bar-wrap">
          <div class="crew-bar-fill" style="width: ${pct}%"></div>
        </div>
        <span class="crew-count">${c.effectif}</span>
      </div>
    `;
  }).join('');

  if (totalEl) {
    totalEl.innerHTML = `
      <span>Total</span>
      <span class="crew-total-value">${total} hommes</span>
    `;
  }
}

// ─── Statistiques depuis Google Sheets ───────────────────────
async function loadStats() {
  const grid = document.getElementById('stats-grid');
  const appr = document.getElementById('stats-appreciation');

  if (appr) appr.textContent = APPRECIATION;
  if (!grid) return;

  try {
    const response = await fetch(SHEETS_URL);
    if (!response.ok) throw new Error('Erreur réseau');

    const text = await response.text();

    // Feuille 3 : une seule ligne avec 6 valeurs numériques brutes
    const cells = text.trim().split(',').map(c => parseFloat(c.trim()));
    if (cells.length < 6 || cells.some(isNaN)) throw new Error('Format inattendu');

    grid.innerHTML = '';

    COMPETENCES.forEach((label, i) => {
      const val = cells[i];
      const pct = Math.round((val / 9) * 100);

      const block = document.createElement('div');
      block.className = 'stat-block';
      block.innerHTML = `
        <span class="stat-label">${label}</span>
        <span class="stat-value">${val % 1 === 0 ? val : val.toFixed(1)}</span>
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: 0%"
               data-target="${pct}"></div>
        </div>
      `;
      grid.appendChild(block);
    });

    requestAnimationFrame(() => {
      grid.querySelectorAll('.stat-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    });

  } catch (err) {
    grid.innerHTML = `<div class="stat-loading">Impossible de charger les statistiques.</div>`;
    console.warn('Erreur chargement stats :', err);
  }
}
