# AppStateHandler — Technical Blueprint

---

# Feature Summary

A generic conditional-rendering component that inspects an `AppState<T>` object and renders the appropriate UI: LoadingState → ErrorState → EmptyState → Success content (children or SuccessComponent). Eliminates repetitive loading/error/empty conditional trees in feature containers. AppStateHandler is target-agnostic — it renders AppState identically for both WEB and ELECTRON targets since the transport difference is invisible to it.

---

# Implementation Reference
## Status
Implemented

## Source Files
| File | Purpose |
|------|---------|
| `src/common/components/organisms/AppStateHandler.tsx` | Component implementation |
| `src/common/components/organisms/AppStateContext.ts` | `AppStateComponents` interface, `AppStateContext`, `AppStateProvider` |
| `src/common/components/organisms/AppStateHandler.test.tsx` | Unit tests (vitest) |
| `src/common/state/AppState.ts` | `AppState<T>` interface, `StateType` enum |
| `src/common/repo/HttpStatusCode.ts` | `HttpStatusCode` enum for INTERNET_ERROR detection |

## Public API

```typescript
// Exported via components/organisms barrel → common/index.ts → lib.ts

export interface AppStateComponents {
  Loading?: FC;
  Error?: FC<{ message?: string }>;
  Empty?: FC;
}

export const AppStateContext: React.Context<AppStateComponents>;
export const AppStateProvider: React.Provider<AppStateComponents>;

export interface AppStateHandlerProps<T, S extends AppState<T> = AppState<T>> {
  appState: S;
  SuccessComponent?: FC<{ appState: S }>;
  emptyCondition?: (data: T) => boolean;
  errorMessage?: string;
  children?: ReactNode;
  loadingComponent?: ReactNode;  // slot prop — overrides context Loading
  errorComponent?: ReactNode;    // slot prop — overrides context Error
  emptyComponent?: ReactNode;    // slot prop — overrides context Empty
}

export default function AppStateHandler<T, S extends AppState<T>>(
  props: AppStateHandlerProps<T, S>,
): ReactElement | null;
```

---

# Architecture Mapping
| Pattern | Feature Usage | Reason |
|---------|--------------|--------|
| Atomic Hierarchy | Organism tier | Orchestrates conditional rendering via context and slot props. No internal atom dependencies — UI components are consumer-provided. Template-agnostic. |
| Stateless UI | Enforcer | `AppStateHandler` is the mechanism that keeps parent components stateless — owns the conditional routing so parents don't need state or branching. |
| Design System Independence | Enforced | No import of any design system. Loading/Error/Empty UI provided by consumer via `AppStateProvider` context or slot props. |
| Localization | Full | `errorMessage` prop accepts a translated string. No hardcoded strings in this component or its rendering path. |
| Dependency Safety | Minimal | Depends only on React, internal AppState types, and `AppStateContext`. |
| Public API Stability | Stable | Default export from `AppStateHandler.tsx`. Public API: `AppStateHandlerProps<T, S>`, `AppStateProvider`, `AppStateContext`, `AppStateComponents`. |
| Platform Transport | Agnostic | AppStateHandler consumes AppState — transport (ApiService/IpcService) is invisible; identical rendering across WEB and ELECTRON targets |

---

## Feature Requirements Traceability
| Feature Spec Requirement | Technical Implementation | Section |
| AppStateHandler conditional rendering | State Evaluation Priority (4-step fixed order) | Technical Structure |
| Loading/Error/Empty/Success states | State Evaluation Priority tree | Technical Structure |
| AppStateProvider and AppStateComponents | Architecture Mapping row + AppStateContext source file | Implementation Reference |
| Slot props override context | Invariant Rules | Technical Structure |
| emptyCondition | Invariant Rules: only called when isSuccess && data !== null | Technical Structure |
| No retry wiring | Gaps section | Architecture Compliance Review |
| INIT fallback → empty render | State Evaluation Priority step 4 | Technical Structure |
| children vs SuccessComponent precedence | Invariant Rules | Technical Structure |
| SuccessComponent receives appState as prop | Public API: `FC<{ appState: S }>` | Implementation Reference |

