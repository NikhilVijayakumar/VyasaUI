# Overview

Translation Patterns defines the conventions for structuring translation dictionaries, naming keys, and adding new languages. Developers follow these conventions to ensure consistent translation key usage across features. The patterns are convention-only — there is no runtime enforcement via tooling or lint rules.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | LOCALIZATION-002 |
| Feature Name | Translation Patterns |
| Category | Concept |
| Priority | P1 |
| Dependencies | Localization System (consumes dictionaries conforming to these patterns) |
| Future | Automated key-coverage CI reporting, namespace-based file splitting with lazy loading, parameterized keys with variable interpolation, shared key library for mobile/backend |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Add translations for a new feature | Follow key-naming conventions to add new key-value pairs to language dictionaries |
| Add a new language | Create a new dictionary with the same key structure as existing languages and register it with the provider |
| Find the correct key pattern | Reference the documented conventions to choose between `category.key`, `component.key`, or `screen.action` |

# User Journeys

### Entry Conditions
A developer needs to display a new string in the UI that must be translated across supported languages.

### Primary Flow: Add Translation Key
1. Developer identifies the new string that needs translation (e.g., "Save changes")
2. Developer chooses a key following conventions (e.g., `ui.save-changes`)
3. Developer adds the key-value pair to the English dictionary
4. Developer adds the corresponding translated values to each supported language dictionary
5. Developer references the key in component code through the localization provider
6. The string renders in the user's active language

### Alternate Flows
- **Add a new language**: Developer creates a new flat dictionary with the same key structure as existing languages, provides at least the core UI keys (save, cancel, etc.), and registers the language code and label with the provider
- **Partial coverage**: Developer adds a key to only some languages — missing languages show no text at runtime

### Failure Flows
- **Dot key collision**: Developer creates a key like `form.name` while another key `form.name.label` already exists — ambiguous lookups at runtime
- **Non-string value**: Developer places an object or number as a translation value — rendering errors in consuming components
- **Missing key in active language**: Translation key is absent from the active dictionary — component must handle with fallback or optional chaining

### Recovery Flows
- **Dot key collision recovery**: Developer reviews conventions, removes the collision by using consistent depth (all keys at one level), and re-tests
- **Non-string value recovery**: Developer replaces object/number with a string value
- **Missing key recovery**: Developer adds the missing key to the active language dictionary

### Exit Conditions
The new translation renders correctly in the UI across all supported languages. The key follows naming conventions and works with the localization provider.

| Journey | Description |
| ------- | ----------- |
| Add translation key | Developer adds a new key-value pair following conventions; string renders in user's language |
| Add new language | Developer creates dictionary mirroring existing key structure and registers it |
| Fix key collision | Developer resolves ambiguous dot-notation keys by enforcing consistent depth |

# Screen Inventory

N/A — Translation Patterns is a developer reference. It does not define user-facing screens.

# Interaction Design

N/A — Translation Patterns is a documentation artifact. It has no interactive affordances.

# Form Design

N/A — Translation Patterns is a developer reference. It does not define form fields.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Defined | Translation structure is fully specified with conventions and examples; developers reference documented patterns |
| Undefined | Conventions diverge across features with no enforcement; pattern consistency degrades; developers must infer key structure |
| Extended | Developer adds a new language dictionary following documented conventions; new language becomes available |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Key correctly added | Translation renders in UI when the active language dictionary contains the key |
| Key collision detected | Ambiguous lookup at runtime; component may show empty text or wrong value |
| Non-string value provided | Rendering error in consuming component |
| Missing key in language | Empty text renders in the UI for that language |

# Navigation Design

N/A — Translation Patterns does not define navigation behavior.

# Responsive Design

N/A — Translation Patterns is a developer reference document; no viewport-specific behavior.

# Accessibility Design

N/A — Translation Patterns is a developer reference. It has no interactive elements or user-facing states that require accessibility annotation.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Dot-notation keys | Keys use category prefix (`ui.*`, `msg.*`, `form.*`, `validation.*`) or component scope (`component.key`) or screen scope (`screen.action`) |
| Dictionary structure | Flat key-value object per language; no nested objects; dot notation replaces nesting |
| New language addition | Create dictionary with same key structure as existing languages; register language code and label with provider |
| Key naming | `snake_case` for keys, `camelCase` for structure; category prefix followed by descriptive name |
| Partial coverage | Languages may define a subset of keys; missing keys surface as empty values at runtime with no framework enforcement |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Key Naming Conventions | `category.key`, `component.key`, `screen.action` patterns documented and enforced by convention |
| Localization — Zero Hardcoding Policy | Dictionaries contain all user-facing strings; no literals in component code |
| Localization — Pluralization | Keys follow `one`/`other` convention when count variants exist |
| Rule 8: Consistency Builds Trust | All features share the same key-naming conventions; consistent structure across all dictionaries |
| Rule 9: Detail Reflects Craftsmanship | Flat dictionary structure avoids ambiguity; consistent key depth prevents collisions |

# Open Questions

- Should keys follow a strict hierarchical namespace or remain flat with prefixes?
- Is a codemod needed to migrate from hardcoded strings to translation key usage?
- Should an automated coverage tool be built to flag missing translations in CI?
