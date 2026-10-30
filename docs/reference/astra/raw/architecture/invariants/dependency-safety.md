# Dependency Governance Invariant

## Purpose

Astra is an Application Engineering Platform with a controlled dependency ecosystem.

Dependencies must remain:

* auditable
* minimal
* actively maintained
* version-controlled
* ownership-compliant
* platform-compliant

Dependency governance guarantees:

* reproducible builds
* predictable upgrades
* controlled dependency surface
* platform consistency
* repository boundary enforcement
* licensing compliance
* long-term maintainability

---

# Architectural Rule

Every dependency must satisfy:

```text
Safety
Ownership
Boundary Compliance
Platform Compliance
Version Control
Licensing Compliance
```

before inclusion.

A dependency is acceptable only if:

* actively maintained
* documented
* auditable
* version controlled
* ownership compliant
* platform compliant
* license approved

---

# Supported Platforms

Astra explicitly supports:

```text
WEB
ELECTRON
```

Astra is not platform-neutral.

Astra provides:

```text
Web Boilerplates

Electron Boilerplates

Repository Templates

Hooks

MVVM

Code Generation
```

for approved targets.

---

# Repository Ownership Model

## Astra Owns

### Architecture

* MVVM
* Repository Pattern
* Validation Architecture
* State Management
* Feature Structure

### Generation

* Boilerplates
* Templates
* Generators

### Platform Support

* Web Integration
* Electron Integration

### Contracts

* Application Contracts
* Runtime Contracts
* Repository Contracts

---

## Prana Owns

### Runtime Infrastructure

* Electron Runtime
* IPC Runtime
* SQLite Runtime
* Storage Runtime
* Scheduler
* Plugin Host
* Virtual Drive

### Runtime Services

* IPC Providers
* Storage Providers
* Runtime Adapters

---

## Prati Owns

### Design System

* Design Tokens
* Theme System
* Localization Assets
* Component Contracts
* Component Library

### Prototype Runtime

* Navigation Runtime
* MockDB Runtime
* Presentation Runtime
* Prototype Components

---

# Dependency Categories

Every dependency must belong to one category.

---

## Shared Dependencies

Used by all Astra targets.

Examples:

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.8.0"
}
```

---

## Web Dependencies

Used only by Web targets.

Examples:

```json
{
  "axios": "^1.15.0",
  "react-router-dom": "^7.0.0"
}
```

---

## Electron Dependencies

Used only by Electron targets.

Examples:

```text
IPC Contracts

Electron Integration Contracts

Prana Runtime Contracts
```

---

## Development Dependencies

Build and development only.

Examples:

```json
{
  "vite": "^7.0.0",
  "eslint": "^9.0.0",
  "vitest": "^3.0.0"
}
```

---

## Documentation Dependencies

Documentation-only consumption.

Examples:

```text
Prati Design Documentation

Prati Theme Documentation

Prati Localization Documentation

Prati Component Contracts
```

These are not runtime dependencies.

---

# Dependency Safety Rules

Dependencies must satisfy:

* maintained within last 12 months
* no active high-severity CVEs
* approved license
* documented API
* predictable upgrade path
* justified inclusion

---

# Allowed Licenses

Approved:

```text
MIT

Apache 2.0

BSD
```

---

# Restricted Licenses

Require explicit review:

```text
GPL

AGPL

LGPL

Custom Licenses
```

---

# Version Governance

---

## Allowed

Pinned versions:

```json
{
  "axios": "1.15.0"
}
```

or controlled ranges:

```json
{
  "axios": "^1.15.0"
}
```

---

## Forbidden

```json
{
  "axios": "*"
}
```

```json
{
  "axios": "latest"
}
```

```json
{
  "axios": "x.x.x"
}
```

Reason:

Non-deterministic builds.

---

# Lockfile Governance

Required:

```text
package-lock.json
```

or equivalent lockfile.

Must be committed.

Purpose:

```text
Reproducible Builds
```

---

# Platform Dependency Rules

---

## WEB

Allowed:

```text
Axios

REST Clients

Browser APIs

React Router
```

Forbidden:

```text
Electron Runtime Infrastructure
```

---

## ELECTRON

Allowed:

```text
IPC Contracts

IpcService

