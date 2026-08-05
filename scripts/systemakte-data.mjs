/**
 * SYSTEMAKTE — einzige Quelle fuer alle Use Cases.
 *
 * Genutzt von:
 *   - scripts/build-pages.mjs      → referenzen.html (vollstaendiges Register)
 *   - scripts/sync-index-shell.mjs → index.html (Kurzfassung im Bereich systemakte:start/end)
 *
 * Beide Seiten rendern aus dieser Datei. Inhalte niemals direkt im HTML pflegen,
 * die Dateien werden bei jedem `npm run pages` ueberschrieben.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STATUSSTEMPEL
 * `status: 'live'` setzt sichtbar „Live im Betrieb“ an den Eintrag.
 * Bewusst ist aktuell NICHTS als live markiert. Die Seite verspricht an mehreren
 * Stellen „keine erfundenen Beweise“, deshalb wird ein Stempel erst gesetzt,
 * wenn ein System tatsaechlich bei einem Kunden laeuft.
 * Zum Aktivieren genuegt `status: 'live'` am jeweiligen Eintrag.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Feldbedeutung pro Eintrag:
 *   code      Klassifikationskuerzel, keine Reihenfolge (brand_steer verbietet
 *             Nummerierung ohne echte Sequenz)
 *   title     Was das System ist
 *   trigger   Woran der Leser seinen eigenen Alltag erkennt
 *   flow      Echte Reihenfolge, deshalb ist hier Nummerierung zulaessig
 *   handover  Wo das System aufhoert und ein Mensch uebernimmt
 *   limit     Was das System bewusst NICHT tut. Der eigentliche Trust-Hebel.
 *   systems   Woran es angebunden wird
 *   status    'live' oder null
 *   slug      NUR bei Flaggschiffen. Setzt eine eigene Unterseite auf
 *             `system-<slug>.html` und macht aus dem Katalog-Button einen
 *             Link dorthin. Gepflegtes Feld, nicht aus dem Titel abgeleitet,
 *             damit die URL stabil bleibt wenn der Titel sich aendert.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FLAGGSCHIFFE UND EIGENE SEITEN
 *
 * Nur Eintraege mit `slug` bekommen eine Unterseite. Aktuell sind das die
 * fuenf universellen Systeme, weil sie in allen vier Branchen greifen.
 *
 * Bewusst nicht alle 24: ein Eintrag traegt rund 80 Woerter. Vierundzwanzig
 * Seiten daraus waeren duenne Doorway-Seiten ohne Nutzen fuer Leser und mit
 * Abstrafungsrisiko bei Google. Wer einen weiteren Eintrag zur Seite machen
 * will, schreibt vorher den Inhalt dafuer.
 *
 * WER EINEN SLUG ERGAENZT, MUSS DREI STELLEN NACHZIEHEN:
 *   1. vite.config.js  -> neuer Eintrag in rollupOptions.input
 *   2. sitemap.xml     -> wird von scripts/build-sitemap.mjs erzeugt, laeuft mit
 *   3. nichts weiter; Nav und Footer bleiben unveraendert, Einstieg ist
 *      ausschliesslich referenzen.html
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Branchenuebergreifend. Greift in jeder Branche. */
export const UNIVERSAL = [
  {
    code: 'ANF',
    title: 'Anfragen qualifizieren',
    trigger:
      'Eine Anfrage trifft ein, über Formular, Portal, Mail oder Telefon.',
    flow: ['Aufnehmen', 'Rückfragen stellen', 'Einordnen', 'Weiterleiten'],
    handover:
      'Sobald Bedarf, Budget und Zeitrahmen geklärt sind, geht der Vorgang mit vollständiger Notiz an einen Menschen.',
    limit:
      'Keine Preiszusagen, keine Vertragsauskünfte, keine Absage an Interessenten ohne menschliche Freigabe.',
    systems: 'Formular, Postfach, Telefonie, CRM',
    status: null,
    slug: 'anfragen-qualifizieren',
    image: 'AMS - Use Case.png',
    tools: [{ name: 'n8n', file: 'n8n-color.svg' }, { name: 'Supabase', file: 'supabase.svg' }],
  },
  {
    code: 'SUP',
    title: 'Support-Agent für Chat und Telefon',
    trigger:
      'Ein Kunde meldet sich außerhalb der Bürozeiten oder während im Büro bereits eine Warteschlange steht.',
    flow: [
      'Anliegen aufnehmen',
      'Gegen die Wissensbasis prüfen',
      'Beantworten oder eskalieren',
      'Protokoll ablegen',
    ],
    handover:
      'Ab der zweiten Rückfrage ohne belastbare Antwort übernimmt ein Mensch, mit vollständigem Gesprächsverlauf.',
    limit:
      'Keine Kulanzentscheidungen, keine Zusagen zu Preisen und Fristen, keine Auskunft zu laufenden Verträgen.',
    systems: 'Telefonie, Chat, Postfach, Ticketsystem, Wissensbasis',
    status: null,
    slug: 'support-agent',
    tools: [{ name: 'n8n', file: 'n8n-color.svg' }, { name: 'Supabase', file: 'supabase.svg' }],
  },
  {
    code: 'ONB',
    title: 'Onboarding von Kunden und Mitarbeitenden',
    trigger: 'Ein Vertrag ist unterschrieben oder eine Zusage ist erteilt.',
    flow: [
      'Unterlagen anfordern',
      'Vollständigkeit prüfen',
      'Zugänge und Termine anlegen',
      'Status melden',
    ],
    handover:
      'Fehlt eine Unterlage nach zwei Erinnerungen, landet der Fall auf dem Tisch der zuständigen Person.',
    limit:
      'Keine Bonitäts- oder Eignungsentscheidungen. Gesundheits- und Bewerbungsdaten nur nach gesonderter Vereinbarung.',
    systems: 'Postfach, Kalender, Dateiablage, CRM oder Personalsystem',
    status: null,
    slug: 'onboarding',
    image: 'Onboarding Automation - Use Case.png',
    tools: [{ name: 'n8n', file: 'n8n-color.svg' }, { name: 'Supabase', file: 'supabase.svg' }],
  },
  {
    code: 'TIC',
    title: 'Ticketing und Eskalation',
    trigger:
      'Eine Meldung landet im Postfach, per WhatsApp oder über ein Formular.',
    flow: ['Erfassen', 'Kategorisieren', 'Priorisieren', 'Zuständigkeit zuweisen'],
    handover:
      'Alles ab der vereinbarten Dringlichkeitsstufe geht sofort und zusätzlich per Anruf an die Bereitschaft.',
    limit:
      'Keine eigenständige Beauftragung von Partnerbetrieben oberhalb eines vereinbarten Betrags.',
    systems: 'Postfach, WhatsApp Business, Ticketsystem, Partnerverzeichnis',
    status: null,
  },
  {
    code: 'DOK',
    title: 'Dokumente auslesen und einpflegen',
    trigger: 'Ein PDF, ein Scan oder eine Mail mit Anhang trifft ein.',
    flow: [
      'Dokumenttyp erkennen',
      'Felder auslesen',
      'Gegen den Bestand prüfen',
      'In das Zielsystem schreiben',
    ],
    handover:
      'Bei unsicherer Erkennung wird nicht geschrieben, sondern zur Prüfung vorgelegt.',
    limit:
      'Keine automatische Freigabe von Zahlungen, keine Änderung bestehender Stammdaten ohne Bestätigung.',
    systems: 'Postfach, Dateiablage, CRM, Warenwirtschaft, Buchhaltung',
    status: null,
    slug: 'dokumente-auslesen',
    tools: [{ name: 'n8n', file: 'n8n-color.svg' }, { name: 'Supabase', file: 'supabase.svg' }],
  },
  {
    code: 'CON',
    title: 'Content-Erstellung mit Freigabe',
    trigger: 'Ein neues Objekt, Produkt oder Thema steht an.',
    flow: [
      'Daten sammeln',
      'Entwurf erzeugen',
      'Gegen Ihre Vorgaben prüfen',
      'Zur Freigabe vorlegen',
    ],
    handover:
      'Nichts geht ungeprüft nach außen. Jeder Entwurf braucht eine menschliche Freigabe.',
    limit:
      'Keine Aussagen zu Preisen oder Rechtslagen, keine Zusicherungen, keine Veröffentlichung ohne Freigabe.',
    systems: 'CRM oder Produktdatenbank, Bildablage, Social- und Newsletter-Werkzeuge',
    status: null,
  },
  {
    code: 'REP',
    title: 'Reporting und Wochenlage',
    trigger:
      'Ein fester Termin in der Woche, oder ein vereinbarter Schwellenwert wird überschritten.',
    flow: [
      'Quellen zusammenführen',
      'Auffälligkeiten markieren',
      'Bericht erzeugen',
      'Verteilen',
    ],
    handover:
      'Der Bericht benennt Auffälligkeiten und Fragen. Entschieden wird im Team.',
    limit:
      'Keine Bewertung einzelner Mitarbeitender, keine Leistungsprofile von Personen.',
    systems: 'CRM, Ticketsystem, Buchhaltung, Tabellen',
    status: null,
    slug: 'reporting',
    tools: [{ name: 'n8n', file: 'n8n-color.svg' }, { name: 'Supabase', file: 'supabase.svg' }],
  },
];

