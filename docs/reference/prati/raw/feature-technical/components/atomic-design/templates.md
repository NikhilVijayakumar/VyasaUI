# Templates: Feature Technical

## 1. Overview
Templates define page-level layout structures that arrange organisms into coherent page compositions. They focus on structural arrangement, composition rules, and content slots, with no business logic or data dependencies. Templates are the highest atomic design tier and serve as the bridge between component composition and page rendering.

## 2. Feature Summary
Templates establish the layout framework for pages by defining structural composition rules and named content slots. They arrange organisms into grid or flow-based layouts, adapt to viewport changes, and support responsive behavior. Templates carry no business logic and do not fetch any data.

## 3. Responsibilities
- Define page-level layout structures
- Arrange organisms and molecules within layout regions
- Provide named content slots for organism placement
- Support responsive adaptation to viewport changes
- Maintain composition rules for consistent page structure

## 4. Non-Responsibilities
- Business logic or data fetching
- State management
- Implementation of organism internals
- Visual styling beyond layout structure (delegated to theme tokens)
- Content generation or population

## 5. Architecture Mapping
| Architecture Rule | Technical Realization |
|---|---|
| Atomic Hierarchy | Tier 3: arranges organisms and molecules; no lower-tier component arranges a template |
| Stateless UI | Templates are pure layout structures with no data fetching, business logic, or persistence |
| Theme Sovereignty | Layout spacing and sizing reference theme tokens for visual consistency |
| Localization Invariant | Template-level headings or labels use translation keys |
| Component Tiers | Tier 3: page layout, no data dependencies, content slots for children |
| Hook Access | useTheme() and useLanguage() permitted; useDataState() not permitted at this tier |

## 6. Responsibility Realization
| Responsibility | Technical Realization |
|---|---|
| Define page-level layout structures | Template establishes regions (header, body, sidebar, footer) using layout primitives |
| Arrange organisms and molecules | Organisms and molecules are placed into template slots according to the page blueprint |
| Provide named content slots | Slots serve as insertion points where organisms render; slot names describe their purpose |
| Support responsive adaptation | Template layout adjusts to viewport breakpoints using responsive theme tokens |
| Maintain composition rules | Consistent patterns for how organisms are arranged relative to each other |

## 7. Workflow Realization
Template creation workflow: identify the page layout structure needed -> define named content slots (header, main content, sidebar, summary) -> arrange slots in the layout using theme spacing tokens -> verify no data dependencies exist -> verify no business logic is introduced -> compose organisms into slots during page assembly -> register as Template tier component.

## 8. State Realization
| Functional State | Technical Realization |
|---|---|
| Empty | Template has defined slots but no children are placed within them |
| Populated | Template slots are filled with organisms and molecules rendering content |
| Responsive | Template layout adapts to viewport changes, rearranging slots or adjusting dimensions |

## 9. Permission Realization
Template creation is authorized for page and feature architects. Templates must not incorporate data dependencies. Any template that requires data must delegate data access to the organisms placed within its slots.

## 10. Validation Realization
Template validation checks: verify no data fetching or repository access is present, verify no business logic exists, verify layout uses theme tokens for spacing and sizing, verify content slots are properly named, verify responsive behavior is defined for target breakpoints.

## 11. Error Realization
| Error Condition | Resolution |
|---|---|
| Template contains data fetching | Move data access to organisms within the template slots |
| Template contains business logic | Extract business logic to ViewModel hooks associated with contained organisms |
| Template has hardcoded spacing values | Replace with theme tokens for consistent layout |
| Template slot naming is ambiguous | Rename slots to clearly describe their purpose (header, main, sidebar, footer) |

## 12. Integration Realization
Templates integrate with:
- **Organisms and Molecules**: Templates arrange organisms and molecules within named content slots
- **Theme System**: Layout spacing, sizing, and breakpoints reference theme tokens via useTheme() hook
- **Localization System**: Template-level structural labels use translation keys via useLanguage() hook
- **Page Assembly**: Templates receive organisms as slot content during page composition
- **Responsive System**: Layout adapts to viewport breakpoints using responsive theme token values

## 13. Ownership Mapping
| Artifact | Owner |
|---|---|
| Template component inventory | Component library maintainers |
| Layout structure definitions | Page and feature architects |
| Content slot naming conventions | Component library maintainers |
| Responsive breakpoint standards | Architecture team |

## 14. Architecture Traceability
| Architecture Rule | Realization in Document |
|---|---|
| Atomic Hierarchy | Tier 3: highest tier, arranges organisms and molecules |
| Stateless UI | No data fetching, no business logic, no persistence |
| Theme Sovereignty | Theme tokens used for all layout spacing and sizing |
| Localization Invariant | Translation keys for template-level text |
| Component Tiers | Tier 3: layout structure only, content slots |
| Hook Access | Limited to useTheme() and useLanguage(); useDataState() explicitly excluded |

## 15. Feature Traceability
| Source Spec | Realization |
|---|---|
| Templates define page-level layout structures | Definition and purpose documented |
| Characteristics: layout focused, composition rules, no business logic, reusable, content slots | Each characteristic realized in responsibility and validation sections |
| Components: PageHeader, SummaryPanel, HeroSection | Component inventory documented |
| Rules: define structure not content, arrange organisms, no data fetching | Three rules enforced through validation and error realization |
| States: Empty (no children), Populated, Responsive (adapts to viewport) | Three states documented with descriptions |
| Note: FileViewerRouter, CsvViewer etc. are organisms/molecules, not templates | Classification boundary reinforced; template tier excludes data-centric components |

## 16. Open Questions
- How do templates handle layout variations across different pages with shared slot names?
- What is the mechanism for passing data from organisms within template slots to sibling organisms?
- How are responsive breakpoints coordinated between template components and their contained organisms?
- What conventions govern the naming of template slots to ensure consistency across templates?
