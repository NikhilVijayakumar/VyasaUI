# Overview

FormLayout is a page-level form wrapper that structures the vertical layout of authenticated form pages. It renders three independent vertical slots — title header at top, form body (children) in the middle, and actions footer at bottom — and constrains content to a max-width for readability. Each slot is optional and produces no DOM when omitted.

# Feature Summary

- **Purpose**: A structured page-level form wrapper with title header and action footer
- **Responsibilities**: Provide consistent vertical layout for form pages; Render optional title header at top; Render optional actions row at bottom for submit/cancel; Maintain max-width constraint for readability
- **Non-Responsibilities**: Does not manage form state, field values, submission; Does not validate inputs or display errors; Does not handle lifecycle events (submit, reset, dirty); Does not provide scroll behavior; Does not render feedback messages

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Complete a form with clear structure | User sees a form with a title, organized fields, and submit/cancel actions within a readable width |
| Understand form context | Title at top communicates the form's purpose before the user begins filling fields |
| Locate actions easily | Submit/cancel buttons are consistently positioned at the bottom of the layout |

# User Journeys

### Entry Conditions
User navigates to a page that renders a form within the FormLayout wrapper.

### Primary Flow
1. FormLayout renders the title header at the top with heading typography
2. Form fields (children) render in the body slot as a vertical stack
3. Action buttons render at the bottom in the footer slot
4. Max-width constraint keeps line lengths readable
5. User fills fields and triggers submit via footer action button

### Alternate Flows
- **No title**: Title prop omitted — header produces no DOM; body and footer render as usual
- **No actions**: Actions prop omitted — footer produces no DOM; header and body render as usual
- **No children**: Children prop omitted — body renders as empty flex column (invisible to user); header and footer render as usual

### Failure Flows
- Empty children with header and footer — layout appears to have only title and buttons with no form fields visible

### Recovery Flows
Developer provides children content — body slot renders form fields and layout completes

### Exit Conditions
User submits the form (triggered from footer) or navigates away from the page

| Journey | Description |
| ------- | ----------- |
| Fill and submit a form | User reads title, fills fields in the body, and clicks submit in the footer |
| View form with no title | Page renders form body and actions only, no header |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| FormLayout view | Page-level form with optional title header, form body, and actions footer constrained to max-width |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Form submission | Triggered by buttons rendered in the actions footer slot — layout does not handle the event, parent provides the handler |
| Cancel action | Cancel button in footer slot — layout does not manage lifecycle, parent controls reset/navigation |
| Title click | No interaction — title is presentational heading text |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| Children | Implicitly required for meaningful layout | Placed in body slot between header and footer; vertical flex column with spacing-3 between groups |
| Title | No | Header omitted when not provided; no heading rendered |
| Actions | No | Footer omitted when not provided; no button row rendered |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Idle | Title header + children body + actions footer rendered; all three slots visible |
| No title | Children body + actions footer rendered; header slot absent from DOM |
| No actions | Title header + children body rendered; footer slot absent from DOM |
| Empty children | Title header + actions footer rendered; body slot is empty flex column (no visible content) |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| N/A | FormLayout does not render feedback messages — success/error notifications are the parent's responsibility per non-responsibilities |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | FormLayout does not handle navigation — page transitions are managed by the parent routing layer |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Max-width constraint centers the form content; header, body, footer stack vertically |
| Tablet | Max-width constraint maintains readability at intermediate widths; same vertical stack |
| Mobile | Max-width constraint may reach full viewport width on narrow screens; same vertical stack; no horizontal scroll |

Label above input, input height 40px, border focus 2px primary, error border + helper text. Group related fields with spacing-3.

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Heading hierarchy | Title header renders as `<h1>` or appropriate level for page context — provides landmark for screen reader navigation |
| Focus management | No built-in focus handling — focusable elements within children and actions receive focus via native tab order |
| Semantic HTML | Uses `<header>`, `<main>`, `<footer>` elements for slot regions — provides structural landmarks |
| Color contrast | All text maintains 4.5:1 minimum contrast ratio against background; no hardcoded colors, uses CSS variables |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Title text | Provided by parent as a prop — no hardcoded strings in FormLayout itself; accepts any localized string |
| Action button text | Provided by parent in actions slot — layout does not render button labels, parent supplies localized values |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Three-slot layout with optional rendering — no unnecessary wrappers or props; slots omitted = no DOM |
| Typography Leads | Title header establishes visual hierarchy at the top of the form page |
| White Space is Feature | Max-width constraint creates breathing room; spacing-3 between field groups; vertical spacing between header, body, footer |
| Color System | All colors via CSS variables — background, text, borders use `var(--mui-*)` tokens, never hardcoded |
| 8px grid rule | Input height 40px (5 × 8px); spacing-3 (24px, 3 × 8px) for field grouping; all margins/padding in 8px multiples |
| Premium UI Patterns | Card surface patterns for form containers; minimal form layout with clear action row |
| Quality Checklist | Idle (rendered), No title (header omitted), No actions (footer omitted), Empty children (body empty) — every state handled per spec |

# Open Questions

- Should a maximum form width have a defined token value (e.g., `var(--max-form-width)`) or remain a raw pixel value?
- What happens when both title and actions are omitted — is a bare body-only layout a valid use case?
