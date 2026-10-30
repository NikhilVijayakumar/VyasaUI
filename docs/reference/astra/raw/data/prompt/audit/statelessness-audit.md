# Statelessness & MVVM Boundary Audit — Prompt Engine

## Purpose

You are acting as:

- State Management Auditor
- Side Effect Inspector
- Component Purity Reviewer

Your responsibility is to audit Astra's components and hooks for violations of the MVVM Separation invariant:

```text
docs/raw/architecture/invariants/mvvm-separation.md
```

You MUST follow the invariant document exactly. Do not invent architectural rules. The invariant document is the source of truth.

---

# Understanding Astra

Astra is a **core architecture and pattern library** for React and Electron applications.

It exports:

```text
useDataState<T>          ← async state hook (ViewModel primitive)
AppState<T>, StateType   ← state contract types
StateCode                ← synthetic status codes (IDLE = 1000)
AppStateHandler          ← conditional-rendering component
AppStateProvider         ← context provider for wiring in UI components (Loading/Error/Empty)
AppStateContext           ← React context object for AppStateProvider
AppStateComponents       ← type for AppStateProvider value
AppStateHandlerProps     ← component prop types
ApiService               ← Axios-based HTTP client (repository layer)
ServerResponse<T>        ← typed response wrapper
HttpStatusCode           ← HTTP status enum
getApiService            ← singleton factory for ApiService
getStatusMessage         ← status code → string resolver
```

Astra source structure:

```text
src/
  lib.ts                             ← public entry point (barrel)
  common/
    hooks/                           ← useDataState
    components/organisms/            ← AppStateHandler, AppStateContext
    repo/                            ← ApiService, ServerResponse, HttpStatusCode, getApiService
    state/                           ← StateType, StateCode, AppState
```

Astra is **design-system independent**. It does not own: loading/error/empty UI components, theming, localization, atomic design hierarchy. Those are external design system concerns. Astra does NOT have an atomic design hierarchy (atoms, molecules, templates). `AppStateProvider` provides the wiring slot for any design system without coupling to one.

Astra's component surface is minimal: `AppStateHandler` is the only component. Components must be **stateless presentation units** — they receive data via props and render conditionally. They must not fetch data, manage domain state, or call repositories directly.

---

# Scope

Primary input:

```text
src/common/components/**
src/common/hooks/**
```

Reference invariant: `docs/raw/architecture/invariants/mvvm-separation.md`

---

# Explicit Non-Goals

The Statelessness Audit MUST NOT:

- evaluate visual design and styling
- evaluate naming conventions
- evaluate feature completeness
- evaluate test coverage
- evaluate build correctness
- evaluate security

unless they directly indicate state management or MVVM boundary violations.

---

# Mental Model

| State Type              | Ownership            | Location                              | Allowed In Component |
|-------------------------|----------------------|---------------------------------------|----------------------|
| UI interaction state    | Component            | `useState(false)` for open/close/toggle | Yes               |
| Animation state         | Component            | `useState(0)` for progress, transition  | Yes               |
| Props-only rendering    | Component            | Data arrives via props                  | Yes               |
| Controlled component    | Component            | `value` + `onChange` pattern            | Yes               |
| Data state              | ViewModel            | `useDataState` in hooks                 | No                |
| Business logic          | ViewModel            | Computation, transformation             | No                |
| API calls               | ViewModel / Repository | `ApiService` in hooks or repo         | No                |
| Persistence             | ViewModel / Repository | `localStorage` in hooks               | No                |
| Hidden mutable state    | None                 | `useRef` for display values, module-level vars | No        |

---

# Audit Goal

Determine whether Astra's components and hooks behave as:

- stateless presentation units with no business logic, data fetching, or persistence
- pure rendering functions that receive data through props and emit events through callbacks
- properly layered ViewModel hooks that isolate all async state management from the View

OR whether they have drifted into:

- mutable state via `useState<T>` where T is a domain entity (not UI state)
- data fetching via `useEffect` + `axios` / `fetch`
- direct API service calls in component files
- persistence calls (`localStorage`, `sessionStorage`, `IndexedDB`) in component files
- business logic computation in JSX or event handlers
- hidden mutable state via `useRef` for display values
- domain utility imports in component scope
- repository imports inside component files
- module-level mutable variables

---

# Required Audit Dimensions

Analyze ALL of the following:

---

## 1. Mutable State

Detect:
- `useState<T>` where T is a domain entity (not boolean, number, or string for UI)
- `useState` objects with more than 3 fields (suggests domain data)
- `useReducer` in component files
- module-level `let` or `var` variables holding display state
- `useRef` used to store values that affect rendering
- class components with instance state

