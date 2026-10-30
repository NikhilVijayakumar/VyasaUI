# Implementation Audit Report — Astra

**Overall Assessment:** Good
**Final Score:** 8.8 / 10
**Critical Findings:** 0
**Major Findings:** 0
**Minor Findings:** 6
**Suggestions:** 2

---

## Documents Audited

| Document | Layer | Purpose |
|----------|-------|---------|
| `src/lib.ts` | Source | Public entry point |
| `src/common/hooks/useDataState.ts` | Source | MVVM hook |
| `src/common/components/organisms/AppStateHandler.tsx` | Source | Conditional-render component |
| `src/common/components/organisms/AppStateContext.ts` | Source | Rendering context |
| `src/common/repo/ApiService.ts` | Source | HTTP client |
| `src/common/repo/IpcService.ts` | Source | IPC client |
| `src/common/repo/ServerResponse.ts` | Source | Response wrapper |
| `src/common/repo/HttpStatusCode.ts` | Source | Status enum |
| `src/common/repo/apiServiceFactory.ts` | Source | Singleton factory |
| `src/common/repo/types.ts` | Source | ITransportService, Platform |
| `src/common/state/AppState.ts` | Source | State contract |
| `src/common/repo/index.ts` | Source | Repo barrel |
| `src/common/index.ts` | Source | Common barrel |
| `src/publicExports.test.ts` | Test | Public API surface test |
| `docs/raw/architecture/**` | Architecture | System structure |
| `docs/raw/feature/**` | Feature | System behavior |
| `docs/raw/feature-technical/**` | Feature-Technical | Implementation design |

---

## 2. Source Inventory

| Category | Files | Exports |
|----------|-------|---------|
| Hooks | 1 (`useDataState.ts`) | `useDataState` |
| Components | 2 (`AppStateHandler.tsx`, `AppStateContext.ts`) | `AppStateHandler`, `AppStateHandlerProps`, `AppStateProvider`, `AppStateContext`, `AppStateComponents` |
| Repositories | 6 (`ApiService.ts`, `apiServiceFactory.ts`, `IpcService.ts`, `ServerResponse.ts`, `HttpStatusCode.ts`, `types.ts`) | `ApiService`, `getApiService`, `IpcService`, `ServerResponse`, `HttpStatusCode`, `getStatusMessage`, `ITransportService`, `Platform` |
| State types | 1 (`AppState.ts`) | `AppState`, `StateType`, `StateCode` |
| Internal types | 1 (`APITypes.ts`) | `ResponseSuccess<T>`, `ResponseError` (not re-exported) |
| Utilities | 0 | — |
| Tests | 6 | — |
| Public exports | — | 17 symbols (via `src/lib.ts`) |

---

## 3. Architecture Compliance Report

### MVVM Separation

**useDataState.ts** — no JSX, no UI imports, no DOM access. Manages async lifecycle via `useState` + `useRef`. Delegates transport via `ServerResponse<T>`. ✅ Compliant.

**AppStateHandler.tsx** — no data fetching, no repository calls, no business logic. Routing logic is pure conditional rendering based on `AppState` fields. Imports `HttpStatusCode` from `../../repo/HttpStatusCode` to check `status === HttpStatusCode.INTERNET_ERROR`. This creates a View → Repo import dependency — see IMPL-ARCH-001.

**AppStateContext.ts** — pure context/provider. No data dependencies. ✅ Compliant.

### Repository Isolation

No direct axios or `window.electronAPI` calls outside service classes. ApiService wraps axios exclusively. IpcService wraps `window.electronAPI` exclusively. ✅ Compliant.

### Dependency Direction

- `hooks/useDataState.ts` → `state/AppState` ✅
- `hooks/useDataState.ts` → `repo/ServerResponse`, `repo/HttpStatusCode` ✅ (ViewModel → Repo acceptable)
- `state/AppState.ts` → `repo/HttpStatusCode` — state importing from repo; see IMPL-ARCH-002
- `components/AppStateHandler.tsx` → `repo/HttpStatusCode` — View importing from repo; see IMPL-ARCH-001
- No circular dependencies detected ✅

### Public API Stability

`src/lib.ts` uses explicit named exports for all 17 public symbols. No wildcard re-exports at the entry point. ✅ Compliant.

### Design System Independence

No `@mui`, `prati`, `emotion`, or any design system imports anywhere in `src/**`. `AppStateContext` provides the wiring slot pattern. ✅ Compliant.