/** Branchen. Immobilien ist die Referenzbranche und steht zuerst. */
export const BRANCHEN = [
  {
    slug: 'immobilien',
    label: 'Immobilien',
    title: 'Maklerbüros und Hausverwaltungen',
    lead:
      'Unsere Referenzbranche. Hier sind die Prozesse am dichtesten dokumentiert.',
    moreHref: 'ams.html',
    moreLabel: 'AMS im Detail ansehen',
    records: [
      {
        code: 'IMM-A',
        title: 'Portalanfragen qualifizieren',
        trigger:
          'Eine Anfrage aus einem Immobilienportal oder von der eigenen Website trifft ein.',
        flow: [
          'Anfrage aufnehmen',
          'Bedarf, Finanzierungsstand und Zeitrahmen erfragen',
          'Einordnen',
          'Termin vorbereiten',
        ],
        handover:
          'Nur Interessenten mit geklärtem Bedarf und Zeitrahmen landen im Kalender Ihrer Berater.',
        limit:
          'Keine Bonitätsprüfung, keine Absage an Interessenten, keine Aussage zu Kaufpreisen oder Provisionen.',
        systems: 'Portale, Website-Formular, onOffice oder Propstack, Kalender',
        status: null,
      },
      {
        code: 'IMM-B',
        title: 'Mieter-Support und Störungsmeldungen',
        trigger:
          'Ein Mieter meldet einen Schaden per Mail, Telefon oder WhatsApp.',
        flow: [
          'Meldung aufnehmen',
          'Dringlichkeit einordnen',
          'Objekt und Zuständigkeit zuordnen',
          'Partnerbetrieb oder Bereitschaft informieren',
        ],
        handover:
          'Notfälle wie Wasser oder Heizungsausfall gehen sofort und zusätzlich per Anruf an die Bereitschaft.',
        limit:
          'Keine Kostenzusagen, keine Beauftragung oberhalb des vereinbarten Betrags, keine Aussagen zur Mietminderung.',
        systems: 'Postfach, WhatsApp Business, Ticketsystem, Partnerverzeichnis',
        status: null,
      },
      {
        code: 'IMM-C',
        title: 'Aktenpflege im CRM',
        trigger:
          'Daten liegen parallel in Portalen, im Postfach und in Tabellen.',
        flow: [
          'Quellen anbinden',
          'Objekt- und Kontaktdaten erfassen',
          'Gegen den Bestand abgleichen',
          'Akte aktualisieren',
        ],
        handover:
          'Bei Widersprüchen zwischen zwei Quellen wird nicht überschrieben, sondern vorgelegt.',
        limit:
          'Keine Löschung von Datensätzen, keine Änderung an Eigentümerdaten ohne Bestätigung.',
        systems: 'onOffice, Propstack, Portale, Postfach',
        status: null,
      },
      {
        code: 'IMM-D',
        title: 'Exposé- und Objekttexte',
        trigger: 'Ein neues Objekt wird aufgenommen.',
        flow: [
          'Objektdaten und Grundrisse auslesen',
          'Entwurf erzeugen',
          'Gegen Ihre Textvorgaben prüfen',
          'Zur Freigabe vorlegen',
        ],
        handover:
          'Jeder Text geht erst nach Freigabe durch Ihr Team in die Vermarktung.',
        limit:
          'Keine Angaben zu Energiewerten, Baujahr oder Flächen, die nicht aus einer geprüften Quelle stammen.',
        systems: 'CRM, Bildablage, Portale',
        status: null,
      },
      {
        code: 'IMM-E',
        title: 'Markt- und Akquisesignale',
        trigger:
          'Sie wollen früher erfahren, wo sich im Bestandsgebiet etwas bewegt.',
        flow: [
          'Öffentliche Quellen beobachten',
          'Signale filtern',
          'Nach Relevanz sortieren',
          'Wochenübersicht zustellen',
        ],
        handover:
          'Die Übersicht schlägt vor, wen Sie ansprechen könnten. Die Ansprache bleibt bei Ihnen.',
        limit:
          'Keine automatisierte Kaltansprache, keine Verarbeitung von Daten aus unzulässigen Quellen.',
        systems: 'Öffentliche Portale und Register, CRM, Tabellen',
        status: null,
      },
    ],
  },
  {
    slug: 'handwerk',
    label: 'Handwerk und Bau',
    title: 'SHK, Elektro, Bau und Ausbau',
    lead:
      'Viele kurze Vorgänge, wenig Zeit im Büro und ein Team, das überwiegend auf der Baustelle ist.',
    records: [
      {
        code: 'HWK-A',
        title: 'Angebotsanfragen aufnehmen',
        trigger:
          'Eine Anfrage kommt per Telefon oder Formular, oft während niemand im Büro ist.',
        flow: [
          'Anliegen und Objekt aufnehmen',
          'Leistungsart und Dringlichkeit klären',
          'Auf Machbarkeit im Gebiet prüfen',
          'Ortstermin vorschlagen',
        ],
        handover:
          'Der fertige Vorgang liegt morgens mit allen Angaben zur Kalkulation bereit.',
        limit:
          'Keine Preisangaben, keine Terminzusagen ohne Abgleich mit Ihrer Disposition.',
        systems: 'Telefonie, Formular, Kalender, Handwerkersoftware',
        status: null,
      },
      {
        code: 'HWK-B',
        title: 'Terminfenster und Disposition',
        trigger: 'Ein Termin fällt aus oder ein Notdienst schiebt sich dazwischen.',
        flow: [
          'Betroffene Termine erkennen',
          'Kunden informieren',
          'Ersatzfenster anbieten',
          'Kalender nachziehen',
        ],
        handover:
          'Verschiebungen bei Großaufträgen entscheidet immer die Disposition.',
        limit:
          'Keine eigenständige Umplanung von Terminen mit Fristbindung oder Abnahme.',
        systems: 'Kalender, Handwerkersoftware, SMS und Mail',
        status: null,
      },
      {
        code: 'HWK-C',
        title: 'Nachträge und Aufmaß dokumentieren',
        trigger:
          'Auf der Baustelle entsteht Mehraufwand, der später abgerechnet werden muss.',
        flow: [
          'Foto und Sprachnotiz vom Monteur aufnehmen',
          'Positionen erkennen',
          'Dem Auftrag zuordnen',
          'Nachtrag zur Prüfung vorlegen',
        ],
        handover:
          'Der Nachtrag geht erst nach Prüfung durch die Bauleitung an den Kunden.',
        limit:
          'Keine Preisbildung, keine Abrechnung, keine Kommunikation von Mehrkosten an den Kunden.',
        systems: 'Mobile Erfassung, Dateiablage, Handwerkersoftware',
        status: null,
      },
      {
        code: 'HWK-D',
        title: 'Reklamationen und Gewährleistung',
        trigger: 'Ein Kunde meldet einen Mangel nach der Abnahme.',
        flow: [
          'Meldung und Objekt zuordnen',
          'Auftragshistorie heraussuchen',
          'Gewährleistungsfrist prüfen',
          'Vorgang mit Akte übergeben',
        ],
        handover:
          'Die Bewertung, ob ein Mangel anerkannt wird, trifft immer ein Mensch.',
        limit:
          'Keine Anerkennung oder Ablehnung von Mängeln, keine Zusagen zu Nachbesserung oder Kosten.',
        systems: 'Postfach, Handwerkersoftware, Dateiablage',
        status: null,
      },
    ],
  },
  {
    slug: 'handel',
    label: 'Handel und Großhandel',
    title: 'Handel, Großhandel und E-Commerce',
    lead:
      'Hohes Belegvolumen, viele gleichförmige Rückfragen und Stammdaten, die nie ganz aktuell sind.',
    records: [
      {
        code: 'HDL-A',
        title: 'Bestell- und Lieferantenpost',
        trigger:
          'Bestellungen und Auftragsbestätigungen kommen als PDF oder Mail in unterschiedlichen Formaten.',
        flow: [
          'Beleg erkennen',
          'Positionen auslesen',
          'Gegen die Bestellung prüfen',
          'In die Warenwirtschaft schreiben',
        ],
        handover:
          'Abweichungen bei Menge, Preis oder Termin gehen an den Einkauf, nicht ins System.',
        limit:
          'Keine Freigabe von Zahlungen, keine Bestellauslösung, keine Änderung von Konditionen.',
        systems: 'Postfach, Warenwirtschaft, Dateiablage',
        status: null,
      },
      {
        code: 'HDL-B',
        title: 'Retouren und Reklamationen',
        trigger: 'Ein Kunde meldet eine Rücksendung oder einen Defekt.',
        flow: [
          'Bestellung zuordnen',
          'Fall kategorisieren',
          'Rücksendeunterlagen erzeugen',
          'Status an den Kunden melden',
        ],
        handover:
          'Kulanz und Erstattung oberhalb des vereinbarten Betrags entscheidet ein Mensch.',
        limit:
          'Keine Erstattungen, keine Gutschriften, keine Zusagen zu Fristen außerhalb Ihrer Regeln.',
        systems: 'Shop, Warenwirtschaft, Versanddienstleister, Postfach',
        status: null,
      },
      {
        code: 'HDL-C',
        title: 'Artikelstammdaten und Produkttexte',
        trigger: 'Ein Lieferant liefert neue Artikel oder aktualisiert Daten.',
        flow: [
          'Lieferantendaten einlesen',
          'Auf Ihr Schema übersetzen',
          'Produkttext entwerfen',
          'Zur Freigabe vorlegen',
        ],
        handover:
          'Neue Artikel gehen erst nach Sichtung live, nicht automatisch.',
        limit:
          'Keine Preispflege, keine Angaben zu Sicherheit, Konformität oder Inhaltsstoffen ohne geprüfte Quelle.',
        systems: 'Produktdatenbank, Shop, Lieferantendateien',
        status: null,
      },
      {
        code: 'HDL-D',
        title: 'Auskunft zum Bestellstatus',
        trigger:
          '„Wo ist meine Lieferung“ bindet täglich Zeit im Kundenservice.',
        flow: [
          'Kunde und Bestellung identifizieren',
          'Versandstatus abfragen',
          'Verständlich antworten',
          'Bei Problemen eskalieren',
        ],
        handover:
          'Verspätungen und Schadensfälle übernimmt sofort der Kundenservice.',
        limit:
          'Keine Zusagen zu neuen Lieferterminen, keine Entschädigungen, keine Stornierungen.',
        systems: 'Shop, Versanddienstleister, Chat und Postfach',
        status: null,
      },
    ],
  },
  {
    slug: 'beratung',
    label: 'Agenturen und Beratung',
    title: 'Agenturen, Coaches und Beratungen',
    lead:
      'Wenig Verwaltung im Team, dafür viel Abstimmung rund um Anfragen, Onboarding und Projektstatus.',
    records: [
      {
        code: 'AGT-A',
        title: 'Anfragen qualifizieren und Erstgespräch vorbereiten',
        trigger:
          'Eine Anfrage kommt über Website, Empfehlung oder ein soziales Netzwerk.',
        flow: [
          'Anliegen und Ausgangslage erfragen',
          'Passung zu Ihrem Angebot prüfen',
          'Termin vorschlagen',
          'Gesprächsnotiz vorbereiten',
        ],
        handover:
          'Sie gehen mit einer fertigen Vorbereitung ins Gespräch, nicht mit einer leeren Seite.',
        limit:
          'Keine Honorarangaben, keine Zusagen zu Kapazität oder Startterminen.',
        systems: 'Website-Formular, Kalender, CRM',
        status: null,
      },
      {
        code: 'AGT-B',
        title: 'Kunden-Onboarding',
        trigger: 'Ein Angebot ist angenommen.',
        flow: [
          'Unterlagen und Zugänge anfordern',
          'Vollständigkeit prüfen',
          'Projektraum und Termine anlegen',
          'Startfreigabe melden',
        ],
        handover:
          'Fehlt nach zwei Erinnerungen etwas, meldet sich das System bei Ihnen statt beim Kunden.',
        limit:
          'Keine Vertragsänderungen, keine Aufnahme von Zahlungsdaten, keine Zusagen zum Leistungsumfang.',
        systems: 'Postfach, Kalender, Projektwerkzeug, Dateiablage',
        status: null,
      },
      {
        code: 'AGT-C',
        title: 'Projektadministration und Statusmeldungen',
        trigger:
          'Kunden fragen nach dem Stand, während das Team an der Arbeit ist.',
        flow: [
          'Stände aus dem Projektwerkzeug lesen',
          'Offene Punkte markieren',
          'Statusmeldung entwerfen',
          'Zur Freigabe vorlegen',
        ],
        handover:
          'Jede Meldung an den Kunden geht erst nach Ihrer Freigabe raus.',
        limit:
          'Keine Aussagen zu Terminen, Budget oder Mehraufwand ohne Freigabe.',
        systems: 'Projektwerkzeug, Zeiterfassung, Postfach',
        status: null,
      },
      {
        code: 'AGT-D',
        title: 'Content-Produktion mit Freigabe',
        trigger: 'Ein Thema für Newsletter, Beitrag oder Fallbeispiel steht an.',
        flow: [
          'Material und Notizen sammeln',
          'Entwurf in Ihrer Tonalität erzeugen',
          'Gegen Ihre Vorgaben prüfen',
          'Zur Freigabe vorlegen',
        ],
        handover:
          'Nichts wird ohne Ihre Freigabe veröffentlicht oder versendet.',
        limit:
          'Keine Kundennamen ohne Mandat, keine Zahlen ohne Beleg, keine Veröffentlichung ohne Freigabe.',
        systems: 'Notizen, Dateiablage, Newsletter- und Social-Werkzeuge',
        status: null,
      },
    ],
  },
];

