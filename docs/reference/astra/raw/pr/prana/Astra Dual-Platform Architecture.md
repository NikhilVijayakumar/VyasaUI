# Astra Dual-Platform Architecture Strategy v2.0

## Purpose

This document defines Astra's platform strategy after the separation of:

```text
Prana
    Runtime Platform

Astra
    Application Engineering Platform

Prati
    Design System Platform
```

The goal is to ensure Astra provides complete application boilerplates and engineering support for both:

```text
React Web Applications

React + Electron Applications (Prana)
```

without requiring application teams to implement repetitive infrastructure code.

---

# Core Philosophy

Astra is not platform-neutral.

Astra explicitly supports:

```text
WEB

ELECTRON
```

as first-class application targets.

The objective is:

```text
Generate Once

Support Multiple Astra Targets
```

without forcing application developers to create transport, repository, or runtime integration layers themselves.

---

# Supported Application Targets

## WEB

Target:

```text
React
+
MUI
+
Axios
+
REST APIs
```

Astra provides:

* ApiService
* Axios Configuration
* HTTP Repository Templates
* React Hooks
* ViewModels
* State Management
* Validation

---

## ELECTRON

Target:

```text
React
+
Electron
+
Prana
+
IPC
```

Astra provides:

* IpcService
* IPC Repository Templates
* React Hooks
* ViewModels
* State Management
* Validation

---

# Non-Goals

Astra does not support:

```text
Angular

Vue

Flutter

React Native

Blazor

Svelte
```

Astra is intentionally optimized for:

```text
React Web

React + Electron
```

only.

---

# Repository Ownership

## Astra Owns

### Architecture

* MVVM
* Repository Pattern
* State Management
* Feature Structure
* Validation Architecture

### Code Generation

* Boilerplates
* Repository Templates
* ViewModel Templates
* Hook Templates

### Platform Support

* Web Integration Layer
* Electron Integration Layer

### Shared Infrastructure

* Application Contracts (AppStateProvider interface)

---

## Prana Owns

### Runtime Platform

* Electron Runtime
* Context Bridge
* IPC Runtime
* SQLite Runtime
* Storage Runtime
* Virtual Drive
* Scheduler
* Plugin Host

### Infrastructure Services

* IPC Providers
* Storage Providers
* Runtime Services

---

## Prati Owns

### Design System

* Design Tokens
* Themes
* Localization Assets
* Component Library
* Component Contracts

### Prototype Runtime

* Navigation Runtime
* MockDB Runtime
* Presentation Runtime
* Prototype Components

---

# Architecture

## Shared Layer

Common functionality shared across all Astra targets.

```text
common/

├── mvvm/
├── validation/
├── state/
├── contracts/
└── feature/
```

Responsibilities:

* ViewModels
* Validation
* State Management
* Application Contracts (AppStateProvider interface)
* Feature Structure

Target independent.

---

## Web Layer

Provides Web-specific implementation.

```text
web/

├── api-service/
├── repositories/
├── hooks/
├── templates/
└── runtime/
```

Responsibilities:

* Axios Integration
* HTTP Communication
* REST Repository Templates
* Web Runtime Helpers

---

## Electron Layer

Provides Electron-specific implementation.

```text
electron/

├── ipc-service/
├── repositories/
├── hooks/
├── templates/
└── runtime/
```

Responsibilities:

* IPC Integration
* Electron Repository Templates
* Electron Runtime Helpers

---

# Repository Pattern

## Shared Repository Contract

Example:

```typescript
interface ITaskRepository {
    list(): Promise<Task[]>;
    get(id: string): Promise<Task>;
    create(task: Task): Promise<void>;
    update(task: Task): Promise<void>;
    delete(id: string): Promise<void>;
}
```

The contract remains identical across targets.

---

## Web Repository

Example:

```typescript
TaskApiRepository
```

Uses:

```text
ApiService
Axios
REST
```

---

## Electron Repository

Example:

```typescript
TaskIpcRepository
```

Uses:

```text
IpcService
Prana IPC
```

---

# Service Layer

## ApiService

Owned by Astra.

Purpose:

```text
HTTP Communication
```

Responsibilities:

* GET
* POST
* PUT
* PATCH
* DELETE
* Error Normalization

Target:

```text
WEB
```

---

## IpcService

Owned by Astra.

Purpose:

```text
IPC Communication
```

Responsibilities:

* invoke()
* send()
* receive()
* Error Normalization

Target:

```text
ELECTRON
```

Example:

```typescript
await ipcService.invoke(
    "tasks:list"
);
```

---

# Runtime Boundary

Astra may consume:

```typescript
window.electronAPI.invoke(...)
```

through generated IPC repositories.

Astra must not own:

```typescript
contextBridge.exposeInMainWorld(...)

ipcMain.handle(...)

ipcRenderer.invoke(...)
```

These belong to:

```text
Prana
```

---

# Hook Strategy

Hooks remain identical across targets.

Example:

```typescript
useTasks()
```

Implementation differences are hidden behind repositories.

ViewModels remain unchanged.

---

# Feature Generation

Feature Technical remains platform independent.

Example:

```text
Task Management
```

Generator determines target:

```text
WEB

or

ELECTRON
```

and emits:

### WEB

```text
ApiService

TaskApiRepository
```

### ELECTRON

```text
IpcService

TaskIpcRepository
```

---

# Application Target Configuration

Every Astra application must declare:

```yaml
applicationTarget: WEB
```

or

```yaml
applicationTarget: ELECTRON
```

---

# Generation Rules

## WEB

Generate:

* ApiService
* Axios Configuration
* REST Repositories
* Web Runtime Integration

Do not generate:

* IPC Repositories
* IpcService

---

## ELECTRON

Generate:

* IpcService
* IPC Repositories
* Electron Runtime Integration

Do not generate:

* ApiService
* Axios Repositories

---

# Benefits

## Web Applications

Receive:

* Complete HTTP Boilerplate
* Repository Layer
* Hooks
* ViewModels
* Validation

without writing infrastructure code.

---

## Electron Applications

Receive:

* Complete IPC Boilerplate
* Repository Layer
* Hooks
* ViewModels
* Validation

without writing infrastructure code.

---

# Success Criteria

Astra is considered successful when:

* Web applications receive complete HTTP infrastructure.
* Electron applications receive complete IPC infrastructure.
* Shared MVVM architecture remains identical across targets.
* Feature generators support both targets.
* Application developers do not need to implement transport boilerplate.
* Runtime responsibilities remain owned by Prana.
* Design responsibilities remain owned by Prati.

The result should be:

```text
One Engineering Platform

Two Supported Targets

Shared Architecture

Platform-Specific Infrastructure
```

without duplicating application engineering concerns.
