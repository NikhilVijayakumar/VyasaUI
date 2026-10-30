# Tasks

## 1. Backend contract

- [x] 1.1 Specify and implement a versioned CLI interface for indexed status, project search and detail in Vyasa; verify with isolated backend contract tests.
- [x] 1.2 Specify scan scope, version discovery and safe data configuration in Vyasa; verify success, unsupported scope and failures in backend tests.
- [x] 1.3 Build and deploy the verified backend to the installed distribution while preserving its data; verify executable version and read-only query against the installed index.

## 2. Desktop integration

- [x] 2.1 Implement a narrow validated Electron preload/main boundary for backend discovery and read-only queries; verify failure and injection handling.
- [x] 2.2 Implement supported explicit scanning and report partial/failure outcomes; verify against isolated backend fixtures.
- [x] 2.3 Build workspace and technology browsing and project evidence views using Astra and Prati; verify populated, empty, inaccessible and error states.
- [x] 2.4 Implement supported phase-one review and project details without inventing backend capabilities; verify ownership, provenance and accessibility.

## 3. Integration

- [x] 3.1 Build and exercise the Electron app against the installed backend using read-only queries; verify startup, accessibility and real data.

## 4. Workspace browsing slice

- [x] 4.1 List configured roots and filter indexed search in the backend before pagination.
- [x] 4.2 Scan one configured root without reconciling unrelated roots; test with isolated data.
- [x] 4.3 Connect workspace selection and explicit all-or-one workspace scanning to Electron and exercise the deployed backend with isolated data.
- [x] 4.4 Select a backend-supported technology and browse matching projects across workspaces.
- [x] 4.5 Assign and display human-managed local workspace names without changing roots or starting a scan.
- [x] 4.6 Add project-scoped scanning when its backend contract is available.

## 5. Project context slice

- [x] 5.1 Expose the existing indexed profile-context CLI query through the validated Electron boundary.
- [x] 5.2 Display the selected project's profile context, source and workflow; prevent another project's report, dependency or context payload from being presented as the current project.
- [x] 5.3 Verify delayed and out-of-order project responses, keyboard navigation and accessibility across all project detail tabs.
