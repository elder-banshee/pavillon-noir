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
let pairesChevauchement = [];
let mouseoutTimers = {};
let ecartementsActifs = {}; // clé = "idA:idB" → durée ms

// ─── Mode d'overlay ──────────────────────────────────────────
// 'geo' | 'densite' | 'esclavage' | 'autochtones' | 'masque' | 'isolation' | 'isolationVille'
let overlayMode = 'geo';
let overlayModeAvantIsolation = 'geo'; // mode à restaurer à la fermeture
let isolationJuridictionId = null;     // juridiction actuellement isolée
let isolationLayer = null;             // couche Leaflet du contour doré
let isolationVilleId = null;           // ville actuellement zoomée

// ─── Mode MJ ─────────────────────────────────────────────────
let modeMJ = false;
const SEQUENCE_MJ = ['eleuthera', 'marguerita', 'jamaique'];
let sequenceEnCours = [];
let attenteClic_IleDuMais = false;

// ─── Filtres de légende ───────────────────────────────────────
let puissancesMasquees = new Set();
const paliersMasquesDensite = new Set();
const paliersMasquesEsclavage = new Set();

// ─── Intitulés des modes overlay ─────────────────────────────
const OVERLAY_LABELS = {
  geo: 'Souverainetés revendiquées et établies',
  densite: 'Densité de population',
  esclavage: 'Esclavage & Encomienda',
  autochtones: 'Foyers de populations autochtones',
  masque: 'Carte Jaillot (1708)',
};

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

// ─── Épaisseurs de contours ───────────────────────────────────
const WEIGHTS = {
  zone: 0.5,
  zoneActive: 2,
  isolation: 2,
};
const ZOOM_FACTEUR = 1.5;

// ─── Utilitaires purs ────────────────────────────────────────
function pixelToLatLng(x, y) {
  return L.latLng(CARTE_IMAGE.height - y, x);
}

function normaliser(str) {
  return str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/-/g, ' ');
}

function weightPourZoom(weightBase, zoom) {
  const zoomMin = carte.getMinZoom();
  return Math.max(0.2, weightBase * Math.pow(ZOOM_FACTEUR, zoom - zoomMin));
}

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
  return contexte
    .filter(b => annee >= (b.de ?? 0) && (b.a == null || annee < b.a))
    .map(b => b.texte)
    .filter(Boolean)
    .join('<br><br>');
}

function lireTranslate3d(el) {
  // Extrait le translate3d Leaflet de style.transform
  if (!el) return 'translate3d(0px,0px,0px)';
  const m = el.style.transform.match(/translate3d\([^)]+\)/);
  return m ? m[0] : 'translate3d(0px,0px,0px)';
}

// ─── Fonctions de couleur overlay ────────────────────────────
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

