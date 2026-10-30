# Architecture Audit Report — 2026-06-19-1145

**Product:** Prati — React Design System & Component Library
**Scope:** `docs/raw/architecture/**`
**Audit Date:** 2026-06-19 11:45 UTC
**Auditor:** Automated Architecture Documentation Audit

---

## 1. Executive Summary

Prati's architecture documentation corpus is structurally incomplete. Of the 11 invariants required for a complete architecture definition, only 4 exist. The integration-contracts layer is entirely absent. Cross-references throughout all existing documents point to nonexistent files, creating a fragmented traceability chain. Product naming is inconsistent across documents (Astra vs Prati), and consumer onboarding cannot be completed using architecture documentation alone.

- **Overall Assessment:** Major Revision Required
- **Audit Score:** **3.3/10**
- **Critical Findings (P0):** 4
- **Major Findings (P1):** 8
- **Minor Findings (P2):** 5
- **Documents Audited:** 10

---

## 2. Documents Audited

### Invariants (4 of 11 required)

1. `docs/raw/architecture/invariants/atomic-hierarchy.md`
2. `docs/raw/architecture/invariants/localization.md`
3. `docs/raw/architecture/invariants/stateless-ui.md`
4. `docs/raw/architecture/invariants/theme-sovereignty.md`

**Missing invariants (7):**
5. `docs/raw/architecture/invariants/mvvm-separation.md`
6. `docs/raw/architecture/invariants/repository-isolation.md`
7. `docs/raw/architecture/invariants/dependency-safety.md`
8. `docs/raw/architecture/invariants/public-api-stability.md`
9. `docs/raw/architecture/invariants/deterministic-build.md`
10. `docs/raw/architecture/invariants/platform-neutrality.md`

### Core Architecture (3 of unknown required)

11. `docs/raw/architecture/core/component-tiers.md`
12. `docs/raw/architecture/core/localization.md`
13. `docs/raw/architecture/core/theming.md`

### Runtime Maps (3)

14. `docs/raw/architecture/runtime-maps/component-lifecycle.md`
15. `docs/raw/architecture/runtime-maps/component-tiers.md`
16. `docs/raw/architecture/runtime-maps/provider-hierarchy.md`

### Integration Contracts (0)

17. **Entire directory `docs/raw/architecture/integration-contracts/` missing**

### Total: 10 documents present, 1 directory missing

---

## 3. Authority Hierarchy Validation

| Level | Authority | Documents | Status |
|-------|-----------|-----------|--------|
| 1 | Invariants | 4 of 11 | Incomplete |
| 2 | Runtime Maps | 3 of ~3 | Complete (but reference missing invariants) |
| 3 | Core Architecture | 3 of ~3 | Complete (but reference missing docs) |
| 4 | Integration Contracts | 0 | Missing entirely |
| 5 | Examples | 0 | No examples directory |

**Authority violations detected:**
- Runtime Maps reference invariants that don't exist (`mvvm-separation.md` in `runtime-maps/component-tiers.md:99`)
- Core Architecture references invariants that don't exist
- Integration Contracts layer is entirely absent
- Examples would be needed to illustrate contracts, but contracts don't exist

---

## 4. Invariant Coverage Matrix

| Invariant | Defined | Guidance Exists | Runtime Mapping | Coverage |
|-----------|---------|-----------------|-----------------|----------|
| Atomic Hierarchy | Yes | Yes (`core/component-tiers.md`) | Yes (`runtime-maps/component-tiers.md`) | Complete |
| Localization | Yes | Yes (`core/localization.md`) | Partial (provider-hierarchy.md mentions ordering) | Complete |
| Stateless UI | Yes | Partial (cross-refs to missing docs) | Partial (component-lifecycle.md mentions useDataState) | Partial |
| Theme Sovereignty | Yes | Yes (`core/theming.md`) | Yes (provider-hierarchy.md) | Complete |
| MVVM Separation | No | No | No | Missing |
| Repository Isolation | No | No | No | Missing |
| Dependency Safety | No | No | No | Missing |
| Public API Stability | No | No | No | Missing |
| Deterministic Build | No | No | No | Missing |
| Platform Neutrality | No | No | No | Missing |

**4 of 11 invariants defined (36%).**
**7 of 11 invariants missing (64%).**

---

## 5. Architecture Concept Matrix

