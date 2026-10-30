# Overview

FileViewerRouter is a dispatcher component that inspects a file's extension and routes rendering to the appropriate sub-viewer: CsvViewer for `.csv`, MdViewer for `.md`/`.txt`, ImageViewer for images, and JsonViewer for `.json`/`.jsonl`. Unknown or missing extensions produce an unsupported file message. The router makes a metadata-level routing decision — it does not read file content.

# Feature Summary

- **Purpose**: Automatically selects and renders the correct file viewer based on file extension
- **Responsibilities**: Route to correct viewer by file extension; Support CSV, Markdown, text, image, JSON/JSONL; Display unsupported file message for unknown extensions; Pass encoding and MIME type to image viewer
- **Non-Responsibilities**: Does not load file content; Does not transform/convert formats; Does not validate file integrity; Does not handle streaming/partial content

# User Goals

| User Goal | Description |
| --------- | ----------- |
| View any supported file type | User opens a file and sees its content rendered in the correct viewer without manual type selection |
| Know when a file type is unsupported | User sees a clear message explaining the file cannot be displayed |
| View images with correct encoding | Image viewer receives encoding and MIME type metadata for accurate rendering |

# User Journeys

### Entry Conditions
User opens a file in an authenticated file viewer panel.

### Primary Flow
1. FileViewerRouter receives file name, content, and optional encoding/MIME type
2. Router extracts file extension from the file name
3. Extension maps to a known sub-viewer (e.g., `.csv` → CsvViewer)
4. Router delegates rendering with file content as props
5. Sub-viewer renders the file content within the same panel

### Alternate Flows
- **Unsupported extension**: Extension does not match any mapped viewer — router renders "unsupported file" message with the extension displayed
- **No extension**: File name has no dot extension (e.g., "Makefile") — router treats as unknown, renders unsupported message
- **No content**: Content prop is undefined/null — router delegates undefined to the sub-viewer; each sub-viewer handles empty content independently

### Failure Flows
- Sub-viewer encounters an unrecoverable error — router catches the error and displays the unsupported-file fallback without propagating the error
- Mixed or corrupted metadata — encoding/MIME type passed to image viewer may cause rendering issues; router does not validate metadata integrity

### Recovery Flows
User opens a different file with a supported extension and valid content — router re-evaluates extension and re-delegates

### Exit Conditions
User sees the file rendered in the correct sub-viewer or sees the unsupported file message

| Journey | Description |
| ------- | ----------- |
| View a supported file | User opens a `.csv` file; router delegates to CsvViewer which renders a paginated table |
| View an unsupported file | User opens a file with no extension or unknown extension; router shows unsupported message |
| View an image file | User opens an image; router delegates to ImageViewer with encoding and MIME type |

# Screen Inventory

| Screen | Purpose |
| ------ | ------- |
| File viewer panel | Main area where FileViewerRouter renders the delegated sub-viewer or unsupported fallback |

# Interaction Design

| Interaction | Behavior |
| ----------- | -------- |
| File selection | Parent provides file name and content — router reacts to prop changes, no direct interaction |
| Viewer switch | When file name extension changes, router unmounts old sub-viewer and mounts new one |

# Form Design

| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| File name | Yes | Extension extracted for routing; no extension → unsupported |
| Content | Yes | Passed through to sub-viewer; undefined/null → empty state per sub-viewer |
| Encoding | No | Passed only to ImageViewer; other viewers ignore |
| MIME type | No | Passed only to ImageViewer; other viewers ignore |

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Idle | Recognized extension + content present — sub-viewer renders the file content |
| Unsupported | Unknown/missing extension — "unsupported file" message displayed with the extension name |
| Empty | No content provided — sub-viewer receives undefined and handles its own empty state |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Unsupported extension | Text message indicating the file type cannot be displayed; the unrecognized extension is shown |
| Sub-viewer error | Router shows unsupported-file fallback; error is not propagated to the caller |

# Navigation Design

| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | Router is embedded within a parent view — no navigation paths; all routing is component-level delegation |

# Responsive Design

| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Sub-viewer fills available panel width; ImageViewer may constrain dimensions |
| Tablet | Same delegated rendering — responsiveness handled by each sub-viewer |
| Mobile | Sub-viewer adapts per its own responsive rules; unsupported message wraps naturally |

# Accessibility Design

| Accessibility Area | Behavior |
| ------------------ | -------- |
| Unsupported message | Rendered with `role="alert"` or `aria-live="polite"` to notify screen reader users when a file cannot be displayed |
| Sub-viewer delegation | Each sub-viewer manages its own accessibility — router does not override or inject aria attributes into sub-viewers |
| Focus management | When file changes, focus remains at the parent panel level — router does not programmatically shift focus |

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Unsupported file message | Text pulled from localization system via key (e.g., `fileViewer.unsupported`) — includes dynamic extension value |
| File type labels | No hardcoded file type names; sub-viewer labels are handled within each sub-viewer |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Radical Simplicity | Single-responsibility router — no rendering logic beyond extension matching and delegation to sub-viewers |
| 8px grid rule | Sub-viewer padding and spacing via parent container; router itself has no presentational DOM |
| Quality Checklist | All three states defined — Idle (delegates), Unsupported (fallback message), Empty (passes undefined to sub-viewer) |
| Accessibility | Unsupported state uses `role="alert"` for screen reader announcement |

# Open Questions

- Should the unsupported fallback include a "download file" action so users can still access the content externally?
- What is the exact set of image MIME types the router should pass through to ImageViewer?
- Should binary files over a size threshold (e.g., 50 MB) be blocked before delegation?
