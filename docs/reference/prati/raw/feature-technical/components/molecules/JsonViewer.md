# JsonViewer: Feature Technical

## 1. Technical Overview

JsonViewer is a molecule that renders JSON/JSONL content with syntax highlighting (Prism, vscDarkPlus theme). It implements a parse-and-render pipeline with graceful error recovery: raw JSON text is parsed into structured data and highlighted. Invalid JSON produces a structured error object with the raw content alongside it rather than crashing. JSONL files are parsed line-by-line — a single malformed line produces an error entry for that line only. The syntax highlighter (`react-syntax-highlighter`) and its Prism style are both loaded lazily to preserve initial bundle size.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes MUI atoms (`Box`, `Typography`) with a lazy-loaded syntax highlighter. No imports from organism or template tiers. Complies with `docs/raw/architecture/core/component-tiers.md:34-46`. |
| **Stateless UI** | Props-driven rendering — file content arrives via props. The `normalizeJsonForDisplay` helper is a pure data transformation (string → string), not a side effect. Complies with `docs/raw/architecture/invariants/stateless-ui.md:20-37`. |
| **Theme Sovereignty** | All visual values derive from theme tokens — background via `'background.default'` / `'background.paper'`, border via `'divider'`, text via `'text.secondary'`, spacing from token constants. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | Uses `useLanguage` hook for empty-state message. Translation key: `viewer.empty_json` with fallback `"No JSON content available for preview."`. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **Dependency Safety** | `react-syntax-highlighter` and its Prism style loaded lazily — deferred to runtime. Heavy dependency not included in initial bundle. Complies with `docs/raw/architecture/core/component-tiers.md:45-46`. |
| **MVVM Pattern** | View component with allowed lazy-load pattern. Pure data transformation helper is a formatting concern, not business logic. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116`. |

## 3. Data Flow

```
Parent (FileViewerRouter organism)
  │
  ├── fileName: string ────────────→ JsonViewer
  └── fileContent?: string ────────→ JsonViewer
                                        │
                                        ├── normalizeJsonForDisplay(fileName, fileContent, emptyMessage)
                                        │     │
                                        │     ├── No content or empty:
                                        │     │     → JSON.stringify({ message: emptyMessage })
                                        │     │
                                        │     ├── .jsonl extension:
                                        │     │     → .split('\n').filter(Boolean)
                                        │     │     → each line: try JSON.parse → on fail: { line, parseError: true, raw }
                                        │     │     → JSON.stringify([...results], null, 2)
                                        │     │
                                        │     └── Regular JSON:
                                        │           → JSON.parse → JSON.stringify(parsed, null, 2)
                                        │           → On parse failure: { parseError: true, raw: fileContent }
                                        │
                                        ├── normalized string → <SyntaxHighlighter language="json" style={style}>
                                        │
                                        └── File name → Typography (header bar)
