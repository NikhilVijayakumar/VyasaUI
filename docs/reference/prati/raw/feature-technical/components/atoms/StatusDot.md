# StatusDot: Feature Technical

## 1. Technical Overview

StatusDot is a primitive atomic component that renders a colored circular indicator. It maps a `tone` prop (union of status strings) to an MUI theme color via a static lookup table and renders a single `<Box>` element with dynamic dimensions. Zero internal state, zero side effects, zero data dependencies — a pure function of `(tone, size) => JSX.Element`.

## 2. Architecture Realization

| Architecture Document | Realization |
|--- |--- |
| `core/component-tiers.md:18-30` — Atom rules | Renders a single HTML primitive (`<Box>`), accepts simple props (`tone: string`, `size?: number`), uses theme tokens via `sx`. NO composition, NO business logic, NO data management. |
| `invariants/atomic-hierarchy.md:22-37` — Atom boundary | Imports only from `react` and `@mui/material` (`Box`). No imports from molecules, organisms, or templates. Complies with "may NOT compose other components" rule. |
| `invariants/stateless-ui.md:20-36` — Stateless UI | No `useState`, no `useEffect`, no refs, no side effects. All visual output is determined solely by `tone` and `size` props. Complies with "components may manage only UI presentation state". |
| `invariants/theme-sovereignty.md:22-38` — Theme tokens | All colors resolve through MUI theme via `sx` prop token strings (`'success.main'`, `'warning.main'`, `'text.secondary'`). No hardcoded hex/rgb. |
| `invariants/public-api-stability.md:18-36` — Public API | `StatusDot`, `StatusDotTone`, `StatusDotProps` exported via barrel `src/common/components/atoms/index.ts`. Stable import path: `@/common/components/atoms`. |
| `invariants/dependency-safety.md:18-36` — Dependency control | Only `react` (FC) and `@mui/material` (Box). Minimal, tree-shakeable, version-pinned imports. |

## 3. Data Flow

```
Parent Component
  │
  ├── tone: StatusDotTone ──────────→ toneColorMap lookup → theme token string
  ├── size?: number (default 10) ───→ <Box width={size} height={size} />
  │
  ▼
<Box sx={{ width, height, borderRadius: '50%', backgroundColor: token }} />
```

Data flows exclusively parent-to-child via props. No callbacks, no events, no context reads.

## 4. State Management

No state. The component is a pure render function with zero internal state transitions.

## 5. Styling Implementation

- **Colors**: Static `toneColorMap` object maps tone keys to MUI theme token strings (`'success.main'`, `'warning.main'`, `'error.main'`, `'info.main'`, `'text.secondary'`). Resolved via `sx` prop. Unknown tones fall back to `toneColorMap.default` → `'text.secondary'`.
- **Dimensions**: `width` and `height` set to `size` prop value (default 10). Circular shape via `borderRadius: '50%'`.
- **Theme compliance**: All values pass through MUI theme resolution. Dark/light mode adaptation is automatic.

## 6. Interaction Design

No user interactions. StatusDot is a purely passive visual indicator.

## 7. Accessibility Implementation

- No `aria-label`, `role`, or `title` attributes are set.
- The `<Box>` renders as an empty `<div>` — screen readers cannot interpret the status.
- **Gap**: Accessibility attributes mapping tone to descriptive text are not implemented. Referenced in feature spec as future enhancement.

## 8. Error Handling

| Condition | Behavior |
|--- |--- |
| Unknown tone value | `toneColorMap[tone]` returns `undefined`; fallback `|| toneColorMap.default` resolves to `'text.secondary'` (grey dot) |
| Negative or zero size | `<Box>` renders with zero/negative dimensions — invisible in DOM |
| Missing tone at runtime | `tone` is `undefined`; same fallback chain → grey dot |
| Invalid theme token | MUI silently ignores invalid token — dot renders transparent |

No errors are thrown, logged, or surfaced. No error boundary provided.

## 9. Performance Considerations

- Single `<Box>` element with inline `sx` — minimal DOM footprint.
- No effects, no state, no re-renders triggered internally.
- No localization hook — skips context subscription entirely.
- Re-renders only when parent passes new props.

## 10. Integration Points

- **Consumers**: Any component in molecules/, organisms/, or templates/ that needs a status indicator.
- **Barrel export**: Re-exported via `src/common/components/atoms/index.ts` as `export * from './StatusDot'`.
- **Sibling atoms**: Related to `SeverityBadge` (text-based severity label) — both are status indicators at different levels of detail.

## 11. Open Questions

1. Should the `executing` tone include a CSS pulse animation? The feature spec lists it as "Future Enhancements" but no timeline is defined.
2. Should accessibility attributes (`aria-label` per tone, `role="status"`) be added as part of the core implementation or deferred?
3. Should `size` have an upper bound or clamp to prevent extreme values?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
