# Overview

Atomic design classification rules enforce consistent component composition. Each tier (atoms, molecules, organisms, templates) has single-responsibility boundaries, anti-patterns, and migration paths. The decision flowchart disambiguates cross-tier candidates.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-002 |
| Feature Name | Atomic Design Classification |
| Category | Developer Standards |
| Priority | P0 |
| Dependencies | Component directory (README.md), tier directories |
| Future | ESLint plugin to detect tier violations |

# User Goals

- Classify any new UI component into exactly one tier
- Identify violations in existing components via anti-pattern lists
- Resolve ambiguous classification using the decision flowchart

# User Journeys

### Entry Conditions

- Developer has a component to classify
- Developer has read access to the atomic design docs

### Primary Flow: Classify a component

1. Developer reads the tier definitions (atoms, molecules, organisms, templates)
2. Developer evaluates the component against the Single Responsibility Per Tier principle
3. Developer runs the decision flowchart: does it compose children? → molecules. Does it have complex state? → organisms. Is it a layout? → templates.
4. Developer places the component file in the chosen tier directory
5. Developer verifies import direction: component imports only from equal or lower tiers

### Alternate Flows

- **Ambiguous**: component fits multiple tiers. Developer opens a peer review discussion to decide classification. Temporary placement in the lower tier; upgrade later if justified.
- **Deprecated**: component has a superseding replacement. Mark `@deprecated` in JSDoc, add `deprecated/` alias in exports.

### Failure Flows

- **Circular dependency**: molecule imports organism → violates composition direction. Resolution: extract shared logic into atom, remove upward import.
- **Cross-tier component**: component spans tiers (e.g., a form that is both molecule and organism). Resolution: split into one molecule (input group) and one organism (form container).

### Recovery Flows

- **Wrong classification**: move file to correct tier, update all import paths, verify no broken references.
- **Anti-pattern detected**: refactor component to match tier rules (e.g., extract complex state from atom to organism).

### Exit Conditions

- Component placed in correct tier directory
- No upward imports to higher tier
- No anti-patterns from the tier checklist violated

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Read tier definitions | File system | Markdown docs |
| 2 | Evaluate component against criteria | — | — |
| 3 | Consult decision flowchart | — | — |
| 4 | Place file in `atoms/`, `molecules/`, etc. | File system | Component source |
| 5 | Verify import direction | Code review | Import statements |

# Screen Inventory

No screen owns classification rules. The docs are a developer resource at `components/atomic-design/`.

# Interaction Design

Not applicable.

# Form Design

Not applicable.

# UX State Design

| State | Definition | Transition |
|---|---|---|
| Classified | Component assigned to exactly one tier | → Ambiguous (if re-evaluated), → Unclassified (if moved out) |
| Ambiguous | Fits multiple tier definitions | → Classified (after resolution), → Unclassified (if split discarded) |
| Unclassified | No tier assignment | → Classified, → Ambiguous |

# Feedback Design

Developer feedback is peer-review based. No automated enforcement (future: lint rule).

| Violation | Detection | Resolution |
|---|---|---|
| Atom >5 props | Code review | Split compound component |
| Molecule >200 lines | Code review | Extract into organism |
| Organism >500 lines | Code review | Split into multiple organisms |
| Template with business logic | Code review | Move logic to organism |
| Upward import | Code review | Refactor or move component |
| Molecule with data fetching | Code review | Elevate to organism |

# Navigation Design

Classification system has no UI navigation. Documentation is structured as a tier hierarchy:

```
atomic-design/
  README.md        ← classification rules + flowchart
  atoms.md         ← atom-specific guidance
  molecules.md     ← molecule-specific guidance
  organisms.md     ← organism-specific guidance
  templates.md     ← template-specific guidance
```

# Responsive Design

Not applicable — classification rules are viewport-independent.

# Accessibility Design

Classification rules do not directly affect accessibility. Each tier's anti-patterns indirectly encourage a11y: atoms enforce semantic HTML per component, molecules compose accessible patterns, organisms maintain coherent focus order.

# Localization Design

All classification documentation is in English. Component names follow `kebab-case`. Documentation avoids locale-specific metaphors.

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Four tiers, one composition rule, one flowchart. |
| Rule 3: Typography Leads | Classification does not impose typography; tier components own font choices. |
| Rule 5: White Space is Feature | Spacing tokens used in components, not in tier classification. |
| Color System | Classification does not define color. |
| Accessibility | Tier rules encourage semantic HTML (atoms) and coherent focus (organisms). |

# Open Questions

- Should a `deprecated/` directory be created at each tier level, or should deprecated files remain in tier with `@deprecated` tag?
- Should the decision flowchart be published as a standalone Mermaid diagram for IDE preview?
