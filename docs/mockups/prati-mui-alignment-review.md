# Prati and MUI alignment review

Status: **partial alignment**. The standalone HTML mockup follows the documented visual direction but does not use Prati/MUI components. A follow-up installed and checked Prati 0.1.1, Astra 1.1.1 and MUI 7.3.11; type-check, Electron build and the built placeholder renderer passed. The full mockup has not been implemented or verified using those components.

## Follow-up after dependency installation

- **Fixed:** dark primary foreground is now `#111318` on `#a6abff`, approximately 8.75:1. The check used the rendered dialog button.
- **Fixed:** project tabs respond to Left/Right, Home and End; a browser check verified focus and selected state after rerender. A full assistive-technology audit remains outstanding.
- **Confirmed:** the installed Prati DataTable declaration takes columns, data and a key field, with no row-selection, sort or pagination callback. The DrawerComponent, theme and language providers, light/dark themes and state components are declared by the installed package. The installed Astra declarations expose AppStateProvider, useDataState, AppStateHandler, IpcService and ServerResponse.
- **Confirmed:** the current renderer type-checks and builds with those dependencies. Its built placeholder loaded in a browser without page errors; this is not an Electron launch or a functional implementation of the mockup.
- **Dependency finding:** importing the installed Prati package in a plain Node process fails with `document is not defined`. This conflicts with the locally documented platform-neutral/SSR expectation. Electron's browser renderer loaded in the check above; Node/SSR compatibility is not required to render this static mockup. A fix belongs in Prati and has not been made or verified here.
- **Audit:** `npm audit --omit=dev` reported no production vulnerabilities. The full npm audit reported two high-severity entries involving development Electron and its transitive extract-zip dependency; remediation has not been assessed.

## Findings

| Priority | Finding | Evidence and consequence | Recommended owner/action |
|---|---|---|---|
| Resolved in prototype | Dark-mode primary buttons previously used white text on `#a6abff`, approximately 2.12:1 contrast. | The prototype now uses `#111318` on that color, approximately 8.75:1. | For the application, use Prati/MUI semantic contrast text and test actual theme values. If the shared theme itself is defective, fix Prati. |
| Resolved in prototype | Project preview controls previously lacked arrow-key tab navigation. | Headless checks now pass Left/Right, Home and End, including focus and selected state. | Use a supported Prati or MUI tab component when implementing and verify complete keyboard and assistive-technology behavior. |
| Medium | The mockup uses its own CSS tokens, font, inline styles and HTML controls. | It does not use Prati ThemeProvider, LanguageProvider, MUI components, or Astra state; visual resemblance cannot prove library conformance. | Map each UI pattern to verified public Prati APIs and MUI primitives; use Prati tokens/providers and Astra MVVM. Do not introduce replacements for missing shared capabilities. |
| Medium | Localization is not implemented in the mockup. | Visible strings are embedded in HTML and JavaScript. The current React placeholder also passes an empty translation dictionary and renders literals. | Use Prati LanguageProvider and translated keys in the real renderer. The static sample is not evidence of localization support. |
| Medium | Exact component fit is unverified. | The installed DataTable declaration confirms no selection/sort/pagination callbacks; the Drawer declaration exposes controlled props. Actual screen behavior has not been built or tested. | Compose supported public primitives in the product; if a reusable capability is genuinely missing or defective, fix Prati rather than creating a compatibility workaround. |
| Medium | Narrow-layout navigation differs from documented Prati drawer behavior. | The static mockup uses horizontally scrolling navigation below 760px; the local Drawer reference describes temporary and permanent drawer modes. | Decide desktop minimum width and responsive behavior against the actual Prati component contract; verify keyboard and focus at supported sizes. |
| Low | Local design references conflict on library ownership. | The copied MUI alignment document says theme comes from Astra and references a separate brand YAML, while the provider hierarchy and current architecture say Prati owns theme/localization and Astra owns state. | Follow the repository's current ownership rule and Prati provider documentation. Reconcile the local reference documents before relying on them as a single authority. |

## What is aligned

- The prototype uses restrained surfaces, clear hierarchy, labeled status, evidence context, light/dark variants and a desktop-oriented split view, consistent with the local visual principles.
- The current React placeholder nests Prati ThemeProvider outside LanguageProvider, with Astra AppStateProvider inside. Its actual runtime behavior remains unverified because dependencies are not installed.
- Headless checks reported no document-level horizontal overflow at 800px or 375px in the tested project view. This does not establish accessibility or usable layout across every screen.

## Suggested component mapping to verify

| Mockup area | Candidate to inspect | Contract questions |
|---|---|---|
| Navigation | Prati DrawerComponent / MUI Drawer and List | Does the public API support the chosen desktop navigation and correct selection/focus? |
| Search and scope | Prati public input/select components or MUI TextField and Select | Labels, empty states, controlled values and keyboard access. |
| Project results | Prati list/data presentation or MUI List; DataTable where tabular comparison fits | Selection, filtering and pagination ownership; do not assume DataTable has callbacks. |
| Detail sections | Prati page/layout components and MUI Tabs, Paper, Typography | Tab keyboard behavior and semantic associations; supported theme tokens. |
| Scan and review dialogs | Supported Prati dialog or MUI Dialog | Accessible names, focus containment/return, validation and cancellation. |
| Data states | Astra AppStateHandler with Prati LoadingState, ErrorState and EmptyState | Correct async state and distinct empty, unavailable, partial and error messages. |

These are candidates, not proof of public availability or prop compatibility. Check installed exports and versions before implementing.

## Verification performed

- Read local Prati design, MUI mapping, component and provider guidance and inspected the current mockup and React placeholder.
- Installed the dependencies, inspected public declarations, ran the type-check/build, and loaded the built placeholder renderer in a browser. A live comparison of the full mockup against actual Prati/MUI components remains unavailable.
- Calculated prototype token contrast: light primary white-on-accent 5.58:1; dark primary white-on-accent 2.12:1; light faint text on white 3.32:1. Whether faint text is used for normal required text must be assessed per element.
- The initial headless keyboard check found that ArrowRight did not move focus between the project preview's tab-role controls. The follow-up check passed after the fix. The detail section buttons are a navigation group, not an ARIA tablist.
- Checked document overflow at 800px and 375px in the tested project view; neither showed document-level horizontal overflow.

No full keyboard, screen-reader, forced-colors, zoom, all-screen contrast, or actual Electron/MUI/Prati runtime audit was performed. This review does not claim accessibility conformance.
