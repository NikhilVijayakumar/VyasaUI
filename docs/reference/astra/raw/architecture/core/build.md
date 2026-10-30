# Architecture: Deterministic Build

Astra's build process must produce reproducible artifacts. See [Deterministic Build Invariant](../invariants/deterministic-build.md) for the authoritative rules.

## Lockfile

Commit your lockfile (`package-lock.json`) to version control. This ensures all environments install identical dependency trees:

```bash
# .gitignore must NOT exclude the lockfile
git add package-lock.json
```

## Dependency Pinning

Pin all direct dependencies to exact versions. Use `--save-exact` when installing:

```bash
npm install --save-exact axios@1.15.0
```

For peer dependencies (React, MUI), use a caret range to allow patch updates:

```json
{
  "peerDependencies": {
    "react": "^19.2.3"
  }
}
```

## Environment Variables

All build-time environment variables must have documented defaults in `.env.example`:

```env
# .env.example
VITE_API_BASE_URL=http://localhost:3000
VITE_DEFAULT_LANGUAGE=en
```

The build must not crash when environment variables are missing — fall back to defaults:

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

## CI Configuration

Use a single lockfile across all CI environments. Avoid platform-specific overrides that could produce different outputs:

```yaml
# ci.yml — use same install command everywhere
- run: npm ci
```

## Build Scripts

Define standard build scripts in `package.json`:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

Avoid non-deterministic steps (date stamps, random hashes, environment-sensitive paths) in the build pipeline.

## Verification

Verify determinism by building twice and comparing:

```bash
npm run build && mv dist dist1
npm run build && mv dist dist2
diff -r dist1 dist2  # must produce no output
```

## Electron Build

Electron applications require a dual-process build: the **renderer** (React UI) and the **main process** (Node.js). Use `vite-plugin-electron` to bundle both from a single Vite config.

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',       // main process entry (consumer-owned)
        onstart(args) { args.startup(); },
      },
      {
        entry: 'electron/preload.ts',    // preload script (consumer-owned, Prana contract)
        onstart(args) { args.reload(); },
      },
    ]),
    renderer(),
  ],
});
```

### Entry Points

| File | Process | Owner |
|------|---------|-------|
| `electron/main.ts` | Main | Consumer (Prana-provided or consumer-owned) |
| `electron/preload.ts` | Preload | Consumer — exposes `window.electronAPI` via `contextBridge` |
| `src/main.tsx` | Renderer | Consumer (Astra-powered React app) |

### Packaging

Use `electron-builder` to produce distributable artifacts:

```json
{
  "scripts": {
    "build": "vite build",
    "build:electron": "electron-builder"
  }
}
```

Define build targets in `electron-builder.config.js` or the `build` field of `package.json`.

### Environment Variables

| Context | Access | Convention |
|---------|--------|------------|
| Renderer (React) | `import.meta.env.VITE_*` | Prefix with `VITE_` |
| Main process (Node.js) | `process.env.*` | No prefix restriction |

Main process variables must not be prefixed `VITE_` — they are not injected into the renderer bundle.

### Determinism Rules

Electron builds must satisfy the same determinism invariant as web builds:

- no timestamps in bundle output
- no random identifiers
- all env vars have documented defaults in `.env.example`
- lockfile committed

See [Deterministic Build Invariant](../invariants/deterministic-build.md) for the full rule set.

---

## Related

- [Feature Structure](feature-structure.md)
- [Repository](repository.md)
- [Dependencies](dependencies.md)
- [Electron Integration Guide](../integration-contracts/electron.md)
