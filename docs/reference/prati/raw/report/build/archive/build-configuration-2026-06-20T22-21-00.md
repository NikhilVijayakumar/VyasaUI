# Build Audit Report — 2026-06-20T22:21:00

## Audit Metadata

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-06-20T22:21:00 |
| **Commit** | `27edf06` |
| **Suite** | Build Integrity Audit |
| **Module** | Configuration (build config, tsconfig, package manifest) |
| **Invariant References** | `docs/raw/architecture/invariants/deterministic-build.md` |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Assessment** | Good — package-export configuration needs remediation |
| **Audit Score** | 80/100 |
| **Critical Findings (P0)** | 1 |
| **Major Findings (P1)** | 3 |
| **Minor Findings (P2)** | 3 |
| **Compliant (P3)** | 53 |
| **Config Files Audited** | 7 |

---

## 2. Audited Files

1. `vite.config.ts` — Vite build configuration
2. `tsconfig.json` — Root TypeScript configuration
3. `tsconfig.app.json` — Application TypeScript configuration (used by dts plugin)
4. `tsconfig.node.json` — Node-scoped TypeScript configuration
5. `package.json` — Package manifest, scripts, dependencies
6. `src/proto-runtime/version.ts` — Build-time version source
7. `package-lock.json` — Dependency lockfile (265 KB, tracked by git)

---

## 3. Summary

| Severity | Count | Meaning |
|----------|-------|---------|
| **P0** | 1 | Broken CJS resolution via `require` in exports map |
| **P1** | 3 | Duplicate React deps, wrong `main` field, `@types` in production deps |
| **P2** | 3 | Missing sourcemap config, missing `sideEffects`, unpinned vitest |
| **P3** | 53 | Compliant — build integrity intact |
| **Total** | 60 | Config files + compliant items |

---

## 4. Overall Score

| Dimension | Score | Rationale |
| --------- | ----- | --------- |
| Vite Correctness | 80/100 | Minor config gaps (sourcemap, dts insertTypesEntry) |
| Bundle Determinism | 90/100 | Build output deterministic; some dev deps use caret ranges |
| Type Generation | 100/100 | Complete type declarations with correct paths |
| ESM/UMD Validity | 50/100 | `require` points to ESM, `main` to ESM, duplicate React deps |
| **Overall** | **80/100** | **One P0 blocks CJS consumers; fixable before release** |

---

## 5. Findings

### Finding ID
BUILD-001

### File
`package.json`

### Category
ESM/UMD Validity

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P0 — Critical

### Violation Type
`require` condition in `exports` map points to ESM bundle (`.mjs`/`.js` with `"type": "module"`), not UMD.

### Evidence
```json
"exports": {
    ".": {
      "types": "./dist/lib.d.ts",
      "import": "./dist/prati.es.js",
      "require": "./dist/prati.es.js",
      "default": "./dist/prati.es.js"
    }
}
```

The `require` condition resolves to `prati.es.js`, which is an ES module. CJS consumers doing `require('prati')` in Node.js will fail with `ERR_REQUIRE_ESM`. A UMD entry (`prati.umd.js`) is produced by the build but never referenced in exports.

### Invariant Rule Violated
`deterministic-build.md §ESM/UMD Validity` — The `require` condition must point to a valid CJS/UMD module, not an ESM module.

### Recommendation
Switch the `require` conditions to point to `./dist/prati.umd.js`:

```json
".": {
  "types": "./dist/lib.d.ts",
  "import": "./dist/prati.es.js",
  "require": "./dist/prati.umd.js",
  "default": "./dist/prati.es.js"
}
```

Apply the same fix to all subpath export entries (`./components`, `./theme`).

### Impact
CJS consumers cannot `require('prati')` — resolution fails. All bundlers that resolve via `require` condition (webpack < 5 with CJS, Jest CJS, raw Node.js `require()`) are affected.

---

### Finding ID
BUILD-002

### File
`package.json`

### Category
ESM/UMD Validity

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P1 — High

