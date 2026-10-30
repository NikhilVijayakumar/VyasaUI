# Overview

HTML Components provide the visual foundation for Proto Runtime applications. They serve as reusable user interface building blocks that enable prototype applications to use Prati Design System principles without requiring production application frameworks. HTML Components allow prototypes to simulate realistic application behavior while remaining lightweight and framework independent. (source: `docs/raw/feature/proto-runtime/html-components.md:3-9`)

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | PROTO-003 |
| Feature Name | HTML Components |
| Category | Organism |
| Priority | P0 |
| Dependencies | Design System tokens (colors, typography, spacing, elevation, motion, radius), Theme System, Localization System, Atomic Design principles |
| Future | N/A — The feature spec does not define future enhancements. The atomic hierarchy (atoms, molecules, organisms, templates) mirrors Prati component tiers for cross-prototype consistency. (source: `docs/raw/feature/proto-runtime/html-components.md:98-112`, `docs/raw/feature/proto-runtime/html-components.md:250-262`) |

# User Goals

HTML Components exist to provide reusable user interface building blocks for prototype applications. The goal is to ensure prototypes follow the same design language, accessibility requirements, localization requirements, and theme rules used throughout Prati. (source: `docs/raw/feature/proto-runtime/html-components.md:15-17`)

Prototype builders need to assemble realistic interfaces whose visual and behavioral presentation matches production Prati applications without introducing production dependencies. (source: `docs/raw/feature/proto-runtime/html-components.md:72-73`, `docs/raw/feature/proto-runtime/html-components.md:206-207`)

# User Journeys

A designer creates a dashboard prototype by composing HTML Components (atoms, molecules, organisms) into a page template. The components automatically consume design tokens from the Theme System and display localized text through the Localization System. The prototype renders consistently across light and dark mode without additional configuration. (source: `docs/raw/feature/proto-runtime/html-components.md:116-131`, `docs/raw/feature/proto-runtime/html-components.md:135-143`, `docs/raw/feature/proto-runtime/html-components.md:210-232`)

A stakeholder reviews the prototype on a mobile viewport. HTML Components reflow and resize according to responsive standards while maintaining keyboard navigation and screen reader compatibility. (source: `docs/raw/feature/proto-runtime/html-components.md:148-158`, `docs/raw/feature/proto-runtime/html-components.md:164-177`)

# Screen Inventory

N/A — HTML Components define a category of reusable building blocks, not a specific screen. Individual screens are composed by combining components within templates.

# Interaction Design

HTML Components support interaction behaviors through the Interaction Support responsibility. Components must provide visual feedback mechanisms (hover, active, focus, disabled states) as defined by the Theme System's interaction contract. Interaction patterns follow core design rules: motion must be purposeful, depth must be subtle, and interactive elements must be clearly identifiable. (source: `docs/raw/feature/proto-runtime/html-components.md:25-31`; design system rule: `docs/raw/design-system/rules/theme.md:31-38`; core rules: `docs/raw/design-system/rules/Core Design Rules.md:132-148,152-173`)

Non-interactive components (static atoms such as badges, status indicators) do not provide interaction feedback. (source: `docs/raw/feature/proto-runtime/html-components.md:41-42` — Business Logic and State Management are non-goals.)

# Form Design

N/A — HTML Components define a category of prototype building blocks, not a specific form. Individual form components (form layouts, input molecules) define their own field structure per the atomic design hierarchy. (source: `docs/raw/feature/proto-runtime/html-components.md:98-112`)

# UX State Design

N/A — HTML Components define a category of prototype components, not a specific component with defined states. Individual components (atoms, molecules, organisms) define their own states per the atomic design hierarchy. (source: `docs/raw/feature/proto-runtime/html-components.md:98-112`; design system rule: `docs/raw/design-system/rules/atomic-rules.md:8-15`)

# Feedback Design

Component-level feedback is delivered through theme-defined interaction states: hover uses `filter: brightness()` adjustments per mode, active/pressed applies `transform: scale(0.98)`, and disabled applies `opacity: 0.5` with `cursor: not-allowed`. (source: `docs/raw/feature/proto-runtime/html-components.md:25-31`; design system rule: `docs/raw/design-system/rules/theme.md:34-37`)

Motion feedback follows core design rules: animations must indicate state changes, guide attention, or confirm interaction — never decorative or slow. (source: design system rule: `docs/raw/design-system/rules/Core Design Rules.md:152-173`)

# Navigation Design

N/A — Navigation is not a responsibility of HTML Components. Navigation behavior for prototype applications is defined by the Proto Runtime Navigation feature. (source: `docs/raw/feature/proto-runtime/html-components.md:33-38` — HTML Components explicitly do not provide Application Architecture or API Integration; `docs/raw/feature/proto-runtime/overview.md:59-62` — Navigation Support is a separate Proto Runtime responsibility.)

