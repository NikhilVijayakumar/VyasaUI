# Runtime Map: Build Pipeline

Maps the build process from source to distribution artifact.

```
Source Files
     │
     ├── TypeScript Compiler (tsc)
     │     │
     │     └── type-checking, emits .d.ts + .js
     │
     ├── Vite Bundler
     │     │
     │     ├── resolve imports
     │     ├── tree-shake unused exports
     │     └── bundle to dist/
     │
     ├── Lockfile (package-lock.json)
     │     │
     │     └── ensures identical dependency tree across environments
     │
     └── Environment Variables
           │
           ├── VITE_* vars injected at build time
           └── defaults from .env.example
```

## Determinism Points

| Stage | Deterministic? | Risk |
|-------|--------------|------|
| tsc | ✅ Yes | None |
| Vite bundle | ✅ Yes | Timestamp injection if not configured |
| npm install | ✅ Yes (with lockfile) | Non-reproducible without lockfile |
| Env vars | ⚠️ Conditional | Missing defaults cause non-determinism |

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/deterministic-build.md` | Build must be reproducible |
| `core/build.md` | Build guidance |
