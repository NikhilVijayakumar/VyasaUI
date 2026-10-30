# Architecture Audit Report — 2026-06-19-1734

**Product:** Prati — React Design System & Component Library
**Scope:** `docs/raw/architecture/**`
**Audit Date:** 2026-06-19 17:34 IST (12:04 UTC)
**Auditor:** Automated Architecture Documentation Audit
**Prior Report:** `docs/raw/report/architecture/archive/architecture-audit-2026-06-19-1156.md`

---

## 1. Executive Summary

The architecture documentation corpus enters this audit cycle at **Good (8.5/10)** from the prior report. All 10 required invariants remain present and well-structured. The three open findings from the previous audit (ARCH-CONSISTENCY-003, ARCH-BOUNDARY-003, ARCH-COVERAGE-003) remain **unresolved**. Three new findings have been identified: a stale import path in `core/theming.md` referencing the deprecated `'astra'` package, a translation format mismatch in `core/localization.md`, and a structurally malformed rule definition in `public-api-stability.md`.

The corpus is highly traceable, internally consistent on all major architectural concepts, and provides a complete consumer onboarding path. The remaining issues are all P1/P2 and do not block consumer use.

- **Overall Assessment:** Good
- **Audit Score:** **8.3/10**
- **Critical Findings (P0):** 0
- **Major Findings (P1):** 1 (carry-over)
- **Minor Findings (P2):** 5 (2 carry-over + 3 new)
- **Informational (P3):** 13
- **Documents Audited:** 19

---

## 2. Documents Audited

### Invariants (10 of 10 required)

1. `docs/raw/architecture/invariants/stateless-ui.md`
2. `docs/raw/architecture/invariants/theme-sovereignty.md`
3. `docs/raw/architecture/invariants/localization.md`
4. `docs/raw/architecture/invariants/atomic-hierarchy.md`
5. `docs/raw/architecture/invariants/mvvm-separation.md`
6. `docs/raw/architecture/invariants/repository-isolation.md`
7. `docs/raw/architecture/invariants/platform-neutrality.md`
8. `docs/raw/architecture/invariants/public-api-stability.md`
9. `docs/raw/architecture/invariants/dependency-safety.md`
10. `docs/raw/architecture/invariants/deterministic-build.md`

### Core Architecture (3)

11. `docs/raw/architecture/core/component-tiers.md`
12. `docs/raw/architecture/core/localization.md`
13. `docs/raw/architecture/core/theming.md`

### Runtime Maps (3)

14. `docs/raw/architecture/runtime-maps/component-lifecycle.md`
15. `docs/raw/architecture/runtime-maps/component-tiers.md`
16. `docs/raw/architecture/runtime-maps/provider-hierarchy.md`

### Integration Contracts (3)

17. `docs/raw/architecture/integration-contracts/getting-started.md`
18. `docs/raw/architecture/integration-contracts/feature-structure.md`
19. `docs/raw/architecture/integration-contracts/state-management.md`

---

## 3. Authority Hierarchy Validation

| Level | Authority | Documents | Status |
|-------|-----------|-----------|--------|
| 1 | Invariants | 10 of 10 | Complete |
| 2 | Runtime Maps | 3 of ~3 | Complete |
| 3 | Core Architecture | 3 of ~3 | Complete |
| 4 | Integration Contracts | 3 of ~3 | Complete |
| 5 | Examples | 0 | Not populated |

**Authority violations detected:**

| Violation | Documents | Severity |
|-----------|-----------|----------|
| Integration Contract (`core/theming.md`) imports example uses `'astra'` instead of `'prati'` — lower-authority document introduces inconsistency not present in invariants | `core/theming.md` | P2 |
| Invariant (`atomic-hierarchy.md`) allowed-pattern example contradicts its own Organism rule, violating invariant self-consistency | `invariants/atomic-hierarchy.md` | P1 |
| Invariant (`public-api-stability.md`) contains a structurally incomplete rule definition ("A breaking change is any change that:" with no completion) | `invariants/public-api-stability.md` | P2 |

No lower-authority document redefines or weakens a higher-authority contract. No examples override architecture. Runtime Maps align with Invariants. Core Architecture correctly explains Invariants. Integration Contracts implement Core Architecture.

---

## 4. Invariant Coverage Matrix

