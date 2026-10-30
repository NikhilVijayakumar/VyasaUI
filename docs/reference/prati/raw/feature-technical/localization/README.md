# Localization System: Feature Technical

## 1. Overview

The Localization System enables runtime language switching with dictionary-based translations. It is realized as a provider-consumer pattern: a language provider wraps the application at the context layer, exposes translation dictionaries through a consumer hook, and propagates language changes via context update re-render without page reload.

## 2. Feature Summary

Runtime language switching via dictionary-based i18n. Each language owns an independent flat dictionary of dot-notation key-value pairs. The system exposes translation dictionaries to consuming components and supplies a default language selector. Language changes propagate through the component tree via context update — no page reload required.

## 3. Responsibilities

- Provide a lightweight i18n system
- Enable runtime language switching without page reload
- Expose translation dictionaries to consuming components
- Supply a default language selector component

## 4. Non-Responsibilities

- Not a translation management platform (no PO/XLIFF import/export)
- Does not perform automatic language detection or geolocation-based defaults
- Does not handle pluralization or interpolation rules
- Does not manage RTL layout switching
- Does not lazy-load translation chunks

## 5. Architecture Mapping

| Architecture Document | Relevance |
|---|---|
| Architecture: Localization (core) | Defines LanguageProvider, useLanguage hook, translation file structure, key naming pattern |
| Localization Invariant | All user-facing text must use translation keys via useLanguage; no hardcoded strings |
| Atomic Hierarchy | Provider sits above the atomic tier hierarchy; useLanguage consumed at any tier |
| Stateless UI Invariant | Language state owned by LanguageProvider; components are pure rendering consumers |
| Provider Hierarchy | LanguageProvider must render inside ThemeProvider; before AuthProvider and Router |
| MVVM Pattern | Language context consumed via hook in View layer; translation data flows through provider context |

## 6. Responsibility Realization

| Responsibility | Technical Realization |
|---|---|
| Lightweight i18n system | LanguageProvider context wrapper supplies translation dictionaries to all children via consumer hook |
| Runtime language switching without page reload | LanguageProvider updates internal language state; context value change triggers re-render of all useLanguage consumers |
| Expose translation dictionaries to consuming components | useLanguage hook returns literal object containing resolved translated strings for active language |
| Supply a default language selector | LanguageProvider exposes availableLanguages configuration and setCurrentLanguage function via useLanguage |

## 7. Workflow Realization

| Workflow | Technical Realization |
|---|---|
| Language switch | User selects language → setCurrentLanguage called → LanguageProvider updates context value → all useLanguage consumers re-render with new translations |
| Initialization | App mounts → LanguageProvider receives translations, availableLanguages, defaultLanguage props → initializes with default language → translation dictionary loaded into context |
| Missing key resolution | literal lookup returns undefined for absent key → consuming component manages fallback display |

### Language Switch

**Trigger:** User selects a language from the language selector.

**Processing:** setCurrentLanguage is invoked with the target language code. LanguageProvider updates its internal language state. The context value changes to reference the new translation dictionary.

**Validation:** The language code is validated against the availableLanguages configuration. Unrecognized codes produce an empty dictionary.

**State Changes:** Active → Switching → Active (or Fallback).

**Outputs:** All useLanguage consumers re-render with translated strings from the new language dictionary.

**Failure Handling:** Invalid language code sets the language but produces an empty dictionary. The provider does not reject the switch.

### Initialization

**Trigger:** LanguageProvider mounts in the provider hierarchy.

**Processing:** LanguageProvider reads defaultLanguage prop, selects the corresponding translation dictionary from translations, and initializes the context value.

**Validation:** The default language key is validated against availableLanguages. If missing, the provider selects the first available language.

**State Changes:** Uninitialized → Active (or Fallback).

**Outputs:** Context initialized; useLanguage consumers render with initial language translations.

**Failure Handling:** Empty translations map produces empty dictionaries for all languages. Fallback state if default language not found.

## 8. State Realization

