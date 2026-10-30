# Workflow: Prototype Authoring

**Feature Area:** Cross-Feature — Proto Runtime, Prototype Boilerplate, Generation Process, Navigation, Persistence, Mock Data

## Overview

The Prototype Authoring workflow describes how a developer moves from a feature specification to an interactive, data-driven prototype. This workflow spans six Proto Runtime features and defines the expected sequence, dependencies, and success criteria for each stage.

The workflow ensures that prototype authors follow a consistent path: scaffolding the project, generating pages and routes, wiring navigation and persistence, seeding mock data, and validating the result.

## Responsibilities

- Define the end-to-end sequence for creating a prototype from feature specs
- Specify handoff contracts between Boilerplate, Generation, Navigation, Persistence, and Mock Data
- Govern the composition order: foundation before structure before behavior
- Ensure each stage produces artifacts the next stage depends on

## Non-Responsibilities

- Does not define individual feature behavior (each feature has its own spec)
- Does not prescribe UI layout or visual design
- Does not specify runtime behavior of generated prototypes
- Does not cover production deployment or testing

## Business Rules

1. **Boilerplate first** — Prototype Boilerplate must be applied before any other Proto Runtime feature is initialized
2. **Generation follows boilerplate** — Generation Process runs only after the application shell is verified Ready
3. **Navigation depends on generation** — Navigation routes are created during generation; navigation cannot be configured before page generation completes
4. **Persistence depends on mock data** — Persistence cannot activate without seed data from Mock Data
5. **All or nothing initialization** — If any Proto Runtime subsystem fails to initialize, the prototype must report the specific failure rather than starting with degraded behavior

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Authoring Pipeline** | The sequential stages a prototype passes through from empty shell to functional application |
| **Stage Contract** | The inputs a stage expects and the outputs it produces for the next stage |
| **Dependency Chain** | The ordering constraint: Boilerplate → Generation → Navigation → Mock Data → Persistence |

## States

- **Scaffolding** — Boilerplate is being applied; application shell and directory structure created
- **Generating** — Pages, views, and routes being produced from feature specifications
- **Wiring** — Navigation, localization, and theming integrated into generated pages
- **Seeding** — Mock data loaded and persistence initialized
- **Validating** — Prototype author verifies the generated application runs correctly
- **Complete** — Prototype is interactive and ready for stakeholder review
- **Failed** — A stage in the pipeline encountered an error

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Scaffolding | Generating | Boilerplate application completes successfully |
| Scaffolding | Failed | Boilerplate initialization fails |
| Generating | Wiring | All pages and routes generated successfully |
| Generating | Failed | Generation encounters a parse or write error |
| Wiring | Seeding | Navigation, localization, and theme integration verified |
| Wiring | Failed | Navigation route table is empty or misconfigured |
| Seeding | Validating | Mock data loaded and persistence active |
| Seeding | Failed | Seed data fails to load or schema mismatch detected |
| Validating | Complete | Prototype author confirms the application runs |
| Validating | Scaffolding | Author decides to restart with different boilerplate config |

## Edge Cases

- **Skipped generation**: Boilerplate applied but generation skipped — prototype has navigation shell with no pages
- **Partial seeding**: Some mock data sets load while others fail — prototype runs with partial data
- **Re-generation**: Generation runs on an existing prototype — existing pages may be overwritten
- **Circular dependency**: A generated page navigates to another generated page that navigates back — no-op for generation, but navigation may loop
- **Empty feature spec**: No features defined — generation produces an empty prototype with only the shell

## Error Conditions

- **Boilerplate initialization failure** — Application shell cannot be created; subsequent stages cannot start
- **Generation parse failure** — Feature specifications cannot be read; no pages generated
- **Navigation wiring failure** — Generated routes are invalid or produce unresolvable navigation targets
- **Seed data schema mismatch** — Mock data does not match component expectations; rendering may produce incorrect output
- **Stage dependency missing** — A stage attempts to run before its prerequisite stage completes

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Boilerplate initialization failure | Verify the target directory is writable and required subsystems are available; retry |
| Generation parse failure | Check feature spec format and file paths; fix and re-run generation |
| Navigation wiring failure | Review generated route table for invalid targets; correct feature spec and re-run generation |
| Seed data schema mismatch | Verify mock data structure matches the component props expected; update seed data |
| Stage dependency missing | Run the prerequisite stage first; do not skip stages in the pipeline |

## Authorization

**Visibility:** Internal — the prototype authoring workflow is a developer-facing pipeline; not exposed in end-user prototypes.

## User Journey

### Entry Conditions
A developer has a set of feature specifications and wants to create an interactive prototype for stakeholder validation.

### Primary Flow
The developer applies the Prototype Boilerplate to scaffold the application shell, runs the Generation Process to produce pages and routes from feature specs, verifies navigation and theming work correctly, seeds mock data, confirms persistence is active, and delivers the prototype to stakeholders.

### Alternate Flows
The developer skips generation and manually creates pages and routes within the boilerplate shell for custom prototypes.

### Failure Flows
Generation encounters a parse error in the feature specs — the developer fixes the spec format and re-runs generation.

### Recovery Flows
The developer returns to the boilerplate stage, adjusts configuration, and re-runs each stage sequentially until validation passes.

### Exit Conditions
The prototype is interactive, data-driven, and ready for stakeholder review without requiring backend services.

## Workflow

### Trigger
A developer initiates prototype creation from feature specifications.

### Preconditions
Proto Runtime is available. Feature specifications exist in a parsable format.

### Steps
1. Apply Prototype Boilerplate to create the application shell
2. Run Generation Process to produce pages, views, and routes
3. Verify navigation routing resolves correctly
4. Load mock data seed sets
5. Initialize persistence
6. Validate prototype runs end-to-end

### Outcomes
An interactive prototype is available for stakeholder review, demonstration, or UX validation.

### Exceptions
A stage fails — the developer fixes the root cause and re-runs from the failed stage.

### Completion Criteria
The prototype navigates correctly, persists data across interactions, displays seeded content, and responds to theme and language changes.

## Verification

- **Boilerplate → Generation handoff**: Verify the generated pages directory exists and contains expected files
- **Generation → Navigation handoff**: Verify route table contains entries for every generated page
- **Mock Data → Persistence handoff**: Verify seed data is accessible after persistence initialization
- **End-to-end smoke test**: Open prototype, navigate to each page, create and persist a record, switch theme, switch language

## See Also

- [Proto Runtime Overview](../proto-runtime/overview.md) — entry point for Proto Runtime capabilities
- [Prototype Boilerplate](../proto-runtime/boilerplate.md) — foundation for the prototype application shell
- [Generation Process](../proto-runtime/prototype-generation.md) — spec-to-prototype scaffolding
- [Navigation](../proto-runtime/navigation.md) — screen and workflow navigation
- [Persistence](../proto-runtime/persistence.md) — local data retention
- [Mock Data](../proto-runtime/mock-data.md) — prototype datasets and seeding
- [Application Rendering Workflow](./application-rendering.md) — companion workflow for runtime rendering