| Invariant | Defined | Guidance Exists | Runtime Mapping Exists | Coverage |
|-----------|---------|----------------|----------------------|----------|
| Stateless UI | Yes | Yes — `core/component-tiers.md`, `integration-contracts/state-management.md` | Yes — `component-lifecycle.md`, `component-tiers.md` | Complete |
| Theme Sovereignty | Yes | Yes — `core/theming.md` | Yes — `provider-hierarchy.md` | Complete |
| Localization | Yes | Yes — `core/localization.md` | Yes — `provider-hierarchy.md` | Complete |
| Atomic Hierarchy | Yes | Yes — `core/component-tiers.md` | Yes — `runtime-maps/component-tiers.md` | Complete |
| MVVM Separation | Yes | Yes — `integration-contracts/feature-structure.md`, `integration-contracts/state-management.md` | Yes — `runtime-maps/component-tiers.md` | Complete |
| Repository Isolation | Yes | Yes — `integration-contracts/feature-structure.md` | Yes — `runtime-maps/component-tiers.md` | Complete |
| Platform Neutrality | Yes | Partial — referenced from `stateless-ui.md`; no dedicated core doc | Partial — no dedicated runtime map | Partial |
| Public API Stability | Yes | None | None | Partial |
| Dependency Safety | Yes | None | None | Partial |
| Deterministic Build | Yes | None | None | Partial |

**10 of 10 invariants defined (100%).** Consumer-facing invariants (Stateless UI, Theme Sovereignty, Localization, Atomic Hierarchy, MVVM Separation, Repository Isolation) all have guidance documents. The three library-governance invariants (Public API Stability, Dependency Safety, Deterministic Build) and Platform Neutrality continue to lack dedicated guidance/runtime-map documents, consistent with their build/release/infrastructure concern scope. No regression from prior audit.

---

## 5. Architecture Concept Matrix

