/**
 * RAIS Custom Booking — ersetzt Cal.com Embed.
 *
 * - mount(): volles Formular (Fragen + Slots + Kontakt) für Modal
 * - prefetch(): Availability cachen (Roadmap ab Frage 1)
 * - mountStep4(): nur Kontakt + Slot (Roadmap Step 4)
 *
 * Klaro-Service: "booking".
 */
(function () {
  'use strict';

  var cfg = window.RAIS_PUBLIC_CONFIG || {};
  var SUPABASE_URL = cfg.supabaseUrl || '';
  var SUPABASE_ANON = cfg.supabaseAnonKey || '';
  var SERVICE = 'booking';
  var EVENT_SLUG = 'erstgespraech';

  var mounted = [];
  var prefetchCache = null;
  var prefetchPromise = null;

  function manager() {
    try {
      if (!window.klaro || typeof window.klaro.getManager !== 'function') return null;
      return window.klaro.getManager();
    } catch (e) {
      return null;
    }
  }

  function hasConsent() {
    var mgr = manager();
    if (mgr && mgr.consents) return mgr.consents[SERVICE] === true;
    try {
      var raw = window.localStorage.getItem('klaro') || '{}';
      var stored = JSON.parse(decodeURIComponent(raw));
      return stored[SERVICE] === true;
    } catch (e) {
      return false;
    }
  }

  function grantConsent() {
    var mgr = manager();
    if (!mgr || typeof mgr.updateConsent !== 'function') return false;
    try {
      mgr.updateConsent(SERVICE, true);
      mgr.saveAndApplyConsents();
      return true;
    } catch (e) {
      return false;
    }
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function apiHeaders() {
    return {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON,
      Authorization: 'Bearer ' + SUPABASE_ANON,
    };
  }

  function loadAvailability(force) {
    if (!force && prefetchCache) return Promise.resolve(prefetchCache);
    if (!force && prefetchPromise) return prefetchPromise;
    var url =
      SUPABASE_URL +
      '/functions/v1/booking-availability?event=' +
      encodeURIComponent(EVENT_SLUG);
    prefetchPromise = fetch(url, { headers: apiHeaders() })
      .then(function (res) {
        if (!res.ok) throw new Error('availability_' + res.status);
        return res.json();
      })
      .then(function (data) {
        prefetchCache = data;
        prefetchPromise = null;
        return data;
      })
      .catch(function (err) {
        prefetchPromise = null;
        throw err;
      });
    return prefetchPromise;
  }

  function prefetch(opts) {
    var o = opts || {};
    if (o.ensureConsent !== false) grantConsent();
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      return Promise.reject(new Error('not_configured'));
    }
    return loadAvailability(Boolean(o.force));
  }

  function book(payload) {
    return fetch(SUPABASE_URL + '/functions/v1/booking-book', {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) {
          throw Object.assign(new Error(body.error || 'book_failed'), {
            body: body,
            status: res.status,
          });
        }
        return body;
      });
    });
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] !== undefined && attrs[k] !== null) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function groupSlotsByDay(slots) {
    var map = {};
    (slots || []).forEach(function (s) {
      var d = new Date(s.startsAt);
      var key = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
      var label = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Berlin',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(d);
      if (!map[key]) map[key] = { key: key, label: label, slots: [] };
      map[key].slots.push(s);
    });
    return Object.keys(map)
      .sort()
      .map(function (k) {
        return map[k];
      });
  }

  function renderSlotPicker(containerParent, state, onPick) {
    var days = groupSlotsByDay((state.data && state.data.slots) || []);
    if (!days.length) {
      containerParent.appendChild(
        el('p', {
          className: 'rb-error',
          text: 'Gerade keine freien Termine. Schreib uns eine Mail.',
        }),
      );
      return;
    }
    var slotWrap = el('div', { className: 'rb-slots' });
    days.forEach(function (day) {
      slotWrap.appendChild(el('div', { className: 'rb-day-label', text: day.label }));
      var row = el('div', { className: 'rb-slot-row' });
      day.slots.forEach(function (s) {
        var time = new Intl.DateTimeFormat('de-DE', {
          timeZone: 'Europe/Berlin',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(s.startsAt));
        row.appendChild(
          el(
            'button',
            {
              type: 'button',
              className:
                'rb-slot' +
                (state.slot && state.slot.startsAt === s.startsAt ? ' is-selected' : ''),
              onClick: function () {
                onPick(s);
              },
            },
            [time],
          ),
        );
      });
      slotWrap.appendChild(row);
    });
    containerParent.appendChild(slotWrap);
  }

  function contactFields(state) {
    return [
      el('label', { className: 'rb-field' }, [
        el('span', { text: 'Name' }),
        el('input', {
          type: 'text',
          required: 'required',
          autocomplete: 'name',
          value: state.name,
          onInput: function (e) {
            state.name = e.target.value;
          },
        }),
      ]),
      el('label', { className: 'rb-field' }, [
        el('span', { text: 'E-Mail' }),
        el('input', {
          type: 'email',
          required: 'required',
          autocomplete: 'email',
          value: state.email,
          onInput: function (e) {
            state.email = e.target.value;
          },
        }),
      ]),
      el('label', { className: 'rb-field' }, [
        el('span', { text: 'Telefon' }),
        el('input', {
          type: 'tel',
          autocomplete: 'tel',
          value: state.phone,
          onInput: function (e) {
            state.phone = e.target.value;
          },
        }),
      ]),
      el('label', { className: 'rb-hp', 'aria-hidden': 'true' }, [
        el('input', {
          type: 'text',
          name: 'company_website',
          tabindex: '-1',
          autocomplete: 'off',
        }),
      ]),
    ];
  }

  function renderDone(container, result) {
    container.innerHTML = '';
    container.classList.add('rb-root');
    var r = result || {};
    if (r.outcome === 'reject') {
      container.appendChild(
        el('div', { className: 'rb-result rb-result-reject' }, [
          el('h3', { text: 'Aktuell kein Fit' }),
          el('p', {
            text: r.rejectMessage || 'Leider passen wir gerade nicht zusammen.',
          }),
        ]),
      );
      return;
    }
    container.appendChild(
      el('div', { className: 'rb-result rb-result-ok' }, [
        el('h3', { text: 'Termin bestätigt' }),
        el('p', {
          text:
            (r.label || '') +
            ' — Du erhältst eine Bestätigung per E-Mail' +
            (r.gcalSynced ? ' und den Kalendereintrag.' : '.'),
        }),
      ]),
    );
  }

  function bookErrorMessage(err) {
    var code = (err && err.body && err.body.error) || err.message;
    if (code === 'slot_taken' || code === 'slot_busy' || code === 'slot_not_available') {
      return 'Dieser Slot ist gerade vergeben. Bitte anderen wählen.';
    }
    if (code === 'slot_too_soon') return 'Dieser Termin liegt zu nah. Bitte später wählen.';
    if (code === 'rate_limited') return 'Zu viele Versuche. Bitte später erneut.';
    return 'Buchung fehlgeschlagen.';
  }

  function renderGate(container, onGrant) {
    container.innerHTML = '';
    container.appendChild(
      el('div', { className: 'rb-gate' }, [
        el('p', {
          className: 'rb-gate-text',
          text:
            'Zum Laden freier Termine willigst du ein, dass die Buchungsmaske unsere Server (Supabase) und bei Bestätigung Google Calendar anspricht.',
        }),
        el(
          'button',
          {
            type: 'button',
            className: 'rb-btn rb-btn-primary',
            onClick: function () {
              grantConsent();
              onGrant();
            },
          },
          ['Termine laden'],
        ),
      ]),
    );
  }

  function mountFlow(container, options) {
    var opts = options || {};
    var source = opts.source || null;
    var state = {
      data: null,
      answers: {},
      slot: null,
      name: '',
      email: '',
      phone: '',
      step: 'load',
      error: null,
      result: null,
    };

    function setError(msg) {
      state.error = msg;
      paint();
    }

    function paint() {
      container.innerHTML = '';
      container.classList.add('rb-root');
      if (state.step === 'load') {
        container.appendChild(el('p', { className: 'rb-muted', text: 'Lade Termine…' }));
        return;
      }
      if (state.step === 'done') {
        renderDone(container, state.result);
        return;
      }

      var form = el('form', { className: 'rb-form', onSubmit: onSubmit });
      if (state.error) form.appendChild(el('p', { className: 'rb-error', text: state.error }));

      form.appendChild(el('p', { className: 'rb-muted', text: 'Quali-Fragen' }));
      (state.data.questions || []).forEach(function (q) {
        form.appendChild(renderQuestion(q, state));
      });

      form.appendChild(el('p', { className: 'rb-muted', text: 'Freie Termine' }));
      renderSlotPicker(form, state, function (s) {
        state.slot = s;
        paint();
      });

      form.appendChild(el('p', { className: 'rb-muted', text: 'Kontaktdaten' }));
      contactFields(state).forEach(function (n) {
        form.appendChild(n);
      });

      form.appendChild(
        el(
          'button',
          {
            type: 'submit',
            className: 'rb-btn rb-btn-primary',
            disabled: state.step === 'submit' ? 'disabled' : null,
          },
          [state.step === 'submit' ? 'Buche…' : 'Termin verbindlich buchen'],
        ),
      );
      container.appendChild(form);
    }

    function onSubmit(e) {
      e.preventDefault();
      state.error = null;
      var hp = container.querySelector('.rb-hp input');
      if (hp && hp.value) {
        state.step = 'done';
        state.result = { outcome: 'proceed', ok: true };
        paint();
        return;
      }
      if (!state.slot) {
        setError('Bitte einen Termin wählen.');
        return;
      }
      var missing = (state.data.questions || []).find(function (q) {
        if (!q.required) return false;
        var v = state.answers[q.key];
        return v === undefined || v === null || v === '';
      });
      if (missing) {
        setError('Bitte alle Pflichtfragen beantworten.');
        return;
      }
      if (!state.name || !state.email) {
        setError('Name und E-Mail sind Pflicht.');
        return;
      }
      state.step = 'submit';
      paint();
      book({
        event: EVENT_SLUG,
        startsAt: state.slot.startsAt,
        endsAt: state.slot.endsAt,
        name: state.name,
        email: state.email,
        phone: state.phone,
        answers: state.answers,
        source: source,
        idempotencyKey: uuid(),
        company_website: '',
      })
        .then(function (body) {
          prefetchCache = null;
          state.result = body;
          state.step = 'done';
          paint();
        })
        .catch(function (err) {
          state.step = 'form';
          setError(bookErrorMessage(err));
        });
    }

    state.step = 'load';
    paint();
    loadAvailability()
      .then(function (data) {
        state.data = data;
        state.step = 'form';
        paint();
      })
      .catch(function () {
        state.step = 'form';
        state.data = { questions: [], slots: [] };
        setError('Termine konnten nicht geladen werden. Bitte später erneut versuchen.');
      });
  }

  function renderQuestion(q, state) {
    var wrap = el('label', { className: 'rb-field' }, [
      el('span', { text: q.label + (q.required ? ' *' : '') }),
    ]);
    var control;
    if (q.type === 'boolean') {
      control = el('select', {
        required: q.required ? 'required' : null,
        onChange: function (e) {
          state.answers[q.key] =
            e.target.value === '' ? undefined : e.target.value === 'true';
        },
      });
      control.appendChild(el('option', { value: '', text: 'Bitte wählen' }));
      control.appendChild(el('option', { value: 'true', text: 'Ja' }));
      control.appendChild(el('option', { value: 'false', text: 'Nein' }));
    } else if (q.type === 'single' && q.options && q.options.length) {
      control = el('select', {
        required: q.required ? 'required' : null,
        onChange: function (e) {
          state.answers[q.key] = e.target.value || undefined;
        },
      });
      control.appendChild(el('option', { value: '', text: 'Bitte wählen' }));
      q.options.forEach(function (o) {
        control.appendChild(el('option', { value: o.value, text: o.label }));
      });
    } else if (q.type === 'number') {
      control = el('input', {
        type: 'number',
        required: q.required ? 'required' : null,
        onInput: function (e) {
          state.answers[q.key] =
            e.target.value === '' ? undefined : Number(e.target.value);
        },
      });
    } else {
      control = el('input', {
        type: 'text',
        required: q.required ? 'required' : null,
        onInput: function (e) {
          state.answers[q.key] = e.target.value;
        },
      });
    }
    wrap.appendChild(control);
    return wrap;
  }

  /** Step 4: Kontakt + Slot. answers/source kommen vom Funnel. */
  function mountStep4(container, options) {
    if (!container) return;
    var opts = options || {};
    var answers = opts.answers && typeof opts.answers === 'object' ? opts.answers : {};
    var source = opts.source || 'ai-roadmap';
    var icpSegment = opts.icpSegment || null;
    var state = {
      data: prefetchCache,
      slot: null,
      name: '',
      email: '',
      phone: '',
      step: prefetchCache ? 'form' : 'load',
      error: null,
      result: null,
    };

    function paint() {
      if (state.step === 'done') {
        renderDone(container, state.result);
        return;
      }
      container.innerHTML = '';
      container.classList.add('rb-root');
      if (state.step === 'load') {
        container.appendChild(el('p', { className: 'rb-muted', text: 'Lade Termine…' }));
        return;
      }

      var form = el('form', { className: 'rb-form', onSubmit: onSubmit });
      if (state.error) form.appendChild(el('p', { className: 'rb-error', text: state.error }));

      form.appendChild(el('p', { className: 'rb-muted', text: 'Termin wählen' }));
      renderSlotPicker(form, state, function (s) {
        state.slot = s;
        paint();
      });

      form.appendChild(el('p', { className: 'rb-muted', text: 'Kontaktdaten' }));
      contactFields(state).forEach(function (n) {
        form.appendChild(n);
      });

      form.appendChild(
        el(
          'button',
          {
            type: 'submit',
            className: 'rb-btn rb-btn-primary',
            disabled: state.step === 'submit' ? 'disabled' : null,
          },
          [state.step === 'submit' ? 'Buche…' : 'Termin verbindlich buchen'],
        ),
      );
      container.appendChild(form);
    }

    function onSubmit(e) {
      e.preventDefault();
      state.error = null;
      var hp = container.querySelector('.rb-hp input');
      if (hp && hp.value) {
        state.step = 'done';
        state.result = { outcome: 'proceed', ok: true };
        paint();
        return;
      }
      if (!state.slot) {
        state.error = 'Bitte einen Termin wählen.';
        paint();
        return;
      }
      if (!state.name || !state.email) {
        state.error = 'Name und E-Mail sind Pflicht.';
        paint();
        return;
      }
      var payloadAnswers = Object.assign({}, answers);
      if (icpSegment) payloadAnswers.icp_segment = icpSegment;
      state.step = 'submit';
      paint();
      book({
        event: EVENT_SLUG,
        startsAt: state.slot.startsAt,
        endsAt: state.slot.endsAt,
        name: state.name,
        email: state.email,
        phone: state.phone,
        answers: payloadAnswers,
        source: source,
        idempotencyKey: uuid(),
        company_website: '',
      })
        .then(function (body) {
          prefetchCache = null;
          state.result = body;
          state.step = 'done';
          paint();
        })
        .catch(function (err) {
          state.step = 'form';
          state.error = bookErrorMessage(err);
          paint();
        });
    }

    paint();
    if (!state.data) {
      loadAvailability()
        .then(function (data) {
          state.data = data;
          state.step = 'form';
          paint();
        })
        .catch(function () {
          state.data = { slots: [] };
          state.step = 'form';
          state.error = 'Termine konnten nicht geladen werden.';
          paint();
        });
    }
  }

  function mount(container, options) {
    if (!container) return;
    var opts = options || {};
    mounted.push({ el: container, opts: opts });

    function start() {
      if (!SUPABASE_URL || !SUPABASE_ANON) {
        container.innerHTML = '<p class="rb-error">Buchung nicht konfiguriert.</p>';
        return;
      }
      if (opts.step4) {
        mountStep4(container, opts);
        return;
      }
      mountFlow(container, opts);
    }

    if (opts.ensureConsent && !hasConsent()) {
      renderGate(container, start);
      return;
    }
    start();
  }

  function remountAll() {
    mounted.forEach(function (m) {
      mount(m.el, Object.assign({}, m.opts, { remount: true }));
    });
  }

  function autoInline() {
    document.querySelectorAll('[data-rais-booking]:not([data-rais-booking-defer])').forEach(
      function (node) {
        mount(node, {
          source: node.getAttribute('data-source') || 'inline',
          ensureConsent: true,
        });
      },
    );
  }

  window.RAISBooking = {
    mount: mount,
    mountStep4: mountStep4,
    prefetch: prefetch,
    hasConsent: hasConsent,
    grantConsent: grantConsent,
    remountAll: remountAll,
    getCachedAvailability: function () {
      return prefetchCache;
    },
  };

  window.RAISCal = {
    mount: function (el, opts) {
      var o = opts || {};
      if (o.step4 || o.answers) {
        mountStep4(el, {
          source: o.source || null,
          answers: o.answers || {},
          icpSegment: o.icpSegment || null,
        });
        return;
      }
      mount(el, {
        source: o.source || null,
        ensureConsent: o.ensureConsent !== false,
      });
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInline);
  } else {
    autoInline();
  }
})();
