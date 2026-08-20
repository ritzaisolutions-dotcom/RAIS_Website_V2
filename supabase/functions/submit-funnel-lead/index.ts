import nodemailer from "npm:nodemailer@6.10.1";

const allowedOrigins = new Set(
  (Deno.env.get("RAIS_ALLOWED_ORIGINS") ??
    "https://ritz-ai.solutions,https://www.ritz-ai.solutions")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const NOTIFY_EMAIL = Deno.env.get("FUNNEL_LEAD_NOTIFY_EMAIL") ??
  Deno.env.get("AUDIT_LEAD_NOTIFY_EMAIL") ??
  "kevin@ritz-ai.solutions";
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const ALLOWED_EVENTS = new Set([
  "lp_view",
  "sim_start",
  "funnel_step_1",
  "funnel_step_2",
  "funnel_step_3",
  "funnel_step_4",
  "funnel_step_5",
  "funnel_result_view",
  "booking_confirmed",
]);

const ALLOWED_VORGANG = new Set(["mieteranliegen", "inserat"]);
const ALLOWED_KANAL = new Set(["email", "telefon", "gemischt"]);
const ALLOWED_CRM = new Set(["onoffice", "propstack", "flowfact", "haufe", "excel", "anderes"]);
const ALLOWED_KALENDER = new Set(["google", "microsoft365", "anderes", "keiner"]);
const ALLOWED_POSTFACH = new Set(["google-workspace", "microsoft365", "imap", "weiss-nicht"]);

/* Die drei Fragen vor dem Kalender auf /ai-roadmap.html.
   Werte muessen zu den CHECK-Constraints in
   20260818_create_funnel_qualify.sql passen. */
const ALLOWED_PAIN = new Set([
  "manuelle-bearbeitung",
  "mieteranliegen",
  "reaktionszeit",
  "terminierung",
]);
const ALLOWED_ECOSYSTEM = new Set([
  "google",
  "microsoft365",
  "imap",
  "gemischt",
  "weiss-nicht",
]);

type FunnelLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vorgangstyp: string;
  volumenWoche: number;
  minutenProVorgang: number;
  kanal: string;
  stundensatz: number;
  crm: string;
  kalender: string;
  postfach: string;
  stundenMonat: number | null;
  euroJahr: number | null;
  rueckgewinnStunden: number | null;
  source: string | null;
  marketing: boolean;
};

const CONSENT_VERSION = "ai-roadmap-2026-08-17";
const CONSENT_PRIVACY_TEXT = "Ich habe die Datenschutzerklärung gelesen.";
const CONSENT_MARKETING_TEXT =
  "Ich möchte gelegentlich Hinweise zu neuen Systemen erhalten. Jederzeit widerrufbar.";
const CAL_ROADMAP_URL = "https://cal.com/ritzaisolutions/immo-ai-roadmap";
const PAGE_URL = "/ai-roadmap.html";

const corsHeaders = (origin: string | null): HeadersInit => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "null",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

const json = (body: Record<string, string | boolean>, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });

const textOrNull = (value: unknown, maxLength: number): string | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error("invalid input");
  const text = value.trim();
  if (!text || text.length > maxLength) throw new Error("invalid input");
  return text;
};

const sha256 = async (value: string): Promise<string> => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const numberInRange = (value: unknown, min: number, max: number): number | null => {
  const n = typeof value === "number" ? value : (typeof value === "string" && value.trim() !== "" ? Number(value) : NaN);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
};

const richText = (content: string) => ({
  rich_text: [{ type: "text", text: { content: content.slice(0, 1900) } }],
});

async function rateLimit(
  supabaseUrl: string,
  serviceRoleKey: string,
  ipHash: string,
  kind: "lead" | "event",
): Promise<boolean | "error"> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/register_funnel_attempt`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_ip_hash: ipHash, p_kind: kind }),
  });
  if (!response.ok) {
    console.error("Funnel rate limit check failed.", response.status);
    return "error";
  }
  return await response.json() === true;
}

async function persistEvent(
  supabaseUrl: string,
  serviceRoleKey: string,
  event: string,
  vorgangstyp: string | null,
  source: string | null,
  sessionId: string | null,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/funnel_events`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      event,
      vorgangstyp,
      source,
      session_id: sessionId,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("Funnel event persist failed.", response.status, body.slice(0, 500));
    throw new Error("Event persist failed");
  }
}

