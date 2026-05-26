// ═══════════════════════════════════════════════════════════
// CARTE — Logique principale
// Leaflet en mode L.CRS.Simple (coordonnées pixel)
// ═══════════════════════════════════════════════════════════

// ─── État global ─────────────────────────────────────────────
let carte = null;
let anneeActive = CARTE_ANNEE_REFERENCE;
let zoneActive = null;
let layersZones = {};
let markersMap = {};
let pinActive = null;

// ─── Mode d'overlay ──────────────────────────────────────────
// 'geo' | 'densite' | 'esclavage' | 'autochtones' | 'masque'
let overlayMode = 'geo';

// Puissances masquées (Set d'ids)
let puissancesMasquees = new Set();
const paliersMasquesDensite = new Set();
const paliersMasquesEsclavage = new Set();

// Intitulés des modes
const OVERLAY_LABELS = {
  geo: 'Souverainetés revendiquées et établies',
  densite: 'Densité de population',
  esclavage: 'Esclavage & Encomienda',
  autochtones: 'Foyers de populations autochtones',
  masque: 'Carte Jaillot (1708)',
};

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCarte();
  initCurseurInline();
  initOverlayBtns();
  majLegende();
  const closeBtn = document.getElementById('carte-panneau-close');
  if (closeBtn) closeBtn.addEventListener('click', fermerPanneau);
});

// ─── Carte Leaflet ───────────────────────────────────────────
function initCarte() {
  const W = CARTE_IMAGE.width;
  const H = CARTE_IMAGE.height;
  const bounds = [[0, 0], [H, W]];

  carte = L.map('carte', {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 2,
    zoomSnap: 0,
    zoomDelta: 0.5,
    maxBoundsViscosity: 1.0,
    attributionControl: false,
    doubleClickZoom: false,
  });

  L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);

  renderZones();
  renderPins();

  carte.on('click', () => {
    fermerPopup();
    fermerPanneau();
  });

  setTimeout(() => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
    carte.setMaxBounds(bounds);
  }, 100);

  window.addEventListener('resize', () => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
  });

  carte.on('resize', () => {
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
  });
}

// ─── Conversion coordonnées pixel → Leaflet LatLng ───────────
function pixelToLatLng(x, y) {
  return L.latLng(CARTE_IMAGE.height - y, x);
}

// ─── Zones territoriales ─────────────────────────────────────
const DENSITE_PALIERS = [
  { max: 0.05, couleur: 'hsla(69, 100%, 90%, 0.79)' }, // 0–0,05   quasi-vide
  { max: 0.15, couleur: 'hsla(76, 69%, 70%, 0.67)' }, // 0,05–0,15 très faible
  { max: 0.5, couleur: 'hsl(83, 48%, 54%)' }, // 0,15–0,5  faible
  { max: 2, couleur: 'hsla(118, 41%, 53%, 0.86)' }, // 0,5–2     modéré
  { max: 8, couleur: 'hsl(156, 28%, 34%)' }, // 2–8       dense
  { max: Infinity, couleur: 'hsl(144, 25%, 25%)' }, // 8+    très dense
];

const ESCLAVAGE_PALIERS = [
  // { max: ratio max, fm: couleur feuille-morte, ra: couleur rouge andrinople }
  // ratio = (esclaves + indiens_asservis) / population
  { max: 0.10, fm: 'hsl(26, 28%, 79%)', ra: 'hsl(6, 29%, 79%)' }, // très pâle
  { max: 0.25, fm: 'hsl(26, 40%, 71%)', ra: 'hsl(6, 43%, 70%)' }, // pâle
  { max: 0.40, fm: 'hsl(26, 53%, 62%)', ra: 'hsl(6, 57%, 61%)' }, // moyen
  { max: 0.60, fm: 'hsl(26, 65%, 53%)', ra: 'hsl(6, 71%, 52%)' }, // soutenu
  { max: 0.80, fm: 'hsl(26, 78%, 44%)', ra: 'hsl(6, 85%, 42%)' }, // intense
  { max: Infinity, fm: 'hsl(26, 90%, 36%)', ra: 'hsl(6, 99%, 33%)' }, // très intense
];

