# DataTable: Feature Technical

## 1. Technical Overview

`DataTable` (`src/common/components/organisms/DataTable.tsx`) is a generic typed data table organism built on MUI `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, and `TableContainer`. It renders structured data with a sticky header driven by column definitions. The component is fully generic (`<T extends Record<string, any>>`) and delegates custom cell rendering via an optional `column.render` prop.

The component is a pure View in the MVVM hierarchy — it owns no state, performs no data fetching, and emits no callbacks. All interactivity (sorting, pagination, filtering) is the parent's responsibility.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | Component owns no `useState` or `useEffect` — pure function of `columns`, `data`, `keyField` |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes MUI atoms (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `Paper`, `Box`) |
| **Theme Sovereignty** (theming.md) | All styling via theme tokens: `borderColor: 'divider'`, `backgroundColor: 'background.paper'`, `spacing` tokens |
| **MVVM Separation** (mvvm-pattern.md) | Pure View — no ViewModel hook, no repository access, no business logic |
| **Dependency Safety** (dependencies.md) | Minimal imports: only `@mui/material` components and `spacing` tokens |
| **Public API Stability** (api-surface.md) | Exported via barrel `src/common/components/organisms/index.ts` with typed generics |
| **Platform Neutrality** (platform-abstraction.md) | Pure React + MUI — no browser, Node, or Electron APIs used |

## 3. Data Flow

```
Parent component
  │
  ├─► provides columns: Column<T>[]
  ├─► provides data: T[]
  └─► provides keyField: keyof T
        │
        ▼
  DataTable<T>
    │
    ├─► Renders TableContainer > Table (stickyHeader)
    │     ├─► TableHead: maps columns → TableCell (label, align, minWidth)
    │     └─► TableBody: maps data → TableRow (hover, key={row[keyField]})
    │           └─► maps columns → TableCell
    │                 ├─► if column.render → column.render(row)
    │                 └─► else → String(row[column.id])
    │
    ▼
  Styled table output with sticky header
```

No data flows upward — the component fires no callbacks, no events, no side effects.

## 4. State Management

**No state.** The component is a pure function of its props. The `useDataState` hook (state-management.md) is not used — data arrives already resolved via props.

Relevant `AppState<T>` concerns are owned by the parent:
- `StateType.INIT` / `StateType.LOADING` — showing a spinner while data loads
- `StateType.COMPLETED` with empty data — rendering `DataTable` with `data: []`
- `StateType.COMPLETED` with data — rendering `DataTable` with populated `data`
- `isError` — showing error state instead of `DataTable`

## 5. Styling Implementation

All styling uses MUI `sx` prop with theme tokens:

| Token Path | Usage |
|---|---|
| `borderColor: 'divider'` | Table cell borders, adapts to light/dark mode |
| `backgroundColor: 'background.paper'` | Table container background |
| `spacing.sm` (8px) | Cell padding via inline `sx` |
| `spacing.md` (16px) | Table bottom margin |
| `minWidth` on `<Table>` | Set to `columns.reduce((acc, col) => acc + (col.minWidth || 100), 0)` |

The sticky header is enabled via MUI's `stickyHeader` prop on `<Table>` — CSS-based, no JavaScript scroll handling. Row hover styling is enabled via MUI's `hover` prop on `<TableRow>`.

## 6. Interaction Design

**No built-in interactions.** The component is read-only. All user interactions are delegated to the parent:

| Interaction | Owner | Mechanism |
|---|---|---|
| Row click | Parent | Parent wraps `DataTable` and adds click handling externally |
| Sorting | Parent | Parent pre-sorts `data` before passing to `DataTable` |
| Pagination | Parent | Parent slices `data` before passing to `DataTable` |
| Filtering | Parent | Parent pre-filters `data` before passing to `DataTable` |
| Cell hover | Built-in | MUI `TableRow hover` prop applies CSS-based background change |

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| Semantic table | ✅ | Native `<table>` with `<thead>`, `<tbody>`, `<th>`, `<td>` elements |
| Sticky header | ✅ | MUI `stickyHeader` preserves header visibility during scroll |
| `aria-label` | ⚠️ Static value "premium data table" — should be dynamic/props-driven |
| Keyboard navigation | ❌ | Not implemented — parent must handle keyboard interaction |
| Focus management | ❌ | Not implemented |
| `aria-sort` | ❌ | Not applicable (no built-in sorting) |
| `aria-colindex` / `aria-rowindex` | ❌ | Not implemented |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| Missing prop | `columns`, `data`, or `keyField` omitted | TypeScript compilation error (all required) |
| `keyField` mismatch | `keyField` not in `keyof T` | TypeScript compilation error |
| `Column.id` mismatch | `column.id` does not match any key of row | `row[column.id]` returns `undefined` — cell renders "undefined" |
| Null/undefined key value | `row[keyField]` is null | `String(null)` → key `"null"` — potential React key collision |
| Duplicate keys | Two rows share same `row[keyField]` value | React warning: "Encountered two children with the same key" |
| Render function error | `column.render(row)` throws | Contained by `ErrorBoundary` — error fallback rendered in place of failing cell |
| Empty data | `data.length === 0` | Header renders with no body rows — table appears empty |
| Empty columns | `columns.length === 0` | Table renders with no columns — invisible output |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|
| Time complexity | O(n × m) — every cell rendered for n rows × m columns |
| Re-render behavior | All rows re-render on every parent re-render — no `React.memo` on rows |
| Sticky header | CSS-based, zero JS overhead |
| Virtualization | Not implemented — 1000+ rows will cause DOM performance degradation |
| Bundle impact | ~2 KB gzipped (MUI table components already in bundle) |

**Risk:** No `React.memo` on row rendering means large datasets cause full table re-render on every parent state change. Future enhancement: virtualized rows or per-row memoization.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Parent component** | Any component needing tabular data display. Parent must provide pre-resolved `columns`, `data`, and `keyField` |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `DataTable`, `Column`, `DataTableProps` |
| **Usage in templates** | `PageHeader`, `SummaryPanel`, `HeroSection` may compose `DataTable` within their children |
| **Usage by CsvViewer** | `CsvViewer` currently renders its own MUI Table inline instead of composing `DataTable` — potential refactor target |
| **Theme provider** | Requires MUI `ThemeProvider` ancestor for theme token resolution |
| **Language provider** | Not required — all text (`column.label`) is pre-translated by parent |

## 11. Open Questions

1. Should `Column<T>.id` be constrained to `keyof T` at the type level (currently declared as `string`)?
2. Should `React.memo` be added to the component to prevent unnecessary re-renders?
3. ~~Should an error boundary be added around `column.render(row)` calls?~~ **Resolved**: `ErrorBoundary` wraps each custom render call.
4. Should `aria-label` be a configurable prop instead of a hardcoded value?
5. Should the component export a named constant for default column width (currently implicit 100px via `minWidth || 100`)?
6. Should `EmptyState` be composed internally when `data.length === 0` or remain external?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
