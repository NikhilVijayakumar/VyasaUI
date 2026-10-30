# MVVM Wiring

How Repository, ViewModel hook, and View connect using Astra's building blocks. All async data flow follows this pattern.

Astra's MVVM (Model-View-ViewModel) pattern is implemented through three concrete abstractions: the `useDataState<T>` hook (ViewModel), the `AppState<T>` interface (Model contract), and the `AppStateHandler` component (View utility). Together they form a unidirectional data-flow pipeline for async operations with deterministic state transitions: `INIT → LOADING → COMPLETED` (with success or error variants).

The pattern is target-agnostic — it operates identically across both supported platforms (WEB and ELECTRON). Only the transport layer (Repository via `ApiService` or `IpcService`) differs between targets. ViewModel hooks and View components contain zero target-conditional logic.

---

## Feature Summary

| Attribute | Value |
|-----------|-------|
| **Module** | MVVM — Wiring Reference |
| **Status** | Implemented |
| **Primary Concern** | Standardized async state management with unidirectional data flow |
| **Consumers** | All feature modules that perform API calls or async data loading |
| **Localization** | `AppStateHandler` renders `LoadingState`, `ErrorState`, `EmptyState` atoms (may contain localized strings) |

---

## Implementation Reference

### Status

Implemented — all three abstractions are present and exported as public API.

### Source Files

| File | Purpose | Layer |
|------|---------|-------|
| `src/common/hooks/useDataState.ts` | ViewModel hook — manages async state machine | ViewModel |
| `src/common/state/AppState.ts` | `AppState<T>` interface and `StateType` enum | Model |
| `src/common/components/organisms/AppStateHandler.tsx` | Conditional rendering component for AppState | View |
| `src/common/components/organisms/AppStateContext.ts` | `AppStateProvider` and `AppStateContext` for default UI components | View |
| `src/common/repo/ServerResponse.ts` | Response type consumed by `execute()` | Repository |
| `src/common/repo/HttpStatusCode.ts` | Status code enum used in `AppState` | Model |

---

## Public API

### From `src/common/hooks/useDataState.ts`

```ts
function useDataState<T>(
  customInitialState?: Partial<AppState<T>>
): readonly [AppState<T>, (apiCall: () => Promise<ServerResponse<T>>) => Promise<void>, React.Dispatch<React.SetStateAction<AppState<T>>>];
```

Returns tuple: `[appState, execute, setAppState]`

### From `src/common/state/AppState.ts`

```ts
enum StateType { INIT = 0, LOADING = 1, COMPLETED = 2 }

interface AppState<T> {
  state: StateType;
  isError: boolean;
  isSuccess: boolean;
  status: HttpStatusCode | StateCode;
  statusMessage: string;
  data: T | null;
}
```

### From `src/common/components/organisms/AppStateHandler.tsx`

```tsx
interface AppStateHandlerProps<T, S extends AppState<T> = AppState<T>> {
  appState: S;
  SuccessComponent?: FC<{ appState: S }>;
  emptyCondition?: (data: T) => boolean;
  errorMessage?: string;
  children?: ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
}
```

### From `src/common/components/organisms/AppStateContext.ts`

```tsx
export interface AppStateComponents {
  Loading?: FC;
  Error?: FC<{ message?: string }>;
  Empty?: FC;
}

export const AppStateContext: React.Context<AppStateComponents>;
export const AppStateProvider: React.Provider<AppStateComponents>;
```

### Import Contract

```tsx
import {
  useDataState, AppState, StateType, StateCode,
  AppStateHandler, AppStateHandlerProps,
  AppStateProvider, AppStateContext, AppStateComponents,
} from 'astra';
```

---

## Architecture Mapping

| Pattern | Feature Usage | Reason |
|---------|---------------|--------|
| MVVM | ✅ Core implementation | `useDataState` = ViewModel, `AppState` = Model, `AppStateHandler` = View |
| Stateless UI | ✅ Enforced | ViewModel owns all state; components receive data via props |
| Target Consistency | ✅ Enforced | ViewModel identical across WEB and ELECTRON — transport isolated to Repository per `target-consistency.md` |
| Service Abstraction | ✅ Enforced | Repository uses `ApiService` (WEB) or `IpcService` (ELECTRON) — ViewModel unaware of transport per `runtime-boundary.md` |
| Public API Stability | ✅ Full | All three abstractions exported through `src/lib.ts` |
| Dependency Safety | ✅ Full | Only React `useState` dependency |
| Feature Structure | ✅ Aligned | ViewModel lives in `hooks/`, Model in `state/`, View in `components/organisms/` |
| Repository Transport | ApiService (WEB), IpcService (ELECTRON) | See `repository.md` for service details |
| AppState Contract | Shared model across all layers | See `state-management.md` for state machine |
| ViewModel Hook | Provides execute() and AppState | See `use-data-state.md` for hook internals |
| View Rendering | Consumes AppState via AppStateHandler | See `app-state-handler.md` for component API |

