# KuberaNow — Dynamic Edition

Independent business & financial journalism platform built with Next.js 16,
Prisma 7, Auth.js v5, and Tailwind v4. Fully database-backed with a role-based
admin console.

## Quick start

### Option A — Docker (recommended, one command)

```bash
docker compose up -d --build
```

That's it. The image builds, the container starts, and on first boot it
applies migrations + seeds the demo content automatically. Open
[http://localhost:3000](http://localhost:3000).

- **Image size:** ~500 MB (Alpine + Node 22 + Next standalone + Prisma runtime)
- **Runtime memory:** ~80 MB
- **Data persists** across restarts via a named volume (`kuberanow-data`)
- The seed runs **only on first boot** — subsequent restarts keep your data

Useful commands:

```bash
docker compose logs -f        # tail logs
docker compose down           # stop (keeps data volume)
docker compose down -v        # stop AND wipe the database
```

### Live streaming (optional)

The admin console ships with a one-click **Live** control panel that connects
OBS Studio to a local RTMP ingester (MediaMTX) so you can broadcast without
setting up a CDN.

```bash
docker compose up -d mediamtx      # start the local RTMP + HLS server
```

Then in OBS Studio:

* **Settings → Stream → Service:** `Custom…`
* **Server:** `rtmp://localhost:1935/live`
* **Stream key:** `kubera`

Open `/admin/live` and the **OBS ingest** card shows the same URL and key
with one-click copy buttons. Press **Start Streaming** in OBS, then click
**Go live** in the control panel — the public `/live` page will start
playing the broadcast over HLS.

For production, replace the local URL/key with your CDN's (Cloudflare Stream,
AWS IVS, Mux, Brightcove) by editing the **Stream configuration** form on
the same page.

### Option B — local dev (no Docker)

```bash
npm install
npm run db:migrate   # creates the local SQLite DB + tables
npm run db:seed      # seeds demo users, 42 articles, 38 market quotes, 5 jobs, etc.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default logins

| Role   | Email                    | Password    |
| ------ | ------------------------ | ----------- |
| Admin  | admin@kuberanow.com      | `admin123`  |
| Editor | editor@kuberanow.com     | `editor123` |
| Reader | reader@kuberanow.com     | `reader123` |

Visit `/login` to sign in, or `/register` to create a new (reader) account.

## What's dynamic

All data lives in the database and is editable from `/admin`:

- **Market data** — 6 asset classes (indices, stocks, MFs, IPO, commodities,
  crypto) editable at `/admin/market`. Changes appear on `/market/*` instantly.
- **News articles** — 7 categories, full CRUD at `/admin/articles`, with
  draft/published status. Article detail pages at
  `/news/<category>/<slug>`.
- **Jobs** — CRUD at `/admin/jobs`. Visitors apply inline on `/career`.
- **Contact** — submissions from the `/contact` form land in
  `/admin/contact`.
- **Site settings** — emails, phones, address, grievance officer at
  `/admin/settings`.

## Roles

- **admin** — full access to every admin screen, can change user roles.
- **editor** — create/edit articles, jobs, market data. Cannot see
  applications, messages, users, or settings.
- **reader** — no admin access. Has a `/dashboard` with saved calculations
  and submitted job applications.

Readers can save calculator results (SIP/FD/EMI/Tax/SWP) and apply for jobs;
both are tracked on their dashboard.

## Architecture

```
prisma/
  schema.prisma           # data model (SQLite for dev, swap to Postgres for prod)
  seed.ts                 # seeds all demo content
src/
  lib/
    db.ts                 # Prisma singleton + driver adapter
    auth.ts               # Auth.js v5 config (Credentials, JWT, role on session)
    auth-guard.ts         # requireUser / requireEditor / requireAdmin
    data-access.ts        # all read queries (getMarketRows, getNewsArticles, …)
    actions.ts            # all server actions (submitContact, upsertArticle, …)
    types.ts              # shared domain types
  proxy.ts                # protects /admin/* and /dashboard/*
  app/
    (public pages)        # / /market/* /news/* /tools/* /career /contact …
    login, register       # auth pages
    dashboard             # reader dashboard
    admin/                # role-guarded admin console
```

## Switching to PostgreSQL (Supabase / Neon)

The project ships with SQLite for zero-config local dev. To move to Postgres:

1. Create a Postgres database (Supabase or Neon free tier).
2. Install the adapter: `npm install @prisma/adapter-pg`
3. In `prisma/schema.prisma`, change `provider = "sqlite"` to `"postgresql"`.
4. In `src/lib/db.ts` and `prisma/seed.ts`, swap the adapter:
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
   ```
5. Set `DATABASE_URL` in `.env` to your Postgres connection string.
6. `npm run db:migrate && npm run db:seed`

## npm scripts

| Script           | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start the dev server                     |
| `npm run build`  | Production build                         |
| `npm run start`  | Start the production server              |
| `npm run db:migrate` | Create/apply DB migrations            |
| `npm run db:seed`    | Seed demo content                     |
| `npm run db:reset`   | Drop & re-seed the database           |
| `npm run db:studio`  | Open Prisma Studio (browse/edit data) |
