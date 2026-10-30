# Overview

Design tokens are the visual primitive layer of the design system: spacing multipliers, color roles (light + dark variants), and typography configuration. They are a static data set consumed by the theme object builder. No runtime state, no transitions.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | THEMING-002 |
| Feature Name | Design Tokens |
| Category | Visual Primitives |
| Priority | P0 |
| Dependencies | None (tokens are standalone data) |
| Future | WCAG-verification step in CI |

# User Goals

- No direct user-facing goal. Tokens are a developer primitive consumed by every component.

# User Journeys

Not applicable — tokens are not a user-facing feature. Developer journey: opens tokens definition → reads spacing/color/typography values → uses named tokens in component styles.

# Screen Inventory

No screen owns tokens. Every screen consumes them via CSS variable cascade.

# Interaction Design

Not applicable — tokens have no interactive surface.

# Form Design

Not applicable.

# UX State Design

| State | Description |
|---|---|
| Defined Set | Static key/value pairs. One set per mode (light/dark). No runtime transitions. |
| Light Variant | Each color token has a light-mode value. |
| Dark Variant | Each color token has a dark-mode value. |

Tokens do not transition between states; the theme object selects the active variant.

# Feedback Design

No feedback mechanisms — tokens are passive data.

# Navigation Design

Tokens do not participate in navigation.

# Responsive Design

Tokens define spacing in 4px-base units. Responsive breakpoint values are not token responsibilities (delegated to layout components).

| Token Unit | Value | Multiplier |
|---|---|---|
| Base | 4px | 1× |
| internal | 4px | 1× |
| xs | 8px | 2× |
| sm | 12px | 3× |
| md | 16px | 4× |
| lg | 24px | 6× |
| xl | 32px | 8× |
| xxl | 48px | 12× |
| section | 64px | 16× |
| page | 96px | 24× |

# Accessibility Design

| Token | Light | Dark | Contrast (light bg) | Contrast (dark bg) |
|---|---|---|---|---|
| Primary | #5A60F5 | #5A60F5 | ≥4.5:1 on white | ≥4.5:1 on dark bg |
| Text Primary | #111318 | #EDEDEF | ≥4.5:1 on light bg | ≥4.5:1 on dark bg |
| Text Secondary | #687076 | #8A8F98 | ≥4.5:1 on light bg | ≥4.5:1 on dark bg |
| Error | #ED5F74 | #ED5F74 | ≥4.5:1 on white | ≥4.5:1 on dark bg |
| Background L1 | #F5F5F7 | #0e1015 | — | — |
| Background L2 | #FFFFFF | #16181D | — | — |
| Background L3 | current | #1E2028 | — | — |

No hardcoded color values in components; all consumption via `var(--color-*)` CSS variables.

Color roles:

| Role | Tokens |
|---|---|
| Brand | Primary, Secondary |
| Background | L1, L2, L3 |
| Text | Primary, Secondary, Inverse |
| Status | Error (#ED5F74), Warning (#F5A623), Success (#34C759), Info (#5A60F5) |

# Localization Design

Tokens are numerals and hex values — no localisation required. Token names follow English `kebab-case` conventions consistently.

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Flat key/value object. No hierarchy, no inheritance. |
| Rule 3: Typography Leads | Typography token includes font families (Inter, IBM Plex Mono) + system fallbacks. |
| Rule 5: White Space is Feature | Spacing tokens are the singular source of layout spacing. |
| Color System | CSS variables only. Zero hardcoded colors in component files. |
| Accessibility | Each color token has light/dark values selected to meet 4.5:1; status colors meet contrast on both modes. |
| Localization | Hex values are locale-agnostic; token names are single English convention. |
| 8px grid | Spacing values are all multiples of 4px (base unit) and 8px: xs(8), sm(12), md(16), lg(24), xl(32), xxl(48), section(64), page(96). |

# Open Questions

- Should a token audit script be added to CI to verify every color has both light and dark values?
- Should status colors (error, warning, success, info) define separate light/dark variants or remain mode-agnostic?
