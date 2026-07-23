/**
 * ALBA TRADING CO., LTD — Main Entry Point
 * Initializes all JS modules and global interactions
 * www.albatradingmm.com
 */

import { initNavigation } from './navigation.js';
import { initLanguage    } from './language.js';
import { initInquiry     } from './inquiry.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initLanguage();
  initInquiry();
  initScrollAnimations();
  initCounters();
  initBackToTop();
  initGallery();
  initLightbox();
});

/* ========================
   SCROLL ANIMATIONS
   ======================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ========================
   STAT COUNTERS
   ======================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-counter'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = prefix + value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ========================
   BACK TO TOP
   ======================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================
   PRODUCT GALLERY
   ======================== */
function initGallery() {
  const galleryMain = document.getElementById('gallery-main');
  if (!galleryMain) return;

  document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      // Update main image
      const src = thumb.querySelector('img')?.src || '';
      const alt = thumb.querySelector('img')?.alt || '';
      const mainImg = galleryMain.querySelector('img');
      if (mainImg && src) {
        mainImg.src = src;
        mainImg.alt = alt;
      }
      // Update active thumb
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      // Update lightbox data
      if (galleryMain) galleryMain.setAttribute('data-lightbox-src', src);
    });
  });

  // Set first thumb active
  document.querySelector('.gallery-thumb')?.classList.add('active');
}

/* ========================
   LIGHTBOX
   ======================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox) return;

  // Open on main gallery click
  const galleryMain = document.getElementById('gallery-main');
  galleryMain?.addEventListener('click', () => {
    const src = galleryMain.querySelector('img')?.src || galleryMain.getAttribute('data-lightbox-src');
    const alt = galleryMain.querySelector('img')?.alt || '';
    if (src && lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // Close handlers
  const closeBtn = document.getElementById('lightbox-close');
  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ========================
   SMOOTH ANCHOR SCROLL
   ======================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
