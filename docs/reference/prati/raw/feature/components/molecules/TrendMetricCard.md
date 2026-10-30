# TrendMetricCard

A compact card that displays a key metric with an optional trend direction indicator.

## Overview

Shows a metric label and value in a compact card format, with an optional trend indicator showing direction (up/down/neutral) and percentage change. The trend color communicates positive (green) or negative (red) movement. Adapts to its container width for use in dashboard metric rows.

## Responsibilities

- Display a metric label and value in a compact card
- Show an optional trend indicator with color-coded direction
- Adapt to container width

## Non-Responsibilities

- Does not fetch or calculate metric data
- Does not format values beyond rendering them as-is
- Does not handle click events or user interaction
- Does not animate trend changes or value transitions
- Does not provide chart or sparkline visualization

## Core Concepts

- **Metric display pattern:** Combines label, value, and optional trend into a single compact card — a reusable primitive for dashboard metric visualizations.
- **Conditional trend rendering:** The trend indicator only renders when a trend value is provided; the trend direction prop is inert without a value.
- **Color-coded direction mapping:** Trend direction maps to semantic colors (green for up, red for down, neutral gray) — consistent with the application's status color system.
- **Fluid width adaptation:** Designed to fill available container space in flex row layouts as part of a metric row group.

## Business Rules

1. The component MUST display a label and value as required minimum props — rendering is not meaningful without both.
2. The trend indicator MUST only render when a trend value is explicitly provided.
3. Trend direction MUST map to semantic colors: green for up, red for down, neutral for unknown or absent direction.
4. An unknown trend direction value MUST render with neutral color treatment — the component MUST NOT crash.
5. The card MUST adapt to its container width without a fixed width — intended for flex row dashboard layouts.

## States

- **Loaded** — Label and value displayed
- **With trend** — Trend value and direction provided; indicator rendered with color-coded direction
- **Without trend** — Only label and value shown; no trend indicator

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Loaded | With trend | Trend value and direction props are provided |
| Loaded | Without trend | Trend props are absent or trend value is omitted |
| With trend | Without trend | Trend value removed; indicator no longer renders |
| Without trend | With trend | Trend value provided; indicator renders with direction color |

## Edge Cases

- No trend value provided: Trend indicator not rendered
- Trend value provided but trend direction omitted: Renders with neutral color
- Unknown trend direction: Renders with neutral treatment
- Value of zero: Renders normally as a numeric value
- Very long label or value: Text wraps within the card

## Error Conditions

- Missing required inputs (label, value) — Required values must be provided
- Unknown trend direction — Renders with neutral fallback color

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing required inputs (label, value) | Provide both label and value props; the component cannot render meaningfully without them |
| Unknown trend direction | Provide a recognized direction (up, down) or accept the neutral color fallback |

## Authorization

**Visibility:** Authenticated — used to display key metrics in authenticated dashboard views.

## User Journey

### Entry Conditions
A developer needs to display a key metric with an optional trend indicator in a dashboard or summary panel.

### Primary Flow
The developer provides a label, value, and optional trend direction with percentage — the card renders with color-coded trend indication.

### Alternate Flows
No trend value is provided — the card displays just the label and value without the trend indicator.

### Failure Flows
Required inputs (label, value) are missing — the component cannot render meaningfully.

### Recovery Flows
The developer provides the required props.

### Exit Conditions
The user reads the metric and trend at a glance and moves on to the next metric.

## Workflow

### Trigger
A developer renders this card with a metric label and value, optionally with a trend direction and value.

### Preconditions
A label and value are provided.

### Steps
The component renders the label and value in a compact card; if a trend value is provided, it renders a color-coded direction indicator.

### Outcomes
A compact metric card with optional trend indication is displayed.

### Exceptions
Unknown trend direction — renders with neutral fallback color.

### Completion Criteria
The metric card renders with label, value, and optional trend indicator.

## Verification

- Visual regression tests confirm the card renders correctly with and without trend indicator
- Unit tests confirm each trend direction maps to the correct semantic color
- Integration tests confirm unknown trend directions fall back to neutral without crashing
- Visual tests confirm the card adapts to varying container widths

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [Card](./Card.md) — general-purpose container used in dashboard contexts