Allowed:
- [ ] `useState(false)` for open/close/toggle
- [ ] `useState(0)` for animation progress
- [ ] `useState<string>` for controlled input values
- [ ] Controlled component props (`value`, `onChange`)

Forbidden:
- [ ] No domain entity state in components
- [ ] No `useReducer` in components
- [ ] No module-level mutable state
- [ ] No `useRef` for display-affecting values
- [ ] No class component instance state

Severity mapping:
- P0: domain entity stored in `useState`, `useReducer` with domain logic, module-level mutable state
- P1: `useRef` for display values, `useState` with 3+ fields
- P2: complex UI state that borders on domain (documented)
- P3: UI interaction state only or no state at all

---

## 2. Hidden Side Effects

Detect:
- `useEffect` with data fetching (`axios`, `fetch`, `ApiService`)
- `useEffect` with persistence (`localStorage.setItem`)
- `useEffect` with DOM manipulation (`document.title`, `window.scrollTo`)
- `useEffect` with subscription setup without cleanup
- `useLayoutEffect` for visual side effects
- imperative handle methods that trigger data operations
- event handlers that call API services directly

Allowed:
- [ ] `useEffect` for event listener setup/teardown
- [ ] `useEffect` for animation coordination
- [ ] `useEffect` with empty deps for mount-only UI setup

Forbidden:
- [ ] No data fetching in `useEffect`
- [ ] No persistence in `useEffect`
- [ ] No DOM manipulation in `useEffect`
- [ ] No API calls in event handlers

Severity mapping:
- P0: `useEffect` with data fetching or persistence
- P1: `useEffect` with DOM manipulation, event handlers calling APIs
- P2: `useEffect` with side effects that are UI-only but complex
- P3: no hidden side effects

---

## 3. Persistence Leakage

Detect:
- `localStorage.getItem` / `setItem` / `removeItem` in component files
- `sessionStorage` access in component files
- `IndexedDB` access in component files
- cookies read/write in component files
- persistent state managed by components

Allowed:
- [ ] Persistence only in ViewModel hooks or Repository layer
- [ ] Persistence through abstracted storage service

Forbidden:
- [ ] No `localStorage` in components
- [ ] No `sessionStorage` in components
- [ ] No `IndexedDB` in components
- [ ] No cookie access in components

Severity mapping:
- P0: any persistence API call directly in component code
- P1: persistence through a helper imported by a component
- P2: documented persistence access with migration plan
- P3: no persistence in component layer

---

## 4. Runtime Coupling

Detect:
- direct `axios` import in component files
- `fetch()` calls in component files
- `ApiService` import in component files
- `WebSocket` instantiation in component files
- `XMLHttpRequest` in component files
- `import.meta.env` access for API URLs in components

Allowed:
- [ ] IO operations only in Repository layer
- [ ] API access through typed repository abstractions

Forbidden:
- [ ] No `axios`/`fetch` in components
- [ ] No `WebSocket` in components
- [ ] No XHR in components
- [ ] No env var access in components for API config

Severity mapping:
- P0: direct HTTP client import in component, `fetch()` in component
- P1: env var access for API URLs in component, `WebSocket` in component
- P2: documented runtime coupling with abstraction plan
- P3: no runtime coupling in component layer

---

# Finding Format

Each finding MUST include:

```
### Finding ID
SLESS-{nnn}

### File
{file-path}

### Category
Mutable State / Hidden Side Effects / Persistence Leakage / Runtime Coupling

### Invariant Violated
docs/raw/architecture/invariants/mvvm-separation.md

### Severity
P0 / P1 / P2 / P3

### Violation Type
{short description}

### Evidence
{exact code snippet}

### Invariant Rule Violated
mvvm-separation.md §{Section} — {rule}

### Recommendation
{actionable remediation — move to ViewModel or Repository}

### Impact
{what breaks if not fixed — coupling, testability, reusability}
```

---

# Severity Classification

| Severity | Meaning                                          | Action                              |
|----------|--------------------------------------------------|-------------------------------------|
| P0       | Critical — component fetches or persists data    | Must extract to ViewModel/Repository |
| P1       | High — component has hidden side effects         | Must migrate next release           |
| P2       | Transitional — documented UI state complexity    | Allowed temporarily with plan       |
| P3       | Compliant — component is stateless               | No action required                  |

---

# Scoring Model

Score each dimension 0–10. Apply weights:

| Dimension            | Weight |
|----------------------|--------|
| Mutable State        | 30%    |
| Hidden Side Effects  | 30%    |
| Persistence Leakage  | 20%    |
| Runtime Coupling     | 20%    |

Formula:

```text
Statelessness Score =
(
  Mutable State × 0.30
  + Hidden Side Effects × 0.30
  + Persistence Leakage × 0.20
  + Runtime Coupling × 0.20
)
```

Start each dimension at 10. Deduct per finding in that dimension:

| Severity | Deduction per Finding |
|----------|-----------------------|
| P0       | −3.0                  |
| P1       | −1.5                  |
| P2       | −0.5                  |
| P3       | −0.0 (compliant)      |

Floor per dimension: 0.0.

---

# Final Assessment

| Score Range | Assessment              |
|-------------|-------------------------|
| 9.0–10.0    | Excellent               |
| 7.0–8.9     | Good                    |
| 5.0–6.9     | Needs Improvement       |
| 3.0–4.9     | Major Revision Required |
| 0.0–2.9     | MVVM Boundary Violated  |

---

# Required Report Structure

## 1. Executive Summary

```text
# Statelessness & MVVM Boundary Audit Report — Astra

Overall Assessment:  {assessment}
Final Score:         {score} / 10
P0 Findings:         {n}
P1 Findings:         {n}
P2 Findings:         {n}
P3 (Compliant):      {n}
```

Followed immediately by the Files Audited table:

| File | Role |
|------|------|
| `src/common/components/organisms/AppStateHandler.tsx` | Conditional-render component |
| `src/common/components/organisms/AppStateContext.ts` | Rendering context |
| `src/common/hooks/useDataState.ts` | ViewModel hook |
| `docs/raw/architecture/invariants/mvvm-separation.md` | Invariant authority |

## 2. Component Inventory

Summary of components and hooks reviewed with statelessness characteristics.

## 3. Mutable State Report

Findings per check. Compliance table at end.

## 4. Hidden Side Effects Report

Findings per check. Compliance table at end.

## 5. Persistence Leakage Report

Findings per check. Compliance table at end.

## 6. Runtime Coupling Report

Findings per check. Compliance table at end.

## 7. Findings Summary

All findings grouped by severity:

### P0 — Critical

| ID | File | Finding |
|----|------|---------|

### P1 — High

| ID | File | Finding |
|----|------|---------|

### P2 — Transitional

| ID | File | Finding |
|----|------|---------|

## 8. Transitional Violations

Known documented tech debt accepted for this release with rationale and migration plan.

## 9. Scoring Breakdown

| Dimension            | Raw Score | Weight | Weighted Score |
|----------------------|-----------|--------|----------------|
| Mutable State        |           | 30%    |                |
| Hidden Side Effects  |           | 30%    |                |
| Persistence Leakage  |           | 20%    |                |
| Runtime Coupling     |           | 20%    |                |

```text
Total Score: X.X / 10
```

## 10. Score Improvement Summary

Compare against the previous report from `docs/raw/report/statelessness/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score:  X.X / 10
Current Score:   Y.Y / 10
Change:          +N.N / −N.N / No change
```

| Dimension            | Previous | Current | Change |
|----------------------|----------|---------|--------|
| Mutable State        | X        | Y       | +N     |
| Hidden Side Effects  | X        | Y       | +N     |
| Persistence Leakage  | X        | Y       | +N     |
| Runtime Coupling     | X        | Y       | +N     |

List resolved findings from previous report. List new findings not in previous report.

## 11. Final Verdict

```text
{Assessment} ({Score}/10)
```

Provide a concise statelessness and MVVM boundary health summary.

## 12. Audit Traceability

| Reference          | Location                                                                            |
|--------------------|-------------------------------------------------------------------------------------|
| Invariant Doc      | `docs/raw/architecture/invariants/mvvm-separation.md`                               |
| Components         | `src/common/components/**`                                                          |
| Hooks              | `src/common/hooks/**`                                                               |
| Audit Report       | `docs/raw/report/statelessness/latest/statelessness-audit-{timestamp}.md`           |
| Previous Report    | `docs/raw/report/statelessness/archive/{previous-filename}`                         |

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/statelessness/latest/* docs/raw/report/statelessness/archive/
mkdir -p docs/raw/report/statelessness/latest
```

---

# Output Location

```text
docs/raw/report/statelessness/latest/statelessness-audit-{timestamp}.md
```

Timestamp format: `YYYY-MM-DD-HHMM`

---

# Invariant Document Authority

When checking compliance:

- The invariant document is the source of truth
- For each finding, reference the specific Allowed or Forbidden pattern section from `mvvm-separation.md`
- Do NOT override invariant rules based on perceived convenience
- A component that receives data through props and renders without side effects is compliant even if the parent fetches data
- `useDataState` in hooks is the correct ViewModel location — its internal `mountedRef` guard and async `execute()` are not violations; they are documented ViewModel behaviors
