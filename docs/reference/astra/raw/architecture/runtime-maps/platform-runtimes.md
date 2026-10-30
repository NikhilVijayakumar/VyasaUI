# Runtime Map: Platform Runtimes

Maps which parts of Astra run in which runtime environments. UI components, theming, and localization belong to **Prati** — see Prati documentation for Prati's platform runtime constraints.

```
Browser                     Node/SSR                  Electron
─────────                   ────────                  ────────
useDataState   ───────────→ useDataState   ──────────→ useDataState
AppStateHandler ──────────→ AppStateHandler ─────────→ AppStateHandler
ApiService     ───────────→ ApiService     ──────────→ ApiService (HTTP)
                                                        │
                                                        └── IPC adapter (consumer-managed)
```

ThemeProvider, LanguageProvider, and UI components (atoms → templates) are Prati's — not mapped here.

## Platform-Specific Code

| Runtime | Astra Allowed | Not Allowed in Core |
|---------|--------------|---------------------|
| Browser | useDataState, ApiService, AppStateHandler | Electron IPC, Node.js APIs |
| Node/SSR | useDataState, ApiService (with SSR guards) | Browser-only APIs without guards |
| Electron renderer | useDataState, AppStateHandler; IPC via consumer adapter | Electron imports in core library |

## Isolation Pattern

Platform-specific code must be isolated in consumer-managed files:

```typescript
// ✅ Consumer-managed Electron adapter
// Not exported from core lib.ts
export const electronApi = {
  list: () => window.electronAPI.invoke('resource:list'),
};
```

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/platform-neutrality.md` | Core must be runtime-agnostic |
| `core/platform-abstraction.md` | Platform isolation guidance |
