# HTML Components

**Feature Area:** Proto Runtime — Reusable UI building blocks

## Overview

HTML Components provide the visual foundation for Proto Runtime applications. They enable prototype applications to use Prati Design System principles without requiring React, Electron, or application frameworks. HTML Components allow prototypes to simulate realistic application behavior while remaining lightweight and framework independent. They exist to provide reusable user interface building blocks for prototype applications, ensuring that prototypes follow the same design language, accessibility requirements, localization requirements, and theme rules used throughout Prati.

HTML Components follow the same design principles as Prati Components, including atomic design, design tokens, theme rules, localization rules, accessibility rules, and responsive rules. The objective is visual and behavioral consistency across prototype applications. HTML Components are intended for dashboard prototypes, administrative applications, workflow applications, form-based applications, internal tools, feature demonstrations, and interactive mockups. They provide design consistency, framework independence, theme compatibility, localization compatibility, accessibility compliance, rapid prototyping, and reusability — allowing teams to build realistic prototypes without introducing production dependencies.

## Responsibilities

- User Interface Rendering
- Design Token Consumption
- Theme Integration
- Localization Integration
- Responsive Behavior
- Accessibility Support
- Interaction Support

## Non-Responsibilities

- Business Logic
- Domain Logic
- API Integration
- Application Architecture
- Backend Connectivity
- Production Application Frameworks
- State Management Frameworks
- Domain Services

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Design Token Consumption** | Using shared color, spacing, and typography values for visual consistency |
| **Framework Independence** | Operating without React, Vue, Angular, or other application frameworks |
| **Theme Integration** | Automatically adapting to light/dark mode through the theme system |
| **Localization Integration** | Displaying user-facing text in the active language |
| **Accessibility Compliance** | Supporting keyboard navigation, screen readers, and semantic markup |

## Business Rules

1. HTML Components must render consistently using Prati Design System tokens without requiring any application framework (React, Vue, Angular, Electron).
2. HTML Components must automatically consume design tokens (colors, typography, spacing, elevation, motion, radius) and adapt to the active theme.
3. All user-facing text rendered by HTML Components must support localization and must never assume a single language.
4. HTML Components must support keyboard navigation, screen readers, focus management, semantic markup, and accessible labels as a mandatory requirement.
5. HTML Components must adapt appropriately across mobile, tablet, desktop, HD, 2K, and 4K viewports.

## States

- **Uninitialized** — HTML Components not yet loaded; no UI rendering available
- **Ready** — Components loaded and available for prototype rendering
- **Rendering** — Component actively rendering or re-rendering
- **Error** — Component fails to render due to missing tokens or configuration

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Ready | Component definitions loaded and initialized |
| Ready | Rendering | Component rendered with provided data |
| Rendering | Ready | Render completes successfully |
| Ready | Error | Required dependency (theme, localization) unavailable |
| Error | Ready | Missing dependency becomes available |

## Edge Cases

- **Missing design token**: Component references a token that is not defined; falls back to default
- **Theme not initialized**: Component renders before theme system is ready; default palette used
- **Localization not initialized**: Component renders before localization is ready; key shown as text
- **Empty content**: Component receives no content to render; renders structural shell only
- **Unsupported viewport**: Component on a very small or very large screen; layout may degrade

## Error Conditions

- **Missing theme context** — Component cannot resolve colors or spacing values
- **Missing localization context** — Component cannot resolve user-facing text
- **Token resolution failure** — A required design token is undefined
- **Accessibility requirement unmet** — Component lacks required ARIA attributes

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing theme context | Render with default design token values and log the missing theme context |
| Missing localization context | Display the localization key as fallback text and log the missing context |
| Token resolution failure | Substitute the undefined token with a hardcoded default value and log the failure |
| Accessibility requirement unmet | Inject default ARIA attributes from a fallback configuration and issue a warning |

## Authorization

**Visibility:** Internal — HTML Components are a prototype infrastructure feature; not directly exposed to end users.

## User Journey

### Entry Conditions

- Prototype loads and HTML Component definitions are initialized
- Component dependencies (theme system, localization system) are available or fallback defaults are applied

### Primary Flow

1. Prototype requests rendering of an HTML Component with provided data
2. Component consumes design tokens, theme values, and localization strings
3. Component renders the UI with semantic markup and accessible attributes
4. User interacts with the component (click, input, navigation)
5. Component responds with appropriate visual feedback

### Alternate Flows

- **Empty content**: Component renders a structural shell without data content
- **Theme switch**: Component automatically re-renders with new theme tokens when the user switches themes
- **Language switch**: Component updates user-facing text to the newly selected language
- **Responsive adaptation**: Component layout adjusts when the viewport changes across mobile, tablet, desktop, HD, 2K, or 4K sizes

### Failure Flows

- Required dependency (theme, localization) is unavailable — component enters Error state
- Design token is undefined — component substitutes a default value
- Accessibility requirement cannot be met — component issues a warning and applies fallback ARIA attributes

### Recovery Flows

- From Error state: component re-renders when the missing dependency becomes available
- From missing token: component uses hardcoded default values until the token is defined

### Exit Conditions

- Prototype unloads or navigates away from the screen containing the component
- Component is destroyed and its resources are released

## Workflow

### Trigger

Prototype requests rendering of a UI element using an HTML Component

### Preconditions

- Component definitions are loaded (Uninitialized to Ready transition complete)
- Theme system is initialized (or fallback defaults are available)
- Localization system is initialized (or fallback key display is acceptable)

### Steps

1. Prototype provides data and configuration to the HTML Component
2. Component resolves design tokens from the active theme
3. Component resolves user-facing text from the active localization
4. Component renders semantic HTML with accessibility attributes
5. Component listens for user interactions
6. Component re-renders as needed when theme, localization, or data changes

### Outcomes

- Prototype interfaces are visually consistent with the Prati Design System
- Components follow Prati Design System rules for atoms, molecules, organisms, and templates
- Localization functions correctly across all user-facing text
- Themes function correctly across all visual elements
- Accessibility requirements are met
- Responsive behavior is maintained across viewports
- Prototypes remain framework independent

### Exceptions

- Missing theme context — default values applied
- Missing localization context — key displayed as fallback text
- Token resolution failure — hardcoded default value substituted
- Accessibility requirement unmet — fallback ARIA attributes injected

### Completion Criteria

The HTML Component renders a visually consistent, accessible, localized, and theme-aware UI element that behaves correctly across supported viewports without requiring any application framework.

## Verification

1. Verify HTML Components render with correct design tokens for all supported themes (light and dark mode).
2. Verify all user-facing text in HTML Components displays in the active language and updates correctly on language switch.
3. Verify HTML Components support keyboard navigation, screen reader output, and include required ARIA attributes.
4. Verify HTML Components render and function correctly without React, Vue, Angular, or any application framework loaded.
5. Verify HTML Components adapt their layout appropriately across mobile, tablet, desktop, HD, and 2K viewports.

## See Also

- [Glossary](../concepts/glossary.md)
- [Authorization](../concepts/authorization.md)
- [Navigation](navigation.md)
- [Persistence](persistence.md)
- [Templates](../features/templates.md)
- [Localization](../features/localization.md)
- [Theming](../features/theming.md)
- [Prati Components](../features/prati-components.md)
