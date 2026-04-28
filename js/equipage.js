// ═══════════════════════════════════════════════════════════
// ÉQUIPAGE — Données et rendu
// ═══════════════════════════════════════════════════════════

// ─── URL Google Sheets CSV (Feuille 3 — valeurs site) ────────
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=53989143&single=true&output=csv';

// ─── Appréciation qualitative ────────────────────────────────
const APPRECIATION = "Équipage hétéroclite mais combatif — les pirates et boucaniers forment un noyau dur expérimenté, compensant les lacunes navales des déserteurs et recrues récentes. La cohésion reste à construire.";

// ─── Libellés des compétences (ordre = colonnes ligne 1) ─────
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
  loadAll();
});

// ─── Chargement unique depuis Google Sheets ───────────────────
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

    // ── Ligne 1 : compétences ──────────────────────────────
    if (grid && lines.length >= 1) {
      const competenceValues = lines[0].split(',').map(c => parseFloat(c.trim()));

      if (competenceValues.length >= 6 && !competenceValues.slice(0,6).some(isNaN)) {
        grid.innerHTML = '';
        COMPETENCES.forEach((label, i) => {
          const val = competenceValues[i];
          const pct = Math.round((val / 9) * 100);
          const block = document.createElement('div');
          block.className = 'stat-block';
          block.innerHTML = `
            <span class="stat-label">${label}</span>
            <span class="stat-value">${val % 1 === 0 ? val : val.toFixed(1)}</span>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: 0%" data-target="${pct}"></div>
            </div>
          `;
          grid.appendChild(block);
        });

        requestAnimationFrame(() => {
          grid.querySelectorAll('.stat-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.target + '%';
          });
        });
      } else {
        grid.innerHTML = `<div class="stat-loading">Format des compétences inattendu.</div>`;
      }
    }

    // ── Lignes 2+ : composition ────────────────────────────
    if (crewTable && lines.length >= 2) {
      const composition = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(c => c.trim());
        const nom = cells[0];
        const effectif = parseInt(cells[1]);
        if (nom && !isNaN(effectif) && effectif > 0) {
          composition.push({ categorie: nom, effectif });
        }
      }

      const total = composition.reduce((s, c) => s + c.effectif, 0);

      crewTable.innerHTML = composition.map(c => {
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

      if (crewTotal) {
        crewTotal.innerHTML = `
          <span>Total</span>
          <span class="crew-total-value">${total} hommes</span>
        `;
      }
    }

  } catch (err) {
    if (grid) grid.innerHTML = `<div class="stat-loading">Impossible de charger les données.</div>`;
    console.warn('Erreur chargement :', err);
  }
}