---

## Architecture Layers

### Repository

The Repository layer abstracts the transport mechanism. It calls either `ApiService` (WEB) or `IpcService` (ELECTRON) and returns `ServerResponse<T>`.

```ts
// WEB
api = getApiService(API_BASE_URL, literal)    // from astra
userRepo:
  getUser(id) → api.get("users/" + id)

// ELECTRON
ipc = new IpcService()                        // from astra
userRepo:
  getUser(id) → ipc.invoke("getUser", id)
```

The Repository returns `ServerResponse<T>` which is consumed by `execute()` in the ViewModel.

### ViewModel

The ViewModel layer is implemented as custom React hooks that wrap `useDataState<T>`. It manages async state and exposes both state and actions to the View.

| Name | File Path | Purpose | Dependencies |
|------|-----------|---------|--------------|
| `useDataState<T>` | `src/common/hooks/useDataState.ts` | Manage async state machine from INIT → LOADING → COMPLETED | `AppState.ts`, `ServerResponse.ts`, `HttpStatusCode.ts` |

#### Internal State Machine

```
INIT (state=INIT, data=null)
  │
  └─ execute(apiCall) called
       │
       ▼
  LOADING (state=LOADING)
       │
       ├─ apiCall succeeds → setAppState({ COMPLETED, isSuccess: true, data: response.data })
       │
       └─ apiCall throws   → setAppState({ COMPLETED, isError: true, status: 500, data: null })
```

#### execute() Contract

```ts
execute(apiCall: () => Promise<ServerResponse<T>>): Promise<void>
```

1. Sets `state: LOADING`
2. Awaits `apiCall()`
3. On success: `state: COMPLETED, isSuccess: true, data: response.data`
4. On failure (response error or thrown exception): `state: COMPLETED, isError: true, data: null`

### View

The View layer uses `AppStateHandler` to conditionally render based on the current `AppState`. It receives state and callbacks from the ViewModel via props.

| Name | File Path | Purpose | Responsibilities | Imports From |
|------|-----------|---------|------------------|--------------|
| `AppStateHandler` | `src/common/components/organisms/AppStateHandler.tsx` | Conditional render based on AppState | Route to consumer-injected Loading/Error/Empty/Success UI via context (`AppStateContext`) or slot props | `AppState.ts`, `AppStateContext.ts`, `HttpStatusCode.ts` |

#### AppStateHandler Rendering Logic

Slot props override context per-instance. Context is wired at root via `AppStateProvider`.

```
appState.state === LOADING
  → loadingComponent slot || context.Loading || null

appState.isError || status === 0
  → errorComponent slot || context.Error(message=errorMessage) || null

appState.isSuccess && data !== null
  ├─ emptyCondition(data) === true
  │    → emptyComponent slot || context.Empty || null
  ├─ children provided      → render children
  └─ SuccessComponent       → <SuccessComponent appState={appState} />

default (INIT)
  → emptyComponent slot || context.Empty || null
```

---

## Dual-Platform Transport

### WEB

```
Repository          →  ViewModel (hook)    →  View
ApiService calls       useDataState wraps     AppStateHandler renders
ServerResponse         AppState               loading/error/empty/success
```

### ELECTRON

```
Repository          →  ViewModel (hook)    →  View
IpcService calls       useDataState wraps     AppStateHandler renders
ServerResponse         AppState               loading/error/empty/success
```

The ViewModel and View layers are identical across both platforms. Only the transport differs — the Repository calls `ApiService` (WEB) or `IpcService` (ELECTRON), both returning `ServerResponse<T>`.

---

## Feature Requirements Traceability

| Feature Requirement | Documented In |
|---------------------|---------------|
| WEB pattern (Repository→ViewModel→View flow) | Architecture Layers section |
| ELECTRON pattern (IpcService instead of ApiService) | Dual-Platform Transport section |
| Full example with all three layers | Full Example section |
| Rules (ApiService/IpcService, AppStateHandler, hooks) | Rules section |
| Edge cases | Edge Cases + Common Pitfalls sections |
| Non-Responsibilities | Non-Responsibilities section |

---

## Full Example

### Repository

```ts
// WEB — uses ApiService
api = getApiService(API_BASE_URL, literal)    // from astra

userRepo:
  getUser(id) → api.get("users/" + id)
```

