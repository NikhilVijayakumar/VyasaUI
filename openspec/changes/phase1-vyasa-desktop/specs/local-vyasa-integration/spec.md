## ADDED Requirements

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
