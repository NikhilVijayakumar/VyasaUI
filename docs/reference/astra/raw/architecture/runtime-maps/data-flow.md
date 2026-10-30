# Runtime Map: Data Flow

Maps data flow through MVVM layers at runtime.

```
User Action
     │
     ▼
┌─────────────────┐
│   View (Page)   │  ← calls ViewModel hook, passes props to View components
│  view/pages/    │
└────────┬────────┘
         │ calls hook
         ▼
┌─────────────────┐
│ ViewModel (Hook)│  ← owns useDataState, orchestrates business logic
│  hooks/         │
└────────┬────────┘
         │ calls repository
         ▼
┌─────────────────┐
│ Repository      │  ← data access via ApiService or IPC
│  repo/          │
└────────┬────────┘
         │ HTTP / IPC
         ▼
┌─────────────────┐
│ External API    │  ← REST, Electron IPC
└─────────────────┘
```

## Response Flow

```
External API
     │
     ▼
┌─────────────────┐
│ ApiService      │  ← wraps Axios, returns ServerResponse<T>
│  common/repo/   │
└────────┬────────┘
         │ ServerResponse<T>
         ▼
┌─────────────────┐
│ Repository      │  ← returns ServerResponse<T> to ViewModel
│  repo/          │
└────────┬────────┘
         │ ServerResponse<T>
         ▼
┌─────────────────┐
│ useDataState    │  ← extracts data/error, sets AppState
│  common/hooks/  │
└────────┬────────┘
         │ AppState<T>
         ▼
┌─────────────────┐
│ AppStateHandler │  ← renders Success/Error/Loading based on state
│  common/hooks/  │
└─────────────────┘
```

## Aligned Documents

| Document | Role |
|----------|------|
| `invariants/mvvm-separation.md` | M-1 through M-4: Layer separation |
| `invariants/repository-isolation.md` | R-1: Repository isolation |
| `core/feature-structure.md` | Canonical feature layout |
| `core/mvvm-pattern.md` | MVVM guidance |
| `core/repository.md` | Repository guidance |
| `core/hooks.md` | useDataState API |