| Concept | Canonical Owner | Referenced By | Consistent |
|---------|----------------|---------------|------------|
| Atomic Tier (Atom/Molecule/Organism/Template) | `invariants/atomic-hierarchy.md` | `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md` | Yes |
| Stateless Component | `invariants/stateless-ui.md` | `core/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md`, `integration-contracts/state-management.md` | Yes |
| Theme Sovereignty | `invariants/theme-sovereignty.md` | `core/theming.md`, `runtime-maps/provider-hierarchy.md`, `invariants/stateless-ui.md` | Yes |
| Localization / LanguageProvider | `invariants/localization.md` | `core/localization.md`, `runtime-maps/provider-hierarchy.md`, `integration-contracts/getting-started.md` | Yes |
| MVVM Pattern | `invariants/mvvm-separation.md` | `core/component-tiers.md`, `core/theming.md`, `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md`, `integration-contracts/state-management.md` | Yes |
| Repository Isolation | `invariants/repository-isolation.md` | `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md`, `invariants/stateless-ui.md` | Yes |
| Platform Neutrality | `invariants/platform-neutrality.md` | `invariants/stateless-ui.md`, `invariants/repository-isolation.md` | Yes |
| useDataState | `integration-contracts/state-management.md` | `invariants/stateless-ui.md`, `invariants/mvvm-separation.md`, `invariants/repository-isolation.md`, `core/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md`, `invariants/atomic-hierarchy.md`, `integration-contracts/feature-structure.md` | Yes |
| AppStateHandler | `integration-contracts/state-management.md` | `invariants/stateless-ui.md`, `invariants/mvvm-separation.md`, `runtime-maps/component-lifecycle.md`, `core/component-tiers.md` | Yes |
| ViewModel Hook | `invariants/mvvm-separation.md` + `integration-contracts/state-management.md` | `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `integration-contracts/feature-structure.md` | Yes |
| Page Container | `integration-contracts/feature-structure.md` | `runtime-maps/component-tiers.md` | Yes |
| Provider Hierarchy (ordering) | `runtime-maps/provider-hierarchy.md` | `integration-contracts/getting-started.md`, `core/theming.md`, `core/localization.md` | Yes |
| Public API (exports) | `invariants/public-api-stability.md` | None | Yes (no downstream references) |
| Dependency Safety | `invariants/dependency-safety.md` | None | Yes (no downstream references) |
| Deterministic Build | `invariants/deterministic-build.md` | None | Yes (no downstream references) |
| ThemeProvider localStorage Exception | `invariants/stateless-ui.md` (primary) + `invariants/theme-sovereignty.md` (cross-ref) | `invariants/repository-isolation.md`, `invariants/platform-neutrality.md` | Yes |
| Import Path (`'prati'`) | `invariants/public-api-stability.md` | All code examples | **Inconsistent** — `core/theming.md` uses `'astra'` at line 72 |

**Concepts with canonical owners: 17/17 (100%)**
**Orphan concepts: 0**
**Inconsistent concepts: 1** — import path `'astra'` vs `'prati'` in `core/theming.md`

---

## 6. Terminology Audit

| Concept | Terms Used | Documents | Status |
|---------|------------|-----------|--------|
| Product name | `Prati` | All 19 documents | Consistent |
| Package import | `'prati'` (18 docs), `'astra'` (1 doc: `core/theming.md` line 72) | All code examples | **Drift — 1 stale reference** |
| Hook: async state | `useDataState` | 8 documents | Consistent |
| Component: state router | `AppStateHandler` | 4 documents | Consistent |
| Provider: localization | `LanguageProvider` | 5 documents | Consistent |
| Provider: theming | `ThemeProvider` | 6 documents | Consistent |
| Hook: language | `useLanguage` | 5 documents | Consistent |
| Hook: theme | `useTheme` | 4 documents | Consistent |
| Directory: ViewModel layer | `hooks/` | 5 documents | Consistent |
| Directory: Model layer | `repos/` | 5 documents | Consistent |
| Translation access | `literal['key']` | 5 documents | Consistent |
| Translation key format | `{domain}.{page}.{element}` (flat) | `core/localization.md` | **Drift — JSON example shows nested format** |
| Page Container concept | `Page Container` | `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md` | Consistent |
| Severity scale | P0/P1/P2/P3 | All 10 invariants | Consistent |

**Terminology drift identified: 2**
1. `'astra'` vs `'prati'` import path — `core/theming.md` line 72
2. Flat key format (`app.title`) vs nested JSON format (`{ "app": { "title": ... } }`) — `core/localization.md`

---

## 7. Duplication Audit

| Contract | Canonical Owner | Duplicate Definitions | Status |
|----------|-----------------|----------------------|--------|
| Atom/Molecule/Organism/Template definitions | `invariants/atomic-hierarchy.md` | `core/component-tiers.md` restates with examples | Acceptable — guidance restatement |
| ThemeProvider setup | `core/theming.md` | `runtime-maps/provider-hierarchy.md` references | Acceptable — reference only |
| LanguageProvider setup | `core/localization.md` | `runtime-maps/provider-hierarchy.md` references | Acceptable — reference only |
| MVVM layer definitions | `invariants/mvvm-separation.md` | `integration-contracts/feature-structure.md` restates with directory layout | Acceptable — guidance restatement |
| useDataState contract | `integration-contracts/state-management.md` | `invariants/stateless-ui.md` and `mvvm-separation.md` reference examples | Acceptable — usage examples |
| Provider ordering rule | `runtime-maps/provider-hierarchy.md` | `integration-contracts/getting-started.md` restates with code | Acceptable — guidance restatement |

**No unauthorized duplication detected.** Lower-authority documents correctly reference or restate higher-authority contracts without redefining them.

---

## 8. Cross-Document Consistency Matrix

| Concept | Doc A | Doc B | Result |
|---------|-------|-------|--------|
| Product name | All docs: "Prati" | All docs: "Prati" | Match |
| Package import path | `integration-contracts/getting-started.md`: `from 'prati'` | `core/theming.md` line 72: `from 'astra'` | **Conflict** |
| Provider ordering | `runtime-maps/provider-hierarchy.md`: ThemeProvider > LanguageProvider | `integration-contracts/getting-started.md`: ThemeProvider > LanguageProvider | Match |
| Provider ordering | `core/localization.md`: "Wrap your application with LanguageProvider" (no explicit ordering) | `runtime-maps/provider-hierarchy.md`: ThemeProvider outermost | Match (no conflict, ordering specified elsewhere) |
| Atom props | `invariants/atomic-hierarchy.md`: "simple props (string, number, boolean, callback)" | `core/component-tiers.md`: identical | Match |
| Molecule limits | `invariants/atomic-hierarchy.md`: "may NOT compose Organism or Template" | `core/component-tiers.md`: "may NOT import from organism or template" | Match |
| Template limits | `invariants/atomic-hierarchy.md`: "may NOT contain business logic, manage data lifecycle" | `core/component-tiers.md`: "may NOT contain data dependencies, manage state, include business logic" | Match |
| Organism direct repo access | `invariants/atomic-hierarchy.md` rule: "may NOT access repositories directly" | `invariants/atomic-hierarchy.md` allowed example: imports `UserRepo` directly | **Internal conflict (P1)** |
| useDataState location | `integration-contracts/state-management.md`: "ViewModel hooks only" | `runtime-maps/component-lifecycle.md` diagram: shows as direct component step | Partial conflict (diagram lacks ViewModel indirection) |
| Translation key format | `core/localization.md` Naming Convention: flat dot-notation (`app.list.title`) | `core/localization.md` JSON example: nested object (`{ "app": { "title": ... } }`) | **Internal conflict (P2)** |
| Breaking change rule | `invariants/public-api-stability.md`: "A breaking change is any change that:" (no predicate completion) | — | **Structural defect (P2)** |
| ThemeProvider localStorage exception | `invariants/stateless-ui.md`: primary definition | `invariants/theme-sovereignty.md`: cross-referenced correctly | Match |
| Repository cannot import View | `invariants/repository-isolation.md`: "A Repository may NOT import View components from Prati" | `invariants/mvvm-separation.md`: "Model may NOT import View components or ViewModel hooks" | Match |
| SSR guard requirement | `invariants/platform-neutrality.md`: `typeof localStorage !== 'undefined'` | `invariants/stateless-ui.md`: `if (typeof localStorage !== 'undefined')` | Match |
| ViewModel may NOT manage UI state | `invariants/mvvm-separation.md`: explicit forbidden pattern | `integration-contracts/feature-structure.md`: "ViewModels must NOT manage UI interaction state" | Match |

**Matches: 11 | Conflicts: 4 (1 P1 carry-over, 3 new P2) | Broken refs: 0 | Gaps: 0**

---

## 9. Architecture Traceability Matrix

| Concept | Canonical Source | Status |
|---------|-----------------|--------|
| Atomic Hierarchy | `invariants/atomic-hierarchy.md` | ✅ Owned |
| Localization | `invariants/localization.md` | ✅ Owned |
| Stateless UI | `invariants/stateless-ui.md` | ✅ Owned |
| Theme Sovereignty | `invariants/theme-sovereignty.md` | ✅ Owned |
| MVVM Separation | `invariants/mvvm-separation.md` | ✅ Owned |
| Repository Isolation | `invariants/repository-isolation.md` | ✅ Owned |
| Platform Neutrality | `invariants/platform-neutrality.md` | ✅ Owned |
| Public API Stability | `invariants/public-api-stability.md` | ✅ Owned |
| Dependency Safety | `invariants/dependency-safety.md` | ✅ Owned |
| Deterministic Build | `invariants/deterministic-build.md` | ✅ Owned |
| ViewModel Hook pattern | `invariants/mvvm-separation.md` | ✅ Owned |
| Repository abstraction | `invariants/repository-isolation.md` | ✅ Owned |
| useDataState API | `integration-contracts/state-management.md` | ✅ Owned |
| AppStateHandler API | `integration-contracts/state-management.md` | ✅ Owned |
| Consumer feature directory layout | `integration-contracts/feature-structure.md` | ✅ Owned |
| Page Container | `integration-contracts/feature-structure.md` | ✅ Owned |
| Provider hierarchy ordering | `runtime-maps/provider-hierarchy.md` | ✅ Owned |

**Concepts with canonical sources: 17/17 (100%)**
**Orphan concepts: 0** — no regression from prior audit.

---

## 10. Scoring Breakdown

### Per-Document Scores

| Document | Clarity | Consistency | Boundary Integrity | Traceability | Technical Integrity | Average | P-Level |
|----------|---------|-------------|--------------------|--------------|---------------------|---------|---------|
| `invariants/stateless-ui.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/theme-sovereignty.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/localization.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/atomic-hierarchy.md` | 9 | 7 | 7 | 9 | 7 | **7.8** | P2 — Organism example violates its own boundary rule (P1 carry-over) |
| `invariants/mvvm-separation.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/repository-isolation.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/platform-neutrality.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/public-api-stability.md` | 7 | 8 | 8 | 9 | 7 | **7.8** | P2 — Breaking change rule definition is structurally incomplete |
| `invariants/dependency-safety.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/deterministic-build.md` | 9 | 9 | 9 | 8 | 9 | **8.8** | P3 |
| `core/component-tiers.md` | 8 | 8 | 7 | 8 | 7 | **7.6** | P2 |
| `core/localization.md` | 8 | 6 | 7 | 8 | 7 | **7.2** | P2 — Flat vs nested translation key format conflict |
| `core/theming.md` | 8 | 7 | 8 | 8 | 7 | **7.6** | P2 — Stale `'astra'` import reference |
| `runtime-maps/component-lifecycle.md` | 7 | 8 | 7 | 8 | 7 | **7.4** | P2 — ViewModel indirection not shown in pipeline |
| `runtime-maps/component-tiers.md` | 8 | 8 | 8 | 8 | 8 | **8.0** | P3 |
| `runtime-maps/provider-hierarchy.md` | 8 | 8 | 8 | 8 | 8 | **8.0** | P3 |
| `integration-contracts/getting-started.md` | 9 | 9 | 8 | 8 | 8 | **8.4** | P3 |
| `integration-contracts/feature-structure.md` | 8 | 9 | 8 | 8 | 8 | **8.2** | P3 |
| `integration-contracts/state-management.md` | 8 | 9 | 8 | 9 | 8 | **8.4** | P3 |

### Dimension Scores

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Invariant Integrity | 8.7/10 | 20% | 1.74 |
| Guidance Completeness | 8.0/10 | 20% | 1.60 |
| Cross-Document Consistency | 8.5/10 | 20% | 1.70 |
| Consumer Onboarding Clarity | 8.0/10 | 15% | 1.20 |
| Boundary Integrity | 7.5/10 | 15% | 1.13 |
| Architecture Traceability | 9.0/10 | 10% | 0.90 |
| **Total** | | **100%** | **8.27** |

> Rounded to **8.3/10**

### What Drove Each Score

**Invariant Integrity (8.7/10):** All 10 invariants are present and structurally rigorous. The primary deduction is the unresolved P1 carry-over from the prior audit: `atomic-hierarchy.md` allowed Organism example shows a direct repository import pattern that contradicts its own rule. Additionally, `public-api-stability.md`'s "Breaking Changes" section has a dangling sentence ("A breaking change is any change that:") with no predicate, creating a structural hole in the rule definition. Both issues reduce confidence in the invariant corpus. Down from 9.0 to 8.7 due to carry-over P1 not being resolved.

**Guidance Completeness (8.0/10):** No change from prior audit. Consumer-facing invariants all have guidance documents. Library-governance invariants (Public API Stability, Dependency Safety, Deterministic Build) still lack guidance. Platform Neutrality has no dedicated runtime map. Score held at 8.0.

**Cross-Document Consistency (8.5/10):** The stale `'astra'` import in `core/theming.md` and the flat-vs-nested translation key format inconsistency in `core/localization.md` are new P2 findings. These are concentrated in the core guidance layer and do not affect invariant-level consistency. The `component-lifecycle.md` ViewModel indirection gap (P2 carry-over) also persists. Down from 9.0 to 8.5 due to 3 new/persistent consistency gaps.

**Consumer Onboarding Clarity (8.0/10):** No change. The consumer onboarding path (Getting Started → Feature Structure → State Management) is complete and navigable. The translation key format inconsistency (flat notation vs nested JSON) could confuse first-time consumers setting up translation files, but the localization invariant provides the authoritative guidance. Score held.

**Boundary Integrity (7.5/10):** The P1 carry-over in `atomic-hierarchy.md` remains the primary deduction here — the allowed Organism pattern actively contradicts the boundary rule. The `component-lifecycle.md` render pipeline also still elides the ViewModel indirection layer. Down from 8.0 to 7.5 reflecting that neither boundary finding has been remediated.

**Architecture Traceability (9.0/10):** No change. All 17 concepts have canonical owners. Zero orphan concepts. Score held.

---

## 11. Findings

---

### ARCH-CONSISTENCY-003 — Organism Allowed-Pattern Example Violates Its Own Boundary Rule *(CARRY-OVER, UNRESOLVED)*

**Category:** Invariant Integrity / Cross-Document Consistency
**Documents Affected:** `invariants/atomic-hierarchy.md`
**Severity:** P1 — Major

**Pattern Description:**
The "Organism: State Orchestration" allowed-pattern example in the Atomic Hierarchy invariant shows an Organism importing `UserRepo` from the `../repo/UserRepo` path and calling `useDataState` directly inside the component body. Both actions directly contradict the invariant's own stated rule. The rule states organisms "may NOT access repositories directly (must use ViewModel hooks)". This example teaches consumers an architecture-violating pattern under the label "Allowed".

**Evidence:**
```tsx
// From invariants/atomic-hierarchy.md — "Allowed" Organism example (lines 153–172):
import { useDataState } from '../../../hooks';
import { UserRepo } from '../repo/UserRepo';  // ← Direct repo import in View (FORBIDDEN)

