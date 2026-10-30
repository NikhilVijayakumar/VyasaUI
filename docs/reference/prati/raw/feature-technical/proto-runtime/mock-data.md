# Mock Data: Feature Technical

## 1. Technical Overview

`MockData` is a proto-runtime subsystem that provides typed dataset definitions for interactive application prototypes. It defines mock data schemas, loading mechanisms, and runtime access patterns that enable realistic prototype behavior without backend services. Mock Data is consumed by prototype boilerplate initialization and by presentation components during prototype execution.

## 2. Feature Summary

| Attribute | Value |
|---|---|
| Module | Proto Runtime — Mock Data |
| Primary Concern | Typed dataset definitions for prototype scenarios |
| Consumers | Prototype initializer, presentation components, workflow simulation |
| Dependencies | Proto Runtime — Boilerplate, Persistence |

## 3. Responsibilities

- Define mock dataset schemas with typed records and collections
- Provide default mock data loaders for common prototype scenarios
- Support relationships between mock data entities (foreign key references)
- Enable scenario-based dataset switching (e.g., happy path, edge case, empty state)
- Integrate with persistence layer for read/write simulation
- Support randomized and parameterized data generation for dynamic prototypes

## 4. Non-Responsibilities

- Runtime data validation beyond type checking
- Backend API simulation or network request mocking
- Production data migration or seeding
- Authentication or authorization of data access

## 5. Architecture Mapping

| Architecture Document | Realization |
|---|---|
| Atomic Hierarchy | Mock data is data, not UI — consumed by ViewModel and organism layers |
| Stateless UI | Mock data loaders are idempotent; mutation state managed by persistence layer |
| Theme Sovereignty | Mock data is presentation-independent |
| Localization Invariant | Mock data records may carry string content; locale-specific datasets are consumer-managed |
| Provider Hierarchy | Mock data initializer runs at app bootstrap, outside provider hierarchy |
| MVVM | Mock data definitions serve as ViewModel data sources, not View logic |
| Documented Exception | No exceptions anticipated |

## 6. Responsibility Realization

| Responsibility | Technical Realization |
|---|---|
| Dataset schema definitions | TypeScript interfaces in `src/proto/mock-data/schemas/` with typed collections |
| Default data loaders | Async loader functions returning `Promise<MockDataRecord[]>` with configurable delay |
| Entity relationships | Foreign key via `ref: string` fields; resolver utilities for cross-collection lookups |
| Scenario switching | `MockScenario` type with pre-built scenarios; `setScenario(name)` at runtime |
| Persistence integration | `MockDataStore` wraps in-memory store with `load()`/`save()` compatible with persistence layer |
| Randomized generation | `faker`-based generators seeded per prototype session for reproducible randomness |

## 7. Workflow Realization

| Workflow | Realization |
|---|---|
| Bootstrap: load default mock data | `MockDataInitializer` called by prototype boilerplate at startup |
| Runtime: access data by key | `mockDataStore.get<T>(collection, key)` — synchronous after init |
| Scenario: switch dataset | `mockDataStore.setScenario("edge-case")` — re-loads all collections |
| Mutation: create/update/delete | `mockDataStore.create<T>()`, `update<T>()`, `delete<T>()` — delegates to persistence |

## 8. State Realization

| Functional State | Technical Realization |
|---|---|
| Uninitialized | No data loaded; access returns `null` |
| Loading | Async load in progress; loader returns `Promise` |
| Loaded | All collections populated; synchronous access available |
| Scenario-switching | Current data cleared; new scenario load in progress |
| Error | Load failure; store returns error state with last known data |

## 9. Permission Realization

Mock data is accessible to all prototype consumers without permission enforcement. Not applicable to prototype context.

## 10. Validation Realization

| Check | Mechanism |
|---|---|
| Schema conformance | TypeScript compile-time checking for typed collections |
| Required fields | `Required<T>` on schema types for mandatory columns |
| Foreign key validity | Runtime check on `resolve()` — warns on dangling refs |
| Scenario completeness | Validation on `setScenario()` — warns if expected collections missing |

## 11. Error Realization

| Condition | Behavior |
|---|---|
| Collection not found | Returns empty array; logs debug warning |
| Invalid scenario name | Falls back to default scenario; logs warning |
| Loader timeout | Returns partial data; logs error |
| Foreign key resolution failure | Returns `null` for unresolvable ref; logs debug warning |

## 12. Integration Realization

| Integration | Mechanism |
|---|---|
| Prototype Boilerplate | `MockDataInitializer` called during app bootstrap sequence |
| Persistence | `MockDataStore` provides `export()`/`import()` for snapshot persistence |
| Presentation components | Data access via `useDataState()` with mock data source |
| Workflow simulation | `MockDataStore` reset on workflow step transitions |

## 13. Ownership Mapping

| Artifact | Owner |
|---|---|
| `src/proto/mock-data/` directory | Proto Runtime team |
| Schema type definitions | Proto Runtime team |
| Mock data loaders | Proto Runtime team |
| Scenario definitions | Design team / prototype author |
| Test fixtures | Proto Runtime team |

## 14. Architecture Traceability

| Architecture Rule | Compliance | Rationale |
|---|---|---|
| Atomic Hierarchy | Full | Data layer — no UI coupling |
| Stateless UI | Full | Loaders are pure; mutation delegated to persistence |
| Theme Sovereignty | Full | No theme dependency |
| Localization Invariant | Full | String data is consumer responsibility |
| Provider Hierarchy | Full | Initializes before providers mount |
| MVVM | Full | Serves ViewModel, not View |

## 15. Feature Traceability

| Feature Spec Reference | Coverage |
|---|---|
| Mock Data dataset schemas | Covered (section 6) |
| Mock Data loading | Covered (section 7) |
| Mock Data relationships | Covered (section 6) |
| Mock Data scenarios | Covered (section 7) |
| Mock Data persistence integration | Covered (section 12) |
| Mock Data error handling | Covered (section 11) |

## 16. Open Questions

- Should mock data support lazy-loaded collections for large datasets?
- Should scenario definitions be extensible by prototype authors at runtime?
- Should mock data include file/blob storage simulation?
- What is the maximum expected dataset size before virtualization is required?

## 17. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
