# task-summary

A styled task list with completion status and optional due dates.

## Overview

Renders a titled summary panel containing a list of tasks. Each task displays its text with a strikethrough style when `status` is `completed`, and an optional due date label. Uses a custom conditional helper for text decoration branching. Omits the list entirely when the `tasks` array is empty.

## Template Variables

| Variable        | Type     | Required | Description                                         |
| --------------- | -------- | -------- | --------------------------------------------------- |
| `title`         | string   | Yes      | Panel heading text                                  |
| `tasks`         | array    | No       | Array of task objects; omits list when empty        |
| `tasks[].text`  | string   | Yes      | Task display text                                   |
| `tasks[].status`| string   | Yes      | `completed` applies strikethrough; any other value renders normally |
| `tasks[].dueDate`| string  | No       | Due date label rendered in muted text next to task  |

## Custom Helper Dependency

Requires a conditional equality helper (`ifEquals`) registered on the template engine.

## Responsibilities

- Render a titled task summary panel with inline styles
- Iterate tasks array and render each task with text and status
- Apply strikethrough and muted color to completed tasks
- Render optional due date label per task
- Omit task list when array is empty

## Non-Responsibilities

- Does not sort or filter tasks — renders in array order
- Does not handle click or check interactions — static HTML only
- Does not compute counts or progress — display only

## Business Rules

1. Tasks with `status: "completed"` MUST render with strikethrough and muted color; all other status values MUST render without strikethrough
2. The task list (`<ul>`) MUST be omitted entirely when the `tasks` array is empty or not provided — never render an empty list
3. Tasks MUST render in the order they appear in the `tasks` array — no sorting, filtering, or reordering
4. Each task's `dueDate`, when provided, MUST be rendered next to the task text in muted styling
5. The `ifEquals` custom helper MUST be registered on the template engine before rendering; no graceful fallback exists for a missing helper

## States

- **Populated** — `tasks` array has one or more items; list renders
- **Empty** — `tasks` array is empty or omitted; only panel title renders
- **All completed** — all tasks have `status: 'completed'`; all text struck through

## Edge Cases

- Empty `tasks` array: panel title renders; `<ul>` is omitted
- Task missing `dueDate`: due date span is omitted for that task
- Unknown `status` value: task renders without strikethrough
- Very long `text`: wraps within list item; no overflow

## Error Conditions

### Recovery Actions

| Error Condition | Recovery Action |
|---|---|
| `ifEquals` helper not registered | Log a warning; render all tasks without strikethrough as fallback |
| `title` not provided | Log a warning; render panel without heading |

- `ifEquals` helper not registered — completed tasks render without strikethrough
- `title` not provided — heading renders empty

## Verification

- Render Populated state with mixed statuses and verify strikethrough applies only to `completed` tasks
- Render Empty state and verify `<ul>` is absent from output
- Render All completed state and verify every task text has strikethrough
- Render tasks with and without `dueDate` and verify the label appears only when provided
- Simulate missing `ifEquals` helper and verify all tasks render without strikethrough (no crash)

## See Also

- [Template System README](./README.md) — renderer service and registry overview

## Future Enhancements

- Add `completedCount` / `totalCount` summary line above the list
- Add `priority` field with visual indicator per task
- Support grouping tasks by status (pending vs completed sections)
