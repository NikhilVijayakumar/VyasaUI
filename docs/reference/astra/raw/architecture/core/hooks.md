# Architecture: Hooks

## useDataState

The `useDataState` hook manages the state of asynchronous data operations (typically API calls). It centralizes INIT → LOADING → COMPLETED/ERROR transitions and is the canonical mechanism for async data in Astra's MVVM architecture.

### Usage

```typescript
import { useDataState, StateType } from 'astra';
import { usersApi } from '../repo/usersApi';

const [appState, execute] = useDataState<User[]>();

useEffect(() => {
  execute(() => usersApi.list());
}, []);

if (appState.state === StateType.LOADING) return <LoadingSpinner />;
if (appState.isError) return <ErrorMessage message={appState.statusMessage} />;
return <UserList data={appState.data} />;
```

### API

#### Parameters

- `customInitialState` (optional): `Partial<AppState<T>>` - Allows overriding the default initial state values.

#### Return Value

The hook returns a tuple `[appState, execute, setAppState]`:

1. **`appState`**: `AppState<T>` - The current state object (INIT, LOADING, COMPLETED, data, error, etc.).
2. **`execute`**: `(apiCall: () => Promise<ServerResponse<T>>) => Promise<void>` - Helper to auto-manage state transitions. Use this for all normal data fetching.
3. **`setAppState`**: `React.Dispatch<React.SetStateAction<AppState<T>>>` - Manual state setter. See below for when to use this.

---

## setAppState — Manual State Control

`setAppState` provides direct access to the state setter. It exists for advanced scenarios where `execute` is not sufficient.

### When to use `setAppState`

| Scenario | Recommended |
|----------|-------------|
| Loading data from an API | `execute()` |
| Refreshing data after a mutation | `execute()` |
| Optimistic UI update (apply before API confirms) | `setAppState()` |
| Manual state reset (e.g., clearing a form result) | `setAppState()` |
| Injecting state from a parent (e.g., SSR hydration) | `setAppState()` |

### Optimistic Update Pattern

```typescript
export const useItems = () => {
  const [listState, executeList] = useDataState<Item[]>();
  const [deleteState, executeDelete] = useDataState<boolean>();

  const deleteItem = async (id: string) => {
    // 1. Optimistically remove from UI immediately
    setListState((prev) => ({
      ...prev,
      data: prev.data?.filter((item) => item.id !== id) ?? null,
    }));

    // 2. Confirm with the API
    await executeDelete(() => itemsApi.delete(id));

    // 3. If it failed, re-fetch to restore correct state
    if (deleteState.isError) {
      executeList(() => itemsApi.list());
    }
  };

  return { listState, deleteItem };
};
```

### Manual Reset Pattern

```typescript
const [state, execute, setState] = useDataState<User>();

const reset = () => {
  setState({
    state: StateType.INIT,
    isError: false,
    isSuccess: false,
    status: HttpStatusCode.IDLE,
    statusMessage: '',
    data: null,
  });
};
```

### Rule

> **Never use `setAppState` for normal data fetching.** Always use `execute()` for API calls — it manages LOADING → COMPLETED/ERROR transitions automatically. Reserve `setAppState` for optimistic updates, manual resets, and state hydration.

---

## Architectural Recommendation: The ViewModel Pattern

While `useDataState` can be used directly in components, **Astra strongly recommends always wrapping it in a ViewModel (Custom Hook)**.

See [Feature Structure](feature-structure.md) for the canonical ViewModel placement in `hooks/use<Feature>.ts`.

### Why Use a ViewModel?

1. **Separation of Concerns**: Keeps UI logic (Components) separate from Business logic (ViewModels).
2. **Composition**: Allows managing multiple simultaneous API states (e.g., a list loading while a delete action is pending).
3. **Consistency**: Provides a uniform interface for components, regardless of complexity.

### Pattern: ViewModel as Orchestrator

For features needing multiple API calls (CRUD), compose multiple hooks within one ViewModel.

#### WEB — ApiService

```typescript
import { useEffect } from 'react';

export const useUsers = () => {
  // 1. State for the Main List (GET /users)
  const [listState, executeList] = useDataState<User[]>();

  // 2. State for a Specific User Detail (GET /users/:id)
  const [detailState, executeDetail] = useDataState<User>();

  // 3. State for an Action (DELETE /users/:id)
  const [deleteState, executeDelete] = useDataState<boolean>();

  // --- Actions ---

  const loadUsers = () => executeList(() => usersApi.list());

  const selectUser = (id: string) => executeDetail(() => usersApi.get(id));

  const deleteUser = (id: string) => executeDelete(() => usersApi.remove(id));

  // ORCHESTRATION: React side-effect watches state, not stale closures
  useEffect(() => {
    if (deleteState.isSuccess) {
      loadUsers();
    }
  }, [deleteState.isSuccess]);

  // --- Public Interface for the View ---
  return {
    // Data
    users: listState.data,
    selectedUser: detailState.data,

    // Granular Loading States (allows UI to show specific spinners)
    isListLoading: listState.state === StateType.LOADING,
    isDeleting: deleteState.state === StateType.LOADING,

    // Actions
    loadUsers,
    selectUser,
    deleteUser,
  };
};
```

#### ELECTRON — IpcService

The ViewModel is structurally identical. Only the repository import differs — the hook itself has no knowledge of the transport:

```typescript
import { useDataState } from 'astra';
import { tasksIpc } from '../repo/tasksIpc'; // IpcService-backed repository

export const useTasks = () => {
  const [listState, executeList] = useDataState<Task[]>();
  const [deleteState, executeDelete] = useDataState<boolean>();

  const loadTasks = () => executeList(() => tasksIpc.list());
  const deleteTask = (id: string) => executeDelete(() => tasksIpc.delete(id));

  useEffect(() => {
    if (deleteState.isSuccess) {
      loadTasks();
    }
  }, [deleteState.isSuccess]);

  return {
    tasks: listState.data,
    isListLoading: listState.state === StateType.LOADING,
    isDeleting: deleteState.state === StateType.LOADING,
    loadTasks,
    deleteTask,
  };
};
```

The `AppState` transitions, `useDataState` API, and return interface shape are identical across both targets. See [Target Consistency Invariant](../invariants/target-consistency.md).

## Related

- [Feature Structure](feature-structure.md) — Canonical ViewModel placement
- [MVVM Pattern](mvvm-pattern.md) — Architecture overview
- [State Management](state-management.md) — AppState and StateType reference
- [Repository](repository.md) — Data access layer
