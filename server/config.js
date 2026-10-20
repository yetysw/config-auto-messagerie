'use strict';

// Toute la configuration vient de variables d'environnement (voir docker-compose.yml).
function env(name, def) {
  const v = process.env[name];
  return v === undefined || v === '' ? def : v;
}
function int(name, def) {
  const n = parseInt(env(name, String(def)), 10);
  return Number.isFinite(n) && n > 0 && n < 65536 ? n : def;
}

function httpUrl(v) {
  try {
    const u = new URL(v);
    if (u.protocol === 'https:' || u.protocol === 'http:') return u.origin + u.pathname.replace(/\/+$/, '');
  } catch { /* défaut ci-dessous */ }
  return 'https://config.example.com';
}

// Remplace {email}, {local} et {domain} dans un gabarit d'URL DAV (même logique que app.js).
function davUrl(template, email) {
  const at = email.lastIndexOf('@');
  const local = email.slice(0, at).toLowerCase();
  const domain = email.slice(at + 1).toLowerCase();
  const enc = (s) => encodeURIComponent(s).replace(/%40/g, '@');
  return template.replace(/\{email\}/g, enc(local + '@' + domain)).replace(/\{local\}/g, enc(local)).replace(/\{domain\}/g, enc(domain));
}

// Préréglages des URL DAV. « mdaemon » : chemins /webdav/… et collections b64=… de MDaemon.
// « generic » : découverte standard (.well-known), pour tout serveur CalDAV/CardDAV conforme.
const PRESET = env('DAV_PRESET', 'mdaemon').toLowerCase() === 'generic' ? 'generic' : 'mdaemon';
const MAIL_HOST = env('MAIL_HOST', 'mail.example.com');
const DAV_BASE = env('DAV_BASE_URL', 'https://' + MAIL_HOST).replace(/\/+$/, '');
const PRESETS = {
  mdaemon: {
    caldavUrl: DAV_BASE + '/webdav/calendar',
    carddavUrl: DAV_BASE + '/webdav/addressbook',
    tasksUrl: DAV_BASE + '/webdav/tasklist',
    principal: DAV_BASE + '/webdav/principals/{email}/',
    calendar: DAV_BASE + '/webdav/caldav/{domain}/{local}/b64=Q2FsZW5kYXI/',
    tasks: DAV_BASE + '/webdav/caldav/{domain}/{local}/b64=VGFza3M/',
    contacts: DAV_BASE + '/webdav/carddav/{domain}/{local}/b64=Q29udGFjdHM/',
  },
  generic: {
    caldavUrl: DAV_BASE + '/.well-known/caldav',
    carddavUrl: DAV_BASE + '/.well-known/carddav',
    tasksUrl: DAV_BASE + '/.well-known/caldav',
    principal: DAV_BASE + '/.well-known/caldav',
    calendar: DAV_BASE + '/.well-known/caldav',
    tasks: DAV_BASE + '/.well-known/caldav',
    contacts: DAV_BASE + '/.well-known/carddav',
  },
};
const P = PRESETS[PRESET];

// Couleur d'accent : uniquement #rgb ou #rrggbb (injectée dans /brand.css).
function color(v, def) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v || '') ? v : def;
}
// Logo : chemin local (/img/…) ou URL http(s) absolue ; vide = logo texte + icône neutre.
function logoUrl(v) {
  if (!v) return '';
  if (/^\/[^/\\]/.test(v)) return v;
  try {
    const u = new URL(v);
    if (u.protocol === 'https:' || u.protocol === 'http:') return u.href;
  } catch { /* ignoré */ }
  return '';
}

const BRAND = env('BRAND_NAME', 'Mail Setup');

