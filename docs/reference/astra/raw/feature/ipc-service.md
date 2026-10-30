# IPC Service Layer

IPC communication wrapper for Electron targets. All Electron IPC access in Astra goes through this layer — feature repositories never call `window.electronAPI` directly.

## `IpcService`

`IpcService` is the service abstraction over Electron IPC. It wraps `window.electronAPI` (exposed by Prana's preload context bridge) and normalizes all responses into `ServerResponse`.

| Method | Parameters | Returns |
|--------|------------|---------|
| `invoke` | `channel` (string), optional `...args` | Promise of ServerResponse |
| `send` | `channel` (string), optional `...args` | void |
| `receive` | `channel` (string), `callback` | unsubscribe function `() → void` |

### `invoke`

Calls `window.electronAPI.invoke(channel, ...args)` and wraps the return value in `ServerResponse`.

```
ipc = new IpcService()

// channel maps to ipcMain.handle('tasks:list', ...)
// args: optional payload passed to the handler
result = await ipc.invoke("tasks:list")
```

**Error normalization**: Invoke failures are normalized unless the optional `onError` callback itself throws:

| Cause | `status` in response |
|-------|----------------------|
| `window.electronAPI` returns a `ServerResponse` instance | Status from the instance; other values are wrapped as success |
| Communication failure | `HttpStatusCode.INTERNAL_SERVER_ERROR` (500) |
| Unexpected exception | `HttpStatusCode.INTERNAL_SERVER_ERROR` (500) |
| `window.electronAPI` unavailable | `HttpStatusCode.INTERNAL_SERVER_ERROR` (500) |

### `send`

One-way message to the main process. No response expected.

```
ipc.send("channel", payload)
```

**Error handling**: Send errors are silently discarded; use invoke when acknowledgement is needed.

| Cause | Behavior |
|-------|----------|
| `window.electronAPI` unavailable | silently discarded |
| `window.electronAPI.send` throws | silently discarded |

### `receive`

Listen for messages pushed from the main process. Returns an unsubscribe function.

```
unsubscribe = ipc.receive("channel", callback)
```

The callback is invoked each time the main process sends a message on the channel. The caller is responsible for calling `unsubscribe()` when the listener is no longer needed.

**Lifecycle** — `receive` owns a persistent listener. Call `unsubscribe()` in component teardown to prevent memory leaks and stale callbacks:

```
on mount:
  unsubscribe = ipc.receive("progress:update", (data) → handleData(data))

on unmount:
  unsubscribe()
```

**Error normalization:**

| Cause | Behavior |
|-------|----------|
| `window.electronAPI` unavailable | returns no-op unsubscribe; no listener registered |
| Callback throws | exception propagates to the caller; IpcService does not catch callback errors |
| Main process disconnects mid-session | no notification; callback stops firing |

## Wiring Push Events into AppState

`receive` delivers push data outside the request/response cycle. To integrate push events with AppState, use `setAppState` from `useDataState`:

```
useProgressViewModel():
  [progressState, _, setProgressState] = useDataState()

  on mount:
    unsubscribe = ipc.receive("progress:update", (data) → {
      setProgressState((prev) → {
        ...prev,
        state: COMPLETED,
        isSuccess: true,
        data: data
      })
    })

  on unmount:
    unsubscribe()

  return { progressState }
```

`setAppState` is the correct integration point — `execute()` is for request/response patterns only. See [use-data-state.md](./use-data-state.md) for `setAppState` usage rules.

## Usage in a Feature Repository

```
ipc = new IpcService()

taskRepository:
  list()        → ipc.invoke("tasks:list")
  get(id)       → ipc.invoke("tasks:get", { id })
  create(data)  → ipc.invoke("tasks:create", data)
  update(data)  → ipc.invoke("tasks:update", data)
  delete(id)    → ipc.invoke("tasks:delete", { id })
  notify()      → ipc.send("tasks:notify")
  onProgress(callback)  → ipc.receive("tasks:progress", callback)
```

The repository contract is identical to an HTTP repository for `invoke`. Only the transport differs.

## Requirements

`IpcService` requires:

- `window.electronAPI` to be exposed by a preload script via `contextBridge.exposeInMainWorld`
- The preload script to expose at minimum an `invoke` method
- An ambient type declaration for `window.electronAPI` visible to the consumer project

If `window.electronAPI` is not available (non-Electron context or preload not yet loaded):
- `invoke` returns a normalized `ServerResponse.error(...)` with status 500
- `send` silently discards the call
- `receive` returns a no-op unsubscribe function; no listener is registered

## Non-Responsibilities

`IpcService` does not:

- register `ipcMain.handle(...)` handlers — that belongs to the main process (Prana or consumer-owned)
- expose `contextBridge` or `ipcRenderer` — those are runtime infrastructure owned by Prana
- manage React state — that is `useDataState` (via `execute` for request/response, via `setAppState` for push events)
- render loading/error/success UI — that is `AppStateHandler`
- decide when to fetch — that is the ViewModel (`useEffect` in a hook)
- catch or suppress callback errors from `receive` — caller is responsible for defensive callbacks

## See Also

- [repository.md](./repository.md) — parallel WEB transport; `ServerResponse` that `invoke` returns
- [use-data-state.md](./use-data-state.md) — hook that calls the repository and updates `AppState`; `setAppState` for push event wiring
- [mvvm-wiring.md](./mvvm-wiring.md) — ELECTRON MVVM pattern
- [Runtime Boundary Invariant](../architecture/invariants/runtime-boundary.md) — Astra vs Prana ownership rules
