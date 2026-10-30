# Runtime Map: Dependency Graph

Maps the dependency structure of an Astra project at install time.

```
Consumer Project
     │
     ├── astra (library)
     │     │
     │     ├── @mui/material (runtime)
     │     ├── @mui/icons-material (runtime)
     │     ├── @emotion/react (runtime)
     │     ├── @emotion/styled (runtime)
     │     ├── axios (runtime)
     │     └── handlebars (runtime — template rendering)
     │
     ├── react (peer)
     ├── react-dom (peer)
     │
     └── devDependencies
           ├── typescript
           ├── vite
           ├── @types/react
           ├── @types/react-dom
           └── @types/uuid
```

## Dependency Categories

| Category | Purpose | Version Strategy |
|----------|---------|-----------------|
| Runtime | Shipped with Astra | Exact pin |
| Peer | Provided by consumer | Caret range |
| Dev | Build-only | Exact or caret |

## Audit Trail

```
npm audit → vulnerability report
npm ls     → dependency tree
npm ci     → clean install from lockfile
```

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/dependency-safety.md` | Dependencies must be auditable |
| `core/dependencies.md` | Dependency guidance |
| `core/build.md` | Lockfile and CI guidance |
