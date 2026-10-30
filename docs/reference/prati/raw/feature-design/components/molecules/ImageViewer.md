# Overview

ImageViewer renders base64-encoded image data with interactive zoom (0.5x–3x) and rotation (0°/90°/180°/270°) controls. Displays a placeholder message when no image content is provided. Pre-loaded content rendering — does not load files from disk or network.

# Feature Summary

- **Purpose**: Display image content with interactive zoom and rotation controls
- **Responsibilities**: Render base64-encoded images with zoom/rotation controls; provide zoom range 0.5x–3x with increment/decrement buttons; provide 90° incremental rotation cycling 0–270°; show placeholder when no content
- **Non-Responsibilities**: No file loading from disk/network; no video/PDF support; no full-screen or download; no persistence of zoom/rotation state; no image load error handling
- **Authorization**: Authenticated
- **Consumed by**: FileViewerRouter (routes images based on file extension)

# User Goals

| Goal | Description |
| ---- | ----------- |
| Inspect image | View image content at readable size with zoom adjustment |
| Examine detail | Zoom in up to 3x to inspect fine details |
| Overview context | Zoom out to 0.5x to see full image in reduced view |
| Reorient image | Rotate image 90° at a time to correct orientation |
| Understand empty state | See placeholder when no image content is provided |

# User Journeys

### Entry Conditions
User opens an image file in FileViewerRouter; router delegates to ImageViewer with base64-encoded content.

### Primary Flow
1. ImageViewer receives valid base64-encoded content with MIME type
2. Image renders at 1x (default zoom), 0° (default rotation) with toolbar visible above
3. User clicks zoom-in (+) — zoom increases by one increment (clamped at 3x max)
4. User clicks rotate — rotation cycles 0° → 90° → 180° → 270° → 0°
5. User clicks zoom-out (−) — zoom decreases by one increment (clamped at 0.5x min)

### Alternate Flows
- **No content provided**: Placeholder message displayed instead of image
- **Content not base64-encoded**: Falls to empty state; placeholder shown
- **No MIME type**: Defaults to PNG for rendering

### Failure Flows
- **Corrupted image data**: Browser renders broken image icon; no custom error handling
- **Invalid encoding**: Falls to empty state; placeholder displayed

### Recovery Flows
Parent component provides valid image content or user closes viewer.

### Exit Conditions
User navigates away, switches file type, or FileViewerRouter unmounts the component.

| Journey | Description |
| ------- | ----------- |
| Image inspection | User views image with default zoom/rotation |
| Zoom adjustment | User increases or decreases zoom via toolbar |
| Orientation correction | User rotates image in 90° increments |
| Empty placeholder | No content provided; placeholder message displayed |
| Corrupted data | Invalid encoding; browser shows broken icon |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| ImageViewer panel | Displays image with toolbar; occupies content area within FileViewerRouter |

# Interaction Design

| Interaction | Trigger | Behavior |
| ----------- | ------- | -------- |
| Zoom in | Click + button | Zoom multiplies by next increment; clamped at 3x; toolbar shows current zoom value |
| Zoom out | Click − button | Zoom divides by next increment; clamped at 0.5x; toolbar shows current zoom value |
| Rotate | Click rotate button | Rotation angle advances 90°; cycles 0→90→180→270→0; toolbar shows current angle |
| Image render | Valid content received | Image element renders with `object-fit: contain` constrained to container |

# Form Design

No form fields. Toolbar buttons are action triggers, not form inputs.

# UX State Design

| State | User Experience | Design Notes |
| ----- | --------------- | ------------ |
| Loaded | Image renders at current zoom/rotation; toolbar displays zoom level (1x) and rotation (0°) | Default zoom=1x, rotation=0° |
| Empty | Placeholder message: "No image content" displayed in center of container | No image element rendered |
| Error | Browser native broken image icon displayed | No custom error UI — spec non-responsibility |
| Zooming | Toolbar shows updated zoom value; image re-renders at new scale | Transition is instantaneous |
| Rotating | Toolbar shows updated rotation angle; image re-renders with CSS `transform: rotate()` | Transition is instantaneous |

