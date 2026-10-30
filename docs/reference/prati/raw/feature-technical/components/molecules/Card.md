# Card: Feature Technical

## 1. Technical Overview

Card is a stateless molecule component that renders a Paper-based bordered surface with an optional header row. It composes MUI atoms (Paper, Box, Typography) into a slot-based layout container. Each header section (title, supportingText, action) renders independently and can be omitted without affecting others. The component has zero internal state, zero side effects, and zero data dependencies — all content arrives via props.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes only MUI primitives (`Paper`, `Box`, `Typography`) — no imports from `organisms/` or `templates/`. Complies with `docs/raw/architecture/core/component-tiers.md:34-46` molecule rules. |
| **Stateless UI** | All data arrives via props (`title`, `supportingText`, `children`, `action`). No `useState`, no `useEffect`, no data fetching, no side effects. Complies with `docs/raw/architecture/invariants/stateless-ui.md:20-37`. |
| **Theme Sovereignty** | All visual values derive from theme tokens: `spacing.lg`, `spacing.xs`, `spacing.internal` from token constants; `borderColor: 'divider'`, `bgcolor: 'background.paper'`, `color: 'text.primary'` / `'text.secondary'` via MUI `sx` prop. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | No hardcoded user-facing strings — card is a layout container. All text content arrives pre-translated via props. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **MVVM Pattern** | Purely a View component — receives props, renders UI, emits nothing. No ViewModel involvement. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116` presentational component rules. |
| **Public API Surface** | Exported via barrel from `src/common/components/molecules/index.ts`. `CardProps` and `Card` are public symbols per `docs/raw/architecture/core/api-surface.md:40-46`. |

## 3. Data Flow

```
Parent Component
  │
  ├── title?: string ────────────────→ Card
  ├── supportingText?: string ────────→ Card
  ├── action?: ReactNode ─────────────→ Card
  └── children?: ReactNode ───────────→ Card
                                          │
                                          ├── Paper (elevation={0}, border treatment)
                                          │     ├── Box (header row, conditional)
                                          │     │     ├── Typography (title, text.primary)
                                          │     │     ├── Typography (supportingText, text.secondary)
                                          │     │     └── Box (action slot, flex-end)
                                          │     └── Box (children body, flexGrow: 1)
