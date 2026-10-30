# Base Layout Template: Feature Technical

## 1. Overview

The Base Layout template provides the outermost HTML document shell for email rendering. It establishes the full-page structure including viewport and charset metadata, inline styles required for email client compatibility, and a `@partial-block` slot that consuming templates populate with body content. Optional header and footer regions can be included at the caller's discretion.

## 2. Feature Summary

| Capability | Description |
|---|---|
| HTML Document Shell | Emits a complete HTML document with `<html>`, `<head>`, and `<body>` elements |
| Email Client Support | Includes viewport and charset meta tags plus inline styles for cross-client rendering |
| Content Slot | Exposes a `@partial-block` slot for body content injection by child templates |
| Optional Header | An optional `header` variable renders a top region above the body content |
| Optional Footer | An optional `footer` variable renders a bottom region below the body content |
| Required Title | A required `title` variable sets the document title |

## 3. Responsibilities

- Provide a complete HTML document wrapper suitable for email delivery
- Include viewport and charset metadata for email client rendering
- Provide inline CSS styles appropriate for email client compatibility
- Expose a `@partial-block` Handlebars partial block slot for body content
- Conditionally render a header region when the `header` variable is supplied
- Conditionally render a footer region when the `footer` variable is supplied
- Set the document title from the required `title` variable

## 4. Non-Responsibilities

- Does not provide any body content itself (delegates to the `@partial-block` slot)
- Does not apply theme tokens (uses hardcoded email-safe color values)
- Does not manage localization or translation of header, footer, or title content
- Does not enforce minimum content length or structural validation
- Does not support nested layout hierarchies beyond the single `@partial-block` slot

## 5. Architecture Mapping

| Architecture Discipline | Applicability |
|---|---|
| Atomic Hierarchy | Not applicable — this is a server-side Handlebars template, not a UI component in the Atomic tier system |
| Stateless UI | Not applicable — the template is a server-side text transformation with no component lifecycle |
| Theme Sovereignty | Not applicable — the template uses hardcoded color values appropriate for email client rendering; theme tokens are not referenced |
| Localization Invariant | Not applicable — the template renders pre-localized strings provided by the caller |

## 6. Responsibility Realization

| Responsibility | Technical Realization |
|---|---|
| HTML document wrapper | Template emits `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>` tags |
| Metadata and styles | `<meta charset="UTF-8">`, `<meta name="viewport">` and inline `<style>` block are emitted in `<head>` |
| Content slot | `@partial-block` Handlebars directive allows child templates to inject body content |
| Optional header | Handlebars `{{#if header}}` block conditionally renders the header region markup |
| Optional footer | Handlebars `{{#if footer}}` block conditionally renders the footer region markup |
| Required title | The `title` variable is rendered inside `<title>` tags; no conditional guard |

## 7. Workflow Realization

| Step | Description |
|---|---|
| 1. Caller provides data | Caller supplies `title` (required), `header` (optional), `footer` (optional), and body content via `@partial-block` |
| 2. Template compilation | Handlebars compiles the base layout with the `@partial-block` directive |
| 3. Partial block resolution | Child content is injected into the `@partial-block` slot |
| 4. Conditional rendering | Header and footer are included only when their respective variables are truthy |
| 5. Output | Complete HTML document string is returned inside a `RenderResult` |

## 8. State Realization

| Functional State | Technical Realization |
|---|---|
| Full | `title`, `header`, `footer`, and body content are all present and rendered |
| Minimal | Only `title` and body content are rendered; header and footer are omitted |
| No Footer | `title`, `header`, and body content are rendered; footer is omitted |

## 9. Permission Realization

The Base Layout template is a server-side rendering utility with no permission model. Access control is handled by the calling feature.

## 10. Validation Realization

The template does not validate the presence of `title` at runtime. If `title` is omitted, an empty `<title></title>` element is emitted. The `@partial-block` slot does not validate that body content was provided.

## 11. Error Realization

| Condition | Behavior |
|---|---|
| `title` is missing or undefined | `<title>` element renders with no content |
| `@partial-block` is not provided by caller | Body content area renders as empty markup; document structure is preserved |
| Header or footer content contains unsafe characters | Handlebars escapes HTML by default; raw content requires triple-stash (`{{{ }}}`) usage |

## 12. Integration Realization

| Integration Point | Description |
|---|---|
| Template Renderer | The base layout is registered by name in the Template System registry and invoked by child templates that use `{{#> base-layout}}` |
| Child Templates | Templates such as OTP email and task summary use this layout via partial block syntax to provide body content |
| Email Delivery Pipeline | The rendered HTML document is passed to the email sending infrastructure |

## 13. Ownership Mapping

| Artifact | Owner |
|---|---|
| Base layout template source (`.hbs`) | Feature team responsible for email presentation |
| Layout data contract | Feature team responsible for email presentation |
| Email-specific inline styles | Feature team responsible for email presentation |

## 14. Architecture Traceability

| Architecture Decision | Compliance |
|---|---|
| Exists outside Atomic Hierarchy | Server-side Handlebars template; not a UI component |
| Hardcoded styling over theme tokens | Email-safe colors are hardcoded intentionally; inline styles are required for email client compatibility |
| No localization responsibility | All user-facing strings are pre-localized by the caller |

## 15. Feature Traceability

| Artifact | Feature |
|---|---|
| HTML document shell | Template System |
| Header region | Template System / Base Layout |
| Footer region | Template System / Base Layout |
| Content slot via `@partial-block` | Template System / Base Layout |

## 16. Open Questions

- Should a default header or footer be rendered when only one is provided, or is the current conditional approach correct?
- Are there email clients that require specific inline style patterns beyond viewport and charset metadata?
- Should the layout support multiple named content slots (e.g., separate slots for pre-header, body, postscript)?
