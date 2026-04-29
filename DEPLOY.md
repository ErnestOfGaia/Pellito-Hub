# Pellito Hub — VPS Deploy Guide

Live URL: https://pellito.mechanicalcupcakes.fun
VPS: Hostinger Ubuntu 24.04 | Nginx Proxy Manager

---

## Prerequisites

- Docker + Docker Compose installed on VPS
- `nginx-proxy` external network exists:
  ```bash
  docker network create nginx-proxy
  ```
  (Skip if already created by another project on this VPS.)

---

## First Deploy

### 1. Copy files to VPS

```bash
scp -r . user@your-vps-ip:/srv/pellito-hub/
```

Or clone the repo directly on the VPS.

### 2. Create `.env` on the VPS

```bash
ssh user@your-vps-ip
cd /srv/pellito-hub
nano .env
```

```
ANTHROPIC_API_KEY=sk-ant-...
SESSION_SECRET=a-long-random-string-here
MASTRA_URL=http://localhost:4111
```

Never commit `.env`.

### 3. Build and start

```bash
cd /srv/pellito-hub
docker compose up -d --build
```

On first run, `drizzle-kit push` creates `/srv/pellito-hub/data/dev.db` via the bind mount.

Verify:
```bash
docker compose ps
docker compose logs -f pellito-hub
```

### 4. Configure Nginx Proxy Manager

In NPM UI (http://your-vps-ip:81):

1. **Add Proxy Host**
2. Domain: `pellito.mechanicalcupcakes.fun`
3. Scheme: `http` | Forward Hostname: `pellito-hub` | Port: `3000`
4. SSL tab → Let's Encrypt certificate, Force SSL ✓

NPM resolves `pellito-hub` via the shared `nginx-proxy` Docker network.

---

## Updating

```bash
cd /srv/pellito-hub
git pull
docker compose up -d --build
```

---

## Useful Commands

```bash
docker compose logs -f pellito-hub
docker compose exec pellito-hub sh
curl https://pellito.mechanicalcupcakes.fun/api/health
```

## Data

SQLite DB lives at `./data/dev.db` on the VPS host. Back up before destructive operations:
```bash
cp data/dev.db data/dev.db.bak
```

If the container can't write to `./data/`, fix ownership:
```bash
chown -R 1001:1001 /srv/pellito-hub/data
```
