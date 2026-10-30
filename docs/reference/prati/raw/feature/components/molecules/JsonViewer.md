# JsonViewer

Displays JSON data with syntax highlighting and handles JSONL line-by-line.

## Overview

A specialized viewer for JSON and JSONL files. Parses JSON content and renders it with syntax highlighting in a dark code theme. Handles invalid JSON gracefully by showing a structured error object alongside the raw content. JSONL files are parsed line-by-line, so a single malformed line doesn't break the entire file.

## Responsibilities

- Render JSON data with syntax highlighting
- Format JSON with proper indentation and monospace font
- Parse JSONL files line-by-line, handling each line independently
- Show a structured error state for invalid JSON with raw content fallback

## Non-Responsibilities

- Does not load file content from disk or network
- Does not validate JSON schema or structure
- Does not provide search, filter, or tree-view navigation
- Does not support editing or saving JSON content
- Does not handle binary or non-UTF-8 encoded content

## Core Concepts

- **Parse-and-render pipeline:** Raw JSON text is parsed into structured data and rendered with syntax coloring — invalid JSON produces a structured error object with the raw content alongside it rather than crashing the component.
- **Graceful error recovery:** When JSON is invalid, the component stays mounted and displays both the error context and the raw input, allowing the user to inspect the problem without losing access to the content.
- **JSONL line-by-line handling:** Each line of a JSONL file is parsed and rendered independently — a single malformed line produces an error entry for that line only, leaving all other lines unaffected.
- **On-demand syntax coloring:** The syntax coloring library is loaded only when this component first renders — the user sees a brief loading indicator on first use, with no impact on initial page load.

## Business Rules

1. The component MUST parse JSON content and render it with syntax highlighting — raw text display is not sufficient.
2. Invalid JSON MUST NOT crash the component — a structured error object with the raw content MUST be displayed instead.
3. JSONL files MUST be parsed line-by-line; a single malformed line MUST NOT break parsing of subsequent lines.
4. The syntax highlighting library MUST be loaded lazily on first render — it must not block initial page load.
5. The component MUST NOT search, filter, edit, or validate JSON — it is a read-only viewer.

## Consumed By

- [FileViewerRouter](../organisms/FileViewerRouter.md) — delegates JSON and JSONL file rendering to this component based on file extension

## States

- **Loaded** — Valid JSON; syntax-highlighted formatted output displayed
- **Empty** — No content; fallback message shown
- **Error** — Invalid JSON; structured error object with raw content displayed
- **Loading** — Syntax highlighter lazily loading; loading fallback shown
- **JSONL parsing** — Lines parsed independently; each line may be in loaded or error state

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Empty | Loading | Content provided; syntax colorer not yet ready |
| Loading | Loaded | JSON valid and syntax colorer ready |
| Loading | Error | JSON is invalid; structured error object rendered |
| Loaded | Empty | Content prop removed |
| Error | Loading | Replacement content provided |
| Loading | JSONL parsing | File extension is .jsonl; line-by-line mode activates |

## Edge Cases

- No content or empty content: Displays a fallback message as a JSON object
- Invalid JSON: Renders a structured error object with the raw content
- JSONL files: Parsed line-by-line; parse failures produce per-line error objects
- Very large JSON: Syntax highlighting may cause performance issues
- Non-object JSON values: Strings, numbers, arrays, and booleans handled normally
- Missing localization key: Uses hardcoded fallback string

## Error Conditions

- Missing required value (file name) — Required value must be provided
- Invalid JSON — Structured error object rendered with raw content fallback
- JSONL parse failures — Failed lines produce error objects in output
- Very large JSON — Performance may degrade; no virtualization

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing required value (file name) | Provide a file name prop; the component cannot determine the file label without it |
| Invalid JSON | Correct the JSON syntax in the source file; the structured error display allows the user to inspect the problem |
| JSONL parse failures | Fix the malformed JSON line in the source; the per-line error isolates the issue to a single line |
| Very large JSON | Reduce the JSON size or implement virtualization; the component may experience degraded performance |

## Authorization

**Visibility:** Authenticated — used to view JSON and JSONL files within authenticated file viewer contexts.

## User Journey

### Entry Conditions
A user opens a JSON or JSONL file in a file viewer — this component renders the data with syntax highlighting.

### Primary Flow
The user sees formatted JSON with syntax highlighting in a dark code theme — valid content is easy to read and navigate.

### Alternate Flows
The file is JSONL — each line is parsed independently; malformed lines show error objects while valid lines render normally.

### Failure Flows
The JSON is invalid — a structured error object is displayed alongside the raw content for debugging.

### Recovery Flows
The user fixes the JSON source and reloads the file.

### Exit Conditions
The user finishes inspecting the JSON data and navigates away.

## Workflow

### Trigger
A user opens a JSON or JSONL file or a developer provides JSON string content.

### Preconditions
Content is provided as a string.

### Steps
The component parses the JSON, lazily loads the syntax highlighter, and renders formatted output with syntax highlighting.

### Outcomes
The user can read and inspect structured JSON data.

### Exceptions
Invalid JSON — a structured error object with raw content fallback is displayed.

### Completion Criteria
The JSON data is parsed and rendered with syntax highlighting.

## Verification

- Unit tests confirm valid JSON renders with syntax highlighting
- Unit tests confirm invalid JSON renders a structured error object without crashing
- Unit tests confirm JSONL files are parsed line-by-line and a single malformed line does not break other lines
- Integration tests confirm the syntax highlighter is loaded lazily
- Performance tests confirm acceptable rendering time for large JSON payloads

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [FileViewerRouter](../organisms/FileViewerRouter.md) — routes JSON and JSONL files to this component
