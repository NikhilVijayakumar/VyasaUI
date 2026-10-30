# Feature Design Generation System v3.0

## Purpose

You are acting as:

* UX Designer
* Product Experience Designer
* Interaction Designer
* Feature Design Author

Your responsibility is to generate:

```text id="a0q3s5"
docs/raw/feature-design/**
```

from:

```text id="7o5d3m"
docs/raw/feature/**
docs/raw/design-system/**
```

The generated document defines:

```text id="x15uj4"
How users experience the feature.
```

The generated document does not define:

```text id="6s5wbn"
Architecture

Technical Design

Implementation
```

---

# Source Derivation Mandate

**Every claim in every section must trace to the feature specification.**

Before writing any section:
1. Read the feature specification for this component.
2. Extract all named states, interactions, journeys, and responsibilities from it.
3. Use only what the feature spec defines.

If a section has no applicable content for this specific feature:
- Write `N/A — [one sentence stating why it does not apply to this component]`
- Do NOT write generic placeholder content

**This is not a template to fill in. It is a structure to populate with feature-specific evidence.**

---

# Forbidden Boilerplate

The following phrases are FORBIDDEN in any generated document. If you write them, the document fails quality.

```text
User interacts with X.
System responds appropriately.
Standard interactions apply.
Standard.
Adapted layout.
Stacked layout.
Standard typography used.
Standard grid used.
Handled gracefully.
User retries action.
Visual/textual feedback.
Proper focus states.
Aria labels used.
Responsive boundaries.
Goal 1
Utilize X for its primary purpose.
Primary Task
User completes primary flow.
None at this time.
```

If any of these appear in your output, replace them with feature-specific content derived from the feature specification.

---

# Component Type Awareness

Before generating, identify the component type:

## Atom
A primitive display element. Typically has one or two states. Has no internal navigation.
Examples: EmptyState, LoadingState, ErrorState, SeverityBadge, StatusDot

Rules for atoms:
- UX State Design: document ONLY the states the component actually has. If it IS a state (EmptyState), it has exactly one state.
- Interaction Design: if the atom is purely presentational, document "None — this atom has no interactive affordances."
- Navigation Design: N/A for atoms unless the atom contains a link or trigger.

## Molecule
A composed element combining multiple atoms. May have a small state machine.
Examples: Card, Notification, TrendMetricCard, ImageViewer

## Organism
A complex UI section managing meaningful state, layout, or interaction.
Examples: DrawerComponent, ToolbarComponent, CsvViewer, DataTable, FormLayout, FileViewerRouter

Rules for organisms:
- All responsive states must be documented explicitly (e.g., mobile overlay vs. desktop sidebar for DrawerComponent).
- Interaction Design must enumerate every discrete user action.
- UX State Design must match the feature spec's state machine exactly.

---

# Scope

Inputs:

```text id="30xgu2"
docs/raw/feature/**
docs/raw/design-system/**
```

Output:

```text id="eotz7v"
docs/raw/feature-design/{feature}.md
```

---

# One-to-One Rule

Each feature specification produces exactly one feature design document.

Example:

```text id="n6z7kg"
docs/raw/feature/task-management/task.md

        ↓

docs/raw/feature-design/task-management/task.md
```

No feature design document may represent multiple features.

No feature may produce multiple feature design documents.

---

# Feature Design Rule

Feature Design answers:

```text id="gj0fr5"
How does the user experience this feature?
```

Feature Design does NOT answer:

```text id="fnwmv4"
How is it implemented?

How is data stored?

What architecture pattern is used?

What repositories exist?

What APIs exist?
```

---

# Design System Rule

Feature Design must use the Design System.

Feature Design must not invent:

```text id="nqjlwm"
Interaction Patterns

Accessibility Rules

Visual Standards

Responsive Rules

Navigation Rules
```

when they already exist in the Design System.

Feature Design realizes Design System rules.

It does not redefine them.

---

# Generation Phase 0 — Feature Discovery

## Goal

Read the feature specification. Extract everything. This phase produces the source-of-truth inventory that all subsequent phases must draw from.

**Read the full feature spec document before proceeding.**

