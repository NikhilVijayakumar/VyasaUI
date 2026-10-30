# State Management

## 1. Technical Overview

Astra's state management system provides an async state lifecycle for all data operations (API calls, form submissions) based on the MVVM pattern. Every async operation follows a three-phase lifecycle: **INIT → LOADING → COMPLETED** (with success/error branching).

The system is realized by two primary exports from `src/lib.ts`:

- **`useDataState<T>()`** — Generic React hook at `src/common/hooks/useDataState.ts` that manages state transitions. Returns `[appState, execute, setAppState]`.
- **`AppStateHandler`** — Generic conditional-rendering organism at `src/common/components/organisms/AppStateHandler.tsx` that routes UI based on `AppState` (loading → error → empty → success).

Supporting types exported from `src/common/state/AppState.ts` and `src/common/repo/HttpStatusCode.ts`:

```typescript
enum StateType { INIT = 0, LOADING = 1, COMPLETED = 2 }

interface AppState<T> {
  state: StateType;
  isError: boolean;
  isSuccess: boolean;
  status: HttpStatusCode | StateCode;
  statusMessage: string;
  data: T | null;
}

enum HttpStatusCode {
  SUCCESS = 200, CREATED = 201, BAD_REQUEST = 400,
  UNAUTHORIZED = 401, NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500, INTERNET_ERROR = 0,
  /** @deprecated use StateCode.IDLE instead */
  IDLE = 1000,
}

enum StateCode {
  IDLE = 1000,  // initial status before any HTTP activity
}
```

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|---|
| **MVVM Pattern** | `useDataState` is the ViewModel primitive — centralizes async state so components remain stateless. ViewModel hooks in `hooks/use<Feature>.ts` wrap `useDataState`, call repositories, and expose clean interfaces to views. See `docs/raw/architecture/core/mvvm-pattern.md`. |
| **Feature Structure** | Canonical placement: `model/` (types), `repo/` (data access via `ApiService` for WEB or `IpcService` for ELECTRON), `hooks/` (ViewModel wrapping `useDataState`), `view/components/` (props-only), `view/pages/` (stateful containers using `AppStateHandler`). See `docs/raw/architecture/core/feature-structure.md`. |
| **Target Consistency** | ViewModel and View identical across WEB and ELECTRON — only the repository transport differs. `useDataState` and `AppStateHandler` are transport-agnostic. See `docs/raw/architecture/invariants/target-consistency.md`. |
| **Service Abstraction** | Repository delegates to `ApiService` (WEB) or `IpcService` (ELECTRON). `useDataState.execute()` consumes `ServerResponse<T>` regardless of transport. See `docs/raw/architecture/invariants/runtime-boundary.md`. |
| **Stateless UI** | `useDataState` is the mechanism that enforces Stateless UI — it owns async state so components never call `fetch`, `axios`, `window.electronAPI`, or persist data directly. See `docs/raw/architecture/invariants/stateless-ui.md`. |
| **Repository Isolation** | `useDataState.execute()` consumes `ServerResponse<T>` from repositories (backed by `ApiService` or `IpcService`). Components never access repositories directly — flow is: ViewModel → `execute` → repository → `ServerResponse` → state update. See `docs/raw/architecture/core/repository.md`. |
| **Public API Stability** | Stable — `useDataState`, `AppState`, `StateType`, `AppStateHandler`, `ApiService`, `IpcService`, `ServerResponse`, `HttpStatusCode` all exported via `src/lib.ts`. See `docs/raw/architecture/core/api-surface.md`. |
| **Localization** | `statusMessage` carries localized strings from `ServerResponse`. `AppStateHandler`'s `errorMessage` prop accepts translated strings. `useDataState` uses `options?.unexpectedErrorMessage ?? ''` on exception — empty string default, no hardcoded English. Consumer passes the translated string via `options.unexpectedErrorMessage`. See `docs/raw/architecture/core/localization.md`. |

### State Flow (from `docs/raw/architecture/runtime-maps/state-flow.md`)

