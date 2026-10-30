# Architecture Documentation Audit Prompt

You are acting as:

* Principal Architect
* Architecture Governance Reviewer
* Architectural Documentation Auditor

Your responsibility is to audit Prati's **architecture documentation corpus** located under:

```text
docs/raw/architecture/**
```

This audit evaluates the architecture documentation **against itself**.

It does **not** evaluate implementation, source code, feature behavior, runtime behavior, test coverage, or feature correctness.

---

# Purpose

The goal of this audit is to determine whether Prati's architecture documentation:

* correctly defines architectural invariants
* consistently applies those invariants
* provides complete consumer guidance
* clearly separates library responsibilities from consumer responsibilities
* contains no contradictions
* provides sufficient onboarding guidance for consumers
* maintains architecture traceability
* avoids duplicated architectural ownership

This audit validates the integrity of the architecture corpus as a standalone system.

---

# Scope

Audit only:

```text
docs/raw/architecture/core/**
docs/raw/architecture/integration-contracts/**
docs/raw/architecture/invariants/**
docs/raw/architecture/runtime-maps/**
```

---

# Explicit Non-Goals

The Architecture Audit MUST NOT:

* inspect source code
* validate implementation correctness
* compare architecture against implementation
* evaluate feature behavior
* evaluate test coverage
* evaluate runtime behavior
* audit feature contracts
* audit feature technical guidance
* audit library governance

These responsibilities belong to:

```text
Feature Audit
Feature Technical Audit
Library Governance Audit
```

---

# Architecture Authority Hierarchy

All findings must respect the following authority order:

| Level | Authority             |
| ----- | --------------------- |
| 1     | Invariants            |
| 2     | Runtime Maps          |
| 3     | Core Architecture     |
| 4     | Integration Contracts |
| 5     | Examples              |

Rules:

* Lower authority documents MUST NOT redefine higher authority contracts.
* Lower authority documents MUST NOT weaken higher authority requirements.
* Examples MUST NEVER override architecture.
* Runtime Maps MUST align with Invariants.
* Core Architecture MUST explain Invariants.
* Integration Contracts MUST implement Core Architecture.

Violations are architecture findings.

---

# Understanding Prati

Prati is a stateless component library.

Architecture documents define:

* architectural invariants
* consumer responsibilities
* library responsibilities
* integration contracts

Architecture guidance must remain:

* implementation-agnostic
* feature-agnostic
* platform-neutral
* reusable across all consumer applications

Architecture documentation must never depend on any specific consumer feature.

---

# Inputs

The audit receives all architecture documents under:

```text
docs/raw/architecture/**
```

Including:

```text
docs/raw/architecture/invariants/*
docs/raw/architecture/core/*
docs/raw/architecture/runtime-maps/*
docs/raw/architecture/integration-contracts/*
```

The following invariants are authoritative:

```text
stateless-ui.md
theme-sovereignty.md
localization.md
atomic-hierarchy.md
mvvm-separation.md
repository-isolation.md
dependency-safety.md
public-api-stability.md
deterministic-build.md
platform-neutrality.md
```

---

# Primary Audit Questions

The audit must answer:

1. Are architectural invariants internally consistent?
2. Are invariants adequately explained by guidance documents?
3. Can a consumer build a compliant application using only architecture documentation?
4. Are architectural concepts consistently defined?
5. Is every architectural concept traceable to a canonical owner?
6. Are architectural responsibilities clearly separated?
7. Are there contradictions anywhere in the architecture corpus?

---

# Audit Dimensions

---

## 1. Invariant Integrity

Evaluate whether invariant documents:

* contradict each other
* overlap improperly
* define conflicting responsibilities
* redefine concepts inconsistently
* contain circular dependencies

Required checks:

* invariant-to-invariant consistency
* invariant completeness
* invariant ownership clarity
* invariant terminology consistency

Score:

```text
0–10
```

---

## 2. Guidance Completeness

Evaluate whether architecture guidance fully explains how consumers comply with invariants.

Required checks:

* every invariant has guidance
* every runtime map has guidance
* every integration contract has supporting guidance
* no missing onboarding steps
* no unexplained architectural concepts

