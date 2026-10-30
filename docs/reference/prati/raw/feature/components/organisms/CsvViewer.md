# CsvViewer

Displays CSV data in a paginated table with auto-detected delimiter.

## Overview

Parses CSV content into a sortable table with configurable pagination. Auto-detects comma or semicolon delimiters based on the first line. Shows column headers that remain visible during scroll. Supports configurable rows per page (10, 25, or 50). Displays an empty state message when no CSV content is available.

## Responsibilities

- Parse CSV content into headers and data rows
- Auto-detect comma or semicolon delimiter from the first line
- Render data in a paginated table with sticky headers
- Provide configurable rows per page
- Show an empty state message when no CSV content is available

## Non-Responsibilities

- Does not load file content from disk or network
- Does not support write-back, editing, or saving CSV data
- Does not validate CSV structure or column types
- Does not provide column sorting, filtering, or search
- Does not handle non-CSV file formats

## Core Concepts

- **Parse-and-render pipeline:** Raw CSV string is parsed into headers and data rows, then rendered in a paginated table — parsing and rendering are sequential phases with no external data fetching.
- **Auto-delimiter detection:** Scans only the first line for semicolons to choose between comma and semicolon delimiters — a lightweight heuristic that avoids full-file scanning.
- **Pagination state management:** Page number and rows-per-page are managed locally — pagination is a pure UI concern scoped to this component.
- **Sticky header with scrollable body:** Column labels remain visible while the user scrolls through data rows.

## Business Rules

1. Delimiter detection scans only the first line for semicolons — files with mixed delimiters may parse incorrectly.
2. Page number and rows-per-page are managed as local state; no external state management is required.
3. Rows-per-page is configurable to 10, 25, or 50 — values outside this set should default to a safe value.
4. The CSV string is parsed synchronously — very large files may cause UI blocking during parsing.
5. Sticky headers remain visible during vertical scroll; the table body scrolls independently of the header.

## Consumed By

- [FileViewerRouter](./FileViewerRouter.md) — delegates CSV file rendering to this component based on file extension

## States

- **Idle** — Content loaded and parsed; renders paginated table with headers and rows
- **Empty** — No content or empty CSV string; renders title and empty-state message
- **Headers-only** — Delimiter detected, headers parsed, but no data rows present

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Empty | Parsed CSV has no data rows |
| Idle | Headers-only | CSV has headers but zero data rows |
| Any state | Idle | New valid CSV content provided with data rows |
| Idle | Idle | User changes page or rows-per-page |

## Edge Cases

- No content or empty content: Renders empty-state message
- Empty CSV (headers only, no data rows): Renders header row with empty table body
- Delimiter detection on mixed-delimiter files: May parse incorrectly
- CSV with only newlines/whitespace: Headers and rows are empty arrays
- Single-cell CSV: Renders a one-column table with a single cell
- Very large CSV: Rows are paginated; no virtualization

## Error Conditions

- No content or empty content — Renders empty-state message
- Mixed-delimiter CSV — Delimiter detection on first line only; may parse subsequent lines incorrectly
- Very large datasets — Pagination without virtualization; performance degrades beyond typical sizes

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Empty or no content | Provide a valid non-empty CSV string; the component displays an empty-state message |
| Mixed-delimiter CSV | Pre-process the CSV file to use a consistent delimiter before passing it to the viewer |
| Very large dataset | Implement virtualized scrolling for datasets exceeding 10,000 rows, or paginate aggressively |

## Authorization

**Visibility:** Authenticated — used to view CSV file contents within authenticated file viewer contexts.

## User Journey

### Entry Conditions
A user opens a CSV file in a file viewer — this component parses and displays the content as a paginated table.

### Primary Flow
The user sees the CSV data in a table format with sticky headers and pagination controls (10, 25, or 50 rows per page).

### Alternate Flows
The CSV uses semicolons instead of commas — the auto-detection detects the delimiter from the first line and parses correctly.

### Failure Flows
A mixed-delimiter CSV causes incorrect parsing — some rows may display with wrong column alignment.

### Recovery Flows
The developer pre-processes the CSV to use a consistent delimiter before passing it to the viewer.

### Exit Conditions
The user navigates through the paginated data or switches to a different file.

## Workflow

### Trigger
A user opens a CSV file or a developer provides CSV string content.

### Preconditions
Content is provided as a string with comma or semicolon delimiters.

### Steps
The component auto-detects the delimiter, parses headers and rows, renders the paginated table with sticky headers.

### Outcomes
The user can browse CSV data in a structured table with pagination.

### Exceptions
Mixed delimiters — first-line detection may produce incorrect parsing for subsequent lines.
### Completion Criteria

The CSV content is parsed and displayed in a paginated table.

## Verification

- Verify that a valid CSV string is parsed into headers and data rows in a paginated table
- Verify that comma-delimited and semicolon-delimited CSVs are both auto-detected and parsed correctly
- Verify that the empty state renders the appropriate message when no content is provided
- Verify that pagination controls change the page and rows-per-page correctly
- Verify that sticky column headers remain visible while scrolling through the data rows

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [FileViewerRouter](./FileViewerRouter.md) — routes CSV files to this component
- [DataTable](./DataTable.md) — related organism for rendering general tabular data

## Future Enhancements

- Column sorting by clicking header cells
- Column search/filter input for quick data filtering
- Row selection with bulk action support
- Virtualized large datasets for 100K+ rows

## Open Questions

- Should CSV export functionality be added?
- What is the expected behavior for malformed CSV rows — skip, highlight, or surface an error?
