# ToolbarComponent

A top app bar with navigation toggle and theme switching control.

## Overview

A fixed-position top bar that displays a mobile menu toggle button, a page title, and a theme toggle control. The mobile menu button is visible only on small screens. The title truncates with ellipsis when too long. The theme toggle is bound to the application's theme context, allowing users to switch between light and dark modes.

## Responsibilities

- Render a fixed-position app bar at the top of the viewport
- Display a mobile menu toggle icon button (visible on small screens only)
- Render the title text with truncation for long strings
- Render a theme toggle control bound to the application's theme context

## Non-Responsibilities

- Does not handle navigation, routing, or page transitions
- Does not manage authentication or user session state
- Does not render content below the app bar
- Does not manage drawer open/close state — receives toggle handler as input
- Does not handle responsive layout beyond hiding the menu icon on larger screens

## Related Components

- [DrawerComponent](./DrawerComponent.md) — sibling component that owns the open/close state for side navigation; the toolbar fires the toggle callback and the drawer manages the resulting state change

## Core Concepts

- **Fixed-position top bar:** The toolbar stays at the top of the viewport during scroll, providing persistent access to navigation and theme controls.
- **Responsive visibility strategy:** The mobile menu toggle icon is hidden on larger screens via CSS — a responsive pattern that avoids JavaScript breakpoint detection.
- **Controlled callback pattern:** The drawer toggle is a required input callback — the toolbar fires the event but the parent decides what happens.

## Business Rules

1. The mobile menu toggle icon is visible only on small screens via CSS; no JavaScript breakpoint detection is used.
2. The drawer toggle callback is required — the toolbar fires it on click but the parent controls the response.
3. The title truncates with ellipsis when it exceeds the available width; no multiline wrapping is supported.
4. The theme toggle reads from and writes to the application's theme context; the toolbar must be wrapped in a theme provider.
5. The toolbar is fixed-position and remains at the top of the viewport during vertical scroll.

## States

- **Idle** — Title, menu button (mobile), and theme toggle visible
- **Mobile** — Menu icon button visible (small screens)
- **Desktop** — Menu icon hidden (larger screens)

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Mobile | Desktop | Viewport width crosses the breakpoint threshold to a larger screen size |
| Desktop | Mobile | Viewport width crosses the breakpoint threshold to a small screen size |
| Idle | Mobile | Component mounts on a small-screen viewport |
| Idle | Desktop | Component mounts on a large-screen viewport |

## Edge Cases

- Long title: Title text truncates with ellipsis
- Menu icon only visible on small screens: Hidden via CSS on larger screens
- Drawer toggle fires on every click regardless of screen size — parent should handle responsive behavior

## Error Conditions

- Missing theme context — Invariant error; must be wrapped in a theme provider

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Missing theme context | Wrap the component tree in a ThemeProvider before rendering the toolbar |
| Missing drawer toggle callback | Pass a valid toggle handler function via the onToggleDrawer prop |

## Authorization

**Visibility:** Authenticated — the application toolbar is rendered for authenticated users; the theme toggle within it is Public.

## User Journey

### Entry Conditions
The application loads and the toolbar renders at the top of the viewport with a title, navigation toggle, and theme switch.

### Primary Flow
A user sees the page title in the toolbar, taps the menu icon (mobile) to open navigation, or taps the theme toggle to switch light/dark mode.

### Alternate Flows
On a desktop screen — the menu icon is hidden and only the title and theme toggle are visible.

### Failure Flows
The theme context is missing — the component throws an invariant error.

### Recovery Flows
The developer ensures the toolbar is wrapped in a theme provider.

### Exit Conditions
The user navigates to a different page (title updates) or switches theme mode.

## Workflow

### Trigger
The application renders this toolbar with a page title and a drawer toggle callback.

### Preconditions
The theme provider is mounted in the component tree.

### Steps
The component renders a fixed-position bar with the title, mobile menu toggle (conditional), and theme toggle bound to theme context.

### Outcomes
The user sees the page title and can interact with navigation and theme controls.

### Exceptions
Missing theme context — the component throws and breaks rendering.
### Completion Criteria

The toolbar is rendered with title and controls, ready for user interaction.

## Verification

- Verify that the toolbar renders at the top of the viewport with a fixed position
- Verify that the title truncates with ellipsis when it exceeds the toolbar width
- Verify that the mobile menu toggle icon is visible on narrow viewports and hidden on wide viewports
- Verify that clicking the theme toggle switches between light and dark modes via the theme context
- Verify that the toolbar renders without error when the theme provider is present

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [DrawerComponent](./DrawerComponent.md) — sibling component that owns the navigation drawer state
- [ThemeToggle](../../theming/ThemeToggle.md) — the theme control embedded in this toolbar
