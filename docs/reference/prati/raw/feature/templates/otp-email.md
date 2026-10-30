# otp-email

A minimal OTP code delivery email body.

## Overview

Renders a heading, personalized greeting, and bolded OTP code. Intended as a partial injected into `base-layout` or rendered standalone. Produces the inner HTML body only — no outer shell.

## Template Variables

| Variable | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| `title`  | string | Yes      | `<h1>` heading text              |
| `name`   | string | Yes      | Recipient name in greeting line  |
| `code`   | string | Yes      | OTP code rendered in `<strong>`  |

## Responsibilities

- Render an `<h1>` title heading
- Render a personalized greeting with recipient name
- Render the OTP code in bold emphasis

## Non-Responsibilities

- Does not render an outer HTML document — body partial only
- Does not apply expiry time or code length constraints
- Does not render any call-to-action or additional instructions

## Business Rules

1. The `code` variable MUST be rendered inside a `<strong>` element, never as plain text
2. The greeting line MUST follow the pattern "Hello {{name}}," with a comma and space after the recipient name
3. The template MUST NOT render any `<html>`, `<head>`, or `<body>` tags — this is a body partial only
4. All three variables (`title`, `name`, `code`) MUST be provided; the template has no valid state when any are missing
5. The OTP code MUST NOT be truncated, formatted, or transformed — rendered as-is for exact user verification

## States

- **Default** — all three variables provided; full email body renders

## Edge Cases

- Empty `name`: greeting renders "Hello ," with a trailing comma and no name
- Empty `code`: `<strong>` renders empty; no visible OTP

## Error Conditions

### Recovery Actions

| Error Condition | Recovery Action |
|---|---|
| Any variable missing | Log a warning with the missing variable name; render placeholder text for missing variables |

- Any variable missing — Handlebars renders the variable reference as empty string; no crash

## Verification

- Render the Default state and confirm `<h1>`, greeting with name, and `<strong>` code are present
- Render with empty `name` and confirm greeting shows "Hello ," (trailing comma, no name)
- Render with empty `code` and confirm `<strong>` element is empty
- Confirm output contains no `<html>`, `<head>`, or `<body>` tags (partial-only constraint)

## See Also

- [Template System README](./README.md) — renderer service and registry overview
- [base-layout](./base-layout.md) — outer container to wrap this partial

## Future Enhancements

- Add `expiresIn` variable for code expiry messaging
- Add a "Do not share this code" security notice
- Add a resend link or support contact link