/* ── Rendering ────────────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Ein Akteneintrag als natives details/summary. Ohne JS bedienbar.
 * @param {object} rec
 * @param {object} [opts]
 * @param {boolean} [opts.cta] Katalog-Modus: jeder Eintrag ist anfragbar.
 *   Auf der Startseite bewusst aus, dort waeren 15 CTAs Laerm.
 */
/**
 * Ordnet eine Anbindung einem Symbol aus dem Sprite zu (page-shell.mjs).
 *
 * Bewusst ueber Stichwoerter statt einer Tabelle pro Wert: es gibt 36
 * verschiedene Anbindungen mit langem Auslaeufer, viele davon
 * zusammengesetzt ("Chat und Postfach", "CRM oder Personalsystem").
 * Eine Zuordnung je Wert waere Pflegelast und wuerde bei jedem neuen
 * Eintrag brechen. Der erste Treffer gewinnt, deshalb steht das
 * Speziellere oben.
 */
const ICON_RULES = [
  [/postfach|mail|newsletter/i, 'i-mail'],
  [/whatsapp|chat|sms/i, 'i-chat'],
  [/telefon/i, 'i-phone'],
  [/kalender|termin/i, 'i-calendar'],
  [/crm|onoffice|propstack|personalsystem|partnerverzeichnis/i, 'i-crm'],
  [/ablage|datei|bild|dokument/i, 'i-files'],
  [/ticket|projekt|board/i, 'i-board'],
  [/warenwirtschaft|shop|produkt|versand|lieferant/i, 'i-box'],
  [/formular|portal|register|website/i, 'i-form'],
  [/buchhaltung|tabelle|zeiterfassung/i, 'i-table'],
  [/wissensbasis|notiz/i, 'i-doc'],
  [/handwerkersoftware|erfassung|werkzeug/i, 'i-tool'],
  [/social/i, 'i-megafon'],
];

