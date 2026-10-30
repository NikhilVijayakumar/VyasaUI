# Overview

SeverityBadge is a color-coded text label that communicates a severity level at a glance. The user sees a compact badge whose background opacity and text color shift per severity level, with unknown values safely falling back to a default treatment.

# Feature Summary

- **Purpose**: A text badge that displays a severity level with color-coded background.
- **Responsibilities**: Display a color-coded severity level label; Map severity levels to distinct visual treatments; Accept any string input with graceful fallback
- **Non-Responsibilities**: Does not display icons; Does not handle click events; Does not manage state; Does not transform the level value

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Assess severity of an item | User reads the badge label and immediately understands the severity level through color coding |

# User Journeys

### Entry Conditions
Component renders with a `level` prop value

### Primary Flow
1. Page loads with severity-badged content visible
2. Parent passes a `level` string to SeverityBadge
3. Component maps the string to a color via lookup table
4. User sees the badge with semi-transparent background and full-color text matching the severity level

### Alternate Flows
- Unknown severity value -> badge renders with info/default color mapping
- Very long label text -> text wraps naturally within the badge container

### Failure Flows
- Missing `level` prop -> component renders without label content (required prop violation)

### Recovery Flows
N/A — attribute is presentational; parent must supply a valid `level`

### Exit Conditions
Component unmounts or parent replaces it

| Journey | Description |
| ------- | ----------- |
| Read severity assessment | User reads the badge to understand the severity of an associated item |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| SeverityBadge | Color-coded severity label rendered inline within a parent component |

# Interaction Design

None — purely presentational atom with no click, hover, or keyboard interaction.

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | No form fields — attribute is presentational only |

# UX State Design

- **Active**: badge displays with mapped severity colors (semi-transparent background, full-color text)
- **Unknown**: unrecognized level string resolves to info/default color mapping

No LOADING or EMPTY states — presentational atom renders immediately with the provided value.

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| N/A | No events — attribute is presentational |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | No navigation — badge is a static inline element |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Badge renders at default size with inline flow |
| Tablet | Same rendering as desktop |
| Mobile | Badge scales with parent text; long labels wrap naturally |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Color as sole differentiator | Severity label text provides the meaning; color is redundant enhancement |
| Contrast ratio | Text color meets 4.5:1 minimum against the semi-transparent background |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Severity label text | Label is passed as a prop from parent — no internal strings to localize |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Color System: CSS variables, never hardcode | Severity color tokens use CSS variables; light/dark mode adaptation is automatic |
| Accessibility: 4.5:1 contrast | Text color contrast against semi-transparent background meets 4.5:1 |
| 8px grid | Badge padding and border-radius use 8px multiples |
| Radical Simplicity | No icons, no callbacks, no state — just a colored label |

# Open Questions

- What is the exact color mapping for each severity level? (critical, high, medium, low, info)
- Should the badge support an optional dismiss action in future iterations?
