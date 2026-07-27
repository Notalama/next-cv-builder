# Spec: Template-driven form fields

| Field | Value |
| --- | --- |
| Slug | `template-driven-form-fields` |
| Domain | `cv-builder` |
| Status | `approved` |
| Author prompt | CV builder form fields are static, but the active preview template may display fewer fields than the form collects. Each template should declare the list of fields it displays, pass it to the form, and the form should show only the fields the template needs. Field list to be a JSON manifest validated by Zod at load; top-level fields only; also persist the selected template and fix Classic Sidebar not rendering education. Clarifications: keep `projects[].domain` in the model but make it optional; use the label `Skill Categories` in app and tests; apply a dedicated Zod schema per template and rebuild the form when the template changes (do not mask one shared schema). |
| Related vision | `docs/project-vision.md` — CV builder (live preview + templates) |

## 1. Summary

Members editing a CV currently fill every field in the builder form regardless of which preview template is active, so effort is wasted on fields that never appear in the rendered CV. Each preview template will declare which form fields it consumes in a JSON manifest, and the builder form will render only those fields. Validation follows visibility, so fields a template hides can no longer block saving.

## 2. User stories

- As a signed-in member, I want the builder form to show only the fields my chosen template actually renders, so that I do not waste time filling fields that never appear in my CV.
- As a signed-in member, I want to save my CV without filling fields the active template hides, so that validation never blocks me on invisible inputs.
- As a signed-in member, I want text I already typed to survive a template switch, so that trying a different template never destroys my work.
- As a signed-in member, I want my chosen template restored when I reopen a saved CV, so that the form and preview look the same as when I left.

## 3. Acceptance criteria

Checklist the E2E must prove:

- [ ] With `Minimal` active, the form shows `Skill Categories` and hides `Technical Principles`, `Domains of Experience`, and `Photo (Optional)`.
- [ ] With `Classic Sidebar` active, the form shows `Technical Principles`, `Domains of Experience`, and `Photo (Optional)`, and hides `Skill Categories`.
- [ ] A required field left empty while **visible** still blocks saving with the existing validation error toast.
- [ ] The same required field left empty while **hidden** by the active template does not block saving; the CV saves successfully.
- [ ] A value typed into a field is preserved when switching away to a template that hides it and back again.
- [ ] The selected template is persisted on save and restored when the CV is reopened from the dashboard, including its field visibility.
- [ ] The `Classic Sidebar` preview renders an `Education` section (currently missing).
- [ ] A section card whose every field is hidden by the active template is not rendered at all (no empty cards).
- [ ] No field that is **required** under the active template schema is unreachable: every required field has a rendered input (see §9). `projects[].domain` stays in the model but is optional.

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /cv-builder` | member | Existing new-CV route; form field visibility becomes template-driven |
| `GET /cv-builder?id=<id>` | member | Existing edit route; now also restores the saved template selection |
| Server action `saveCvDocument` | member | Gains a `templateId` argument persisted with the document |
| Server action `getCvDocument` | member | Returns the stored `templateId` so the builder can restore it |

No new routes and no new query params. The template selection stays in the existing toolbar dropdown rather than becoming a URL parameter.

## 5. UX outline

- **Entry point:** the existing `Preview template` dropdown in the CV builder toolbar (`Classic Sidebar` / `Minimal`).
- **Primary happy path:**
  1. Member opens the CV builder.
  2. Member selects a template from the toolbar dropdown.
  3. The form immediately hides inputs the template does not consume and reveals inputs it does.
  4. Member fills only the visible fields and saves.
  5. Toast `CV saved`; the selected template is stored with the CV.
- **Switching back:** re-selecting the previous template remounts the form with that template's schema and restores the hidden inputs from the preserved value snapshot. Hiding never clears data.
- **Empty sections:** if every field in a section card is hidden, the whole card (header included) is omitted rather than rendered empty.
- **Validation messaging:** unchanged copy. Invalid visible fields still produce the `Please fix validation errors before saving.` error toast.
- **Label cleanup:** the `Skill Categories (Minimal template)` label loses its parenthetical and becomes `Skill Categories`, because template awareness is now automatic and the hint is redundant.
- **Accessibility:** hidden fields are removed from the DOM, not visually hidden, so they leave the tab order and the accessibility tree. Visible fields keep their current labels so `getByLabel` locators stay valid.

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/assets/cv-template-fields.json` | Static asset | The manifest: template id → array of consumed form field names |
| `src/models/cv-template-fields.ts` | Shared module | Zod schema for the manifest, parse-at-load, `CV_FORM_FIELD_NAMES`, `fieldsForTemplate()`, `schemaForTemplate()` (builds a **picked** schema of only consumed fields) |
| `src/app/cv-builder/_components/preview/templates/index.ts` | Shared | Template descriptors gain a `fields` list resolved from the manifest |
| `src/app/cv-builder/_components/cv-builder.tsx` | Client | Owns `templateId` and the latest `CvFormValues` snapshot; on template change remounts the form with `key={templateId}`, the new template schema as resolver, and the snapshot as `defaultValues` so values survive |
| `src/app/cv-builder/_components/form/template-fields-context.tsx` | Client | New provider + `useTemplateFields()` exposing `isConsumed(name)`, mirroring `FocusedFieldProvider` |
| `src/app/cv-builder/_components/form/text-form-field.tsx` | Client | Returns `null` when its field is not consumed by the active template |
| `src/app/cv-builder/_components/form/*-section.tsx` | Client | Guard non-`TextFormField` inputs (photo, languages, education, projects) and skip fully hidden section cards |
| `src/app/cv-builder/_components/preview/templates/classic-sidebar.tsx` | Server-safe | Renders a new `Education` section |
| `src/app/dashboard/actions.ts` | Server actions | `saveCvDocument` persists `templateId`; `getCvDocument` returns it |
| `src/drizzle/schemas/cv-schema.ts` + migration | DB | New `template_id` column on `cv_document` |

