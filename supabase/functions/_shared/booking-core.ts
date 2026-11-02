/** Slot generation, overlap checks, rule evaluation. */

export type EventType = {
  id: string;
  slug: string;
  title: string;
  duration_min: number;
  buffer_before_min: number;
  buffer_after_min: number;
  min_notice_hours: number;
  horizon_days: number;
  timezone: string;
  gcal_calendar_id: string;
  active: boolean;
};

export type AvailabilityWindow = {
  weekday: number;
  start_time: string;
  end_time: string;
};

export type Interval = { start: Date; end: Date };

export type Question = {
  id: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: { value: string; label: string }[];
  sort: number;
};

export type Rule = {
  id: string;
  name: string;
  sort: number;
  condition: { field?: string; op?: string; value?: unknown };
  outcome: "proceed" | "reject";
  reject_message: string | null;
};

const BERLIN = "Europe/Berlin";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Berlin wall-clock parts for a UTC instant. */
export function berlinParts(d: Date): {
  y: number;
  m: number;
  day: number;
  hour: number;
  min: number;
  weekday: number;
} {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: BERLIN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(d).map((p) => [p.type, p.value]),
  );
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    min: Number(parts.minute),
    weekday: map[parts.weekday] ?? 1,
  };
}

/** Interpret Berlin Y-M-D HH:MM as UTC Date. */
export function berlinLocalToUtc(
  y: number,
  m: number,
  day: number,
  hour: number,
  min: number,
): Date {
  const guess = new Date(Date.UTC(y, m - 1, day, hour, min, 0));
  const parts = berlinParts(guess);
  const asUtcMinutes = hour * 60 + min;
  const shownMinutes = parts.hour * 60 + parts.min;
  const deltaMin = asUtcMinutes - shownMinutes;
  return new Date(guess.getTime() + deltaMin * 60_000);
}

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && a.end > b.start;
}

/** True if [startsAt, endsAt] fits a weekly window and avoids blackouts. */
export function slotFitsAvailability(
  event: EventType,
  windows: AvailabilityWindow[],
  blackouts: Interval[],
  startsAt: Date,
  endsAt: Date,
  now = new Date(),
): boolean {
  if (!(startsAt < endsAt)) return false;
  const expectedEnd = new Date(
    startsAt.getTime() + event.duration_min * 60_000,
  );
  if (Math.abs(expectedEnd.getTime() - endsAt.getTime()) > 60_000) return false;
  const noticeMs = event.min_notice_hours * 3600_000;
  if (startsAt.getTime() < now.getTime() + noticeMs) return false;

  const parts = berlinParts(startsAt);
  const startMin = parts.hour * 60 + parts.min;
  const endParts = berlinParts(endsAt);
  const endMin = endParts.hour * 60 + endParts.min;
  if (
    parts.y !== endParts.y || parts.m !== endParts.m || parts.day !== endParts.day
  ) {
    return false;
  }

  const dayWindows = windows.filter((w) => w.weekday === parts.weekday);
  const inWindow = dayWindows.some((w) => {
    const from = parseTimeToMinutes(w.start_time);
    const to = parseTimeToMinutes(w.end_time);
    return startMin >= from && endMin <= to;
  });
  if (!inWindow) return false;

  const padded = expandWithBuffer(
    { start: startsAt, end: endsAt },
    event.buffer_before_min,
    event.buffer_after_min,
  );
  if (blackouts.some((b) => overlaps(padded, b))) return false;
  return true;
}

export function expandWithBuffer(
  interval: Interval,
  beforeMin: number,
  afterMin: number,
): Interval {
  return {
    start: new Date(interval.start.getTime() - beforeMin * 60_000),
    end: new Date(interval.end.getTime() + afterMin * 60_000),
  };
}

