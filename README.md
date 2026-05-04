# Pellito Hub

Kitchen training app for Pelican Brewery. Line Cooks browse recipes and take quizzes; Managers create and publish recipes, track quiz performance, and chat with the Deckhand AI agent.

Built with Next.js 14, Drizzle ORM, and SQLite (libsql). Deployed to `pelican.mechanicalcupcakes.fun` via Docker on a Hostinger VPS.

---

## Database

Pellito Hub uses **SQLite via [libsql](https://github.com/libsql/libsql)**, accessed through [Drizzle ORM](https://orm.drizzle.team/). The DB file lives in a named Docker volume (`pellito-hub_pellito-data`) so it survives container rebuilds and deploys.

### Why SQLite

This is the right database for a demo and early-customer tool:

- **Zero infrastructure** — no separate database container, no connection pooling, no credentials to rotate. One container, one file.
- **Fast enough** — a restaurant training app has tens of users, not thousands. SQLite handles concurrent reads trivially and serialises writes without issue at this scale.
- **Portable** — the entire dataset travels with the container. Backup is `docker cp`. Restore is the same command in reverse.
- **Low ops burden** — no Postgres tuning, no WAL configuration, no pg_dump cron job. The named volume just works.

### Limitations to know

- **Single-writer** — SQLite serialises all writes. Fine for this use case; a bottleneck if you ever have hundreds of simultaneous quiz submissions.
- **No native full-text search** — possible with SQLite FTS5, but not configured here. Recipe search uses a `LIKE` query instead.
- **Not a managed service** — no automated backups, point-in-time recovery, or replication. Back up the volume manually before destructive operations (see `DEPLOY.md`).
- **Client migration** — when a paying restaurant client onboards, they will likely have an existing recipe database and their own infrastructure. The migration to their DB will be driven by their data and stack, not by anything built here speculatively.

### Schema

| Table | Purpose |
|---|---|
| `recipes` | All recipe content — ingredients, steps, allergens, status |
| `quiz_questions` | AI-generated quiz questions linked to each recipe |
| `metrics` | One row per quiz attempt — anonymous, role-tagged |
| `role_sessions` | Session start/end timestamps by role — no PII |

Schema lives in `src/db/schema.ts`. DB helpers are in `src/db/recipes.ts`.

---

## Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`. SQLite DB is created automatically at `data/dev.db` on first run.

Default credentials (dev only):
- Admin: `admin` / `admin`
- Line Cook: `linecook` / `linecook`

---

## Deploy

See `DEPLOY.md` for the full VPS deploy runbook.

```bash
# On the VPS
cd /docker/pellito-hub
git pull origin main
docker compose up -d --build
```
