'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { config, publicConfig } = require('./config');
const { normalizeEmail, normalizeName } = require('./validate');
const { buildProfile, parseServices } = require('./mobileconfig');
const { buildAutoconfig } = require('./autoconfig');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

// Logo externe (BRAND_LOGO_URL absolue) : seule son origine est ajoutée à img-src.
const LOGO_ORIGIN = /^https?:\/\//.test(config.brandLogoUrl) ? ' ' + new URL(config.brandLogoUrl).origin : '';

const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:" + LOGO_ORIGIN,
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000',
};

// Fichiers statiques chargés en mémoire au démarrage (avec version gzip pour le texte).
const files = new Map();
(function load(dir, prefix) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const url = prefix + '/' + entry.name;
    if (entry.isDirectory()) { load(full, url); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    if (!TYPES[ext]) continue;
    const body = fs.readFileSync(full);
    const text = /^(text|application\/(json|manifest)|image\/svg)/.test(TYPES[ext]);
    files.set(url, { body, gz: text ? zlib.gzipSync(body, { level: 9 }) : null, type: TYPES[ext], ext });
  }
})(PUBLIC_DIR, '');

// Feuille générée : couleur d'accent (BRAND_ACCENT). Fichier séparé plutôt qu'un style inline,
// pour respecter la CSP (style-src 'self'). Incluse dans le hash de cache-busting ci-dessous.
{
  const body = Buffer.from(`:root { --accent: ${config.brandAccent}; }\n`);
  files.set('/brand.css', { body, gz: zlib.gzipSync(body, { level: 9 }), type: TYPES['.css'], ext: '.css' });
}

