# PageHeader

A standardized page-level header with title, subtitle, action buttons, and metadata slots.

## Overview

Provides a comprehensive header for page-level content. Supports primary and secondary action buttons with configurable appearance, leading and trailing meta content slots, and a responsive layout that wraps on narrow viewports. The title is required; all other sections are optional and render independently. Designed for use across multiple pages as a consistent page header template.

## Responsibilities

- Render a page-level header with title and optional subtitle
- Render primary and secondary action buttons with configurable variant and size
- Render leading and trailing meta content slots
- Wrap responsively on narrow viewports

## Non-Responsibilities

- Does not manage page-level state or data fetching
- Does not handle navigation routing — action click callbacks are void functions
- Does not render breadcrumbs, tabs, or other secondary navigation
- Does not provide sticky or scroll-aware behavior
- Does not manage responsive breakpoints beyond wrapping behavior

## Core Concepts

- **Slot-based layout pattern:** Defines five content slots — leading meta, title, subtitle, action buttons, and trailing meta — each renders independently and can be omitted without affecting the layout structure.
- **Responsive wrap pattern:** On narrow viewports, action buttons wrap to the row below the title instead of overflowing or clipping.
- **Action config objects:** Primary and secondary actions use a structured data pattern (label, click handler, variant, size) instead of passing raw nodes for simple button cases.
- **Reverse order action rendering:** Action buttons render right-to-left — visual order differs from DOM source order, a deliberate UX hierarchy choice.

## Business Rules

1. The title prop is required; all other props (subtitle, actions, meta) are optional and render independently.
2. Action buttons render in reverse visual order — the primary action appears on the rightmost side.
3. On narrow viewports, action buttons wrap to the row below the title rather than overflowing.
4. Each action config must include a label; click handlers are optional and buttons without them render inert.
5. Leading and trailing meta content slots accept arbitrary React nodes and are rendered as-is.

## States

- **Full** — Title, subtitle, primary action, secondary action, leading meta, and trailing meta all populated
- **Minimal** — Only title provided; all optional sections omitted
- **Partial** — Any combination of optional props present; each section independently renderable

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Minimal | Partial | One or more optional props (subtitle, action, meta) are provided |
| Minimal | Full | All optional props are provided |
| Partial | Full | The remaining optional props are provided |
| Partial | Minimal | All optional props removed; only title remains |
| Full | Partial | One or more optional props removed |
| Full | Minimal | All optional props removed |

## Edge Cases

- No subtitle provided: Subtitle slot is omitted; title renders alone
- No actions provided: Action buttons section is omitted
- No meta content provided: Meta slots are omitted
- Only secondary action without primary action: Only the secondary button renders
- Narrow viewport: Container wraps; actions move to the row below the title
- Long title without subtitle: Title occupies full width with no wrapping issues

## Error Conditions

- Missing required input (title) — Required value must be provided
- Empty string inputs — Renders empty text elements; no crash
- Action config missing click handler — Button renders but does nothing on click

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Missing title prop | Provide a non-empty title string; the header cannot render without it |
| Action config missing click handler | Add an onClick function to the action config object |
| Empty string inputs | Pass non-empty strings or omit the prop entirely |

## Authorization

**Visibility:** Authenticated — used at the top of authenticated application pages.

## User Journey

### Entry Conditions
A developer renders this header at the top of a page to display the page title, actions, and metadata.

### Primary Flow
The user sees the page title with optional subtitle, action buttons (primary and secondary), and leading/trailing meta content — all organized in a consistent header layout.

### Alternate Flows
On a narrow viewport — the action buttons wrap below the title instead of overflowing or clipping.

### Failure Flows
An action config is missing a click handler — the button renders but does nothing when clicked.

### Recovery Flows
The developer ensures action configs include a click handler.

### Exit Conditions
The user reads the page context from the header and clicks an action button or scrolls down.

## Workflow

### Trigger
A developer renders this header with a title and optional subtitle, actions, and meta content.

### Preconditions
At least a title string is provided.

### Steps
The component renders the leading meta (if provided), title, subtitle (if provided), action buttons (if provided), and trailing meta (if provided) in a responsive layout.

### Outcomes
A standardized page header is displayed with the page title and available actions.

### Exceptions
An action has no click handler — the button renders without functionality.
### Completion Criteria

The page header renders with all provided slots in the correct layout.

## Verification

- Verify that the header renders with the title displayed prominently when only the title is provided
- Verify that primary and secondary action buttons render with the correct variant and size styling
- Verify that action buttons wrap to the row below the title on narrow viewports
- Verify that leading and trailing meta content renders in their correct positions
- Verify that omitting all optional props renders only the title with no layout disruption

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [HeroSection](./HeroSection.md) — template for public-facing landing sections
- [SummaryPanel](./SummaryPanel.md) — template used alongside page headers for contextual summaries

## Future Enhancements

- Breadcrumb slot between the top of the page and the title
- Sticky behavior so the header remains visible during vertical scroll
- Collapsible actions into a "More" menu on narrow viewports

## Open Questions

- Should action buttons support a loading state when async operations are in progress?
- Should the subtitle support rich text (links, inline code) or remain plain string only?
