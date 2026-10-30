# Security Audit Report — Astra

Overall Assessment:  **Excellent**
Final Score:         **9.9 / 10**
P0 Findings:         0
P1 Findings:         0
P2 Findings:         1 (Accepted risk)
P2 Resolved:         1 (SEC-001)
P3 (Compliant):      13

---

## Files Audited

| File | Purpose |
|------|---------|
| `src/common/hooks/useDataState.ts` | ViewModel hook |
| `src/common/components/organisms/AppStateHandler.tsx` | Conditional-render component |
| `src/common/components/organisms/AppStateContext.ts` | Context + Provider |
| `src/common/repo/ApiService.ts` | HTTP client |
| `src/common/repo/apiServiceFactory.ts` | Singleton factory |
| `src/common/repo/IpcService.ts` | Electron IPC client |
| `src/common/repo/ServerResponse.ts` | Response wrapper |
| `src/common/repo/HttpStatusCode.ts` | Status enum + resolver |
| `src/common/repo/APITypes.ts` | Internal response types |
| `src/common/state/AppState.ts` | State contract types |
| `src/common/hooks/useDataState.test.ts` | Tests |
| `src/lib.ts` | Public entry point |
| `package.json` | Dependency manifest |
| `vite.config.ts` | Build configuration |
| `dist/astra.es.js` | Production ESM bundle |
| `dist/astra.umd.js` | Production UMD bundle |
| `.gitignore` | Exclusion rules |

---

## 2. Source Inventory

| File | Security-Relevant Characteristics |
|------|-----------------------------------|
| `useDataState.ts` | State management only. Object spread with typed `Partial<AppState<T>>`. No DOM, no storage, no eval. |
| `AppStateHandler.tsx` | Renders React elements via JSX. No `dangerouslySetInnerHTML`. All slots are ReactNode or FC — passed by the consumer. |
| `AppStateContext.ts` | `createContext({})` with empty default. No rendering. No DOM. |
| `ApiService.ts` | Axios-based HTTP client. URL concatenation (bare string append). Uses `onError` callback (no `console.error`). |
| `IpcService.ts` | Electron IPC bridge. Calls `window.electronAPI` guarded by optional chaining. Uses `onError` callback. |
| `apiServiceFactory.ts` | Module-level `Map` singleton cache keyed by `baseUrl`. |
| `ServerResponse.ts` | Private constructor factory. No external data deserialization. |
| `HttpStatusCode.ts` | Enum + switch/literal resolver. No user input touches switch. |
| `APITypes.ts` | Pure type declarations. No runtime code. |
| `AppState.ts` | Enum + interface declarations. No runtime code. |
| `lib.ts` | Barrel re-export. No runtime code. |
| `dist/astra.es.js` | No `eval()`, no `new Function()`, no `.map` sourcemap file. |
| `dist/astra.umd.js` | No `eval()`, no `new Function()`, no `.map` sourcemap file. |

---

## 3. XSS Report

### Check: `dangerouslySetInnerHTML`

No usage in any source file. **P3.**

### Check: `eval()` / `new Function()`

Grep across `src/**` and `dist/*.js`: no matches. **P3.**

### Check: `innerHTML` assignment

No direct DOM manipulation in any source file. **P3.**

### Check: `document.write()`

No usage. **P3.**

### Check: Unsanitized URL / href from user input

`AppStateHandler.tsx` renders no links. `ApiService.ts` constructs URLs as:
```
url: `${this.baseUrl}/${url}`
```
This is an HTTP request URL, not a rendered link. It is not set as `href`, `src`, or `action` in any DOM element. `IpcService.ts` communicates via Electron IPC channels (strings), not URLs. **P3.**

### Check: Dynamic `src`/`href` from untrusted sources

No component in the library sets `src` or `href` from props or external data. All rendering slots are ReactNode/FC that consumers control. **P3.**

### Check: `postMessage` handlers

No `postMessage` listener in any source file. **P3.**

### XSS Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No `dangerouslySetInnerHTML` | P3 | — |
| No `eval` / `new Function` in source | P3 | — |
| No `eval` / `new Function` in bundle | P3 | — |
| No `innerHTML` assignment | P3 | — |
| No `document.write` | P3 | — |
| No unsanitized URL injection | P3 | — |
| No dynamic `href`/`src` from untrusted input | P3 | — |
| No `postMessage` eval | P3 | — |

---

## 4. Sensitive Data Exposure Report

### Check: Hardcoded API keys, tokens, or secrets

No hardcoded credentials, tokens, or secrets in any source file. **P3.**

### Check: `localStorage` / `sessionStorage` for sensitive data

No `localStorage` or `sessionStorage` usage in any source file. **P3.**

### Check: Sensitive data in `console.log` / exposed to UI

**Previously: SEC-001 (P2) — RESOLVED.**

Previous report found `console.error` in `ApiService.ts`. Current code replaces it with an `onError` callback:

