# Molecules: Feature Technical

## 1. Overview
Molecules compose two or more atoms into functional UI units with a single purpose. They are self-contained, reusable, and remain presentational or carry only lightweight UI state. Molecules form the second tier of the atomic design hierarchy, bridging primitive atoms and complex organisms.

## 2. Feature Summary
Molecules combine multiple atoms to create cohesive functional units. They serve a single purpose, are self-contained and reusable, and operate without data fetching, complex state management, or side effects. Molecules may hold lightweight UI state such as toggle or selection status.

## 3. Responsibilities
- Compose two or more atoms into a functional unit
- Serve a single, clearly defined purpose
- Remain self-contained and reusable across contexts
- Maintain presentational role with optional lightweight UI state
- Provide composition interfaces for organisms and templates

## 4. Non-Responsibilities
- Data fetching from repositories or services
- Complex state management (multi-step workflows, server synchronization)
- Side effects or lifecycle subscriptions
- Business logic execution
- Layout or page-level structure definition

## 5. Architecture Mapping
| Architecture Rule | Technical Realization |
|---|---|
| Atomic Hierarchy | Tier 1: composes atoms only; does not compose other molecules or organisms |
| Stateless UI | Only lightweight UI state permitted; no data fetching, business logic, or persistence |
| Theme Sovereignty | Visual styling via useTheme() hook delegating to composed atoms or applying tokens directly |
| Localization Invariant | User-facing text via useLanguage() hook for translation key resolution |
| Component Tiers | Tier 1: composes atoms, props and light UI state (toggle states, selection, visibility) |
| Hook Access | useTheme() and useLanguage() permitted; useDataState() not permitted at this tier |

## 6. Responsibility Realization
| Responsibility | Technical Realization |
|---|---|
| Compose two or more atoms | Imports and arranges multiple Atom components into a cohesive layout |
| Serve a single purpose | Component scope limited to one functional concern (displaying a notification, rendering an image with caption) |
| Remain self-contained | All dependencies are explicit; component carries everything needed to render |
| Maintain presentational role | No data fetching or business logic; output determined entirely by props and optional light state |
| Provide composition interfaces | Props serve as the sole API for higher-tier consumers |

## 7. Workflow Realization
Molecule creation workflow: identify a recurring pattern of atoms used together -> define the single purpose the combination serves -> compose the required atoms -> add optional lightweight UI state if needed -> verify no data fetching is introduced -> verify no side effects or complex state patterns -> register as Molecule tier component.

## 8. State Realization
| Functional State | Technical Realization |
|---|---|
| Compliant | Composes two or more atoms, serves single purpose, no data fetching, no complex state, no side effects |
| Borderline | Wraps a single atom without adding meaningful composition or behavior |
| Degraded | Performs data fetching, contains complex state logic, or introduces side effects |

## 9. Permission Realization
Any component author may propose a Molecule. Classification is validated against the composition rules of two or more atoms and the absence of data fetching. Borderline molecules (single atom wrappers) are reviewed for necessity. Degraded molecules require reclassification to Organism.

## 10. Validation Realization
Molecule validation checks: count of composed atoms (two or more required for compliance), verify absence of data fetching calls, verify state complexity is limited to lightweight UI state, verify no side effects present, verify single-purpose scope is maintained.

## 11. Error Realization
| Error Condition | Resolution |
|---|---|
| Wraps a single atom only (Borderline) | Evaluate necessity; if no added value, consider removing the wrapper. If justified, document rationale |
| Contains data fetching (Degraded) | Extract data fetching logic to a ViewModel and reclassify to Organism |
| Contains complex state logic (Degraded) | Migrate complex state management to Organism tier; molecule should accept state via props |
| Introduces side effects (Degraded) | Remove side effects or reclassify to Organism with appropriate lifecycle management |

## 12. Integration Realization
Molecules integrate with:
- **Atoms**: Import and compose atom components as children
- **Theme System**: Access theme tokens via useTheme() hook for molecule-level layout and spacing
- **Localization System**: Resolve translation keys via useLanguage() hook for molecule-level text
- **Organisms and Templates**: Molecules are consumed by organisms and templates as composable units

## 13. Ownership Mapping
| Artifact | Owner |
|---|---|
| Molecule component inventory | Component library maintainers |
| Composition rules and patterns | Atomic design methodology authors |
| Lightweight UI state guidelines | Component library maintainers |

## 14. Architecture Traceability
| Architecture Rule | Realization in Document |
|---|---|
| Atomic Hierarchy | Tier 1: composes atoms only, does not compose molecules or organisms |
| Stateless UI | Lightweight UI state only; no data fetching or business logic |
| Theme Sovereignty | Theme hook usage for visual consistency |
| Localization Invariant | Translation key usage for user-facing text |
| Component Tiers | Tier 1: atoms plus lightweight state |
| Hook Access | Limited to useTheme() and useLanguage() |

## 15. Feature Traceability
| Source Spec | Realization |
|---|---|
| Molecules compose 2+ atoms into functional units | Composition rules require two or more atoms |
| Characteristics: composed of atoms, single purpose, self-contained, reusable, presentational or light state | Each characteristic realized in responsibility and validation sections |
| Components: Card, Notification, TrendMetricCard, ImageViewer, MdViewer, JsonViewer | Component inventory under responsibilities |
| Rules: no data fetching, no complex state, no side effects | Three rules enforced via validation and error realization |
| States: Compliant, Borderline (single atom wrapper), Degraded (has data fetching/complex state) | State realization with detailed criteria and resolution paths |

## 16. Open Questions
- What threshold defines lightweight UI state versus complex state management?
- How are molecules distinguished from simple layout wrappers that only arrange atoms spatially?
- What is the process for handling a molecule that evolves to require data fetching?
- Are there predefined patterns for how molecules expose atom configuration through their own props?