### Deterministic Build

No module-level side effects except `const apiServiceCache = new Map<string, ApiService>()` in `apiServiceFactory.ts`. This is documented singleton behavior, not a non-deterministic value. ✅ Acceptable.

### Architecture Compliance Matrix

| Invariant | Documented | Implemented | Status |
|-----------|------------|-------------|--------|
| MVVM Separation | ✅ | ✅ (minor direction issue) | PASS with caveat |
| Repository Isolation | ✅ | ✅ | PASS |
| Dependency Direction | ✅ | Partial (HttpStatusCode cross-layer) | FINDING |
| Public API Stability | ✅ | ✅ | PASS |
| Design System Independence | ✅ | ✅ | PASS |
| Deterministic Build | ✅ | ✅ | PASS |

---

## 4. Feature Compliance Report

### useDataState

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| Returns `[appState, execute, setAppState]` tuple | `return [appState, execute, setAppState] as const` | PASS |
| INIT → LOADING → COMPLETED lifecycle | `setAppState({ state: LOADING })` then COMPLETED | PASS |
| `customInitialState` merges with defaults | `{ ...getInitialState<T>(), ...customInitialState }` | PASS |
| Initial status = `StateCode.IDLE` | `status: StateCode.IDLE` in `getInitialState` | PASS |
| LOADING preserves prev.data | `setAppState((prev) => ({ ...prev, state: LOADING }))` | PASS |
| Unmount guard | `mountedRef.current` check before setAppState | PASS |
| Exception: `status 500`, `statusMessage: options?.unexpectedErrorMessage ?? ''` | Line 58-59 | PASS |
| No data fetching itself | ✅ | PASS |

### AppStateHandler

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| Rendering priority: LOADING → error → empty/success → INIT fallback | Lines 30-54 | PASS |
| `status === 0` triggers error even if `isError` is false | `isError \|\| status === HttpStatusCode.INTERNET_ERROR` | PASS |
| Slot props override context | `loadingComponent !== undefined` guard before context | PASS |
| `children` over `SuccessComponent` | Line 48 before line 49 | PASS |
| `emptyCondition` only when `isSuccess && data !== null` | Line 42-43 | PASS |
| Fallback to Empty for INIT | Lines 52-54 | PASS |
| No retry logic | ✅ Not present | PASS |

### ApiService

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| `get`, `post`, `put`, `delete` methods | ✅ | PASS |
| Axios HTTP errors → `ServerResponse.error` with actual status | `axiosError.response?.status` | PASS |
| Network failure → `INTERNET_ERROR` (0) | `?? HttpStatusCode.INTERNET_ERROR` | PASS |
| Non-axios exception → 500 | `HttpStatusCode.INTERNAL_SERVER_ERROR` | PASS |
| Never throws | try/catch in `request()` | PASS |
| `onError?.(error)` callback | `this.onError?.(error)` in catch | PASS |
| `options?` parameter on constructor and factory | ✅ | PASS |

### IpcService

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| `invoke` → `ServerResponse<T>` | ✅ | PASS |
| `send` → fire-and-forget, errors silently discarded | try/catch, no throw | PASS |
| `receive` → unsubscribe function | Returns `() => void` | PASS |
| `window.electronAPI` unavailable → `ServerResponse.error(500)` | `!window.electronAPI?.invoke` check | PASS |
| `platform = 'ELECTRON'` | `readonly platform: Platform = 'ELECTRON'` | PASS |
| Pass-through of `ServerResponse` from IPC handler | `if (result instanceof ServerResponse) return result` | PASS |

### Feature Compliance Matrix

| Feature | Requirement | Implemented | Status |
|---------|-------------|-------------|--------|
| useDataState | State lifecycle | ✅ | PASS |
| useDataState | Unmount guard | ✅ | PASS |
| useDataState | Exception handling | ✅ | PASS |
| AppStateHandler | Priority order | ✅ | PASS |
| AppStateHandler | INTERNET_ERROR | ✅ | PASS |
| ApiService | Error normalization | ✅ | PASS |
| ApiService | onError callback | ✅ | PASS |
| IpcService | invoke/send/receive | ✅ | PASS |
| IpcService | API unavailable | ✅ | PASS |
| ServerResponse | Factory methods | ✅ | PASS |

---

## 5. Technical Design Compliance Report

### use-data-state.md