```ts
// ELECTRON — uses IpcService
ipc = new IpcService()                        // from astra

userRepo:
  getUser(id) → ipc.invoke("getUser", id)
```

### ViewModel

```ts
useUserViewModel(id):
  [userState, fetchUser] = useDataState(
    {},
    { unexpectedErrorMessage: t("common.errors.unexpected") }
  )

  on mount / when id changes:
    fetchUser(() → userRepo.getUser(id))

  return:
    userState
    retry = () → fetchUser(() → userRepo.getUser(id))
```

`t()` represents the app's localization function — any system works; this is an app-layer concern.

### View

```tsx
UserView(id):
  { userState, retry } = useUserViewModel(id)

  AppStateHandler(appState=userState, emptyCondition=(u) → !u, errorMessage="Failed to load user."):
    UserDetail(user=userState.data)

  // wire retry to a button in error UI if needed
```

Error state is rendered automatically by `AppStateHandler`. Wire `retry` to a retry button in the error UI if needed — `AppStateHandler` does not manage retry internally.

---

## Rules

- Feature repositories must use `ApiService` (WEB) or `IpcService` (ELECTRON) — never import axios or `window.electronAPI` directly
- Feature views must use `AppStateHandler` — no manual branching on `isError`/`isSuccess`
- ViewModels are hooks — no class-based ViewModels
- One `useDataState` per async operation — compose multiple calls with multiple hook instances
- Every feature that performs async data loading must use `useDataState<T>` for state management
- ViewModel hooks must be the exclusive owners of feature state
- Components must never call `useDataState` directly — they receive data via props from a page-level container that composes the ViewModel
- Always handle all four states: INIT (render nothing), LOADING (spinner), ERROR (error message), SUCCESS (data)
- Always check `data !== null` before accessing data properties

---

## Edge Cases

- **Multiple async operations in one ViewModel**: Use one `useDataState` per operation — they are independent state machines
- **Shared ViewModel across Views**: Each View mounts its own ViewModel hook instance; state is not shared between Views unless lifted into a shared context
- **Retry on error**: Expose `execute()` (or a wrapper) from the ViewModel return value; wire it to a retry button in the View — `AppStateHandler` does not manage retry
- **ViewModel unmount mid-request**: The `mountedRef` guard in `useDataState` drops the response if the component unmounts before the request completes; no manual cleanup needed
- **API returns success with `data: null`**: `isSuccess = true`, `data = null` — AppStateHandler falls to `<EmptyState />`
- **`execute()` called while already LOADING**: New request starts; previous result may overwrite — caller should guard with `if (appState.state !== StateType.LOADING)`
- **`apiCall` throws non-ServerResponse error**: Caught by try/catch → `isError = true, status: 500, data: null` — graceful degradation
- **`AppState<TypeA>` used where `AppState<TypeB>` expected**: No TypeScript error if shapes align — silent logic error; use branded types for strict differentiation

---

## Best Practices

### Rules Table — Do

| Rule | Rationale | Code Example |
|------|-----------|--------------|
| Use for async data flows | `useDataState` was designed for API calls, file loading, async computations | `execute(() => api.fetchUsers())` |
| Keep ViewModel in feature folders | Co-location with consuming components prevents cross-feature coupling | `features/users/hooks/useUsers.ts` |
| Use `AppStateHandler` for consistent UI | Standardizes loading/error/empty/success across all features | `<AppStateHandler appState={...}>` |
| Type your state generically | `AppState<User[]>` prevents accessing wrong shape | `useDataState<User[]>()` |
| Extract custom hooks | Reuse state logic without duplicating `useDataState` calls | Wrap `useDataState` in `useUsersViewModel()` |
| Pass `unexpectedErrorMessage` from `useLanguage()` | Prevents hardcoded English fallback on exception — required by Localization invariant | `useDataState<T>({}, { unexpectedErrorMessage: literal['common.errors.unexpected'] })` |
| Use LOADING's `prev.data` for stale-while-reloading | LOADING preserves previous data — display stale content with a spinner overlay instead of blanking the view | `data={appState.data ?? []}` while `state === LOADING` |

### Rules Table — Don't

| Anti-pattern | Why | Instead |
|--------------|-----|---------|
| Business logic in components | Violates MVVM; untestable | ViewModel hook |
| Skip error states | Users see blank UI on failure | Always handle `isError` |
| Mutate state directly | Bypasses state machine; inconsistent UI | Use `setAppState` or `execute` |
| Couple ViewModel to specific components | Reduces reusability | Return plain state + actions |
| Import axios or `window.electronAPI` in features | Bypasses transport abstraction; breaks target-consistency | Use `ApiService` (WEB) or `IpcService` (ELECTRON) via Repository |

