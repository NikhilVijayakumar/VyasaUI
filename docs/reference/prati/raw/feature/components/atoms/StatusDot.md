# StatusDot

A colored circular indicator that shows system or component status at a glance.

## Overview

Displays a small colored dot representing one of several predefined states (ok, warning, error, executing, waiting). The color communicates the state without requiring text. Size is configurable for different contexts.

## Responsibilities

- Visually communicate component or system status
- Support multiple status levels with distinct colors
- Allow size configuration for different UI contexts

## Non-Responsibilities

- Does not display text labels or tooltips
- Does not handle click interactions
- Does not animate state transitions
- Does not manage or persist state

## Core Concepts

- **Status-driven color mapping:** Each status value maps to a specific color — no conditional logic, no branching. Adding a new status means adding one entry to the mapping.
- **Theme-aware colors:** Colors adapt automatically to dark and light mode without component-level awareness.
- **Fallback chain:** Unknown status values silently fall back to a neutral default color.
- **Static indicator pattern:** The component is a pure function of its inputs — no internal state, no side effects, no interaction.

## Business Rules

1. The component MUST map exactly one color per status value — no two statuses may share the same color.
2. The component MUST NOT render a tooltip, label, or text alongside the dot.
3. The component MUST render as a pure function of its props — no internal state or side effects.
4. The size prop MUST be a positive numeric value; values of zero or below render the dot invisible.
5. The component MUST fall back to a neutral default color for any unrecognized status value.

## States

- **ok** — Green dot; normal operation
- **warning** — Yellow dot; attention needed
- **error** — Red dot; failure state
- **executing** — Blue dot; operation in progress
- **waiting** — Gray dot; pending or idle
- **default** — Neutral; no specific status

## Edge Cases

- Unknown status: Falls to a neutral default color
- Missing status: Component requires a status value
- Size of zero: Dot renders with no dimensions (invisible but present)
- Large size values: Dot scales proportionally with no upper bound

## Error Conditions

- Invalid status value — Falls back to neutral default appearance
- Negative or zero size — Dot becomes invisible

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Invalid status value | Provide a valid status from the supported set (ok, warning, error, executing, waiting); the fallback color maintains a functional display in the meantime |
| Negative or zero size | Provide a positive numeric size value; the dot will re-render with visible dimensions |

## Authorization

**Visibility:** Authenticated — rendered within authenticated application views to communicate data status.

## User Journey

### Entry Conditions
A developer places this indicator next to a component or row that has a status (online, offline, error, etc.).

### Primary Flow
The user sees a small colored dot that communicates the status at a glance without needing to read text.

### Alternate Flows
An unknown status value is provided — the dot renders in a neutral default color.

### Failure Flows
No status value is provided — the dot may not render or renders with no meaningful color.

### Recovery Flows
The developer provides a valid status value from the supported set.

### Exit Conditions
The user interprets the status from the dot color and takes appropriate action.

## Workflow

### Trigger
A developer renders this dot with a status value and optional size.

### Preconditions
A status value is provided (ok, warning, error, executing, waiting).

### Steps
The component maps the status to a theme color and renders a colored dot at the specified size.

### Outcomes
A color-coded status indicator is displayed to the user.

### Exceptions
An unknown status falls back to a neutral default color.

### Completion Criteria
The status indicator renders correctly for all severity levels.

## Verification

- Unit tests confirm each status value maps to the correct color
- Visual regression tests confirm the dot renders at all configured sizes
- Accessibility tests confirm the dot has an accessible label for screen readers
- Integration tests confirm the fallback behavior for unknown status values

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [SeverityBadge](./SeverityBadge.md) — related component providing text-based severity labels
