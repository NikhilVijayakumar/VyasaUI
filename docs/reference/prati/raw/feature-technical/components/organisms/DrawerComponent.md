# DrawerComponent: Feature Technical

## 1. Technical Overview

`DrawerComponent` (`src/common/components/organisms/DrawerComponent.tsx`) is a responsive side navigation drawer organism built on MUI `Drawer`. It renders a temporary drawer (overlay with backdrop) on `xs` screens and a permanent sidebar on `sm+` screens. Navigation items are filtered by matching feature names against an externally-provided `UiFeatureList` record, enabling feature-flag-driven navigation.

The component is fully controlled — the parent owns `mobileOpen` state and `handleDrawerToggle` callback. It is parameterized with a generic constraint `<T extends Features>` for type-safe feature items.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | Fully controlled — `mobileOpen` and `handleDrawerToggle` owned by parent; no internal open/close state |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes MUI molecules/atoms (`Drawer`, `List`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText`, `Divider`, `Toolbar`, `Box`) |
| **Theme Sovereignty** (theming.md) | `drawerWidth` defined as exported constant (240px); responsive breakpoints via MUI `sx` display rules |
| **MVVM Separation** (mvvm-pattern.md) | Pure View — no ViewModel hook, no repository access, no data fetching |
| **Dependency Safety** (dependencies.md) | Imports from MUI components and `drawerData.ts` (type definitions) |
| **Public API Stability** (api-surface.md) | Exported via barrel with generic typed interface; breaking changes to `Features` constraint affect all consumers |

## 3. Data Flow

```
Parent component (App shell)
  │
  ├─► sortedFeatures: T[] | null       (sorted by display_order)
  ├─► UiFeatureList: Record<string, UiFeature>  (feature key → route mapping)
  ├─► mobileOpen: boolean              (controlled open state)
  ├─► handleDrawerToggle: () => void   (toggle callback)
  ├─► onMenuItemClick: (index: number) => void  (item selection callback)
  └─► container?: () => HTMLElement    (optional scroll container)
        │
        ▼
  DrawerComponent
    │
    ├─► Guard: if (!sortedFeatures || sortedFeatures.length === 0) → <List /> empty
    ├─► Filter: sortedFeatures.filter(f => UiFeatureList[f.name])
    │     (items without matching UiFeatureList key produce null — excluded silently)
    │
    ├─► Temporary Drawer (xs screens, display: { xs: 'block', sm: 'none' })
    │     ├─► open={mobileOpen}
    │     ├─► onClose={handleDrawerToggle}
    │     └─► keepMounted
    │
    └─► Permanent Drawer (sm+ screens, display: { xs: 'none', sm: 'block' })
          └─► open (always true)
                │
                ▼
          User clicks item → handleListItemClick(display_order - 1)
                │
                ▼
          onMenuItemClick(index) → parent navigates / closes drawer
```

## 4. State Management

**No ViewModel state.** The component is fully controlled via props. The parent owns:

| State Variable | Owner | Type | Purpose |
|---|---|---|---|
| `mobileOpen` | Parent | `boolean` | Mobile drawer visibility (toggled by ToolbarComponent) |
| `sortedFeatures` | Parent | `T[] \| null` | Feature-flag-driven navigation items |
| `UiFeatureList` | Parent | `Record<string, UiFeature>` | Route mapping for feature flag filtering |

**UI-only internal helpers** (not state):
- `loadList()` — render-time filter function (no memoization, runs on every render)
- `handleListItemClick(index)` — delegates to `onMenuItemClick(index)` prop

## 5. Styling Implementation

| Style Rule | Implementation |
|---|---|
| Drawer width | Exported const `drawerWidth = 240` — used in `sx={{ width: drawerWidth }}` |
| Mobile responsiveness | `sx={{ display: { xs: 'block', sm: 'none' } }}` on temporary drawer |
| Desktop responsiveness | `sx={{ display: { xs: 'none', sm: 'block' } }}` on permanent drawer |
| Navigation icon | MUI `SvgIconComponent` type — icon sourced from `Features.icon` |
| Feature name truncation | MUI `ListItemText` handles with CSS ellipsis |
| Divider | MUI `Divider` component — uses theme `divider` color |

## 6. Interaction Design

| Interaction | Behavior |
|---|---|
| Toggle menu (mobile) | Parent fires `handleDrawerToggle` → `mobileOpen` toggles → drawer slides in/out |
| Tap overlay (mobile) | MUI Drawer `onClose` fires `handleDrawerToggle` → drawer closes |
| Select item | `handleListItemClick(display_order - 1)` → `onMenuItemClick(index)` → parent handles navigation + drawer close |
| Desktop sidebar | Always visible, no overlay, no toggle interaction |
| Keep-mounted (mobile) | `keepMounted={true}` — content stays in DOM when closed, preserves scroll position |

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| Drawer role | ✅ | MUI `Drawer` provides `role="dialog"` by default |
| Backdrop focus trap | ✅ | MUI temporary drawer traps focus when open |
| `aria-hidden` | ✅ | MUI manages `aria-hidden` on backdrop |
| Keyboard dismiss | ✅ | Escape key closes temporary drawer (MUI default) |
| Active item highlight | ❌ | No `aria-current` or visual indication of current navigation item |
| `aria-selected` | ❌ | Not set on selected menu item |
| Arrow key navigation | ❌ | Not implemented — future enhancement |
| Focus on open | ❌ | Not explicitly managed beyond MUI defaults |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| All features filtered out | No `UiFeatureList` keys match any `feature.name` | Empty `<List />` rendered — drawer appears blank |
| Null/empty `sortedFeatures` | Prop is `null` or `[]` | Guard clause returns empty `<List />` |
| Missing feature key | `UiFeatureList[name]` is undefined | Item returns `null` — excluded silently (no log) |
| Null `container` | Prop is undefined | Default portal target (document body) — mobile drawer renders correctly |
| Long feature name | Name string exceeds container width | MUI `ListItemText` truncates with ellipsis |
| Duplicate `display_order` | Two features share `display_order` | `onMenuItemClick(display_order - 1)` fires with same index — ambiguous navigation |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|
| DOM size | Two `Drawer` instances mounted simultaneously — one always `display: none` |
| `keepMounted` | Mobile drawer content stays in DOM when closed — avoids remount cost but increases baseline DOM |
| Filter pass | O(n) on `sortedFeatures` — runs on every render with no memoization |
| Re-render | Re-renders on every `mobileOpen`, `sortedFeatures`, or `UiFeatureList` reference change |

**Risk:** Permanent drawer is always mounted in DOM even if never visible on mobile — increases baseline DOM size on all viewports.

## 10. Integration Points

| Integration | Details |
|---|---|
| **ToolbarComponent** | Sibling that fires `handleDrawerToggle` — the toolbar menu icon triggers drawer open/close |
| **App shell** | Used as part of the application shell layout alongside `ToolbarComponent` and main content area |
| **Feature flags** | `UiFeatureList` enables feature-flag-driven navigation — items without a flag key are silently excluded |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `DrawerComponent` |
| **drawerData.ts** | `src/common/components/organisms/drawerData.ts` defines `Features`, `UiFeature`, `DrawerProps`, `drawerWidth` |

## 11. Open Questions

1. ~~Should `drawerWidth` be derived from the MUI theme (spacing tokens) instead of a hardcoded constant?~~ **Resolved**: `drawerWidth = 240` remains as a named constant in `drawerData.ts`. Deriving from theme spacing (60× base unit 4px = 240px) adds unnecessary indirection without clarity benefit.
2. Should silent feature exclusion log a warning in development mode for debugging?
3. Should active/highlighted navigation state be added with `aria-current`?
4. Should collapsible/expandable sub-navigation be supported?
5. Should `display_order` be validated for contiguity to prevent duplicate index collisions?
6. Should keyboard arrow navigation be implemented for the menu list?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