// ─── Calcul / année ──────────────────────────────────────────
function calculerAnneeMax() {
  let max = CARTE_ANNEE_REFERENCE;
  function scanBlocs(val) {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      val.forEach(b => {
        if (b.a && b.a > max) max = b.a;
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

// ─── SVG builders ────────────────────────────────────────────
function pinSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18S26 19 26 12c0-5.523-4.477-10-10-10z"
      fill="#c8973a" stroke="#0e0c09" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="4" fill="#0e0c09"/>
  </svg>`;
}

function villeSVG(type, taille = 24, estPirate = false, estIsole = false, estActive = false) {
  const estSite = (type === 'site_geo' || type === 'site_hist');
  const fond = estIsole ? 'rgba(0,0,0,0)'
    : estActive ? (estPirate ? '#3a3a3a' : (estSite ? '#c7edfd' : '#9aae9a'))
      : estPirate ? '#0e0c09'
        : estSite ? '#a8d4e8'
          : '#7a8c7a';

  const couleurTrait = estIsole ? '#c8973a'
    : estPirate ? '#f2e8d5'
      : '#0e0c09';

  let symbole = '';

  if (type === 'port') {
    symbole = `
      <circle cx="16" cy="9" r="2" fill="none" stroke="${couleurTrait}" stroke-width="1.5"/>
      <line x1="16" y1="11" x2="16" y2="23" stroke="${couleurTrait}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="13" y1="14" x2="19" y2="14" stroke="${couleurTrait}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M10 19 C10 23 13 23 16 23" fill="none" stroke="${couleurTrait}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M22 19 C22 23 19 23 16 23" fill="none" stroke="${couleurTrait}" stroke-width="1.5" stroke-linecap="round"/>`;
  } else if (type === 'fort') {
    const couleurCroix = estIsole ? '#c8973a' : '#e8ede8';
    symbole = `
      <rect x="9" y="9" width="14" height="14" rx="1"
        fill="${estIsole ? 'none' : '#0e0c09'}" stroke="${estIsole ? '#c8973a' : couleurTrait}" stroke-width="1.2"/>
      <line x1="12" y1="12" x2="20" y2="20" stroke="${couleurCroix}" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="12" x2="12" y2="20" stroke="${couleurCroix}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (type === 'site_geo') {
    const couleurNeige = estIsole ? '#c8973a' : '#ffffff';
    symbole = `
      <g transform="translate(4.85,9.12) scale(0.18)">
        <path d="M87.22,20.9l-11,16.52L51.87.9.93,77.3H124.82Z" fill="${estIsole ? 'none' : couleurTrait}" stroke="${couleurTrait}" stroke-width="${estIsole ? '8' : '1.2'}"/>
      </g>
      <g transform="translate(4.85,9.12) scale(0.18)">
        <polygon data-preserve="1" points="38.44 20.9 65.14 20.9 51.74 0.9 38.44 20.9" fill="${estIsole ? couleurTrait : couleurNeige}" stroke="${couleurTrait}" stroke-width="${estIsole ? '0' : '1.2'}"/>
      </g>`;
  } else if (type === 'site_hist') {
    symbole = `
      <g transform="translate(4.85,8.54) scale(0.19)">
        <path d="M115.12,69.85a1,1,0,0,0-1-.75H72.45l1.15,9.43h43.8Z" fill="${couleurTrait}"/>
        <path d="M2.27,69.85,0,78.53H43.8L45,69.1H3.25A1,1,0,0,0,2.27,69.85Z" fill="${couleurTrait}"/>
        <path d="M107.48,65.57,105.2,56.9a1,1,0,0,0-1-.75H70.87L72,65.58h35.46Z" fill="${couleurTrait}"/>
        <path d="M12.2,56.9,9.93,65.58H45.5l1.24-9.43H13.17A1,1,0,0,0,12.2,56.9Z" fill="${couleurTrait}"/>
        <path d="M97.55,52.62,95.27,44a1,1,0,0,0-1-.75h-25l1.14,9.43H97.55Z" fill="${couleurTrait}"/>
        <path d="M23.1,43.2a1,1,0,0,0-1,.75l-2.28,8.68H47.2l1.24-9.43Z" fill="${couleurTrait}"/>
        <path d="M68.87,39.68H87.62L85.35,31a1,1,0,0,0-1-.74H67.72Z" fill="${couleurTrait}"/>
        <path d="M50.14,30.25H33a1,1,0,0,0-1,.75l-2.27,8.68H48.9Z" fill="${couleurTrait}"/>
        <path d="M67.29,26.72H77.7L75.42,18a1,1,0,0,0-1-.75H66.14Z" fill="${couleurTrait}"/>
        <path d="M51.84,17.29H43A1,1,0,0,0,42,18L39.7,26.72H50.6Z" fill="${couleurTrait}"/>
        <polygon points="55.87,17.3 47.84,78.53 69.57,78.53 62.11,17.3 55.87,17.3" fill="${couleurTrait}"/>
        <path d="M44.7,4h2V14.24a1,1,0,0,0,1,1h7a0,0,0,0,0,0,0V10.3a4.14,4.14,0,0,1,3.65-4.19,4,4,0,0,1,4.35,4v5.1a0,0,0,0,0,0,0h7a1,1,0,0,0,1-1V4h2a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1h-28a1,1,0,0,0-1,1V3A1,1,0,0,0,44.7,4Z" fill="${couleurTrait}"/>
      </g>`;
  } else {
    symbole = `
      <path d="M10 16 L16 10 L22 16" fill="none" stroke="${couleurTrait}" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="12" y="16" width="8" height="7" rx="0.5" fill="none" stroke="${couleurTrait}" stroke-width="1.5"/>
      <rect x="15" y="19" width="2.5" height="4" rx="0.3" fill="${couleurTrait}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${taille}" height="${taille}">
    <rect x="3" y="3" width="26" height="26" rx="5"
      fill="${fond}" stroke="${couleurTrait}" stroke-width="1.5"/>
    ${symbole}
  </svg>`;
}

// ─── Icônes villes — helpers ─────────────────────────────────
function tailleIconeVille() {
  const zoom = carte.getZoom();
  if (zoom >= 1) return 60;
  if (zoom >= -1) return 36;
  return 24;
}

function labelVille(ville) {
  if (ville.label) return ville.label;
  const SEUIL_PETIT_TERRITOIRE = 25000;
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[ville.territoire] : null;
  if (demo && demo.superficie < SEUIL_PETIT_TERRITOIRE) {
    const j = JURIDICTIONS.find(j => j.id === ville.territoire);
    const nomTerritoire = j ? (j.label || j.nom) : null;
    if (nomTerritoire) return `${ville.nom} (${nomTerritoire})`;
  }
  return ville.nom;
}

function _infoMarqueurVille(villeId) {
  const marker = markersVilles[villeId];
  const ville = VILLES.find(v => v.id === villeId);
  if (!marker || !ville) return null;
  const estPirate = (Array.isArray(ville.capitale)
    ? rendreChamp(ville.capitale, anneeActive)
    : ville.capitale) === 'pirate';
  return { marker, ville, estPirate, taille: tailleIconeVille() };
}

function setIconeVilleActive(villeId, actif) {
  const info = _infoMarqueurVille(villeId);
  if (!info) return;
  const { marker, ville, estPirate, taille } = info;
  marker.setIcon(L.divIcon({
    html: villeSVG(ville.type || 'ville', taille, estPirate, false, actif),
    className: 'carte-ville',
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  }));
}

function setIconeVilleIsoleeHover(villeId, hover) {
  const info = _infoMarqueurVille(villeId);
  if (!info) return;
  const { marker, ville, estPirate, taille } = info;
  const svgBase = villeSVG(ville.type || 'ville', taille, estPirate, true, false);
  const svgHover = hover
    ? svgBase.replace('fill="rgba(0,0,0,0)"', 'fill="rgba(200,151,58,0.25)"')
    : svgBase;
  marker.setIcon(L.divIcon({
    html: svgHover,
    className: 'carte-ville',
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  }));
}

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
  renderVilles();
}

function annulerModeMJ() {
  fermerPopup();
  renderZones();
}

// ─── Écran de chargement ─────────────────────────────────────
function masquerEcranChargement() {
  const ecran = document.getElementById('carte-chargement');
  if (!ecran) return;
  ecran.style.opacity = '0';
  setTimeout(() => ecran.remove(), 700);
}

function fermerTooltipsOrphelins() {
  carte.eachLayer(l => { if (l.getTooltip?.() && l.isTooltipOpen?.()) l.closeTooltip(); });
}

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

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  function initTout() {
    initCarte();
    initCurseurInline();
    initOverlayBtns();
    majLegende();
    const closeBtn = document.getElementById('carte-panneau-close');
    if (closeBtn) closeBtn.addEventListener('click', fermerPanneau);
    initPanneauGauche();
    initRecherche();
    initFiltresMarqueurs();
    masquerEcranChargement();
  }

  const imgPreload = new Image();
  imgPreload.src = CARTE_IMAGE.src;
  imgPreload.decode().then(initTout).catch(initTout);
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

  // Pane pour le contour global (chantier en attente)
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
    fermerZoomVille();
    // Rapprocher les marqueurs écartés avec animation
    pairesChevauchement.forEach(paire => rapprocherVille(paire.idA));
  });

  carte.on('zoom', () => {
    // Après un zoom, Leaflet réécrit translate3d — on réapplique notre décalage immédiatement
    for (const [cle, etat] of Object.entries(ecartementsActifs)) {
      const [idA, idB] = cle.split(':');
      const elA = markersVilles[idA]?.getElement();
      const elB = markersVilles[idB]?.getElement();
      if (elA) { const t = lireTranslate3d(elA); elA.style.transition = ''; elA.style.transform = `${t} translate(${etat.dxA}px, ${etat.dyA}px)`; }
      if (elB) { const t = lireTranslate3d(elB); elB.style.transition = ''; elB.style.transform = `${t} translate(${etat.dxB}px, ${etat.dyB}px)`; }
    }
  });
  carte.getContainer().addEventListener('mouseleave', fermerTooltipsOrphelins);
  carte.on('mouseout', fermerTooltipsOrphelins);

  setTimeout(() => {
    carte.invalidateSize();
    carte.fitBounds(bounds, { padding: [0, 0] });
    carte.setMinZoom(carte.getZoom());
    carte.setMaxBounds(bounds);
    majWeightsZones();
    positionnerBoutonsZoom();
    calculerPairesChevauchement();
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
    majTailleIconesVilles();
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
      if (overlayMode !== 'isolation' && overlayMode !== 'isolationVille') {
        carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
      }
      document.getElementById('carte-zoom-sombre').classList.toggle('active', modeSombre);
      renderContourGlobal();
    });
}

// ─── Curseur temporel inline ──────────────────────────────────
function initCurseurInline() {
  const valeur = document.getElementById('curseur-valeur');
  const prevOld = document.getElementById('curseur-prev');
  const nextOld = document.getElementById('curseur-next');
  const prev = prevOld.cloneNode(true);
  const next = nextOld.cloneNode(true);
  prevOld.replaceWith(prev);
  nextOld.replaceWith(next);
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
      renderVilles();
      if (zoneActive) ouvrirPanneau(zoneActive);
      if (villeActive) ouvrirPanneauVille(villeActive);
    }
  });

  next.addEventListener('click', () => {
    if (anneeActive < anneeMax) {
      anneeActive++;
      majAffichage();
      renderZones();
      majLegende();
      renderVilles();
      if (zoneActive) ouvrirPanneau(zoneActive);
      if (villeActive) ouvrirPanneauVille(villeActive);
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
      renderContourGlobal();
    });
  });
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

// ─── Filtres marqueurs (panneau gauche) ──────────────────────
function initFiltresMarqueurs() {
  const maitre        = document.getElementById('filtre-marqueurs-tout');
  const scenarios     = document.getElementById('filtre-scenarios');
  const etablissements = document.getElementById('filtre-etablissements');
  const secondaires   = document.getElementById('filtre-secondaires');
  const sites         = document.getElementById('filtre-sites');

  const enfants = [scenarios, etablissements, secondaires, sites].filter(Boolean);

  function estCoche(el) { return el.querySelector('input').checked; }

  function majMaitre() {
    if (!maitre) return;
    const nb = enfants.filter(estCoche).length;
    const inputMaitre = maitre.querySelector('input');
    if (nb === 0) {
      inputMaitre.checked = false;
      inputMaitre.indeterminate = false;
      maitre.classList.add('decochee');
    } else if (nb === enfants.length) {
      inputMaitre.checked = true;
      inputMaitre.indeterminate = false;
      maitre.classList.remove('decochee');
    } else {
      inputMaitre.checked = false;
      inputMaitre.indeterminate = true;
      maitre.classList.remove('decochee');
    }
  }

  function toggleEnfant(el, renderFn) {
    if (overlayMode === 'isolation' || overlayMode === 'isolationVille') return;
    const input = el.querySelector('input');
    // Ne pas inverser ici — le preventDefault dans le listener empêche le toggle natif,
    // donc on gère l'état manuellement
    input.checked = !input.checked;
    el.classList.toggle('decochee', !input.checked);
    majMaitre();
    renderFn();
  }

  if (maitre) {
    maitre.addEventListener('click', (e) => {
      e.preventDefault();
      if (overlayMode === 'isolation' || overlayMode === 'isolationVille') return;
      const inputMaitre = maitre.querySelector('input');
      const toutCoche = enfants.every(estCoche);
      const nouvelEtat = !toutCoche;
      enfants.forEach(el => {
        el.querySelector('input').checked = nouvelEtat;
        el.classList.toggle('decochee', !nouvelEtat);
      });
      inputMaitre.indeterminate = false;
      inputMaitre.checked = nouvelEtat;
      maitre.classList.toggle('decochee', !nouvelEtat);
      renderPins();
      renderVilles();
    });
  }

  function addToggle(el, renderFn) {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleEnfant(el, renderFn);
    });
  }

  addToggle(scenarios,      renderPins);
  addToggle(etablissements, renderVilles);
  addToggle(secondaires,    renderVilles);
  addToggle(sites,          renderVilles);

  // Initialiser l'état de la case maître au chargement
  // (certains enfants peuvent démarrer décochés, ex. filtre-secondaires)
  majMaitre();
  if (secondaires && !secondaires.querySelector('input').checked) {
    secondaires.classList.add('decochee');
  }
}

// ─── Recherche prédictive ─────────────────────────────────────
function initRecherche() {
  const input = document.getElementById('carte-recherche-input');
  const suggestions = document.getElementById('carte-recherche-suggestions');
  const clear = document.getElementById('carte-recherche-clear');
  const fantome = document.getElementById('carte-recherche-fantome');
  if (!input || !suggestions || !clear) return;

  let valeurCompletee = null;
  let suggestionActive = null;

  input.addEventListener('input', () => {
    valeurCompletee = null;
    suggestionActive = null;
    const q = input.value;
    const qTrim = q.trim();
    clear.style.display = qTrim ? '' : 'none';
    if (fantome) fantome.textContent = '';
    if (!qTrim) { suggestions.innerHTML = ''; return; }

    afficherSuggestions(q, suggestions);

    if (fantome) {
      const premierItem = suggestions.querySelector('.carte-recherche-suggestion');
      if (premierItem) {
        const qLow2 = normaliser(q);
        const nomPremier = premierItem.dataset.nom || '';
        const tagPremier = premierItem.dataset.matchtag || '';
        const nomLow = normaliser(nomPremier);
        const tagLow = normaliser(tagPremier);
        if (nomLow.startsWith(qLow2)) {
          fantome.textContent = q + nomPremier.slice(q.length);
        } else if (tagLow.startsWith(qLow2)) {
          fantome.textContent = q + tagPremier.slice(q.length);
        }
      }
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    clear.style.display = 'none';
    suggestions.innerHTML = '';
    if (fantome) fantome.textContent = '';
    fermerIsolation();
    input.focus();
  });

  suggestions.addEventListener('mousedown', e => e.preventDefault());

  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && fantome && fantome.textContent) {
      e.preventDefault();
      input.value = fantome.textContent;
      valeurCompletee = fantome.textContent;
      fantome.textContent = '';
      suggestions.innerHTML = '';
      input.focus();
      return;
    }

    const items = suggestions.querySelectorAll('.carte-recherche-suggestion');
    let idx = suggestionActive ? [...items].indexOf(suggestionActive) : -1;

    if (e.key === 'Enter') {
      e.preventDefault();
      const cible = suggestionActive || suggestions.querySelector('.carte-recherche-suggestion--active');
      if (cible) {
        suggestionActive = null;
        const id = cible.dataset.id;
        const type = cible.dataset.type;
        const nom = cible.dataset.nom || '';
        suggestions.innerHTML = '';
        if (fantome) fantome.textContent = '';
        if (nom) input.value = nom;
        if (type === 'ville') zoomerVille(id);
        else isolerTerritoire(id);
        return;
      }
      if (items.length === 1) { items[0].click(); return; }
      const q = input.value.trim();
      if (!q) return;
      const qLow = normaliser(q);
      if (typeof VILLES !== 'undefined') {
        const v = VILLES.find(v => v.coords && normaliser(v.nom) === qLow);
        if (v) { zoomerVille(v.id); return; }
      }
      const j = JURIDICTIONS.find(j => {
        if (j.visible_mj && !modeMJ) return false;
        return normaliser(j.nom) === qLow;
      });
      if (j) { isolerTerritoire(j.id); return; }
      if (typeof VILLES !== 'undefined') {
        const vTag = VILLES.find(v => v.coords &&
          (v.tags || [v.nom, v.label].filter(Boolean)).some(t => normaliser(t) === qLow)
        );
        if (vTag) { zoomerVille(vTag.id); return; }
      }
      const jTag = JURIDICTIONS.find(j => {
        if (j.visible_mj && !modeMJ) return false;
        return j.tags?.some(t => normaliser(t) === qLow);
      });
      if (jTag) { isolerTerritoire(jTag.id); return; }
      if (valeurCompletee) {
        const jC = JURIDICTIONS.find(j => j.nom === valeurCompletee.trim());
        if (jC) { isolerTerritoire(jC.id); valeurCompletee = null; return; }
        if (typeof VILLES !== 'undefined') {
          const vC = VILLES.find(v => v.nom === valeurCompletee.trim() && v.coords);
          if (vC) { zoomerVille(vC.id); valeurCompletee = null; return; }
        }
      }
      return;
    }

    if (!items.length) return;

    function naviguerSuggestion(delta) {
      if (suggestionActive) suggestionActive.classList.remove('carte-recherche-suggestion--active');
      idx = (idx + delta + items.length) % items.length;
      items[idx].classList.add('carte-recherche-suggestion--active');
      items[idx].scrollIntoView({ block: 'nearest' });
      suggestionActive = items[idx];
      if (fantome) {
        const q = input.value.trim();
        const nomSel = items[idx].dataset.nom || '';
        fantome.textContent = normaliser(nomSel).startsWith(normaliser(q)) ? q + nomSel.slice(q.length) : '';
      }
    }

    if (e.key === 'ArrowDown') { e.preventDefault(); naviguerSuggestion(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); naviguerSuggestion(-1); }
    else if (e.key === 'Escape') {
      fermerIsolation();
      input.value = '';
      clear.style.display = 'none';
      suggestions.innerHTML = '';
      if (fantome) fantome.textContent = '';
    }
  });
}

function afficherSuggestions(q, container) {
  const qLow = normaliser(q);
  const resultats = [];

  JURIDICTIONS.forEach(j => {
    if (!j.tags || !j.tags.length) return;
    if (j.visible_mj && !modeMJ) return;
    let matchTag = null;
    for (const tag of j.tags) {
      if (normaliser(tag).includes(qLow)) { matchTag = tag; break; }
    }
    if (matchTag) resultats.push({ type: 'juridiction', item: j, nom: j.nom, matchTag });
  });

  if (typeof VILLES !== 'undefined') {
    const filtreEtablissements = document.getElementById('filtre-etablissements');
    const filtreSecondaires = document.getElementById('filtre-secondaires');
    const filtreSites = document.getElementById('filtre-sites');
    const afficherPrincipaux = filtreEtablissements?.querySelector('input').checked ?? true;
    const afficherSecondaires = filtreSecondaires?.querySelector('input').checked ?? true;
    const afficherSites = filtreSites?.querySelector('input').checked ?? true;

    VILLES.forEach(ville => {
      if (!ville.coords) return;
      const rang = ville.rang ?? '1';
      const estSite = (ville.type === 'site_geo' || ville.type === 'site_hist');
      if (rang === '3' && !modeMJ) return;
      if (estSite && !afficherSites) return;
      if (!estSite && rang === '2' && !afficherSecondaires) return;
      if (!estSite && rang !== '2' && !afficherPrincipaux) return;
      const tags = ville.tags || [ville.nom, ville.label].filter(Boolean);
      let matchTag = null;
      for (const tag of tags) {
        if (normaliser(tag).includes(qLow)) { matchTag = tag; break; }
      }
      if (matchTag) resultats.push({ type: 'ville', item: ville, nom: ville.nom, matchTag });
    });
  }

  if (!resultats.length) {
    container.innerHTML = `<li class="carte-recherche-vide">Aucun résultat</li>`;
    return;
  }

  resultats.sort((a, b) => {
    const rang = r => {
      const nomLow = normaliser(r.nom);
      const tagLow = normaliser(r.matchTag);
      const estVille = r.type === 'ville';
      const nomDebut = nomLow.startsWith(qLow);
      const nomContient = nomLow.includes(qLow);
      const tagDebut = tagLow.startsWith(qLow);
      if (nomDebut) return estVille ? 0 : 1;
      if (nomContient) return estVille ? 2 : 3;
      if (tagDebut) return estVille ? 4 : 5;
      return estVille ? 6 : 7;
    };
    const ra = rang(a), rb = rang(b);
    if (ra !== rb) return ra - rb;
    return normaliser(a.nom).localeCompare(normaliser(b.nom), 'fr');
  });

  container.innerHTML = resultats.slice(0, 12).map(({ type, item, nom, matchTag }) => {
    const nomMatch = matchTag === nom;
    const matchHtml = nomMatch ? '' :
      `<span class="carte-recherche-suggestion-match">${surlignerMatch(matchTag, qLow)}</span>`;
    return `<li class="carte-recherche-suggestion" role="option"
      data-id="${item.id}" data-type="${type}" data-nom="${escapeHtml(nom)}" data-matchtag="${escapeHtml(matchTag)}">
      <span class="carte-recherche-suggestion-nom">${surlignerMatch(nom, qLow)}</span>
      ${matchHtml}
    </li>`;
  }).join('');

  container.querySelectorAll('.carte-recherche-suggestion').forEach(li => {
    li.addEventListener('click', () => {
      const id = li.dataset.id;
      const type = li.dataset.type;
      container.innerHTML = '';
      if (fantome) fantome.textContent = '';
      if (type === 'ville') {
        const ville = VILLES.find(v => v.id === id);
        if (ville) document.getElementById('carte-recherche-input').value = ville.nom;
        zoomerVille(id);
      } else {
        const j = JURIDICTIONS.find(j => j.id === id);
        if (j) document.getElementById('carte-recherche-input').value = j.nom;
        isolerTerritoire(id);
      }
    });
  });
}

function surlignerMatch(texte, qLow) {
  const texteLow = normaliser(texte);
  const idx = texteLow.indexOf(qLow);
  if (idx === -1) return escapeHtml(texte);
  return escapeHtml(texte.slice(0, idx))
    + `<mark class="carte-recherche-highlight">${escapeHtml(texte.slice(idx, idx + qLow.length))}</mark>`
    + escapeHtml(texte.slice(idx + qLow.length));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    const isEffacee = (overlayMode === 'isolation' && !isIsolee) || overlayMode === 'isolationVille';

    let couleur, fillOpacity, strokeColor, strokeWeight, strokeOpacity;

    if (isEffacee) {
      // Toutes les autres zones sont invisibles en mode isolation
      couleur = 'transparent';
      fillOpacity = 0;
      strokeColor = 'transparent';
      strokeWeight = 0;
      strokeOpacity = 0;

    } else if (overlayMode === 'densite' || overlayMode === 'esclavage' || overlayMode === 'autochtones') {
      const fnCouleur = overlayMode === 'densite' ? couleurDensite
        : overlayMode === 'esclavage' ? couleurEsclavage
          : id => couleurAutochtone(id, anneeActive);
      const c = fnCouleur(j.id);
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
        if (overlayMode === 'isolationVille') {
          fermerZoomVille();
          ouvrirPanneau(j.id);
          return;
        }
        if (overlayMode === 'isolation') {
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
        fermerTooltipsOrphelins();
        // Remettre en repos toutes les icônes villes hors ville active et isolation
        Object.keys(markersVilles).forEach(id => {
          if (id !== villeActive && id !== isolationVilleId) setIconeVilleActive(id, false);
        });
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

  const filtre = document.getElementById('filtre-scenarios');
  if (filtre && !filtre.querySelector('input').checked) return;

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

// ─── Marqueurs de villes ──────────────────────────────────────
function renderVilles() {
  // Nettoyer les marqueurs existants
  Object.values(markersVilles).forEach(m => carte.removeLayer(m));
  markersVilles = {};

  // Visible uniquement hors masque/isolation
  if (overlayMode === 'masque') return;

  const filtreEtablissements = document.getElementById('filtre-etablissements');
  const filtreSecondaires = document.getElementById('filtre-secondaires');
  const filtreSites = document.getElementById('filtre-sites');
  const afficherPrincipaux = filtreEtablissements?.querySelector('input').checked ?? true;
  const afficherSecondaires = filtreSecondaires?.querySelector('input').checked ?? true;
  const afficherSites = filtreSites?.querySelector('input').checked ?? true;

  if (typeof VILLES === 'undefined') return;

  VILLES.forEach(ville => {
    if (!ville.coords) return;
    if (ville.visible_de && anneeActive < ville.visible_de) return;

    const rang = ville.rang ?? '1';
    const estSite = (ville.type === 'site_geo' || ville.type === 'site_hist');

    // Rang 3 : visible uniquement en mode MJ
    if (rang === '3' && !modeMJ) return;

    // Filtrage par catégorie
    if (estSite) { if (!afficherSites) return; }
    else if (rang === '2') { if (!afficherSecondaires) return; }
    else { if (!afficherPrincipaux) return; }

    const [x, y] = ville.coords;
    const latlng = pixelToLatLng(x, y);
    const statutCapitale = Array.isArray(ville.capitale)
      ? rendreChamp(ville.capitale, anneeActive)
      : ville.capitale;
    const estPirate = statutCapitale === 'pirate';

    const icon = L.divIcon({
      html: villeSVG(ville.type || 'ville', tailleIconeVille(), estPirate),
      className: 'carte-ville',
      iconSize: [tailleIconeVille(), tailleIconeVille()],
      iconAnchor: [tailleIconeVille() / 2, tailleIconeVille() / 2],
    });

    const marker = L.marker(latlng, { icon });

    marker.bindTooltip(labelVille(ville), {
      permanent: false,
      direction: 'top',
      className: 'carte-tooltip',
      opacity: 1,
      offset: [0, -10],
      interactive: false,
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      if (overlayMode === 'isolationVille') {
        fermerZoomVille({ ouvrirVille: true });
        return;
      }
      if (overlayMode === 'isolation') return;
      fermerPopup();
      if (villeActive === ville.id) {
        fermerPanneauVille();
      } else {
        ouvrirPanneauVille(ville.id);
      }
    });

    marker.on('mouseover', () => {
      marker.openTooltip();
      // Remettre en repos toutes les icônes villes hors ville survolée, active et isolation
      Object.keys(markersVilles).forEach(id => {
        if (id !== ville.id && id !== villeActive && id !== isolationVilleId) setIconeVilleActive(id, false);
      });
      // Annuler les timers de mouseout pour cette ville et ses voisines de paire
      clearTimeout(mouseoutTimers[ville.id]);
      for (const paire of pairesChevauchement) {
        if (paire.idA === ville.id || paire.idB === ville.id) {
          const cle = `${paire.idA}:${paire.idB}`;
          clearTimeout(mouseoutTimers[cle]);
          clearTimeout(mouseoutTimers[paire.idA]);
          clearTimeout(mouseoutTimers[paire.idB]);
        }
      }
      if (overlayMode === 'isolationVille' && ville.id === isolationVilleId) {
        setIconeVilleIsoleeHover(ville.id, true);
        return;
      }
      if (villeActive !== ville.id) setIconeVilleActive(ville.id, true);
      ecarterVille(ville.id);
    });
    marker.on('mouseout', () => {
      marker.closeTooltip();
      // Timer indexé par clé de paire — un seul rapprocherVille par paire
      let estDansUnePaire = false;
      for (const paire of pairesChevauchement) {
        if (paire.idA !== ville.id && paire.idB !== ville.id) continue;
        estDansUnePaire = true;
        const cle = `${paire.idA}:${paire.idB}`;
        clearTimeout(mouseoutTimers[cle]);
        mouseoutTimers[cle] = setTimeout(() => {
          if (overlayMode === 'isolationVille' && ville.id === isolationVilleId) {
            setIconeVilleIsoleeHover(ville.id, false);
            return;
          }
          if (villeActive !== ville.id) setIconeVilleActive(ville.id, false);
          if (villeActive !== ville.id) rapprocherVille(ville.id);
        }, 550);
      }
      // Timer individuel uniquement pour les villes sans paire
      if (!estDansUnePaire) {
        mouseoutTimers[ville.id] = setTimeout(() => {
          if (overlayMode === 'isolationVille' && ville.id === isolationVilleId) {
            setIconeVilleIsoleeHover(ville.id, false);
            return;
          }
          if (villeActive !== ville.id) setIconeVilleActive(ville.id, false);
          if (villeActive !== ville.id) rapprocherVille(ville.id);
        }, 550);
      }
    });

    marker.addTo(carte);
    markersVilles[ville.id] = marker;
  });
}

// ─── Mise à jour taille icônes villes au zoom ─────────────────
function majTailleIconesVilles() {
  const taille = tailleIconeVille();
  Object.entries(markersVilles).forEach(([id, marker]) => {
    const ville = VILLES.find(v => v.id === id);
    if (!ville) return;
    const statutCapitale = Array.isArray(ville.capitale)
      ? rendreChamp(ville.capitale, anneeActive)
      : ville.capitale;
    const estPirate = statutCapitale === 'pirate';
    const estIsole = overlayMode === 'isolationVille' && id === isolationVilleId;
    const estActive = !estIsole && villeActive === id;
    marker.setIcon(L.divIcon({
      html: villeSVG(ville.type || 'ville', taille, estPirate, estIsole, estActive),
      className: 'carte-ville',
      iconSize: [taille, taille],
      iconAnchor: [taille / 2, taille / 2],
    }));
  });
}

// ─── Contour global des terres émergées ──────────────────────
let contourGlobalSvgCache = null;

async function renderContourGlobal() {
  if (!(modeSombre && overlayMode === 'masque')) {
    if (contourGlobalLayer) { carte.removeLayer(contourGlobalLayer); contourGlobalLayer = null; }
    return;
  }
  if (!contourGlobalSvgCache) {
    try {
      const r = await fetch('medias/cartes/jaillot_1708-tracés/jaillot_1708-contour_global.svg');
      contourGlobalSvgCache = await r.text();
    } catch (e) {
      console.warn('jaillot_1708-contour_global.svg introuvable :', e);
      return;
    }
  }
  if (contourGlobalLayer) { carte.removeLayer(contourGlobalLayer); contourGlobalLayer = null; }

  const parser = new DOMParser();
  const doc = parser.parseFromString(contourGlobalSvgCache, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return;

  svgEl.querySelectorAll('path, polygon, polyline').forEach(el => {
    el.setAttribute('stroke', 'var(--gold, #c8973a)');
    el.setAttribute('stroke-width', '3');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('stroke-linecap', 'round');
  });

  const W = CARTE_IMAGE.width;
  const H = CARTE_IMAGE.height;
  const bounds = [[0, 0], [H, W]];

  contourGlobalLayer = L.svgOverlay(svgEl, bounds, {
    interactive: false,
    pane: 'contourGlobal',
  });
  contourGlobalLayer.addTo(carte);
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

  if (overlayMode === 'isolation' || overlayMode === 'isolationVille') {
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

// ─── Panneau droit ───────────────────────────────────────────
function ouvrirPanneau(juridictionId) {
  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  if (!j) return;

  const precedent = zoneActive;
  zoneActive = juridictionId;
  if (villeActive) { setIconeVilleActive(villeActive, false); rapprocherVille(villeActive); villeActive = null; }
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

function resetEtatsVisuels() {
  // Remet toutes les icônes villes en repos (sauf ville isolée en cours)
  Object.keys(markersVilles).forEach(id => {
    if (id !== isolationVilleId) setIconeVilleActive(id, false);
  });
  // Remet tous les polygones de zones en repos
  Object.keys(layersZones).forEach(id => {
    if (id !== zoneActive) majZone(id);
  });
  // Referme tous les écartements actifs
  Object.keys(ecartementsActifs).forEach(cle => {
    const [idA, idB] = cle.split(':');
    rapprocherVille(idA);
  });
}

function fermerPanneau() {
  const panneau = document.getElementById('carte-panneau');
  panneau.classList.remove('carte-panneau--open');
  panneau.setAttribute('inert', '');
  if (zoneActive) { const precedent = zoneActive; zoneActive = null; majZone(precedent); }
  villeActive = null;
  resetEtatsVisuels();
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

  if (villeActive && villeActive !== villeId) { setIconeVilleActive(villeActive, false); rapprocherVille(villeActive); }
  villeActive = villeId;

  // Ne pas écraser l'icône isolée si on vient de zoomerVille()
  if (overlayMode !== 'isolationVille') { setIconeVilleActive(villeId, true); ecarterVille(villeId); }

  const statutCapitale = Array.isArray(ville.capitale)
    ? rendreChamp(ville.capitale, anneeActive)
    : ville.capitale;
  const estCapitale = statutCapitale === true;
  const estPirate = statutCapitale === 'pirate';
  const couleurStatut = estCapitale ? 'var(--gold)' : 'var(--mist)';
  const labelType = { port: 'Port', fort: 'Fort', ville: 'Ville' }[ville.type] || 'Ville';
  const labelEntete = ville.description
    ? ville.description + (estCapitale ? ' · Capitale' : '')
    : estCapitale
      ? (ville.type && ville.type !== 'ville' ? labelType + ' · Capitale' : 'Capitale')
      : labelType;

  const inner = document.getElementById('carte-panneau-inner');
  inner.innerHTML = `
    <div class="panneau-puissance" style="gap:0.5rem;align-items:center;">
      <span style="font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.12em;
        text-transform:uppercase;color:${couleurStatut};">
        ${labelEntete}
      </span>
    </div>
    <h2 class="panneau-nom">${ville.nom}</h2>
    ${ville.contexte ? (() => {
      const contexteHtml = rendreContexte(ville.contexte, anneeActive);
      return contexteHtml ? `
        <div class="panneau-section-titre">Contexte</div>
        <p class="panneau-contexte">${contexteHtml}</p>
      ` : '';
    })() : ''}
    ${ville.population ? `
      <div class="panneau-section-titre">Données</div>
      <div class="panneau-meta">
        <div class="panneau-meta-item">
          <span class="panneau-meta-label">Population</span>
          <span class="panneau-meta-value">${rendreChamp(ville.population, anneeActive)}</span>
        </div>
        ${ville.garnison ? `
          <div class="panneau-meta-item">
            <span class="panneau-meta-label">Garnison</span>
            <span class="panneau-meta-value">${rendreChamp(ville.garnison, anneeActive)}</span>
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
  if (villeActive) { setIconeVilleActive(villeActive, false); rapprocherVille(villeActive); }
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

// ─── Zoom sur une ville (depuis la recherche) ─────────────────
function zoomerVille(villeId) {
  const ville = (typeof VILLES !== 'undefined') ? VILLES.find(v => v.id === villeId) : null;
  if (!ville || !ville.coords) return;

  // Mémoriser le mode précédent si on ne vient pas déjà d'un zoom ville
  if (overlayMode !== 'isolationVille') overlayModeAvantIsolation = overlayMode;

  // Fermer le panneau s'il était ouvert — AVANT de changer overlayMode
  // pour éviter que fermerPanneau→fermerZoomVille ne corrompe overlayModeAvantIsolation
  const panneau = document.getElementById('carte-panneau');
  if (panneau.classList.contains('carte-panneau--open')) {
    panneau.classList.remove('carte-panneau--open');
    panneau.setAttribute('inert', '');
    if (zoneActive) { const p = zoneActive; zoneActive = null; majZone(p); }
    if (villeActive) { setIconeVilleActive(villeActive, false); villeActive = null; }
  }

  overlayMode = 'isolationVille';
  isolationVilleId = villeId;

  // Assombrir la carte
  carteOverlayPrincipale.setOpacity(0.05);

  // Si les filtres villes sont désactivés, les réactiver silencieusement —
  // l'utilisateur qui recherche une ville veut la voir, y compris après le zoom
  ['filtre-etablissements', 'filtre-secondaires', 'filtre-sites'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const input = el.querySelector('input');
    if (input && !input.checked) {
      input.checked = true;
      el.classList.remove('decochee');
    }
  });

  // Griser les boutons d'overlay, les filtres, la légende et bloquer la recherche
  document.getElementById('carte-legende')?.classList.add('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('carte-isolation--disabled');
  });
  document.getElementById('filtre-marqueurs-tout')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-scenarios')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-etablissements')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-secondaires')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-sites')?.classList.add('carte-isolation--disabled');
  const rechercheInputZoom = document.getElementById('carte-recherche-input');
  if (rechercheInputZoom) { rechercheInputZoom.disabled = true; rechercheInputZoom.blur(); }

  // Mettre à jour la légende
  majLegende();

  // Masquer tous les marqueurs et polygones
  // Nettoyer le contour gold d'un éventuel territoire précédemment isolé
  if (isolationLayer) { isolationLayer.remove(); isolationLayer = null; }
  isolationJuridictionId = null;
  renderZones();
  Object.values(markersMap).forEach(m => m.setOpacity(0));
  Object.values(markersVilles).forEach(m => m.setOpacity(0));

  const latlng = pixelToLatLng(ville.coords[0], ville.coords[1]);
  const statutCapitale = Array.isArray(ville.capitale)
    ? rendreChamp(ville.capitale, anneeActive)
    : ville.capitale;
  const estPirate = statutCapitale === 'pirate';

  // Désactiver les événements souris sur tous les marqueurs sauf la ville isolée
  Object.entries(markersVilles).forEach(([id, m]) => {
    const el = m.getElement();
    if (el) el.style.pointerEvents = id === villeId ? 'auto' : 'none';
  });
  Object.values(markersMap).forEach(m => {
    const el = m.getElement();
    if (el) el.style.pointerEvents = 'none';
  });

  // Animation pré-zoom : blanc → gold-light, puis flyTo, puis agrandissement gold-light → gold
  const marker = markersVilles[villeId];

  // Élever l'icône isolée au-dessus des autres marqueurs
  if (marker) {
    const el = marker.getElement();
    if (el) el.style.zIndex = 9999;
  }

  if (marker) {
    marker.setOpacity(1);

    // Appliquer immédiatement l'état isolé (fill none sur fonds, couleurs gold sur symboles)
    const tailleActuelle = tailleIconeVille(carte.getZoom(), ville.rang);
    marker.setIcon(L.divIcon({
      className: '',
      html: villeSVG(ville.type || 'ville', tailleActuelle, estPirate, true, false),
      iconSize: [tailleActuelle, tailleActuelle],
      iconAnchor: [tailleActuelle / 2, tailleActuelle / 2]
    }));

    // Étape 1 : blanc immédiat sur les strokes et fills gold
    const svgEl = marker.getElement()?.querySelector('svg');
    if (svgEl) {
      const cadre = svgEl.querySelector('rect');
      if (cadre) cadre.setAttribute('stroke', 'none');
      svgEl.querySelectorAll('rect, path, line, circle, polygon').forEach(el => {
        if (el === cadre) return;
        if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', '#ffffff');
        if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', '#ffffff');
      });
    }

    // Étape 2 : gold-light après 400ms
    setTimeout(() => {
      if (isolationVilleId !== villeId) return;
      const svgEl2 = marker.getElement()?.querySelector('svg');
      if (svgEl2) {
        svgEl2.querySelectorAll('rect, path, line, circle, polygon').forEach(el => {
          if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', '#e2c97e');
          if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', '#e2c97e');
        });
        const rect = svgEl2.querySelector('rect');
        if (rect) rect.setAttribute('fill', 'none');
      }
    }, 400);
  }

  // FlyTo après 800ms (animation pré-zoom bien visible avant le départ)
  setTimeout(() => {
    carte.flyTo(latlng, carte.getMinZoom() + 2, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, 800);

  // Agrandissement à l'atterrissage via moveend : gold-light → gold
  const onMoveEnd = () => {
    if (isolationVilleId !== villeId) { carte.off('moveend', onMoveEnd); return; }
    const m = markersVilles[villeId];
    if (!m) { carte.off('moveend', onMoveEnd); return; }
    carte.off('moveend', onMoveEnd);

    const tailleArrivee = tailleIconeVille();

    // Poser l'icône gold-light à la taille cible
    m.setIcon(L.divIcon({
      html: villeSVG(ville.type || 'ville', tailleArrivee, estPirate, true, false)
        .replace(/stroke="#c8973a"/g, 'stroke="#e2c97e"')
        .replace(/fill="#c8973a"/g, 'fill="#e2c97e"'),
      className: 'carte-ville',
      iconSize: [tailleArrivee, tailleArrivee],
      iconAnchor: [tailleArrivee / 2, tailleArrivee / 2],
    }));

    // Gold après 120ms
    setTimeout(() => {
      if (isolationVilleId !== villeId) return;
      m.setIcon(L.divIcon({
        html: villeSVG(ville.type || 'ville', tailleArrivee, estPirate, true, false),
        className: 'carte-ville',
        iconSize: [tailleArrivee, tailleArrivee],
        iconAnchor: [tailleArrivee / 2, tailleArrivee / 2],
      }));
    }, 120);
  };
  carte.on('moveend', onMoveEnd);
}

// ─── Zoom sur une ville (depuis la recherche) — fermeture ─────
function fermerZoomVille(options = {}) {
  if (overlayMode !== 'isolationVille') return;

  const villeIdFermee = isolationVilleId;
  overlayMode = overlayModeAvantIsolation;
  isolationVilleId = null;

  // Restaurer pointer-events et z-index sur tous les marqueurs
  Object.values(markersVilles).forEach(m => {
    const el = m.getElement();
    if (el) { el.style.pointerEvents = ''; el.style.zIndex = ''; }
  });
  Object.values(markersMap).forEach(m => {
    const el = m.getElement();
    if (el) el.style.pointerEvents = '';
  });

  _restaurerModeNormal();

  if (options.ouvrirVille && villeIdFermee) {
    ouvrirPanneauVille(villeIdFermee);
  }
}

// ─── Isolation territoire ─────────────────────────────────────
function _restaurerModeNormal() {
  carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);
  document.getElementById('carte-legende')?.classList.remove('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('carte-isolation--disabled');
  });
  document.getElementById('filtre-marqueurs-tout')?.classList.remove('carte-isolation--disabled');
  document.getElementById('filtre-scenarios')?.classList.remove('carte-isolation--disabled');
  document.getElementById('filtre-etablissements')?.classList.remove('carte-isolation--disabled');
  document.getElementById('filtre-secondaires')?.classList.remove('carte-isolation--disabled');
  document.getElementById('filtre-sites')?.classList.remove('carte-isolation--disabled');
  const rechercheInput = document.getElementById('carte-recherche-input');
  if (rechercheInput) rechercheInput.disabled = false;
  document.querySelectorAll('.carte-overlay-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.carte-overlay-btn[data-mode="${overlayMode}"]`)?.classList.add('active');
  majLegende();
  renderZones();
  renderPins();
  renderVilles();
}

function fermerIsolation() {
  if (overlayMode !== 'isolation') return;

  overlayMode = overlayModeAvantIsolation;
  isolationJuridictionId = null;
  if (isolationLayer) { carte.removeLayer(isolationLayer); isolationLayer = null; }

  _restaurerModeNormal();
}

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

  // Fermer le panneau s'il était ouvert
  fermerPanneau();

  // Assombrir la carte
  carteOverlayPrincipale.setOpacity(0.05);

  // Griser les boutons d'overlay, la légende, les filtres, et bloquer la recherche
  document.getElementById('carte-legende')?.classList.add('carte-isolation--disabled');
  document.querySelectorAll('.carte-overlay-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('carte-isolation--disabled');
  });
  document.getElementById('filtre-marqueurs-tout')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-scenarios')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-etablissements')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-secondaires')?.classList.add('carte-isolation--disabled');
  document.getElementById('filtre-sites')?.classList.add('carte-isolation--disabled');
  const rechercheInputIso = document.getElementById('carte-recherche-input');
  if (rechercheInputIso) { rechercheInputIso.disabled = true; rechercheInputIso.blur(); }

  // Mettre à jour la légende (affiche "Cliquer pour quitter")
  majLegende();

  // Redessiner toutes les zones (les autres passent à opacity 0 via renderZones)
  renderZones();
  // Masquer les pins
  Object.values(markersMap).forEach(m => m.setOpacity(0));
  Object.values(markersVilles).forEach(m => m.setOpacity(0));

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

  // Animation du contour : blanc → gold-light, masqué pendant flyTo, gold via moveend
  setTimeout(() => {
    const contourPane = carte.getPane('isolationContour');
    if (contourPane) contourPane.querySelectorAll('path').forEach(p => {
      p.style.transition = 'stroke 0.4s ease, stroke-width 0.4s ease';
    });
    if (isolationLayer) isolationLayer.setStyle({ color: '#ffffff', weight: 3, opacity: 1 });
  }, 50);

  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#e2c97e', weight: 4, opacity: 1 });
  }, 450);

  // Masquer pendant le flyTo
  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ opacity: 0 });
  }, 850);

  // FlyTo
  setTimeout(() => {
    if (!isolationLayer) return;
    carte.flyToBounds(isolationLayer.getBounds(), {
      padding: [80, 80],
      maxZoom: carte.getMinZoom() + 2,
      duration: 1.2,
      easeLinearity: 0.3,
    });
  }, 950);

  // Réapparition gold via moveend
  const onMoveEnd = () => {
    if (isolationJuridictionId !== juridictionId) { carte.off('moveend', onMoveEnd); return; }
    if (isolationLayer) {
      const contourPane = carte.getPane('isolationContour');
      if (contourPane) contourPane.querySelectorAll('path').forEach(p => {
        p.style.transition = 'stroke 0.4s ease, stroke-width 0.4s ease';
      });
      isolationLayer.setStyle({ color: '#c8973a', weight: 4, opacity: 1 });
    }
    carte.off('moveend', onMoveEnd);
  };
  carte.on('moveend', onMoveEnd);
}

