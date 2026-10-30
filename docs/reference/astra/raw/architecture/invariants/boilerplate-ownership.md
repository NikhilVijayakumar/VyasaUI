# Boilerplate Ownership Invariant

## Purpose

Astra exists to eliminate repetitive application engineering work.

Application teams should focus on:

* business capabilities
* feature behavior
* workflows
* domain logic

Application teams should not repeatedly implement:

* infrastructure
* architecture
* patterns
* framework integration
* platform integration

Boilerplate Ownership defines what Astra must provide and what applications must own.

---

# Core Principle

If a capability is:

```text
Repeated

Generic

Reusable

Framework-Specific

Platform-Specific

Non-Business
```

then Astra owns it.

If a capability is:

```text
Business-Specific

Feature-Specific

Domain-Specific

Application-Specific
```

then the application owns it.

---

# Ownership Model

## Astra Owns

### Architecture

* MVVM
* Repository Pattern
* Validation Architecture
* State Management
* Feature Structure
* Application Contracts

---

### Platform Integration

WEB:

* ApiService
* Axios Configuration
* REST Integration
* HTTP Repositories

ELECTRON:

* IpcService
* IPC Integration
* IPC Repositories
* Electron Templates

---

### Engineering Infrastructure

* Hooks
* ViewModel Templates
* Repository Templates
* DTO Templates
* Validation Templates
* Error Handling Templates

---

### Code Generation

* Feature Generation
* ViewModel Generation
* Repository Generation
* Hook Generation
* Boilerplate Generation

---

### Shared Utilities

* ServerResponse
* Error Normalization
* Result Handling
* Request Handling
* Response Handling

---

## Application Owns

### Business Logic

* Domain Rules
* Workflow Rules
* Business Calculations
* Business Policies
* Approval Rules

---

### Feature Behavior

* Feature Configuration
* Feature Permissions
* Feature Validation Rules
* Feature State Machines
* Feature Workflows

---

### Product Decisions

* Product Capabilities
* Product Scope
* Product Roadmaps
* Product Terminology

---

# Prana Ownership

Prana owns:

```text
Electron Runtime

IPC Runtime

Storage Runtime

SQLite Runtime

File System Runtime

Plugin Runtime

Scheduler Runtime
```

Prana provides runtime infrastructure.

Prana does not provide application boilerplates.

---

# Prati Ownership

Prati owns:

```text
Design Tokens

Themes

Localization Assets

Component Library

Prototype Runtime

Presentation Runtime
```

Prati provides presentation infrastructure.

Prati does not provide application architecture.

---

# Boilerplate Classification

---

## Class A — Astra Boilerplate

Must be provided by Astra.

Examples:

```text
ApiService

IpcService

Base Repository

Base ViewModel

State Management

Validation Framework

Error Handling

Feature Templates
```

Application teams must not repeatedly implement these.

---

## Class B — Shared Infrastructure

Provided by platform owners.

Examples:

### Prana

```text
contextBridge

ipcMain

ipcRenderer

SQLite Runtime
```

### Prati

```text
Theme Runtime

Localization Runtime

Component Runtime
```

Applications consume these.

Applications do not own them.

---

## Class C — Application Logic

Owned by applications.

Examples:

```text
Task Approval Workflow

Invoice Validation Rules

Project Prioritization Logic

Notification Rules
```

These must not move into Astra.

---

# Ownership Decision Matrix

## Question 1

Does every application need it?

YES:

Potential Astra ownership.

NO:

Application ownership.

---

## Question 2

Does it contain business knowledge?

YES:

Application ownership.

NO:

Potential Astra ownership.

---

## Question 3

Would multiple applications implement it identically?

YES:

Astra ownership.

NO:

Application ownership.

---

## Question 4

Is it framework integration?

YES:

Astra ownership.

Examples:

```text
Axios

React Hooks

IPC Service

Repository Templates
```

---

## Question 5

Is it runtime infrastructure?

YES:

Prana ownership.

Examples:

```text
ipcMain

SQLite

File System
```

---

## Question 6

Is it presentation infrastructure?

YES:

Prati ownership.

Examples:

```text
Themes

Localization Runtime

Design Tokens
```