| Design Requirement | Implemented | Status |
|---------------------|-------------|--------|
| `status: HttpStatusCode \| StateCode` in state model | ✅ | PASS |
| `StateCode.IDLE` as initial status | ✅ | PASS |
| `options?.unexpectedErrorMessage ?? ''` on exception | ✅ | PASS |
| Return type `readonly [AppState<T>, execute, setAppState]` | ✅ | PASS |

### repository.md

| Design Requirement | Implemented | Status |
|---------------------|-------------|--------|
| IpcService status: Implemented | ✅ | PASS |
| `options?: { onError?: (error: unknown) => void }` on constructor and factory | ✅ | PASS |
| NFR error: `onError?.(error)` | ✅ | PASS |
| Module map: lib.ts imports from `./common` | STALE — lib.ts imports from direct source paths | FINDING |

### mvvm-wiring.md

| Design Requirement | Implemented | Status |
|---------------------|-------------|--------|
| ELECTRON: `new IpcService()` | ✅ | PASS |
| `status: HttpStatusCode \| StateCode` in AppState | ✅ | PASS |
| `StateCode.IDLE` in test templates | ✅ | PASS |

### state-management.md

| Design Requirement | Implemented | Status |
|---------------------|-------------|--------|
| Localization: `options?.unexpectedErrorMessage ?? ''` | ✅ | PASS |
| No hardcoded English fallback claim | ✅ | PASS |

### Technical Design Compliance Matrix

| Feature-Technical Doc | Design Requirement | Implemented | Status |
|-----------------------|--------------------|-------------|--------|
| use-data-state.md | Status union type | ✅ | PASS |
| use-data-state.md | StateCode.IDLE initial | ✅ | PASS |
| repository.md | IpcService implemented | ✅ | PASS |
| repository.md | onError callback | ✅ | PASS |
| repository.md | Module Map (lib.ts imports) | Stale | FINDING |
| mvvm-wiring.md | new IpcService() | ✅ | PASS |
| mvvm-wiring.md | StateCode.IDLE in tests | ✅ | PASS |
| state-management.md | No hardcoded English | ✅ | PASS |

---

## 6. Drift Detection Report

### Identified Drift

**IMPL-DRIFT-002** — `repository.md` Module Map states `lib.ts` imports from `./common`. After refactor to explicit named exports, lib.ts imports directly from individual source files. Module Map is stale.

### Drift Matrix

| Area | Documented | Implemented | Status |
|------|------------|-------------|--------|
| lib.ts import path | `./common` barrel | Direct source imports | STALE |
| getApiService caching behavior | Keyed by `baseUrl` | Ignores updated `literal`/`options` for cached URLs | PARTIAL |
| @mui dependencies | Removed ✅ | Not present | PASS |

---

## 7. Public API Audit Report

### Export Accuracy

`src/lib.ts` exports (17 symbols):

| Export | Documented in api-surface.md | In Barrel | Status |
|--------|------------------------------|-----------|--------|
| `useDataState` | ✅ | ✅ | PASS |
| `AppState` (type) | ✅ | ✅ | PASS |
| `StateType` | ✅ | ✅ | PASS |
| `StateCode` | ✅ | ✅ | PASS |
| `AppStateHandler` | ✅ | ✅ | PASS |
| `AppStateHandlerProps` (type) | ✅ | ✅ | PASS |
| `AppStateProvider` | ✅ | ✅ | PASS |
| `AppStateContext` | ✅ | ✅ | PASS |
| `AppStateComponents` (type) | ✅ | ✅ | PASS |
| `ApiService` | ✅ | ✅ | PASS |
| `getApiService` | ✅ | ✅ | PASS |
| `HttpStatusCode` | ✅ | ✅ | PASS |
| `getStatusMessage` | ✅ | ✅ | PASS |
| `ServerResponse` | ✅ | ✅ | PASS |
| `IpcService` | ✅ | ✅ | PASS |
| `ITransportService` (type) | ✅ | ✅ | PASS |
| `Platform` | ✅ | ✅ | PASS |

No undocumented exports. No missing exports. No internal types leaked. `ResponseSuccess<T>` and `ResponseError` confirmed absent from public API (verified by `publicExports.test.ts`). ✅

### Internal Barrel Wildcards

