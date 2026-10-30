# Security Audit Prompt

You are acting as:

- Application Security Engineer
- Vulnerability Researcher
- Secure Code Reviewer
- Dependency Security Auditor

Your task is to audit Prati's codebase and dependencies for security issues.

This is a standalone security audit suite — not derived from a single invariant document but applied against general secure coding best practices and OWASP guidelines relevant to a React UI library.

---

## Mental Model

| Attack Surface | Risk Type | Typical Location |
|----------------|-----------|-----------------|
| XSS (Cross-Site Scripting) | Injection | `dangerouslySetInnerHTML`, raw HTML, unescaped URLs |
| Dependency vulnerabilities | Supply chain | `package.json`, lockfile |
| Sensitive data exposure | Information disclosure | Logs, error messages, client-side tokens |
| Prototype pollution | Object manipulation | Deep merge, recursive assign, object spread with untrusted input |
| Insecure direct object reference | Access control | API calls exposing internal IDs |
| Misconfigured CSP | Content security | Meta tags, server configuration |
| Insecure randomness | Predictable tokens | `Math.random()` for security-sensitive values |
| Local storage of secrets | Credential exposure | `localStorage.setItem('token', ...)` |

---

## Inputs

You will receive:

- All source files from `src/`
- Package manifests: `package.json`, `package-lock.json`
- Build configuration: `vite.config.ts`
- HTML entry point: `index.html`
- Environment configuration: `.env`, `.env.example`

---

## Audit Goal

Determine whether the codebase follows security best practices for a React UI library:

- no XSS vulnerabilities in component rendering
- no sensitive data exposed in client-side bundles
- no prototype pollution from unsafe object operations
- no hardcoded secrets, tokens, or API keys
- dependencies free of known critical/high CVEs
- proper Content Security Policy considerations
- secure randomness for any security-sensitive operations
- no unsafe `eval()` or dynamic code execution
- proper input sanitization for user-provided content

---

## Audit Scope

Focus ONLY on security concerns.

Ignore:
- visual design and styling
- coding style and formatting
- feature completeness
- architectural layering (covered by other audit suites)

unless they have security implications.

---

## Required Audit Dimensions

Analyze ALL of the following:

---

### 1. Cross-Site Scripting (XSS)

Detect:
- `dangerouslySetInnerHTML` usage
- `eval()` or `new Function()` calls
- `innerHTML` assignments
- `document.write()` calls
- unsanitized URL or link href generation from user input
- dynamic `src` or `href` attributes from untrusted sources
- `postMessage` handlers that eval or set innerHTML

Allowed:
- [ ] Sanitized HTML rendering via DOMPurify or similar
- [ ] Static or validated URL schemes only
- [ ] Content rendered through React's built-in escaping

Forbidden:
- [ ] No unsafe innerHTML from user-controlled data
- [ ] No eval or dynamic code execution
- [ ] No unsanitized URL assignment from untrusted input

Severity mapping:
- P0: dangerouslySetInnerHTML with untrusted data, eval() with user input, unvalidated postMessage
- P1: dangerouslySetInnerHTML with trusted data but no sanitizer, dynamic href with unsanitized input
- P2: documented XSS risk with sanitizer in place but no CSP
- P3: no XSS vectors found

---

### 2. Sensitive Data Exposure

Detect:
- hardcoded API keys, tokens, or secrets in source files
- `localStorage` or `sessionStorage` for sensitive data (auth tokens, credentials)
- sensitive data in console.log, error messages exposed to UI
- environment variables containing secrets leaked into client bundle
- internal URLs, IP addresses, or credentials in source comments
- exposed debugging endpoints or internal routes

Allowed:
- [ ] Environment variables prefixed with `VITE_` (explicitly client-safe)
- [ ] Server-side-only secrets in `.env` (not bundled)
- [ ] Sanitized error messages to end users

Forbidden:
- [ ] No hardcoded secrets, API keys, or tokens
- [ ] No sensitive data in client-side storage without justification
- [ ] No internal infrastructure exposure in client code

Severity mapping:
- P0: hardcoded API key, auth token, or credentials in source
- P1: secrets committed but in .env (not gitignored properly), localStorage for auth tokens
- P2: internal URLs or debug endpoints in client bundle (documented)
- P3: no sensitive data exposure found

---

### 3. Dependency Vulnerabilities

Detect:
- dependencies with known CVEs (run `npm audit`)
- packages with high/ critical severity vulnerabilities without fix
- deprecated packages with known security issues
- packages with known supply chain attacks
- missing lockfile preventing integrity verification

Allowed:
- [ ] Regularly audited dependencies (npm audit passing)
- [ ] Lockfile committed for integrity verification
- [ ] Minimal dependency tree (reduced attack surface)

Forbidden:
- [ ] No critical severity CVEs without fix
- [ ] No known malicious packages
- [ ] No deprecated packages with known security issues

Severity mapping:
- P0: critical CVE without fix, known malicious package
- P1: high severity CVE, deprecated package with security issues
- P2: moderate CVE with planned fix, informational advisories
- P3: all dependencies clear of known vulnerabilities

---

### 4. Input Validation & Injection

Detect:
- `JSON.parse()` on untrusted input without try/catch
- unsafe object merging or deep cloning with untrusted keys
- `__proto__`, `constructor`, `prototype` access patterns on user objects
- URL validation missing for user-provided links
- file path traversal in any file-related operations
- unsafe `toString()` or implicit string coercion of objects

