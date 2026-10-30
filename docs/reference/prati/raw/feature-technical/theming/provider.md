# Overview

`ThemeProvider` is the root-level theming component that initializes and injects theme state into the entire React tree. It reads persisted preference from `localStorage`, selects the correct MUI theme object (light or dark), wraps children with MUI's `ThemeProvider` + `CssBaseline`, and exposes `darkMode`/`toggleDarkMode` via React context. Supports a `forceTheme` override for Storybook and testing.

---

# Feature Summary

| Attribute | Value |
|-----------|-------|
| **Module** | Theming — ThemeProvider |
| **Status** | Implemented |
| **Primary Concern** | Initialize, persist, and propagate theme state across the component tree |
| **Consumers** | Root application entry point (`App.tsx`), Storybook stories |
| **Localization** | None — no user-facing strings |

---

# Implementation Reference

## Status

Implemented — production file + test file.

## Source Files

| File | Purpose |
|------|---------|
| `src/common/theme/ThemeProvider.tsx` | Component implementation |
| `src/common/theme/ThemeProvider.test.tsx` | Unit tests |
| `src/common/theme/themeData.ts` | `ThemeProviderProps` type |
| `src/common/theme/themeContext.ts` | `ThemeContext` (createContext) |

## Public API

Exported from `src/common/theme/index.ts` → `src/common/index.ts` → `src/lib.ts`:

| Export | Kind | Description |
|--------|------|-------------|
| `ThemeProvider` | Component | Root theme wrapper |
| `ThemeProviderProps` | Type (from `themeData.ts`) | `{ children, lightTheme, darkTheme, forceTheme? }` |

### Import Contract

```tsx
import { ThemeProvider, ThemeProviderProps } from 'prati';
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | — | Application tree |
| `lightTheme` | `Theme` (MUI) | Yes | — | MUI theme for light mode |
| `darkTheme` | `Theme` (MUI) | Yes | — | MUI theme for dark mode |
| `forceTheme` | `'light' \| 'dark'` | No | `undefined` | Overrides internal state (Storybook/testing) |

### Internal Types

```ts
// themeData.ts
type ThemeProviderProps = {
  children: ReactNode;
  lightTheme: Theme;
  darkTheme: Theme;
};

// Extended internally in ThemeProvider.tsx
type ControllableThemeProviderProps = ThemeProviderProps & {
  forceTheme?: 'light' | 'dark';
};
```

---

# Architecture Mapping

| Pattern | Feature Usage | Reason |
|---------|---------------|--------|
| Theme Sovereignty | ✅ Full | Single injection point for all theme values; components consume via context/MUI provider |
| Stateless UI | ✅ Full (with exception) | Manages only UI presentation state (`darkMode`); persistence is consumer-friendly, not business logic |
| Public API Stability | ✅ Full | `ThemeProvider` and `ThemeProviderProps` exported through canonical barrels |
| Dependency Safety | ✅ Full | All dependencies are MUI peer packages |
| MVVM | N/A | Provider is infrastructure, not feature-layer MVVM |

---

# Technical Structure

## View

| Name | File Path | Purpose | Responsibilities | Imports From |
|------|-----------|---------|------------------|--------------|
| `ThemeProvider` | `src/common/theme/ThemeProvider.tsx` | Root theme wrapper | Read `localStorage` on mount; select light/dark theme; expose context; wrap with MUI + CssBaseline | `themeContext.ts` (ThemeContext), `themeData.ts` (ThemeProviderProps), MUI `ThemeProvider`, MUI `CssBaseline` |

## Data Flow

```
1. App renders <ThemeProvider lightTheme={...} darkTheme={...} forceTheme={...}>
2. ThemeProvider initializes internalDarkMode:
   a. if window exists: try localStorage.getItem('darkMode') → boolean (default: false)
   b. catch any localStorage errors → false
3. darkMode = forceTheme ? forceTheme === 'dark' : internalDarkMode
4. theme = useMemo(() => darkMode ? darkTheme : lightTheme, [darkMode, ...])
5. Render order:
   ThemeContext.Provider value={{ darkMode, toggleDarkMode }}
     → MUI ThemeProvider theme={theme}
       → CssBaseline
         → {children}
6. toggleDarkMode (when !forceTheme):
   a. setInternalDarkMode(!internalDarkMode)
   b. localStorage.setItem('darkMode', String(newMode))
   c. On error: silently fail (state already updated)
