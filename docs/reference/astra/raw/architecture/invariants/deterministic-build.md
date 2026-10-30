# Deterministic Build Invariant

## Purpose

Astra's build process must produce reproducible artifacts.

Given identical source code, configuration, and dependency set, the build must produce byte-for-byte identical output. Build behavior must not depend on environment-specific variables, implicit platform behavior, or non-deterministic tooling.

Deterministic builds guarantee:
- verifiable releases (anyone can reproduce the same output)
- CI/CD reliability (no environment-specific failures)
- deploy consistency (production matches development)
- audit trail integrity (build artifacts match source)
- cache effectiveness (unchanged sources skip rebuilds)

---

## Architectural Rule

Build configuration must be explicit and environment-independent.

The build process must derive only from:
- committed source files
- committed configuration (vite.config.ts, tsconfig.json)
- pinned dependency versions (lockfile)
- explicit environment variables (with documented defaults)

The build process must NOT depend on:
- implicit environment variables (unlisted in .env.example)
- platform-specific behavior (OS-dependent paths, line endings)
- non-deterministic tooling (random IDs in output)
- uncommitted configuration (local overrides)
- network resources unavailable in CI
- timestamps in output artifacts

---

## Allowed Patterns

### Explicit Build Configuration

Allowed:

```tsx
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', '@mui/material'],
    },
  },
});
```

Reason:
All build parameters are explicitly declared — no implicit defaults relied upon.

---

### Lockfile-Committed Reproducibility

Allowed:

```text
package-lock.json (committed to VCS)
```

Reason:
Lockfile ensures identical dependency resolution across all environments.

---

### Env File With Documented Defaults

Allowed:

```text
# .env.example (committed)
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Astra
```

