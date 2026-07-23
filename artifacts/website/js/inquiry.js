/**
 * ALBA TRADING CO., LTD — Inquiry & Contact Module
 * Form validation, submission handling, contact links
 */

const PHONE_PRIMARY  = '959775332660';
const PHONE_NUMBERS  = ['+959 775 332 660', '+959 889 356 454', '+959 940 666 222'];
const EMAIL_ADDRESS  = 'INFO@ALBATRADINGMM.COM';
const WA_DEFAULT_MSG = 'Hello AlbA Trading, I am interested in your construction materials. Please send me wholesale pricing information.';
const VIBER_NUMBER   = '959775332660';
const TELEGRAM_USER  = 'AlbaTradingMM'; // Update with actual Telegram handle

export function initInquiry() {
  initContactLinks();
  initForms();
}

/* ========================
   CONTACT LINK HANDLERS
   ======================== */
function initContactLinks() {
  // WhatsApp links
  document.querySelectorAll('[data-action="whatsapp"]').forEach(el => {
    const msg = el.getAttribute('data-msg') || WA_DEFAULT_MSG;
    el.href = `https://wa.me/${PHONE_PRIMARY}?text=${encodeURIComponent(msg)}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Viber links
  document.querySelectorAll('[data-action="viber"]').forEach(el => {
    el.href = `viber://chat?number=%2B${VIBER_NUMBER}`;
  });

  // Telegram links
  document.querySelectorAll('[data-action="telegram"]').forEach(el => {
    el.href = `https://t.me/${TELEGRAM_USER}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Email links
  document.querySelectorAll('[data-action="email"]').forEach(el => {
    const subject = el.getAttribute('data-subject') || 'Wholesale Inquiry - AlbA Trading';
    el.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}`;
  });

  // Phone links
  document.querySelectorAll('[data-action="call"]').forEach(el => {
    el.href = `tel:+${PHONE_PRIMARY}`;
  });
}

/* ========================
   FORM VALIDATION & SUBMIT
   ======================== */
function initForms() {
  document.querySelectorAll('[data-form="inquiry"]').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
    // Live validation
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('has-error')) {
          validateField(input);
        }
      });
    });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  let isValid = true;

  // Validate all required fields
  form.querySelectorAll('[required]').forEach(input => {
    if (!validateField(input)) isValid = false;
  });

  if (!isValid) return;

  // Collect form data
  const data = {};
  const formData = new FormData(form);
  formData.forEach((val, key) => { data[key] = val; });

  // Build email body for mailto fallback
  const emailSubject = `Wholesale Inquiry — ${data.product || 'Construction Materials'}`;
  const emailBody = buildEmailBody(data);
  const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Show success state
  showFormSuccess(form);

  // Open mailto after short delay
  setTimeout(() => { window.location.href = mailtoLink; }, 400);
}

function validateField(input) {
  const group = input.closest('.form-group');
  if (!group) return true;

  const errorEl = group.querySelector('.form-error');
  const val = input.value.trim();
  let msg = '';

  if (input.hasAttribute('required') && !val) {
    msg = getRequiredMessage(input);
  } else if (input.type === 'email' && val && !isValidEmail(val)) {
    msg = 'Please enter a valid email address.';
  } else if (input.type === 'tel' && val && !isValidPhone(val)) {
    msg = 'Please enter a valid phone number.';
  }

  group.classList.toggle('has-error', !!msg);
  if (errorEl) errorEl.textContent = msg;
  return !msg;
}

function getRequiredMessage(input) {
  const label = input.closest('.form-group')?.querySelector('.form-label')?.textContent?.replace('*','').trim();
  return `${label || 'This field'} is required.`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{8,}$/.test(phone);
}

function buildEmailBody(data) {
  const lines = [
    '=== WHOLESALE INQUIRY ===',
    `Company: ${data.company || 'N/A'}`,
    `Name: ${data.name || 'N/A'}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Email: ${data.email || 'N/A'}`,
    `Product Interest: ${data.product || 'N/A'}`,
    `Quantity: ${data.quantity || 'N/A'}`,
    '',
    'Message:',
    data.message || 'N/A',
    '',
    '=========================',
    `Sent from: ${window.location.href}`,
    `Date: ${new Date().toLocaleString()}`,
  ];
  return lines.join('\n');
}

function showFormSuccess(form) {
  const successEl = form.parentElement?.querySelector('.form-success');
  if (successEl) {
    form.style.display = 'none';
    successEl.classList.add('show');
  }
}

/* ========================
   PHONE NUMBER CLICK-TO-CALL
   ======================== */
export function getWhatsAppLink(msg = WA_DEFAULT_MSG) {
  return `https://wa.me/${PHONE_PRIMARY}?text=${encodeURIComponent(msg)}`;
}
