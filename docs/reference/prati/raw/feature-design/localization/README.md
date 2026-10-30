# Overview

The Localization System provides runtime language switching without page reload. Users select a language from a language selector component; the provider propagates translations to all consumers and every localized component re-renders with the new text. The system uses flat dot-notation dictionary files per language, organized by key.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | LOCALIZATION-001 |
| Feature Name | Localization System |
| Category | Concept |
| Priority | P0 |
| Dependencies | Language selector component, translation dictionaries (dot-notation key-value pairs per language) |
| Future | Lazy-loaded translation chunks, ICU plurals/interpolation, browser language auto-detection, translation key extraction CLI |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| View app in a different language | Select a new language and see all translatable text update instantly without page reload |
| Switch language at runtime | Change language from any screen via the language selector; no page reload required |
| Confirm language change | See all interface text render in the selected language immediately after selection |

# User Journeys

### Entry Conditions
User wants to view the application in a different language. A language selector component is rendered in the application toolbar or settings panel.

### Primary Flow: Language Switch
1. User opens the language selector in the toolbar
2. User sees available languages listed (e.g., English, Malayalam, Hindi)
3. User selects a new language
4. The provider propagates the new dictionary to all consumers
5. Every component using translation keys re-renders with the new text
6. User sees all interface text in the selected language

### Alternate Flows
- **Provider integration**: Developer wraps a new feature with the language context and uses translation keys via a `literal` object; the feature participates in runtime switching without additional configuration
- **Missing translation key in active language**: The UI shows empty text or falls back to the key name itself; the developer adds the missing key to the dictionary

### Failure Flows
- **Invalid language code**: User selects or a developer sets an unknown language code — the provider returns an empty dictionary; the UI may render without localized text
- **Empty translations map**: All language dictionaries are empty — the UI renders without any localized text
- **Provider nesting**: Multiple providers are nested — the inner provider shadows the outer context; consumers lose outer translations

### Recovery Flows
- **Invalid language code recovery**: The developer registers a valid dictionary for the language code; the provider picks up the dictionary on next render
- **Empty translations map recovery**: The developer populates at least one dictionary with keys; the provider exposes them to consumers
- **Provider nesting recovery**: The developer removes nested providers or merges dictionaries; consumers regain access to all translations

### Exit Conditions
All localized text in the application displays in the selected language. The user continues using the application with the new language active.

| Journey | Description |
| ------- | ----------- |
| Language switch | User opens selector, picks a language, all text updates instantly |
| Provider integration | Developer wraps feature with language context; feature participates in runtime switching |
| Missing key | Translation key absent in active dictionary; UI shows empty text or key fallback |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| All screens | Language selector appears in the toolbar or settings panel; text everywhere reflects active language |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Open language selector | User clicks/taps the language selector trigger; a list of available languages appears |
| Select a language | User clicks/taps a language from the list; the provider switches to the new language; all translated text re-renders |
| Close language selector | User clicks outside the selector or selects a language; the dropdown dismisses |

# Form Design

N/A — the localization system does not define form fields. The language selector is a choice control, not a form input.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Uninitialized | Language context unavailable; components using translation keys may throw or render fallback text |
| Active | Provider mounted with a valid language; translations available; all localized text renders correctly |
| Switching | Language changed — old text disappears and new text appears as all consumers re-render with the new dictionary |
| Fallback | Default language not found; provider selects the first available language; user may see a non-preferred language |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Language switch selected | All translatable text on screen updates instantly; no page reload |
| Missing translation key | Empty text or key string shown where translation would appear |
| Invalid language code | UI may show no localized text in any component |
| Empty translations map | Full UI renders without any translated strings |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| Language selector → language selection | User triggers selector, picks a language, text updates; no URL or route change occurs |
| Language switch → all screens | New language applies globally; affects every screen that uses translation keys |

The localization system does not affect URL, routing, or navigation state. Language selection persists for the duration of the provider mount.

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop (≥900px) | Language selector displayed inline in toolbar; full language list in dropdown |
| Tablet (600–899px) | Language selector displayed as icon or compact label in toolbar; dropdown appears on tap |
| Mobile (<600px) | Language selector in toolbar or navigation panel; dropdown takes full-width or appears as bottom sheet |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Keyboard support | Language selector button focusable via Tab; Enter/Space opens dropdown; Arrow keys navigate language list; Enter selects; Escape closes |
| Focus management | When language selector opens, focus moves to the first language item; when closed, focus returns to the trigger button |
| Screen reader announcement | Language selector button announces current language via `aria-label` (e.g., "Current language: English. Change language."). When language changes, `aria-live="polite"` region announces "Language changed to [selected language]." |
| ARIA | Language selector uses `role="listbox"` for languages, `role="option"` for each language item; `aria-selected` on active language |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Language labels | Each language label is itself a localized string (e.g., `en` renders "English", `ml` renders "മലയാളം"); resolved through the same provider |
| Language selector trigger text | Current language label displayed on trigger; resolved through localization keys |
| Translation key lookups | All user-facing strings resolved via dot-notation keys (e.g., `ui.save`, `msg.welcome`); missing keys fall back to empty string or key itself |
| Locale formatting | Numbers and dates formatted via `Intl` API per active locale; not managed by the key-value system per non-responsibilities |

Zero hardcoded strings in the language selector or provider. All text resolved through the translation dictionaries.

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Zero Hardcoding Policy | All user-facing text resolved through translation keys; no literal strings |
| Localization — Key Naming Conventions | Keys follow `category.key`, `component.key`, or `screen.action` patterns |
| Localization — Pluralization | Plural keys follow `one`/`other` convention |
| Localization — RTL Support | CSS logical properties recommended; `dir="rtl"` at `<html>` level |
| Localization — `data-l10n` attribute | Every localized element tagged with `data-l10n` for verification |
| Accessibility — Interactive Targets | Language selector trigger and dropdown items meet 44×44px touch target |
| Rule 1: Radical Simplicity | Single concern — translate text; no data fetching, no caching, no API calls |
| Rule 8: Consistency Builds Trust | All features use the same key conventions and provider pattern |

# Open Questions

- Should RTL layout switching be part of this system or handled by the theming layer?
- How should date, number, and currency formatting be integrated?
- Should lazy-loaded translation chunks be loaded on-demand per feature?
