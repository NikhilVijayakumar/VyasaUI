# Prototype Boilerplate

**Feature Area:** Proto Runtime Boilerplate

## Overview

Prototype Boilerplate provides a standardized foundation for building interactive prototypes using Proto Runtime. The boilerplate reduces setup effort by providing a consistent structure for pages, views, navigation, localization, mock data, and persistence. The objective is to allow teams to focus on validating user experience and workflows rather than building prototype infrastructure.

Prototype Boilerplate exists to accelerate prototype creation, promote consistency, encourage reuse, reduce setup effort, and ensure adherence to Prati Design System principles. All generated prototypes should follow a common structure regardless of application domain.

Prototype Boilerplate is intended to support dashboard prototypes, administrative applications, form-based applications, workflow applications, internal tool prototypes, and desktop and web application mockups. Using the boilerplate provides consistent structure, faster development, reduced setup effort, improved maintainability, better design system adoption, easier collaboration, and more realistic demonstrations.

The boilerplate is built on top of Proto Runtime, simplifying consumption of Proto Runtime capabilities by providing a ready-to-use foundation for prototype applications.

## Responsibilities

- **Application Shell** — Provides the foundation for a prototype application. The application shell is responsible for initializing navigation, localization, theme support, and persistence support.
- **Application Structure** — Provides the foundational organization for prototype applications.
- **Page Organization** — Provides a predictable structure for organizing prototype pages.
- **View Organization** — Provides a predictable structure for organizing prototype views.
- **Feature Organization** — Provides a predictable structure for organizing prototype features. Each feature should remain self-contained and independently maintainable.
- **Navigation Integration** — Provides a consistent mechanism for connecting screens and workflows. Applications can define navigation behavior without implementing navigation infrastructure.
- **Localization Integration** — Provides immediate localization support. All user-facing content should participate in the localization system.
- **Theme Integration** — Provides access to Prati theme capabilities. Prototypes should automatically participate in theme switching and token resolution.
- **Mock Data Integration** — Provides support for prototype datasets. Mock data allows realistic demonstrations without requiring backend services.
- **Persistence Integration** — Provides local persistence for prototype state and data. Applications can demonstrate realistic data behavior without production storage.

## Non-Responsibilities

- Business Logic
- Backend Services
- Authentication
- Authorization
- Production APIs
- Domain Services

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Application Shell** | The foundational structure that initializes all prototype subsystems |
| **Feature Organization** | Predictable directory and file layout for prototype features |
| **Integration Points** | Pre-configured connections to navigation, localization, theme, and persistence |

## Business Rules

1. ALL prototype applications MUST follow a predictable structure so that developers can move between prototypes without learning a new organization model.
2. Generated prototypes MUST follow Atomic Design Principles, theme rules, localization rules, accessibility rules, and responsive rules.
3. Prototypes MUST remain independent of React, Electron, backend frameworks, and production architectures; they should execute using Proto Runtime assets only.
4. The boilerplate MUST optimize for fast creation, fast modification, fast validation, and fast demonstration rather than production readiness.
5. ALL integration points (navigation, localization, theme, persistence) MUST be pre-configured and functional with minimal configuration required.

## States

- **Uninitialized** — Boilerplate not yet applied; no prototype structure exists
- **Initializing** — Application shell being created; subsystems being configured
- **Ready** — Boilerplate applied; prototype is structured and subsystems initialized
- **Error** — Boilerplate initialization encountered a failure

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Initializing | Boilerplate generation or application starts |
| Initializing | Ready | All subsystems (navigation, localization, theme, persistence) configured |
| Initializing | Error | A required subsystem fails during configuration |
| Error | Initializing | Re-initialization triggered after error resolution |

## Edge Cases

- **Incomplete boilerplate**: Some integration points missing; prototype runs with degraded capabilities
- **Overwritten configuration**: User modifications overwritten when boilerplate is re-applied
- **Empty feature directory**: No features defined; prototype shell has no pages or views
- **Nested prototype**: Boilerplate applied inside an existing prototype; may conflict

