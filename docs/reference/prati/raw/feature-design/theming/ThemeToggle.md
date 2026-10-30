# Overview

ThemeToggle is a button that switches the application between light and dark mode. It reads the current theme from ThemeContext, renders the opposite-mode icon, and dispatches a toggle on click. The component is presentational — it does not own theme state or persistence.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | THEMING-003 |
| Feature Name | ThemeToggle |
| Category | UI Component / Atom |
| Priority | P0 |
| Dependencies | ThemeContext (light/dark state), Token `--color-icon`, locale dictionary |
| Future | Keyboard shortcut, tooltip, icon transition animation |

# User Goals

- See which theme is currently active (sun icon = light mode active, moon icon = dark mode active)
- Switch themes with a single click
- Confirm the switch happened via immediate icon change

# User Journeys

### Entry Conditions

- ThemeProvider mounted higher in the tree
- `useTheme()` returns a valid context value

### Primary Flow: Toggle

1. User sees current-mode icon in toolbar (sun ↔ moon)
2. User clicks the button
3. ThemeContext toggles state (light→dark or dark→light)
4. Button re-renders with the opposite icon
5. `aria-label` updates to describe the new action (e.g., "Switch to dark mode")

### Alternate Flows

None. The toggle has a single interaction path.

### Failure Flows

- **Missing ThemeContext**: `useTheme()` throws. The component cannot render. Error boundary catches and displays fallback UI.
- **Rapid double-click**: synchronous state update. Two clicks fire two toggle dispatches; net effect is a round-trip to the original mode.

### Recovery Flows

- **Missing context recovery**: wrapping the toggle in a ThemeProvider restores function. No in-component recovery logic.

### Exit Conditions

- Icon updated to opposite mode
- `aria-label` updated
- ThemeContext reflects new mode

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | View toolbar | Render toggle with current-mode icon | Current theme from context |
| 2 | Click button | Dispatch `toggleTheme()` | Click event |
| 3 | — | Context computes target mode | Target mode |
| 4 | — | Button re-renders icon | Icon source (sun↔moon) |
| 5 | — | `aria-label` string swapped | Locale key `theme.toggle.*` |

# Screen Inventory

| Screen | Placement |
|---|---|
| All screens | Toolbar (global navigation), position: rightmost |

# Interaction Design

- **Click**: `onClick → toggleTheme()`, synchronous, no animation
- **Hover**: `background-color` shifts by `--color-hover` (8px `border-radius`)
- **Disabled** (Forced mode): `cursor: not-allowed`, `opacity: 0.5`, `pointer-events: none`
- **Touch**: 44×44px hit area ensured via `padding` + minimum `width/height`

# Form Design

Not a form element. Renders as `<button>` with no input value.

# UX State Design

| State | Icon | aria-label | Cursor |
|---|---|---|---|
| Light active | moon | "Switch to dark mode" | pointer |
| Dark active | sun | "Switch to light mode" | pointer |
| Forced/disabled | current mode icon | "Theme switching disabled" | not-allowed |

# Feedback Design

- **Toggle**: icon swaps instantly (no cross-fade, no delay)
- **Disabled**: reduced opacity (0.5) signals non-interactivity
- **Error**: component throws (missing context) — no in-component feedback surface

# Navigation Design

ThemeToggle is a control, not a navigation element. It does not change route or URL. Placement in toolbar ensures discoverability without navigation cost.

# Responsive Design

**Desktop (≥1024px)**: 44×44px button, icon + optional label "Theme" (if toolbar has space). Margin-right: 8px.

**Tablet (600–1023px)**: 44×44px icon-only button. Toolbar collapses to icon-only group. Margin: 8px.

**Mobile (<600px)**: 44×44px icon button in bottom nav or hamburger panel. Adjacent spacing: 8px.

# Accessibility Design

| Requirement | Implementation |
|---|---|
| Contrast | Icon meets 4.5:1 against toolbar background via `--color-icon` token |
| Touch target | 44×44px minimum clickable area |
| Focus-visible | 2px `outline` in `--focus-ring` color, `outline-offset: 2px` |
| Screen reader | Dynamic `aria-label` from locale dictionary (current "Switch to dark/light mode") |
| Semantic HTML | Native `<button>` element |
| Disabled state | `aria-disabled="true"` when in Forced mode |

# Localization Design

| Key | EN | Future |
|---|---|---|
| `theme.toggle.light` | "Switch to light mode" | Translated per locale |
| `theme.toggle.dark` | "Switch to dark mode" | Translated per locale |
| `theme.toggle.disabled` | "Theme switching disabled" | Translated per locale |

Zero hardcoded strings. Locale key is selected based on `currentMode === 'dark'`.

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Single `<button>`, one `onClick`, one `useTheme()` call. |
| Rule 3: Typography Leads | Button inherits typography from theme; no font overrides. |
| Rule 5: White Space is Feature | Padding uses `--space-*` tokens. |
| Color System | Icon color via `--color-icon` CSS variable; no hardcoded hex. |
| Accessibility | 44×44px touch target, `aria-label` on `<button>`, `focus-visible` ring. |
| Localization | `aria-label` sourced from locale dictionary; zero hardcoded text. |
| 8px grid | Button padding = 8px, margin = 8px. |

# Open Questions

- Should the tooltip be added in the next iteration? (Adds discoverability, requires locale key + positioning.)
- Should we support `prefers-color-scheme` as default before user explicitly toggles?
