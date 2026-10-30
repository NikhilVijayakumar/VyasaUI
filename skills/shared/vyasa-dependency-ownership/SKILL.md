---
name: vyasa-dependency-ownership
description: Route Vyasa UI architecture, state, IPC, design-system, component, and product changes to the correct owning project; use when implementing or debugging these boundaries.
---

# Vyasa UI dependency ownership

Use the local knowledge and architecture references to identify the intended public contract before implementation. Diagnose the cause and confirm whether it is shared library behavior or Vyasa-specific behavior.

## Route the change

- **Astra:** shared MVVM architecture, state management, response types, repository abstractions and Electron IPC abstractions. Consume its public APIs rather than cloning or replacing them here.
- **Prati:** reusable components, design-system primitives, tokens, themes and localization capabilities. Compose its public components in the application; fix reusable component defects in Prati.
- **Vyasa UI:** product requirements and OpenSpec, product-specific screens and feature composition, models and repository methods, presentation, app-specific theme configuration through supported APIs, and Electron preload/main integration wiring.
- **Vyasa backend:** project discovery, index, domain facts, evidence and backend contracts. The renderer-to-main IPC boundary is distinct from the main-to-backend transport; specify and test both.

## Work through a shared dependency defect

1. Reproduce the issue and identify the public capability, expected behavior and responsible owner. Check the installed dependency version and local reference documentation.
2. Define the required shared fix in the owning dependency, respecting its compatibility and test conventions. Do not introduce a local compatibility shim, duplicate implementation or workaround for a missing or defective shared capability.
3. Make the necessary dependency change when the workspace and permissions allow it. If it cannot be changed, document the blocker and its effect; do not silently substitute or claim the issue is resolved.
4. Consume a suitable dependency revision, verify its public contract and relevant dependency tests, then run the affected Vyasa UI checks and integration tests. Report unverified checks and any dependency-release or installation blocker.
5. Update this repository's product knowledge, requirements and OpenSpec when the product behavior or integration contract changes. Record the ownership and dependency version needed for reproducible use.

User instructions and workspace permissions govern cross-repository changes; this skill does not grant filesystem access or authorization to publish, push, or release a dependency.
