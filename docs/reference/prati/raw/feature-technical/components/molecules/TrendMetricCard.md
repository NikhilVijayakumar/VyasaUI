# TrendMetricCard: Feature Technical

## 1. Technical Overview

TrendMetricCard is a stateless molecule that displays a compact metric with label, value, and optional color-coded trend indicator. It composes MUI atoms (Box, Typography) into a dashboard-ready card with fluid width adaptation (`flex: 1`). Trend direction maps to semantic theme colors (`up` → `success.main`, `down` → `error.main`, `neutral` → `text.secondary`). The component has zero internal state — all content arrives via props and renders deterministically.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes MUI atoms (`Box`, `Typography`) with layout structure. No imports from organism or template tiers. Complies with `docs/raw/architecture/core/component-tiers.md:34-46`. |
| **Stateless UI** | Purely props-driven — no internal state, effects, or data lifecycle. All rendering determined by props at render time. Complies with `docs/raw/architecture/invariants/stateless-ui.md:20-37`. |
| **Theme Sovereignty** | All style values use theme tokens — colors via semantic strings (`'success.main'`, `'error.main'`, `'text.secondary'`, `'text.primary'`), spacing via token constants (`spacing.md`, `spacing.sm`, `spacing.xs`), border via `'divider'`. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | No hardcoded user-facing strings. `label` and `trendValue` are props — caller provides pre-translated strings. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **MVVM Pattern** | Purely a View component — receives props, renders UI, emits nothing. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116`. |
| **Public API Surface** | Exports `MetricTrend` type, `TrendMetricCardProps` interface, and `TrendMetricCard` component via barrel. Per `docs/raw/architecture/core/api-surface.md:40-46`. |

## 3. Data Flow

```
Parent Component (e.g., Dashboard page or SummaryPanel organism)
  │
  ├── label: string ────────────────→ TrendMetricCard
  ├── value: string | number ───────→ TrendMetricCard
  ├── trendValue?: string ──────────→ TrendMetricCard
  └── trend?: MetricTrend ─────────→ TrendMetricCard
                                        │
                                        ├── Box (card container, flex: 1)
                                        │     ├── Typography (label, variant="micro", text.secondary)
                                        │     ├── Typography (value, variant="h3", tabular-nums)
                                        │     └── Box (trend row, conditional on !!trendValue)
                                        │           └── Typography (trendValue, variant="caption",
                                        │                 color mapped from trend direction)
