# Architecture Documentation Audit Prompt

You are acting as:

* Principal Architect
* Architecture Governance Reviewer
* Architectural Documentation Auditor

Your responsibility is to audit Astra's **architecture documentation corpus** located under:

```text
docs/raw/architecture/**
```

This audit evaluates the architecture documentation **against itself**.

It does **not** evaluate implementation, source code, feature behavior, runtime behavior, test coverage, or feature correctness.

---

# Understanding Astra

Astra is a **core architecture and pattern library**.

Astra explicitly supports two first-class application targets:

```text
WEB       React + Axios + REST APIs
ELECTRON  React + Electron + Prana IPC
```

It provides:

* MVVM pattern (`useDataState`, `AppState`, `AppStateHandler`, `AppStateProvider`)
* Async state lifecycle (`StateType`, `INIT → LOADING → COMPLETED/ERROR`)
* Repository pattern (`ApiService`, `IpcService`, `ServerResponse`, `HttpStatusCode`, `StateCode`)
* Platform abstraction (WEB: HTTP via `ApiService` / ELECTRON: IPC via `IpcService`)
* Deterministic build and public API surface

Astra does **not** own:

* UI component library (atoms, molecules, organisms, templates) — Prati
* Localization system (`LanguageProvider`, `useLanguage`) — Prati
* Theming system (`ThemeProvider`, `useTheme`, design tokens) — Prati
* Atomic design hierarchy — Prati
* Electron runtime infrastructure (`contextBridge`, `ipcMain`, `ipcRenderer`, `BrowserWindow`) — Prana
* IPC handler registration (`ipcMain.handle`) — Prana
* Storage, scheduler, plugin, virtual drive runtimes — Prana

Platform boundary rules:

* Astra provides `IpcService` as service abstraction over `window.electronAPI`
* Astra consumes `window.electronAPI` only — never imports Electron directly
* All runtime infrastructure is owned by Prana

Architecture guidance must remain:

* implementation-agnostic
* feature-agnostic
* dual-platform consistent (WEB and ELECTRON both first-class)
* reusable across all consumer applications

Architecture documentation must never depend on any specific consumer feature.

---

# Purpose

The goal of this audit is to determine whether Astra's architecture documentation:

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
```

Note: `docs/raw/architecture/runtime-maps/` is currently empty — skip if unpopulated.

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
Implementation Audit
```

---

# Architecture Authority Hierarchy

All findings must respect the following authority order:

| Level | Authority             |
| ----- | --------------------- |
| 1     | Invariants            |
| 2     | Core Architecture     |
| 3     | Integration Contracts |
| 4     | Examples              |

Rules:

* Lower authority documents MUST NOT redefine higher authority contracts.
* Lower authority documents MUST NOT weaken higher authority requirements.
* Examples MUST NEVER override architecture.
* Core Architecture MUST explain Invariants.
* Integration Contracts MUST implement Core Architecture.

