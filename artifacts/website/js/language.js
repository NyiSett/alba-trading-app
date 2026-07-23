/**
 * ALBA TRADING CO., LTD — Language Module
 * English / Myanmar bilingual toggle
 * Uses data-en / data-my attributes for content switching
 */

const LANG_KEY = 'alba-lang';
const SUPPORTED = ['en', 'my'];

export function initLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  const browserLang = navigator.language?.startsWith('my') ? 'my' : 'en';
  const lang = SUPPORTED.includes(saved) ? saved : browserLang;
  applyLanguage(lang, false);

  /* ---- Bind toggle buttons ---- */
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-lang-btn');
      applyLanguage(target, true);
    });
  });

  /* ---- Expose globally for inline onclick ---- */
  window.setLanguage = (lang) => applyLanguage(lang, true);
}

function applyLanguage(lang, save = true) {
  if (!SUPPORTED.includes(lang)) return;
  if (save) localStorage.setItem(LANG_KEY, lang);

  /* ---- Update html lang attribute ---- */
  document.documentElement.lang = lang === 'my' ? 'my' : 'en';

  /* ---- Body class for font switching ---- */
  document.body.classList.toggle('lang-myanmar', lang === 'my');

  /* ---- Swap all data-en / data-my elements ---- */
  const attr = `data-${lang}`;
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(attr) || el.getAttribute('data-en');
    if (text) {
      // Handle input placeholders
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    }
  });

  /* ---- Swap option values in selects ---- */
  document.querySelectorAll('option[data-en]').forEach(opt => {
    const text = opt.getAttribute(attr) || opt.getAttribute('data-en');
    if (text) opt.textContent = text;
  });

  /* ---- Update toggle button active state ---- */
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
  });

  /* ---- Legacy id-based buttons ---- */
  const enBtn = document.getElementById('lang-en');
  const myBtn = document.getElementById('lang-my');
  if (enBtn) enBtn.classList.toggle('active', lang === 'en');
  if (myBtn) myBtn.classList.toggle('active', lang === 'my');

  /* ---- Dispatch event for any listeners ---- */
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

export function getCurrentLanguage() {
  return localStorage.getItem(LANG_KEY) || 'en';
}
