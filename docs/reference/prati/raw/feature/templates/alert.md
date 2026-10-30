# alert

An inline-styled alert notification with type-based color theming.

## Overview

Renders a conditionally visible alert box with inline CSS styles. Applies type-specific background, border, and text colors for `warning`, `error`, `success`, and the default `info` variant. Uses a custom conditional helper for style branches. The alert block only renders when `show` is truthy.

## Template Variables

| Variable  | Type    | Required | Description                                      |
| --------- | ------- | -------- | ------------------------------------------------ |
| `type`    | string  | Yes      | Alert variant: `warning`, `error`, `success`, or default (`info`) |
| `title`   | string  | No       | Bold heading text inside the alert               |
| `message` | string  | Yes      | Body text of the alert                           |
| `show`    | boolean | Yes      | Guards rendering — alert only renders when truthy |

## Type Styles

| `type` value | Background | Border       | Text     |
| ------------ | ---------- | ------------ | -------- |
| `warning`    | `#fff3cd`  | `#ffc107`    | `#856404` |
| `error`      | `#f8d7da`  | `#f5c6cb`    | `#721c24` |
| `success`    | `#d4edda`  | `#c3e6cb`    | `#155724` |
| *(default)*  | `#d1ecf1`  | `#bee5eb`    | `#0c5460` |

## Custom Helper Dependency

Requires a conditional equality helper (`ifEquals`) registered on the template engine. Without this helper, conditional style branches will not evaluate correctly.

## Responsibilities

- Conditionally render an alert box when `show` is truthy
- Apply type-specific inline styles via `ifEquals` helper
- Render optional title in bold and message text

## Non-Responsibilities

- Does not handle dismiss/close interactions — static HTML output only
- Does not animate in or out
- Does not manage `show` state — caller controls visibility

## States

- **Visible** — `show` truthy; alert box renders with type styles
- **Hidden** — `show` falsy; nothing renders

## Edge Cases

- `show` is falsy: entire alert block is omitted
- Unknown `type` value: falls through to default info styles
- No `title` provided: title line is omitted; message renders alone

## Error Conditions

- `ifEquals` helper not registered — conditional style branches fail silently; styles may not apply
- `message` not provided — alert renders with empty body text

## See Also

- [Template System README](./README.md) — renderer service and registry overview

## Future Enhancements

- Add `icon` variable for a leading status icon character
- Add `link` variable for an optional action link inside the alert
