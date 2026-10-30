# Atoms

**Tier:** Atoms — Fundamental UI Primitives

## Overview

Atoms are the smallest, most fundamental UI elements in the Atomic Design system. They represent single visual primitives — such as status indicators, badges, and state displays — that serve as the foundational building blocks for all higher-tier components.

## Definition

Atoms are the smallest building blocks in the Atomic Design system. They represent single UI primitives that cannot be broken down further without losing meaning.

### Characteristics

- **Single responsibility:** One visual or behavioral primitive
- **No child components:** Do not render other components
- **Minimal props:** Typically 1-3 configuration options
- **No state logic:** Presentational only, no business logic
- **Composable:** Combine to form molecules

## Atom Components in Astra

| Component       | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `StatusDot`     | Visual status indicator (online/offline/error)       |
| `SeverityBadge` | Severity level display (info/warning/error/critical) |
| `LoadingState`  | Loading indicator with optional message              |
| `ErrorState`    | Error display with retry action                      |
| `EmptyState`    | Empty state display with optional illustration       |

## Classification Rules

A component qualifies as an **atom** if it:

1. Renders a single visual primitive
2. Accepts only presentation configuration (color, size, label)
3. Contains no other component imports
4. Has no internal state or lifecycle logic
5. Is used by multiple molecule/organism components

## Anti-Patterns

### ❌ Over-Complicated Atoms

A component with too many props (text, color, size, variant, icon, onClick, loading, disabled) suggests it should be a molecule, not an atom.

### ✅ Focused Atoms

A component with a single prop for its configuration value is a well-designed atom.

### ❌ Atoms With State

Atoms should not manage internal state. State management belongs in molecules or organisms.

## Design Checklist

Before creating an atom, verify:

- [ ] Does it render a single visual primitive?
- [ ] Does it have 3 or fewer props?
- [ ] Does it contain no child components?
- [ ] Does it have no internal state?
- [ ] Will multiple molecules/organisms use it?

## Related Tiers

- **Composes into:** [Molecules](./molecules.md)

## Edge Cases

- **Atom-vs-Molecule boundary:** A component with 4+ props or that composes one other component may be a molecule, not an atom
- **Style-only logic:** Minimal style computation (e.g. determining color from a tone prop) is acceptable; business logic or data transformation is not

## Responsibilities

- **Primitive Rendering:** Render a single visual primitive with consistent presentation
- **Configuration Surface:** Expose minimal, focused props for visual configuration
- **Reusability:** Serve as drop-in building blocks across molecules and organisms
- **Consistency:** Maintain uniform visual language across all atom instances

## Non-Responsibilities

- **Composition:** Atoms must not contain or render child components
- **Business Logic:** Atoms must not contain business logic or application state
- **Data Fetching:** Atoms must not perform API calls or data retrieval
- **Side Effects:** Atoms must not produce side effects outside rendering

## Business Rules

1. **Single visual primitive** — An atom renders exactly one visual primitive; composing multiple primitives makes it a molecule
2. **No child components** — Atoms must not contain or render other components; rendering another atom violates the single-primitive rule
3. **Prop limit** — Atoms must not exceed 3 configuration props; 4+ props should be evaluated as a molecule
4. **State prohibition** — Atoms must not manage internal state; state belongs in molecules or organisms
5. **Side-effect free** — Atoms must not produce side effects (analytics, logging, data mutation); rendering atoms is a pure function of their props

## States

- **Compliant** — Meets all atom criteria (1-3 props, no children, no state, no side effects)
- **Borderline** — 4+ props; should be evaluated as potential molecule
- **Degraded** — Contains internal state, business logic, or component imports

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Compliant | Borderline | Prop count increases beyond 3 |
| Compliant | Degraded | Internal state or logic added |
| Borderline | Compliant | Props reduced to 3 or fewer |
| Borderline | Degraded | State or logic added to a borderline atom |
| Degraded | Compliant | Logic extracted to parent; atom returns to presentational-only |

## Error Conditions

- **Invalid prop combination** — Mutually exclusive or contradictory props (e.g. error + success simultaneously)
- **Missing required prop** — Atom renders incorrectly or not at all if required props are omitted
- **Wrong value** — Incorrect value renders incorrect visual state

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Invalid prop combination | Validate prop values before rendering; use type checking or runtime guards to prevent incompatible combinations |
| Missing required prop | Ensure the calling component provides all required props; add default values for optional props to maintain rendering |
| Wrong value | Validate the prop value against the expected set of values; fall back to a safe default for unrecognized values |

## Authorization

**Visibility:** Public — atom components are building blocks available for composition across all tiers; no access restrictions apply.

## User Journey

### Entry Conditions
A developer has a simple UI primitive (status dot, badge, indicator) that needs to be classified.

### Primary Flow
The developer checks the atom characteristics and classification rules — single responsibility, no child components, minimal props, no state — and places it in the atoms directory.

### Alternate Flows
A component has 4+ props or minimal composition — the developer re-evaluates whether it should be a molecule instead.

### Failure Flows
An atom contains internal state or business logic, violating the single-responsibility principle and causing maintenance issues.

### Recovery Flows
The developer extracts state and logic into a parent molecule or organism, leaving the atom presentational.

### Exit Conditions
The atom is classified, placed in atoms/, and used by at least one molecule or organism.

## Workflow

### Trigger
A developer creates or classifies a new fundamental UI primitive.

### Preconditions
The component meets the criteria — single visual primitive, no child components, minimal props, no state.

### Steps
The developer verifies against the design checklist, confirms it is an atom, places it in atoms/, and documents it.

### Outcomes
A reusable primitive is available for molecules and organisms to compose.

### Exceptions
The component has more than 3 props — the developer considers if it should be a molecule.
### Completion Criteria

The atom passes the design checklist and is placed in the correct directory.

## Verification

- **Prop count test**: Verify every atom component in the library has 3 or fewer configuration props
- **Child component test**: Audit atom source files; verify no atom imports or renders another component
- **State detection test**: Verify no atom uses internal state management (useState, internal variables with lifecycle)
- **Side-effect audit**: Confirm no atom contains analytics calls, mutation logic, or side-effect-producing code

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [Molecules tier](./molecules.md) — the next tier that composes atoms
- [Atomic Design Methodology](./README.md) — classification rules and decision flowchart

## Future Enhancements

- Atom component generator CLI for scaffolding new primitives
- Visual regression tests for each atom in light and dark mode

## Open Questions

- Should atoms support style override props, or would that violate the minimal-props principle?
- Is a size scale (sm/md/lg) acceptable on atoms, or does that invite scope creep?
