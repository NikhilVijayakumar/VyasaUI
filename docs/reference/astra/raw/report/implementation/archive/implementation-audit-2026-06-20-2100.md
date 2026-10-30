# Implementation Audit Report — Astra

**Version:** 1.1.1  
**Audit Date:** 2026-06-20  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Report ID:** IMPL-AUDIT-2026-06-20-2100  

---

## Executive Summary

The implementation audit reveals **5 critical findings**, **6 major findings**, and **6 minor findings** against the Astra v1.1.1 source. The dominant theme is **prati coupling** — AppStateHandler and the public entry point both import from `prati` (a local file dependency at `file:../Prati`). If prati is removed from the system, Astra fails to build, AppStateHandler fails to render, and 4 tests fail. A secondary critical finding is the **network failure bug**: `ApiService` returns status 500 for offline/no-response conditions instead of `INTERNET_ERROR (0)`, making the `status === 0` check in AppStateHandler permanently unreachable.

| Dimension | Score |
|-----------|-------|
| Architecture Compliance | 4.5/10 |
| Feature Compliance | 6.0/10 |
| Technical Design Compliance | 7.5/10 |
| Drift Detection | 7.5/10 |
| Public API Audit | 5.0/10 |
| Type Accuracy | 7.0/10 |
| Dependency Audit | 4.5/10 |
| Technical Debt | 7.0/10 |
| Implementation Purity | 7.5/10 |
| Test Integrity | 5.0/10 |
| **Overall** | **6.2/10** |

---

## Phase 1: Source Inventory

### Files Audited

| File | Role |
|------|------|
| `src/lib.ts` | Public entry point |
| `src/common/index.ts` | Common barrel export |
| `src/common/state/AppState.ts` | State contract: AppState, StateType, StateCode |
| `src/common/hooks/useDataState.ts` | MVVM hook |
| `src/common/repo/ApiService.ts` | Axios HTTP client |
| `src/common/repo/ServerResponse.ts` | Response wrapper |
| `src/common/repo/HttpStatusCode.ts` | Status enum + getStatusMessage |
| `src/common/repo/APITypes.ts` | Internal types: ResponseSucess, ResponseError |
| `src/common/repo/apiServiceFactory.ts` | getApiService singleton |
| `src/common/repo/index.ts` | Repo barrel export |
| `src/common/components/organisms/AppStateHandler.tsx` | Conditional-render component |
| `src/common/components/organisms/index.ts` | Organisms barrel export |
| `src/publicExports.test.ts` | Root export surface test |
| `src/common/hooks/useDataState.test.ts` | Hook unit tests |
| `src/common/repo/ApiService.test.ts` | ApiService unit tests |
| `package.json` | Package manifest |

### Source Map

```
src/
  lib.ts                           → export * from "prati" + export * from "./common"
  common/
    state/AppState.ts              → StateType, StateCode, AppState<T>
    hooks/useDataState.ts          → useDataState<T>
    repo/
      ApiService.ts                → ApiService (class)
      ServerResponse.ts            → ServerResponse<T> (class)
      HttpStatusCode.ts            → HttpStatusCode (enum), getStatusMessage
      APITypes.ts                  → ResponseSucess<T>, ResponseError (internal)
      apiServiceFactory.ts         → getApiService (singleton factory)
    components/organisms/
      AppStateHandler.tsx          → AppStateHandler (FC)
```

---

## Phase 2: Architecture Compliance

### Findings

#### IMPL-ARCH-001 — CRITICAL
**File:** `src/lib.ts:2`  
**Finding:** `export * from "prati"` re-exports the entire prati surface through the astra package entry point. prati is a local dependency (`"prati": "file:../Prati"` in package.json). This creates a hard build-time coupling: if prati is removed or the local path is unavailable, `npm run build` fails and the package cannot be imported.  
**Doc reference:** `docs/raw/architecture/core/api-surface.md` — does not list prati re-exports as intentional public surface.  
**Impact:** Build failure; consumers receive prati's entire component library through astra, obscuring the actual public API.