```
┌─────────┐    execute()     ┌─────────┐    success    ┌───────────┐
│  INIT   │ ────────────────→ │ LOADING │ ────────────→ │ COMPLETED │
└─────────┘                   └─────────┘               └───────────┘
                                    │                          │
                                    │ error                    │ error
                                    ↓                          ↓
                               ┌────────────────────────────────┐
                               │         isError: true           │
                               │   statusMessage: string         │
                               └────────────────────────────────┘
```

### Data Flow (from `docs/raw/architecture/runtime-maps/data-flow.md`)

```
User Action → Page (view/pages/) → ViewModel (hooks/) → Repository (repo/)
                                                              │
                                                    ┌─────────┴──────────┐
                                                    ▼                    ▼
                                              ApiService (WEB)    IpcService (ELECTRON)
                                                    │                    │
                                              HTTP / Axios      window.electronAPI / IPC
                                                                                  ↓
User ←──── Page (AppStateHandler) ←── ViewModel (useDataState) ←── Repository (ServerResponse)
```

## Feature Requirements Traceability

| Feature Spec Requirement | Technical Implementation | Section |
|---|---|---|
| State lifecycle: INIT→LOADING→COMPLETED | State Machine table | Technical Structure |
| AppState\<T\> interface definition | AppState Detail section | Technical Structure |
| StateType enum (INIT, LOADING, COMPLETED) | State Machine table | Technical Structure |
| StateCode.IDLE for initial status | State Machine table | Technical Structure |
| State transitions table | Complete transition matrix | Technical Structure |
| Error state: COMPLETED + isError (no ERROR enum) | State Machine: error branch | Technical Structure |
| When to use / when not to use | Key Implementation Details | Technical Structure |
| Dual-platform data flow | Dual-platform diagrams | Data Flow |

## 3. Data Flow

### Request Flow

```
Consumer calls ViewModel hook action
  → execute(apiCall) called
    → setAppState({ ...prev, state: LOADING })
    → await apiCall()  (typically a repository method using ApiService or IpcService)
      → WEB:      ApiService.get/post/put/delete → Axios → REST API
      → ELECTRON: IpcService.invoke(channel) → window.electronAPI → Prana IPC → Main Process
    → on success:
        setAppState({ state: COMPLETED, isSuccess: true, data: response.data, ... })
    → on ServerResponse error:
        setAppState({ state: COMPLETED, isError: true, data: null, ... })
    → on exception (throw/crash):
        setAppState({ state: COMPLETED, isError: true, status: 500,
                      statusMessage: options?.unexpectedErrorMessage ?? '' })
```

### Response Flow

```
WEB:      REST API → ApiService (Axios wrapper) → ServerResponse<T>
ELECTRON: IPC Handler → IpcService (window.electronAPI wrapper) → ServerResponse<T>
  → execute() extracts ServerResponse fields
  → useDataState internal reducer sets AppState<T>
  → AppStateHandler evaluates priority: LOADING → ERROR → EMPTY → SUCCESS
  → Renders appropriate UI (LoadingState, ErrorState, EmptyState, or success content)
```

### `AppStateHandler` Evaluation Priority (fixed order)

```
1. state === StateType.LOADING         → <LoadingState />
2. isError || status === INTERNET_ERROR → <ErrorState message={errorMessage} />
3. isSuccess && data !== null
   ├── emptyCondition?.(data) === true → <EmptyState />
   ├── children provided               → children
   └── SuccessComponent provided       → <SuccessComponent appState={appState} />
4. fallback (INIT, no success, no error) → <EmptyState />
```

## 4. State Management

### State Machine

| From | Event | To | `state` | `isError` | `isSuccess` | `data` |
|---|---|---|---|---|---|---|
| INIT | Component mount | INIT | `INIT` | `false` | `false` | `null` |
| INIT | `execute()` called | LOADING | `LOADING` | `false` | `false` | preserved |
| LOADING | API success | COMPLETED+success | `COMPLETED` | `false` | `true` | response.data |
| LOADING | API error | COMPLETED+error | `COMPLETED` | `true` | `false` | `null` |
| LOADING | Exception thrown | COMPLETED+error | `COMPLETED` | `true` | `false` | `null` |
| COMPLETED | `execute()` called | LOADING | `LOADING` | `false` | `false` | preserved |
| Any | `setAppState(newState)` | Arbitrary | consumer-defined | consumer-defined | consumer-defined | consumer-defined |

