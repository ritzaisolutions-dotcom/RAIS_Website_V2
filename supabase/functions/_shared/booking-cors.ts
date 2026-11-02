/**
 * CORS for booking edge functions.
 * Always echo localhost / 127.0.0.1 (any port) for local Vite.
 * Production origins come from RAIS_ALLOWED_ORIGINS or defaults.
 * Never send a mismatched Allow-Origin (that causes Failed to fetch).
 */

const DEFAULT_ORIGINS =
  "https://ritz-ai.solutions,https://www.ritz-ai.solutions,http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173";

const allowedOrigins = new Set(
  (Deno.env.get("RAIS_ALLOWED_ORIGINS") ?? DEFAULT_ORIGINS)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (allowedOrigins.has(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.protocol === "http:" || u.protocol === "https:") {
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function corsHeaders(
  origin: string | null,
  methods: string,
): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": methods,
    "Content-Type": "application/json",
    Vary: "Origin",
  };
  if (isAllowedOrigin(origin) && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
