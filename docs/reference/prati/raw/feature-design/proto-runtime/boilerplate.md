# Overview

Prototype Boilerplate provides a standardized foundation for building interactive prototypes using Proto Runtime (spec §Overview). The boilerplate reduces setup effort by providing a consistent structure for pages, views, navigation, localization, mock data, and persistence (spec §Overview). Teams use the boilerplate to focus on validating user experience and workflows rather than building prototype infrastructure (spec §Overview).

# Feature Summary

| Field | Value |
|-------|-------|
| **Feature ID** | PROTO-002 |
| **Feature Name** | Prototype Boilerplate |
| **Category** | Template |
| **Priority** | P1 |
| **Component Type** | Template — provides a standardized foundation/structure for building prototypes |
| **Dependencies** | Proto Runtime, Components, Templates, Theming, Localization |
| **Future** | Not specified in the feature spec. The spec defines the boilerplate only for its current scope (dashboard prototypes, administrative applications, form-based applications, workflow applications, internal tool prototypes, desktop application mockups, web application mockups) without roadmap items. |

# User Goals

The developer who consumes the boilerplate aims to:

1. **Create prototypes quickly** — reduce time from concept to interactive demo (spec §Purpose: Accelerate prototype creation; §Benefits: Faster Development).
2. **Follow a consistent structure** — move between prototypes without learning a new organization model (spec §Core Principles — Consistency; §Benefits: Consistent Structure).
3. **Reuse patterns across prototypes** — avoid building the same infrastructure repeatedly (spec §Purpose: Encourage reuse, Reduce setup effort).
4. **Adhere to design system rules** — ensure prototypes comply with Atomic Design, theme, localization, accessibility, and responsive rules (spec §Core Principles — Design System Compliance; §Benefits: Better Design System Adoption).
5. **Get immediate localization support** — make all user-facing content localizable without extra setup (spec §Provided Capabilities — Localization Integration; §Success Criteria).
6. **Get immediate theme support** — automatically participate in theme switching and token resolution (spec §Provided Capabilities — Theme Integration; §Success Criteria).
7. **Navigate with minimal configuration** — connect screens and workflows without building navigation infrastructure (spec §Provided Capabilities — Navigation Integration; §Success Criteria).
8. **Integrate mock data easily** — demonstrate realistic behavior without backend services (spec §Provided Capabilities — Mock Data Integration; §Success Criteria).
9. **Use local persistence** — demonstrate realistic data behavior without production storage (spec §Provided Capabilities — Persistence Integration).
10. **Stay focused on validation** — spend time on user experience and workflow validation, not prototype infrastructure (spec §Overview, §Purpose).

# User Journeys

1. **Creating a new prototype** — The developer starts from the boilerplate. The Application Shell initializes navigation, localization, theme support, and persistence support (spec §Application Shell). The developer adds features following the boilerplate's Feature Organization structure (spec §Feature Organization). The prototype is immediately runnable with minimal changes.

2. **Adding a feature to an existing prototype** — The developer creates a self-contained feature module following the boilerplate's predictable structure (spec §Feature Organization). Navigation to the new feature is added through the Navigation Integration mechanism (spec §Navigation Integration). The developer adds mock data for the feature (spec §Mock Data Integration).

3. **Configuring navigation** — The developer defines navigation behavior (screen connections, workflows) without implementing navigation infrastructure (spec §Navigation Integration). The boilerplate resolves navigation setup automatically.

4. **Adding localized content** — The developer places all user-facing strings into the localization system (spec §Localization Integration). The prototype immediately supports the localization system without additional wiring.

5. **Applying a theme** — The developer selects a theme or toggles theme mode. Prototype components automatically resolve theme tokens and participate in theme switching (spec §Theme Integration).

6. **Incorporating mock data** — The developer defines prototype datasets through the Mock Data Integration (spec §Mock Data Integration). Demonstrations use realistic data without requiring backend services.

7. **Using persistence** — The developer configures local persistence for prototype state. The prototype retains data across sessions without production storage (spec §Persistence Integration).

8. **Demonstrating the prototype** — The developer presents a working prototype with navigation, theming, localization, mock data, and persistence fully functional. Observers can validate workflows and user experience (spec §Expected Usage).

# Screen Inventory

The boilerplate is a foundational template, not a screen-based feature. It provides the following structural components that host screens:

