// ═══════════════════════════════════════════════════════════
// CARTE MOBILE — Interface style Maps pour smartphones
// Remplace carte.js sur écrans ≤ 768px
// ═══════════════════════════════════════════════════════════

// ─── État global ──────────────────────────────────────────────
let carte = null;
let carteOverlayPrincipale = null;
let anneeActive = CARTE_ANNEE_REFERENCE;
let zoneActive = null;
let layersZones = {};
let pinActive = null;
let modeSombre = false;
let villeActive = null;
let markersVilles = {};
let overlayMode = 'geo';
let recalibrerVue = () => {}; // initialisée dans initCarte

// ─── Mode MJ ─────────────────────────────────────────────────
let modeMJ = false;
const SEQUENCE_MJ = ['eleuthera', 'marguerita', 'jamaique'];
let sequenceEnCours = [];
let attenteClic_IleDuMais = false;

// ─── Filtres ──────────────────────────────────────────────────
let puissancesMasquees = new Set();
const paliersMasquesDensite = new Set();
const paliersMasquesEsclavage = new Set();

// ─── État mobile ──────────────────────────────────────────────
let sheetVilleOuverte = false;
let sheetFiltresOuverte = false;
let sheetCalquesOuverte = false;
let sheetAnneeOuverte = false;
let sheetHauteur = 'reduite'; // 'peek' | 'reduite' | 'pleine'

// ─── Constantes overlay ───────────────────────────────────────
const OVERLAY_LABELS = {
  geo: 'Géopolitique',
  densite: 'Densité Pop.',
  esclavage: 'Esclavage & Encomienda',
  autochtones: 'Foyers autochtones',
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

const WEIGHTS = { zone: 0.5, zoneActive: 2 };
const ZOOM_FACTEUR = 1.5;

// ═══════════════════════════════════════════════════════════
// UTILITAIRES PURS
// ═══════════════════════════════════════════════════════════

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
  if (!el) return 'translate3d(0px,0px,0px)';
  const m = el.style.transform.match(/translate3d\([^)]+\)/);
  return m ? m[0] : 'translate3d(0px,0px,0px)';
}

