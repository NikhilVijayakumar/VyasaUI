# Vyasa UI frontend requirements — draft

## Intent and scope

Provide a desktop interface for the human users of the same Vyasa workspace intelligence product. The shared requirements extend across discovery, configuration, evidence, search, project details and reports, with registry and remote features in their existing later phases. CLI and MCP server behavior remains backend-owned. The first workflow, mockup scope, connection method, and exact operation controls remain open. The existing Electron shell is only a placeholder.

## Knowledge and sources

- [Shared product knowledge](../../../knowledge/shared-vyasa-domain.md)
- [Frontend architecture](../../../knowledge/frontend-architecture.md)
- [Backend coverage map](backend-coverage.md)
- [Local Vyasa requirements baseline](../backend-baseline.md), including its scenarios and grill logs.
- [Astra architecture reference](../../reference/astra/raw/architecture/core/feature-structure.md) and [Prati provider reference](../../reference/prati/raw/architecture/runtime-maps/provider-hierarchy.md).
- [Vyasa product vision](../../../knowledge/product/vision.md)
- [Query requirements](../project-query/requirement.md) — FR-009–012, including proposed decisions.
- [Project profile requirements](../project-profile/requirement.md) — FR-014, FR-026–027.
- [Requirements index](../backend-baseline.md) — discovery, index, security, later phases and open decisions.

Use the local documents as the product baseline and verify actual integration contracts before implementation.

## Candidate behavior — pending interview

| ID | Candidate frontend behavior | Backend relationship |
|---|---|---|
| UI-001 | Present indexed projects and allow a user to find a project using supported search capabilities. | FR-009; exact filters and behavior require confirmed contracts. |
| UI-002 | Present a selected project's details and context, including available evidence and missing or uncertain information. | FR-010, FR-026, FR-027. |
| UI-003 | Present related projects and dependencies with the basis available from the backend. | FR-011–012; backend ranking recommendations remain open. |
| UI-004 | Present index availability and freshness without implying that viewing results triggers a scan. | Local-index and MCP status; exact states need contract confirmation. |
| UI-005 | Distinguish loading, empty, unavailable, partial and error states where the backend supplies them. | Evidence, freshness and error semantics. |
| UI-006 | Make any scan or other state-changing action explicit and accurately communicate its result. | Backend explicit-operations and data-ownership principles; controls and permissions undecided. |
| UI-007 | Support user-facing workspace configuration and communicate discovery outcomes and exclusions. | FR-001, FR-002, FR-015, FR-022. |
| UI-008 | Present supported project profile, file composition, language, marker, framework and report information. | FR-014, FR-021, FR-023–026, FR-028. |
| UI-009 | Present duplicate and obsolete candidates as findings for human review. | FR-020; identity and candidate rules remain backend-owned. |
| UI-010 | Support shared registry and remote discovery workflows as later phases when their backend capabilities are available. | FR-016–019, P2–P3. |

These are candidates for discussion, not approved commitments. Later-phase shared registry and remote discovery are not assumed available in the mockup.

The [UI requirements grill](ui-requirements-grill.md) records detailed recommendations, evidence, and suggested acceptance checks for these candidates and the shared requirements.

## Constraints

The renderer must not fabricate data or turn missing, inaccessible, stale, or unassessed values into false or quality judgments. Repository data is untrusted. Local-only details and credentials must not be exposed to shared services by the frontend. Real integration must use a documented, verified backend interface; the UI must identify mock data when used.

## Acceptance and delivery

Acceptance scenarios and implementation slices will follow the user's decisions. No frontend functional requirement above is claimed implemented by the existing shell.
