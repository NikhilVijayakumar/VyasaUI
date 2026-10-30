# PageHeader: Feature Technical

## 1. Technical Overview

`PageHeader` is a template-tier component at `src/common/components/templates/PageHeader.tsx`. It renders a responsive page-level header with five independent content slots: leading meta, title (required), subtitle, action buttons (primary/secondary), and trailing meta. Exported via `src/common/components/templates/index.ts` → `src/lib.ts`. Consumed as `import { PageHeader } from 'prati'`.

```typescript
interface HeaderActionConfig {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  primaryAction?: HeaderActionConfig;
  secondaryAction?: HeaderActionConfig;
  leadingMeta?: ReactNode;
  trailingMeta?: ReactNode;
}
```

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Atomic Hierarchy** | Template tier — composes MUI atoms (Box, Button, Typography). No business logic, no data access. See `docs/raw/architecture/core/component-tiers.md` for tier rules. |
| **Stateless UI** | Fully compliant per `docs/raw/architecture/invariants/stateless-ui.md`. Props-only component. No `useState`, no `useEffect`, no data fetching. Actions emit callbacks (`onClick`). |
| **Theme Sovereignty** | Spacing via `spacing.xl`, `spacing.md`, `spacing.xs` from `src/theme/tokens/spacing.ts`. Colors via MUI `sx` theme paths (`text.primary`, `text.secondary`). Button variants use MUI theme defaults. See `docs/raw/architecture/core/theming.md`. |
| **Localization** | `title`, `subtitle`, and `HeaderActionConfig.label` are raw string props — consumer must pass translated strings via `useLanguage()` per `docs/raw/architecture/core/localization.md`. |
| **Public API Stability** | Stable — exported via barrel from `templates/index.ts`. `PageHeaderProps` and `HeaderActionConfig` are public types per `docs/raw/architecture/core/api-surface.md`. |
| **Dependency Safety** | Depends on React, MUI (Box, Button, Typography), internal spacing token. No runtime dependencies beyond `@mui/material`. See `docs/raw/architecture/core/dependencies.md`. |

## 3. Data Flow

```
Consumer passes props
  → PageHeader renders outer Box (flex, wrap, space-between)
    → Left group: leadingMeta, title, conditional subtitle (<Typography>)
    → Right group: trailingMeta, conditional secondaryAction (<Button>), conditional primaryAction (<Button>)
```

Flow direction is strictly **props → render → callback**. No upward data flow. Action clicks call `onClick` from `HeaderActionConfig` — parent handles side effects. Each optional section renders independently via conditional checks; omitted props produce no DOM output for that slot.

## 4. State Management

**None.** The component has no internal state. All data arrives via props. No `useState`, `useEffect`, `useDataState`, or `useRef`. This is the canonical template-tier pattern — state management belongs in the consumer's ViewModel hook (`hooks/use<Feature>.ts`) per `docs/raw/architecture/core/state-management.md`.

## 5. Styling Implementation

- **Layout**: Flexbox outer `Box` with `display: "flex"`, `flexWrap: "wrap"`, `justifyContent: "space-between"`, `alignItems: "center"`
- **Spacing**: Constants from `src/theme/tokens/spacing.ts` — `spacing.xl` for outer padding, `spacing.md` for inter-element gaps, `spacing.xs` for tight spacing
- **Typography**: MUI `<Typography>` variants via `sx` — title uses `variant="h4"`, subtitle uses `variant="body2"` with `color="text.secondary"`
- **Button defaults**: `variant ?? "outlined"`, `size ?? "small"`, `borderRadius: 1`, `textTransform: 'none'`
- **Right-to-left rendering**: DOM order is trailingMeta → secondaryAction → primaryAction; visual order from right to left

## 6. Interaction Design

- **Action buttons**: Each button is a native MUI `<Button>`. Click invokes `onClick` from the `HeaderActionConfig`. If `onClick` is undefined, the button renders but is non-functional (no cursor pointer, no ripple).
- **Disabled state**: `HeaderActionConfig.disabled` maps to MUI Button's `disabled` prop — visual gray + no click interaction.
- **No hover/focus/active customization**: Relies entirely on MUI Button default interaction states.

## 7. Accessibility Implementation

- **Buttons**: Native MUI `<Button>` provides keyboard focusability, ARIA button role, and screen reader support by default.
- **Typography hierarchy**: MUI variant mapping handles heading level semantics. `title` renders as `h4`, `subtitle` as `body2`.
- **Missing `aria-label`**: Action buttons use `label` as visible text content only. No explicit `aria-label` prop — consumer must wrap if screen-reader-only labels are needed.
- **No `role` attributes**: Outer container has no landmark role. Consumer should wrap in `<header>` or `<section>` as appropriate.

## 8. Error Handling

| Condition | Behavior |
|---|---|
| Missing `title` | TypeScript compilation error (required prop) |
| Empty `title` string (`""`) | Renders empty `<Typography>` — no crash |
| Missing `subtitle` | Subtitle slot omitted (conditional render) |
| Missing all actions/meta | Right-side Box renders with no children |
| Action missing `onClick` | Button renders but does nothing on click — consumer must provide callback |
| Action missing `variant` | Defaults to `"outlined"` via `?? "outlined"` |
| Action missing `size` | Defaults to `"small"` via `?? "small"` |
| Narrow viewport | Flex container wraps via `flexWrap: "wrap"` — CSS handles |

## 9. Performance Considerations

- Single render pass per prop change. No state-driven re-renders.
- No `React.memo` wrapper — parent re-render triggers PageHeader re-render. Re-render cost is trivial (pure JSX, no effects).
- Bundle cost: MUI Box, Button, Typography. No added runtime, animation, or state libraries.
- Responsive wrapping handled entirely by CSS (`flexWrap: "wrap"`) — no resize observers or media query listeners.

## 10. Integration Points

| Integration | Mechanism |
|---|---|
| **Consumer app** | Import `{ PageHeader }` from `prati`. Pass props directly. |
| **Localization** | Consumer resolves `title`, `subtitle`, `label` via `useLanguage().literal[key]` before passing as props. |
| **Theming** | MUI `ThemeProvider` must be ancestor. Button variants, typography, colors resolve through theme. |
| **Page layout** | Consumer wraps in page-level container with desired padding, background, or sticky behavior. |
| **Action routing** | Action `onClick` callbacks are consumer-managed — typically calls `useNavigate()` or ViewModel actions. |

## 11. Open Questions

- Should action buttons support an `isLoading` prop for async operations (spinner in button)?
- Should `subtitle` support rich text (ReactNode) or remain plain `string` only?
- Should trailing/leading meta accept a `className` or `sx` override for consumer-specific positioning?
- Is sticky/scroll-aware behavior needed at the template level or should it remain consumer-managed?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
