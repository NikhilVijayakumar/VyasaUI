# Design System Audit & Validation System v2.0

## Purpose

You are acting as:

* Design Governance Auditor
* Design System Reviewer
* UX Standards Auditor
* Design Quality Auditor

Your responsibility is to audit:

```text
docs/raw/design-system/**
```

The audit evaluates the Design System documentation corpus against itself and against the protected BAVANS vision documents.

The audit determines whether the Design System is:

* complete
* internally consistent
* reusable
* scalable
* accessible
* localization-ready
* feature-design ready

The audit validates documentation only.

It does not validate implementation.

---

# Scope

Audit:

```text
docs/raw/design-system/**
```

Including:

```text
design-system/
├── brand/
├── rules/
└── design.md
```

---

# Protected Documents

The following documents are protected sources of truth:

```text
brand/Bavans – Core Idea & Vision
brand/Bavans – Core Vision & Core Values
```

These documents define:

* product vision
* organizational vision
* core values
* strategic direction

The audit may:

* reference them
* validate alignment against them

The audit must not:

* rewrite them
* modify them
* recommend changes to them

Findings must target downstream documents instead.

---

# Explicit Non-Goals

The audit MUST NOT:

* inspect source code
* inspect mockups
* inspect feature designs
* inspect feature technical documents
* inspect implementation
* validate framework usage
* validate React
* validate MUI implementation
* validate CSS implementation
* validate application-specific UX

Those belong to downstream audits.

---

# Authority Hierarchy

| Level | Authority                          |
| ----- | ---------------------------------- |
| 1     | Bavans – Core Idea & Vision        |
| 2     | Bavans – Core Vision & Core Values |
| 3     | Design Principles                  |
| 4     | Design Rules                       |
| 5     | Design Patterns                    |
| 6     | Design Tokens                      |
| 7     | Design Checklists                  |
| 8     | design.md                          |

Rules:

* Lower-level documents must not contradict higher-level documents.
* Design Rules must support Design Principles.
* Patterns must support Design Rules.
* Tokens must support Patterns.
* design.md must accurately consolidate the Design System.

---

# Core Audit Questions

The audit must answer:

1. Does the Design System align with BAVANS vision?
2. Are design principles clearly defined?
3. Are design rules internally consistent?
4. Are reusable UX patterns defined?
5. Are design tokens complete?
6. Is accessibility fully integrated?
7. Is localization fully integrated?
8. Is the Design System reusable across applications?
9. Is the Design System ready to support Feature Design generation?
10. Does the Design System contain duplication or contradictions?

---

# Audit Phase 1 — Design System Inventory

## Goal

Create authoritative inventory.

---

## Discover

From:

```text
docs/raw/design-system/**
```

Extract:

* Document Name
* Purpose
* Category
* Dependencies

---

## Output

### Document Inventory

| Document | Category | Purpose |
| -------- | -------- | ------- |

---

# Audit Phase 2 — Vision Alignment

## Goal

Validate alignment with protected vision documents.

---

## Validate

### Core Idea Alignment

Does the Design System reflect:

* mission
* purpose
* values

---

### Core Values Alignment

Do design principles reinforce:

* clarity
* quality
* consistency
* accessibility
* usability

---

## Output

### Vision Alignment Findings

```text
Document
Issue
Severity
Impact
```

---

# Audit Phase 3 — Principle Coverage

## Goal

Validate design principles.

---

## Required Areas

### Visual Philosophy

### Interaction Philosophy

### Accessibility Philosophy

### Localization Philosophy

### Layout Philosophy

### Motion Philosophy

### Information Hierarchy Philosophy

### Premium Experience Philosophy

---

## Output

### Principle Coverage Matrix

| Principle | Defined | Referenced | Coverage |
| --------- | ------- | ---------- | -------- |

---

# Audit Phase 4 — Design Rule Validation

## Goal

Validate design rules.

---

## Validate

### Clarity

### Consistency

### Accessibility

### Responsiveness

### Localization

