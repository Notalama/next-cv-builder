# Spec: Tools as Module Federation remotes

| Field | Value |
| --- | --- |
| Slug | `tools-as-microfrontends` |
| Domain | `dashboard` |
| Status | `approved` |
| Author prompt | Move Speed Reader and Sprite Sheet Generator to Vite Module Federation remotes in separate git repos; Next.js 16 host keeps auth and the same URLs. |
| Related vision | `docs/project-vision.md` §4.1 (monolith). This feature intentionally diverges for these two tools only. |

## 1. Summary

Signed-in members still open Speed Reader and Sprite Sheet Generator from the dashboard at the same host routes. The interactive widgets load at runtime from two separately deployed Vite remotes via Module Federation. Auth, dashboard links, page chrome, and product URLs stay in this Next.js app. Direct visits to a remote’s own origin are unauthenticated public JS (CDN); members are gated only on host routes.

## 2. User stories

- As a signed-in member, I want Speed Reader and Sprite Sheet Generator to work from the dashboard as they do today, so that extracting them into remotes does not change the product flow.
- As a signed-in member, I want a loading state while a remote widget loads, so that the page does not look broken.
- As a signed-in member, I want a clear error and a retry control if a remote fails to load, so that I can recover from a down remote.
- As a guest, I want `/cv-builder/speed-reader` and `/sprite-generator` to redirect me to login, so that tools stay members-only on the host.

## 3. Acceptance criteria

- [ ] Dashboard header still has **Speed reader** → `/cv-builder/speed-reader` and **Sprite Sheet Generator** → `/sprite-generator`.
- [ ] Both routes require auth (proxy; sprite page also `requireSession()`). Guests go to `/auth/login?next=…`.
- [ ] Speed Reader host page shows heading **Speed Reader**, **Back to Dashboard**, then the remote widget (textarea with placeholder *Paste or type the text you want to speed-read…*, **Play**).
- [ ] Sprite generator host page shows heading **Sprite Sheet Generator**, **Back to Dashboard**, then the remote widget (existing PNG / MP4 behavior unchanged).
- [ ] While a remote loads, the page shows **Loading Speed Reader…** or **Loading Sprite Sheet Generator…**.
- [ ] If a remote fails, the page shows **Speed Reader is unavailable.** or **Sprite Sheet Generator is unavailable.** and a **Try again** button.
- [ ] Existing sprite-generator BDD scenarios still pass (same copy and locators).
- [ ] Host reads remote entry URLs from `NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY` and `NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY`.

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /dashboard` | member | Unchanged tool links |
| `GET /cv-builder/speed-reader` | member | Host chrome + remote `speed_reader/SpeedReader` |
| `GET /sprite-generator` | member | Host chrome + remote `sprite_generator/SpriteGenerator` |

No new host routes. Remote standalone origins (`localhost:3002` / `:3003`, later Vercel) are not product URLs and are not auth-gated.

## 5. UX outline

- **Entry:** dashboard outline links **Speed reader** and **Sprite Sheet Generator** (unchanged).
- **Host chrome:** page `h1` and **Back to Dashboard** live in the Next.js page, not in the remote.
- **Happy path:** signed-in member opens the link; after loading, the tool behaves as before.
- **Loading:** polite status text named above.
- **Error:** unavailable message + **Try again** (re-runs `loadRemote`).
- **Accessibility:** heading level 1 on host; Speed Reader Play/Pause/Restart keep `aria-label`s; sprite locators unchanged (`PNG frames`, `MP4 video`, **Create Sprite**, etc.).

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/cv-builder/speed-reader/page.tsx` | Server | Metadata, heading, back link, mount client loader |
| `src/app/sprite-generator/page.tsx` | Server | `requireSession()`, heading, back link, mount client loader |
| `src/lib/federation/runtime.ts` | Client | `init()` once; remotes from env; share React 19.2.4 via `lib` |
| `src/lib/federation/load-remote.ts` | Client | `loadRemote(name)` wrapper |
| `src/components/remote-module.tsx` | Client | Suspense/error UI for a remote component |
| Vite remotes (sibling repos) | Client | Feature UI + copied shadcn primitives; no Better Auth |
| `src/proxy.ts` | Middleware | Unchanged `PROTECTED_PATHS` |

No new server actions or Drizzle tables.

## 7. Data & types

No new Zod/Drizzle models on the host. Sprite types move to the sprite-generator remote (`src/models/sprite.ts`). Host has no sprite packing code after extraction.

## 8. Integrations

- Auth: host only (Better Auth cookies + proxy). Remotes do not import `better-auth`.
- Module Federation: `@module-federation/runtime` on the host; `@module-federation/vite` on remotes.
- Shared at runtime: `react` and `react-dom` singletons from the host. UI primitives are copied into each remote, not federated.
- Git remotes: `https://github.com/Notalama/speed-reader`, `https://github.com/Notalama/sprite-generator`.
- Local sibling folders: `../speed-reader` (port 3002), `../sprite-generator` (port 3003).
- AI / Stripe / email: none.

## 9. Edge cases

- Unauthenticated host URL → login redirect with `next` set.
- Missing `NEXT_PUBLIC_*_REMOTE_ENTRY` → localhost defaults (`:3002` / `:3003` `mf-manifest.json`).
- Remote origin down / CORS failure → unavailable UI + Try again.
- Opening a remote’s Vercel/localhost URL directly has no host session; optional standalone `index.html` is for local development only.

## 10. Out of scope

- Federating the CV builder, dashboard, or auth pages
- Webpack / `@module-federation/nextjs-mf` on the host
- Shared npm design-system package
- Independent login on remotes
- Gating remote CDN URLs (public JS)

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Member opens Speed Reader from dashboard | `@dashboard @smoke` | Link → heading, back control, Play, textarea |
| Member opens sprite generator from dashboard | `@dashboard @smoke` | Existing feature file |
| Member creates a sprite sheet | `@dashboard @ui` | Existing |
| Member converts MP4 to PNG frames | `@dashboard @ui` | Existing |

Feature files:

- `e2e/features/dashboard/speed-reader.feature` (new)
- `e2e/features/dashboard/sprite-generator.feature` (unchanged)

Playwright `webServer` starts both Vite remotes (build + preview) then this Next app. Local: sibling clones. CI: checkout into `.remotes/speed-reader` and `.remotes/sprite-generator`.

## 12. Open questions

- None blocking. GitHub repos already exist: `Notalama/speed-reader`, `Notalama/sprite-generator`.
