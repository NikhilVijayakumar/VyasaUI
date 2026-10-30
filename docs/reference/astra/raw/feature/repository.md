# Repository Layer (WEB)

HTTP client and response normalization for WEB targets. All HTTP access in Astra goes through this layer — feature repositories never import axios directly.

For ELECTRON targets, see [ipc-service.md](./ipc-service.md).

## `HttpStatusCode`

| Value | Name | Meaning |
|-------|------|---------|
| 200 | SUCCESS | Request succeeded |
| 201 | CREATED | Resource created |
| 400 | BAD_REQUEST | Client error — invalid request |
| 401 | UNAUTHORIZED | Authentication required |
| 404 | NOT_FOUND | Resource not found |
| 500 | INTERNAL_SERVER_ERROR | Server-side failure |
| 0 | INTERNET_ERROR | No network / connection refused |

`HttpStatusCode.IDLE` remains as a deprecated alias; use `StateCode.IDLE` for pre-HTTP status.

### `getStatusMessage`

Maps an `HttpStatusCode` to a localized error string:

- Input: an `HttpStatusCode` value and a `literal` record (key → string map)
- Output: the matching string from `literal`; unknown codes return an empty string, while a missing key for a known code can return `undefined`.
- Consumers may call it to display messages; `ApiService` does not call this helper internally.

## `ServerResponse`

Normalized return type from all `ApiService` methods. Constructed via two factory methods:

- **success**: accepts `status`, `statusMessage`, and `data` — sets `isSuccess = true`, `isError = false`
- **error**: accepts `status` and `statusMessage` — sets `isError = true`, `isSuccess = false`

Fields mirror `AppState` — `useDataState.execute()` maps a `ServerResponse` directly into `AppState` on completion.

## `ApiService`

Axios-based HTTP client. Requires `baseUrl` (string) and a localization `literal` (key → string map).

| Method | Parameters | Returns |
|--------|------------|---------|
| `get` | `url`, optional `config` | Promise of ServerResponse |
| `post` | `url`, optional `data`, optional `config` | Promise of ServerResponse |
| `put` | `url`, optional `data`, optional `config` | Promise of ServerResponse |
| `delete` | `url`, optional `config` | Promise of ServerResponse |

URL construction: `baseUrl + "/" + url` — strip trailing slash from `baseUrl`. No normalization is applied; a trailing slash on `baseUrl` produces a double-slash URL; whether it succeeds depends on the server.

**Error normalization**: Request failures are normalized unless the optional `onError` callback itself throws:

| Cause | `status` in response |
|-------|----------------------|
| Axios HTTP error (4xx/5xx) | Actual HTTP status code |
| Network failure / no response | `HttpStatusCode.INTERNET_ERROR` (0) |
| Non-axios exception | `HttpStatusCode.INTERNAL_SERVER_ERROR` (500) |

## `getApiService` — singleton factory

Returns a cached `ApiService` keyed by `baseUrl`. Import from `astra`. Safe to call at module scope inside a repository — repeated calls with the same `baseUrl` return the same instance.

## Usage in a Feature Repository

```
api = getApiService(API_BASE_URL, literal)

userRepository:
  getUser(id)          → api.get("users/" + id)
  updateUser(id, data) → api.put("users/" + id, data)
```

`API_BASE_URL` and `literal` are application-level constants — not repository concerns.

`RequestConfig` — optional per-request options (headers, timeout, abort signal, etc.) passed through to the underlying HTTP client.

## Non-Responsibilities

The Repository layer does not:

- manage React state — that is `useDataState`
- render loading/error/success UI — that is `AppStateHandler`
- decide when to fetch — that is the ViewModel (`useEffect` in a hook)
- re-throw exceptions — `ApiService` catches all errors and normalizes them into `ServerResponse`

## See Also

- [ipc-service.md](./ipc-service.md) — IPC service abstraction for ELECTRON targets
- [state-management.md](./state-management.md) — `AppState` contract that `ServerResponse` maps into
- [use-data-state.md](./use-data-state.md) — hook that calls the repository and updates `AppState`
