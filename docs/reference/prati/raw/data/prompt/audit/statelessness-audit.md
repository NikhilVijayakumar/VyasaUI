# Statelessness Audit Prompt

You are acting as:

- State Management Auditor
- Side Effect Inspector
- Component Purity Reviewer

Your task is to audit Prati components for violations of:

1. Stateless UI

You MUST follow the invariant document exactly.

Do not invent architectural rules.

The invariant document is the source of truth.

---

## Mental Model

| State Type | Ownership | Location | Allowed In Component |
|------------|-----------|----------|--------------------|
| UI interaction state | Component | `useState(false)` for open/close/toggle | Yes |
| Animation state | Component | `useState(0)` for progress, transition | Yes |
| Props-only rendering | Component | Data arrives via props | Yes |
| Controlled component | Component | `value` + `onChange` pattern | Yes |
| Data state | ViewModel | `useDataState` in hooks | No |
| Business logic | ViewModel | Computation, transformation | No |
| API calls | ViewModel / Repository | `ApiService` in hooks or repo | No |
| Persistence | ViewModel / Repository | `localStorage` in hooks | No |
| Hidden mutable state | None | `useRef` for display values, module-level vars | No |

---

## Inputs

You will receive:

- Component files from `src/common/components/{atoms|molecules|organisms|templates}/`
- Hook files from `src/common/hooks/`
- Invariant document:
  - `docs/raw/architecture/invariants/stateless-ui.md`

The invariant document overrides all assumptions.

---

## Audit Goal

Determine whether components behave as:

- stateless presentation units with no business logic, data fetching, or persistence
- pure rendering functions that receive data through props and emit events through callbacks

OR whether they have drifted into:

- mutable state via `useState<T>` where T is a domain entity (not UI state)
- data fetching via `useEffect` + `axios` / `fetch`
- direct API service calls (`ApiService`, `axios.get`, `fetch`)
- persistence calls (`localStorage`, `sessionStorage`, `IndexedDB`)
- business logic computation in JSX or event handlers
- hidden mutable state via `useRef` for display values
- domain utility imports in component scope
- auth or permission logic inside components
- repository imports inside component files
- module-level mutable variables

---

## Audit Scope

Focus ONLY on statelessness and state management.

Ignore:
- visual design and styling
- naming conventions
- feature completeness
- test coverage

unless they indicate state management violations.

---

## Required Audit Dimensions

Analyze ALL of the following:

---

### 1. Mutable State

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
- [ ] No useReducer in components
- [ ] No module-level mutable state
- [ ] No useRef for display-affecting values
- [ ] No class component instance state

Severity mapping:
- P0: domain entity stored in useState, useReducer with domain logic, module-level mutable state
- P1: useRef for display values, useState with 3+ fields
- P2: complex UI state that borders on domain (documented)
- P3: UI interaction state only or no state at all

---

### 2. Hidden Side Effects

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
- [ ] No data fetching in useEffect
- [ ] No persistence in useEffect
- [ ] No DOM manipulation in useEffect
- [ ] No API calls in event handlers

Severity mapping:
- P0: useEffect with data fetching or persistence
- P1: useEffect with DOM manipulation, event handlers calling APIs
- P2: useEffect with side effects that are UI-only but complex
- P3: no hidden side effects

---

### 3. Persistence Leakage

Detect:
- `localStorage.getItem` / `setItem` / `removeItem` in component files
- `sessionStorage` access in component files
- `IndexedDB` access in component files
- `cookies` read/write in component files
- `CacheStorage` access in component files
- persistent state in URL parameters managed by components

Allowed:
- [ ] Persistence only in ViewModel hooks or Repository layer
- [ ] Persistence through abstracted storage service

Forbidden:
- [ ] No localStorage in components
- [ ] No sessionStorage in components
- [ ] No IndexedDB in components
- [ ] No cookie access in components
- [ ] No CacheStorage in components

Severity mapping:
- P0: any persistence API call directly in component code
- P1: persistence through a helper imported by a component
- P2: documented persistence access with migration plan
- P3: no persistence in component layer

---

### 4. Runtime Coupling

Detect:
- direct `axios` import in component files
- `fetch()` calls in component files
- `ApiService` import in component files
- `WebSocket` instantiation in component files
- `XMLHttpRequest` in component files
- `import.meta.env` access for API URLs in components
- runtime configuration reading in components

Allowed:
- [ ] IO operations only in Repository layer
- [ ] API access through typed repository abstractions

Forbidden:
- [ ] No axios/fetch in components
- [ ] No WebSocket in components
- [ ] No XHR in components
- [ ] No env var access in components for API config

