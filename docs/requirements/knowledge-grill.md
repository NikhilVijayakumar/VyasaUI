# Knowledge grill and recommendations

Status: independent review; recommendations are draft and do not establish that unverified functionality exists. Based on the local product knowledge, design system, and Astra and Prati architecture documentation. The owner directs that dependency gaps be fixed in the relevant dependency, not bypassed in Vyasa UI.

## Product and domain

### K1 — Is the frontend a different product?

**Finding:** No. It presents the same local-first project intelligence to people; the knowledge bundle includes shared vision, roadmap, identity, evidence, ownership and privacy concepts.

**Recommendation:** Use those local concepts for every UI feature. Derive screen behavior from the shared requirements and preserve phase and decision status. CLI and MCP server mechanics belong to the backend, while human interactions need their own frontend scenarios.

**Verification:** Trace each frontend scenario to a local product concept and applicable shared requirement. Do not claim that a later-phase capability is currently implemented.

### K2 — Can the UI turn an unknown fact into a negative result?

**Finding:** No. Observed, declared, unknown, not detected, inaccessible, stale, unsupported and conflicting have different meanings; freshness and evidence age are distinct.

**Recommendation:** Preserve statuses and evidence supplied by Vyasa through the feature model and view. Use concise text and accessible Prati components, with detailed evidence available on demand. Do not fabricate facts or make the frontend a second detector.

**Verification:** Exercise unknown, inaccessible, stale, conflicting and not-detected examples, including partial scans; confirm the rendered meaning matches the returned data.

### K3 — Are query, scan and metadata editing interchangeable?

**Finding:** Queries read the index; scans and changes are separate operations. Project-owned data is not silently overwritten.

**Recommendation:** Keep read and write operations explicit in UI workflows. Present scan and sync outcomes accurately, including partial results. Identify field ownership before adding editing; do not add destructive actions based only on review candidates.

**Verification:** Confirm no read-only navigation triggers a scan, and test unavailable or interrupted operations against the agreed backend contract.

## Astra and Electron architecture

### K4 — Should the application replace Astra's state and repository machinery?

**Finding:** Astra documents a feature structure of `model/`, `repo/`, `hooks/`, `view/components/` and `view/pages/`; its state lifecycle and response contracts are shared capabilities.

**Recommendation:** Use Astra's public `useDataState`, `AppStateHandler`, `ServerResponse` and `IpcService` for the documented Electron pattern. Keep feature-specific models, repository methods and screens in the application. If a shared Astra feature is defective or insufficient, reproduce and fix it in Astra; consume and test the corrected version rather than creating an Astra substitute or compatibility shim.

**Verification:** Check installed exports, type-check the integration and exercise success, error and empty states through the public API. No live dependency integration has yet been verified.

### K5 — Is Astra IPC the Vyasa backend transport?

**Finding:** No. Astra's IPC abstraction concerns Electron renderer-to-main communication. How Electron main communicates with the Vyasa Python service and who owns its lifecycle are separate, unresolved questions.

**Recommendation:** Specify the main-to-Vyasa protocol, startup, version compatibility, error and cancellation behavior before connecting it. Use Astra's IPC pattern at the renderer boundary, with a narrow validated preload bridge and main handlers. Application-specific wiring is necessary integration, not a replacement for Astra.

**Verification:** Contract-test the chosen backend interface and the IPC boundary separately, including unavailable and incompatible services. The current shell has no such bridge.

## Prati, accessibility and localization

### K6 — Who owns reusable UI components, theming and localization?

**Finding:** Prati owns its public components, theme and localization. Astra owns state primitives. Consumer feature composition belongs to Vyasa UI.

**Recommendation:** Use Prati's public exports, theme tokens, ThemeProvider and LanguageProvider; put Vyasa branding in supported theme configuration and strings in translation dictionaries. Compose project-specific views without recreating Prati widgets. If a shared Prati component, token or localization feature is broken or missing, specify and fix it in Prati rather than creating a local replacement.

**Verification:** Check package exports and provider nesting, then test theme and localization behavior in the application. A documented capability is not proof that the installed package provides it.

### K7 — Does using Prati guarantee accessibility and desktop readiness?

**Finding:** No. Prati's rules guide component behavior, but the composed application, data, focus order and window constraints still require verification.

**Recommendation:** Test keyboard navigation, focus, accessible names, contrast in both themes, text expansion, resizing, zoom and reduced motion on representative screens. Fix reusable component defects in Prati; fix application composition or labeling defects in Vyasa UI. Do not hide or replace a defective dependency feature to make tests pass.

**Verification:** Record actual checks and failing cases; test both the corrected dependency and the app after any fix.

## Knowledge maintenance and delivery

### K8 — Can copied documentation prove the installed package matches it?

**Finding:** No. The documentation is locally maintained and the app's dependency installation and launch have not been verified. The current manifest uses GitHub dependencies without a completed lockfile.

**Recommendation:** Establish compatible, reproducible dependency revisions and a lockfile, verify actual public exports and peer dependencies, and update local knowledge when verified behavior changes. If dependency behavior conflicts with its contract, investigate and fix the responsible package rather than routing around it.

**Verification:** A clean install, type-check, build and Electron launch using the recorded dependency versions; report any unavailable checks.

### K9 — Are the copied backend validation workflows ready here?

**Finding:** The imported requirement index references a verification workflow that is not configured for this repository, and frontend requirements remain a draft. The OKF knowledge contains imported backend material as well as frontend-specific concepts.

**Recommendation:** Define local knowledge and frontend requirement validation that reflects this repository's structure and avoids treating backend-only behavior as frontend implementation. Preserve the imported source decisions and their status while making frontend changes independently.

**Verification:** Run the configured local validation against the entire bundle and requirement set; report missing checks and broken internal links. A frontmatter-only check is not full OKF or project-profile validation.

## Open decisions

The first user workflow and screen priorities, visual identity, supported languages and window sizes, and main-to-Vyasa integration contract remain undecided. These recommendations do not approve those choices. The frontend grill and design-system grill retain their own questions and status.
