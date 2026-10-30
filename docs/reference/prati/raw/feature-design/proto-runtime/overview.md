# Overview

Proto Runtime is a Prati feature that enables creation of interactive application prototypes using Prati Design System principles. Unlike traditional mockup systems that generate static HTML screens, Proto Runtime generates realistic prototypes that support navigation, data persistence, localization, theming, validation states, and user workflows. Proto Runtime allows teams to validate application behavior before implementation while remaining independent from production infrastructure.

Proto Runtime combines Presentation, Presentation Logic, and Mock Persistence to simulate application behavior. It does not implement Business Logic, Backend Systems, Authentication, Authorization, Production Persistence, API Integration, or Application Architecture.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | PROTO-001 |
| Feature Name | Proto Runtime |
| Category | Concept |
| Priority | P0 |
| Dependencies | Components, Templates, Theming, Localization |
| Future | API Clients, Data Access Layers, Business Rules, Authentication Providers, Authorization Systems, Production Databases, Synchronization Engines, Microservice Integration — these concerns belong to application implementation rather than prototyping |

# User Goals

1. Validate application behavior before implementation by creating interactive prototypes.
2. Demonstrate navigation, workflows, and validation states to stakeholders.
3. Persist prototype data between sessions without backend services.
4. Evaluate application experience across viewports, themes, and locales.
5. Conduct design verification, feature demonstrations, and prototype-based discussions using realistic prototypes.

# User Journeys

## Creating a Prototype

The developer selects Prati components and templates to compose screens, defines mock data, and configures navigation routes and workflow sequences. Proto Runtime generates an interactive prototype with boilerplate structure, HTML component runtime, and mock persistence layer. No backend services or production infrastructure are required.

## Navigating a Prototype

The developer or stakeholder opens the generated prototype and moves between screens via route navigation, screen navigation, workflow navigation, or deep linking. Navigation behavior simulates the target application's flow. Themes, localization, and responsive rules are active during navigation.

## Persisting Data Across Sessions

The developer or stakeholder enters or modifies data within the prototype, then closes and reopens the session. Previously entered data is available because Proto Runtime provides local persistence between sessions without external services.

# Screen Inventory

N/A — Proto Runtime is a system concept consumed by developers to generate prototypes. It does not define specific end-user screens or UI pages. Screens are composed by developers using Prati Components and Templates.

# Interaction Design

Proto Runtime is consumed by developers, not end-users. Developer interactions include:

- **Creating a prototype**: Developer selects components, templates, mock data, and navigation configuration. Proto Runtime assembles these inputs into a runnable interactive prototype with boilerplate, HTML component runtime, and mock persistence.
- **Navigating a prototype**: Developer or stakeholder clicks links, buttons, or navigates via routes within the generated prototype. Proto Runtime evaluates navigation configuration and presents the target screen with correct theme, locale, and data state.
- **Persisting data**: Developer or stakeholder fills form fields, adds records, or modifies data within the prototype. Proto Runtime stores data locally so it persists across browser sessions.
- **Demonstrating workflows**: Developer or stakeholder steps through CRUD flows, wizard flows, review flows, or approval flows. Proto Runtime progresses the workflow through configured states and validates transitions.

# Form Design

N/A — Proto Runtime is a system concept, not a form component. It enables form-based prototypes by providing validation state support and mock persistence for form data, but does not define form layout, field types, or submission behavior itself. Form design is delegated to Prati Components and Templates.

# UX State Design

The feature specification names the following UX-relevant states:

- **Validation states**: Proto Runtime provides validation state support, making validation states visible in prototypes. The spec does not enumerate specific validation states (e.g., valid, invalid, warning). State values are determined by the consuming component definitions.

No additional states (Initial, Loading, Empty, Success, Error) are named in the specification for Proto Runtime itself.

# Feedback Design

- **Navigation feedback**: When a navigation action is taken, Proto Runtime presents the target screen. If the route or target screen is invalid, navigation does not proceed.
- **Persistence feedback**: Data entered in a prototype persists between sessions without explicit save actions. The developer or stakeholder observes data continuity on return visits.
- **Workflow feedback**: Workflow transitions (e.g., moving from one wizard step to the next) display the next state in the configured flow sequence. Incorrect transitions are prevented per workflow configuration.

# Navigation Design

Proto Runtime provides four navigation capabilities:

- **Route Navigation**: Screens are accessible via configured routes.
- **Screen Navigation**: Direct transitions between screens are supported.
- **Workflow Navigation**: Multi-step flows (CRUD, wizard, review, approval) guide the user through a defined sequence.
- **Deep Linking**: Specific screens or states within the prototype can be accessed directly via links.

Navigation behavior follows Prati template composition and component interaction rules.

# Responsive Design

Proto Runtime consumes Prati Responsive Rules. The success criteria require that screens respond correctly across viewports. Proto Runtime does not define its own responsive behavior — it relies on the Prati Design System responsive infrastructure applied through components and templates.

# Accessibility Design

Proto Runtime requires that all generated prototypes follow Prati Accessibility Rules. The HTML Component Runtime must implement components that conform to established accessibility requirements. Specific WCAG requirements are defined by the Prati Design System Accessibility rules and are inherited by all Proto Runtime component implementations. The spec does not enumerate discrete WCAG criteria — those are governed by the referenced Accessibility Rules.

# Localization Design

Proto Runtime mandates that all user-facing content in prototypes must support localization and follow Prati Localization Rules. Specific strings and values that must be localizable include:

- All component labels and text content rendered by the HTML Component Runtime
- Navigation labels and route display names
- Mock data that contains user-facing strings (e.g., example names, addresses, status labels)
- Workflow step titles, descriptions, and action labels
- Validation messages and state indicators
- Any template-level headings, instructions, or help text

Localization is consumed from the Prati Localization System — Proto Runtime does not define its own localization infrastructure.

# Design System Traceability

| Rule Set | Application to Proto Runtime |
|----------|------------------------------|
| Core Design Rules | Proto Runtime follows all Prati Design System rules and architecture invariants |
| Premium UI Patterns | N/A — Proto Runtime is a concept for generating prototypes; Premium UI Patterns apply to produced prototypes via components |
| Atomic Rules | Proto Runtime consumes component definitions and design principles; atomic composition rules apply through component usage |
| Accessibility Rules | HTML Component Runtime follows Accessibility Rules for all component implementations |
| Localization Rules | All user-facing content follows Prati Localization Rules |
| Theme Rules | Proto Runtime consumes the Prati Theme System; theme behavior and token resolution follow Theming feature contracts |

# Open Questions

1. **Mock data schema**: How does mock data get defined and provided — through fixture files, data generators, or schema-based factories? The spec does not describe the mechanism.
2. **Validation state enumeration**: What specific validation states does Validation State Support cover? The spec names the capability but does not enumerate states.
3. **Deep Linking scope**: Does deep linking support parameterized state (e.g., pre-filling form fields from a link) or only screen-level targeting?
4. **Workflow configuration**: How are CRUD, wizard, review, and approval flows configured — through declarative files, code, or a visual editor?
5. **Persistence boundary**: Does "local persistence" mean browser storage (localStorage, IndexedDB) or a local file/server process? What is the storage limit or eviction policy?
6. **Template-to-Runtime relationship**: Does the HTML Component Runtime render templates as-is, or does it decorate them with runtime behavior (navigation wiring, data binding)?
