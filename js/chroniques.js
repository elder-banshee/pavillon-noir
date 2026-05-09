// ═══════════════════════════════════════════════════════════
// CHRONIQUES — Scroll horizontal + rail marin + navire
// ═══════════════════════════════════════════════════════════

const NAVIRE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" id="schooner" viewBox="0 0 964.24 871.06" width="110" height="99"><defs><style>.cls-1{fill:#c8973a}</style></defs><path d="M629.94 257.71c35.24 5.38 56.23-5.64 65.78-12.9 1.29-.98.37-3.05-1.21-2.74-19.43 3.8-54.45-11.03-72.1-16.37-20.24-6.12-79.01.41-79.01.41v-2.68h-9.59v92.64h.1c-1.2 56.19-1.46 135.49-2.05 191.83 0 0-1.69 188.71-1.72 191.94-66.78 3.01-133.66 4.31-200.53 5.27-.01-3.78-.04-13.45-.08-26.22 33.21.98 66.33 1.36 99.53.82 16.17-.29 32.35-.81 48.54-1.96 14.28-1.3 28.97-1.93 42.66-6.88 2.19-.85 4.87-2.33 6.77-5.09.12-1.05-.64-251.16-.53-266.35h.16l.2-84.77v-.69l-.48-.5c-1.36-1.42-136.53-142.41-186.13-209.53l-.07.05-.1-.26-1.25 1.16h-1.72l.02.74.13.14c5.71 30.25 9.86 60.83 12.97 91.44 6.46 61.26 9.04 123.61.43 184.68-3.82 26.49-10.13 52.62-20.94 77.08-.44.92-.86 1.86-1.23 2.82-.79-125.95-1.33-266.47-2.8-382.46V67.44c5.56-4.12 59.25-9.8 72.53-5.55.78.25 12.25 2.98 15.6 2.86 15.82.06 46.54-8.64 49.68-16.38.44-.74.4-2.01-.09-2.61-3.64-.41-8.31 2.38-11.88 1.55-2.51-.41-46.25-5.1-49.94-7.3-15.18-9.02-68.54-5.9-75.9-4.97v-2.67h-9.49v1.82c-.2 95.08-1.46 240.27-1.84 336.41l-1.86 334.72c-3.08.01-104.35.43-104.35.43l-52.96.17c-13.1-.35-26.34-.84-39.11-3.76-3.56-.96-7.48-1.82-10.11-4.43-.03-.02-.08-.12-.1-.14 0 .02.01.09.04.24l-1.71-1.56H67.81l.12 3.06h-.01c2.27 36.77 18.25 74.16 47.71 97.57l2.31 1.68 2.32 1.68c.79.55 1.61 1.04 2.41 1.56 4.4 3.03 10.47 5.92 15.3 8.02l5.42 2.02c.93.37 1.74.59 2.59.86l2.53.78 5.07 1.56c26.82 7.92 54.34 13.7 81.86 18.37 115.25 18.57 250.26 19.53 361.3-19.16 22.95-8.01 45.37-18.52 66.15-31.04 7.33-7.53 14.44-15.22 21.37-23.09 8-9.29 16.06-18.68 23.54-28.47.05-.01.09-.03.14-.04l-.03-.1c6.02-7.88 11.67-16.02 16.61-24.6.06-.1.12-.21.17-.31.07-.1.12-.21.18-.31l152.36-63.71c1.07-.3 2.12-.61 3.16-.91 6.12-1.61 12.2-3.37 18.36-4.86 6.24-1.85 14.72-1.97 17.19-9.4l.73-2.58s-2.82.66-2.83.66c.03-.09-143.78 33.78-143.15 33.53l-47.02 6.09c-4.19-6.12-10.24-14.88-11.69-17.09-3.2-4.86-6.42-9.79-9.63-14.75 3.93 1.45 10.61 3.37 21.06 4.84.81.11 1.52.21 2.15.28l1.09.15c11.23 1.8 23.72 2.24 35.1 2.67 40.46.47 81.01-4.89 120.4-13.82 1.93-.58 5.66-.92 6.9-2.49-7.53-11.24-18.23-20.43-27.6-30.13-27.95-27.64-56.52-54.62-85.13-81.55-38.17-35.88-76.56-71.51-115.09-107l-2.37 2.49c13 14.03 23.07 30.47 30.16 48.17 19.4 48.77 19.88 103.25 12.1 154.57-.12 1.09-.35 2.23-.59 3.38l-.06-.19-2.12 12.41c-22.46-34.91-44.89-71.72-65.09-107.03-24.94-43.31-49.43-87.38-69.77-133.25-2.36-5.66-9.71-23.47-11.92-28.75l.41 9.66c1.99 50.41 3.28 100.9 3.16 151.35-.59 43.78-.12 88.08-8.6 131.09-.16.62-.31 1.23-.46 1.84-.12-16.03-.09-32.06-.22-48.09-.47-89.33-1.02-202.32-2.62-290.68l.12-61.55c20.47-2.97 35.77-1.73 86.59 6.03Zm50.02 171.25c-.48-.71-.98-1.42-1.47-2.12 69.8 64.43 139.31 129.23 206.6 196.21l-.77.14-2.81.51c-43.11 7.18-87.15 11.68-130.84 8.86-14.63-1.13-29.23-3.09-43.3-7.02 3.6-18.67 5.4-37.5 6-56.42 1.24-48.35-6.17-99.14-33.4-140.16Zm-58.72-199.14c26.12 10.59 61.94 17.12 61.94 17.12-12.94 7.29-46.88 11.24-76.29 2.76s-63.48-3.12-63.48-3.12v-17.02s61.26-6.46 77.83.26M325.69 38.5c6.44-.95 56.35-3.48 73.77 4.22 3.66 1.62 45.53 6.16 50.08 7.39 2.39.56 4.46.1 6.46-.29.19-.06 2.41-.82 1.97.32-3.1 4.29-31.26 12.03-43.5 9.62l-13.91-3.46c-7.65-3.76-69.96-.82-74.87 5.01zM555.7 632.75c9.12-84.84 4.44-170.52.15-255.56 32.65 76.52 75.53 147.82 117.77 218.99 14.17 23.43 28.51 46.73 43.16 69.85.27.41.53.83.79 1.24-5.6 1.52-11.34 2.54-17.15 3.25-10.13 1.25-20.45 1.56-30.55 1.95-40.74.8-81.59-1.53-122.21-4.87 4.57-11.26 6.38-23.11 8.04-34.85m-3.16 42.3c38.99 2.79 78.39 2.03 117.42.92 4.98-.18 13.97-.38 22.36-.69-21.96 7.09-45.22 11.36-67.85 15.79-25.5 5.1-51.42 6.38-77.32 7.93-.38-8.62-.63-17.23-.79-25.85 1.92 2.28 4.1 1.59 6.18 1.9m-223.07-13.36c-.14-46.34-.34-111.71-.34-111.71-.2-23.27-.37-47.5-.54-72.38l2.14-.24s.01 0 .02.01c16.22-1.02 32.84-1.92 48.65-6.49.18-.07.37-.12.56-.17-3.99 36.24-9.93 72.2-18.47 107.58-7.09 27.75-16.32 54.86-29.97 79.98-.55 1.08-1.32 2.22-2.07 3.41Zm193.2 2.21c-5.49 4.75-14.37 5.12-21.42 6.37-23.91 2.92-48.11 3.1-72.2 3.25-31.26 0-62.55-.83-93.78-2.21 32.98-57.56 43.18-124.94 50.53-189.96 6.33-65.18 7.51-130.74 4.32-196.15l133.27 114.93c.15-1.18-1.28 259.95-.71 263.76ZM347.34 428.51c25.58-98.76 13.14-216.42-5.43-316.63 51.22 67.14 172.83 194.41 181.51 203.48l-.19 78.15c-.3.5-.64 1-1 1.5L389.32 279.99l-3.09-2.68c1.67 62.28.86 125.29-5.63 187.52-16.02 3.46-32.38 5.29-48.74 4.97 6.55-13.22 11.53-27.14 15.47-41.29ZM660.87 781c-28.11 15.35-62.87 28.31-95.59 36.25-16.44 4.03-33.8 7.4-50.52 10.03-95.27 13.93-192.86 9.54-287.5-7.25-28.59-5.35-57.34-11.61-84.79-21.32-22.6-9.39-39.53-27.04-51.65-47.91 16.9 4.13 49.55 10.03 98.18 10.03 5.06 0 11.57.02 19.34.04 11.56.03 25.84.08 42.24.08 122.48 0 362.2-2.34 452.36-27.83-14.67 18.83-31.54 36.86-42.07 47.88m45.95-52.96-.07-.22c-96.68 30.23-399.03 29.34-498.39 29.05-7.78-.02-14.29-.04-19.35-.04-51.99 0-85.47-6.77-100.85-10.83-2.96-5.53-5.6-11.24-7.93-17.06 15 4.13 50.01 11.65 105.84 11.65 5.12 0 11.72.02 19.6.04 12.05.04 26.82.08 43.71.08 131.95 0 391.83-2.61 470.69-32.01-3.83 6.31-8.36 12.84-13.25 19.35Zm27.79-46.01h.01c6.76-3.27 16.49-4.65 22.19.87 1.06.89 2.18 1.7 3.45 2.33 2.05 1.2 4.35 1.46 6.52.96l-39.92 16.52c1.08-1.99 2.11-4 3.1-6.04 2.09-4.61 3.92-9.43 4.64-14.64Zm38.01-8.12c4.98-2.58 11.42-3.96 16.72-5.65l18.17-5.43c15.42-4.74 34.95-10.29 52.89-15.4h.04l-90.65 37.53h.01c1.07-.65 2.03-1.5 2.83-2.53v-.63s0-5.58-.01-7.87Zm125.35-39.34-18.21 5.24c-23.5 6.81-86.55 24.84-110.57 31.82.03.74-.02 7.5 0 9.62-1.12 1.47-2.98 2.69-4.88 2.66-2.25-.04-4.26-1.23-6.06-2.65-6.09-6.05-17.72-5.64-26.03-2.42l-.47 2.22h-.04c-.91 6.46-3.97 14-8.41 22.05l-.1.04c-80.97 34.74-409.56 33.8-517.53 33.48-7.88-.02-14.48-.04-19.61-.04-59.34 0-94.81-8.53-107.64-12.32-3-8.11-5.44-16.38-7.34-24.56h32.07c3.02 3.54 7.86 4.66 12.11 5.8 23.9 5.88 68.38 3.24 92.86 3.69.15.06 106.16-.56 106.11-.37l1.77-1.79c1.52-.43 1.54-.87 1.51-1.31-.05-5.16.15-14.56.08-19.71.62-208.06 2.28-442.06 2.05-650.2h2.61v1.31c-.04.82-.02 6.08 0 12.17v30.14c2.12 198.9 3.26 428.03 3.92 627.43v1.74l1.75-.02c68.01-.98 136.02-2.28 204.01-5.37l1.64-1.71c1.26-.5 1.51-1 1.45-1.51.03-2.35.02-8.34.06-10.58.57-84.33 1.22-193.51 1.78-278.25.15-32.21-.14-64.64.52-96.67l.04-1.86h-.17v-85.76h2.7c-.17 34.33.17 102.23.85 134.81 1.34 87.95 2.39 249.64 2.98 339.13v1.81l1.81-.1c19.94-1.13 39.9-2.32 59.75-4.78 19.84-2.89 39.34-6.99 58.89-11.36 13.44-3.26 26.68-6.29 39.63-11.52v-.13c1.73-.11 3.26-.23 4.51-.36 6.15-.36 13.19-1.12 19.19-3.54-.33-.5-.93-1.38-1.71-2.52 19.98-2.56 45.46-5.82 45.46-5.89 0 0 115.49-27.05 139.11-32.58-3.18 2.78-8.39 3.36-12.45 4.72" class="cls-1"/><path d="M309.83 679.96c-.07-2.92-.6-292.58-.7-295.62L180.24 202.62s-2.76-3.89-2.75-3.89c-11.31 118.73-38.32 237.03-82.58 347.87-6.43 15.63-16.45 38.79-24.04 53.65-3.55 7.72-9.23 18.91-13.38 26.12-2.67 4.86-15.86 28.61-18.18 32.87 0 0 7.93 1.84 7.94 1.84 56.65 10.93 215.46 42.32 262.59 18.88ZM51.18 653.91l13-24.01c4.17-7.38 9.78-18.7 13.26-26.5 7.54-15.12 17.39-38.46 23.73-54.31 42.4-108.84 67.87-224.51 78.94-340.71l125.74 177.01c.63-1.84-1.76 285.05.28 291.33-40.65 17.08-146.94-2.9-193.07-10.52-20.7-3.75-41.36-7.81-61.9-12.28ZM307.72 372.92l3.13 4.35c-.02-85.01-1.4-204-2.18-290.23-1.13.83-2.98 2.8-3.66 4.26-6.55 10.55-15.63 19.22-24.65 27.7-30.8 27.8-64.84 51.92-99.21 75.08 0 0-1.5.99-1.51.99l1.05 1.45 127.03 176.39Zm-.87-279.32c.17-.19.05.18 0 0m-88.79 80.71c22.11-16.88 44.11-33.95 64.53-52.88 8.75-8.28 16.51-15.89 23.05-25.97-.36 80.56 1.35 190.36 1.72 270.87-17.27-25.2-100.56-146.72-116.97-170.66 8.15-8.49 18.61-13.71 27.67-21.35Z" class="cls-1"/></svg>`;

