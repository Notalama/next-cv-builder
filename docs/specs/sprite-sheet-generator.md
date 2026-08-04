# Spec: Sprite Sheet Generator

| Field | Value |
| --- | --- |
| Slug | `sprite-sheet-generator` |
| Domain | `dashboard` |
| Status | `approved` |
| Author prompt | Add a Sprite Sheet Generator page linked from the dashboard toolbar: multi-PNG dropzone, frame previews, client-side canvas packing into one transparent PNG, download result. |
| Related vision | N/A (utility tool alongside dashboard) |

## 1. Summary

Signed-in members can open a Sprite Sheet Generator from the dashboard, upload multiple PNG frames, preview them, pack them into a single transparent sprite sheet on the client (HTML5 Canvas), preview the result on a checkerboard background, and download the PNG.

## 2. User stories

- As a signed-in member, I want a Sprite Sheet Generator link on the dashboard, so that I can open the tool without leaving the app shell.
- As a member, I want to upload several PNGs, review frames, and create one sheet, so that I can import it into Unity 2D with transparency preserved.
- As a member, I want to download the generated sheet and return to the dashboard, so that the flow feels complete.

## 3. Acceptance criteria

- [ ] Dashboard header includes a link/button **Sprite Sheet Generator** that navigates to `/sprite-generator`.
- [ ] `/sprite-generator` requires auth (same as dashboard; guests redirected to login).
- [ ] Page heading **Sprite Sheet Generator** and a **Back to Dashboard** control that goes to `/dashboard`.
- [ ] Multi-file input / dropzone accepts only PNG (`accept="image/png"`, `multiple`).
- [ ] Selected frames show in a responsive grid with index, file name, and dimensions (`W×H`).
- [ ] Member can remove one frame or **Clear all**.
- [ ] **Create Sprite** is disabled when there are no frames; enabled when ≥1 frame.
- [ ] Clicking **Create Sprite** shows a loading state on the button until packing finishes.
- [ ] After success, a result section shows: checkerboard-backed preview, texture size (`{width}×{height}`), frame count, and **Download Sprite Sheet (.png)**.
- [ ] Output PNG preserves RGBA transparency (canvas with alpha, `image/png` export).
- [ ] Non-PNG files are ignored or rejected with a clear toast/message (no crash).

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET /dashboard` | member | Gains Sprite Sheet Generator link |
| `GET /sprite-generator` | member | New page; add to `PROTECTED_PATHS` in `src/proxy.ts` |

## 5. UX outline

- **Dashboard entry:** Outline/secondary `ButtonLink` next to New CV: label `Sprite Sheet Generator` (optional `Images` / `Grid2x2` icon).
- **Page layout:** Max-width main column consistent with dashboard (`max-w-3xl` or slightly wider `max-w-4xl`).
- **Dropzone:** Clickable area + drag-and-drop; accessible file input labeled e.g. `PNG frames`.
- **Frame list:** Cards/tiles with thumbnail, `#index` (1-based), name, `width×height`, remove button `Remove frame {n}` / by file name.
- **Clear all:** Button `Clear all` when frames exist.
- **Create Sprite:** Primary button; `LoadingSwap` while packing.
- **Result:** Card with checkerboard CSS behind `<img>`; text `N frames · W×H px`; download button.
- **Errors:** Toast on load/pack failure (`Failed to create sprite sheet`).

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/sprite-generator/page.tsx` | Server | `requireSession()`, render shell |
| `src/app/sprite-generator/_components/sprite-generator.tsx` | Client | Dropzone, previews, actions, download |
| `src/lib/sprite/pack-sprite-sheet.ts` | Client util | Load images, layout, canvas draw, blob export |
| `src/proxy.ts` | Middleware | Protect `/sprite-generator` |
| Dashboard `page.tsx` | Server | Nav link only |

No server actions, DB, or AI.

## 7. Data & types

```ts
type SpriteFrame = {
  id: string;
  file: File;
  name: string;
  width: number;
  height: number;
  previewUrl: string; // object URL
};

type SpriteSheetResult = {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  frameCount: number;
};
```

**Layout (locked):** single horizontal row — sheet width = sum of frame widths; height = max frame height; each frame drawn at native size, top-aligned, left to right in selection order. No re-encoding loss beyond PNG canvas export.

## 8. Integrations

- Auth session via `requireSession` + proxy
- No Stripe / email / Gemini

## 9. Edge cases

- Unauthenticated access → login redirect with `next=/sprite-generator`
- Empty selection → Create disabled
- Very large images → may be slow; keep loading state; no hard size limit in v1
- Revoke object URLs on remove/unmount to avoid leaks
- Download filename default: `sprite-sheet.png`

## 10. Out of scope

- Saving sheets to the database
- Non-PNG formats
- Animation playback / JSON atlas export (Unity meta)
- Multi-row packing algorithms / packing density options
- Server-side image processing

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Member opens generator from dashboard | `@dashboard @smoke` | Link → heading visible |
| Member creates and downloads a sprite sheet | `@dashboard @ui` | Upload 2 fixture PNGs → Create → result visible → download button |

Feature: `e2e/features/dashboard/sprite-generator.feature`  
Page object: `e2e/pages/sprite-generator.page.ts`  
PNG inputs via Playwright `setInputFiles` buffers (minimal PNG), not committed binaries.

## 12. Open questions

- None blocking. Single-row layout locked for v1.
