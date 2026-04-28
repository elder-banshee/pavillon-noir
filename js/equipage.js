// ═══════════════════════════════════════════════════════════
// ÉQUIPAGE — Données et rendu
// ═══════════════════════════════════════════════════════════

// ─── URL Google Sheets CSV ───────────────────────────────────
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=0&single=true&output=csv';

// ─── Composition de l'équipage ───────────────────────────────
// Mettre à jour après chaque recrutement ou perte
const COMPOSITION = [
  { categorie: "Pirates",                     effectif: 5 },
  { categorie: "Boucaniers",                  effectif: 5 },
  { categorie: "Engagés",                     effectif: 3 },
  { categorie: "Déserteurs de la Royal Navy", effectif: 5 },
  { categorie: "Esclaves marrons",            effectif: 3 },
];

// ─── Appréciation qualitative ────────────────────────────────
// À mettre à jour manuellement selon l'évolution de l'équipage
const APPRECIATION = "Équipage hétéroclite mais combatif — les pirates et boucaniers forment un noyau dur expérimenté, compensant les lacunes navales des déserteurs et recrues récentes. La cohésion reste à construire.";

// ─── Libellés et ordre des compétences ───────────────────────
// Doit correspondre à l'ordre des colonnes dans Google Sheets
// (après Groupe, Nombre, Proportion)
const COMPETENCES = [
  "Manœuvre",
  "Canonnade",
  "Recharge",
  "Corps à Corps",
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
    const values = parseCSV(text);

    if (!values || values.length === 0) throw new Error('Données vides');

    grid.innerHTML = '';

    COMPETENCES.forEach((label, i) => {
      const val = parseFloat(values[i]);
      if (isNaN(val)) return;

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

// ─── Parser CSV — lit la ligne "Moy./Total" ──────────────────
// Structure du tableau : Groupe, Nombre, Proportion, puis 6 valeurs
// La ligne Moy./Total contient les moyennes pondérées finales
function parseCSV(text) {
  const lines = text.trim().split('\n');
  for (const line of lines) {
    // Cherche la ligne commençant par "Moy."
    if (line.startsWith('Moy.')) {
      const cells = line.split(',').map(c => c.trim().replace(/"/g, ''));
      // Colonnes 0=Groupe, 1=Nombre, 2=Proportion, 3..8=valeurs
      const values = cells.slice(3).map(c => parseFloat(c));
      if (values.length >= 6 && values.slice(0, 6).every(n => !isNaN(n))) {
        return values.slice(0, 6);
      }
    }
  }
  return null;
}
