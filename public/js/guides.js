// Contenu des guides. Mini-syntaxe des textes :
//   [[Libellé]]  -> élément d'interface (bouton, menu…)
//   {email}      -> adresse saisie ;  {brand} -> BRAND_NAME ;  {L:clé} -> lien de config.links
//   '[mdaemon] …' -> (en tête d'un conseil) affiché seulement avec le préréglage DAV correspondant
//   f: [...]     -> valeurs à copier (voir FIELDS dans app.js)
//   dl: true     -> bouton de téléchargement du profil Apple
//   sub: '...'   -> précision en texte secondaire
//   shot: 'dossier/fichier.png' -> capture facultative dans public/img/guides/ (lien « Voir une capture »
//                  affiché seulement si le fichier existe) ; shotCaption: '...' -> légende facultative

export const DEVICES = [
  { id: 'windows', name: 'Windows', desc: 'PC avec Outlook ou Thunderbird', icon: 'windows' },
  { id: 'macos', name: 'macOS', desc: 'Mac avec Mail, Calendrier, Contacts', icon: 'mac' },
  { id: 'ios', name: 'iPhone / iPad', desc: 'iOS et iPadOS', icon: 'iphone' },
  { id: 'android', name: 'Android', desc: 'Samsung, Google Pixel, etc.', icon: 'android' },
];

export const APPS = {
  windows: ['outlook-new', 'outlook-classic', 'caldavsync', 'thunderbird'],
  macos: ['mac-profile', 'mac-manual', 'thunderbird'],
  ios: ['ios-profile', 'ios-manual'],
  android: ['gmail', 'samsung', 'davx5'],
};

const THUNDERBIRD = {
  id: 'thunderbird',
  name: 'Thunderbird',
  desc: 'Gratuit, gère mail, agenda et contacts sans module à ajouter.',
  icon: 'bird',
  covers: ['mail', 'calendar', 'contacts'],
  intro: 'Thunderbird (version 128 ou plus récente, Windows et macOS) gère nativement la messagerie, les agendas CalDAV et les carnets d’adresses CardDAV.',
  sections: [
    {
      service: 'mail',
      title: 'Ajouter le compte e-mail',
      steps: [
        { t: 'Installez Thunderbird depuis <a href="{L:thunderbird}" rel="noopener">thunderbird.net</a> si ce n’est pas déjà fait, puis ouvrez-le.' },
        { t: 'Au premier lancement, l’assistant de compte s’ouvre tout seul. Sinon, ouvrez le menu [[≡]] › [[Nouveau compte]] › [[E-mail]].' },
        { t: 'Saisissez votre nom, votre adresse et le mot de passe de votre boîte, puis cliquez sur [[Continuer]].', f: ['name', 'email', 'password'] },
        {
          t: 'Si Thunderbird ne trouve pas la configuration, ou s’il propose d’autres valeurs, cliquez sur [[Configurer manuellement]] et saisissez les paramètres ci-dessous. Méthode d’authentification : [[Mot de passe normal]] pour les deux serveurs.',
          f: ['imapHost', 'imapPort', 'imapSec', 'smtpHost', 'smtpPort', 'smtpSec', 'username'],
        },
        { t: 'Cliquez sur [[Retester]], puis sur [[Terminé]]. Votre boîte de réception apparaît à gauche ; les autres dossiers (messages envoyés, brouillons…) sont créés automatiquement par Thunderbird au besoin.' },
      ],
    },
    {
      service: 'calendar',
      title: 'Ajouter l’agenda',
      steps: [
        { t: 'Si Thunderbird vous propose de connecter les agendas et carnets d’adresses trouvés, sélectionnez-les et validez : c’est fini. Sinon, continuez ci-dessous.' },
        { t: 'Ouvrez l’onglet [[Agenda]] (icône calendrier à gauche), puis cliquez sur [[Nouvel agenda…]] en bas de la liste des agendas.' },
        { t: 'Choisissez [[Sur le réseau]] et cliquez sur [[Suivant]].' },
        { t: 'Renseignez le nom d’utilisateur (votre adresse e-mail complète) et l’emplacement, puis cliquez sur [[Rechercher des agendas]].', f: ['username', 'caldav'], sub: 'L’URL ci-dessus est celle de votre agenda personnel. Pour voir aussi les agendas partagés de votre entreprise, utilisez plutôt l’URL de découverte {F:davDiscovery}.' },
        { t: 'Saisissez votre mot de passe (cochez [[Utiliser le gestionnaire de mots de passe]]), sélectionnez l’agenda trouvé puis cliquez sur [[S’abonner]].' },
      ],
    },
    {
      service: 'contacts',
      title: 'Ajouter le carnet d’adresses',
      steps: [
        { t: 'Ouvrez l’onglet [[Carnet d’adresses]]. Cliquez sur la flèche à côté de [[Nouveau carnet d’adresses]], puis sur [[Ajouter un carnet d’adresses CardDAV]].' },
        { t: 'Renseignez le nom d’utilisateur (votre adresse e-mail complète) et l’emplacement, puis cliquez sur [[Continuer]].', f: ['username', 'carddav'] },
        { t: 'Saisissez votre mot de passe, cochez le carnet d’adresses proposé et cliquez sur [[Continuer]].' },
      ],
    },
  ],
};

