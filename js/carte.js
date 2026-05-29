// ═══════════════════════════════════════════════════════════
// CARTE — Logique principale
// Leaflet en mode L.CRS.Simple (coordonnées pixel)
// ═══════════════════════════════════════════════════════════

// ─── État global ─────────────────────────────────────────────
let carte = null;
let carteOverlayPrincipale = null;
let anneeActive = CARTE_ANNEE_REFERENCE;
let zoneActive = null;
let layersZones = {};
let markersMap = {};
let pinActive = null;
let panneauGaucheOuvert = true;
let modeSombre = false;
let contourGlobalLayer = null;
let villeActive = null;
let markersVilles = {};

// ─── Mode d'overlay ──────────────────────────────────────────
// 'geo' | 'densite' | 'esclavage' | 'autochtones' | 'masque' | 'isolation'
let overlayMode = 'geo';
let overlayModeAvantIsolation = 'geo'; // mode à restaurer à la fermeture
let isolationJuridictionId = null;     // juridiction actuellement isolée
let isolationLayer = null;             // couche Leaflet du contour doré

// ─── Mode MJ ─────────────────────────────────────────────────
let modeMJ = false;
const SEQUENCE_MJ = ['eleuthera', 'marguerita', 'jamaique'];
let sequenceEnCours = [];
let attenteClic_IleDuMais = false;

// ─── Année max MJ ────────────────────────────────────────────
function calculerAnneeMax() {
  let max = CARTE_ANNEE_REFERENCE;
  function scanBlocs(val) {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      val.forEach(b => {
        if (b.a && b.a > max) max = b.a;
        if (b.versions) b.versions.forEach(v => { if (v.a && v.a > max) max = v.a; });
      });
    }
  }
  JURIDICTIONS.forEach(j => {
    scanBlocs(j.contexte);
    scanBlocs(j.capitale);
    scanBlocs(j.population_approx);
    scanBlocs(j.economie);
  });
  return max;
}
const ANNEE_MAX_MJ = calculerAnneeMax();

// ─── Filtres de légende ───────────────────────────────────────
let puissancesMasquees = new Set();
const paliersMasquesDensite = new Set();
const paliersMasquesEsclavage = new Set();

// ─── Séquence secrète MJ ─────────────────────────────────────
function enregistrerClicSequence(zoneId) {
  if (modeMJ) return false;

  if (attenteClic_IleDuMais) {
    if (zoneId === 'ile-du-mais') {
      attenteClic_IleDuMais = false;
      ouvrirPopupConfirmationMJ();
      return true;
    } else {
      attenteClic_IleDuMais = false;
      sequenceEnCours = [];
      renderZones();
      return false;
    }
  }

  const attendu = SEQUENCE_MJ[sequenceEnCours.length];
  if (zoneId === attendu) {
    sequenceEnCours.push(zoneId);
    if (sequenceEnCours.length === SEQUENCE_MJ.length) {
      attenteClic_IleDuMais = true;
      sequenceEnCours = [];
      renderZones();
    }
  } else {
    sequenceEnCours = (zoneId === SEQUENCE_MJ[0]) ? [zoneId] : [];
  }
  return false;
}

function ouvrirPopupConfirmationMJ() {
  const popup = document.getElementById('carte-popup');
  popup.innerHTML = `
    <h3 class="carte-popup-titre" style="margin-bottom:0.75rem;">Mode Maître de Jeu</h3>
    <p class="carte-popup-extrait">Activer le mode MJ ? Les notes confidentielles et les données futures seront visibles jusqu'au rechargement de la page.</p>
    <div style="display:flex;gap:0.75rem;margin-top:1rem;">
      <button class="carte-popup-lien" onclick="confirmerModeMJ()">Confirmer</button>
      <button class="carte-popup-lien" onclick="annulerModeMJ()" style="color:var(--mist);border-color:rgba(107,124,138,0.3);">Annuler</button>
    </div>
  `;
  pinActive = '__mj_confirm__';
  document.getElementById('carte-popup').classList.add('carte-popup--visible');
}

