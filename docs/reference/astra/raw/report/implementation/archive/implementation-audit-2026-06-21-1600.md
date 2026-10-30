# Implementation Audit Report — Astra

**Version:** 1.1.1
**Audit Date:** 2026-06-21
**Report ID:** IMPL-AUDIT-2026-06-21-1600

---

## 1. Executive Summary

```
Overall Assessment:  Needs Improvement
Final Score:         5.6 / 10
Critical Findings:   1
Major Findings:      1
Minor Findings:      12
Suggestions:         3
```

| Document | Layer | Purpose |
|----------|-------|---------|
| `src/lib.ts` | Source | Public entry point |
| `src/common/hooks/useDataState.ts` | Source | MVVM hook |
| `src/common/state/AppState.ts` | Source | State contract |
| `src/common/components/organisms/AppStateHandler.tsx` | Source | Conditional-render component |
| `src/common/components/organisms/AppStateContext.ts` | Source | Rendering context + provider |
| `src/common/repo/ApiService.ts` | Source | HTTP client (WEB) |
| `src/common/repo/IpcService.ts` | Source | IPC client (ELECTRON) |
| `src/common/repo/types.ts` | Source | ITransportService + Platform types |
| `src/common/repo/ServerResponse.ts` | Source | Response wrapper |
| `src/common/repo/HttpStatusCode.ts` | Source | Status enum + getStatusMessage |
| `src/common/repo/apiServiceFactory.ts` | Source | Singleton factory |
| `src/common/repo/APITypes.ts` | Source | Internal types (not exported) |
| `src/common/repo/index.ts` | Source | Repo barrel |
| `src/common/hooks/index.ts` | Source | Hooks barrel |
| `src/common/state/index.ts` | Source | State barrel |
| `src/common/components/organisms/index.ts` | Source | Organisms barrel |
| `src/common/index.ts` | Source | Common barrel |
| `src/publicExports.test.ts` | Source | Root export surface tests |
| `src/common/repo/ApiService.test.ts` | Source | ApiService tests |
| `src/common/repo/IpcService.test.ts` | Source | IpcService tests |
| `src/common/hooks/useDataState.test.ts` | Source | Hook tests |
| `src/common/components/organisms/AppStateHandler.test.tsx` | Source | Component tests |
| `src/common/repo/HttpStatusCode.test.ts` | Source | HttpStatusCode tests |
| `package.json` | Source | Package manifest |
| `docs/raw/architecture/invariants/**` | Architecture | System invariants |
| `docs/raw/architecture/core/**` | Architecture | Patterns, API surface, dependencies |
| `docs/raw/feature/**` | Feature | System behavior |
| `docs/raw/feature-technical/**` | Feature-Technical | Implementation design |
| `README.md` | Public Contract | User-facing documentation |

---

## 2. Source Inventory

| Category | Files | Exports |
|----------|-------|---------|
| Hooks | 1 (`useDataState.ts`) | `useDataState` |
| Components | 2 (`AppStateHandler.tsx`, `AppStateContext.ts`) | `AppStateHandler`, `AppStateHandlerProps`, `AppStateProvider`, `AppStateContext`, `AppStateComponents` |
| Repositories/Services | 4 (`ApiService.ts`, `IpcService.ts`, `apiServiceFactory.ts`, `types.ts`) | `ApiService`, `IpcService`, `getApiService`, `ITransportService`, `Platform` |
| State types | 1 (`AppState.ts`) | `AppState`, `StateType`, `StateCode` |
| Utilities | 2 (`ServerResponse.ts`, `HttpStatusCode.ts`) | `ServerResponse`, `HttpStatusCode`, `getStatusMessage` |
| Internal types | 1 (`APITypes.ts`) | none (not barrel-exported) |
| Tests | 6 | — |
| Public exports (via lib.ts) | — | 17 symbols |

### Barrel Chain

```
src/lib.ts (export * from "./common")
  → src/common/index.ts
      → src/common/hooks/index.ts         (useDataState)
      → src/common/state/index.ts         (AppState, StateType, StateCode)
      → src/common/components/organisms/index.ts
                                           (AppStateHandler, AppStateHandlerProps,
                                            AppStateProvider, AppStateContext, AppStateComponents)
      → src/common/repo/index.ts          (ApiService, getApiService, HttpStatusCode,
                                            getStatusMessage, ServerResponse,
                                            Platform, ITransportService, IpcService)
```

### Test Coverage Summary

| Test File | Tests | Features Covered |
|-----------|-------|-----------------|
| `useDataState.test.ts` | 7 | init, custom init, success, error, exception, LOADING transition, setAppState override |
| `AppStateHandler.test.tsx` | 10 | loading-context, loading-slot, error-context, error-slot, INTERNET_ERROR, success, empty, INIT fallback, children-priority, null return |
| `ApiService.test.ts` | 7 | GET success, HTTP error, network failure, unknown error, onError callback, POST, PUT, DELETE |
| `IpcService.test.ts` | 14 | invoke success/error/throw, ServerResponse passthrough, onError callback, non-Error throw, send, unavailable electronAPI, receive lifecycle |
| `HttpStatusCode.test.ts` | 3 | enum values, all status message mappings, unknown code |
| `publicExports.test.ts` | 10 | all public exports verified, IpcService, no internal leakage |

