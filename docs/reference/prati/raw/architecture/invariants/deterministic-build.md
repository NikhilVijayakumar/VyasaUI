# Deterministic Build Invariant

## Purpose

Prati produces a distributable JavaScript bundle. Build output must be deterministic — identical source input must produce identical build output across environments, machines, and time.

Deterministic build guarantees:
- reproducible CI/CD artifacts
- verifiable releases (same commit = same output)
- cacheable build artifacts
- debuggable production issues (source maps match commit)
- auditable release pipeline

> **Maintainer guidance:** See [Release Governance](../core/release-governance.md) for the build reproducibility checklist, CI pipeline requirements, and allowed non-determinism exceptions.

---

## Architectural Rule

Build configuration must not depend on environment-specific state. All build inputs must be committed to version control.

### Build Inputs

Build inputs that must be deterministic:
- source files (committed to git)
- build tool configuration (vite.config.ts, tsconfig.json)
- dependency lockfile (package-lock.json)
- environment variables used in build (documented defaults)

Build inputs that must NOT vary:
- current timestamp or date
- machine hostname or user
- git branch name (commit hash is acceptable for metadata)
- random or pseudo-random values in output
- network-dependent resolution (except first install)
- environment variables without documented defaults

### Build Output

Build output must be identical for identical inputs:

| Artifact | Determinism Requirement |
|----------|------------------------|
| `dist/prati.es.js` | Byte-identical for same source + dep versions |
| `dist/lib.d.ts` | Byte-identical for same source |
| Source maps | Byte-identical for same source |
| Package tarball (`npm pack`) | Reproducible metadata |

### Allowed Non-Determinism

The following are acceptable variations:
- file timestamps in tarball (normalized by `npm pack`)
- git commit hash injected as `__COMMIT_HASH__` (reflects actual commit)
- build tool version strings in source map comments (reflects toolchain)

---

## Allowed Patterns

### Lockfile in Version Control

Allowed:

```bash
# package-lock.json is committed
git add package-lock.json
```

Reason:
Lockfile pins transitive dependency versions for reproducible installs.

---

### Environment Variable Defaults

Allowed:

```typescript
// vite.config.ts
const apiUrl = process.env.PRATI_API_URL || 'https://default.example.com';
```

Reason:
Default value ensures deterministic fallback when env var is not set.

---

### Stable Build ID

Allowed:

```typescript
// version.ts
export const VERSION = '0.1.0';
export const COMMIT_HASH = __COMMIT_HASH__; // injected by build tool
```

Reason:
Version is static; commit hash is deterministic for a given commit.

---

## Forbidden Patterns

### Timestamp Injection

Forbidden:

```typescript
// version.ts
export const BUILD_TIME = new Date().toISOString();
```

Reason:
Output changes on every build — breaks caching and reproducibility.

---

### Random Values in Build Output

Forbidden:

```typescript
// webpack/rollup plugin inlines random class names
className = `prati-${Math.random().toString(36)}`;
```

Reason:
Each build produces different output — impossible to verify artifact integrity.

---

### Environment-Dependent Config Without Defaults

Forbidden:

```typescript
// vite.config.ts
const apiUrl = process.env.API_URL; // no fallback — undefined if not set
```

Reason:
Build behavior depends on a potentially unset environment variable.

---

### Network Resolution at Build Time

Forbidden:

```typescript
// vite.config.ts fetches dynamic config during build
const config = await fetch('https://config.example.com/build.json');
```

Reason:
Network availability and response may vary between builds.

---

## Detection Heuristics

### Timestamp or Date Usage

Detect:

```typescript
Date.now()
new Date()
Date()
```

in build configuration or version files.

---

### Random Value Generation

Detect:

```typescript
Math.random()
crypto.randomUUID()
```

in build output generation paths (CSS modules, class name generation).

---

### Unguarded Environment Variables

Detect:

```typescript
process.env.VARIABLE
```

without:

```typescript
|| 'default'
```

in build configuration files.

---

## Severity Levels

### P0 — Critical

Build output is non-deterministic — same source produces different artifacts.

Must fix before release.

### P1 — High

Build configuration depends on environment-specific state without documented defaults.

Must fix.

### P2 — Transitional

Build includes timestamp metadata that varies but doesn't affect runtime behavior.

Acceptable with documentation.

### P3 — Informational

Build is fully deterministic.

No action required.

---

## Refactoring Guidance

### Remove Timestamp Injection

BAD:

```typescript
export const BUILD_TIME = Date.now();
```

GOOD:

```typescript
export const VERSION = '0.1.0'; // static version
```

---

### Add Environment Variable Defaults

BAD:

```typescript
const mode = process.env.BUILD_MODE;
```

GOOD:

```typescript
const mode = process.env.BUILD_MODE || 'production';
```

---

### Commit Lockfile

BAD:

```text
# .gitignore
package-lock.json
```

GOOD:

```text
# .gitignore (lockfile not in gitignore)
```

Lockfile is committed for reproducible installs.

---

### Pin Tool Versions

BAD:

```json
{
  "devDependencies": {
    "vite": "^7.0.0"
  }
}
```

GOOD:

```json
{
  "devDependencies": {
    "vite": "7.3.2"
  }
}
```

Exact tool versions prevent unexpected build changes.

---

## Library Impact

Violating Deterministic Build causes:
- unreproducible CI artifacts
- untrustworthy releases (cannot verify source → artifact)
- broken caching (every build produces unique output)
- difficult bisection (which commit produced which artifact)
- audit trail gaps

Without Deterministic Build:
Prati releases become untrustworthy artifacts
instead of verifiable, reproducible distributions.

---

## Migration Notes

### Build Reproducibility Checklist

Before each release, verify:
- [ ] `npm ci` produces identical `node_modules` across machines
- [ ] `npm run build` produces byte-identical output for same commit
- [ ] No timestamps, random values, or mutable IDs in output
- [ ] All environment variables have documented defaults
- [ ] Lockfile is committed and up to date
- [ ] Build tool versions are pinned exactly

---

## Validation Requirements

A build is compliant only if:
- same source + same lockfile = byte-identical output
- no timestamps or random values in build output
- all environment variables have documented defaults
- lockfile is committed to version control
- build tool versions are pinned
- build does not make network requests (beyond dep resolution)

---

## Compliance Goal

Prati builds must behave as:
- deterministic artifact generators
- verifiable build pipelines
- reproducible release processes
- cacheable output producers

NOT:
- non-deterministic build systems
- unreproducible artifact sources
- environment-dependent output generators
- unverifiable release pipelines
