# Spec: Public landing page

| Field | Value |
| --- | --- |
| Slug | `landing-page` |
| Domain | `marketing` (new; existing domains are `auth`, `dashboard`, `cv-builder`, `ai`, `billing`, `orgs`) |
| Status | `implemented` |
| Author prompt | Create a landing page (hero page) with a header containing sign in and sign up buttons; below it, display examples of preview-ready CVs from the available templates filled with preset data but without the form; a "Try now" button somewhere in the bottom middle or bottom right. Follow-up: add a brand link back to the landing page on the dashboard and the sign in / sign up page so users can revisit the previews whenever they want. |
| Related vision | `docs/project-vision.md` — §1.4 Ціннісна пропозиція, §1.3 Цільова аудиторія (first-touch surface for the target audience) |

## 1. Summary

Guests currently have no public surface: `/` redirects straight to `/auth/login`, so a first-time visitor sees a bare auth form with no idea what the product produces. This feature turns `/` into a public landing page that shows the hero pitch, a header with sign in / sign up, and live-rendered previews of every available CV template filled with demo content, plus a "Try now" call to action at the bottom. The page stays reachable after sign-in through a brand link shared by the dashboard and the auth page.

## 2. User stories

- As a guest, I want to see what a finished CV looks like before signing up, so that I can judge whether the product is worth an account.
- As a guest, I want sign in and sign up available from the page header, so that I can get into the app from the first screen.
- As a guest who is convinced, I want a prominent "Try now" action at the end of the page, so that I can start without scrolling back to the header.
- As a guest on the auth page, I want a way back to the landing page, so that I can look at the templates again before committing to an account.
- As a signed-in member, I want to reopen the landing page from my dashboard, so that I can review the available templates at any time.

## 3. Acceptance criteria

- [ ] A guest opening `/` sees the landing page instead of being redirected to `/auth/login`.
- [ ] The landing page has exactly one `h1` — the hero headline.
- [ ] The header shows a `Sign in` link to `/auth/login` and a `Sign up` link to `/auth/login?tab=signup`.
- [ ] The page shows one preview card per registered CV template (currently `Classic Sidebar` and `Minimal`), each labelled with its template name and rendered with demo CV content.
- [ ] Template previews are rendered from real template components with data, not screenshots, and contain no editable form fields.
- [ ] A `Try now` link sits below the previews, near the bottom of the page, and leads to `/auth/login?tab=signup`.
- [ ] Opening `/auth/login?tab=signup` preselects the Sign Up tab; `/auth/login` with no query (or an unknown value) preselects Sign In.
- [ ] A signed-in member opening `/` sees the landing page, with the header showing a `Dashboard` link instead of sign in / sign up.
- [ ] A `CV Builder` brand link in the top-left of the dashboard leads back to `/`.
- [ ] A `CV Builder` brand link in the top-left of the sign in / sign up page leads back to `/`.
- [ ] The demo CV content contains no real personal data (no real name, email, phone, or profile links).

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /` | guest, member | Renders the landing page for everyone; the header adapts to the session |
| `GET /auth/login` | guest | Existing page; Sign In tab preselected as today; gains a brand link back to `/` |
| `GET /auth/login?tab=signup` | guest | Existing page; new query param preselects the Sign Up tab |
| `GET /dashboard` | member | Existing page; gains a brand link back to `/` |

No new routes are created. `src/proxy.ts` stops special-casing `/` entirely; `/dashboard` and `/cv-builder` stay protected, and signed-in users visiting `/auth/login` are still bounced to `/dashboard`. The `?tab=` param accepts the existing `AuthTab` values and falls back to `signin`.

## 5. UX outline

- **Entry points:** the site root, reached directly or from any external link; the brand link on the dashboard; the brand link on the auth page.
- **Header:** `CV Builder` brand link on the left; on the right, `Sign in` and `Sign up` for guests, or a single `Dashboard` link for members. Rendered as a `banner` landmark.
- **Brand link:** one shared component (icon plus `CV Builder`) pointing at `/`, placed top-left on the landing header, the dashboard, and the auth page.
- **Hero:** single `h1` headline plus one supporting sentence. No CTA button here, so `Try now` keeps a unique accessible name on the page.
- **Template showcase:** one card per registered template. Each card shows the template's display name as a visible caption above a scaled-down, non-interactive rendering of that template filled with demo data. Cards sit in a responsive grid — side by side on desktop, stacked on narrow screens.
- **Try now:** centered section below the showcase with a large `Try now` link and a short supporting line.
- **Happy path:**
  1. Guest opens `/`.
  2. Guest reads the hero and scrolls through the template previews.
  3. Guest activates `Try now` (or `Sign up` in the header).
  4. Guest lands on `/auth/login` with the Sign Up tab already selected.
- **Empty / loading / error:** none. The page is fully static with no data fetching and no user input, so there are no toasts, spinners, or error states.
- **Accessibility:**
  - Exactly one `h1`; template captions are `h3` under a section `h2`.
  - The rendered template bodies are decorative duplicates of the caption, so they are removed from the accessibility tree (`aria-hidden`) — this also keeps the demo person's name out of the heading structure and keeps `getByRole('heading')` locators unambiguous.
  - Previews are non-interactive (`pointer-events: none`), so they add no tab stops.
  - `Sign in`, `Sign up`, and `Try now` are real links, keyboard reachable in DOM order.

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/proxy.ts` | Edge proxy | No longer redirects `/` at all; protected-path and login redirects unchanged |
| `src/app/page.tsx` | Server | Read the session, then compose the landing sections with a session flag |
| `src/components/brand-link.tsx` | Server | Shared `CV Builder` link back to `/` |
| `src/app/_components/landing/landing-header.tsx` | Server | Header with the brand link plus session-dependent actions |
| `src/app/dashboard/page.tsx` | Server | Existing page; renders the brand link above the dashboard title |
| `src/app/_components/landing/landing-hero.tsx` | Server | Headline + supporting copy |
| `src/app/_components/landing/template-showcase.tsx` | Server | Grid over `CV_PREVIEW_TEMPLATES` |
| `src/app/_components/landing/template-preview-card.tsx` | Server | Caption + clipped, scaled, non-interactive template rendering |
| `src/app/_components/landing/try-now-cta.tsx` | Server | Bottom `Try now` call to action |
| `src/app/_components/landing/demo-cv.ts` | Module | Sanitized demo `CvFormValues`, validated at import |
| `src/app/auth/login/page.tsx` | Client | Reads `?tab=` to seed the initially selected tab; renders the brand link |
| `src/models/auth.ts` | Shared types | `parseAuthTab()` guard for the query value |

