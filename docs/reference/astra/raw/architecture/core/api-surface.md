# Architecture: Public API Surface

Astra is a library with a defined public API contract. See [Public API Stability Invariant](../invariants/public-api-stability.md) for the authoritative rules.

## Astra vs Design Systems

Astra's public API is limited to state management, data access, and async lifecycle primitives. UI components, theming, and localization are design-system concerns — they belong in an external design system (e.g. Prati) and are wired into Astra's rendering slots via `AppStateProvider`.

Astra has no dependency on any design system. Design systems depend on Astra, not the reverse.

| Concern | Package | Exports |
|---------|---------|---------|
| State management | `astra` | `useDataState`, `AppStateHandler`, `AppStateProvider`, `AppStateContext`, `AppStateComponents`, `AppStateHandlerProps`, `StateType`, `StateCode`, `AppState` |
| Data access (WEB) | `astra` | `ApiService`, `ServerResponse`, `HttpStatusCode`, `getApiService`, `getStatusMessage` |
| Data access (ELECTRON) | `astra` | `IpcService`, `ServerResponse` |
| Transport interface | `astra` | `ITransportService`, `Platform` |
| UI state rendering | external (e.g. `prati`) | `LoadingState`, `ErrorState`, `EmptyState` — wired via `AppStateProvider` |
| Theming | external (e.g. `prati`) | `ThemeProvider`, `ThemeToggle`, `useTheme` |
| Localization | external (e.g. `prati`) | `LanguageProvider`, `useLanguage` |

## Entry Points

The public API surface is defined by two mechanisms:

### Root Entry Point

`src/lib.ts` controls what consumers import from `astra`:

```typescript
// src/lib.ts — only export intentional public symbols
export { useDataState } from './common/hooks/useDataState';
export type { AppState } from './common/state/AppState';
export { StateType, StateCode } from './common/state/AppState';
export { default as AppStateHandler } from './common/components/organisms/AppStateHandler';
export type { AppStateHandlerProps } from './common/components/organisms/AppStateHandler';
export { AppStateProvider, AppStateContext } from './common/components/organisms/AppStateContext';
export type { AppStateComponents } from './common/components/organisms/AppStateContext';
export { ApiService } from './common/repo/ApiService';
export { getApiService } from './common/repo/apiServiceFactory';
export { HttpStatusCode, getStatusMessage } from './common/repo/HttpStatusCode';
export { ServerResponse } from './common/repo/ServerResponse';
export { IpcService } from './common/repo/IpcService';
export type { ITransportService, Platform } from './common/repo/types';
```

### Subpath Exports

Package.json declares subpath exports for scoped imports:

```json
{
  "exports": {
    ".": "./src/lib.ts"
  }
}
```

## What Makes a Public Export

A symbol is public only if it is exported through a declared entry point. Internal utilities, private components, and implementation details must remain inaccessible.

A public export must:
- be documented in the relevant architecture doc
- have a stable interface (no breaking changes within major version)
- have a clear, testable contract
- follow naming conventions

## Barrel Export Rules

Barrel files (`index.ts`) aggregate module exports. Follow these rules:

```typescript
// Good: named exports of intentional public symbols
export { useDataState, AppStateHandler } from './hooks';
export { ApiService, IpcService, ServerResponse, HttpStatusCode } from './repo';
export { StateType } from './state/AppState';
export type { AppState } from './state/AppState';

// Bad: indiscriminate re-exports
export * from './internal';  // may expose internal symbols
```

## Deprecation Policy

When a public API must change:

```typescript
// Mark the old symbol as @deprecated with a replacement path
/** @deprecated Use `useDataState` instead. Removed in v2.0. */
export { useApiState as useOldState } from './hooks';
```

Deprecated APIs must:
- be documented with `@deprecated` JSDoc tag
- include the replacement API name
- specify the removal version
- remain functional for one major version after deprecation

## Internal vs External

| Scope | Import Path | Stability |
|-------|-------------|-----------|
| Public | `astra` | Stable, semver |
| Internal | `src/common/hooks` | Unstable, no guarantees |
| Design System | external | See your design system's documentation |

Consumers must never import from internal paths. Undocumented subpaths are not part of the public contract. Design system symbols are never exported from `astra` — they are separate packages with independent versioning.

## Related

- [Feature Structure](feature-structure.md)
- [Build](build.md)
- [Dependencies](dependencies.md)
