# EmptyState: Feature Technical

## 1. Technical Overview

EmptyState is a primitive atomic component that displays a centered "No data found" indicator. Zero-configuration — accepts no props and resolves its text through the localization system. Renders as a `<Typography>` element with neutral visual treatment. Zero state, zero side effects, zero data dependencies beyond localization context.

## 2. Architecture Realization

| Architecture Document | Realization |
|--- |--- |
| `core/component-tiers.md:18-30` — Atom rules | Renders single `<Typography>` element (one primitive). Accepts no props. NO composition, NO business logic, NO data management. |
| `invariants/atomic-hierarchy.md:22-37` — Atom boundary | Imports from `@mui/material` (`Box`, `Typography`) and localization hook. No imports from higher tiers. |
| `invariants/stateless-ui.md:20-36` — Stateless UI | Pure function of localization context. No `useState`, no `useEffect`, no side effects. |
| `invariants/theme-sovereignty.md:22-38` — Theme tokens | Colors via theme tokens (`'text.secondary'` or similar muted color). Spacing via theme spacing tokens. |
| `invariants/public-api-stability.md:18-36` — Public API | `EmptyState` component and `EmptyStateProps` interface exported via barrel. Named export only. |
| `invariants/dependency-safety.md:18-36` — Dependency control | `react`, `@mui/material` (`Box`, `Typography`), `useLanguage` hook. Minimal surface. |

## 3. Data Flow

```
Parent Component renders EmptyState (no props)
  │
  ▼
EmptyState
  │
  └── useLanguage().literal['empty.text'] ──→ localized "No data found" message
      │
      ▼
  <Box sx={{ display: 'flex', ... }}>
    └── <Typography>
          {literal['empty.text']}
        </Typography>
  </Box>
```

Data flows exclusively from localization context → component. No parent-to-child prop passing.

## 4. State Management

- No component state.
- `useLanguage()` hook reads from `LanguageProvider` context.
- Parent manages the empty/data state transition by conditionally rendering EmptyState vs. content.

## 5. Styling Implementation

- **Layout**: Flexbox centering (identical pattern to `LoadingState` and `ErrorState` for visual consistency across all state atoms).
- **Width**: `width: '100%'` to fill parent container.
- **Typography**: Neutral text color via theme (`'text.secondary'` or similar).
- **Spacing**: Theme spacing tokens for padding.
- **Visual treatment**: Muted, non-intrusive styling to clearly signal absence of data without alarming the user.

## 6. Interaction Design

No user interactions. EmptyState is a purely passive "no data" indicator.

## 7. Accessibility Implementation

- **Gap**: No `role="status"` or `aria-live="polite"` to announce empty state to screen readers.
- Text content is readable but dynamic appearance may not be announced.
- **Gap**: No semantic association with the content area it replaces.

## 8. Error Handling

| Condition | Behavior |
|--- |--- |
| Missing localization key `'empty.text'` | `literal['empty.text']` returns `undefined` — renders with no visible text |
| Parent container has no defined height | Flexbox centering may not be visible if container has zero height |
| Multiple instances | Each renders independently — no coordination or deduplication |

No errors thrown. Component always renders the `<Box>` container regardless of text availability.

## 9. Performance Considerations

- Single `<Box>` containing `<Typography>` — minimal DOM footprint.
- `useLanguage()` subscription triggers re-render on language change.
- Zero-config design means no prop change detection overhead.
- Re-renders only when parent re-renders or language changes.

## 10. Integration Points

- **Consumers**: Typically rendered by `AppStateHandler` organism when `state.isSuccess === true` and `state.data` is null/empty.
- **Localization**: Reads `empty.text` key from translation dictionaries.
- **Sibling atoms**: Part of state atom trio with `LoadingState` (loading display) and `ErrorState` (error display). All three share the same centering pattern, full-width layout, and localization hook usage.
- **Barrel export**: Re-exported via `src/common/components/atoms/index.ts`.

## 11. Open Questions

1. Should EmptyState accept an optional custom message prop for domain-specific empty messages (e.g., "No results match your filter")?
2. Should EmptyState include an optional illustration or icon to visually differentiate from a truly blank/error state?
3. Should empty-data logic (checking `state.data === null` or `state.data.length === 0`) be handled by this component or remain in the parent/`AppStateHandler`?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
