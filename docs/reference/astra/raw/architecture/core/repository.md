# Architecture: Repository Pattern

Astra provides a **Repository pattern** for API and data access, built on `ApiService` (Axios wrapper) for WEB targets and `IpcService` for ELECTRON targets, with typed response contracts.

## Repository Structure

```
Repository Pattern
├── ApiService        # HTTP client wrapper (WEB)
├── IpcService        # IPC service wrapper (ELECTRON)
├── ServerResponse    # Response wrapper
├── HttpStatusCode    # Status enum
└── Repository        # Feature-specific repos
```

## ApiService Setup

Astra's `ApiService` wraps Axios with error handling and localization:

```typescript
import { ApiService, ServerResponse, HttpStatusCode } from 'astra';

const api = new ApiService('https://api.example.com', {
  internal_server_error: 'Something went wrong.',
  unauthorized: 'Please sign in.',
});
```

## ServerResponse Pattern

All API calls return `ServerResponse<T>`:

```typescript
interface ServerResponse<T> {
  isError: boolean;
  isSuccess: boolean;
  status: HttpStatusCode;
  statusMessage: string;
  data?: T;
}

// Success:
ServerResponse.success({ status: 200, statusMessage: 'OK', data: items });

// Error:
ServerResponse.error({ status: 500, statusMessage: 'Failed to load' });
```

## Repository Pattern

### Structure

Within the canonical feature structure (see [Feature Structure](feature-structure.md)):

```
src/
└── features/
    └── [feature]/
        ├── model/       # Domain types
        │   └── <feature>.types.ts
        └── repo/        # Feature-specific repos
            └── <feature>Api.ts
```

### Repository Example

```typescript
import { ApiService, ServerResponse } from 'astra';

const api = new ApiService('https://api.example.com', {});

export const modelApi = {
  getAll: async (): Promise<ServerResponse<Model[]>> => {
    return api.get<Model[]>('/models');
  },
};
```

## Using Repository with useDataState

```typescript
import { useDataState, StateType } from 'astra';
import { modelApi } from '../repo/modelApi';

function ListContainer() {
  const [appState, execute] = useDataState<Model[]>();

  useEffect(() => {
    execute(() => modelApi.getAll());
  }, []);

  if (appState.state === StateType.LOADING) {
    return <LoadingSpinner />;
  }

  if (appState.isError) {
    return <Alert severity="error">{appState.statusMessage}</Alert>;
  }

  return <Grid items={appState.data || []} />;
}
```

## Data Source Abstraction

Astra's Repository pattern supports multiple data source strategies:

### 1. HTTP API (Browser/Node)
```typescript
import { ApiService } from 'astra';

const api = new ApiService('https://api.example.com', { internal_server_error: 'Server unavailable' });

const modelApi = {
  list: () => api.get<Model[]>('/models'),
  get: (id) => api.get<Model>(`/models/${id}`),
};
```

### 2. Electron IPC (Desktop)
```typescript
// Consumer-managed IPC abstraction using IpcService
import { IpcService } from 'astra';

const ipc = new IpcService();

const modelApi = {
  list: () => ipc.invoke('resource:list'),
  get: (id) => ipc.invoke('resource:get', id),
};
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
  IDLE = 1000,
}
```

## Error Handling

### Repository Error Pattern
```typescript
export const modelApi = {
  getAll: async () => {
    const data = await api.get<Model[]>('/models');
    return data;
  },
};
```

ApiService already handles errors internally — repositories should not add redundant try/catch wrapping.

### UI Error Display
```typescript
const [appState, execute] = useDataState<Model[]>();

if (appState.isError) {
  return (
    <Alert severity="error">
      {appState.statusMessage}
    </Alert>
  );
}
```

## Composing Multiple API Calls

When a repository operation requires chaining multiple API calls, use the `ServerResponse.success()` and `ServerResponse.error()` static factory methods to construct the final response manually. ApiService wraps single calls automatically, but composed operations must be assembled explicitly.

```typescript
export const OrderRepo = {
  getFullOrder: async (orderId: string): Promise<ServerResponse<FullOrder>> => {
    const order = await api.get<Order>(`/orders/${orderId}`);
    if (order.isError) return order; // propagate error immediately

    const items = await api.get<OrderItem[]>(`/orders/${orderId}/items`);
    if (items.isError) return items;

    return ServerResponse.success({
      status: 200,
      statusMessage: 'OK',
      data: { ...order.data, items: items.data },
    });
  },
};
```

### When to use each pattern

| Scenario | Pattern |
|----------|---------|
| Single API call | `api.get()` / `api.post()` — ApiService wraps automatically |
| Chained calls (fetch A then B) | `ServerResponse.success()` / `ServerResponse.error()` to compose |
| Error propagation from intermediate call | Return the failing `ServerResponse` directly (already typed) |

Never construct a raw object with `{ isError, isSuccess, status, ... }` — always use the factory methods to ensure all fields are set correctly.

## Rules

- **Always use ServerResponse** for API returns
- **Use ApiService** for HTTP calls (WEB)
- **Use IpcService** for IPC calls (ELECTRON)
- **Return errors via ServerResponse** — do not use try/catch (ApiService handles that)
- **Return proper status codes** for all operations

## Related

- [Feature Structure](feature-structure.md) — Canonical feature folder layout
- [MVVM Pattern](mvvm-pattern.md)
- [State Management](state-management.md)