### Key Implementation Details (from `src/common/hooks/useDataState.ts`)

- `customInitialState` merges with defaults via `{ ...getInitialState(), ...customInitialState }`
- LOADING preserves `prev.data` — enables stale-while-reloading UX pattern
- Exception catch sets `status: HttpStatusCode.INTERNAL_SERVER_ERROR` (500)
- Return type is `readonly [AppState<T>, execute, setAppState]` via `as const`
- No AbortController integration — concurrent `execute` calls race
- Unmount guard via `mountedRef` — `setAppState` is skipped after component unmounts

### `AppStateHandler` Detail (from `src/common/components/organisms/AppStateHandler.tsx`)

- `children` takes precedence over `SuccessComponent` when both provided
- `emptyCondition` is called only when `isSuccess && data !== null`
- Slot props (`loadingComponent`, `errorComponent`, `emptyComponent`) override context components per-instance
- Fallback (INIT, no flags set) renders `emptyComponent` slot or `context.Empty` or null
- `INTERNET_ERROR` (status 0) triggers error state even if `isError` is `false`
- Returns `null` when neither context nor slot is available for a given state
- Generic type params `<T, S extends AppState<T>>` allow extension

## 5. Styling Implementation

State management has **no direct visual output**. Visual rendering is delegated to consumer-provided components injected via `AppStateProvider` or slot props:

- **`Loading`** — rendered on `state === LOADING`; provided by consumer via `AppStateProvider` value or `loadingComponent` slot prop
- **`Error`** — rendered on `isError || INTERNET_ERROR`; receives `message?: string` prop; provided via `AppStateProvider` or `errorComponent` slot
- **`Empty`** — rendered on empty data or fallback; provided via `AppStateProvider` or `emptyComponent` slot

Astra has no UI dependencies. Theming and styling are the consumer's responsibility (e.g., via prati's ThemeProvider + LoadingState/ErrorState/EmptyState).

## 6. Interaction Design

- **`useDataState`**: No direct UI interaction. Hook interface is programmatic — called by ViewModel hooks, never by components directly.
- **`AppStateHandler`**: No user interaction handling. Declarative routing only. The rendered atom components (LoadingState, ErrorState) may have their own interaction patterns (spinner animation, retry button in ErrorState).

## 7. Accessibility Implementation

- **`AppStateHandler`** delegates accessibility to child atoms:
  - `LoadingState` should provide `aria-busy="true"` on the loading region
  - `ErrorState` should use `role="alert"` for error announcements
  - `EmptyState` should provide a clear text description
- **`useDataState`**: No accessibility concerns — programmatic hook with no DOM output
- **Status messages**: `statusMessage` from `ServerResponse` carries user-facing text that may be localized — screen readers will announce content when rendered via ErrorState

## 8. Error Handling

| Condition | Layer | Behavior |
|---|---|---|
| API returns error `ServerResponse` | `execute()` in `useDataState` | Sets `isError=true`, `data=null`, propagates `status` and `statusMessage` from response |
| API call throws exception | `execute()` catch | Sets `isError=true`, `status=500`, `statusMessage=options?.unexpectedErrorMessage ?? ''` |
| Component unmounts during request | React lifecycle | `mountedRef` guard prevents `setAppState` after unmount — no stale update |
| Concurrent `execute` calls | Consumer pattern | Each completion can update state; there is no latest-request guard. |
| `execute` resolves with a non-`ServerResponse` | Runtime | No instance validation; property access that throws reaches the 500 catch branch. |
| Missing `errorMessage` on `AppStateHandler` | Consumer omission | Passes `undefined` to ErrorState — ErrorState uses its own default message |
| `SuccessComponent` throws | Render | Error propagates to parent — no ErrorBoundary in AppStateHandler |

