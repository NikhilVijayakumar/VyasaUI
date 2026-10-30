# MVVM Separation Invariant

## Purpose

Astra implements MVVM (Model-View-ViewModel) architecture.

The View, ViewModel (state orchestration), and data access layers must remain separated. Each layer has distinct responsibilities and must not leak behavior into another layer.

MVVM separation guarantees:
- testability of each layer in isolation
- reusability of ViewModels across different Views
- replaceability of data sources without View changes
- clear ownership of state, logic, and presentation
- predictable debugging (faults map to specific layers)

---

## Architectural Rule

Each MVVM layer must own distinct responsibilities.

### View (Component)

The View is a pure presentation layer.

A View may:
- render UI based on props
- emit user events via callbacks
- manage UI interaction state (open, close, selected)
- compose sub-components
- use Prati theming and localization primitives (ThemeProvider context, useLanguage) if the consumer app depends on Prati

A View may NOT:
- fetch data
- call repositories or API services
- contain business or domain logic
- manage domain state
- persist data
- access localStorage, sessionStorage, or IndexedDB

### ViewModel (Hook/Orchestrator)

The ViewModel orchestrates state between Model and View. In the canonical feature structure (see [Feature Structure](../core/feature-structure.md)), ViewModels are implemented as custom hooks in `hooks/use<Feature>.ts`.

A ViewModel may:
- use `useDataState` to manage async state
- coordinate data flow between repositories and views
- transform data for presentation
- manage feature-level UI logic
- handle user event orchestration

A ViewModel may NOT:
- import UI components
- access DOM or rendering APIs
- contain JSX or template logic
- use useEffect for purposes other than data loading (DOM access, subscriptions, and browser API calls must remain in the View layer or platform adapters)
- persist data directly

### Repository/Model (Data Access)

The Repository provides data access abstraction.

A Repository may:
- make API calls via `ApiService`
- handle response parsing and error mapping
- provide typed response contracts
- abstract data source implementation

A Repository may NOT:
- import UI components or hooks
- contain rendering logic
- manage UI state
- know about View or ViewModel structure

---

## Allowed Patterns

### View: Pure Presentation

Allowed:

```tsx
// View.tsx
interface UserListViewProps {
  users: User[];
  onSelect: (id: string) => void;
  isLoading: boolean;
}

function UserListView({ users, onSelect, isLoading }: UserListViewProps) {
  if (isLoading) return <LoadingSpinner />;
  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} onClick={() => onSelect(user.id)}>
          {user.name}
        </ListItem>
      ))}
    </List>
  );
}
```

Reason:
View receives data via props and emits events via callbacks.

---

### ViewModel: State Orchestration

Allowed:

```tsx
// userViewModel.ts
import { useDataState } from 'astra';
import { UserRepo } from '../repo/UserRepo';
import { useEffect } from 'react';

export function useUserListViewModel() {
  const [state, execute] = useDataState<User[]>();

  useEffect(() => {
    execute(() => UserRepo.getAll());
  }, []);

  const handleSelect = (id: string) => {
    // orchestrate selection logic
    console.log('selected:', id);
  };

  return {
    users: state.data ?? [],
    isLoading: state.state === StateType.LOADING,
    isError: state.isError,
    errorMessage: state.statusMessage,
    onSelect: handleSelect,
  };
}
```

Reason:
ViewModel owns state orchestration, returns data and callbacks.

---

### Repository: Data Access

Allowed:

#### WEB — ApiService

```tsx
// userRepo.ts
import { ApiService, ServerResponse } from 'astra';

const api = new ApiService('/api/users', {
  internal_server_error: 'Failed to load users.',
});

export const UserRepo = {
  getAll: (): Promise<ServerResponse<User[]>> => api.get('/'),
  getById: (id: string): Promise<ServerResponse<User>> => api.get(`/${id}`),
};
```

Reason:
Repository abstracts HTTP data source. ViewModel depends on contract, not transport.

#### ELECTRON — IpcService

```tsx
// taskRepo.ts
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const TaskRepo = {
  list: (): Promise<ServerResponse<Task[]>> => ipc.invoke('tasks:list'),
  get: (id: string): Promise<ServerResponse<Task>> => ipc.invoke('tasks:get', { id }),
};
```