const config = {
  port: int('PORT', 8080),
  brand: BRAND,
  brandLogoUrl: logoUrl(env('BRAND_LOGO_URL', '')),
  brandAccent: color(env('BRAND_ACCENT', ''), '#2563eb'),
  davPreset: PRESET,
  imap: {
    host: env('IMAP_HOST', MAIL_HOST),
    port: int('IMAP_PORT', 993),
    security: env('IMAP_SECURITY', 'SSL/TLS'),
  },
  smtp: {
    host: env('SMTP_HOST', MAIL_HOST),
    port: int('SMTP_PORT', 465),
    security: env('SMTP_SECURITY', 'SSL/TLS'),
  },
  // Alias affichés tant qu'aucune adresse n'est saisie (l'utilisateur est déduit de l'authentification).
  caldavUrl: env('CALDAV_URL', P.caldavUrl),
  carddavUrl: env('CARDDAV_URL', P.carddavUrl),
  tasksUrl: env('TASKS_URL', P.tasksUrl),
  // URL de découverte (.well-known) : DAVx5, bouton de découverte de CalDAV Synchronizer.
  davDiscoveryUrl: env('DAV_DISCOVERY_URL', DAV_BASE + '/.well-known/caldav'),
  davCardDiscoveryUrl: env('DAV_CARD_DISCOVERY_URL', DAV_BASE + '/.well-known/carddav'),
  // Gabarits des URL personnelles, dérivées de l'adresse saisie.
  // Variables : {email} (adresse complète), {local} (partie avant @), {domain}.
  davTemplates: {
    principal: env('DAV_PRINCIPAL_URL_TEMPLATE', P.principal),
    calendar: env('DAV_CALENDAR_URL_TEMPLATE', P.calendar),
    tasks: env('DAV_TASKS_URL_TEMPLATE', P.tasks),
    contacts: env('DAV_CONTACTS_URL_TEMPLATE', P.contacts),
  },
  webmailUrl: env('WEBMAIL_URL', 'https://' + MAIL_HOST + '/'),
  // Adresse publique du configurateur (liens et QR codes envoyés aux clients).
  publicUrl: httpUrl(env('PUBLIC_URL', 'https://config.example.com')),
  // Page interne /support (désactivée si SUPPORT_PASSWORD est vide).
  supportAuth: {
    user: env('SUPPORT_USER', 'support'),
    password: env('SUPPORT_PASSWORD', ''),
  },
  // Coordonnées du support : toutes facultatives (vide = masqué).
  support: {
    email: env('SUPPORT_EMAIL', ''),
    phone: env('SUPPORT_PHONE', ''),
    hours: env('SUPPORT_HOURS', ''),
    address: env('SUPPORT_ADDRESS', ''),
  },
  profile: {
    org: env('PROFILE_ORGANIZATION', BRAND),
    idPrefix: env('PROFILE_ID_PREFIX', 'com.example.mailsetup'),
  },
  links: {
    caldavSynchronizer: env('CALDAVSYNC_URL', 'https://caldavsynchronizer.org/download-2/'),
    davx5Github: env('DAVX5_GITHUB_URL', 'https://github.com/bitfireAT/davx5-ose/releases'),
    davx5Fdroid: env('DAVX5_FDROID_URL', 'https://f-droid.org/packages/at.bitfire.davdroid/'),
    davx5Play: env('DAVX5_PLAY_URL', 'https://play.google.com/store/apps/details?id=at.bitfire.davdroid'),
    thunderbird: env('THUNDERBIRD_URL', 'https://www.thunderbird.net/fr/'),
  },
};

// Vue publique transmise au navigateur (aucune donnée sensible).
function publicConfig() {
  return {
    brand: config.brand,
    brandLogoUrl: config.brandLogoUrl,
    davPreset: config.davPreset,
    organization: config.profile.org,
    imap: config.imap,
    smtp: config.smtp,
    caldavUrl: config.caldavUrl,
    carddavUrl: config.carddavUrl,
    tasksUrl: config.tasksUrl,
    davDiscoveryUrl: config.davDiscoveryUrl,
    davCardDiscoveryUrl: config.davCardDiscoveryUrl,
    davTemplates: config.davTemplates,
    webmailUrl: config.webmailUrl,
    publicUrl: config.publicUrl,
    support: config.support,
    links: config.links,
  };
}

module.exports = { config, publicConfig, davUrl };