**Quality Checklist**: LOADING — not applicable (pre-loaded content); ERROR — browser broken icon; EMPTY — placeholder message.

# Feedback Design

| Event | Feedback | Mechanism |
| ----- | -------- | --------- |
| Zoom in/out | Toolbar displays updated zoom percentage | Button click updates state; toolbar text reflects live value |
| Rotate | Toolbar displays updated rotation angle | Button click cycles state; toolbar text reflects live value |
| Invalid content | Placeholder replaces image | Conditional rendering of image vs. placeholder |
| Corrupted image | Browser shows broken image icon | Native `img` element `onerror` fallback |

# Navigation Design

| Path | Behavior |
| ---- | -------- |
| FileViewerRouter → ImageViewer | Router maps file extension to ImageViewer; passes base64 content as prop |
| ImageViewer → parent | No navigation; component is leaf in render tree |

No internal navigation — all interactions are zoom/rotation adjustments within the component.

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Image constrained to container dimensions with `object-fit: contain`; toolbar row horizontal with label |
| Tablet | Same as desktop; toolbar buttons maintain 44×44px touch targets |
| Mobile (≤480px) | Image fills container width; toolbar wraps to two rows if needed; buttons remain 44×44px; 8px spacing between controls |

# Accessibility Design

| Requirement | Implementation |
| ----------- | -------------- |
| Touch targets | All toolbar buttons minimum 44×44px |
| Focus-visible | Toolbar buttons show focus ring on keyboard navigation |
| Contrast | Toolbar icons/text meet 4.5:1 against surface background |
| Semantic HTML | `img` element with `alt` text; button elements for controls |
| ARIA labels | Zoom-in button: `aria-label="Zoom in"`; zoom-out: `aria-label="Zoom out"`; rotate: `aria-label="Rotate image"`; zoom level text: `aria-live="polite"` |
| Keyboard | Tab between toolbar buttons; Enter/Space to activate |
| Reduced motion | No animations affected by `prefers-reduced-motion` (all changes are instant) |

# Localization Design

| Key Pattern | Example | Scope |
| ----------- | ------- | ----- |
| `imageViewer.placeholder` | "No image content" | Empty state message |
| `imageViewer.zoomIn` | "Zoom in" | ARIA label for zoom in button |
| `imageViewer.zoomOut` | "Zoom out" | ARIA label for zoom out button |
| `imageViewer.rotate` | "Rotate image" | ARIA label for rotate button |
| `imageViewer.zoomLevel` | "1x" | Toolbar zoom display (numeric — no translation) |
| `imageViewer.rotationAngle` | "0°" | Toolbar rotation display (numeric — no translation) |
| `imageViewer.alt` | "Image preview" | Fallback alt text for image |

All text passes through localization function. Numeric values (zoom percentage, rotation degrees) are locale-formatted.

# Design System Traceability

| Rule | Application |
| ---- | ----------- |
| Radical Simplicity | No full-screen, download, or file-loading features beyond core zoom/rotate; no persistence |
| Typography Leads | Placeholder text uses `--font-body`; toolbar label uses `--font-label`; hierarchy via font weight and size |
| White Space is Feature | 8px padding around toolbar; 16px padding between toolbar and image; image centered with `object-fit: contain` |
| Color System | All colors via CSS variables: toolbar background `--surface-toolbar`, button `--color-icon`, border `--border-subtle` |
| Accessibility | 44×44px touch targets, `focus-visible` rings, ARIA labels on all controls, `alt` on image |
| Localization | Zero hardcoded strings; `imageViewer.*` key naming convention |
| 8px Grid | Toolbar spacing 8px; container padding 16px; all margins/insets multiple of 8 |
| Premium UI — Card Surfaces | Toolbar uses subtle border separation from image area |
| Quality Checklist | ERROR (broken icon), EMPTY (placeholder), LOADING (N/A — pre-loaded) |

# Open Questions

- Should zoom step size be configurable via prop? Current spec implies fixed increment per button press.
- Is PNG-only default MIME acceptable for mixed-content image previews?
- No tooltip for toolbar buttons — is `aria-label` alone sufficient given no visible label text?
