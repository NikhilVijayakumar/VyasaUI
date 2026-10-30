# Overview

Templates define page-level layout. They arrange organisms and molecules into structured regions without embedding content, business logic, or application state. A template receives organisms as children or slot props and positions them using CSS Grid or Flexbox. Templates answer "where does this section go on the page?" — never "what data does it show?"

# Feature Summary

| Field | Value |
|---|---|
| Feature ID | COMP-006 |
| Feature Name | Templates Tier |
| Category | Component Classification |
| Priority | P0 |
| Dependencies | Organisms, Molecules, Design tokens (spacing) |
| Gate | Zero content, zero business logic, zero state |

# User Goals

- View a consistent page structure (header, sidebar, content area, footer)
- Navigate between sections placed by the template

# User Journeys

### Entry Conditions

- Developer has organisms ready (DataTable, FormPanel, FileTree) and needs to arrange them into a page
- Page layout is distinct from other pages (different column count, region order)

### Primary Flow: Create a template

1. Developer creates a file in `components/templates/`
2. Defines slot props or children for each region (header, sidebar, main, footer)
3. Applies CSS Grid or Flexbox to position regions
4. Sets spacing between regions using `var(--space-*)` tokens
5. Does NOT fetch data, manage state, or render content strings
6. Exports template — parent page injects organisms into slots

### Alternate Flows

- **Single-region template**: page with one column and no sidebar. Template wraps children in a centered container with max-width.
- **Nested templates**: template can use another template as a region (e.g., TwoColumnTemplate used inside DashboardTemplate).

### Failure Flows

- **Template with content**: hardcoded heading text, mock data, or placeholder strings → downgrade to organism. Templates must be content-free.
- **Template with business logic**: `if (user.role === 'admin')` → move condition to the page component. Template is structural only.
- **App state in template**: `useTheme()`, `useAuth()`, `useRouter()` → move to organism or page. Template gets theme via CSS cascade only.
- **One-page-only template**: if a layout is used on exactly one page, it is likely an organism specific to that page. Promote to template only when reused.

### Recovery Flows

- **Template acquires logic**: extract logic into the parent page component; template receives simpler props.
- **Template becomes page-specific**: merge into the page organism; delete the template file.

### Exit Conditions

- File placed in `components/templates/<name>.tsx`
- Zero data-fetching calls
- Zero state hooks
- Zero hardcoded content strings
- Receives organisms via slot props or children
- Layout defined via CSS Grid or Flexbox
- Exports one named component

### Journey Table

| Step | Action | System | Data |
|---|---|---|---|
| 1 | Create file in `templates/` | File system | `.tsx` file |
| 2 | Define slot props (header, sidebar, main, footer) | TypeScript | Props type (ReactNode) |
| 3 | Apply CSS Grid with named areas | CSS | Grid template |
| 4 | Set region gaps via `var(--space-*)` tokens | CSS | Gap values |
| 5 | Export template | Module system | Named export |

# Screen Inventory

| Template | Regions | Used By |
|---|---|---|
| TwoColumn | Sidebar + Main | Dashboard page |
| SingleColumn | Main (centered, max-width) | Settings page, Detail page |
| Shell | Header + Sidebar + Main + Footer | App root layout |
| SplitView | Left panel + Right panel | Compare page, Editor page |

# Interaction Design

Templates have zero interaction logic. All clicks, scrolls, resizes are handled by the organisms placed inside template slots.

# Form Design

Templates do not render or manage forms. FormPanel (organism) is placed in a template slot.

# UX State Design

| State | Description |
|---|---|
| Static layout | Regions positioned by CSS Grid. No state transitions. |

Templates have no application states. The only "state" is the window viewport, which is handled via CSS media queries.

# Feedback Design

No feedback mechanisms. Loading spinners, error toasts, and empty states belong to organisms inside template slots.

# Navigation Design

Templates define where navigation regions appear (sidebar slot, header slot). Navigation components (NavBar, Breadcrumbs) are organisms placed into template slots. Templates do not call navigation APIs.

# Responsive Design

| Viewport | TwoColumn | Shell | SplitView |
|---|---|---|---|
| Desktop (≥1024px) | Sidebar 280px + Main auto | Full layout, 4 regions | Two panels side by side |
| Tablet (600–1023px) | Sidebar collapses to icon + overlay toggle | Header compact, sidebar hidden → hamburger | Panels stack vertically |
| Mobile (<600px) | Single column, sidebar as slide-out | Bottom nav replaces sidebar | Single panel, toggle to switch |

Breakpoints: desktop ≥1024px, tablet 600–1023px, mobile <600px. Template owns these breakpoints; organisms inside do not duplicate them.

# Accessibility Design

| Requirement | Template Implementation |
|---|---|
| Landmarks | `<header>` (banner), `<nav>` (navigation), `<main>` (main), `<aside>` (complementary), `<footer>` (contentinfo) |
| Skip link | Skip-to-content link before grid container, targeting `#main-content` |
| Focus order | Grid source order matches visual order for logical tab flow |
| Resize | Layout collapses to single column at 400% zoom (WCAG 1.4.10 Reflow) |
| Orientation | Layout supports both portrait and landscape via responsive breakpoints |

# Localization Design

Templates render no text. Region labels for screen readers (e.g., `aria-label="Main content"`) use English literals with locale key fallback. All visible text comes from organisms inside slots.

# Design System Traceability

| Rule | Compliance |
|---|---|
| Rule 1: Radical Simplicity | Pure layout. Zero content, zero logic, zero state. |
| Rule 3: Typography Leads | Typography is not a template concern — organisms own it. |
| Rule 5: White Space is Feature | Region gaps use `var(--space-section)` and `var(--space-page)`. Padding uses `var(--space-lg)`. |
| Color System | Template sets background via `var(--color-bg-L1)`; all other colors delegated to organisms. |
| Accessibility | Semantic landmark elements, skip link, reflow at 400% zoom, source-order focus. |
| Localization | No text rendered; landmark labels localizable via region props. |
| 8px grid | All gaps and padding use 8px-multiple tokens. |

# Open Questions

- Should templates expose a `maxWidth` prop to control content width, or should that be hardcoded per template variant?
- Should the skip-link be built into the Shell template or provided as a separate organism?
- Should we define a `TemplateProps` generic interface to standardise slot patterns across templates?
