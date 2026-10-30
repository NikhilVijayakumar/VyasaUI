# Overview

ErrorState is a centered error display that appears when an operation fails. The user sees a visually distinct error message — either a custom message supplied by the parent or a localized default, with an empty fallback when neither is available.

# Feature Summary

- **Purpose**: A centered error display that shows when an operation fails.
- **Responsibilities**: Display error message with error-appropriate visual styling; Show custom error message when provided; Fall back to localized default message when no custom message given
- **Non-Responsibilities**: Does not capture/log errors; Does not provide retry/dismiss callbacks; Does not display error codes/stack traces; Does not manage error recovery

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Understand that an operation failed | User sees a centered error message explaining what went wrong |
| Read a contextual error message | User reads either a parent-supplied custom message or a localized default |

# User Journeys

### Entry Conditions
Parent switches to error state after an operation failure

### Primary Flow
1. An operation fails
2. Parent component sets internal state to error and renders ErrorState
3. If custom message prop is provided, ErrorState displays it with error styling
4. If no custom message, ErrorState looks up the localized default key
5. User sees the centered error message

### Alternate Flows
- No custom message and no localization key -> ErrorState renders no visible text

### Failure Flows
- Missing localization key -> component renders empty content (no visible text)

### Recovery Flows
N/A — retry and recovery are managed by the parent component

### Exit Conditions
Parent removes ErrorState and renders the recovered content

| Journey | Description |
| ------- | ----------- |
| View operation failure | User sees a centered error message after an operation fails |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| ErrorState | Centered error display filling parent container width |

# Interaction Design

None — purely presentational atom. Retry/dismiss callbacks are handled by the parent component.

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | No form fields — attribute is presentational only |

# UX State Design

- **Error**: active rendering state, error message displayed with error-appropriate visual styling
- **Empty**: no custom message and no localization key produces no visible text

No LOADING state — ErrorState only renders in the error condition.

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| N/A | No interactive events — attribute is presentational |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | No navigation — static centered element within parent |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Error state centered with max-width constraint |
| Tablet | Same centered layout with responsive max-width |
| Mobile | Full-width centered layout; long messages wrap within container |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Error text contrast | Error message text meets 4.5:1 minimum contrast ratio |
| Semantic role | Container uses `role="alert"` for screen reader announcement |
| Empty state | No visible content when message is absent; parent avoids rendering ErrorState without content |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Default error message | Falls back to localized string via key naming convention (e.g., `error.default`) |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | No retry buttons, no error codes, no stack traces — just the message |
| 8px grid | Centered layout padding uses 8px multiples |
| Color System: CSS variables, never hardcode | Error visual style uses CSS variable tokens |
| Typography Leads | Error message hierarchy conveyed through type weight and spacing, not decorative elements |
| White Space is Feature | Ample whitespace around the error message creates visual focus |

# Open Questions

- What is the exact localized key for the default error message?
- Should a minimum height be specified so layout shift is minimized when ErrorState replaces content?
