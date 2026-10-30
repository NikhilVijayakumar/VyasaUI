# Atomic Design Methodology: Feature Technical

## 1. Overview
The Atomic Design Methodology provides a structured decision framework for classifying UI components into one of four tiers: Atom, Molecule, Organism, or Template. It establishes design principles, anti-patterns per tier, and a flowchart-based decision tree to guide consistent classification.

## 2. Feature Summary
This methodology defines how components are evaluated and assigned to atomic design tiers based on their characteristics. It provides design principles including single responsibility per tier, composition over inheritance, explicit over implicit, documentation with examples, and verification on check-in. Anti-patterns are documented per tier to guide authors away from common classification mistakes.

## 3. Responsibilities
- Provide classification decision tree for tier assignment
- Define design principles for component authors
- Document anti-patterns per tier
- Ensure consistent classification methodology across the component library
- Enable documentation with examples for each tier

## 4. Non-Responsibilities
- Code enforcement or automated rule checking
- Visual design or screen layouts
- API contract definitions
- Architecture policy definition
- Component implementation

## 5. Architecture Mapping
| Architecture Rule | Technical Realization |
|---|---|
| Atomic Hierarchy | Decision tree assigns each component to one of four tiers (Atom, Molecule, Organism, Template) based on characteristics |
| Stateless UI | Design principles enforce that components remain pure rendering units; state logic is scoped per tier |
| Component Tiers | Decision tree evaluates child component count, state requirements, data dependencies, and layout role |
| Composition over Inheritance | Design principle explicitly prioritizes composition of smaller components over inheritance hierarchies |
| Explicit over Implicit | Classification criteria are documented and transparent; component tier is explicitly declared |

## 6. Responsibility Realization
| Responsibility | Technical Realization |
|---|---|
| Provide classification decision tree | Flowchart-based evaluation: count child components, assess state needs, evaluate data dependencies, determine layout role |
| Define design principles | Documented principles: single responsibility per tier, composition over inheritance, explicit over implicit, documentation with examples, verification on check-in |
| Document anti-patterns per tier | Catalog of common misclassifications and violations specific to each tier |
| Ensure consistent classification | Standardized evaluation criteria applied uniformly across all component reviews |

## 7. Workflow Realization
The classification workflow follows a decision tree: start with component evaluation (what does it render, does it have child components, how many, does it need state, does it fetch data, is it a layout structure) then traverse to the appropriate tier assignment. Each decision point considers component characteristics against tier definitions.

## 8. State Realization
| Functional State | Technical Realization |
|---|---|
| Classified | Component has been evaluated and assigned to a tier following the decision tree |
| Ambiguous | Component characteristics match multiple tier definitions; requires design review for resolution |
| Unclassified | Component has not been evaluated through the decision tree; pending classification |

## 9. Permission Realization
Classification decisions follow documented criteria accessible to all component authors. Ambiguous classifications are escalated to design review. Component library maintainers approve final tier assignments.

## 10. Validation Realization
Classification consistency is validated by reviewing the component against its assigned tier definition: verify child component types, verify state management approach, verify data interaction patterns, and verify layout responsibilities match tier expectations.

## 11. Error Realization
| Error Condition | Resolution |
|---|---|
| Component matches no tier definition | Escalate to design review for new tier or component restructuring |
| Component matches multiple tier definitions | Evaluate primary characteristics; the highest-matching tier is selected; document rationale |
| Anti-pattern violation detected | Refactor component to align with tier expectations or reassign tier |

## 12. Integration Realization
The Atomic Design Methodology integrates with:
- **Component Library**: Provides the classification framework that populates tier inventories
- **Design Review Process**: Ambiguous cases are resolved through collaborative review
- **Documentation System**: Each tier document captures examples and classification rules for reference

## 13. Ownership Mapping
| Artifact | Owner |
|---|---|
| Classification decision tree | Methodology authors |
| Design principles | Architecture team |
| Anti-pattern catalog | Component library maintainers |
| Tier definitions | Atomic design methodology authors |

## 14. Architecture Traceability
| Architecture Rule | Realization in Document |
|---|---|
| Atomic Hierarchy | Decision tree and tier definitions enforce the four-tier hierarchy |
| Stateless UI | Design principles reinforce stateless composition patterns |
| Component Tiers | Tier definitions and evaluation criteria operationalize the tier system |
| Composition over Inheritance | Explicit design principle governing component construction |

## 15. Feature Traceability
| Source Spec | Realization |
|---|---|
| Atomic Design Methodology for classifying UI components | Decision tree and evaluation criteria defined |
| Flowchart-based decision tree for tier assignment | Classification workflow documented |
| Design principles: single responsibility per tier, composition over inheritance, explicit over implicit, documentation with examples, verification on check-in | Five design principles defined with rationale |
| Anti-patterns per tier | Error realization captures common violations |
| States: Classified, Ambiguous, Unclassified | State realization with descriptions and transitions |

## 16. Open Questions
- What specific characteristics define the decision points in the classification flowchart?
- How is the Ambiguous state resolved in practice when characteristics overlap tiers?
- What is the verification mechanism referenced by the verification on check-in principle?
- How are anti-patterns communicated to component authors during development?