// ─── Couleurs overlay ─────────────────────────────────────────
function couleurDensite(zoneId) {
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[zoneId] : null;
  if (!demo || demo.superficie === 0 || demo.population === 0) return null;
  const score = demo.population / demo.superficie;
  for (let i = 0; i < DENSITE_PALIERS.length; i++) {
    if (score <= DENSITE_PALIERS[i].max)
      return paliersMasquesDensite.has(i) ? null : DENSITE_PALIERS[i].couleur;
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
    if (ratio <= ESCLAVAGE_PALIERS[i].max)
      return paliersMasquesEsclavage.has(i) ? null
        : (useRa ? ESCLAVAGE_PALIERS[i].ra : ESCLAVAGE_PALIERS[i].fm);
  }
  const last = ESCLAVAGE_PALIERS.length - 1;
  return paliersMasquesEsclavage.has(last) ? null
    : (useRa ? ESCLAVAGE_PALIERS[last].ra : ESCLAVAGE_PALIERS[last].fm);
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

// ═══════════════════════════════════════════════════════════
// SVG BUILDERS
// ═══════════════════════════════════════════════════════════

function pinSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18S26 19 26 12c0-5.523-4.477-10-10-10z"
      fill="#c8973a" stroke="#0e0c09" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="4" fill="#0e0c09"/>
  </svg>`;
}

function villeSVG(type, taille = 24, estPirate = false, estIsole = false, estActive = false, estRang3 = false) {
  const estSite = (type === 'site_geo' || type === 'site_hist');
  const fond = estIsole ? 'rgba(0,0,0,0)'
    : estActive ? (estPirate ? '#3a3a3a' : (estSite ? '#c7edfd' : (estRang3 ? '#c45a5a' : '#9aae9a')))
      : estPirate ? '#0e0c09'
        : estSite ? '#a8d4e8'
          : estRang3 ? '#a03a3a'
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
        <path d="M87.22,20.9l-11,16.52L51.87,.9.93,77.3H124.82Z"
          fill="${estIsole ? 'none' : couleurTrait}" stroke="${couleurTrait}" stroke-width="${estIsole ? '8' : '1.2'}"/>
      </g>
      <g transform="translate(4.85,9.12) scale(0.18)">
        <polygon points="38.44 20.9 65.14 20.9 51.74 0.9 38.44 20.9"
          fill="${estIsole ? couleurTrait : couleurNeige}" stroke="${couleurTrait}" stroke-width="${estIsole ? '0' : '1.2'}"/>
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
  const SEUIL = 25000;
  const demo = (typeof ZONES_DEMO !== 'undefined') ? ZONES_DEMO[ville.territoire] : null;
  if (demo && demo.superficie < SEUIL) {
    const j = JURIDICTIONS.find(j => j.id === ville.territoire);
    const nomT = j ? (j.label || j.nom) : null;
    if (nomT) return `${ville.nom} (${nomT})`;
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
  const estRang3 = (ville.rang ?? '1') === '3';
  marker.setIcon(L.divIcon({
    html: villeSVG(ville.type || 'ville', taille, estPirate, false, actif, estRang3),
    className: 'carte-ville',
    iconSize: [taille, taille],
    iconAnchor: [taille / 2, taille / 2],
  }));
}

// ═══════════════════════════════════════════════════════════
// Calcul année max MJ
// ═══════════════════════════════════════════════════════════

function calculerAnneeMax() {
  let max = CARTE_ANNEE_REFERENCE;
  function scanBlocs(val) {
    if (!val || typeof val !== 'object') return;
    if (Array.isArray(val)) val.forEach(b => { if (b.a && b.a > max) max = b.a; });
  }
  JURIDICTIONS.forEach(j => {
    scanBlocs(j.contexte); scanBlocs(j.capitale);
    scanBlocs(j.population_approx); scanBlocs(j.economie);
  });
  return max;
}
const ANNEE_MAX_MJ = calculerAnneeMax();

// ═══════════════════════════════════════════════════════════
// Injection HTML mobile
// ═══════════════════════════════════════════════════════════

function injecterStructureMobile() {
  // Masquer nav et header desktop — inutiles sur mobile
  document.querySelector('.site-nav')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.hero')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.carte-barre')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.carte-panneau-gauche')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.carte-panneau-gauche-toggle')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.carte-zoom-controls')?.style.setProperty('display', 'none', 'important');
  document.querySelector('.carte-legende')?.style.setProperty('display', 'none', 'important');

  // Passer toute la chaîne en plein écran
  document.documentElement.style.cssText = 'height:100%; overflow:hidden;';
  document.body.style.cssText = 'height:100%; overflow:hidden; margin:0; padding:0;';

  const main = document.querySelector('main');
  if (main) main.style.cssText = 'height:100%; overflow:hidden; margin:0; padding:0;';

  const carteCorps = document.querySelector('.carte-corps');
  if (carteCorps) {
    carteCorps.style.cssText = 'position:fixed; inset:0; margin:0; padding:0; width:100%; height:100%;';
  }
  const cartePlus = document.querySelector('.carte-plus');
  if (cartePlus) {
    cartePlus.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
  }
  const carteWrap = document.getElementById('carte-wrap');
  if (carteWrap) {
    carteWrap.style.cssText = 'position:absolute; top:0; left:0; right:0; bottom:52px; width:100%; height:calc(100% - 52px);';
  }
  const carteDom = document.getElementById('carte');
  if (carteDom) {
    carteDom.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
  }

  // Injecter la barre de recherche haute
  const barreRecherche = document.createElement('div');
  barreRecherche.id = 'mob-barre-recherche';
  barreRecherche.innerHTML = `
    <div id="mob-recherche-field" role="button" aria-label="Rechercher un lieu">
      <span id="mob-recherche-icone">🔍</span>
      <span id="mob-recherche-placeholder">Rechercher un lieu…</span>
    </div>
    <div id="mob-filtres-chips-scroll">
      <div id="mob-filtres-chips">
        <button class="mob-filtre-chip mob-filtre-chip--actif" data-filtre="scenarios">⚑ Scénarios</button>
        <button class="mob-filtre-chip" data-filtre="etablissements">⌂ Villes</button>
        <button class="mob-filtre-chip" data-filtre="secondaires">⌂ Secondaires</button>
        <button class="mob-filtre-chip" data-filtre="sites">▲ Sites</button>
        <div id="mob-filtres-mj"></div>
      </div>
    </div>`;
  document.querySelector('.carte-plus')?.appendChild(barreRecherche);

  // Injecter les boutons flottants (calques + année)
  const boutonsFlottants = document.createElement('div');
  boutonsFlottants.id = 'mob-boutons-flottants';
  boutonsFlottants.innerHTML = `
    <button class="mob-btn-flottant" id="mob-btn-calques" aria-label="Types de carte">
      <span class="mob-btn-flottant-icone">⧉</span>
      <span class="mob-btn-flottant-label">Calques</span>
    </button>
    <button class="mob-btn-flottant" id="mob-btn-annee" aria-label="Année">
      <span class="mob-btn-annee-annee" id="mob-btn-annee-label">1716</span>
    </button>`;
  document.querySelector('.carte-plus')?.appendChild(boutonsFlottants);

  // Injecter la sheet ville (bandeau bas expandable)
  const sheetVille = document.createElement('div');
  sheetVille.id = 'mob-sheet-ville';
  sheetVille.setAttribute('aria-hidden', 'true');
  sheetVille.innerHTML = `
    <div id="mob-sheet-ville-handle"></div>
    <div id="mob-sheet-ville-contenu"></div>`;
  document.querySelector('.carte-plus')?.appendChild(sheetVille);

  // Injecter la sheet filtres (drawer complet)
  const sheetFiltres = document.createElement('div');
  sheetFiltres.id = 'mob-sheet-filtres';
  sheetFiltres.setAttribute('aria-hidden', 'true');
  sheetFiltres.innerHTML = `
    <div id="mob-sheet-filtres-header">
      <span>Filtres</span>
      <button id="mob-sheet-filtres-close" class="mob-close-btn" aria-label="Fermer">✕</button>
    </div>
    <div id="mob-sheet-filtres-inner">
      <div class="mob-sheet-section-titre">Marqueurs géographiques</div>
      <div id="mob-filtres-liste">
        <label class="mob-filtre-ligne">
          <input type="checkbox" id="mfl-scenarios" checked>
          <span class="mob-filtre-pastille">⚑</span> Scénarios
        </label>
        <label class="mob-filtre-ligne">
          <input type="checkbox" id="mfl-etablissements">
          <span class="mob-filtre-pastille">⌂</span> Établissements principaux
        </label>
        <label class="mob-filtre-ligne">
          <input type="checkbox" id="mfl-secondaires">
          <span class="mob-filtre-pastille">⌂</span> Établissements secondaires
        </label>
        <label class="mob-filtre-ligne">
          <input type="checkbox" id="mfl-sites">
          <span class="mob-filtre-pastille">▲</span> Sites d'intérêt
        </label>
      </div>
      <div class="mob-sheet-section-titre" style="margin-top:1.5rem;">Mode</div>
      <div id="mob-filtres-mode">
        <button class="mob-filtre-chip mob-filtre-chip--actif" id="mob-mode-sombre">☽ Mode sombre</button>
      </div>
    </div>`;
  document.body.appendChild(sheetFiltres);

  // Injecter la sheet calques
  const sheetCalques = document.createElement('div');
  sheetCalques.id = 'mob-sheet-calques';
  sheetCalques.setAttribute('aria-hidden', 'true');
  sheetCalques.innerHTML = `
    <div class="mob-sheet-bottom">
      <div id="mob-calques-handle"></div>
      <div class="mob-sheet-bottom-header">
        <span>Type de carte</span>
        <button class="mob-close-btn" id="mob-calques-close">✕</button>
      </div>
      <div class="mob-sheet-bottom-section">
        <div class="mob-sheet-section-titre">Overlay</div>
        <div id="mob-overlay-choix" class="mob-overlay-grille">
          <div class="mob-overlay-wrap">
            <button class="mob-overlay-item mob-overlay-item--actif" data-mode="geo"><span class="mob-overlay-icone">⚑</span></button>
            <span class="mob-overlay-label">Géopolitique</span>
          </div>
          <div class="mob-overlay-wrap">
            <button class="mob-overlay-item" data-mode="densite"><span class="mob-overlay-icone">♟</span></button>
            <span class="mob-overlay-label">Densité</span>
          </div>
          <div class="mob-overlay-wrap">
            <button class="mob-overlay-item" data-mode="esclavage"><span class="mob-overlay-icone">⛓</span></button>
            <span class="mob-overlay-label">Esclavage</span>
          </div>
          <div class="mob-overlay-wrap">
            <button class="mob-overlay-item" data-mode="autochtones"><span class="mob-overlay-icone">➶</span></button>
            <span class="mob-overlay-label">Autochtones</span>
          </div>
          <div class="mob-overlay-wrap">
            <button class="mob-overlay-item" data-mode="masque"><span class="mob-overlay-icone">✕</span></button>
            <span class="mob-overlay-label">Jaillot 1708</span>
          </div>
        </div>
      </div>
      <div class="mob-sheet-bottom-section">
        <div class="mob-sheet-section-titre">Légende</div>
        <div id="mob-legende-inner"></div>
      </div>
    </div>`;
  document.body.appendChild(sheetCalques);

  // Injecter la sheet année
  const sheetAnnee = document.createElement('div');
  sheetAnnee.id = 'mob-sheet-annee';
  sheetAnnee.setAttribute('aria-hidden', 'true');
  sheetAnnee.innerHTML = `
    <div class="mob-sheet-bottom">
      <div id="mob-annee-handle"></div>
      <div class="mob-sheet-bottom-header">
        <span>Année</span>
        <button class="mob-close-btn" id="mob-annee-close">✕</button>
      </div>
      <div class="mob-sheet-bottom-section">
        <div id="mob-annee-affichage">1716</div>
        <div id="mob-annee-controls">
          <input type="range" id="mob-annee-slider" min="1712" max="1720" value="1716" step="1">
        </div>
      </div>
    </div>`;
  document.body.appendChild(sheetAnnee);

  // Injecter la barre basse
  const barreBasse = document.createElement('div');
  barreBasse.id = 'mob-barre-basse';
  barreBasse.innerHTML = `
    <button class="mob-barre-basse-btn" id="mob-btn-sombre">
      <span class="mob-barre-basse-icone">☽</span>
      <span class="mob-barre-basse-label">Sombre</span>
    </button>
    <button class="mob-barre-basse-btn" id="mob-btn-pleinecran">
      <span class="mob-barre-basse-icone">⛶</span>
      <span class="mob-barre-basse-label">Plein écran</span>
    </button>
    <button class="mob-barre-basse-btn" id="mob-btn-itineraire" disabled>
      <span class="mob-barre-basse-icone">🧭</span>
      <span class="mob-barre-basse-label">Itinéraire</span>
    </button>`;
  document.body.appendChild(barreBasse);

  // Mode sombre — le bouton barre basse appelle toggleModeSombre (définie après initCarte)
  document.getElementById('mob-btn-sombre')?.addEventListener('click', () => toggleModeSombre());

  // Plein écran
  document.getElementById('mob-btn-pleinecran')?.addEventListener('click', function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
        .then(() => this.classList.add('mob-barre-basse-btn--actif'))
        .catch(() => { });
    } else {
      document.exitFullscreen?.()
        .then(() => this.classList.remove('mob-barre-basse-btn--actif'))
        .catch(() => { });
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('mob-btn-pleinecran');
    if (btn) btn.classList.toggle('mob-barre-basse-btn--actif', !!document.fullscreenElement);
  });

  // Injecter overlay fond (pour fermeture sheets)
  const fondOverlay = document.createElement('div');
  fondOverlay.id = 'mob-fond-overlay';
  fondOverlay.addEventListener('click', () => {
    fermerToutesSheets();
    fermerSheetVille();
  });
  document.body.appendChild(fondOverlay);
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION PRINCIPALE
// ═══════════════════════════════════════════════════════════

function _initMobile() {
  try {
    injecterStructureMobile();

    function initTout() {
      initCarte();
      initBarreRecherche();
      initFiltresChips();
      initBoutonsFlottants();
      initSheetCalques();
      initSheetAnnee();
      initSheetVille();
      initSheetFiltres();
      masquerEcranChargement();
    }

    const imgPreload = new Image();
    imgPreload.src = CARTE_IMAGE.src;
    imgPreload.decode()
      .then(() => {
        initTout();
      })
      .catch(initTout);

  } catch (e) {
    document.body.innerHTML = '<pre style="color:red;padding:1rem;font-size:0.8rem;white-space:pre-wrap;">'
      + (e.stack || e.message || String(e)) + '</pre>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initMobile);
} else {
  _initMobile();
}

// ═══════════════════════════════════════════════════════════
// CARTE LEAFLET — identique à carte.js sauf ajustements mobile
// ═══════════════════════════════════════════════════════════

function initCarte() {
  const W = CARTE_IMAGE.width;
  const H = CARTE_IMAGE.height;
  const bounds = [[0, 0], [H, W]];

  carte = L.map('carte', {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 2,
    maxBoundsViscosity: 1,
    zoomSnap: 0,
    zoomDelta: 0.5,
    bounceAtZoomLimits: false,
    attributionControl: false,
    doubleClickZoom: false,
    zoomControl: false,
    tap: true,
    tapTolerance: 15,
  });

  carteOverlayPrincipale = L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);
  const el = carteOverlayPrincipale.getElement();
  if (el) el.style.transition = 'opacity 0.9s ease';
  carte.createPane('contourGlobal');
  carte.getPane('contourGlobal').style.zIndex = 410;
  carte.getPane('contourGlobal').style.pointerEvents = 'none';

  renderZones();
  renderVilles();

  carte.on('click', (e) => {
    fermerToutesSheets();

    if (sheetVilleOuverte && sheetHauteur !== 'peek') {
      // Volet ouvert (réduit ou plein) → replier en peek
      setSheetHauteur('peek');
    } else {
      // Volet en peek ou fermé → fermer complètement ET désactiver
      fermerSheetVille();
      if (villeActive) setIconeVilleActive(villeActive, false);
      villeActive = null;
      zoneActive = null;
      pinActive = null;
      Object.values(layersZones).forEach(groupe => {
        groupe.eachLayer?.(poly => poly.setStyle({
          weight: weightPourZoom(WEIGHTS.zone, carte.getZoom())
        }));
      });
    }
  });

  carte.on('moveend', () => {
    majWeightsZones();
    majTailleIconesVilles();
  });

  // Calcule le zoom qui fait tenir la hauteur carte dans l'espace disponible
  function _caliberZoomMin() {
    // Zoom exact pour que la hauteur image == hauteur conteneur Leaflet.
    // zoomSnap:0 permet une valeur flottante précise — pas d'arrondi.
    // On soustrait 0.0001 pour laisser une marge infime : évite que
    // Leaflet considère la vue comme "déjà au bord" et refuse le pan latéral.
    return Math.log2(carte.getSize().y / CARTE_IMAGE.height) - 0.0001;
  }

  function _recalibrerVue() {
    carte.invalidateSize();
    const zMin = _caliberZoomMin();
    carte.setMinZoom(zMin);
    // setMaxBounds omis ici — les bounds sont constantes (image fixe)
    // et sont posées une seule fois à l'init. Les rappeler à chaque resize
    // déclenche un panInsideBounds qui repositionne la carte, notamment
    // en interférant avec les pinches Android.
    requestAnimationFrame(() => {
      if (carte.getZoom() < zMin) {
        carte.setView(carte.getCenter(), zMin, { animate: false });
      }
    });
  }

  setTimeout(() => {
    carte.invalidateSize();
    const nassau = pixelToLatLng(4542, 1739);
    const zMin = _caliberZoomMin();
    carte.setMinZoom(zMin);
    carte.setView(nassau, zMin, { animate: false });
    carte.setMaxBounds([[0, 0], [CARTE_IMAGE.height, CARTE_IMAGE.width]]);
    majWeightsZones();

    // Préchauffage : parcourir silencieusement plusieurs niveaux de zoom
    // pendant que l'écran de chargement est encore visible, pour que
    // Leaflet ait déjà calculé les positions au moment du premier flyTo.
    const zooms = [0, -2, -4, zMin];
    let i = 0;
    const prechauffer = () => {
      if (i >= zooms.length) {
        carte.setView(nassau, zMin, { animate: false });
        // Forcer carte._loaded = true et fire moveend pour que flyTo/flyToBounds
        // fonctionnent immédiatement sans attendre une première interaction utilisateur.
        // setView({ animate: false }) ne déclenche pas moveend dans Leaflet,
        // donc _loaded reste false et flyTo retourne silencieusement.
        carte._loaded = true;
        carte.fire('moveend');
        const ecran = document.getElementById('carte-chargement');
        if (ecran) { ecran.style.display = 'none'; ecran.remove(); }
        return;
      }
      carte.setView(nassau, zooms[i++], { animate: false });
      requestAnimationFrame(prechauffer);
    };
    requestAnimationFrame(prechauffer);
  }, 500);

  // Patch _move : limiter le centre pendant le pinch avec _limitCenter,
  // sans figer le centre sur carte.getCenter() (tentative 4, infructueuse).
  // Leaflet calcule le centre naturel du pinch, on le projette dans la
  // zone valide avec son propre algorithme.
  const _moveOrig = carte._move.bind(carte);
  carte._move = function (center, zoom, data, suppressEvent) {
    if (data && data.pinch && center && carte.options.maxBounds) {
      const limitedZoom = carte._limitZoom(zoom);
      center = carte._limitCenter(
        L.latLng(center),
        limitedZoom,
        carte.options.maxBounds
      );
      zoom = limitedZoom;
    }
    return _moveOrig(center, zoom, data, suppressEvent);
  };

  // Leaflet 1.9 appelle _move({pinch:true}) directement depuis TouchZoom,
  // avec zoom et centre déjà couplés — on ne peut pas les dissocier.
  // On patch _onTouchMove pour bloquer les frames sous le minZoom,
  // avec resync complète de l'état interne pour éviter l'accumulation
  // de décalage entre les frames bloquées et la réalité des doigts.
  // Note : le patch _move({pinch}) pour bloquer le pan a été testé et
  // abandonné — il empêche Leaflet de mettre à jour sa position interne,
  // ce qui produit des sauts massifs à chaque touchend, y compris hors
  // zone de blocage zoom.
  if (carte.touchZoom && carte.touchZoom._onTouchMove) {
    const _onTouchMoveOrig = carte.touchZoom._onTouchMove.bind(carte.touchZoom);
    carte.touchZoom._onTouchMove = function (e) {
      if (e.touches && e.touches.length === 2) {
        const p1 = carte.mouseEventToContainerPoint(e.touches[0]);
        const p2 = carte.mouseEventToContainerPoint(e.touches[1]);
        const dist = p1.distanceTo(p2);
        if (this._startDist && dist < this._startDist) {
          const scale = dist / this._startDist;
          const zoom = carte.getScaleZoom(scale, this._startZoom);
          if (zoom < carte.getMinZoom()) {
            if (this._animRequest) {
              L.Util.cancelAnimFrame(this._animRequest);
              this._animRequest = null;
            }
            const midpoint = p1._add(p2)._divideBy(2);
            this._startDist   = dist;
            this._startZoom   = carte.getMinZoom();
            this._centerPoint = midpoint;
            // _pinchStartLatLng : ne pas modifier — casse le calcul spatial (testé)
            return;
          }
        }
      }
      return _onTouchMoveOrig(e);
    };

    const _onTouchEndOrig = carte.touchZoom._onTouchEnd.bind(carte.touchZoom);
    carte.touchZoom._onTouchEnd = function (...args) {
      // _animateZoom reçoit this._center brut, sans passer par _limitCenter
      // (contrairement à setView). On applique _limitCenter ici pour que
      // _panInsideMaxBounds n'ait rien à corriger après coup.
      if (this._moved && this._zooming && this._center) {
        const finalZoom = carte._limitZoom(this._zoom);
        this._zoom = finalZoom;
        if (carte.options.maxBounds) {
          this._center = carte._limitCenter(
            this._center,
            finalZoom,
            carte.options.maxBounds
          );
        }
      }
      return _onTouchEndOrig(...args);
    };
  }

  let _fullscreenTransition = false;
  window.addEventListener('resize', () => {
    _hauteurPleinePx = null;
    if (_fullscreenTransition) return;
    _recalibrerVue();
  });

  document.addEventListener('fullscreenchange', () => {
    _fullscreenTransition = true;
    // Capturer le ratio de zoom avant le changement de viewport
    const zMinAvant  = carte.getMinZoom();
    const zMax       = carte.getMaxZoom();
    const zActuel    = carte.getZoom();
    const ratioAvant = zMax > zMinAvant
      ? (zActuel - zMinAvant) / (zMax - zMinAvant)
      : 0;

    setTimeout(() => {
      _fullscreenTransition = false;
      _hauteurPleinePx = null; // invalider le cache — viewport a changé
      carte.invalidateSize();
      // Laisser invalidateSize propager avant de recalibrer
      requestAnimationFrame(() => {
        _recalibrerVue();
        const zMinApres = carte.getMinZoom();
        const zCible    = zMinApres + ratioAvant * (zMax - zMinApres);
        carte.setView(carte.getCenter(), zCible, { animate: false });
      });
    }, 250);
  });

  // Exposer _recalibrerVue pour les fonctions qui doivent forcer
  // un recalibrage avant un flyTo (ex: après fermeture du clavier virtuel)
  recalibrerVue = _recalibrerVue;
}

// ═══════════════════════════════════════════════════════════
// RENDU ZONES
// ═══════════════════════════════════════════════════════════

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

    let couleur, fillOpacity, strokeColor, strokeWeight, strokeOpacity;

    if (overlayMode === 'densite' || overlayMode === 'esclavage' || overlayMode === 'autochtones') {
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
      // Mode géopolitique
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

      poly.on('mouseover', () => {
        fermerTooltipsOrphelins();
        // Remettre en repos toutes les icônes villes hors ville active.
        Object.keys(markersVilles).forEach(id => {
          if (id !== villeActive) setIconeVilleActive(id, false);
        });
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

function majWeightsZones() {
  if (!carte) return;
  const zoom = carte.getZoom();
  Object.values(layersZones).forEach(groupe => {
    if (groupe.eachLayer) {
      groupe.eachLayer(poly => poly.setStyle({ weight: weightPourZoom(WEIGHTS.zone, zoom) }));
    } else if (groupe.setStyle) {
      groupe.setStyle({ weight: weightPourZoom(WEIGHTS.zone, zoom) });
    }
  });
}

// ─── Panneaux — zones, villes, scénarios ─────────────────────

function ouvrirPanneau(juridictionId) {
  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  if (!j) return;
  if (j.visible_mj && !modeMJ) return;

  zoneActive = juridictionId;

  // Mettre à jour le style de la zone active
  Object.entries(layersZones).forEach(([id, groupe]) => {
    const isActive = id === juridictionId;
    groupe.eachLayer?.(poly => {
      poly.setStyle({ weight: weightPourZoom(isActive ? WEIGHTS.zoneActive : WEIGHTS.zone, carte.getZoom()) });
    });
  });

  const contenu = construireContenuPanneauJuridiction(j);
  mobOuvrirSheet(contenu);
}

function fermerPanneau() {
  zoneActive = null;
  fermerSheetVille();
  Object.values(layersZones).forEach(groupe => {
    groupe.eachLayer?.(poly => {
      poly.setStyle({ weight: weightPourZoom(WEIGHTS.zone, carte.getZoom()) });
    });
  });
}

function ouvrirPanneauVille(villeId) {
  const ville = VILLES.find(v => v.id === villeId);
  if (!ville) return;

  villeActive = villeId;
  setIconeVilleActive(villeId, true);

  const contenu = construireContenuPanneauVille(ville);
  mobOuvrirSheet(contenu);
}

function fermerPanneauVille() {
  if (villeActive) setIconeVilleActive(villeActive, false);
  villeActive = null;
  fermerSheetVille();
}

// ─── Constructeurs de contenu panneau ────────────────────────
// Produisent le HTML injecté dans la sheet ville.
// Inspirés de carte.js mais sans la structure #carte-panneau.

function construireContenuPanneauJuridiction(j) {
  const puissanceId = resoudre(j.puissance, anneeActive);
  const puissance = PUISSANCES[puissanceId] || {};
  const nomPuissance = puissance.nom || puissanceId || '';

  const pop = rendreChamp(j.population_approx, anneeActive);
  const capitale = rendreChamp(j.capitale, anneeActive);
  const contexte = rendreContexte(j.contexte, anneeActive);
  const economie = rendreContexte(j.economie, anneeActive);

  return `
    <div class="mob-panneau-header">
      <div class="mob-panneau-surtitle">${nomPuissance}</div>
      <div class="mob-panneau-titre">${j.label || j.nom}</div>
      <button class="mob-panneau-close" aria-label="Fermer">✕</button>
    </div>
    <div class="mob-panneau-body">
      ${capitale ? `<div class="mob-panneau-meta"><span class="mob-panneau-meta-label">Capitale</span> ${capitale}</div>` : ''}
      ${pop ? `<div class="mob-panneau-meta"><span class="mob-panneau-meta-label">Population</span> ~${pop}</div>` : ''}
      ${contexte ? `<div class="mob-panneau-section">${contexte}</div>` : ''}
      ${economie ? `<div class="mob-panneau-section mob-panneau-section--economie">${economie}</div>` : ''}
    </div>`;
}

function construireContenuPanneauVille(ville) {
  const contexte = rendreContexte(ville.contexte, anneeActive);
  const territoireNom = (() => {
    const j = JURIDICTIONS.find(j => j.id === ville.territoire);
    return j ? (j.label || j.nom) : '';
  })();

  const chroniquesLiees = (typeof CHRONIQUES !== 'undefined')
    ? CHRONIQUES.filter(c => c.lieux?.includes(ville.id))
    : [];
  const pnjLies = (typeof PNJ !== 'undefined')
    ? PNJ.filter(p => p.lieux?.includes(ville.id) && (!p.visible_mj || modeMJ))
    : [];

  const chroniquesHtml = chroniquesLiees.length ? `
    <div class="mob-panneau-sub-titre">Chroniques</div>
    ${chroniquesLiees.map(c => `
      <div class="mob-panneau-lien" onclick="naviguerVers('chroniques.html#${c.id}')">
        ${c.titre || c.id}
      </div>`).join('')}` : '';

  const pnjHtml = pnjLies.length ? `
    <div class="mob-panneau-sub-titre">Personnages</div>
    ${pnjLies.map(p => `
      <div class="mob-panneau-lien" onclick="naviguerVers('pnj.html#${p.id}')">
        ${p.nom || p.id}
      </div>`).join('')}` : '';

  return `
    <div class="mob-panneau-header">
      <div class="mob-panneau-surtitle">${territoireNom}</div>
      <div class="mob-panneau-titre">${ville.label || ville.nom}</div>
      <button class="mob-panneau-close" aria-label="Fermer">✕</button>
    </div>
    <div class="mob-panneau-body">
      ${contexte ? `<div class="mob-panneau-section">${contexte}</div>` : ''}
      ${chroniquesHtml}
      ${pnjHtml}
    </div>`;
}

function naviguerVers(url) {
  window.location.href = url;
}

// ═══════════════════════════════════════════════════════════
// RENDER VILLES — adapté mobile (même logique, curseur mobile)
// ═══════════════════════════════════════════════════════════

function renderVilles() {
  Object.values(markersVilles).forEach(m => carte.removeLayer(m));
  markersVilles = {};

  if (overlayMode === 'masque') return;

  const filtreEtab = document.getElementById('mfl-etablissements')?.checked ?? false;
  const filtreSecond = document.getElementById('mfl-secondaires')?.checked ?? false;
  const filtreSites = document.getElementById('mfl-sites')?.checked ?? false;
  const filtreRang3 = document.getElementById('mfl-rang3')?.checked ?? false;

  VILLES.forEach(ville => {
    if (!ville.coords) return;

    const rang = ville.rang ?? '1';
    if (rang === '3' && !modeMJ) return;
    if (rang === '3' && !filtreRang3) return;

    const visibleDe = ville.visible_de ?? null;
    if (visibleDe !== null && anneeActive < visibleDe) return;

    const type = ville.type || 'ville';
    const estSite = (type === 'site_geo' || type === 'site_hist');
    const estEtab = (type === 'port' || type === 'fort' || type === 'ville');
    const estSecond = rang === '2';

    if (estSite && !filtreSites) return;
    if (estEtab && estSecond && !filtreSecond) return;
    if (estEtab && !estSecond && !filtreEtab && rang !== '3') return;

    const latlng = pixelToLatLng(ville.coords[0], ville.coords[1]);
    const statutCapitale = Array.isArray(ville.capitale)
      ? rendreChamp(ville.capitale, anneeActive)
      : ville.capitale;
    const estPirate = statutCapitale === 'pirate';
    const estRang3 = rang === '3';

    const icon = L.divIcon({
      html: villeSVG(ville.type || 'ville', tailleIconeVille(), estPirate, false, false, estRang3),
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
      fermerToutesSheets();
      if (villeActive === ville.id) {
        fermerPanneauVille();
      } else {
        ouvrirPanneauVille(ville.id);
      }
    });

    marker.addTo(carte);
    markersVilles[ville.id] = marker;
  });

  // ─── Scénarios — intégrés comme marqueurs standard ──────────
  const filtreScenarios = document.getElementById('mfl-scenarios')?.checked ?? true;
  if (filtreScenarios && overlayMode !== 'masque') {
    CARTE_PINS.forEach(pin => {
      const [x, y] = pin.coords;
      const latlng = pixelToLatLng(x, y);

      const marker = L.marker(latlng, {
        icon: L.divIcon({
          html: pinSVG(),
          className: 'carte-ville', // même classe que les villes → pas de transition parasite
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      });

      marker.bindTooltip(pin.label, {
        permanent: false,
        direction: 'top',
        className: 'carte-tooltip',
        opacity: 1,
        offset: [0, -28],
        interactive: false,
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        fermerToutesSheets();
        if (pinActive === pin.id) {
          fermerPopup();
        } else {
          ouvrirPopupScenario(pin);
        }
      });

      marker.addTo(carte);
      markersVilles[pin.id] = marker;
    });
  }
}

function majTailleIconesVilles() {
  const taille = tailleIconeVille();
  Object.entries(markersVilles).forEach(([id, marker]) => {
    const ville = VILLES.find(v => v.id === id);
    if (!ville) return;
    const statutCapitale = Array.isArray(ville.capitale)
      ? rendreChamp(ville.capitale, anneeActive)
      : ville.capitale;
    const estPirate = statutCapitale === 'pirate';
    const estActive = villeActive === id;
    const estRang3 = (ville.rang ?? '1') === '3';
    marker.setIcon(L.divIcon({
      html: villeSVG(ville.type || 'ville', taille, estPirate, false, estActive, estRang3),
      className: 'carte-ville',
      iconSize: [taille, taille],
      iconAnchor: [taille / 2, taille / 2],
    }));
  });
}

// ═══════════════════════════════════════════════════════════
// POPUP SCÉNARIO — adapté mobile (sheet plutôt que popup overlay)
// ═══════════════════════════════════════════════════════════

function fermerPopup() {
  pinActive = null;
  fermerSheetVille();
}

function ouvrirPopupScenario(pin) {
  pinActive = pin.id;

  const entrees = pin.groupe
    ? pin.groupe
    : [{ label: pin.label, date: pin.date, extrait: pin.extrait, chronique_id: pin.chronique_id }];

  const entreesHtml = entrees.map(e => `
    <div class="mob-panneau-scenario-entree">
      <div class="mob-panneau-scenario-label">${e.label || ''}</div>
      ${e.date ? `<div class="mob-panneau-scenario-date">${e.date}</div>` : ''}
      ${e.extrait ? `<div class="mob-panneau-section">${e.extrait}</div>` : ''}
      ${e.chronique_id ? `<div class="mob-panneau-lien" onclick="naviguerVers('chroniques.html#${e.chronique_id}')">Lire la chronique →</div>` : ''}
    </div>`).join('');

  const contenu = `
    <div class="mob-panneau-header">
      <div class="mob-panneau-surtitle">Scénario</div>
      <div class="mob-panneau-titre">${pin.label}</div>
      <button class="mob-panneau-close" aria-label="Fermer">✕</button>
    </div>
    <div class="mob-panneau-body">
      ${entreesHtml}
    </div>`;
  mobOuvrirSheet(contenu);
}

// ═══════════════════════════════════════════════════════════
// SHEETS — GESTION GÉNÉRIQUE
// ═══════════════════════════════════════════════════════════

function afficherFondOverlay() {
  document.getElementById('mob-fond-overlay')?.classList.add('mob-fond-overlay--visible');
}

function cacherFondOverlay() {
  document.getElementById('mob-fond-overlay')?.classList.remove('mob-fond-overlay--visible');
}

function fermerToutesSheets() {
  fermerSheetCalques();
  fermerSheetAnnee();
  fermerSheetFiltres();
  cacherFondOverlay();
}

// ─── Sheet ville (bottom sheet expandable) ───────────────────

const NIVEAUX_SHEET = ['fermee', 'peek', 'reduite', 'pleine'];

let _hauteurPleinePx = null; // cache — recalculé au resize/fullscreenchange

function _recalculerHauteurPleine() {
  const vh = window.innerHeight;
  const barreBottom = 52;
  const cibleId = document.fullscreenElement ? 'mob-filtres-chips' : 'mob-recherche-field';
  const cible = document.getElementById(cibleId)
             ?? document.getElementById('mob-barre-recherche');
  if (cible) {
    const top = cible.getBoundingClientRect().top;
    _hauteurPleinePx = Math.round(vh - barreBottom - top);
  } else {
    _hauteurPleinePx = Math.round(vh * 0.88);
  }
}

function _hauteurPx(niveau) {
  if (niveau === 'fermee') return 0;
  if (niveau === 'peek')   return 40;
  const vh = window.innerHeight;
  if (niveau === 'reduite') return Math.round(vh * 0.32);
  if (niveau === 'pleine') {
    if (_hauteurPleinePx === null) _recalculerHauteurPleine();
    return _hauteurPleinePx;
  }
  return 0;
}

function setSheetHauteur(niveau) {
  sheetHauteur = niveau;
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;
  const px = _hauteurPx(niveau);
  // Couper la transition, forcer reflow, poser la nouvelle hauteur,
  // puis réactiver — évite le saut si une animation était en cours.
  sheet.style.transition = 'none';
  void sheet.offsetHeight; // reflow synchrone
  sheet.style.height = px + 'px';
  sheet.dataset.hauteur = niveau;
  requestAnimationFrame(() => { sheet.style.transition = ''; });
  _majPositionBoutonsFlottants(px, niveau);
}

function _majPositionBoutonsFlottants(sheetPx, niveau) {
  const boutons = document.getElementById('mob-boutons-flottants');
  if (!boutons) return;
  if (niveau === 'pleine') {
    // Volet plein : masquer les boutons (inutiles, inaccessibles)
    boutons.style.opacity    = '0';
    boutons.style.pointerEvents = 'none';
  } else {
    boutons.style.opacity    = '1';
    boutons.style.pointerEvents = '';
    // Remonter au-dessus du volet : 52px (barre basse) + hauteur volet + 8px marge
    const bottom = 52 + sheetPx + 8;
    boutons.style.bottom = bottom + 'px';
  }
}

function initSheetVille() {
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;

  // Précalculer la hauteur pleine dès l'init pour éviter le clignotement
  // à la première ouverture (getBoundingClientRect coûteux au premier appel)
  requestAnimationFrame(() => _recalculerHauteurPleine());

  // Délégation — bouton ✕ injecté dynamiquement
  sheet.addEventListener('click', (e) => {
    if (!e.target.closest('.mob-panneau-close')) return;
    if (villeActive) { fermerPanneauVille(); return; }
    if (zoneActive)  { fermerPanneau();       return; }
    if (pinActive)   { fermerPopup();          return; }
    fermerSheetVille();
  });

  // ─── Poignée swipable avec drag live ─────────────────────
  const handle = document.getElementById('mob-sheet-ville-handle');
  if (!handle) return;

  let startY   = 0;
  let startH   = 0;
  let lastY    = 0;
  let lastT    = 0;
  let vy       = 0;    // vélocité px/ms, positif = vers le haut
  let dragging = false;

  handle.addEventListener('pointerdown', (e) => {
    startY   = e.clientY;
    lastY    = e.clientY;
    lastT    = e.timeStamp;
    startH   = _hauteurPx(sheetHauteur);
    vy       = 0;
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    sheet.style.transition = 'none';   // désactiver pendant le drag
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = startY - e.clientY;     // positif = tiré vers le haut
    const dt = e.timeStamp - lastT;
    if (dt > 0) vy = (lastY - e.clientY) / dt;
    lastY = e.clientY;
    lastT = e.timeStamp;
    const maxH = _hauteurPx('pleine');
    const h = Math.max(0, Math.min(maxH, startH + dy));
    sheet.style.height = h + 'px';
    _majPositionBoutonsFlottants(h, h >= maxH * 0.85 ? 'pleine' : 'autre');
  });

  handle.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = 'height 0.3s ease-out';

    const VY_HAUT = 0.35;   // px/ms — swipe rapide vers le haut
    const VY_BAS  = 0.5;  // px/ms — swipe rapide vers le bas

    if (vy > VY_HAUT) {
      // Swipe rapide vers le haut → pleine
      setSheetHauteur('pleine');
    } else if (vy < -VY_BAS) {
      // Swipe rapide vers le bas → peek (pas fermeture : le tap carte suffit pour ça)
      setSheetHauteur('peek');
    } else {
      // Swipe lent → snap à la position la plus proche (fermee exclue : tap carte pour ça)
      const currentH = parseFloat(sheet.style.height);
      const cible = ['peek', 'reduite', 'pleine']
        .map(n => ({ niveau: n, dist: Math.abs(_hauteurPx(n) - currentH) }))
        .sort((a, b) => a.dist - b.dist)[0].niveau;
      setSheetHauteur(cible);
    }
  });

  handle.addEventListener('pointercancel', () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = 'height 0.3s ease-out';
    setSheetHauteur(sheetHauteur);  // revenir à la position avant drag
  });
}

function mobOuvrirSheet(contenuHtml, niveau = 'reduite') {
  const sheet = document.getElementById('mob-sheet-ville');
  const contenu = document.getElementById('mob-sheet-ville-contenu');
  if (!sheet || !contenu) return;
  contenu.innerHTML = contenuHtml;
  contenu.scrollTop = 0; // toujours revenir au début à chaque nouvelle ouverture
  sheetVilleOuverte = true;
  setSheetHauteur(niveau);
  sheet.classList.add('mob-sheet-ville--ouverte');
  sheet.setAttribute('aria-hidden', 'false');
}

function fermerSheetVille() {
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;
  if (sheet.contains(document.activeElement)) document.activeElement.blur();
  sheetVilleOuverte = false;
  sheetHauteur = 'reduite';
  sheet.style.height = '0';
  sheet.classList.remove('mob-sheet-ville--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  // Remettre les boutons flottants à leur position de repos
  const boutons = document.getElementById('mob-boutons-flottants');
  if (boutons) {
    boutons.style.opacity = '1';
    boutons.style.pointerEvents = '';
    boutons.style.bottom = '68px';
  }
  // ← villeActive, zoneActive, pinActive : NE PAS toucher ici
}
window.fermerSheetVille = fermerSheetVille;

// ─── Sheet filtres (drawer complet depuis le bas) ────────────
function initSheetFiltres() {
  const closeBtn = document.getElementById('mob-sheet-filtres-close');
  closeBtn?.addEventListener('click', fermerSheetFiltres);

  // Synchronisation des checkboxes internes → chips barre haute
  const cbMap = {
    'mfl-scenarios': 'scenarios',
    'mfl-etablissements': 'etablissements',
    'mfl-secondaires': 'secondaires',
    'mfl-sites': 'sites',
  };
  Object.entries(cbMap).forEach(([cbId, filtre]) => {
    const cb = document.getElementById(cbId);
    cb?.addEventListener('change', () => {
      const chip = document.querySelector(`.mob-filtre-chip[data-filtre="${filtre}"]`);
      if (chip) chip.classList.toggle('mob-filtre-chip--actif', cb.checked);
      renderVilles();
    });
  });

  // Bouton mode sombre dans la sheet filtres
  document.getElementById('mob-mode-sombre')?.addEventListener('click', () => toggleModeSombre());
}

function toggleModeSombre() {
  modeSombre = !modeSombre;
  document.getElementById('mob-btn-sombre')?.classList.toggle('mob-barre-basse-btn--actif', modeSombre);
  document.getElementById('mob-mode-sombre')?.classList.toggle('mob-filtre-chip--actif', modeSombre);
  carteOverlayPrincipale?.setOpacity(modeSombre ? 0.08 : 1);
}

function ouvrirSheetFiltres() {
  fermerSheetCalques();
  fermerSheetAnnee();
  const sheet = document.getElementById('mob-sheet-filtres');
  if (!sheet) return;
  sheetFiltresOuverte = true;
  sheet.classList.add('mob-sheet-filtres--ouverte');
  sheet.setAttribute('aria-hidden', 'false');
  afficherFondOverlay();
}

function fermerSheetFiltres() {
  const sheet = document.getElementById('mob-sheet-filtres');
  if (!sheet) return;
  sheetFiltresOuverte = false;
  sheet.classList.remove('mob-sheet-filtres--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  cacherFondOverlay();
}

// Branche un drag live sur la poignée d'une sheet fixe (calques, année).
// La sheet suit le doigt vers le bas ; relâcher au-delà du seuil la ferme.
function _bindPoigneeSwipe(poigneeId, sheetId, fermerFn) {
  const poignee = document.getElementById(poigneeId);
  const sheet   = document.getElementById(sheetId);
  if (!poignee || !sheet) return;

  const inner = sheet.querySelector('.mob-sheet-bottom');
  if (!inner) return;

  let startY    = 0;
  let dragging  = false;
  const SEUIL   = 60; // px vers le bas pour déclencher la fermeture

  poignee.addEventListener('pointerdown', (e) => {
    startY   = e.clientY;
    dragging = true;
    poignee.setPointerCapture(e.pointerId);
    inner.style.transition = 'none';
  });

  poignee.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = Math.max(0, e.clientY - startY); // uniquement vers le bas
    inner.style.transform = `translateY(${dy}px)`;
  });

  poignee.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dy = Math.max(0, e.clientY - startY);
    inner.style.transition = '';
    if (dy > SEUIL) {
      // Fermer d'abord (retire --ouverte), puis réinitialiser le transform
      // sans délai pour éviter le flash de retour avant masquage.
      fermerFn();
      inner.style.transform = '';
    } else {
      // Revenir en position
      inner.style.transform = '';
    }
  });

  poignee.addEventListener('pointercancel', () => {
    dragging = false;
    inner.style.transition = '';
    inner.style.transform  = '';
  });
}

// ─── Sheet calques (overlay + légende) ───────────────────────
function initSheetCalques() {
  document.getElementById('mob-calques-close')?.addEventListener('click', fermerSheetCalques);
  _bindPoigneeSwipe('mob-calques-handle', 'mob-sheet-calques', fermerSheetCalques);

  document.querySelectorAll('.mob-overlay-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === overlayMode) return;
      overlayMode = mode;
      puissancesMasquees.clear();
      paliersMasquesDensite.clear();
      paliersMasquesEsclavage.clear();
      document.querySelectorAll('.mob-overlay-item').forEach(b => b.classList.remove('mob-overlay-item--actif'));
      btn.classList.add('mob-overlay-item--actif');
      majLegende();
      renderZones();
      renderVilles();
      // Mettre à jour le bouton flottant
      const label = document.getElementById('mob-btn-calques-label');
      if (label) label.textContent = OVERLAY_LABELS[mode] || '';
    });
  });
}

function ouvrirSheetCalques() {
  fermerSheetFiltres();
  fermerSheetAnnee();
  majLegende(); // Mettre à jour la légende avant d'afficher
  const sheet = document.getElementById('mob-sheet-calques');
  if (!sheet) return;
  sheetCalquesOuverte = true;
  sheet.classList.add('mob-sheet-calques--ouverte');
  sheet.setAttribute('aria-hidden', 'false');
  afficherFondOverlay();
}

function fermerSheetCalques() {
  const sheet = document.getElementById('mob-sheet-calques');
  if (!sheet) return;
  if (sheet.contains(document.activeElement)) document.activeElement.blur();
  sheetCalquesOuverte = false;
  sheet.classList.remove('mob-sheet-calques--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  cacherFondOverlay();
}

// ─── Sheet année ──────────────────────────────────────────────
function initSheetAnnee() {
  document.getElementById('mob-annee-close')?.addEventListener('click', fermerSheetAnnee);
  _bindPoigneeSwipe('mob-annee-handle', 'mob-sheet-annee', fermerSheetAnnee);

  const slider = document.getElementById('mob-annee-slider');
  const affichage = document.getElementById('mob-annee-affichage');
  const prevBtn = document.getElementById('mob-annee-prev');
  const nextBtn = document.getElementById('mob-annee-next');

  if (!slider) return;

  const anneeMin = 1712;
  const anneeMax = modeMJ ? ANNEE_MAX_MJ : CARTE_ANNEE_REFERENCE;
  slider.min = anneeMin;
  slider.max = anneeMax;
  slider.value = anneeActive;

  function majDepuisSlider() {
    anneeActive = parseInt(slider.value);
    if (affichage) affichage.textContent = anneeActive;
    majCurseurAnnee();
    renderZones();
    majLegende();
    renderVilles();
    if (zoneActive) ouvrirPanneau(zoneActive);
    if (villeActive) ouvrirPanneauVille(villeActive);
  }

  slider.addEventListener('input', majDepuisSlider);

  prevBtn?.addEventListener('click', () => {
    const anneeMin = parseInt(slider.min);
    if (anneeActive > anneeMin) { slider.value = --anneeActive; majDepuisSlider(); }
  });
  nextBtn?.addEventListener('click', () => {
    const anneeMax = parseInt(slider.max);
    if (anneeActive < anneeMax) { slider.value = ++anneeActive; majDepuisSlider(); }
  });
}

function majCurseurAnnee() {
  const affichage = document.getElementById('mob-annee-affichage');
  if (affichage) affichage.textContent = anneeActive;
  const slider = document.getElementById('mob-annee-slider');
  if (slider) slider.value = anneeActive;
  const btnLabel = document.getElementById('mob-btn-annee-label');
  if (btnLabel) btnLabel.textContent = anneeActive;
}

function ouvrirSheetAnnee() {
  fermerSheetCalques();
  fermerSheetFiltres();
  const sheet = document.getElementById('mob-sheet-annee');
  if (!sheet) return;
  sheetAnneeOuverte = true;
  sheet.classList.add('mob-sheet-annee--ouverte');
  sheet.setAttribute('aria-hidden', 'false');
  afficherFondOverlay();
}

function fermerSheetAnnee() {
  const sheet = document.getElementById('mob-sheet-annee');
  if (!sheet) return;
  if (sheet.contains(document.activeElement)) document.activeElement.blur();
  sheetAnneeOuverte = false;
  sheet.classList.remove('mob-sheet-annee--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  cacherFondOverlay();
}

// ─── Boutons flottants ────────────────────────────────────────
function initBoutonsFlottants() {
  document.getElementById('mob-btn-calques')?.addEventListener('click', () => {
    sheetCalquesOuverte ? fermerSheetCalques() : ouvrirSheetCalques();
  });
  document.getElementById('mob-btn-annee')?.addEventListener('click', () => {
    sheetAnneeOuverte ? fermerSheetAnnee() : ouvrirSheetAnnee();
  });
  // Initialiser le label année
  majCurseurAnnee();
}

// ═══════════════════════════════════════════════════════════
// BARRE DE RECHERCHE MOBILE
// ═══════════════════════════════════════════════════════════

function initBarreRecherche() {
  const field = document.getElementById('mob-recherche-field');
  if (!field) return;

  field.addEventListener('click', () => {
    ouvrirRechercheComplete();
  });
}

function ouvrirRechercheComplete() {
  // Réutiliser la logique de recherche existante dans une sheet plein écran
  const sheet = document.createElement('div');
  sheet.id = 'mob-sheet-recherche';
  sheet.innerHTML = `
    <div id="mob-recherche-header">
      <div id="mob-recherche-input-wrap">
        <span id="mob-recherche-loupe" style="cursor:pointer;">🔍</span>
        <div id="mob-recherche-field-wrap">
          <input type="text" id="mob-recherche-fantome" tabindex="-1" aria-hidden="true" readonly>
          <div id="mob-recherche-input" contenteditable="plaintext-only"
            role="searchbox" aria-label="Rechercher un lieu"
            aria-autocomplete="list" spellcheck="false"
            data-placeholder="Rechercher un lieu…"></div>
        </div>
        <button id="mob-recherche-cancel">✕</button>
      </div>
    </div>
    <div id="mob-recherche-suggestions-wrap">
      <ul id="mob-recherche-suggestions" role="listbox"></ul>
    </div>`;
  document.body.appendChild(sheet);

  const input = document.getElementById('mob-recherche-input');
  const fantome = document.getElementById('mob-recherche-fantome');
  const suggestionsEl = document.getElementById('mob-recherche-suggestions');
  const cancelBtn = document.getElementById('mob-recherche-cancel');
  const loupeBtn = document.getElementById('mob-recherche-loupe');

  // Forcer le focus après insertion (décalé pour contourner iOS)
  setTimeout(() => input?.focus(), 100);

  cancelBtn?.addEventListener('click', () => fermerRechercheComplete());

  // Tap sur la loupe : valide le premier résultat du volet
  loupeBtn?.addEventListener('click', () => {
    if (!(input?.textContent || '').trim()) return;
    const premier = suggestionsEl?.querySelector('.mob-suggestion');
    if (premier) {
      const { id, type } = premier.dataset;
      fermerRechercheComplete();
      setTimeout(() => {
        _recalibrerVue();
        if (type === 'ville') zoomerVersVille(id);
        else zoomerVersTerrritoire(id);
      }, 500);
    }
  });

  // Branchement de la logique de suggestions (réutilise les données VILLES + JURIDICTIONS)
  input?.addEventListener('input', () => {
    const val = (input.textContent || '').trim();
    if (fantome) fantome.value = '';
    if (!val) { suggestionsEl.innerHTML = ''; return; }
    const norm = normaliser(val);

    const resultats = [];

    // Juridictions — recherche sur tags
    JURIDICTIONS.forEach(j => {
      if (j.visible_mj && !modeMJ) return;
      const tags = j.tags?.length ? j.tags : [j.label || j.nom].filter(Boolean);
      let matchTag = null;
      for (const tag of tags) {
        if (normaliser(tag).includes(norm)) { matchTag = tag; break; }
      }
      if (matchTag) resultats.push({ type: 'territoire', id: j.id, nom: j.nom, matchTag });
    });

    // Villes — recherche sur tags, filtre rang 3 hors MJ
    VILLES.forEach(v => {
      if (!v.coords) return;
      if (v.visible_mj && !modeMJ) return;
      if ((v.rang ?? '1') === '3' && !modeMJ) return;
      const tags = v.tags?.length ? v.tags : [v.nom, v.label].filter(Boolean);
      let matchTag = null;
      for (const tag of tags) {
        if (normaliser(tag).includes(norm)) { matchTag = tag; break; }
      }
      if (matchTag) resultats.push({ type: 'ville', id: v.id, nom: v.label || v.nom, matchTag });
    });

    // Tri par pertinence — aligné sur carte.js
    resultats.sort((a, b) => {
      const rang = r => {
        const nomLow = normaliser(r.nom);
        const tagLow = normaliser(r.matchTag);
        const estVille = r.type === 'ville';
        if (nomLow.startsWith(norm)) return estVille ? 0 : 1;
        if (nomLow.includes(norm)) return estVille ? 2 : 3;
        if (tagLow.startsWith(norm)) return estVille ? 4 : 5;
        return estVille ? 6 : 7;
      };
      const ra = rang(a), rb = rang(b);
      if (ra !== rb) return ra - rb;
      return normaliser(a.nom).localeCompare(normaliser(b.nom), 'fr');
    });

    const _esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const _surligner = (texte, q) => {
      const idx = normaliser(texte).indexOf(q);
      if (idx === -1) return _esc(texte);
      return _esc(texte.slice(0, idx))
        + `<mark class="mob-suggestion-highlight">${_esc(texte.slice(idx, idx + q.length))}</mark>`
        + _esc(texte.slice(idx + q.length));
    };

    suggestionsEl.innerHTML = resultats.slice(0, 12).map(r => {
      const nomMatch = r.matchTag === r.nom;
      const matchHtml = nomMatch ? '' :
        `<span class="mob-suggestion-match">${_surligner(r.matchTag, norm)}</span>`;
      return `<li class="mob-suggestion" data-id="${r.id}" data-type="${r.type}" data-nom="${_esc(r.nom)}" role="option">
        <span class="mob-suggestion-nom">${_surligner(r.nom, norm)}</span>
        ${matchHtml}
      </li>`;
    }).join('');

    // Fantôme : premier résultat dont le nom commence par la saisie (pas forcément le [0])
    if (fantome) {
      fantome.value = '';
      const candidat = resultats.find(r => normaliser(r.nom).startsWith(norm));
      if (candidat) {
        const saisie = input.textContent || '';
        fantome.value = saisie + candidat.nom.slice(saisie.length);
      }
    }

    suggestionsEl.querySelectorAll('.mob-suggestion').forEach(li => {
      li.addEventListener('click', () => {
        const { id, type } = li.dataset;
        fermerRechercheComplete();
        setTimeout(() => {
          recalibrerVue();
          if (type === 'ville') zoomerVersVille(id);
          else zoomerVersTerrritoire(id);
        }, 500);
      });
    });
  });
}

function fermerRechercheComplete() {
  // Blur explicite + délai fixe : laisse le clavier Android amorcer
  // sa fermeture pendant que la sheet est encore visible, de sorte que
  // le redimensionnement du viewport se produise derrière la sheet
  // et non sur la carte.
  const input = document.getElementById('mob-recherche-input');
  input?.blur();
  setTimeout(() => {
    document.getElementById('mob-sheet-recherche')?.remove();
  }, 300);
}

function _assurerFiltreActif(villeId, villeObj) {
  // Correspondance alignée sur la logique de renderVilles :
  //   estSite  → type === 'site_geo' || 'site_hist'
  //   estEtab  → type === 'port' || 'fort' || 'ville'  (rang 1, non secondaire)
  //   estSecond → rang === '2'
  const type = villeObj?.type ?? '';
  const rang  = villeObj?.rang  ?? '1';

  const estScenario = !!(CARTE_PINS?.find(p => p.id === villeId));
  const estSite     = (type === 'site_geo' || type === 'site_hist');
  const estSecond   = (rang === '2');
  const estEtab     = !estSite && !estSecond && !estScenario
                      && (type === 'port' || type === 'fort' || type === 'ville');

  const filtreCle = estScenario ? 'scenarios'
    : estSite     ? 'sites'
    : estSecond   ? 'secondaires'
    : estEtab     ? 'etablissements'
    : null; // villes principales rang 1 sans chip — toujours visibles

  if (!filtreCle) return;

  const chip = document.querySelector(`.mob-filtre-chip[data-filtre="${filtreCle}"]`);
  if (!chip || chip.classList.contains('mob-filtre-chip--actif')) return;

  chip.classList.add('mob-filtre-chip--actif');
  syncFiltresDepuisChips();
  renderVilles(); // synchrone — markersVilles à jour après cet appel
}

function zoomerVersVille(villeId) {
  const ville = VILLES.find(v => v.id === villeId)
             ?? CARTE_PINS?.find(p => p.id === villeId);

  // Réactiver le filtre si nécessaire
  _assurerFiltreActif(villeId, ville ?? null);

  // Coordonnées : depuis le marker s'il existe, sinon depuis les données
  const markerLatLng = markersVilles[villeId]?.getLatLng()
    ?? (ville?.coords ? pixelToLatLng(ville.coords[0], ville.coords[1]) : null);

  if (!markerLatLng) {
    // Dernier recours : ouvrir le panneau sans flyTo
    ouvrirPanneauVille(villeId);
    return;
  }

  carte.setZoom(0, { animate: false });
  setTimeout(() => {
    const markerPtFinal = carte.latLngToContainerPoint(markerLatLng);
    const chips    = document.getElementById('mob-filtres-chips');
    const vh       = window.innerHeight;
    const zoneHaut = chips ? chips.getBoundingClientRect().bottom : 100;
    const zoneBas  = vh - 52 - _hauteurPx('reduite');
    const cy = zoneHaut + (zoneBas - zoneHaut) / 2;
    const cx = window.innerWidth / 2;
    carte.panBy([markerPtFinal.x - cx, markerPtFinal.y - cy], { animate: true, duration: 1.2 });
    setTimeout(() => ouvrirPanneauVille(villeId), 1300);
  }, 100);
}

// Wrapper flyToBounds qui contourne le blocage Leaflet depuis le zoom minimum :
// flyToBounds échoue silencieusement quand getZoom() === getMinZoom() car Leaflet
// refuse d'animer vers un zoom ≤ zoom courant au minimum. On force un micro-décalage
// imperceptible (+0.01) avant de lancer l'animation, puis on restaure minZoom.
function _flyToBoundsSansBlocage(bounds, options) {
  const zMinSaved = carte.getMinZoom();
  carte.setMinZoom(-10);

  const maxZoom = options.maxZoom ?? 0;
  const zoomCible = Math.min(maxZoom, carte.getBoundsZoom(bounds));
  const centre = bounds.getCenter();

  void carte.getSize();
  carte.setZoom(zoomCible, { animate: false });
  requestAnimationFrame(() => {
    carte.panTo(centre, { animate: true, duration: 1.2 });
  });
  carte.once('moveend', () => carte.setMinZoom(zMinSaved));
}

// Extrait les bounds d'un LayerGroup de polygones.
function _boundsFromGroupe(groupe) {
  const latlngs = [];
  groupe.eachLayer?.(poly => {
    poly.getLatLngs?.()?.flat(Infinity).forEach(ll => latlngs.push(ll));
  });
  return latlngs.length ? L.latLngBounds(latlngs) : null;
}

function zoomerVersTerrritoire(territoireId) {
  const chips = document.getElementById('mob-filtres-chips');
  const paddingHaut = chips ? Math.round(chips.getBoundingClientRect().bottom) + 8 : 50;
  const paddingBas  = Math.round(_hauteurPx('reduite')) + 8;
  const flyOpts = {
    paddingTopLeft:     [20, paddingHaut],
    paddingBottomRight: [20, paddingBas],
    maxZoom: 0,
    duration: 0.8,
  };

  // 1. Bounds depuis le LayerGroup rendu (polygones du groupe)
  const groupe = layersZones[territoireId];
  if (groupe) {
    const bounds = _boundsFromGroupe(groupe);
    if (bounds?.isValid()) {
      _flyToBoundsSansBlocage(bounds, flyOpts);
      carte.once('moveend', () => ouvrirPanneau(territoireId));
      return;
    }
  }

  // 2. Fallback : reconstruire depuis ZONES_DATA ou JURIDICTIONS
  const j = JURIDICTIONS.find(j => j.id === territoireId);
  const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[territoireId])
    ? ZONES_DATA[territoireId]
    : (j?.zone?.length >= 3 ? [j.zone] : null);

  if (contours) {
    const latlngs = contours.flatMap(pts => pts.map(([x, y]) => pixelToLatLng(x, y)));
    const bounds = L.latLngBounds(latlngs);
    if (bounds.isValid()) {
      _flyToBoundsSansBlocage(bounds, flyOpts);
      carte.once('moveend', () => ouvrirPanneau(territoireId));
      return;
    }
  }

  // 3. Dernier recours : ouvrir le panneau sans navigation
  ouvrirPanneau(territoireId);
}

// ═══════════════════════════════════════════════════════════
// Chips filtres (barre haute)
// ═══════════════════════════════════════════════════════════

function initFiltresChips() {
  const chips = document.querySelectorAll('.mob-filtre-chip[data-filtre]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('mob-filtre-chip--actif');
      syncFiltresDepuisChips();
      renderVilles();
    });
  });
}

function syncFiltresDepuisChips() {
  const map = {
    scenarios:      'mfl-scenarios',
    etablissements: 'mfl-etablissements',
    secondaires:    'mfl-secondaires',
    sites:          'mfl-sites',
    rang3:          'mfl-rang3',
  };
  document.querySelectorAll('.mob-filtre-chip[data-filtre]').forEach(chip => {
    const cb = document.getElementById(map[chip.dataset.filtre]);
    if (cb) cb.checked = chip.classList.contains('mob-filtre-chip--actif');
  });
}

// ═══════════════════════════════════════════════════════════
// SÉQUENCE SECRÈTE MJ
// ═══════════════════════════════════════════════════════════

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
  // Sur mobile : la confirmation passe par la sheet ville réutilisée
  const contenu = `
    <div style="padding: 1.5rem 1rem 1rem;">
      <h3 style="font-family:'Cinzel',serif; font-size:1rem; color:var(--gold); margin-bottom:0.75rem; letter-spacing:0.08em;">
        Mode Maître de Jeu
      </h3>
      <p style="font-family:'IM Fell English',serif; font-size:0.9rem; color:var(--mist-light); line-height:1.5; margin-bottom:1.25rem;">
        Activer le mode MJ ? Les notes confidentielles et les données futures seront visibles jusqu'au rechargement de la page.
      </p>
      <div style="display:flex; gap:0.75rem;">
        <button class="mob-action-btn mob-action-btn--gold" onclick="confirmerModeMJ()">Confirmer</button>
        <button class="mob-action-btn" onclick="annulerModeMJ()">Annuler</button>
      </div>
    </div>`;
  pinActive = '__mj_confirm__';
  mobOuvrirSheet(contenu, 'reduite');
}

function confirmerModeMJ() {
  modeMJ = true;
  fermerSheetVille();

  // Badge MJ
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
      padding:0.2rem 0.5rem; border:1px solid rgba(139,58,42,0.3);`;
    wrap.appendChild(badge);
  }

  // Débrider le slider année
  const slider = document.getElementById('mob-annee-slider');
  if (slider) slider.max = ANNEE_MAX_MJ;

  majCurseurAnnee();
  renderZones();
  renderVilles();

  // Ajouter chip filtre rang 3 dans la barre haute
  const conteneurFiltresMJ = document.getElementById('mob-filtres-mj');
  if (conteneurFiltresMJ && !document.getElementById('mob-filtre-rang3')) {
    const chip = document.createElement('button');
    chip.id = 'mob-filtre-rang3';
    chip.className = 'mob-filtre-chip mob-filtre-chip--mj mob-filtre-chip--actif';
    chip.dataset.filtre = 'rang3';
    chip.innerHTML = '🔒 Masqués';
    chip.addEventListener('click', () => {
      chip.classList.toggle('mob-filtre-chip--actif');
      // Synchroniser la checkbox interne utilisée par renderVilles
      let cb = document.getElementById('mfl-rang3');
      if (!cb) {
        cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'mfl-rang3';
        cb.style.display = 'none';
        document.body.appendChild(cb);
      }
      cb.checked = chip.classList.contains('mob-filtre-chip--actif');
      renderVilles();
    });
    conteneurFiltresMJ.appendChild(chip);

    // Créer la checkbox cachée initiale (cochée)
    if (!document.getElementById('mfl-rang3')) {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'mfl-rang3';
      cb.checked = true;
      cb.style.display = 'none';
      document.body.appendChild(cb);
    }

    renderVilles();
  }
}

