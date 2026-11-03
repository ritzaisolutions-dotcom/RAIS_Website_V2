import nodemailer from "npm:nodemailer@6.10.1";

/**
 * Cal.com BOOKING_CREATED → Notion CRM (Inbound Website).
 * Kein Lead-Inhalt in Supabase/inbound_leads.
 * Auth: Cal Webhook-Secret (X-Cal-Signature-256).
 */

const NOTIFY_EMAIL = Deno.env.get("AUDIT_LEAD_NOTIFY_EMAIL") ?? "kevin@ritz-ai.solutions";
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const PAGE_URL = "https://ritz-ai.solutions/";

type LeadPayload = {
  name: string;
  email: string;
  phone: string | null;
  painPoint: string | null;
  salesPerYear: string | null;
  socialMedia: string | null;
  socialMediaHow: string | null;
  bookingUid: string | null;
  startTime: string | null;
  source: string | null;
};

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const richText = (content: string) => ({
  rich_text: [{ type: "text", text: { content: content.slice(0, 1900) } }],
});

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function responseValue(responses: Record<string, unknown> | null, slug: string): string | null {
  if (!responses) return null;
  const entry = responses[slug];
  if (typeof entry === "string" || typeof entry === "number") {
    const text = String(entry).trim();
    return text || null;
  }
  const obj = asRecord(entry);
  if (!obj) return null;
  const value = obj.value;
  if (typeof value === "string" || typeof value === "number") {
    const text = String(value).trim();
    return text || null;
  }
  if (Array.isArray(value) && value.length) {
    const text = value.map((v) => String(v).trim()).filter(Boolean).join(", ");
    return text || null;
  }
  return null;
}

function firstAttendee(payload: Record<string, unknown>): { name: string | null; email: string | null } {
  const attendees = payload.attendees;
  if (!Array.isArray(attendees) || !attendees.length) return { name: null, email: null };
  const first = asRecord(attendees[0]);
  if (!first) return { name: null, email: null };
  const name = typeof first.name === "string" ? first.name.trim() : null;
  const email = typeof first.email === "string" ? first.email.trim().toLowerCase() : null;
  return { name: name || null, email: email || null };
}