### Violation Type
`react` and `react-dom` listed in both `dependencies` and `peerDependencies`.

### Evidence
```json
"peerDependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0",
    ...
},
"dependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0",
    ...
}
```

React and ReactDOM are correctly externalized from the bundle via `rollupOptions.external`, so they must not be in `dependencies`. npm 7+ installs peer deps automatically, making the duplication unnecessary and harmful (duplicate React instances cause "invalid hook call" errors).

### Invariant Rule Violated
`deterministic-build.md §ESM/UMD Validity` — Peer dependencies must be externalized and not duplicated in `dependencies`.

### Recommendation
Remove `react` and `react-dom` from `dependencies` entirely. Keep them only in `peerDependencies`.

### Impact
Consumers may end up with duplicate React installations, causing hook errors, increased node_modules size, and confusing version resolution.

---

### Finding ID
BUILD-003

### File
`package.json`

### Category
ESM/UMD Validity

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P1 — High

### Violation Type
`main` field points to ESM entry instead of UMD entry.

### Evidence
```json
"main": "./dist/prati.es.js",
```

The `main` field is conventionally used as the CJS/UMD entry point. For a dual-format package, `main` should resolve to the UMD bundle. The `module` field correctly points to ESM, but `main` should provide the CJS-compatible fallback.

### Invariant Rule Violated
`deterministic-build.md §ESM/UMD Validity` — `main` must point to UMD bundle.

### Recommendation
Change to:

```json
"main": "./dist/prati.umd.js",
"module": "./dist/prati.es.js",
```

### Impact
Legacy CJS bundlers and tools that read only the `main` field will receive ESM, potentially causing resolution failures.

---

### Finding ID
BUILD-004

### File
`package.json`

### Category
ESM/UMD Validity

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P1 — High

### Violation Type
`@types/react`, `@types/react-dom`, and `@types/react-syntax-highlighter` listed in `dependencies` instead of `devDependencies`.

### Evidence
```json
"dependencies": {
    "@types/react": "19.1.8",
    "@types/react-dom": "19.1.6",
    "@types/react-syntax-highlighter": "^15.5.13",
    ...
}
```

TypeScript declaration packages are purely development-time tooling and must not be shipped to consumers. They add unnecessary weight to `node_modules` and can cause type conflicts if consumers use different versions.

### Invariant Rule Violated
`deterministic-build.md §ESM/UMD Validity` — Type-only packages must be in `devDependencies`.

### Recommendation
Move all `@types/*` packages from `dependencies` to `devDependencies`.

### Impact
Consumers get unnecessary `@types/*` packages installed, potentially conflicting with their own TypeScript configurations.

---

### Finding ID
BUILD-005

### File
`vite.config.ts`

### Category
Vite Correctness

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P2 — Transitional

### Violation Type
`build.sourcemap` not explicitly configured.

### Evidence
```typescript
build: {
    lib: { ... },
    rollupOptions: { ... },
    // build.sourcemap is not set — defaults to false in library mode
}
```

The invariant requires `build.sourcemap` to be explicitly set rather than relying on Vite's default. Without explicit configuration, sourcemaps are not generated, making production debugging difficult.

### Invariant Rule Violated
`deterministic-build.md §Vite Correctness` — Allowed pattern requires `build.sourcemap` explicitly set.

### Recommendation
Add `build.sourcemap: true` to `vite.config.ts`:

```typescript
build: {
    lib: { ... },
    sourcemap: true,
    rollupOptions: { ... },
}
```

### Impact
No source maps in production builds. Debugging production issues requires reverse-engineering from minified output.

---

### Finding ID
BUILD-006

### File
`package.json`

### Category
ESM/UMD Validity

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P2 — Transitional

### Violation Type
`"sideEffects"` field not declared in `package.json`.

### Evidence
```json
{
  "name": "prati",
  "version": "0.1.0",
  "type": "module",
  // no "sideEffects" field
}
```

Without a `sideEffects` declaration, bundlers cannot optimally tree-shake unused re-exports. Since the library re-exports all components from a single entry point, consumers pay for components they don't import unless tree-shaking is fully enabled.

