# Module Architecture Contract

> Architecture governance contract for a single Astra library module.
> Part of: features → invariants → module-map → audit-governance

---

## Metadata

| Field | Value |
|-------|-------|
| Module | `{module-name}` |
| Feature Doc | `docs/raw/feature/{path}` |
| Implementation | `src/{path}` |
| Layer | 0 / 1 / 2 / 3 |
| Module Classification | `Component / Hook / Repository / Theme / Localization / Token / Export / Capability` |
| Status | ✅ Compliant / ⚠️ Transitional / ❌ Violation |
| Last Reviewed | YYYY-MM-DD |
| Invariants Applied | `stateless-ui, theme-sovereignty, localization, atomic-hierarchy, mvvm-separation, repository-isolation, dependency-safety, public-api-stability, deterministic-build, platform-neutrality` |

---

## 1. Responsibility

Single module responsibility. One reason to change.

Describe ONLY:
- presentation responsibility (components)
- orchestration responsibility (hooks)
- data access responsibility (repositories)
- foundation responsibility (theme/locale/tokens)
- surface responsibility (exports/build)

---

## 2. Module Classification

Select one:

- [ ] Component
- [ ] Hook
- [ ] Repository
- [ ] Theme
- [ ] Localization
- [ ] Token
- [ ] Export
- [ ] Capability

## 3. Module Layer

Select one:

- [ ] Layer 0: Foundation — Theme, Localization, Tokens
- [ ] Layer 1: Data Architecture — State, Repository
- [ ] Layer 2: Component Library — Atoms, Molecules, Organisms, Templates
- [ ] Layer 3: Public Surface — Exports, Build Configuration

## 4. Public API Surface

| Symbol | Kind | Documented | Stable |
|--------|------|-----------|--------|
| `{name}` | component/function/type/constant | ✅/❌ | ✅/⚠️/❌ |

Internal-only items:

- {list items}

## 5. Ownership Classification

| Ownership | Status | Notes |
|-----------|--------|-------|
| State | None / UI-only / Data / Mixed | |
| Theme | Token-driven / Partial-hardcode / Hardcoded | |
| Locale | Key-driven / Partial-strings / Hardcoded | |
| Deps | Minimal / Standard / Heavy | |

## 6. State Rules

> Invariant: `docs/raw/architecture/invariants/stateless-ui.md`

### Allowed
- [ ] UI interaction state
- [ ] Animation state
- [ ] Props-only rendering
- [ ] Controlled component pattern

### Forbidden
- [ ] No business logic
- [ ] No data fetching
- [ ] No API calls
- [ ] No persistence
- [ ] No hidden mutable state

| State Pattern | Scope | MVVM Compliant |
|---------------|-------|----------------|
| {props/useState/useDataState/none} | {UI/Orch/Data/Repo} | ✅/⚠️/❌ |

---

## 7. Theme Rules

> Invariant: `docs/raw/architecture/invariants/theme-sovereignty.md`

### Allowed
- [ ] Theme token references
- [ ] Token constant imports
- [ ] MUI sx with theme refs
- [ ] Styled with theme fn

### Forbidden
- [ ] No hardcoded hex/rgb/hsl
- [ ] No hardcoded px spacing
- [ ] No hardcoded fonts
- [ ] No raw CSS with design values
- [ ] No local style constants

---

## 8. Localization Rules

> Invariant: `docs/raw/architecture/invariants/localization.md`

### Allowed
- [ ] t('domain.key') references
- [ ] Props-driven translated text
- [ ] Dynamic non-text content

### Forbidden
- [ ] No hardcoded strings
- [ ] No string concatenation for display
- [ ] No inline pluralization
- [ ] No locale-specific formatting without active language

| Text Source | Key Pattern | Lang Support |
|-------------|-------------|--------------|
| {t()/Props/Hardcoded/N/A} | {domain.element} | {Single/Multi/N/A} |

---

<!-- @condition: component-only -->
## 9. Atomic Tier

> Invariant: `docs/raw/architecture/invariants/atomic-hierarchy.md`

Applicable only for Component-classified modules.

Tier: [ ] Atom [ ] Molecule [ ] Organism [ ] Template
N/A: [ ] Not a component

### Compliance
- [ ] Imports only same/lower tiers
- [ ] No higher-tier imports
- [ ] No data fetching (atom/molecule)
- [ ] No repo access (atom/molecule)
- [ ] No business logic (atom/molecule)
- [ ] No page layout (organism)

| Violation | Source Tier | Target Tier | Impact |
|-----------|-------------|-------------|--------|

---

<!-- @condition: data-module (hooks, repos) -->
## 10. MVVM Layer

> Invariant: `docs/raw/architecture/invariants/mvvm-separation.md`

