# local-vyasa-integration Specification

## Purpose
Connect the desktop app to the local Vyasa backend for indexed reads and explicit scans.

## Requirements

### Requirement: Connect to the local Vyasa backend
The application SHALL use a documented local backend interface and report when the configured installation or index is unavailable.

#### Scenario: Backend unavailable
- **WHEN** the configured executable or index cannot be accessed
- **THEN** the user sees an actionable unavailable state without fabricated project data

### Requirement: Read indexed information
The application SHALL retrieve project and index information from Vyasa without triggering a scan.

#### Scenario: Open project results
- **WHEN** the user browses indexed projects
- **THEN** the application displays data from the backend and preserves its freshness and evidence status

### Requirement: Execute scans explicitly
The application SHALL offer only scan scopes supported by the backend and clearly report success, partial completion and failure.

#### Scenario: User initiates a supported scan
- **WHEN** the user confirms a supported scan
- **THEN** the application starts the backend operation and reports its outcome

#### Scenario: Scan one workspace
- **WHEN** the user selects a configured workspace and confirms a scan
- **THEN** only that workspace is scanned and the outcome is displayed

#### Scenario: Scan one project
- **WHEN** the user confirms a project scan from project details
- **THEN** only that project's supported checkouts are scanned and unrelated projects are not marked missing