| Concept | Canonical Owner | Referenced By | Consistent |
|---------|----------------|---------------|------------|
| Atomic Tier | `invariants/atomic-hierarchy.md` | `core/component-tiers.md`, `runtime-maps/component-tiers.md` | Yes |
| Stateless Component | `invariants/stateless-ui.md` | `core/component-tiers.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md` | Yes |
| Theme Sovereignty | `invariants/theme-sovereignty.md` | `core/theming.md`, `runtime-maps/provider-hierarchy.md` | Yes |
| Localization | `invariants/localization.md` | `core/localization.md`, `runtime-maps/provider-hierarchy.md` | Yes |
| ViewModel Hook | **No canonical owner** | `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md` | Orphan concept |
| Repository | **No canonical owner** | `core/component-tiers.md`, `runtime-maps/component-tiers.md` | Orphan concept |
| MVVM Pattern | **No canonical owner** | `core/component-tiers.md`, `core/theming.md`, `runtime-maps/component-tiers.md` | Orphan concept |
| State Management | **No canonical owner** | `core/theming.md` | Orphan concept |
| Integration Contract | **No canonical owner** | `runtime-maps/provider-hierarchy.md` | Orphan concept |
| Page Container | **No canonical owner** | `runtime-maps/component-tiers.md` | Orphan concept |

**Concepts with canonical owners: 4**
**Orphan concepts (referenced but no defining document): 6**

---

## 6. Terminology Audit

| Concept | Terms Used | Documents | Status |
|---------|------------|-----------|--------|
| Product name | `Astra` | `invariants/atomic-hierarchy.md`, `invariants/stateless-ui.md`, `invariants/theme-sovereignty.md`, `core/component-tiers.md`, `core/theming.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md` | 🚩 Conflict |
| Product name | `Prati` | `invariants/localization.md`, `core/localization.md` | 🚩 Conflict |
| Import source | `'astra'` | `core/theming.md` (lines 20, 65, 71, 94, 119) | 🚩 Drift |
| Import source | `'prati'` | `core/localization.md` (lines 20, 56) | 🚩 Drift |
| Hook | `useDataState` | `invariants/stateless-ui.md`, `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md` | Consistent |
| State Handler | `AppStateHandler` | `invariants/stateless-ui.md` (line 484) | Consistent |
| Provider | `LanguageProvider` | `invariants/localization.md`, `core/localization.md`, `runtime-maps/provider-hierarchy.md` | Consistent |
| Provider | `ThemeProvider` | `invariants/stateless-ui.md`, `invariants/theme-sovereignty.md`, `core/theming.md`, `runtime-maps/provider-hierarchy.md` | Consistent |
| Directory | `hooks/` | `runtime-maps/component-tiers.md` (line 68) | Consistent |
| Directory | `repo/` | `runtime-maps/component-tiers.md` (line 90) | Consistent |
| Component | `PageHeader` | `core/component-tiers.md` (line 14) | Consistent |

**Terminology drift detected:** Product name and import source are inconsistent. 3 invariants + 2 core docs + 2 runtime maps use "Astra"; 2 docs use "Prati".

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

**No unauthorized duplication detected.** Existing documents correctly use lower authority docs to explain, not redefine, invariants.

---

## 8. Cross-Document Consistency Matrix

| Concept | Doc A | Doc B | Result |
|---------|-------|-------|--------|
| Product name | `invariants/atomic-hierarchy.md`: "Astra" | `invariants/localization.md`: "Prati" | 🚩 Conflict |
| Product name | `core/component-tiers.md`: "Astra" | `core/localization.md`: "Prati" | 🚩 Conflict |
| Import source | `core/theming.md`: `from 'astra'` | `core/localization.md`: `from 'prati'` | 🚩 Conflict |
| Provider ordering | `core/localization.md`: "at app root" (no ordering) | `runtime-maps/provider-hierarchy.md`: ThemeProvider > LanguageProvider | ⚠️ Ambiguous |
| Atom props | `invariants/atomic-hierarchy.md`: "simple props (string, number, boolean, callback)" | `core/component-tiers.md`: identical | Match |
| Molecule limits | `invariants/atomic-hierarchy.md`: "may NOT compose Organism or Template" | `core/component-tiers.md`: "may NOT import from organism or template" | Match |
| Template limits | `invariants/atomic-hierarchy.md`: "may NOT contain business logic" | `core/component-tiers.md`: "may NOT contain data dependencies" | Match (compatible) |
| Stateless exception | `invariants/stateless-ui.md`: ThemeProvider localStorage | `invariants/theme-sovereignty.md`: no mention | ⚠️ Gap |
| Cross-ref to mvvm | `core/component-tiers.md`: references `mvvm-pattern.md` | Actual: file doesn't exist | 🚩 Broken |
| Cross-ref to platform | `invariants/stateless-ui.md`: references `platform-neutrality.md` | Actual: file doesn't exist | 🚩 Broken |

