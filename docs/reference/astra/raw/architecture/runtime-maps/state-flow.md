# Runtime Map: State Flow

Maps `AppState<T>` transitions through runtime.

```
┌─────────┐    execute()     ┌─────────┐    success    ┌───────────┐
│  INIT   │ ────────────────→ │ LOADING │ ────────────→ │ COMPLETED │
└─────────┘                   └─────────┘               └───────────┘
                                   │                          │
                                   │ error                    │ error
                                   ↓                          ↓
                              ┌────────────────────────────────┐
                              │         isError: true           │
                              │   statusMessage: string         │
                              └────────────────────────────────┘
```

## Transitions

| From | To | Trigger | Data | isError |
|------|----|---------|------|---------|
| INIT | LOADING | `execute()` called | Preserved | false |
| LOADING | COMPLETED | API success | Updated | false |
| LOADING | COMPLETED | API failure | null | **true** |
| COMPLETED | LOADING | `execute()` recalled | Preserved | false |

There is no separate `ERROR` enum value. Error is `StateType.COMPLETED` with `isError: true`. Always check `appState.isError` to distinguish success from failure.

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/mvvm-separation.md` | M-1: ViewModel owns state |
| `core/state-management.md` | State management guidance |
| `core/hooks.md` | useDataState API |
