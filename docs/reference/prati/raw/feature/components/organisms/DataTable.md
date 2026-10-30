# DataTable

A tabular data display with a sticky header and custom cell rendering.

## Overview

Renders structured data in a table format with a header that stays visible during vertical scroll. Column definitions drive the table output — each column specifies its label, alignment, minimum width, and an optional custom render function for cells. Rows display in the order provided; no built-in sorting or pagination.

## Responsibilities

- Render tabular data with a sticky header that remains visible during vertical scroll
- Support custom column definitions with label, alignment, and minimum width
- Support custom cell rendering via per-column render functions
- Apply hover styling on table rows

## Non-Responsibilities

- Does not paginate, sort, or filter data — rows render in the order provided
- Does not support inline editing, row selection, or bulk actions
- Does not fetch or load data from any source
- Does not provide built-in search or column visibility controls
- Does not handle empty, loading, or error states — these must be managed by the parent

## Core Concepts

- **Column definition-driven rendering:** The columns array is the schema — each column's properties fully drive table output. Data is transformed into UI purely through column definitions.
- **Custom cell rendering:** Per-column render functions provide custom cell content without coupling the table to specific data shapes — enables buttons, badges, or any content per cell while keeping the table generic.
- **Sticky header:** The header row remains visible at the top of the table during vertical scroll through data rows.

## Business Rules

1. Column definitions must include a unique key for each column; duplicate keys cause rendering warnings.
2. Row keys must be unique; duplicate row keys produce console warnings and potential DOM reconciliation issues.
3. Custom render functions must be pure — they receive cell value and row data and must not mutate props or trigger side effects.
4. The columns array order determines the rendered column order; no reordering is supported.
5. Minimum width constraints are enforced per column; content exceeding the minimum width wraps within the cell.

## States

- **Idle** — Data loaded; renders sticky header with body rows
- **Empty data** — Data array is empty; renders header with no body rows
- **Empty columns** — Columns array is empty; renders an empty table

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Empty data | Data prop updated to an empty array |
| Idle | Empty columns | Columns prop updated to an empty array |
| Empty data | Idle | Non-empty data array provided |
| Empty columns | Idle | Non-empty columns array provided |

## Edge Cases

- Empty data array: Renders only the sticky table header with no body rows
- Empty columns array: Renders an empty table with no columns or data cells
- Single row: Table renders with one row; sticky header remains visible
- Very long cell content: Text wraps within the cell
- Duplicate key values: May cause rendering issues with duplicate keys

## Error Conditions

- Null/undefined key value — Row key becomes the string "null" or "undefined"; potential key collision
- Duplicate keys — Console warning; may cause rendering issues
- Component error in render function — No error boundary; propagates to parent

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Null/undefined key value | Ensure every row object contains a valid, non-null key value before passing to the component |
| Duplicate keys | Deduplicate row keys upstream or provide a unique key generator |
| Component error in render function | Wrap the parent's usage site in an error boundary to catch and handle render failures |

## Authorization

**Visibility:** Authenticated — used to display structured data within authenticated application views.

## User Journey

### Entry Conditions
A developer needs to display structured data in a table format with a sticky header and custom cell content.

### Primary Flow
The developer provides column definitions and data rows — the table renders with a sticky header and custom cell renderers.

### Alternate Flows
The data array is empty — the table renders with only the sticky header and no body rows.

### Failure Flows
A custom cell renderer throws an error — there is no error boundary and the error propagates to the parent.

### Recovery Flows
The error is resolved and the table re-renders with corrected content, or the user navigates to a different view unaffected by the broken cell.

### Exit Conditions
The user reads the tabular data — sorting, filtering, and pagination are managed by the parent or not provided.

## Workflow

### Trigger
A developer provides column definitions and data rows to this table component.

### Preconditions
Column definitions are provided with at least a label and key.

### Steps
The component renders the sticky header from column definitions and maps data rows to body cells using optional custom render functions.

### Outcomes
Structured tabular data is displayed with a visible header row.

### Exceptions
A cell render function throws — the error propagates to the parent without a local boundary.
### Completion Criteria

The table renders the header and all data rows.

## Verification

- Verify that the sticky header remains visible when scrolling through a dataset of 50+ rows
- Verify that each column renders with the correct label, alignment, and minimum width as defined in the column specification
- Verify that custom cell render functions render their output in the correct cells without errors
- Verify that an empty data array renders only the header row with no body rows
- Verify that an empty columns array renders an empty table structure

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [CsvViewer](./CsvViewer.md) — specialised organism for CSV data with parsing and pagination

## Future Enhancements

- Built-in pagination with configurable page size
- Column sorting with ascending/descending toggle
- Row selection with checkbox column
- Virtualized rows for smooth scrolling through large datasets

## Open Questions

- Should filtering be built in or delegated entirely to the parent?
- Should column resizing and reordering be supported?