#### IMPL-ARCH-002 — CRITICAL
**File:** `src/common/components/organisms/AppStateHandler.tsx:4`  
**Finding:** `import { LoadingState, ErrorState, EmptyState } from "prati"` — AppStateHandler delegates all three rendering states to prati components. These are not astra-native implementations.  
**Doc reference:** `docs/raw/architecture/core/api-surface.md` — AppStateHandler described as astra-owned; LoadingState/ErrorState/EmptyState not listed as external dependencies.  
**Impact:** AppStateHandler fails to compile and render if prati is removed. The three UI states (loading, error, empty) have no fallback implementation in astra.

#### IMPL-ARCH-003 — CRITICAL
**File:** `src/publicExports.test.ts:3–8`  
**Finding:** Test imports `LoadingState`, `ErrorState`, `EmptyState` from `"./lib"` and asserts they are exported functions. These symbols originate from prati via `export * from "prati"` in lib.ts. When prati is removed, these 4 export assertions fail.  
**Impact:** Test suite has 4 broken assertions gated on prati availability.

#### IMPL-ARCH-004 — MAJOR
**File:** `package.json:41–71`  
**Finding:** The `exports` map contains stale subpath entries: `"./theme"`, `"./theme/*"`, `"./services"`, `"./services/*"`, `"./templates"`. No corresponding source directories exist in `src/`. All point to the same bundle. These are prati-era entries that were not cleaned up.  
**Impact:** Consumers can import `"astra/theme"`, `"astra/services"`, `"astra/templates"` — all resolve to the full bundle, misleading about the package structure.

#### IMPL-ARCH-005 — MAJOR
**File:** `package.json:73–76`  
**Finding:** `"files": ["dist", "src/templates"]` — includes `src/templates` in the published package. This path does not exist in the repository. npm will silently ignore the missing path during pack, but the intent is stale.  
**Impact:** Dead configuration; indicative of prati-era residue in package manifest.

### Architecture Compliance Matrix

| Contract | Source | Status |
|----------|--------|--------|
| AppStateHandler is astra-native | Imports from prati | FAIL |
| Public entry exposes only astra surface | Re-exports all of prati | FAIL |
| MVVM layers separated (Repository/ViewModel/View) | Correct in hooks + components | PASS |
| No global state in useDataState | Local useState + mountedRef | PASS |

---

## Phase 3: Feature Compliance

### Findings

#### IMPL-FEAT-001 — CRITICAL
**File:** `src/common/repo/ApiService.ts:42`  
**Finding:** Network failure (request sent, no response received) returns `status: 500` not `status: 0 (INTERNET_ERROR)`.

Source:
```
const status = axiosError.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
```

When `axiosError.response` is `undefined` (network down, DNS failure, timeout), `undefined?.status` is `undefined`, and `undefined || 500` is `500`. The documented behavior is:

| Cause | Expected status |
|-------|-----------------|
| Network failure / no response | `0` (INTERNET_ERROR) |

`AppStateHandler.tsx:81` checks `status === HttpStatusCode.INTERNET_ERROR` (value 0). This check never triggers via ApiService because ApiService never returns 0 for network failures — it returns 500.  
**Doc reference:** `docs/raw/feature/repository.md`, README Error Normalization table.  
**Impact:** Offline detection is silently broken. Users see a generic error (mapped from 500) instead of the documented offline/internet-error state.

#### IMPL-FEAT-002 — MINOR
**File:** `src/common/repo/HttpStatusCode.ts:36`  
**Finding:** `getStatusMessage` default branch returns `literal['unknown_message']`. If the caller's `literal` map does not contain the key `unknown_message`, this returns `undefined`, not an empty string.  
**Doc reference:** `docs/raw/feature/repository.md` — "returns empty string if no match".  
**Impact:** Callers expecting `string` may receive `undefined` for unknown status codes. TypeScript typing is `string` so this is a silent type violation.

