# Workflow: Application Rendering

**Feature Area:** Cross-Feature — Theming System, Localization System, Component Library, Atomic Design, Templates

## Overview

The Application Rendering workflow describes how a user interface frame is assembled and displayed. It spans Theme resolution, Localization lookup, Component composition by atomic design rules, and Template layout. This workflow defines the rendering contract that every UI component participates in.

## Responsibilities

- Define the rendering order: Theme → Localization → Component → Template
- Specify how design tokens propagate through the component hierarchy
- Govern the composition constraints: Atoms → Molecules → Organisms → Templates
- Ensure every render pass produces a consistent, localized, and themed output

## Non-Responsibilities

- Does not define runtime behavior, event handling, or user interaction
- Does not specify backend data fetching or API integration
- Does not cover server-side rendering or hydration
- Does not replace individual feature specifications

## Business Rules

1. **Theme before component** — All components must resolve theme context before rendering; no component defines its own color palette
2. **Localization before text** — All user-facing strings must pass through the localization system before display; raw strings are never rendered
3. **One rendering pass per state change** — A single state change triggers exactly one rendering pass through the entire Theme → Localization → Component → Template pipeline
4. **Broken composition chain** — An atom cannot render if its parent organism has not resolved (dependency direction is always downward)
5. **Accessibility cannot be bypassed** — Every rendered component must satisfy its tier's accessibility requirements regardless of rendering context

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Rendering Pipeline** | The sequential resolution of theme tokens, localization strings, component state, and template layout |
| **Token Resolution** | Mapping design token names to concrete values (colors, spacing, typography) for the active theme |
| **String Resolution** | Looking up translation keys in the active language dictionary |
| **Composition Chain** | The atomic design hierarchy that constrains which components can contain which |

## States

- **Resolving Theme** — Theme context being read; design tokens being mapped to current mode
- **Resolving Localization** — Active language dictionary being selected; translation keys being resolved
- **Rendering Components** — Component tree being assembled bottom-up (atoms → molecules → organisms)
- **Laying Out Templates** — Page-level templates arranging organisms into the final layout
- **Displayed** — Full frame rendered and painted to the screen
- **Rendering Failed** — A required dependency (theme, localization, component) is unavailable

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Resolving Theme | Resolving Localization | Theme tokens resolved for current mode |
| Resolving Theme | Rendering Failed | Theme context unavailable or token missing |
| Resolving Localization | Rendering Components | Translation dictionary loaded and keys resolved |
| Resolving Localization | Rendering Failed | Active language dictionary is empty |
| Rendering Components | Laying Out Templates | All atomic components rendered and composed |
| Rendering Components | Rendering Failed | A required component is missing or fails |
| Laying Out Templates | Displayed | Template layout completes and paints to screen |
| Rendering Failed | Resolving Theme | Failed dependency restored; re-render triggered |

## Edge Cases

- **Theme switch during render**: Theme changes while components are still rendering — new render triggered after current pass completes
- **Language switch during render**: Localization changes mid-render — strings resolve to new language on next render pass
- **Component missing from tier**: A molecule references an atom that does not exist — organism rendering fails
- **Circular composition**: A template references an organism that references the same template — cycle must be detected and blocked
- **Empty template**: No organisms placed in a template slot — template renders structural shell without content
- **Component with no localization keys**: Component renders with no text output; layout structure preserved

## Error Conditions

- **Theme context missing** — Component renders with no palette; visual output is incorrect or invisible
- **Localization context missing** — Component renders translation keys as raw text instead of resolved strings
- **Component missing from dependency chain** — A higher-tier component references a lower-tier component that does not exist
- **Template slot violation** — An organism is placed in a template slot that expects a different type of content
- **Accessibility requirement unmet** — Component renders without required ARIA attributes or keyboard support

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Theme context missing | Wrap the component tree in a ThemeProvider; verify theme configuration is valid |
| Localization context missing | Wrap the component tree in a LanguageProvider; verify at least one translation dictionary is registered |
| Component missing from dependency chain | Create or import the missing lower-tier component before rendering the higher-tier component |
| Template slot violation | Verify the organism type matches the template slot contract; use the correct organism for the slot |
| Accessibility requirement unmet | Add missing ARIA attributes and keyboard event handlers per Prati accessibility rules |

## Authorization

**Visibility:** Public — the application rendering pipeline applies to all UI output regardless of authentication state. Individual component visibility is declared per component.

## User Journey

### Entry Conditions
A user opens the application or triggers a state change that requires re-rendering (theme switch, language switch, data update).

### Primary Flow
The application resolves the active theme and design tokens, selects the correct language dictionary, renders the component tree from atoms up through templates, and paints the final layout to the screen.

### Alternate Flows
A theme switch occurs — the entire pipeline re-runs with the new palette; all components update without page reload.

### Failure Flows
The theme context is missing — components render without colors; the user sees an unstyled or broken interface.

### Recovery Flows
The developer ensures a ThemeProvider wraps the component tree and that valid theme configuration exists.

### Exit Conditions
The user sees a fully themed, localized, and correctly laid out interface.

## Workflow

### Trigger
A navigation event, data load, theme switch, or language change initiates a render pass.

### Preconditions
ThemeProvider and LanguageProvider are mounted. Component tree structure is defined. Design tokens and translation dictionaries are registered.

### Steps
1. Resolve current theme mode and map design tokens
2. Select active language dictionary
3. Render atoms with resolved tokens and strings
4. Compose molecules from atoms
5. Compose organisms from molecules and atoms
6. Place organisms into template slots
7. Paint final layout

### Outcomes
A fully themed and localized interface is displayed.

### Exceptions
A required dependency (theme, localization, component) is missing — the render fails and the error is reported.

### Completion Criteria
All visible components are themed, localized, and laid out per the active template.

## Verification

- **Theme isolation test**: Switch theme and verify every component's palette changes without individual overrides
- **Language isolation test**: Switch language and verify every user-facing string resolves to the correct dictionary
- **Composition chain test**: Remove an atom and verify its parent molecule reports the missing dependency
- **Accessibility audit**: Run accessibility check on every template layout; verify all components meet their tier's requirements

## See Also

- [Theming System](../theming/README.md) — theme state management and token resolution
- [Localization System](../localization/README.md) — language switching and translation dictionaries
- [Component Library](../components/README.md) — atomic design organization and component registry
- [Atomic Design Methodology](../components/atomic-design/README.md) — classification rules and composition constraints
- [Template Delivery Workflow](./template-delivery.md) — companion workflow for server-side HTML rendering
- [Prototype Authoring Workflow](./prototype-authoring.md) — companion workflow for prototype creation
