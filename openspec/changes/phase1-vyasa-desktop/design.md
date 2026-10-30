# Design

## Context

The installed Windows Vyasa CLI currently supports only `scan` and `profile-context`; indexed project queries exist as Python application services and MCP tools. The user requested a CLI/backend integration rather than a desktop MCP client.

## Goals / Non-Goals

**Goals:** use a versioned backend-owned interface, preserve local data and provide phase-one desktop workflows.

**Non-Goals:** direct SQLite schema coupling, embedded terminal, autonomous agent execution and phase-two synchronization.

## Decisions

- Add a structured, read-only CLI query interface in Vyasa using its existing application query services. The UI must not implement database queries independently. CLI schemas and deployment belong to the backend change.
- The Electron main process validates operations and invokes the configured executable with argument arrays; preload exposes only explicit channels via context isolation. The renderer uses Astra IPC and state and Prati presentation.
- Scans are explicit and use backend-supported scope only. Never emulate an unsupported workspace or project scope.
- Workspace membership, available technologies, workspace names, and scan scope are backend-owned contracts. A workspace selector must filter indexed results in the backend, including pagination; filtering one loaded page in the renderer is insufficient.
- A project scan must not run the existing whole-root absence reconciliation against a subset of that root. The backend must define and test project-scoped reconciliation before the UI exposes the action.
- Installation/data paths are configurable locally and must not assume a developer-specific machine path when distributed.

## Risks / Trade-offs

- Backend query, version and scope support may require separate backend changes → specify, test and deploy those changes before enabling the corresponding controls.
- Untrusted repository data → render as text and retain backend-provided provenance.
- User index → queries open read-only; tests use isolated fixtures rather than changing live data.