No client components are added: the template components are already plain React with no hooks or browser APIs, so the whole landing page renders on the server.

## 7. Data & types

- Reuse `CvFormValues` / `cvFormSchema` from `src/models/cv.ts`. No new CV types.
- Reuse `CvPreviewTemplateId` and `CV_PREVIEW_TEMPLATES` from `src/models/cv-builder.ts` and `src/app/cv-builder/_components/preview/templates/index.ts` so the showcase covers whatever templates are registered.
- New `parseAuthTab(value: string | undefined): AuthTab` in `src/models/auth.ts`, defaulting to `signin` for missing or unrecognized values.
- Demo data: derived from `src/app/assets/cv-preset.json` with all identity fields overridden with fictional values, then run through `cvFormSchema.parse` so a schema change fails the build rather than silently rendering a broken page.
- No Drizzle tables, columns, or migrations.

## 8. Integrations

- **Auth:** read-only. `getServerSession()` for the member redirect; the page itself requires no session.
- **AI:** none.
- **Stripe / email / external APIs:** none.
- **Database:** none — the page performs no queries.

## 9. Edge cases

- Unauthenticated access is the normal case, not an error.
- Signed-in member on `/`: sees the landing page with a `Dashboard` link, and `Try now` points at `/cv-builder` rather than sign up.
- Stale or invalid session cookie: the header may render the member variant, but `/dashboard` re-validates and bounces to `/auth/login`. Cosmetic only.
- Unknown `?tab=` value on `/auth/login`: falls back to the Sign In tab.
- Signed-in member hitting `/auth/login?tab=signup`: existing redirect to `/dashboard` still wins.
- Narrow viewports: preview cards stack in a single column and stay clipped inside their container rather than causing horizontal scroll.
- A third template added to the registry appears automatically, without editing the landing page.
- Printing the landing page is not supported or tested; the CV print styles target the builder.

## 10. Out of scope

- Pricing, testimonials, FAQ, footer links, or any additional marketing sections.
- Anonymous use of the CV builder — `Try now` leads to sign up; `/cv-builder` stays protected.
- Choosing a template from the landing page and carrying that choice into the builder.
- Light-mode theming; the app remains dark-only.
- SEO work beyond the existing root metadata (sitemap, OG images, structured data).
- Internationalization of the marketing copy.
- Analytics or conversion tracking.

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Guest sees the landing page with template previews | `@marketing @smoke` | Acceptance 1, 2, 4 — hero heading plus both template captions |
| Guest opens sign up from the header | `@marketing` | Acceptance 3, 7 — `/auth/login?tab=signup`, Sign Up tab selected |
| Guest opens sign in from the header | `@marketing` | Acceptance 3, 7 — `/auth/login`, Sign In tab selected |
| Guest starts from the Try now call to action | `@marketing @smoke` | Acceptance 6, 7 — bottom CTA lands on the Sign Up tab |
| Guest reaches the landing page from the login page | `@marketing` | Acceptance 10 — brand link on the auth page |
| Signed-in member can still browse the landing page | `@marketing` | Acceptance 8 — no redirect, header offers `Dashboard` |
| Member returns to the landing page from the dashboard | `@marketing @smoke` | Acceptance 9 — brand link on the dashboard |

Feature file path: `e2e/features/marketing/landing.feature`

Acceptance 11 (no real personal data) is enforced at the source by the sanitized demo module rather than by a browser assertion.

## 12. Open questions

- None blocking. The `marketing` domain is new; if the team prefers to keep the domain list closed, this spec and its feature file can move under `auth` without changing behavior.
