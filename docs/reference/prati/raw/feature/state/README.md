# State Management

Async state lifecycle specification for data-driven components.

## Purpose

State Management defines the lifecycle that data-driven components follow: loading → error → empty → success. This lifecycle ensures consistent user experience across all components that fetch or process data.

## Core Concepts

### State Lifecycle

```
Idle → Loading → Success
               → Error
               → Empty
```

| State | Meaning |
|-------|---------|
| **Idle** | Component mounted; no operation in progress |
| **Loading** | Async operation in progress; spinner or skeleton shown |
| **Success** | Operation completed with data; content rendered |
| **Error** | Operation failed; error message displayed |
| **Empty** | Operation completed with zero results; empty state shown |

### State Transition Rules

| From | To | Trigger |
|------|----|---------|
| Idle | Loading | Async operation initiated |
| Loading | Success | Data fetched successfully |
| Loading | Error | Network or API error |
| Loading | Empty | No results returned |
| Success | Loading | Refresh or pagination triggered |
| Error | Loading | Retry triggered |

## Responsibilities

- Define the standard async state lifecycle for all data-driven components
- Specify transition rules between states
- Ensure consistent visual treatment across LoadingState, ErrorState, and EmptyState atoms

## Non-Responsibilities

- Does not manage component-level local UI state (open/closed, expanded/collapsed)
- Does not define caching, persistence, or offline strategies
- Does not replace application-level state management patterns

## Business Rules

1. **State sequence is fixed** — The state lifecycle must follow the sequence: Idle → Loading → Success | Error | Empty; skipping states (e.g., Success without Loading) is not permitted
2. **One active state at a time** — A component must be in exactly one state at any moment; overlapping states are not permitted
3. **Error and Empty are terminal for failed operations** — Only a new Loading transition can exit Error or Empty states; direct transitions to Success from Error are not permitted
4. **Every data-driven component follows this lifecycle** — Any component that fetches or processes async data must implement the full lifecycle; silent failure (no Loading, no Error) is not permitted

## States

- **Idle** — No operation in progress; awaiting trigger
- **Loading** — Operation in progress; user sees progress indicator
- **Success** — Data loaded; content rendered
- **Error** — Operation failed; error message shown
- **Empty** — No data; empty state shown

## Edge Cases

- **Rapid state transitions**: Loading → Loading (cancelled request) — previous operation superseded
- **Error → Success**: Retry succeeds; error state replaced by content
- **Nested state**: Child component loading independently of parent; each follows its own lifecycle

## Error Conditions

- **State cycle violation** — Component attempts to transition from Error directly to Success without going through Loading
- **Missing state handling** — Component does not implement Error or Empty visual states
- **Stuck in Loading** — Async operation never completes; component remains indefinitely in Loading state
- **Double transition** — Two simultaneous state change requests cause inconsistent state

### Recovery Actions

| Error Condition | Recovery |
| --------------- | -------- |
| State cycle violation | Always go through Loading on retry; do not skip states |
| Missing state handling | Add ErrorState and EmptyState visual components for the Error and Empty lifecycle states |
| Stuck in Loading | Implement a timeout mechanism that transitions to Error after a configurable threshold |
| Double transition | Queue state transitions; process the most recent request and discard stale ones |

## Verification

- **State sequence test**: Trigger a data fetch; verify the component passes through Loading before reaching Success, Error, or Empty
- **Error recovery test**: Trigger a fetch failure; verify the component is in Error state, then trigger retry; verify it passes through Loading again before Success
- **Stuck loading test**: Simulate an async operation that never completes; verify the component transitions to Error after timeout
- **Empty state test**: Complete a fetch with zero results; verify the component renders Empty state (not Success with empty content)

## See Also

- [Glossary](../concepts/glossary.md) — concept-to-feature ownership map
- [LoadingState](../components/atoms/LoadingState.md) — atom for loading display
- [ErrorState](../components/atoms/ErrorState.md) — atom for error display
- [EmptyState](../components/atoms/EmptyState.md) — atom for empty display
