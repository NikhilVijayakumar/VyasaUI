# Repository Isolation Invariant

## Purpose

Astra enforces a strict Repository pattern for all external communication.

All external communication, data access, and platform interaction must flow exclusively through Repository abstractions and Astra-approved Service abstractions.

Components, Views, ViewModels, Hooks, and State Management layers must never access platform runtimes directly.

Repository Isolation guarantees:

- centralized data access
- transport abstraction
- runtime isolation
- platform separation
- typed response contracts
- swappable implementations
- testable boundaries
- consistent error handling
- centralized monitoring and logging

---

# Architectural Rule

External communication must follow:

```text
View
    ↓

ViewModel
    ↓

Repository
    ↓

Service Abstraction
    ↓

Platform Runtime
```

No layer may bypass the layer below it.

---

# Supported Platform Flows

## WEB

```text
View
    ↓

ViewModel
    ↓

Repository
    ↓

ApiService
    ↓

Axios
    ↓

REST API
```

---

## ELECTRON

```text
View
    ↓

ViewModel
    ↓

Repository
    ↓

IpcService
    ↓

Prana IPC Runtime
```

---

# Repository Responsibilities

A Repository may:

- use Astra-approved Service abstractions
- define typed request contracts
- define typed response contracts
- compose multiple operations
- map errors
- interpret status codes
- expose domain-specific operations
- aggregate multiple data sources

Examples:

```text
UserRepository

TaskRepository

ProjectRepository

DocumentRepository
```

---

# Repository Non-Responsibilities

A Repository must not:

- contain UI logic
- contain formatting logic
- contain theme logic
- contain localization logic
- contain component logic
- contain routing logic
- contain navigation logic
- contain ViewModel logic
- contain View logic
- contain runtime infrastructure

---

# Allowed Service Dependencies

Repositories may use:

```text
ApiService

IpcService

ServerResponse

DTO Contracts

Request Contracts

Response Contracts
```

---

# Forbidden Service Dependencies

Repositories must not directly use:

```text
axios

fetch

XMLHttpRequest

window.electronAPI

ipcRenderer

ipcMain

contextBridge

BrowserWindow

SQLite APIs

File System APIs

Storage Runtime APIs
```

These belong to Service or Runtime layers.

---

# Runtime Ownership Boundary

## Astra Owns

```text
Repository Pattern

Repository Templates

ApiService

IpcService

ServerResponse

Request Contracts

Response Contracts
```

---

## Prana Owns

```text
Electron Runtime

IPC Runtime

contextBridge

ipcMain

ipcRenderer

SQLite Runtime

Storage Runtime

File System Runtime

BrowserWindow
```

---

## Prati Owns

```text
Design Tokens

Theme Runtime

Localization Runtime

Component Library

Prototype Runtime

Navigation Runtime

MockDB Runtime
```

---

# Repository Boundary Rule

Repositories may consume:

```text
Astra Services
```

Repositories may not consume:

```text
Prana Runtime Infrastructure

Prati Presentation Infrastructure
```

---

# Allowed Patterns

## Typed Repository With ApiService

Allowed:

```typescript
import { ApiService, ServerResponse } from 'astra';

const api = new ApiService('/api');

export const UserRepository = {
    getAll: async (): Promise<ServerResponse<User[]>> =>
        api.get('/users'),

    getById: async (
        id: string
    ): Promise<ServerResponse<User>> =>
        api.get(`/users/${id}`)
};
```

Reason:

Repository delegates communication to ApiService.

---

## Typed Repository With IpcService

Allowed:

```typescript
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const TaskRepository = {
    getAll: async (): Promise<ServerResponse<Task[]>> =>
        ipc.invoke('tasks:list'),

    getById: async (
        id: string
    ): Promise<ServerResponse<Task>> =>
        ipc.invoke('tasks:get', { id })
};
```

Reason:

Repository delegates communication to IpcService.

---

## Repository Composition

Allowed:

```typescript
export const OrderRepository = {
    getFullOrder: async (
        orderId: string
    ): Promise<ServerResponse<FullOrder>> => {

        const order =
            await api.get<Order>(
                `/orders/${orderId}`
            );

        if (order.isError) {
            return order;
        }

        const items =
            await api.get<OrderItem[]>(
                `/orders/${orderId}/items`
            );

        if (items.isError) {
            return items;
        }

        return ServerResponse.success({
            status: 200,
            statusMessage: 'OK',
            data: {
                ...order.data,
                items: items.data
            }
        });
    }
};
```

Reason:

Repositories may compose multiple operations into a domain-specific operation.

---

## Repository Consumed By ViewModel

Allowed:

```typescript
export function useTaskListViewModel() {

    const [state, execute] =
        useDataState<Task[]>();

    useEffect(() => {
        execute(
            () => TaskRepository.getAll()
        );
    }, []);

    return {
        tasks: state.data
    };
}
```

Reason:

ViewModel consumes Repository.

View does not.

---

# Forbidden Patterns

## Direct HTTP Call In View

Forbidden:

```typescript
function UserList() {

    useEffect(() => {

        axios.get('/api/users');

    }, []);
}
```

Reason:

Bypasses Repository and ApiService.

---

## Direct Fetch In ViewModel

Forbidden:

```typescript
export function useUserViewModel() {

    const load = async () => {

        const response =
            await fetch('/api/users');

    };
}
```

Reason:

ViewModel must use Repository.

---

## Direct IPC Usage In Repository

Forbidden:

```typescript
export const UserRepository = {

    getAll: async () => {

        return window.electronAPI.invoke(
            'users:list'
        );

    }
};
```

Reason:

Repository must use IpcService.

Not runtime APIs.

---

## Runtime Infrastructure In Repository

Forbidden:

```typescript
import { ipcRenderer } from 'electron';

export const UserRepository = {
    ...
};
```

Reason:

Runtime infrastructure belongs to Prana.

---

## Repository Importing UI

Forbidden:

```typescript
import { UserCard } from '../components/UserCard';

import { useTheme } from 'prati';
```

Reason:

Repository must not know presentation concerns.

---

## View Importing Repository

Forbidden:

```typescript
import { UserRepository }
from '../repo/UserRepository';

function UserList() {

}
```

Reason:

View must consume ViewModel.

Not Repository.

---

## Repository Returning Raw Data

Forbidden:

```typescript
export const UserRepository = {

    getAll: async () => {

        const response =
            await api.get('/users');

        return response.data;
    }
};
```

Reason:

Repository must return:

```text
ServerResponse<T>
```

for consistent handling.

---

# Detection Heuristics

## Direct HTTP Usage

Detect:

```typescript
axios.get
axios.post
axios.put
axios.delete

fetch(
```

outside Service implementations.

---

## Direct IPC Usage

Detect:

```typescript
window.electronAPI

ipcRenderer

ipcMain

contextBridge
```

inside:

```text
Repositorys

ViewModels

Views

Hooks
```

---

## Runtime Leakage

Detect:

```typescript
BrowserWindow

SQLite

fs

path
```

inside repositories.

---

## Repository Importing UI

Detect:

```typescript
../components/

../views/

../pages/

prati
```

inside repositories.

---

## View Importing Repository

Detect:

```typescript
../repo/

../repository/
```

inside:

```text
Views

Pages

Components
```

---

## Raw Response Returns

Detect:

```typescript
return response.data

return data

return result
```

without:

```typescript
ServerResponse.success()

ServerResponse.error()
```

---

# Severity Levels

## P0 — Critical

Repository boundary completely bypassed.

Examples:

- axios in View
- fetch in ViewModel
- runtime APIs in Repository
- direct IPC usage

Must fix before release.

---

## P1 — High

Repository boundary partially violated.

Examples:

- View importing Repository
- Repository importing UI
- raw response handling
- bypassing Service abstractions

Must migrate.

---

## P2 — Transitional

Legacy code with migration plan.

Examples:

- temporary direct access
- deprecated Repository bypass

Allowed temporarily only.

---

## P3 — Informational

Repository architecture fully compliant.

No action required.

---

# Refactoring Guidance

## Replace Direct HTTP Calls

BAD:

```typescript
const response =
    await axios.get('/users');
```

GOOD:

```typescript
await UserRepository.getAll();
```

---

## Replace Direct IPC Calls

BAD:

```typescript
await window.electronAPI.invoke(
    'users:list'
);
```

GOOD:

```typescript
await UserRepository.getAll();
```

---

## Replace Runtime Usage

BAD:

```typescript
ipcRenderer.invoke(...)
```

GOOD:

```typescript
ipcService.invoke(...)
```

---

## Move Platform Access Into Services

BAD:

```typescript
Repository
    ->
Electron Runtime
```

GOOD:

```text
Repository
    ->
IpcService
    ->
Prana Runtime
```

---

# Validation Requirements

Repository Isolation is compliant only if:

- Views do not access Repositories
- ViewModels access Repositories only
- Repositories access Services only
- Services access Platform Runtimes only
- no direct HTTP access exists outside Services
- no direct IPC access exists outside Services
- no runtime infrastructure exists inside Repositories
- all Repository responses use ServerResponse<T>
- Repositorys remain presentation-agnostic
- Repositorys remain runtime-agnostic
- Repository implementations are swappable

---

# Compliance Goal

Repositories must behave as:

- domain-specific data providers
- typed-response providers
- service-mediated communicators
- runtime-isolated adapters
- testable boundaries

NOT:

- HTTP clients
- IPC clients
- runtime controllers
- UI-aware services
- direct infrastructure consumers

---

# Final Invariant

Views communicate with ViewModels.

ViewModels communicate with Repositories.

Repositories communicate with Astra Services.

Astra Services communicate with Platform Runtimes.

Platform Runtimes communicate with external systems.

No layer may bypass the layer below it.

This separation guarantees:

- maintainability
- testability
- platform flexibility
- runtime isolation
- architectural consistency

across all Astra-supported targets:

```text
WEB

ELECTRON
```