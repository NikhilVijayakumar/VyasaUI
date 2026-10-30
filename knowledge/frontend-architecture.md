---
type: Architecture
title: Vyasa UI frontend architecture
description: Desktop process boundaries and Astra and Prati responsibilities.
status: draft
tags: [electron, react, astra, prati, mvvm]
---

# Responsibilities

Vyasa UI is the desktop frontend for the same Vyasa product and domain as the Python backend. Electron owns desktop lifecycle and privileged platform operations; React renders the user interface. Vyasa owns indexing, discovery, domain facts, and their evidence. Frontend presentation must preserve backend meanings rather than recreate detection or infer missing facts.

Astra supplies MVVM and asynchronous state primitives. Organize feature code into models, repositories, ViewModel hooks, presentational components, and page containers. Repositories provide the interface to data sources, and views render supplied state and emit interactions. The specific connection to Vyasa and its process lifecycle remain open.

Use Astra's public `useDataState`, `AppStateHandler`, `ServerResponse` and, for Electron IPC, `IpcService` according to their supported contracts. The application owns feature-specific repositories and the narrowly exposed preload and main-process handlers. Electron IPC between renderer and main is separate from the still-undecided connection between main and Vyasa.

Prati supplies the design system, components, theme and localization. At the application root its ThemeProvider wraps LanguageProvider; application providers live inside them. Astra's AppStateProvider can use Prati loading, error, and empty components. Check the installed public APIs and local architecture documentation when implementing.

Use Prati's public components, theme tokens and localization APIs directly. Compose Vyasa-specific screens from those capabilities. If an Astra or Prati capability is broken, missing or insufficient for its shared responsibility, document the defect and fix it in the responsible dependency; do not replace it with a local compatibility layer or duplicate implementation. Verify the dependency fix and the consuming application together before relying on it.

The [design system](/design-system/index.md) describes the visual foundations and interaction standards used by the desktop interface.

# Trust boundary

The renderer is isolated from Node. Any privileged operation requires a narrow, explicit main-process interface, with validation and error handling. Repository content and backend responses are untrusted data. An Electron IPC channel is distinct from the backend's MCP transport; the choice of backend transport, client, process ownership, and error mapping has not been made.

# Source maintenance

The local architecture and design documentation is maintained as part of this project. Keep it consistent with installed dependency versions and update it when this project's architecture changes.