const AUTOCHTONES_COULEURS = {
  souverainete: 'hsl(19, 81%, 30%)',  // terra cotta sombre  #8a350e
  resistance: 'hsl(28, 68%, 43%)',  // ocre terra          #b86823
  domination: 'hsl(39, 61%, 55%)',  // ocre pâle           #d2a146
};

function couleurDensite(zoneId) {
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[zoneId] : null;
  if (!demo || demo.superficie === 0 || demo.population === 0) return null;
  const score = demo.population / demo.superficie;
  for (let i = 0; i < DENSITE_PALIERS.length; i++) {
    if (score <= DENSITE_PALIERS[i].max) {
      return paliersMasquesDensite.has(i) ? null : DENSITE_PALIERS[i].couleur;
    }
  }
  const last = DENSITE_PALIERS.length - 1;
  return paliersMasquesDensite.has(last) ? null : DENSITE_PALIERS[last].couleur;
}

function couleurEsclavage(zoneId) {
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[zoneId] : null;
  if (!demo || demo.population === 0) return null;
  const totalAsservis = demo.esclaves + demo.indiens_asservis;
  if (totalAsservis === 0) return null;
  const ratio = totalAsservis / demo.population;
  const useRa = demo.esclaves >= demo.indiens_asservis;
  for (let i = 0; i < ESCLAVAGE_PALIERS.length; i++) {
    if (ratio <= ESCLAVAGE_PALIERS[i].max) {
      return paliersMasquesEsclavage.has(i) ? null : (useRa ? ESCLAVAGE_PALIERS[i].ra : ESCLAVAGE_PALIERS[i].fm);
    }
  }
  const last = ESCLAVAGE_PALIERS.length - 1;
  return paliersMasquesEsclavage.has(last) ? null : (useRa ? ESCLAVAGE_PALIERS[last].ra : ESCLAVAGE_PALIERS[last].fm);
}

function resoudreStatutAutochtone(demo, annee) {
  if (!demo || demo.statut_autochtone === null) return null;
  const s = demo.statut_autochtone;
  // Cas temporel Louisiane : { avant1718: '...', depuis1718: '...' }
  if (typeof s === 'object') {
    return annee >= 1718 ? s.depuis1718 : s.avant1718;
  }
  return s;
}

function couleurAutochtone(zoneId, annee) {
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[zoneId] : null;
  const statut = resoudreStatutAutochtone(demo, annee);
  if (!statut) return null;
  return AUTOCHTONES_COULEURS[statut] || null;
}

