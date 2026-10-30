# Proto Runtime Overview

**Feature Area:** Proto Runtime Overview

## Overview

Proto Runtime is a Prati feature that enables creation of interactive application prototypes using Prati Design System principles. Unlike traditional mockup systems that generate static HTML screens, Proto Runtime generates realistic prototypes that support navigation, data persistence, localization, theming, validation states, and user workflows. Proto Runtime allows teams to validate application behavior before implementation while remaining independent from production infrastructure.

Proto Runtime exists to support interactive mockups, feature demonstrations, user experience validation, workflow validation, stakeholder reviews, design verification, and prototype-based discussions. The goal is to create realistic application prototypes without requiring backend services or production implementation.

Proto Runtime combines Presentation, Presentation Logic, and Mock Persistence to simulate application behavior. It is intended for business applications, dashboard prototypes, form-based applications, administrative applications, workflow demonstrations, internal tools, and desktop and web application prototypes.

Proto Runtime extends Prati's capabilities by enabling creation of interactive prototypes while continuing to use the same design system principles, themes, localization infrastructure, and component standards.

## Responsibilities

- **Prototype Boilerplate** — Provides a standard project structure for building interactive prototypes.
- **HTML Component Runtime** — Provides HTML implementations of Prati design system components. These components follow design tokens, theme rules, localization rules, accessibility rules, and responsive rules.
- **Navigation Support** — Provides navigation capabilities for prototype applications including route navigation, screen navigation, workflow navigation, and deep linking.
- **Mock Data Support** — Provides support for prototype data. Mock data allows prototypes to simulate realistic application behavior without backend services.
- **Data Persistence** — Provides local persistence for prototype data. Data remains available between sessions without requiring external services.
- **Workflow Simulation** — Provides support for simulating application workflows including CRUD flows, wizard flows, review flows, and approval flows.
- **Validation State Support** — Supports validation state rendering in prototypes.

Proto Runtime consumes existing Prati capabilities: Components, Templates, Theming, and Localization. Proto Runtime follows all Prati Design System rules and architecture invariants.

## Non-Responsibilities

- API Clients
- Repository Layers
- Domain Services
- Business Rules
- Business Logic
- Authentication Providers
- Authorization Systems
- Backend Services
- Authentication
- Authorization
- Production Databases
- Synchronization Engines
- Microservice Integration
- Production Persistence
- API Integration
- Application Architecture

These concerns belong to application implementation rather than prototyping. Proto Runtime is not intended to implement production infrastructure.

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Presentation** | Visual rendering of prototype screens and components |
| **Presentation Logic** | Interactive behavior without business logic |
| **Mock Persistence** | Local data storage simulating real application state |
| **Workflow Simulation** | Multi-step flows demonstrated without backend services |

## Business Rules

1. ALL prototype navigation must function without backend services or production infrastructure.
2. Prototype data MUST persist between sessions using local storage only, without external services.
3. Themes MUST function correctly across all prototype screens and must respect Prati theme contracts.
4. ALL user-facing content MUST support localization and follow Prati localization rules.
5. Validation states MUST be visible and demonstrable without executing real business logic.

## States

- **Uninitialized** — Proto Runtime not yet loaded; no prototype features available
- **Initializing** — Boilerplate loading; components, theme, and localization being set up
- **Ready** — Prototype initialized and interactive; navigation and persistence available
- **Error** — Initialization failed; prototype cannot start

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Initializing | Prototype application starts loading |
| Initializing | Ready | All subsystems (theme, localization, navigation, persistence) initialized |
| Initializing | Error | A required subsystem fails to initialize |
| Error | Initializing | Retry triggered by prototype author |

## Edge Cases

- **Initialization timeout**: One or more subsystems fail to load within expected time
- **Partial initialization**: Theme initializes but persistence fails; prototype runs with degraded functionality
- **Multiple rapid initializations**: Consecutive start/stop cycles may leave stale state
- **Missing configuration**: Boilerplate configuration incomplete; prototype defaults to safe values

## Error Conditions

