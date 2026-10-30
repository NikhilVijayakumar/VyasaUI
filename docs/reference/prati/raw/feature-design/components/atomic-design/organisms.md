# Overview

Organisms are complex UI sections that assemble multiple molecules and atoms into a coherent, feature-complete region. They own significant state management, data-fetching logic, and user interaction orchestration. Organisms are discrete page sections — a data table, a timeline, a file tree, a complete form panel. File length ≤500 lines.

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-005 |
| Feature Name | Organisms Tier |
| Category | Component Classification |
| Priority | P0 |
| Dependencies | Molecules (Card, FormInput, etc.), Atoms, Data services |
| Gate | Composes ≥1 molecule; ≤500 lines; one clear purpose |

# User Goals

- View and interact with a complex feature section (table with filters, file tree with selection, multi-step form)
- Trigger operations that span multiple molecules (submit a form, filter a table, batch-select files)

# User Journeys

### Entry Conditions

- Developer composes a page section that requires multiple molecules plus state logic
- Section has data dependencies (fetch, mutate) or user workflow (multi-step, validation, selection)

### Primary Flow: Create an organism

1. Developer creates a file in `components/organisms/`
2. Imports molecules (Card, FormInput, Toast) and atoms (Button, Badge)
3. Declares state: `useState` for UI state, `useReducer` for complex workflows
4. Integrates data fetching via custom hooks or direct fetch calls
5. Passes callbacks and data down to molecules as props
6. File stays ≤500 lines

### Alternate Flows

- **Simple organism**: if state is minimal (1–2 `useState` calls) and data fetching is absent, still qualifies as organism if it composes ≥2 molecules.
- **Headless organism**: organism provides context and state to children via React Context without rendering its own DOM wrapper.

### Failure Flows

- **Over-composition**: organism that composes only atoms (no molecules) is likely a molecule misclassified. Downgrade.
- **>500 lines**: extract sub-sections into child organisms or refactor state logic into custom hooks.
- **No clear purpose**: organism doing too many things (filtering + editing + exporting) — split into separate organisms per responsibility.
- **Duplicated state**: organism and its parent both managing overlapping state. Consolidate in one owner.

### Recovery Flows

- **Organism becomes too large**: identify the largest molecule group → extract as child organism → import it back. The parent organism passes only essential props.
- **Data-fetching moves upward**: if parent screen starts fetching data the organism needs, convert organism to receive data via props (presentational) or keep fetching inside (self-contained).

### Exit Conditions

- File placed in `components/organisms/<name>.tsx`
- Import from `molecules/`, `atoms/`
- Manages state (`useState`, `useReducer`, or custom hooks)
- Data-fetching logic present or data received via props
- File length ≤500 lines
- One clear section purpose

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Create file in `organisms/` | File system | `.tsx` file |
| 2 | Import molecules + atoms | Module resolution | Import bindings |
| 3 | Add state management | React hooks | State variables |
| 4 | Integrate data layer | Custom hooks / fetch | API data |
| 5 | Compose molecules in layout | JSX with data flow | Rendered section |
| 6 | Export organism | Module system | Named export |

# Screen Inventory

| Organism | Composed Of | Screens |
|---|---|---|
| DataTable | molecules: MetricDisplay, Pagination; atoms: Button, Badge, Icon | Dashboard, Reports |
| Timeline | molecules: TimelineItem (Card + Badge + Icon) | Detail, History |
| FileTree | molecules: TreeNode (Icon + Label + Badge) | File explorer |
| FormPanel | molecules: FormGroup, Toast; atoms: Button | Settings, Create, Edit |
| NotificationCenter | molecules: Notification, Toast; atoms: Badge | Global |

# Interaction Design

- Organisms orchestrate user workflows: clicking a table row triggers detail panel, submitting a form triggers validation then API call
- Organisms own interaction state: selected rows, expanded nodes, form values, filter parameters
- Molecules inside organisms fire callbacks; organism decides the next action (API call, navigation, state update)
- Drag-and-drop, keyboard navigation, and multi-select are organism-level concerns