export function generateCandidateSlots(
  event: EventType,
  windows: AvailabilityWindow[],
  blackouts: Interval[],
  busy: Interval[],
  now = new Date(),
): { startsAt: Date; endsAt: Date; label: string }[] {
  const duration = event.duration_min;
  const noticeMs = event.min_notice_hours * 3600_000;
  const earliest = new Date(now.getTime() + noticeMs);
  const horizonEnd = new Date(
    now.getTime() + event.horizon_days * 24 * 3600_000,
  );

  const byWeekday = new Map<number, AvailabilityWindow[]>();
  for (const w of windows) {
    const list = byWeekday.get(w.weekday) ?? [];
    list.push(w);
    byWeekday.set(w.weekday, list);
  }

  const out: { startsAt: Date; endsAt: Date; label: string }[] = [];
  const cursorParts = berlinParts(now);
  let y = cursorParts.y;
  let m = cursorParts.m;
  let day = cursorParts.day;

  for (let i = 0; i < event.horizon_days + 2; i++) {
    const noon = berlinLocalToUtc(y, m, day, 12, 0);
    if (noon > horizonEnd) break;
    const wd = berlinParts(noon).weekday;
    const dayWindows = byWeekday.get(wd) ?? [];

    for (const w of dayWindows) {
      const startMin = parseTimeToMinutes(w.start_time);
      const endMin = parseTimeToMinutes(w.end_time);
      for (let t = startMin; t + duration <= endMin; t += duration) {
        const sh = Math.floor(t / 60);
        const sm = t % 60;
        const startsAt = berlinLocalToUtc(y, m, day, sh, sm);
        const endsAt = new Date(startsAt.getTime() + duration * 60_000);
        if (startsAt < earliest) continue;
        if (endsAt > horizonEnd) continue;

        const padded = expandWithBuffer(
          { start: startsAt, end: endsAt },
          event.buffer_before_min,
          event.buffer_after_min,
        );
        const blocked =
          blackouts.some((b) => overlaps(padded, b)) ||
          busy.some((b) => overlaps(padded, b));
        if (blocked) continue;

        const label = new Intl.DateTimeFormat("de-DE", {
          timeZone: BERLIN,
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(startsAt);

        out.push({ startsAt, endsAt, label });
      }
    }

    const next = berlinLocalToUtc(y, m, day, 12, 0);
    next.setUTCDate(next.getUTCDate() + 1);
    const np = berlinParts(next);
    y = np.y;
    m = np.m;
    day = np.day;
  }

  return out;
}

export function evaluateRules(
  rules: Rule[],
  answers: Record<string, unknown>,
): { outcome: "proceed" | "reject"; rejectMessage?: string; ruleName?: string } {
  const sorted = [...rules].sort((a, b) => a.sort - b.sort);
  for (const rule of sorted) {
    const c = rule.condition || {};
    const field = c.field;
    const op = c.op || "eq";
    if (!field) continue;
    const actual = answers[field];
    let match = false;
    if (op === "eq") match = actual === c.value;
    else if (op === "neq") match = actual !== c.value;
    else if (op === "gte") match = Number(actual) >= Number(c.value);
    else if (op === "lte") match = Number(actual) <= Number(c.value);
    else if (op === "in" && Array.isArray(c.value)) {
      match = c.value.includes(actual);
    }
    if (!match) continue;
    if (rule.outcome === "reject") {
      return {
        outcome: "reject",
        rejectMessage: rule.reject_message ||
          "Leider passt unser Angebot aktuell nicht.",
        ruleName: rule.name,
      };
    }
  }
  return { outcome: "proceed" };
}

export function validateAnswers(
  questions: Question[],
  answers: Record<string, unknown>,
): string | null {
  for (const q of questions) {
    if (!q.required) continue;
    const v = answers[q.key];
    if (v === undefined || v === null || v === "") {
      return `missing:${q.key}`;
    }
    if (q.type === "number" && !Number.isFinite(Number(v))) {
      return `invalid_number:${q.key}`;
    }
    if (q.type === "single" && Array.isArray(q.options) && q.options.length) {
      const ok = q.options.some((o) => o.value === v);
      if (!ok) return `invalid_option:${q.key}`;
    }
  }
  return null;
}

export function hashIp(ip: string, salt: string): string {
  // Lightweight non-crypto fingerprint for rate limits — Deno edge.
  let h = 2166136261;
  const s = `${salt}|${ip}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function formatSlotLabel(startsAt: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: BERLIN,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(startsAt);
}

export { pad, BERLIN };