Severity mapping:
- P0: direct HTTP client import in component, fetch() in component
- P1: env var access for API URLs in component, WebSocket in component
- P2: documented runtime coupling with abstraction plan
- P3: no runtime coupling in component layer

---

## Finding Format

Each finding MUST include:

```
### Finding ID
SLESS-{nnn}

### File
{file-path}

### Category
Mutable State / Hidden Side Effects / Persistence Leakage / Runtime Coupling

### Invariant Violated
docs/raw/architecture/invariants/stateless-ui.md

### Severity
P0 / P1 / P2 / P3

### Violation Type
{short description}

### Evidence
{exact code snippet}

### Invariant Rule Violated
stateless-ui.md §{Section} — {rule}

### Recommendation
{actionable remediation — move to ViewModel or Repository}

### Impact
{what breaks if not fixed — coupling, testability, reusability}
```

---

## Severity Classification

| Severity | Meaning | Action |
|----------|---------|--------|
| P0 | Critical — component fetches or persists data | Must extract to ViewModel/Repository |
| P1 | High — component has hidden side effects | Must migrate next release |
| P2 | Transitional — documented UI state complexity | Allowed temporarily with plan |
| P3 | Compliant — component is stateless | No action required |

---

## Output Specification

The audit report MUST include:

1. **Audit Metadata** — timestamp, commit, suite, module, invariant references
2. **Audited Files** — numbered list of files reviewed
3. **Summary** — count per severity (P0-P3)
4. **Overall Score** — per-dimension score out of 100
5. **Findings** — detailed per-finding using the Finding Format above
6. **Cross-Suite Overlap** — findings shared with component-purity audit (Stateless UI dimension); deduplication guidance for fix plan
7. **Transitional Violations** — known documented tech debt
8. **Audit Traceability** — reference to the audit suite and report location

The report MUST be written to:

```
docs/raw/report/statelessness/latest/statelessness-{module}-{timestamp}.md
```

---

## Invariant Document Authority

When checking compliance:

- The invariant document is the source of truth
- For each finding, reference the specific Allowed or Forbidden pattern section from stateless-ui.md
- Do NOT override invariant rules based on perceived convenience
- A component that receives data through props and renders without side effects is compliant even if the parent fetches data
- Findings overlapping with component-purity audit (same invariant, same evidence) must be flagged for deduplication in the fix plan

---

# Required Report Structure

## 1. Executive Summary

```text
# Statelessness Audit Report — {timestamp}

Overall Assessment:
Audit Score:
Critical Findings (P0):
Major Findings (P1):
Minor Findings (P2):
Compliant (P3):
Files Audited:
```

## 2. Audited Files

Numbered list of all files reviewed.

## 3. Summary

Count per severity (P0–P3).

## 4. Overall Score

Per-dimension score out of 100.

| Dimension | Score |
| --------- | ----- |
| Mutable State | X/100 |
| Hidden Side Effects | X/100 |
| Persistence Leakage | X/100 |
| Runtime Coupling | X/100 |
| **Overall** | **X/100** |

## 5. Findings

All detailed findings using the Finding Format.

## 6. Cross-Suite Overlap

Findings shared with component-purity audit (Stateless UI dimension); deduplication guidance for fix plan.

## 7. Transitional Violations

Known documented tech debt.

## 8. Score Improvement Summary

Compare against the previous report from `docs/raw/report/statelessness/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/100
Current Score: Y/100
Change: +N / -N / No change
```

| Dimension | Previous | Current | Change |
| --------- | -------- | ------- | ------ |
| Mutable State | X | Y | +N |
| Hidden Side Effects | X | Y | +N |
| Persistence Leakage | X | Y | +N |
| Runtime Coupling | X | Y | +N |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

## 9. Final Verdict

```text
{Assessment} ({Score}/100)
```

## 10. Audit Traceability

| Reference | Location |
| --------- | -------- |
| Invariant Document | docs/raw/architecture/invariants/stateless-ui.md |
| Component Source | src/common/components/** |
| Hook Source | src/common/hooks/** |
| Audit Report | docs/raw/report/statelessness/latest/statelessness-{module}-{timestamp}.md |
| Previous Report | docs/raw/report/statelessness/archive/{previous-filename} |

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/statelessness/latest/* docs/raw/report/statelessness/archive/
mkdir -p docs/raw/report/statelessness/latest
```

---

# Output Location

Write the final report to:

```text
docs/raw/report/statelessness/latest/statelessness-{module}-{timestamp}.md
```