---

# Technical Structure

## Views
| View | File Path | Purpose | Responsibilities | Imports From |
|------|-----------|---------|------------------|--------------|
| AppStateHandler | `src/common/components/organisms/AppStateHandler.tsx` | Conditional state router | Evaluate appState in priority order: LOADING → ERROR → EMPTY → SUCCESS → fallback EMPTY; reads context via `useContext(AppStateContext)`; slot props override context | `react`, `state/AppState`, `repo/HttpStatusCode`, `components/organisms/AppStateContext` |

## State Model
| State | File Path | Type Declaration | Transitions | Owner |
|-------|-----------|-----------------|-------------|-------|
| AppState<T> | `src/common/state/AppState.ts` | `interface AppState<T> { state: StateType; isError: boolean; isSuccess: boolean; status: HttpStatusCode; statusMessage: string; data: T \| null; }` | INIT → LOADING → COMPLETED (with isError/isSuccess) | `useDataState` hook |

## State Evaluation Priority (fixed order)

Slot props (per-instance) take precedence over context (root-level). Context is provided by `AppStateProvider`.

```
1. state === StateType.LOADING
   ├── loadingComponent slot → render slot
   ├── context.Loading       → <Loading />
   └── (neither)             → null

2. isError || status === INTERNET_ERROR
   ├── errorComponent slot   → render slot
   ├── context.Error         → <Error message={errorMessage} />
   └── (neither)             → null

3. isSuccess && data !== null
   ├── emptyCondition?.(data) === true
   │   ├── emptyComponent slot → render slot
   │   ├── context.Empty       → <Empty />
   │   └── (neither)           → null
   ├── children provided       → children
   └── SuccessComponent        → <SuccessComponent appState={appState} />

4. fallback (INIT / no flags)
   ├── emptyComponent slot → render slot
   ├── context.Empty       → <Empty />
   └── (neither)           → null
```

## Generic Type Parameters
- `T`: The data type held by AppState (e.g., `User[]`)
- `S extends AppState<T>`: The specific AppState subtype (allows extension with additional fields)

## Data Flow Sequence
```
Parent passes appState: AppState<T>
  → AppStateHandler reads appState fields
    → Branches to one of 4 internal atom components
    → Returns <ReactElement>
```

## Invariant Rules
- Evaluation order is fixed: LOADING > ERROR > EMPTY > SUCCESS > fallback EMPTY
- Slot props override context: `loadingComponent` overrides `context.Loading`, `errorComponent` overrides `context.Error`, `emptyComponent` overrides `context.Empty`
- `emptyCondition` is called only when `isSuccess && data !== null`
- `children` takes precedence over `SuccessComponent` when both provided
- Fallback state (INIT, no success, no error) renders empty slot or `context.Empty` or null
- `errorMessage` is passed to `context.Error` as `message` prop — if omitted, consumer's Error component receives `undefined`
- `SuccessComponent` receives the full `appState` as prop (not just `data`)
- Component is generic — reusable across any async data type
- No design system imports — all UI is consumer-injected

---

# Validation Design
| Rule | Trigger | Failure Behavior | Recovery Behavior |
|------|---------|-----------------|-------------------|
| `appState` is required | TypeScript | Compilation error | Provide AppState<T> |
| `state === LOADING` | Runtime eval | Renders LoadingState | N/A — valid state |
| `isError` with errorMessage | Runtime eval | Renders ErrorState with custom message | Consumer checks error |
| `status === INTERNET_ERROR` | Runtime eval | Renders ErrorState even if isError false | N/A — valid state |
| `emptyCondition` returns true | Runtime eval | Renders EmptyState | Consumer adjusts data or condition |
| No `children` or `SuccessComponent` | Runtime eval (success path) | Falls through to EmptyState | Provide one or the other |
| Both `children` and `SuccessComponent` | Runtime eval | `children` wins silently | Consumer removes unused |

---

