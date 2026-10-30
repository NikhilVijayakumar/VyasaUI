# Repository Isolation Invariant

## Purpose

Prati is a presentation-only UI component library. Data access is owned by the consumer's repository layer.

Repositories are the exclusive boundary for data access. Components must never communicate directly with APIs, databases, or external services.

Repository isolation guarantees:
- components remain testable (no network dependencies)
- data access can be replaced without UI changes
- API changes do not affect component code
- consumer controls all data infrastructure

---

## Architectural Rule

Components must never access repositories directly. All data access must flow through ViewModel hooks.

### Repository

A Repository is a consumer-defined abstraction over data access.

A Repository may:
- communicate with REST, GraphQL, or other API protocols
- access local storage, IndexedDB, or file systems
- implement caching strategies
- transform API responses into domain models
- manage request lifecycle (retry, abort, timeout)

A Repository may NOT:
- import View components from Prati
- reference theme or localization
- contain UI logic
- depend on Prati's component types
- manage UI state

### Component Data Access

A component may:
- receive data through props
- call ViewModel hooks that internally use repositories

A component may NOT:
- import repository classes or functions
- call API methods directly (`fetch`, `axios`, `ApiService`)
- manage HTTP request lifecycle
- access persistence layers (`localStorage`, `IndexedDB`)
- define inline data fetching logic

### ViewModel Mediation

A ViewModel may:
- import and call repository methods
- orchestrate multiple repository calls
- transform repository data for presentation
- handle loading, error, and success states via `useDataState`

A ViewModel may NOT:
- bypass the repository layer (no direct API calls)
- expose repository instances to Views
- leak repository types into component props

---

## Allowed Patterns

### Repository Access Through ViewModel

Allowed:

```tsx
// repos/UserRepo.ts — Model layer
export const UserRepo = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    return response.json();
  },
};

// hooks/useUserViewModel.ts — ViewModel layer
export function useUserViewModel() {
  const [state, execute] = useDataState<User[]>();
  const loadUsers = () => execute(() => UserRepo.getAll());
  return { state, loadUsers };
}

// components/UserList.tsx — View layer
function UserList() {
  const { state, loadUsers } = useUserViewModel();
  useEffect(() => { loadUsers(); }, []);
  return <AppStateHandler appState={state} SuccessComponent={...} />;
}
```

Reason:
Repository is isolated behind ViewModel — View has no data access awareness.

---

### Repository Dependency Injection

Allowed:

```tsx
// hooks/useUserViewModel.ts
export function useUserViewModel(userRepo: UserRepository) {
  const [state, execute] = useDataState<User[]>();
  const loadUsers = () => execute(() => userRepo.getAll());
  return { state, loadUsers };
}
```

Reason:
Repository is injected — allows testing with mock repositories.

---

### Multiple Repository Orchestration

Allowed:

```tsx
// hooks/useDashboardViewModel.ts
export function useDashboardViewModel() {
  const [usersState, loadUsers] = useDataState<User[]>();
  const [metricsState, loadMetrics] = useDataState<Metrics>();

  const loadDashboard = async () => {
    await loadUsers(() => UserRepo.getAll());
    await loadMetrics(() => MetricsRepo.getSummary());
  };

  return { usersState, metricsState, loadDashboard };
}
```

Reason:
ViewModel orchestrates multiple repositories without exposing them to the View.

---

## Forbidden Patterns

### Component Importing Repository Directly

Forbidden:

```tsx
// organisms/UserList.tsx
import { UserRepo } from '../../repos/UserRepo';

function UserList() {
  const [users, setUsers] = useState();
  useEffect(() => {
    UserRepo.getAll().then(setUsers);
  }, []);
  return <div>{users}</div>;
}
```

Reason:
View bypasses ViewModel — couples presentation to data access implementation.

---

### Inline API Calls in Components

Forbidden:

```tsx
function SaveButton({ data }: { data: FormData }) {
  const handleSave = async () => {
    await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
  };
  return <button onClick={handleSave}>Save</button>;
}
```

Reason:
Network communication must go through Repository layer — not inline in components.

---

### ViewModel Exposing Repository to View

Forbidden:

```tsx
// hooks/useUserViewModel.ts
export function useUserViewModel() {
  return { repo: UserRepo, state };
}
```

