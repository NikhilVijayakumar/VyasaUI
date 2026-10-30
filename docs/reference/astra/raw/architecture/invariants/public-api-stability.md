# Public API Stability Invariant

## Purpose

Astra is a library with a defined public API contract.

Only explicitly exported symbols through the library's entry points constitute the public API. Internal utilities, private components, and implementation details must remain inaccessible to consumers.

Public API stability guarantees:
- safe upgrades (consumers depend on contracts, not internals)
- clear documentation surface (what is public is documented)
- refactoring freedom (internals can change without breaking consumers)
- predictable import paths
- semver-compliant versioning

---

## Architectural Rule

Only symbols exported through declared entry points are public.

The public API surface is defined by:
- `src/lib.ts` — root entry point (`astra`)
- Declared subpath exports in `package.json` (`astra/theme`, `astra/components`, etc.)

A public export must:
- be documented
- have a stable interface (no breaking changes within major version)
- have a clear, testable contract
- follow naming conventions

An internal module must:
- never be imported by consumers
- never be documented as public
- be free to change between versions

---

## Allowed Patterns

### Declared Entry Point Exports

Allowed:

```tsx
// src/lib.ts
export * from "./common";
export * from "./common/components";
export * from "./theme";
```

Reason:
Only these paths are documented and supported for consumer imports.

---

### Subpath Exports in package.json

Allowed:

```json
{
  "exports": {
    ".": "./dist/astra.es.js",
    "./theme": "./dist/astra.es.js",
    "./components": "./dist/astra.es.js",
    "./common": "./dist/astra.es.js"
  }
}
```

Reason:
Subpath exports create explicit, supported import boundaries.

---

### Stably Typed Public Interfaces

Allowed:

```tsx
// Public — exported from lib.ts
export interface ThemeProviderProps {
  lightTheme: Theme;
  darkTheme: Theme;
  children: React.ReactNode;
}
```

Reason:
Public interfaces are explicitly typed and versioned.

---

### Internal-Only Modules

Allowed:

```tsx
// src/common/hooks/useInternalHelper.ts — NOT exported from lib.ts
export function useInternalHelper() { ... }
```

as long as `useInternalHelper` is not re-exported through any public entry point.

Reason:
Internal utilities can be refactored freely.

---

## Forbidden Patterns

### Deep Import Into Build Output

Forbidden:

```tsx
import { something } from 'astra/dist/internal/module';
```

Reason:
Build output paths are implementation details — may change without notice.

---

### Undeclared Subpath Import

Forbidden:

```tsx
import { something } from 'astra/internal';
```

where `./internal` is not declared in `package.json` `exports`.

Reason:
Undocumented subpaths are not part of the public contract.

---

### Internal Export Leakage

Forbidden:

```tsx
// src/lib.ts
export * from "./common/hooks/useInternalHelper";
```

where `useInternalHelper` is meant to be private.

Reason:
Internal utilities become de facto public once exported.

---

### Breaking Change to Published API

Forbidden:

- renaming a public export without deprecation cycle
- changing required props of a public component
- removing a public export without major version bump
- changing return type of a public function

Reason:
Consumers depend on stable contracts — breaking changes must follow semver.

---

### Unstable Export Surface

Forbidden:

```tsx
// exporting experimental or unstable symbols through the main entry point
export { experimentalFeature } from "./experimental";
```

without clear `@experimental` or `@alpha` designation.

Reason:
Consumers cannot distinguish stable from unstable API surface.

---

### Public Exposure of Internal Types

Forbidden:

```tsx
// Internal type leaked through public function signature
export function processItem(config: InternalConfig): void;
```

where `InternalConfig` is not exported but appears in a public signature.

Reason:
Consumers may need to import `InternalConfig` to use the API, creating hidden coupling.

---

### Re-exporting Everything From a Module

Forbidden:

```tsx
export * from './internal/registry';
```

where `registry` contains internal symbols not intended for public use.

Reason:
Barrel re-exports can accidentally expose internal APIs.

---

## Detection Heuristics

### Entry Point Audit

Compare `src/lib.ts` exports against what is actually consumed in tests and examples. Flag any export that is:
- undocumented
- marked internal in name or JSDoc
- experimental without clear tagging

---

### Import Path Analysis

Detect imports in consumer projects or examples that use:

```tsx
from 'astra/dist/'
from 'astra/src/'
from 'astra/internal'
```

These are unsupported import paths.

---

### Undeclared Subpath Detection

Check that every subpath used in consumer code is declared in `package.json` `exports` field.

