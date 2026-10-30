# CsvViewer: Feature Technical

## 1. Technical Overview

`CsvViewer` (`src/common/components/organisms/CsvViewer.tsx`) is a CSV file viewer organism that parses raw CSV strings into tabular data and renders a paginated table with sticky headers, built on MUI `Table`, `TablePagination`, and `Typography`. It auto-detects comma vs. semicolon delimiters from the first line using a lightweight heuristic (`lines[0].includes(";") ? ";" : ","`).

The component manages its own pagination UI state (`page`, `rowsPerPage`) via `useState` — this is pure visual state, not domain state, compliant with the Stateless UI invariant. The parse logic is extracted to a separate utility module `parseCsv.ts` for independent testability and wrapped in `useMemo` to prevent re-parsing on pagination state changes. Renders via the shared `DataTable` organism for consistent table presentation.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | Compliant — `page` and `rowsPerPage` are UI interaction state; `parseCsv` extracted to utility module |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes organism (`DataTable`), MUI atoms (`TablePagination`, `Typography`, `Box`) |
| **Theme Sovereignty** (theming.md) | All styling via theme tokens: `background.default/paper`, `palette.text.primary/secondary`, `borderColor: 'divider'`, `spacing.md/sm` |
| **MVVM Separation** (mvvm-pattern.md) | View with extracted parse utility in `parseCsv.ts` — model-adjacent logic externalized for independent testability |
| **Localization** (localization.md) | Uses `useLanguage` for `viewer.empty_csv` key with hardcoded fallback `"No CSV content available"` |
| **Dependency Safety** (dependencies.md) | Minimal imports: MUI components, `useLanguage`, `spacing` tokens |
| **Platform Neutrality** (platform-abstraction.md) | Pure React + MUI — no platform-specific APIs |

## 3. Data Flow

```
Parent / FileViewerRouter
  |
  +-> fileName: string   (required -- displayed as title)
  +-> fileContent?: string (optional -- raw CSV content)
        |
        v
  CsvViewer
    |
    +-> useMemo(() => parseCsv(fileContent ?? ""), [fileContent])
    |     +-> Split by newline (CRLF / LF)
    |     +-> Trim lines, filter empty
    |     +-> If lines.length === 0 -> { headers: [], rows: [] }
    |     +-> Detect delimiter: lines[0].includes(";") ? ";" : ","
    |     +-> headers = lines[0].split(delimiter)
    |     +-> rows = lines[1..n].map(line => line.split(delimiter))
    |
    +-> Derived: tableData = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    |
    +-> Render:
          +-> fileName as Typography variant="h4"
          +-> If headers.length === 0 -> empty-state message (localized)
          +-> DataTable (shared organism, sticky header via composition)
          +-> TablePagination
                +-> rowsPerPageOptions: [10, 25, 50]
                +-> count: rows.length
                +-> page, rowsPerPage controlled by useState
```

## 4. State Management

The component manages UI-only pagination state via `useState`:

| State Variable | Type | Initial Value | Purpose |
|---|---|---|---|
| `page` | `number` | `0` | Current page index in paginated table |
| `rowsPerPage` | `number` | `10` | Number of rows displayed per page |

**State transitions:**

| Transition | Trigger | Effect |
|---|---|---|
| Next page | User clicks next page button | `setPage(page + 1)` |
| Previous page | User clicks prev page button | `setPage(page - 1)` |
| Specific page | User clicks page number | `setPage(newPage)` |
| Change rows per page | User selects new value in pagination dropdown | `setRowsPerPage(parseInt(value, 10))`, `setPage(0)` |
| New file content | `fileName` or `fileContent` prop changes | Full re-parse, `page` resets to 0 |

No `useDataState` is used — file content arrives already resolved via props. The `page` and `rowsPerPage` states are pure UI interaction state (per state-management.md) and do not represent domain data.

## 5. Styling Implementation

All styling uses MUI `sx` prop with theme tokens:

| Token Path | Usage |
|---|---|
| `background.default` | Table container background |
| `background.paper` | Paper wrapper background |
| `palette.text.primary` | Title typography color |
| `palette.text.secondary` | Empty state message color |
| `borderColor: 'divider'` | Table cell borders, container border |
| `spacing.md` (16px) | Container padding, title bottom margin |
| `spacing.sm` (8px) | Cell padding |

The sticky header is enabled via MUI's `stickyHeader` prop on `<Table>` — CSS-based, no JavaScript scroll handling.

## 6. Interaction Design

| Interaction | Behavior |
|---|---|
| Page navigation | User clicks next/prev or page number in `TablePagination` — `onPageChange` fires, `page` updates, visible rows re-slice |
| Rows per page change | User selects 10/25/50 in pagination dropdown — `onRowsPerPageChange` fires, `rowsPerPage` updates, `page` resets to 0 |
| Table scroll | Sticky header remains visible while user scrolls through rows |
| Row hover | MUI `TableRow hover` prop applies CSS background change on mouse hover |

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| Semantic table | ✅ | Native `<table>` with `<thead>`, `<tbody>`, `<th>`, `<td>` elements |
| Sticky header | ✅ | MUI `stickyHeader` preserves column labels during scroll |
| Pagination controls | ✅ | MUI `TablePagination` provides accessible page navigation |
| Empty state message | ✅ | Typography rendered as text — readable by screen readers |
| Table caption | ❌ | No `<caption>` element describing table content |
| `aria-label` on table | ❌ | Not set |
| `aria-sort` | ❌ | Not applicable (no built-in sorting) |
| Row count announcement | ❌ | No `aria-live` region for pagination changes |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| Missing `fileName` | Prop omitted | TypeScript compilation error (required) |
| Empty/undefined `fileContent` | Prop omitted or empty string | `parseCsv("")` returns `{ headers: [], rows: [] }` — empty-state message displayed |
| Mixed delimiters | Some rows use `;`, others use `,` | Delimiter detected from first line only — subsequent lines may parse with incorrect column count |
| Missing translation key | `literal["viewer.empty_csv"]` undefined | Uses hardcoded fallback `"No CSV content available"` |
| Whitespace-only CSV | All lines empty after trim | Lines filtered out — headers and rows both empty, empty-state message displayed |
| Very large CSV | Rows > 50K | Pagination without virtualization — DOM grows with each page, performance degrades |
| `fileContent` is not a string | Unexpected type passed at runtime | `parseCsv` receives non-string — `.split()` may throw, error propagates to parent |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|---|
| Parse complexity | O(n) on lines — memoized with `useMemo`, re-parses only on `fileContent` change |
| Render complexity | O(currentPageRows x columns) — only visible rows rendered via `DataTable` |
| Re-render behavior | Pagination state changes do not trigger re-parse (thanks to `useMemo` on `fileContent`) |
| Pagination state | `page` resets to 0 on rows-per-page change to prevent invalid page index |
| Virtualization | Not implemented — 10K+ rows will cause DOM performance issues |

## 10. Integration Points

| Integration | Details |
|---|---|
| **FileViewerRouter** | Primary consumer — routes `.csv` files to `CsvViewer` via extension match |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `CsvViewer`, `CsvViewerProps` |
| **Language provider** | Requires `LanguageProvider` ancestor for `viewer.empty_csv` localization key |
| **Theme provider** | Requires MUI `ThemeProvider` ancestor for theme token resolution |
| **DataTable** | Composes `DataTable` (shared organism) for consistent table presentation with sticky header |

## 11. Open Questions

1. ~~Should `parseCsv` be extracted to a separate utility module within the organism's scope for independent testability?~~ **Resolved**: Extracted to `parseCsv.ts`.
2. ~~Should `parseCsv` be wrapped in `useMemo` to prevent re-parsing on pagination state changes?~~ **Resolved**: Wrapped in `useMemo`.
3. Should column sorting by clicking header cells be implemented?
4. Should column search/filter input be added for quick data filtering?
5. What is the expected behavior for malformed CSV rows — skip, highlight, or surface an error?
6. Should CSV export functionality be added as a toolbar action?
7. ~~Should the component compose `DataTable` internally instead of rendering its own MUI Table?~~ **Resolved**: Composes `DataTable` shared organism.

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
