import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const mcpPath = join(homedir(), '.cursor', 'mcp.json');
const cfg = JSON.parse(readFileSync(mcpPath, 'utf8'));
const key = cfg?.mcpServers?.stitch?.headers?.['X-Goog-Api-Key'];
if (!key) throw new Error('No Stitch API key');

const outDir = join(process.cwd(), 'scripts', '_stitch-out');
mkdirSync(outDir, { recursive: true });

let sessionId = null;
let rpcId = 1;

async function rpc(method, params) {
  const payload = { jsonrpc: '2.0', method, id: rpcId++ };
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
  let data;
  if (text.startsWith('event:') || text.includes('\ndata:')) {
    const lines = text.split('\n').filter((l) => l.startsWith('data:'));
    const last = lines[lines.length - 1]?.replace(/^data:\s*/, '') || '{}';
    data = JSON.parse(last);
  } else {
    data = JSON.parse(text);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data).slice(0, 800)}`);
  if (data.error) throw new Error(`RPC ${method}: ${JSON.stringify(data.error)}`);
  return data.result;
}

async function callTool(name, args) {
  console.log(`→ ${name}…`);
  const result = await rpc('tools/call', { name, arguments: args });
  // MCP tool result may be content array with text/json
  writeFileSync(join(outDir, `${name}-raw.json`), JSON.stringify(result, null, 2));
  return result;
}

function extractJson(toolResult) {
  if (!toolResult) return null;
  if (toolResult.structuredContent) return toolResult.structuredContent;
  const texts = (toolResult.content || [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text);
  for (const t of texts) {
    try {
      return JSON.parse(t);
    } catch {
      // try to find JSON object in text
      const m = t.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch {
          /* continue */
        }
      }
    }
  }
  return toolResult;
}

await rpc('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'rais-redesign', version: '1.0' },
});
try {
  await rpc('notifications/initialized', {});
} catch {
  /* optional */
}

// 1) Project
const projectRaw = await callTool('create_project', {
  title: 'RAIS Website Redesign 2026-07',
});
const project = extractJson(projectRaw);
writeFileSync(join(outDir, 'project.json'), JSON.stringify(project, null, 2));
const projectName = project?.name || project?.project?.name;
const projectId = String(projectName || '').replace(/^projects\//, '') || project?.id;
if (!projectId) throw new Error('No projectId: ' + JSON.stringify(project).slice(0, 500));
console.log('Project:', projectId);

// 2) Design system
const designMd = `# RAIS Design System

## Brand
RAIS (Ritz AI Solutions) — practical automation partner for independent German real-estate brokerages (5–25 staff). Commercial clarity with editorial restraint. Warm, credible, composed. Not startup-glassy, not dark-tech, not generic SaaS card grids.

## Palette (exact)
- Cloud background: #F5F2EC
- Warm Linen surface: #FBF8F3
- Charcoal text: #2F2A24
- Stone muted: #7B746B
- Border: #D9D1C7
- Sage support: #789464
- Dark Pistachio: #3C5A2A
- Mandarin Orange accent ONLY for primary CTA / key emphasis: #EC6A37 (under 5% surface area)
- Never use orange as body text on Cloud

## Typography
- Headlines: Source Serif 4 — text serif, moderate contrast, commercial-serious (NOT display Playfair)
- Body: Libre Franklin — neutral grotesque, not geometric
- Labels: JetBrains Mono sparingly for small system cues only — never headlines

## Layout principles
- One composition per first viewport: brand, one headline, one supporting sentence, one CTA group, one dominant full-bleed hero image
- No cards in hero; cards only for interactive modules
- Max content width 1100px; section spacing ≥120px desktop
- One primary CTA per page: "Kostenlosen Audit buchen"
- German copy, no em-dashes, no ALL-CAPS eyebrows
- Trust via EU hosting / AVV — no fake tech logos

## Anti-patterns
- Purple gradients, glassmorphism, glow, pill clusters, stat strips in hero
- Multiple equal CTAs, decorative numbered lists without sequence
- Generic AI cream+terracotta display-serif cliché — keep palette but stay editorial and quiet
`;

const dsRaw = await callTool('create_design_system', {
  projectId,
  designSystem: {
    displayName: 'RAIS Editorial Commercial',
    theme: {
      colorMode: 'LIGHT',
      colorVariant: 'FIDELITY',
      customColor: '#EC6A37',
      overridePrimaryColor: '#EC6A37',
      overrideSecondaryColor: '#789464',
      overrideTertiaryColor: '#3C5A2A',
      overrideNeutralColor: '#F5F2EC',
      headlineFont: 'SOURCE_SERIF_4',
      bodyFont: 'LIBRE_FRANKLIN',
      labelFont: 'JETBRAINS_MONO',
      roundness: 'ROUND_EIGHT',
      designMd,
    },
  },
});
const ds = extractJson(dsRaw);
writeFileSync(join(outDir, 'design-system.json'), JSON.stringify(ds, null, 2));
const designSystemId =
  ds?.name ||
  ds?.designSystem?.name ||
  ds?.asset?.name ||
  ds?.id;
console.log('Design system:', designSystemId);

const prompt = `Design a DESKTOP marketing homepage for RAIS (ritz-ai.solutions), a German B2B automation partner for independent Immobilienmakler offices.