# Error Handling
| Error Type | Cause | System Response | User Response |
|------------|-------|-----------------|---------------|
| Missing `errorMessage` | Consumer omits prop | Passes `undefined` to ErrorState — ErrorState uses its own default | Provide `errorMessage` |
| `emptyCondition` not provided | Consumer omits | `emptyCondition?.(data)` returns `undefined` (falsy) → skips empty check, renders success | Provide condition or accept behavior |
| `SuccessComponent` throws | Component error | Error propagates to parent — no ErrorBoundary in AppStateHandler | Wrap in ErrorBoundary |
| `appState` has unexpected shape | Consumer passes malformed state | TypeScript error at compile time | Fix type |
| All flags false (INIT state) | Data never loaded | Falls through to EmptyState | Consumer triggers execute |

---

# Non-Functional Requirements
- **Performance**: O(1) decision tree. No re-render amplification — re-renders only when `appState` reference changes.
- **Accessibility**: Delegates to child atoms. LoadingState should have `aria-busy`; ErrorState should have `role="alert"`.
- **Bundle**: ~60 lines of logic. No external design system dependencies.
- **Testability**: 9 tests cover loading (context), loading (slot), error (context), error (slot), error (INTERNET_ERROR), success, empty, fallback (INIT), null return (no context/no slot).

---

# Architecture Compliance Review
## Applied Patterns
- Organism tier — composes atoms, orchestrates data flow
- State routing via fixed priority evaluation
- Generic component pattern with dual type params `<T, S>`
- Children vs. SuccessComponent dual API

## Risks
- `children` silently overwriting `SuccessComponent` may cause confusion (no warning logged)
- INFALLBACK → EmptyState is a design tradeoff — INIT state (never loaded) renders as "empty" which may be misleading
- Component is not memoized — `React.memo()` could prevent re-renders when parent re-renders with same `appState` reference

## Gaps
- No retry prop — retry is ViewModel's responsibility; consumers re-expose `execute()` as a retry function
- No animation transitions between states (loading→success flash)
- No ErrorBoundary — `SuccessComponent` errors propagate to parent

## Cross-References
- `use-data-state.md` — produces the AppState that AppStateHandler consumes
- `state-management.md` — AppState contract definition
- `mvvm-wiring.md` — full View rendering pattern

## Ownership
- Astra owns AppStateHandler
- Application owns UI components injected via slots/context
- Prati owns the design system atoms rendered inside AppStateHandler slots

---

# Module Map
| Module | File Path | Exports | Imports From |
|--------|-----------|---------|--------------|
| AppStateHandler | `src/common/components/organisms/AppStateHandler.tsx` | `AppStateHandlerProps<T,S>`, default export `AppStateHandler` | `react`, `state/AppState`, `repo/HttpStatusCode`, `components/organisms/AppStateContext` |
| AppStateContext | `src/common/components/organisms/AppStateContext.ts` | `AppStateComponents`, `AppStateContext`, `AppStateProvider` | `react` |
| AppState | `src/common/state/AppState.ts` | `AppState<T>`, `StateType`, `StateCode` | `repo/HttpStatusCode` |
| state barrel | `src/common/state/index.ts` | `AppState`, `StateType`, `StateCode` | re-exports from `AppState` |
| organisms barrel | `src/common/components/organisms/index.ts` | `AppStateHandler`, `AppStateHandlerProps`, `AppStateProvider`, `AppStateContext`, `AppStateComponents` | re-exports |

---

# Final Rule

AppStateHandler is the single declarative boundary for async UI routing in Astra. All feature containers that consume `useDataState` must use AppStateHandler (or an equivalent) to render loading/error/empty/success states — no manual conditional branching on `AppState` flags is permitted in feature components. The INIT→EmptyState fallback behavior is intentional but must remain documented. No business logic, data fetching, or persistence may be added to this component.

## Authorization

AppStateHandler is a pure rendering component — it receives an already-resolved AppState and routes to UI. No data access, no transport interaction, no auth enforcement. Authorization is irrelevant at this layer — it belongs in the Repository/Application layer. Files under test should include AppStateHandler in their auth-guard test suites only if parent components enforce auth.
