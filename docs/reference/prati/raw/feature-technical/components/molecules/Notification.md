# Notification: Feature Technical

## 1. Technical Overview

Notification is a controlled toast-style molecule that composes MUI `Snackbar` and `Alert` into a single bottom-anchored notification unit. The parent owns visibility state via the `open` prop and receives `onClose` callbacks on dismiss or auto-hide. Supports severity-based styling (`success`, `info`, `warning`, `error`) and configurable auto-dismiss duration. The component is strictly controlled — it never manages its own open/close state.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes two MUI atoms (`Snackbar`, `Alert`) into one cohesive notification unit. No imports from organism or template tiers. Complies with `docs/raw/architecture/core/component-tiers.md:34-46`. |
| **Stateless UI** | Strict controlled component — `open` flows in via props, `onClose` flows out via callback. The component has zero internal visibility state. Complies with `docs/raw/architecture/invariants/stateless-ui.md:118-131`. |
| **Theme Sovereignty** | All visual values derive from MUI theme context. `Alert` severity maps to theme palette colors internally. `boxShadow: 3` uses MUI shadow scale. `borderRadius: 1` uses theme shape. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | No hardcoded user-facing strings in component. The `message` prop is caller-provided and pre-translated. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **MVVM Pattern** | Purely a View component — receives props, renders UI, emits `onClose`. No ViewModel involvement. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116` presentational component rules. |
| **Public API Surface** | Exported via barrel from `src/common/components/molecules/index.ts`. Uses `AlertColor` from `@mui/material` as severity type. Per `docs/raw/architecture/core/api-surface.md:40-46`. |
| **Dependency Safety** | Minimal surface — only `@mui/material` (`Snackbar`, `Alert`, `AlertColor`). No additional dependencies. Complies with `docs/raw/architecture/core/component-tiers.md:45-46`. |

## 3. Data Flow

```
Parent Component
  │
  ├── open: boolean ────────────────→ Notification
  ├── message: string ───────────────→ Notification
  ├── severity?: AlertColor ─────────→ Notification (default: 'info')
  ├── onClose: () => void ──────────→ Notification
  └── autoHideDuration?: number ─────→ Notification (default: 4000, null = persistent)
                                          │
                                          ├── Snackbar (anchorOrigin.bottom-center)
                                          │     └── Alert (severity, onClose)
                                          │           └── message text
                                          │
                                          └── onClose callback → Parent
                                                (triggered by: Alert close button
                                                 or Snackbar auto-hide timeout)
