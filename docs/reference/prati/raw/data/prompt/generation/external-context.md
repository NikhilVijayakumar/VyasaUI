# External Context Generation — {Source} for {Target}

## Purpose

{Target} depends on {Source} for **architecture awareness only**.

{Target} does NOT have a technical or implementation dependency on {Source}. The relationship exists so that {Target}'s AI systems understand the architectural patterns, invariants, and concepts defined in {Source} to produce artifacts that are architecturally consistent.

The generated document serves as:

```text
docs/raw/external-context/{source}.md
```

and enables AI systems to make informed **back-references** to {Source} documentation using relative paths when creating architecture-aware content.

---

## Core Principle

External Context exists for:

```text
Knowledge Transfer
```

not:

```text
Implementation Reference
Runtime Consumption
Boilerplate Source
API Surface Consumption
```

The generated document should answer:

- What architectural patterns does {Source} define?
- What architectural invariants must be preserved?
- What concepts does {Source} own?
- How should {Target} reference {Source} in its own documentation?
- What should AI systems understand before creating architecture-aware artifacts?

---

## Documentation-Only Rule

External Context generation must analyze documentation only. {Target} has no technical dependency on {Source}, so source code consumption is neither required nor permitted.

Allowed Sources:

```text
{source}/README.md
{source}/docs/raw/**
```

Forbidden:

```text
{source}/src/**
{source}/node_modules/**
{source}/test/**
```

---

## Dependency Scope Declaration

```text
Dependency Scope: Specific
Relevant Areas:
  - Architecture Patterns
  - Architectural Invariants
```

Impact on Discovery Phases:

| Phase | Behavior |
|-------|----------|
| Phase 0 — Repository Discovery | Full scan for identity and purpose. Documentation scan limited to Relevant Areas. |
| Phase 1 — Architecture Pattern Extraction | Full extraction within scope. |
| Phase 2 — Architectural Invariant Extraction | Full extraction within scope. |
| Phase 3 — Documentation Source Mapping | Only documentation from Relevant Areas. |

---

## Repository Identity Verification

| Field              | Value |
|--------------------|-------|
| Repository Name    |       |
| Repository Purpose |       |
| Repository Type    |       |

Supported Types: Application Engineering Platform, Design System, Runtime Platform, Host Platform, Product Application, Shared Library, Infrastructure Platform, Unknown.

If identity cannot be determined: Record Open Question. Do not infer purpose from repository name alone.

---

## Discovery Phase 0 — Repository Discovery

### Goal

Understand {Source}'s identity and purpose.

Read:

```text
{source}/README.md
{source}/docs/raw/architecture/**
```

Extract:

- Purpose
- Responsibilities
- Boundaries

Documentation scan is limited to architecture areas per Dependency Scope.

---

## Discovery Phase 1 — Architecture Pattern Extraction

### Goal

Extract {Source}'s architecture patterns relevant to {Target}.

Required Matrix:

| Pattern | Description | Key Concepts |
|---------|-------------|--------------|

Each pattern must include:

- **Description**: What the pattern provides
- **Key Concepts**: Important types, abstractions, or structural elements
- **Documentation Source**: Which {Source} document defines this pattern

---

## Discovery Phase 2 — Architectural Invariant Extraction

### Goal

Extract {Source}'s architectural invariants.

Required Matrix:

| Invariant | Purpose | Key Rule |
|-----------|---------|----------|

Each invariant must include:

- **Purpose**: Why this invariant exists
- **Key Rule**: The rule that must not be violated
- **Documentation Source**: Which {Source} document defines this invariant

---

## Discovery Phase 3 — Documentation Source Mapping

### Goal

Map {Source} documentation areas that {Target} should reference.

Required Matrix:

| Documentation Area | Purpose | Common Reference Scenarios |
|--------------------|---------|---------------------------|

Examples:

```text
architecture/core/mvvm-pattern.md
architecture/core/state-management.md
architecture/invariants/*
```

Only include areas relevant to architectural awareness.

---

## Documentation Summary Rule

Every evidence reference must include a 1-3 sentence summary of what the original document says. The summary must capture the document's core content and key rules, not merely restate its title.

Good:

```text
| Claim | Evidence | Documentation Summary |
|-------|----------|----------------------|
| MVVM separation rules | ../{source}/docs/raw/architecture/invariants/mvvm-separation.md lines 6-8, 20-75 | Defines strict 3-layer separation: View is pure presentation (no data fetching), ViewModel orchestrates state (no JSX), Repository handles data access (no presentation logic). Each layer has may/may-not rules with forbidden patterns and detection heuristics. |
```