function iconFor(name) {
  for (const [re, id] of ICON_RULES) if (re.test(name)) return id;
  return 'i-globe';
}

export function renderAkte(rec, opts = {}) {
  const status =
    rec.status === 'live'
      ? `\n        <span class="akte__status">Live im Betrieb</span>`
      : '';

  // Der Ablauf ist eine echte Reihenfolge, deshalb bleibt er nummeriert
  // und wird als Kette mit Verbindern gezeigt statt als Aufzaehlung.
  // Die Pfeile sind rein dekorativ und deshalb aria-hidden.
  const flow = rec.flow
    .map(
      (s, i) =>
        `${i ? '<li class="akte__flow-arrow" aria-hidden="true"><svg class="ico"><use href="#i-arrow"></use></svg></li>' : ''}<li class="akte__flow-step">${esc(s)}</li>`
    )
    .join('');

  // Anbindungen als Reihe mit Symbol statt als Komma-Kette.
  const systems = rec.systems
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(
      (s) =>
        `<li class="akte__sys"><svg class="ico" aria-hidden="true"><use href="#${iconFor(s)}"></use></svg>${esc(s)}</li>`
    )
    .join('');
  // Flaggschiffe fuehren auf ihre eigene Seite, alles andere direkt in
  // die Buchung. Das Systemkuerzel reist per data-source mit. Die
  // data-value-Schluessel im Buchungsmodal bleiben unangetastet, das
  // verbietet CLAUDE.md.
  const cta = opts.cta
    ? rec.slug
      ? `
          <p class="akte__cta">
            <a class="akte__cta-btn" href="system-${rec.slug}.html">System im Detail ansehen</a>
          </p>`
      : `
          <p class="akte__cta">
            <button type="button" class="akte__cta-btn js-open-booking" data-source="katalog-${esc(rec.code)}">Dieses System anfragen</button>
          </p>`
    : '';
  // summary darf nur Phrasing Content enthalten, deshalb spans statt h3/p.
  // Die Navigation uebernimmt die Listenstruktur des Registers.
  return `      <li class="akte-item" data-search="${esc((rec.title + ' ' + rec.trigger + ' ' + rec.systems + ' ' + rec.code).toLowerCase())}"><details class="akte">
        <summary class="akte__head">
          <span class="akte__code">${esc(rec.code)}</span>
          <span class="akte__title">${esc(rec.title)}</span>${status}
          <span class="akte__trigger">Auslöser: ${esc(rec.trigger)}</span>
          <span class="akte__toggle"><span class="akte__toggle-closed">Eintrag öffnen</span><span class="akte__toggle-open">Eintrag schließen</span></span>
        </summary>
        <div class="akte__body">
          <dl class="akte__rows">
            <dt>Ablauf</dt>
            <dd><ol class="akte__flow">${flow}</ol></dd>
            <dt>Übergabe</dt>
            <dd>${esc(rec.handover)}</dd>
            <dt>Anbindung</dt>
            <dd><ul class="akte__systems">${systems}</ul></dd>
          </dl>
          <p class="akte__limit">
            <span class="akte__limit-label">Nicht im Zug</span>
            ${esc(rec.limit)}
          </p>${cta}
        </div>
      </details></li>`;
}

