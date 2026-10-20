# Deployment

## Docker Compose

```bash
cp .env.example .env
# edit .env
docker compose up -d --build
```

- Changing environment variables only needs `docker compose up -d`.
- Changing code, guides or images needs `docker compose up -d --build`.
- The image is based on Node 22 (alpine), runs as a non-root user, with a read-only filesystem, `no-new-privileges` and all capabilities dropped. A healthcheck calls `/healthz` every 30 seconds.

## Without Docker

```bash
PORT=8080 MAIL_HOST=mail.example.com PUBLIC_URL=https://config.example.com node server/index.js
```

Node 22 is required; there is nothing to install.

## Reverse proxy and HTTPS

Run the app behind an HTTPS reverse proxy and proxy to `127.0.0.1:8080`.

Caddy:

```
config.example.com {
    reverse_proxy 127.0.0.1:8080
}
```

nginx:

```nginx
server {
    listen 443 ssl;
    server_name config.example.com;
    # ssl_certificate / ssl_certificate_key ...
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The `/support` rate limiter keys on the `CF-Connecting-IP` header when present, otherwise on the socket address. Only expose the app through a proxy that sets or strips this header, otherwise clients can spoof it. Behind a plain proxy, all clients may share one address, so the lock applies to everyone.

## Caching

At startup a hash of all CSS and JS files (and `/brand.css`) is computed and injected as `?v=<hash>` into asset URLs in the HTML and into JS imports. Versioned assets are served as immutable for one year; HTML is `no-cache`. A restart with changed assets therefore invalidates browser caches automatically.

## Autoconfig for Thunderbird

To enable automatic discovery, point `autoconfig.example.com` at this app (or proxy `/mail/config-v1.1.xml` to it). The endpoint also answers at `/.well-known/autoconfig/mail/config-v1.1.xml`.
