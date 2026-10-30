# Overview
The JsonViewer component provides a specialized viewing experience for JSON and JSONL files. It enables users to inspect structured data clearly through syntax highlighting, formatting, and graceful handling of malformed input, ensuring that the file's raw content remains accessible even when parsing fails.

# Feature Summary
- **Purpose**: Render JSON and JSONL data with syntax highlighting and formatting for readability.
- **Responsibilities**: Provide syntax highlighting, handle JSONL line-by-line parsing, display structured error states for invalid JSON, and maintain a dark code theme aesthetic.
- **Non-Responsibilities**: Loading files from disk/network, validating JSON schemas, searching/filtering, editing/saving, and handling non-UTF-8 content.

# User Goals
| User Goal | Description |
| --------- | ----------- |
| Read JSON | View formatted JSON data easily with visual syntax highlighting. |
| Inspect JSONL | Review line-by-line JSON objects even if some lines contain errors. |
| Debug Invalid JSON | See raw invalid JSON and specific parsing errors without the viewer crashing. |

# User Journeys

### Entry Conditions
- User opens a JSON or JSONL file in the file viewer interface.

### Primary Flow
1. User selects a valid JSON file.
2. The viewer lazily loads the syntax highlighter (showing a brief loading state).
3. The file is presented with syntax highlighting and proper indentation.

### Alternate Flows
- **JSONL Parsing**: User opens a JSONL file -> Each line is parsed independently; malformed lines show specific errors while valid lines are highlighted.

### Failure Flows
- **Invalid JSON**: User opens an invalid JSON file -> The viewer displays a structured error object alongside the raw input.

### Recovery Flows
- User identifies the parsing error from the structured error object, corrects the file externally, and re-renders it.

### Exit Conditions
- User navigates away from the file or closes the viewer.

| Journey | Description |
| ------- | ----------- |
| View Valid JSON | User seamlessly views formatted JSON with a dark code theme. |
| View Invalid JSON | User is presented with a clear error object and raw fallback text instead of a blank screen. |
| View JSONL | User views line-by-line JSON, with per-line error containment. |

# Screen Inventory
| Screen | Purpose |
| ------ | ------- |
| JsonViewer Component | The main component interface for displaying the JSON/JSONL data within the broader file viewer. |

# Interaction Design
| Interaction | Behavior |
| ----------- | -------- |
| Scroll | User can scroll through large JSON files horizontally and vertically. |
| Text Selection | User can highlight and copy sections of the JSON or error output. |

# Form Design
| Field | Required | UX Behavior |
| ----- | -------- | ----------- |
| N/A | N/A | The JsonViewer is a read-only component and does not contain forms. |

# UX State Design
| State | User Experience |
| ----- | --------------- |
| Loading | A brief loading indicator or skeleton state is shown while the syntax highlighter initializes. |
| Loaded (Valid) | JSON is displayed with full syntax highlighting (keys, strings, numbers, booleans colored differently). |
| Error | Displays a structured error object indicating the issue, with the raw text displayed below or alongside it. |
| Empty | A fallback message styled as a JSON object (e.g., `{"message": "No content provided"}`) is displayed. |
| JSONL Parsing | Valid lines are highlighted; invalid lines display line-specific error objects. |

# Feedback Design
| Event | Feedback |
| ----- | -------- |
| Syntax Highlighter Loading | Visual loading indicator. |
| Parse Failure | Structured JSON error object explaining the parsing failure. |

# Navigation Design
| Navigation Path | Behavior |
| --------------- | -------- |
| N/A | Navigation is handled by the parent FileViewerRouter; the JsonViewer is a terminal view. |

# Responsive Design
| Viewport | Adaptation |
| -------- | ---------- |
| Desktop | Full syntax highlighting; horizontal scrolling for wide lines. |
| Tablet | Horizontal scrolling for wide lines; touch-friendly scrolling. |
| Mobile | Horizontal scrolling; smaller base font size if necessary. |

# Accessibility Design
| Accessibility Area | Behavior |
| ------------------ | -------- |
| Screen Reader Support | Ensures the raw JSON text is accessible to screen readers, overriding complex DOM structures if needed. |
| Color Contrast | The dark code theme must meet WCAG contrast requirements for syntax highlighted text. |

# Localization Design
| Localization Area | Behavior |
| ----------------- | -------- |
| Fallback Messages | Error and empty state messages must use localized strings. |

# Design System Traceability
| Design System Rule | Applied To |
| ------------------ | ---------- |
| Premium UI Patterns | Graceful error recovery (showing raw text on failure rather than crashing). |
| Typography | Monospace font selection for code readability. |

# Open Questions
- Is there a need for a "Copy to Clipboard" button within the viewer itself?
- Should very large JSON files implement virtualization to prevent performance degradation?
- Can users toggle between a light theme and the default dark code theme?