# Responsive Design

HTML Components participate in responsive layouts and adapt across mobile, tablet, desktop, HD, 2K, and 4K viewports. Responsive behavior is defined by Prati responsive standards. (source: `docs/raw/feature/proto-runtime/html-components.md:164-177`)

Layout adaptation follows the atomic hierarchy: at desktop resolutions, components arrange horizontally with higher information density; at mobile and tablet resolutions, content stacks vertically and touch targets expand to a minimum 44px dimension. All spacing, margins, and gaps adhere to 8px multiplier increments through design tokens. (source: design system rules: `docs/raw/design-system/rules/atomic-rules.md:23-27,78-81`)

# Accessibility Design

Accessibility is a mandatory requirement for all HTML Components. The spec mandates five capabilities; each maps to a specific design system accessibility rule as follows:

| Mandatory Capability (spec) | Design System Accessibility Rule (source) |
|---|---|
| Keyboard Navigation | Interactive targets must have a minimum 44×44px hit area; `:focus-visible` must use `outline: 2px solid var(--mui-primary-main)` with 2px offset and `border-radius: inherit`; never use `:focus` alone to avoid suppressing keyboard outlines. (source: `docs/raw/design-system/rules/accessibility.md:36-42`) |
| Screen Readers | Semantic HTML elements must replace generic `<div>` tags. Landmarks must include `<header>`, `<main>`, `<nav>`, `<footer>`. Headings must follow logical nesting (H1→H2→H3). Icons must carry `aria-hidden="true"` if decorative or `aria-label="[Intent]"` if action-bearing. Status indicators require `role="status"`. (source: `docs/raw/design-system/rules/accessibility.md:8-14,49-53`) |
| Focus Management | Tab order must match visual layout. In LTR layouts, DOM order follows left-to-right reading. RTL layouts require DOM order aligned to right-to-left visual flow. (source: `docs/raw/design-system/rules/localization.md:122-126`; `docs/raw/design-system/rules/accessibility.md:36-42` — `:focus-visible` rule) |
| Semantic Markup | Use `<button>` for actions and `<a>` for navigation. No hardcoded URLs; use `data-navigation-intent` attributes. Every component file must operate at a single atomic layer — atoms, molecules, organisms, or templates — without mixing concerns. (source: `docs/raw/design-system/rules/accessibility.md:12-14`; `docs/raw/design-system/rules/atomic-rules.md:58-63,8-15`) |
| Accessible Labels | Form inputs must use `aria-labelledby="[ID]"` to associate labels. `aria-expanded` and `aria-selected` must reflect toggle and selection state. Verification attributes `data-a11y-role` and `data-a11y-intent` must be present on complex molecules and organisms. (source: `docs/raw/design-system/rules/accessibility.md:41,49-54,71-75`) |

All text-to-background combinations must meet WCAG AA minimum 4.5:1 contrast ratio. Text must use `--mui-text-primary` on `--mui-bg-default`; no pure black (`#000`) backgrounds in dark mode. (source: `docs/raw/design-system/rules/accessibility.md:21-27`)

# Localization Design

All user-facing text rendered by HTML Components must support localization. Components must never assume a single language. (source: `docs/raw/feature/proto-runtime/html-components.md:137-143`)

This maps directly to the Zero Hardcoding Policy in the design system's localization rules:

| Zero Hardcoding Policy Requirement | Implementation for HTML Components |
|---|---|
| No literal strings in markup | All text nodes must use placeholder syntax `{{t 'namespace.key'}}`. (source: `docs/raw/design-system/rules/localization.md:8-11`) |
| Translation dictionaries | String values stored in per-language JSON files under `locals/` directory (e.g., `en.json`, `ml.json`, `hi.json`). (source: `docs/raw/design-system/rules/localization.md:17-26`) |
| RTL preparation | Use CSS logical properties (`margin-inline-start` over `margin-left`) to prepare for eventual RTL mirroring. (source: `docs/raw/design-system/rules/localization.md:47-53`) |
| Verification anchor | Every localized element must carry `data-l10n="namespace.key"` for NLP-based cross-referencing against translation files. (source: `docs/raw/design-system/rules/localization.md:87-91`) |
| `lang` attribute | Active locale code must be set on `<html>` element so screen readers switch pronunciation engines. (source: `docs/raw/design-system/rules/localization.md:117-120`) |
| Text expansion | Components must allow for 30–40% text expansion in languages like German — use `overflow: visible` or proper wrapping; never clip or truncate localized text. (source: `docs/raw/design-system/rules/localization.md:112-114`) |
| Indic script typography | For `ml` and `hi` locales, increase `line-height` to minimum 1.7, avoid font weights below 400, and verify contrast visually at target weight. (source: `docs/raw/design-system/rules/localization.md:106-109`) |

# Design System Traceability

