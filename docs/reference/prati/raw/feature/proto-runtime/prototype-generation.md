# Generation Process

**Feature Area:** Proto Runtime Generation

## Overview

Generation Process is the capability that transforms feature specifications into executable prototypes. The objective is to reduce manual prototype construction by producing a structured prototype application from documented requirements. Generation allows teams to move from feature definition to interactive prototype more efficiently while maintaining consistency with Prati Design System principles.

Generation Process exists to accelerate prototype creation, improve consistency, reduce manual effort, standardize prototype structure, and improve design system adoption. The goal is to create realistic prototype applications directly from feature specifications.

Generation Process consumes feature specifications including feature documentation, feature design documentation, and feature technical documentation. It may produce pages, views, components, routes, navigation configuration, localization resources, mock data, and application configuration — forming a runnable prototype application. It is intended to support feature demonstrations, UX validation, workflow validation, stakeholder reviews, internal prototypes, and application mockups.

## Responsibilities

- **Prototype Scaffolding** — Creates the initial prototype directory structure and configuration.
- **Feature Structure Creation** — Organizes prototype features in a predictable layout.
- **Page Generation** — Produces page-level components from feature definitions.
- **View Generation** — Produces view-level components within pages.
- **Route Generation** — Creates navigation routes between pages and views.
- **Localization Generation** — Produces localization entries for user-facing content.
- **Mock Data Generation** — Produces initial datasets matching feature data shapes.
- **Configuration Generation** — Produces application configuration from specifications.

## Non-Responsibilities

- Business Logic Implementation
- Backend Development
- API Integration
- Production Architecture
- Production Services
- Production of Production Applications
- Generation of Business Logic
- Generation of Backend Services
- Generation of Security Infrastructure
- Replacement of Software Development

Its purpose is prototype creation and validation, not production implementation.

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Scaffolding** | Creating the initial prototype directory structure and configuration |
| **Page Generation** | Producing page-level components from feature definitions |
| **View Generation** | Producing view-level components within pages |
| **Route Generation** | Creating navigation routes between pages and views |
| **Mock Data Generation** | Producing initial datasets matching feature data shapes |

## Business Rules

1. ALL generated artifacts MUST follow Atomic Design Principles, theme rules, localization rules, accessibility rules, and responsive rules.
2. Generation MUST NOT bypass Prati Design System requirements under any circumstances.
3. ALL generated applications MUST follow a common structure, naming convention, design rules, and organization pattern to ensure consistency across prototypes.
4. ALL generated artifacts MUST be localization-ready and follow Prati localization requirements.
5. ALL generated artifacts MUST automatically participate in the Prati Theme System without additional configuration.

## States

- **Idle** — Generation process ready but not started
- **Scaffolding** — Prototype directory structure being created
- **Generating Pages** — Page and view components being produced
- **Generating Resources** — Routes, localization entries, and mock data being produced
- **Complete** — All artifacts generated; prototype is runnable
- **Failed** — Generation encountered an error; partial artifacts may exist

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Scaffolding | Generation process started from feature specifications |
| Scaffolding | Generating Pages | Directory structure created successfully |
| Generating Pages | Generating Resources | All pages generated successfully |
| Generating Resources | Complete | All resources generated successfully |
| Any state | Failed | An error occurs during any generation step |

## Edge Cases

- **Empty feature specification**: No features defined; generation produces an empty prototype shell
- **Duplicate feature names**: Two features with the same name cause file collision
- **Partial generation failure**: Pages succeed but resources fail; prototype may run with missing routes
- **Overwrite existing files**: Generation runs on an existing prototype directory; behavior depends on configuration

## Error Conditions

