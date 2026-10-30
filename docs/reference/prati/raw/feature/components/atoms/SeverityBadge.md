# SeverityBadge

A text badge that displays a severity level with color-coded background.

## Overview

Renders a compact label indicating severity (CRITICAL, WARNING, URGENT, INFO, SUCCESS) using color-coded semi-transparent backgrounds and matching text colors. Accepts any string input with graceful fallback to default styling.

## Responsibilities

- Display a color-coded severity level label
- Map severity levels to distinct visual treatments
- Accept any string input with graceful fallback

## Non-Responsibilities

- Does not display icons or visual indicators alongside text
- Does not handle click events or user interaction
- Does not manage or persist state
- Does not transform or format the level value

## Core Concepts

- **Color mapping via lookup table:** Each severity level maps to a theme color — unknown values fall through to a default.
- **Semi-transparent background pattern:** Backgrounds use partial opacity of the theme color while text uses the full color, creating visual hierarchy.
- **Relaxed type boundary:** The component accepts any string value, allowing dynamic or external data sources while typed usage gets autocomplete.
- **Purely presentational atom:** No state, no callbacks, no interaction.

## Business Rules

1. The severity value lookup MUST be case-sensitive — lowercase input falls back to default styling.
2. The component MUST accept any string value without throwing an error.
3. The component MUST NOT render icons, indicators, or interactive elements — only text with color-coded background.
4. At least one severity value MUST be provided for the component to render meaningfully.
5. Each known severity level MUST have a distinct color treatment for quick visual differentiation.

## States

- **Active** — Displays the badge with mapped severity colors
- **Unknown** — Unknown level value falls back to info/default styling

## Edge Cases

- Unknown or lowercase level value: Silently falls back to default styling (keys are uppercase)
- Very long text: Wraps naturally; may affect badge layout
- Missing level: Component requires a value

## Error Conditions

- Unknown level value — Falls back to default styling, no error thrown
- Case mismatch — Lowercase input falls back to default (keys are uppercase)
- Missing level — Required value not provided

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Unknown level value | Use a recognized level string (CRITICAL, WARNING, URGENT, INFO, SUCCESS); default fallback styling keeps the badge functional |
| Case mismatch | Provide the severity value in the expected case (uppercase); the fallback ensures no crash |
| Missing level | Supply a severity level value; the badge cannot render without it |

## Authorization

**Visibility:** Authenticated — rendered within authenticated application views to communicate severity levels.

## User Journey

### Entry Conditions
A developer adds this badge to a component that needs a severity level indicator (critical, warning, info, success).

### Primary Flow
The user sees a color-coded label indicating severity — the color maps consistently to the severity level for quick visual scanning.

### Alternate Flows
An unknown severity value is provided — the badge renders with a default/info color instead of crashing.

### Failure Flows
No severity value is provided — the component requires this value and may not render correctly.

### Recovery Flows
The developer ensures the severity value maps to a known level or accepts the fallback styling.

### Exit Conditions
The user reads the severity level at a glance and proceeds with context-appropriate action.

## Workflow

### Trigger
A developer renders this badge with a severity level value.

### Preconditions
The severity value is provided as a string.

### Steps
The component maps the severity to a theme color and renders a labeled badge with color-coded styling.

### Outcomes
A color-coded severity badge is displayed to the user.

### Exceptions
An unknown severity value falls back to default styling.

### Completion Criteria
The badge renders with the correct color and label for all severity levels.

## Verification

- Unit tests confirm each severity level maps to the correct color pair
- Visual regression tests confirm the semi-transparent background pattern renders correctly
- Integration tests confirm unknown levels fall back to default styling without errors
- Accessibility tests confirm contrast ratios meet WCAG standards for all severity levels

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [StatusDot](./StatusDot.md) — related component providing icon-based status indicators
