# FormLayout

A structured page-level form wrapper with title header and action footer.

## Overview

Provides consistent vertical layout for form pages. Includes an optional title header at the top and a dedicated actions row at the bottom for submit or cancel buttons. Maintains a max-width constraint for readability. All sections are optional and render independently.

## Responsibilities

- Provide consistent vertical layout for form pages
- Render an optional title header at the top of the form
- Render an optional actions row at the bottom for submit/cancel buttons
- Maintain a max-width constraint for readability

## Non-Responsibilities

- Does not manage form state, field values, or submission handling
- Does not validate form inputs or display validation errors
- Does not handle form lifecycle events (submit, reset, dirty tracking)
- Does not provide scroll behavior for long forms
- Does not render feedback messages (success, error)

## Core Concepts

- **Layout slot pattern:** Defines three vertical slots — header (title), body (children), and footer (actions) — each slot renders independently and can be omitted without affecting the others.
- **Max-width constraint for readability:** Content is constrained to a maximum width, preventing line lengths from exceeding comfortable reading width.
- **Optional section rendering:** Title and actions slots are conditionally rendered — when omitted, they produce no DOM.

## Business Rules

1. Children content is required; the layout renders an empty container if no children are provided.
2. The title and actions slots are independently optional — omitting one does not affect the rendering of the other.
3. Max-width constraint applies to the entire layout container; individual child elements must handle their own width within it.
4. The layout does not manage scroll behavior — long form content must handle its own scrolling via the parent.
5. Action buttons are rendered in the order provided; no built-in support for primary/secondary button hierarchy.

## States

- **Idle** — Title, children, and actions displayed
- **No title** — Header section omitted
- **No actions** — Footer section omitted
- **Empty children** — Empty flex column rendered (invisible to user)

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | No title | Title prop removed or set to empty |
| Idle | No actions | Actions prop removed |
| Idle | Empty children | Children removed |
| No title | Idle | Title prop provided |
| No actions | Idle | Actions prop provided |
| Empty children | Idle | Children provided to the layout body |

## Edge Cases

- No title provided: Header section omitted entirely
- No actions provided: Footer action row omitted
- Empty children: Renders empty layout
- Single child element: Renders one child without extra spacing issues
- Very long title: Text wraps naturally; no built-in truncation

## Error Conditions

- Missing required input (children content) — Required value must be provided

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Missing children content | Provide valid React children nodes within the layout wrapper |
| Missing title | Title is optional; the layout renders without the header section |
| Missing actions | Actions are optional; the layout renders without the footer section |

## Authorization

**Visibility:** Authenticated — used as a page-level layout wrapper for forms within authenticated application views.

## User Journey

### Entry Conditions
A developer needs a consistent page-level layout for a form with a title header and action footer.

### Primary Flow
The developer provides title, form fields as children, and action buttons — the layout renders with title at top, form content in the middle, and actions at the bottom, all within a readable max-width.

### Alternate Flows
No title is provided — the header section is omitted and only the form body and actions render.

### Failure Flows
No children are provided — the layout renders an empty body section with just header and footer.

### Recovery Flows
The developer provides the form content as children.

### Exit Conditions
The user fills and submits the form, or navigates away using the action buttons.

## Workflow

### Trigger
A developer provides title, form content as children, and optional action buttons to this layout component.

### Preconditions
At least children content is provided.

### Steps
The component renders the title header (if provided), the form body children, and the action footer (if provided) in a vertical stack with max-width constraint.

### Outcomes
A consistently structured form page is displayed.

### Exceptions
No children — an empty layout is rendered with only header/footer.
### Completion Criteria

The form layout renders with available header, body, and footer sections.

## Verification

- Verify that the title renders at the top of the layout when provided and is omitted when not provided
- Verify that children content renders in the body area between header and footer
- Verify that action buttons render at the bottom in the correct order
- Verify that the max-width constraint is applied to the layout container
- Verify that omitting multiple optional slots simultaneously renders only the provided sections

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [PageHeader](../templates/PageHeader.md) — template for page-level headers above forms
