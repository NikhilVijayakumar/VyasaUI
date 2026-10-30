# Overview
The EmptyState atom is the system's universal "no results" signal. Displayed any time an authenticated data operation returns zero results, it reassures the user that the system is working correctly — there is simply nothing to show. Its consistent presence across the application ensures users are never left with a blank, unexplained area.

# Feature Summary
- **Purpose**: Communicate to the user that a data operation completed successfully but returned no results, replacing the empty content area with a clear, readable message.
- **Responsibilities**: Display a centered, localized "No data found" message; fill the parent container width; use the localization system so the message is always in the user's active language.
- **Non-Responsibilities**: Does not accept custom messages, does not provide retry or action buttons, does not handle loading or error states — these are the concerns of sibling atoms (LoadingState, ErrorState).

# User Goals
| User Goal | Description |
| --------- | ----------- |
| Understand the empty result | User immediately sees that no data is available, rather than staring at a blank area and wondering if the page loaded correctly. |
| Continue with confidence | User knows the system worked; they can adjust filters, search queries, or navigate elsewhere. |

# User Journeys

### Entry Conditions
- An async data operation completes and the dataset returned has zero items.
- The parent component detects the empty result and renders EmptyState in place of the content area.

### Primary Flow
1. Data fetch completes with an empty result set.
2. Parent component renders EmptyState instead of the data view.
3. User sees a centered "No data found" message that fills the content area.
4. User understands there is no data and decides next action (change filters, navigate away).

### Alternate Flows
- **Missing localization key**: The localization key for "No data found" is absent — EmptyState renders an empty area with no visible text. The visual centering structure is still present.

### Failure Flows
- Parent component fails to check for the empty state and renders nothing or a broken layout — user sees a blank, confusing interface.

### Recovery Flows
- Developer wraps the data display with an empty-state check that conditionally renders this component when the dataset is empty.

### Exit Conditions
- User adjusts their query/filters and data loads successfully — parent replaces EmptyState with the content view.
- User navigates to a different area of the application.

| Journey | Description |
| ------- | ----------- |
| Empty Data Result | User sees "No data found" in place of a content area after a successful but empty fetch. |
| Missing Localization | User sees an empty area when the translation key is missing. |

# Screen Inventory
| Screen | Purpose |
| ------ | ------- |
| Empty Content Area | Replaces the data view inside any container (table, panel, list) that returns no results. Centered horizontally and vertically within its parent. |

# Interaction Design
| Interaction | Behavior |
| ----------- | -------- |
| None | EmptyState is purely presentational. No user interactions are handled — it has no buttons, links, or clickable regions. |

# Form Design
| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | EmptyState has no form fields. |

# UX State Design
| State | User Experience |
| ----- | --------------- |
| Empty | The one and only state. Displays a centered "No data found" message. The parent controls when this component renders. |

# Feedback Design
| Event | Feedback |
| ----- | -------- |
| Empty result displayed | The centered text itself is the feedback — it directly communicates the absence of data to the user. |

# Navigation Design
| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | EmptyState does not drive navigation. Parent components provide any retry or navigation affordances. |

# Responsive Design
| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Centered within the container; text at standard body size. Adapts to the container width provided by the parent. |
| Tablet | Same centering behavior; container provides appropriate width. |
| Mobile | Same centering behavior; container provides appropriate width. Text wraps naturally if the container is narrow. |

# Accessibility Design
| Accessibility Area | Behavior |
| ------------------ | -------- |
| Screen Reader Announcement | The "No data found" message is rendered as text content and read by screen readers. No explicit live region is required as the parent manages state transitions. |
| Semantic Markup | Rendered as a text element (not an icon or color-only indicator) so it is readable by assistive technology. |
| Focus Management | EmptyState has no interactive elements; focus is not redirected to this component. |

# Localization Design
| Localization Area | Behavior |
| ----------------- | -------- |
| "No data found" message | Resolved through the localization system — updates automatically when the user switches language. |
| Text Expansion | The message must not be clipped when expanded in languages with longer translations. Container uses text wrapping. |
| Missing Key Fallback | If the translation key is absent, no text is rendered. This is a silent fallback — no error is thrown. |

# Design System Traceability
| Design System Rule | Applied To |
| ------------------ | ---------- |
| Rule 1 — Radical Simplicity | EmptyState renders a single text message with no decoration, icons, or extraneous elements. |
| Rule 3 — Typography Leads | Message uses standard body typography; hierarchy is conveyed through spacing and centering, not color. |
| Rule 5 — White Space is a Feature | Center alignment within the container ensures the empty area feels intentional, not broken. |
| Accessibility Standard — No color-only indicators | The message is conveyed through text, not color alone. |
| Localization Standard — Zero Hardcoding | The "No data found" string is sourced from the translation dictionary, not hardcoded. |

# Open Questions
- Should EmptyState accept a custom message in the future for context-specific empty state communication (e.g., "No results for your search")?
- Should the parent be responsible for providing a retry action button, or should EmptyState support an optional action slot?