type QualifyRow = {
  session_id: string | null;
  pain: string;
  ecosystem: string;
  crm: string;
  volumen_woche: number;
  source: string | null;
  consent_text: string;
  ip_hash: string;
};

async function persistQualify(
  supabaseUrl: string,
  serviceRoleKey: string,
  row: QualifyRow,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/funnel_qualify`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      session_id: row.session_id,
      pain: row.pain,
      ecosystem: row.ecosystem,
      crm: row.crm,
      volumen_woche: row.volumen_woche,
      source: row.source,
      privacy_ack: true,
      consent_text: row.consent_text,
      consent_version: CONSENT_VERSION,
      ip_hash: row.ip_hash,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("Funnel qualify persist failed.", response.status, body.slice(0, 500));
    throw new Error("Qualify persist failed");
  }
}

async function persistLead(
  supabaseUrl: string,
  serviceRoleKey: string,
  lead: FunnelLead,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/funnel_leads`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      vorgangstyp: lead.vorgangstyp,
      volumen_woche: lead.volumenWoche,
      minuten: lead.minutenProVorgang,
      kanal: lead.kanal,
      stundensatz: lead.stundensatz,
      crm: lead.crm,
      kalender: lead.kalender,
      postfach: lead.postfach,
      stunden_monat: lead.stundenMonat,
      euro_jahr: lead.euroJahr,
      rueckgewinn_stunden: lead.rueckgewinnStunden,
      source: lead.source,
      privacy_ack: true,
      marketing_consent: lead.marketing,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("Funnel lead persist failed.", response.status, body.slice(0, 500));
    throw new Error("Lead persist failed");
  }
}

type ConsentRow = {
  purpose: "privacy_ack" | "marketing";
  granted: boolean;
  text_version: string;
};

function consentRows(lead: FunnelLead): ConsentRow[] {
  return [
    {
      purpose: "privacy_ack",
      granted: true,
      text_version: CONSENT_PRIVACY_TEXT,
    },
    {
      purpose: "marketing",
      granted: lead.marketing,
      text_version: CONSENT_MARKETING_TEXT,
    },
  ];
}

async function persistConsents(
  supabaseUrl: string,
  serviceRoleKey: string,
  lead: FunnelLead,
  ipHash: string,
): Promise<ConsentRow[]> {
  const rows = consentRows(lead);
  const response = await fetch(`${supabaseUrl}/rest/v1/form_consents`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(rows.map((row) => ({
      lead_id: lead.id,
      email: lead.email,
      purpose: row.purpose,
      granted: row.granted,
      text_version: row.text_version,
      consent_version: CONSENT_VERSION,
      source: lead.source,
      page_url: PAGE_URL,
      ip_hash: ipHash,
    }))),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("Form consent persist failed.", response.status, body.slice(0, 500));
    throw new Error("Consent persist failed");
  }
  return rows;
}

async function createNotionLead(lead: FunnelLead): Promise<string | null> {
  const notionToken = Deno.env.get("NOTION_TOKEN");
  const notionDatabaseId = Deno.env.get("NOTION_FUNNEL_LEADS_DATABASE_ID") ??
    Deno.env.get("NOTION_AUDIT_LEADS_DATABASE_ID");
  if (!notionToken || !notionDatabaseId) {
    throw new Error("Notion configuration missing");
  }

  const notes = [
    `Vorgangstyp: ${lead.vorgangstyp}`,
    `Volumen/Woche: ${lead.volumenWoche}`,
    `Minuten: ${lead.minutenProVorgang}`,
    `Kanal: ${lead.kanal}`,
    `CRM: ${lead.crm}`,
    `Kalender: ${lead.kalender}`,
    `Postfach: ${lead.postfach}`,
    lead.stundenMonat !== null ? `Stunden/Monat: ${lead.stundenMonat}` : null,
    lead.euroJahr !== null ? `Euro/Jahr: ${lead.euroJahr}` : null,
    `Telefon: ${lead.phone}`,
    lead.source ? `Quelle: ${lead.source}` : null,
    "Kanal: Inbound Website (KI-Roadmap Funnel)",
  ].filter(Boolean).join("\n");

  const properties: Record<string, unknown> = {
    Firma: {
      title: [{ type: "text", text: { content: lead.name.slice(0, 200) } }],
    },
    "GF/Entscheider": richText(lead.name),
    "E-Mail": { email: lead.email },
    Status: { select: { name: "Neu" } },
    Quelle: { select: { name: "Inbound Website" } },
    "Quell-URL": { url: "https://ritz-ai.solutions/ai-roadmap.html" },
    Angriffspunkte: richText(notes),
  };

  const response = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${notionToken}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: notionDatabaseId },
      properties,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Notion funnel lead create failed.", response.status, body.slice(0, 500));
    throw new Error("Notion create failed");
  }

  const page = await response.json() as { url?: string };
  return page.url ?? null;
}

