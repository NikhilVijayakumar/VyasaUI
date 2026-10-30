# SummaryPanel: Feature Technical

## 1. Technical Overview

`SummaryPanel` is a template-tier component at `src/common/components/templates/SummaryPanel.tsx`. It renders a bordered panel with a title header and a mapped array of `SummaryLine` entries, each configurable with variant-based typography (`body2` inline / `caption` block) for visual hierarchy. Exported via `src/common/components/templates/index.ts` → `src/lib.ts`. Consumed as `import { SummaryPanel } from 'prati'`.

```typescript
interface SummaryLine {
  text: string;
  variant?: "body2" | "caption";
}

interface SummaryPanelProps {
  title: string;
  lines: SummaryLine[];
}

export const SummaryPanel: FC<SummaryPanelProps>;
```

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Atomic Hierarchy** | Template tier — composes MUI atoms (Box, Typography). Section-level layout only. No business logic. See `docs/raw/architecture/core/component-tiers.md`. |
| **Stateless UI** | Fully compliant per `docs/raw/architecture/invariants/stateless-ui.md`. Props-only (`title`, `lines`). No `useState`, no `useEffect`, no API calls. Pure render function. |
| **Theme Sovereignty** | Spacing via `spacing.lg`, `spacing.sm` from `src/theme/tokens/spacing.ts`. Border, radius, colors via MUI `sx` theme path. All text uses `color: "text.secondary"`. See `docs/raw/architecture/core/theming.md`. |
| **Localization** | `title` and `SummaryLine.text` are raw string props — consumer must pass translated strings via `useLanguage()`. See `docs/raw/architecture/core/localization.md`. |
| **Public API Stability** | Stable — exported via barrel from `templates/index.ts`. `SummaryPanelProps` and `SummaryLine` are public types per `docs/raw/architecture/core/api-surface.md`. |
| **Dependency Safety** | Depends only on React, MUI Box/Typography, internal spacing token. No runtime dependencies beyond `@mui/material`. See `docs/raw/architecture/core/dependencies.md`. |

## 3. Data Flow

```
Consumer passes title and lines[]
  → SummaryPanel renders outer Box with border and padding
    → Typography (variant="h4") for title header
    → lines.map((line, index)) → Typography per line
      → variant="body2": display="inline"
      → variant="caption": display="block"
```

Flow is strictly **props → render**. No callbacks, no event handlers, no upward data flow. The `lines` array is iterated with no filtering, sorting, or transformation — content renders exactly as provided.

## 4. State Management

**None.** The component has no internal state. All data arrives via props. No `useState`, `useEffect`, `useDataState`, or `useRef`. This is the canonical template-tier pattern — state management belongs in the consumer's ViewModel hook (`hooks/use<Feature>.ts`) per `docs/raw/architecture/core/state-management.md`.

## 5. Styling Implementation

- **Panel surface**: `Box` with `border: 1px solid`, `borderColor: "divider"`, `borderRadius: 1`, `padding` via `spacing.lg`
- **Title**: MUI `<Typography variant="h4">` with no custom styling beyond `spacing.sm` bottom margin
- **Line variants**: `variant === "body2"` → `display: "inline"` (flows inline with text); `variant === "caption"` → `display: "block"` (block-level, full width)
- **Line fallback**: `line.variant ?? "body2"` — missing variant defaults to inline body
- **All text color**: `color: "text.secondary"` applied via `sx`
- **Spacing**: Between title and lines via `spacing.sm` margin-bottom; inter-line gap via `spacing.xs` margin-bottom on each line

## 6. Interaction Design

**None.** The component is purely presentational with no interactive elements. No click handlers, no hover states, no focus management. The panel is a read-only display surface — all interaction is delegated to parent components.

## 7. Accessibility Implementation

- **Typography**: MUI variant mapping handles heading level semantics. Title renders with appropriate heading role.
- **No `aria-label` or `role`**: The panel container has no explicit landmark role. Consumer should wrap in `<section>` with `aria-label` if the panel represents a distinct region.
- **No interactive elements**: No keyboard navigation requirements — purely static content.
- **Color contrast**: Relies on MUI theme defaults for `text.secondary` — must ensure theme provides sufficient contrast ratio.

## 8. Error Handling

| Condition | Behavior |
|---|---|
| Missing `title` | TypeScript compilation error (required prop) |
| Missing `lines` | TypeScript compilation error (required prop) |
| Empty `lines` array (`[]`) | Renders title only with no body content — valid state |
| Line missing `variant` | Defaults to `"body2"` via `?? "body2"` — renders inline |
| Long text in line | Wraps naturally within panel width — CSS handles overflow |
| `lines` of wrong type | TypeScript compilation error |

## 9. Performance Considerations

- O(n) render over `lines` array. No re-renders trigger (pure component, no state).
- No `React.memo` wrapper — parent re-render triggers SummaryPanel re-render. Each line is a simple `<Typography>` — re-render cost is proportional to array length.
- Bundle cost: MUI Box, MUI Typography, internal spacing token. No added runtime, animation, or state libraries.
- Key warning: Current implementation likely uses `${line.text}-${index}` as key — duplicate text with same index causes key collision. Consider `React.useId()` or stable unique key per line.

## 10. Integration Points

| Integration | Mechanism |
|---|---|
| **Consumer app** | Import `{ SummaryPanel }` from `prati`. Pass `title` and `lines[]` props. |
| **Localization** | Consumer resolves `title` and each `line.text` via `useLanguage().literal[key]` before constructing the props object. |
| **Theming** | MUI `ThemeProvider` must be ancestor. Border, typography, colors resolve through theme. |
| **Page layout** | Consumer controls panel width, positioning, and adjacent components. Template is width-100% within its parent. |
| **Data pipeline** | `lines` array typically constructed in ViewModel hook from transformed API data. |

## 11. Open Questions

- Should the panel support `maxHeight` with internal scroll for very long line lists?
- Should lines support rich content (ReactNode) or remain plain `text: string` only?
- Should a `className` or `sx` prop be added for consumer-specific overrides (width, background, shadow)?
- Should the component accept `aria-label` or `aria-labelledby` for improved accessibility?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
