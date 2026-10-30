# LoadingState: Feature Technical

## 1. Technical Overview

LoadingState is a primitive atomic component that renders a centered loading indicator. It displays a spinning animation (via MUI `CircularProgress`) with a localized "Loading..." text message below. Zero-configuration — the component accepts no props and resolves its text through the localization system. Zero state, zero side effects, zero data dependencies beyond localization context.

## 2. Architecture Realization

| Architecture Document | Realization |
|--- |--- |
| `core/component-tiers.md:18-30` — Atom rules | Renders two primitives (`CircularProgress` + `Typography`) arranged with flexbox centering. No composition of custom components. NO data management, NO business logic. |
| `invariants/atomic-hierarchy.md:22-37` — Atom boundary | Imports from `@mui/material` (`Box`, `CircularProgress`, `Typography`) and localization hook. No imports from higher atomic tiers. |
| `invariants/stateless-ui.md:20-36` — Stateless UI | Reads localized message via `useLanguage()` hook (context subscription, not state management). No `useState`, no `useEffect`, no side effects. |
| `invariants/theme-sovereignty.md:22-38` — Theme tokens | Spinner and typography colors resolve through MUI theme via `sx` prop. Centering via flexbox from theme spacing. |
| `invariants/public-api-stability.md:18-36` — Public API | `LoadingState` component and `LoadingStateProps` interface exported via barrel. Named export only. |
| `invariants/dependency-safety.md:18-36` — Dependency control | `react`, `@mui/material` (`Box`, `CircularProgress`, `Typography`), `useLanguage` hook. Minimal, tree-shakeable. |

## 3. Data Flow

```
Parent Component renders LoadingState (no props)
  │
  ▼
LoadingState
  ├── useLanguage().literal['loading.text'] ──→ localized "Loading..." message
  └── <Box sx={{ display: 'flex', ... }}>
        ├── <CircularProgress />         (theme-colored spinner)
        └── <Typography>                  (localized text)
              {literal['loading.text']}
            </Typography>
      </Box>
```

Data flows from localization context → component. No parent-to-child prop passing (zero-config).

## 4. State Management

- No component state. The only dynamic input is the localization context value.
- `useLanguage()` hook reads from `LanguageProvider` context — re-renders when language changes.
- State transitions (loading → success/error) are managed by the parent component (typically via `useDataState` or `AppStateHandler`).

## 5. Styling Implementation

- **Layout**: Flexbox centering (`display: 'flex'`, `flexDirection: 'column'`, `alignItems: 'center'`, `justifyContent: 'center'`).
- **Width**: `width: '100%'` to fill parent container.
- **Spacing**: Theme spacing between spinner and text via token-based gap/padding.
- **Spinner**: MUI `CircularProgress` — color resolves from theme automatically.
- **Typography**: Standard body variant — color from theme `text.secondary` or similar.

## 6. Interaction Design

No user interactions. LoadingState is a purely passive loading indicator.

## 7. Accessibility Implementation

- MUI `CircularProgress` includes `role="progressbar"` by default.
- **Gap**: No `aria-label` or `aria-describedby` connecting the spinner to the loading text.
- Screen readers can detect the progressbar role but may not associate it with the text.

## 8. Error Handling

| Condition | Behavior |
|--- |--- |
| Missing localization key `'loading.text'` | `literal['loading.text']` returns `undefined` — spinner renders without visible text |
| Parent container has no defined height | Flexbox centering may not be visible if container has zero height |
| Multiple instances | Each renders independently — no coordination or deduplication |

No errors thrown. Spinner always renders regardless of text availability.

## 9. Performance Considerations

- Minimal DOM: one `<Box>` containing `<CircularProgress>` + `<Typography>`.
- `useLanguage()` subscription triggers re-render on language change — acceptable for this scope.
- No expensive computations or animations beyond MUI's optimized `CircularProgress`.
- Re-renders only when parent re-renders or language changes.

## 10. Integration Points

- **Consumers**: Typically rendered by `AppStateHandler` organism when `state.state === StateType.LOADING`.
- **Localization**: Reads `loading.text` key from translation dictionaries (`src/common/localization/{lang}.json`).
- **Sibling atoms**: Part of state atom trio with `ErrorState` (error display) and `EmptyState` (no-data display). All three share the same centering pattern and localization approach.
- **Barrel export**: Re-exported via `src/common/components/atoms/index.ts`.

## 11. Open Questions

1. Should LoadingState accept an optional custom message prop for cases where the default "Loading..." is insufficient?
2. Should a minimum display duration be implemented to prevent flash-of-loading for fast operations?
3. Should `CircularProgress` size be configurable or use a fixed size?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
