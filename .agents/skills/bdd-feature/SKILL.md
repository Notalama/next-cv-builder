---
name: bdd-feature
description: >-
  Add a business feature using Gherkin-first BDD with playwright-bdd.
  Use when implementing new product behavior, acceptance criteria, .feature
  files, step definitions, or red-green BDD workflows.
---

# BDD feature skill

## When to use

Use this skill for Gherkin / playwright-bdd work. For full product features (spec → tests → human gate → code), prefer `.agents/skills/agentic-feature/SKILL.md` — this skill is **Phase 2** of that workflow.

Use this skill alone when the user only wants E2E/BDD changes and already has an approved spec (or is not requesting app implementation).

## Workflow

1. **Requirements** — Restate acceptance criteria as concrete examples (or read `docs/specs/<slug>.md`).
2. **Feature file** — Create `e2e/features/<domain>/<name>.feature` with tags (`@smoke`, `@auth`, `@dashboard`, `@cv-builder`, `@ai`, `@ui`).
3. **Steps** — Search `e2e/steps/**/*.ts` for existing phrases. Extend only what is missing.
4. **Red** — Run `npx bddgen && npx playwright test --grep @tag` and show the failure.
5. **Green** — Only if human gate already passed (or user explicitly skipped the agentic workflow): implement app code until green.
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