function annulerModeMJ() {
  fermerSheetVille();
  renderZones();
}

// ─── Écran de chargement ─────────────────────────────────────
function masquerEcranChargement() {
  const ecran = document.getElementById('carte-chargement');
  if (!ecran) return;
  ecran.style.opacity = '0';
  setTimeout(() => ecran.remove(), 700);
}

// ═══════════════════════════════════════════════════════════
// LÉGENDE MOBILE
// ═══════════════════════════════════════════════════════════

function majLegende() {
  const legende = document.getElementById('mob-legende-inner');
  if (!legende) return;
  legende.innerHTML = '';

  if (overlayMode === 'masque') {
    legende.innerHTML = `<p class="mob-legende-info">Teatre de la Guerre en Amerique — Jaillot, Mortier & Sanson, 1708. <a href="https://www.davidrumsey.com" target="_blank" rel="noopener">David Rumsey Map Collection</a></p>`;
    return;
  }

  // Helper : crée un wrap légende (carré couleur + nom dessous)
  function _legendeItem(couleur, nom, masquee, onClick) {
    const wrap = document.createElement('div');
    wrap.className = 'mob-legende-wrap'
      + (masquee ? ' mob-legende-wrap--masquee' : '')
      + (onClick  ? ' mob-legende-wrap--cliquable' : '');
    const carre = document.createElement('div');
    carre.className = 'mob-legende-item';
    carre.style.background = couleur;
    const label = document.createElement('span');
    label.className = 'mob-legende-nom';
    label.textContent = nom;
    wrap.appendChild(carre);
    wrap.appendChild(label);
    if (onClick) wrap.addEventListener('click', onClick);
    return wrap;
  }

  if (overlayMode === 'geo') {
    const puissancesVisibles = new Set();
    JURIDICTIONS.forEach(j => {
      if (j.visible_mj && !modeMJ) return;
      const p = resoudre(j.puissance, anneeActive);
      if (p) puissancesVisibles.add(p);
    });
    [...puissancesVisibles]
      .sort((a, b) => (PUISSANCES[a]?.ordre ?? 99) - (PUISSANCES[b]?.ordre ?? 99))
      .forEach(p => {
        const puissance = PUISSANCES[p];
        if (!puissance) return;
        const masquee = puissancesMasquees.has(p);
        legende.appendChild(_legendeItem(puissance.couleur, puissance.labelCourt || puissance.label || p, masquee, () => {
          if (masquee) puissancesMasquees.delete(p); else puissancesMasquees.add(p);
          majLegende(); renderZones();
        }));
      });
    return;
  }

  if (overlayMode === 'densite') {
    const sousTitre = document.createElement('p');
    sousTitre.className = 'mob-legende-soustitre';
    sousTitre.textContent = 'Habitants par km²';
    legende.appendChild(sousTitre);
    const labels = ['< 0,05', '0,05–0,15', '0,15–0,5', '0,5–2', '2–8', '> 8'];
    DENSITE_PALIERS.forEach((palier, i) => {
      const masque = paliersMasquesDensite.has(i);
      legende.appendChild(_legendeItem(palier.couleur, labels[i] || '', masque, () => {
        if (masque) paliersMasquesDensite.delete(i); else paliersMasquesDensite.add(i);
        majLegende(); renderZones();
      }));
    });
    return;
  }

  if (overlayMode === 'esclavage') {
    // Sous-titre : deux demi-carrés inline + libellés + unité
    const sousTitre = document.createElement('p');
    sousTitre.className = 'mob-legende-soustitre';
    sousTitre.innerHTML =
      `<span class="mob-legende-puce" style="background:${ESCLAVAGE_PALIERS[3].fm}"></span>Encomienda`
      + `&ensp;<span class="mob-legende-puce" style="background:${ESCLAVAGE_PALIERS[3].ra}"></span>Traite négrière`
      + `<br>En % de la population`;
    legende.appendChild(sousTitre);
    const labels = ['< 10%', '10–25%', '25–40%', '40–60%', '60–80%', '> 80%'];
    ESCLAVAGE_PALIERS.forEach((palier, i) => {
      const masque = paliersMasquesEsclavage.has(i);
      // Deux demi-carrés : encomienda (fm) + traite négrière (ra)
      const wrap = document.createElement('div');
      wrap.className = 'mob-legende-wrap' + (masque ? ' mob-legende-wrap--masquee' : '');
      const paire = document.createElement('div');
      paire.className = 'mob-legende-paire';
      [palier.fm, palier.ra].forEach(couleur => {
        const demi = document.createElement('div');
        demi.className = 'mob-legende-demi';
        demi.style.background = couleur;
        paire.appendChild(demi);
      });
      const label = document.createElement('span');
      label.className = 'mob-legende-nom';
      label.textContent = labels[i];
      wrap.appendChild(paire);
      wrap.appendChild(label);
      wrap.addEventListener('click', () => {
        if (masque) paliersMasquesEsclavage.delete(i); else paliersMasquesEsclavage.add(i);
        majLegende(); renderZones();
      });
      legende.appendChild(wrap);
    });
    return;
  }

  if (overlayMode === 'autochtones') {
    const items = [
      { statut: 'souverainete', label: 'Souveraineté' },
      { statut: 'resistance', label: 'Résistance' },
      { statut: 'domination', label: 'Domination' },
    ];
    items.forEach(({ statut, label }) => {
      legende.appendChild(_legendeItem(AUTOCHTONES_COULEURS[statut], label, false, null));
    });
    // Carré vide = population absente ou éteinte
    const wrapVide = document.createElement('div');
    wrapVide.className = 'mob-legende-wrap';
    const carreVide = document.createElement('div');
    carreVide.className = 'mob-legende-item mob-legende-item--vide';
    const labelVide = document.createElement('span');
    labelVide.className = 'mob-legende-nom';
    labelVide.textContent = 'Pop. éteinte';
    wrapVide.appendChild(carreVide);
    wrapVide.appendChild(labelVide);
    legende.appendChild(wrapVide);
    return;
  }
}

// resoudre() est définie dans carte-data.js — pas besoin de stub ici.

function fermerTooltipsOrphelins() {
  carte?.eachLayer(l => { if (l.getTooltip?.() && l.isTooltipOpen?.()) l.closeTooltip(); });
}
