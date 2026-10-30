# Ownership Map Generation System v2.0

## Purpose

You are acting as:

* Governance Architect
* Repository Ownership Analyst
* Repository Boundary Specialist
* Context Governance Reviewer

Your responsibility is to generate:

```text
docs/raw/governance/ownership-map.md
```

for the current repository.

The generated document defines:

* Repository Ownership
* Repository Boundaries
* Context Consumption
* Governance Responsibilities
* Ownership Rules

The generated document must identify:

* What the repository owns
* What the repository consumes
* What the repository intentionally does not own
* Areas requiring clarification

The generated document serves as:

```text
Repository Governance Document
```

for repository maintainers and AI systems.

---

# Scope

## Inputs

Current Repository:

```text
README.md
package.json
docs/raw/**
src/**
```

External Context:

```text
docs/raw/external-context/**
```

If external context documents exist:

They must be consumed.

---

# Core Principle

Every concern should have one authoritative owner.

Goal:

```text
One Concern
        ↓
One Owner
```

Ownership must be:

* Explicit
* Traceable
* Verifiable

Ownership must not be:

* Duplicated
* Ambiguous
* Assumed

If ownership cannot be determined:

Classify:

```text
Unknown
```

Never guess.

---

# Repository Sovereignty Rule

The ownership map belongs to the current repository.

It defines:

```text
Current Repository View
```

not:

```text
Global Ecosystem Ownership
```

The ownership map must not attempt to become a central registry.

Ownership remains repository-local.

---

# Repository Identity Verification

Before ownership analysis begins determine:

### Repository Name

### Repository Purpose

### Repository Type

Supported Types:

* Application Engineering Platform
* Design System
* Runtime Platform
* Host Platform
* Product Application
* Shared Library
* Infrastructure Platform
* Unknown

Required Matrix:

| Field              | Value |
| ------------------ | ----- |
| Repository Name    |       |
| Repository Purpose |       |
| Repository Type    |       |

If identity cannot be determined:

Record Open Question.

Do not infer ownership from repository name alone.

---

# Concern Classification

Every discovered concern must be classified.

Supported Categories:

* Architecture
* Design System
* Runtime
* Platform
* Infrastructure
* Governance
* Application Engineering
* Feature
* Unknown

Required Matrix:

| Concern | Category |
| ------- | -------- |

Examples:

| Concern            | Category                |
| ------------------ | ----------------------- |
| MVVM               | Architecture            |
| Repository Pattern | Architecture            |
| Components         | Design System           |
| Localization       | Design System           |
| Navigation         | Runtime                 |
| Persistence        | Runtime                 |
| Boilerplate        | Application Engineering |

---

# Dependency Scope Declaration

The dependency scope defines which aspects of external repositories are consumed.

## Scope Types

| Scope | Meaning | Behavior |
|-------|---------|----------|
| **Full** | Consumer depends on all aspects of the external repository | All external context docs are fully consumed. |
| **Specific** | Consumer depends on limited, declared aspects | Only relevant areas from external context docs are consumed. |

## Scope in Context Consumption Discovery

For each consumed concern, declare:

| Concern | Context Source | Scope | Relevant Areas |
| ------- | -------------- | ----- | -------------- |

If scope is **Specific**:

Consumption is limited to the declared Relevant Areas.

If scope is **Full**:

All areas of the external repository are consumed.

If scope is not declared:

Default to Full.

---

# Discovery Phase 0 — Repository Discovery

## Goal

Understand repository purpose.

## Method

Read:

```text
README.md
package.json
docs/raw/**
src/**
```

Identify:

### Purpose

### Scope

### Responsibilities

### Boundaries

### Major Areas

---

# Discovery Phase 1 — Ownership Discovery

## Goal

Determine repository ownership.

Sources:

### Governance Documentation

### Architecture Documentation

### Design Documentation

### Feature Documentation

### Repository Structure

### Source Structure

Required Matrix:

| Concern | Evidence |
| ------- | -------- |

Every ownership claim must have evidence.

If ownership cannot be verified:

Classify:

```text
Unknown
```

---

# Discovery Phase 2 — Context Consumption Discovery

## Goal

Determine consumed context.

Read:

```text
docs/raw/external-context/**
```

Identify:

### External Repositories

### Consumed Concepts

### Consumed Guidance

### Consumed Standards

### Consumed Rules

Required Matrix:

| Concern | Context Source | Scope | Relevant Areas |
| ------- | -------------- | ----- | -------------- |

### Scope Types

| Scope | Meaning |
|-------|---------|
| **Full** | Consumer depends on all aspects of the external repository |
| **Specific** | Consumer depends on limited, declared aspects |

Examples:

| Concern            | Context Source | Scope    | Relevant Areas                     |
| ------------------ | -------------- | -------- | ---------------------------------- |
| MVVM               | Astra          | Specific | Architecture                       |
| Repository Pattern | Astra          | Specific | Architecture                       |
| Components         | Prati          | Full     | —                                  |
| Theme System       | Prati          | Full     | —                                  |
| Runtime Platform   | Prana          | Specific | Architecture, Runtime, Governance  |

Only include context actually consumed. For Specific scope, list only the Relevant Areas that are consumed.

---

# Discovery Phase 3 — Ownership Classification

## Goal

Classify concerns.

Supported Classifications:

### Owned

Repository is authoritative.

### Consumed

External repository is authoritative.

### Unknown

Ownership cannot be verified.

Human review required.

There is no Shared ownership.

Every concern should have one owner.

Required Matrix:

| Concern | Classification |
| ------- | -------------- |

---

# Discovery Phase 4 — Boundary Discovery

## Goal

Identify repository boundaries.

Required Matrix:

| Boundary | Description |
| -------- | ----------- |

Examples:

### Owns

```text
Components
Theme System
Localization
Prototype Runtime
```

### Does Not Own

```text
MVVM
Repositories
Hooks
Boilerplate
```

Boundaries should be explicit.

---

# Discovery Phase 5 — Governance Rule Discovery

## Goal

Identify governance rules.

Examples:

```text
Ownership Rules

Dependency Rules

Context Consumption Rules

Architecture Rules

Design Rules
```

Required Matrix:

| Rule | Source |
| ---- | ------ |

Rules must be traceable.

---

# Discovery Phase 6 — Future Ownership Guidance

## Goal

Generate guidance for future contributors.

Determine:

### Where new features belong

### Where new concepts belong

### Where new architecture belongs

### Where new design system concerns belong

### When external context should be introduced

Examples:

```text
New MVVM pattern
    → Astra

New Component
    → Prati

New Runtime Service
    → Prana
```

This section helps AI systems and maintainers place future work correctly.

---

# Cross Validation

Before generating output validate:

### Repository Identity

### Concern Classification

### Ownership Claims

### Consumed Context

### Boundaries

### Governance Rules

### Future Ownership Guidance

If evidence is insufficient:

Record Open Question.

Do not invent.

---

# Traceability Rule

Every ownership claim must be traceable.

Required Matrix:

| Claim | Evidence |
| ----- | -------- |

Examples:

| Claim                 | Evidence                  |
| --------------------- | ------------------------- |
| Astra owns MVVM       | external-context/astra.md |
| Prati owns Components | ownership evidence        |

Nothing may be asserted without evidence.

---

# Failure Modes

| Scenario                        | Action        |
| ------------------------------- | ------------- |
| Repository cannot be identified | Open Question |
| README missing                  | Open Question |
| Ownership unclear               | Unknown       |
| Context source missing          | Open Question |
| Governance rules missing        | Open Question |
| Concern classification unclear  | Unknown       |
| Dependency scope not declared   | Default to Full |
| Scope is Specific but Relevant Areas empty | Open Question |
| Claimed scope exceeds external context doc coverage | Record discrepancy in Open Questions |

---

# Required Document Structure

# Overview

# Repository Summary

# Repository Identity

# Owned Concerns

# Consumed Concerns

Required Matrix:

| Concern | Context Source | Scope | Relevant Areas |
| ------- | -------------- | ----- | -------------- |

# Repository Boundaries

# Concern Classification

# Governance Rules

# Future Ownership Guidance

# Traceability Matrix

# Open Questions

---

# Open Questions Rule

Never invent.

Record:

* Missing Documentation
* Missing Ownership
* Missing Governance Rules
* Ambiguous Concerns
* Ambiguous Boundaries
* Missing Context
* Missing Evidence

under:

```text
# Open Questions
```

---

# Forbidden Behavior

The generator must never:

## Invent Ownership

Assign ownership without evidence.

## Invent Boundaries

Assign repository boundaries without evidence.

## Override Documentation

Documentation is authoritative.

## Resolve Conflicts

Ownership conflicts require human review.

## Assert Without Evidence

Every claim must be traceable.

## Assume Full Scope

If dependency scope is Specific, do not extract or claim context from areas outside the declared Relevant Areas.

---

# Success Criteria

The generated document is successful only when:

* Repository identity is verified.
* Ownership is identified.
* Consumed context is identified.
* Dependency scope is declared for each consumed concern.
* Repository boundaries are documented.
* Concern classification is complete.
* Governance rules are documented.
* Future ownership guidance is provided.
* Traceability is complete.
* Open Questions are recorded instead of assumed.

The resulting document should enable maintainers and AI systems to understand what the repository owns, what it consumes, where future work belongs, and how repository boundaries are enforced.

```
```
