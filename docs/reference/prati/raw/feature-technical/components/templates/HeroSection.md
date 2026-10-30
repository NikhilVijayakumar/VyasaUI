# HeroSection: Feature Technical

## 1. Technical Overview

`HeroSection` is a template-tier component at `src/common/components/templates/HeroSection.tsx`. It renders a high-impact landing section with a prominent headline (required), optional description, optional primary action button, optional children slot, and 7 entrance animation variants powered by `framer-motion`. Includes a `TypewriterHeadline` sub-component for character-by-character reveal animation. Exported via `src/common/components/templates/index.ts` → `src/lib.ts`. Consumed as `import { HeroSection } from 'prati'`.

```typescript
type AnimationVariant =
  | "fade-up" | "fade-in" | "slide-left" | "slide-right"
  | "scale-up" | "stagger-fade" | "typewriter";

interface HeroSectionProps {
  headline: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  children?: ReactNode;
  enableAnimation?: boolean;      // default: true
  animationVariant?: AnimationVariant;  // default: "fade-up"
  animationDuration?: number;     // default: 600
  animationDelay?: number;        // default: 0
  animationStagger?: number;      // default: 100
}
```

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Atomic Hierarchy** | Template tier — composes MUI atoms (Box, Typography, Button) and framer-motion `motion.*` wrappers. Section-level layout. No business logic. See `docs/raw/architecture/core/component-tiers.md`. |
| **Stateless UI** | Partially compliant per `docs/raw/architecture/invariants/stateless-ui.md`. Uses `useState` + `useEffect` inside `TypewriterHeadline` for character reveal timing — this is UI presentation state (animation), not domain state. Framer-motion manages its own internal state for entrance animations. |
| **Theme Sovereignty** | Compliant — spacing via `spacing.ts` tokens; colors via MUI theme paths. Button uses `variant="contained"` `color="primary"` which resolves through MUI theme pipeline. No hardcoded color values. See `docs/raw/architecture/invariants/theme-sovereignty.md`. |
| **Localization** | `headline`, `description`, `primaryActionLabel` are raw string props — consumer must pass translated strings via `useLanguage()`. See `docs/raw/architecture/core/localization.md`. |
| **Public API Stability** | Stable — exported via barrel from `templates/index.ts`. All 7 animation variant strings are public API. See `docs/raw/architecture/core/api-surface.md`. |
| **Dependency Safety** | Adds `framer-motion` as runtime dependency. Must be declared as peer dependency in consumer `package.json`. See `docs/raw/architecture/core/dependencies.md`. |

## 3. Data Flow

```
Consumer passes props
  → HeroSection reads enableAnimation
    → false: renders all content statically (no motion.* wrappers)
    → true: selects animation config from animationConfigs lookup
      → Headline: motion.div (animated) OR TypewriterHeadline OR static Typography
        → TypewriterHeadline: useState for character reveal via setInterval
      → Description (optional): motion.div with calculated delay OR static
      → Button (optional): motion.div with calculated delay OR static
      → Children (optional): motion.div with calculated delay OR static Box
```

Animation timing:

| Element | Delay Formula |
|---|---|
| Headline | `animationDelay` |
| Description | `animationDelay + animationDuration` |
| Action Button | `animationDelay + animationDuration * 1.5` |
| Children | `animationDelay + animationDuration * 2` |

Internal `animationConfigs` constant maps variant strings to framer-motion `initial`/`animate` objects:

```typescript
const animationConfigs = {
  "fade-up":         { initial: { opacity: 0, y: 20 },    animate: { opacity: 1, y: 0 } },
  "fade-in":         { initial: { opacity: 0 },            animate: { opacity: 1 } },
  "slide-left":      { initial: { opacity: 0, x: -30 },   animate: { opacity: 1, x: 0 } },
  "slide-right":     { initial: { opacity: 0, x: 30 },   animate: { opacity: 1, x: 0 } },
  "scale-up":        { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  "stagger-fade":    { initial: { opacity: 0, y: 10 },   animate: { opacity: 1, y: 0 } },
  "typewriter":      { initial: { opacity: 0 },            animate: { opacity: 1 } },
};
```

## 4. State Management

- **HeroSection**: No state beyond props. Stateless aside from animation orchestration.
- **TypewriterHeadline (internal sub-component)**: Uses `useState` for character index tracking and `useEffect` with `setInterval` for character reveal timing. State is strictly UI presentation scope (character index), not domain data.
- **Framer-motion**: Manages internal animation state (opacity, transform) — not React state, not observable.
- **No `useDataState`**: No async data — compliant with template-tier rules per `docs/raw/architecture/core/state-management.md`.

## 5. Styling Implementation

