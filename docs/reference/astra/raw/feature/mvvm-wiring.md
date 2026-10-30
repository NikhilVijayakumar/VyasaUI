# MVVM Wiring

How Repository, ViewModel hook, and View connect using Astra's building blocks. All async data flow follows this pattern.

## WEB

```
Repository          →  ViewModel (hook)    →  View
ApiService calls       useDataState wraps     AppStateHandler renders
ServerResponse         AppState               loading/error/empty/success
```

## ELECTRON

```
Repository          →  ViewModel (hook)    →  View
IpcService calls       useDataState wraps     AppStateHandler renders
ServerResponse         AppState               loading/error/empty/success
```

The ViewModel and View layers are identical. Only the transport differs.

## Full Example

### Repository

```
api = getApiService(API_BASE_URL, literal)    // from astra

userRepo:
  getUser(id) → api.get("users/" + id)
```

### ViewModel

```
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

```
UserView(id):
  { userState, retry } = useUserViewModel(id)

  AppStateHandler(appState=userState, emptyCondition=(u) → !u, errorMessage="Failed to load user."):
    UserDetail(user=userState.data)

  // wire retry to a button in error UI if needed
```

Error state is rendered automatically by `AppStateHandler`. Wire `retry` to a retry button in the error UI if needed — `AppStateHandler` does not manage retry internally.

## Rules

- Feature repositories must use `ApiService` (WEB) or `IpcService` (ELECTRON) — never import axios or `window.electronAPI` directly
- Feature views must use `AppStateHandler` — no manual branching on `isError`/`isSuccess`
- ViewModels are hooks — no class-based ViewModels
- One `useDataState` per async operation — compose multiple calls with multiple hook instances

## Edge Cases

- **Multiple async operations in one ViewModel**: Use one `useDataState` per operation — they are independent state machines
- **Shared ViewModel across Views**: Each View mounts its own ViewModel hook instance; state is not shared between Views unless lifted into a shared context
- **Retry on error**: Expose `execute()` (or a wrapper) from the ViewModel return value; wire it to a retry button in the View — `AppStateHandler` does not manage retry
- **ViewModel unmount mid-request**: The `mountedRef` guard in `useDataState` drops the response if the component unmounts before the request completes; no manual cleanup needed

## Non-Responsibilities

MVVM Wiring does not define:

- the internal implementation of `ApiService`, `IpcService`, `useDataState`, or `AppStateHandler` — see individual feature docs
- global state management — each ViewModel hook instance is local to its component tree
- routing or navigation — those are application concerns outside this pattern
- authentication or authorization — those are handled at the Repository or application layer

## See Also

- [repository.md](./repository.md) — `ApiService`, `ServerResponse` (WEB)
- [ipc-service.md](./ipc-service.md) — `IpcService`, `ServerResponse` (ELECTRON)
- [use-data-state.md](./use-data-state.md) — hook internals
- [app-state-handler.md](./app-state-handler.md) — component API
- [state-management.md](./state-management.md) — `AppState` contract
