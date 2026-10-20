# Security

## Design

- No password is asked, sent to or stored by this app. Users type it only in their own mail client.
- No cookies, no analytics, no tracking, no third-party requests.
- The QR code is generated locally in the browser (`public/js/qr.js`, MIT, after Nayuki's implementation).
- Only GET and HEAD are accepted.

## HTTP headers

Content-Security-Policy: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`. A remote logo origin is appended to `img-src` only when `BRAND_LOGO_URL` is an absolute URL.

Also sent: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, a restrictive `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`.

## The /support page

- Disabled (404) while `SUPPORT_PASSWORD` is empty.
- HTTP Basic auth with constant-time comparison.
- 10 failed attempts from one address lock it for 15 minutes (HTTP 429).
- Responses carry `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.
- The client address comes from `CF-Connecting-IP` if present, so only expose the app behind a proxy that controls this header.

## Apple profile

`/profile.mobileconfig` is not signed, so iOS and macOS display "Not signed" when installing it. It contains no password. Signing it is recommended in production, for example:

```bash
openssl smime -sign -signer cert.pem -inkey key.pem -certfile chain.pem \
  -nodetach -outform der -in profile.mobileconfig -out signed.mobileconfig
```

The server does not sign on the fly (TODO); sign at a dedicated step or in front of the app, using a certificate trusted by Apple devices.

## Deployment hardening

Run behind an HTTPS reverse proxy (see [deployment.md](deployment.md)). The container is non-root, read-only, with all capabilities dropped and `no-new-privileges`.

## Reporting

Report vulnerabilities privately to the repository maintainers rather than in a public issue.