```

## State Machine

```
Mount
  ↓
Check localStorage ──has value──→ internalDarkMode = stored boolean
  ↓ no value
Check prefers-color-scheme ──dark──→ internalDarkMode = true
  ↓ light
internalDarkMode = false
  ↓
forceTheme set? ──yes──→ darkMode = forceTheme === 'dark'
  ↓ no
darkMode = internalDarkMode
  ↓
toggleDarkMode() called? ──yes──→ invert internalDarkMode → persist → re-render
  ↓ no
Cross-tab storage event? ──yes──→ sync internalDarkMode from event value
  ↓ no
Wait for next toggleDarkMode() call or storage event
```

---

# Error Handling

| Condition | Behavior | Severity |
|-----------|----------|----------|
| `localStorage` unavailable (SSR, private browsing) | `catch` block → defaults to `false` (light mode) | Graceful degradation |
| `localStorage.setItem` fails | `catch` block → state already updated in memory; persistence silently skipped | Graceful degradation |
| Invalid `lightTheme`/`darkTheme` props | MUI `ThemeProvider` may throw at render | Runtime error — caught by error boundary |
| `forceTheme` with invalid value | TypeScript compile-time error | Compile-time |
| Multiple `ThemeProvider` instances | Nested MUI providers may conflict | Logic error — only one root provider |

---

# Non-Functional Requirements

| Requirement | Target | Enforcement |
|-------------|--------|-------------|
| SSR compatibility | Renders light theme when `localStorage` unavailable | Runtime fallback |
| Persistence | Theme preference survives page reloads | `localStorage` read/write |
| Performance | Theme object memoized via `useMemo` | Dependency array: `[darkMode, lightTheme, darkTheme]` |
| Stability | `toggleDarkMode` reference is stable | `useState` setter is stable across renders |
| Testability | `forceTheme` prop for deterministic mode | Unit tests confirm light/dark rendering |

---

# Architecture Compliance Review

## Applied Patterns

| Invariant | Compliance | Evidence |
|-----------|------------|----------|
| Theme Sovereignty | ✅ Full | All theme values flow from MUI Theme objects; no hardcoded values in Provider |
| Stateless UI | ✅ Full | State is purely UI presentation (darkMode toggle); persistence is consumer-transparent |
| Public API Stability | ✅ Full | Exported through `src/lib.ts`; `forceTheme` is additive optional prop |
| Dependency Safety | ✅ Full | Only MUI peer dependencies imported |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `localStorage` race condition | Toggling before mount completes | `useState` initializer runs synchronously |
| Forced theme + toggle interaction | `toggleDarkMode` is no-op when `forceTheme` is set | Documented behavior; intentional for Storybook |
| ~~No system `prefers-color-scheme`~~ | **Resolved**: OS color scheme detected via `window.matchMedia` when localStorage is empty | Implemented |

## Gaps

- ~~No `prefers-color-scheme` media query detection for automatic light/dark switching~~ **Resolved**: Detected on mount via `window.matchMedia("(prefers-color-scheme: dark)")` when no localStorage preference exists.
- ~~No cross-tab theme sync via `BroadcastChannel` or `storage` event~~ **Resolved**: Cross-tab sync via `window.addEventListener("storage")` — theme changes in one tab propagate to others.
- No theme transition animation on switch
- No support for more than 2 themes (light/dark only)

---

# Module Map

```
themeData.ts (ThemeProviderProps type) ──┐
                                          ├──→ ThemeProvider.tsx
themeContext.ts (ThemeContext) ───────────┘       │
                                                  ▼
                                          src/common/theme/index.ts
                                                  │
                                                  ▼
                                          src/common/index.ts
                                                  │
                                                  ▼
                                          src/lib.ts (public API)
```

**Dependencies:**
- Internal: `themeContext.ts`, `themeData.ts`
- External: `@mui/material` (ThemeProvider, CssBaseline)
- React: `useState`, `useMemo`

---

# Final Rule

`ThemeProvider` must be the single root-level theme injection point. It must initialize state from `localStorage`, expose `darkMode`/`toggleDarkMode` via context, wrap with MUI `ThemeProvider` + `CssBaseline`, and support `forceTheme` override for testing. All persistence errors must be silently caught — the application must never crash due to `localStorage` unavailability.

## Authorization

**Visibility:** Public — stateless Prati library primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
