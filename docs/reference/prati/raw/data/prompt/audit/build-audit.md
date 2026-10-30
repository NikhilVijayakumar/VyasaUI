# Build Integrity Audit Prompt

You are acting as:

- Build Systems Auditor
- CI/CD Pipeline Reviewer
- Bundle Integrity Inspector

Your task is to audit Prati's build system for integrity and correctness:

1. Deterministic Build

This is a focused audit on the build system dimension of library governance.

---

## Mental Model

| Build Concern | Requirement | Detection |
|---------------|-------------|-----------|
| Configuration | Explicit, environment-independent | `vite.config.ts`, `tsconfig.json` |
| Output | Deterministic, bit-identical on re-build | Two consecutive builds |
| Dependencies | Pinned, lockfile-verified | Lockfile committed, no wildcards |
| Environment | Documented env vars with defaults | `.env.example`, fallbacks |
| Scripts | No source mutation, no network deps | `package.json` scripts |
| Type generation | Reproducible type definitions | `tsc` / `vite` type plugin |
| Bundle format | Valid ESM + UMD output | Package exports, format testing |

---

## Inputs

You will receive:

- Build configuration: `vite.config.ts`
- TypeScript configuration: `tsconfig.json`
- Package manifest: `package.json` (scripts, exports, build config)
- Bundle output: `dist/` directory (if built)
- CI configuration (if available)
- Environment files: `.env`, `.env.example`
- Build scripts referenced in `package.json` scripts
- Invariant document:
  - `docs/raw/architecture/invariants/deterministic-build.md`

The invariant document overrides all assumptions.

---

## Audit Goal

Determine whether the build system behaves as:

- a deterministic, reproducible build producing bit-identical output for identical source
- an explicitly configured build with no environment-dependent behavior
- a valid dual-format package (ESM + UMD) with correct export configuration

OR whether it has drifted into:

- timestamps or random identifiers in build output
- environment-variable-dependent build behavior without documented defaults
- platform-dependent paths or behavior in build config
- build scripts that modify source files
- network-dependent build steps
- missing or incomplete lockfile
- incorrect or missing `exports` configuration
- type generation issues (missing `.d.ts` files, incorrect paths)

---

## Audit Scope

Focus ONLY on build integrity and reproducibility.

Ignore:
- component implementation details
- visual design and styling
- feature completeness
- test coverage
- runtime behavior

unless they intersect with build configuration.

---

## Required Audit Dimensions

Analyze ALL of the following:

---

### 1. Vite Correctness

Detect:
- missing or incorrect `build.outDir` configuration
- incorrect `build.lib` configuration for library mode
- missing `rollupOptions.external` for peer dependencies (React, MUI in bundle)
- incorrect or missing `build.sourcemap` configuration
- missing or incorrect `build.cssCodeSplit` for library mode
- incorrect `resolve.alias` configuration that works in dev but not build
- missing plugins required for the build (TypeScript, dts, etc.)

Allowed:
- [ ] `build.lib` correctly configured for library output
- [ ] Peer dependencies externalized in `rollupOptions.external`
- [ ] `build.sourcemap` explicitly set (not relying on default)
- [ ] All necessary Vite plugins installed and configured

Forbidden:
- [ ] No React/MUI bundled in library output
- [ ] No missing required plugins
- [ ] No incorrect path resolution
- [ ] No sourcemap misconfiguration

Severity mapping:
- P0: React or MUI bundled in library output (breaks consumer)
- P1: missing dts plugin (no type declarations), incorrect sourcemap config
- P2: suboptimal but working build config
- P3: build configuration correct and complete

---

### 2. Bundle Determinism

Detect:
- `new Date()` or `Date.now()` in build configuration files
- `Math.random()` or `crypto.randomUUID()` in build scripts
- timestamps injected into bundle via define or replace plugin
- `module.id` or similar non-deterministic values in source
- CSS class name generation without stable hash
- source content hashing that depends on file system order
- build output that differs between consecutive builds

Allowed:
- [ ] All build output derived deterministically from source
- [ ] Version derived from package.json or git hash (not timestamp)
- [ ] Content hashes based on file content, not timestamps

Forbidden:
- [ ] No timestamps in build output
- [ ] No random identifiers in build output
- [ ] No non-deterministic class name generation
- [ ] No Date/Math.random in build config or scripts

Severity mapping:
- P0: timestamps or random IDs in build output, non-deterministic class names
- P1: Date/Math.random in build config (even if not in output yet)
- P2: hashing from unstable input (file order, etc.)
- P3: fully deterministic build output

---

### 3. Type Generation

Detect:
- missing `dist/*.d.ts` files in build output
- incorrect type declaration paths (not matching source structure)
- `tsconfig.json` missing `declaration: true` or `declarationDir`
- missing `@rollup/plugin-typescript` or `vite-plugin-dts` configuration
- type declarations that export internal types (not just public API)
- `.d.ts` files referencing source paths (not relative to dist)
- ambient type declarations missing for library consumers

Allowed:
- [ ] Type declarations generated for all public exports
- [ ] Type declaration paths match import paths
- [ ] No internal types leaked in declarations
- [ ] All necessary type references included

Forbidden:
- [ ] No missing type declarations
- [ ] No incorrect type declaration paths
- [ ] No internal types in declarations
- [ ] No source path references in declarations

Severity mapping:
- P0: no type declarations generated at all
- P1: missing declarations for some exports, incorrect declaration paths
- P2: internal types included but marked as internal
- P3: complete and correct type declarations

