# Overview

task-summary renders a titled summary panel containing a list of tasks with completion status and optional due dates. Each task displays its text with a strikethrough style when `status` is `completed`, and an optional due date label in muted text. The list is omitted entirely when the `tasks` array is empty. Uses the `ifEquals` Handlebars helper for conditional strikethrough styling.

# Feature Summary

| Field | Value |
|-------|-------|
| Feature ID | TEMPLATES-005 |
| Feature Name | task-summary |
| Category | Molecule |
| Priority | P1 |
| Dependencies | `ifEquals` Handlebars helper registered on the Handlebars instance; `tasks` array provided by caller |
| Future | `completedCount`/`totalCount` summary line, `priority` field with visual indicator, grouping tasks by status (pending vs completed) |

# User Goals

| User Goal | Description |
| --------- | ----------- |
| Display task list in email | Render a summary of tasks with completion status visible at a glance |
| Distinguish completed tasks | Completed tasks visually differentiated via strikethrough and muted styling |
| Show due dates per task | Each task shows optional due date label |

# User Journeys

### Entry Conditions
Caller needs to include a task summary in an email or notification HTML payload.

### Primary Flow: Populated Task Summary
1. Caller provides `title` (e.g., "Today's Tasks") and a `tasks` array with one or more task objects
2. Template renders panel with title heading
3. Each task renders: text with strikethrough if `status` is `completed`, optional due date label
4. Tasks rendered in array order (no sorting)

### Alternate Flows
- **Empty task list**: `tasks` array is empty or omitted — only the panel title renders; no `<ul>` appears
- **All completed**: All tasks have `status: 'completed'` — all text struck through; panel shows no pending items
- **Task without due date**: Individual task missing `dueDate` — due date span omitted for that task

### Failure Flows
- **`ifEquals` helper not registered**: Completed tasks render without strikethrough; all tasks appear with normal styling
- **`title` not provided**: Panel heading renders empty

### Recovery Flows
- **Missing helper recovery**: Caller registers `ifEquals` on the Handlebars instance before rendering
- **Missing title recovery**: Caller provides a `title` string in render data

### Exit Conditions
Caller receives rendered HTML with panel title and task list (if tasks present), with appropriate strikethrough styling for completed items.

| Journey | Description |
| ------- | ----------- |
| Populated | Tasks array has items; list renders with status styling and optional due dates |
| Empty | Tasks array empty; only panel title renders |
| All completed | All tasks completed; all text appears struck through |

# Screen Inventory

N/A — task-summary is an email template fragment.

# Interaction Design

N/A — task-summary is a static HTML email template. Per spec: "Does not handle click or check interactions — static HTML only."

# Form Design

N/A — task-summary is a static HTML template with no form fields.

# UX State Design

| State | User Experience |
| ----- | --------------- |
| Populated | Panel title visible; task list rendered with each task showing text, strikethrough status (if completed), and optional due date |
| Empty | Panel title renders; no task list visible |
| All completed | Panel title renders; all tasks visually struck through and muted |

# Feedback Design

| Event | Feedback |
| ----- | -------- |
| Tasks present | Panel heading + list of tasks with status styling renders |
| Empty tasks | Only panel heading renders; no list |
| `ifEquals` missing | Tasks render without strikethrough styling |

# Navigation Design

N/A — task-summary is a static email template. It does not contain navigation elements.

# Responsive Design

N/A — task-summary is an email template. Responsive rendering is determined by the email client.

# Accessibility Design

N/A — task-summary is a server-side email template. Email client accessibility is outside the scope.

# Localization Design

| Localization Area | Behavior |
| ----------------- | -------- |
| Template text | All user-facing strings (`title`, `tasks[].text`, `tasks[].dueDate`) supplied by caller via render data; no hardcoded strings |

# Design System Traceability

| Design System Rule | Applied To |
| ------------------ | ---------- |
| Localization — Zero Hardcoding Policy | Template contains no hardcoded text; all content via render variables |
| Rule 1: Radical Simplicity | Single purpose — render task list with completion status; no sorting, filtering, or interaction |
| Rule 8: Consistency Builds Trust | Task rendering behavior predictable — completed tasks always struck through, array order preserved |

# Open Questions

- Should `completedCount` / `totalCount` summary line be added above the list?
- Should `priority` field with visual indicator be added per task?
- Should grouping by status (pending vs completed sections) be supported?