### Visual Hierarchy

### Interaction Standards

### Error Prevention

### Error Recovery

---

## Output

### Design Rule Findings

```text
Rule
Issue
Severity
Impact
```

---

# Audit Phase 5 — UX Pattern Coverage

## Goal

Determine whether reusable UX patterns exist.

---

## Required Patterns

### Forms

### Dialogs

### Drawers

### Tables

### Lists

### Search

### Filters

### Navigation

### Feedback

### Notifications

### Loading States

### Empty States

### Error States

### Confirmation Flows

### Multi-Step Workflows

---

## Output

### Pattern Coverage Matrix

| Pattern | Exists | Coverage |
| ------- | ------ | -------- |

---

# Audit Phase 6 — Token Coverage

## Goal

Validate token completeness.

---

## Required Token Categories

### Color

### Typography

### Spacing

### Elevation

### Motion

### Radius

### Shadows

### Icons

### Layout

---

## Output

### Token Coverage Matrix

| Token Category | Exists | Complete |
| -------------- | ------ | -------- |

---

# Audit Phase 7 — Accessibility Coverage

## Goal

Validate accessibility integration.

---

## Validate

### Keyboard Navigation

### Focus Management

### Screen Reader Support

### Color Contrast

### Motion Accessibility

### Form Accessibility

### Table Accessibility

### Responsive Accessibility

---

## Output

### Accessibility Coverage Matrix

| Area | Covered |
| ---- | ------- |

---

# Audit Phase 8 — Localization Coverage

## Goal

Validate localization readiness.

---

## Validate

### Text Expansion

### RTL Readiness

### Typography Adaptation

### Layout Adaptation

### Date Formatting

### Number Formatting

### Accessibility Impact

---

## Output

### Localization Coverage Matrix

| Area | Covered |
| ---- | ------- |

---

# Audit Phase 9 — Consistency Audit

## Goal

Detect contradictions.

---

## Validate

### Terminology Consistency

### Pattern Consistency

### Rule Consistency

### Token Consistency

### Accessibility Consistency

### Localization Consistency

---

## Output

### Consistency Findings

```text
Documents
Issue
Severity
Recommendation
```

---

# Audit Phase 10 — Duplication Audit

## Goal

Detect duplicate ownership.

---

## Validate

### Duplicate Principles

### Duplicate Rules

### Duplicate Patterns

### Duplicate Tokens

### Duplicate Guidance

---

## Output

### Duplication Matrix

| Concept | Sources |
| ------- | ------- |

---

# Audit Phase 11 — Design System Purity

## Goal

Detect contamination.

---

## Forbidden Content

### Architecture Leakage

Examples:

```text
MVVM
Repository
ViewModel
Service
Dependency Injection
```

Belongs to:

```text
docs/raw/architecture/**
```

---

### Feature Leakage

Examples:

```text
Task Management
Attendance
Project Management
Inventory
```

Belongs to:

```text
docs/raw/feature/**
```

---

### Feature Design Leakage

Examples:

```text
Feature-specific screens

Feature-specific workflows

Feature-specific layouts
```

Belongs to:

```text
docs/raw/feature-design/**
```

---

### Implementation Leakage

Examples:

```text
React

TypeScript

Component code

SQL

CSS implementation
```

Belongs to:

```text
src/**
```

---

## Output

### Purity Findings

Finding ID:

```text
DESIGN-PURITY-{nnn}
```

---

# Audit Phase 12 — Feature Design Readiness

## Goal

Determine whether Feature Design can be generated without inventing UX behavior.

---

## Required Capability Areas

### Forms

### Navigation

### Dialogs

### Drawers

### Tables

### Search

### Filters

### Notifications

### Loading

### Empty States

### Error States

### Responsive Layouts

### Accessibility

### Localization

---

## Output

### Feature Design Readiness Matrix

| Capability | Ready |
| ---------- | ----- |

---

# Required Matrices

## Design Principle Matrix

## Design Rule Matrix

## Pattern Coverage Matrix