function UserList() {
  const [state, execute] = useDataState<User[]>();  // ← useDataState called raw in View (FORBIDDEN)
  useEffect(() => {
    execute(() => UserRepo.getAll());  // ← Repository called directly by View (FORBIDDEN)
  }, []);
  ...
}
```

Compare with the invariant's own rule (lines 67–69):
> "An Organism may NOT: access repositories directly (must use ViewModel hooks)"

And from `invariants/mvvm-separation.md`:
> "A View may NOT: import from the Model layer (repositories, domain services, API clients)"

**Authority Violated:** Invariant (`invariants/atomic-hierarchy.md`, `invariants/mvvm-separation.md`)

**Recommendation:**
Replace the allowed Organism example with a MVVM-compliant pattern:

```tsx
// organisms/UserList.tsx
import { useUserViewModel } from '../../hooks/useUserViewModel';
import { UserInfoCard } from '../../molecules/UserInfoCard';
import { AppStateHandler } from 'prati';

function UserList() {
  const { state, loadUsers } = useUserViewModel();  // ← ViewModel hook mediates repo access
  useEffect(() => { loadUsers(); }, []);
  return (
    <AppStateHandler
      appState={state}
      SuccessComponent={({ data }) =>
        <div>{data.map(user => <UserInfoCard key={user.id} name={user.name} status={user.status} />)}</div>
      }
    />
  );
}
```

**Impact:** Consumers following the published "Allowed" pattern will create MVVM violations with direct repository access in View components. The example is a primary teaching artifact in the most widely-referenced invariant.

---

### ARCH-BOUNDARY-003 — Render Pipeline Diagram Omits ViewModel Indirection Layer *(CARRY-OVER, UNRESOLVED)*

**Category:** Boundary Integrity
**Documents Affected:** `runtime-maps/component-lifecycle.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The component lifecycle render pipeline shows `useDataState()` being called as a direct component step in the render pipeline, without showing the ViewModel hook layer required by the MVVM invariant. A consumer reading this diagram in isolation could conclude that `useDataState` is called directly in the component, which the MVVM invariant explicitly forbids.