**Total: 51 tests across 6 test files.**

---

## 3. Architecture Compliance Report

### MVVM Separation

| Invariant Check | Status |
|-----------------|--------|
| `AppStateHandler` (View) never accesses Repository services | PASS |
| `useDataState` (ViewModel) never imports UI components | PASS |
| View receives data only via props | PASS |
| No business logic in View layer | PASS |
| `IpcService` has no UI imports | PASS |

**Finding:** IMPL-ARCH-001 (Minor) — `AppStateHandler.tsx` imports `HttpStatusCode` from `../../repo/HttpStatusCode`. The `mvvm-separation.md` invariant states "import direction: hooks→state; hooks→repo; components→state; components→repo never". The import is a type/enum (not a service class), but strictly violates the documented direction rule.

**Finding:** IMPL-ARCH-002 (Minor) — `AppState.ts` (state layer) imports `HttpStatusCode` from `../repo/HttpStatusCode`. The `HttpStatusCode` enum is shared across both layers and arguably should live in a neutral `types/` or `state/` location.

### Architecture Compliance Matrix

| Invariant | Documented | Implemented | Status |
|-----------|------------|-------------|--------|
| MVVM Separation | Yes | Yes (with direction caveat) | MINOR |
| Repository Isolation | Yes | Yes | PASS |
| Dependency Direction | components→repo: never | AppStateHandler imports HttpStatusCode from repo | MINOR |
| Public API Stability | Barrel via lib.ts | wildcard re-exports | MINOR |
| Platform Neutrality | No window/process/fs in core | IpcService uses window.electronAPI (intended) | PASS |
| Design System Independence | No design system imports | None present | PASS |
| Deterministic Build | No module-level side effects | apiServiceCache Map is stable, keyed by string | PASS |

---

## 4. Feature Compliance Report

### useDataState

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| `[appState, execute, setAppState]` tuple return | Yes | PASS |
| INIT → LOADING → COMPLETED transitions | Yes | PASS |
| LOADING preserves `prev.data` | Yes (line 35) | PASS |
| mountedRef unmount guard | Yes (lines 27–29, 39) | PASS |
| customInitialState merge | Yes (line 23–25) | PASS |
| `options.unexpectedErrorMessage` for exception path | Yes (line 59) | PASS |
| Exception catch → status 500 | Yes (lines 57–62) | PASS |
| Concurrent execute races (last wins) | Yes (no locking) | PASS |

### AppStateHandler

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| Fixed 4-step rendering priority | Yes | PASS |
| LOADING → error → empty/success → INIT fallback | Yes (lines 30–54) | PASS |
| slot props override context | Yes | PASS |
| `children` takes precedence over `SuccessComponent` | Yes (line 48 before 49) | PASS |
| `emptyCondition` only evaluated when `isSuccess && data !== null` | Yes (line 42) | PASS |
| No retry wiring | Yes (no retry prop) | PASS |
| No data fetching in component | Yes | PASS |
| `errorMessage` passed to context Error as `message` prop | Yes (line 38) | PASS |
| INTERNET_ERROR triggers error render even if `isError` false | Yes (line 36) | PASS |

### ApiService

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| GET/POST/PUT/DELETE methods | Yes | PASS |
| Never throws — all errors returned as ServerResponse | Yes | PASS |
| Axios HTTP error → actual status | Yes (line 47) | PASS |
| Network failure → INTERNET_ERROR (0) | Yes (line 47, `?? HttpStatusCode.INTERNET_ERROR`) | PASS |
| Non-axios exception → 500 | Yes (lines 55–59) | PASS |
| `onError` callback on error | Yes (line 43) | PASS |

### IpcService

| Requirement | Implemented | Status |
|-------------|-------------|--------|
| `invoke` wraps window.electronAPI.invoke | Yes | PASS |
| `send` fire-and-forget; errors silently discarded | Yes (lines 61–67) | PASS |
| `receive` returns unsubscribe function | Yes | PASS |
| window.electronAPI unavailable → error/no-op | Yes (lines 31–35, 73–75) | PASS |
| `invoke` passes through existing ServerResponse | Yes (lines 40–42) | PASS |
| onError callback on invoke failure | Yes (line 50) | PASS |

### Feature Compliance Matrix

| Feature | Requirement | Implemented | Status |
|---------|-------------|-------------|--------|
| useDataState | All documented behaviors | Yes | PASS |
| AppStateHandler | All documented behaviors | Yes | PASS |
| ApiService | All documented behaviors | Yes | PASS |
| IpcService | All documented behaviors | Yes | PASS |
| ServerResponse | Factory methods, isError/isSuccess | Yes | PASS |
| HttpStatusCode | All enum values + getStatusMessage | Yes | PASS |
| StateCode | IDLE = 1000 | Yes | PASS |

---

