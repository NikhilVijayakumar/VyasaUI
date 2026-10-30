# Organisms: Feature Technical

## 1. Overview
Organisms are complex UI sections that compose molecules and atoms into discrete, self-contained functional areas. They represent the highest tier of compositional logic, with significant state management, data interaction capabilities, and responsibility for orchestrating lower-tier components.

## 2. Feature Summary
Organisms compose three or more molecules or multiple atom types to create complex UI sections. They manage significant state, may fetch and persist data via ViewModel hooks, and represent discrete functional areas of the application. Organisms are self-contained and encapsulate both presentation and behavior.

## 3. Responsibilities
- Compose three or more molecules or multiple distinct atom types
- Manage significant application state
- Interact with data via ViewModel hooks and repository access
- Serve as discrete, self-contained functional sections
- Coordinate behavior across composed molecules and atoms

## 4. Non-Responsibilities
- Defining page-level layout (delegated to Templates)
- Visual design or screen mockups
- Duplicating state management already available in ViewModel
- Direct repository access outside of ViewModel hooks
- Cross-organism communication (handled by parent template or page)

## 5. Architecture Mapping
| Architecture Rule | Technical Realization |
|---|---|
| Atomic Hierarchy | Tier 2: composes molecules and atoms; sits below Templates but above Molecules |
| Stateless UI | Organisms may manage state but remain rendering-focused; business logic delegated to ViewModel hooks |
| Theme Sovereignty | Visual styling via useTheme() hook; may compose themed atoms and molecules |
| Localization Invariant | User-facing text via useLanguage() hook for translation key resolution |
| Component Tiers | Tier 2: composes molecules and atoms, may use ViewModel hooks for data access |
| Hook Access | useTheme(), useLanguage(), and useDataState() all permitted at this tier |
| Repository Access | Permitted exclusively through ViewModel hooks; never direct |

## 6. Responsibility Realization
| Responsibility | Technical Realization |
|---|---|
| Compose molecules and atoms | Imports and arranges multiple Molecule and Atom components into a functional section |
| Manage significant state | Utilizes useDataState() via ViewModel hooks for data lifecycle management |
| Interact with data | ViewModel hooks encapsulate repository access and data transformation |
| Serve as discrete sections | Each organism encapsulates one complete functional area with clear boundaries |
| Coordinate lower-tier components | Molecules and atoms receive data and callbacks through props; coordination logic lives in the organism |

## 7. Workflow Realization
Organism creation workflow: identify a discrete functional area requiring data interaction -> compose the required molecules and atoms for the section -> define ViewModel hooks for data access and state management -> connect data flow from ViewModel to composed components -> verify data access is through ViewModel hooks only -> verify the organism remains a discrete, self-contained section -> register as Organism tier component.

## 8. State Realization
| Functional State | Technical Realization |
|---|---|
| Idle | Organism is ready but has not initiated any data operation |
| Loading | Organism has initiated a data request and is awaiting response via ViewModel state |
| Error | Organism encountered a failure during data operation; error state is exposed via ViewModel |
| Success | Organism has successfully loaded data and is rendering with populated content |
| Empty | Organism completed a data operation successfully but received no data to display |

## 9. Permission Realization
Organism creation is authorized for feature teams implementing discrete functional sections. ViewModel hooks must follow the repository access pattern. Organism classification is validated during architecture review to ensure the component cannot be achieved at a lower tier.

## 10. Validation Realization
Organism validation checks: verify composition includes three or more molecules or multiple atom types, verify state management uses ViewModel hooks with useDataState(), verify data access is through ViewModel hooks only, verify the organism is a discrete section, verify no page-level layout responsibilities are present.

## 11. Error Realization
| Error Condition | Resolution |
|---|---|
| Organism composes fewer than three molecules | Evaluate if the component can be simplified to a Molecule |
| Direct repository access without ViewModel | Refactor to use ViewModel hooks for all data access |
| Page-level layout responsibility mixed in | Extract layout concerns to Template tier |
| Cross-organism communication via shared state | Implement communication through parent template or shared ViewModel |

## 12. Integration Realization
Organisms integrate with:
- **Molecules and Atoms**: Import and compose lower-tier components
- **ViewModel Layer**: Access data and state through ViewModel hooks using useDataState()
- **Repository Layer**: Indirect access only via ViewModel hooks
- **Theme System**: Visual tokens via useTheme() hook
- **Localization System**: Translation keys via useLanguage() hook
- **Templates**: Organisms are placed within Template layouts as content sections

## 13. Ownership Mapping
| Artifact | Owner |
|---|---|
| Organism component inventory | Component library maintainers |
| ViewModel hook definitions | Feature teams |
| Data flow patterns | Architecture team |
| State management patterns | Architecture team |

## 14. Architecture Traceability
| Architecture Rule | Realization in Document |
|---|---|
| Atomic Hierarchy | Tier 2: composes molecules and atoms |
| Stateless UI | State management permitted but rendering-focused; business logic in ViewModel |
| Theme Sovereignty | Theme hook usage maintains visual consistency |
| Localization Invariant | Translation key usage for all user-facing text |
| Component Tiers | Tier 2: molecules, atoms, and ViewModel hooks |
| Hook Access | Full hook access including useDataState() |
| Repository Access | Permitted only through ViewModel hooks |

## 15. Feature Traceability
| Source Spec | Realization |
|---|---|
| Organisms are complex UI sections composing molecules and atoms | Definition and composition rules documented |
| Characteristics: complex composition, significant state/logic, data interactions, discrete sections, self-contained | Each characteristic realized in responsibilities and validation |
| Components: DataTable, FormLayout, DrawerComponent, ToolbarComponent, FileViewerRouter, CsvViewer | Component inventory documented |
| Rules: 3+ molecules or multiple atom types, significant state management, may fetch data | Composition and state rules enforced through validation |
| States: Idle, Loading, Error, Success, Empty | Five-state lifecycle documented with ViewModel mapping |

## 16. Open Questions
- What constitutes a discrete section boundary for organism decomposition?
- How are ViewModel hooks shared across multiple organisms when data overlaps?
- What is the escalation path when an organism grows beyond its functional boundary?
- How are shared organism-level error states communicated to the template or page?