Applicable only for Hook or Repository-classified modules.

Layer: [ ] View [ ] ViewModel [ ] Repository
N/A: [ ] Not a data module

### Compliance
- [ ] No JSX in ViewModel
- [ ] No UI imports in ViewModel
- [ ] No data fetching in View
- [ ] No business logic in View
- [ ] No presentation formatting in Repository
- [ ] No View/ViewModel imports in Repository
- [ ] No Repo access in View

---

## 11. Dependency Rules

> Invariant: `docs/raw/architecture/invariants/dependency-safety.md`

### Allowed
- [ ] React / React DOM
- [ ] MUI packages
- [ ] Emotion
- [ ] Astra own modules
- [ ] Standard TS / language utilities

### Forbidden
- [ ] No Electron imports
- [ ] No Node.js builtins
- [ ] No runtime globals at module scope
- [ ] No external uncontrolled styles
- [ ] No abandoned / unmaintained packages

| Rule | Status |
|------|--------|
| Lower modules import from foundation only | ✅/⚠️/❌ |
| Same / lower tier imports only | ✅/⚠️/❌ |
| No cyclic imports | ✅/⚠️/❌ |
| No consumer-specific deps | ✅/⚠️/❌ |

---

## 12. Platform Assumptions

> Invariant: `docs/raw/architecture/invariants/platform-neutrality.md`

### Compatible Environments
- [ ] Browser
- [ ] SSR
- [ ] Electron renderer
- [ ] Test / JSDOM

### Forbidden
- [ ] No Electron APIs
- [ ] No Node.js APIs
- [ ] No window / document at module scope
- [ ] No localStorage without SSR guard
- [ ] No process global access

| Environment | Status |
|-------------|--------|
| Browser | ✅/⚠️/❌ |
| SSR | ✅/⚠️/❌ |
| Electron | ✅/⚠️/❌ |

---

## 13. Compliance Analysis

Scored against all applicable invariants. Scale: P0 (violation) → P3 (compliant). N/A = not applicable.

| Invariant | Score | Evidence |
|-----------|-------|----------|
| Stateless UI | P0/P1/P2/P3 | |
| Theme Sovereignty | P0/P1/P2/P3 | |
| Localization | P0/P1/P2/P3 | |
| Atomic Hierarchy | P0/P1/P2/P3/N/A | |
| MVVM Separation | P0/P1/P2/P3/N/A | |
| Repository Isolation | P0/P1/P2/P3/N/A | |
| Dependency Safety | P0/P1/P2/P3 | |
| Public API Stability | P0/P1/P2/P3 | |
| Deterministic Build | P0/P1/P2/P3 | |
| Platform Neutrality | P0/P1/P2/P3 | |

---

## 14. Detection Heuristics Applied

- [ ] No domain `useState` in components
- [ ] No hex/rgb/hsl in style contexts
- [ ] No string literals in JSX
- [ ] No higher-tier imports
- [ ] No data fetching in View
- [ ] No JSX in ViewModel
- [ ] No Electron / Node / window imports

---

## 15. Architecture Drift

- [ ] State accumulation
- [ ] Hardcoded style creep
- [ ] Hardcoded string creep
- [ ] Cross-tier import creep
- [ ] MVVM layer leakage
- [ ] Platform coupling
- [ ] Export surface bloat
- [ ] Dependency creep

---

## 16. Transitional Violations

| Violation | Invariant | Impact | Migration | Target |
|-----------|-----------|--------|-----------|--------|

---

## 17. Verification Commands

### Stateless UI
```
rg "axios\|fetch(\|ApiService" src/{module-path}
```

### Theme Sovereignty
```
rg "'#[0-9a-fA-F]\{6\}'" src/{module-path}
```

### Localization
```
rg ">[A-Z][a-z].*[a-z]<" src/{module-path} --include "*.tsx"
```

### Platform Neutrality
```
rg "electron\|fs\.\|process\.\|window\.\|document\." src/{module-path}
```

### Dependency Safety
```
rg "import.*from\s*'electron\|import.*from\s*'fs\|import.*from\s*'path" src/{module-path}
```

---

## 18. Confidence

- [ ] High
- [ ] Medium
- [ ] Low

Confidence reflects:
- implementation clarity
- architectural evidence quality
- ownership visibility
- invariant coverage completeness

---

## Template Metadata

| Field | Value |
|-------|-------|
| Template Version | `1.0` |
| Generated From | `module-map governance system` |
| Last Updated | `2026-05-10` |
| Architecture Model | `Token-Driven Atomic MVVM Component Library` |
| Base | `prana runtime_map_template.md v2.0` |
| Invariant Count | 10 |
