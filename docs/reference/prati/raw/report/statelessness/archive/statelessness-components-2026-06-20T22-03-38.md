# Statelessness Audit Report

## Audit Metadata

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-06-20T22:03:38 |
| **Commit** | `27edf06` |
| **Suite** | Stateless UI Audit — Phase 1 |
| **Module** | `src/common/components/` (atoms, molecules, organisms, templates) |
| **Invariant References** | `docs/raw/architecture/invariants/stateless-ui.md` |

---

## Audited Files

### Atoms (5 files)
1. `src/common/components/atoms/EmptyState.tsx`
2. `src/common/components/atoms/ErrorState.tsx`
3. `src/common/components/atoms/StatusDot.tsx`
4. `src/common/components/atoms/SeverityBadge.tsx`
5. `src/common/components/atoms/LoadingState.tsx`

### Molecules (5 files)
6. `src/common/components/molecules/Card.tsx`
7. `src/common/components/molecules/TrendMetricCard.tsx`
8. `src/common/components/molecules/Notification.tsx`
9. `src/common/components/molecules/MdViewer.tsx`
10. `src/common/components/molecules/JsonViewer.tsx`
11. `src/common/components/molecules/ImageViewer.tsx`

### Templates (3 files)
12. `src/common/components/templates/PageHeader.tsx`
13. `src/common/components/templates/HeroSection.tsx`
14. `src/common/components/templates/SummaryPanel.tsx`

### Organisms (30 files)
15. `src/common/components/organisms/AudioPlayerBar.tsx`
16. `src/common/components/organisms/AnimatedHeroCharacter.tsx`
17. `src/common/components/organisms/AlertListItem.tsx`
18. `src/common/components/organisms/CanvasNote.tsx`
19. `src/common/components/organisms/CanvasGroup.tsx`
20. `src/common/components/organisms/CsvViewer.tsx`
21. `src/common/components/organisms/DataTable.tsx`
22. `src/common/components/organisms/DecisionActionCard.tsx`
23. `src/common/components/organisms/DrawerComponent.tsx`
24. `src/common/components/organisms/EntityConfidenceRow.tsx`
25. `src/common/components/organisms/EntryLayoutFrame.tsx`
26. `src/common/components/organisms/ErrorBoundary.tsx`
27. `src/common/components/organisms/FeatureSegmentCard.tsx`
28. `src/common/components/organisms/FileTree.tsx`
29. `src/common/components/organisms/FileViewerRouter.tsx`
30. `src/common/components/organisms/FormLayout.tsx`
31. `src/common/components/organisms/IconDescriptionListItem.tsx`
32. `src/common/components/organisms/InteractiveStepNode.tsx`
33. `src/common/components/organisms/MultiPhaseWorkflowDiagram.tsx`
34. `src/common/components/organisms/MultiStepProgressIndicator.tsx`
35. `src/common/components/organisms/OperationHealthPanel.tsx`
36. `src/common/components/organisms/PlayableMediaCard.tsx`
37. `src/common/components/organisms/ProfileRevealCard.tsx`
38. `src/common/components/organisms/ReviewDecisionDialog.tsx`
39. `src/common/components/organisms/StatusActionCard.tsx`
40. `src/common/components/organisms/StatusListRow.tsx`
41. `src/common/components/organisms/SummaryListItem.tsx`
42. `src/common/components/organisms/TerminalViewer.tsx`
43. `src/common/components/organisms/TimelineNode.tsx`
44. `src/common/components/organisms/ToolbarComponent.tsx`
45. `src/common/components/organigms/VersionHistorySelector.tsx`
46. `src/common/components/organisms/VerticalStepIndicator.tsx`
47. `src/common/components/organisms/WeeklyReportCard.tsx`

### Theme / Localization Providers (6 files)
48. `src/common/theme/ThemeProvider.tsx`
49. `src/common/theme/ThemeToggle.tsx`
50. `src/common/theme/themeContext.ts`
51. `src/common/theme/themeData.ts`
52. `src/common/localization/LanguageProvider.tsx`
53. `src/common/localization/LanguageComponent.tsx` (LanguageSelector)

---

## Summary

| Severity | Count | Meaning |
|----------|-------|---------|
| **P0** | 0 | Critical — component fetches or persists data |
| **P1** | 0 | High — hidden side effects or domain imports |
| **P2** | 2 | Transitional — documented concerns |
| **P3** | 51 | Compliant — stateless |
| **Total** | 53 | All audited files |

---