Allowed:
- [ ] Schema-validated JSON parsing
- [ ] Safe object merge (explicit key allowlist, no prototype pollution)
- [ ] Strict URL scheme validation

Forbidden:
- [ ] No prototype pollution vectors
- [ ] No unchecked JSON.parse on external data
- [ ] No path traversal in file operations

Severity mapping:
- P0: prototype pollution vector, unsanitized JSON.parse from external source
- P1: missing URL validation for user-provided links, object merge without key validation
- P2: try/catch without specific error handling
- P3: all input properly validated

---

### 5. Build & Deployment Security

Detect:
- sourcemaps enabled in production build (`.map` files deployed)
- missing Subresource Integrity (SRI) for CDN-loaded scripts
- missing or permissive Content Security Policy
- `eval()` or `new Function()` in build output (from dependencies)
- dev-only code included in production bundle

Allowed:
- [ ] Sourcemaps disabled or restricted in production build
- [ ] SRI hashes for external resources
- [ ] Strict CSP defined in HTML or server config

Forbidden:
- [ ] No sourcemaps in production (unless restricted)
- [ ] No eval in production build
- [ ] No CSP bypass vectors

Severity mapping:
- P0: sourcemaps in production exposing full source code
- P1: eval in production bundle, missing CSP
- P2: dev-only code in production (documented)
- P3: production build properly hardened

---

## Finding Format

Each finding MUST include:

```
### Finding ID
SEC-{nnn}

### File
{file-path}

### Category
XSS / Sensitive Data / Dependency / Injection / Build

### Severity
P0 / P1 / P2 / P3

### Violation Type
{short description}

### Evidence
{exact code snippet}

### OWASP Reference
{relevant OWASP category or CWE}

### Recommendation
{actionable remediation}

### Impact
{what breaks if exploited}
```

---

## Severity Classification

| Severity | Meaning | Action |
|----------|---------|--------|
| P0 | Critical — exploitable vulnerability | Must fix before release |
| P1 | High — significant security risk | Must mitigate next release |
| P2 | Moderate — defense-in-depth gap | Address in planned cycle |
| P3 | Compliant — no security issues | No action required |

---

## Output Specification

The audit report MUST include:

1. **Audit Metadata** — timestamp, commit, suite, module reviewed
2. **Audited Files** — numbered list of files reviewed
3. **Summary** — count per severity (P0-P3)
4. **Overall Score** — per-category score out of 100
5. **Findings** — detailed per-finding using the Finding Format above
6. **Transitional Violations** — accepted risks with documented rationale
7. **Audit Traceability** — reference to the audit suite and report location

The report MUST be written to:

```
docs/raw/report/security/latest/security-{module}-{timestamp}.md
```

---

## Invariant Authority

When checking compliance:

- OWASP Top 10 and CWE are external references for severity calibration
- Do NOT flag React's built-in escaping as insufficient — XSS findings must demonstrate actual injection paths
- Dependency findings should cross-reference with library-governance audit to avoid duplication
- Flagging a pattern as P0 requires demonstrating a realistic exploit path, not theoretical risk

---

# Required Report Structure

## 1. Executive Summary

```text
# Security Audit Report — {timestamp}

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
| Cross-Site Scripting (XSS) | X/100 |
| Sensitive Data Exposure | X/100 |
| Dependency Vulnerabilities | X/100 |
| Input Validation & Injection | X/100 |
| Build & Deployment Security | X/100 |
| **Overall** | **X/100** |

## 5. Findings

All detailed findings using the Finding Format.

## 6. Transitional Violations

Accepted risks with documented rationale.

## 7. Score Improvement Summary

Compare against the previous report from `docs/raw/report/security/archive/` (highest timestamp). If no previous report exists, state "Baseline — no prior report to compare."

```text
Previous Report: {filename}
Previous Score: X/100
Current Score: Y/100
Change: +N / -N / No change
```

| Dimension | Previous | Current | Change |
| --------- | -------- | ------- | ------ |
| Cross-Site Scripting (XSS) | X | Y | +N |
| Sensitive Data Exposure | X | Y | +N |
| Dependency Vulnerabilities | X | Y | +N |
| Input Validation & Injection | X | Y | +N |
| Build & Deployment Security | X | Y | +N |

If score improved, highlight the categories that drove the improvement and what fixes were applied since the prior audit. If score declined, flag regressions with specific category breakdowns.

## 8. Final Verdict

```text
{Assessment} ({Score}/100)
```

## 9. Audit Traceability

| Reference | Location |
| --------- | -------- |
| Source Code | src/** |
| Package Manifests | package.json, package-lock.json |
| Build Config | vite.config.ts |
| HTML Entry | index.html |
| Environment Config | .env, .env.example |
| Audit Report | docs/raw/report/security/latest/security-{module}-{timestamp}.md |
| Previous Report | docs/raw/report/security/archive/{previous-filename} |

---

# Report Rotation

Before writing the new report, rotate the previous report:

```text
mv docs/raw/report/security/latest/* docs/raw/report/security/archive/
mkdir -p docs/raw/report/security/latest
```

---

# Output Location

Write the final report to:

```text
docs/raw/report/security/latest/security-{module}-{timestamp}.md
```