const RAIL_W      = 1120;
const RAIL_MARGIN = 0.01;

// ─── Cache des rapports déjà chargés ────────────────────────
// Clé : id de la chronique, valeur : tableau de { titre, html }
const rapportCache = {};

document.addEventListener('DOMContentLoaded', () => {
  renderCartes();
  if (window.innerWidth > 700) {
    buildRail();
    setupScroll();
  }
  setupModal();
});

// ─── Rendu des cartes ────────────────────────────────────────
function renderCartes() {
  const section = document.getElementById('chroniques');
  if (!section) return;
  const visibles = CHRONIQUES.filter(c => c.visible !== false);

  const cartesHtml = visibles.map((c, i) => {
    const metaItems = [
      { label: 'XP',               val: c.meta.xp         > 0 ? '+' + c.meta.xp                  : null },
      { label: 'Gloire',           val: c.meta.gloire      > 0 ? '+' + c.meta.gloire              : null },
      { label: 'Infamie',          val: c.meta.infamie     > 0 ? '+' + c.meta.infamie             : null },
      { label: 'Pi\u00e8ces de 8', val: c.meta.pieces_huit > 0 ? formatNombre(c.meta.pieces_huit) : null },
      { label: 'Recrues',          val: c.meta.recrues     > 0 ? '+' + c.meta.recrues             : null },
      { label: 'Pertes',           val: c.meta.pertes      > 0 ? '\u2212' + c.meta.pertes        : null },
    ];

    const metaHtml = `<div class="chrono-meta">
      ${metaItems.map(m =>
        `<div class="chrono-meta-item${m.val === null ? ' chrono-meta-item--vide' : ''}">
          <span class="chrono-meta-label">${m.label}</span>
          <span class="chrono-meta-val">${m.val !== null ? m.val : '—'}</span>
        </div>`).join('')}
    </div>`;

    const illustrationHtml = c.illustration
      ? `<img class="chrono-illustration" src="${c.illustration}" alt="${c.titre}" loading="lazy" draggable="false">`
      : `<img class="chrono-illustration" src="chroniques/covers/en_cours.jpg" alt="Illustration à venir" loading="lazy" draggable="false">`;

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

  const outer = section.querySelector('.chrono-piste-outer');
  outer.innerHTML = `
    <div class="chrono-piste-wrap" id="chrono-piste-wrap">
      <div class="chrono-piste" id="chrono-piste">${cartesHtml}</div>
    </div>`;

  requestAnimationFrame(() => {
    const piste = document.getElementById('chrono-piste');
    const wrap  = document.getElementById('chrono-piste-wrap');
    if (piste && wrap) {
      wrap.style.height = piste.offsetHeight + 'px';
      const vh      = window.innerHeight;
      const carteEl = piste.querySelector('.chrono-carte');
      const carteH  = carteEl ? carteEl.offsetHeight : 0;
      const spacer  = document.createElement('div');
      spacer.style.height = Math.max(110, Math.round((vh - carteH) / 2)) + 'px';
      spacer.style.pointerEvents = 'none';
      spacer.style.flexBasis = '100%';
      const outer = document.querySelector('.chrono-piste-outer');
      outer.insertAdjacentElement('afterend', spacer);
    }
  });

  section.querySelectorAll('.chrono-carte').forEach(el => {
    el.addEventListener('click', () => {
      const c = CHRONIQUES.find(c => c.id === el.dataset.id);
      if (c) openModal(c);
    });
  });
}

// ─── Chargement et parsing d'un rapport Markdown ─────────────
// Retourne une promesse qui résout en tableau de chapitres :
// [{ titre: "I. Naufragés", html: "<p>…</p>" }, …]
async function chargerRapport(c) {
  // Déjà en cache ?
  if (rapportCache[c.id]) return rapportCache[c.id];

  const response = await fetch(c.rapport);
  if (!response.ok) throw new Error(`Impossible de charger ${c.rapport}`);
  const texte = await response.text();

  const chapitres = parseRapport(texte);
  rapportCache[c.id] = chapitres;
  return chapitres;
}

// ─── Découpage du Markdown en chapitres ─────────────────────
// Règles :
//   - On ignore tout ce qui précède le premier "## " (titre H1, date, etc.)
//   - Chaque "## " ouvre un nouveau chapitre
//   - Le contenu précédant le premier "## " (préambule) est collé au chapitre I
//   - La note finale après le dernier "## " reste dans le dernier chapitre
//   - Les "### " deviennent des <h3> dans le corps du chapitre
//   - Les "# " (H1) sont ignorés
function parseRapport(texte) {
  // Supprimer les lignes H1 (# Titre) et les séparateurs ---
  const lignes = texte.split('\n');

  // Repérer les indices de chaque ## (chapitre)
  const coupes = []; // { index, titre }
  lignes.forEach((ligne, i) => {
    if (/^# /.test(ligne)) {
      coupes.push({ index: i, titre: ligne.replace(/^# /, '').trim() });
    }
  });

  if (coupes.length === 0) {
    // Pas de ## trouvé : tout le document = un seul chapitre sans titre
    return [{ titre: null, html: mdToHtml(texte) }];
  }

  // Texte avant le premier ## = préambule → rattaché au premier chapitre
  const preambule = lignes.slice(0, coupes[0].index).join('\n');

  const chapitres = coupes.map((coupe, idx) => {
    const debut = coupe.index + 1; // ligne après le ##
    const fin   = idx + 1 < coupes.length ? coupes[idx + 1].index : lignes.length;
    let contenu = lignes.slice(debut, fin).join('\n');

    // Coller le préambule au début du premier chapitre (avant son contenu)
    if (idx === 0 && preambule.trim()) {
      contenu = preambule + '\n\n' + contenu;
    }

    return {
      titre:     coupe.titre,
      roman:     toRoman(idx + 1),
      html:      mdToHtml(contenu),
      preambule: idx === 0 && preambule.trim() ? mdToHtml(preambule) : null,
      corps:     mdToHtml(lignes.slice(debut, fin).join('\n')),
    };
  });

  return chapitres;
}

// ─── Chiffres romains ────────────────────────────────────────
function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v; } });
  return r;
}

// ─── Conversion Markdown → HTML (via marked.js) ─────────────
function mdToHtml(md) {
  if (typeof marked === 'undefined') {
    // Fallback minimal si marked n'est pas chargé
    return '<p>' + md.trim().replace(/\n\n/g, '</p><p>') + '</p>';
  }
  // Configuration marked : pas de saut de ligne automatique
  marked.setOptions({ breaks: false, gfm: true });

  // On filtre les lignes H1 (# ) et les séparateurs --- avant conversion
  const filtre = md.split('\n')
    .filter(l => !/^-{3,}\s*$/.test(l))       // supprime les ---
    .join('\n');

  return marked.parse(filtre);
}

// ─── Rail marin ──────────────────────────────────────────────
function getRailBounds() {
  const W     = window.innerWidth;
  const zoneW = Math.min(RAIL_W, W);
  const zoneL = (W - zoneW) / 2;
  const XMIN  = zoneL + zoneW * RAIL_MARGIN;
  const XMAX  = zoneL + zoneW * (1 - RAIL_MARGIN);
  return { XMIN, XMAX };
}

function buildRail() {
  const W = window.innerWidth;
  const { XMIN, XMAX } = getRailBounds();

  const railEl = document.createElement('div');
  railEl.className = 'chrono-rail';
  railEl.id = 'chrono-rail';
  document.body.appendChild(railEl);

  const navire = document.createElement('div');
  navire.className = 'chrono-navire';
  navire.id = 'chrono-navire';
  navire.style.left = XMIN + 'px';

  const navireInner = document.createElement('div');
  navireInner.className = 'chrono-navire-inner flottant';
  navireInner.innerHTML = NAVIRE_SVG;
  navire.appendChild(navireInner);
  railEl.appendChild(navire);

  const merSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  merSvg.setAttribute('class', 'chrono-mer');
  merSvg.setAttribute('viewBox', `0 0 ${W} 110`);
  merSvg.setAttribute('preserveAspectRatio', 'none');
  merSvg.innerHTML = `
    <line class="mer-ligne" x1="0" y1="52" x2="${W}" y2="52"/>
    <path class="mer-vague mer-vague-1"
      d="M0 48 Q${W*.08} 44 ${W*.16} 48 Q${W*.24} 52 ${W*.32} 48 Q${W*.40} 44 ${W*.48} 48 Q${W*.56} 52 ${W*.64} 48 Q${W*.72} 44 ${W*.80} 48 Q${W*.88} 52 ${W*.96} 48 Q${W} 44 ${W} 48"/>
    <path class="mer-vague mer-vague-2"
      d="M0 56 Q${W*.10} 52 ${W*.20} 56 Q${W*.30} 60 ${W*.40} 56 Q${W*.50} 52 ${W*.60} 56 Q${W*.70} 60 ${W*.80} 56 Q${W*.90} 52 ${W} 56"/>
    <path class="mer-vague mer-vague-3"
      d="M0 44 Q${W*.12} 40 ${W*.25} 44 Q${W*.38} 48 ${W*.50} 44 Q${W*.62} 40 ${W*.75} 44 Q${W*.88} 48 ${W} 44"/>`;
  railEl.appendChild(merSvg);
}

// ─── Scroll et navire ────────────────────────────────────────
function setupScroll() {
  const wrap   = document.getElementById('chrono-piste-wrap');
  const piste  = document.getElementById('chrono-piste');
  const rail   = document.getElementById('chrono-rail');
  const navire = document.getElementById('chrono-navire');
  if (!wrap || !piste || !rail || !navire) return;

  const { XMIN, XMAX } = getRailBounds();
  let scrollTimer = null;

  function syncNavire() {
    const max   = piste.scrollWidth - wrap.clientWidth;
    const ratio = max > 0 ? wrap.scrollLeft / max : 0;
    navire.style.left = (XMIN + ratio * (XMAX - XMIN)) + 'px';
  }

  wrap.addEventListener('scroll', () => {
    syncNavire();
    rail.classList.add('scrolling');
    navire.querySelector('.chrono-navire-inner').classList.remove('flottant');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      rail.classList.remove('scrolling');
      navire.querySelector('.chrono-navire-inner').classList.add('flottant');
    }, 600);
  }, { passive: true });

  wrap.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    wrap.scrollLeft += e.deltaY;
  }, { passive: false });

  let isDragging = false, startX = 0, startScroll = 0;
  piste.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startScroll = wrap.scrollLeft;
    piste.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (isDragging) wrap.scrollLeft = startScroll - (e.clientX - startX);
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    piste.style.cursor = 'grab';
  });

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
        navire.querySelector('.chrono-navire-inner').classList.add('flottant');
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

