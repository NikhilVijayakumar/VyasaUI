# Organisms

**Tier:** Organisms — Complex UI Sections

## Overview

Organisms are complex UI sections composed of multiple molecules and atoms. They represent discrete, recognizable pieces of an interface with significant logic, state management, or data interactions.

## Definition

Organisms are complex UI sections composed of multiple molecules and atoms. They represent discrete, recognizable pieces of an interface with significant logic, state, or data interactions.

### Characteristics

- **Complex composition:** Multiple molecules and/or atoms
- **Significant state/logic:** Internal data processing or complex interactions
- **Data interactions:** May fetch, display, or manipulate data
- **Discrete sections:** Form recognizable interface pieces
- **Self-contained:** Complete functional units within a page

## Organism Components in Astra

The organism tier contains complex components including:

| Component            | Purpose                                                       | Complexity |
| -------------------- | ------------------------------------------------------------- | ---------- |
| `DataTable`          | Tabular data display with sticky header and custom cell rendering | High   |
| `FormLayout`         | Page-level form wrapper with title header and action footer   | Medium     |
| `DrawerComponent`    | Responsive side navigation drawer with feature-flag filtering | Medium     |
| `ToolbarComponent`   | Fixed-position top bar with navigation toggle and theme control | Low      |
| `FileViewerRouter`   | Extension-based dispatcher to specialized file viewers        | Medium     |
| `CsvViewer`          | Paginated CSV table with auto-delimiter detection             | High       |

## Classification Rules

A component qualifies as an **organism** if it:

1. Contains 3+ molecules OR multiple atom types
2. Has significant state management or data logic
3. May perform data fetching or API calls
4. Represents a discrete UI section
5. Is self-contained within a page context

## Anti-Patterns

### ❌ Organisms Doing Too Much

An organism managing user management, settings, notifications, file uploads, and analytics has too many responsibilities and should be split into multiple organisms.

### ❌ Organisms Should Be Molecules

A simple card with a value and label is a molecule, not an organism.

### ❌ Organisms With Layout

A component rendering a full page section with header and footer is a template, not an organism.

## Design Checklist

Before creating an organism, verify:

- [ ] Does it compose 3+ molecules or multiple atom types?
- [ ] Does it have significant state or data logic?
- [ ] Does it interact with data (fetch, display, manipulate)?
- [ ] Does it represent a discrete UI section?
- [ ] Is it self-contained within page context?
- [ ] Is it NOT just a larger molecule or a layout?

## Performance Considerations

- Organisms with large datasets should define how data volume affects rendering behavior
- Complex user interactions (sort, filter, paginate) should specify their behavioral outcomes in the feature spec

## Related Tiers

- **Composed from:** [Molecules](./molecules.md) + [Atoms](./atoms.md)
- **Composed into:** [Templates](./templates.md)

## Edge Cases

- **Organism-vs-Template boundary:** An organism that defines page layout structure should be a template instead
- **Single-use organisms:** Organisms designed for exactly one page context should be evaluated for refactoring
- **Performance-sensitive organisms:** Organisms with large or frequently-updated datasets must define how they remain responsive to user interactions
- **Empty data state:** Organisms that fetch data must handle loading, error, and empty states

## Responsibilities

- **Complex Assembly:** Assemble molecules and atoms into feature-complete UI sections
- **State Management:** Manage significant local state and data processing logic
- **Data Interaction:** Perform data fetching, manipulation, and display as needed
- **Section Completeness:** Form self-contained, discrete sections within a page layout

## Non-Responsibilities

- **Page Layout:** Organisms must not define overall page or section layout structure
- **Page Specificity:** Organisms must not be written for a single page context
- **Over-Simplification:** Organisms that compose only 1-2 atoms should be molecules

## Business Rules

