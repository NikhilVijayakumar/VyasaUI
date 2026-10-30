# Overview

DrawerComponent is a responsive side navigation drawer that renders as a temporary overlay with backdrop on mobile and a permanent sidebar without overlay on desktop. Menu items are filtered by matching feature names against a provided feature list for feature-flag-driven navigation. The parent owns open/close state — the drawer is a controlled component. On mobile, drawer content stays mounted in the DOM when closed to preserve scroll position.

# Feature Summary

- **Purpose**: A responsive side navigation drawer that adapts between mobile overlay and desktop sidebar
- **Responsibilities**: Render responsive side nav (temporary on small screens, permanent on larger); Filter menu items by matching feature names against provided feature list; Call click handler with item index on click; Keep mobile drawer content mounted when closed
- **Non-Responsibilities**: Does not manage navigation/routing; No auth/access control; Does not manage open/close state (receives state + toggle from parent); No deep linking/highlighting; Does not fetch features (receives as input)

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Navigate the application on mobile | User opens a temporary overlay drawer via the menu toggle to access navigation items |
| Navigate the application on desktop | User sees a persistent sidebar with navigation items alongside main content |
| See only available features | Menu items without matching feature flags are silently hidden — user sees only accessible navigation |

# User Journeys

### Entry Conditions
User opens the application on a mobile or desktop viewport.

### Primary Flow
1. Drawer receives menu items, feature list, open/closed state, and toggle handler from parent
2. On mobile: drawer content is mounted; when open, slides in as overlay with backdrop
3. On desktop: drawer renders as permanent sidebar next to main content
4. Menu items are filtered: only items with names matching the feature list are rendered
5. User clicks a menu item — handler fires with the item's index
6. Parent processes the click (navigation or action)

### Alternate Flows
- **Filtered items**: Some features excluded — only matching items render; excluded items are silently skipped with no visible gap
- **Empty menu**: All features filtered out or feature list is empty — drawer renders an empty list

### Failure Flows
- All items filtered out — drawer opens with no navigation options visible to the user
- Feature list is empty — guard clause returns empty list, no children rendered

### Recovery Flows
Developer updates the feature list to include valid navigation items — drawer re-filters and renders matching items

### Exit Conditions
User selects a menu item (navigation) or taps the overlay/backdrop to close the drawer on mobile

| Journey | Description |
| ------- | ----------- |
| Open nav on mobile | User taps menu icon → overlay drawer slides in → user taps item → handler fires |
| View nav on desktop | Drawer is permanently visible as a sidebar; no toggle needed |
| All features filtered out | Drawer opens with empty list — user sees no navigation options |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| Drawer overlay (mobile) | Temporary side panel with backdrop overlay for navigation on small screens |
| Drawer sidebar (desktop) | Permanent side panel without backdrop for navigation on large screens |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| Menu item click | Calls click handler with item index; drawer does not navigate — parent decides action |
| Overlay backdrop click (mobile) | Closes drawer — parent's toggle handler fired with closed state |
| Menu toggle (from ToolbarComponent) | Parent changes open state — drawer responds as controlled component |
| Feature filter change | Drawer re-renders with updated item list; no animation on filter changes |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| Menu items | Yes | Array of items with name + label; filtered against feature list; missing feature name → silently excluded |
| Feature list | Yes | Map of feature names used to filter menu items; empty list → empty drawer |
| Open state | Yes | Boolean controlling drawer visibility (controlled component) |
| Toggle handler | Yes | Callback for open/close state changes |
| Click handler | Yes | Callback with item index on menu item selection |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Open (mobile) | Temporary overlay drawer slides in from side; backdrop visible; filtered menu items displayed |
| Closed (mobile) | Drawer hidden; content stays mounted in DOM preserving scroll position |
| Open (desktop) | Permanent sidebar, no backdrop; always visible alongside main content |
| Empty | All features filtered out or empty feature list → no menu items rendered |
| Filtered | Some items excluded by feature flags; only matching items visible; no gaps for excluded items |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Menu item click | Handler fires with index — visual feedback managed by parent or item content |
| Overlay click (mobile) | Drawer closes via parent toggle — backdrop fades out, drawer slides out |
| Feature filter applied | Items appear/disappear silently without animation |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| Menu item selection | Drawer fires click handler with item index — parent is responsible for routing/navigation |
| Backdrop click (mobile) | Fires toggle handler to close drawer — no navigation occurs |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop (≥ breakpoint) | Permanent sidebar, no overlay; width 240px expanded, 64px collapsed |
| Tablet | Same as mobile if below breakpoint, same as desktop if above — breakpoint determines behavior |
| Mobile (< breakpoint) | Temporary overlay drawer with backdrop; content keep-mounted when closed; width 240px |

bg: var(--mui-bg-default); Active item: rgba(primary, 0.08) + left accent border 3px primary; Hover: rgba(primary, 0.04).

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Drawer role (mobile) | `role="dialog"` with `aria-modal="true"` when open on mobile — identifies overlay as a modal dialog |
| Drawer role (desktop) | `role="navigation"` with `aria-label="Main navigation"` — identifies as persistent nav landmark |
| Focus trap (mobile) | When drawer opens, focus moves to first menu item; Tab/Shift+Tab cycles within drawer; closing returns focus to toggle button |
| Menu items | Each item rendered as `<button>` or `<a>` with accessible name; focus-visible outlines provided |
| Backdrop | `aria-hidden="true"` on backdrop to prevent screen reader interaction with overlay |
| Closed state (mobile) | Content remains in DOM but hidden with `aria-hidden="true"` and `visibility: hidden` — prevents screen reader access while preserving scroll position |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Menu item labels | Provided by parent via menu items prop — no hardcoded labels in drawer |
| Feature names | Compared against feature list; not displayed to user — used only for filtering |
| Drawer aria-label | Uses localized application name or nav label (e.g., `navigation.label`) |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Controlled component — no internal state management; filtering is silent exclusion with no visible artifacts |
| 8px grid rule | Drawer width 240px; collapsed width 64px; both on 8px grid |
| Color System | Background via `var(--mui-bg-default)`; active state uses `rgba(--primary, 0.08)`; hover uses `rgba(--primary, 0.04)` — all CSS variables, no hardcoded |
| Accessibility | Focus trap, aria-modal, semantic navigation landmark, aria-hidden for backdrop and closed content |
| White Space is Feature | Left accent border 3px primary on active item; spacing between items uses 8px multiples |
| Quality Checklist | All states defined — Open/Closed mobile, Open desktop, Empty, Filtered |
| Premium UI Patterns | Card surface for desktop sidebar; overlay pattern for mobile drawer |

# Open Questions

- Should the collapsed desktop state (64px) show icons-only or require explicit user toggle?
- What is the exact breakpoint value where the drawer switches from overlay to permanent sidebar?
- Should filtered-out items be announced to screen readers (e.g., "X items hidden by feature flags") or kept silent?
