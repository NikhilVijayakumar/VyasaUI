# Authorization Model

Cross-cutting permission rules for feature visibility and access control.

## Purpose

Authorization defines who can see and interact with features. This document specifies the visibility tiers used across all feature specifications and the rules for determining which tier applies.

## Core Concepts

### Visibility Tiers

| Tier | Meaning | Examples |
|------|---------|----------|
| **Public** | Visible and interactive for all users regardless of authentication | Theme toggle, language selector, hero section |
| **Authenticated** | Visible and interactive only for authenticated users | Data tables, form layouts, file viewers |
| **Internal** | Developer-facing resource; not rendered in end-user UI | Component classification docs, atomic design guides |

### Rules

1. A feature's visibility is the minimum tier of the data it displays
2. Components that wrap authenticated data inherit authenticated visibility
3. Utility/configuration features with no data exposure may be Internal

## Responsibilities

- Define the visibility tier system (Public / Authenticated / Internal)
- Specify inheritance rules for composed features

## Non-Responsibilities

- Does not define authentication mechanisms or user identity
- Does not manage session state or token validation
- Does not enforce permissions at runtime — specification only

## Business Rules

1. **Minimum tier inheritance** — A composed feature's visibility is the minimum (most restrictive) tier of any data it displays or contains
2. **Visibility declared at feature level** — Every feature document must declare exactly one visibility tier; implicit or inherited visibility by default is not acceptable
3. **Composition propagates restriction** — A Public atom composed inside an Authenticated organism inherits Authenticated at the page level; Public is not preserved through composition
4. **Specification only** — Authorization tiers define WHAT visibility should be; runtime enforcement is the implementation's responsibility, not the spec's

## States

- **Defined** — Visibility tiers specified; rules documented
- **Applied** — All features declare a visibility tier

## Edge Cases

- **Composed component**: A Public atom inside an Authenticated organism inherits Authenticated at the page level
- **Mixed visibility**: A template with Public and Authenticated slots runs at Authenticated

## Error Conditions

- **Missing visibility declaration** — Feature document does not declare a visibility tier
- **Unknown tier value** — Feature declares a tier that is not one of the three defined tiers (Public / Authenticated / Internal)
- **Contradictory composition** — A component declares Public but is only used within Authenticated contexts

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing visibility declaration | Add a visibility tier to the feature document matching its data exposure |
| Unknown tier value | Correct the tier to one of Public, Authenticated, or Internal |
| Contradictory composition | Update the component's declared tier to match its actual usage context |

## Verification

- **Coverage test**: Scan all feature documents; verify every one declares a valid visibility tier
- **Inheritance test**: For every composed component, verify the effective visibility matches the minimum-tier rule
- **Unknown tier test**: Verify no feature document declares a tier outside the defined set (Public / Authenticated / Internal)

## See Also

- [Glossary](./glossary.md) — concept-to-feature ownership map
