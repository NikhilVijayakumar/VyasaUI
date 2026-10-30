# Overview

alert is an inline-styled alert notification email template with type-based color theming. It renders a conditionally visible alert box with inline CSS styles. When `show` is truthy, the alert renders with type-specific background, border, and text colors (`warning`, `error`, `success`, `info` default). When `show` is falsy, nothing renders. An optional `title` renders in bold above the `message` body text.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | TEMPLATES-002 |
| Feature Name | alert |
| Category | Atom |
| Priority | P1 |
| Dependencies | `ifEquals` Handlebars helper registered on the Handlebars instance; `show` variable provided by caller |
| Future | `icon` variable for leading status icon, `link` variable for optional action link |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Deliver a styled alert notification | Caller renders an alert with type-specific styling for warning, error, success, or info |
| Conditionally show alert | Caller controls visibility through the `show` variable — alert only renders when truthy |
| Distinguish alert severity | Type-specific colors (background, border, text) differentiate warning, error, success, and info |

# User Journeys

### Entry Conditions
Caller wants to render an alert notification within an email or notification HTML payload.

### Primary Flow: Render Visible Alert
1. Caller provides `type`, `message`, `show: true`, and optionally `title`
2. The `ifEquals` helper evaluates `type` against each known variant
3. The alert box renders with type-specific background, border, and text colors
4. If `title` is provided, bold heading renders above body text
5. `message` renders as the alert body

### Alternate Flows
- **No title**: `title` omitted — only the message body renders inside the alert box
- **Unknown type**: `type` not recognized — falls through to default `info` styles
- **Hidden alert**: `show` is falsy — nothing renders; entire alert block is omitted from output

### Failure Flows
- **`ifEquals` helper not registered**: Conditional style branches fail silently; styles do not apply; alert renders with default appearance or broken conditional blocks
- **`message` not provided**: Alert renders with empty body text

### Recovery Flows
- **Missing helper recovery**: Caller registers `ifEquals` on the Handlebars instance before rendering
- **Missing message recovery**: Caller provides a `message` value in the render data

### Exit Conditions
Caller receives rendered HTML with the alert box (if `show` was truthy) with appropriate type-specific styling, or empty string (if `show` was falsy).

| Journey | Description |
| ------- | ----------- |
| Render visible alert | Caller provides type and message; alert renders with type-specific colors |
| Hidden alert | Caller sets show to falsy; alert block omitted from output |
| Unknown alert type | Caller provides unrecognized type; alert renders with default info styles |

# Screen Inventory

N/A — alert is an email template fragment rendered inline within a parent HTML document.

# Interaction Design

N/A — alert is a static HTML email template. It has no interactive affordances per spec: "Does not handle dismiss/close interactions — static HTML output only."

# Form Design

N/A — alert is a static HTML template with no form fields.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Visible | Alert box rendered with type-specific background, border, and text colors; optional bold title above message body |
| Hidden | Nothing renders; entire alert block omitted from output |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Truthy `show` | Alert box appears with type-specific inline styles |
| Falsy `show` | Alert box absent from rendered output |
| Missing `ifEquals` helper | Styles may not apply; alert renders with default or broken appearance |
| Missing `message` | Alert box renders with empty body text |

# Navigation Design

N/A — alert is a static HTML fragment. It does not contain navigation elements or links.

# Responsive Design

N/A — alert is an inline email template fragment. Responsive behavior is determined by the email client and the parent layout template.

# Accessibility Design

N/A — alert is a static HTML email template. Email client accessibility is outside the scope of this template. The rendered output uses inline styles compatible with email clients.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Alert text content | All user-facing text (`type`, `title`, `message`) supplied by caller via render data; no hardcoded strings in template |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Zero Hardcoding Policy | Template contains no hardcoded text; all content supplied via render variables |
| Rule 1: Radical Simplicity | Single concern — render colored alert box; no interactions, no animations, no state management |
| Rule 8: Consistency Builds Trust | `ifEquals` helper provides predictable conditional styling across all alert types |

# Open Questions

- Should the `icon` variable for a leading status icon be added in a future iteration?
- Should the `link` variable for an optional action link inside the alert be added?
