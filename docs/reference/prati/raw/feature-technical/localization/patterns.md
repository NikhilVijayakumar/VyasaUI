# Translation Patterns: Feature Technical

## 1. Overview

Translation Patterns defines the conventions for structuring translation dictionaries, naming keys, and adding new languages. These patterns are convention-only — there is no runtime enforcement via tooling or lint rules. Consistency across features is maintained through documentation and developer discipline.

## 2. Feature Summary

A set of conventions for organizing translation dictionaries: flat key-value structure per language, dot-notation keys, and category prefixing. Three key patterns are defined: category.key, component.key, and screen.action. Best practices include consistent naming, providing fallbacks, and keeping translations flat. Adding a new language requires creating a dictionary with the same key structure, providing core UI keys, and registering with the provider.

## 3. Responsibilities

- Define a consistent key-naming convention for all translations
- Provide guidance on flat dictionary structure per language
- Document patterns for accessing translations
- Establish conventions for adding new languages

## 4. Non-Responsibilities

- Not a replacement for full i18n library (pluralization, interpolation, date/number formatting)
- Does not enforce patterns via tooling or lint rules — convention-only
- Does not cover runtime key fallback or merging strategies
- Does not specify file-splitting or lazy-loading strategies for large translation sets

## 5. Architecture Mapping

| Architecture Document | Relevance |
|---|---|
| Architecture: Localization (core) | Defines {domain}.{page}.{element} key naming pattern for translation dictionaries |
| Localization Invariant | All user-facing text must use translation keys via useLanguage; keys are the contract between provider and consumer |
| Atomic Hierarchy | Translation keys are consumed at all tiers; no tier-specific key naming restrictions |
| MVVM Pattern | Translation key resolution happens in View layer via useLanguage hook; key structure is independent of MVVM concerns |

## 6. Responsibility Realization

| Responsibility | Technical Realization |
|---|---|
| Define consistent key-naming convention for all translations | Dot-notation pattern with category prefixing (e.g., ui.save, msg.error) documented as the standard |
| Provide guidance on flat dictionary structure per language | Each language is an independent flat key-value map; dot-notation creates logical namespacing without nested objects |
| Document patterns for accessing translations | useLanguage hook returns literal object; translation keys referenced as literal['category.key'] |
| Establish conventions for adding new languages | New dictionary created with identical key structure; registered with LanguageProvider via translations prop |

## 7. Workflow Realization

| Workflow | Technical Realization |
|---|---|
| Add translation key | Developer defines key following dot-notation pattern → adds key-value to each language dictionary |
| Add new language | Developer creates dictionary with shared key structure → provides core UI keys → registers with LanguageProvider |
| Key collision resolution | Developer identifies ambiguous keys (e.g., form.name and form.name.label at mixed depths) → removes collision by enforcing uniform key depth |

### Add Translation Key

**Trigger:** A developer needs to display a new string in the UI that must be translated across supported languages.

**Processing:** Developer chooses a key following the dot-notation convention (category.key, component.key, or screen.action). The key-value pair is added to each language dictionary. The key is referenced in component code via literal['key'].

**Validation:** Convention-only — no automated check ensures the key matches the naming pattern or exists in all language dictionaries.

**State Changes:** Defined → Extended (new key added); or Undefined → Defined (patterns realigned).

**Outputs:** The new translation key is available through useLanguage for the active language. Languages missing the key return undefined.

**Failure Handling:** Key added to only some languages — missing languages render no text at runtime. Mixed key depths cause ambiguous lookups.

### Add New Language

**Trigger:** A developer needs to support a new locale.

**Processing:** Developer creates a new translation dictionary with the same key structure as existing languages. Core UI keys (save, cancel, etc.) are provided. The language code and label are added to the availableLanguages configuration and the dictionary is included in the translations map passed to LanguageProvider.

**Validation:** Convention-only — the provider does not validate that the new dictionary covers all keys present in other languages.

**State Changes:** Defined → Extended (new language added).

**Outputs:** The new language appears in the language selector and becomes selectable. Missing keys return undefined from literal.

**Failure Handling:** Empty dictionary for the new language — all lookups return undefined. Partial key coverage renders some UI without text.

## 8. State Realization

| Functional State | Technical Realization |
|---|---|
| Defined | Patterns are fully specified with conventions and examples documented in the patterns reference |
| Undefined | Conventions have degraded across features; no consistent key-naming pattern is followed |
| Extended | A new language or key set has been added following the documented patterns |

### Defined

**Entry Conditions:** Translation patterns are documented, examples exist, and features follow the convention.

**Exit Conditions:** Conventions degrade across features without enforcement.

**Valid Transitions:** → Extended (new language or keys added following conventions); → Undefined (conventions degrade, pattern consistency lost).

**Invalid Transitions:** Not applicable.

**Recovery Paths:** From Undefined, patterns can be re-aligned and re-documented to return to Defined.

### Undefined

**Entry Conditions:** Features diverge from documented key-naming conventions; no enforcement mechanism exists.

**Exit Conditions:** Patterns are re-aligned and documented with examples.

**Valid Transitions:** → Defined (patterns re-aligned and re-documented).

**Invalid Transitions:** → Extended (cannot extend patterns that are undefined).

**Recovery Paths:** Audit existing keys, realign with convention, update documentation.

### Extended

**Entry Conditions:** A developer adds a new language or key set following the documented pattern.

**Exit Conditions:** Addition is complete and verified.

**Valid Transitions:** → Defined (new addition complete, patterns remain consistent).

**Invalid Transitions:** → Undefined (extension without following conventions degrades pattern consistency).

**Recovery Paths:** Review new additions against convention, correct deviations.

## 9. Permission Realization

