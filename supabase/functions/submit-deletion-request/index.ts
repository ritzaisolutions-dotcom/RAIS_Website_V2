import nodemailer from "npm:nodemailer@6.10.1";
import { corsHeaders, isAllowedOrigin } from "../_shared/booking-cors.ts";

const NOTIFY_EMAIL = Deno.env.get("AUDIT_LEAD_NOTIFY_EMAIL") ?? "kevin@ritz-ai.solutions";

type Scope = "whatsapp" | "anfrage" | "termin" | "alles" | "sonstiges";

type DeletionRequest = {
  name: string;
  email: string;
  phone: string | null;
  scope: Scope;
  message: string | null;
};

const SCOPES = new Set<Scope>(["whatsapp", "anfrage", "termin", "alles", "sonstiges"]);

const scopeLabel = (scope: Scope): string => {
  switch (scope) {
    case "whatsapp":
      return "WhatsApp";
    case "anfrage":
      return "Website-Anfrage";
    case "termin":
      return "Terminbuchung";
    case "alles":
      return "Alle bei RAIS gespeicherten Daten";
    case "sonstiges":
      return "Sonstiges";
    default: {
      const exhaustive: never = scope;
      return exhaustive;
    }
  }
};

const json = (body: Record<string, string | boolean>, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin, "POST, OPTIONS"),
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

async function allowAttempt(
  supabaseUrl: string,
  serviceRoleKey: string,
  ipHash: string,
): Promise<boolean> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/register_audit_lead_attempt`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "apikey": serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_ip_hash: ipHash }),
  });

  if (!response.ok) {
    console.error("Deletion request rate limit check failed.", response.status);
    throw new Error("rate limit unavailable");
  }

  return await response.json() === true;
}

async function deliver(request: DeletionRequest): Promise<void> {
  const lines = [
    "Datenlöschanfrage über /datenloeschung.html",
    "",
    `Name: ${request.name}`,
    `E-Mail: ${request.email}`,
    `Telefon: ${request.phone ?? "—"}`,
    `Bereich: ${scopeLabel(request.scope)}`,
    `Nachricht: ${request.message ?? "—"}`,
    `Eingang: ${new Date().toISOString()}`,
  ];
  const subject = `Datenlöschanfrage: ${request.name}`;
  const text = lines.join("\n");

  const host = Deno.env.get("AUDIT_LEAD_SMTP_HOST") ?? Deno.env.get("LEAD_MAGNET_SMTP_HOST");
  const port = Number(Deno.env.get("AUDIT_LEAD_SMTP_PORT") ?? Deno.env.get("LEAD_MAGNET_SMTP_PORT") ?? "465");
  const user = Deno.env.get("AUDIT_LEAD_SMTP_USER") ?? Deno.env.get("LEAD_MAGNET_SMTP_USER");
  const pass = Deno.env.get("AUDIT_LEAD_SMTP_PASS") ?? Deno.env.get("LEAD_MAGNET_SMTP_PASS");

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"RAIS Website" <${user}>`,
      to: NOTIFY_EMAIL,
      replyTo: request.email,
      subject,
      text,
    });
    return;
  }

  const webhookUrl = Deno.env.get("AUDIT_LEAD_NOTIFY_WEBHOOK_URL");
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "data_deletion",
        to: NOTIFY_EMAIL,
        subject,
        text,
        record: {
          name: request.name,
          email: request.email,
          phone: request.phone,
          scope: request.scope,
          message: request.message,
        },
      }),
    });
    if (!response.ok) throw new Error(`Notify webhook failed (${response.status})`);
    return;
  }

  throw new Error("No delivery channel configured");
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return isAllowedOrigin(origin)
      ? new Response(null, { status: 204, headers: corsHeaders(origin, "POST, OPTIONS") })
      : json({ error: "Forbidden" }, 403, origin);
  }

  if (request.method !== "POST" || !isAllowedOrigin(origin)) {
    return json({ error: "Forbidden" }, 403, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rateLimitSalt = Deno.env.get("DELETION_RATE_LIMIT_SALT") ??
    Deno.env.get("AUDIT_LEAD_RATE_LIMIT_SALT");
  const clientIp = request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!supabaseUrl || !serviceRoleKey || !rateLimitSalt || !clientIp) {
    console.error("Deletion request function is missing required server configuration.");
    return json({ error: "Service unavailable" }, 503, origin);
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400, origin);
  }

  const honeypot = typeof input.company === "string" ? input.company.trim() : "";
  if (honeypot) return json({ ok: true }, 201, origin);

  try {
    const name = textOrNull(input.name, 200);
    const email = textOrNull(input.email, 254)?.toLowerCase();
    const phoneRaw = textOrNull(input.phone, 40);
    const phone = phoneRaw ? phoneRaw.replace(/[^\d+()\s/-]/g, "").trim() : null;
    const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
    const scopeRaw = textOrNull(input.scope, 20);
    const scope = scopeRaw && SCOPES.has(scopeRaw as Scope) ? scopeRaw as Scope : null;
    const message = textOrNull(input.message, 2000);
    const formOpenedAt = textOrNull(input.form_opened_at, 40);

    if (
      !name ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (phone !== null && (phoneDigits.length < 6 || phoneDigits.length > 20)) ||
      !scope ||
      (scope === "sonstiges" && !message) ||
      input.confirm !== true ||
      !formOpenedAt ||
      Number.isNaN(Date.parse(formOpenedAt)) ||
      Date.now() - Date.parse(formOpenedAt) < 1500 ||
      Date.now() - Date.parse(formOpenedAt) > 60 * 60 * 1000
    ) {
      return json({ error: "Invalid request" }, 400, origin);
    }

    const ipHash = await sha256(`deletion:${rateLimitSalt}:${clientIp}`);
    if (!await allowAttempt(supabaseUrl, serviceRoleKey, ipHash)) {
      return json({ error: "Too many requests" }, 429, origin);
    }

    await deliver({ name, email, phone, scope, message });
    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error("Deletion request failed.", error);
    return json({ error: "Service unavailable" }, 503, origin);
  }
});
