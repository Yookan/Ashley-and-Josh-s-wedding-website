/* ============================================
   Bridal Party Password Protection
   ============================================ */

(function() {
  const CORRECT_PASSWORD = 'enchantedforest2026';
  const AUTH_KEY = 'bp_authenticated';

  // Check if we're on a bridal party page (not the login page)
  const isLoginPage = window.location.pathname.includes('login.html');
  const isBridalPage = window.location.pathname.includes('bridal-party');

  // If on a protected page and not authenticated, redirect to login
  if (isBridalPage && !isLoginPage) {
    if (sessionStorage.getItem(AUTH_KEY) !== 'true') {
      window.location.href = 'login.html';
    }
  }

  // If on login page and already authenticated, redirect to dashboard
  if (isLoginPage && sessionStorage.getItem(AUTH_KEY) === 'true') {
    window.location.href = 'dashboard.html';
  }

  // Handle login form submission
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('bp-password').value;
        const errorMsg = document.querySelector('.error-msg');

        if (password === CORRECT_PASSWORD) {
          sessionStorage.setItem(AUTH_KEY, 'true');
          window.location.href = 'dashboard.html';
        } else {
          errorMsg.classList.add('show');
          document.getElementById('bp-password').value = '';
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
      });
    }
  });
})();