| Permission | Technical Realization |
|---|---|
| Translation contribution | Public — all developers may add translation keys and languages without access restrictions |

**Access Control:** No permission restrictions on translation dictionary modification. Any developer may add keys or languages.

**Enforcement:** Not enforced — convention-only guidance.

**Failure Behavior:** Not applicable — no permission restriction exists to fail.

## 10. Validation Realization

| Rule | Technical Realization |
|---|---|
| Key naming follows dot-notation convention | Convention-only — no automated enforcement; relies on developer adherence |
| Keys maintain uniform depth | Convention-only — mixed depths (e.g., form.name and form.name.label) cause ambiguous lookups |
| Translation values are strings | Convention-only — non-string values (objects, numbers) cause rendering errors at runtime |
| Keys exist across all language dictionaries | Convention-only — partial coverage produces undefined lookups in incomplete languages |

### Key Naming Convention

**Validation Trigger:** Developer defines a new translation key.

**Validation Owner:** Developer (convention-only).

**Failure Outcome:** Key does not follow dot-notation pattern; naming inconsistency across features.

**Recovery Path:** Developer reviews conventions and renames key.

### Key Depth Uniformity

**Validation Trigger:** Developer adds a key that shares prefix with existing keys.

**Validation Owner:** Developer (convention-only).

**Failure Outcome:** Dot key collision — ambiguous lookups between keys at different depths.

**Recovery Path:** Developer removes collision by using consistent depth for all keys.

### Value Type Constraint

**Validation Trigger:** Translation dictionary includes non-string values.

**Validation Owner:** Developer (convention-only).

**Failure Outcome:** Objects or numbers in translation values cause rendering errors at runtime.

**Recovery Path:** Developer replaces non-string values with string equivalents.

## 11. Error Realization

| Error Scenario | Technical Realization |
|---|---|
| Missing key in active language | literal[key] returns undefined; component must handle with fallback text or the key itself |
| Dot key collision | Keys at mixed depths (e.g., form.name and form.name.label) cause ambiguous lookup results |
| Non-string translation value | Objects or numbers in dictionary produce rendering errors when resolved in UI |
| Partial language coverage | Languages defining a subset of keys render missing text as empty values |

### Missing Key in Active Language

**Detection:** literal[key] lookup returns undefined for an existing component reference.

**Handling:** Provider does not intervene — undefined propagates to the consuming component.

**Recovery:** Developer adds the missing key to the language dictionary.

**Escalation:** Not escalated — convention-only guidance recommends developers audit key coverage.

### Dot Key Collision

**Detection:** Two keys share a prefix path at different depths (e.g., form.name and form.name.label).

**Handling:** The dictionary structure produces ambiguous lookups; one key may shadow the other.

**Recovery:** Developer renames keys to maintain uniform depth across all entries.

**Escalation:** Not escalated — no runtime detection mechanism exists.

### Non-String Translation Value

**Detection:** Translation value is an object or number instead of a string.

**Handling:** At runtime, the non-string value renders incorrectly in the UI.

**Recovery:** Developer replaces the value with a string.

**Escalation:** Not escalated — no type validation at the provider level.

## 12. Integration Realization

| Integration | Purpose | Owner |
|---|---|---|
| LanguageProvider | Consumes translation dictionaries; exposes resolved strings via context | Localization system |
| Component layer | Consumes translated strings via useLanguage hook using dot-notation keys | Component developer |
| Consumer application | Provides translation dictionaries; defines available languages | Consumer |
| Developer workflow | Key definition, dictionary creation, and convention adherence | Developer |

### Internal Integrations

**LanguageProvider:** The translation dictionaries defined by these patterns are the data source for LanguageProvider. The provider expects a flat key-value structure per language, which aligns with the flat dictionary convention.

### External Integrations

**Component layer:** Components reference translation keys defined by these patterns via useLanguage hook. The key naming conventions ensure consistency across the component tree.

### Dependency Relationships

The patterns document has no runtime dependencies. It is a convention reference that informs how developers structure translation data consumed by LanguageProvider.

## 13. Ownership Mapping

| Responsibility | Owner |
|---|---|
| Key naming convention definition | Translation Patterns documentation |
| Dictionary creation per language | Developer |
| Dictionary registration with LanguageProvider | Developer |
| Key usage in component code | Component developer |
| Convention enforcement | None (convention-only; no automated enforcement) |
| Pattern degradation detection | Developer during code review |

## 14. Architecture Traceability

| Architecture Rule | Realization |
|---|---|
| Localization Invariant | All user-facing text must use translation keys — the patterns define the key structure that enables this invariant |
| Flat key-value dictionary | Each language is a flat map; dot-notation provides namespacing without nesting — aligns with dictionary-based i18n architecture |
| No hardcoded strings | Translation keys are the single source of truth for user-facing text; patterns ensure keys are discoverable and maintainable |

## 15. Feature Traceability

| Feature Requirement | Realized |
|---|---|
| Define consistent key-naming convention for all translations | Dot-notation patterns (category.key, component.key, screen.action) documented with examples |
| Provide guidance on flat dictionary structure per language | Each language is an independent flat key-value map; dot-notation preferred over nested objects |
| Document patterns for accessing translations | useLanguage hook with literal[key] access documented as the consumption pattern |
| Establish conventions for adding new languages | Process documented: create dictionary with same key structure, provide core keys, register with provider |

## 16. Open Questions

- Should keys follow a strict hierarchical namespace or remain flat with prefixes?
- Is a codemod needed to migrate from hardcoded strings to translation key usage across the codebase?
- Should key coverage validation be automated in CI to flag missing translations across languages?
- Should shared translation keys be extracted into a consumable library for mobile apps or backend services?
