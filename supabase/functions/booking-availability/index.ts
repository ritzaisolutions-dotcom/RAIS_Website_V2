import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  type AvailabilityWindow,
  type EventType,
  type Interval,
  type Question,
  generateCandidateSlots,
} from "../_shared/booking-core.ts";
import { gcalConfigured, queryFreeBusy } from "../_shared/booking-gcal.ts";
import { corsHeaders } from "../_shared/booking-cors.ts";

function json(
  status: number,
  body: unknown,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin, "GET, OPTIONS"),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin, "GET, OPTIONS"),
    });
  }
  if (req.method !== "GET") {
    return json(405, { error: "method_not_allowed" }, origin);
  }

  try {
    const url = new URL(req.url);
    const slug = (url.searchParams.get("event") || "erstgespraech").trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceKey) {
      return json(500, { error: "server_misconfigured" }, origin);
    }
    const sb = createClient(supabaseUrl, serviceKey);

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

    const [{ data: windows }, { data: blackoutRows }, { data: questions }, {
      data: bookings,
    }, { data: holds }] = await Promise.all([
      sb.from("booking_availability").select("weekday,start_time,end_time")
        .eq("event_type_id", et.id).eq("active", true),
      sb.from("booking_blackouts").select("starts_at,ends_at")
        .eq("event_type_id", et.id),
      sb.from("booking_questions").select(
        "id,key,label,type,required,options,sort",
      ).eq("event_type_id", et.id).eq("active", true).order("sort"),
      sb.from("bookings").select("starts_at,ends_at")
        .eq("event_type_id", et.id)
        .in("status", ["confirmed", "sync_failed"])
        .gte("starts_at", new Date().toISOString()),
      sb.from("booking_holds").select("starts_at,ends_at,expires_at")
        .eq("event_type_id", et.id)
        .gt("expires_at", new Date().toISOString()),
    ]);

    const blackouts: Interval[] = (blackoutRows ?? []).map((b) => ({
      start: new Date(b.starts_at),
      end: new Date(b.ends_at),
    }));
    const busyDb: Interval[] = [
      ...(bookings ?? []).map((b) => ({
        start: new Date(b.starts_at),
        end: new Date(b.ends_at),
      })),
      ...(holds ?? []).map((h) => ({
        start: new Date(h.starts_at),
        end: new Date(h.ends_at),
      })),
    ];

    const now = new Date();
    const rangeEnd = new Date(
      now.getTime() + et.horizon_days * 24 * 3600_000,
    );
    let gcalBusy: Interval[] = [];
    let gcalOk = false;
    if (gcalConfigured()) {
      try {
        gcalBusy = await queryFreeBusy(
          et.gcal_calendar_id || "primary",
          now,
          rangeEnd,
        );
        gcalOk = true;
      } catch (e) {
        console.error("freebusy", e);
      }
    }

    const slots = generateCandidateSlots(
      et,
      (windows ?? []) as AvailabilityWindow[],
      blackouts,
      [...busyDb, ...gcalBusy],
      now,
    );

    const publicQuestions: Question[] = (questions ?? []).map((q) => ({
      id: q.id,
      key: q.key,
      label: q.label,
      type: q.type,
      required: q.required,
      options: Array.isArray(q.options) ? q.options : [],
      sort: q.sort,
    }));

    return json(200, {
      event: {
        slug: et.slug,
        title: et.title,
        durationMin: et.duration_min,
        timezone: et.timezone,
      },
      questions: publicQuestions,
      slots: slots.map((s) => ({
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        label: s.label,
      })),
      gcalSynced: gcalOk,
    }, origin);
  } catch (e) {
    console.error(e);
    return json(500, { error: "internal" }, origin);
  }
});