Reason:
Repository abstracts IPC data source. ViewModel depends on contract, not transport.

The repository contract remains identical. Only the service abstraction differs.

---

### Container Composition

Allowed:

```tsx
// UserListContainer.tsx
import { useUserListViewModel } from './userViewModel';
import { UserListView } from './UserListView';

function UserListContainer() {
  const viewModel = useUserListViewModel();
  return <UserListView {...viewModel} />;
}
```

Reason:
Container composes ViewModel with View — clean separation.

---

## Forbidden Patterns

### Data Fetching in View

Forbidden:

```tsx
function UserListView() {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    axios.get('/api/users').then((res) => setUsers(res.data));
  }, []);
  return <div>{users?.map(u => u.name)}</div>;
}
```

Reason:
View owns data lifecycle — belongs in ViewModel.

---

### Business Logic in View

Forbidden:

```tsx
function InvoiceView({ items }: InvoiceViewProps) {
  const taxable = items.filter(i => i.type !== 'exempt');
  const total = taxable.reduce((s, i) => s + i.amount * 1.18, 0);
  return <div>{total}</div>;
}
```

Reason:
Domain computation belongs in Model/domain layer, not View.

---

### ViewModel Importing UI Components

Forbidden:

```tsx
// userViewModel.ts
import { UserCard } from '../components/UserCard';

export function useUserListViewModel() {
  return { UserCard }; // ViewModel returns components
}
```

Reason:
ViewModel must not know about UI — creates renderer coupling.

---

### Repository Returning UI-Ready Data

Forbidden:

```tsx
// userRepo.ts
export const UserRepo = {
  getDisplayData: async () => {
    const data = await api.get('/users');
    return data.map(u => ({
      displayName: `${u.firstName} ${u.lastName}`,
      statusColor: u.active ? 'green' : 'gray',
    }));
  },
};
```

Reason:
Presentation transformation belongs in ViewModel, not Repository.

---

### View Accessing Repositories Directly

Forbidden:

```tsx
function UserListView() {
  const [state, setState] = useState();
  useEffect(() => {
    UserRepo.getAll().then(setState); // View calling Repo directly
  }, []);
  return <div>...</div>;
}
```

Reason:
View bypasses ViewModel — couples presentation to data access.

---

### ViewModel with Persistence Side Effects

Forbidden:

```tsx
function useSettingsViewModel() {
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(state));
  }, [state]);
  return state;
}
```

Reason:
Persistence belongs in Repository or consumer-managed lifecycle.

---

### ViewModel with DOM Access

Forbidden:

```tsx
function useScrollViewModel() {
  useEffect(() => {
    window.addEventListener('scroll', handler); // DOM access in ViewModel
  }, []);
}
```

Reason:
DOM/browser APIs belong in View layer (useEffect in component) or dedicated utilities.

---

## Detection Heuristics

### View Files (.tsx) Containing Data Logic

Detect:

```tsx
useDataState
ApiService
axios
fetch(
Repo.
```

inside files that primarily contain JSX markup.

---

### ViewModel Files Containing JSX

Detect:

```tsx
return <div>
```

inside ViewModel files (canonical: `hooks/use<Feature>.ts`, also `viewmodel/` directories or files named `use*ViewModel`).

---

### ViewModel Files Containing UI Imports

Detect:

```tsx
import ... from '../components/'
import ... from '../views/'
```

inside ViewModel files.

---

### Repository Files Containing View Logic

Detect:

```tsx
import ... from '../components/'
import ... from '../viewmodel/'
```

inside repository files.

---

### Direct API Calls in Component

Detect:

```tsx
api.get(
ApiService
axios.get
fetch(
```

inside component files (.tsx) outside of useEffect + useDataState pattern.

---

### Business Computation in JSX

Detect:

- complex reduce/filter/map operations in JSX
- inline tax/price/status calculations
- data transformation in render return

---

## Severity Levels

### P0 — Critical

View directly accesses data layer or contains business logic.

Examples:

- data fetching in component
- direct repository calls from view
- domain computation in JSX
- persistence in component