Extract and record:

### Component Type
Atom / Molecule / Organism / Concept / Template

### Purpose
Exact purpose from the spec.

### Responsibilities
List every responsibility named in the spec. These become user-facing behaviors in the Feature Design.

### Non-Responsibilities
What the spec explicitly says this component does NOT do.

### Named Workflows
List every workflow or flow named in the spec. These become User Journeys.

### Named States
List every state named in the spec. These become UX States. If no states are named, note "no state machine."

### Permissions
Any authorization or access control defined in the spec.

### Validation Rules
Any validation behavior defined in the spec.

### Failure Scenarios
Every failure mode named in the spec. These become Failure Flows and Error states.

### Responsive Modes
Any viewport-specific behavior defined in the spec (e.g., "overlay on mobile, permanent on desktop").

### Accessibility Requirements
Any accessibility behavior explicitly named in the spec.

### Localization Requirements
Any localization behavior named in the spec.

---

**Stop. Do not proceed to Phase 1 until you have completed this extraction.**

**Every subsequent section must reference at least one item from this Phase 0 extraction.**

---

# Generation Phase 1 — Design System Mapping

## Goal

Determine which Design System guidance applies.

Map:

### Design Principles

### Interaction Rules

### Accessibility Rules

### Localization Rules

### Responsive Rules

### UX Patterns

### Visual Standards

---

# Generation Phase 2 — User Goal Definition

## Goal

Identify user goals.

Required Output:

| User Goal | Description |
| --------- | ----------- |

Questions:

```text id="8w4q3z"
Why is the user using this feature?

What outcome is the user seeking?

What problem is being solved?
```

---

# Generation Phase 3 — User Journey Design

## Goal

Define complete user journeys derived from the feature spec's named workflows, responsibilities, and failure scenarios.

**Each journey must correspond to a workflow, use case, or scenario explicitly described in the feature specification.**

Required for each journey:

### Entry Conditions
What triggers this journey? Name the specific trigger from the feature spec (e.g., "user opens the drawer on a mobile viewport", not "user accesses DrawerComponent").

### Primary Flow
Numbered steps. Each step describes what the user does or sees — not what the system does internally. Use feature-spec vocabulary.

### Alternate Flows
Branches from the primary flow as named in the feature spec. If the spec names no alternates: write "None defined in feature spec."

### Failure Flows
Named failure modes from the feature spec. Each failure flow must name the specific failure condition.

### Recovery Flows
How the user recovers from each failure. If the feature spec defines no recovery: write "Not applicable — [reason]."

### Exit Conditions
What concludes this journey. Name the specific exit trigger (e.g., "drawer closes and overlay dismisses", not "user completes task").

Required Matrix — one row per named journey:

| Journey | Description |
| ------- | ----------- |
| [Name from feature spec] | [Specific description of what the user does and what they see] |

---

# Generation Phase 4 — Screen Inventory

## Goal

Identify required screens.

Required Matrix:

| Screen | Purpose |
| ------ | ------- |

Examples:

```text id="0z0h0y"
List Screen

Details Screen

Create Screen

Edit Screen

Review Screen

Settings Screen
```

Only include applicable screens.

---

# Generation Phase 5 — Interaction Design

## Goal

Define user interactions derived from the feature specification. Document only interactions that exist for this specific component.

**Do not fill in interaction categories that do not apply to this component.**

Process:
1. From Phase 0, review the named responsibilities and workflows.
2. Identify every discrete user action described in the spec.
3. For each action: document what the user does and what they immediately experience.

If the component is purely presentational (no buttons, no links, no clickable regions, no input targets):

| Interaction | Behavior |
| ----------- | -------- |
| None | This component is purely presentational. It has no interactive affordances. [State which spec responsibility confirms this.] |

For interactive components, document each discrete action:

| Interaction | Behavior |
| ----------- | -------- |
| [Specific action from spec, e.g., "Tap overlay (mobile)"] | [Specific result, e.g., "Drawer closes; overlay fades out; focus returns to trigger element"] |

Only include categories that apply:

### Click / Tap Actions
Only if the component has clickable or tappable regions.

