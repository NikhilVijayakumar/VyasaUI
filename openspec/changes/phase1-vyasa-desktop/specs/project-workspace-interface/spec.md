## ADDED Requirements

### Requirement: Browse project data
The application SHALL allow users to browse supported projects and open their details, preserving unknown, inaccessible and stale states.

#### Scenario: Select a project
- **WHEN** the user selects an indexed project
- **THEN** the application displays available backend observations and their provenance

### Requirement: Use the established frontend libraries
The application SHALL use Astra public state and IPC capabilities and Prati public providers and components for their respective shared responsibilities.

#### Scenario: Project results load
- **WHEN** a supported project query completes
- **THEN** the renderer presents the result through the application's Astra and Prati integration