function confirmerModeMJ() {
  modeMJ = true;
  fermerPopup();

  const wrap = document.getElementById('carte-wrap');
  if (wrap && !document.getElementById('mj-badge')) {
    const badge = document.createElement('div');
    badge.id = 'mj-badge';
    badge.textContent = '🔒 MJ';
    badge.style.cssText = `
      position:absolute; bottom:0.5rem; left:0.5rem; z-index:900;
      pointer-events:none; font-family:'Cinzel',serif; font-size:0.55rem;
      letter-spacing:0.1em; text-transform:uppercase;
      color:var(--gold-light); background:rgba(14,12,9,0.75);
      padding:0.2rem 0.5rem; border:1px solid rgba(139,58,42,0.3);
    `;
    wrap.appendChild(badge);
  }

  initCurseurInline();
  renderZones();
}

function annulerModeMJ() {
  fermerPopup();
  renderZones();
}

// ─── Intitulés des modes overlay ─────────────────────────────
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
  initPanneauGauche();
  initRecherche();
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
    zoomControl: false,
  });

  carteOverlayPrincipale = L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);
  const el = carteOverlayPrincipale.getElement();
  if (el) el.style.transition = 'opacity 0.9s ease';

  // Pane pour le contour doré d'isolation — au-dessus des zones (overlayPane = 400)
  carte.createPane('isolationContour');
  carte.getPane('isolationContour').style.zIndex = 420;
  carte.getPane('isolationContour').style.pointerEvents = 'none';

  carte.createPane('contourGlobal');
  carte.getPane('contourGlobal').style.zIndex = 410;
  carte.getPane('contourGlobal').style.pointerEvents = 'none';

  renderZones();
  renderPins();
  renderVilles();

  carte.on('click', () => {
    fermerPopup();
    fermerPanneau();
    fermerIsolation();
  });

  setTimeout(() => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
    carte.setMaxBounds(bounds);
    majWeightsZones();
    positionnerBoutonsZoom();
  }, 100);

  window.addEventListener('resize', () => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
    positionnerBoutonsZoom();
  });

  carte.on('resize', () => {
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
  });

  carte.on('zoomstart', () => {
    if (isolationLayer) isolationLayer.setStyle({ opacity: 0 });
  });

  carte.on('moveend', () => {
    majWeightsZones();
    if (isolationLayer) {
      isolationLayer.setStyle({ weight: weightPourZoom(WEIGHTS.isolation, carte.getZoom()) });
      setTimeout(() => {
        if (isolationLayer) isolationLayer.setStyle({ opacity: 1 });
      }, 60);
    }
  });

  // Boutons zoom personnalisés
  document.getElementById('carte-zoom-in')
    ?.addEventListener('click', () => carte.zoomIn(0.5));
  document.getElementById('carte-zoom-out')
    ?.addEventListener('click', () => carte.zoomOut(0.5));
  document.getElementById('carte-zoom-sombre')
    ?.addEventListener('click', () => {
      modeSombre = !modeSombre;
      // En mode isolation, ne pas modifier l'opacity de la carte
      if (overlayMode !== 'isolation') {
        carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
      }
      document.getElementById('carte-zoom-sombre').classList.toggle('active', modeSombre);
    });
}

// ─── Positionnement des boutons zoom ─────────────────────────
function positionnerBoutonsZoom() {
  const wrap = document.getElementById('carte-wrap');
  const controls = document.querySelector('.carte-zoom-controls');
  if (!wrap || !controls) return;
  const parent = controls.offsetParent;
  const wrapRect = wrap.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  controls.style.right = (parentRect.right - wrapRect.left) + 'px';
  controls.style.top = (wrapRect.top - parentRect.top) + 'px';
}

// ─── Conversion coordonnées pixel → Leaflet LatLng ───────────
function pixelToLatLng(x, y) {
  return L.latLng(CARTE_IMAGE.height - y, x);
}

// ─── Paliers et couleurs des overlays ────────────────────────
const DENSITE_PALIERS = [
  { max: 0.05, couleur: 'hsla(69, 100%, 90%, 0.79)' },
  { max: 0.15, couleur: 'hsla(76, 69%, 70%, 0.67)' },
  { max: 0.5, couleur: 'hsl(83, 48%, 54%)' },
  { max: 2, couleur: 'hsla(118, 41%, 53%, 0.86)' },
  { max: 8, couleur: 'hsl(156, 28%, 34%)' },
  { max: Infinity, couleur: 'hsl(144, 25%, 25%)' },
];

