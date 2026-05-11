/* ====================================================
   ILLUMINATION · Interactive manuscript behaviors
   ==================================================== */
(function () {
  'use strict';

  /* ---------- Page-turn transition on internal navigation ---------- */
  function initPageTurn() {
    const overlay = document.createElement('div');
    overlay.className = 'page-turn-overlay';
    document.body.appendChild(overlay);

    document.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      // Only intercept same-origin HTML links
      if (!/\.html($|[?#])|\/$/.test(href) && !href.endsWith('.html')) return;
      e.preventDefault();
      overlay.classList.add('turning');
      setTimeout(() => { window.location.href = href; }, 420);
    });
  }

  /* ---------- Scroll-growing vines ---------- */
  function initScrollVines() {
    const vines = document.querySelectorAll('.vine');
    if (!vines.length) return;
    vines.forEach(v => v.classList.add('grow'));
    let ticking = false;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Show at least 25% on load; fill to 100% as user scrolls through page.
      const progress = max > 200 ? Math.min(1, window.scrollY / max) : 1;
      const grow = Math.max(0.25, progress);
      vines.forEach(v => v.style.setProperty('--grow', grow.toFixed(3)));
      ticking = false;
    }
    update();
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- Init ---------- */
  function init() {
    initPageTurn();
    initScrollVines();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
