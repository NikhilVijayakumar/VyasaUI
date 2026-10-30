# React Integration Guide

This guide covers integrating Astra into React applications. Astra provides state management and data access. UI components, theming (`ThemeProvider`, `useTheme`), and localization (`LanguageProvider`, `useLanguage`) are provided by **Prati** — see the Prati integration guide for those.

## Supported Frameworks

- **Vite** (recommended)
- **Next.js**
- **Create React App** (legacy — recommend migration to Vite)

---

## Vite Setup (Recommended)

### 1. Create Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install astra
```

If your app uses Prati as a design system (optional, separate package):

```bash
npm install prati
```

### 2. Astra Usage

Astra requires no root-level provider. Import and use directly in feature modules:

```tsx
import { useDataState, ApiService, AppStateHandler, StateType } from "astra";
```

### 3. Vite Config (Optional)

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": "/src" },
  },
});
```

---

## Next.js Setup

### 1. Install

```bash
npx create-next-app@latest my-app --typescript
cd my-app
npm install astra
```

### 2. Use in Server or Client Components

`useDataState` requires a React client context. Mark files that use it with `"use client"`:

```tsx
"use client";

import { useDataState } from "astra";
```

---

## Feature Module Structure

Astra follows MVVM architecture. See [Feature Structure](../core/feature-structure.md) for the canonical folder layout.

### Directory Layout

```
src/
├── features/
│   └── users/
│       ├── model/          # Domain types and DTOs
│       │   └── users.types.ts
│       ├── repo/           # Data access layer (ApiService or IPC)
│       │   └── usersApi.ts
│       ├── hooks/          # ViewModel custom hooks
│       │   └── useUsers.ts
│       └── view/
│           ├── components/ # Presentational leaf components
│           │   └── UserCard.tsx
│           └── pages/      # Stateful page containers
│               └── UsersPage.tsx
├── common/
│   └── repo/               # Shared API client
│       └── ApiClient.ts
├── App.tsx
└── main.tsx
```

### Layer Mapping

| Directory | MVVM Role | Responsibility |
|-----------|-----------|----------------|
| `model/` | Model | TypeScript interfaces, DTOs, state types |
| `repo/` | Repository | API calls via `ApiService` or IPC |
| `hooks/` | ViewModel | Custom hooks wrapping `useDataState` |
| `view/components/` | View | Pure presentational components (props only) |
| `view/pages/` | Container | Stateful pages that compose hooks + components |

---

## Repository Pattern

```ts
// src/features/users/repo/usersApi.ts
import { ApiService, ServerResponse } from "astra";

const api = new ApiService("https://api.example.com", {
  internal_server_error: "Server unavailable",
});

export const usersApi = {
  list: (): Promise<ServerResponse<User[]>> => api.get("/users"),
  get: (id: number): Promise<ServerResponse<User>> => api.get(`/users/${id}`),
  create: (data: CreateUserDto): Promise<ServerResponse<User>> => api.post("/users", data),
};
```

---

## ViewModel Hook

```tsx
// src/features/users/hooks/useUsers.ts
import { useDataState } from "astra";
import { usersApi } from "../repo/usersApi";

export const useUsers = () => {
  const [state, execute] = useDataState<User[]>();

  const load = () => {
    execute(() => usersApi.list());
  };

  return { state, load };
};
```

---

## Page Component

```tsx
// src/features/users/view/pages/UsersPage.tsx
import { useEffect } from "react";
import { AppStateHandler } from "astra";
import { useUsers } from "../../hooks/useUsers";
import { UserCard } from "../components/UserCard";

export const UsersPage = () => {
  const { state, load } = useUsers();

  useEffect(() => { load(); }, []);

  return (
    <AppStateHandler
      appState={state}
      SuccessComponent={({ appState }) => (
        <div>
          {appState.data?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
      emptyCondition={(data) => data.length === 0}
      errorMessage="Failed to load users"
    />
  );
};
```

---

## Astra + Prati Composition

Astra does not depend on Prati. Wire Prati's UI components into Astra's rendering slots via `AppStateProvider` at app root. Prati then depends on Astra, not the reverse.

```tsx
// App.tsx — wire Prati UI into Astra rendering slots once at root
import { AppStateProvider } from "astra";
import { ThemeProvider, LanguageProvider, LoadingState, ErrorState, EmptyState } from "prati";

function App() {
  return (
    <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
      <LanguageProvider translations={translations} defaultLanguage="en">
        <AppStateProvider value={{
          Loading: LoadingState,
          Error: ({ message }) => <ErrorState message={message} />,
          Empty: EmptyState,
        }}>
          <AppRoutes />
        </AppStateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

```tsx
// Feature ViewModel — Astra for state, app localization passed as option
import { useDataState } from "astra";
import { useLanguage } from "prati";

export const useUsers = () => {
  const { literal } = useLanguage();
  const [state, execute] = useDataState<User[]>(
    {},
    { unexpectedErrorMessage: literal["common.errors.unexpected"] }
  );

  const load = () => execute(() => usersApi.list());

  return { state, load };
};
```

---

## Best Practices

### 1. Use Root Imports

```ts
// Astra
import { useDataState, AppStateHandler, ApiService } from "astra";

// Prati
import { ThemeProvider, Button } from "prati";

// Never mix packages
import { useDataState } from "prati";       // wrong — astra export
import { ThemeProvider } from "astra";      // wrong — design system export
```

### 2. Feature-Focused ViewModels

Each feature should have its own ViewModel hook in `hooks/use<Feature>.ts`:

```tsx
export const useFeature = () => {
  const [dataState, execute] = useDataState<Data>();
  const loadData = () => execute(() => repo.getData());
  return { state: dataState, actions: { loadData } };
};
```

### 3. Type-Safe API Service

```ts
const api = new ApiService(BASE_URL, {
  internal_server_error: "Server unavailable",
  not_found: "Resource not found",
});

const response = await api.get<User[]>("/users");
if (response.isSuccess && response.data) {
  // response.data is typed as User[]
}
```

### 4. Separate UI from Logic

```tsx
// hooks/useUser.ts — ViewModel (Astra + optional Prati localization)
export const useUser = () => {
  const [state, execute] = useDataState<User>();
  const loadUser = (id: number) => execute(() => api.getUser(id));
  return { state, loadUser };
};

// view/pages/UserProfilePage.tsx — Container
export const UserProfilePage = () => {
  const { state, loadUser } = useUser();
  return (
    <AppStateHandler
      appState={state}
      SuccessComponent={({ appState }) => <div>{appState.data?.name}</div>}
      errorMessage="Failed to load user"
    />
  );
};
```

---

## Next Steps

- [Getting Started Guide](getting-started.md) — Basic installation
- [Electron Integration Guide](electron.md) — Desktop app integration
- [Feature Structure](../core/feature-structure.md) — Canonical feature folder layout
- [MVVM Pattern](../core/mvvm-pattern.md) — Architecture deep dive
- [Repository Pattern](../core/repository.md) — API patterns
- Prati Documentation — UI components, theming, localization