// ─── Chevauchement d'icônes villes ───────────────────────────
function calculerPairesChevauchement() {
  pairesChevauchement = [];
  if (typeof VILLES === 'undefined') return;

  const villesAvecCoords = VILLES.filter(v => v.coords);
  for (let i = 0; i < villesAvecCoords.length; i++) {
    for (let j = i + 1; j < villesAvecCoords.length; j++) {
      const vA = villesAvecCoords[i];
      const vB = villesAvecCoords[j];
      const ptA = carte.latLngToContainerPoint(pixelToLatLng(vA.coords[0], vA.coords[1]));
      const ptB = carte.latLngToContainerPoint(pixelToLatLng(vB.coords[0], vB.coords[1]));
      const dx = ptB.x - ptA.x;
      const dy = ptB.y - ptA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 16) {
        const len = dist || 1;
        pairesChevauchement.push({
          idA: vA.id, idB: vB.id,
          vx: dx / len, vy: dy / len,
          latlngA: pixelToLatLng(vA.coords[0], vA.coords[1]),
          latlngB: pixelToLatLng(vB.coords[0], vB.coords[1]),
        });
      }
    }
  }
}

function ecarterVille(villeId) {
  const CIBLE = 26;
  for (const paire of pairesChevauchement) {
    let vx = 0, vy = 0, autreId = null;
    if (paire.idA === villeId) { vx = -paire.vx; vy = -paire.vy; autreId = paire.idB; }
    else if (paire.idB === villeId) { vx = paire.vx; vy = paire.vy; autreId = paire.idA; }
    if (!autreId) continue;
    // Nettoyer tout décalage résiduel avant de recalculer
    const cle = `${paire.idA}:${paire.idB}`;
    if (ecartementsActifs[cle]) {
      delete ecartementsActifs[cle];
      const elAn = markersVilles[paire.idA]?.getElement();
      const elBn = markersVilles[paire.idB]?.getElement();
      if (elAn) { const t = lireTranslate3d(elAn); elAn.style.transition = ''; elAn.style.transform = t; }
      if (elBn) { const t = lireTranslate3d(elBn); elBn.style.transition = ''; elBn.style.transform = t; }
    }
    const ptA = carte.latLngToContainerPoint(paire.latlngA);
    const ptB = carte.latLngToContainerPoint(paire.latlngB);
    const dx = ptB.x - ptA.x;
    const dy = ptB.y - ptA.y;
    const distActuelle = Math.sqrt(dx * dx + dy * dy);
    const amplitude = (CIBLE - distActuelle) / 2;
    if (amplitude <= 0) continue;
    const duree = Math.round(amplitude * 2 * 40);
    ecartementsActifs[`${paire.idA}:${paire.idB}`] = {
      duree,
      dxA: vx * amplitude, dyA: vy * amplitude,
      dxB: -vx * amplitude, dyB: -vy * amplitude,
    };
    const elA = markersVilles[villeId]?.getElement();
    const elB = markersVilles[autreId]?.getElement();
    if (elA) {
      const t = lireTranslate3d(elA);
      elA.style.transition = `transform ${duree}ms ease`;
      elA.style.transform = `${t} translate(${vx * amplitude}px, ${vy * amplitude}px)`;
    }
    if (elB) {
      const t = lireTranslate3d(elB);
      elB.style.transition = `transform ${duree}ms ease`;
      elB.style.transform = `${t} translate(${-vx * amplitude}px, ${-vy * amplitude}px)`;
    }
  }
}

