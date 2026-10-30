# Stateless UI Invariant

## Purpose

Prati is a presentation-oriented UI component library.

Components must remain pure rendering units. They receive data through props, render UI, and emit events.

Ownership of business state, data lifecycle, persistence, and API communication belongs to:
- ViewModel hooks (`useDataState`)
- Repository abstractions (`ApiService`)
- Client applications (consumer-managed state)

UI components themselves must not own or manage non-visual state.

---

## Architectural Rule

Components may manage only UI presentation state.

A component may:
- receive props and render
- emit callbacks
- manage UI interaction state (open/closed, selected, hovered)
- manage animation state
- manage temporary visual transitions

A component may NOT:
- fetch data
- persist data
- contain business logic
- access repositories directly
- make API calls
- hold hidden mutable state beyond UI scope
- manage domain model lifecycle

---

## Documented Exception: Provider Persistence

The following is a **single documented exception** to the stateless rule. It is not a general pattern and must not be generalised.

### ThemeProvider Dark Mode Persistence

Prati's `ThemeProvider` may persist the `darkMode` preference via `localStorage` as a UX convenience. This prevents theme flash on page reload without requiring consumers to manage persistence themselves.

Requirements for this exception:

- Must be guarded with an SSR check: `if (typeof localStorage !== 'undefined')`
- Must be limited to UX preference state (not domain or business data)
- Must be documented with a `@stateless-exception` JSDoc tag in the implementation

```tsx
/**
 * @stateless-exception
 * Reason: Dark mode preference persistence — UX convenience for ThemeProvider only.
 * Scope: ThemeProvider exclusively. Not a general pattern.
 * SSR guard required: typeof localStorage !== 'undefined'
 */
useEffect(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }
}, [darkMode]);
```

This exception applies exclusively to `ThemeProvider`. No other Prati library component may use `localStorage`. See [Platform Neutrality Invariant](platform-neutrality.md) for the SSR guard requirement.

---

## Allowed Patterns

### UI Interaction State

Allowed:

```tsx
function Accordion({ title, children }: AccordionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>{title}</button>
      {expanded && <div>{children}</div>}
    </div>
  );
}
```

Reason:
State is purely visual and bounded to user interaction.

---

### Animation State

Allowed:

```tsx
function FadeIn({ children }: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return <motion.div animate={{ opacity: visible ? 1 : 0 }}>{children}</motion.div>;
}
```

Reason:
State controls presentation transition only.

---

### Controlled Component Pattern

Allowed:

```tsx
function TextField({ value, onChange }: TextFieldProps) {
  return <input value={value} onChange={onChange} />;
}
```

Reason:
State ownership remains with the consumer.

---

### Props-Only Rendering

Allowed:

```tsx
function StatusDot({ status }: StatusDotProps) {
  return <span className={status} />;
}
```

Reason:
Component is a pure render function.

---

### Callback Emission

Allowed:

```tsx
function DeleteButton({ onDelete }: DeleteButtonProps) {
  return <button onClick={onDelete}>Delete</button>;
}
```

Reason:
Component emits intent without owning the deletion logic.

---

## Forbidden Patterns

### Data Fetching Inside Component

Forbidden:

```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('/api/users').then((res) => setUsers(res.data));
  }, []);

  return <div>{users.map((u) => u.name)}</div>;
}
```

Reason:
Component owns data lifecycle — belongs in ViewModel + Repository layer.

---

### Direct API Calls

Forbidden:

```tsx
function SaveButton({ data }: SaveButtonProps) {
  const handleSave = async () => {
    await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

Reason:
Network communication belongs to Repository layer.

---

### Business Logic Inside Component

Forbidden:

```tsx
function InvoiceTotal({ items }: InvoiceTotalProps) {
  const total = items
    .filter((i) => i.status === 'approved')
    .reduce((sum, i) => sum + i.amount * 1.18, 0); // tax calculation

  return <div>{total}</div>;
}
```

Reason:
Domain computation belongs in domain/model layer.

---

### Persistence Inside Component

Forbidden:

```tsx
function SettingsPanel({ theme }: SettingsPanelProps) {
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <div>...</div>;
}
```

Reason:
Persistence side effects belong to consumer-managed lifecycle or dedicated services.

---

### Hidden Mutable State

Forbidden:

```tsx
function Counter() {
  const countRef = useRef(0);

  return <button onClick={() => { countRef.current += 1; }}>Clicked {countRef.current}</button>;
}
```

where ref is used for display state (not DOM access).

Reason:
Hidden mutable state creates untracked UI behavior.

---

### Domain Model State in Component

Forbidden:

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadUser(userId);
    loadPermissions(userId);
  }, [userId]);

  return <div>...</div>;
}
```

Reason:
State orchestration belongs in ViewModel hook.

---

### Auth Logic Inside Component

Forbidden:

