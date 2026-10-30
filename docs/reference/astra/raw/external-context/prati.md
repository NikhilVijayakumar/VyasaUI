# External Context: Prati

## Overview

Prati is a React design system and component library providing 46 UI components organized by Atomic Design, Material UI 7 theming with design tokens, localization infrastructure, an interactive prototype runtime, and a Handlebars template renderer. Astra depends on Prati for component slot shapes (Loading, Error, Empty) consumed via `AppStateComponents` interface, and for localization primitives (`LanguageProvider`, `useLanguage`, `literal` key structure) consumed via the `Record<string, string>` literal contract passed to `ApiService`. Dependency scope is Specific — Design System (component slot contracts) and Localization (literal key patterns only).

## Repository Summary

Prati is a standalone React UI library that pairs with Astra for MVVM architecture and state management, but works independently as a design system. It provides 46 UI components (atoms, molecules, organisms, templates), MUI 7 theming with light/dark token sets, dictionary-based localization with runtime language switching, an interactive prototype runtime for stakeholder review, and a Handlebars template renderer for email/notification content. Prati is fully written in TypeScript with peer dependencies on React 19, MUI 7, Emotion, and Emotion Styled.

## Repository Identity

| Field | Value |
|---------|---------|
| Repository Name | Prati |
| Repository Purpose | React design system and component library providing UI primitives, theming, localization, and prototype runtime |
| Repository Type | Design System Platform |

## Dependency Scope

```
Dependency Scope: Specific

Relevant Areas:
- Design System (component slot shapes consumed via AppStateComponents interface)
- Localization (literal key structure, useLanguage hook contract)
```

## Responsibilities

| Responsibility | Evidence |
|----------------|----------|
| Provides 46 UI components organized by Atomic Design | README: "46 UI Components: Atoms → Molecules → Organisms → Templates organized by Atomic Design" |
| Owns theme system with MUI 7 ThemeProvider, light/dark token sets, createAstraTheme | README: "Theming: MUI 7 ThemeProvider with built-in light/dark token sets, createAstraTheme for brand overrides" |
| Owns localization system with LanguageProvider, useLanguage hook, LanguageSelector | README: "Localization: LanguageProvider, useLanguage hook, and LanguageSelector UI" |
| Owns AppStateHandler component and useDataState hook for async state orchestration | docs/raw/architecture/integration-contracts/state-management.md: "Defines the useDataState hook and AppStateHandler component — the primary mechanisms for async state orchestration in Prati." |
| Owns DataState interface and DataState lifecycle (loading/error/data) | docs/raw/architecture/integration-contracts/state-management.md: "interface DataState<T> { loading: boolean; error: string | null; data: T | null; }" |
| Enforces MVVM architecture with strict layer separation | docs/raw/architecture/invariants/mvvm-separation.md: "Prati is a presentation-oriented UI component library. Application architecture follows the Model-View-ViewModel (MVVM) pattern." |

## Non-Responsibilities

| Non-Responsibility | Evidence |
|--------------------|----------|
| Does not own routing | README: "Not a routing library — use React Router or your framework's router" |
| Does not own state management (beyond useDataState primitive) | README: "Not a state management solution — use Astra, Redux, or Zustand" |
| Does not own backend services | README: "Not a backend service — Prati is purely a UI layer" |
| Does not own application structure | README: "Not an application framework — Prati provides components, not application structure" |
| Does not own business logic | docs/raw/architecture/invariants/mvvm-separation.md: "Model layer contains domain logic, data access, and business rules" — owned by consumer |
| Does not own theme tokens for consumer applications | docs/raw/architecture/invariants/theme-sovereignty.md: theme tokens are Prati's internal mechanism; consumer applications define their own brand overrides via createAstraTheme |
| Does not own translation management platform (no PO/XLIFF import/export) | docs/raw/feature/localization/README.md: "Not a translation management platform (no PO/XLIFF import/export)" |
| Does not perform automatic language detection or geolocation-based defaults | docs/raw/feature/localization/README.md: "Does not perform automatic language detection or geolocation-based defaults" |
| Does not handle pluralization or interpolation rules | docs/raw/feature/localization/README.md: "Does not handle pluralization or interpolation rules" |
| Does not manage RTL layout switching | docs/raw/feature/localization/README.md: "Does not manage RTL layout switching" |

## Key Concepts

