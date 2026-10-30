# Atomic Hierarchy Invariant

## Purpose

Prati is organized by Atomic Design methodology.

Every component must belong to exactly one tier in the atomic hierarchy: Atom, Molecule, Organism, or Template. Each tier has strict complexity boundaries that govern what a component may import, compose, and be responsible for.

The hierarchy enforces:
- predictable complexity scaling
- clear dependency direction (atoms never depend on organisms)
- reusable primitives at every tier
- composable UI construction
- identifiable refactoring targets

---

## Architectural Rule

Components must obey their tier's complexity boundary.

### Atom

An Atom is a primitive UI element. It represents the smallest indivisible unit.

An Atom may:
- render a single HTML element or primitive
- accept simple props (string, number, boolean, callback)
- use theme tokens and localization
- have UI interaction state (hovered, focused, toggled)

An Atom may NOT:
- compose other components (except primitive HTML elements)
- import from molecule, organism, or template tiers
- contain business logic
- manage data lifecycle
- have layout responsibilities

### Molecule

A Molecule is a composed functional unit of atoms.

A Molecule may:
- compose Atom components
- introduce layout structure between atoms
- accept structured props (objects, arrays, callbacks)
- have UI orchestration state

A Molecule may NOT:
- compose Organism or Template components
- import from organism or template tiers
- fetch data or manage data lifecycle
- contain business logic
- assume parent context beyond props

### Organism

An Organism is a complex UI section that composes molecules and atoms.

An Organism may:
- compose Atom and Molecule components
- use ViewModel hooks for state orchestration
- coordinate data flow between sub-components
- manage feature-level UI logic
- accept data and callbacks from templates

An Organism may NOT:
- compose Template components
- fetch data directly (must use ViewModel hooks)
- access repositories directly
- define page-level layout

### Template

A Template defines page-level layout structure.

A Template may:
- compose Organism, Molecule, and Atom components
- define grid, flexbox, and section layout
- accept data and pass it to organisms
- orchestrate page-level composition

A Template may NOT:
- contain business logic
- manage data lifecycle
- define component-level styling specifics (belongs to contained components)

---

## Allowed Patterns

### Atom: Self-Contained Primitive

Allowed:

```tsx
// atoms/StatusDot.tsx
interface StatusDotProps {
  status: 'online' | 'offline' | 'away';
}

function StatusDot({ status }: StatusDotProps) {
  const theme = useTheme();
  const colors = {
    online: theme.palette.success.main,
    offline: theme.palette.grey[400],
    away: theme.palette.warning.main,
  };

  return <span style={{ backgroundColor: colors[status] }} />;
}
```

Reason:
Atom renders a single visual primitive with no composition.

---

### Molecule: Composed Atom Group

Allowed:

```tsx
// molecules/UserInfoCard.tsx
import { StatusDot } from '../atoms/StatusDot';
import { Typography } from '@mui/material';

interface UserInfoCardProps {
  name: string;
  status: 'online' | 'offline' | 'away';
}

function UserInfoCard({ name, status }: UserInfoCardProps) {
  return (
    <div>
      <StatusDot status={status} />
      <Typography>{name}</Typography>
    </div>
  );
}
```

Reason:
Molecule composes atoms with layout structure.

---

### Organism: State Orchestration

Allowed:

```tsx
// organisms/UserList.tsx
import { AppStateHandler } from 'prati';
import { useUserViewModel } from '../../hooks/useUserViewModel';
import { UserInfoCard } from '../../molecules/UserInfoCard';

function UserList() {
  const { state, loadUsers } = useUserViewModel(); // ViewModel hook mediates repository access

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AppStateHandler
      appState={state}
      SuccessComponent={({ data }) => (
        <div>
          {data.map((user) => (
            <UserInfoCard key={user.id} name={user.name} status={user.status} />
          ))}
        </div>
      )}
    />
  );
}
```

Reason:
Organism consumes a ViewModel hook — never imports repositories or calls `useDataState` directly. The ViewModel hook in `hooks/useUserViewModel.ts` owns all repository access and async state management.

