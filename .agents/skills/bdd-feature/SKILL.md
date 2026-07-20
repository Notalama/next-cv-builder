---
name: bdd-feature
description: >-
  Add a business feature using Gherkin-first BDD with playwright-bdd.
  Use when implementing new product behavior, acceptance criteria, .feature
  files, step definitions, or red-green BDD workflows.
---

# BDD feature skill

## When to use

Use this skill whenever the user asks for a new business capability, acceptance tests, or Gherkin scenarios in this repo.

## Workflow

1. **Requirements** — Restate acceptance criteria as concrete examples.
2. **Feature file** — Create `e2e/features/<domain>/<name>.feature` with tags (`@smoke`, `@auth`, `@dashboard`, `@cv-builder`, `@ui`).
3. **Steps** — Search `e2e/steps/**/*.ts` for existing phrases. Extend only what is missing.
4. **Red** — Run `npx bddgen && npx playwright test --grep @tag` and show the failure.
5. **Green** — Implement app code (App Router, server actions, Drizzle) until green.
6. **Cleanup** — Prefer domain assertions and API auth helpers; avoid brittle selectors.

## Project layout

- Features: `e2e/features/`
- Steps: `e2e/steps/`
- Fixtures/auth/db: `e2e/support/`
- Page objects: `e2e/pages/` (thin, intent-named methods)
- Config: `playwright.config.ts`

## Auth and data

- Sign up / sign in through `e2e/support/auth.ts` (API + cookies).
- Unique emails per scenario via factories.
- Schema via Drizzle migrations against `.env.test` `DATABASE_URL`.