// Cache-busting : un hash du contenu de tous les CSS/JS est injecté (?v=…) dans les URL des assets
// du HTML et dans les imports des modules JS. Les URL versionnées sont servies en immutable.
const BUILD = (() => {
  const h = crypto.createHash('sha256');
  for (const u of [...files.keys()].sort()) if (/\.(css|js)$/.test(u)) h.update(u).update(files.get(u).body);
  return h.digest('hex').slice(0, 10);
})();
const withV = (u) => u + '?v=' + BUILD;
for (const [u, f] of files) {
  let txt;
  if (f.ext === '.html') {
    txt = f.body.toString('utf8').replace(/((?:href|src)=")(\/[^"?#]+\.(?:css|js))(")/g, (m, a, b, c) => a + withV(b) + c);
  } else if (f.ext === '.js') {
    txt = f.body.toString('utf8').replace(/(\bfrom\s*')([^'?]+\.js)(')/g, (m, a, b, c) => a + withV(b) + c);
  } else continue;
  f.body = Buffer.from(txt);
  f.gz = zlib.gzipSync(f.body, { level: 9 });
}

// Captures d'écran des guides réellement présentes (public/img/guides/…) : le front n'affiche
// le lien « Voir une capture » que pour celles-ci.
const GUIDE_SHOTS = [...files.keys()]
  .filter((u) => u.startsWith('/img/guides/') && /\.(png|jpe?g|webp)$/i.test(u))
  .map((u) => u.slice('/img/guides/'.length))
  .sort();
const configJson = Buffer.from(JSON.stringify(Object.assign(publicConfig(), { shots: GUIDE_SHOTS })));

/* ---------- Page interne /support (HTTP Basic) ---------- */
const SUPPORT_ENABLED = config.supportAuth.password !== '';
const sha = (s) => crypto.createHash('sha256').update(String(s), 'utf8').digest();
const SUPPORT_USER_H = sha(config.supportAuth.user);
const SUPPORT_PASS_H = sha(config.supportAuth.password);
const failures = new Map(); // ip -> { n, until }
const MAX_FAILURES = 10;
const LOCK_MS = 15 * 60 * 1000;

function clientIp(req) {
  return String(req.headers['cf-connecting-ip'] || req.socket.remoteAddress || '');
}

// Comparaison en temps constant (empreintes de même longueur, les deux toujours évaluées).
function checkBasic(header) {
  const m = /^Basic\s+([A-Za-z0-9+/=]+)\s*$/i.exec(header || '');
  let user = '', pass = '';
  if (m) {
    const dec = Buffer.from(m[1], 'base64').toString('utf8');
    const i = dec.indexOf(':');
    if (i >= 0) { user = dec.slice(0, i); pass = dec.slice(i + 1); }
  }
  const okUser = crypto.timingSafeEqual(sha(user), SUPPORT_USER_H);
  const okPass = crypto.timingSafeEqual(sha(pass), SUPPORT_PASS_H);
  return Boolean(m) && okUser && okPass;
}

// Renvoie true si la requête peut continuer, sinon envoie la réponse (404, 401 ou 429).
function guardSupport(req, res) {
  const noindex = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' };
  if (!SUPPORT_ENABLED) { notFound(req, res, noindex); return false; }
  const ip = clientIp(req);
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.until > now && f.n >= MAX_FAILURES) {
    send(req, res, 429, 'Trop de tentatives. Réessayez dans quelques minutes.\n', Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '900' }, noindex));
    return false;
  }
  if (checkBasic(req.headers.authorization)) { failures.delete(ip); return true; }
  if (req.headers.authorization) {
    const cur = f && f.until > now ? f : { n: 0, until: now + LOCK_MS };
    cur.n++;
    failures.set(ip, cur);
    if (failures.size > 5000) failures.clear();
  }
  send(req, res, 401, 'Authentification requise.\n', Object.assign({
    'Content-Type': 'text/plain; charset=utf-8',
    'WWW-Authenticate': 'Basic realm="Support ' + config.brand.replace(/["\\\r\n]/g, '') + '", charset="UTF-8"',
  }, noindex));
  return false;
}

function notFound(req, res, extra = {}) {
  const nf = files.get('/404.html');
  return send(req, res, 404, nf ? nf.body : 'Page introuvable.\n', Object.assign({
    'Content-Type': nf ? nf.type : 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  }, extra));
}

function send(req, res, status, body, headers = {}) {
  const h = Object.assign({}, SECURITY_HEADERS, headers);
  if (typeof body === 'string') body = Buffer.from(body);
  h['Content-Length'] = body.length;
  res.writeHead(status, h);
  res.end(req.method === 'HEAD' ? undefined : body);
}

function sendText(req, res, status, text) {
  send(req, res, status, text + '\n', { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
}

function serveStatic(req, res, pathname, extra = {}) {
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/support' || pathname === '/support/') pathname = '/support/index.html';
  const f = files.get(pathname);
  if (!f) return false;
  const versioned = new URL(req.url, 'http://localhost').searchParams.get('v') === BUILD;
  const headers = Object.assign({
    'Content-Type': f.type,
    'Cache-Control': f.ext === '.html' ? 'no-cache' : versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
    Vary: 'Accept-Encoding',
  }, extra);
  let body = f.body;
  if (f.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    body = f.gz;
    headers['Content-Encoding'] = 'gzip';
  }
  send(req, res, 200, body, headers);
  return true;
}

function handleProfile(req, res, q) {
  const email = normalizeEmail(q.get('email'));
  if (!email) return sendText(req, res, 400, 'Adresse e-mail invalide.');
  const name = normalizeName(q.get('name') || '');
  const services = parseServices(q.get('services'));
  const body = buildProfile({ email, name, services, config });
  const filename = (config.brand.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'profile') + '-' +
    email.replace(/[^A-Za-z0-9._-]+/g, '_') + '.mobileconfig';
  send(req, res, 200, body, {
    'Content-Type': 'application/x-apple-aspen-config',
    'Content-Disposition': 'attachment; filename="' + filename + '"',
    'Cache-Control': 'no-store',
  });
}

function handleAutoconfig(req, res, q) {
  const raw = q.get('emailaddress');
  let domain;
  if (raw) {
    const email = normalizeEmail(raw);
    if (!email) return sendText(req, res, 400, 'Adresse e-mail invalide.');
    domain = email.split('@')[1];
  } else {
    // Requête Thunderbird classique : autoconfig.<domaine>/mail/config-v1.1.xml
    const host = String(req.headers.host || '').split(':')[0].toLowerCase().replace(/^autoconfig\./, '');
    domain = normalizeEmail('x@' + host) ? host : config.imap.host;
  }
  send(req, res, 200, buildAutoconfig({ domain, config }), {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'no-store',
  });
}

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
  } catch {
    return sendText(req, res, 400, 'Requête invalide.');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(req, res, 405, 'Méthode non autorisée.\n', { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
  }
  const p = url.pathname;
  try {
    if (p === '/healthz') return sendText(req, res, 200, 'ok');
    if (p === '/api/config') {
      return send(req, res, 200, configJson, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
    }
    if (p === '/profile.mobileconfig') return handleProfile(req, res, url.searchParams);
    if (p === '/mail/config-v1.1.xml' || p === '/.well-known/autoconfig/mail/config-v1.1.xml') {
      return handleAutoconfig(req, res, url.searchParams);
    }
    if (p === '/support' || p.startsWith('/support/')) {
      if (!guardSupport(req, res)) return;
      if (serveStatic(req, res, p, { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' })) return;
      return notFound(req, res, { 'X-Robots-Tag': 'noindex, nofollow' });
    }
    if (serveStatic(req, res, p)) return;
    return notFound(req, res);
  } catch (err) {
    console.error(err);
    return sendText(req, res, 500, 'Erreur interne.');
  }
});

server.keepAliveTimeout = 65000;
server.listen(config.port, '0.0.0.0', () => {
  console.log(`mail-setup à l'écoute sur :${config.port} (${files.size} fichiers statiques, ${GUIDE_SHOTS.length} captures, page /support ${SUPPORT_ENABLED ? 'active' : 'désactivée'})`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