## Overall Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Mutable State** | 100/100 | No domain entity state in components |
| **Hidden Side Effects** | 95/100 | One side-effect-in-render in JsonViewer (P2) |
| **Persistence Leakage** | 90/100 | ThemeProvider missing required `@stateless-exception` JSDoc (P2) |
| **Runtime Coupling** | 100/100 | No API/IO calls in component layer |
| **Overall** | **96/100** | Strong stateless compliance |

---

## Findings

---

### Finding ID
SLESS-001

### File
`src/common/theme/ThemeProvider.tsx`

### Category
Persistence Leakage

### Invariant Violated
`docs/raw/architecture/invariants/stateless-ui.md`

### Severity
P2 — Transitional

### Violation Type
Missing `@stateless-exception` JSDoc tag on documented exception

### Evidence
```tsx
// ThemeProvider.tsx — lines 21-35
const [internalDarkMode, setInternalDarkMode] = useState(() => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) {
        return stored === "true";
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark;
    } catch {
      return false;
    }
  }
  return false;
});
```

And lines 45-49:
```tsx
localStorage.setItem("darkMode", String(newMode));
```

### Invariant Rule Violated
`stateless-ui.md §"Documented Exception: Provider Persistence"` — Requirements state: "Must be documented with a `@stateless-exception` JSDoc tag in the implementation"

### Recommendation
Add the required `@stateless-exception` JSDoc tag above the `ThemeProvider` function per the invariant's documented exception template:

```tsx
/**
 * @stateless-exception
 * Reason: Dark mode preference persistence — UX convenience for ThemeProvider only.
 * Scope: ThemeProvider exclusively. Not a general pattern.
 * SSR guard required: typeof localStorage !== 'undefined'
 */
export function ThemeProvider({...}: ControllableThemeProviderProps) {
```

### Impact
Without the tag, maintainers cannot distinguish this documented exception from an unintentional persistence violation. Future audits may incorrectly flag it, and future contributors may treat it as a precedent for generalizing persistence in components.

---

### Finding ID
SLESS-002

### File
`src/common/components/molecules/JsonViewer.tsx`

### Category
Hidden Side Effects

### Invariant Violated
`docs/raw/architecture/invariants/stateless-ui.md`

### Severity
P2 — Transitional

### Violation Type
Side effect in render (promise `.then()` triggering state update outside `useEffect`)

### Evidence
```tsx
// src/common/components/molecules/JsonViewer.tsx — lines 10, 63, 65-68
const vscDarkPlusPromise = import("react-syntax-highlighter/dist/esm/styles/prism")
  .then((mod) => mod.vscDarkPlus);

// Inside component render:
if (!style) {
  vscDarkPlusPromise.then(setStyle);
  return <LoadingFallback />;
}
```

### Invariant Rule Violated
`stateless-ui.md §"Allowed Patterns — Animation State"` and §"Forbidden Patterns" — Side effects should be scoped to `useEffect`. The invariant allows `useEffect` for mount-only UI setup, but this configures a style promise outside of `useEffect`, making it an untracked side effect during render.

### Recommendation
Move the style-loading side effect into a `useEffect` with empty deps:

```tsx
useEffect(() => {
  vscDarkPlusPromise.then(setStyle);
}, []);
```

### Impact
The side effect during render is imperceptible in practice (the promise resolves and triggers a setState on the next tick), but it violates the principle of pure render functions. If the promise microtask throws, there is no error boundary wrapping it. Not a correctness bug but a code hygiene concern.

---

### Finding ID
SLESS-003

### File
`src/common/components/organisms/AudioPlayerBar.tsx`

### Category
Hidden Side Effects

### Invariant Violated
`docs/raw/architecture/invariants/stateless-ui.md`

### Severity
P3 — Informational (Compliant)

### Violation Type
`useRef` for DOM element access (audio element) — allowed use per invariant

### Evidence
```tsx
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }
}, [isPlaying]);
```

### Invariant Rule Violated
None. `useRef` for DOM element access is explicitly allowed. The ref targets `HTMLAudioElement`, a DOM element — not a display value. The effects control media playback (DOM API), which is UI interaction.

### Recommendation
No action required.

### Impact
None. Compliant usage.

---

## Cross-Suite Overlap

### Findings shared with Component Purity Audit (Stateless UI dimension)

| Finding | Stateless ID | Potential Overlap | Deduplication |
|---------|-------------|-------------------|---------------|
| ThemeProvider missing `@stateless-exception` JSDoc | SLESS-001 | May appear in Component Purity audit under "Persistence Leakage" dimension | Deduplicate in fix plan: fix once in `ThemeProvider.tsx` |
| JsonViewer side-effect-in-render | SLESS-002 | May appear in Component Purity audit under "Side Effect Inspection" dimension | Deduplicate in fix plan: fix once in `JsonViewer.tsx` |

