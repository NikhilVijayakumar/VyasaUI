# Overview

ToolbarComponent is a fixed-position top app bar that provides three elements: a mobile menu toggle icon (visible only on small screens via CSS), a page title (truncated with ellipsis when too long), and a theme toggle bound to the application's theme context. The drawer toggle callback fires on every click regardless of screen size — the parent controls whether to open the drawer.

# Feature Summary

- **Purpose**: A top app bar with navigation toggle and theme switching control
- **Responsibilities**: Render fixed-position app bar at top; Display mobile menu toggle icon (visible on small screens only); Render title with truncation for long strings; Render theme toggle bound to theme context
- **Non-Responsibilities**: Does not handle navigation/routing; No auth/user session; No content below app bar; Does not manage drawer open/close (receives toggle handler); No responsive layout beyond hiding menu icon on larger screens

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Know current page | User reads the page title at the top of the toolbar |
| Open navigation (mobile) | User taps the menu icon to open the side navigation drawer |
| Switch theme | User toggles between light and dark mode via the theme toggle |

# User Journeys

### Entry Conditions
Application renders a page with the toolbar at the top of the viewport.

### Primary Flow
1. Toolbar mounts with page title and drawer toggle callback
2. On mobile: menu icon is visible; user taps icon → toolbar fires toggle callback
3. On desktop: menu icon is hidden via CSS; only title and theme toggle visible
4. Theme toggle reads current theme from context and renders appropriate icon (sun/moon)
5. User taps theme toggle → context switches theme → icon updates

### Alternate Flows
- **Long title**: Title text truncates with CSS ellipsis at the container boundary
- **Missing theme context**: Component throws invariant error — must be wrapped in a theme provider

### Failure Flows
- Theme context missing → invariant error breaks component rendering; toolbar does not render
- Drawer toggle fires but parent has no handler → callback is no-op (parent responsibility)

### Recovery Flows
Developer wraps the toolbar in a theme provider — component renders with theme toggle functional

### Exit Conditions
User navigates to a different page (title updates via new prop) or switches theme via the toggle

| Journey | Description |
| ------- | ----------- |
| Open navigation on mobile | User taps menu icon → toolbar fires toggle → parent opens drawer |
| Switch theme | User taps theme toggle → theme context updates → all themed elements re-render |
| View page title on desktop | User sees title with menu icon hidden; only title and theme toggle visible |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| Toolbar | Fixed-position top bar with title, mobile menu toggle, and theme switch control |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Menu icon tap (mobile) | Fires drawer toggle callback with current open state — parent decides whether to open/close |
| Menu icon tap (desktop) | Icon hidden via CSS — no tap target available |
| Theme toggle tap | Reads theme context, switches theme, icon updates (sun for dark, moon for light) |
| Title | No interaction — presentational text element |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| Title | Yes | Renders in toolbar center/left; truncated with ellipsis via CSS `text-overflow: ellipsis` |
| Drawer toggle callback | Yes | Required prop — fires on menu icon click; no-op if parent provides empty handler |
| Theme context | Yes (implicit) | Must be available in component tree; missing → invariant error |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Idle | Title + menu toggle (mobile) + theme toggle all visible; toolbar fixed at top |
| Mobile | Menu icon button visible; theme toggle visible; title truncated if long |
| Desktop | Menu icon hidden via CSS `display: none`; title + theme toggle visible |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Menu icon tap | Callback fires — visual feedback from button press state (CSS `:active`); no toolbar-level toast/notification |
| Theme toggle tap | Theme context updates — icon swaps (sun→moon or moon→sun); no additional toast |
| Missing theme context | Invariant error thrown; component fails to render — no graceful degradation |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| Page title update | Parent passes new title prop — toolbar re-renders with new text |
| Drawer toggle | Toolbar fires callback — parent handles navigation state |
| Theme switch | Toolbar reads/writes theme context — no URL or route change |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Menu icon hidden via CSS media query; title and theme toggle visible; toolbar remains fixed |
| Tablet | Same as mobile if below breakpoint; same as desktop if above — breakpoint-conditional CSS for menu icon |
| Mobile | Menu icon visible; title truncates to available width; theme toggle visible; toolbar fixed at top |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Menu toggle button | Rendered as `<button>` with `aria-label` (e.g., "Open navigation menu"); `aria-expanded` reflects drawer state from parent |
| Theme toggle button | Rendered as `<button>` with `aria-label` (e.g., "Switch to dark mode" / "Switch to light mode") reflecting current mode |
| Title | Rendered as heading (e.g., `<h1>`) or span with appropriate role for the page context |
| Focus management | No programmatic focus shifts on toolbar actions — native tab order applies |
| Skip link | Should be provided by parent layout above the toolbar for skip-to-content navigation |
| Focus-visible | All interactive buttons show focus-visible ring; minimum 44×44px touch targets for mobile menu icon and theme toggle |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Menu toggle aria-label | Pulled from localization system (e.g., `toolbar.menuToggle`) — different label for open/closed state |
| Theme toggle aria-label | Pulled from localization system (e.g., `toolbar.theme.light`, `toolbar.theme.dark`) reflecting current mode |
| Title | Provided by parent as a prop — no hardcoded title strings |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Fixed toolbar with three elements — no dropdowns, no user info, no search; menu icon visibility controlled purely via CSS |
| Typography Leads | Page title establishes page-level hierarchy in the toolbar; truncation prevents layout breakage |
| White Space is Feature | Spacing between title, menu icon, and theme toggle uses 8px multiples; toolbar height on 8px grid |
| Color System | All colors via CSS variables — background, icon colors, text from `var(--mui-*)` tokens |
| Accessibility | 44×44px touch targets on both buttons; aria-labels for menu and theme toggle; focus-visible outlines |
| 8px grid rule | Toolbar height 64px (8 × 8px); icon spacing and padding in 8px multiples |
| Quality Checklist | Idle, Mobile, Desktop states defined; missing theme context → invariant error noted |

# Open Questions

- Should the toolbar include a back arrow on mobile for sub-pages, or is that handled by a separate navigation element?
- Is the toolbar height standardized at 64px across all viewports, or should mobile use a shorter height (56px)?
- Should the title be an `<h1>` for the page or a `<span>` styled as heading — depends on whether this is the primary heading for the page?