Electron Repository Templates
```

Forbidden:

```text
Direct Runtime Ownership
```

---

# Runtime Infrastructure Ownership

Astra may provide:

```text
IpcService

IPC Repository Templates

Electron Application Templates

IPC Contracts
```

Astra may not own:

```text
ipcMain

ipcRenderer

contextBridge

BrowserWindow

Electron Lifecycle
```

These belong to:

```text
Prana
```

---

# Repository Boundary Rules

---

## Allowed

```text
Astra
    -> Prana Contracts

Astra
    -> Prati Documentation

Astra
    -> Prati Contracts
```

---

## Forbidden

```text
Astra
    -> Prati Prototype Runtime

Astra
    -> Prati Component Runtime

Astra
    -> Prana Runtime Infrastructure
```

---

## Forbidden Circular Dependencies

```text
Prana -> Astra -> Prana

Prati -> Astra -> Prati
```

Circular ownership is prohibited.

---

# Documentation Dependency Rules

Documentation dependencies must be derived from:

```text
README.md

docs/raw/**
```

only.

Forbidden:

```text
src/**

package.json

runtime implementations

component implementations
```

Documentation is authoritative.

---

# Dependency Detection Heuristics

---

## Vulnerabilities

Run:

```bash
npm audit
```

Flag:

* CRITICAL
* HIGH

---

## Duplicate Core Libraries

Run:

```bash
npm ls react
npm ls react-dom
npm ls @mui/material
```

Flag:

* multiple versions

---

## Unused Dependencies

Detect:

```text
Declared but never imported
```

---

## Wildcard Versions

Detect:

```text
*
latest
x.x.x
```

---

## Large Dependency Trees

Flag:

```text
>50 transitive dependencies
```

without documented justification.

---

## License Violations

Flag:

```text
Unknown License

GPL

AGPL

Proprietary
```

without approval.

---

# Severity Levels

## P0 — Critical

Examples:

* Active CVE >= 9.0
* Malicious dependency
* Missing ownership
* Runtime ownership violation

Must fix before release.

---

## P1 — High

Examples:

* CVE >= 7.0
* Duplicate core libraries
* Boundary violations
* Wildcard versions
* Circular dependency

Must fix within release cycle.

---

## P2 — Transitional

Examples:

* Unused dependency
* Large dependency tree
* License review pending

Requires migration plan.

---

## P3 — Informational

Fully compliant dependency ecosystem.

No action required.

---

# Refactoring Guidance

## Replace Unmaintained Packages

BAD:

```json
{
  "deprecated-lib": "^1.0.0"
}
```

GOOD:

```json
{
  "active-lib": "^2.0.0"
}
```

---

## Remove Unused Dependencies

BAD:

```json
{
  "lodash": "^4.17.21"
}
```

unused.

GOOD:

```text
Remove dependency
```

---

## Align Core Libraries

BAD:

Multiple React versions.

GOOD:

Single React version across:

```text
peerDependencies
devDependencies
```

---

## Reduce Dependency Surface

Prefer:

```text
Native APIs

Smaller Libraries

Internal Utilities
```

when reasonable.

---

# Validation Requirements

Dependency governance is compliant only when:

* all dependencies are maintained
* all dependencies are licensed appropriately
* no CRITICAL vulnerabilities exist
* no HIGH vulnerabilities exist
* versions are controlled
* lockfile is committed
* ownership is documented
* repository boundaries are respected
* no circular dependencies exist
* platform rules are respected
* runtime ownership is respected
* documentation dependencies are documented

---

# Compliance Goal

Astra must behave as:

```text
An Application Engineering Platform

A Controlled Dependency Ecosystem

A Dual-Platform Framework

A Reproducible Build Substrate

A Boilerplate Generation Platform
```

NOT:

```text
A Dependency Sink

A Runtime Platform

A Design System

A Prototype Runtime

A Circular Dependency Host
```

---

# Final Invariant

Every dependency introduced into Astra must be:

* safe
* maintained
* version controlled
* ownership compliant
* platform compliant
* boundary compliant
* license compliant
* auditable

and must not violate the architectural separation between:

```text
Prana
    Runtime Platform

Astra
    Application Engineering Platform

Prati
    Design System Platform
```