---

### API Surface Diff

Before release, compare current public exports against previous version. Flag:

- removed exports
- renamed exports
- changed type signatures
- added undocumented exports

---

### Internal Type Leakage

Detect public function signatures that reference types from:

```tsx
import ... from '../internal/'
import ... from './internal/'
```

---

## Severity Levels

### P0 — Critical

Public API contract broken without major version bump.

Examples:

- removed public export in minor/patch
- breaking parameter change in minor/patch
- renamed public component without deprecation

Must fix before release.

---

### P1 — High

Internal API accidentally exposed as public.

Examples:

- internal utility exported through barrel
- build output path documented as supported
- internal type leaked through public signature

Must migrate before next minor release.

---

### P2 — Transitional

Deprecated public API with documented replacement.

Examples:

- renamed export with backward-compatible alias
- old subpath still working but marked deprecated
- experimental API clearly tagged

Allowed temporarily with documented migration path.

---

### P3 — Informational

Public API surface is clean and intentional.

No action required.

---

## Refactoring Guidance

### Remove Internal Re-Exports

BAD:

```tsx
// lib.ts
export * from './internal/helper';
```

GOOD:

```tsx
// lib.ts — only export intentional public symbols
export { useDataState, AppStateHandler, AppStateProvider } from './common/hooks';
export { ApiService, IpcService, ServerResponse, HttpStatusCode, getApiService } from './common/repo';
export type { AppState } from './common/state/AppState';
export { StateType, StateCode } from './common/state/AppState';
```

Note: `ThemeProvider`, `LanguageProvider`, `useTheme`, `useLanguage`, and UI components are owned by Prati, not Astra. They must never appear in `src/lib.ts`.

---

### Deprecate Before Removing

BAD:

```tsx
// Remove export without notice
// Version 2.0: export removed
```

GOOD:

```tsx
/** @deprecated Use NewComponent instead. Will be removed in v2.0. */
export { OldComponent } from './old';
```

---

### Hide Internal Types

BAD:

```tsx
// Public function exposes internal type
export function configure(config: InternalRuntimeConfig): void;
```

GOOD:

```tsx
// Public function uses own parameter type
export interface ConfigOptions {
  theme?: 'light' | 'dark';
  language?: string;
}

export function configure(config: ConfigOptions): void;
```

---

### Wrap Internal Modules

BAD:

```tsx
export * from './internal/hooks';
```

GOOD:

```tsx
// Only export specific symbols
export { useDataState } from './internal/hooks/useDataState';
```

---

### Declare Explicit Exports Map

BAD:

```json
// package.json — no exports field
```

GOOD:

```json
{
  "exports": {
    ".": "./dist/astra.es.js",
    "./theme": "./dist/astra.es.js",
    "./components": "./dist/astra.es.js",
    "./common": "./dist/astra.es.js"
  }
}
```

---

## Library Impact

Violating Public API Stability causes:

- consumer breakage on minor/patch upgrades
- refactoring paralysis (internals frozen by consumer usage)
- undocumented API surface (consumers rely on accident)
- semver non-compliance (trust erosion)
- upgrade fear (consumers avoid updates)
- forked consumption (consumers pin to specific commit hashes)
- support burden (internal bugs reported as public API issues)

Without Public API Stability:
Astra becomes a contract-ambiguous codebase
instead of a trusted, upgrade-safe library dependency.

---

## Migration Notes

### Transitional Public API Exceptions Must Include

```tsx
/**
 * @deprecated-public-api
 * Status: <deprecated|experimental|internal-leaked>
 * Replacement: <target API>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Define explicit `exports` map in package.json
2. Audit `src/lib.ts` for unintended re-exports
3. Remove or wrap internal re-exports
4. Add deprecation notices to any API scheduled for removal
5. Add public API surface tests (ensure exports match contract)
6. Document every public export with usage examples

---

## Validation Requirements

The library is compliant only if:

- all public exports are intentionally listed in lib.ts
- no internal modules are re-exported
- all subpath imports are declared in package.json
- no build output paths are part of the public contract
- every public export is documented
- deprecations have clear replacements and removal timelines
- public API surface is tested (exports match expected contract)
- semver rules are followed for all changes

---

## Compliance Goal

Astra must behave as:

- a contract-first library
- an explicitly exported API surface
- a stable, documented dependency
- a semver-compliant package

NOT:

- an internal-leaking module
- a contract-ambiguous codebase
- a break-on-update dependency
- an undocumented export surface
```
