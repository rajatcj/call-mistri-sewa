/* Mistri Sewa – tracking API → Discord webhook.   Node 18+, zero dependencies.
 *
 * Run standalone:   DISCORD_WEBHOOK="https://discord.com/api/webhooks/…" API_KEY="same-as-settings.json" node server.js
 * Env: DISCORD_WEBHOOK (required) · API_KEY (optional shared secret) · PORT=3000 · ALLOWED_ORIGIN=* (or https://yourdomain.com)
 *      QUIET=click,page  → events you do NOT want in Discord (still validated, just dropped)
 *
 * Already have an Express app?  const {intake}=require('./server');  (add cors())
 *   app.post('/track', express.json(), (req,res)=>res.sendStatus(intake(req.body,req)?204:400));
 *
 * Then in app/data/settings.json set  "api": {"enabled":true,"url":"https://YOUR-API/track","key":"same API_KEY"}
 */
const http = require('http');
const { DISCORD_WEBHOOK, API_KEY = '', PORT = 3000, ALLOWED_ORIGIN = '*', QUIET = '' } = process.env;
const quiet = new Set(QUIET.split(',').map(s => s.trim()).filter(Boolean));
const queue = [], hits = new Map();
const COLORS = { order: 0x25D366, app_open: 0x3D7BFF, service_view: 0x7B5CFF, search: 0xE0A100, profile_save: 0x12B5A0, installed: 0x25D366, install_prompt: 0x25D366 };
const clip = (v, n = 1000) => String(v ?? '').slice(0, n);

const getIP = req => clip((req.headers['cf-connecting-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || '').replace('::ffff:', ''), 60);

function embed(e, ip) {
  const d = e.data || {}, u = e.user || {}, v = e.device || {}, s = d.service || {}, f = [];
  const add = (name, val, inline = true) => { if (val !== undefined && val !== null && val !== '') f.push({ name, value: clip(val), inline }); };
  const compact = e.ev === 'click' || e.ev === 'page';
  let title = e.ev.toUpperCase();
  if (e.ev === 'order') title = `ORDER · ${clip(d.method).toUpperCase()}`;
  if (compact) {
    return { title: clip(title, 50), description: clip(`${d.label || d.h || ''} ${d.href || ''}`.trim() || '-', 200), color: COLORS[e.ev] || 0x8794A8, footer: { text: `${ip} · ${clip(e.sid, 8)} · ${clip(e.page, 40)}` }, timestamp: e.t };
  }
  add('Service', s.title ? `${s.title} (${s.id}) Rs.${s.price ?? ''}` : (d.title ? `${d.title} (${d.id}) Rs.${d.price ?? ''}` : (s.id || '')), false);
  add('Group / Category', [s.group || d.group, s.category || d.category].filter(Boolean).join(' / '));
  add('Search', d.q ? `${d.q} (${d.results} results)` : '');
  add('Name', u.name); add('Phone', u.phone); add('Address', u.address, false);
  if (u.lat) add('Map', `https://maps.google.com/?q=${u.lat},${u.lng}`, false);
  add('IP', ip); add('Device', clip(`${v.platform || ''} · ${v.screen || ''} · ${v.lang || ''}`));
  add('Installed app', v.installed ? 'yes' : 'no'); add('Time zone', v.tz); add('Network', v.net);
  add('Browser', v.ua, false); add('Page', e.page); add('Session', clip(e.sid, 12)); add('App', `v${v.ver || '?'} · ${v.appLang}/${v.theme}`);
  return { title: clip(title, 80), color: COLORS[e.ev] || 0x8794A8, fields: f.slice(0, 25), timestamp: e.t };
}

/** Validate + queue one event. Returns true if accepted. */
function intake(body, req) {
  if (!body || typeof body.ev !== 'string' || body.ev.length > 40) return false;
  if (API_KEY && req.headers['x-api-key'] !== API_KEY) return false;
  const ip = getIP(req), now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (h.length >= 120) return false;               // simple rate limit: 120 events/min/IP
  h.push(now); hits.set(ip, h);
  if (!quiet.has(body.ev)) queue.push(embed(body, ip));
  return true;
}

let busy = false;
async function flush() {                            // Discord allows 10 embeds per message; send batches
  if (busy || !queue.length || !DISCORD_WEBHOOK) return;
  busy = true;
  const batch = queue.splice(0, 10);
  try {
    const r = await fetch(DISCORD_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'Mistri Sewa', embeds: batch }) });
    if (r.status === 429) { queue.unshift(...batch); const j = await r.json().catch(() => ({})); await new Promise(s => setTimeout(s, (j.retry_after || 2) * 1000)); }
    else if (!r.ok) console.error('Discord error', r.status, await r.text());
  } catch (err) { console.error('Discord send failed', err.message); queue.unshift(...batch); }
  busy = false;
}
setInterval(flush, 2000);
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (!v.some(t => n - t < 60000)) hits.delete(k); if (queue.length > 500) queue.splice(0, queue.length - 500); }, 60000);

if (require.main === module) {
  if (!DISCORD_WEBHOOK) console.warn('! DISCORD_WEBHOOK is not set – events will be accepted but not forwarded');
  http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method !== 'POST' || !req.url.startsWith('/track')) { res.writeHead(404); return res.end(); }
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on('end', () => { let ok = false; try { ok = intake(JSON.parse(raw), req); } catch {} res.writeHead(ok ? 204 : 400); res.end(); });
  }).listen(PORT, () => console.log(`Tracking API listening on :${PORT}  (POST /track)`));
}
module.exports = { intake };