function renderZones() {
  Object.values(layersZones).forEach(g => {
    g.eachLayer(poly => carte.removeLayer(poly));
    carte.removeLayer(g);
  });
  layersZones = {};

  if (overlayMode === 'masque') return;

  function surfaceApprox(contours) {
    if (!contours || !contours.length) return 0;
    const pts = contours[0];
    if (pts.length < 3) return 0;
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i][0] * pts[j][1];
      a -= pts[j][0] * pts[i][1];
    }
    return Math.abs(a / 2);
  }

  const juridictionsTri = [...JURIDICTIONS].sort((a, b) => {
    const sa = surfaceApprox(ZONES_DATA?.[a.id] ?? (a.zone?.length >= 3 ? [a.zone] : null));
    const sb = surfaceApprox(ZONES_DATA?.[b.id] ?? (b.zone?.length >= 3 ? [b.zone] : null));
    return sb - sa;
  });

  juridictionsTri.forEach(j => {
    const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[j.id])
      ? ZONES_DATA[j.id]
      : (j.zone && j.zone.length >= 3 ? [j.zone] : null);

    if (!contours) return;

    const puissanceId = resoudre(j.puissance, anneeActive);
    const puissance = PUISSANCES[puissanceId] || PUISSANCES.conteste;
    const isActive = zoneActive === j.id;

    // ── Calcul de couleur selon le mode ──────────────────────────
    let couleur, fillOpacity, strokeColor, strokeWeight, strokeOpacity;

    if (overlayMode === 'densite') {

      const c = couleurDensite(j.id);
      if (c) {
        couleur = c;
        fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c;
        strokeWeight = isActive ? 2 : 0.5;
        strokeOpacity = 0.9;
      } else {
        couleur = 'transparent';
        fillOpacity = 0;
        strokeColor = 'transparent';
        strokeWeight = 0;
        strokeOpacity = 0;
      }

    } else if (overlayMode === 'esclavage') {

      const c = couleurEsclavage(j.id);
      if (c) {
        couleur = c;
        fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c;
        strokeWeight = isActive ? 2 : 0.5;
        strokeOpacity = 0.9;
      } else {
        // Pas de population asservie : transparent
        couleur = 'transparent';
        fillOpacity = 0;
        strokeColor = 'transparent';
        strokeWeight = 0;
        strokeOpacity = 0;
      }

    } else if (overlayMode === 'autochtones') {

      const c = couleurAutochtone(j.id, anneeActive);
      if (c) {
        couleur = c;
        fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c;
        strokeWeight = isActive ? 2 : 0.5;
        strokeOpacity = 0.9;
      } else {
        couleur = 'transparent';
        fillOpacity = 0;
        strokeColor = 'transparent';
        strokeWeight = 0;
        strokeOpacity = 0;
      }

    } else {

      // Mode géopolitique — comportement original inchangé
      const masquee = overlayMode === 'geo' && puissancesMasquees.has(puissanceId);
      const estEspagne = puissanceId === 'espagnole';
      couleur = masquee ? 'rgba(107,124,138,0.6)' : puissance.couleur;
      fillOpacity = isActive ? 0.45 : (masquee ? 0.08 : 0.23);
      strokeColor = estEspagne ? '#c84a1c' : couleur;
      strokeWeight = isActive ? 2 : 0.5;
      strokeOpacity = masquee ? 0.4 : (estEspagne ? 1 : 0.8);

    }

    const style = {
      color: strokeColor,
      weight: strokeWeight,
      opacity: strokeOpacity,
      fillColor: couleur,
      fillOpacity: fillOpacity,
      fillRule: 'nonzero',
      className: 'carte-zone' + (isActive ? ' carte-zone--active' : ''),
    };

    const polygones = contours.map(pts => {
      const latlngs = pts.map(([x, y]) => pixelToLatLng(x, y));
      return L.polygon(latlngs, style);
    });

    const groupe = L.layerGroup(polygones);

    polygones.forEach(poly => {
      poly.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (zoneActive === j.id) {
          fermerPanneau();
        } else {
          ouvrirPanneau(j.id);
        }
      });

      // Hover : épaisseur du tracé uniquement (préserve la teinte informative)
      poly.on('mouseover', () => {
        if (zoneActive !== j.id) poly.setStyle({ weight: 2 });
      });
      poly.on('mouseout', () => {
        if (zoneActive !== j.id) poly.setStyle({ weight: 0.5 });
      });

      poly.bindTooltip(j.nom, {
        permanent: false,
        direction: 'top',
        className: 'carte-tooltip',
        opacity: 1,
      });
    });

    groupe.addTo(carte);
    layersZones[j.id] = groupe;
  });
}