---

## Testing Reference

### Constructing Test AppState Values

```ts
// Success state
const successState: AppState<User[]> = {
  state: StateType.COMPLETED,
  isError: false,
  isSuccess: true,
  status: HttpStatusCode.SUCCESS,
  statusMessage: '',
  data: [{ id: '1', name: 'Test' }],
};

// Error state
const errorState: AppState<User[]> = {
  state: StateType.COMPLETED,
  isError: true,
  isSuccess: false,
  status: HttpStatusCode.INTERNAL_SERVER_ERROR,
  statusMessage: 'Failed to load',
  data: null,
};

// Loading state
const loadingState: AppState<User[]> = {
  state: StateType.LOADING,
  isError: false,
  isSuccess: false,
  status: StateCode.IDLE,
  statusMessage: '',
  data: null,
};
```

---

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Forgetting `execute()` call | State stays at INIT forever; no data loaded | Call `execute()` in `useEffect` or event handler |
| Not checking `data !== null` | `Cannot read properties of null` on success path | Always guard: `if (data !== null) { ... }` |
| Missing error boundaries | Unhandled ViewModel exceptions crash entire tree | Wrap page with `<ErrorBoundary>` |
| Calling `execute()` on already-LOADING state | Duplicate requests, flickering UI | Guard with `if (appState.state !== StateType.LOADING)` |
| `AppState<TypeA>` where `AppState<TypeB>` expected | Silent logic errors if shapes are similar | Use branded types for strict differentiation |
| Blanking view on re-fetch | LOADING preserves `prev.data` — replacing content with spinner causes content flicker | Show stale data with overlay spinner: `appState.state === LOADING && appState.data !== null` |
| Omitting `unexpectedErrorMessage` | Exception catch produces empty `statusMessage` that `ErrorState` renders without text | Always pass `literal['common.errors.unexpected']` as `options.unexpectedErrorMessage` |
| Skipping retry guidance | `ErrorState` shows error but user cannot recover | Expose `execute` ref from ViewModel; pass as `onRetry` callback to error UI |
| Importing transport layer in ViewModel or View | Repository leaks transport details (axios, electronAPI) into upper layers | Code review enforces `target-consistency.md` — only Repository calls `ApiService` or `IpcService` |

---

## Testing Strategy

| Test Target | Approach | Example |
|-------------|----------|---------|
| ViewModel hook (isolated) | `renderHook` + mock API | `const { result } = renderHook(() => useDataState<User>())` |
| State transitions | Call `execute` in `act`, assert state changes | `expect(result.current[0].isSuccess).toBe(true)` |
| Error handling | Mock API to reject | `expect(result.current[0].isError).toBe(true)` |
| AppStateHandler rendering | Pass different AppState values, assert rendered output | `render(<AppStateHandler appState={...}>...</>)` |


---

## Non-Responsibilities

MVVM Wiring does not define:

- the internal implementation of `ApiService`, `IpcService`, `useDataState`, or `AppStateHandler` — see individual feature docs
- global state management — each ViewModel hook instance is local to its component tree
- routing or navigation — those are application concerns outside this pattern
- authentication or authorization — those are handled at the Repository or application layer

---

## Error Handling

| Condition | Behavior | Severity |
|-----------|----------|----------|
| Component unmount during request | `mountedRef` guard prevents state update after unmount | Safe — no stale update, no warning |
| `execute()` called while already LOADING | New request starts; previous result may overwrite | Logic error — caller should guard |
| API returns success with `data: null` | `isSuccess = true`, `data = null` | Edge case — AppStateHandler falls to `<EmptyState />` |
| `apiCall` throws non-ServerResponse error | Caught by try/catch → `isError = true, status: 500, data: null` | Graceful |
| `AppState<TypeA>` used where `AppState<TypeB>` expected | No TypeScript error if shapes align | Silent logic error |
| Business logic in component | Code review, lint rules | High |
| `execute()` never called | Static analysis (unused variable) | High |
| `data` accessed without null check | Runtime `TypeError` | Critical |
| No error state handling | User sees infinite loading or blank UI | High |
| State type mismatch | Silent logic error at runtime | Medium |
| ViewModel calls imported inside component | Code review | High |

---

## Non-Functional Requirements