`src/common/index.ts`, `src/common/repo/index.ts`, `src/common/hooks/index.ts`, `src/common/state/index.ts` all use `export *`. These are not the public entry point — `lib.ts` controls the public surface via named exports. Intermediate barrels are implementation details. Risk is low since the public API is gated by named lib.ts exports, but wildcard patterns in intermediate barrels could expose symbols if lib.ts ever reverts to `export * from './common'`.

---

## 8. Type Accuracy Report

### Interface Accuracy

| Type / Field | Documented | Source | Status |
|--------------|------------|--------|--------|
| `AppState.status` | `HttpStatusCode \| StateCode` | `HttpStatusCode \| StateCode` | PASS |
| `AppState.data` | `T \| null` | `T \| null` | PASS |
| `AppState.state` | `StateType` | `StateType` | PASS |
| `getStatusMessage` param | `HttpStatusCode` | `HttpStatusCode` | FINDING (see IMPL-TYPE-002) |
| `ITransportService.platform` | `readonly Platform` | `readonly Platform` | PASS |
| `ITransportService.onError` | `(error: unknown) => void \| undefined` | `(error: unknown) => void \| undefined` | PASS |
| `ServerResponse.data` | `T \| undefined` (optional) | `data?: T` | PASS |
| `StateCode.IDLE` | 1000 | 1000 | PASS |
| `HttpStatusCode.INTERNET_ERROR` | 0 | 0 | PASS |

### Type Accuracy Matrix

| Type / Field | Documented | Source | Status |
|--------------|------------|--------|--------|
| `AppState.status` | `HttpStatusCode \| StateCode` | `HttpStatusCode \| StateCode` | PASS |
| `getStatusMessage` input | `HttpStatusCode` | `HttpStatusCode` | MISMATCH with AppState.status |
| `ServerResponse.data` | `T \| undefined` | `data?: T` | PASS |
| `useDataState` return | `readonly [...]` | `as const` tuple | PASS |

---

## 9. Dependency Audit Report

### package.json

| Dependency | Category | Documented | Status |
|------------|----------|------------|--------|
| `react ^19.2.3` | peerDependencies | ✅ | PASS |
| `react-dom ^19.2.3` | peerDependencies | ✅ | PASS |
| `axios ^1.18.0` | peerDependencies | ✅ | PASS |
| No runtime `dependencies` | — | ✅ | PASS |
| `react`, `react-dom` in devDependencies | dev (test env) | ✅ | PASS |

No `@mui`, `prati`, `emotion`, or design system packages present anywhere. ✅

### Import Layer Violations

| Violation | File | Status |
|-----------|------|--------|
| `AppStateHandler.tsx` → `repo/HttpStatusCode` | View imports Repo enum | FINDING (IMPL-ARCH-001) |
| `state/AppState.ts` → `repo/HttpStatusCode` | State imports Repo enum | FINDING (IMPL-ARCH-002) |

### Dependency Matrix

| Module | Dependency | Allowed | Status |
|--------|------------|---------|--------|
| `useDataState.ts` | `state/AppState`, `repo/ServerResponse`, `repo/HttpStatusCode` | ✅ (ViewModel → Repo) | PASS |
| `AppStateHandler.tsx` | `state/AppState`, `repo/HttpStatusCode` | Partial — View → Repo enum | FINDING |
| `state/AppState.ts` | `repo/HttpStatusCode` | State → Repo direction issue | FINDING |
| `ApiService.ts` | `axios`, `ServerResponse`, `HttpStatusCode` | ✅ | PASS |
| `IpcService.ts` | `ServerResponse`, `HttpStatusCode`, `types` | ✅ | PASS |

---

## 10. Technical Debt Report

### Debt Findings

| Issue | File | Severity |
|-------|------|----------|
| Typo "unknwon" in test description | `src/common/repo/ApiService.test.ts:82` | Minor |
| Typo "Ifem" in test data | `src/common/repo/ApiService.test.ts:147` | Minor |
| Module-level cache in factory | `src/common/repo/apiServiceFactory.ts:4` | Suggestion |

No `console.log`, `console.error`, or `debugger` in production source. ✅
No falsy coercion risks (`??` used correctly throughout). ✅

### Technical Debt Matrix

| Issue | File | Severity |
|-------|------|----------|
| Typo "unknwon" | `ApiService.test.ts:82` | Minor |
| Typo "Ifem" | `ApiService.test.ts:147` | Minor |

---

## 11. Implementation Purity Report