## 5. Technical Design Compliance Report

### `feature-technical/use-data-state.md`

| Design Requirement | Implemented | Status |
|--------------------|-------------|--------|
| Tuple `[appState, execute, setAppState] as const` | Yes (line 65) | PASS |
| Exception → `status: INTERNAL_SERVER_ERROR, statusMessage: options?.unexpectedErrorMessage ?? ''` | Yes | PASS |
| Initial `status: StateCode.IDLE` | Yes | PASS |
| 5 documented tests (per doc) | 7 actual tests | STALE COUNT |

### `feature-technical/app-state-handler.md`

| Design Requirement | Implemented | Status |
|--------------------|-------------|--------|
| State evaluation priority tree | Matches exactly | PASS |
| Generic `<T, S extends AppState<T>>` | Yes | PASS |
| 9 documented tests (per doc) | 10 actual tests | STALE COUNT |

### `feature-technical/repository.md`

| Design Requirement | Implemented | Status |
|--------------------|-------------|--------|
| IpcService status "Planned" | IpcService is fully implemented | STALE |
| `console.error` before returning (ApiService NFR) | No console.error in source; `onError` callback used | STALE |
| `ApiService` constructor signature omits `options?` | Source has `options?: { onError? }` | INCOMPLETE |
| `getApiService` signature omits `options?` | Source has `options?: { onError? }` | INCOMPLETE |

### `feature-technical/mvvm-wiring.md`

| Design Requirement | Implemented | Status |
|--------------------|-------------|--------|
| `ipc = getIpcService(literal)` pattern | No `getIpcService` factory exists | MISSING |
| `AppState.status: HttpStatusCode` type | Source uses `HttpStatusCode \| StateCode` | INCORRECT |
| Testing template uses `HttpStatusCode.IDLE` | Deprecated; should use `StateCode.IDLE` | DEPRECATED |

### `feature-technical/state-management.md`

| Design Requirement | Implemented | Status |
|--------------------|-------------|--------|
| Hardcoded English fallback claim `'An unexpected error occurred.'` | Source uses `''` (empty string) | STALE |
| All state transitions | Implemented correctly | PASS |
| All data flow diagrams | Accurately reflect source | PASS |

### Technical Design Compliance Matrix

| Feature-Technical Doc | Design Requirement | Implemented | Status |
|-----------------------|--------------------|-------------|--------|
| `use-data-state.md` | Public API signature | Correct | PASS |
| `use-data-state.md` | Test count (says 5) | 7 tests | STALE |
| `app-state-handler.md` | Test count (says 9) | 10 tests | STALE |
| `repository.md` | IpcService status | Implemented, doc says Planned | STALE |
| `repository.md` | ApiService error logging | No console.error in source | STALE |
| `repository.md` | Constructor signature | Missing options param | INCOMPLETE |
| `mvvm-wiring.md` | getIpcService factory | Does not exist | MISSING |
| `mvvm-wiring.md` | AppState.status type | `HttpStatusCode \| StateCode` in source | INCORRECT DOC |
| `state-management.md` | Hardcoded error message | Source uses '' not English string | STALE |

---

## 6. Drift Detection Report

### Undocumented Architecture Doc Conflict

`docs/raw/architecture/core/dependencies.md` lists `@mui/material`, `@mui/icons-material`, and `@emotion/react` as runtime `dependencies` with pinned versions. These packages are:

1. **Not present in `package.json`** — correct; Astra is design-system independent
2. **Contradictory to `mvvm-separation.md`** invariant which states "Astra has no dependency on any design system"
3. **Contradictory to `repository-isolation.md`** which lists Prati as owning component library concerns
4. **Contradictory to `README.md`** which explicitly states "Not a design system"

This architecture doc entry is stale and actively misleads. The source is correct in NOT having these dependencies. The doc needs cleanup.

### `ITransportService` and `Platform` Exports

`ITransportService` and `Platform` are publicly exported (via `src/common/repo/types.ts` → `repo/index.ts` → `common/index.ts` → `lib.ts`) and documented in `README.md`. However, `docs/raw/architecture/core/api-surface.md` does not list them in its public API surface table or in the entry-point example code. Minor documentation gap — source and README are authoritative.

### `getIpcService` Factory Non-Existence

`feature-technical/mvvm-wiring.md` includes an example:
```
ipc = getIpcService(literal)   // from astra
```
No `getIpcService` factory function exists in source. IpcService is instantiated directly with `new IpcService()` (no literal needed). This is an undocumented design difference between IpcService and ApiService — the two services have different initialization patterns. No singleton cache exists for IpcService.

### Drift Matrix

| Area | Documented | Implemented | Status |
|------|------------|-------------|--------|
| React dependency | `peerDependencies` | `dependencies` | DRIFT |
| axios dependency | `dependencies: "1.15.0"` (arch doc) | `peerDependencies: ">=1.0.0"` | DRIFT |
| @mui/material runtime dep | Present in arch doc | Absent from package.json | STALE DOC |
| getIpcService factory | Referenced in mvvm-wiring.md | Does not exist | STALE DOC |
| ITransportService/Platform | In README | Missing from api-surface.md | INCOMPLETE DOC |
| AppState.status type | `HttpStatusCode` (tech docs) | `HttpStatusCode \| StateCode` (source) | STALE DOC |
| ApiService error logging | console.error (tech doc) | onError callback (source) | STALE DOC |

