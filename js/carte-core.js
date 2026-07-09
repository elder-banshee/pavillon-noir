// ═══════════════════════════════════════════════════════════
// CARTE-CORE — Socle commun desktop / mobile
// Fonctions indépendantes du support : génération d'icônes SVG,
// couleurs d'overlay, normalisation de zones, labels/z-index.
// Chargé avant carte.js et carte-mobile.js (aucun des deux ne
// redéfinit ces fonctions). Ne contient aucune logique
// d'interaction UI (panneaux, sheets, gestes tactiles) : cette
// couche reste spécifique à chaque fichier plateforme.
//
// Fusionné en session 73, à partir de l'analyse Cowork
// (audit-pavillon-noir-09-07-2026.md, Tâche F) : 18 fonctions
// identiques + 6 quasi-identiques (divergences cosmétiques
// vérifiées une à une avant fusion). Les fonctions qui
// divergent réellement (initCarte, renderZones, renderVilles,
// majTailleIconesVilles, fermerPopup, normaliser) restent dans
// carte.js / carte-mobile.js : elles portent la vraie
// différence d'UX desktop/mobile, pas une duplication
// accidentelle.
// ═══════════════════════════════════════════════════════════

// ─── Fonctions identiques (fusion directe, aucune divergence) ──

function normaliserContourZone(contour) {
  if (Array.isArray(contour)) return { points: contour, fit: true };
  if (contour && Array.isArray(contour.points)) {
    return { points: contour.points, fit: contour.fit !== false };
  }
  return null;
}

function contoursZonePour(juridiction) {
  const source = (typeof ZONES_DATA !== 'undefined' && ZONES_DATA[juridiction.id])
    ? ZONES_DATA[juridiction.id]
    : (juridiction.zone && juridiction.zone.length >= 3 ? [juridiction.zone] : null);

  return source
    ? source.map(normaliserContourZone).filter(c => c && c.points.length >= 3)
    : null;
}

function contoursPourFit(contours) {
  const fit = contours.filter(c => c.fit !== false);
  return fit.length ? fit : contours;
}

function pixelToLatLng(x, y) {
  return L.latLng(CARTE_IMAGE.height - y, x);
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

function pinSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18S26 19 26 12c0-5.523-4.477-10-10-10z"
      fill="#c8973a" stroke="#0e0c09" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="4" fill="#0e0c09"/>
  </svg>`;
}

function navireSVG(taille = 36) {
  if (taille <= 24) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${taille}" height="${taille}">
      <circle cx="12" cy="12" r="10" fill="#0e0c09" stroke="#c8973a" stroke-width="1.7"/>
      <circle cx="8.8" cy="10" r="1.5" fill="#f2e8d5"/>
      <circle cx="15.2" cy="10" r="1.5" fill="#f2e8d5"/>
      <path d="M9 15c1.8 1 4.2 1 6 0" fill="none" stroke="#f2e8d5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7 18l10-10M17 18L7 8" stroke="#c8973a" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="${taille}" height="${taille}">
    <circle cx="18" cy="18" r="15" fill="#0e0c09" stroke="#c8973a" stroke-width="2"/>
    <path d="M7 23c5 3 17 3 22 0l-3.5 5.5h-15z" fill="#c8973a"/>
    <path d="M18 6.5v16" stroke="#f2e8d5" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 8.5l8.5 10H18z" fill="#f2e8d5"/>
    <path d="M18 11l-6.5 8H18z" fill="#e2b96a"/>
  </svg>`;
}

function pinCarteSVG(pin) {
  return pin?.type === 'navire' ? navireSVG(tailleIconeNavire()) : pinSVG();
}

function tailleIconeVille() {
  const zoom = carte.getZoom();
  if (zoom >= 1) return 60;
  if (zoom >= -1) return 36;
  return 24;
}

function tailleIconeNavire() {
  const zoom = carte.getZoom();
  if (zoom >= 1) return 56;
  if (zoom >= -1) return 40;
  return 24;
}

function zIndexMarqueurVille(ville) {
  const type = ville.type || 'ville';
  const rang = ville.rang ?? '1';
  if (rang === '3') return 100;
  if (type === 'site_geo' || type === 'site_hist') return 200;
  if (rang === '2') return 300;
  return 400;
}

function zIndexMarqueurPin(pin) {
  return pin?.type === 'navire' ? 600 : 500;
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

// ─── Fonctions harmonisées (divergences mineures résolues) ─────

function lireTranslate3d(el) {
  // Extrait le translate3d Leaflet de style.transform
  if (!el) return 'translate3d(0px,0px,0px)';
  const m = el.style.transform.match(/translate3d\([^)]+\)/);
  return m ? m[0] : 'translate3d(0px,0px,0px)';
}

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
        <path d="M87.22,20.9l-11,16.52L51.87,.9.93,77.3H124.82Z" fill="${estIsole ? 'none' : couleurTrait}" stroke="${couleurTrait}" stroke-width="${estIsole ? '8' : '1.2'}"/>
      </g>
      <g transform="translate(4.85,9.12) scale(0.18)">
        <polygon points="38.44 20.9 65.14 20.9 51.74 0.9 38.44 20.9" fill="${estIsole ? couleurTrait : couleurNeige}" stroke="${couleurTrait}" stroke-width="${estIsole ? '0' : '1.2'}"/>
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

