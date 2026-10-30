# Proposal

## Why

The desktop currently contains a placeholder and a standalone prototype. Users need a functional phase-one interface backed by the installed Vyasa index and CLI, with evidence and uncertainty preserved.

## What Changes

- Connect the Electron application to a versioned, supported local Vyasa interface using the installed distribution and its configured data directory.
- Implement workspace and technology project browsing, project details and evidence, scan operations, review and status displays using Astra and Prati.
- Provide clear disconnected, unsupported, partial and error states; no fabricated records or automatic scans.
- Extend the Vyasa backend through its own lifecycle when required functionality is absent, and verify the deployed executable against the installed data.

## Capabilities

### New Capabilities

- `local-vyasa-integration`: secure local backend discovery, queries and explicit scanning.
- `project-workspace-interface`: evidence-aware phase-one project browsing and review.

### Modified Capabilities

None.

## Impact

Electron main, preload and renderer; Astra, Prati and MUI; the Vyasa CLI and backend deployment. Local database and configuration remain backend-owned. Shared component or architecture defects belong to Prati or Astra. No embedded terminal, external agent launch or phase-two synchronization is included.

## Knowledge References

- `knowledge/frontend-architecture.md` — Electron, Astra and Prati boundaries.
- `knowledge/concepts/evidence-and-provenance.md` and `knowledge/concepts/field-ownership.md` — evidence and ownership.
- `knowledge/design-system/index.md` — desktop design and accessibility.
