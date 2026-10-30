# Architecture Audit Report — 2026-06-20

## 1. Executive Summary

```
Overall Assessment:   Needs Improvement
Audit Score:          6.45 / 10
Critical Findings:    0  (P0)
Major Findings:       5  (P1)
Intermediate Findings:7  (P2)
Informational:        2  (P3)
Documents Audited:    18
Scope:                docs/raw/architecture/invariants/**, core/**, integration-contracts/**
```

The Astra architecture corpus demonstrates solid foundational invariant design: MVVM, Repository Isolation, Dependency Safety, Public API Stability, Deterministic Build, and Platform Neutrality are each well-defined with consistent internal structure, detection heuristics, and severity tiers. The integration contracts provide actionable consumer guidance for React and Electron targets.

The corpus is held back by four systemic issues:

1. **Broken cross-reference network** — `theming.md`, `localization.md`, `atomic-hierarchy.md`, and `stateless-ui.md` are referenced across 8+ documents but do not exist. This breaks traceability chains and leaves onboarding flows with dead links.
2. **Unauthorized guidance exception** — `platform-abstraction.md` permits lazy-loaded Node.js APIs that `platform-neutrality.md` (the authoritative invariant) explicitly forbids. Lower-authority guidance overrides higher-authority invariant.
3. **Astra/Prati boundary ambiguity** — The architecture documentation claims ThemeProvider, LanguageProvider, useTheme, useLanguage, and Atomic Design components as Astra-owned exports, while the audit context identifies these as belonging to the separate Prati library. Scope conflict is present at every layer of the corpus.
4. **ERROR state terminology drift** — `state-management.md` defines `StateType` without an `ERROR` enum value, but both `mvvm-pattern.md` and the state transition diagram present ERROR as a named state. This creates consumer confusion about how to check for errors.

Resolving findings ARCH-TRACE-001, ARCH-COVERAGE-001, ARCH-COVERAGE-002, and ARCH-CONSISTENCY-001 would be sufficient to elevate the score to the Good band (7.0–8.9).

---

## 2. Documents Audited

### Invariants (6)

1. `docs/raw/architecture/invariants/mvvm-separation.md`
2. `docs/raw/architecture/invariants/repository-isolation.md`
3. `docs/raw/architecture/invariants/dependency-safety.md`
4. `docs/raw/architecture/invariants/public-api-stability.md`
5. `docs/raw/architecture/invariants/deterministic-build.md`
6. `docs/raw/architecture/invariants/platform-neutrality.md`

### Core Architecture (9)

7. `docs/raw/architecture/core/state-management.md`
8. `docs/raw/architecture/core/feature-structure.md`
9. `docs/raw/architecture/core/repository.md`
10. `docs/raw/architecture/core/build.md`
11. `docs/raw/architecture/core/dependencies.md`
12. `docs/raw/architecture/core/platform-abstraction.md`
13. `docs/raw/architecture/core/api-surface.md`
14. `docs/raw/architecture/core/hooks.md`
15. `docs/raw/architecture/core/mvvm-pattern.md`

### Integration Contracts (3)

16. `docs/raw/architecture/integration-contracts/getting-started.md`
17. `docs/raw/architecture/integration-contracts/react.md`
18. `docs/raw/architecture/integration-contracts/electron.md`

### Out-of-Scope Note

`docs/raw/architecture/runtime-maps/` was stated as empty in audit parameters, but the directory contains 6 populated files (`state-flow.md`, `data-flow.md`, `build-pipeline.md`, `dependency-graph.md`, `platform-runtimes.md`, `import-resolution.md`). These are excluded from formal scoring per the stated audit scope, but their existence — and the fact that integration contracts reference them — is noted under ARCH-TRACE-002.

---

## 3. Authority Hierarchy Validation

| Level | Authority              | Documents                     | Status             |
|-------|------------------------|-------------------------------|--------------------|
| 1     | Invariants             | 6 invariant files             | Present, 1 orphan ref |
| 2     | Core Architecture      | 9 core files                  | Present, 1 authority violation |
| 3     | Integration Contracts  | 3 contract files              | Present, boundary gaps |
| 4     | Examples               | Embedded in all layers        | No override violations found |

**Violations detected:**

- `platform-abstraction.md` (Level 2) introduces a Node.js lazy-load allowance that `platform-neutrality.md` (Level 1) does not authorize — a direct downward authority override. See ARCH-CONSISTENCY-001.
- `getting-started.md` and `react.md` (Level 3) reference `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` — an invariant that does not exist, leaving Level 3 contracts without Level 1 backing for component tier rules.

---

## 4. Invariant Coverage Matrix

| Invariant              | Defined | Guidance Exists                  | Integration Contract Exists | Coverage |
|------------------------|---------|----------------------------------|-----------------------------|----------|
| mvvm-separation        | Yes     | Yes — `mvvm-pattern.md`, `hooks.md`, `feature-structure.md` | Yes — all 3 contracts | Complete |
| repository-isolation   | Yes     | Yes — `repository.md`            | Yes — all 3 contracts       | Complete |
| dependency-safety      | Yes     | Yes — `dependencies.md`          | No explicit contract section | Partial |
| public-api-stability   | Yes     | Yes — `api-surface.md`           | Partial — `getting-started.md` export table | Partial |
| deterministic-build    | Yes     | Yes — `build.md`                 | No explicit contract section | Partial |
| platform-neutrality    | Yes     | Yes — `platform-abstraction.md`  | Yes — `electron.md`         | Partial (authority conflict) |
| stateless-ui           | **No** (missing) | No — `platform-neutrality.md` references it but it is absent | No | **Missing** |
| atomic-hierarchy       | **No** (missing) | No — `getting-started.md` and `react.md` reference it | No | **Missing** |