---

## 7. Public API Audit Report

### Export Surface Verification

| Export | In README | In api-surface.md | In lib.ts (via barrel) | Status |
|--------|-----------|--------------------|------------------------|--------|
| `useDataState` | Yes | Yes | Yes | PASS |
| `AppStateHandler` | Yes | Yes | Yes | PASS |
| `AppStateProvider` | Yes | Yes | Yes | PASS |
| `AppStateContext` | Yes | Yes | Yes | PASS |
| `AppStateComponents` | Yes | Yes | Yes | PASS |
| `AppStateHandlerProps` | Yes | Yes | Yes | PASS |
| `AppState` | Yes | Yes | Yes | PASS |
| `StateType` | Yes | Yes | Yes | PASS |
| `StateCode` | Yes | Yes | Yes | PASS |
| `ApiService` | Yes | Yes | Yes | PASS |
| `ServerResponse` | Yes | Yes | Yes | PASS |
| `HttpStatusCode` | Yes | Yes | Yes | PASS |
| `getApiService` | Yes | Yes | Yes | PASS |
| `getStatusMessage` | Yes | **No** | Yes | MINOR GAP |
| `IpcService` | Yes | Yes | Yes | PASS |
| `ITransportService` | Yes | **No** | Yes | MINOR GAP |
| `Platform` | Yes | **No** | Yes | MINOR GAP |
| `ResponseSuccess` | No | No | No (internal) | PASS — not leaked |
| `ResponseError` | No | No | No (internal) | PASS — not leaked |

### Barrel Export Pattern

`src/lib.ts` uses `export * from "./common"` — a wildcard re-export.  
`docs/raw/architecture/core/api-surface.md` explicitly shows this as a "Bad" pattern:

```
// Bad: indiscriminate re-exports
export * from './internal';  // may expose internal symbols
```

The wildcard chain is currently controlled (`APITypes.ts` is not included in any barrel), and `publicExports.test.ts` confirms internal types are not leaked. However the pattern is architecturally discouraged and creates future leakage risk.

### Public API Matrix

| Export | Documented | In Barrel | Status |
|--------|------------|-----------|--------|
| `getStatusMessage` | README only | Yes | MINOR — missing from api-surface.md |
| `ITransportService` | README only | Yes | MINOR — missing from api-surface.md |
| `Platform` | README only | Yes | MINOR — missing from api-surface.md |
| All others | Both docs | Yes | PASS |

---

## 8. Type Accuracy Report

### `AppState.status` Field Type

| Type / Field | api-surface.md | feature-technical docs | Source |
|--------------|----------------|----------------------|--------|
| `AppState<T>.status` | Not specified | `HttpStatusCode` (incomplete) | `HttpStatusCode \| StateCode` |

`feature-technical/use-data-state.md` (line 53), `feature-technical/mvvm-wiring.md` (line 64), and `feature-technical/state-management.md` (line 22 comment column) all show `status: HttpStatusCode`. Source correctly uses `HttpStatusCode | StateCode` — the union is required because the initial state has `status: StateCode.IDLE` before any HTTP activity. Feature-technical docs have an incomplete type declaration.

### `ServerResponse<T>.data` Field

| Type / Field | Documentation | Source |
|--------------|---------------|--------|
| `ServerResponse.data` | `data?: T` (optional) | `data?: T` | PASS |
| `AppState.data` | `T \| null` | `T \| null` | PASS |
| `data` mapping in execute | `response.data ?? null` converts undefined→null | Correct (line 47) | PASS |

### `AppStateHandlerProps`

| Type / Field | Documented | Source |
|--------------|------------|--------|
| All props | Correctly documented | Correctly implemented | PASS |

### `useDataState` Signature

| Parameter | feature-technical/use-data-state.md | Source |
|-----------|-------------------------------------|--------|
| `customInitialState?` | `Partial<AppState<T>>` | `Partial<AppState<T>> = {}` | PASS |
| `options?` | `{ unexpectedErrorMessage?: string }` | Same | PASS |
| Return type | `readonly [AppState<T>, execute, setAppState]` | `as const` tuple | PASS |

### Type Accuracy Matrix

| Type / Field | Documented | Source | Status |
|--------------|------------|--------|--------|
| `AppState.status` | `HttpStatusCode` (in tech docs) | `HttpStatusCode \| StateCode` | MINOR (docs stale) |
| `ServerResponse.data` | `T \| undefined` (optional) | `T \| undefined` | PASS |
| `AppState.data` | `T \| null` | `T \| null` | PASS |
| `HttpStatusCode.IDLE` | `@deprecated` | Retained with JSDoc deprecation | PASS |
| `ApiService.constructor` | `(baseUrl, literal)` in tech docs | `(baseUrl, literal, options?)` | MINOR (doc incomplete) |

