# Overview

Notification is a toast-style message that appears at the bottom-center of the viewport and auto-dismisses after a configurable duration. Supports four severity levels (success, info, warning, error). Controlled component pattern — parent owns visibility state and receives close callbacks.

# Feature Summary

- **Purpose**: Display temporary message at bottom-center with auto-dismiss
- **Responsibilities**: Toast at bottom-center; message with severity styling; auto-dismiss after configurable duration; fire callback on dismiss
- **Non-Responsibilities**: No notification queue/stacking; no persistence; no undo/action callbacks; no multiple simultaneous notifications; no custom positioning
- **Authorization**: Authenticated

# User Goals

| Goal | Description |
| ---- | ----------- |
| Acknowledge success | See success confirmation and continue workflow |
| Read error context | Read error message with error severity styling |
| Dismiss notification | Close notification manually before timer expires |
| Persistent review | Keep notification open until manually dismissed for critical messages |

# User Journeys

### Entry Conditions
Application event (API success, error, info update) triggers parent to set `open=true` with message, severity, and duration.

### Primary Flow
1. Parent sets `open=true` with message "Document saved", severity `success`, duration `4000`
2. Notification renders at bottom-center with green-styled background
3. Timer starts counting 4000ms
4. Timer expires; component fires `onClose` callback
5. Parent sets `open=false`; notification closes

### Alternate Flows
- **Persistent notification**: Parent sets `autoDismiss=null` — notification stays open until user clicks close button
- **Manual close**: User clicks close button before timer expires — `onClose` fires immediately
- **Warning severity**: Yellow/amber styling for warning messages; same auto-dismiss behavior
- **Error severity**: Red styling; same auto-dismiss behavior; risk: short duration may lose message

### Failure Flows
- **Missing `onClose` callback**: Parent omits required callback — close action throws; error propagates to parent
- **Rapid open/close toggles**: Multiple state changes in quick succession — visible flicker

### Recovery Flows
- Missing `onClose`: Parent must provide callback; runtime error if omitted
- Flicker: Parent should debounce or guard rapid visibility toggles

### Exit Conditions
Timer expires and `onClose` fires, or user manually closes and `onClose` fires.

| Journey | Description |
| ------- | ----------- |
| Auto-dismiss | Notification shows, timer runs, auto-closes after duration |
| Persistent | `autoDismiss=null`; stays until manual close |
| Manual close | User clicks close button before timer expires |
| Error notification | Red-styled notification for error messages |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| Toast overlay | Bottom-center fixed-position container rendered at viewport level |

# Interaction Design

| Interaction | Trigger | Behavior |
| ----------- | ------- | -------- |
| Dismiss | Click close button | Fires `onClose` callback; parent controls removal |
| Auto-dismiss | Timer reaches 0 | Fires `onClose` callback |
| Persistent visual | `autoDismiss=null` | Close button remains visible; no timer; no auto-dismiss |

# Form Design

No form fields. Component accepts props only — no user data entry.

# UX State Design

| State | User Experience | Trigger |
| ----- | --------------- | ------- |
| Closed | Nothing rendered; no DOM presence | `open=false` |
| Open | Toast visible at bottom-center with message and severity styling; close button present | `open=true` set by parent |
| Auto-dismissing | Toast visible; timer active background; close button still available | `open=true` with duration > 0 |
| Persistent | Toast visible; no timer; close button present; toast stays indefinitely | `open=true` with `autoDismiss=null` |

**Quality Checklist**: LOADING — not applicable; ERROR — error severity styling applied to message, not component state; EMPTY — Closed state (hidden).

# Feedback Design

| Event | Feedback | Mechanism |
| ----- | -------- | --------- |
| Notification appears | Toast slides in from bottom (or fades in) | CSS transition/animation triggered by `open=true` |
| Severity styling | Background color changes per severity level | CSS variable mapping: `success` → `--color-success-bg`, `warning` → `--color-warning-bg`, `error` → `--color-error-bg`, `info` → `--color-info-bg` |
| Auto-dismiss timer | No visible timer indicator per spec | Internal timer only |
| Close action | Toast slides out/fades out | `onClose` fires; parent sets `open=false` |
| Manual close | Same dismiss animation as auto-dismiss | Click handler fires `onClose` |

# Navigation Design

| Path | Behavior |
| ---- | -------- |
| App shell → Notification | Notification rendered at viewport root; positioned fixed bottom-center |
| Notification → parent | No navigation; fires `onClose` callback to parent |

Component does not affect URL, routing, or navigation state.

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop (≥768px) | Fixed-width toast (~400px max-width); centered bottom with 24px margin from bottom edge |
| Tablet (480–768px) | Same as desktop; width may reduce to 320px max |
| Mobile (≤480px) | Full-width toast with 16px horizontal margin; 16px from bottom edge; close button 44×44px |

# Accessibility Design

| Requirement | Implementation |
| ----------- | -------------- |
| Touch target | Close button minimum 44×44px |
| Focus-visible | Close button receives focus ring on keyboard navigation |
| Contrast | Text on severity backgrounds meets 4.5:1; error background `--color-error-bg` with white text |
| Role | `role="alert"` on toast container for screen reader announcement |
| Live region | `aria-live="polite"` for non-critical; `aria-live="assertive"` for error severity |
| Dismiss | Close button with `aria-label="Close notification"` |
| Keyboard | Tab to close button; Enter/Space to dismiss |
| Timing | Auto-dismiss respects `prefers-reduced-motion` — instant hide, no slide animation |

# Localization Design

| Key Pattern | Example | Scope |
| ----------- | ------- | ----- |
| `notification.close` | "Close notification" | ARIA label on close button |
| `notification.severity.success` | "Success" | Screen reader prefix for success toasts |
| `notification.severity.error` | "Error" | Screen reader prefix for error toasts |
| `notification.severity.warning` | "Warning" | Screen reader prefix for warning toasts |
| `notification.severity.info` | "Info" | Screen reader prefix for info toasts |

Message content is provided by parent via prop — not hardcoded. Severity prefixes used for screen reader context only.

# Design System Traceability

| Rule | Application |
| ---- | ----------- |
| Radical Simplicity | No queue, undo, action callbacks, custom positioning; single purpose: show then dismiss |
| Typography Leads | Message uses `--font-body`; severity communicated through background color and icon, not typography overload |
| White Space is Feature | 16px internal padding; adequate spacing around text for readability |
| Color System | Severity colors via CSS variables: `--color-success-bg`, `--color-info-bg`, `--color-warning-bg`, `--color-error-bg`; text `--color-on-severity` |
| Accessibility | `role="alert"`, `aria-live`, 44×44px close target, 4.5:1 contrast |
| Localization | Zero hardcoded strings; `notification.*` key convention |
| 8px Grid | Padding 16px; margin from bottom 24px desktop, 16px mobile (all multiples of 8) |
| Premium UI — Subtle Notifications | Bottom-anchored toast avoids blocking content; severity via subtle background tint |
| Quality Checklist | LOADING (N/A), ERROR (error severity), EMPTY (Closed state) |

# Open Questions

- Should error severity notifications have a longer default duration than success/info to account for user reading time?
- No icon indicator per severity in the current spec — is severity purely background-color-based?
- Should `aria-live` toggle between `polite` and `assertive` based on severity prop automatically?
