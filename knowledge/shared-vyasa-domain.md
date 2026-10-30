---
type: Concept
title: Shared Vyasa domain
description: Shared product principles and the boundary between Vyasa and its desktop interface.
status: draft
tags: [vyasa, frontend, domain, provenance]
sources:
  - id: vision
    title: Vyasa product vision
    resource: /product/vision.md
---

# Shared product

Vyasa helps people and coding agents discover and understand projects across workspaces. The desktop interface serves human users of the same product; Vyasa's backend owns discovery, indexing, query semantics, evidence, and project identity. The frontend presents supported results and offers user interactions without becoming a separate authority for those facts.

# Trust and data

Vyasa is local-first and evidence-based. Detected and declared information, unknown values, inaccessible sources, and stale observations have distinct meanings. A UI must not turn missing evidence into a negative claim or imply that a detected file proves quality. Project-owned content remains owned by its repository. Queries read the index; scanning and other side effects are separate operations. Local paths and credentials remain local under the backend's privacy rules.

# Evolution

The backend roadmap begins with local workspace intelligence, then plans shared registry synchronization and remote discovery. Those later phases are product direction, not proof that their functions exist. Backend documents and implementation are authoritative for their actual availability and contracts.

# Source and ownership

This is a frontend-oriented summary of the shared product knowledge stored in this bundle. Backend recommendations and unresolved decisions must not be presented as confirmed behavior.
