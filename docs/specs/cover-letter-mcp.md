# Spec: MCP Cover Letter Generator

| Field | Value |
| --- | --- |
| Slug | `cover-letter-mcp` |
| Domain | `ai` |
| Status | `approved` |
| Author prompt | Expose an MCP tool `generate_cover_letter` that loads CV data from Postgres via Drizzle and generates an ultra-concise cover letter (50–100 words) with Vercel AI SDK + Google Gemini; Vercel Hobby compatible. |
| Related vision | `docs/project-vision.md` — AI tooling |

## 1. Summary

MCP clients (Cursor, Claude Desktop, or similar) can call `generate_cover_letter` on this app’s MCP endpoint. The tool loads a saved CV by id, generates a high-impact cover letter tailored to a company and role, and returns structured `{ coverLetter, wordCount }` with a hard 50–100 word limit.

## 2. User stories

- As an MCP client user, I want to generate a short cover letter from an existing CV id, so that I can tailor applications without leaving my agent workflow.
- As an operator, I want the MCP endpoint protected by a shared API key, so that CV data is not publicly callable.

## 3. Acceptance criteria

- [ ] MCP endpoint is available at `/api/mcp` (Streamable HTTP via `[transport]` route).
- [ ] Missing or invalid `Authorization: Bearer <MCP_API_KEY>` is rejected.
- [ ] Tool `generate_cover_letter` accepts `cvId`, `companyName`, `jobRole`, optional `jobDescription`, optional `language` (default `en`).
- [ ] Unknown `cvId` returns a structured tool error (not a stack trace).
- [ ] Successful result includes `coverLetter` and `wordCount` where `wordCount` is between 50 and 100 inclusive.
- [ ] When `AI_IMPROVE_MOCK=true` or `GEMINI_API_KEY` is unset, a deterministic mock letter is returned within the word range.
- [ ] No builder UI is required for this feature.

## 4. Routes & navigation

| Method / path | Auth | Notes |
| --- | --- | --- |
| `GET/POST/DELETE /api/mcp/[transport]` | Bearer `MCP_API_KEY` | MCP Streamable HTTP; SSE disabled (no Redis) |

No app navigation or pages.

## 5. UX outline

N/A — MCP tool only (no UI).

## 6. Server vs Client split

| Unit | Type | Responsibility |
| --- | --- | --- |
| `src/app/api/mcp/[transport]/route.ts` | Route handler | MCP server, auth, register tool |
| `src/lib/ai/cover-letter.ts` | Server util | Prompt + `generateObject` + mock + retry |
| `src/lib/cv/get-cv-for-mcp.ts` | Server util | Load CV by id (trusted after MCP key) |
| `src/models/cover-letter.ts` | Shared | Zod input/output + `countWords` |

## 7. Data & types

- Input: `cvId`, `companyName`, `jobRole` required; `jobDescription` optional; `language` optional default `en`.
- Output: `coverLetter` string; `wordCount` number with `.min(50).max(100)`.
- Reuse `CvFormValues` from `src/models/cv.ts`; no DB schema change.
- `countWords`: whitespace-split non-empty tokens.

## 8. Integrations

- **Auth:** `MCP_API_KEY` bearer (privileged; may load any CV by id).
- **AI:** `@ai-sdk/google` + `ai` `generateObject`; model from `GEMINI_MODEL` (default `gemini-2.0-flash`); key `GEMINI_API_KEY`.
- **Mock:** `AI_IMPROVE_MOCK=true` or missing Gemini key.
- **DB:** Drizzle `cvDocument` by primary key.

## 9. Edge cases

- Missing/invalid MCP key → unauthorized error.
- CV not found or `data` null → tool error.
- Empty required fields → Zod validation error.
- Generated letter outside 50–100 words → one regeneration retry; then error.
- Gemini rate limit / timeout → tool error without leaking internals.
- Hobby `maxDuration = 10`.

## 10. Out of scope

- CV Builder UI / saving cover letters
- Migrating improve/generate flows to AI SDK
- Redis / SSE resumability
- OAuth MCP auth + per-user ownership
- Persisting cover letters in the database

## 11. E2E plan

| Scenario | Tags | Notes |
| --- | --- | --- |
| Mock generation returns 50–100 words | Vitest `@ai` | Unit |
| Input schema rejects empty required fields | Vitest | Unit |
| `countWords` counts whitespace tokens | Vitest | Unit |

No playwright-bdd feature file (no UI).

## 12. Open questions

- None blocking. Per-user MCP OAuth deferred.
