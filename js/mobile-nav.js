// ═══════════════════════════════════════════════════════════
// MOBILE NAV — Bouton flottant + panneau de navigation
// ═══════════════════════════════════════════════════════════

(function () {

  if (window.innerWidth > 640) return;

  const NAV_LINKS = [
    { label: 'Accueil',      href: 'index.html'    },
    { label: 'Registre',     href: 'pnj.html'      },
    { label: 'Équipage',     href: 'equipage.html' },
  ];

  const wrapper = document.createElement('div');
  wrapper.id = 'mob-nav-wrapper';
  wrapper.innerHTML = `
    <div id="mob-nav-panel" aria-hidden="true">
      <ul id="mob-nav-links">
        ${NAV_LINKS.map(l =>
          `<li><a href="${l.href}">${l.label}</a></li>`
        ).join('')}
        <li><button id="mob-nav-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑ Haut de page</button></li>
      </ul>
    </div>
    <button id="mob-nav-btn" aria-label="Navigation" aria-expanded="false">
      <span id="mob-nav-icon">⚓</span>
    </button>
  `;
  document.body.appendChild(wrapper);

  const btn   = document.getElementById('mob-nav-btn');
  const panel = document.getElementById('mob-nav-panel');
  let   open  = false;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    open = !open;
    btn.setAttribute('aria-expanded', open);
    panel.setAttribute('aria-hidden', !open);
    wrapper.classList.toggle('mob-nav--open', open);
  });

  document.addEventListener('click', (e) => {
    if (open && !wrapper.contains(e.target)) {
      open = false;
      btn.setAttribute('aria-expanded', false);
      panel.setAttribute('aria-hidden', true);
      wrapper.classList.remove('mob-nav--open');
    }
  });

  const SCROLL_THRESHOLD = 200;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      wrapper.classList.add('mob-nav--visible');
    } else {
      wrapper.classList.remove('mob-nav--visible');
      if (open) {
        open = false;
        btn.setAttribute('aria-expanded', false);
        panel.setAttribute('aria-hidden', true);
        wrapper.classList.remove('mob-nav--open');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();
