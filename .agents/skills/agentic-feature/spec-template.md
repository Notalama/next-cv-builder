# Spec template

Copy into `docs/specs/<feature-slug>.md` and fill every section. Delete unused subsections only if truly N/A (mark as N/A, do not leave vague).

```markdown
# Spec: <Feature title>

| Field | Value |
| --- | --- |
| Slug | `<feature-slug>` |
| Domain | `auth` \| `dashboard` \| `cv-builder` \| `ai` \| `billing` \| `orgs` |
| Status | `draft` \| `approved` \| `implemented` |
| Author prompt | <paste or summarize user request> |
| Related vision | link/section in `docs/project-vision.md` if any |

## 1. Summary

One short paragraph: who benefits and what changes in the product.

## 2. User stories

- As a <role>, I want <capability>, so that <outcome>.
- …

## 3. Acceptance criteria

Checklist the E2E must prove:

- [ ] …
- [ ] …

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /…` | member \| guest \| admin | … |

Deep links, redirects, query params (`?id=`).

## 5. UX outline

- Entry point (nav, button, empty state)
- Primary happy path (step list)
- Empty / loading / error toasts or inline messages
- Accessibility: roles, labels, keyboard

Do not prescribe CSS classes; describe intent and visible names for locators.

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `page.tsx` | Server | … |
| `_components/….tsx` | Client | … |
| `actions.ts` | Server action | … |
| `src/lib/…` | server util | … |

## 7. Data & types

- Zod / TypeScript types (new or extended in `src/models`)
- Drizzle tables / columns (if any)
- Validation rules and defaults

## 8. Integrations

- Auth session requirements
- AI (`src/lib/ai`, mock behavior for BDD)
- Stripe / email / external APIs (or explicitly none)

## 9. Edge cases

- Unauthenticated access
- Invalid / empty input
- Rate limits / missing API keys
- Concurrent edits / ownership
- Mobile / narrow layout if relevant

## 10. Out of scope

Bullet list of what this feature will **not** do.

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| … | `@cv-builder @smoke` | maps to acceptance #… |

Feature file path: `e2e/features/<domain>/<name>.feature`

## 12. Open questions

- …
```