---

## 9. Dependency Audit Report

### package.json vs Architecture Doc

| Dependency | Documented Placement | Actual Placement | Status |
|------------|---------------------|-----------------|--------|
| `react` | `peerDependencies` (dependencies.md) | `dependencies` | **CRITICAL** |
| `react-dom` | `peerDependencies` (dependencies.md) | `dependencies` | **CRITICAL** |
| `axios` | `dependencies: "1.15.0"` (dependencies.md) | `peerDependencies: ">=1.0.0"` | DRIFT |
| `@mui/material` | `dependencies: "7.0.2"` (dependencies.md) | Not in package.json | STALE DOC |
| `@emotion/react` | `dependencies: "11.14.0"` (dependencies.md) | Not in package.json | STALE DOC |
| `typescript` | `devDependencies` | `devDependencies: "5.8.3"` | PASS |
| `vite` | `devDependencies: "6.3.2"` (doc) | `devDependencies: "^7.3.5"` | VERSION DRIFT |

### Import Direction Violations

| Module | Import | Direction | Status |
|--------|--------|-----------|--------|
| `AppStateHandler.tsx` | `../../repo/HttpStatusCode` | component→repo | MINOR |
| `AppState.ts` | `../repo/HttpStatusCode` | state→repo | MINOR |
| `useDataState.ts` | `../repo/ServerResponse`, `../repo/HttpStatusCode` | hook→repo | PASS |
| `ApiService.ts` | `axios` | service→external | PASS |
| `IpcService.ts` | `window.electronAPI` (global) | service→runtime | PASS |

### Circular Dependencies

No circular imports detected. Import graph is acyclic.

### Design System Coupling

No design system packages imported in astra source. PASS.

### Dependency Matrix

| Module | Dependency | Allowed per arch | Status |
|--------|------------|-----------------|--------|
| `ApiService.ts` | `axios` | Yes (WEB transport) | PASS |
| `IpcService.ts` | `window.electronAPI` (global only) | Yes (ELECTRON service) | PASS |
| `AppStateHandler.tsx` | `react`, internal types | Yes | PASS |
| `AppStateHandler.tsx` | `../../repo/HttpStatusCode` | Documented as forbidden (component→repo) | MINOR |
| `package.json` | `react` in dependencies | No — must be peerDependencies | **CRITICAL** |

---

## 10. Technical Debt Report

### Deprecated Symbol Still Active

`HttpStatusCode.IDLE = 1000` is marked `@deprecated` in source with a JSDoc tag pointing to `StateCode.IDLE`. However:
- `getStatusMessage()` still handles `HttpStatusCode.IDLE` with a `case` branch (intentional backward compat)
- `HttpStatusCode.test.ts` line 24 tests `HttpStatusCode.IDLE` directly
- `feature-technical/mvvm-wiring.md` Testing Reference uses `HttpStatusCode.IDLE` in a code example for loading state

The source's backward-compat handling is correct (deprecated but not removed). The test and doc references are stale.

### Technical Debt Matrix

| Issue | File | Severity |
|-------|------|----------|
| react/react-dom in wrong dep category | `package.json` | Critical |
| @mui/material stale in arch doc | `architecture/core/dependencies.md` | Major |
| AppStateHandler imports from repo | `AppStateHandler.tsx:3` | Minor |
| AppState imports from repo | `AppState.ts:1` | Minor |
| Wildcard barrel export in lib.ts | `src/lib.ts:2` | Minor |
| IpcService status "Planned" stale | `feature-technical/repository.md` | Minor |
| console.error claim stale | `feature-technical/repository.md` | Minor |
| getIpcService non-existent factory in docs | `feature-technical/mvvm-wiring.md` | Minor |
| AppState.status wrong type in tech docs | `feature-technical/use-data-state.md`, `mvvm-wiring.md` | Minor |
| options? omitted from ApiService in tech docs | `feature-technical/repository.md`, `mvvm-wiring.md` | Minor |
| Hardcoded error message claim stale | `feature-technical/state-management.md` | Minor |
| Deprecated HttpStatusCode.IDLE in test template | `feature-technical/mvvm-wiring.md` | Minor |

---

## 11. Implementation Purity Report

### Business Logic Leakage

No undocumented product decisions or business rules detected in source. All conditional logic in `AppStateHandler` and `useDataState` is directly traceable to feature documentation.

### Architecture Leakage

No new architecture patterns introduced in source beyond documented design. The `apiServiceCache` module-level Map is documented as an accepted singleton in `feature-technical/repository.md` ("Factory Cache: `Map<string, ApiService>` grows unbounded per unique baseUrl — acceptable for typical app").

### Technical Design Leakage

The only purity concern is the absence of a documented `getIpcService` factory — the feature-technical doc references this as expected behavior but the source takes a different, simpler approach (`new IpcService()` directly). This is captured as IMPL-DESIGN-004.

---

## 12. Test Integrity Report

### Assertion Accuracy

All test assertions match source implementation behavior. No tests assert behaviors contradicted by source.