- **Feature spec parse failure** — Input specifications cannot be read or parsed
- **File write failure** — Generated files cannot be written to the output directory
- **Name collision** — Two generated artifacts map to the same file path
- **Missing required configuration** — Generation configuration is incomplete

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Feature spec parse failure | Validate input specifications format and syntax; fix parsing errors before retrying generation |
| File write failure | Check file permissions and disk space; ensure output directory is writable and accessible |
| Name collision | Review feature definitions for duplicate names; resolve naming conflicts before retrying generation |
| Missing required configuration | Verify generation configuration completeness; provide default values for missing configuration fields |

## Authorization

**Visibility:** Internal — prototype generation is a developer-facing feature; not exposed in end-user applications.

## User Journey

### Entry Conditions

A team has feature documentation, feature design documentation, or feature technical documentation that defines what the prototype should represent. The Prototype Boilerplate foundation is available.

### Primary Flow

1. User invokes the generation process with feature specifications as input.
2. Generation process scaffolds the prototype directory structure.
3. Pages and views are generated from feature definitions.
4. Routes, localization entries, and mock data are generated.
5. Application configuration is generated.
6. A runnable prototype application is produced.

### Alternate Flows

- Generation runs on an existing prototype directory, potentially overwriting existing files depending on configuration.
- User manually extends or modifies generated artifacts after generation completes.

### Failure Flows

- Feature specification parsing fails; no artifacts are generated.
- Partial generation failure leaves some artifacts missing; prototype may run with degraded capabilities (e.g., missing routes).
- Name collision occurs; two generated artifacts map to the same file path.

### Recovery Flows

- Fix feature specification errors and re-run generation.
- Resolve file conflicts or naming collisions and retry generation.
- Provide missing configuration values and restart generation.

### Exit Conditions

A runnable prototype application is produced that follows Prati standards, supports localization, theming, navigation, and persistence, and allows teams to rapidly validate feature ideas.

## Workflow

### Trigger

A team needs to create an interactive prototype from documented feature specifications.

### Preconditions

- Feature specifications (documentation, design documentation, technical documentation) are available.
- Prototype Boilerplate foundation is installed.
- Prati Design System components, theming, localization, navigation, and persistence features are accessible.
- Generation configuration is complete.

### Steps

1. Parse input feature specifications.
2. Scaffold prototype directory structure.
3. Generate page-level and view-level components.
4. Generate navigation routes.
5. Generate localization resources.
6. Generate mock data.
7. Generate application configuration.
8. Produce a runnable prototype application.

### Outcomes

A realistic, interactive prototype generated from documented feature specifications, following Prati standards, with localization, theming, navigation, and persistence support — independent from production implementation.

### Exceptions

- Feature spec parse failure prevents generation from starting.
- File write failure stops generation mid-process.
- Name collision causes file conflicts.
- Missing required configuration results in incomplete prototype.

### Completion Criteria

Prototype creation effort is reduced, generated artifacts follow Prati standards, generated applications remain consistent, localization is supported, theme support is available, navigation is available, persistence is available, and teams can rapidly validate feature ideas.

## Verification

1. **Consistency**: Verify that generated artifacts (pages, views, routes, localization, mock data) follow Prati Design System standards across multiple generation runs.
2. **Structure**: Verify that generated prototypes have a consistent directory structure and naming convention.
3. **Localization**: Verify that localization resources are generated and functional for all user-facing content in the generated prototype.
4. **Theming**: Verify that generated prototypes support theme switching without additional configuration.
5. **Navigation**: Verify that navigation routes are correctly wired between all generated pages and views.

## See Also

- [Prototype Boilerplate](./boilerplate.md)
- [Proto Runtime Overview](./overview.md)
- [HTML Components](./html-components.md)
- [Navigation](./navigation.md)
- [Persistence](./persistence.md)
- [Mock Data](./mock-data.md)
- [Localization](../../architecture/core/localization.md)
- [Theming](../../architecture/core/theming.md)
- [../workflows/prototype-authoring.md](../workflows/prototype-authoring.md)
- [../concepts/glossary.md](../concepts/glossary.md)
- [../concepts/authorization.md](../concepts/authorization.md)
