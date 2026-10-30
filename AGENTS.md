## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:

- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Dependency and product ownership

For architecture, state, IPC, reusable UI, or cross-repository integration work, follow [dependency ownership](skills/shared/vyasa-dependency-ownership/SKILL.md).

- Fix shared architecture, MVVM, state, and transport-abstraction defects in Astra; fix reusable UI components, design-system tokens, themes, and localization defects in Prati.
- Implement Vyasa-specific product behavior, feature composition, integration wiring, knowledge, requirements, and OpenSpec in this repository.
- Use Astra and Prati public APIs; do not duplicate or bypass a missing or defective shared capability with a local workaround. Identify and fix the capability in its owning dependency, then verify the dependency and this application together.
- Determine ownership from the cause and public contract, not merely where a symptom appears. Follow workspace permissions when a dependency fix requires editing another repository; record any blocked fix and do not claim it is complete.
