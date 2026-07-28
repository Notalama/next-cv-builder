# Spec: Cover Letter Button (CV Builder)

| Field | Value |
| --- | --- |
| Slug | `cover-letter-builder-ui` |
| Domain | `cv-builder` / `ai` |
| Status | `approved` |
| Author prompt | Add a Generate cover letter button at the top of the CV builder form; require a fulfilled vacancy description and a non-empty current CV (for local smoke of cover-letter generation). |
| Related vision | Extends `docs/specs/cover-letter-mcp.md` (UI was previously out of scope) |

## 1. Summary

On the CV builder **Target Vacancy** section (top of the form), members can generate an ultra-concise cover letter (50–100 words) from the **current in-form CV** plus vacancy context. This reuses `generateCoverLetter` (same AI path as the MCP tool) via a server action — it does **not** call `/api/mcp` from the browser.

## 2. User stories

- As a member editing a CV, I want to generate a short cover letter from my current form data and vacancy text, so I can smoke-test letter quality without an MCP client.
- As a member, I want clear validation when vacancy or CV content is missing, so I know what to fill in before generating.

## 3. Acceptance criteria

- [ ] Target Vacancy section shows a **Generate cover letter** button (accessible name: `Generate cover letter`).
- [ ] Target Vacancy section includes a **Company name** field (required for generation).
- [ ] Clicking the button with vacancy description shorter than 10 characters shows an error toast asking for a vacancy description (same bar as “Generate perfect CV”).
- [ ] Clicking with empty company name shows an error toast asking for a company name.
- [ ] Clicking when the current CV is empty (see §7) shows an error toast asking to fill the CV first.
- [ ] With valid vacancy (≥10 chars), company name, and non-empty CV, generation succeeds and shows the letter plus word count in a read-only result area in the Target Vacancy section.
- [ ] Success toast indicates mock vs live AI (same pattern as generate CV).
- [ ] Result `wordCount` is between 50 and 100 inclusive.
- [ ] Member session required (server action uses `requireSession()`).

## 4. Routes & navigation

No new routes. Uses existing CV builder (`/cv-builder` / dashboard edit flow).

## 5. UX outline

- **Entry:** Target Vacancy card at top of form — fields: Vacancy Description, Company name; buttons: Generate perfect CV, Generate cover letter.
- **Happy path:** Fill vacancy + company → fill/preset CV → Generate cover letter → result panel shows letter body and “N words”.
- **Validation errors:** toast only (no navigation).
- **Loading:** button uses `LoadingSwap` / disabled while pending.
- **A11y:** button `aria-label="Generate cover letter"`; result region labeled (e.g. `aria-label="Generated cover letter"`).

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `vacancy-section.tsx` | Client | Fields, validation toasts, call action, show result |
| `cv-builder/actions.ts` | Server action | `generateCoverLetterAction` + session |
| `src/lib/ai/cover-letter.ts` | Server util | Existing generation (reuse) |
| `src/models/cover-letter.ts` | Shared | UI request schema without MCP `cvId` |

## 7. Data & types

**UI request (Zod):**

- `companyName` — non-empty string
- `jobRole` — taken from current CV `role` (non-empty)
- `jobDescription` — vacancy text (trimmed, min 10)
- `language` — optional, default `en`
- `cv` — current `CvFormValues` from the form (not loaded by id)

**Non-empty CV (client + server):** at least all of:

- `fullName` trimmed length ≥ 2
- `role` trimmed length ≥ 2
- `aboutMe` trimmed length ≥ 10

**MCP schema:** keep `cvId` for the tool; AI core should accept prompt fields without requiring `cvId` (pass CV separately).

No DB persistence of letters.

## 8. Integrations

- Auth: Better Auth session via `requireSession()`
- AI: existing `generateCoverLetter` + `AI_IMPROVE_MOCK` / `GEMINI_API_KEY`
- Does **not** use `MCP_API_KEY` or the MCP HTTP endpoint

## 9. Edge cases

- Unauthenticated → redirect / session error from `requireSession`
- AI failure → error toast with safe message
- Empty form after Clear form → block with CV-empty toast
- Vacancy filled but company missing → company toast
- Concurrent double-click → disabled while pending

## 10. Out of scope

- Calling `/api/mcp` from the browser
- Saving cover letters to Postgres
- Editing/exporting the letter as PDF
- Parsing company/role from vacancy via AI
- Changing MCP auth / OAuth

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Happy path with preset + vacancy | `@cv-builder @ai` | mock letter visible, word count 50–100 |
| Block when vacancy missing | `@cv-builder @ai` | toast |
| Block when CV empty | `@cv-builder @ai` | toast |

Feature file: `e2e/features/cv-builder/generate-cover-letter.feature`

## 12. Open questions

- None blocking. Company name is an explicit field (not inferred from vacancy text).