### Keyboard Actions
Only if the feature spec names keyboard behavior or the Design System accessibility rules require it.

### Touch-Specific Actions
Only if the component has touch-specific interactions different from click (e.g., swipe-to-dismiss).

### Selection Actions
Only if the component enables item selection.

### Pagination / Navigation Actions
Only if the component has page controls or internal navigation.

### Confirmation Actions
Only if the component has destructive or irreversible actions requiring confirmation.

---

# Generation Phase 6 — Form Design

## Goal

Define form experience.

Required:

### Input Fields

### Required Fields

### Optional Fields

### Validation Feedback

### Submission Feedback

### Error Feedback

Required Matrix:

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |

---

# Generation Phase 7 — UX State Design

## Goal

Define user-facing states derived exclusively from the feature specification.

**Do NOT use a generic state template.**

Required process:
1. Open the feature specification for this component.
2. Find every named state in the spec (look in: Responsibilities, States, Workflows, Feature Flags, Failure Scenarios).
3. Document only those states. Use the feature spec's exact state names.
4. If the component IS a state display element (EmptyState, LoadingState, ErrorState), it has exactly one state — itself.

Anti-patterns — these indicate you are using a template instead of the spec:
- Listing "Initial, Loading, Empty, Success, Error" for a toggle button
- Listing "Loading" for a purely synchronous atom
- Listing "Success" for a component that has no success concept

Required Matrix:

| State | User Experience |
| ----- | --------------- |
| [Name from feature spec] | [What the user sees/experiences in this state, in plain language] |

Important:

These are UX states derived from the feature spec.

Not a generic technical state template.

If the feature spec defines no distinct states (e.g., a static display atom), write:

| State | User Experience |
| ----- | --------------- |
| Active | [Single state description] |

---

# Generation Phase 8 — Feedback Design

## Goal

Define user feedback.

Required:

### Success Messages

### Warnings

### Errors

### Informational Messages

### Confirmation Feedback

### Progress Feedback

Required Matrix:

| Event | Feedback |
| ----- | -------- |

---

# Generation Phase 9 — Navigation Design

## Goal

Define navigation experience.

Required:

### Entry Points

### Exit Points

### Deep Linking

### Back Navigation

### Cross-Feature Navigation

Required Matrix:

| Navigation Path | Behavior |
| --------------- | -------- |

---

# Generation Phase 10 — Responsive Design

## Goal

Define responsive behavior.

Required:

### Desktop

### Tablet

### Mobile

Required Matrix:

| Viewport | Adaptation |
| -------- | ---------- |

---

# Generation Phase 11 — Accessibility Design

## Goal

Apply Design System accessibility guidance to this specific component's interactions and states.

**Generic phrases like "Aria labels used" and "Proper focus states" are forbidden.**

For each accessibility area that applies, specify:
- The exact WCAG requirement or Design System rule
- The specific behavior for this component
- What the user experiences (especially screen reader users)

Required Matrix:

| Accessibility Area | Behavior |
| ------------------ | -------- |
| [Specific area, e.g., "Focus trap (mobile overlay)"] | [Specific behavior, e.g., "When DrawerComponent opens on mobile, focus is trapped within the drawer. Tab cycles through menu items only. Escape key closes the drawer and returns focus to the menu toggle button."] |

Only include areas that apply to this component:

### Keyboard Support
Only for components with interactive elements. Name the specific keys and their effects.

### Focus Management
Only for components that change visual focus. Specify: where does focus go when the component opens/appears/closes?

### Screen Reader Announcement
What does a screen reader announce when this component renders or changes state? Name the specific text or role.

### Focus Trap
Only for modal overlays or components that capture focus. Specify the trap scope and escape mechanism.

### Color Independence
Only for components that use color to communicate information (e.g., TrendMetricCard green/red). Specify the non-color alternative.

### Touch Target Size
Only for interactive atoms on mobile. Confirm 44px minimum per Design System rule.

### Table Accessibility
Only for table components (CsvViewer, DataTable). Specify scope attributes, header roles, and caption behavior.

### Error Accessibility
Only for components that display errors. Specify how errors are announced (aria-live, role=alert, etc.).

