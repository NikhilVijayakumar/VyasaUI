# MVVM Separation Invariant

## Purpose

Prati is a presentation-oriented UI component library. Application architecture follows the Model-View-ViewModel (MVVM) pattern.

The MVVM pattern enforces strict layer separation:

| Layer | Role | Ownership |
|-------|------|-----------|
| **View** | Pure presentation — renders UI, emits events | Prati components |
| **ViewModel** | State orchestration — manages data lifecycle, exposes state | Consumer hooks (`use*`) |
| **Model** | Domain logic and data access — business rules, repositories, API | Consumer domain layer |

MVVM guarantees:
- testable Views (no data coupling)
- reusable ViewModels (no UI coupling)
- replaceable Models (no presentation coupling)
- predictable data flow direction

---

## Architectural Rule

Data must flow in one direction: **Model → ViewModel → View**.

Views must never import from the Model layer. ViewModels must never import from the View layer.

### View

A View is any Prati component (atom, molecule, organism, template).

A View may:
- render UI from props
- emit callbacks to parent
- consume ViewModel hooks (organisms only)
- use theme and localization hooks

A View may NOT:
- import from the Model layer (repositories, domain services, API clients)
- manage data lifecycle (fetching, caching, persistence)
- contain business logic
- access repositories directly

### ViewModel

A ViewModel is a custom hook (`use<Feature>`) that orchestrates data state.

A ViewModel may:
- call `useDataState` for async state management
- access repositories and domain services
- transform data for presentation
- interpolate localized strings
- expose state and callbacks to Views

A ViewModel may NOT:
- import View components (no JSX, no component references)
- manage UI state (animations, open/closed, selection)
- access the DOM directly
- depend on browser APIs without SSR guards

### Model

The Model layer contains domain logic, data access, and business rules.

The Model may:
- define repository abstractions
- implement API communication
- contain business logic and validation
- manage domain entity lifecycle

The Model may NOT:
- import View components or ViewModel hooks
- reference theme or localization
- depend on Prati component types

---

## Allowed Patterns

### ViewModel Hook

```tsx
// hooks/useUserViewModel.ts — ViewModel layer
import { useDataState } from 'prati';
import { UserRepo } from '../repos/UserRepo';

export function useUserViewModel() {
  const [state, execute] = useDataState<User[]>();

  const loadUsers = () => execute(() => UserRepo.getAll());

  return { state, loadUsers };
}
```

Reason:
ViewModel mediates between Model and View without coupling either.

---

### View Consuming ViewModel

```tsx
// organisms/UserList.tsx — View layer
import { useUserViewModel } from '../../hooks/useUserViewModel';

function UserList() {
  const { state, loadUsers } = useUserViewModel();

  useEffect(() => { loadUsers(); }, []);

  return <AppStateHandler appState={state} SuccessComponent={...} />;
}
```

Reason:
View consumes ViewModel through hook interface — no direct Model access.

---

### Props-Only View (No ViewModel)

```tsx
// molecules/UserCard.tsx — View layer
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

Reason:
Pure presentation component receives already-resolved data via props.

---

## Forbidden Patterns

### View Importing Model Directly

Forbidden:

```tsx
// organisms/UserList.tsx
import { UserRepo } from '../repos/UserRepo';

function UserList() {
  const [users, setUsers] = useState();
  useEffect(() => { UserRepo.getAll().then(setUsers); }, []);
  return <div>...</div>;
}
```

Reason:
View bypasses ViewModel — couples presentation to data access.

---

### ViewModel Importing View

Forbidden:

```tsx
// hooks/useUserViewModel.ts
import { UserCard } from '../components/UserCard';

