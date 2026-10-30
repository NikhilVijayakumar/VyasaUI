# ImageViewer: Feature Technical

## 1. Technical Overview

ImageViewer is an interactive molecule that renders base64-encoded image data with toolbar controls for zoom (0.5x–3x, 0.2x steps) and rotation (0°, 90°, 180°, 270°). It constructs a data URI from `fileContent` + `mimeType` props and renders via an `<img>` element. Zoom and rotation are managed as internal UI-only state via `useState` — purely presentation state that does not persist or lift to parent. Shows a localized placeholder message when no content is provided.

## 2. Architecture Realization

| Architecture Pattern | Realization |
|---|---|
| **Molecule (Atomic Hierarchy)** | Composes MUI atoms (`Box`, `Typography`, `IconButton`) with MUI icons (`ZoomIn`, `ZoomOut`, `RotateRight`). No imports from organism or template tiers. Complies with `docs/raw/architecture/core/component-tiers.md:34-46`. |
| **Stateless UI** | Manages only UI presentation state (`zoom`, `rotation`) via `useState`. Both are purely visual view states — not domain data, not business state, not persisted. Image content arrives via props. Complies with `docs/raw/architecture/invariants/stateless-ui.md:20-28` (UI interaction state is allowed). |
| **Theme Sovereignty** | All visual values derive from theme tokens — background via `'background.default'` / `'background.paper'`, border via `'divider'`, text via `'text.secondary'`, spacing from token constants. Complies with `docs/raw/architecture/invariants/theme-sovereignty.md:22-38`. |
| **Localization** | Uses `useLanguage` hook for empty-state message. Translation key: `viewer.empty_image` with fallback `"No image content available for preview."`. Complies with `docs/raw/architecture/invariants/localization.md:22-37`. |
| **Dependency Safety** | Four MUI icon imports (`@mui/icons-material/ZoomIn`, `ZoomOut`, `RotateRight`) — tree-shakeable. Complies with `docs/raw/architecture/core/component-tiers.md:45-46`. |
| **MVVM Pattern** | View component with allowed UI-only internal state. No ViewModel involvement, no data fetching. Follows `docs/raw/architecture/core/mvvm-pattern.md:99-116`. |

## 3. Data Flow

```
Parent (FileViewerRouter organism)
  │
  ├── fileName: string ────────────────→ ImageViewer
  ├── fileContent?: string ────────────→ ImageViewer
  ├── fileEncoding?: string ───────────→ ImageViewer
  └── mimeType?: string ───────────────→ ImageViewer
                                             │
                                             ├── imageSource construction (inline):
                                             │     fileContent && fileEncoding === "base64"
                                             │       → `data:${mimeType || "image/png"};base64,${fileContent}`
                                             │       : null
                                             │
                                             ├── Toolbar Box (always visible)
                                             │     ├── Typography (fileName)
                                             │     ├── ZoomIn IconButton → setZoom(prev => Math.min(prev + 0.2, 3))
                                             │     ├── ZoomOut IconButton → setZoom(prev => Math.max(prev - 0.5, 0.5))
                                             │     ├── Zoom level display
                                             │     └── RotateRight IconButton → setRotation(prev => (prev + 90) % 360)
                                             │
                                             └── Image area Box
                                                   ├── imageSource ? <img style={transform: rotate(Xdeg) scale(Y)}>
                                                   └── !imageSource ? <Placeholder Box>{emptyMessage}</Placeholder>
```

Data flow is one-way from props into the component. Image content is pre-loaded by the parent — the component never accesses the file system or network. Zoom and rotation mutations are self-contained within the component.

## 4. State Management

ImageViewer manages two pieces of UI-only internal state via `useState`:

| State | Type | Initial | Mutations | Purpose |
|---|---|---|---|---|
| `zoom` | `number` | `1` | `zoom + 0.2` (clamped to max 3), `zoom - 0.2` (clamped to min 0.5) | Controls CSS `scale()` transform on `<img>` |
| `rotation` | `number` | `0` | `(rotation + 90) % 360` | Controls CSS `rotate()` transform on `<img>` |