const ESCLAVAGE_PALIERS = [
  { max: 0.10, fm: 'hsl(26, 28%, 79%)', ra: 'hsl(6, 29%, 79%)' },
  { max: 0.25, fm: 'hsl(26, 40%, 71%)', ra: 'hsl(6, 43%, 70%)' },
  { max: 0.40, fm: 'hsl(26, 53%, 62%)', ra: 'hsl(6, 57%, 61%)' },
  { max: 0.60, fm: 'hsl(26, 65%, 53%)', ra: 'hsl(6, 71%, 52%)' },
  { max: 0.80, fm: 'hsl(26, 78%, 44%)', ra: 'hsl(6, 85%, 42%)' },
  { max: Infinity, fm: 'hsl(26, 90%, 36%)', ra: 'hsl(6, 99%, 33%)' },
];

const AUTOCHTONES_COULEURS = {
  souverainete: 'hsl(19, 81%, 30%)',
  resistance: 'hsl(28, 68%, 43%)',
  domination: 'hsl(39, 61%, 55%)',
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
  if (typeof s === 'object') return annee >= 1718 ? s.depuis1718 : s.avant1718;
  return s;
}

function couleurAutochtone(zoneId, annee) {
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[zoneId] : null;
  const statut = resoudreStatutAutochtone(demo, annee);
  if (!statut) return null;
  return AUTOCHTONES_COULEURS[statut] || null;
}

// ─── Épaisseurs de contours ───────────────────────────────────
const WEIGHTS = {
  zone: 0.5,
  zoneActive: 2,
  isolation: 2,
};
const ZOOM_FACTEUR = 1.5;

function weightPourZoom(weightBase, zoom) {
  const zoomMin = carte.getMinZoom();
  return Math.max(0.2, weightBase * Math.pow(ZOOM_FACTEUR, zoom - zoomMin));
}