| Component | Source (spec section) | Role |
|-----------|----------------------|------|
| Application Shell | §Application Shell | Initializes navigation, localization, theme support, and persistence support. Serves as the root container for all prototype content. |
| Feature Organization structure | §Feature Organization | Predictable directory and module layout for self-contained features. Each feature is independently maintainable. |
| Navigation Integration | §Navigation Integration | Mechanism for connecting screens and defining workflows without implementing navigation infrastructure. |
| Localization Integration | §Localization Integration | Immediate localization support for all user-facing content. |
| Theme Integration | §Theme Integration | Access to Prati theme capabilities; automatic participation in theme switching and token resolution. |
| Mock Data Integration | §Mock Data Integration | Support for prototype datasets that enable realistic demonstrations without backend services. |
| Persistence Integration | §Persistence Integration | Local persistence for prototype state and data, enabling realistic data behavior without production storage. |

The boilerplate explicitly does **not** provide: Business Logic, Backend Systems, Authentication, Authorization, Production APIs, or Domain Logic (spec §Responsibilities — does not provide).

# Interaction Design

The boilerplate is a structural template. Interaction behaviors are determined by the screens and features built on top of it. The boilerplate itself contributes the following interaction foundations:

1. **Navigation activation** — triggering a navigation action (e.g., selecting a screen, advancing a workflow) invokes the Navigation Integration mechanism (spec §Navigation Integration). The developer defines which action maps to which screen.

2. **Theme switching** — changing the active theme or theme mode causes all boilerplate-hosted content to re-resolve theme tokens (spec §Theme Integration). No developer code is needed for components to reflect the new theme.

3. **Persistence trigger** — when prototype state changes, the Persistence Integration layer stores data locally (spec §Persistence Integration). State restoration occurs automatically on prototype reload.

No further interaction behaviors are defined by the spec; all other interaction design is delegated to the features and screens the developer builds using the boilerplate.

# Form Design

N/A — The boilerplate provides foundational structure only; it does not define or render any form fields, validation rules, submission flows, or input components. Forms are added by the developer within features built on top of the boilerplate.

# UX State Design

N/A — The feature spec (§Provided Capabilities, §Responsibilities, §Core Principles, §Success Criteria) does not name, define, or describe any operational states for the boilerplate (such as loading, empty, populated, error, or initialized states). The boilerplate provides infrastructure; states are determined by the prototype features built on top of it.

# Feedback Design

N/A — The feature spec does not define feedback mechanisms for the developer consuming the boilerplate. Feedback (e.g., validation success, navigation confirmation, persistence confirmation) is determined by the screens and features the developer builds using the boilerplate. The spec's Rapid Iteration principle (spec §Core Principles — Rapid Iteration) implies fast creation-modification-validation-demonstration cycles but does not prescribe specific feedback patterns.

# Navigation Design

Navigation is one of the seven provided capabilities (spec §Provided Capabilities — Navigation Integration). The boilerplate provides a consistent mechanism for connecting screens and workflows (spec §Navigation Integration). The developer:

1. Defines which screens exist within the Feature Organization structure (spec §Feature Organization).
2. Configures navigation behavior (which screen connects to which, workflow sequencing) through the Navigation Integration mechanism.
3. Does **not** implement navigation infrastructure — the boilerplate handles routing, screen transitions, and workflow state (spec §Navigation Integration).

The spec does not define specific navigation patterns (tabs, sidebar, top bar, wizard, etc.). The boilerplate supports any navigation pattern the developer configures.

# Responsive Design

The spec mandates that all generated prototypes must follow Responsive Rules as part of Design System Compliance (spec §Core Principles — Design System Compliance: Responsive Rules). The boilerplate ensures that:

1. Prototypes inherit responsive behavior defined in the Prati Design System responsive rules.
2. Layout adaptation across viewports is handled through the design system token and rule system, not through boilerplate-specific breakpoints.
3. The developer applies responsive rules to features and screens built on the boilerplate; the boilerplate does not impose its own responsive behavior.

The spec does not define specific breakpoints, grid systems, or responsive patterns — these are inherited from the design system.

# Accessibility Design

The spec mandates that all generated prototypes must follow Accessibility Rules as part of Design System Compliance (spec §Core Principles — Design System Compliance: Accessibility Rules). The boilerplate ensures:

1. **Application Shell** — the root container renders a semantic `<main>` landmark. All screens rendered within it inherit this landmark.
2. **Navigation Integration** — navigation controls rendered through the boilerplate must expose their role (e.g., `role="navigation"`), be keyboard-operable, and announce current screen or selection state to assistive technology.
3. **Theme Integration** — theme tokens must resolve to color pairs that meet WCAG 2.1 AA contrast ratios (4.5:1 for text, 3:1 for large text and UI components). Theme switching must preserve contrast compliance.
4. **Localization Integration** — localized strings must be exposed to assistive technology via live regions when dynamic content changes, and must support text direction changes (left-to-right, right-to-left) per design system localization rules.
5. **Focus management** — navigation transitions (screen-to-screen, workflow step change) must return focus to the first interactive element of the new screen. The boilerplate enforces this at the shell level so individual features do not need to implement focus management.
6. **Skip navigation** — the Application Shell must include a skip-to-content link as the first focusable element.
7. **Language attribute** — the Application Shell must set the `lang` attribute on the root element, driven by the active localization locale.

