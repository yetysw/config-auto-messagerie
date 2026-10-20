// Générateur de liens pour le support (page interne, protégée par HTTP Basic côté serveur).
import { DEVICES, APPS, GUIDES } from '/js/guides.js';
import { encode, toSvg, toCanvas } from '/js/qr.js';

const $ = (s) => document.querySelector(s);

// Même validation que server/validate.js et public/js/app.js.
const LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD_RE = /^(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{1,59})$/;
function normalizeEmail(raw) {
  const email = String(raw || '').trim();
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
const normalizeName = (s) => String(s || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);

let cfg = {
  brand: 'Mail Setup',
  brandLogoUrl: '',
  publicUrl: location.origin,
  support: { email: '', phone: '', hours: '', address: '' },
};
let current = null; // { link, email, name, device, app, qr }
let generated = false;

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function fillApps() {
  const dev = $('#s-device').value;
  const sel = $('#s-app');
  sel.innerHTML = '<option value="">Laisser le client choisir</option>';
  sel.disabled = !dev;
  if (!dev) return;
  for (const id of APPS[dev]) {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = GUIDES[id].name;
    sel.appendChild(o);
  }
}

function buildLink({ email, name, device, app }) {
  const p = new URLSearchParams({ email });
  if (name) p.set('name', name);
  if (device) p.set('device', device);
  if (device && app) p.set('app', app);
  return String(cfg.publicUrl).replace(/\/+$/, '') + '/?' + p.toString();
}

// Phrase de contact du courriel, selon les coordonnées renseignées (toutes facultatives).
function contactLine(s) {
  const ways = [s.phone && `au ${s.phone}`, s.email && `à ${s.email}`].filter(Boolean);
  if (!ways.length) return 'Si vous avez la moindre question, nous restons à votre disposition.';
  return `Si vous avez la moindre question, nous restons à votre disposition ${ways.join(' ou ')}${s.hours ? ` (${s.hours})` : ''}.`;
}

function applyBrand() {
  document.querySelectorAll('.js-brand-name').forEach((e) => { e.textContent = cfg.brand; });
  const logo = cfg.brandLogoUrl;
  document.querySelectorAll('.js-brand-logo').forEach((img) => { if (logo) { img.src = logo; img.alt = cfg.brand; } img.hidden = !logo; });
  document.querySelectorAll('.js-brand-mark, .brand > .js-brand-name').forEach((e) => { e.hidden = !!logo; });
  document.title = 'Générateur de liens · Support ' + cfg.brand;
}

function mailBody({ link, email, name, device, app }) {
  const dev = DEVICES.find((d) => d.id === device);
  const where = dev ? ` sur votre ${dev.name}` + (app ? ` (${GUIDES[app].name})` : '') : '';
  const s = cfg.support;
  const lines = [
    name ? `Bonjour ${name},` : 'Bonjour,',
    '',
    `Pour configurer votre adresse ${email}${where}, il vous suffit d’ouvrir le lien ci-dessous. Il vous guide pas à pas, avec vos paramètres déjà renseignés :`,
    '',
    link,
    '',
  ];
  if (device === 'ios' || device === 'macos') lines.push('Sur iPhone, iPad ou Mac, ouvrez de préférence ce lien dans Safari.', '');
  lines.push(
    'Vous aurez besoin du mot de passe de votre boîte mail. Il ne vous sera jamais demandé sur cette page : vous le saisirez uniquement dans votre appareil.',
    '',
    contactLine(s),
    '',
    'Meilleures salutations,',
    'Support ' + cfg.brand,
  );
  return lines.join('\r\n');
}

function render() {
  const emailInput = $('#s-email');
  const err = $('#s-email-error');
  const email = normalizeEmail(emailInput.value);
  if (!email) {
    const v = emailInput.value.trim();
    err.textContent = !v ? 'Saisissez l’adresse e-mail du client.' : 'Cette adresse ne semble pas valide.';
    err.hidden = false;
    emailInput.setAttribute('aria-invalid', 'true');
    return false;
  }
  err.hidden = true;
  emailInput.setAttribute('aria-invalid', 'false');
  const data = {
    email,
    name: normalizeName($('#s-name').value),
    device: $('#s-device').value,
    app: $('#s-app').value,
  };
  data.link = buildLink(data);
  data.qr = encode(data.link, 'M');
  current = data;

  $('#r-who').textContent = data.name ? `${data.name} <${email}>` : email;
  const a = $('#r-link');
  a.href = data.link;
  a.textContent = data.link;
  $('#r-qr').innerHTML = toSvg(data.qr, { title: 'QR code : ' + data.link });

  const at = email.lastIndexOf('@');
  const to = encodeURIComponent(email.slice(0, at)) + '@' + email.slice(at + 1);
  const subject = 'Configuration de votre messagerie ' + cfg.brand;
  $('#r-mail').href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody(data))}`;
  const sms = `${cfg.brand} : configurez votre messagerie ${email} en suivant ce lien : ${data.link}`;
  const phone = $('#s-phone').value.replace(/[^+\d]/g, '');
  $('#r-sms').href = `sms:${phone}?&body=${encodeURIComponent(sms)}`;
  $('#sup-result').hidden = false;
  return true;
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const fileBase = () => 'qr-' + current.email.replace(/[^A-Za-z0-9._-]+/g, '_');

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* repli */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.className = 'sr-copy';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

function init() {
  const devSel = $('#s-device');
  for (const d of DEVICES) {
    const o = document.createElement('option');
    o.value = d.id;
    o.textContent = d.name;
    devSel.appendChild(o);
  }
  devSel.addEventListener('change', () => { fillApps(); if (generated) render(); });
  $('#sup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (render()) {
      generated = true;
      if (matchMedia('(max-width: 979px)').matches) $('#sup-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else $('#s-email').focus();
  });
  // Une fois le premier lien généré, il suit les modifications du formulaire.
  for (const id of ['#s-email', '#s-name', '#s-app', '#s-phone']) {
    $(id).addEventListener(id === '#s-app' ? 'change' : 'input', () => {
      if (!generated) return;
      if (id === '#s-email' && !normalizeEmail($('#s-email').value)) return;
      render();
    });
  }
  $('#r-copy').addEventListener('click', async () => {
    if (!current) return;
    toast((await copyText(current.link)) ? 'Lien copié.' : 'Copie impossible : sélectionnez le lien manuellement.');
  });
  $('#r-svg').addEventListener('click', () => {
    if (!current) return;
    const svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + toSvg(current.qr, { dark: '#000000' }).replace('<svg ', '<svg width="400" height="400" ');
    download(new Blob([svg], { type: 'image/svg+xml' }), fileBase() + '.svg');
  });
  $('#r-png').addEventListener('click', () => {
    if (!current) return;
    const canvas = toCanvas(current.qr, document.createElement('canvas'), { scale: 12, dark: '#000000' });
    canvas.toBlob((b) => { if (b) download(b, fileBase() + '.png'); else toast('Export PNG impossible.'); }, 'image/png');
  });

  fetch('/api/config', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((c) => { if (c) { cfg = Object.assign(cfg, c); applyBrand(); if (generated) render(); } })
    .catch(() => {});
}

init();
