# Templates

**Tier:** Templates — Page-Level Layouts

## Overview

Templates define page-level layout structures and composition rules. They arrange organisms into cohesive page layouts without containing page-specific content, business logic, or data dependencies.

## Definition

Templates define the structure and composition rules for page-level layouts. They arrange organisms into cohesive pages, establishing how UI sections fit together without containing page-specific content.

### Characteristics

- **Layout focused:** Define structure, not content
- **Composition rules:** Specify how organisms are arranged
- **No business logic:** Layout logic only
- **Reusable layouts:** Multiple pages share the same template
- **Content slots:** Accept content via composition (children)

## Template Components in Astra

| Component      | Purpose                 | Layout Pattern   |
| -------------- | ----------------------- | ---------------- |
| `PageHeader`   | Page title and actions  | Vertical stack   |
| `SummaryPanel` | Summary metrics display | Grid layout      |
| `HeroSection`  | Hero/intro section      | Centered content |

**Note:** File viewers (FileViewerRouter, CsvViewer, JsonViewer, ImageViewer, MdViewer) are organisms/molecules, not templates.

## Classification Rules

A component qualifies as a **template** if it:

1. Defines page or section structure
2. Arranges organisms into layout
3. Contains no business logic or data fetching
4. Uses children prop or slots for content
5. Is reusable across multiple pages

## Anti-Patterns

### ❌ Templates With Content

A template with hard-coded content or data-specific references is a page, not a template.

### ❌ Templates With Business Logic

Data fetching, context dependencies, and state management belong in pages or organisms, not templates.

### ❌ Page-Specific Templates

A template designed for a single page should be re-evaluated. Make organisms, then compose in pages.

## Template vs Organism Decision

| Question                            | Template | Organism |
| ----------------------------------- | -------- | -------- |
| Does it define layout structure?    | ✓        |          |
| Does it arrange multiple organisms? | ✓        |          |
| Does it contain business logic?     | ✗        |          |
| Does it fetch or manipulate data?   | ✗        |          |
| Is it reusable across pages?        | ✓        |          |

## Design Checklist

Before creating a template, verify:

- [ ] Does it define page or section structure?
- [ ] Does it arrange organisms into layout?
- [ ] Does it contain no business logic or data fetching?
- [ ] Does it use children prop or slots for content?
- [ ] Is it reusable across multiple pages?

## Layout Patterns

### Vertical Stack

Content stacked vertically with consistent spacing.

### Grid Layout

Content arranged in a responsive grid with auto-fit columns.

### Conditional Layout

Routes to different content renderers based on input type (e.g., file extension).

## Related Tiers

- **Composed from:** [Organisms](./organisms.md)
- **Used by:** Page components

## Tier Summary

Templates complete the Atomic Design hierarchy:

```
Atoms → Molecules → Organisms → Templates
  ↓        ↓          ↓           ↓
Primitives Functional  Complex    Layout
            Units       Sections
```

## Edge Cases

- **Template-vs-Organism boundary:** A template with specific content or business logic should be downgraded to an organism
- **Single-page templates:** A template used by only one page component should be evaluated — consider merging into the page
- **Nested templates:** Templates should not render other templates; compose organisms only
- **Empty slot states:** Templates with optional children slots should handle missing children gracefully
- **Responsive breakpoints:** Templates should define layout breakpoints; organisms and molecules should not

## Responsibilities

- **Layout Definition:** Define reusable page and section layout structures
- **Organism Arrangement:** Arrange organisms into cohesive, structured compositions
- **Content Slots:** Provide composition slots via children props or named slots
- **Reusability:** Support multiple pages sharing the same layout template

## Non-Responsibilities

- **Content:** Templates must not contain page-specific content or hard-coded data
- **Business Logic:** Templates must not contain business logic or application state
- **Data Fetching:** Templates must not perform data fetching or API calls
- **Page Specificity:** Templates must not be designed for a single page only

## Business Rules

1. **Layout only** — A template defines structure, not content; hardcoded content or data-specific references make it a page, not a template
2. **No business logic** — Templates must not contain business logic, state management, or data fetching
3. **Slot-based composition** — Templates must use children props or named slots for content injection; content never appears inline in the template definition
4. **Reusable across pages** — A template must be usable by two or more pages; single-page components should be organisms, not templates
5. **No nested templates** — Templates must not render other templates; compose organisms only

## States

- **Empty** — Template rendered with no children or empty slots; renders layout shell only
- **Populated** — Template rendered with organisms/molecules in content slots
- **Responsive** — Layout adapts to viewport breakpoints defined in the template

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Empty | Populated | Children or organisms are provided into content slots |
| Populated | Empty | All slot content is removed or unmounted |
| Populated | Responsive | Viewport width crosses a defined breakpoint threshold |
| Empty | Responsive | Template mounts with no children on a narrow viewport |

## Error Conditions

- **Missing children** — Template with all optional slots renders empty layout
- **Invalid slot arrangement** — Organisms placed in wrong slots cause layout breakage
- **Responsive breakpoint mismatch** — Template defines breakpoints inconsistent with organism content requirements
- **Business logic leak** — Data fetching or state management accidentally added to template

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing children | Provide default empty state for each slot; render layout shell gracefully |
| Invalid slot arrangement | Verify slot contracts; ensure organisms match expected composition types |
| Responsive breakpoint mismatch | Align template breakpoints with the content requirements of the organisms it arranges |
| Business logic leak | Extract business logic to the consuming page or organism; keep template as pure layout |

## Authorization

**Visibility:** Internal — template components define page-level layout structure; they are developer-facing layout primitives used within authenticated application pages.

## User Journey

### Entry Conditions
A developer needs a reusable page-level layout structure for organizing organisms.

### Primary Flow
The developer defines a template with layout structure, content slots for organisms, and no business logic, then places it in templates/.

### Alternate Flows
A template that becomes page-specific or gains business logic is reclassified as an organism.

### Failure Flows
A template contains hardcoded content or data fetching, violating its role as a pure layout definition.

### Recovery Flows
The developer removes business logic and content, converting it to proper slot-based composition, or downgrades it to an organism.

### Exit Conditions
The template is classified, placed in templates/, and used by multiple pages with different content.

## Workflow

### Trigger
A developer identifies a page layout pattern that recurs across multiple pages.

### Preconditions
The component defines layout structure, arranges organisms, and uses slot-based composition.

### Steps
The developer verifies against the design checklist, confirms no business logic or data fetching, places it in templates/, and documents the slot API.

### Outcomes
A reusable layout template is available for consistent page composition.

### Exceptions
The template is designed for a single page — the developer evaluates whether it should be an organism instead.
### Completion Criteria

The template passes the design checklist, is placed in the correct directory, and is usable by multiple pages.

## Verification

- **Content-free test**: Verify no template contains hardcoded content, data references, or page-specific strings
- **Business logic audit**: Confirm no template contains state management, data fetching, or business logic
- **Slot-based composition test**: Verify every template uses children/slot props for content; no inline content in template source
- **Reusability test**: Verify every template is referenced by 2+ distinct page contexts

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [Organisms tier](./organisms.md) — the components that templates arrange
- [Atomic Design Methodology](./README.md) — classification rules and decision flowchart

## Future Enhancements

- Template composition API — named slot components for stricter layout contracts
- Responsive template variants for mobile, tablet, and desktop viewports
- Layout testing utilities to verify template slot placement across breakpoints

## Open Questions

- Should templates support different layout variants for hydration optimization?
- How should nested templates (template within a template) be classified?
- Is there value in a template registry that maps routes to template components?
