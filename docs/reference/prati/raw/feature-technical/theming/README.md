# Theming System: Feature Technical

## 1. Technical Overview

The theming system provides light/dark mode support via MUI's `ThemeProvider` with custom design tokens. `ThemeProvider` wraps the app root, accepts `lightTheme` and `darkTheme` as `createTheme()` results from `@mui/material/styles`. Theme state is managed internally via React state with a `@stateless-exception` for `localStorage` persistence of dark mode preference. The context shape exposed by `useTheme()` is `{ darkMode, toggleDarkMode }`. All visual styling must originate from theme tokens — hardcoded colors, spacing, and typography are forbidden per Theme Sovereignty invariant.

## 2. Architecture Realization

| Feature Spec Concept | Architecture Implementation |
|---|---|
| Theme Context | `useTheme()` hook from `prati`, returns `{ darkMode: boolean, toggleDarkMode: () => void }` |
| Light/Dark Modes | `createTheme({ palette: { mode: 'light' } })` / `createTheme({ palette: { mode: 'dark' } })` |
| Design Tokens | `src/theme/tokens/` — `colors.ts`, `spacing.ts`, `typography.ts` |
| Preference Persistence | `ThemeProvider` — `localStorage` with SSR guard, `@stateless-exception` documented |
| Theme Toggle | `ThemeToggle` component — icon button consuming `useTheme()` |
| Provider Hierarchy | `ThemeProvider` outermost → `LanguageProvider` → consumer providers |

**Provider setup:**

```typescript
<ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
  <LanguageProvider translations={...} availableLanguages={...} defaultLanguage="en">
    <AppContent />
  </LanguageProvider>
</ThemeProvider>
```

## 3. Data Flow

```
App mounts
       ↓
ThemeProvider reads localStorage.getItem('theme') (SSR-guarded)
       ↓
Initializes darkMode state: persisted value or false (light)
       ↓
Selects lightTheme or darkTheme based on darkMode
       ↓
MUI theme pipeline renders all components with selected palette
       ↓
User clicks ThemeToggle → toggleDarkMode()
       ↓
darkMode flipped → theme switches → localStorage persisted
```

## 4. State Management

State is managed by `ThemeProvider` via React `useState` for `darkMode` boolean.

| State | Value | Trigger |
|---|---|---|
| Uninitialized | `darkMode = false` | Before persistence read (SSR or first render) |
| Light mode | `darkMode = false` | No preference, or preference = light |
| Dark mode | `darkMode = true` | Preference = dark |
| Forced mode | External override | Consumer-controlled override (future) |

**Persistence exception** (`@stateless-exception` in `ThemeProvider`):

```typescript
useEffect(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }
}, [darkMode]);
```

**SSR behavior:** Defaults to light mode. After hydration, persisted preference applies. Possible flash — mitigated by inline script in `<head>`.

## 5. Styling Implementation

All components render using MUI's theme pipeline. Styling patterns:

| Pattern | Code | Rule |
|---|---|---|
| Theme token via sx | `sx={{ color: 'primary.main' }}` | Allowed |
| Theme token via styled | `styled('div')(({ theme }) => ({ ... }))` | Allowed |
| Token constant import | `import { spacing } from 'prati'` | Allowed |
| Hardcoded color | `backgroundColor: '#1976d2'` | P0 — Forbidden |
| Hardcoded spacing | `padding: '16px'` | P0 — Forbidden |
| Hardcoded typography | `fontSize: '14px'` | P0 — Forbidden |

**Custom brand colors** are injected at the `createTheme` call boundary only — never in component code.

## 6. Interaction Design

| Interaction | Behavior |
|---|---|
| Click ThemeToggle | Synchronous `toggleDarkMode()` — immediate re-render |
| Rapid toggling | All clicks processed — no debounce or race condition |
| Page reload | Persisted preference restored from `localStorage` |
| SSR first load | Light mode default — hydration applies persisted preference |

The toggle must be inside `ThemeProvider`. No keyboard shortcut (non-responsibility). No animation on mode switch (future enhancement).

## 7. Accessibility Implementation

- Color contrast: all token pairings must maintain WCAG AA compliance in both modes
- Theme toggle requires `aria-label` with localized text
- No reliance on color alone for information — mode switch affects palette, not content
- Focus indicators must use `theme.palette.primary.main` via `sx` prop
- Reduced motion: theme switch has no animation — no `prefers-reduced-motion` requirement
- High-contrast mode: future enhancement (non-responsibility in current scope)

## 8. Error Handling

| Condition | Behavior | Mechanism |
|---|---|---|
| Storage unavailable | Falls back to light mode silently | SSR guard: `typeof localStorage === 'undefined'` |
| SSR rendering | Light mode rendered; hydration may flash | Inline script in `<head>` mitigates (consumer-managed) |
| Invalid theme config | MUI `createTheme` throws | Caught by error boundary |
| Nested providers | Only outermost manages state | Documented — avoid nesting |
| Missing values in tokens | `undefined` in palette — MUI fallback to default | Validate tokens at theme creation |

## 9. Performance Considerations

- Theme object creation on every mode switch — MUI memoizes created theme
- `ThemeProvider` context update re-renders all consumers — tree depth matters
- `ThemeToggle` is lightweight — single icon button, no internal state
- Persistence effect runs only on `darkMode` change — debounced by React effect lifecycle
- Theme token resolution via `sx` prop is runtime cost — negligible per component, additive across tree
- Bundle size: MUI theme machinery is already dependency — token files add minimal bytes

## 10. Integration Points

| Integration | Mechanism | Location |
|---|---|---|
| MUI `ThemeProvider` | Wraps app root via `Prati`'s `ThemeProvider` | `App.tsx` |
| Design tokens | `src/theme/tokens/` → `createTheme()` | Theme setup |
| `useTheme()` hook | Consumed by any component | Any `.tsx` |
| `ThemeToggle` component | Placed in toolbar/header | Layout components |
| `localStorage` persistence | Managed by `ThemeProvider` internally | `@stateless-exception` |
| LanguageProvider | Renders inside ThemeProvider | Provider nesting |
| MVVM pattern | Theme values consumed in View — not ViewModel | View components only |

## 11. Open Questions

- How should embedded widgets or micro-frontends participate in theming?
- Is CSS variable-based theming a better long-term approach?
- Should system `prefers-color-scheme` detection be added with opt-in auto mode?
- Should high-contrast accessibility theme variant be supported?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
