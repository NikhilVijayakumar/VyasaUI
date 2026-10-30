# ThemeToggle Component: Feature Technical

## 1. Technical Overview

`ThemeToggle` is a stateless icon button component that consumes `useTheme()` context to display the current theme mode and trigger toggling. Receives `themeContext` as a prop (object returned by `useTheme()`). Renders a sun icon when dark mode is active (switch to light) and moon icon when light mode is active (switch to dark). The component is a pure presentation unit — it does not own theme state, persistence, or keyboard shortcut handling.

## 2. Architecture Realization

| Feature Spec Concept | Architecture Implementation |
|---|---|
| Theme state | `useTheme()` hook returns `{ darkMode, toggleDarkMode }` from `ThemeContext` |
| Theme persistence | `ThemeProvider` manages `localStorage` persistence via `@stateless-exception` pattern |
| Toggle function | `themeContext.toggleDarkMode()` — synchronous state change |
| Icon display | Conditional render: `darkMode ? <SunIcon /> : <MoonIcon />` |
| Context requirement | Must be rendered inside `ThemeProvider` — throws error otherwise |

**Provider hierarchy:** `ThemeProvider` (outermost) → `LanguageProvider` → `ThemeToggle` in toolbar/header.

`ThemeProvider` accepts `lightTheme` and `darkTheme` as `createTheme()` results from `@mui/material/styles`.

## 3. Data Flow

```
User clicks ThemeToggle button
       ↓
onClick handler calls themeContext.toggleDarkMode()
       ↓
ThemeProvider updates internal state (darkMode boolean)
       ↓
localStorage persisted: "theme" = "dark" | "light"
       ↓
ThemeContext value changes → all useTheme() consumers re-render
       ↓
ThemeToggle re-renders with opposite icon
       ↓
All themed components re-render with new palette
```

## 4. State Management

State is owned by `ThemeProvider`, not by `ThemeToggle`. The toggle is a controlled component.

**ThemeProvider state shape (internal):**

| Property | Type | Source |
|---|---|---|
| `darkMode` | `boolean` | Internal React state, initialized from persisted preference |
| `toggleDarkMode` | `() => void` | Flips `darkMode`, triggers persistence effect |
| persisted theme | `string` | `localStorage.getItem('theme')` / `setItem` with SSR guard |

**State transitions via toggle:**

| From | To | Mechanism |
|---|---|---|
| Light mode | Dark mode | `toggleDarkMode()` → `setDarkMode(!darkMode)` → MUI theme switches |
| Dark mode | Light mode | `toggleDarkMode()` → `setDarkMode(!darkMode)` → MUI theme switches |
| Rapid clicks | Cycle modes | Synchronous state update — no race condition; each click processed |

**Persistence exception** (per `@stateless-exception`):

```typescript
/**
 * @stateless-exception
 * Reason: Dark mode preference persistence — UX convenience for ThemeProvider only.
 * Scope: ThemeProvider exclusively. Not a general pattern.
 * SSR guard required: typeof localStorage !== 'undefined'
 */
```

## 5. Styling Implementation

`ThemeToggle` uses MUI `IconButton` component with `sx` prop referencing theme tokens:

- Icon color: `theme.palette.text.primary` or `'text.primary'` via `sx`
- Button size: fixed, `size="small"` or `size="medium"` default
- Hover state: MUI `IconButton` default hover behavior via theme
- No animation on icon transition (future enhancement)

Icon selection:
- `darkMode === true` → `<WbSunnyIcon />` (light mode suggestion)
- `darkMode === false` → `<NightsStayIcon />` (dark mode suggestion)

Icons imported from `@mui/icons-material`.

## 6. Interaction Design

| Action | Response |
|---|---|
| Click | Calls `toggleDarkMode()`, icon switches immediately |
| Rapid double-click | Both clicks processed — theme toggles twice, returns to original |
| Disabled parent interaction | `pointer-events: none` on parent blocks click — no state change |
| Missing context | Component throws runtime error (cannot call `toggleDarkMode` on undefined) |

No keyboard shortcut support (non-responsibility).

## 7. Accessibility Implementation

- Rendered as `<IconButton>` with `aria-label` describing the action
- Label must be localized: `aria-label={literal['theme.toggle']}` with value like "Switch to dark mode" / "Switch to light mode"
- Icon-only button requires aria-label — text label not visible
- Tooltip on hover is non-responsibility (future enhancement)
- Role: `button` (native from `IconButton`)

## 8. Error Handling

| Condition | Behavior |
|---|---|
| Missing theme context | `themeContext` is `undefined` — calling `toggleDarkMode()` throws `TypeError` |
| Invalid context value | Context provides `null` or `undefined` values — icon and toggle function are both unavailable |
| Storage unavailable | `ThemeProvider` persists silently; toggle still works in memory |

Error boundary can catch render errors. No user-facing recovery flow.

## 9. Performance Considerations

- No internal state — re-render only when `useTheme()` context updates
- Icon components are lightweight MUI SVG icons — no performance concern
- Toggle function is stable reference — no unnecessary child re-renders if properly memoized
- Synchronous state update — no async delays between click and visual feedback
- Single component, no expensive computations — negligible impact

## 10. Integration Points

| Integration | Location |
|---|---|
| `ThemeProvider` → App root | Must wrap entire app, outermost provider |
| `useTheme()` → themeContext | Consumed in header/toolbar component |
| `ThemeToggle` → Toolbar | Placed in `AppBar` → `Toolbar` → end position |
| Localization → aria-label | `aria-label={literal['theme.toggle']}` requires `useLanguage` in parent |
| Icon library | `@mui/icons-material` — `WbSunnyIcon`, `NightsStayIcon` |

**Consumer usage pattern:**

```typescript
import { useTheme, ThemeToggle } from 'prati';

function AppHeader() {
  const themeContext = useTheme();
  return (
    <Toolbar>
      <ThemeToggle themeContext={themeContext} />
    </Toolbar>
  );
}
```

## 11. Open Questions

- Should the toggle accept a size option, or remain fixed-size?
- Should the accessible label be localized?
- Should icon transitions be animated?
- Should keyboard shortcut toggling be handled by this component or a parent?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
