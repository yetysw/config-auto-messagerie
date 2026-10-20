# Mail Setup – notes de développement

## But
Assistant en marque blanche qui guide les utilisateurs d'un hébergeur de messagerie pour configurer
leur e-mail (IMAP/SMTP), leur agenda (CalDAV) et leurs contacts (CardDAV) sur Windows, macOS,
iPhone/iPad et Android. Aucun mot de passe demandé ni stocké. Page interne `/support` (HTTP Basic)
pour générer des liens pré-remplis + QR codes. Documentation utilisateur : `README.md` et `docs/`.

## Stack
- Node 22, module `http` natif, **aucune dépendance** (`server/`) ; front HTML/CSS/JS vanilla (`public/`).
- CSP stricte (`script-src 'self'`, `style-src 'self'`, pas de style inline, pas de CDN) : toute lib doit être locale.
  Le QR code est généré par `public/js/qr.js` (fait maison, d'après Nayuki, MIT).
- Thème sobre : clair par défaut, sombre automatique (`prefers-color-scheme`), police système,
  coins légèrement arrondis, une seule couleur d'accent (`--accent`) fournie par `/brand.css`,
  feuille générée par le serveur à partir de `BRAND_ACCENT` ; les autres tons dérivent de
  `color-mix()` dans `public/css/app.css`. Textes de l'interface en français, vouvoiement.
- Aucune donnée propre à une instance dans le code : tout passe par les variables d'environnement
  (`server/config.js`, défauts neutres `example.com`) et le front les lit via `/api/config`.

## Déployer
```bash
cp .env.example .env            # puis renseigner les valeurs de l'instance
docker compose up -d --build    # port hôte HOST_PORT (8080 par défaut) -> 8080
```
`.env` n'est jamais versionné (il contient `SUPPORT_PASSWORD` et les valeurs réelles de l'instance).
Cache-busting : au démarrage, `server/index.js` injecte `?v=<hash>` (contenu CSS/JS, `brand.css` compris)
dans les URL d'assets des HTML et des imports JS ; `?v=` valide = `immutable` 1 an, HTML = `no-cache`.

## Où modifier
- Paramètres serveur (marque, hôtes, ports, préréglage DAV, gabarits d'URL, support) : `server/config.js`
  (lecture des variables), `docker-compose.yml` (transmission), `.env.example` (modèle).
- Textes des guides : `public/js/guides.js` (mini-syntaxe en tête de fichier : `{brand}`, `{email}`,
  `{L:…}`, `{F:…}`, préfixe `[mdaemon] ` pour un conseil propre au préréglage) ; valeurs copiables :
  `fieldDefs()` dans `public/js/app.js`.
- Profil Apple : `server/mobileconfig.js` ; autoconfig Thunderbird : `server/autoconfig.js`.
- Parcours (`public/js/app.js`, routes en hash) : accueil = étape 1 (adresse, nom replié en option),
  `#/appareil` (2), `#/appareil/<appareil>` (3, appli recommandée en avant : `recommended` dans guides.js,
  Gmail/Samsung détecté sur Android ; `FOLLOW_UPS` = caldavsync/davx5 affichés à part),
  `#/guide/<appareil>/<guide>/<n>` (4, une étape par écran, flèches ←/→) et `…/fin` (écran final).
- Paramètres manuels et aide (FAQ + contact) : panneaux `<dialog>` dans `index.html`, ouverts par
  `[data-panel]` (Échap, focus piégé, bouton retour du téléphone ferme le panneau). Les coordonnées
  du support vides sont masquées (`applyConfigToStatic()`). `public/css/app.css` est aussi chargé
  par `/support` : garder ses classes (header, brand, field, kv, copy, btn, card, view-head…).
- Page support : `public/support/` (servie uniquement après authentification).
- Captures des guides : `public/img/guides/` (voir son README).

## Préréglage MDaemon (`DAV_PRESET=mdaemon`, défaut)
- Identifiant = adresse e-mail complète partout (IMAP, SMTP, DAV).
- Principal : `https://<hôte>/webdav/principals/<email>/` ; `.well-known/caldav|carddav` répondent ;
  `/webdav/` n'est pas un point de découverte.
- Collections : `/webdav/caldav/<domaine>/<local>/b64=Q2FsZW5kYXI/` (agenda), `…/b64=VGFza3M/` (tâches),
  `/webdav/carddav/<domaine>/<local>/b64=Q29udGFjdHM/` (contacts). Ressources partagées « [Public] … ».
- Compte neuf : seulement INBOX et Spam (ne jamais promettre de noms de dossiers).
- `DAV_PRESET=generic` : toutes les URL DAV retombent sur la découverte `.well-known`.

## À faire en prod
- Signer le profil Apple (.mobileconfig) avec le certificat du domaine public pour supprimer
  l'avertissement « Non signé » sur iOS/macOS.
- Ajouter les captures d'écran réelles dans `public/img/guides/`.