**Evidence:**
```
// From runtime-maps/component-lifecycle.md render pipeline (lines 45–54):
├── State management (if data-fetching)
│     │
│     └── useDataState() → AppState + execute   ← no ViewModel layer shown
│
└── Render
```

Per `invariants/mvvm-separation.md` and `integration-contracts/state-management.md`:
> "`useDataState` may only be called from ViewModel hooks (`hooks/use*.ts`) — never from component files directly"

**Authority Violated:** Runtime Map (should align with MVVM Invariant and State Management Integration Contract)

**Recommendation:**
Update the render pipeline diagram to show the ViewModel indirection:

```
├── State management (if data-fetching)
│     │
│     └── ViewModel Hook (use*ViewModel)
│               │
│               └── useDataState() → DataState<T>
│                         │
│                         └── AppStateHandler
│                               ├── loading → LoadingState
│                               ├── error   → ErrorState
│                               └── data    → SuccessComponent
```

Alternatively, add a note: "`useDataState` is called through a ViewModel hook in `hooks/`, not directly in component scope."

**Impact:** Low individually, but in combination with ARCH-CONSISTENCY-003, consumers receive two reinforcing signals that raw `useDataState` calls in components are acceptable.

---

### ARCH-COVERAGE-003 — Library-Governance Invariants Lack Guidance Documents *(CARRY-OVER, UNRESOLVED)*

