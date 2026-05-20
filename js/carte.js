// ═══════════════════════════════════════════════════════════
// CARTE — Logique principale
// Leaflet en mode L.CRS.Simple (coordonnées pixel)
// ═══════════════════════════════════════════════════════════

// ─── État global ─────────────────────────────────────────────
let carte = null;
let anneeActive = CARTE_ANNEE_REFERENCE;
let zoneActive = null;   // id juridiction ouverte
let layersZones = {};     // { id: L.polygon }
let markersMap = {};     // { pin.id: L.marker }
let pinActive = null;   // id pin dont la popup est ouverte

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCarte();
  initCurseur();
  initPanneau();
  initPopup();
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
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    maxBoundsViscosity: 1.0,
    attributionControl: false,
    doubleClickZoom: false,
  });

  L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);

  renderZones();
  renderPins();

  // Fermer popup au clic sur la carte (pas sur une zone ou un pin)
  carte.on('click', () => {
    fermerPopup();
    fermerPanneau();
  });

  // Laisser le DOM se stabiliser avant de calculer le zoom
  setTimeout(() => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
    carte.setMaxBounds(bounds);
  }, 100);

  // Recalibrer au redimensionnement
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
function renderZones() {
  Object.values(layersZones).forEach(g => {
    g.eachLayer(poly => carte.removeLayer(poly));
    carte.removeLayer(g);
  });
  layersZones = {};
 
  // Calculer la surface de chaque juridiction depuis ZONES_DATA
  // (somme des surfaces de tous ses contours, approximée par bounding box)
  function surfaceApprox(contours) {
    if (!contours || !contours.length) return 0;
    // Prendre la surface du premier contour (contour principal)
    const pts = contours[0];
    if (pts.length < 3) return 0;
    // Aire signée de Shoelace
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i][0] * pts[j][1];
      a -= pts[j][0] * pts[i][1];
    }
    return Math.abs(a / 2);
  }
 
  // Trier les juridictions par surface décroissante :
  // les grandes zones sont rendues en premier (en dessous),
  // les petites zones emboîtées par-dessus et captent les clics.
  const juridictionsTri = [...JURIDICTIONS].sort((a, b) => {
    const sa = surfaceApprox(ZONES_DATA?.[a.id] ?? (a.zone?.length >= 3 ? [a.zone] : null));
    const sb = surfaceApprox(ZONES_DATA?.[b.id] ?? (b.zone?.length >= 3 ? [b.zone] : null));
    return sb - sa; // décroissant
  });
 
  juridictionsTri.forEach(j => {
    // Source : ZONES_DATA (zones-data.js) en priorité, j.zone en fallback
    const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[j.id])
      ? ZONES_DATA[j.id]
      : (j.zone && j.zone.length >= 3 ? [j.zone] : null);
 
    if (!contours) return;
 
    const puissanceId = resoudre(j.puissance, anneeActive);
    const puissance   = PUISSANCES[puissanceId] || PUISSANCES.conteste;
    const isActive    = zoneActive === j.id;
 
    const style = {
      color:       puissance.couleur,
      weight:      isActive ? 2 : 1.5,
      opacity:     0.8,
      fillColor:   puissance.couleur,
      fillOpacity: isActive ? 0.4 : 0.18,
      fillRule:    'nonzero',
      className:   'carte-zone' + (isActive ? ' carte-zone--active' : ''),
    };
 
    // Créer un polygone par contour
    const polygones = contours.map(pts => {
      const latlngs = pts.map(([x, y]) => pixelToLatLng(x, y));
      return L.polygon(latlngs, style);
    });
 
    // Regrouper dans un layerGroup
    const groupe = L.layerGroup(polygones);
 
    // Événements sur chaque polygone individuel
    polygones.forEach(poly => {
      poly.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (zoneActive === j.id) {
          fermerPanneau();
        } else {
          ouvrirPanneau(j.id);
        }
      });
 
      poly.bindTooltip(j.nom, {
        permanent:  false,
        direction:  'top',
        className:  'carte-tooltip',
        opacity:    1,
      });
    });
 
    groupe.addTo(carte);
    layersZones[j.id] = groupe;
  });
}

// ─── Pins de scénarios ───────────────────────────────────────
function renderPins() {
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

// ─── Popup scénario ──────────────────────────────────────────
function initPopup() {
  // La fermeture se fait via le bouton ✕ ou le clic sur la carte
}

// Popup simple — un seul événement
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

// Popup groupée — plusieurs événements au même endroit
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

// ─── Panneau latéral ─────────────────────────────────────────
function initPanneau() {
  document.getElementById('carte-panneau-close').addEventListener('click', fermerPanneau);
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
  const contexte = resoudre(j.contexte, anneeActive);

  // Portrait depuis pnj-data.js
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
    j.capitale && { label: 'Capitale', value: j.capitale },
    j.population_approx && { label: 'Population', value: j.population_approx },
    j.economie && { label: 'Économie', value: j.economie },
  ].filter(Boolean).map(m => `
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
 
  const isActive = zoneActive === juridictionId;
  const style = {
    fillOpacity: isActive ? 0.4 : 0.18,
    weight:      isActive ? 2   : 1.5,
  };
 
  groupe.eachLayer(poly => poly.setStyle(style));
}

// ─── Curseur temporel ────────────────────────────────────────
function initCurseur() {
  const curseur = document.getElementById('curseur-annee');
  const valeur = document.getElementById('curseur-valeur');

  curseur.max = CARTE_ANNEE_REFERENCE;
  curseur.value = CARTE_ANNEE_REFERENCE;
  anneeActive = CARTE_ANNEE_REFERENCE;

  curseur.addEventListener('input', () => {
    anneeActive = parseInt(curseur.value);
    valeur.textContent = anneeActive;
    renderZones();
    if (zoneActive) ouvrirPanneau(zoneActive);
  });
}