### Invariant Rule Violated
`deterministic-build.md §ESM/UMD Validity` — `"sideEffects"` correctly declared for tree-shaking.

### Recommendation
Add `"sideEffects": false` to `package.json`. If any file has side effects (e.g., CSS imports), list them explicitly:

```json
"sideEffects": false
```

### Impact
Suboptimal tree-shaking. Consumer bundles may include unused components.

---

### Finding ID
BUILD-007

### File
`package.json`

### Category
Bundle Determinism

### Invariant Violated
`docs/raw/architecture/invariants/deterministic-build.md`

### Severity
P2 — Transitional

### Violation Type
Dev dependency `vitest` uses caret range instead of exact pinned version.

### Evidence
```json
"devDependencies": {
    "vitest": "^4.0.16",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.1",
    "@testing-library/user-event": "^14.6.1",
    "@vitest/coverage-istanbul": "^4.0.16",
    "happy-dom": "^20.0.11"
}
```

The invariant requires build and test tool versions to be pinned exactly to prevent unexpected behavior changes across environments.

### Invariant Rule Violated
`deterministic-build.md §Pin Tool Versions` — "Exact tool versions prevent unexpected build changes."

### Recommendation
Pin exact versions for vitest and other toolchain dependencies:

```json
"vitest": "4.0.16",
"@testing-library/jest-dom": "6.9.1",
"@testing-library/react": "16.3.1",
"@testing-library/user-event": "14.6.1",
"@vitest/coverage-istanbul": "4.0.16",
"happy-dom": "20.0.11"
```

### Impact
Different team members or CI agents may get different vitest versions, potentially producing different test results or build output.

---

## 6. Cross-Suite Overlap

No overlapping findings with other audit suites. The ESM/UMD configuration issues are unique to the build integrity scope and do not overlap with component-purity or statelessness audits.

---

## 7. Transitional Violations

| Finding ID | Issue | Status |
| ---------- | ----- | ------ |
| BUILD-005 | `build.sourcemap` not configured | Documented debt — P2, acceptable with plan |
| BUILD-006 | `sideEffects` not declared | Documented debt — P2, acceptable with plan |
| BUILD-007 | Caret ranges on dev deps | Documented debt — P2, acceptable with plan |

---

## 8. Score Improvement Summary

```text
Previous Report: (none)
Previous Score: N/A (Baseline)
Current Score: 80/100
Change: Baseline
```

This is the first build integrity audit. No prior report to compare.

| Dimension | Previous | Current | Change |
| --------- | -------- | ------- | ------ |
| Vite Correctness | — | 80 | Baseline |
| Bundle Determinism | — | 90 | Baseline |
| Type Generation | — | 100 | Baseline |
| ESM/UMD Validity | — | 50 | Baseline |

---

## 9. Final Verdict

```
Good (80/100)
```

The build system is broadly correct and deterministic. Vite configuration is properly structured with correct externalization of peer dependencies. Type declarations are complete. The bundle is deterministic with no timestamp or random-value injection.

**One P0** blocks CJS consumers from resolving the package (`require` points to ESM). **Three P1** issues in dependency management and entry-point configuration must be addressed before public release. The P2 items are minor config gaps.

**Fix order:** P0 (exports.require → UMD) → P1 (duplicate React deps, main field, @types in deps) → P2 (sourcemap, sideEffects, pinned vitest).

---

## 10. Audit Traceability

| Reference | Location |
| --------- | -------- |
| Invariant Document | `docs/raw/architecture/invariants/deterministic-build.md` |
| Build Config | `vite.config.ts` |
| Type Config | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` |
| Package Manifest | `package.json` |
| Version Source | `src/proto-runtime/version.ts` |
| Lockfile | `package-lock.json` (265 KB, git-tracked) |
| CI Config | (none found — no `.github/workflows/` directory) |
| Audit Report | `docs/raw/report/build/latest/build-configuration-2026-06-20T22-21-00.md` |
| Previous Report | (none — baseline audit) |