// ─── Rendu des zones ─────────────────────────────────────────
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

  const juridictionsTri = [...JURIDICTIONS]
    .filter(j => !j.visible_mj || modeMJ || attenteClic_IleDuMais)
    .sort((a, b) => {
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
    const isIsolee = overlayMode === 'isolation' && isolationJuridictionId === j.id;
    const isEffacee = overlayMode === 'isolation' && !isIsolee;

    let couleur, fillOpacity, strokeColor, strokeWeight, strokeOpacity;

    if (isEffacee) {
      // Toutes les autres zones sont invisibles en mode isolation
      couleur = 'transparent';
      fillOpacity = 0;
      strokeColor = 'transparent';
      strokeWeight = 0;
      strokeOpacity = 0;

    } else if (overlayMode === 'densite') {
      const c = couleurDensite(j.id);
      if (c) {
        couleur = c; fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c; strokeWeight = isActive ? 2 : 0.5; strokeOpacity = 0.9;
      } else {
        couleur = 'transparent'; fillOpacity = 0;
        strokeColor = 'transparent'; strokeWeight = 0; strokeOpacity = 0;
      }

    } else if (overlayMode === 'esclavage') {
      const c = couleurEsclavage(j.id);
      if (c) {
        couleur = c; fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c; strokeWeight = isActive ? 2 : 0.5; strokeOpacity = 0.9;
      } else {
        couleur = 'transparent'; fillOpacity = 0;
        strokeColor = 'transparent'; strokeWeight = 0; strokeOpacity = 0;
      }

    } else if (overlayMode === 'autochtones') {
      const c = couleurAutochtone(j.id, anneeActive);
      if (c) {
        couleur = c; fillOpacity = isActive ? 0.5 : 0.35;
        strokeColor = c; strokeWeight = isActive ? 2 : 0.5; strokeOpacity = 0.9;
      } else {
        couleur = 'transparent'; fillOpacity = 0;
        strokeColor = 'transparent'; strokeWeight = 0; strokeOpacity = 0;
      }

    } else {
      // Mode géopolitique (y compris zone isolée en mode isolation)
      const masquee = overlayMode === 'geo' && puissancesMasquees.has(puissanceId);
      const estEspagne = puissanceId === 'espagnole';
      couleur = masquee ? 'rgba(107,124,138,0.6)' : puissance.couleur;
      fillOpacity = isActive ? 0.45 : (masquee ? 0.08 : (isIsolee ? 0 : 0.23));
      strokeColor = isIsolee ? '#c8973a' : (estEspagne ? '#c84a1c' : couleur);
      strokeWeight = isIsolee ? weightPourZoom(WEIGHTS.zone, carte.getZoom()) : (isActive ? 2 : 0.5);
      strokeOpacity = isIsolee ? 1 : (masquee ? 0.4 : (estEspagne ? 1 : 0.8));
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
        if (overlayMode === 'isolation') {
          L.DomEvent.stopPropagation(e);
          fermerIsolation();
          ouvrirPanneau(j.id);
          return;
        }
        const intercepte = enregistrerClicSequence(j.id);
        if (intercepte) return;
        if (zoneActive === j.id) {
          fermerPanneau();
        } else {
          ouvrirPanneau(j.id);
        }
      });

      poly.on('mouseover', () => {
        if (overlayMode === 'isolation') {
          if (isIsolee) poly.setStyle({ fillColor: '#c8973a', fillOpacity: 0.25 });
          return;
        }
        if (zoneActive !== j.id) poly.setStyle({ weight: weightPourZoom(WEIGHTS.zoneActive, carte.getZoom()) });
      });
      poly.on('mouseout', () => {
        if (overlayMode === 'isolation') {
          if (isIsolee) poly.setStyle({ fillColor: 'transparent', fillOpacity: 0 });
          return;
        }
        if (zoneActive !== j.id) poly.setStyle({ weight: weightPourZoom(WEIGHTS.zone, carte.getZoom()) });
      });

      if (overlayMode !== 'isolation') {
        poly.bindTooltip(j.label || j.nom, {
          permanent: false,
          direction: 'top',
          className: 'carte-tooltip',
          opacity: 1,
        });
      }
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
      if (overlayMode === 'isolation') return;
      if (pinActive === pin.id) { fermerPopup(); return; }
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

// ─── Marqueurs de villes (mode MJ uniquement) ─────────────────
function renderVilles() {
  // Nettoyer les marqueurs existants
  Object.values(markersVilles).forEach(m => carte.removeLayer(m));
  markersVilles = {};

  // Visible uniquement en mode MJ et hors masque/isolation
  if (!modeMJ) return;
  if (overlayMode === 'masque') return;

  if (typeof VILLES === 'undefined') return;

  VILLES.forEach(ville => {
    if (!ville.coords) return; // coordonnées pas encore saisies

    const [x, y] = ville.coords;
    const latlng = pixelToLatLng(x, y);
    const estCapitale = ville.capitale === true;

    const icon = L.divIcon({
      html: villeSVG(ville.type || 'ville', estCapitale),
      className: 'carte-ville',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker(latlng, { icon });

    marker.bindTooltip(ville.nom, {
      permanent: false,
      direction: 'top',
      className: 'carte-tooltip',
      opacity: 1,
      offset: [0, -10],
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (overlayMode === 'isolation') return;
      fermerPopup(); // fermer popup de pin si ouverte
      if (villeActive === ville.id) {
        fermerPanneauVille();
      } else {
        ouvrirPanneauVille(ville.id);
      }
    });

    marker.addTo(carte);
    markersVilles[ville.id] = marker;
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

// ─── SVG des marqueurs de villes ─────────────────────────────
function villeSVG(type, estCapitale) {
  const couleur = estCapitale ? 'var(--gold)' : 'var(--mist)';
  const fond = estCapitale ? 'rgba(200,151,58,0.15)' : 'rgba(107,124,138,0.15)';

  let symbole = '';
  if (type === 'port') {
    // Ancre marine
    symbole = `<path d="M12 7h8M16 7v2M16 9c0 3-2 5.5-4.5 7M16 9c0 3 2 5.5 4.5 7M13.5 16c.8.5 1.7.8 2.5.8s1.7-.3 2.5-.8M13.5 16c-.8.5-1.7.8-2.5.8"
      stroke="${couleur}" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <circle cx="16" cy="7" r="1.2" fill="${couleur}"/>`;
  } else if (type === 'fort') {
    // Carré avec X (diagonales)
    symbole = `<rect x="11" y="11" width="10" height="10" rx="0.5"
      fill="${fond}" stroke="${couleur}" stroke-width="1.2"/>
      <line x1="11" y1="11" x2="21" y2="21" stroke="${couleur}" stroke-width="1.2"/>
      <line x1="21" y1="11" x2="11" y2="21" stroke="${couleur}" stroke-width="1.2"/>`;
  } else {
    // Ville : bâtiment simple
    symbole = `<rect x="13" y="13" width="6" height="7" rx="0.3"
      fill="${fond}" stroke="${couleur}" stroke-width="1.2"/>
      <path d="M12 13l4-3.5 4 3.5" fill="${fond}" stroke="${couleur}" stroke-width="1.2" stroke-linejoin="round"/>
      <rect x="15" y="16" width="2" height="4" fill="${couleur}" rx="0.2"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
    <rect x="4" y="4" width="24" height="24" rx="4"
      fill="${fond}" stroke="${couleur}" stroke-width="1.5"/>
    ${symbole}
  </svg>`;
}

// ─── Curseur temporel inline ──────────────────────────────────
function initCurseurInline() {
  const valeur = document.getElementById('curseur-valeur');
  const prev = document.getElementById('curseur-prev');
  const next = document.getElementById('curseur-next');
  if (!valeur || !prev || !next) return;

  const anneeMin = 1712;
  const anneeMax = modeMJ ? ANNEE_MAX_MJ : CARTE_ANNEE_REFERENCE;

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
      // Quitter l'isolation si active
      if (overlayMode === 'isolation') fermerIsolation();
      overlayMode = mode;
      puissancesMasquees.clear();
      paliersMasquesDensite.clear();
      paliersMasquesEsclavage.clear();

      document.querySelectorAll('.carte-overlay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const label = document.getElementById('carte-overlay-label');
      if (label) label.textContent = OVERLAY_LABELS[mode] || '';

      const noteEsclavage = document.getElementById('carte-overlay-note');
      if (noteEsclavage) {
        noteEsclavage.style.display = mode === 'esclavage' ? 'inline' : 'none';
      }

      if (overlayMode === 'masque') {
        fermerPopup();
        fermerPanneau();
      }

      majLegende();
      renderZones();
      renderPins();
      renderVilles();
    });
  });
}

// ─── Légende ─────────────────────────────────────────────────
function majLegende() {
  const legende = document.getElementById('carte-legende');
  const liste = document.getElementById('carte-puissances-liste');
  if (!legende || !liste) return;

  liste.innerHTML = '';

  if (overlayMode === 'densite') {
    const labels = ['< 0,15 hab/km²', '0,15 – 0,45', '0,45 – 1,5', '1,5 – 6', '6 – 24', '> 24 hab/km²'];
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
        if (input.checked) { paliersMasquesDensite.delete(i); label.classList.remove('decochee'); }
        else { paliersMasquesDensite.add(i); label.classList.add('decochee'); }
        renderZones();
      });
      liste.appendChild(label);
    });
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  if (overlayMode === 'esclavage') {
    const labels = ['< 10 % de la population', '10 – 25 %', '25 – 40 %', '40 – 60 %', '60 – 80 %', '> 80 %'];
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
        if (input.checked) { paliersMasquesEsclavage.delete(i); label.classList.remove('decochee'); }
        else { paliersMasquesEsclavage.add(i); label.classList.add('decochee'); }
        renderZones();
      });
      liste.appendChild(label);
    });
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
      item.className = 'carte-puissance-check carte-puissance-check--static';
      const pastille = document.createElement('span');
      pastille.className = 'carte-puissance-pastille';
      pastille.style.borderColor = AUTOCHTONES_COULEURS[statut];
      pastille.style.backgroundColor = AUTOCHTONES_COULEURS[statut];
      pastille.style.opacity = '0.85';
      item.appendChild(pastille);
      item.appendChild(document.createTextNode(label));
      liste.appendChild(item);
    });
    const note = document.createElement('p');
    note.style.cssText = 'font-size:0.6rem; color:var(--mist-light); margin-top:0.5rem; line-height:1.3; font-style:italic;';
    note.textContent = 'Zones transparentes : population éteinte ou absente.';
    liste.appendChild(note);
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  if (overlayMode === 'masque') {
    liste.innerHTML = `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:0.85rem;color:var(--mist);">Teâtre de la Guerre en Amerique — Jaillot, Mortier &amp; Sanson, 1708.</span>`;
    return;
  }

  if (overlayMode === 'isolation') {
    liste.innerHTML = `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:0.85rem;color:var(--mist);">Cliquer sur la carte pour quitter.</span>`;
    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  // Mode géopolitique
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
        if (input.checked) { puissancesMasquees.delete(id); label.classList.remove('decochee'); }
        else { puissancesMasquees.add(id); label.classList.add('decochee'); }
        renderZones();
      });
      liste.appendChild(label);
    });

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

  if (!Array.isArray(contexte) && Object.keys(contexte).every(k => !isNaN(Number(k)))) {
    return resoudre(contexte, annee) ?? '';
  }

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

