---
name: agentic-feature
description: >-
  Run the 5-phase agentic feature workflow (spec → playwright-bdd E2E written →
  human approval gate → typed Next.js implementation → manual BDD verification).
  Use when the user asks to add, build, design, or ship a business feature, capability, or
  user-facing flow in this CV Builder repo.
---

# Agentic feature workflow

Gherkin-first, human-gated feature delivery for **next-cv-builder**.

## Stack (do not invent alternatives)

| Layer | Choice |
| --- | --- |
| Framework | Next.js App Router (`src/app`), React 19, TypeScript strict |
| Auth | Better Auth (`src/lib/auth`) |
| DB | Drizzle + Postgres (`src/drizzle`) |
| UI | shadcn/ui + Radix + Tailwind 4 (`src/components/ui`) |
| Forms | React Hook Form + Zod (`src/models`) |
| Business E2E | playwright-bdd + Gherkin (`e2e/`) |
| Unit | Vitest + Testing Library (`src/**/*.test.tsx`) |
| Lint | Biome (single quotes, 2-space indent) |
| Alias | `@/*` → `src/*` |
| Test env | `.env.test` `DATABASE_URL` (never production) |

Read Next docs under `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Progress checklist

Copy and update as you go:

```
Feature: <name>
- [ ] Phase 1: Spec written at docs/specs/<slug>.md
- [ ] Phase 2: E2E feature + steps written (not run)
- [ ] Phase 3: Human approval of spec + BDD received
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: User ran BDD manually and reported results
```

---

## Phase 1 — Spec generation

**Input:** user's feature prompt (+ optional clarifications).  
**Output:** `docs/specs/<feature-slug>.md` using [spec-template.md](spec-template.md).

### Rules

1. Explore existing code first (`src/app`, `src/models`, `e2e/features`) — extend, don't duplicate.
2. Spec must be concrete enough to write Gherkin without guessing UX copy or routes.
3. Call out Server vs Client split, Zod types, server actions, and edge cases.
4. Align with product vision in `docs/project-vision.md` when relevant.
5. Do **not** implement app behavior in this phase.

### Domains (folder tags)

`auth` · `dashboard` · `cv-builder` · `ai` · `billing` · `orgs`

---

## Phase 2 — E2E test creation (spec only)

**Input:** the Phase 1 spec file only (not new product inventiveness).  
**Output:** BDD suite written on disk (not executed).

### Layout

| Artifact | Path |
| --- | --- |
| Feature | `e2e/features/<domain>/<name>.feature` |
| Steps | `e2e/steps/<domain>.steps.ts` (or extend existing) |
| Page objects | `e2e/pages/<page>.page.ts` |
| Fixtures / auth / db | `e2e/support/` |

### Rules

1. Grep `e2e/steps/**/*.ts` before adding step phrases.
2. Declarative Gherkin ("I create a new CV"), not CSS/button colors.
3. Locators: `getByRole`, `getByLabel`, `getByText`. No class selectors.
4. Auth via `e2e/support/auth.ts` unless scenario is `@ui` login itself.
5. Tags: `@smoke`, `@auth`, `@dashboard`, `@cv-builder`, `@ai`, `@ui` as appropriate.
6. Mock AI with `AI_IMPROVE_MOCK=true` (already set in Playwright webServer env).
7. Do not edit `.features-gen/`.
8. Do **not** run `npm run test:bdd`, `bddgen`, or Playwright in this phase. Optionally run `npx bddgen` only to verify step generation compiles — never execute the suite.

Also follow `.agents/skills/bdd-feature/SKILL.md`.

---

## Phase 3 — Human gate (HARD STOP)

After Phase 2, **stop all implementation**.

Present a short review package:

1. Link/path to `docs/specs/<slug>.md`
2. Paths to new/changed `.feature`, steps, page objects
3. Summary of scenarios covered (no test run output — tests were not executed)
4. Open questions / assumptions

Ask:

> Review the spec and E2E suite. Reply **approved** (or **LGTM** / **proceed**) to continue implementation, or request changes.

### Gate rules

- Do **not** start Phase 4 until the user explicitly approves.
- "looks good", "ok", "go", "approved", "LGTM", "proceed", "ship it" → proceed.
- Change requests → revise spec and/or tests, re-open the gate (still no test runs).
- Never treat silence or an unrelated message as approval.

---

## Phase 4 — Feature implementation

**Input:** approved spec + approved BDD suite.  
**Output:** minimal typed code that matches the spec and is ready for manual BDD verification.

### Implementation order

1. Types / Zod schemas in `src/models` (if needed).
2. Drizzle schema + migration (if needed).
3. Server actions / lib (`"use server"`, session via `requireSession`).
4. Server Components for data; Client Components (`"use client"`) only for interactivity.
5. UI with existing shadcn primitives; kebab-case filenames; named exports for helpers.
6. Wire routes under `src/app/<route>/`.
7. Add Vitest only for pure logic/edge units.
8. `biome check` on touched files; no drive-by refactors.
9. Do **not** run BDD in this phase — proceed to Phase 5.

### Conventions

- Colocate feature UI in `src/app/<route>/_components/`.
- Prefer server actions in `actions.ts` next to the route.
- Toast errors with user-friendly copy (sonner).
- Keep AI calls behind `src/lib/ai/*` with mock path for tests.
- Exclude e2e from app `tsconfig` (already configured).

---

## Phase 5 — Manual BDD verification (HARD STOP)

After Phase 4, **stop** and ask the user to run the suite locally.

Provide the exact command, for example:

```bash
npm run build
npm run test:bdd -- --grep @<tag-or-feature>
```

Ask:

> Please run the BDD suite above and paste the result (pass/fail output). I will fix any failures or close out once green.

### Gate rules

- Do **not** run `npm run test:bdd` yourself unless the user explicitly asks you to.
- Wait for the user's pasted output before declaring the feature done or starting fixes.
- If tests fail → fix implementation, then ask the user to re-run and report again.
- If tests pass → mark spec `implemented`, summarize, and stop.

### Done when

- [ ] User reported BDD green for the feature tag
- [ ] Spec acceptance criteria covered
- [ ] No new secrets; env documented in `.env.example` / `.env.test.example` if needed

---

## Invocation examples

```
Use the agentic-feature skill.

Feature: Allow members to duplicate an existing CV from the dashboard.
```

```
@agentic-feature
Add export of CV as plain JSON from the builder toolbar.
```