`ApiService.ts:43`:
```typescript
this.onError?.(error);
```

`IpcService.ts:50`:
```typescript
this.onError?.(error);
```

No `console.*` calls exist in any library source. **P3.**

### Check: Environment variables leaking into bundle

`vite.config.ts` uses no `define` field. No `import.meta.env.VITE_*` usage in source. No `.env` files exist. **P3.**

### Check: Internal URLs, IP addresses, credentials in comments

No hardcoded URLs, IPs, or credentials in source comments. **P3.**

### Sensitive Data Exposure Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No hardcoded credentials | P3 | — |
| No `localStorage`/`sessionStorage` for sensitive data | P3 | — |
| No sensitive console logging | P3 | ~~SEC-001~~ RESOLVED |
| No env variable leakage into bundle | P3 | — |
| No internal infrastructure in source | P3 | — |

---

## 5. Dependency Vulnerability Report

### Check: npm audit

```
npm audit result: 0 vulnerabilities (0 info, 0 low, 0 moderate, 0 high, 0 critical)
```

405 packages audited. 0 vulnerabilities. **P3.**

Note: esbuild GHSA-g7r4-m6w7-qqqr (previously Low) remains resolved via `"overrides": { "esbuild": "^0.28.1" }` in `package.json`.

### Check: Committed lockfile — SEC-002 (Accepted Risk)

`package-lock.json` is in `.gitignore` and not committed to the repository. **This is intentional** — the project maintainer explicitly accepts the supply chain determinism tradeoff to avoid lockfile merge conflicts.

Without a committed lockfile:
- Dependency resolution is non-deterministic between environments
- `npm install` (not `npm ci`) resolves from scratch on fresh clones
- Supply chain drift is theoretically possible

**Risk accepted. P2.**

### Check: Deprecated packages with known security issues

No deprecated packages with known CVEs. **P3.**

### Check: Known malicious packages

No known malicious packages. **P3.**

### Dependency Vulnerability Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| 0 npm audit vulnerabilities | P3 | — |
| Lockfile committed | P2 | SEC-002 (Accepted) |
| No deprecated packages with CVEs | P3 | — |
| No known malicious packages | P3 | — |

---

## 6. Input Validation Report

### Check: `JSON.parse` on untrusted input

No `JSON.parse` calls in any source file. Axios handles response deserialization internally with its own try/catch. `IpcService` receives already-deserialized values from Electron's `invoke`. **P3.**

### Check: Prototype pollution via object merge

`useDataState.ts` spreads `customInitialState: Partial<AppState<T>>`:
```typescript
const [appState, setAppState] = useState<AppState<T>>({
  ...getInitialState<T>(),
  ...customInitialState,
});
```
ES2015+ object spread uses `[[OwnPropertyKeys]]` which does not copy `__proto__`. The spread target is a freshly created object literal, so even `{ __proto__: ... }` cannot mutate the global prototype. **P3.**

`apiServiceFactory.ts` uses `Map` for caching:
```typescript
const apiServiceCache = new Map<string, ApiService>();
```
`Map` is immune to prototype pollution — its internal storage is separate from `Object.prototype`. **P3.**

### Check: `__proto__` / `constructor` / `prototype` access on user objects

No access to these properties on any externally-supplied object. `literal: Record<string, string>` is accessed via bracket notation only with hardcoded string keys from the switch statement. **P3.**

### Check: URL validation for user-provided links

`ApiService.ts` constructs HTTP request URLs:
```
url: `${this.baseUrl}/${url}`
```
This is passed to axios as a request target, not rendered in the DOM. Axios will make the HTTP request to whatever URL is constructed. No DOM href is set. **P3.**

### Check: File path traversal

No file I/O in the library source. `scripts/clean-dist.js` is a build-time script not included in the published package (`"files": ["dist"]`). **P3.**

### Input Validation Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No unsafe `JSON.parse` on external data | P3 | — |
| No prototype pollution via spread | P3 | — |
| No `Map`-based prototype pollution | P3 | — |
| No `__proto__`/`constructor` access on user objects | P3 | — |
| No DOM href from unsanitized URL | P3 | — |
| No file path traversal | P3 | — |

---

## 7. Build & Deployment Security Report

### Check: Sourcemaps in production bundle

`vite.config.ts`:
```typescript
build: {
  sourcemap: false,
  ...
}
```
Explicitly disabled. No `.map` files in `dist/`. **P3.**

### Check: `eval()` in production bundle

Grepped `dist/astra.es.js` and `dist/astra.umd.js` for `eval(` and `new Function(`: **0 matches**. **P3.**

### Check: SRI for CDN-loaded scripts

`index.html` loads no CDN scripts. Published package (`"files": ["dist"]`) does not include `index.html`. No SRI concern. **P3.**

### Check: Content Security Policy