---

## 5. Architecture Concept Matrix

| Concept               | Canonical Owner               | Referenced By                                  | Consistent |
|-----------------------|-------------------------------|------------------------------------------------|------------|
| MVVM layers           | `mvvm-separation.md`          | All core + contracts                           | Yes        |
| useDataState          | `hooks.md`                    | `state-management.md`, `mvvm-pattern.md`, all contracts | Yes |
| AppState interface    | `state-management.md`         | `mvvm-pattern.md`, `hooks.md`, `feature-structure.md` | Yes |
| StateType enum        | `state-management.md`         | `mvvm-pattern.md`, `hooks.md`                  | **No** — ERROR state mismatch |
| Repository pattern    | `repository-isolation.md`     | `repository.md`, all contracts                 | Yes        |
| ApiService            | `repository-isolation.md`     | `repository.md`, `feature-structure.md`, contracts | Yes |
| ServerResponse        | `repository-isolation.md`     | `repository.md`, `electron.md`                 | Partial — static methods only in invariant |
| Feature structure     | `feature-structure.md`        | `mvvm-pattern.md`, `react.md`, `electron.md`   | Yes        |
| Public API / lib.ts   | `public-api-stability.md`     | `api-surface.md`, `getting-started.md`         | **No** — useTheme missing from api-surface exports |
| Platform neutrality   | `platform-neutrality.md`      | `platform-abstraction.md`, `electron.md`       | **No** — lazy-load exception unauthorized |
| ThemeProvider         | **Ambiguous** (Astra or Prati?) | `platform-neutrality.md`, `api-surface.md`, all contracts | **No** — boundary conflict |
| LanguageProvider      | **Ambiguous** (Astra or Prati?) | `feature-structure.md`, all contracts          | **No** — boundary conflict |
| Atomic Design tiers   | Missing (`atomic-hierarchy.md`) | `getting-started.md`, `react.md`, `feature-structure.md` | **No** — no invariant backing |
| Deterministic build   | `deterministic-build.md`      | `build.md`                                     | Yes        |
| Dependency safety     | `dependency-safety.md`        | `dependencies.md`                              | Yes        |

---

## 6. Terminology Audit

| Concept            | Terms Used                                            | Documents                                          |
|--------------------|-------------------------------------------------------|----------------------------------------------------|
| Error state        | `ERROR`, `isError: true`, `COMPLETED (isError=true)`  | `state-management.md`, `mvvm-pattern.md`, `hooks.md` |
| ViewModel          | `ViewModel`, `ViewModel hook`, `custom hook`, `hook`  | All core docs and contracts                        |
| Page container     | `Container`, `Page`, `page component`, `page container` | `mvvm-separation.md` (Container), `feature-structure.md` (pages/), `mvvm-pattern.md` (Container/Page) |
| Repository         | `Repository`, `repository`, `repo`, `data access`    | All docs                                           |
| Data access layer  | `Repository`, `Model (Data Access)`, `repo/`          | `mvvm-separation.md`, `feature-structure.md`, `mvvm-pattern.md` |
| IPC adapter        | `IPC adapter`, `IPC repository`, `consumer-managed IPC abstraction` | `repository.md`, `mvvm-pattern.md`, `electron.md` |
| Public API         | `public API surface`, `public contract`, `entry point`, `exported symbols` | `public-api-stability.md`, `api-surface.md` |

**Flags:**

- **ERROR state**: Three different representations in use — as a named `StateType` enum value (absent in code), as `isError: true`, and as `[ERROR]` in state diagrams. Consumer cannot determine the authoritative check pattern.
- **Container vs Page**: `mvvm-separation.md` and `mvvm-pattern.md` use `Container` for the composition layer; `feature-structure.md` uses `view/pages/`. Both refer to the same concept but under different names.
- **ViewModel location**: `mvvm-separation.md` says "ViewModels are implemented as custom hooks in `hooks/use<Feature>.ts`"; `mvvm-pattern.md` says `hooks/use<Feature>.ts` in a table; both are consistent but the term "Container" vs "Page Container" drifts.

---

## 7. Duplication Audit

| Contract                    | Canonical Owner               | Duplicate Definitions                              |
|-----------------------------|-------------------------------|----------------------------------------------------|
| Feature folder structure    | `feature-structure.md`        | `react.md` (full directory layout repeated), `getting-started.md` (partial) |
| MVVM layer → directory map  | `feature-structure.md`        | `mvvm-pattern.md` (table), `react.md` (table) — different column sets |
| Repository example          | `repository.md`               | `feature-structure.md`, `react.md`, `getting-started.md` — minor divergence in base URL placeholders |
| Atomic Design tier table    | Missing (`atomic-hierarchy.md`) | `getting-started.md` (full table), `react.md` (full table) — identical content in two Level 3 docs, no Level 1 authority |
| Provider setup code         | `getting-started.md`          | `react.md` repeats ThemeProvider/LanguageProvider setup verbatim |
| useDataState basic usage    | `hooks.md`                    | `state-management.md`, `mvvm-pattern.md`, `repository.md`, `getting-started.md` — 4 docs repeat the same pattern |