```

Data flows exclusively from parent → TrendMetricCard via props. No upward callbacks, no state propagation. The component is a pure render function — identical props always produce identical output.

## 4. State Management

TrendMetricCard has zero internal state. It uses no `useState`, no `useReducer`, no `useDataState`. This is by design per molecule tier rules in `docs/raw/architecture/core/component-tiers.md:45`: "Molecules may NOT: import from organism or template tiers, access repositories, manage data state."

The only conditional rendering logic is the `!!trendValue` guard that controls trend indicator visibility. This is a props-driven conditional, not state management:

| Prop Condition | What Renders |
|---|---|
| `label` and `value` provided | Card with label and value always renders |
| `trendValue` truthy and `trend` provided | Trend indicator row rendered with color-coded text |
| `trendValue` truthy but `trend` not provided | Trend indicator rendered with `text.secondary` (neutral) color |
| `trendValue` falsy (empty/undefined/null) | Trend indicator not rendered regardless of `trend` prop |
| `trend` set to unknown value | Falls to `text.secondary` via ternary chain |

## 5. Styling Implementation

All styling applied via MUI `sx` prop with theme token references:

| Element | Styling Tokens | Source |
|---|---|---|
| Card container Box | `sx={{ display: 'flex', flexDirection: 'column', flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: spacing.md, gap: spacing.xs }}` | Theme tokens for border, spacing, layout |
| Label Typography | `variant="micro"`, `sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}` | Theme token `text.secondary` |
| Value Typography | `variant="h3"`, `sx={{ color: 'text.primary', fontFeatureSettings: '"tnum"' }}` | Theme token `text.primary`; tabular numbers via `fontFeatureSettings` |
| Trend Typography | `variant="caption"`, `sx={{ fontWeight: 600 }}` | Color mapped from trend direction (see below) |

**Trend color mapping** (inline ternary in JSX):
```
trend === "up"   → 'success.main'
trend === "down" → 'error.main'
else             → 'text.secondary'
```

**Spec alignment**: The component uses `variant="h3"` for value display with tabular-nums font feature for numeric alignment. Trend direction is communicated via colored text (`success.main` / `error.main` / `text.secondary`), not arrow icons. The original spec mentioning `h5` and icons has been resolved to match implementation.

**Gap**: `fontWeight: 600` is a raw CSS value. Should be a theme token reference for full theme-sovereignty compliance per `docs/raw/architecture/invariants/theme-sovereignty.md:270-276`.

## 6. Interaction Design

TrendMetricCard has zero interaction behavior — no click handlers, no hover effects, no focus management, no keyboard navigation. It is a purely informational display component. Any interactivity (e.g., clicking a metric card to navigate to a detail view) must be added by the consumer via wrapper components.

## 7. Accessibility Implementation

- **Semantic text**: Uses MUI `Typography` which renders semantic heading elements depending on `variant`. `variant="h3"` renders as `<h3>`, which provides document structure for screen readers.
- **Color-independent communication**: The trend direction is communicated through text content (the `trendValue` string) in addition to color. A user who cannot perceive color can still read the trend value (e.g., "+12.5%") and understand direction.
- **Tabular numbers**: `fontFeatureSettings: '"tnum"'` enables tabular (monospaced) numbers for the value, ensuring consistent column alignment in dashboard metric rows and improved readability for numeric data.
- **No ARIA customization**: The component does not set custom ARIA attributes. It relies on semantic HTML provided by MUI Typography.

**Accessibility consideration**: When used in a dashboard grid, consumers should consider setting `aria-label` or `aria-describedby` on the card container if the metric label alone is insufficient for context.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `label` not provided | TypeScript compile error — prop is required |
| `value` not provided | TypeScript compile error — prop is required |
| `trendValue` not provided / empty string | Trend Typography not rendered (`!!trendValue` guard) |
| `trend` not provided | Trend color defaults to `'text.secondary'` (neutral gray) |
| `trend` set to non-union value (e.g., `"extreme"`) | Falls to `'text.secondary'` via ternary — no runtime validation |
| `value=0` | Renders `"0"` normally — no falsy-value bug (guard is `!!trendValue`, not check on `value`) |
| Very long label or value | Text wraps within the card — no overflow handling |

All rendering is deterministic. No runtime validation occurs — TypeScript compile-time checking is the sole protection layer per `docs/raw/architecture/core/component-tiers.md:89`.

## 9. Performance Considerations

- **Render cost**: Single render pass. No `useState`, no `useEffect`, no `useMemo`, no `useCallback`.
- **Re-render scope**: Re-renders only when any prop changes. Minimal DOM diff — only the changed Typography elements update.
- **Bundle size**: ~69 lines of source. Imports only `Box`, `Typography` from `@mui/material` and spacing tokens.
- **DOM complexity**: Max 3 Typography elements inside 2 Box wrappers. No virtualization needed.
- **Fluid width**: `flex: 1` enables use in flex row metric groups without additional layout calculations.
- **Memoization**: Not required — component has no expensive computations. The ternary color mapping is O(1).

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { TrendMetricCard, TrendMetricCardProps, MetricTrend } from "prati"` via barrel, or directly from `@/common/components/molecules/TrendMetricCard` |
| **Used by** | Dashboard pages, SummaryPanel templates — any context requiring compact metric display with trend |
| **Pattern** | Fluid-width card in flex row groups; `flex: 1` ensures equal distribution in container |
| **Test file** | `src/common/components/molecules/TrendMetricCard.test.tsx` (vitest, 7 tests) |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports all symbols |
| **MUI dependencies** | `@mui/material` (`Box`, `Typography`) |
| **Spacing tokens** | Imports from `../../../theme/tokens/spacing` |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | No `useDataState` or `useState` — must receive data via props per `docs/raw/architecture/core/component-tiers.md:108` |
| **Value formatting** | Not handled by component — consumers must pre-format `value` and `trendValue` strings (e.g., add % signs, decimal places) |

## 11. Open Questions

1. Should the `value` prop type be narrowed from `string | number` to `string` only, pushing all formatting responsibility to consumers? (Currently accepts both, but does no formatting.)
2. Should `MetricTrend` be validated at runtime (e.g., via a switch statement with default) instead of relying on TypeScript compile-time checking for better resilience in non-TypeScript usage?
3. Should `letterSpacing: '0.08em'` on the label be replaced with a theme typography variant or token reference?
4. ~~Should the trend indicator include an arrow/icon in addition to the colored text (as the original spec describes but the implementation does not)?~~ **Resolved**: Colored text is used — no arrow icons per implementation.

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