Score:

```text
0–10
```

---

## 3. Cross-Document Consistency

Evaluate all architecture documents against one another.

Required checks:

* naming consistency
* provider ordering consistency
* folder structure consistency
* state management consistency
* repository guidance consistency
* MVVM consistency
* localization consistency
* runtime map consistency

Detect:

* conflicting definitions
* incompatible examples
* duplicated contracts
* competing ownership

Score:

```text
0–10
```

---

## 4. Consumer Onboarding Clarity

Evaluate whether a new consumer can build a compliant application using architecture documentation alone.

Required flow:

```text
Getting Started
    ↓
Feature Structure
    ↓
View
    ↓
ViewModel
    ↓
Repository
    ↓
State Management
    ↓
Runtime Integration
```

Check:

* missing steps
* ambiguous instructions
* unexplained dependencies
* hidden assumptions

Score:

```text
0–10
```

---

## 5. Boundary Integrity

Evaluate architectural separation.

Required checks:

### Library vs Consumer

* ownership clearly defined
* responsibilities clearly separated

### View vs ViewModel

* no leakage
* no shortcuts

### ViewModel vs Repository

* no direct UI concerns
* no repository bypasses

### Repository vs Runtime

* no runtime coupling

Score:

```text
0–10
```

---

## 6. Architecture Traceability

Every architectural concept must have:

* a canonical owner
* references that point back to the owner
* no orphan definitions

Required checks:

* ownership uniqueness
* traceability completeness
* reference consistency

Score:

```text
0–10
```

---

# Required Matrices

---

## Invariant Coverage Matrix

Produce:

| Invariant   | Defined | Guidance Exists | Runtime Mapping Exists | Coverage                 |
| ----------- | ------- | --------------- | ---------------------- | ------------------------ |
| {Invariant} | Yes/No  | Yes/No          | Yes/No                 | Complete/Partial/Missing |

Purpose:

Detect architecture rules that exist but lack guidance.

---

## Architecture Concept Matrix

Produce:

| Concept   | Canonical Owner | Referenced By | Consistent |
| --------- | --------------- | ------------- | ---------- |
| {Concept} | {Document}      | {Docs}        | Yes/No     |

Purpose:

Detect concept drift.

---

## Terminology Audit

Produce:

| Concept   | Terms Used | Documents |
| --------- | ---------- | --------- |
| {Concept} | {Terms}    | {Docs}    |

Flag:

* synonyms
* inconsistent naming
* terminology drift

---

## Duplication Audit

Produce:

| Contract   | Canonical Owner | Duplicate Definitions |
| ---------- | --------------- | --------------------- |
| {Contract} | {Doc}           | {Docs}                |

Purpose:

Detect architectural ownership violations.

---

## Cross-Document Consistency Matrix

Produce:

| Concept   | Doc A | Doc B | Result         |
| --------- | ----- | ----- | -------------- |
| {Concept} | {Doc} | {Doc} | Match/Conflict |

Purpose:

Detect contradictory guidance.

---

## Architecture Traceability Matrix

Produce:

| Concept   | Canonical Source |
| --------- | ---------------- |
| {Concept} | {Document}       |

Flag:

* orphan concepts
* multiple owners
* missing ownership

---

# Architecture Findings

All findings must use one of the following categories:

```text
ARCH-INVARIANT-{nnn}
ARCH-COVERAGE-{nnn}
ARCH-CONSISTENCY-{nnn}
ARCH-BOUNDARY-{nnn}
ARCH-TRACE-{nnn}
ARCH-ONBOARDING-{nnn}
```

---

# Finding Format

## Finding ID

```text
ARCH-XXXX-{nnn}
```

## Category

```text
Invariant Integrity
Coverage
Consistency
Boundary
Traceability
Onboarding
```

## Documents Affected

```text
{documents}
```

## Severity

```text
P0
P1
P2
P3
```

## Pattern Description

Describe the architectural issue.

## Evidence

Provide evidence from architecture documents.

## Authority Violated

Specify:

```text
Invariant
Runtime Map
Core Architecture
Integration Contract
```

