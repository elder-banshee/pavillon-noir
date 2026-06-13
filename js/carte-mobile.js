// ═══════════════════════════════════════════════════════════
// CARTE MOBILE — Interface style Maps pour smartphones
// Remplace carte.js sur écrans ≤ 768px
// ═══════════════════════════════════════════════════════════

// ─── État global — identique à carte.js ──────────────────────
let carte = null;
let carteOverlayPrincipale = null;
let anneeActive = CARTE_ANNEE_REFERENCE;
let zoneActive = null;
let layersZones = {};
let markersMap = {};
let pinActive = null;
let modeSombre = false;
let contourGlobalLayer = null;
let villeActive = null;
let markersVilles = {};
let pairesChevauchement = [];
let clustersChevauchement = [];
let loupeInstance = null;
let loupeBitmap = null;
let mouseoutTimers = {};
let ecartementsActifs = {};

// ─── Mode overlay ─────────────────────────────────────────────
let overlayMode = 'geo';
let overlayModeAvantIsolation = 'geo';
let isolationJuridictionId = null;
let isolationLayer = null;
let isolationVilleId = null;

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
let sheetHauteur = 'reduite'; // 'reduite' | 'mi-hauteur' | 'pleine'

// ─── Constantes overlay ───────────────────────────────────────
const OVERLAY_LABELS = {
  geo: 'Géopolitique',
  densite: 'Densité de population',
  esclavage: 'Esclavage & Encomienda',
  autochtones: 'Foyers autochtones',
  masque: 'Carte Jaillot (1708)',
};

