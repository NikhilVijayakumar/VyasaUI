# Architecture: Feature Module Structure

This document defines the canonical folder structure for building feature modules in applications that consume Astra. Astra is a **stateless UI library** — it provides the primitives, types, and patterns, while each consumer app owns its feature modules with their own state and business logic.

## Astra's Role

Astra provides state management and data access primitives:

| Layer | What Astra Provides |
|-------|-------------------|
| **State Hooks** | `useDataState<T>`, `AppState<T>`, `StateType` for async data flow |
| **Data Layer** | `ApiService` (HTTP), `IpcService` (Electron IPC), `ServerResponse<T>`, `HttpStatusCode` for API communication |
| **UI Utilities** | `AppStateHandler` for conditional rendering of loading/error/empty/success states |

UI components (atoms, molecules, organisms, templates), theming (`ThemeProvider`, `useTheme`), and localization (`LanguageProvider`, `useLanguage`) are provided by **Prati**. See the Prati documentation for setup and usage.

## Consumer App's Role

The consumer app builds feature modules using the following structure. Each feature module encapsulates a single domain concern with clear separation of concerns.

## Canonical Directory Layout

```
src/
├── features/
│   └── [feature-name]/
│       ├── model/           # Type definitions and DTOs
│       │   └── <feature>.types.ts
│       ├── repo/            # Data access layer
│       │   └── <feature>Api.ts
│       ├── hooks/           # ViewModel custom hooks
│       │   └── use<Feature>.ts
│       └── view/
│           ├── components/  # Presentational leaf components
│           │   └── <Name>Component.tsx
│           └── pages/       # Stateful page-level containers
│               └── <Feature>Page.tsx
├── common/                  # Shared utilities (optional)
│   └── repo/
│       └── ApiClient.ts
├── layout/                  # App shell layout
├── App.tsx
└── main.tsx
```

## Layer Responsibilities

### `model/` — Domain Types

Defines the data shapes for the feature. Contains only TypeScript interfaces and type aliases. No logic, no imports from UI layers.

```typescript
// src/features/users/model/user.types.ts
import { AppState } from 'astra';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserState extends AppState<User[]> {
  selectedUser: User | null;
}
```

### `repo/` — Data Access

Handles all external communication (HTTP APIs, Electron IPC). Built on Astra's `ApiService` (WEB) or `IpcService` (ELECTRON). No UI concerns.

#### WEB — ApiService

```typescript
// src/features/users/repo/usersApi.ts
import { ApiService, ServerResponse } from 'astra';
import { User } from '../model/user.types';

const api = new ApiService('https://api.example.com', { internal_server_error: 'Server unavailable' });

export const usersApi = {
  list: (): Promise<ServerResponse<User[]>> => api.get('/users'),
  get: (id: string): Promise<ServerResponse<User>> => api.get(`/users/${id}`),
};
```

#### ELECTRON — IpcService

```typescript
// src/features/tasks/repo/tasksIpc.ts
import { IpcService, ServerResponse } from 'astra';
import { Task } from '../model/task.types';

const ipc = new IpcService();

export const tasksIpc = {
  list: (): Promise<ServerResponse<Task[]>> => ipc.invoke('tasks:list'),
  get: (id: string): Promise<ServerResponse<Task>> => ipc.invoke('tasks:get', { id }),
};
```

The repository contract remains identical. Only the service abstraction differs.

### `hooks/` — ViewModel Layer

Custom React hooks that own all state and business logic for the feature. These are the ViewModel layer in MVVM. They wrap `useDataState`, consume repositories, and expose a clean interface to the view.

```typescript
// src/features/users/hooks/useUsers.ts
import { useDataState } from 'astra';
import { usersApi } from '../repo/usersApi';

export const useUsers = () => {
  const [appState, execute] = useDataState<User[]>();

  const load = () => execute(() => usersApi.list());

  return { appState, load };
};
```

### `view/components/` — Presentational Components

Pure UI components that receive data via props and emit events via callbacks. No data fetching, no business logic. These map to Astra's own component philosophy (stateless, props-driven).

```typescript
// src/features/users/view/components/UserCard.tsx
import { User } from '../../model/user.types';

interface Props {
  user: User;
  onSelect: (id: string) => void;
}

export const UserCard = ({ user, onSelect }: Props) => (
  <div onClick={() => onSelect(user.id)}>
    <p>{user.name}</p>
  </div>
);
```

### `view/pages/` — Stateful Page Containers

Page-level components that serve as route entry points. They call ViewModel hooks, compose the UI from Astra primitives and feature components, and use `AppStateHandler` for conditional rendering. This is the only layer that combines state management with presentation.

```typescript
// src/features/users/view/pages/UsersPage.tsx
import { AppStateHandler } from 'astra';
import { useUsers } from '../../hooks/useUsers';
import { UserCard } from '../components/UserCard';

export const UsersPage = () => {
  const { appState, load } = useUsers();

  return (
    <AppStateHandler
      appState={appState}
      SuccessComponent={({ appState }) => (
        <div>
          {appState.data?.map(user => (
            <UserCard key={user.id} user={user} onSelect={(id) => console.log(id)} />
          ))}
        </div>
      )}
      errorMessage="Failed to load users"
    />
  );
};
```

## Data Flow

```
User Interaction
      ↓
Page (view/pages/) — calls ViewModel hook
      ↓
ViewModel (hooks/) — manages state, calls repository
      ↓
Repository (repo/) — communicates via ApiService / IPC
      ↓
Backend / Database
```

State flows back up through the same chain:

```
Backend → ServerResponse → ViewModel (useDataState) → AppState → Page → Component (props)
```

## Rules

- **`model/`** contains ONLY types. No functions, no React, no API calls.
- **`repo/`** contains ONLY data access. No UI, no business logic, no state management.
- **`hooks/`** contains ONLY ViewModel hooks. No JSX, no imports from `view/`.
- **`view/components/`** contains ONLY presentational components. No data fetching, no `useDataState`.
- **`view/pages/`** is the only layer that composes hooks + presentation. Page components call hooks and render children.
- **Astra components** are stateless — always use `useDataState` in hooks, never in a pure component.
- **Localization and theming** are provided by Prati. If your consumer app uses Prati, localization strings should be resolved in the ViewModel hook and passed as props to components. Hooks must not import Prati hooks directly unless documented as a cross-library dependency.

## Consumer Adaptation

When building an app on top of Astra, follow these principles:

1. **Feature boundaries** — Each domain concern gets its own feature directory under `src/features/`. Features should NOT import from each other's internals; share types via `common/`.
2. **Shell features** — Layout/shell features (e.g., app chrome, navigation) may omit `hooks/` and `repo/` if they have no data dependencies.
3. **Shared packages** — Put shared API utilities in `common/repo/`. Feature repos may use these but must not import from other features' repos.
4. **State is local** — Each feature owns its own state via its ViewModel hooks. Do not share state between features; pass data through URL params or a shared context if needed.

## Related

- [MVVM Pattern](mvvm-pattern.md) — Conceptual deep dive into Model-View-ViewModel
- [Hooks](hooks.md) — `useDataState` and ViewModel hook pattern
- [State Management](state-management.md) — `AppState`, `StateType`, `AppStateHandler`
- [Repository](repository.md) — `ApiService`, `ServerResponse`, data access
- [React Integration Guide](../integration-contracts/react.md) — Framework-specific setup
- Prati Documentation — UI components, theming, localization