```

The data flow is: raw string → normalize → format → highlight. The `normalizeJsonForDisplay` function is the core transformation pipeline. It always returns a valid JSON string — even error states produce a JSON object, never a throw.

## 4. State Management

JsonViewer has minimal internal state — a single `useState` for the async-loaded Prism style:

| State | Type | Initial | Purpose |
|---|---|---|---|
| `style` | `object \| null` | `null` | Holds the vscDarkPlus style object loaded asynchronously via dynamic `import()` |

The `style` state is a one-time initialization concern: on first render, the component triggers a dynamic import of the Prism style. While `style` is `null`, a `LoadingFallback` is shown. Once resolved, the style is set and the SyntaxHighlighter renders.

This is permitted by the Stateless UI Invariant as UI presentation state — it controls the visual rendering of the syntax highlighter, not business data.

No `useDataState`, no `useReducer`, no `useContext` for state.

## 5. Styling Implementation

All styling applied via MUI `sx` prop with theme token references:

| Element | Styling Tokens | Source |
|---|---|---|
| Container Box | `sx={{ display: 'flex', flexDirection: 'column', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}` | Theme tokens for surface and border |
| Header Box | `sx={{ px: spacing.md, py: spacing.xs, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}` | Theme tokens for header area |
| File name Typography | `sx={{ color: 'text.secondary' }}` | Theme token `text.secondary` |
| Content area Box | `sx={{ p: spacing.md, bgcolor: 'background.default', overflow: 'auto' }}` | Theme tokens for content area |

The syntax highlighting output uses the Prism `vscDarkPlus` theme, which applies its own inline styles for token coloring. This is the one area where the component partially bypasses theme sovereignty — the Prism style is a pre-built color scheme that does not derive from the MUI theme. This is an accepted trade-off for syntax highlighting, as Prism themes are standardized and dark code themes are expected to be consistent across applications.

## 6. Interaction Design

JsonViewer has no interactive behavior — it is a read-only content viewer. There are no click handlers, no hover effects, no focus management, no keyboard navigation beyond native document scrolling. The only user-observable interaction is the loading state transition (Suspense fallback → syntax-highlighted content).

The component does not implement:
- Search within JSON
- Tree view navigation (expand/collapse)
- Copy-to-clipboard
- Line numbers or code folding

These are intentionally omitted per the feature spec's Non-Responsibilities.

## 7. Accessibility Implementation

- **Semantic structure**: The component renders a header Typography and a code block area. The syntax-highlighted output is rendered as `<code>` blocks with inline styles.
- **Color contrast**: The vscDarkPlus theme is a high-contrast dark theme designed for readability, with good color contrast ratios for code syntax.
- **Loading state**: "Loading..." fallback is rendered during lazy load — no `aria-live` or `role="alert"` is set.
- **Empty state**: The empty JSON object `{ "message": "..." }` is rendered as highlighted JSON — it appears as standard code content in the document flow.

**Accessibility gaps**:
- No `aria-label` on the container — should be a landmark region for the file viewer content.
- No `role="document"` or `aria-roledescription` on the code block.
- The SyntaxHighlighter output may not have appropriate `role` attributes for screen reader navigation of code content.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `fileName` not provided | TypeScript compile error — prop is required |
| `fileContent` not provided / empty | `normalizeJsonForDisplay` returns `{ message: emptyMessage }` as valid JSON string |
| Invalid JSON | `JSON.parse` throws → caught → returns `{ parseError: true, raw: fileContent }` as JSON |
| JSONL single-line parse failure | That specific line becomes `{ line: N, parseError: true, raw: "line text" }` — other lines unaffected |
| Missing translation key `viewer.empty_json` | Hardcoded fallback `"No JSON content available for preview."` used |
| Syntax highlighter lazy load in progress | `<Suspense fallback>` shows "Loading..." |
| Prism style async import in progress | `style` state is `null` → `LoadingFallback` shown |
| Very large JSON (>1MB) | No virtualization — syntax highlighting may cause UI freezes |

**Graceful error recovery** is the core design principle: parse errors never crash the component. They produce structured error objects that preserve the raw content, allowing the user to inspect the problem. This is an implementation of the feature spec's "Graceful error recovery" core concept.

## 9. Performance Considerations

- **Lazy loading**: Two levels of lazy loading — `react-syntax-highlighter` component via `React.lazy()`, and the Prism vscDarkPlus style via dynamic `import()`. Both are deferred to runtime. This means the first render always shows a LoadingFallback (both the component and the style must load sequentially).
- **Render cost**: Normal `JSON.parse`/`JSON.stringify` for content up to ~100KB. Syntax highlighting is the expensive operation for large JSON files.
- **No virtualization**: Very large JSON files (>1MB) may cause the main thread to block during syntax highlighting. The component renders all content at once in a scrollable container without virtualized rendering.
- **Re-render**: Re-renders fully when `fileContent` or `fileName` change. The `normalizeJsonForDisplay` function is wrapped in `useMemo` with `[fileName, fileContent, emptyMessage]` dependencies — re-computation happens only when inputs change.
- **Bundle size**: ~111 lines. `react-syntax-highlighter` with Prism is ~70KB+ gzipped — lazy loading is critical to exclude this from the initial bundle.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { JsonViewer } from "prati"` via barrel, or directly from `@/common/components/molecules/JsonViewer` |
| **Consumed by** | `FileViewerRouter` organism (`docs/raw/feature/components/molecules/JsonViewer.md:33`) — delegates JSON and JSONL file rendering based on file extension |
| **Pattern** | Parse-and-render pipeline with per-line JSONL isolation and structured error recovery |
| **Test file** | `JsonViewer.test.tsx` with `vitest` + `@testing-library/react` — covers empty state, valid JSON rendering, and file name display |
| **Internal helper** | `normalizeJsonForDisplay(fileName, fileContent, emptyMessage): string` — pure function, not exported, not tested |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports `JsonViewer` |
| **MUI dependencies** | `@mui/material` (`Box`, `Typography`) |
| **Third-party dependency** | `react-syntax-highlighter` (lazy-loaded with Prism) |
| **Localization** | Uses `useLanguage` from `../../localization/LanguageContext` |
| **Spacing tokens** | Imports from `../../../theme/tokens/spacing` |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | Only UI presentation state (`useState` for style loading) — allowed per `docs/raw/architecture/invariants/stateless-ui.md:74-93` |

## 11. Open Questions

1. Should `normalizeJsonForDisplay` be extracted and exported as a testable pure function with its own unit tests? (Currently module-scoped, tested indirectly via component tests.)
2. ~~Should a test file be created (`JsonViewer.test.tsx`) to cover JSON parse success, JSON parse error, JSONL line isolation, empty content, and loading state scenarios?~~ **Resolved**: Test file created at `JsonViewer.test.tsx`.
3. Should the Prism style import be cached or preloaded to avoid the sequential component-load-then-style-load waterfall on first render?
4. ~~Should memoization (`useMemo`) be added for `normalizeJsonForDisplay` output to avoid re-parsing on unrelated re-renders?~~ **Resolved**: Wrapped in `useMemo`.
5. Should virtualization be considered for large JSON files (>1MB) to prevent main-thread blocking during syntax highlighting?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
