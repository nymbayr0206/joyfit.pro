# Joyfit VPS deploy (Docker)

## 1. One-time setup

```bash
cd /docker/flarum-3tbr/joyfit-app
```

If `.env` is missing:

```bash
cp .env.example .env
```

Edit `.env` and set a valid **DATABASE_URL** (PostgreSQL reachable from the container, e.g. host `host.docker.internal` or your DB host IP if DB runs on the host).

## 2. Build and run

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 3. Logs

```bash
docker logs -f joyfit-web --tail=100
```

## 4. Nginx (joyfit.pro)

Use the snippet in `nginx-joyfit.pro.snippet.conf`. If SSL already exists for joyfit.pro, place the `location / { ... }` block inside that server block. Ensure `proxy_pass http://127.0.0.1:3000` and the WebSocket headers are present.

## 5. Verify

- Local: `curl -I http://127.0.0.1:3000/checkup`
- Browser: open **https://joyfit.pro/checkup** and confirm the 12-step onboarding UI.

## Requirements

- Docker with Node 20 image (node:20-alpine).
- `.env` in `joyfit-app` with `DATABASE_URL`; loaded via `env_file` in docker-compose.
- Migrations run on startup via `docker/entrypoint.sh`; container exits if `DATABASE_URL` is missing or migrate fails.