## Error Conditions

- **Subsystem configuration failure** — Navigation, localization, theme, or persistence fails during setup
- **Directory creation failure** — Required directories cannot be created
- **Configuration merge conflict** — Boilerplate configuration conflicts with existing prototype setup

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Subsystem configuration failure | Verify subsystem dependencies and configuration; retry initialization after resolving the failing subsystem |
| Directory creation failure | Check file permissions and disk space; ensure the parent directory is accessible and writable |
| Configuration merge conflict | Review conflicting configuration entries; manually resolve conflicts or create a fresh prototype from clean boilerplate |

## Authorization

**Visibility:** Internal — prototype boilerplate is a developer-facing feature; not exposed in end-user applications.

## User Journey

### Entry Conditions

A user wants to create an interactive prototype and needs a standardized foundation. Feature documentation or specifications are available.

### Primary Flow

1. User applies the Prototype Boilerplate to create a new prototype project.
2. Application shell initializes navigation, localization, theme, and persistence subsystems.
3. User organizes features using the boilerplate's predictable directory structure.
4. User adds pages, views, and mock data within the boilerplate framework.
5. Prototype is ready for demonstration and user validation.

### Alternate Flows

- User re-applies boilerplate to an existing prototype, potentially overwriting custom modifications.
- User extends the boilerplate structure with custom integration points for project-specific needs.

### Failure Flows

- Subsystem configuration fails during initialization; prototype cannot start fully.
- Boilerplate is applied inside an existing prototype, causing configuration conflicts.

### Recovery Flows

- Resolve subsystem configuration issues and re-initialize.
- Resolve merge conflicts manually or create a fresh prototype from scratch.

### Exit Conditions

The prototype has a solid foundation with working navigation, localization, theme support, persistence, and a consistent structure ready for feature implementation and validation.

## Workflow

### Trigger

A team needs to create a new prototype and requires a standardized project foundation.

### Preconditions

- Proto Runtime is available.
- Prati Design System components, theming, localization, navigation, and persistence features are accessible.
- Feature specifications exist or the team understands the prototype scope.

### Steps

1. Apply boilerplate to create the prototype project shell.
2. Initialize navigation, localization, theme, and persistence subsystems.
3. Organize features within the boilerplate directory structure.
4. Integrate mock data for realistic demonstrations.
5. Build and iterate on prototype screens and workflows.

### Outcomes

A structured prototype application with pre-configured navigation, localization, theming, and persistence — ready for feature development and user validation.

### Exceptions

- Subsystem configuration failure prevents full initialization.
- Directory creation failure blocks boilerplate application.
- Configuration merge conflict when re-applying to an existing prototype.

### Completion Criteria

New prototypes can be created quickly, teams follow a consistent structure, design system principles are preserved, localization is immediately available, theme support is immediately available, navigation works with minimal configuration, mock data can be integrated easily, and prototypes remain focused on validation rather than infrastructure.

## Verification

1. **Structure**: Verify that applying the boilerplate produces a consistent directory and file structure across different prototype projects.
2. **Initialization**: Verify that navigation, localization, theme, and persistence subsystems initialize automatically with the boilerplate.
3. **Independence**: Verify that prototypes created from the boilerplate are independent of React, Electron, and backend frameworks.
4. **Localization**: Verify that user-facing content in boilerplate-based prototypes participates in the localization system.
5. **Theming**: Verify that boilerplate-based prototypes automatically participate in theme switching and token resolution.

## See Also

- [Proto Runtime Overview](./overview.md)
- [Generation Process](./prototype-generation.md)
- [Navigation](./navigation.md)
- [Persistence](./persistence.md)
- [Mock Data](./mock-data.md)
- [HTML Components](./html-components.md)
- [Theming](../../architecture/core/theming.md)
- [Localization](../../architecture/core/localization.md)
- [../workflows/prototype-authoring.md](../workflows/prototype-authoring.md)
- [../concepts/glossary.md](../concepts/glossary.md)
- [../concepts/authorization.md](../concepts/authorization.md)
