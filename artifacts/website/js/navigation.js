/**
 * ALBA TRADING CO., LTD — Navigation Module
 * Sticky nav, mobile menu, dropdown, active state
 */

export function initNavigation() {
  const nav = document.getElementById('site-nav');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');

  if (!nav) return;

  /* ---- Sticky scroll behavior ---- */
  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Mobile menu toggle ---- */
  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileOverlay.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on overlay link click
    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileOverlay?.classList.add('open');
    mobileToggle?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('open');
    mobileToggle?.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  /* ---- Active nav link ---- */
  setActiveNavLink();

  /* ---- Mobile sub-menu toggles ---- */
  const mobileProductsToggle = document.getElementById('mobile-products-toggle');
  const mobileSubLinks = document.getElementById('mobile-sub-links');

  if (mobileProductsToggle && mobileSubLinks) {
    mobileProductsToggle.addEventListener('click', () => {
      const isOpen = mobileSubLinks.style.display === 'flex';
      mobileSubLinks.style.display = isOpen ? 'none' : 'flex';
      mobileProductsToggle.querySelector('.toggle-arrow')?.classList.toggle('rotated', !isOpen);
    });
  }
}

function setActiveNavLink() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Home page
    if ((path === '/' || path === '/index.html') && (href === '/' || href === '/index.html')) {
      link.classList.add('active');
      return;
    }

    // Contact
    if (path.includes('contact') && href.includes('contact')) {
      link.classList.add('active');
      return;
    }

    // Products
    if (path.includes('/products/') && href.includes('/products/')) {
      const pathSegment = path.split('/').pop();
      const hrefSegment = href.split('/').pop();
      if (pathSegment === hrefSegment) link.classList.add('active');
      return;
    }
  });

  // Highlight Products nav item if on any product page
  if (path.includes('/products/')) {
    document.querySelectorAll('.nav-dropdown-trigger').forEach(el => {
      el.classList.add('active');
    });
  }
}