1. **Complex composition required** — An organism must compose 3+ molecules or multiple atom types; simpler compositions should be molecules
2. **Data state handling** — Every organism that fetches or processes data must implement the full lifecycle: Idle, Loading, Error, Empty, Success
3. **Single discrete section** — Each organism represents exactly one discrete UI section; an organism attempting to serve multiple sections should be split
4. **Page-context agnostic** — Organisms must not depend on a specific page context; they should be reusable across pages
5. **Not a layout** — An organism must not define page layout structure; layout belongs to templates

## States

- **Idle** — Mounted, awaiting user interaction or data trigger
- **Loading** — Data fetching in progress
- **Error** — Fetch failed; error state displayed
- **Success** — Data loaded; full organism rendered
- **Empty** — Success with no data; empty state shown

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Loading | Data fetch or user interaction initiates a data operation |
| Loading | Success | Data fetch completes with results |
| Loading | Error | Data fetch fails with a network or API error |
| Loading | Empty | Data fetch completes with zero results |
| Success | Loading | User triggers a refresh or pagination action |
| Error | Loading | User triggers a retry |
| Empty | Loading | User triggers a refresh expecting new data |

## Error Conditions

- **Data fetch failure** — Network error or API rejection; organism must handle via error state
- **Missing required data** — Prop or context dependency is undefined at render time
- **Performance degradation** — Large datasets cause slow renders; organisms must define their maximum expected data volume and behavior at that threshold
- **Over-composition** — Too many responsibilities makes organism unmaintainable; should be split

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Data fetch failure | Ensure the organism transitions to Error state with a clear message and retry mechanism |
| Missing required data | Verify all required props and context dependencies are provided; add fallback handling for undefined values |
| Performance degradation | Implement virtualization, pagination, or lazy-loading for large datasets; document the data volume threshold |
| Over-composition | Split the organism into smaller, single-responsibility organisms and compose them in the template |

## Authorization

**Visibility:** Authenticated — organism-tier components form complex authenticated application sections; they are used within authenticated views and rely on authenticated data access.

## User Journey

### Entry Conditions
A developer is building a complex UI section that composes multiple molecules with significant state or data interactions.

### Primary Flow
The developer classifies the component as an organism using the rules — 3+ molecules or multiple atom types, significant state, data interactions — and places it in organisms/.

### Alternate Flows
A component that defines page layout structure is classified as a template instead.

### Failure Flows
An organism tries to do too much (multiple disparate responsibilities), becoming unmaintainable and violating single-purpose design.

### Recovery Flows
The developer splits the organism into smaller organisms, each with a single responsibility.

### Exit Conditions
The organism is classified, placed in organisms/, and composes molecules into a discrete UI section.

## Workflow

### Trigger
A developer needs to build a complex, data-driven UI section with multiple sub-components.

### Preconditions
The component assembles multiple molecules and atoms, manages state, and may perform data operations.

### Steps
The developer verifies against the design checklist, assigns the organism tier, places it in organisms/, and ensures it handles loading, error, and empty states.

### Outcomes
A self-contained complex UI section is ready for use within a template or page.

### Exceptions
The organism is actually a page layout — it is reclassified as a template.
### Completion Criteria

The organism passes the design checklist, is placed in the correct directory, and handles all data states.

## Verification

- **State lifecycle test**: Verify every organism that fetches data implements Loading, Error, Empty, and Success visual states
- **Reusability test**: Verify no organism is designed for a single page context; check for page-specific hardcoded references
- **Composition count test**: Verify every organism composes 3+ molecules or multiple distinct atom types
- **Layout boundary test**: Confirm no organism defines page-level layout structure (grid, flex on page shell, etc.)

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [Molecules tier](./molecules.md) — the components that organisms compose
- [Templates tier](./templates.md) — the next tier that arranges organisms into page layouts
- [Atomic Design Methodology](./README.md) — classification rules and decision flowchart

## Future Enhancements

- Performance monitoring dashboard for organism render times
- Lazy-loading pattern documentation for below-the-fold organisms
- Organism-level error boundary integration with standardized fallback UI

## Open Questions

- Should organisms own their data-fetching logic or receive data via props?
- How should organisms communicate sibling state changes without a shared parent?
- Is there a maximum composition depth before an organism should be split?
