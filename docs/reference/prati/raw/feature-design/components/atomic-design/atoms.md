# Overview

Atoms are the smallest, most fundamental UI elements. Each atom renders exactly one primitive (a color, a shape, a label). An atom has no child components of any tier, accepts minimal props, and contains no complex state or side effects. Examples: Button, Icon, Badge, StatusIndicator.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-003 |
| Feature Name | Atoms Tier |
| Category | Component Classification |
| Priority | P0 |
| Dependencies | Design tokens (spacing, color, typography) |
| Gate | Props ≤ 5; zero child components; zero effect hooks |

# User Goals

- Render a single visual primitive with consistent styling
- Compose into molecules without leaking internal state

# User Journeys

### Entry Conditions

- Developer needs a basic primitive (button, badge, icon)
- Component accepts <6 props and renders no children

### Primary Flow: Create an atom

1. Developer creates a file in `components/atoms/`
2. Component receives props (≤5)
3. Component applies design tokens via CSS variables
4. Component returns a single styled element
5. Developer exports the named function

### Alternate Flows

- **Compound shape**: atom needs multiple sub-elements → evaluate if it is a molecule. If sub-elements are purely decorative (e.g., icon + badge overlap), keep as atom with wrapper `<span>`.

### Failure Flows

- **Props >5**: component likely does too much. Split into smaller atoms or compose as molecule.
- **useEffect / useState**: atom with state or side effects should be elevated to molecule or organism.
- **Children prop**: atom that renders `{children}` is a container, not a primitive. Reclassify as molecule.

### Recovery Flows

- **Atom grows too large**: extract compound logic → promote to molecule or organism. Original atom remains as a dependency.

### Exit Conditions

- File placed in `components/atoms/<name>.tsx`
- Exports ≤1 named component
- Props count ≤5
- No hooks from React (useState, useEffect, useReducer, useContext)
- No child component imports

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Create file in `atoms/` | File system | `.tsx` file |
| 2 | Define props interface (≤5 keys) | TypeScript | Props type |
| 3 | Apply tokens via `var(--color-*)` | CSS cascade | Style rules |
| 4 | Return single element | React render | DOM node |
| 5 | Export component | Module system | Named export |

# Screen Inventory

Atoms render within molecules and organisms. No screen is composed solely of atoms.

| Atom | Renders On |
|---|---|
| Button | Molecule (FormInput, Card), Organism (DataTable) |
| Badge | Molecule (MetricDisplay, Notification) |
| StatusIndicator | Molecule (TimelineItem, FileTreeItem) |
| Icon | Molecule (Card, Toast), Organism (FileTree) |

# Interaction Design

- Atoms handle direct user input only via native HTML events (button `onClick`, input `onChange`)
- Atoms do not orchestrate interactions — they fire events upward via callback props
- Hover, focus, active states managed via CSS pseudo-classes, not JS

# Form Design

An individual atom may be a form primitive (Input atom). Form logic (validation, submission) is owned by the enclosing molecule or organism.

| Atom | Form Role | Props |
|---|---|---|
| InputLabel | Text label | `for: string`, `children: string` |
| InputField | Value entry | `value`, `onChange`, `type`, `placeholder` |
| InputError | Validation message | `message: string` |

# UX State Design

Atoms expose only native element states. No application-level states.

| State | Mechanism |
|---|---|
| Default | Resting CSS state |
| Hover | `:hover` pseudo-class |
| Active | `:active` pseudo-class |
| Focus | `:focus-visible` pseudo-class |
| Disabled | `:disabled` attribute + `opacity: 0.5` |
| Error | `aria-invalid="true"` on input atoms |

# Feedback Design

Atoms produce feedback through native browser mechanisms:
- Button `onClick` fires a callback; parent handles visual feedback
- Input `onChange` propagates value to parent; parent computes validation
- Disabled opacity (0.5) signals non-interactivity

No in-atom toast, modal, or notification logic.

# Navigation Design

Atoms do not navigate. An atom can be a navigation element (Button > Link), but the atom itself receives `href` or `onClick` and does not own routing logic.

# Responsive Design

Atoms adapt to available space via CSS tokens, not breakpoint logic:
- Width: `auto` or `100%` of parent
- Padding: `var(--space-*)` tokens
- Font size: `var(--font-size-*)` tokens

No media queries inside atom styles. Responsive layout is a template concern.

# Accessibility Design

| Requirement | Atom Implementation |
|---|---|
| Semantic HTML | Atoms use native elements (`<button>`, `<span>`, `<img>`, `<input>`) |
| ARIA | `aria-label`, `aria-describedby`, `aria-invalid` as props |
| Focus-visible | `:focus-visible` outline via `--focus-ring` token |
| Touch target | 44×44px minimum for interactive atoms (Button, Icon clickable area) |
| Color contrast | Token pairs guarantee 4.5:1 minimum |
| Reduced motion | No atom-level animations |

# Localization Design

- Atoms that render text (Label, Badge) receive translated strings as props
- No inline string literals
- Locale dictionary keys assembled by parent molecule/organism

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Single export, ≤5 props, no internal state. |
| Rule 3: Typography Leads | Font tokens consumed via CSS variable, not hardcoded. |
| Rule 5: White Space is Feature | Spacing via `var(--space-*)` tokens. |
| Color System | All colors `var(--color-*)`; zero hex codes. |
| Accessibility | Semantic HTML, 44×44px touch targets, `:focus-visible` ring. |
| Localization | No hardcoded strings — text passed via props. |
| 8px grid | Spacing and padding are multiples of 8px per token set. |

# Open Questions

- Should a restricted ESLint config be added for `atoms/` to enforce the ≤5 prop cap?
- Should Icon atom accept an `aria-label` prop or derive it from icon name?
