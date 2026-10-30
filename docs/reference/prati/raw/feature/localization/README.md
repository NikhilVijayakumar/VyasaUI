# Localization System

The Prati i18n system provides runtime language switching with dictionary-based translations.

## Overview

The application can display content in multiple languages. Users switch languages at runtime without reloading the page. Each language has its own dictionary of translated strings organized by key.

## Responsibilities

- Provide a lightweight i18n system
- Enable runtime language switching without page reload
- Expose translation dictionaries to consuming components
- Supply a default language selector component

## Non-Responsibilities

- Not a translation management platform (no PO/XLIFF import/export)
- Does not perform automatic language detection or geolocation-based defaults
- Does not handle pluralization or interpolation rules
- Does not manage RTL layout switching
- Does not lazy-load translation chunks

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Translation Dictionaries** | Key-value pairs per language |
| **Language Provider** | Wraps the application, provides translation context |
| **Runtime Switching** | Language changes propagate via re-render, no reload needed |
| **Translation Keys** | Dot-notation keys for looking up strings |

## Business Rules

1. **Runtime switching without reload** — Language changes must propagate instantly to all consumers without a page reload; full-page refresh is not acceptable
2. **Graceful missing keys** — A missing translation key must never throw an error; the consuming code must handle with a fallback (the key itself or a default string)
3. **Provider wrapping** — The LanguageProvider must wrap the entire component tree that requires localization; partial wrapping causes untranslated text
4. **Empty dictionary safety** — An empty translation dictionary is valid but must never crash the provider; components render without translated text rather than throwing
5. **Translation before display** — All user-facing text must pass through the localization system; raw hardcoded strings for user-facing content are not permitted

## States

- **Uninitialized**: Before provider mounts; language context is unavailable
- **Active**: Provider mounted with a valid language; translations available
- **Switching**: Language changed — new translations propagate to all consumers
- **Fallback**: Default language not found in translations — provider selects first available language

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Uninitialized | Active | Provider mounts with a valid language dictionary |
| Active | Switching | User selects a different language |
| Switching | Active | New language dictionary loads successfully |
| Switching | Fallback | New language dictionary fails to load |
| Fallback | Active | Default language restored or retry succeeds |

## Edge Cases

- **Missing translation key**: Lookup returns no value — consuming code should fall back to the key itself
- **Invalid language code**: Setting an unknown language yields an empty dictionary
- **Provider nesting**: Multiple providers do not merge — inner provider shadows outer context
- **Empty translations map**: All languages resolve to empty dictionaries

## Error Conditions

- **Missing translation key** — Component must handle with fallback text
- **Invalid language code** — Sets state but produces empty dictionary; UI may show no text
- **Provider nesting** — Inner provider shadows outer; consumers lose outer translations
- **Empty translations map** — UI renders without localized text

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Missing translation key | Add the missing key to all language dictionaries; verify the component uses a fallback (key name or default text) in the interim |
| Invalid language code | Verify the language code matches a registered dictionary; use a valid ISO language code |
| Provider nesting | Remove the inner LanguageProvider; let the root provider propagate to all consumers |
| Empty translations map | Populate the dictionary with at least core UI keys before mounting the provider |

## Authorization

**Visibility:** Public — language switching is available to all users regardless of authentication state.

## User Journey

### Entry Conditions
A user wants to view the application in a different language.

### Primary Flow
The user opens a language selector, picks a new language, and all translatable text updates instantly without a page reload.

### Alternate Flows
A developer integrates the localization provider into a new feature by wrapping it with the language context and using translation keys.

### Failure Flows
A translation key is missing in the active language — the UI shows no text or falls back to the key itself.

### Recovery Flows
The developer adds the missing key to the translation dictionary for the active language.

### Exit Conditions
The user sees all interface text in their selected language and continues using the application.

## Workflow

### Trigger
A user selects a new language from the language selector, or a developer initializes the localization provider.

### Preconditions
At least one translation dictionary is registered with the provider.

### Steps
The language is switched, the provider propagates the new dictionary to all consumers, and every component using translation keys re-renders with the new text.

### Outcomes
All localized text in the application displays in the selected language.

### Exceptions
The selected language has an empty dictionary — the UI renders without text, requiring the developer to populate translations.
### Completion Criteria

The selected language is active and all translatable content displays in that language.

## Verification

- **Runtime switch test**: Switch language at runtime; verify all translatable text updates without page reload
- **Missing key test**: Remove a key from the active dictionary; verify the component falls back gracefully (shows key name, not an error)
- **Provider nesting test**: Nest two LanguageProviders; verify inner provider shadows outer correctly
- **Empty dictionary test**: Mount the provider with an empty dictionary; verify no crash — components render without translated text

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../concepts/authorization.md) — cross-cutting permission rules
- [Translation Patterns](./patterns.md) — key-naming conventions for translation dictionaries
- [Application Rendering Workflow](../workflows/application-rendering.md) — rendering pipeline that consumes translation dictionaries
- [Template Delivery Workflow](../workflows/template-delivery.md) — template rendering flow for localized HTML output

## Future Enhancements

- Lazy-loaded translation chunks loaded on-demand per feature
- Plurals and interpolation via ICU message format
- Auto-detection of browser language preference
- Translation key extraction CLI tool for CI pipeline

## Open Questions

- Should RTL layout switching be part of this system or handled by the theming layer?
- How should date, number, and currency formatting be integrated?
