/** Google Calendar FreeBusy + event helpers for booking edge functions. */

export type FreeBusyInterval = { start: Date; end: Date };

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

function requireEnv(name: string): string {
  const v = Deno.env.get(name)?.trim() ?? "";
  if (!v) throw new Error(`missing_env:${name}`);
  return v;
}

export function gcalConfigured(): boolean {
  return Boolean(
    Deno.env.get("GOOGLE_CALENDAR_CLIENT_ID")?.trim() &&
      Deno.env.get("GOOGLE_CALENDAR_CLIENT_SECRET")?.trim() &&
      Deno.env.get("GOOGLE_CALENDAR_REFRESH_TOKEN")?.trim(),
  );
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = requireEnv("GOOGLE_CALENDAR_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_CALENDAR_CLIENT_SECRET");
  const refreshToken = requireEnv("GOOGLE_CALENDAR_REFRESH_TOKEN");

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`gcal_token_failed:${res.status}:${text.slice(0, 200)}`);
  }
  const json = await res.json() as {
    access_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) throw new Error("gcal_token_missing");
  tokenCache = {
    accessToken: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return tokenCache.accessToken;
}

export async function queryFreeBusy(
  calendarId: string,
  timeMin: Date,
  timeMax: Date,
): Promise<FreeBusyInterval[]> {
  if (!gcalConfigured()) return [];

  const token = await getAccessToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`gcal_freebusy_failed:${res.status}:${text.slice(0, 200)}`);
  }
  const json = await res.json() as {
    calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
  };
  const busy = json.calendars?.[calendarId]?.busy ?? [];
  return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

export async function createCalendarEvent(input: {
  calendarId: string;
  summary: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  attendeeEmail: string;
  attendeeName?: string;
  timezone: string;
}): Promise<string> {
  if (!gcalConfigured()) {
    throw new Error("gcal_not_configured");
  }

  const token = await getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${
      encodeURIComponent(input.calendarId)
    }/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: {
          dateTime: input.startsAt.toISOString(),
          timeZone: input.timezone,
        },
        end: {
          dateTime: input.endsAt.toISOString(),
          timeZone: input.timezone,
        },
        attendees: [
          {
            email: input.attendeeEmail,
            displayName: input.attendeeName || undefined,
          },
        ],
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`gcal_insert_failed:${res.status}:${text.slice(0, 200)}`);
  }
  const json = await res.json() as { id?: string };
  if (!json.id) throw new Error("gcal_insert_no_id");
  return json.id;
}

export async function deleteCalendarEvent(
  calendarId: string,
  eventId: string,
): Promise<void> {
  if (!gcalConfigured() || !eventId) return;
  const token = await getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${
      encodeURIComponent(calendarId)
    }/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`gcal_delete_failed:${res.status}:${text.slice(0, 200)}`);
  }
}
