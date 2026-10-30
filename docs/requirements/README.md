# Vyasa UI requirements

This is the frontend requirements baseline for the same Vyasa product. Vyasa's product and domain requirements apply across the system; the backend owns its implementation and contracts, while this repository specifies the human-facing interactions. CLI and MCP server behavior belongs to the backend. The [coverage map](frontend/backend-coverage.md) traces every backend functional area to its frontend relevance. The [frontend package](frontend/requirement.md) and [grill log](frontend/grill-log.md) are drafts; they do not imply a backend capability has been implemented or a user decision has been made.

The [Vyasa requirements index](backend-baseline.md) and local requirement packages provide the shared baseline, including scenarios, grill logs, phase labels and decisions. They describe backend responsibilities where they specify CLI, MCP, storage or implementation internals. Adapt the human-facing parts into frontend scenarios rather than treating those internals as UI requirements. This repository maintains these documents independently.

Workflow: consult [shared knowledge](../../knowledge/index.md), grill the intended user workflows, specify an agreed slice in OpenSpec, then implement and verify it. Keep mockup-only behavior visibly distinct from connected behavior.

The [design-system grill](design-system/grill-log.md) records recommendations and decisions awaiting review.
The [knowledge grill](knowledge-grill.md) reviews shared product concepts and the Astra/Prati dependency boundaries.
The [UI requirements grill](frontend/ui-requirements-grill.md) reviews the product requirements as user workflows and records proposed acceptance checks.