```

Data flows one-way: props in, callbacks out. The parent controls visibility via `open`. When the user clicks dismiss or the auto-hide timer expires, `onClose` fires upward. This forms a closed control loop: parent sets `open=true` → Notification renders → user dismisses or timer fires → `onClose` → parent sets `open=false`.

## 4. State Management

Notification has zero internal state. The `open` prop is the single source of truth for visibility. This is a deliberate architectural choice per the Controlled Component Pattern in `docs/raw/architecture/invariants/stateless-ui.md:118-131`:

```typescript
// Controlled component pattern — state ownership stays with consumer
function TextField({ value, onChange }: TextFieldProps) {
  return <input value={value} onChange={onChange} />;
}
```

The Snackbar component internally manages its own open/close animation transition (enter/exit), but this is a MUI implementation detail — the Notification molecule does not wrap it with any additional state layer.

| Prop | Type | Default | Ownership |
|---|---|---|---|
| `open` | `boolean` | required | Parent — controls visibility |
| `message` | `string` | required | Parent — provides text content |
| `severity` | `AlertColor` | `'info'` | Notification — default at destructuring |
| `onClose` | `() => void` | required | Parent — handles dismiss |
| `autoHideDuration` | `number \| null` | `4000` | Parent — controls timeout; `null` disables |

## 5. Styling Implementation

All styling derives from MUI's theme context with zero hardcoded values:

| Element | Styling | Theme Source |
|---|---|---|
| Snackbar | `anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}` | Fixed positioning via MUI Snackbar |
| Alert | `severity` prop maps to `theme.palette.success/info/warning/error` | MUI Alert internal theme mapping |
| Alert surface | `sx={{ boxShadow: 3, borderRadius: 1 }}` | `theme.shadows[3]`, `theme.shape.borderRadius` |
| Alert typography | `variant="body2"` | `theme.typography.body2` |

Per `docs/raw/architecture/core/theming.md:80-87`, all values derive from the theme pipeline. The `sx` prop references (`boxShadow: 3`, `borderRadius: 1`) are MUI theme shorthand paths — they resolve through the theme context, not as raw integers.

## 6. Interaction Design

| Interaction | Trigger | Behavior |
|---|---|---|
| Auto-dismiss | `autoHideDuration` timer expires (default 4s) | Snackbar fires `onClose` with `autoHide` reason; parent receives callback |
| Manual close | User clicks Alert close button (X) | Alert fires `onClose`; parent receives callback |
| Persistent notification | `autoHideDuration` is set to `null` | Snackbar's internal timer is disabled; stays visible until manual close |
| No interaction | `open=false` | Snackbar renders nothing — no DOM, no transition |

There is no swipe-to-dismiss, no keyboard dismiss (beyond the default Alert close button focusability), and no notification queue or stacking. Multiple rapid toggles of `open` may cause the Snackbar's enter/exit transition to flicker or skip.

## 7. Accessibility Implementation

- **Close button**: The MUI `Alert` component renders a close button that is keyboard-focusable and has an accessible label (via MUI's internal implementation).
- **Role**: `Snackbar` renders with `role="alert"` by default, ensuring screen readers announce the notification content when it appears.
- **Focus management**: When the Snackbar opens, focus is not automatically moved to it. This is intentional for non-intrusive notifications — the user's current focus context is preserved.
- **Live region**: MUI Snackbar uses `aria-live="assertive"` or `aria-live="polite"` depending on the variant, ensuring dynamic content announcements.
- **Animation**: Enter/exit transitions are CSS-based and respect `prefers-reduced-motion` via MUI's built-in support.

The Notification molecule does not override or augment any of MUI's accessibility defaults, which is compliant — it delegates accessibility to the underlying MUI components.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `open` not provided | TypeScript compile error — prop is required |
| `message` not provided | TypeScript compile error — prop is required |
| `onClose` not provided | TypeScript compile error — prop is required |
| `severity` not provided | Defaults to `'info'` at destructuring |
| `autoHideDuration` not provided | Defaults to `4000` at destructuring |
| `autoHideDuration=null` | Snackbar auto-hide disabled — persistent notification |
| `onClose` throws during execution | Error propagates to parent — no error boundary in Notification |
| Multiple rapid `open` toggles | Snackbar transition may flicker — no debounce or queue implemented |

Per `docs/raw/architecture/core/component-tiers.md:107`, the component has no error boundary. Errors in the `onClose` callback propagate to the parent component.

## 9. Performance Considerations

- **Render cost**: Single render pass. No `useState`, no `useEffect`, no `useMemo`, no `useCallback`.
- **Re-render scope**: Re-renders only when `open`, `message`, `severity`, or `autoHideDuration` change.
- **Animation cost**: Enter/exit transitions handled by MUI Snackbar internally via CSS transitions — no JavaScript animation frames.
- **Bundle size**: ~39 lines of source. Imports only `Snackbar`, `Alert`, `AlertColor` from `@mui/material`. No lazy loading needed.
- **DOM cost**: When `open=false`, Snackbar renders zero DOM (MUI handles unmounting on close). When open, max DOM depth is ~3 levels.
- **No notification queue**: Each Notification instance is standalone. Multiple simultaneous notifications require multiple instances managed by the parent.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { Notification, NotificationProps } from "prati"` via barrel, or directly from `@/common/components/molecules/Notification` |
| **Used by** | Any organism or page that needs to surface transient system feedback (success, error, info, warning) |
| **Pattern** | Controlled component — parent must hold `open` state and pass `onClose` to reset it |
| **Test file** | `src/common/components/molecules/Notification.test.tsx` (vitest, 5 tests, Snackbar/Alert mocked) |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports `Notification` and `NotificationProps` |
| **MUI dependencies** | `@mui/material` (`Snackbar`, `Alert`, `AlertColor`) |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | No `useDataState` or internal `useState` — parent owns visibility per `docs/raw/architecture/invariants/stateless-ui.md:118-131` |
| **Notification queue** | Not supported. Parent must orchestrate queuing if multiple notifications are needed. |

## 11. Open Questions

1. Should the component support notification queuing internally, or is it intentionally single-instance? (Current design says single-instance is deliberate — queue is consumer responsibility.)
2. Should `anchorOrigin` be configurable? (Current design hardcodes bottom-center as a deliberate UX choice per feature spec.)
3. Should the component accept an optional `action` slot (e.g., "Undo" button inside the notification)? (Currently out of scope per Non-Responsibilities.)
4. Should swipe-to-dismiss gesture be added for mobile/touch scenarios?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
