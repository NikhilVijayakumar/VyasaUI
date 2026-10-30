# Overview

Card is a styled container that groups related content in a bordered surface with an optional header section (title, supporting text, action slot). Body renders children. All header sections are independently optional — only renders when props are provided. Uses border-based premium styling (no shadow).

# Feature Summary

- **Purpose**: Group related content in a styled container with optional header
- **Responsibilities**: Render bordered container surface; display optional header with title, supporting text, and action slot; render children as body content
- **Non-Responsibilities**: No state management/persistence; no data fetching; no click events beyond action slot; no layout constraints; no scroll/overflow behavior
- **Authorization**: Authenticated
- **Premium UI**: Border-based surface treatment (not shadow)

# User Goals

| Goal | Description |
| ---- | ----------- |
| Group content | Visually group related information in a defined container |
| Label context | Use header title to describe card's content category |
| Provide actions | Place action elements (buttons, links) in header action slot |
| Display supporting text | Show secondary description below title |
| Compose layouts | Use card as building block for forms, dashboards, detail views |

# User Journeys

### Entry Conditions
Developer renders Card component with optional header props and children within a layout context.

### Primary Flow
1. Developer provides `title="User Profile"`, `supportingText="Account information"`, action slot with "Edit" button, children with profile fields
2. Card renders bordered surface with header row containing title, supporting text, action button
3. Body section renders children below header
4. User reads title, supporting text, interacts with action button, views children

### Alternate Flows
- **No header**: Developer omits all header props — only children rendered inside bordered surface
- **Empty state**: All props omitted — renders empty bordered surface with padding and border (32px padding)
- **Action only**: Developer provides only action slot (no title or supporting text) — header row renders with action alone
- **Title only**: Developer provides only title — header row renders with title; no supporting text or action slots

### Failure Flows
- **Action overflow**: Action slot content exceeds available card width — action content overflows; user cannot interact properly
- **Null/undefined children**: Card renders bordered surface with no visible body content; header sections remain unaffected

### Recovery Flows
- Action overflow: Developer adjusts action content size or card container width
- Null children: Developer provides valid children or accepts empty body

### Exit Conditions
User finishes reading/interacting with content; card remains visible in layout until parent unmounts.

| Journey | Description |
| ------- | ----------- |
| Full card | Title, supporting text, action, and children all rendered |
| Headerless card | Only children rendered; no header row |
| Action-only header | Header renders with action slot only; title and supporting text absent |
| Empty card | No header props and no children; empty bordered surface |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| Card container | Bordered surface with optional header and body; placed within parent layout |

# Interaction Design

| Interaction | Trigger | Behavior |
| ----------- | ------- | -------- |
| Action click | Click action slot element (button/link) | Propagates to parent via action element's own handler |
| No card-level click | N/A | Card does not handle click events per spec |

Card is a passive container — all interactivity is delegated to action slot children.

# Form Design

| Section | Behavior |
| ------- | -------- |
| Header title | Display-only text; not interactive |
| Supporting text | Display-only text; not interactive |
| Action slot | Renders arbitrary element placed by parent (typically a button) |
| Children | Arbitrary content rendered as card body |

No form fields — card is a layout container.

# UX State Design

| State | User Experience | Trigger |
| ----- | --------------- | ------- |
| Full | Header with title + supporting text + action; children rendered as body | At least one header prop and children present |
| No header | Bordered surface with only children; no header row | All header props omitted; children present |
| Empty | Bordered surface with padding (32px) and border; no visible content | All props (header + children) omitted |

**Quality Checklist**: LOADING — not applicable (passive container); ERROR — not applicable (no data fetching); EMPTY — empty surface with padding and border.

# Feedback Design

| Event | Feedback | Mechanism |
| ----- | -------- | --------- |
| Content renders | Card surface with border appears | CSS border via `--border-card` variable |
| Header renders | Flex row with title, supporting text, action | Conditional rendering of header when at least one header prop provided |
| Action focus | Focus ring on action element | Native focus-visible behavior on action slot element |
| Empty render | Bordered surface with padding | Minimal visual presence; no text or content |

# Navigation Design

| Path | Behavior |
| ---- | -------- |
| Parent → Card | Card renders inline in parent's layout flow |
| Card → parent | No navigation; action slot elements may trigger parent handlers |

Card does not affect URL, routing, or navigation state.

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop (≥768px) | Full width of parent container; header flex row with title + supporting text left, action right |
| Tablet (480–768px) | Same as desktop; supporting text may wrap if long |
| Mobile (≤480px) | Full width of parent; header may stack if action slot is large; children flow vertically; 16px internal padding |

# Accessibility Design

| Requirement | Implementation |
| ----------- | -------------- |
| Touch target | Action slot elements must be 44×44px (responsibility of parent) |
| Focus-visible | Action slot elements show focus ring (responsibility of parent) |
| Semantic HTML | Card uses `article` element; header uses `header` element with `h2`/`h3` for title |
| Heading hierarchy | Title rendered as `h2` or `h3` depending on context; parent specifies level |
| Contrast | Border `--border-subtle` meets 4.5:1 against surface; text uses `--color-text-primary` |
| ARIA | `role="group"` with `aria-labelledby` pointing to title element when header present |

# Localization Design

| Key Pattern | Example | Scope |
| ----------- | ------- | ----- |
| No internal keys | N/A | Card does not hardcode any text strings |

All text (title, supporting text) is provided via props by parent. Card has zero hardcoded strings internally.

# Design System Traceability

| Rule | Application |
| ---- | ----------- |
| Radical Simplicity | No state, no data fetching, no click handling, no scroll/overflow — pure layout container |
| Typography Leads | Title uses `--font-heading-sm`; supporting text uses `--font-body-sm`; hierarchy through weight and size |
| White Space is Feature | 16px padding (body), 16px padding (header), 32px padding (empty state); consistent spacing |
| Color System | Border `--border-subtle`; background `--surface-card`; title `--color-text-primary`; supporting text `--color-text-secondary`; all via CSS variables |
| Accessibility | `article`/`header` semantic elements; `aria-labelledby` for grouping; heading hierarchy |
| Localization | Zero hardcoded strings — all text from parent props |
| 8px Grid | All padding values multiples of 8 (16px, 24px, 32px) |
| Premium UI — Card Surfaces | Border-based surface treatment (no shadow); subtle `--border-subtle` for premium feel |
| Quality Checklist | LOADING (N/A), ERROR (N/A), EMPTY (empty surface with padding) |

# Open Questions

- Should empty state include an optional "No content" placeholder prop, or is the bordered surface intentional?
- Is action slot overflow prevention the developer's responsibility entirely, or should Card provide `overflow: hidden` on its container?
- Should the title heading level be configurable via prop (e.g., `headingLevel="h2"`) for proper document outline?
