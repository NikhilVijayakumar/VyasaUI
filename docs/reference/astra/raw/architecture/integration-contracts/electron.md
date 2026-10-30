# Electron Integration Guide

Astra works in Electron desktop applications. This guide covers integration patterns specific to Astra in an Electron renderer process. For Electron main process setup, IPC handler definitions, and application menus, refer to the [Electron documentation](https://www.electronjs.org/docs).

## Prerequisites

- Node.js 18+
- Electron 28+
- Vite with electron plugins (recommended)

## Project Setup

### 1. Initialize Electron with Vite

```bash
npm create vite@latest my-electron-app -- --template react-ts
cd my-electron-app
npm install astra electron electron-builder vite-plugin-electron vite-plugin-electron-renderer
```

### 2. Configure Vite for Electron

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "electron/main.ts",
        onstart(args) {
          args.startup();
        },
      },
    ]),
    renderer(),
  ],
  server: {
    port: 5173,
  },
});
```

## Provider Setup

Astra provides `AppStateProvider` to wire in your design system's loading/error/empty components once at app root. `ThemeProvider`, `LanguageProvider`, and UI components come from your design system (e.g. Prati), not from Astra.

```tsx
// src/App.tsx — wire Astra + design system at renderer root
import { AppStateProvider } from "astra";
import { ThemeProvider, LanguageProvider, LoadingState, ErrorState, EmptyState } from "prati";
import { MainLayout } from "./layout/MainLayout";
import enTranslations from "./localization/en.json";
import esTranslations from "./localization/es.json";

function App() {
  return (
    <ThemeProvider lightTheme={lightTheme} darkTheme={darkTheme}>
      <LanguageProvider
        translations={{ en: enTranslations, es: esTranslations }}
        availableLanguages={[
          { code: "en", label: "English" },
          { code: "es", label: "Español" },
        ]}
        defaultLanguage="en"
      >
        <AppStateProvider value={{
          Loading: LoadingState,
          Error: ({ message }) => <ErrorState message={message} />,
          Empty: EmptyState,
        }}>
          <MainLayout />
        </AppStateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
```

## IPC Repository Pattern

In Electron, the repository layer uses `IpcService` (Astra's service abstraction over `window.electronAPI`) instead of HTTP. The ViewModel and View layers are unchanged — only the repository's data source differs.

```typescript
// src/features/resources/repo/resourcesIpc.ts
import { IpcService, ServerResponse } from "astra";
import { Resource } from "../model/resource.types";

// IpcService is Astra's service abstraction over Electron IPC.
// It delegates to window.electronAPI under the hood (exposed by Prana's preload context bridge).
const ipc = new IpcService();

export const resourcesIpc = {
  list: async (): Promise<ServerResponse<Resource[]>> => {
    return ipc.invoke("resource:list");
  },
  get: async (id: string): Promise<ServerResponse<Resource>> => {
    return ipc.invoke("resource:get", id);
  },
};
```

The IPC response must return a `ServerResponse<T>` shape so that `useDataState` can process it correctly:

```typescript
// electron/ipc/resource.handlers.ts (main process — Prana or consumer-owned)
import { ipcMain } from "electron";
import { ServerResponse } from "astra";

ipcMain.handle("resource:list", async (): Promise<ServerResponse<Resource[]>> => {
  const resources = await db.resources.findAll();
  return { isError: false, isSuccess: true, status: 200, statusMessage: "OK", data: resources };
});
```

## MVVM with IPC

The ViewModel hook is identical to the browser pattern — it wraps the repository with `useDataState`:

```typescript
// src/features/resources/hooks/useResources.ts
import { useDataState } from "astra";
import { resourcesIpc } from "../repo/resourcesIpc";

export const useResources = () => {
  const [state, execute] = useDataState<Resource[]>();
  const load = () => execute(() => resourcesIpc.list());
  return { state, load };
};
```

## Localization Compliance

All user-facing strings should come from your app's localization system. If using Prati, use `useLanguage` (from `prati`, not `astra`). This applies to every component in the renderer, including titles, buttons, and window chrome text.

```tsx
// src/features/shell/view/components/TitleBar.tsx
import { useLanguage } from "prati";

export function TitleBar() {
  const { literal } = useLanguage();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{literal["app.title"]}</span>
      <div>
        <button
          aria-label={literal["window.minimize"]}
          onClick={() => window.electronAPI?.minimizeWindow()}
        >
          {literal["window.minimizeIcon"]}
        </button>
        <button
          aria-label={literal["window.maximize"]}
          onClick={() => window.electronAPI?.maximizeWindow()}
        >
          {literal["window.maximizeIcon"]}
        </button>
        <button
          aria-label={literal["window.close"]}
          onClick={() => window.electronAPI?.closeWindow()}
        >
          {literal["window.closeIcon"]}
        </button>
      </div>
    </div>
  );
}
```

Translation file:

```json
{
  "app": { "title": "My Application" },
  "window": {
    "minimize": "Minimize",
    "maximize": "Maximize",
    "close": "Close",
    "minimizeIcon": "−",
    "maximizeIcon": "□",
    "closeIcon": "×"
  }
}
```

## Platform Neutrality

Astra's core library never imports Electron or Node.js APIs. Astra provides `IpcService` as a runtime-neutral service abstraction that delegates to `window.electronAPI` — it never imports Electron directly. See [Runtime Boundary Invariant](../invariants/runtime-boundary.md) for the full rules.

```typescript
// ❌ Never in Astra core library
import { ipcRenderer } from "electron";

// ✅ IpcService wraps window.electronAPI — no direct Electron import
import { IpcService } from "astra";

const ipc = new IpcService();
const resourcesIpc = {
  list: () => ipc.invoke("resource:list"),
};
```

## Full Consumer Structure

```
my-electron-app/
├── electron/                    # Electron main process (consumer-owned)
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── App.tsx                  # Providers setup
│   ├── main.tsx
│   ├── localization/
│   │   ├── en.json
│   │   └── es.json
│   ├── features/
│   │   └── resources/
│   │       ├── model/
│   │       │   └── resource.types.ts
│   │       ├── repo/
│   │   │   └── resourcesIpc.ts       # IPC adapter (IpcService)
│   │       ├── hooks/
│   │       │   └── useResources.ts      # ViewModel
│   │       └── view/
│   │           ├── components/
│   │           └── pages/
│   └── features/shell/
│       └── view/components/
│           └── TitleBar.tsx             # Localized chrome
├── package.json
└── vite.config.ts
```

## Best Practices

1. **Enable Context Isolation** — Always use `contextIsolation: true` in `BrowserWindow.webPreferences`
2. **Use Preload Scripts** — Expose only necessary APIs via the context bridge
3. **Return `ServerResponse<T>` from IPC** — Ensures `useDataState` processes results correctly
4. **Never import Electron in renderer components** — Use `IpcService` instead of `window.electronAPI`
5. **Localize all strings** — Use your app's localization system for window controls, tooltips, and labels; if using Prati, use `useLanguage` from `prati`

## See Also

- [Getting Started Guide](getting-started.md) — Basic Astra setup
- [React Integration Guide](react.md) — React-specific patterns
- [Runtime Boundary Invariant](../invariants/runtime-boundary.md) — Core/platform isolation rules
- [Repository Pattern](../core/repository.md) — Data access patterns
- Prati Documentation — ThemeProvider, LanguageProvider, localization, UI components
- [Electron documentation](https://www.electronjs.org/docs) — Main process, IPC handlers, menus