const OVERLAY_ICONES = {
  geo: '⚑',
  densite: '♟',
  esclavage: '⛓',
  autochtones: '➶',
  masque: '✕',
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

const WEIGHTS = { zone: 0.5, zoneActive: 2, isolation: 2 };
const ZOOM_FACTEUR = 1.5;

// ═══════════════════════════════════════════════════════════
// UTILITAIRES PURS — identiques à carte.js
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

// ─── Calcul année max MJ ─────────────────────────────────────
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
// SVG BUILDERS — identiques à carte.js
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

// ═══════════════════════════════════════════════════════════
// SÉQUENCE SECRÈTE MJ — identique à carte.js
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
  ouvrirSheetVilleAvecContenu(contenu, 'mi-hauteur');
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
        if (typeof createImageBitmap === 'function') {
          createImageBitmap(imgPreload).then(bmp => { loupeBitmap = bmp; });
        }
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

// ─── Injection HTML mobile ────────────────────────────────────
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
      <span class="mob-btn-flottant-icone">📅</span>
      <span class="mob-btn-flottant-label" id="mob-btn-annee-label">1716</span>
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
      <button id="mob-sheet-filtres-close" aria-label="Fermer">✕</button>
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
      <div class="mob-sheet-handle"></div>
      <div class="mob-sheet-bottom-header">
        <span>Type de carte</span>
        <button class="mob-sheet-close-btn" id="mob-calques-close">✕</button>
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
      <div class="mob-sheet-handle"></div>
      <div class="mob-sheet-bottom-header">
        <span>Année</span>
        <button class="mob-sheet-close-btn" id="mob-annee-close">✕</button>
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

  // Mode sombre
  document.getElementById('mob-btn-sombre')?.addEventListener('click', function () {
    modeSombre = !modeSombre;
    this.classList.toggle('mob-barre-basse-btn--actif', modeSombre);
    if (overlayMode !== 'isolation' && overlayMode !== 'isolationVille') {
      carteOverlayPrincipale?.setOpacity(modeSombre ? 0.08 : 1);
    }
  });

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
    attributionControl: false,
    doubleClickZoom: false,
    zoomControl: false,
    tap: true,
    tapTolerance: 15,
  });

  carteOverlayPrincipale = L.imageOverlay(CARTE_IMAGE.src, bounds).addTo(carte);
  const el = carteOverlayPrincipale.getElement();
  if (el) el.style.transition = 'opacity 0.9s ease';
  carte.createPane('isolationContour');
  carte.getPane('isolationContour').style.zIndex = 420;
  carte.getPane('isolationContour').style.pointerEvents = 'none';
  carte.createPane('contourGlobal');
  carte.getPane('contourGlobal').style.zIndex = 410;
  carte.getPane('contourGlobal').style.pointerEvents = 'none';

  renderZones();
  renderPins();
  renderVilles();

  carte.on('click', (e) => {
    fermerPopup();
    fermerIsolation();
    fermerZoomVille();
    fermerLoupe();
    fermerToutesSheets();
    fermerSheetVille();
    pairesChevauchement.forEach(paire => rapprocherVille(paire.idA));
  });

  carte.on('zoom', () => {
    for (const [cle, etat] of Object.entries(ecartementsActifs)) {
      const [idA, idB] = cle.split(':');
      const elA = markersVilles[idA]?.getElement();
      const elB = markersVilles[idB]?.getElement();
      if (elA) { const t = lireTranslate3d(elA); elA.style.transition = ''; elA.style.transform = `${t} translate(${etat.dxA}px, ${etat.dyA}px)`; }
      if (elB) { const t = lireTranslate3d(elB); elB.style.transition = ''; elB.style.transform = `${t} translate(${etat.dxB}px, ${etat.dyB}px)`; }
    }
  });

  carte.on('zoomstart', () => {
    if (isolationLayer) isolationLayer.setStyle({ opacity: 0 });
  });

  carte.on('moveend', () => {
    majWeightsZones();
    if (isolationLayer) {
      isolationLayer.setStyle({ weight: weightPourZoom(WEIGHTS.isolation, carte.getZoom()) });
      setTimeout(() => { if (isolationLayer) isolationLayer.setStyle({ opacity: 1 }); }, 60);
    }
    majTailleIconesVilles();
    calculerPairesChevauchement();
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('carte-loupe')) return;
    if (e.target.closest('#carte-loupe')) return;
    if (e.target.closest('.carte-ville')) return;
    fermerLoupe();
  });

  // Calcule le zoom qui fait tenir la hauteur carte dans l'espace disponible
  function _caliberZoomMin() {
    // Zoom exact pour que la hauteur image == hauteur conteneur Leaflet.
    // zoomSnap:0 permet une valeur flottante précise — pas d'arrondi.
    // On soustrait 0.001 pour laisser une infime marge : évite que
    // Leaflet considère la vue comme "déjà au bord" et refuse le pan
    // latéral sur les petites cartes.
    return Math.log2(carte.getSize().y / CARTE_IMAGE.height) - 0.001;
  }

  function _recalibrerVue() {
    carte.invalidateSize();
    const zMin = _caliberZoomMin();
    carte.setMinZoom(zMin);
    const nassau = pixelToLatLng(4542, 1739);
    // Si on est plus dézoomé que le nouveau minimum, on recadre
    if (carte.getZoom() < zMin) {
      carte.setView(nassau, zMin, { animate: false });
    }
    carte.setMaxBounds([[0, 0], [CARTE_IMAGE.height, CARTE_IMAGE.width]]);
  }

  setTimeout(() => {
    carte.invalidateSize();
    const nassau = pixelToLatLng(4542, 1739);
    const zMin = _caliberZoomMin();
    carte.setMinZoom(zMin);
    carte.setView(nassau, zMin, { animate: false });
    carte.setMaxBounds([[0, 0], [CARTE_IMAGE.height, CARTE_IMAGE.width]]);
    console.log('[mobile] zMin=', zMin, 'containerH=', carte.getSize().y, 'imageH=', CARTE_IMAGE.height, 'getMinZoom=', carte.getMinZoom());
    majWeightsZones();
    calculerPairesChevauchement();
    const ecran = document.getElementById('carte-chargement');
    if (ecran) { ecran.style.display = 'none'; ecran.remove(); }
  }, 500);

  // Leaflet 1.9 appelle _move({pinch:true}) directement depuis TouchZoom,
  // avec zoom et centre déjà couplés — on ne peut pas les dissocier.
  // On patch le handler _onTouchMove de TouchZoom pour ignorer les frames
  // où le zoom calculé serait sous le minimum.
  if (carte.touchZoom && carte.touchZoom._onTouchMove) {
    const _onTouchMoveOrig = carte.touchZoom._onTouchMove.bind(carte.touchZoom);
    carte.touchZoom._onTouchMove = function(e) {
      // Calculer le zoom que ce geste produirait, sans l'appliquer
      if (e.touches && e.touches.length === 2) {
        const p1 = carte.mouseEventToContainerPoint(e.touches[0]);
        const p2 = carte.mouseEventToContainerPoint(e.touches[1]);
        const dist = p1.distanceTo(p2);
        if (this._startDist && dist < this._startDist) {
          // pinch fermant — calculer le zoom résultant
          const scale = dist / this._startDist;
          const zoom = carte.getScaleZoom(scale, this._startZoom);
          if (zoom < carte.getMinZoom()) return; // ignorer ce frame
        }
      }
      return _onTouchMoveOrig(e);
    };
  }

  window.addEventListener('resize', _recalibrerVue);

  document.addEventListener('fullscreenchange', () => {
    setTimeout(_recalibrerVue, 150);
  });


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
        <span>🔍</span>
        <input type="text" id="mob-recherche-input" placeholder="Rechercher un lieu…"
          autocomplete="off" spellcheck="false">
        <button id="mob-recherche-cancel">✕</button>
      </div>
    </div>
    <div id="mob-recherche-suggestions-wrap">
      <ul id="mob-recherche-suggestions" role="listbox"></ul>
    </div>`;
  document.body.appendChild(sheet);

  const input = document.getElementById('mob-recherche-input');
  const suggestionsEl = document.getElementById('mob-recherche-suggestions');
  const cancelBtn = document.getElementById('mob-recherche-cancel');

  // Forcer le focus après insertion (décalé pour contourner iOS)
  setTimeout(() => input?.focus(), 100);

  cancelBtn?.addEventListener('click', () => fermerRechercheComplete());

  // Branchement de la logique de suggestions (réutilise les données VILLES + JURIDICTIONS)
  input?.addEventListener('input', () => {
    const val = input.value.trim();
    if (!val) { suggestionsEl.innerHTML = ''; return; }
    const norm = normaliser(val);

    const resultats = [];

    // Villes
    VILLES.forEach(v => {
      if (!v.coords) return;
      const noms = [v.nom, v.label].filter(Boolean);
      if (noms.some(n => normaliser(n).includes(norm))) {
        resultats.push({ type: 'ville', id: v.id, nom: v.label || v.nom });
      }
    });

    // Juridictions / territoires
    JURIDICTIONS.forEach(j => {
      const label = j.label || j.nom;
      if (normaliser(label).includes(norm)) {
        resultats.push({ type: 'territoire', id: j.id, nom: label });
      }
    });

    suggestionsEl.innerHTML = resultats.slice(0, 12).map(r => `
      <li class="mob-suggestion" data-id="${r.id}" data-type="${r.type}" role="option">
        <span class="mob-suggestion-icone">${r.type === 'ville' ? '⌂' : '◈'}</span>
        <span class="mob-suggestion-nom">${r.nom}</span>
      </li>`).join('');

    suggestionsEl.querySelectorAll('.mob-suggestion').forEach(li => {
      li.addEventListener('click', () => {
        const { id, type } = li.dataset;
        fermerRechercheComplete();
        if (type === 'ville') zoomerVersVille(id);
        else zoomerVersTerrritoire(id);
      });
    });
  });
}

function fermerRechercheComplete() {
  document.getElementById('mob-sheet-recherche')?.remove();
}

function zoomerVersVille(villeId) {
  const marker = markersVilles[villeId];
  if (!marker) {
    // Si le marqueur n'existe pas (filtre), on tente d'ouvrir le panneau directement
    ouvrirPanneauVille(villeId);
    return;
  }
  carte.flyTo(marker.getLatLng(), Math.max(carte.getZoom(), -1), { duration: 0.8 });
  setTimeout(() => ouvrirPanneauVille(villeId), 850);
}

function zoomerVersTerrritoire(territoireId) {
  // Chercher un layer de zone correspondant
  const layer = layersZones[territoireId];
  if (layer) {
    const bounds = layer.getBounds?.();
    if (bounds) {
      carte.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
      setTimeout(() => ouvrirPanneau(territoireId), 850);
      return;
    }
  }
  ouvrirPanneau(territoireId);
}

// ─── Chips filtres (barre haute) ─────────────────────────────
function initFiltresChips() {
  const chips = document.querySelectorAll('.mob-filtre-chip[data-filtre]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('mob-filtre-chip--actif');
      syncFiltresDepuisChips();
      renderPins();
      renderVilles();
    });
  });
}

function syncFiltresDepuisChips() {
  // Synchronise l'état des chips vers les checkboxes internes (utilisées par renderVilles)
  const map = {
    scenarios: 'mfl-scenarios',
    etablissements: 'mfl-etablissements',
    secondaires: 'mfl-secondaires',
    sites: 'mfl-sites',
    rang3: 'mfl-rang3',
  };
  document.querySelectorAll('.mob-filtre-chip[data-filtre]').forEach(chip => {
    const cible = document.getElementById(map[chip.dataset.filtre]);
    if (cible) cible.checked = chip.classList.contains('mob-filtre-chip--actif');
  });
  // Synchroniser aussi la sheet filtres si elle existe
  Object.entries(map).forEach(([filtre, id]) => {
    const chip = document.querySelector(`.mob-filtre-chip[data-filtre="${filtre}"]`);
    const cb = document.getElementById(id);
    if (chip && cb) cb.checked = chip.classList.contains('mob-filtre-chip--actif');
  });
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
function initSheetVille() {
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;

  // Délégation — bouton ✕ injecté dynamiquement
  sheet.addEventListener('click', (e) => {
    if (e.target.closest('.mob-panneau-close')) fermerSheetVille();
  });

  // Poignée swipable
  const handle = document.getElementById('mob-sheet-ville-handle');
  if (!handle) return;
  let startY = 0;
  handle.addEventListener('pointerdown', (e) => {
    startY = e.clientY;
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointerup', (e) => {
    const dy = startY - e.clientY;
    if (dy > 30) {
      if (sheetHauteur === 'reduite') setSheetHauteur('mi-hauteur');
      else if (sheetHauteur === 'mi-hauteur') setSheetHauteur('pleine');
    } else if (dy < -30) {
      if (sheetHauteur === 'pleine') setSheetHauteur('mi-hauteur');
      else if (sheetHauteur === 'mi-hauteur') setSheetHauteur('reduite');
      else fermerSheetVille();
    }
  });
}

function setSheetHauteur(niveau) {
  sheetHauteur = niveau;
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;
  const HAUTEURS = { reduite: '32vh', 'mi-hauteur': '58vh', pleine: '90vh' };
  sheet.style.height = HAUTEURS[niveau] || '32vh';
  sheet.dataset.hauteur = niveau;
}

function ouvrirSheetVille(contenuHtml) {
  ouvrirSheetVilleAvecContenu(contenuHtml, 'reduite');
}

function ouvrirSheetVilleAvecContenu(contenuHtml, niveau = 'reduite') {
  const sheet = document.getElementById('mob-sheet-ville');
  const contenu = document.getElementById('mob-sheet-ville-contenu');
  if (!sheet || !contenu) return;
  contenu.innerHTML = contenuHtml;
  sheetVilleOuverte = true;
  setSheetHauteur(niveau);
  sheet.classList.add('mob-sheet-ville--ouverte');
  sheet.setAttribute('aria-hidden', 'false');
}

function fermerSheetVille() {
  const sheet = document.getElementById('mob-sheet-ville');
  if (!sheet) return;
  sheetVilleOuverte = false;
  sheetHauteur = 'reduite';
  sheet.style.height = '0';
  sheet.classList.remove('mob-sheet-ville--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  villeActive = null;
  zoneActive = null;
  pinActive = null;
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
      renderPins();
      renderVilles();
    });
  });

  // Bouton mode sombre
  document.getElementById('mob-mode-sombre')?.addEventListener('click', function () {
    modeSombre = !modeSombre;
    this.classList.toggle('mob-filtre-chip--actif', modeSombre);
    if (overlayMode !== 'isolation' && overlayMode !== 'isolationVille') {
      carteOverlayPrincipale?.setOpacity(modeSombre ? 0.08 : 1);
    }
  });
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

// ─── Sheet calques (overlay + légende) ───────────────────────
function initSheetCalques() {
  document.getElementById('mob-calques-close')?.addEventListener('click', fermerSheetCalques);

  document.querySelectorAll('.mob-overlay-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === overlayMode) return;
      if (overlayMode === 'isolation') fermerIsolation();
      overlayMode = mode;
      puissancesMasquees.clear();
      paliersMasquesDensite.clear();
      paliersMasquesEsclavage.clear();
      document.querySelectorAll('.mob-overlay-item').forEach(b => b.classList.remove('mob-overlay-item--actif'));
      btn.classList.add('mob-overlay-item--actif');
      majLegende();
      renderZones();
      renderPins();
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
  sheetCalquesOuverte = false;
  sheet.classList.remove('mob-sheet-calques--ouverte');
  sheet.setAttribute('aria-hidden', 'true');
  cacherFondOverlay();
}

// ─── Sheet année ──────────────────────────────────────────────
function initSheetAnnee() {
  document.getElementById('mob-annee-close')?.addEventListener('click', fermerSheetAnnee);

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
// RENDU ZONES — identique à carte.js
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
      ouvrirPopupScenario(pin);
    });

    marker.addTo(carte);
    markersMap[pin.id] = marker;
  });
}

// ═══════════════════════════════════════════════════════════
// FONCTIONS RÉUTILISÉES TELLES QUELLES DEPUIS carte.js
// Les fonctions suivantes sont identiques et importées :
//   renderZones(), majWeightsZones(), fermerTooltipsOrphelins()
//   renderPins(), renderVilles(), majTailleIconesVilles()
//   ouvrirPanneau(), fermerPanneau(), ouvrirPanneauVille(), fermerPanneauVille()
//   zoomerVille(), fermerZoomVille(), isolerTerritoire(), fermerIsolation()
//   ouvrirLoupe(), fermerLoupe(), calculerPairesChevauchement()
//   ecarterVille(), rapprocherVille()
//   fermerPopup(), ouvrirPopupScenario()
//   afficherSuggestions(), surlignerMatch(), escapeHtml()
//   majLegende()
//   resoudre() [si présente dans carte-data.js]
//
// NOTE D'IMPLÉMENTATION :
// Ces fonctions sont chargées depuis carte-shared.js (fichier commun à créer
// en session suivante) OU dupliquées ici au besoin.
// Pour cette session initiale, on les adapte au contexte mobile
// uniquement sur les points qui diffèrent.
// ═══════════════════════════════════════════════════════════

// ─── Adaptation mobile : ouvrirPanneau ────────────────────────
// Sur desktop : injecte dans #carte-panneau (panneau droit fixe)
// Sur mobile  : injecte dans la sheet ville (bottom sheet)

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
  ouvrirSheetVille(contenu);
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
  ouvrirSheetVille(contenu);
}

function fermerPanneauVille() {
  if (villeActive) setIconeVilleActive(villeActive, false);
  villeActive = null;
  fermerSheetVille();
  fermerLoupe();
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
  fermerLoupe();
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
      if (overlayMode === 'isolationVille') {
        fermerZoomVille({ ouvrirVille: true });
        return;
      }
      if (overlayMode === 'isolation') return;
      fermerToutesSheets();
      const cluster = clustersChevauchement.find(c => c.ids.includes(ville.id));
      if (cluster) {
        ouvrirLoupe(ville.id, e.containerPoint);
        return;
      }
      if (villeActive === ville.id) {
        fermerPanneauVille();
      } else {
        ouvrirPanneauVille(ville.id);
      }
    });

    // Sur mobile, mouseover/mouseout remplacés par touchstart/touchend
    // L'écartement reste fonctionnel mais sans le timer mouseout
    marker.on('mouseover', () => {
      marker.openTooltip();
      Object.keys(markersVilles).forEach(id => {
        if (id !== ville.id && id !== villeActive && id !== isolationVilleId)
          setIconeVilleActive(id, false);
      });
      clearTimeout(mouseoutTimers[ville.id]);
      if (villeActive !== ville.id) setIconeVilleActive(ville.id, true);
      ecarterVille(ville.id);
      // Curseur loupe si cluster
      const elSurvol = marker.getElement();
      if (elSurvol) {
        const dansCluster = clustersChevauchement.some(c => c.ids.includes(ville.id));
        elSurvol.style.cursor = dansCluster ? 'zoom-in' : '';
      }
    });

    marker.on('mouseout', () => {
      marker.closeTooltip();
      let estDansUnePaire = false;
      for (const paire of pairesChevauchement) {
        if (paire.idA !== ville.id && paire.idB !== ville.id) continue;
        estDansUnePaire = true;
        const cle = `${paire.idA}:${paire.idB}`;
        clearTimeout(mouseoutTimers[cle]);
        mouseoutTimers[cle] = setTimeout(() => {
          if (villeActive !== ville.id) setIconeVilleActive(ville.id, false);
          if (villeActive !== ville.id) rapprocherVille(ville.id);
        }, 550);
      }
      if (!estDansUnePaire) {
        mouseoutTimers[ville.id] = setTimeout(() => {
          if (villeActive !== ville.id) setIconeVilleActive(ville.id, false);
        }, 550);
      }
    });

    marker.addTo(carte);
    markersVilles[ville.id] = marker;
  });

  calculerPairesChevauchement();
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
    const estIsole = overlayMode === 'isolationVille' && id === isolationVilleId;
    const estActive = !estIsole && villeActive === id;
    const estRang3 = (ville.rang ?? '1') === '3';
    marker.setIcon(L.divIcon({
      html: villeSVG(ville.type || 'ville', taille, estPirate, estIsole, estActive, estRang3),
      className: 'carte-ville',
      iconSize: [taille, taille],
      iconAnchor: [taille / 2, taille / 2],
    }));
  });
}

// ═══════════════════════════════════════════════════════════
// ISOLATION TERRITOIRE — adapté mobile
// (identique à carte.js sauf les refs aux éléments DOM desktop)
// ═══════════════════════════════════════════════════════════

function _restaurerModeNormal() {
  carteOverlayPrincipale?.setOpacity(modeSombre ? 0.08 : 1);
  // Réactiver boutons overlay mobile
  document.querySelectorAll('.mob-overlay-item').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('carte-isolation--disabled');
  });
  // Réactiver chips filtres
  document.querySelectorAll('.mob-filtre-chip').forEach(c => c.classList.remove('carte-isolation--disabled'));
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
  if (isolationLayer) { carte.removeLayer(isolationLayer); isolationLayer = null; }

  const j = JURIDICTIONS.find(j => j.id === juridictionId);
  const contours = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[juridictionId])
    ? ZONES_DATA[juridictionId]
    : (j?.zone?.length >= 3 ? [j.zone] : null);
  if (!contours) return;

  if (overlayMode !== 'isolation') overlayModeAvantIsolation = overlayMode;
  isolationJuridictionId = juridictionId;
  overlayMode = 'isolation';

  fermerPanneau();
  carteOverlayPrincipale.setOpacity(0.05);

  // Griser les chips filtres et overlay
  document.querySelectorAll('.mob-filtre-chip, .mob-overlay-item').forEach(el => {
    el.disabled = true;
    el.classList.add('carte-isolation--disabled');
  });

  majLegende();
  renderZones();
  Object.values(markersMap).forEach(m => m.setOpacity(0));
  Object.values(markersVilles).forEach(m => m.setOpacity(0));

  const latlngs = contours.map(pts => pts.map(([x, y]) => pixelToLatLng(x, y)));
  isolationLayer = L.polygon(latlngs, {
    color: '#ffffff', weight: 3, opacity: 0, fillOpacity: 0,
    interactive: false, pane: 'isolationContour',
  });
  isolationLayer.addTo(carte);

  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#ffffff', weight: 3, opacity: 1 });
  }, 50);
  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ color: '#e2c97e', weight: 4, opacity: 1 });
  }, 450);
  setTimeout(() => {
    if (isolationLayer) isolationLayer.setStyle({ opacity: 0 });
  }, 850);
  setTimeout(() => {
    if (!isolationLayer) return;
    carte.flyToBounds(isolationLayer.getBounds(), {
      padding: [40, 40], maxZoom: carte.getMinZoom() + 2, duration: 1.2,
    });
  }, 900);
  // Réafficher contour après flyTo via moveend (géré dans initCarte → carte.on('moveend'))
}

// ═══════════════════════════════════════════════════════════
// ISOLATION VILLE — adapté mobile
// ═══════════════════════════════════════════════════════════

function zoomerVille(villeId) {
  const ville = VILLES.find(v => v.id === villeId);
  if (!ville || !ville.coords) return;

  overlayModeAvantIsolation = overlayMode;
  fermerPanneau();
  overlayMode = 'isolationVille';
  isolationVilleId = villeId;

  carteOverlayPrincipale.setOpacity(0.05);

  // Griser contrôles
  document.querySelectorAll('.mob-filtre-chip, .mob-overlay-item, .mob-btn-flottant').forEach(el => {
    el.disabled = true;
    el.classList.add('carte-isolation--disabled');
  });

  majLegende();
  renderZones();
  // Masquer tous les marqueurs sauf la ville isolée
  Object.entries(markersMap).forEach(([, m]) => m.setOpacity(0));
  Object.entries(markersVilles).forEach(([id, m]) => {
    m.setOpacity(id === villeId ? 1 : 0);
  });

  const latlng = pixelToLatLng(ville.coords[0], ville.coords[1]);
  setTimeout(() => {
    carte.flyTo(latlng, Math.min(carte.getMaxZoom(), carte.getZoom() + 2), { duration: 1.0 });
  }, 100);

  setTimeout(() => ouvrirPanneauVille(villeId), 1200);
}

function fermerZoomVille(options = {}) {
  if (overlayMode !== 'isolationVille') return;

  overlayMode = overlayModeAvantIsolation;
  isolationVilleId = null;

  carteOverlayPrincipale.setOpacity(modeSombre ? 0.08 : 1);

  // Réactiver contrôles
  document.querySelectorAll('.mob-filtre-chip, .mob-overlay-item, .mob-btn-flottant').forEach(el => {
    el.disabled = false;
    el.classList.remove('carte-isolation--disabled');
  });

  majLegende();
  renderZones();
  renderPins();
  renderVilles();

  if (options.ouvrirVille && villeActive) ouvrirPanneauVille(villeActive);
}

// ═══════════════════════════════════════════════════════════
// LOUPE CARTOGRAPHIQUE — identique à carte.js
// ═══════════════════════════════════════════════════════════

const LOUPE_RAYON = 115;
const LOUPE_ZOOM = -0.6;

function fermerLoupe() {
  if (loupeInstance) { loupeInstance.remove(); loupeInstance = null; }
  const existante = document.getElementById('carte-loupe');
  if (existante) existante.remove();
}

function ouvrirLoupe(villeId, containerPoint) {
  fermerLoupe();

  const markerCible = markersVilles[villeId];
  if (!markerCible) return;
  const latlngCentre = markerCible.getLatLng();

  // Centroïde du cluster
  const cluster = clustersChevauchement.find(c => c.ids.includes(villeId));
  let latlngFocus = latlngCentre;
  if (cluster) {
    const membres = cluster.ids.map(id => markersVilles[id]?.getLatLng()).filter(Boolean);
    if (membres.length) {
      const latMoy = membres.reduce((s, ll) => s + ll.lat, 0) / membres.length;
      const lngMoy = membres.reduce((s, ll) => s + ll.lng, 0) / membres.length;
      latlngFocus = L.latLng(latMoy, lngMoy);
    }
  }

  // Créer le div loupe
  const carteWrap = document.getElementById('carte-wrap');
  if (!carteWrap) return;

  const diameter = LOUPE_RAYON * 2;
  const loupe = document.createElement('div');
  loupe.id = 'carte-loupe';
  loupe.style.width = diameter + 'px';
  loupe.style.height = diameter + 'px';
  loupe.style.left = containerPoint.x + 'px';
  loupe.style.top = containerPoint.y + 'px';
  carteWrap.appendChild(loupe);

  // Instance Leaflet secondaire
  loupeInstance = L.map(loupe, {
    crs: L.CRS.Simple,
    center: latlngFocus,
    zoom: LOUPE_ZOOM,
    zoomSnap: 0,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    tap: false,
    zoomControl: false,
    attributionControl: false,
  });

  const W = CARTE_IMAGE.width;
  const H = CARTE_IMAGE.height;
  L.imageOverlay(CARTE_IMAGE.src, [[0, 0], [H, W]]).addTo(loupeInstance);

  loupeInstance.whenReady(() => {
    const centrePx = loupeInstance.latLngToContainerPoint(latlngFocus);

    Object.entries(markersVilles).forEach(([id, m]) => {
      const ll = m.getLatLng();
      const px = loupeInstance.latLngToContainerPoint(ll);
      const dx = px.x - centrePx.x;
      const dy = px.y - centrePx.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > LOUPE_RAYON) return;

      const ville = VILLES.find(v => v.id === id);
      if (!ville) return;
      const taille = 36;
      const statutCapitale = Array.isArray(ville.capitale)
        ? rendreChamp(ville.capitale, anneeActive)
        : ville.capitale;
      const estPirate = statutCapitale === 'pirate';
      const estActive = villeActive === id;
      const estRang3 = (ville.rang ?? '1') === '3';

      const iconLoupe = L.divIcon({
        html: villeSVG(ville.type || 'ville', taille, estPirate, false, estActive, estRang3),
        className: 'carte-ville',
        iconSize: [taille, taille],
        iconAnchor: [taille / 2, taille / 2],
      });
      const markerLoupe = L.marker(ll, { icon: iconLoupe });

      markerLoupe.on('mouseover', () => {
        markerLoupe.setIcon(L.divIcon({
          html: villeSVG(ville.type || 'ville', taille, estPirate, false, true, estRang3),
          className: 'carte-ville', iconSize: [taille, taille], iconAnchor: [taille / 2, taille / 2],
        }));
      });
      markerLoupe.on('mouseout', () => {
        markerLoupe.setIcon(L.divIcon({
          html: villeSVG(ville.type || 'ville', taille, estPirate, false, estActive, estRang3),
          className: 'carte-ville', iconSize: [taille, taille], iconAnchor: [taille / 2, taille / 2],
        }));
      });
      markerLoupe.on('click', () => {
        if (villeActive === id) {
          fermerPanneauVille();
        } else {
          ouvrirPanneauVille(id);
        }
      });

      markerLoupe.addTo(loupeInstance);
    });
  });
}

// ═══════════════════════════════════════════════════════════
// CALCUL CHEVAUCHEMENT — identique à carte.js
// ═══════════════════════════════════════════════════════════

function calculerPairesChevauchement() {
  if (!carte || !carte._loaded) return;

  const ids = Object.keys(markersVilles);
  const SEUIL = 16;
  const voisins = {};
  ids.forEach(id => { voisins[id] = new Set(); });

  const pairesDetectees = [];

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const idA = ids[i], idB = ids[j];
      const mA = markersVilles[idA], mB = markersVilles[idB];
      if (!mA || !mB) continue;
      const ptA = carte.latLngToContainerPoint(mA.getLatLng());
      const ptB = carte.latLngToContainerPoint(mB.getLatLng());
      const dx = ptB.x - ptA.x, dy = ptB.y - ptA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < SEUIL) {
        const nx = dx / dist || 0, ny = dy / dist || 0;
        pairesDetectees.push({
          idA, idB, dist, vx: nx, vy: ny,
          latlngA: mA.getLatLng(), latlngB: mB.getLatLng()
        });
        voisins[idA].add(idB);
        voisins[idB].add(idA);
      }
    }
  }

  // DFS pour grouper les membres connexes
  const vus = new Set();
  const groupes = [];
  ids.forEach(id => {
    if (vus.has(id) || voisins[id].size === 0) return;
    const groupe = [];
    const pile = [id];
    while (pile.length) {
      const cur = pile.pop();
      if (vus.has(cur)) continue;
      vus.add(cur);
      groupe.push(cur);
      voisins[cur].forEach(v => { if (!vus.has(v)) pile.push(v); });
    }
    if (groupe.length >= 2) groupes.push(groupe);
  });

  pairesChevauchement = [];
  clustersChevauchement = [];

  groupes.forEach(groupe => {
    if (groupe.length === 2) {
      const p = pairesDetectees.find(
        p => (p.idA === groupe[0] && p.idB === groupe[1]) ||
          (p.idA === groupe[1] && p.idB === groupe[0])
      );
      if (p) pairesChevauchement.push(p);
    } else {
      clustersChevauchement.push({ ids: groupe });
    }
  });
}

// ═══════════════════════════════════════════════════════════
// ÉCARTEMENT ICÔNES — identique à carte.js
// ═══════════════════════════════════════════════════════════

function ecarterVille(villeId) {
  const CIBLE = 26;
  for (const paire of pairesChevauchement) {
    let vx = 0, vy = 0, autreId = null;
    if (paire.idA === villeId) { vx = -paire.vx; vy = -paire.vy; autreId = paire.idB; }
    else if (paire.idB === villeId) { vx = paire.vx; vy = paire.vy; autreId = paire.idA; }
    if (!autreId) continue;
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
    const dx = ptB.x - ptA.x, dy = ptB.y - ptA.y;
    const distActuelle = Math.sqrt(dx * dx + dy * dy);
    const amplitude = (CIBLE - distActuelle) / 2;
    if (amplitude <= 0) continue;
    const duree = Math.round(amplitude * 2 * 40);
    ecartementsActifs[cle] = {
      duree, dxA: vx * amplitude, dyA: vy * amplitude,
      dxB: -vx * amplitude, dyB: -vy * amplitude
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
  ouvrirSheetVille(contenu);
}

// ═══════════════════════════════════════════════════════════
// LÉGENDE MOBILE — dans mob-legende-inner (sheet calques)
// ═══════════════════════════════════════════════════════════

function majLegende() {
  const legende = document.getElementById('mob-legende-inner');
  if (!legende) return;
  legende.innerHTML = '';

  if (overlayMode === 'isolation' || overlayMode === 'isolationVille') {
    legende.innerHTML = `<p class="mob-legende-info">Tap sur la carte pour quitter l'isolation.</p>`;
    return;
  }

  if (overlayMode === 'masque') {
    legende.innerHTML = `<p class="mob-legende-info">Teatre de la Guerre en Amerique — Jaillot, Mortier & Sanson, 1708. <a href="https://www.davidrumsey.com" target="_blank" rel="noopener">David Rumsey Map Collection</a></p>`;
    return;
  }

  // Helper : crée un wrap légende (carré couleur + nom dessous)
  function _legendeItem(couleur, nom, masquee, onClick) {
    const wrap = document.createElement('div');
    wrap.className = 'mob-legende-wrap' + (masquee ? ' mob-legende-wrap--masquee' : '');
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
    [...puissancesVisibles].forEach(p => {
      const puissance = PUISSANCES[p];
      if (!puissance) return;
      const masquee = puissancesMasquees.has(p);
      legende.appendChild(_legendeItem(puissance.couleur, puissance.nom || p, masquee, () => {
        if (masquee) puissancesMasquees.delete(p); else puissancesMasquees.add(p);
        majLegende(); renderZones();
      }));
    });
    return;
  }

  if (overlayMode === 'densite') {
    const labels = ['< 0,05 hab/km²', '0,05–0,15', '0,15–0,5', '0,5–2', '2–8', '> 8'];
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
    const labels = ['< 10%', '10–25%', '25–40%', '40–60%', '60–80%', '> 80%'];
    ESCLAVAGE_PALIERS.forEach((palier, i) => {
      const masque = paliersMasquesEsclavage.has(i);
      legende.appendChild(_legendeItem(palier.ra, labels[i] + ' esclaves', masque, () => {
        if (masque) paliersMasquesEsclavage.delete(i); else paliersMasquesEsclavage.add(i);
        majLegende(); renderZones();
      }));
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
    return;
  }
}

// resoudre() est définie dans carte-data.js — pas besoin de stub ici.

function fermerTooltipsOrphelins() {
  carte?.eachLayer(l => { if (l.getTooltip?.() && l.isTooltipOpen?.()) l.closeTooltip(); });
}

