# Overview

Navigation enables prototype users to move between screens, workflows, and application areas. It simulates realistic application behavior and user journeys without production routing frameworks, allowing stakeholders to experience application workflows as they would in a real application. [Feature spec: lines 4–8]

---

# Feature Summary

| Attribute | Value |
|---|---|
| Feature ID | PROTO-004 |
| Feature Name | Navigation |
| Category | Molecule |
| Priority | P0 |
| Description | Navigation provides movement between screens, workflows, and application areas within a prototype. Users can traverse screen hierarchies, execute multi-step workflows, and validate journey flows. |
| Dependencies | Components, Templates, Localization, Theming, Persistence |
| Future | N/A — The feature spec does not define any future roadmap or planned enhancements for Navigation. |

---

# User Goals

Goals are drawn from the feature spec Purpose section: [Feature spec: lines 19–24]

| Goal | Description |
|---|---|
| Move Between Screens | Navigate from one screen to another within the prototype. |
| Execute Workflows | Progress through multi-step business workflows end to end. |
| Explore Features | Discover and access all areas of the prototype application. |
| Validate User Journeys | Confirm that journey flows match expected application behavior. |
| Review Application Structure | Understand the relationship and hierarchy between screens and sections. |

---

# User Journeys

Each journey maps to a supported navigation scenario from the feature spec. [Feature spec: lines 89–147]

### Screen Navigation Journey

A user moves from a list screen to a detail screen, then to a related form, and finally to a confirmation summary.

Steps:
1. Begin on a dashboard or list view.
2. Select an item to view its details.
3. Choose to edit or create a related record.
4. Submit to reach a confirmation summary screen.

### Workflow Navigation Journey

A user completes a multi-step approval flow.

Steps:
1. Start at a workflow initiation screen.
2. Advance through sequential workflow steps (e.g., fill form, review, approve).
3. Reach a terminal confirmation screen.

### Master Detail Navigation Journey

A user browses a collection and drills into individual records.

Steps:
1. View a collection (project list, user list, task list).
2. Select a record to see its full details.
3. Return to the collection and select a different record.

### Dashboard Navigation Journey

A user explores related screens from a central dashboard.

Steps:
1. View the dashboard with summary metrics.
2. Navigate to a reports screen, an analytics view, or a configuration panel.
3. Return to the dashboard.

### Deep Navigation Journey

A user enters the prototype directly at a specific screen.

Steps:
1. Access the prototype via a direct link or saved reference.
2. Arrive at a targeted screen (e.g., a specific user detail, a workflow step).
3. Continue navigation from that entry point.

---

# Screen Inventory

N/A — Navigation is a capability that enables movement between screens; it does not present its own visual screens within the prototype. Screens that contain navigation elements are defined under Components, Templates, and application-level layout compositions.

---

# Interaction Design

Navigation interactions follow the principles of Predictable Behavior and User Journey First. [Feature spec: lines 52–65]

| Interaction | Behavior |
|---|---|
| Select navigation target | User selects an interactive element (menu item, button, breadcrumb, tab, drawer link, card action). The prototype transitions to the target screen or workflow step. |
| Return to previous location | User activates a back control, breadcrumb, or gesture. The prototype returns to the previously viewed screen while preserving relevant state. |
| Advance workflow step | User completes the current step and activates a next or continue action. The prototype moves to the subsequent step in the workflow sequence. |
| Open detail from collection | User selects a record within a list or table. The prototype presents the detail view for that record. |
| Navigate via deep link | User accesses a direct entry point. The prototype loads the specified screen without requiring prior navigation steps. |

Navigation elements must remain visually consistent — the same action type (e.g., a back control, a menu item) must produce the same result across all prototype areas. [Core Design Rules: Rule 8 — Consistency Builds Trust]

---

# Form Design

N/A — Navigation does not capture or manage form input. Forms are defined by the Components feature and may trigger navigation upon completion, but the navigation capability itself does not include form fields, validation, or submission logic.

---

# UX State Design

Navigation is a capability, not a visual component with discrete UI states. The spec does not define loading, empty, error, or edge-case states for navigation itself. Navigation state encompasses: [Feature spec: lines 36–37]

| Navigation State Aspect | Description |
|---|---|
| Current location | The active screen or workflow step the user is viewing. |
| Navigation history | The sequence of screens visited, enabling return and back behavior. |
| Workflow progress | The user's position within a multi-step workflow. |
| Deep link context | The entry point used to reach the current screen. |

These aspects are managed internally by the prototype runtime and surfaced through visual cues in consuming components (e.g., highlighted menu item, breadcrumb trail, progress stepper).

---

# Feedback Design

N/A — The feature spec does not define dedicated feedback mechanisms for the navigation capability. Visual feedback for navigation events (screen transitions, tab switches, breadcrumb updates) is handled by the consuming components and templates that initiate or reflect navigation state.

---

# Navigation Design

Users enter the navigation system by selecting any interactive element that triggers a screen or workflow change: [Feature spec: lines 155–160]

| Entry Action | Description |
|---|---|
| Select menu item | User picks a destination from a sidebar, top bar, or dropdown menu. |
| Activate breadcrumb | User clicks a segment of the breadcrumb trail to jump to an ancestor screen. |
| Click action button | User presses a button labeled for navigation (e.g., View Details, Continue, Back). |
| Switch tab | User selects a different tab within a tabbed interface. |
| Open drawer link | User chooses a link from a side drawer or panel. |
| Access deep link | User enters the prototype at a specific screen via a direct reference. |
| Resume persisted workflow | User returns to a previously saved point in a multi-step flow. |

Users exit the navigation system when:

