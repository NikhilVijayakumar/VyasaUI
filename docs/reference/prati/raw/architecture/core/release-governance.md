# Architecture: Release Governance

Operational guidance for library maintainers covering the three library-governance invariants: **Public API Stability**, **Dependency Safety**, and **Deterministic Build**.

> This document is for **library maintainers** only. Consumer application developers do not need to follow these procedures — they apply to the development and release of Prati itself.

See the authoritative invariants for full rule definitions:
- [Public API Stability Invariant](../invariants/public-api-stability.md)
- [Dependency Safety Invariant](../invariants/dependency-safety.md)
- [Deterministic Build Invariant](../invariants/deterministic-build.md)

---

## Public API Stability — Release Workflow

Every release must be classified against the [Public API Stability Invariant](../invariants/public-api-stability.md) before publishing.

### Semver Classification

| Change Type | Version Bump | Rule |
|-------------|--------------|------|
| New component, hook, or provider added | Minor | Non-breaking |
| Optional prop added to existing component | Minor | Non-breaking |
| Type interface extended with optional fields | Minor | Non-breaking |
| Deprecation added (with replacement) | Minor | Non-breaking |
| New sub-path export added | Minor | Non-breaking |
| Prop removed, renamed, or made required | **Major** | Breaking |
| Hook return type changed | **Major** | Breaking |
| Export removed without deprecation cycle | **Major** | Breaking |
| Import path changed without deprecation | **Major** | Breaking |
| Peer dependency version dropped | **Major** | Breaking |

### Breaking Change Review Checklist

Before publishing any release:

- [ ] Compare `src/lib.ts` exports against previous release — any removals?
- [ ] Compare all prop interfaces against previous release — any required prop additions or renames?
- [ ] Compare all hook return types against previous release — any shape changes?
- [ ] Check all `@deprecated` tags — are all deprecated APIs still exported?
- [ ] Verify semver bump matches the classification table above

### Deprecation Procedure

1. Add `@deprecated` JSDoc tag in version N with replacement reference:

```tsx
/**
 * @deprecated Use `NewComponent` instead. Will be removed in v{N+1}.0.
 */
export { OldComponent } from './OldComponent';
```

2. Keep the deprecated export for the entire deprecation cycle (at minimum one full major version).
3. Remove in version N+1.
4. Document the removal in the changelog with migration instructions.

---

## Dependency Safety — Audit Procedure

Run the following checks before each release. See [Dependency Safety Invariant](../invariants/dependency-safety.md) for the full rule set.

### Pre-Release Dependency Audit

```bash
# Verify no framework in direct dependencies
npm ls react react-dom @mui/material @emotion/react @emotion/styled --depth=0

# Check for duplicate React instances (should be single entry)
npm ls react --depth=99

# Inspect the published dependency tree
npm pack --dry-run
```

All of `react`, `react-dom`, `@mui/material`, `@emotion/react`, and `@emotion/styled` must appear in `peerDependencies` only — not in `dependencies`.

### Dependency Change Policy

| Change | Version Bump | Required Review |
|--------|--------------|-----------------|
| Add runtime dependency | Minor | Architecture review |
| Update runtime dependency | Patch/Minor | Standard review |
| Add peer dependency | **Major** | Architecture review + consumer impact assessment |
| Widen peer dependency range | Minor | Standard review |
| Narrow peer dependency range | **Major** | Architecture review + consumer impact assessment |
| Remove runtime dependency | Minor | Standard review |

### Peer Dependency Version Rules

- Always use `>=` range (never exact pin): `"react": ">=19.0.0"`
- Version floor must match the minimum actually tested and supported
- Do not widen the range beyond tested versions without explicit CI validation

---

## Deterministic Build — Verification Procedure

Every release artifact must be deterministic. See [Deterministic Build Invariant](../invariants/deterministic-build.md) for the full rule set.

### Build Reproducibility Checklist

Run before tagging a release:

- [ ] `npm ci` produces identical `node_modules` across two fresh machines (verify via lockfile hash)
- [ ] `npm run build` run twice on the same commit produces byte-identical `dist/` output
- [ ] No `Date.now()`, `new Date()`, or `Math.random()` calls exist in build configuration or version files
- [ ] All `process.env.*` references in build config have documented default fallbacks (`|| 'default'`)
- [ ] `package-lock.json` is committed and up to date
- [ ] All dev tool versions are pinned exactly in `devDependencies` (no `^` prefix for build tools)
- [ ] Build does not make network requests beyond initial dependency resolution (`npm ci`)

### CI Pipeline Requirements

```yaml
# Required CI steps for every PR that touches source files:
- name: Install (reproducible)
  run: npm ci                       # uses lockfile — never npm install

- name: Build (first pass)
  run: npm run build
  
- name: Verify determinism
  run: |
    cp -r dist dist_first
    npm run build
    diff -r dist dist_first         # must produce no output (byte-identical)
```

### Allowed Non-Determinism

The following variations are acceptable and do not require remediation:

| Variation | Reason |
|-----------|--------|
| File timestamps in `npm pack` tarball | Normalized by npm — does not affect bundle content |
| `__COMMIT_HASH__` injected value | Deterministic for a given commit — reflects actual source |
| Build tool version strings in source map comments | Reflects toolchain; acceptable metadata |

---

## Related

- [Public API Stability Invariant](../invariants/public-api-stability.md)
- [Dependency Safety Invariant](../invariants/dependency-safety.md)
- [Deterministic Build Invariant](../invariants/deterministic-build.md)
- [Getting Started](../integration-contracts/getting-started.md) — consumer setup
