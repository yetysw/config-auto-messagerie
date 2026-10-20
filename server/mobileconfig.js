'use strict';

const crypto = require('crypto');

function xml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Sérialise une valeur JS en plist XML.
function plist(value, indent) {
  const pad = '  '.repeat(indent);
  if (typeof value === 'boolean') return pad + (value ? '<true/>' : '<false/>');
  if (typeof value === 'number') return pad + '<integer>' + Math.trunc(value) + '</integer>';
  if (Array.isArray(value)) {
    return pad + '<array>\n' + value.map((v) => plist(v, indent + 1)).join('\n') + '\n' + pad + '</array>';
  }
  if (value && typeof value === 'object') {
    const body = Object.keys(value)
      .map((k) => pad + '  <key>' + xml(k) + '</key>\n' + plist(value[k], indent + 1))
      .join('\n');
    return pad + '<dict>\n' + body + '\n' + pad + '</dict>';
  }
  return pad + '<string>' + xml(value) + '</string>';
}

function uuid() {
  return crypto.randomUUID().toUpperCase();
}

// Hôte, port et SSL d'une URL DAV.
function davParts(url) {
  const u = new URL(url);
  const ssl = u.protocol === 'https:';
  return { host: u.hostname, port: u.port ? parseInt(u.port, 10) : ssl ? 443 : 80, ssl, url: u.toString() };
}

const SERVICES = ['mail', 'calendar', 'contacts'];

function parseServices(raw) {
  if (!raw) return SERVICES.slice();
  const list = String(raw).split(',').map((s) => s.trim()).filter((s) => SERVICES.includes(s));
  return list.length ? Array.from(new Set(list)) : SERVICES.slice();
}

const { davUrl } = require('./config');

function buildProfile({ email, name, services, config }) {
  const domain = email.split('@')[1];
  const slug = email.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const baseId = config.profile.idPrefix + '.' + slug;
  const brand = config.brand;
  const content = [];

  if (services.includes('mail')) {
    const p = {
      PayloadType: 'com.apple.mail.managed',
      PayloadVersion: 1,
      PayloadIdentifier: baseId + '.mail',
      PayloadUUID: uuid(),
      PayloadDisplayName: 'Messagerie ' + email,
      PayloadDescription: 'Compte de messagerie IMAP ' + email,
      EmailAccountDescription: email,
      EmailAccountType: 'EmailTypeIMAP',
      EmailAddress: email,
      IncomingMailServerAuthentication: 'EmailAuthPassword',
      IncomingMailServerHostName: config.imap.host,
      IncomingMailServerPortNumber: config.imap.port,
      IncomingMailServerUseSSL: true,
      IncomingMailServerUsername: email,
      OutgoingMailServerAuthentication: 'EmailAuthPassword',
      OutgoingMailServerHostName: config.smtp.host,
      OutgoingMailServerPortNumber: config.smtp.port,
      OutgoingMailServerUseSSL: true,
      OutgoingMailServerUsername: email,
      OutgoingPasswordSameAsIncomingPassword: true,
      PreventMove: false,
      PreventAppSheet: false,
      SMIMEEnabled: false,
      allowMailDrop: true,
    };
    if (name) p.EmailAccountName = name;
    content.push(p);
  }

  if (services.includes('calendar')) {
    // URL du principal MDaemon : la découverte trouve ensuite les agendas personnels et partagés.
    const d = davParts(davUrl(config.davTemplates.principal, email));
    content.push({
      PayloadType: 'com.apple.caldav.account',
      PayloadVersion: 1,
      PayloadIdentifier: baseId + '.caldav',
      PayloadUUID: uuid(),
      PayloadDisplayName: 'Calendrier ' + email,
      PayloadDescription: 'Calendrier CalDAV ' + email,
      CalDAVAccountDescription: 'Calendrier ' + brand + ' (' + email + ')',
      CalDAVHostName: d.host,
      CalDAVPort: d.port,
      CalDAVPrincipalURL: d.url,
      CalDAVUseSSL: d.ssl,
      CalDAVUsername: email,
    });
  }

  if (services.includes('contacts')) {
    const d = davParts(davUrl(config.davTemplates.principal, email));
    content.push({
      PayloadType: 'com.apple.carddav.account',
      PayloadVersion: 1,
      PayloadIdentifier: baseId + '.carddav',
      PayloadUUID: uuid(),
      PayloadDisplayName: 'Contacts ' + email,
      PayloadDescription: 'Carnet d’adresses CardDAV ' + email,
      CardDAVAccountDescription: 'Contacts ' + brand + ' (' + email + ')',
      CardDAVHostName: d.host,
      CardDAVPort: d.port,
      CardDAVPrincipalURL: d.url,
      CardDAVUseSSL: d.ssl,
      CardDAVUsername: email,
    });
  }

  const root = {
    PayloadContent: content,
    PayloadDisplayName: brand + ' – ' + email,
    PayloadDescription:
      'Configure la messagerie, le calendrier et les contacts de ' + email +
      ' (domaine ' + domain + '). Votre mot de passe vous sera demandé pendant l’installation.',
    PayloadIdentifier: baseId,
    PayloadOrganization: config.profile.org,
    PayloadRemovalDisallowed: false,
    PayloadType: 'Configuration',
    PayloadUUID: uuid(),
    PayloadVersion: 1,
  };

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
    '<plist version="1.0">\n' + plist(root, 0) + '\n</plist>\n'
  );
}

module.exports = { buildProfile, parseServices, xml };
