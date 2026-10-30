# Overview

base-layout provides the outer HTML shell for email content. It renders a centered container `div` with inline styles suitable for email clients, an optional `{{header}}` heading block, a `{{> @partial-block}}` slot for body content injection, and an optional `{{footer}}` section with muted styling. It is designed as the wrapping partial for other email templates.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | TEMPLATES-003 |
| Feature Name | base-layout |
| Category | Template |
| Priority | P1 |
| Dependencies | Handlebars partial blocks (`{{> @partial-block}}`); caller injects body content |
| Future | Remove duplicate minimal HTML shell from source; accept `logoUrl` for branded logo; accept `primaryColor` for themed border/header |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Produce complete email document | Wrap body content in a valid HTML document with viewport meta, charset, and inline styles |
| Optionally include header and footer | Provide `header` and/or `footer` strings to render above and below body content |
| Compose with child templates | Use as layout wrapper for `otp-email` or other body templates via the partial block slot |

# User Journeys

### Entry Conditions
Caller needs to render a complete HTML email document with header, body, and optional footer.

### Primary Flow: Full Email Layout
1. Caller provides `title` (required), `header` (optional), `footer` (optional)
2. Caller injects body content via `{{> @partial-block}}`
3. base-layout renders: `<head>` with title and meta tags, empty `<body>`, centered container, header block (if provided), body partial block, footer block (if provided)

### Alternate Flows
- **Minimal layout**: Only `title` and body partial provided — no header, no footer; body renders at top of container
- **No footer**: Header present, footer omitted — header renders above body, no footer section appears
- **No header**: Footer present, header omitted — body renders at top, footer below

### Failure Flows
- **Missing `{{> @partial-block}}` content**: Caller does not provide body content — container renders empty
- **`title` not provided**: `<title>` renders empty string; email client may show "Untitled"

### Recovery Flows
- **Missing partial block recovery**: Caller wraps content inside the template's partial block
- **Missing title recovery**: Caller provides a `title` string in render data

### Exit Conditions
Caller receives a complete HTML email document with the outer shell, optional header and footer, and injected body content.

| Journey | Description |
| ------- | ----------- |
| Full layout | Title, header, body partial, and footer all present in rendered HTML |
| Minimal layout | Title and body partial only; header and footer omitted |
| No footer | Header present; footer absent from output |

# Screen Inventory

N/A — base-layout is an email container template. It is not a user-visible screen.

# Interaction Design

N/A — base-layout is a static HTML email template. It has no interactive affordances.

# Form Design

N/A — base-layout is a static HTML template with no form fields.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Full | Title in `<head>`, header heading above body, body partial rendered, footer with muted text below container |
| Minimal | Title in `<head>`, body partial rendered at top of container; no header or footer |
| No footer | Title in `<head>`, header heading above body, body partial rendered; footer section entirely absent |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Successful render | Complete HTML document returned with head, body, container, and content |
| Missing title | `<title>` tag renders empty string |
| Missing body content | Container renders empty |

# Navigation Design

N/A — base-layout is a static HTML email container. It does not contain navigation elements.

# Responsive Design

N/A — base-layout is an email HTML template. Responsive rendering is determined by the email client.

# Accessibility Design

N/A — base-layout is a server-side email HTML template. Email client accessibility is outside the scope of this template.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Template text | All user-facing strings (`title`, `header`, `footer`) supplied by caller via render data; no hardcoded strings |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Zero Hardcoding Policy | Template contains no hardcoded text; all strings from render variables |
| Rule 1: Radical Simplicity | Single concern — produce valid HTML email document shell |
| Rule 8: Consistency Builds Trust | All email templates use same base-layout structure; predictable document shape |

# Open Questions

- Should `logoUrl` variable be added for a branded logo above the header?
- Should `primaryColor` variable be added to theme the container border or header color?
- Should accept a `logoUrl` variable for a branded logo above the header?