function leadRecord(lead: FunnelLead, notionUrl: string | null, consents: ConsentRow[]) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    vorgangstyp: lead.vorgangstyp,
    volumen_woche: lead.volumenWoche,
    minuten: lead.minutenProVorgang,
    kanal: lead.kanal,
    stundensatz: lead.stundensatz,
    crm: lead.crm,
    kalender: lead.kalender,
    postfach: lead.postfach,
    stunden_monat: lead.stundenMonat,
    euro_jahr: lead.euroJahr,
    source: lead.source,
    marketing_consent: lead.marketing,
    privacy_ack: true,
    consent_version: CONSENT_VERSION,
    consents,
    cal_url: CAL_ROADMAP_URL,
    page_url: PAGE_URL,
    notion_url: notionUrl,
  };
}

async function sendLeadEmail(
  lead: FunnelLead,
  notionUrl: string | null,
  consents: ConsentRow[],
): Promise<void> {
  const record = leadRecord(lead, notionUrl, consents);
  const lines = [
    `Name: ${lead.name}`,
    `E-Mail: ${lead.email}`,
    `Telefon: ${lead.phone}`,
    `Vorgangstyp: ${lead.vorgangstyp}`,
    `Volumen/Woche: ${lead.volumenWoche}`,
    `Minuten: ${lead.minutenProVorgang}`,
    `Kanal: ${lead.kanal}`,
    `Stundensatz: ${lead.stundensatz}`,
    `CRM: ${lead.crm}`,
    `Kalender: ${lead.kalender}`,
    `Postfach: ${lead.postfach}`,
    `Stunden/Monat: ${lead.stundenMonat ?? "—"}`,
    `Euro/Jahr: ${lead.euroJahr ?? "—"}`,
    `Quelle: ${lead.source ?? "—"}`,
    `Datenschutz: Ja`,
    `Marketing: ${lead.marketing ? "Ja" : "Nein"}`,
    `Consent-Version: ${CONSENT_VERSION}`,
    `Notion: ${notionUrl ?? "—"}`,
  ];
  const subject = `Neuer Funnel-Lead: ${lead.name}`;
  const text = lines.join("\n");

  const webhookUrl = Deno.env.get("FUNNEL_LEAD_NOTIFY_WEBHOOK_URL");
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "funnel_lead",
        to: NOTIFY_EMAIL,
        subject,
        text,
        record,
      }),
    });
    if (!response.ok) throw new Error(`Notify webhook failed (${response.status})`);
    return;
  }

  const host = Deno.env.get("FUNNEL_LEAD_SMTP_HOST") ??
    Deno.env.get("AUDIT_LEAD_SMTP_HOST") ??
    Deno.env.get("LEAD_MAGNET_SMTP_HOST");
  const port = Number(
    Deno.env.get("FUNNEL_LEAD_SMTP_PORT") ??
      Deno.env.get("AUDIT_LEAD_SMTP_PORT") ??
      Deno.env.get("LEAD_MAGNET_SMTP_PORT") ??
      "465",
  );
  const user = Deno.env.get("FUNNEL_LEAD_SMTP_USER") ??
    Deno.env.get("AUDIT_LEAD_SMTP_USER") ??
    Deno.env.get("LEAD_MAGNET_SMTP_USER");
  const pass = Deno.env.get("FUNNEL_LEAD_SMTP_PASS") ??
    Deno.env.get("AUDIT_LEAD_SMTP_PASS") ??
    Deno.env.get("LEAD_MAGNET_SMTP_PASS");

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration missing");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"RAIS Website" <${user}>`,
    to: NOTIFY_EMAIL,
    replyTo: lead.email,
    subject,
    text,
  });

  await transporter.sendMail({
    from: `"RAIS" <${user}>`,
    to: lead.email,
    replyTo: NOTIFY_EMAIL,
    subject: "Ihre KI-Roadmap bei RAIS",
    text: [
      `Guten Tag ${lead.name},`,
      "",
      "wir haben Ihre Angaben erhalten. Als Nächstes wählen Sie bitte Ihren Termin:",
      CAL_ROADMAP_URL,
      "",
      "60 Minuten, kostenlos. Wenn es nicht passt, sagen wir das.",
      "",
      "Kevin Ritz",
      "RAIS · Ritz AI Solutions",
    ].join("\n"),
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return allowedOrigins.has(origin ?? "")
      ? new Response(null, { status: 204, headers: corsHeaders(origin) })
      : json({ error: "Forbidden" }, 403, origin);
  }

  if (request.method !== "POST" || !allowedOrigins.has(origin ?? "")) {
    return json({ error: "Forbidden" }, 403, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rateLimitSalt = Deno.env.get("FUNNEL_LEAD_RATE_LIMIT_SALT") ??
    Deno.env.get("AUDIT_LEAD_RATE_LIMIT_SALT");
  const clientIp = request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!supabaseUrl || !serviceRoleKey || !rateLimitSalt || !clientIp) {
    console.error("Funnel function is missing required server configuration.");
    return json({ error: "Service unavailable" }, 503, origin);
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400, origin);
  }

  /* "qualify" teilt sich das Rate-Limit-Kontingent mit "lead".
     register_funnel_attempt akzeptiert nur 'lead' und 'event', damit
     bleibt die SQL-Funktion unveraendert. */
  const kind = input.type === "event"
    ? "event"
    : input.type === "lead" || input.type === "qualify"
    ? "lead"
    : null;
  if (!kind) return json({ error: "Invalid request" }, 400, origin);

  try {
    const ipHash = await sha256(`${rateLimitSalt}:${clientIp}`);
    const limited = await rateLimit(supabaseUrl, serviceRoleKey, ipHash, kind);
    if (limited === "error") return json({ error: "Service unavailable" }, 503, origin);
    if (limited !== true) return json({ error: "Too many requests" }, 429, origin);

    if (kind === "event") {
      const event = textOrNull(input.event, 40);
      const vorgangstyp = textOrNull(input.vorgangstyp, 40);
      const source = textOrNull(input.quelle, 100) ?? textOrNull(input.source, 100);
      const sessionIdRaw = textOrNull(input.session_id, 36);
      const sessionId =
        sessionIdRaw && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionIdRaw)
          ? sessionIdRaw
          : null;
      if (
        !event ||
        !ALLOWED_EVENTS.has(event) ||
        (vorgangstyp !== null && !ALLOWED_VORGANG.has(vorgangstyp)) ||
        (source !== null && !/^[a-z0-9_-]+$/i.test(source))
      ) {
        return json({ error: "Invalid request" }, 400, origin);
      }
      await persistEvent(supabaseUrl, serviceRoleKey, event, vorgangstyp, source, sessionId);
      return json({ ok: true }, 201, origin);
    }

    /* Die drei Fragen vor dem Kalender. Kein Name, keine E-Mail,
       kein Telefon: die entstehen erst in der Cal-Maske. */
    if (input.type === "qualify") {
      const pain = textOrNull(input.pain, 40);
      const ecosystem = textOrNull(input.ecosystem, 20);
      const crm = textOrNull(input.crm, 20);
      const source = textOrNull(input.quelle, 100) ?? textOrNull(input.source, 100);
      const consentText = textOrNull(input.consent_text, 500);
      const volumenWoche = numberInRange(input.volumenWoche ?? input.volumen_woche, 5, 150);
      const sessionIdRaw = textOrNull(input.session_id, 36);
      const sessionId =
        sessionIdRaw && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionIdRaw)
          ? sessionIdRaw
          : null;

      if (
        !pain ||
        !ALLOWED_PAIN.has(pain) ||
        !ecosystem ||
        !ALLOWED_ECOSYSTEM.has(ecosystem) ||
        !crm ||
        !ALLOWED_CRM.has(crm) ||
        volumenWoche === null ||
        !consentText ||
        input.privacy_ack !== true ||
        (source !== null && !/^[a-z0-9_-]+$/i.test(source))
      ) {
        return json({ error: "Invalid request" }, 400, origin);
      }

      await persistQualify(supabaseUrl, serviceRoleKey, {
        session_id: sessionId,
        pain,
        ecosystem,
        crm,
        volumen_woche: Math.round(volumenWoche),
        source,
        consent_text: consentText,
        ip_hash: ipHash,
      });
      return json({ ok: true }, 201, origin);
    }

    const name = textOrNull(input.name, 200);
    const email = textOrNull(input.email, 254)?.toLowerCase();
    const phoneRaw = textOrNull(input.phone, 40);
    const phone = phoneRaw ? phoneRaw.replace(/[^\d+()\s/-]/g, "").trim() : null;
    const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
    const vorgangstyp = textOrNull(input.vorgangstyp, 40);
    const kanal = textOrNull(input.kanal, 20);
    const crm = textOrNull(input.crm, 20);
    const kalender = textOrNull(input.kalender, 20);
    const postfach = textOrNull(input.postfach, 20);
    const source = textOrNull(input.quelle, 100) ?? textOrNull(input.source, 100);
    const formOpenedAt = textOrNull(input.form_opened_at, 40);
    const volumenWoche = numberInRange(input.volumenWoche ?? input.volumen_woche, 5, 150);
    const minutenProVorgang = numberInRange(input.minutenProVorgang ?? input.minuten, 3, 40);
    const stundensatz = numberInRange(input.stundensatz, 10, 200);
    const stundenMonat = numberInRange(input.stundenMonat ?? input.stunden_monat, 0, 2000);
    const euroJahr = numberInRange(input.euroJahr ?? input.euro_jahr, 0, 5_000_000);
    const rueckgewinnStunden = numberInRange(
      input.rueckgewinnStunden ?? input.rueckgewinn_stunden,
      0,
      2000,
    );

    const openedAge = formOpenedAt ? Date.now() - Date.parse(formOpenedAt) : NaN;
    const openedOk = !Number.isNaN(openedAge) && openedAge >= 1500 && openedAge <= 60 * 60 * 1000;

    if (
      !name ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone ||
      phoneDigits.length < 6 ||
      phoneDigits.length > 20 ||
      !vorgangstyp ||
      !ALLOWED_VORGANG.has(vorgangstyp) ||
      volumenWoche === null ||
      minutenProVorgang === null ||
      !kanal ||
      !ALLOWED_KANAL.has(kanal) ||
      stundensatz === null ||
      !crm ||
      !ALLOWED_CRM.has(crm) ||
      !kalender ||
      !ALLOWED_KALENDER.has(kalender) ||
      !postfach ||
      !ALLOWED_POSTFACH.has(postfach) ||
      input.privacy_ack !== true ||
      (source !== null && !/^[a-z0-9_-]+$/i.test(source)) ||
      !formOpenedAt ||
      Number.isNaN(Date.parse(formOpenedAt)) ||
      !openedOk
    ) {
      return json({ error: "Invalid request" }, 400, origin);
    }

    const lead: FunnelLead = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      vorgangstyp,
      volumenWoche: Math.round(volumenWoche),
      minutenProVorgang: Math.round(minutenProVorgang),
      kanal,
      stundensatz,
      crm,
      kalender,
      postfach,
      stundenMonat,
      euroJahr: euroJahr === null ? null : Math.round(euroJahr),
      rueckgewinnStunden,
      source,
      marketing: input.marketing === true,
    };

    await persistLead(supabaseUrl, serviceRoleKey, lead);
    const consents = await persistConsents(supabaseUrl, serviceRoleKey, lead, ipHash);

    let notionUrl: string | null = null;
    try {
      notionUrl = await createNotionLead(lead);
    } catch (notionError) {
      console.error("Funnel lead Notion sync failed.", notionError);
    }

    try {
      await sendLeadEmail(lead, notionUrl, consents);
    } catch (mailError) {
      console.error("Funnel lead email failed.", mailError);
    }

    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error("Funnel submission failed.", error);
    return json({ error: "Service unavailable" }, 503, origin);
  }
});
