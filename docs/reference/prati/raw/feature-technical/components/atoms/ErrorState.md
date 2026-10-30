# ErrorState: Feature Technical

## 1. Technical Overview

ErrorState is a primitive atomic component that displays a centered error message. Accepts an optional custom `message` prop; falls back to a localized default error message when none is provided. Renders as an alert-styled `<Typography>` element with error-appropriate visual treatment. Zero state, zero side effects, zero data dependencies beyond optional prop and localization context.

## 2. Architecture Realization

| Architecture Document | Realization |
|--- |--- |
| `core/component-tiers.md:18-30` — Atom rules | Renders a single `<Typography>` element with theme-based error styling. Accepts optional `message: string`. NO composition, NO business logic, NO data management. |
| `invariants/atomic-hierarchy.md:22-37` — Atom boundary | Imports from `@mui/material` (`Box`, `Typography`, `Alert`) and localization hook. No imports from higher tiers. |
| `invariants/stateless-ui.md:20-36` — Stateless UI | Pure function of props + localization context. No `useState`, no `useEffect`, no side effects. Fallback chain is inline logic (ternary), not state. |
| `invariants/theme-sovereignty.md:22-38` — Theme tokens | Error colors via theme tokens (`'error.main'`, `'error.light'` background). Spacing via theme spacing tokens. |
| `invariants/public-api-stability.md:18-36` — Public API | `ErrorState`, `ErrorStateProps` exported via barrel. `message` is optional — resolves via fallback chain. |
| `invariants/dependency-safety.md:18-36` — Dependency control | `react`, `@mui/material` (`Box`, `Typography`, `Alert`), `useLanguage` hook. Minimal surface. |

## 3. Data Flow

```
Parent Component
  │
  └── message?: string ─────────────────┐
                                        ▼
                              ErrorState
                                │
      ┌─────────────────────────┼─────────────────────────┐
      ▼                         ▼                         ▼
  message provided         no message,               no message,
  (use prop)               key found                  key missing
      │                         │                         │
      ▼                         ▼                         ▼
  <Typography>            <Typography>             renders empty
  {message}               {literal['error.default']}  (no visible text)
```

Data flows from parent (optional prop) and localization context into the component. Falls back gracefully through the chain.

## 4. State Management

- No component state.
- `useLanguage()` hook reads from `LanguageProvider` context.
- Parent manages the error/loading/success state transition (typically via `useDataState`).

## 5. Styling Implementation

- **Error styling**: MUI `Alert` component or custom `<Typography>` with theme-based error colors (`'error.main'` text, light error background).
- **Layout**: Flexbox centering (same pattern as `LoadingState` and `EmptyState` for visual consistency).
- **Spacing**: Theme spacing tokens for padding and internal margins.
- **Width**: Full-width (`width: '100%'`) to fill parent container.

## 6. Interaction Design

- No user interactions within the component.
- Retry/dismiss actions are handled by the parent component (outside ErrorState scope per non-responsibilities).

## 7. Accessibility Implementation

- MUI `Alert` includes `role="alert"` by default — announces error to screen readers.
- If using custom `<Typography>`, no role is set.
- **Gap**: No explicit `role="alert"` or `aria-live="assertive"` if not using MUI `Alert`.
- Error messages should be descriptive enough for all users.

## 8. Error Handling

| Condition | Behavior |
|--- |--- |
| Custom message provided | Displays the provided message string |
| No message, localization key exists | Falls back to `literal['error.default']` — localized default error text |
| No message, missing localization key | `literal['error.default']` returns `undefined` — renders with no visible text |
| Extremely long message | Text wraps within container — no truncation |
| Multiple instances | Each renders independently — no coordination |

No errors thrown. Fallback chain ensures no crash path exists.

## 9. Performance Considerations

- Single `<Box>` containing `<Typography>` (or `<Alert>`) — minimal DOM footprint.
- `useLanguage()` subscription triggers re-render on language change.
- Optional prop avoids unnecessary re-renders from parent — only changes when `message` identity changes.
- Re-renders only when parent re-renders, `message` prop changes, or language changes.

## 10. Integration Points

- **Consumers**: Typically rendered by `AppStateHandler` organism when `state.isError === true`.
- **Localization**: Reads `error.default` key from translation dictionaries.
- **Sibling atoms**: Part of state atom trio with `LoadingState` (loading indicator) and `EmptyState` (no-data indicator). All three share centering pattern and localization approach.
- **Barrel export**: Re-exported via `src/common/components/atoms/index.ts`.

## 11. Open Questions

1. Should ErrorState include an optional `onRetry` callback prop to enable inline retry without parent composition?
2. Should ErrorState display error codes or technical details behind a "Show details" toggle?
3. The feature spec says "Does not capture or log errors" — should the component accept an `onError` callback for logging integrations?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
