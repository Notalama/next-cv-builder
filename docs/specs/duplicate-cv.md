# Spec: Duplicate CV (dashboard copy + Save as new)

| Field | Value |
| --- | --- |
| Slug | `duplicate-cv` |
| Domain | `dashboard` / `cv-builder` |
| Status | `approved` |
| Author prompt | Create a CV based on an existing one via (1) dashboard Copy that immediately adds a list item with a name suffix, and (2) builder “Save as new” next to Save CV. |
| Related vision | `docs/project-vision.md` — Dashboard / CV list |

## 1. Summary

Members can fork an existing CV in two places: from the dashboard list (Copy) and from the CV builder while editing (Save as new). Both create a new owned document with the same form data and template; the new title uses a `(copy)` suffix. Dashboard Copy stays on the list; Save as new navigates to the new document.

## 2. User stories

- As a signed-in member on the dashboard, I want to copy a CV in one click, so that I can start a vacancy-specific variant without opening the builder first.
- As a signed-in member editing a saved CV, I want Save as new, so that I can keep my edits on a new document without overwriting the original.

## 3. Acceptance criteria

### Dashboard Copy

- [ ] Each CV row shows a Copy control with accessible name `Copy {title}` (Copy icon; outside the CV link).
- [ ] Clicking Copy inserts a new CV for the same user with the same `data` and `templateId`.
- [ ] New title is `{originalTitle} (copy)` (trimmed; capped at 120 chars if needed).
- [ ] Success toast: `CV copied`.
- [ ] Failure toast: `Failed to copy CV`; original unchanged.
- [ ] After success, both original and `{title} (copy)` appear in the list; user stays on `/dashboard`.
- [ ] Ownership + session enforced; other users’ CVs cannot be copied.

### Builder Save as new

- [ ] When editing an **existing** CV (`cvId` present), the form footer shows **Save as new** beside **Save CV** (accessible name `Save as new`).
- [ ] Save as new is hidden for brand-new unsaved CVs (no `cvId`) — only **Save CV** creates the first document.
- [ ] Save as new validates the form like Save; on success inserts a new document with current form values + template (does not update the original).
- [ ] New title is `{titleFromFullName} (copy)` where base title matches create rules (`fullName` or `Untitled CV`), then ` (copy)`, max 120 chars.
- [ ] Success toast: `CV saved as new`.
- [ ] Browser navigates to `/cv-builder?id={newId}` after success.
- [ ] Failure toast with a safe message; original document unchanged.

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /dashboard` | member | Gains per-row Copy |
| Server action `duplicateCvDocument` | member | Dashboard Copy |
| Server action `saveCvAsNew` (or equivalent) | member | Builder fork from current form values |
| `GET /cv-builder?id=` | member | Save as new replaces URL with new id |

## 5. UX outline

- **Dashboard:** Copy icon button next to Delete (and Rename if present). No confirmation dialog.
- **Builder:** Secondary outline/secondary button `Save as new` left of primary `Save CV` in the footer actions row.
- **Loading:** Disable both actions while either is pending.
- **A11y:** Icon-only Copy uses `aria-label`; Save as new is a named button.

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `cv-list-item.tsx` | Client | Copy button → `duplicateCvDocument` + toast |
| `cv-builder/.../form/index.tsx` | Client | Save as new → action + navigate |
| `dashboard/actions.ts` | Server | `duplicateCvDocument`, `saveCvAsNew` |
| `models/cv-document.ts` | Shared | Helpers for copy title suffix if useful |

## 7. Data & types

- No migration; reuse `cv_document`.
- Copy title helper: append ` (copy)` to base; if result exceeds 120, truncate base then append.
- `duplicateCvDocument(id)` → `ActionResult` (`CV copied` / `Failed to copy CV`).
- `saveCvAsNew({ data, templateId })` → `{ id: string }` or throw/safe error for toast.
- Deep-copy JSON `data` as stored (no shared mutation).

## 8. Integrations

- Auth: `requireSession()`
- DB: Drizzle insert of new UUID row
- Toasts: sonner
- AI / Stripe: none

## 9. Edge cases

- Missing / foreign id on duplicate → failure toast
- Concurrent delete of source while copying → failure toast
- Save as new with invalid form → same validation toast as Save (`Please fix validation errors before saving.`)
- Repeated copies: `Name (copy)`, then another copy of original is again `Name (copy)` (duplicate titles allowed; no auto `(copy 2)` in v1)
- Copy of already-suffixed title: `Foo (copy) (copy)` is acceptable in v1

## 10. Out of scope

- Auto-open builder after dashboard copy
- Rename dialog during copy
- `(copy 2)` uniqueness numbering
- Cloning another user’s CV
- Soft-delete / version history

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Member copies a CV from the dashboard | `@dashboard @smoke` | Save named CV → Copy → both titles in list |
| Member saves as new from the builder | `@cv-builder @smoke` | Save CV → Save as new → toast + URL id change; both on dashboard |

Feature files:

- `e2e/features/dashboard/copy-cv.feature`
- `e2e/features/cv-builder/save-as-new.feature`

## 12. Open questions

- None blocking.