Violations are architecture findings.

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
docs/raw/architecture/integration-contracts/*
```

The following Astra invariants are authoritative:

```text
mvvm-separation.md
repository-isolation.md
dependency-safety.md
public-api-stability.md
deterministic-build.md
boilerplate-ownership.md
runtime-boundary.md
target-consistency.md
```

---

# Primary Audit Questions

The audit must answer:

1. Are architectural invariants internally consistent?
2. Are invariants adequately explained by guidance documents?
3. Can a consumer build a compliant WEB application using only architecture documentation?
4. Can a consumer build a compliant ELECTRON application using only architecture documentation?
5. Are WEB and ELECTRON documented with equal completeness?
6. Are architectural concepts consistently defined?
7. Is every architectural concept traceable to a canonical owner?
8. Are architectural responsibilities clearly separated between Astra, Prana, and Prati?
9. Does the runtime boundary between Astra and Prana have no contradictions?
10. Are there contradictions anywhere in the architecture corpus?

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
* state management consistency (`StateCode.IDLE` vs `HttpStatusCode.IDLE` — only `StateCode.IDLE` is valid)
* repository guidance consistency (WEB: `ApiService`, ELECTRON: `IpcService`)
* MVVM consistency across both platforms
* platform abstraction consistency
* integration contract consistency
* dual-platform symmetry: WEB and ELECTRON docs must document equivalent layers at equivalent depth
* `applicationTarget` config: if referenced, must be defined in at least one authoritative doc

Detect:

* conflicting definitions
* incompatible examples
* duplicated contracts
* competing ownership
* WEB-only guidance presented as platform-neutral
* ELECTRON gaps where WEB equivalents exist

Score:

```text
0–10
```

---

## 4. Consumer Onboarding Clarity

Evaluate whether a new consumer can build a compliant application using architecture documentation alone.

Both target paths must be evaluable:

### WEB Path

```text
Getting Started
    ↓
Feature Structure
    ↓
ViewModel (useDataState)
    ↓
Repository (ApiService + ServerResponse)
    ↓
State Management (AppState / AppStateHandler / AppStateProvider)
    ↓
React Integration Contract
```

### ELECTRON Path

```text
Getting Started
    ↓
Feature Structure (with electron/ project root)
    ↓
ViewModel (useDataState — identical to WEB)
    ↓
Repository (IpcService + ServerResponse)
    ↓
State Management (AppState / AppStateHandler / AppStateProvider)
    ↓
Electron Integration Contract
    ↓
Runtime Boundary (Astra consumes window.electronAPI / Prana owns contextBridge)
```

Check for both paths:

* missing steps
* ambiguous instructions
* unexplained dependencies
* hidden assumptions
* WEB-only guidance where ELECTRON guidance is also required

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
* repositories use `ApiService` (WEB) or `IpcService` (ELECTRON) — never `axios` or `window.electronAPI` directly

### Astra vs Prana Runtime Boundary

* Astra never imports Electron APIs (`ipcRenderer`, `contextBridge`, `BrowserWindow`, `ipcMain`)
* Astra never owns `contextBridge.exposeInMainWorld`
* Astra never registers `ipcMain.handle` handlers
* Astra only consumes `window.electronAPI` through `IpcService`
* All runtime infrastructure (`BrowserWindow`, `ipcMain`, storage, scheduler) belongs to Prana

### Astra vs Prati Design Boundary

* Astra does not own localization system (`LanguageProvider`, `useLanguage`)
* Astra does not own theming system (`ThemeProvider`, `useTheme`, design tokens)
* Astra does not own UI component library
* Astra exposes only `AppStateProvider` as a wiring interface for design system components

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

| Invariant              | Defined | Guidance Exists | Integration Contract Exists | Coverage                 |
| ---------------------- | ------- | --------------- | --------------------------- | ------------------------ |
| mvvm-separation        | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| repository-isolation   | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| dependency-safety      | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| public-api-stability   | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| deterministic-build    | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| boilerplate-ownership  | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| runtime-boundary       | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| target-consistency     | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |
| {Additional Invariant} | Yes/No  | Yes/No          | Yes/No                      | Complete/Partial/Missing |

Purpose:

Detect architecture rules that exist but lack guidance.

---

## Platform Symmetry Matrix

For each layer, evaluate whether WEB and ELECTRON are documented at equivalent depth:

| Layer                    | WEB Documented | ELECTRON Documented | Symmetric | Gap                      |
| ------------------------ | -------------- | ------------------- | --------- | ------------------------ |
| Service (transport)      | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| Repository pattern       | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| ViewModel (hooks)        | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| State management         | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| Feature structure        | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| Integration contract     | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| Build configuration      | Yes/No         | Yes/No              | Yes/No    | {description or none}    |
| Onboarding path          | Yes/No         | Yes/No              | Yes/No    | {description or none}    |

Purpose:

Detect ELECTRON documentation gaps relative to WEB equivalents.

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

## 5. Platform Symmetry Matrix

Table.

---

## 6. Architecture Concept Matrix

Table.

---

## 7. Terminology Audit

Table.

---

## 8. Duplication Audit

Table.

---

## 9. Cross-Document Consistency Matrix

Table.

---

## 10. Architecture Traceability Matrix

Table.

---

## 11. Scoring Breakdown

Per-document scores.

---

## 12. Findings

All findings.

---

## 13. Score Improvement Summary

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

## 14. Final Verdict

```text
{Assessment} ({Score}/10)
```

Provide a concise architectural health summary.

---

## 15. Audit Traceability

| Reference             | Location                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Architecture Docs     | docs/raw/architecture/**                                              |
| Invariants            | docs/raw/architecture/invariants/**                                   |
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