**No P0 or P1 findings overlap.** Only the P2 transitional findings may appear in both audit reports. The fix plan should apply each remediation once.

---

## Transitional Violations

| ID | File | Reason | Migration | Target |
|----|------|--------|-----------|--------|
| SLESS-001 | `ThemeProvider.tsx` | Missing `@stateless-exception` JSDoc per documented exception requirements | Add JSDoc tag | Next patch |
| SLESS-002 | `JsonViewer.tsx` | Style promise `.then()` runs in render instead of `useEffect` | Wrap in `useEffect` with `[]` deps | Next patch |

These are the only two non-compliant items. Neither is P0 or P1; both are P2 (transitional).

---

## Audit Traceability

| Field | Value |
|-------|-------|
| **Audit Suite** | Stateless UI Audit — Phase 1 |
| **Report Location** | `docs/raw/report/statelessness/latest/statelessness-components-2026-06-20T22-03-38.md` |
| **Invariant Baseline** | `docs/raw/architecture/invariants/stateless-ui.md` |
| **Auditor** | State Management Auditor / Side Effect Inspector / Component Purity Reviewer |
| **Method** | Full source code review of all 53 component/provider files |
| **Detection Scope** | Mutable State, Hidden Side Effects, Persistence Leakage, Runtime Coupling |

---

## Per-Dimension Detailed Analysis

### 1. Mutable State — Score: 100/100

**No violations found.**

All `useState` calls in the component layer are limited to:
- `useState(false)` for open/close/toggle (CanvasNote `isEditing`; StatusActionCard `isChecking`, `isConnecting`; CsvViewer pagination states)
- `useState(0/1)` for zoom, rotation, pagination (ImageViewer, CsvViewer)
- `useState("")` for animation progress (HeroSection TypewriterHeadline `displayedText`)
- `useState<string | null>` for controlled input (LanguageSelector `anchorEl`)
- `useState<Record<string, ...> | null>` for UI style theme loading (JsonViewer)

No `useState<T>` with domain entity types (`User`, `Order`, `Config`, etc.).
No `useReducer` in any component file.
No module-level `let`/`var` mutable state.
No `useRef` used for display values.
No class component instance state beyond ErrorBoundary's `hasError` (UI error boundary state).

### 2. Hidden Side Effects — Score: 95/100

**Allowed `useEffect` usage found:**
- Animation coordination: HeroSection TypewriterHeadline (`setTimeout`/`setInterval`), AudioPlayerBar (audio DOM API)
- Event listener setup/teardown: ThemeProvider (`window.addEventListener("storage", ...)`)
- Mount-only UI setup: HeroSection animation timers
- Theme/language sync: LanguageProvider (`setLiteral`)

**One P2 finding:** JsonViewer's `vscDarkPlusPromise.then(setStyle)` called in render body.

### 3. Persistence Leakage — Score: 90/100

**Documented exception:** ThemeProvider reads/writes `localStorage` for `darkMode` preference. This is the single documented exception per `stateless-ui.md`.

**One P2 finding:** The `@stateless-exception` JSDoc tag is missing from the implementation.

No other component accesses `localStorage`, `sessionStorage`, `IndexedDB`, `cookies`, or `CacheStorage`.

### 4. Runtime Coupling — Score: 100/100

**No violations found.**

No component imports `axios`, `fetch`, `ApiService`, `WebSocket`, or `XMLHttpRequest`.
No component accesses `import.meta.env` for API configuration.
No component instantiates WebSocket or XHR connections.

All IO operations are delegated to:
- Props callbacks (e.g., `onConnect`, `onCheckStatus` in StatusActionCard)
- ViewModel hooks (via consumer-managed state)
- Repository abstractions (not imported in components)

---

## Conclusion

The Prati component layer demonstrates **strong stateless compliance** (96/100 overall).

- **0 P0 findings** — No component fetches or persists business data
- **0 P1 findings** — No hidden mutable state or domain imports in components
- **2 P2 findings** — Both minor: a missing JSDoc tag on the documented ThemeProvider exception, and a side-effect-in-render for loading a syntax highlighting style
- **All 51 remaining files P3** — Fully stateless and compliant

The architecture's MVVM separation is intact. Components behave as pure presentation units receiving data through props and emitting events through callbacks. No evidence of architectural drift toward data-fetching or stateful components.
