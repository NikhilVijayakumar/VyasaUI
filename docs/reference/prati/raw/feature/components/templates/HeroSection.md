# HeroSection

A prominent headline section with description, call-to-action, and entrance animations.

## Overview

A high-impact landing-style component for displaying primary page content. Shows a headline with optional description text, a call-to-action button, and additional content below. Supports seven entrance animation variants (fade-up, fade-in, slide-left, slide-right, scale-up, stagger-fade, typewriter) that sequentially animate the headline, description, button, and children. The typewriter effect reveals the headline character by character.

## Responsibilities

- Render a prominent headline with optional description and call-to-action button
- Support entrance animations with multiple animation variants
- Sequentially stagger animation timing across headline, description, button, and children
- Provide typewriter effect for headline text

## Non-Responsibilities

- Does not fetch data or manage server state
- Does not handle navigation routing — action click handler is a void callback
- Does not manage scroll behavior beyond its own content area
- Does not render outside the hero section boundary
- Does not support multiple action buttons — only one primary action

## Core Concepts

- **Animation orchestration pattern:** Uses staggered delays — headline animates first, then description, then button, then children — creating a cascading entrance effect.
- **Typewriter effect mechanism:** The typewriter variant reveals headline characters one-by-one, a specialized animation path fundamentally different from the other CSS-transition-based variants.
- **Slot-based composable sections:** Headline, description, action, and children are all optional — the component gracefully renders any subset, making it reusable across landing pages, feature sections, and error pages.
- **Animation configuration as component props:** Seven animation variants, duration, delay, and stagger are all controllable via configuration rather than CSS classes, enabling per-instance animation tuning.

## Business Rules

1. The headline prop is required; all other props (description, action, children) are optional.
2. Entrance animation variants are mutually exclusive — only one variant can be active per render.
3. The typewriter variant only applies to the headline; description, button, and children render without character-by-character animation.
4. Stagger delays follow a fixed sequence: headline → description → button → children, each delayed by the configured stagger value.
5. When animations are disabled, all content renders statically without motion, regardless of the configured variant.

## States

- **Idle (animated)** — Default state with entrance animation enabled; content animates in
- **Idle (static)** — Animations disabled; content renders statically
- **Typewriter** — Headline typing in progress; cursor blinks after completion
- **Partial content** — Any combination of description, action, and children present or omitted independently

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle (animated) | Typewriter | Animation variant set to typewriter |
| Idle (animated) | Idle (static) | Animations disabled |
| Idle (static) | Idle (animated) | Animations re-enabled |
| Typewriter | Idle (animated) | Typewriter sequence completes; cursor blinks |
| Any state | Partial content | Description, action, or children props removed |

## Edge Cases

- Animations disabled: All motion disabled; content renders statically
- Typewriter variant: Only the headline animates character-by-character; other elements render without animation
- No description provided: Description slot is omitted entirely
- No action provided: Action button is omitted
- No children provided: Children slot is omitted
- Empty headline: Headline renders as empty text; typewriter variant shows cursor with no characters
- Very long headline: Text wraps within max-width container

## Error Conditions

- Empty headline — Renders empty text element; typewriter variant blinks cursor with no characters
- Missing required input (headline) — Required value must be provided

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Missing headline | Provide a non-empty headline string; the typewriter variant blinks a cursor with no characters |
| Missing description | Description is optional; the section renders without the description slot |
| Invalid animation variant | Default to a safe fallback variant (e.g., fade-up) or disable animations |

## Authorization

**Visibility:** Public — typically rendered on landing or welcome pages accessible before authentication.

## User Journey

### Entry Conditions
A user lands on a page that features a hero section with a headline, description, and call-to-action.

### Primary Flow
The user sees the headline animate in (fade-up, slide, or typewriter effect), followed by the description and action button — the entrance creates a polished first impression.

### Alternate Flows
Animations are disabled — the content renders statically without motion.

### Failure Flows
The headline is empty — the typewriter variant shows only a blinking cursor with no characters.

### Recovery Flows
The developer provides a non-empty headline string.

### Exit Conditions
The user reads the hero content and clicks the call-to-action or scrolls down.

## Workflow

### Trigger
A developer renders this section with a headline, and optionally a description, action config, and children.

### Preconditions
At least a headline string is provided.

### Steps
The component renders the headline, optional description, optional action button, and optional children — each element animates sequentially based on the selected variant.

### Outcomes
A visually engaging hero section is displayed with staggered entrance animations.

### Exceptions
Empty headline — renders an empty text element; typewriter shows a blinking cursor.
### Completion Criteria

The hero section renders with all provided content and entrance animations play.

## Verification

- Verify that the headline renders with the configured entrance animation variant
- Verify that the typewriter effect reveals the headline text character by character and shows a blinking cursor on completion
- Verify that elements animate in the correct sequential order: headline → description → button → children
- Verify that disabling animations renders all content statically without motion
- Verify that omitting the description, action, and children individually produces the correct partial layout

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [PageHeader](./PageHeader.md) — template for authenticated page-level headers

## Future Enhancements

- Secondary action button slot for multi-CTA hero sections
- Background image or gradient overlay as a prop
- Reduced-motion variant that respects user accessibility settings
- Scroll-down indicator at the bottom of the section

## Open Questions

- Should animation defaults be configurable at the theme or provider level rather than per-instance?
- What is the expected behavior when typewriter variant is combined with animations disabled?
