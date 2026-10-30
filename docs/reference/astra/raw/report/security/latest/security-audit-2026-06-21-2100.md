# Security Audit Report — Astra

Overall Assessment:  **Excellent**
Final Score:         **9.9 / 10**
P0 Findings:         0
P1 Findings:         0
P2 Findings:         1 (Accepted risk — SEC-002, carried from previous audit)
P3 (Compliant):      14

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
| `src/common/repo/APITypes.ts` | Internal response types |
| `src/common/repo/types.ts` | ITransportService, Platform |
| `src/common/state/AppState.ts` | State contract types |
| `src/common/state/HttpStatusCode.ts` | Status enum + resolver (moved from repo/) |
| `src/common/state/StateCode.ts` | Synthetic status codes |
| `src/lib.ts` | Public entry point |
| `package.json` | Dependency manifest |
| `vite.config.ts` | Build configuration |
| `dist/astra.es.js` | Production ESM bundle |
| `dist/astra.umd.js` | Production UMD bundle |

---

## 2. Source Inventory

| File | Security-Relevant Characteristics |
|------|-----------------------------------|
| `useDataState.ts` | State management only. Object spread with typed `Partial<AppState<T>>`. No DOM, no storage, no eval. |
| `AppStateHandler.tsx` | Renders React elements via JSX. No `dangerouslySetInnerHTML`. All slots are `ReactNode` or `FC` — controlled by consumer. |
| `AppStateContext.ts` | `createContext({})` with empty default. No rendering. No DOM. |
| `ApiService.ts` | Axios-based HTTP client. URL concatenation (`baseUrl + "/" + url`). `onError` callback — no `console.*`. |
| `IpcService.ts` | Electron IPC bridge. All calls to `window.electronAPI` guarded via optional chaining. `onError` callback. No console output. |
| `apiServiceFactory.ts` | Module-level `Map` singleton cache keyed by `baseUrl`. |
| `ServerResponse.ts` | Private constructor factory. No external data deserialization. |
| `state/HttpStatusCode.ts` | Enum + switch/literal resolver (moved from `repo/`). No user input touches switch directly. |
| `state/StateCode.ts` | Enum declaration only. No runtime behavior. |
| `APITypes.ts` | Pure type declarations. No runtime code. |
| `AppState.ts` | Enum + interface declarations. No runtime code. |
| `lib.ts` | Barrel re-export. No runtime code. |
| `dist/astra.es.js` | No `eval()`, no `new Function()`, no `.map` sourcemap file. |
| `dist/astra.umd.js` | No `eval()`, no `new Function()`, no `.map` sourcemap file. |

**Structural change since last audit**: `HttpStatusCode` moved from `src/common/repo/HttpStatusCode.ts` to `src/common/state/HttpStatusCode.ts`. `StateCode.ts` extracted as new file. No security implications — both are pure enum + function declarations with no DOM, storage, or network access.

---

## 3. XSS Report

### Check: `dangerouslySetInnerHTML`

No usage in any source file. Grep across `src/**`: 0 matches. **P3.**

### Check: `eval()` / `new Function()`

Grep across `src/**` and `dist/*.js`: 0 matches. **P3.**

### Check: `innerHTML` assignment

No direct DOM manipulation in any source file. Grep across `src/**`: 0 matches. **P3.**

### Check: `document.write()`

No usage. **P3.**

### Check: Unsanitized URL / href from user input

`AppStateHandler.tsx` renders no links. `ApiService.ts` constructs URLs as:
```typescript
url: `${this.baseUrl}/${url}`
```
This is an axios HTTP request target, not set as `href`, `src`, or `action` on any DOM element. `IpcService.ts` communicates via Electron IPC channel strings — not rendered in the DOM. **P3.**

### Check: Dynamic `src`/`href` from untrusted sources

No component sets `src` or `href` from props or external data. All rendering slots are `ReactNode` or `FC` supplied by the consumer. Astra renders no anchor or image tags. **P3.**

### Check: `postMessage` handlers