#### IMPL-FEAT-003 — MAJOR
**File:** `src/common/hooks/useDataState.ts:48`  
**Finding:** `data: response.data || null` — falsy coercion. Values `0`, `""`, `false`, `[]` all coerce to null, incorrectly indicating no data when valid falsy data was returned.  
**Should be:** `response.data ?? null` (nullish coalescing — only coerces `undefined` and `null`).  
**Doc reference:** `docs/raw/feature/use-data-state.md` — "data: Result payload; null until a successful response populates it".  
**Impact:** Features receiving valid falsy API data (numeric 0, empty string, boolean false) will show empty/fallback state instead of success.

### Feature Compliance Matrix

| Feature | Documented Behavior | Actual Behavior | Status |
|---------|---------------------|-----------------|--------|
| Network failure → status 0 | INTERNET_ERROR (0) | 500 | FAIL |
| HTTP 4xx/5xx → actual status | Correct | Correct | PASS |
| Non-axios exception → 500 | Correct | Correct | PASS |
| LOADING state preserved on re-execute | Correct | Correct | PASS |
| execute() sets LOADING first | Correct | Correct | PASS |
| mountedRef guard on unmount | Correct | Correct | PASS |
| getStatusMessage: unknown → empty string | "" | `literal['unknown_message']` (may be undefined) | FAIL |
| data: null on error | Correct | Correct | PASS |
| Falsy data preserved | Expected | Coerced to null | FAIL |

---

## Phase 4: Technical Design Compliance

### AppState Contract

| Field | Documented | Source | Status |
|-------|------------|--------|--------|
| `state` | StateType (INIT/LOADING/COMPLETED) | `StateType` enum | PASS |
| `isError` | boolean | `boolean` | PASS |
| `isSuccess` | boolean | `boolean` | PASS |
| `status` | HttpStatusCode \| StateCode | `HttpStatusCode \| StateCode` | PASS |
| `statusMessage` | string | `string` | PASS |
| `data` | T \| null | `T \| null` | PASS |
| Initial status | StateCode.IDLE (1000) | `StateCode.IDLE` | PASS |

### StateType Enum

| Value | Documented | Source | Status |
|-------|------------|--------|--------|
| INIT | 0 | 0 | PASS |
| LOADING | 1 | 1 | PASS |
| COMPLETED | 2 | 2 | PASS |

### useDataState Signature

| Aspect | Documented | Source | Status |
|--------|------------|--------|--------|
| Return type | `[appState, execute, setAppState]` | `as const` tuple | PASS |
| `customInitialState` param | `Partial<AppState<T>>`, default `{}` | `Partial<AppState<T>> = {}` | PASS |
| `options.unexpectedErrorMessage` | string | `string` | PASS |
| Concurrent calls | Last wins | Implicit (no cancellation) | PASS |
| Unmount guard | Yes (mountedRef) | Yes | PASS |

### AppStateHandler Rendering Priority

| Priority | Documented Condition | Source Condition | Status |
|----------|---------------------|------------------|--------|
| 1 | state === LOADING | `state === StateType.LOADING` | PASS |
| 2 | isError \|\| status === 0 | `isError \|\| status === HttpStatusCode.INTERNET_ERROR` | PASS (dead path — see IMPL-FEAT-001) |
| 3a | isSuccess && data !== null && emptyCondition | `isSuccess && data !== null && emptyCondition?.(data)` | PASS |
| 3b | children | `children` | PASS |
| 3c | SuccessComponent | `SuccessComponent` | PASS |
| 4 | fallback → EmptyState | `return <EmptyState />` | PASS |

---

## Phase 5: Drift Detection

### Findings

#### IMPL-DRIFT-001 — MINOR
**File:** `src/common/hooks/useDataState.ts:1`  
**Finding:** File comment reads `// src/common/hooks/useApiState.ts`. The file is `useDataState.ts`. The old name `useApiState` predates the rename to `useDataState`.  
**Impact:** Cosmetic. Confusing when navigating by comment rather than filename.

