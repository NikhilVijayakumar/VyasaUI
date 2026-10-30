# Phase-one data capture proposal

This explains the mockup's intended data flow. It is not a claim that these UI integrations already exist or that every field is supported by the backend.

| UI information | Proposed source | Important distinction |
|---|---|---|
| Workspace names and roots | Vyasa configuration or another explicitly owned local configuration | Confirm canonical-name ownership and storage. |
| Project list, technology, evidence and scan status | Vyasa deterministic scanner and its local index, accessed through a supported backend interface | The UI does not independently scan or infer facts; preserve observation status, source, coverage and time. |
| OpenSpec and OKF setup, skills, mappings, agent configuration, Graphify, Git metadata | Supported deterministic detectors reading defined project files | Inventory differs from conformance, agent runtime availability, task correctness or complete coverage. Unsupported fields remain unknown. |
| Project report and deeper assessment | A coding agent works outside the app and writes the project-owned .vyasa/project-report.md; a later explicit scan indexes the bounded report | Report content is declared/agent-authored material, not a deterministic fact or an automatically verified result. |
| Human verification and comments | Human-maintained application or portfolio data | Ownership, persistence, per-finding identifiers, history and synchronization are undecided. A scan must not silently overwrite reviews. |
| UI version | This UI application's own build/package metadata | It is distinct from the backend's version. |
| Backend/CLI version and installation | A documented, verified Vyasa version/installation interface | Do not infer a software version from database schema or path. Compatibility and missing/inaccessible states need contracts. |

The intended candidate is a local Vyasa command-line integration for explicit scans and supported queries. Specify executable discovery, exact commands, output schema, version reporting, timeouts, cancellation, failure mapping, and read-only index access before implementation. Avoid assuming the CLI already exposes every screen's data. If it lacks a needed capability, define the backend change; do not invent a shell command or bypass ownership.

MCP is a protocol and can be used by a programmatic client without an LLM. The user's preferred workflow is nevertheless CLI/backend access for the desktop app and optional MCP use by an external coding agent for deeper analysis. No embedded terminal or agent launch is in scope.
