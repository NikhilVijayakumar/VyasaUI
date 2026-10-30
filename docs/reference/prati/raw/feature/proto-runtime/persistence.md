# Persistence

**Feature Area:** Proto Runtime — Data and state retention

## Overview

Persistence provides the ability for prototype applications to retain data across user interactions and sessions. Unlike traditional mockups that lose state when refreshed or reopened, Proto Runtime supports realistic data persistence, allowing prototypes to behave more like real applications. Persistence enables stakeholders to experience workflows that involve creating, updating, and managing data without requiring backend services. The goal is to ensure that user actions can produce lasting changes within the prototype environment, supporting record creation, record updates, record deletion, user preference storage, and application state maintenance without requiring production databases or APIs.

Persistence exists to support prototype validation with realistic data behavior. Users should experience data behavior that resembles a real application — actions performed within the prototype should produce visible and lasting results. Persistence must function without backend services, APIs, cloud services, or external databases. It should remain simple to configure and consume so prototype authors can focus on workflows and demonstrations rather than storage implementation. Users should perceive persistence as natural application behavior: created records remain visible, updated values remain updated, deleted records remain removed, preferences remain selected, and workflow progress remains available. The prototype should feel consistent and reliable throughout a session.

## Responsibilities

- Data Retention
- State Retention
- Session Continuity
- Workflow Continuity
- Mock Data Updates

## Non-Responsibilities

- Production Databases
- Synchronization
- Distributed Storage
- Data Replication
- Transaction Management
- Backend Integration
- Enterprise Data Storage
- Distributed Systems
- Multi-User Collaboration
- Audit Trails
- Security Controls
- Data Governance
- Synchronization Services

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Data Retention** | Keeping user-created and modified data across interactions |
| **State Retention** | Maintaining application state between screen transitions |
| **Session Continuity** | Preserving data when the prototype is refreshed or reopened |
| **Workflow Continuity** | Maintaining progress through multi-step processes |
| **Mock Data Updates** | Persisting changes to seed data during prototype execution |

## Business Rules

1. Persistence must retain user-created and modified data across interactions within a session without requiring production databases or APIs.
2. Persistence must preserve data when the prototype is refreshed or reopened within the same session.
3. Persistence must operate independently of backend services, APIs, cloud services, and external databases at all times.
4. Persistence must not be affected by localization changes or theme changes — those affect presentation only.
5. Persistence must maintain workflow progress through multi-step processes (wizards, review processes, approval flows, multi-screen forms) without data loss.

## States

- **Uninitialized** — Persistence not yet available; data is ephemeral
- **Active** — Persistence initialized; data is retained across interactions
- **Corrupted** — Stored data is unreadable or inconsistent
- **Disabled** — Persistence explicitly turned off; all data is session-only

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Active | Persistence subsystem initializes successfully |
| Active | Corrupted | Storage read/write produces inconsistent data |
| Active | Disabled | Prototype disables persistence via configuration |
| Corrupted | Active | Storage reset and re-initialization succeeds |
| Disabled | Active | Persistence re-enabled via configuration |

## Edge Cases

- **Storage full**: Local storage capacity exceeded; writes fail silently
- **Concurrent writes**: Multiple rapid data mutations may cause race conditions
- **Empty storage after reset**: Reset clears all data; prototype returns to seeded state
- **Cross-tab conflicts**: Multiple browser tabs share the same storage; writes may conflict
- **Storage quota exceeded**: Browser storage quota reached; new writes are rejected

## Error Conditions

- **Storage unavailable** — Local storage API throws or is disabled
- **Storage full** — Write operations fail due to capacity limits
- **Data corruption** — Previously stored data is unreadable or malformed
- **Reset failure** — Reset operation fails; data may be in an indeterminate state

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Storage unavailable | Fall back to ephemeral in-memory storage for the session and log the error |
| Storage full | Prune oldest or least-recently-used data entries and retry the write operation |
| Data corruption | Reset the corrupt storage partition and reload from the last known good snapshot |
| Reset failure | Force-clear all storage entries and re-initialize from the prototype's seed data |

## Authorization

**Visibility:** Internal — persistence is a prototype infrastructure feature; not directly exposed to end users.

## User Journey

### Entry Conditions

- User opens the prototype and begins interacting with data-entry or configuration screens
- Persistence subsystem initializes (transitions from Uninitialized to Active)

### Primary Flow

1. User performs a data action: creates a record, edits a field, deletes an item, or changes a preference
2. Persistence subsystem captures the change and stores it locally
3. Data remains visible and updated across subsequent interactions and screen transitions
4. Workflow progress is saved at each step

### Alternate Flows

- **Data Creation**: User creates a new record (task, project, user, note) that persists across interactions
- **Data Modification**: User updates an existing record (edit task, update profile, change status, modify settings)
- **Data Removal**: User removes a record (delete task, remove project, archive record)
- **Preference Persistence**: User selects a language, theme, dashboard layout, or setting that remains stored
- **Workflow Persistence**: User progresses through multi-screen flows (wizards, review processes, approval flows, multi-screen forms) without losing progress

### Failure Flows

- Storage write fails due to capacity limits — data change is lost
- Data corruption detected — stored data becomes unreadable
- Reset operation fails — data may be in an indeterminate state

### Recovery Flows

- From Corrupted state: storage reset clears corrupt data and re-initializes from seed data
- From Disabled state: persistence re-enabled via configuration restores Active state
- From storage full: prune old entries to free capacity

### Exit Conditions

- User closes the prototype — persisted data remains available on next open (session continuity)
- User explicitly resets prototype data — all persisted data returns to seeded state

## Workflow

### Trigger

User performs a data action (create, update, delete) or a workflow step that requires state retention

### Preconditions

- Persistence subsystem is in Active state
- Storage is available and has sufficient capacity

### Steps

1. User action generates a data change request
2. Persistence subsystem validates the change against available storage
3. Data is written to local storage
4. Application state updates to reflect the persisted change
5. Workflow continuity is maintained for multi-step processes

### Outcomes

- User actions result in lasting changes within the prototype
- Data remains available between interactions and screen transitions
- Workflows retain progress across steps
- User preferences remain available across the session
- Application behavior feels realistic and consistent
- No backend services are required

### Exceptions

- Storage unavailable — fall back to ephemeral in-memory storage
- Storage full — prune old data or reject the write
- Data corruption — reset and re-initialize from seed data
- Reset failure — force-clear and re-initialize

### Completion Criteria

Data created, modified, or deleted by the user persists accurately across interactions within the prototype session without requiring backend services.

## Verification

1. Verify user-created records remain visible and accurate after navigating away and returning to the same screen.
2. Verify updated field values persist after a screen transition or page refresh within the same session.
3. Verify deleted records remain removed and do not reappear after subsequent interactions.
4. Verify multi-step workflow progress (wizard steps, form pages) is retained when navigating between steps.
5. Verify no backend services, cloud APIs, or external databases are required for any persistence operation.

## See Also

- [Glossary](../concepts/glossary.md)
- [Authorization](../concepts/authorization.md)
- [Navigation](navigation.md)
- [HTML Components](html-components.md)
- [Mock Data](../features/mock-data.md)
- [Localization](../features/localization.md)
- [Theming](../features/theming.md)
