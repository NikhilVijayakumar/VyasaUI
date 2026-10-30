# State Management

Astra's async state lifecycle for data operations. Every API call, form submission, or async operation follows the same three-phase pattern through a shared `AppState` contract.

## State Lifecycle

| Phase | `StateType` | Meaning |
|-------|-------------|---------|
| Uninitialized | `INIT = 0` | No operation started |
| Loading | `LOADING = 1` | Request in flight |
| Completed | `COMPLETED = 2` | Finished — check `isError`/`isSuccess` |

## AppState — the shared contract

| Field | Description |
|-------|-------------|
| `state` | Current lifecycle phase: `INIT`, `LOADING`, or `COMPLETED` |
| `isError` | True when the last operation completed with an error |
| `isSuccess` | True when the last operation completed successfully |
| `status` | HTTP response code, or `StateCode.IDLE` (1000) before any HTTP activity |
| `statusMessage` | Human-readable status description |
| `data` | Result payload; null until a successful response populates it |

`AppState` is parameterized over the data payload type — each feature defines the shape of `data` it expects.

Initial value: `state = INIT`, `isError = false`, `isSuccess = false`, `status = StateCode.IDLE` (1000), `statusMessage = ''`, `data = null`.

## Status Codes

`StateCode.IDLE = 1000` — initial status before any HTTP activity. Defined [below](#statecode).

`HttpStatusCode.INTERNET_ERROR = 0` — no network / connection refused. `AppStateHandler` uses this to detect offline conditions.

## StateCode

Non-HTTP status values used before or outside HTTP activity:

| Value | Code | Meaning |
|-------|------|---------|
| `IDLE` | `1000` | Initial status — no operation has started |

`StateCode.IDLE` is the initial value of `AppState.status`. The deprecated `HttpStatusCode.IDLE` alias remains for compatibility.

## State Transitions

| From | To | Trigger |
|------|----|---------|
| INIT | LOADING | `execute()` called |
| LOADING | COMPLETED | API call resolves or throws |
| LOADING | LOADING | `execute()` called again (concurrent) — each completion can update state; no invocation-order guard |
| COMPLETED | LOADING | `execute()` called again (retry/refresh) |

## When to Use

- **Yes**: API calls, form submissions, any async operation
- **No**: UI-only local state, global app configuration

## Non-Responsibilities

State management does not:

- execute API calls — that is `useDataState.execute()`
- render UI from state — that is `AppStateHandler`
- normalize transport errors — that is `ApiService` (WEB) or `IpcService` (ELECTRON) in the Repository layer
- manage global or cross-component state — each `useDataState` instance is local to its ViewModel hook

## Building Blocks

- [repository.md](./repository.md) — HTTP client, response normalization (`ApiService`, `ServerResponse`, `HttpStatusCode`) for WEB
- [ipc-service.md](./ipc-service.md) — IPC service abstraction (`IpcService`, `ServerResponse`) for ELECTRON
- [use-data-state.md](./use-data-state.md) — hook that manages `AppState` transitions
- [app-state-handler.md](./app-state-handler.md) — component that routes UI based on `AppState`
- [mvvm-wiring.md](./mvvm-wiring.md) — full pattern: Repository → ViewModel → View

## Edge Cases

- **Concurrent operations**: Multiple `execute()` calls in flight produce interleaved state — key state by operation if ordering matters
- **Unmount during request**: `useDataState` guards via `mountedRef` — updates dropped after unmount
- **Rapid re-trigger**: Loading→completed cycles before user sees result — debounce or abort if needed

## See Also

- [Glossary](../concepts/glossary.md)
- [Authorization Model](../concepts/authorization.md)
- [MVVM Pattern](../architecture/core/mvvm-pattern.md)