---

### Template: Page Layout Composition

Allowed:

```tsx
// templates/DashboardPage.tsx
import { PageHeader } from '../../organisms/PageHeader';
import { UserList } from '../../organisms/UserList';
import { SummaryPanel } from '../../organisms/SummaryPanel';

interface DashboardTemplateProps {
  userName: string;
  userStatus: 'online' | 'offline' | 'away';
}

function DashboardTemplate({ userName, userStatus }: DashboardTemplateProps) {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <SummaryPanel />
      <UserList />
    </div>
  );
}
```

Reason:
Template manages page-level layout and composition only.

---

## Forbidden Patterns

### Atom Importing From Higher Tiers

Forbidden:

```tsx
// atoms/StatusDot.tsx
import { UserInfoCard } from '../molecules/UserInfoCard';
```

Reason:
Creates circular dependency risk and violates tier purity.

---

### Molecule With Data Fetching

Forbidden:

```tsx
// molecules/UserInfoCard.tsx
function UserInfoCard() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetch('/api/user').then((res) => setUser(res.data));
  }, []);

  return <div>{user?.name}</div>;
}
```

Reason:
Molecules must not own data lifecycle — data arrives via props.

---

### Organism With Template-Level Layout

Forbidden:

```tsx
// organisms/UserList.tsx
function UserList() {
  return (
    <Grid container>
      <Grid item xs={12}>
        ...
      </Grid>
    </Grid>
  );
}
```

where the Grid layout assumes page-level positioning.

Reason:
Layout responsibility belongs to Templates — organisms should be layout-agnostic.

---

### Organism Importing Template

Forbidden:

```tsx
// organisms/UserList.tsx
import { DashboardPage } from '../../templates/DashboardPage';
```

Reason:
Creates circular tier dependency — Templates compose Organisms, not vice versa.

---

### Atom With Business Logic

Forbidden:

```tsx
// atoms/StatusDot.tsx
function StatusDot({ user }: { user: User }) {
  const status = user.lastActive > Date.now() - 300000 ? 'online' : 'offline';
  return <span className={status} />;
}
```

Reason:
Domain computation does not belong in atomic primitives.

---

### Molecule With Repository Access

Forbidden:

```tsx
// molecules/NotificationItem.tsx
import { NotificationRepo } from '../repo/NotificationRepo';
```

Reason:
Repository access belongs to Organism (via ViewModel) or Template level only.

---

### Tier Inversion (Organism Used in Atom)

Forbidden:

```tsx
// atoms/Button.tsx
import { DataTable } from '../../organisms/DataTable';
```

Reason:
Lowest tier must not compose higher tiers — breaks all hierarchy guarantees.

---

## Detection Heuristics

### Cross-Tier Imports

Detect imports from higher-numbered tiers:

- `atoms/` importing from `molecules/`, `organisms/`, or `templates/`
- `molecules/` importing from `organisms/` or `templates/`
- `organisms/` importing from `templates/`

---

### Data Fetching by Tier

Detect:

```tsx
useEffect + fetch/axios/ApiService
```

inside `atoms/` or `molecules/` directories.

---

### Repository Imports by Tier

Detect:

```tsx
import ...Repo from
```

inside `atoms/` or `molecules/` directories.

---

### Business Logic in Atoms

Detect domain computation patterns inside `atoms/`:

- calculations
- conditional branching on domain data
- data transformation

---

### ViewModel Hook Usage by Tier

Detect:

```tsx
useDataState
```

inside `atoms/` or `molecules/` directories.

---

### Layout Patterns in Organisms

Detect:

```tsx
<Grid container>
<Grid item>
```

inside `organisms/` where the layout implies page-level positioning.

---

## Severity Levels

### P0 — Critical

Component imports from a higher tier or contains logic belonging to a higher tier.

Examples:

- atom importing from organism
- molecule with data fetching
- organism with template-level layout assumptions

Must fix before release.

---

### P1 — High

