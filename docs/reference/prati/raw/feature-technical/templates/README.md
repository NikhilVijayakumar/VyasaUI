# Template System — Technical Implementation

## Overview

This document describes the implementation of the Template System feature. For the feature specification (WHAT the system does), see `docs/raw/feature/templates/README.md`.

## Architecture

```
src/templates/        ← .hbs source files + bundledTemplates registry
src/services/         ← templateRenderer service
src/types/            ← template.types.ts interfaces
```

## Template Registry

`bundledTemplates` (`src/templates/index.ts`) is a `Record<string, string>` that maps template names to raw Handlebars source strings. Templates are imported at build time via `?raw` Vite imports.

| Template Name   | File               | Purpose                            |
| --------------- | ------------------ | ---------------------------------- |
| `base-layout`   | `base-layout.hbs`  | Email container with header/footer |
| `otp-email`     | `otp-email.hbs`    | OTP code delivery email            |
| `alert`         | `alert.hbs`        | Alert notification with type styling |
| `task-summary`  | `task-summary.hbs` | Task list summary with status      |

## TemplateRenderer Service

`createTemplateRenderer(cfg?)` returns a `TemplateRendererService`:

```ts
const renderer = createTemplateRenderer({ templates: bundledTemplates });
const result = await renderer.render({ templateName: 'otp-email', data: { name: 'Alice', code: '1234', title: 'OTP' } });
// result.success: true, result.html: rendered string
```

**Resolution order:**
1. Check `templates` map (bundled) — used in browser and Node
2. Fall back to `basePath` filesystem read (Node only) — for custom template directories

## Custom Helpers

Templates use a custom `ifEquals` block helper for conditional styling:

```hbs
{{#ifEquals type 'warning'}}...{{else ifEquals type 'error'}}...{{/ifEquals}}
```

This helper is registered automatically in `templateRenderer.ts` at module load time.

## See Also

- [Feature Spec](../feature/templates/README.md) — WHAT the template system does
- [base-layout Spec](../feature/templates/base-layout.md) — email container template
- [otp-email Spec](../feature/templates/otp-email.md) — OTP delivery template
- [alert Spec](../feature/templates/alert.md) — alert notification template
- [task-summary Spec](../feature/templates/task-summary.md) — task list summary template

## Future Enhancements

- Register `ifEquals` and other custom helpers centrally in the renderer factory
- Cache compiled `HandlebarsTemplateDelegate` instances to avoid recompilation per render call
- Template data schema validation (e.g., Zod) before compile to surface data errors early
- Support for Handlebars partials registration in the renderer config

## Open Questions

- Should `configure()` (currently a no-op) accept helper registrations?
- Should the renderer support async Handlebars helpers for dynamic content?
