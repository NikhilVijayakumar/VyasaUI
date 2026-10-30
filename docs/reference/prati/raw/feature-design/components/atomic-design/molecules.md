# Overview

Molecules compose two or more atoms into a self-contained unit with a single functional purpose. A molecule owns a focused responsibility — display a card, show a notification, render a form input group. Molecules import atoms but never import other molecules or organisms. Molecules stay under 200 lines.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-004 |
| Feature Name | Molecules Tier |
| Category | Component Classification |
| Priority | P0 |
| Dependencies | Atoms (Button, Icon, Badge, etc.), Design tokens |
| Gate | Composes ≥2 atoms; ≤200 lines; no data fetching |

# User Goals

- View a coherent, self-contained UI unit (card, notification, metric)
- Trigger an action through the molecule's composed atoms

# User Journeys

### Entry Conditions

- Developer identifies a component that composes multiple primitives into one function
- Component has no data-fetching dependency and no complex state reducer

### Primary Flow: Create a molecule

1. Developer creates a file in `components/molecules/`
2. Imports 2+ atoms (Button, Icon, Label, etc.)
3. Composes atoms inside a fragment or `<div>` wrapper
4. Applies spacing via `var(--space-*)` tokens between atoms
5. Exposes callback props for user actions (onSubmit, onDismiss, etc.)
6. File is <200 lines

### Alternate Flows

- **Single-atom molecule**: if a component uses exactly one atom but adds layout / logic, it qualifies as a molecule because it adds functional purpose beyond the atom itself.
- **Atom-free molecule**: if a component composes non-atom primitives (native elements only), classify as molecule if it has a single function.

### Failure Flows

- **Data fetching**: any `useEffect` with fetch / axios inside a molecule → elevate to organism. Molecules are presentational.
- **Complex state**: `useReducer` or >3 `useState` calls → move to organism.
- **>200 lines**: extract sub-units into additional molecules or split into organism.
- **No atom composition**: if a molecule does not import any atom, verify it is not an atom misclassified.

### Recovery Flows

- **Molecule acquires data fetching**: extract the data layer into a parent organism; molecule remains presentational, receiving data via props.
- **Molecule exceeds 200 lines**: identify the largest sub-section → extract as a new molecule → compose it back in the original.

### Exit Conditions

- File placed in `components/molecules/<name>.tsx`
- Imports from `atoms/` directory only (zero imports from `molecules/`, `organisms/`, `templates/`)
- No `useEffect`, `useReducer`, or data-fetching calls
- File length ≤200 lines
- Exports one named component

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Create file in `molecules/` | File system | `.tsx` file |
| 2 | Import atoms (Button, Icon, Label) | Module resolution | Import bindings |
| 3 | Compose atoms into layout | React elements | JSX tree |
| 4 | Add spacing via tokens | CSS `var(--space-*)` | Class/style rules |
| 5 | Wire callback props | Props interface | Function references |
| 6 | Export component | Module system | Named export |

# Screen Inventory

| Molecule | Composed Atoms | Screens |
|---|---|---|
| Card | Icon, Label, Badge, Button | Dashboard, Detail |
| Notification | Icon, Badge, Button (dismiss) | Top-right overlay |
| FormInput | InputLabel, InputField, InputError | All forms |
| MetricDisplay | Label, Badge, Icon | Dashboard |
| Toast | Icon, Label, Button | Global overlay |

# Interaction Design

- Molecules wire atom event handlers (Button `onClick`) to molecule-level callbacks
- Molecules do not consume events — they propagate them upward via props
- Local interaction (e.g., expand/collapse a Card) is managed via molecule-level `useState` only if the state does not affect sibling components
- Molecules may use `useState` for purely presentational toggle (show/hide detail)

# Form Design

| Molecule | Atoms Used | Form Concern |
|---|---|---|
| FormInput | InputLabel + InputField + InputError | Single field display + validation message |
| FormGroup | Multiple FormInput instances | Field layout (organism owns submission) |

Molecules render form atoms but do not own form state, validation logic, or submission. Those belong to the parent organism.

# UX State Design

| State | Example | Mechanism |
|---|---|---|
| Default | Card with data | Props received from parent |
| Expanded | Card showing detail section | Local `useState` boolean |
| Dismissed | Toast fading out | Parent callback removes from DOM |
| Validation error | FormInput with error | Props `error: string` from parent |
| Loading | MetricDisplay with shimmer | Props `loading: boolean` |

# Feedback Design

- Molecules surface feedback through atom state changes (Button loading spinner, Input error color)
- No molecule-level toasts, modals, or notifications
- Dismissible molecules (Toast, Notification) fire an `onDismiss` callback; parent organism removes the element

# Navigation Design

Molecules may include navigational atoms (Button with `href`), but routing logic is owned by the parent screen. No molecule calls `useRouter` or `navigate()` directly.

# Responsive Design

- Molecule width: `100%` of parent organism or template
- No molecule-level breakpoints
- Atom spacing inside molecule uses `var(--space-*)` tokens which are consistent across viewports
- Multi-column atoms inside a molecule (e.g., Card with icon + text side by side) use flexbox `gap: var(--space-md)`

# Accessibility Design

| Requirement | Molecule Implementation |
|---|---|
| Composition | Atoms carry their own a11y (semantic HTML, ARIA) |
| Focus order | Molecule arranges atoms in logical tab order |
| Group labelling | `aria-labelledby` on Card heading for screen reader context |
| Touch targets | 44×44px on all interactive atoms inside molecule |
| Contrast | Relies on atom token colors (4.5:1) |

# Localization Design

- Molecules receive translated strings as props (e.g., `Card` receives `title`, `description`, `ctaLabel`)
- Molecules do not call locale functions directly — parent organism passes the strings
- Zero hardcoded text inside molecule files

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | One function, ≤200 lines, exports one component. |
| Rule 3: Typography Leads | Atoms inside molecule use typography tokens; molecule does not override font. |
| Rule 5: White Space is Feature | Spacing between atoms uses `var(--space-*)` tokens; no raw px values. |
| Color System | Molecule does not define colors — atoms apply `var(--color-*)`. |
| Accessibility | Atoms carry a11y; molecule ensures logical grouping and tab order. |
| Localization | Text passed via props; no inline strings. |
| 8px grid | All spacing between child atoms is a token multiple of 8px. |

# Open Questions

- Should a `<Molecule>` wrapper component be provided that auto-applies `gap` from a token prop?
- Should molecule-level `useState` be disallowed entirely in favour of lifting state to the parent organism?
