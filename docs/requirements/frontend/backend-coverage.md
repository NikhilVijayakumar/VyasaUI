# Backend requirements coverage in Vyasa UI

Baseline: [Vyasa functional requirement index](../functional-requirements.md). This map captures frontend relevance, not approved screen designs or a claim of implementation. Follow the local requirement packages for exact scenarios, ownership, and confirmed versus proposed decisions.

| Backend IDs | Shared capability | Frontend relevance | Backend owns |
|---|---|---|---|
| FR-001, 002, 015, 022 | Workspace configuration, discovery, reporting and ignore rules | Configure and review discovery, present outcomes and warnings; interaction scope needs grilling. | Traversal, eligibility, ignore semantics, scan and reporting rules. |
| FR-003, 020 | Identity and duplicate or obsolete candidates | Identify projects consistently and present candidates for human review. | Identity, matching and candidate rules. |
| FR-004–006 | Metadata, standards, evidence and unknowns | Display detected and declared facts, evidence and uncertainty accurately. | Detectors, provenance and observation statuses. |
| FR-007–008 | Local index and incremental refresh | Show index state and supported refresh actions and outcomes. | Storage, freshness, incremental work and concurrency. |
| FR-009–012 | Search, details, related projects and dependencies | Search and navigate project context, relationships and supporting evidence. | Query semantics, ranking, pagination and data coverage. |
| FR-013 | MCP server | Backend-only server and tool contract; frontend transport remains undecided. | MCP server lifecycle and tool contracts. |
| FR-014, 026 | Project profile lifecycle and profile | Present available profile information, draft versus canonical, and validation results where supported. | Profile format, validation, reading and draft rules. |
| FR-027 | Agent-oriented project context | Show useful context and findings if supported by the UI workflow. | Agent-facing response and CLI behavior. |
| FR-016–017 | Shared registry and cross-device visibility, P2 | Future interfaces for synchronization and visibility. | Registry ownership, synchronization and privacy. |
| FR-018–019 | Remote discovery and inspection, P3 | Future controls and results for authorized remote scopes. | Provider access, credentials, discovery and inspection. |
| FR-021, 023–025 | File composition, languages, markers, frameworks | Present supported observations and limitations, including OpenSpec and OKF detection. | Counting and detection rules. |
| FR-028 | Project report | Present or offer reports when supported; format and interactions need grilling. | Report content and generation contract. |

The backend also owns CLI commands and implementation details such as SQLite schema and detector internals. Frontend requirements inherit applicable product-wide privacy, evidence and non-destructive principles, then add accessibility, interaction, desktop lifecycle and presentation requirements. P2/P3 describe product direction, not current availability.
