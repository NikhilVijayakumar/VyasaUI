# Target Consistency Invariant

## Purpose

Astra explicitly supports two first-class application targets:

```text
WEB       React + Axios + REST APIs
ELECTRON  React + Electron + Prana IPC
```

Target Consistency requires that all MVVM contracts, state lifecycle, and hook interfaces remain identical across both targets. Only the transport layer (service abstraction) legitimately differs.

Target Consistency guarantees:

- consumers can switch targets without rewriting ViewModels or Views
- architectural patterns remain uniform across all Astra-powered applications
- testing strategies apply equally to both targets
- documentation, templates, and code generation serve both targets without divergence
- platform-specific concerns are isolated exclusively to the Repository layer

---

## Architectural Rule

The following must be **identical** across WEB and ELECTRON targets:

```text
AppState<T> interface
StateType lifecycle (INIT → LOADING → COMPLETED)
useDataState hook API
AppStateHandler component API
AppStateProvider interface
ViewModel hook structure (hooks/use<Feature>.ts)
View layer (view/components/, view/pages/)
Feature module directory layout
ServerResponse<T> contract
```

The following legitimately **differs** across targets:

```text
Service abstraction:
    WEB      → ApiService (Axios + HTTP)
    ELECTRON → IpcService (window.electronAPI + IPC)

Repository transport:
    WEB      → usersApi.list() calls api.get('/users')
    ELECTRON → tasksIpc.list() calls ipc.invoke('tasks:list')
```

---

## Invariant Statement

A ViewModel hook must not contain target-conditional logic.

A View component must not contain target-conditional logic.

AppState transitions must be identical regardless of target.

The only code that differs between WEB and ELECTRON feature modules is the repository transport implementation.

---

## Allowed Patterns

### WEB Repository

```typescript
// src/features/users/repo/usersApi.ts
import { ApiService, ServerResponse } from 'astra';

const api = new ApiService('https://api.example.com', {
    internal_server_error: 'Server unavailable',
});

export const usersApi = {
    list: (): Promise<ServerResponse<User[]>> => api.get('/users'),
    get: (id: string): Promise<ServerResponse<User>> => api.get(`/users/${id}`),
};
```

### ELECTRON Repository

```typescript
// src/features/tasks/repo/tasksIpc.ts
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const tasksIpc = {
    list: (): Promise<ServerResponse<Task[]>> => ipc.invoke('tasks:list'),
    get: (id: string): Promise<ServerResponse<Task>> => ipc.invoke('tasks:get', { id }),
};
```

### ViewModel — Identical Across Both Targets

```typescript
// src/features/users/hooks/useUsers.ts — identical for WEB and ELECTRON
import { useDataState } from 'astra';
import { usersApi } from '../repo/usersApi'; // swap to tasksIpc for ELECTRON

export const useUsers = () => {
    const [state, execute] = useDataState<User[]>();
    const load = () => execute(() => usersApi.list());
    return { state, load };
};
```

The ViewModel is structurally identical. Only the repository import changes when switching targets.

---

## Forbidden Patterns

### Target-Conditional Logic in ViewModel

Forbidden:

```typescript
export const useUsers = () => {
    const [state, execute] = useDataState<User[]>();

    const load = () => {
        if (isElectron()) {
            execute(() => tasksIpc.list());
        } else {
            execute(() => usersApi.list());
        }
    };

    return { state, load };
};
```

Reason:
Target detection belongs in the repository layer, not the ViewModel. The ViewModel must remain transport-agnostic.

---

### Target-Conditional Logic in View

Forbidden:

```typescript
export function UserList({ state }: Props) {
    if (window.electronAPI) {
        return <ElectronUserList state={state} />;
    }
    return <WebUserList state={state} />;
}
```

Reason:
Views must be presentation-only. Target differences must not surface at the View layer.

---

### Different AppState Contracts Per Target

Forbidden:

```typescript
// ELECTRON target — custom AppState with extra IPC fields
interface ElectronAppState<T> extends AppState<T> {
    ipcChannel: string;
    ipcStatus: 'connected' | 'disconnected';
}
```

Reason:
`AppState<T>` is the universal contract. Extending it with target-specific fields breaks the shared ViewModel interface and prevents target swaps.

---

### Direct Transport in ViewModel

Forbidden:

```typescript
export const useTasks = () => {
    const [state, execute] = useDataState<Task[]>();

    const load = () => {
        execute(() => window.electronAPI.invoke('tasks:list')); // IPC in ViewModel
    };

    return { state, load };
};
```

Reason:
Transport belongs in the repository. ViewModel must consume a repository, not a transport directly.

---

## Detection Heuristics

### Target Detection in ViewModel

Detect:

```typescript
isElectron()
window.electronAPI
process.platform
typeof window !== 'undefined'
```

inside `hooks/use*.ts` files.

---

### Runtime API in View

Detect:

```typescript
window.electronAPI
ipcRenderer
```

inside `.tsx` component files.

---

### Non-standard AppState Extensions

Detect:

```typescript
extends AppState
interface.*AppState
```

in consumer code outside of `model/` type definitions.

---

## Severity Levels

### P0 — Critical

Target-conditional logic in ViewModel or View.

Examples:

- `isElectron()` check in ViewModel hook
- `window.electronAPI` call in View component
- Custom `AppState` extension breaking the shared contract

Must fix before release.

---

### P1 — High

Transport leaking above the repository boundary.

Examples:

- `ipc.invoke()` directly in ViewModel (not via repository)
- `api.get()` directly in View

Must migrate.

---

### P2 — Transitional

Legacy mixed-concern code with documented separation plan.

Allowed temporarily with migration target.

---

### P3 — Informational

Target consistency fully maintained. Only repositories differ between targets.

No action required.

---

## Validation Requirements

Target Consistency is compliant only if:

- `AppState<T>` is used identically across both targets
- `useDataState` API is unchanged between targets
- `AppStateHandler` usage is identical between targets
- ViewModel hooks contain no target-conditional logic
- View components contain no target-conditional logic
- Only repository files differ between WEB and ELECTRON feature modules
- Service abstractions (`ApiService` / `IpcService`) are used exclusively inside repository files
- No transport APIs appear above the repository boundary

---

## Compliance Goal

From the ViewModel upward, no code knows which target it runs on.

```text
View             — target agnostic
ViewModel        — target agnostic
Repository       — target specific (transport only)
Service          — target specific (ApiService / IpcService)
Runtime          — target specific (Browser / Prana)
```

The target boundary is the repository. Everything above it is identical.
