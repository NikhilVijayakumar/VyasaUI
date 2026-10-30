# Design Tokens

Design tokens define the visual foundation: colors, spacing, and typography values that drive consistent rendering across all components.

## Spacing

Base unit: 8px (MUI standard)

> **Note:** The internal token value `0.5` = 4px = `0.5×` when the base unit is 8px. Sub-units remain valid for granular spacing.

| Token      | Value | Pixels |
| ---------- | ----- | ------ |
| `internal` | 0.5   | 4px    |
| `xs`       | 1     | 8px    |
| `sm`       | 1.5   | 12px   |
| `md`       | 2     | 16px   |
| `lg`       | 3     | 24px   |
| `xl`       | 4     | 32px   |
| `xxl`      | 6     | 48px   |
| `section`  | 8     | 64px   |
| `page`     | 12    | 96px   |

## Colors

### Brand

| Token | Value |
|-------|-------|
| Primary | `#5A60F5` |
| Secondary | `#8a8f98` |

### Background

| Mode | Base | Paper | Panel |
|------|------|-------|-------|
| Light | `#F5F5F7` | `#FFFFFF` | — |
| Dark | `#0e1015` | `#16181D` | `#1E2028` |

### Text

| Mode | Primary | Secondary |
|------|---------|-----------|
| Light | `#111318` | `#687076` |
| Dark | `#EDEDEF` | `#8A8F98` |

### Status

| Severity | Value |
|----------|-------|
| Error | `#ED5F74` |
| Warning | `#F5A623` |
| Success | `#34C759` |
| Info | `#5A60F5` |

## Typography

### Fonts

| Role | Font |
|------|------|
| Sans | Inter, system sans-serif |
| Mono | IBM Plex Mono, system monospace |

### Custom Variants

| Variant | Purpose |
|---------|---------|
| `monoBody`, `monoCaption` | Monospace text |
| `body2Medium`, `body2Bold` | Weighted body text |
| `captionBold` | Bold captions |
| `micro` | 10px uppercase badges |
| `splashTitle`, `splashSubtitle` | Display variants |

## Responsibilities

- Define the complete set of spacing, color, and typography values
- Serve as the single source of truth for visual primitives
- Enable consistent theme object construction for light and dark modes

## Non-Responsibilities

- Does not define component-level styles or overrides
- Does not handle theme switching or state management
- Does not implement responsive breakpoint values
- Does not define animation durations or easing curves

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| Base unit | 8px grid used for all spacing tokens (MUI standard) |
| Semantic tokens | Named values (`xs`, `sm`, `md`) mapped to multiplier of base unit |
| Color roles | Brand, background, text, and status color groups |
| Typography system | Font families and custom variants beyond defaults |

## Business Rules

1. **One source of truth** — Design tokens are the only source for spacing, color, and typography values; hardcoded values in components are not permitted
2. **Dark mode parity** — Every color category must define both light and dark variants; missing dark mode values are a spec gap
3. **Semantic uniqueness** — Token names must be unique across all categories; collisions cause silent overrides
4. **Base-unit scaling** — All spacing values must align to the 8px base unit grid; off-grid spacing is not permitted
5. **Token immutability** — Tokens are static reference values; runtime modifications must go through the theme layer, not token definitions

## States

- **Defined Set:** Tokens are static values — no runtime state transitions
- **Light/Dark Variants:** Each color category defines both light and dark mode values

## Edge Cases

- **Missing tokens**: Consumers referencing undefined tokens get no value at runtime
- **Token collision**: Semantic names must be unique across all token categories
- **Contrast accessibility**: Color tokens are not verified for WCAG contrast automatically
- **Dark mode color mapping**: Each color category must define both light and dark variants

## Error Conditions

- **Missing token** — Consumers referencing undefined token names receive no value
- **Token collision** — Duplicate semantic names across categories cause silent override
- **Missing dark variant** — Color categories missing dark-mode values render incorrect colors in dark mode

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing token | Add the missing token definition; verify all consumers use the correct token name |
| Token collision | Rename one of the colliding tokens to ensure semantic uniqueness across categories |
| Missing dark variant | Add dark-mode values for every color category; verify both modes produce distinct, valid palettes |

## Authorization

**Visibility:** Public — design tokens are a static reference; they do not have runtime access control. All components consume them without authentication requirements.

## User Journey

### Entry Conditions
A developer needs a color, spacing, or typography value while building a component.

### Primary Flow
The developer looks up the token name from this document, uses it in their component code, and the correct value is applied.

### Alternate Flows
A developer adds a new component and consults the token reference to ensure visual consistency with existing components.

### Failure Flows
A developer uses a token name that does not exist — the value resolves to undefined and no style is applied.

### Recovery Flows
The developer checks this document for the correct token name and fixes the reference.

### Exit Conditions
The component renders with the correct spacing, color, or typography value.

## Workflow

### Trigger
A developer needs to apply a spacing, color, or typography value while styling a component.

### Preconditions
The token set is defined and the theme object is configured with the mapped values.

### Steps
The developer selects a semantic token (e.g., md for spacing), applies it in the component, and the value resolves from the token definition.

### Outcomes
The component renders with the correct visual value consistent with the design system.

### Exceptions
The token name is misspelled or does not exist — no value is applied and the consumer must fall back to a hardcoded value.
### Completion Criteria

The component uses the correct token value and renders consistently with the rest of the application.

## Verification

- **Token existence test**: For every token documented, verify a corresponding definition exists in the theme object
- **Dark mode completeness test**: Enumerate every color token and verify both light and dark values are defined
- **Collision detection test**: Scan all token names for duplicates across spacing, color, and typography categories
- **Base-unit compliance test**: Verify every spacing token is a multiple of the 8px base unit or a valid sub-unit (0.5)

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [Theming System](./README.md) — consumes design tokens to build light/dark palettes

## Future Enhancements

- Automated WCAG contrast ratio verification for all color token pairings
- Responsive spacing tokens that scale with viewport breakpoints
- Motion tokens (durations, easings) for animation system integration

## Open Questions

- Should tokens include shadow/elevation values, or is that component-specific?
- How should brand tokens be versioned to support multi-brand deployments?