## 7. Data & types

**Manifest shape** (`src/app/assets/cv-template-fields.json`):

```json
{
  "classic": ["fullName", "role", "photo", "..."],
  "minimal": ["fullName", "role", "email", "..."]
}
```

**Canonical field list** in `src/models/cv-template-fields.ts`, kept tied to the form schema so a renamed field is a compile error:

```ts
export const CV_FORM_FIELD_NAMES = [
  'fullName', 'role', 'photo', 'email', 'phone', 'location', 'links',
  'languages', 'primarySkills', 'secondarySkills', 'skillCategories',
  'domains', 'aboutMe', 'techPrinciples', 'projects', 'education',
] as const satisfies readonly (keyof CvFormValues)[];

type MissingFields = Exclude<keyof CvFormValues, (typeof CV_FORM_FIELD_NAMES)[number]>;
const _exhaustive: MissingFields extends never ? true : never = true;
```

The `satisfies` clause rejects names that are not real form fields; the `_exhaustive` assertion fails the build when a field is added to `cvFormSchema` without being classified.

**Manifest validation** runs once at module load and throws on failure, so a malformed manifest breaks `next build` and `npm run dev` rather than degrading at runtime. Requirements enforced at parse time:

- keys are exactly the members of `CV_PREVIEW_TEMPLATE_IDS` — every template must have an entry, and unknown template ids are rejected;
- each value is a non-empty array of `CV_FORM_FIELD_NAMES` members;
- no duplicate entries within a template's array.

**Field assignment** (top-level only, per the granularity decision):

| Field | `classic` | `minimal` |
| --- | --- | --- |
| `fullName`, `role`, `email`, `phone`, `location`, `links` | yes | yes |
| `aboutMe`, `projects`, `education`, `languages` | yes | yes |
| `primarySkills`, `secondarySkills` | yes (badges) | yes (keyword bolding) |
| `photo` | yes | no |
| `techPrinciples` | yes | no |
| `domains` | yes | no |
| `skillCategories` | no | yes |

`education` is listed for `classic` because this spec adds an education section to that template. `primarySkills` and `secondarySkills` are listed for `minimal` even though it renders no skills section, because `collectKeywords` consumes them to bold keywords — the manifest means "fields this template consumes", not "fields it prints as their own section".

**Template-scoped validation (dedicated schema + form rebuild).** Do **not** keep one shared `cvFormSchema` and mask hidden fields with `z.any()` / `.partial()`. Each template gets its own Zod object built by picking only the fields it consumes from `cvFormSchema.shape`. Unconsumed fields are absent from that schema entirely, so they cannot fail validation.

```ts
export function schemaForTemplate(templateId: CvPreviewTemplateId) {
  const consumed = fieldsForTemplate(templateId);
  const shape = cvFormSchema.shape;

  return z.object(
    Object.fromEntries(consumed.map((name) => [name, shape[name]])),
  );
}
```

On template change the builder remounts the form:

1. Read the current values via `form.getValues()` (or a `watch` snapshot kept in parent state).
2. Update `templateId`.
3. Remount with `key={templateId}` so `useForm` is created fresh with `resolver: zodResolver(schemaForTemplate(templateId))` and `defaultValues` equal to the previous snapshot (merged onto `CV_FORM_DEFAULT_VALUES` so every key still exists in form state for the preview and for reappearing fields).

This keeps validation honest (only visible fields are validated), clears stale errors automatically via remount, and preserves typed values across switches. The preview continues to receive the full `CvFormValues` snapshot from parent state, not only the picked schema output.