**Priority duplications:** The Atomic Design tier table appears verbatim in both `getting-started.md` and `react.md` with no canonical source (invariant missing). The provider setup block is repeated with minor variation across `getting-started.md`, `react.md`, and `electron.md` — acceptable for integration contracts but increases drift risk.

---

## 8. Cross-Document Consistency Matrix

| Concept                          | Doc A                         | Doc B                            | Result   |
|----------------------------------|-------------------------------|----------------------------------|----------|
| StateType has ERROR value        | `state-management.md` (no ERROR in enum) | `mvvm-pattern.md` (ERROR listed as named state) | **Conflict** |
| ERROR state check pattern        | `state-management.md` (`isError = true`) | `mvvm-pattern.md` (`isError: true` as separate row) | Match (representation differs) |
| Node.js in core allowed          | `platform-neutrality.md` (forbidden: fs, path, process) | `platform-abstraction.md` (lazy-load permitted) | **Conflict** |
| useTheme is public export        | `getting-started.md` export table (listed) | `api-surface.md` (not in explicit exports) | **Conflict** |
| ThemeProvider belongs to Astra   | `platform-neutrality.md` (ThemeProvider localStorage exception documented) | Audit context (Prati owns theming) | **Conflict** (external) |
| Container / Page naming          | `mvvm-separation.md` (Container) | `feature-structure.md` (view/pages/) | Partial mismatch |
| ServerResponse static methods    | `repository-isolation.md` (ServerResponse.success/error) | `repository.md` (not documented) | Incomplete |
| ViewModel file location          | `mvvm-separation.md` (`hooks/use<Feature>.ts`) | `mvvm-pattern.md` (`hooks/` table) | Match |
| Feature boundary: no cross-feature imports | `feature-structure.md` ("Features should NOT import from each other's internals") | `react.md` (not restated) | Partial |
| IPC returns ServerResponse       | `electron.md` (required) | `repository.md` (IPC section shows return without explicit ServerResponse) | Partial mismatch |
| Deterministic build rules        | `deterministic-build.md` | `build.md` | Match — `build.md` correctly defers |
| Dependency safety rules          | `dependency-safety.md` | `dependencies.md` | Match — `dependencies.md` correctly defers |

---

## 9. Architecture Traceability Matrix

| Concept                     | Canonical Source                    | Notes                                            |
|-----------------------------|-------------------------------------|--------------------------------------------------|
| MVVM Separation             | `invariants/mvvm-separation.md`     | Well-traced to `mvvm-pattern.md`, `feature-structure.md` |
| Repository Isolation        | `invariants/repository-isolation.md` | Well-traced to `repository.md` |
| Dependency Safety           | `invariants/dependency-safety.md`   | Well-traced to `dependencies.md` |
| Public API Stability        | `invariants/public-api-stability.md` | Traced to `api-surface.md`; `useTheme` gap |
| Deterministic Build         | `invariants/deterministic-build.md` | Well-traced to `build.md` |
| Platform Neutrality         | `invariants/platform-neutrality.md` | Traced to `platform-abstraction.md`; lazy-load conflict |
| Stateless UI / localStorage exception | **MISSING** (`stateless-ui.md`) | Referenced by `platform-neutrality.md` line 61; no canonical source |
| Atomic Design tier rules    | **MISSING** (`atomic-hierarchy.md`) | Referenced by `getting-started.md`, `react.md`; no canonical source |
| ThemeProvider ownership     | **AMBIGUOUS** (`api-surface.md`, `platform-neutrality.md` vs audit context) | Multiple documents claim Astra ownership |
| LanguageProvider ownership  | **AMBIGUOUS** (`api-surface.md`, `feature-structure.md` vs audit context) | Multiple documents claim Astra ownership |
| Theming guidance            | **MISSING** (`core/theming.md`)     | Referenced by `state-management.md`, `mvvm-pattern.md`, `repository.md` |
| Localization guidance       | **MISSING** (`core/localization.md`) | Referenced by `state-management.md`, `mvvm-pattern.md`, `repository.md` |
| useDataState API            | `core/hooks.md`                     | Well-traced |
| AppState interface          | `core/state-management.md`          | Well-traced |
| Feature directory structure | `core/feature-structure.md`         | Well-traced |
| Provider hierarchy          | **MISSING** (`runtime-maps/provider-hierarchy.md`) | Referenced by `electron.md`; file exists in runtime-maps (out of scope) |

**Orphan concept count: 6** (`stateless-ui.md`, `atomic-hierarchy.md`, `theming.md`, `localization.md`, `ThemeProvider` ownership, `LanguageProvider` ownership)

---

## 10. Document Scoring

