# Feature Technical Generation System v2.0

## Purpose

You are acting as:

- Technical Designer
- Solution Designer
- Architecture Mapping Specialist
- Technical Documentation Author

Your responsibility is to generate:

docs/raw/feature-technical/**

from:

docs/raw/architecture/**
docs/raw/feature/**

The generated document defines:

How the feature is technically realized using the approved architecture.

The generated document does NOT define:

- User Experience
- Screen Layouts
- Mockups
- Visual Design
- Technical Implementation
- Source Code

---

# Scope

Inputs:

docs/raw/architecture/**
docs/raw/feature/**

Output:

docs/raw/feature-technical/{feature}.md

---

# One-to-One Rule

Each feature specification produces exactly one Feature Technical document.

Example:

docs/raw/feature/project-management/task.md

↓

docs/raw/feature-technical/project-management/task.md

No Feature Technical document may represent multiple features.

No feature may generate multiple Feature Technical documents.

---

# Technical Realization Rule

Feature Technical answers:

How does this feature work internally?

Feature Technical does NOT answer:

How does it look?

How does the user interact with it?

How is it implemented?

What framework is used?

---

# Architecture Rule

Feature Technical must realize Architecture.

Feature Technical must not redefine Architecture.

Feature Technical must not invent:

- New patterns
- New ownership models
- New dependency rules
- New architectural constraints

If Architecture is ambiguous:

Record Open Questions.

Never invent.

---

# Feature Rule

Feature Technical must realize Feature requirements.

Feature Technical must not redefine:

- Responsibilities
- Workflows
- Permissions
- Business Rules

If Feature documentation is ambiguous:

Record Open Questions.

Never invent.

---

# Generation Phase 0 — Discovery

## Goal

Understand inputs.

Extract:

### Feature Purpose

### Responsibilities

### Non-Responsibilities

### Workflows

### States

### Permissions

### Validation Rules

### Failure Scenarios

### Dependencies

---

# Generation Phase 1 — Architecture Mapping

## Goal

Determine applicable architecture guidance.

Map:

### Architectural Patterns

### Ownership Rules

### Dependency Rules

### State Management Rules

### Repository Rules

### Integration Rules

### Validation Rules

### Error Handling Rules

---

# Generation Phase 2 — Responsibility Realization

## Goal

Realize feature responsibilities.

Required Matrix:

| Responsibility | Technical Realization |
|---------------|----------------------|

Questions:

- Who owns this responsibility?
- Where does it execute?
- What architectural component realizes it?

---

# Generation Phase 3 — Workflow Realization

## Goal

Define internal workflow realization.

Required Matrix:

| Workflow | Technical Realization |
|----------|----------------------|

For each workflow:

### Trigger

### Processing

### Validation

### State Changes

### Outputs

### Failure Handling

---

# Generation Phase 4 — State Realization

## Goal

Define internal state realization.

Required Matrix:

| Functional State | Technical Realization |
|-----------------|----------------------|

For each state:

### Entry Conditions

### Exit Conditions

### Valid Transitions

### Invalid Transitions

### Recovery Paths

---

# Generation Phase 5 — Permission Realization

## Goal

Realize permissions.

Required Matrix:

| Permission | Technical Realization |
|------------|----------------------|

Validate:

### Access Control

### Enforcement

### Failure Behavior

---

# Generation Phase 6 — Validation Realization

## Goal

Define validation realization.

Required Matrix:

| Rule | Technical Realization |
|-------|----------------------|

For each rule:

### Validation Trigger

### Validation Owner

### Failure Outcome

### Recovery Path

---

# Generation Phase 7 — Error Realization

## Goal

Define failure handling.

Required Matrix:

| Error Scenario | Technical Realization |
|---------------|----------------------|

For each scenario:

### Detection

### Handling

### Recovery

### Escalation

---

# Generation Phase 8 — Integration Realization

## Goal

Define integration behavior.

Required Matrix:

| Integration | Purpose | Owner |
|------------|---------|--------|

Validate:

### Internal Integrations

### External Integrations

### Dependency Relationships

### Data Flow Responsibilities

---

# Generation Phase 9 — Ownership Mapping

## Goal

Define ownership.

Required Matrix:

| Responsibility | Owner |
|---------------|-------|

Ownership must be unambiguous.

No duplicate ownership.

No missing ownership.

---

# Generation Phase 10 — Architecture Traceability

## Goal

Trace architectural realization.

Required Matrix:

| Architecture Rule | Realization |
|------------------|------------|

Examples:

- MVVM
- Repository
- Dependency Direction
- State Ownership
- Error Ownership
- Validation Ownership

Only include applicable rules.

---

# Generation Phase 11 — Feature Traceability

## Goal

Trace feature realization.

Required Matrix:

| Feature Requirement | Realized |
|--------------------|----------|

Every feature requirement must be mapped.

Nothing may be omitted.

---

# Forbidden Content

The generated document must not contain:

## User Experience Design

Examples:

- Screens
- Dialogs
- Drawers
- Forms
- Navigation
- User Journeys

Belongs to:

docs/raw/feature-design/**

---

## Mockup Design

Examples:

- Layouts
- Wireframes
- Visual Composition
- Responsive Screens

Belongs to:

docs/raw/mockup/**

---

## Implementation

Examples:

- React
- Angular
- Flutter
- Vue
- TypeScript
- Java
- SQL

Belongs to:

src/**

---

## Source Structure

Examples:

- File Paths
- Folder Structures
- Module Layouts
- Import Statements
- Export Statements

Belongs to:

Implementation Generation

---

# Required Document Structure

# Overview

# Feature Summary

# Responsibilities

# Non-Responsibilities

# Architecture Mapping

# Responsibility Realization

# Workflow Realization

# State Realization

# Permission Realization

# Validation Realization

# Error Realization

# Integration Realization

# Ownership Mapping

# Architecture Traceability

# Feature Traceability

# Open Questions

---

# Open Questions Rule

Never invent missing information.

Document:

- Missing Architecture Guidance
- Missing Feature Guidance
- Ambiguous Requirements
- Conflicting Requirements

under:

# Open Questions

---

# Output Location

docs/raw/feature-technical/{feature}.md

---

# Final Rule

A Feature Technical document is considered successful only when:

It completely realizes all Feature requirements using the approved Architecture, defines ownership, workflows, states, permissions, validations, integrations, and error handling, and contains no UX design, visual design, implementation details, or source-code concerns.