export function renderRegister(records, opts = {}) {
  return `    <ul class="akte-register">
${records.map((r) => renderAkte(r, opts)).join('\n')}
    </ul>`;
}

/**
 * Branchen als Reiter. Ohne JS stehen alle Panels sichtbar untereinander,
 * jedes mit eigener Ueberschrift. scripts/branchen-tabs.js macht daraus Reiter.
 * @param {object} opts
 * @param {number} [opts.limit]   nur die ersten n Eintraege je Branche
 * @param {string} [opts.linkTo]  Basispfad fuer den Verweis auf alle Eintraege
 * @param {boolean} [opts.cta]    Katalog-Modus: jeder Eintrag anfragbar
 */
export function renderBranchen({ limit = 0, linkTo = '', cta = false } = {}) {
  const tabs = BRANCHEN.map(
    (b, i) =>
      `        <button type="button" class="branchen__tab" role="tab" id="branche-tab-${b.slug}" aria-controls="branche-panel-${b.slug}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}">${esc(b.label)}</button>`
  ).join('\n');

  const panels = BRANCHEN.map((b) => {
    const recs = limit > 0 ? b.records.slice(0, limit) : b.records;
    const more =
      limit > 0 && b.records.length > limit
        ? `\n      <p class="branchen__note">Alle ${b.records.length} Einträge für ${esc(b.label)} stehen in der <a href="${linkTo}#branche-${b.slug}">vollständigen Liste</a>.</p>`
        : b.moreHref
          ? `\n      <p class="branchen__note"><a href="${b.moreHref}">${esc(b.moreLabel)}</a></p>`
          : '';
    return `      <section class="branchen__panel" id="branche-panel-${b.slug}" role="tabpanel" aria-labelledby="branche-tab-${b.slug}">
        <h3 class="branchen__panel-title" id="branche-${b.slug}">${esc(b.title)}</h3>
        <p class="section-sub">${esc(b.lead)}</p>
${renderRegister(recs, { cta })}${more}
      </section>`;
  }).join('\n');

  return `    <div class="branchen" id="branchen">
      <div class="branchen__tablist" role="tablist" aria-label="Branchen">
${tabs}
      </div>
${panels}
    </div>`;
}