---

# Allowed Patterns

## Shared Repository Template

Allowed:

```text
Astra
    owns

Base Repository
```

Applications reuse.

---

## Shared Hook Template

Allowed:

```text
Astra
    owns

useDataState()

useAsyncOperation()

useServerResponse()
```

Applications reuse.

---

## Shared IPC Service

Allowed:

```text
Astra
    owns

IpcService
```

Applications reuse.

---

## Shared API Service

Allowed:

```text
Astra
    owns

ApiService
```

Applications reuse.

---

# Forbidden Patterns

## Repeated Infrastructure

Forbidden:

```text
Application A
    creates ApiService

Application B
    creates ApiService

Application C
    creates ApiService
```

Reason:

Belongs in Astra.

---

## Repeated Repository Patterns

Forbidden:

```text
Application A
    creates Base Repository

Application B
    creates Base Repository
```

Reason:

Belongs in Astra.

---

## Business Logic In Astra

Forbidden:

```text
Approval Workflow

Invoice Rules

Product Rules

Domain Rules
```

inside Astra.

Reason:

Business ownership belongs to applications.

---

## Runtime Ownership In Astra

Forbidden:

```text
ipcMain

contextBridge

BrowserWindow

SQLite Runtime
```

inside Astra.

Reason:

Runtime ownership belongs to Prana.

---

## Presentation Ownership In Astra

Forbidden:

```text
Theme Runtime

Design Tokens

Localization Assets

Prototype Runtime
```

inside Astra.

Reason:

Presentation ownership belongs to Prati.

---

# Boilerplate Leakage Detection

## Repeated Implementation Detection

Detect:

```text
Same Infrastructure

Implemented In Multiple Applications
```

Potential finding:

```text
BOILERPLATE-LEAKAGE
```

---

## Framework Integration Detection

Detect:

```text
Repeated Axios Setup

Repeated IPC Setup

Repeated Repository Setup
```

Potential Astra ownership candidate.

---

## Business Logic Detection

Detect:

```text
Business Terms

Approval Rules

Domain Calculations
```

inside Astra.

Potential finding:

```text
BUSINESS-LEAKAGE
```

---

## Runtime Leakage Detection

Detect:

```text
Electron Runtime

SQLite Runtime

File System Runtime
```

inside Astra.

Potential finding:

```text
RUNTIME-LEAKAGE
```

---

## Presentation Leakage Detection

Detect:

```text
Theme Runtime

Localization Runtime

Design Tokens
```

inside Astra.

Potential finding:

```text
PRESENTATION-LEAKAGE
```

---

# Severity Levels

## P0 — Critical

Ownership fundamentally incorrect.

Examples:

* Business logic in Astra
* Runtime ownership in Astra
* Presentation ownership in Astra

Must fix before release.

---

## P1 — High

Boilerplate ownership violation.

Examples:

* Common infrastructure duplicated across applications
* Missing Astra abstraction

Must migrate during release cycle.

---

## P2 — Transitional

Legacy ownership model.

Requires migration plan.

---

## P3 — Informational

Ownership fully compliant.

No action required.

---

# Validation Requirements

Boilerplate Ownership is compliant only if:

* reusable infrastructure is owned by Astra
* runtime infrastructure is owned by Prana
* presentation infrastructure is owned by Prati
* business logic is owned by applications
* repeated infrastructure is centralized
* application teams do not duplicate Astra capabilities
* Astra does not own business logic
* Astra does not own runtime infrastructure
* Astra does not own presentation infrastructure

---

# Compliance Goal

Applications should focus on:

```text
Business Features

Business Workflows

Business Logic
```

Astra should provide:

```text
Engineering Infrastructure

Architecture

Boilerplates

Code Generation
```

Prana should provide:

```text
Runtime Infrastructure
```

Prati should provide:

```text
Presentation Infrastructure
```

---

# Final Invariant

If a capability is generic, reusable, and repeatedly implemented across applications, Astra owns it.

If a capability represents runtime infrastructure, Prana owns it.

If a capability represents presentation infrastructure, Prati owns it.

If a capability represents business behavior, the application owns it.

Application teams should spend their effort building products, not rebuilding infrastructure.