let modalPage = null;   // null = accueil, Number = index chapitre (0-based)
let modalData = null;   // chronique courante
let modalChapitres = []; // chapitres chargés { titre, html }

function openModal(c) {
  modalData = c;
  modalPage = null;
  modalChapitres = [];

  // Afficher l'accueil immédiatement
  renderModal();
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Si la chronique a un rapport, le charger en arrière-plan
  if (c.rapport) {
    chargerRapport(c)
      .then(chapitres => {
        modalChapitres = chapitres;
        // Re-rendre seulement si on est toujours sur cette chronique
        if (modalData && modalData.id === c.id) renderModal();
      })
      .catch(err => {
        console.warn('Erreur chargement rapport :', err);
      });
  }
}

function renderModal() {
  const modal = document.getElementById('modal');
  if (!modal || !modalData) return;
  const c = modalData;

  // Chapitres disponibles selon la source de données
  let chapitresDispos = [];
  if (c.rapport) {
    // Rapport Markdown : chapitres chargés dynamiquement
    chapitresDispos = modalChapitres; // peut être vide si pas encore chargé
  } else if (c.chapitres) {
    // Ancien format : objet { 1: html, 2: html, … }
    chapitresDispos = Object.entries(c.chapitres)
      .filter(([, v]) => v !== null)
      .map(([num, html]) => ({ titre: 'Chapitre ' + num, html }));
  }

  const nbChapitres = chapitresDispos.length;

  // ── En-tête permanent ──────────────────────────────────────
  const header = `
    <button class="modal-close" onclick="closeModal()" aria-label="Fermer">✕</button>
    <div class="modal-chrono-header">
      <div class="modal-chrono-header-left">
        <div class="modal-chrono-num">${c.numero}</div>
        <h2 class="modal-chrono-titre">${c.titre}</h2>
      </div>
      <div class="modal-chrono-date">${c.date_campagne}</div>
    </div>`;

  // ── Navigation chapitres (haut, pour les pages chapitre) ───
  const navBtnsChapitre = [
    `<button class="chrono-nav-btn" onclick="goToPage(null)"><span class="chrono-nav-long">Accueil</span><span class="chrono-nav-court">Acc.</span></button>`,
    ...chapitresDispos.map((ch, idx) => {
      const roman = ch.roman || toRoman(idx + 1);
      const actif = modalPage === idx;
      return `<button class="chrono-nav-btn${actif ? ' active' : ''}"
        ${actif ? 'disabled' : `onclick="goToPage(${idx})"`}>
        <span class="chrono-nav-long">Chapitre ${roman}</span><span class="chrono-nav-court">Ch.&nbsp;${roman}</span></button>`;
    })
  ].join('');
  const navHaut = `<nav class="modal-chrono-nav">${navBtnsChapitre}</nav>`;

  // ── Navigation chapitres (bas, pour la page accueil) ───────
  const navBtnsAccueil = chapitresDispos.map((ch, idx) => {
    const roman = ch.roman || toRoman(idx + 1);
    return `<button class="chrono-nav-btn" onclick="goToPage(${idx})"><span class="chrono-nav-long">Chapitre ${roman}</span><span class="chrono-nav-court">Ch.&nbsp;${roman}</span></button>`;
  }).join('');

  // ── Indicateur de chargement si rapport pas encore prêt ────
  const chargementHtml = c.rapport && nbChapitres === 0
    ? `<p class="modal-chrono-chargement">Chargement…</p>`
    : '';

  const navBas = nbChapitres > 0
    ? `<nav class="modal-chrono-nav modal-chrono-nav--bas">${navBtnsAccueil}</nav>`
    : chargementHtml;

  // ── Contenu selon la page ───────────────────────────────────
  let contenu = '';

  if (modalPage === null) {
    // Page d'accueil
    const metaItems = [
      { label: 'XP',            val: c.meta.xp         > 0 ? '+' + c.meta.xp                  : null },
      { label: 'Gloire',        val: c.meta.gloire      > 0 ? '+' + c.meta.gloire              : null },
      { label: 'Infamie',       val: c.meta.infamie     > 0 ? '+' + c.meta.infamie             : null },
      { label: 'Pièces de huit',val: c.meta.pieces_huit > 0 ? formatNombre(c.meta.pieces_huit) : null },
      { label: 'Recrues',       val: c.meta.recrues     > 0 ? '+' + c.meta.recrues             : null },
      { label: 'Pertes',        val: c.meta.pertes      > 0 ? '−' + c.meta.pertes             : null },
    ];

    const metaHtml = `<div class="modal-chrono-meta">
      ${metaItems.map(m => `
        <div class="modal-chrono-meta-item${m.val === null ? ' modal-chrono-meta-item--vide' : ''}">
          <span class="modal-chrono-meta-label">${m.label}</span>
          <span class="modal-chrono-meta-val">${m.val !== null ? m.val : '—'}</span>
        </div>`).join('')}
    </div>`;

    const bannerHtml = c.illustration
      ? `<img class="modal-chrono-banner" src="${c.illustration}" alt="${c.titre}" style="object-position: center ${c.align ?? 50}%;">`
      : `<img class="modal-chrono-banner" src="chroniques/covers/en_cours.jpg" alt="Illustration à venir" style="object-position: center 50%;">`;

    const resumeHtml = c.extrait
      ? `<p class="modal-chrono-resume">${c.extrait}</p>`
      : '';

    contenu = `
      <div class="modal-chrono-body">
        ${bannerHtml}
        ${sourceCredit(c)}
        ${metaHtml}
        ${resumeHtml}
        ${navBas}
      </div>`;

    modal.innerHTML = header + contenu;

  } else {
    // Page chapitre
    const ch = chapitresDispos[modalPage];
    if (!ch) { modal.innerHTML = header + navHaut; return; }

    const titreHtml = ch.titre
      ? `<h3 class="modal-chrono-chapitre-titre">${ch.titre}</h3>`
      : '';

    const preambuleHtml = ch.preambule
      ? `<div class="modal-chrono-texte rapport-md modal-chrono-preambule">${ch.preambule}</div>`
      : '';

    contenu = `
      <div class="modal-chrono-body modal-chrono-body--chapitre">
        ${preambuleHtml}
        ${titreHtml}
        <div class="modal-chrono-texte rapport-md">${ch.corps || ch.html}</div>
      </div>`;

    modal.innerHTML = header + navHaut + contenu;
  }

  modal.scrollTop = 0;

  // Détection de débordement de la nav — après rendu DOM
  requestAnimationFrame(() => {
    document.querySelectorAll('.modal-chrono-nav').forEach(nav => {
      const deborde = nav.scrollWidth > nav.clientWidth;
      nav.classList.toggle('nav--compacte', deborde);
    });
  });
}

function goToPage(page) {
  modalPage = page === null ? null : Number(page);
  renderModal();
  document.getElementById('modal').scrollTop = 0;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  modalData     = null;
  modalPage     = null;
  modalChapitres = [];
}

function formatNombre(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + '\u202fk';
  return n.toString();
}

function sourceCredit(c) {
  if (!c.source) return '';
  return `<div class="modal-source">
    ${c.source.credit}
    ${c.source.url ? `<a class="modal-source-link" href="${c.source.url}" target="_blank" rel="noopener" aria-label="Voir la source">↗</a>` : ''}
  </div>`;
}