If an area does not apply: omit it. Do not write "N/A" for every category.

---

# Generation Phase 12 — Localization Design

## Goal

Apply localization guidance to the specific strings, numbers, and layout behaviors defined in this feature's spec.

**Generic phrases like "Responsive boundaries" or "Text expansion handled" are forbidden.**

For each localization area that applies, name the specific string, value, or behavior being localized.

Required Matrix:

| Localization Area | Behavior |
| ----------------- | -------- |
| [Specific area, e.g., "'No data found' message"] | [Specific behavior, e.g., "Resolved through the localization system. Must not be hardcoded. Container wraps text to accommodate language expansion up to 200%."] |

Only include areas that apply to this component:

### Localizable Strings
Name every specific string in this component that must be localized. If the spec names them, use those names.

### Number and Percentage Formats
Only if this component displays numbers, currencies, or percentages. Specify locale-sensitive formatting behavior.

### Date and Time Formats
Only if this component displays dates or times.

### RTL Support
Only if this component has directional layout that must mirror for RTL languages. Name specific elements (e.g., "navigation menu item alignment").

### Text Expansion
How the layout accommodates longer translated strings. Name the specific container and its constraint behavior.

If no localization applies (e.g., a component with no user-visible text): write `N/A — this component renders no user-visible text.`

---

# Generation Phase 13 — Design System Traceability

## Goal

Trace design decisions.

Required Matrix:

| Design System Rule | Applied To |
| ------------------ | ---------- |

Purpose:

Ensure Feature Design does not invent UX behavior.

---

# Forbidden Content

The generated document must not contain:

## Architecture

Examples:

```text id="1pk0sl"
MVVM

Repository

ViewModel

Service

Dependency Injection
```

---

## Technical Design

Examples:

```text id="hmg4mm"
API Design

Database Design

Caching

State Store

Integration Design
```

---

## Implementation

Examples:

```text id="8e2vdl"
React

Angular

Flutter

TypeScript

SQL

CSS Implementation
```

---

# Required Document Structure

```text id="9jk6s2"
# Overview

# Feature Summary

# User Goals

# User Journeys

# Screen Inventory

# Interaction Design

# Form Design

# UX State Design

# Feedback Design

# Navigation Design

# Responsive Design

# Accessibility Design

# Localization Design

# Design System Traceability

# Open Questions
```

---

# Open Questions Rule

Any ambiguity discovered during generation must be recorded.

Never invent missing behavior.

Document unresolved questions.

---

# Pre-Output Quality Gate

Before writing the final document, verify each item:

## Boilerplate Check
Search your draft for forbidden phrases listed in the Forbidden Boilerplate section.
If any are found: replace with feature-specific content.

## State Accuracy Check
- Do the states in UX State Design match the states named in the feature spec?
- If the component IS a state (EmptyState, LoadingState, ErrorState): does it have exactly one state?
- If the component is a synchronous toggle (ThemeToggle): are asynchronous states like "Loading" absent?

## Interaction Accuracy Check
- Does every interaction in Interaction Design correspond to a user action described in the feature spec?
- If the component is purely presentational (no buttons, no clickable regions): does Interaction Design say so explicitly?

## Journey Specificity Check
- Does every User Journey have a specific named trigger, named flow steps, and a specific exit condition?
- Does any journey contain "User interacts with X. System responds appropriately."? If yes, replace it.

## Responsive Completeness Check
- If the feature spec defines different behavior at different viewports: are all viewport variants documented?
- If the component is the same at all viewports: is that stated explicitly?

## Accessibility Specificity Check
- Does Accessibility Design reference specific WCAG requirements or feature-spec-named accessibility requirements?
- Generic "Aria labels used" or "Proper focus states" are insufficient — name the specific behavior.

## Localization Specificity Check
- Does Localization Design reference the specific strings or numbers that must be localized, as named in the feature spec?
- If the feature spec flags a localization concern as an open question: is it recorded in Open Questions?

If all checks pass: write the document.
If any check fails: fix the failing sections before writing.

---

# Output Location

```text id="wzhdgi"
docs/raw/feature-design/{feature}.md
```

---