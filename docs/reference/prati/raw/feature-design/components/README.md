# Overview

The component directory organises all UI components by atomic design tier: atoms → molecules → organisms → templates. Every component integrates with the theme system (CSS variable tokens) and the localisation library. The hierarchy enforces a one-way composition dependency — atoms never import molecules, molecules never import organisms.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-001 |
| Feature Name | Component Library Organisation |
| Category | Developer Infrastructure |
| Priority | P0 |
| Dependencies | Theme tokens, Localisation dictionary, Atomic Design rules |
| Future | Linting rule to enforce import direction |

# User Goals

- Developer goals only: locate a component quickly by its tier; understand composition boundaries; avoid circular dependency when building new components

# User Journeys

### Entry Conditions

- Developer needs a UI element for a feature
- Developer has read access to the component directory

### Primary Flow: Find component

1. Developer identifies the element type (button → atom, card → molecule, timeline → organism)
2. Developer navigates to the corresponding tier directory
3. Developer reads the component file or its doc
4. Developer imports the component into their feature code

### Alternate Flows

- **Unclassified component**: developer searches for a component not yet assigned a tier. Opens a pull request to add it to the correct directory.
- **Ambiguous tier**: developer opens an issue or consults the decision flowchart (atomic-design/README.md) to resolve.

### Failure Flows

- **Component not found**: developer builds a new component instead of duplicating existing ones. Pattern documented in atomic-design anti-patterns.
- **Cross-tier dependency discovered**: developer refactors to remove upward import (e.g., molecule importing organism).

### Recovery Flows

- **Wrong tier assignment**: component is moved to the correct directory; all import paths are updated in a single commit.
- **Deprecated component**: directory entry is marked `@deprecated` in JSDoc; consumers are notified via the deprecation path.

### Exit Conditions

- Component file is in the correct tier directory
- All imports point to valid sibling or downward-tier paths

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Identify element type | — | — |
| 2 | Navigate to `atoms/`, `molecules/`, etc. | Directory structure | File listing |
| 3 | Read component file | — | Source code + doc |
| 4 | Import component in feature code | Bundler resolves path | Import statement |

# Screen Inventory

No user-facing screens. The component directory is a developer-facing file tree.

| Directory | Tier | Composition |
|---|---|---|
| `atoms/` | Atom | No children; renders primitives |
| `molecules/` | Molecule | Composes 2+ atoms |
| `organisms/` | Organism | Composes molecules + atoms |
| `templates/` | Template | Layout of organisms |

# Interaction Design

Not applicable — no user-facing interactive surface.

# Form Design

Not applicable.

# UX State Design

| State | Meaning | Action |
|---|---|---|
| Organised | Component is in the correct tier directory | No action needed |
| Unclassified | Component exists but has no tier directory entry | Move to correct tier |
| Deprecated | Component is superseded | Update all references, mark `@deprecated` |

Transitions:

- Unclassified → Organised: developer moves file + updates imports
- Organised → Deprecated: deprecation notice added, replacement noted
- Deprecated → Organised: reversal via PR
- Organised → Unclassified: removal from tier (rare; likely accidental)

# Feedback Design

No user-facing feedback mechanism. Developer feedback comes from:
- Import resolution failures (bundler error)
- Linting violations (future eslint rule for import direction)
- Code review comments

# Navigation Design

The component tree is a filesystem hierarchy, not a navigational UI. Developers navigate via IDE sidebar, glob search, or `import` statements.

# Responsive Design

Not applicable — no viewport-dependent rendering.

# Accessibility Design

Not applicable to the organisational layer. Individual components (atoms, molecules, organisms) carry accessibility implementation.

# Localization Design

Directory names and file names are English `kebab-case`. Component-internal localisation is handled per-component via the locale dictionary.

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Four directories. One rule: import downward only. |
| Rule 3: Typography Leads | Components consume typography tokens; organisation does not override. |
| Rule 5: White Space is Feature | Spacing tokens enforced in components; organisation layer does not add layout. |
| Color System | Components reference CSS variables; organisation layer does not set colors. |
| Accessibility | Tier structure does not affect accessibility — each component implements its own. |
| Localization | File names are ascii; locale dictionary consumed inside components. |

# Open Questions

- Should a barrel `index.ts` be added per tier directory for named exports?
- Should the decision flowchart be encoded as a CLI tool that recommends a tier for a given component description?
