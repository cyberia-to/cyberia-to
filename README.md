# cyberia.to — the landing

One page: **cyberstate guided by superintelligence** + the project
constellation. Static HTML, no build.

## Deploy

```bash
nu scripts/deploy.nu
```

Rsyncs the root → `cyberproxy:/var/www/html/cyberia.to/`.

## Server

- nginx: `/etc/nginx/sites-enabled/cyberia.to` (root repointed from the
  old cyberstates share to `/var/www/html/cyberia.to` when this landing
  went live; cyberstates.net kept its own block)
- TLS: certbot cert `cyberia.to` already on cyberproxy

## DNS (Namecheap — registrar-servers NS)

| type | host | value |
|------|------|-------|
| A | @ | 167.235.28.94 |
| CNAME | www | cyberia.to |
