# MdViewer: Feature Technical

## 1. Technical Overview

MdViewer is a molecule that renders raw Markdown content as styled HTML using a lazily loaded `react-markdown` parser. Displays the file name as a heading with a divider separator. Applies theme-aware custom styling to headings, blockquotes, paragraphs, lists, and horizontal rules via CSS selectors inside MUI `sx` prop. Shows a localized empty-state message when no content is provided. The Markdown parser is loaded via `React.lazy()` to avoid impacting initial bundle size.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes MUI atoms (`Box`, `Typography`, `Divider`) with a lazy-loaded third-party markdown parser. No imports from organism or template tiers. Complies with `docs/raw/architecture/core/component-tiers.md:34-46`. |
| **Stateless UI** | Props-driven rendering — file content arrives via `fileContent` prop. No data fetching, no side effects, no mutable state. Complies with `docs/raw/architecture/invariants/stateless-ui.md:20-37`. |
| **Theme Sovereignty** | All visual values derive from theme tokens. Heading, blockquote, paragraph, list styles all use semantic token strings (`'primary.main'`, `'action.hover'`, `'text.primary'`). Spacing from token constants. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | Uses `useLanguage` hook for empty-state message. Translation key: `viewer.empty_markdown` with fallback `"No markdown content available for preview."`. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **Dependency Safety** | `react-markdown` loaded via `React.lazy()` — deferred to runtime. Not included in initial bundle. Complies with `docs/raw/architecture/core/component-tiers.md:45-46`. |
| **MVVM Pattern** | View component with allowed lazy-load pattern. No ViewModel involvement, no data fetching. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116`. |

## 3. Data Flow

```
Parent (FileViewerRouter organism)
  │
  ├── fileName: string ────────────→ MdViewer
  └── fileContent?: string ────────→ MdViewer
                                        │
                                        ├── fileName → Typography (h3 heading)
                                        ├── fileName → Divider (separator)
                                        │
                                        ├── fileContent check:
                                        │     fileContent && fileContent.trim().length > 0
                                        │       → YES: raw markdown string passed to <Markdown>
                                        │       → NO:  `_{emptyMessage}_` (italicized fallback in markdown)
                                        │
                                        ├── <Suspense fallback={<LoadingFallback />}>
                                        │     └── <Markdown>{content}</Markdown>
                                        │           └── Styled HTML output
                                        │                 ├── headings (h1-h6)
                                        │                 ├── paragraphs
                                        │                 ├── lists (ul, ol, li)
                                        │                 ├── blockquotes
                                        │                 └── horizontal rules