export function useUserViewModel() {
  return <UserCard />; // ViewModel returns JSX
}
```

Reason:
ViewModel must not reference UI components — creates circular dependency.

---

### ViewModel Managing UI State

Forbidden:

```tsx
// hooks/usePanelViewModel.ts
export function usePanelViewModel() {
  const [isOpen, setIsOpen] = useState(false); // UI state
  const [data, setData] = useState();
  // ...
}
```

Reason:
UI interaction state belongs in the View component, not the ViewModel.

---

## Detection Heuristics

### View Importing From Model Layer

Detect:

```tsx
import ...Repo from
import ...Service from
import ...Api from
```

inside `atoms/`, `molecules/`, `organisms/`, or `templates/` directories.

---

### ViewModel Returning JSX

Detect:

```tsx
return <
```

inside `hooks/use*.ts` or `use*ViewModel.ts` files.

---

### ViewModel Using UI Hooks

Detect:

```tsx
useRef
useMediaQuery
```

inside `use*ViewModel` hook files (these belong in View components).

---

### ViewModel Accessing Browser APIs

Detect:

```tsx
localStorage
sessionStorage
document.
window.
```

inside `use*ViewModel` hook files without SSR guard.

---

## Severity Levels

### P0 — Critical

View imports Model directly or ViewModel returns JSX.

Must fix before release.

### P1 — High

ViewModel manages UI state or accesses browser APIs without SSR guards.

Must migrate.

### P2 — Transitional

Legacy components with mixed View/ViewModel concerns.

Allowed temporarily with documented migration plan.

### P3 — Informational

Component follows MVVM boundaries correctly.

No action required.

---

## Refactoring Guidance

### Extract Data Logic Into ViewModel

BAD:

```tsx
// View with embedded data logic
function UserList() {
  const [data, setData] = useState();
  useEffect(() => { fetch('/api/users').then(setData); }, []);
  return <div>{data}</div>;
}
```

GOOD:

```tsx
// ViewModel
export function useUserViewModel() {
  const [state, execute] = useDataState();
  const load = () => execute(() => fetch('/api/users').then(r => r.json()));
  return { state, load };
}

// View
function UserList() {
  const { state, load } = useUserViewModel();
  useEffect(() => { load(); }, []);
  return <AppStateHandler appState={state} SuccessComponent={...} />;
}
```

---

### Move UI State Out of ViewModel

BAD:

```tsx
export function usePanelViewModel() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState();
  // ...
}
```

GOOD:

```tsx
// ViewModel — data only
export function usePanelData() {
  const [state, execute] = useDataState();
  return { state, execute };
}

// View — UI state + ViewModel consumption
function Panel() {
  const [expanded, setExpanded] = useState(false);
  const { state } = usePanelData();
  return <div>{expanded && <DataView state={state} />}</div>;
}
```

---

### Remove Model Imports From Views

BAD:

```tsx
import { UserRepo } from '../../repos/UserRepo';
```

inside any component file.

GOOD:

```tsx
// ViewModel imports Model
import { UserRepo } from '../../repos/UserRepo';

// View imports ViewModel
import { useUserViewModel } from '../../hooks/useUserViewModel';
```

---

## Library Impact

Violating MVVM Separation causes:
- untestable Views (coupled to data sources)
- non-reusable ViewModels (coupled to UI)
- unpredictable data flow direction
- component lock-in to specific data sources
- debugging difficulty (state scattered across layers)
- broken separation of concerns

Without MVVM Separation:
Prati components become entangled with data logic
instead of remaining pure presentation units.

---

## Migration Notes

### Transitional MVVM Violations Must Include

```tsx
/**
 * @deprecated-mvvm-violation
 * Layer: <view|viewmodel>
 * Issue: <description>
 * Migration: <how to fix>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify components that fetch or persist data
2. Extract data logic into `use<Feature>ViewModel` hooks
3. Move business logic to domain/model layer
4. Remove direct repository imports from components
5. Verify ViewModel has no UI imports or JSX
6. Verify View has no Model imports

---

## Validation Requirements

A component is compliant only if:
- View never imports from Model layer
- ViewModel never imports from View layer
- ViewModel never returns JSX
- ViewModel never manages UI interaction state
- data flows one direction: Model → ViewModel → View
- ViewModel uses `useDataState` for async state
- View consumes ViewModel through hook interface only

---

## Compliance Goal

Prati consumers must behave as:
- MVVM-disciplined application architectures
- layer-respecting data flow pipelines
- testable presentation boundaries
- predictable state orchestration units

NOT:
- view-data entangled hybrids
- layer-violating component logic
- untestable UI-data couplings
- MVVM-ignoring application structures
