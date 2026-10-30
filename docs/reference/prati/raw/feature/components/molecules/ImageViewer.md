# ImageViewer

Displays image content with interactive zoom and rotation controls.

## Overview

Renders base64-encoded image data with a toolbar for zoom (0.5x to 3x) and rotation (0 to 270 degrees in 90-degree increments). Shows a placeholder message when no image content is provided. Useful for previewing image files within a file viewer context.

## Responsibilities

- Render base64-encoded images with zoom and rotation controls
- Provide zoom range from 0.5x to 3x with increment/decrement buttons
- Provide 90-degree incremental rotation cycling through 0–270 degrees
- Show a placeholder message when no image content is provided

## Non-Responsibilities

- Does not load file content from disk or network
- Does not support video, PDF, or non-image file types
- Does not provide full-screen mode or download capability
- Does not persist zoom or rotation state across re-renders
- Does not handle image load errors or invalid image data

## Core Concepts

- **Internal view state:** Zoom and rotation are managed locally — these are UI-only view states that do not need to persist or be shared with parent components.
- **Toolbar control pattern:** Zoom in/out and rotate buttons form a compact toolbar above the image; controls are always visible, giving the user continuous feedback on current values.
- **Pre-loaded content rendering:** The component renders image content that has already been loaded and encoded by the caller — it does not perform any file loading or format conversion itself.
- **Clamped zoom range:** Zoom is bounded between its minimum and maximum values; rotation cycles through fixed degree increments with no upper bound.

## Business Rules

1. The component MUST render base64-encoded image data only — file loading from disk or network is the caller's responsibility.
2. Zoom MUST be clamped between 0.5x (minimum) and 3x (maximum).
3. Rotation MUST cycle through 0, 90, 180, and 270 degrees in 90-degree increments.
4. When no image content is provided, the component MUST render a placeholder message — never a broken image.
5. Zoom and rotation MUST be managed as internal UI-only state — they MUST NOT persist or be shared with the parent.

## Consumed By

- [FileViewerRouter](../organisms/FileViewerRouter.md) — delegates image file rendering to this component based on file extension

## States

- **Loaded** — Content provided with valid encoding; image renders with toolbar
- **Empty** — No content; placeholder message displayed
- **Error** — Corrupted image data; browser shows broken image icon
- **Zooming** — Zoom level changes via toolbar buttons
- **Rotating** — Rotation cycles via toolbar buttons

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Empty | Loaded | Valid image content provided |
| Loaded | Zooming | User presses zoom in or zoom out |
| Zooming | Loaded | Zoom level update completes |
| Loaded | Rotating | User presses rotate |
| Rotating | Loaded | Rotation update completes |
| Loaded | Error | Image data fails to render (browser broken image) |
| Empty | Error | Invalid encoding provided |

## Edge Cases

- No content provided: Renders placeholder instead of the image
- Content provided but encoding is not base64: Falls to empty state
- No MIME type provided with base64 content: Defaults to PNG
- Image fails to load (broken data): Browser shows broken image icon — no custom error handling
- Zoom range: Clamped between 0.5x and 3x
- Rotation cycles: 0, 90, 180, 270 degrees (modulo 360)
- Very large images: Constrained by container dimensions with aspect ratio preserved

## Error Conditions

- Missing required value (file name) — Required value must be provided
- Invalid encoding — Falls to empty state
- Image load failure — Browser broken image icon; no custom error handler

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing required value (file name) | Provide a file name prop; the component cannot render the heading without it |
| Invalid encoding | Provide valid base64-encoded image data; the component falls to empty state as a safe fallback |
| Image load failure | Provide a valid image source; the browser shows a broken image icon as a native fallback — the component does not intercept this |

## Authorization

**Visibility:** Authenticated — used to view image files within authenticated file viewer contexts.

## User Journey

### Entry Conditions
A user opens an image file in a file viewer — this component renders the image with zoom and rotation controls.

### Primary Flow
The user sees the image displayed with a toolbar — they can zoom in/out (0.5x–3x) or rotate in 90-degree increments.

### Alternate Flows
No image content is provided — the component shows a placeholder message instead.

### Failure Flows
The image data is corrupted — the browser shows a broken image icon with no custom error handling.

### Recovery Flows
The user closes the viewer or the parent component provides valid image data.

### Exit Conditions
The user finishes viewing the image and navigates away or switches to a different file.

## Workflow

### Trigger
A user opens an image file or a developer provides base64-encoded image content.

### Preconditions
Content is provided with a valid encoding and MIME type.

### Steps
The component constructs the image source, renders the image with toolbar controls, and responds to zoom/rotation interactions.

### Outcomes
The user can view and inspect the image with interactive controls.

### Exceptions
Corrupted image data — the browser shows a broken image icon.

### Completion Criteria
The image is displayed and toolbar controls are responsive.

## Verification

- Unit tests confirm zoom is clamped at 0.5x minimum and 3x maximum
- Unit tests confirm rotation cycles through 0°, 90°, 180°, 270°
- Integration tests confirm the placeholder renders when no content is provided
- Visual regression tests confirm the toolbar controls are correctly positioned and functional
- Integration tests confirm zoom and rotation state resets when the component remounts

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [FileViewerRouter](../organisms/FileViewerRouter.md) — routes image files to this component
