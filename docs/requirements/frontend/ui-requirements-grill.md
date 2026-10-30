# UI requirements grill and recommendations

Status: **proposed for discussion**. This is a UI-perspective review of the local [shared requirement packages](../backend-baseline.md), [coverage map](backend-coverage.md), [frontend candidates](requirement.md), [product vision](../../../knowledge/product/vision.md), and [design system](../../../knowledge/design-system/index.md). Recommendations do not change confirmed backend rules or establish implementation. Backend recommendations tagged proposed remain unresolved.

Each item records a question, recommendation and an observable check. The screen groupings are proposals, not approved navigation or visual designs. Actual controls depend on supported backend capabilities and a specified integration contract.

## First experience and navigation

### UQ-01 — What does a user need immediately? (FR-001, 007–010, 015)

**Recommendation:** Start with a workspace overview that gives access to project search, index freshness and recent scan outcome. If no workspace is configured, explain that configuration is needed and offer the supported setup action. If the index has never been scanned, explain that separately. Do not automatically scan when opening the app.

**Check:** With sample data for configured, unconfigured, never-scanned and unavailable states, a user can tell which state applies and find the next available action. First-screen priority is an owner decision.

### UQ-02 — How should related tasks be found? (FR-001–012, 020, 028)

**Recommendation:** Group the mockup around overview, projects, workspace/index operations and settings; expose project details and evidence in context. Treat naming, placement and hierarchy as testable proposals rather than commitments. Keep later-phase capabilities identifiable but do not show them as operational until supported.

**Check:** A user can find a project, inspect its source and return to the previous result context without losing the active search.

## Workspace and index

### UQ-03 — What should workspace setup communicate? (FR-001, 002, 015, 022)

**Recommendation:** Show configured roots, supported exclusions and validation results; explain that scans operate within configured boundaries. Show repository ignore warnings and excluded counts when supplied. Save or scan only through explicit supported actions; do not assume a folder chooser or writable configuration API exists.

**Check:** One invalid or inaccessible root is distinguishable from an empty valid root, and a partial scan identifies the affected scope without presenting the entire run as successful.

### UQ-04 — How should freshness and refresh failures appear? (FR-007, 008, 015)

**Recommendation:** Show index freshness and last scan status with their time and scope when provided. An explicit refresh action should show progress and the final outcome. Explain an overlapping operation rather than silently starting another. Preserve and label previous results when the backend says they remain usable.

**Check:** Never-scanned, current, stale, partial/interrupted and unavailable examples are distinguishable. Reading results does not imply a refresh. Exact state names, timing and operations follow the confirmed contract.

## Search and project context

### UQ-05 — How can users find projects without misleading filters? (FR-009, 023–025)

**Recommendation:** Provide search and only those filters supported by the confirmed query contract, with visible active filters and a clear way to remove them. Show stable project identity internally, useful human-readable names and match context when available. Use the backend's ordering, matching and pagination; do not invent fuzzy or semantic search.

**Check:** No matches, no indexed projects, a failed search and unavailable service are visibly different. Paging or selection preserves the active query. Test realistic duplicate names.

### UQ-06 — What belongs on project details? (FR-003–006, 010, 021, 023–027)

**Recommendation:** Present identity, purpose, technology, documentation and project profile in understandable sections. Separate declared values from observations and show available status, source and observation time; offer detailed provenance on demand. Provide file composition, languages, markers, OpenSpec and OKF observations only where returned, with coverage and limitations.

**Check:** A missing, inaccessible, unknown, unsupported, stale or conflicting value is not displayed as false or absent. Documentation presence is not shown as a quality score. A registry-only project is not presented as locally available.

### UQ-07 — How are profiles and reports handled? (FR-014, 026–028)

**Recommendation:** Distinguish canonical project-authored profile content from generated drafts and observations. Present report presence, declared sections and content when the supported contract provides them; treat report text as untrusted data. Explain missing, unreadable and invalid states distinctly. Do not claim Vyasa writes reports or launches agents; do not offer editing or promotion without an approved supported operation.