# Form Design

| Concern | Owner |
|---|---|
| Field display | Molecules (FormGroup, FormInput) |
| Field validation | Organism (FormPanel) — runs validation rules per field |
| Form submission | Organism — calls API, handles success/error |
| Field state | Organism — `useReducer` with form state |
| Error display | Molecules — receive error strings from organism |

Organisms own all form logic. Molecules receive field values and error states as props.

# UX State Design

| State | Example | Mechanism |
|---|---|---|
| Loading | DataTable with skeleton rows | `isLoading` boolean → shimmer molecules |
| Empty | DataTable with "No results" | `data.length === 0` → empty state molecule |
| Error | FormPanel with API error toast | `error` state → Toast molecule |
| Selected | FileTree with highlighted node | `selectedId` state → CSS class on molecule |
| Editing | FormPanel in edit mode | `mode: 'edit' | 'create'` → pre-filled fields |
| Dirty | FormPanel with unsaved changes | `isDirty` boolean → unsaved indicator |

# Feedback Design

| Trigger | Visual | Mechanism |
|---|---|---|
| API success | Toast "Saved" | `onSuccess` callback sets toast state |
| API error | Toast error message | `onError` callback sets error toast |
| Validation error | Red border on FormInput | Error state passed to molecule |
| Selection changed | Highlighted row | `selectedId` state change |
| Load complete | Skeleton → real data | `isLoading` toggle |

Organisms own feedback display. Molecules show the feedback based on props.

# Navigation Design

- Organisms may trigger navigation: FormPanel `onSubmit` → `router.push('/success')`
- Organisms do not include navigation chrome (headers, footers, sidebars) — those are templates
- Organism may highlight a nav item via callback to parent (e.g., DataTable row click → parent navigates to detail)

# Responsive Design

| Viewport | DataTable | FormPanel | FileTree |
|---|---|---|---|
| Desktop (≥1024px) | Full columns, inline actions | Side-by-side fields | Expanded tree |
| Tablet (600–1023px) | Collapsible columns, action icon | Stacked fields, full width | Collapsed tree with expand |
| Mobile (<600px) | Horizontal scroll or card view | Single-column form | Slide-out panel |

Organisms may contain viewport-specific molecules. Breakpoints use consistent token values.

# Accessibility Design

| Requirement | Organism Implementation |
|---|---|
| Landmark | Section wrapper with `aria-label` describing the region |
| Focus management | After form submit, focus moves to success message |
| Live region | `aria-live="polite"` on Toast container for dynamic messages |
| Keyboard navigation | Arrow keys in FileTree, Tab through DataTable rows, Enter to select |
| Announcements | Screen reader announces loading/completion via `aria-live` region |
| Focus trap | Within modal organisms (e.g., confirm dialog before form discard) |

# Localization Design

- Organisms pass locale strings to child molecules as props
- Organisms call `useTranslation()` to get the locale dictionary
- Errors returned from API are mapped to locale keys before display
- Zero hardcoded strings — all text content comes from locale dictionary
- Numbers, dates formatted via locale-aware utilities (`Intl.DateTimeFormat`, `Intl.NumberFormat`)

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | One section per file, one clear purpose, ≤500 lines. |
| Rule 3: Typography Leads | Typography tokens flow through molecules; organism does not set font. |
| Rule 5: White Space is Feature | Section spacing uses `var(--space-section)`; between-molecule gap uses `var(--space-lg)`. |
| Color System | Organism sets background via `var(--color-bg-L2)`; all other colors via atoms/molecules. |
| Accessibility | Landmarks, live regions, focus management, keyboard nav. |
| Localization | Strings mapped via `useTranslation()`; no hardcoded text. |
| 8px grid | Section padding, molecule gaps, and internal spacing all 8px multiples. |

# Open Questions

- Should organisms strictly forbid direct atom imports (force molecule usage)? Current spec allows atom imports but risks bypassing molecule safety.
- Should data-fetching hooks live inside the organism file or in a sibling `hooks/` directory?