The spec does not define additional accessibility requirements; all feature-level accessibility (heading hierarchy, form labeling, error announcements) is the responsibility of the developer building on the boilerplate.

# Localization Design

The spec provides Localization Integration as a provided capability (spec §Provided Capabilities — Localization Integration). The boilerplate requires that all user-facing content participate in the localization system (spec §Localization Integration).

**Localization integration points defined by the spec:**

| Integration Point | Behavior |
|------------------|----------|
| Application Shell title | The prototype's root title string resolves through the localization system. |
| Navigation labels | All navigation entry labels (screen names, workflow step names) resolve through the localization system. |
| Feature content | Every string rendered by features built on the boilerplate must pass through the localization system. |
| Theme-aware locale switching | When locale changes, theme token resolution remains consistent across locales. |

**Strings introduced by the boilerplate itself:**

| String Key | Default Value | Purpose |
|------------|--------------|---------|
| `shell.title` | `"Prototype"` | Root document title; overridden by the developer for each prototype. |
| `shell.skipToContent` | `"Skip to content"` | Text for the skip-navigation link (Accessibility Design §6). |

The spec does not define a complete string inventory; the developer defines feature-specific strings when building on the boilerplate.

**Locale format:** Not specified in the feature spec; follows the design system localization rules.

**Right-to-left support:** Not specified in the feature spec; follows the design system localization rules.

# Design System Traceability

| Boilerplate Element | Design System Rule | Compliance |
|--------------------|-------------------|------------|
| Application Shell | Atomic Design Rules — templates compose organisms into page-level layouts | The shell is a template-level construct that composes navigation, content area, and theme provider. |
| Feature Organization | Atomic Design Rules — each feature contains its own atoms, molecules, organisms, and templates | Features are self-contained per Atomic Design hierarchy. |
| Navigation Integration | Navigation patterns defined in design system interaction philosophy | Navigation mechanism is provider-agnostic and supports any design-system-defined pattern. |
| Theme Integration | Theme Rules (design-system §theme.md) — theme logic, visual contract, token resolution | Prototypes automatically resolve tokens and participate in theme switching per theme rules. |
| Localization Integration | Localization Rules (design-system §localization.md) — i18n requirements, localization × accessibility | All user-facing content localizable per localization rules. |
| Mock Data Integration | No specific design system rule; pattern follows design system data-display component contracts | Mock data shapes match design system component data contracts. |
| Persistence Integration | No specific design system rule; persistence operates below the presentation layer | Persistence is transparent to design system components. |
| Accessibility compliance | Accessibility Rules (design-system §accessibility.md) — a11y standards, ARIA guidance | Shell-level a11y (landmarks, skip nav, focus management, contrast) enforced per accessibility rules. |
| Responsive compliance | Responsive Rules (design-system) | Prototypes inherit responsive tokens and breakpoint behavior from design system. |

# Open Questions

1. **Page Organization vs View Organization** — The spec lists both as separate responsibilities (§Responsibilities) but does not distinguish them. Are "pages" a level above "views," or are they synonymous? The lack of definition may cause inconsistent directory structures across prototypes built on the same boilerplate.

2. **Feature vs Page vs View terminology** — The spec uses "feature" (§Feature Organization), "page" (§Page Organization), and "view" (§View Organization) without defining the hierarchy or boundary between them. A concrete example of how these three concepts nest would resolve ambiguity.

3. **Persistence scope** — The spec (§Persistence Integration) states "local persistence for prototype state and data" but does not specify whether persistence applies to navigation state, feature data, mock data mutations, or all three. The relationship between Mock Data Integration and Persistence Integration (do mock data changes persist?) is unclear.

4. **Navigation pattern specification** — The spec (§Navigation Integration) describes "a consistent mechanism for connecting screens and workflows" but does not specify whether the boilerplate ships with a default navigation pattern (e.g., sidebar, tabs, top bar) or requires the developer to choose one. The term "Application Shell" (§Application Shell) suggests a shell pattern, but its visual layout is undescribed.

5. **Empty shell behavior** — The spec defines what the boilerplate initializes (navigation, localization, theme, persistence) but not what the developer sees when no features have been added. Is there a default landing screen, an empty-state guidance view, or a blank canvas?

6. **Mock data format** — The spec (§Mock Data Integration) does not specify the format or schema for mock datasets. This may lead to inconsistent mock data structures across prototypes built on the same boilerplate.

7. **Future scope** — The spec lists seven intended use cases (dashboard, admin, form, workflow, internal tools, desktop mockups, web mockups) but does not indicate whether mobile-specific prototype support is in scope or out of scope.