```tsx
// vite.config.ts
const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

Reason:
Every environment variable has a documented default — no hidden build-time dependencies.

---

### Stable Build ID

Allowed:

```tsx
// Use git hash for versioning (deterministic per commit)
import { version } from '../package.json';
```

Reason:
Version derives from committed source, not from build timestamp.

---

### CI Reproducibility Check

Allowed:

```yaml
# In CI: verify build matches source
- run: npm run build
- run: git diff --exit-code dist/  # fail if build output differs from committed
```

Reason:
Automated check ensures build output stays in sync with source.

---

## Forbidden Patterns

### Environment-Coupled Build Behavior

Forbidden:

```tsx
// vite.config.ts
const isDev = process.env.NODE_ENV !== 'production';
const apiUrl = process.env.UNCOMMITTED_API_URL;
```

where `UNCOMMITTED_API_URL` has no documented default or fallback.

Reason:
Build output differs across environments with different env values.

---

### Timestamps in Build Output

Forbidden:

```tsx
// Build-time injection
const buildTime = new Date().toISOString();
```

injected into bundle output.

Reason:
Timestamps make every build output unique — prevents caching and verification.

---

### Random Identifiers in Output

Forbidden:

```tsx
// Non-deterministic class name generation
const className = `css-${Math.random().toString(36)}`;
```

without stable seed or hashing from source content.

---

### Platform-Dependent Paths

Forbidden:

```tsx
// vite.config.ts
const separator = process.platform === 'win32' ? '\\' : '/';
```

Reason:
Paths should use cross-platform utilities like `path.posix`.

---

### Network-Dependent Build Steps

Forbidden:

```json
{
  "scripts": {
    "build": "npm install --registry=http://unreliable-registry.example.com && vite build"
  }
}
```

Reason:
Build fails if network resource is unavailable.

---

### Uncommitted Build Configuration

Forbidden:

```text
# .env.local (not committed)
VITE_SECRET_KEY=my-secret
```

used in build process.

Reason:
Build behavior becomes environment-specific and unreproducible.

---

### Mutable Source Files During Build

Forbidden:

```json
{
  "scripts": {
    "build": "node scripts/generate-config.js && vite build"
  }
}
```

where `generate-config.js` modifies source files.

Reason:
Source changes during build produce unrepeatable second builds.

---

## Detection Heuristics

### Environment Variable Leakage

Detect:

```tsx
process.env.
```

in build configuration files where the variable has no documented default.

---

### Random/Date Usage in Build

Detect:

```tsx
new Date()
Date.now()
Math.random()
crypto.randomUUID()
```

in build scripts and configuration files.

---

### Non-Reproducible Scripts

Detect build scripts that:

- modify source files during build
- download resources from the network
- generate files with unique identifiers

---

### Platform Branching in Build Config

Detect:

```tsx
process.platform
os.platform
os.type
```

in vite.config.ts or build scripts.

---

### Missing Lockfile

Detect:

- package-lock.json not committed
- yarn.lock not committed
- pnpm-lock.yaml not committed

---

## Severity Levels

### P0 — Critical

Build produces different output for identical source across environments.

Examples:

- environment-variable-dependent output
- timestamps in bundle
- random identifiers in output
- platform-dependent paths causing different output

Must fix before release.

---

### P1 — High

Build depends on implicit or uncommitted configuration.

Examples:

- missing env variable defaults
- uncommitted .env.local used in build
- network-dependent build steps

Must migrate.

---

### P2 — Transitional

Legacy build patterns with documented reproducibility plan.

Examples:

- build step that modifies source (with rationale)
- document-generation during build (with deterministic approach)

Allowed temporarily only.

---

### P3 — Informational

Build is fully deterministic and reproducible.

No action required.

---

## Refactoring Guidance

### Replace Timestamps With Committed Version

BAD:

```tsx
const buildVersion = new Date().toISOString();
```

GOOD:

```tsx
import { version } from '../package.json';
const buildVersion = version;
```

---

### Add Defaults for Environment Variables

BAD:

```tsx
const apiUrl = process.env.VITE_API_URL;
```

GOOD:

```tsx
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
```

---

### Remove Random Identifiers

BAD:

```tsx
const className = `astra-${Math.random()}`;
```

GOOD:

```tsx
const className = `astra-${hashContent(source)}`;
```

---

### Commit the Lockfile

BAD:

```text
# .gitignore
package-lock.json
```

GOOD:

```text
# Remove from .gitignore
git add package-lock.json
```

---

### Move Build-Env Configuration to Documented Env

BAD:

```tsx
const mode = process.env.NODE_ENV || process.env.MY_CUSTOM_ENV;
```

GOOD:

```tsx
/** Supported: development | production | test */
const mode = process.env.BUILD_MODE || 'development';
```

---

## Library Impact

Violating Deterministic Build causes:

- unreproducible releases (cannot verify artifact matches source)
- CI-only failures (environment mismatch with local builds)
- cache invalidation (every build produces new output)
- debugging complexity (cannot trust build matches source)
- release auditing gaps (cannot prove artifact integrity)
- wasteful rebuilds (cache never hits)
- onboarding friction (different output per developer machine)

Without Deterministic Build:
Astra becomes an unreproducible artifact generator
instead of a verifiable, trustable build system.

---

## Migration Notes

### Transitional Non-Determinism Must Include

```tsx
/**
 * @deprecated-non-deterministic-build
 * Source: <what produces non-deterministic output>
 * Reason: <why currently exists>
 * Replacement: <deterministic alternative>
 * Removal target: <version>
 */
```

---

### Migration Strategy

1. Commit lockfile if not already committed
2. Remove all timestamps and random values from build output
3. Add documented defaults for all environment variables
4. Remove platform-dependent paths in build config
5. Eliminate source-modifying build steps
6. Verify: `rm -rf dist && npm run build && npm run build` produces identical output

---

## Validation Requirements

The build is compliant only if:

- build output is identical for identical source
- no timestamps exist in build output
- no random identifiers exist in build output
- all environment variables have documented defaults
- no platform-dependent paths exist in build config
- no network-dependent build steps exist
- lockfile is committed and up to date
- two consecutive builds produce the same output
- build does not modify source files

---

## Compliance Goal

Astra must behave as:

- a deterministic build system
- a reproducible artifact producer
- an environment-independent compilation substrate
- a verifiable release pipeline

NOT:

- an environment-coupled build process
- a non-reproducible artifact generator
- a platform-dependent compilation system
- an unverifiable release source
```
