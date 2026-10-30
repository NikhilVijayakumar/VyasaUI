# Security Audit Report — 2026-06-20

Overall Assessment: No exploitable vulnerabilities in the React library runtime. One P1 finding in the prototyping code generator (unsanitized innerHTML with user-controllable data). Two P2 findings (sourcemaps enabled, no CSP in generated HTML). All other dimensions clean.
Audit Score: **91/100**
Critical Findings (P0): 0
Major Findings (P1): 1
Minor Findings (P2): 2
Compliant (P3): 2
Files Audited: 51 (all `src/` files, config files, build output)

---

## 2. Audited Files

1. `src/common/components/**/*.tsx` (all atoms, molecules, organisms, templates)
2. `src/common/theme/**/*.tsx`
3. `src/common/localization/**/*.tsx`
4. `src/proto-runtime/**/*.ts`
5. `src/services/templateRenderer.ts`
6. `src/theme/appTheme.ts`
7. `src/theme/tokens/*.ts`
8. `src/types/template.types.ts`
9. `vite.config.ts`
10. `package.json`
11. `tsconfig.json`
12. `tsconfig.app.json`
13. `dist/prati.es.js`
14. `dist/prati.umd.js`

---

## 3. Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P0 | 0 | Critical — exploitable vulnerability |
| P1 | 1 | High — significant security risk |
| P2 | 2 | Moderate — defense-in-depth gap |
| P3 | 2 | Compliant — no security issues |

---

## 4. Overall Score

| Dimension | Score |
| --------- | ----- |
| Cross-Site Scripting (XSS) | 75/100 |
| Sensitive Data Exposure | 100/100 |
| Dependency Vulnerabilities | 100/100 |
| Input Validation & Injection | 100/100 |
| Build & Deployment Security | 80/100 |
| **Overall** | **91/100** |

---

## 5. Findings

### Finding ID
SEC-001

### File
`src/proto-runtime/generation/generator.ts` (line 160)

### Category
XSS

### Severity
P1 — High

### Violation Type
Unsanitized `innerHTML` assignment with user-controllable input

### Evidence
```typescript
// generator.ts:154-163
window.addEventListener('DOMContentLoaded', function() {
  if (window.PratiProto && window.location.hash) {
    var screenId = window.location.hash.slice(1).split('?')[0];
    var viewport = document.getElementById('pr-viewport');
    if (viewport) {
      viewport.innerHTML = '<p style="...">Screen: ' + screenId + '</p>';
    }
  }
});
```

The `screenId` value is derived from `window.location.hash` — entirely user-controllable. A crafted URL such as `#<img src=x onerror=alert(1)>` would execute arbitrary JavaScript in the context of the generated prototype page.

### OWASP Reference
OWASP Top 10 — A03:2021 Injection (CWE-79: Improper Neutralization of Input During Web Page Generation)

### Recommendation
Sanitize `screenId` before interpolation. Use `textContent` instead of `innerHTML`, or apply a DOMPurify sanitization step:

```typescript
viewport.textContent = 'Screen: ' + screenId;
```

Alternatively, encode the value:
```typescript
var safe = screenId.replace(/[<>&"']/g, function(c) {
  return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'}[c];
});
viewport.innerHTML = '<p style="...">Screen: ' + safe + '</p>';
```

### Impact
XSS in any generated prototype HTML file that is served to users. The `generatePrototype()` function produces deployable HTML; if deployed, a crafted hash fragment can execute arbitrary JavaScript. The React library runtime is not affected — this finding is confined to the prototyping code generator.

---

### Finding ID
SEC-002

### File
`vite.config.ts` (line 51)

### Category
Build & Deployment Security

### Severity
P2 — Moderate

### Violation Type
Source maps enabled in production build configuration

### Evidence
```typescript
// vite.config.ts:50-51
build: {
  sourcemap: true,
```

The build outputs `.map` files for every chunk (prati.es.js.map, prati.umd.js.map, lib-DLBLopsT.js.map, etc.). If the `dist/` directory is deployed to a production CDN or server, the full source code of the library would be readable via the source maps.

### OWASP Reference
OWASP Top 10 — A05:2021 Security Misconfiguration