| Concept | Description |
|----------|------------|
| **AppStateComponents** | Slot interface defining component shapes for Loading, Error, and Empty states. Consumed via React context by AppStateHandler. The interface is: `{ Loading?: FC; Error?: FC<{ message?: string }>; Empty?: FC }` |
| **AppStateHandler** | Routing component in Prati that renders different UI based on DataState. Accepts LoadingComponent, ErrorComponent, and SuccessComponent slots. In Astra, these slots are filled via AppStateContext provider. |
| **DataState** | Async operation state: `{ loading: boolean; error: string | null; data: T | null }`. Produced by useDataState hook in ViewModel layer. |
| **useLanguage** | Hook returning `{ literal: Record<string, string>, currentLanguage: string }`. The `literal` object maps dot-notation keys to translated strings. |
| **Literal Key Contract** | Translation dictionaries use flat dot-notation keys like `"ui.save"`, `"msg.error"`, `"form.name.label"`. Keys use category prefixing (`ui.*`, `msg.*`, `form.*`, `validation.*`). |
| **LanguageProvider** | Provider component accepting `translations`, `availableLanguages`, and `defaultLanguage` props. Must be nested inside ThemeProvider — nesting order is fixed. |
| **Provider Hierarchy** | Fixed nesting: `<ThemeProvider> → <LanguageProvider> → <App>`. Consumer providers (Auth, Router) go inside both Prati providers. |
| **MVVM Layer Separation** | View layer (components) → ViewModel layer (hooks/use*) → Model layer (repos, domain). Data flows one direction: Model → ViewModel → View. |
| **Theme Sovereignty** | All visual styling derives from Prati's theme token system. Components must not define hardcoded color, spacing, or typography values. |

## Repository Rules

| Rule | Source |
|-------|--------|
| Provider nesting order is fixed: ThemeProvider outermost, LanguageProvider inside it | docs/raw/architecture/integration-contracts/getting-started.md |
| useDataState may only be called from ViewModel hooks — never from component files directly | docs/raw/architecture/integration-contracts/state-management.md |
| AppStateHandler must only be used in Views (components), never in ViewModels | docs/raw/architecture/integration-contracts/state-management.md |
| Components must reference theme tokens exclusively for all visual properties — no hardcoded values | docs/raw/architecture/invariants/theme-sovereignty.md |
| Components must reference translation keys exclusively for all user-facing text — no hardcoded strings | docs/raw/architecture/invariants/localization.md |
| Translation keys must be flat dot-notation strings; nested object dictionaries are not supported | docs/raw/feature/localization/patterns.md |
| Every key must start with a category prefix (ui.*, msg.*, form.*, validation.*) | docs/raw/feature/localization/patterns.md |
| Missing translation key must never throw an error — consuming code must handle with fallback | docs/raw/feature/localization/README.md |
| The public API is defined by the package's exports in src/lib.ts and sub-path exports in package.json | docs/raw/architecture/invariants/public-api-stability.md |
| Views must never import from the Model layer | docs/raw/architecture/invariants/mvvm-separation.md |
| ViewModels must never import from the View layer | docs/raw/architecture/invariants/mvvm-separation.md |
| ViewModels must not manage UI interaction state (animation, open/closed) | docs/raw/architecture/invariants/mvvm-separation.md |

## Contracts

| Contract | Purpose |
|-----------|----------|
| **AppStateComponents interface** | Slot contract for Loading, Error, Empty component shapes. Used by Astra via AppStateContext.Provider to inject component implementations into Prati's AppStateHandler. |
| **Literal Record<string, string>** | Translation key-value map passed to ApiService for error message resolution. Keys follow Prati's dot-notation convention. |
| **useDataState → DataState** | Async state hook producing loading/error/data state tuple. Consumed by Astra ViewModels for state orchestration. |
| **AppStateHandler slot props** | LoadingComponent, ErrorComponent, SuccessComponent, retry callback — the rendering contract between Astra's state layer and Prati's UI. |
| **ThemeProvider + LanguageProvider nesting** | Fixed provider hierarchy contract that Astra must follow at application root. |

## Recommended Documentation

| Documentation Area | Purpose |
|--------------------|----------|
| docs/raw/architecture/integration-contracts/state-management.md | Defines useDataState, DataState, and AppStateHandler — the primary async state contracts between Astra and Prati |
| docs/raw/architecture/invariants/mvvm-separation.md | Defines the View/ViewModel/Model layer boundaries that Astra's MVVM architecture must respect |
| docs/raw/architecture/integration-contracts/getting-started.md | Provider hierarchy and minimal setup contract |
| docs/raw/feature/localization/README.md | Localization system overview, useLanguage hook, literal key access patterns |
| docs/raw/feature/localization/patterns.md | Translation key naming conventions and dictionary structure |
| docs/raw/architecture/invariants/localization.md | Localization compliance rules for components |
| docs/raw/architecture/invariants/public-api-stability.md | Public API contracts and semver guarantees |

## AI Guidance

### What to understand first

Astra consumes Prati through two seams: (1) the `AppStateComponents` slot interface (`{ Loading?: FC; Error?: FC<{ message?: string }>; Empty?: FC }`) — an Astra-provided context that fills Prati's `AppStateHandler` default state components, and (2) the `literal: Record<string, string>` contract — a Prati-conventioned key-value map passed into `ApiService` for error message resolution. These are the only cross-repository contracts. Astra does not consume Prati components, theme tokens, or runtime behavior directly.