// ─── Panneau droit ───────────────────────────────────────────
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
    ${modeMJ && j.note_mj ? `
      <div class="panneau-note panneau-note--mj">
        <span class="panneau-note-mj-label">🔒 Note confidentielle — MJ</span>
        ${j.note_mj}
      </div>
    ` : ''}
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
  villeActive = null;
}

// ─── Panneau ville ────────────────────────────────────────────
function ouvrirPanneauVille(villeId) {
  const ville = (typeof VILLES !== 'undefined') ? VILLES.find(v => v.id === villeId) : null;
  if (!ville) return;

  // Fermer une zone active si besoin (même panneau partagé)
  if (zoneActive) {
    const precedent = zoneActive;
    zoneActive = null;
    majZone(precedent);
  }

  villeActive = villeId;

  const estCapitale = ville.capitale === true;
  const couleurStatut = estCapitale ? 'var(--gold)' : 'var(--mist)';
  const labelStatut = estCapitale ? 'Capitale' : null;
  const labelType = { port: 'Port', fort: 'Fort', ville: 'Ville' }[ville.type] || 'Ville';

  const inner = document.getElementById('carte-panneau-inner');
  inner.innerHTML = `
    <div class="panneau-puissance" style="gap:0.5rem;align-items:center;">
      <span style="font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.12em;
        text-transform:uppercase;color:${couleurStatut};">
        ${labelType}${labelStatut ? ' · ' + labelStatut : ''}
      </span>
    </div>
    <h2 class="panneau-nom">${ville.nom}</h2>
    ${ville.contexte ? `
      <div class="panneau-section-titre">Contexte</div>
      <p class="panneau-contexte">${ville.contexte}</p>
    ` : ''}
    ${ville.population ? `
      <div class="panneau-section-titre">Données</div>
      <div class="panneau-meta">
        <div class="panneau-meta-item">
          <span class="panneau-meta-label">Population</span>
          <span class="panneau-meta-value">${ville.population}</span>
        </div>
        ${ville.garnison ? `
          <div class="panneau-meta-item">
            <span class="panneau-meta-label">Garnison</span>
            <span class="panneau-meta-value">${ville.garnison}</span>
          </div>
        ` : ''}
      </div>
    ` : ''}
    ${modeMJ && ville.note_mj ? `
      <div class="panneau-note panneau-note--mj">
        <span class="panneau-note-mj-label">🔒 Note confidentielle — MJ</span>
        ${ville.note_mj}
      </div>
    ` : ''}
  `;

  inner.scrollTop = 0;
  const panneau = document.getElementById('carte-panneau');
  panneau.classList.add('carte-panneau--open');
  panneau.removeAttribute('inert');
}

