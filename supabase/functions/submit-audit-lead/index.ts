import nodemailer from "npm:nodemailer@6.10.1";

const allowedOrigins = new Set(
  (Deno.env.get("RAIS_ALLOWED_ORIGINS") ??
    "https://ritz-ai.solutions,https://www.ritz-ai.solutions")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const NOTIFY_EMAIL = Deno.env.get("AUDIT_LEAD_NOTIFY_EMAIL") ?? "kevin@ritz-ai.solutions";
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

type LeadPayload = {
  name: string;
  email: string;
  phone: string | null;
  inquiryVolume: number | null;
  painPoint: string | null;
  teamSize: string | null;
  icpSegment: string | null;
  source: string | null;
};

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

const mapTeamSize = (teamSize: string | null): string | null => {
  switch (teamSize) {
    case "unter-5":
      return "3-5";
    case "5-10":
    case "11-25":
      return "5-25";
    case "ueber-25":
      return "25+";
    default:
      return null;
  }
};

const richText = (content: string) => ({
  rich_text: [{ type: "text", text: { content: content.slice(0, 1900) } }],
});

async function persistLead(
  supabaseUrl: string,
  serviceRoleKey: string,
  lead: LeadPayload,
): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/inbound_leads`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      inquiry_volume: lead.inquiryVolume,
      pain_point: lead.painPoint,
      team_size: lead.teamSize,
      icp_segment: lead.icpSegment,
      source: lead.source,
      privacy_ack: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Audit lead persist failed.", response.status, body.slice(0, 500));
    throw new Error("Lead persist failed");
  }
}

async function createNotionLead(lead: LeadPayload): Promise<string | null> {
  const notionToken = Deno.env.get("NOTION_TOKEN");
  const notionDatabaseId = Deno.env.get("NOTION_AUDIT_LEADS_DATABASE_ID");
  if (!notionToken || !notionDatabaseId) {
    throw new Error("Notion configuration missing");
  }

  const title = lead.name.slice(0, 200);
  const attackNotes = [
    lead.painPoint ? `Pain Point: ${lead.painPoint}` : null,
    lead.phone ? `Telefon: ${lead.phone}` : null,
    lead.inquiryVolume !== null ? `Anfragen/Woche: ${lead.inquiryVolume}` : null,
    lead.icpSegment ? `ICP: ${lead.icpSegment}` : null,
    lead.source ? `Form-Source: ${lead.source}` : null,
    "Kanal: Inbound Website (Audit-Buchungsmodal)",
  ].filter(Boolean).join("\n");

  const mitarbeiterzahl = mapTeamSize(lead.teamSize);
  const properties: Record<string, unknown> = {
    Firma: {
      title: [{ type: "text", text: { content: title } }],
    },
    "GF/Entscheider": richText(lead.name),
    "E-Mail": { email: lead.email },
    Status: { select: { name: "Neu" } },
    Quelle: { select: { name: "Inbound Website" } },
    "Quell-URL": { url: "https://ritz-ai.solutions/" },
    Angriffspunkte: richText(attackNotes),
  };

  if (mitarbeiterzahl) {
    properties.Mitarbeiterzahl = { select: { name: mitarbeiterzahl } };
  }

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
    console.error("Notion lead create failed.", response.status, body.slice(0, 500));
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
    `Anfragen/Woche: ${lead.inquiryVolume ?? "—"}`,
    `Pain Point: ${lead.painPoint ?? "—"}`,
    `Teamgröße: ${lead.teamSize ?? "—"}`,
    `ICP: ${lead.icpSegment ?? "—"}`,
    `Quelle: ${lead.source ?? "—"}`,
    `Notion: ${notionUrl ?? "—"}`,
  ];
  const subject = `Neuer Audit-Lead: ${lead.name}`;
  const text = lines.join("\n");

  const webhookUrl = Deno.env.get("AUDIT_LEAD_NOTIFY_WEBHOOK_URL");
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "audit_lead",
        to: NOTIFY_EMAIL,
        subject,
        text,
        record: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          inquiry_volume: lead.inquiryVolume,
          pain_point: lead.painPoint,
          team_size: lead.teamSize,
          icp_segment: lead.icpSegment,
          source: lead.source,
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
  const rateLimitSalt = Deno.env.get("AUDIT_LEAD_RATE_LIMIT_SALT");
  const clientIp = request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!supabaseUrl || !serviceRoleKey || !rateLimitSalt || !clientIp) {
    console.error("Audit lead function is missing required server configuration.");
    return json({ error: "Service unavailable" }, 503, origin);
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400, origin);
  }

  try {
    const name = textOrNull(input.name, 200);
    const email = textOrNull(input.email, 254)?.toLowerCase();
    const phoneRaw = textOrNull(input.phone, 40);
    const phone = phoneRaw ? phoneRaw.replace(/[^\d+()\s/-]/g, "").trim() : null;
    const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
    const inquiryVolumeRaw = input.inquiry_volume;
    const inquiryVolume = typeof inquiryVolumeRaw === "number"
      ? inquiryVolumeRaw
      : (typeof inquiryVolumeRaw === "string" && inquiryVolumeRaw.trim() !== ""
        ? Number(inquiryVolumeRaw)
        : null);
    const painPoint = textOrNull(input.pain_point, 80);
    const teamSize = textOrNull(input.team_size, 20);
    const icpSegment = textOrNull(input.icp_segment, 20);
    const source = textOrNull(input.source, 100);
    const formOpenedAt = textOrNull(input.form_opened_at, 40);
    const allowedPainPoints = new Set([
      "inseratsanfragen-qualifizieren",
      "terminierung-besichtigungen",
      "onboarding-vertragsunterschrift",
      "wiederkehrende-kundenfragen",
      "gesamtprozess",
      "anderes",
    ]);
    const allowedTeamSizes = new Set(["unter-5", "5-10", "11-25", "ueber-25"]);
    const allowedIcpSegments = new Set(["makler", "verwaltung"]);

    if (
      !name ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone ||
      phoneDigits.length < 6 ||
      phoneDigits.length > 20 ||
      inquiryVolume === null ||
      !Number.isFinite(inquiryVolume) ||
      inquiryVolume < 0 ||
      inquiryVolume > 300 ||
      input.privacy_ack !== true ||
      (painPoint !== null && !allowedPainPoints.has(painPoint)) ||
      (teamSize !== null && !allowedTeamSizes.has(teamSize)) ||
      (icpSegment !== null && !allowedIcpSegments.has(icpSegment)) ||
      (source !== null && !/^[a-z0-9_-]+$/i.test(source)) ||
      !formOpenedAt ||
      Number.isNaN(Date.parse(formOpenedAt)) ||
      Date.now() - Date.parse(formOpenedAt) < 1500 ||
      Date.now() - Date.parse(formOpenedAt) > 60 * 60 * 1000
    ) {
      return json({ error: "Invalid request" }, 400, origin);
    }

    const ipHash = await sha256(`${rateLimitSalt}:${clientIp}`);
    const rateLimitResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/register_audit_lead_attempt`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_ip_hash: ipHash }),
    });

    if (!rateLimitResponse.ok) {
      console.error("Audit lead rate limit check failed.", rateLimitResponse.status);
      return json({ error: "Service unavailable" }, 503, origin);
    }

    if (await rateLimitResponse.json() !== true) {
      return json({ error: "Too many requests" }, 429, origin);
    }

    const lead: LeadPayload = {
      name,
      email,
      phone,
      inquiryVolume: Math.round(inquiryVolume),
      painPoint,
      teamSize,
      icpSegment,
      source,
    };

    // Durable store first: a Notion or mail outage must never lose a booked lead.
    await persistLead(supabaseUrl, serviceRoleKey, lead);

    let notionUrl: string | null = null;
    try {
      notionUrl = await createNotionLead(lead);
    } catch (notionError) {
      // Lead is already persisted in inbound_leads; Notion sync is best-effort.
      console.error("Audit lead Notion sync failed.", notionError);
    }

    try {
      await sendLeadEmail(lead, notionUrl);
    } catch (mailError) {
      // Lead is already persisted; do not fail the booking UX for mail outages.
      console.error("Audit lead email failed.", mailError);
    }

    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error("Audit lead submission failed.", error);
    return json({ error: "Service unavailable" }, 503, origin);
  }
});