**Matches: 4 | Conflicts: 4 | Broken refs: 6+ | Gaps: 2**

---

## 9. Architecture Traceability Matrix

| Concept | Canonical Source | Status |
|---------|-----------------|--------|
| Atomic Hierarchy | `invariants/atomic-hierarchy.md` | ✅ Owned |
| Localization | `invariants/localization.md` | ✅ Owned |
| Stateless UI | `invariants/stateless-ui.md` | ✅ Owned |
| Theme Sovereignty | `invariants/theme-sovereignty.md` | ✅ Owned |
| MVVM Separation | **Missing** | 🚩 Orphan |
| Repository Isolation | **Missing** | 🚩 Orphan |
| Dependency Safety | **Missing** | 🚩 Orphan |
| Public API Stability | **Missing** | 🚩 Orphan |
| Deterministic Build | **Missing** | 🚩 Orphan |
| Platform Neutrality | **Missing** | 🚩 Orphan |
| ViewModel Hook | **Missing** | 🚩 Orphan (referenced in 3 docs, no canonical owner) |
| Integration Contract | **Missing** | 🚩 Orphan (referenced in 1 doc) |
| Page Container | **Missing** | 🚩 Orphan (referenced in 1 doc) |
| useDataState API | **Missing** | 🚩 Orphan (referenced in 4 docs) |
| AppStateHandler | **Missing** | 🚩 Orphan (referenced in 1 doc) |

**Concepts with canonical sources: 4**
**Orphan concepts: 11**

---

## 10. Scoring Breakdown

### Per-Document Scores

| Document | Clarity | Consistency | Boundary Integrity | Traceability | Technical Integrity | Average | P-Level |
|----------|---------|-------------|--------------------|--------------|---------------------|---------|---------|
| `invariants/atomic-hierarchy.md` | 9 | 8 | 9 | 9 | 9 | 8.8 | P3 |
| `invariants/localization.md` | 9 | 7 | 9 | 9 | 9 | 8.6 | P3 |
| `invariants/stateless-ui.md` | 9 | 6 | 9 | 7 | 8 | 7.8 | P2 |
| `invariants/theme-sovereignty.md` | 9 | 8 | 9 | 9 | 9 | 8.8 | P3 |
| `core/component-tiers.md` | 8 | 6 | 7 | 5 | 7 | 6.6 | P2 |
| `core/localization.md` | 8 | 5 | 7 | 4 | 7 | 6.2 | P2 |
| `core/theming.md` | 8 | 5 | 7 | 4 | 7 | 6.2 | P2 |
| `runtime-maps/component-lifecycle.md` | 7 | 6 | 6 | 5 | 6 | 6.0 | P2 |
| `runtime-maps/component-tiers.md` | 8 | 6 | 8 | 5 | 8 | 7.0 | P2 |
| `runtime-maps/provider-hierarchy.md` | 8 | 7 | 8 | 5 | 8 | 7.2 | P2 |

### Dimension Scores

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Invariant Integrity | 4/10 | 20% | 0.80 |
| Guidance Completeness | 3/10 | 20% | 0.60 |
| Cross-Document Consistency | 3/10 | 20% | 0.60 |
| Consumer Onboarding Clarity | 2/10 | 15% | 0.30 |
| Boundary Integrity | 5/10 | 15% | 0.75 |
| Architecture Traceability | 2/10 | 10% | 0.20 |
| **Total** | | **100%** | **3.25 → 3.3/10** |

### What Drove Each Score

**Invariant Integrity (4/10):** 4 of 11 invariants exist. The 4 that exist are individually well-structured with clear may/may-not rules, allowed/forbidden patterns, severity levels, migration guidance, and validation requirements. But 7 are entirely missing — more than half the required invariant set does not exist.

