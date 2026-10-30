# Repository Layer

---

## Overview

Dual-platform transport layer providing WEB (HTTP via `ApiService`) and ELECTRON (IPC via `IpcService`) communication abstractions. Both transports return `ServerResponse<T>` for uniform handling in ViewModel hooks — the `useDataState` hook and page components remain identical regardless of target platform.

The repository layer wraps external communication behind a uniform error-normalized contract. Feature repositories never interact with axios, `window.electronAPI`, or any transport directly — they depend on `ApiService` (WEB) or `IpcService` (ELECTRON) exclusively.

---

# Feature Summary

**ApiService** — WEB-target HTTP client wrapper class that implements the Repository pattern. Wraps axios to provide type-safe GET, POST, PUT, DELETE methods. Catches and normalizes all axios errors into `ServerResponse<T>` error responses. Injects localization strings into error messages. Request paths are resolved relative to a configured `baseUrl`.

**IpcService** — IPC communication wrapper for Electron targets. Provides `invoke`, `send`, and `receive` methods that abstract over `window.electronAPI` (exposed by Prana's preload context bridge). Normalizes all responses into `ServerResponse<T>`. Feature repositories for ELECTRON targets consume `IpcService` — never `window.electronAPI` directly.

**HttpStatusCode** — Typed numeric enum of HTTP status codes used throughout the repository layer, plus a `getStatusMessage` helper that resolves localized messages from a literal dictionary. Covers standard statuses (200, 201, 400, 401, 404, 500) plus `INTERNET_ERROR` (0) for network failures. `IDLE` (1000) is deprecated — use `StateCode.IDLE` from `state/AppState` for uninitialized state status.

**ServerResponse\<T\>** — Generic wrapper that standardizes all API responses into a success/error discriminated type with typed data and localized status messages. Every API call through Astra's repository layer returns `ServerResponse<T>` — never raw axios responses, thrown exceptions, or raw IPC results.

---

# Implementation Reference

## Status
Implemented (ApiService, HttpStatusCode, ServerResponse, IpcService)

## Source Files
| File | Role |
|------|------|
| `src/common/repo/ApiService.ts` | Class definition with private `request` method and four public HTTP methods |
| `src/common/repo/apiServiceFactory.ts` | Singleton factory with instance cache per `baseUrl` |
| `src/common/repo/IpcService.ts` | Class definition with `invoke`, `send`, `receive` methods |
| `src/common/repo/ServerResponse.ts` | Class definition with factory methods and return type |
| `src/common/repo/HttpStatusCode.ts` | Enum definition and `getStatusMessage` function |
| `src/common/repo/APITypes.ts` | Type definitions for success/error shapes (internal) |
| `src/common/repo/ApiService.test.ts` | Unit tests |
| `src/common/repo/index.ts` | Barrel re-export |
| `src/common/index.ts` | Upstream barrel re-export |
| `src/lib.ts` | Public entry point (via `src/common/index.ts` → `src/common/repo/index.ts`) |

---

# Public API

```typescript
class ApiService {
  constructor(
    baseUrl: string,
    literal: Record<string, string>,
    options?: { onError?: (error: unknown) => void }
  );

  get<T>(url: string, config?: AxiosRequestConfig): Promise<ServerResponse<T>>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ServerResponse<T>>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ServerResponse<T>>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ServerResponse<T>>;
}

function getApiService(
  baseUrl: string,
  literal: Record<string, string>,
  options?: { onError?: (error: unknown) => void }
): ApiService;

class IpcService {
  invoke<T>(channel: string, ...args: unknown[]): Promise<ServerResponse<T>>;
  send(channel: string, ...args: unknown[]): void;
  receive<T>(channel: string, callback: (data: T) => void): () => void;
}

enum HttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  INTERNET_ERROR = 0,
  /** @deprecated Use StateCode.IDLE from state/AppState instead. */
  IDLE = 1000,
}

function getStatusMessage(
  status: HttpStatusCode,
  literal: Record<string, string>
): string;

class ServerResponse<T> {
  isError: boolean;
  isSuccess: boolean;
  status: HttpStatusCode;
  statusMessage: string;
  data?: T;

  static success<T>(success: ResponseSuccess<T>): ServerResponse<T>;
  static error<T>(error: ResponseError): ServerResponse<T>;
}
```

### Internal Types (not part of public API — from `APITypes.ts`)

```typescript
type ResponseSuccess<T> = {
  status: HttpStatusCode;
  statusMessage: string;
  data: T;
};

type ResponseError = {
  status: HttpStatusCode;
  statusMessage: string;
};
```

---

# Architecture Mapping

| Pattern | Feature Usage | Transport | Reason |
|---------|---------------|-----------|--------|
| Platform Transport | WEB-specific service abstraction over HTTP | WEB | Dual-platform architecture: `ApiService` = WEB, `IpcService` = ELECTRON — ViewModel unchanged |
| Facade | Wraps axios behind a simplified interface with four HTTP methods | WEB | Consumers never interact with axios directly — `dependency-safety.md` |
| Facade | Simplifies three IPC patterns (request/response, fire-and-forget, pub/sub) into three methods | ELECTRON | Repository layer has one IPC contract regardless of channel complexity |
| Adapter | Normalizes axios error types into uniform `ServerResponse.error` | WEB | Repository layer has one error contract regardless of transport |
| Adapter | Wraps `window.electronAPI` behind a uniform interface with error normalization | ELECTRON | Consumers never interact with Electron runtime directly — `runtime-boundary.md` |
| Singleton Factory | `getApiService` caches one instance per `baseUrl` | WEB | Prevents duplicate connections and config for the same endpoint |
| Generic Method | Each method is generic `<T>` over response data type | WEB | Type-safe responses without per-endpoint subclasses |
| Template Method | Private `request()` defines the request lifecycle; public methods fill in HTTP verb | WEB | Single error handling path — reduce duplication |
| Sum Type | `ServerResponse<T>` models success/error as a single type discriminated by boolean flags | Both | Errors are values, not exceptions — aligns with `dependency-safety.md` error handling principle |
| Factory Method | `ServerResponse.success()` / `ServerResponse.error()` are static factories | Both | Encapsulates construction logic; private constructor prevents invalid instances |
| Generic Type Parameter | `<T>` preserves type safety of response payload | Both | Consumers receive typed data without casting |
| Value Object | Instance fields are publicly readable, not mutable after construction | Both | Immutable-by-contract pattern; no setters exposed |
| Numeric Enum | `HttpStatusCode` is a `const enum`-like numeric enum | Both | Compile-time constant values; switch-case optimization; zero runtime overhead |
| Switch Mapping | `getStatusMessage` uses exhaustive switch over enum values | Both | Guarantees all enum variants are handled; default clause provides fallback |
| Localization Binding | Status messages resolved from `Record<string, string>` literal map | Both | Aligns with `localization.md` — no hardcoded strings in repository layer |
| Synthetic Codes | `INTERNET_ERROR` (0) and `IDLE` (1000) extend HTTP spec | Both | Network failures and uninitialized state are first-class status values |
| Error Normalization | Catches all IPC errors into `ServerResponse.error` | ELECTRON | Repository layer has one error contract regardless of transport — mirrors `ApiService` pattern |
| Return Value Normalization | `invoke` always returns `ServerResponse<T>` | ELECTRON | Enables `useDataState.execute()` to process responses identically for WEB and ELECTRON |
| Runtime Boundary | Consumes `window.electronAPI` but does not own it | ELECTRON | `runtime-boundary.md`: Astra provides service abstractions, Prana owns runtime infrastructure |
| MVVM Wiring | ViewModel transport | Repository feeds `useDataState` via `execute()`; see `mvvm-wiring.md` for full wiring example | Both |

---

# Shared Types

## HttpStatusCode

Typed numeric enum of HTTP status codes used throughout the repository layer.

### Enum Values
| Status | Value | Domain | Semantic |
|--------|-------|--------|----------|
| `SUCCESS` | 200 | HTTP | Request succeeded |
| `CREATED` | 201 | HTTP | Resource created |
| `BAD_REQUEST` | 400 | HTTP | Invalid request |
| `UNAUTHORIZED` | 401 | HTTP | Authentication failure |
| `NOT_FOUND` | 404 | HTTP | Resource missing |
| `INTERNAL_SERVER_ERROR` | 500 | HTTP | Server failure |
| `INTERNET_ERROR` | 0 | Synthetic | Network connectivity failure |
| `IDLE` (deprecated) | 1000 | Synthetic | Uninitialized state placeholder — use `StateCode.IDLE` instead |

### Literal Key Contract

Expected `literal` keys consumed by `getStatusMessage`:

| Enum Value | Literal Key |
|------------|-------------|
| `SUCCESS` | `success_message` |
| `CREATED` | `created_message` |
| `BAD_REQUEST` | `bad_request_message` |
| `UNAUTHORIZED` | `unauthorized_message` |
| `NOT_FOUND` | `not_found_message` |
| `INTERNAL_SERVER_ERROR` | `internal_server_error` |
| `INTERNET_ERROR` | `internet_error` |
| `IDLE` (deprecated) | `idle_message` |
| (default / unknown) | `''` (empty string) |

### Integration Flow

```
HttpStatusCode enum
  ↓ consumed by
ServerResponse.status: HttpStatusCode
  ↓ consumed by
ApiService.request() — maps axios response/error status → HttpStatusCode
IpcService.invoke() — maps IPC response/error status → HttpStatusCode
  ↓ consumed by
useDataState → AppState.status
  ↓ consumed by
AppStateHandler / UI — renders via getStatusMessage(literal)
```

## ServerResponse\<T\>

Generic wrapper that standardizes all API responses into a success/error discriminated type.

### State Model
| State | Condition | `isError` | `isSuccess` | `data` |
|-------|-----------|-----------|-------------|--------|
| Success | After `success()` factory | `false` | `true` | `T` |
| Error | After `error()` factory | `true` | `false` | `undefined` |
| Uninitialized | Default instance (never happens — constructor is private) | `false` | `false` | `undefined` |

### Integration Flow
```
ApiService.request() / IpcService.invoke() → ServerResponse<T>
  ↓
ViewModel hook (useDataState) receives ServerResponse<T>
  ↓
AppState<T>.data / AppState<T>.status / AppState<T>.isError populated from ServerResponse
  ↓
Page component reads AppState for conditional rendering
```

---

# WEB Transport: ApiService

## Technical Structure

### Services table
| Service | File Path | Purpose | Dependencies |
|---------|-----------|---------|--------------|
| `ApiService.request()` | `src/common/repo/ApiService.ts:23` | Private — executes axios call, normalizes response/error | `axios`, `ServerResponse`, `HttpStatusCode`, `APITypes` |
| `ApiService.get()` | `src/common/repo/ApiService.ts:59` | Public GET request | `request()` |
| `ApiService.post()` | `src/common/repo/ApiService.ts:70` | Public POST request | `request()` |
| `ApiService.put()` | `src/common/repo/ApiService.ts:83` | Public PUT request | `request()` |
| `ApiService.delete()` | `src/common/repo/ApiService.ts:96` | Public DELETE request | `request()` |
| `getApiService()` | `src/common/repo/apiServiceFactory.ts:7` | Cached singleton factory | `ApiService` |

### State Model table
| State | Condition | Fields |
|-------|-----------|--------|
| Initialized | After constructor | `baseUrl`, `literal` set |
| In-flight | During `request()` | Promise pending |
| Resolved (success) | Axios 2xx response | Returns `ServerResponse.success<T>` |
| Resolved (error) | Axios error or non-axios exception | Returns `ServerResponse.error<T>` |

### Internal Enum
```typescript
enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
```

## Integration Design

```
Consumer (feature repo)
  ↓ calls
ApiService.get<T>(url) / post<T>(url, data) / put<T>(url, data) / delete<T>(url)
  ↓ delegates to
ApiService.request<T>(config)
  ↓ uses
axios(config)
  ↓ axios resolves
2xx → ServerResponse.success({ status, statusMessage, data })
4xx/5xx → ServerResponse.error({ status, statusMessage })
Network error → ServerResponse.error({ status: INTERNET_ERROR, statusMessage })
Non-axios error → ServerResponse.error({ status: INTERNAL_SERVER_ERROR, statusMessage })
  ↓ returns
Promise<ServerResponse<T>>  →  consumer pattern-matches on isSuccess/isError
```

URL construction: `` `${this.baseUrl}/${url}` `` — baseUrl and url are concatenated with a single slash separator.

---

# ELECTRON Transport: IpcService

## Technical Structure

### Services table
| Service | File Path | Purpose | Dependencies |
|---------|-----------|---------|--------------|
| `IpcService.invoke()` | `src/common/repo/IpcService.ts` | Request/response IPC — calls handler and returns typed result | `window.electronAPI.invoke`, `ServerResponse`, `HttpStatusCode` |
| `IpcService.send()` | `src/common/repo/IpcService.ts` | Fire-and-forget IPC — sends message, no response expected | `window.electronAPI.send` |
| `IpcService.receive()` | `src/common/repo/IpcService.ts` | Pub/sub IPC — listens for push messages from main process | `window.electronAPI.receive` |

### State Model table
| State | Condition | Fields |
|-------|-----------|--------|
| Initialized | After constructor | No configuration — ready to invoke |
| In-flight | During `invoke()` | Promise pending |
| Resolved (success) | IPC handler returns success | Returns `ServerResponse.success<T>` |
| Resolved (error) | IPC handler returns error or throws | Returns `ServerResponse.error<T>` |
| Sent (fire-and-forget) | After `send()` completes | Returns `void` — no response tracking |
| Listening | After `receive()` registers callback | Listener active — returns unsubscribe function |

## Integration Design

### invoke
Calls `window.electronAPI.invoke(channel, ...args)`. A `ServerResponse` instance is passed through; other values are wrapped as success. Invoke failures are normalized unless `onError` itself throws.

### send
One-way message to the main process. No response expected. Errors are silently discarded — `send` does not return a value and cannot surface transport errors.

### receive
Listen for messages pushed from the main process. Returns an unsubscribe function. Caller is responsible for calling `unsubscribe()` in component teardown.

### Request Flow
```
Consumer (feature repo — ELECTRON target)
  ↓ calls
IpcService.invoke<T>(channel, ...args)
  ↓ delegates to
window.electronAPI.invoke(channel, ...args)
  ↓ Prana preload bridge forwards
ipcRenderer.invoke(channel, ...args)
  ↓ main process handler resolves
Handler returns data or throws
  ↓ IpcService normalizes
Success → ServerResponse.success({ status, statusMessage, data })
Error   → ServerResponse.error({ status, statusMessage })
Throw   → ServerResponse.error({ status: INTERNAL_SERVER_ERROR, statusMessage })
  ↓ returns
Promise<ServerResponse<T>>  →  consumer pattern-matches on isSuccess/isError
```

### Push Event Integration
```
Main process emits on channel
  ↓
window.electronAPI.receive(channel, callback)
  ↓
IpcService.receive() registers listener
  ↓
Callback fires with data  →  consumer calls setAppState() from useDataState
```

---

# Error Handling

| Error Type | Cause | System Response | Source | Consumer Response |
|------------|-------|-----------------|--------|-------------------|
| Axios HTTP error | 4xx/5xx response | `ServerResponse.error` with actual HTTP status code | ApiService | Check `isError`, display `statusMessage` |
| Axios network error | No response received (DNS, timeout, CORS) | `ServerResponse.error` with `INTERNET_ERROR` (0) | ApiService | Check `isError`, display `statusMessage` |
| Non-axios exception | Code bug, runtime error | `ServerResponse.error` with `INTERNAL_SERVER_ERROR` (500) | ApiService | Check `isError`, log error detail from console |
| Missing literal key | `this.literal` missing expected key | `ServerResponse.error` with `undefined` statusMessage | ApiService | Ensure all required keys present in literal map |
| Empty baseUrl | Constructor called with `""` | Request URL becomes `"/path"` (absolute) | ApiService | Valid use case — absolute paths allowed |
| Trailing slash in baseUrl | Constructor called with `"https://api.com/"` | Double slash possible: `"https://api.com//path"` | ApiService | Strip trailing slash before passing to constructor |
| IPC handler returns error | Handler returns `ServerResponse.error` | `ServerResponse.error` with status from IPC response | IpcService | Check `isError`, display `statusMessage` |
| IPC handler throws | Handler exception | `ServerResponse.error` with `INTERNAL_SERVER_ERROR` (500) | IpcService | Check `isError`, display `statusMessage` |
| Communication failure | IPC channel not registered, timeout | `ServerResponse.error` with `INTERNAL_SERVER_ERROR` (500) | IpcService | Check `isError`, display `statusMessage` |
| `window.electronAPI` unavailable | Non-Electron context or preload not loaded | `invoke`: `ServerResponse.error` with `INTERNAL_SERVER_ERROR` (500); `send`: silently discarded; `receive`: returns no-op unsubscribe | IpcService | Guard by checking `isError` |
| `send` throws | Transport error on fire-and-forget | Silently discarded | IpcService | Use `invoke` instead if acknowledgment required |
| Callback in `receive` throws | Consumer callback error | Exception propagates to the caller; IpcService does not catch callback errors | IpcService | Wrap callback in try/catch |
| Missing literal key (getStatusMessage) | `getStatusMessage` called with key not in `literal` map | Returns the literal value for the matching key, or `''` (empty string) for unknown codes | HttpStatusCode | Ensure status keys are present for expected codes |
| Unknown numeric value | Caller casts arbitrary number to `HttpStatusCode` | Compiles — no runtime validation | HttpStatusCode | Always reference enum members by name |
| `IDLE` (1000) in HTTP context | Code reaches an API response parser | Treated as `IDLE` — no match for any real HTTP response | HttpStatusCode | Safe — `IDLE` only used in state management internal paths |
| Missing data in success | `success()` called without data | Instance created with `data: undefined` | ServerResponse | Check `data` with optional chaining before access |
| Type mismatch on error | `error()` called but consumer treats `data` as `T` | `data` is `undefined` at runtime | ServerResponse | Check `isError` before accessing `data` |
| Non-HttpStatusCode | Caller passes invalid numeric value as status | Compiles but runtime status is unexpected | ServerResponse | Use `HttpStatusCode` enum values only |
| Uninitialized usage | `ServerResponse` used outside its lifecycle | Private constructor prevents direct instantiation | ServerResponse | Always use factory methods |

---

# Non-Responsibilities

- Astra does not manage WebSocket connections, SSE, or any real-time protocol beyond request-response
- Astra does not implement caching; caching is the responsibility of the consumer
- Astra does not provide request retry logic; retry is the responsibility of the consumer or a separate middleware layer
- Astra does not manage authentication tokens; authentication is handled by Prana
- `IpcService` does not register `ipcMain.handle` handlers — that belongs to the main process (Prana)
- `IpcService` does not expose `contextBridge` or `ipcRenderer` — those are runtime infrastructure owned by Prana
- `IpcService` does not catch or suppress callback errors from `receive` — caller is responsible for defensive callbacks

---

# Non-Functional Requirements

| Requirement | Constraint |
|-------------|------------|
| Error Location (ApiService) | Error passed to `options.onError?.(error)` callback if provided — caller-controlled monitoring hook; no default logging |
| Error Location (IpcService) | All invoke errors caught internally — no uncaught IPC exceptions propagate |
| Thread Safety | Single-threaded (JS); concurrent calls create independent promise chains |
| Bundle Size (ApiService) | Depends on `axios` transitive tree — must be audited per `dependency-safety.md` |
| Bundle Size (IpcService) | No external dependencies beyond `ServerResponse` and `HttpStatusCode` |
| Bundle Size (HttpStatusCode) | Minimal — single enum (8 members) + one switch function |
| Bundle Size (ServerResponse) | No external dependencies beyond `HttpStatusCode` enum; negligible |
| Factory Cache (ApiService) | `Map<string, ApiService>` grows unbounded per unique `baseUrl` — acceptable for typical app (1-3 endpoints); repeated calls with the same `baseUrl` return the cached instance and **ignore** updated `literal` or `options` arguments |
| Type Safety (ApiService) | All methods generic `<T>`; no runtime type enforcement on response data |
| Type Safety (IpcService) | `invoke` is generic `<T>`; no runtime type enforcement on response data |
| Type Safety (HttpStatusCode) | Enum members are the only valid values at compile time; no runtime validation |
| Type Safety (ServerResponse) | Generic `<T>` provides compile-time type checking; runtime `data` may be `undefined` |
| Memory (ServerResponse) | No instance pooling; each factory call allocates a new `ServerResponse<T>` — acceptable for request-scoped usage |
| Runtime Isolation (IpcService) | No Electron imports — consumes `window.electronAPI` only |
| Lifecycle (IpcService) | `receive` listeners must be cleaned up by consumer via returned unsubscribe function |
| Maintainability (HttpStatusCode) | Adding a new status requires: enum member, `getStatusMessage` case, literal key contract |
| Performance (HttpStatusCode) | Enum switch is O(1) — no allocations in `getStatusMessage` |
| Error Contract (ServerResponse) | Request errors are returned unless an `onError` callback throws. |

---

# Feature Requirements Traceability

| Feature Spec Requirement | Technical Document Section |
|---|---|
| `HttpStatusCode` enum meanings | Shared Types → HttpStatusCode → Enum Values |
| `getStatusMessage` function | Public API → `getStatusMessage`; Shared Types → Literal Key Contract |
| `ServerResponse` success/error factories | Public API → `ServerResponse`; Shared Types → `ServerResponse<T>` |
| `ApiService` get/post/put/delete methods | Public API → `ApiService`; WEB Transport: ApiService → Technical Structure |
| Error normalization table (4xx/5xx, network, non-axios) | Error Handling (full table); WEB Transport → Integration Design |
| `getApiService` singleton factory | Public API → `getApiService`; WEB Transport → Technical Structure → Services table; Architecture Mapping → Singleton Factory |
| Usage in feature repositories | Integration Design diagrams for both WEB and ELECTRON transports |
| Non-Responsibilities | Non-Responsibilities section |

---

# Architecture Compliance Review

## Applied Patterns
- **Repository Abstraction**: `repository.md` requires `ApiService` for HTTP calls — compliant
- **Platform Transport**: `ApiService` is the WEB transport in dual-platform architecture — mirrors `IpcService` for ELECTRON per `target-consistency.md`
- **Service Abstraction**: `runtime-boundary.md` requires IpcService as the sole abstraction over Electron IPC — compliant
- **Repository Isolation**: `repository-isolation.md` mandates repositories use Astra Services, never runtime APIs — compliant
- **Target Consistency**: `ServerResponse<T>` return type identical across transports — ViewModel hooks agnostic of transport per `target-consistency.md`
- **Stateless**: `ApiService` holds only configuration (`baseUrl`, `literal`) — no mutable request state — compliant with `stateless-ui.md`
- **Error Normalization**: All axios errors surface as `ServerResponse.error` — aligns with `dependency-safety.md` value error pattern; IpcService mirrors this pattern
- **Localization**: Error messages use `this.literal` dictionary — compliant with `localization.md`
- **Typed Enum over Magic Numbers**: `repository.md` explicitly requires proper status codes — compliant
- **Sum Type / Result Object**: `repository.md` mandates `ServerResponse` for all API returns — fully compliant
- **Value Error Handling**: `dependency-safety.md` prefers returned errors over exceptions — compliant
- **Public API Stability**: Exported through barrel (`index.ts` → `common/index.ts` → `lib.ts`) — compliant with `public-api-stability.md`

## Risks
- `onError?.(error)` passes raw caught errors to the consumer callback — consumers must avoid logging sensitive request details (credentials, tokens) in production monitoring hooks
- No request cancellation (AbortController) — in-flight requests on unmounted components may cause state updates on unmounted component
- No interceptors — consumers who need auth token injection, request/response logging, or CSRF tokens must extend or wrap ApiService
- Base URL concatenation with `/${url}` always inserts a leading slash — may produce `https://api.com//path` if baseUrl ends with `/`
- `send` silently discarding errors — consumers may believe a message was delivered when it was not
- `receive` not catching callback errors — unhandled exceptions in callbacks propagate to the event loop
- `window.electronAPI` type declaration required in consumer project — missing types cause silent failures
- No connection state tracking — `invoke` failures from disconnected IPC indistinguishable from handler errors
- `IDLE` (1000) in `HttpStatusCode` is `@deprecated` — `StateCode.IDLE` is the canonical initial status; `HttpStatusCode.IDLE` retained for backward compatibility only
- No `isError`/`isClientError`/`isServerError` classification helpers — consumers must manually interpret ranges
- Missing 3xx redirect codes — not handled, may cause confusion if redirect responses reach the enum
- Internal types `ResponseSuccess<T>` and `ResponseError` (in `APITypes.ts`) are not exported — consumers use factory methods only
- Private constructor pattern prevents extension via subclassing — intentional, but limits future polymorphic response types
- `isSuccess` and `isError` are independent booleans (not a discriminated union) — both could theoretically be set to the same value, though factory methods prevent this

## Gaps
- No AbortController / signal support for request cancellation
- No request/response interceptors
- No timeout configuration exposed (axios default)
- No retry logic
- No file download progress (blob streaming)
- No dynamic base URL per-request (tenancy)
- No `invoke` timeout — hung IPC handlers never resolve
- No reconnection strategy for dropped IPC channels
- No event emitter pattern for `receive` lifecycle (beyond basic unsubscribe)
- No logging or monitoring hooks
- No 3xx status codes (redirect handling)
- No `RATE_LIMITED` (429) or `DUPLICATE_ENTRY` (409) business-level codes
- No machine-readable error code alongside human-readable message
- No `.map()` or `.flatMap()` chaining methods (noted in feature spec as future enhancement)
- No response metadata (timestamp, requestId)
- No payload validation or schema parsing
- No pagination metadata carrier

## Cross-References

- `mvvm-wiring.md` — how repositories are consumed in the MVVM pattern (ViewModel calls repository via `useDataState.execute()`)
- `use-data-state.md` — how `ServerResponse` maps to `AppState` on `execute()` completion
- `state-management.md` — `AppState` contract that `ServerResponse` fields (`status`, `isError`, `isSuccess`, `data`) populate

## Ownership

Ownership boundaries per **boilerplate-ownership.md** invariant:

| Component | Owner | Rationale |
|-----------|-------|-----------|
| `ApiService` | Astra | Generic HTTP transport — every application needs it; no business knowledge |
| `IpcService` | Astra | Generic IPC transport — every Electron target needs it; no business knowledge |
| `ServerResponse` | Astra | Shared result type — both transports use it; boilerplate if duplicated |
| `HttpStatusCode` | Astra | Shared enum — both transports reference it; boilerplate if duplicated |
| `getStatusMessage` | Astra | Shared helper — localized message resolution from enum; generic utility |
| `window.electronAPI` | Prana | Runtime infrastructure — preload `contextBridge` exposure owned by Prana |
| IPC runtime (ipcMain, ipcRenderer) | Prana | Runtime infrastructure — Prana provides the Electron IPC substrate |
| preload contextBridge | Prana | Runtime boundary — Prana controls what channels are exposed |
| axios interceptors | Application | Application-specific — auth tokens, CSRF headers, logging |
| auth tokens | Application | Business/security concern — token format, storage, refresh |
| API base URLs | Application | Environment-specific — known only to the application |
| localization literals | Application | Application-specific — keys and values vary per app |

---

# Module Map

| Module | File Path | Exports | Imports From |
|--------|-----------|---------|--------------|
| `HttpStatusCode` | `src/common/state/HttpStatusCode.ts` | `HttpStatusCode` (enum), `getStatusMessage` (function) | `./StateCode` |
| `StateCode` | `src/common/state/StateCode.ts` | `StateCode` (enum) | none |
| `ApiService` | `src/common/repo/ApiService.ts` | `ApiService` (class) | `axios`, `./ServerResponse`, `../state/HttpStatusCode`, `./APITypes` (internal) |
| `apiServiceFactory` | `src/common/repo/apiServiceFactory.ts` | `getApiService` (function) | `./ApiService` |
| `IpcService` | `src/common/repo/IpcService.ts` | `IpcService` (class) | `./ServerResponse`, `../state/HttpStatusCode` |
| `ServerResponse` | `src/common/repo/ServerResponse.ts` | `ServerResponse` (class) | `./APITypes` (internal), `../state/HttpStatusCode` |
| `APITypes` | `src/common/repo/APITypes.ts` | `ResponseSuccess<T>`, `ResponseError` (internal — not re-exported via barrel) | `../state/HttpStatusCode` |
| `index` (repo) | `src/common/repo/index.ts` | `ApiService`, `getApiService`, `IpcService`, `ServerResponse`, `ITransportService`, `Platform` | `./ApiService`, `./apiServiceFactory`, `./IpcService`, `./ServerResponse`, `./types` |
| `index` (common) | `src/common/index.ts` | Re-exports common modules | `./repo`, `./state`, `./hooks`, `./components/organisms` |
| `lib` | `src/lib.ts` | Public entry point — explicit named exports only | Direct source paths (`./common/repo/*`, `./common/state/*`, `./common/hooks/*`, `./common/components/organisms/*`) |

---

# Final Rule

`ApiService` is the only layer that touches axios. It is the WEB transport in Astra's dual-platform architecture — for ELECTRON targets, feature repositories use `IpcService` instead. Feature repositories must never import axios or `window.electronAPI` directly — they depend on `ApiService` or `IpcService` methods exclusively. All errors must be caught and returned as `ServerResponse.error`. Never let an axios exception or IPC exception propagate uncaught beyond the service layer.

Magic number status codes are forbidden. All status comparisons and assignments must use `HttpStatusCode` enum members. Every status code must have a corresponding literal key in the localization map. Synthetic codes `INTERNET_ERROR` (0) and `IDLE` (1000) are reserved for network-layer and state-management-layer respectively — never emit them from business logic.

Every API interaction must go through `ServerResponse<T>`. Raw axios responses and raw IPC results must never escape the service layer. Consumers must always check `isError` before accessing `data`. Errors are values — never catch and rethrow outside the repository layer.

The `invoke` contract on `IpcService` must mirror `ApiService`'s method signature to maintain target consistency — ViewModel hooks remain identical regardless of transport.

---

# Authorization

Astra provides the transport abstractions; authentication and authorization are outside Astra's scope. Each transport has distinct security characteristics:

- **ApiService** (WEB): HTTP auth via axios interceptors (token injection, CSRF tokens) — consumer-managed at the application layer. Astra does not ship or configure interceptors; the application injects them at setup time.
- **IpcService** (ELECTRON): IPC channel access governed by Prana's preload `contextBridge` exposure — Prana-managed runtime boundary. Astra consumes whatever channels the bridge exposes; it does not own or configure the bridge.
- **Both**: Astra provides `ApiService` and `IpcService` as pure transport abstractions. Authentication state, token lifecycle, channel whitelisting, and authorization enforcement are the responsibility of the consumer (application) or runtime owner (Prana).