| Exit Action | Description |
|---|---|
| Reach terminal screen | The user arrives at a final step in a workflow (confirmation, summary, completion). |
| Close prototype session | The user closes the browser tab or application window. |
| Reset to home | The user returns to the prototype home or dashboard screen. |
| Navigate to top-level area | The user moves to an application area that serves as a root section (e.g., landing page, top-level menu destination). |

---

# Responsive Design

Navigation layout adapts to the Viewport Strategy defined in the Design System. [Design System Viewport Strategy: lines 1117–1194]

| Viewport | Navigation Behavior |
|---|---|
| 4K (3840×2160) | Sidebar visible, full multi-column layout. Critical navigation targets within central 2560px safe zone. |
| 2K/1440p (2560×1440) | Sidebar visible, generous whitespace around navigation elements. |
| 1080p (1920×1080) | Sidebar visible, default information density. |
| Tablet (768×1024) | Sidebar collapsed, navigation accessible via hamburger or toggle. Touch targets at least 44×44px. Two-column layout where screen width permits. |
| Mobile (375×812) | Sidebar hidden. Bottom navigation bar for primary destinations. Single-column flow. Vertical stacking. Touch targets at least 44×44px. Minimum 16px horizontal margin from screen edge. |

Breakpoint mapping: [Design System: lines 1147–1153]
- `xs` (0px): Mobile — bottom navigation, collapsed sidebar.
- `sm` (600px): Tablet — toggleable sidebar, touch targets 44px+.
- `md` (900px): Desktop — sidebar visible, multi-column.
- `lg` (1200px): Wide desktop — 3+ column grids.
- `xl` (1920px): 2K/4K — max container 1280px, generous whitespace.

---

# Accessibility Design

Navigation elements must support all users in understanding location, accessing destinations, and returning to previous screens. [Feature spec: lines 155–160]

| Requirement | Implementation |
|---|---|
| Current location identification | The active screen or section is visually distinguished (e.g., highlighted menu item, active tab indicator, breadcrumb emphasis). |
| Screen reader announcements | Navigation actions (screen change, workflow step advance) are announced to assistive technology. |
| Keyboard navigation | All navigation targets are reachable and activatable via keyboard alone (Tab, Enter, Space, Escape). |
| Visible focus indicators | Every interactive navigation element shows a focus ring or highlight. |
| Back and history traversal | A dedicated mechanism (button, gesture, breadcrumb) exists to return to prior screens. |
| Navigation label consistency | All labels match visible text; icon-only controls include accessible names. |

---

# Localization Design

All user-facing navigation content participates in the Prati Localization System. [Feature spec: lines 234–244]

| Localized Element | Examples |
|---|---|
| Navigation labels | Sidebar section names, menu item text, tab labels. |
| Breadcrumb labels | Each segment of the breadcrumb trail. |
| Workflow step labels | Progress stepper titles, step descriptions. |
| Action labels | Button text such as Continue, Back, Next, Save and Proceed. |
| Dashboard section labels | Navigation targets within dashboard views. |

Localization behavior follows the patterns defined by the Localization feature. Navigation must not hardcode any user-facing string.

---

# Design System Traceability

| Design System Rule / Pattern | Application to Navigation |
|---|---|
| Core Design Rule 1 — Radical Simplicity | Navigation elements display only essential destinations; no decorative or redundant links. [Core Design Rules: lines 7–28] |
| Core Design Rule 3 — Typography Leads | Navigation labels rely on typographic hierarchy (not icons or color alone) to convey importance. [Core Design Rules: lines 57–81] |
| Core Design Rule 4 — Color as Guidance | Active navigation targets use accent color sparingly to indicate current location. [Core Design Rules: lines 83–104] |
| Core Design Rule 5 — White Space is a Feature | Navigation lists and menus include adequate spacing between items for scannability. [Core Design Rules: lines 107–128] |
| Core Design Rule 8 — Consistency Builds Trust | Identical navigation patterns (back, forward, breadcrumb) behave identically across all screens. [Core Design Rules: lines 177–190] |
| Premium UI Pattern 6 — Contextual Side Panels | Side panels preserve user context and reduce navigation friction; smooth sliding transitions, clear hierarchy. [Premium UI Patterns: lines 189–221] |
| Viewport Strategy | Navigation adapts per viewport matrix: sidebar on md+ (900px+), collapsed sidebar or bottom nav below. Touch targets 44×44px on tablet/mobile. [Design System: lines 1117–1194] |
| Atomic Hierarchy — Molecule | Navigation is a Molecule: groups of atoms (buttons, labels, icons) that form menus, breadcrumbs, tabs, and drawer links. [Design System: line 1073] |
| 8px Grid Rule | Spacing between navigation items uses multiples of 8px via CSS variables. [Design System: lines 1075–1081] |

---

# Open Questions

1. **Deep link structure**: The feature spec lists deep link support as a responsibility but does not define how deep links are structured, activated, or represented within the prototype. Should deep links be plain identifiers, hierarchical paths, or human-readable references?

2. **Navigation state and persistence boundary**: The spec states navigation should preserve relevant prototype state (form progress, selected records, filters, search criteria) but defers to the Persistence feature. How much navigation state (current location, history stack, workflow position) must navigation retain internally versus delegate to persistence?

3. **Navigation history depth**: The spec requires navigation history support but does not specify a maximum history depth or any eviction policy. Should history be unbounded, or is there a practical limit (e.g., last 50 screens)?

4. **Deep navigation entry behavior**: When a user enters via deep navigation, the spec is unclear on whether the prototype should provide a path back to a home/dashboard screen or treat the deep screen as a new root. What is the expected back behavior from a deep-linked entry?