#### IMPL-DRIFT-002 — MINOR
**File:** `src/common/repo/APITypes.ts:4`  
**Finding:** Type name `ResponseSucess<T>` — typo, should be `ResponseSuccess<T>`. Propagates to:
- `src/common/repo/ApiService.ts:5` — import `ResponseSucess`
- `src/common/repo/ApiService.ts:28` — variable `responseSucess`
- `src/common/repo/ServerResponse.ts:2` — import `ResponseSucess`
- `src/common/repo/ServerResponse.ts:14` — method `getSucessInstance`  
**Impact:** Internal only (not exported), but inconsistent naming across 3 files. Typo in method name `getSucessInstance` (line 14 of ServerResponse.ts).

#### IMPL-DRIFT-003 — MINOR
**File:** `src/common/repo/ApiService.test.ts:65`  
**Finding:** Test description: `'should handle unknwon errors gracefully'` — typo "unknwon" → "unknown".  
**Impact:** Cosmetic only.

### Drift Matrix

| Area | Expected | Actual | Drift |
|------|----------|--------|-------|
| useDataState filename | useDataState.ts | useDataState.ts | None |
| useDataState file comment | useDataState.ts | useApiState.ts | DRIFT |
| ResponseSuccess type name | ResponseSuccess | ResponseSucess | DRIFT |
| getSucessInstance method | getSuccessInstance | getSucessInstance | DRIFT |
| AppStateHandler rendering priority | 4-step | 4-step | None |
| StateCode.IDLE initial status | 1000 | 1000 | None |

---

## Phase 6: Public API Audit

### Exported Surface (via `src/lib.ts`)

`src/lib.ts` exports two surfaces:
1. `export * from "prati"` — prati's full surface (LoadingState, ErrorState, EmptyState, ThemeProvider, LanguageProvider, and all other prati exports)
2. `export * from "./common"` — astra-native surface

### Astra-Native Exports (from `src/common`)

| Export | Source File | Documented | Status |
|--------|-------------|------------|--------|
| `useDataState` | hooks/useDataState.ts | Yes | PASS |
| `AppState` | state/AppState.ts | Yes | PASS |
| `StateType` | state/AppState.ts | Yes | PASS |
| `StateCode` | state/AppState.ts | Yes | PASS |
| `AppStateHandler` | components/organisms/AppStateHandler.tsx | Yes | PASS |
| `AppStateHandlerProps` | components/organisms/AppStateHandler.tsx | Yes | PASS |
| `ApiService` | repo/ApiService.ts | Yes | PASS |
| `ServerResponse` | repo/ServerResponse.ts | Yes | PASS |
| `HttpStatusCode` | repo/HttpStatusCode.ts | Yes | PASS |
| `getStatusMessage` | repo/HttpStatusCode.ts | Yes | PASS |
| `getApiService` | repo/apiServiceFactory.ts | Yes | PASS |
| `ResponseSucess` | repo/APITypes.ts | No (internal) | LEAK |
| `ResponseError` | repo/APITypes.ts | No (internal) | LEAK |

### Public API Findings

#### IMPL-API-001 — MAJOR
**Finding:** `ResponseSucess<T>` and `ResponseError` are exported through `src/common/repo/index.ts` (via `export * from './APITypes'`). These are internal implementation types — not documented as public API. `ResponseSucess` also has a typo in its name, locking that name into the public surface.

#### IMPL-API-002 — CRITICAL
**Finding:** `export * from "prati"` in lib.ts makes prati's entire surface (estimated 47+ components, ThemeProvider, LanguageProvider, and utility functions) part of astra's documented API. The README explicitly states these are NOT astra exports. The export contradicts the documented API surface.

---

## Phase 7: Type Accuracy

### Findings