| Functional State | Technical Realization |
|---|---|
| Uninitialized | Before LanguageProvider mounts; useLanguage context is unavailable |
| Active | LanguageProvider mounted with a valid language; literal returns translations from active dictionary |
| Switching | Language changed; context value update pending, consumers will re-render on next cycle |
| Fallback | Default language not found in translations; provider selects first available language |

### Uninitialized

**Entry Conditions:** App root rendering; LanguageProvider not yet mounted.

**Exit Conditions:** LanguageProvider mounts and initializes with default language.

**Valid Transitions:** → Active (provider mounts with valid language); → Fallback (provider mounts but default language not found).

**Invalid Transitions:** → Switching (no language was ever active).

**Recovery Paths:** Provider mount resolves the state.

### Active

**Entry Conditions:** LanguageProvider mounted with a valid language dictionary.

**Exit Conditions:** User selects a different language; provider unmounts.

**Valid Transitions:** → Switching (language change in progress); → Uninitialized (provider unmounts).

**Invalid Transitions:** → Fallback (cannot transition from active to fallback without a switching attempt).

**Recovery Paths:** None required — active state is nominal.

### Switching

**Entry Conditions:** User calls setCurrentLanguage; LanguageProvider begins language update.

**Exit Conditions:** New language dictionary loads successfully; fallback state if dictionary is empty.

**Valid Transitions:** → Active (new language applied successfully); → Fallback (new language dictionary is empty or invalid).

**Invalid Transitions:** → Uninitialized (provider remains mounted during switch).

**Recovery Paths:** Fallback state selects first available language; user can retry selection.

### Fallback

**Entry Conditions:** LanguageProvider mounts with unrecognized default language; or language switch targets an invalid code.

**Exit Conditions:** Default language restored or user selects a valid language.

**Valid Transitions:** → Active (valid language selected); → Uninitialized (provider unmounts).

**Invalid Transitions:** → Switching (cannot switch from fallback without a target language).

**Recovery Paths:** User selects a valid language from availableLanguages; provider selects first available dictionary automatically.

## 9. Permission Realization

| Permission | Technical Realization |
|---|---|
| Language switching | Public — all users may switch languages regardless of authentication state |

**Access Control:** Language selection is available to all users. No authentication or role check is enforced at the provider level.

**Enforcement:** No enforcement — the language selector UI is visible and functional for all users.

**Failure Behavior:** Not applicable — no permission restriction exists.

## 10. Validation Realization

| Rule | Technical Realization |
|---|---|
| Language code must be in availableLanguages | setCurrentLanguage validates against availableLanguages list; unrecognized codes produce empty dictionary |
| Translation dictionary must be a flat key-value map | Provider expects flat map structure; nested objects may produce undefined lookups |
| defaultLanguage must exist in availableLanguages | Provider checks at mount; missing default triggers fallback to first available language |
| translations map must not be empty | Empty translations map results in empty dictionaries for all languages |

### Language Code Validation

**Validation Trigger:** setCurrentLanguage is called.

**Validation Owner:** LanguageProvider.

**Failure Outcome:** Unknown language code accepted but produces empty dictionary; UI renders without localized text.

**Recovery Path:** User selects a valid language code; developer registers the missing language.

### Translation Map Validation

**Validation Trigger:** LanguageProvider mount.

**Validation Owner:** LanguageProvider.

**Failure Outcome:** Empty translations map — all language lookups return undefined; UI renders without localized text.

**Recovery Path:** Developer populates translations with at least one language dictionary.

## 11. Error Realization

| Error Scenario | Technical Realization |
|---|---|
| Missing translation key | literal[key] returns undefined; consuming component responsible for fallback behavior |
| Invalid language code | setCurrentLanguage with unknown code switches context; translation dictionary resolves to empty object |
| Provider nesting | Inner LanguageProvider shadows outer context; consumers inside inner provider lose outer translations |
| Empty translations map | All language codes resolve to empty dictionaries; UI renders without localized text |

### Missing Translation Key

**Detection:** literal[key] lookup returns undefined.

**Handling:** Provider does not intervene; the undefined value propagates to the consuming component.

