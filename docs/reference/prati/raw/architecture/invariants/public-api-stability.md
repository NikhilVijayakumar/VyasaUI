# Public API Stability Invariant

## Purpose

Prati is a published npm package. Consumers depend on a stable public API surface. Breaking changes must be versioned according to semantic versioning (semver) with clear deprecation paths.

Public API stability guarantees:
- predictable upgrade paths for consumers
- clear definition of what constitutes the public API
- deprecation warnings before breaking changes
- documented version compatibility

> **Maintainer guidance:** See [Release Governance](../core/release-governance.md) for the operational semver workflow, breaking change review checklist, and deprecation procedure.

---

## Architectural Rule

The public API is defined by the package's exports in `src/lib.ts` and sub-path exports in `package.json`. Any change that requires consumer code modification is a breaking change and must be released in a major version.

### Public API Definition

The public API includes:
- all exports from `src/lib.ts` (components, hooks, providers, tokens)
- sub-path exports defined in `package.json` (`prati/components`, `prati/theme`)
- TypeScript type definitions in `dist/lib.d.ts`
- peer dependency version requirements
- component prop interfaces

The public API does NOT include:
- internal modules under `src/common/components/*/internal/`
- private utility functions not exported from `src/lib.ts`
- build artifacts beyond the declared exports
- test utilities and test files
- development-only Storybook files

### Breaking Changes

A breaking change is any change that **requires existing consumer code modification** — including TypeScript compilation errors, runtime behavior changes, or import path invalidation. All breaking changes must be released in a major version.

#### Non-breaking changes (safe in minor/patch versions)

A change may:
- add new components, hooks, or providers
- add optional props to existing components
- extend existing type interfaces with new optional fields
- deprecate existing APIs with a migration period
- add new sub-path exports

#### Breaking changes (major version required)

A change may NOT (without a major version bump):
- remove or rename exported components, hooks, or providers
- change existing prop interfaces (rename, remove, or make required)
- change the return type of hooks
- change import paths without a deprecation cycle
- drop peer dependency versions without major version bump
- modify the behavior of existing APIs without deprecation notice
- rename or relocate source files that affect import paths (except internal)

---

## Allowed Patterns

### Adding New Components

Allowed:

```tsx
// src/lib.ts
export * from './common/components';
// Adding a new component to ./common/components is non-breaking
```

Reason:
New components extend the API surface without modifying existing contracts.

---

### Adding Optional Props

Allowed:

```tsx
// Existing
interface CardProps { title: string; children: ReactNode; }

// Extended
interface CardProps { title: string; children: ReactNode; footer?: ReactNode; }
```

Reason:
Optional props do not require existing consumer code changes.

---

### Deprecation With Migration

Allowed:

```tsx
/** @deprecated Use `NewComponent` instead. Will be removed in v2.0. */
export { OldComponent as NewComponent };
```

Reason:
Consumers receive compile-time deprecation warnings and can migrate incrementally.

---

## Forbidden Patterns

### Removing Exports Without Major Version

Forbidden:

```tsx
// v1.0 exports this
export { DataTable } from './organisms/DataTable';

// v1.1 removes it without deprecation
// export { DataTable } from './organisms/DataTable';
```

Reason:
Consumers importing `DataTable` will get build errors after patch/minor update.

---

### Changing Required Props

Forbidden:

```tsx
// v1.0
interface ButtonProps { label: string; }

// v1.1
interface ButtonProps { label: string; icon: IconType; } // new required prop
```

Reason:
All existing consumers that don't pass `icon` will get TypeScript errors.

---

### Renaming Without Deprecation

Forbidden:

```tsx
// Rename without alias
export { NewComponent } from './NewComponent';
// Old `OldComponent` export removed
```

Reason:
Consumers importing the old name get build errors with no migration path.

---

### Changing Hook Return Types

Forbidden:

```tsx
// v1.0
export function useLanguage() { return { literal, currentLanguage }; }

// v1.1
export function useLanguage() { return { translations, lang }; }
```

Reason:
All consumers destructuring `literal` or `currentLanguage` will break.

---

## Detection Heuristics

### Export Removal

Detect:

```tsx
// Previously exported, now missing
```

by comparing exports across versions.

---

### Prop Interface Changes

Detect:

```tsx
interface XProps { ... }
```

where existing required props become renamed, removed, or changed from optional to required.

---

### Hook Return Type Changes

Detect:

```tsx
function useX(): { ... }
```

where return object shape changes between versions.

---

## Severity Levels

### P0 — Critical

Breaking change released in a minor or patch version.

Must revert or release as major.

### P1 — High

API element removed or changed without deprecation cycle in a major version.

Must provide migration guide.

### P2 — Transitional

API element is deprecated with replacement available.

Allowed temporarily during deprecation period.

### P3 — Informational

API changes follow semver and deprecation policy correctly.

No action required.

---

## Refactoring Guidance

### Deprecate Before Removing

BAD:

```tsx
// Direct removal in v2.0
// export { OldComponent } from './OldComponent';
```

GOOD:

```tsx
// v1.x — deprecate
/** @deprecated Use NewComponent instead. */
export { OldComponent } from './OldComponent';

// v2.0 — remove
// export { OldComponent } from './OldComponent';
```

---

### Add, Don't Change

BAD:

```tsx
// Change existing prop
interface CardProps { heading: string; } // was `title`
```

GOOD:

```tsx
// Add new optional prop, keep old
interface CardProps { title: string; heading?: string; }
```

---

### Extend, Don't Narrow

BAD:

```tsx
// Narrow return type
export function useData() { return { items: NonEmptyArray }; } // was Array
```

GOOD:

```tsx
// Keep return type, add refinement
export function useData() { return { items: Array, firstItem?: Item }; }
```

---

## Library Impact

Violating Public API Stability causes:
- unexpected consumer build failures
- version lock (consumers cannot upgrade)
- trust erosion in the library's release process
- increased maintenance burden (consumers fork or vendor)

Without Public API Stability:
Prati becomes an unreliable dependency
instead of a trusted, versioned component library.

---

## Migration Notes

### Deprecation Tagging

```tsx
/**
 * @deprecated
 * Use {replacement} instead.
 * Will be removed in v{major}.0.
 */
```

### Removal Strategy

1. Mark API as deprecated with JSDoc `@deprecated` in version N
2. Provide migration path and replacement
3. Keep deprecated API for at least one major version cycle
4. Remove in version N+1 (next major)

---

## Validation Requirements

A release is compliant only if:
- no exports were removed without a deprecation cycle
- no prop interfaces were narrowed or renamed
- no hook return types were changed
- no import paths were removed without deprecation
- all breaking changes are in major versions
- all deprecated APIs include migration documentation

---

## Compliance Goal

Prati releases must behave as:
- semver-compliant version progressions
- consumer-safe upgrade paths
- predictable API evolution
- trusted dependency contracts

NOT:
- semver-violating breaking changes
- surprise consumer breakage
- undocumented API removals
- unreliable version contracts