Component exceeds its tier's responsibility boundary.

Examples:

- molecule with repository import
- atom with domain computation
- organism with page layout

Must migrate.

---

### P2 — Transitional

Legacy components with ambiguous tier classification.

Examples:

- components that mix atom and molecule characteristics
- organisms that contain template-like behavior
- documented exceptions with migration plan

Allowed temporarily only.

---

### P3 — Informational

Component correctly follows its tier boundaries.

No action required.

---

## Refactoring Guidance

### Move Data Fetching Up One Tier

BAD:

```tsx
// molecules/UserCard.tsx
function UserCard() {
  const [user, setUser] = useState();
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <div>{user?.name}</div>;
}
```

GOOD:

```tsx
// molecules/UserCard.tsx (props only)
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// organisms/UserList.tsx (data orchestration)
function UserList() {
  const [state, execute] = useDataState<User[]>();
  useEffect(() => { execute(fetchUsers); }, []);
  return <div>{state.data?.map(u => <UserCard user={u} />)}</div>;
}
```

---

### Remove Cross-Tier Imports

BAD:

```tsx
// atoms/Icon.tsx
import { DataTable } from '../../organisms/DataTable';
```

GOOD:

```tsx
// atoms/Icon.tsx — pure primitive
function Icon({ name }: { name: string }) {
  return <span class={`icon-${name}`} />;
}
```

---

### Extract Layout From Organisms

BAD:

```tsx
// organisms/SummaryPanel.tsx
function SummaryPanel() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>...</Grid>
    </Grid>
  );
}
```

GOOD:

```tsx
// organisms/SummaryPanel.tsx (layout-agnostic)
function SummaryPanel() {
  return <>...</>;
}

// templates/DashboardTemplate.tsx (layout owner)
<Grid container>
  <Grid item xs={12}><SummaryPanel /></Grid>
</Grid>
```

---

### Move Business Logic Out of Atoms

BAD:

```tsx
// atoms/PriceDisplay.tsx
function PriceDisplay({ amount, taxRate }: { amount: number; taxRate: number }) {
  const total = amount * (1 + taxRate);
  return <span>${total.toFixed(2)}</span>;
}
```

GOOD:

```tsx
// atoms/PriceDisplay.tsx
function PriceDisplay({ value }: { value: number }) {
  return <span>${value.toFixed(2)}</span>;
}

// Computation done in domain/model layer
```

---

## Library Impact

Violating Atomic Hierarchy causes:

- unpredictable component dependencies
- circular tier references
- broken composability (atoms tied to data sources)
- testing complexity (molecules with implicit data requirements)
- layout leakage (organisms assuming page context)
- reusable primitive degradation (atoms become context-aware)
- unclear refactoring targets (tier boundaries blur)

Without Atomic Hierarchy:
Prati becomes a flat collection of entangled components
instead of a structured, predictably composable design system.

---

## Migration Notes

### Transitional Tier Violations Must Include

```tsx
/**
 * @deprecated-tier-violation
 * Current tier: <atom|molecule|organism|template>
 * Correct tier: <target tier>
 * Reason: <why misplaced>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Classify every component into exactly one tier
2. Fix cross-tier imports (lower tiers must not import higher)
3. Remove data fetching from atoms and molecules
4. Extract layout from organisms into templates
5. Move business logic to domain layer
6. Verify component is reusable without parent context

---

## Validation Requirements

A component is compliant only if:

- it belongs to exactly one atomic tier
- it imports only from same or lower tiers
- it does not fetch data if atom or molecule
- it does not access repositories if atom or molecule
- it does not contain business logic if atom or molecule
- it does not define page-level layout if not a template
- it is reusable without specific parent context

---

## Compliance Goal

Prati components must behave as:

- tier-disciplined UI elements
- hierarchy-respecting composition units
- boundary-governed presentation layers
- predictably scalable design primitives

NOT:

- tier-ambiguous UI fragments
- cross-layer entangled components
- boundary-violating data containers
- hierarchy-ignoring presentation blobs
```
