# SeverityBadge: Feature Technical

## 1. Technical Overview

SeverityBadge is a primitive atomic component that renders a color-coded severity label. It maps a `level` prop (union of severity strings widened with `string`) to an MUI theme color via a static lookup table, renders a `<Typography variant="micro">` element with semi-transparent background. Zero internal state, zero side effects, zero data dependencies.

## 2. Architecture Realization

| Architecture Document | Realization |
|--- |--- |
| `core/component-tiers.md:18-30` — Atom rules | Renders single `<Typography>` element (one primitive). Accepts `level: SeverityLevel | string`. Uses theme tokens for colors and spacing. NO composition, NO business logic, NO data management. |
| `invariants/atomic-hierarchy.md:22-37` — Atom boundary | Imports only `@mui/material` (`Typography`) and theme token constants (`spacing`). No imports from higher tiers. |
| `invariants/stateless-ui.md:20-36` — Stateless UI | Pure render function — output determined solely by `level` prop. Zero state, zero effects. |
| `invariants/theme-sovereignty.md:22-38` — Theme tokens | Colors via `sx` token strings (`'error.main'`, `'warning.main'`, etc.). Spacing via imported `spacing` token constants (`spacing.sm`, `spacing.internal`). No hardcoded values. |
| `invariants/public-api-stability.md:18-36` — Public API | `SeverityBadge`, `SeverityLevel`, `SeverityBadgeProps` exported via barrel. `SeverityLevel | string` widening provides autocomplete for TypeScript consumers and runtime compatibility for dynamic data. |
| `invariants/dependency-safety.md:18-36` — Dependency control | Only `react`, `@mui/material` (`Typography`), and theme token import. Minimal surface. |

## 3. Data Flow

```
Parent Component
  │
  └── level: SeverityLevel | string ──→ colorMap lookup
                                          │
                                          ├── known key → mapped token (e.g., 'error.main')
                                          └── unknown key → fallback 'info.main'
                                              │
                                              ▼
<Typography variant="micro" sx={{ bgcolor: `${tone}15`, color: tone }} />
```

Data flows exclusively parent-to-child via the `level` prop. No callbacks, no events.

## 4. State Management

No state. The component is a pure render function with zero internal state transitions.

## 5. Styling Implementation

- **Color map**: Static `colorMap` object mapping uppercase level strings to MUI theme color tokens (`CRITICAL→'error.main'`, `WARNING→'warning.main'`, `URGENT→'info.main'`, `INFO→'info.main'`, `SUCCESS→'success.main'`, `ERROR→'error.main'` alias).
- **Background**: Semi-transparent via hex alpha suffix (`${tone}15` = ~8% opacity).
- **Spacing**: Uses imported `spacing` tokens for padding and internal margins.
- **Typography**: MUI `variant="micro"` for compact label sizing.
- **Border radius**: Token-referenced via `borderRadius` in `sx` prop.

## 6. Interaction Design

No user interactions. SeverityBadge is a purely passive visual label.

## 7. Accessibility Implementation

- No `role`, `aria-label`, or semantic HTML attributes.
- Color is the sole differentiator — no icon or text-style distinction for colorblind users.
- **Gap**: Accessibility attributes not implemented. Feature spec lists icon slot and size presets as future enhancements.

## 8. Error Handling

| Condition | Behavior |
|--- |--- |
| Unknown level string | `colorMap[level]` returns `undefined`; fallback to `'info.main'` → badge renders in info color |
| Case-sensitive mismatch (e.g., `"critical"` lowercase) | `colorMap["critical"]` is `undefined`; fallback to `'info.main'` — wrong severity color |
| Very long level text | No `nowrap` — text wraps within badge; layout may expand |
| Missing level at runtime | `level` is `undefined`; `colorMap[undefined]` returns `undefined`; fallback to `'info.main'`. Badge renders "undefined" text in info color |

No errors thrown or logged. No error boundary provided.

## 9. Performance Considerations

- Single `<Typography>` element — minimal DOM footprint.
- No state, no effects, no re-renders beyond prop changes.
- Theme spacing tokens imported statically — no runtime context resolution for spacing.
- Re-renders only when `level` prop changes.

## 10. Integration Points

- **Consumers**: Molecules and organisms needing severity labels (e.g., `Notification`, `DataTable` cells).
- **Barrel export**: Re-exported via `src/common/components/atoms/index.ts`.
- **Sibling atoms**: Related to `StatusDot` (icon-based status indicator) — both communicate status/severity at different levels of detail.

## 11. Open Questions

1. The `ERROR` alias exists in `colorMap` but is not documented in the `SeverityLevel` union. Should it be added to the type?
2. Should hex alpha be standardized across all atoms (documented spec vs. implementation at `15` vs. desired 12%)?
3. Should `borderRadius: 1` be replaced with an explicit token reference?
4. Feature spec mentions icon slot and size presets — what milestone are these planned for?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