```tsx
function AdminPanel() {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);

  if (decoded.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

Reason:
Authentication and authorization belong in dedicated auth layer.

---

## Detection Heuristics

Flag the following patterns inside component files (.tsx):

### Direct HTTP Usage

Detect:

```tsx
axios.get
axios.post
fetch(
ApiService
```

inside component render or effect scope.

---

### Local Storage Access

Detect:

```tsx
localStorage
sessionStorage
IndexedDB
```

inside component files.

---

### Business Logic

Detect:

- tax calculations
- status transitions
- permission checks
- workflow branching
- domain computations

inside component render or event handlers.

---

### State for Non-UI Data

Detect:

```tsx
useState<User>
useState<Order[]>
useState<Config>
useState<Permission[]>
```

where the type is a domain entity (not UI interaction state).

---

### Persistence Calls

Detect:

```tsx
db.insert
db.update
repo.save
apiService.post
```

inside component files.

---

### Domain Imports in Components

Detect:

```tsx
import { calculateTax }
import { validateOrder }
import { processPayment }
```

imported into component scope.

---

### Ref Usage for Display

Detect:

```tsx
useRef<number>
useRef<string>
useRef<boolean>
```

where the ref value is rendered in JSX.

---

## Severity Levels

### P0 — Critical

Component owns business or data lifecycle.

Examples:

- data fetching inside component
- direct API calls from component
- persistence logic in component
- business computation in JSX

Must fix before release.

---

### P1 — High

Component contains hidden mutable state or domain imports.

Examples:

- useRef for display values
- domain utility imports in component
- localStorage access

Must migrate.

---

### P2 — Transitional

Legacy UI state that should move to ViewModel.

Examples:

- complex UI state that overlaps with domain concerns
- component-managed side effects with documented migration path

Allowed temporarily only.

---

### P3 — Informational

Component manages only UI interaction state.

No action required.

---

## Refactoring Guidance

### Replace Data Fetching With ViewModel Hook

BAD:

```tsx
function UserList() {
  const [data, setData] = useState();
  useEffect(() => { fetchUsers().then(setData); }, []);
  return <div>{data}</div>;
}
```

GOOD:

```tsx
function UserList() {
  const [state, execute] = useDataState<User[]>();
  useEffect(() => { execute(fetchUsers); }, []);
  return <AppStateHandler appState={state} SuccessComponent={...} />;
}
```

---

### Move Business Logic to Domain Layer

BAD:

```tsx
function OrderTotal({ items }) {
  const total = items.reduce((s, i) => s + i.price * 1.18, 0);
  return <div>{total}</div>;
}
```

GOOD:

```tsx
// domain/pricing.ts
export function calculateTotal(items: Item[]): number {
  return items.reduce((s, i) => s + i.price * TAX_RATE, 0);
}

// components/OrderTotal.tsx
function OrderTotal({ total }: { total: number }) {
  return <div>{total}</div>;
}
```

---

### Externalize Persistence

BAD:

```tsx
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} />;
}
```

GOOD:

```tsx
// Consumer app handles persistence
function App() {
  const themeContext = useTheme();
  useEffect(() => { localStorage.setItem('theme', themeContext.darkMode ? 'dark' : 'light'); }, [themeContext.darkMode]);
  return <ThemeToggle themeContext={themeContext} />;
}
```

---

### Replace Domain State With Props

BAD:

```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState();
  useEffect(() => { UserRepo.get(userId).then(setUser); }, [userId]);
  return <ProfileCard user={user} />;
}
```

GOOD:

```tsx
function UserProfile({ user }: { user: User }) {
  return <ProfileCard user={user} />;
}
```

---

### Extract Auth From Component

BAD:

```tsx
function ProtectedContent() {
  const token = localStorage.getItem('token');
  if (!token) return <Login />;
  return <Content />;
}
```

GOOD:

```tsx
// AuthGuard wrapper
function ProtectedContent() {
  return <Content />;
}

// Usage in consumer:
<AuthGuard><ProtectedContent /></AuthGuard>
```

---

## Library Impact

Violating Stateless UI causes:

- untestable components (data coupling)
- non-reusable components (environment coupling)
- hidden side effects in render tree
- broken MVVM separation
- unpredictable component behavior
- difficult debugging (state scattered across components)
- consumer lock-in (components tied to specific APIs)
- rendering-coupled business logic

Without Stateless UI:
Prati becomes a framework of tightly coupled view-data hybrids
instead of a composable, reusable component library.

---

## Migration Notes

### Transitional Stateful Components Must Include

```tsx
/**
 * @deprecated-component-state
 * Reason: <why this component owns state>
 * Migration: <how to externalize>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify components that fetch data
2. Extract data logic into useDataState hooks
3. Move business computation to domain layer
4. Replace domain useState with props
5. Remove direct API/persistence calls
6. Verify component renders identically with same props

---

## Validation Requirements

A component is compliant only if:

- all data arrives via props
- no direct API calls exist in component
- no persistence calls exist in component
- no business logic is embedded in render
- no hidden mutable state affects output
- UI state is purely interaction-scoped
- component renders identically for identical props

---

## Compliance Goal

Prati components must behave as:

- pure presentation units
- reusable render primitives
- props-driven visual elements
- stateless UI substrates

NOT:

- data-fetching containers
- business logic hosts
- persistence endpoints
- stateful domain objects
```