function rapprocherVille(villeId) {
  for (const paire of pairesChevauchement) {
    let autreId = null;
    if (paire.idA === villeId) autreId = paire.idB;
    else if (paire.idB === villeId) autreId = paire.idA;
    if (!autreId) continue;
    if (villeActive === autreId) continue;
    const cle = `${paire.idA}:${paire.idB}`;
    const etat = ecartementsActifs[cle];
    if (!etat) continue;
    delete ecartementsActifs[cle];
    const elA = markersVilles[paire.idA]?.getElement();
    const elB = markersVilles[paire.idB]?.getElement();
    if (elA) {
      const t = lireTranslate3d(elA);
      elA.style.transition = `transform ${etat.duree}ms ease`;
      elA.style.transform = `${t} translate(0px, 0px)`;
      setTimeout(() => { const t2 = lireTranslate3d(elA); elA.style.transition = ''; elA.style.transform = t2; }, etat.duree);
    }
    if (elB) {
      const t = lireTranslate3d(elB);
      elB.style.transition = `transform ${etat.duree}ms ease`;
      elB.style.transform = `${t} translate(0px, 0px)`;
      setTimeout(() => { const t2 = lireTranslate3d(elB); elB.style.transition = ''; elB.style.transform = t2; }, etat.duree);
    }
  }
}
