# Overview
The PageHeader establishes the context for a given screen by displaying a prominent title, subtitle, and primary/secondary actions. It acts as the standard anchoring element across the application, ensuring a consistent user experience when navigating between different sections.

# Feature Summary
- **Purpose**: Orient the user to the current page and provide immediate access to primary page-level actions.
- **Responsibilities**: Render the title, subtitle, leading/trailing metadata, and responsive action buttons.
- **Non-Responsibilities**: Handling the actual logic of actions, providing secondary navigation (tabs/breadcrumbs), or sticky positioning.

# User Goals
| User Goal | Description |
| --------- | ----------- |
| Identify Context | Quickly understand what page or resource they are currently viewing. |
| Take Action | Easily access the most important actions available on the page. |

# User Journeys

### Entry Conditions
- User navigates to a new page or view within the application.

### Primary Flow
1. User looks at the top of the page.
2. User reads the title and subtitle to confirm they are in the right place.
3. User clicks an action button (Save, Create, Edit) to initiate the corresponding operation.

### Alternate Flows
- **Minimal State**: The page has no actions or subtitle -> User only sees the title.
- **Responsive Wrap**: User views on a narrow screen -> Actions are neatly wrapped below the title for easy tapping.

### Failure Flows
- N/A (Component is structural).

### Recovery Flows
- N/A

### Exit Conditions
- User scrolls down to view content or clicks an action to navigate away/trigger a modal.

| Journey | Description |
| ------- | ----------- |
| Contextualize Page | User reads the header to understand the current view. |
| Execute Page Action | User clicks the primary button (e.g., "Create", "Save"). |

# Screen Inventory
| Screen | Purpose |
| ------ | ------- |
| PageHeader Component | The top-level anchor component rendered on most application views. |

# Interaction Design
| Interaction | Behavior |
| ----------- | -------- |
| Click Action | User clicks primary or secondary buttons to trigger page-level commands. |

# Form Design
| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | Buttons trigger external flows or forms, but the header itself has none. |

# UX State Design
| State | User Experience |
| ----- | --------------- |
| Full | User sees the title, subtitle, metadata, and buttons arranged in a balanced layout. |
| Minimal | User sees only the title, with all optional elements cleanly omitted. |

# Feedback Design
| Event | Feedback |
| ----- | -------- |
| Button Hover/Focus | Standard Design System hover/focus states for buttons. |

# Navigation Design
| Navigation Path | Behavior |
| --------------- | -------- |
| Click Action Button | May trigger navigation (handled by parent component). |

# Responsive Design
| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Title and buttons appear on the same horizontal row. |
| Tablet/Mobile | Action buttons wrap to the next line below the title to prevent truncation and ensure touch-friendly targets. |

# Accessibility Design
| Accessibility Area | Behavior |
| ------------------ | -------- |
| Heading Hierarchy | Title uses the `<h1>` semantic tag to anchor the page. |
| Focus Management | Action buttons are fully keyboard navigable. |

# Localization Design
| Localization Area | Behavior |
| ----------------- | -------- |
| RTL Support | Action button ordering respects right-to-left layout constraints. |
| Text Expansion | Subtitles and titles wrap gracefully to accommodate longer localized strings. |

# Design System Traceability
| Design System Rule | Applied To |
| ------------------ | ---------- |
| Layout Rules | Consistent spacing and structural wrapping for page-level headers. |

# Open Questions
- Should we provide built-in support for a "Loading" state on the primary action button?
- Is there a need to support breadcrumbs integrated directly into this header?
