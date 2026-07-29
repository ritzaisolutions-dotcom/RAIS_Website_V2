import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const mcpPath = join(homedir(), '.cursor', 'mcp.json');
const cfg = JSON.parse(readFileSync(mcpPath, 'utf8'));
const key = cfg?.mcpServers?.stitch?.headers?.['X-Goog-Api-Key'];
if (!key) throw new Error('No Stitch API key');

let sessionId = null;
let id = 1;

async function rpc(method, params = undefined) {
  const payload = { jsonrpc: '2.0', method, id: id++ };
  if (params !== undefined) payload.params = params;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'X-Goog-Api-Key': key,
  };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  const res = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const sid = res.headers.get('mcp-session-id');
  if (sid) sessionId = sid;

  const text = await res.text();
  // SSE or plain JSON
  let data;
  if (text.startsWith('event:') || text.includes('data:')) {
    const lines = text.split('\n').filter((l) => l.startsWith('data:'));
    const last = lines[lines.length - 1]?.replace(/^data:\s*/, '') || text;
    data = JSON.parse(last);
  } else {
    data = JSON.parse(text);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
  }
  if (data.error) {
    throw new Error(`RPC error: ${JSON.stringify(data.error)}`);
  }
  return data.result;
}

const outDir = join(process.cwd(), 'scripts', '_stitch-out');
mkdirSync(outDir, { recursive: true });

console.log('1) initialize…');
await rpc('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'rais-redesign', version: '1.0' },
});

// Some servers want notifications/initialized
try {
  await rpc('notifications/initialized', {});
} catch {
  // notification may not return a result; ignore
}

console.log('2) tools/list…');
const tools = await rpc('tools/list');
writeFileSync(join(outDir, 'tools.json'), JSON.stringify(tools, null, 2));
console.log(
  'Tools:',
  (tools?.tools || []).map((t) => t.name).join(', ') || '(none)'
);
