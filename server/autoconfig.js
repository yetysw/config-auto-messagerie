'use strict';

const { xml } = require('./mobileconfig');

function socket(sec) {
  return /starttls/i.test(sec) ? 'STARTTLS' : /ssl|tls/i.test(sec) ? 'SSL' : 'plain';
}

// Fichier d'autoconfiguration Thunderbird (format Mozilla ISPDB config-v1.1).
function buildAutoconfig({ domain, config }) {
  const d = xml(domain);
  return `<?xml version="1.0" encoding="UTF-8"?>
<clientConfig version="1.1">
  <emailProvider id="${xml(config.imap.host)}">
    <domain>${d}</domain>
    <displayName>${xml(config.brand)} – ${d}</displayName>
    <displayShortName>${xml(config.brand)}</displayShortName>
    <incomingServer type="imap">
      <hostname>${xml(config.imap.host)}</hostname>
      <port>${config.imap.port}</port>
      <socketType>${socket(config.imap.security)}</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </incomingServer>
    <outgoingServer type="smtp">
      <hostname>${xml(config.smtp.host)}</hostname>
      <port>${config.smtp.port}</port>
      <socketType>${socket(config.smtp.security)}</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </outgoingServer>
    <documentation url="${xml(config.webmailUrl)}">
      <descr lang="fr">Webmail ${xml(config.brand)}</descr>
    </documentation>
  </emailProvider>
  <addressBook type="carddav">
    <username>%EMAILADDRESS%</username>
    <authentication>http-basic</authentication>
    <serverURL>${xml(config.carddavUrl)}</serverURL>
  </addressBook>
  <calendar type="caldav">
    <username>%EMAILADDRESS%</username>
    <authentication>http-basic</authentication>
    <serverURL>${xml(config.caldavUrl)}</serverURL>
  </calendar>
  <webMail>
    <loginPage url="${xml(config.webmailUrl)}"/>
  </webMail>
</clientConfig>
`;
}

module.exports = { buildAutoconfig };