#### IMPL-TYPE-001 — MAJOR
**File:** `src/common/repo/ServerResponse.ts:10`  
**Finding:** `public data?: T` — the `?` modifier means `data` is `T | undefined`, not `T | null` as documented.

`AppState<T>` interface (AppState.ts) defines `data: T | null`.

`useDataState.ts:48` bridges the mismatch with `response.data || null`, which:
- Converts `undefined` → `null` ✓
- Converts `0`, `""`, `false` → `null` ✗ (see IMPL-FEAT-003)

**Doc reference:** `docs/raw/feature/repository.md` — "data: Result payload".  
**Impact:** `ServerResponse.data` and `AppState.data` have different nullability semantics. The bridge in useDataState uses falsy coercion, not nullish coalescing.

#### IMPL-TYPE-002 — MINOR
**File:** `src/common/hooks/useDataState.test.ts:14`  
**Finding:** Test asserts initial `status: HttpStatusCode.IDLE` (deprecated, marked `@deprecated` in HttpStatusCode.ts). Should reference `StateCode.IDLE`. Both values are 1000 so the test passes, but the reference uses the deprecated type.

### Type Accuracy Matrix

| Type/Field | Documented | Source | Match |
|------------|------------|--------|-------|
| `AppState.data` | `T \| null` | `T \| null` | PASS |
| `ServerResponse.data` | Not explicitly typed in docs | `?: T` (undefined) | NOTE |
| `StateCode.IDLE` initial status | 1000 | 1000 | PASS |
| `AppStateHandlerProps.appState` | required | required | PASS |
| `AppStateHandlerProps.emptyCondition` | `(data: T) => boolean` | `(data: T) => boolean` | PASS |
| `useDataState` return | `[AppState, execute, setAppState]` | `as const` tuple | PASS |

---

## Phase 8: Dependency Audit

### Runtime Dependencies

| Dependency | Version | Role | Issue |
|------------|---------|------|-------|
| `prati` | `file:../Prati` | Re-exported UI layer | CRITICAL: local path; removed from system |
| `axios` | 1.15.0 | HTTP client | PASS |
| `react` | ^19.2.3 | UI framework | PASS |
| `react-dom` | ^19.2.3 | DOM renderer | PASS |
| `@emotion/react` | 11.13.3 | prati dep (CSS-in-JS) | MAJOR: bundled with astra but belongs to prati |
| `@emotion/styled` | 11.13.0 | prati dep | MAJOR: same |
| `@mui/material` | 7.2.0 | prati dep (MUI) | MAJOR: same |
| `@mui/icons-material` | 7.2.0 | prati dep | MAJOR: same |
| `@mui/lab` | 7.0.0-beta.14 | prati dep | MAJOR: same |
| `@mui/x-date-pickers` | 8.7.0 | prati dep | MAJOR: same |
| `@fontsource/roboto` | 5.1.0 | prati dep | MAJOR: same |
| `framer-motion` | 11.18.2 | prati dep | MAJOR: same |
| `handlebars` | 4.7.9 | prati template dep | MAJOR: same |
| `lucide-react` | 0.400.0 | prati dep | MAJOR: same |
| `react-markdown` | 10.1.0 | prati dep | MAJOR: same |
| `react-syntax-highlighter` | 16.1.1 | prati dep | MAJOR: same |
| `uuid` | 14.0.0 | prati dep | MAJOR: same |

**IMPL-DEP-001 — CRITICAL:** prati is `file:../Prati`. This is a local relative path. Consumers installing astra from GitHub will have this dependency resolved from their own machine's `../Prati` path, which does not exist. `npm install git+https://github.com/NikhilVijayakumar/astra.git` will fail at prati resolution.

**IMPL-DEP-002 — MAJOR:** 13 production dependencies are prati's dependencies, not astra's. When astra is installed, consumers inherit the entire MUI + emotion + framer-motion stack even if they only use `useDataState` and `ApiService`. For a pattern library, this is significant consumer-facing bloat.

---

## Phase 9: Technical Debt

