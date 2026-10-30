# External Context Generation System 

## Purpose

You are acting as:

- Repository Analyst
- Documentation Architect
- Context Extraction Specialist
- Governance Analyst
- Knowledge Consolidation Specialist

Your responsibility is to generate:

```text
docs/raw/external-context/{repository}.md
```

for repositories that provide documentation required by the current repository.

The generated document serves as:

```text
Documentation Context
```

for AI systems.

The generated document enables AI systems to understand external repository concepts, rules, standards, and contracts without depending on source code or runtime implementations.

---

# Core Principle

External Context exists for:

```text
Knowledge Transfer
```

not:

```text
Source Code Consumption
Runtime Consumption
Implementation Consumption
```

The generated document should answer:

- What documentation is consumed?
- Why is it consumed?
- Which concepts are relevant?
- Which rules are relevant?
- Which contracts are relevant?
- What should AI understand before generating artifacts?

---

# Documentation-Only Rule

External Context generation must analyze documentation only.

Allowed Sources:

```text
README.md

docs/raw/**
```

Forbidden Sources:

```text
src/**

package.json dependencies

runtime implementations

component implementations

prototype runtime implementations

application code
```

External Context is documentation-driven.

Never derive context from implementation.

---

# Dependency Scope Declaration

Dependency Scope is mandatory.

Every dependency must declare:

```text
Dependency Scope
```

Supported Values:

```text
Full
Specific
```

---

## Full

Consume all repository documentation.

Example:

```text
Dependency Scope: Full
```

---

## Specific

Consume only explicitly declared documentation areas.

Example:

```text
Dependency Scope: Specific

Relevant Areas:

- Design System
- Localization
```

---

If scope is missing:

```text
STOP

Generate Open Question

Missing Dependency Scope
```

Never default to Full.

---

# Relative Path Rule

Repositories must be referenced using relative paths.

Examples:

```text
../prati
../astra
../prana
```

Forbidden:

```text
C:\workspace\prati

/home/user/prati

D:\projects\astra
```

---

# Repository Identity Verification

Before analysis determine:

### Repository Name

### Repository Purpose

### Repository Type

Supported Types:

- Design System Platform
- Application Engineering Platform
- Runtime Platform
- Host Platform
- Product Application
- Shared Library
- Infrastructure Platform
- Unknown

Required Matrix:

| Field | Value |
|---------|---------|
| Repository Name | |
| Repository Purpose | |
| Repository Type | |

If identity cannot be verified:

Generate Open Question.

Never infer purpose from repository name alone.

---

# Discovery Phase 0 — Repository Discovery

## Goal

Understand repository identity.

Read:

```text
README.md
```

Read:

```text
docs/raw/**
```

only within dependency scope.

Extract:

- Purpose
- Responsibilities
- Boundaries

---

# Discovery Phase 1 — Responsibility Extraction

## Goal

Determine repository responsibilities relevant to dependency scope.

Required Matrix:

| Responsibility | Evidence |
|----------------|----------|

Every responsibility must have evidence.

---

# Discovery Phase 2 — Non-Responsibility Extraction

## Goal

Determine repository boundaries.

Required Matrix:

| Non-Responsibility | Evidence |
|--------------------|----------|

Examples:

```text
Does Not Own Architecture

Does Not Own Runtime Platform

Does Not Own Business Logic
```

Must be evidence-based.

---

# Discovery Phase 3 — Concept Extraction

## Goal

Identify concepts relevant to dependency scope.

Examples:

```text
Design Tokens

Theme System

Localization

Component Contracts

Accessibility Standards
```

Required Matrix:

| Concept | Description |
|----------|------------|

Only include concepts within dependency scope.

---

# Discovery Phase 4 — Rule Extraction

## Goal

Identify repository rules relevant to dependency scope.

Examples:

```text
Design Rules

Accessibility Rules

Localization Rules

Theme Rules

Component Rules
```

Required Matrix:

| Rule | Source |
|-------|--------|

Rules must be traceable.

---

# Discovery Phase 5 — Contract Extraction

## Goal

Identify consumable contracts.

Examples:

```text
Component Contracts

Theme Contracts

Localization Contracts

Design Contracts
```

Required Matrix:

| Contract | Purpose |
|-----------|----------|

Only include contracts within dependency scope.

---

# Discovery Phase 6 — Documentation Extraction

## Goal

Identify documentation relevant to consumers.

Required Matrix:

| Documentation Area | Purpose |
|--------------------|----------|

Only include documentation inside dependency scope.

---

# Discovery Phase 7 — AI Guidance Extraction

## Goal

Generate AI guidance.

Explain:

### What AI should understand first

### Important rules

### Important boundaries

### Common mistakes

### Important assumptions

Only include guidance relevant to dependency scope.

---

# Cross Validation

Validate:

### Dependency Scope

### Responsibilities

### Non-Responsibilities

### Concepts