export const GUIDES = {
  'outlook-new': {
    id: 'outlook-new',
    name: 'Nouvel Outlook',
    desc: 'Outlook pour Windows, nouvelle version (Windows 11 par défaut).',
    icon: 'outlook',
    covers: ['mail'],
    intro: 'Le nouvel Outlook pour Windows gère votre messagerie. Il ne sait pas synchroniser un calendrier ou des contacts CalDAV/CardDAV.',
    callouts: [
      { kind: 'info', t: 'Vous le reconnaissez à l’interrupteur [[Nouvel Outlook]] activé en haut à droite et à l’absence de menu [[Fichier]]. Pour le calendrier et les contacts, utilisez <a href="#/guide/windows/outlook-classic">Outlook classique</a> avec <a href="#/guide/windows/caldavsync">CalDAV Synchronizer</a>, ou <a href="#/guide/windows/thunderbird">Thunderbird</a>.' },
    ],
    sections: [
      {
        service: 'mail',
        title: 'Ajouter le compte e-mail',
        steps: [
          { t: 'Ouvrez Outlook et cliquez sur [[Paramètres]] (roue dentée en haut à droite) › [[Comptes]] › [[Comptes de messagerie]] › [[Ajouter un compte]].', sub: 'Au tout premier lancement, Outlook vous demande directement une adresse.', shot: 'outlook-new/01.png' },
          { t: 'Saisissez votre adresse e-mail puis cliquez sur [[Continuer]].', f: ['email'], shot: 'outlook-new/02.png' },
          { t: 'Si Outlook vous demande de choisir votre fournisseur, sélectionnez [[IMAP]].', shot: 'outlook-new/03.png' },
          {
            t: 'Saisissez le mot de passe de votre boîte, puis cliquez sur [[Afficher plus]] pour faire apparaître les serveurs. Remplissez les champs avec les valeurs ci-dessous. Type de connexion sécurisée : [[SSL/TLS]] pour les deux serveurs.',
            f: ['imapHost', 'imapPort', 'imapSec', 'username', 'smtpHost', 'smtpPort', 'smtpSec', 'password'],
            sub: 'Le nom d’utilisateur et le mot de passe SMTP sont les mêmes que pour l’IMAP : l’adresse e-mail complète et le mot de passe de votre boîte.',
            shot: 'outlook-new/04.png',
          },
          { t: 'Cliquez sur [[Continuer]]. Outlook vous informe que le compte sera synchronisé via le cloud Microsoft : confirmez avec [[Continuer]]. Vos messages arrivent en quelques minutes.', shot: 'outlook-new/05.png' },
        ],
      },
    ],
    tips: ['Le nouvel Outlook synchronise les comptes IMAP via les serveurs de Microsoft. Si vous préférez éviter cela, utilisez Outlook classique ou Thunderbird.'],
    next: { guide: 'caldavsync', t: 'Calendrier et contacts sous Windows', d: 'Avec Outlook classique et le module gratuit CalDAV Synchronizer.' },
  },

  'outlook-classic': {
    id: 'outlook-classic',
    name: 'Outlook classique',
    desc: 'Microsoft 365, Outlook 2024, 2021, 2019 : messagerie.',
    icon: 'outlook',
    covers: ['mail'],
    intro: 'Ce guide configure la messagerie dans Outlook classique. Le calendrier et les contacts s’ajoutent ensuite avec le module gratuit CalDAV Synchronizer.',
    sections: [
      {
        service: 'mail',
        title: 'Ajouter le compte e-mail',
        steps: [
          { t: 'Ouvrez Outlook. Si l’interrupteur [[Nouvel Outlook]] est activé en haut à droite, désactivez-le pour revenir à Outlook classique.', shot: 'outlook-classic/01.png' },
          { t: 'Cliquez sur [[Fichier]] › [[Ajouter un compte]].', shot: 'outlook-classic/02.png' },
          { t: 'Saisissez votre adresse, cliquez sur [[Options avancées]], cochez [[Me laisser configurer manuellement mon compte]], puis cliquez sur [[Connexion]].', f: ['email'], shot: 'outlook-classic/03.png' },
          { t: 'Choisissez le type de compte [[IMAP]].', shot: 'outlook-classic/04.png' },
          {
            t: 'Renseignez le courrier entrant et le courrier sortant. Méthode de chiffrement : [[SSL/TLS]] pour les deux. Laissez [[Exiger l’authentification par mot de passe sécurisé (SPA)]] décoché. Cliquez sur [[Suivant]].',
            f: ['imapHost', 'imapPort', 'imapSec', 'smtpHost', 'smtpPort', 'smtpSec'],
            sub: 'Si un champ [[Nom d’utilisateur]] apparaît, saisissez votre adresse e-mail complète.',
            shot: 'outlook-classic/05.png',
          },
          { t: 'Saisissez le mot de passe de votre boîte, cliquez sur [[Connexion]], puis sur [[Terminé]].', f: ['password'], sub: 'Si Outlook propose de configurer aussi Outlook Mobile, décochez la case.', shot: 'outlook-classic/06.png' },
        ],
      },
    ],
    tips: [
      'Si Outlook affiche « Une erreur s’est produite », passez par [[Panneau de configuration]] › [[Courrier (Microsoft Outlook)]] › [[Comptes de messagerie]] › [[Nouveau…]] › [[Configuration manuelle]] › [[POP ou IMAP]], puis utilisez les mêmes valeurs. Dans [[Paramètres supplémentaires]] › [[Serveur sortant]], cochez [[Mon serveur sortant (SMTP) requiert une authentification]].',
    ],
    next: { guide: 'caldavsync', t: 'Étape suivante : calendrier et contacts', d: 'Installez CalDAV Synchronizer pour synchroniser votre agenda, vos contacts et vos tâches.' },
  },

  caldavsync: {
    id: 'caldavsync',
    name: 'CalDAV Synchronizer',
    desc: 'Module gratuit pour le calendrier, les contacts et les tâches dans Outlook classique.',
    icon: 'sync',
    covers: ['calendar', 'contacts'],
    intro: 'CalDAV Synchronizer est un module gratuit et open source pour Outlook classique. Il synchronise l’agenda, les contacts et les tâches. Il faut créer une ligne de synchronisation (un « profil ») par type d’élément.',
    callouts: [
      { kind: 'warn', t: 'Il fonctionne uniquement avec <strong>Outlook classique</strong> (Microsoft 365, 2024, 2021…). Le nouvel Outlook n’accepte pas de modules.' },
    ],
    sections: [
      {
        service: 'all',
        title: 'Installer le module',
        steps: [
          { t: 'Téléchargez la dernière version sur <a href="{L:caldavSynchronizer}" rel="noopener">caldavsynchronizer.org</a> (fichier .zip).' },
          { t: 'Fermez Outlook. Faites un clic droit sur le fichier téléchargé › [[Extraire tout…]], puis lancez [[setup.exe]] et suivez l’assistant.', shot: 'caldavsync/install-02.png' },
          { t: 'Rouvrez Outlook : un nouvel onglet [[CalDav Synchronizer]] apparaît dans le ruban.', shot: 'caldavsync/install-03.png' },
        ],
      },
      {
        service: 'calendar',
        title: 'Synchroniser le calendrier',
        steps: [
          { t: 'Onglet [[CalDav Synchronizer]] › [[Synchronization Profiles]]. Cliquez sur [[+]] (Add new profile), choisissez [[Generic CalDAV/CardDAV]] puis [[OK]].', shot: 'caldavsync/calendar-01.png' },
          { t: 'Donnez un nom au profil, par exemple « {brand} Agenda ». À côté de [[Outlook folder]], cliquez sur [[…]] et choisissez votre dossier [[Calendrier]].', sub: 'Conseil : pour garder votre calendrier local intact, créez d’abord un nouveau dossier de calendrier vide dans Outlook.', shot: 'caldavsync/calendar-02.png' },
          { t: 'Remplissez les champs de connexion. L’URL ci-dessous est celle de votre agenda personnel ; l’identifiant est votre adresse e-mail complète.', f: ['caldav', 'username', 'password', 'email'], sub: 'Champs anglais du module : DAV URL, Username, Password, Email address. Autre possibilité : saisissez l’URL de découverte {F:davDiscovery} puis cliquez sur [[Test or discover settings]] : le module liste les agendas trouvés (dont ceux partagés par votre entreprise) et vous laisse choisir.', shot: 'caldavsync/calendar-03.png' },
          { t: 'Cliquez sur [[Test or discover settings]]. Le message « Connection test successful » confirme la connexion.', shot: 'caldavsync/calendar-04.png' },
          { t: 'Dans [[Sync settings]], choisissez [[Outlook <-> Server (Two-Way)]] et un intervalle de 5 minutes.', shot: 'caldavsync/calendar-05.png' },
        ],
      },
      {
        service: 'contacts',
        title: 'Synchroniser les contacts',
        steps: [
          { t: 'Toujours dans [[Synchronization Profiles]], cliquez à nouveau sur [[+]] › [[Generic CalDAV/CardDAV]] › [[OK]].', shot: 'caldavsync/contacts-01.png' },
          { t: 'Nommez-le « {brand} Contacts » et choisissez le dossier [[Contacts]] comme [[Outlook folder]].', shot: 'caldavsync/contacts-02.png' },
          { t: 'Saisissez l’URL de votre carnet d’adresses et vos identifiants (adresse e-mail complète), puis cliquez sur [[Test or discover settings]].', f: ['carddav', 'username', 'password'], sub: 'Le bouton de découverte accepte aussi l’URL {F:davCardDiscovery} et liste alors les carnets disponibles.', shot: 'caldavsync/contacts-03.png' },
        ],
      },
      {
        service: 'calendar',
        title: 'Tâches (facultatif)',
        steps: [
          { t: 'Ajoutez un troisième profil [[Generic CalDAV/CardDAV]] nommé « {brand} Tâches », avec le dossier [[Tâches]] et l’URL ci-dessous. Testez-le comme les autres.', f: ['tasks', 'username', 'password'], shot: 'caldavsync/tasks-01.png' },
          { t: 'Cliquez sur [[OK]] pour enregistrer. La première synchronisation démarre. Le bouton [[Synchronize now]] la relance à tout moment.' },
        ],
      },
    ],
    tips: [
      '[mdaemon] <strong>Agenda ou contacts partagés de votre entreprise.</strong> Les ressources communes (« [Public] - votre-domaine/Calendrier », « [Public] - votre-domaine/Tâches », « [Public] Contacts ») apparaissent automatiquement sur iPhone, iPad et Mac ainsi que dans DAVx⁵ : il suffit de les cocher. Dans Outlook ou Thunderbird, utilisez l’URL de découverte {F:davDiscovery} pour les retrouver.',
    ],
  },

  thunderbird: THUNDERBIRD,

  'mac-profile': {
    id: 'mac-profile',
    name: 'Profil en un clic',
    desc: 'Mail, Calendrier et Contacts configurés automatiquement.',
    icon: 'profile',
    covers: ['mail', 'calendar', 'contacts'],
    recommended: true,
    profile: true,
    intro: 'Un profil de configuration Apple, préparé pour votre adresse, ajoute votre compte dans Mail, Calendrier et Contacts. Il ne contient aucun mot de passe : macOS vous le demande pendant l’installation.',
    sections: [
      {
        service: 'all',
        title: 'Installer le profil',
        steps: [
          { t: 'Téléchargez votre profil personnalisé. Le fichier est enregistré dans [[Téléchargements]].', dl: true },
          { t: 'Double-cliquez sur le fichier .mobileconfig. macOS affiche « Profil téléchargé » et vous invite à le vérifier dans Réglages Système.' },
          { t: 'Ouvrez [[Réglages Système]] › [[Général]] › [[Gestion des appareils]].', sub: 'Sur macOS Ventura : [[Confidentialité et sécurité]] › [[Profils]]. Vous pouvez aussi taper « profil » dans le champ de recherche des Réglages.' },
          { t: 'Double-cliquez sur le profil « {brand} – {email} », puis cliquez sur [[Installer…]]. macOS indique que le profil n’est pas signé : c’est normal, confirmez avec [[Installer]].' },
          { t: 'Saisissez le mot de passe de votre boîte mail quand il est demandé, pour la messagerie puis éventuellement pour le calendrier et les contacts. Saisissez ensuite le mot de passe de votre Mac pour autoriser l’installation.', f: ['password'] },
          { t: 'Ouvrez Mail, Calendrier et Contacts : votre compte est prêt.' },
        ],
      },
    ],
    tips: ['Pour supprimer le compte : [[Réglages Système]] › [[Général]] › [[Gestion des appareils]], sélectionnez le profil {brand} et cliquez sur [[−]].'],
  },

  'mac-manual': {
    id: 'mac-manual',
    name: 'Apple Mail, Calendrier et Contacts',
    desc: 'Configuration manuelle dans les apps Apple.',
    icon: 'mac',
    covers: ['mail', 'calendar', 'contacts'],
    intro: 'Méthode manuelle, utile si vous ne pouvez pas installer de profil. Les libellés correspondent à macOS Sonoma, Sequoia et Tahoe.',
    sections: [
      {
        service: 'mail',
        title: 'Messagerie (Mail)',
        steps: [
          { t: 'Ouvrez [[Mail]], puis le menu [[Mail]] › [[Ajouter un compte…]]. Choisissez [[Autre compte Mail…]] et cliquez sur [[Continuer]].' },
          { t: 'Saisissez votre nom, votre adresse et votre mot de passe, puis cliquez sur [[Se connecter]].', f: ['name', 'email', 'password'] },
          { t: 'Mail affiche « Impossible de vérifier le nom ou le mot de passe du compte » : c’est normal. Complétez les champs, avec le type de compte [[IMAP]], puis cliquez sur [[Se connecter]].', f: ['username', 'imapHost', 'smtpHost'] },
          { t: 'Cochez [[Mail]] et cliquez sur [[Terminé]].' },
          {
            t: 'Vérifiez les ports : [[Mail]] › [[Réglages…]] › [[Comptes]] › votre compte › [[Réglages du serveur]]. Pour chaque serveur, décochez [[Gérer automatiquement les réglages de connexion]], saisissez le port, cochez [[Utiliser TLS/SSL]] et choisissez l’authentification [[Mot de passe]]. Cliquez sur [[Enregistrer]].',
            f: ['imapPort', 'smtpPort'],
          },
        ],
      },
      {
        service: 'calendar',
        title: 'Calendrier',
        steps: [
          { t: 'Ouvrez [[Calendrier]], puis le menu [[Calendrier]] › [[Ajouter un compte…]]. Choisissez [[Autre compte CalDAV…]] et cliquez sur [[Continuer]].' },
          { t: 'Type de compte : [[Manuel]]. Saisissez le nom d’utilisateur, le mot de passe et l’adresse du serveur, puis cliquez sur [[Se connecter]].', f: ['username', 'password', 'principal'], sub: 'Si l’URL complète est refusée, saisissez simplement {F:davHost}.' },
        ],
      },
      {
        service: 'contacts',
        title: 'Contacts',
        steps: [
          { t: 'Ouvrez [[Contacts]], puis le menu [[Contacts]] › [[Ajouter un compte…]]. Choisissez [[Autre compte de contacts…]] et cliquez sur [[Continuer]].' },
          { t: 'Choisissez [[CardDAV]] et le type de compte [[Manuel]]. Saisissez le nom d’utilisateur, le mot de passe et l’adresse du serveur, puis cliquez sur [[Se connecter]].', f: ['username', 'password', 'principal'], sub: 'Si l’URL complète est refusée, saisissez simplement {F:davHost}.' },
        ],
      },
    ],
  },

  'ios-profile': {
    id: 'ios-profile',
    name: 'Profil en un clic',
    desc: 'Mail, Calendrier et Contacts installés en moins d’une minute.',
    icon: 'profile',
    covers: ['mail', 'calendar', 'contacts'],
    recommended: true,
    profile: true,
    intro: 'Un profil de configuration Apple, préparé pour votre adresse, ajoute votre compte dans Mail, Calendrier et Contacts. Il ne contient aucun mot de passe : l’iPhone vous le demande pendant l’installation.',
    callouts: [
      { kind: 'info', t: 'Ouvrez cette page <strong>dans Safari</strong>, directement sur l’iPhone ou l’iPad à configurer.' },
    ],
    sections: [
      {
        service: 'all',
        title: 'Télécharger et installer le profil',
        steps: [
          { t: 'Touchez le bouton ci-dessous. Safari demande « Ce site web tente de télécharger un profil de configuration » : touchez [[Autoriser]], puis [[Fermer]].', dl: true },
          { t: 'Ouvrez l’app [[Réglages]] et touchez [[Profil téléchargé]], juste sous votre nom en haut.', sub: 'Si la ligne n’apparaît pas : [[Réglages]] › [[Général]] › [[VPN et gestion de l’appareil]].' },
          { t: 'Touchez [[Installer]] en haut à droite et saisissez le code de l’appareil. L’avertissement « Non signé » est normal : touchez [[Installer]], puis encore [[Installer]].' },
          { t: 'Saisissez le mot de passe de votre boîte mail quand l’iPhone le demande, puis touchez [[Suivant]]. Selon les services choisis, il peut le demander pour la messagerie, le calendrier et les contacts.', f: ['password'] },
          { t: 'Touchez [[Terminé]]. Ouvrez Mail : votre boîte {email} est prête, tout comme le calendrier et les contacts.' },
        ],
      },
    ],
    tips: [
      'Le profil doit être installé dans les 8 minutes qui suivent le téléchargement, sinon iOS le supprime : il suffit alors de le télécharger à nouveau.',
      'Pour supprimer le compte : [[Réglages]] › [[Général]] › [[VPN et gestion de l’appareil]] › profil {brand} › [[Supprimer le profil]].',
    ],
  },

  'ios-manual': {
    id: 'ios-manual',
    name: 'Configuration manuelle',
    desc: 'Dans Réglages, compte par compte.',
    icon: 'gear',
    covers: ['mail', 'calendar', 'contacts'],
    intro: 'Méthode manuelle, pour iOS et iPadOS 18 ou plus récent. Sur iOS 17 et antérieur, les réglages se trouvent directement dans [[Réglages]] › [[Mail]] (sans passer par [[Apps]]).',
    sections: [
      {
        service: 'mail',
        title: 'Messagerie',
        steps: [
          { t: 'Ouvrez [[Réglages]] › [[Apps]] › [[Mail]] › [[Comptes de messagerie]] › [[Ajouter un compte]] › [[Autre]] › [[Ajouter un compte Mail]].' },
          { t: 'Saisissez votre nom, votre adresse et votre mot de passe, puis touchez [[Suivant]].', f: ['name', 'email', 'password'] },
          {
            t: 'Choisissez [[IMAP]] en haut. Remplissez le serveur de réception et le serveur d’envoi avec le même nom d’utilisateur (votre adresse e-mail complète) et le même mot de passe, même si iOS indique « facultatif ». Touchez [[Suivant]], puis [[Enregistrer]].',
            f: ['imapHost', 'smtpHost', 'username', 'password'],
          },
          {
            t: 'Vérifiez les ports : touchez le compte › [[Compte]] › [[Avancé]] : [[Utiliser SSL]] activé, port 993. Revenez, touchez [[SMTP]] › le serveur principal : [[Utiliser SSL]] activé, port 465, authentification [[Mot de passe]].',
            f: ['imapPort', 'smtpPort'],
          },
        ],
      },
      {
        service: 'calendar',
        title: 'Calendrier',
        steps: [
          { t: 'Ouvrez [[Réglages]] › [[Apps]] › [[Calendrier]] › [[Comptes de calendrier]] › [[Ajouter un compte]] › [[Autre]] › [[Ajouter un compte CalDAV]].' },
          { t: 'Saisissez le serveur, le nom d’utilisateur et le mot de passe, puis touchez [[Suivant]] et [[Enregistrer]].', f: ['davHost', 'username', 'password'], sub: 'En cas d’échec, saisissez l’URL complète dans [[Serveur]] :' },
          { t: 'URL complète à utiliser si nécessaire (port 443, SSL activé) :', f: ['principal'] },
        ],
      },
      {
        service: 'contacts',
        title: 'Contacts',
        steps: [
          { t: 'Ouvrez [[Réglages]] › [[Apps]] › [[Contacts]] › [[Comptes de contacts]] › [[Ajouter un compte]] › [[Autre]] › [[Ajouter un compte CardDAV]].' },
          { t: 'Saisissez le serveur, le nom d’utilisateur et le mot de passe, puis touchez [[Suivant]].', f: ['davHost', 'username', 'password'] },
          { t: 'En cas d’échec, saisissez l’URL complète dans [[Serveur]] :', f: ['principal'] },
        ],
      },
    ],
  },

  gmail: {
    id: 'gmail',
    name: 'Gmail',
    desc: 'L’app de messagerie installée sur la plupart des Android.',
    icon: 'mail',
    covers: ['mail'],
    intro: 'L’app Gmail sait relever n’importe quelle boîte IMAP. Pour le calendrier et les contacts, ajoutez ensuite DAVx⁵.',
    sections: [
      {
        service: 'mail',
        title: 'Ajouter le compte e-mail',
        steps: [
          { t: 'Ouvrez [[Gmail]], touchez votre photo de profil en haut à droite › [[Ajouter un autre compte]] › [[Autre]].' },
          { t: 'Saisissez votre adresse e-mail, puis touchez [[Configuration manuelle]].', f: ['email'] },
          { t: 'Choisissez [[Personnel (IMAP)]] et touchez [[Suivant]]. Saisissez votre mot de passe et touchez [[Suivant]].', f: ['password'] },
          { t: 'Paramètres du serveur entrant : complétez les champs et choisissez le type de sécurité [[SSL/TLS]]. Touchez [[Suivant]].', f: ['username', 'imapHost', 'imapPort', 'imapSec'] },
          { t: 'Paramètres du serveur sortant : laissez [[Exiger une connexion]] activé, complétez les champs et choisissez [[SSL/TLS]]. Touchez [[Suivant]].', f: ['username', 'smtpHost', 'smtpPort', 'smtpSec'] },
          { t: 'Choisissez la fréquence de synchronisation, touchez [[Suivant]], indiquez votre nom affiché, puis touchez encore [[Suivant]].', f: ['name'] },
        ],
      },
    ],
    next: { guide: 'davx5', t: 'Calendrier et contacts sur Android', d: 'Installez DAVx⁵ pour synchroniser votre agenda et vos contacts.' },
  },

  samsung: {
    id: 'samsung',
    name: 'Samsung Email',
    desc: 'L’app de messagerie des smartphones Samsung Galaxy.',
    icon: 'mail',
    covers: ['mail'],
    intro: 'Pour les smartphones Samsung Galaxy (One UI). Pour le calendrier et les contacts, ajoutez ensuite DAVx⁵.',
    sections: [
      {
        service: 'mail',
        title: 'Ajouter le compte e-mail',
        steps: [
          { t: 'Ouvrez [[Samsung Email]]. Au premier lancement, choisissez [[Autres]]. Sinon, ouvrez le menu [[≡]] › roue dentée [[Paramètres]] › [[Ajouter un compte]] › [[Autres]].' },
          { t: 'Saisissez votre adresse et votre mot de passe, puis touchez [[Config. manuelle]].', f: ['email', 'password'] },
          { t: 'Choisissez [[Compte IMAP]].' },
          { t: 'Serveur entrant : type de sécurité [[SSL]], puis complétez les champs.', f: ['username', 'imapHost', 'imapPort'] },
          { t: 'Serveur sortant : type de sécurité [[SSL]], et laissez [[Authentification requise pour envoyer des e-mails]] coché. Touchez [[Se connecter]].', f: ['smtpHost', 'smtpPort'] },
        ],
      },
    ],
    next: { guide: 'davx5', t: 'Calendrier et contacts sur Android', d: 'Installez DAVx⁵ pour synchroniser votre agenda et vos contacts.' },
  },

  davx5: {
    id: 'davx5',
    name: 'DAVx⁵',
    desc: 'Synchronise l’agenda et les contacts avec les apps d’Android.',
    icon: 'sync',
    covers: ['calendar', 'contacts'],
    intro: 'DAVx⁵ synchronise votre agenda et vos contacts {brand} avec les apps Agenda et Contacts d’Android (Google Agenda, Samsung Calendrier…).',
    sections: [
      {
        service: 'all',
        title: 'Installer DAVx⁵',
        steps: [
          { t: 'Installez DAVx⁵ depuis <a href="{L:davx5Fdroid}" rel="noopener">F-Droid</a> (gratuit) ou le <a href="{L:davx5Play}" rel="noopener">Google Play Store</a> (payant, soutient les développeurs). L’APK est aussi disponible sur <a href="{L:davx5Github}" rel="noopener">GitHub</a>.' },
        ],
      },
      {
        service: 'all',
        title: 'Connecter votre compte',
        steps: [
          { t: 'Ouvrez DAVx⁵ et touchez le bouton [[+]] en bas à droite.' },
          { t: 'Choisissez [[Connexion avec une URL et un nom d’utilisateur]], puis remplissez les champs et touchez [[Se connecter]].', f: ['davDiscovery', 'username', 'password'] },
          { t: 'Pour le nom du compte, gardez votre adresse e-mail (nécessaire pour les invitations), puis touchez [[Créer un compte]].', f: ['email'] },
          { t: 'Touchez le compte créé. Dans l’onglet [[CardDAV]], cochez le carnet d’adresses ; dans l’onglet [[CalDAV]], cochez vos agendas. La synchronisation démarre.' },
          { t: 'Accordez à DAVx⁵ l’accès aux contacts et à l’agenda. Si l’app le propose, désactivez l’optimisation de la batterie pour DAVx⁵ : sinon, la synchronisation risque de s’arrêter.' },
          { t: 'Vos rendez-vous apparaissent dans votre app Agenda et vos contacts dans l’app Contacts.' },
        ],
      },
    ],
    tips: [
      'Si DAVx⁵ ne trouve aucun service, recommencez avec l’URL personnelle de votre compte : {F:principal}',
      '[mdaemon] <strong>Agenda ou contacts partagés de votre entreprise.</strong> Les ressources communes (« [Public] - votre-domaine/Calendrier », « [Public] - votre-domaine/Tâches », « [Public] Contacts ») apparaissent automatiquement sur iPhone, iPad et Mac ainsi que dans DAVx⁵ : il suffit de les cocher. Dans Outlook ou Thunderbird, utilisez l’URL de découverte {F:davDiscovery} pour les retrouver.',
      'Pour les tâches, installez aussi une app compatible comme jtx Board ou Tasks.org : DAVx⁵ les synchronise automatiquement.',
    ],
  },
};