**Category:** Guidance Completeness
**Documents Affected:** `invariants/public-api-stability.md`, `invariants/dependency-safety.md`, `invariants/deterministic-build.md`
**Severity:** P2 — Transitional

**Pattern Description:**
Three library-governance invariants have no corresponding guidance documents in `core/` or `integration-contracts/`. The invariants themselves are self-contained, but there is no guidance doc to explain the operational processes (semver workflow, dependency audit procedure, build reproducibility verification) that these invariants mandate.

**Evidence:**
- `invariants/public-api-stability.md`: References a semver deprecation policy, but no core guidance doc explains the release workflow
- `invariants/dependency-safety.md`: References a "Dependency Change Policy" table but no core guidance doc explains the audit procedure
- `invariants/deterministic-build.md`: Contains a "Build Reproducibility Checklist" but no guidance doc exists to enforce or reference the CI pipeline

**Authority Violated:** None (these invariants are self-contained; this is a completeness gap, not a contradiction)

**Recommendation:**
Create a single `core/release-governance.md` document covering all three governance areas:
- Semver and breaking-change policy (from public-api-stability)
- Dependency audit procedure (from dependency-safety)
- Build reproducibility checklist (from deterministic-build)

Alternatively, add a `## Release Process` section to an existing development guide.

**Impact:** Low — these are library-maintainer concerns. Consumers do not need this guidance. Risk is maintainer drift without documented procedures.

---

### ARCH-CONSISTENCY-004 — Stale `'astra'` Import Path in Core Theming Document

**Category:** Cross-Document Consistency / Terminology
**Documents Affected:** `core/theming.md`
**Severity:** P2 — Transitional