**Guidance Completeness (3/10):** The 4 existing invariants each have guidance documents in `core/` and runtime maps. But the entire consumer-consumption pipeline is broken because:
- The consumer onboarding flow requires: Getting Started → Feature Structure → View → ViewModel → Repository → State Management → Runtime Integration
- Getting Started: missing
- Feature Structure: missing
- MVVM: missing
- Repository: missing
- State Management: missing

**Cross-Document Consistency (3/10):** The existing documents are internally consistent with each other when they address the same concepts, but 8+ cross-references point to non-existent files. Product naming is split 5-2 (Astra vs Prati). Import paths are split between `'astra'` and `'prati'`.

**Consumer Onboarding Clarity (2/10):** A new consumer cannot build a compliant application from architecture docs alone. The documentation:
- Does not explain how to structure an application
- Does not explain MVVM pattern implementation
- Does not explain repository pattern
- Does not explain state management
- References documents that don't exist
- Uses inconsistent product names and import paths

**Boundary Integrity (5/10):** The 4 existing invariants have strong, well-defined boundaries (library vs consumer, component vs data). However, the View/ViewModel and ViewModel/Repository boundaries are described only in passing in docs that reference missing invariants.

**Architecture Traceability (2/10):** 11 orphan concepts are referenced across docs with no canonical owner. 6+ broken cross-references. The integration-contracts layer (which should connect architecture to feature implementation) is entirely missing.

---

## 11. Findings

---

### ARCH-INVARIANT-001 — Missing MVVM Separation Invariant

**Category:** Invariant Integrity
**Documents Affected:** None (missing)
**Severity:** P0 — Critical

**Pattern Description:**
The MVVM pattern is referenced as a core architectural concept across 4 documents (`core/component-tiers.md`, `core/theming.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md`), but no invariant document defines what MVVM means for Prati, what the View/ViewModel/Model boundaries are, or how consumers must structure their application.

**Evidence:**
- `core/component-tiers.md:117`: "See [MVVM Pattern](mvvm-pattern.md)" — link broken
- `core/theming.md:169`: "See [MVVM Pattern](mvvm-pattern.md)" — link broken
- `runtime-maps/component-tiers.md:99`: "See `invariants/mvvm-separation.md`" — file missing

**Authority Violated:** Invariant
**Recommendation:** Create `docs/raw/architecture/invariants/mvvm-separation.md` defining View, ViewModel, and Model layer boundaries, ownership rules, and allowed interaction patterns.
**Impact:** Consumers have no authoritative source for MVVM compliance. Architecture correctness cannot be validated.

---

### ARCH-INVARIANT-002 — Missing Repository Isolation Invariant

**Category:** Invariant Integrity
**Documents Affected:** None (missing)
**Severity:** P0 — Critical

**Pattern Description:**
Repository access rules are defined in passing in `core/component-tiers.md` and `runtime-maps/component-tiers.md` (e.g., "Organisms may NOT access repositories directly — must use ViewModel hooks"), but no invariant document defines the repository abstraction layer, its boundaries, or consumer responsibilities.

**Evidence:**
- Repository concept referenced in 4 docs without canonical definition
- No invariant defines what a Repository is, what it may/may not do
- No invariant defines repository lifecycle or dependency direction

**Authority Violated:** Invariant
**Recommendation:** Create `docs/raw/architecture/invariants/repository-isolation.md`.
**Impact:** Consumers may implement repositories inconsistently, creating integration problems.

---

### ARCH-INVARIANT-003 — Missing Platform Neutrality Invariant

**Category:** Invariant Integrity
**Documents Affected:** None (missing)
**Severity:** P0 — Critical

**Pattern Description:**
`invariants/stateless-ui.md` references `platform-neutrality.md` for SSR guard requirements, but this document does not exist. This creates a dependency hole in the stateless UI invariant's exception handling.

**Evidence:**
- `invariants/stateless-ui.md:68`: "See [Platform Neutrality Invariant](platform-neutrality.md) for the SSR guard requirement" — file missing

**Authority Violated:** Invariant (stateless-ui.md depends on it)
**Recommendation:** Create `docs/raw/architecture/invariants/platform-neutrality.md` defining SSR constraints, browser API access rules, and environment assumptions.
**Impact:** The documented ThemeProvider localStorage exception lacks its required guard specification.

---

