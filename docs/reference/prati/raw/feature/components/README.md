# Component Library

The UI component library is organized by atomic design methodology into four tiers.

## Tier Overview

| Tier | Purpose | Components |
|------|---------|------------|
| **Atoms** | Small, reusable primitives representing basic states | StatusDot, SeverityBadge, LoadingState, ErrorState, EmptyState |
| **Molecules** | Composed components combining atoms for specific UI patterns | Card, Notification, TrendMetricCard, ImageViewer, MdViewer, JsonViewer |
| **Organisms** | Complex UI sections composed of molecules and atoms | DataTable, FormLayout, DrawerComponent, ToolbarComponent, FileViewerRouter, CsvViewer |
| **Templates** | Page structure components | PageHeader, SummaryPanel, HeroSection |

## Responsibilities

- Organize all UI components by atomic design tier
- Enable consistent composition patterns
- Integrate with theme and localization systems

## Non-Responsibilities

- Does not define application-level routing or page composition
- Does not manage global application state
- Does not implement domain-specific business logic

## Core Concepts

- **Atomic Design**: Components organized into Atoms → Molecules → Organisms → Templates hierarchy
- **Theme Integration**: All components adapt to light/dark theme
- **Localization Ready**: Components display translated text based on active language

## Business Rules

1. **Composition direction** — Components may only reference components at their own tier or below (atoms compose into molecules, molecules into organisms, organisms into templates); reverse references are not permitted
2. **Tier assignment before use** — Every component must be assigned to exactly one atomic tier before it is referenced by another component; unclassified components are not composable
3. **Single home per component** — A component belongs to exactly one tier directory; duplicate entries across tiers are not permitted
4. **Theme and localization participation** — Every component must participate in the active theme and language; components that ignore theme or locale are not permitted in the library
5. **Tier migration requires reference updates** — Moving a component between tiers requires updating all references in higher-tier components simultaneously

## States

- **Organized** — All components correctly filed by atomic tier
- **Unclassified** — New component exists but not assigned to a tier
- **Deprecated** — Component superseded by newer version

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Unclassified | Organized | Developer assigns component to a tier per atomic design methodology |
| Organized | Deprecated | Component is superseded by a newer implementation |
| Deprecated | Organized | Deprecated component is revived or replaced in the same tier |
| Organized | Unclassified | Component is moved between tiers pending re-review |

## Edge Cases

- **Cross-Tier Components**: A component that could logically fit multiple tiers; use the Atomic Design flowchart to resolve
- **Third-Party Wrappers**: External component wrappers that need custom tier assignment based on their behavioral complexity
- **Tier migration**: A component promoted or demoted to a different tier; all references in higher-tier components must be updated simultaneously to avoid inconsistency
- **Circular tier dependency**: A component in a lower tier references a component in a higher tier; this violates the composition direction and must be resolved by restructuring

## Error Conditions

- **Cross-tier dependency violation** — A lower-tier component depends on a higher-tier component, creating a composition direction that violates atomic design ordering
- **Unclassified component** — A component is added to the library without tier assignment, making it undiscoverable and inconsistently composed

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Cross-tier dependency violation | Move the lower-tier dependency up to the correct tier or refactor the higher-tier component to remove the reverse reference |
| Unclassified component | Run the atomic design classification flowchart and assign the component to the correct tier directory |

## Authorization

**Visibility:** Internal — the component library is a developer-facing resource; all contributors may browse, compose, and classify components without access restrictions.

## User Journey

### Entry Conditions
A developer needs a UI component and consults the component library to find the right one.

### Primary Flow
The developer identifies the atomic tier (atom/molecule/organism/template) that matches the component need, navigates to that directory, and reads the component doc.

### Alternate Flows
A developer has an existing component they want to classify and uses the atomic design methodology doc and flowchart to determine the correct tier.

### Failure Flows
A developer imports a component from the wrong tier directory, causing a build failure due to cross-tier dependency violations.

### Recovery Flows
The developer moves the component to the correct tier directory and updates the import paths.

### Exit Conditions
The developer finds the component and integrates it into their feature, or classifies a new component correctly.

## Workflow

### Trigger
A developer needs to find or classify a UI component.

### Preconditions
The component library is organized by atomic tiers and each tier directory exists.

### Steps
The developer identifies the component need, consults the tier overview, navigates to the appropriate directory, and reads the component specification.

### Outcomes
The developer understands which component to use or where to place a new component.

### Exceptions
A component could fit multiple tiers — the developer uses the atomic design flowchart to resolve the ambiguity.
### Completion Criteria

The developer locates the correct component or assigns the new component to the correct tier.

## Verification

- **Composition direction test**: Audit every component's imports; verify no lower-tier component imports from a higher tier
- **Tier assignment audit**: Verify every component file exists in exactly one tier directory (atoms/, molecules/, organisms/, templates/)
- **Theme participation test**: Random-sampling — verify 3 components from each tier participate in theme context
- **Localization participation test**: Random-sampling — verify 3 components from each tier use translation keys for user-facing strings

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [Atomic Design Methodology](./atomic-design/README.md) — classification rules and decision flowchart
- [Template System](../templates/README.md) — Handlebars server-side HTML templates (separate from UI component templates)
- [Application Rendering Workflow](../workflows/application-rendering.md) — rendering pipeline for component composition

## Atomic Design Methodology

For detailed methodology on component classification and design principles, see [Atomic Design](./atomic-design/README.md).
