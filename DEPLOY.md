# Pellito Hub — VPS Deploy Guide

Dev URL: https://pelican.mechanicalcupcakes.fun (active development)
Stable URL: https://pellito.ernestofgaia.xyz (cloned once stable)
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

### 1. Clone the repo on the VPS

```bash
cd /docker
git clone https://github.com/ErnestOfGaia/Pellito-Hub.git pellito-hub
cd pellito-hub
```

### 2. Create `.env`

Generate a SESSION_SECRET first:

```bash
openssl rand -hex 32
```

Then create the file (paste the output in place of `REPLACE_ME`):

```bash
nano .env
```

```
ANTHROPIC_API_KEY=sk-ant-...
SESSION_SECRET=REPLACE_ME
```

Never commit `.env`.

### 3. Confirm the nginx-proxy network exists

```bash
docker network ls | grep nginx-proxy
```

If not listed: `docker network create nginx-proxy`

### 4. Build and start

```bash
docker compose up -d --build
```

Verify:
```bash
docker logs pellito-hub --tail 30
```

Expected:
```
▶ Pushing Drizzle schema to DB...
[✓] No changes detected
▶ Starting Pellito Hub...
✓ Ready in Xms
```

### 5. Configure Nginx Proxy Manager

In NPM UI (http://your-vps-ip:81):

1. **Add Proxy Host**
2. Domain: `pelican.mechanicalcupcakes.fun`
3. Scheme: `http` | Forward Hostname: `pellito-hub` | Port: `3000`
4. SSL tab → Let's Encrypt certificate, Force SSL ✓

NPM resolves `pellito-hub` via the shared `nginx-proxy` Docker network.

### 6. Smoke test

```bash
curl -s https://pelican.mechanicalcupcakes.fun/api/health | python3 -m json.tool
```

Expected:

```json
{
    "status": "ok",
    "db": "connected"
}
```

If you get a 503 or connection refused: `docker logs pellito-hub --tail 50`

---

## Recurring Deploy

```bash
cd /docker/pellito-hub
git pull origin main
docker compose up -d --build
docker logs pellito-hub --tail 30
```

---

## Useful Commands

```bash
docker logs pellito-hub --tail 30
docker compose exec pellito-hub sh
curl -s https://pelican.mechanicalcupcakes.fun/api/health | python3 -m json.tool
docker cp pellito-hub:/app/data/dev.db /tmp/pellito-backup.db
```

## Data

The named volume `pellito-hub_pellito-data` holds the live SQLite DB — do not wipe it.

Back up before destructive operations: `docker cp pellito-hub:/app/data/dev.db /tmp/pellito-backup.db`
