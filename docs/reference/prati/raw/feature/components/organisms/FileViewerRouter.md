# FileViewerRouter

Automatically selects and renders the correct file viewer based on file extension.

## Overview

A smart routing component that inspects the file extension and delegates rendering to the appropriate specialized viewer: CSV files go to the CSV viewer, Markdown and text files to the Markdown viewer, images to the image viewer, and JSON/JSONL to the JSON viewer. Unknown file types show an unsupported file message.

## Responsibilities

- Route to the correct viewer component based on file extension
- Support CSV, Markdown, text, image, and JSON/JSONL file types
- Display an unsupported file message for unknown extensions
- Pass encoding and MIME type metadata through to the image viewer

## Non-Responsibilities

- Does not load file content from disk or network
- Does not transform or convert file formats
- Does not validate file integrity or encoding
- Does not handle streaming or partial content

## Core Concepts

- **Router/dispatcher pattern:** Maps file extensions to sub-viewer components — a central decision point that coordinates which viewer renders based on file type metadata.
- **Delegation to sub-viewers:** Each file type routes to a dedicated viewer — the router itself has no rendering logic beyond the fallback unsupported state.
- **Extension-based routing logic:** The file extension is extracted from the file name — this is a metadata-level decision that doesn't require reading file content, enabling early routing.
- **Metadata pass-through:** Encoding and MIME type are forwarded only to the image viewer; other viewers ignore them.

## Business Rules

1. File extension is extracted from the file name after the last dot; files without a dot fall through to unsupported.
2. Only the following extensions are recognized: .csv, .md, .txt, .png, .jpg, .jpeg, .gif, .webp, .svg, .json, .jsonl.
3. Encoding and MIME type metadata are forwarded only to the image viewer; other sub-viewers receive content only.
4. If a sub-viewer encounters an unrecoverable error, the router catches it and displays the unsupported-file fallback.
5. The router does not load file content — it expects content to be provided as a prop.

## States

- **Idle** — Recognized file extension with content; delegates to appropriate sub-viewer
- **Unsupported** — File extension does not match any known viewer; renders unsupported file message
- **Empty** — No content provided; passes undefined to sub-viewer (each handles it independently)

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Idle | Unsupported | File name changes to one with an unknown or missing extension |
| Idle | Empty | Content prop changes to undefined or null |
| Unsupported | Idle | File name updated to one with a recognized extension and content provided |
| Empty | Idle | Content prop provided with a recognized file extension |
| Empty | Unsupported | No content and file has an unknown extension |

## Edge Cases

- No file extension: Falls through to unsupported file case
- File name without extension (e.g., "Makefile"): Falls through to unsupported
- Unknown or unsupported extension: Renders unsupported file fallback with the extension displayed
- No content provided: Delegates to sub-viewer; each handles missing content independently
- Encoding and MIME type only passed through to image viewer; other viewers ignore them

## Error Conditions

- **Unknown extension** — Renders unsupported file fallback with the extension displayed
- **Missing content** — Delegated to sub-viewer; each handles missing content independently
- **Sub-viewer failure** — If a sub-viewer encounters an unrecoverable error, the router displays an unsupported-file fallback and does not propagate the error to the caller

### Recovery Actions

| Condition | Recovery |
| --------- | -------- |
| Unknown file extension | Verify that the file has a supported extension (.csv, .md, .txt, .json, .jsonl, image formats) |
| Missing file content | Provide file content as a string prop; each sub-viewer handles empty content independently |
| Sub-viewer rendering failure | Validate file content format upstream; the router displays a fallback instead of crashing |

## Authorization

**Visibility:** Authenticated — used to display file contents within authenticated application views.

## User Journey

### Entry Conditions
A file is loaded into a file viewer panel and this component inspects its extension to route to the correct viewer.

### Primary Flow
The component detects the file extension, routes to the appropriate sub-viewer (CSV, Markdown, image, JSON), and the sub-viewer renders the content.

### Alternate Flows
The file has no extension or an unknown extension — the component renders an "unsupported file" message.

### Failure Flows
A sub-viewer encounters an error with malformed content — the router displays the unsupported-file fallback and the user is informed the file cannot be displayed.

### Recovery Flows
The user opens a valid file of a supported type, or the parent provides corrected file content.

### Exit Conditions
The user views the file through the routed sub-viewer or sees the unsupported message.

## Workflow

### Trigger
A developer provides file content, file name, and optional metadata to this router component.

### Preconditions
File content and a file name with an identifiable extension are provided.

### Steps
The component extracts the extension, matches it against supported types, and delegates rendering to the appropriate sub-viewer with relevant props.

### Outcomes
The file content is displayed through the correct specialized viewer.

### Exceptions
Unsupported extension — an unsupported file fallback message is displayed.
### Completion Criteria

The file is routed to the correct sub-viewer and the content is displayed.

## Verification

- Verify that a .csv file routes to CsvViewer and renders the CSV table
- Verify that a .md file routes to MdViewer and renders the Markdown content
- Verify that .png, .jpg, .gif files route to ImageViewer with correct encoding and MIME metadata
- Verify that .json and .jsonl files route to JsonViewer
- Verify that an unknown extension (e.g., .xyz) renders the unsupported file fallback message

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [CsvViewer](./CsvViewer.md) — handles .csv files
- [MdViewer](../molecules/MdViewer.md) — handles .md and .txt files
- [ImageViewer](../molecules/ImageViewer.md) — handles image files
- [JsonViewer](../molecules/JsonViewer.md) — handles .json and .jsonl files

## Future Enhancements

- Additional file types (PDF, XML, YAML, log files)
- Drag-and-drop file loading for inline previews
- Fallback text-viewer mode for unknown text-based files
- Custom viewer registration via a plugin or mapping prop

## Open Questions

- How should binary files larger than 50 MB be handled?
- Should accessibility announcements differ per sub-viewer?
