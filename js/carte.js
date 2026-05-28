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
let isolationActive = null;  // id juridiction isolée (recherche)
let isolationLayer = null;   // couche Leaflet du contour d'isolation
let isolationRect = null;    // rectangle Leaflet de fond sombre
let panneauGaucheOuvert = true;
let modeSombre = false;


// ─── Mode d'overlay ──────────────────────────────────────────
// 'geo' | 'densite' | 'esclavage' | 'autochtones' | 'masque'
let overlayMode = 'geo';

// ─── Mode MJ ─────────────────────────────────────────────────
let modeMJ = false;
const SEQUENCE_MJ = ['eleuthera', 'marguerita', 'jamaique'];
let sequenceEnCours = [];
// Après la séquence complète, on attend le clic de confirmation sur l'Île du Maïs
let attenteClic_IleDuMais = false;

// Année max calculée dynamiquement depuis les bornes 'a' de carte-data.js
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

// Puissances masquées (Set d'ids)
let puissancesMasquees = new Set();
const paliersMasquesDensite = new Set();
const paliersMasquesEsclavage = new Set();

// ─── Séquence secrète et activation MJ ───────────────────────
function enregistrerClicSequence(zoneId) {
  if (modeMJ) return false;

  // Clic sur l'Île du Maïs après séquence complète → popup de confirmation
  if (attenteClic_IleDuMais) {
    if (zoneId === 'ile-du-mais') {
      attenteClic_IleDuMais = false;
      ouvrirPopupConfirmationMJ();
      return true; // intercepté — ne pas ouvrir le panneau
    } else {
      // Clic ailleurs → annuler, remettre à zéro
      attenteClic_IleDuMais = false;
      sequenceEnCours = [];
      renderZones(); // masquer l'Île du Maïs
      return false;
    }
  }

  const attendu = SEQUENCE_MJ[sequenceEnCours.length];
  if (zoneId === attendu) {
    sequenceEnCours.push(zoneId);
    if (sequenceEnCours.length === SEQUENCE_MJ.length) {
      // Séquence complète → révéler l'Île du Maïs, attendre le clic
      attenteClic_IleDuMais = true;
      sequenceEnCours = [];
      renderZones(); // l'Île du Maïs apparaît maintenant
    }
  } else {
    // Mauvaise zone — recommencer depuis zéro sauf si c'est le premier de la séquence
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

  // Badge discret en bas à gauche de la carte
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

  // Réinitialiser le curseur avec la borne MJ débloquée
  initCurseurInline();
  renderZones();
}

function annulerModeMJ() {
  fermerPopup();
  renderZones(); // masquer à nouveau l'Île du Maïs
}

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
    zoomControl: false,  // désactiver les boutons natifs
  });

  function positionnerBoutonsZoom() {
    const wrap = document.getElementById('carte-wrap');
    const controls = document.querySelector('.carte-zoom-controls');
    if (!wrap || !controls) return;
    const parent = controls.offsetParent;
    const wrapRect = wrap.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    // right = distance entre le bord droit du parent et le bord gauche de carte-wrap
    controls.style.right = (parentRect.right - wrapRect.left) + 'px';
    controls.style.top = (wrapRect.top - parentRect.top) + 'px';
  }

  carteOverlayPrincipale = L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);

  const el = carteOverlayPrincipale.getElement();
  if (el) el.style.transition = 'opacity 0.9s ease';

  // Pane pour le fond sombre d'isolation — entre l'image (z:200) et les zones (z:400)
  carte.createPane('isolationFond');
  carte.getPane('isolationFond').style.zIndex = 410;
  carte.getPane('isolationFond').style.pointerEvents = 'none';

  // Pane pour le contour doré — au-dessus des zones (z:400)
  carte.createPane('isolationContour');
  carte.getPane('isolationContour').style.zIndex = 420;
  carte.getPane('isolationContour').style.pointerEvents = 'none';

  renderZones();
  renderPins();

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
    majWeightsZones(); // weights initialisés après que getMinZoom() est stable
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
    // Masquer le contour pendant tout mouvement de zoom
    if (isolationLayer) isolationLayer.setStyle({ opacity: 0 });
  });

  carte.on('moveend', () => {
    majWeightsZones();
    if (isolationLayer) {
      // Recalculer le weight, puis réafficher avec un court délai
      isolationLayer.setStyle({ weight: weightPourZoom(WEIGHTS.isolation, carte.getZoom()) });
      setTimeout(() => {
        if (isolationLayer) isolationLayer.setStyle({ opacity: 1 });
      }, 60);
    }
  });

  document.getElementById('carte-zoom-in')
    ?.addEventListener('click', () => carte.zoomIn(0.5));
  document.getElementById('carte-zoom-out')
    ?.addEventListener('click', () => carte.zoomOut(0.5));
  document.getElementById('carte-zoom-sombre')
    ?.addEventListener('click', () => {
      modeSombre = !modeSombre;
      carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
      document.getElementById('carte-zoom-sombre').classList.toggle('active', modeSombre);
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

// ─── Épaisseur des contours de référence (au dézoom max) ────────────────────
const WEIGHTS = {
  zone: 0.5,   // zone normale
  zoneActive: 2,     // zone sélectionnée
  isolation: 2,     // contour d'isolation
};
const ZOOM_FACTEUR = 1.5; // progression par niveau de zoom

// ─── Weight dynamique selon le zoom ──────────────────────────
// weight de base défini au zoom minimal de la carte (vue d'ensemble)
// À chaque niveau de zoom supplémentaire, on réduit d'un facteur
// pour que le tracé paraisse constant en "largeur géographique".
function weightPourZoom(weightBase, zoom) {
  const zoomMin = carte.getMinZoom();  // pas de fallback — appelée après init
  return Math.max(0.2, weightBase * Math.pow(ZOOM_FACTEUR, zoom - zoomMin));
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
        const intercepte = enregistrerClicSequence(j.id);
        if (intercepte) return;
        if (zoneActive === j.id) {
          fermerPanneau();
        } else {
          ouvrirPanneau(j.id);
        }
      });

      // Hover : épaisseur du tracé uniquement (préserve la teinte informative)
      poly.on('mouseover', () => {
        if (zoneActive !== j.id) poly.setStyle({ weight: weightPourZoom(WEIGHTS.zoneActive, carte.getZoom()) });
      });
      poly.on('mouseout', () => {
        if (zoneActive !== j.id) poly.setStyle({ weight: weightPourZoom(WEIGHTS.zone, carte.getZoom()) });
      });

      poly.bindTooltip(j.label || j.nom, {
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

    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  // ── Mode esclavage ──────────────────────────────────────────
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

    legende.setAttribute('aria-hidden', 'false');
    return;
  }

  if (overlayMode === 'masque') {
    liste.innerHTML = `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:0.85rem;color:var(--mist);">Teâtre de la Guerre en Amerique — Jaillot, Mortier &amp; Sanson, 1708.</span>`;
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
      /*weight: isActive ? 2 : 0.5,*/
    };
  } else {
    const puissanceId = j ? resoudre(j.puissance, anneeActive) : null;
    const masquee = overlayMode === 'geo' && puissancesMasquees.has(puissanceId);
    style = {
      fillOpacity: isActive ? 0.45 : (masquee ? 0.08 : 0.23),
      /*weight: isActive ? 2 : 0.5,*/
    };
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

  // Overlay isolation : fermer au clic
  const overlayEl = document.getElementById('carte-isolation-overlay');
  if (overlayEl) overlayEl.addEventListener('click', fermerIsolation);

  const btnSombre = document.getElementById('carte-mode-sombre-btn');
  if (btnSombre) btnSombre.addEventListener('click', () => {
    modeSombre = !modeSombre;
    carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
    btnSombre.classList.toggle('active', modeSombre);
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
      isolerTerritoire(li.dataset.id);
      const j = JURIDICTIONS.find(j => j.id === li.dataset.id);
      if (j) document.getElementById('carte-recherche-input').value = j.nom;
      container.innerHTML = '';
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

// ─── Isolation d'un territoire ───────────────────────────────
function isolerTerritoire(juridictionId) {
  fermerIsolation();

  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[juridictionId])
    ? ZONES_DATA[juridictionId]
    : (j?.zone?.length >= 3 ? [j.zone] : null);

  if (!contours) return;

  isolationActive = juridictionId;

  carte.getPane('overlayPane').style.pointerEvents = 'none';
  carte.getPane('markerPane').style.pointerEvents = 'none';

  // ── 1. Assombrir la carte ──
  if (carteOverlayPrincipale) carteOverlayPrincipale.setOpacity(0.05);
  Object.values(layersZones).forEach(groupe => {
    groupe.eachLayer(poly => poly.setStyle({ fillOpacity: 0, opacity: 0 }));
  });
  Object.values(markersMap).forEach(m => m.setOpacity(0));
  // Désactiver les overlays et la carte
  document.getElementById('carte-legende')?.classList.add('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('carte-isolation--disabled');
  });
  document.getElementById('carte').style.pointerEvents = 'none';

  // ── 2. Contour doré dans le pane "isolationContour" (z:450, au-dessus des zones) ──
  const latlngs = contours.map(pts => pts.map(([x, y]) => pixelToLatLng(x, y)));
  isolationLayer = L.polygon(latlngs, {
    color: '#ffffff',
    weight: 3,
    opacity: 0,              // commence invisible, animé par JS
    fillOpacity: 0,
    interactive: false,
    pane: 'isolationContour',
  });
  isolationLayer.addTo(carte);

  // ── 3. Animation fond et contour ──

  // a. Mettre en place les transitions CSS avant de changer les valeurs
  setTimeout(() => {
    const fondPane = carte.getPane('isolationFond');
    if (fondPane) fondPane.querySelectorAll('path').forEach(p => {
      p.style.transition = 'fill-opacity 0.9s ease';
    });
    const contourPane = carte.getPane('isolationContour');
    if (contourPane) contourPane.querySelectorAll('path').forEach(p => {
      p.style.transition = 'stroke 0.6s ease, stroke-width 0.4s ease';
    });
  }, 50);

  // b. Déclencher les changements — le CSS s'occupe du fondu
  setTimeout(() => {
    if (isolationRect) isolationRect.setStyle({ fillOpacity: 0.95 });
    if (isolationLayer) isolationLayer.setStyle({ color: '#ffffff', weight: 3, opacity: 1 });
  }, 60);

  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#c8973a', weight: 4, opacity: 1 });
  }, 300);

  // ── 4. Zoom sur le territoire ──
  setTimeout(() => {
    if (!isolationLayer) return;
    carte.flyToBounds(isolationLayer.getBounds(), {
      padding: [80, 80],
      maxZoom: carte.getMinZoom() + 2,
      duration: 1.2,      // secondes — ajuste à ton goût
      easeLinearity: 0.3, // plus petit = plus souple
    });
  }, 400); // décalé de 400ms pour laisser le fond sombre apparaître d'abord
}

function fermerIsolation() {
  if (!isolationActive) return;
  isolationActive = null;
  // Restaurer l'opacity en tenant compte du mode sombre
  if (carteOverlayPrincipale) carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
  if (isolationLayer) { carte.removeLayer(isolationLayer); isolationLayer = null; }
  // Réactiver
  document.getElementById('carte-legende')?.classList.remove('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('carte-isolation--disabled');
  });
  document.getElementById('carte').style.pointerEvents = '';
  carte.getPane('overlayPane').style.pointerEvents = '';
  carte.getPane('markerPane').style.pointerEvents = '';
}