**Check:** A draft cannot appear as the canonical profile; a missing report is not an error, and invalid or unreadable report states are not represented as missing. Hostile report content is not executed.

### UQ-08 — How are relationships and candidates explained? (FR-011, 012, 020)

**Recommendation:** Show related projects and dependencies with the backend-provided reason, source and coverage; distinguish direct dependency from other relation types. Present duplicate or obsolete candidates as findings requiring human review, not definitive judgments or automatic deletion. Do not assume a review or dismissal action exists.

**Check:** A user can tell why a relation or candidate is shown and what was not inspected. No deletion, archival or status change occurs by viewing a candidate.

## Phased integrations

### UQ-09 — What should synchronization look like? (FR-016–017; phase 2)

**Recommendation:** When implemented, present the configured registry, an explicit dry run and sync outcome, including partial failures and ownership conflicts. Explain which fields can be shared and that local paths and credentials are excluded. Distinguish shared-only projects from local checkouts. Do not imply automatic synchronization or editable conflict resolution.

**Check:** A dry-run preview accurately reflects the supported export allowlist; a failed or partial sync remains identifiable and does not appear as complete success. Exact preview and conflict details depend on the confirmed API.

### UQ-10 — What should remote discovery look like? (FR-018–019; phase 3)

**Recommendation:** When supported, expose configured provider scopes, explicit discovery and outcomes, and identify remote observations and revisions separately from local ones. Authentication, rate limits and incomplete discovery need actionable messages. Do not present authentication failure as an empty result or imply that discovery clones repositories.

**Check:** Authentication failure, partial enumeration and zero repositories have different presentations; local data remains usable if the remote integration fails.

## Trust, accessibility and dependency ownership

### UQ-11 — How does the UI protect local information? (DOR-004, NFR-017, NFR-020)

**Recommendation:** Treat repository and provider content as data, avoid exposing credentials or local-only fields in share/export workflows, and present only operations permitted by the backend contract. Any local path displayed or copied must respect the configured exposure policy. Treat links and rendered report content as untrusted.

**Check:** Security tests cover unsafe content, redaction and exported-field boundaries; a mockup shows representative privacy and permission states.

### UQ-12 — How are Astra and Prati used?

**Recommendation:** Compose screens from Prati public components and semantic theme/localization APIs. Use Astra's public MVVM, state, response and Electron IPC capabilities. Product-specific models, screens, repository methods and integration wiring belong here. Shared architecture/state issues belong in Astra; shared component/design-system issues belong in Prati. Fix those dependencies rather than replacing them with a local workaround.

**Check:** Verify installed public exports and provider nesting, test the relevant dependency contract and the consuming UI. The current dependency installation and app launch are not verified.

### UQ-13 — What must every screen prove?

**Recommendation:** Review keyboard navigation, visible focus, accessible names, contrast, light/dark themes, localization-ready text, resizing, zoom and reduced motion. Test realistic long names and large result sets. Use Prati components and tokens but verify the composed experience; library use alone does not prove accessibility.

**Check:** Record actual manual and automated results for representative populated, empty, loading, partial and error states. Confirm minimum window size and supported zoom with the owner.

## Proposed initial mockup slice

Recommend an end-to-end **local workspace discovery and project exploration** story: an unconfigured or never-scanned start, an overview showing a sample scan result, searchable projects, and a selected project's details with evidence and limitations. Include no-results, unavailable and partial-scan variants. Clearly label all sample data and nonfunctional controls. This slice tests the shared product concepts while leaving final navigation and visual identity open.

The owner has not yet confirmed this slice, first-screen priority, exact actions, editing policy, supported languages, or backend transport. Phase 2 and 3 interfaces can be explored later without claiming the corresponding integration is implemented.

## Decision and verification follow-up

Convert accepted recommendations into frontend requirements and observable scenarios, link them to shared FR/NFR IDs and design knowledge, and create OpenSpec changes for implementation. Verify contracts before promising data or actions. Document unresolved backend decisions instead of treating their recommendations as settled.
