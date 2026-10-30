# base-layout

A full-page email HTML container with optional header and footer slots.

## Overview

Provides the outer HTML shell for email content. Renders a centered `.container` div with inline styles suitable for email clients, an optional `{{header}}` heading block, a `{{> @partial-block }}` slot for body content, and an optional `{{footer}}` section with muted text styling. Designed as the wrapping partial for other email templates.

## Template Variables

| Variable  | Type     | Required | Description                          |
| --------- | -------- | -------- | ------------------------------------ |
| `title`   | string   | Yes      | `<title>` in `<head>`                |
| `header`  | string   | No       | Heading text rendered above body     |
| `footer`  | string   | No       | Footer text rendered below container |

## Responsibilities

- Render a valid HTML email document with viewport and charset meta tags
- Apply inline styles for email-client compatibility (max-width, font-family, box-shadow)
- Conditionally render a header heading above body content
- Conditionally render a footer section below the container
- Provide a `{{> @partial-block }}` slot for body content injection

## Non-Responsibilities

- Does not render body content — callers inject content via partial block
- Does not apply theming tokens — uses hardcoded email-safe colors
- Does not validate email-client compatibility beyond inline styles

## Business Rules

1. The template MUST render a valid HTML5 document with `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>` tags for email-client compatibility
2. Container width MUST NOT exceed 600px to ensure consistent rendering across email clients
3. The `{{> @partial-block }}` MUST be rendered between header and footer, never outside the `.container` div
4. All inline styles MUST use email-safe properties only (no JavaScript, no external CSS, no unsupported CSS properties)
5. Header and footer sections MUST be omitted entirely when their respective variables are absent — never render empty heading or footer elements

## States

- **Full** — title, header, body partial, and footer all present
- **Minimal** — title and body partial only; header and footer omitted
- **No footer** — header present but footer omitted

## Edge Cases

- No `header` provided: header block is omitted; body partial renders at top of container
- No `footer` provided: footer div is omitted entirely
- Empty `title`: `<title>` renders empty; email client may show "Untitled"

## Error Conditions

### Recovery Actions

| Error Condition | Recovery Action |
|---|---|
| Missing `{{> @partial-block }}` content | Log a warning; render container with a "No content provided" placeholder message |
| `title` not provided | Fall back to default title "Email"; log a warning |

- Missing `{{> @partial-block }}` content — container renders empty
- `title` not provided — `<title>` renders empty string

## Verification

- Render all three state variants (Full, Minimal, No footer) and verify no empty heading or footer elements appear
- Render with empty `title` and confirm `<title>` tag is present but empty
- Verify rendered HTML passes basic email-client inline-style checks (no external CSS references, no JavaScript)
- Inject a known partial block and confirm content appears between header and footer in the `.container` div

## See Also

- [Template System README](./README.md) — renderer service and registry overview
- [otp-email](./otp-email.md) — template designed to be injected into this layout

## Future Enhancements

- Remove the duplicate minimal HTML shell from the source file
- Accept a `logoUrl` variable for a branded logo above the header
- Accept a `primaryColor` variable to theme the container border or header color