This is explicitly permitted by the Stateless UI Invariant (`docs/raw/architecture/invariants/stateless-ui.md:74-93`): "A component may: manage UI interaction state (open/closed, selected, hovered), manage animation state, manage temporary visual transitions." Zoom and rotation are temporary visual transitions — they are reset when the component unmounts and are never persisted.

No `useReducer`, no `useDataState`, no `useContext` for state. The state is purely local and non-essential — it affects only the visual presentation of the image, not the data model.

## 5. Styling Implementation

All styling applied via MUI `sx` prop with theme token references:

| Element | Styling Tokens | Source |
|---|---|---|
| Outer container Box | `sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}` | Theme tokens for surface, border |
| Toolbar Box | `sx={{ display: 'flex', alignItems: 'center', gap: spacing.sm, px: spacing.md, py: spacing.xs, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}` | Theme tokens for toolbar surface and separator |
| File name Typography | `sx={{ color: 'text.secondary', flexGrow: 1 }}` | Theme token `text.secondary` |
| Image area Box | `sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: spacing.lg, bgcolor: 'background.default', minHeight: 200 }}` | Theme tokens for layout and surface |
| Placeholder Typography | `sx={{ color: 'text.secondary' }}` | Theme token `text.secondary` |

**Image transforms** (applied as inline style on `<img>`):
```typescript
style={{
  transform: `rotate(${rotation}deg) scale(${zoom})`,
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
}}
```

## 6. Interaction Design

| Control | Icon | Action | Boundary |
|---|---|---|---|
| Zoom In | `ZoomIn` | `setZoom(prev => Math.min(prev + 0.2, 3))` | Max 3.0x |
| Zoom Out | `ZoomOut` | `setZoom(prev => Math.max(prev - 0.5, 0.5))` | Min 0.5x |
| Rotate Right | `RotateRight` | `setRotation(prev => (prev + 90) % 360)` | Cycles 0→90→180→270→0 |

All controls are `IconButton` components with MUI icons — always visible in the toolbar. The zoom level is displayed as text between the zoom buttons. Clicking any button triggers an immediate state update, which causes a React re-render with the new CSS transform applied to the `<img>` element. There are no animations for zoom or rotation transitions — the transform changes instantly.

Zoom and rotation are independent: a user can rotate the image and zoom in simultaneously; the transforms compose via CSS `transform: rotate(Xdeg) scale(Y)`.

## 7. Accessibility Implementation

- **Icon buttons**: Each toolbar button uses MUI `IconButton` with an icon. MUI `IconButton` renders as a `<button>` element with no default accessible label. The component should include `aria-label` on each `IconButton` (e.g., `aria-label="Zoom in"`, `aria-label="Rotate right"`).
- **Image alt text**: The `<img>` element uses `alt={fileName}` from the prop.
- **Keyboard navigation**: Toolbar buttons are natively focusable and keyboard-activatable (Enter/Space) via MUI `IconButton`.
- **Zoom level**: The zoom level is displayed as visible text — no `aria-live` region announces zoom changes.

**Accessibility gaps**:
- Missing `aria-label` on `IconButton` components — screen readers will announce the icon name (e.g., "Zoom in icon") based on the icon's SVG title, not a semantic label.
- ~~Missing `alt` attribute on `<img>`~~ **Resolved**: `alt={fileName}` is set on the image element.
- No `aria-live` region for zoom/rotation state announcements.

## 8. Error Handling

