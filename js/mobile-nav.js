// ═══════════════════════════════════════════════════════════
// MOBILE NAV — Bouton flottant + panneau de navigation
// ═══════════════════════════════════════════════════════════

(function () {

  if (window.innerWidth > 640) return;
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') return;

  const NAV_LINKS = [
    { label: 'Accueil',      href: 'index.html'    },
    { label: 'Registre',     href: 'pnj.html'      },
    { label: 'Équipage',     href: 'equipage.html' },
  ];

  const ICON_CLOSED = '⚓';  // remplacer par SVG coffre fermé
  const ICON_OPEN   = '⛵';  // remplacer par SVG coffre ouvert

  const wrapper = document.createElement('div');
  wrapper.id = 'mob-nav-wrapper';
  wrapper.innerHTML = `
    <div id="mob-nav-panel" aria-hidden="true">
      <ul id="mob-nav-links">
        ${NAV_LINKS.map(l => {
            const isActive = window.location.pathname.endsWith(l.href);
            return `<li><a href="${l.href}"${isActive ? ' class="mob-nav--active"' : ''}>${l.label}</a></li>`;
        }).join('')}
        <li><button id="mob-nav-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑ Haut de page</button></li>
      </ul>
    </div>
    <button id="mob-nav-btn" aria-label="Navigation" aria-expanded="false">
      <span id="mob-nav-icon">${ICON_CLOSED}</span>
    </button>
  `;
  document.body.appendChild(wrapper);

  const btn   = document.getElementById('mob-nav-btn');
  const panel = document.getElementById('mob-nav-panel');
  let   open  = false;

  // ─── Toggle panneau ───────────────────────────────────────
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    open = !open;
    btn.setAttribute('aria-expanded', open);
    panel.setAttribute('aria-hidden', !open);
    wrapper.classList.toggle('mob-nav--open', open);
    document.getElementById('mob-nav-icon').innerHTML = open ? ICON_OPEN : ICON_CLOSED;
    // Panneau ouvert : annule le timer de disparition
    if (open) cancelHide();
  });

  document.addEventListener('click', (e) => {
    if (open && !wrapper.contains(e.target)) {
      open = false;
      btn.setAttribute('aria-expanded', false);
      panel.setAttribute('aria-hidden', true);
      wrapper.classList.remove('mob-nav--open');
      // Panneau fermé : relance le timer
      scheduleHide();
    }
  });

  // ─── Logique d'apparition / disparition ──────────────────
  const SCROLL_INITIAL  = 200;   // seuil première apparition (px depuis le haut)
  const SCROLL_DELTA    = 150;   // déplacement pour réapparition (px)
  const HIDE_DELAY      = 3000;  // délai avant disparition (ms)

  let hideTimer      = null;
  let lastScrollY    = window.scrollY;
  let scrolledSince  = 0;       // cumul de déplacement depuis dernière apparition
  let everShown      = false;   // a-t-on déjà montré le bouton ?

  function show() {
    wrapper.classList.add('mob-nav--visible');
    scrolledSince = 0;
    if (!open) scheduleHide();
  }

  function hide() {
    if (open) return; // ne pas cacher si panneau déployé
    wrapper.classList.remove('mob-nav--visible');
    // Referme le panneau au cas où
    open = false;
    btn.setAttribute('aria-expanded', false);
    panel.setAttribute('aria-hidden', true);
    wrapper.classList.remove('mob-nav--open');
  }

  function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(hide, HIDE_DELAY);
  }

  function cancelHide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  function onScroll() {
    const current = window.scrollY;
    const delta   = Math.abs(current - lastScrollY);
    lastScrollY   = current;

    // Première apparition : seuil de position absolue
    if (!everShown && current > SCROLL_INITIAL) {
      everShown = true;
      show();
      return;
    }

    // Réapparition : cumul de déplacement depuis la dernière apparition
    if (everShown) {
      scrolledSince += delta;
      if (scrolledSince >= SCROLL_DELTA) {
        show(); // réinitialise scrolledSince et relance le timer
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

})();
