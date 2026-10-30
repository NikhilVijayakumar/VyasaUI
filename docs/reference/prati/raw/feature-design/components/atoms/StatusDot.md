# Overview

StatusDot is a colored circular indicator that communicates system or component status at a glance. The user sees a small colored dot next to a row or component, with distinct hues for each status level and size configurability for different contexts.

# Feature Summary

- **Purpose**: A colored circular indicator that shows system or component status at a glance.
- **Responsibilities**: Visually communicate component/system status; Support multiple status levels with distinct colors; Allow size configuration for different contexts
- **Non-Responsibilities**: Does not display text labels or tooltips; Does not handle click interactions; Does not animate state transitions; Does not manage/persist state

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Assess component status rapidly | User sees a colored dot and immediately interprets the status without reading text |

# User Journeys

### Entry Conditions
Parent component renders StatusDot with a `status` prop and optional `size` prop

### Primary Flow
1. Parent passes a `status` value to StatusDot
2. Component maps the status to a color via lookup table
3. Dot renders at configured size (or default) with the mapped color
4. User sees the colored dot next to the associated element

### Alternate Flows
- Unknown status value -> dot renders in neutral/default color
- Status "ok" -> green dot
- Status "warning" -> yellow dot
- Status "error" -> red dot
- Status "executing" -> blue dot
- Status "waiting" -> gray dot

### Failure Flows
- Missing `status` prop -> dot does not render (required prop violation)
- Zero size -> dot becomes invisible (renders at 0px)

### Recovery Flows
N/A — attribute is presentational; parent must supply valid props

### Exit Conditions
StatusDot unmounts or parent updates the status value

| Journey | Description |
| ------- | ----------- |
| Scan component status | User reads the colored dot to quickly understand the status of a system or component |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| StatusDot | Colored circular indicator rendered inline next to a component or row |

# Interaction Design

None — purely presentational atom with no click, hover, or keyboard interaction.

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | No form fields — attribute is presentational only |

# UX State Design

- **ok**: green dot
- **warning**: yellow dot
- **error**: red dot
- **executing**: blue dot
- **waiting**: gray dot
- **default**: neutral color fallback for unknown values

No LOADING or EMPTY states — dot renders immediately with the provided status value.

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| N/A | No interactive events — attribute is presentational |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | No navigation — static inline element |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Dot renders at configured size; no viewport-dependent changes |
| Tablet | Same as desktop |
| Mobile | Same as desktop |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Color as sole differentiator | StatusDot must be paired with a text label or `aria-label` on the parent providing the status meaning; color alone is insufficient |
| Touch target | Dot is decorative — interactive area is on the parent row, not the dot itself |
| Contrast ratio | Dot colors meet 4.5:1 against the background for users with low vision |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| N/A | No internal text strings — all meaning is conveyed through color; parent supplies `aria-label` if needed |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Color System: CSS variables, never hardcode | Status color tokens use CSS variables; light/dark mode adaptation is automatic |
| Accessibility: 4.5:1 contrast | Dot color contrast against surrounding background meets 4.5:1 |
| 8px grid | Dot diameter uses 8px multiples |
| Radical Simplicity | No text, no icons, no animations, no callbacks — just a colored circle |

# Open Questions

- Should the StatusDot support an `aria-label` prop directly for screen reader context?
- What are the exact hex values for each status color in light and dark mode?
- What is the default size in pixels?
