# Dependency Safety Invariant

## Purpose

Prati is a UI component library consumed as a dependency. Its dependency graph must remain minimal, stable, and conflict-free across consumer applications.

Dependency safety guarantees:
- predictable dependency resolution for consumers
- minimal transitive dependency surface
- no duplicate React or MUI instances
- clear peer dependency contracts
- version compatibility with consumer ecosystems

> **Maintainer guidance:** See [Release Governance](../core/release-governance.md) for the dependency audit procedure, change policy table, and peer dependency version rules.

---

## Architectural Rule

Prati declares all framework dependencies as peer dependencies. Runtime dependencies must be limited to those required for component rendering.

### Peer Dependencies

The following must always be peer dependencies (never direct dependencies):
- `react` and `react-dom`
- `@mui/material` and MUI sub-packages
- `@emotion/react` and `@emotion/styled`

A peer dependency may:
- specify a minimum version range
- specify a maximum compatible version
- be widened in minor versions to support new React/MUI releases

A peer dependency may NOT:
- specify an exact version (must use range `>=`)
- be converted to a direct dependency
- duplicate a dependency that the consumer is expected to provide

### Runtime Dependencies

A runtime dependency may:
- provide icon sets (`@mui/icons-material`, `lucide-react`)
- provide animation primitives (`framer-motion`)
- provide utility functions (`uuid`)
- provide rendering libraries (`react-markdown`, `react-syntax-highlighter`)

A runtime dependency should:
- be as lightweight as possible
- have no conflicting transitive dependencies with peer deps
- be evaluated for tree-shakeability

A runtime dependency must NOT:
- duplicate functionality already provided by peer dependencies
- bundle its own version of React, MUI, or Emotion
- introduce global CSS or side effects without consumer opt-in
- exceed reasonable size budgets

### Dev Dependencies

A dev dependency may:
- include build tools (Vite, TypeScript)
- include test frameworks (Vitest, Testing Library)
- include linting and formatting (ESLint, Prettier)

Dev dependencies must NOT:
- be imported by production code paths
- be required at consumer install time
- appear in the published package's dependency tree

---

## Allowed Patterns

### Version Range Specification

Allowed:

```json
{
  "peerDependencies": {
    "react": ">=19.0.0",
    "@mui/material": ">=7.0.0"
  }
}
```

Reason:
Version ranges allow consumers to use any compatible version without conflicts.

---

### Optional Icon Dependencies

Allowed:

```json
{
  "dependencies": {
    "lucide-react": "0.400.0"
  }
}
```

Reason:
Icons are a rendering concern that doesn't conflict with consumer framework choices.

---

## Forbidden Patterns

### Duplicate Framework Dependencies

Forbidden:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

Reason:
React as a direct dependency causes duplicate React instances in consumer bundles, breaking hooks and context.

---

### Exact Version Pins for Peer Dependencies

Forbidden:

```json
{
  "peerDependencies": {
    "react": "19.0.0"
  }
}
```

Reason:
Exact versions prevent consumers from using patch updates or different minor versions.

---

### Heavy Transitive Dependencies

Forbidden:

```json
{
  "dependencies": {
    "lodash": "^4.0.0",
    "moment": "^2.0.0"
  }
}
```

Reason:
Large utility libraries add significant bundle weight for minimal utility. Prefer native APIs or small tree-shakeable alternatives.

---

### Peer Dependency Downgrade

Forbidden:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

when the library requires React 19 features.

Reason:
Misleading version range causes runtime errors for consumers on supported-but-untested versions.

---

## Detection Heuristics

### Framework in Direct Dependencies

Detect:

```json
"dependencies": {
  "react": "...",
  "react-dom": "...",
  "@mui/material": "...",
  "@emotion/react": "..."
}
```

These should be in `peerDependencies`.

---

### Exact Version Pins

Detect:

```json
"peerDependencies": {
  "react": "19.0.0"
}
```

Should use `>=` range.

---

### Large Utility Libraries

Detect:

```json
"dependencies": {
  "lodash": "...",
  "ramda": "...",
  "moment": "...",
  "date-fns": "..."
}
```

Evaluate whether the utility justifies the bundle cost.

---

## Severity Levels

### P0 — Critical

Framework dependency declared as direct dependency instead of peer dependency.

Must fix before release.

### P1 — High

Peer dependency version is exact-pinned or incorrectly ranged.

Must fix.

### P2 — Transitional

Runtime dependency with excessive bundle size or redundant functionality.

Evaluate and optimize.

### P3 — Informational

Dependency graph is clean and follows safety rules.

No action required.

---

## Refactoring Guidance

### Move Framework to Peer Dependencies

BAD:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "@mui/material": "^7.0.0"
  }
}
```

GOOD:

```json
{
  "peerDependencies": {
    "react": ">=19.0.0",
    "@mui/material": ">=7.0.0"
  }
}
```

---

### Widen Version Ranges

BAD:

```json
{
  "peerDependencies": {
    "react": "19.0.0"
  }
}
```

GOOD:

```json
{
  "peerDependencies": {
    "react": ">=19.0.0"
  }
}
```

---

### Replace Heavy Dependencies

BAD:

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

GOOD:

```json
{
  "dependencies": {}
}
```

Prefer native Array/Map/Object methods or inline utilities.

---

## Library Impact

Violating Dependency Safety causes:
- duplicate React/MUI instances in consumer bundles
- version conflicts in consumer dependency resolution
- increased bundle size from unnecessary transitive dependencies
- consumer debugging difficulty from version mismatches
- install failures from incompatible peer dependency ranges

Without Dependency Safety:
Prati becomes a dependency conflict source
instead of a safely consumable library.

---

## Migration Notes

### Dependency Audit

Before each release, run:

```bash
npm ls --depth=0
npm ls react
npm ls @mui/material
```

Verify no duplicate framework instances appear.

---

### Dependency Change Policy

| Change Type | Version Bump | Approval |
|-------------|--------------|----------|
| Add runtime dependency | Minor | Review required |
| Update runtime dependency | Patch/Minor | Review recommended |
| Add peer dependency | Major | Architecture review |
| Widen peer range | Minor | Standard |
| Narrow peer range | Major | Architecture review |

---

## Validation Requirements

A release is compliant only if:
- all framework dependencies are peer dependencies
- peer dependency versions use `>=` ranges
- no direct dependency duplicates peer dependency functionality
- no heavy utility libraries are added without size budget review
- dependency tree is free of conflicts with consumer ecosystem
- lockfile is up to date (`package-lock.json`)

---

## Compliance Goal

Prati must behave as:
- safely consumable dependency
- minimal transitive footprint
- conflict-free peer dependency contracts
- predictable install resolution

NOT:
- dependency conflict source
- heavy transitive dependency chain
- duplicate framework instance cause
- version conflict origin