- **Layout**: Outer `Box` with flex column, `maxWidth: 800px`, centered via `margin: "0 auto"`, `textAlign: "center"`, `padding` via `spacing.xl`
- **Headline**: `Typography variant="h2"`, `fontWeight: 700` via `sx`, `color="text.primary"`
- **Description**: `Typography variant="body1"`, `color="text.secondary"`
- **Button**: MUI `variant="contained"` `color="primary"` — resolves through MUI theme pipeline. No hardcoded color values.
- **Spacing**: Inter-element gaps via `spacing.md`, `spacing.lg` from `src/theme/tokens/spacing.ts`

## 6. Interaction Design

- **Primary action button**: MUI `<Button>` with `onClick={onPrimaryAction}`. If `onPrimaryAction` is undefined, the button still renders but is non-functional.
- **Animation entrance**: Content animates in on mount (or on viewport entry) — no user interaction required to trigger.
- **Typewriter effect**: Headline reveals characters sequentially. After completion, cursor blinks (CSS `@keyframes` blink animation).
- **No hover/focus animations**: No additional interaction beyond MUI Button defaults.

## 7. Accessibility Implementation

- **`prefers-reduced-motion`**: NOT respected. `enableAnimation` is a prop-based toggle — consumer must detect `prefers-reduced-motion` via `window.matchMedia("(prefers-reduced-motion: reduce)")` and pass `enableAnimation={false}`. See risk/gap in `docs/raw/architecture/invariants/stateless-ui.md`.
- **Typewriter**: No `aria-live="polite"` region — screen readers do not announce progressively revealed text. The full headline text should be set as `aria-label` on the container.
- **Button**: Native MUI `<Button>` provides keyboard focusability and ARIA button role.
- **No landmark role**: Outer container has no `role="banner"` or `aria-label`. Consumer should wrap appropriately.

## 8. Error Handling

| Condition | Behavior |
|---|---|
| Missing `headline` | TypeScript compilation error (required prop) |
| Empty `headline` (`""`) | Typewriter renders blinking cursor with no characters; static renders empty Typography |
| Missing `description` | Description slot omitted |
| Missing `primaryActionLabel` | Button omitted |
| Missing `onPrimaryAction` | Button renders without click handler |
| `enableAnimation=false` | All content renders statically — valid state |
| Invalid `animationVariant` | TypeScript compilation error (union type) |
| Framer-motion runtime error | Content degrades to static (motion.div wraps content regardless) — error propagates to parent |
| Typewriter interval on unmount | `useEffect` cleanup clears `setInterval` — currently handled |

## 9. Performance Considerations

- **Typewriter**: Uses `setInterval` — cleanup handled in `useEffect` return. Interval interval is derived from `animationStagger` (default 100ms). For long headlines, animation time = `headline.length * 100ms`.
- **Framer-motion**: Animations are GPU-accelerated (opacity, transform). No layout thrashing.
- **Bundle cost**: Adds `framer-motion` as runtime dependency (~30KB gzipped). MUI Box, Typography, Button.
- **No `React.memo`**: Parent re-render triggers HeroSection re-render. Each animated element is a `motion.div` — framer-motion optimizes internal renders.
- **No scroll-based animations**: Animations trigger on mount only. No `IntersectionObserver` or scroll listeners.

## 10. Integration Points

| Integration | Mechanism |
|---|---|
| **Consumer app** | Import `{ HeroSection }` from `prati`. Pass headline + optional props. |
| **Localization** | Consumer resolves `headline`, `description`, `primaryActionLabel` via `useLanguage().literal[key]` before passing as props. |
| **Theming** | MUI `ThemeProvider` must be ancestor. Button uses `variant="contained"` `color="primary"` — resolves through theme pipeline for dark mode support. |
| **Animation customization** | Consumer tunes `animationVariant`, `duration`, `delay`, `stagger` per instance. |
| **Reduced motion** | Consumer detects `prefers-reduced-motion` and passes `enableAnimation={false}`. |
| **Page routing** | `onPrimaryAction` calls consumer's navigation or modal trigger. |

## 11. Open Questions

- Should `animationDuration`, `animationDelay`, and `animationVariant` defaults be configurable at a theme or provider level instead of per-instance?
- What is the expected behavior when `animationVariant="typewriter"` is combined with `enableAnimation=false` — should typewriter be treated as animation or text presentation?
- ~~Should the Button be migrated from hardcoded `colors.primary` to MUI theme path — and if so, should this be a breaking change for consumers relying on the current brand color?~~ **Resolved**: Button uses `color="primary"` via MUI theme pipeline.
- Should a secondary action button slot be added for multi-CTA hero layouts?
- Should `prefers-reduced-motion` be detected internally or remain a consumer responsibility?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