### Deprecated References in Tests

`HttpStatusCode.test.ts` line 24: `expect(HttpStatusCode.IDLE).toBe(1000)` — tests the deprecated member explicitly. This is intentional backward-compat testing but uses a deprecated symbol. Acceptable as a regression guard.

### Coverage Gaps

| Documented Behavior | Test Coverage | Status |
|--------------------|---------------|--------|
| mountedRef guard (unmount during request) | Covered indirectly via hook test lifecycle | PARTIAL |
| getApiService singleton cache hit | No test verifies same instance returned | MISSING |
| setAppState called after unmount (non-async path) | No test | MISSING |
| ApiService with options.onError | Covered (line 95–105 of ApiService.test.ts) | PASS |
| IpcService platform identifier | Covered (IpcService.test.ts describe 'platform') | PASS |

### Mock Accuracy

ApiService tests mock `axios` directly (`vi.mock('axios')`). The mock represents the actual axios interface correctly. IpcService tests use `createMockElectronAPI()` which accurately models `window.electronAPI` interface.

### Stale Test Data

`feature-technical/mvvm-wiring.md` Testing Reference (line ~383) shows:
```ts
const loadingState: AppState<User[]> = {
  status: HttpStatusCode.IDLE,   // ← deprecated
```
This should use `StateCode.IDLE`. Not in production test code but misleads developers copying the template.

### Test Integrity Matrix

| Test | Asserts | Matches Source | Status |
|------|---------|----------------|--------|
| useDataState init state | StateType.INIT, StateCode.IDLE | Yes | PASS |
| useDataState execute success | COMPLETED, isSuccess, data | Yes | PASS |
| useDataState execute error | COMPLETED, isError, data:null | Yes | PASS |
| useDataState exception catch | status:500, isError | Yes | PASS |
| AppStateHandler loading→context | Renders context.Loading | Yes | PASS |
| AppStateHandler loading→slot | Slot overrides context | Yes | PASS |
| AppStateHandler INTERNET_ERROR | Triggers error path | Yes | PASS |
| AppStateHandler children > SuccessComponent | children wins | Yes | PASS |
| getApiService singleton | (no test) | — | MISSING |
| IpcService invoke success | ServerResponse.success | Yes | PASS |
| IpcService ServerResponse passthrough | Same instance returned | Yes | PASS |
| publicExports internal not leaked | ResponseSuccess absent | Yes | PASS |

---

## 13. Findings Summary

### Critical

| ID | File | Finding |
|----|------|---------|
| IMPL-DEPENDENCY-001 | `package.json` | `react` and `react-dom` placed in `dependencies` instead of `peerDependencies`. Causes duplicate React instances in consumer projects — triggers "Invalid hook call" runtime errors. Architecture `dependencies.md` explicitly requires these as `peerDependencies`. |

### Major

| ID | File | Finding |
|----|------|---------|
| IMPL-DRIFT-001 | `docs/raw/architecture/core/dependencies.md` | Lists `@mui/material: 7.0.2`, `@mui/icons-material: 7.0.2`, `@emotion/react: 11.14.0` as runtime dependencies. These contradict the design-system independence invariant, are not present in `package.json`, and would violate the repository boundary rules if added. Actively misleads maintainers. |

### Minor

| ID | File | Finding |
|----|------|---------|
| IMPL-ARCH-001 | `src/common/components/organisms/AppStateHandler.tsx:3` | Component imports `HttpStatusCode` from `../../repo/HttpStatusCode`. Architecture invariant states "components→repo never". |
| IMPL-ARCH-002 | `src/common/state/AppState.ts:1` | State module imports `HttpStatusCode` from `../repo/HttpStatusCode`. Creates state→repo coupling; `HttpStatusCode` should be a shared primitive or live in `state/`. |
| IMPL-API-001 | `docs/raw/architecture/core/api-surface.md` | `getStatusMessage`, `ITransportService`, and `Platform` are publicly exported (per README and barrel) but absent from the api-surface.md documented export table. API surface doc is incomplete. |
| IMPL-API-002 | `src/lib.ts:2` | Uses `export * from "./common"` — wildcard re-export. Architecture doc `api-surface.md` explicitly marks `export * from './internal'` as "Bad" pattern. While currently controlled, future additions to any barrel could accidentally expose internal symbols. |
| IMPL-DESIGN-001 | `docs/raw/feature-technical/state-management.md` section 2 | Claims `useDataState` has "a hardcoded English fallback 'An unexpected error occurred.'" — source uses `options?.unexpectedErrorMessage ?? ''` (empty string). Stale description of removed behavior. |
| IMPL-DESIGN-002 | `docs/raw/feature-technical/repository.md` Non-Functional Requirements | States "Error logged via `console.error` before returning". Source uses `this.onError?.(error)` callback; no `console.error` in `ApiService.ts`. Stale NFR claim. |
| IMPL-DESIGN-003 | `docs/raw/feature-technical/repository.md` Implementation Reference | Status field reads "Implemented (ApiService, HttpStatusCode, ServerResponse); Planned (IpcService)". `IpcService` is fully implemented in `src/common/repo/IpcService.ts`. Stale status. |
| IMPL-DESIGN-004 | `docs/raw/feature-technical/mvvm-wiring.md` ELECTRON Repository example | References `ipc = getIpcService(literal)` — no `getIpcService` factory exists in source. `IpcService` is instantiated with `new IpcService()`. No literal parameter accepted. |
| IMPL-DESIGN-005 | `docs/raw/feature-technical/repository.md` Public API; `docs/raw/feature-technical/mvvm-wiring.md` Public API | `ApiService` constructor and `getApiService` factory documented without `options?: { onError?: (error: unknown) => void }` third parameter. Source has this parameter at `ApiService.ts:22` and `apiServiceFactory.ts:9`. |
| IMPL-TYPE-001 | `docs/raw/feature-technical/use-data-state.md:53`, `mvvm-wiring.md:64` | `AppState<T>` interface shown with `status: HttpStatusCode` (single type). Source correctly defines `status: HttpStatusCode \| StateCode` in `AppState.ts:19`. Feature-technical type declarations are incomplete. |
| IMPL-TEST-001 | `docs/raw/feature-technical/mvvm-wiring.md` Testing Reference (~line 383) | Testing template shows `status: HttpStatusCode.IDLE` for loading state. `HttpStatusCode.IDLE` is deprecated; canonical usage is `StateCode.IDLE`. Misleads developers copying the template. |
| IMPL-DEPENDENCY-002 | `package.json` peerDependencies | `axios` peer dependency range `>=1.0.0` is excessively permissive. Allows any future major version (axios 2.x, 3.x) which may have breaking changes. Architecture `dependencies.md` specifies `"axios": "1.15.0"` (exact/controlled). |

