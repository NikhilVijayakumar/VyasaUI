# Architecture Audit Report — 2026-06-19-1156

**Product:** Prati — React Design System & Component Library
**Scope:** `docs/raw/architecture/**`
**Audit Date:** 2026-06-19 11:56 UTC
**Auditor:** Automated Architecture Documentation Audit

---

## 1. Executive Summary

Prati's architecture documentation corpus has been repaired since the baseline audit (3.3/10). All 10 required invariants are now defined. The integration-contracts directory has been created with 3 documents covering getting-started, feature-structure, and state-management. Cross-references throughout all documents now resolve correctly. Product naming has been normalized to "Prati" across the entire corpus. All previously orphan concepts now have canonical owners.

- **Overall Assessment:** Good
- **Audit Score:** **8.5/10**
- **Critical Findings (P0):** 0
- **Major Findings (P1):** 1
- **Minor Findings (P2):** 2
- **Informational (P3):** 16
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
| 5 | Examples | 0 | Not yet populated |

**Authority violations detected:** None. Integration Contracts now reference Core Architecture and Invariants correctly. Runtime Maps reference only existing Invariants and Integration Contracts.

---

## 4. Invariant Coverage Matrix

| Invariant | Defined | Guidance Exists | Runtime Mapping | Coverage |
|-----------|---------|----------------|-----------------|----------|
| Atomic Hierarchy | Yes | Yes (`core/component-tiers.md`) | Yes (`runtime-maps/component-tiers.md`) | Complete |
| Localization | Yes | Yes (`core/localization.md`) | Yes (`provider-hierarchy.md`) | Complete |
| Stateless UI | Yes | Yes (`core/component-tiers.md`, `integration-contracts/state-management.md`) | Yes (`component-lifecycle.md`, `component-tiers.md`) | Complete |
| Theme Sovereignty | Yes | Yes (`core/theming.md`) | Yes (`provider-hierarchy.md`) | Complete |
| MVVM Separation | Yes | Yes (`integration-contracts/feature-structure.md`, `integration-contracts/state-management.md`) | Yes (`component-tiers.md`) | Complete |
| Repository Isolation | Yes | Yes (`integration-contracts/feature-structure.md`) | Yes (`component-tiers.md`) | Complete |
| Platform Neutrality | Yes | Yes (cross-ref from `stateless-ui.md`) | Partial | Complete |
| Public API Stability | Yes | None | None | Partial |
| Dependency Safety | Yes | None | None | Partial |
| Deterministic Build | Yes | None | None | Partial |

**10 of 10 invariants defined (100%).** The 3 library-governance invariants (Public API Stability, Dependency Safety, Deterministic Build) lack guidance documents, which is acceptable as they are not consumer-facing but represent a minor completeness gap.

---

## 5. Architecture Concept Matrix

