# FileViewerRouter: Feature Technical

## 1. Technical Overview

`FileViewerRouter` (`src/common/components/organisms/FileViewerRouter.tsx`) is a smart routing organism that dispatches file content to the correct sub-viewer molecule based on file extension. It supports CSV (→ `CsvViewer`), Markdown/Text (→ `MdViewer`), Images (→ `ImageViewer`), and JSON/JSONL (→ `JsonViewer`) file types. Unsupported extensions render a localized fallback message.

The component is stateless — routing is a deterministic function of `fileName`. Extension extraction uses `fileName.split(".").pop()?.toLowerCase()`, matched via `switch-case`. `fileEncoding` and `mimeType` metadata are only forwarded to `ImageViewer`; other viewers ignore them. The fallback UI uses the `useLanguage` hook for localized text.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Stateless UI** (invariant) | No `useState` or `useEffect` — routing is a pure function of props |
| **Atomic Hierarchy** (component-tiers.md) | Organism — composes molecules (`CsvViewer`, `MdViewer`, `ImageViewer`, `JsonViewer`) and atoms (`Typography`) |
| **Theme Sovereignty** (theming.md) | Fallback UI uses `spacing.lg`, `palette.text.secondary` |
| **MVVM Separation** (mvvm-pattern.md) | Pure View — no data fetching, no ViewModel, no business logic beyond extension extraction |
| **Localization** (localization.md) | Uses `useLanguage` for fallback keys `viewer.unsupported` and `viewer.extension` |
| **Dependency Safety** (dependencies.md) | Imports only known sub-viewer molecules and MUI primitives |
| **Platform Neutrality** (platform-abstraction.md) | Pure React + MUI — no platform-specific APIs |

## 3. Data Flow

```
Parent component
  │
  ├─► fileName: string           (required — for extension extraction)
  ├─► fileContent?: string       (optional — content body)
  ├─► fileEncoding?: "text" | "base64"  (optional — ImageViewer only)
  └─► mimeType?: string          (optional — ImageViewer only)
        │
        ▼
  FileViewerRouter
    │
    ├─► ext = fileName.split(".").pop()?.toLowerCase()
    │
    ├─► switch (ext):
    │     ├─► "csv"          → <CsvViewer fileName fileContent />
    │     ├─► "md"/"markdown"/"txt" → <MdViewer fileName fileContent />
    │     ├─► "jpg"/"jpeg"/"png"/"gif"/"svg"/"webp"
    │     │                     → <ImageViewer fileName fileContent fileEncoding mimeType />
    │     ├─► "json"/"jsonl" → <JsonViewer fileName fileContent />
    │     └─► default        → Fallback Box (localized "Binary / Unsupported File" + extension label)
    │
    ▼
  Rendered file content or unsupported fallback
```

## 4. State Management

**No state.** The component is stateless. All sub-viewers manage their own state independently:

| Sub-Viewer | Internal State |
|---|---|
| `CsvViewer` | `page`, `rowsPerPage` (pagination UI state) |
| `MdViewer` | None (stateless) |
| `ImageViewer` | None (stateless) |
| `JsonViewer` | None (stateless) |

No `useDataState` is used — file content arrives already resolved via props.

## 5. Styling Implementation

The router's own styling is limited to the fallback UI:

| Token Path | Usage |
|---|---|
| `spacing.lg` (24px) | Padding in fallback Box container |
| `palette.text.secondary` | Fallback message text color |
| `borderColor: 'divider'` | Fallback container border (from theme) |

Sub-viewer styling is the responsibility of each sub-viewer molecule — the router does not apply styles to routed content.

## 6. Interaction Design

**No built-in interactions.** The router is a passive dispatcher:

| Interaction | Owner |
|---|---|
| CSV pagination | CsvViewer (page clicks, rows-per-page selector) |
| CSV sorting (future) | CsvViewer (header click) |
| Image zoom/pan | ImageViewer |
| Markdown link click | MdViewer (default anchor behavior) |
| JSON expand/collapse | JsonViewer |

## 7. Accessibility Implementation

| Requirement | Status | Implementation |
|---|---|---|
| Fallback message | ✅ | Localized text rendered as `Typography` — readable by screen readers |
| Role passthrough | ❌ | Router does not set `role` — each sub-viewer must manage its own roles |
| `aria-label` on routed content | ❌ | Router does not pass `aria-label` to sub-viewers |
| Focus management | ❌ | Not applicable (router is a passive switch) |
| Keyboard navigation | ❌ | Delegated to sub-viewers |

## 8. Error Handling

| Error Type | Cause | Behavior |
|---|---|---|
| Unknown extension | No matching `case` in switch | Renders fallback Box with localized "Binary / Unsupported File" + `.ext` label |
| No file extension | `ext` is `undefined` (`fileName = "Makefile"`) | Falls to `default` case — unsupported file message with no extension label |
| Missing localization key | `literal["viewer.unsupported"]` undefined | Uses `"⚠️"` as fallback for title, `"📄"` for extension label |
| Sub-viewer crash | Error in CsvViewer / MdViewer / ImageViewer / JsonViewer | Contained by `ErrorBoundary` — fallback message rendered in place of crashed viewer |
| Missing `fileContent` | Prop omitted | Delegated to sub-viewer — each handles independently |
| Missing `fileName` | Prop omitted | TypeScript compilation error (required prop) |

## 9. Performance Considerations

| Factor | Analysis |
|---|---|
| Time complexity | O(1) — single switch-case, no iteration |
| Sub-viewer rendering | Only one sub-viewer rendered per route — no unnecessary rendering |
| Extension extraction | O(n) on filename string length (negligible) |
| Re-render behavior | Re-renders when `fileName`, `fileContent`, `fileEncoding`, or `mimeType` reference changes |

## 10. Integration Points

| Integration | Details |
|---|---|
| **CsvViewer** | `src/common/components/organisms/CsvViewer.tsx` — handles `.csv` files |
| **MdViewer** | `src/common/components/molecules/MdViewer.tsx` — handles `.md`, `.markdown`, `.txt` |
| **ImageViewer** | `src/common/components/molecules/ImageViewer.tsx` — handles image extensions; receives `fileEncoding` and `mimeType` |
| **JsonViewer** | `src/common/components/molecules/JsonViewer.tsx` — handles `.json`, `.jsonl` |
| **Barrel export** | `src/common/components/organisms/index.ts` re-exports `FileViewerRouter`, `FileViewerRouterProps` |
| **Language provider** | Requires `LanguageProvider` ancestor for fallback localization keys |
| **Theme provider** | Requires MUI `ThemeProvider` ancestor for fallback styling tokens |

## 11. Open Questions

1. ~~Should an error boundary be added to contain sub-viewer crashes within the router (falling back to unsupported-file message)?~~ **Resolved**: `ErrorBoundary` wraps each sub-viewer.
2. Should the hardcoded emoji fallbacks (`"⚠️"`, `"📄"`) be replaced with localized translation keys?
3. Should `fileName` with no extension (e.g., "Makefile", "README") get special handling instead of falling to unsupported?
4. Should file-type-specific accessibility announcements differ per sub-viewer?
5. Should the extension-to-viewer map be configurable via a prop to allow custom viewer registration?
6. Should binary files over 50 MB be blocked with a size warning before routing?

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
