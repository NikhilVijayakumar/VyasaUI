# Theming System

The theming system provides light/dark mode support with persistent preference and a unified set of design tokens.

## Overview

The user can switch between light and dark mode. Their preference is remembered across sessions. All components automatically adapt to the active theme through a shared theme context.

## Responsibilities

- Manage light/dark theme state across the application
- Persist theme preference across sessions
- Provide theme context to all components
- Supply design tokens (colors, spacing, typography) for consistent visual output

## Non-Responsibilities

- Does not manage per-component styling overrides
- Does not handle system-level theme preferences (auto-detect from OS)
- Does not synchronize theme across multiple browser tabs
- Does not provide animation or transition theme values

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| Theme Context | Shared state providing current mode and toggle function to all components |
| Light/Dark Modes | Two complete visual palettes — light and dark |
| Design Tokens | Spacing, color, and typography values that drive consistent rendering |
| Preference Persistence | User's choice is saved and restored across sessions |

## Business Rules

1. **Preference survives sessions** — Theme preference must persist across browser restarts; ephemeral storage is not acceptable
2. **Toggle before render** — The theme context must resolve before any component renders its first frame; flash-of-wrong-theme is not acceptable
3. **Synchronous toggle** — Theme switching must be synchronous; no loading states, no delays between toggle and visual update
4. **One provider per tree** — Only one ThemeProvider should manage state per component tree; nested providers cause undefined behavior
5. **Server-safe default** — Server-side rendering must produce light mode output regardless of the user's stored preference; hydration may correct post-load

## States

- **Uninitialized** — Before persistence is read; defaults to light mode
- **Light mode** — Light palette active
- **Dark mode** — Dark palette active
- **Forced mode** — External override active (bypasses persisted state)

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Light mode | No persisted preference, or preference = light |
| Uninitialized | Dark mode | Persisted preference = dark |
| Uninitialized | Forced mode | External override present at mount |
| Light mode | Dark mode | User toggles theme |
| Dark mode | Light mode | User toggles theme |
| Light mode | Forced mode | External override applied |
| Dark mode | Forced mode | External override applied |

## Edge Cases

- **Missing persistence**: Falls back to light mode if storage is unavailable
- **Server rendering**: No access to browser persistence; defaults to light mode
- **Rapid toggling**: Toggle is synchronous; no race condition
- **Nested providers**: Only the outermost provider should manage theme state

## Error Conditions

- **Persistence unavailable** — Storage access throws; fallback to light mode
- **Server rendering** — No browser APIs available; renders light theme, hydration may flicker
- **Invalid theme configuration** — Malformed theme values may cause rendering errors
- **Nested providers** — Multiple providers cause conflicting context; only root should manage state

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Persistence unavailable | Fall back to light mode; allow user to toggle manually — preference will persist for current session only |
| Server rendering | Accept initial light-mode render; client hydration will apply stored preference post-load |
| Invalid theme configuration | Validate theme object structure before passing to provider; log configuration errors |
| Nested providers | Remove inner ThemeProvider; let the root provider propagate to all consumers |

## Authorization

**Visibility:** Public — theme switching is available to all users regardless of authentication state.

## User Journey

### Entry Conditions
A user encounters a theme toggle in the toolbar or settings area of the application.

### Primary Flow
The user clicks the toggle to switch between light and dark mode — all components update instantly, and the preference is saved for the next session.

### Alternate Flows
The application renders in light mode by default on first visit or when persistence is unavailable (e.g., server-side rendering).

### Failure Flows
The persistence mechanism throws an error — the application falls back to light mode without crashing.

### Recovery Flows
On the next successful load, persistence is re-attempted; the system defaults to light mode until a manual toggle restores the preference.

### Exit Conditions
The user closes the session or navigates away; their theme preference persists automatically.

## Workflow

### Trigger
A user clicks the theme toggle button or the application loads and reads the persisted preference.

### Preconditions
The theme provider is mounted and wrapping the application tree.

### Steps
The toggle fires a synchronous state change, the theme context propagates the new mode to all consumers, and the preference is persisted to storage.

### Outcomes
All themed components re-render with the new palette colors instantly.

### Exceptions
Storage is unavailable — the toggle still switches the mode but the preference is not persisted.
### Completion Criteria

The active theme matches the user's selection and all components display the correct palette.

## Verification

- **Persistence recovery test**: Clear storage; reload page; verify light mode renders and toggle works
- **Toggle correctness test**: Click toggle 10 times and verify each state produces the correct palette
- **Provider isolation test**: Render two independent component trees with separate ThemeProviders; verify toggling one does not affect the other
- **Server render test**: Verify the initial render output (no browser APIs) is always light mode

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [ThemeToggle](./ThemeToggle.md) — UI control that drives theme state changes
- [Design Tokens](./tokens.md) — visual primitives consumed by the theming system
- [Application Rendering Workflow](../workflows/application-rendering.md) — rendering pipeline that consumes theme context

## Future Enhancements

- System `prefers-color-scheme` detection with opt-in auto mode
- Theme transition animations for palette changes
- High-contrast accessibility theme variant

## Open Questions

- How should embedded widgets or micro-frontends participate in theming?
- Is CSS variable-based theming a better long-term approach?