| Document | Clarity | Consistency | Boundary Integrity | Traceability | Technical Integrity | Average | P-Level |
|----------|---------|-------------|--------------------|--------------|---------------------|---------|---------|
| `invariants/mvvm-separation.md` | 9 | 7 | 9 | 9 | 9 | **8.6** | P3 |
| `invariants/repository-isolation.md` | 9 | 8 | 9 | 8 | 9 | **8.6** | P3 |
| `invariants/dependency-safety.md` | 9 | 9 | 9 | 8 | 9 | **8.8** | P3 |
| `invariants/public-api-stability.md` | 9 | 7 | 8 | 8 | 9 | **8.2** | P3 |
| `invariants/deterministic-build.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `invariants/platform-neutrality.md` | 9 | 7 | 8 | 6 | 8 | **7.6** | P2 |
| `core/state-management.md` | 8 | 7 | 8 | 6 | 8 | **7.4** | P2 |
| `core/feature-structure.md` | 9 | 7 | 6 | 8 | 8 | **7.6** | P2 |
| `core/repository.md` | 8 | 8 | 8 | 6 | 8 | **7.6** | P2 |
| `core/build.md` | 9 | 9 | 9 | 9 | 9 | **9.0** | P3 |
| `core/dependencies.md` | 8 | 8 | 9 | 8 | 7 | **8.0** | P3 |
| `core/platform-abstraction.md` | 8 | 6 | 6 | 8 | 7 | **7.0** | P2 |
| `core/api-surface.md` | 8 | 7 | 8 | 8 | 8 | **7.8** | P2 |
| `core/hooks.md` | 9 | 8 | 8 | 8 | 9 | **8.4** | P3 |
| `core/mvvm-pattern.md` | 8 | 7 | 8 | 6 | 8 | **7.4** | P2 |
| `integration-contracts/getting-started.md` | 8 | 6 | 5 | 5 | 7 | **6.2** | P2 |
| `integration-contracts/react.md` | 8 | 6 | 6 | 5 | 8 | **6.6** | P2 |
| `integration-contracts/electron.md` | 9 | 8 | 9 | 7 | 9 | **8.4** | P3 |

---

## 11. Findings

---

### ARCH-INVARIANT-001

**Category:** Invariant Integrity

**Documents Affected:** `invariants/platform-neutrality.md`

**Severity:** P1

**Pattern Description:**
`platform-neutrality.md` references a `[Stateless UI Invariant](stateless-ui.md)` to document the canonical ThemeProvider localStorage exception. This file does not exist in the invariants corpus. The exception is therefore defined inline in `platform-neutrality.md` without a canonical invariant owner, and the cross-reference creates a broken traceability pointer.

**Evidence:**
> `platform-neutrality.md`, line 61: "See [Stateless UI Invariant](stateless-ui.md) for the full exception definition. No other Astra library component may use `localStorage` or `sessionStorage`."

The `stateless-ui.md` file is absent from `docs/raw/architecture/invariants/`.

**Authority Violated:** Invariant — `platform-neutrality.md`

**Recommendation:**
Either (a) create `invariants/stateless-ui.md` as a proper invariant document defining the localStorage exception rule and the SSR guard requirement, or (b) promote the inline exception block within `platform-neutrality.md` to a labeled, self-contained section and remove the external reference. Option (a) is preferred to give the stateless-ui rule its own traceability surface.

**Impact:**
The ThemeProvider localStorage exception is architecturally significant (the only platform-specific behavior permitted in core). Without its own invariant document, consumers and reviewers cannot determine the full scope of the exception or audit compliance against it.

---

### ARCH-INVARIANT-002

**Category:** Invariant Integrity

**Documents Affected:** `core/state-management.md`, `core/mvvm-pattern.md`

**Severity:** P2

**Pattern Description:**
`state-management.md` defines `StateType` as a three-value enum (`INIT = 0`, `LOADING = 1`, `COMPLETED = 2`) with no `ERROR` value. However, the state transition diagram in `state-management.md` depicts `[ERROR]` as a terminal state, and `mvvm-pattern.md` lists `ERROR` as a named row in its state table (`| ERROR | Operation failed | isError: true |`). Consumers cannot determine the authoritative error-check pattern from the corpus.

**Evidence:**
- `state-management.md`: enum has no `ERROR` value; diagram shows `[ERROR]` as a box.
- `mvvm-pattern.md`, state table row: `| ERROR | Operation failed | isError: true |`
- `hooks.md`: error is consistently checked via `appState.isError` (no `StateType.ERROR` reference).

**Authority Violated:** Core Architecture — `state-management.md`

**Recommendation:**
Clarify in `state-management.md` that `ERROR` is not a `StateType` enum value but rather the combination of `COMPLETED` state with `isError: true`. Redraw the state diagram to show `COMPLETED / isError=false` and `COMPLETED / isError=true` as the two terminal conditions. Remove the named ERROR row from `mvvm-pattern.md` or relabel it as `COMPLETED (isError: true)`.

**Impact:**
Consumer code may attempt `state.state === StateType.ERROR` which will never match, producing silent bugs in error-handling paths.

---

### ARCH-COVERAGE-001

**Category:** Guidance Completeness

**Documents Affected:** `core/state-management.md`, `core/mvvm-pattern.md`, `core/repository.md`, `core/hooks.md`

**Severity:** P1

**Pattern Description:**
`theming.md` and `localization.md` are listed as Related links in four core architecture documents but do not exist in `docs/raw/architecture/core/`. There is no canonical guidance for ThemeProvider/useTheme or LanguageProvider/useLanguage in the architecture corpus. This leaves two significant cross-cutting concerns without architecture-layer documentation.

**Evidence:**
- `state-management.md` Related: `[Theming](theming.md)`, `[Localization](localization.md)` — both absent.
- `mvvm-pattern.md` Related: `[Theming](theming.md)`, `[Localization](localization.md)` — both absent.
- `repository.md` Related: `[Theming](theming.md)`, `[Localization](localization.md)` — both absent.
- `hooks.md` does not reference these but the gap affects overall corpus completeness.

**Authority Violated:** Core Architecture — multiple documents reference guidance that does not exist.

**Recommendation:**
Create `core/theming.md` and `core/localization.md` covering: ThemeProvider/LanguageProvider provider hierarchy, public API exports, consumer integration pattern, and cross-reference to the stateless-ui invariant (once created). If Astra does not own these concerns and they belong to Prati, replace the broken links with explicit attribution to the Prati documentation corpus.

**Impact:**
Consumers following Related links in the most-consulted architecture documents hit dead ends. Theming and localization integration patterns are undocumented at the architecture layer, pushing consumers to discover patterns from example code alone.

---

### ARCH-COVERAGE-002

**Category:** Guidance Completeness

**Documents Affected:** `integration-contracts/getting-started.md`, `integration-contracts/react.md`

**Severity:** P1

**Pattern Description:**
Both integration contracts reference `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` for component tier rules. This invariant does not exist. The Atomic Design tier table (atoms → molecules → organisms → templates) appears verbatim in both `getting-started.md` and `react.md` without a canonical invariant source, and the tier rules are therefore underpinned by no higher-authority document.

**Evidence:**
- `getting-started.md`, lines 277 and 311: `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` — file absent.
- `react.md`, Component Architecture Rationale section: references `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` — file absent.
- `feature-structure.md` line 12 describes Atomic Design as an Astra-provided capability without invariant backing.

**Authority Violated:** Invariant (missing) — no Level 1 authority for Atomic Design tier rules.

**Recommendation:**
Create `invariants/atomic-hierarchy.md` defining tier membership rules, import direction constraints (atoms imported by molecules, not vice versa), and ownership. If Atomic Design is Prati's domain, replace the invariant reference with an external Prati documentation pointer and remove the duplicated tier tables from `getting-started.md` and `react.md`.

**Impact:**
Component tier rules have no invariant authority. The same table duplicated across two Level 3 docs will diverge over time. Consumers have no auditable tier constraint to validate against.

---

### ARCH-CONSISTENCY-001

**Category:** Cross-Document Consistency

**Documents Affected:** `core/platform-abstraction.md`, `invariants/platform-neutrality.md`

**Severity:** P1

**Pattern Description:**
`platform-abstraction.md` (Level 2 guidance) permits Node.js APIs in core under a lazy-load pattern:
> "If a feature requires Node.js, it must be: 1. Behind a lazy-loaded import, 2. Not re-exported from `lib.ts`, 3. Documented as Node.js-only."

`platform-neutrality.md` (Level 1 invariant) forbids this categorically:
> "Core modules may NOT: use Node.js APIs (fs, path, process)"

This is a direct authority hierarchy violation — a lower-authority document weakens a higher-authority prohibition.

**Evidence:**
- `platform-abstraction.md`, lines 51–64: lazy-loaded `handlebars` example cited as "Acceptable."
- `platform-neutrality.md`, Architectural Rule: "Core modules may NOT: use Node.js APIs."
- Authority hierarchy states: "Lower authority documents MUST NOT weaken higher authority requirements."

**Authority Violated:** Invariant — `platform-neutrality.md`; Authority Hierarchy Rule.

**Recommendation:**
Remove or revise the lazy-load exception in `platform-abstraction.md`. If an exception is warranted, it must be codified as an explicit exception in `platform-neutrality.md` itself (as the ThemeProvider localStorage exception is handled). The guidance document must not originate exceptions; only the invariant can authorize them.

**Impact:**
Consumers reading `platform-abstraction.md` may believe Node.js lazy-loads are permitted in core. Code reviews using the guidance doc as authority will pass code that the invariant forbids. Platform neutrality is weakened silently.

---

### ARCH-CONSISTENCY-002

**Category:** Cross-Document Consistency

**Documents Affected:** `integration-contracts/getting-started.md`, `core/api-surface.md`

**Severity:** P2

**Pattern Description:**
`getting-started.md` Core Exports table lists `useTheme` ("Hook to access theme state and toggle") as a public Astra export. `api-surface.md`'s explicit entry-point listing (`src/lib.ts`) does not include `useTheme` — it exports `ThemeProvider` and `ThemeToggle` from `./common/theme` but not `useTheme` by name.

**Evidence:**
- `getting-started.md`, Export Surface table: `| useTheme | Hook to access theme state and toggle |`
- `api-surface.md`, lib.ts listing: `export { ThemeProvider, ThemeToggle } from "./common/theme";` — no `useTheme`.
- `react.md` also imports `useTheme` from `astra` without this being declared in `api-surface.md`.

**Authority Violated:** Core Architecture — `api-surface.md`

**Recommendation:**
Add `useTheme` explicitly to the `api-surface.md` lib.ts export listing if it is part of the public contract. If it is not a public export, remove it from the `getting-started.md` table and add a note that theme state is accessed via `ThemeProvider` context internally.

**Impact:**
Consumer documentation accuracy: the export table is the first reference a consumer checks when integrating. A mismatch between the table and the canonical entry point creates confusion about whether `useTheme` is a supported import.

---

### ARCH-CONSISTENCY-003

**Category:** Cross-Document Consistency

**Documents Affected:** `invariants/repository-isolation.md`, `core/repository.md`

**Severity:** P2

**Pattern Description:**
`repository-isolation.md` (Allowed Patterns) documents `ServerResponse.success()` and `ServerResponse.error()` as static factory methods that Repositories use to construct responses. `repository.md` (the guidance document for the same topic) does not document these factory methods and does not explain when a Repository should construct its own `ServerResponse` vs. rely on `ApiService` to return one automatically.

**Evidence:**
- `repository-isolation.md`: "ServerResponse.success({ status: 200, statusMessage: 'OK', data: {...} })" in Composed Repository Operation example.
- `repository.md`: Repository pattern example returns `api.get<Model[]>(...)` directly — no static factory method usage documented.
- `repository.md` explicitly states: "ApiService already handles errors internally — repositories should not add redundant try/catch wrapping." — but does not address when `ServerResponse.success/error` factory methods are appropriate.

**Authority Violated:** Core Architecture — `repository.md` incompleteness relative to `repository-isolation.md`

**Recommendation:**
Add a section to `repository.md` documenting the `ServerResponse.success()` / `ServerResponse.error()` factory methods, when they are used (composed multi-call operations vs. pass-through API calls), and the distinction between auto-wrapped ApiService responses and manually constructed ServerResponse objects.

**Impact:**
Consumers implementing composed repository operations (multiple chained API calls) have no guidance in the core architecture document. They may construct incorrect error propagation by inventing their own patterns.

---

### ARCH-BOUNDARY-001

**Category:** Boundary Integrity

**Documents Affected:** `core/feature-structure.md`, `core/api-surface.md`, `invariants/platform-neutrality.md`, `integration-contracts/getting-started.md`, `integration-contracts/react.md`

**Severity:** P1

**Pattern Description:**
The architecture corpus claims ThemeProvider, ThemeToggle, LanguageProvider, useLanguage, and useTheme as Astra-owned exports across invariants, core guidance, and integration contracts. The authoritative audit context identifies Theming (`ThemeProvider`, `useTheme`, design tokens) and Localization (`LanguageProvider`, `useLanguage`) as belonging to a separate library — Prati. This creates an unresolved boundary conflict throughout the corpus: the architecture documentation and the stated architectural scope of Astra contradict each other.

**Evidence:**
- `api-surface.md`: `export { ThemeProvider, ThemeToggle } from "./common/theme"; export { LanguageProvider, useLanguage } from "./common/localization";`
- `platform-neutrality.md`: ThemeProvider localStorage exception treated as Astra-internal concern.
- `feature-structure.md`: "| **Foundation** | `ThemeProvider`, `LanguageProvider`, `useTheme`, `useLanguage` |" — listed as Astra-provided.
- `getting-started.md`: Full `ThemeProvider` and `LanguageProvider` integration guide as Astra's core onboarding.
- Audit context: "Astra does NOT own: Theming system (ThemeProvider, useTheme, design tokens) — Prati; Localization system (LanguageProvider, useLanguage) — Prati."

**Authority Violated:** Architecture Boundary — Astra/Prati library separation.

**Recommendation:**
Resolve boundary ownership explicitly: if ThemeProvider/LanguageProvider are Astra-provided (as the docs claim), update the audit scope definition to reflect this and create the missing `core/theming.md` and `core/localization.md` guidance documents. If they belong to Prati, remove Astra ownership claims from `api-surface.md`, `feature-structure.md`, and the integration contracts, and replace with external references to the Prati documentation corpus.

**Impact:**
Library consumers cannot determine where to file issues, request changes, or find authoritative guidance. The invariant system (`platform-neutrality.md`) treats ThemeProvider as Astra-internal, which would break if ThemeProvider moved to Prati. All consumer onboarding guidance becomes ambiguous.

---

### ARCH-BOUNDARY-002

**Category:** Boundary Integrity

**Documents Affected:** `invariants/mvvm-separation.md`

**Severity:** P2

**Pattern Description:**
The ViewModel may-NOT list contains a self-contradicting entry: "manage component lifecycle (useEffect for data only)." The parenthetical "for data only" appears to permit useEffect in ViewModels for data fetching, yet the prohibition reads as forbidding component lifecycle management entirely. The Allowed Patterns section of the same document shows ViewModel hooks using `useEffect` freely. The rule text is ambiguous enough that a reader could reach the opposite interpretation.

**Evidence:**
- `mvvm-separation.md`, ViewModel may NOT: "manage component lifecycle (useEffect for data only)"
- `mvvm-separation.md`, Allowed Patterns, ViewModel: `useEffect(() => { execute(() => UserRepo.getAll()); }, []);` — useEffect in ViewModel.
- `hooks.md` and `mvvm-pattern.md` consistently show useEffect in ViewModel hooks.

**Authority Violated:** Invariant — `mvvm-separation.md` (internal contradiction)

**Recommendation:**
Rewrite the restriction to: "use useEffect for purposes other than data loading (DOM side-effects, subscriptions, and browser API access must remain in the View layer)." This accurately describes the intent without contradicting the Allowed Patterns examples.

**Impact:**
Ambiguous invariant text produces inconsistent code review outcomes — reviewers may flag compliant useEffect patterns as violations.

---

### ARCH-TRACE-001

**Category:** Architecture Traceability

**Documents Affected:** `invariants/platform-neutrality.md`, `core/state-management.md`, `core/mvvm-pattern.md`, `core/repository.md`, `integration-contracts/getting-started.md`, `integration-contracts/react.md`

**Severity:** P1

**Pattern Description:**
The corpus contains 8 cross-references to documents that do not exist. Each broken reference creates an orphan traceability node — a concept without a canonical source. Total broken references by target:

| Missing Target             | Referenced From                                                 | Count |
|----------------------------|-----------------------------------------------------------------|-------|
| `invariants/stateless-ui.md` | `platform-neutrality.md`                                      | 1 |
| `invariants/atomic-hierarchy.md` | `getting-started.md` (×2), `react.md` (×1)               | 3 |
| `core/theming.md`          | `state-management.md`, `mvvm-pattern.md`, `repository.md`       | 3 |
| `core/localization.md`     | `state-management.md`, `mvvm-pattern.md`, `repository.md`       | 3 |

**Evidence:** See individual document reading — all referenced targets confirmed absent via filesystem inventory.

**Authority Violated:** Architecture Traceability — concepts lack canonical sources.

**Recommendation:**
Create the four missing documents or replace the broken references with explicit statements ("Theming guidance is maintained in the Prati documentation corpus"). Run a cross-reference validation pass as part of architecture documentation CI.

**Impact:**
Architecture traceability is broken for stateless-ui rules, atomic-hierarchy rules, theming, and localization — four significant concept clusters. Reviewers and consumers cannot follow traceability chains to authoritative definitions.

---

### ARCH-TRACE-002

**Category:** Architecture Traceability

**Documents Affected:** `integration-contracts/electron.md`, audit scope definition

**Severity:** P2

**Pattern Description:**
`electron.md` references `[Provider Hierarchy](../runtime-maps/provider-hierarchy.md)` for provider nesting rules. The audit scope definition states runtime-maps are "currently empty — skip if unpopulated." However, the runtime-maps directory contains 6 populated files. The audit context is outdated, and `provider-hierarchy.md` exists but is outside formal audit scope. This creates an unaudited cross-reference.

**Evidence:**
- `electron.md`: "See [Provider Hierarchy](../runtime-maps/provider-hierarchy.md) for the nesting rules."
- Filesystem: `docs/raw/architecture/runtime-maps/` contains `state-flow.md`, `data-flow.md`, `build-pipeline.md`, `dependency-graph.md`, `platform-runtimes.md`, `import-resolution.md` — 6 files total.
- `provider-hierarchy.md` is NOT in the runtime-maps directory (the referenced file itself is absent from a populated directory).

**Authority Violated:** Architecture Traceability — runtime-maps populated but not in audit scope; referenced doc missing.

**Recommendation:**
(a) Include `runtime-maps/` in the next audit cycle scope. (b) Confirm `provider-hierarchy.md` exists or remove the reference from `electron.md`. (c) Update the audit scope definition to reflect that runtime-maps are populated.

**Impact:**
An entire layer of architecture documentation (runtime-maps) is unaudited. Integration contracts reference it for critical provider hierarchy rules.

---

### ARCH-ONBOARDING-001

**Category:** Consumer Onboarding Clarity

**Documents Affected:** `integration-contracts/getting-started.md`, `integration-contracts/react.md`

**Severity:** P2

**Pattern Description:**
The Next Steps and Component Architecture sections of `getting-started.md` and `react.md` direct consumers to non-existent architecture documents. Consumers following the onboarding flow encounter dead links for four references that cover critical concepts (theming, localization, component tiers).

**Evidence — `getting-started.md` Next Steps (dead links):**
- `[Theming](../core/theming.md)` — absent
- `[Localization](../core/localization.md)` — absent
- `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` — absent
- `[Component Tiers Runtime Map](../runtime-maps/component-tiers.md)` — absent

**Evidence — `react.md` (dead links):**
- `[Component Documentation](../../feature/components/README.md)` — outside arch corpus
- `[Atoms Guide](../../feature/components/atomic-design/atoms.md)` — outside arch corpus
- `[Atomic Hierarchy Invariant](../invariants/atomic-hierarchy.md)` — absent

**Authority Violated:** Integration Contract — `getting-started.md`, `react.md`

**Recommendation:**
Audit all `Next Steps` and `See Also` links across integration contracts and remove or replace dead links before next consumer-facing documentation release. Placeholder links ("documentation forthcoming") are preferable to links that resolve to 404.

**Impact:**
Onboarding flow is broken at the "what's next" boundary. First-time consumers may abandon integration or miss critical patterns for theming and component tier selection.

---

### ARCH-BOUNDARY-003

**Category:** Boundary Integrity

**Documents Affected:** `core/dependencies.md`

**Severity:** P3

**Pattern Description:**
`dependencies.md` contains an unclosed Markdown code fence in the Beta Dependencies section. The closing triple-backtick for the JSON block is missing, causing the subsequent `## Audit Policy` section heading to be rendered inside the code block in Markdown viewers.

