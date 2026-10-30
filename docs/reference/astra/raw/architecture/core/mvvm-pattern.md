# Architecture: MVVM Pattern

Astra implements **MVVM (Model-View-ViewModel)** pattern for all UI implementations. It provides the hooks, types, and components needed to build feature modules with clean separation of concerns.

## State Flow

```
INIT → LOADING → COMPLETED (or ERROR)
```

| State | Description | Code |
|-------|-------------|------|
| `INIT` | Initial state, no data loaded | `StateType.INIT = 0` |
| `LOADING` | Async operation in progress | `StateType.LOADING = 1` |
| `COMPLETED` | Operation succeeded with data | `StateType.COMPLETED = 2` |
| `COMPLETED` (isError: true) | Operation failed | `appState.isError === true` |

## useDataState Pattern

Astra's `useDataState` hook centralizes async data handling. It returns a `[appState, execute, setAppState]` tuple. In most ViewModel code only `appState` and `execute` are needed. See [Hooks](hooks.md) for the full API including when to use `setAppState`.

```typescript
import { useDataState, StateType, AppState } from 'astra';

const [appState, execute] = useDataState<Model[]>();

useEffect(() => {
  execute(() => modelApi.getAll());
}, []);

if (appState.state === StateType.LOADING) return <Loading />;
if (appState.isError) return <Error message={appState.statusMessage} />;
return <List data={appState.data} />;
```

## AppState Interface

```typescript
interface AppState<T> {
  state: StateType;
  isError: boolean;
  isSuccess: boolean;
  status: HttpStatusCode;
  statusMessage: string;
  data: T | null;
}
```

## Feature Module Structure

Astra defines a canonical feature folder structure for all consumers. See [Feature Structure](feature-structure.md) for the authoritative reference.

The MVVM pattern maps to the canonical structure as follows:

| MVVM Layer | Canonical Location | Implementation |
|------------|-------------------|----------------|
| **Model** | `model/` | TypeScript interfaces and DTOs |
| **Repository** | `repo/` | Data access via ApiService or IPC |
| **ViewModel** | `hooks/` | Custom React hooks wrapping `useDataState` |
| **View** | `view/components/` | Presentational components (props-only) |
| **Container** | `view/pages/` | Stateful page components composing hooks + views |

## Conceptual Pattern

The following examples illustrate the MVVM layers conceptually. In practice, the ViewModel is a custom hook in `hooks/`, the Container is the page component in `view/pages/`, and the View is a presentational component in `view/components/`.

### Container (maps to `view/pages/<Feature>Page.tsx`)

```typescript
import { useEffect } from 'react';
import { useFeature } from '../hooks/useFeature';

export function ListContainer() {
  const { appState, load } = useFeature();

  useEffect(() => { load(); }, []);

  // Uses AppStateHandler for standardized state UI
  return <AppStateHandler appState={appState} ... />;
}
```

### ViewModel (maps to `hooks/use<Feature>.ts`)

```typescript
import { useDataState, AppState, StateType } from 'astra';

export const useFeature = () => {
  const [appState, execute] = useDataState<Model[]>();

  const load = () => execute(() => modelApi.getAll());

  return { appState, load };
};
```

### View (maps to `view/components/<Name>Component.tsx`)

```typescript
import { AppState, StateType } from 'astra';

interface Props {
  state: AppState<Model[]>;
}

export function ListView({ state }: Props) {
  if (state.state === StateType.LOADING) return <LoadingSpinner />;
  if (state.isError) return <ErrorMessage message={state.statusMessage} />;

  return (
    <ul>
      {state.data?.map(item => <ItemCard key={item.id} item={item} />)}
    </ul>
  );
}
```

## Integration with Electron

Astra's MVVM pattern works with any data source. For Electron apps, repositories use IpcService instead of HTTP:

```typescript
// repo/resourceIpc.ts — Electron repository using IpcService
import { IpcService, ServerResponse } from 'astra';

const ipc = new IpcService();

export const resourceIpc = {
  list: async (): Promise<ServerResponse<Resource[]>> => {
    return ipc.invoke('resource:list');
  },
};

// hooks/useResources.ts — ViewModel wraps the IPC repository
export const useResources = () => {
  const [state, execute] = useDataState<Resource[]>();
  const load = () => execute(() => resourceIpc.list());
  return { state, load };
};
```

## Rules

- **Always use useDataState** for async operations
- **Never use useState directly** for data (use useDataState)
- **Follow the canonical feature structure** in [Feature Structure](feature-structure.md)
- **ViewModels are hooks** — implement in `hooks/use<Feature>.ts`, not as JSX components
- **Pages are stateful** — `view/pages/` is the only layer that composes hooks with UI
- **Components are stateless** — `view/components/` receives props only, no data fetching
- **Never hardcode strings** — use Prati's localization system if your consumer app requires i18n
- **Never hardcode colors** — use Prati's theme tokens if your consumer app uses Prati theming

## Related

- [Feature Structure](feature-structure.md) — Canonical feature folder layout
- [State Management](state-management.md)
- [Repository](repository.md)
- Prati Documentation — theming, localization
