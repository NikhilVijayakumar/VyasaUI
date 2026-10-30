# AppStateHandler

Conditional-rendering component that routes UI based on `AppState`. Eliminates boilerplate loading/error/empty branching in feature views.

Astra does not own the UI for loading, error, or empty states — those are design-system concerns. `AppStateHandler` renders them via two mechanisms: **context** (app-wide defaults) and **slot props** (per-instance overrides). Both are optional; when neither is provided, the component returns null.

## Wiring UI Components

### Option A: AppStateProvider (recommended — configure once)

Set up at app root. All `AppStateHandler` instances in the tree use these components automatically.

```
AppStateProvider(value={
  Loading: MyLoadingSpinner,
  Error: ({ message }) → MyErrorBanner(message),
  Empty: MyEmptyPlaceholder
}):
  App
```

When using prati as the design system:

```
import { AppStateProvider } from "astra"
import { LoadingState, ErrorState, EmptyState } from "prati"

AppStateProvider(value={
  Loading: LoadingState,
  Error: ({ message }) → ErrorState(message),
  Empty: EmptyState
}):
  App
```

### Option B: Slot props (per-instance override)

Pass rendered JSX directly to each `AppStateHandler`. Slot props take precedence over context.

```
AppStateHandler(
  appState=state,
  loadingComponent=<Spinner />,
  errorComponent=<Banner message="Failed to load." />,
  emptyComponent=<EmptyList />
):
  children
```

## Props

| Prop | Required | Description |
|------|----------|-------------|
| `appState` | Yes | Current AppState — drives all render decisions |
| `loadingComponent` | No | ReactNode rendered during LOADING; overrides context Loading |
| `errorComponent` | No | ReactNode rendered on error; overrides context Error |
| `emptyComponent` | No | ReactNode rendered when empty or as INIT fallback; overrides context Empty |
| `errorMessage` | No | Passed to context Error component as `message` prop (ignored when `errorComponent` slot is used) |
| `SuccessComponent` | No | Component rendered on success; receives `appState` as prop |
| `emptyCondition` | No | `(data) → boolean` — true triggers empty render instead of success |
| `children` | No | Inline success content; takes precedence over `SuccessComponent` |

## Rendering Priority (fixed order)

```
1. state === LOADING
   ├── loadingComponent slot   → render slot
   ├── context.Loading         → render context component
   └── (neither)               → null

2. isError || status === 0
   ├── errorComponent slot     → render slot
   ├── context.Error(message)  → render context component
   └── (neither)               → null

3. isSuccess && data !== null
   ├── emptyCondition(data) = true
   │   ├── emptyComponent slot → render slot
   │   ├── context.Empty       → render context component
   │   └── (neither)           → null
   ├── children provided       → children
   └── SuccessComponent        → SuccessComponent(appState)

4. fallback (INIT, no data)
   ├── emptyComponent slot     → render slot
   ├── context.Empty           → render context component
   └── (neither)               → null
```

`children` takes precedence over `SuccessComponent` when both provided.

## Exports

```
AppStateHandler       — the component
AppStateHandlerProps  — prop types
AppStateProvider      — context provider (configure Loading/Error/Empty once at app root)
AppStateContext       — the React context (advanced use)
AppStateComponents    — type for the context value { Loading?, Error?, Empty? }
```

## `SuccessComponent` vs `children`

| | `SuccessComponent` | `children` |
|--|-------------------|------------|
| Receives `appState` as prop | Yes | No — access parent scope |
| Reusable across features | Yes | No |
| Preferred when | Component is defined separately | Inline content is simpler |

## Invariants

- INIT state (never fetched) falls through to empty render — intentional; trigger `execute()` to start loading
- `emptyCondition` is only evaluated when `isSuccess && data !== null`
- No retry wiring — `AppStateHandler` does not manage retry. The parent ViewModel re-exposes `execute()` (or a wrapper); the View wires it to a retry button
- Slot props always override context for the same render slot

## Non-Responsibilities

`AppStateHandler` does not:

- fetch data or trigger API calls — that is `useDataState.execute()`
- manage retry logic — the parent ViewModel re-exposes `execute()` as a retry function
- own or bundle UI components — Loading, Error, Empty come from the consumer's design system via `AppStateProvider` or slot props
- manage global state — reads `appState` passed as a prop and renders accordingly

## See Also

- [state-management.md](./state-management.md) — `AppState` shape
- [use-data-state.md](./use-data-state.md) — hook that produces `appState`
- [mvvm-wiring.md](./mvvm-wiring.md) — full end-to-end pattern