`index.html` has no CSP meta tag — but `index.html` is the dev harness only, not shipped to consumers. CSP is a consumer application responsibility. **P3.**

### Check: Dev-only code in production bundle

Entry point is `src/lib.ts`. `src/main.tsx` and `src/App.tsx` are excluded from the build and do not re-export from `src/lib.ts`. Confirmed absent from `dist/lib.d.ts`. **P3.**

### Check: Lockfile committed

See SEC-002 in §5. **P2 (Accepted).**

### Build & Deployment Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| Sourcemaps disabled in production | P3 | — |
| No `eval`/`new Function` in bundles | P3 | — |
| No CDN SRI gap | P3 | — |
| CSP not applicable (library) | P3 | — |
| Dev code absent from production bundle | P3 | — |

---

## 8. Findings Summary

### P0 — Critical

| ID | File | Finding |
|----|------|---------|
| — | — | No P0 findings |

### P1 — High

| ID | File | Finding |
|----|------|---------|
| — | — | No P1 findings |

### P2 — Moderate

| ID | File | Finding | Status |
|----|------|---------|--------|
| ~~SEC-001~~ | ~~`ApiService.ts`~~ | ~~Unconditional `console.error`~~ | **RESOLVED** (replaced with `onError` callback) |
| SEC-002 | `.gitignore` (`/package-lock.json`) | Lockfile not committed — supply chain integrity floats across environments | **Accepted Risk** (intentional; maintainer prefers avoiding merge conflicts) |

---

## 9. Transitional Violations

| ID | File | Violation | Rationale | Migration Plan |
|----|------|-----------|-----------|----------------|
| SEC-002 | `.gitignore` | `package-lock.json` not committed | Intentionally excluded to avoid lockfile merge conflicts in a published library | None — risk accepted by maintainer |

---

## 10. Scoring Breakdown

| Dimension | Raw Score | Deductions | Weight | Weighted Score |
|-----------|-----------|------------|--------|----------------|
| XSS | 10.0 | none | 25% | 2.500 |
| Sensitive Data Exposure | 10.0 | none (SEC-001 resolved) | 25% | 2.500 |
| Dependency Vulnerabilities | 9.5 | −0.5 (SEC-002 P2 — accepted) | 20% | 1.900 |
| Input Validation | 10.0 | none | 20% | 2.000 |
| Build & Deployment | 10.0 | none | 10% | 1.000 |

```
Total Score: 2.500 + 2.500 + 1.900 + 2.000 + 1.000 = 9.900 → 9.9 / 10
```

---

## 11. Score Improvement Summary

```
Previous Report: security-audit-2026-06-20-2339.md
Previous Score:  9.9 / 10
Current Score:   9.9 / 10
Change:          No change
```

| Dimension | Previous | Current | Change |
|-----------|----------|---------|--------|
| XSS | 10.0 | 10.0 | 0 |
| Sensitive Data Exposure | 10.0 | 10.0 | 0 |
| Dependency Vulnerabilities | 9.5 | 9.5 | 0 |
| Input Validation | 10.0 | 10.0 | 0 |
| Build & Deployment | 10.0 | 10.0 | 0 |

### Resolved Findings (from previous report)

| ID | Severity | Resolution |
|----|----------|------------|
| SEC-001 | P2 | Replaced `console.error` with optional `onError` callback in `ApiService` constructor. Confirmed still fixed in current code. |

### New Findings (vs. previous report)

None. All findings carried forward without change.

---

## 12. Final Verdict

```
Excellent (9.9/10)
```

Astra maintains a strong security posture. All five dimensions score 10/10 except Dependency Vulnerabilities (9.5) due to the intentionally uncommitted lockfile (SEC-002, accepted risk). Zero P0/P1 findings across 405 dependencies and 17 source files.

Key strengths:
- **XSS**: Zero attack surface — all rendering through React's built-in escaping, no `dangerouslySetInnerHTML`, no eval, no DOM manipulation
- **Sensitive Data**: No secrets in source, no `console.*` calls, no client-side storage
- **Dependencies**: Zero CVEs across all 405 packages (esbuild advisory resolved via override)
- **Input Validation**: No prototype pollution vectors, no unsafe `JSON.parse`, no path traversal
- **Build**: Sourcemaps disabled, no eval in production bundle, dev code excluded

The sole open finding (SEC-002 — lockfile not committed) is an intentional, documented acceptance by the project maintainer.

---

## 13. Audit Traceability

| Reference | Location |
|-----------|----------|
| Source | `src/**` |
| Dependencies | `package.json`, `package-lock.json` (not committed) |
| Build Config | `vite.config.ts` |
| OWASP Reference | OWASP Top 10 2021 (external) |
| Audit Report | `docs/raw/report/security/latest/security-audit-2026-06-21-1345.md` |
| Previous Report | `docs/raw/report/security/archive/security-audit-2026-06-20-2339-archive-.md` |