### Findings

| ID | File | Line | Finding | Severity |
|----|------|------|---------|----------|
| IMPL-DEBT-001 | `useDataState.ts` | 1 | File comment names old file `useApiState.ts` | Minor |
| IMPL-DEBT-002 | `APITypes.ts` | 4 | `ResponseSucess` typo (3 files affected) | Minor |
| IMPL-DEBT-003 | `ApiService.ts` | 35 | `console.error` in production library code leaks to consumer consoles | Minor |
| IMPL-DEBT-004 | `HttpStatusCode.ts` | 11 | `IDLE = 1000` marked `@deprecated` but still referenced in test (line 14 of useDataState.test.ts) | Minor |
| IMPL-DEBT-005 | `lib.ts` | 1 | Comment "Re-export design system + components + localization from prati (includes template types and renderer)" describes removed feature | Minor |

---

## Phase 10: Test Integrity

### Findings

#### IMPL-TEST-001 — CRITICAL
**File:** `src/common/hooks/useDataState.test.ts:86–93`  
**Finding:** Test asserts `statusMessage: 'An unexpected error occurred.'` when an exception is thrown and no options are passed.

Source behavior:
```
statusMessage: options?.unexpectedErrorMessage ?? '',
```

With `useDataState()` called without options: `options` is `undefined`, so `options?.unexpectedErrorMessage` is `undefined`, and `undefined ?? ''` resolves to `''`.

The test asserts `'An unexpected error occurred.'` but source produces `''`. This test **fails**.

#### IMPL-TEST-002 — MINOR
**File:** `src/common/hooks/useDataState.test.ts:14`  
**Finding:** `status: HttpStatusCode.IDLE` — uses deprecated enum member. Should be `StateCode.IDLE`. Value (1000) matches so test passes, but reference is stale.

#### IMPL-TEST-003 — MINOR
**File:** `src/common/repo/ApiService.test.ts:65`  
**Finding:** No test case covers the network failure (no response) path that maps to INTERNET_ERROR. The test at line 45 simulates `response: { status: 404 }` (has a response). A test with `response: undefined` (no response) would expose IMPL-FEAT-001.

### Test Coverage Matrix

| Scenario | Tested | Correct Assertion | Status |
|----------|--------|-------------------|--------|
| useDataState initial state | Yes | Deprecated IDLE ref | WARN |
| useDataState success | Yes | Correct | PASS |
| useDataState error (HTTP) | Yes | Correct | PASS |
| useDataState exception | Yes | Wrong statusMessage | FAIL |
| useDataState LOADING transition | Yes | Correct | PASS |
| ApiService GET success | Yes | Correct | PASS |
| ApiService GET HTTP error | Yes | Correct | PASS |
| ApiService GET network failure (no response) | No | — | MISSING |
| ApiService GET non-axios error | Yes | Correct | PASS |
| AppStateHandler prati exports | Yes | Will fail without prati | FAIL |

---

## Findings Summary

### Critical (5)

| ID | File | Finding |
|----|------|---------|
| IMPL-ARCH-001 | `src/lib.ts:2` | `export * from "prati"` — entire prati surface in public API |
| IMPL-ARCH-002 | `AppStateHandler.tsx:4` | Imports LoadingState/ErrorState/EmptyState from prati |
| IMPL-ARCH-003 | `publicExports.test.ts:3-8` | 4 test assertions gated on prati availability |
| IMPL-FEAT-001 | `ApiService.ts:42` | Network failure returns 500 not INTERNET_ERROR(0) — offline check never triggers |
| IMPL-TEST-001 | `useDataState.test.ts:93` | Asserts `'An unexpected error occurred.'` but source produces `''` — test fails |

### Major (6)

