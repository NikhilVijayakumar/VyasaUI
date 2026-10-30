# Notification

A temporary message that appears at the bottom of the screen and auto-dismisses.

## Overview

A toast-style notification that displays a message with a configurable severity level (success, info, warning, error). Anchored at the bottom-center of the viewport. Auto-dismisses after a configurable duration, or can be set to persist until manually closed.

## Responsibilities

- Display a toast notification at the bottom-center of the screen
- Show a message with configurable severity styling
- Auto-dismiss after a configurable duration
- Fire a callback when dismissed or auto-hidden

## Non-Responsibilities

- Does not manage app-wide notification queue or stacking
- Does not persist notification history across sessions
- Does not provide undo or action callbacks within the notification
- Does not handle multiple simultaneous notifications
- Does not support custom positioning

## Core Concepts

- **Controlled component pattern:** The parent owns visibility state and receives close callbacks — the component has no internal open/close state.
- **Timer-driven auto-dismiss:** Auto-dismiss is configured via a duration setting; setting it to null disables auto-dismiss entirely for persistent notifications.
- **Bottom-anchored toast positioning:** Deliberate UX choice for non-intrusive global notifications at the bottom-center of the viewport.

## Business Rules

1. The component MUST be a controlled component — the parent owns visibility state and the component fires close callbacks.
2. Auto-dismiss MUST be configurable via a duration prop; setting it to null MUST disable auto-dismiss entirely.
3. The notification MUST fire a close callback when dismissed, whether auto-dismissed or manually closed.
4. The component MUST NOT manage an app-wide notification queue or stacking logic.
5. The notification MUST be anchored to the bottom-center of the viewport with no positioning customization.

## States

- **Open** — Notification visible with content displayed
- **Closed** — Notification hidden, no content renders
- **Auto-dismissing** — Timer active, counting down to auto-hide
- **Persistent** — Auto-dismiss disabled; stays open until manually closed

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Closed | Open | Parent sets open = true |
| Open | Auto-dismissing | Auto-dismiss duration is set and timer starts |
| Open | Persistent | Auto-dismiss is set to null |
| Open | Closed | User manually closes before timer expires |
| Auto-dismissing | Closed | Timer expires |
| Persistent | Closed | User manually closes |

## Edge Cases

- Open is false: Notification is hidden; no content renders
- Auto-dismiss set to null: Stays open until manually dismissed
- Very short auto-dismiss with error severity: User may not read the message in time
- Multiple rapid open/close toggles: Transition may flicker

## Error Conditions

- Missing required inputs (open state, message, close callback) — Required values must be provided
- Close callback throws — Error propagates to parent

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing required inputs (open state, message, close callback) | Ensure all required props are provided by the parent component |
| Close callback throws | Wrap the callback in a try-catch in the parent to prevent the error from propagating |

## Authorization

**Visibility:** Authenticated — used to surface system events and feedback within authenticated application views.

## User Journey

### Entry Conditions
An application event (success, error, info) triggers a notification that needs to be shown to the user.

### Primary Flow
A toast notification slides in at the bottom-center of the viewport with the message and severity styling — it auto-dismisses after the configured duration.

### Alternate Flows
Auto-dismiss is disabled — the notification stays visible until manually closed.

### Failure Flows
A required input (message or close callback) is missing — the notification cannot function as intended.

### Recovery Flows
The developer ensures all required props are provided or the parent manages the error.

### Exit Conditions
The notification auto-dismisses or the user sees it and it closes — the parent receives the close callback.

## Workflow

### Trigger
The parent component renders this notification with a message, severity, and close callback.

### Preconditions
The parent owns the open/close visibility state and provides the required message and close callback.

### Steps
The notification renders at bottom-center with severity styling, starts the auto-dismiss timer (if configured), and fires the close callback when dismissed.

### Outcomes
The user sees a temporary notification with appropriate severity styling.

### Exceptions
Auto-dismiss is null — the notification persists until manually closed.

### Completion Criteria
The notification is displayed and dismissed either automatically or manually.

## Verification

- Unit tests confirm the close callback fires on both manual dismiss and auto-dismiss timeout
- Integration tests confirm auto-dismiss is disabled when duration is null
- Visual tests confirm the notification renders at the bottom-center of the viewport
- Integration tests confirm the notification renders with all severity styles (success, info, warning, error)

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
