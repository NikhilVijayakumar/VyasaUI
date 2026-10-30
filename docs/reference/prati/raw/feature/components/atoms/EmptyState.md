# EmptyState

A centered "no data" indicator shown when a dataset is empty.

## Overview

A simple text indicator displaying a localized "No data found" message when no content is available to display. Centered in its container with standard spacing. Self-contained with no configuration options.

## Responsibilities

- Display a centered "No data found" text indicator
- Use localization for the message text
- Fill the width of its parent container

## Non-Responsibilities

- Does not accept custom messages or content
- Does not provide action buttons, retry, or dismiss functionality
- Does not handle loading, error, or populated state transitions
- Does not manage or persist state

## Core Concepts

- **Zero-configuration interface:** Accepts no inputs — a self-contained "no data" indicator that enforces consistent empty messaging across the entire application.
- **Localization-driven text:** Message resolves through the localization system, enabling locale switching without prop changes.
- **Conditional visibility pattern:** The parent controls when this component renders — the component itself has no visibility logic.
- **Consistent centering pattern:** Uses the same centering approach as LoadingState and ErrorState for visual consistency across all state atoms.

## Business Rules

1. The component MUST accept zero props — it is a fully self-contained empty-state indicator.
2. The message text MUST resolve through the localization system; missing keys result in no visible text.
3. The component MUST NOT provide action buttons, retry, or dismiss functionality — it is purely informational.
4. The component MUST match the centering and spacing pattern used by LoadingState and ErrorState for visual consistency.
5. The parent component exclusively controls when this component renders — the component itself has no conditional visibility logic.

## States

- **Empty** — Always in empty state by definition; displays "No data found" text

## Edge Cases

- Missing localization key: Renders with no visible text
- Parent layout overrides centering: Component still renders but may not appear centered
- Multiple instances: Each renders independently with no coordination

## Error Conditions

- Missing localization key — Typography renders with no visible text

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing localization key | Ensure the localization key is defined in the locale file; the component remains mounted without visible text as a safe fallback |

## Authorization

**Visibility:** Authenticated — displayed when a data operation returns no results within authenticated application contexts.

## User Journey

### Entry Conditions
A dataset returns zero results and the parent component renders this indicator in place of the content area.

### Primary Flow
The user sees a centered "No data found" message filling the content area — the UI clearly communicates the empty state without confusion.

### Alternate Flows
The localization key is missing — the user sees an empty area with no text.

### Failure Flows
The parent component fails to check for empty data and renders nothing or a broken layout.

### Recovery Flows
The developer wraps the data display with an empty-state check that conditionally renders this component.

### Exit Conditions
The user understands there is no data to display and moves on, or the data refreshes and the parent swaps this component for the content.

## Workflow

### Trigger
A data-fetching operation completes with zero results.

### Preconditions
The parent component detects the dataset is empty and renders this component instead of the content view.

### Steps
The component renders the localized empty message centered in the container.

### Outcomes
The user is informed that no data is available.

### Exceptions
The localization key is missing — the component renders with no visible text.

### Completion Criteria
The empty-state message is displayed in place of the content area.

## Verification

- Visual tests confirm the empty message is centered within its parent container
- Integration tests confirm the message resolves through the localization system
- Visual regression tests confirm consistent spacing and styling with LoadingState and ErrorState
- Integration tests confirm the component renders without crashing when localization key is missing

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [LoadingState](./LoadingState.md) — sibling atom displayed while data is loading
- [ErrorState](./ErrorState.md) — sibling atom displayed when a data operation fails
- [State Management](../../state/README.md) — the async state lifecycle that drives this component