| ID | File | Finding |
|----|------|---------|
| IMPL-ARCH-004 | `package.json:41–71` | Stale subpath exports: `./theme`, `./services`, `./templates` |
| IMPL-ARCH-005 | `package.json:73–76` | `"files"` includes `src/templates` (path does not exist) |
| IMPL-FEAT-003 | `useDataState.ts:48` | `response.data \|\| null` falsy coercion — converts 0/""/false to null |
| IMPL-API-001 | `repo/index.ts` | `ResponseSucess`/`ResponseError` leaked as public exports (internal types) |
| IMPL-TYPE-001 | `ServerResponse.ts:10` | `data?: T` (undefined) vs documented/expected `T \| null` |
| IMPL-DEP-001 | `package.json:92` | prati is `file:../Prati` — consumers cannot install astra remotely |

### Minor (6)

| ID | File | Finding |
|----|------|---------|
| IMPL-DRIFT-001 | `useDataState.ts:1` | File comment says `useApiState.ts` |
| IMPL-DRIFT-002 | `APITypes.ts:4` | `ResponseSucess` typo across 3 files |
| IMPL-DRIFT-003 | `ApiService.test.ts:65` | "unknwon" typo in test description |
| IMPL-FEAT-002 | `HttpStatusCode.ts:36` | `getStatusMessage` default returns `literal['unknown_message']` not empty string |
| IMPL-TYPE-002 | `useDataState.test.ts:14` | References deprecated `HttpStatusCode.IDLE` |
| IMPL-TEST-003 | `ApiService.test.ts` | No test for network failure (no response) path |

---

## Recommended Fix Priority

### P0 — Build / Install Breaking
1. **IMPL-DEP-001** — Replace `"prati": "file:../Prati"` with published package or remove dependency
2. **IMPL-ARCH-001** — Remove or scope `export * from "prati"` in lib.ts
3. **IMPL-ARCH-002** — Implement native LoadingState/ErrorState/EmptyState in astra, or accept prati as peer dependency

### P1 — Silent Bugs
4. **IMPL-FEAT-001** — Fix `ApiService.ts:42`: change `|| HttpStatusCode.INTERNAL_SERVER_ERROR` to `?? HttpStatusCode.INTERNET_ERROR` so network failures map to 0
5. **IMPL-FEAT-003** — Fix `useDataState.ts:48`: change `response.data || null` to `response.data ?? null`
6. **IMPL-TEST-001** — Fix test assertion: either pass `unexpectedErrorMessage` option in test or assert `''`

### P2 — API Surface
7. **IMPL-API-001** — Move `APITypes.ts` exports out of barrel (or add explicit re-exports excluding internal types)
8. **IMPL-ARCH-004** / **IMPL-ARCH-005** — Clean up stale package.json exports and `files` entries

### P3 — Hygiene
9. **IMPL-DRIFT-001** — Fix file comment in useDataState.ts
10. **IMPL-DRIFT-002** — Rename `ResponseSucess` → `ResponseSuccess` across APITypes.ts, ApiService.ts, ServerResponse.ts (breaking change if consumed externally)
11. **IMPL-DEBT-003** — Remove `console.error` from ApiService.ts or make it opt-in
12. **IMPL-TYPE-002** / **IMPL-TEST-002** — Update test references from `HttpStatusCode.IDLE` to `StateCode.IDLE`

---

## Invariant Verification

| Invariant | Doc Reference | Status |
|-----------|---------------|--------|
| Repositories use ApiService — never direct axios | `docs/raw/architecture/invariants/repository-isolation.md` | PASS |
| Views use AppStateHandler — no manual branching | AppStateHandler enforces this | PASS |
| ViewModels are hooks | useDataState is a function hook | PASS |
| One useDataState per async operation | No constraint violation found | PASS |
| ApiService never throws | All paths return ServerResponse | PASS |
| execute() drops response after unmount | mountedRef guard present | PASS |
| LOADING preserves previous data | `...prev` spread in setAppState | PASS |
| No separate ERROR state in StateType | INIT/LOADING/COMPLETED only | PASS |
| Prati separation (if prati removed) | AppStateHandler + lib.ts both import prati | FAIL |
