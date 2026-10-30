# ErrorState

A centered error display that shows when an operation fails.

## Overview

Displays an error message with appropriate visual treatment for error states. Accepts an optional custom error message; falls back to a localized default message when none is provided. Centered within its container.

## Responsibilities

- Display an error message with error-appropriate visual styling
- Show a custom error message when provided
- Fall back to a localized default message when no custom message is given

## Non-Responsibilities

- Does not capture or log errors to any service
- Does not provide retry, dismiss, or action callbacks
- Does not display error codes, stack traces, or technical details
- Does not manage error recovery or state transitions

## Core Concepts

- **Fallback chain pattern:** The component resolves display text by checking custom message first, then localized default, then empty state. No branch throws.
- **Optional prop with conditional rendering:** The message is optional — the component adapts its output based on presence or absence.
- **Purely presentational atom:** No state, no callbacks, no error recovery logic.

## Business Rules

1. The component MUST display a custom message when provided, falling back to a localized default when absent.
2. The component MUST NOT capture, log, or transmit error data to any external service.
3. The component MUST NOT provide retry, dismiss, or action callbacks — it is purely presentational.
4. The component MUST NOT render stack traces, error codes, or technical details.
5. When both the custom message and localization key are missing, the component MUST render with no visible content rather than crashing.

## States

- **Error** — Active rendering state; error message displayed
- **Empty** — No message provided and localization key missing; renders with no visible text

## Edge Cases

- No message provided: Falls back to localized default message
- Missing localization key: Renders with no visible content
- Extremely long message text: Text wraps within the container
- Multiple instances: Each renders independently with no coordination

## Error Conditions

- Missing message and missing localization key — Alert renders with no visible content

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing message and missing localization key | Provide either a custom message prop or ensure the localization key exists in locale files; the component remains mounted but renders invisibly as a safe fallback |

## Authorization

**Visibility:** Authenticated — displayed when an operation fails within authenticated application contexts.

## User Journey

### Entry Conditions
An async operation fails and the parent component switches from loading state to error state.

### Primary Flow
The user sees a centered error message — if a custom message was provided it shows that, otherwise a localized default error text appears.

### Alternate Flows
No message is provided and the localization key is missing — the component renders no visible content.

### Failure Flows
The operation fails but no error state component is rendered — the user sees a broken or blank UI.

### Recovery Flows
The user retries the operation through a mechanism outside this component (retry button in parent).

### Exit Conditions
The user acknowledges the error and either retries or navigates away.

## Workflow

### Trigger
An application operation fails and the parent component enters error state.

### Preconditions
The parent component detects a failure and renders this component with an optional custom error message.

### Steps
The component displays the custom message or falls back to the localized default error text.

### Outcomes
The user is informed that an error occurred.

### Exceptions
No message and no localization key — the component renders invisibly.

### Completion Criteria
The error message is displayed and the user is aware of the failure.

## Verification

- Unit tests confirm the fallback chain: custom message → localized default → empty render
- Integration tests confirm no error logging or external calls are made
- Visual tests confirm error styling is applied correctly
- Accessibility tests confirm the error message is announced by screen readers

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [LoadingState](./LoadingState.md) — sibling atom displayed before an operation fails
- [EmptyState](./EmptyState.md) — sibling atom shown when an operation returns no data
- [State Management](../../state/README.md) — the async state lifecycle that drives this component