**Recovery:** Consuming component implements fallback display (key itself, default text, or empty rendering).

**Escalation:** Not escalated — the provider treats missing keys as valid dictionary absence.

### Invalid Language Code

**Detection:** setCurrentLanguage invoked with code not present in availableLanguages.

**Handling:** Provider accepts the switch; translation dictionary resolves to empty object. All literal lookups return undefined.

**Recovery:** User selects a valid language; developer registers the missing language with the provider.

**Escalation:** Not escalated — invalid codes are silently accepted.

### Provider Nesting

**Detection:** Multiple LanguageProvider instances render in the component tree (inner within outer).

**Handling:** Inner provider creates a new context scope; consumers inside it access only the inner provider's translations. Outer translations are inaccessible.

**Recovery:** Consumer removes nested provider; single LanguageProvider wraps the application root.

**Escalation:** Not detected or handled by the provider — a documented architectural constraint.

### Empty Translations Map

**Detection:** LanguageProvider receives translations prop with no language entries.

**Handling:** Provider initializes; all language lookups resolve to undefined. UI renders without localized content.

**Recovery:** Developer populates the translations map with at least one language dictionary.

**Escalation:** Not escalated — provider does not warn on empty translations.

## 12. Integration Realization

| Integration | Purpose | Owner |
|---|---|---|
| ThemeProvider | Provides theme context for language selector UI (styling) | Localization system |
| AuthProvider | Language selection available regardless of authentication state | Consumer |
| Router | Language context available across all routes | Consumer |
| Translation dictionaries | Data source for literal lookups; provided by consumer | Consumer |
| Components through useLanguage | Primary consumer of translated strings | Component layer |

### Internal Integrations

**ThemeProvider:** LanguageProvider must render inside ThemeProvider per provider hierarchy. Language selector UI components use theme tokens for styling.

### External Integrations

**AuthProvider:** LanguageProvider renders before AuthProvider in the hierarchy, ensuring language selection is accessible to unauthenticated users.

**Router:** LanguageProvider renders before Router, guaranteeing language context across all routes.

### Dependency Relationships

LanguageProvider has no hard dependency on AuthProvider or Router — it functions independently. ThemeProvider is a prerequisite for consistent themed rendering of language selector components.

## 13. Ownership Mapping

| Responsibility | Owner |
|---|---|
| Translation context provision | LanguageProvider |
| Language state management | LanguageProvider |
| Translation dictionary definition | Consumer |
| Translation key usage in components | Component layer |
| Default language selector supply | LanguageProvider |
| Language code validation | LanguageProvider |

## 14. Architecture Traceability

| Architecture Rule | Realization |
|---|---|
| Localization Invariant | All user-facing text references translation keys via useLanguage; no hardcoded strings in components |
| Stateless UI | Language state owned entirely by LanguageProvider; components are pure consumers with no data lifecycle |
| Atomic Hierarchy | LanguageProvider is a system provider above the component tier hierarchy; useLanguage consumed at any tier |
| Provider Hierarchy | LanguageProvider renders inside ThemeProvider, before AuthProvider and Router |
| MVVM | Translation data flows through provider context; View layer consumes via hook — no business logic in View |
| Theme Sovereignty | Language selector uses theme tokens; no hardcoded visual values in localization UI |

## 15. Feature Traceability

| Feature Requirement | Realized |
|---|---|
| Lightweight i18n system | LanguageProvider with dictionary-based translation context |
| Runtime language switching without page reload | Context update on setCurrentLanguage triggers re-render of all useLanguage consumers |
| Expose translation dictionaries to consuming components | useLanguage hook returns literal object with translated strings for active language |
| Supply a default language selector | LanguageProvider exposes availableLanguages configuration and setCurrentLanguage function via useLanguage |

## 16. Open Questions

- Should RTL layout switching be handled by the localization system or the theming layer?
- How should date, number, and currency formatting be integrated with the language context?
- Should translation interpolation (parameterized keys) be managed by the provider or remain consumer-managed?
- Should lazy-loaded translation chunks be a future provider capability or remain consumer-managed?
