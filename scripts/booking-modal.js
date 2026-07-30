/**
 * Audit booking modal – shared.
 * Security: only publishable anon key from public-config; lead via Edge Function;
 * honeypot #bm-website; generic error copy; Cal.com opens without form PII in URL.
 * Fields: name, email, phone, inquiry_volume (slider).
 */
(function () {
  'use strict';

  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';
  var CAL_URL = cfg.calComUrl || '';

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.error('RAIS: scripts/public-config.js fehlt. npm run config ausführen.');
    return;
  }

  var modal = document.getElementById('booking-modal');
  if (!modal) return;

  var backdrop = document.getElementById('bm-backdrop');
  var closeBtn = document.getElementById('bm-close');
  var steps = [0, 1, 2].map(function (i) { return document.getElementById('bm-step-' + i); });
  var dots = document.querySelectorAll('.bm-dot');
  var volumeEl = document.getElementById('bm-volume');
  var volumeDisplay = document.getElementById('bm-volume-display');

  var state = {
    step: 0,
    name: '',
    email: '',
    phone: '',
    inquiry_volume: 80,
    icp_segment: null,
    source: null,
    bookingLinkShown: false,
    openedAt: 0
  };

  function syncVolumeUI() {
    if (!volumeEl) return;
    var value = parseInt(volumeEl.value, 10);
    if (!isFinite(value) || value < 0) value = 0;
    if (value > 300) value = 300;
    state.inquiry_volume = value;
    volumeEl.setAttribute('aria-valuenow', String(value));
    if (volumeDisplay) volumeDisplay.textContent = String(value);
    var pct = (value / 300) * 100;
    volumeEl.style.setProperty('--bm-slider-pct', pct + '%');
  }

  function resetModalState() {
    state.step = 0;
    state.name = '';
    state.email = '';
    state.phone = '';
    state.inquiry_volume = 80;
    state.icp_segment = null;
    state.source = null;
    state.bookingLinkShown = false;
    state.openedAt = Date.now();
    var nameEl = document.getElementById('bm-name');
    var emailEl = document.getElementById('bm-email');
    var phoneEl = document.getElementById('bm-phone');
    var privacyEl = document.getElementById('bm-privacy');
    var websiteEl = document.getElementById('bm-website');
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (privacyEl) privacyEl.checked = false;
    if (websiteEl) websiteEl.value = '';
    if (volumeEl) volumeEl.value = '80';
    syncVolumeUI();
    var calWrap = document.getElementById('bm-cal-wrap');
    if (calWrap) calWrap.innerHTML = '';
    var submitStatus = document.getElementById('bm-submit-status');
    if (submitStatus) submitStatus.textContent = '';
  }

  function goTo(n) {
    state.step = n;
    steps.forEach(function (el, i) {
      if (el) el.classList.toggle('is-active', i === n);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('done', i <= n);
    });
  }

  function openModal(opts) {
    resetModalState();
    if (opts) {
      if (opts.icp_segment) state.icp_segment = opts.icp_segment;
      if (opts.source) state.source = opts.source;
    }
    modal.classList.add('is-open');
    document.body.classList.add('noscroll');
    goTo(0);
    var nameEl = document.getElementById('bm-name');
    if (nameEl) nameEl.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('noscroll');
  }

  window.RAIS_openBooking = openModal;

  document.querySelectorAll('.js-open-booking').forEach(function (el) {
    el.addEventListener('click', function () {
      openModal({
        source: el.getAttribute('data-source') || null,
        icp_segment: el.getAttribute('data-icp') || null
      });
    });
  });

  ['nav-demo-btn', 'mobile-demo-btn', 'contact-demo-btn', 'sticky-demo-btn', 'hero-work-btn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function () {
        openModal({ source: id });
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (volumeEl) {
    volumeEl.addEventListener('input', syncVolumeUI);
    volumeEl.addEventListener('change', syncVolumeUI);
    syncVolumeUI();
  }

  function normalizePhone(raw) {
    return String(raw || '').replace(/[^\d+()\s/-]/g, '').trim();
  }

  function isValidPhone(phone) {
    var digits = phone.replace(/\D/g, '');
    return digits.length >= 6 && digits.length <= 20;
  }

  var next0 = document.getElementById('bm-next-0');
  if (next0) {
    next0.addEventListener('click', function () {
      var nameEl = document.getElementById('bm-name');
      var emailEl = document.getElementById('bm-email');
      var phoneEl = document.getElementById('bm-phone');
      var privacyEl = document.getElementById('bm-privacy');
      var websiteEl = document.getElementById('bm-website');
      var ok = true;
      if (websiteEl && websiteEl.value) return;
      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) nameEl.classList.add('bm-error');
        ok = false;
      } else if (nameEl) nameEl.classList.remove('bm-error');
      var email = emailEl ? emailEl.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailEl) emailEl.classList.add('bm-error');
        ok = false;
      } else if (emailEl) emailEl.classList.remove('bm-error');
      var phone = phoneEl ? normalizePhone(phoneEl.value) : '';
      if (!phone || !isValidPhone(phone)) {
        if (phoneEl) phoneEl.classList.add('bm-error');
        ok = false;
      } else if (phoneEl) phoneEl.classList.remove('bm-error');
      if (!privacyEl || !privacyEl.checked) {
        if (privacyEl && privacyEl.parentElement) privacyEl.parentElement.classList.add('bm-error');
        ok = false;
      } else if (privacyEl && privacyEl.parentElement) privacyEl.parentElement.classList.remove('bm-error');
      if (!ok) return;
      state.name = nameEl.value.trim().slice(0, 200);
      state.email = email.slice(0, 254);
      state.phone = phone.slice(0, 40);
      goTo(1);
      if (volumeEl) volumeEl.focus();
    });
  }

  var next1 = document.getElementById('bm-next-1');
  if (next1) {
    next1.addEventListener('click', function () {
      syncVolumeUI();
      submitLead();
    });
  }

  var back1 = document.getElementById('bm-back-1');
  if (back1) back1.addEventListener('click', function () { goTo(0); });

  function submitLead() {
    var submitStatus = document.getElementById('bm-submit-status');
    var payload = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      inquiry_volume: state.inquiry_volume,
      icp_segment: state.icp_segment || null,
      source: state.source || null,
      privacy_ack: true,
      form_opened_at: new Date(state.openedAt).toISOString()
    };

    if (submitStatus) submitStatus.textContent = 'Anfrage wird gespeichert…';

    fetch(SUPABASE_URL + '/functions/v1/submit-audit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('lead submission failed');
      if (submitStatus) submitStatus.textContent = 'Anfrage gespeichert.';
    }).catch(function () {
      if (submitStatus) {
        submitStatus.textContent = 'Ihre Anfrage konnte gerade nicht gespeichert werden. Sie können den Termin trotzdem direkt buchen.';
      }
    }).finally(function () {
      goTo(2);
      showCalBookingLink();
    });
  }

  function showCalBookingLink() {
    if (state.bookingLinkShown) return;
    var wrap = document.getElementById('bm-cal-wrap');
    if (!wrap) return;

    state.bookingLinkShown = true;
    var bookingUrl;
    try {
      bookingUrl = new URL(CAL_URL);
    } catch (e) {
      bookingUrl = new URL('https://ritz-ai-solutions.cal.eu/kevin/erstgespraech-mit-rais');
    }

    if (bookingUrl.protocol !== 'https:' || bookingUrl.hostname !== 'ritz-ai-solutions.cal.eu') {
      bookingUrl = new URL('https://ritz-ai-solutions.cal.eu/kevin/erstgespraech-mit-rais');
    }

    var link = document.createElement('a');
    link.href = bookingUrl.toString();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'bm-btn-next';
    link.textContent = 'Termin bei Cal.com auswählen';
    wrap.appendChild(link);
  }
}());
