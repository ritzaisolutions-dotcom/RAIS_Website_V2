import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  type AvailabilityWindow,
  type EventType,
  type Interval,
  type Question,
  type Rule,
  evaluateRules,
  formatSlotLabel,
  hashIp,
  overlaps,
  expandWithBuffer,
  slotFitsAvailability,
  validateAnswers,
} from "../_shared/booking-core.ts";
import {
  createCalendarEvent,
  gcalConfigured,
  queryFreeBusy,
} from "../_shared/booking-gcal.ts";

const allowedOrigins = new Set(
  (Deno.env.get("RAIS_ALLOWED_ORIGINS") ??
    "https://ritz-ai.solutions,https://www.ritz-ai.solutions,http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

const RATE_WINDOW_MS = 60 * 60_000;
const RATE_MAX = 12;

function cors(origin: string | null): HeadersInit {
  const allow = origin && allowedOrigins.has(origin)
    ? origin
    : [...allowedOrigins][0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function json(
  status: number,
  body: unknown,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: cors(origin),
  });
}

function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return true; // same-origin / curl / server tools
  return allowedOrigins.has(origin);
}

async function sendConfirmMails(input: {
  name: string;
  email: string;
  label: string;
  bookingId: string;
}): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  const from = Deno.env.get("BOOKING_MAIL_FROM")?.trim() ||
    "RAIS <kevin@ritz-ai.solutions>";
  const internal = Deno.env.get("BOOKING_MAIL_INTERNAL")?.trim() ||
    "kevin@ritz-ai.solutions";
  if (!apiKey) return;

  const leadHtml =
    `<p>Hallo ${input.name},</p><p>dein Erstgespräch ist bestätigt: <strong>${input.label}</strong> (Europe/Berlin).</p><p>Du erhältst ggf. zusätzlich eine Google-Calendar-Einladung.</p>`;
  const internalHtml =
    `<p>Neue Buchung: ${input.name} &lt;${input.email}&gt;</p><p>${input.label}</p><p>ID: ${input.bookingId}</p>`;

  async function send(to: string, subject: string, html: string) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error("resend", to, await res.text());
    }
  }

  await Promise.all([
    send(input.email, `Bestätigung: Erstgespräch ${input.label}`, leadHtml),
    send(internal, `RAIS Buchung: ${input.name}`, internalHtml),
  ]);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" }, origin);
  }
  if (!originAllowed(origin)) {
    return json(403, { error: "origin_forbidden" }, origin);
  }

  let holdToken: string | null = null;
  let sb: ReturnType<typeof createClient> | null = null;

  try {
    const body = await req.json() as {
      event?: string;
      startsAt?: string;
      endsAt?: string;
      name?: string;
      email?: string;
      phone?: string;
      answers?: Record<string, unknown>;
      source?: string;
      idempotencyKey?: string;
      honeypot?: string;
      company_website?: string;
    };

    const honeypot = String(body.honeypot || body.company_website || "").trim();
    if (honeypot) {
      return json(200, { outcome: "proceed", ok: true }, origin);
    }

    const slug = (body.event || "erstgespraech").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const source = String(body.source || "").trim() || null;
    const answers = body.answers && typeof body.answers === "object"
      ? body.answers
      : {};
    const startsAt = body.startsAt ? new Date(body.startsAt) : null;
    const endsAt = body.endsAt ? new Date(body.endsAt) : null;
    const idempotencyKey = String(body.idempotencyKey || "").trim() || null;
    const funnelSource = source === "ai-roadmap";

    if (!name || !email || !email.includes("@")) {
      return json(400, { error: "invalid_contact" }, origin);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceKey) {
      return json(500, { error: "server_misconfigured" }, origin);
    }
    sb = createClient(supabaseUrl, serviceKey);
    const ipHash = hashIp(
      clientIp(req),
      Deno.env.get("BOOKING_IP_SALT") || "rais-booking",
    );

    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count: recentCount } = await sb.from("bookings").select("id", {
      count: "exact",
      head: true,
    }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((recentCount ?? 0) >= RATE_MAX) {
      return json(429, { error: "rate_limited" }, origin);
    }

    if (idempotencyKey) {
      const { data: existing } = await sb.from("bookings").select(
        "id,status,reject_reason,starts_at,gcal_event_id",
      ).eq("idempotency_key", idempotencyKey).maybeSingle();
      if (existing) {
        if (existing.status === "rejected_inquiry") {
          return json(200, {
            outcome: "reject",
            rejectMessage: existing.reject_reason,
            bookingId: existing.id,
          }, origin);
        }
        return json(200, {
          outcome: "proceed",
          bookingId: existing.id,
          startsAt: existing.starts_at,
        }, origin);
      }
    }

    const { data: event, error: eventErr } = await sb
      .from("booking_event_types")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (eventErr || !event) {
      return json(404, { error: "event_not_found" }, origin);
    }
    const et = event as EventType;

    const [{ data: questions }, { data: rules }] = await Promise.all([
      sb.from("booking_questions").select(
        "id,key,label,type,required,options,sort",
      ).eq("event_type_id", et.id).eq("active", true).order("sort"),
      sb.from("booking_rules").select(
        "id,name,sort,condition,outcome,reject_message",
      ).eq("event_type_id", et.id).eq("active", true).order("sort"),
    ]);

    if (!funnelSource) {
      const invalid = validateAnswers((questions ?? []) as Question[], answers);
      if (invalid) return json(400, { error: invalid }, origin);
    }

    const decision = funnelSource
      ? { outcome: "proceed" as const }
      : evaluateRules((rules ?? []) as Rule[], answers);

    if (decision.outcome === "reject") {
      const { data: rejected, error } = await sb.from("bookings").insert({
        event_type_id: et.id,
        status: "rejected_inquiry",
        name,
        email,
        phone: phone || null,
        answers,
        rule_outcome: "reject",
        reject_reason: decision.rejectMessage,
        source,
        ip_hash: ipHash,
        idempotency_key: idempotencyKey,
        timezone: et.timezone,
      }).select("id").single();
      if (error) {
        console.error(error);
        return json(500, { error: "persist_failed" }, origin);
      }
      return json(200, {
        outcome: "reject",
        rejectMessage: decision.rejectMessage,
        bookingId: rejected.id,
      }, origin);
    }

    if (!startsAt || !endsAt || Number.isNaN(startsAt.getTime())) {
      return json(400, { error: "invalid_slot" }, origin);
    }

    const [{ data: windows }, { data: blackoutRows }] = await Promise.all([
      sb.from("booking_availability").select("weekday,start_time,end_time")
        .eq("event_type_id", et.id).eq("active", true),
      sb.from("booking_blackouts").select("starts_at,ends_at")
        .eq("event_type_id", et.id),
    ]);
    const blackouts: Interval[] = (blackoutRows ?? []).map((b) => ({
      start: new Date(b.starts_at),
      end: new Date(b.ends_at),
    }));
    if (
      !slotFitsAvailability(
        et,
        (windows ?? []) as AvailabilityWindow[],
        blackouts,
        startsAt,
        endsAt,
      )
    ) {
      return json(409, { error: "slot_not_available" }, origin);
    }

    if (gcalConfigured()) {
      try {
        const busy = await queryFreeBusy(
          et.gcal_calendar_id || "primary",
          startsAt,
          endsAt,
        );
        const padded = expandWithBuffer(
          { start: startsAt, end: endsAt },
          et.buffer_before_min,
          et.buffer_after_min,
        );
        if (busy.some((b) => overlaps(padded, b))) {
          return json(409, { error: "slot_busy" }, origin);
        }
      } catch (e) {
        console.error("freebusy_book", e);
      }
    }

    holdToken = crypto.randomUUID();
    const holdExpires = new Date(Date.now() + 5 * 60_000);
    const { error: holdErr } = await sb.rpc("claim_booking_hold", {
      p_event_type_id: et.id,
      p_starts_at: startsAt.toISOString(),
      p_ends_at: endsAt.toISOString(),
      p_hold_token: holdToken,
      p_expires_at: holdExpires.toISOString(),
    });
    if (holdErr) {
      const msg = String(holdErr.message || "");
      if (msg.includes("booking_slot_taken") || msg.includes("booking_slot_busy")) {
        return json(409, { error: "slot_taken" }, origin);
      }
      console.error(holdErr);
      return json(409, { error: "slot_busy" }, origin);
    }

    const { data: booking, error: bookErr } = await sb.from("bookings").insert({
      event_type_id: et.id,
      status: "confirmed",
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      timezone: et.timezone,
      name,
      email,
      phone: phone || null,
      answers,
      rule_outcome: "proceed",
      source,
      ip_hash: ipHash,
      idempotency_key: idempotencyKey,
    }).select("id").single();

    if (bookErr) {
      if (String(bookErr.message || "").includes("booking_slot_taken")) {
        return json(409, { error: "slot_taken" }, origin);
      }
      console.error(bookErr);
      return json(500, { error: "persist_failed" }, origin);
    }

    let gcalEventId: string | null = null;
    if (gcalConfigured()) {
      try {
        const answerLines = Object.entries(answers)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join("\n");
        gcalEventId = await createCalendarEvent({
          calendarId: et.gcal_calendar_id || "primary",
          summary: `${et.title}: ${name}`,
          description:
            `RAIS Buchung\nName: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\nQuelle: ${
              source || "-"
            }\n\nAntworten:\n${answerLines}`,
          startsAt,
          endsAt,
          attendeeEmail: email,
          attendeeName: name,
          timezone: et.timezone,
        });
        await sb.from("bookings").update({ gcal_event_id: gcalEventId }).eq(
          "id",
          booking.id,
        );
      } catch (e) {
        console.error("gcal", e);
        // Keep status confirmed capacity: mark sync_failed but overlap still applies.
        await sb.from("bookings").update({ status: "sync_failed" }).eq(
          "id",
          booking.id,
        );
      }
    }

    const label = formatSlotLabel(startsAt);
    await sendConfirmMails({
      name,
      email,
      label,
      bookingId: booking.id,
    });

    return json(200, {
      outcome: "proceed",
      bookingId: booking.id,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      label,
      gcalSynced: Boolean(gcalEventId),
    }, origin);
  } catch (e) {
    console.error(e);
    return json(500, { error: "internal" }, origin);
  } finally {
    if (sb && holdToken) {
      await sb.from("booking_holds").delete().eq("hold_token", holdToken);
    }
  }
});