**Schema change:** keep `domain` on `cvProjectSchema`, but make it **optional** (not required). It currently uses `z.string().min(2, "Domain is required")` while no template renders it and `ProjectCard` has no input for it — leaving it required makes `Clear form` permanently unsavable. Change to `z.string().optional()` (or equivalent empty-string-tolerant optional). Keep `domain: ""` in `EMPTY_CV_PROJECT` and in presets; do not remove the key from the model.

**Drizzle change:** add `templateId: text('template_id')` to `cv_document`, nullable so existing rows migrate without a backfill. A `null` value resolves to `DEFAULT_CV_PREVIEW_TEMPLATE_ID` when loaded. The value is validated against `CV_PREVIEW_TEMPLATE_IDS` on read, and an unrecognized stored id falls back to the default rather than throwing.

## 8. Integrations

- **Auth:** unchanged. `saveCvDocument` and `getCvDocument` keep `requireSession()` and ownership checks.
- **DB:** one additive migration for `cv_document.template_id`. No data backfill.
- **AI:** unchanged. Note that `generateCvForVacancy` and `improveText` may write to fields the active template hides; values are retained but simply not shown, which is consistent with the preservation rule.
- **Stripe / email:** none.

## 9. Edge cases

- **Clear form is currently unsavable.** `Clear form` resets to `CV_FORM_DEFAULT_VALUES`, which sets `projects[0].domain` to `""`, but `cvProjectSchema` requires `min(2)` and `ProjectCard` renders no domain input — so the form becomes permanently invalid with no way to fix it. Making `domain` optional (§7) resolves this. Note that a cleared form still legitimately fails validation because genuinely visible required fields are empty; the invariant being fixed is that no required field is *unreachable*.
- **Preset data for hidden fields.** `getCvPresetValues()` fills every field, including ones the active template hides. Values stay in the parent snapshot / remounted `defaultValues` and are saved; they are simply not rendered or validated under the active template schema.
- **Switching templates with invalid hidden data.** Remounting with the new picked schema clears stale errors automatically. Values for fields the new template does not consume remain in the snapshot for when the member switches back.
- **Unknown or null stored `templateId`.** Falls back to `DEFAULT_CV_PREVIEW_TEMPLATE_ID`; never throws or shows an error to the member.
- **Manifest missing a template.** Fails fast at load with a descriptive error naming the missing template id.
- **Array fields.** `languages`, `projects`, and `education` are hidden or shown as whole sections; per-item subfield visibility is out of scope.
- **Unauthenticated access:** unchanged, `/cv-builder` stays proxy-protected.
- **Narrow layout:** hiding fields only removes grid children, so the existing responsive layout needs no change.

## 10. Out of scope

- Per-item subfield visibility (for example hiding only `projects[].period`).
- Making templates user-authored or DB-driven (the JSON manifest is a build-time asset for now).
- A warning or diff shown when switching to a template that hides already-filled fields.
- Reordering fields per template, or template-specific labels and placeholders.
- New templates beyond `classic` and `minimal`.
- Server-side re-validation of `CvFormValues` in `saveCvDocument` (it does not validate today; unchanged here).
- Migrating the `templateId` into the URL as a shareable query parameter.

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Minimal template hides the fields it does not use | `@cv-builder @smoke` | Acceptance #1 |
| Classic Sidebar template hides the fields it does not use | `@cv-builder` | Acceptance #2 |
| A required field blocks saving while visible but not while hidden | `@cv-builder @smoke` | Acceptance #3, #4 — clear `Technical Principles` under Classic, fail, switch to Minimal, succeed |
| Values typed into a field survive a template switch | `@cv-builder` | Acceptance #5 |
| Selected template is restored when reopening a saved CV | `@cv-builder` | Acceptance #6 — saves as `Classic Sidebar` deliberately, since `Minimal` is the default and would pass without persistence |
| Classic Sidebar preview renders an education section | `@cv-builder` | Acceptance #7 |

Feature file path: `e2e/features/cv-builder/template-driven-fields.feature`

Two acceptance criteria are deliberately not BDD-covered because they are structural rather than flow-shaped:

- **#8 (no empty section cards)** — Vitest component test rendering each section under each template.
- **#9 (no unreachable required field)** — Vitest unit test asserting that every field required by `schemaForTemplate(id)` appears in that template's manifest *and* has a rendered input. Guards the old `projects[].domain` class of bug; `domain` itself is optional and therefore not required to have an input.

## 12. Open questions

- None blocking after clarifications: `domain` optional (kept), label `Skill Categories` in app + tests, dedicated per-template Zod schemas with form remount on switch.
- Recommended follow-up (not required for approval): a Vitest test that renders each template with a `Proxy` over the fully-populated `demo-cv.ts` fixture, records which `data.*` keys are read, and asserts the recorded set equals the manifest entry. This is the one place automatic inference works, since TypeScript cannot statically reflect on which fields a component reads.