/**
 * Alle Eintraege mit eigener Unterseite.
 */
export function flagships() {
  return [...UNIVERSAL, ...BRANCHEN.flatMap((b) => b.records)].filter((r) => r.slug);
}

/**
 * System-Kachel: Bild, darauf Code und Titel, darunter die Werkzeuge.
 *
 * Vorbild ist die Kachelreihe von apex-consulting.ai. Der Grund fuer den
 * Verlauf ueber dem Bild ist nicht Optik, sondern Lesbarkeit: ohne ihn
 * steht heller Text auf einem beliebig hellen Bildausschnitt.
 *
 * Solange kein Workflow-Screenshot vorliegt, traegt `.system-tile__ph`
 * eine in CSS gezeichnete Andeutung. Sobald ein Bild da ist, kommt es
 * als `--tile-image` an die Kachel und der Platzhalter verschwindet.
 *
 * ACHTUNG bei echten Screenshots: n8n-Ansichten zeigen typischerweise
 * Endpunkte, Postfachadressen und Beispieldatensaetze. Vor dem Einbau
 * ansehen und bei personenbezogenen Daten neu mit Dummy-Daten aufnehmen.
 */
export function renderSystemTile(rec, opts = {}) {
  const href = `system-${rec.slug}.html`;
  const style = rec.image ? ` style="--tile-image: url('images/${encodeURI(rec.image)}')"` : '';
  const tools = (rec.tools || [])
    .map((t) => `<li><img src="images/${encodeURI(t.file)}" alt="${esc(t.name)}" width="80" height="24" loading="lazy" decoding="async"></li>`)
    .join('');
  const toolRow = tools ? `\n        <ul class="system-tile__tools">${tools}</ul>` : '';

  // Als <article> mit Overlay-Link, damit der Titel eine echte
  // Ueberschrift bleibt und nicht in einem <a> verschwindet.
  return `      <article class="system-tile"${style}>
        <span class="system-tile__ph" aria-hidden="true"></span>
        <span class="system-tile__code">${esc(rec.code)}</span>
        <h3 class="system-tile__title"><a href="${href}">${esc(rec.title)}</a></h3>
        <p class="system-tile__trigger">${esc(rec.trigger)}</p>${toolRow}
      </article>`;
}

/** Die Kachelreihe der Flaggschiffe. */
export function renderSystemTiles() {
  const recs = flagships();
  if (!recs.length) return '';
  return `    <div class="system-tiles">
${recs.map((r) => renderSystemTile(r)).join('\n')}
    </div>`;
}