Bad:

```text
| Claim | Evidence | Documentation Summary |
|-------|----------|----------------------|
| MVVM separation rules | mvvm-separation.md | Documents MVVM separation |
```

---

## Relative Path Rule

Every document reference must use a relative path from {Target}'s workspace root to the source file:

```text
Good:   ../{source}/docs/raw/architecture/core/state-management.md
Bad:    docs/raw/architecture/core/state-management.md
Bad:    core/state-management.md
Bad:    state-management.md
```

Bare filenames or repo-relative paths without the `../{source}/` prefix will cause an LLM to search locally in {Target}'s repo and find nothing. Always prefix with `../{source}/` for {Source} references.

The generated context must remain portable across Windows, Linux, and macOS. Absolute paths are forbidden.

---

## Traceability Rule

Every claim requires evidence from the source with a summary of what the source says.

Required Matrix (3 columns):

| Claim | Evidence | Documentation Summary |
|-------|----------|----------------------|
| {Claim} | ../{source}/docs/raw/architecture/{path} | {1-3 sentence summary of the source document's content} |

Nothing may be asserted without evidence.

---

## Output Location

```text
docs/raw/external-context/{source}.md
```

---

## Required Document Structure

Each section must be present and must end with a `### Source Documentation` subsection containing a table of original source documents and their summaries.

### Overview

One paragraph. What {Source} provides and why {Target} depends on it for architecture awareness.

### Repository Summary

Purpose, type, responsibilities from README.md.

### Dependency Scope

Declared scope and relevant areas.

### Architecture Patterns

Key patterns extracted from architecture docs with key concepts.

### Architectural Invariants

All invariants with purpose and key rules.

### Key Concepts

Important concepts defined by {Source}.

### Recommended Documentation

Documentation areas {Target} should reference when producing architecture-aware content. Each entry must include the relative path (`../{source}/...`) and what it covers.

### AI Guidance

#### What to understand first

#### Important rules

#### Important boundaries

#### Common mistakes

### Traceability Matrix

| Claim | Evidence | Documentation Summary |
|-------|----------|----------------------|

### Open Questions

---

## Cross Validation

Before generating output, validate:

- Repository identity is verified
- Dependency scope is declared
- Extracted patterns match documentation
- Invariant rules are internally consistent
- Every evidence path uses the `../{source}/` prefix (never bare filenames)
- Every major section has a `### Source Documentation` table with document paths and summaries
- Documentation summaries are substantive (1-3 sentences), not tautological

If evidence is insufficient: Record Open Question. Never invent.

---

## Failure Modes

| Scenario | Action |
|----------|--------|
| Repository path invalid | Stop and report |
| README missing | Open Question |
| docs/raw missing | Partial generation |
| Architecture documentation unavailable | Open Question |
| Repository type unknown | Unknown |
| Dependency scope not declared | Default to Full |

---

## Forbidden Behavior

The generator must never:

- **Read source code**: `../{source}/src/**` is forbidden. {Target} has no technical dependency on {Source}.
- **Read test files**: `../{source}/test/**` is forbidden.
- **Extract API surface**: {Target} does not consume {Source} exports or runtime types.
- **Extract boilerplate code**: {Target} does not replicate {Source} implementation patterns.
- **Extract integration or runtime patterns**: {Target} does not integrate with {Source} at runtime.
- **Invent patterns**: Only document patterns supported by {Source} documentation.
- **Override documentation**: Documentation is authoritative.
- **Assume Full Scope when Specific**: Restrict extraction to declared Relevant Areas.

---

## Open Questions Rule

Never invent. Record:

- Missing Documentation
- Missing Dependency Scope
- Ambiguous Concepts
- Ambiguous Invariants
- Missing Evidence

under:

```text
### Open Questions
```

---

## Success Criteria

The generated document is successful only when:

- Repository identity is verified
- Dependency scope is declared
- Architecture patterns are extracted with key concepts
- Architectural invariants are documented with rules
- Key concepts are documented
- AI guidance is actionable
- Traceability is complete (3-column matrix with documentation summaries)
- All evidence paths use `../{source}/` prefix (no bare filenames)
- Every major section has a `### Source Documentation` table with document paths and summaries
- Documentation summaries are substantive (1-3 sentences), not tautological
- Open Questions are recorded instead of assumed

The resulting document should enable an AI system with no prior knowledge of {Source} to understand its architectural patterns and invariants, and to produce documentation with correct relative-path back-references.