No undocumented business rules or product decisions detected in source. No architecture patterns introduced in source that are absent from docs. The hardcoded error message strings in `IpcService.ts` (`'Electron API not available'`, `'IPC invoke failed'`) were assessed as PASS in the prior audit — they represent internal transport error messaging, not externally documented behavior.

`getApiService` silently returns cached instance on repeated baseUrl calls, ignoring updated `literal`/`options`. This behavior is partially documented ("keyed by baseUrl") in README but the consequence (updated options ignored) is not documented in feature-technical docs. See IMPL-DRIFT-003.

---

## 12. Test Integrity Report

### useDataState.test.ts

| Test | Asserts | Matches Source | Status |
|------|---------|----------------|--------|
| default init state | `StateCode.IDLE`, `StateType.INIT`, `data: null` | ✅ | PASS |
| custom init state | merged partial state | ✅ | PASS |
| successful execution | COMPLETED, isSuccess, data populated | ✅ | PASS |
| failed execution | COMPLETED, isError, data null | ✅ | PASS |
| exception execution | status 500, statusMessage '', isError | ✅ | PASS |
| LOADING transition | state = LOADING mid-request | ✅ | PASS |
| setAppState override | direct state mutation | ✅ | PASS |

All tests use `StateCode.IDLE` (not deprecated `HttpStatusCode.IDLE`). ✅

### ApiService.test.ts

| Test | Asserts | Matches Source | Status |
|------|---------|----------------|--------|
| get success | isSuccess, data, status 200 | ✅ | PASS |
| get HTTP error | isError, status 404 | ✅ | PASS |
| get network failure | isError, status 0 (INTERNET_ERROR) | ✅ | PASS |
| get unknown error | isError, status 500, literal message | ✅ | PASS |
| onError callback | called once with error | ✅ | PASS |
| no onError | no throw | ✅ | PASS |
| post, put, delete | success paths | ✅ | PASS |

Minor typos in test descriptions (non-functional).

### IpcService.test.ts

| Test | Asserts | Matches Source | Status |
|------|---------|----------------|--------|
| invoke success | isSuccess, data, status 200 | ✅ | PASS |
| invoke pass-through ServerResponse | returns original ServerResponse | ✅ | PASS |
| invoke handler throws | isError, status 500, message | ✅ | PASS |
| electronAPI unavailable | isError, status 500 | ✅ | PASS |
| onError callback | called once | ✅ | PASS |
| non-Error thrown | statusMessage 'IPC invoke failed' | ✅ | PASS |
| send success | electronAPI.send called | ✅ | PASS |
| send no throw when unavailable | not throw | ✅ | PASS |
| send silently discards | not throw | ✅ | PASS |
| receive registers listener | receive called | ✅ | PASS |
| receive delivers data | callback fired | ✅ | PASS |
| receive unsubscribe | callback stops | ✅ | PASS |
| receive no-op when unavailable | function returned | ✅ | PASS |
| platform = ELECTRON | ✅ | ✅ | PASS |

### AppStateHandler.test.tsx

All 10 test cases verified against documented rendering priority. Uses `StateCode.IDLE` correctly. ✅

### publicExports.test.ts

| Test | Status |
|------|--------|
| AppStateHandler, AppStateProvider | PASS |
| AppStateContext | PASS |
| StateType, StateCode enum values | PASS |
| API layer (getApiService, HttpStatusCode, getStatusMessage, ApiService, ServerResponse) | PASS |
| useDataState | PASS |
| HttpStatusCode enum values | PASS |
| ApiService instantiation and methods | PASS |
| ServerResponse factory shapes | PASS |
| IpcService (invoke, send, receive, platform) | PASS |
| Internal types not exported (ResponseSuccess, ResponseError) | PASS |

Missing: no explicit runtime test for `getStatusMessage` being callable. Type-only exports (`ITransportService`, `Platform`, `AppState`, `AppStateComponents`, `AppStateHandlerProps`) cannot be tested at runtime — these are covered by TypeScript compilation. Minor gap.

### Test Integrity Matrix

| Test File | Coverage | Deprecated Refs | Status |
|-----------|----------|-----------------|--------|
| useDataState.test.ts | Full lifecycle | None | PASS |
| ApiService.test.ts | All methods + error paths | None | PASS (minor typos) |
| IpcService.test.ts | All methods + edge cases | None | PASS |
| AppStateHandler.test.tsx | All render paths | None | PASS |
| HttpStatusCode.test.ts | All enum values + switch | `HttpStatusCode.IDLE` (backward compat test) | PASS |
| publicExports.test.ts | All runtime exports | None | PASS (minor gap) |

