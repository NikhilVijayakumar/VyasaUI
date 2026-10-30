# Overview

Persistence enables prototype applications to retain data across user interactions and sessions. Unlike static mockups that lose state on refresh or reopen, persistence supports realistic data behavior, allowing prototypes to behave as functional applications. This enables stakeholders to experience workflows that involve creating, updating, and managing data without backend services.

# Feature Summary

- **Feature ID:** PROTO-005
- **Feature Name:** Persistence
- **Category:** Molecule
- **Priority:** P1
- **Dependencies:** Mock Data, Navigation, Proto Runtime
- **Future:** None listed in the feature spec

# User Goals

- Create records and see them persist across the prototype session.
- Modify existing records and retain updated values.
- Remove records and confirm their removal persists.
- Save preferences (language, theme, layout) for the session duration.
- Progress through multi-step workflows without losing intermediate state.
- Experience prototype behavior that feels consistent and reliable.

# User Journeys

**Creating a record and seeing it persist.** A user fills a form to create a task, submits it, and navigates to a task list. The new task appears in the list. The user leaves the screen and returns; the task remains visible.

**Modifying data across navigation.** A user edits a project name on a detail screen, saves, and navigates to a dashboard. The updated name appears on the dashboard. Navigating away and back does not revert the change.

**Removing a record.** A user deletes a note from a list. The note disappears. After navigating to other areas and returning, the note remains absent.

**Preserving preferences between sessions.** A user selects a theme and a language from settings. After reopening the prototype, the chosen theme and language remain active.

**Completing a multi-step workflow.** A user begins a wizard, fills step one, advances to step two, then leaves the prototype. Returning resumes the wizard at step two with entered data intact.

# Screen Inventory

N/A — Persistence is a data-retention capability without dedicated screens. It operates within the screens defined by the prototype under test.

# Interaction Design

**Data Creation.** When a user submits a creation action (e.g., Save, Create, Submit), the new record is retained and surfaces immediately in relevant views. No additional confirmation beyond the creation action is required.

**Data Modification.** When a user edits and confirms changes to a record, the updated values replace the previous values in all views that display that record.

**Data Removal.** When a user initiates a removal action (e.g., Delete, Remove, Archive), the record is removed from the dataset. The record no longer appears in list views, detail views, or related summaries.

**Preference Persistence.** When a user changes a preference (language, theme, layout), the choice is retained. Navigation and reopening the prototype reflect the selected preference.

**Workflow Persistence.** When a user progresses through a multi-step flow, each step's state and entered data are retained. Leaving and returning to the flow resumes at the last completed step.

# Form Design

N/A — Persistence does not introduce form elements of its own. Forms that create or modify records exist in the prototype; persistence captures the output of those form submissions.

# UX State Design

N/A — Persistence is a capability rather than a visual component. The feature spec does not define visual states for persistence itself. State changes (e.g., data loaded, data saved) are reflected in the prototype screens that consume persisted data.

# Feedback Design

**Creation.** After a record is created, it appears in relevant views immediately. The user can confirm the record's existence by navigating to a list or detail view.

**Modification.** After a record is modified, the updated values are visible wherever that record is displayed. The user can navigate away and return to verify the change.

**Removal.** After a record is removed, it no longer appears in any view that previously displayed it. The user can navigate to confirm the record's absence.

**Preference changes.** After a preference is set, the interface reflects the choice (e.g., theme colors update, language text changes) without requiring additional steps.

**Workflow progress.** After completing a step in a multi-step flow, the interface advances to the next step. Returning to the flow resumes at the correct position.

# Navigation Design

Persistence preserves data across all navigation actions. Users can move between screens, return to previous screens, and continue workflows without losing entered data or completed steps. Data created or modified on one screen remains available when navigating to another screen. Workflows spanning multiple screens retain progress as the user navigates forward and backward.

# Responsive Design

N/A — Persistence concerns data retention behavior, not screen layout. Responsive layout rules follow the consuming prototype's design.

# Accessibility Design

Persistence must not introduce barriers to accessibility. Data that is persisted (created records, modified values, workflow progress) must be programmatically available in the same way non-persisted content is. Screen readers and assistive technologies must detect content updates (e.g., a newly created record appearing in a list) as they would any dynamic content change. Preference persistence for accessibility settings (e.g., high-contrast theme, increased font size) must function identically to other preference types.

# Localization Design

Persistence operates independently of the selected language. Persisted application data (records, workflow state) is unaffected when the user changes the language preference. Localization affects only the presentation layer (labels, messages, formatting) and not the stored data values. Language preference itself may be persisted as a user preference.

# Design System Traceability

**Consistency Builds Trust.** Persistence ensures data remains consistent across interactions and navigation. Users see the same data regardless of how they arrived at a screen, building trust in the prototype's behavior.

**White Space is Feature.** Persistence operates invisibly — it requires no dedicated chrome, controls, or visual indicators. The experience of reliable data retention emerges from the prototype's existing screens without additional visual noise.

# Open Questions

1. Should users be able to reset persisted data to the initial mock state without closing the prototype (a "Reset" action)?
2. How should persistence behave when the prototype window is closed and reopened — should all data reset or should preferences survive across hard closures?
3. Does workflow persistence require the prototype to distinguish between intentional abandonment (user closes the wizard) and temporary departure (user navigates away briefly)?
4. Should there be visual indicators allowing users to distinguish between mock data and user-created persisted data?