VISUAL DIRECTION:
- Warm Cloud #F5F2EC / Warm Linen #FBF8F3 atmosphere with quiet tonal layering, paper-like contrast
- Charcoal #2F2A24 headlines, Stone #7B746B body
- Sage #789464 used for ONE full-bleed trust/proof block with Warm Linen text
- Mandarin #EC6A37 ONLY on primary buttons and tiny accents (<5%)
- Source Serif 4 headlines + Libre Franklin body
- Editorial commercial clarity — like a serious operational offer, not a startup landing page
- Full-bleed hero photograph of a real brokerage work atmosphere (desk, documents, calm office light) as edge-to-edge background plane with restrained dark overlay for readability
- NO cards in the hero. NO floating badges, chips, or promo stickers on the hero image
- NO purple, NO dark mode, NO glassmorphism, NO glow, NO pill clusters, NO fake portal logos

PAGE STRUCTURE (single long scroll):
1) Fixed top nav: RAIS wordmark/logo left; links Systeme, Referenzen, Über uns, Persönlichkeit; primary button "Audit buchen"
2) HERO (first viewport only): large RAIS brand presence, headline "Systeme für Maklerbüros, die Anfragen nicht verlieren wollen.", one short supporting sentence about less manual processing time and more booked first meetings, CTAs: primary "Kostenlosen Audit buchen", secondary text link "Live-Systeme ansehen". Nothing else in first viewport.
3) Trust strip (thin): EU hosting Germany, database Frankfurt, AVV Art. 28 DSGVO, no data transfer outside EU — text labels only
4) Reference teaser: Haller Immobilienberatung — short honest teaser, link to case study, no fake metrics
5) Live systems asymmetric bento: AQuT large (Anfragen qualifizieren und Termine buchen) + five lighter peers (Onboarding WFS, Lead Scraping LMLF, CRM, Habit-Tracker, Agentic Content) with context words Makler/Intern/Content — not equal card grid noise
6) ICP section unnumbered: independent Maklerbüros 5–25 people; exclude solos, franchises, bank-bound, Hausverwaltungen
7) Contact/Audit module footer-ish: invite to free process audit
8) Footer with Impressum, Datenschutz

German UI copy throughout. No em dashes. Sentence case. One primary CTA rhythm. Generous whitespace, max content width ~1100px, section gaps large (~120px).

Output a polished, production-ready landing page composition.`;

const genArgs = {
  projectId,
  deviceType: 'DESKTOP',
  modelId: 'GEMINI_3_1_PRO',
  prompt,
};
if (designSystemId) {
  // expect assets/... form
  genArgs.designSystem = String(designSystemId).startsWith('assets/')
    ? String(designSystemId)
    : String(designSystemId).includes('/')
      ? String(designSystemId)
      : `assets/${designSystemId}`;
}

const genRaw = await callTool('generate_screen_from_text', genArgs);
const gen = extractJson(genRaw);
writeFileSync(join(outDir, 'generate-home.json'), JSON.stringify(gen, null, 2));
console.log('Generate result keys:', Object.keys(gen || {}));

// Resolve screen name
let screenName =
  gen?.name ||
  gen?.screen?.name ||
  gen?.output?.name ||
  (Array.isArray(gen?.screens) && gen.screens[0]?.name);

if (!screenName) {
  const listed = extractJson(await callTool('list_screens', { projectId }));
  writeFileSync(join(outDir, 'list-screens.json'), JSON.stringify(listed, null, 2));
  const screens = listed?.screens || listed?.stitchScreens || [];
  screenName = screens[0]?.name;
}

if (!screenName) throw new Error('No screen name found');
console.log('Screen:', screenName);

const screenId = String(screenName).split('/').pop();
const screenRaw = await callTool('get_screen', {
  name: screenName,
  projectId,
  screenId,
});
const screen = extractJson(screenRaw);
writeFileSync(join(outDir, 'screen-home.json'), JSON.stringify(screen, null, 2));

async function downloadFile(fileObj, basename) {
  if (!fileObj) return null;
  const url = fileObj.downloadUrl;
  if (!url) {
    console.log('No downloadUrl for', basename, Object.keys(fileObj));
    return null;
  }
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = fileObj.mimeType || res.headers.get('content-type') || '';
  const ext = mime.includes('html')
    ? 'html'
    : mime.includes('png')
      ? 'png'
      : mime.includes('jpeg') || mime.includes('jpg')
        ? 'jpg'
        : mime.includes('webp')
          ? 'webp'
          : 'bin';
  const path = join(outDir, `${basename}.${ext}`);
  writeFileSync(path, buf);
  console.log('Saved', path, buf.length, 'bytes');
  return path;
}

await downloadFile(screen?.htmlCode || screen?.screen?.htmlCode, 'home');
await downloadFile(screen?.screenshot || screen?.screen?.screenshot, 'home-screenshot');

console.log('DONE');
console.log(JSON.stringify({ projectId, designSystemId, screenName }, null, 2));