```

Data flows exclusively from parent → Card via props. No upward callbacks, no state propagation. The component is a pure render function of its props — `Card(props)` always produces the same output for identical props.

## 4. State Management

Card has zero internal state. It uses no `useState`, no `useReducer`, no `useDataState`. This is by design per the molecule tier rules in `docs/raw/architecture/core/component-tiers.md:45`: "Molecules may NOT: import from organism or template tiers, access repositories, manage data state."

The only "state" the component reflects is the presence or absence of props, which determines what gets rendered:

| Prop Condition | What Renders |
|---|---|
| `title` present | Title Typography rendered |
| `supportingText` present | Supporting text Typography rendered |
| `action` present | Action Box rendered |
| Any of `title | supportingText | action` truthy | Header Box rendered |
| `children` present | Children Box rendered |
| All props absent | Empty Paper with padding and border only |

## 5. Styling Implementation

All styling is applied via MUI `sx` prop with theme token references:

| Element | Styling Tokens | Source |
|---|---|---|
| Paper container | `elevation={0}`, `sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}` | Theme sovereignty per `docs/raw/architecture/core/theming.md:80-87` |
| Header Box | `sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, px: spacing.lg, pt: spacing.lg, pb: spacing.xs }}` | Token constants from `../../../theme/tokens/spacing` |
| Title Typography | `sx={{ color: 'text.primary' }}`, `variant="body2"`, `fontWeight={600}` | Token: `text.primary`; font-weight gap noted in Compliance Review |
| Supporting Text Typography | `sx={{ color: 'text.secondary' }}`, `variant="caption"` | Token: `text.secondary` |
| Action Box | `sx={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexShrink: 0 }}` | Token constants for spacing |
| Children Box | `sx={{ px: spacing.lg, pb: spacing.lg, pt: spacing.internal, flexGrow: 1 }}` | Token constants for spacing |

**Gap**: `fontWeight={600}` on the title is a raw numeric value. Should reference `theme.typography.fontWeightBold` per `docs/raw/architecture/invariants/theme-sovereignty.md:270-276`.

## 6. Interaction Design

Card has no interaction behavior — it is a static layout container. The `action` slot accepts any `ReactNode` that the consumer provides; any interactive elements inside the action slot (buttons, links, toggles) are owned and controlled by the consumer. Card does not handle click events, hover states, focus management, or keyboard navigation.

## 7. Accessibility Implementation

Card uses semantic HTML through MUI components:
- `Paper` renders as a `<div>` with appropriate ARIA attributes from MUI
- `Typography` renders as semantic text elements based on `variant`
- No custom ARIA attributes are set — the component is a grouping container and relies on the consumer to provide accessible content within slots
- The header row uses a flex layout with `justifyContent="space-between"` — no explicit `role` or `aria-label` is set on the header Box
- No focus trapping, no keyboard handlers, no `tabIndex` modifications

**Accessibility gap**: Card does not render a `<section>` or apply `role="region"` with `aria-label` or `aria-labelledby`. Consumers should wrap the Card or provide accessible naming when used as a distinct content region.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `title` is `undefined` | Typography not rendered; header still renders if `supportingText` or `action` present |
| `supportingText` is `undefined` | Typography not rendered; header still renders if `title` or `action` present |
| `action` is `undefined` | Action Box not rendered; header still renders if `title` or `supportingText` present |
| All header props `undefined` | Header Box not rendered (guard: `(title || supportingText || action) &&`) |
| `children` is `undefined` | Children Box renders empty with `flexGrow: 1` |
| All props `undefined` | Renders empty Paper with padding, border, border-radius |
| `action` element throws during rendering | Error propagates to parent — no error boundary inside Card |
| `children` element throws during rendering | Error propagates to parent — no error boundary inside Card |

All rendering is deterministic. No runtime validation occurs — TypeScript compile-time checking is the sole protection layer. Per `docs/raw/architecture/core/component-tiers.md:107`, errors in children propagate to the consumer since Card is a molecule with no error boundary.

## 9. Performance Considerations

- **Render cost**: Single render pass — no `useEffect`, no `useMemo`, no `useCallback`. React reconciliation overhead is proportional to the prop count (4 optional props).
- **Re-render scope**: Re-renders only when any prop changes. No internal state to trigger additional renders.
- **Bundle size**: ~66 lines of source, imports only `Box`, `Paper`, `Typography` from `@mui/material` and spacing tokens. No lazy loading needed.
- **DOM complexity**: Max DOM depth is 4 levels (Paper > Box > Typography/Typography/Box > children). No virtualization needed.
- **Memoization**: Not required — the component is a pure function with no expensive computations.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { Card, CardProps } from "prati"` via barrel, or directly from `@/common/components/molecules/Card` |
| **Used by** | Any page or organism that needs a grouped content container with optional header |
| **Test file** | `src/common/components/molecules/Card.test.tsx` (vitest, 6 tests) |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports `Card` and `CardProps` |
| **Spacing tokens** | Imports from `../../../theme/tokens/spacing` |
| **MUI dependencies** | `@mui/material` (`Box`, `Paper`, `Typography`) |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | No `useDataState` or `useState` — must receive data via props per `docs/raw/architecture/core/component-tiers.md:108` |

## 11. Open Questions

1. Should `displayName` be added to the component (`Card.displayName = 'Card'`) for better DevTools identification?
2. Should `fontWeight={600}` on the title be replaced with `theme.typography.fontWeightBold` to close the theme-sovereignty gap identified in the Architecture Compliance Review?
3. Should the Card render as `<section>` with an `aria-label` or `aria-labelledby` prop for better accessibility semantics when used as a content region?
4. Should the header row accept an optional `aria-label` for cases where all header content is visually hidden or icon-only?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