### Suggestions

| ID | File | Finding |
|----|------|---------|
| IMPL-TEST-002 | `src/common/repo/apiServiceFactory.ts` | No test verifies that `getApiService` returns the cached instance on repeated calls with the same `baseUrl`. Singleton cache behavior is undocumented in tests. |
| IMPL-TEST-003 | `src/common/hooks/useDataState.test.ts` | No test covers the non-async `setAppState` path after unmount. The mountedRef guard inside `execute` is tested indirectly; direct `setAppState` after unmount has no guard and no test. |
| IMPL-DRIFT-002 | `src/common/repo/` | No `getIpcService` singleton factory exists to mirror `getApiService`. Each consumer instantiates `new IpcService()` independently. For consistency with the WEB transport pattern, a `getIpcService` factory would reduce consumer boilerplate and prevent redundant instances. |

---

## 14. Scoring Breakdown

| Category | Findings | Raw Deduction | Weight | Weighted Deduction |
|----------|----------|--------------|--------|-------------------|
| Architecture Compliance | 2 Minor | −0.4 | 25% | −0.10 |
| Feature Compliance | 0 | 0 | 20% | 0 |
| Technical Design Compliance | 5 Minor | −1.0 | 15% | −0.15 |
| Test Integrity | 0 Critical, 1 Minor | −0.2 | 10% | −0.02 |
| Drift Detection | 1 Major, 1 Minor | −0.7 | 10% | −0.07 |
| Dependency Compliance | 1 Critical, 1 Minor | −1.7 | 8% | −0.136 |
| API Compliance | 2 Minor | −0.4 | 5% | −0.02 |
| Type Accuracy | 1 Minor | −0.2 | 4% | −0.008 |
| Technical Debt | 0 | 0 | 2% | 0 |
| Implementation Purity | 0 | 0 | 1% | 0 |

> Note: Raw deductions applied to overall score:
> - 1 Critical × −1.5 = −1.5
> - 1 Major × −0.5 = −0.5
> - 12 Minor × −0.2 = −2.4
> - 3 Suggestions × 0 = 0
> - **Total deduction: −4.4**

```
Total Score: 5.6 / 10
```

---

## 15. Score Improvement Summary

```
Previous Report:  implementation-audit-2026-06-21-1315.md
Previous Score:   9.6 / 10
Current Score:    5.6 / 10
Change:           −4.0
```

### Resolved Findings from Previous Report

The previous report (2026-06-21-1315) had 2 Minor findings and 2 Suggestions. Based on the finding IDs not being referenced, all previous findings appear to have been resolved or were superseded by more thorough analysis in this audit cycle.

### New Findings in This Report (Not in Previous Report)

