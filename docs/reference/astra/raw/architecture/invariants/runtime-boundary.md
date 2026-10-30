# Runtime Boundary Invariant

## Purpose

Astra is an Application Engineering Platform that operates within well-defined runtime boundaries.

Astra may consume runtime infrastructure through controlled service abstractions.

Astra must not own runtime infrastructure.

Runtime ownership belongs to:

```text
Prana
    Runtime Platform
```

Runtime boundary guarantees:
- clear ownership (Astra = engineering, Prana = runtime)
- swappable runtimes (Astra code works with any runtime that fulfills the contract)
- upgrade safety (runtime changes don't require Astra changes)
- security isolation (Astra never accesses privileged runtime APIs directly)
- testability (runtime can be mocked at the service boundary)

---

## Architectural Rule

Astra may provide service abstractions over runtime infrastructure.

Astra must not own runtime infrastructure itself.

The boundary is:

```text
Astra
    provides:
        IpcService (service abstraction)
        IPC Repository Templates
        IPC Contracts

    consumes:
        window.electronAPI (exposed by Prana via contextBridge)

    never owns:
        contextBridge
        ipcMain
        ipcRenderer
        BrowserWindow
        Electron Lifecycle
        SQLite Runtime
        File System Runtime
        Storage Runtime
```

---

## Supported Targets

### WEB

```text
Astra Services
    ↓

Browser Runtime
```

Astra provides ApiService. Browser runtime is the platform.

---

### ELECTRON

```text
Astra Services
    ↓

window.electronAPI
    ↓

Prana Runtime
```

Astra provides IpcService. Prana provides the runtime.

---

## Ownership Model

### Astra Owns

```text
IpcService
    invoke()
    send()
    receive()
    Error Normalization

IPC Repository Templates

IPC Contracts

ServerResponse<T> (shared across all targets)
```

---

### Astra Consumes

```text
window.electronAPI.invoke(channel, ...args)
window.electronAPI.send(channel, ...args)
window.electronAPI.receive(channel, callback)
```

Astra consumes these through IpcService only.

---

### Astra Must Not Own

```text
contextBridge.exposeInMainWorld(...)
    belongs to Prana preload script

ipcMain.handle(...)
    belongs to Prana main process

ipcRenderer.invoke(...)
    belongs to Prana preload script

BrowserWindow
    belongs to Prana main process

app, BrowserWindow lifecycle
    belongs to Prana main process

SQLite, fs, path, storage
    belong to Prana runtime services
```

---

### Prana Owns

```text
Electron Runtime
    main process lifecycle
    BrowserWindow management
    window management
    application menus

IPC Runtime
    contextBridge.exposeInMainWorld()
    ipcMain.handle()
    ipcRenderer.invoke()
    channel routing

Storage Runtime
    SQLite
    File System
    Local Storage (Electron-managed)

Plugin Runtime
    plugin host
    plugin lifecycle

Scheduler Runtime
    background tasks
    cron jobs

Virtual Drive
    virtual file system
```

---

## Service Abstraction Layer

### IpcService

Astra provides IpcService as the sole abstraction over Electron IPC.

```typescript
interface IpcService {
    invoke<T>(channel: string, ...args: unknown[]): Promise<ServerResponse<T>>;
    send(channel: string, ...args: unknown[]): void;
    receive<T>(channel: string, callback: (data: T) => void): void;
}
```

Repositories consume IpcService, never window.electronAPI directly.

---

## Allowed Patterns

### IpcService in Repository

Allowed:

```typescript
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const TaskRepository = {
    list: async (): Promise<ServerResponse<Task[]>> =>
        ipc.invoke('tasks:list'),

    get: async (id: string): Promise<ServerResponse<Task>> =>
        ipc.invoke('tasks:get', { id }),
};
```

Reason:
Repository delegates IPC to IpcService. IpcService delegates to window.electronAPI.

---

### IpcService Consumed by ViewModel

Allowed:

```typescript
import { useDataState } from 'astra';
import { TaskRepository } from '../repo/TaskRepository';

export function useTaskListViewModel() {
    const [state, execute] = useDataState<Task[]>();
    const load = () => execute(() => TaskRepository.list());
    return { state, load };
}
```

Reason:
ViewModel consumes Repository. Repository consumes IpcService. IpcService consumes window.electronAPI. Layers never bypass.

---

### window.electronAPI Type Declaration

Allowed (in consumer project or Astra type declarations):

```typescript
interface ElectronAPI {
    invoke(channel: string, ...args: unknown[]): Promise<unknown>;
    send(channel: string, ...args: unknown[]): void;
    receive(channel: string, callback: (...args: unknown[]) => void): void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
```

Reason:
Typed contract enables consumers to implement the bridge correctly.

---

### Consumer-Managed Preload Script

Allowed (in Prana or consumer project, never in Astra):

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel: string, ...args: unknown[]) =>
        ipcRenderer.invoke(channel, ...args),
    send: (channel: string, ...args: unknown[]) =>
        ipcRenderer.send(channel, ...args),
    receive: (channel: string, callback: (...args: unknown[]) => void) => {
        ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    },
});
```

Reason:
contextBridge belongs to Prana, not Astra. Astra consumes the result.

---

## Forbidden Patterns

### Direct IPC in Repository

Forbidden:

```typescript
export const UserRepository = {
    list: async () => {
        return window.electronAPI.invoke('users:list');
    },
};
```

Reason:
Repository must use IpcService, not window.electronAPI directly.

---

### Direct Runtime Import in Astra

Forbidden:

```typescript
import { ipcRenderer } from 'electron';
import { contextBridge } from 'electron';
import { BrowserWindow } from 'electron';
```

anywhere in Astra source code.

Reason:
Runtime imports belong to Prana. Astra must remain runtime-agnostic.

---

### contextBridge in Astra

Forbidden:

```typescript
contextBridge.exposeInMainWorld('electronAPI', { ... });
```

in Astra source code or templates.

Reason:
contextBridge belongs to Prana preload scripts. Astra provides service abstractions, not runtime bridges.

---

### IpcMain Handlers in Astra

Forbidden:

```typescript
ipcMain.handle('channel', handler);
```

in Astra source code or generated code.

Reason:
IPC handler registration belongs to Prana main process.

---

### BrowserWindow Management in Astra

Forbidden:

```typescript
new BrowserWindow({ ... });
app.whenReady();
app.on('window-all-closed', ...);
```

in Astra source code.

Reason:
Application lifecycle and window management belong to Prana.

---

### Bypassing IpcService

Forbidden:

```typescript
export const TaskRepository = {
    list: async () => {
        const result = await window.electronAPI.invoke('tasks:list');
        return result; // raw response, not ServerResponse<T>
    },
};
```

Reason:
All IPC communication must flow through IpcService for consistent error normalization and response typing.

---

### Runtime API in ViewModel or View

Forbidden:

```typescript
function useWindowViewModel() {
    const close = () => window.electronAPI.closeWindow();
    return { close };
}
```

Reason:
Views and ViewModels must not consume platform APIs directly. Platform interaction belongs in service abstractions.

---

## Detection Heuristics

### Direct window.electronAPI in Repositories

Detect:

```typescript
window.electronAPI
```

inside repository files that do not go through IpcService.

---

### Electron Runtime Imports

Detect:

```typescript
from 'electron'
```

anywhere in Astra src/.

---

### contextBridge Usage

Detect:

```typescript
contextBridge.exposeInMainWorld
```

anywhere in Astra src/ or templates.

---

### ipcMain Handlers

Detect:

```typescript
ipcMain.handle
ipcMain.on
```

anywhere in Astra src/ or templates.

---

### BrowserWindow Instantiations

Detect:

```typescript
new BrowserWindow
```

anywhere in Astra src/.

---

## Severity Levels

### P0 — Critical

Runtime ownership fundamentally violated.

Examples:
- Electron imports in Astra source code
- contextBridge in Astra
- ipcMain handlers in Astra
- BrowserWindow management in Astra
- Runtime infrastructure directly in repositories

Must fix before release.

---

### P1 — High

Service abstraction bypassed.

Examples:
- window.electronAPI directly in repository (not via IpcService)
- Runtime API in ViewModel or View
- Missing IpcService abstraction

Must migrate during release cycle.

---

### P2 — Transitional

Legacy direct access with documented migration plan.

Examples:
- Temporary direct window.electronAPI usage
- Deprecated bypass patterns with scheduled removal

Allowed temporarily only.

---

### P3 — Informational

Runtime boundary fully compliant. IpcService used throughout.

No action required.

---

## Refactoring Guidance

### Replace Direct window.electronAPI with IpcService

BAD:

```typescript
export const UserRepository = {
    list: () => window.electronAPI.invoke('users:list'),
};
```

GOOD:

```typescript
const ipc = new IpcService();

