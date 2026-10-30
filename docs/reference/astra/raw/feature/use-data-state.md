# useDataState

Hook that manages `AppState` transitions for async data operations. The ViewModel primitive — keeps UI components stateless by owning all async state.

## Signature

```
[appState, execute, setAppState] = useDataState(customInitialState?, options?)
```

- `appState` — current `AppState`, drives all rendering
- `execute(apiCall)` — wraps an async call, manages state transitions automatically
- `setAppState` — direct setter for manual overrides (optimistic updates, resets)
- `customInitialState` — partial AppState override for the initial value (e.g. pre-loaded data)
- `options.unexpectedErrorMessage` — fallback message when `apiCall` throws unexpectedly (status 500 path)

## What `execute` does

```
1. set state → LOADING
2. await apiCall()
3. success  → set state → COMPLETED, isSuccess = true, data = response.data, ...
   error    → set state → COMPLETED, isError = true, status = response.status, ...
   throw    → set state → COMPLETED, isError = true, status = 500, statusMessage = options.unexpectedErrorMessage (if set, otherwise empty string)
4. skip update if component unmounted during request (mountedRef guard)
```

LOADING preserves `prev.data` — supports stale-while-reloading UX.

## Basic Usage

```
useUserViewModel(id):
  [userState, fetchUser] = useDataState()

  on mount / when id changes:
    fetchUser(() → userRepo.getUser(id))

  return { userState }
```

## Custom Initial State

Pass a partial AppState as `customInitialState` to override default INIT values — for example, to pre-populate `data` from a cache before the first fetch completes.

## Error Message Localization

Pass `options.unexpectedErrorMessage` from your app's localization system. When none is provided, `statusMessage` is an empty string on unexpected exceptions.

```
[state, execute] = useDataState(
  {},
  { unexpectedErrorMessage: t("common.errors.unexpected") }
)
```

`t()` represents whichever localization hook your app uses — this is an app-layer concern, not astra's.

## Invariants

- TypeScript expects `apiCall` to return a `ServerResponse`. No instance check is made at runtime; invalid values may be read or may throw. Thrown errors result in COMPLETED with status 500 and the configured fallback message.
- Concurrent `execute()` calls race; each completion can update state. There is no latest-request guard.
- Calling `execute()` while LOADING starts another request; responses are not discarded based on invocation order.
- `setAppState` is a React dispatch — avoid calling it after unmount (the mountedRef guard inside `execute` covers the async path; direct calls do not have this protection)

## Non-Responsibilities

`useDataState` does not:

- make HTTP or IPC calls — that is the Repository (`ApiService` for WEB, `IpcService` for ELECTRON)
- render loading/error/empty/success UI — that is `AppStateHandler`
- provide localization strings — pass `unexpectedErrorMessage` via options using your app's localization system
- manage global state — each `useDataState` instance is scoped to its ViewModel hook

## See Also

- [state-management.md](./state-management.md) — `AppState` shape and `StateType` enum
- [repository.md](./repository.md) — `ServerResponse` that `execute` consumes (WEB)
- [ipc-service.md](./ipc-service.md) — `IpcService` that `execute` consumes (ELECTRON)
- [app-state-handler.md](./app-state-handler.md) — component that renders UI from `appState`
- [mvvm-wiring.md](./mvvm-wiring.md) — full Repository → ViewModel → View pattern
