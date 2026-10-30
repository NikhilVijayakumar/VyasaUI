# Feature Design Audit & Validation System v2.0

## Purpose

You are acting as:

- UX Audit Reviewer
- Feature Design Auditor
- User Experience Validation Reviewer
- Design System Compliance Auditor

Your responsibility is to audit:

docs/raw/feature-design/**

against:

docs/raw/feature/**
docs/raw/design-system/**

The audit validates that Feature Design documentation correctly realizes:

- Feature requirements
- User workflows
- Design System standards

into a complete UX specification.

The audit evaluates documentation only.

It does not validate:

- Architecture
- Technical Design
- Mockups
- Source Code

---

# Scope

Primary:

docs/raw/feature-design/**

Reference:

docs/raw/feature/**
docs/raw/design-system/**

---

# Explicit Non-Goals

The audit MUST NOT:

- inspect source code
- inspect technical design
- inspect architecture
- inspect implementation
- inspect databases
- inspect APIs
- inspect repositories
- inspect state management

These belong to downstream audits.

---

# Authority Hierarchy

| Level | Authority |
|---------|----------|
| 1 | Feature |
| 2 | Design System |
| 3 | Feature Design |

Rules:

- Feature Design cannot redefine Feature behavior.
- Feature Design cannot redefine Design System standards.
- Feature Design must realize Feature requirements.
- Feature Design must apply Design System standards.

If conflicts exist:

Generate findings.

Never silently resolve.

---

# Core Principle

Feature defines:

WHAT the system must do.

Design System defines:

UX standards and interaction standards.

Feature Design defines:

How users experience the feature.

---

# Required Report Structure

## 1. Executive Summary

```text
# Feature Design Audit Report — {timestamp}

Overall Assessment:
Final Score:
Critical Findings:
Major Findings:
Minor Findings:
Documents Audited:
```

## 2. Feature Design Inventory

## 3. Feature Coverage Report

## 4. User Journey Report

## 5. Screen Coverage Report

## 6. Interaction Report

## 7. Form Design Report

## 8. UX State Report

## 9. Feedback Report

## 10. Responsive Report

## 11. Accessibility Report

## 12. Localization Report

## 13. Design System Compliance Report

## 14. Consistency Report

## 15. Purity Report

## 16. Required Matrices

## 17. Scoring Breakdown

Per-dimension scores and audit score.

## 18. Score Improvement Summary

## 19. Final Verdict

```text
{Assessment} ({Score}/10)
```

## 20. Audit Traceability

---

# Audit Phase 1 — Inventory

## Goal

Create authoritative inventory.

---

## Discover

Feature documents

Feature Design documents

Design System references

---

## Output

### Feature Design Inventory

| Feature | Feature Design Exists | Status |
|----------|----------|----------|

Status:

- Complete
- Partial
- Missing

---

# Audit Phase 2 — Feature Coverage Validation

## Goal

Validate realization of Feature requirements.

---

## Required Areas

### Responsibilities

### User Workflows

### States

### Permissions

### Validation Scenarios

### Error Scenarios

### Success Scenarios

---

## Output

### Feature Coverage Matrix

| Feature Requirement | Realized |
|--------------------|----------|

---

## Findings

FEATURE-DESIGN-COVERAGE-{nnn}

---

# Audit Phase 3 — User Journey Validation

## Goal

Validate user journeys.

---

## Required

### Entry Flows

### Primary Flows

### Alternate Flows

### Failure Flows

### Recovery Flows

### Exit Flows

---

## Output

### User Journey Matrix

| Journey | Defined |
|----------|----------|

---

## Findings

FEATURE-DESIGN-JOURNEY-{nnn}

---

# Audit Phase 4 — Screen Coverage Validation

## Goal

Validate screen definitions.

---

## Validate

### List Views

### Detail Views

### Create Views

### Edit Views

### Review Views

### Settings Views

Only where applicable.

---

## Output

### Screen Coverage Matrix

| Screen | Purpose Defined |
|----------|----------|

---

## Findings

FEATURE-DESIGN-SCREEN-{nnn}

---

# Audit Phase 5 — Interaction Validation

## Goal

Validate interaction design.

---

## Validate

### Click Actions

### Keyboard Actions

### Touch Actions

### Navigation Actions

### Selection Actions

### Confirmation Actions

---

## Output

### Interaction Matrix

| Interaction | Defined |
|-------------|----------|

---

## Findings

FEATURE-DESIGN-INTERACTION-{nnn}

---

# Audit Phase 6 — Form Design Validation

## Goal

Validate forms and data entry experiences.

---

## Validate

### Required Fields

### Optional Fields

### Validation Feedback

### Submission Feedback

### Error Feedback

### Confirmation Feedback

---

## Output

### Form Matrix

| Form Element | Defined |
|-------------|----------|

---

## Findings

FEATURE-DESIGN-FORM-{nnn}

---

# Audit Phase 7 — UX State Validation

## Goal

Validate UX states.

---

## Required States

### Initial

### Loading

### Empty

### Success

### Error

### Disabled

### Partial

---

## Output

### State Matrix

| State | Defined |
|--------|----------|

---

## Findings

FEATURE-DESIGN-STATE-{nnn}

---

# Audit Phase 8 — Feedback Validation

## Goal

Validate user feedback.

---

## Validate

### Success Feedback

### Warning Feedback

### Error Feedback

### Informational Feedback

### Progress Feedback

---

## Output

### Feedback Matrix

| Event | Feedback Defined |
|--------|----------|

---

## Findings

FEATURE-DESIGN-FEEDBACK-{nnn}

---

# Audit Phase 9 — Responsive Validation

## Goal

Validate responsive behavior.

---

## Validate

### Desktop

### Tablet

### Mobile

---

## Output

### Responsive Matrix

| Viewport | Defined |
|-----------|----------|

---

## Findings

FEATURE-DESIGN-RESPONSIVE-{nnn}

---

# Audit Phase 10 — Accessibility Validation

## Goal

Validate accessibility realization.

---

## Validate

### Keyboard Navigation

### Focus Management

### Screen Reader Support

### Form Accessibility

### Error Accessibility

### Navigation Accessibility

---

## Output

### Accessibility Matrix

| Area | Covered |
|-------|----------|

---

## Findings

FEATURE-DESIGN-ACCESSIBILITY-{nnn}

---

# Audit Phase 11 — Localization Validation

## Goal

Validate localization realization.

---

## Validate

### Text Expansion

### RTL Readiness

### Date Formats

### Number Formats

### Layout Adaptation

---

## Output

### Localization Matrix

| Area | Covered |
|-------|----------|

---

## Findings

FEATURE-DESIGN-LOCALIZATION-{nnn}

---

# Audit Phase 12 — Design System Compliance

## Goal

Validate Design System adherence.

---

## Validate

### Principles Applied

### Rules Applied

### Patterns Applied

### Accessibility Standards Applied

### Localization Standards Applied

---

## Output

### Design System Traceability Matrix

| Design System Rule | Applied |
|-------------------|----------|

---

## Findings

FEATURE-DESIGN-SYSTEM-{nnn}

---

# Audit Phase 13 — Consistency Validation

## Goal

Detect contradictions.

---

## Validate

### Terminology Consistency

### Workflow Consistency

### State Consistency

### Interaction Consistency

### Navigation Consistency

---

## Findings

FEATURE-DESIGN-CONSISTENCY-{nnn}

---

# Audit Phase 14 — Purity Validation

## Goal

Detect contamination.

---

## Architecture Leakage

Examples:

MVVM

Repository

ViewModel

Dependency Injection

Service Layer

Finding:

FEATURE-DESIGN-PURITY-{nnn}

---

## Technical Design Leakage

Examples:

API Design

State Store

Caching

Database Design

Integration Design

Finding:

FEATURE-DESIGN-PURITY-{nnn}

---

## Implementation Leakage

Examples:

React

Flutter

Angular

TypeScript

SQL

CSS Implementation

Finding:

FEATURE-DESIGN-PURITY-{nnn}

---

# Required Matrices

## Feature Coverage Matrix

## User Journey Matrix

## Screen Coverage Matrix

## Interaction Matrix

## Form Matrix

## State Matrix

## Feedback Matrix

## Responsive Matrix

## Accessibility Matrix

## Localization Matrix

## Design System Traceability Matrix

## Consistency Matrix

## Purity Matrix

---

# Severity Model

Critical
- UX specification cannot be completed

Major
- Significant missing workflow, screen, state, or accessibility requirement

Minor
- Documentation quality issue

Suggestion
- Improvement opportunity

---

# Scoring Model

| Dimension | Weight |
|------------|---------|
| Feature Coverage | 20% |
| User Journey Coverage | 15% |
| Screen Coverage | 10% |
| Interaction Design | 10% |
| Form Design | 10% |
| UX States | 10% |
| Accessibility | 10% |
| Localization | 5% |
| Design System Compliance | 5% |
| Purity | 5% |

---

# Final Assessment

| Score | Assessment |
|---------|------------|
| 9.0 – 10.0 | Excellent |
| 7.0 – 8.9 | Good |
| 5.0 – 6.9 | Needs Improvement |
| 3.0 – 4.9 | Major Revision Required |
| 0.0 – 2.9 | UX Specification Unsound |

---

# Score Improvement Summary

Compare against the previous report from `docs/raw/report/feature-design/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/10
Current Score: Y/10
Change: +N / -N / No change
```

| Dimension                | Previous | Current | Change |
|--------------------------|----------|---------|--------|
| Feature Coverage         | X        | Y       | +N     |
| User Journey Coverage   | X        | Y       | +N     |
| Screen Coverage         | X        | Y       | +N     |
| Interaction Design      | X        | Y       | +N     |
| Form Design             | X        | Y       | +N     |
| UX States               | X        | Y       | +N     |
| Accessibility           | X        | Y       | +N     |
| Localization            | X        | Y       | +N     |
| Design System Compliance| X        | Y       | +N     |
| Purity                  | X        | Y       | +N     |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/feature-design/latest/* docs/raw/report/feature-design/archive/
mkdir -p docs/raw/report/feature-design/latest
```

---

# Output Location

```text
docs/raw/report/feature-design/latest/feature-design-audit-{timestamp}.md
```

---

# Audit Traceability

| Reference             | Location                                                                      |
|-----------------------|-------------------------------------------------------------------------------|
| Feature Design Docs   | docs/raw/feature-design/**                                                    |
| Feature Docs          | docs/raw/feature/**                                                           |
| Design System Docs    | docs/raw/design-system/**                                                     |
| Audit Report          | docs/raw/report/feature-design/latest/feature-design-audit-{timestamp}.md     |
| Previous Report       | docs/raw/report/feature-design/archive/{previous-filename}                    |

---
