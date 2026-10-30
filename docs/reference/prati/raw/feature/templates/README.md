# Template System

**Feature Area:** Server-Side HTML Template Rendering

## Overview

Prati provides a template rendering system for generating HTML strings — primarily for email and notification content. The system compiles templates and renders them with caller-supplied data.

This is distinct from the UI component templates (PageHeader, SummaryPanel, HeroSection) in the atomic design tier. Those are framework components. These are server-side HTML generation templates.

## Responsibilities

- Generate HTML output from named templates with caller-supplied data
- Support a set of pre-registered email and notification templates
- Return a structured result indicating success or failure
- Support optional custom template directories

## Non-Responsibilities

- Does not send emails — rendering only, transport is caller responsibility
- Does not validate template data schemas — callers provide correct shapes
- Does not cache compiled templates across calls
- Does not support template inheritance or nesting

## Core Concepts

| Concept | Description |
| ------- | ----------- |
| **Template** | A named HTML document with placeholders for dynamic content |
| **Render** | The process of producing an HTML string from a template and data |
| **Result** | Structured response with success status and rendered HTML or error |

## Business Rules

1. **Structured result always** — Every render call returns a structured result object with a success/failure status; raw HTML string returns or thrown exceptions are not acceptable
2. **Caller owns data shape** — The template system does not validate caller-supplied data; schema correctness is the caller's responsibility
3. **Concurrent isolation** — Each render call is fully independent with no shared state; concurrent renders must not produce race conditions
4. **No inheritance** — Templates do not support inheritance or nesting; each template is a standalone renderable unit
5. **Inline styles only** — All styling must use inline CSS; external stylesheets and style tags are not supported

## States

- **Ready** — Renderer initialized; templates available for rendering
- **Rendering** — Template compilation and data injection in progress
- **Complete** — Render finished; HTML output or error returned
- **Error** — Template not found or render failure

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Ready | Rendering | Render called with template name and data |
| Rendering | Complete | Template compiled and rendered successfully |
| Rendering | Error | Template not found or compile/render failure |
| Error | Ready | System recovered; ready for next render call |

## Edge Cases

- **Template not found**: Renderer returns error result; caller must handle
- **Missing required variable**: Some variables may render as empty strings
- **Empty data**: Renderer produces template output with no variable substitution
- **Concurrent renders**: Each render call is independent; no shared state

## Error Conditions

- **Template not found** — Named template does not exist in registry or directory
- **Render failure** — Template compilation or rendering encounters an error
- **File read failure** — Custom template directory is inaccessible

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| Template not found | Verify the template name matches a registered template; check custom directory path if configured |
| Render failure | Check template source syntax and caller-supplied data types; fix and retry render |
| File read failure | Verify the custom directory path exists and the process has read permissions |

## Authorization

**Visibility:** Internal — the template system is a developer-facing service.

## User Journey

### Entry Conditions
A developer needs to generate an HTML email or notification from a template.

### Primary Flow
The developer selects a template name, provides the required data, and receives the rendered HTML string.

### Alternate Flows
The developer configures a custom template directory for application-specific templates.

### Failure Flows
The template name does not match any registered template — the renderer returns an error.

### Recovery Flows
The developer verifies the template name and data shape, then retries.

### Exit Conditions
The developer receives the rendered HTML and passes it to an email or notification transport.

## Workflow

### Trigger
A caller requests rendering of a named template with provided data.

### Preconditions
The template system is initialized with at least the bundled templates.

### Steps
The system locates the template, compiles it with the provided data, and returns the rendered HTML.

### Outcomes
Rendered HTML string is available for the caller to use.

### Exceptions
The template is not found or compilation fails — an error result is returned.
### Completion Criteria

The rendered HTML is returned or an error is reported.

## Verification

- **Template existence test**: Call render with a known registered template name; verify result status is success
- **Template not found test**: Call render with an unregistered name; verify result status is failure with not-found error
- **Concurrent render test**: Fire 10 simultaneous renders to different templates; verify no cross-contamination in outputs
- **Custom directory test**: Configure a custom template directory; verify templates from both bundled and custom sources resolve

## See Also

- [base-layout](./base-layout.md) — email container template
- [otp-email](./otp-email.md) — OTP delivery template
- [alert](./alert.md) — alert notification template
- [task-summary](./task-summary.md) — task list summary template
- [UI Component Templates](../components/atomic-design/templates.md) — atomic design layout tier (separate concept)
- [Technical Implementation](../feature-technical/templates/README.md) — HOW the template system works
- [Template Delivery Workflow](../workflows/template-delivery.md) — cross-feature workflow for template rendering