| Design System Rule | Trace to HTML Components |
|---|---|
| **Atomic Hierarchy** — Components belong to exactly one layer (atom, molecule, organism, template). No mixing of concerns. (source: `docs/raw/design-system/rules/atomic-rules.md:8-15`) | HTML Components follow the same conceptual hierarchy as Prati components: atoms, molecules, organisms, templates. (source: `docs/raw/feature/proto-runtime/html-components.md:98-112`) |
| **8px Spacing Grid** — All padding, margin, and gap values must be multiples of 8px. No hardcoded pixel values; use `var(--mui-spacing-*)`. (source: `docs/raw/design-system/rules/atomic-rules.md:23-27`) | HTML Components consume spacing design tokens. (source: `docs/raw/feature/proto-runtime/html-components.md:122-124`) |
| **No Color Hardcoding** — Every color must be a theme variable; hex codes and literal color names are forbidden. (source: `docs/raw/design-system/rules/atomic-rules.md:46-52`) | HTML Components consume color design tokens. (source: `docs/raw/feature/proto-runtime/html-components.md:121-123`) |
| **Typography Enforcement** — All text must map to predefined variants; font-size must use `clamp()` logic; no `px` overrides. (source: `docs/raw/design-system/rules/atomic-rules.md:36-40`; `docs/raw/design-system/rules/accessibility.md:60-62`) | HTML Components consume typography design tokens. (source: `docs/raw/feature/proto-runtime/html-components.md:122`) |
| **Theme-Aware Rendering** — Light and dark modes through `[data-theme]` attribute; no hardcoded color values. (source: `docs/raw/design-system/rules/theme.md:10-12`) | HTML Components participate in the Prati Theme System, automatically consuming colors, typography, spacing, elevation, motion, and radius through design tokens. (source: `docs/raw/feature/proto-runtime/html-components.md:116-131`) |
| **Zero Hardcoding Policy** — No literal strings in markup; use `{{t 'namespace.key'}}` placeholders mapped to `locals/*.json`. (source: `docs/raw/design-system/rules/localization.md:8-12`) | All user-facing text in HTML Components must support localization; components must never assume a single language. (source: `docs/raw/feature/proto-runtime/html-components.md:137-143`) |
| **Radical Simplicity** — Remove anything that does not support clarity or function; no decorative UI. (source: `docs/raw/design-system/rules/Core Design Rules.md:7-28`) | HTML Components exist to provide reusable building blocks for prototypes, following Prati design principles. (source: `docs/raw/feature/proto-runtime/html-components.md:43-56`) |
| **Consistency Builds Trust** — Predictable behavior across every element. (source: `docs/raw/design-system/rules/Core Design Rules.md:176-191`) | HTML Components follow the same design principles as Prati Components. (source: `docs/raw/feature/proto-runtime/html-components.md:43-56`) |
| **Statelessness** — No `<script>` tags for business logic; CSS states only. (source: `docs/raw/design-system/rules/atomic-rules.md:67-73`) | HTML Components do not provide business logic, state management, or application architecture. (source: `docs/raw/feature/proto-runtime/html-components.md:240-247`) |

# Open Questions

1. How do HTML Components handle missing design tokens in a non-MUI environment? The spec states framework independence (source: `docs/raw/feature/proto-runtime/html-components.md:60-73`) but the design system rules (source: `docs/raw/design-system/rules/atomic-rules.md:46-52`) require MUI CSS variable references (`var(--mui-*)`). If HTML Components are used outside an MUI-themed context, there is no fallback defined for token resolution.

2. What mechanism enforces atomic hierarchy boundary violations in HTML Components? The spec requires the hierarchy (source: `docs/raw/feature/proto-runtime/html-components.md:98-112`) and the design system forbids mixing layers (source: `docs/raw/design-system/rules/atomic-rules.md:8-15`), but no linting or validation mechanism is specified at the HTML Components category level.

3. How should component-level motion design tokens be consumed in a framework-independent context? The Theme System includes motion tokens (source: `docs/raw/feature/proto-runtime/html-components.md:126`), but the Proto Runtime overview notes the theming system does not provide animation or transition theme values (source: `docs/raw/feature/theming/README.md:21-22`). The motion integration mechanism for HTML Components is underspecified.

4. The spec lists both "Interaction Support" as a responsibility (source: `docs/raw/feature/proto-runtime/html-components.md:31`) and "State Management Frameworks" as a non-goal (source: `docs/raw/feature/proto-runtime/html-components.md:241-243`). How are interactive state changes (e.g., toggles, accordions) implemented in HTML Components without state management?

5. How do HTML Components participate in responsive layouts when individual components are framework-independent? The spec confirms responsive behavior (source: `docs/raw/feature/proto-runtime/html-components.md:164-177`) but the responsive integration mechanism (CSS media queries vs. container queries vs. responsive CSS classes) is not specified.
