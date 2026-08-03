# Spec: Rename CV from dashboard

| Field | Value |
| --- | --- |
| Slug | `rename-cv-from-dashboard` |
| Domain | `dashboard` |
| Status | `approved` |
| Author prompt | Add ability to rename a saved CV in the dashboard list via a pencil icon that opens a small modal with one field and Cancel / Save; save new name in DB or close without saving. |
| Related vision | `docs/project-vision.md` — Dashboard / CV list |

## 1. Summary

Signed-in members can rename a saved CV from the dashboard list. A pencil control opens a small dialog with the current title; Save persists the new name, Cancel closes without writing.

## 2. User stories

- As a signed-in member, I want to rename a CV from the dashboard, so that list titles stay meaningful after the CV content changes.
- As a signed-in member, I want Cancel to discard edits, so that I can abort without changing the stored title.

## 3. Acceptance criteria

- [ ] Each CV row on `/dashboard` shows a rename control with a pencil icon and accessible name `Rename {title}`.
- [ ] Activating rename opens a dialog titled `Rename CV` with a single field labeled `CV name` (prefilled with the current title) and buttons `Cancel` and `Save`.
- [ ] Save with a valid trimmed title (1–120 chars) updates `cv_document.title` for that owned row and shows toast `CV renamed`.
- [ ] After a successful rename, the list shows the new title and no longer shows the old title for that row.
- [ ] Cancel closes the dialog without writing to the DB; the list title is unchanged.
- [ ] Empty or whitespace-only title is blocked (client and server); no success toast.
- [ ] Failed rename shows toast `Failed to rename CV`.
- [ ] Ownership and session enforced on the server action (same pattern as delete).
- [ ] Saving CV content in the builder later does **not** overwrite a renamed title (`saveCvDocument` update omits `title`; create still derives title from `fullName`).

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /dashboard` | member | Existing list; gains per-row rename UI |
| Server action `renameCvDocument` | member | No new public URL |

Rename does not navigate away from `/dashboard`.

## 5. UX outline

- **Entry:** Pencil icon button beside delete on each list item (outside the CV link).
- **Happy path:** Open rename → edit `CV name` → Save → toast `CV renamed` → list shows new title.
- **Cancel path:** Open rename → edit or leave → Cancel → dialog closes → title unchanged.
- **Loading:** Save disabled / loading while the action is pending.
- **A11y:** `aria-label="Rename {title}"` on the pencil button; dialog uses labeled field; prefer role/label locators.

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/dashboard/page.tsx` | Server | Unchanged list shell |
| `src/app/dashboard/_components/cv-list-item.tsx` | Client | Pencil + Dialog + call rename action + toasts |
| `src/app/dashboard/actions.ts` → `renameCvDocument` | Server action | Session, ownership, validate title, update, revalidate |
| `src/app/dashboard/actions.ts` → `saveCvDocument` | Server action | On update: do not set `title` |
| `src/models/cv-document.ts` | Shared | Zod rename schema |
| `src/components/ui/dialog.tsx` | UI primitive | shadcn Dialog (add if missing) |

## 7. Data & types

- Table: existing `cv_document.title` (text, not null). No migration.
- Zod: trimmed string, min 1, max 120.
- `ActionResult`: success `{ error: false, message: 'CV renamed' }`; failure `{ error: true, message: 'Failed to rename CV' }`.

## 8. Integrations

- Auth: `requireSession()`
- DB: Drizzle update where `id` + `userId`
- Toasts: sonner
- AI / Stripe / email: none

## 9. Edge cases

- Unauthenticated → session redirect / failure
- Unknown or other-user id → failure toast
- Whitespace-only title → blocked
- Concurrent rename of deleted CV → failure toast
- Pencil click must not navigate to the builder

## 10. Out of scope

- Inline edit without modal
- Rename from CV builder toolbar
- Changing initial title derivation on create (still from `fullName`)

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Member renames a saved CV | `@dashboard @smoke` | Save named CV → rename → toast + new title in list |
| Member cancels rename | `@dashboard` | Open rename, change field, cancel → old title remains |

Feature file: `e2e/features/dashboard/rename-cv.feature`

## 12. Open questions

- None blocking.
