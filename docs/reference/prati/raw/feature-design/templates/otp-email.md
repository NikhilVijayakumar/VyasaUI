# Overview

otp-email is a minimal OTP code delivery email body template. It renders an `<h1>` title heading, a personalized greeting with the recipient name, and the OTP code in bold `<strong>`. It is intended as a partial injected into `base-layout` or rendered standalone. The output is inner HTML only — no outer document shell.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | TEMPLATES-004 |
| Feature Name | otp-email |
| Category | Atom |
| Priority | P1 |
| Dependencies | Handlebars renderer; `title`, `name`, and `code` variables provided by caller |
| Future | `expiresIn` variable for code expiry messaging, "Do not share this code" security notice, resend or support contact link |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Deliver OTP code to recipient | Render a clear email body with the OTP code prominently displayed in bold |
| Personalize greeting | Address the recipient by name in the greeting line |
| Set email context | Display a title heading that describes the email purpose |

# User Journeys

### Entry Conditions
Caller needs to send a one-time password to a user via email.

### Primary Flow: Render OTP Email Body
1. Caller provides `title` (e.g., "Your verification code"), `name` (e.g., "Alice"), and `code` (e.g., "1234")
2. Template renders: `<h1>Your verification code</h1>`, greeting "Hello Alice,", OTP code in `<strong>1234</strong>`

### Alternate Flows
- **Standalone rendering**: Template rendered without `base-layout` wrapper — produces body fragment only
- **Wrapped rendering**: Template injected into `base-layout` via partial block — produces complete email document

### Failure Flows
- **Missing variable**: Any required variable (`title`, `name`, `code`) not provided — Handlebars renders the variable reference as empty string; no crash, but missing content
- **Empty `name`**: Greeting renders "Hello ," with trailing comma and no name
- **Empty `code`**: `<strong>` renders empty; no visible OTP

### Recovery Flows
- **Missing variable recovery**: Caller provides all required variables in render data
- **Empty name recovery**: Caller provides a non-empty `name` string or handles greeting formatting externally

### Exit Conditions
Caller receives rendered HTML body fragment containing title heading, personalized greeting, and bold OTP code.

| Journey | Description |
| ------- | ----------- |
| Full render | All three variables provided; complete email body renders |
| Missing variable | Variable absent; reference renders as empty string; content missing from output |

# Screen Inventory

N/A — otp-email is an email body partial fragment.

# Interaction Design

N/A — otp-email is a static HTML email template. It has no interactive affordances.

# Form Design

N/A — otp-email is a static HTML template with no form fields.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Default | All three variables provided; full email body renders with heading, greeting, and bold OTP code |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Successful render | HTML fragment with h1 heading, personalized greeting, bold OTP code |
| Missing variable | Empty string in place of the missing variable's rendered value |

# Navigation Design

N/A — otp-email is a static email body. It does not contain navigation elements or links.

# Responsive Design

N/A — otp-email is an email body partial. Responsive rendering is determined by the email client and parent layout.

# Accessibility Design

N/A — otp-email is a server-side email template. Email client accessibility is outside the scope.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Template text | All user-facing strings (`title`, `name`, `code`) supplied by caller via render data; no hardcoded strings |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Zero Hardcoding Policy | Template contains no hardcoded text; all content via render variables |
| Rule 1: Radical Simplicity | Single purpose — deliver OTP code to recipient with greeting; no additional content |
| Rule 8: Consistency Builds Trust | All OTP emails follow same structure regardless of sender |

# Open Questions

- Should `expiresIn` variable be added for code expiry messaging?
- Should a "Do not share this code" security notice be included?
- Should a resend link or support contact link be added?
