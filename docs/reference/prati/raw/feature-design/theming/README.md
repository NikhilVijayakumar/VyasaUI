# Overview

The Theming system provides light and dark mode support backed by persistent user preference and a unified design-token layer. Every visual component reads theme context to render the correct palette; the toggle writes preference to storage immediately so the choice survives session boundaries.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | THEMING-001 |
| Feature Name | Theming System |
| Category | UI Infrastructure |
| Priority | P0 |
| Dependencies | Design Tokens (tokens.md), ThemeToggle component |
| Future | prefers-color-scheme detection, transition animations, high-contrast variant |

# User Goals

- Switch between light and dark palettes with a single click
- Have the chosen palette persist across browser sessions
- See all themed UI elements update instantly on toggle

# User Journeys

### Entry Conditions

- Application has loaded (SSR or client-side)
- ThemeProvider has mounted in the component tree

### Primary Flow: Toggle theme

1. User clicks the theme toggle button in the toolbar
2. Current palette switches from light→dark or dark→light
3. All components consuming ThemeContext re-render with the new palette
4. Preference (light/dark) is serialized and written to persistent storage

### Alternate Flows

- **Forced mode (external override)**: An external caller (e.g., system admin, embed parent) forces a specific mode. The toggle is disabled. Preference is not persisted. Transition: Light/Dark → Forced; from Forced, only an external call can return to Light/Dark.

### Failure Flows

- **Missing persistence target**: write to storage fails silently; theme still toggles in-memory. Fallback: preference defaults to light on next load.
- **SSR mismatch**: server renders light (default); client hydrates with stored preference. No flicker mitigation in current scope.

### Recovery Flows

- **SSR default load**: preference not available → session starts in light mode. Once JavaScript executes, stored preference is read and applied.
- **Rapid toggling**: synchronous state update; no queuing or race conditions.

### Exit Conditions

- Theme toggle returns light or dark mode value
- Preference is persisted (unless in Forced mode)
- All subscribed components have re-rendered

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Click toggle icon | Read current theme from ThemeContext | Current mode |
| 2 | — | Compute target mode (light↔dark) | Target mode |
| 3 | — | Write ThemeContext with target mode | Theme state |
| 4 | — | Persist preference to localStorage | "light" / "dark" string |
| 5 | — | All subscribers re-render with new tokens | CSS variable cascade |

# Screen Inventory

| Screen | Component | Theme Role |
|---|---|---|
| All screens | ThemeProvider (root wrapper) | Provides context + token injection |
| All screens | ThemeToggle (toolbar) | Triggers state transition |
| All screens | All themed children | Consume context for color/background |

# Interaction Design

- **Toggle click**: fires `toggleTheme()` — synchronous dispatch, no debounce
- **Toggle disabled**: cursor `not-allowed`, opacity 0.5, pointer-events disabled when in Forced mode
- **Hover**: toggle icon changes background tint (8px radius, token `--color-hover`)
- **Focus-visible**: 2px ring via `--focus-ring` token, offset 2px
- **Touch target**: 44×44px minimum (toggle icon plus padding)

# Form Design

No form fields. ThemeToggle is a single button element with no input.

# UX State Design

| State | Visual | Trigger | Transition Out |
|---|---|---|---|
| Uninitialized | Light palette rendered (default) | App mount, no stored preference | → Light (context init) |
| Light | Light-mode CSS variables active | User toggle to dark, or context init | → Dark (toggle) |
| Dark | Dark-mode CSS variables active | User toggle to light | → Light (toggle) |
| Forced | Locked palette, toggle disabled | External override call | → Light/Dark (external release) |

# Feedback Design

- **Toggle success**: icon swaps instantly (sun↔moon); all themed surfaces repaint in <16ms (synchronous context update)
- **Toggle failure**: impossible — synchronous local state, no network dependency
- **Persistence failure**: no user-facing notification; preference reverts to light on next session

# Navigation Design

ThemeProvider wraps the application root. No navigational role — it is a passive data layer. ThemeToggle is placed in the persistent toolbar (global navigation shell) for visibility from any route.

# Responsive Design

**Desktop (≥1024px)**: ThemeToggle in top toolbar, 44×44px hit area, icon + optional short label. Toolbar full width.

**Tablet (600–1023px)**: ThemeToggle in collapsed toolbar. Icon only. 44×44px hit area preserved. Toolbar may shrink to icon-only navigation.

**Mobile (<600px)**: ThemeToggle in bottom navigation bar or hamburger menu. 44×44px minimum. Spacing from adjacent items: 8px per 8px grid.

# Accessibility Design

| Requirement | Implementation |
|---|---|
| Contrast ratio | All token pairs meet 4.5:1 (color roles designed with contrast target) |
| Touch target | 44×44px minimum clickable area |
| Focus-visible | 2px `outline` using `--focus-ring` token, `outline-offset: 2px` |
| Screen reader | `<button aria-label="Switch to dark mode">` (dynamic label based on current mode) |
| Semantic HTML | Native `<button>` — no div with click handler |
| Reduced motion | No animations — toggle is instant (future animations will respect `prefers-reduced-motion`) |

# Localization Design

- `aria-label` on ThemeToggle reads from localisation dictionary: `theme.toggle.light` / `theme.toggle.dark`
- Zero hardcoded strings in the component
- Locale dictionary keys follow `feature.component.property` convention

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Single `ThemeProvider` + one `useTheme` hook. No middleware, no event bus. |
| Rule 3: Typography Leads | Tokens define font families; theme does not override typography. |
| Rule 5: White Space is Feature | Theme does not manage spacing; spacing tokens are consumed separately. |
| Color System | All palette colors are CSS variables; zero hardcoded hex/rgb in components. |
| Accessibility | 4.5:1 contrast, 44×44px touch targets, focus-visible, semantic `<button>`. |
| Localization | `aria-label` sourced from locale dictionary; no hardcoded strings. |
| 8px grid | Toggle button padding satisfies 8px multiples. |

# Open Questions

- Should a flashing/flicker mitigation be added during SSR hydration? (Future: inline script to read localStorage before React hydrates.)
- Does the forced-mode API require a priority stack (e.g., multiple simultaneous overrides)?
