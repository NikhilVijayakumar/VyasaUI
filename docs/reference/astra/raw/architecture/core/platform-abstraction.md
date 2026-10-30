# Architecture: Platform Abstraction

Astra is a runtime-agnostic UI library. See [Runtime Boundary Invariant](../invariants/runtime-boundary.md) for the authoritative rules.

## Core vs Platform-Specific

Core modules must not depend on platform-specific APIs. Separate platform concerns behind abstractions:

| Layer | Allowed APIs | Example |
|-------|-------------|---------|
| Core library | React DOM, MUI abstractions | `useDataState`, `AppStateHandler`, `ApiService` |
| Platform adapters | Browser, Node, Electron | `ApiService` (browser HTTP), IPC adapter (Electron) |
| Prati (separate package) | Theming, localization, UI | `ThemeProvider`, `LanguageProvider`, UI components |

## Browser-Only Features

When a component uses browser APIs, guard it for SSR compatibility. Consumers must implement this pattern in their own codebase — Astra does not export a `ClientOnly` component:

```typescript
// src/common/ClientOnly.tsx — consumer-implemented, not an Astra export
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
```

## Electron Abstraction

Astra provides `IpcService` as the service abstraction over Electron IPC. Repositories consume `IpcService`, never raw `window.electronAPI`:

```typescript
// Consumer-managed IPC repository for Electron
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const resourceIpc = {
  list: async (): Promise<ServerResponse<Resource[]>> => {
    return ipc.invoke('resource:list');
  },
};
```

### What NOT to do

The core library must not import Electron or Node.js APIs:

```typescript
// ❌ Never in core library
import { ipcRenderer } from 'electron';
import { readFile } from 'fs/promises';
import path from 'path';
```

## Node.js-Only Features

Node.js APIs (`fs`, `path`, `process`) are forbidden in all Astra core modules. See [Runtime Boundary Invariant](../invariants/runtime-boundary.md) for the authoritative rule. There are no exceptions for lazy-loaded Node.js imports — any feature requiring Node.js APIs must be implemented in consumer-managed code, not in the Astra library.

## CSS Platform Guards

Platform-specific CSS (e.g., Electron's `-webkit-app-region`) must be isolated:

```typescript
// ✅ Acceptable: isolated in a platform-specific file, not in core
const electronStyles = { WebkitAppRegion: 'drag' as const };
```

## Testing Across Platforms

Verify platform neutrality by testing in browser, Node, and Electron environments:

```bash
npm test                    # jsdom (browser-like)
npm run test:node           # Node environment
npm run test:electron       # Electron environment
```

## Related

- [Repository Pattern](repository.md)
- [Dependencies](dependencies.md)
- [Public API Surface](api-surface.md)
