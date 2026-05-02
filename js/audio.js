// ═══════════════════════════════════════════════════════════
// AUDIO — Accompagnement sonore ambiant
// ═══════════════════════════════════════════════════════════
//
// ┌─ Pour activer : passer AUDIO_ENABLED à true
// └─ Pour désactiver : passer AUDIO_ENABLED à false
//    → ni popup, ni bouton, ni lecture
//
const AUDIO_ENABLED = false;

// ─── Configuration ───────────────────────────────────────────
const AUDIO_FADE_DURATION = 1500;  // ms pour le fondu enchaîné
const AUDIO_VOLUME        = 0.35;  // volume cible (0–1)
const STORAGE_KEY         = 'pn-audio-preference'; // localStorage

// ─── État interne ────────────────────────────────────────────
let currentAudio  = null;  // HTMLAudioElement actif
let currentSrc    = null;  // src en cours de lecture
let userPref      = null;  // 'on' | 'off' | null (pas encore demandé)
let muteBtn       = null;  // référence au bouton dans la nav

// ─── Point d'entrée — appelé par chaque page ─────────────────
// src     : chemin vers le fichier audio (ex: 'ost/registre.mp3')
// srcList : optionnel, objet { scrollLeft → src } pour les chroniques
function audioInit(src, srcList = null) {
  if (!AUDIO_ENABLED) return;

  userPref = localStorage.getItem(STORAGE_KEY);

  injectMuteButton();

  if (userPref === null) {
    // Première visite : afficher la popup
    showAudioPopup(src, srcList);
  } else if (userPref === 'on') {
    // Préférence connue : démarrer
    playTrack(src);
    if (srcList) listenScroll(srcList);
  }
  // Si 'off' : ne rien faire, le bouton mute est là pour changer d'avis
}

// ─── Popup première visite ───────────────────────────────────
function showAudioPopup(src, srcList) {
  const popup = document.createElement('div');
  popup.className = 'audio-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'Accompagnement sonore');
  popup.innerHTML = `
    <span class="audio-popup-text">
      Ce site propose un accompagnement sonore d'ambiance.
    </span>
    <div class="audio-popup-actions">
      <button class="audio-popup-btn audio-popup-btn--yes">Activer</button>
      <button class="audio-popup-btn audio-popup-btn--no">Non merci</button>
    </div>`;

  document.body.appendChild(popup);

  // Entrée en fondu
  requestAnimationFrame(() => popup.classList.add('audio-popup--visible'));

  popup.querySelector('.audio-popup-btn--yes').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'on');
    userPref = 'on';
    dismissPopup(popup);
    playTrack(src);
    if (srcList) listenScroll(srcList);
    updateMuteBtn();
  });

  popup.querySelector('.audio-popup-btn--no').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'off');
    userPref = 'off';
    dismissPopup(popup);
    updateMuteBtn();
  });
}

function dismissPopup(popup) {
  popup.classList.remove('audio-popup--visible');
  popup.addEventListener('transitionend', () => popup.remove(), { once: true });
}

// ─── Lecture et fondu enchaîné ───────────────────────────────
function playTrack(src) {
  if (!src || src === currentSrc) return;

  const next = new Audio(src);
  next.loop   = true;
  next.volume = 0;

  next.play().catch(() => {
    // Autoplay bloqué — l'utilisateur devra interagir d'abord
    // On stocke la piste pour la jouer au premier clic
    document.addEventListener('click', () => playTrack(src), { once: true });
  });

  if (currentAudio) {
    fadeOut(currentAudio, () => { currentAudio.pause(); currentAudio = null; });
  }

  fadeIn(next);
  currentAudio = next;
  currentSrc   = src;
}

function fadeIn(audio) {
  const steps    = 30;
  const interval = AUDIO_FADE_DURATION / steps;
  const delta    = AUDIO_VOLUME / steps;
  let   step     = 0;
  const timer = setInterval(() => {
    step++;
    audio.volume = Math.min(AUDIO_VOLUME, audio.volume + delta);
    if (step >= steps) clearInterval(timer);
  }, interval);
}

function fadeOut(audio, onDone) {
  const steps    = 20;
  const interval = AUDIO_FADE_DURATION / steps;
  const delta    = audio.volume / steps;
  let   step     = 0;
  const timer = setInterval(() => {
    step++;
    audio.volume = Math.max(0, audio.volume - delta);
    if (step >= steps) { clearInterval(timer); onDone && onDone(); }
  }, interval);
}

// ─── Détection scroll (chroniques) ───────────────────────────
// srcList : tableau ordonné de { id, src } correspondant aux cartes visibles
function listenScroll(srcList) {
  const wrap = document.getElementById('chrono-piste-wrap');
  if (!wrap || !srcList.length) return;

  let lastId = null;

  function detectCurrent() {
    const wrapRect   = wrap.getBoundingClientRect();
    const centerX    = wrapRect.left + wrapRect.width / 2;
    const cartes     = wrap.querySelectorAll('.chrono-carte');
    let   closest    = null;
    let   closestDist = Infinity;

    cartes.forEach(carte => {
      const rect = carte.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < closestDist) { closestDist = dist; closest = carte; }
    });

    if (!closest) return;
    const id = closest.dataset.id;
    if (id === lastId) return;
    lastId = id;

    const entry = srcList.find(e => e.id === id);
    if (entry && entry.src) playTrack(entry.src);
  }

  wrap.addEventListener('scroll', detectCurrent, { passive: true });
  detectCurrent(); // lecture immédiate à l'ouverture
}

// ─── Bouton mute dans la nav ─────────────────────────────────
function injectMuteButton() {
  const nav = document.querySelector('nav');
  if (!nav || nav.querySelector('.audio-mute-btn')) return;

  muteBtn = document.createElement('button');
  muteBtn.className   = 'audio-mute-btn';
  muteBtn.setAttribute('aria-label', 'Activer / couper le son');
  muteBtn.innerHTML   = iconMute(userPref === 'on');

  muteBtn.addEventListener('click', toggleMute);
  nav.appendChild(muteBtn);
}

function toggleMute() {
  if (userPref === 'on') {
    userPref = 'off';
    localStorage.setItem(STORAGE_KEY, 'off');
    if (currentAudio) fadeOut(currentAudio, () => {
      currentAudio.pause();
      currentAudio = null;
      currentSrc   = null;
    });
  } else {
    userPref = 'on';
    localStorage.setItem(STORAGE_KEY, 'on');
    // Relancer la piste de la page — chaque page expose window.AUDIO_PAGE_SRC
    if (window.AUDIO_PAGE_SRC) playTrack(window.AUDIO_PAGE_SRC);
  }
  updateMuteBtn();
}

function updateMuteBtn() {
  if (muteBtn) muteBtn.innerHTML = iconMute(userPref === 'on');
}

function iconMute(active) {
  // Icône onde sonore (actif) ou onde barrée (muet)
  return active
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
       </svg>`;
}
