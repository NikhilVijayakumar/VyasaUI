# Platform Neutrality Invariant

## Purpose

Prati is a platform-neutral UI component library. Components must render correctly across server-side rendering (SSR), client-side rendering (CSR), and static site generation (SSG) environments without modification.

Browser-specific APIs (localStorage, sessionStorage, IndexedDB, window, document) must never be accessed directly in component scope. All platform-dependent code must be guarded by environment detection.

Platform neutrality guarantees:
- server-side rendering compatibility
- static site generation compatibility
- test environment compatibility (Node.js, happy-dom, jsdom)
- environment-agnostic component behavior
- predictable hydration without flicker

---

## Architectural Rule

Components must not assume a browser environment. All browser API access must be:
1. guarded by runtime environment checks
2. isolated to provider-level code (not individual components)
3. limited to UX preference state only

### Component Environment Rules

A component may:
- use React hooks that are SSR-safe (useState, useEffect with guards)
- render based on props without environment assumptions
- use MUI's SSR-compatible theming
- access the DOM through React refs (useRef) for measurement after mount

A component may NOT:
- access `window`, `document`, or `navigator` directly in render scope
- access `localStorage`, `sessionStorage`, or `IndexedDB` directly
- use browser-only APIs without SSR guards
- assume `window` is defined at module evaluation time
- depend on browser-specific globals (`requestAnimationFrame`, `IntersectionObserver`) without guards

### Provider Environment Rules

A Provider may:
- access browser APIs for UX persistence (single documented exception in stateless-ui.md)
- use environment detection guards
- fall back to safe defaults when browser APIs are unavailable

A Provider must:
- guard all browser API access with `typeof` checks
- provide deterministic initial state for SSR
- avoid hydration mismatches between server and client

---

## Allowed Patterns

### SSR-Guarded Browser Access

Allowed:

```tsx
function getInitialDarkMode(): boolean {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem('darkMode') === 'true';
    } catch {
      return false;
    }
  }
  return false; // SSR safe default
}
```

Reason:
Browser access is guarded by `typeof` check and wrapped in try-catch.

---

### Post-Mount DOM Access

Allowed:

```tsx
function MeasuredBox() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ref.current is only available after mount (client-side)
    if (ref.current) {
      const width = ref.current.offsetWidth;
    }
  }, []);

  return <div ref={ref}>Content</div>;
}
```

Reason:
DOM access occurs in useEffect after mount — safe for SSR (effect never runs on server).

---

### Deterministic Initial Render

Allowed:

```tsx
function ThemeProvider({ children, lightTheme, darkTheme }: Props) {
  const [darkMode, setDarkMode] = useState(false); // SSR-safe default

  useEffect(() => {
    // Hydrate from localStorage only after mount
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored === 'true') setDarkMode(true);
    }
  }, []);

  return <>{children}</>;
}
```

Reason:
Initial render is deterministic (false). Browser state is applied after hydration.

---

## Forbidden Patterns

### Direct Browser API Access in Render

Forbidden:

```tsx
function StatusDot() {
  const width = window.innerWidth; // crashes in SSR
  return <span style={{ width }} />;
}
```

Reason:
`window` is undefined during SSR — causes runtime error.

---

### Module-Level Browser Access

Forbidden:

```tsx
const storedTheme = localStorage.getItem('theme'); // crashes in SSR

export function ThemeToggle() {
  return <button>{storedTheme}</button>;
}
```

Reason:
Module evaluation happens before any SSR guard — crashes immediately.

---

### Unguarded Browser API in useEffect

Forbidden:

```tsx
useEffect(() => {
  localStorage.setItem('key', value); // no guard
}, [value]);
```

Reason:
While `useEffect` doesn't run in SSR, the code may execute in test environments or SSR-pretending runtimes that mock `window` but not `localStorage`.

---

### Assuming Browser Globals in Hooks

Forbidden:

```tsx
export function useViewportWidth() {
  const [width, setWidth] = useState(window.innerWidth); // crashes in SSR
  // ...
}
```

Reason:
`useState` initializer runs during SSR render — `window` is not available.

---

## Detection Heuristics

### Unguarded Browser API Access

Detect:

```tsx
window.
document.
navigator.
localStorage
sessionStorage
```

without preceding `typeof` guard.

---

### Module-Level Browser Calls

Detect:

```tsx
const x = localStorage.
const y = window.
```

at module scope (outside component or hook function).

---

### Missing SSR Guard in useEffect

Detect:

```tsx
useEffect(() => {
  localStorage.
  window.
  document.
```

without:

```tsx
if (typeof localStorage !== 'undefined')
```

---

## Severity Levels

### P0 — Critical

Component crashes during SSR due to unguarded browser API access.

Must fix before release.

### P1 — High

Component has unguarded browser API access in hooks or effects that may fail in non-browser environments.

Must migrate.

### P2 — Transitional

Component accesses browser APIs with guards but without try-catch for storage exceptions.

Allowed temporarily with migration plan.

### P3 — Informational

Component is fully platform-neutral with proper SSR guards.

No action required.

---

## Refactoring Guidance

### Add SSR Guard to Browser Access

BAD:

```tsx
const stored = localStorage.getItem('preference');
```

GOOD:

```tsx
let stored = null;
if (typeof localStorage !== 'undefined') {
  try {
    stored = localStorage.getItem('preference');
  } catch {
    // Storage unavailable
  }
}
```

---

### Move Module-Level Access Into Hook

BAD:

```tsx
const theme = localStorage.getItem('theme'); // module level

function App() { return <div>{theme}</div>; }
```

GOOD:

```tsx
function useThemePreference() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      setTheme(localStorage.getItem('theme') || 'light');
    }
  }, []);
  return theme;
}
```

---

### Provide SSR-Safe Defaults

BAD:

```tsx
const [width, setWidth] = useState(window.innerWidth);
```

GOOD:

```tsx
const [width, setWidth] = useState(1024); // desktop-safe default
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

---

## Library Impact

Violating Platform Neutrality causes:
- server-side rendering failures
- hydration mismatch warnings
- test environment crashes
- static site generation incompatibility
- consumer lock-in to client-only rendering

Without Platform Neutrality:
Prati becomes a browser-only component library
instead of a platform-agnostic UI system.

---

## Migration Notes

### Transitional Platform Violations Must Include

```tsx
/**
 * @deprecated-platform-violation
 * API: <browser API used>
 * Issue: <why unguarded>
 * Migration: <how to guard>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Identify all browser API access in components and hooks
2. Add `typeof` guards before each access
3. Wrap storage access in try-catch blocks
4. Move module-level access into useEffect hooks
5. Replace render-time browser calls with state-based alternatives
6. Verify component renders in SSR/Node.js test environment

---

## Validation Requirements

A component is compliant only if:
- no unguarded browser API access exists
- all browser API access is wrapped in `typeof` checks
- storage access includes try-catch error handling
- initial render is deterministic (no browser API in render scope)
- component renders without errors in Node.js environment
- no module-level browser API calls exist

---

## Compliance Goal

Prati components must behave as:
- platform-agnostic render units
- environment-independent presentation elements
- SSR-compatible UI primitives
- hydration-safe visual components

NOT:
- browser-dependent rendering code
- SSR-crashing platform assumptions
- environment-coupled UI elements
- hydration-conflicting component logic