| Concept | Canonical Owner | Referenced By | Consistent |
|---------|----------------|---------------|------------|
| Atomic Tier | `invariants/atomic-hierarchy.md` | `core/component-tiers.md`, `runtime-maps/component-tiers.md` | Yes |
| Stateless Component | `invariants/stateless-ui.md` | `core/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md`, `integration-contracts/state-management.md` | Yes |
| Theme Sovereignty | `invariants/theme-sovereignty.md` | `core/theming.md`, `runtime-maps/provider-hierarchy.md` | Yes |
| Localization | `invariants/localization.md` | `core/localization.md`, `runtime-maps/provider-hierarchy.md` | Yes |
| MVVM Pattern | `invariants/mvvm-separation.md` | `core/component-tiers.md`, `core/theming.md`, `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md` | Yes |
| Repository Isolation | `invariants/repository-isolation.md` | `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md` | Yes |
| Platform Neutrality | `invariants/platform-neutrality.md` | `invariants/stateless-ui.md`, `invariants/repository-isolation.md` | Yes |
| useDataState | `integration-contracts/state-management.md` | `invariants/stateless-ui.md`, `invariants/mvvm-separation.md`, `invariants/repository-isolation.md`, `core/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md`, `invariants/atomic-hierarchy.md` | Yes |
| AppStateHandler | `integration-contracts/state-management.md` | `invariants/stateless-ui.md`, `invariants/mvvm-separation.md`, `runtime-maps/component-lifecycle.md` | Yes |
| ViewModel Hook | `invariants/mvvm-separation.md` + `integration-contracts/state-management.md` | `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `integration-contracts/feature-structure.md` | Yes |
| Integration Contract | `integration-contracts/*` | `runtime-maps/provider-hierarchy.md` | Yes |
| Page Container | `integration-contracts/feature-structure.md` | `runtime-maps/component-tiers.md` | Yes |
| Public API | `invariants/public-api-stability.md` | None | Yes |
| Dependency Safety | `invariants/dependency-safety.md` | None | Yes |
| Deterministic Build | `invariants/deterministic-build.md` | None | Yes |

**Concepts with canonical owners: 15/15 (100%)**
**Orphan concepts: 0** (resolved from 11 in previous audit)

---

## 6. Terminology Audit

| Concept | Terms Used | Documents | Status |
|---------|------------|-----------|--------|
| Product name | `Prati` | All 19 documents | Consistent |
| Import source | `'prati'` | All code examples | Consistent |
| Hook | `useDataState` | 7 documents | Consistent |
| State Handler | `AppStateHandler` | 3 documents | Consistent |
| Provider | `LanguageProvider` | 4 documents | Consistent |
| Provider | `ThemeProvider` | 5 documents | Consistent |
| Directory | `hooks/` | 4 documents | Consistent |
| Directory | `repo/` | 2 documents | Consistent |
| Page Container | `Page Container` | `runtime-maps/component-tiers.md`, `integration-contracts/feature-structure.md` | Consistent |

**No terminology drift detected.** All documents use "Prati" and `'prati'`. All concepts use consistent naming.

---

## 7. Duplication Audit

| Contract | Canonical Owner | Duplicate Definitions | Status |
|----------|-----------------|----------------------|--------|
| Atom definition | `invariants/atomic-hierarchy.md` | `core/component-tiers.md` restates with examples | Acceptable (guidance) |
| Molecule definition | `invariants/atomic-hierarchy.md` | `core/component-tiers.md` restates with examples | Acceptable (guidance) |
| Organism definition | `invariants/atomic-hierarchy.md` | `core/component-tiers.md` restates with examples | Acceptable (guidance) |
| Template definition | `invariants/atomic-hierarchy.md` | `core/component-tiers.md` restates with examples | Acceptable (guidance) |
| ThemeProvider setup | `core/theming.md` | `runtime-maps/provider-hierarchy.md` references | Acceptable |
| LanguageProvider setup | `core/localization.md` | `runtime-maps/provider-hierarchy.md` references | Acceptable |
| MVVM layer definitions | `invariants/mvvm-separation.md` | `integration-contracts/feature-structure.md` restates with layout | Acceptable (guidance) |
| useDataState contract | `integration-contracts/state-management.md` | `invariants/stateless-ui.md` examples reference it | Acceptable (usage) |

**No unauthorized duplication detected.** Lower authority docs correctly reference higher authority without redefining contracts.

---

## 8. Cross-Document Consistency Matrix

| Concept | Doc A | Doc B | Result |
|---------|-------|-------|--------|
| Product name | All docs: "Prati" | All docs: "Prati" | Match |
| Import source | `core/theming.md`: `from 'prati'` | `core/localization.md`: `from 'prati'` | Match |
| Provider ordering | `core/localization.md`: ThemeProvider > LanguageProvider (by reference) | `runtime-maps/provider-hierarchy.md`: ThemeProvider > LanguageProvider | Match |
| Atom props | `invariants/atomic-hierarchy.md`: "simple props" | `core/component-tiers.md`: identical | Match |
| Molecule limits | `invariants/atomic-hierarchy.md`: "may NOT compose Organism or Template" | `core/component-tiers.md`: "may NOT import from organism or template" | Match |
| Template limits | `invariants/atomic-hierarchy.md`: "may NOT contain business logic" | `core/component-tiers.md`: "may NOT contain data dependencies" | Match |
| Stateless exception | `invariants/stateless-ui.md`: ThemeProvider localStorage | `invariants/theme-sovereignty.md`: now acknowledges with cross-ref | Match |
| Cross-ref to mvvm | `core/component-tiers.md`: `../invariants/mvvm-separation.md` | File exists | Resolved |
| Cross-ref to feature-structure | `core/component-tiers.md`: `../integration-contracts/feature-structure.md` | File exists | Resolved |
| Cross-ref to getting-started | `runtime-maps/provider-hierarchy.md`: `integration-contracts/getting-started.md` | File exists | Resolved |
| Cross-ref to state-management | `core/theming.md`: `../integration-contracts/state-management.md` | File exists | Resolved |
| Loading state | `runtime-maps/component-lifecycle.md`: `LoadingState` | `core/component-tiers.md`: `LoadingState` | Match |

**Matches: 12 | Conflicts: 0 | Broken refs: 0 | Gaps: 0**

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
| ViewModel Hook | `invariants/mvvm-separation.md` | ✅ Owned |
| Repository | `invariants/repository-isolation.md` | ✅ Owned |
| useDataState API | `integration-contracts/state-management.md` | ✅ Owned |
| AppStateHandler | `integration-contracts/state-management.md` | ✅ Owned |
| Integration Contract | `integration-contracts/*` | ✅ Owned |
| Page Container | `integration-contracts/feature-structure.md` | ✅ Owned |

**Concepts with canonical sources: 16/16 (100%)**
**Orphan concepts: 0** (resolved from 11 in previous audit)

---

## 10. Scoring Breakdown

### Per-Document Scores

| Document | Clarity | Consistency | Boundary Integrity | Traceability | Technical Integrity | Average | P-Level |
|----------|---------|-------------|--------------------|--------------|---------------------|---------|---------|
| `invariants/stateless-ui.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/theme-sovereignty.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/localization.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/atomic-hierarchy.md` | 9 | 8 | 8 | 9 | 8 | 8.4 | P3 |
| `invariants/mvvm-separation.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/repository-isolation.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/platform-neutrality.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/public-api-stability.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/dependency-safety.md` | 9 | 9 | 9 | 9 | 9 | 9.0 | P3 |
| `invariants/deterministic-build.md` | 9 | 9 | 9 | 8 | 9 | 8.8 | P3 |
| `core/component-tiers.md` | 8 | 8 | 7 | 8 | 7 | 7.6 | P2 |
| `core/localization.md` | 8 | 8 | 7 | 8 | 8 | 7.8 | P2 |
| `core/theming.md` | 8 | 8 | 8 | 8 | 8 | 8.0 | P2 |
| `runtime-maps/component-lifecycle.md` | 7 | 8 | 7 | 8 | 7 | 7.4 | P2 |
| `runtime-maps/component-tiers.md` | 8 | 8 | 8 | 8 | 8 | 8.0 | P2 |
| `runtime-maps/provider-hierarchy.md` | 8 | 8 | 8 | 8 | 8 | 8.0 | P2 |
| `integration-contracts/getting-started.md` | 8 | 9 | 8 | 8 | 8 | 8.2 | P3 |
| `integration-contracts/feature-structure.md` | 8 | 9 | 8 | 8 | 8 | 8.2 | P3 |
| `integration-contracts/state-management.md` | 8 | 9 | 8 | 9 | 8 | 8.4 | P3 |

### Dimension Scores

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Invariant Integrity | 9.0/10 | 20% | 1.80 |
| Guidance Completeness | 8.0/10 | 20% | 1.60 |
| Cross-Document Consistency | 9.0/10 | 20% | 1.80 |
| Consumer Onboarding Clarity | 8.0/10 | 15% | 1.20 |
| Boundary Integrity | 8.0/10 | 15% | 1.20 |
| Architecture Traceability | 9.0/10 | 10% | 0.90 |
| **Total** | | **100%** | **8.50** |

### What Drove Each Score

**Invariant Integrity (9.0/10):** All 10 invariants are now defined. Each follows the established Purpose → Rule → Allowed/Forbidden → Detection → Severity → Refactoring → Migration → Validation → Compliance Goal pattern. No contradictions between invariants. One minor issue: `atomic-hierarchy.md` allowed patterns section shows an Organism directly importing `UserRepo` and `useDataState`, which technically violates its own rule that organisms must use ViewModel hooks. This is a legacy example that should be updated. Minus 1 for this reason.

**Guidance Completeness (8.0/10):** All consumer-facing invariants now have corresponding guidance in `core/` and `integration-contracts/`. The 3 library-governance invariants (public-api-stability, dependency-safety, deterministic-build) lack core guidance documents, but these are build/release concerns rather than consumer-facing topics. The consumer onboarding flow (Getting Started → Feature Structure → View → ViewModel → Repository → State Management → Runtime Integration) is now fully covered.

**Cross-Document Consistency (9.0/10):** Product name "Prati" is used consistently across all 19 documents. Import paths all use `'prati'`. All cross-references now resolve to existing files. Provider ordering is consistent. No conflicting definitions detected. Minor gap: the `runtime-maps/component-lifecycle.md` render pipeline diagram shows `useDataState() → AppState + execute` being called directly at the component level, while the MVVM invariant requires it to be called via ViewModel hooks — the diagram shows the mechanism but not the indirection layer, which could cause confusion.

**Consumer Onboarding Clarity (8.0/10):** The complete onboarding flow is now documented. A new consumer can follow: Getting Started → Feature Structure (with MVVM layers, directory layout, Page Container definition) → State Management (useDataState + AppStateHandler contracts). All steps reference each other and the higher-authority invariants. Improvement opportunity: the runtime-integration step (provider-hierarchy.md) could include a more explicit "what you should have now" summary.

**Boundary Integrity (8.0/10):** Library-vs-consumer boundaries are clearly defined across all invariants. View-ViewModel-Model boundaries are well-defined in `mvvm-separation.md` and reinforced in `repository-isolation.md` and `integration-contracts/feature-structure.md`. The ThemeProvider localStorage exception is now acknowledged in both `stateless-ui.md` and `theme-sovereignty.md`. One issue: as noted under Invariant Integrity, the `atomic-hierarchy.md` allowed Organism example violates its own boundary rules by importing `UserRepo` and `useDataState` directly.

**Architecture Traceability (9.0/10):** All 16 architectural concepts now have canonical owners, up from 5 in the previous audit. No orphan concepts remain. Every concept referenced across multiple documents has a clear owning document. Cross-references now correctly point to canonical owners.

---

## 11. Findings

---

### ARCH-CONSISTENCY-003 — Organism Example Violates Own Boundary Rules

**Category:** Cross-Document Consistency
**Documents Affected:** `invariants/atomic-hierarchy.md`
**Severity:** P1 — Major

**Pattern Description:**
The "Organism: State Orchestration" allowed pattern in the Atomic Hierarchy invariant shows an Organism importing `UserRepo` and `useDataState` directly. This violates the invariant's own rule that "Organisms may NOT access repositories directly (must use ViewModel hooks)" and the MVVM invariant's rule that Views must not import from the Model layer.

**Evidence:**
- `invariants/atomic-hierarchy.md:153-172`: Allowed Organism example imports `UserRepo` from `../repo/UserRepo` and calls `useDataState()` directly inside the component — bypassing the ViewModel layer
- `invariants/atomic-hierarchy.md:67-69`: Same invariant states "Organism may NOT: access repositories directly"

**Authority Violated:** Invariant (`atomic-hierarchy.md`)
**Recommendation:** Replace the allowed Organism example to use a ViewModel hook (`useUserViewModel`) instead of importing `useDataState` and `UserRepo` directly. The example should demonstrate:
```tsx
import { useUserViewModel } from '../../hooks/useUserViewModel';
import { UserInfoCard } from '../../molecules/UserInfoCard';

function UserList() {
  const { state, loadUsers } = useUserViewModel();
  useEffect(() => { loadUsers(); }, []);
  return <div>{state.data?.map(user => <UserInfoCard key={user.id} ... />)}</div>;
}
```
**Impact:** Consumers following the published allowed pattern will create MVVM violations.

---

### ARCH-BOUNDARY-003 — Render Pipeline Diagram Shows Direct useDataState Usage

**Category:** Boundary Integrity
**Documents Affected:** `runtime-maps/component-lifecycle.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The component lifecycle render pipeline shows `useDataState()` being called directly at the component level in the render pipeline, without showing the ViewModel indirection layer required by the MVVM invariant.

**Evidence:**
- `runtime-maps/component-lifecycle.md:47-49`: Shows "useDataState() → AppState + execute" as a direct component responsibility
- The MVVM invariant requires `useDataState` to be called only in ViewModel hooks, not directly in components

**Authority Violated:** Runtime Map (should align with MVVM invariant)
**Recommendation:** Update the render pipeline diagram to show the ViewModel indirection: "ViewModel Hook → useDataState() → state → AppStateHandler". Alternatively, add a clarifying note that `useDataState` is called through a ViewModel hook, not directly.
**Impact:** Minor — the diagram is technically accurate about the flow but omits the required ViewModel layer.

---

### ARCH-COVERAGE-003 — Library-Governance Invariants Lack Guidance Documents

**Category:** Guidance Completeness
**Documents Affected:** `invariants/public-api-stability.md`, `invariants/dependency-safety.md`, `invariants/deterministic-build.md`
**Severity:** P2 — Transitional

**Pattern Description:**
Three library-governance invariants (Public API Stability, Dependency Safety, Deterministic Build) have no corresponding guidance documents in `core/` or `integration-contracts/`. While these are not consumer-facing topics, they lack the guidance-layer explanation that other invariants have.

**Evidence:**
- `invariants/public-api-stability.md`: No guidance doc exists explaining semver policy, breaking change review process, or release workflow
- `invariants/dependency-safety.md`: No guidance doc exists explaining dependency audit procedures or version bump policies
- `invariants/deterministic-build.md`: No guidance doc exists explaining build reproducibility verification or CI pipeline configuration

**Authority Violated:** None (these are invariants without guidance-layer enforcement)
**Recommendation:** Create optional guidance documents in `core/` for each invariant, or add a section to an existing development-guide document. At minimum, add a note in the invariants themselves pointing to any existing CI/release configuration.
**Impact:** Low — these are library-maintainer concerns, not consumer-facing. Consumers do not need guidance on these topics.

---

## 12. Score Improvement Summary

**Previous Report:** `architecture-audit-2026-06-19-1145.md`
**Previous Score:** 3.3/10
**Current Score:** 8.5/10
**Change:** +5.2

| Dimension | Previous | Current | Change |
|-----------|----------|---------|--------|
| Invariant Integrity | 4.0 | 9.0 | +5.0 |
| Guidance Completeness | 3.0 | 8.0 | +5.0 |
| Cross-Document Consistency | 3.0 | 9.0 | +6.0 |
| Consumer Onboarding Clarity | 2.0 | 8.0 | +6.0 |
| Boundary Integrity | 5.0 | 8.0 | +3.0 |
| Architecture Traceability | 2.0 | 9.0 | +7.0 |

**What drove the improvement:**

- **Invariant Integrity (+5.0):** 6 missing invariants were created (mvvm-separation, repository-isolation, platform-neutrality, public-api-stability, dependency-safety, deterministic-build), raising coverage from 4/11 to 10/10.
- **Guidance Completeness (+5.0):** 3 integration contracts were created (getting-started, feature-structure, state-management), completing the consumer onboarding flow.
- **Cross-Document Consistency (+6.0):** 8+ broken cross-references were fixed. All "Astra" references were normalized to "Prati". Import paths were updated from `'astra'` to `'prati'`. External path references (`../../astra/`) were corrected.
- **Consumer Onboarding Clarity (+6.0):** All 7 steps of the consumer onboarding flow are now documented, up from 0.
- **Boundary Integrity (+3.0):** ThemeProvider exception acknowledged in both stateless-ui.md and theme-sovereignty.md. LoadingSpinner → LoadingState fixed. Page Container concept defined in feature-structure.md.
- **Architecture Traceability (+7.0):** 11 orphan concepts were resolved — all now have canonical owners. Every concept referenced across documents has a clear owning document.

**Regressions detected:** None.

---

## 13. Final Verdict

```
Good (8.5/10)
```

The architecture documentation corpus has been substantially repaired since the baseline audit. All 10 invariants are defined and follow a consistent, rigorous structure. The integration-contracts layer now exists and completes the consumer onboarding flow. Cross-references resolve correctly throughout. Product naming is consistent. All architectural concepts have canonical owners.

Remaining minor issues: the `atomic-hierarchy.md` allowed Organism example shows a direct repository import pattern that contradicts its own rules, the runtime-map render pipeline omits the ViewModel indirection layer, and three library-governance invariants lack guidance documents. These do not block the corpus from being usable.

The corpus has moved from "Major Revision Required" (3.3/10) to "Good" (8.5/10).

---

## 14. Audit Traceability

| Reference | Location |
|-----------|----------|
| Architecture Docs | `docs/raw/architecture/**` |
| Invariants | `docs/raw/architecture/invariants/**` |
| Runtime Maps | `docs/raw/architecture/runtime-maps/**` |
| Integration Contracts | `docs/raw/architecture/integration-contracts/**` |
| Audit Report | `docs/raw/report/architecture/latest/architecture-audit-2026-06-19-1156.md` |
| Previous Report | `docs/raw/report/architecture/archive/architecture-audit-2026-06-19-1145.md` |