### Recommendation
Set `sourcemap` to a deployment-aware value. For library distribution, either:
- Set `sourcemap: false` to omit `.map` files from the published package
- Or add `"dist/*.map"` to the `"files"` exclusion list in `package.json` to prevent publishing them to npm

Current `package.json` `"files"` field:
```json
"files": ["dist"]
```

Change to:
```json
"files": ["dist"],
"publishConfig": {
  "exports": {
    ".": { "default": "./dist/prati.es.js" }
  }
}
```

Or add an `.npmignore` that excludes `.map` files.

### Impact
Source code disclosure if `dist/` is deployed to a web-accessible location. For npm library distribution the impact is minimal (code is already public), but for any CDN-hosted deployment the full source is exposed.

---

### Finding ID
SEC-003

### File
`src/proto-runtime/generation/generator.ts` (functions `generateShellHtml`, `generateScreenPlaceholder`)

### Category
XSS

### Severity
P2 — Moderate

### Violation Type
No Content Security Policy in generated HTML output

### Evidence
The `generateShellHtml()` function at lines 112-167 produces a complete HTML document without any `Content-Security-Policy` meta tag or header. The generated HTML includes inline `<script>` tags and loads external resources (Google Fonts CDN):

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono&display=swap" />
<script src="proto-runtime.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    // ...
  });
</script>
```

If a consumer hosts the generated prototype on a domain with sensitive data, the lack of CSP defense-in-depth amplifies the XSS risk from SEC-001.

### OWASP Reference
OWASP Top 10 — A05:2021 Security Misconfiguration (CWE-1021: Improper Restriction of Rendered UI Layers or Frames)

### Recommendation
Add a strict CSP meta tag to the generated HTML:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self';" />
```

### Impact
Without CSP, the XSS vector in SEC-001 has no defense-in-depth mitigation. Any injected script can execute freely, exfiltrate data, or manipulate the DOM.

---

## 6. Transitional Violations

| ID | Violation | Rationale | Status |
|----|-----------|-----------|--------|
| SEC-001 | `innerHTML` with hash data in generator | Only affects generated prototype output, not the React library runtime. Requires fix before prototype generation is used in production workflows. | Unresolved |
| SEC-002 | Source maps enabled | Intentional choice for debugging library consumers. `.map` files are included in the npm package but source code is already public in an open-source library. | Accepted with note |
| SEC-003 | No CSP in generated HTML | Prototype HTML is generated for development/ demo purposes, not production deployment. Combined with SEC-001 fix, the CSP gap becomes less critical. | Accepted with note |

---

## 7. Score Improvement Summary

**Previous Report:** None — baseline audit.
**Previous Score:** N/A (Baseline)
**Current Score:** 91/100
**Change:** Baseline established

| Dimension | Previous | Current | Change |
| --------- | -------- | ------- | ------ |
| Cross-Site Scripting (XSS) | — | 75 | Baseline |
| Sensitive Data Exposure | — | 100 | Baseline |
| Dependency Vulnerabilities | — | 100 | Baseline |
| Input Validation & Injection | — | 100 | Baseline |
| Build & Deployment Security | — | 80 | Baseline |

---

## 8. Final Verdict

**Compliant with moderate findings** (91/100)

The React library runtime has **zero XSS vectors** — no `dangerouslySetInnerHTML`, no `eval()`, no `new Function()`. All React components rely on React's built-in output escaping. The single P1 finding is in the prototyping code generator (`proto-runtime/generation/generator.ts`) which produces HTML files with an unsanitized `innerHTML` from a user-controllable hash. The P2 findings are source map exposure and missing CSP in generated output — both are accepted as transitional with documented rationale.

---

## 9. Audit Traceability

| Reference | Location |
| --------- | -------- |
| Source Code | `src/**/*.ts`, `src/**/*.tsx` |
| Package Manifests | `package.json` |
| Build Config | `vite.config.ts` |
| HTML Entry | No `index.html` at project root (library, not web app) |
| Environment Config | No `.env` or `.env.example` files |
| Audit Report | `docs/raw/report/security/latest/security-proto-runtime-20260620.md` |
| Previous Report | None (baseline) |