| ID | Category | Description |
|----|----------|-------------|
| IMPL-DEPENDENCY-001 | Critical | react/react-dom in `dependencies` not `peerDependencies` |
| IMPL-DRIFT-001 | Major | @mui deps in architecture doc contradict design-system independence |
| IMPL-ARCH-001 | Minor | AppStateHandler imports from repo layer |
| IMPL-ARCH-002 | Minor | AppState.ts imports from repo layer |
| IMPL-API-001 | Minor | api-surface.md missing getStatusMessage, ITransportService, Platform |
| IMPL-API-002 | Minor | Wildcard barrel pattern in lib.ts |
| IMPL-DESIGN-001 | Minor | Stale hardcoded error message claim in state-management.md |
| IMPL-DESIGN-002 | Minor | Stale console.error claim in repository.md |
| IMPL-DESIGN-003 | Minor | IpcService status "Planned" in repository.md |
| IMPL-DESIGN-004 | Minor | getIpcService non-existent factory in mvvm-wiring.md |
| IMPL-DESIGN-005 | Minor | options? param missing from ApiService docs |
| IMPL-TYPE-001 | Minor | AppState.status typed as HttpStatusCode in tech docs |
| IMPL-TEST-001 | Minor | HttpStatusCode.IDLE in mvvm-wiring.md test template |
| IMPL-DEPENDENCY-002 | Minor | axios peer range too permissive |

The score drop from 9.6 → 5.6 is attributable to:
1. **Expanded doc scope**: This audit cross-referenced `docs/raw/architecture/core/dependencies.md` revealing @mui contradiction (Major) and react/react-dom placement (Critical)
2. **Feature-technical doc sweep**: Multiple stale descriptions (console.error, IpcService status, getIpcService, hardcoded error) were caught via line-by-line comparison
3. **Dependency direction audit**: AppStateHandler/AppState→repo imports detected via strict invariant reading

The **source code itself remains high quality** — all behavioral requirements are correctly implemented. The score reflects doc-source divergence, not implementation bugs.

---

## 16. Recommended Fix Priority

### P0 — Build / Install Breaking

| Fix | Action |
|-----|--------|
| Move `react` and `react-dom` to `peerDependencies` | `package.json` — remove from `dependencies`, add to `peerDependencies` with caret range `"^19.2.3"` |

### P1 — Silent Bugs (wrong behavior)

None. All documented behaviors are correctly implemented in source.

### P2 — API Surface / Contract

| Fix | Action |
|-----|--------|
| Update `api-surface.md` to include `getStatusMessage`, `ITransportService`, `Platform` | Add to public API table |
| Update `dependencies.md` — remove @mui, correct react placement, correct axios section | Full rewrite of runtime/peer/dev tables |
| Tighten `axios` peer range | Change `>=1.0.0` to `^1.18.0` in peerDependencies |
| Update `lib.ts` to use named exports | Replace `export * from "./common"` with selective named exports per api-surface.md recommendation |

### P3 — Hygiene / Debt

| Fix | Action |
|-----|--------|
| Update `feature-technical/repository.md` IpcService status | Change "Planned" to "Implemented" |
| Update `feature-technical/repository.md` NFR | Replace `console.error` with `onError callback` description |
| Update `feature-technical/repository.md` public API | Add `options?` param to `ApiService` and `getApiService` signatures |
| Update `feature-technical/mvvm-wiring.md` ELECTRON example | Replace `getIpcService(literal)` with `new IpcService()` |
| Update `feature-technical/state-management.md` | Remove stale hardcoded English fallback claim |
| Update `feature-technical/mvvm-wiring.md` type declaration | Change `status: HttpStatusCode` to `status: HttpStatusCode \| StateCode` |
| Update `feature-technical/mvvm-wiring.md` test template | Replace `HttpStatusCode.IDLE` with `StateCode.IDLE` |
| Move `HttpStatusCode` to `state/` or shared `types/` | Resolves component→repo and state→repo direction violations |
| Add singleton test for `getApiService` | Verify cache hit returns same instance |

---

## 17. Final Verdict

```
Needs Improvement (5.6/10)
```

**The source implementation is functionally sound.** All documented behaviors for `useDataState`, `AppStateHandler`, `ApiService`, `IpcService`, `ServerResponse`, `HttpStatusCode`, `StateCode`, and the MVVM pattern are correctly implemented and tested. Feature compliance is complete.

**The score reflects documentation debt and one critical packaging error:**

1. **Critical packaging error**: `react` and `react-dom` in `dependencies` (not `peerDependencies`) — this will cause duplicate React instance errors in any consumer project. Fix immediately.

2. **Architecture doc contamination**: `dependencies.md` references @mui packages that contradict the design-system independence invariant — likely copy-paste from a Prati or prototype context. Clean up to prevent future dependency drift.

3. **Feature-technical doc drift**: Multiple feature-technical docs have stale content (IpcService "Planned", console.error logging, `getIpcService` factory, hardcoded error message, incomplete type declarations). These create misleading developer guidance but do not affect runtime behavior.

Address the P0 issue in the next patch. Schedule P3 doc updates as part of the next documentation cleanup sprint.

---

## 18. Audit Traceability

| Reference | Location |
|-----------|----------|
| Architecture Docs | `docs/raw/architecture/**` |
| Feature Docs | `docs/raw/feature/**` |
| Feature-Technical Docs | `docs/raw/feature-technical/**` |
| Source | `src/**` |
| Previous Report | `docs/raw/report/implementation/archive/implementation-audit-2026-06-21-1315.md` |
| This Report | `docs/raw/report/implementation/latest/implementation-audit-2026-06-21-1600.md` |