---

### 4. ESM/UMD Validity

Detect:
- missing or incorrect `"type": "module"` in package.json
- incorrect `"main"` field for UMD entry point
- incorrect `"module"` field for ESM entry point
- incorrect or missing `"exports"` map in package.json
- `.mjs` vs `.js` extension mismatch between config and output
- missing or incorrect `"types"` or `"typings"` field
- `"sideEffects"` field missing or incorrect
- dual-format output where ESM and UMD have different behavior

Allowed:
- [ ] `"main"` points to UMD bundle
- [ ] `"module"` points to ESM bundle
- [ ] `"exports"` map correctly defines all subpath imports
- [ ] `"types"` points to generated type declarations
- [ ] `"sideEffects"` correctly declared for tree-shaking

Forbidden:
- [ ] No missing or incorrect entry points
- [ ] No missing subpath exports
- [ ] No incorrect sideEffects declaration
- [ ] No ESM/UMD behavioral differences

Severity mapping:
- P0: package won't resolve in consumer (missing/invalid entry point, ESM/UMD mismatch)
- P1: missing subpath exports, incorrect sideEffects
- P2: missing optional exports config
- P3: correct dual-format package configuration

---

## Finding Format

Each finding MUST include:

```
### Finding ID
BUILD-{nnn}

### File
{config-file-path}

### Category
Vite Correctness / Bundle Determinism / Type Generation / ESM-UMD Validity

### Invariant Violated
docs/raw/architecture/invariants/deterministic-build.md

### Severity
P0 / P1 / P2 / P3

### Violation Type
{short description}

### Evidence
{exact config excerpt or build output inspection}

### Invariant Rule Violated
deterministic-build.md §{Section} — {rule}

### Recommendation
{actionable remediation}

### Impact
{what breaks — consumer resolution, tree-shaking, type safety}
```

---

## Severity Classification

| Severity | Meaning | Action |
|----------|---------|--------|
| P0 | Critical — broken build or resolution | Must fix before release |
| P1 | High — suboptimal build config | Must fix next release |
| P2 | Transitional — documented build debt | Allowed temporarily with plan |
| P3 | Compliant — build integrity intact | No action required |

---

## Output Specification

The audit report MUST include:

1. **Audit Metadata** — timestamp, commit, suite, build configuration files reviewed
2. **Audited Files** — numbered list of configuration files reviewed
3. **Summary** — count per severity (P0-P3)
4. **Overall Score** — per-dimension score out of 100
5. **Findings** — detailed per-finding using the Finding Format above
6. **Cross-Suite Overlap** — findings shared with library-governance audit (Deterministic Build dimension); deduplication guidance for fix plan
7. **Transitional Violations** — known documented tech debt
8. **Audit Traceability** — reference to the audit suite and report location

The report MUST be written to:

```
docs/raw/report/build/latest/build-{module}-{timestamp}.md
```

---

## Invariant Document Authority

When checking compliance:

- The invariant document is the source of truth
- For each finding, reference the specific Allowed or Forbidden pattern section from deterministic-build.md
- Do NOT override invariant rules based on perceived convenience
- Findings overlapping with library-governance audit must be flagged for deduplication in the fix plan

---

# Required Report Structure

## 1. Executive Summary

```text
# Build Audit Report — {timestamp}

Overall Assessment:
Audit Score:
Critical Findings (P0):
Major Findings (P1):
Minor Findings (P2):
Compliant (P3):
Config Files Audited:
```

## 2. Audited Files

Numbered list of all configuration files reviewed.

## 3. Summary

Count per severity (P0–P3).

## 4. Overall Score

Per-dimension score out of 100.

| Dimension | Score |
| --------- | ----- |
| Vite Correctness | X/100 |
| Bundle Determinism | X/100 |
| Type Generation | X/100 |
| ESM/UMD Validity | X/100 |
| **Overall** | **X/100** |

## 5. Findings

All detailed findings using the Finding Format.

## 6. Cross-Suite Overlap

Findings shared with library-governance audit (Deterministic Build dimension); deduplication guidance for fix plan.

## 7. Transitional Violations

Known documented build debt.

## 8. Score Improvement Summary

Compare against the previous report from `docs/raw/report/build/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/100
Current Score: Y/100
Change: +N / -N / No change
```

| Dimension | Previous | Current | Change |
| --------- | -------- | ------- | ------ |
| Vite Correctness | X | Y | +N |
| Bundle Determinism | X | Y | +N |
| Type Generation | X | Y | +N |
| ESM/UMD Validity | X | Y | +N |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

## 9. Final Verdict

```text
{Assessment} ({Score}/100)
```

## 10. Audit Traceability

| Reference | Location |
| --------- | -------- |
| Invariant Document | docs/raw/architecture/invariants/deterministic-build.md |
| Build Config | vite.config.ts |
| Type Config | tsconfig.json |
| Package Manifest | package.json |
| CI Config | .github/workflows/** (if available) |
| Audit Report | docs/raw/report/build/latest/build-{module}-{timestamp}.md |
| Previous Report | docs/raw/report/build/archive/{previous-filename} |

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/build/latest/* docs/raw/report/build/archive/
mkdir -p docs/raw/report/build/latest
```

---

# Output Location

Write the final report to:

```text
docs/raw/report/build/latest/build-{module}-{timestamp}.md
```
