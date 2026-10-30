# Overview

DataTable renders structured data in a table format driven by column definitions. The header row remains sticky during vertical scroll. Each column defines its label, alignment, minimum width, and an optional custom render function for cell content (buttons, badges, or any markup). Rows render in the order provided — no sorting, pagination, or filtering. The parent manages empty, loading, and error states.

# Feature Summary

- **Purpose**: A tabular data display with a sticky header and custom cell rendering
- **Responsibilities**: Render tabular data with sticky header (visible during vertical scroll); Support custom column definitions (label, alignment, min width); Support custom cell rendering via per-column render functions; Apply hover styling on rows
- **Non-Responsibilities**: Does not paginate, sort, or filter; No inline editing/row selection/bulk actions; No data fetching; No search/column visibility; Does not handle empty/loading/error states (parent manages)

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Read tabular data | User scans rows and columns with a visible header that stays during scroll |
| Identify columns | Column labels and alignment guide the user in understanding data structure |
| Interact with cell content | Custom render functions provide interactive elements (buttons, links) within cells |
| Locate rows | Row hover styling helps the user track which row they are reading |

# User Journeys

### Entry Conditions
Parent component provides column definitions and a data array to DataTable.

### Primary Flow
1. Parent provides columns array (label, key, alignment, minWidth, optional render function) and data array
2. DataTable renders a `<table>` with sticky `<thead>` from column definitions
3. Body rows render from the data array using column keys
4. If a column has a custom render function, cells use that function's output instead of raw value
5. Row hover styling (rgba(primary, 0.04)) applied for scanning legibility
6. User reads data; columns aligned per definition (text left, numbers right)

### Alternate Flows
- **Empty data array**: Data prop is `[]` — table renders sticky header with no body rows
- **Empty columns array**: Columns prop is `[]` — table renders empty with no columns or data
- **Custom render function**: Column specifies `render` — cell shows rendered content (badge, button, etc.)

### Failure Flows
- Cell render function throws error — no error boundary in DataTable; error propagates to parent
- Duplicate row keys — React console warning; rendering may produce unexpected duplicate elements
- Null/undefined key values — key becomes string "null" or "undefined"; potential key collision

### Recovery Flows
Parent catches error from render function or provides corrected data/columns — table re-renders

### Exit Conditions
User finishes reading the data; parent may replace data or unmount the table

| Journey | Description |
| ------- | ----------- |
| View structured data with sticky header | User scrolls through rows while column headers remain visible; hover highlights reading position |
| View table with custom cell content | Column render function produces badges or buttons inside cells |
| View empty table | Parent passes empty data or empty columns — table shows header only or no rendered structure |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| DataTable | Full table with sticky header, data rows, custom cell rendering, and row hover styling |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Row hover | CSS hover state applies background rgba(primary, 0.04) — no JavaScript interaction |
| Cell content | Custom render functions may provide interactive elements (buttons, links) — DataTable does not wrap or intercept events |
| Scroll | Vertical scroll within the table container — header sticks via CSS `position: sticky` |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| Columns | Yes | Array of column definitions; each must have `label` (display text) and `key` (data field); optional `align` (left/right), `minWidth`, `render` |
| Data | No | Array of row objects keyed by column keys; empty array → header-only table |
| Row key | Recommended | Unique key for React reconciliation; missing/duplicate → rendering warnings |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Idle | Columns defined, data loaded — sticky header + body rows rendered |
| Empty data | Data array is empty — sticky header rendered with no body rows; parent may overlay empty state message |
| Empty columns | Columns array is empty — no table structure rendered; parent manages fallback |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Row hover | Background shifts to rgba(primary, 0.04) — subtle visual cue for row tracking |
| Custom cell interaction | Feedback determined by the render function — DataTable does not add additional feedback |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | DataTable has no navigation — it is a static presentational component driven by props |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Full table width; column min-width respected; horizontal scroll if table exceeds container |
| Tablet | Same column-driven layout; horizontal scroll container if needed |
| Mobile | Table inside horizontal scroll wrapper; no column collapsing (parent responsibility); hover state disabled on touch devices |

Column alignment: left-aligned text, right-aligned numbers. Row separators: 1px solid var(--mui-divider). Row height: 52px default. Row hover: rgba(primary, 0.04).

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Table semantics | Rendered as `<table>` with `<thead>` and `<tbody>` — native screen reader table navigation |
| Column headers | `<th>` elements with `scope="col"` — proper header-data association |
| Sticky header | CSS `position: sticky` — screen reader table semantics unaffected by visual sticky behavior |
| Custom cell content | Accessibility of rendered content is the responsibility of the render function — DataTable does not override or suppress |
| Focus order | Interactive elements in custom render functions follow native tab order within table cells |
| Row hover | Visual only — no ARIA changes on hover; no accessibility impact |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Column labels | Provided by parent in column definitions — no hardcoded labels in DataTable |
| Aria-label for table | Should be provided by parent (e.g., `aria-label` or `aria-labelledby` for the `<table>` element) |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Column definition-driven rendering with no built-in sorting, pagination, or search — pure presentational table |
| Typography Leads | Column headers semibold weight establish hierarchy; body text regular weight for readability |
| White Space is Feature | Row height 52px provides comfortable vertical rhythm; cell padding; row separators 1px solid var(--mui-divider) |
| 8px grid rule | Row height 52px (6.5 × 8px); cell horizontal padding 16px (2 × 8px); min-width values on 8px grid |
| Color System | Row separators via `var(--mui-divider)`; hover via `rgba(primary, 0.04)` — all colors from CSS variables |
| Accessibility | Native table semantics, `<th scope="col">`, no ARIA overrides on custom content |
| Quality Checklist | Idle, Empty data, Empty columns — all three states defined; loading/error delegated to parent |

# Open Questions

- Should DataTable support row striping (alternating background) for improved scanability?
- Should a min-width default of 120px be enforced if the column definition omits it?
- Should the sticky header use a CSS `z-index` value on a predefined token to stay above body rows?
