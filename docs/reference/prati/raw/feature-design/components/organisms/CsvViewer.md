# Overview

CsvViewer parses raw CSV string content into a paginated table with sticky column headers. It auto-detects comma or semicolon delimiters by scanning the first line, renders data in a paginated table with configurable rows-per-page (10, 25, 50), and shows an empty-state message when no content is available. Pagination state is managed locally as a pure UI concern.

# Feature Summary

- **Purpose**: Displays CSV data in a paginated table with auto-detected delimiter
- **Responsibilities**: Parse CSV into headers and data rows; Auto-detect comma/semicolon delimiter from first line; Render data in paginated table with sticky headers; Provide configurable rows per page (10, 25, 50); Show empty state when no CSV content
- **Non-Responsibilities**: Does not load file content; No write-back/editing/saving; No CSV structure/column validation; No column sorting/filtering/search; No non-CSV formats

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Browse CSV data in a structured table | User sees CSV rows rendered as a table with column headers and pagination controls |
| Navigate large CSV datasets | User changes pages or rows-per-page to browse through paginated data |
| Identify columns at a glance | Sticky headers remain visible while scrolling through data rows |
| Know when data is unavailable | User sees an empty-state message when no CSV content is available |

# User Journeys

### Entry Conditions
User opens a `.csv` file in a file viewer panel; FileViewerRouter delegates to CsvViewer.

### Primary Flow
1. CsvViewer receives CSV string content
2. Component scans first line for semicolons to detect delimiter (comma default)
3. Parses headers from first line and data rows from subsequent lines
4. Renders paginated table with sticky header row
5. Default rows-per-page: 10; pagination controls at bottom
6. User browses pages or changes rows-per-page (10, 25, 50)
7. Page resets to 1 when content or rows-per-page changes

### Alternate Flows
- **Semicolon delimiter**: First line contains semicolons — detected automatically, parsed accordingly
- **Headers-only**: CSV has delimiter and headers but no data rows — table renders with header row and empty body
- **Empty content**: CSV string is empty, whitespace-only, or null — empty-state message displayed with title

### Failure Flows
- **Mixed delimiters**: File mixes commas and semicolons — first-line detection may parse subsequent lines with wrong column alignment
- **Malformed rows**: Rows with inconsistent column counts — parsing proceeds without validation; cells may appear in wrong columns

### Recovery Flows
Developer pre-processes the CSV to use a single consistent delimiter before passing to viewer

### Exit Conditions
User navigates away from the file or switches to a different file type

| Journey | Description |
| ------- | ----------- |
| Browse CSV with pagination | User sees parsed table, clicks page controls to navigate data, adjusts rows-per-page |
| View empty CSV | User opens empty CSV file — sees title and "No data available" empty-state message |
| View headers-only CSV | User opens CSV with headers but no rows — sees header row with empty table body |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| CsvViewer table | Paginated table with sticky headers, data rows, and pagination controls (10/25/50 selector + page navigation) |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Page change | User clicks "Next"/"Previous" or page number — table updates to show the new page of rows |
| Rows-per-page change | User selects 10, 25, or 50 from dropdown — table recalculates pages; resets to page 1 |
| Scroll through rows | User scrolls vertically in the table body — headers remain sticky at top |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| CSV content | Yes | Raw string input parsed into headers/rows; empty/whitespace → empty state |
| Rows per page | No (default 10) | Selector with options 10, 25, 50; resets page to 1 on change |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Idle | Parsed CSV rendered as paginated table with sticky headers; pagination controls active |
| Empty | No CSV content — title plus empty-state message (e.g., "No CSV data available") |
| Headers-only | Headers parsed, zero data rows — header row visible with empty table body below |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Page change | Table body updates to display the new page of rows; pagination controls show current page |
| Rows-per-page change | Dropdown updates, page resets to 1, table re-renders with new page size |
| Empty content | Empty-state message replaces the entire table; no table DOM rendered |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| Pagination controls | Next/Previous page buttons and direct page number clicks — local state only, no URL changes |
| Rows-per-page selector | Dropdown changes local page size — no effect outside CsvViewer |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Full table with sticky headers; horizontal scroll for wide columns if needed |
| Tablet | Same table structure; horizontal scroll container for wide tables |
| Mobile | Table inside a horizontal scroll container; pagination controls stack below the table; rows-per-page selector may collapse to a simple select |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Table semantics | Rendered as `<table>` with `<thead>` and `<tbody>` — native table semantics for screen readers |
| Column headers | `<th>` elements with scope="col" — associates header cells with data columns |
| Pagination | Page buttons rendered as `<button>` elements with `aria-label` (e.g., "Go to page 2", "Previous page"); current page indicated with `aria-current="page"` |
| Rows-per-page selector | `<select>` with `<option>` elements, labeled via `<label>` or `aria-label` |
| Empty state | `role="status"` or `aria-live="polite"` container announces empty state to screen readers |
| Sticky headers | CSS `position: sticky` — screen readers navigate headers via table semantics regardless of visual position |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Empty state text | Pulled from localization (e.g., `csvViewer.empty`) — displayed when no CSV content |
| Pagination labels | "Page X of Y", "Previous", "Next" pulled from localization (e.g., `csvViewer.pagination.page`, `csvViewer.pagination.previous`, `csvViewer.pagination.next`) |
| Rows-per-page label | "Rows per page:" pulled from localization (e.g., `csvViewer.rowsPerPage`) |
| Title | "CSV Viewer" title pulled from localization (e.g., `csvViewer.title`) |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Parse-and-render pipeline with no external data fetching; pagination is local UI state only |
| 8px grid rule | Table cell padding (8px horizontal, 4px vertical); row height 52px default; pagination control spacing in 8px multiples |
| Typography Leads | Column headers use semibold weight; body text uses regular weight — visual hierarchy through type |
| White Space is Feature | Adequate cell padding; spacing between table and pagination controls |
| Color System | All colors via CSS variables — header background, row separators, hover states use `var(--mui-*)` tokens |
| Accessibility | Native table semantics, sticky headers, pagination aria-labels, empty state announcement |
| Quality Checklist | Idle (table with data), Empty (no content), Headers-only (headers without rows) — all states defined |

# Open Questions

- Should the CsvViewer expose the parsed header list for parent components to use?
- Should malformed rows (inconsistent column count) be highlighted in the UI or silently rendered?
- What is the expected performance threshold before virtualization becomes necessary?