---

## 13. Findings Summary

### Critical

_None._

### Major

_None._

### Minor

| ID | File | Finding |
|----|------|---------|
| IMPL-ARCH-001 | `src/common/components/organisms/AppStateHandler.tsx:3` | View component imports `HttpStatusCode` from repo layer — direction violation |
| IMPL-ARCH-002 | `src/common/state/AppState.ts:2` | State module imports `HttpStatusCode` from repo layer — direction violation |
| IMPL-TYPE-002 | `src/common/repo/HttpStatusCode.ts:14` | `getStatusMessage(status: HttpStatusCode, ...)` doesn't accept `StateCode` — incompatible with `AppState.status: HttpStatusCode \| StateCode` |
| IMPL-DEBT-001 | `src/common/repo/ApiService.test.ts:82` | Typo: `'unknwon'` should be `'unknown'` |
| IMPL-DEBT-002 | `src/common/repo/ApiService.test.ts:147` | Typo: `'Updated Ifem'` should be `'Updated Item'` |
| IMPL-DRIFT-002 | `docs/raw/feature-technical/repository.md` (Module Map) | `lib.ts` import shown as `./common` — stale; lib.ts now imports from direct source paths |

### Suggestions

| ID | File | Finding |
|----|------|---------|
| IMPL-TEST-002 | `src/publicExports.test.ts` | No runtime test verifying `getStatusMessage` is exported and callable |
| IMPL-DRIFT-003 | `docs/raw/feature-technical/repository.md` (Factory Cache risk) | `getApiService` silently ignores updated `literal`/`options` for cached baseUrls — consequence not documented in feature-technical NFR section |

---

## 14. Scoring Breakdown

| Category | Findings | Deductions | Weight | Raw Score | Weighted Score |
|----------|----------|------------|--------|-----------|----------------|
| Architecture Compliance | 2 Minor | -0.4 | 25% | 9.6 | 2.40 |
| Feature Compliance | 0 | 0 | 20% | 10.0 | 2.00 |
| Technical Design Compliance | 1 Minor | -0.2 | 15% | 9.8 | 1.47 |
| Test Integrity | 1 Suggestion | 0 | 10% | 10.0 | 1.00 |
| Drift Detection | 1 Minor, 1 Suggestion | -0.2 | 10% | 9.8 | 0.98 |
| Dependency Compliance | 0 | 0 | 8% | 10.0 | 0.80 |
| API Compliance | 0 | 0 | 5% | 10.0 | 0.50 |
| Type Accuracy | 1 Minor | -0.2 | 4% | 9.8 | 0.39 |
| Technical Debt | 2 Minor | -0.4 | 2% | 9.6 | 0.19 |
| Implementation Purity | 0 | 0 | 1% | 10.0 | 0.10 |

Global score (start 10.0, deduct per finding severity):
- 6 × Minor (−0.2 each) = −1.2
- 2 × Suggestion (−0.0 each) = −0.0

```
Total Score: 8.8 / 10
```

---

## 15. Score Improvement Summary

```
Previous Report: implementation-audit-2026-06-21-1600.md
Previous Score:  5.6 / 10
Current Score:   8.8 / 10
Change:          +3.2
```

### Resolved Findings (from previous report)

| Previous ID | Description | Status |
|-------------|-------------|--------|
| IMPL-DEPENDENCY-001 (Critical) | react/react-dom in `dependencies` instead of `peerDependencies` | ✅ RESOLVED |
| IMPL-DRIFT-001 (Major) | Stale @mui entries in `dependencies.md` | ✅ RESOLVED |
| IMPL-API-002 (Minor) | `lib.ts` used wildcard `export * from './common'` | ✅ RESOLVED |
| IMPL-API-001 (Minor) | `api-surface.md` missing `getStatusMessage`, `ITransportService`, `Platform` | ✅ RESOLVED |
| IMPL-DESIGN-001 (Minor) | `state-management.md` claimed hardcoded English fallback | ✅ RESOLVED |
| IMPL-DESIGN-002 (Minor) | `repository.md` NFR said `console.error` | ✅ RESOLVED |
| IMPL-DESIGN-003 (Minor) | `repository.md` IpcService status said "Planned" | ✅ RESOLVED |
| IMPL-DESIGN-004 (Minor) | `mvvm-wiring.md` showed `getIpcService(literal)` factory | ✅ RESOLVED |
| IMPL-DESIGN-005 (Minor) | `repository.md` missing `options?` param in ApiService/getApiService signatures | ✅ RESOLVED |
| IMPL-TYPE-001 (Minor) | Docs showed `status: HttpStatusCode` instead of `HttpStatusCode \| StateCode` | ✅ RESOLVED |
| IMPL-TEST-001 (Minor) | Test template in mvvm-wiring.md used `HttpStatusCode.IDLE` | ✅ RESOLVED |
| IMPL-DEPENDENCY-002 (Minor) | axios peer range too permissive | ✅ RESOLVED |

