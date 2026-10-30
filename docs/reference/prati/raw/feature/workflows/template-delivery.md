# Workflow: Template Delivery

**Feature Area:** Cross-Feature — Template System, Templates, Component Library, Theming System

## Overview

The Template Delivery workflow describes how the Template System renders server-side HTML templates (email and notification content) and delivers the output to callers. It spans template registration, variable injection, rendering, error handling, and output delivery with theme-compatible inline styles.

## Responsibilities

- Define the template rendering pipeline: Registry → Compile → Inject → Output
- Specify the contract between the Template System and individual template definitions
- Govern how templates consume localization strings and theme tokens for inline styling
- Ensure every render returns a structured result with success/error status

## Non-Responsibilities

- Does not define email transport, delivery, or sending behavior
- Does not manage template caching or compilation lifecycle
- Does not replace UI component rendering (atomic design pipeline)
- Does not define template syntax or custom helper implementations

## Business Rules

1. **Result always structured** — Every render call returns a Result object with a status flag and either HTML output or error detail; raw string returns are not permitted
2. **Caller owns data shape** — The template system does not validate input data schemas; callers are responsible for providing the correct variable shapes
3. **Concurrent isolation** — Each render call is fully independent; no shared state, no race conditions
4. **Inline styles only** — Templates must use inline CSS; external stylesheets and style tags are not supported
5. **Fallback on missing variable** — Missing variables render as empty strings; they never cause render failures

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Template Registry** | Named collection of pre-registered templates available for rendering |
| **Compilation** | Parsing a template string into an executable render function |
| **Variable Injection** | Merging caller-supplied data with template placeholders |
| **Structured Result** | A response containing success/failure status and either HTML output or error information |

## States

- **Idle** — Template system initialized; awaiting render request
- **Looking Up** — Template name being resolved in the registry
- **Compiling** — Template source being parsed into a render function
- **Rendering** — Variables being injected into compiled template
- **Outputting** — HTML string returned to caller
- **Error** — Template not found or render failure

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Looking Up | Render called with a template name and data |
| Looking Up | Compiling | Template found in registry; compilation starts |
| Looking Up | Error | Template name not found in registry |
| Compiling | Rendering | Template compiled successfully |
| Compiling | Error | Template syntax error during compilation |
| Rendering | Outputting | Variables injected and HTML generated |
| Rendering | Error | Variable injection fails (unexpected input type) |
| Outputting | Idle | HTML result returned to caller; ready for next request |

## Edge Cases

- **Template not found**: Renderer returns error result — caller receives failure status
- **Empty data object**: Renderer produces template output with no variable substitution (placeholder text rendered as-is)
- **Missing variable**: Renders as empty string within the output HTML
- **Concurrent renders**: Each render is isolated; no shared state between calls
- **Template with no variables**: Static HTML returned with no injection required
- **Deeply nested data**: Template references nested object paths that may be undefined — missing paths render as empty strings
- **Custom directory unavailable**: Custom template directory is configured but inaccessible — system falls back to bundled templates only

## Error Conditions

- **Template not found** — Named template does not exist in registry or custom directory
- **Compilation failure** — Template source contains syntax errors; cannot produce render function
- **Render failure** — Variable injection encounters type mismatch or unexpected input
- **File read failure** — Custom template directory path is invalid or inaccessible
- **Helper not registered** — A custom Handlebars helper used by the template is not registered on the engine

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Template not found | Verify the template name matches a registered entry; check custom directory path if configured |
| Compilation failure | Review template source for syntax errors (unclosed tags, invalid helpers, malformed conditionals) |
| Render failure | Verify caller-supplied data matches the template's expected variable types |
| File read failure | Check that the custom directory path exists and the process has read permissions |
| Helper not registered | Register the missing helper on the Handlebars instance before calling render |

## Authorization

**Visibility:** Internal — the template system is a developer-facing service; all registered templates are available for any internal caller.

## User Journey

### Entry Conditions
A developer needs to generate an HTML email or notification from a pre-defined template and passes data to the renderer.

### Primary Flow
The developer calls `render('template-name', data)` and receives a structured result with either rendered HTML or an error.

### Alternate Flows
The developer registers a custom template directory and renders application-specific templates alongside the bundled set.

### Failure Flows
The template name does not match any registered template — the renderer returns an error result with a not-found status.

### Recovery Flows
The developer verifies the template name spelling, checks that the template is registered, and retries.

### Exit Conditions
The developer receives the rendered HTML (or error) and handles it — passing HTML to an email transport or displaying the error.

## Workflow

### Trigger
A caller (email service, notification service) invokes render with a template name and data object.

### Preconditions
The template system is initialized. At least one template is registered (bundled or custom).

### Steps
1. Look up the template name in the registry
2. If found, compile the template source
3. Inject caller-supplied data variables
4. Return structured result with status and HTML output

### Outcomes
Rendered HTML string is available in a structured result for the caller to use.

### Exceptions
Template not found, compilation fails, or variable injection error — structured result is returned with error detail.

### Completion Criteria
The caller receives a valid structured result (success with HTML or failure with error detail).

## Verification

- **Template existence test**: Call render with a known template name; verify result status is success
- **Template not found test**: Call render with an unknown name; verify result status is failure with not-found error
- **Variable injection test**: Render a template with known variables; verify the output contains the injected values
- **Concurrent render test**: Fire 10 simultaneous renders with different data; verify no cross-contamination
- **Custom directory test**: Configure a custom template directory; verify templates from both bundled and custom sources resolve

## See Also

- [Template System](../templates/README.md) — renderer service and template registry
- [alert](../templates/alert.md) — alert notification template
- [otp-email](../templates/otp-email.md) — OTP delivery template
- [task-summary](../templates/task-summary.md) — task list summary template
- [base-layout](../templates/base-layout.md) — email container template
- [Application Rendering Workflow](./application-rendering.md) — companion workflow for UI rendering
