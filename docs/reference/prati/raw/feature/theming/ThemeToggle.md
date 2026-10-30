# ThemeToggle Component

A button that switches between light and dark mode.

## Overview

Renders a clickable icon button. When dark mode is active, shows a sun icon (switch to light). When light mode is active, shows a moon icon (switch to dark). Accessible with a descriptive label.

## Usage

Place the toggle in a toolbar, navigation, or settings area. It receives the current theme state and toggle function from the theme context.

## Responsibilities

- Render a clickable button for theme switching
- Display the correct icon based on current mode
- Toggle the theme on user click
- Provide accessible label for screen readers

## Non-Responsibilities

- Does not manage theme state or persistence
- Does not handle keyboard shortcut toggling
- Does not render tooltips or labels for theme state
- Does not animate icon transitions

## Business Rules

1. **Icon reflects reality** — The icon must always represent the opposite of the current mode (sun = switch to dark, moon = switch to light); never show the current mode as an icon
2. **Context required** — ThemeToggle must always be rendered inside a ThemeProvider; rendering outside context is an error, not a fallback
3. **No persistence responsibility** — ThemeToggle fires the toggle and reflects state; it never reads or writes storage directly

## States

- **Light icon** — Light mode active; renders moon icon (switch to dark)
- **Dark icon** — Dark mode active; renders sun icon (switch to light)

## Edge Cases

- **Missing context**: Component requires theme context — will error if rendered outside theme provider
- **Rapid clicks**: Toggle is synchronous; multiple rapid clicks cycle through theme modes without error
- **Rapid double-click**: Two rapid clicks result in the theme toggling twice, returning to the original mode; both clicks are processed
- **Disabled parent interaction**: If the parent disables pointer events, the toggle becomes inaccessible

## Error Conditions

- **Missing theme context** — Component cannot locate theme state and cannot render the correct icon or fire the toggle function
- **Invalid context value** — Context is present but provides null or undefined theme values; the toggle function cannot be invoked and the icon state is indeterminate

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing theme context | Ensure ThemeToggle is rendered inside a ThemeProvider; check component tree nesting |
| Invalid context value | Verify ThemeProvider passes valid theme state; check for null/undefined in the context value |

## Authorization

**Visibility:** Public — the theme toggle is visible and interactive for all users regardless of authentication state.

## User Journey

### Entry Conditions
A user sees a sun or moon icon in the toolbar and wants to switch the visual theme.

### Primary Flow
The user clicks the icon — it toggles from sun to moon (or vice versa) and all themed components update immediately.

### Alternate Flows
The toggle is placed in a compact toolbar with limited space — it renders correctly at its fixed size without affecting surrounding layout.

### Failure Flows
The theme context is missing — the component cannot render and throws an error.

### Recovery Flows
The developer ensures the toggle is rendered inside a theme provider; no recovery flow exists for the end user.

### Exit Conditions
The user's theme preference is applied; the icon now shows the opposite state for future toggling.

## Workflow

### Trigger
A click event on the theme toggle icon button.

### Preconditions
The theme context is available and provides the current mode and a toggle function.

### Steps
The user clicks the button, the component calls the toggle function from context, and the icon switches to represent the new mode.

### Outcomes
The theme mode toggles and the application palette updates accordingly.

### Exceptions
The context is undefined — the component throws a runtime error.
### Completion Criteria

The icon updates to reflect the new theme mode and the toggle is ready for the next interaction.

## Verification

- **Icon correctness test**: In light mode, verify moon icon renders; in dark mode, verify sun icon renders
- **Context error test**: Render ThemeToggle outside ThemeProvider; verify it throws a clear error
- **Double-click test**: Click twice rapidly; verify theme returns to original state (both clicks processed)

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [Theming System](./README.md) — theme state owned by the theming system

## Future Enhancements

- Animated icon transition between sun and moon
- Keyboard shortcut for power users
- Tooltip showing current mode and next mode on hover

## Open Questions

- Should the toggle accept a size option, or remain fixed-size?
- Should the accessible label be localized?
