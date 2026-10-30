# ToolbarComponent: Feature Technical

## 1. Technical Overview

`ToolbarComponent` (`src/common/components/organisms/ToolbarComponent.tsx`) is a fixed-position top app bar organism built on MUI `AppBar`. It renders a responsive mobile menu toggle icon button (visible only on `xs` screens), a page title with truncation, and a `ThemeToggle` molecule bound to an externally-resolved `ThemeContextValue`.

All three props are required — `handleDrawerToggle`, `title`, and `themeContext`. The component is a pure View with no state, no data fetching, and no business logic. It acts as the application shell's primary header slot.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | No `useState` or `useEffect` — all data arrives via props |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes `IconButton` (atom), `Typography` (atom), `ThemeToggle` (molecule) |
| **Theme Sovereignty** (theming.md) | `spacing.md`, `theme.zIndex.drawer + 1`, `theme.palette` — no hardcoded values |
| **MVVM Separation** (mvvm-pattern.md) | Pure View — parent resolves `themeContext` via `useTheme()` |
| **Dependency Safety** (dependencies.md) | Imports from MUI, `ThemeToggle`, `ToolbarData`, `spacing` |
| **Public API Stability** (api-surface.md) | Exported via barrel with typed `ToolbarProps` from `ToolbarData.ts` |
| **Platform Neutrality** (platform-abstraction.md) | Pure React + MUI — no platform-specific APIs |

## 3. Data Flow

```
Parent component (App shell)
  │
  ├─► handleDrawerToggle: () => void    (required — menu icon click handler)
  ├─► title: string                     (required — pre-translated page title)
  └─► themeContext: ThemeContextValue    (required — resolved via parent's useTheme())
        │
        ▼
  ToolbarComponent
    │
    ├─► MUI AppBar (position="fixed", zIndex: drawer + 1)
    │     ├─► MUI Toolbar
    │     │     ├─► Conditional (xs only): IconButton (Menu icon, onClick={handleDrawerToggle})
    │     │     ├─► Typography (variant="h6", noWrap, sx flexGrow: 1): {title}
    │     │     └─► Box (flex)
    │     │           └─► ThemeToggle (themeContext={themeContext})
    │     └─► ...
    │
    ▼
  Fixed-position app bar with responsive menu and theme toggle
```

No data flows upward — the component fires `handleDrawerToggle` on menu icon click but the parent decides what happens.

## 4. State Management

**No state.** The component is stateless. Relevant `AppState` concerns:

| Concern | Owner |
|---|---|
| `mobileOpen` (drawer state) | Parent (DrawerComponent) |
| `themeMode` (dark/light) | ThemeContext (resolved via `useTheme()` at App shell) |
| `title` value | Parent (page title resolved from route or state) |

The parent resolves `themeContext` via `useTheme()` (theming.md) and passes it as a prop — the component itself never calls `useTheme()` directly.

## 5. Styling Implementation

All styling uses MUI `sx` prop with theme tokens:

| Token / Rule | Usage |
|---|---|
| `position="fixed"` with `zIndex: theme.zIndex.drawer + 1` | Ensures toolbar renders above the drawer in stacking context |
| `spacing.md` (16px) | Padding within AppBar |
| `theme.palette.background.paper` | AppBar background (inherits theme mode) |
| `theme.palette.text.primary` | Title typography color |
| Display breakpoint `{ xs: 'block', sm: 'none' }` | Menu icon visibility — CSS-based, no JS breakpoint detection |
| MUI `noWrap` on Typography | Title text truncation with ellipsis |

## 6. Interaction Design

| Interaction | Behavior |
|---|---|
| Menu icon click (mobile) | Fires `handleDrawerToggle()` — parent toggles `mobileOpen` in DrawerComponent |
| Theme toggle click | `ThemeToggle` calls parent's `themeContext.toggleTheme()` — switches light/dark mode |
| Responsive menu visibility | Menu icon hidden on `sm+` screens via CSS `display: none` — always rendered but invisible |

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| AppBar landmark | ✅ | MUI `AppBar` provides `role="banner"` by default |
| Menu button label | ⚠️ | Icon button uses `aria-label` set to menu icon (MUI default) — should be localized |
| Theme toggle label | ⚠️ | `ThemeToggle` may not have explicit `aria-label` — depends on ThemeToggle implementation |
| Title heading | ✅ | `Typography variant="h6"` provides semantic heading level |
| Focus management | ✅ | `IconButton` is focusable via keyboard Tab |
| Skip link | ❌ | Not implemented |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| Missing prop | `handleDrawerToggle`, `title`, or `themeContext` omitted | TypeScript compilation error (all required) |
| Missing theme context | `ThemeProvider` missing from ancestor tree | `useTheme()` inside `ThemeToggle` throws invariant error — propagates to parent |
| Long title | Title string exceeds container width | MUI `noWrap` truncates with ellipsis — title visible in tooltip only if parent provides one |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|
| Time complexity | O(1) — single-pass render |
| Re-render behavior | Re-renders when `title`, `handleDrawerToggle`, or `themeContext` reference changes |
| Responsive menu | Menu icon rendered on all viewports but hidden via CSS on `sm+` — avoids conditional rendering but adds invisible DOM node |

## 10. Integration Points

| Integration | Details |
|---|---|
| **DrawerComponent** | Sibling — the toolbar's `handleDrawerToggle` callback controls `DrawerComponent.mobileOpen` |
| **ThemeToggle** | Molecule consumed as child — bound to `themeContext` resolved by parent |
| **App shell** | Used as primary header slot in application layout; runs alongside DrawerComponent and main content |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `ToolbarComponent` |
| **ToolbarData.ts** | `src/common/components/organisms/ToolbarData.ts` defines `ToolbarProps` — imports `ThemeContextValue` from `themeData.ts` |

## 11. Open Questions

1. Should `themeContext` be removed as a prop and instead the component call `useTheme()` internally (reducing parent boilerplate)?
2. Should `aria-label` on the menu icon button be configurable via a prop to support localization?
3. Should a `titleComponent` prop be added to render custom title content (e.g., with an icon or subtitle)?
4. Should the toolbar support action items beyond the theme toggle (e.g., notification bell, user avatar)?
5. Should an error boundary be added to prevent `ThemeToggle` invariant error from crashing the entire toolbar?
6. Should the toolbar support shadow/elevation on scroll (elevation pattern)?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
