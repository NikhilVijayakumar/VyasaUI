# Architecture: State Management

Astra provides a **centralized state management** system based on MVVM patterns. It is a **stateless** library — state is managed transiently within the component lifecycle, and persistence is delegated to the consumer.

## StateType Enum

```typescript
// From astra/src/common/state/AppState.ts
enum StateType {
  INIT = 0,        // Initial state
  LOADING = 1,     // Loading in progress
  COMPLETED = 2,   // Terminal state — check isError for success vs failure
}
```

## State Transitions

```
[INIT] ────────→ [LOADING] ────────→ [COMPLETED / isError=false]  ← success
                                  └─→ [COMPLETED / isError=true]   ← error
```

There is no separate `ERROR` enum value. Error is represented by `state === StateType.COMPLETED && isError === true`. Always check `appState.isError` to distinguish success from failure after the async operation completes.

## AppState Interface

```typescript
interface AppState<T> {
  state: StateType;           // INIT | LOADING | COMPLETED
  isError: boolean;           // true if operation failed
  isSuccess: boolean;         // true if operation succeeded
  status: HttpStatusCode;     // HTTP status code
  statusMessage: string;      // User-facing message
  data: T | null;             // Response data (null if error)
}
```

## Using useDataState

### Basic Usage
```typescript
import { useDataState, StateType, AppState } from 'astra';

const [appState, execute] = useDataState<ModelList>();

execute(async () => {
  return await api.get<ModelList>('/endpoint');
});
```

### Conditional Rendering
```typescript
import { AppStateHandler, StateType } from 'astra';

<AppStateHandler
  appState={appState}
  SuccessComponent={({ appState }) => <List data={appState.data} />}
  emptyCondition={(data) => data?.length === 0}
  errorMessage="Failed to load"
/>
```

### Manual State Handling
```typescript
const [appState, execute] = useDataState<ModelList>();

if (appState.state === StateType.LOADING) {
  return <LinearProgress />;
}

if (appState.isError) {
  return <Alert severity="error">{appState.statusMessage}</Alert>;
}

if (!appState.data?.length) {
  return <EmptyState message="No items found" />;
}

return <Grid items={appState.data} />;
```

## HttpStatusCode

```typescript
enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  INTERNET_ERROR = 0,
}
```

`HttpStatusCode.IDLE` remains as a deprecated alias. Use `StateCode.IDLE` for the pre-HTTP initial status.

## StateCode

Non-HTTP status values used before or outside HTTP activity:

```typescript
enum StateCode {
  IDLE = 1000,  // Initial status — no operation has started
}
```

`StateCode.IDLE` is the initial value of `AppState.status`. It is exported separately from `HttpStatusCode` to make clear it is not an HTTP response code.

## Rules

- **Always use useDataState** for async API calls
- **Use useState** only for UI state (selections, dialogs)
- **Never store sensitive data** in volatile state
- **Astra is stateless** — persistence is the consumer's responsibility

## Related

- [MVVM Pattern](mvvm-pattern.md)
- [Repository](repository.md)
- Prati Documentation — ThemeProvider, LanguageProvider, theming, localization
