# Glossary

Concept-to-feature ownership map for the Prati feature corpus.

## Purpose

The Glossary is the authoritative mapping between domain concepts and the features that own them. Every concept used across multiple feature documents has exactly one owning feature that defines its behavior.

## Responsibilities

- Map every cross-cutting concept to its owning feature
- Resolve naming ambiguity (e.g., "template" in two contexts)
- Provide a single entry point for concept discovery

## Glossary

| Concept | Owning Feature | Definition |
|---------|---------------|------------|
| Theme | Theming System | Light/dark mode state, persistence, and context |
| Design Token | Design Tokens | Visual primitives: colors, spacing, typography |
| Theme Toggle | ThemeToggle | UI control that switches light/dark mode |
| Translation | Localization System | Runtime language switching with dictionaries |
| Translation Key | Translation Patterns | Dot-notation key naming conventions |
| Template (Server-Side) | Template System | Handlebars HTML generation for email/notifications |
| Component | Component Library | UI components organized by atomic design |
| Atomic Design | Atomic Design Methodology | Classification rules for UI components |
| Atom | Atoms | Primitive UI elements (StatusDot, Badge, etc.) |
| Molecule | Molecules | Composed functional units (Card, Notification, etc.) |
| Organism | Organisms | Complex UI sections (DataTable, FormLayout, etc.) |
| Template (UI) | Component Templates | Page-level layout structures |
| Proto Runtime | Proto Runtime | Interactive prototype generation system |
| Prototype Generation | Prototype Generation | Spec-to-prototype scaffolding |
| Persistence | Persistence | Local data retention for prototypes |
| Navigation | Navigation | Screen and workflow navigation |
| HTML Component | HTML Components | Framework-independent prototype UI |
| Boilerplate | Prototype Boilerplate | Standardized prototype foundation |
| Mock Data | Mock Data | Prototype datasets and seeding |
| Loading State | LoadingState | Spinner with localized text |
| Error State | ErrorState | Error message display |
| Empty State | EmptyState | No-data indicator |
| Status Indicator | StatusDot | Color-coded status dot |
| Severity Label | SeverityBadge | Color-coded severity badge |
| Authorization | Authorization Model | Cross-cutting permission rules |
| State Lifecycle | State Management | Async state lifecycle (loading → error → empty → success) |

## Business Rules

1. **Single ownership** — Every cross-cutting concept is owned by exactly one feature; shared concepts reference the owner rather than duplicating definition
2. **Glossary is authoritative** — The glossary is the single source of truth for concept-to-feature mapping; inline definitions in individual feature docs must not contradict the glossary
3. **All features represented** — Every feature directory in the corpus must have at least one entry in the glossary
4. **No orphan concepts** — Every glossary concept must map to an existing feature document; stale entries must be removed or updated

## States

- **Current** — Glossary reflects the current feature corpus
- **Stale** — New features added without updating the glossary

## Edge Cases

- **Concept used in multiple features**: The glossary assigns single ownership; dependent features reference the owning feature
- **Ambiguous concept name**: Clarified in the Definition column

## Error Conditions

- **Orphan glossary entry** — Concept maps to a feature document that no longer exists
- **Missing feature entry** — A feature directory exists but is not represented in the glossary
- **Contradictory definition** — Feature doc inline definition contradicts the glossary entry

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Orphan glossary entry | Remove the stale entry or update it to point to the correct feature document |
| Missing feature entry | Add the feature and its concepts to the glossary |
| Contradictory definition | Align the feature doc inline definition with the glossary; glossary is authoritative |

## See Also

- [Authorization Model](./authorization.md) — cross-cutting permission rules
- [State Management](../state/README.md) — async state lifecycle

## Verification

- **Full coverage test**: Enumerate every feature directory and verify at least one glossary entry maps to it
- **Orphan detection test**: Cross-reference glossary entries against existing feature documents; flag any entry that maps to a missing file
- **Contradiction detection test**: For 3 random glossary entries, verify the linked feature doc does not contradict the glossary definition

## Future Enhancements

- Automated glossary validation against feature doc cross-references
- Machine-readable format for tooling consumption