**Pattern Description:**
`core/theming.md` contains one occurrence of `import { useTheme } from 'astra'` (line 72), which is the deprecated pre-normalization package name. All other documents and examples use `'prati'` as the package import path. This is a stale reference from before the terminology normalization performed prior to the 2026-06-19-1156 audit.

**Evidence:**
```typescript
// core/theming.md — line 72 (INCORRECT):
import { useTheme } from 'astra';

// All other documents (CORRECT):
import { ThemeProvider, useTheme } from 'prati';
import { useLanguage } from 'prati';
import { useDataState } from 'prati';
```

The surrounding theming document on line 71 uses `from 'astra'` inside the "Using Theme in Components" subsection, while the same document's earlier examples on line 20 correctly use `from 'prati'`.

**Authority Violated:** Core Architecture (the document introduces a terminology inconsistency not present in higher-authority invariants)

**Recommendation:**
Replace line 72:
```typescript
// BEFORE:
import { useTheme } from 'astra';

// AFTER:
import { useTheme } from 'prati';
```

**Impact:** A consumer following the theming guide will attempt to import from `'astra'`, which is either non-existent or a different package. This will produce a build error and erode trust in the documentation accuracy.

---

### ARCH-CONSISTENCY-005 — Translation Key Format Conflict in Core Localization Document

**Category:** Cross-Document Consistency
**Documents Affected:** `core/localization.md`
**Severity:** P2 — Transitional

**Pattern Description:**
`core/localization.md` contains an internal contradiction regarding the translation file format. The "Naming Convention" section specifies a flat dot-notation key format (`app.list.title`, `error.notFound`), but the "Translation JSON Format" example shows a nested object structure (`{ "app": { "title": "...", "welcome": "..." }, "common": { "save": "..." } }`). These are incompatible: the flat key format implies `literal['app.title']`, while nested JSON would require `literal['app']['title']` or a recursive accessor — which the `useLanguage` hook does not provide.

**Evidence:**
```
// core/localization.md — Naming Convention (lines 77-83):
app.list.title        → 'Item List'
app.install.button    → 'Install'
app.settings.save     → 'Save Settings'
error.notFound        → 'Not Found'
```

```json
// core/localization.md — Translation JSON Format (lines 99-111):
{
  "app": {
    "title": "My Application",   // ← nested — NOT accessible as literal['app.title']
    "welcome": "Welcome"
  },
  "common": {
    "save": "Save"               // ← nested — NOT accessible as literal['common.save']
  }
}
```

The `useLanguage` hook documented in the same document returns `{ literal, currentLanguage, ... }` where `literal['app.title']` is the access pattern — implying the flat format is correct. The nested JSON example is misleading.

**Authority Violated:** Core Architecture (internal self-contradiction; no invariant conflict since localization invariant only mandates key-based access, not the file format)

**Recommendation:**
Update the Translation JSON Format example to use flat key notation consistent with the access pattern:

```json
{
  "app.title": "My Application",
  "app.welcome": "Welcome",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.loading": "Loading...",
  "common.error": "Error"
}
```

Also update the `LanguageProvider` setup example at the top of the document — the translations object currently shown as `{ en: { 'app.title': '...', 'app.welcome': '...' } }` is correctly flat. The JSON file example alone needs correction.

**Impact:** A consumer setting up translation files using the JSON format example will find that `literal['app.title']` returns undefined. This is a direct consumer onboarding breakage in the most critical setup step.

---

### ARCH-INVARIANT-001 — Breaking Change Rule Definition Is Structurally Incomplete

**Category:** Invariant Integrity
**Documents Affected:** `invariants/public-api-stability.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The "Breaking Changes" section of the Public API Stability invariant contains a dangling sentence fragment. The heading introduces the concept ("A breaking change is any change that:") but the text that follows does not complete this definition — it instead begins a new "A change may:" / "A change may NOT:" rule block, leaving the definition of "breaking change" without a predicate.

**Evidence:**
```markdown
// From invariants/public-api-stability.md — lines 36-54:
### Breaking Changes

A breaking change is any change that:      ← sentence started, predicate never completed

A change may:
- add new components, hooks, or providers
- add optional props to existing components
...

A change may NOT:
- remove or rename exported components...
```

The sentence "A breaking change is any change that:" is grammatically incomplete. The correct structure would either complete the sentence ("A breaking change is any change that requires consumer code modification") or replace the dangling intro with a direct definition.

**Authority Violated:** Invariant (`invariants/public-api-stability.md` — internal structural defect)

**Recommendation:**
Complete the rule definition:

```markdown
### Breaking Changes