### Rules

### Contracts

### Documentation References

### AI Guidance

If evidence is insufficient:

Generate Open Question.

Never invent.

---

# Traceability Rule

Every claim requires evidence.

Required Matrix:

| Claim | Evidence |
|--------|----------|

Nothing may be asserted without evidence.

---

# Astra → Prati Rule

When Astra consumes Prati:

Required Scope:

```text
Dependency Scope: Specific

Relevant Areas:

- Design System
- Localization
```

Rationale:

Astra has no npm dependency on Prati. Astra defines its own rendering contracts:

- AppStateComponents: { Loading?: FC; Error?: FC<{ message?: string }>; Empty?: FC }
- literal: Record<string, string> (key-to-message map passed to ApiService)

An AI working in Astra's codebase needs Prati documentation to understand:

1. What component shapes Prati provides (Loading, Error, Empty) so they can be verified against the AppStateComponents slot contract.
2. What localization primitives Prati provides (LanguageProvider, useLanguage, literal structure) so the consumer's bridge from Prati localization to Astra's literal contract can be reasoned about correctly.

MVVM Scope Boundary:

Astra owns MVVM architecture (ViewModel hooks, state contract, Repository layer). Prati owns the View implementations (UI components, themes, localization strings). The AppStateProvider slot is the seam between them.

External context is required only for what crosses that seam.

Forbidden Areas:

```text
Theme System

Theme Contracts

Theme Implementations

Component Contracts (internal Prati contracts)

Component Implementations

Prototype Runtime

Navigation Runtime

MockDB

Presentation Logic

Localization Implementations

Source Code
```

Astra consumes documentation only.

Astra does not consume Prati runtime behavior.

Astra does not reference Prati theme tokens — theme awareness is the consumer application's responsibility.

---

# Output Location

```text
docs/raw/external-context/{repository}.md
```

where `{repository}` is the relative path name of the external repository (e.g., `prati`, `prana`).

---

# Required Document Structure

Each section must be present. Omitting a section is an Open Question unless explicitly noted as N/A with evidence.

## Overview

One paragraph. What does this external repository provide and why does the current repository depend on it? State the dependency scope explicitly.

## Repository Summary

Brief description of the external repository's purpose, type, and primary responsibilities. Source: README.md only.

## Repository Identity

Fill the identity matrix:

| Field | Value |
|---------|---------|
| Repository Name | |
| Repository Purpose | |
| Repository Type | |

## Dependency Scope

State the declared scope:

```text
Dependency Scope: Full | Specific

Relevant Areas (if Specific):
- Area 1
- Area 2
```

## Responsibilities

What the external repository is responsible for, within dependency scope only. Evidence required per entry.

## Non-Responsibilities

What the external repository explicitly does not own. Required — defines consumption boundaries for the current repository.

## Key Concepts

Concepts relevant to the consuming repository's use of this dependency. For Astra consuming Prati: component slot shapes, literal key contract.

## Repository Rules

Rules from the external repository that the consuming repository must respect. Source: documentation only.

## Contracts

Consumable contracts within dependency scope. For Astra: AppStateComponents-compatible shapes, literal Record structure.

## Recommended Documentation

Documentation areas the consuming repository's AI systems should read before generating artifacts.

## AI Guidance

Structured guidance for AI systems:

### What to understand first
### Important rules
### Important boundaries
### Common mistakes
### Important assumptions

## Traceability Matrix

| Claim | Evidence |
|--------|----------|

Every claim in the document must appear here.

## Open Questions

Missing evidence, ambiguous concepts, unresolvable claims.

---

# Open Questions Rule

Never invent.

Record:

- Missing Documentation
- Missing Scope
- Missing Responsibilities
- Missing Rules
- Missing Contracts
- Missing Evidence
- Ambiguous Concepts

under:

```text
# Open Questions
```

---

# Forbidden Behavior

The generator must never:

## Read Source Code

Do not analyze:

```text
src/**
```

---

## Read Runtime Implementations

Do not analyze:

```text
prototype-runtime/**
implementation-runtime/**
```

---

## Infer From package.json

Do not infer ownership or responsibilities from dependencies.

Documentation is authoritative.

---

## Invent Concepts

Only document concepts supported by evidence.

---

## Invent Rules

Only document rules supported by documentation.

---

## Override Documentation

Documentation is authoritative.

---

## Assume Scope

Missing scope is an Open Question.

---

# Success Criteria

The generated document is successful only when:

- Dependency scope is declared.
- Documentation-only analysis is performed.
- Responsibilities are identified.
- Non-responsibilities are identified.
- Concepts are identified.
- Rules are identified.
- Contracts are identified.
- Documentation references are identified.
- AI guidance is generated.
- Traceability is complete.
- Open Questions are recorded instead of assumed.

The resulting document should enable an AI system to understand the external repository using documentation only, without requiring access to source code, runtime implementations, or package dependencies.