function parseLead(body: Record<string, unknown>): LeadPayload | null {
  const trigger = String(body.triggerEvent ?? body.trigger ?? "");
  const payload = asRecord(body.payload) ?? body;
  if (trigger && trigger !== "BOOKING_CREATED") return null;

  const responses = asRecord(payload.responses);
  const attendee = firstAttendee(payload);
  const name = responseValue(responses, "name") ?? attendee.name;
  const emailRaw = responseValue(responses, "email") ?? attendee.email;
  const email = emailRaw ? emailRaw.toLowerCase() : null;
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const phone =
    responseValue(responses, "attendeePhoneNumber") ??
    responseValue(responses, "phone") ??
    null;

  return {
    name: name.slice(0, 200),
    email: email.slice(0, 254),
    phone: phone ? phone.replace(/[^\d+()\s/-]/g, "").trim().slice(0, 40) : null,
    painPoint: responseValue(responses, "pain"),
    salesPerYear: responseValue(responses, "sales_per_year"),
    socialMedia: responseValue(responses, "social_media"),
    socialMediaHow: responseValue(responses, "social_media_how"),
    bookingUid: typeof payload.uid === "string" ? payload.uid : null,
    startTime: typeof payload.startTime === "string" ? payload.startTime : null,
    source: "cal-strategiegespraech",
  };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyCalSignature(rawBody: string, header: string | null, secret: string): Promise<boolean> {
  if (!header) return false;
  const expected = await hmacSha256Hex(secret, rawBody);
  if (header.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i += 1) {
    ok |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return ok === 0;
}

async function createNotionLead(lead: LeadPayload): Promise<string | null> {
  const notionToken = Deno.env.get("NOTION_TOKEN");
  const notionDatabaseId = Deno.env.get("NOTION_AUDIT_LEADS_DATABASE_ID");
  if (!notionToken || !notionDatabaseId) {
    throw new Error("Notion configuration missing");
  }

  const attackNotes = [
    lead.painPoint ? `Schmerz: ${lead.painPoint}` : null,
    lead.salesPerYear ? `Verkäufe/Jahr: ${lead.salesPerYear}` : null,
    lead.socialMedia ? `Social Media: ${lead.socialMedia}` : null,
    lead.socialMediaHow ? `Social Media Wie: ${lead.socialMediaHow}` : null,
    lead.phone ? `Telefon: ${lead.phone}` : null,
    lead.startTime ? `Termin: ${lead.startTime}` : null,
    lead.bookingUid ? `Cal-UID: ${lead.bookingUid}` : null,
    "Kanal: Inbound Website (Cal.com Strategiegespräch)",
  ].filter(Boolean).join("\n");

  const properties: Record<string, unknown> = {
    Firma: {
      title: [{ type: "text", text: { content: lead.name.slice(0, 200) } }],
    },
    "GF/Entscheider": richText(lead.name),
    "E-Mail": { email: lead.email },
    Status: { select: { name: "Neu" } },
    Quelle: { select: { name: "Inbound Website" } },
    "Quell-URL": { url: PAGE_URL },
    Angriffspunkte: richText(attackNotes),
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
    console.error("Notion cal lead create failed.", response.status, body.slice(0, 500));
    throw new Error("Notion create failed");
  }

  const page = await response.json() as { url?: string };
  return page.url ?? null;
}

async function sendLeadEmail(lead: LeadPayload, notionUrl: string | null): Promise<void> {
  const lines = [
    `Name: ${lead.name}`,
    `E-Mail: ${lead.email}`,
    `Telefon: ${lead.phone ?? "—"}`,
    `Schmerz: ${lead.painPoint ?? "—"}`,
    `Verkäufe/Jahr: ${lead.salesPerYear ?? "—"}`,
    `Social Media: ${lead.socialMedia ?? "—"}`,
    `Termin: ${lead.startTime ?? "—"}`,
    `Cal-UID: ${lead.bookingUid ?? "—"}`,
    `Notion: ${notionUrl ?? "—"}`,
  ];
  const subject = `Neuer Cal-Lead: ${lead.name}`;
  const text = lines.join("\n");

  const webhookUrl = Deno.env.get("AUDIT_LEAD_NOTIFY_WEBHOOK_URL");
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "cal_lead",
        to: NOTIFY_EMAIL,
        subject,
        text,
        record: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          pain_point: lead.painPoint,
          sales_per_year: lead.salesPerYear,
          social_media: lead.socialMedia,
          booking_uid: lead.bookingUid,
          start_time: lead.startTime,
          notion_url: notionUrl,
        },
      }),
    });
    if (!response.ok) throw new Error(`Notify webhook failed (${response.status})`);
    return;
  }

  const host = Deno.env.get("AUDIT_LEAD_SMTP_HOST") ?? Deno.env.get("LEAD_MAGNET_SMTP_HOST");
  const port = Number(Deno.env.get("AUDIT_LEAD_SMTP_PORT") ?? Deno.env.get("LEAD_MAGNET_SMTP_PORT") ?? "465");
  const user = Deno.env.get("AUDIT_LEAD_SMTP_USER") ?? Deno.env.get("LEAD_MAGNET_SMTP_USER");
  const pass = Deno.env.get("AUDIT_LEAD_SMTP_PASS") ?? Deno.env.get("LEAD_MAGNET_SMTP_PASS");
  if (!host || !user || !pass) {
    console.error("Cal lead mail skipped: SMTP missing");
    return;
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
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secret = Deno.env.get("CAL_WEBHOOK_SECRET");
  if (!secret) {
    console.error("CAL_WEBHOOK_SECRET missing");
    return json({ error: "Service unavailable" }, 503);
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256");
  if (!(await verifyCalSignature(rawBody, signature, secret))) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const trigger = String(body.triggerEvent ?? "");
  if (trigger && trigger !== "BOOKING_CREATED") {
    return json({ ok: true, skipped: true, trigger }, 200);
  }

  const lead = parseLead(body);
  if (!lead) {
    console.error("Cal lead parse failed", trigger, Object.keys(body));
    return json({ error: "Invalid payload" }, 400);
  }

  try {
    const notionUrl = await createNotionLead(lead);
    try {
      await sendLeadEmail(lead, notionUrl);
    } catch (mailError) {
      console.error("Cal lead email failed.", mailError);
    }
    return json({ ok: true, notion: Boolean(notionUrl) }, 201);
  } catch (error) {
    console.error("Cal lead submission failed.", error);
    return json({ error: "Service unavailable" }, 503);
  }
});