export const UserRepository = {
    list: () => ipc.invoke('users:list'),
};
```

---

### Move contextBridge to Preload Script

BAD:

```typescript
// In Astra code
contextBridge.exposeInMainWorld('electronAPI', { ... });
```

GOOD:

```typescript
// In electron/preload.ts (Prana or consumer-owned)
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
```

---

### Move IPC Handlers to Main Process

BAD:

```typescript
// In repository or service file
ipcMain.handle('channel', handler);
```

GOOD:

```typescript
// In electron/main.ts or electron/ipc/ (Prana or consumer-owned)
ipcMain.handle('tasks:list', async () => {
    const tasks = await db.tasks.findMany();
    return ServerResponse.success({ data: tasks });
});
```

---

### Extract Platform Interaction from ViewModel

BAD:

```typescript
function useWindowViewModel() {
    const minimize = () => window.electronAPI?.minimizeWindow();
    return { minimize };
}
```

GOOD:

```typescript
// Service abstraction (Astra or consumer utility)
const windowService = {
    minimize: () => window.electronAPI?.minimizeWindow(),
};

// ViewModel consumes service
function useWindowViewModel() {
    const minimize = () => windowService.minimize();
    return { minimize };
}
```

---

## Validation Requirements

Runtime Boundary is compliant only if:
- no Electron imports exist in Astra src/
- no contextBridge usage exists in Astra
- no ipcMain handlers exist in Astra
- no BrowserWindow code exists in Astra
- all IPC in repositories goes through IpcService
- window.electronAPI is typed with a declared interface
- runtime lifecycle is fully owned by Prana
- service abstractions mediate all runtime access
- Views and ViewModels do not access runtime APIs directly

---

## Compliance Goal

Astra must behave as:
- a service abstraction provider
- a runtime boundary enforcer
- a platform-neutral engineering platform
- a consumer of typed runtime contracts

NOT:
- a runtime infrastructure owner
- an Electron API host
- a contextBridge manager
- a main process orchestrator

---

## Final Invariant

Astra provides service abstractions over runtime infrastructure.

Astra does not own runtime infrastructure.

Astra consumes runtime capabilities through controlled, typed interfaces.

Prana owns and manages all runtime infrastructure.

This separation guarantees that Astra code remains:
- platform-neutral
- runtime-swappable
- testable without Electron
- upgrade-safe when runtimes change

```text
Astra
    Service Abstractions
        ↓

Prana
    Runtime Infrastructure
```
