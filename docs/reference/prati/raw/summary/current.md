## Goal
- Complete statelessness and build integrity audits; fix all findings to reach 100/100 across both suites.
- Eliminate all TypeScript diagnostics from the build output.

## Constraints & Preferences
- `@stateless-exception` JSDoc tag required for documented persistence exceptions (ThemeProvider only).
- Build must be fully deterministic, zero-warning, zero P0/P1/P2.
- `package-lock.json` should be gitignored, not tracked.
- ESM + UMD dual-format output with correct `exports` map (`require` → UMD).
- Function-based globals for all MUI subpath imports (no guessing warnings).

## Progress
### Done
- **Statelessness audit**: 53/53 files P3 compliant (100/100).
- **Build integrity audit** (`npm run build`): 7 findings fixed; all dimensions 100/100.
- **TS diagnostics cleanup**: All dts plugin errors eliminated.
  - `verbatimModuleSyntax` (TS1484): ~40+ files fixed — all type-only imports use `import type` or inline `type` syntax.
  - `CanvasNote.tsx` (TS6133): unused destructured props and `literal` variable removed.
  - `router.ts` (TS2304/TS7006): `routerInstance` → `Router.instance` static field; `getInstance` made `static`; `s` param typed as `WorkflowStep`.
  - `storage.ts` (TS1294): private parameter properties converted to explicit field declarations + constructor body assignments.
  - `types.ts` (TS2304): `ScreenDefinition` and `WorkflowDefinition` added to `import type` in navigation/types.ts.
  - `tsconfig.app.json`: `"node"` added to `types` array (resolves `fs/promises`, `path`, `process` for `templateRenderer.ts`).
  - `appTheme.ts` (TS1484): `ThemeOptions` → `import type { ThemeOptions }`.
- **Lockfile**: `package-lock.json` added to `.gitignore` and untracked via `git rm --cached`.

### In Progress
- None. All known audit + diagnostic issues resolved.

### Blocked
- None.

## Key Decisions
- Lockfile untracked per user preference (not pinned in git).
- `output.globals` implemented as a function instead of static map.
- `build.lib.formats` removed as redundant with `rollupOptions.output` specifying `format`.
- `router.ts` singleton: stored as `private static instance` on the `Router` class, set in constructor.
- `storage.ts`: explicit properties over TS parameter properties to comply with `erasableSyntaxOnly`.

## Next Steps
- Run remaining audit suites if desired: `security-audit.md`, `architecture-audit.md`, etc.
- Or commit current changes.

## Critical Context
- Build completes with zero warnings. Only output is `[plugin vite:resolve]` externalized-browser informational messages for `fs/promises` and `path` (from `templateRenderer.ts` — correctly guarded behind runtime `isNode()` check).
- `vite build` output: `prati.es.js` (2.63 kB), `prati.umd.js` (1,077.88 kB), shared chunks + source maps.
- dts plugin: "Declaration files built in 3756ms" — zero diagnostics.
- `@types/node` already in `devDependencies` (no install needed).

## Relevant Files
- `src/common/theme/ThemeProvider.tsx`: `@stateless-exception` JSDoc tag + SSR guard.
- `src/common/components/molecules/JsonViewer.tsx`: `useEffect` for async style load.
- `vite.config.ts`: `sourcemap: true`, function-based `globals()`, no `lib.formats`.
- `package.json`: `main → prati.umd.js`, `exports.*.require → prati.umd.js`, `sideEffects: false`, React/ReactDOM only in `peerDependencies`.
- `tsconfig.app.json`: `types: ["vitest/globals", "node"]`.
- `src/proto-runtime/navigation/router.ts`: `Router.instance` static field, `WorkflowStep` typed param.
- `src/proto-runtime/persistence/storage.ts`: explicit property declarations.
- `docs/raw/report/statelessness/latest/`: Statelessness audit report (100/100).
- `docs/raw/report/build/latest/`: Build audit report (100/100).
- `.gitignore`: `package-lock.json` added.
