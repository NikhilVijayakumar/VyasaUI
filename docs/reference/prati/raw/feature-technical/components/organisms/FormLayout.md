# FormLayout: Feature Technical

## 1. Technical Overview

`FormLayout` (`src/common/components/organisms/FormLayout.tsx`) is a presentational page-level form wrapper organism that provides consistent vertical stacking for form pages. It defines three optional vertical slots — header (title), body (children), and footer (actions) — with a max-width constraint of 600px for readability.

The component is a pure View with no state, no data fetching, and no form logic. It uses MUI `Box` and `Typography` primitives with theme tokens for all styling.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | No `useState` or `useEffect` — pure function of props |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes MUI atoms (`Box`, `Typography`) |
| **Theme Sovereignty** (theming.md) | All spacing via `spacing.xl/lg/md`, text color via `palette.text.primary`, borders via `borderColor: 'divider'` |
| **MVVM Separation** (mvvm-pattern.md) | Pure View — no ViewModel, no data fetching, no business logic |
| **Dependency Safety** (dependencies.md) | Minimal imports: `@mui/material` (Box, Typography), `spacing` tokens |
| **Platform Neutrality** (platform-abstraction.md) | Pure React + MUI — no platform-specific APIs |
| **Localization** (localization.md) | Not used — `title` is a pre-translated string prop from parent |

## 3. Data Flow

```
Parent component
  │
  ├─► title?: string (optional)
  ├─► children: React.ReactNode (required)
  └─► actions?: React.ReactNode (optional)
        │
        ▼
  FormLayout
    │
    ├─► Conditional: title && <Typography variant="h5">{title}</Typography>
    ├─► <Box>{children}</Box>
    └─► Conditional: actions && <Box sx={{ borderTop: 1, borderColor: 'divider' }}>{actions}</Box>
        │
        ▼
  Vertical stacked layout with max-width: 600px
```

No data flows upward — no callbacks, no events.

## 4. State Management

**No state.** The component is a pure function of its props. No `useDataState`, no `useState`, no `useEffect`.

The parent owns all form state via ViewModel hooks (`useDataState` for async operations, `useState` for form field values per state-management.md).

## 5. Styling Implementation

All styling uses MUI `sx` prop with theme tokens:

| Token Path | Usage |
|---|---|
| `spacing.xl` (32px) | Vertical gap between header, body, footer sections |
| `spacing.lg` (24px) | Padding inside the max-width container |
| `spacing.md` (16px) | Padding on action footer row |
| `palette.text.primary` | Title typography color |
| `borderColor: 'divider'` | Top border separator on actions section (adapts to light/dark mode) |

The max-width constraint is applied via `<Box maxWidth={600}>` — hardcoded as an inline value. This is a **known risk**: the max-width is not configurable via props and violates Theme Sovereignty if considered a design token.

## 6. Interaction Design

**No built-in interactions.** The layout is a passive structural wrapper. All interactive elements (buttons, inputs, toggles) are provided by the parent via `children` and `actions` slots.

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| Semantic heading | ⚠️ Partial | `title` rendered as `<Typography variant="h5">` — provides `<h5>` element when title exists |
| Landmark regions | ❌ | No `role="form"` or `aria-label` on the layout wrapper |
| Form association | ❌ | No `id` or `aria-labelledby` — form fields in `children` must associate themselves |
| Focus management | ❌ | Not applicable (no interactive elements in layout itself) |
| Keyboard navigation | ❌ | Not applicable (passive wrapper) |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| Missing `children` | `children` prop omitted | TypeScript compilation error (required prop) |
| No `title` | Prop omitted | Header section not rendered — form appears without title |
| No `actions` | Prop omitted | Footer row not rendered — form appears without action buttons |
| Empty `children` | `<FormLayout></FormLayout>` | Empty flex column rendered — invisible to user |
| Single child | One ReactNode as children | Renders normally without extra spacing issues |
| Very long title | Title string exceeds container width | Text wraps naturally — no truncation |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|
| Time complexity | O(1) — single-pass render, no iteration |
| Re-render behavior | Re-renders only when `title`, `children`, or `actions` change |
| DOM size | Minimal: 3-4 Box elements + 1 Typography (when all slots occupied) |
| Conditional rendering | Header and footer slots produce zero DOM when omitted (short-circuit `&&`) |

## 10. Integration Points

| Integration | Details |
|---|---|
| **Parent page** | Any feature page requiring a form layout. Parent provides form content as `children` |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `FormLayout`, `FormLayoutProps` |
| **PageHeader template** | Often used together — `PageHeader` above, `FormLayout` below for page-level form structure |
| **Theme provider** | Requires MUI `ThemeProvider` ancestor for theme token resolution |
| **Language provider** | Not required — `title` is a pre-translated string prop from parent |

## 11. Open Questions

1. Should `maxWidth` be a configurable prop (currently hardcoded 600px)?
2. Should a `loading` prop be added to render skeleton placeholders while form data loads?
3. Should the actions footer be sticky at the bottom of the viewport for long forms?
4. Should `aria-label` or `role="form"` be added to the wrapper for accessibility?
5. Should the title support a `titleComponent` prop for rendering custom heading levels (h2, h3, etc.)?
6. Should a form-level validation summary slot be added as a fourth section?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