### Important rules

- Provider hierarchy at the application root must follow: `<ThemeProvider> → <LanguageProvider> → <App>`. Consumer providers (Auth, Router) go inside both.
- Translation keys in the `literal` object must follow flat dot-notation: `"category.key"` format with category prefix.
- `useDataState` belongs in ViewModel hooks only, never in components. `AppStateHandler` belongs in View components only, never in ViewModels.
- The MVVM boundary: Astra owns the ViewModel (hooks) and Model (repo, API) layers. Prati owns the View (component) layer.

### Important boundaries

- Astra does NOT reference Prati theme tokens. Theme awareness is the consumer application's responsibility.
- Astra does NOT import or depend on Prati's component implementations (DataTable, Card, etc.). The `AppStateComponents` slot is the only component contract crossed.
- Astra does NOT consume Prati's prototype runtime, template renderer, or navigation infrastructure.
- Astra does NOT manage UI state (animations, open/closed, selection) — that belongs in the View layer controlled by the consumer app using Prati components.

### Common mistakes

- Placing `useDataState` calls directly in component files instead of ViewModel hooks.
- Importing repository/domain files directly in View components, bypassing ViewModel layer.
- Hardcoding UI state management (useState for open/closed) in ViewModel hooks instead of the View component.
- Nesting LanguageProvider outside ThemeProvider — breaks the fixed provider hierarchy.
- Using Prati theme token values for Astra brand colors — brand overrides should use `createAstraTheme` at the consumer level.
- Passing the `literal` object with nested keys instead of flat dot-notation keys.

### Important assumptions

- Prati components (DataTable, Card, etc.) are assumed to exist and render correctly — Astra does not verify their implementation.
- The consumer application is responsible for mounting both ThemeProvider and LanguageProvider before any Astra ViewModels or components render.
- Astra's `AppStateProvider` is expected to fill the `AppStateComponents` slot with appropriate Loading, Error, and Empty components. If not provided, `AppStateHandler` will render nothing for those states.
- Prati's `ThemeProvider` persists `darkMode` preference via `localStorage` — Astra relies on this for theme persistence without managing it independently.

## Traceability Matrix

| Claim | Evidence |
|--------|----------|
| Prati provides 46 UI components organized by Atomic Design | README.md: "46 UI Components: Atoms → Molecules → Organisms → Templates organized by Atomic Design" |
| Prati pairs with Astra for MVVM architecture | README.md: "Prati is a standalone UI library — it pairs with Astra for MVVM architecture and state management" |
| AppStateComponents defines Loading/Error/Empty slot shapes | src/common/components/organisms/AppStateContext.ts in Astra: `interface AppStateComponents { Loading?: FC; Error?: FC<{ message?: string }>; Empty?: FC }` |
| AppStateHandler consumes AppStateComponents via context | src/common/components/organisms/AppStateHandler.tsx in Astra: `const { Loading, Error: ErrorComp, Empty } = useContext(AppStateContext)` |
| ApiService accepts literal: Record<string, string> | src/common/repo/ApiService.ts in Astra: `constructor(baseUrl: string, literal: Record<string, string>, ...)` |
| DataState interface: loading, error, data | docs/raw/architecture/integration-contracts/state-management.md: `interface DataState<T> { loading: boolean; error: string | null; data: T | null }` |
| Provider hierarchy: ThemeProvider → LanguageProvider → App | docs/raw/architecture/integration-contracts/getting-started.md: "ThemeProvider ← outermost... LanguageProvider ← inside ThemeProvider... App" |
| Translation keys use flat dot-notation with category prefix | docs/raw/feature/localization/patterns.md: "Keys must be flat dot-notation strings... every key must start with a category prefix" |
| ViewModels must not return JSX or import View components | docs/raw/architecture/invariants/mvvm-separation.md: "ViewModel may NOT import View components (no JSX, no component references)" |
| Views must not import from Model layer | docs/raw/architecture/invariants/mvvm-separation.md: "View may NOT import from the Model layer (repositories, domain services, API clients)" |
| Theme sovereignty: no hardcoded visual values | docs/raw/architecture/invariants/theme-sovereignty.md: "Components must reference theme tokens exclusively for all visual properties" |
| Localization: no hardcoded user-facing strings | docs/raw/architecture/invariants/localization.md: "Components must reference translation keys exclusively for all user-facing text" |
| Public API defined by src/lib.ts exports | docs/raw/architecture/invariants/public-api-stability.md: "The public API is defined by the package's exports in src/lib.ts" |
| Prati is a Design System Platform | README.md: "A React design system and component library providing 46 UI components" |

## Open Questions

None. All claims are supported by documentation evidence.
