/* ============================================
   Josh & Ashley's Wedding - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ---------- Countdown Timer ----------
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const weddingDate = new Date('2026-11-13T16:00:00').getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = weddingDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<p style="color:var(--gold);font-family:var(--font-heading);font-size:2rem;">Today is the day!</p>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEl.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${hours}</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${minutes}</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${seconds}</span>
          <span class="countdown-label">Seconds</span>
        </div>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // ---------- Bridal Party Sidebar Toggle (Mobile) ----------
  const sidebarToggle = document.querySelector('.bp-sidebar-toggle');
  const sidebar = document.querySelector('.bp-sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking main content on mobile
    const bpMain = document.querySelector('.bp-main');
    if (bpMain) {
      bpMain.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }
  }

  // ---------- To-Do Filters ----------
  document.querySelectorAll('.todo-filter').forEach(filter => {
    filter.addEventListener('click', () => {
      const group = filter.dataset.group;
      const value = filter.dataset.value;

      // Toggle active in this group
      document.querySelectorAll(`.todo-filter[data-group="${group}"]`).forEach(f => {
        f.classList.remove('active');
      });
      filter.classList.add('active');

      // Filter table rows
      const rows = document.querySelectorAll('.todo-row');
      rows.forEach(row => {
        let showStatus = true;
        let showPerson = true;

        const activeStatus = document.querySelector('.todo-filter[data-group="status"].active');
        const activePerson = document.querySelector('.todo-filter[data-group="person"].active');

        if (activeStatus && activeStatus.dataset.value !== 'all') {
          showStatus = row.dataset.status === activeStatus.dataset.value;
        }

        if (activePerson && activePerson.dataset.value !== 'all') {
          showPerson = row.dataset.assignee && row.dataset.assignee.toLowerCase().includes(activePerson.dataset.value.toLowerCase());
        }

        row.style.display = (showStatus && showPerson) ? '' : 'none';
      });
    });
  });

  // ---------- Active Nav Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .bp-sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll Fade-in ----------
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