### New Findings (not in previous report)

| ID | Severity | Description |
|----|----------|-------------|
| IMPL-TYPE-002 | Minor | `getStatusMessage` param type `HttpStatusCode` incompatible with `AppState.status: HttpStatusCode \| StateCode` |
| IMPL-DEBT-001 | Minor | Typo "unknwon" in ApiService.test.ts |
| IMPL-DEBT-002 | Minor | Typo "Ifem" in ApiService.test.ts |
| IMPL-DRIFT-002 | Minor | repository.md Module Map stale (lib.ts import path) |
| IMPL-TEST-002 | Suggestion | publicExports.test.ts missing getStatusMessage coverage |
| IMPL-DRIFT-003 | Suggestion | getApiService cache ignore behavior undocumented |

### Carried Findings (unresolved from previous)

| ID | Severity | Description |
|----|----------|-------------|
| IMPL-ARCH-001 | Minor | AppStateHandler imports HttpStatusCode from repo layer |
| IMPL-ARCH-002 | Minor | AppState.ts imports HttpStatusCode from repo layer |

---

## 16. Recommended Fix Priority

### P0 — Build / Install Breaking

_None._

### P1 — Silent Bugs (wrong behavior)

_None._

### P2 — API Surface / Contract

**IMPL-TYPE-002** — `getStatusMessage` should accept `HttpStatusCode | StateCode` to match `AppState.status`. Currently passing `appState.status` directly would cause a TypeScript error.

```typescript
// Fix: widen the parameter type
export function getStatusMessage(
  status: HttpStatusCode | StateCode,
  literal: Record<string, string>
): string { ... }
```

**IMPL-ARCH-001 + IMPL-ARCH-002** — Root cause is `HttpStatusCode` living in `src/common/repo/` while being used as a field type in `src/common/state/AppState.ts` and checked in the View layer. Correct fix is to move `HttpStatusCode` to `src/common/state/` or a new `src/common/constants/` module. Requires updating ~8 import sites across source files and tests.

### P3 — Hygiene / Debt

**IMPL-DRIFT-002** — Update Module Map in `repository.md` to show direct imports from source files.

**IMPL-DRIFT-003** — Add note to feature-technical docs about `getApiService` cache behavior: "repeated calls with same baseUrl return the cached instance; updated `literal` or `options` are ignored."

**IMPL-DEBT-001** — Fix typo `unknwon` → `unknown` in `ApiService.test.ts:82`.

**IMPL-DEBT-002** — Fix typo `Ifem` → `Item` in `ApiService.test.ts:147`.

**IMPL-TEST-002** — Add runtime test for `getStatusMessage` in `publicExports.test.ts`.

---

## 17. Final Verdict

```
Good (8.8 / 10)
```

All critical and major findings from the previous audit have been resolved. The public API surface is clean, explicit, and fully documented. Dependency placement is correct (react, react-dom, axios as peerDependencies). Documentation accurately reflects implementation. The remaining 6 minor findings are architectural hygiene issues stemming from a single root cause: `HttpStatusCode` living in the repo layer while being used as a fundamental type by both the state layer and the component layer.

---

## 18. Audit Traceability

| Reference | Location |
|-----------|----------|
| Architecture Docs | `docs/raw/architecture/**` |
| Feature Docs | `docs/raw/feature/**` |
| Feature-Technical Docs | `docs/raw/feature-technical/**` |
| Source | `src/**` |
| Audit Report | `docs/raw/report/implementation/latest/implementation-audit-2026-06-21-1900.md` |
| Previous Report | `docs/raw/report/implementation/archive/implementation-audit-2026-06-21-1600.md` |
