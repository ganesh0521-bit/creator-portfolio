/**
 * CINEMATIC GANYA | CREATOR PORTFOLIO
 * Main JavaScript: Navigation, Themes, Global UI State, Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileNav();
  initBackToTop();
  updateCartBadge();
  highlightActiveNavLink();
  updateCopyrightYear();
});

/* ==========================================================================
   Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const storedTheme = localStorage.getItem('cinematic_theme') || 'dark';

  // Apply stored theme
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcons(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cinematic_theme', newTheme);
      updateThemeIcons(newTheme);

      showToast('Theme Changed', `Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} cinematic mode.`, 'info');
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'ri-sun-line';
      } else {
        icon.className = 'ri-moon-line';
      }
    }
  });
}

/* ==========================================================================
   Sticky Header on Scroll
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('active');
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close menu when clicking link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  let backBtn = document.querySelector('.back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Scroll to top');
    backBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(title, message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'ri-information-line';
  if (type === 'success') iconClass = 'ri-checkbox-circle-line';
  if (type === 'warning') iconClass = 'ri-error-warning-line';
  if (type === 'error') iconClass = 'ri-close-circle-line';

  toast.innerHTML = `
    <i class="toast-icon ${iconClass}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <i class="ri-close-line toast-close"></i>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 350);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
}

// Make showToast accessible globally
window.showToast = showToast;

/* ==========================================================================
   Cart Badge Update
   ========================================================================== */
function updateCartBadge() {
  const badgeElements = document.querySelectorAll('.cart-count');
  try {
    const cart = JSON.parse(localStorage.getItem('cinematic_cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badgeElements.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  } catch (e) {
    console.error('Error reading cart state:', e);
  }
}
window.updateCartBadge = updateCartBadge;

/* ==========================================================================
   Highlight Active Navigation Link
   ========================================================================== */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   Update Copyright Year
   ========================================================================== */
function updateCopyrightYear() {
  const yearSpans = document.querySelectorAll('.current-year');
  const year = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = year;
  });
}