## Token Coverage Matrix

## Accessibility Matrix

## Localization Matrix

## Consistency Matrix

## Duplication Matrix

## Purity Matrix

## Feature Design Readiness Matrix

---

# Finding Categories

Use:

```text
DESIGN-ALIGNMENT-{nnn}
DESIGN-PRINCIPLE-{nnn}
DESIGN-RULE-{nnn}
DESIGN-PATTERN-{nnn}
DESIGN-TOKEN-{nnn}
DESIGN-ACCESSIBILITY-{nnn}
DESIGN-LOCALIZATION-{nnn}
DESIGN-CONSISTENCY-{nnn}
DESIGN-DUPLICATION-{nnn}
DESIGN-PURITY-{nnn}
DESIGN-READINESS-{nnn}
```

---

# Severity Model

| Severity   | Meaning                              |
| ---------- | ------------------------------------ |
| Critical   | Feature Design generation impossible |
| Major      | Significant gap or contradiction     |
| Minor      | Documentation weakness               |
| Suggestion | Improvement opportunity              |

---

# Scoring Model

| Dimension                | Weight |
| ------------------------ | ------ |
| Vision Alignment         | 10%    |
| Principle Coverage       | 15%    |
| Rule Quality             | 15%    |
| Pattern Coverage         | 15%    |
| Token Coverage           | 10%    |
| Accessibility Coverage   | 10%    |
| Localization Coverage    | 5%     |
| Consistency              | 10%    |
| Feature Design Readiness | 5%     |
| Design Purity            | 5%     |

---

# Final Assessment

| Score Range | Assessment              |
| ----------- | ----------------------- |
| 9.0–10.0    | Excellent               |
| 7.0–8.9     | Good                    |
| 5.0–6.9     | Needs Improvement       |
| 3.0–4.9     | Major Revision Required |
| 0.0–2.9     | Design System Unsound   |

---

# Output Structure

## Executive Summary

## Documents Audited

## Vision Alignment Report

## Principle Coverage Report

## Design Rule Report

## Pattern Coverage Report

## Token Coverage Report

## Accessibility Report

## Localization Report

## Consistency Report

## Duplication Report

## Purity Report

## Feature Design Readiness Report

## Scoring Breakdown

## Score Improvement Summary

## Findings

## Top 10 Improvements

## Final Verdict

## Audit Traceability

---

# Score Improvement Summary

Compare against the previous report from `docs/raw/report/design-system/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/10
Current Score: Y/10
Change: +N / -N / No change
```

| Dimension                | Previous | Current | Change |
| ------------------------ | -------- | ------- | ------ |
| Vision Alignment         | X        | Y       | +N     |
| Principle Coverage       | X        | Y       | +N     |
| Rule Quality             | X        | Y       | +N     |
| Pattern Coverage         | X        | Y       | +N     |
| Token Coverage           | X        | Y       | +N     |
| Accessibility Coverage   | X        | Y       | +N     |
| Localization Coverage    | X        | Y       | +N     |
| Consistency              | X        | Y       | +N     |
| Feature Design Readiness | X        | Y       | +N     |
| Design Purity            | X        | Y       | +N     |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/design-system/latest/* docs/raw/report/design-system/archive/
mkdir -p docs/raw/report/design-system/latest
```

---

# Output Location

```text
docs/raw/report/design-system/latest/design-system-audit-{timestamp}.md
```

---

# Audit Traceability

| Reference             | Location                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| Design System Docs    | docs/raw/design-system/**                                                 |
| Audit Report          | docs/raw/report/design-system/latest/design-system-audit-{timestamp}.md   |
| Previous Report       | docs/raw/report/design-system/archive/{previous-filename}                 |

---

# Final Rule

The Design System is considered successful only if:

> It provides a complete, consistent, reusable, accessible, localization-ready set of design principles, rules, patterns, and tokens that allow Feature Design documents to be generated without inventing UX standards, interaction behavior, accessibility guidance, or visual conventions.
