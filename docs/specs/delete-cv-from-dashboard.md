# Spec: Delete CV from dashboard

| Field | Value |
| --- | --- |
| Slug | `delete-cv-from-dashboard` |
| Domain | `dashboard` |
| Status | `implemented` |
| Author prompt | As a signed-in user on the dashboard CV list, show a trash-icon button near each CV that deletes that CV on click; show a success toast on delete and an error toast on failure. |
| Related vision | `docs/project-vision.md` — Dashboard / CV list (“Кабінет · список CV”) |

## 1. Summary

Signed-in members can remove a saved CV from the dashboard list with a per-row delete control. After a successful delete the CV disappears from the list and a success toast confirms it; failures surface an error toast without removing the row.

## 2. User stories

- As a signed-in member, I want a trash button next to each CV on the dashboard, so that I can remove CVs I no longer need.
- As a signed-in member, I want a clear success or error toast after delete, so that I know whether the action worked.

## 3. Acceptance criteria

- [ ] Each CV row on `/dashboard` shows a delete control with a trash icon and accessible name that includes the CV title (e.g. `Delete Ada Lovelace`).
- [ ] Clicking the delete control permanently removes that CV for the current user.
- [ ] After a successful delete, a success toast with text `CV deleted` is shown.
- [ ] After a failed delete, an error toast with text `Failed to delete CV` is shown and the CV remains in the list.
- [ ] After a successful delete, the CV is no longer listed; if it was the last CV, the empty state (`No CVs yet`) is shown.
- [ ] A member cannot delete another user’s CV (ownership enforced server-side).
- [ ] Unauthenticated users cannot call the delete action (redirect / session required, same as other dashboard actions).

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /dashboard` | member | Existing list page; gains per-row delete UI |
| Server action `deleteCvDocument` | member | Invoked from the delete control; no new public URL |

No new routes. Opening a CV still uses `/cv-builder?id=<id>`. Delete does not navigate away from `/dashboard`.

## 5. UX outline

- **Entry point:** Saved CVs list on `/dashboard` (non-empty state).
- **Control:** Per list item, a button with trash icon beside the CV link (not inside the link). Accessible name: `Delete {title}` (title as shown in the list).
- **Happy path:**
  1. Member visits dashboard with at least one CV.
  2. Member activates Delete for that CV.
  3. CV is removed from the list.
  4. Toast: `CV deleted`.
- **Error path:** Delete fails → toast `Failed to delete CV`; row stays.
- **Empty state:** Deleting the last CV reveals the existing empty card (`No CVs yet` / Create CV).
- **Accessibility:** Icon-only button must have an accessible name (`aria-label` / sr-only text). Keyboard-focusable. Prefer `getByRole('button', { name: … })` for locators.
- **Confirmation dialog:** Not required for this feature (direct delete on click).

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/dashboard/page.tsx` | Server | Load session + CV list; render list shell |
| `src/app/dashboard/_components/cv-list-item.tsx` (or similar) | Client | Row UI: link + delete `ActionButton` / trash control; toasts via existing sonner/`ActionButton` |
| `src/app/dashboard/actions.ts` → `deleteCvDocument` | Server action | `requireSession`; delete row where `id` + `userId` match; `revalidatePath('/dashboard')`; return `ActionResult` |
| Existing `ActionButton` + `ActionResult` | Shared | Prefer reuse for loading + success/error toasts |

## 7. Data & types

- Reuse `cv_document` table; no schema/migration changes.
- Reuse `ActionResult` from `src/models/ui` (`{ error: boolean; message?: string }`).
- Success: `{ error: false, message: 'CV deleted' }`.
- Failure (not found / not owned / unexpected): `{ error: true, message: 'Failed to delete CV' }` (do not leak ownership details).
- Input: CV `id` (string / UUID). Validate non-empty id; reject missing/foreign ids as failure result (not throw to the client UI path).

## 8. Integrations

- **Auth:** `requireSession()` on the server action (same as `listUserCvs` / `createCvDocument`).
- **DB:** Drizzle delete on `cvDocument` with `and(eq(id), eq(userId))`.
- **Toasts:** sonner (already in root layout); prefer `ActionButton` which already maps `ActionResult` to `toast.success` / `toast.error`.
- **AI / Stripe / email:** none.

## 9. Edge cases

- Unauthenticated: action requires session (existing `requireSession` behavior).
- Unknown or other-user id: treat as failure → error toast; no delete.
- Concurrent delete / already deleted: failure toast; list refresh should reflect current state.
- Click must not navigate to the CV builder (stop propagation / button outside the link).
- Narrow layout: delete control remains usable next to the title without being clipped off-screen.

## 10. Out of scope

- Soft delete / trash / restore
- Bulk delete
- Confirmation / “Are you sure?” dialog
- Delete from inside the CV builder
- Undo toast action

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Member deletes a saved CV from the dashboard | `@dashboard @smoke` | Create + save named CV → delete → toast + gone from list |
| Member deletes the last CV and sees empty state | `@dashboard` | Single CV → delete → `No CVs yet` |

Feature file path: `e2e/features/dashboard/delete-cv.feature`

Error-toast path is acceptance-covered in unit/implementation (hard to force reliably in BDD without mocking); happy path is E2E-proven.

## 12. Open questions

- None blocking; confirmation dialog deferred unless product asks for it.
