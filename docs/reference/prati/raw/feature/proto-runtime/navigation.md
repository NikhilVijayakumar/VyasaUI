# Navigation

**Feature Area:** Proto Runtime — Screen and workflow navigation

## Overview

Navigation provides the ability for users to move between screens, workflows, and application areas within a prototype. It enables prototype applications to simulate realistic application behavior and user journeys without requiring production routing frameworks. Navigation exists to support exploration and validation of prototype applications, allowing users to move between screens, execute workflows, explore features, validate user journeys, and review application structure. The goal is to allow stakeholders and users to experience application workflows as they would in a real application, with navigation feeling natural and intuitive.

Navigation supports dashboard applications, administrative applications, workflow applications, form-based applications, internal tools, and desktop and web application prototypes. Throughout all scenarios, navigation should behave predictably — users should understand where they are, where they can go, and how to return to previous locations. Navigation is workflow-oriented: it supports business workflows without implementing business logic, demonstrating application behavior rather than executing application rules. Navigation must operate independently from React routing, Electron routing, backend routing systems, and application frameworks to keep prototypes lightweight and portable.

## Responsibilities

- Screen Navigation
- Workflow Navigation
- Application Flow Support
- Navigation State Management
- Deep Link Support
- Navigation History

## Non-Responsibilities

- Business Rules
- Permission Enforcement
- Authorization Logic
- Backend Routing
- API Integration
- Production Routing Frameworks
- Authorization Rules
- Permission Systems
- Backend Route Management
- Microservice Routing
- Application Security

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Screen Navigation** | Moving between application screens and pages |
| **Workflow Navigation** | Moving through multi-step flows (wizards, approvals) |
| **Navigation State** | Tracking current location and available transitions |
| **Navigation History** | Allowing back/forward movement through visited screens |
| **Deep Link** | Entering the prototype directly at a specific screen |

## Business Rules

1. Navigation must support realistic user journeys without implementing production routing systems.
2. Navigation must behave consistently throughout the prototype — users must always know their current location, available destinations, and how to return.
3. Navigation must support business workflow progression (creation, approval, review, wizard flows) without implementing business logic.
4. Navigation must operate independently of React, Electron, backend routing, and application frameworks.
5. Navigation must preserve relevant prototype state (form progress, selected records, filters, search criteria) across screen transitions.

## States

- **Idle** — Navigation initialized; awaiting user or programmatic navigation
- **Navigating** — Screen transition in progress
- **Stale** — Current screen reference is outdated; route points to a missing screen
- **Error** — Navigation target does not exist or cannot be reached

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Navigating | User clicks a navigation element or programmatic navigation fires |
| Navigating | Idle | Screen transition completes successfully |
| Navigating | Error | Target screen does not exist or cannot be resolved |
| Idle | Stale | Current screen is removed or renamed during prototype update |
| Stale | Idle | Navigation to a valid screen is initiated |
| Error | Idle | Fallback navigation to a default screen |

## Edge Cases

- **Navigation to current screen**: Navigation fires but target is the same as current; no transition occurs
- **Rapid navigation clicks**: Multiple navigation events fire before previous transition completes
- **Empty route table**: No routes defined; all navigation fails
- **Circular navigation loop**: Navigation repeatedly cycles between two screens without user action
- **Deep link to non-existent screen**: Target screen does not exist in route table

## Error Conditions

- **Target screen not found** — Navigation target is not in the route table
- **Navigation loop detected** — Repeated navigation between the same screens
- **Missing route configuration** — Route table is empty or not initialized
- **State corruption** — Navigation state becomes inconsistent

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Target screen not found | Navigate to a default fallback screen and log the unresolved target |
| Navigation loop detected | Break the loop by navigating to a safe default screen after N consecutive cycles |
| Missing route configuration | Initialize an empty route table with a single default route pointing to the home screen |
| State corruption | Reset navigation state to Idle and reload the route table from configuration |

## Authorization

**Visibility:** Internal — navigation is a prototype infrastructure feature; not directly exposed to end users.

## User Journey

### Entry Conditions

- User opens the prototype application
- Navigation system is initialized and the route table is configured with at least one route

### Primary Flow

1. User clicks a navigation element (menu item, button, breadcrumb, tab, drawer link) or a programmatic navigation request fires
2. System resolves the target screen from the route table
3. Screen transition executes
4. Current location and navigation history update
5. New screen renders

### Alternate Flows

- **Screen Navigation**: User moves between screens such as Dashboard to Details, List to Form, Form to Summary, Home to Settings
- **Workflow Navigation**: User moves through multi-step flows including creation flows, approval flows, review flows, and wizard flows
- **Master Detail Navigation**: User navigates between collections (Project List, User List, Task List) and their corresponding detail screens
- **Dashboard Navigation**: User navigates between dashboard views and related screens such as Reports, Analytics, and Configuration
- **Deep Navigation**: User enters the prototype directly at a specific application area via a direct link

### Failure Flows

- Target screen does not exist in the route table — system transitions to Error state
- Navigation loop detected between two screens — system breaks the cycle and returns to a safe screen
- Route table is empty or uninitialized — all navigation attempts fail

### Recovery Flows

- From Error state: navigate to a default fallback screen
- From Stale state: initiate navigation to a valid screen to return to Idle

### Exit Conditions

- User closes the prototype application
- User completes the final screen in a workflow and no further navigation is available

## Workflow

### Trigger

User action (click on navigation element, gesture) or programmatic navigation request

### Preconditions

- Route table is initialized with at least one valid route
- Navigation state is Idle

### Steps

1. Navigation event fires
2. System checks the route table for the target screen
3. If the target is found and differs from the current screen, transition begins
4. Screen transition executes
5. Navigation state updates to reflect the new location
6. Prototype state (form progress, selections, filters) is preserved across the transition
7. Navigation history is updated

### Outcomes

- Users can move naturally through the prototype
- Workflows can be completed from start to finish
- Screen relationships are visually and logically clear
- Navigation feels realistic and intuitive
- State is preserved appropriately across transitions
- Localization functions correctly on all navigation labels
- Theme integration functions correctly on all navigation elements

### Exceptions

- Target screen not found — navigation enters Error state
- Navigation loop detected — system breaks the cycle
- Missing route configuration — navigation subsystem initializes with a default route
- State corruption — navigation resets to Idle with a fresh route table
- Navigation to current screen — no transition occurs

### Completion Criteria

Users can successfully navigate between screens, execute multi-step workflows, and understand the application structure without confusion.

## Verification

1. Verify users can navigate between all defined screens using navigation elements (menus, buttons, breadcrumbs, tabs).
2. Verify multi-step workflows (creation, approval, review, wizard flows) can be completed without navigation failure.
3. Verify screen relationships are visually and logically clear to the user at all times.
4. Verify prototype state (form progress, selections, filters, search criteria) is preserved across screen transitions.
5. Verify localization labels and theme tokens apply correctly to all navigation elements.

## See Also

- [Glossary](../concepts/glossary.md)
- [Authorization](../concepts/authorization.md)
- [Persistence](persistence.md)
- [HTML Components](html-components.md)
- [Templates](../features/templates.md)
- [Localization](../features/localization.md)
- [Theming](../features/theming.md)
- [Workflows](../features/workflows.md)
