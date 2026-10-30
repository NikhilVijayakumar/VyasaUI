# Astra Audit System — Execution Guide

## Overview

Astra has 8 audit prompts across two concerns: **documentation integrity** and **source integrity**. Order matters because downstream audits treat upstream documents as authority. Running implementation audit before architecture audit is clean produces false positives — the implementation might correctly follow bad docs.

---

## Authority Chain

```text
L1  Architecture docs     ← defines how the system is structured
L2  Feature docs          ← defines what the system must do
L3  Feature-Technical docs ← bridges L1+L2 to implementation
L4  README                ← public contract summary
L5  Source code           ← how it was actually built
```

Each audit layer depends on the layer above it being correct first.

---

## Execution Order

### Stage 1 — Architecture Foundation

**Run first. No dependencies.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 1 | `architecture-audit.md` | `docs/raw/architecture/**` against itself | `docs/raw/report/architecture/latest/` |

**Why first:** Every other audit treats architecture as its highest authority. A contradiction in architecture docs propagates false findings into every downstream audit.

---

### Stage 2 — Feature Specification

**Run after Stage 1 is clean.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 2 | `feature-audit.md` | `docs/raw/feature/**` against itself | `docs/raw/report/feature/latest/` |

**Why second:** Feature-technical docs (Stage 3) must align with feature specs. Running feature-technical audit before feature specs are verified means fixing the wrong layer when conflicts are found.

---

### Stage 3 — Feature-Technical Bridge

**Run after Stages 1 and 2 are clean.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 3 | `feature-technical-validation.md` | `docs/raw/feature-technical/**` against `architecture/**` + `feature/**` | `docs/raw/report/feature-technical/latest/` |

**Why third:** Feature-technical docs translate L1+L2 into implementation contracts. They are the primary reference for implementation audit. Errors here create cascading findings in Stage 4 and Stage 5.

---

### Stage 4 — Public Contract

**Run after Stage 3 is clean.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 4 | `readme-audit.md` | `README.md` against `architecture/**` + `feature/**` + `feature-technical/**` | `docs/raw/report/readme/latest/` |

**Why fourth:** README is the public face of the library. It must accurately reflect the doc hierarchy. Verifying it after L1–L3 are clean avoids correcting README against wrong source docs.

---

### Stage 5 — Source Validation

**Run after Stage 4 is clean. Audits 5a, 5b, 5c can run in parallel.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 5a | `implementation-audit.md` | `src/**` against `architecture/**` + `feature/**` + `feature-technical/**` + `README.md` | `docs/raw/report/implementation/latest/` |
| 5b | `statelessness-audit.md` | `src/common/components/**` + `src/common/hooks/**` against MVVM invariant | `docs/raw/report/statelessness/latest/` |
| 5c | `build-audit.md` | `vite.config.ts`, `tsconfig.json`, `package.json`, `dist/` against deterministic-build invariant | `docs/raw/report/build/latest/` |

**Why parallel:** These three audits examine different aspects of the source with no cross-dependency:
- `implementation-audit` — full doc-vs-source compliance (behavior, API, types, drift)
- `statelessness-audit` — focused MVVM boundary check (subset of implementation scope, different angle)
- `build-audit` — build system integrity (orthogonal to behavioral correctness)

**Note:** `statelessness-audit` overlaps partially with `implementation-audit` Phase 2 (Architecture Compliance). Conflicting findings in both reports indicate the same root cause — fix once.

---

### Stage 6 — Security

**Run after Stage 5 is clean. Independent of doc hierarchy.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 6 | `security-audit.md` | `src/**` + `package.json` + `package-lock.json` + `vite.config.ts` | `docs/raw/report/security/latest/` |

**Why:** Security audit is most useful on stable, implementation-correct code. Running it while source has known behavioral bugs adds noise. Can run earlier if a security review is urgently needed — it is independent of doc layers.

---

### Stage 7 — Governance

**Run after Stage 4 is clean. Documentation-only — independent of source. Can run in parallel with Stages 5 and 6.**

| # | Prompt | Scope | Report Location |
|---|--------|-------|-----------------|
| 7 | `external-context-ownership-audit.md` | `README.md` + `docs/raw/external-context/**` + `docs/raw/ownership/**` + referenced repositories | `docs/raw/report/governance/latest/` |

**Why:** Validates that capability ownership is unique and complete, external context documents are within declared scope, Astra → Prati consumption is documentation-only (Design System + Localization), and repository boundaries are respected. Documentation-only scope means no source dependency — can run as soon as Stage 4 (README) is clean.

---

## Quick Reference

```text
Stage 1  architecture-audit          (docs only — no deps)
Stage 2  feature-audit               (docs only — after Stage 1)
Stage 3  feature-technical-validation (docs only — after Stages 1+2)
Stage 4  readme-audit                (docs only — after Stage 3)
Stage 5  implementation-audit  ┐
         statelessness-audit   ├── parallel — after Stage 4
         build-audit           ┘
Stage 6  security-audit              (after Stage 5)
Stage 7  external-context-ownership-audit  (docs only — after Stage 4, parallel with 5+6)
```

---

## Re-Run Triggers

Run only the affected stage and everything downstream of it.

| What Changed | Re-run From |
|---|---|
| `docs/raw/architecture/**` | Stage 1 → all stages |
| `docs/raw/feature/**` | Stage 2 → Stages 3, 4, 5, 6, 7 |
| `docs/raw/feature-technical/**` | Stage 3 → Stages 4, 5, 6, 7 |
| `README.md` | Stage 4 → Stages 5, 6, 7 |
| `src/**` (behavior change) | Stage 5 (5a + 5b) → Stage 6 |
| `vite.config.ts` / `tsconfig.json` / `package.json` | Stage 5c → Stage 6 |
| `package-lock.json` (dependency update) | Stage 6 only |
| `docs/raw/external-context/**` | Stage 7 only |
| `docs/raw/ownership/**` | Stage 7 only |

---

## Report Rotation

Every audit prompt rotates its previous report before writing a new one:

```text
mv docs/raw/report/{type}/latest/* docs/raw/report/{type}/archive/
```

Archive reports are compared against in the Score Improvement Summary section of each new report.

---

## Audit Inventory

| Prompt | Authority Source | What It Validates |
|--------|-----------------|-------------------|
| `architecture-audit.md` | Architecture docs (self) | Invariant consistency, cross-doc correctness, consumer onboarding clarity |
| `feature-audit.md` | Feature docs (self) | Functional completeness, workflow coverage, state coverage, purity |
| `feature-technical-validation.md` | Architecture + Feature docs | Technical design alignment with L1+L2 |
| `readme-audit.md` | Architecture + Feature + Feature-Technical docs | Public contract accuracy |
| `implementation-audit.md` | All doc layers | Source compliance with all documented contracts |
| `statelessness-audit.md` | `mvvm-separation.md` invariant | Component/hook MVVM boundary compliance |
| `build-audit.md` | `deterministic-build.md` invariant | Build reproducibility, type generation, ESM/UMD validity |
| `security-audit.md` | OWASP / secure coding practices | XSS, data exposure, dependency CVEs, injection, build security |
| `external-context-ownership-audit.md` | `docs/raw/external-context/**` + `docs/raw/ownership/**` | Capability ownership uniqueness and completeness, Astra → Prati scope compliance, repository boundary enforcement, context purity |
