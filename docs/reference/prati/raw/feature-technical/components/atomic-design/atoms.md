# Atoms: Feature Technical

## 1. Overview
Atoms are fundamental UI primitives representing the lowest tier of the atomic design hierarchy. They render single visual elements, accept minimal props, maintain no internal state, and serve as the foundational building blocks for all higher-tier components.

## 2. Feature Summary
Atoms provide the smallest reusable UI units with single responsibility, no child component dependencies, and minimal configuration props (one to three). They are purely presentational with no state logic and are designed to be composable within molecules, organisms, and templates.

## 3. Responsibilities
- Render a single primitive UI element
- Accept only presentation configuration props
- Maintain zero internal state
- Provide composable interfaces for higher-tier consumers
- Integrate with theme and localization hooks for visual and textual consistency

## 4. Non-Responsibilities
- Composing child components (no component imports)
- Managing state or side effects
- Fetching data or interacting with repositories
- Defining layout structures
- Implementing business logic

## 5. Architecture Mapping
| Architecture Rule | Technical Realization |
|---|---|
| Atomic Hierarchy | Atoms are Tier 0, the foundation of the hierarchy; no other Atom can import them |
| Stateless UI | Atoms are pure rendering units with no data fetching, business logic, or persistence |
| Theme Sovereignty | Visual styling via useTheme() hook for token-based appearance |
| Localization Invariant | User-facing text via useLanguage() hook for translation key resolution |
| Component Tiers | Tier 0: no child components, props only, no internal state |
| Hook Access | useTheme() and useLanguage() permitted; useDataState() not permitted at this tier |

## 6. Responsibility Realization
| Responsibility | Technical Realization |
|---|---|
| Render single primitive UI element | Component renders one visual element (indicator, badge, text, icon) without composition |
| Accept presentation config props | Props limited to visual configuration (size, color variant, label) |
| Maintain zero internal state | No state hooks, no lifecycle management, no side effects |
| Provide composable interfaces | Consistent prop interfaces enabling straightforward use by parent components |
| Integrate with theme and localization | useTheme() for visual tokens; useLanguage() for translation key resolution |

## 7. Workflow Realization
Atom creation workflow: identify a single visual primitive needed across multiple contexts -> define minimal props (one to three) for presentation configuration -> implement using only theme tokens and translation keys -> verify no child component imports exist -> verify no state logic present -> register as Atom tier component.

## 8. State Realization
| Functional State | Technical Realization |
|---|---|
| Compliant | Component has one to three props, no child component imports, no internal state |
| Borderline | Component has four or more props, exceeding the minimal prop guideline |
| Degraded | Component contains internal state, imports child components, or includes logic beyond presentation |

## 9. Permission Realization
Any component author may propose an Atom. Classification as an Atom is validated against the tier rules during design review. Borderline or Degraded atoms require reclassification or refactoring to meet Atom criteria.

## 10. Validation Realization
Atom validation checks: count of props (compliant at one to three, borderline at four or more), verify absence of child component imports, verify absence of state hooks or lifecycle methods, verify theme and localization hooks are used appropriately.

## 11. Error Realization
| Error Condition | Resolution |
|---|---|
| Component has four or more props (Borderline) | Evaluate if props can be consolidated or if component should be promoted to Molecule |
| Component has internal state (Degraded) | Remove state logic or reclassify to a higher tier that permits state |
| Component imports child components (Degraded) | Reclassify to Molecule or Organism depending on composition complexity |
| Component contains business logic (Degraded) | Extract logic to ViewModel or reclassify to Organism |

## 12. Integration Realization
Atoms integrate with:
- **Theme System**: All visual attributes reference theme tokens via useTheme() hook
- **Localization System**: Static labels and accessible text use translation keys via useLanguage() hook
- **Molecules and Higher Tiers**: Atoms are consumed by molecules and organisms but do not consume any components themselves

## 13. Ownership Mapping
| Artifact | Owner |
|---|---|
| Atom component inventory | Component library maintainers |
| Atom classification criteria | Atomic design methodology authors |
| Prop interface standards | Component library maintainers |

## 14. Architecture Traceability
| Architecture Rule | Realization in Document |
|---|---|
| Atomic Hierarchy | Tier 0 foundation; no imports of other components |
| Stateless UI | Pure rendering, no state, no data fetching |
| Theme Sovereignty | Theme hook usage required |
| Localization Invariant | Translation key usage required |
| Component Tiers | Tier 0: props only, no child components |
| Hook Access | Limited to useTheme() and useLanguage() |

## 15. Feature Traceability
| Source Spec | Realization |
|---|---|
| Atoms are fundamental UI primitives | Definition and characteristics documented |
| Characteristics: single responsibility, no child components, minimal props (1-3), no state logic, composable | Each characteristic realized in responsibility and validation sections |
| Components: StatusDot, SeverityBadge, LoadingState, ErrorState, EmptyState | Component inventory under responsibilities |
| Classification rules: renders single primitive, only presentation config props, no component imports, no internal state | Four classification rules defined and validated |
| States: Compliant, Borderline (4+ props), Degraded (has state/logic/imports) | State realization with detailed criteria per state |

## 16. Open Questions
- What constitutes a single primitive element versus a composite element for classification purposes?
- How are prop counts calculated when theme and localization configuration props are included?
- What is the process for escalating a Degraded atom for reclassification review?
- Are there predefined prop interfaces that all atoms of a given type must follow?