No `window.addEventListener('message', ...)` or `postMessage` in any source file. `IpcService` uses `window.electronAPI` (Electron's contextBridge API), not postMessage. **P3.**

### Check: `errorMessage` prop flow

`AppStateHandler` passes `errorMessage?: string` as `message` prop to the consumer's `ErrorComp`:
```tsx
if (ErrorComp) return <ErrorComp message={errorMessage} />;
```
`errorMessage` is typed as `string`. It flows from the consumer's JSX callsite through React's prop system to the consumer's component. React's JSX rendering escapes string content. No Astra component renders this string as raw HTML. **P3.**

### XSS Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No `dangerouslySetInnerHTML` | P3 | — |
| No `eval` / `new Function` in source | P3 | — |
| No `eval` / `new Function` in bundles | P3 | — |
| No `innerHTML` assignment | P3 | — |
| No `document.write` | P3 | — |
| No unsanitized URL injection into DOM | P3 | — |
| No dynamic `href`/`src` from untrusted input | P3 | — |
| No `postMessage` eval | P3 | — |

---

## 4. Sensitive Data Exposure Report

### Check: Hardcoded API keys, tokens, or secrets

No hardcoded credentials, tokens, API keys, or secrets in any source file. Grep across `src/**`: 0 matches. **P3.**

### Check: `localStorage` / `sessionStorage` for sensitive data

No `localStorage` or `sessionStorage` usage anywhere in `src/**`. **P3.**

### Check: Sensitive data in `console.*` / exposed to UI

No `console.log`, `console.error`, `console.warn`, or `debugger` statements in any source file. Grep: 0 matches.

`ApiService.ts` and `IpcService.ts` surface errors via the optional `onError` callback:
```typescript
this.onError?.(error);
```
Consumer controls whether and how errors are logged. **P3.**

`IpcService.ts` hardcodes transport error strings in `statusMessage`:
```typescript
statusMessage: 'Electron API not available'
statusMessage: 'IPC invoke failed'
statusMessage: error.message  // when Error is thrown
```
`error.message` from a caught IPC exception flows into `ServerResponse.statusMessage`. This is internal transport error messaging returned to the consumer — not printed to console or rendered in the DOM by Astra. Consumer decides whether to display it. **P3.**

### Check: Environment variables leaking into bundle

`vite.config.ts` contains no `define` field. No `import.meta.env.VITE_*` references in source. No `.env` files exist in the project root. **P3.**

### Check: Internal URLs, IP addresses, credentials in comments

No hardcoded URLs, IPs, or credentials in source comments. **P3.**

### Sensitive Data Exposure Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No hardcoded credentials | P3 | — |
| No `localStorage`/`sessionStorage` for sensitive data | P3 | — |
| No sensitive `console.*` output | P3 | ~~SEC-001~~ RESOLVED in prior audit |
| No env variable leakage into bundle | P3 | — |
| No internal infrastructure in source | P3 | — |

---

## 5. Dependency Vulnerability Report

### Check: npm audit

```
npm audit result: found 0 vulnerabilities
```

0 vulnerabilities across the full dependency tree. **P3.**

Note: `esbuild` GHSA-g7r4-m6w7-qqqr remains mitigated via `"overrides": { "esbuild": "^0.28.1" }` in `package.json`.

### Check: Committed lockfile — SEC-002 (Accepted Risk, carried)

`package-lock.json` is in `.gitignore` and not committed to the repository. This is intentional — the project maintainer explicitly accepts the supply chain determinism tradeoff to avoid lockfile merge conflicts.

Without a committed lockfile:
- Dependency resolution is non-deterministic between environments
- `npm install` resolves from scratch on fresh clones
- Supply chain drift is theoretically possible between CI runs

**Risk accepted. P2.**

### Check: Deprecated packages with known security issues

No deprecated packages with known CVEs in the dependency tree. **P3.**

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

No `JSON.parse` calls in any source file. Axios handles HTTP response deserialization internally. `IpcService` receives already-deserialized values from Electron's `contextBridge.invoke`. **P3.**

### Check: Prototype pollution via object spread

`useDataState.ts` merges `customInitialState: Partial<AppState<T>>`:
```typescript
const [appState, setAppState] = useState<AppState<T>>({
  ...getInitialState<T>(),
  ...customInitialState,
});
```
ES2015+ object spread uses `[[OwnPropertyKeys]]` which does not traverse the prototype chain and does not copy `__proto__`. The spread target is a fresh object literal. Even a crafted `{ __proto__: ... }` payload cannot mutate `Object.prototype` via object spread. **P3.**

`apiServiceFactory.ts` uses `Map` for the singleton cache:
```typescript
const apiServiceCache = new Map<string, ApiService>();
```
`Map` stores entries in internal slots, separate from `Object.prototype`. Immune to prototype pollution. **P3.**

### Check: `__proto__` / `constructor` / `prototype` access on user-supplied objects

No access to these properties on any externally-supplied object. `literal: Record<string, string>` in `ApiService` and `getStatusMessage` is accessed only with hardcoded string keys (`literal['success_message']`, etc.) from a closed switch statement. No user-controlled key reaches bracket notation. **P3.**

### Check: IpcService data trust boundary

`IpcService.receive` delivers data from `window.electronAPI` push events directly to the consumer callback:
```typescript
const wrappedCallback = (data: unknown) => {
  callback(data as T);
};
```
`data as T` is a TypeScript type assertion with no runtime behavior. Data from Electron IPC is treated as trusted (originating from the main process). Astra is a pattern library — consumers are responsible for validating and sanitizing IPC data before rendering. No Astra-level injection risk. **P3.**

### Check: URL validation for user-provided links

`ApiService.ts` constructs HTTP request URLs:
```typescript
url: `${this.baseUrl}/${url}`
```
Passed to axios as an HTTP request target. Not rendered in the DOM. Not set as any DOM attribute. Axios's responsibility ends at making the request. No client-side SSRF risk (browser sandbox enforces same-origin and CORS at the network layer). **P3.**

### Check: File path traversal

No file I/O in the library source. `scripts/clean-dist.js` is a build-time script excluded from the published package (`"files": ["dist"]`). **P3.**

### Input Validation Compliance Table

| Check | Status | Finding |
|-------|--------|---------|
| No unsafe `JSON.parse` on external data | P3 | — |
| No prototype pollution via spread | P3 | — |
| No `Map`-based prototype pollution | P3 | — |
| No `__proto__`/`constructor` access on user objects | P3 | — |
| No DOM href from unsanitized URL | P3 | — |
| No file path traversal | P3 | — |
| IpcService data trust boundary | P3 | — |

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
Explicitly disabled. Confirmed: no `.map` files in `dist/`. **P3.**

### Check: `eval()` in production bundles

Grepped `dist/astra.es.js` and `dist/astra.umd.js` for `eval(` and `new Function(`: **0 matches**. `minify: "esbuild"` used — esbuild does not introduce eval. **P3.**

### Check: SRI for CDN-loaded scripts

`index.html` loads no CDN scripts. Published package (`"files": ["dist"]`) does not include `index.html`. No SRI concern for Astra itself. **P3.**

### Check: Content Security Policy

`index.html` has no CSP meta tag — but `index.html` is the dev harness only, excluded from `dist/` and the published package. CSP is a consumer application responsibility. **P3.**

### Check: Dev-only code in production bundle

Entry point is `src/lib.ts`. `src/main.tsx` and `src/App.tsx` are not imported from `src/lib.ts` and are not included in the build. `dts` plugin explicitly excludes test and story files. Confirmed absent from type declarations. **P3.**

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
| SEC-002 | `.gitignore` | `package-lock.json` not committed — supply chain integrity non-deterministic across environments | **Accepted Risk** |

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
| Sensitive Data Exposure | 10.0 | none | 25% | 2.500 |
| Dependency Vulnerabilities | 9.5 | −0.5 (SEC-002 P2 accepted) | 20% | 1.900 |
| Input Validation | 10.0 | none | 20% | 2.000 |
| Build & Deployment | 10.0 | none | 10% | 1.000 |

```
Total Score: 2.500 + 2.500 + 1.900 + 2.000 + 1.000 = 9.900 → 9.9 / 10
```

---

## 11. Score Improvement Summary

```
Previous Report: security-audit-2026-06-21-1345.md
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

None. No previously open findings (SEC-002 is accepted, not resolved).

### New Findings (not in previous report)

None.

### Structural Changes Audited Since Last Report

| Change | Security Impact |
|--------|----------------|
| `HttpStatusCode` moved from `src/common/repo/` to `src/common/state/` | None — pure enum + function declaration; no DOM, storage, or network access |
| `StateCode.ts` added to `src/common/state/` | None — enum declaration only |
| `src/common/repo/HttpStatusCode.ts` deleted | None |
| `state/index.ts` exports `StateCode` from two sources (TS2308 risk) | None — type-system issue only; no runtime security impact |

---

## 12. Final Verdict

```
Excellent (9.9 / 10)
```

Astra's security posture is unchanged and strong. The `HttpStatusCode` layer migration (repo/ → state/) is a pure structural refactor with zero security implications. All five audit dimensions maintain their prior scores.

Key strengths:
- **XSS**: Zero attack surface — all rendering through React's built-in escaping; no `dangerouslySetInnerHTML`, no eval, no DOM manipulation across 14 source files
- **Sensitive Data**: No secrets, no `console.*` calls, no client-side storage; error data flows via optional `onError` callback at consumer discretion
- **Dependencies**: 0 CVEs across full dependency tree; esbuild advisory mitigated via `overrides`
- **Input Validation**: No prototype pollution vectors, no unsafe `JSON.parse`, no path traversal; IpcService data trust boundary is an intentional, documented consumer contract
- **Build**: Sourcemaps disabled, no eval in production bundles, dev code excluded from dist

Sole open finding: SEC-002 (lockfile not committed) — intentional, documented, accepted by project maintainer.

---

## 13. Audit Traceability

| Reference | Location |
|-----------|----------|
| Source | `src/**` |
| Dependencies | `package.json`, `package-lock.json` (not committed) |
| Build Config | `vite.config.ts` |
| OWASP Reference | OWASP Top 10 2021 (external) |
| Audit Report | `docs/raw/report/security/latest/security-audit-2026-06-21-2100.md` |
| Previous Report | `docs/raw/report/security/archive/security-audit-2026-06-21-1345.md` |