```

Data flows exclusively from props into the component. The markdown content is pre-loaded by the parent — the component never reads files from disk or network. The markdown parser module is fetched asynchronously on first render.

## 4. State Management

MdViewer has zero internal state. No `useState`, no `useEffect`, no `useDataState`. The only "management" is the conditional rendering based on `fileContent` presence:

| Prop Condition | Behavior |
|---|---|
| `fileContent` is truthy and non-empty after `.trim()` | Raw content passed to `<Markdown>` for parsing and rendering |
| `fileContent` is undefined, empty, or whitespace-only | Italicized `_{emptyMessage}_` passed to `<Markdown>` |
| `fileName` is provided | Always rendered as h3 heading with divider |

The lazy loading of `react-markdown` is handled by `React.lazy()` and `<Suspense>`, which is a React runtime concern, not a state management concern. The `Suspense` fallback renders "Loading..." while the parser module loads.

## 5. Styling Implementation

All styling is applied via MUI `sx` prop on the container Box. Markdown element styles use nested CSS selectors inside the `sx` prop — this is the theme-aware pattern per `docs/raw/architecture/core/theming.md:80-87`:

```typescript
sx={{
  // Headings
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: 'text.primary',
    mt: spacing.md,
    mb: spacing.xs,
  },
  // Paragraphs
  '& p': {
    color: 'text.primary',
    mb: spacing.sm,
    lineHeight: 1.6,
  },
  // Blockquotes
  '& blockquote': {
    borderLeft: '4px solid',
    borderColor: 'primary.main',
    pl: spacing.md,
    py: spacing.xs,
    my: spacing.sm,
    bgcolor: 'action.hover',
    borderRadius: '0 4px 4px 0',
    '& p': { mb: 0 },
  },
  // Lists
  '& ul, & ol': { pl: spacing.lg, mb: spacing.sm },
  '& li': { color: 'text.primary', mb: spacing.xs },
  // Horizontal rules
  '& hr': {
    border: 'none',
    borderTop: '1px solid',
    borderColor: 'divider',
    my: spacing.md,
  },
}}
```

| Markdown Element | Styling Tokens |
|---|---|
| Headings (h1-h6) | `color: 'text.primary'`, spacing from tokens |
| Paragraphs | `color: 'text.primary'`, `lineHeight: 1.6` |
| Blockquotes | Left border `'primary.main'`, bg `'action.hover'`, padding from tokens |
| Lists (ul, ol, li) | Padding from tokens, `color: 'text.primary'` |
| Horizontal rules | Border `'divider'`, margin from tokens |

**Note**: `lineHeight: 1.6` and `borderRadius: '0 4px 4px 0'` are raw CSS values. Should be reviewed for theme token equivalence per `docs/raw/architecture/invariants/theme-sovereignty.md`.

## 6. Interaction Design

MdViewer has no interactive behavior — it is a read-only content viewer. There are no click handlers, no hover effects, no focus management, no keyboard navigation beyond native document scrolling. The file name heading is static text. The only "interaction" is the loading state transition on first render (Suspense fallback → parsed markdown content).

Markdown links (`<a>` tags rendered by `react-markdown`) are natively clickable — they are standard HTML hyperlinks. The component does not customize link behavior (no `target="_blank"`, no `rel` attributes).

## 7. Accessibility Implementation

- **Semantic HTML**: `react-markdown` renders standard semantic HTML elements (`<h1>`-`<h6>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`, `<hr>`, `<a>`, `<code>`) — these provide native screen reader support.
- **File name heading**: Rendered as `Typography variant="h3"` which produces an `<h3>` element, providing document structure.
- **Loading state**: "Loading..." text is rendered during lazy load — no `aria-live` or `role="alert"` is set for this dynamic content change.
- **Empty state**: Italicized placeholder text is rendered via the markdown parser — it appears as standard content in the document flow.

**Accessibility gaps**:
- No `aria-label` on the container — should be a landmark region for the file viewer content.
- No `aria-live` region for loading state transitions.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `fileName` not provided | TypeScript compile error — prop is required |
| `fileContent` not provided | Content set to `_{emptyMessage}_` (italicized placeholder in markdown) |
| Empty/whitespace-only content | Same as not provided — `_{emptyMessage}_` rendered via markdown parser |
| Missing translation key `viewer.empty_markdown` | Hardcoded fallback `"No markdown content available for preview."` displayed |
| Invalid markdown syntax | `react-markdown` renders gracefully as plain text with inline styling intact |
| Lazy load in progress (first render) | `<Suspense fallback>` shows "Loading..." until parser module loads |
| Network failure during lazy load | `React.lazy()` will throw a Promise — the Suspense boundary will remain in fallback state |
| Very long content | Scrolls via `overflow-y: auto` on the container — no virtualization |
| Missing translation key for empty message | Uses `||` fallback to hardcoded string — English fallback displays |

The error handling is designed for graceful degradation — the component never crashes, even with invalid markdown or missing content.

## 9. Performance Considerations

- **Lazy loading**: `react-markdown` is loaded via `React.lazy()` — the markdown parser module (~15KB gzipped) is not included in the initial bundle. This is the primary performance optimization, ensuring that users who never view markdown files do not pay the download cost.
- **Render cost**: No `useState`, no `useEffect`, no `useCallback`. The markdown content is a derived value from props — `react-markdown` handles its own parsing internally.
- **Re-render**: Re-renders fully when `fileContent` or `fileName` change. Markdown parsing is delegated to `react-markdown`, which handles memoization internally.
- **Long content**: No virtualization — very long markdown documents render all DOM nodes at once. `overflow-y: auto` provides native scrolling.
- **Bundle size**: ~73 lines. Imports `react-markdown` lazily, MUI atoms eagerly.
- **Suspense overhead**: `React.lazy()` + `<Suspense>` adds minimal overhead — the fallback renders only on first mount.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { MdViewer } from "prati"` via barrel, or directly from `@/common/components/molecules/MdViewer` |
| **Consumed by** | `FileViewerRouter` organism (`docs/raw/feature/components/molecules/MdViewer.md:32`) — delegates markdown and plain-text file rendering based on file extension |
| **Pattern** | Lazy-loaded markdown parser with pre-loaded content from props |
| **Test file** | `MdViewer.test.tsx` with `vitest` + `@testing-library/react` — covers empty state, markdown rendering, and whitespace-only content |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports `MdViewer` |
| **MUI dependencies** | `@mui/material` (`Box`, `Typography`, `Divider`) |
| **Third-party dependency** | `react-markdown` (lazy-loaded via `React.lazy()`) |
| **Localization** | Uses `useLanguage` from `../../localization/LanguageContext` |
| **Spacing tokens** | Imports from `../../../theme/tokens/spacing` |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | No `useDataState` or `useState` — must receive data via props per `docs/raw/architecture/core/component-tiers.md:108` |

## 11. Open Questions

1. Should the lazy-loaded `react-markdown` import have retry logic for network failures? (Currently relies on `React.lazy()` default behavior — a network failure will leave Suspense in fallback state indefinitely.)
2. Should `aria-live="polite"` be added to the content area for screen reader announcements when content loads?
3. Should the file name heading accept an optional `aria-label` override for accessible context?
4. ~~Should the markdown output be memoized (e.g., `useMemo`) to avoid re-parsing on unrelated re-renders?~~ **Resolved**: `react-markdown` handles parsing internally; component-level memoization is unnecessary since MdViewer has no local state that would cause re-renders independent of prop changes.
5. ~~Should a test file be created (`MdViewer.test.tsx`) to cover empty state, loading state, and rendering scenarios?~~ **Resolved**: Test file created at `MdViewer.test.tsx`.

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
