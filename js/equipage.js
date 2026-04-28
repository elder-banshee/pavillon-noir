// ═══════════════════════════════════════════════════════════
// ÉQUIPAGE — Données et rendu
// ═══════════════════════════════════════════════════════════

// ─── URL Google Sheets CSV ───────────────────────────────────
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQzqKOStqZtFKXnP3o-6Uu6NGcGujiFxpzZWwuWSEA0WHED6NL442mEworPIPWZbmUP3G-RtQH_p1BI/pub?gid=0&single=true&output=csv';

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

// ─── Libellés des compétences (ordre = colonnes Sheets) ──────
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

// ─── Parser CSV ───────────────────────────────────────────────
// Cherche la ligne "Moy./Total" et extrait les 6 valeurs numériques.
// La colonne Proportion contient des % avec virgule ("27,78%"),
// ce qui crée des cellules supplémentaires lors du split naïf.
// On parse donc en respectant les guillemets CSV (RFC 4180).
function parseCSV(text) {
  const lines = text.trim().split('\n');
  for (const line of lines) {
    if (!line.startsWith('Moy.')) continue;

    // Parser CSV respectant les champs entre guillemets
    const cells = parseCSVLine(line);

    // Cherche les 6 premières valeurs numériques après les colonnes texte
    const nums = [];
    for (const cell of cells) {
      if (nums.length >= 6) break;
      const n = parseFloat(cell.replace(',', '.'));
      if (!isNaN(n) && cell.trim() !== '') nums.push(n);
    }

    if (nums.length >= 6) return nums;
  }
  return null;
}

// Parser CSV ligne par ligne, respectant les guillemets RFC 4180
function parseCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}