function fermerPanneauVille() {
  const panneau = document.getElementById('carte-panneau');
  panneau.classList.remove('carte-panneau--open');
  panneau.setAttribute('inert', '');
  villeActive = null;
}

function majZone(juridictionId) {
  const groupe = layersZones[juridictionId];
  if (!groupe) return;

  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  const isActive = zoneActive === juridictionId;

  let style;
  if (overlayMode === 'densite' || overlayMode === 'esclavage' || overlayMode === 'autochtones') {
    style = { fillOpacity: isActive ? 0.5 : 0.35 };
  } else {
    const puissanceId = j ? resoudre(j.puissance, anneeActive) : null;
    const masquee = overlayMode === 'geo' && puissancesMasquees.has(puissanceId);
    style = { fillOpacity: isActive ? 0.45 : (masquee ? 0.08 : 0.23) };
  }

  const zoom = carte.getZoom();
  groupe.eachLayer(poly => {
    const wBase = isActive ? WEIGHTS.zoneActive : WEIGHTS.zone;
    poly.setStyle({ ...style, weight: weightPourZoom(wBase, zoom) });
  });
}

function majWeightsZones() {
  const zoom = carte.getZoom();
  Object.entries(layersZones).forEach(([id, groupe]) => {
    const wBase = zoneActive === id ? WEIGHTS.zoneActive : WEIGHTS.zone;
    groupe.eachLayer(poly => poly.setStyle({ weight: weightPourZoom(wBase, zoom) }));
  });
  if (isolationLayer) {
    isolationLayer.setStyle({ weight: weightPourZoom(WEIGHTS.isolation, zoom) });
  }
}