### ARCH-INVARIANT-004 — Missing Public API Stability, Dependency Safety, Deterministic Build Invariants

**Category:** Invariant Integrity
**Documents Affected:** None (missing)
**Severity:** P0 — Critical

**Pattern Description:**
Three foundational invariants for a published library are entirely absent: public API stability guarantees, dependency safety rules, and deterministic build requirements.

**Evidence:**
- Files `public-api-stability.md`, `dependency-safety.md`, `deterministic-build.md` do not exist under `invariants/`
- No document defines what constitutes a breaking change
- No document defines acceptable dependency patterns
- No document defines build reproducibility requirements

**Authority Violated:** Invariant
**Recommendation:** Create all three invariant documents.
**Impact:** As a published npm package (`package.json:private: false`), Prati has no documented API stability contract for consumers.

---

### ARCH-CONSISTENCY-001 — Product Name Inconsistency (Astra vs Prati)

**Category:** Cross-Document Consistency
**Documents Affected:** All 10 architecture documents
**Severity:** P1 — Major

**Pattern Description:**
3 of 4 invariants refer to the product as "Astra"; only `invariants/localization.md` uses "Prati". Core architecture and runtime maps are similarly split.

**Evidence:**
- `invariants/atomic-hierarchy.md:5`: "Astra is organized by Atomic Design methodology"
- `invariants/stateless-ui.md:5`: "Astra is a presentation-oriented UI component library"
- `invariants/theme-sovereignty.md:5`: "Astra is a theme-driven UI component library"
- `invariants/localization.md:5`: "Prati is a locale-aware UI component library"
- `core/component-tiers.md:3`: "Astra is organized by Atomic Design methodology"
- `core/localization.md:3`: "Prati provides a React Context-based localization system"
- `core/theming.md:3`: "Astra provides a MUI-based theming system"
- `runtime-maps/component-lifecycle.md:3`: "Maps the lifecycle of an Astra component"
- `runtime-maps/component-tiers.md` references "Astra" implicitly through aligned doc references
- `core/theming.md:20,65,71,94,119`: Code examples use `import { X } from 'astra'` — but package name is `prati` (confirmed in `package.json:2`)

**Authority Violated:** Invariant (all 4)
**Recommendation:** Normalize all architecture documents to use a single product name (either "Prati" or "Astra") and update all import paths accordingly.
**Impact:** Consumer confusion about which package to import from. Architecture docs cannot serve as a reliable reference.

---

### ARCH-CONSISTENCY-002 — Broken Cross-References to Missing Documents

**Category:** Cross-Document Consistency
**Documents Affected:** `core/component-tiers.md`, `core/localization.md`, `core/theming.md`, `runtime-maps/component-lifecycle.md`, `runtime-maps/component-tiers.md`, `runtime-maps/provider-hierarchy.md`
**Severity:** P1 — Major

**Pattern Description:**
Architecture documents contain 8+ cross-references to files that do not exist.

**Evidence:**
- `core/component-tiers.md:115-117`: References `feature-structure.md`, `mvvm-pattern.md` — both missing
- `core/localization.md:232-233`: References `../../astra/architecture/core/mvvm-pattern.md` and `../../astra/architecture/core/state-management.md` — both missing, and `../../astra/` path suggests an external dependency
- `core/theming.md:169-170`: References `mvvm-pattern.md`, `state-management.md` — both missing
- `runtime-maps/component-lifecycle.md:66`: References `core/api-surface.md` — missing
- `runtime-maps/component-tiers.md:99-100`: References `invariants/mvvm-separation.md`, `core/feature-structure.md` — both missing
- `runtime-maps/provider-hierarchy.md:40`: References `integration-contracts/getting-started.md` — missing

