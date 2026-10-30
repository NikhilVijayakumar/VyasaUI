# Integration Contract: State Management

Defines the `useDataState` hook and `AppStateHandler` component — the primary mechanisms for async state orchestration in Prati.

## useDataState

`useDataState` is a ViewModel-layer hook that manages async operation lifecycle. It produces a `DataState<T>` and an `execute` function.

### Type Signature

```typescript
function useDataState<T>(): [
  DataState<T>,
  (asyncFn: () => Promise<T>) => Promise<void>
];
```

### DataState

```typescript
interface DataState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
```

| Field | Meaning |
|-------|---------|
| `loading` | `true` while `execute` is in flight |
| `error` | Error message string if the last execution failed; `null` if no error |
| `data` | The resolved value of the last successful execution; `null` before first success or after error |

### Usage in ViewModel Hooks

`useDataState` belongs in the ViewModel layer, not in components:

```typescript
// hooks/useUserViewModel.ts
import { useDataState } from 'prati';
import { UserRepo } from '../repos/UserRepo';

export function useUserViewModel() {
  const [state, execute] = useDataState<User[]>();

  const loadUsers = () => execute(() => UserRepo.getAll());
  const createUser = (user: NewUser) => execute(() => UserRepo.create(user));

  return { state, loadUsers, createUser };
}
```

### Rules

- `useDataState` may only be called from ViewModel hooks (`hooks/use*.ts`) — never from component files directly
- Each hook instance manages one async operation at a time
- Multiple `useDataState` calls may be composed in a single ViewModel for independent state tracks

## AppStateHandler

`AppStateHandler` is a routing component that renders different UI based on the current `DataState`. It eliminates per-component loading/error branching.

### Type Signature

```typescript
interface AppStateHandlerProps<T> {
  appState: DataState<T>;
  LoadingComponent?: React.ReactNode;
  ErrorComponent?: React.ReactNode | ((props: { error: string; retry: () => void }) => React.ReactNode);
  SuccessComponent: (props: { data: T }) => React.ReactNode;
  retry?: () => void;
}
```

### Usage in Views

```typescript
// organisms/UserList.tsx — View layer
import { AppStateHandler } from 'prati';
import { useUserViewModel } from '../../hooks/useUserViewModel';

function UserList() {
  const { state, loadUsers } = useUserViewModel();

  useEffect(() => { loadUsers(); }, []);

  return (
    <AppStateHandler
      appState={state}
      LoadingComponent={<LoadingState />}
      ErrorComponent={({ error, retry }) => (
        <ErrorState message={error} onRetry={retry} />
      )}
      SuccessComponent={({ data }) => (
        <div>{data.map(user => <UserCard key={user.id} user={user} />)}</div>
      )}
      retry={loadUsers}
    />
  );
}
```

### Render Logic

```
if loading     → render LoadingComponent (or default spinner if omitted)
if error       → render ErrorComponent (or default error display if omitted)
if data        → render SuccessComponent with data
if none-of-the-above → render nothing (initial state before first load)
```

### Rules

- `AppStateHandler` must only be used in Views (components), never in ViewModels
- `SuccessComponent` receives `data` as a prop — it must be a pure presentation component
- `retry` should be wired to the ViewModel's execute function for error recovery
- Omitting `LoadingComponent` or `ErrorComponent` is acceptable for cases where the parent guarantees the state

## State Flow

```
ViewModel                          View
─────────                          ────
useDataState<T>() ──state──▶      AppStateHandler
       │                            ├── loading → LoadingComponent
       │                            ├── error   → ErrorComponent
       │                            └── data    → SuccessComponent
       │
execute(fn)  ◀── retry ──────────
```

## Related

- [MVVM Separation Invariant](../invariants/mvvm-separation.md) — ViewModel layer rules
- [Stateless UI Invariant](../invariants/stateless-ui.md) — why components must not own state
- [Feature Structure](feature-structure.md) — where `useDataState` and `AppStateHandler` live
- [Getting Started](getting-started.md) — provider setup