// ─── Panneau gauche — toggle ─────────────────────────────────
function initPanneauGauche() {
  const panneau = document.getElementById('carte-panneau-gauche');
  const toggle = document.getElementById('carte-panneau-gauche-toggle');
  if (!panneau || !toggle) return;

  toggle.addEventListener('click', () => {
    panneauGaucheOuvert = !panneauGaucheOuvert;
    panneau.classList.toggle('carte-panneau-gauche--open', panneauGaucheOuvert);
    toggle.textContent = panneauGaucheOuvert ? '‹' : '›';
    toggle.setAttribute('aria-label', panneauGaucheOuvert ? 'Masquer le panneau' : 'Afficher la recherche');
    panneau.setAttribute('aria-hidden', panneauGaucheOuvert ? 'false' : 'true');
  });
}

// ─── Recherche prédictive ─────────────────────────────────────
function initRecherche() {
  const input = document.getElementById('carte-recherche-input');
  const suggestions = document.getElementById('carte-recherche-suggestions');
  const clear = document.getElementById('carte-recherche-clear');
  if (!input || !suggestions || !clear) return;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clear.style.display = q ? '' : 'none';
    if (q.length < 1) { suggestions.innerHTML = ''; return; }
    afficherSuggestions(q, suggestions);
  });

  clear.addEventListener('click', () => {
    input.value = '';
    clear.style.display = 'none';
    suggestions.innerHTML = '';
    fermerIsolation();
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    const items = suggestions.querySelectorAll('.carte-recherche-suggestion');
    if (!items.length) return;
    const actif = suggestions.querySelector('.carte-recherche-suggestion--active');
    let idx = actif ? [...items].indexOf(actif) : -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (actif) actif.classList.remove('carte-recherche-suggestion--active');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('carte-recherche-suggestion--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (actif) actif.classList.remove('carte-recherche-suggestion--active');
      idx = (idx - 1 + items.length) % items.length;
      items[idx].classList.add('carte-recherche-suggestion--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (actif) actif.click();
      else if (items.length === 1) items[0].click();
    } else if (e.key === 'Escape') {
      fermerIsolation();
      input.value = '';
      clear.style.display = 'none';
      suggestions.innerHTML = '';
    }
  });
}

function afficherSuggestions(q, container) {
  const qLow = q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const resultats = [];

  JURIDICTIONS.forEach(j => {
    if (!j.tags || !j.tags.length) return;
    if (j.visible_mj && !modeMJ) return;
    let matchTag = null;
    for (const tag of j.tags) {
      const tagLow = tag.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      if (tagLow.includes(qLow)) { matchTag = tag; break; }
    }
    if (matchTag) resultats.push({ juridiction: j, matchTag });
  });

  if (!resultats.length) {
    container.innerHTML = `<li class="carte-recherche-vide">Aucun résultat</li>`;
    return;
  }

  container.innerHTML = resultats.slice(0, 12).map(({ juridiction: j, matchTag }) => {
    const nomMatch = matchTag === j.nom;
    const matchHtml = nomMatch ? '' :
      `<span class="carte-recherche-suggestion-match">${surlignerMatch(matchTag, qLow)}</span>`;
    return `<li class="carte-recherche-suggestion" role="option" data-id="${j.id}">
      <span class="carte-recherche-suggestion-nom">${surlignerMatch(j.nom, qLow)}</span>
      ${matchHtml}
    </li>`;
  }).join('');

  container.querySelectorAll('.carte-recherche-suggestion').forEach(li => {
    li.addEventListener('click', () => {
      const id = li.dataset.id;
      const j = JURIDICTIONS.find(j => j.id === id);
      if (j) document.getElementById('carte-recherche-input').value = j.nom;
      container.innerHTML = '';
      isolerTerritoire(id);
    });
  });
}

