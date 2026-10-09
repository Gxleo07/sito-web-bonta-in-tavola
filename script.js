/* ============================================
   BONTÀ IN TAVOLA – JAVASCRIPT OTTIMIZZATO (120 FPS)
   ============================================ */

// ──────────────────────────────────────────────
// 0. COOKIE BANNER & GESTIONE PREFERENZE
// ──────────────────────────────────────────────
function setCookieConsent(level) {
  localStorage.setItem('cookieConsent', level);
  localStorage.setItem('cookieConsentDate', new Date().toISOString());
  hideCookieBanner();
}

function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('visible');
    banner.classList.add('hidden');
  }
}

function openCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.classList.add('visible');
  }
}

function initCookieBanner() {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
      setTimeout(() => banner.classList.add('visible'), 600);
    }
  }
}

document.addEventListener('DOMContentLoaded', initCookieBanner);

// ──────────────────────────────────────────────
// 1. NAVBAR & MENU MOBILE FLUIDO
// ──────────────────────────────────────────────
const navbar         = document.getElementById('navbar');
const hamburger      = document.getElementById('hamburger');
const navLinks       = document.getElementById('navLinks');
const navOverlay     = document.getElementById('navOverlay');
const navMobileClose = document.getElementById('navMobileClose');

function openMenu() {
  if (hamburger) {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  if (navLinks) {
    navLinks.classList.add('open');
  }
  if (navOverlay) {
    navOverlay.classList.add('open');
  }
  document.body.classList.add('menu-open');
}

function closeMenu() {
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (navLinks) {
    navLinks.classList.remove('open');
  }
  if (navOverlay) {
    navOverlay.classList.remove('open');
  }
  document.body.classList.remove('menu-open');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks && navLinks.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (navMobileClose) {
  navMobileClose.addEventListener('click', closeMenu);
}

if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ──────────────────────────────────────────────
// 2. SCROLL AD ALTE PRESTAZIONI (ZERO REPAINT / ZERO REFLOW)
// ──────────────────────────────────────────────
let isNavbarScrolled = false;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 30;
  if (scrolled !== isNavbarScrolled) {
    isNavbarScrolled = scrolled;
    if (navbar) {
      navbar.classList.toggle('scrolled', isNavbarScrolled);
    }
  }
}, { passive: true });

// ──────────────────────────────────────────────
// 3. EVIDENZIAZIONE LINK ATTIVO CON INTERSECTION OBSERVER (OFF-THREAD)
// ──────────────────────────────────────────────
const navLinksMap = new Map();
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinksMap.set(href.slice(1), link);
  }
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksMap.forEach((link, linkId) => {
        link.classList.toggle('active', linkId === id);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
});

document.querySelectorAll('section[id]').forEach(sec => {
  sectionObserver.observe(sec);
});

// ──────────────────────────────────────────────
// 4. SCROLL REVEAL LEGGERO (IntersectionObserver)
// ──────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.section-header, .story-block, .info-block, .gold-frame-wrap, .social-btn, .negozio-card, .gastronomia-banner-glass-card, .gastronomia-center-card, .gastronomia-img-frame'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 3) * 0.05}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ──────────────────────────────────────────────
// 5. SMOOTH SCROLL NATIVO CON RISPETTO DI SCROLL-MARGIN-TOP
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