**Authority Violated:** Runtime Maps (lower authority must reference, not redefine, higher authority — but higher authority doesn't exist)
**Recommendation:** Either create all referenced documents or remove broken references. Fix `../../astra/architecture/core/` paths in `core/localization.md` — they point outside the project.
**Impact:** Traceability chain is broken at multiple points. Consumers cannot navigate from concept to guidance.

---

### ARCH-CONSISTENCY-003 — Import Path Inconsistency

**Category:** Cross-Document Consistency
**Documents Affected:** `core/theming.md`, `core/localization.md`
**Severity:** P1 — Major

**Pattern Description:**
Core architecture documents show different import sources for the same concepts.

**Evidence:**
- `core/theming.md:20`: `import { ThemeProvider, useTheme, ThemeToggle } from 'astra'`
- `core/localization.md:20`: `import { LanguageProvider, useLanguage } from 'prati'`
- `core/theming.md:65`: `import { spacing, typography } from 'astra'`
- `core/theming.md:71`: `import { useTheme } from 'astra'`

**Authority Violated:** Core Architecture
**Recommendation:** Normalize all imports to a single source path matching `package.json:2` (currently `prati`).
**Impact:** Consumers following the theming doc will get import errors.

---

### ARCH-COVERAGE-001 — Integration Contracts Directory Missing

**Category:** Guidance Completeness
**Documents Affected:** `docs/raw/architecture/integration-contracts/` (entire directory)
**Severity:** P1 — Major

**Pattern Description:**
The integration-contracts layer, which should connect architecture to consumer implementation, is entirely absent. This is the most critical guidance gap — without it, consumers have no documented path from reading invariants to building a compliant application.

**Evidence:**
- Directory `docs/raw/architecture/integration-contracts/` does not exist
- `runtime-maps/provider-hierarchy.md:40`: References `integration-contracts/getting-started.md` — broken
- The consumer onboarding flow (Getting Started → Feature Structure → View → ViewModel → Repository → State Management → Runtime Integration) has zero documents

**Authority Violated:** Integration Contracts
**Recommendation:** Create the integration-contracts directory with at minimum: `getting-started.md` (combined provider example), `feature-structure.md` (consumer directory layout), and `state-management.md` (useDataState integration).
**Impact:** Architecture documentation provides theory but no implementation guidance. Consumers cannot onboard.

---

### ARCH-COVERAGE-002 — Missing Consumer Onboarding Flow

**Category:** Guidance Completeness
**Documents Affected:** All
**Severity:** P1 — Major

**Pattern Description:**
The required consumer onboarding flow has 7 steps. Zero are present as standalone guidance documents.

**Evidence:**
Required flow:
```
Getting Started → Feature Structure → View → ViewModel → Repository → State Management → Runtime Integration
```
- Getting Started: no document exists
- Feature Structure: no document exists (referenced but missing)
- View: no document exists (only tier definitions)
- ViewModel: no document exists (referenced but missing in `mvvm-separation.md`)
- Repository: no document exists
- State Management: no document exists
- Runtime Integration: only provider-hierarchy.md exists (partial)

**Authority Violated:** Integration Contracts
**Recommendation:** Create the onboarding document flow. Each step should be a standalone guidance document that shows how the architecture documents translate to consumer code.
**Impact:** No documented path from concept to implementation.

---

### ARCH-COVERAGE-003 — Cross-References Point Outside Project

**Category:** Guidance Completeness
**Documents Affected:** `core/localization.md`
**Severity:** P2 — Transitional

**Pattern Description:**
`core/localization.md` references architecture documents under `../../astra/architecture/core/` — a path that doesn't exist in the Prati repository.

**Evidence:**
- `core/localization.md:232`: `[MVVM Pattern](../../astra/architecture/core/mvvm-pattern.md)`
- `core/localization.md:233`: `[State Management](../../astra/architecture/core/state-management.md)`

**Authority Violated:** Core Architecture
**Recommendation:** Correct paths to point to proper Prati locations, or create the referenced documents.
**Impact:** Broken navigation for consumers.

---

### ARCH-BOUNDARY-001 — ThemeProvider Exception Not Acknowledged in Theme Sovereignty

**Category:** Boundary Integrity
**Documents Affected:** `invariants/stateless-ui.md`, `invariants/theme-sovereignty.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The stateless UI invariant grants ThemeProvider a documented localStorage persistence exception. The theme sovereignty invariant does not acknowledge this exception or address how it relates to the theme token system.

**Evidence:**
- `invariants/stateless-ui.md:40-68`: Documents ThemeProvider's localStorage exception with SSR guard requirements
- `invariants/theme-sovereignty.md`: No mention of the exception or any persistence behavior

**Authority Violated:** Invariant
**Recommendation:** Add a note to `theme-sovereignty.md` acknowledging the stateless-exception for ThemeProvider and referencing `stateless-ui.md`.
**Impact:** Minor cross-invariant gap. Consumer might implement custom theme persistence without understanding the exception's constraints.

---

### ARCH-BOUNDARY-002 — LoadingSpinner Referenced But Not Defined

**Category:** Boundary Integrity
**Documents Affected:** `runtime-maps/component-lifecycle.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The component lifecycle runtime map references `LoadingSpinner` in the render pipeline, but no such component exists in the documented API surface.

**Evidence:**
- `runtime-maps/component-lifecycle.md:52`: `LOADING → LoadingSpinner`
- No architecture doc defines LoadingSpinner as a valid component name
- Existing loading state component is `LoadingState` (from `core/component-tiers.md:11`)

**Authority Violated:** Runtime Map
**Recommendation:** Replace `LoadingSpinner` with `LoadingState` to match the actual component name used in core docs.
**Impact:** Minor naming inconsistency that could confuse consumers reading the render pipeline.

---

### ARCH-TRACE-001 — useDataState and AppStateHandler Have No Canonical Owner

**Category:** Architecture Traceability
**Documents Affected:** `invariants/stateless-ui.md`, `core/component-tiers.md`, `runtime-maps/component-tiers.md`, `runtime-maps/component-lifecycle.md`
**Severity:** P1 — Major

**Pattern Description:**
`useDataState` and `AppStateHandler` are referenced as core architectural concepts across 4 documents, but no document owns their definition, API contract, or usage rules.

**Evidence:**
- Referenced in `invariants/stateless-ui.md:480,484`, `core/component-tiers.md:49`, `runtime-maps/component-tiers.md:16,60,68`, `runtime-maps/component-lifecycle.md:48`
- No invariant, core doc, or integration contract defines `useDataState` or `AppStateHandler`
- These are the primary mechanisms for state orchestration and state routing, yet they have no architectural definition

**Authority Violated:** Invariant / Core Architecture
**Recommendation:** Either create integration contracts for `useDataState` and `AppStateHandler`, or add their definitions to the stateless UI invariant's allowed patterns.
**Impact:** The primary state orchestration mechanism referenced everywhere has no canonical definition.

---

### ARCH-TRACE-002 — Orphan Page Container Concept

**Category:** Architecture Traceability
**Documents Affected:** `runtime-maps/component-tiers.md`
**Severity:** P2 — Transitional

**Pattern Description:**
The "Page Container" concept appears in the hook access table as a consumer-level entity that may use `useDataState`, but no document defines what a Page Container is, how it differs from a Template, or where it lives in the source tree.

**Evidence:**
- `runtime-maps/component-tiers.md:66`: "Page Container (consumer)" appears in hook access table
- No invariant or core doc defines Page Container
- No definition of its relationship to Templates or Organisms

**Authority Violated:** Runtime Map
**Recommendation:** Either add Page Container definition to `core/component-tiers.md` or remove the concept from the runtime map and fold its access rules into the Template tier.
**Impact:** Ambiguous concept. Consumers may confuse Page Containers with Templates.

---

## 12. Score Improvement Summary

**Previous Report:** None (baseline — no prior report to compare)
**Previous Score:** N/A
**Current Score:** 3.3/10
**Change:** N/A (baseline audit)

This is the first architecture audit. Future audits will track score changes.

---

## 13. Final Verdict

```
Major Revision Required (3.3/10)
```

The architecture documentation corpus has a strong foundation in its 4 existing invariants — which are individually well-structured — but is critically incomplete. Over half the required invariants are missing. The integration-contracts layer (which should connect architecture to consumer implementation) is entirely absent. Cross-references are broken throughout, the product name is inconsistent, and the consumer onboarding flow cannot be completed.

The corpus will remain "Major Revision Required" until:
1. All 11 invariants are defined (7 missing currently)
2. Integration-contracts directory is populated with at minimum: getting-started, feature-structure, state-management
3. All cross-references are fixed or removed
4. Product naming is normalized to a single name
5. Import paths are normalized to the actual package name

---

## 14. Audit Traceability

| Reference | Location |
|-----------|----------|
| Architecture Docs | `docs/raw/architecture/**` |
| Invariants | `docs/raw/architecture/invariants/**` |
| Runtime Maps | `docs/raw/architecture/runtime-maps/**` |
| Integration Contracts | `docs/raw/architecture/integration-contracts/**` (missing) |
| Audit Report | `docs/raw/report/architecture/latest/architecture-audit-2026-06-19-1145.md` |
| Previous Report | None (baseline) |
