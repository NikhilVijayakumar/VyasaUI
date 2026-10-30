# Molecules

**Tier:** Molecules — Composed Functional Units

## Overview

Molecules are self-contained components that compose two or more atoms into meaningful, reusable functional units. They bridge the gap between primitive elements and complex UI sections, each serving a single clear purpose.

## Definition

Molecules are self-contained components composed of 2+ atoms. They represent single functional units with a clear purpose, combining primitives into meaningful UI elements.

### Characteristics

- **Composed of atoms:** Built from 2+ atom components
- **Single functional purpose:** One clear use case
- **Self-contained:** No external data dependencies
- **Reusable:** Used across multiple organisms
- **Presentational or light state:** Props-driven or minimal local state

## Molecule Components in Astra

| Component         | Purpose                             | Composition               |
| ----------------- | ----------------------------------- | ------------------------- |
| `Card`            | Container with consistent styling   | Container, text elements  |
| `Notification`    | Alert/message display               | Status badge, text        |
| `TrendMetricCard` | Metric display with trend indicator | Status dot, text elements |
| `ImageViewer`     | Image file display                  | Container, image element  |
| `MdViewer`        | Markdown file display               | Container, text elements  |
| `JsonViewer`      | JSON file display                   | Container, text elements  |

## Classification Rules

A component qualifies as a **molecule** if it:

1. Composes 2+ atoms
2. Has a single, clear functional purpose
3. Contains no significant data fetching
4. Manages only local UI state (if any)
5. Is self-contained (no external context dependencies)

## Anti-Patterns

### ❌ Data Fetching in Molecules

Molecules should not fetch data. Data fetching belongs in organisms.

### ❌ Complex State Management

Complex state belongs in organisms. A component managing expanded/selected/filter state is organism-level complexity.

### ❌ Side Effects

Side effects like analytics tracking belong in hooks or organisms, not molecules.

## Design Checklist

Before creating a molecule, verify:

- [ ] Does it compose 2+ atoms?
- [ ] Does it have a single, clear functional purpose?
- [ ] Does it contain no data fetching?
- [ ] Does it manage only local UI state (if any)?
- [ ] Is it self-contained with no external context dependencies?

## Related Tiers

- **Composed from:** [Atoms](./atoms.md)
- **Composes into:** [Organisms](./organisms.md)

## Edge Cases

- **Molecule-vs-Organism boundary:** A component that performs data fetching or manages significant state is an organism, not a molecule
- **Single-atom molecules:** A component wrapping a single atom with no added behavior should remain an atom
- **Minimal state:** Local UI state (e.g. open/closed toggle) is acceptable in molecules; async state or external data is not

## Responsibilities

- **Composition:** Compose atoms into cohesive, purpose-driven functional units
- **Single Purpose:** Maintain one clear use case per molecule component
- **Props-Driven Interface:** Expose configuration through props rather than internal logic
- **Self-Containment:** Operate without external data or context dependencies

## Non-Responsibilities

- **Data Fetching:** Molecules must not fetch or manage external data
- **Complex State:** Molecules must not manage complex state beyond minimal local UI state
- **Side Effects:** Molecules must not produce side effects such as analytics tracking or logging
- **Page Layout:** Molecules must not define page-level layout or structure

## Business Rules

1. **Composes 2+ atoms** — A molecule must compose two or more atoms; a component wrapping a single atom with no added behavior should remain an atom
2. **Single functional purpose** — Each molecule serves exactly one clear use case; molecules with multiple purposes should be split
3. **No data fetching** — Molecules must not fetch or manage external data; data fetching belongs in organisms
4. **No complex state** — Molecules may manage minimal local UI state (open/closed toggle) but not async state, external data, or significant business logic
5. **Self-contained** — Molecules must not depend on external context (theme and localization are system-wide, not external dependencies)

## States

- **Compliant** — Composes 2+ atoms, single purpose, no data fetching, self-contained
- **Borderline** — Wraps single atom with minimal added behavior; consider keeping as atom
- **Degraded** — Contains data fetching, complex state, or side effects; should be promoted to organism

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Compliant | Borderline | Atom count drops to one with no added behavior |
| Compliant | Degraded | Data fetching or complex state management added |
| Borderline | Compliant | A second atom composed in; behavior added beyond single wrapper |
| Degraded | Compliant | Data fetching and state extracted to an organism parent |

## Error Conditions

- **Missing composed atom** — Required atom is not rendered or receives invalid props
- **Invalid content type** — Molecule designed for specific data shape receives incompatible input

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing composed atom | Ensure all required atoms are imported and rendered; verify prop contracts between molecule and its atoms |
| Invalid content type | Validate input data before passing to the molecule; use type guards or runtime validation |

## Authorization

**Visibility:** Public — molecule components are reusable UI building blocks available for composition across all tiers; no access restrictions apply.

## User Journey

### Entry Conditions
A developer has a component that composes multiple atoms into a single functional unit.

### Primary Flow
The developer checks the molecule characteristics — composed of 2+ atoms, single purpose, self-contained, no data fetching — and places it in the molecules directory.

### Alternate Flows
A component wraps a single atom with no added behavior — it remains an atom instead.

### Failure Flows
A molecule fetches data or manages complex state, blurring the boundary with organisms and creating maintenance confusion.

### Recovery Flows
The developer promotes the component to an organism, moving data-fetching logic out of the presentation layer.

### Exit Conditions
The molecule is classified, placed in molecules/, and consumed by organisms as needed.

## Workflow

### Trigger
A developer combines atoms into a cohesive functional unit (card, notification, viewer).

### Preconditions
The component composes 2+ atoms and has a single clear purpose.

### Steps
The developer verifies the component meets molecule criteria, confirms it does not fetch data, places it in molecules/, and documents it.

### Outcomes
A self-contained reusable unit is available for organisms to compose into sections.

### Exceptions
The component has complex state or data fetching — it is promoted to organism tier.
### Completion Criteria

The molecule passes the design checklist and is placed in the correct directory.

## Verification

- **Atom composition test**: Verify every molecule composes 2+ distinct atoms; flag single-wrapper components as potential atoms
- **Data fetching audit**: Verify no molecule contains network calls, API requests, or external data access
- **State complexity test**: Verify no molecule manages async state, external subscriptions, or complex business logic
- **Purpose uniqueness test**: Verify no two molecules serve the same functional purpose

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [Atoms tier](./atoms.md) — the primitives that molecules compose
- [Organisms tier](./organisms.md) — the next tier that composes molecules
- [Atomic Design Methodology](./README.md) — classification rules and decision flowchart

## Future Enhancements

- Compound component pattern for molecules with multiple composition slots
- Accessibility audit checklist specific to molecule-level interactions
- Responsive variants for molecules that adapt layout at breakpoints

## Open Questions

- Should molecules with 3+ atom compositions be automatically promoted to organisms?
- Is there a performance budget (lines of code, prop count) enforced for molecules?
