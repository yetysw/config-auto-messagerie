import { DEVICES, APPS, GUIDES } from './guides.js';
import { encode as qrEncode, toSvg as qrSvg } from './qr.js';

/* ---------- Icônes SVG (inline, sans dépendance) ---------- */
const S = (p, extra = '') => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
const ICONS = {
  windows: S('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M12 7v7M7.5 10.5h9"/>'),
  mac: S('<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20l-1.5-4h-17z"/>'),
  iphone: S('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 5h3M11 18.5h2"/>'),
  android: S('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M9.5 8.5a2.5 2.5 0 0 1 5 0V10h-5z"/><path d="M10 6.2l-.8-1.2M14 6.2l.8-1.2M11 18.5h2"/>'),
  mail: S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  calendar: S('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>'),
  contacts: S('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
  tasks: S('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.5 1.5L7 5M3.5 12l1.5 1.5L7 11M3.5 18l1.5 1.5L7 17"/>'),
  outlook: S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/><circle cx="17.5" cy="16.5" r="0" />'),
  bird: S('<path d="M4 15c3 0 5-2 6-5 1.2-3.4 3.6-5 6.5-5 1.2 0 2.5.5 3.5 1.5l-2 1.5c.2 4.8-2.8 10-9.5 10H4z"/><path d="M15.5 7.5h.01"/>'),
  sync: S('<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>'),
  profile: S('<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"/><path d="M12 8v6M9.5 11.5L12 14l2.5-2.5"/>'),
  gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  globe: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>'),
  info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>'),
  warn: S('<path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  copy: S('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
  check: S('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="2.6"'),
  arrow: S('<path d="M9 6l6 6-6 6"/>', 'width="20" height="20" stroke-width="2.2"'),
  back: S('<path d="M15 6l-6 6 6 6"/>', 'width="18" height="18" stroke-width="2.2"'),
  download: S('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', 'width="20" height="20" stroke-width="2.4"'),
  spark: S('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
  image: S('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>', 'width="16" height="16"'),
  close: S('<path d="M6 6l12 12M18 6L6 18"/>', 'width="16" height="16" stroke-width="2.2"'),
  phone: S('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18.5h2"/>'),
  key: S('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>'),
};
const SERVICE_META = {
  mail: { label: 'Mail', icon: 'mail' },
  calendar: { label: 'Calendrier', icon: 'calendar' },
  contacts: { label: 'Contacts', icon: 'contacts' },
};

/* ---------- Utilitaires ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Même validation que côté serveur (server/validate.js).
const LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD_RE = /^(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{1,59})$/;
function normalizeEmail(raw) {
  if (typeof raw !== 'string') return null;
  const email = raw.trim();
  if (email.length < 6 || email.length > 254) return null;
  const at = email.lastIndexOf('@');
  if (at < 1 || email.indexOf('@') !== at) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (local.length > 64 || !LOCAL_RE.test(local)) return null;
  const labels = domain.split('.');
  if (labels.length < 2 || !labels.every((l) => LABEL_RE.test(l)) || !TLD_RE.test(labels[labels.length - 1])) return null;
  return local + '@' + domain;
}
function emailError(raw) {
  const v = raw.trim();
  if (!v) return 'Saisissez votre adresse e-mail.';
  if (!v.includes('@')) return 'Il manque le « @ » (ex. jean@example.com).';
  if (/\s/.test(v)) return 'L’adresse ne doit pas contenir d’espace.';
  if (!normalizeEmail(v)) return 'Cette adresse ne semble pas valide. Vérifiez-la (ex. jean@example.com).';
  return '';
}
const normalizeName = (s) => String(s || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);

// Ordinateur avec souris : on propose alors le QR code pour poursuivre sur le téléphone.
function isDesktop() {
  const d = detectDevice();
  if (d === 'ios' || d === 'android') return false;
  // Écran tactile comme pointeur principal (tablette Android déguisée, etc.) : pas de QR.
  return !window.matchMedia || !matchMedia('(pointer: coarse)').matches;
}

function detectDevice() {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'; // iPadOS se présente comme un Mac
  if (/Android/i.test(ua)) return 'android';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macos';
  return null;
}

/* ---------- État ---------- */
const DEFAULT_CFG = {
  brand: 'Mail Setup',
  brandLogoUrl: '',
  davPreset: 'mdaemon',
  organization: '',
  imap: { host: 'mail.example.com', port: 993, security: 'SSL/TLS' },
  smtp: { host: 'mail.example.com', port: 465, security: 'SSL/TLS' },
  caldavUrl: '',
  carddavUrl: '',
  tasksUrl: '',
  davDiscoveryUrl: '',
  davCardDiscoveryUrl: '',
  davTemplates: { principal: '', calendar: '', tasks: '', contacts: '' },
  webmailUrl: '',
  publicUrl: '',
  shots: [],
  support: { email: '', phone: '', hours: '', address: '' },
  links: {},
};
const state = {
  cfg: DEFAULT_CFG,
  email: '',
  name: '',
  services: new Set(['mail', 'calendar', 'contacts']),
  detected: detectDevice(),
};

// URL DAV personnelle à partir d'un gabarit ({email}, {local}, {domain}) : même logique que server/config.js.
function davUrl(template, email) {
  const at = email.lastIndexOf('@');
  const local = email.slice(0, at).toLowerCase();
  const domain = email.slice(at + 1).toLowerCase();
  const enc = (x) => encodeURIComponent(x).replace(/%40/g, '@');
  return String(template || '').replace(/\{email\}/g, enc(local + '@' + domain)).replace(/\{local\}/g, enc(local)).replace(/\{domain\}/g, enc(domain));
}

// Texte réservé à un préréglage DAV : préfixe « [mdaemon] » (voir guides.js).
const PRESET_RE = /^\[(mdaemon|generic)\]\s*/;
const presetOk = (t) => { const m = PRESET_RE.exec(t); return !m || m[1] === state.cfg.davPreset; };

// Lien public pré-rempli (QR code « Scannez avec votre téléphone »).
function phoneLink(device, app) {
  const p = new URLSearchParams();
  if (state.email) p.set('email', state.email);
  if (state.name) p.set('name', state.name);
  if (device) p.set('device', device);
  if (app) p.set('app', app);
  const qs = p.toString();
  return String(state.cfg.publicUrl || location.origin).replace(/\/+$/, '') + '/' + (qs ? '?' + qs : '');
}

// QR code compact, replié par défaut (ordinateur uniquement).
function phoneQr(device, app, open = false) {
  if (!isDesktop() || !state.email) return '';
  let svg;
  try { svg = qrSvg(qrEncode(phoneLink(device, app), 'M'), { title: 'QR code vers cette page pour votre téléphone' }); } catch { return ''; }
  const target = { ios: 'votre iPhone ou iPad', android: 'votre téléphone Android' }[device] || 'un téléphone ou une tablette';
  const hint = device === 'android'
    ? 'Visez le code avec l’appareil photo (ou Google Lens), puis touchez le lien.'
    : 'Visez le code avec l’app <strong>Appareil photo</strong>, puis touchez le lien. Sur iPhone, la page s’ouvre dans Safari, indispensable pour le profil.';
  return `<details class="qr-mini"${open ? ' open' : ''}>
    <summary>${ICONS.phone}<span>Configurer ${target}&nbsp;? <u>Scanner un QR code</u></span></summary>
    <div class="qr-mini-body">
      <div class="qr-code">${svg}</div>
      <p>Cette page s’ouvre sur l’appareil, avec votre adresse déjà remplie. ${hint}</p>
    </div>
  </details>`;
}

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

// Valeurs copiables : libellé simple + terme technique en petit (tech).
function fieldDefs() {
  const c = state.cfg;
  const who = state.email || 'votre adresse e-mail complète';
  const t = c.davTemplates || DEFAULT_CFG.davTemplates;
  const mine = (k, alias) => (state.email ? davUrl(t[k], state.email) : alias);
  return {
    email: { label: 'Adresse e-mail', value: state.email || 'votre adresse e-mail', copy: !!state.email },
    name: { label: 'Nom affiché', value: state.name || 'votre prénom et nom', copy: !!state.name },
    username: { label: 'Nom d’utilisateur', tech: 'adresse e-mail complète', value: who, copy: !!state.email },
    password: { label: 'Mot de passe', value: 'le mot de passe de votre boîte mail', secret: true },
    imapHost: { label: 'Serveur de réception', tech: 'IMAP', value: c.imap.host },
    imapPort: { label: 'Port de réception', tech: 'IMAP', value: String(c.imap.port) },
    imapSec: { label: 'Sécurité de réception', tech: 'IMAP', value: c.imap.security, copy: false },
    smtpHost: { label: 'Serveur d’envoi', tech: 'SMTP', value: c.smtp.host },
    smtpPort: { label: 'Port d’envoi', tech: 'SMTP', value: String(c.smtp.port) },
    smtpSec: { label: 'Sécurité d’envoi', tech: 'SMTP', value: c.smtp.security, copy: false },
    smtpAuth: { label: 'Authentification à l’envoi', tech: 'SMTP', value: 'Oui, mêmes identifiants', copy: false },
    caldav: { label: state.email ? 'Adresse de votre agenda' : 'Adresse de l’agenda', tech: 'CalDAV', value: mine('calendar', c.caldavUrl) },
    carddav: { label: state.email ? 'Adresse de vos contacts' : 'Adresse des contacts', tech: 'CardDAV', value: mine('contacts', c.carddavUrl) },
    tasks: { label: state.email ? 'Adresse de vos tâches' : 'Adresse des tâches', tech: 'CalDAV', value: mine('tasks', c.tasksUrl) },
    principal: { label: 'Adresse de votre compte', tech: 'principal DAV', value: state.email ? davUrl(t.principal, state.email) : String(t.principal).replace('{email}', 'votre-adresse') },
    davHost: { label: 'Serveur', value: hostOf(c.caldavUrl) },
    davPort: { label: 'Port', value: '443 (SSL activé)', copy: false },
    davDiscovery: { label: 'URL de base', tech: 'découverte', value: c.davDiscoveryUrl },
    davCardDiscovery: { label: 'URL de découverte des contacts', tech: 'CardDAV', value: c.davCardDiscoveryUrl },
    webmail: { label: 'Webmail', value: c.webmailUrl },
  };
}

/* ---------- Rendu ---------- */
function fmt(text) {
  const links = state.cfg.links || {};
  const defs = fieldDefs();
  return text
    .replace(PRESET_RE, '')
    .replace(/\[\[(.+?)\]\]/g, (_, s) => `<span class="ui">${esc(s)}</span>`)
    .replace(/\{email\}/g, `<span class="val">${esc(state.email)}</span>`)
    .replace(/\{brand\}/g, esc(state.cfg.brand))
    .replace(/\{L:(\w+)\}/g, (_, k) => esc(links[k] || '#'))
    .replace(/\{F:(\w+)\}/g, (_, k) => `<span class="val">${esc(defs[k] ? defs[k].value : '')}</span>`);
}

// Une valeur à copier. compact : libellé court et bouton icône (panneau des paramètres).
function kv(key, defs, short = '') {
  const d = defs[key];
  if (!d) return '';
  const canCopy = d.copy !== false && !d.secret;
  const label = short || d.label;
  const tech = short ? '' : d.tech;
  return `<div class="kv${short ? ' kv-compact' : ''}">
    <div class="kv-main"><span class="kv-label">${esc(label)}${tech ? ` <small>${esc(tech)}</small>` : ''}</span><span class="kv-value${d.secret ? ' is-secret' : ''}">${esc(d.value)}</span></div>
    ${canCopy ? `<button type="button" class="copy${short ? ' copy-icon' : ''}" data-copy="${esc(d.value)}" aria-label="Copier : ${esc(d.label)}">${ICONS.copy}<span${short ? ' class="sr-only"' : ''}>Copier</span></button>` : ''}
  </div>`;
}
const fields = (keys) => { const defs = fieldDefs(); return `<div class="fields">${keys.map((k) => kv(k, defs)).join('')}</div>`; };

function tags(covers) {
  return `<span class="tags">${covers.map((s) => `<span class="tag">${ICONS[SERVICE_META[s].icon]}${SERVICE_META[s].label}</span>`).join('')}</span>`;
}

function listFr(words) {
  return words.length < 2 ? words.join('') : words.slice(0, -1).join(', ') + ' et ' + words[words.length - 1];
}

function profileUrl() {
  const p = new URLSearchParams({ email: state.email });
  if (state.name) p.set('name', state.name);
  p.set('services', [...state.services].join(','));
  return '/profile.mobileconfig?' + p.toString();
}

function setStep(n, deviceId = '') {
  const hrefs = { 1: '#/', 2: '#/appareil', 3: deviceId ? '#/appareil/' + deviceId : '' };
  document.querySelectorAll('#stepper li').forEach((li) => {
    const s = Number(li.dataset.step);
    const a = li.querySelector('a');
    li.classList.toggle('done', s < n);
    li.classList.toggle('current', s === n);
    if (s < n && hrefs[s]) a.setAttribute('href', hrefs[s]); else a.removeAttribute('href');
    if (s === n) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
  });
}

function showWizard(html, step, deviceId = '') {
  $('#view-home').hidden = true;
  $('#view-wizard').hidden = false;
  $('#who-email').textContent = state.email;
  setStep(step, deviceId);
  const view = $('#view');
  view.innerHTML = html;
  view.classList.remove('fade-in');
  void view.offsetWidth;
  view.classList.add('fade-in');
  document.body.classList.toggle('has-gnav', !!view.querySelector('.gnav'));
  window.scrollTo({ top: 0, behavior: 'auto' });
  const h = view.querySelector('[data-focus]') || view.querySelector('h1');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function renderHome() {
  state.nav = null;
  document.body.classList.remove('has-gnav');
  $('#view-wizard').hidden = true;
  $('#view-home').hidden = false;
  if (state.email) $('#email').value = state.email;
  if (state.name) { $('#name').value = state.name; $('#name-opt').open = true; }
  document.title = 'Configurer ma messagerie · ' + state.cfg.brand;
}

function renderDevices() {
  state.nav = null;
  const detected = state.detected;
  const ordered = detected ? [DEVICES.find((d) => d.id === detected), ...DEVICES.filter((d) => d.id !== detected)] : DEVICES;
  const cards = ordered.map((d) => {
    const isDet = d.id === detected;
    return `<a class="device${isDet ? ' is-detected' : ''}" href="#/appareil/${d.id}">
      ${isDet ? '<span class="badge">Cet appareil</span>' : ''}
      <span class="device-icon">${ICONS[d.icon]}</span>
      <span class="device-name">${esc(d.name)}</span>
    </a>`;
  }).join('');
  showWizard(`
    <div class="view-head">
      <h1>Quel appareil voulez-vous configurer&nbsp;?</h1>
    </div>
    <div class="devices">${cards}</div>
    ${phoneQr('', '')}`, 2);
  document.title = 'Choisir l’appareil · ' + state.cfg.brand;
}

// Choix de l'application recommandée (mise en avant) et des applications « suite » (discrètes).
const FOLLOW_UPS = new Set(['caldavsync', 'davx5']);
function recommendedApp(deviceId) {
  const own = APPS[deviceId].find((id) => GUIDES[id].recommended);
  if (own) return own;
  if (deviceId === 'android') return state.detected === 'android' && /Samsung|SM-[A-Z]\d/i.test(navigator.userAgent || '') ? 'samsung' : 'gmail';
  return null;
}

function servicesPicker() {
  const sel = Object.keys(SERVICE_META).filter((k) => state.services.has(k)).map((k) => SERVICE_META[k].label);
  return `<details class="opts">
    <summary>À configurer&nbsp;: <strong id="svc-summary">${esc(listFr(sel))}</strong> <u>Modifier</u></summary>
    <fieldset class="services"><legend class="sr-only">Que voulez-vous configurer ?</legend>
    ${Object.entries(SERVICE_META).map(([k, m]) => `<label class="chip"><input type="checkbox" name="svc" value="${k}"${state.services.has(k) ? ' checked' : ''}><span>${ICONS[m.icon]}${m.label}</span></label>`).join('')}
    </fieldset>
  </details>`;
}

function renderApps(deviceId) {
  state.nav = null;
  const dev = DEVICES.find((d) => d.id === deviceId);
  if (!dev) return go('#/appareil');
  const rec = recommendedApp(deviceId);
  const ids = APPS[deviceId];
  const main = rec ? [rec] : ids.filter((id) => !FOLLOW_UPS.has(id));
  const rest = ids.filter((id) => !main.includes(id));
  const alt = rest.filter((id) => !FOLLOW_UPS.has(id));
  const follow = rest.filter((id) => FOLLOW_UPS.has(id));
  const big = (g) => `<a class="app-card${g.id === rec ? ' is-recommended' : ''}" href="#/guide/${deviceId}/${g.id}">
      ${g.id === rec ? '<span class="badge">Recommandé</span>' : ''}
      <span class="app-icon">${ICONS[g.icon]}</span>
      <span class="app-body"><span class="app-title">${esc(g.name)}</span><span class="app-desc">${esc(g.desc)}</span>${tags(g.covers)}</span>
      ${g.id === rec ? `<span class="btn btn-primary app-go">Commencer${ICONS.arrow}</span>` : `<span class="app-arrow">${ICONS.arrow}</span>`}
    </a>`;
  const small = (g) => `<a class="app-row" href="#/guide/${deviceId}/${g.id}">
      <span class="app-row-icon">${ICONS[g.icon]}</span>
      <span class="app-body"><span class="app-row-title">${esc(g.name)}</span><span class="app-desc">${esc(g.desc)}</span></span>
      <span class="app-arrow">${ICONS.arrow}</span>
    </a>`;
  const title = GUIDES[rec] && GUIDES[rec].profile ? `${esc(dev.name)}&nbsp;: la méthode la plus simple` : `${esc(dev.name)}&nbsp;: quelle application utilisez-vous&nbsp;?`;
  showWizard(`
    <div class="view-head">
      <h1>${title}</h1>
    </div>
    ${deviceId === 'ios' || deviceId === 'android' ? phoneQr(deviceId, '', true) : ''}
    <div class="apps">${main.map((id) => big(GUIDES[id])).join('')}</div>
    ${alt.length ? `<div class="apps-more"><h2>${deviceId === 'android' ? 'Autre application' : 'Autres méthodes'}</h2>${alt.map((id) => small(GUIDES[id])).join('')}</div>` : ''}
    ${follow.length ? `<div class="apps-more"><h2>Pour l’agenda et les contacts</h2>${follow.map((id) => small(GUIDES[id])).join('')}</div>` : ''}
    ${servicesPicker()}
    <p class="view-back"><a href="#/appareil">${ICONS.back}Changer d’appareil</a></p>`, 3, deviceId);
  document.title = dev.name + ' · ' + state.cfg.brand;
  $('#view').querySelectorAll('input[name="svc"]').forEach((cb) => cb.addEventListener('change', () => {
    const checked = [...$('#view').querySelectorAll('input[name="svc"]:checked')].map((x) => x.value);
    if (!checked.length) { cb.checked = true; toast('Choisissez au moins un élément.'); return; }
    state.services = new Set(checked);
    $('#svc-summary').textContent = listFr(Object.keys(SERVICE_META).filter((k) => state.services.has(k)).map((k) => SERVICE_META[k].label));
  }));
}

// Étapes du guide, à plat, selon les services choisis.
function guideSteps(g) {
  const sections = g.sections.filter((s) => s.service === 'all' || state.services.has(s.service) || !g.covers.some((c) => state.services.has(c)));
  const out = [];
  sections.forEach((s) => s.steps.forEach((st) => out.push({ st, section: s })));
  return out;
}

function renderShot(st, g, n) {
  const shots = new Set(state.cfg.shots || []);
  if (!st.shot || !shots.has(st.shot)) return '';
  const id = 'shot-' + n;
  const cap = st.shotCaption || `Capture d’écran : ${g.name}, étape ${n}`;
  return `<div class="shot">
    <button type="button" class="shot-toggle" aria-expanded="false" aria-controls="${id}" data-shot="/img/guides/${esc(st.shot)}">${ICONS.image}<span>Voir une capture</span></button>
    <figure class="shot-fig" id="${id}" hidden>
      <a class="shot-link" href="/img/guides/${esc(st.shot)}" target="_blank" rel="noopener" title="Ouvrir en grand"><img alt="${esc(cap)}" loading="lazy" decoding="async"></a>
      <figcaption><span>${esc(cap)}</span><button type="button" class="shot-close" aria-controls="${id}">${ICONS.close}Fermer</button></figcaption>
    </figure>
  </div>`;
}

const guideLinks = (params = true) => `<p class="guide-links">
    ${params ? `<button type="button" class="link-btn" data-panel="panel-params" aria-haspopup="dialog">${ICONS.gear}Afficher les paramètres manuels</button>` : ''}
    <button type="button" class="link-btn" data-panel="panel-help" aria-haspopup="dialog">${ICONS.info}Besoin d’aide&nbsp;?</button>
  </p>`;

function renderGuide(deviceId, guideId, stepParam) {
  const dev = DEVICES.find((d) => d.id === deviceId);
  const g = GUIDES[guideId];
  if (!dev || !g || !APPS[deviceId].includes(guideId)) return go('#/appareil');
  const steps = guideSteps(g);
  const total = steps.length;
  const base = `#/guide/${deviceId}/${guideId}`;
  if (stepParam === 'fin') return renderDone(dev, g, base + '/' + total);
  let n = Number(stepParam || 1);
  if (!Number.isInteger(n) || n < 1 || n > total) return go(base);

  const { st, section } = steps[n - 1];
  const secIcon = SERVICE_META[section.service] ? ICONS[SERVICE_META[section.service].icon] : ICONS.gear;
  const prev = n > 1 ? `${base}/${n - 1}` : `#/appareil/${deviceId}`;
  const next = n < total ? `${base}/${n + 1}` : `${base}/fin`;
  state.nav = { prev, next };
  const callouts = n === 1 ? (g.callouts || []).map((c) => `<div class="callout${c.kind === 'warn' ? ' callout-warn' : ''}">${ICONS[c.kind === 'warn' ? 'warn' : 'info']}<p>${fmt(c.t)}</p></div>`).join('') : '';

  showWizard(`
    <header class="guide-head">
      <span class="app-icon">${ICONS[g.icon]}</span>
      <div><p class="guide-kicker">${esc(dev.name)}</p><h1>${esc(g.name)}</h1></div>
    </header>
    ${n === 1 ? `<details class="about"><summary>${ICONS.info}En savoir plus sur cette méthode</summary><p>${fmt(g.intro)}</p></details>` : ''}
    ${callouts}
    <article class="card gcard" aria-labelledby="gstep-title">
      <div class="gprog">
        <h2 id="gstep-title" data-focus>Étape ${n} sur ${total}</h2>
        <span class="gsec">${secIcon}${esc(section.title)}</span>
      </div>
      <progress class="gbar" max="${total}" value="${n}" aria-hidden="true"></progress>
      <p class="gtext">${fmt(st.t)}</p>
      ${st.dl ? `<div class="download-box">
        <a class="btn btn-primary" href="${esc(profileUrl())}" download>${ICONS.download}Télécharger le profil</a>
        <p class="download-meta">Pour <strong>${esc(state.email)}</strong> : ${esc(listFr([...state.services].map((s) => SERVICE_META[s].label)))}. Sans mot de passe.</p>
      </div>` : ''}
      ${st.f ? fields(st.f) : ''}
      ${st.sub ? `<p class="sub">${fmt(st.sub)}</p>` : ''}
      ${renderShot(st, g, n)}
    </article>
    <nav class="gnav" aria-label="Navigation entre les étapes">
      <a class="btn btn-ghost" href="${prev}" rel="prev">${ICONS.back}Précédent</a>
      <a class="btn btn-primary" href="${next}" rel="next">${n < total ? 'Suivant' : 'Terminer'}${ICONS.arrow}</a>
    </nav>
    ${guideLinks()}
    ${deviceId === 'ios' || deviceId === 'android' ? phoneQr(deviceId, g.id) : ''}`, 4, deviceId);
  document.title = `Étape ${n}/${total} · ${g.name} · ${state.cfg.brand}`;
}

function renderDone(dev, g, lastStep) {
  state.nav = { prev: lastStep, next: null };
  const covered = g.covers.filter((s) => state.services.has(s));
  const list = covered.length ? covered : g.covers;
  const NOUN = { mail: 'vos e-mails', calendar: 'votre agenda', contacts: 'vos contacts' };
  const what = listFr(list.map((s) => NOUN[s]));
  const plural = list.length > 1 || list[0] !== 'calendar';
  const ready = what.charAt(0).toUpperCase() + what.slice(1) + (plural ? ' sont prêts' : ' est prêt');
  const next = g.next && APPS[dev.id].includes(g.next.guide) ? g.next : null;
  const tips = (g.tips || []).filter(presetOk).map((t) => `<li>${fmt(t)}</li>`).join('');
  showWizard(`
    <div class="card done-card">
      <span class="done-icon">${ICONS.check}</span>
      <h1 data-focus>C’est terminé</h1>
      <p class="done-lead">${esc(ready)} sur votre ${esc(dev.name)}.</p>
      ${next ? `<div class="next-card">
        <p><strong>${esc(next.t)}</strong><br>${esc(next.d)}</p>
        <a class="btn btn-primary btn-block" href="#/guide/${dev.id}/${next.guide}">Continuer${ICONS.arrow}</a>
      </div>` : ''}
      <div class="done-actions">
        <a class="btn ${next ? 'btn-ghost' : 'btn-primary'} btn-block" href="#/appareil">Configurer un autre appareil</a>
        <a class="link-plain" href="${lastStep}">${ICONS.back}Revoir les étapes</a>
      </div>
      ${tips ? `<details class="tips"><summary>Bon à savoir</summary><ul>${tips}</ul></details>` : ''}
    </div>
    ${guideLinks(false)}`, 5, dev.id);
  document.title = 'C’est terminé · ' + state.cfg.brand;
}

function renderParams() {
  const defs = fieldDefs();
  const group = (title, tech, icon, rows) => `<section class="pgroup">
    <h3>${ICONS[icon]}${esc(title)}${tech ? ` <small>${esc(tech)}</small>` : ''}</h3>
    ${rows.map(([k, short]) => kv(k, defs, short)).join('')}
  </section>`;
  $('#params').innerHTML =
    group('Identifiants', '', 'key', [['username', 'Nom d’utilisateur'], ['password', 'Mot de passe']]) +
    group('Réception des e-mails', 'IMAP', 'mail', [['imapHost', 'Serveur'], ['imapPort', 'Port'], ['imapSec', 'Sécurité']]) +
    group('Envoi des e-mails', 'SMTP', 'mail', [['smtpHost', 'Serveur'], ['smtpPort', 'Port'], ['smtpSec', 'Sécurité'], ['smtpAuth', 'Authentification']]) +
    group('Agenda', 'CalDAV', 'calendar', [['caldav', 'Agenda'], ['tasks', 'Tâches'], ['davDiscovery', 'Découverte']]) +
    group('Contacts', 'CardDAV', 'contacts', [['carddav', 'Contacts'], ['davCardDiscovery', 'Découverte']]) +
    group('Webmail', '', 'globe', [['webmail', 'Adresse']]);
  $('#params-lead').textContent = state.email
    ? `Pour ${state.email}. Utiles seulement si vous configurez sans le guide.`
    : `Valables pour toutes les adresses ${state.cfg.brand}. Indiquez votre adresse pour obtenir vos adresses d’agenda et de contacts.`;
}

function applyConfigToStatic() {
  const c = state.cfg;
  const sup = c.support || {};
  const show = (el, on) => { if (el) el.hidden = !on; };
  const tel = 'tel:' + String(sup.phone || '').replace(/[^+\d]/g, '');
  document.querySelectorAll('.js-brand-name').forEach((e) => { e.textContent = c.brand; });
  document.querySelectorAll('.js-org').forEach((e) => { e.textContent = c.organization || c.brand; });
  const logo = c.brandLogoUrl;
  document.querySelectorAll('.js-brand-logo').forEach((img) => {
    if (logo) { img.src = logo; img.alt = c.brand; }
    show(img, !!logo);
  });
  // Avec un logo, le nom reste lisible par les lecteurs d'écran (alt) : on masque l'icône et le texte.
  document.querySelectorAll('.js-brand-mark').forEach((e) => show(e, !logo));
  document.querySelectorAll('.brand > .js-brand-name').forEach((e) => show(e, !logo));
  document.querySelectorAll('[data-preset]').forEach((e) => show(e, e.dataset.preset === c.davPreset));
  document.querySelectorAll('.js-webmail').forEach((a) => { a.href = c.webmailUrl; });
  document.querySelectorAll('.js-imap-host').forEach((e) => { e.textContent = c.imap.host; });
  document.querySelectorAll('.js-smtp').forEach((e) => { e.textContent = `${c.smtp.host}, port ${c.smtp.port}, ${c.smtp.security}`; });
  document.querySelectorAll('.js-dav-discovery').forEach((e) => { e.textContent = c.davDiscoveryUrl; });
  document.querySelectorAll('.js-support-phone').forEach((a) => { a.href = tel; a.textContent = sup.phone || ''; show(a, !!sup.phone); });
  document.querySelectorAll('.js-support-email').forEach((a) => { a.href = 'mailto:' + (sup.email || ''); a.textContent = sup.email || ''; show(a, !!sup.email); });
  const phone = $('#support-phone');
  if (phone) { phone.href = tel; phone.querySelector('span').textContent = sup.phone || ''; show(phone, !!sup.phone); }
  const mail = $('#support-email');
  if (mail) { mail.href = 'mailto:' + (sup.email || ''); mail.querySelector('span').textContent = sup.email || ''; show(mail, !!sup.email); }
  const hours = $('#support-hours');
  if (hours) { hours.textContent = sup.hours || ''; show(hours, !!sup.hours); }
  const addr = $('#support-address');
  if (addr) { addr.textContent = sup.address || ''; show(addr, !!sup.address); }
  show($('#support-box'), !!(sup.phone || sup.email || sup.hours || sup.address));
}

/* ---------- Panneaux (paramètres, aide) : <dialog> modal ---------- */
let panelOpener = null;
const openDialog = () => document.querySelector('dialog.panel[open]');
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function openPanel(id, opener) {
  const dlg = document.getElementById(id);
  if (!dlg || dlg.open) return;
  const cur = openDialog();
  if (cur) cur.close('swap');
  panelOpener = opener || document.activeElement;
  dlg.showModal();
  dlg.querySelector('.panel-body').scrollTop = 0;
  dlg.querySelector('[data-close]').focus();
  // Le bouton « retour » du téléphone ferme le panneau au lieu de quitter l'étape.
  if (!(history.state && history.state.panel)) history.pushState({ panel: id }, '', location.href);
}

function bindPanels() {
  document.querySelectorAll('dialog.panel').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'swap') { dlg.returnValue = ''; return; }
      if (history.state && history.state.panel) history.back();
      if (panelOpener && document.contains(panelOpener)) panelOpener.focus();
      panelOpener = null;
    });
    // Clic sur le fond (hors du panneau) : fermeture.
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = [...dlg.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  window.addEventListener('popstate', () => {
    const dlg = openDialog();
    if (dlg && !(history.state && history.state.panel)) { dlg.returnValue = 'pop'; dlg.close(); }
  });
}

/* ---------- Navigation ---------- */
function syncUrl(device = '', app = '') {
  const p = new URLSearchParams(location.search);
  if (state.email) p.set('email', state.email); else p.delete('email');
  if (state.name) p.set('name', state.name); else p.delete('name');
  if (device) p.set('device', device); else p.delete('device');
  if (app) p.set('app', app); else p.delete('app');
  const qs = p.toString();
  history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}
function go(hash) {
  if (location.hash === hash) route(); else location.hash = hash;
}
function route() {
  const dlg = openDialog();
  if (dlg) dlg.close();
  const h = location.hash;
  if (!h.startsWith('#/')) { if (!h) renderHome(); return; }
  const parts = h.slice(2).split('/').filter(Boolean);
  if (!parts.length || !state.email) return renderHome();
  // Garde ?device= et ?app= alignés sur l'écran affiché (lien partageable).
  const dev = parts[0] === 'appareil' || parts[0] === 'guide' ? parts[1] || '' : '';
  syncUrl(DEVICES.some((d) => d.id === dev) ? dev : '', parts[0] === 'guide' && GUIDES[parts[2]] ? parts[2] : '');
  if (parts[0] === 'appareil' && parts.length === 1) return renderDevices();
  if (parts[0] === 'appareil' && parts[1]) return renderApps(parts[1]);
  if (parts[0] === 'guide' && parts[1] && parts[2]) return renderGuide(parts[1], parts[2], parts[3]);
  renderHome();
}

/* ---------- Copie ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* repli ci-dessous */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.className = 'sr-copy';
  (openDialog() || document.body).appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

/* ---------- Démarrage ---------- */
function bind() {
  const form = $('#start-form');
  const emailInput = $('#email');
  const err = $('#email-error');
  const showErr = (msg) => {
    err.textContent = msg;
    err.hidden = !msg;
    emailInput.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = emailError(emailInput.value);
    if (msg) { showErr(msg); emailInput.focus(); return; }
    showErr('');
    state.email = normalizeEmail(emailInput.value);
    state.name = normalizeName($('#name').value);
    syncUrl();
    renderParams();
    go('#/appareil');
  });
  emailInput.addEventListener('input', () => { if (!err.hidden && !emailError(emailInput.value)) showErr(''); });

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (btn) {
      const ok = await copyText(btn.dataset.copy);
      if (ok) {
        btn.classList.add('is-done');
        btn.querySelector('span').textContent = 'Copié';
        btn.firstElementChild.outerHTML = ICONS.check;
        toast('Copié : ' + btn.dataset.copy);
        setTimeout(() => {
          btn.classList.remove('is-done');
          btn.querySelector('span').textContent = 'Copier';
          btn.firstElementChild.outerHTML = ICONS.copy;
        }, 1800);
      } else {
        toast('Copie impossible : sélectionnez le texte manuellement.');
      }
      return;
    }
    const st = e.target.closest('.shot-toggle, .shot-close');
    if (st) {
      const fig = document.getElementById(st.getAttribute('aria-controls'));
      const toggle = fig && fig.parentElement.querySelector('.shot-toggle');
      if (!fig || !toggle) return;
      const open = fig.hidden;
      if (open) {
        const img = fig.querySelector('img');
        if (!img.getAttribute('src')) img.src = toggle.dataset.shot;
      }
      fig.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Masquer la capture' : 'Voir une capture';
      if (!open) toggle.focus();
      return;
    }
    const pb = e.target.closest('[data-panel]');
    if (pb) { openPanel(pb.dataset.panel, pb); return; }
    const cb = e.target.closest('[data-close]');
    if (cb) { const d = cb.closest('dialog'); if (d) d.close(); }
  });

  // Flèches gauche/droite : étape précédente/suivante du guide.
  document.addEventListener('keydown', (e) => {
    if (!state.nav || openDialog() || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'ArrowRight' && state.nav.next) { e.preventDefault(); go(state.nav.next); }
    else if (e.key === 'ArrowLeft' && state.nav.prev) { e.preventDefault(); go(state.nav.prev); }
  });
  window.addEventListener('hashchange', route);
  bindPanels();
}

async function init() {
  const q = new URLSearchParams(location.search);
  const qEmail = normalizeEmail(q.get('email') || '');
  if (qEmail) state.email = qEmail;
  else if (q.get('email')) $('#email').value = q.get('email');
  state.name = normalizeName(q.get('name') || '');
  // Après un rechargement, un éventuel état « panneau ouvert » de l'historique n'a plus de sens.
  if (history.state && history.state.panel) history.replaceState(null, '', location.href);
  bind();
  try {
    const r = await fetch('/api/config', { headers: { Accept: 'application/json' } });
    if (r.ok) state.cfg = Object.assign({}, DEFAULT_CFG, await r.json());
  } catch { /* valeurs par défaut */ }
  applyConfigToStatic();
  renderParams();
  // Lien direct du support (?email=…&device=…&app=…) : on ouvre directement l'écran demandé.
  if (state.email && !location.hash.startsWith('#/')) {
    const dev = q.get('device');
    const app = q.get('app');
    let hash = '#/appareil';
    if (dev && APPS[dev]) hash = APPS[dev].includes(app) ? `#/guide/${dev}/${app}` : `#/appareil/${dev}`;
    history.replaceState(null, '', location.pathname + location.search + hash);
  }
  route();
}

init();
