/**
 * Tests anon INSERT into cookie_consents (RLS policy).
 *
 * Usage:
 *   node scripts/test-cookie-consent-insert.mjs
 *
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY from .env (same as generate-public-config).
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');

function loadEnv(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv(envPath);
let url = env.SUPABASE_URL;
let anon = env.SUPABASE_ANON_KEY;

if (!url || !anon) {
  const pubPath = resolve(root, 'scripts', 'public-config.js');
  if (existsSync(pubPath)) {
    const pub = readFileSync(pubPath, 'utf8');
    const urlMatch = pub.match(/"supabaseUrl":\s*"([^"]+)"/);
    const keyMatch = pub.match(/"supabaseAnonKey":\s*"([^"]+)"/);
    url = urlMatch?.[1];
    anon = keyMatch?.[1];
  }
}

if (!url || !anon) {
  console.error('Fehler: SUPABASE_URL und SUPABASE_ANON_KEY in .env erforderlich.');
  process.exit(1);
}

const body = {
  consent_id: randomUUID(),
  decisions: { sentry: true },
  page_url: '/test-cookie-consent-insert',
};

const res = await fetch(`${url}/rest/v1/cookie_consents`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    Prefer: 'return=minimal',
  },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log('Status:', res.status);
if (text) console.log(text);

if (!res.ok) {
  process.exit(1);
}

console.log('OK: cookie_consents INSERT erlaubt.');