Reason:
ViewModel must not leak repository references to the View layer.

---

### Component Persistence Access

Forbidden:

```tsx
function SettingsPanel({ theme }: { theme: string }) {
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <div>...</div>;
}
```

Reason:
Persistence belongs in the repository layer or consumer-managed lifecycle — see [Platform Neutrality Invariant](platform-neutrality.md) for the single documented exception.

---

## Detection Heuristics

### Repository Imports in Components

Detect:

```tsx
import ...Repo from
import ...Repository from
import ...Api from
import ...Service from
```

inside `atoms/`, `molecules/`, `organisms/`, or `templates/` directories.

---

### Direct HTTP Calls in Components

Detect:

```tsx
fetch(
axios.get
axios.post
ApiService.
```

inside component files.

---

### Persistence Calls in Components

Detect:

```tsx
localStorage
sessionStorage
IndexedDB
```

inside component files (except the single documented ThemeProvider exception).

---

### Repository Leaks From ViewModel

Detect:

```tsx
return { ...repo
return { repo:
```

inside `use*ViewModel` hook return values.

---

## Severity Levels

### P0 — Critical

Component directly imports and calls repository methods.

Must fix before release.

### P1 — High

Component contains inline API calls or persistence access.

Must migrate.

### P2 — Transitional

ViewModel exposes repository instances to Views.

Allowed temporarily with migration plan.

### P3 — Informational

Repository is fully isolated behind ViewModel.

No action required.

---

## Refactoring Guidance

### Wrap Direct Data Access in ViewModel

BAD:

```tsx
function UserList() {
  const [data, setData] = useState();
  useEffect(() => { fetch('/api/users').then(r => r.json()).then(setData); }, []);
  return <div>{data}</div>;
}
```

GOOD:

```tsx
// repos/UserRepo.ts
export const UserRepo = {
  getAll: () => fetch('/api/users').then(r => r.json()),
};

// hooks/useUserViewModel.ts
export function useUserViewModel() {
  const [state, execute] = useDataState();
  const load = () => execute(() => UserRepo.getAll());
  return { state, load };
}

// components/UserList.tsx
function UserList() {
  const { state, load } = useUserViewModel();
  useEffect(() => { load(); }, []);
  return <AppStateHandler appState={state} SuccessComponent={...} />;
}
```

---

### Remove Repository Imports From Components

BAD:

```tsx
import { UserRepo } from '../../repos/UserRepo';
import { MetricsRepo } from '../../repos/MetricsRepo';
```

inside any component file.

GOOD:

```tsx
// Single ViewModel imports both repositories
import { UserRepo, MetricsRepo } from '../../repos';
```

inside the ViewModel file only.

---

### Replace Inline Persistence With Repository

BAD:

```tsx
function ThemeToggle() {
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  return <button />;
}
```

GOOD:

```tsx
// ThemeProvider handles persistence (single documented exception)
// See stateless-ui.md for details
```

---

## Library Impact

Violating Repository Isolation causes:
- untestable components (network-dependent)
- non-reusable components (API-coupled)
- hidden side effects in render tree
- API changes force component updates
- debugging difficulty (scattered data access)
- consumer lock-in to specific API implementations

Without Repository Isolation:
Prati components become data-coupled hybrids
instead of reusable presentation units.

---

## Migration Notes

### Transitional Repository Violations Must Include

```tsx
/**
 * @deprecated-repository-violation
 * Issue: <direct data access in component>
 * Migration: <wrap in ViewModel>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify all direct API calls and repository imports in components
2. Create repository abstractions for each data source
3. Create ViewModel hooks that consume repositories
4. Replace component data access with ViewModel hook calls
5. Verify no repository imports remain in component files
6. Verify ViewModel does not expose repository references

---

## Validation Requirements

A component is compliant only if:
- no repository imports exist in component files
- no direct API calls exist in component files
- no persistence access exists in component files
- all data access flows through ViewModel hooks
- ViewModel does not expose repository references to Views
- repository layer is replaceable without component changes

---

## Compliance Goal

Prati consumers must behave as:
- repository-isolated data pipelines
- ViewModel-mediated access boundaries
- component-data separation layers
- testable presentation units

NOT:
- data-accessing component hybrids
- repository-coupled presentation code
- API-entangled UI elements
- persistence-scattered component logic
