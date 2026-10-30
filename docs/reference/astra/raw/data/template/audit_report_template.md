# {Audit Suite Title} Audit Report

## Audit Metadata

| Field | Value |
|-------|-------|
| Audit Timestamp | {timestamp} |
| Audit Suite | {suite-name} |
| Audit Version | 1.0 |
| Commit Hash | {commit-hash} |
| Audited Module | {module-path} |
| Invariant 1 | {path-to-invariant-doc} |
| Invariant 2 | {path-to-invariant-doc} |
| Invariant N | {path-to-invariant-doc} |

### Audited Files

| # | File | Type |
|---|------|------|
| 1 | {file-path} | {classification} |
| 2 | {file-path} | {classification} |

---

## Summary

| Category | Count |
|----------|-------|
| P0 | {n} |
| P1 | {n} |
| P2 | {n} |
| P3 | {n} |

---

## Overall {Suite} Score

| Invariant | Score | Notes |
|-----------|-------|-------|
| {invariant-name} | {n}/100 | {summary notes} |

---

## Findings

---

### Finding ID

```
{suite-abbrev}-{nnn}
```

---

### File

```
{file-path}
```

---

### Invariant Violated

```
{invariant-document-path}
```

---

### Severity

```
P0 / P1 / P2 / P3
```

---

### Violation Type

{short description of violation}

---

### Evidence

{exact code snippet or pattern found}

---

### Invariant Rule Violated

Reference the specific section from the invariant document:
- {invariant doc} §{section} — {rule description}

---

### Recommendation

{actionable remediation}

---

### Impact

{what breaks if not fixed}

---

---

## Transitional Violations

| Violation | Invariant | Impact | Migration | Target |
|-----------|-----------|--------|-----------|--------|

---

## Audit Traceability

| Audit Suite | Latest Report |
|-------------|---------------|
| {suite-name} | {report-path} |
