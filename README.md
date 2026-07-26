# CV Builder

Next.js app for building a professional CV with live preview, PDF export, presets, and a speed reader. Includes authentication (Better Auth), email flows, and Stripe billing.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Auth and Postgres are always required. Set in `.env`:

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

Then apply the schema:

```bash
npm run db:migrate
# or for quick local prototyping without migration history:
npm run db:push
```

Pick one and stick with it. `db:push` writes the schema straight to the database without recording anything in `drizzle.__drizzle_migrations`, so a later `db:migrate` tries to replay migrations from scratch and fails with `relation "..." already exists`. To recover, recreate the database and run `npm run db:migrate`, or insert the already-applied migration hashes into `drizzle.__drizzle_migrations` manually.

## Deploy on Vercel (from GitHub)

### 1. Push to GitHub

Ensure the repo is on GitHub (this project: `Notalama/next-cv-builder`).

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Vercel auto-detects **Next.js** — leave the defaults:
   - **Build command:** `npm run build`
   - **Install command:** `npm install`
   - **Output directory:** (default)
3. **Node.js:** 20.x or newer (`engines.node` in `package.json`).

### 3. Environment variables

Copy from [`.env.example`](./.env.example) into **Vercel → Project → Settings → Environment Variables**.

| Variable | Required for | Notes |
|----------|--------------|-------|
| `DATABASE_URL` | Auth | Postgres connection string (Neon / Vercel Postgres / Supabase) |
| `BETTER_AUTH_SECRET` | Auth | Random string, 32+ characters |
| `BETTER_AUTH_URL` | Auth | Production URL, e.g. `https://your-app.vercel.app` |
| `POSTMARK_SERVER_TOKEN` | Email sign-up / reset | From [Postmark](https://postmarkapp.com) |
| `POSTMARK_FROM_EMAIL` | Email | Verified sender address |
| `GITHUB_*` / `DISCORD_*` | OAuth | Optional; omit to hide providers |
| `STRIPE_*` | Billing | Optional |
| `ARCJET_API_KEY` | Rate limiting | Optional; auth works without it |

After the first deploy, set `BETTER_AUTH_URL` to the **actual** Vercel URL and redeploy if you used a placeholder.

### 4. Run database migrations (production)

After `DATABASE_URL` is set, apply migrations once against the production database:

```bash
# From your machine with DATABASE_URL pointing at production:
npm run db:migrate
```

Or use a CI job / Vercel deploy hook. Migration files live in `src/drizzle/migrations/`.

### 5. OAuth callback URLs (if using GitHub / Discord)

Register these redirect URLs in each provider console:

- `https://your-app.vercel.app/api/auth/callback/github`
- `https://your-app.vercel.app/api/auth/callback/discord`

### 6. Deploy

Push to `main` (or your production branch). Vercel builds and deploys automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server locally |
| `npm run lint` | Biome lint/check |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly (dev only) |

## Project structure

- `src/app/cv-builder/` — CV form, preview, speed reader
- `src/app/auth/` — Login, 2FA, password reset
- `src/app/api/auth/` — Better Auth API route
- `src/models/` — Shared TypeScript types and Zod schemas
- `src/drizzle/` — Database schema and migrations
- `src/lib/auth/` — Auth, Stripe, OAuth configuration
- `src/lib/emails/` — Transactional email templates (Postmark)