| Error Scenario | Behavior |
|---|---|
| `fileContent` not provided | `imageSource = null` → placeholder Box with translated empty-state message |
| `fileEncoding` not `"base64"` | `imageSource = null` → same placeholder as no content |
| `mimeType` not provided | Defaults to `"image/png"` in data URI construction |
| Corrupted base64 data | Browser shows broken image icon on `<img>` — no custom `onError` handler |
| Missing translation key `viewer.empty_image` | Hardcoded fallback `"No image content available for preview."` displayed |
| Very large image | Constrained by `maxWidth: '100%'`, `maxHeight: '100%'`, `objectFit: 'contain'` — aspect ratio preserved |

**Critical gap**: There is no `onError` handler on the `<img>` element. Corrupted image data produces the browser's native broken image icon, which is inconsistent with the application's design language. Per `docs/raw/architecture/core/component-tiers.md:107`, errors from the `<img>` element are not caught.

## 9. Performance Considerations

- **Render cost**: Minimal — two `useState` hooks. State updates trigger re-renders only of the `<img>` element and the zoom level text.
- **Re-render scope**: Only `zoom` and `rotation` state changes trigger re-renders. Prop changes (new `fileContent`) also trigger re-render.
- **Image loading**: Deferred to browser's native `<img>` element — no custom loading logic. Large images are constrained by CSS (`maxWidth: '100%'`, `maxHeight: '100%'`).
- **Lazy loading**: ImageViewer is eager-loaded (not lazy) — it is expected to be used only when the user opens an image file, so lazy loading would add latency without benefit.
- **Bundle size**: ~128 lines. Four tree-shakeable icon imports. No heavy third-party dependencies.
- **CSS transform performance**: Zoom and rotation use CSS `transform`, which is GPU-accelerated and does not trigger layout recalculations.

## 10. Integration Points

| Integration | Details |
|---|---|
| **Consumer import** | `import { ImageViewer } from "prati"` via barrel, or directly from `@/common/components/molecules/ImageViewer` |
| **Consumed by** | `FileViewerRouter` organism (`docs/raw/feature/components/molecules/ImageViewer.md:33`) — delegates image file rendering based on file extension |
| **Pattern** | Pre-loaded base64 content — parent (FileViewerRouter) reads file content and passes it as props |
| **Test file** | `ImageViewer.test.tsx` with `vitest` + `@testing-library/react` — covers empty state, image rendering, zoom, rotation, and alt text |
| **Barrel export** | `src/common/components/molecules/index.ts` re-exports `ImageViewer` |
| **MUI dependencies** | `@mui/material` (`Box`, `Typography`, `IconButton`), `@mui/icons-material/ZoomIn`, `ZoomOut`, `RotateRight` |
| **Localization** | Uses `useLanguage` from `../../localization/LanguageContext` |
| **Spacing tokens** | Imports from `../../../theme/tokens/spacing` |
| **Composition constraint** | Cannot compose organisms or templates — molecule tier rule per `docs/raw/architecture/core/component-tiers.md:45-46` |
| **State constraint** | Only UI presentation state (`useState` for zoom/rotation) — allowed per `docs/raw/architecture/invariants/stateless-ui.md:74-93` |

## 11. Open Questions

1. Should `fileEncoding` prop type be narrowed from `string` to `"text" | "base64" | undefined` for better compile-time safety? (Current: `string | undefined` — `"base64"` check is a runtime string comparison.)
2. Should an `onError` handler be added to the `<img>` element to show the application's ErrorState component instead of the browser's native broken image icon?
3. ~~Should an `alt` attribute be set on the `<img>` element using `fileName` for screen reader accessibility?~~ **Resolved**: `alt={fileName}` is set.
4. Should `aria-label` attributes be added to `IconButton` controls for better screen reader support?
5. ~~Should a test file be created (`ImageViewer.test.tsx`) to cover zoom, rotation, empty state, and error scenarios?~~ **Resolved**: Test file created at `ImageViewer.test.tsx`.

## 12. Authorization

**Visibility:** Public — stateless Prati library component/primitive. No authentication or role requirement enforced by Prati. Authorization enforcement is consumer-managed at the application layer.