**Evidence:**
- `dependencies.md`, lines 75–81: Opening ` ```json ` present, closing ` ``` ` absent before `## Audit Policy`.

**Authority Violated:** None (formatting defect only)

**Recommendation:**
Add the closing ` ``` ` after the beta dependencies JSON block.

**Impact:**
Rendering defect in documentation viewers. Does not affect architectural correctness.

---

### ARCH-ONBOARDING-002

**Category:** Consumer Onboarding Clarity

**Documents Affected:** `integration-contracts/getting-started.md`, `integration-contracts/react.md`

**Severity:** P3

**Pattern Description:**
The onboarding flow does not include explicit guidance on error boundary integration. `getting-started.md` demonstrates `AppStateHandler` for loading/error/empty states but does not address React Error Boundaries for unexpected render failures. `react.md` includes `<ErrorBoundary>` in one provider composition example without explanation. The pattern appears once but is never documented as a requirement or recommendation.

**Evidence:**
- `react.md`, Provider Composition: `<ErrorBoundary>` appears in a code block with no surrounding explanation.
- No architecture document defines ErrorBoundary as a required consumer concern.

**Authority Violated:** None — informational gap only.

**Recommendation:**
Add a note in `getting-started.md` clarifying that `ErrorBoundary` is a consumer responsibility outside Astra's scope, and that `AppStateHandler` handles async data state errors but not synchronous render failures.

**Impact:**
Minor onboarding gap. Consumers may not know whether Astra provides error boundary support.

---

## 12. Score Improvement Summary

```
Previous Report: None — Baseline audit. No prior report exists.
Previous Score:  N/A
Current Score:   6.45 / 10
Change:          Baseline
```

| Dimension                   | Previous | Current | Change   |
|-----------------------------|----------|---------|----------|
| Invariant Integrity         | —        | 7.5     | Baseline |
| Guidance Completeness       | —        | 6.0     | Baseline |
| Cross-Document Consistency  | —        | 6.0     | Baseline |
| Consumer Onboarding Clarity | —        | 7.0     | Baseline |
| Boundary Integrity          | —        | 6.0     | Baseline |
| Architecture Traceability   | —        | 6.0     | Baseline |

This is the first architecture audit of this corpus. Future audits will compare against this report.

**Score by category — baseline observations:**

- **Invariant Integrity (7.5)**: The six invariants are well-constructed individually. The primary deficit is the missing `stateless-ui.md` invariant and the ERROR state inconsistency.
- **Guidance Completeness (6.0)**: Pulled down by missing `theming.md`, `localization.md`, and `atomic-hierarchy.md`. All other invariants have corresponding guidance.
- **Cross-Document Consistency (6.0)**: Three consistency conflicts found (Node.js exception, useTheme export, ERROR state). Would reach 8.0+ if resolved.
- **Consumer Onboarding Clarity (7.0)**: The three integration contracts provide a functional onboarding path. Dead links and Astra/Prati boundary ambiguity are the limiting factors.
- **Boundary Integrity (6.0)**: ThemeProvider/Prati boundary conflict is the largest single contributor to this score. Well-scored on MVVM and Repository boundaries.
- **Architecture Traceability (6.0)**: Six orphan concept nodes (missing docs). Easily recoverable once the four missing documents are created.

---

## 13. Final Verdict

**Needs Improvement (6.45 / 10)**

The Astra architecture corpus has a strong invariant foundation. All six core invariants are individually rigorous, internally consistent, and provide detection heuristics, severity tiers, and migration guidance. The MVVM, Repository, and Build patterns are clearly defined and correctly implemented across the guidance layer.

The corpus is held back from the Good band by a resolvable documentation gap cluster: four missing documents (`stateless-ui.md`, `atomic-hierarchy.md`, `theming.md`, `localization.md`) create 10+ broken cross-references, leave two concept clusters (stateless-ui rules, Atomic Design tiers) without invariant backing, and break the traceability network at multiple points. A single documentation sprint targeting these four files would close the most impactful findings.

The Astra/Prati library boundary issue (ARCH-BOUNDARY-001) requires an ownership decision — whether ThemeProvider/LanguageProvider belong to Astra (as all architecture docs claim) or to Prati (as the audit context states). This is a governance decision, not a documentation defect, but it must be resolved before the boundary integrity score can improve.

The `platform-abstraction.md` Node.js lazy-load exception (ARCH-CONSISTENCY-001) is a direct authority hierarchy violation and must be resolved either by removing the exception from the guidance doc or by promoting it to the invariant. No guidance document may authorize behavior that its governing invariant prohibits.

**Priority remediation order:**

1. Resolve ARCH-TRACE-001 — create or remove all broken cross-references (highest token impact)
2. Resolve ARCH-CONSISTENCY-001 — remove unauthorized Node.js exception from `platform-abstraction.md`
3. Resolve ARCH-BOUNDARY-001 — governance decision on ThemeProvider/Prati boundary
4. Resolve ARCH-COVERAGE-001 — create `core/theming.md` and `core/localization.md`
5. Resolve ARCH-COVERAGE-002 — create `invariants/atomic-hierarchy.md`
6. Resolve ARCH-INVARIANT-001 — create `invariants/stateless-ui.md`
7. Resolve ARCH-INVARIANT-002 — clarify ERROR state in `state-management.md` and `mvvm-pattern.md`

Addressing items 1–3 alone is estimated to raise the audit score to 7.5–8.0 (Good).

---

## 14. Audit Traceability

| Reference             | Location                                                                           |
|-----------------------|------------------------------------------------------------------------------------|
| Architecture Docs     | `docs/raw/architecture/**`                                                         |
| Invariants            | `docs/raw/architecture/invariants/**`                                              |
| Core Architecture     | `docs/raw/architecture/core/**`                                                    |
| Integration Contracts | `docs/raw/architecture/integration-contracts/**`                                   |
| Runtime Maps          | `docs/raw/architecture/runtime-maps/**` (populated; out of current audit scope)   |
| Audit Report          | `docs/raw/report/architecture/latest/architecture-audit-2026-06-20.md`            |
| Previous Report       | None — Baseline audit                                                              |
| Audit Date            | 2026-06-20                                                                         |
| Auditor Role          | Principal Architect / Architecture Governance Reviewer / Architectural Documentation Auditor |
