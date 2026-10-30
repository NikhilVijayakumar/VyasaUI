# Overview

The Template System is a Handlebars-based HTML generation service for producing email and notification content. Templates (`.hbs` files) are bundled at build time via Vite `?raw` imports. A `templateRenderer` service compiles and renders them with caller-supplied data. The system supports two modes: bundled (browser and Node) and filesystem (Node-only fallback).

This feature is distinct from the UI component templates (PageHeader, SummaryPanel, HeroSection) in the atomic design tier. Those are framework components; these are server-side HTML generation templates.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | TEMPLATES-001 |
| Feature Name | Template System |
| Category | Concept |
| Priority | P1 |
| Dependencies | Handlebars library, Vite `?raw` import for build-time bundling |
| Future | Centralized helper registration, compiled template caching, data schema validation (Zod), Handlebars partials registration |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Render an email template | Call the renderer with a template name and data; receive rendered HTML string |
| Access templates in browser and Node | Use bundled mode for browser; filesystem mode for Node custom directories |
| Verify rendering success | Check the `RenderResult.success` field and read `result.html` |

# User Journeys

### Entry Conditions
Caller (backend service or email sender) needs to generate an HTML string from a Handlebars template.

### Primary Flow: Render a Template
1. Caller imports `createTemplateRenderer` and configures it with `bundledTemplates` or a `basePath`
2. Caller calls `renderer.render({ templateName: 'otp-email', data: { name, code, title } })`
3. The renderer looks up the template in the bundled map (priority 1) or falls back to filesystem read (priority 2, Node only)
4. Handlebars compiles the template source and renders it with the provided data
5. The renderer returns `{ success: true, html: '<rendered string>' }`

### Alternate Flows
- **Filesystem mode**: Caller provides `basePath` instead of bundled templates; renderer reads `.hbs` files from disk at render time (Node only)
- **Custom template directory**: Caller extends templates by pointing `basePath` to a directory with custom `.hbs` files

### Failure Flows
- **Template not found**: Template name absent from bundled map and no `basePath` configured — returns `{ success: false, error: "Template not found..." }`
- **Handlebars compile error**: Template source contains syntax errors — returns `{ success: false, error: <compile error message> }`
- **File read failure**: Filesystem mode but file cannot be read — returns `{ success: false, error: <read error message> }`

### Recovery Flows
- **Template not found recovery**: Caller adds the template to the bundled map or provides a valid `basePath`
- **Compile error recovery**: Caller fixes the Handlebars syntax in the template source
- **File read failure recovery**: Caller verifies file path, permissions, and that the file exists

### Exit Conditions
Caller receives a `RenderResult` with `success: true` and `html` containing the rendered string, or `success: false` with an error message.

| Journey | Description |
| ------- | ----------- |
| Render bundled template | Caller provides template name and data; renderer looks up bundled source, compiles, renders, returns HTML |
| Render filesystem template | Caller provides basePath; renderer reads .hbs file from disk, compiles, renders, returns HTML |
| Handle render error | Caller receives `{ success: false, error }` and handles appropriately |

# Screen Inventory

N/A — The Template System generates HTML strings for email/notification transport. It does not define user-facing screens.

# Interaction Design

N/A — The Template System is a server-side service with no interactive affordances. It is called programmatically.

# Form Design

N/A — The Template System does not define form fields. Callers supply data matching template variable schemas.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Bundled mode | Renderer uses `bundledTemplates` map; works in browser and Node; caller gets rendered HTML |
| Filesystem mode | Renderer reads from `basePath` directory; Node-only; caller provides template name, renderer reads file from disk |
| Error | Template not found or compile/render failure; renderer returns `{ success: false, error }`; no HTML output |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Successful render | Return `{ success: true, html: '<rendered string>' }` |
| Template not found | Return `{ success: false, error: "Template not found..." }` |
| Compile error | Return `{ success: false, error: <Handlebars compile message> }` |
| File read failure | Return `{ success: false, error: <filesystem error message> }` |

# Navigation Design

N/A — The Template System is a rendering service. It does not define navigation.

# Responsive Design

N/A — The Template System generates HTML strings. Responsive behavior is the responsibility of the email client rendering the output.

# Accessibility Design

N/A — The Template System is a server-side rendering service. Accessibility of rendered HTML is the responsibility of individual template authors following email client constraints.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Template content | All user-facing text in templates must be supplied via render data; no hardcoded strings in `.hbs` source files per localization rules |
| Template variables | Strings like recipient name, OTP code, alert title are passed as data by the caller — localization is the caller's responsibility |

The renderer itself has no user-visible text and requires no localization.

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Rule 8: Consistency Builds Trust | All templates registered in `bundledTemplates` map; consistent renderer interface across all callers |
| Localization — Zero Hardcoding Policy | Template source files avoid hardcoded strings; all text supplied via render data |
| Atomic Rules — "Intent" Rule | No `<a>` tags with hardcoded URLs; navigation intents used for any links |

# Open Questions

- Should `configure()` (currently a no-op) accept helper registrations?
- Should the renderer support async Handlebars helpers for dynamic content?
- Should compiled `HandlebarsTemplateDelegate` instances be cached to avoid recompilation per render call?