- **Subsystem initialization failure** — Theme, localization, navigation, or persistence fails to load
- **Missing required subsystem** — A subsystem required by the prototype is not available
- **Configuration error** — Prototype configuration is malformed or incomplete

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Subsystem initialization failure | Retry initialization after verifying subsystem dependencies and configuration |
| Missing required subsystem | Verify boilerplate completeness; ensure all required subsystems are included before starting |
| Configuration error | Validate configuration against expected schema; reset to safe defaults and report invalid fields |

## Authorization

**Visibility:** Internal — Proto Runtime is a developer-facing feature for creating prototypes; not exposed in end-user applications.

## User Journey

### Entry Conditions

A user has feature documentation, feature design documentation, or feature technical documentation that defines what the prototype should represent. The user intends to create an interactive prototype using Prati Design System principles.

### Primary Flow

1. User creates a new prototype using the Prototype Boilerplate.
2. User configures the prototype with navigation, localization, theming, mock data, and persistence.
3. User builds interactive screens using the HTML Component Runtime.
4. User demonstrates workflows, navigation, and validation states.
5. Stakeholders evaluate the application experience and provide feedback.

### Alternate Flows

- User extends an existing prototype with new features rather than creating from scratch.
- User reuses mock data and configurations from previous prototype projects.

### Failure Flows

- Required subsystems fail to initialize; prototype cannot start.
- Configuration is incomplete or malformed; prototype defaults to safe values with degraded capabilities.

### Recovery Flows

- Retry initialization after verifying subsystem configuration and dependencies.
- Correct malformed configuration entries and reload the prototype.

### Exit Conditions

Stakeholders have evaluated the prototype and validated the application behavior, workflows, and user experience. The prototype is either iterated upon based on feedback or used as a reference for production implementation.

## Workflow

### Trigger

A team needs to validate application behavior, workflows, or user experience before production implementation.

### Preconditions

- Prati Design System components and templates are available.
- Theme, localization, and other Prati features are accessible.
- Feature documentation or specifications exist.

### Steps

1. Initialize Proto Runtime with boilerplate configuration.
2. Load theme and localization subsystems.
3. Set up navigation and persistence subsystems.
4. Render prototype screens using HTML component implementations.
5. Enable workflow simulation with mock data.
6. Present interactive prototype for stakeholder evaluation.

### Outcomes

A realistic, interactive prototype that supports navigation, data persistence, localization, theming, validation states, and user workflows — all without backend services or production infrastructure.

### Exceptions

- Subsystem initialization failure prevents prototype from starting.
- Missing required subsystem leads to degraded prototype functionality.
- Malformed configuration causes unexpected prototype behavior.

### Completion Criteria

Users can navigate the application, workflows can be demonstrated, validation states are visible, themes function correctly, localization functions correctly, data persists between sessions, screens respond correctly across viewports, and stakeholders can evaluate the application experience — without requiring backend services or production infrastructure.

## Verification

1. **Navigation**: Verify that navigation between all prototype screens works correctly without backend services.
2. **Persistence**: Verify that prototype data persists between browser sessions using local storage only.
3. **Theming**: Verify that theme switching and token resolution function correctly across all prototype screens.
4. **Localization**: Verify that all user-facing content displays in the configured locale and follows Prati localization rules.
5. **Validation**: Verify that validation states render correctly for form inputs and workflow steps without executing business logic.

## See Also

- [Prototype Boilerplate](./boilerplate.md)
- [Generation Process](./prototype-generation.md)
- [HTML Components](./html-components.md)
- [Navigation](./navigation.md)
- [Mock Data](./mock-data.md)
- [Persistence](./persistence.md)
- [Components](../../design-system/components/README.md)
- [Templates](../../design-system/templates/README.md)
- [Theming](../../architecture/core/theming.md)
- [Localization](../../architecture/core/localization.md)
- [../workflows/prototype-authoring.md](../workflows/prototype-authoring.md)
- [../concepts/glossary.md](../concepts/glossary.md)
- [../concepts/authorization.md](../concepts/authorization.md)
