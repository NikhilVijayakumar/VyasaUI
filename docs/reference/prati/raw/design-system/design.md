# Astra Design System

> Premium Best-in-Class, Award-Winning Design System
> Dark & Light Theme · Dual-Mode · General-Purpose UI Framework
> This file is the canonical source of truth for all UI, styling, and visual work.
> Agents must read this before touching any visual artifact.

---

## Table of Contents

1. [Brand Philosophy](#1-brand-philosophy)
2. [Reference Matrix](#2-reference-matrix)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Surface & Elevation](#6-surface--elevation)
7. [Theme System](#7-theme-system)
8. [Component Patterns](#8-component-patterns)
9. [Animation System](#9-animation-system)
10. [Interaction States](#10-interaction-states)
11. [Accessibility](#11-accessibility)
12. [Localization](#12-localization)
13. [MUI Token Mapping](#13-mui-token-mapping)
14. [Atomic Rules](#14-atomic-rules)
15. [Viewport Strategy](#15-viewport-strategy)
16. [Quality Checklist](#16-quality-checklist)
17. [React MUI Implementation Guide](#17-react-mui-implementation-guide)
18. [Huashu Design Enhancements](#18-huashu-design-enhancements)

---

## 1. Brand Philosophy

**Astra is a premium general-purpose UI framework. The interface must communicate calm authority, precision, and trust — comparable in quality to Apple, Stripe, and Notion.**

> Great design removes friction and reveals clarity.

The brand rests on three non-negotiable pillars:

| Pillar | Description | Implementation |
|---|---|---|
| **Precision** | Design feels engineered and intentional | Strict spacing grid, perfect alignment, predictable rhythm |
| **Clarity** | Information is immediately understandable | Typography-led hierarchy, minimal decoration, purposeful color |
| **Restraint** | Minimalism elevates focus and elegance | Limited palette, no decorative UI, whitespace treated as a feature |

### The 10 Core Design Rules

1. **Radical Simplicity** — Remove anything that doesn't directly support clarity or function. If it doesn't improve usability, hierarchy, or comprehension, remove it.
2. **Precision in Spacing** — All spacing follows the 8px grid. Layouts feel engineered, not assembled.
3. **Typography Leads** — Hierarchy is established through type, spacing, and contrast — not decoration.
4. **Color as Guidance** — Accent colors highlight primary actions only. Neutral tones dominate.
5. **White Space is Feature** — Treat whitespace as an essential structural element, not empty space.
6. **Depth is Subtle** — Elevation through soft shadows. Never heavy drop shadows, never aggressive gradients.
7. **Motion is Purposeful** — Animation indicates state change and guides attention. Never decorative.
8. **Consistency Builds Trust** — Every element behaves predictably across every screen.
9. **Detail Reflects Craftsmanship** — Micro-spacing, alignment, corner radii, text balance — all matter.
10. **Restraint Defines Premium** — The most premium design is defined by what it chooses NOT to include.

### Brand Identity

**Logo**

The Astra logo is at `docs/raw/design/logo/company_logo.svg`.

| Element | Value |
|---------|-------|
| Primary mark | `#029AFF` / `#019AFF` / `#0099FF` (brand blue tones) |
| Secondary mark | `#FCFEFF` / `#FAFDFF` (light tones) |
| Logo file | `docs/raw/design/logo/company_logo.svg` |

The brand blue `#029AFF` serves as the **secondary accent** in the design system (alongside primary accent `#5A60F5`). Use `#029AFF` for:
- Branded navigation elements (sidebar icons, section markers)
- External-facing UI (public pages, marketing surfaces)
- Status indicators requiring brand recognition

Use `#5A60F5` for:
- Primary actions and CTAs (buttons, links, focus rings)
- Interactive states (hover, active, selected)
- Informational UI cues

### Premium Aesthetic Modes

**Geometric Silence** — Pure order and restraint. Grid-based precision, dramatic negative space, Swiss formalism meets material honesty. Every alignment is the result of deliberate refinement.

**Chromatic Language** — Color as information. Geometric zones create meaning. Typography anchors what color communicates. Minimal words, maximum clarity.

> The final artifact must look meticulously crafted — as if labored over by a designer at the absolute top of their field. "Good enough" is unacceptable. The UI must elicit an emotional response through its craftsmanship.

---

## 2. Reference Matrix

Use these canonical benchmarks when making design decisions. Always cite the reference, not vague ideals.

| Layer | Reference | Key Extract | Signal |
|---|---|---|---|
| **Theme** | Apple | Token discipline, invisible shadows, spacing as hierarchy | How few colors are used; shadows nearly invisible |
| **Theme** | Stripe | Controlled gradient, strong type scale, mature light/dark | Modular type ratios; accent restraint |
| **Localization** | Airbnb | Multi-language sentence adaptation, clean RTL | Button resize, paragraph reflow, no clipping |
| **Viewport** | Notion | True mobile-first, comfortable desktop, 4K scaling | Container width caps, sidebar collapse, scroll ergonomics |
| **Component** | Atlassian | State coverage, consistent affordances, validation clarity | Disabled vs loading, error positioning, hit-area discipline |
| **Page** | Shopify | Hero → proof → CTA flow, strong vertical rhythm | Narrative sequencing, section breathing space |
| **Navigation** | Amazon | Deep but structured, strong breadcrumb, discoverability | Graph depth discipline, path clarity under complexity |
| **Premium** | Porsche | Massive whitespace, low noise density, minimal palette | Spacing dominance, hero calmness, typography restraint |
| **Emotion** | A24 | Strong emotional clarity, mood-driven layout, visual silence | Tone consistency, contrast shaping emotion |
| **Menus** | Figma | Structured clarity, logical grouping, balanced density | Menu psychology, footer symmetry, header consistency |
| **Enterprise** | IBM | Serious hierarchy, stable documentation layout, trust signals | Typography authority, structured content density |

### Animation References

| Emotion | Motion Style | Reference | Duration |
|---|---|---|---|
| Calm | Fade + minimal translate | A24 | 300–500ms |
| Trust | Subtle + predictable | IBM | 200–250ms |
| Premium | Slow + spacious | Porsche | 300–500ms |
| Energetic | Faster + higher contrast | Apple | 150–200ms |
| Playful | Spring + micro bounce | Figma | 120–200ms |
| System clarity | Fade + opacity | Stripe | 150–200ms |
| Precision SaaS | Tight + consistent | Linear | 120–200ms |

Instead of vague prompts like "make it premium," use:
- "Follow Porsche-level spacing restraint"
- "Use Stripe typography scale discipline"
- "Apply IBM predictable motion timing"
- "Maintain Airbnb localization elasticity"

---

## 3. Color System

> All values consumed via CSS variables. Never hardcode hex values in component styles.

### Brand Accent

```ts
primary:       '#5A60F5'   // Soft indigo — CTAs, primary actions, focus rings
primaryHover:  '#5255DF'   // Darker — interactive states
brand:         '#029AFF'   // Astra brand blue — navigation, branded elements, external UI
brandHover:    '#019AFF'   // Darker brand blue — interactive brand states
secondary:     '#8a8f98'   // Neutral secondary — icons, subtle elements
```

### Light Mode Palette

```ts
// Backgrounds
background.default:  '#F5F5F7'   // Barely gray — never pure white
background.paper:    '#FFFFFF'   // Elevated surfaces — cards, modals

// Text
text.primary:    '#111318'   // Near-black — headings, body
text.secondary:  '#687076'   // Muted — captions, metadata, hints

// Borders
border:  'rgba(0, 0, 0, 0.08)'  // Hairline separators

// Dividers
divider:  '#E5E7EB'  // Neutral 200 range
```

### Dark Mode Palette

```ts
// Backgrounds (layered — never pure black)
background.default:  '#0e1015'   // Deep charcoal — base layer
background.paper:    '#16181D'   // Slightly lighter — cards, drawers
background.panel:    '#1E2028'   // Highest elevation — modals, popovers

// Text (4–5 contrast tiers)
text.primary:    '#EDEDEF'   // Near-white — headings, body
text.secondary:  '#8A8F98'   // Muted — captions, metadata

// Borders
border:  'rgba(255, 255, 255, 0.08)'  // Subtle separators
divider:  '#374151'  // Neutral 700 — never pure black dividers
```

### Status Palette

```ts
error:    '#ED5F74'   // Errors, destructive actions
warning:  '#F5A623'   // Warnings
success:  '#34C759'   // Success states
info:     '#5A60F5'   // Informational (same as primary)
crisis:   '#F85149'   // Critical alerts — HR safety/emergency
```

### Golden Color Rules

**Light Mode:**
- Avoid pure white (`#FFFFFF`) as the dominant surface — use `#F5F5F7`
- Use 3–5 neutral steps between surfaces
- Prefer space over borders to separate content
- Text: near-black (`#111318`), not absolute black

**Dark Mode:**
- Avoid pure black (`#000000`) — use layered charcoals
- Maintain 4–5 surface tiers for depth
- Keep accent saturation controlled — never neon in dark mode
- Dividers: `Neutral 700` range, never solid black lines

### Icon Tokens

Style: Feather Icons / Lucide Icons — geometric, minimal, 2px stroke weight. Never filled icons in enterprise/product UI.

**Size scale:**

```ts
icon-xs:  12px   // Inline badges, status dots
icon-sm:  16px   // Form inputs, inline text icons
icon-md:  20px   // Toolbars, lists, navigation items (default)
icon-lg:  24px   // Prominent UI, empty states, feature highlights
icon-xl:  32px   // Hero icons, page-level status indicators
```

**Color tokens:**

```ts
icon-primary:   var(--mui-primary-main)        // Action icons, interactive
icon-secondary: var(--mui-text-secondary)      // Decorative, muted
icon-disabled:  'rgba(0,0,0,0.38)'             // Disabled — light mode
icon-error:     var(--mui-error-main)          // Error indicators
icon-success:   var(--mui-success-main)        // Success indicators
icon-warning:   var(--mui-warning-main)        // Warning indicators
icon-brand:     var(--mui-brand)               // Brand-colored elements
```

**Icon rules:**
- Default: `icon-md` (20px) in all standard UI contexts
- Navigation sidebar: `icon-md` (20px)
- Empty state illustrations: `icon-lg` or `icon-xl`
- Decorative icons: always `aria-hidden="true"`
- Functional icons (no visible label): always `aria-label="[intent]"`
- Never use icon color alone to convey meaning — pair with label or tooltip

---

## 4. Typography

### Font Stack

```ts
sans:  '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif'
mono:  '"IBM Plex Mono", "Menlo", "Courier New", monospace'
```

### Type Scale

| Variant | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `h1` | 2rem (32px) | 600 | 1.2 | `-0.02em` | Page headings — monumental form |
| `h2` | 1.5rem (24px) | 600 | 1.3 | `-0.02em` | Section headings |
| `h3` | 1.25rem (20px) | 600 | 1.4 | `-0.01em` | Subsection headings |
| `h4` | 1.125rem (18px) | 600 | 1.4 | `0` | Card titles |
| `h5` | 1rem (16px) | 600 | 1.5 | `0` | Small headings |
| `h6` | 0.875rem (14px) | 600 | 1.5 | `0.02em` | Micro labels, uppercase |
| `body1` | 0.9375rem (15px) | 400 | 1.5 | `0` | Primary body — premium electron standard |
| `body2` | 0.8125rem (13px) | 400 | 1.5 | `0` | Secondary text, dense info |
| `body2Medium` | 0.8125rem (13px) | 500 | 1.5 | `0` | Emphasized body |
| `button` | 0.875rem (14px) | 500 | 1.0 | `0` | Buttons — no transform |
| `caption` | 0.75rem (12px) | 500 | 1.4 | `0.01em` | Labels, quiet context |
| `captionBold` | 0.75rem (12px) | 600 | 1.4 | `0.01em` | Bold labels |
| `overline` | 0.6875rem (11px) | 600 | 1.4 | `0.08em` | Section labels, uppercase |
| `monoBody` | 0.8125rem (13px) | 400 | 1.5 | `0` | Code, IDs, technical data |
| `monoCaption` | 0.75rem (12px) | 500 | 1.4 | `0` | Monospace captions |
| `micro` | 0.625rem (10px) | 600 | 1.2 | `0.04em` | Uppercase badges only |
| `splashTitle` | 0.875rem (14px) | 600 | 1.5 | `0.02em` | Display headers, wide tracking |
| `hero` | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.1 | `-0.03em` | Dashboard KPIs only |

### Typography Rules

- Body text: always `body1` (15px) or `body2` (13px). Never smaller than `caption` (12px) in production UI
- Headings: use semantic `<h1>–<h6>`, never `<div>` with font styling
- Line length: cap prose at `65ch` for readability
- `hero` variant: reserved exclusively for top-level dashboard KPI metrics
- All font sizes: use `rem`, never `px` — honor browser zoom
- All fluid sizes: use `clamp()` — never static pixel font sizes
- Hierarchy: drastic contrast between heading levels, not subtle steps
- Headers: deep negative tracking (`-0.02em`) for tight, cohesive visual blocks
- Labels/captions: uppercase with wide tracking (`0.02em`) for quiet context

---

## 5. Spacing & Layout

### Spacing Scale

Base unit: **8px** (MUI standard). All spacing must be multiples of 8px.

| Token | CSS Variable | Value | Pixels | Usage |
|---|---|---|---|---|
| `spacing-0` | `--mui-spacing-0` | 0 | 0px | Reset |
| `spacing-1` | `--mui-spacing-1` | 1× | 8px | Tight internal gaps |
| `spacing-2` | `--mui-spacing-2` | 2× | 16px | Standard component padding |
| `spacing-3` | `--mui-spacing-3` | 3× | 24px | Internal component sections |
| `spacing-4` | `--mui-spacing-4` | 4× | 32px | Card padding, section gaps |
| `spacing-5` | `--mui-spacing-5` | 5× | 40px | Page sections |
| `spacing-6` | `--mui-spacing-6` | 6× | 48px | Section dividers |
| `spacing-8` | `--mui-spacing-8` | 8× | 64px | Major layout sections |
| `spacing-12` | `--mui-spacing-12` | 12× | 96px | Page-level separations |

### Border Radius

```ts
radius-sm:   4px    // Badges, chips, small buttons
radius-md:   8px    // Buttons, inputs (default)
radius-lg:   12px   // Cards
radius-xl:   16px   // Panels, modals
radius-2xl:  24px   // Hero cards, featured content
radius-full: 9999px // Pills, avatars
```

### Shadows (Light Mode — Dark Mode uses opacity reduction)

```ts
shadow-xs:  '0 1px 2px rgba(0,0,0,0.05)'
shadow-sm:  '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)'
shadow-md:  '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)'
shadow-lg:  '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)'
shadow-xl:  '0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)'
```

Dark mode: `rgba(0,0,0,0.3)–rgba(0,0,0,0.5)` for same levels. Never flat in dark mode.

### Glassmorphism (webapp contexts only)

When the target platform permits glassmorphism, apply with deliberate constraint:
- Background opacity: `rgba(var(--bg-paper-rgb), 0.7)` minimum for text contrast
- Inset border: `1px solid rgba(255, 255, 255, 0.15)` to simulate glass edge
- Backdrop filter: `blur(20px) saturate(1.8)`
- Drop shadow: required to lift off background canvas

### Layout Rules

- Content max-width: `1280px` centered
- Page gutters: `16px` mobile, `32px` md+, `48px` xl+
- Section padding: `48px` minimum vertical
- Whitespace: structural element — use `spacing-6` (48px+) for section dividers

### Breakpoints

| Name | Min Width | Target |
|---|---|---|
| `xs` | 0px | Mobile base |
| `sm` | 600px | Tablet |
| `md` | 900px | Desktop sidebar visible |
| `lg` | 1200px | Multi-column grids |
| `xl` | 1920px | 4K density scaling |

Design **mobile-first**: base styles target `< 600px`.

---

## 6. Surface & Elevation

| Surface | Light Mode | Dark Mode | MUI Mapping |
|---|---|---|---|
| Default BG | `#F5F5F7` | `#0e1015` | `palette.background.default` |
| Paper/Card | `#FFFFFF` | `#16181D` | `palette.background.paper` |
| Panel/Modal | `#FFFFFF` | `#1E2028` | Highest elevation |
| AppBar | `#F5F5F7` | `#0e1015` | `MuiAppBar` overrides |
| Navigation | `#FFFFFF` | `#16181D` | `MuiDrawer` overrides |

> **Critical**: Dark mode requires `backgroundImage: 'none'` on Paper and AppBar to prevent MUI's default elevation overlays from interfering with the custom palette.

### Elevation Logic

- **No border** → Elevation replaces borders in light mode (Apple-reference)
- **Subtle border** → `1px solid var(--mui-divider)` where separation is required
- **Shadow** → Light use only; dark mode uses surface contrast, not shadows
- **AppBar**: always `border-bottom: 1px solid var(--mui-divider)`, `background-image: none`
- **Drawer**: `border-right: 1px solid var(--mui-divider)`

---

## 7. Theme System

### Architecture

```
ThemeProvider (wraps app)
    ├── lightTheme (MUI Theme Object)
    ├── darkTheme (MUI Theme Object)
    └── ThemeContext → useTheme() hook → ThemeToggle component
```

### Theme Toggle

- Attribute: `[data-theme="dark"]` on `<body>`
- Storage: `localStorage` key `"darkMode"` (boolean)
- All component styles inherit from `var(--mui-...)` CSS variables
- Hardcoded hex values in component styles are **strictly prohibited**

### CSS Variable Architecture

```css
:root {
  /* Light mode defaults */
  --mui-bg-default: #F5F5F7;
  --mui-bg-paper: #FFFFFF;
  --mui-text-primary: #111318;
  --mui-text-secondary: #687076;
  --mui-divider: #E5E7EB;
  --mui-primary-main: #5A60F5;
  --mui-radius-md: 8px;
  --mui-spacing-1: 8px;
  --mui-spacing-2: 16px;
  --mui-spacing-4: 32px;
}

[data-theme="dark"] {
  --mui-bg-default: #0e1015;
  --mui-bg-paper: #16181D;
  --mui-text-primary: #EDEDEF;
  --mui-text-secondary: #8A8F98;
  --mui-divider: #374151;
}
```

### Hover / Interaction States

| State | Light Mode | Dark Mode |
|---|---|---|
| Hover | `filter: brightness(0.95)` | `filter: brightness(1.1)` |
| Active/Pressed | `transform: scale(0.98)` | same |
| Disabled | `opacity: 0.5; cursor: not-allowed` | same |
| Focus | `outline: 2px solid var(--mui-primary-main); outline-offset: 2px` | same |

---

## 8. Component Patterns

### Buttons

| Variant | Background | Text | Border | Use Case |
|---|---|---|---|---|
| `primary` | `#5A60F5` | white | none | Main CTA |
| `secondary` | transparent | `#5A60F5` | `var(--mui-divider)` | Secondary actions |
| `ghost` | transparent | text primary | none | Tertiary, icon buttons |
| `danger` | `#ED5F74` | white | none | Destructive actions |
| `disabled` | neutral | neutral-300 | none | Unavailable state |

- Height: `36px` (default), `32px` (sm), `44px` (lg touch target)
- Border radius: `var(--mui-radius-md)` — 8px
- Text transform: always `none`
- Focus ring: `2px solid` with `2px` offset — never remove, only replace
- Hover: subtle elevation `translateY(-2px)` + shadow increase

### Card Surfaces

Cards are **containers for clarity, not decoration**.

Structure:
1. Title — clear heading
2. Supporting information — metadata, captions
3. Primary action or data — the core content

Rules:
- Soft surface contrast: `background: var(--mui-bg-paper)`
- Subtle elevation: `shadow-sm` light mode; surface contrast dark mode
- Internal padding: `spacing-3` (24px) minimum
- Never cramped, never overly decorated, never visually heavy
- `border-radius: var(--mui-radius-lg)` (12px)

### Data Tables

Tables prioritize **legibility and scanning speed**.

- Column alignment: clear, left-aligned text, right-aligned numbers
- Row separators: `1px solid var(--mui-divider)` — subtle, never heavy
- Row height: `52px` default, `40px` compact
- Row hover: `background: rgba(var(--primary-rgb), 0.04)`
- Avoid: dense rows, excessive grid lines, visual clutter
- Support: sorting (visual arrow indicators), filtering (inline or toolbar), selection (checkbox)

### Forms

Forms should feel **simple, structured, and calm**.

- Label: always above input, never placeholder-only
- Input height: `40px` default
- Input border: `1px solid var(--mui-divider)` → focus: `2px solid var(--mui-primary-main)`
- Error: border + helper text in `var(--mui-error-main)` — positioned below input
- Group related fields with `spacing-3` (24px) vertical gap between groups
- `spacing-2` (16px) between label and next field group
- Show only necessary fields — reduce friction

### Toolbars

- Clear grouping: primary actions left, secondary grouped right
- Icon usage: minimal — label when space permits
- Spacing: `spacing-1` (8px) between icons, `spacing-2` (16px) between groups
- Dividers: `1px solid var(--mui-divider)` vertical between groups

### Side Panels

Panels preserve context and **reduce navigation friction**.

- Width: `360px` default, `480px` wide variant
- Animation: `slideInRight 200ms cubic-bezier(0.4, 0, 0.2, 1)`
- Structure: header with title + close, scrollable content area, sticky footer with actions
- Content: focused — no unrelated information
- Avoid: overly wide panels, cluttered layouts

### Notifications / Toast

- Position: bottom-right (desktop), bottom (mobile)
- Duration: 3000ms success/info, 5000ms warning/error, manual dismiss for errors
- Style: minimal — icon + message + optional action
- Never: large intrusive alerts, excessive animations, overly bright colors
- Auto-dismiss with subtle fade-out animation

### Navigation (Sidebar)

- Width: `240px` expanded, `64px` collapsed
- Background: `var(--mui-bg-default)` — same as page, separated by `border-right`
- Active item: `background: rgba(var(--primary-rgb), 0.08)` + left accent border `3px solid var(--mui-primary-main)`
- Hover: `background: rgba(var(--primary-rgb), 0.04)`
- Section labels: `caption` variant, uppercase, `letter-spacing: 0.08em`, `color: var(--mui-text-secondary)`

### Form Inputs

```css
input {
  border: 1px solid var(--mui-divider);
  border-radius: var(--mui-radius-md);
  height: 40px;
  padding: 0 var(--mui-spacing-2);
}
input:focus {
  outline: none;
  border: 2px solid var(--mui-primary-main);
}
input.error {
  border-color: var(--mui-error-main);
}
```

### Loading / Skeleton

Loading states must be **predictable and minimal**.

- Skeleton: match actual component dimensions, use shimmer animation
- Spinner: `CircularProgress` for indeterminate, linear for determinate
- Never block full page — use skeleton per section
- Duration: shimmer `1.5s ease-in-out infinite`

```tsx
// MUI skeleton pattern
<Skeleton variant="rectangular" width="100%" height={48} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="text" sx={{ fontSize: '1rem' }} />
```

### Dialog / Modal

Modals are for **focused tasks, not information**.

- Width: `480px` default, `640px` wide, `360px` narrow
- Title: required, clear, describes the action
- Actions: primary + secondary, right-aligned, `spacing-2` gap
- Close: X icon top-right + Escape key
- Never stack modals — one at a time
- Backdrop: `rgba(0,0,0,0.5)` light, `rgba(0,0,0,0.7)` dark

### Empty State

Empty states are **opportunities, not errors**.

- Illustration (optional): simple graphic, max 120px height
- Title: required, describes what's absent
- Description: optional, explains why + what to do next
- Action: primary CTA to populate the empty area
- Never show blank white/black space

### Error State

Error states are **actionable recoveries**.

- Icon: error icon or status indicator
- Title: short, describes what failed
- Message: optional, specific error detail
- Action: retry button or alternative path
- Never: raw error codes, technical jargon

### Tooltip / Popover

Tooltips are for **discovery, not instruction**.

- Delay: `300ms` show, `100ms` hide
- Text: short, 1-2 lines max
- Position: top by default, auto-flip to avoid overflow
- Never: critical information in tooltips (should be visible)
- Popover for richer content: click-triggered, dismiss on Escape

### Tabs

Tabs organize **related content into views**.

- Style: underline indicator, `3px` height, `var(--mui-primary-main)` color
- Active: bold weight, primary color
- Inactive: `var(--mui-text-secondary)`
- Never: more than 6 tabs, tab content mixing unrelated concerns
- Scrollable on mobile: left/right arrow buttons

### Progress / Stepper

Progress indicators show **position in a multi-step flow**.

- Steps: 3-5 max, numbered or icon
- Active: primary color
- Completed: success color
- Pending: secondary text color
- Optional: connector line between steps

### Multi-Step Workflow

Multi-step workflows guide users through a **sequential task that cannot be completed in one view**.

- Step count: 3–7 steps. Beyond 7, restructure the flow.
- Progress indicator: stepper at page top — always visible during the workflow
- Step labels: short, verb-led ("Select", "Configure", "Review")

**State rules:**
- Current step: primary color + bold label
- Completed steps: checkmark + muted style — clickable to revisit
- Pending steps: neutral color — not interactive until reached
- Back: never discards data — preserves all inputs from prior steps
- Next: validates current step before advancing — shows inline errors on fail
- Exit: confirmation dialog if any step has unsaved progress

**Final step (Review + Confirm):**
- Always include a summary view before the commit action
- Primary action: final commit button (e.g., "Submit", "Create", "Save")
- Secondary action: "Back" to last step
- Never allow commits without a review step in destructive or irreversible flows

**Error recovery:**
- Stay on current step
- Highlight specific fields with inline error messages
- Scroll to first error automatically

### Confirmation Flow

Confirmation flows prevent **accidental destructive or irreversible actions**.

**When to use:**
- Delete actions (records, files, accounts)
- Discard actions (unsaved form data, draft cancellation)
- Irreversible state changes (publish, submit, deactivate)

**Standard dialog pattern:**
- Title: action-specific ("Delete Project?", "Discard Changes?")
- Body: short consequence statement — one sentence max
- Primary action: confirms the action — label matches title verb ("Delete", "Discard")
- Secondary action: always "Cancel" — ghost or secondary button

**Destructive variant (delete/deactivate):**
- Primary button: `danger` variant (`#ED5F74`) — never primary indigo
- Backdrop: not dismissible on click — forces explicit Cancel or Confirm
- Escape key: triggers Cancel

**Non-destructive variant (discard/navigate away):**
- Primary button: standard `primary` variant
- Backdrop: dismissible on click (treated as Cancel)
- Escape key: triggers Cancel

**Never:**
- Inline confirmation without a dialog for destructive actions
- "OK / Cancel" as button labels — use action-specific verbs
- Stack a confirmation inside another modal

### Search

Search allows users to **locate specific records within a dataset**.

**Pattern:**
- Input: text field with leading search icon, trailing clear (✕) button
- Width: full-width within its container or fixed `320px` in toolbars
- Placeholder: descriptive ("Search tasks...", "Find employees...")
- Debounce: 300ms before triggering search
- Results: update inline without full page reload

**States:**
- Empty input: show full dataset (no filter active)
- Typing: show loading indicator after debounce fires
- Results: update list/table below — no separate results page needed for in-app search
- No results: empty state with "No results for '[query]'" + clear search link
- Error: error state with retry option

**Accessibility:**
- Input: `role="searchbox"` or `type="search"`
- Clear button: `aria-label="Clear search"`
- Results region: `aria-live="polite"` to announce result count changes

### Filter

Filters allow users to **narrow a dataset by one or more criteria**.

**Pattern types:**

| Type | When to use |
|------|-------------|
| Chip/tag bar | ≤5 filter options, always visible |
| Dropdown filter | Single-select from a list |
| Filter panel (drawer) | Complex multi-criteria filtering |

**Active state:**
- Selected filters: chips with ✕ to remove individually
- Active filter count badge on filter button when panel is closed
- "Clear all filters" action — always visible when any filter is active
- Chips use `primary` tint background, not full accent fill

**Filter + Search:**
- Search and filter operate simultaneously — results reflect both
- Filter state persists when search query changes
- Search state persists when filters change

**Accessibility:**
- Each filter chip: `aria-label="Remove [filter name] filter"`
- Filter count badge: `aria-label="[N] filters active"`
- Results region: `aria-live="polite"` to announce updated count

### State Handler Pattern

Use `AppStateHandler` from Astra for consistent state routing:

```tsx
<AppStateHandler
  appState={state}
  SuccessComponent={DataView}
  emptyCondition={(data) => data.length === 0}
  errorMessage="Failed to load data"
/>
```

This component handles LOADING → ERROR → SUCCESS → EMPTY transitions automatically.

### Z-Index Scale

```ts
z-base:     0
z-raised:   10
z-dropdown: 200
z-sticky:   300
z-overlay:  400
z-modal:    500
z-toast:    600
z-tooltip:  700
```

---

## 9. Animation System

### Core Principle

> Move less than you think. Animation is a structural amplifier, not decoration.

Premium animation must support structure, respect density, align with emotion, preserve restraint, and maintain intent consistency.

### Duration Tiers

| Type | Range | Reference |
|---|---|---|
| Micro-interaction | 120–200ms | Linear, Stripe |
| Navigation / panel | 200–300ms | IBM, Airbnb |
| Cinematic / reveal | 300–500ms | Porsche, A24 |

### Easing Functions

```css
/* Enterprise / Trust (IBM, Stripe) */
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);

/* Decelerate / Entrance */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);

/* Accelerate / Exit */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);

/* Cinematic / Luxury (Porsche) */
--ease-luxury: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

Use a single easing family per emotion profile. Never mix easing styles within one flow.

### Transform Boundaries (Premium never exceeds these)

```css
scale:      <= 1.05   /* subtle lift */
translateY: <= 16px   /* entrance offset */
translateX: <= 24px   /* panel slide */
rotation:   <= 2deg   /* rare, icon only */
```

### Motion Frequency Limit

```text
Animated elements per viewport: <= 5
Simultaneous animations:        <= 3
```

### Standard Patterns

**Entrance (list/grid items):**
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Staggered: delay += 50ms per item, max 5 items */
```

**Card hover lift:**
```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: transform 150ms var(--ease-standard),
              box-shadow 150ms var(--ease-standard);
}
```

**Side panel slide:**
```css
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.side-panel { animation: slideInRight 200ms var(--ease-decelerate); }
```

**Skeleton loading:**
```css
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
}
.skeleton {
  background: linear-gradient(90deg, var(--mui-divider) 25%,
    rgba(255,255,255,0.1) 50%, var(--mui-divider) 75%);
  background-size: 200% auto;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Reduced Motion

Always respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### What NOT to Do

- Dribbble-heavy parallax chaos
- 20+ animated elements on load
- Auto-playing everything
- High-frequency bouncing / elastic effects
- Random durations per element
- Decorative animations with no functional purpose
- Bounce easing (`cubic-bezier` overshoot) in enterprise/trust contexts

---

## 10. Interaction States

All interactive elements must have clearly defined states:

| State | Visual Treatment |
|---|---|
| **Default** | Base style |
| **Hover** | `brightness(0.95)` light / `brightness(1.1)` dark + subtle lift |
| **Active/Pressed** | `scale(0.98)` — tactile feedback |
| **Focus** | `outline: 2px solid var(--mui-primary-main); outline-offset: 2px` |
| **Disabled** | `opacity: 0.5; cursor: not-allowed; pointer-events: none` |
| **Loading** | Skeleton or spinner — never block interaction unnecessarily |
| **Error** | Error color border + helper text below |
| **Success** | Fade-in success indicator — auto-dismiss |

### Hover (Cards and Actionable Elements)

- Subtle negative translation: `transform: translateY(-2px)` + shadow increase
- Never trigger aggressive layout shifts on hover
- Duration: `150ms var(--ease-standard)`

### Focus (Keyboard Navigation — Required)

```css
:focus-visible {
  outline: 2px solid var(--mui-primary-main);
  outline-offset: 2px;
  border-radius: inherit;
}
```

---

## 11. Accessibility

Accessibility improves usability for all users. These are not optional — they are requirements.

### Color Contrast

- Body text: minimum **4.5:1** (WCAG AA)
- Large text (18px+ or 14px bold): minimum **3:1**
- Interactive elements: minimum **3:1**
- Always test both light and dark mode
- Use `--mui-text-primary` on `--mui-bg-default` — never assume contrast

### Semantic HTML

| Requirement | Rule |
|---|---|
| Landmarks | Every page: `<header>`, `<main>`, `<nav>`, `<footer>` |
| Headings | Logical nesting H1→H2→H3. Never skip levels |
| Buttons vs Links | `<button>` for actions, `<a>` for navigation |
| Forms | Every input has associated `<label>` (not placeholder only) |

### Interactive Targets

- Minimum touch target: **44×44px** (WCAG 2.5.5)
- All interactive elements keyboard-reachable
- Visible `:focus-visible` on all interactive elements

### ARIA

| Element | Attribute | Purpose |
|---|---|---|
| Decorative icons | `aria-hidden="true"` | Screen reader skip |
| Action icons (no text) | `aria-label="[intent]"` | Announces function |
| Status indicators | `role="status"` | Live updates |
| Form inputs | `aria-labelledby` or `aria-label` | Label association |
| Expanded elements | `aria-expanded="true/false"` | State communication |
| Selected items | `aria-selected="true/false"` | Selection state |

### Typography Accessibility

- All font sizes in `rem` — respect browser zoom
- Body text: minimum `line-height: 1.5`
- Header text: minimum `line-height: 1.2`
- Text over images: minimum 40% opacity scrim
- Never use color alone to convey meaning

---

## 12. Localization

### Architecture

```
LanguageProvider → LanguageContext → useLanguage() hook
```

### Hook Usage

```tsx
const { literal } = useLanguage();
<h1>{literal["header.title"]}</h1>
<button>{literal["ui.save"]}</button>
```

### Key Naming Conventions

| Pattern | Example |
|---|---|
| `category.key` | `ui.save`, `msg.error` |
| `component.key` | `header.title`, `footer.copyright` |
| `screen.action` | `login.submit`, `settings.reset` |

### Zero Hardcoding Policy

```ts
// Correct
{ "attendance.selected": "{{count}} employees selected" }

// Wrong — breaks word order in other languages
{ "attendance.count": "{{count}}", "attendance.employees": "employees selected" }
```

### Pluralization

```ts
{
  "alerts.one": "You have 1 pending alert",
  "alerts.other": "You have {{count}} pending alerts"
}
```

### RTL Support

- Use CSS logical properties: `margin-inline-start` not `margin-left`
- Apply `dir="rtl"` at `<html>` element
- Mirror directional icons: `transform: scaleX(-1)`

### Date & Number Formatting

Always use `Intl` API — never manual formatting:
```ts
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
new Intl.NumberFormat(locale).format(number)
```

---

## 13. MUI Token Mapping

The translation layer from React theme objects to CSS variables.

### Color Mapping

| React Theme Property | CSS Variable | Semantic Context |
|---|---|---|
| `palette.primary.main` | `--mui-primary-main` | Primary actions |
| `palette.secondary.main` | `--mui-secondary-main` | Secondary elements |
| `palette.background.default` | `--mui-bg-default` | Page background |
| `palette.background.paper` | `--mui-bg-paper` | Cards, modals, surfaces |
| `palette.text.primary` | `--mui-text-primary` | High-contrast text |
| `palette.text.secondary` | `--mui-text-secondary` | Subtitles, hints |
| `palette.divider` | `--mui-divider` | Borders, separators |
| `palette.error.main` | `--mui-error-main` | Error states |
| `palette.success.main` | `--mui-success-main` | Success states |
| `palette.warning.main` | `--mui-warning-main` | Warning states |

### Component-Specific Overrides

**AppBar:**
```css
border-bottom: 1px solid var(--mui-divider);
background-image: none; /* prevents MUI elevation overlay */
```

**Drawer (Sidebar):**
```css
background: var(--mui-bg-default);
border-right: 1px solid var(--mui-divider);
```

**Buttons:**
```css
border-radius: var(--mui-radius-md); /* 8px */
text-transform: none;
```

### Verification Anchor Tags

Inject on elements for the Verification Project:
- `data-mui-color` — elements using primary/secondary colors
- `data-mui-variant` — typography elements (e.g., `data-mui-variant="h5"`)
- `data-mui-spacing` — containers using specific gap/padding logic
- `data-viewport` — root container per viewport (e.g., `data-viewport="desktop"`)
- `data-navigation-intent` — all interactive elements
- `data-a11y-role` — complex component roles
- `data-section` — every major Organism for visual auditing

---

## 14. Atomic Rules

### The Three Layers

| Layer | Definition | MUI Mapping |
|---|---|---|
| **Atoms** | Smallest functional units: Icons, Typography, Buttons | `MuiButton`, `MuiTypography`, `MuiIcon` |
| **Molecules** | Groups of Atoms: Search Bar, Status Chip, Attendance Row | `MuiBox` (with children), `MuiCardHeader` |
| **Organisms** | Complex sections: Navigation Sidebar, Table with Filters | `MuiAppBar`, `MuiDrawer`, `MuiDataGrid` |

### The 8px Grid Rule (Absolute)

- All `padding`, `margin`, `gap` values: multiples of **8px**
- Never use hardcoded pixel values (e.g., `15px`) — always use CSS variables
- Standard molecule gap: `var(--mui-spacing-2)` (16px) unless feature docs specify otherwise
- Molecules: use `display: flex` or `display: grid`

### Typography Enforcement

- Never override `font-size` in component styles — use foundation variables
- Heading elements: `<h1>–<h6>`, never styled `<div>`
- Fluid scaling: always use `clamp()` values from foundations for viewport adaptation
- `hero` variant: dashboard KPI values only

### No Hardcoding (Strict)

```css
/* NEVER */
color: #5A60F5;
font-size: 14px;
padding: 15px;
width: 400px;

/* ALWAYS */
color: var(--mui-primary-main);
font-size: var(--type-button);
padding: var(--mui-spacing-2);
width: clamp(300px, 30vw, 480px);
```

### No `<a>` Tags with Hardcoded URLs

```html
<!-- NEVER -->
<a href="/attendance">Go to Attendance</a>

<!-- ALWAYS -->
<button data-navigation-intent="route-to-attendance">Go to Attendance</button>
```

---

## 15. Viewport Strategy

### Supported Viewport Matrix

| Viewport | Resolution | Aspect Ratio | Focus |
|---|---|---|---|
| **4K** | 3840×2160 | 16:9 | Maximum information density, multi-column organisms |
| **2K/1440p** | 2560×1440 | 16:9 | High-fidelity dashboarding, generous whitespace |
| **1080p** | 1920×1080 | 16:9 | Standard desktop "Source of Truth" |
| **Tablet** | 768×1024 | 3:4 | Touch-friendly molecules, vertical stacking |
| **Mobile** | 375×812 | 9:19.5 | Single-column flow, collapsed navigation |

### Fluid Layout Rules

```css
/* Containers: never stretch on ultrawide */
max-width: var(--viewport-max-width, 1280px);
margin-inline: auto;

/* Gaps: breathe as screen grows */
gap: clamp(var(--mui-spacing-1), 2vw, var(--mui-spacing-4));

/* Flex containers: never overflow */
flex-wrap: wrap;
```

### MUI Breakpoint Mapping

Each viewport maps to MUI's responsive breakpoints. Use `sx` prop breakpoint syntax for all responsive layouts.

| Viewport | MUI Breakpoint | Min Width | Layout Strategy |
|----------|---------------|-----------|-----------------|
| Mobile | `xs` | 0px | Single column, collapsed sidebar, bottom navigation |
| Tablet | `sm` | 600px | Two columns, stacked cards, touch targets 44px+ |
| Desktop | `md` | 900px | Sidebar visible, multi-column, default density |
| Desktop wide | `lg` | 1200px | 3+ column grids, full information density |
| 2K/4K | `xl` | 1920px | Max container 1280px, generous whitespace |

```tsx
// MUI responsive sx pattern
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 1, md: 2, lg: 3 },
  padding: { xs: 2, md: 3, xl: 4 },
}}>
```

```tsx
// Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
<Grid container spacing={{ xs: 2, md: 3 }}>
  {items.map(item => (
    <Grid item xs={12} sm={6} lg={4} key={item.id}>
      <Card>{item.content}</Card>
    </Grid>
  ))}
</Grid>
```

```tsx
// Conditional rendering by breakpoint
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

{isMobile ? <MobileNav /> : <Sidebar />}
```

### Safe Zones

- **4K**: Keep critical actions within a central `2560px` container — prevent neck strain
- **Mobile**: Maintain minimum `16px` horizontal margin from screen edge
- **Touch targets**: minimum `44×44px` on tablet and mobile

### Viewport-Specific Considerations

- **Desktop**: Prioritize information density and horizontal layouts
- **Mobile/Tablet**: Prioritize vertical stacking, touch-friendly targets, single-column flow
- **Sidebar**: Visible on `md` (900px+), collapsed/hidden on mobile

---

## 16. Quality Checklist

Apply before releasing any screen, component, or interface.

### Structure & Hierarchy

- [ ] Purpose of screen is immediately clear — user understands it within seconds
- [ ] Most important information is visually dominant
- [ ] Secondary elements clearly subordinate
- [ ] Hierarchy established through typography, spacing, contrast — not color alone

### Spacing & Alignment

- [ ] All spacing follows 8px grid
- [ ] Margins consistent throughout
- [ ] Elements align to grid structure
- [ ] No visual tension from misalignment
- [ ] Internal component spacing is balanced

### Typography

- [ ] Line height is comfortable (body: 1.5, headings: 1.2+)
- [ ] Font weights are consistent and intentional
- [ ] Headings and body clearly differentiated
- [ ] No more than 2 font weights on a single screen
- [ ] No dense text blocks without breathing room

### Color

- [ ] Accent colors highlight key actions only
- [ ] Neutral colors dominate the interface
- [ ] Color meaning is consistent throughout
- [ ] No decorative color usage
- [ ] Dark mode: no pure blacks, layered surfaces
- [ ] Light mode: no pure white dominant surfaces

### Components

- [ ] Buttons look consistent across screens
- [ ] Cards follow the same layout logic
- [ ] Form elements behave predictably
- [ ] Interactive elements clearly identifiable

### Motion & Interaction

- [ ] Hover states visible and comfortable
- [ ] Transitions smooth (120–300ms, appropriate easing)
- [ ] System feedback clear and timely
- [ ] No decorative animations
- [ ] `prefers-reduced-motion` respected

### Accessibility

- [ ] Text contrast: 4.5:1 minimum for body text
- [ ] Focus states visible on all interactive elements
- [ ] Touch targets: 44×44px minimum
- [ ] Semantic HTML structure (landmarks, heading hierarchy)
- [ ] ARIA attributes on complex components

### Polish & Craft

- [ ] Icon alignment precise
- [ ] Text truncation handled gracefully
- [ ] Corner radii consistent throughout
- [ ] Subtle spacing differences resolved
- [ ] Nothing unnecessary remaining

### Final Standard

> If a screen feels visually effortless, it has likely achieved the Astra design quality standard.
> 
> Premium design is not about adding more. It is about removing everything unnecessary.

---

## 17. React MUI Implementation Guide

### Token → MUI Theme → sx Prop Pipeline

```
Design tokens (docs/raw/design/design.md)
    → MUI theme object (createTheme in src/)
        → CSS variables (--mui-*)
            → sx props / styled() / makeStyles
```

Never bypass the chain. Never use hardcoded hex or px in component `sx` props.

```tsx
// CORRECT — uses theme tokens
<Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>

// WRONG — hardcoded values
<Box sx={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px' }}>
```

### Container → ViewModel → View in React

Every feature follows the MVVM pattern:

```tsx
// Container.tsx — owns data lifecycle
function FeatureContainer() {
  const [state, execute] = useDataState<DataType>();
  useEffect(() => { execute(() => FeatureRepo.getAll()); }, []);
  return (
    <AppStateHandler
      appState={state}
      SuccessComponent={FeatureView}
      emptyCondition={(data) => data.length === 0}
    />
  );
}

// View.tsx — pure presentation via props
interface FeatureViewProps {
  data: DataType[];
  onSelect: (id: string) => void;
}
function FeatureView({ data, onSelect }: FeatureViewProps) {
  return <List>{data.map(item => <ListItem key={item.id} onClick={() => onSelect(item.id)}>{item.name}</ListItem>)}</List>;
}
```

### Responsive Component Patterns

| Pattern | When | Code |
|---------|------|------|
| Stack direction change | Sidebar layout | `flexDirection: { xs: 'column', md: 'row' }` |
| Grid column change | Card grids | `xs={12} sm={6} lg={4}` |
| Conditional rendering | Nav visibility | `useMediaQuery(theme.breakpoints.down('sm'))` |
| Container max-width | Page shells | `<Container maxWidth="xl" sx={{ maxWidth: '1280px' }}>` |
| Spacing scale | Cards, sections | `gap: { xs: 1, md: 2, xl: 3 }` |

### Translation: Mockup CSS Variable → MUI `sx`

| Mockup CSS | MUI `sx` Equivalent |
|------------|---------------------|
| `var(--mui-bg-default)` | `bgcolor: 'background.default'` |
| `var(--mui-bg-paper)` | `bgcolor: 'background.paper'` |
| `var(--mui-text-primary)` | `color: 'text.primary'` |
| `var(--mui-text-secondary)` | `color: 'text.secondary'` |
| `var(--mui-divider)` | `borderColor: 'divider'` |
| `var(--mui-primary-main)` | `color: 'primary.main'` |
| `var(--mui-spacing-2)` | `p: 2`, `gap: 2` (MUI spacing units) |
| `var(--mui-radius-md)` | `borderRadius: 2` (MUI shape units) |

### AppStateHandler Integration

Use for every async data view:

```tsx
// Handles LOADING → SUCCESS → ERROR → EMPTY automatically
<AppStateHandler
  appState={state}
  SuccessComponent={DataView}
  emptyCondition={(data) => data.length === 0}
  errorMessage="Failed to load"
/>
```

States covered:
- `LOADING` → renders `<LoadingState />` component
- `isError` → renders `<ErrorState />` with retry
- `isSuccess + emptyCondition` → renders `<EmptyState />`
- `isSuccess + data` → renders `SuccessComponent`


### Astra Components Quick Reference

| Astra Component | Import Path | When to Use |
|----------------|-------------|-------------|
| `StatusDot` | `@/common/components/atoms/StatusDot` | Status indicators |
| `SeverityBadge` | `@/common/components/atoms/SeverityBadge` | Severity labels |
| `LoadingState` | `@/common/components/atoms/LoadingState` | Loading screens |
| `ErrorState` | `@/common/components/atoms/ErrorState` | Error with retry |
| `EmptyState` | `@/common/components/atoms/EmptyState` | Empty containers |
| `Card` | `@/common/components/molecules/Card` | Content containers |
| `Notification` | `@/common/components/molecules/Notification` | Alerts and messages |
| `TrendMetricCard` | `@/common/components/molecules/TrendMetricCard` | KPI metrics |
| `DataTable` | `@/common/components/organisms/DataTable` | Tabular data |
| `FileViewerRouter` | `@/common/components/organisms/FileViewerRouter` | File previews |
| `DrawerComponent` | `@/common/components/organisms/DrawerComponent` | Side panels |
| `AppStateHandler` | `@/common/components/organisms/AppStateHandler` | State routing |
| `PageHeader` | `@/common/components/templates/PageHeader` | Page headings |
| `SummaryPanel` | `@/common/components/templates/SummaryPanel` | Summary sections |
| `HeroSection` | `@/common/components/templates/HeroSection` | Hero/landing |

---

## 18. Huashu Design Enhancements

Astra incorporates principles from Huashu Design to ensure mockups and implementations are **intentional, non-generic, and crafted**.

### Variant / Tweaks System

When designing a new component or page, generate **2-3 visual variants** exploring different dimensions:

| Variant Dimension | Example |
|-------------------|---------|
| Layout density | Spacious vs compact card grid |
| Interaction model | Inline edit vs modal edit vs slide panel |
| Visual hierarchy | Card-dominant vs list-dominant vs table-dominant |
| Color emphasis | Neutral-dominant vs accent-highlight |

```tsx
// Tweak pattern for variant exploration
interface ComponentTweaks {
  density: 'comfortable' | 'compact';
  variant: 'card' | 'list' | 'table';
  accent: 'primary' | 'brand' | 'minimal';
}
```

Present variants to the user, let them select or mix, then refine.

### Anti-AI-Slop Checklist

Before releasing any mockup or implementation:

- [ ] No decorative empty states — every element has purpose
- [ ] No MUI default theme overrides passing as finished design
- [ ] No placeholder data (`lorem ipsum`, `Lorem Ipsum`) masquerading as real content
- [ ] Visual hierarchy driven by content, not decoration
- [ ] No stock/generic icons used without functional purpose
- [ ] No unused variants or props left in the component
- [ ] Color palette uses only tokens from the design system — no invented colors
- [ ] Typography uses only scale variants — no inline `font-size`
- [ ] Empty/loading/error states handled, not just success state

### Junior Designer Workflow

1. **Present assumptions** — Before writing code, document what you assume: layout direction, data shape, interaction model
2. **Show placeholder** — Early mockup with gray blocks and labels, no polish
3. **Get feedback** — User confirms direction before refinement
4. **Fill + polish** — Replace placeholders with real content and components
5. **Show again** — Mid-implementation review
6. **Final polish** — Only after direction is locked

```text
Assumptions → Placeholder → Feedback → Fill → Review → Polish
     ↑____________early_____________________↓
```

### Mockup Purity (Stateless Blueprints)

HTML mockups must remain stateless blueprints:

- No `<script>` tags with business logic
- Interactivity: CSS `:hover`, `:active`, `:focus` states only
- Dynamic data: documented data shape with examples, not embedded fake data
- Component boundaries: clear `data-section` attributes for visual auditing

---

## Related Documentation

| Document | Purpose |
|---|---|
| `docs/raw/design-system/brand/` | Brand identity and vision (BAVANS) |
| `docs/raw/design-system/references/` | Design references and inspiration |
| `docs/raw/design-system/rules/Core Design Rules.md` | The 10 core design rules |
| `docs/raw/design-system/rules/Premium UI Patterns.md` | Component pattern library |
| `docs/raw/design-system/rules/mui-alignment.md` | HTML → React MUI translation |
| `docs/raw/design-system/rules/mui-tokens.md` | MUI token to CSS variable mapping |
| `docs/raw/design-system/rules/atomic-rules.md` | Structural hierarchy and grid rules |
| `docs/raw/design-system/rules/theme.md` | Theme logic and visual contract |
| `docs/raw/design-system/rules/Design Quality Checklist.md` | Pre-release quality gate |
| `docs/raw/design-system/rules/accessibility.md` | A11y standards |
| `docs/raw/design-system/rules/localization.md` | i18n guidelines |
| `docs/raw/design-system/mockups/viewport.md` | Responsive viewport strategy |
| `docs/raw/design-system/mockups/page.md` | Page layout patterns |
| `docs/raw/design-system/mockups/scaffold.md` | App scaffold and sidebar layout |
| `docs/raw/design-system/mockups/components.md` | Component pattern library reference |
| `docs/raw/design-system/mockups/navigation.md` | Navigation and appbar patterns |
| `docs/raw/design-system/mockups/theme-and-localization.md` | Theme provider and i18n integration |
| `docs/raw/design-system/mockups/workflow.md` | Mockup → implementation pipeline |
| `docs/raw/design-system/logo/company_logo.svg` | Astra logo |

---

*Last updated: May 2026 · Astra Design System*