| Requirement | Target | Enforcement |
|-------------|--------|-------------|
| Type safety | Generic `T` parameter | TypeScript strict |
| State consistency | State transitions are deterministic | Code review |
| Performance | Single `useState` per hook instance | Architectural |
| Reusability | ViewModel hooks composable per feature | Feature structure pattern |
| SSR compatibility | State initializes to `INIT` | No browser APIs used |
| Consistency | Uniform MVVM pattern across all features | Code review |
| Testability | ViewModels testable without UI rendering | Architectural |
| Co-location | ViewModel in `hooks/` next to feature | Feature structure |

---

## Architecture Compliance Review

### Applied Patterns

| Invariant | Compliance | Evidence |
|-----------|------------|----------|
| MVVM | ✅ Full | Three-layer separation: `useDataState` (VM), `AppState` (M), `AppStateHandler` (V) |
| Stateless UI | ✅ Full | State owned by hooks; components receive data via props |
| Target Consistency | ✅ Full | ViewModel/View identical across WEB and ELECTRON — only Repository differs per `target-consistency.md` |
| Service Abstraction | ✅ Full | Repository uses `ApiService` or `IpcService` — ViewModel agnostic per `runtime-boundary.md` |
| Public API Stability | ✅ Full | All symbols exported through `src/lib.ts` |
| Dependency Safety | ✅ Full | Only React `useState` dependency |
| Feature Structure | ✅ Full | `hooks/`, `state/`, `components/organisms/` separation |

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No built-in cancellation | Stale requests may update unmounted components | Consumer must implement cleanup/abort |
| No deduplication | Duplicate requests for same data | Consumer memoization or React Query integration |
| No retry logic | Transient failures render error immediately | Consumer-level retry wrapper |
| Target inconsistency | Repository leaks transport details into ViewModel | Code review enforces `target-consistency.md` — no `window.electronAPI` or `axios` above Repository |
| No automated lint enforcement | Conventions rely on manual code review | Future enhancement: custom ESLint rules |
| No CLI scaffolding | Boilerplate inconsistency across features | Future enhancement: generator CLI |
| Cross-feature ViewModel coupling | Feature A imports ViewModel from feature B | Code review gate |

### Gaps

- No AbortController integration — `mountedRef` prevents stale state but the underlying request still completes
- No request deduplication — concurrent `execute` calls race
- No dependent query support (fetch B after A succeeds)
- No optimistic update pattern
- No cache layer — every execute() triggers a full request
- No lint rules to automatically detect MVVM violations
- No scaffolding tool to generate ViewModel + test boilerplate
- No performance instrumentation for ViewModel re-render tracking
- No shared ViewModel library for cross-feature state coordination
- No guidance for form state management within MVVM

### Ownership

| Owner | Assets |
|-------|--------|
| **Astra** | useDataState, AppState, AppStateHandler abstractions |
| **Application** | ViewModel hooks, business logic, feature repository implementations |
| **Prana** | window.electronAPI, Electron IPC runtime |
| **Prati** | UI components injected via AppStateHandler slots/context |

---

## Module Map

```
hooks/useDataState.ts ──→ state/AppState.ts (StateType, AppState)
       │                     repo/ServerResponse.ts
       │                     repo/HttpStatusCode.ts
       │
       ├── Used by: feature ViewModel hooks (useUsers, useOrders, etc.)
       │       ↓
       │   feature/hooks/use<Feature>.ts
       │       ↓
       │   feature/view/pages/<Feature>Page.tsx
       │       ↓
       │   AppStateHandler (renders atoms)
       │
       └── Exported via: hooks/index.ts → common/index.ts → lib.ts
```

Every feature module follows this structure:

```
src/features/<Feature>/
  ├── hooks/use<Feature>.ts
  ├── model/<feature>.types.ts
  ├── repo/<feature>Api.ts
  └── view/
        ├── components/<Name>Component.tsx
        └── pages/<Feature>Page.tsx
```

---

## Final Rule

Every feature that performs async operations must follow the MVVM pattern exactly: `useDataState` in a ViewModel hook (never in a component), `AppState<T>` with a typed generic parameter, and `AppStateHandler` for conditional rendering. Business logic must live in the ViewModel or a domain utility — never in a component. Every async operation must handle all four states: INIT, LOADING, ERROR, and SUCCESS (with empty-data check). Violations are caught through code review until automated lint rules are introduced.

---

## Authorization

Authorization is not an MVVM concern. It lives in the Repository layer.

ViewModels receive already-authorized data from repositories and are unaware of any authorization decisions. Views render whatever AppState they receive with no auth screening or permission checks.

Astra owns the MVVM wiring (useDataState, AppState, AppStateHandler). The application owns auth enforcement in repository implementations — this is where API tokens, role checks, and permission gates are applied.
