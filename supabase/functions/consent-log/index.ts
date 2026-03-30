/**
 * RAIS Consent Log — Supabase Edge Function
 * Receives consent events from rais-consent.js and stores them for
 * Art. 7 Abs. 1 DSGVO proof-of-consent documentation.
 *
 * Deploy: supabase functions deploy consent-log
 * Then update CONSENT_LOG_URL in rais-consent.js with your project URL.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = 'https://ritz-ai.solutions';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Anonymize IPv4: zero last octet. IPv6: zero last 80 bits. */
function anonymizeIP(ip: string | null): string | null {
  if (!ip) return null;
  // IPv4
  const v4 = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return v4[1] + '.0';
  // IPv6 — keep first 48 bits (3 groups), zero the rest
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + ':0000:0000:0000:0000:0000';
  }
  return null;
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: {
    uid: string;
    timestamp: string;
    version: string;
    categories: Record<string, boolean>;
    action: string;
    user_agent?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Validate required fields
  if (!body.uid || !body.timestamp || !body.version || !body.categories || !body.action) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Anonymize IP — last octet zeroed (DSGVO: IP is personal data)
  const rawIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('cf-connecting-ip')
    ?? null;
  const ipAnonymized = anonymizeIP(rawIP);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { error } = await supabase.from('consent_logs').insert({
    uid:           body.uid,
    timestamp:     body.timestamp,
    version:       body.version,
    categories:    body.categories,
    action:        body.action,
    user_agent:    body.user_agent ?? null,
    ip_anonymized: ipAnonymized,
  });

  if (error) {
    console.error('consent-log insert error:', error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