A breaking change is any change that requires existing consumer code modification — including TypeScript compilation errors, runtime behavior changes, or import path invalidation.

A change may:
- add new components, hooks, or providers
...
```

**Impact:** Low — the rule intent is recoverable from context. However, the structural defect reduces trust in the invariant as an authoritative document and may cause ambiguity in governance review.

---

## 12. Score Improvement Summary

**Previous Report:** `architecture-audit-2026-06-19-1156.md`
**Previous Score:** 8.5/10
**Current Score:** 8.3/10
**Change:** −0.2

| Dimension | Previous | Current | Change |
|-----------|----------|---------|--------|
| Invariant Integrity | 9.0 | 8.7 | −0.3 |
| Guidance Completeness | 8.0 | 8.0 | 0.0 |
| Cross-Document Consistency | 9.0 | 8.5 | −0.5 |
| Consumer Onboarding Clarity | 8.0 | 8.0 | 0.0 |
| Boundary Integrity | 8.0 | 7.5 | −0.5 |
| Architecture Traceability | 9.0 | 9.0 | 0.0 |

**Why the score declined slightly:**

The score decrease of −0.2 reflects three factors:

1. **Three carry-over findings remain unresolved** (ARCH-CONSISTENCY-003, ARCH-BOUNDARY-003, ARCH-COVERAGE-003). These were previously assessed at face value but the non-resolution now applies a persistence penalty to Invariant Integrity and Boundary Integrity dimensions.

2. **Three new findings identified this cycle** (ARCH-CONSISTENCY-004, ARCH-CONSISTENCY-005, ARCH-INVARIANT-001). None are P0/P1, but they introduce new terminology drift and structural defects that were not present or detected in the prior audit.

3. **No improvements were made** between the two audit cycles — the corpus is unchanged since the 2026-06-19-1156 report.

**Regressions by category:**
- **Invariant Integrity (−0.3):** The `public-api-stability.md` structural defect is new this cycle. The `atomic-hierarchy.md` example conflict (carry-over P1) continues to suppress this dimension.
- **Cross-Document Consistency (−0.5):** Two new consistency findings detected: stale `'astra'` import in `core/theming.md` and flat-vs-nested translation key format in `core/localization.md`.
- **Boundary Integrity (−0.5):** The `atomic-hierarchy.md` P1 and `component-lifecycle.md` P2 remain unresolved, increasing their weight on the dimension score.

---

## 13. Final Verdict

```
Good (8.3/10)
```

The architecture documentation corpus remains in "Good" health. All 10 invariants are present and internally rigorous on the primary rule content. The traceability network is complete with zero orphan concepts. The consumer onboarding path covers all required steps from provider setup through state management.

The score decline of −0.2 from 8.5 to 8.3 is driven entirely by carry-over findings not being remediated and three new P2 issues surfaced in this cycle. No P0 findings exist. The single P1 finding (ARCH-CONSISTENCY-003) is the most actionable: fixing the Organism example in `atomic-hierarchy.md` would immediately resolve both an Invariant Integrity and Boundary Integrity deduction, restoring the score toward 8.7+.

**Priority remediation order:**
1. **(P1) ARCH-CONSISTENCY-003** — Fix the Organism allowed-pattern example in `atomic-hierarchy.md` to use a ViewModel hook
2. **(P2) ARCH-CONSISTENCY-004** — Fix the stale `'astra'` import in `core/theming.md`
3. **(P2) ARCH-CONSISTENCY-005** — Fix the nested JSON format in `core/localization.md`
4. **(P2) ARCH-INVARIANT-001** — Complete the breaking change definition in `public-api-stability.md`
5. **(P2) ARCH-BOUNDARY-003** — Update the render pipeline diagram in `component-lifecycle.md`
6. **(P2) ARCH-COVERAGE-003** — Create guidance documents for library-governance invariants

Items 2–4 are single-line or single-paragraph fixes that can be resolved in minutes.

---

## 14. Audit Traceability

| Reference | Location |
|-----------|----------|
| Architecture Docs | `docs/raw/architecture/**` |
| Invariants | `docs/raw/architecture/invariants/**` |
| Runtime Maps | `docs/raw/architecture/runtime-maps/**` |
| Core Architecture | `docs/raw/architecture/core/**` |
| Integration Contracts | `docs/raw/architecture/integration-contracts/**` |
| Audit Report | `docs/raw/report/architecture/latest/architecture-audit-2026-06-19-1734.md` |
| Previous Report | `docs/raw/report/architecture/archive/architecture-audit-2026-06-19-1156.md` |