function surlignerMatch(texte, qLow) {
  const texteLow = texte.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const idx = texteLow.indexOf(qLow);
  if (idx === -1) return escapeHtml(texte);
  return escapeHtml(texte.slice(0, idx))
    + `<mark class="carte-recherche-highlight">${escapeHtml(texte.slice(idx, idx + qLow.length))}</mark>`
    + escapeHtml(texte.slice(idx + qLow.length));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Mode isolation ───────────────────────────────────────────
function isolerTerritoire(juridictionId) {
  // Nettoyer une isolation précédente sans restaurer l'overlay (on va en recréer une)
  if (isolationLayer) { carte.removeLayer(isolationLayer); isolationLayer = null; }

  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[juridictionId])
    ? ZONES_DATA[juridictionId]
    : (j?.zone?.length >= 3 ? [j.zone] : null);

  if (!contours) return;

  // Mémoriser le mode précédent seulement si on ne vient pas déjà d'isolation
  if (overlayMode !== 'isolation') overlayModeAvantIsolation = overlayMode;

  isolationJuridictionId = juridictionId;
  overlayMode = 'isolation';

  // Assombrir la carte
  carteOverlayPrincipale.setOpacity(0.05);

  // Griser les boutons d'overlay et la légende
  document.getElementById('carte-legende')?.classList.add('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('carte-isolation--disabled');
  });

  // Mettre à jour la légende (affiche "Cliquer pour quitter")
  majLegende();

  // Redessiner toutes les zones (les autres passent à opacity 0 via renderZones)
  renderZones();
  // Masquer les pins
  Object.values(markersMap).forEach(m => m.setOpacity(0));

  // Contour doré dans le pane isolationContour
  const latlngs = contours.map(pts => pts.map(([x, y]) => pixelToLatLng(x, y)));
  isolationLayer = L.polygon(latlngs, {
    color: '#ffffff',
    weight: 3,
    opacity: 0,
    fillOpacity: 0,
    interactive: false,
    pane: 'isolationContour',
  });
  isolationLayer.addTo(carte);

  // Animation du contour
  setTimeout(() => {
    const contourPane = carte.getPane('isolationContour');
    if (contourPane) contourPane.querySelectorAll('path').forEach(p => {
      p.style.transition = 'stroke 0.6s ease, stroke-width 0.4s ease';
    });
  }, 50);

  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#ffffff', weight: 3, opacity: 1 });
  }, 60);

  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#c8973a', weight: 4, opacity: 1 });
  }, 300);

  // Zoom sur le territoire
  setTimeout(() => {
    if (!isolationLayer) return;
    carte.flyToBounds(isolationLayer.getBounds(), {
      padding: [80, 80],
      maxZoom: carte.getMinZoom() + 2,
      duration: 1.2,
      easeLinearity: 0.3,
    });
  }, 400);
}

function fermerIsolation() {
  if (overlayMode !== 'isolation') return;

  overlayMode = overlayModeAvantIsolation;
  isolationJuridictionId = null;

  if (isolationLayer) { carte.removeLayer(isolationLayer); isolationLayer = null; }

  // Restaurer l'opacity de la carte (tenir compte du mode sombre)
  carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);

  // Réactiver les boutons d'overlay et la légende
  document.getElementById('carte-legende')?.classList.remove('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('carte-isolation--disabled');
  });

  // Restaurer le bouton actif
  document.querySelectorAll('.carte-overlay-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.carte-overlay-btn[data-mode="${overlayMode}"]`)?.classList.add('active');

  majLegende();
  renderZones();
  renderPins();
  renderVilles();
}