Must fix before release.

---

### P1 — High

ViewModel leaks into UI concerns or Repository leaks presentation logic.

Examples:

- ViewModel importing components
- Repository formatting data for display
- ViewModel with DOM/browser access

Must migrate.

---

### P2 — Transitional

Legacy hybrid components with documented layer violations.

Examples:

- container components with mixed View+ViewModel concerns
- ViewModel with minimal side effects needing extraction

Allowed temporarily with migration plan.

---

### P3 — Informational

Layers are cleanly separated.

No action required.

---

## Refactoring Guidance

### Extract Data Logic From View to ViewModel

BAD:

```tsx
function UserList() {
  const [state, execute] = useDataState<User[]>();
  useEffect(() => { execute(fetchUsers); }, []);
  return <div>{state.data}</div>;
}
```

GOOD:

```tsx
// ViewModel (useUserListViewModel.ts)
export function useUserListViewModel() {
  const [state, execute] = useDataState<User[]>();
  useEffect(() => { execute(fetchUsers); }, []);
  return { users: state.data, isLoading: state.state === StateType.LOADING, isError: state.isError };
}

// View (UserList.tsx)
function UserList() {
  const { users, isLoading } = useUserListViewModel();
  return <div>{users}</div>;
}
```

---

### Move Business Logic to Domain Layer

BAD:

```tsx
function InvoiceView({ items }) {
  const total = items.reduce((s, i) => s + i.amount * TAX_RATE, 0);
  return <div>{total}</div>;
}
```

GOOD:

```tsx
// domain/invoicing.ts
export function calculateTotal(items: Item[]): number {
  return items.reduce((s, i) => s + i.amount * TAX_RATE, 0);
}

// ViewModel
const total = calculateTotal(items);

// View
function InvoiceView({ total }: { total: number }) {
  return <div>{total}</div>;
}
```

---

### Move Data Formatting From Repository to ViewModel

BAD:

```tsx
// Repo
const getUsers = () => api.get('/users').then(transformForDisplay);
```

GOOD:

```tsx
// Repo — returns raw data
const getUsers = () => api.get<User[]>('/users');

// ViewModel — transforms for display
const displayUsers = users.map(u => ({ displayName: `${u.firstName} ${u.lastName}` }));
```

---

### Remove UI Imports From ViewModel

BAD:

```tsx
// useViewModel.ts
import { Button } from '../components/Button';
```

GOOD:

```tsx
// useViewModel.ts — no UI imports
export function useViewModel() {
  return { handleAction: () => { /* logic */ } };
}
```

---

## Library Impact

Violating MVVM Separation causes:

- untestable views (data coupling)
- non-reusable view models (UI coupling)
- debugging ambiguity (fault spans multiple layers)
- data source changes requiring view edits
- presentation logic scattered across layers
- business logic embedded in render tree
- impossible to swap data sources without view changes
- testing complexity (mocking required for both layers)

Without MVVM Separation:
Astra becomes a monolithic view-data entanglement
instead of a testable, layered component architecture.

---

## Migration Notes

### Transitional Layer Violations Must Include

```tsx
/**
 * @deprecated-layer-violation
 * Layer: <view|viewmodel|repository>
 * Violation: <what crosses the boundary>
 * Migration: <how to extract>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify data fetching in View files
2. Extract data logic into ViewModel hooks
3. Move business computation to domain layer
4. Remove UI imports from ViewModels
5. Remove presentation formatting from Repositories
6. Verify each layer is independently testable

---

## Validation Requirements

A component is compliant only if:

- View contains no data fetching
- View contains no business logic
- View contains no repository access
- ViewModel contains no JSX
- ViewModel contains no UI component imports
- Repository contains no presentation logic
- Repository contains no View/ViewModel imports
- each layer is independently testable

---

## Compliance Goal

Astra components must behave as:

- presentation-pure Views
- orchestration-focused ViewModels
- data-abstracted Repositories
- independently testable MVVM layers

NOT:

- data-fetching View components
- UI-aware ViewModel hooks
- presentation-aware Repositories
- layer-blurred monolithic blocks
```