and exact document.

## Recommendation

Describe architectural remediation.

## Impact

Explain systemic impact.

---

# Severity Classification

| Severity | Meaning                        |
| -------- | ------------------------------ |
| P0       | Critical architectural failure |
| P1       | Major architectural debt       |
| P2       | Transitional inconsistency     |
| P3       | Fully compliant                |

---

# Document Scoring

Score each document:

| Document | Clarity | Consistency | Boundary Integrity | Traceability | Technical Integrity | Average | P-Level |
| -------- | ------- | ----------- | ------------------ | ------------ | ------------------- | ------- | ------- |

Scale:

```text
0–10
```

---

# Audit Score Calculation

Dimension weights:

| Dimension                   | Weight |
| --------------------------- | ------ |
| Invariant Integrity         | 20%    |
| Guidance Completeness       | 20%    |
| Cross-Document Consistency  | 20%    |
| Consumer Onboarding Clarity | 15%    |
| Boundary Integrity          | 15%    |
| Architecture Traceability   | 10%    |

Formula:

```text
Audit Score =
(
Invariant Integrity × 0.20
+
Guidance Completeness × 0.20
+
Cross-Document Consistency × 0.20
+
Consumer Onboarding Clarity × 0.15
+
Boundary Integrity × 0.15
+
Architecture Traceability × 0.10
)
```

---

# Final Assessment

| Score Range | Assessment              |
| ----------- | ----------------------- |
| 9.0–10.0    | Excellent               |
| 7.0–8.9     | Good                    |
| 5.0–6.9     | Needs Improvement       |
| 3.0–4.9     | Major Revision Required |
| 0.0–2.9     | Not Architecture Ready  |

---

# Output Structure

## 1. Executive Summary

```text
# Architecture Audit Report — {timestamp}

Overall Assessment:
Audit Score:
Critical Findings:
Major Findings:
Minor Findings:
Documents Audited:
```

---

## 2. Documents Audited

Numbered list.

---

## 3. Authority Hierarchy Validation

Table.

---

## 4. Invariant Coverage Matrix

Table.

---

## 5. Architecture Concept Matrix

Table.

---

## 6. Terminology Audit

Table.

---

## 7. Duplication Audit

Table.

---

## 8. Cross-Document Consistency Matrix

Table.

---

## 9. Architecture Traceability Matrix

Table.

---

## 10. Scoring Breakdown

Per-document scores.

---

## 11. Findings

All findings.

---

## 12. Score Improvement Summary

Compare against the previous report from `docs/raw/report/architecture/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/10
Current Score: Y/10
Change: +N / -N / No change
```

| Dimension                   | Previous | Current | Change |
| --------------------------- | -------- | ------- | ------ |
| Invariant Integrity         | X        | Y       | +N     |
| Guidance Completeness       | X        | Y       | +N     |
| Cross-Document Consistency  | X        | Y       | +N     |
| Consumer Onboarding Clarity | X        | Y       | +N     |
| Boundary Integrity          | X        | Y       | +N     |
| Architecture Traceability   | X        | Y       | +N     |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

---

## 13. Final Verdict

```text
{Assessment} ({Score}/10)
```

Provide a concise architectural health summary.

---

## 14. Audit Traceability

| Reference             | Location                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Architecture Docs     | docs/raw/architecture/**                                              |
| Invariants            | docs/raw/architecture/invariants/**                                   |
| Runtime Maps          | docs/raw/architecture/runtime-maps/**                                 |
| Integration Contracts | docs/raw/architecture/integration-contracts/**                        |
| Audit Report          | docs/raw/report/architecture/latest/architecture-audit-{timestamp}.md |
| Previous Report       | docs/raw/report/architecture/archive/{previous-filename}              |

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/architecture/latest/* docs/raw/report/architecture/archive/
mkdir -p docs/raw/report/architecture/latest
```

---

# Output Location

Write the final report to:

```text
docs/raw/report/architecture/latest/architecture-audit-{timestamp}.md
```

The report must focus exclusively on architecture documentation integrity and must not evaluate implementation.