## 9. Performance Considerations

- **`useDataState`**: O(1) state updates. No memoization. `execute` creates a new closure on each call — no significant overhead.
- **`AppStateHandler`**: O(1) decision tree. Re-renders only when `appState` reference changes. Not wrapped in `React.memo()`.
- **Bundle**: `useDataState` ~55 lines, `AppStateHandler` ~45 lines. Zero external dependencies beyond React and internal types. No animation or state management libraries.
- **No request deduplication**: Concurrent `execute` calls race — network and state overhead from duplicate requests.
- **No caching**: Each `execute` call triggers a new API request. Caching is consumer responsibility in the ViewModel layer.

## 10. Integration Points

| Integration | Mechanism |
|---|---|
| **ViewModel hooks** | `hooks/use<Feature>.ts` wraps `useDataState<T>()`, calls repository methods, returns `appState` + actions to page containers. |
| **Page containers** | `view/pages/<Feature>Page.tsx` calls ViewModel hook, passes `appState` to `AppStateHandler`. |
| **Repository** | `repo/<Feature>Api.ts` returns `ServerResponse<T>`. `useDataState.execute()` expects `() => Promise<ServerResponse<T>>`. |
| **AppStateHandler** | Consumes `AppState<T>` from ViewModel hook; renders context or slot Loading/Error/Empty components or success content. |
| **AppStateProvider** | Consumer wraps app root to wire Loading/Error/Empty components into `AppStateContext`; all `AppStateHandler` instances in the subtree use these automatically. |
| **Theming** | Consumer-provided UI components (via `AppStateProvider`) handle their own theming — Astra has no theme dependency. |
| **Localization** | `errorMessage` prop on `AppStateHandler` accepts translated strings. `statusMessage` from `ServerResponse` carries localized content. |

### Provider Hierarchy

```
App Root
  └── <ThemeProvider>            ← consumer design system (e.g. prati) — not Astra
        └── <LanguageProvider>   ← consumer i18n — not Astra
              └── <AppStateProvider value={{ Loading, Error, Empty }}>  ← Astra
                    └── <Router>
                          └── <Page>
                                ├── useDataState()         ← Astra state management
                                └── <AppStateHandler>      ← reads AppStateContext
```

## 11. Open Questions

- Should `useDataState` integrate `AbortController` for request cancellation on unmount or re-trigger?
- Should `useDataState` validate that `options.unexpectedErrorMessage` is provided at call sites (lint rule) to prevent silent empty status messages on exception?
- Should `useDataState` support a deduplication strategy for concurrent `execute` calls?
- Should `AppStateHandler` support a customizable `LoadingComponent` prop (not just the default `LoadingState` atom)?
- Should state tracking include timestamps for staleness checks (cache invalidation)?
- How should WebSocket or SSE-driven state updates integrate with the `INIT → LOADING → COMPLETED` lifecycle?
- Should `AppStateHandler` have a retry action wired through to ErrorState?

## 12. Authorization

### TECH-PERM-001: Differentiate Authorization

- `AppState<T>` and `StateType` are pure data contracts with no runtime behavior
- They represent the state of an async operation but have no mechanism to enforce access control
- Authorization is irrelevant at the state contract layer — it belongs in the Repository/Application layer
- State is populated by `useDataState` based on `execute()` results; the contract itself has no auth semantics

## 13. Architecture Compliance Review

### Cross-References

- `use-data-state.md` — produces AppState instances from this contract
- `app-state-handler.md` — consumes AppState instances for conditional rendering
- `repository.md` — ServerResponse.status maps to AppState.status
- `mvvm-wiring.md` — AppState is the Model layer in the MVVM pattern

### Ownership

- **Astra owns**: AppState\<T\> interface, StateType enum, StateCode
- **Application owns**: consumer-side state interpretation and extension
- **Shared**: the contract is shared across all layers (Repository → ViewModel → View)