// ─── Pins de scénarios ───────────────────────────────────────
function renderPins() {
  Object.values(markersMap).forEach(m => carte.removeLayer(m));
  markersMap = {};

  if (overlayMode === 'masque') return;

  CARTE_PINS.forEach(pin => {
    const [x, y] = pin.coords;
    const latlng = pixelToLatLng(x, y);

    const icon = L.divIcon({
      html: pinSVG(),
      className: 'carte-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker(latlng, { icon });

    marker.bindTooltip(pin.label, {
      permanent: false,
      direction: 'top',
      className: 'carte-tooltip',
      opacity: 1,
      offset: [0, -28],
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (pinActive === pin.id) {
        fermerPopup();
        return;
      }
      if (pin.groupe) {
        ouvrirPopupGroupe(pin);
      } else {
        ouvrirPopup(pin);
      }
    });

    marker.addTo(carte);
    markersMap[pin.id] = marker;
  });
}

// ─── SVG du pin ──────────────────────────────────────────────
function pinSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18S26 19 26 12c0-5.523-4.477-10-10-10z"
      fill="#c8973a" stroke="#0e0c09" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="4" fill="#0e0c09"/>
  </svg>`;
}

// ─── Curseur temporel inline ──────────────────────────────────
function initCurseurInline() {
  const valeur = document.getElementById('curseur-valeur');
  const prev = document.getElementById('curseur-prev');
  const next = document.getElementById('curseur-next');
  if (!valeur || !prev || !next) return;

  const anneeMin = 1712;
  const anneeMax = CARTE_ANNEE_REFERENCE;

  function majAffichage() {
    valeur.textContent = anneeActive;
    prev.disabled = anneeActive <= anneeMin;
    next.disabled = anneeActive >= anneeMax;
  }

  prev.addEventListener('click', () => {
    if (anneeActive > anneeMin) {
      anneeActive--;
      majAffichage();
      renderZones();
      majLegende();
      if (zoneActive) ouvrirPanneau(zoneActive);
    }
  });

  next.addEventListener('click', () => {
    if (anneeActive < anneeMax) {
      anneeActive++;
      majAffichage();
      renderZones();
      majLegende();
      if (zoneActive) ouvrirPanneau(zoneActive);
    }
  });

  majAffichage();
}

// ─── Boutons overlay ──────────────────────────────────────────
function initOverlayBtns() {
  const btns = document.querySelectorAll('.carte-overlay-btn:not(.disabled)');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === overlayMode) return;
      overlayMode = mode;
      puissancesMasquees.clear();
      paliersMasquesDensite.clear();
      paliersMasquesEsclavage.clear();

      // Mettre à jour les boutons
      document.querySelectorAll('.carte-overlay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Mettre à jour l'intitulé
      const label = document.getElementById('carte-overlay-label');
      if (label) label.textContent = OVERLAY_LABELS[mode] || '';

      // Note esclavage — affichée uniquement en mode esclavage
      const noteEsclavage = document.getElementById('carte-overlay-note');
      if (noteEsclavage) {
        noteEsclavage.style.display = mode === 'esclavage' ? 'inline' : 'none';
      }

      // Fermer popup et panneau en mode masqué
      if (overlayMode === 'masque') {
        fermerPopup();
        fermerPanneau();
      }


      // Légende : visible seulement en mode geo
      majLegende();

      renderZones();
      renderPins();
    });
  });
}

// ─── Légende ─────────────────────────────────────────────────
function majLegende() {
  const legende = document.getElementById('carte-legende');
  const liste = document.getElementById('carte-puissances-liste');
  if (!legende || !liste) return;

  liste.innerHTML = '';

  // ── Mode densité ──────────────────────────────────────────
  if (overlayMode === 'densite') {
    const labels = [
      '< 0,15 hab/km²',
      '0,15 – 0,45',
      '0,45 – 1,5',
      '1,5 – 6',
      '6 – 24',
      '> 24 hab/km²',
    ];
    DENSITE_PALIERS.forEach((palier, i) => {
      const label = document.createElement('label');
      label.className = 'carte-puissance-check' + (paliersMasquesDensite.has(i) ? ' decochee' : '');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !paliersMasquesDensite.has(i);

      const pastille = document.createElement('span');
      pastille.className = 'carte-puissance-pastille';
      pastille.style.borderColor = palier.couleur;
      pastille.style.backgroundColor = palier.couleur;
      pastille.style.opacity = '0.85';

      label.appendChild(input);
      label.appendChild(pastille);
      label.appendChild(document.createTextNode(labels[i]));

      input.addEventListener('change', () => {
        if (input.checked) {
          paliersMasquesDensite.delete(i);
          label.classList.remove('decochee');
        } else {
          paliersMasquesDensite.add(i);
          label.classList.add('decochee');
        }
        renderZones();
      });

      liste.appendChild(label);
    });

    legende.classList.add('carte-legende--visible');
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  if (overlayMode === 'esclavage') {
    const labels = [
      '< 10 % de la population',
      '10 – 25 %',
      '25 – 40 %',
      '40 – 60 %',
      '60 – 80 %',
      '> 80 %',
    ];
    ESCLAVAGE_PALIERS.forEach((palier, i) => {
      const label = document.createElement('label');
      label.className = 'carte-puissance-check' + (paliersMasquesEsclavage.has(i) ? ' decochee' : '');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !paliersMasquesEsclavage.has(i);

      const wrapPastilles = document.createElement('span');
      wrapPastilles.style.cssText = 'display:inline-flex;gap:3px;margin-right:6px;';

      [palier.fm, palier.ra].forEach(couleur => {
        const pastille = document.createElement('span');
        pastille.className = 'carte-puissance-pastille';
        pastille.style.borderColor = couleur;
        pastille.style.backgroundColor = couleur;
        pastille.style.opacity = '0.85';
        pastille.style.margin = '0';
        wrapPastilles.appendChild(pastille);
      });

      label.appendChild(input);
      label.appendChild(wrapPastilles);
      label.appendChild(document.createTextNode(labels[i]));

      input.addEventListener('change', () => {
        if (input.checked) {
          paliersMasquesEsclavage.delete(i);
          label.classList.remove('decochee');
        } else {
          paliersMasquesEsclavage.add(i);
          label.classList.add('decochee');
        }
        renderZones();
      });

      liste.appendChild(label);
    });

    legende.classList.add('carte-legende--visible');
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  if (overlayMode === 'autochtones') {
    const items = [
      { statut: 'souverainete', label: 'Souveraineté' },
      { statut: 'resistance', label: 'Résistance sous pression' },
      { statut: 'domination', label: 'Domination / Décimation' },
    ];

    items.forEach(({ statut, label }) => {
      const item = document.createElement('span');
      item.className = 'carte-puissance-check';

      const pastille = document.createElement('span');
      pastille.className = 'carte-puissance-pastille';
      pastille.style.borderColor = AUTOCHTONES_COULEURS[statut];
      pastille.style.backgroundColor = AUTOCHTONES_COULEURS[statut];
      pastille.style.opacity = '0.85';

      item.appendChild(pastille);
      item.appendChild(document.createTextNode(label));
      liste.appendChild(item);
    });

    // Note : zones transparentes = population éteinte ou absente
    const note = document.createElement('p');
    note.style.cssText = 'font-size:0.6rem; color:var(--mist-light); margin-top:0.5rem; line-height:1.3; font-style:italic;';
    note.textContent = 'Zones transparentes : population éteinte ou absente.';
    liste.appendChild(note);

    legende.classList.add('carte-legende--visible');
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  // ── Autres modes sans légende ─────────────────────────────
  if (overlayMode !== 'geo') {
    legende.classList.remove('carte-legende--visible');
    legende.setAttribute('aria-hidden', 'true');
    return;
  }

  // ── Mode géopolitique ─────────────────────────────────────
  const puissancesPresentes = new Map();
  JURIDICTIONS.forEach(j => {
    const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[j.id])
      ? ZONES_DATA[j.id]
      : (j.zone && j.zone.length >= 3 ? [j.zone] : null);
    if (!contours) return;

    const puissanceId = resoudre(j.puissance, anneeActive);
    if (puissanceId && PUISSANCES[puissanceId] && !puissancesPresentes.has(puissanceId)) {
      puissancesPresentes.set(puissanceId, PUISSANCES[puissanceId]);
    }
  });

  [...puissancesPresentes.entries()]
    .sort((a, b) => (a[1].ordre ?? 99) - (b[1].ordre ?? 99))
    .forEach(([id, p]) => {
      const label = document.createElement('label');
      label.className = 'carte-puissance-check' + (puissancesMasquees.has(id) ? ' decochee' : '');
      label.dataset.puissance = id;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !puissancesMasquees.has(id);
      input.dataset.puissance = id;

      const pastille = document.createElement('span');
      pastille.className = 'carte-puissance-pastille';
      pastille.style.borderColor = p.couleur;
      pastille.style.backgroundColor = p.couleur + '55';

      const texte = document.createTextNode(p.labelCourt || p.label);

      label.appendChild(input);
      label.appendChild(pastille);
      label.appendChild(texte);

      input.addEventListener('change', () => {
        if (input.checked) {
          puissancesMasquees.delete(id);
          label.classList.remove('decochee');
        } else {
          puissancesMasquees.add(id);
          label.classList.add('decochee');
        }
        renderZones();
      });

      liste.appendChild(label);
    });

  legende.classList.add('carte-legende--visible');
  legende.setAttribute('aria-hidden', 'false');
}

// ─── Popup scénario ──────────────────────────────────────────
function ouvrirPopup(pin) {
  const chronique = typeof CHRONIQUES !== 'undefined'
    ? CHRONIQUES.find(c => c.id === pin.chronique_id)
    : null;

  const popup = document.getElementById('carte-popup');
  popup.innerHTML = `
    <button class="carte-popup-close" onclick="fermerPopup()" aria-label="Fermer">✕</button>
    ${chronique ? `<div class="carte-popup-numero">${chronique.numero}</div>` : ''}
    <h3 class="carte-popup-titre">${pin.label}</h3>
    <div class="carte-popup-date">${pin.date}</div>
    <p class="carte-popup-extrait">${pin.extrait}</p>
    <a class="carte-popup-lien" href="chroniques.html">Lire la chronique →</a>
  `;

  pinActive = pin.id;
  afficherPopup();
}

function ouvrirPopupGroupe(pin) {
  const blocsHtml = pin.groupe.map((evt, i) => {
    const chronique = typeof CHRONIQUES !== 'undefined'
      ? CHRONIQUES.find(c => c.id === evt.chronique_id)
      : null;

    return `
      ${i > 0 ? '<div class="carte-popup-separateur"></div>' : ''}
      <div class="carte-popup-bloc">
        ${chronique ? `<div class="carte-popup-numero">${chronique.numero}</div>` : ''}
        <h4 class="carte-popup-titre carte-popup-titre--groupe">${evt.label}</h4>
        <div class="carte-popup-date">${evt.date}</div>
        <p class="carte-popup-extrait">${evt.extrait}</p>
        <a class="carte-popup-lien" href="chroniques.html">Lire la chronique →</a>
      </div>`;
  }).join('');

  const popup = document.getElementById('carte-popup');
  popup.innerHTML = `
    <button class="carte-popup-close" onclick="fermerPopup()" aria-label="Fermer">✕</button>
    <h3 class="carte-popup-titre carte-popup-titre--lieu">${pin.label}</h3>
    ${blocsHtml}
  `;

  pinActive = pin.id;
  afficherPopup();
}

function afficherPopup() {
  document.getElementById('carte-popup').classList.add('carte-popup--visible');
}

function fermerPopup() {
  document.getElementById('carte-popup').classList.remove('carte-popup--visible');
  pinActive = null;
}

// ─── Rendu du contexte temporel ──────────────────────────────
function rendreChamp(valeur, annee) {
  if (!valeur) return '';
  if (typeof valeur === 'string') return valeur;
  if (Array.isArray(valeur)) {
    const bloc = valeur
      .filter(b => annee >= (b.de ?? 0) && (b.a == null || annee < b.a))
      .sort((a, b) => (b.de ?? 0) - (a.de ?? 0))[0];
    return bloc ? bloc.texte : '';
  }
  return '';
}

function rendreContexte(contexte, annee) {
  if (!contexte) return '';
  if (typeof contexte === 'string') return contexte;

  // rétrocompat ancien format { 1712: '...', 1715: '...' }
  if (!Array.isArray(contexte) && Object.keys(contexte).every(k => !isNaN(Number(k)))) {
    return resoudre(contexte, annee) ?? '';
  }

  // rétrocompat format intermédiaire { permanent, depuis, ponctuel }
  if (!Array.isArray(contexte)) {
    const blocs = [];
    if (contexte.permanent) blocs.push(contexte.permanent);
    if (contexte.ponctuel?.[annee]) blocs.push(contexte.ponctuel[annee]);
    if (contexte.depuis) {
      const sujets = {};
      Object.entries(contexte.depuis)
        .filter(([a]) => Number(a) <= annee)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([a, blocs_sujet]) => {
          Object.entries(blocs_sujet).forEach(([sujet, texte]) => {
            sujets[sujet] = { annee: Number(a), texte };
          });
        });
      Object.values(sujets)
        .sort((a, b) => a.annee - b.annee)
        .forEach(({ texte }) => blocs.push(texte));
    }
    return blocs.join('<br><br>');
  }

  // nouveau format : tableau de blocs
  return contexte
    .filter(b => annee >= (b.de ?? 0) && (b.a == null || annee < b.a))
    .map(b => {
      if (b.versions) {
        const v = b.versions
          .filter(v => annee >= (v.de ?? 0) && (v.a == null || annee < v.a))
          .sort((a, b) => (b.de ?? 0) - (a.de ?? 0))[0];
        return v ? v.texte : null;
      }
      return b.texte;
    })
    .filter(Boolean)
    .join('<br><br>');
}

function ouvrirPanneau(juridictionId) {
  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  if (!j) return;

  const precedent = zoneActive;
  zoneActive = juridictionId;
  if (precedent && precedent !== juridictionId) majZone(precedent);
  majZone(juridictionId);

  const puissanceId = resoudre(j.puissance, anneeActive);
  const puissance = PUISSANCES[puissanceId] || PUISSANCES.conteste;
  const gouverneur = resoudre(j.gouverneur, anneeActive);
  const contexte = rendreContexte(j.contexte, anneeActive);

  let portraitHtml = `<div class="panneau-gouverneur-portrait-placeholder">☠</div>`;
  if (gouverneur && gouverneur.pnj_id && typeof PNJ_DATA !== 'undefined') {
    const pnj = PNJ_DATA.find(p => p.id === gouverneur.pnj_id);
    if (pnj && pnj.portrait) {
      portraitHtml = `<img class="panneau-gouverneur-portrait" src="${pnj.portrait}" alt="${pnj.nom}">`;
    }
  }

  const gouverneurHtml = gouverneur ? (() => {
    const isLien = gouverneur.pnj_id !== null;
    return `
      <div class="panneau-gouverneur${isLien ? ' panneau-gouverneur--lien' : ''}"
        ${isLien ? `onclick="window.location='pnj.html?id=${gouverneur.pnj_id}'" role="link" tabindex="0"` : ''}>
        ${portraitHtml}
        <div class="panneau-gouverneur-info">
          <div class="panneau-gouverneur-titre">${gouverneur.titre || 'Autorité'}</div>
          <div class="panneau-gouverneur-nom">${gouverneur.nom}</div>
          ${isLien ? `<div class="panneau-gouverneur-lien-label">Voir la fiche →</div>` : ''}
        </div>
      </div>`;
  })() : '';

  const metaHtml = [
    { label: 'Capitale', value: rendreChamp(j.capitale, anneeActive) },
    { label: 'Population', value: rendreChamp(j.population_approx, anneeActive) },
    { label: 'Économie', value: rendreChamp(j.economie, anneeActive) },
  ].filter(m => m.value).map(m => `
    <div class="panneau-meta-item">
      <span class="panneau-meta-label">${m.label}</span>
      <span class="panneau-meta-value">${m.value}</span>
    </div>`).join('');

  const inner = document.getElementById('carte-panneau-inner');
  inner.innerHTML = `
    <div class="panneau-puissance">
      ${puissance.blason
      ? `<img class="panneau-blason" src="${puissance.blason}" alt="${puissance.label}">`
      : `<div style="width:48px;height:48px;"></div>`}
      <span class="panneau-puissance-label">${puissance.label}</span>
    </div>
    <h2 class="panneau-nom">${j.nom}</h2>
    ${gouverneurHtml}
    ${contexte ? `
      <div class="panneau-section-titre">Contexte</div>
      <p class="panneau-contexte">${contexte}</p>
    ` : ''}
    ${metaHtml ? `
      <div class="panneau-section-titre">Données</div>
      <div class="panneau-meta">${metaHtml}</div>
    ` : ''}
    ${j.note ? `<p class="panneau-note">${j.note}</p>` : ''}
  `;

  inner.scrollTop = 0;

  const panneau = document.getElementById('carte-panneau');
  panneau.classList.add('carte-panneau--open');
  panneau.removeAttribute('inert');
}

function fermerPanneau() {
  const panneau = document.getElementById('carte-panneau');
  panneau.classList.remove('carte-panneau--open');
  panneau.setAttribute('inert', '');

  if (zoneActive) {
    const precedent = zoneActive;
    zoneActive = null;
    majZone(precedent);
  }
}

function majZone(juridictionId) {
  const groupe = layersZones[juridictionId];
  if (!groupe) return;

  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  const isActive = zoneActive === juridictionId;

  let style;

  if (overlayMode === 'densite' || overlayMode === 'esclavage' || overlayMode === 'autochtones') {
    style = {
      fillOpacity: isActive ? 0.5 : 0.35,
      weight: isActive ? 2 : 0.5,
    };
  } else {
    const puissanceId = j ? resoudre(j.puissance, anneeActive) : null;
    const masquee = overlayMode === 'geo' && puissancesMasquees.has(puissanceId);
    style = {
      fillOpacity: isActive ? 0.45 : (masquee ? 0.08 : 0.23),
      weight: isActive ? 2 : 0.5,
    };
  }

  groupe.eachLayer(poly => poly.setStyle(style));
}

