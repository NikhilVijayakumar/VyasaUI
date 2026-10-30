# MdViewer

Renders Markdown content as styled HTML with a file name heading.

## Overview

Converts raw Markdown content into styled HTML for reading. Displays the file name as a heading above the rendered content. Applies custom styling to headings, paragraphs, lists, blockquotes, and horizontal rules. The Markdown parser is loaded lazily to optimize initial bundle size.

## Responsibilities

- Render Markdown content to styled HTML
- Display the file name as a heading with a divider separator
- Lazy-load the Markdown parser for code-splitting
- Apply custom styling to headings, blockquotes, paragraphs, lists, and horizontal rules

## Non-Responsibilities

- Does not load file content from disk or network
- Does not support syntax highlighting, diagrams, or embedded media
- Does not handle file encoding or format conversion
- Does not persist scroll position across re-renders

## Core Concepts

- **On-demand parser loading:** The Markdown parser is loaded only when this component first renders — the user sees a brief loading indicator while the parser becomes ready, avoiding any impact on initial page load.
- **Content rendering pipeline:** Raw Markdown text is converted into styled, readable HTML — each element type (heading, list, blockquote) receives consistent visual treatment.
- **Fallback for missing content:** When content is absent or empty, the component shows a "no content" message rather than an error — the layout remains stable regardless of whether content is provided.
- **File name as heading pattern:** The file name is always rendered as a heading above the Markdown content, separating metadata from content.

## Business Rules

1. The Markdown parser MUST be loaded lazily on first render — it must not block the initial page load.
2. When content is absent, empty, or whitespace-only, the component MUST render a "no content" message — never an error or crash.
3. The file name MUST always be rendered as a heading above the Markdown content.
4. Invalid Markdown syntax MUST render as plain text — the component MUST NOT throw or crash.
5. The component MUST NOT load file content from disk or network — the caller provides the content string.

## Consumed By

- [FileViewerRouter](../organisms/FileViewerRouter.md) — delegates Markdown and plain-text file rendering to this component based on file extension

## States

- **Loaded** — Content provided; Markdown rendered as styled HTML
- **Empty** — No content or empty content; empty-state message displayed
- **Loading** — Parser module being lazily loaded; "Loading" fallback shown
- **Error** — Invalid Markdown gracefully renders as plain text

### State Transitions

| From State | To State | Trigger |
| ---------- | -------- | ------- |
| Empty | Loading | Content provided; parser not yet ready |
| Loading | Loaded | Parser ready and Markdown renders successfully |
| Loading | Error | Parser encounters invalid Markdown |
| Loaded | Empty | Content prop removed or set to empty string |
| Error | Loading | New content provided; parser retries |

## Edge Cases

- No content provided or content is empty/whitespace-only: Renders empty-state message
- Missing localization key: Uses hardcoded fallback string
- Parser lazily loading: Shows a loading fallback while the parser module loads
- Invalid Markdown syntax: Gracefully renders as plain text without throwing
- Very long content: Scrolls naturally within the container

## Error Conditions

- Missing required value (file name) — Required value must be provided
- Invalid Markdown — Renders as plain text; no crash

### Recovery Actions

| Error Condition | Recovery Action |
| --------------- | --------------- |
| Missing required value (file name) | Provide a file name prop; the component cannot render the heading without it |
| Invalid Markdown | Correct the Markdown syntax; the component renders the content as plain text as a safe fallback without crashing |

## Authorization

**Visibility:** Authenticated — used to view Markdown and text files within authenticated file viewer contexts.

## User Journey

### Entry Conditions
A user opens a Markdown or text file in a file viewer — this component renders the content as styled HTML.

### Primary Flow
The user sees the file name as a heading, then the Markdown content rendered as styled HTML underneath.

### Alternate Flows
No content is provided — an empty-state message is shown instead of the Markdown output.

### Failure Flows
Invalid Markdown syntax — the component renders the content as plain text without crashing.

### Recovery Flows
The user edits the Markdown source and reloads the file.

### Exit Conditions
The user finishes reading the Markdown content and navigates away.

## Workflow

### Trigger
A user opens a Markdown or text file or a developer provides Markdown string content.

### Preconditions
Content is provided as a string and a file name is given.

### Steps
The component displays the file name heading, lazily loads the Markdown parser, converts the content to styled HTML, and renders it.

### Outcomes
The user can read formatted Markdown content with theme-aware styling.

### Exceptions
Invalid Markdown — renders as plain text without crashing.

### Completion Criteria
The Markdown content is rendered as styled HTML beneath the file name heading.

## Verification

- Unit tests confirm invalid Markdown renders as plain text without throwing
- Integration tests confirm the parser is loaded lazily and does not block initial render
- Visual regression tests confirm headings, paragraphs, lists, blockquotes, and horizontal rules are styled correctly
- Integration tests confirm the empty-state message appears when content is absent

## See Also

- [Glossary](../../concepts/glossary.md) — concept-to-feature ownership map
- [Authorization Model](../../concepts/authorization.md) — cross-cutting permission rules
- [FileViewerRouter](../organisms/FileViewerRouter.md) — routes Markdown and text files to this component
