# Architecture: Dependencies

Astra is a production UI library with a controlled dependency surface. See [Dependency Safety Invariant](../invariants/dependency-safety.md) for the authoritative rules.

## Dependency Classification

Dependencies fall into three categories:

| Category | Examples | Placement |
|----------|----------|-----------|
| **Peer** | `react`, `react-dom`, `axios` | `peerDependencies` |
| **Dev** | `typescript`, `vite`, `@types/*` | `devDependencies` |

## Runtime Dependencies

Astra has **no runtime `dependencies`**. It is a dependency-minimal library — all heavy-lifting packages (`axios`, `react`, `react-dom`) are peer dependencies supplied by the consumer. This prevents duplicate instances and keeps the bundle lean.

## Peer Dependencies

Peer dependencies are provided by the consumer. They must use a caret range to allow patch updates:

```json
{
  "peerDependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "axios": "^1.18.0"
  }
}
```

`axios` is a peer dependency because Astra's `ApiService` wraps it — forcing a second copy into a consumer's bundle would cause version conflicts and size bloat.

Astra has **no dependency on any design system** (`@mui/material`, `@emotion/react`, `prati`, etc.). Design systems depend on Astra, not the reverse. See [Public API Surface](api-surface.md) for the invariant.

Peer dependencies must never appear in `dependencies` — doing so causes duplicate instances.

## Dev Dependencies

Type definitions and build tooling belong in `devDependencies`:

```json
{
  "devDependencies": {
    "@types/react": "^19.2.3",
    "@types/react-dom": "^19.2.3",
    "@types/uuid": "^10.0.0",
    "typescript": "5.8.3",
    "vite": "6.3.2"
  }
}
```

Never place `@types/*` packages in `dependencies` — they are build-time only.

## Beta Dependencies

Beta or pre-release dependencies must not appear in `peerDependencies` or `devDependencies` without documentation. If a beta is required, record the rationale and migration timeline in this file.

## Audit Policy

Run security audits regularly:

```bash
npm audit            # check for vulnerabilities
npm audit --fix      # auto-fix where possible
```

High-severity CVEs must be resolved before release. If a fix is unavailable, document the risk and mitigation in a security advisory.

## Lockfile

The lockfile must be committed to version control for reproducible installs. Never add `package-lock.json` to `.gitignore`.

## Related

- [Build](build.md)
- [Public API Surface](api-surface.md)
- [Platform Abstraction](platform-abstraction.md)
